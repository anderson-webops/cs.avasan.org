import type { Model } from "mongoose";
import type { IInternalEmail } from "../../types/entities/IInternalEmail.ts";
import mongoose, { Schema } from "mongoose";

const internalEmailSchema: Schema<IInternalEmail> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true
		},
		matchedRecipientEmail: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
			index: true
		},
		primaryEmail: {
			type: String,
			required: true,
			lowercase: true,
			trim: true
		},
		ccEmails: { type: [String], default: [] },
		fromAddress: {
			type: String,
			required: true,
			lowercase: true,
			trim: true
		},
		subject: { type: String, required: true },
		markdown: { type: String, required: true },
		html: { type: String, required: true },
		messageId: { type: String, default: null },
		transportUsed: {
			type: String,
			enum: ["primary-local", "fallback-gmail"],
			required: true
		},
		sentAt: { type: Date, required: true, index: true }
	},
	{ timestamps: true }
);

internalEmailSchema.index({ user: 1, sentAt: -1 });
internalEmailSchema.index({ matchedRecipientEmail: 1, sentAt: -1 });

export const InternalEmail: Model<IInternalEmail> = mongoose.model<IInternalEmail>(
	"InternalEmail",
	internalEmailSchema
);
