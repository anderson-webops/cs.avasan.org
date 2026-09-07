import { createHash } from "node:crypto";
import sourceFixture from "./fixtures/juni-scratch-project-fidelity.json";
import type {
	CourseDefinition,
	CourseModule,
	CourseModuleItem,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "@/stores/courses/types";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { isJuniScratchProjectTitle } from "@/stores/courses/juniScratchProjects";
import { normalizeRawCourse } from "@/stores/courses/normalization";
import { scratchLevel1Course } from "@/stores/courses/scratch-level-1";
import { scratchLevel2Course } from "@/stores/courses/scratch-level-2";

function matchingModule(
	course: CourseDefinition,
	rawModule: RawCourseModule
): CourseModule {
	const module = course.modules.find(
		candidate =>
			(rawModule.id && candidate.id === rawModule.id) ||
			(rawModule.id && candidate.aliases?.includes(rawModule.id)) ||
			candidate.title.replace(/[^a-z0-9]/gi, "").toLowerCase() ===
				rawModule.title.replace(/[^a-z0-9]/gi, "").toLowerCase()
	);

	if (!module) {
		throw new Error(
			`Missing normalized Scratch module ${rawModule.title}.`
		);
	}

	return module;
}

function matchingItem(
	items: CourseModuleItem[],
	rawItem: RawCourseModuleItem
): CourseModuleItem | undefined {
	return items.find(
		candidate =>
			(rawItem.id && candidate.id === rawItem.id) ||
			(rawItem.id && candidate.aliases?.includes(rawItem.id)) ||
			candidate.title === rawItem.title
	);
}

function expectProjectInstructionsPreserved(
	courseId: string,
	rawCourse: RawCourse,
	displayCourse: CourseDefinition
) {
	let projectCount = 0;

	for (const rawModule of rawCourse.modules) {
		const displayModule = matchingModule(displayCourse, rawModule);

		for (const section of ["curriculum", "supplementalProjects"] as const) {
			const otherSection =
				section === "curriculum"
					? "supplementalProjects"
					: "curriculum";

			for (const rawItem of rawModule[section].filter(item =>
				isJuniScratchProjectTitle(courseId, item.title)
			)) {
				projectCount += 1;
				const displayItem = matchingItem(
					displayModule[section],
					rawItem
				);

				expect(displayItem, rawItem.title).toBeDefined();
				expect(
					isJuniScratchProjectTitle(
						courseId,
						displayItem?.title ?? ""
					),
					`${rawItem.title} -> ${displayItem?.title}`
				).toBe(true);
				expect(displayItem?.content.trim(), rawItem.title).toBe(
					rawItem.content.trim()
				);
				expect(
					matchingItem(displayModule[otherSection], rawItem),
					rawItem.title
				).toBeUndefined();
			}
		}
	}

	expect(projectCount).toBe(44);
}

describe("original Juni Scratch project instructions", () => {
	it("preserves distinct project instructions when IDs are omitted", () => {
		const first = "1. First project.\n2. Keep this exact wording.";
		const second = "1. Second project.\n2. Keep this other wording.";
		const course = normalizeRawCourse("scratch-level-1", {
			name: "Scratch Level 1",
			modules: [
				{
					title: "GS1 Starting in Scratch",
					curriculum: [
						{ title: "Project 1 – Hungry Hippo", content: first }
					],
					supplementalProjects: []
				},
				{
					title: "GS2 Drawing",
					curriculum: [
						{ title: "Project 1 – Drawing", content: second }
					],
					supplementalProjects: []
				}
			]
		});
		const items = course.modules.flatMap(module => module.curriculum);
		expect(
			items.find(item => item.title.endsWith("Hungry Hippo"))?.content
		).toBe(first);
		expect(
			items.find(item => item.title.endsWith("Drawing"))?.content
		).toBe(second);
	});

	beforeEach(() => {
		setActivePinia(createPinia());
	});

	for (const [courseId, rawCourse] of [
		["scratch-level-1", scratchLevel1Course],
		["scratch-level-2", scratchLevel2Course]
	] as const) {
		it(`matches the original Juni source for every ${courseId} project`, () => {
			const slugify = (text: string) =>
				text
					.toLowerCase()
					.normalize("NFKD")
					.replace(/[\u0300-\u036f]/g, "")
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "");
			const originals = sourceFixture.projects.filter(
				item => item.courseId === courseId
			);
			expect(originals).toHaveLength(44);
			for (const original of originals) {
				const sourceId = slugify(
					`${courseId}-${original.moduleTitle}-${original.section === "curriculum" ? "curriculum" : "supplemental"}-${original.title}`
				);
				const matches = rawCourse.modules.flatMap(module =>
					(["curriculum", "supplementalProjects"] as const).flatMap(
						section =>
							module[section]
								.filter(
									item =>
										item.title.toLowerCase() ===
											original.title.toLowerCase() ||
										item.id === sourceId ||
										item.aliases?.includes(sourceId)
								)
								.map(item => ({ section, item }))
					)
				);
				expect(matches, original.title).toHaveLength(1);
				expect(matches[0]?.section, original.title).toBe(
					original.section
				);
				expect(
					createHash("sha256")
						.update(matches[0]!.item.content.trim())
						.digest("hex"),
					original.title
				).toBe(original.sha256);
			}
		});

		it(`preserves every ${courseId} project through learner display`, async () => {
			const displayCourse =
				await useCoursesStore().loadCourseById(courseId);

			expect(displayCourse).not.toBeNull();
			expectProjectInstructionsPreserved(
				courseId,
				rawCourse,
				displayCourse!
			);
		});
	}
});
