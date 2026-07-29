export const CLASSROOM_USAGE_EVENTS = ["course-open", "ide-open"] as const;

export type ClassroomUsageEvent = typeof CLASSROOM_USAGE_EVENTS[number];

export const CLASSROOM_COURSES = [
	{ id: "scratch-level-1", label: "Scratch Level 1" },
	{ id: "scratch-level-2", label: "Scratch Level 2" },
	{ id: "python-level-1", label: "Python Level 1" },
	{ id: "python-level-2", label: "Python Level 2" },
	{ id: "pygames", label: "PyGames" }
] as const;

export type ClassroomCourseID = typeof CLASSROOM_COURSES[number]["id"];

export interface IClassroomUsageDaily {
	day: Date;
	event: ClassroomUsageEvent;
	courseID?: ClassroomCourseID;
	count: number;
	expiresAt: Date;
}
