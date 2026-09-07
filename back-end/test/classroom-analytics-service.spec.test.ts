import type { Server } from "node:http";
import express from "express";
import { describe, expect, it } from "vitest";
import {
	createClassroomAnalyticsServiceClientLimiter,
	createClassroomAnalyticsServiceGlobalLimiter
} from "../src/middleware/rateLimiters.js";
import {
	readClassroomAnalyticsServiceKey,
	requireClassroomAnalyticsService
} from "../src/security/classroomAnalyticsService.js";

async function withServer(
	middleware: express.RequestHandler[],
	run: (baseUrl: string) => Promise<void>
) {
	const app = express();
	app.set("trust proxy", false);
	app.get("/summary", ...middleware, (_req, res) => res.json({ ok: true }));
	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to an IPv4 port");
	}
	try {
		await run(`http://127.0.0.1:${address.port}`);
	}
	finally {
		await new Promise<void>((resolve, reject) => server.close(error =>
			error ? reject(error) : resolve()
		));
	}
}

describe("classroom analytics companion authentication", () => {
	it("accepts only a bounded explicit service key", () => {
		expect(readClassroomAnalyticsServiceKey(undefined)).toBeNull();
		expect(readClassroomAnalyticsServiceKey("")).toBeNull();
		expect(readClassroomAnalyticsServiceKey("s".repeat(32))).toBe("s".repeat(32));
		for (const value of [
			"s".repeat(31),
			"s".repeat(257),
			` ${"s".repeat(32)}`,
			`${"s".repeat(32)} `,
			`${"s".repeat(32)}\nmore`
		]) {
			expect(() => readClassroomAnalyticsServiceKey(value)).toThrow(
				"CLASSROOM_ANALYTICS_SERVICE_KEY"
			);
		}
	});

	it("authenticates an exact header without returning a session cookie", async () => {
		await withServer(
			[requireClassroomAnalyticsService("s".repeat(32))],
			async baseUrl => {
				const response = await fetch(`${baseUrl}/summary`, {
					headers: { "X-Classroom-Analytics-Key": "s".repeat(32) }
				});
				expect(response.status).toBe(200);
				expect(response.headers.get("cache-control")).toBe("no-store");
				expect(response.headers.get("set-cookie")).toBeNull();
			}
		);
	});

	it("applies service limits only after successful authentication", async () => {
		await withServer(
			[
				requireClassroomAnalyticsService("s".repeat(32)),
				createClassroomAnalyticsServiceGlobalLimiter({ limit: 10, windowMs: 60_000 }),
				createClassroomAnalyticsServiceClientLimiter({ limit: 1, windowMs: 60_000 })
			],
			async baseUrl => {
				for (let attempt = 0; attempt < 2; attempt += 1) {
					const denied = await fetch(`${baseUrl}/summary`, {
						headers: {
							"X-Classroom-Analytics-Key": "wrong".repeat(8)
						}
					});
					expect(denied.status).toBe(403);
				}

				const first = await fetch(`${baseUrl}/summary`, {
					headers: { "X-Classroom-Analytics-Key": "s".repeat(32) }
				});
				const limited = await fetch(`${baseUrl}/summary`, {
					headers: { "X-Classroom-Analytics-Key": "s".repeat(32) }
				});
				expect(first.status).toBe(200);
				expect(limited.status).toBe(429);
				expect(limited.headers.get("cache-control")).toBe("no-store");
			}
		);
	});
});
