import { Buffer } from "node:buffer";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

export const POND_PADDLERS_OPERATIONS = [
	"add",
	"subtract",
	"multiply",
	"divide"
] as const;

export type PondPaddlersOperation = typeof POND_PADDLERS_OPERATIONS[number];
export type PondPaddlersRoomStatus = "waiting" | "racing" | "finished" | "closed";

export interface PondPaddlersQuestion {
	prompt: string;
	questionID: string;
}

export interface PondPaddlersPublicState {
	finishAt: number;
	players: Array<{
		alias: string;
		progress: number;
	}>;
	status: PondPaddlersRoomStatus;
}

export interface PondPaddlersRoomSettings {
	calmMode: boolean;
	durationMinutes: number;
	finishAt: number;
	maxOperand: number;
	operations: PondPaddlersOperation[];
}

export interface PondPaddlersAdminRoom extends PondPaddlersRoomSettings {
	createdAt: string;
	expiresAt: string;
	playerCount: number;
	roomCode: string;
	status: Exclude<PondPaddlersRoomStatus, "closed">;
}

export interface PondPaddlersJoinResult {
	alias: string;
	calmMode: boolean;
	expiresAt: string;
	question: PondPaddlersQuestion | null;
	resumed: boolean;
	seatToken: string;
	state: PondPaddlersPublicState;
}

export interface PondPaddlersStartResult {
	room: PondPaddlersAdminRoom;
	started: boolean;
}

export interface PondPaddlersAnswerResult {
	correct: boolean;
	finished: boolean;
	nextQuestion: PondPaddlersQuestion | null;
	progress: number;
}

export type PondPaddlersErrorCode
	= | "capacity"
		| "finished"
		| "full"
		| "invalid-settings"
		| "no-paddlers"
		| "not-found"
		| "not-started"
		| "question-changed"
		| "seat-required"
		| "started"
		| "too-many-streams";

export class PondPaddlersError extends Error {
	constructor(readonly code: PondPaddlersErrorCode) {
		super(code);
		this.name = "PondPaddlersError";
	}
}

interface StoredQuestion {
	answer: number;
	publicQuestion: PondPaddlersQuestion;
}

type StateSubscriber = (state: PondPaddlersPublicState, closed: boolean) => void;

interface PondPaddlersPlayer {
	alias: string;
	progress: number;
	question: StoredQuestion;
	subscribers: Set<StateSubscriber>;
}

interface PondPaddlersRoom {
	calmMode: boolean;
	createdAt: number;
	expiresAt: number;
	expiryTimer: ReturnType<typeof setTimeout>;
	finishAt: number;
	maxOperand: number;
	operations: PondPaddlersOperation[];
	players: Map<string, PondPaddlersPlayer>;
	roomCode: string;
	status: Exclude<PondPaddlersRoomStatus, "closed">;
}

const ROOM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROOM_CODE_LENGTH = 8;
const MAX_ACTIVE_ROOMS = 64;
export const MAX_POND_PADDLERS_PLAYERS = 32;
const MAX_STREAMS_PER_SEAT = 3;
const SEAT_TOKEN_BYTES = 32;
const QUESTION_ID_BYTES = 12;

const ALIAS_ADJECTIVES = [
	"Amber",
	"Blue",
	"Brave",
	"Bright",
	"Calm",
	"Clever",
	"Coral",
	"Emerald",
	"Golden",
	"Happy",
	"Indigo",
	"Jade",
	"Quick",
	"Silver",
	"Sunny",
	"Violet"
] as const;
const ALIAS_BIRDS = ["Duck", "Mallard", "Pintail", "Teal"] as const;
const SAFE_ALIASES = ALIAS_ADJECTIVES.flatMap(adjective =>
	ALIAS_BIRDS.map(bird => `${adjective} ${bird}`)
);

function seatDigest(seatToken: string): string {
	return createHash("sha256").update(seatToken).digest("base64url");
}

function secureToken(byteLength: number): string {
	return randomBytes(byteLength).toString("base64url");
}

function integerBetween(minimum: number, maximum: number): number {
	return randomInt(minimum, maximum + 1);
}

function makeRoomCode(): string {
	let roomCode = "";
	for (let index = 0; index < ROOM_CODE_LENGTH; index += 1) {
		roomCode += ROOM_CODE_ALPHABET[randomInt(ROOM_CODE_ALPHABET.length)];
	}
	return roomCode;
}

function settingsAreBounded(settings: PondPaddlersRoomSettings): boolean {
	return typeof settings.calmMode === "boolean"
		&& Number.isSafeInteger(settings.durationMinutes)
		&& settings.durationMinutes >= 5
		&& settings.durationMinutes <= 120
		&& Number.isSafeInteger(settings.finishAt)
		&& settings.finishAt >= 5
		&& settings.finishAt <= 30
		&& Number.isSafeInteger(settings.maxOperand)
		&& settings.maxOperand >= 10
		&& settings.maxOperand <= 100
		&& settings.operations.length >= 1
		&& settings.operations.length <= POND_PADDLERS_OPERATIONS.length
		&& new Set(settings.operations).size === settings.operations.length
		&& settings.operations.every(operation => POND_PADDLERS_OPERATIONS.includes(operation));
}

function publicQuestion(prompt: string): StoredQuestion["publicQuestion"] {
	return {
		prompt,
		questionID: secureToken(QUESTION_ID_BYTES)
	};
}

function createQuestion(room: PondPaddlersRoom): StoredQuestion {
	const operation = room.operations[randomInt(room.operations.length)];
	switch (operation) {
		case "add": {
			const left = integerBetween(0, room.maxOperand);
			const right = integerBetween(0, room.maxOperand);
			return {
				answer: left + right,
				publicQuestion: publicQuestion(`${left} + ${right} = ?`)
			};
		}
		case "subtract": {
			const left = integerBetween(0, room.maxOperand);
			const right = integerBetween(0, left);
			return {
				answer: left - right,
				publicQuestion: publicQuestion(`${left} − ${right} = ?`)
			};
		}
		case "multiply": {
			const left = integerBetween(0, room.maxOperand);
			const right = integerBetween(0, room.maxOperand);
			return {
				answer: left * right,
				publicQuestion: publicQuestion(`${left} × ${right} = ?`)
			};
		}
		case "divide": {
			const divisor = integerBetween(1, room.maxOperand);
			const quotient = integerBetween(0, Math.floor(room.maxOperand / divisor));
			const dividend = divisor * quotient;
			return {
				answer: quotient,
				publicQuestion: publicQuestion(`${dividend} ÷ ${divisor} = ?`)
			};
		}
	}
}

function chooseAlias(room: PondPaddlersRoom): string {
	const aliasesInUse = new Set(Array.from(room.players.values(), player => player.alias));
	const available = SAFE_ALIASES.filter(alias => !aliasesInUse.has(alias));
	return available[randomInt(available.length)];
}

function publicState(
	room: PondPaddlersRoom,
	status: PondPaddlersRoomStatus = room.status
): PondPaddlersPublicState {
	return {
		finishAt: room.finishAt,
		players: Array.from(room.players.values(), player => ({
			alias: player.alias,
			progress: player.progress
		})),
		status
	};
}

function adminRoom(room: PondPaddlersRoom): PondPaddlersAdminRoom {
	return {
		calmMode: room.calmMode,
		createdAt: new Date(room.createdAt).toISOString(),
		durationMinutes: (room.expiresAt - room.createdAt) / 60_000,
		expiresAt: new Date(room.expiresAt).toISOString(),
		finishAt: room.finishAt,
		maxOperand: room.maxOperand,
		operations: [...room.operations],
		playerCount: room.players.size,
		roomCode: room.roomCode,
		status: room.status
	};
}

function isSeatToken(value: string | null | undefined): value is string {
	return typeof value === "string"
		&& /^[\w-]{43}$/.test(value);
}

function playerForSeat(
	room: PondPaddlersRoom,
	seatToken: string | null | undefined
): PondPaddlersPlayer | undefined {
	const candidateDigest = pondPaddlersSeatTokenDigest(seatToken);
	if (!candidateDigest) return undefined;
	const candidate = Buffer.from(candidateDigest, "base64url");
	for (const [storedDigest, player] of room.players) {
		const stored = Buffer.from(storedDigest, "base64url");
		if (stored.length === candidate.length && timingSafeEqual(stored, candidate)) {
			return player;
		}
	}
	return undefined;
}

export function normalizePondPaddlersRoomCode(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const normalized = value.trim().toUpperCase();
	return normalized.length === ROOM_CODE_LENGTH
		&& [...normalized].every(character => ROOM_CODE_ALPHABET.includes(character))
		? normalized
		: null;
}

export function pondPaddlersSeatTokenDigest(value: string | null | undefined): string | null {
	return isSeatToken(value) ? seatDigest(value) : null;
}

export class PondPaddlersRoomStore {
	private readonly rooms = new Map<string, PondPaddlersRoom>();

	createRoom(settings: PondPaddlersRoomSettings): PondPaddlersAdminRoom {
		this.removeExpiredRooms();
		if (!settingsAreBounded(settings)) {
			throw new PondPaddlersError("invalid-settings");
		}
		if (this.rooms.size >= MAX_ACTIVE_ROOMS) {
			throw new PondPaddlersError("capacity");
		}

		let roomCode: string | null = null;
		for (let attempt = 0; attempt < 100 && roomCode === null; attempt += 1) {
			const candidate = makeRoomCode();
			if (!this.rooms.has(candidate)) roomCode = candidate;
		}
		if (!roomCode) throw new PondPaddlersError("capacity");

		const createdAt = Date.now();
		const expiresAt = createdAt + settings.durationMinutes * 60_000;
		const room: PondPaddlersRoom = {
			...settings,
			createdAt,
			expiresAt,
			expiryTimer: setTimeout(() => {
				this.closeRoom(roomCode as string);
			}, expiresAt - createdAt),
			operations: [...settings.operations],
			players: new Map(),
			roomCode,
			status: "waiting"
		};
		room.expiryTimer.unref?.();
		this.rooms.set(roomCode, room);
		return adminRoom(room);
	}

	listRooms(): PondPaddlersAdminRoom[] {
		this.removeExpiredRooms();
		return Array.from(this.rooms.values(), adminRoom)
			.sort((left, right) => left.createdAt.localeCompare(right.createdAt));
	}

	closeRoom(roomCodeValue: unknown): boolean {
		const roomCode = normalizePondPaddlersRoomCode(roomCodeValue);
		if (!roomCode) return false;
		const room = this.rooms.get(roomCode);
		if (!room) return false;

		clearTimeout(room.expiryTimer);
		this.rooms.delete(roomCode);
		const state = publicState(room, "closed");
		for (const player of room.players.values()) {
			this.notifySubscribers(player, state, true);
			player.subscribers.clear();
		}
		return true;
	}

	startRoom(roomCodeValue: unknown): PondPaddlersStartResult {
		const room = this.requireRoom(roomCodeValue);
		if (room.status === "finished") throw new PondPaddlersError("finished");
		if (room.players.size === 0) throw new PondPaddlersError("no-paddlers");
		if (room.status === "racing") {
			return { room: adminRoom(room), started: false };
		}

		room.status = "racing";
		this.broadcast(room);
		return { room: adminRoom(room), started: true };
	}

	resumeRoom(
		roomCodeValue: unknown,
		seatToken: string | null | undefined
	): PondPaddlersJoinResult {
		const room = this.requireRoom(roomCodeValue);
		if (!isSeatToken(seatToken)) throw new PondPaddlersError("seat-required");
		const player = this.requirePlayer(room, seatToken);
		return this.joinResult(room, player, seatToken, true);
	}

	joinRoom(roomCodeValue: unknown, currentSeatToken?: string | null): PondPaddlersJoinResult {
		const room = this.requireRoom(roomCodeValue);
		if (isSeatToken(currentSeatToken)) {
			const existingPlayer = playerForSeat(room, currentSeatToken);
			if (existingPlayer) {
				return this.joinResult(room, existingPlayer, currentSeatToken, true);
			}
		}

		if (room.status === "finished") throw new PondPaddlersError("finished");
		if (room.status === "racing") throw new PondPaddlersError("started");
		if (room.players.size >= MAX_POND_PADDLERS_PLAYERS) {
			throw new PondPaddlersError("full");
		}

		const seatToken = secureToken(SEAT_TOKEN_BYTES);
		const player: PondPaddlersPlayer = {
			alias: chooseAlias(room),
			progress: 0,
			question: createQuestion(room),
			subscribers: new Set()
		};
		room.players.set(seatDigest(seatToken), player);
		this.broadcast(room);
		return this.joinResult(room, player, seatToken, false);
	}

	answerQuestion(
		roomCodeValue: unknown,
		seatToken: string | null | undefined,
		questionID: string,
		answer: number
	): PondPaddlersAnswerResult {
		const room = this.requireRoom(roomCodeValue);
		const player = this.requirePlayer(room, seatToken);
		if (room.status === "waiting") throw new PondPaddlersError("not-started");
		if (room.status === "finished") throw new PondPaddlersError("finished");
		if (player.question.publicQuestion.questionID !== questionID) {
			throw new PondPaddlersError("question-changed");
		}

		const correct = player.question.answer === answer;
		if (correct) {
			player.progress += 1;
			if (player.progress >= room.finishAt) {
				room.status = "finished";
			}
			else {
				player.question = createQuestion(room);
			}
			this.broadcast(room);
		}

		const finished = room.status === "finished";
		return {
			correct,
			finished,
			nextQuestion: finished ? null : player.question.publicQuestion,
			progress: player.progress
		};
	}

	subscribe(
		roomCodeValue: unknown,
		seatToken: string | null | undefined,
		subscriber: StateSubscriber
	): {
		state: PondPaddlersPublicState;
		unsubscribe: () => void;
	} {
		const room = this.requireRoom(roomCodeValue);
		const player = this.requirePlayer(room, seatToken);
		if (player.subscribers.size >= MAX_STREAMS_PER_SEAT) {
			throw new PondPaddlersError("too-many-streams");
		}
		player.subscribers.add(subscriber);
		return {
			state: publicState(room),
			unsubscribe: () => {
				player.subscribers.delete(subscriber);
			}
		};
	}

	dispose(): void {
		for (const roomCode of [...this.rooms.keys()]) {
			this.closeRoom(roomCode);
		}
	}

	private broadcast(room: PondPaddlersRoom): void {
		const state = publicState(room);
		for (const player of room.players.values()) {
			this.notifySubscribers(player, state, false);
		}
	}

	private notifySubscribers(
		player: PondPaddlersPlayer,
		state: PondPaddlersPublicState,
		closed: boolean
	): void {
		for (const subscriber of player.subscribers) {
			try {
				subscriber(state, closed);
			}
			catch {
				player.subscribers.delete(subscriber);
			}
		}
	}

	private removeExpiredRooms(): void {
		const now = Date.now();
		for (const room of this.rooms.values()) {
			if (room.expiresAt <= now) this.closeRoom(room.roomCode);
		}
	}

	private joinResult(
		room: PondPaddlersRoom,
		player: PondPaddlersPlayer,
		seatToken: string,
		resumed: boolean
	): PondPaddlersJoinResult {
		return {
			alias: player.alias,
			calmMode: room.calmMode,
			expiresAt: new Date(room.expiresAt).toISOString(),
			question:
				room.status === "racing" ? player.question.publicQuestion : null,
			resumed,
			seatToken,
			state: publicState(room)
		};
	}

	private requireRoom(roomCodeValue: unknown): PondPaddlersRoom {
		this.removeExpiredRooms();
		const roomCode = normalizePondPaddlersRoomCode(roomCodeValue);
		const room = roomCode ? this.rooms.get(roomCode) : undefined;
		if (!room) throw new PondPaddlersError("not-found");
		return room;
	}

	private requirePlayer(
		room: PondPaddlersRoom,
		seatToken: string | null | undefined
	): PondPaddlersPlayer {
		const player = playerForSeat(room, seatToken);
		if (!player) throw new PondPaddlersError("seat-required");
		return player;
	}
}
