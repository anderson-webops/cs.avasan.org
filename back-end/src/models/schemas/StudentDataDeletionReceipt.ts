import type { Model } from "mongoose";
import mongoose, { Schema } from "mongoose";

export const STUDENT_DELETION_RECEIPT_RETENTION_DAYS = 90;

export interface StudentDeletionCounts {
	oauthAttempts: number;
	projects: number;
	reviews: number;
	students: number;
}

export type StudentDataDeletionStatus
	= | "in-progress"
		| "completed"
		| "needs-retry";

export interface IStudentDataDeletionReceipt {
	_id: mongoose.Types.ObjectId;
	operationID: string;
	studentID: mongoose.Types.ObjectId;
	username: string;
	status: StudentDataDeletionStatus;
	requestedAt: Date;
	completedAt?: Date;
	expiresAt: Date;
	deletedRecords?: StudentDeletionCounts;
}

const deletedRecordsSchema = new Schema<StudentDeletionCounts>(
	{
		oauthAttempts: { type: Number, min: 0, required: true },
		projects: { type: Number, min: 0, required: true },
		reviews: { type: Number, min: 0, required: true },
		students: { type: Number, min: 0, required: true }
	},
	{ _id: false }
);

const studentDataDeletionReceiptSchema
	= new Schema<IStudentDataDeletionReceipt>(
		{
			operationID: {
				type: String,
				required: true,
				unique: true,
				match:
					/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i
			},
			studentID: {
				type: Schema.Types.ObjectId,
				required: true,
				index: true
			},
			username: {
				type: String,
				required: true,
				lowercase: true,
				trim: true,
				minlength: 3,
				maxlength: 24,
				match: /^[a-z][a-z0-9-]*$/
			},
			status: {
				type: String,
				enum: ["in-progress", "completed", "needs-retry"],
				required: true
			},
			requestedAt: {
				type: Date,
				required: true
			},
			completedAt: {
				type: Date,
				default: undefined
			},
			expiresAt: {
				type: Date,
				required: true
			},
			deletedRecords: {
				type: deletedRecordsSchema,
				default: undefined
			}
		},
		{
			strict: "throw",
			timestamps: true,
			versionKey: false
		}
	);

studentDataDeletionReceiptSchema.index(
	{ expiresAt: 1 },
	{ expireAfterSeconds: 0 }
);
studentDataDeletionReceiptSchema.index({ requestedAt: -1 });

export const StudentDataDeletionReceipt: Model<IStudentDataDeletionReceipt>
	= mongoose.models.StudentDataDeletionReceipt
		|| mongoose.model<IStudentDataDeletionReceipt>(
			"StudentDataDeletionReceipt",
			studentDataDeletionReceiptSchema
		);
