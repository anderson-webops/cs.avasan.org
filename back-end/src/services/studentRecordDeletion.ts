import type { Types } from "mongoose";
import type { StudentDeletionCounts } from "../models/schemas/StudentDataDeletionReceipt.js";
import { randomUUID } from "node:crypto";
import { OAuthLoginAttempt } from "../models/schemas/OAuthLoginAttempt.js";
import { PythonProject } from "../models/schemas/PythonProject.js";
import { PythonProjectReview } from "../models/schemas/PythonProjectReview.js";
import { Student } from "../models/schemas/Student.js";
import {
	STUDENT_DELETION_RECEIPT_RETENTION_DAYS,
	StudentDataDeletionReceipt
} from "../models/schemas/StudentDataDeletionReceipt.js";
import { closeStudentDataWritesAndWait } from "../security/studentDataWriteBarrier.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export type StudentRecordDeletionReason = "julio-request" | "retention-expiry";

export interface StudentRecordDeletionOptions {
	initialFilter: Record<string, unknown>;
	reason: StudentRecordDeletionReason;
	resumeOperation?: {
		operationID: string;
		requestedAt?: Date;
	};
	studentID: string;
	username: string;
}

export interface CompletedStudentRecordDeletion {
	completedAt: Date;
	deleted: true;
	deletedRecords: StudentDeletionCounts;
	operationID: string;
	reason: StudentRecordDeletionReason;
	receiptExpiresAt: Date | null;
	receiptStatus: "completed" | "in-progress";
	requestedAt: Date;
}

export interface IncompleteStudentRecordDeletion {
	deleted: false;
	operationID: string | null;
	reason: "changed" | "needs-retry";
	requestedAt: Date | null;
}

export type StudentRecordDeletionResult = CompletedStudentRecordDeletion | IncompleteStudentRecordDeletion;

interface DurableDeletionReceipt {
	recordInventory: StudentDeletionCounts;
	reason: StudentRecordDeletionReason;
	requestedAt: Date;
}

export function studentDeletionReceiptExpiry(completedAt: Date): Date {
	return new Date(
		completedAt.getTime()
		+ STUDENT_DELETION_RECEIPT_RETENTION_DAYS * DAY_MS
	);
}

function receiptQuery(operationID: string) {
	return StudentDataDeletionReceipt.findOne({ operationID })
		.select("+recordInventory")
		.lean()
		.exec();
}

async function countStudentRecordInventory(
	studentID: string | Types.ObjectId
): Promise<StudentDeletionCounts> {
	const [oauthAttempts, projects, reviews] = await Promise.all([
		OAuthLoginAttempt.countDocuments({ studentID }).exec(),
		PythonProject.countDocuments({ user: studentID }).exec(),
		PythonProjectReview.countDocuments({ user: studentID }).exec()
	]);
	return {
		oauthAttempts,
		projects,
		reviews,
		students: 1
	};
}

async function setReceiptInProgress(operationID: string): Promise<void> {
	const result = await StudentDataDeletionReceipt.updateOne(
		{ operationID },
		{
			$set: { status: "in-progress" },
			$unset: {
				completedAt: "",
				deletedRecords: "",
				expiresAt: ""
			}
		}
	).exec();
	if (!result.acknowledged || result.matchedCount !== 1) {
		throw new Error("The deletion receipt could not be made retryable.");
	}
}

async function ensureDurableDeletionReceipt(
	options: {
		existingReceipt: Awaited<ReturnType<typeof receiptQuery>> | null;
		operationID: string;
		reason: StudentRecordDeletionReason;
		requestedAt: Date;
		studentID: Types.ObjectId;
		username: string;
	}
): Promise<DurableDeletionReceipt> {
	const existingReceipt = options.existingReceipt;
	const existingInventory = existingReceipt?.recordInventory;
	if (existingReceipt && existingInventory) {
		await setReceiptInProgress(options.operationID);
		return {
			recordInventory: existingInventory,
			reason: existingReceipt.reason ?? options.reason,
			requestedAt: existingReceipt.requestedAt
		};
	}

	// The inventory is collected only after both write fences and is stored
	// durably before any destructive collection operation begins. Retries keep
	// this first inventory instead of reporting only the rows that survived a
	// partial earlier attempt.
	const recordInventory = await countStudentRecordInventory(options.studentID);
	let receipt;
	try {
		receipt = await StudentDataDeletionReceipt.findOneAndUpdate(
			{
				operationID: options.operationID,
				recordInventory: { $exists: false }
			},
			{
				$set: {
					recordInventory,
					status: "in-progress"
				},
				$setOnInsert: {
					operationID: options.operationID,
					reason: options.reason,
					requestedAt: options.requestedAt,
					studentID: options.studentID,
					username: options.username
				},
				$unset: {
					completedAt: "",
					deletedRecords: "",
					expiresAt: ""
				}
			},
			{
				new: true,
				setDefaultsOnInsert: true,
				upsert: true
			}
		)
			.select("+recordInventory")
			.lean()
			.exec();
	}
	catch (error) {
		// A concurrent retry may have won the unique-operation insert. Re-read
		// and proceed only if that winner already made the inventory durable.
		const concurrentReceipt = await receiptQuery(options.operationID);
		if (!concurrentReceipt?.recordInventory) throw error;
		receipt = concurrentReceipt;
	}
	if (!receipt?.recordInventory) {
		throw new Error("The deletion inventory was not durably recorded.");
	}
	return {
		recordInventory: receipt.recordInventory,
		reason: receipt.reason ?? options.reason,
		requestedAt: receipt.requestedAt
	};
}

export async function deleteStudentChildRecords(
	studentID: string | Types.ObjectId
): Promise<void> {
	const outcomes = await Promise.allSettled([
		OAuthLoginAttempt.deleteMany({ studentID }).exec(),
		PythonProjectReview.deleteMany({ user: studentID }).exec(),
		PythonProject.deleteMany({ user: studentID }).exec()
	]);
	const failures = outcomes
		.filter((outcome): outcome is PromiseRejectedResult => outcome.status === "rejected")
		.map(outcome => outcome.reason);
	if (failures.length) {
		throw new AggregateError(failures, "One or more student record collections could not be deleted.");
	}
}

async function markReceiptNeedsRetry(operationID: string): Promise<void> {
	await StudentDataDeletionReceipt.updateOne(
		{ operationID },
		{
			$set: { status: "needs-retry" },
			$unset: {
				completedAt: "",
				deletedRecords: "",
				expiresAt: ""
			}
		}
	).exec();
}

/**
 * The single destructive path for Julio-requested and automatic retention
 * deletion. Callers decide eligibility, but this service owns both session
 * fences, write-drain ordering, the durable receipt, and every collection
 * sweep so the two deletion reasons cannot drift apart.
 */
export async function deleteStudentRecordSet(
	options: StudentRecordDeletionOptions
): Promise<StudentRecordDeletionResult> {
	const deletionPendingAt = new Date();
	const operationID = options.resumeOperation?.operationID ?? randomUUID();
	let requestedAt = options.resumeOperation?.requestedAt ?? deletionPendingAt;
	let deletionReason = options.reason;
	let receiptDurable = false;
	let existingReceipt: Awaited<ReturnType<typeof receiptQuery>> | null = null;

	try {
		const revoked = await Student.findOneAndUpdate(
			{
				_id: options.studentID,
				...options.initialFilter
			},
			{
				$inc: { sessionVersion: 1 },
				$set: {
					active: false,
					dataDeletionPendingAt: deletionPendingAt,
					dataDeletionOperationID: operationID,
					dataDeletionRequestedAt: requestedAt,
					dataDeletionReason: deletionReason
				}
			},
			{ new: true }
		).select("+dataDeletionOperationID +dataDeletionRequestedAt" + " +dataDeletionReason +sessionVersion");
		if (!revoked) {
			return {
				deleted: false,
				operationID: null,
				reason: "changed",
				requestedAt: null
			};
		}

		// Rotate the pending timestamp in the first fence before consulting the
		// receipt collection. Even a receipt-read outage therefore moves this
		// row behind older pending work instead of starving rows past the batch
		// limit. The second fence below replaces legacy fallback metadata with
		// the durable receipt values when they are available.
		existingReceipt = options.resumeOperation
			? await receiptQuery(operationID)
			: null;
		requestedAt = existingReceipt?.requestedAt
			?? options.resumeOperation?.requestedAt
			?? deletionPendingAt;
		deletionReason = existingReceipt?.reason ?? options.reason;

		await closeStudentDataWritesAndWait(options.studentID);
		const fenced = await Student.findOneAndUpdate(
			{
				_id: revoked._id,
				dataDeletionOperationID: operationID,
				sessionVersion: revoked.sessionVersion
			},
			{
				$inc: { sessionVersion: 1 },
				$set: {
					active: false,
					dataDeletionPendingAt: deletionPendingAt,
					dataDeletionOperationID: operationID,
					dataDeletionRequestedAt: requestedAt,
					dataDeletionReason: deletionReason
				}
			},
			{ new: true }
		).select("+dataDeletionOperationID +sessionVersion");
		if (!fenced) {
			return {
				deleted: false,
				operationID,
				reason: "needs-retry",
				requestedAt
			};
		}

		const durableReceipt = await ensureDurableDeletionReceipt({
			existingReceipt,
			operationID,
			reason: deletionReason,
			requestedAt,
			studentID: fenced._id,
			username: options.username
		});
		receiptDurable = true;
		requestedAt = durableReceipt.requestedAt;
		deletionReason = durableReceipt.reason;

		await deleteStudentChildRecords(fenced._id);
		const studentResult = await Student.deleteOne({
			_id: fenced._id,
			active: false,
			dataDeletionOperationID: operationID,
			sessionVersion: fenced.sessionVersion
		}).exec();
		if (studentResult.deletedCount !== 1) {
			await markReceiptNeedsRetry(operationID).catch(() => undefined);
			return {
				deleted: false,
				operationID,
				reason: "needs-retry",
				requestedAt
			};
		}

		const deletedRecords = durableReceipt.recordInventory;
		const completedAt = new Date();
		const completedReceiptExpiresAt
			= studentDeletionReceiptExpiry(completedAt);
		let receiptStatus: "completed" | "in-progress" = "completed";
		try {
			const receiptUpdate = await StudentDataDeletionReceipt.updateOne(
				{ operationID },
				{
					$set: {
						completedAt,
						deletedRecords,
						expiresAt: completedReceiptExpiresAt,
						status: "completed"
					}
				}
			).exec();
			if (!receiptUpdate.acknowledged || receiptUpdate.matchedCount !== 1) {
				receiptStatus = "in-progress";
			}
		}
		catch {
			// The durable in-progress receipt still identifies this completed
			// primary deletion for operator reconciliation.
			receiptStatus = "in-progress";
		}
		return {
			completedAt,
			deleted: true,
			deletedRecords,
			operationID,
			reason: deletionReason,
			receiptExpiresAt:
				receiptStatus === "completed"
					? completedReceiptExpiresAt
					: null,
			receiptStatus,
			requestedAt
		};
	}
	catch {
		if (receiptDurable) {
			await markReceiptNeedsRetry(operationID).catch(() => undefined);
		}
		return {
			deleted: false,
			operationID,
			reason: "needs-retry",
			requestedAt
		};
	}
}
