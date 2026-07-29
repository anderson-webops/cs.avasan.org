import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import ProfilePage from "@/pages/profile.vue";
import { useAppStore } from "@/stores/app";

describe("Teacher account page", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	function mountProfile() {
		return mount(ProfilePage, {
			global: {
				stubs: {
					AdminProfile: {
						template:
							'<section data-testid="teacher-profile">Julio private settings</section>'
					},
					RouterLink: {
						props: ["to"],
						template: '<a :href="to"><slot /></a>'
					}
				}
			}
		});
	}

	it("directs logged-out students to public courses without exposing login", () => {
		const wrapper = mountProfile();

		expect(wrapper.text()).toContain("Teacher account");
		expect(wrapper.text()).toContain("Julio is not logged in.");
		expect(wrapper.text()).toContain("No account is needed.");
		expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
		expect(wrapper.text()).not.toMatch(/Student profile|Tutor profile|Sign up/i);
		expect(
			wrapper
				.findAll("a")
				.find(link => link.text() === "Open courses")
				?.attributes("href")
		).toBe("/courses");
		expect(wrapper.text()).not.toContain("Teacher log in");
		expect(wrapper.find("button").exists()).toBe(false);
	});

	it("renders only Julio's teacher profile when he is logged in", () => {
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mountProfile();

		expect(wrapper.text()).toContain("Julio's account");
		expect(wrapper.get('[data-testid="teacher-profile"]').exists()).toBe(
			true
		);
		expect(wrapper.text()).not.toContain("Julio is not logged in.");
		expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
	});
});
