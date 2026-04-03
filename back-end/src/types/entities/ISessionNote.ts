// src/types/entities/ISessionNote.ts
import type { Document, Types } from "mongoose";

export interface ISessionNote extends Document {
	user?: Types.ObjectId;
	studentName: string;
	primaryEmail: string;
	ccEmails: string[];
	subject: string;
	sessionDate: Date;
	markdown: string;
	html: string;
	createdAt: Date;
	updatedAt: Date;
}
