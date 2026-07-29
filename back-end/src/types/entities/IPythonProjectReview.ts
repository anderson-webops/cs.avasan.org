import type { Types } from "mongoose";
import type { PythonProjectFile, PythonProjectMode } from "./IPythonProject.js";

export type PythonProjectReviewRole = "admin";

export interface IPythonProjectReview {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	sourceProject: Types.ObjectId;
	title: string;
	mode: PythonProjectMode;
	files: PythonProjectFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	reviewer: Types.ObjectId;
	reviewerRole: PythonProjectReviewRole;
	reviewerName?: string;
	lastEditedBy?: Types.ObjectId;
	lastEditedByRole?: PythonProjectReviewRole;
	lastEditedByName?: string;
	visibleToStudent: boolean;
	note?: string;
	sourceUpdatedAt: Date;
	deletedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
