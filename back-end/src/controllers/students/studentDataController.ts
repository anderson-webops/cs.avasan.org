import type { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { Types } from "mongoose";
import { OAuthLoginAttempt } from "../../models/schemas/OAuthLoginAttempt.js";
import { PythonProject } from "../../models/schemas/PythonProject.js";
import { PythonProjectReview } from "../../models/schemas/PythonProjectReview.js";
import { Student } from "../../models/schemas/Student.js";
import {
	STUDENT_DELETION_RECEIPT_RETENTION_DAYS,
	StudentDataDeletionReceipt
} from "../../models/schemas/StudentDataDeletionReceipt.js";
import {
	normalizeStudentUsername
} from "../../security/studentCredentials.js";
import {
	closeStudentDataWritesAndWait
} from "../../security/studentDataWriteBarrier.js";
import { serializeManagedStudent } from "./studentController.js";

const DAY_MS = 24 * 60 * 60 * 1000;

function studentIdParam(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1]
): string | null {
	const rawStudentID = req.params.studentID;
	const studentID = Array.isArray(rawStudentID)
		? rawStudentID[0]
		: rawStudentID;
	if (typeof studentID !== "string" || !Types.ObjectId.isValid(studentID)) {
		res.status(400).json({ message: "Invalid student ID." });
		return null;
	}
	return studentID.toLowerCase();
}

function bodyHasOnlyKeys(body: unknown, allowedKeys: readonly string[]): boolean {
	if (!body || typeof body !== "object" || Array.isArray(body)) return false;
	const allowed = new Set(allowedKeys);
	return Object.keys(body).every(key => allowed.has(key));
}

async function teacherPasswordVerified(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1]
): Promise<boolean> {
	const { teacherPassword } = req.body as { teacherPassword?: unknown };
	if (typeof teacherPassword !== "string" || !teacherPassword) {
		res.status(400).json({ message: "Julio’s password is required." });
		return false;
	}
	if (!req.currentAdmin || !(await req.currentAdmin.comparePassword(teacherPassword))) {
		res.status(403).json({ message: "Julio’s password is incorrect." });
		return false;
	}
	return true;
}

function projectRecord(project: Record<string, unknown>) {
	const {
		__v: _version,
		user: _user,
		...record
	} = project;
	return record;
}

function reviewRecord(review: Record<string, unknown>) {
	const {
		__v: _version,
		lastEditedBy: _lastEditedBy,
		reviewer: _reviewer,
		user: _user,
		...record
	} = review;
	return record;
}

async function writeResponseChunk(
	res: Parameters<RequestHandler>[1],
	chunk: string
): Promise<void> {
	if (res.destroyed || res.writableEnded) {
		throw new Error("Student export connection closed.");
	}
	if (res.write(chunk)) return;

	await new Promise<void>((resolve, reject) => {
		let handleClose = () => undefined;
		const handleDrain = () => {
			res.off("close", handleClose);
			resolve();
		};
		handleClose = () => {
			res.off("drain", handleDrain);
			reject(new Error("Student export connection closed."));
		};
		res.once("drain", handleDrain);
		res.once("close", handleClose);
	});
}

function deletionOperation(operationID: string, performedAt: Date) {
	return {
		id: operationID,
		kind: "student-record-delete" as const,
		performedBy: "Julio" as const,
		performedAt: performedAt.toISOString()
	};
}

function deletionReceiptRecord(
	operationID: string,
	studentID: string,
	username: string,
	status: "completed" | "in-progress" | "needs-retry",
	requestedAt: Date,
	expiresAt: Date,
	options: {
		completedAt?: Date;
		deletedRecords?: {
			oauthAttempts: number;
			projects: number;
			reviews: number;
			students: number;
		};
	} = {}
) {
	return {
		operationID,
		status,
		subject: {
			studentID,
			username
		},
		requestedAt: requestedAt.toISOString(),
		completedAt: options.completedAt?.toISOString() ?? null,
		expiresAt: expiresAt.toISOString(),
		deletedRecords: options.deletedRecords ?? null
	};
}

/**
 * Return the bounded set of still-retained deletion receipts so Julio can
 * recover one even if the original download or response was interrupted.
 */
export const listStudentDeletionReceipts: RequestHandler = async (_req, res) => {
	try {
		const receipts = await StudentDataDeletionReceipt.find({
			expiresAt: { $gt: new Date() }
		})
			.sort({ requestedAt: -1 })
			.limit(100)
			.lean()
			.exec();
		res.json({
			retentionDays: STUDENT_DELETION_RECEIPT_RETENTION_DAYS,
			receipts: receipts.map(receipt =>
				deletionReceiptRecord(
					receipt.operationID,
					receipt.studentID.toString(),
					receipt.username,
					receipt.status,
					receipt.requestedAt,
					receipt.expiresAt,
					{
						completedAt: receipt.completedAt,
						deletedRecords: receipt.deletedRecords
					}
				)
			)
		});
	}
	catch {
		res.status(500).json({
			message: "Student deletion receipts could not be loaded."
		});
	}
};

/**
 * Build a portable copy of retained account and educational records without
 * exporting credential hashes or temporary OAuth proof material. Projects and
 * reviews are streamed from MongoDB one record at a time so a valid worst-case
 * classroom export is not duplicated in the Node.js heap.
 */
export const exportStudentData: RequestHandler = async (req, res) => {
	if (!bodyHasOnlyKeys(req.body, ["teacherPassword"])) {
		return res.status(400).json({
			message: "Only Julio’s password is accepted."
		});
	}
	if (!(await teacherPasswordVerified(req, res))) return;

	const studentID = studentIdParam(req, res);
	if (!studentID) return;

	try {
		const student = await Student.findById(studentID)
			.select(
				"+passwordHash +accessCodeHash +pendingSetupCodeHash"
				+ " +externalAuthProvider +externalAuthSubjectHash"
			);
		if (!student) return res.sendStatus(404);

		const pendingOAuthAttempts = await OAuthLoginAttempt.countDocuments({
			studentID: student._id
		}).exec();
		const operationID = randomUUID();
		const generatedAt = new Date().toISOString();
		const account = serializeManagedStudent(student);
		const operation = {
			id: operationID,
			kind: "student-record-export",
			performedBy: "Julio",
			performedAt: generatedAt
		};

		res.set({
			"Content-Disposition":
					`attachment; filename="${student.username}-classroom-records.json"`,
			"Content-Type": "application/json; charset=utf-8"
		});
		await writeResponseChunk(
			res,
			`{"schemaVersion":1,"operation":${JSON.stringify(operation)},"student":${JSON.stringify({
				...account,
				credentialState: account.credentialState,
				connectedProvider: account.socialProviders[0] ?? null
			})},"projects":[`
		);

		let projectCount = 0;
		const projectCursor = PythonProject.find({ user: student._id })
			.sort({ createdAt: 1 })
			.lean()
			.cursor();
		for await (const project of projectCursor) {
			await writeResponseChunk(
				res,
				`${projectCount ? "," : ""}${JSON.stringify(
					projectRecord(
						project as unknown as Record<string, unknown>
					)
				)}`
			);
			projectCount += 1;
		}

		await writeResponseChunk(res, "],\"reviews\":[");
		let reviewCount = 0;
		const reviewCursor = PythonProjectReview.find({ user: student._id })
			.sort({ createdAt: 1 })
			.lean()
			.cursor();
		for await (const review of reviewCursor) {
			await writeResponseChunk(
				res,
				`${reviewCount ? "," : ""}${JSON.stringify(
					reviewRecord(
						review as unknown as Record<string, unknown>
					)
				)}`
			);
			reviewCount += 1;
		}

		res.end(`],"recordInventory":${JSON.stringify({
			pendingOAuthAttempts,
			projects: projectCount,
			reviews: reviewCount
		})},"notes":${JSON.stringify([
			"Credential hashes and temporary OAuth verifier, nonce, state, and browser-binding values are intentionally excluded.",
			"Signed sessions are stored in browser cookies rather than a server-side session collection.",
			"Deleted project and review rows are included while they remain in the database awaiting TTL cleanup."
		])}}`);
		console.info(
			`student-record-export completed operation=${operationID} projects=${projectCount} reviews=${reviewCount}`
		);
	}
	catch {
		if (res.headersSent) {
			res.destroy();
			return;
		}
		res.status(500).json({
			message: "Student records could not be exported."
		});
	}
};

/**
 * Permanently remove every collection owned by the optional student-account
 * feature. The account is disabled and its session version rotated first, so
 * any partial failure fails closed and can be safely retried by Julio.
 */
export const deleteStudentData: RequestHandler = async (req, res) => {
	if (!bodyHasOnlyKeys(req.body, ["confirmUsername", "teacherPassword"])) {
		return res.status(400).json({
			message: "Only the username confirmation and Julio’s password are accepted."
		});
	}
	if (!(await teacherPasswordVerified(req, res))) return;

	const studentID = studentIdParam(req, res);
	if (!studentID) return;
	const { confirmUsername } = req.body as { confirmUsername?: unknown };
	if (
		typeof confirmUsername !== "string"
		|| !confirmUsername.trim()
	) {
		return res.status(400).json({
			message: "Type the student’s username to confirm permanent deletion."
		});
	}

	let operationID: string | null = null;
	let requestedAt: Date | null = null;
	let receiptExpiresAt: Date | null = null;
	let receiptCreated = false;
	try {
		const existing = await Student.findById(studentID)
			.select("+sessionVersion");
		if (!existing) return res.sendStatus(404);
		if (
			normalizeStudentUsername(confirmUsername)
			!== existing.username
		) {
			return res.status(409).json({
				message: "The confirmation username does not match."
			});
		}

		const deletionPendingAt = new Date();
		const revoked = await Student.findOneAndUpdate(
			{
				_id: existing._id,
				sessionVersion: existing.sessionVersion
			},
			{
				$inc: { sessionVersion: 1 },
				$set: {
					active: false,
					dataDeletionPendingAt: deletionPendingAt
				}
			},
			{ new: true }
		).select("+sessionVersion");
		if (!revoked) {
			return res.status(409).json({
				message: "The student account changed. Reload and try again."
			});
		}

		await closeStudentDataWritesAndWait(studentID);
		const fenced = await Student.findOneAndUpdate(
			{ _id: revoked._id },
			{
				$inc: { sessionVersion: 1 },
				$set: {
					active: false,
					dataDeletionPendingAt: deletionPendingAt
				}
			},
			{ new: true }
		).select("+sessionVersion");
		if (!fenced) {
			return res.status(503).json({
				message:
					"The student account could not be fenced for deletion. Retry this action."
			});
		}

		operationID = randomUUID();
		requestedAt = new Date();
		receiptExpiresAt = new Date(
			requestedAt.getTime()
			+ STUDENT_DELETION_RECEIPT_RETENTION_DAYS * DAY_MS
		);
		await StudentDataDeletionReceipt.create({
			operationID,
			studentID: fenced._id,
			username: existing.username,
			status: "in-progress",
			requestedAt,
			expiresAt: receiptExpiresAt
		});
		receiptCreated = true;

		const [oauthResult, reviewResult, projectResult] = await Promise.all([
			OAuthLoginAttempt.deleteMany({ studentID: fenced._id }).exec(),
			PythonProjectReview.deleteMany({ user: fenced._id }).exec(),
			PythonProject.deleteMany({ user: fenced._id }).exec()
		]);
		const studentResult = await Student.deleteOne({
			_id: fenced._id,
			active: false,
			sessionVersion: fenced.sessionVersion
		}).exec();
		if (studentResult.deletedCount !== 1) {
			await StudentDataDeletionReceipt.updateOne(
				{ operationID },
				{ $set: { status: "needs-retry" } }
			).exec().catch(() => undefined);
			return res.status(503).json({
				message: "Related records were removed, but the disabled student account still needs deletion. Retry this action.",
				operation: deletionOperation(operationID, requestedAt)
			});
		}

		const deletedRecords = {
			oauthAttempts: oauthResult.deletedCount,
			projects: projectResult.deletedCount,
			reviews: reviewResult.deletedCount,
			students: studentResult.deletedCount
		};
		const completedAt = new Date();
		let receiptStatus: "completed" | "in-progress" = "completed";
		try {
			const receiptUpdate = await StudentDataDeletionReceipt.updateOne(
				{ operationID },
				{
					$set: {
						completedAt,
						deletedRecords,
						status: "completed"
					}
				}
			).exec();
			if (
				!receiptUpdate.acknowledged
				|| receiptUpdate.matchedCount !== 1
			) {
				receiptStatus = "in-progress";
			}
		}
		catch {
			// The durable in-progress receipt still identifies this completed
			// primary deletion for operator reconciliation.
			receiptStatus = "in-progress";
		}
		console.info(
			`student-record-delete completed operation=${operationID} oauthAttempts=${deletedRecords.oauthAttempts} projects=${deletedRecords.projects} reviews=${deletedRecords.reviews}`
		);
		return res.json({
			deleted: true,
			deletedRecords,
			operatorFollowUp: {
				backupDeletionRequired: true,
				instruction:
						"Download and retain this short-lived receipt through the approved process. Use its subject ID and username to complete deletion from any retained classroom backups."
			},
			operation: deletionOperation(operationID, requestedAt),
			receipt: deletionReceiptRecord(
				operationID,
				studentID,
				existing.username,
				receiptStatus,
				requestedAt,
				receiptExpiresAt,
				{ completedAt, deletedRecords }
			)
		});
	}
	catch {
		if (receiptCreated && operationID) {
			await StudentDataDeletionReceipt.updateOne(
				{ operationID },
				{ $set: { status: "needs-retry" } }
			).exec().catch(() => undefined);
		}
		return res.status(503).json({
			message: "Student record deletion did not finish. The account was disabled where possible; retry the action.",
			...(operationID && requestedAt
				? { operation: deletionOperation(operationID, requestedAt) }
				: {})
		});
	}
};
