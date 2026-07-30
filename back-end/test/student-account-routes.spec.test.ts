import type { Server } from "node:http";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN_SINGLETON_ID } from "../src/security/adminIdentity.js";
import {
	ACCESS_CODE_LIFETIME_MS,
	hashStudentCredential,
	normalizeStudentAccessCode,
	studentAccessCodeExpiry,
	STUDENT_SETUP_SESSION_MS
} from "../src/security/studentCredentials.js";

const modelMocks = vi.hoisted(() => ({
	adminFindById: vi.fn(),
	adminFindOne: vi.fn(),
	studentCreate: vi.fn(),
	studentFind: vi.fn(),
	studentFindById: vi.fn(),
	studentFindByIdAndUpdate: vi.fn(),
	studentFindOne: vi.fn(),
	studentFindOneAndUpdate: vi.fn(),
	studentUpdateOne: vi.fn(),
	pythonProjectAggregate: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: {
		findById: modelMocks.adminFindById,
		findOne: modelMocks.adminFindOne
	}
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		create: modelMocks.studentCreate,
		find: modelMocks.studentFind,
		findById: modelMocks.studentFindById,
		findByIdAndUpdate: modelMocks.studentFindByIdAndUpdate,
		findOne: modelMocks.studentFindOne,
		findOneAndUpdate: modelMocks.studentFindOneAndUpdate,
		updateOne: modelMocks.studentUpdateOne
	}
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		aggregate: modelMocks.pythonProjectAggregate
	}
}));

vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {}
}));

const { validStudent } = await import("../src/middleware/auth.js");
const { mountRuntimeAccountRoutes } = await import("../src/routes/runtimeAccountRoutes.js");

const studentID = new Types.ObjectId();
const now = new Date("2026-07-29T12:00:00.000Z");
const passwordSetupRequestID = "setup_request_1234567890abcdef123456";

function makeStudent(overrides: Record<string, unknown> = {}) {
	return {
		_id: studentID,
		username: "student-one",
		active: true,
		sessionVersion: 4,
		failedLoginAttempts: 0,
		activeProjectCount: 0,
		activeProjectBytes: 0,
		passwordSetAt: undefined,
		lastLoginAt: undefined,
		retentionExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
		retentionPolicyDays: 90,
		createdAt: now,
		updatedAt: now,
		...overrides
	};
}

function queryWith<T>(result: T) {
	const query = {
		select: vi.fn(() => query),
		sort: vi.fn(() => query),
		limit: vi.fn(() => query),
		exec: vi.fn().mockResolvedValue(result),
		then: (resolve: (value: T) => unknown, reject: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(resolve, reject),
		catch: (reject: (reason: unknown) => unknown) => Promise.resolve(result).catch(reject)
	};
	return query;
}

interface TestSession {
	adminID?: string;
	adminExpiresAt?: number;
	adminLastActivityAt?: number;
	adminSessionVersion?: number;
	studentID?: string;
	studentExpiresAt?: number;
	studentSessionVersion?: number;
	studentAuthLevel?: "setup" | "full";
	studentSetupExpiresAt?: number;
	studentLastActivityAt?: number;
}

async function withRuntime<T>(
	initialSession: TestSession,
	run: (baseUrl: string, session: TestSession) => Promise<T>
): Promise<T> {
	const app = express();
	const session = {
		...initialSession,
		adminExpiresAt: initialSession.adminID
			? (initialSession.adminExpiresAt ?? Date.now() + 8 * 60 * 60 * 1000)
			: undefined,
		adminLastActivityAt: initialSession.adminID ? (initialSession.adminLastActivityAt ?? Date.now()) : undefined,
		adminSessionVersion: initialSession.adminID ? (initialSession.adminSessionVersion ?? 0) : undefined,
		studentExpiresAt:
			initialSession.studentAuthLevel === "full"
				? (initialSession.studentExpiresAt ?? Date.now() + 8 * 60 * 60 * 1000)
				: undefined,
		studentLastActivityAt:
			initialSession.studentAuthLevel === "full"
				? (initialSession.studentLastActivityAt ?? Date.now())
				: undefined,
		studentSetupExpiresAt:
			initialSession.studentAuthLevel === "setup"
				? (initialSession.studentSetupExpiresAt ?? Date.now() + 30 * 60 * 1000)
				: undefined
	};
	app.use(express.json());
	app.use((req: any, _res, next) => {
		req.session = session;
		req.sessionOptions = {};
		next();
	});
	app.get("/student-read-probe", validStudent, (_req, res) => {
		res.sendStatus(204);
	});
	mountRuntimeAccountRoutes(app, {
		analyticsRetentionDays: 90,
		studentAccountsEnabled: true,
		studentOAuthEnabled: true,
		studentRecordRetentionDays: 90
	});

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`, session);
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

function postJson(baseUrl: string, path: string, body: object) {
	return fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			"x-classroom-request": "1"
		},
		body: JSON.stringify(body)
	});
}

function putJson(baseUrl: string, path: string, body: object) {
	return fetch(`${baseUrl}${path}`, {
		method: "PUT",
		headers: {
			"content-type": "application/json",
			"x-classroom-request": "1"
		},
		body: JSON.stringify(body)
	});
}

function patchJson(baseUrl: string, path: string, body: object) {
	return fetch(`${baseUrl}${path}`, {
		method: "PATCH",
		headers: {
			"content-type": "application/json",
			"x-classroom-request": "1"
		},
		body: JSON.stringify(body)
	});
}

describe("teacher-provisioned student accounts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		const admin = {
			_id: new Types.ObjectId(ADMIN_SINGLETON_ID),
			name: "Julio",
			email: "julio@example.org",
			sessionVersion: 0,
			comparePassword: vi.fn(async value => value === "teacher-passphrase")
		};
		modelMocks.adminFindById.mockReturnValue(queryWith(admin));
		modelMocks.adminFindOne.mockReturnValue(
			queryWith({
				...admin,
				comparePassword: vi.fn().mockResolvedValue(true)
			})
		);
		modelMocks.studentFind.mockReturnValue(queryWith([makeStudent()]));
		modelMocks.studentFindById.mockReturnValue(queryWith(makeStudent()));
		modelMocks.studentUpdateOne.mockResolvedValue({ modifiedCount: 1 });
		modelMocks.pythonProjectAggregate.mockResolvedValue([]);
	});

	it("expires teacher-issued codes exactly seven days after issuance", () => {
		const issuedAt = new Date("2026-07-29T12:00:00.000Z");
		expect(studentAccessCodeExpiry(issuedAt).getTime() - issuedAt.getTime()).toBe(ACCESS_CODE_LIFETIME_MS);
		expect(ACCESS_CODE_LIFETIME_MS).toBe(7 * 24 * 60 * 60 * 1000);
	});

	it("creates a student only after Julio re-enters his password", async () => {
		modelMocks.studentCreate.mockImplementation(async payload =>
			makeStudent({
				...payload,
				sessionVersion: 0
			})
		);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const denied = await postJson(baseUrl, "/admins/students", {
				username: "student-two",
				teacherPassword: "wrong"
			});
			expect(denied.status).toBe(403);
			expect(modelMocks.studentCreate).not.toHaveBeenCalled();

			const response = await postJson(baseUrl, "/admins/students", {
				username: " Student-Two ",
				teacherPassword: "teacher-passphrase"
			});
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(response.headers.get("cache-control")).toBe("no-store");
			expect(body.accessCode).toMatch(/^[2-9A-HJ-KM-NP-Z]{4}(?:-[2-9A-HJ-KM-NP-Z]{4}){4}$/);
			expect(normalizeStudentAccessCode(body.accessCode)).toHaveLength(20);
			expect(body.student).toMatchObject({
				_id: studentID.toString(),
				username: "student-two",
				active: true,
				credentialState: "access-code",
				passwordSetAt: null,
				lastLoginAt: null,
				createdAt: now.toISOString(),
				updatedAt: now.toISOString()
			});
			expect(body.student.accessCodeExpiresAt).toEqual(expect.any(String));
			const createPayload = modelMocks.studentCreate.mock.calls[0]?.[0];
			expect(createPayload.accessCodeHash).not.toBe(body.accessCode);
			expect(JSON.stringify(body)).not.toContain(createPayload.accessCodeHash);
		});
	});

	it("corrects only the student alias after Julio re-verifies", async () => {
		modelMocks.studentFindOneAndUpdate.mockReturnValue(
			queryWith(
				makeStudent({
					passwordHash: "password-hash",
					sessionVersion: 5,
					username: "river-8"
				})
			)
		);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const denied = await patchJson(baseUrl, `/admins/students/${studentID}/username`, {
				teacherPassword: "wrong",
				username: "river-8"
			});
			expect(denied.status).toBe(403);
			expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();

			const response = await patchJson(baseUrl, `/admins/students/${studentID}/username`, {
				teacherPassword: "teacher-passphrase",
				username: " River-8 "
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.student).toMatchObject({
				_id: studentID.toString(),
				username: "river-8"
			});
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledWith(
				{
					_id: studentID.toString(),
					dataDeletionPendingAt: { $exists: false }
				},
				{
					$inc: { sessionVersion: 1 },
					$set: { username: "river-8" }
				},
				{ new: true }
			);
		});
	});

	it("atomically consumes a normalized one-time code into setup-only access", async () => {
		const displayCode = "ABCD-EFGH-JKMP-QRST-UVWX";
		const accessCodeHash = await hashStudentCredential(normalizeStudentAccessCode(displayCode));
		const student = makeStudent({
			accessCodeHash,
			accessCodeExpiresAt: new Date(Date.now() + 60_000)
		});
		modelMocks.studentFindOne.mockReturnValue(queryWith(student));
		modelMocks.studentFindOneAndUpdate.mockReturnValue(
			queryWith(
				makeStudent({
					sessionVersion: 5,
					lastLoginAt: now
				})
			)
		);

		await withRuntime({}, async (baseUrl, session) => {
			const response = await postJson(baseUrl, "/students/session", {
				username: "STUDENT-ONE",
				secret: "abcd efgh jkmp qrst uvwx"
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.requiresPasswordSetup).toBe(true);
			expect(session.adminID).toBeUndefined();
			expect(session.studentID).toBe(studentID.toString());
			expect(session.studentSessionVersion).toBe(5);
			expect(session.studentAuthLevel).toBe("setup");
			expect(session.studentSetupExpiresAt).toBeGreaterThan(Date.now());
			expect(session.studentLastActivityAt).toBeUndefined();
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledWith(
				expect.objectContaining({
					_id: studentID,
					accessCodeHash,
					sessionVersion: 4
				}),
				expect.objectContaining({
					$inc: { sessionVersion: 1 },
					$set: expect.objectContaining({
						pendingSetupCodeHash: accessCodeHash
					}),
					$unset: expect.objectContaining({
						accessCodeHash: 1,
						lastPasswordSetupRequestID: 1
					})
				}),
				{ new: true }
			);
			const consumeUpdate = modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1];
			expect(consumeUpdate.$unset).not.toHaveProperty("accessCodeExpiresAt");
			expect(consumeUpdate.$set.accessCodeExpiresAt.getTime() - consumeUpdate.$set.lastLoginAt.getTime()).toBe(
				STUDENT_SETUP_SESSION_MS
			);
		});
	});

	it("never accepts a consumed pending setup code for login again", async () => {
		const accessCode = "ABCD-EFGH-JKMP-QRST-UVWX";
		const pendingSetupCodeHash = await hashStudentCredential(normalizeStudentAccessCode(accessCode));
		const accessCodeExpiresAt = new Date(Date.now() + 60_000);
		modelMocks.studentFindOne.mockReturnValue(
			queryWith(
				makeStudent({
					pendingSetupCodeHash,
					accessCodeExpiresAt,
					sessionVersion: 5
				})
			)
		);

		await withRuntime({}, async baseUrl => {
			const response = await postJson(baseUrl, "/students/session", {
				username: "student-one",
				secret: accessCode
			});

			expect(response.status).toBe(403);
			await expect(response.json()).resolves.toEqual({
				message: "Invalid username or credential."
			});
			expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
			expect(modelMocks.studentUpdateOne).toHaveBeenCalledWith(
				{ _id: studentID, active: true },
				[
					{
						$set: {
							failedLoginAttempts: {
								$cond: [
									{
										$gte: [
											{
												$add: [
													{
														$ifNull: ["$failedLoginAttempts", 0]
													},
													1
												]
											},
											5
										]
									},
									0,
									{
										$add: [
											{
												$ifNull: ["$failedLoginAttempts", 0]
											},
											1
										]
									}
								]
							},
							lockedUntil: {
								$cond: [expect.any(Object), expect.any(Date), "$lockedUntil"]
							}
						}
					}
				],
				{ updatePipeline: true }
			);
		});
	});

	it("rejects a concurrent code request after another request changed the setup version", async () => {
		const accessCode = "ABCD-EFGH-JKMP-QRST-UVWX";
		const accessCodeHash = await hashStudentCredential(normalizeStudentAccessCode(accessCode));
		modelMocks.studentFindOne.mockReturnValue(
			queryWith(
				makeStudent({
					accessCodeHash,
					accessCodeExpiresAt: new Date(Date.now() + 60_000)
				})
			)
		);
		modelMocks.studentFindOneAndUpdate.mockReturnValue(queryWith(null));

		await withRuntime({}, async baseUrl => {
			const response = await postJson(baseUrl, "/students/session", {
				username: "student-one",
				secret: accessCode
			});

			expect(response.status).toBe(403);
			await expect(response.json()).resolves.toEqual({
				message: "Invalid username or credential."
			});
		});
	});

	it("signs in with the student password and clears failed-login state", async () => {
		const passwordHash = await hashStudentCredential("three calm words");
		modelMocks.studentFindOne.mockReturnValue(
			queryWith(
				makeStudent({
					passwordHash,
					passwordSetAt: now,
					failedLoginAttempts: 2
				})
			)
		);
		modelMocks.studentFindOneAndUpdate.mockReturnValue(
			queryWith(
				makeStudent({
					sessionVersion: 5,
					passwordSetAt: now,
					lastLoginAt: now
				})
			)
		);

		await withRuntime({}, async (baseUrl, session) => {
			const response = await postJson(baseUrl, "/students/session", {
				username: "student-one",
				secret: "three calm words"
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(response.headers.get("set-cookie")).toContain("cs_avasan_student_oauth_google=");
			expect(response.headers.get("set-cookie")).toContain("cs_avasan_student_oauth_apple=");
			expect(body.requiresPasswordSetup).toBe(false);
			expect(session.adminID).toBeUndefined();
			expect(session.studentAuthLevel).toBe("full");
			expect(session.studentSessionVersion).toBe(5);
			expect(session.studentExpiresAt).toBeGreaterThan(Date.now());
			expect(session.studentLastActivityAt).toEqual(expect.any(Number));
			expect(session.studentSetupExpiresAt).toBeUndefined();
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledWith(
				expect.objectContaining({
					_id: studentID,
					passwordHash,
					sessionVersion: 4
				}),
				{
					$inc: { sessionVersion: 1 },
					$set: expect.objectContaining({
						failedLoginAttempts: 0,
						lastLoginAt: expect.any(Date),
						retentionExpiresAt: expect.any(Date)
					}),
					$unset: { lockedUntil: 1 }
				},
				{ new: true }
			);
			const loginUpdate = modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[1];
			expect(loginUpdate.$set.retentionExpiresAt.getTime() - loginUpdate.$set.lastLoginAt.getTime()).toBe(
				90 * 24 * 60 * 60 * 1000
			);
		});
	});

	it("requires explicit logout before replacing a live identity", async () => {
		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 4,
				studentAuthLevel: "full"
			},
			async baseUrl => {
				const response = await postJson(baseUrl, "/students/session", {
					username: "student-two",
					secret: "another password"
				});

				expect(response.status).toBe(409);
			}
		);
		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const response = await postJson(baseUrl, "/students/session", {
				username: "student-two",
				secret: "another password"
			});

			expect(response.status).toBe(409);
		});
		expect(modelMocks.studentFindOne).not.toHaveBeenCalled();
	});

	it("requires a distinct nonblank password before project access", async () => {
		const accessCode = "ABCD-EFGH-JKMP-QRST-UVWX";
		const pendingSetupCodeHash = await hashStudentCredential(normalizeStudentAccessCode(accessCode));
		const setupStudent = makeStudent({
			pendingSetupCodeHash,
			sessionVersion: 5
		});
		modelMocks.studentFindById.mockReturnValue(queryWith(setupStudent));
		modelMocks.studentFindOneAndUpdate.mockReturnValue(
			queryWith(
				makeStudent({
					sessionVersion: 6,
					passwordSetAt: now,
					lastLoginAt: now
				})
			)
		);

		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 5,
				studentAuthLevel: "setup"
			},
			async (baseUrl, session) => {
				const short = await putJson(baseUrl, "/students/session/password", {
					password: "short",
					requestID: passwordSetupRequestID
				});
				expect(short.status).toBe(400);

				const usernamePassword = await putJson(baseUrl, "/students/session/password", {
					password: "STUDENT-ONE",
					requestID: passwordSetupRequestID
				});
				expect(usernamePassword.status).toBe(400);

				const blank = await putJson(baseUrl, "/students/session/password", {
					password: "          ",
					requestID: passwordSetupRequestID
				});
				expect(blank.status).toBe(400);

				const reusedCode = await putJson(baseUrl, "/students/session/password", {
					password: accessCode,
					requestID: passwordSetupRequestID
				});
				expect(reusedCode.status).toBe(400);
				await expect(reusedCode.json()).resolves.toEqual({
					message: "Password must be different from the one-time access code."
				});

				const response = await putJson(baseUrl, "/students/session/password", {
					password: "three calm words",
					requestID: passwordSetupRequestID
				});
				const responseBody = await response.json();
				expect(response.status).toBe(200);
				expect(session.studentSessionVersion).toBe(6);
				expect(session.studentAuthLevel).toBe("full");
				expect(session.studentLastActivityAt).toEqual(expect.any(Number));
				expect(session.studentSetupExpiresAt).toBeUndefined();
				expect(responseBody.passwordSetupRequestID).toBe(passwordSetupRequestID);
				const update = modelMocks.studentFindOneAndUpdate.mock.calls.at(-1)?.[1];
				expect(update.$set.passwordHash).toEqual(expect.any(String));
				expect(update.$set.lastPasswordSetupRequestID).toBe(passwordSetupRequestID);
				expect(update.$unset.pendingSetupCodeHash).toBe(1);
				expect(update.$unset.accessCodeExpiresAt).toBe(1);
				expect(JSON.stringify(responseBody)).not.toContain(update.$set.passwordHash);
			}
		);
	});

	it("recovers only the exact completed password setup request", async () => {
		const passwordSetAt = new Date();
		const password = "three calm words";
		const completedStudent = makeStudent({
			lastPasswordSetupRequestID: passwordSetupRequestID,
			passwordHash: await hashStudentCredential(password),
			passwordSetAt,
			sessionVersion: 6
		});
		modelMocks.studentFindById.mockReturnValue(queryWith(completedStudent));

		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 5,
				studentAuthLevel: "setup"
			},
			async (baseUrl, session) => {
				const response = await putJson(baseUrl, "/students/session/password", {
					password,
					requestID: passwordSetupRequestID
				});
				const body = await response.json();

				expect(response.status).toBe(200);
				expect(body.passwordSetupRequestID).toBe(passwordSetupRequestID);
				expect(session.studentAuthLevel).toBe("full");
				expect(session.studentSessionVersion).toBe(6);
				expect(session.studentExpiresAt).toBe(passwordSetAt.getTime() + 8 * 60 * 60 * 1000);
				expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
			}
		);
	});

	it("rejects the same setup request ID when its replayed password differs", async () => {
		const completedStudent = makeStudent({
			lastPasswordSetupRequestID: passwordSetupRequestID,
			passwordHash: await hashStudentCredential("winning calm words"),
			passwordSetAt: new Date(),
			sessionVersion: 6
		});
		modelMocks.studentFindById.mockReturnValue(queryWith(completedStudent));

		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 5,
				studentAuthLevel: "setup"
			},
			async (baseUrl, session) => {
				const response = await putJson(baseUrl, "/students/session/password", {
					password: "different calm words",
					requestID: passwordSetupRequestID
				});

				expect(response.status).toBe(409);
				await expect(response.json()).resolves.toEqual({
					message: "Password setup was completed with a different payload."
				});
				expect(session.studentAuthLevel).toBe("setup");
				expect(session.studentSessionVersion).toBe(5);
				expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
			}
		);
	});

	it("rejects a concurrent same-ID setup loser whose password payload differs", async () => {
		const winningPassword = "winning calm words";
		const pendingSetupCodeHash = await hashStudentCredential("ACCESSCODE");
		modelMocks.studentFindById
			.mockReturnValueOnce(
				queryWith(
					makeStudent({
						pendingSetupCodeHash,
						sessionVersion: 5
					})
				)
			)
			.mockReturnValueOnce(
				queryWith(
					makeStudent({
						lastPasswordSetupRequestID: passwordSetupRequestID,
						passwordHash: await hashStudentCredential(winningPassword),
						passwordSetAt: new Date(),
						sessionVersion: 6
					})
				)
			);
		modelMocks.studentFindOneAndUpdate.mockReturnValue(queryWith(null));

		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 5,
				studentAuthLevel: "setup"
			},
			async (baseUrl, session) => {
				const response = await putJson(baseUrl, "/students/session/password", {
					password: "different calm words",
					requestID: passwordSetupRequestID
				});

				expect(response.status).toBe(409);
				await expect(response.json()).resolves.toEqual({
					message: "Password setup was completed with a different payload."
				});
				expect(session.studentAuthLevel).toBe("setup");
				expect(session.studentSessionVersion).toBe(5);
			}
		);
	});

	it("does not let a different concurrent setup request claim success or overwrite the cookie", async () => {
		const winningRequestID = "winning_setup_request_1234567890abcdef";
		const losingRequestID = "losing_setup_request_1234567890abcdef0";
		modelMocks.studentFindById.mockReturnValue(
			queryWith(
				makeStudent({
					lastPasswordSetupRequestID: winningRequestID,
					passwordHash: "stored-password-hash",
					passwordSetAt: new Date(),
					sessionVersion: 6
				})
			)
		);

		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 5,
				studentAuthLevel: "setup"
			},
			async (baseUrl, session) => {
				const response = await putJson(baseUrl, "/students/session/password", { requestID: losingRequestID });

				expect(response.status).toBe(409);
				expect(session.studentAuthLevel).toBe("setup");
				expect(session.studentSessionVersion).toBe(5);
				expect(session.studentID).toBe(studentID.toString());
				expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
			}
		);
	});

	it("requires the exact recovery header before a stale setup cookie can become full", async () => {
		const passwordSetAt = new Date();
		const completedStudent = makeStudent({
			lastPasswordSetupRequestID: passwordSetupRequestID,
			passwordHash: "stored-password-hash",
			passwordSetAt,
			sessionVersion: 6
		});
		modelMocks.studentFindById.mockReturnValue(queryWith(completedStudent));

		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 5,
				studentAuthLevel: "setup"
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/students/session`);

				await expect(response.json()).resolves.toEqual({
					student: null,
					requiresPasswordSetup: false
				});
				expect(session.studentID).toBeUndefined();
			}
		);

		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 5,
				studentAuthLevel: "setup"
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/students/session`, {
					headers: {
						"X-Password-Setup-Request-ID": passwordSetupRequestID
					}
				});
				const body = await response.json();

				expect(response.status).toBe(200);
				expect(body.passwordSetupRequestID).toBe(passwordSetupRequestID);
				expect(session.studentAuthLevel).toBe("full");
				expect(session.studentSessionVersion).toBe(6);
			}
		);
	});

	it("allows an authenticated full session to replay only its exact setup request", async () => {
		const password = "three calm words";
		const completedStudent = makeStudent({
			lastPasswordSetupRequestID: passwordSetupRequestID,
			passwordHash: await hashStudentCredential(password),
			passwordSetAt: new Date(),
			sessionVersion: 6
		});
		modelMocks.studentFindById.mockReturnValue(queryWith(completedStudent));

		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 6,
				studentAuthLevel: "full"
			},
			async baseUrl => {
				const response = await putJson(baseUrl, "/students/session/password", {
					password,
					requestID: passwordSetupRequestID
				});

				expect(response.status).toBe(200);
				await expect(response.json()).resolves.toMatchObject({
					passwordSetupRequestID,
					requiresPasswordSetup: false
				});
			}
		);
	});

	it("uses a generic failure and a short persistent cooldown", async () => {
		const passwordHash = await hashStudentCredential("correct passphrase");
		modelMocks.studentFindOne.mockReturnValue(
			queryWith(
				makeStudent({
					passwordHash,
					failedLoginAttempts: 4
				})
			)
		);

		await withRuntime({}, async baseUrl => {
			const response = await postJson(baseUrl, "/students/session", {
				username: "student-one",
				secret: "wrong passphrase"
			});
			expect(response.status).toBe(403);
			await expect(response.json()).resolves.toEqual({
				message: "Invalid username or credential."
			});
			expect(modelMocks.studentUpdateOne).toHaveBeenCalledWith(
				{ _id: studentID, active: true },
				[
					{
						$set: {
							failedLoginAttempts: {
								$cond: [expect.any(Object), 0, expect.any(Object)]
							},
							lockedUntil: {
								$cond: [expect.any(Object), expect.any(Date), "$lockedUntil"]
							}
						}
					}
				],
				{ updatePipeline: true }
			);
			const updatePipeline = modelMocks.studentUpdateOne.mock.calls[0]?.[1];
			const lockedUntil = updatePipeline[0].$set.lockedUntil.$cond[1];
			expect(lockedUntil.getTime() - Date.now()).toBeLessThanOrEqual(2 * 60 * 1000);
		});
	});

	it("resets access only after teacher verification and revokes old sessions", async () => {
		modelMocks.studentFindOneAndUpdate.mockReturnValue(
			queryWith(
				makeStudent({
					accessCodeHash: "new-access-code-hash",
					accessCodeExpiresAt: new Date(Date.now() + ACCESS_CODE_LIFETIME_MS),
					active: true,
					externalAuthProvider: "google",
					externalAuthSubjectHash: "a".repeat(64),
					sessionVersion: 8
				})
			)
		);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const denied = await postJson(baseUrl, `/admins/students/${studentID}/access-code`, {
				teacherPassword: "wrong"
			});
			expect(denied.status).toBe(403);

			const response = await postJson(baseUrl, `/admins/students/${studentID}/access-code`, {
				teacherPassword: "teacher-passphrase"
			});
			const body = await response.json();
			expect(response.status).toBe(200);
			expect(body.accessCode).toEqual(expect.any(String));
			expect(body.student.active).toBe(true);
			expect(body.student.credentialState).toBe("access-code");
			expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledWith(
				{
					_id: studentID.toString(),
					dataDeletionPendingAt: { $exists: false },
					retentionExpiresAt: { $gt: expect.any(Date) },
					sessionVersion: 4
				},
				expect.objectContaining({
					$inc: { sessionVersion: 1 },
					$set: expect.objectContaining({ active: true }),
					$unset: expect.objectContaining({
						externalAuthProvider: 1,
						externalAuthSubjectHash: 1,
						lastPasswordSetupRequestID: 1,
						pendingSetupCodeHash: 1,
						passwordHash: 1,
						passwordSetAt: 1
					})
				}),
				{ new: true }
			);
		});
	});

	it("cannot reactivate or reset access while permanent deletion is pending", async () => {
		modelMocks.studentFindById.mockReturnValue(
			queryWith(
				makeStudent({
					active: false,
					dataDeletionPendingAt: new Date("2026-07-29T12:05:00.000Z")
				})
			)
		);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const reactivate = await fetch(`${baseUrl}/admins/students/${studentID}`, {
				method: "PATCH",
				headers: {
					"content-type": "application/json",
					"x-classroom-request": "1"
				},
				body: JSON.stringify({ active: true })
			});
			const reset = await postJson(baseUrl, `/admins/students/${studentID}/access-code`, {
				teacherPassword: "teacher-passphrase"
			});

			expect(reactivate.status).toBe(409);
			expect(reset.status).toBe(409);
			expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("cannot reactivate or reset an account after its retention deadline", async () => {
		modelMocks.studentFindById.mockReturnValue(
			queryWith(
				makeStudent({
					active: false,
					passwordHash: "password-hash",
					retentionExpiresAt: new Date(Date.now() - 1)
				})
			)
		);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const reactivate = await patchJson(baseUrl, `/admins/students/${studentID}`, { active: true });
			const reset = await postJson(baseUrl, `/admins/students/${studentID}/access-code`, {
				teacherPassword: "teacher-passphrase"
			});

			expect(reactivate.status).toBe(409);
			expect(reset.status).toBe(409);
			expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("disabling revokes sessions and discards any unused access code", async () => {
		modelMocks.studentFindOneAndUpdate.mockReturnValue(
			queryWith(
				makeStudent({
					active: false,
					sessionVersion: 5
				})
			)
		);

		const lastActivityAt = Date.now() - 5 * 60 * 1000;
		await withRuntime(
			{
				adminID: ADMIN_SINGLETON_ID,
				adminLastActivityAt: lastActivityAt
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/admins/students/${studentID}`, {
					method: "PATCH",
					headers: {
						"content-type": "application/json",
						"x-classroom-request": "1"
					},
					body: JSON.stringify({ active: false })
				});

				expect(response.status).toBe(200);
				expect(session.adminLastActivityAt).toBe(lastActivityAt);
				expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledWith(
					{
						_id: studentID.toString(),
						dataDeletionPendingAt: { $exists: false },
						sessionVersion: 4
					},
					expect.objectContaining({
						$inc: { sessionVersion: 1 },
						$unset: expect.objectContaining({
							accessCodeHash: 1,
							accessCodeExpiresAt: 1,
							lastPasswordSetupRequestID: 1,
							pendingSetupCodeHash: 1
						})
					}),
					{ new: true }
				);
			}
		);
	});

	it("refreshes Admin inactivity only for an explicit same-origin activity heartbeat", async () => {
		const lastActivityAt = Date.now() - 5 * 60 * 1000;
		await withRuntime(
			{
				adminID: ADMIN_SINGLETON_ID,
				adminLastActivityAt: lastActivityAt
			},
			async (baseUrl, session) => {
				const heartbeat = await fetch(`${baseUrl}/admins/loggedin`, {
					headers: {
						"X-Admin-Activity": "1",
						"X-Classroom-Request": "1"
					}
				});

				expect(heartbeat.status).toBe(200);
				expect(session.adminLastActivityAt).toBeGreaterThan(lastActivityAt);
			}
		);
	});

	it("rejects a cross-site Admin activity heartbeat without refreshing inactivity", async () => {
		const lastActivityAt = Date.now() - 5 * 60 * 1000;
		await withRuntime(
			{
				adminID: ADMIN_SINGLETON_ID,
				adminLastActivityAt: lastActivityAt
			},
			async (baseUrl, session) => {
				const heartbeat = await fetch(`${baseUrl}/admins/loggedin`, {
					headers: {
						Origin: "https://attacker.example",
						"X-Admin-Activity": "1",
						"X-Classroom-Request": "1"
					}
				});

				expect(heartbeat.status).toBe(403);
				expect(session.adminLastActivityAt).toBe(lastActivityAt);
			}
		);
	});

	it("reports only safe credential lifecycle states to Julio", async () => {
		modelMocks.studentFind.mockReturnValue(
			queryWith([
				makeStudent({
					username: "has-password",
					passwordHash: "password-hash"
				}),
				makeStudent({
					username: "has-code",
					accessCodeHash: "current-code-hash",
					accessCodeExpiresAt: new Date(Date.now() + 60_000)
				}),
				makeStudent({
					username: "setting-password",
					pendingSetupCodeHash: "pending-code-hash",
					accessCodeExpiresAt: new Date(Date.now() + 60_000)
				}),
				makeStudent({
					username: "expired-setup",
					pendingSetupCodeHash: "expired-pending-code-hash",
					accessCodeExpiresAt: new Date(Date.now() - 60_000)
				}),
				makeStudent({
					username: "expired-code",
					accessCodeHash: "expired-code-hash",
					accessCodeExpiresAt: new Date(Date.now() - 60_000)
				}),
				makeStudent({ username: "needs-reset" })
			])
		);

		const lastActivityAt = Date.now() - 5 * 60 * 1000;
		await withRuntime(
			{
				adminID: ADMIN_SINGLETON_ID,
				adminLastActivityAt: lastActivityAt
			},
			async (baseUrl, session) => {
				for (let check = 0; check < 3; check += 1) {
					const validation = await fetch(`${baseUrl}/admins/loggedin`);
					expect(validation.status).toBe(200);
				}
				const response = await fetch(`${baseUrl}/admins/students`);
				const body = await response.json();

				expect(response.status).toBe(200);
				expect(session.adminLastActivityAt).toBe(lastActivityAt);
				expect(body.students.map((student: any) => student.credentialState)).toEqual([
					"password",
					"access-code",
					"setup",
					"expired-code",
					"expired-code",
					"none"
				]);
				expect(body.students[2].accessCodeExpiresAt).toEqual(expect.any(String));
				expect(JSON.stringify(body)).not.toMatch(
					/passwordHash|accessCodeHash|pendingSetupCodeHash|sessionVersion/
				);
			}
		);
	});

	it("adds only coarse project activity to Julio's named roster", async () => {
		const studentWithProjectsID = new Types.ObjectId();
		const studentWithoutProjectsID = new Types.ObjectId();
		const lastProjectSavedAt = new Date("2026-07-28T16:30:00.000Z");
		modelMocks.studentFind.mockReturnValue(
			queryWith([
				makeStudent({
					_id: studentWithProjectsID,
					username: "active-coder"
				}),
				makeStudent({
					_id: studentWithoutProjectsID,
					username: "new-coder"
				})
			])
		);
		modelMocks.pythonProjectAggregate.mockResolvedValue([
			{
				_id: studentWithProjectsID,
				lastProjectSavedAt,
				projectCount: 3
			}
		]);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const response = await fetch(`${baseUrl}/admins/students`);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.students).toEqual([
				expect.objectContaining({
					_id: studentWithProjectsID.toString(),
					lastProjectSavedAt: lastProjectSavedAt.toISOString(),
					projectCount: 3,
					username: "active-coder"
				}),
				expect.objectContaining({
					_id: studentWithoutProjectsID.toString(),
					lastProjectSavedAt: null,
					projectCount: 0,
					username: "new-coder"
				})
			]);
			expect(JSON.stringify(body)).not.toMatch(
				/projectName|projectTitle|source|files|passwordHash|accessCodeHash/
			);
		});

		expect(modelMocks.pythonProjectAggregate).toHaveBeenCalledWith([
			{
				$match: {
					deletedAt: { $exists: false },
					user: {
						$in: [studentWithProjectsID, studentWithoutProjectsID]
					}
				}
			},
			{
				$group: {
					_id: "$user",
					lastProjectSavedAt: { $max: "$updatedAt" },
					projectCount: { $sum: 1 }
				}
			}
		]);
	});

	it("rejects direct reactivation without a reusable credential", async () => {
		modelMocks.studentFindById.mockReturnValue(
			queryWith(
				makeStudent({
					active: false
				})
			)
		);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const response = await fetch(`${baseUrl}/admins/students/${studentID}`, {
				method: "PATCH",
				headers: {
					"content-type": "application/json",
					"x-classroom-request": "1"
				},
				body: JSON.stringify({ active: true })
			});

			expect(response.status).toBe(409);
			expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("allows reactivation when the student still has a password", async () => {
		modelMocks.studentFindById.mockReturnValue(
			queryWith(
				makeStudent({
					active: false,
					passwordHash: "password-hash"
				})
			)
		);
		modelMocks.studentFindOneAndUpdate.mockReturnValue(
			queryWith(
				makeStudent({
					active: true,
					passwordHash: "password-hash",
					sessionVersion: 5
				})
			)
		);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const response = await fetch(`${baseUrl}/admins/students/${studentID}`, {
				method: "PATCH",
				headers: {
					"content-type": "application/json",
					"x-classroom-request": "1"
				},
				body: JSON.stringify({ active: true })
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.student.credentialState).toBe("password");
		});
	});

	it("rejects unknown student-management fields", async () => {
		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const create = await postJson(baseUrl, "/admins/students", {
				email: "student@example.org",
				teacherPassword: "teacher-passphrase",
				username: "student-two"
			});
			const reset = await postJson(baseUrl, `/admins/students/${studentID}/access-code`, {
				role: "admin",
				teacherPassword: "teacher-passphrase"
			});

			expect(create.status).toBe(400);
			expect(reset.status).toBe(400);
			expect(modelMocks.studentCreate).not.toHaveBeenCalled();
			expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("expires full student sessions after 30 minutes of inactivity", async () => {
		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 4,
				studentAuthLevel: "full",
				studentLastActivityAt: Date.now() - 30 * 60 * 1000
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/students/session`);

				await expect(response.json()).resolves.toEqual({
					student: null,
					requiresPasswordSetup: false
				});
				expect(session.studentID).toBeUndefined();
				expect(session.studentLastActivityAt).toBeUndefined();
				expect(modelMocks.studentFindById).not.toHaveBeenCalled();
			}
		);
	});

	it("enforces the absolute student-session expiry before querying the account", async () => {
		await withRuntime(
			{
				studentExpiresAt: Date.now() - 1,
				studentID: studentID.toString(),
				studentSessionVersion: 4,
				studentAuthLevel: "full"
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/students/session`);

				await expect(response.json()).resolves.toEqual({
					student: null,
					requiresPasswordSetup: false
				});
				expect(session.studentID).toBeUndefined();
				expect(session.studentExpiresAt).toBeUndefined();
				expect(modelMocks.studentFindById).not.toHaveBeenCalled();
			}
		);
	});

	it("revokes copied student cookies when the student signs out", async () => {
		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 4,
				studentAuthLevel: "full"
			},
			async baseUrl => {
				const response = await fetch(`${baseUrl}/students/session`, {
					method: "DELETE",
					headers: { "X-Classroom-Request": "1" }
				});

				expect(response.status).toBe(204);
				expect(modelMocks.studentUpdateOne).toHaveBeenCalledWith(
					{
						_id: studentID.toString(),
						sessionVersion: 4
					},
					{ $inc: { sessionVersion: 1 } }
				);
			}
		);
	});

	it("does not let repeated session or protected reads extend student inactivity", async () => {
		const fullActivity = Date.now() - 5_000;
		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 4,
				studentAuthLevel: "full",
				studentLastActivityAt: fullActivity
			},
			async (baseUrl, session) => {
				const first = await fetch(`${baseUrl}/students/session`);
				const second = await fetch(`${baseUrl}/students/session`);
				const protectedFirst = await fetch(`${baseUrl}/student-read-probe`);
				const protectedSecond = await fetch(`${baseUrl}/student-read-probe`);

				expect(first.status).toBe(200);
				expect(second.status).toBe(200);
				expect(protectedFirst.status).toBe(204);
				expect(protectedSecond.status).toBe(204);
				expect(session.studentLastActivityAt).toBe(fullActivity);
			}
		);
	});

	it("refreshes inactivity only for an explicit same-origin activity heartbeat", async () => {
		const fullActivity = Date.now() - 5_000;
		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 4,
				studentAuthLevel: "full",
				studentLastActivityAt: fullActivity
			},
			async (baseUrl, session) => {
				const heartbeat = await fetch(`${baseUrl}/students/session`, {
					headers: {
						"X-Classroom-Request": "1",
						"X-Student-Activity": "1"
					}
				});

				expect(heartbeat.status).toBe(200);
				expect(session.studentLastActivityAt).toBeGreaterThan(fullActivity);
			}
		);
	});

	it("rejects a cross-site activity heartbeat without refreshing inactivity", async () => {
		const fullActivity = Date.now() - 5_000;
		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 4,
				studentAuthLevel: "full",
				studentLastActivityAt: fullActivity
			},
			async (baseUrl, session) => {
				const heartbeat = await fetch(`${baseUrl}/students/session`, {
					headers: {
						Origin: "https://attacker.example",
						"X-Classroom-Request": "1",
						"X-Student-Activity": "1"
					}
				});

				expect(heartbeat.status).toBe(403);
				expect(session.studentLastActivityAt).toBe(fullActivity);
			}
		);
	});

	it("keeps setup-session expiry absolute across session checks", async () => {
		const setupExpiry = Date.now() + 60_000;
		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 4,
				studentAuthLevel: "setup",
				studentSetupExpiresAt: setupExpiry
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/students/session`);
				expect(response.status).toBe(200);
				expect(session.studentSetupExpiresAt).toBe(setupExpiry);
			}
		);
	});

	it("invalidates stale student cookies and never exposes hidden auth state", async () => {
		modelMocks.studentFindById.mockReturnValue(
			queryWith(
				makeStudent({
					sessionVersion: 99
				})
			)
		);

		await withRuntime(
			{
				studentID: studentID.toString(),
				studentSessionVersion: 4,
				studentAuthLevel: "full"
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/students/session`);
				const body = await response.json();

				expect(response.status).toBe(200);
				expect(body).toEqual({
					student: null,
					requiresPasswordSetup: false
				});
				expect(session.studentID).toBeUndefined();
				expect(JSON.stringify(body)).not.toMatch(
					/passwordHash|accessCodeHash|pendingSetupCodeHash|lastPasswordSetupRequestID|sessionVersion|failedLoginAttempts|lockedUntil/
				);
			}
		);
	});
});
