import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PondPaddlersGame from "@/components/PondPaddlersGame.vue";
import {
	answerPondPaddlersQuestion,
	connectPondPaddlersEvents,
	joinPondPaddlersRoom,
	resumePondPaddlersRoom
} from "@/modules/pondPaddlers";

vi.mock("@/modules/pondPaddlers", () => ({
	answerPondPaddlersQuestion: vi.fn(),
	connectPondPaddlersEvents: vi.fn(),
	joinPondPaddlersRoom: vi.fn(),
	resumePondPaddlersRoom: vi.fn()
}));

describe("PondPaddlersGame", () => {
	const close = vi.fn();
	let eventHandlers: Parameters<typeof connectPondPaddlersEvents>[1];

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(joinPondPaddlersRoom).mockResolvedValue({
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
		vi.mocked(connectPondPaddlersEvents).mockImplementation(
			(_, handlers) => {
				eventHandlers = handlers;
				return { close };
			}
		);
		vi.mocked(resumePondPaddlersRoom).mockResolvedValue({
			alias: "Sunny Mallard",
			calmMode: false,
			expiresAt: "2026-08-02T00:00:00.000Z",
			question: { prompt: "8 ÷ 2", questionID: "question-start" },
			resumed: true,
			roomCode: "ABCD2345",
			state: {
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "racing"
			}
		});
	});

	function mountGame() {
		return mount(PondPaddlersGame, {
			global: {
				stubs: {
					RouterLink: { template: "<a><slot /></a>" }
				}
			}
		});
	}

	it("joins using only a room code and receives an automatic alias", async () => {
		const wrapper = mountGame();

		expect(wrapper.get("h1").text()).toBe("Pond Paddlers");
		expect(wrapper.find('input[name="name"]').exists()).toBe(false);
		expect(wrapper.text()).not.toMatch(/chat|email/i);
		expect(wrapper.get(".join-form__privacy").text()).toContain(
			"not linked to a student account"
		);
		expect(wrapper.get("#pond-room-code").attributes("aria-describedby")).toContain(
			"pond-room-privacy"
		);
		expect(wrapper.get("#pond-room-code").attributes("maxlength")).toBe(
			"8"
		);
		expect(wrapper.get("#pond-room-code").attributes("minlength")).toBe(
			"8"
		);
		await wrapper.get("#pond-room-code").setValue(" abcd2345 ");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		expect(joinPondPaddlersRoom).toHaveBeenCalledWith(
			"ABCD2345",
			expect.any(AbortSignal)
		);
		expect(wrapper.text()).toContain("Paddler Sunny Mallard");
		expect(wrapper.text()).toContain("3 + 4");
		expect(wrapper.get("#pond-answer").attributes("inputmode")).toBe(
			"numeric"
		);
		expect(connectPondPaddlersEvents).toHaveBeenCalledWith(
			"ABCD2345",
			expect.any(Object)
		);
	});

	it("waits in the lobby and loads the private question only after Julio starts", async () => {
		vi.mocked(joinPondPaddlersRoom).mockResolvedValueOnce({
			alias: "Sunny Mallard",
			calmMode: true,
			expiresAt: "2026-08-02T00:00:00.000Z",
			question: null,
			resumed: false,
			roomCode: "ABCD2345",
			state: {
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "waiting"
			}
		});
		vi.mocked(resumePondPaddlersRoom).mockResolvedValueOnce({
			alias: "Sunny Mallard",
			calmMode: true,
			expiresAt: "2026-08-02T00:00:00.000Z",
			question: { prompt: "8 ÷ 2", questionID: "question-start" },
			resumed: true,
			roomCode: "ABCD2345",
			state: {
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "racing"
			}
		});
		const wrapper = mount(PondPaddlersGame, {
			attachTo: document.body,
			global: {
				stubs: {
					RouterLink: { template: "<a><slot /></a>" }
				}
			}
		});

		try {
			await wrapper.get("#pond-room-code").setValue("ABCD2345");
			await wrapper.get("form").trigger("submit.prevent");
			await flushPromises();

			const lobby = wrapper.get(".lobby-panel");
			expect(lobby.attributes("role")).toBe("status");
			expect(lobby.attributes("aria-atomic")).toBe("true");
			expect(wrapper.text()).toContain(
				"Waiting for Julio to start the race"
			);
			expect(wrapper.text()).toContain("1 paddler ready");
			expect(wrapper.find("#pond-answer").exists()).toBe(false);
			expect(answerPondPaddlersQuestion).not.toHaveBeenCalled();
			expect(document.activeElement).toBe(lobby.element);

			eventHandlers.onState({
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "racing"
			});
			await flushPromises();

			expect(joinPondPaddlersRoom).toHaveBeenCalledTimes(1);
			expect(resumePondPaddlersRoom).toHaveBeenCalledWith(
				"ABCD2345",
				expect.any(AbortSignal)
			);
			expect(wrapper.text()).toContain(
				"The race has started! Solve your first question."
			);
			expect(wrapper.text()).toContain("8 ÷ 2");
			expect(document.activeElement).toBe(
				wrapper.get("#pond-answer").element
			);
		} finally {
			wrapper.unmount();
		}
	});

	it("offers a focused Retry action when the private question handoff fails", async () => {
		vi.mocked(joinPondPaddlersRoom).mockResolvedValueOnce({
			alias: "Sunny Mallard",
			calmMode: true,
			expiresAt: "2026-08-02T00:00:00.000Z",
			question: null,
			resumed: false,
			roomCode: "ABCD2345",
			state: {
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "waiting"
			}
		});
		vi.mocked(resumePondPaddlersRoom)
			.mockRejectedValueOnce(new Error("simulated handoff failure"))
			.mockResolvedValueOnce({
				alias: "Sunny Mallard",
				calmMode: true,
				expiresAt: "2026-08-02T00:00:00.000Z",
				question: { prompt: "8 ÷ 2", questionID: "question-retry" },
				resumed: true,
				roomCode: "ABCD2345",
				state: {
					finishAt: 10,
					players: [{ alias: "Sunny Mallard", progress: 0 }],
					status: "racing"
				}
			});
		const wrapper = mount(PondPaddlersGame, {
			attachTo: document.body,
			global: {
				stubs: { RouterLink: { template: "<a><slot /></a>" } }
			}
		});

		try {
			await wrapper.get("#pond-room-code").setValue("ABCD2345");
			await wrapper.get("form").trigger("submit.prevent");
			await flushPromises();
			eventHandlers.onState({
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "racing"
			});
			await flushPromises();

			const retry = wrapper.get("button.site-button--secondary");
			expect(wrapper.text()).toContain(
				"Your question did not load. Please try again."
			);
			expect(retry.text()).toBe("Retry question");
			expect(document.activeElement).toBe(retry.element);

			await retry.trigger("click");
			await flushPromises();
			expect(resumePondPaddlersRoom).toHaveBeenCalledTimes(2);
			expect(wrapper.text()).toContain("8 ÷ 2");
			expect(document.activeElement).toBe(
				wrapper.get("#pond-answer").element
			);
		} finally {
			wrapper.unmount();
		}
	});

	it("keeps newer live progress when an older racing handoff resolves", async () => {
		let resolveHandoff:
			| ((
					result: Awaited<ReturnType<typeof resumePondPaddlersRoom>>
			  ) => void)
			| undefined;
		vi.mocked(joinPondPaddlersRoom).mockResolvedValueOnce({
			alias: "Sunny Mallard",
			calmMode: true,
			expiresAt: "2026-08-02T00:00:00.000Z",
			question: null,
			resumed: false,
			roomCode: "ABCD2345",
			state: {
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "waiting"
			}
		});
		vi.mocked(resumePondPaddlersRoom).mockImplementationOnce(
			() =>
				new Promise(resolve => {
					resolveHandoff = resolve;
				})
		);
		const wrapper = mountGame();
		await wrapper.get("#pond-room-code").setValue("ABCD2345");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();
		eventHandlers.onState({
			finishAt: 10,
			players: [{ alias: "Sunny Mallard", progress: 0 }],
			status: "racing"
		});
		await flushPromises();
		eventHandlers.onState({
			finishAt: 10,
			players: [
				{ alias: "Sunny Mallard", progress: 4 },
				{ alias: "Blue Teal", progress: 7 }
			],
			status: "racing"
		});
		await flushPromises();

		resolveHandoff?.({
			alias: "Sunny Mallard",
			calmMode: true,
			expiresAt: "2026-08-02T00:00:00.000Z",
			question: { prompt: "9 + 9", questionID: "delayed-question" },
			resumed: true,
			roomCode: "ABCD2345",
			state: {
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 1 }],
				status: "racing"
			}
		});
		await flushPromises();

		expect(wrapper.text()).toContain("9 + 9");
		expect(wrapper.text()).toContain("Sunny Mallard (you)");
		expect(wrapper.text()).toContain("4 of 10 questions");
		expect(wrapper.text()).toContain("Blue Teal");
		expect(wrapper.text()).toContain("7 of 10 questions");
	});

	it.each(["finished", "closed"] as const)(
		"does not reopen a %s race when a delayed handoff resolves",
		async terminalStatus => {
			let resolveHandoff:
				| ((
						result: Awaited<
							ReturnType<typeof resumePondPaddlersRoom>
						>
				  ) => void)
				| undefined;
			vi.mocked(joinPondPaddlersRoom).mockResolvedValueOnce({
				alias: "Sunny Mallard",
				calmMode: true,
				expiresAt: "2026-08-02T00:00:00.000Z",
				question: null,
				resumed: false,
				roomCode: "ABCD2345",
				state: {
					finishAt: 10,
					players: [{ alias: "Sunny Mallard", progress: 0 }],
					status: "waiting"
				}
			});
			vi.mocked(resumePondPaddlersRoom).mockImplementationOnce(
				() =>
					new Promise(resolve => {
						resolveHandoff = resolve;
					})
			);
			const wrapper = mountGame();
			await wrapper.get("#pond-room-code").setValue("ABCD2345");
			await wrapper.get("form").trigger("submit.prevent");
			await flushPromises();
			eventHandlers.onState({
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "racing"
			});
			await flushPromises();
			eventHandlers.onState({
				finishAt: 10,
				players: [
					{ alias: "Sunny Mallard", progress: 4 },
					{ alias: "Blue Teal", progress: 10 }
				],
				status: terminalStatus
			});
			await flushPromises();

			resolveHandoff?.({
				alias: "Sunny Mallard",
				calmMode: true,
				expiresAt: "2026-08-02T00:00:00.000Z",
				question: { prompt: "9 + 9", questionID: "stale-question" },
				resumed: true,
				roomCode: "ABCD2345",
				state: {
					finishAt: 10,
					players: [{ alias: "Sunny Mallard", progress: 0 }],
					status: "racing"
				}
			});
			await flushPromises();

			expect(wrapper.find("#pond-answer").exists()).toBe(false);
			expect(wrapper.text()).not.toContain("9 + 9");
			expect(wrapper.text()).not.toContain("Getting your first question");
			expect(wrapper.text()).toContain(
				terminalStatus === "closed"
					? "This room has closed"
					: "The race is finished"
			);
		}
	);

	it("applies a finished state returned by the private handoff", async () => {
		vi.mocked(joinPondPaddlersRoom).mockResolvedValueOnce({
			alias: "Sunny Mallard",
			calmMode: true,
			expiresAt: "2026-08-02T00:00:00.000Z",
			question: null,
			resumed: false,
			roomCode: "ABCD2345",
			state: {
				finishAt: 10,
				players: [{ alias: "Sunny Mallard", progress: 0 }],
				status: "waiting"
			}
		});
		vi.mocked(resumePondPaddlersRoom).mockResolvedValueOnce({
			alias: "Sunny Mallard",
			calmMode: true,
			expiresAt: "2026-08-02T00:00:00.000Z",
			question: null,
			resumed: true,
			roomCode: "ABCD2345",
			state: {
				finishAt: 10,
				players: [
					{ alias: "Sunny Mallard", progress: 4 },
					{ alias: "Blue Teal", progress: 10 }
				],
				status: "finished"
			}
		});
		const wrapper = mountGame();
		await wrapper.get("#pond-room-code").setValue("ABCD2345");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();
		eventHandlers.onState({
			finishAt: 10,
			players: [{ alias: "Sunny Mallard", progress: 0 }],
			status: "racing"
		});
		await flushPromises();

		expect(wrapper.text()).toContain("The race is finished");
		expect(wrapper.find("#pond-answer").exists()).toBe(false);
		expect(wrapper.text()).not.toContain("Getting your first question");
	});

	it("moves the paddler after a correct answer and shows the next question", async () => {
		vi.mocked(answerPondPaddlersQuestion).mockResolvedValue({
			correct: true,
			finished: false,
			nextQuestion: { prompt: "8 ÷ 2", questionID: "question-2" },
			progress: 3
		});
		const wrapper = mountGame();
		await wrapper.get("#pond-room-code").setValue("ABCD2345");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		await wrapper.get("#pond-answer").setValue("7");
		await wrapper.get(".question-panel").trigger("submit.prevent");
		await flushPromises();

		expect(answerPondPaddlersQuestion).toHaveBeenCalledWith(
			"ABCD2345",
			"question-1",
			7,
			expect.any(AbortSignal)
		);
		expect(wrapper.text()).toContain(
			"Correct! Your paddler moved forward."
		);
		expect(wrapper.text()).toContain("8 ÷ 2");
		expect(wrapper.text()).toContain("3 of 10 questions");
	});

	it("clearly tells the first paddler that they won the finished race", async () => {
		vi.mocked(answerPondPaddlersQuestion).mockResolvedValue({
			correct: true,
			finished: true,
			nextQuestion: null,
			progress: 10
		});
		const wrapper = mountGame();
		await wrapper.get("#pond-room-code").setValue("ABCD2345");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		await wrapper.get("#pond-answer").setValue("7");
		await wrapper.get(".question-panel").trigger("submit.prevent");
		await flushPromises();

		expect(wrapper.text()).toContain("You won the race!");
		expect(wrapper.text()).toContain(
			"You were the first paddler across the pond."
		);
		expect(wrapper.text()).not.toContain("other paddlers finish");
	});

	it("renders live progress as text and handles a closed classroom room", async () => {
		const wrapper = mountGame();
		await wrapper.get("#pond-room-code").setValue("ABCD2345");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		eventHandlers.onState({
			finishAt: 10,
			players: [
				{ alias: "Sunny Mallard", progress: 2 },
				{ alias: "Blue Heron", progress: 6 }
			],
			status: "racing"
		});
		await flushPromises();
		expect(wrapper.text()).toContain("Blue Heron");
		expect(wrapper.text()).toContain("6 of 10 questions");

		eventHandlers.onState({
			finishAt: 10,
			players: [{ alias: "Sunny Mallard", progress: 2 }],
			status: "closed"
		});
		await flushPromises();
		expect(wrapper.text()).toContain("This room has closed");
		expect(wrapper.text()).toContain("Enter a new code");
		expect(wrapper.text()).toContain("Room closed");
		expect(close).toHaveBeenCalledOnce();
	});

	it("announces connection loss while the event stream reconnects", async () => {
		const wrapper = mountGame();
		await wrapper.get("#pond-room-code").setValue("ABCD2345");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		eventHandlers.onError();
		await flushPromises();
		expect(wrapper.text()).toContain("Reconnecting to race");
	});

	it("stops answers for non-winners when another paddler finishes", async () => {
		const wrapper = mountGame();
		await wrapper.get("#pond-room-code").setValue("ABCD2345");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		eventHandlers.onState({
			finishAt: 10,
			players: [
				{ alias: "Sunny Mallard", progress: 4 },
				{ alias: "Blue Heron", progress: 10 }
			],
			status: "finished"
		});
		await flushPromises();

		expect(wrapper.text()).toContain("The race is finished");
		expect(wrapper.text()).toContain("You answered 4 questions");
		expect(wrapper.find("#pond-answer").exists()).toBe(false);
		expect(answerPondPaddlersQuestion).not.toHaveBeenCalled();
	});

	it("aborts and ignores a late answer after leaving for another room", async () => {
		let answerSignal: AbortSignal | undefined;
		let resolveAnswer:
			| ((
					result: Awaited<
						ReturnType<typeof answerPondPaddlersQuestion>
					>
			  ) => void)
			| undefined;
		vi.mocked(answerPondPaddlersQuestion).mockImplementationOnce(
			(_roomCode, _questionID, _answer, signal) => {
				answerSignal = signal;
				return new Promise(resolve => {
					resolveAnswer = resolve;
				});
			}
		);
		const wrapper = mountGame();
		await wrapper.get("#pond-room-code").setValue("ABCD2345");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();
		await wrapper.get("#pond-answer").setValue("7");
		await wrapper.get(".question-panel").trigger("submit.prevent");
		await flushPromises();

		expect(answerSignal?.aborted).toBe(false);
		await wrapper.get(".leave-button").trigger("click");
		expect(answerSignal?.aborted).toBe(true);

		vi.mocked(joinPondPaddlersRoom).mockResolvedValueOnce({
			alias: "Blue Teal",
			calmMode: true,
			expiresAt: "2026-08-02T01:00:00.000Z",
			question: { prompt: "9 + 9", questionID: "question-new" },
			resumed: false,
			roomCode: "WXYZ6789",
			state: {
				finishAt: 5,
				players: [{ alias: "Blue Teal", progress: 0 }],
				status: "racing"
			}
		});
		await wrapper.get("#pond-room-code").setValue("WXYZ6789");
		await wrapper.get("form").trigger("submit.prevent");
		await flushPromises();

		resolveAnswer?.({
			correct: true,
			finished: false,
			nextQuestion: { prompt: "8 ÷ 2", questionID: "question-old-next" },
			progress: 4
		});
		await flushPromises();

		expect(wrapper.text()).toContain("Paddler Blue Teal");
		expect(wrapper.text()).toContain("9 + 9");
		expect(wrapper.text()).toContain("0 of 5 questions");
		expect(wrapper.text()).not.toContain("8 ÷ 2");
		expect(
			wrapper.get("#pond-answer").attributes("disabled")
		).toBeUndefined();
	});
});
