import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "@/pages/profile.vue";
import { useAppStore } from "@/stores/app";

vi.mock("@/components/AdminProfile.vue", () => ({
	default: { template: "<section />" }
}));
vi.mock("@/components/CourseExplorer.vue", () => ({
	default: { template: "<section />" }
}));
vi.mock("@/components/TutorProfile.vue", () => ({
	default: { template: "<section />" }
}));
vi.mock("@/components/UserProfile.vue", () => ({
	default: { template: "<section />" }
}));

describe("Profile page account routing", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("renders account content without embedding course-library tabs", async () => {
		const app = useAppStore();
		app.setCurrentUser({
			_id: "user-1",
			name: "Student Test",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: ["python-1"],
			editUsers: false,
			saveEdit: ""
		});

		const wrapper = mount(ProfilePage);

		expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
		expect(wrapper.text()).not.toContain("Course library");
		wrapper.unmount();
	});
});
