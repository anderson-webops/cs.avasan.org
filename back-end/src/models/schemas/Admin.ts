// src/models/schemas/Admin.ts

import type { HydratedDocument, Model } from "mongoose";
import type { IAdmin } from "../../types/entities/IAdmin.js";
import mongoose, { Schema } from "mongoose";
import { passwordPlugin } from "../plugins/password.js";

/**
 * Create Mongoose Schema for Admin
 */
const adminSchema: Schema<IAdmin> = new Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
		// age: { type: String },
		// state: { type: String },
		password: { type: String, required: true },
		editAdmins: { type: Boolean, default: false, required: true }, // Added required: true
		saveEdit: { type: String, default: "Edit", required: true }, // Added required: true
		role: { type: String, default: "admin" },
		sessionVersion: { type: Number, default: 0, min: 0, required: true },
		passwordChangedAt: { type: Date, default: undefined }
	},
	{ timestamps: true }
);

/**
 * Create and handle password hashing, comparison, and removal from JSON responses
 */
adminSchema.plugin(passwordPlugin);
adminSchema.methods.toJSON = function (this: HydratedDocument<IAdmin>) {
	const clean = this.toObject() as unknown as Record<string, unknown>;
	delete clean.password;
	delete clean.sessionVersion;
	return clean;
};

/**
 * Create and export Admin model
 */
export const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);
