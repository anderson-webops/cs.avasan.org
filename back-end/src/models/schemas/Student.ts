import type { Model } from "mongoose";
import type { IStudent } from "../../types/entities/IStudent.js";
import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema<IStudent>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			minlength: 3,
			maxlength: 24,
			match: /^[a-z][a-z0-9-]*$/,
			index: true
		},
		passwordHash: {
			type: String,
			default: undefined,
			select: false
		},
		accessCodeHash: {
			type: String,
			default: undefined,
			select: false
		},
		pendingSetupCodeHash: {
			type: String,
			default: undefined,
			select: false
		},
		accessCodeExpiresAt: {
			type: Date,
			default: undefined
		},
		active: {
			type: Boolean,
			default: true,
			required: true
		},
		sessionVersion: {
			type: Number,
			default: 0,
			min: 0,
			required: true,
			select: false
		},
		failedLoginAttempts: {
			type: Number,
			default: 0,
			min: 0,
			required: true,
			select: false
		},
		lockedUntil: {
			type: Date,
			default: undefined,
			select: false
		},
		activeProjectCount: {
			type: Number,
			default: 0,
			min: 0,
			required: true,
			select: false
		},
		activeProjectBytes: {
			type: Number,
			default: 0,
			min: 0,
			required: true,
			select: false
		},
		passwordSetAt: {
			type: Date,
			default: undefined
		},
		lastLoginAt: {
			type: Date,
			default: undefined
		},
		lastPasswordSetupRequestID: {
			type: String,
			default: undefined,
			maxlength: 128,
			select: false
		}
	},
	{ timestamps: true }
);

studentSchema.set("toJSON", {
	transform(_document, returned) {
		const clean = returned as unknown as Record<string, unknown>;
		delete clean.passwordHash;
		delete clean.accessCodeHash;
		delete clean.pendingSetupCodeHash;
		delete clean.accessCodeExpiresAt;
		delete clean.sessionVersion;
		delete clean.failedLoginAttempts;
		delete clean.lockedUntil;
		delete clean.lastPasswordSetupRequestID;
		delete clean.activeProjectCount;
		delete clean.activeProjectBytes;
		return returned;
	}
});

export const Student: Model<IStudent> = mongoose.model<IStudent>(
	"Student",
	studentSchema
);
