import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import {
	researchBackedExpansionCourseIds,
	researchBackedExpansionProfiles
} from "@/stores/courses/research-expansions";

function allText(course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>) {
	return course.modules
		.flatMap(module => [
			module.title,
			...module.curriculum.flatMap(item => [item.title, item.content]),
			...module.supplementalProjects.flatMap(item => [
				item.title,
				item.content
			])
		])
		.join("\n");
}

describe("research-backed course family expansions", () => {
	it("adds the standards, sequencing, and project studio modules to every audited course", async () => {
		expect(researchBackedExpansionCourseIds.length).toBeGreaterThan(35);

		for (const courseId of researchBackedExpansionCourseIds) {
			const course = await loadRawCourse(courseId);
			const profile = researchBackedExpansionProfiles[courseId];

			expect(course, courseId).not.toBeNull();
			expect(profile, courseId).toBeDefined();

			const coreExpansionTitles = [
				`${profile.family}: Standards and Scope Expansion`,
				`${profile.family}: Module Backlog and Sequencing`,
				`${profile.family}: Project and Assessment Studios`
			];
			const titles = course!.modules.map(module => module.title);
			for (const title of coreExpansionTitles) {
				expect(titles, courseId).toContain(title);
			}

			const expansionModules = course!.modules.filter(module =>
				coreExpansionTitles.includes(module.title)
			);

			expect(expansionModules, courseId).toHaveLength(3);
			expect(
				expansionModules.every(module => module.curriculum.length >= 4),
				courseId
			).toBe(true);
			expect(
				expansionModules.every(
					module => module.supplementalProjects.length >= 2
				),
				courseId
			).toBe(true);
		}
	}, 30000);

	it("carries the researched standards, tooling, safety, and assessment anchors into course text", async () => {
		const courseIds = [
			"ai-level-1",
			"intro-to-chemistry",
			"c-level-1",
			"network-security",
			"machine-learning",
			"unity-game-development",
			"elementary-science"
		];
		const courses = await Promise.all(
			courseIds.map(courseId => loadRawCourse(courseId))
		);
		const corpus = courses
			.filter((course): course is NonNullable<typeof course> =>
				Boolean(course)
			)
			.map(allText)
			.join("\n");

		expect(corpus).toContain("NIST AI RMF");
		expect(corpus).toContain("ACS Chemistry Guidelines");
		expect(corpus).toContain("ISO C++ Core Guidelines");
		expect(corpus).toContain("OWASP Web Security Testing Guide");
		expect(corpus).toContain("scikit-learn Model Evaluation");
		expect(corpus).toContain("Unity Learn");
		expect(corpus).toContain("No physical supplies beyond paper");
		expect(corpus).toContain("Project Studio:");
		expect(corpus).toContain("Assessment and Checkpoint Model");
	});
});
