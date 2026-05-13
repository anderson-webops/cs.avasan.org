import { beforeEach, describe, expect, it } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog, loadRawCourse } from "@/stores/courses/index";

function allCourseText(course: Awaited<ReturnType<typeof loadRawCourse>>) {
	if (!course) return "";

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

function findItem(
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>,
	titlePattern: RegExp,
	contentPattern?: RegExp
) {
	for (const module of course.modules) {
		const item = [
			...module.curriculum,
			...module.supplementalProjects
		].find(
			item =>
				titlePattern.test(item.title) &&
				(!contentPattern || contentPattern.test(item.content))
		);

		if (item) return item;
	}

	throw new Error(`Could not find course item matching ${titlePattern}`);
}

describe("course text quality normalization", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("removes generated placeholder language from loaded catalog text", async () => {
		const courses = await Promise.all(
			courseCatalog.map(entry => loadRawCourse(entry.id))
		);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).not.toMatch(/introduce the main goal/i);
		expect(corpus).not.toMatch(/build the central artifact/i);
		expect(corpus).not.toMatch(/alternate supplemental snapshot/i);
	}, 20000);

	it("adds project requirements and completion checks to thin legacy Python project prompts", async () => {
		const course = await loadRawCourse("python-level-2");
		expect(course).not.toBeNull();

		const calendarMachine = findItem(course!, /Calendar Machine/);

		expect(calendarMachine.content).toContain("**Project goal:**");
		expect(calendarMachine.content).toContain("**Required outcome:**");
		expect(calendarMachine.content).toContain("Test zero days");
		expect(calendarMachine.content).toContain("**Completion checks:**");
	});

	it("preserves structured guidance after UI course-store normalization", async () => {
		const store = useCoursesStore();
		const course = await store.loadCourseById("python-level-2");
		expect(course).not.toBeNull();

		const calendarMachine = findItem(course!, /Calendar Machine/);

		expect(calendarMachine.content).toContain("**Project goal:**");
		expect(calendarMachine.content).toContain("**Required outcome:**");
		expect(calendarMachine.content.length).toBeGreaterThan(500);
	});

	it("adds AP-specific scaffolding to terse AP Computer Science A algorithm projects", async () => {
		const course = await loadRawCourse("ap-computer-science-a");
		expect(course).not.toBeNull();

		const binarySearch = findItem(
			course!,
			/Binary Search/,
			/\*\*Project goal:\*\*/
		);

		expect(binarySearch.content).toContain("AP CSA Java reasoning");
		expect(binarySearch.content).toContain(
			"State the sorted-data precondition"
		);
		expect(binarySearch.content).toContain("Trace at least one search");
	});

	it("keeps science investigations explicitly remote-safe and evidence-based", async () => {
		const courses = await Promise.all([
			loadRawCourse("elementary-science"),
			loadRawCourse("middle-school-integrated-science"),
			loadRawCourse("intro-to-physics"),
			loadRawCourse("intro-to-chemistry"),
			loadRawCourse("physics-level-2")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).toContain("**Remote investigation:**");
		expect(corpus).toContain(
			"Do not require beakers, kits, or household materials"
		);
		expect(corpus).toContain("claim-evidence-reasoning");
	});

	it("turns applied studio labs into explicit studio specifications", async () => {
		const course = await loadRawCourse("low-level-security");
		expect(course).not.toBeNull();

		const studioItem = course!.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.find(item => item.content.includes("**Studio focus:**"));

		expect(studioItem?.content).toContain("**Build sequence:**");
		expect(studioItem?.content).toContain("**Completion checks:**");
		expect(studioItem?.content).toContain(
			"approved local or owned targets"
		);
	});
});
