import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CometHopperGame from "@/components/games/CometHopperGame.vue";
import CrosswalkCrittersGame from "@/components/games/CrosswalkCrittersGame.vue";
import MachineWorkshopGame from "@/components/games/MachineWorkshopGame.vue";
import GamesPage from "@/pages/games/index.vue";

const crosswalkSource = readFileSync(
	resolve(import.meta.dirname, "../src/components/games/CrosswalkCrittersGame.vue"),
	"utf8"
);
const machineSource = readFileSync(
	resolve(import.meta.dirname, "../src/components/games/MachineWorkshopGame.vue"),
	"utf8"
);
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

function mountGame(component: Parameters<typeof mount>[0]) {
	return mount(component, {
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

describe("browser-local classroom games", () => {
	beforeEach(() => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
			canvasContextStub() as unknown as CanvasRenderingContext2D
		);
		vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);
		vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
		vi.stubGlobal(
			"matchMedia",
			vi.fn(() => ({
				addEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
				matches: false,
				media: "(prefers-reduced-motion: reduce)",
				onchange: null,
				removeEventListener: vi.fn()
			}))
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	it("supports keyboard and touch crossings without saving play data", async () => {
		const storageSpy = vi.spyOn(Storage.prototype, "setItem");
		const wrapper = mountGame(CrosswalkCrittersGame);

		expect(wrapper.get("h1").text()).toBe("Crosswalk Critters");
		expect(wrapper.get(".back-link").attributes("href")).toBe("/games");
		expect(wrapper.findAll(".direction-pad button")).toHaveLength(4);

		await wrapper.get(".primary-button").trigger("click");
		expect(wrapper.text()).toContain("Status: Crossing");

		for (let move = 0; move < 11; move += 1) {
			await wrapper.get(".game-canvas").trigger("keydown", {
				key: "ArrowUp"
			});
		}
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain("Crossings: 1");
		expect(wrapper.text()).toContain("Pip reached the meadow");
		expect(storageSpy).not.toHaveBeenCalled();
		wrapper.unmount();
	});

	it("runs Machine Workshop repair missions and exposes every station", async () => {
		const wrapper = mountGame(MachineWorkshopGame);

		expect(wrapper.get("h1").text()).toBe("Machine Workshop");
		expect(wrapper.text()).toContain("No timer · No wrong answers");
		expect(wrapper.find("form").exists()).toBe(false);
		expect(wrapper.findAll(".mission-picker button")).toHaveLength(3);
		expect(wrapper.get("progress").attributes("value")).toBe("0");
		expect(wrapper.findAll(".station-controls button")).toHaveLength(4);

		await wrapper
			.findAll(".station-controls button")
			.find(button => button.text().includes("Gear train"))
			?.trigger("click");
		expect(wrapper.text()).toContain(
			"large gear turns the smaller gear in the opposite direction"
		);
		expect(wrapper.get("progress").attributes("value")).toBe("1");

		await wrapper.get(".machine-workshop").trigger("keydown", { key: "4" });
		expect(wrapper.text()).toContain("memory lights changed their pattern");
		wrapper.unmount();
	});

	it("offers keyboard and touch controls for the comet trail", async () => {
		const wrapper = mountGame(CometHopperGame);

		expect(wrapper.get("h1").text()).toBe("Comet Hopper");
		expect(wrapper.get('[aria-label="Make the comet hop"]').text()).toContain(
			"Hop"
		);

		await wrapper.get(".primary-button").trigger("click");
		expect(wrapper.text()).toContain("Status: On the trail");
		await wrapper.get('[aria-label="Make the comet hop"]').trigger("click");
		expect(wrapper.text()).toContain("Comet hopping");

		await wrapper.get(".trail-canvas").trigger("keydown", {
			key: "ArrowDown"
		});
		await wrapper.get(".trail-canvas").trigger("keyup", {
			key: "ArrowDown"
		});
		await wrapper.vm.$nextTick();
		wrapper.unmount();
	});

	it("uses original inline artwork instead of platform emoji on game cards", () => {
		const wrapper = mountGame(GamesPage);
		const thumbnails = wrapper.findAll(".game-thumbnail");

		expect(thumbnails).toHaveLength(4);
		thumbnails.forEach(thumbnail => {
			expect(thumbnail.element.tagName.toLowerCase()).toBe("svg");
			expect(thumbnail.attributes("aria-hidden")).toBe("true");
			expect(thumbnail.attributes("focusable")).toBe("false");
		});
		expect(wrapper.text()).not.toMatch(/[🦆🐿⚙☄]/u);
		wrapper.unmount();
	});

	it("does not capture persistent header sign-in fields or native controls", async () => {
		const headerInput = document.createElement("input");
		document.body.append(headerInput);
		const crosswalk = mountGame(CrosswalkCrittersGame);
		const comet = mountGame(CometHopperGame);
		await crosswalk.get(".primary-button").trigger("click");
		await comet.get(".primary-button").trigger("click");

		for (const key of ["w", "s", " ", "ArrowUp", "ArrowDown"]) {
			const event = new KeyboardEvent("keydown", {
				bubbles: true,
				cancelable: true,
				key
			});
			headerInput.dispatchEvent(event);
			expect(event.defaultPrevented).toBe(false);
		}
		expect(crosswalk.text()).toContain("Crossings: 0");
		expect(comet.text()).not.toContain("Comet hopping");
		expect(comet.text()).not.toContain("Comet ducking");

		for (const button of [
			crosswalk.get(".primary-button"),
			comet.get(".primary-button")
		]) {
			const event = new KeyboardEvent("keydown", {
				bubbles: true,
				cancelable: true,
				key: " "
			});
			button.element.dispatchEvent(event);
			expect(event.defaultPrevented).toBe(false);
		}

		headerInput.remove();
		crosswalk.unmount();
		comet.unmount();
	});

	it("turns continuous motion into still or user-stepped play", async () => {
		vi.mocked(window.matchMedia).mockReturnValue({
			addEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
			matches: true,
			media: "(prefers-reduced-motion: reduce)",
			onchange: null,
			removeEventListener: vi.fn()
		} as MediaQueryList);

		const wrappers = [
			mountGame(CrosswalkCrittersGame),
			mountGame(MachineWorkshopGame),
			mountGame(CometHopperGame)
		];
		await Promise.all(wrappers.map(wrapper => wrapper.vm.$nextTick()));
		expect(window.requestAnimationFrame).not.toHaveBeenCalled();

		wrappers.forEach(wrapper => {
			expect(wrapper.get("section").attributes("data-reduced-motion")).toBe(
				"true"
			);
		});

		const [crosswalk, machine, comet] = wrappers;
		expect(machine.text()).toContain("Motion stays still between choices");
		await crosswalk.get(".primary-button").trigger("click");
		expect(crosswalk.text()).toContain("Status: Your turn");
		expect(crosswalk.text()).toContain("Traffic moves only after Pip moves");
		await comet.get(".primary-button").trigger("click");
		expect(comet.text()).toContain("Status: Your turn");
		await comet
			.get('[aria-label^="Make the comet hop"]')
			.trigger("click");
		expect(comet.text()).toContain("Hop complete");
		expect(comet.text()).toContain("Star steps: 1");
		expect(window.requestAnimationFrame).not.toHaveBeenCalled();

		wrappers.forEach(wrapper => wrapper.unmount());
	});

	it("keeps dark headings high-contrast and scopes dark selectors correctly", () => {
		for (const [source, darkColor, rootClass] of [
			[crosswalkSource, "#e8f8ff", "crosswalk-game"],
			[machineSource, "#edf7ff", "machine-workshop"],
			[cometSource, "#f0eaff", "comet-hopper"]
		]) {
			expect(source).toContain("color: var(--game-heading-color)");
			expect(source).toContain(`--game-heading-color: ${darkColor}`);
			expect(source).toContain(`:global(html.dark .${rootClass})`);
			expect(source).not.toContain(":global(html.dark) .");
		}
		expect(crosswalkSource).toContain("touch-action: pan-y pinch-zoom");
		expect(crosswalkSource).not.toContain("touch-action: none");
	});
});
