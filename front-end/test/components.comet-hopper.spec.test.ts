import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CometHopperGame from "@/components/games/CometHopperGame.vue";

const cometSource = readFileSync(
	resolve(import.meta.dirname, "../src/components/games/CometHopperGame.vue"),
	"utf8"
);

function canvasContextStub() {
	return {
		addColorStop: vi.fn(),
		arc: vi.fn(),
		beginPath: vi.fn(),
		clearRect: vi.fn(),
		closePath: vi.fn(),
		createLinearGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
		ellipse: vi.fn(),
		fill: vi.fn(),
		fillRect: vi.fn(),
		fillText: vi.fn(),
		font: "",
		lineTo: vi.fn(),
		lineWidth: 1,
		moveTo: vi.fn(),
		restore: vi.fn(),
		rotate: vi.fn(),
		save: vi.fn(),
		stroke: vi.fn(),
		strokeStyle: "",
		textAlign: "start",
		translate: vi.fn()
	};
}

function mountGame() {
	return mount(CometHopperGame, {
		global: {
			stubs: {
				RouterLink: {
					props: ["to"],
					template: '<a :href="to"><slot /></a>'
				}
			}
		}
	});
}

function hopButton(wrapper: VueWrapper) {
	return wrapper.findAll(".move-button")[0];
}

function duckButton(wrapper: VueWrapper) {
	return wrapper.findAll(".move-button")[1];
}

describe("Comet Hopper trail behavior", () => {
	let documentHidden = false;
	let motionListener: ((event: MediaQueryListEvent) => void) | undefined;
	let motionQuery: MediaQueryList;
	let nextAnimationFrameId = 0;
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
		motionListener?.({ matches } as MediaQueryListEvent);
	}

	beforeEach(() => {
		documentHidden = false;
		motionListener = undefined;
		nextAnimationFrameId = 0;
		pendingFrames = new Map();
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			canvasContextStub() as unknown as CanvasRenderingContext2D
		);
		vi.spyOn(document, "hidden", "get").mockImplementation(
			() => documentHidden
		);
		vi.spyOn(window, "requestAnimationFrame").mockImplementation(
			callback => {
				nextAnimationFrameId += 1;
				pendingFrames.set(nextAnimationFrameId, callback);
				return nextAnimationFrameId;
			}
		);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(frameId => {
			pendingFrames.delete(frameId);
		});
		motionQuery = {
			addEventListener: vi.fn((type, listener) => {
				if (type === "change") {
					motionListener = listener as (
						event: MediaQueryListEvent
					) => void;
				}
			}),
			dispatchEvent: vi.fn(),
			matches: false,
			media: "(prefers-reduced-motion: reduce)",
			onchange: null,
			removeEventListener: vi.fn((type, listener) => {
				if (type === "change" && listener === motionListener) {
					motionListener = undefined;
				}
			})
		} as MediaQueryList;
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => motionQuery)
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("keeps movement controls honest and animates only an active trail", async () => {
		const wrapper = mountGame();

		expect(window.requestAnimationFrame).not.toHaveBeenCalled();
		expect(hopButton(wrapper).attributes("disabled")).toBeDefined();
		expect(duckButton(wrapper).attributes("disabled")).toBeDefined();
		expect(cometSource).not.toContain('@pointerdown="hop"');

		await wrapper.get(".primary-button").trigger("click");
		expect(wrapper.text()).toContain("Status: On the trail");
		expect(hopButton(wrapper).attributes("disabled")).toBeUndefined();
		expect(duckButton(wrapper).attributes("disabled")).toBeUndefined();
		expect(pendingFrames.size).toBe(1);

		runNextFrame(1_000);
		expect(pendingFrames.size).toBe(1);
		runNextFrame(1_016);
		expect(pendingFrames.size).toBe(1);

		await wrapper.get(".primary-button").trigger("click");
		expect(wrapper.text()).toContain("Status: Paused");
		expect(pendingFrames.size).toBe(0);
		expect(hopButton(wrapper).attributes("disabled")).toBeDefined();
		expect(duckButton(wrapper).attributes("disabled")).toBeDefined();
		wrapper.unmount();
	});

	it("stops for hidden tabs and responds to live motion changes", async () => {
		const wrapper = mountGame();
		await wrapper.get(".primary-button").trigger("click");
		expect(pendingFrames.size).toBe(1);

		documentHidden = true;
		document.dispatchEvent(new Event("visibilitychange"));
		await wrapper.vm.$nextTick();
		expect(wrapper.text()).toContain("Status: Paused");
		expect(wrapper.get(".trail-announcement").text()).toContain(
			"paused while this tab was away"
		);
		expect(pendingFrames.size).toBe(0);

		documentHidden = false;
		await wrapper.get(".primary-button").trigger("click");
		expect(pendingFrames.size).toBe(1);
		emitMotionPreference(true);
		await wrapper.vm.$nextTick();
		expect(
			wrapper.get(".comet-hopper").attributes("data-reduced-motion")
		).toBe("true");
		expect(wrapper.text()).toContain("Status: Your turn");
		expect(wrapper.get(".trail-guidance").text()).toContain("Moon rock");
		expect(pendingFrames.size).toBe(0);

		emitMotionPreference(false);
		await wrapper.vm.$nextTick();
		expect(
			wrapper.get(".comet-hopper").attributes("data-reduced-motion")
		).toBe("false");
		expect(pendingFrames.size).toBe(1);

		wrapper.unmount();
		expect(pendingFrames.size).toBe(0);
		expect(motionQuery.removeEventListener).toHaveBeenCalledWith(
			"change",
			expect.any(Function)
		);
	});

	it("announces deterministic obstacle guidance and an honest collision ending", async () => {
		Object.defineProperty(motionQuery, "matches", {
			configurable: true,
			value: true
		});
		const wrapper = mountGame();
		await wrapper.get(".primary-button").trigger("click");

		expect(window.requestAnimationFrame).not.toHaveBeenCalled();
		expect(wrapper.get(".trail-guidance").text()).toContain(
			"Moon rock ahead in 11 moves"
		);
		expect(hopButton(wrapper).attributes("aria-label")).toContain(
			"safe action hop"
		);
		expect(
			wrapper.get(".trail-canvas").attributes("aria-describedby")
		).toBe("comet-instructions comet-step-guidance comet-announcement");

		for (let move = 0; move < 10; move += 1) {
			await duckButton(wrapper).trigger("click");
		}
		expect(wrapper.get(".trail-guidance").text()).toContain(
			"Moon rock reaches the comet on the next move. Choose Hop."
		);
		expect(hopButton(wrapper).attributes("aria-label")).toContain(
			"safe now"
		);
		expect(duckButton(wrapper).attributes("aria-label")).toContain(
			"not safe now"
		);

		await duckButton(wrapper).trigger("click");
		expect(wrapper.text()).toContain("Status: Trail ended");
		expect(wrapper.get(".trail-announcement").text()).toContain(
			"A moon rock ended this run."
		);
		expect(wrapper.get(".trail-announcement").text()).not.toContain(
			"Trail complete"
		);
		expect(hopButton(wrapper).attributes("disabled")).toBeDefined();
		expect(duckButton(wrapper).attributes("disabled")).toBeDefined();

		await wrapper.get(".primary-button").trigger("click");
		let seedCrossed = false;
		for (let move = 0; move < 40; move += 1) {
			const guidance = wrapper.get(".trail-guidance").text();
			if (
				guidance.includes(
					"Orbiting seed reaches the comet on the next move"
				)
			) {
				expect(duckButton(wrapper).attributes("aria-label")).toContain(
					"safe now"
				);
				expect(hopButton(wrapper).attributes("aria-label")).toContain(
					"not safe now"
				);
				await duckButton(wrapper).trigger("click");
				seedCrossed = true;
				break;
			}
			await hopButton(wrapper).trigger("click");
		}
		expect(seedCrossed).toBe(true);
		expect(wrapper.text()).toContain("Status: Your turn");
		wrapper.unmount();
	});

	it("keeps every trail value browser-local and untracked", () => {
		expect(cometSource).not.toMatch(
			/localStorage|sessionStorage|fetch\s*\(|sendBeacon|XMLHttpRequest|analytics|studentSession|studentAccount/
		);
	});
});
