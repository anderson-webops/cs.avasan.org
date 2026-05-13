import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { researchBackedExpansionCourseIds } from "@/stores/courses/research-expansions";

async function requireCourse(courseId: string) {
	const course = await loadRawCourse(courseId);
	expect(course, courseId).not.toBeNull();
	return course!;
}

function allText(course: Awaited<ReturnType<typeof requireCourse>>) {
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

describe("implemented course development artifacts", () => {
	it("adds full lesson authoring packs to every researched course", async () => {
		for (const courseId of researchBackedExpansionCourseIds) {
			const course = await requireCourse(courseId);
			const module = course.modules.find(module =>
				module.title.endsWith(": Full Lesson Authoring Pack")
			);

			expect(module, courseId).toBeDefined();
			expect(module?.curriculum.length, courseId).toBe(4);
			expect(module?.supplementalProjects.length, courseId).toBe(2);
			expect(allText(course), courseId).toContain(
				"Full Lesson Project: Student Transfer Task"
			);
		}
	}, 30000);

	it("implements the algebra project taxonomy decision in supplemental project slots", async () => {
		for (const courseId of [
			"algebra-1a",
			"algebra-1b",
			"algebra-2a",
			"algebra-2b"
		]) {
			const course = await requireCourse(courseId);
			const text = allText(course);

			expect(text).toContain(
				"Algebra Project Taxonomy and Assessment Implementation"
			);
			expect(text).toContain("Portal Structure Decision");
			expect(
				course.modules.every(
					module => module.supplementalProjects.length >= 2
				),
				courseId
			).toBe(true);
		}
	});

	it("adds science resource banks and the elementary grade-band decision", async () => {
		for (const courseId of [
			"elementary-science",
			"middle-school-integrated-science",
			"intro-to-chemistry",
			"intro-to-physics",
			"physics-level-2"
		]) {
			const course = await requireCourse(courseId);
			const text = allText(course);

			expect(text, courseId).toContain(
				"Science Resource Shortlist and Remote Lab Bank"
			);
			expect(text, courseId).toContain("PhET");
			expect(text, courseId).toContain("Do not require household materials");
		}

		expect(allText(await requireCourse("elementary-science"))).toContain(
			"Decision: Keep One Course with K-2 and 3-5 Paths"
		);
	});

	it("rebuilds Unity around a full Unity 6.3 LTS module sequence", async () => {
		const course = await requireCourse("unity-game-development");
		const text = allText(course);
		const rebuiltModules = course.modules.filter(module =>
			module.title.startsWith("UGD")
		);

		expect(text).toContain("Unity 6.3 LTS");
		expect(rebuiltModules.length).toBeGreaterThanOrEqual(7);
		expect(
			rebuiltModules.every(module => module.supplementalProjects.length >= 2)
		).toBe(true);
		expect(text).toContain("UGD6 Capstone Production");
	});

	it("adds AP CSA alignment, C++ concept matrix, datasets, and safety policy modules", async () => {
		expect(allText(await requireCourse("ap-computer-science-a"))).toContain(
			"AP CSA Exam Alignment and FRQ Practice Map"
		);
		expect(allText(await requireCourse("cpp-level-3"))).toContain(
			"CS235/CS236-Inspired Mini Build"
		);
		expect(allText(await requireCourse("machine-learning"))).toContain(
			"Dataset, Model, and Evaluation Catalog"
		);
		expect(allText(await requireCourse("data-science-in-python"))).toContain(
			"NOAA daily weather observations"
		);
		expect(allText(await requireCourse("network-security"))).toContain(
			"Systems and Security Lab Safety Policy"
		);
		expect(allText(await requireCourse("low-level-security"))).toContain(
			"owned local fixtures"
		);
	});

	it("adds source parity modules to courses with instruction-material repos", async () => {
		for (const courseId of [
			"python-level-3",
			"cpp-level-3",
			"ap-computer-science-a",
			"unity-game-development",
			"web-development-foundations"
		]) {
			const text = allText(await requireCourse(courseId));

			expect(text, courseId).toContain("Source and Asset Parity Implementation");
			expect(text, courseId).toContain("Canonical Source Repository");
			expect(text, courseId).toContain("github.com/instruction-material");
		}
	});
});
