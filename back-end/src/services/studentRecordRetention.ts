import { Student } from "../models/schemas/Student.js";
import { StudentDataDeletionReceipt } from "../models/schemas/StudentDataDeletionReceipt.js";
import {
	deleteStudentChildRecords,
	deleteStudentRecordSet,
	studentDeletionReceiptExpiry
} from "./studentRecordDeletion.js";

const RETENTION_SWEEP_INTERVAL_MS = 60 * 60 * 1000;
const RETENTION_SWEEP_BATCH_SIZE = 500;

export interface StudentRetentionSweepResult {
	reconciled: number;
	deleted: number;
	needsRetry: number;
}

/**
 * Legacy rows and rows carrying a different configured policy receive one
 * full current policy period from reconciliation time. This explicit migration
 * avoids immediate retroactive deletion when the policy is introduced or
 * shortened, while the persisted policy value prevents repeatedly extending
 * the deadline on later sweeps. New and successfully authenticated accounts
 * continue to use activity-based deadlines.
 */
async function reconcileStudentRetentionPolicy(retentionDays: number, now: Date): Promise<number> {
	const result = await Student.updateMany(
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
	).exec();
	return result.modifiedCount;
}

async function reconcileOrphanedDeletionReceipts(now: Date): Promise<number> {
	const receipts = await StudentDataDeletionReceipt.find({
		recordInventory: { $exists: true },
		status: { $in: ["in-progress", "needs-retry"] }
	})
		.select("+recordInventory")
		.sort({ updatedAt: 1, _id: 1 })
		.limit(RETENTION_SWEEP_BATCH_SIZE)
		.lean()
		.exec();
	let needsRetry = 0;
	for (const receipt of receipts) {
		if (!receipt.recordInventory) {
			needsRetry += 1;
			continue;
		}
		if (await Student.exists({ _id: receipt.studentID })) continue;
		try {
			const prepared = await StudentDataDeletionReceipt.updateOne(
				{
					operationID: receipt.operationID,
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
			).exec();
			if (!prepared.acknowledged || prepared.matchedCount !== 1) {
				needsRetry += 1;
				continue;
			}
			// The durable pre-delete inventory proves this operation crossed
			// the receipt gate. Repeating every child sweep is idempotent and
			// closes the small window where only the final receipt update
			// failed after the account document was removed.
			await deleteStudentChildRecords(receipt.studentID.toString());
			const completed = await StudentDataDeletionReceipt.updateOne(
				{
					operationID: receipt.operationID,
					recordInventory: { $exists: true },
					status: { $in: ["in-progress", "needs-retry"] }
				},
				{
					$set: {
						completedAt: now,
						deletedRecords: receipt.recordInventory,
						expiresAt: studentDeletionReceiptExpiry(now),
						status: "completed"
					}
				}
			).exec();
			if (!completed.acknowledged || completed.matchedCount !== 1) {
				needsRetry += 1;
			}
		}
		catch {
			needsRetry += 1;
			await StudentDataDeletionReceipt.updateOne(
				{ operationID: receipt.operationID },
				{
					$set: { status: "needs-retry" },
					$unset: {
						completedAt: "",
						deletedRecords: "",
						expiresAt: ""
					}
				}
			)
				.exec()
				.catch(() => undefined);
		}
	}
	return needsRetry;
}

export async function enforceStudentRecordRetention(
	retentionDays: number,
	now = new Date()
): Promise<StudentRetentionSweepResult> {
	const reconciled = await reconcileStudentRetentionPolicy(retentionDays, now);
	const orphanedReceiptRetries = await reconcileOrphanedDeletionReceipts(now);
	const selectDeletionState
		= "+dataDeletionPendingAt +dataDeletionOperationID"
			+ " +dataDeletionRequestedAt +dataDeletionReason"
			+ " +sessionVersion _id username";
	const pending = await Student.find({
		dataDeletionPendingAt: { $exists: true }
	})
		.select(selectDeletionState)
		.sort({ dataDeletionPendingAt: 1, _id: 1 })
		.limit(RETENTION_SWEEP_BATCH_SIZE)
		.lean()
		.exec();
	const expired = await Student.find({
		dataDeletionPendingAt: { $exists: false },
		retentionExpiresAt: { $lte: now },
		retentionPolicyDays: retentionDays
	})
		.select(selectDeletionState)
		.sort({ retentionExpiresAt: 1, _id: 1 })
		.limit(RETENTION_SWEEP_BATCH_SIZE)
		.lean()
		.exec();

	let deleted = 0;
	let needsRetry = orphanedReceiptRetries;
	for (const student of [...pending, ...expired]) {
		const deletionWasPending = Boolean(student.dataDeletionPendingAt);
		const deletionReason = deletionWasPending
			? (student.dataDeletionReason ?? "julio-request")
			: "retention-expiry";
		const resumeOperation
			= deletionWasPending && student.dataDeletionOperationID
				? {
						operationID: student.dataDeletionOperationID,
						requestedAt:
							student.dataDeletionRequestedAt
							?? student.dataDeletionPendingAt
					}
				: undefined;
		const result = await deleteStudentRecordSet({
			initialFilter: {
				_id: student._id,
				sessionVersion: student.sessionVersion,
				...(deletionWasPending
					? {
							dataDeletionPendingAt: { $exists: true },
							...(resumeOperation
								? {
										dataDeletionOperationID: resumeOperation.operationID
									}
								: {
										dataDeletionOperationID: {
											$exists: false
										}
									})
						}
					: {
							dataDeletionPendingAt: { $exists: false },
							retentionExpiresAt: { $lte: now },
							retentionPolicyDays: retentionDays
						})
			},
			reason: deletionReason,
			...(resumeOperation ? { resumeOperation } : {}),
			studentID: student._id.toString(),
			username: student.username
		});
		if (result.deleted) deleted += 1;
		if (!result.deleted && result.reason === "needs-retry") needsRetry += 1;
	}
	return { reconciled, deleted, needsRetry };
}

export function startStudentRecordRetentionSweeper(
	retentionDays: number,
	runSweep: (retentionDays: number) => Promise<StudentRetentionSweepResult> = enforceStudentRecordRetention
): () => Promise<void> {
	let running = false;
	let activeSweep: Promise<void> | null = null;
	const timer = setInterval(() => {
		if (running) return;
		running = true;
		activeSweep = runSweep(retentionDays)
			.then(() => undefined)
			.catch((error) => {
				console.error("Student retention sweep failed.", error);
			})
			.finally(() => {
				running = false;
				activeSweep = null;
			});
	}, RETENTION_SWEEP_INTERVAL_MS);
	timer.unref();
	return async () => {
		clearInterval(timer);
		await activeSweep;
	};
}
