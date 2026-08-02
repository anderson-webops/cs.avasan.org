import type { Express, NextFunction, Request, Response } from "express";
import type {
	PondPaddlersOperation,
	PondPaddlersPublicState,
	PondPaddlersRoomSettings,
	PondPaddlersRoomStore
} from "../services/pondPaddlersRooms.js";
import express from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { validAdmin } from "../middleware/auth.js";
import { requireClassroomRequest } from "../middleware/classroomRequest.js";
import { ExactExpiryRateLimitStore } from "../security/exactExpiryRateLimitStore.js";
import {
	POND_PADDLERS_OPERATIONS,
	PondPaddlersError,
	pondPaddlersSeatTokenDigest
} from "../services/pondPaddlersRooms.js";

export const POND_PADDLERS_PRODUCTION_SEAT_COOKIE = "__Host-pond-paddlers-seat";
export const POND_PADDLERS_DEVELOPMENT_SEAT_COOKIE = "pond-paddlers-seat";
const POND_PADDLERS_BODY_LIMIT = "4kb";
const DEFAULT_ROOM_SETTINGS: PondPaddlersRoomSettings = {
	calmMode: true,
	durationMinutes: 60,
	finishAt: 10,
	maxOperand: 20,
	operations: [...POND_PADDLERS_OPERATIONS]
};
const ALLOWED_CREATE_KEYS = new Set([
	"calmMode",
	"durationMinutes",
	"finishAt",
	"maxOperand",
	"operations"
]);
const ALLOWED_ANSWER_KEYS = new Set(["answer", "questionID"]);
const OPERATION_SET = new Set<string>(POND_PADDLERS_OPERATIONS);

interface PondPaddlersRouteOptions {
	heartbeatMs?: number;
	secureCookies?: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, allowed: Set<string>): boolean {
	return Object.keys(value).every(key => allowed.has(key));
}

function parseRoomSettings(value: unknown): PondPaddlersRoomSettings | null {
	if (value === undefined) return { ...DEFAULT_ROOM_SETTINGS, operations: [...DEFAULT_ROOM_SETTINGS.operations] };
	if (!isRecord(value) || !hasOnlyKeys(value, ALLOWED_CREATE_KEYS)) return null;

	const operationsValue = value.operations ?? DEFAULT_ROOM_SETTINGS.operations;
	if (
		!Array.isArray(operationsValue)
		|| operationsValue.length < 1
		|| operationsValue.length > POND_PADDLERS_OPERATIONS.length
		|| !operationsValue.every(operation => typeof operation === "string" && OPERATION_SET.has(operation))
		|| new Set(operationsValue).size !== operationsValue.length
	) {
		return null;
	}

	const maxOperand = value.maxOperand ?? DEFAULT_ROOM_SETTINGS.maxOperand;
	const finishAt = value.finishAt ?? DEFAULT_ROOM_SETTINGS.finishAt;
	const durationMinutes = value.durationMinutes ?? DEFAULT_ROOM_SETTINGS.durationMinutes;
	const calmMode = value.calmMode ?? DEFAULT_ROOM_SETTINGS.calmMode;
	if (
		!Number.isSafeInteger(maxOperand)
		|| (maxOperand as number) < 10
		|| (maxOperand as number) > 100
		|| !Number.isSafeInteger(finishAt)
		|| (finishAt as number) < 5
		|| (finishAt as number) > 30
		|| !Number.isSafeInteger(durationMinutes)
		|| (durationMinutes as number) < 5
		|| (durationMinutes as number) > 120
		|| typeof calmMode !== "boolean"
	) {
		return null;
	}

	return {
		calmMode,
		durationMinutes: durationMinutes as number,
		finishAt: finishAt as number,
		maxOperand: maxOperand as number,
		operations: operationsValue as PondPaddlersOperation[]
	};
}

function parseAnswer(value: unknown): { answer: number; questionID: string } | null {
	if (!isRecord(value) || !hasOnlyKeys(value, ALLOWED_ANSWER_KEYS)) return null;
	if (
		!Number.isSafeInteger(value.answer)
		|| typeof value.questionID !== "string"
		|| !/^[\w-]{16}$/.test(value.questionID)
	) {
		return null;
	}
	return {
		answer: value.answer as number,
		questionID: value.questionID
	};
}

function isEmptyJoinBody(value: unknown): boolean {
	return value === undefined || (isRecord(value) && Object.keys(value).length === 0);
}

export function readPondPaddlersSeatCookie(req: Request, cookieName: string): string | null {
	const cookieHeader = req.get("cookie");
	if (!cookieHeader) return null;
	const values: string[] = [];
	for (const cookie of cookieHeader.split(";")) {
		const separator = cookie.indexOf("=");
		if (separator < 0) continue;
		if (cookie.slice(0, separator).trim() !== cookieName) continue;
		try {
			values.push(decodeURIComponent(cookie.slice(separator + 1).trim()));
		}
		catch {
			return null;
		}
	}
	return values.length === 1 ? values[0] : null;
}

function clientAddress(req: Request): string {
	return ipKeyGenerator(req.ip || req.socket.remoteAddress || "unknown");
}

function createJoinLimiter() {
	return rateLimit({
		legacyHeaders: false,
		limit: 120,
		message: { message: "Race request limit reached. Please wait and try again." },
		standardHeaders: true,
		store: new ExactExpiryRateLimitStore(),
		windowMs: 5 * 60 * 1000
	});
}

function createAnswerSeatLimiter(cookieName: string) {
	return rateLimit({
		keyGenerator: (req) => {
			const seatDigest = pondPaddlersSeatTokenDigest(readPondPaddlersSeatCookie(req, cookieName));
			return seatDigest ? `seat:${seatDigest}` : `client:${clientAddress(req)}`;
		},
		legacyHeaders: false,
		limit: 120,
		message: { message: "Answer limit reached. Please wait and try again." },
		standardHeaders: true,
		store: new ExactExpiryRateLimitStore(),
		windowMs: 60_000
	});
}

function createAnswerAddressLimiter() {
	return rateLimit({
		keyGenerator: clientAddress,
		legacyHeaders: false,
		// A whole classroom commonly shares one address. This second ceiling
		// bounds forged-cookie traffic without constraining normal class play.
		limit: 3_000,
		message: { message: "Answer limit reached. Please wait and try again." },
		standardHeaders: true,
		store: new ExactExpiryRateLimitStore(),
		windowMs: 5 * 60 * 1000
	});
}

function setSeatCookie(
	res: Response,
	cookieName: string,
	seatToken: string,
	expiresAt: string,
	secure: boolean
): void {
	res.cookie(cookieName, seatToken, {
		expires: new Date(expiresAt),
		httpOnly: true,
		path: "/",
		sameSite: "strict",
		secure
	});
}

function sendSseState(res: Response, state: PondPaddlersPublicState): boolean {
	return res.write(`event: state\ndata: ${JSON.stringify(state)}\n\n`);
}

function sendPondPaddlersError(error: unknown, res: Response): void {
	if (!(error instanceof PondPaddlersError)) {
		res.status(500).json({ message: "Race service unavailable." });
		return;
	}

	switch (error.code) {
		case "capacity":
			res.status(409).json({ message: "No more races can be opened right now." });
			return;
		case "full":
			res.status(409).json({ message: "This race has no open seats." });
			return;
		case "invalid-settings":
			res.status(400).json({ message: "Invalid race settings." });
			return;
		case "question-changed":
			res.status(409).json({ message: "The current question has changed." });
			return;
		case "seat-required":
			res.status(403).json({ message: "A private race seat is required." });
			return;
		case "too-many-streams":
			res.status(429).json({ message: "Too many race windows are open." });
			return;
		case "finished":
		case "not-found":
			// Closed, expired, finished-before-join, and unknown codes deliberately
			// share one response so the route is not a room-status oracle.
			res.status(404).json({ message: "Race unavailable." });
	}
}

function bodyParserError(error: unknown, _req: Request, res: Response, next: NextFunction): void {
	if (!isRecord(error) || (error.status !== 400 && error.status !== 413)) {
		next(error);
		return;
	}
	res.status(error.status).json({
		message: error.status === 413 ? "Race request is too large." : "Invalid race request."
	});
}

export function createPondPaddlersRoutes(
	store: PondPaddlersRoomStore,
	options: PondPaddlersRouteOptions = {}
) {
	const router = express.Router();
	const heartbeatMs = options.heartbeatMs ?? 15_000;
	const secureCookies = options.secureCookies ?? false;
	const seatCookieName = secureCookies
		? POND_PADDLERS_PRODUCTION_SEAT_COOKIE
		: POND_PADDLERS_DEVELOPMENT_SEAT_COOKIE;
	const joinLimiter = createJoinLimiter();
	const answerSeatLimiter = createAnswerSeatLimiter(seatCookieName);
	const answerAddressLimiter = createAnswerAddressLimiter();

	router.use((_req, res, next) => {
		res.setHeader("Cache-Control", "no-store");
		next();
	});
	router.use(requireClassroomRequest);
	router.use(express.json({ limit: POND_PADDLERS_BODY_LIMIT, strict: true }));
	router.use(bodyParserError);

	router.post("/rooms", validAdmin, (req, res) => {
		const settings = parseRoomSettings(req.body);
		if (!settings) {
			res.status(400).json({ message: "Invalid race settings." });
			return;
		}
		try {
			res.status(201).json({ room: store.createRoom(settings) });
		}
		catch (error) {
			sendPondPaddlersError(error, res);
		}
	});

	router.get("/rooms", validAdmin, (_req, res) => {
		res.json({ rooms: store.listRooms() });
	});

	router.delete("/rooms/:roomCode", validAdmin, (req, res) => {
		if (!store.closeRoom(req.params.roomCode)) {
			res.status(404).json({ message: "Race unavailable." });
			return;
		}
		res.sendStatus(204);
	});

	router.post("/rooms/:roomCode/join", joinLimiter, (req, res) => {
		if (!isEmptyJoinBody(req.body)) {
			res.status(400).json({ message: "Race joins do not accept names or other text." });
			return;
		}
		try {
			const joined = store.joinRoom(
				req.params.roomCode,
				readPondPaddlersSeatCookie(req, seatCookieName)
			);
			setSeatCookie(res, seatCookieName, joined.seatToken, joined.expiresAt, secureCookies);
			const { seatToken: _seatToken, ...response } = joined;
			res.status(joined.resumed ? 200 : 201).json(response);
		}
		catch (error) {
			sendPondPaddlersError(error, res);
		}
	});

	router.get("/rooms/:roomCode/events", (req, res) => {
		let unsubscribe: (() => void) | null = null;
		let heartbeat: ReturnType<typeof setInterval> | null = null;
		const subscriber = (state: PondPaddlersPublicState, closed: boolean) => {
			if (res.destroyed || res.writableEnded) return;
			const accepted = sendSseState(res, state);
			if (!accepted || closed) res.end();
		};

		try {
			const subscription = store.subscribe(
				req.params.roomCode,
				readPondPaddlersSeatCookie(req, seatCookieName),
				subscriber
			);
			unsubscribe = subscription.unsubscribe;
			res.status(200);
			res.set({
				"Cache-Control": "no-store, no-transform",
				"Connection": "keep-alive",
				"Content-Type": "text/event-stream; charset=utf-8",
				"X-Accel-Buffering": "no"
			});
			res.flushHeaders();
			res.write("retry: 3000\n\n");
			sendSseState(res, subscription.state);
			heartbeat = setInterval(() => {
				if (!res.destroyed && !res.writableEnded && !res.write(": heartbeat\n\n")) res.end();
			}, heartbeatMs);
			heartbeat.unref?.();
		}
		catch (error) {
			sendPondPaddlersError(error, res);
			return;
		}

		const cleanup = () => {
			if (heartbeat) clearInterval(heartbeat);
			heartbeat = null;
			unsubscribe?.();
			unsubscribe = null;
		};
		req.once("close", cleanup);
		res.once("close", cleanup);
	});

	router.post(
		"/rooms/:roomCode/answer",
		answerAddressLimiter,
		answerSeatLimiter,
		(req, res) => {
			const answer = parseAnswer(req.body);
			if (!answer) {
				res.status(400).json({ message: "Invalid answer request." });
				return;
			}
			try {
				res.json(store.answerQuestion(
					req.params.roomCode,
					readPondPaddlersSeatCookie(req, seatCookieName),
					answer.questionID,
					answer.answer
				));
			}
			catch (error) {
				sendPondPaddlersError(error, res);
			}
		}
	);

	return router;
}

export function mountPondPaddlersRoutes(
	app: Express,
	store: PondPaddlersRoomStore,
	options: PondPaddlersRouteOptions = {}
): void {
	app.use("/pond-paddlers", createPondPaddlersRoutes(store, options));
}
