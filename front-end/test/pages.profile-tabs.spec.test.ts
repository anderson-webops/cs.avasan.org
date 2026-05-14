import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
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

describe("Profile page tabs", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
			callback(0);
			return 0;
		});
	});

	it("uses labelled tab and tabpanel relationships", async () => {
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
		await nextTick();

		const profileTab = wrapper.find("#profile-tab-profile");
		expect(profileTab.attributes("role")).toBe("tab");
		expect(profileTab.attributes("aria-controls")).toBe(
			"profile-panel-profile"
		);
		expect(wrapper.find("#profile-panel-profile").attributes("role")).toBe(
			"tabpanel"
		);

		await profileTab.trigger("keydown", { key: "ArrowRight" });
		expect(wrapper.find("#profile-tab-courses").attributes("aria-selected")).toBe(
			"true"
		);
		wrapper.unmount();
	});
});
