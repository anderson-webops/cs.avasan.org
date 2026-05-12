import type { IScheduledSession, ScheduledSessionStatus } from "../types/entities/IScheduledSession.js";

export const scheduledSessionStatuses = [
	"scheduled",
	"cancelled",
	"completed",
	"rescheduled"
] as const satisfies readonly ScheduledSessionStatus[];

export interface ScheduledSessionPayload {
	title?: unknown;
	courseId?: unknown;
	startAt?: unknown;
	endAt?: unknown;
	timezone?: unknown;
	status?: unknown;
	notes?: unknown;
	sourceEmail?: unknown;
	externalEventId?: unknown;
	recurrenceId?: unknown;
	tutorId?: unknown;
}

export interface ParsedScheduledSessionPayload {
	title: string;
	courseId?: string;
	startAt: Date;
	endAt: Date;
	timezone: string;
	status: ScheduledSessionStatus;
	notes?: string;
	sourceEmail?: string;
	externalEventId?: string;
	recurrenceId?: string;
	tutorId?: string;
}

export interface SerializedScheduledSession {
	_id: string;
	user: string;
	tutor: string | null;
	title: string;
	courseId: string | null;
	startAt: Date;
	endAt: Date;
	timezone: string;
	status: ScheduledSessionStatus;
	notes: string | null;
	sourceEmail: string | null;
	externalEventId: string | null;
	recurrenceId: string | null;
	createdAt: Date;
	updatedAt: Date;
}

function cleanOptionalString(value: unknown): string | undefined {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed || undefined;
}

function parseRequiredDate(value: unknown, field: string): Date {
	if (typeof value !== "string" && !(value instanceof Date)) {
		throw new TypeError(`${field} is required`);
	}
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		throw new TypeError(`${field} must be a valid date`);
	}
	return date;
}

export function isScheduledSessionStatus(value: unknown): value is ScheduledSessionStatus {
	return typeof value === "string"
		&& scheduledSessionStatuses.includes(value as ScheduledSessionStatus);
}

export function parseScheduledSessionPayload(
	payload: ScheduledSessionPayload,
	defaults: { sourceEmail?: string; status?: ScheduledSessionStatus } = {}
): ParsedScheduledSessionPayload {
	const startAt = parseRequiredDate(payload.startAt, "startAt");
	const endAt = parseRequiredDate(payload.endAt, "endAt");
	if (endAt.getTime() <= startAt.getTime()) {
		throw new Error("endAt must be after startAt");
	}

	const status = payload.status ?? defaults.status ?? "scheduled";
	if (!isScheduledSessionStatus(status)) {
		throw new Error("status must be scheduled, cancelled, completed, or rescheduled");
	}

	const sourceEmail = cleanOptionalString(payload.sourceEmail)
		?.toLowerCase()
		?? cleanOptionalString(defaults.sourceEmail)?.toLowerCase();

	return {
		title: cleanOptionalString(payload.title) ?? "Class session",
		courseId: cleanOptionalString(payload.courseId),
		startAt,
		endAt,
		timezone: cleanOptionalString(payload.timezone) ?? "America/New_York",
		status,
		notes: cleanOptionalString(payload.notes),
		sourceEmail,
		externalEventId: cleanOptionalString(payload.externalEventId),
		recurrenceId: cleanOptionalString(payload.recurrenceId),
		tutorId: cleanOptionalString(payload.tutorId)
	};
}

export function serializeScheduledSession(
	session: Pick<
		IScheduledSession,
		| "_id"
		| "user"
		| "tutor"
		| "title"
		| "courseId"
		| "startAt"
		| "endAt"
		| "timezone"
		| "status"
		| "notes"
		| "sourceEmail"
		| "externalEventId"
		| "recurrenceId"
		| "createdAt"
		| "updatedAt"
	>
): SerializedScheduledSession {
	return {
		_id: String(session._id),
		user: String(session.user),
		tutor: session.tutor ? String(session.tutor) : null,
		title: session.title,
		courseId: session.courseId ?? null,
		startAt: session.startAt,
		endAt: session.endAt,
		timezone: session.timezone,
		status: session.status,
		notes: session.notes ?? null,
		sourceEmail: session.sourceEmail ?? null,
		externalEventId: session.externalEventId ?? null,
		recurrenceId: session.recurrenceId ?? null,
		createdAt: session.createdAt,
		updatedAt: session.updatedAt
	};
}

export function defaultSessionNoteSubject(sessionDate: Date): string {
	const month = String(sessionDate.getUTCMonth() + 1).padStart(2, "0");
	const day = String(sessionDate.getUTCDate()).padStart(2, "0");
	return `Session Notes (${month}/${day})`;
}
