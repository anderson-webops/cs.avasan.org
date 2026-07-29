import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import AdminPage from "@/pages/admin.vue";
import { useAppStore } from "@/stores/app";

describe("Teacher admin page", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	function mountAdmin() {
		return mount(AdminPage, {
			global: {
				stubs: {
					AccountManagement: {
						template: '<form data-testid="admin-login-form" />'
					},
					AccountSecurity: {
						props: ["email", "entityId"],
						template:
							'<div data-testid="account-settings">{{ email }}</div>'
					}
				}
			}
		});
	}

	it("shows only the inline login when /admin is visited logged out", () => {
		const wrapper = mountAdmin();

		expect(wrapper.get("h1").text()).toBe("Admin");
		expect(wrapper.get('[data-testid="admin-login-form"]').exists()).toBe(
			true
		);
		expect(wrapper.find('[data-testid="account-settings"]').exists()).toBe(
			false
		);
		expect(wrapper.find("a").exists()).toBe(false);
		expect(wrapper.text()).not.toMatch(/Student|Tutor|private|account-free/i);
	});

	it("shows account settings directly when Julio is logged in", () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mountAdmin();

		expect(wrapper.get("h1").text()).toBe("Admin");
		expect(wrapper.get('[data-testid="account-settings"]').text()).toBe(
			"julio@example.com"
		);
		expect(wrapper.find('[data-testid="admin-login-form"]').exists()).toBe(
			false
		);
		expect(wrapper.find("a").exists()).toBe(false);
	});
});
