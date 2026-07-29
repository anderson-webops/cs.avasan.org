import { describe, expect, it } from "vitest";
import {
	courseCatalog,
	getCourseCatalogEntry,
	loadRawCourse
} from "@/stores/courses/index";

const expectedCatalog = [
	{ id: "scratch-level-1", name: "Scratch Level 1" },
	{ id: "scratch-level-2", name: "Scratch Level 2" },
	{ id: "python-level-1", name: "Python Level 1" },
	{ id: "python-level-2", name: "Python Level 2" },
	{ id: "pygames", name: "PyGames" }
];

describe("cs.avasan.org course catalog", () => {
	it("publishes exactly the five grade-school courses", () => {
		expect(
			courseCatalog.map(({ id, name }) => ({
				id,
				name
			}))
		).toEqual(expectedCatalog);
		expect(getCourseCatalogEntry("python-level-3")).toBeNull();
	});

	it("loads every published course", async () => {
		const courses = await Promise.all(
			expectedCatalog.map(({ id }) => loadRawCourse(id))
		);

		expect(courses.map(course => course?.name)).toEqual(
			expectedCatalog.map(({ name }) => name)
		);
	});
});
