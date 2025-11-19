// Test to verify that clicking on form inputs doesn't trigger parent click handlers
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import ProfileFields from "../src/components/ProfileFields.vue";

describe("ProfileFields click event propagation", () => {
	it("should stop click event propagation on input elements when editing", async () => {
		const parentClickHandler = vi.fn();
		const fields = [
			{ key: "name", label: "Name" },
			{ key: "email", label: "Email" }
		];
		const entity = {
			name: "John Doe",
			email: "john@example.com"
		};

		const wrapper = mount(
			{
				template: `
					<div @click="parentClickHandler">
						<ProfileFields 
							:editing="true" 
							:entity="entity" 
							:fields="fields"
							@update="() => {}"
						/>
					</div>
				`,
				components: { ProfileFields },
				setup() {
					return {
						parentClickHandler,
						entity,
						fields
					};
				}
			},
			{
				attachTo: document.body
			}
		);

		// Find the input element
		const input = wrapper.find("input[type='text']");
		expect(input.exists()).toBe(true);

		// Click on the input
		await input.trigger("click");

		// Parent click handler should NOT have been called due to .stop modifier
		expect(parentClickHandler).not.toHaveBeenCalled();

		wrapper.unmount();
	});

	it("should stop click event propagation on label elements when editing", async () => {
		const parentClickHandler = vi.fn();
		const fields = [{ key: "name", label: "Name" }];
		const entity = { name: "John Doe" };

		const wrapper = mount(
			{
				template: `
					<div @click="parentClickHandler">
						<ProfileFields 
							:editing="true" 
							:entity="entity" 
							:fields="fields"
							@update="() => {}"
						/>
					</div>
				`,
				components: { ProfileFields },
				setup() {
					return {
						parentClickHandler,
						entity,
						fields
					};
				}
			},
			{
				attachTo: document.body
			}
		);

		// Find the label element
		const label = wrapper.find("label");
		expect(label.exists()).toBe(true);

		// Click on the label
		await label.trigger("click");

		// Parent click handler should NOT have been called due to .stop modifier
		expect(parentClickHandler).not.toHaveBeenCalled();

		wrapper.unmount();
	});
});
