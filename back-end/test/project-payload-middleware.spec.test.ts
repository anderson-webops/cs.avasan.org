import type { Server } from "node:http";
import { request } from "node:http";
import { gzipSync } from "node:zlib";
import express from "express";
import { describe, expect, it, vi } from "vitest";
import {
	claimProjectPayloadReservation,
	createProjectJsonParser,
	createProjectPayloadConcurrencyGuard,
	withProjectPayloadReservation
} from "../src/middleware/projectPayload.js";
import { createHeavyProjectPayloadLimiter } from "../src/middleware/rateLimiters.js";

interface PayloadAppOptions {
	globalLimit?: number;
	heavyRateLimit?: number;
	heavyThresholdBytes?: number;
	normalGlobalLimit?: number;
	normalPerIdentityLimit?: number;
	parserLimit?: string;
	perIdentityLimit?: number;
}

interface PayloadAppControls {
	authenticated: ReturnType<typeof vi.fn>;
	limited: ReturnType<typeof vi.fn>;
	releaseHeld: () => void;
	releasePreGuard: () => void;
	saved: ReturnType<typeof vi.fn>;
	waitForAbortedCount: (count: number) => Promise<void>;
	waitForClosedCount: (count: number) => Promise<void>;
	waitForHeldCount: (count: number) => Promise<void>;
	waitForParserEntryCount: (count: number) => Promise<void>;
	waitForPreGuardContinuedCount: (count: number) => Promise<void>;
	waitForPreGuardCount: (count: number) => Promise<void>;
	waitForSettledCount: (count: number) => Promise<void>;
}

function createCountSignal() {
	let count = 0;
	const waiters: Array<{ count: number; resolve: () => void }> = [];
	return {
		mark: () => {
			count += 1;
			for (const waiter of waiters.splice(0)) {
				if (count >= waiter.count) waiter.resolve();
				else waiters.push(waiter);
			}
		},
		waitFor: (expectedCount: number) => {
			if (count >= expectedCount) return Promise.resolve();
			return new Promise<void>(resolve => {
				waiters.push({ count: expectedCount, resolve });
			});
		}
	};
}

async function withPayloadApp<T>(
	options: PayloadAppOptions,
	run: (baseUrl: string, controls: PayloadAppControls) => Promise<T>
): Promise<T> {
	const app = express();
	const authenticated = vi.fn();
	const limited = vi.fn();
	const saved = vi.fn();
	const heavyThresholdBytes = options.heavyThresholdBytes ?? 1_024;
	const aborted = createCountSignal();
	const closed = createCountSignal();
	const held = createCountSignal();
	const parserEntry = createCountSignal();
	const preGuard = createCountSignal();
	const preGuardContinued = createCountSignal();
	const settled = createCountSignal();
	let releaseHeld = () => undefined;
	let releasePreGuard = () => undefined;
	const heldRelease = new Promise<void>(resolve => {
		releaseHeld = resolve;
	});
	const preGuardRelease = new Promise<void>(resolve => {
		releasePreGuard = resolve;
	});
	app.set("trust proxy", 1);
	app.use("/students/projects", async (req, res, next) => {
		const studentID = req.get("X-Test-Student-ID") ?? "student-one";
		req.currentStudent = {
			_id: { toString: () => studentID }
		} as typeof req.currentStudent;
		authenticated();
		if (req.get("X-Hold-Pre-Guard") === "1") {
			req.once("aborted", aborted.mark);
			res.once("close", closed.mark);
			preGuard.mark();
			await preGuardRelease;
			next();
			preGuardContinued.mark();
			return;
		}
		next();
	});
	app.use(
		"/students/projects",
		(_req, _res, next) => {
			limited();
			next();
		},
		createHeavyProjectPayloadLimiter({
			heavyThresholdBytes,
			limit: options.heavyRateLimit ?? 100,
			windowMs: 60_000
		}),
		createProjectPayloadConcurrencyGuard({
			globalLimit: options.globalLimit ?? 1,
			heavyThresholdBytes,
			normalGlobalLimit: options.normalGlobalLimit,
			normalPerIdentityLimit: options.normalPerIdentityLimit,
			perIdentityLimit: options.perIdentityLimit ?? 1
		}),
		(req, res, next) => {
			req.once("aborted", aborted.mark);
			res.once("close", closed.mark);
			parserEntry.mark();
			next();
		},
		createProjectJsonParser(options.parserLimit ?? "8kb"),
		claimProjectPayloadReservation,
		async (req, res, next) => {
			if (req.get("X-Reject-After-Parse") !== "1") {
				next();
				return;
			}
			await Promise.resolve();
			res.sendStatus(403);
		}
	);
	// A project body parsed above must not fall through to this smaller global
	// parser or be parsed a second time.
	app.use(express.json({ limit: "128b" }));
	app.post(
		"/students/projects",
		withProjectPayloadReservation(async (req, res) => {
			saved();
			try {
				if (req.get("X-Hold-Response") === "1") {
					held.mark();
					await heldRelease;
				}
				if (!res.destroyed) {
					res.json({
						contentLength: req.body.files[0].content.length
					});
				}
			} finally {
				settled.mark();
			}
		})
	);
	app.use(
		(
			error: { status?: number },
			_req: express.Request,
			res: express.Response,
			_next: express.NextFunction
		) => {
			res.sendStatus(error.status ?? 500);
		}
	);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`, {
			authenticated,
			limited,
				releaseHeld,
				releasePreGuard,
			saved,
			waitForAbortedCount: aborted.waitFor,
			waitForClosedCount: closed.waitFor,
			waitForHeldCount: held.waitFor,
				waitForParserEntryCount: parserEntry.waitFor,
				waitForPreGuardContinuedCount: preGuardContinued.waitFor,
				waitForPreGuardCount: preGuard.waitFor,
			waitForSettledCount: settled.waitFor
		});
	} finally {
		releaseHeld();
		releasePreGuard();
		await new Promise<void>((resolve, reject) => {
			server.close(error => (error ? reject(error) : resolve()));
		});
	}
}

function projectBody(content: string) {
	return JSON.stringify({
		files: [{ content, name: "main.py" }],
		importID: "payload-boundary"
	});
}

function postProject(
	baseUrl: string,
	content: string,
	headers: Record<string, string> = {}
) {
	return fetch(`${baseUrl}/students/projects`, {
		body: projectBody(content),
		headers: {
			"content-type": "application/json",
			...headers
		},
		method: "POST"
	});
}

function postCompressedProject(baseUrl: string, content: string) {
	return fetch(`${baseUrl}/students/projects`, {
		body: gzipSync(projectBody(content)),
		headers: {
			"content-encoding": "gzip",
			"content-type": "application/json"
		},
		method: "POST"
	});
}

function postChunkedProject(
	baseUrl: string,
	content: string,
	headers: Record<string, string> = {}
): Promise<{ body: string; status: number }> {
	const url = new URL(`${baseUrl}/students/projects`);
	const body = projectBody(content);
	return new Promise((resolve, reject) => {
		const req = request(
			{
				headers: {
					"content-type": "application/json",
					...headers
				},
				host: url.hostname,
				method: "POST",
				path: url.pathname,
				port: url.port
			},
			res => {
				const chunks: Buffer[] = [];
				res.on("data", chunk => chunks.push(Buffer.from(chunk)));
				res.on("end", () => {
					resolve({
						body: Buffer.concat(chunks).toString("utf8"),
						status: res.statusCode ?? 0
					});
				});
			}
		);
		req.on("error", reject);
		req.write(body.slice(0, Math.ceil(body.length / 2)));
		req.end(body.slice(Math.ceil(body.length / 2)));
	});
}

function startAbortableProject(
	baseUrl: string,
	content: string,
	headers: Record<string, string>,
	completeBody: boolean,
	pathSuffix = ""
) {
	const url = new URL(`${baseUrl}/students/projects${pathSuffix}`);
	const body = projectBody(content);
	let clientRequest: ReturnType<typeof request>;
	const completed = new Promise<void>(resolve => {
		let done = false;
		const settle = () => {
			if (done) return;
			done = true;
			resolve();
		};
		clientRequest = request(
			{
				headers: {
					"content-length": Buffer.byteLength(body).toString(),
					"content-type": "application/json",
					...headers
				},
				host: url.hostname,
				method: "POST",
				path: url.pathname,
				port: url.port
			},
			res => {
				res.resume();
				res.once("end", settle);
			}
		);
		clientRequest.once("close", settle);
		clientRequest.once("error", settle);
		if (completeBody) clientRequest.end(body);
		else clientRequest.write(body.slice(0, Math.ceil(body.length / 2)));
	});

	return {
		abort: () => clientRequest.destroy(),
		completed
	};
}

function waitForImmediate(): Promise<void> {
	return new Promise(resolve => setImmediate(resolve));
}

describe("project payload middleware", () => {
	it("preserves normal autosaves above the global parser limit", async () => {
		await withPayloadApp(
			{ heavyThresholdBytes: 2_048 },
			async (baseUrl, controls) => {
				const responses = await Promise.all([
					postProject(baseUrl, "x".repeat(1_024)),
					postProject(baseUrl, "y".repeat(1_024))
				]);

				expect(responses.map(response => response.status)).toEqual([
					200, 200
				]);
				expect(controls.authenticated).toHaveBeenCalledTimes(2);
				expect(controls.limited).toHaveBeenCalledTimes(2);
				expect(controls.saved).toHaveBeenCalledTimes(2);
			}
		);
	});

	it("permits one legitimate heavy project through the large parser", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const response = await postProject(baseUrl, "x".repeat(3_000));

			expect(response.status).toBe(200);
			await expect(response.json()).resolves.toEqual({
				contentLength: 3_000
			});
			expect(controls.saved).toHaveBeenCalledTimes(1);
		});
	});

	it("bounds concurrent sub-threshold autosaves per identity", async () => {
		await withPayloadApp(
			{
				heavyThresholdBytes: 2_048,
				normalPerIdentityLimit: 2
			},
			async (baseUrl, controls) => {
				const first = postProject(baseUrl, "x".repeat(1_024), {
					"X-Hold-Response": "1"
				});
				const second = postProject(baseUrl, "y".repeat(1_024), {
					"X-Hold-Response": "1"
				});
				await controls.waitForHeldCount(2);
				const third = await postProject(baseUrl, "z".repeat(1_024));

				expect(third.status).toBe(429);
				controls.releaseHeld();
				expect(
					(await Promise.all([first, second])).map(
						response => response.status
					)
				).toEqual([200, 200]);
			}
		);
	});

	it("rate-limits repeated heavy saves without consuming the normal tier", async () => {
		await withPayloadApp(
			{ heavyRateLimit: 2 },
			async (baseUrl, controls) => {
				const first = await postProject(baseUrl, "x".repeat(3_000));
				const second = await postProject(baseUrl, "y".repeat(3_000));
				const third = await postProject(baseUrl, "z".repeat(3_000));
				const normal = await postProject(baseUrl, "n".repeat(100));

				expect([
					first.status,
					second.status,
					third.status,
					normal.status
				]).toEqual([200, 200, 429, 200]);
				expect(controls.saved).toHaveBeenCalledTimes(3);
			}
		);
	});

	it("holds one heavy slot per authenticated identity despite spoofed IPs", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const first = postProject(baseUrl, "x".repeat(3_000), {
				"X-Forwarded-For": "198.51.100.10",
				"X-Hold-Response": "1"
			});
			await controls.waitForHeldCount(1);
			const second = await postProject(baseUrl, "y".repeat(3_000), {
				"X-Forwarded-For": "203.0.113.20"
			});

			expect(second.status).toBe(429);
			expect(second.headers.get("retry-after")).toBe("1");
			controls.releaseHeld();
			expect((await first).status).toBe(200);
			expect(controls.saved).toHaveBeenCalledTimes(1);
		});
	});

	it("enforces the global heavy limit across different identities", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const first = postProject(baseUrl, "x".repeat(3_000), {
				"X-Hold-Response": "1",
				"X-Test-Student-ID": "student-one"
			});
			await controls.waitForHeldCount(1);
			const second = await postProject(baseUrl, "y".repeat(3_000), {
				"X-Test-Student-ID": "student-two"
			});

			expect(second.status).toBe(429);
			controls.releaseHeld();
			expect((await first).status).toBe(200);
		});
	});

	it("keeps an aborted terminal save reserved until persistence settles", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const first = startAbortableProject(
				baseUrl,
				"x".repeat(3_000),
				{
					"X-Hold-Response": "1",
					"X-Test-Student-ID": "student-one"
				},
				true
			);
			await controls.waitForHeldCount(1);
			first.abort();
			await Promise.all([
				first.completed,
				controls.waitForClosedCount(1)
			]);

			const overlapping = await postProject(baseUrl, "y".repeat(3_000), {
				"X-Test-Student-ID": "student-two"
			});
			expect(overlapping.status).toBe(429);
			expect(controls.saved).toHaveBeenCalledTimes(1);

			controls.releaseHeld();
			await controls.waitForSettledCount(1);
			await waitForImmediate();
			const afterPersistence = await postProject(
				baseUrl,
				"z".repeat(3_000),
				{ "X-Test-Student-ID": "student-two" }
			);
			expect(afterPersistence.status).toBe(200);
			expect(controls.saved).toHaveBeenCalledTimes(2);
		});
	});

	it("releases an aborted in-flight parser reservation without saving", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const partial = startAbortableProject(
				baseUrl,
				"x".repeat(3_000),
				{ "X-Test-Student-ID": "student-one" },
				false
			);
			await controls.waitForParserEntryCount(1);
			partial.abort();
			await Promise.all([
				partial.completed,
				controls.waitForAbortedCount(1)
			]);

			const next = await postProject(baseUrl, "y".repeat(3_000), {
				"X-Test-Student-ID": "student-two"
			});
			expect(next.status).toBe(200);
			expect(controls.saved).toHaveBeenCalledTimes(1);
		});
	});

	it("refuses admission after an async pre-parser auth abort", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const partial = startAbortableProject(
				baseUrl,
				"x".repeat(3_000),
				{ "X-Hold-Pre-Guard": "1" },
				false,
				"/missing"
			);
			await controls.waitForPreGuardCount(1);
			partial.abort();
			await Promise.all([
				partial.completed,
				controls.waitForAbortedCount(1),
				controls.waitForClosedCount(1)
			]);
			controls.releasePreGuard();
			await controls.waitForPreGuardContinuedCount(1);

			const next = await postProject(baseUrl, "y".repeat(3_000));
			expect(next.status).toBe(200);
			expect(controls.saved).toHaveBeenCalledTimes(1);
		});
	});

	it("treats missing Content-Length and chunked bodies as heavy", async () => {
		await withPayloadApp(
			{ heavyThresholdBytes: 2_048 },
			async (baseUrl, controls) => {
				const first = postChunkedProject(baseUrl, "x".repeat(100), {
					"X-Forwarded-For": "198.51.100.10",
					"X-Hold-Response": "1"
				});
				await controls.waitForHeldCount(1);
				const second = await postChunkedProject(
					baseUrl,
					"y".repeat(100),
					{
						"X-Forwarded-For": "203.0.113.20"
					}
				);

				expect(second.status).toBe(429);
				controls.releaseHeld();
				expect((await first).status).toBe(200);
			}
		);
	});

	it("rejects compressed project bodies before inflation", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const response = await postCompressedProject(
				baseUrl,
				"x".repeat(3_000)
			);

			expect(response.status).toBe(415);
			const next = await postProject(baseUrl, "y".repeat(3_000));
			expect(next.status).toBe(200);
			expect(controls.saved).toHaveBeenCalledTimes(1);
		});
	});

	it("releases a claimed reservation when no terminal route matches", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const missing = await fetch(
				`${baseUrl}/students/projects/missing`,
				{
					body: projectBody("x".repeat(3_000)),
					headers: { "content-type": "application/json" },
					method: "POST"
				}
			);
			expect(missing.status).toBe(404);

			const next = await postProject(baseUrl, "y".repeat(3_000));
			expect(next.status).toBe(200);
			expect(controls.saved).toHaveBeenCalledTimes(1);
		});
	});

	it("releases a claimed reservation after async route rejection", async () => {
		await withPayloadApp({}, async (baseUrl, controls) => {
			const rejected = await postProject(baseUrl, "x".repeat(3_000), {
				"X-Reject-After-Parse": "1"
			});
			expect(rejected.status).toBe(403);

			const next = await postProject(baseUrl, "y".repeat(3_000));
			expect(next.status).toBe(200);
			expect(controls.saved).toHaveBeenCalledTimes(1);
		});
	});

	it("rejects a body beyond the dedicated parser ceiling", async () => {
		await withPayloadApp(
			{ parserLimit: "2kb" },
			async (baseUrl, controls) => {
				const response = await postProject(baseUrl, "x".repeat(3_000));

				expect(response.status).toBe(413);
				expect(controls.authenticated).toHaveBeenCalledTimes(1);
				expect(controls.limited).toHaveBeenCalledTimes(1);
				const next = await postProject(baseUrl, "y".repeat(1_500));
				expect(next.status).toBe(200);
				expect(controls.saved).toHaveBeenCalledTimes(1);
			}
		);
	});
});
