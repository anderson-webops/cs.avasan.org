import type { Model } from "mongoose";
import type { IPythonProject } from "../../types/entities/IPythonProject.js";
import mongoose, { Schema } from "mongoose";

const pythonProjectFileSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		content: { type: String, default: "" }
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
			enum: ["pgzero", "python", "turtle"],
			default: "python",
			required: true
		},
		files: {
			type: [pythonProjectFileSchema],
			default: []
		},
		activeFileName: { type: String, required: true, trim: true }
	},
	{ timestamps: true }
);

pythonProjectSchema.index({ user: 1, updatedAt: -1 });

export const PythonProject: Model<IPythonProject> = mongoose.model<IPythonProject>(
	"PythonProject",
	pythonProjectSchema
);
