import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MachineWorkshopGame from "@/components/games/MachineWorkshopGame.vue";

const machineSource = readFileSync(
	resolve(
		import.meta.dirname,
		"../src/components/games/MachineWorkshopGame.vue"
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
		rotate: vi.fn(),
		save: vi.fn(),
		shadowBlur: 0,
		shadowColor: "",
		stroke: vi.fn(),
		strokeStyle: "",
		textAlign: "start",
		translate: vi.fn()
	};
}

function mountWorkshop() {
	return mount(MachineWorkshopGame, {
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

function buttonNamed(wrapper: VueWrapper, name: string) {
	const button = wrapper
		.findAll("button")
		.find(candidate => candidate.text().includes(name));
	if (!button) throw new Error(`Could not find ${name} button`);
	return button;
}

describe("Machine Workshop repair missions", () => {
	let context: ReturnType<typeof canvasContextStub>;
	let documentIsHidden: boolean;
	let frameCallbacks: Map<number, FrameRequestCallback>;
	let motionChangeHandler: ((event: MediaQueryListEvent) => void) | null;
	let mediaQuery: MediaQueryList;
	let nextFrameId: number;

	function runNextFrame(timestamp: number) {
		const nextFrame = frameCallbacks.entries().next().value;
		if (!nextFrame) throw new Error("No animation frame is pending");
		const [frameId, callback] = nextFrame;
		frameCallbacks.delete(frameId);
		callback(timestamp);
	}

	function primaryGearAngle() {
		const angle = context.rotate.mock.calls[9]?.[0];
		if (typeof angle !== "number") {
			throw new Error("The primary gear was not drawn");
		}
		return angle;
	}

	beforeEach(() => {
		context = canvasContextStub();
		documentIsHidden = false;
		frameCallbacks = new Map();
		motionChangeHandler = null;
		nextFrameId = 0;
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			context as unknown as CanvasRenderingContext2D
		);
		vi.spyOn(window, "requestAnimationFrame").mockImplementation(
			callback => {
				nextFrameId += 1;
				frameCallbacks.set(nextFrameId, callback);
				return nextFrameId;
			}
		);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(frameId => {
			frameCallbacks.delete(frameId);
		});
		vi.spyOn(document, "hidden", "get").mockImplementation(
			() => documentIsHidden
		);
		mediaQuery = {
			addEventListener: vi.fn((eventName, listener) => {
				if (eventName === "change" && typeof listener === "function") {
					motionChangeHandler = listener as (
						event: MediaQueryListEvent
					) => void;
				}
			}),
			dispatchEvent: vi.fn(),
			matches: false,
			media: "(prefers-reduced-motion: reduce)",
			onchange: null,
			removeEventListener: vi.fn()
		} as MediaQueryList;
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => mediaQuery)
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("runs the Simple repair in order while every station still responds", async () => {
		const storageSpy = vi.spyOn(Storage.prototype, "setItem");
		const networkSpy = vi.fn();
		vi.stubGlobal("fetch", networkSpy);
		const wrapper = mountWorkshop();

		expect(wrapper.findAll(".mission-picker button")).toHaveLength(3);
		expect(wrapper.get(".mission-summary h2").text()).toBe(
			"Next: Gear train"
		);
		expect(wrapper.get("progress").attributes("max")).toBe("4");
		expect(wrapper.get("progress").attributes("value")).toBe("0");

		await buttonNamed(wrapper, "Energy wheel").trigger("click");
		expect(
			wrapper.get(".workshop-canvas").attributes("data-energy-level")
		).toBe("1");
		expect(buttonNamed(wrapper, "Energy wheel").text()).toContain(
			"Charge 1 / 5"
		);
		expect(wrapper.get("progress").attributes("value")).toBe("0");
		expect(wrapper.get(".workshop-announcement").text()).toContain(
			"still needs Gear train next"
		);

		context.rotate.mockClear();
		await buttonNamed(wrapper, "Gear train").trigger("click");
		expect(
			wrapper.get(".workshop-canvas").attributes("data-gear-turns")
		).toBe("1");
		expect(
			context.rotate.mock.calls.some(
				([angle]) => Math.abs(angle - 0.55) < 0.001
			)
		).toBe(true);
		expect(wrapper.get("progress").attributes("value")).toBe("1");
		expect(wrapper.get(".mission-summary h2").text()).toBe(
			"Next: Memory lights"
		);

		await buttonNamed(wrapper, "Memory lights").trigger("click");
		await buttonNamed(wrapper, "Signal sorter").trigger("click");
		await buttonNamed(wrapper, "Energy wheel").trigger("click");

		expect(
			wrapper.get(".mission-card").attributes("data-mission-complete")
		).toBe("true");
		expect(wrapper.get(".mission-summary h2").text()).toBe(
			"Repair complete!"
		);
		expect(wrapper.get("progress").attributes("value")).toBe("4");
		expect(wrapper.findAll(".mission-steps li.done")).toHaveLength(4);
		expect(storageSpy).not.toHaveBeenCalled();
		expect(networkSpy).not.toHaveBeenCalled();
		wrapper.unmount();
	});

	it("switches deterministically between Middle and Advanced missions", async () => {
		const wrapper = mountWorkshop();
		await buttonNamed(wrapper, "Gear train").trigger("click");
		expect(wrapper.get("progress").attributes("value")).toBe("1");

		await buttonNamed(wrapper, "Simple").trigger("click");
		expect(wrapper.get("progress").attributes("value")).toBe("1");
		expect(
			wrapper.get(".workshop-canvas").attributes("data-gear-turns")
		).toBe("1");

		await buttonNamed(wrapper, "Middle").trigger("click");
		expect(wrapper.get("progress").attributes("max")).toBe("6");
		expect(wrapper.get(".mission-summary h2").text()).toBe(
			"Next: Energy wheel"
		);
		await buttonNamed(wrapper, "Energy wheel").trigger("click");
		expect(wrapper.get("progress").attributes("value")).toBe("1");

		await buttonNamed(wrapper, "Advanced").trigger("click");
		expect(wrapper.get("progress").attributes("max")).toBe("8");
		expect(wrapper.get("progress").attributes("value")).toBe("0");
		expect(wrapper.get(".mission-summary h2").text()).toBe(
			"Next: Memory lights"
		);
		expect(
			wrapper.get(".workshop-canvas").attributes("data-energy-level")
		).toBe("0");
		wrapper.unmount();
	});

	it("labels its mission controls and keeps the canvas out of keyboard order", () => {
		const wrapper = mountWorkshop();

		expect(wrapper.get(".mission-picker").attributes("role")).toBe("group");
		expect(wrapper.get(".station-controls").attributes("role")).toBe(
			"group"
		);
		expect(wrapper.get("progress").attributes("aria-labelledby")).toBe(
			"machine-mission-progress-label"
		);
		expect(wrapper.get("#machine-mission-progress-label").text()).toContain(
			"Progress: 0 of 4"
		);
		expect(
			wrapper.get(".workshop-canvas").attributes("tabindex")
		).toBeUndefined();
		expect(
			wrapper.get(".workshop-canvas").attributes("aria-describedby")
		).toBe("machine-workshop-instructions machine-workshop-announcement");
		wrapper.unmount();
	});

	it("starts lazily and excludes hidden time from its animation phase", async () => {
		const wrapper = mountWorkshop();

		expect(window.requestAnimationFrame).not.toHaveBeenCalled();
		await buttonNamed(wrapper, "Memory lights").trigger("click");
		expect(window.requestAnimationFrame).not.toHaveBeenCalled();

		await buttonNamed(wrapper, "Gear train").trigger("click");
		expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
		expect(frameCallbacks.size).toBe(1);

		context.rotate.mockClear();
		runNextFrame(1_000);
		expect(primaryGearAngle()).toBeCloseTo(0.55, 5);
		context.rotate.mockClear();
		runNextFrame(1_050);
		const angleBeforeHiding = primaryGearAngle();
		expect(angleBeforeHiding).toBeCloseTo(0.556, 5);

		documentIsHidden = true;
		document.dispatchEvent(new Event("visibilitychange"));
		expect(frameCallbacks.size).toBe(0);
		expect(window.cancelAnimationFrame).toHaveBeenCalled();

		documentIsHidden = false;
		document.dispatchEvent(new Event("visibilitychange"));
		expect(frameCallbacks.size).toBe(1);
		context.rotate.mockClear();
		runNextFrame(100_000);
		expect(primaryGearAngle()).toBeCloseTo(angleBeforeHiding, 5);

		await buttonNamed(wrapper, "Reset workshop").trigger("click");
		expect(frameCallbacks.size).toBe(0);
		expect(
			wrapper.get(".workshop-canvas").attributes("data-gear-turns")
		).toBe("0");
		wrapper.unmount();
	});

	it("responds to live reduced-motion changes and removes its listener", async () => {
		const wrapper = mountWorkshop();
		await buttonNamed(wrapper, "Gear train").trigger("click");
		expect(frameCallbacks.size).toBe(1);
		expect(motionChangeHandler).not.toBeNull();

		motionChangeHandler?.({ matches: true } as MediaQueryListEvent);
		await wrapper.vm.$nextTick();
		expect(
			wrapper.get(".machine-workshop").attributes("data-reduced-motion")
		).toBe("true");
		expect(wrapper.text()).toContain("Motion stays still between choices");
		expect(frameCallbacks.size).toBe(0);

		const frameRequestCount = vi.mocked(window.requestAnimationFrame).mock
			.calls.length;
		await buttonNamed(wrapper, "Gear train").trigger("click");
		expect(window.requestAnimationFrame).toHaveBeenCalledTimes(
			frameRequestCount
		);

		motionChangeHandler?.({ matches: false } as MediaQueryListEvent);
		await wrapper.vm.$nextTick();
		expect(
			wrapper.get(".machine-workshop").attributes("data-reduced-motion")
		).toBe("false");
		expect(frameCallbacks.size).toBe(1);

		wrapper.unmount();
		expect(mediaQuery.removeEventListener).toHaveBeenCalledWith(
			"change",
			expect.any(Function)
		);
		expect(frameCallbacks.size).toBe(0);
	});

	it("keeps station operations visible when reduced motion is requested", async () => {
		vi.mocked(window.matchMedia).mockReturnValue({
			addEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
			matches: true,
			media: "(prefers-reduced-motion: reduce)",
			onchange: null,
			removeEventListener: vi.fn()
		} as MediaQueryList);
		const wrapper = mountWorkshop();

		expect(window.requestAnimationFrame).not.toHaveBeenCalled();
		context.rotate.mockClear();
		await buttonNamed(wrapper, "Gear train").trigger("click");
		expect(buttonNamed(wrapper, "Gear train").text()).toContain("Turns 1");
		expect(
			context.rotate.mock.calls.some(
				([angle]) => Math.abs(angle - 0.55) < 0.001
			)
		).toBe(true);
		expect(window.requestAnimationFrame).not.toHaveBeenCalled();
		wrapper.unmount();
	});

	it("contains no persistence, account, network, or analytics hooks", () => {
		expect(machineSource).not.toMatch(
			/localStorage|sessionStorage|fetch\s*\(|sendBeacon|XMLHttpRequest|analytics|studentSession|studentAccount/
		);
	});
});
