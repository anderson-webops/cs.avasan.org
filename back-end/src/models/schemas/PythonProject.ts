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
			ref: "Student",
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
		starterUrl: { type: String, trim: true, maxlength: 500 },
		importID: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 128,
			match: /^[\w.:-]+$/
		},
		byteCount: {
			type: Number,
			required: true,
			min: 0
		},
		deletedAt: { type: Date, default: undefined }
	},
	{ timestamps: true, optimisticConcurrency: true }
);

pythonProjectSchema.index({ user: 1, deletedAt: 1, updatedAt: -1 });
pythonProjectSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 60 * 60 });
pythonProjectSchema.index(
	{ user: 1, courseProjectKey: 1 },
	{ sparse: true }
);
pythonProjectSchema.index(
	{ user: 1, importID: 1 },
	{
		partialFilterExpression: { importID: { $type: "string" } },
		unique: true
	}
);

export const PythonProject: Model<IPythonProject> = mongoose.model<IPythonProject>(
	"PythonProject",
	pythonProjectSchema
);
