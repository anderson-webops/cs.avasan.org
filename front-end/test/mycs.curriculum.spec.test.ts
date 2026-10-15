import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import starters from "../scripts/scratch/projects.json";
import {
	archivedCourseCatalog,
	courseCatalog,
	loadRawCourse
} from "../src/stores/courses/index";
import {
	myCsClassroomItem,
	myCsClassroomLessons,
	myCsDestinations,
	myCsSourceUrl
} from "../src/stores/courses/mycs-classroom";
import { scratchLevel1ClassroomCourse } from "../src/stores/courses/scratch-level-1-classroom";
import { scratchLevel2Course } from "../src/stores/courses/scratch-level-2";

interface SourcePage {
	url: string;
	status: number | null;
	coverage: { kind: string; lessonIds?: string[] };
}
const inventory = JSON.parse(
	readFileSync(
		new URL("../../docs/mycs-source-inventory.json", import.meta.url),
		"utf8"
	)
) as {
	summary: {
		newGuides: number;
		teacherPages: number;
		teacherIntegrated: number;
		studentAccessible: number;
		reviewedPublicDocuments: number;
		uniqueSourceProjects: number;
	};
	teacherPages: SourcePage[];
	studentPages: SourcePage[];
	sourceProjects: {
		id: string;
		importStatus: string;
		requiredInput: string;
	}[];
};
const rawCourses = {
	"scratch-level-1": scratchLevel1ClassroomCourse,
	"scratch-level-2": scratchLevel2Course
};

describe("whole-source MyCS classroom adaptation", () => {
	it("keeps the existing five courses and two separate archived references", () => {
		expect(courseCatalog.map(course => course.id)).toEqual([
			"scratch-level-1",
			"scratch-level-2",
			"python-level-1",
			"python-level-2",
			"pygames"
		]);
		expect(archivedCourseCatalog.map(course => course.id)).toEqual([
			"python-level-2-archive",
			"pygames-archive"
		]);
		expect(scratchLevel1ClassroomCourse.modules).toHaveLength(6);
		expect(scratchLevel2Course.modules).toHaveLength(17);
	});

	it("places every additional choice exactly once in an existing module", () => {
		expect(myCsClassroomLessons).toHaveLength(80);
		expect(
			new Set(myCsClassroomLessons.map(lesson => lesson.id)).size
		).toBe(80);
		for (const lesson of myCsClassroomLessons) {
			const destination = myCsDestinations[lesson.destination];
			const course =
				rawCourses[destination.courseId as keyof typeof rawCourses];
			const module = course.modules.find(
				item => item.title === destination.moduleTitle
			);
			expect(module, lesson.id).toBeDefined();
			expect(
				module?.supplementalProjects.filter(
					item => item.id === lesson.id
				),
				lesson.id
			).toHaveLength(1);
			expect(module?.curriculum.some(item => item.id === lesson.id)).toBe(
				false
			);
			const all = Object.values(rawCourses).flatMap(item =>
				item.modules.flatMap(section => [
					...section.curriculum,
					...section.supplementalProjects
				])
			);
			expect(
				all.filter(item => item.id === lesson.id),
				lesson.id
			).toHaveLength(1);
		}
	});

	it("uses real reviewed source pages and complete bounded activity directions", () => {
		const sources = new Map(
			[...inventory.teacherPages, ...inventory.studentPages].map(page => [
				page.url,
				page
			])
		);
		for (const lesson of myCsClassroomLessons) {
			for (const path of [
				lesson.sourcePath,
				...(lesson.relatedSourcePaths ?? [])
			]) {
				const url = myCsSourceUrl(lesson, path);
				expect(url).toMatch(
					/^https:\/\/sites\.google\.com\/a\/sfusd\.edu\/mycs(?:-teacher)?\//
				);
				expect(sources.get(url)?.status, url).toBe(200);
			}
			for (const heading of ["Model", "Build", "Hard", "Check"]) {
				expect(lesson.content, `${lesson.id}: ${heading}`).toMatch(
					new RegExp(`(?:\\*\\*${heading}:\\*\\*|### ${heading})`)
				);
			}
			expect(
				lesson.content.trim().split(/\s+/).length,
				lesson.id
			).toBeGreaterThanOrEqual(60);
			expect(
				lesson.content.trim().split(/\s+/).length,
				lesson.id
			).toBeLessThanOrEqual(160);
		}
	});

	it("retains visible per-guide credit without importing external assets or solutions", () => {
		const allowedStarters = new Set([
			"blank",
			...starters.map(starter => starter.id)
		]);
		for (const lesson of myCsClassroomLessons) {
			const item = myCsClassroomItem(lesson);
			expect(item.learningPath).toBe("choice");
			expect(item.content).toContain(myCsSourceUrl(lesson));
			expect(item.content).toContain("SFUSD CS team’s MyCS");
			expect(item.content).toContain("Harvey Mudd’s MyCS");
			expect(item.content).toContain("Only this adapted guide");
			expect(item.content).toContain(
				"https://creativecommons.org/licenses/by-nc-sa/4.0/"
			);
			expect(item.content).not.toMatch(
				/<\s*(iframe|script|img|video|audio)|!\[|docs\.google\.com\/(?:forms|document)|scratch\.mit\.edu\/projects/i
			);
			expect(item.solutionLink).toBeUndefined();
			expect(item.datasetLink).toBeUndefined();
			expect(item.mediaLink).toBeUndefined();
			if (lesson.starter) {
				expect(allowedStarters.has(lesson.starter), lesson.id).toBe(
					true
				);
				expect(item.projectLink).toBe(
					`/ide?mode=scratch&starter=${lesson.starter}`
				);
			} else expect(item.projectLink).toBeUndefined();
		}
	});

	it("keeps continuation activities from launching replacement starters", () => {
		const continuationIds = [
			"mycs-events-reset-checkpoint",
			"mycs-animation-effects",
			"mycs-maze-collision",
			"mycs-maze-treasure",
			"mycs-maze-challenges",
			"mycs-game-variable-choice",
			"mycs-conditions-checkpoint-one",
			"mycs-conditions-checkpoint-two",
			"mycs-maze-checkpoint",
			"mycs-booleans-checkpoint",
			"mycs-variables-checkpoint-one",
			"mycs-lists-checkpoint",
			"mycs-procedures-checkpoint-one",
			"mycs-procedures-checkpoint-two"
		];
		for (const id of continuationIds) {
			const lesson = myCsClassroomLessons.find(item => item.id === id);
			expect(lesson, id).toBeDefined();
			expect(lesson?.starter, id).toBeUndefined();
			expect(myCsClassroomItem(lesson!).projectLink, id).toBeUndefined();
		}
	});

	it("covers every instructional teacher page while recording real limits", () => {
		expect(inventory.summary).toMatchObject({
			newGuides: 80,
			teacherPages: 103,
			teacherIntegrated: 80,
			studentAccessible: 82,
			reviewedPublicDocuments: 130,
			uniqueSourceProjects: 85
		});
		expect(
			inventory.teacherPages.filter(
				page => page.coverage.kind === "unmapped"
			)
		).toEqual([]);
		expect(
			inventory.studentPages.filter(
				page => page.coverage.kind === "review-required"
			)
		).toEqual([]);
		const ids = new Set([
			"dress-up",
			...myCsClassroomLessons.map(lesson => lesson.id)
		]);
		for (const page of inventory.teacherPages) {
			for (const id of page.coverage.lessonIds ?? [])
				expect(ids.has(id), page.url).toBe(true);
		}
		for (const project of inventory.sourceProjects) {
			expect(project.importStatus).toBe("not-imported");
			expect(project.requiredInput).toContain("source archive");
		}
	});

	it("retains the activities and credits after normal public course loading", async () => {
		const loaded = await Promise.all([
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2")
		]);
		const items = loaded.flatMap(
			course =>
				course?.modules.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				]) ?? []
		);
		for (const lesson of myCsClassroomLessons) {
			const matching = items.filter(item => item.id === lesson.id);
			expect(matching, lesson.id).toHaveLength(1);
			expect(matching[0].content).toContain(myCsSourceUrl(lesson));
			expect(matching[0].content).toContain(
				"creativecommons.org/licenses/by-nc-sa/4.0/"
			);
		}
	});
});
