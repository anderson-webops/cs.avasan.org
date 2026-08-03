import type { Server } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import { Types } from "mongoose";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Admin } from "../src/models/schemas/Admin.js";
import { Student } from "../src/models/schemas/Student.js";
import {
	assertRetainedStudentDataHasRetentionPeriod,
	mountRuntimeAccountRoutes,
	retainedStudentDeletionReceiptFilter
} from "../src/routes/runtimeAccountRoutes.js";
import { ADMIN_SINGLETON_ID } from "../src/security/adminIdentity.js";

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
	tutorID?: string;
	userID?: string;
}

async function withRuntime<T>(
	session: TestSession,
	run: (
		baseUrl: string,
		currentSession: TestSession,
		sessionOptions: { expires?: Date; maxAge?: number }
	) => Promise<T>,
	features: {
		studentAccountsEnabled: boolean;
		studentOAuthEnabled: boolean;
		studentRecordRetentionDays?: number | null;
	} = {
		studentAccountsEnabled: true,
		studentOAuthEnabled: true
	}
): Promise<T> {
	const app = express();
	const currentSession = {
		...session,
		adminExpiresAt: session.adminID ? (session.adminExpiresAt ?? Date.now() + 8 * 60 * 60 * 1000) : undefined,
		adminLastActivityAt: session.adminID ? (session.adminLastActivityAt ?? Date.now()) : undefined,
		adminSessionVersion: session.adminID ? (session.adminSessionVersion ?? 0) : undefined,
		studentExpiresAt:
			session.studentAuthLevel === "full"
				? (session.studentExpiresAt ?? Date.now() + 8 * 60 * 60 * 1000)
				: undefined,
		studentLastActivityAt:
			session.studentAuthLevel === "full" ? (session.studentLastActivityAt ?? Date.now()) : undefined,
		studentSetupExpiresAt:
			session.studentAuthLevel === "setup"
				? (session.studentSetupExpiresAt ?? Date.now() + 30 * 60 * 1000)
				: undefined
	};
	const sessionOptions: { expires?: Date; maxAge?: number } = {};
	app.use(express.json());
	app.use((req, _res, next) => {
		(req as any).session = currentSession;
		(req as any).sessionOptions = sessionOptions;
		next();
	});
	mountRuntimeAccountRoutes(app, {
		analyticsRetentionDays: 90,
		studentRecordRetentionDays:
			features.studentRecordRetentionDays === undefined
				? features.studentAccountsEnabled
					? 90
					: null
				: features.studentRecordRetentionDays,
		studentAccountsEnabled: features.studentAccountsEnabled,
		studentOAuthEnabled: features.studentOAuthEnabled
	});

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`, currentSession, sessionOptions);
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

function queryWith<T>(result: T) {
	const query = {
		exec: vi.fn().mockResolvedValue(result),
		select: vi.fn(() => query),
		then: (resolve: (value: T) => unknown, reject: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(resolve, reject),
		catch: (reject: (reason: unknown) => unknown) => Promise.resolve(result).catch(reject)
	};
	return query;
}

async function postJson(baseUrl: string, path: string, body: object): Promise<Response> {
	return fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Classroom-Request": "1"
		},
		body: JSON.stringify(body)
	});
}

describe("Admin-only account runtime", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("keeps all legacy account and tutoring services unmounted", async () => {
		const removedLegacySources = [
			"../src/controllers/common/quoteProxy.ts",
			"../src/routes/adminMailRoutes.ts",
			"../src/routes/tutorRoutes.ts",
			"../src/routes/userRoutes.ts",
			"../src/models/schemas/Tutor.ts",
			"../src/models/schemas/User.ts",
			"../src/models/schemas/ScheduledSession.ts",
			"../src/models/schemas/SessionNote.ts"
		];
		expect(removedLegacySources.filter(path => existsSync(resolve(__dirname, path)))).toEqual([]);

		await withRuntime({}, async baseUrl => {
			const mutationHeaders = { "X-Classroom-Request": "1" };
			const attempts = [
				fetch(`${baseUrl}/admins`, { method: "POST", headers: mutationHeaders }),
				fetch(`${baseUrl}/admins`),
				fetch(`${baseUrl}/admins/${ADMIN_SINGLETON_ID}`, {
					body: JSON.stringify({ name: "Changed Julio" }),
					headers: {
						"Content-Type": "application/json",
						...mutationHeaders
					},
					method: "PUT"
				}),
				fetch(`${baseUrl}/admins/remove/${ADMIN_SINGLETON_ID}`, {
					method: "DELETE",
					headers: mutationHeaders
				}),
				fetch(`${baseUrl}/users`, { method: "POST", headers: mutationHeaders }),
				fetch(`${baseUrl}/tutors`, { method: "POST", headers: mutationHeaders }),
				fetch(`${baseUrl}/admin-mail`, { method: "POST", headers: mutationHeaders }),
				postJson(baseUrl, "/accounts/register", {}),
				postJson(baseUrl, "/accounts/signup", {}),
				postJson(baseUrl, "/students", {})
			];
			const responses = await Promise.all(attempts);

			expect(responses.map(response => response.status)).toEqual([
				404, 404, 404, 404, 404, 404, 404, 404, 404, 404
			]);
		});
	});

	it("does not mount a backend Python asset-streaming route", async () => {
		const serverSource = readFileSync(resolve(__dirname, "../src/server.ts"), "utf8");
		expect(serverSource).not.toMatch(/pythonIdeAssetsProxy|\/python-assets/);

		await withRuntime({}, async baseUrl => {
			const response = await fetch(`${baseUrl}/python-assets/assets.zip`);
			expect(response.status).toBe(404);
		});
	});

	it("does not mount optional student or OAuth routes until enabled", async () => {
		await withRuntime(
			{},
			async baseUrl => {
				const responses = await Promise.all([
					fetch(`${baseUrl}/students/session`),
					fetch(`${baseUrl}/students/oauth/providers`),
					fetch(`${baseUrl}/admins/students`)
				]);
				expect(responses.map(response => response.status)).toEqual([404, 404, 404]);
			},
			{
				studentAccountsEnabled: false,
				studentOAuthEnabled: false
			}
		);
	});

	it("keeps only Julio's record-request tools in retention maintenance mode", async () => {
		const studentID = new Types.ObjectId().toString();
		const mutationHeaders = { "X-Classroom-Request": "1" };

		await withRuntime(
			{},
			async baseUrl => {
				const maintained = await Promise.all([
					fetch(`${baseUrl}/admins/students`),
					fetch(`${baseUrl}/admins/student-deletion-receipts`),
					fetch(`${baseUrl}/admins/students/${studentID}/username`, {
						body: JSON.stringify({ username: "river-8" }),
						headers: {
							"Content-Type": "application/json",
							...mutationHeaders
						},
						method: "PATCH"
					}),
					postJson(baseUrl, `/admins/students/${studentID}/export`, {}),
					fetch(
						`${baseUrl}/admins/students/${studentID}/record-preservation`,
						{
							body: JSON.stringify({
								active: true,
								teacherPassword: "not-an-admin"
							}),
							headers: {
								"Content-Type": "application/json",
								...mutationHeaders
							},
							method: "PUT"
						}
					),
					fetch(`${baseUrl}/admins/students/${studentID}`, {
						headers: mutationHeaders,
						method: "DELETE"
					})
				]);
				expect(maintained.map(response => response.status)).toEqual([
					403, 403, 403, 403, 403, 403
				]);

				const unavailable = await Promise.all([
					fetch(`${baseUrl}/students/session`),
					fetch(`${baseUrl}/students/session`, {
						method: "POST"
					}),
					fetch(`${baseUrl}/students/oauth/providers`),
					postJson(baseUrl, "/admins/students", {
						username: "river-8"
					}),
					fetch(`${baseUrl}/admins/students/${studentID}`, {
						body: JSON.stringify({ active: true }),
						headers: {
							"Content-Type": "application/json",
							...mutationHeaders
						},
						method: "PATCH"
					}),
					postJson(baseUrl, `/admins/students/${studentID}/access-code`, {}),
					fetch(`${baseUrl}/admins/students/${studentID}/projects`),
					postJson(baseUrl, `/admins/students/${studentID}/projects/project-1/review`, {})
				]);
				expect(unavailable.map(response => response.status)).toEqual([404, 404, 404, 404, 404, 404, 404, 404]);
			},
			{
				studentAccountsEnabled: false,
				studentOAuthEnabled: false,
				studentRecordRetentionDays: 90
			}
		);
	});

	it("refuses to strand retained student data without a retention period", () => {
		expect(() =>
			assertRetainedStudentDataHasRetentionPeriod(null, {
				deletionReceiptsExist: false,
				studentRecordsExist: true
			})
		).toThrow(/Student records or deletion receipts remain.*STUDENT_RECORD_RETENTION_DAYS/s);
		expect(() =>
			assertRetainedStudentDataHasRetentionPeriod(null, {
				deletionReceiptsExist: true,
				studentRecordsExist: false
			})
		).toThrow(/Student records or deletion receipts remain.*STUDENT_RECORD_RETENTION_DAYS/s);
		expect(() =>
			assertRetainedStudentDataHasRetentionPeriod(null, {
				deletionReceiptsExist: false,
				studentRecordsExist: false
			})
		).not.toThrow();
		expect(() =>
			assertRetainedStudentDataHasRetentionPeriod(90, {
				deletionReceiptsExist: true,
				studentRecordsExist: true
			})
		).not.toThrow();
		expect(retainedStudentDeletionReceiptFilter(new Date("2026-07-30T12:00:00.000Z"))).toEqual({
			$or: [
				{ status: { $in: ["in-progress", "needs-retry"] } },
				{
					expiresAt: {
						$gt: new Date("2026-07-30T12:00:00.000Z")
					},
					status: "completed"
				}
			]
		});
	});

	it("starts record retention independently from the public account flag", () => {
		const serverSource = readFileSync(resolve(__dirname, "../src/server.ts"), "utf8");
		const connectIndex = serverSource.indexOf("await mongoose.connect(mongoUri)");
		const strandedDataCheckIndex = serverSource.indexOf("assertRetainedStudentDataHasRetentionPeriod(");
		const initialRetentionIndex = serverSource.indexOf("await enforceStudentRecordRetention(");
		const sweeperIndex = serverSource.indexOf("? startStudentRecordRetentionSweeper(");

		expect(connectIndex).toBeGreaterThanOrEqual(0);
		expect(strandedDataCheckIndex).toBeGreaterThan(connectIndex);
		expect(serverSource.slice(connectIndex, strandedDataCheckIndex)).toContain(
			"StudentDataDeletionReceipt.exists("
		);
		expect(serverSource.slice(connectIndex, strandedDataCheckIndex)).toContain(
			"retainedStudentDeletionReceiptFilter(new Date())"
		);
		expect(initialRetentionIndex).toBeGreaterThan(strandedDataCheckIndex);
		expect(sweeperIndex).toBeGreaterThan(initialRetentionIndex);
		expect(
			serverSource.slice(
				serverSource.lastIndexOf("const stopStudentRecordRetentionSweeper", sweeperIndex),
				sweeperIndex
			)
		).not.toContain("studentAccountsEnabled");
	});

	it("keeps the classroom summary inside Julio's Admin session", async () => {
		await withRuntime({}, async baseUrl => {
			const protectedSummary = await fetch(`${baseUrl}/admins/classroom-analytics/summary`);
			const retiredServiceSummary = await fetch(`${baseUrl}/classroom-analytics/summary`);

			expect(protectedSummary.status).toBe(403);
			expect(protectedSummary.headers.get("cache-control")).toBe("no-store");
			expect(retiredServiceSummary.status).toBe(404);
		});
	});

	it("exposes only adminID from the current session", async () => {
		await withRuntime(
			{
				adminID: ADMIN_SINGLETON_ID,
				tutorID: "legacy-tutor",
				userID: "legacy-user"
			},
			async baseUrl => {
				const response = await fetch(`${baseUrl}/accounts/me`);

				expect(response.status).toBe(200);
				await expect(response.json()).resolves.toEqual({
					adminID: ADMIN_SINGLETON_ID
				});
			}
		);
	});

	it("does not mount Admin email checks or mutation and keeps password change private", async () => {
		const accountRoutesSource = readFileSync(resolve(__dirname, "../src/routes/accountRoutes.ts"), "utf8");
		const authControllerSource = readFileSync(
			resolve(__dirname, "../src/controllers/auth/authController.ts"),
			"utf8"
		);
		const adminRoutesSource = readFileSync(resolve(__dirname, "../src/routes/adminRoutes.ts"), "utf8");
		const adminControllerSource = readFileSync(
			resolve(__dirname, "../src/controllers/users/adminController.ts"),
			"utf8"
		);
		expect(accountRoutesSource).not.toMatch(/checkEmail|changeEmail/);
		expect(authControllerSource).not.toMatch(/export const (?:checkEmail|changeEmail)/);
		expect(adminRoutesSource).not.toMatch(/router\.put\("\/:adminID"|updateAdmin/);
		expect(adminControllerSource).not.toMatch(/export const updateAdmin/);

		await withRuntime({}, async baseUrl => {
			const responses = await Promise.all([
				postJson(baseUrl, "/accounts/checkEmail", { email: "julio@example.org" }),
				postJson(baseUrl, `/accounts/changeEmail/${ADMIN_SINGLETON_ID}`, {
					email: "julio@example.org"
				}),
				postJson(baseUrl, `/accounts/changePassword/${ADMIN_SINGLETON_ID}`, {
					currentPassword: "old",
					newPassword: "new"
				})
			]);

			expect(responses.map(response => response.status)).toEqual([404, 404, 403]);
		});
	});

	it("normalizes email and authenticates against the Admin model", async () => {
		const passwordChangedAt = new Date("2026-07-29T15:30:00.000Z");
		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "unhashed fixture",
			editAdmins: false,
			saveEdit: "Edit",
			role: "admin",
			sessionVersion: 0,
			passwordChangedAt
		});
		const comparePassword = vi.spyOn(admin, "comparePassword").mockResolvedValue(true);
		const exec = vi.fn().mockResolvedValue(admin);
		const findOne = vi.spyOn(Admin, "findOne").mockReturnValue({ exec } as any);
		const authenticated = new Admin({
			...admin.toObject(),
			sessionVersion: 1
		});
		const rotate = vi.spyOn(Admin, "findOneAndUpdate").mockReturnValue(queryWith(authenticated) as any);

		await withRuntime({}, async (baseUrl, session, sessionOptions) => {
			const beforeLogin = Date.now();
			const response = await postJson(baseUrl, "/accounts/login", {
				email: "  JULIO@EXAMPLE.ORG ",
				password: "correct horse battery staple"
			});

			expect(response.status).toBe(200);
			expect(findOne).toHaveBeenCalledWith({
				_id: ADMIN_SINGLETON_ID
			});
			expect(comparePassword).toHaveBeenCalledWith("correct horse battery staple");
			expect(rotate).toHaveBeenCalledWith(
				expect.objectContaining({
					_id: ADMIN_SINGLETON_ID,
					$or: [{ sessionVersion: 0 }, { sessionVersion: { $exists: false } }]
				}),
				{ $inc: { sessionVersion: 1 } },
				{ new: true }
			);
			const body = await response.json();
			expect(body).toMatchObject({
				currentAdmin: {
					name: "Julio",
					email: "julio@example.org",
					passwordChangedAt: passwordChangedAt.toISOString()
				}
			});
			expect(body.currentAdmin).not.toHaveProperty("password");
			expect(body.currentAdmin).not.toHaveProperty("sessionVersion");
			expect(session.adminExpiresAt).toBeGreaterThanOrEqual(beforeLogin + 8 * 60 * 60 * 1000);
			expect(session.adminExpiresAt).toBeLessThanOrEqual(Date.now() + 8 * 60 * 60 * 1000);
			expect(session.adminLastActivityAt).toBeGreaterThanOrEqual(beforeLogin);
			expect(session.adminLastActivityAt).toBeLessThanOrEqual(Date.now());
			expect(sessionOptions.maxAge).toBeUndefined();
			expect(sessionOptions.expires).toBeUndefined();
		});
	});

	it("checks Julio's password even when the submitted email is wrong", async () => {
		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "stored password hash",
			sessionVersion: 0
		});
		const comparePassword = vi.spyOn(admin, "comparePassword").mockResolvedValue(false);
		vi.spyOn(Admin, "findOne").mockReturnValue({
			exec: vi.fn().mockResolvedValue(admin)
		} as any);
		const rotate = vi.spyOn(Admin, "findOneAndUpdate");

		await withRuntime({}, async baseUrl => {
			const response = await postJson(baseUrl, "/accounts/login", {
				email: "someone-else@example.org",
				password: "wrong password"
			});

			expect(response.status).toBe(403);
			await expect(response.json()).resolves.toEqual({
				message: "Bad credentials"
			});
			expect(comparePassword).toHaveBeenCalledWith("wrong password");
			expect(rotate).not.toHaveBeenCalled();
		});
	});

	it("rejects removed remember-me input before querying the Admin account", async () => {
		const findOne = vi.spyOn(Admin, "findOne");

		await withRuntime({}, async baseUrl => {
			const response = await postJson(baseUrl, "/accounts/login", {
				email: "julio@example.org",
				password: "correct horse battery staple",
				remember: true
			});

			expect(response.status).toBe(400);
			expect(findOne).not.toHaveBeenCalled();
		});
	});

	it("revokes copied student cookies before replacing the identity with Julio", async () => {
		const studentID = new Types.ObjectId().toString();
		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "stored password hash",
			sessionVersion: 0
		});
		const comparePassword = vi.spyOn(admin, "comparePassword").mockResolvedValue(true);
		vi.spyOn(Admin, "findOne").mockReturnValue({
			exec: vi.fn().mockResolvedValue(admin)
		} as any);
		const authenticated = new Admin({
			...admin.toObject(),
			sessionVersion: 1
		});
		vi.spyOn(Admin, "findOneAndUpdate").mockReturnValue(queryWith(authenticated) as any);
		const revokeStudent = vi
			.spyOn(Student, "updateOne")
			.mockResolvedValue({ acknowledged: true, modifiedCount: 1 } as any);
		const revokeAdmin = vi.spyOn(Admin, "updateOne");

		await withRuntime(
			{
				studentID,
				studentSessionVersion: 7,
				studentAuthLevel: "full"
			},
			async (baseUrl, session) => {
				const response = await postJson(baseUrl, "/accounts/login", {
					email: "julio@example.org",
					password: "correct horse battery staple"
				});

				expect(response.status).toBe(200);
				expect(revokeStudent).toHaveBeenCalledWith(
					{
						_id: studentID,
						sessionVersion: 7
					},
					{ $inc: { sessionVersion: 1 } }
				);
				expect(revokeAdmin).not.toHaveBeenCalled();
				expect(session.adminID).toBe(ADMIN_SINGLETON_ID);
				expect(session.adminSessionVersion).toBe(1);
				expect(session.adminExpiresAt).toBeGreaterThan(Date.now());
				expect(session.studentID).toBeUndefined();
				expect(session.studentExpiresAt).toBeUndefined();
				expect(session.studentSessionVersion).toBeUndefined();
				expect(session.studentAuthLevel).toBeUndefined();
			}
		);
	});

	it("fails closed without issuing an Admin cookie when Student revocation fails", async () => {
		const studentID = new Types.ObjectId().toString();
		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "stored password hash",
			sessionVersion: 0
		});
		vi.spyOn(admin, "comparePassword").mockResolvedValue(true);
		vi.spyOn(Admin, "findOne").mockReturnValue({
			exec: vi.fn().mockResolvedValue(admin)
		} as any);
		vi.spyOn(Admin, "findOneAndUpdate").mockReturnValue(
			queryWith(
				new Admin({
					...admin.toObject(),
					sessionVersion: 1
				})
			) as any
		);
		vi.spyOn(Student, "updateOne").mockRejectedValue(new Error("database unavailable"));

		await withRuntime(
			{
				studentID,
				studentSessionVersion: 7,
				studentAuthLevel: "full"
			},
			async (baseUrl, session) => {
				const response = await postJson(baseUrl, "/accounts/login", {
					email: "julio@example.org",
					password: "correct horse battery staple"
				});

				expect(response.status).toBe(503);
				await expect(response.json()).resolves.toEqual({
					message: "Could not safely switch accounts. Admin sign-in was not completed."
				});
				expect(session.adminID).toBeUndefined();
				expect(session.adminSessionVersion).toBeUndefined();
				expect(session.studentID).toBe(studentID);
				expect(session.studentSessionVersion).toBe(7);
				expect(session.studentAuthLevel).toBe("full");
			}
		);
	});

	it("rotates a legacy singleton that has no stored session version", async () => {
		const legacyAdmin = {
			_id: { toString: () => ADMIN_SINGLETON_ID },
			name: "Julio",
			email: "julio@example.org",
			password: "legacy-password-hash",
			comparePassword: vi.fn().mockResolvedValue(true)
		};
		vi.spyOn(Admin, "findOne").mockReturnValue({
			exec: vi.fn().mockResolvedValue(legacyAdmin)
		} as any);
		const authenticated = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "legacy-password-hash",
			sessionVersion: 1
		});
		const rotate = vi.spyOn(Admin, "findOneAndUpdate").mockReturnValue(queryWith(authenticated) as any);

		await withRuntime({}, async (baseUrl, session) => {
			const response = await postJson(baseUrl, "/accounts/login", {
				email: "julio@example.org",
				password: "correct horse battery staple"
			});

			expect(response.status).toBe(200);
			expect(session.adminSessionVersion).toBe(1);
			expect(rotate).toHaveBeenCalledWith(
				expect.objectContaining({
					$or: [{ sessionVersion: 0 }, { sessionVersion: { $exists: false } }]
				}),
				{ $inc: { sessionVersion: 1 } },
				{ new: true }
			);
		});
	});

	it("throttles repeated teacher login attempts", async () => {
		await withRuntime({}, async baseUrl => {
			const responses: Response[] = [];
			for (let attempt = 0; attempt < 11; attempt += 1) {
				responses.push(await postJson(baseUrl, "/accounts/login", {}));
			}

			expect(responses.slice(0, 10).every(response => response.status === 400)).toBe(true);
			expect(responses[10]?.status).toBe(429);
		});
	});

	it("rejects a short replacement teacher password", async () => {
		const admin = {
			_id: { toString: () => ADMIN_SINGLETON_ID },
			sessionVersion: 0,
			comparePassword: vi.fn(),
			save: vi.fn()
		};
		vi.spyOn(Admin, "findById").mockReturnValue(queryWith(admin) as any);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async baseUrl => {
			const response = await postJson(baseUrl, `/accounts/changePassword/${ADMIN_SINGLETON_ID}`, {
				currentPassword: "old password",
				newPassword: "too short"
			});

			expect(response.status).toBe(400);
			await expect(response.json()).resolves.toEqual({
				message: "New password must be at least 14 characters."
			});
			expect(admin.comparePassword).not.toHaveBeenCalled();
			expect(admin.save).not.toHaveBeenCalled();
		});
	});

	it("limits repeated current-password failures only after Admin validation", async () => {
		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "stored password hash",
			sessionVersion: 0
		});
		const comparePassword = vi.spyOn(admin, "comparePassword").mockResolvedValue(false);
		vi.spyOn(Admin, "findById").mockReturnValue(queryWith(admin) as any);

		await withRuntime({}, async (baseUrl, session) => {
			const passwordChange = () =>
				postJson(baseUrl, `/accounts/changePassword/${ADMIN_SINGLETON_ID}`, {
					currentPassword: "incorrect teacher password",
					newPassword: "a secure classroom passphrase"
				});

			for (let attempt = 0; attempt < 11; attempt += 1) {
				const response = await passwordChange();
				expect(response.status).toBe(403);
			}
			expect(comparePassword).not.toHaveBeenCalled();

			session.adminID = ADMIN_SINGLETON_ID;
			session.adminExpiresAt = Date.now() + 8 * 60 * 60 * 1000;
			session.adminLastActivityAt = Date.now();
			session.adminSessionVersion = 0;
			for (let attempt = 0; attempt < 10; attempt += 1) {
				const response = await passwordChange();
				expect(response.status).toBe(403);
			}

			const limited = await passwordChange();
			expect(limited.status).toBe(429);
			await expect(limited.json()).resolves.toEqual({
				message: "Too many password checks. Please try again later."
			});
			expect(comparePassword).toHaveBeenCalledTimes(10);
		});
	});

	it("saves a valid replacement teacher password", async () => {
		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "old password hash",
			editAdmins: false,
			saveEdit: "Edit",
			role: "admin",
			sessionVersion: 0
		});
		const comparePassword = vi.spyOn(admin, "comparePassword").mockResolvedValue(true);
		vi.spyOn(Admin, "findById").mockReturnValue(queryWith(admin) as any);
		const updated = new Admin({
			...admin.toObject(),
			password: "replacement password hash",
			passwordChangedAt: new Date(),
			sessionVersion: 1
		});
		const update = vi.spyOn(Admin, "findOneAndUpdate").mockReturnValue(queryWith(updated) as any);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID }, async (baseUrl, session) => {
			const response = await postJson(baseUrl, `/accounts/changePassword/${ADMIN_SINGLETON_ID}`, {
				currentPassword: "old password",
				newPassword: "a secure classroom passphrase"
			});

			expect(response.status).toBe(200);
			expect(comparePassword).toHaveBeenCalledWith("old password");
			expect(session.adminSessionVersion).toBe(1);
			expect(update).toHaveBeenCalledWith(
				{
					_id: admin._id,
					password: admin.password,
					sessionVersion: 0
				},
				{
					$inc: { sessionVersion: 1 },
					$set: {
						password: expect.stringMatching(/^\$argon2/),
						passwordChangedAt: expect.any(Date)
					}
				},
				{ new: true }
			);
			const body = await response.json();
			expect(body).toMatchObject({
				currentAdmin: {
					_id: ADMIN_SINGLETON_ID,
					passwordChangedAt: updated.passwordChangedAt?.toISOString()
				},
				message: "Password updated successfully."
			});
			expect(body.currentAdmin).not.toHaveProperty("password");
			expect(body.currentAdmin).not.toHaveProperty("sessionVersion");
		});
	});

	it("fails a password change atomically when a concurrent login rotated the session", async () => {
		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "old password hash",
			sessionVersion: 0
		});
		vi.spyOn(admin, "comparePassword").mockResolvedValue(true);
		vi.spyOn(Admin, "findById").mockReturnValue(queryWith(admin) as any);
		vi.spyOn(Admin, "findOneAndUpdate").mockReturnValue(queryWith(null) as any);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID, adminSessionVersion: 0 }, async (baseUrl, session) => {
			const response = await postJson(baseUrl, `/accounts/changePassword/${ADMIN_SINGLETON_ID}`, {
				currentPassword: "old password",
				newPassword: "a secure classroom passphrase"
			});

			expect(response.status).toBe(409);
			expect(session.adminID).toBeUndefined();
			expect(session.adminExpiresAt).toBeUndefined();
			expect(session.adminLastActivityAt).toBeUndefined();
			expect(session.adminSessionVersion).toBeUndefined();
		});
	});

	it("rejects a non-singleton Admin session before querying the database", async () => {
		const findById = vi.spyOn(Admin, "findById");

		await withRuntime({ adminID: "legacy-admin" }, async baseUrl => {
			const response = await fetch(`${baseUrl}/admins/loggedin`);

			expect(response.status).toBe(403);
			expect(findById).not.toHaveBeenCalled();
		});
	});

	it("revokes an older Admin session after a password change", async () => {
		const admin = {
			_id: { toString: () => ADMIN_SINGLETON_ID },
			name: "Julio",
			sessionVersion: 2
		};
		vi.spyOn(Admin, "findById").mockReturnValue(queryWith(admin) as any);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID, adminSessionVersion: 1 }, async (baseUrl, session) => {
			const response = await fetch(`${baseUrl}/admins/loggedin`);

			expect(response.status).toBe(403);
			expect(session.adminID).toBeUndefined();
			expect(session.adminSessionVersion).toBeUndefined();
		});
	});

	it("clears an expired absolute Admin session without querying the account", async () => {
		const findById = vi.spyOn(Admin, "findById");

		await withRuntime(
			{
				adminExpiresAt: Date.now() - 1,
				adminID: ADMIN_SINGLETON_ID,
				adminSessionVersion: 2
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/admins/loggedin`);

				expect(response.status).toBe(403);
				expect(findById).not.toHaveBeenCalled();
				expect(session.adminID).toBeUndefined();
				expect(session.adminExpiresAt).toBeUndefined();
				expect(session.adminLastActivityAt).toBeUndefined();
				expect(session.adminSessionVersion).toBeUndefined();
			}
		);
	});

	it("clears an idle Admin session without querying the account", async () => {
		const findById = vi.spyOn(Admin, "findById");

		await withRuntime(
			{
				adminExpiresAt: Date.now() + 8 * 60 * 60 * 1000,
				adminID: ADMIN_SINGLETON_ID,
				adminLastActivityAt: Date.now() - 30 * 60 * 1000 - 1,
				adminSessionVersion: 2
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/admins/loggedin`);

				expect(response.status).toBe(403);
				expect(findById).not.toHaveBeenCalled();
				expect(session.adminID).toBeUndefined();
				expect(session.adminExpiresAt).toBeUndefined();
				expect(session.adminLastActivityAt).toBeUndefined();
				expect(session.adminSessionVersion).toBeUndefined();
			}
		);
	});

	it("revokes copied Admin cookies when Julio signs out", async () => {
		const revoke = vi.spyOn(Admin, "updateOne").mockResolvedValue({ modifiedCount: 1 } as any);

		await withRuntime({ adminID: ADMIN_SINGLETON_ID, adminSessionVersion: 3 }, async baseUrl => {
			const response = await fetch(`${baseUrl}/accounts/logout`, {
				method: "DELETE",
				headers: { "X-Classroom-Request": "1" }
			});

			expect(response.status).toBe(200);
			expect(revoke).toHaveBeenCalledWith(
				{
					_id: ADMIN_SINGLETON_ID,
					sessionVersion: 3
				},
				{ $inc: { sessionVersion: 1 } }
			);
		});
	});

	it("serializes the Admin password-change timestamp without credentials or session state", () => {
		const passwordChangedAt = new Date("2026-07-29T15:30:00.000Z");
		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "unhashed fixture",
			sessionVersion: 7,
			passwordChangedAt
		});

		const serialized = admin.toJSON();
		expect(serialized).toHaveProperty("passwordChangedAt", passwordChangedAt);
		expect(serialized).not.toHaveProperty("password");
		expect(serialized).not.toHaveProperty("sessionVersion");
	});

	it("returns passwordChangedAt from /admins/loggedin without private Admin fields", async () => {
		const passwordChangedAt = new Date("2026-07-29T15:30:00.000Z");
		const lastActivityAt = Date.now() - 5 * 60 * 1000;
		const admin = new Admin({
			_id: ADMIN_SINGLETON_ID,
			name: "Julio",
			email: "julio@example.org",
			password: "unhashed fixture",
			editAdmins: false,
			saveEdit: "Edit",
			role: "admin",
			sessionVersion: 7,
			passwordChangedAt
		});
		vi.spyOn(Admin, "findById").mockReturnValue(queryWith(admin) as any);

		await withRuntime(
			{
				adminID: ADMIN_SINGLETON_ID,
				adminLastActivityAt: lastActivityAt,
				adminSessionVersion: 7
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/admins/loggedin`);

				expect(response.status).toBe(200);
				const body = await response.json();
				expect(body).toMatchObject({
					currentAdmin: {
						name: "Julio",
						email: "julio@example.org",
						passwordChangedAt: passwordChangedAt.toISOString()
					}
				});
				expect(body.currentAdmin).not.toHaveProperty("password");
				expect(body.currentAdmin).not.toHaveProperty("sessionVersion");
				expect(session.adminLastActivityAt).toBe(lastActivityAt);
			}
		);
	});

	it("rejects unsafe account requests without the classroom header", async () => {
		await withRuntime({}, async baseUrl => {
			const missingHeader = await fetch(`${baseUrl}/accounts/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: "julio@example.org",
					password: "correct horse battery staple"
				})
			});
			expect(missingHeader.status).toBe(403);
			await expect(missingHeader.json()).resolves.toEqual({
				message: "Classroom request header required."
			});

			const crossSite = await fetch(`${baseUrl}/accounts/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Sec-Fetch-Site": "cross-site",
					"X-Classroom-Request": "1"
				},
				body: JSON.stringify({})
			});
			expect(crossSite.status).toBe(403);

			const wrongOrigin = await fetch(`${baseUrl}/accounts/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Origin: "https://attacker.example",
					"X-Classroom-Request": "1"
				},
				body: JSON.stringify({})
			});
			expect(wrongOrigin.status).toBe(403);
		});
	});
});
