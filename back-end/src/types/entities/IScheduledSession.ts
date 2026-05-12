import type { Document, Types } from "mongoose";

export type ScheduledSessionStatus
	= | "scheduled"
		| "cancelled"
		| "completed"
		| "rescheduled";

export interface IScheduledSession extends Document {
	user: Types.ObjectId;
	tutor?: Types.ObjectId;
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
	createdAt: Date;
	updatedAt: Date;
}
