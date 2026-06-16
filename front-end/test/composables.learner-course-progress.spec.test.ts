import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useLearnerCourseProgress } from "@/composables/useLearnerCourseProgress";

describe("useLearnerCourseProgress", () => {
	it("orders progress course choices as current first, then past", () => {
		const users = ref([
			{
				_id: "learner-1",
				name: "Learner",
				email: "learner@example.com",
				age: 12,
				state: "GA",
				courseAccess: ["python-level-1", "ap-computer-science-a"],
				courseStatus: {
					"python-level-1": "past" as const,
					"ap-computer-science-a": "current" as const
				},
				courseProgress: [],
				editUsers: false,
				saveEdit: "Save"
			}
		]);
		const progress = useLearnerCourseProgress(
			users,
			vi.fn(),
			vi.fn()
		);

		expect(progress.assignedCourseGroups("learner-1")).toEqual([
			{
				key: "current",
				label: "Current courses",
				courseIds: ["ap-computer-science-a"]
			},
			{
				key: "past",
				label: "Past courses",
				courseIds: ["python-level-1"]
			}
		]);
		expect(progress.assignedCourseIds("learner-1")).toEqual([
			"ap-computer-science-a",
			"python-level-1"
		]);
		expect(progress.selectedProgressCourseId("learner-1")).toBe(
			"ap-computer-science-a"
		);
	});
});
