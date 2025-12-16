import type { Model } from "mongoose";
import type { ISessionNote } from "../../types/entities/ISessionNote.ts";
import mongoose, { Schema } from "mongoose";

const sessionNoteSchema: Schema<ISessionNote> = new Schema(
	{
		studentName: { type: String, required: true, trim: true },
		primaryEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
		ccEmails: { type: [String], default: [] },
		subject: { type: String, required: true },
		sessionDate: { type: Date, required: true, index: true },
		markdown: { type: String, required: true },
		html: { type: String, required: true }
	},
	{ timestamps: true }
);

sessionNoteSchema.index({ studentName: 1, sessionDate: -1 });
sessionNoteSchema.index({ primaryEmail: 1, sessionDate: -1 });

export const SessionNote: Model<ISessionNote> = mongoose.model<ISessionNote>("SessionNote", sessionNoteSchema);
