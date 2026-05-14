import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import CourseExplorer from "@/components/CourseExplorer.vue";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

vi.mock("@/api", () => ({
	api: {
		get: vi.fn(),
		put: vi.fn()
	}
}));

describe("CourseExplorer.vue", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		vi.useRealTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders course stats for an assigned learner without throwing", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const course = await coursesStore.loadCourseById(assignedCourse.id);
		const firstModule = course?.modules[0];
		const firstItem = firstModule?.curriculum[0];

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress:
				firstModule && firstItem
					? [
							{
								courseId: assignedCourse.id,
								completedModuleIds: [firstModule.id],
								completedItemIds: [firstItem.id]
							}
						]
					: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Current course");
		});
		expect(wrapper.text()).toContain(assignedCourse.name);
		expect(wrapper.text()).toContain("Core lessons");
		expect(wrapper.text()).toContain("Projects");
		expect(wrapper.text()).toContain("Done");
		expect(wrapper.text()).toContain("Complete");
	});

	it("matches saved progress against stable ID aliases", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];

		vi.spyOn(coursesStore, "loadCourseById").mockResolvedValueOnce({
			id: assignedCourse.id,
			name: assignedCourse.name,
			modules: [
				{
					aliases: ["legacy-module-id"],
					curriculum: [
						{
							aliases: ["legacy-item-id"],
							content: "Read the starter and explain the result.",
							id: "stable-item-id",
							title: "Stable Lesson"
						}
					],
					id: "stable-module-id",
					supplementalProjects: [],
					title: "Stable Module"
				}
			]
		});

		appStore.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [assignedCourse.id],
			courseProgress: [
				{
					courseId: assignedCourse.id,
					completedModuleIds: ["legacy-module-id"],
					completedItemIds: ["legacy-item-id"]
				}
			],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});
		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Stable Module");
		});
		expect(wrapper.text()).toContain("Done");
		expect(wrapper.text()).toContain("Complete");
	});

	it("lets staff mark selected learner progress with debounced autosave", async () => {
		vi.useFakeTimers();
		const pinia = createPinia();
		setActivePinia(pinia);

		const appStore = useAppStore();
		const coursesStore = useCoursesStore();
		const assignedCourse = coursesStore.courses[0];
		const course = await coursesStore.loadCourseById(assignedCourse.id);
		const firstModule = course?.modules[0];

		if (!firstModule) throw new Error("Expected test course module.");

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: [assignedCourse.id],
			editTutors: false,
			saveEdit: "Save"
		});

		(api.get as any).mockResolvedValueOnce({
			data: [
				{
					_id: "learner-1",
					name: "Learner",
					email: "learner@example.com",
					age: 12,
					state: "GA",
					courseAccess: [assignedCourse.id],
					courseProgress: [],
					editUsers: false,
					saveEdit: "Save"
				}
			]
		});
		(api.put as any).mockResolvedValueOnce({ data: {} });

		const wrapper = mount(CourseExplorer, {
			global: {
				plugins: [pinia]
			}
		});

		await flushPromises();

		await vi.waitFor(() => {
			expect(wrapper.text()).toContain("Learner");
			expect(wrapper.text()).toContain(assignedCourse.name);
		});

		await wrapper.find(".progress-toggle.is-module input").setValue(true);
		expect(api.put).not.toHaveBeenCalled();

		await vi.advanceTimersByTimeAsync(701);
		await flushPromises();

		expect(api.put).toHaveBeenCalledWith(
			"/users/learner-1/course-progress",
			{
				courseId: assignedCourse.id,
				completedModuleIds: [firstModule.id],
				completedItemIds: []
			}
		);
		expect(wrapper.text()).toContain("Saved");
	});
});
