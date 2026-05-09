import type { Server } from "node:http";
import type { RequestHandler } from "express";
import express from "express";
import { describe, expect, it } from "vitest";
import {
	createAdminMailLimiter,
	createUserCourseAccessLimiter
} from "../src/middleware/rateLimiters.js";
import { renderMarkdownEmailHtml } from "../src/routes/adminMailRoutes.js";

async function withServer<T>(
	handler: RequestHandler,
	run: (baseUrl: string) => Promise<T>
): Promise<T> {
	const app = express();
	app.set("trust proxy", false);
	app.use(handler);
	app.all("/limited", (_req, res) => {
		res.json({ ok: true });
	});

	const server = await new Promise<Server>((resolve) => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	}
	finally {
		await new Promise<void>((resolve, reject) => {
			server.close((error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

async function requestLimitedEndpoint(baseUrl: string): Promise<Response> {
	return fetch(`${baseUrl}/limited`, { method: "POST" });
}

function getStandardRateLimitHeader(response: Response): string | null {
	return response.headers.get("ratelimit") ?? response.headers.get("ratelimit-limit");
}

describe("security dependency regressions", () => {
	it("keeps admin mail rate limiting on standard headers and disables legacy headers", async () => {
		await withServer(
			createAdminMailLimiter({ limit: 2, windowMs: 60_000 }),
			async (baseUrl) => {
				const first = await requestLimitedEndpoint(baseUrl);
				const second = await requestLimitedEndpoint(baseUrl);
				const third = await requestLimitedEndpoint(baseUrl);

				expect(first.status).toBe(200);
				expect(second.status).toBe(200);
				expect(third.status).toBe(429);
				expect(getStandardRateLimitHeader(first)).toBeTruthy();
				expect(first.headers.get("x-ratelimit-limit")).toBeNull();
				await expect(third.json()).resolves.toEqual({
					message: "Too many requests, slow down."
				});
			}
		);
	});

	it("keeps user course progress endpoints protected by the same non-legacy rate-limit header policy", async () => {
		await withServer(
			createUserCourseAccessLimiter({ limit: 1, windowMs: 60_000 }),
			async (baseUrl) => {
				const first = await requestLimitedEndpoint(baseUrl);
				const second = await requestLimitedEndpoint(baseUrl);

				expect(first.status).toBe(200);
				expect(second.status).toBe(429);
				expect(getStandardRateLimitHeader(second)).toBeTruthy();
				expect(second.headers.get("x-ratelimit-limit")).toBeNull();
			}
		);
	});

	it("renders normal markdown into the email HTML shell used by admin mail", async () => {
		const html = await renderMarkdownEmailHtml(
			"# Lesson Notes\n\nStudent completed **arrays** practice.\n\n- Reviewed bounds\n- Discussed edge cases"
		);

		expect(html).toContain("<!doctype html>");
		expect(html).toContain("<h1>Lesson Notes</h1>");
		expect(html).toContain("<strong>arrays</strong>");
		expect(html).toContain("<li>Reviewed bounds</li>");
		expect(html).toContain("<table role=\"presentation\"");
	});

	it("handles malformed deeply nested markdown without throwing or returning a non-string", async () => {
		const nestedMarkdown = `${"[".repeat(250)}safe text${"]".repeat(250)}`;
		const html = await renderMarkdownEmailHtml(nestedMarkdown);

		expect(typeof html).toBe("string");
		expect(html).toContain("safe text");
		expect(html).toContain("<!doctype html>");
	});
});
