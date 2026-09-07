import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ScratchSolutionDialog from "@/components/ScratchSolutionDialog.vue";

describe("ScratchSolutionDialog", () => {
	it("creates one constrained frame only while open", async () => {
		const wrapper = mount(ScratchSolutionDialog, {
			global: { stubs: { teleport: true } },
			props: {
				embedUrl: "https://scratch.mit.edu/projects/297735619/embed",
				open: false,
				title: "Fortune Teller"
			}
		});
		expect(wrapper.find("iframe").exists()).toBe(false);
		await wrapper.setProps({ open: true });
		await flushPromises();
		const frame = wrapper.get("iframe");
		expect(frame.attributes("src")).toBe(
			"https://scratch.mit.edu/projects/297735619/embed"
		);
		expect(frame.attributes("title")).toContain("Fortune Teller");
		expect(frame.attributes("referrerpolicy")).toBe("no-referrer");
		expect(frame.attributes("sandbox")).toBe(
			"allow-scripts allow-same-origin"
		);
		expect(frame.attributes("allow")).toBe("fullscreen");
		expect(frame.attributes()).not.toHaveProperty("allowfullscreen");
		const footerClose = wrapper.get(".scratch-player-close");
		expect(footerClose.text()).toBe("Close playable solution");
		expect(
			frame.element.compareDocumentPosition(footerClose.element) &
				Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy();
		await footerClose.trigger("click");
		expect(wrapper.emitted("close")).toHaveLength(1);
		await wrapper.setProps({ open: false });
		expect(wrapper.find("iframe").exists()).toBe(false);
	});

	it("refuses a non-canonical or lookalike embed URL", () => {
		const wrapper = mount(ScratchSolutionDialog, {
			global: { stubs: { teleport: true } },
			props: {
				embedUrl:
					"https://scratch.mit.edu.evil.example/projects/1/embed",
				open: true,
				title: "Unsafe"
			}
		});
		expect(wrapper.find("iframe").exists()).toBe(false);
	});
});
