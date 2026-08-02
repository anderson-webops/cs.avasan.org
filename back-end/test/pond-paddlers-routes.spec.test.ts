import type { Server } from "node:http";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import {
	POND_PADDLERS_DEVELOPMENT_SEAT_COOKIE,
	POND_PADDLERS_PRODUCTION_SEAT_COOKIE,
	createPondPaddlersRoutes
} from "../src/routes/pondPaddlersRoutes.js";
import {
	PondPaddlersRoomStore,
	type PondPaddlersOperation,
	type PondPaddlersQuestion
} from "../src/services/pondPaddlersRooms.js";

interface TestRuntime {
	baseUrl: string;
	close: () => Promise<void>;
	cookieName: string;
	store: PondPaddlersRoomStore;
}

interface JoinedRace {
	alias: string;
	calmMode: boolean;
	expiresAt: string;
	question: PondPaddlersQuestion;
	resumed: boolean;
	state: {
		finishAt: number;
		players: Array<{ alias: string; progress: number }>;
		status: string;
	};
}

const runtimes: TestRuntime[] = [];

async function createRuntime(secureCookies = true): Promise<TestRuntime> {
	const store = new PondPaddlersRoomStore();
	const app = express();
	app.set("trust proxy", false);
	app.use((req, _res, next) => {
		if (req.get("X-Test-Admin") === "1") {
			req.currentAdmin = {} as NonNullable<typeof req.currentAdmin>;
		}
		next();
	});
	app.use("/pond-paddlers", createPondPaddlersRoutes(store, {
		heartbeatMs: 10,
		secureCookies
	}));

	const server = await new Promise<Server>(resolveServer => {
		const instance = app.listen(0, "127.0.0.1", () => resolveServer(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to an IPv4 port");
	}

	const runtime: TestRuntime = {
		baseUrl: `http://127.0.0.1:${address.port}/pond-paddlers`,
		close: async () => {
			store.dispose();
			await new Promise<void>((resolveClose, reject) => {
				server.close(error => error ? reject(error) : resolveClose());
			});
		},
		cookieName: secureCookies
			? POND_PADDLERS_PRODUCTION_SEAT_COOKIE
			: POND_PADDLERS_DEVELOPMENT_SEAT_COOKIE,
		store
	};
	runtimes.push(runtime);
	return runtime;
}

afterEach(async () => {
	await Promise.all(runtimes.splice(0).map(runtime => runtime.close()));
});

const adminHeaders = {
	"Content-Type": "application/json",
	"X-Classroom-Request": "1",
	"X-Test-Admin": "1"
};
const classroomHeaders = {
	"Content-Type": "application/json",
	"X-Classroom-Request": "1"
};

async function createRoom(
	runtime: TestRuntime,
	overrides: Record<string, unknown> = {}
): Promise<Record<string, any>> {
	const response = await fetch(`${runtime.baseUrl}/rooms`, {
		body: JSON.stringify({
			calmMode: true,
			durationMinutes: 30,
			finishAt: 5,
			maxOperand: 20,
			operations: ["add", "subtract", "multiply", "divide"],
			...overrides
		}),
		headers: adminHeaders,
		method: "POST"
	});
	expect(response.status).toBe(201);
	return (await response.json() as { room: Record<string, any> }).room;
}

function seatCookie(response: Response, expectedName: string): { header: string; token: string } {
	const setCookie = response.headers.get("set-cookie");
	expect(setCookie).toBeTruthy();
	const cookie = (setCookie as string).split(";", 1)[0];
	const [name, token] = cookie.split("=", 2);
	expect(name).toBe(expectedName);
	return { header: cookie, token };
}

async function joinRoom(
	runtime: TestRuntime,
	roomCode: string,
	cookie?: string
): Promise<{ body: JoinedRace; cookie: string; response: Response; token: string }> {
	const response = await fetch(`${runtime.baseUrl}/rooms/${roomCode}/join`, {
		body: "{}",
		headers: {
			...classroomHeaders,
			...(cookie ? { Cookie: cookie } : {})
		},
		method: "POST"
	});
	expect([200, 201]).toContain(response.status);
	const parsedCookie = seatCookie(response, runtime.cookieName);
	return {
		body: await response.json() as JoinedRace,
		cookie: parsedCookie.header,
		response,
		token: parsedCookie.token
	};
}

function answerForPrompt(prompt: string): number {
	const match = /^(\d+) ([+×÷−]) (\d+) = \?$/.exec(prompt);
	if (!match) throw new Error(`Unexpected generated prompt: ${prompt}`);
	const left = Number(match[1]);
	const right = Number(match[3]);
	switch (match[2]) {
		case "+": return left + right;
		case "−": return left - right;
		case "×": return left * right;
		case "÷": return left / right;
		default: throw new Error("Unexpected generated operation");
	}
}

function postAnswer(
	runtime: TestRuntime,
	roomCode: string,
	cookie: string | undefined,
	questionID: string,
	answer: number
): Promise<Response> {
	return fetch(`${runtime.baseUrl}/rooms/${roomCode}/answer`, {
		body: JSON.stringify({ answer, questionID }),
		headers: {
			...classroomHeaders,
			...(cookie ? { Cookie: cookie } : {})
		},
		method: "POST"
	});
}

describe("Pond Paddlers privacy-minimal race API", () => {
	it("keeps room management behind Julio's existing Admin session and same-origin guard", async () => {
		const runtime = await createRuntime();
		const anonymousList = await fetch(`${runtime.baseUrl}/rooms`);
		expect(anonymousList.status).toBe(403);

		const missingOriginProof = await fetch(`${runtime.baseUrl}/rooms`, {
			body: "{}",
			headers: {
				"Content-Type": "application/json",
				"X-Test-Admin": "1"
			},
			method: "POST"
		});
		expect(missingOriginProof.status).toBe(403);

		const room = await createRoom(runtime, {
			calmMode: false,
			durationMinutes: 120,
			finishAt: 30,
			maxOperand: 100,
			operations: ["divide", "subtract"]
		});
		expect(room).toMatchObject({
			calmMode: false,
			durationMinutes: 120,
			finishAt: 30,
			maxOperand: 100,
			operations: ["divide", "subtract"],
			playerCount: 0,
			status: "waiting"
		});
		expect(room.roomCode).toMatch(/^[A-HJ-NP-Z2-9]{8}$/);
		expect(Date.parse(room.expiresAt) - Date.parse(room.createdAt)).toBe(2 * 60 * 60 * 1000);

		const listed = await fetch(`${runtime.baseUrl}/rooms`, {
			headers: { "X-Test-Admin": "1" }
		});
		expect(listed.status).toBe(200);
		expect(await listed.json()).toEqual({ rooms: [room] });

		const crossSiteClose = await fetch(`${runtime.baseUrl}/rooms/${room.roomCode}`, {
			headers: {
				"Sec-Fetch-Site": "cross-site",
				"X-Classroom-Request": "1",
				"X-Test-Admin": "1"
			},
			method: "DELETE"
		});
		expect(crossSiteClose.status).toBe(403);

		const closed = await fetch(`${runtime.baseUrl}/rooms/${room.roomCode}`, {
			headers: {
				"X-Classroom-Request": "1",
				"X-Test-Admin": "1"
			},
			method: "DELETE"
		});
		expect(closed.status).toBe(204);
	});

	it("strictly bounds teacher settings and every race request body", async () => {
		const runtime = await createRuntime();
		const invalidBodies = [
			{ operations: [] },
			{ operations: ["add", "add"] },
			{ operations: ["algebra"] },
			{ maxOperand: 9 },
			{ maxOperand: 101 },
			{ finishAt: 4 },
			{ finishAt: 31 },
			{ durationMinutes: 121 },
			{ calmMode: "yes" },
			{ displayName: "Class 4" }
		];
		for (const body of invalidBodies) {
			const response = await fetch(`${runtime.baseUrl}/rooms`, {
				body: JSON.stringify(body),
				headers: adminHeaders,
				method: "POST"
			});
			expect(response.status).toBe(400);
		}

		const oversized = await fetch(`${runtime.baseUrl}/rooms`, {
			body: JSON.stringify({ extra: "x".repeat(5_000) }),
			headers: adminHeaders,
			method: "POST"
		});
		expect(oversized.status).toBe(413);
	});

	it("issues only random preset aliases and a separate hardened seat cookie", async () => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime);
		const namedJoin = await fetch(`${runtime.baseUrl}/rooms/${room.roomCode}/join`, {
			body: JSON.stringify({ name: "A real student" }),
			headers: classroomHeaders,
			method: "POST"
		});
		expect(namedJoin.status).toBe(400);

		const response = await fetch(`${runtime.baseUrl}/rooms/${room.roomCode}/join`, {
			body: "{}",
			headers: {
				...classroomHeaders,
				Cookie: "session=an-unrelated-account-session"
			},
			method: "POST"
		});
		expect(response.status).toBe(201);
		const rawBody = await response.text();
		const body = JSON.parse(rawBody) as JoinedRace;
		const { header, token } = seatCookie(response, runtime.cookieName);
		expect(token).toMatch(/^[\w-]{43}$/);
		expect(rawBody).not.toContain(token);
		expect(response.headers.get("set-cookie")).toContain("HttpOnly");
		expect(response.headers.get("set-cookie")).toContain("Secure");
		expect(response.headers.get("set-cookie")).toContain("SameSite=Strict");
		expect(response.headers.get("set-cookie")).toContain("Path=/");
		expect(body.resumed).toBe(false);
		expect(body.alias).toMatch(/^[A-Za-z]+ (Duck|Mallard|Pintail|Teal)$/);
		expect(Object.keys(body.question).sort()).toEqual(["prompt", "questionID"]);
		expect(Object.keys(body.state).sort()).toEqual(["finishAt", "players", "status"]);
		expect(Object.keys(body.state.players[0]).sort()).toEqual(["alias", "progress"]);
		expect(rawBody).not.toMatch(/student|account|email|answer|token|cookie|ip/i);

		const resumed = await joinRoom(runtime, room.roomCode, header);
		expect(resumed.response.status).toBe(200);
		expect(resumed.body.resumed).toBe(true);
		expect(resumed.body.alias).toBe(body.alias);
		expect(resumed.body.state.players).toHaveLength(1);

		const wrongCookieName = await joinRoom(
			runtime,
			room.roomCode,
			`${POND_PADDLERS_DEVELOPMENT_SEAT_COOKIE}=${token}`
		);
		expect(wrongCookieName.response.status).toBe(201);
		expect(wrongCookieName.body.alias).not.toBe(body.alias);
	});

	it("uses a non-Secure local-only cookie over HTTP and accepts only the active cookie name", async () => {
		const runtime = await createRuntime(false);
		const room = await createRoom(runtime);
		const joined = await joinRoom(runtime, room.roomCode);
		const setCookie = joined.response.headers.get("set-cookie") as string;
		expect(setCookie).toContain(`${POND_PADDLERS_DEVELOPMENT_SEAT_COOKIE}=`);
		expect(setCookie).not.toContain("Secure");
		expect(setCookie).toContain("HttpOnly");
		expect(setCookie).toContain("SameSite=Strict");

		const wrongName = await joinRoom(
			runtime,
			room.roomCode,
			`${POND_PADDLERS_PRODUCTION_SEAT_COOKIE}=${joined.token}`
		);
		expect(wrongName.response.status).toBe(201);
		expect(wrongName.body.alias).not.toBe(joined.body.alias);

		const resumed = await joinRoom(runtime, room.roomCode, joined.cookie);
		expect(resumed.response.status).toBe(200);
		expect(resumed.body.alias).toBe(joined.body.alias);
	});

	it("caps a room at 32 unlinkable seats with unique safe aliases", async () => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime);
		const aliases: string[] = [];
		for (let index = 0; index < 32; index += 1) {
			const joined = await joinRoom(runtime, room.roomCode);
			aliases.push(joined.body.alias);
		}
		expect(new Set(aliases).size).toBe(32);

		const overflow = await fetch(`${runtime.baseUrl}/rooms/${room.roomCode}/join`, {
			body: "{}",
			headers: classroomHeaders,
			method: "POST"
		});
		expect(overflow.status).toBe(409);
		expect(await overflow.json()).toEqual({ message: "This race has no open seats." });
	});

	it.each([
		["add", "+"],
		["subtract", "−"],
		["multiply", "×"],
		["divide", "÷"]
	] as Array<[PondPaddlersOperation, string]>)
	("generates safe server-authoritative %s questions", async (operation, symbol) => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime, { maxOperand: 10, operations: [operation] });
		const joined = await joinRoom(runtime, room.roomCode);
		expect(joined.body.question.prompt).toContain(` ${symbol} `);
		const operands = joined.body.question.prompt.match(/\d+/g)?.map(Number) ?? [];
		expect(operands).toHaveLength(2);
		expect(Math.max(...operands)).toBeLessThanOrEqual(10);
		const correctAnswer = answerForPrompt(joined.body.question.prompt);
		expect(Number.isInteger(correctAnswer)).toBe(true);
		expect(correctAnswer).toBeGreaterThanOrEqual(0);
		if (operation === "divide") expect(operands[0] % operands[1]).toBe(0);

		const result = await postAnswer(
			runtime,
			room.roomCode,
			joined.cookie,
			joined.body.question.questionID,
			correctAnswer
		);
		expect(result.status).toBe(200);
		expect(await result.json()).toMatchObject({
			correct: true,
			finished: false,
			progress: 1
		});
	});

	it("does not treat the shared room code as a seat credential and rejects stale questions", async () => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime);
		const joined = await joinRoom(runtime, room.roomCode);
		const answer = answerForPrompt(joined.body.question.prompt);

		const noSeat = await postAnswer(
			runtime,
			room.roomCode,
			undefined,
			joined.body.question.questionID,
			answer
		);
		expect(noSeat.status).toBe(403);

		const forgedSeat = await postAnswer(
			runtime,
			room.roomCode,
			`${runtime.cookieName}=${"A".repeat(43)}`,
			joined.body.question.questionID,
			answer
		);
		expect(forgedSeat.status).toBe(403);

		const stale = await postAnswer(
			runtime,
			room.roomCode,
			joined.cookie,
			"A".repeat(16),
			answer
		);
		expect(stale.status).toBe(409);
	});

	it("advances the race only on a correct current answer and stops at finishAt", async () => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime, { finishAt: 5, operations: ["add"] });
		const joined = await joinRoom(runtime, room.roomCode);
		let question = joined.body.question;

		const wrong = await postAnswer(
			runtime,
			room.roomCode,
			joined.cookie,
			question.questionID,
			answerForPrompt(question.prompt) + 1
		);
		expect(await wrong.json()).toEqual({
			correct: false,
			finished: false,
			nextQuestion: question,
			progress: 0
		});

		for (let progress = 1; progress <= 5; progress += 1) {
			const response = await postAnswer(
				runtime,
				room.roomCode,
				joined.cookie,
				question.questionID,
				answerForPrompt(question.prompt)
			);
			const body = await response.json() as {
				correct: boolean;
				finished: boolean;
				nextQuestion: PondPaddlersQuestion | null;
				progress: number;
			};
			expect(body).toMatchObject({ correct: true, progress });
			if (progress < 5) {
				expect(body.finished).toBe(false);
				expect(body.nextQuestion).not.toBeNull();
				question = body.nextQuestion as PondPaddlersQuestion;
			}
			else {
				expect(body).toEqual({
					correct: true,
					finished: true,
					nextQuestion: null,
					progress: 5
				});
			}
		}
	});

	it("streams only safe race state with proxy-safe headers and heartbeats", async () => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime);
		const joined = await joinRoom(runtime, room.roomCode);
		const controller = new AbortController();
		const response = await fetch(`${runtime.baseUrl}/rooms/${room.roomCode}/events`, {
			headers: { Cookie: joined.cookie },
			signal: controller.signal
		});
		expect(response.status).toBe(200);
		expect(response.headers.get("content-type")).toContain("text/event-stream");
		expect(response.headers.get("cache-control")).toBe("no-store, no-transform");
		expect(response.headers.get("x-accel-buffering")).toBe("no");

		const reader = response.body?.getReader();
		expect(reader).toBeTruthy();
		let streamText = "";
		for (let reads = 0; reads < 5 && !streamText.includes("data: "); reads += 1) {
			const chunk = await reader?.read();
			if (chunk?.value) streamText += new TextDecoder().decode(chunk.value);
		}

		const answer = await postAnswer(
			runtime,
			room.roomCode,
			joined.cookie,
			joined.body.question.questionID,
			answerForPrompt(joined.body.question.prompt)
		);
		expect(answer.status).toBe(200);
		for (
			let reads = 0;
			reads < 5 && streamText.split("\n").filter(line => line.startsWith("data: ")).length < 2;
			reads += 1
		) {
			const chunk = await reader?.read();
			if (chunk?.value) streamText += new TextDecoder().decode(chunk.value);
		}
		for (let reads = 0; reads < 5 && !streamText.includes(": heartbeat"); reads += 1) {
			const chunk = await reader?.read();
			if (chunk?.value) streamText += new TextDecoder().decode(chunk.value);
		}
		const dataLines = streamText.split("\n").filter(line => line.startsWith("data: "));
		expect(dataLines).toHaveLength(2);
		const state = JSON.parse(dataLines.at(-1)?.slice(6) ?? "null");
		expect(Object.keys(state).sort()).toEqual(["finishAt", "players", "status"]);
		expect(Object.keys(state.players[0]).sort()).toEqual(["alias", "progress"]);
		expect(state.players[0].progress).toBe(1);
		expect(JSON.stringify(state)).not.toMatch(/question|answer|seat|token|account|student|cookie|ip/i);
		expect(streamText).toContain(": heartbeat");
		controller.abort();
		await reader?.cancel().catch(() => undefined);
	});

	it("rate-limits answers by the private seat without persisting an identifier", async () => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime, { operations: ["add"] });
		const joined = await joinRoom(runtime, room.roomCode);
		const wrongAnswer = answerForPrompt(joined.body.question.prompt) + 1;
		for (let attempt = 0; attempt < 120; attempt += 1) {
			const response = await postAnswer(
				runtime,
				room.roomCode,
				joined.cookie,
				joined.body.question.questionID,
				wrongAnswer
			);
			expect(response.status).toBe(200);
		}
		const limited = await postAnswer(
			runtime,
			room.roomCode,
			joined.cookie,
			joined.body.question.questionID,
			wrongAnswer
		);
		expect(limited.status).toBe(429);
	});

	it("rate-limits repeated anonymous join traffic in memory", async () => {
		const runtime = await createRuntime();
		for (let attempt = 0; attempt < 120; attempt += 1) {
			const response = await fetch(`${runtime.baseUrl}/rooms/ABCDEFGH/join`, {
				body: "{}",
				headers: classroomHeaders,
				method: "POST"
			});
			expect(response.status).toBe(404);
		}
		const limited = await fetch(`${runtime.baseUrl}/rooms/ABCDEFGH/join`, {
			body: "{}",
			headers: classroomHeaders,
			method: "POST"
		});
		expect(limited.status).toBe(429);
	});

	it("gives closed and unknown room codes the same generic public response", async () => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime);
		const unknownRoomCode = room.roomCode === "ABCDEFGH" ? "HGFEDCBA" : "ABCDEFGH";
		const closed = await fetch(`${runtime.baseUrl}/rooms/${room.roomCode}`, {
			headers: {
				"X-Classroom-Request": "1",
				"X-Test-Admin": "1"
			},
			method: "DELETE"
		});
		expect(closed.status).toBe(204);

		const [closedJoin, unknownJoin] = await Promise.all([
			fetch(`${runtime.baseUrl}/rooms/${room.roomCode}/join`, {
				body: "{}",
				headers: classroomHeaders,
				method: "POST"
			}),
			fetch(`${runtime.baseUrl}/rooms/${unknownRoomCode}/join`, {
				body: "{}",
				headers: classroomHeaders,
				method: "POST"
			})
		]);
		expect(closedJoin.status).toBe(404);
		expect(unknownJoin.status).toBe(404);
		expect(await closedJoin.json()).toEqual(await unknownJoin.json());
	});

	it("contains no database, analytics, or logging integration", () => {
		const serviceSource = readFileSync(
			resolve(__dirname, "../src/services/pondPaddlersRooms.ts"),
			"utf8"
		);
		const routeSource = readFileSync(
			resolve(__dirname, "../src/routes/pondPaddlersRoutes.ts"),
			"utf8"
		);
		expect(serviceSource).not.toMatch(/mongoose|models\//i);
		expect(routeSource).not.toMatch(/mongoose|models\//i);
		expect(`${serviceSource}\n${routeSource}`).not.toMatch(/console\.(?:debug|info|log|warn|error)/);
	});

	it("drops a failed live-state subscriber without interrupting the race", () => {
		const store = new PondPaddlersRoomStore();
		const room = store.createRoom({
			calmMode: true,
			durationMinutes: 5,
			finishAt: 5,
			maxOperand: 10,
			operations: ["add"]
		});
		const joined = store.joinRoom(room.roomCode);
		store.subscribe(room.roomCode, joined.seatToken, () => {
			throw new Error("simulated disconnected stream");
		});
		expect(() => store.answerQuestion(
			room.roomCode,
			joined.seatToken,
			joined.question.questionID,
			answerForPrompt(joined.question.prompt)
		)).not.toThrow();
		store.dispose();
	});
});
