import type { Model } from "mongoose";
import type { IPythonProjectReview } from "../../types/entities/IPythonProjectReview.js";
import mongoose, { Schema } from "mongoose";

const pythonProjectReviewFileSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		content: { type: String, default: "" },
		encoding: {
			type: String,
			enum: ["text", "base64"],
			default: "text"
		}
	},
	{ _id: false }
);

const pythonProjectReviewSchema: Schema<IPythonProjectReview> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student",
			required: true,
			index: true
		},
		sourceProject: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "PythonProject",
			required: true,
			index: true
		},
		title: { type: String, required: true, trim: true, maxlength: 120 },
		mode: {
			type: String,
			enum: ["data", "pgzero", "python", "turtle"],
			default: "python",
			required: true
		},
		files: {
			type: [pythonProjectReviewFileSchema],
			default: []
		},
		activeFileName: { type: String, required: true, trim: true },
		courseID: { type: String, trim: true, maxlength: 120 },
		courseProjectKey: { type: String, trim: true, maxlength: 240 },
		courseProjectTitle: { type: String, trim: true, maxlength: 160 },
		reviewer: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		reviewerRole: {
			type: String,
			enum: ["admin"],
			required: true
		},
		reviewerName: { type: String, trim: true, maxlength: 160 },
		lastEditedBy: {
			type: mongoose.Schema.Types.ObjectId,
			default: undefined
		},
		lastEditedByRole: {
			type: String,
			enum: ["admin"],
			default: undefined
		},
		lastEditedByName: { type: String, trim: true, maxlength: 160 },
		visibleToStudent: { type: Boolean, default: false, required: true },
		note: { type: String, default: "", maxlength: 20000 },
		sourceUpdatedAt: { type: Date, required: true },
		deletedAt: { type: Date, default: undefined }
	},
	{ timestamps: true }
);

pythonProjectReviewSchema.index({ user: 1, sourceProject: 1 }, { unique: true });
pythonProjectReviewSchema.index({ user: 1, visibleToStudent: 1, updatedAt: -1 });
pythonProjectReviewSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 60 * 60 });

export const PythonProjectReview: Model<IPythonProjectReview> = mongoose.model<IPythonProjectReview>(
	"PythonProjectReview",
	pythonProjectReviewSchema
);
