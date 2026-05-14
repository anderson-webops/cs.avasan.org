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
				entityId: "first-user",
				role: "user"
			}
		});
		const second = mount(AccountSecurity, {
			props: {
				email: "second@example.com",
				entityId: "second-user",
				role: "user"
			}
		});

		expect(first.find("label").attributes("for")).toBe(
			"account-security-user-first-user-email"
		);
		expect(second.find("label").attributes("for")).toBe(
			"account-security-user-second-user-email"
		);
		expect(first.find("#account-security-user-first-user-email").exists()).toBe(
			true
		);
		expect(
			second.find("#account-security-user-second-user-email").exists()
		).toBe(true);
	});
});
