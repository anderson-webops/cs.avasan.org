import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CrosswalkCrittersGame from "@/components/games/CrosswalkCrittersGame.vue";

const crosswalkSource = readFileSync(
	resolve(
		import.meta.dirname,
		"../src/components/games/CrosswalkCrittersGame.vue"
	),
	"utf8"
);

function canvasContextStub() {
	return {
		arc: vi.fn(),
		beginPath: vi.fn(),
		clearRect: vi.fn(),
		closePath: vi.fn(),
		createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
		fill: vi.fn(),
		fillRect: vi.fn(),
		fillText: vi.fn(),
		font: "",
		lineTo: vi.fn(),
		lineWidth: 1,
		moveTo: vi.fn(),
		quadraticCurveTo: vi.fn(),
		restore: vi.fn(),
		save: vi.fn(),
		stroke: vi.fn(),
		strokeStyle: "",
		textAlign: "start"
	};
}

function mountGame() {
	return mount(CrosswalkCrittersGame, {
		global: {
			stubs: {
				RouterLink: {
					props: ["to"],
					template: '<a :href="to"><slot /></a>'
				}
			}
		}
	}) as VueWrapper;
}

function movementButton(wrapper: VueWrapper, action: string) {
	const button = wrapper
		.findAll(".direction-pad button")
		.find(candidate =>
			candidate.attributes("aria-label")?.startsWith(action)
		);
	if (!button) throw new Error(`Could not find ${action} control`);
	return button;
}

async function finishCurrentStageSafely(wrapper: VueWrapper) {
	const startingStage = wrapper.get(".crosswalk-game").attributes("data-stage");
	const actionPriority = [
		"Move Pip up",
		"Wait one traffic step",
		"Move Pip left",
		"Move Pip right",
		"Move Pip down"
	];

	for (let turn = 0; turn < 240; turn += 1) {
		const game = wrapper.get(".crosswalk-game");
		if (
			game.attributes("data-stage") !== startingStage ||
			wrapper.text().includes("Status: Meadow champion")
		) {
			return;
		}
		const safeControl = actionPriority
			.map(action => movementButton(wrapper, action))
			.find(button =>
				button.attributes("aria-label")?.endsWith("— clear")
			);
		if (!safeControl) throw new Error("No safe step was offered");
		await safeControl.trigger("click");
	}
	throw new Error("The deterministic safe-play helper did not finish the stage");
}

describe("Crosswalk Critters challenge stages", () => {
	let context: ReturnType<typeof canvasContextStub>;
	let motionListener: ((event: MediaQueryListEvent) => void) | undefined;
	let motionQuery: MediaQueryList;
	let nextAnimationFrameId: number;
	let pendingFrames: Map<number, FrameRequestCallback>;

	function runNextFrame(timestamp: number) {
		const nextFrame = [...pendingFrames.entries()].sort(
			([firstId], [secondId]) => firstId - secondId
		)[0];
		if (!nextFrame) throw new Error("No animation frame is pending");
		pendingFrames.delete(nextFrame[0]);
		nextFrame[1](timestamp);
	}

	function emitMotionPreference(matches: boolean) {
		Object.defineProperty(motionQuery, "matches", {
			configurable: true,
			value: matches
		});
		motionListener?.({ matches } as MediaQueryListEvent);
	}

	beforeEach(() => {
		context = canvasContextStub();
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			context as unknown as CanvasRenderingContext2D
		);
		nextAnimationFrameId = 0;
		pendingFrames = new Map();
		vi.spyOn(window, "requestAnimationFrame").mockImplementation(callback => {
			nextAnimationFrameId += 1;
			pendingFrames.set(nextAnimationFrameId, callback);
			return nextAnimationFrameId;
		});
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(frameId => {
			pendingFrames.delete(frameId);
		});
		motionQuery = {
			addEventListener: vi.fn((type, listener) => {
				if (type === "change")
					motionListener = listener as (
						event: MediaQueryListEvent
					) => void;
			}),
			dispatchEvent: vi.fn(),
			matches: false,
			media: "(prefers-reduced-motion: reduce)",
			onchange: null,
			removeEventListener: vi.fn((type, listener) => {
				if (type === "change" && listener === motionListener)
					motionListener = undefined;
			})
		} as MediaQueryList;
		vi.stubGlobal("matchMedia", vi.fn(() => motionQuery));
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("shows each challenge's score multiplier before play", () => {
		const wrapper = mountGame();
		const optionCopy = Object.fromEntries(
			wrapper
				.findAll(".challenge-picker .challenge-option")
				.map(option => [
					option.get("strong").text(),
					option.get("small").text()
				])
		);

		expect(optionCopy).toEqual({
			Advanced: "2 tries · fastest traffic · 3× score",
			Middle: "3 tries · busy traffic · 2× score",
			Simple: "5 tries · gentler traffic · 1× score"
		});
		wrapper.unmount();
	});

	it("offers deterministic challenges and immediate continuous collisions", async () => {
		const wrapper = mountGame();
		const game = wrapper.get(".crosswalk-game");
		const challengeRadios = wrapper.findAll(
			'input[name="crosswalk-challenge"]'
		);

		expect(challengeRadios).toHaveLength(3);
		expect(game.attributes("data-challenge")).toBe("simple");
		expect(game.attributes("data-traffic-count")).toBe("4");
		expect(game.attributes("data-traffic-mode")).toBe("continuous");
		expect(wrapper.findAll(".direction-pad button")).toHaveLength(4);

		await wrapper.get('input[value="advanced"]').setValue();
		await wrapper.get(".primary-button").trigger("click");
		expect(wrapper.get(".game-setup").attributes("style")).toContain(
			"display: none"
		);
		await movementButton(wrapper, "Move Pip up").trigger("click");
		await movementButton(wrapper, "Move Pip up").trigger("click");

		expect(wrapper.text()).toContain("Tries: 1");
		expect(wrapper.text()).toContain("Bump!");
		expect(wrapper.text()).toContain("Crossings: 0");
		expect(game.attributes("data-player-location")).toBe("starting curb");
		wrapper.unmount();
	});

	it("completes all stages through announced safe step-by-step play", async () => {
		const storageSpy = vi.spyOn(Storage.prototype, "setItem");
		const networkSpy = vi.fn();
		vi.stubGlobal("fetch", networkSpy);
		const wrapper = mountGame();

		await wrapper.get('input[value="step"]').setValue();
		expect(
			wrapper.get(".crosswalk-game").attributes("data-traffic-mode")
		).toBe("step");
		expect(wrapper.findAll(".direction-pad button")).toHaveLength(5);
		await wrapper.get(".primary-button").trigger("click");
		expect(window.requestAnimationFrame).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain("Location: starting curb");
		expect(movementButton(wrapper, "Move Pip up").attributes("aria-label")).toMatch(
			/— (clear|blocked)$/
		);

		const waitButton = movementButton(wrapper, "Wait one traffic step");
		expect(waitButton.attributes("disabled")).toBeUndefined();
		await waitButton.trigger("click");
		expect(wrapper.get(".game-announcement").text()).toContain(
			"waited safely at the starting curb"
		);

		await finishCurrentStageSafely(wrapper);
		expect(wrapper.text()).toContain("Stage: 2 of 3");
		expect(wrapper.text()).toContain("Score: 100");
		await finishCurrentStageSafely(wrapper);
		expect(wrapper.text()).toContain("Stage: 3 of 3");
		expect(wrapper.text()).toContain("Score: 200");
		await finishCurrentStageSafely(wrapper);

		expect(wrapper.text()).toContain("Status: Meadow champion");
		expect(wrapper.text()).toContain("Crossings: 3");
		expect(wrapper.text()).toContain("Score: 425");
		expect(wrapper.text()).toContain("Session best: 425");
		expect(storageSpy).not.toHaveBeenCalled();
		expect(networkSpy).not.toHaveBeenCalled();
		wrapper.unmount();
	});

	it("runs controllable frames and pauses safely for visibility and motion changes", async () => {
		const wrapper = mountGame();

		await wrapper.get(".primary-button").trigger("click");
		expect(pendingFrames.size).toBe(1);
		runNextFrame(1000);
		expect(pendingFrames.size).toBe(1);
		context.moveTo.mockClear();
		runNextFrame(1016);
		const firstCarMove = context.moveTo.mock.calls.find(
			([, y]) => Math.abs(y - 104) < 0.001
		);
		expect(firstCarMove?.[0]).toBeGreaterThan(-8);

		vi.spyOn(document, "hidden", "get").mockReturnValue(true);
		document.dispatchEvent(new Event("visibilitychange"));
		await wrapper.vm.$nextTick();
		expect(wrapper.text()).toContain("Status: Paused");
		expect(pendingFrames.size).toBe(0);

		await wrapper.get(".primary-button").trigger("click");
		expect(pendingFrames.size).toBe(1);
		emitMotionPreference(true);
		await wrapper.vm.$nextTick();
		expect(
			wrapper.get(".crosswalk-game").attributes("data-traffic-mode")
		).toBe("step");
		expect(wrapper.text()).toContain("Status: Your turn");
		expect(pendingFrames.size).toBe(0);
		expect(wrapper.find(".wait-button").exists()).toBe(true);

		emitMotionPreference(false);
		await wrapper.vm.$nextTick();
		expect(
			wrapper.get(".crosswalk-game").attributes("data-traffic-mode")
		).toBe("step");
		expect(pendingFrames.size).toBe(0);
		wrapper.unmount();
		expect(motionQuery.removeEventListener).toHaveBeenCalledWith(
			"change",
			expect.any(Function)
		);
	});

	it("honors reduced motion from mount and keeps the touch wait control available", async () => {
		Object.defineProperty(motionQuery, "matches", {
			configurable: true,
			value: true
		});
		const wrapper = mountGame();
		await wrapper.vm.$nextTick();

		expect(
			wrapper.get(".crosswalk-game").attributes("data-traffic-mode")
		).toBe("step");
		expect(
			wrapper.get('input[value="continuous"]').attributes("disabled")
		).toBeDefined();
		expect(wrapper.find(".wait-button").exists()).toBe(true);
		expect(wrapper.get(".wait-button").attributes("disabled")).toBeDefined();

		await wrapper.get(".primary-button").trigger("click");
		expect(wrapper.get(".wait-button").attributes("disabled")).toBeUndefined();
		expect(window.requestAnimationFrame).not.toHaveBeenCalled();
		wrapper.unmount();
	});

	it("keeps the keyboard surface visible and the play controls next to the board", () => {
		const wrapper = mountGame();
		const canvas = wrapper.get(".game-canvas");
		const panelChildren = [...wrapper.get(".game-panel").element.children];

		expect(canvas.attributes("role")).toBe("application");
		expect(crosswalkSource).toContain(".game-canvas:focus-visible");
		expect(panelChildren.indexOf(canvas.element)).toBeLessThan(
			panelChildren.indexOf(wrapper.get(".direction-pad").element)
		);
		expect(
			panelChildren.indexOf(wrapper.get(".direction-pad").element) -
				panelChildren.indexOf(canvas.element)
		).toBe(1);
		expect(crosswalkSource).not.toMatch(
			/localStorage|sessionStorage|fetch\s*\(|sendBeacon|XMLHttpRequest/
		);
		expect(crosswalkSource).toContain("touch-action: pan-y pinch-zoom");
		wrapper.unmount();
	});
});
