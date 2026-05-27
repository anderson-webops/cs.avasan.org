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

	it("formats grouped lesson arcs as readable ordered markdown lists", async () => {
		const store = useCoursesStore();
		const course = await store.loadCourseById("python-level-3");
		expect(course).not.toBeNull();

		const lessonArc = findItem(
			course!,
			/Core Concepts and Learning Sequence/,
			/Core topics in this module:/
		);

		expect(lessonArc.content).toMatch(
			/Core topics in this module:\n\n1\. \*\*Introductions & Setup\*\*/
		);
		expect(lessonArc.content).toMatch(/\n2\. \*\*.+\*\*\n\s+/);
		expect(lessonArc.content).not.toMatch(/1\) .+; 2\)/s);
		expect(lessonArc.content).not.toMatch(/This lesson arc covers/i);
	});

	it("formats authored lesson setup text as neutral student-readable sections", async () => {
		const course = await loadRawCourse("c-level-1");
		expect(course).not.toBeNull();

		const setup = findItem(course!, /Program Setup/);

		expect(setup.content).toContain("This lesson begins with");
		expect(setup.content).toContain("**Key topics:**");
		expect(setup.content).toContain("- `#include`");
		expect(setup.content).toContain("**Practice target:**");
		expect(setup.content).not.toMatch(/Start with|Cover:|Students should/);
		expect(setup.content).not.toMatch(/\*\*Learning sequence:\*\*/);
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
			"The activity does not require beakers, kits, or household materials"
		);
		expect(corpus).toContain("claim-evidence-reasoning");
		expect(corpus).not.toContain(
			"Anchor the activity in web development workflow"
		);
	});

	it("keeps Intro to Chemistry authored, deduplicated, and resource-specific", async () => {
		const course = await loadRawCourse("intro-to-chemistry");
		expect(course).not.toBeNull();

		const moduleTitles = course!.modules.map(module => module.title);
		const duplicateTitles = moduleTitles.filter(
			(title, index) => moduleTitles.indexOf(title) !== index
		);
		const text = allCourseText(course);
		const items = course!.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const linkedItems = items.filter(
			item => item.mediaLink || item.datasetLink || item.solutionLink
		);
		const localMaterialLinks = items.filter(item =>
			item.datasetLink?.includes("chemistry-materials-pack.md")
		);
		const answerKeyLinks = items.filter(item =>
			item.solutionLink?.includes("chemistry-rubrics-answer-key.md")
		);
		const phetLinks = new Set(
			items
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(duplicateTitles).toEqual([]);
		expect(text).not.toMatch(/Implementation Studio|Full Lesson Authoring Pack/i);
		expect(text).not.toMatch(/Standards and Scope Expansion|Module Backlog/i);
		expect(text).not.toMatch(/Source and Asset Parity Implementation/i);
		expect(text).not.toMatch(/Guide students|Require students|Push them/i);
		expect(text).not.toContain("CHM0");
		expect(items.length).toBeGreaterThanOrEqual(70);
		expect(linkedItems.length).toBeGreaterThan(items.length * 0.75);
		expect(localMaterialLinks.length).toBeGreaterThan(24);
		expect(answerKeyLinks.length).toBeGreaterThan(16);
		expect(phetLinks.size).toBeGreaterThanOrEqual(6);
		expect(text).toContain("Remote-Safe Investigation Checklist");
		expect(text).toContain("Chemistry Explanation Rubric");
		expect(text).toContain("CHM10 Advanced Chemistry Map");
		expect(text).toContain("CHM12 Chemistry Resource Bank");
		expect(text).toContain("Stoichiometry Error Analysis");
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
