import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import TheHeader from "@/components/TheHeader.vue";
import { useAppStore } from "@/stores/app";

const route = vi.hoisted(() => ({ path: "/" }));
vi.mock("vue-router", () => ({ useRoute: () => route }));

describe("TheHeader.vue", () => {
	beforeEach(() => {
		route.path = "/";
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_APPROVED", "true");
		vi.stubEnv("VITE_CLASSROOM_PRIVACY_POLICY_VERSION", "test-policy-1");
		vi.stubEnv(
			"VITE_CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE",
			"2026-08-02"
		);
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

	function mountHeader(pinia = createPinia(), resolved = true) {
		setActivePinia(pinia);
		useAppStore().sessionBootstrapStatus = resolved ? "ready" : "pending";
		return mount(TheHeader, {
			global: {
				plugins: [pinia],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					},
					StudentAccess: {
						template:
							'<div data-testid="student-access">Student access</div>'
					}
				}
			}
		});
	}

	it("keeps student sign-in hidden during teacher bootstrap and revalidation", async () => {
		const pinia = createPinia();
		const wrapper = mountHeader(pinia, false);
		document.body.appendChild(wrapper.element);
		// Open the collapsed menu so visibility reflects the session gate.
		wrapper.get("#siteNavbar").element.classList.add("show");
		const app = useAppStore(pinia);
		expect(wrapper.get('[data-testid="student-access"]').isVisible()).toBe(
			false
		);
		app.sessionBootstrapStatus = "ready";
		await nextTick();
		expect(app.isSessionResolved).toBe(true);
		expect(wrapper.get('[data-testid="student-access"]').isVisible()).toBe(
			true
		);
		app.adminSessionRevalidating = true;
		await nextTick();
		expect(wrapper.get('[data-testid="student-access"]').isVisible()).toBe(
			false
		);
		app.adminSessionRevalidating = false;
		app.sessionBootstrapStatus = "failed";
		await nextTick();
		expect(wrapper.get('[data-testid="student-access"]').isVisible()).toBe(
			true
		);
		wrapper.unmount();
		wrapper.element.remove();
	});

	it("uses compact chrome away from the home page", () => {
		route.path = "/ide";
		const compact = mountHeader();
		expect(compact.classes()).toContain("site-header--compact");
		compact.unmount();
		route.path = "/";
		const home = mountHeader();
		expect(home.classes()).not.toContain("site-header--compact");
		home.unmount();
	});
	it("shows only public classroom navigation when logged out", () => {
		const wrapper = mountHeader();
		const links = wrapper
			.findAll(".site-nav__link")
			.map(link => [link.text(), link.attributes("href")]);

		expect(wrapper.text()).toContain("Classes with Julio");
		expect(links).toEqual([
			["Courses", "/"],
			["IDE", "/ide"],
			["Games", "/games"]
		]);
		expect(wrapper.text()).not.toContain("Graphing");
		expect(wrapper.text()).not.toContain("Student privacy");
		expect(wrapper.text()).not.toContain("Teacher log in");
		expect(wrapper.find(".site-nav__actions").exists()).toBe(false);
		expect(wrapper.get('[data-testid="student-access"]').exists()).toBe(
			true
		);
		expect(wrapper.text()).not.toMatch(
			/Sign up|Book a Class|Tuition|Zoom|Pathways|Teaching/
		);
	});

	it("shows Julio's teacher account controls when he is logged in", () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mountHeader(pinia);

		expect(wrapper.text()).toContain("Admin");
		expect(wrapper.text()).toContain("Log out");
		expect(wrapper.text()).not.toContain("Teacher log in");
		expect(wrapper.text()).not.toContain("Account");
		expect(wrapper.get('[data-testid="student-access"]').exists()).toBe(
			true
		);
		expect(wrapper.get('[data-testid="student-access"]').isVisible()).toBe(
			false
		);
		expect(
			wrapper
				.findAll("a")
				.find(link => link.text() === "Admin")
				?.attributes("href")
		).toBe("/admin");
	});
});
