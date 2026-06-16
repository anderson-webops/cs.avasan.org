import { describe, expect, it } from "vitest";
import {
	cleanCourseStatusMap,
	groupCoursesByLearnerStatus,
	orderedCoursesByLearnerStatus
} from "@/modules/courseAccess";

const courses = [
	{ id: "python-level-1", name: "Python Level 1" },
	{ id: "ap-computer-science-a", name: "AP Computer Science A" },
	{ id: "intro-to-chemistry", name: "Intro to Chemistry" }
];

describe("course access grouping", () => {
	it("groups viewable courses as current first, then past, then unassigned courses", () => {
		const groups = groupCoursesByLearnerStatus(
			courses,
			{
				courseAccess: ["intro-to-chemistry", "python-level-1"],
				courseStatus: {
					"python-level-1": "past",
					"intro-to-chemistry": "current"
				}
			},
			{ includeOther: true }
		);

		expect(groups.map(group => group.label)).toEqual([
			"Current courses",
			"Past courses",
			"Other available courses"
		]);
		expect(
			groups.map(group => group.courses.map(course => course.id))
		).toEqual([
			["intro-to-chemistry"],
			["python-level-1"],
			["ap-computer-science-a"]
		]);
	});

	it("defaults legacy assigned courses without status metadata to current", () => {
		expect(
			orderedCoursesByLearnerStatus(courses, {
				courseAccess: ["ap-computer-science-a"],
				courseStatus: undefined
			}).map(course => course.id)
		).toEqual(["ap-computer-science-a"]);
	});

	it("keeps saved status maps scoped to currently viewable courses", () => {
		expect(
			cleanCourseStatusMap(["python-level-1"], {
				"python-level-1": "past",
				"ap-computer-science-a": "past",
				"intro-to-chemistry": "unexpected"
			})
		).toEqual({
			"python-level-1": "past"
		});
	});
});
