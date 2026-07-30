import type { Server } from "node:http";
import type { RequestHandler } from "express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { requireInternalDiagnostics } from "../src/middleware/internalDiagnostics.js";
import {
	DEFAULT_CLASSROOM_ANALYTICS_RETENTION_DAYS,
	readClassroomAnalyticsRetentionDays
} from "../src/security/classroomAnalytics.js";
import {
	createLoginLimiter,
	createProjectDataAccessLimiter,
	createStudentOAuthLimiter,
	createStudentPasswordSetupLimiter,
	createStudentProjectWriteLimiter
} from "../src/middleware/rateLimiters.js";
import {
	MIN_PRODUCTION_SESSION_SECRET_BYTES,
	PRODUCTION_CLASSROOM_ORIGIN,
	readBooleanSetting,
	readClassroomOrigin,
	readSessionSecret
} from "../src/security/environment.js";
import { readTrustProxySetting } from "../src/security/trustProxy.js";

async function withServer<T>(handler: RequestHandler, run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.set("trust proxy", false);
	app.use(handler);
	app.all("/limited", (_req, res) => {
		res.json({ ok: true });
	});

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
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

async function requestLimitedEndpoint(baseUrl: string, headers?: Record<string, string>): Promise<Response> {
	return fetch(`${baseUrl}/limited`, { headers, method: "POST" });
}

describe("security dependency regressions", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("parses false-valued environment flags as false", () => {
		expect(readBooleanSetting(undefined, "CROSS_SITE")).toBe(false);
		expect(readBooleanSetting("", "CROSS_SITE")).toBe(false);
		expect(readBooleanSetting("false", "CROSS_SITE")).toBe(false);
		expect(readBooleanSetting("0", "CROSS_SITE")).toBe(false);
		expect(readBooleanSetting("true", "CROSS_SITE")).toBe(true);
		expect(() => readBooleanSetting("sometimes", "CROSS_SITE")).toThrow("CROSS_SITE must be true or false");
	});

	it("uses a fixed HTTPS classroom origin when production is behind a proxy", () => {
		expect(readClassroomOrigin(undefined, true)).toBe(PRODUCTION_CLASSROOM_ORIGIN);
		expect(readClassroomOrigin(undefined, false)).toBeUndefined();
		expect(readClassroomOrigin("https://school.example/", true)).toBe("https://school.example");
		expect(() => readClassroomOrigin("http://school.example", true)).toThrow("must use HTTPS");
		expect(() => readClassroomOrigin("https://school.example/api", true)).toThrow("must contain only a web origin");
	});

	it("requires a configured session secret and at least 32 UTF-8 bytes in production", () => {
		expect(() => readSessionSecret(undefined, false)).toThrow("Missing SESSION_SECRET");
		expect(() => readSessionSecret("   ", true)).toThrow("Missing SESSION_SECRET");
		expect(readSessionSecret("short-development-secret", false)).toBe("short-development-secret");
		expect(() => readSessionSecret("x".repeat(31), true)).toThrow(
			`at least ${MIN_PRODUCTION_SESSION_SECRET_BYTES} UTF-8 bytes`
		);
		expect(readSessionSecret("x".repeat(32), true)).toBe("x".repeat(32));
	});

	it("bounds anonymous analytics retention", () => {
		expect(readClassroomAnalyticsRetentionDays(undefined)).toBe(DEFAULT_CLASSROOM_ANALYTICS_RETENTION_DAYS);
		expect(readClassroomAnalyticsRetentionDays("7")).toBe(7);
		expect(readClassroomAnalyticsRetentionDays("90")).toBe(90);
		expect(() => readClassroomAnalyticsRetentionDays("6")).toThrow("must be an integer from 7 to 90");
		expect(() => readClassroomAnalyticsRetentionDays("91")).toThrow("must be an integer from 7 to 90");
	});

	it("does not trust forwarded client addresses unless proxy hops are explicitly configured", () => {
		expect(readTrustProxySetting(undefined)).toBe(false);
		expect(readTrustProxySetting("")).toBe(false);
		expect(readTrustProxySetting("1")).toBe(1);
		expect(() => readTrustProxySetting("0")).toThrow("TRUST_PROXY_HOPS must be a positive integer");
		expect(() => readTrustProxySetting("not-a-number")).toThrow("TRUST_PROXY_HOPS must be a positive integer");
	});

	it("does not let spoofed forwarding headers bypass teacher login throttling", async () => {
		await withServer(createLoginLimiter({ limit: 1, windowMs: 60_000 }), async baseUrl => {
			const first = await requestLimitedEndpoint(baseUrl, {
				"X-Forwarded-For": "198.51.100.10"
			});
			const second = await requestLimitedEndpoint(baseUrl, {
				"X-Forwarded-For": "203.0.113.20"
			});

			expect(first.status).toBe(200);
			expect(second.status).toBe(429);
		});
	});

	it("limits password setup attempts before expensive credential work", async () => {
		await withServer(createStudentPasswordSetupLimiter({ limit: 1, windowMs: 60_000 }), async baseUrl => {
			const first = await requestLimitedEndpoint(baseUrl);
			const second = await requestLimitedEndpoint(baseUrl);

			expect(first.status).toBe(200);
			expect(second.status).toBe(429);
			await expect(second.json()).resolves.toEqual({
				message: "Too many password setup attempts. Please try again later."
			});
		});
	});

	it("rejects an OAuth security window longer than the disclosed 15 minutes", () => {
		vi.stubEnv("OAUTH_RATE_WINDOW_MS", String(15 * 60 * 1000 + 1));
		expect(() => createStudentOAuthLimiter()).toThrow(
			"OAUTH_RATE_WINDOW_MS must be a positive integer no greater than 900000"
		);

		vi.stubEnv("OAUTH_RATE_WINDOW_MS", String(15 * 60 * 1000));
		expect(() => createStudentOAuthLimiter()).not.toThrow();
	});

	it("rejects a login security window longer than the disclosed 15 minutes", () => {
		vi.stubEnv("LOGIN_RATE_WINDOW_MS", String(15 * 60 * 1000 + 1));
		expect(() => createLoginLimiter()).toThrow(
			"LOGIN_RATE_WINDOW_MS must be a positive integer no greater than 900000"
		);

		vi.stubEnv("LOGIN_RATE_WINDOW_MS", String(15 * 60 * 1000));
		expect(() => createLoginLimiter()).not.toThrow();
	});

	it("counts a project mutation only once across pre-parser and route guards", async () => {
		const preParserLimiter = createStudentProjectWriteLimiter({
			limit: 1,
			windowMs: 60_000
		});
		const routeLimiter = createStudentProjectWriteLimiter({
			limit: 1,
			windowMs: 60_000
		});
		const applyBoth: RequestHandler = (req, res, next) => {
			preParserLimiter(req, res, error => {
				if (error) {
					next(error);
					return;
				}
				routeLimiter(req, res, next);
			});
		};

		await withServer(applyBoth, async baseUrl => {
			const first = await requestLimitedEndpoint(baseUrl);
			const second = await requestLimitedEndpoint(baseUrl);

			expect(first.status).toBe(200);
			expect(second.status).toBe(429);
		});
	});

	it("rate limits project data access before route work can run", async () => {
		await withServer(createProjectDataAccessLimiter({
			limit: 1,
			windowMs: 60_000
		}), async baseUrl => {
			const first = await requestLimitedEndpoint(baseUrl);
			const second = await requestLimitedEndpoint(baseUrl);

			expect(first.status).toBe(200);
			expect(second.status).toBe(429);
			await expect(second.json()).resolves.toEqual({
				message: "Too many project requests. Please try again shortly."
			});
		});
	});

	it("keeps sensitive deletion receipt details out of application logs", () => {
		const deletionService = readFileSync(
			fileURLToPath(new URL("../src/services/studentRecordDeletion.ts", import.meta.url)),
			"utf8"
		);

		expect(deletionService).not.toMatch(/console\.(?:debug|error|info|log|warn)/u);
		expect(deletionService).not.toContain("student-record-delete completed");
	});

	it("guards cookie routes and project database access in security-first order", () => {
		const server = readFileSync(
			fileURLToPath(new URL("../src/server.ts", import.meta.url)),
			"utf8"
		);
		const requestGuard = server.indexOf(
			"app.use(classroomRequestPaths, requireClassroomRequest);"
		);
		const cookieMiddleware = server.indexOf(
			"app.use(cookieSession(cookieOptions));"
		);
		const studentDataLimiter = server.indexOf(
			"studentProjectDataAccessLimiter,"
		);
		const studentDatabaseAuth = server.indexOf(
			"validStudent,",
			studentDataLimiter
		);

		expect(requestGuard).toBeGreaterThan(-1);
		expect(requestGuard).toBeLessThan(cookieMiddleware);
		expect(server).toContain('sameSite: "strict"');
		expect(server).toContain("...(isProd ? { secure: true } : {})");
		expect(server).not.toContain("secure: false");
		expect(studentDataLimiter).toBeGreaterThan(-1);
		expect(studentDataLimiter).toBeLessThan(studentDatabaseAuth);
	});

	it("requires the configured key for database diagnostics in every environment", async () => {
		await withServer(requireInternalDiagnostics(undefined), async baseUrl => {
			const response = await fetch(`${baseUrl}/limited`, {
				headers: {
					"X-Forwarded-For": "127.0.0.1"
				}
			});
			expect(response.status).toBe(403);
		});

		await withServer(requireInternalDiagnostics("correct-diagnostics-key"), async baseUrl => {
			const wrong = await fetch(`${baseUrl}/limited`, {
				headers: {
					"X-Internal-Diagnostics-Key": "wrong-diagnostics-key"
				}
			});
			const correct = await fetch(`${baseUrl}/limited`, {
				headers: {
					"X-Internal-Diagnostics-Key": "correct-diagnostics-key"
				}
			});

			expect(wrong.status).toBe(403);
			expect(correct.status).toBe(200);
		});
	});

});
