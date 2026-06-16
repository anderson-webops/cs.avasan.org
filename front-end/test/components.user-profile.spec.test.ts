import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import UserProfile from "@/components/UserProfile.vue";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

describe("UserProfile", () => {
	it("summarizes course access by current and past status", () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const pastCourse = coursesStore.courses[0];
		const currentCourse = coursesStore.courses[1];

		appStore.setCurrentUser({
			_id: "learner-1",
			name: "Learner",
			email: "learner@example.com",
			age: 12,
			state: "GA",
			courseAccess: [pastCourse.id, currentCourse.id],
			courseStatus: {
				[pastCourse.id]: "past",
				[currentCourse.id]: "current"
			},
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(UserProfile, {
			global: {
				plugins: [pinia],
				stubs: {
					AccountSecurity: true,
					ProfileFields: true,
					UserCommunicationPanel: true
				}
			}
		});

		expect(wrapper.text()).toContain(`Current: ${currentCourse.name}`);
		expect(wrapper.text()).toContain(`Past: ${pastCourse.name}`);
	});
});
