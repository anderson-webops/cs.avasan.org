export interface PondPaddlersQuestion {
	questionID: string;
	prompt: string;
}

export type PondPaddlersRoomStatus =
	"closed" | "finished" | "racing" | "waiting";

export interface PondPaddler {
	alias: string;
	progress: number;
}

export interface PondPaddlersPublicState {
	finishAt: number;
	players: PondPaddler[];
	status: PondPaddlersRoomStatus;
}

export interface PondPaddlersJoinResult {
	alias: string;
	calmMode: boolean;
	expiresAt: string;
	question: PondPaddlersQuestion | null;
	resumed: boolean;
	roomCode: string;
	state: PondPaddlersPublicState;
}

export interface PondPaddlersAnswerResult {
	correct: boolean;
	finished: boolean;
	nextQuestion: PondPaddlersQuestion | null;
	progress: number;
}

export interface PondPaddlersEventHandlers {
	onError: () => void;
	onOpen: () => void;
	onState: (state: PondPaddlersPublicState) => void;
}

export interface PondPaddlersEventConnection {
	close: () => void;
}

type JsonRecord = Record<string, unknown>;

export class PondPaddlersRequestError extends Error {
	constructor(
		message: string,
		readonly status: number
	) {
		super(message);
		this.name = "PondPaddlersRequestError";
	}
}

function isRecord(value: unknown): value is JsonRecord {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
	if (typeof value !== "string" || value.trim().length === 0) {
		throw new Error(`Pond Paddlers response is missing ${field}.`);
	}
	return value.trim();
}

function requiredNonnegativeInteger(value: unknown, field: string): number {
	if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
		throw new Error(`Pond Paddlers response has an invalid ${field}.`);
	}
	return value;
}

function requiredPositiveInteger(value: unknown, field: string): number {
	const number = requiredNonnegativeInteger(value, field);
	if (number === 0) {
		throw new Error(`Pond Paddlers response has an invalid ${field}.`);
	}
	return number;
}

function normalizeQuestion(value: unknown): PondPaddlersQuestion {
	if (!isRecord(value)) {
		throw new Error("Pond Paddlers response is missing a question.");
	}
	return {
		questionID: requiredString(value.questionID, "question.questionID"),
		prompt: requiredString(value.prompt, "question.prompt")
	};
}

function normalizeStatus(value: unknown): PondPaddlersRoomStatus {
	if (
		value !== "closed" &&
		value !== "finished" &&
		value !== "racing" &&
		value !== "waiting"
	) {
		throw new Error("Pond Paddlers response has an invalid room status.");
	}
	return value;
}

function normalizePlayer(value: unknown): PondPaddler {
	if (!isRecord(value)) {
		throw new Error("Pond Paddlers response has an invalid paddler.");
	}
	return {
		alias: requiredString(value.alias, "player.alias"),
		progress: requiredNonnegativeInteger(value.progress, "player.progress")
	};
}

function normalizeState(value: unknown): PondPaddlersPublicState {
	if (!isRecord(value) || !Array.isArray(value.players)) {
		throw new Error("Pond Paddlers response has an invalid race state.");
	}
	return {
		finishAt: requiredPositiveInteger(value.finishAt, "finishAt"),
		players: value.players.map(normalizePlayer),
		status: normalizeStatus(value.status)
	};
}

async function errorForResponse(response: Response): Promise<Error> {
	const fallback =
		response.status === 404
			? "That room was not found. Check the code and try again."
			: response.status === 409
				? "That race is not accepting paddlers right now."
				: response.status === 410
					? "That race has ended. Ask Julio for a new room code."
					: response.status === 429
						? "Please wait a moment, then try again."
						: "Pond Paddlers could not connect. Please try again.";

	return new PondPaddlersRequestError(fallback, response.status);
}

function normalizedRoomCode(roomCode: string): string {
	return roomCode.trim().toUpperCase();
}

function requestHeaders(): HeadersInit {
	return {
		"Content-Type": "application/json",
		"X-Classroom-Request": "1"
	};
}

function normalizeJoinResult(
	payload: unknown,
	roomCode: string
): PondPaddlersJoinResult {
	if (!isRecord(payload))
		throw new Error("Pond Paddlers returned an invalid room.");

	return {
		alias: requiredString(payload.alias, "alias"),
		calmMode: payload.calmMode === true,
		expiresAt: requiredString(payload.expiresAt, "expiresAt"),
		question:
			payload.question === null
				? null
				: normalizeQuestion(payload.question),
		resumed: payload.resumed === true,
		roomCode,
		state: normalizeState(payload.state)
	};
}

export async function joinPondPaddlersRoom(
	roomCode: string,
	signal?: AbortSignal
): Promise<PondPaddlersJoinResult> {
	const code = normalizedRoomCode(roomCode);
	const response = await globalThis.fetch(
		`/api/pond-paddlers/rooms/${encodeURIComponent(code)}/join`,
		{
			cache: "no-store",
			credentials: "same-origin",
			headers: requestHeaders(),
			method: "POST",
			signal
		}
	);
	if (!response.ok) throw await errorForResponse(response);

	return normalizeJoinResult((await response.json()) as unknown, code);
}

export async function resumePondPaddlersRoom(
	roomCode: string,
	signal?: AbortSignal
): Promise<PondPaddlersJoinResult> {
	const code = normalizedRoomCode(roomCode);
	const response = await globalThis.fetch(
		`/api/pond-paddlers/rooms/${encodeURIComponent(code)}/resume`,
		{
			cache: "no-store",
			credentials: "same-origin",
			headers: { "X-Classroom-Request": "1" },
			method: "GET",
			signal
		}
	);
	if (!response.ok) throw await errorForResponse(response);

	return normalizeJoinResult((await response.json()) as unknown, code);
}

export async function answerPondPaddlersQuestion(
	roomCode: string,
	questionID: string,
	answer: number,
	signal?: AbortSignal
): Promise<PondPaddlersAnswerResult> {
	const code = normalizedRoomCode(roomCode);
	const response = await globalThis.fetch(
		`/api/pond-paddlers/rooms/${encodeURIComponent(code)}/answer`,
		{
			body: JSON.stringify({ answer, questionID }),
			cache: "no-store",
			credentials: "same-origin",
			headers: requestHeaders(),
			method: "POST",
			signal
		}
	);
	if (!response.ok) throw await errorForResponse(response);

	const payload = (await response.json()) as unknown;
	if (!isRecord(payload)) {
		throw new Error("Pond Paddlers returned an invalid answer result.");
	}

	return {
		correct: payload.correct === true,
		finished: payload.finished === true,
		nextQuestion:
			payload.nextQuestion === null
				? null
				: normalizeQuestion(payload.nextQuestion),
		progress: requiredNonnegativeInteger(payload.progress, "progress")
	};
}

export function parsePondPaddlersEvent(
	data: string
): PondPaddlersPublicState | null {
	let payload: unknown;
	try {
		payload = JSON.parse(data) as unknown;
	} catch {
		return null;
	}

	try {
		return normalizeState(payload);
	} catch {
		return null;
	}
}

export function connectPondPaddlersEvents(
	roomCode: string,
	handlers: PondPaddlersEventHandlers
): PondPaddlersEventConnection {
	if (typeof globalThis.EventSource === "undefined") {
		handlers.onError();
		return { close: () => undefined };
	}

	const code = normalizedRoomCode(roomCode);
	const source = new globalThis.EventSource(
		`/api/pond-paddlers/rooms/${encodeURIComponent(code)}/events`,
		{ withCredentials: true }
	);
	const handleState = (event: MessageEvent<string>) => {
		const state = parsePondPaddlersEvent(event.data);
		if (state) handlers.onState(state);
	};

	source.onopen = handlers.onOpen;
	source.onerror = handlers.onError;
	source.onmessage = handleState;
	source.addEventListener("state", handleState as EventListener);

	return { close: () => source.close() };
}
