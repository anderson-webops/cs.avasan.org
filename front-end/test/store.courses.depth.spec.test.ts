import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
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
		expect(course?.modules.length).toBe(18);
		expect(course?.modules[0]?.supplementalProjects.length).toBe(2);
	});
});
