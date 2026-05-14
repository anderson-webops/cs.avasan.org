import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import AccessibleDialog from "@/components/AccessibleDialog.vue";

describe("AccessibleDialog", () => {
	it("renders dialog semantics and emits close from the close button", async () => {
		document.body.innerHTML = "";
		const wrapper = mount(AccessibleDialog, {
			attachTo: document.body,
			global: {
				stubs: {
					teleport: true
				}
			},
			props: {
				dialogId: "test-dialog",
				open: true,
				title: "Confirm action",
				description: "This action needs confirmation."
			},
			slots: {
				default: "<button>Focusable action</button>"
			}
		});

		const dialog = document.querySelector("#test-dialog");
		expect(dialog?.getAttribute("role")).toBe("dialog");
		expect(dialog?.getAttribute("aria-modal")).toBe("true");
		expect(dialog?.getAttribute("aria-labelledby")).toBe(
			"test-dialog-title"
		);
		expect(dialog?.getAttribute("aria-describedby")).toBe(
			"test-dialog-description"
		);

		await wrapper.find(".dialog-close").trigger("click");
		expect(wrapper.emitted("close")).toHaveLength(1);
		wrapper.unmount();
	});

	it("emits close when Escape is pressed", async () => {
		document.body.innerHTML = "";
		const wrapper = mount(AccessibleDialog, {
			attachTo: document.body,
			global: {
				stubs: {
					teleport: true
				}
			},
			props: {
				dialogId: "escape-dialog",
				open: true,
				title: "Escape"
			},
			slots: {
				default: "<button>Focusable action</button>"
			}
		});

		await wrapper.find("#escape-dialog").trigger("keydown", {
			key: "Escape"
		});
		expect(wrapper.emitted("close")).toHaveLength(1);
		wrapper.unmount();
	});
});
