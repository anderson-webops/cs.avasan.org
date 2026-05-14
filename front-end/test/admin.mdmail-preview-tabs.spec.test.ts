import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import MdMail from "@/pages/admin/mdmail.vue";

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
});
