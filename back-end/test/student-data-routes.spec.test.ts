import type { Server } from "node:http";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	heldProjectWrite: vi.fn(),
	oauthCountDocuments: vi.fn(),
	oauthDeleteMany: vi.fn(),
	projectDeleteMany: vi.fn(),
	projectFind: vi.fn(),
	reviewDeleteMany: vi.fn(),
	reviewFind: vi.fn(),
	receiptCreate: vi.fn(),
	receiptFind: vi.fn(),
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
		deleteMany: modelMocks.projectDeleteMany,
		find: modelMocks.projectFind
	}
}));
vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		deleteMany: modelMocks.reviewDeleteMany,
		find: modelMocks.reviewFind
	}
}));
vi.mock("../src/models/schemas/StudentDataDeletionReceipt.js", () => ({
	STUDENT_DELETION_RECEIPT_RETENTION_DAYS: 90,
	StudentDataDeletionReceipt: {
		create: modelMocks.receiptCreate,
		find: modelMocks.receiptFind,
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
const { requireStudentDataWriteLease, resetStudentDataWriteBarriersForTests } =
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
	app.post("/students/:studentID/export", requireStudentDataWriteLease, exportStudentData);
	app.delete("/students/:studentID", deleteStudentData);
	app.get("/student-deletion-receipts", listStudentDeletionReceipts);
	app.post("/students/:studentID/held-project-write", requireStudentDataWriteLease, async (_req, res) => {
		await modelMocks.heldProjectWrite();
		res.sendStatus(204);
	});

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
		modelMocks.oauthDeleteMany.mockReturnValue(queryWith({ deletedCount: 1 }));
		modelMocks.projectDeleteMany.mockReturnValue(queryWith({ deletedCount: 1 }));
		modelMocks.reviewDeleteMany.mockReturnValue(queryWith({ deletedCount: 1 }));
		modelMocks.receiptCreate.mockResolvedValue({});
		modelMocks.receiptFind.mockReturnValue(queryWith([]));
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
			expect(modelMocks.receiptCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					operationID: expect.any(String),
					studentID,
					username: "student-one",
					status: "in-progress"
				})
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
				{ _id: studentID, sessionVersion: 4 },
				{
					$inc: { sessionVersion: 1 },
					$set: {
						active: false,
						dataDeletionPendingAt: expect.any(Date)
					}
				},
				{ new: true }
			);
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenNthCalledWith(
				2,
				{ _id: studentID },
				{
					$inc: { sessionVersion: 1 },
					$set: {
						active: false,
						dataDeletionPendingAt: expect.any(Date)
					}
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
				sessionVersion: 6
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
				}
			])
		);

		await withRuntime(async baseUrl => {
			const response = await fetch(`${baseUrl}/student-deletion-receipts`);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body).toMatchObject({
				retentionDays: 90,
				receipts: [
					{
						operationID: "47b3ce74-5bcc-4a04-8dd4-c362e5f43886",
						status: "completed",
						subject: {
							studentID: studentID.toString(),
							username: "student-one"
						}
					}
				]
			});
			expect(modelMocks.receiptFind).toHaveBeenCalledWith({
				expiresAt: { $gt: expect.any(Date) }
			});
		});
	});
});
