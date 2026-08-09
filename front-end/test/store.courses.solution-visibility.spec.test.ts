import type { CourseDefinition } from "@/stores/courses";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";
import { isScratchProjectEmbedUrl } from "@/modules/resourceUrls";

const SOLUTION_PATH_RE =
	/(?:^|\/)solutions?(?:\/|$)|(?:^|[-_])solutions?(?:[-_]|$)/i;
const UNUSABLE_SCRATCH_SOLUTION_IDS = new Set([
	"294540150",
	"294541979",
	"302864606",
	"302865093",
	"302865707",
	"302865909",
	"302866259",
	"313184786",
	"330287678",
	"330288612",
	"330289893",
	"330290622",
	"330291357",
	"330316142",
	"330316808"
]);
const UNUSABLE_SCRATCH_STARTER_IDS = new Set([
	"295333590",
	"295335247",
	"302996579",
	"302996964",
	"302997680",
	"302998723",
	"302999957",
	"330290958",
	"330291711",
	"330293454",
	"330294193",
	"330294909",
	"330320360",
	"330321409",
	"468227197"
]);
const COURSE_SWEEP_TIMEOUT = 180000;

function items(course: CourseDefinition) {
	return course.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function publicSolutionLeaks(course: CourseDefinition) {
	return items(course).flatMap(item => {
		const leaks: string[] = [];
		if (item.solutionLink) {
			leaks.push(`${item.title} exposes ${item.solutionLink}`);
		}
		if (item.projectLink && SOLUTION_PATH_RE.test(item.projectLink)) {
			leaks.push(`${item.title} links to ${item.projectLink}`);
		}
		return leaks;
	});
}

describe("course solution visibility", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it(
		"hides solution material from the anonymous public catalog",
		async () => {
			const coursesStore = useCoursesStore();
			const leaks: string[] = [];

			for (const { id } of courseCatalog) {
				const course = await coursesStore.loadCourseById(id);
				if (!course) {
					leaks.push(`${id} failed to load`);
					continue;
				}
				leaks.push(
					...publicSolutionLeaks(course).map(leak => `${id}: ${leak}`)
				);
			}

			expect(leaks).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("shows answer material only in Julio's teacher session", async () => {
		const appStore = useAppStore();
		appStore.setCurrentAdmin({
			_id: "julio",
			name: "Julio",
			email: "julio@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});
		const course = await useCoursesStore().loadCourseById("python-level-1");
		const solutionLinks = items(course!)
			.map(item => item.solutionLink)
			.filter(Boolean);

		expect(course).not.toBeNull();
		expect(solutionLinks.length).toBeGreaterThan(0);
		expect(solutionLinks.some(link => SOLUTION_PATH_RE.test(link!))).toBe(
			true
		);
	});

	it("exposes only canonical Scratch players to anonymous learners", async () => {
		const coursesStore = useCoursesStore();
		const scratchCourses = await Promise.all([
			coursesStore.loadCourseById("scratch-level-1"),
			coursesStore.loadCourseById("scratch-level-2")
		]);
		const pythonCourse =
			await coursesStore.loadCourseById("python-level-1");
		const scratchItems = scratchCourses.flatMap(course => items(course!));
		const scratchEmbeds = scratchItems
			.map(item => item.playableSolutionEmbedUrl)
			.filter((url): url is string => Boolean(url));
		const unusableEmbeds = scratchEmbeds.filter(embed => {
			const projectId = embed.match(/\/projects\/(\d+)\/embed$/u)?.[1];
			return projectId && UNUSABLE_SCRATCH_SOLUTION_IDS.has(projectId);
		});
		const unusableStarterLinks = scratchItems
			.map(item => item.projectLink)
			.filter((url): url is string => Boolean(url))
			.filter(url => {
				const projectId = url.match(/\/projects\/(\d+)\/?$/u)?.[1];
				return (
					projectId && UNUSABLE_SCRATCH_STARTER_IDS.has(projectId)
				);
			});
		const hungryHippoItems = scratchItems.filter(item =>
			/Hungry Hippo/i.test(item.title)
		);

		expect(scratchEmbeds.length).toBeGreaterThan(0);
		expect(scratchEmbeds.every(isScratchProjectEmbedUrl)).toBe(true);
		expect(
			items(pythonCourse!).some(item => item.playableSolutionEmbedUrl)
		).toBe(false);
		expect(scratchItems.some(item => item.solutionLink)).toBe(false);
		expect(hungryHippoItems.length).toBeGreaterThan(0);
		expect(
			hungryHippoItems.every(item => !item.playableSolutionEmbedUrl)
		).toBe(true);
		expect(unusableEmbeds).toEqual([]);
		expect(unusableStarterLinks).toEqual([]);
	});
});
