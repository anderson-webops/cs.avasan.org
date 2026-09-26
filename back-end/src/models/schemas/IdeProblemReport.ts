import { model, Schema } from "mongoose";
import { ideReportRetentionSeconds } from "../../utils/ideDiagnostics.js";

const schema = new Schema(
	{
		referenceID: { type: String, required: true, unique: true },
		diagnostics: { type: Schema.Types.Mixed, required: true },
		description: { type: String, maxlength: 1200, default: "" },
		status: {
			type: String,
			enum: ["new", "reviewed", "resolved"],
			default: "new"
		},
		createdAt: {
			type: Date,
			default: Date.now,
			expires: ideReportRetentionSeconds
		}
	},
	{ versionKey: false }
);

schema.index({ createdAt: -1, _id: -1 });
export const IdeProblemReport = model("IdeProblemReport", schema);
