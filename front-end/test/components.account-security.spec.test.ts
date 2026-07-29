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
				entityId: "julio-primary",
				role: "admin"
			}
		});
		const second = mount(AccountSecurity, {
			props: {
				email: "second@example.com",
				entityId: "julio-backup",
				role: "admin"
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
	});
});
