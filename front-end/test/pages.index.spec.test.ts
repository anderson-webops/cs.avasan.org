import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import HomePage from "@/pages/index.vue";

vi.mock("@unhead/vue", () => ({
	useHead: vi.fn()
}));

describe("public home page", () => {
	it("opens the course explorer as a public catalog", async () => {
		const wrapper = mount(HomePage, {
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

		expect(wrapper.get("h1").text()).toBe("Courses");
		expect(wrapper.text()).toContain("No student account is needed.");
		expect(
			wrapper
				.get('[data-testid="course-explorer"]')
				.attributes("data-public-catalog")
		).toBe("true");
	});

	it("does not present account or scheduler gates", async () => {
		const wrapper = mount(HomePage, {
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
