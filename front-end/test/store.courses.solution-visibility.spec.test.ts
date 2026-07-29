import type { CourseDefinition } from "@/stores/courses";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";

const SOLUTION_PATH_RE =
	/(?:^|\/)solutions?(?:\/|$)|(?:^|[-_])solutions?(?:[-_]|$)/i;
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
		const course = await useCoursesStore().loadCourseById(
			"python-level-1"
		);
		const solutionLinks = items(course!)
			.map(item => item.solutionLink)
			.filter(Boolean);

		expect(course).not.toBeNull();
		expect(solutionLinks.length).toBeGreaterThan(0);
		expect(solutionLinks.some(link => SOLUTION_PATH_RE.test(link!))).toBe(
			true
		);
	});
});
