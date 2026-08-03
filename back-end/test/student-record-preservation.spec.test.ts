import { Types } from "mongoose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	resumePythonProjectTombstonePurge: vi.fn(),
	studentExists: vi.fn(),
	studentFindById: vi.fn(),
	studentFindOneAndUpdate: vi.fn(),
	suspendPythonProjectTombstonePurge: vi.fn()
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		exists: modelMocks.studentExists,
		findById: modelMocks.studentFindById,
		findOneAndUpdate: modelMocks.studentFindOneAndUpdate
	}
}));

vi.mock("../src/services/pythonProjectTombstoneLifecycle.js", () => ({
	resumePythonProjectTombstonePurge:
		modelMocks.resumePythonProjectTombstonePurge,
	suspendPythonProjectTombstonePurge:
		modelMocks.suspendPythonProjectTombstonePurge
}));

const {
	setStudentRecordPreservationHold,
	STUDENT_RECORD_PRESERVATION_EVENT_LIMIT
} = await import("../src/services/studentRecordPreservation.js");
const {
	acquireStudentRecordMutationLease,
	acquireVerifiedStudentRecordMutationLease,
	holdStudentRecordMutationsAndWait,
	resetStudentRecordMutationBarriersForTests
} = await import("../src/security/studentRecordMutationBarrier.js");
const {
	acquireStudentDataWriteLease,
	closeStudentDataWritesAndWait,
	reopenStudentDataLeaseGateForPreservation,
	resetStudentDataWriteBarriersForTests
} = await import("../src/security/studentDataWriteBarrier.js");

function queryWith<T>(value: T) {
	const query = {
		select: vi.fn(() => query),
		then: (
			resolve: (result: T) => unknown,
			reject: (reason: unknown) => unknown
		) => Promise.resolve(value).then(resolve, reject)
	};
	return query;
}

function deferredQuery<T>() {
	let resolveValue: (value: T) => void = () => undefined;
	const promise = new Promise<T>(resolve => {
		resolveValue = resolve;
	});
	const query = {
		select: vi.fn(() => query),
		then: (
			resolve: (result: T) => unknown,
			reject: (reason: unknown) => unknown
		) => promise.then(resolve, reject)
	};
	return { query, resolve: resolveValue };
}

function deferredPromise() {
	let resolveValue: () => void = () => undefined;
	const promise = new Promise<void>(resolve => {
		resolveValue = resolve;
	});
	return { promise, resolve: resolveValue };
}

function rejectedQuery(error: unknown) {
	const query = {
		select: vi.fn(() => query),
		then: (
			resolve: (result: never) => unknown,
			reject: (reason: unknown) => unknown
		) => Promise.reject(error).then(resolve, reject)
	};
	return query;
}

async function flushMicrotasks(count = 8) {
	for (let index = 0; index < count; index += 1) {
		await Promise.resolve();
	}
}

function studentRecord(overrides: Record<string, unknown> = {}) {
	return {
		_id: new Types.ObjectId(),
		active: true,
		createdAt: new Date("2026-08-02T12:00:00.000Z"),
		failedLoginAttempts: 0,
		recordPreservationEvents: [],
		sessionVersion: 1,
		updatedAt: new Date("2026-08-02T12:00:00.000Z"),
		username: "river-7",
		...overrides
	};
}

describe("student record preservation transitions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetStudentDataWriteBarriersForTests();
		resetStudentRecordMutationBarriersForTests();
		modelMocks.studentExists.mockReturnValue(queryWith(null));
		modelMocks.resumePythonProjectTombstonePurge.mockResolvedValue(undefined);
		modelMocks.suspendPythonProjectTombstonePurge.mockResolvedValue(undefined);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("stores only fixed placed/released events and caps the trail", async () => {
		const studentID = new Types.ObjectId().toString();
		const placedAt = new Date("2026-08-02T13:00:00.000Z");
		const releasedAt = new Date("2026-08-02T14:00:00.000Z");
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(
				queryWith(studentRecord({
					recordPreservationHoldActive: true,
					recordPreservationHoldPlacedAt: placedAt
				}))
			)
			.mockReturnValueOnce(
				queryWith(studentRecord({
					recordPreservationHoldActive: false,
					recordPreservationHoldReleasedAt: releasedAt
				}))
			);

		await expect(
			setStudentRecordPreservationHold(studentID, true, placedAt)
		).resolves.toMatchObject({ state: "updated" });
		await expect(
			setStudentRecordPreservationHold(studentID, false, releasedAt)
		).resolves.toMatchObject({ state: "updated" });

		expect(STUDENT_RECORD_PRESERVATION_EVENT_LIMIT).toBe(32);
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				_id: studentID,
				recordPreservationHoldActive: { $ne: true }
			}),
			expect.objectContaining({
				$push: {
					recordPreservationEvents: {
						$each: [{ action: "placed", at: placedAt }],
						$slice: -32
					}
				}
			}),
			{ new: true }
		);
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				_id: studentID,
				recordPreservationHoldActive: true
			}),
			expect.objectContaining({
				$push: {
					recordPreservationEvents: {
						$each: [{ action: "released", at: releasedAt }],
						$slice: -32
					}
				}
			}),
			{ new: true }
		);
		expect(modelMocks.suspendPythonProjectTombstonePurge)
			.toHaveBeenCalledWith(studentID);
		expect(modelMocks.resumePythonProjectTombstonePurge)
			.toHaveBeenCalledWith(studentID, releasedAt);
	});

	it("suspends app-owned tombstone cleanup before it durably places a hold", async () => {
		const studentID = new Types.ObjectId().toString();
		const placedAt = new Date("2026-08-02T13:00:00.000Z");
		const suspension = deferredPromise();
		modelMocks.suspendPythonProjectTombstonePurge.mockReturnValueOnce(
			suspension.promise
		);
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			queryWith(studentRecord({
				recordPreservationHoldActive: true,
				recordPreservationHoldPlacedAt: placedAt
			}))
		);

		const placement = setStudentRecordPreservationHold(
			studentID,
			true,
			placedAt
		);
		await flushMicrotasks();
		expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();

		suspension.resolve();
		await expect(placement).resolves.toMatchObject({ state: "updated" });
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledOnce();
	});

	it("keeps the mutation gate closed when purge scheduling cannot be restored", async () => {
		const studentID = new Types.ObjectId().toString();
		const releasedAt = new Date("2026-08-02T14:00:00.000Z");
		await holdStudentRecordMutationsAndWait(studentID);
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			queryWith(studentRecord({
				recordPreservationHoldActive: false,
				recordPreservationHoldReleasedAt: releasedAt
			}))
		);
		modelMocks.studentFindById.mockReturnValueOnce(
			queryWith(studentRecord({
				recordPreservationHoldActive: false,
				recordPreservationHoldReleasedAt: releasedAt
			}))
		);
		modelMocks.resumePythonProjectTombstonePurge.mockRejectedValue(
			new Error("purge scheduling unavailable")
		);

		await expect(
			setStudentRecordPreservationHold(studentID, false, releasedAt)
		).rejects.toThrow("purge scheduling unavailable");
		expect(acquireStudentRecordMutationLease(studentID)).toBeNull();
	});

	it("preserves partial-deletion remnants and recloses deletion on release", async () => {
		const studentID = new Types.ObjectId().toString();
		const pendingAt = new Date("2026-08-02T12:30:00.000Z");
		const placedAt = new Date("2026-08-02T13:00:00.000Z");
		const releasedAt = new Date("2026-08-02T14:00:00.000Z");
		await closeStudentDataWritesAndWait(studentID);
		expect(acquireStudentDataWriteLease(studentID)).toBeNull();
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(
				queryWith(studentRecord({
					dataDeletionPendingAt: pendingAt,
					recordPreservationHoldActive: true,
					recordPreservationHoldPlacedAt: placedAt
				}))
			)
			.mockReturnValueOnce(
				queryWith(studentRecord({
					dataDeletionPendingAt: pendingAt,
					recordPreservationHoldActive: false,
					recordPreservationHoldReleasedAt: releasedAt
				}))
			);

		await expect(
			setStudentRecordPreservationHold(studentID, true, placedAt)
		).resolves.toMatchObject({ state: "updated" });
		expect(
			modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[0]
		).not.toHaveProperty("dataDeletionPendingAt");
		const inspectionLease = acquireStudentDataWriteLease(studentID);
		expect(inspectionLease).toBeTypeOf("function");

		let releaseFinished = false;
		const releaseTransition = setStudentRecordPreservationHold(
			studentID,
			false,
			releasedAt
		).then(result => {
			releaseFinished = true;
			return result;
		});
		await vi.waitFor(() => {
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledTimes(2);
		});
		expect(releaseFinished).toBe(false);
		expect(acquireStudentDataWriteLease(studentID)).toBeNull();
		inspectionLease?.();
		await expect(releaseTransition).resolves.toMatchObject({ state: "updated" });
		expect(
			modelMocks.studentFindOneAndUpdate.mock.calls[1]?.[0]
		).not.toHaveProperty("dataDeletionPendingAt");
		expect(acquireStudentDataWriteLease(studentID)).toBeNull();
	});

	it("timestamps a placement only after earlier protected mutations drain", async () => {
		const studentID = new Types.ObjectId().toString();
		const requestAt = new Date("2026-08-02T14:45:00.000Z");
		const drainedAt = new Date("2026-08-02T15:00:00.000Z");
		vi.useFakeTimers();
		vi.setSystemTime(requestAt);
		const earlierMutation = acquireStudentRecordMutationLease(studentID);
		expect(earlierMutation).toBeTypeOf("function");
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			queryWith(studentRecord({
				recordPreservationHoldActive: true,
				recordPreservationHoldPlacedAt: drainedAt
			}))
		);

		const placement = setStudentRecordPreservationHold(studentID, true);
		await flushMicrotasks();
		expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
		vi.setSystemTime(drainedAt);
		earlierMutation?.();

		await expect(placement).resolves.toMatchObject({ state: "updated" });
		expect(
			modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1]
				.$push.recordPreservationEvents.$each[0].at
		).toEqual(drainedAt);
	});

	it("serializes release behind placement and timestamps it after the wait", async () => {
		const studentID = new Types.ObjectId().toString();
		const placedAt = new Date("2026-08-02T15:00:00.000Z");
		const releasedAt = new Date("2026-08-02T16:00:00.000Z");
		vi.useFakeTimers();
		vi.setSystemTime(placedAt);
		const placementWrite = deferredQuery<ReturnType<typeof studentRecord>>();
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(placementWrite.query)
			.mockReturnValueOnce(
				queryWith(studentRecord({
					recordPreservationHoldActive: false,
					recordPreservationHoldReleasedAt: releasedAt
				}))
			);

		const placement = setStudentRecordPreservationHold(studentID, true);
		await flushMicrotasks();
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledOnce();
		const release = setStudentRecordPreservationHold(studentID, false);
		vi.setSystemTime(releasedAt);
		await flushMicrotasks();
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledOnce();

		placementWrite.resolve(studentRecord({
			recordPreservationHoldActive: true,
			recordPreservationHoldPlacedAt: placedAt
		}));
		await expect(placement).resolves.toMatchObject({ state: "updated" });
		await expect(release).resolves.toMatchObject({ state: "updated" });

		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledTimes(2);
		expect(
			modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1]
				.$push.recordPreservationEvents.$each[0].at
		).toEqual(placedAt);
		expect(
			modelMocks.studentFindOneAndUpdate.mock.calls[1]?.[1]
				.$push.recordPreservationEvents.$each[0].at
		).toEqual(releasedAt);
		const afterRelease = acquireStudentRecordMutationLease(studentID);
		expect(afterRelease).toBeTypeOf("function");
		afterRelease?.();
	});

	it("serializes placement behind an in-flight release", async () => {
		const studentID = new Types.ObjectId().toString();
		const releasedAt = new Date("2026-08-02T16:00:00.000Z");
		const placedAt = new Date("2026-08-02T17:00:00.000Z");
		const releaseWrite = deferredQuery<ReturnType<typeof studentRecord>>();
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(releaseWrite.query)
			.mockReturnValueOnce(
				queryWith(studentRecord({
					recordPreservationHoldActive: true,
					recordPreservationHoldPlacedAt: placedAt
				}))
			);

		const release = setStudentRecordPreservationHold(
			studentID,
			false,
			releasedAt
		);
		await vi.waitFor(() => {
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledOnce();
		});
		const placement = setStudentRecordPreservationHold(
			studentID,
			true,
			placedAt
		);
		await Promise.resolve();
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledOnce();

		releaseWrite.resolve(studentRecord({
			recordPreservationHoldActive: false,
			recordPreservationHoldReleasedAt: releasedAt
		}));
		await expect(release).resolves.toMatchObject({ state: "updated" });
		await expect(placement).resolves.toMatchObject({ state: "updated" });

		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledTimes(2);
		expect(acquireStudentRecordMutationLease(studentID)).toBeNull();
	});

	it("releases transition ownership while an uncertain write stays fail-closed", async () => {
		const studentID = new Types.ObjectId().toString();
		const databaseError = new Error("database unavailable");
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			rejectedQuery(databaseError)
		);
		modelMocks.studentFindById.mockReturnValueOnce(
			rejectedQuery(databaseError)
		);

		await expect(
			setStudentRecordPreservationHold(studentID, true)
		).rejects.toThrow("database unavailable");
		expect(acquireStudentRecordMutationLease(studentID)).toBeNull();

		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			queryWith(studentRecord({ recordPreservationHoldActive: false }))
		);
		await expect(
			setStudentRecordPreservationHold(studentID, false)
		).resolves.toMatchObject({ state: "updated" });
		const afterRecovery = acquireStudentRecordMutationLease(studentID);
		expect(afterRecovery).toBeTypeOf("function");
		afterRecovery?.();
	});

	it("reopens mutation writes when a failed placement rereads as released", async () => {
		const studentID = new Types.ObjectId().toString();
		const databaseError = new Error("placement response failed");
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			rejectedQuery(databaseError)
		);
		modelMocks.studentFindById.mockReturnValueOnce(
			queryWith(studentRecord({ recordPreservationHoldActive: false }))
		);

		await expect(
			setStudentRecordPreservationHold(studentID, true)
		).rejects.toThrow("placement response failed");
		const afterConfirmedRelease = acquireStudentRecordMutationLease(studentID);
		expect(afterConfirmedRelease).toBeTypeOf("function");
		afterConfirmedRelease?.();
	});

	it("restores pending-record export when a failed placement rereads as held", async () => {
		const studentID = new Types.ObjectId().toString();
		const pendingAt = new Date("2026-08-02T14:30:00.000Z");
		const databaseError = new Error("placement response failed");
		await closeStudentDataWritesAndWait(studentID);
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			rejectedQuery(databaseError)
		);
		modelMocks.studentFindById.mockReturnValueOnce(
			queryWith(studentRecord({
				dataDeletionPendingAt: pendingAt,
				recordPreservationHoldActive: true
			}))
		);

		await expect(
			setStudentRecordPreservationHold(studentID, true)
		).rejects.toThrow("placement response failed");
		expect(acquireStudentRecordMutationLease(studentID)).toBeNull();
		const exportLease = acquireStudentDataWriteLease(studentID);
		expect(exportLease).toBeTypeOf("function");
		exportLease?.();
	});

	it("keeps a failed release held when the durable reread is still active", async () => {
		const studentID = new Types.ObjectId().toString();
		const pendingAt = new Date("2026-08-02T14:30:00.000Z");
		const databaseError = new Error("release response failed");
		await holdStudentRecordMutationsAndWait(studentID);
		reopenStudentDataLeaseGateForPreservation(studentID);
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			rejectedQuery(databaseError)
		);
		modelMocks.studentFindById.mockReturnValueOnce(
			queryWith(studentRecord({
				dataDeletionPendingAt: pendingAt,
				recordPreservationHoldActive: true
			}))
		);

		await expect(
			setStudentRecordPreservationHold(studentID, false)
		).rejects.toThrow("release response failed");
		expect(acquireStudentRecordMutationLease(studentID)).toBeNull();
		const exportLease = acquireStudentDataWriteLease(studentID);
		expect(exportLease).toBeTypeOf("function");
		exportLease?.();
	});

	it("keeps a failed release closed when its durable reread also fails", async () => {
		const studentID = new Types.ObjectId().toString();
		const databaseError = new Error("database unavailable");
		await holdStudentRecordMutationsAndWait(studentID);
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			rejectedQuery(databaseError)
		);
		modelMocks.studentFindById.mockReturnValueOnce(
			rejectedQuery(databaseError)
		);

		await expect(
			setStudentRecordPreservationHold(studentID, false)
		).rejects.toThrow("database unavailable");
		expect(acquireStudentRecordMutationLease(studentID)).toBeNull();
	});

	it("recloses pending export before completing a failed durable release", async () => {
		const studentID = new Types.ObjectId().toString();
		const pendingAt = new Date("2026-08-02T14:30:00.000Z");
		const databaseError = new Error("release response failed");
		await holdStudentRecordMutationsAndWait(studentID);
		reopenStudentDataLeaseGateForPreservation(studentID);
		const inFlightExport = acquireStudentDataWriteLease(studentID);
		expect(inFlightExport).toBeTypeOf("function");
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			rejectedQuery(databaseError)
		);
		modelMocks.studentFindById.mockReturnValueOnce(
			queryWith(studentRecord({
				dataDeletionPendingAt: pendingAt,
				recordPreservationHoldActive: false
			}))
		);

		const releaseTransition = setStudentRecordPreservationHold(
			studentID,
			false
		);
		let releaseSettled = false;
		releaseTransition.then(
			() => { releaseSettled = true; },
			() => { releaseSettled = true; }
		);
		await vi.waitFor(() => {
			expect(modelMocks.studentFindById).toHaveBeenCalledOnce();
		});
		expect(releaseSettled).toBe(false);
		const blockedProbe = acquireStudentDataWriteLease(studentID);
		expect(blockedProbe).toBeNull();
		blockedProbe?.();

		inFlightExport?.();
		await expect(releaseTransition).rejects.toThrow("release response failed");
		const afterConfirmedRelease = acquireStudentRecordMutationLease(studentID);
		expect(afterConfirmedRelease).toBeTypeOf("function");
		afterConfirmedRelease?.();
		expect(acquireStudentDataWriteLease(studentID)).toBeNull();
	});

	it("orders a release after an in-flight durable hold check", async () => {
		const studentID = new Types.ObjectId().toString();
		const releasedAt = new Date("2026-08-02T15:00:00.000Z");
		const durableHoldCheck = deferredQuery<{ _id: string }>();
		modelMocks.studentExists.mockReturnValueOnce(durableHoldCheck.query);
		modelMocks.studentFindOneAndUpdate.mockReturnValueOnce(
			queryWith(studentRecord({
				recordPreservationHoldActive: false,
				recordPreservationHoldReleasedAt: releasedAt
			}))
		);

		const earlierMutationCheck
			= acquireVerifiedStudentRecordMutationLease(studentID);
		await vi.waitFor(() => {
			expect(modelMocks.studentExists).toHaveBeenCalledOnce();
		});

		const releaseTransition = setStudentRecordPreservationHold(
			studentID,
			false,
			releasedAt
		);
		await Promise.resolve();
		expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();

		durableHoldCheck.resolve({ _id: studentID });
		await expect(earlierMutationCheck).resolves.toBeNull();
		await expect(releaseTransition).resolves.toMatchObject({ state: "updated" });

		const afterRelease = acquireStudentRecordMutationLease(studentID);
		expect(afterRelease).toBeTypeOf("function");
		afterRelease?.();
	});
});
