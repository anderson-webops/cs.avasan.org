import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import AccountSecurity from "@/components/AccountSecurity.vue";

describe("AccountSecurity", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("uses entity-specific form control ids", () => {
		const first = mount(AccountSecurity, {
			props: {
				email: "first@example.com",
				entityId: "julio-primary"
			}
		});
		const second = mount(AccountSecurity, {
			props: {
				email: "second@example.com",
				entityId: "julio-backup"
			}
		});

		expect(first.find("label").attributes("for")).toBe(
			"account-security-admin-julio-primary-email"
		);
		expect(second.find("label").attributes("for")).toBe(
			"account-security-admin-julio-backup-email"
		);
		expect(
			first.find("#account-security-admin-julio-primary-email").exists()
		).toBe(true);
		expect(
			second.find("#account-security-admin-julio-backup-email").exists()
		).toBe(true);
		expect(first.get("h2").text()).toBe("Account settings");
		expect(first.findAll("h3").map(heading => heading.text())).toEqual([
			"Email",
			"Password"
		]);
		expect(first.text()).not.toMatch(/Student|Tutor|whenever you need/i);
	});
});
