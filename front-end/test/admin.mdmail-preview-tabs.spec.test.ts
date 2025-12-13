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
});
