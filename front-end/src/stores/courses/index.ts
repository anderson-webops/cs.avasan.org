import type { CourseSummary, RawCourse } from "./types";
import { normalizeRawCourse } from "./normalization";

export interface CourseCatalogEntry extends CourseSummary {
	load: () => Promise<RawCourse>;
	normalizeAs?: string;
}

export const courseCatalog: CourseCatalogEntry[] = [
	{
		id: "scratch-level-1",
		name: "Scratch Level 1: Classroom Edition",
		normalizeAs: "scratch-level-1-classroom",
		load: () =>
			import("./scratch-level-1-classroom").then(
				({ scratchLevel1ClassroomCourse }) =>
					scratchLevel1ClassroomCourse
			)
	},
	{
		id: "scratch-level-2",
		name: "Scratch Level 2",
		load: () =>
			import("./scratch-level-2").then(
				({ scratchLevel2Course }) => scratchLevel2Course
			)
	},
	{
		id: "python-level-1",
		name: "Python Level 1: Classroom Edition",
		normalizeAs: "python-level-1-classroom",
		load: () =>
			import("./python-level-1-classroom").then(
				({ pythonLevel1ClassroomCourse }) => pythonLevel1ClassroomCourse
			)
	},
	{
		id: "python-level-2",
		name: "Python Level 2: Classroom Edition",
		normalizeAs: "python-level-2-classroom",
		load: () =>
			import("./python-level-2-classroom").then(
				({ pythonLevel2ClassroomCourse }) => pythonLevel2ClassroomCourse
			)
	},
	{
		id: "pygames",
		name: "PyGames: Classroom Edition",
		normalizeAs: "pygames-classroom",
		load: () =>
			import("./pygames-classroom").then(
				({ pyGamesClassroomCourse }) => pyGamesClassroomCourse
			)
	}
];

export const archivedCourseCatalog: CourseCatalogEntry[] = [
	{
		id: "python-level-2-archive",
		name: "Python Level 2 — archived original",
		normalizeAs: "python-level-2",
		load: () =>
			import("./python-level-2").then(
				({ pythonLevel2Course }) => pythonLevel2Course
			)
	},
	{
		id: "pygames-archive",
		name: "PyGames — archived original",
		normalizeAs: "pygames",
		load: () =>
			import("./pygames").then(({ pyGamesCourse }) => pyGamesCourse)
	}
];

const courseCatalogById = new Map(
	[...courseCatalog, ...archivedCourseCatalog].map(entry => [entry.id, entry])
);

export function getCourseCatalogEntry(id: string) {
	return courseCatalogById.get(id) ?? null;
}

export async function loadRawCourse(id: string) {
	const entry = getCourseCatalogEntry(id);
	const rawCourse = await entry?.load();
	if (!rawCourse) return null;
	const course = normalizeRawCourse(entry?.normalizeAs ?? id, rawCourse);
	if (id === "scratch-level-1") {
		// Keep the previous curriculum available outside the new classroom path.
		const { scratchLevel1Course } = await import("./scratch-level-1");
		const reference = normalizeRawCourse(
			"scratch-level-1",
			scratchLevel1Course
		);
		course.modules.push(
			...reference.modules.map(module => ({
				...module,
				kind: "appendix" as const
			}))
		);
	}
	return course;
}
