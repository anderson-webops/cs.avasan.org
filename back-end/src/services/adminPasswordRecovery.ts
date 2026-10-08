import argon2 from "argon2";
import { Admin } from "../models/schemas/Admin.js";
import { ADMIN_SINGLETON_ID } from "../security/adminIdentity.js";
import { AdminPasswordRecoveryRefusal } from "../security/adminPasswordRecovery.js";
import {
	isValidTeacherPassword,
	MIN_TEACHER_PASSWORD_LENGTH
} from "../security/passwordPolicy.js";

interface Query<T> {
	exec: () => Promise<T>;
}

interface AdminPasswordRecoverySnapshot {
	_id: { toString: () => string };
	name: string;
	email: string;
	role: string;
	password: string;
	sessionVersion?: number;
}

export interface AdminPasswordRecoveryModel {
	countDocuments: (filter: Record<string, never>) => Query<number>;
	findOne: (
		filter: Record<string, unknown>
	) => Query<AdminPasswordRecoverySnapshot | null>;
	updateOne: (
		filter: Record<string, unknown>,
		update: Record<string, unknown>,
		options: { upsert: false; runValidators: true }
	) => Query<{
		acknowledged: boolean;
		matchedCount: number;
		modifiedCount: number;
	}>;
}

/** Operator-only recovery of the existing singleton; never creates an account. */
export async function resetJulioAdminPassword(
	emailConfirmation: string,
	newPassword: string,
	confirmedPassword: string,
	model: AdminPasswordRecoveryModel = Admin as unknown as AdminPasswordRecoveryModel
): Promise<void> {
	if (!isValidTeacherPassword(newPassword) || !newPassword.trim()) {
		throw new AdminPasswordRecoveryRefusal(
			`A nonblank replacement password of at least ${MIN_TEACHER_PASSWORD_LENGTH} characters is required.`
		);
	}
	if (newPassword !== confirmedPassword) {
		throw new AdminPasswordRecoveryRefusal(
			"The replacement passwords do not match; nothing was changed."
		);
	}
	if ((await model.countDocuments({}).exec()) !== 1) {
		throw new AdminPasswordRecoveryRefusal(
			"Teacher password recovery requires exactly one existing Admin account; it does not provision accounts."
		);
	}
	const admin = await model.findOne({ _id: ADMIN_SINGLETON_ID }).exec();
	const normalizedEmail = emailConfirmation.trim().toLowerCase();
	if (
		!admin
		|| admin._id.toString() !== ADMIN_SINGLETON_ID
		|| admin.name !== "Julio"
		|| admin.role !== "admin"
		|| !normalizedEmail
		|| admin.email !== normalizedEmail
		|| typeof admin.password !== "string"
		|| !admin.password
	) {
		throw new AdminPasswordRecoveryRefusal(
			"The existing Julio account and email confirmation must match; nothing was changed."
		);
	}
	const sessionVersion
		= admin.sessionVersion === undefined ? 0 : admin.sessionVersion;
	if (
		!Number.isSafeInteger(sessionVersion)
		|| sessionVersion < 0
		|| sessionVersion >= Number.MAX_SAFE_INTEGER
	) {
		throw new AdminPasswordRecoveryRefusal(
			"Teacher password recovery refused an invalid session version; nothing was changed."
		);
	}
	const sessionVersionFilter
		= sessionVersion === 0
			? {
					$or: [
						{ sessionVersion: 0 },
						{ sessionVersion: { $exists: false } }
					]
				}
			: { sessionVersion };
	const passwordHash = await argon2.hash(newPassword);
	const result = await model
		.updateOne(
			{
				_id: ADMIN_SINGLETON_ID,
				name: "Julio",
				role: "admin",
				email: admin.email,
				password: admin.password,
				...sessionVersionFilter
			},
			{
				$set: { password: passwordHash, passwordChangedAt: new Date() },
				$inc: { sessionVersion: 1 }
			},
			{ upsert: false, runValidators: true }
		)
		.exec();
	if (
		!result.acknowledged
		|| result.matchedCount !== 1
		|| result.modifiedCount !== 1
	) {
		throw new AdminPasswordRecoveryRefusal(
			"Teacher password recovery was not confirmed. The account may have changed concurrently; verify the current sign-in state before retrying."
		);
	}
}
