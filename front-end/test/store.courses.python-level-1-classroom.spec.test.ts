import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import {
	getCourseCatalogEntry,
	loadRawCourse
} from "@/stores/courses/index";
import type {
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "@/stores/courses/types";

const classroomTemplates = new Set([
	"circle-art",
	"classroom-project",
	"firework-festival",
	"flower-garden",
	"maze-explorer",
	"neon-trail",
	"picasso",
	"spiral-galaxy",
	"triangle-motion",
	"turtle-race"
]);

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

async function requireCurrentCourse() {
	const course = await loadRawCourse("python-level-1");
	expect(course).not.toBeNull();
	if (!course) throw new Error("Could not load Python Level 1.");
	return course;
}

describe("Julio's Python Level 1 classroom edition", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("publishes the Classroom Edition behind the stable Level 1 ID", async () => {
		const course = await requireCurrentCourse();

		expect(course.name).toBe("Python Level 1: Classroom Edition");
		expect(course.modules[0]?.title).toBe(
			"Classroom Launch: Normal and Hard Projects"
		);
		expect(
			getCourseCatalogEntry("python-level-1-classroom")
		).toBeNull();
	});

	it("provides all nine classroom launch projects in leveled paths", async () => {
		const course = await requireCurrentCourse();
		const launchModule = course.modules[0]!;
		const launchProjects = [
			...launchModule.curriculum,
			...launchModule.supplementalProjects
		].filter(item => /^Launch Project \d+:/.test(item.title));

		expect(launchProjects.map(item => item.title)).toEqual([
			"Launch Project 1: Color Circle Art",
			"Launch Project 2: Picasso Keyboard Painter",
			"Launch Project 3: Triangle Motion",
			"Launch Project 4: Neon Trail Painter",
			"Launch Project 5: Firework Festival",
			"Launch Project 6: Spiral Galaxy",
			"Launch Project 7: Turtle Race Day",
			"Launch Project 8: Flower Garden Clicker",
			"Launch Project 9: Maze Explorer"
		]);
		expect(launchModule.estimatedTime).toBe(
			"2–3 sessions · 45–60 minutes each"
		);
		expect(
			launchModule.curriculum.every(
				item => item.learningPath === "core"
			)
		).toBe(true);
		expect(
			launchModule.supplementalProjects.filter(
				item => item.learningPath === "choice"
			)
		).toHaveLength(5);
		expect(
			launchModule.supplementalProjects.filter(
				item => item.learningPath === "challenge"
			)
		).toHaveLength(4);
	});

	it("opens every project in the downstream classroom IDE contract", async () => {
		const course = await requireCurrentCourse();
		const projects = classroomProjects(course);

		expect(projects.length).toBeGreaterThan(100);

		for (const { item, module } of projects) {
			const label = `${module.title} / ${item.title}`;
			expect(item.content, label).toContain("**Normal:**");
			expect(item.content, label).toContain("**Hard:**");
			expect(item.projectLink, label).toMatch(/^\/ide\?/);

			const projectUrl = new URL(
				item.projectLink!,
				"https://cs.avasan.org"
			);
			expect(projectUrl.searchParams.get("classroom"), label).toBe("1");
			expect(projectUrl.searchParams.get("course"), label).toBe(
				"python-level-1"
			);
			expect(projectUrl.searchParams.get("mode"), label).toBe("turtle");
			expect(
				classroomTemplates.has(
					projectUrl.searchParams.get("template") ?? ""
				),
				label
			).toBe(true);
			expect(projectUrl.searchParams.get("projectKey"), label).toContain(
				"python-level-1-classroom:"
			);
		}

		expect(JSON.stringify(course)).not.toMatch(/\bbeginner\b/i);
	});

	it("keeps completed source projects available as IDE starters", async () => {
		const course = await requireCurrentCourse();
		const movementModule = course.modules.find(
			module => module.title === "GrS1 Coordinates and Movement"
		);
		const exploration = movementModule?.curriculum.find(item =>
			item.title.includes("Turtle Exploration")
		);

		expect(exploration).toBeDefined();
		expect(exploration!.content).toContain("**Original project files:**");
		expect(exploration!.content).toContain(
			"Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/starter"
		);

		const projectUrl = new URL(
			exploration!.projectLink!,
			"https://cs.avasan.org"
		);
		expect(projectUrl.searchParams.get("template")).toBe(
			"classroom-project"
		);
		expect(projectUrl.searchParams.get("starterUrl")).toBe(
			"https://github.com/instruction-material/Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/solution"
		);
	});

	it("preserves progress IDs when launch projects become optional", async () => {
		const course =
			await useCoursesStore().loadCourseById("python-level-1");
		const launchModule = course?.modules.find(
			module =>
				module.title ===
				"Classroom Launch: Normal and Hard Projects"
		);
		const triangle = launchModule?.supplementalProjects.find(
			item => item.title === "Launch Project 3: Triangle Motion"
		);

		expect(triangle?.id).toBe(
			"python-level-1-classroom-classroom-launch-normal-and-hard-projects-curriculum-launch-project-3-triangle-motion"
		);
		expect(triangle?.aliases).toContain(
			"python-level-1-classroom-launch-normal-and-hard-projects-supplemental-launch-project-3-triangle-motion"
		);
	});
});
