import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";

describe("course depth baseline", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("expands shallow non-Python courses to the structural baseline", async () => {
		const store = useCoursesStore();
		const course = await store.loadCourseById("intro-to-physics");

		expect(course).not.toBeNull();
		expect(course?.modules.length).toBeGreaterThanOrEqual(17);
		expect(
			course?.modules.every(
				module =>
					module.curriculum.length >= 4 &&
					module.supplementalProjects.length >= 3
			)
		).toBe(true);
	});

	it("preserves the original Python level course depth", async () => {
		const store = useCoursesStore();
		const course = await store.loadCourseById("python-level-1");

		expect(course).not.toBeNull();
		expect(course?.modules.length).toBe(18);
		expect(course?.modules[0]?.supplementalProjects.length).toBe(2);
	});
});
