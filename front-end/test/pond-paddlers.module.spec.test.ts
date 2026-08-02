import { afterEach, describe, expect, it, vi } from "vitest";
import {
	answerPondPaddlersQuestion,
	connectPondPaddlersEvents,
	joinPondPaddlersRoom,
	parsePondPaddlersEvent
} from "@/modules/pondPaddlers";

class FakeEventSource {
	static instance: FakeEventSource | null = null;
	readonly listeners = new Map<string, EventListener>();
	closed = false;
	onerror: ((event: Event) => void) | null = null;
	onmessage: ((event: MessageEvent<string>) => void) | null = null;
	onopen: ((event: Event) => void) | null = null;

	constructor(
		readonly url: string,
		readonly options?: EventSourceInit
	) {
		FakeEventSource.instance = this;
	}

	addEventListener(type: string, listener: EventListener) {
		this.listeners.set(type, listener);
	}

	close() {
		this.closed = true;
	}
}

describe("Pond Paddlers client", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
		FakeEventSource.instance = null;
	});

	it("joins with a private room code and the seat cookie enabled", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					alias: "Sunny Mallard",
					calmMode: false,
					expiresAt: "2026-08-02T00:00:00.000Z",
					question: { prompt: "3 + 4", questionID: "question-1" },
					resumed: false,
					state: {
						finishAt: 10,
						players: [{ alias: "Sunny Mallard", progress: 0 }],
						status: "racing"
					}
				}),
				{ status: 200 }
			)
		);
		vi.stubGlobal("fetch", fetchMock);

		await expect(joinPondPaddlersRoom(" abcd2345 ")).resolves.toEqual({
			alias: "Sunny Mallard",
			calmMode: false,
			expiresAt: "2026-08-02T00:00:00.000Z",
			question: { prompt: "3 + 4", questionID: "question-1" },
			resumed: false,
			roomCode: "ABCD2345",
			state: {
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "racing"
			}
		});
		expect(fetchMock).toHaveBeenCalledWith(
			"/api/pond-paddlers/rooms/ABCD2345/join",
			expect.objectContaining({
				cache: "no-store",
				credentials: "same-origin",
				method: "POST"
			})
		);
	});

	it("submits only the question ID and numeric answer", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					correct: true,
					finished: false,
					nextQuestion: { prompt: "8 ÷ 2", questionID: "question-2" },
					progress: 25
				}),
				{ status: 200 }
			)
		);
		vi.stubGlobal("fetch", fetchMock);

		await answerPondPaddlersQuestion("ABCD2345", "question-1", 7);
		const request = fetchMock.mock.calls[0]?.[1] as RequestInit;
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			"/api/pond-paddlers/rooms/ABCD2345/answer"
		);
		expect(JSON.parse(String(request.body))).toEqual({
			answer: 7,
			questionID: "question-1"
		});
		expect(String(request.body)).not.toMatch(/alias|name|student/i);
	});

	it("never exposes backend error details to a student", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				new Response(
					JSON.stringify({
						message: "Internal database detail: /private/path"
					}),
					{ status: 404 }
				)
			)
		);

		await expect(joinPondPaddlersRoom("ABCD2345")).rejects.toThrow(
			"That room was not found. Check the code and try again."
		);
		await expect(joinPondPaddlersRoom("ABCD2345")).rejects.not.toThrow(
			/private|database/i
		);
	});

	it("keeps only aliases and question counts from public race state", () => {
		expect(
			parsePondPaddlersEvent(
				JSON.stringify({
					finishAt: 10,
					email: "must-not-pass-through@example.test",
					players: [
						{
							alias: "Blue Heron",
							progress: 4,
							project: "must-not-pass-through"
						}
					],
					status: "racing"
				})
			)
		).toEqual({
			finishAt: 10,
			players: [{ alias: "Blue Heron", progress: 4 }],
			status: "racing"
		});
	});

	it("opens a credentialed event stream and can close it", () => {
		vi.stubGlobal("EventSource", FakeEventSource);
		const handlers = {
			onError: vi.fn(),
			onOpen: vi.fn(),
			onState: vi.fn()
		};
		const connection = connectPondPaddlersEvents("ABCD2345", handlers);
		const source = FakeEventSource.instance;

		expect(source?.url).toBe("/api/pond-paddlers/rooms/ABCD2345/events");
		expect(source?.options).toEqual({ withCredentials: true });
		source?.onmessage?.(
			new MessageEvent("message", {
				data: JSON.stringify({
					finishAt: 10,
					players: [{ alias: "Sunny Mallard", progress: 2 }],
					status: "racing"
				})
			})
		);
		expect(handlers.onState).toHaveBeenCalledWith(
			expect.objectContaining({
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 2 }]
			})
		);

		connection.close();
		expect(source?.closed).toBe(true);
	});
});
