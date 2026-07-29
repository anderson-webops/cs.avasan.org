import { describe, expect, it } from "vitest";
import {
	archivedCourseCatalog,
	courseCatalog,
	loadRawCourse
} from "@/stores/courses/index";
import type {
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "@/stores/courses/types";

interface ClassroomCourseExpectation {
	archiveId: string;
	classroomId: string;
	classroomName: string;
	completedSourceMinimum: number;
	currentId: string;
	currentName: string;
	launchProjectTitles: string[];
	launchTitle: string;
	mode: "pgzero" | "python";
	projectMinimum: number;
}

const classroomCourses: ClassroomCourseExpectation[] = [
	{
		archiveId: "python-level-2-archive",
		classroomId: "python-level-2-classroom",
		classroomName: "Python Level 2: Classroom Edition",
		completedSourceMinimum: 90,
		currentId: "python-level-2",
		currentName: "Python Level 2",
		launchProjectTitles: [
			"Launch Project 1: Mad Libs Studio",
			"Launch Project 2: Change Machine",
			"Launch Project 3: Caesar Cipher Lab",
			"Launch Project 4: Rock, Paper, Scissors Arena",
			"Launch Project 5: Song Generator",
			"Launch Project 6: To-Do List Manager",
			"Launch Project 7: Wordsmith Challenge",
			"Launch Project 8: Blackjack Table"
		],
		launchTitle: "Classroom Launch: Build, Extend, Explain",
		mode: "python",
		projectMinimum: 95
	},
	{
		archiveId: "pygames-archive",
		classroomId: "pygames-classroom",
		classroomName: "PyGames: Classroom Edition",
		completedSourceMinimum: 85,
		currentId: "pygames",
		currentName: "PyGames",
		launchProjectTitles: [
			"Launch Project 1: Bouncing Alien",
			"Launch Project 2: Apple Collector",
			"Launch Project 3: Asteroid Dodge",
			"Launch Project 4: Jewel Catch",
			"Launch Project 5: Keep Up",
			"Launch Project 6: Platformer Game",
			"Launch Project 7: Alien Catch",
			"Launch Project 8: Target Shoot",
			"Launch Project 9: Space Battle",
			"Launch Project 10: Space Invaders"
		],
		launchTitle: "Classroom Launch: Play, Extend, Explain",
		mode: "pgzero",
		projectMinimum: 85
	}
];

function isClassroomProject(
	module: RawCourseModule,
	item: RawCourseModuleItem
) {
	if (module.kind === "appendix") return false;

	return (
		!!item.projectLink ||
		!!item.solutionLink ||
		/\b(?:project|practice|exploration|recap)\b/i.test(item.title) ||
		/^Check-In #\d+:/i.test(item.title)
	);
}

function classroomProjects(course: RawCourse) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects]
			.filter(item => isClassroomProject(module, item))
			.map(item => ({ item, module }))
	);
}

async function requireCourse(courseId: string) {
	const course = await loadRawCourse(courseId);
	expect(course, courseId).not.toBeNull();
	if (!course) throw new Error(`Could not load ${courseId}.`);
	return course;
}

describe("Julio's Python Level 2 and PyGames classroom editions", () => {
	it("keeps exactly five current courses and separates archived originals", () => {
		expect(courseCatalog.map(({ id, name }) => ({ id, name }))).toEqual([
			{ id: "scratch-level-1", name: "Scratch Level 1" },
			{ id: "scratch-level-2", name: "Scratch Level 2" },
			{
				id: "python-level-1",
				name: "Python Level 1: Classroom Edition"
			},
			{
				id: "python-level-2",
				name: "Python Level 2: Classroom Edition"
			},
			{ id: "pygames", name: "PyGames: Classroom Edition" }
		]);
		expect(
			archivedCourseCatalog.map(({ id, name }) => ({ id, name }))
		).toEqual([
			{
				id: "python-level-2-archive",
				name: "Python Level 2 — archived original"
			},
			{
				id: "pygames-archive",
				name: "PyGames — archived original"
			}
		]);
	});

	it.each(classroomCourses)(
		"loads the Classroom Edition behind stable current ID $currentId",
		async expectation => {
			const [currentCourse, archivedCourse] = await Promise.all([
				requireCourse(expectation.currentId),
				requireCourse(expectation.archiveId)
			]);

			expect(currentCourse.name).toBe(expectation.classroomName);
			expect(currentCourse.modules[0]?.title).toBe(
				expectation.launchTitle
			);
			expect(
				currentCourse.modules.slice(1).map(module => module.title)
			).toEqual(archivedCourse.modules.map(module => module.title));
			expect(archivedCourse.name).toBe(expectation.currentName);
		}
	);

	it.each(classroomCourses)(
		"provides a leveled launch path for $currentId",
		async expectation => {
			const course = await requireCourse(expectation.currentId);
			const launchModule = course.modules[0]!;
			const items = [
				...launchModule.curriculum,
				...launchModule.supplementalProjects
			];
			const launchProjects = items.filter(item =>
				/^Launch Project \d+:/.test(item.title)
			);

			expect(launchProjects.map(item => item.title)).toEqual(
				expectation.launchProjectTitles
			);
			expect(
				launchModule.curriculum.every(
					item => item.learningPath === "core"
				)
			).toBe(true);
			expect(
				launchModule.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				)
			).toBe(true);
			expect(launchModule.curriculum[0]?.content).toContain(
				"**Course flow:**"
			);
		}
	);

	it.each(classroomCourses)(
		"gives every current $currentId project Normal and Hard IDE work areas",
		async expectation => {
			const course = await requireCourse(expectation.currentId);
			const projects = classroomProjects(course);
			let completedSourceCount = 0;

			expect(projects.length).toBeGreaterThanOrEqual(
				expectation.projectMinimum
			);

			for (const { item, module } of projects) {
				const label = `${module.title} / ${item.title}`;
				expect(item.content, label).toContain("**Normal:**");
				expect(item.content, label).toContain("**Hard:**");
				expect(item.projectLink, label).toMatch(/^\/python-ide\?/);

				const projectUrl = new URL(
					item.projectLink!,
					"https://cs.avasan.org"
				);
				expect(projectUrl.searchParams.get("classroom"), label).toBe(
					"1"
				);
				expect(projectUrl.searchParams.get("course"), label).toBe(
					expectation.currentId
				);
				expect(projectUrl.searchParams.get("mode"), label).toBe(
					expectation.mode
				);
				expect(projectUrl.searchParams.get("template"), label).toBe(
					"classroom-project"
				);
				expect(
					projectUrl.searchParams.get("projectKey"),
					label
				).toContain(`${expectation.classroomId}:`);
				if (projectUrl.searchParams.has("starterUrl")) {
					completedSourceCount += 1;
				}
			}

			expect(completedSourceCount).toBeGreaterThanOrEqual(
				expectation.completedSourceMinimum
			);
			expect(JSON.stringify(course)).not.toMatch(/\bbeginner\b/i);
		}
	);

	it("uses completed source files for representative console and game projects", async () => {
		const [pythonCourse, pyGamesCourse] = await Promise.all([
			requireCourse("python-level-2"),
			requireCourse("pygames")
		]);
		const madLibs = classroomProjects(pythonCourse).find(
			({ item }) => item.title === "PS1 Project 1: Mad Libs"
		)?.item;
		const bouncingAlien = classroomProjects(pyGamesCourse).find(
			({ item }) => item.title === "PyG1 Project 2: Bouncing Alien"
		)?.item;

		expect(
			new URL(
				madLibs!.projectLink!,
				"https://cs.avasan.org"
			).searchParams.get("starterUrl")
		).toBe(
			"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Mad-Libs/solution"
		);
		expect(
			new URL(
				bouncingAlien!.projectLink!,
				"https://cs.avasan.org"
			).searchParams.get("starterUrl")
		).toBe(
			"https://github.com/instruction-material/PyGames/blob/main/PyG1-Bouncing-Alien.py"
		);
	});
});
