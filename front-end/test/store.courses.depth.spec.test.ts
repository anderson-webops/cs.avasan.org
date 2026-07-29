import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";

describe("published course depth", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("loads useful lesson and project material for every published course", async () => {
		const store = useCoursesStore();

		for (const entry of courseCatalog) {
			const course = await store.loadCourseById(entry.id);
			expect(course, entry.id).not.toBeNull();
			expect(course?.name, entry.id).toBe(entry.name);
			expect(course?.modules.length, entry.id).toBeGreaterThan(0);

			const coreModules =
				course?.modules.filter(module => module.kind !== "appendix") ??
				[];
			expect(coreModules.length, entry.id).toBeGreaterThan(0);
			expect(
				coreModules.some(module => module.curriculum.length > 0),
				entry.id
			).toBe(true);
			expect(
				coreModules.some(
					module => module.supplementalProjects.length > 0
				),
				entry.id
			).toBe(true);
		}
	});

	it("does not load upstream-only subjects through the public store", async () => {
		const store = useCoursesStore();

		await expect(store.loadCourseById("python-level-3")).resolves.toBeNull();
		await expect(
			store.loadCourseById("ap-computer-science-a")
		).resolves.toBeNull();
		await expect(
			store.loadCourseById("intro-to-chemistry")
		).resolves.toBeNull();
	});
});
