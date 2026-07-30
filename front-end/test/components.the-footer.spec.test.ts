import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TheFooter from "@/components/TheFooter.vue";

describe("TheFooter.vue", () => {
	it("keeps the student privacy notice available outside primary navigation", () => {
		const wrapper = mount(TheFooter, {
			global: {
				stubs: {
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					}
				}
			}
		});

		const privacyLink = wrapper.get(".site-footer__link");

		expect(privacyLink.text()).toBe("Student privacy");
		expect(privacyLink.attributes("href")).toBe("/student-privacy");
	});
});
