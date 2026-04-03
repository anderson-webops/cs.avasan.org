// src/models/schemas/User.ts

import type { Model } from "mongoose";
import type { IUser } from "../../types/entities/IUser.ts";
import mongoose, { Schema } from "mongoose";
import { passwordPlugin } from "../plugins/password.js";

/**
 * Create Mongoose Schema for User
 */
const userSchema: Schema<IUser> = new Schema(
	{
		tutors: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Tutor"
				}
			],
			default: []
		},
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
		age: { type: String },
		state: { type: String },
		recipientName: { type: String, trim: true, default: undefined },
		recipientNameKey: {
			type: String,
			lowercase: true,
			trim: true,
			default: undefined,
			select: false
		},
		password: { type: String, required: true },
		courseAccess: {
			type: [String],
			default: []
		},
		editUsers: { type: Boolean, default: false, required: true }, // Added required: true
		saveEdit: { type: String, default: "Edit", required: true }, // Added required: true
		role: { type: String, default: "user" }
	},
	{ timestamps: true }
);

userSchema.index({ recipientNameKey: 1 }, { unique: true, sparse: true });

/**
 * Create and handle password hashing, comparison, and removal from JSON responses
 */
userSchema.plugin(passwordPlugin);

/**
 * Create and export Tutor model
 */
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
