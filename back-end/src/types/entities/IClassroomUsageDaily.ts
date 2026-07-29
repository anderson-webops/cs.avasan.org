export const CLASSROOM_SITES = ["cs", "math"] as const;

export type ClassroomSiteID = typeof CLASSROOM_SITES[number];

export const CLASSROOM_USAGE_EVENTS = [
	"course-open",
	"ide-open",
	"graph-open"
] as const;

export type ClassroomUsageEvent = typeof CLASSROOM_USAGE_EVENTS[number];

export const CS_CLASSROOM_COURSES = [
	{ id: "scratch-level-1", label: "Scratch Level 1" },
	{ id: "scratch-level-2", label: "Scratch Level 2" },
	{ id: "python-level-1", label: "Python Level 1: Classroom Edition" },
	{ id: "python-level-2", label: "Python Level 2: Classroom Edition" },
	{ id: "pygames", label: "PyGames: Classroom Edition" }
] as const;

export const MATH_CLASSROOM_COURSES = [
	{
		id: "early-elementary-a-math",
		label: "Early Elementary A: Numbers, Operations, and Measurement"
	},
	{
		id: "early-elementary-b-math",
		label: "Early Elementary B: Arithmetic, Fractions, and Geometry"
	},
	{
		id: "late-elementary-a-math",
		label: "Late Elementary A: Multiplication, Division, and Geometry"
	},
	{
		id: "late-elementary-b-math",
		label: "Late Elementary B: Fractions, Decimals, Units, and Coordinates"
	},
	{ id: "pre-algebra-a", label: "Pre-Algebra A" },
	{ id: "pre-algebra-b", label: "Pre-Algebra B" },
	{ id: "algebra-1a", label: "Algebra 1A" },
	{ id: "algebra-1b", label: "Algebra 1B" },
	{ id: "geometry-a", label: "Geometry A" },
	{ id: "geometry-b", label: "Geometry B" },
	{ id: "algebra-2a", label: "Algebra 2A" },
	{ id: "algebra-2b", label: "Algebra 2B" },
	{
		id: "pre-calculus-a",
		label: "Pre-Calculus and Trigonometry A"
	},
	{
		id: "pre-calculus-b",
		label: "Pre-Calculus and Trigonometry B"
	},
	{ id: "ap-calculus", label: "AP Calculus" }
] as const;

export const CLASSROOM_COURSES = [
	...CS_CLASSROOM_COURSES,
	...MATH_CLASSROOM_COURSES
] as const;

export type CSClassroomCourseID
	= typeof CS_CLASSROOM_COURSES[number]["id"];
export type MathClassroomCourseID
	= typeof MATH_CLASSROOM_COURSES[number]["id"];
export type ClassroomCourseID = typeof CLASSROOM_COURSES[number]["id"];

export interface IClassroomUsageDaily {
	day: Date;
	/**
	 * Rows written before the Math site was connected have no siteID and are
	 * interpreted as CS by the aggregate reader.
	 */
	siteID?: ClassroomSiteID;
	event: ClassroomUsageEvent;
	courseID?: ClassroomCourseID;
	count: number;
	expiresAt: Date;
}
