import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import CoursesPage from "@/pages/courses.vue";

describe("public courses page", () => {
	it("opens the course explorer as a public catalog", async () => {
		const wrapper = mount(CoursesPage, {
			global: {
				stubs: {
					CourseExplorer: {
						props: {
							publicCatalog: Boolean
						},
						template: `
							<div
								data-testid="course-explorer"
								:data-public-catalog="String(publicCatalog)"
							>
								Course explorer
							</div>
						`
					}
				}
			}
		});

		await flushPromises();

		expect(wrapper.text()).toContain("Computer Science Courses");
		expect(wrapper.text()).toContain(
			"Every course is available without a student account."
		);
		expect(
			wrapper
				.get('[data-testid="course-explorer"]')
				.attributes("data-public-catalog")
		).toBe("true");
	});

	it("does not present account or scheduler gates", async () => {
		const wrapper = mount(CoursesPage, {
			global: {
				stubs: {
					CourseExplorer: {
						template: "<div>Course explorer</div>"
					}
				}
			}
		});

		await flushPromises();

		expect(wrapper.text()).not.toMatch(
			/Log in|Sign up|Book a Class|Open Scheduler|assigned to your account/i
		);
	});
});
