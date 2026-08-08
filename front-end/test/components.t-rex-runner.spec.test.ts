import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TRexRunnerGame from "@/components/games/TRexRunnerGame.vue";

const { cleanupRunner, mountChromiumTrex } = vi.hoisted(() => {
	const cleanup = vi.fn();
	return {
		cleanupRunner: cleanup,
		mountChromiumTrex: vi.fn((host: HTMLElement) => {
			const frame = document.createElement("iframe");
			frame.className = "trex-frame";
			frame.title = "T-Rex Runner game";
			frame.setAttribute("sandbox", "allow-scripts");
			host.append(frame);
			return () => {
				cleanup();
				frame.remove();
			};
		})
	};
});

vi.mock("@/vendor/chromium-t-rex", () => ({ mountChromiumTrex }));

function mountGame() {
	return mount(TRexRunnerGame, {
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

describe("T-Rex Runner classroom wrapper", () => {
	beforeEach(() => {
		cleanupRunner.mockClear();
		mountChromiumTrex.mockClear();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("loads the isolated runner with clear controls and attribution", () => {
		const wrapper = mountGame();

		expect(wrapper.get("h1").text()).toBe("T-Rex Runner");
		expect(wrapper.get(".back-link").attributes("href")).toBe("/games");
		expect(mountChromiumTrex).toHaveBeenCalledOnce();
		expect(mountChromiumTrex).toHaveBeenCalledWith(
			wrapper.get(".runner-host").element,
			{
				className: "trex-frame",
				title: "T-Rex Runner game"
			}
		);
		expect(wrapper.get("iframe").attributes("sandbox")).toBe(
			"allow-scripts"
		);
		expect(wrapper.get("iframe").attributes("title")).toBe(
			"T-Rex Runner game"
		);
		expect(wrapper.text()).toContain("Space or Up Arrow to jump");
		expect(wrapper.text()).toContain("Slow speed switch");
		expect(wrapper.text()).toContain(
			"not affiliated with or endorsed by Google"
		);
		expect(
			wrapper.get('a[href="/licenses/chromium-bsd-license.txt"]').exists()
		).toBe(true);

		wrapper.unmount();
		expect(cleanupRunner).toHaveBeenCalledOnce();
	});

	it("stops, reloads, and tears down the isolated game realm", async () => {
		const wrapper = mountGame();
		await wrapper.vm.$nextTick();

		const stopButton = wrapper
			.findAll("button")
			.find(button => button.text().includes("Stop game"));
		expect(stopButton).toBeDefined();
		await stopButton?.trigger("click");
		expect(cleanupRunner).toHaveBeenCalledOnce();
		expect(wrapper.find("iframe").exists()).toBe(false);
		expect(wrapper.text()).toContain("Load game");
		expect(
			wrapper
				.findAll("button")
				.some(button => button.text().includes("Stop game"))
		).toBe(false);

		await wrapper.get("button").trigger("click");
		expect(mountChromiumTrex).toHaveBeenCalledTimes(2);
		expect(wrapper.get("iframe").attributes("sandbox")).toBe(
			"allow-scripts"
		);

		const restartButton = wrapper
			.findAll("button")
			.find(button => button.text().includes("Restart game"));
		expect(restartButton).toBeDefined();
		await restartButton?.trigger("click");
		expect(cleanupRunner).toHaveBeenCalledTimes(2);
		expect(mountChromiumTrex).toHaveBeenCalledTimes(3);

		wrapper.unmount();
		expect(cleanupRunner).toHaveBeenCalledTimes(3);
	});
});
