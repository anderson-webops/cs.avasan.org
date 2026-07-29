import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";

const COURSE_SWEEP_TIMEOUT = 180000;

describe("published course quality", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it(
		"keeps every published course structurally readable",
		async () => {
			const store = useCoursesStore();
			const failures: string[] = [];

			for (const entry of courseCatalog) {
				const course = await store.loadCourseById(entry.id);
				if (!course) {
					failures.push(`${entry.id}: failed to load`);
					continue;
				}

				if (course.id !== entry.id || course.name !== entry.name) {
					failures.push(`${entry.id}: summary does not match course`);
				}

				const moduleIds = new Set<string>();
				for (const module of course.modules) {
					if (!module.id.trim() || !module.title.trim()) {
						failures.push(`${entry.id}: module is missing an id or title`);
					}
					if (moduleIds.has(module.id)) {
						failures.push(
							`${entry.id}: duplicate module id ${module.id}`
						);
					}
					moduleIds.add(module.id);

					const moduleItems = [
						...module.curriculum,
						...module.supplementalProjects
					];
					const itemIds = new Set<string>();
					for (const item of moduleItems) {
						if (!item.id.trim() || !item.title.trim()) {
							failures.push(
								`${entry.id} / ${module.title}: item is missing an id or title`
							);
						}
						if (itemIds.has(item.id)) {
							failures.push(
								`${entry.id} / ${module.title}: duplicate item id ${item.id}`
							);
						}
						itemIds.add(item.id);
					}
				}
			}

			expect(failures).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps the published catalog small and ordered for young learners", () => {
		expect(courseCatalog.map(course => course.id)).toEqual([
			"scratch-level-1",
			"scratch-level-2",
			"python-level-1",
			"python-level-2",
			"pygames"
		]);
	});
});
