import type { Server } from "node:http";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import {
	POND_PADDLERS_DEVELOPMENT_SEAT_COOKIE_PREFIX,
	POND_PADDLERS_PRODUCTION_SEAT_COOKIE_PREFIX,
	createPondPaddlersRoutes,
	pondPaddlersSeatCookieName
} from "../src/routes/pondPaddlersRoutes.js";
import {
	PondPaddlersRoomStore,
	type PondPaddlersOperation,
	type PondPaddlersQuestion
} from "../src/services/pondPaddlersRooms.js";

interface TestRuntime {
	baseUrl: string;
	close: () => Promise<void>;
	secureCookies: boolean;
	store: PondPaddlersRoomStore;
}

interface RuntimeOptions {
	resumeAddressLimit?: number;
	resumeSeatLimit?: number;
	secureCookies?: boolean;
}

interface JoinedRace {
	alias: string;
	calmMode: boolean;
	expiresAt: string;
	question: PondPaddlersQuestion | null;
	raceFormat: "individual" | "team-device";
	resumed: boolean;
	state: {
		finishAt: number;
		players: Array<{ alias: string; progress: number }>;
		status: string;
	};
}

const runtimes: TestRuntime[] = [];

async function createRuntime(options: RuntimeOptions | boolean = {}): Promise<TestRuntime> {
	const normalizedOptions: RuntimeOptions = typeof options === "boolean"
		? { secureCookies: options }
		: options;
	const secureCookies = normalizedOptions.secureCookies ?? true;
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
		...(typeof normalizedOptions.resumeAddressLimit === "number"
			? { resumeAddressLimit: normalizedOptions.resumeAddressLimit }
			: {}),
		...(typeof normalizedOptions.resumeSeatLimit === "number"
			? { resumeSeatLimit: normalizedOptions.resumeSeatLimit }
			: {}),
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
		secureCookies,
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
const publicSeatResponseKeys = [
	"alias",
	"calmMode",
	"expiresAt",
	"question",
	"raceFormat",
	"resumed",
	"state"
];

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
			raceFormat: "individual",
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
	const expectedCookieName = pondPaddlersSeatCookieName(
		roomCode,
		runtime.secureCookies
	);
	expect(expectedCookieName).toBeTruthy();
	const parsedCookie = seatCookie(response, expectedCookieName as string);
	const body = await response.json() as JoinedRace;
	expect(Object.keys(body).sort()).toEqual(publicSeatResponseKeys);
	expect(Object.hasOwn(body, "seatToken")).toBe(false);
	return {
		body,
		cookie: parsedCookie.header,
		response,
		token: parsedCookie.token
	};
}

async function resumeRoom(
	runtime: TestRuntime,
	roomCode: string,
	cookie?: string
): Promise<{ body: JoinedRace; response: Response }> {
	const response = await fetch(`${runtime.baseUrl}/rooms/${roomCode}/resume`, {
		headers: {
			"X-Classroom-Request": "1",
			...(cookie ? { Cookie: cookie } : {})
		}
	});
	expect(response.status).toBe(200);
	const body = await response.json() as JoinedRace;
	expect(Object.keys(body).sort()).toEqual(publicSeatResponseKeys);
	expect(Object.hasOwn(body, "seatToken")).toBe(false);
	return { body, response };
}

function startRoom(runtime: TestRuntime, roomCode: string): Promise<Response> {
	return fetch(`${runtime.baseUrl}/rooms/${roomCode}/start`, {
		body: "{}",
		headers: adminHeaders,
		method: "POST"
	});
}

function requiredQuestion(joined: JoinedRace): PondPaddlersQuestion {
	expect(joined.question).not.toBeNull();
	return joined.question as PondPaddlersQuestion;
}

async function startAndResume(
	runtime: TestRuntime,
	roomCode: string,
	joined: { cookie: string }
) {
	const started = await startRoom(runtime, roomCode);
	expect(started.status).toBe(200);
	const resumed = await resumeRoom(runtime, roomCode, joined.cookie);
	return { ...resumed, cookie: joined.cookie };
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
			operations: ["divide", "subtract"],
			raceFormat: "team-device"
		});
		expect(room).toMatchObject({
			calmMode: false,
			durationMinutes: 120,
			finishAt: 30,
			maxOperand: 100,
			operations: ["divide", "subtract"],
			playerCount: 0,
			raceFormat: "team-device",
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

	it("holds private seats in a lobby until Julio starts an idempotent race", async () => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime, { operations: ["add"] });

		const anonymousStart = await fetch(
			`${runtime.baseUrl}/rooms/${room.roomCode}/start`,
			{
				body: "{}",
				headers: classroomHeaders,
				method: "POST"
			}
		);
		expect(anonymousStart.status).toBe(403);

		const startWithSettings = await fetch(
			`${runtime.baseUrl}/rooms/${room.roomCode}/start`,
			{
				body: JSON.stringify({ countdown: 3 }),
				headers: adminHeaders,
				method: "POST"
			}
		);
		expect(startWithSettings.status).toBe(400);

		const oversizedStart = await fetch(
			`${runtime.baseUrl}/rooms/${room.roomCode}/start`,
			{
				body: JSON.stringify({ extra: "x".repeat(5_000) }),
				headers: adminHeaders,
				method: "POST"
			}
		);
		expect(oversizedStart.status).toBe(413);

		const emptyStart = await startRoom(runtime, room.roomCode);
		expect(emptyStart.status).toBe(409);
		expect(await emptyStart.json()).toEqual({
			message: "At least one paddler must join before the race starts."
		});

		const joined = await joinRoom(runtime, room.roomCode);
		expect(joined.body.question).toBeNull();
		expect(joined.body.state).toMatchObject({
			players: [{ alias: joined.body.alias, progress: 0 }],
			status: "waiting"
		});

		const beforeStart = await postAnswer(
			runtime,
			room.roomCode,
			joined.cookie,
			"A".repeat(16),
			0
		);
		expect(beforeStart.status).toBe(409);
		expect(await beforeStart.json()).toEqual({
			message: "This race has not started yet."
		});

		const started = await startRoom(runtime, room.roomCode);
		expect(started.status).toBe(200);
		expect(await started.json()).toMatchObject({
			room: { playerCount: 1, status: "racing" },
			started: true
		});

		const repeatedStart = await startRoom(runtime, room.roomCode);
		expect(repeatedStart.status).toBe(200);
		expect(await repeatedStart.json()).toMatchObject({
			room: { playerCount: 1, status: "racing" },
			started: false
		});

		const resumed = await resumeRoom(runtime, room.roomCode, joined.cookie);
		expect(resumed.response.status).toBe(200);
		expect(resumed.response.headers.get("set-cookie")).toBeNull();
		expect(resumed.body.alias).toBe(joined.body.alias);
		expect(resumed.body.state.status).toBe("racing");
		expect(requiredQuestion(resumed.body).questionID).toMatch(/^[\w-]{16}$/);

		const lateJoin = await fetch(
			`${runtime.baseUrl}/rooms/${room.roomCode}/join`,
			{
				body: "{}",
				headers: classroomHeaders,
				method: "POST"
			}
		);
		expect(lateJoin.status).toBe(409);
		expect(await lateJoin.json()).toEqual({
			message: "This race has already started."
		});
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
			{ raceFormat: "named-teams" },
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
		const cookieName = pondPaddlersSeatCookieName(
			room.roomCode,
			runtime.secureCookies
		) as string;
		const { header, token } = seatCookie(response, cookieName);
		expect(token).toMatch(/^[\w-]{43}$/);
		expect(rawBody).not.toContain(token);
		expect(response.headers.get("set-cookie")).toContain("HttpOnly");
		expect(response.headers.get("set-cookie")).toContain("Secure");
		expect(response.headers.get("set-cookie")).toContain("SameSite=Strict");
		expect(response.headers.get("set-cookie")).toContain("Path=/");
		const cookieExpiry = /Expires=([^;]+)/.exec(
			response.headers.get("set-cookie") as string
		)?.[1];
		expect(cookieExpiry).toBeTruthy();
		expect(
			Math.abs(Date.parse(cookieExpiry as string) - Date.parse(body.expiresAt))
		).toBeLessThan(1_000);
		expect(body.resumed).toBe(false);
		expect(body.raceFormat).toBe("individual");
		expect(body.alias).toMatch(/^[A-Za-z]+ (Duck|Mallard|Pintail|Teal)$/);
		expect(body.question).toBeNull();
		expect(body.state.status).toBe("waiting");
		expect(Object.keys(body.state).sort()).toEqual(["finishAt", "players", "status"]);
		expect(Object.keys(body.state.players[0]).sort()).toEqual(["alias", "progress"]);
		expect(rawBody).not.toMatch(
			/"[^"]*(?:student|account|email|answer|token|cookie|ip)[^"]*"\s*:/i
		);

		const resumed = await joinRoom(runtime, room.roomCode, header);
		expect(resumed.response.status).toBe(200);
		expect(resumed.body.resumed).toBe(true);
		expect(resumed.body.alias).toBe(body.alias);
		expect(resumed.body.question).toBeNull();
		expect(resumed.body.state.players).toHaveLength(1);

		const wrongCookieName = await joinRoom(
			runtime,
			room.roomCode,
			`${POND_PADDLERS_DEVELOPMENT_SEAT_COOKIE_PREFIX}${room.roomCode}=${token}`
		);
		expect(wrongCookieName.response.status).toBe(201);
		expect(wrongCookieName.body.alias).not.toBe(body.alias);
	});

	it("uses team relay only as a memory-only one-device room format", async () => {
		const runtime = await createRuntime();
		const room = await createRoom(runtime, { raceFormat: "team-device" });
		const joined = await joinRoom(runtime, room.roomCode);
		expect(joined.body.raceFormat).toBe("team-device");
		expect(joined.body.state).toEqual({
			finishAt: 5,
			players: [{ alias: joined.body.alias, progress: 0 }],
			status: "waiting"
		});
		expect(JSON.stringify(joined.body)).not.toMatch(
			/teamName|studentName|roster|account|analytics/i
		);

		expect((await startRoom(runtime, room.roomCode)).status).toBe(200);
		const resumed = await resumeRoom(
			runtime,
			room.roomCode,
			joined.cookie
		);
		expect(resumed.body.raceFormat).toBe("team-device");
		expect(resumed.body.alias).toBe(joined.body.alias);
		let question = requiredQuestion(resumed.body);
		for (let progress = 1; progress <= 5; progress += 1) {
			const answer = await postAnswer(
				runtime,
				room.roomCode,
				joined.cookie,
				question.questionID,
				answerForPrompt(question.prompt)
			);
			expect(answer.status).toBe(200);
			const result = await answer.json() as {
				correct: boolean;
				finished: boolean;
				nextQuestion: PondPaddlersQuestion | null;
				progress: number;
			};
			expect(result).toMatchObject({ correct: true, progress });
			if (progress < 5) {
				expect(result.finished).toBe(false);
				question = result.nextQuestion as PondPaddlersQuestion;
			}
			else {
				expect(result).toEqual({
					correct: true,
					finished: true,
					nextQuestion: null,
					progress: 5
				});
			}
		}
	});

	it("uses a non-Secure local-only cookie over HTTP and accepts only the active cookie name", async () => {
		const runtime = await createRuntime(false);
		const room = await createRoom(runtime);
		const joined = await joinRoom(runtime, room.roomCode);
		const setCookie = joined.response.headers.get("set-cookie") as string;
		expect(setCookie).toContain(
			`${POND_PADDLERS_DEVELOPMENT_SEAT_COOKIE_PREFIX}${room.roomCode}=`
		);
		expect(setCookie).not.toContain("Secure");
		expect(setCookie).toContain("HttpOnly");
		expect(setCookie).toContain("SameSite=Strict");

		const wrongName = await joinRoom(
			runtime,
			room.roomCode,
			`${POND_PADDLERS_PRODUCTION_SEAT_COOKIE_PREFIX}${room.roomCode}=${joined.token}`
		);
		expect(wrongName.response.status).toBe(201);
		expect(wrongName.body.alias).not.toBe(joined.body.alias);

		const resumed = await resumeRoom(runtime, room.roomCode, joined.cookie);
		expect(resumed.response.status).toBe(200);
		expect(resumed.body.alias).toBe(joined.body.alias);
	});

	it("isolates private seat cookies by normalized room without creating seats on resume", async () => {
		const runtime = await createRuntime();
		const firstRoom = await createRoom(runtime, { operations: ["add"] });
		const secondRoom = await createRoom(runtime, { operations: ["subtract"] });

		expect(
			pondPaddlersSeatCookieName(firstRoom.roomCode.toLowerCase(), true)
		).toBe(
			`${POND_PADDLERS_PRODUCTION_SEAT_COOKIE_PREFIX}${firstRoom.roomCode}`
		);

		const missingSeat = await fetch(
			`${runtime.baseUrl}/rooms/${firstRoom.roomCode}/resume`,
			{ headers: { "X-Classroom-Request": "1" } }
		);
		expect(missingSeat.status).toBe(403);
		const unchangedRooms = await fetch(`${runtime.baseUrl}/rooms`, {
			headers: { "X-Test-Admin": "1" }
		});
		expect(
			(await unchangedRooms.json() as { rooms: Array<{ playerCount: number }> })
				.rooms.map(room => room.playerCount)
		).toEqual([0, 0]);

		const firstSeat = await joinRoom(runtime, firstRoom.roomCode);
		const secondSeat = await joinRoom(
			runtime,
			secondRoom.roomCode,
			firstSeat.cookie
		);
		expect(firstSeat.cookie.split("=", 1)[0]).not.toBe(
			secondSeat.cookie.split("=", 1)[0]
		);
		const combinedCookies = `${firstSeat.cookie}; ${secondSeat.cookie}`;

		expect((await startRoom(runtime, firstRoom.roomCode)).status).toBe(200);
		expect((await startRoom(runtime, secondRoom.roomCode)).status).toBe(200);
		const [firstResumed, secondResumed] = await Promise.all([
			resumeRoom(runtime, firstRoom.roomCode, combinedCookies),
			resumeRoom(runtime, secondRoom.roomCode, combinedCookies)
		]);
		expect(firstResumed.body.alias).toBe(firstSeat.body.alias);
		expect(secondResumed.body.alias).toBe(secondSeat.body.alias);
		expect(requiredQuestion(firstResumed.body).prompt).toContain(" + ");
		expect(requiredQuestion(secondResumed.body).prompt).toContain(" − ");

		const wrongRoomCookie = await fetch(
			`${runtime.baseUrl}/rooms/${firstRoom.roomCode}/resume`,
			{
				headers: {
					Cookie: secondSeat.cookie,
					"X-Classroom-Request": "1"
				}
			}
		);
		expect(wrongRoomCookie.status).toBe(403);
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
		const waiting = await joinRoom(runtime, room.roomCode);
		const joined = await startAndResume(runtime, room.roomCode, waiting);
		const question = requiredQuestion(joined.body);
		expect(question.prompt).toContain(` ${symbol} `);
		const operands = question.prompt.match(/\d+/g)?.map(Number) ?? [];
		expect(operands).toHaveLength(2);
		expect(Math.max(...operands)).toBeLessThanOrEqual(10);
		const correctAnswer = answerForPrompt(question.prompt);
		expect(Number.isInteger(correctAnswer)).toBe(true);
		expect(correctAnswer).toBeGreaterThanOrEqual(0);
		if (operation === "divide") expect(operands[0] % operands[1]).toBe(0);

		const result = await postAnswer(
			runtime,
			room.roomCode,
			joined.cookie,
			question.questionID,
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
		const waiting = await joinRoom(runtime, room.roomCode);
		const joined = await startAndResume(runtime, room.roomCode, waiting);
		const question = requiredQuestion(joined.body);
		const answer = answerForPrompt(question.prompt);

		const noSeat = await postAnswer(
			runtime,
			room.roomCode,
			undefined,
			question.questionID,
			answer
		);
		expect(noSeat.status).toBe(403);

		const forgedSeat = await postAnswer(
			runtime,
			room.roomCode,
			`${pondPaddlersSeatCookieName(
				room.roomCode,
				runtime.secureCookies
			)}=${"A".repeat(43)}`,
			question.questionID,
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
		const waiting = await joinRoom(runtime, room.roomCode);
		const joined = await startAndResume(runtime, room.roomCode, waiting);
		let question = requiredQuestion(joined.body);

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

		const finishedStart = await startRoom(runtime, room.roomCode);
		expect(finishedStart.status).toBe(409);
		expect(await finishedStart.json()).toEqual({
			message: "This race has already finished."
		});
		const finishedResume = await resumeRoom(
			runtime,
			room.roomCode,
			joined.cookie
		);
		expect(finishedResume.body.state.status).toBe("finished");
		expect(finishedResume.body.question).toBeNull();
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
		const started = await startRoom(runtime, room.roomCode);
		expect(started.status).toBe(200);
		const resumed = await resumeRoom(runtime, room.roomCode, joined.cookie);
		const question = requiredQuestion(resumed.body);

		const answer = await postAnswer(
			runtime,
			room.roomCode,
			joined.cookie,
			question.questionID,
			answerForPrompt(question.prompt)
		);
		expect(answer.status).toBe(200);
		for (
			let reads = 0;
			reads < 5 && streamText.split("\n").filter(line => line.startsWith("data: ")).length < 3;
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
		expect(dataLines).toHaveLength(3);
		const states = dataLines.map(line => JSON.parse(line.slice(6)));
		expect(states.map(state => state.status)).toEqual([
			"waiting",
			"racing",
			"racing"
		]);
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
		const waiting = await joinRoom(runtime, room.roomCode);
		const joined = await startAndResume(runtime, room.roomCode, waiting);
		const question = requiredQuestion(joined.body);
		const wrongAnswer = answerForPrompt(question.prompt) + 1;
		for (let attempt = 0; attempt < 120; attempt += 1) {
			const response = await postAnswer(
				runtime,
				room.roomCode,
				joined.cookie,
				question.questionID,
				wrongAnswer
			);
			expect(response.status).toBe(200);
		}
		const limited = await postAnswer(
			runtime,
			room.roomCode,
			joined.cookie,
			question.questionID,
			wrongAnswer
		);
		expect(limited.status).toBe(429);
	});

	it("lets a full shared-address class hand off without one seat starving peers", async () => {
		const runtime = await createRuntime({
			resumeAddressLimit: 100,
			resumeSeatLimit: 2
		});
		const room = await createRoom(runtime);
		const joinedSeats: Array<Awaited<ReturnType<typeof joinRoom>>> = [];
		for (let seat = 0; seat < 32; seat += 1) {
			joinedSeats.push(await joinRoom(runtime, room.roomCode));
		}
		expect((await startRoom(runtime, room.roomCode)).status).toBe(200);

		for (const joined of joinedSeats) {
			expect(
				(await resumeRoom(runtime, room.roomCode, joined.cookie)).response
					.status
			).toBe(200);
		}
		const [limitedSeat, peerSeat] = joinedSeats;
		if (!limitedSeat || !peerSeat) throw new Error("Expected a full classroom");
		expect(
			(await resumeRoom(runtime, room.roomCode, limitedSeat.cookie)).response
				.status
		).toBe(200);
		const limited = await fetch(
			`${runtime.baseUrl}/rooms/${room.roomCode}/resume`,
			{
				headers: {
					Cookie: limitedSeat.cookie,
					"X-Classroom-Request": "1"
				}
			}
		);
		expect(limited.status).toBe(429);
		expect(
			(await resumeRoom(runtime, room.roomCode, peerSeat.cookie)).response
				.status
		).toBe(200);
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
			operations: ["add"],
			raceFormat: "individual"
		});
		const joined = store.joinRoom(room.roomCode);
		store.subscribe(room.roomCode, joined.seatToken, () => {
			throw new Error("simulated disconnected stream");
		});
		store.startRoom(room.roomCode);
		const resumed = store.resumeRoom(room.roomCode, joined.seatToken);
		const question = requiredQuestion(resumed);
		expect(() => store.answerQuestion(
			room.roomCode,
			joined.seatToken,
			question.questionID,
			answerForPrompt(question.prompt)
		)).not.toThrow();
		store.dispose();
	});
});
