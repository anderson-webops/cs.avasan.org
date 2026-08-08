import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
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
	afterEach(() => {
		vi.unstubAllEnvs();
	});

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

	it("makes the notice prominent when optional student accounts are active", () => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_POLICY_VERSION", "test-policy-1");
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE",
			"2026-08-02"
		);
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "true");
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "90");
		vi.stubEnv("VITE_SCHOOL_PRIVACY_CONTACT", "School privacy contact");
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE",
			"Operator notice"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE",
			"Service-provider notice"
		);

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

		expect(wrapper.get(".site-footer__link").classes()).toContain(
			"site-footer__link--prominent"
		);
	});

	it("makes the notice prominent when classroom counts are active", () => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_POLICY_VERSION", "test-policy-1");
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE",
			"2026-08-02"
		);
		vi.stubEnv("VITE_CLASSROOM_USAGE_ENABLED", "true");
		vi.stubEnv("VITE_CLASSROOM_ANALYTICS_RETENTION_DAYS", "45");
		vi.stubEnv("VITE_SCHOOL_PRIVACY_CONTACT", "School privacy contact");
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE",
			"Operator notice"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE",
			"Service-provider notice"
		);

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

		expect(wrapper.get(".site-footer__link").classes()).toContain(
			"site-footer__link--prominent"
		);
	});

	it("stays discreet when approval or account activation is incomplete", () => {
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "false");

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

		expect(wrapper.get(".site-footer__link").classes()).not.toContain(
			"site-footer__link--prominent"
		);
	});
});
