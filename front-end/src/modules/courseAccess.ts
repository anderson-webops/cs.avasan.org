import type { User } from "@/stores/app";
import type { CourseSummary } from "@/stores/courses/types";

export type CourseAccessStatus = "current" | "past";
export type CourseStatusMap = Record<string, CourseAccessStatus>;

export interface CourseAccessGroup<T extends CourseSummary = CourseSummary> {
	key: "current" | "past" | "other";
	label: string;
	courses: T[];
}

const VALID_COURSE_STATUSES = new Set<CourseAccessStatus>(["current", "past"]);

function normalizeStatus(value: unknown): CourseAccessStatus {
	return value === "past" ? "past" : "current";
}

export function courseStatusForUser(
	user: Pick<User, "courseStatus"> | null | undefined,
	courseId: string
): CourseAccessStatus {
	return normalizeStatus(user?.courseStatus?.[courseId]);
}

export function cleanCourseStatusMap(
	courseIds: string[],
	statusMap: Record<string, unknown> | null | undefined
): CourseStatusMap {
	const allowed = new Set(courseIds);
	const cleaned: CourseStatusMap = {};

	for (const courseId of courseIds) {
		const rawStatus = statusMap?.[courseId];
		cleaned[courseId] = VALID_COURSE_STATUSES.has(
			rawStatus as CourseAccessStatus
		)
			? (rawStatus as CourseAccessStatus)
			: "current";
	}

	for (const courseId of Object.keys(statusMap ?? {})) {
		if (allowed.has(courseId)) continue;
		delete cleaned[courseId];
	}

	return cleaned;
}

export function groupCoursesByLearnerStatus<T extends CourseSummary>(
	courses: T[],
	user: Pick<User, "courseAccess" | "courseStatus"> | null | undefined,
	options: { includeOther?: boolean } = {}
): CourseAccessGroup<T>[] {
	const accessible = new Set(user?.courseAccess ?? []);
	const groups: CourseAccessGroup<T>[] = [
		{ key: "current", label: "Current courses", courses: [] },
		{ key: "past", label: "Past courses", courses: [] },
		{ key: "other", label: "Other available courses", courses: [] }
	];

	for (const course of courses) {
		if (!accessible.has(course.id)) {
			if (options.includeOther) {
				groups[2].courses.push(course);
			}
			continue;
		}

		const status = courseStatusForUser(user, course.id);
		groups[status === "past" ? 1 : 0].courses.push(course);
	}

	return groups.filter(group => group.courses.length > 0);
}

export function orderedCoursesByLearnerStatus<T extends CourseSummary>(
	courses: T[],
	user: Pick<User, "courseAccess" | "courseStatus"> | null | undefined,
	options: { includeOther?: boolean } = {}
): T[] {
	return groupCoursesByLearnerStatus(courses, user, options).flatMap(
		group => group.courses
	);
}
