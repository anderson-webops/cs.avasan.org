import type { Model } from "mongoose";
import type { IScheduledSession } from "../../types/entities/IScheduledSession.ts";
import mongoose, { Schema } from "mongoose";

const scheduledSessionSchema: Schema<IScheduledSession> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true
		},
		tutor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tutor",
			default: undefined,
			index: true
		},
		title: { type: String, required: true, trim: true },
		courseId: { type: String, trim: true, default: undefined },
		startAt: { type: Date, required: true, index: true },
		endAt: { type: Date, required: true },
		timezone: { type: String, required: true, trim: true, default: "America/New_York" },
		status: {
			type: String,
			enum: ["scheduled", "cancelled", "completed", "rescheduled"],
			default: "scheduled",
			required: true,
			index: true
		},
		notes: { type: String, trim: true, default: undefined },
		sourceEmail: { type: String, lowercase: true, trim: true, default: undefined },
		externalEventId: { type: String, trim: true, default: undefined, index: true },
		recurrenceId: { type: String, trim: true, default: undefined, index: true }
	},
	{ timestamps: true }
);

scheduledSessionSchema.index({ user: 1, startAt: 1, status: 1 });
scheduledSessionSchema.index({ sourceEmail: 1, startAt: 1 });

export const ScheduledSession: Model<IScheduledSession>
	= mongoose.model<IScheduledSession>("ScheduledSession", scheduledSessionSchema);
