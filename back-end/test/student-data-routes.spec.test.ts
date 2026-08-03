import type { Server } from "node:http";
import type { Response } from "express";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	heldProjectWrite: vi.fn(),
	oauthCountDocuments: vi.fn(),
	oauthDeleteMany: vi.fn(),
	projectCountDocuments: vi.fn(),
	projectDeleteMany: vi.fn(),
	projectFind: vi.fn(),
	reviewCountDocuments: vi.fn(),
	reviewDeleteMany: vi.fn(),
	reviewFind: vi.fn(),
	receiptFind: vi.fn(),
	receiptFindOne: vi.fn(),
	receiptFindOneAndUpdate: vi.fn(),
	receiptUpdateOne: vi.fn(),
	studentDeleteOne: vi.fn(),
	studentFindById: vi.fn(),
	studentFindOneAndUpdate: vi.fn()
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
		deleteMany: modelMocks.projectDeleteMany,
		find: modelMocks.projectFind
	}
}));
vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		countDocuments: modelMocks.reviewCountDocuments,
		deleteMany: modelMocks.reviewDeleteMany,
		find: modelMocks.reviewFind
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
		findById: modelMocks.studentFindById,
		findOneAndUpdate: modelMocks.studentFindOneAndUpdate
	}
}));

const { deleteStudentData, exportStudentData, listStudentDeletionReceipts } =
	await import("../src/controllers/students/studentDataController.js");
const { resetStudentDataWriteBarriersForTests, withStudentDataWriteLease } =
	await import("../src/security/studentDataWriteBarrier.js");

function queryWith<T>(result: T) {
	const query = {
		cursor: vi.fn(() => {
			const values = Array.isArray(result) ? result : [];
			return {
				async *[Symbol.asyncIterator]() {
					for (const value of values) yield value;
				}
			};
		}),
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
const createdAt = new Date("2026-07-29T12:00:00.000Z");

function studentRecord(overrides: Record<string, unknown> = {}) {
	return {
		_id: studentID,
		accessCodeHash: "access-code-hash",
		active: true,
		activeProjectBytes: 20,
		activeProjectCount: 1,
		createdAt,
		externalAuthProvider: "google",
		externalAuthSubjectHash: "a".repeat(64),
		failedLoginAttempts: 0,
		passwordHash: "password-hash",
		sessionVersion: 4,
		updatedAt: createdAt,
		username: "student-one",
		...overrides
	};
}

async function withRuntime<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json());
	app.use((req, _res, next) => {
		req.currentAdmin = {
			comparePassword: vi.fn(async value => value === "teacher-passphrase")
		} as any;
		next();
	});
	app.post(
		"/students/:studentID/export",
		withStudentDataWriteLease(exportStudentData)
	);
	app.delete("/students/:studentID", deleteStudentData);
	app.get("/student-deletion-receipts", listStudentDeletionReceipts);
	app.post(
		"/students/:studentID/held-project-write",
		withStudentDataWriteLease(async (_req, res) => {
			await modelMocks.heldProjectWrite(res);
			res.sendStatus(204);
		})
	);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) reject(error);
				else resolve();
			});
		});
	}
}

function request(baseUrl: string, path: string, method: "DELETE" | "POST", body: object) {
	return fetch(`${baseUrl}${path}`, {
		body: JSON.stringify(body),
		headers: { "content-type": "application/json" },
		method
	});
}

describe("student record export and deletion", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetStudentDataWriteBarriersForTests();
		modelMocks.studentFindOneAndUpdate.mockReset();
		modelMocks.heldProjectWrite.mockResolvedValue(undefined);
		modelMocks.studentFindById.mockReturnValue(queryWith(studentRecord()));
		modelMocks.projectFind.mockReturnValue(
			queryWith([
				{
					_id: new Types.ObjectId(),
					files: [{ content: "print('hello')", name: "main.py" }],
					title: "Hello",
					user: studentID
				}
			])
		);
		modelMocks.reviewFind.mockReturnValue(
			queryWith([
				{
					_id: new Types.ObjectId(),
					files: [{ content: "print('review')", name: "main.py" }],
					note: "Nice work",
					reviewer: new Types.ObjectId(),
					title: "Teacher copy",
					user: studentID
				}
			])
		);
		modelMocks.oauthCountDocuments.mockReturnValue(queryWith(1));
		modelMocks.projectCountDocuments.mockReturnValue(queryWith(1));
		modelMocks.reviewCountDocuments.mockReturnValue(queryWith(1));
		modelMocks.oauthDeleteMany.mockReturnValue(queryWith({ acknowledged: true, deletedCount: 1 }));
		modelMocks.projectDeleteMany.mockReturnValue(queryWith({ acknowledged: true, deletedCount: 1 }));
		modelMocks.reviewDeleteMany.mockReturnValue(queryWith({ acknowledged: true, deletedCount: 1 }));
		modelMocks.receiptFind.mockReturnValue(queryWith([]));
		modelMocks.receiptFindOne.mockReturnValue(queryWith(null));
		modelMocks.receiptFindOneAndUpdate.mockImplementation((_filter, update) =>
			queryWith({
				_id: new Types.ObjectId(),
				createdAt,
				operationID: update.$setOnInsert.operationID,
				reason: update.$setOnInsert.reason,
				recordInventory: update.$set.recordInventory,
				requestedAt: update.$setOnInsert.requestedAt,
				status: "in-progress",
				studentID: update.$setOnInsert.studentID,
				updatedAt: createdAt,
				username: update.$setOnInsert.username
			})
		);
		modelMocks.receiptUpdateOne.mockReturnValue(queryWith({ acknowledged: true, matchedCount: 1 }));
		modelMocks.studentFindOneAndUpdate
			.mockReturnValueOnce(queryWith(studentRecord({ active: false, sessionVersion: 5 })))
			.mockReturnValue(queryWith(studentRecord({ active: false, sessionVersion: 6 })));
		modelMocks.studentDeleteOne.mockReturnValue(queryWith({ deletedCount: 1 }));
	});

	it("exports retained projects and reviews without credential material", async () => {
		await withRuntime(async baseUrl => {
			const response = await request(baseUrl, `/students/${studentID}/export`, "POST", {
				teacherPassword: "teacher-passphrase"
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(response.headers.get("content-disposition")).toContain("student-one-classroom-records.json");
			expect(body).toMatchObject({
				schemaVersion: 2,
				operation: {
					kind: "student-record-export",
					performedBy: "Julio"
				},
				recordInventory: {
					pendingOAuthAttempts: 1,
					projects: 1,
					reviews: 1
				},
				student: {
					connectedProvider: "google",
					recordPreservation: {
						active: false,
						events: [],
						purpose: "ferpa-inspection-review"
					},
					username: "student-one"
				}
			});
			expect(body.projects[0].files[0].content).toBe("print('hello')");
			expect(body.reviews[0].note).toBe("Nice work");
			expect(JSON.stringify(body)).not.toMatch(
				/password-hash|access-code-hash|externalAuthSubjectHash|dataDeletionPendingAt|stateHash|codeVerifier|browserBinding/i
			);
			expect(modelMocks.projectFind.mock.results[0]?.value.cursor).toHaveBeenCalledOnce();
			expect(modelMocks.reviewFind.mock.results[0]?.value.cursor).toHaveBeenCalledOnce();
			expect(modelMocks.projectFind.mock.results[0]?.value.exec).not.toHaveBeenCalled();
			expect(modelMocks.reviewFind.mock.results[0]?.value.exec).not.toHaveBeenCalled();
		});
	});

	it("exports only remaining records for a held deletion-pending row", async () => {
		const deletionPendingAt = new Date("2026-08-02T14:00:00.000Z");
		modelMocks.studentFindById.mockReturnValue(
			queryWith(studentRecord({
				dataDeletionPendingAt: deletionPendingAt,
				recordPreservationHoldActive: false
			}))
		);

		await withRuntime(async baseUrl => {
			const denied = await request(
				baseUrl,
				`/students/${studentID}/export`,
				"POST",
				{ teacherPassword: "teacher-passphrase" }
			);
			expect(denied.status).toBe(409);
			await expect(denied.json()).resolves.toMatchObject({
				message: expect.stringContaining("Preserve the remaining records")
			});
			expect(modelMocks.projectFind).not.toHaveBeenCalled();
			expect(
				modelMocks.studentFindById.mock.results[0]?.value.select
			).toHaveBeenCalledWith(
				expect.stringContaining("+dataDeletionPendingAt")
			);

				modelMocks.studentFindById.mockReturnValue(
					queryWith(studentRecord({
						dataDeletionPendingAt: deletionPendingAt,
						recordPreservationHoldActive: true
					}))
			);
			const preserved = await request(
				baseUrl,
				`/students/${studentID}/export`,
				"POST",
				{ teacherPassword: "teacher-passphrase" }
			);
			const body = await preserved.json();
			expect(preserved.status).toBe(200);
			expect(body.student.recordPreservation.active).toBe(true);
			expect(body).not.toHaveProperty("receipt");
			expect(modelMocks.receiptFindOne).not.toHaveBeenCalled();
		});
	});

	it("requires Julio's password for export", async () => {
		await withRuntime(async baseUrl => {
			const response = await request(baseUrl, `/students/${studentID}/export`, "POST", {
				teacherPassword: "wrong"
			});
			expect(response.status).toBe(403);
			expect(modelMocks.projectFind).not.toHaveBeenCalled();
		});
	});

	it("rejects a mismatched deletion confirmation", async () => {
		await withRuntime(async baseUrl => {
			const response = await request(baseUrl, `/students/${studentID}`, "DELETE", {
				confirmUsername: "another-student",
				teacherPassword: "teacher-passphrase"
			});
			expect(response.status).toBe(409);
			expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("blocks manual deletion while an inspection or review hold is active", async () => {
		modelMocks.studentFindById.mockReturnValue(
			queryWith(studentRecord({ recordPreservationHoldActive: true }))
		);
		await withRuntime(async baseUrl => {
			const response = await request(
				baseUrl,
				`/students/${studentID}`,
				"DELETE",
				{
					confirmUsername: "student-one",
					teacherPassword: "teacher-passphrase"
				}
			);
			expect(response.status).toBe(409);
			await expect(response.json()).resolves.toMatchObject({
				message: expect.stringContaining("open inspection or review")
			});
			expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("revokes sessions before removing every student-owned collection", async () => {
		await withRuntime(async baseUrl => {
			const response = await request(baseUrl, `/students/${studentID}`, "DELETE", {
				confirmUsername: "STUDENT-ONE",
				teacherPassword: "teacher-passphrase"
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body).toMatchObject({
				deleted: true,
				deletedRecords: {
					oauthAttempts: 1,
					projects: 1,
					reviews: 1,
					students: 1
				},
				operation: {
					kind: "student-record-delete",
					performedBy: "Julio"
				},
				operatorFollowUp: {
					backupDeletionRequired: true
				},
				receipt: {
					status: "completed",
					subject: {
						studentID: studentID.toString(),
						username: "student-one"
					}
				}
			});
			expect(new Date(body.receipt.expiresAt).getTime() - new Date(body.receipt.completedAt).getTime()).toBe(
				90 * 24 * 60 * 60 * 1000
			);
			expect(modelMocks.receiptFindOneAndUpdate).toHaveBeenCalledWith(
				expect.objectContaining({
					operationID: expect.any(String),
					recordInventory: { $exists: false }
				}),
				expect.objectContaining({
					$set: expect.objectContaining({
						recordInventory: body.deletedRecords,
						status: "in-progress"
					}),
					$setOnInsert: expect.objectContaining({
						studentID,
						username: "student-one"
					})
				}),
				expect.objectContaining({ new: true, upsert: true })
			);
			expect(modelMocks.receiptUpdateOne).toHaveBeenCalledWith(
				{ operationID: body.operation.id },
				{
					$set: expect.objectContaining({
						deletedRecords: body.deletedRecords,
						status: "completed"
					})
				}
			);
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
				1,
				{
					_id: studentID,
					recordPreservationHoldActive: { $ne: true },
					sessionVersion: 4
				},
				{
					$inc: { sessionVersion: 1 },
					$set: expect.objectContaining({
						active: false,
						dataDeletionOperationID: body.operation.id,
						dataDeletionPendingAt: expect.any(Date),
						dataDeletionReason: "julio-request",
						dataDeletionRequestedAt: expect.any(Date)
					})
				},
				{ new: true }
			);
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
				2,
				{
					_id: studentID,
					dataDeletionOperationID: body.operation.id,
					sessionVersion: 5
				},
				{
					$inc: { sessionVersion: 1 },
					$set: expect.objectContaining({
						active: false,
						dataDeletionOperationID: body.operation.id,
						dataDeletionPendingAt: expect.any(Date),
						dataDeletionReason: "julio-request"
					})
				},
				{ new: true }
			);
			const firstFenceTimestamp =
				modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1].$set.dataDeletionPendingAt;
			const secondFenceTimestamp =
				modelMocks.studentFindOneAndUpdate.mock.calls[1]?.[1].$set.dataDeletionPendingAt;
			expect(secondFenceTimestamp).toBe(firstFenceTimestamp);
			expect(modelMocks.oauthDeleteMany).toHaveBeenCalledWith({
				studentID
			});
			expect(modelMocks.projectDeleteMany).toHaveBeenCalledWith({
				user: studentID
			});
			expect(modelMocks.reviewDeleteMany).toHaveBeenCalledWith({
				user: studentID
			});
			expect(modelMocks.studentDeleteOne).toHaveBeenCalledWith({
				_id: studentID,
				active: false,
				dataDeletionOperationID: body.operation.id,
				sessionVersion: 6
			});
		});
	});

	it("resumes legacy pending metadata from the same durable receipt", async () => {
		const operationID = "11111111-1111-4111-8111-111111111111";
		const requestedAt = new Date("2026-07-29T12:30:00.000Z");
		const pendingAt = new Date("2026-07-29T12:45:00.000Z");
		const inventory = {
			oauthAttempts: 1,
			projects: 1,
			reviews: 1,
			students: 1
		};
		modelMocks.studentFindById.mockReturnValue(
			queryWith(
				studentRecord({
					active: false,
					dataDeletionOperationID: operationID,
					dataDeletionPendingAt: pendingAt
				})
			)
		);
		modelMocks.receiptFindOne.mockReturnValue(
			queryWith({
				_id: new Types.ObjectId(),
				createdAt: requestedAt,
				expiresAt: new Date("2026-10-27T12:30:00.000Z"),
				operationID,
				reason: "retention-expiry",
				recordInventory: inventory,
				requestedAt,
				status: "needs-retry",
				studentID,
				updatedAt: pendingAt,
				username: "student-one"
			})
		);

		await withRuntime(async baseUrl => {
			const response = await request(baseUrl, `/students/${studentID}`, "DELETE", {
				confirmUsername: "student-one",
				teacherPassword: "teacher-passphrase"
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body).toMatchObject({
				deletedRecords: inventory,
				operation: {
					id: operationID,
					performedAt: requestedAt.toISOString()
				},
				receipt: {
					reason: "retention-expiry"
				}
			});
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
				1,
				expect.objectContaining({
					_id: studentID,
					dataDeletionOperationID: operationID,
					sessionVersion: 4
				}),
				expect.any(Object),
				{ new: true }
			);
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
				2,
				expect.objectContaining({
					_id: studentID,
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
			expect(modelMocks.receiptFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("does not present receipt inventory as deleted before receipt completion", async () => {
		modelMocks.receiptUpdateOne.mockRejectedValueOnce(new Error("receipt completion unavailable"));

		await withRuntime(async baseUrl => {
			const response = await request(baseUrl, `/students/${studentID}`, "DELETE", {
				confirmUsername: "student-one",
				teacherPassword: "teacher-passphrase"
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.deletedRecords).toEqual({
				oauthAttempts: 1,
				projects: 1,
				reviews: 1,
				students: 1
			});
			expect(body.receipt).toMatchObject({
				deletedRecords: null,
				status: "in-progress"
			});
		});
	});

	it("waits for an in-flight project write before sweeping student records", async () => {
		let releaseWrite!: () => void;
		let writeStarted!: () => void;
		const started = new Promise<void>(resolve => {
			writeStarted = resolve;
		});
		const held = new Promise<void>(resolve => {
			releaseWrite = resolve;
		});
		modelMocks.heldProjectWrite.mockImplementation(async () => {
			writeStarted();
			await held;
		});

		await withRuntime(async baseUrl => {
			const writeResponse = fetch(`${baseUrl}/students/${studentID}/held-project-write`, { method: "POST" });
			await started;

			const deletionResponse = request(baseUrl, `/students/${studentID.toString().toUpperCase()}`, "DELETE", {
				confirmUsername: "student-one",
				teacherPassword: "teacher-passphrase"
			});
			await vi.waitFor(() => {
				expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalled();
			});
			expect(modelMocks.projectDeleteMany).not.toHaveBeenCalled();

			releaseWrite();
			expect((await writeResponse).status).toBe(204);
			expect((await deletionResponse).status).toBe(200);
			expect(modelMocks.projectDeleteMany).toHaveBeenCalledWith({
				user: studentID
			});

			const lateWrite = await fetch(`${baseUrl}/students/${studentID}/held-project-write`, { method: "POST" });
			expect(lateWrite.status).toBe(409);
			expect(modelMocks.heldProjectWrite).toHaveBeenCalledOnce();
		});
	});

	it("keeps an aborted project write leased until its controller settles", async () => {
		let responseClosed!: () => void;
		let releaseWrite!: () => void;
		let writeStarted!: () => void;
		const closed = new Promise<void>(resolve => {
			responseClosed = resolve;
		});
		const started = new Promise<void>(resolve => {
			writeStarted = resolve;
		});
		const held = new Promise<void>(resolve => {
			releaseWrite = resolve;
		});
		modelMocks.heldProjectWrite.mockImplementation(async (response: Response) => {
			response.once("close", responseClosed);
			writeStarted();
			await held;
		});

		await withRuntime(async baseUrl => {
			const abortController = new AbortController();
			const abortedWrite = fetch(
				`${baseUrl}/students/${studentID}/held-project-write`,
				{ method: "POST", signal: abortController.signal }
			).catch(error => error);
			await started;
			abortController.abort();
			await abortedWrite;
			await closed;

			let deletionSettled = false;
			const deletionResponse = request(
				baseUrl,
				`/students/${studentID}`,
				"DELETE",
				{
					confirmUsername: "student-one",
					teacherPassword: "teacher-passphrase"
				}
			).then(response => {
				deletionSettled = true;
				return response;
			});
			await vi.waitFor(() => {
				expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledOnce();
			});
			await new Promise(resolve => setTimeout(resolve, 25));
			expect(deletionSettled).toBe(false);
			expect(modelMocks.projectDeleteMany).not.toHaveBeenCalled();

			releaseWrite();
			expect((await deletionResponse).status).toBe(200);
			expect(modelMocks.projectDeleteMany).toHaveBeenCalledWith({
				user: studentID
			});
		});
	});

	it("waits for an in-flight streamed export before sweeping student records", async () => {
		let releaseExport!: () => void;
		let exportCursorStarted!: () => void;
		const started = new Promise<void>(resolve => {
			exportCursorStarted = resolve;
		});
		const held = new Promise<void>(resolve => {
			releaseExport = resolve;
		});
		const exportQuery = {
			cursor: vi.fn(() => ({
				async *[Symbol.asyncIterator]() {
					exportCursorStarted();
					await held;
					yield {
						_id: new Types.ObjectId(),
						files: [{ content: "print('held')", name: "main.py" }],
						title: "Held export",
						user: studentID
					};
				}
			})),
			lean: vi.fn(),
			sort: vi.fn()
		};
		exportQuery.sort.mockReturnValue(exportQuery);
		exportQuery.lean.mockReturnValue(exportQuery);
		modelMocks.projectFind.mockReturnValue(exportQuery);

		await withRuntime(async baseUrl => {
			const exportResponse = await request(baseUrl, `/students/${studentID}/export`, "POST", {
				teacherPassword: "teacher-passphrase"
			});
			const exportBody = exportResponse.text();
			await started;

			const deletionResponse = request(baseUrl, `/students/${studentID}`, "DELETE", {
				confirmUsername: "student-one",
				teacherPassword: "teacher-passphrase"
			});
			await vi.waitFor(() => {
				expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalled();
			});
			expect(modelMocks.projectDeleteMany).not.toHaveBeenCalled();

			releaseExport();
			await expect(exportBody).resolves.toContain("Held export");
			expect((await deletionResponse).status).toBe(200);
			expect(modelMocks.projectDeleteMany).toHaveBeenCalledWith({
				user: studentID
			});
		});
	});

	it("lists durable subject-linked deletion receipts for Julio", async () => {
		modelMocks.receiptFind.mockReturnValue(
			queryWith([
				{
					operationID: "47b3ce74-5bcc-4a04-8dd4-c362e5f43886",
					studentID,
					username: "student-one",
					status: "completed",
					requestedAt: new Date("2026-07-29T12:00:00.000Z"),
					completedAt: new Date("2026-07-29T12:00:01.000Z"),
					expiresAt: new Date("2026-10-27T12:00:00.000Z"),
					deletedRecords: {
						oauthAttempts: 1,
						projects: 1,
						reviews: 1,
						students: 1
					}
				},
				{
					operationID: "22222222-2222-4222-8222-222222222222",
					studentID,
					username: "student-one",
					status: "in-progress",
					requestedAt: new Date("2026-07-29T11:00:00.000Z"),
					// Even a stale legacy value must not be presented as a
					// completed deletion count.
					deletedRecords: {
						oauthAttempts: 9,
						projects: 9,
						reviews: 9,
						students: 1
					}
				}
			])
		);

		await withRuntime(async baseUrl => {
			const response = await fetch(`${baseUrl}/student-deletion-receipts`);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.retentionDays).toBe(90);
			expect(body.receipts[0]).toMatchObject({
				operationID: "47b3ce74-5bcc-4a04-8dd4-c362e5f43886",
				status: "completed",
				subject: {
					studentID: studentID.toString(),
					username: "student-one"
				}
			});
			expect(modelMocks.receiptFind).toHaveBeenCalledWith({
				$or: [
					{
						status: { $in: ["in-progress", "needs-retry"] }
					},
					{
						expiresAt: { $gt: expect.any(Date) },
						status: "completed"
					}
				]
			});
			expect(body.receipts[1].deletedRecords).toBeNull();
			expect(body.receipts[1].expiresAt).toBeNull();
		});
	});
});
