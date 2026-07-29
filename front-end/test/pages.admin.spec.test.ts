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
						template:
							'<div data-testid="teacher-login-dialog-host" />'
					},
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					}
				}
			}
		});
	}

	it("opens Julio's login only when /admin is visited logged out", () => {
		const app = useAppStore();
		const wrapper = mountAdmin();

		expect(app.loginBlock).toBe(true);
		expect(wrapper.text()).toContain("Julio's private sign-in");
		expect(
			wrapper.get('[data-testid="teacher-login-dialog-host"]').exists()
		).toBe(true);
		expect(
			wrapper
				.findAll("a")
				.find(link => link.text() === "Return to courses")
				?.attributes("href")
		).toBe("/courses");
	});

	it("shows Julio the private account destination when already logged in", () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mountAdmin();

		expect(app.loginBlock).toBe(false);
		expect(wrapper.text()).toContain("Signed in as Julio");
		expect(
			wrapper
				.findAll("a")
				.find(link => link.text() === "Open teacher account")
				?.attributes("href")
		).toBe("/profile");
		expect(
			wrapper.find('[data-testid="teacher-login-dialog-host"]').exists()
		).toBe(false);
	});
});
