import type { Document, Types } from "mongoose";

export interface IInternalEmail extends Document {
	user: Types.ObjectId;
	matchedRecipientEmail: string;
	primaryEmail: string;
	ccEmails: string[];
	fromAddress: string;
	subject: string;
	markdown: string;
	html: string;
	messageId?: string;
	transportUsed: "primary-local" | "fallback-gmail";
	sentAt: Date;
	createdAt: Date;
	updatedAt: Date;
}
