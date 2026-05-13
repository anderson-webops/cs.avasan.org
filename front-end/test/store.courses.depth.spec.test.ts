import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { elementaryScienceCourse } from "@/stores/courses/elementary-science";
import { middleSchoolIntegratedScienceCourse } from "@/stores/courses/middle-school-integrated-science";
import { useCoursesStore } from "@/stores/courses";

describe("course catalog breadth", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("loads the permanent catalog breadth for non-Python courses", async () => {
		const store = useCoursesStore();
		const course = await store.loadCourseById("intro-to-physics");

		expect(course).not.toBeNull();
		expect(course?.modules.length).toBeGreaterThanOrEqual(17);
		expect(
			course?.modules.every(
				module =>
					module.curriculum.length >= 4 &&
					module.supplementalProjects.length >= 2
			)
		).toBe(true);
	});

	it("keeps the authored Python level course intact", async () => {
		const store = useCoursesStore();
		const course = await store.loadCourseById("python-level-1");

		expect(course).not.toBeNull();
		expect(course?.modules.length).toBeGreaterThanOrEqual(21);
		expect(course?.modules[0]?.supplementalProjects.length).toBe(2);
	});

	it("loads Zoom-friendly elementary and middle school science courses", async () => {
		const store = useCoursesStore();
		const elementary = await store.loadCourseById("elementary-science");
		const middleSchool = await store.loadCourseById(
			"middle-school-integrated-science"
		);

		expect(elementary?.modules.length).toBeGreaterThanOrEqual(8);
		expect(middleSchool?.modules.length).toBeGreaterThanOrEqual(10);

		for (const course of [elementary, middleSchool]) {
			expect(
				course?.modules.every(
					module =>
						module.curriculum.length >= 1 &&
						module.supplementalProjects.length >= 2
				)
			).toBe(true);
		}

		for (const course of [
			elementaryScienceCourse,
			middleSchoolIntegratedScienceCourse
		]) {
			expect(
				course.modules.every(
					module =>
						module.curriculum.length >= 4 &&
						module.supplementalProjects.length >= 2
				)
			).toBe(true);
		}

		expect(JSON.stringify(elementary)).toContain(
			"No physical lab supplies are required"
		);
		expect(JSON.stringify(middleSchool)).toContain(
			"No beakers, kits, or required household experiments are needed"
		);
		expect(JSON.stringify([elementary, middleSchool])).not.toContain(
			"Cover: 1."
		);
	});
});
