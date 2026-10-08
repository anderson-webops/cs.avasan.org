import type {
	CourseDefinition,
	CourseModuleItem
} from "@/stores/courses/types";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { publicCatalogStarterSharePath } from "@/modules/starterShareLink";
import { useCoursesStore } from "@/stores/courses";

function catalogItem(projectLink?: string, courseID = "scratch-level-1") {
	const item: CourseModuleItem = {
		id: "public-lesson",
		title: "Public lesson",
		content: "Public instructions",
		projectLink
	};
	const course: CourseDefinition = {
		id: courseID,
		name: "Public course",
		modules: [
			{
				id: "public-module",
				title: "Public module",
				curriculum: [item],
				supplementalProjects: []
			}
		]
	};
	return { course, item };
}

describe("public classroom starter sharing", () => {
	it("shares the original Scratch catalog starter without project contents", () => {
		const { course, item } = catalogItem(
			"/ide?mode=scratch&starter=animate-word"
		);
		expect(publicCatalogStarterSharePath(course, item)).toBe(
			item.projectLink
		);
		expect(publicCatalogStarterSharePath(course, { ...item })).toBe("");
	});

	it("does not use solutions, uploaded assets, external projects or archived courses", () => {
		for (const href of [
			undefined,
			"https://scratch.mit.edu/projects/297735619/",
			"/course-assets/private-project.zip",
			"/ide?mode=scratch&starter=unpublished-student-project",
			"/ide?mode=scratch&starter=animate-word#student-name",
			"/ide?mode=scratch&starter=animate-word&projectID=private-id",
			"/ide?mode=scratch&starter=animate-word&starter=blank"
		]) {
			const { course, item } = catalogItem(href);
			item.solutionLink = "/ide?mode=scratch&starter=animate-word";
			expect(publicCatalogStarterSharePath(course, item)).toBe("");
		}
		const archived = catalogItem(
			"/ide?mode=scratch&starter=blank",
			"python-level-2-archive"
		);
		expect(
			publicCatalogStarterSharePath(archived.course, archived.item)
		).toBe("");
	});

	it("retains public launch keys but removes descriptive title and label parameters", () => {
		const params = new URLSearchParams({
			mode: "python",
			course: "python-level-2",
			classroom: "1",
			template: "classroom-project",
			projectKey: "python-level-2-classroom:public-lesson:starter",
			starterUrl:
				"https://github.com/instruction-material/Python-Level-2/tree/main/starter",
			starterTitle: "Display title",
			starterLabel: "Display label"
		});
		const { course, item } = catalogItem(
			`/ide?${params}`,
			"python-level-2"
		);
		const shared = publicCatalogStarterSharePath(course, item);
		const query = new URL(shared, "https://cs.avasan.org").searchParams;
		expect(query.get("projectKey")).toBe(params.get("projectKey"));
		expect(query.get("starterUrl")).toBe(params.get("starterUrl"));
		expect(query.has("starterTitle")).toBe(false);
		expect(query.has("starterLabel")).toBe(false);
	});

	it("rejects private keys, arbitrary sources, identity parameters and mode changes", () => {
		const base = new URLSearchParams({
			mode: "python",
			course: "python-level-2",
			template: "classroom-project",
			projectKey: "python-level-2-classroom:public-lesson:starter"
		});
		for (const [key, value] of [
			["projectKey", "student-private-id"],
			["starterUrl", "https://example.test/private-project.py"],
			[
				"starterUrl",
				"https://github.com/instruction-material/Python-Level-2?token=secret"
			],
			["classroomSource", "../private/files"],
			["studentID", "private-id"],
			["code", "private code"],
			["mode", "java"],
			["template", "unknown-template"],
			["course", "python-level-2-archive"]
		]) {
			const params = new URLSearchParams(base);
			params.set(key, value);
			const { course, item } = catalogItem(
				`/ide?${params}`,
				"python-level-2"
			);
			expect(publicCatalogStarterSharePath(course, item)).toBe("");
		}
	});

	it("supports the actual thirteen Scratch launches and current Python-family templates", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		for (const courseID of [
			"scratch-level-1",
			"python-level-1",
			"python-level-2",
			"pygames"
		]) {
			const course = await store.loadCourseById(courseID);
			expect(course).not.toBeNull();
			const items = course!.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.filter(item => item.projectLink?.startsWith("/ide?"));
			expect(items.length).toBeGreaterThan(0);
			if (courseID === "scratch-level-1") expect(items).toHaveLength(13);
			for (const item of items) {
				expect(
					publicCatalogStarterSharePath(course, item),
					`${courseID}: ${item.id}`
				).not.toBe("");
			}
		}
	});
});
