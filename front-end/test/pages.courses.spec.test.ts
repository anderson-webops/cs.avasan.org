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
		expect(wrapper.text()).toContain("Log In");

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

		expect(wrapper.text()).toContain("No Courses Yet");
		expect(wrapper.text()).toContain("classes@jacobdanderson.net");
	});

	it("keeps booking calls out of the assigned-course view", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();

		app.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: ["javascript-level-1"],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CoursesPage, {
			global: {
				plugins: [pinia],
				stubs: {
					CourseExplorer: {
						template: "<div>Course explorer</div>"
					},
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});

		await flushPromises();

		expect(wrapper.text()).toContain("Your Courses");
		expect(wrapper.text()).not.toContain("Book a Class");
	});
});
