import type { CourseDefinition } from "@/stores/courses";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";

const SOLUTION_PATH_RE =
	/(?:^|\/)solutions?(?:\/|$)|(?:^|[-_])solutions?(?:[-_]|$)/i;
const COURSE_SWEEP_TIMEOUT = 180000;

function courseLinks(course: CourseDefinition) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects].flatMap(item => [
			item.projectLink,
			item.solutionLink
		])
	);
}

function courseSolutionLinks(course: CourseDefinition) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects]
			.map(item => item.solutionLink)
			.filter((link): link is string => Boolean(link))
	);
}

function learnerSolutionLeaks(course: CourseDefinition) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects].flatMap(item => {
			const leaks: string[] = [];

			if (item.solutionLink) {
				leaks.push(
					`${module.title} / ${item.title} exposes solutionLink ${item.solutionLink}`
				);
			}

			if (item.projectLink && SOLUTION_PATH_RE.test(item.projectLink)) {
				leaks.push(
					`${module.title} / ${item.title} exposes solution projectLink ${item.projectLink}`
				);
			}

			return leaks;
		})
	);
}

describe("course solution visibility", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("omits solution links from learner course data", async () => {
		const appStore = useAppStore();
		appStore.setCurrentUser({
			_id: "learner-1",
			name: "Learner",
			email: "learner@example.com",
			age: 13,
			state: "GA",
			courseAccess: ["ap-computer-science-a"],
			editUsers: false,
			saveEdit: "Save"
		});

		const coursesStore = useCoursesStore();
		const course = await coursesStore.loadCourseById(
			"ap-computer-science-a"
		);

		expect(course).not.toBeNull();
		expect(courseSolutionLinks(course!)).toEqual([]);
		expect(courseLinks(course!).filter(Boolean)).not.toContain(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution"
		);
	});

	it(
		"omits dedicated solution paths from every learner course",
		async () => {
			const appStore = useAppStore();
			appStore.setCurrentUser({
				_id: "learner-1",
				name: "Learner",
				email: "learner@example.com",
				age: 13,
				state: "GA",
				courseAccess: courseCatalog.map(course => course.id),
				editUsers: false,
				saveEdit: "Save"
			});

			const coursesStore = useCoursesStore();
			const leaks: string[] = [];

			for (const { id } of courseCatalog) {
				const course = await coursesStore.loadCourseById(id);

				if (!course) {
					leaks.push(`${id} failed to load`);
					continue;
				}

				leaks.push(
					...learnerSolutionLeaks(course).map(
						leak => `${id}: ${leak}`
					)
				);
			}

			expect(leaks).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("includes starter and solution links for staff course data", async () => {
		const appStore = useAppStore();
		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: ["ap-computer-science-a"],
			editTutors: false,
			saveEdit: "Save"
		});

		const coursesStore = useCoursesStore();
		const course = await coursesStore.loadCourseById(
			"ap-computer-science-a"
		);
		const links = courseLinks(course!);

		expect(course).not.toBeNull();
		expect(links).toContain(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter"
		);
		expect(links).toContain(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution"
		);
	});

	it("reloads the learner-safe course object after a staff course was cached", async () => {
		const appStore = useAppStore();
		const coursesStore = useCoursesStore();

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: ["ap-computer-science-a"],
			editTutors: false,
			saveEdit: "Save"
		});

		const staffCourse = await coursesStore.loadCourseById(
			"ap-computer-science-a"
		);
		expect(courseSolutionLinks(staffCourse!)).toContain(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution"
		);

		appStore.setCurrentTutor(null);
		appStore.setCurrentUser({
			_id: "learner-1",
			name: "Learner",
			email: "learner@example.com",
			age: 13,
			state: "GA",
			courseAccess: ["ap-computer-science-a"],
			editUsers: false,
			saveEdit: "Save"
		});

		const learnerCourse = await coursesStore.loadCourseById(
			"ap-computer-science-a"
		);

		expect(courseSolutionLinks(learnerCourse!)).toEqual([]);
	});
});
