import type { Model } from "mongoose";
import type { IPythonProject } from "../../types/entities/IPythonProject.js";
import mongoose, { Schema } from "mongoose";

const pythonProjectFileSchema = new Schema(
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

const pythonProjectSchema: Schema<IPythonProject> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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
			type: [pythonProjectFileSchema],
			default: []
		},
		activeFileName: { type: String, required: true, trim: true },
		courseID: { type: String, trim: true, maxlength: 120 },
		courseProjectKey: { type: String, trim: true, maxlength: 240 },
		courseProjectTitle: { type: String, trim: true, maxlength: 160 },
		starterLabel: { type: String, trim: true, maxlength: 80 },
		starterUrl: { type: String, trim: true, maxlength: 500 }
	},
	{ timestamps: true }
);

pythonProjectSchema.index({ user: 1, updatedAt: -1 });
pythonProjectSchema.index(
	{ user: 1, courseProjectKey: 1 },
	{ sparse: true }
);

export const PythonProject: Model<IPythonProject> = mongoose.model<IPythonProject>(
	"PythonProject",
	pythonProjectSchema
);
