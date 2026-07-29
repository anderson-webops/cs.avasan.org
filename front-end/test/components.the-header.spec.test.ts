import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TheHeader from "@/components/TheHeader.vue";
import { useAppStore } from "@/stores/app";

vi.mock("vue-router", () => ({
	useRoute: () => ({ path: "/" })
}));

describe("TheHeader.vue", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	function mountHeader(pinia = createPinia()) {
		setActivePinia(pinia);
		return mount(TheHeader, {
			global: {
				plugins: [pinia],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					}
				}
			}
		});
	}

	it("shows the public classroom navigation and a teacher-only login", () => {
		const wrapper = mountHeader();
		const links = wrapper
			.findAll(".site-nav__link")
			.map(link => [link.text(), link.attributes("href")]);

		expect(wrapper.text()).toContain("Classes with Julio");
		expect(links).toEqual([
			["Home", "/"],
			["Courses", "/courses"],
			["Python IDE", "/python-ide"],
			["About Julio", "/about"]
		]);
		expect(wrapper.text()).toContain("Teacher log in");
		expect(wrapper.text()).not.toMatch(
			/Sign up|Book a Class|Tuition|Zoom|Pathways|Teaching/
		);
	});

	it("opens the private teacher login from the public header", async () => {
		const wrapper = mountHeader();

		await wrapper.get("button.site-nav__teacher-login").trigger("click");

		expect(wrapper.emitted("loginClick")).toHaveLength(1);
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

		expect(wrapper.text()).toContain("Teacher");
		expect(wrapper.text()).toContain("Account");
		expect(wrapper.text()).toContain("Log out");
		expect(wrapper.text()).not.toContain("Teacher log in");
		expect(
			wrapper
				.findAll("a")
				.find(link => link.text() === "Account")
				?.attributes("href")
		).toBe("/profile");
	});
});
