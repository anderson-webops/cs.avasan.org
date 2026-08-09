import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AccessibleDialog from "@/components/AccessibleDialog.vue";

function mountDialog(open = true) {
	return mount(AccessibleDialog, {
		attachTo: document.body,
		global: { stubs: { teleport: true } },
		props: {
			dialogId: "test-dialog",
			open,
			title: "Playable solution",
			description: "A focused dialog."
		},
		slots: { default: '<iframe title="Player"></iframe>' }
	});
}

describe("AccessibleDialog", () => {
	it("provides dialog semantics and all close routes", async () => {
		const wrapper = mountDialog();
		await flushPromises();
		const dialog = wrapper.get("#test-dialog");
		expect(dialog.attributes("role")).toBe("dialog");
		expect(dialog.attributes("aria-modal")).toBe("true");
		await dialog.trigger("keydown", { key: "Escape" });
		await wrapper.get(".dialog-backdrop").trigger("mousedown");
		await wrapper.get(".dialog-close").trigger("click");
		expect(wrapper.emitted("close")).toHaveLength(3);
		wrapper.unmount();
	});

	it("includes the embedded player in its focus trap and restores focus", async () => {
		const launch = document.createElement("button");
		document.body.append(launch);
		launch.focus();
		const wrapper = mountDialog(false);
		await wrapper.setProps({ open: true });
		await flushPromises();
		const close = wrapper.get<HTMLButtonElement>(".dialog-close").element;
		const frame = wrapper.get<HTMLIFrameElement>("iframe").element;
		expect(document.activeElement).toBe(close);
		close.focus();
		await wrapper.get("#test-dialog").trigger("keydown", {
			key: "Tab",
			shiftKey: true
		});
		expect(document.activeElement).toBe(frame);
		await wrapper.setProps({ open: false });
		await flushPromises();
		expect(document.activeElement).toBe(launch);
		wrapper.unmount();
		launch.remove();
	});

	it("prevents backdrop focus movement before restoring the launcher", async () => {
		const launch = document.createElement("button");
		document.body.append(launch);
		launch.focus();
		const wrapper = mountDialog(false);
		await wrapper.setProps({ open: true });
		await flushPromises();

		const backdrop = wrapper.get(".dialog-backdrop").element;
		const event = new MouseEvent("mousedown", {
			bubbles: true,
			cancelable: true
		});
		backdrop.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
		expect(wrapper.emitted("close")).toHaveLength(1);

		await wrapper.setProps({ open: false });
		await flushPromises();
		expect(document.activeElement).toBe(launch);
		wrapper.unmount();
		launch.remove();
	});
});
