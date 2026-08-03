import { Types } from "mongoose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MIN_STUDENT_RECORD_RETENTION_DAYS } from "../src/security/classroomPrivacy.js";
import { STUDENT_ABSOLUTE_SESSION_MS } from "../src/security/studentCredentials.js";
import { studentRecordRetentionExpiry } from "../src/security/studentRecordRetention.js";

const modelMocks = vi.hoisted(() => ({
	closeWrites: vi.fn(),
	oauthCountDocuments: vi.fn(),
	oauthDeleteMany: vi.fn(),
	projectCountDocuments: vi.fn(),
	projectDeleteMany: vi.fn(),
	receiptFind: vi.fn(),
	receiptFindOne: vi.fn(),
	receiptFindOneAndUpdate: vi.fn(),
	receiptUpdateOne: vi.fn(),
	reviewCountDocuments: vi.fn(),
	reviewDeleteMany: vi.fn(),
	studentDeleteOne: vi.fn(),
	studentExists: vi.fn(),
	studentFind: vi.fn(),
	studentFindOneAndUpdate: vi.fn(),
	studentUpdateMany: vi.fn()
}));

vi.mock("../src/models/schemas/OAuthLoginAttempt.js", () => ({
	OAuthLoginAttempt: {
		countDocuments: modelMocks.oauthCountDocuments,
		deleteMany: modelMocks.oauthDeleteMany
	}
}));
vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		countDocuments: modelMocks.projectCountDocuments,
		deleteMany: modelMocks.projectDeleteMany
	}
}));
vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		countDocuments: modelMocks.reviewCountDocuments,
		deleteMany: modelMocks.reviewDeleteMany
	}
}));
vi.mock("../src/models/schemas/StudentDataDeletionReceipt.js", () => ({
	STUDENT_DELETION_RECEIPT_RETENTION_DAYS: 90,
	StudentDataDeletionReceipt: {
		find: modelMocks.receiptFind,
		findOne: modelMocks.receiptFindOne,
		findOneAndUpdate: modelMocks.receiptFindOneAndUpdate,
		updateOne: modelMocks.receiptUpdateOne
	}
}));
vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		deleteOne: modelMocks.studentDeleteOne,
		exists: modelMocks.studentExists,
		find: modelMocks.studentFind,
		findOneAndUpdate: modelMocks.studentFindOneAndUpdate,
		updateMany: modelMocks.studentUpdateMany
	}
}));
vi.mock("../src/security/studentDataWriteBarrier.js", () => ({
	closeStudentDataWritesAndWait: modelMocks.closeWrites
}));

const { enforceStudentRecordRetention, startStudentRecordRetentionSweeper } =
	await import("../src/services/studentRecordRetention.js");
const {
	holdStudentRecordMutationsAndWait,
	releaseStudentRecordMutationHold,
	resetStudentRecordMutationBarriersForTests
} = await import("../src/security/studentRecordMutationBarrier.js");

function queryWith<T>(result: T) {
	const query = {
		exec: vi.fn().mockResolvedValue(result),
		lean: vi.fn(() => query),
		limit: vi.fn(() => query),
		select: vi.fn(() => query),
		sort: vi.fn(() => query),
		then: (resolve: (value: T) => unknown, reject: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(resolve, reject)
	};
	return query;
}

const studentID = new Types.ObjectId();
const now = new Date("2026-07-30T12:00:00.000Z");
const recordInventory = {
	oauthAttempts: 1,
	projects: 3,
	reviews: 2,
	students: 1
};

function deletionReceipt(overrides: Record<string, unknown> = {}) {
	return {
		_id: new Types.ObjectId(),
		completedAt: undefined,
		createdAt: now,
		operationID: "11111111-1111-4111-8111-111111111111",
		reason: "retention-expiry",
		recordInventory,
		requestedAt: now,
		status: "in-progress",
		studentID,
		updatedAt: now,
		username: "student-one",
		...overrides
	};
}

function expiredStudent(overrides: Record<string, unknown> = {}) {
	return {
		_id: studentID,
		active: true,
		createdAt: new Date("2026-04-01T12:00:00.000Z"),
		retentionExpiresAt: now,
		retentionPolicyDays: 90,
		sessionVersion: 4,
		username: "student-one",
		...overrides
	};
}

function queueFreshExpired(student = expiredStudent()) {
	modelMocks.studentFind.mockReturnValueOnce(queryWith([])).mockReturnValueOnce(queryWith([student]));
}

function queuePending(student: ReturnType<typeof expiredStudent>) {
	modelMocks.studentFind.mockReturnValueOnce(queryWith([student])).mockReturnValueOnce(queryWith([]));
}

describe("student record retention", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetStudentRecordMutationBarriersForTests();
		modelMocks.studentUpdateMany.mockReturnValue(queryWith({ modifiedCount: 0 }));
		modelMocks.studentFind.mockReturnValue(queryWith([]));
		modelMocks.studentExists.mockImplementation(filter =>
			queryWith(
				filter.recordPreservationHoldActive === true
					? null
					: { _id: studentID }
			)
		);
		modelMocks.receiptFind.mockReturnValue(queryWith([]));
		modelMocks.receiptFindOne.mockReturnValue(queryWith(null));
		modelMocks.oauthCountDocuments.mockReturnValue(queryWith(1));
		modelMocks.projectCountDocuments.mockReturnValue(queryWith(3));
		modelMocks.reviewCountDocuments.mockReturnValue(queryWith(2));
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(
				queryWith(
					expiredStudent({
						active: false,
						sessionVersion: 5
					})
				)
			)
			.mockReturnValue(
				queryWith(
					expiredStudent({
						active: false,
						sessionVersion: 6
					})
				)
			);
		modelMocks.closeWrites.mockResolvedValue(undefined);
		modelMocks.receiptFindOneAndUpdate.mockImplementation((_filter, update) =>
			queryWith(
				deletionReceipt({
					operationID: update.$setOnInsert.operationID,
					reason: update.$setOnInsert.reason,
					recordInventory: update.$set.recordInventory,
					requestedAt: update.$setOnInsert.requestedAt,
					studentID: update.$setOnInsert.studentID,
					username: update.$setOnInsert.username
				})
			)
		);
		modelMocks.oauthDeleteMany.mockReturnValue(queryWith({ acknowledged: true, deletedCount: 1 }));
		modelMocks.reviewDeleteMany.mockReturnValue(queryWith({ acknowledged: true, deletedCount: 2 }));
		modelMocks.projectDeleteMany.mockReturnValue(queryWith({ acknowledged: true, deletedCount: 3 }));
		modelMocks.studentDeleteOne.mockReturnValue(queryWith({ deletedCount: 1 }));
		modelMocks.receiptUpdateOne.mockReturnValue(queryWith({ acknowledged: true, matchedCount: 1 }));
	});

	afterEach(() => {
		resetStudentRecordMutationBarriersForTests();
		vi.useRealTimers();
	});

	it("keeps the minimum policy longer than every live student session", () => {
		expect(MIN_STUDENT_RECORD_RETENTION_DAYS * 24 * 60 * 60 * 1000).toBeGreaterThan(STUDENT_ABSOLUTE_SESSION_MS);
	});

	it("computes an exact deadline from creation or successful sign-in time", () => {
		const activity = new Date("2026-07-30T12:00:00.000Z");
		expect(studentRecordRetentionExpiry(90, activity).toISOString()).toBe("2026-10-28T12:00:00.000Z");
	});

	it.each([30, 365])("gives legacy and changed-policy rows a full %i-day period", async retentionDays => {
		modelMocks.studentUpdateMany.mockReturnValue(queryWith({ modifiedCount: 2 }));

		const result = await enforceStudentRecordRetention(retentionDays, now);

		expect(result).toEqual({
			reconciled: 2,
			deleted: 0,
			needsRetry: 0
		});
		expect(modelMocks.studentUpdateMany).toHaveBeenCalledWith(
			{
				$or: [
					{ retentionExpiresAt: { $exists: false } },
					{ retentionPolicyDays: { $exists: false } },
					{ retentionPolicyDays: { $ne: retentionDays } }
				]
			},
			[
				{
					$set: {
						retentionExpiresAt: {
							$dateAdd: {
								amount: retentionDays,
								startDate: now,
								unit: "day"
							}
						},
						retentionPolicyDays: retentionDays
					}
				}
			],
			{ updatePipeline: true }
		);
	});

	it("uses the shared two-fence deletion path for an exact expired deadline", async () => {
		const order: string[] = [];
		queueFreshExpired();
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.studentFindOneAndUpdate
			.mockImplementationOnce(() => {
				order.push("first-fence");
				return queryWith(expiredStudent({ active: false, sessionVersion: 5 }));
			})
			.mockImplementationOnce(() => {
				order.push("second-fence");
				return queryWith(expiredStudent({ active: false, sessionVersion: 6 }));
			});
		modelMocks.closeWrites.mockImplementation(async () => {
			order.push("drain");
		});
		modelMocks.receiptFindOneAndUpdate.mockImplementation((_filter, update) => {
			order.push("receipt");
			return queryWith(
				deletionReceipt({
					expiresAt: update.$setOnInsert.expiresAt,
					operationID: update.$setOnInsert.operationID,
					reason: update.$setOnInsert.reason,
					recordInventory: update.$set.recordInventory,
					requestedAt: update.$setOnInsert.requestedAt
				})
			);
		});
		modelMocks.oauthDeleteMany.mockImplementation(() => {
			order.push("cascade");
			return queryWith({ acknowledged: true, deletedCount: 1 });
		});

		const result = await enforceStudentRecordRetention(90, now);

		expect(result).toEqual({
			reconciled: 0,
			deleted: 1,
			needsRetry: 0
		});
		expect(order.slice(0, 5)).toEqual(["first-fence", "drain", "second-fence", "receipt", "cascade"]);
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
			1,
			{
				_id: studentID,
				dataDeletionPendingAt: { $exists: false },
				recordPreservationHoldActive: { $ne: true },
				retentionExpiresAt: { $lte: now },
				retentionPolicyDays: 90,
				sessionVersion: 4
			},
			expect.objectContaining({
				$inc: { sessionVersion: 1 },
				$set: expect.objectContaining({ active: false })
			}),
			{ new: true }
		);
		const operationID = modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1].$set.dataDeletionOperationID;
		expect(operationID).toEqual(expect.any(String));
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
			2,
			{
				_id: studentID,
				dataDeletionOperationID: operationID,
				sessionVersion: 5
			},
			expect.objectContaining({
				$inc: { sessionVersion: 1 },
				$set: expect.objectContaining({
					dataDeletionOperationID: operationID,
					dataDeletionReason: "retention-expiry"
				})
			}),
			{ new: true }
		);
		expect(modelMocks.receiptFindOneAndUpdate).toHaveBeenCalledWith(
			expect.objectContaining({
				operationID,
				recordInventory: { $exists: false }
			}),
			expect.objectContaining({
				$set: expect.objectContaining({
					recordInventory,
					status: "in-progress"
				}),
				$setOnInsert: expect.objectContaining({
					reason: "retention-expiry",
					studentID,
					username: "student-one"
				})
			}),
			expect.objectContaining({
				new: true,
				upsert: true
			})
		);
		expect(modelMocks.oauthDeleteMany).toHaveBeenCalledWith({
			studentID
		});
		expect(modelMocks.reviewDeleteMany).toHaveBeenCalledWith({
			user: studentID
		});
		expect(modelMocks.projectDeleteMany).toHaveBeenCalledWith({
			user: studentID
		});
		expect(modelMocks.studentDeleteOne).toHaveBeenCalledWith({
			_id: studentID,
			active: false,
			dataDeletionOperationID: operationID,
			sessionVersion: 6
		});
		expect(modelMocks.studentFind).toHaveBeenNthCalledWith(1, {
			dataDeletionPendingAt: { $exists: true },
			recordPreservationHoldActive: { $ne: true }
		});
		expect(modelMocks.studentFind).toHaveBeenNthCalledWith(2, {
			dataDeletionPendingAt: { $exists: false },
			recordPreservationHoldActive: { $ne: true },
			retentionExpiresAt: { $lte: now },
			retentionPolicyDays: 90
		});
	});

	it("skips preserved partial-deletion remnants and fails closed on hold lookup", async () => {
		queuePending(expiredStudent({
			active: false,
			dataDeletionOperationID: "11111111-1111-4111-8111-111111111111",
			dataDeletionPendingAt: now,
			dataDeletionReason: "retention-expiry",
			dataDeletionRequestedAt: now
		}));
		modelMocks.studentExists.mockImplementation(filter => {
			if (filter.recordPreservationHoldActive === true) {
				return queryWith({ _id: studentID });
			}
			return queryWith({ _id: studentID });
		});

		await expect(enforceStudentRecordRetention(90, now)).resolves.toEqual({
			deleted: 0,
			needsRetry: 0,
			reconciled: 0
		});
		expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();

		resetStudentRecordMutationBarriersForTests();
		queueFreshExpired();
		modelMocks.studentExists.mockImplementation(filter => {
			if (filter.recordPreservationHoldActive === true) {
				throw new Error("hold lookup unavailable");
			}
			return queryWith({ _id: studentID });
		});
		await expect(enforceStudentRecordRetention(90, now)).resolves.toEqual({
			deleted: 0,
			needsRetry: 1,
			reconciled: 0
		});
		expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
	});

	it("makes a concurrent hold wait for an already-leased retention deletion", async () => {
		queueFreshExpired();
		let firstFenceEntered!: () => void;
		const entered = new Promise<void>((resolve) => {
			firstFenceEntered = resolve;
		});
		let resolveFirstFence!: (value: ReturnType<typeof expiredStudent>) => void;
		const firstFence = new Promise<ReturnType<typeof expiredStudent>>(
			(resolve) => {
				resolveFirstFence = resolve;
			}
		);
		const deferredQuery = {
			select: vi.fn(() => deferredQuery),
			then: (
				resolve: (value: ReturnType<typeof expiredStudent>) => unknown,
				reject: (reason: unknown) => unknown
			) => firstFence.then(resolve, reject)
		};
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.studentFindOneAndUpdate
			.mockImplementationOnce(() => {
				firstFenceEntered();
				return deferredQuery;
			})
			.mockReturnValue(
				queryWith(expiredStudent({ active: false, sessionVersion: 6 }))
			);

		const sweep = enforceStudentRecordRetention(90, now);
		await entered;
		let holdFinished = false;
		const hold = holdStudentRecordMutationsAndWait(
			studentID.toString()
		).then(() => {
			holdFinished = true;
		});
		await Promise.resolve();
		expect(holdFinished).toBe(false);

		resolveFirstFence(expiredStudent({ active: false, sessionVersion: 5 }));
		await expect(sweep).resolves.toMatchObject({ deleted: 1 });
		await hold;
		expect(holdFinished).toBe(true);
		releaseStudentRecordMutationHold(studentID.toString());
	});

	it("loses safely to a successful sign-in that renews the deadline", async () => {
		queueFreshExpired();
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.studentFindOneAndUpdate.mockReturnValue(queryWith(null));

		const result = await enforceStudentRecordRetention(90, now);

		expect(result).toEqual({
			reconciled: 0,
			deleted: 0,
			needsRetry: 0
		});
		expect(modelMocks.closeWrites).not.toHaveBeenCalled();
		expect(modelMocks.receiptFindOneAndUpdate).not.toHaveBeenCalled();
		expect(modelMocks.projectDeleteMany).not.toHaveBeenCalled();
	});

	it("leaves a durable retry signal when the final account delete fails", async () => {
		queueFreshExpired();
		modelMocks.studentDeleteOne.mockReturnValue(queryWith({ deletedCount: 0 }));

		const result = await enforceStudentRecordRetention(90, now);

		expect(result).toEqual({
			reconciled: 0,
			deleted: 0,
			needsRetry: 1
		});
		expect(modelMocks.receiptUpdateOne).toHaveBeenCalledWith(
			expect.objectContaining({ operationID: expect.any(String) }),
			{
				$set: { status: "needs-retry" },
				$unset: {
					completedAt: "",
					deletedRecords: "",
					expiresAt: ""
				}
			}
		);
	});

	it("does not remove the student when a child-record deletion is unacknowledged", async () => {
		queueFreshExpired();
		modelMocks.projectDeleteMany.mockReturnValue(queryWith({ acknowledged: false, deletedCount: 3 }));

		const result = await enforceStudentRecordRetention(90, now);

		expect(result).toEqual({
			reconciled: 0,
			deleted: 0,
			needsRetry: 1
		});
		expect(modelMocks.studentDeleteOne).not.toHaveBeenCalled();
		expect(modelMocks.receiptUpdateOne).toHaveBeenCalledWith(
			expect.objectContaining({ operationID: expect.any(String) }),
			expect.objectContaining({
				$set: { status: "needs-retry" }
			})
		);
	});

	it("retries a pre-receipt failure with the same stable operation", async () => {
		queueFreshExpired();
		modelMocks.receiptFindOneAndUpdate.mockImplementationOnce(() => {
			throw new Error("receipt unavailable");
		});

		const first = await enforceStudentRecordRetention(90, now);
		const firstFenceSet = modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1].$set;
		const operationID = firstFenceSet.dataDeletionOperationID as string;
		const requestedAt = firstFenceSet.dataDeletionRequestedAt as Date;

		expect(first).toEqual({
			reconciled: 0,
			deleted: 0,
			needsRetry: 1
		});
		expect(operationID).toEqual(expect.any(String));
		expect(requestedAt).toEqual(expect.any(Date));
		expect(modelMocks.oauthDeleteMany).not.toHaveBeenCalled();
		expect(modelMocks.projectDeleteMany).not.toHaveBeenCalled();
		expect(modelMocks.reviewDeleteMany).not.toHaveBeenCalled();
		expect(modelMocks.studentDeleteOne).not.toHaveBeenCalled();

		queuePending(
			expiredStudent({
				active: false,
				dataDeletionOperationID: operationID,
				dataDeletionPendingAt: requestedAt,
				dataDeletionReason: "retention-expiry",
				dataDeletionRequestedAt: requestedAt,
				sessionVersion: 6
			})
		);
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 7 })))
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 8 })));

		const second = await enforceStudentRecordRetention(90, now);

		expect(second).toEqual({
			reconciled: 0,
			deleted: 1,
			needsRetry: 0
		});
		expect(modelMocks.receiptFindOneAndUpdate).toHaveBeenCalledTimes(2);
		expect(modelMocks.receiptFindOneAndUpdate).toHaveBeenLastCalledWith(
			{
				operationID,
				recordInventory: { $exists: false }
			},
			expect.objectContaining({
				$set: expect.objectContaining({ recordInventory }),
				$setOnInsert: expect.objectContaining({
					operationID,
					reason: "retention-expiry",
					requestedAt
				})
			}),
			expect.objectContaining({ new: true, upsert: true })
		);
		expect(modelMocks.studentDeleteOne).toHaveBeenCalledWith(
			expect.objectContaining({
				dataDeletionOperationID: operationID,
				sessionVersion: 8
			})
		);
	});

	it("waits for every child sweep and preserves the durable inventory across retry", async () => {
		const pendingAt = new Date("2026-07-30T10:00:00.000Z");
		queuePending(
			expiredStudent({
				active: false,
				dataDeletionPendingAt: pendingAt,
				sessionVersion: 6
			})
		);
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 7 })))
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 8 })));
		modelMocks.projectDeleteMany.mockReturnValue({
			exec: vi.fn().mockRejectedValue(new Error("projects unavailable"))
		});
		let releaseReview!: () => void;
		const reviewFinished = new Promise<{ acknowledged: true; deletedCount: number }>(resolve => {
			releaseReview = () => resolve({ acknowledged: true, deletedCount: 2 });
		});
		modelMocks.reviewDeleteMany.mockReturnValue({
			exec: vi.fn(() => reviewFinished)
		});

		let firstSettled = false;
		const firstDeletion = enforceStudentRecordRetention(90, now).finally(() => {
			firstSettled = true;
		});
		await vi.waitFor(() => {
			expect(modelMocks.reviewDeleteMany).toHaveBeenCalled();
		});
		await Promise.resolve();
		expect(firstSettled).toBe(false);
		expect(modelMocks.studentDeleteOne).not.toHaveBeenCalled();

		releaseReview();
		const first = await firstDeletion;
		expect(first).toEqual({
			reconciled: 0,
			deleted: 0,
			needsRetry: 1
		});
		const firstFenceSet = modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1].$set;
		const operationID = firstFenceSet.dataDeletionOperationID as string;
		const requestedAt = firstFenceSet.dataDeletionRequestedAt as Date;
		expect(firstFenceSet.dataDeletionPendingAt.getTime()).toBeGreaterThan(pendingAt.getTime());
		expect(modelMocks.receiptFindOneAndUpdate).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				$set: expect.objectContaining({ recordInventory })
			}),
			expect.any(Object)
		);

		queuePending(
			expiredStudent({
				active: false,
				dataDeletionOperationID: operationID,
				dataDeletionPendingAt: firstFenceSet.dataDeletionPendingAt,
				dataDeletionReason: "julio-request",
				dataDeletionRequestedAt: requestedAt,
				sessionVersion: 8
			})
		);
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 9 })))
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 10 })));
		modelMocks.receiptFindOne.mockReturnValue(
			queryWith(
				deletionReceipt({
					operationID,
					reason: "julio-request",
					requestedAt
				})
			)
		);
		modelMocks.projectDeleteMany.mockReturnValue(queryWith({ acknowledged: true, deletedCount: 3 }));
		modelMocks.reviewDeleteMany.mockReturnValue(queryWith({ acknowledged: true, deletedCount: 2 }));
		const countCallsBeforeRetry = {
			oauth: modelMocks.oauthCountDocuments.mock.calls.length,
			projects: modelMocks.projectCountDocuments.mock.calls.length,
			reviews: modelMocks.reviewCountDocuments.mock.calls.length
		};

		const second = await enforceStudentRecordRetention(90, now);

		expect(second).toEqual({
			reconciled: 0,
			deleted: 1,
			needsRetry: 0
		});
		expect(modelMocks.oauthCountDocuments).toHaveBeenCalledTimes(countCallsBeforeRetry.oauth);
		expect(modelMocks.projectCountDocuments).toHaveBeenCalledTimes(countCallsBeforeRetry.projects);
		expect(modelMocks.reviewCountDocuments).toHaveBeenCalledTimes(countCallsBeforeRetry.reviews);
		expect(modelMocks.receiptUpdateOne).toHaveBeenLastCalledWith(
			{ operationID },
			{
				$set: expect.objectContaining({
					deletedRecords: recordInventory,
					status: "completed"
				})
			}
		);
	});

	it("repairs an orphaned receipt after only the final receipt write failed", async () => {
		queueFreshExpired();
		modelMocks.receiptUpdateOne.mockRejectedValueOnce(new Error("receipt update unavailable"));

		const first = await enforceStudentRecordRetention(90, now);
		const operationID = modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1].$set
			.dataDeletionOperationID as string;

		expect(first.deleted).toBe(1);
		modelMocks.receiptFind.mockReturnValue(
			queryWith([
				deletionReceipt({
					expiresAt: new Date("2026-04-01T12:00:00.000Z"),
					operationID,
					requestedAt: new Date("2026-01-01T12:00:00.000Z"),
					status: "in-progress"
				})
			])
		);
		modelMocks.studentExists.mockReturnValue(queryWith(null));
		modelMocks.studentFind.mockReturnValue(queryWith([]));

		const second = await enforceStudentRecordRetention(90, now);

		expect(second).toEqual({
			reconciled: 0,
			deleted: 0,
			needsRetry: 0
		});
		expect(modelMocks.receiptUpdateOne).toHaveBeenCalledWith(
			{
				operationID,
				recordInventory: { $exists: true },
				status: { $in: ["in-progress", "needs-retry"] }
			},
			{
				$set: { status: "in-progress" },
				$unset: {
					completedAt: "",
					deletedRecords: "",
					expiresAt: ""
				}
			}
		);
		expect(modelMocks.receiptUpdateOne).toHaveBeenLastCalledWith(
			{
				operationID,
				recordInventory: { $exists: true },
				status: { $in: ["in-progress", "needs-retry"] }
			},
			{
				$set: {
					completedAt: now,
					deletedRecords: recordInventory,
					expiresAt: new Date("2026-10-28T12:00:00.000Z"),
					status: "completed"
				}
			}
		);
	});

	it("orders pending retries oldest-first so a failed row rotates behind the batch", async () => {
		const pendingAt = new Date("2026-07-30T09:00:00.000Z");
		queuePending(
			expiredStudent({
				active: false,
				dataDeletionPendingAt: pendingAt,
				sessionVersion: 6
			})
		);
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 7 })))
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 8 })));
		modelMocks.projectDeleteMany.mockReturnValue({
			exec: vi.fn().mockRejectedValue(new Error("try later"))
		});

		const result = await enforceStudentRecordRetention(90, now);

		expect(result.needsRetry).toBe(1);
		const pendingQuery = modelMocks.studentFind.mock.results[0]?.value;
		expect(pendingQuery.sort).toHaveBeenCalledWith({
			dataDeletionPendingAt: 1,
			_id: 1
		});
		expect(pendingQuery.limit).toHaveBeenCalledWith(500);
		expect(
			modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1].$set.dataDeletionPendingAt.getTime()
		).toBeGreaterThan(pendingAt.getTime());
	});

	it("migrates legacy pending rows as Julio-requested deletions", async () => {
		queuePending(
			expiredStudent({
				active: false,
				dataDeletionPendingAt: now,
				sessionVersion: 6
			})
		);
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 7 })))
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 8 })));

		const result = await enforceStudentRecordRetention(90, now);

		expect(result.deleted).toBe(1);
		expect(modelMocks.receiptFindOneAndUpdate).toHaveBeenCalledWith(
			expect.any(Object),
			expect.objectContaining({
				$setOnInsert: expect.objectContaining({ reason: "julio-request" })
			}),
			expect.any(Object)
		);
	});

	it("uses an existing receipt when legacy pending metadata lacks a requested time", async () => {
		const operationID = "11111111-1111-4111-8111-111111111111";
		const requestedAt = new Date("2026-03-01T11:30:00.000Z");
		const legacyPendingAt = new Date("2026-07-30T11:45:00.000Z");
		const staleExpiresAt = new Date("2026-05-30T11:30:00.000Z");
		queuePending(
			expiredStudent({
				active: false,
				dataDeletionOperationID: operationID,
				dataDeletionPendingAt: legacyPendingAt,
				sessionVersion: 6
			})
		);
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 7 })))
			.mockReturnValueOnce(queryWith(expiredStudent({ active: false, sessionVersion: 8 })));
		modelMocks.receiptFindOne.mockReturnValue(
			queryWith(
				deletionReceipt({
					operationID,
					reason: "retention-expiry",
					requestedAt,
					expiresAt: staleExpiresAt
				})
			)
		);

		const result = await enforceStudentRecordRetention(90, now);

		expect(result.deleted).toBe(1);
		expect(modelMocks.receiptFindOneAndUpdate).not.toHaveBeenCalled();
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				dataDeletionOperationID: operationID
			}),
			expect.any(Object),
			{ new: true }
		);
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				dataDeletionOperationID: operationID
			}),
			expect.objectContaining({
				$set: expect.objectContaining({
					dataDeletionOperationID: operationID,
					dataDeletionReason: "retention-expiry",
					dataDeletionRequestedAt: requestedAt
				})
			}),
			{ new: true }
		);
		expect(modelMocks.receiptUpdateOne).toHaveBeenNthCalledWith(
			1,
			{ operationID },
			{
				$set: { status: "in-progress" },
				$unset: {
					completedAt: "",
					deletedRecords: "",
					expiresAt: ""
				}
			}
		);
		const completionUpdate = modelMocks.receiptUpdateOne.mock.calls.at(-1)?.[1].$set;
		expect(completionUpdate.expiresAt.getTime() - completionUpdate.completedAt.getTime()).toBe(
			90 * 24 * 60 * 60 * 1000
		);
		expect(completionUpdate.expiresAt.getTime()).toBeGreaterThan(staleExpiresAt.getTime());
	});

	it("does not overlap sweeps and awaits the active sweep on stop", async () => {
		vi.useFakeTimers();
		let resolveSweep!: () => void;
		const runSweep = vi.fn(
			() =>
				new Promise<{
					reconciled: number;
					deleted: number;
					needsRetry: number;
				}>(resolve => {
					resolveSweep = () => resolve({ reconciled: 0, deleted: 0, needsRetry: 0 });
				})
		);
		const stop = startStudentRecordRetentionSweeper(90, runSweep);

		await vi.advanceTimersByTimeAsync(2 * 60 * 60 * 1000);
		expect(runSweep).toHaveBeenCalledOnce();

		let stopped = false;
		const stopping = stop().then(() => {
			stopped = true;
		});
		await Promise.resolve();
		expect(stopped).toBe(false);

		resolveSweep();
		await stopping;
		expect(stopped).toBe(true);
	});
});
