import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import CoursesPage from "@/pages/courses.vue";
import { useAppStore } from "@/stores/app";

describe("courses page access gate", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("opens the login modal when a logged-out visitor clicks Log in", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();

		const wrapper = mount(CoursesPage, {
			global: {
				plugins: [pinia],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});

		await flushPromises();
		expect(wrapper.text()).toContain(
			"Course materials are locked until you log in."
		);

		await wrapper.get("button").trigger("click");

		expect(app.loginBlock).toBe(true);
	});

	it("shows the access request message for a learner with no courses", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();

		app.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CoursesPage, {
			global: {
				plugins: [pinia],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});

		await flushPromises();

		expect(wrapper.text()).toContain(
			"No courses are assigned to this account yet."
		);
		expect(wrapper.text()).toContain("classes@jacobdanderson.net");
	});
});
