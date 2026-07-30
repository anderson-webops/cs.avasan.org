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
		externalAuthProvider: {
			type: String,
			enum: ["apple", "google"],
			default: undefined,
			select: false
		},
		externalAuthSubjectHash: {
			type: String,
			default: undefined,
			match: /^[a-f\d]{64}$/,
			select: false,
			trim: true
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
		retentionExpiresAt: {
			type: Date,
			default: undefined,
			index: true
		},
		retentionPolicyDays: {
			type: Number,
			default: undefined,
			min: 1,
			select: false
		},
		lastPasswordSetupRequestID: {
			type: String,
			default: undefined,
			maxlength: 128,
			select: false
		},
		dataDeletionPendingAt: {
			type: Date,
			default: undefined,
			select: false
		},
		dataDeletionOperationID: {
			type: String,
			default: undefined,
			match: /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i,
			select: false
		},
		dataDeletionRequestedAt: {
			type: Date,
			default: undefined,
			select: false
		},
		dataDeletionReason: {
			type: String,
			enum: ["julio-request", "retention-expiry"],
			default: undefined,
			select: false
		}
	},
	{ timestamps: true }
);

studentSchema.pre("validate", function validateExternalIdentityPair() {
	const hasProvider = Boolean(this.externalAuthProvider);
	const hasSubjectHash = Boolean(this.externalAuthSubjectHash);
	if (hasProvider !== hasSubjectHash) {
		this.invalidate("externalAuthProvider", "External sign-in provider and subject hash must be stored together.");
	}
});

studentSchema.index(
	{ externalAuthProvider: 1, externalAuthSubjectHash: 1 },
	{
		partialFilterExpression: {
			externalAuthProvider: { $type: "string" },
			externalAuthSubjectHash: { $type: "string" }
		},
		unique: true
	}
);

studentSchema.set("toJSON", {
	transform(_document, returned) {
		const clean = returned as unknown as Record<string, unknown>;
		delete clean.passwordHash;
		delete clean.accessCodeHash;
		delete clean.pendingSetupCodeHash;
		delete clean.accessCodeExpiresAt;
		delete clean.externalAuthProvider;
		delete clean.externalAuthSubjectHash;
		delete clean.sessionVersion;
		delete clean.failedLoginAttempts;
		delete clean.lockedUntil;
		delete clean.retentionPolicyDays;
		delete clean.lastPasswordSetupRequestID;
		delete clean.dataDeletionPendingAt;
		delete clean.dataDeletionOperationID;
		delete clean.dataDeletionRequestedAt;
		delete clean.dataDeletionReason;
		delete clean.activeProjectCount;
		delete clean.activeProjectBytes;
		return returned;
	}
});

export const Student: Model<IStudent> = mongoose.model<IStudent>("Student", studentSchema);
