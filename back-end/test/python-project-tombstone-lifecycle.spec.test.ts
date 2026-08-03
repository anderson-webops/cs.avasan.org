import { Types } from "mongoose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	acquireVerifiedLease: vi.fn(),
	projectDeleteMany: vi.fn(),
	projectDistinct: vi.fn(),
	projectDropIndex: vi.fn(),
	projectListIndexes: vi.fn(),
	projectSyncIndexes: vi.fn(),
	projectUpdateMany: vi.fn(),
	reviewDeleteMany: vi.fn(),
	reviewDistinct: vi.fn(),
	reviewDropIndex: vi.fn(),
	reviewListIndexes: vi.fn(),
	reviewSyncIndexes: vi.fn(),
	reviewUpdateMany: vi.fn(),
	studentFindById: vi.fn()
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		collection: {
			dropIndex: modelMocks.projectDropIndex,
			listIndexes: modelMocks.projectListIndexes
		},
		deleteMany: modelMocks.projectDeleteMany,
		distinct: modelMocks.projectDistinct,
		syncIndexes: modelMocks.projectSyncIndexes,
		updateMany: modelMocks.projectUpdateMany
	}
}));

vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		collection: {
			dropIndex: modelMocks.reviewDropIndex,
			listIndexes: modelMocks.reviewListIndexes
		},
		deleteMany: modelMocks.reviewDeleteMany,
		distinct: modelMocks.reviewDistinct,
		syncIndexes: modelMocks.reviewSyncIndexes,
		updateMany: modelMocks.reviewUpdateMany
	}
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		findById: modelMocks.studentFindById
	}
}));

vi.mock("../src/security/studentRecordMutationBarrier.js", () => ({
	acquireVerifiedStudentRecordMutationLease: modelMocks.acquireVerifiedLease
}));

const {
	enforcePythonProjectTombstoneLifecycle,
	preparePythonProjectTombstoneLifecycle,
	pythonProjectTombstonePurgeAt,
	resumePythonProjectTombstonePurge,
	startPythonProjectTombstoneReconciler,
	suspendPythonProjectTombstonePurge
} = await import("../src/services/pythonProjectTombstoneLifecycle.js");

function queryWith<T>(value: T) {
	const query = {
		exec: vi.fn().mockResolvedValue(value),
		lean: vi.fn(() => query),
		select: vi.fn(() => query)
	};
	return query;
}

function rejectedQuery(error: unknown) {
	const query = {
		exec: vi.fn().mockRejectedValue(error),
		lean: vi.fn(() => query),
		select: vi.fn(() => query)
	};
	return query;
}

function writeResult(overrides: Record<string, unknown> = {}) {
	return {
		acknowledged: true,
		deletedCount: 0,
		modifiedCount: 0,
		...overrides
	};
}

function deferred<T>() {
	let resolveValue: (value: T) => void = () => undefined;
	const promise = new Promise<T>(resolve => {
		resolveValue = resolve;
	});
	return { promise, resolve: resolveValue };
}

function releasedStudent(studentID: Types.ObjectId) {
	return {
		_id: studentID,
		recordPreservationHoldActive: false
	};
}

const studentID = new Types.ObjectId();

describe("Python project tombstone lifecycle", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.projectDeleteMany.mockReturnValue(queryWith(writeResult()));
		modelMocks.projectDistinct.mockReturnValue(queryWith([studentID]));
		modelMocks.projectDropIndex.mockResolvedValue(undefined);
		modelMocks.projectListIndexes.mockReturnValue({
			toArray: vi.fn().mockResolvedValue([])
		});
		modelMocks.projectSyncIndexes.mockResolvedValue([]);
		modelMocks.projectUpdateMany.mockReturnValue(queryWith(writeResult()));
		modelMocks.reviewDeleteMany.mockReturnValue(queryWith(writeResult()));
		modelMocks.reviewDistinct.mockReturnValue(queryWith([studentID]));
		modelMocks.reviewDropIndex.mockResolvedValue(undefined);
		modelMocks.reviewListIndexes.mockReturnValue({
			toArray: vi.fn().mockResolvedValue([])
		});
		modelMocks.reviewSyncIndexes.mockResolvedValue([]);
		modelMocks.reviewUpdateMany.mockReturnValue(queryWith(writeResult()));
		modelMocks.studentFindById.mockReturnValue(
			queryWith(releasedStudent(studentID))
		);
		modelMocks.acquireVerifiedLease.mockResolvedValue(vi.fn());
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("schedules a full one-hour logical grace period", () => {
		const anchor = new Date("2026-08-02T12:00:00.000Z");
		expect(pythonProjectTombstonePurgeAt(anchor)).toEqual(
			new Date("2026-08-02T13:00:00.000Z")
		);
		expect(() => pythonProjectTombstonePurgeAt(new Date("invalid")))
			.toThrow("valid tombstone purge anchor");
	});

	it("waits for both collections to settle before reporting suspension failure", async () => {
		const lateReview = deferred<ReturnType<typeof writeResult>>();
		modelMocks.projectUpdateMany.mockReturnValueOnce(
			rejectedQuery(new Error("project update failed"))
		);
		modelMocks.reviewUpdateMany.mockReturnValueOnce({
			exec: vi.fn(() => lateReview.promise)
		});

		const suspension = suspendPythonProjectTombstonePurge(
			studentID.toHexString()
		);
		let settled = false;
		suspension.catch(() => undefined).finally(() => {
			settled = true;
		});
		await Promise.resolve();
		expect(settled).toBe(false);

		lateReview.resolve(writeResult());
		await expect(suspension).rejects.toThrow(
			"project and review tombstones were not updated together"
		);
	});

	it("resumes only unscheduled tombstones and cannot backdate an existing deadline", async () => {
		const releasedAt = new Date("2026-08-02T14:00:00.000Z");
		await resumePythonProjectTombstonePurge(
			studentID.toHexString(),
			releasedAt
		);

		for (const updateMock of [
			modelMocks.projectUpdateMany,
			modelMocks.reviewUpdateMany
		]) {
			expect(updateMock).toHaveBeenCalledWith(
				expect.objectContaining({
					deletedAt: { $type: "date" },
					purgeAt: { $exists: false },
					user: studentID.toHexString()
				}),
				{
					$set: {
						purgeAt: new Date("2026-08-02T15:00:00.000Z")
					}
				}
			);
		}
	});

	it("serializes reconciliation and due purging under a positive unheld student lease", async () => {
		const now = new Date("2026-08-02T16:00:00.000Z");
		const releaseLease = vi.fn();
		modelMocks.acquireVerifiedLease.mockResolvedValueOnce(releaseLease);
		modelMocks.projectUpdateMany
			.mockReturnValueOnce(queryWith(writeResult({ modifiedCount: 1 })))
			.mockReturnValueOnce(queryWith(writeResult({ modifiedCount: 2 })));
		modelMocks.reviewUpdateMany
			.mockReturnValueOnce(queryWith(writeResult({ modifiedCount: 3 })))
			.mockReturnValueOnce(queryWith(writeResult({ modifiedCount: 4 })));
		modelMocks.reviewDeleteMany.mockReturnValueOnce(
			queryWith(writeResult({ deletedCount: 2 }))
		);
		modelMocks.projectDeleteMany.mockReturnValueOnce(
			queryWith(writeResult({ deletedCount: 1 }))
		);

		await expect(enforcePythonProjectTombstoneLifecycle(now)).resolves.toEqual({
			held: 0,
			purgedProjects: 1,
			purgedReviews: 2,
			reconciled: 1,
			scheduled: 6,
			suspended: 4
		});
		expect(modelMocks.acquireVerifiedLease).toHaveBeenCalledWith(
			studentID.toHexString()
		);
		expect(modelMocks.studentFindById.mock.invocationCallOrder[0])
			.toBeGreaterThan(modelMocks.acquireVerifiedLease.mock.invocationCallOrder[0] ?? 0);
		expect(modelMocks.reviewDeleteMany).toHaveBeenCalledWith({
			deletedAt: { $type: "date" },
			purgeAt: { $lte: now, $type: "date" },
			user: studentID
		});
		expect(modelMocks.projectDeleteMany).toHaveBeenCalledWith({
			deletedAt: { $type: "date" },
			purgeAt: { $lte: now, $type: "date" },
			user: studentID
		});
		expect(releaseLease).toHaveBeenCalledOnce();
	});

	it("suspends missing or held student tombstones instead of purging them", async () => {
		const releaseLease = vi.fn();
		modelMocks.acquireVerifiedLease.mockResolvedValueOnce(releaseLease);
		modelMocks.studentFindById.mockReturnValueOnce(queryWith(null));
		modelMocks.projectUpdateMany.mockReturnValueOnce(
			queryWith(writeResult({ modifiedCount: 1 }))
		);
		modelMocks.reviewUpdateMany.mockReturnValueOnce(
			queryWith(writeResult({ modifiedCount: 1 }))
		);

		await expect(enforcePythonProjectTombstoneLifecycle()).resolves.toMatchObject({
			held: 1,
			purgedProjects: 0,
			purgedReviews: 0
		});
		expect(modelMocks.projectDeleteMany).not.toHaveBeenCalled();
		expect(modelMocks.reviewDeleteMany).not.toHaveBeenCalled();
		expect(releaseLease).toHaveBeenCalledOnce();
	});

	it("protects an overdue tombstone during a durable hold and starts a fresh grace period after release", async () => {
		const originalDeadline = new Date("2026-08-02T12:00:00.000Z");
		const holdSweepAt = new Date("2026-08-02T14:00:00.000Z");
		const releasedAt = new Date("2026-08-02T14:15:00.000Z");
		const freshDeadline = new Date("2026-08-02T15:15:00.000Z");
		const justBeforeFreshDeadline = new Date("2026-08-02T15:14:59.999Z");
		let held = true;
		const states: Array<{
			deleted: boolean;
			deletedAt: Date;
			purgeAt: Date | undefined;
		}> = [
			{
				deleted: false,
				deletedAt: new Date("2026-08-02T11:00:00.000Z"),
				purgeAt: originalDeadline
			},
			{
				deleted: false,
				deletedAt: new Date("2026-08-02T11:00:00.000Z"),
				purgeAt: originalDeadline
			}
		];

		modelMocks.acquireVerifiedLease.mockImplementation(async () =>
			held ? null : vi.fn()
		);
		modelMocks.studentFindById.mockImplementation(() =>
			queryWith({
				_id: studentID,
				recordPreservationHoldActive: held
			})
		);

		for (const [index, updateMock] of [
			modelMocks.projectUpdateMany,
			modelMocks.reviewUpdateMany
		].entries()) {
			updateMock.mockImplementation((filter, update) => {
				const state = states[index];
				let modifiedCount = 0;
				if (
					filter.purgeAt
					&& (filter.purgeAt as { $exists?: boolean }).$exists === true
					&& !(filter.deletedAt as { $not?: unknown } | undefined)?.$not
					&& update.$unset
					&& state.purgeAt
				) {
					state.purgeAt = undefined;
					modifiedCount = 1;
				}
				if (
					filter.purgeAt
					&& (filter.purgeAt as { $exists?: boolean }).$exists === false
					&& update.$set
					&& !state.purgeAt
				) {
					state.purgeAt = (update.$set as { purgeAt: Date }).purgeAt;
					modifiedCount = 1;
				}
				return queryWith(writeResult({ modifiedCount }));
			});
		}

		for (const [index, deleteMock] of [
			modelMocks.projectDeleteMany,
			modelMocks.reviewDeleteMany
		].entries()) {
			deleteMock.mockImplementation((filter) => {
				const state = states[index];
				const dueAt = (filter.purgeAt as { $lte: Date }).$lte;
				const shouldDelete = Boolean(
					!state.deleted
					&& state.purgeAt
					&& state.purgeAt <= dueAt
				);
				if (shouldDelete) state.deleted = true;
				return queryWith(writeResult({ deletedCount: shouldDelete ? 1 : 0 }));
			});
		}

		await expect(
			enforcePythonProjectTombstoneLifecycle(holdSweepAt)
		).resolves.toMatchObject({
			held: 1,
			purgedProjects: 0,
			purgedReviews: 0
		});
		expect(states).toEqual([
			expect.objectContaining({ deleted: false, purgeAt: undefined }),
			expect.objectContaining({ deleted: false, purgeAt: undefined })
		]);

		held = false;
		await resumePythonProjectTombstonePurge(
			studentID.toHexString(),
			releasedAt
		);
		expect(states).toEqual([
			expect.objectContaining({ deleted: false, purgeAt: freshDeadline }),
			expect.objectContaining({ deleted: false, purgeAt: freshDeadline })
		]);

		await expect(
			enforcePythonProjectTombstoneLifecycle(justBeforeFreshDeadline)
		).resolves.toMatchObject({
			purgedProjects: 0,
			purgedReviews: 0
		});
		expect(states.every(state => !state.deleted)).toBe(true);

		await expect(
			enforcePythonProjectTombstoneLifecycle(freshDeadline)
		).resolves.toMatchObject({
			purgedProjects: 1,
			purgedReviews: 1
		});
		expect(states.every(state => state.deleted)).toBe(true);
	});

	it("does not erase a release transition's restored schedule when its gate is closed", async () => {
		modelMocks.acquireVerifiedLease.mockResolvedValueOnce(null);

		await expect(enforcePythonProjectTombstoneLifecycle()).resolves.toMatchObject({
			held: 1,
			purgedProjects: 0,
			purgedReviews: 0
		});
		expect(modelMocks.projectUpdateMany).not.toHaveBeenCalled();
		expect(modelMocks.reviewUpdateMany).not.toHaveBeenCalled();
		expect(modelMocks.projectDeleteMany).not.toHaveBeenCalled();
		expect(modelMocks.reviewDeleteMany).not.toHaveBeenCalled();
	});

	it("fails closed on an ambiguous durable lookup and still releases its lease", async () => {
		const releaseLease = vi.fn();
		modelMocks.acquireVerifiedLease.mockResolvedValueOnce(releaseLease);
		modelMocks.studentFindById.mockReturnValueOnce(
			rejectedQuery(new Error("hold lookup unavailable"))
		);

		await expect(enforcePythonProjectTombstoneLifecycle()).rejects.toThrow(
			"could not be fully reconciled"
		);
		expect(modelMocks.projectDeleteMany).not.toHaveBeenCalled();
		expect(modelMocks.reviewDeleteMany).not.toHaveBeenCalled();
		expect(releaseLease).toHaveBeenCalledOnce();
	});

	it("drops custom legacy TTL writers before rebuilding normal schema indexes", async () => {
		modelMocks.projectDistinct.mockReturnValue(queryWith([]));
		modelMocks.reviewDistinct.mockReturnValue(queryWith([]));
		modelMocks.projectListIndexes.mockReturnValue({
			toArray: vi.fn().mockResolvedValue([
				{ key: { _id: 1 }, name: "_id_" },
				{
					expireAfterSeconds: 3600,
					key: { deletedAt: 1 },
					name: "legacy_deleted_ttl"
				},
				{
					expireAfterSeconds: 0,
					key: { purgeAt: 1 },
					name: "unsafe_purge_ttl"
				},
				{
					expireAfterSeconds: 0,
					key: { unrelatedExpiry: 1 },
					name: "unrelated_ttl"
				}
			])
		});
		modelMocks.reviewListIndexes.mockReturnValue({
			toArray: vi.fn().mockRejectedValue(
				Object.assign(new Error("namespace missing"), { code: 26 })
			)
		});

		await expect(
			preparePythonProjectTombstoneLifecycle()
		).resolves.toMatchObject({ droppedTtlIndexes: 2 });
		expect(modelMocks.projectDropIndex.mock.calls).toEqual([
			["legacy_deleted_ttl"],
			["unsafe_purge_ttl"]
		]);
		expect(modelMocks.projectSyncIndexes).toHaveBeenCalledOnce();
		expect(modelMocks.reviewSyncIndexes).toHaveBeenCalledOnce();
	});

	it("waits for every legacy TTL removal attempt before failing startup", async () => {
		const reviewDrop = deferred<void>();
		modelMocks.projectListIndexes.mockReturnValue({
			toArray: vi.fn().mockResolvedValue([
				{
					expireAfterSeconds: 3600,
					key: { deletedAt: 1 },
					name: "project_deleted_ttl"
				}
			])
		});
		modelMocks.reviewListIndexes.mockReturnValue({
			toArray: vi.fn().mockResolvedValue([
				{
					expireAfterSeconds: 0,
					key: { purgeAt: 1 },
					name: "review_purge_ttl"
				}
			])
		});
		modelMocks.projectDropIndex.mockRejectedValueOnce(
			new Error("project index drop failed")
		);
		modelMocks.reviewDropIndex.mockReturnValueOnce(reviewDrop.promise);

		const preparation = preparePythonProjectTombstoneLifecycle();
		let settled = false;
		preparation.catch(() => undefined).finally(() => {
			settled = true;
		});
		await Promise.resolve();
		expect(settled).toBe(false);

		reviewDrop.resolve();
		await expect(preparation).rejects.toThrow(
			"Legacy project and review TTL removal did not complete safely"
		);
		expect(modelMocks.projectDropIndex).toHaveBeenCalledWith(
			"project_deleted_ttl"
		);
		expect(modelMocks.reviewDropIndex).toHaveBeenCalledWith(
			"review_purge_ttl"
		);
		expect(modelMocks.projectDistinct).not.toHaveBeenCalled();
		expect(modelMocks.reviewDistinct).not.toHaveBeenCalled();
		expect(modelMocks.projectSyncIndexes).not.toHaveBeenCalled();
		expect(modelMocks.reviewSyncIndexes).not.toHaveBeenCalled();
	});

	it("prevents overlapping periodic sweeps and waits for the active sweep on stop", async () => {
		vi.useFakeTimers();
		const active = deferred<ReturnType<typeof writeResult>>();
		const runReconciliation = vi.fn(() => active.promise.then(() => ({
			held: 0,
			purgedProjects: 0,
			purgedReviews: 0,
			reconciled: 0,
			scheduled: 0,
			suspended: 0
		})));
		const stop = startPythonProjectTombstoneReconciler(runReconciliation);

		await vi.advanceTimersByTimeAsync(15 * 60 * 1000);
		expect(runReconciliation).toHaveBeenCalledOnce();
		await vi.advanceTimersByTimeAsync(15 * 60 * 1000);
		expect(runReconciliation).toHaveBeenCalledOnce();

		let stopped = false;
		const stopping = stop().then(() => {
			stopped = true;
		});
		await Promise.resolve();
		expect(stopped).toBe(false);
		active.resolve(writeResult());
		await stopping;
		expect(stopped).toBe(true);
	});
});
