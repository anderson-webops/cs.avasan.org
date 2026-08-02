import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AdminPage from "@/pages/admin.vue";
import { useAppStore } from "@/stores/app";

const route = vi.hoisted(() => ({
	path: "/admin",
	query: {} as Record<string, string>
}));

vi.mock("vue-router", () => ({
	useRoute: () => route
}));

describe("Teacher admin page", () => {
	beforeEach(() => {
		route.query = {};
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv(
			"VITE_SCHOOL_PRIVACY_CONTACT",
			"School privacy office, 555-0100"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE",
			"Test operator contact"
		);
		vi.stubEnv(
			"VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE",
			"Test approved provider notice"
		);
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "true");
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "90");
		setActivePinia(createPinia());
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	function mountAdmin() {
		return mount(AdminPage, {
			global: {
				stubs: {
					AccountManagement: {
						template: '<form data-testid="admin-login-form" />'
					},
					AccountSecurity: {
						props: ["entityId"],
						template:
							'<div data-testid="account-settings">Password</div>'
					},
					ClassroomAnalytics: {
						template:
							'<section id="analytics" data-testid="classroom-analytics"><h2 tabindex="-1">Classroom activity</h2></section>'
					},
					PondPaddlersAdmin: {
						template:
							'<div data-testid="pond-paddlers-admin">Pond Paddlers rooms</div>'
					},
					StudentManagement: {
						props: ["maintenanceOnly"],
						template:
							'<div data-testid="student-management">{{ maintenanceOnly ? "Student record maintenance" : "Students" }}</div>'
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
		expect(
			wrapper.find('[data-testid="student-management"]').exists()
		).toBe(false);
		expect(wrapper.find("a").exists()).toBe(false);
		expect(wrapper.text()).not.toMatch(/Student|Tutor|private|account-free/i);
	});

	it("shows Julio's settings and student management when he is logged in", () => {
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
			"Password"
		);
		expect(wrapper.find('[data-testid="admin-login-form"]').exists()).toBe(
			false
		);
		expect(wrapper.get('[data-testid="student-management"]').text()).toBe(
			"Students"
		);
		expect(wrapper.get('[data-testid="classroom-analytics"]').text()).toBe(
			"Classroom activity"
		);
		expect(wrapper.get('[data-testid="pond-paddlers-admin"]').text()).toBe(
			"Pond Paddlers rooms"
		);
		expect(wrapper.find("a").exists()).toBe(false);
	});

	it("keeps record maintenance visible when public student accounts are disabled", () => {
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "false");
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mountAdmin();

		expect(wrapper.get('[data-testid="student-management"]').text()).toBe(
			"Student record maintenance"
		);
	});

	it("hides record management when no valid retention period is configured", () => {
		vi.stubEnv("VITE_STUDENT_ACCOUNTS_ENABLED", "false");
		vi.stubEnv("VITE_STUDENT_RECORD_RETENTION_DAYS", "");
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mountAdmin();

		expect(
			wrapper.find('[data-testid="student-management"]').exists()
		).toBe(false);
	});

	it("keeps the analytics handoff at the stable Admin section URL", async () => {
		route.query = { section: "analytics" };
		HTMLElement.prototype.scrollIntoView = vi.fn();
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mountAdmin();
		await wrapper.vm.$nextTick();

		expect(wrapper.get("#analytics").exists()).toBe(true);
		expect(wrapper.get("#analytics h2").attributes("tabindex")).toBe("-1");
		expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
	});

	it("shows no privileged controls while Admin access is being checked", () => {
		const app = useAppStore();
		app.adminSessionRevalidating = true;

		const wrapper = mountAdmin();

		expect(wrapper.text()).toContain("Checking Admin access…");
		expect(wrapper.find('[data-testid="admin-login-form"]').exists()).toBe(
			false
		);
		expect(wrapper.find('[data-testid="account-settings"]').exists()).toBe(
			false
		);
		expect(
			wrapper.find('[data-testid="student-management"]').exists()
		).toBe(false);
	});
});
