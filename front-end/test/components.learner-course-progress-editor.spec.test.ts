import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import LearnerCourseProgressEditor from "@/components/LearnerCourseProgressEditor.vue";

const progress = {
	assignedCourseIds: vi.fn(() => ["python-1"]),
	isItemComplete: vi.fn(() => false),
	isModuleComplete: vi.fn(() => false),
	isProgressCourseLoading: vi.fn(() => false),
	loadSelectedProgressCourse: vi.fn(),
	progressCourseForUser: vi.fn(() => ({
		id: "python-1",
		name: "Python Level 1",
		modules: [
			{
				id: "m1",
				title: "Variables",
				curriculum: [
					{
						id: "lesson-1",
						title: "Printing",
						content: "",
						projectLink: ""
					}
				],
				supplementalProjects: []
			}
		]
	})),
	selectProgressCourse: vi.fn(),
	selectedProgressCourseId: vi.fn(() => "python-1"),
	toggleItem: vi.fn(),
	toggleModule: vi.fn()
};

describe("LearnerCourseProgressEditor", () => {
	it("keeps module completion checkbox outside the summary toggle", () => {
		const wrapper = mount(LearnerCourseProgressEditor, {
			props: {
				courseLabel: (courseId: string) => courseId,
				progress: progress as any,
				userId: "user-1"
			}
		});

		expect(wrapper.find("summary input").exists()).toBe(false);
		expect(
			wrapper
				.find("input[aria-label='Mark module Variables complete']")
				.exists()
		).toBe(true);
	});
});
