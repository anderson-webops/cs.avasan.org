import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import MdMail from "@/pages/admin/mdmail.vue";

vi.mock("@/modules/adminRecipients", () => ({
	fetchAdminRecipients: vi.fn().mockResolvedValue([])
}));

const findPreviewBody = (wrapper: ReturnType<typeof mount>) =>
	wrapper.find('[data-testid="live-preview-body"]');

describe("Admin mail preview tabs", () => {
	it("shows compose tab by default and hides preview", () => {
		const wrapper = mount(MdMail);

		expect(wrapper.find('[data-testid="md-input"]').exists()).toBe(true);
		expect(wrapper.find('[data-testid="live-preview"]').exists()).toBe(
			false
		);
		expect(wrapper.find("label[for='markdown-input']").text()).toBe(
			"Markdown"
		);
		expect(wrapper.find("[data-testid='tab-compose']").attributes()).toMatchObject(
			{
				"aria-controls": "panel-compose",
				"aria-selected": "true"
			}
		);
	});

	it("renders markdown preview when preview tab is active", async () => {
		const wrapper = mount(MdMail);

		const mdInput = wrapper.find('[data-testid="md-input"]');
		await mdInput.setValue("**Hello** _world_");

		await wrapper.find('[data-testid="tab-preview"]').trigger("click");

		const previewBody = findPreviewBody(wrapper);
		expect(previewBody.exists()).toBe(true);
		expect(previewBody.html()).toContain("<strong>Hello</strong>");
		expect(previewBody.html()).toContain("<em>world</em>");
	});

	it("supports arrow-key tab navigation", async () => {
		const wrapper = mount(MdMail, { attachTo: document.body });

		await wrapper.find('[data-testid="tab-compose"]').trigger("keydown", {
			key: "ArrowRight"
		});

		expect(wrapper.find('[data-testid="live-preview"]').exists()).toBe(
			true
		);
		expect(
			wrapper.find('[data-testid="tab-preview"]').attributes(
				"aria-selected"
			)
		).toBe("true");
		wrapper.unmount();
	});

	it("implements roving keyboard behavior for the full tab pattern", async () => {
		const wrapper = mount(MdMail, { attachTo: document.body });

		const composeTab = () => wrapper.find('[data-testid="tab-compose"]');
		const previewTab = () => wrapper.find('[data-testid="tab-preview"]');

		expect(composeTab().attributes("id")).toBe("tab-compose");
		expect(composeTab().attributes("aria-controls")).toBe("panel-compose");
		expect(composeTab().attributes("tabindex")).toBe("0");
		expect(previewTab().attributes("id")).toBe("tab-preview");
		expect(previewTab().attributes("aria-controls")).toBe("panel-preview");
		expect(previewTab().attributes("tabindex")).toBe("-1");

		await composeTab().trigger("keydown", { key: "End" });
		expect(previewTab().attributes("aria-selected")).toBe("true");
		expect(previewTab().attributes("tabindex")).toBe("0");
		expect(
			wrapper.find('[data-testid="live-preview"]').attributes()
		).toMatchObject({
			"aria-labelledby": "tab-preview",
			id: "panel-preview",
			role: "tabpanel"
		});

		await previewTab().trigger("keydown", { key: "Home" });
		expect(composeTab().attributes("aria-selected")).toBe("true");
		expect(composeTab().attributes("tabindex")).toBe("0");
		expect(wrapper.find(".tab-panel").attributes()).toMatchObject({
			"aria-labelledby": "tab-compose",
			id: "panel-compose",
			role: "tabpanel"
		});

		await composeTab().trigger("keydown", { key: "ArrowLeft" });
		expect(previewTab().attributes("aria-selected")).toBe("true");

		wrapper.unmount();
	});
});
