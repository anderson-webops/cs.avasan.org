import type { Server } from "node:http";
import { ADMIN_SINGLETON_ID } from "../src/security/adminIdentity.js";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import express from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { requireClassroomRequest } from "../src/middleware/classroomRequest.js";
import { ideReportSchema } from "../src/utils/ideDiagnostics.js";

const mocks = vi.hoisted(() => ({
	create: vi.fn(),
	find: vi.fn(),
	update: vi.fn(),
	admin: vi.fn()
}));
vi.mock("../src/models/schemas/IdeProblemReport.js", () => ({
	IdeProblemReport: {
		create: mocks.create,
		find: mocks.find,
		updateOne: mocks.update
	}
}));
vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: { findById: mocks.admin }
}));
const { ideReportRoutes } = await import("../src/routes/ideReportRoutes.js");
const origin = "https://cs.avasan.org";
const referenceID = randomUUID();
const payload = {
	previewConfirmed: true,
	description: "The canvas stopped responding.",
	diagnostics: {
		schemaVersion: 1,
		referenceID,
		site: origin,
		release: "v2.7.215",
		revision: "a".repeat(40),
		browser: { name: "Chrome", version: "148.0.0.0" },
		runtime: {
			engine: "pyodide",
			version: "314.0.0",
			pythonVersion: "3.14.0",
			adapterRevision: "a".repeat(40),
			blueJVersion: "unknown"
		},
		mode: "turtle",
		stage: "executing",
		category: "student-code",
		errorType: "NameError",
		stack: [{ scope: "project", line: 4 }]
	}
};

async function withServer(run: (base: string) => Promise<void>) {
	const app = express();
	app.use(requireClassroomRequest);
	app.use((req, _res, next) => {
		// Test-only sessions, real role validation middleware remains in the router.
		const role = req.get("x-test-role");
		req.session = role
			? {
					[`${role}ID`]: ADMIN_SINGLETON_ID,
					adminSessionVersion: 0,
					adminLastActivityAt: Date.now(),
					adminExpiresAt: Date.now() + 60000
				}
			: {};
		next();
	});
	app.use("/ide-reports", ideReportRoutes);
	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	try {
		const address = server.address();
		if (!address || typeof address === "string")
			throw new Error("Missing test address");
		await run(`http://127.0.0.1:${address.port}/ide-reports`);
	} finally {
		await new Promise<void>(resolve => server.close(() => resolve()));
	}
}

const headers = {
	"Content-Type": "application/json",
	"X-Classroom-Request": "1",
	origin
};
beforeEach(() => {
	vi.resetAllMocks();
	vi.stubEnv("CLASSROOM_ORIGIN", origin);
	mocks.admin.mockReturnValue({
		select: vi.fn().mockResolvedValue({ sessionVersion: 0 })
	});
	mocks.create.mockResolvedValue({});
});

afterEach(() => vi.unstubAllEnvs());

describe("IDE report privacy and access", () => {
	it("accepts explicitly reviewed anonymous reports without saving session or request headers", async () => {
		await withServer(async base => {
			const response = await fetch(base, {
				method: "POST",
				headers,
				body: JSON.stringify(payload)
			});
			expect(response.status).toBe(201);
			expect(response.headers.get("cache-control")).toBe("no-store");
			expect(await response.json()).toEqual({ referenceID });
			expect(mocks.create).toHaveBeenCalledWith({
				referenceID,
				diagnostics: payload.diagnostics,
				description: payload.description
			});
		});
	});
	it("rejects missing consent and extra private fields before persistence", async () => {
		await withServer(async base => {
			for (const bad of [
				{ ...payload, previewConfirmed: false },
				{ ...payload, code: "student code" },
				{
					...payload,
					diagnostics: { ...payload.diagnostics, site: "not-a-url" }
				},
				{
					...payload,
					diagnostics: {
						...payload.diagnostics,
						stack: "secret traceback"
					}
				},
				{
					...payload,
					diagnostics: {
						...payload.diagnostics,
						browser: {
							name: "Chrome",
							version: "student@example.com"
						}
					}
				},
				{
					...payload,
					diagnostics: {
						...payload.diagnostics,
						site: `${origin}/?token=secret`
					}
				}
			])
				expect(
					(
						await fetch(base, {
							method: "POST",
							headers,
							body: JSON.stringify(bad)
						})
					).status
				).toBe(400);
			expect(mocks.create).not.toHaveBeenCalled();
		});
	});
	it("rejects cross-site requests and oversized bodies without echoing their contents", async () => {
		await withServer(async base => {
			expect(
				(
					await fetch(base, {
						method: "POST",
						headers: {
							...headers,
							origin: "https://other.invalid"
						},
						body: JSON.stringify(payload)
					})
				).status
			).toBe(403);
			const response = await fetch(base, {
				method: "POST",
				headers,
				body: JSON.stringify({
					...payload,
					description: "SECRET".repeat(5000)
				})
			});
			expect(response.status).toBe(413);
			expect(await response.text()).not.toContain("SECRET");
			expect(mocks.create).not.toHaveBeenCalled();
		});
	});
	it("makes retries idempotent without exposing an existing report", async () => {
		mocks.create.mockRejectedValueOnce({ code: 11000 });
		await withServer(async base => {
			const response = await fetch(base, {
				method: "POST",
				headers,
				body: JSON.stringify(payload)
			});
			expect(response.status).toBe(201);
			expect(await response.json()).toEqual({ referenceID });
			expect(mocks.update).not.toHaveBeenCalled();
		});
	});
	it.each([undefined, "student"])(
		"denies report reading and status changes to %s",
		async role => {
			await withServer(async base => {
				const roleHeaders = role ? { "x-test-role": role } : {};
				expect(
					(await fetch(base, { headers: roleHeaders })).status
				).toBe(403);
				expect(
					(
						await fetch(`${base}/${referenceID}`, {
							method: "PATCH",
							headers: { ...headers, ...roleHeaders },
							body: JSON.stringify({ status: "resolved" })
						})
					).status
				).toBe(403);
				expect(mocks.find).not.toHaveBeenCalled();
				expect(mocks.update).not.toHaveBeenCalled();
			});
		}
	);
	it("denies stale admin sessions", async () => {
		mocks.admin.mockReturnValue({
			select: vi.fn().mockResolvedValue({ sessionVersion: 2 })
		});
		await withServer(async base => {
			expect(
				(await fetch(base, { headers: { "x-test-role": "admin" } }))
					.status
			).toBe(403);
		});
	});
	it("paginates private reports and accepts only fixed triage statuses", async () => {
		const query = {
			sort: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			lean: vi.fn().mockResolvedValue(
				Array.from({ length: 26 }, (_, index) => ({
					_id: String(index).padStart(24, "0"),
					...payload
				}))
			)
		};
		mocks.find.mockReturnValue(query);
		mocks.update.mockResolvedValue({ matchedCount: 1 });
		await withServer(async base => {
			const response = await fetch(base, {
				headers: { "x-test-role": "admin" }
			});
			const data = await response.json();
			expect(response.status).toBe(200);
			expect(data.reports).toHaveLength(25);
			expect(data.nextCursor).toBe("000000000000000000000024");
			expect(query.limit).toHaveBeenCalledWith(26);
			await fetch(`${base}?referenceID=${referenceID}`, {
				headers: { "x-test-role": "admin" }
			});
			expect(mocks.find.mock.calls.at(-1)?.[0].referenceID).toBe(
				referenceID
			);
			expect(
				(
					await fetch(`${base}?referenceID=invalid`, {
						headers: { "x-test-role": "admin" }
					})
				).status
			).toBe(400);
			expect(mocks.find.mock.calls[0][0].createdAt.$gt).toBeInstanceOf(
				Date
			);
			const updateHeaders = { ...headers, "x-test-role": "admin" };
			expect(
				(
					await fetch(`${base}/${referenceID}`, {
						method: "PATCH",
						headers: updateHeaders,
						body: JSON.stringify({ status: "resolved" })
					})
				).status
			).toBe(200);
			expect(
				(
					await fetch(`${base}/${referenceID}`, {
						method: "PATCH",
						headers: updateHeaders,
						body: JSON.stringify({
							status: "resolved",
							diagnostics: {}
						})
					})
				).status
			).toBe(400);
		});
	});
	it("bounds report ingress before parsing and never invokes alert or execution services", async () => {
		await withServer(async base => {
			let response: Response | undefined;
			for (let i = 0; i < 65; i++) {
				response = await fetch(base, {
					method: "POST",
					headers,
					body: JSON.stringify(payload)
				});
				if (response.status === 429) break;
			}
			expect(response?.status).toBe(429);
		});
		const source = readFileSync(
			new URL("../src/routes/ideReportRoutes.ts", import.meta.url),
			"utf8"
		);
		expect(source).not.toMatch(
			/console\.|sendMail|child_process|javac|runPython/
		);
		expect(source.indexOf("createIdeReportLimiter(),")).toBeLessThan(
			source.indexOf("express.json(")
		);
	});
	it("enforces numeric-only stack locations with no code field", () => {
		expect(
			ideReportSchema.safeParse({
				...payload,
				diagnostics: {
					...payload.diagnostics,
					stack: [{ scope: "project", line: 5, code: "private" }]
				}
			}).success
		).toBe(false);
	});
});
