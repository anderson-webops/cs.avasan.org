import type { Server } from "node:http";
import { createHash } from "node:crypto";
import express from "express";
import { Types } from "mongoose";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminFindById: vi.fn(),
	attemptCreate: vi.fn(),
	attemptDeleteOne: vi.fn(),
	attemptFindOne: vi.fn(),
	attemptFindOneAndDelete: vi.fn(),
	studentCreate: vi.fn(),
	studentFindById: vi.fn(),
	studentFindOne: vi.fn(),
	studentFindOneAndUpdate: vi.fn(),
	studentUpdateOne: vi.fn()
}));

const oauthMocks = vi.hoisted(() => ({
	createAuthorization: vi.fn(),
	exchangeCode: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: {
		findById: modelMocks.adminFindById
	}
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		create: modelMocks.studentCreate,
		findById: modelMocks.studentFindById,
		findOne: modelMocks.studentFindOne,
		findOneAndUpdate: modelMocks.studentFindOneAndUpdate,
		updateOne: modelMocks.studentUpdateOne
	}
}));

vi.mock("../src/models/schemas/OAuthLoginAttempt.js", () => ({
	OAuthLoginAttempt: {
		create: modelMocks.attemptCreate,
		deleteOne: modelMocks.attemptDeleteOne,
		findOne: modelMocks.attemptFindOne,
		findOneAndDelete: modelMocks.attemptFindOneAndDelete
	}
}));

vi.mock("../src/utils/oauthClient.js", () => ({
	createOAuthAuthorizationRequest: oauthMocks.createAuthorization,
	exchangeOAuthAuthorizationCode: oauthMocks.exchangeCode
}));

const { requireClassroomRequest } = await import("../src/middleware/classroomRequest.js");
const { studentRoutes } = await import("../src/routes/studentRoutes.js");
const { closeStudentDataWritesAndWait, resetStudentDataWriteBarriersForTests } =
	await import("../src/security/studentDataWriteBarrier.js");

const studentID = new Types.ObjectId();
const attemptID = new Types.ObjectId();
const originalEnvironment = {
	APPLE_OAUTH_CLIENT_ID: process.env.APPLE_OAUTH_CLIENT_ID,
	APPLE_OAUTH_KEY_ID: process.env.APPLE_OAUTH_KEY_ID,
	APPLE_OAUTH_PRIVATE_KEY: process.env.APPLE_OAUTH_PRIVATE_KEY,
	APPLE_OAUTH_PRIVATE_KEY_BASE64: process.env.APPLE_OAUTH_PRIVATE_KEY_BASE64,
	APPLE_OAUTH_TEAM_ID: process.env.APPLE_OAUTH_TEAM_ID,
	CLASSROOM_ORIGIN: process.env.CLASSROOM_ORIGIN,
	GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	NODE_ENV: process.env.NODE_ENV,
	OAUTH_RATE_MAX: process.env.OAUTH_RATE_MAX,
	STUDENT_OAUTH_ENABLED: process.env.STUDENT_OAUTH_ENABLED
};

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

function hash(value: string) {
	return createHash("sha256").update(value).digest("hex");
}

function queryWith<T>(result: T) {
	const query = {
		select: vi.fn(() => query),
		sort: vi.fn(() => query),
		limit: vi.fn(() => query),
		where: vi.fn(() => query),
		exec: vi.fn().mockResolvedValue(result),
		then: (resolve: (value: T) => unknown, reject: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(resolve, reject),
		catch: (reject: (reason: unknown) => unknown) => Promise.resolve(result).catch(reject)
	};
	return query;
}

function queryRejecting(error: unknown) {
	const rejected = Promise.reject(error);
	rejected.catch(() => undefined);
	const query = {
		select: vi.fn(() => query),
		exec: vi.fn(() => Promise.reject(error)),
		then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) =>
			rejected.then(resolve, reject),
		catch: (reject: (reason: unknown) => unknown) => rejected.catch(reject)
	};
	return query;
}

function makeStudent(overrides: Record<string, unknown> = {}) {
	return {
		_id: studentID,
		active: true,
		sessionVersion: 7,
		username: "student-one",
		createdAt: new Date("2026-07-29T12:00:00.000Z"),
		updatedAt: new Date("2026-07-29T12:00:00.000Z"),
		...overrides
	};
}

function makeAttempt(
	provider: "apple" | "google",
	mode: "link" | "signin",
	state: string,
	browserBinding: string,
	overrides: Record<string, unknown> = {}
) {
	return {
		_id: attemptID,
		browserBindingHash: hash(browserBinding),
		codeVerifier: "v".repeat(43),
		expiresAt: new Date(Date.now() + 60_000),
		mode,
		nonce: "n".repeat(43),
		provider,
		returnTo: "/courses",
		stateHash: hash(state),
		...overrides
	};
}

async function withRuntime<T>(
	initialSession: TestSession,
	run: (baseUrl: string, session: TestSession) => Promise<T>
): Promise<T> {
	const app = express();
	app.locals.studentRecordRetentionDays = 90;
	const session = { ...initialSession };
	app.use(express.json());
	app.use((req: any, _res, next) => {
		req.session = session;
		req.sessionOptions = {};
		next();
	});
	app.use("/students", requireClassroomRequest, studentRoutes);

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
				if (error) reject(error);
				else resolve();
			});
		});
	}
}

function callbackHeaders(provider: "apple" | "google", browserBinding: string) {
	return {
		cookie: `cs_avasan_student_oauth_${provider}=${browserBinding}`
	};
}

describe("code-bound student OAuth", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetStudentDataWriteBarriersForTests();
		process.env.NODE_ENV = "development";
		process.env.CLASSROOM_ORIGIN = "https://cs.avasan.org";
		process.env.GOOGLE_OAUTH_CLIENT_ID = "google-client";
		process.env.GOOGLE_OAUTH_CLIENT_SECRET = "google-secret";
		process.env.APPLE_OAUTH_CLIENT_ID = "cs.avasan.org";
		process.env.APPLE_OAUTH_KEY_ID = "APPLEKEY";
		process.env.APPLE_OAUTH_TEAM_ID = "APPLETEAM";
		process.env.APPLE_OAUTH_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\\ntest\\n-----END PRIVATE KEY-----";
		delete process.env.APPLE_OAUTH_PRIVATE_KEY_BASE64;
		process.env.OAUTH_RATE_MAX = "1000";
		process.env.STUDENT_OAUTH_ENABLED = "true";

		modelMocks.attemptCreate.mockResolvedValue({});
		modelMocks.attemptDeleteOne.mockReturnValue(queryWith({ deletedCount: 0 }));
		oauthMocks.createAuthorization.mockImplementation(async (_provider: string, state: string) => ({
			codeVerifier: "v".repeat(43),
			redirectUrl: new URL(`https://provider.example/authorize?state=${state}`)
		}));
		oauthMocks.exchangeCode.mockResolvedValue({
			sub: "provider-subject"
		});
	});

	afterAll(() => {
		resetStudentDataWriteBarriersForTests();
		for (const [key, value] of Object.entries(originalEnvironment)) {
			if (value === undefined) delete process.env[key];
			else process.env[key] = value;
		}
	});

	it("starts association during a hold only from a current setup session", async () => {
		const setupStudent = makeStudent({
			accessCodeExpiresAt: new Date(Date.now() + 60_000),
			pendingSetupCodeHash: "pending-code-hash",
			recordPreservationHoldActive: true
		});
		modelMocks.studentFindById.mockReturnValue(queryWith(setupStudent));
		modelMocks.studentFindOne.mockReturnValue(queryWith(setupStudent));

		await withRuntime(
			{
				studentAuthLevel: "setup",
				studentID: studentID.toString(),
				studentSessionVersion: 7,
				studentSetupExpiresAt: Date.now() + 60_000
			},
			async baseUrl => {
				const response = await fetch(`${baseUrl}/students/oauth/google/connect`, {
					body: JSON.stringify({ returnTo: "/courses" }),
					headers: {
						"content-type": "application/json",
						"x-classroom-request": "1"
					},
					method: "POST"
				});

				expect(response.status).toBe(200);
				await expect(response.json()).resolves.toEqual({
					authorizationUrl: expect.stringContaining("https://provider.example/authorize")
				});
			}
		);

		expect(modelMocks.studentFindOne).toHaveBeenCalledWith({
			_id: studentID.toString(),
			accessCodeExpiresAt: { $gt: expect.any(Date) },
			active: true,
			dataDeletionPendingAt: { $exists: false },
			externalAuthProvider: { $exists: false },
			externalAuthSubjectHash: { $exists: false },
			pendingSetupCodeHash: { $exists: true },
			retentionExpiresAt: { $gt: expect.any(Date) },
			sessionVersion: 7
		});
		expect(modelMocks.studentFindOne.mock.calls[0]?.[0]).not.toHaveProperty(
			"recordPreservationHoldActive"
		);
		const storedAttempt = modelMocks.attemptCreate.mock.calls[0]?.[0];
		expect(storedAttempt).toMatchObject({
			mode: "link",
			provider: "google",
			returnTo: "/courses",
			studentID: studentID.toString(),
			studentSessionVersion: 7
		});
		expect(storedAttempt).not.toHaveProperty("studentAccessCodeHash");
		expect(storedAttempt).not.toHaveProperty("accessCodeHash");
		expect(storedAttempt).not.toHaveProperty("pendingSetupCodeHash");
	});

	it("signs in during a hold only by a hashed provider subject", async () => {
		const state = "s".repeat(43);
		const binding = "b".repeat(43);
		const attempt = makeAttempt("google", "signin", state, binding);
		const authenticated = makeStudent({
			recordPreservationHoldActive: true,
			sessionVersion: 8
		});
		modelMocks.attemptFindOne.mockReturnValue(queryWith(attempt));
		modelMocks.attemptFindOneAndDelete.mockReturnValue(queryWith(attempt));
		modelMocks.studentFindOneAndUpdate.mockReturnValue(queryWith(authenticated));

		await withRuntime({}, async (baseUrl, session) => {
			const response = await fetch(
				`${baseUrl}/students/oauth/google/callback` +
					`?code=provider-code&state=${state}` +
					"&unexpected=provider-profile",
				{
					headers: callbackHeaders("google", binding),
					redirect: "manual"
				}
			);

			expect(response.status).toBe(303);
			expect(response.headers.get("location")).toBe("/courses?studentOAuthStatus=success");
			expect(session.studentID).toBe(studentID.toString());
			expect(session.studentSessionVersion).toBe(8);
			expect(session.studentAuthLevel).toBe("full");
		});

		const providerCallback = oauthMocks.exchangeCode.mock.calls[0]?.[1] as URL | undefined;
		expect(providerCallback?.searchParams.get("code")).toBe("provider-code");
		expect(providerCallback?.searchParams.has("unexpected")).toBe(false);
		const expectedSubjectHash = hash("google\0provider-subject");
		expect(modelMocks.studentFindOneAndUpdate).toHaveBeenCalledWith(
			{
				active: true,
				dataDeletionPendingAt: { $exists: false },
				externalAuthProvider: "google",
				externalAuthSubjectHash: expectedSubjectHash,
				retentionExpiresAt: { $gt: expect.any(Date) }
			},
			expect.objectContaining({
				$inc: { sessionVersion: 1 },
				$set: expect.objectContaining({
					retentionExpiresAt: expect.any(Date),
					retentionPolicyDays: 90
				})
			}),
			{ new: true }
		);
		const lookup = modelMocks.studentFindOneAndUpdate.mock.calls[0]?.[0];
		expect(lookup).not.toHaveProperty("recordPreservationHoldActive");
		expect(JSON.stringify(lookup)).not.toContain("provider-subject");
		expect(lookup).not.toHaveProperty("email");
		expect(lookup).not.toHaveProperty("username");
		expect(modelMocks.studentCreate).not.toHaveBeenCalled();
	});

	it("does not auto-create a student for an unknown provider identity", async () => {
		const state = "u".repeat(43);
		const binding = "c".repeat(43);
		const attempt = makeAttempt("google", "signin", state, binding);
		modelMocks.attemptFindOne.mockReturnValue(queryWith(attempt));
		modelMocks.attemptFindOneAndDelete.mockReturnValue(queryWith(attempt));
		modelMocks.studentFindOneAndUpdate.mockReturnValue(queryWith(null));

		await withRuntime({}, async baseUrl => {
			const response = await fetch(
				`${baseUrl}/students/oauth/google/callback` + `?code=provider-code&state=${state}`,
				{
					headers: callbackHeaders("google", binding),
					redirect: "manual"
				}
			);

			expect(response.status).toBe(303);
			expect(response.headers.get("location")).toBe("/courses?studentOAuthError=not_linked");
		});

		expect(modelMocks.studentCreate).not.toHaveBeenCalled();
	});

	it("links during a hold with one atomic update requiring live setup proof", async () => {
		const state = "l".repeat(43);
		const binding = "d".repeat(43);
		const attempt = makeAttempt("apple", "link", state, binding, {
			studentID,
			studentSessionVersion: 7
		});
		modelMocks.attemptFindOne.mockReturnValue(queryWith(attempt));
		modelMocks.attemptFindOneAndDelete.mockReturnValue(queryWith(attempt));
		modelMocks.studentFindOneAndUpdate.mockReturnValue(queryWith(makeStudent({
			recordPreservationHoldActive: true,
			sessionVersion: 8
		})));

		await withRuntime(
			{
				studentAuthLevel: "setup",
				studentID: studentID.toString(),
				studentSessionVersion: 7,
				studentSetupExpiresAt: Date.now() + 60_000
			},
			async (baseUrl, session) => {
				const response = await fetch(`${baseUrl}/students/oauth/apple/callback`, {
					body: new URLSearchParams({
						code: "provider-code",
						state
					}),
					headers: {
						...callbackHeaders("apple", binding),
						"content-type": "application/x-www-form-urlencoded"
					},
					method: "POST",
					redirect: "manual"
				});

				expect(response.status).toBe(303);
				expect(response.headers.get("location")).toBe("/courses?studentOAuthStatus=linked");
				expect(session.studentAuthLevel).toBe("full");
				expect(session.studentSessionVersion).toBe(8);
			}
		);

		const [conditions, update, options] = modelMocks.studentFindOneAndUpdate.mock.calls[0] ?? [];
		expect(conditions).toEqual({
			_id: studentID,
			accessCodeExpiresAt: { $gt: expect.any(Date) },
			active: true,
			dataDeletionPendingAt: { $exists: false },
			externalAuthProvider: { $exists: false },
			externalAuthSubjectHash: { $exists: false },
			pendingSetupCodeHash: { $exists: true },
			retentionExpiresAt: { $gt: expect.any(Date) },
			sessionVersion: 7
		});
		expect(update).toMatchObject({
			$inc: { sessionVersion: 1 },
			$set: {
				externalAuthProvider: "apple",
				externalAuthSubjectHash: hash("apple\0provider-subject"),
				failedLoginAttempts: 0,
				lastLoginAt: expect.any(Date),
				retentionExpiresAt: expect.any(Date),
				retentionPolicyDays: 90
			},
			$unset: {
				accessCodeHash: 1,
				accessCodeExpiresAt: 1,
				lastPasswordSetupRequestID: 1,
				lockedUntil: 1,
				passwordHash: 1,
				passwordSetAt: 1,
				pendingSetupCodeHash: 1
			}
		});
		expect(options).toEqual({ new: true });
		expect(conditions).not.toHaveProperty("recordPreservationHoldActive");
	});

	it("does not finish a provider link after permanent deletion closes the student gate", async () => {
		const state = "g".repeat(43);
		const binding = "h".repeat(43);
		const attempt = makeAttempt("google", "link", state, binding, {
			studentID,
			studentSessionVersion: 7
		});
		modelMocks.attemptFindOne.mockReturnValue(queryWith(attempt));
		modelMocks.attemptFindOneAndDelete.mockReturnValue(queryWith(attempt));
		await closeStudentDataWritesAndWait(studentID.toString());

		await withRuntime({}, async baseUrl => {
			const response = await fetch(
				`${baseUrl}/students/oauth/google/callback` + `?code=provider-code&state=${state}`,
				{
					headers: callbackHeaders("google", binding),
					redirect: "manual"
				}
			);

			expect(response.status).toBe(303);
			expect(response.headers.get("location")).toBe("/courses?studentOAuthError=link_expired");
		});

		expect(oauthMocks.exchangeCode).not.toHaveBeenCalled();
		expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
	});

	it("rejects a provider link when permanent deletion makes its predicate stale", async () => {
		const state = "e".repeat(43);
		const binding = "f".repeat(43);
		const attempt = makeAttempt("google", "link", state, binding, {
			studentID,
			studentSessionVersion: 7
		});
		modelMocks.attemptFindOne.mockReturnValue(queryWith(attempt));
		modelMocks.attemptFindOneAndDelete.mockReturnValue(queryWith(attempt));
		const pendingStudent = {
			...makeStudent(),
			dataDeletionPendingAt: new Date("2026-08-02T14:00:00.000Z")
		};
		modelMocks.studentFindOneAndUpdate.mockImplementation((conditions) => {
			expect(pendingStudent.dataDeletionPendingAt).toBeInstanceOf(Date);
			expect(conditions).toMatchObject({
				dataDeletionPendingAt: { $exists: false }
			});
			return queryWith(null);
		});

		await withRuntime({}, async (baseUrl, session) => {
			const response = await fetch(
				`${baseUrl}/students/oauth/google/callback` + `?code=provider-code&state=${state}`,
				{
					headers: callbackHeaders("google", binding),
					redirect: "manual"
				}
			);

			expect(response.status).toBe(303);
			expect(response.headers.get("location")).toBe("/courses?studentOAuthError=link_expired");
			expect(session.studentID).toBeUndefined();
		});
	});

	it("reports a duplicate provider subject as an identity conflict", async () => {
		const state = "i".repeat(43);
		const binding = "j".repeat(43);
		const attempt = makeAttempt("google", "link", state, binding, {
			studentID,
			studentSessionVersion: 7
		});
		modelMocks.attemptFindOne.mockReturnValue(queryWith(attempt));
		modelMocks.attemptFindOneAndDelete.mockReturnValue(queryWith(attempt));
		modelMocks.studentFindOneAndUpdate.mockReturnValue(queryRejecting({ code: 11000 }));

		await withRuntime({}, async baseUrl => {
			const response = await fetch(
				`${baseUrl}/students/oauth/google/callback` + `?code=provider-code&state=${state}`,
				{
					headers: callbackHeaders("google", binding),
					redirect: "manual"
				}
			);

			expect(response.status).toBe(303);
			expect(response.headers.get("location")).toBe("/courses?studentOAuthError=identity_conflict");
		});
	});

	it("validates state and browser binding before consuming an attempt exactly once", async () => {
		const state = "q".repeat(43);
		const binding = "r".repeat(43);
		const attempt = makeAttempt("google", "signin", state, binding);
		modelMocks.attemptFindOne.mockReturnValue(queryWith(attempt));
		modelMocks.attemptFindOneAndDelete.mockReturnValueOnce(queryWith(attempt)).mockReturnValueOnce(queryWith(null));
		modelMocks.studentFindOneAndUpdate.mockReturnValue(queryWith(makeStudent({ sessionVersion: 8 })));

		await withRuntime({}, async baseUrl => {
			const wrongBrowser = await fetch(
				`${baseUrl}/students/oauth/google/callback` + `?code=provider-code&state=${state}`,
				{
					headers: callbackHeaders("google", "wrong-binding"),
					redirect: "manual"
				}
			);
			expect(wrongBrowser.headers.get("location")).toBe("/courses?studentOAuthError=provider_error");
			expect(modelMocks.attemptFindOneAndDelete).not.toHaveBeenCalled();
			expect(oauthMocks.exchangeCode).not.toHaveBeenCalled();

			const accepted = await fetch(
				`${baseUrl}/students/oauth/google/callback` + `?code=provider-code&state=${state}`,
				{
					headers: callbackHeaders("google", binding),
					redirect: "manual"
				}
			);
			expect(accepted.headers.get("location")).toBe("/courses?studentOAuthStatus=success");

			const replayed = await fetch(
				`${baseUrl}/students/oauth/google/callback` + `?code=provider-code&state=${state}`,
				{
					headers: callbackHeaders("google", binding),
					redirect: "manual"
				}
			);
			expect(replayed.headers.get("location")).toBe("/courses?studentOAuthError=provider_error");
		});

		expect(modelMocks.attemptFindOne).toHaveBeenCalledWith({
			expiresAt: { $gt: expect.any(Date) },
			provider: "google",
			stateHash: hash(state)
		});
		expect(modelMocks.attemptFindOneAndDelete).toHaveBeenCalledWith({
			_id: attemptID,
			expiresAt: { $gt: expect.any(Date) }
		});
		expect(oauthMocks.exchangeCode).toHaveBeenCalledTimes(1);
		expect(oauthMocks.exchangeCode).toHaveBeenCalledWith("google", expect.any(URL), {
			codeVerifier: "v".repeat(43),
			nonce: "n".repeat(43),
			state
		});
	});

	it("allows only the exact Apple form-post callback to bypass same-origin mutation checks", async () => {
		await withRuntime({}, async baseUrl => {
			const appleCallback = await fetch(`${baseUrl}/students/oauth/apple/callback`, {
				body: new URLSearchParams({ state: "too-short" }),
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					origin: "https://appleid.apple.com",
					"sec-fetch-site": "cross-site"
				},
				method: "POST",
				redirect: "manual"
			});
			expect(appleCallback.status).toBe(303);
			expect(appleCallback.headers.get("location")).toBe("/?studentOAuthError=provider_error");

			const wrongAppleContentType = await fetch(`${baseUrl}/students/oauth/apple/callback`, {
				body: JSON.stringify({ state: "s".repeat(43) }),
				headers: {
					"content-type": "application/json",
					origin: "https://appleid.apple.com",
					"sec-fetch-site": "cross-site"
				},
				method: "POST"
			});
			expect(wrongAppleContentType.status).toBe(415);

			const unrelatedPost = await fetch(`${baseUrl}/students/oauth/google/callback`, {
				body: new URLSearchParams({ state: "too-short" }),
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					origin: "https://attacker.example",
					"sec-fetch-site": "cross-site"
				},
				method: "POST"
			});
			expect(unrelatedPost.status).toBe(403);
			await expect(unrelatedPost.json()).resolves.toEqual({
				message: "Classroom request header required."
			});
		});
	});
});
