import type { Model } from "mongoose";
import type { IOAuthLoginAttempt } from "../../types/entities/IOAuthLoginAttempt.js";
import mongoose, { Schema } from "mongoose";
import { externalIdentityProviders } from "../../types/entities/IExternalIdentity.js";
import { oauthLoginModes } from "../../types/entities/IOAuthLoginAttempt.js";

const SHA256_HEX_PATTERN = /^[a-f\d]{64}$/;

const oauthLoginAttemptSchema = new Schema<IOAuthLoginAttempt>(
	{
		browserBindingHash: {
			type: String,
			required: true,
			match: SHA256_HEX_PATTERN,
			select: false
		},
		codeVerifier: {
			type: String,
			required: true,
			minlength: 32,
			maxlength: 256,
			select: false
		},
		expiresAt: {
			type: Date,
			required: true
		},
		mode: {
			type: String,
			enum: oauthLoginModes,
			required: true
		},
		nonce: {
			type: String,
			required: true,
			minlength: 32,
			maxlength: 256,
			select: false
		},
		provider: {
			type: String,
			enum: externalIdentityProviders,
			required: true,
			index: true
		},
		returnTo: {
			type: String,
			required: true,
			maxlength: 500
		},
		stateHash: {
			type: String,
			required: true,
			match: SHA256_HEX_PATTERN,
			unique: true,
			select: false
		},
		studentID: {
			type: Schema.Types.ObjectId,
			ref: "Student",
			default: undefined,
			index: true,
			select: false
		},
		studentSessionVersion: {
			type: Number,
			default: undefined,
			min: 0,
			select: false
		}
	},
	{ timestamps: true }
);

oauthLoginAttemptSchema.pre("validate", function validateStudentProof() {
	const hasCompleteStudentProof = Boolean(
		this.studentID
		&& Number.isSafeInteger(this.studentSessionVersion)
	);
	const hasAnyStudentProof = Boolean(
		this.studentID
		|| this.studentSessionVersion !== undefined
	);

	if (this.mode === "link" && !hasCompleteStudentProof) {
		this.invalidate(
			"mode",
			"Student link attempts require a complete setup-session proof."
		);
	}
	else if (this.mode === "signin" && hasAnyStudentProof) {
		this.invalidate(
			"mode",
			"Student sign-in attempts cannot contain a setup-session proof."
		);
	}
});

oauthLoginAttemptSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OAuthLoginAttempt: Model<IOAuthLoginAttempt>
	= mongoose.models.OAuthLoginAttempt
		|| mongoose.model<IOAuthLoginAttempt>(
			"OAuthLoginAttempt",
			oauthLoginAttemptSchema
		);
