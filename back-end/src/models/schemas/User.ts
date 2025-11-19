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
		password: { type: String, required: true },
		editUsers: { type: Boolean, default: false, required: true }, // Added required: true
		saveEdit: { type: String, default: "Edit", required: true }, // Added required: true
		role: { type: String, default: "user" }
	},
	{ timestamps: true }
);

/**
 * Create and handle password hashing, comparison, and removal from JSON responses
 */
userSchema.plugin(passwordPlugin);

/**
 * Create and export Tutor model
 */
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
