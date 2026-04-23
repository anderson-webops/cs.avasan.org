// src/models/plugins/password.ts
import type { HydratedDocument, Schema } from "mongoose";
import argon2 from "argon2";

export function passwordPlugin<T extends { password: string }>(schema: Schema<T>) {
	schema.pre("save", async function (this: HydratedDocument<T> & { skipPasswordHash?: boolean }) {
		// allow manual migrations (e.g., promoting a user to tutor) to skip re-hashing an
		// already-hashed password by setting `doc.skipPasswordHash = true`
		if (this.skipPasswordHash) {
			delete this.skipPasswordHash;
			return;
		}

		// 'isModified' comes from Document
		if (!this.isModified("password")) return;
		this.password = await argon2.hash(this.password);
	});

	schema.methods.comparePassword = function (this: HydratedDocument<T>, pw: string) {
		return argon2.verify(this.password, pw);
	};

	schema.methods.toJSON = function (this: HydratedDocument<T>) {
		const obj = this.toObject() as Record<string, unknown> & { password?: string };
		delete obj.password;
		return obj;
	};
}
