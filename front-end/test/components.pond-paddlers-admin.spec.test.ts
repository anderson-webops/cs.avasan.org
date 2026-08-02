import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PondPaddlersAdmin from "@/components/PondPaddlersAdmin.vue";
import {
	closePondPaddlersRoom,
	createPondPaddlersRoom,
	listPondPaddlersRooms
} from "@/modules/pondPaddlersAdmin";

vi.mock("@/modules/pondPaddlersAdmin", async importOriginal => {
	const original = await importOriginal<
		typeof import("@/modules/pondPaddlersAdmin")
	>();
	return {
		...original,
		closePondPaddlersRoom: vi.fn(),
		createPondPaddlersRoom: vi.fn(),
		listPondPaddlersRooms: vi.fn()
	};
});

const room = {
	calmMode: true,
	createdAt: "2026-08-01T12:00:00.000Z",
	durationMinutes: 60,
	expiresAt: "2026-08-01T13:00:00.000Z",
	finishAt: 10,
	maxOperand: 20,
	operations: [
		"add",
		"subtract",
		"multiply",
		"divide"
	] as Array<"add" | "subtract" | "multiply" | "divide">,
	playerCount: 3,
	roomCode: "ABCD2345",
	status: "racing" as const
};

describe("PondPaddlersAdmin", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		vi.mocked(listPondPaddlersRooms).mockResolvedValue([room]);
		vi.mocked(createPondPaddlersRoom).mockResolvedValue(room);
		vi.mocked(closePondPaddlersRoom).mockResolvedValue(undefined);
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText: vi.fn().mockResolvedValue(undefined) }
		});
	});

	it("shows only room-level classroom information", async () => {
		const wrapper = mount(PondPaddlersAdmin);
		await flushPromises();

		expect(listPondPaddlersRooms).toHaveBeenCalledTimes(1);
		expect(wrapper.text()).toContain("ABCD2345");
		expect(wrapper.text()).toContain("3 paddlers");
		expect(wrapper.text()).toContain("Race in progress");
		expect(wrapper.text()).not.toMatch(/username|submitted answer|account/i);
	});

	it("creates a calm room with the selected arithmetic settings", async () => {
		vi.mocked(listPondPaddlersRooms).mockResolvedValue([]);
		const wrapper = mount(PondPaddlersAdmin);
		await flushPromises();

		await wrapper.get("form").trigger("submit");
		await flushPromises();

		expect(createPondPaddlersRoom).toHaveBeenCalledWith({
			calmMode: true,
			durationMinutes: 60,
			finishAt: 10,
			maxOperand: 20,
			operations: ["add", "subtract", "multiply", "divide"]
		});
		expect(wrapper.text()).toContain("Room ABCD2345 is ready.");
	});

	it("requires a second action before closing an active room", async () => {
		const wrapper = mount(PondPaddlersAdmin);
		await flushPromises();

		await wrapper.get(".pond-admin__close").trigger("click");
		expect(closePondPaddlersRoom).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain("Close now");

		await wrapper.get(".pond-admin__close-confirm").trigger("click");
		await flushPromises();

		expect(closePondPaddlersRoom).toHaveBeenCalledWith("ABCD2345");
		expect(wrapper.text()).toContain("Room ABCD2345 is closed.");
		expect(wrapper.text()).toContain("No rooms are open.");
	});

	it("moves focus into confirmation and restores it on cancel or close", async () => {
		const wrapper = mount(PondPaddlersAdmin, { attachTo: document.body });
		await flushPromises();

		try {
			const closeButton = wrapper.get<HTMLButtonElement>(
				".pond-admin__close"
			);
			await closeButton.trigger("click");
			await flushPromises();
			expect(document.activeElement).toBe(
				wrapper.get(".pond-admin__close-confirm").element
			);

			await wrapper.get(".pond-admin__close-actions").trigger("keydown", {
				key: "Escape"
			});
			await flushPromises();
			const restoredCloseButton = wrapper.get<HTMLButtonElement>(
				".pond-admin__close"
			);
			expect(document.activeElement).toBe(restoredCloseButton.element);

			await restoredCloseButton.trigger("click");
			await flushPromises();
			await wrapper.get(".pond-admin__close-confirm").trigger("click");
			await flushPromises();
			expect(document.activeElement).toBe(
				wrapper.get(".pond-admin__notice").element
			);
			expect(wrapper.get(".pond-admin__notice").attributes("role")).toBe(
				"status"
			);
		} finally {
			wrapper.unmount();
		}
	});

	it("copies only the short room code", async () => {
		const wrapper = mount(PondPaddlersAdmin);
		await flushPromises();

		await wrapper.get(".pond-admin__room-actions button").trigger("click");
		await flushPromises();

		expect(navigator.clipboard.writeText).toHaveBeenCalledWith("ABCD2345");
		expect(wrapper.text()).toContain("Copied room ABCD2345.");
	});
});
