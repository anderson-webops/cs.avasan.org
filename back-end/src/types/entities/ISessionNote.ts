// src/types/entities/ISessionNote.ts
import type { Document } from "mongoose";

export interface ISessionNote extends Document {
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
