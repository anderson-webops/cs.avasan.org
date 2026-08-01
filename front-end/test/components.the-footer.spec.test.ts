import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TheFooter from "@/components/TheFooter.vue";

const footerSource = readFileSync(
	resolve(process.cwd(), "src/components/TheFooter.vue"),
	"utf8"
);
const siteStylesSource = readFileSync(
	resolve(process.cwd(), "src/styles/main.css"),
	"utf8"
);

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

		expect(privacyLink.text()).toBe(
			"Student privacy and record requests"
		);
		expect(privacyLink.attributes("href")).toBe("/student-privacy");
		expect(privacyLink.classes()).toContain("site-footer__link");
	});

	it("keeps the privacy link visually discreet but available", () => {
		expect(footerSource).toContain("justify-content: flex-end;");
		expect(footerSource).toContain("color: var(--color-footer-link);");
		expect(footerSource).toContain("font-size: 0.75rem;");
		expect(footerSource).toContain("text-decoration: none;");
		expect(siteStylesSource).toContain("--color-footer-link: #5f6f73;");
		expect(siteStylesSource).toContain("--color-footer-link: #93a7bc;");
	});
});
