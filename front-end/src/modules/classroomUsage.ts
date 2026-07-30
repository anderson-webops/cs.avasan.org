import { classroomUsageIsEnabled } from "@/modules/classroomFeatures";

export type ClassroomUsageEvent = "course-open" | "ide-open";

const allowedCourseIds = new Set([
	"scratch-level-1",
	"scratch-level-2",
	"python-level-1",
	"python-level-2",
	"pygames"
]);
const storageKeyPrefix = "cs-avasan:classroom-usage";
const attemptedState = "attempted";

interface PrivacyAwareNavigator extends Navigator {
	globalPrivacyControl?: boolean;
	msDoNotTrack?: string | null;
}

interface PrivacyAwareWindow extends Window {
	doNotTrack?: string | null;
}

function privacySignalIsEnabled() {
	if (typeof navigator === "undefined") return true;

	const privacyNavigator = navigator as PrivacyAwareNavigator;
	if (privacyNavigator.globalPrivacyControl === true) return true;

	const signals = [
		privacyNavigator.doNotTrack,
		privacyNavigator.msDoNotTrack,
		typeof window === "undefined"
			? null
			: (window as PrivacyAwareWindow).doNotTrack
	];
	return signals.some(signal => {
		const normalized = signal?.toLowerCase();
		return normalized === "1" || normalized === "yes";
	});
}

function allowedCourseId(courseId?: string | null) {
	const normalized = courseId?.trim() ?? "";
	return allowedCourseIds.has(normalized) ? normalized : undefined;
}

function utcDate() {
	return new Date().toISOString().slice(0, 10);
}

function reportStorageKey(event: ClassroomUsageEvent, courseId?: string) {
	return [storageKeyPrefix, utcDate(), event, courseId ?? "none"].join(":");
}

/**
 * Attempts at most one anonymous classroom-use count per tab, event, course,
 * and UTC date. This deliberately omits account, project, page, referrer, and
 * device data. If privacy signals, browser storage, or the endpoint are
 * unavailable, the classroom keeps working without reporting.
 *
 * A tab-local attempted state is written before the request and is never
 * cleared. That can undercount a failed request, but prevents a lost response
 * from causing a duplicate count. The anonymous counter intentionally has no
 * request or browser identifier for server-side deduplication.
 */
export async function reportClassroomUsage(
	event: ClassroomUsageEvent,
	courseId?: string | null
) {
	if (event !== "course-open" && event !== "ide-open") return;

	if (
		typeof window === "undefined" ||
		typeof globalThis.fetch !== "function" ||
		!classroomUsageIsEnabled()
	) {
		return;
	}

	try {
		if (privacySignalIsEnabled()) return;
	} catch {
		return;
	}

	const safeCourseId =
		event === "course-open" ? allowedCourseId(courseId) : undefined;
	if (event === "course-open" && !safeCourseId) return;

	const storageKey = reportStorageKey(event, safeCourseId);

	try {
		if (window.sessionStorage.getItem(storageKey) !== null) return;
		window.sessionStorage.setItem(storageKey, attemptedState);
	} catch {
		return;
	}

	const payload = safeCourseId
		? { siteID: "cs", event, courseId: safeCourseId }
		: { siteID: "cs", event };

	try {
		await globalThis.fetch("/api/classroom-usage", {
			body: JSON.stringify(payload),
			cache: "no-store",
			credentials: "omit",
			headers: {
				"Content-Type": "application/json",
				"X-Classroom-Request": "1"
			},
			keepalive: true,
			method: "POST",
			mode: "same-origin",
			redirect: "error",
			referrerPolicy: "no-referrer"
		});
	} catch {
		// Reporting must never interrupt anonymous course or IDE access.
	}
}
