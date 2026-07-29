import type { CustomSession } from "../types/session/CustomSession.js";
import { Types } from "mongoose";
import { Admin } from "../models/schemas/Admin.js";
import { Student } from "../models/schemas/Student.js";
import { ADMIN_SINGLETON_ID } from "./adminIdentity.js";

function requireAcknowledged(result: { acknowledged?: boolean }): void {
	if (result.acknowledged === false) {
		throw new Error("Session revocation was not acknowledged.");
	}
}

export async function revokeAdminSessionIdentity(
	session: CustomSession | undefined
): Promise<void> {
	if (
		session?.adminID !== ADMIN_SINGLETON_ID
		|| !Number.isSafeInteger(session.adminSessionVersion)
	) {
		return;
	}

	const version = session.adminSessionVersion as number;
	const versionFilter = version === 0
		? {
				$or: [
					{ sessionVersion: 0 },
					{ sessionVersion: { $exists: false } }
				]
			}
		: { sessionVersion: version };
	const result = await Admin.updateOne(
		{
			_id: ADMIN_SINGLETON_ID,
			...versionFilter
		},
		{ $inc: { sessionVersion: 1 } }
	);
	requireAcknowledged(result);
}

export async function revokeStudentSessionIdentity(
	session: CustomSession | undefined
): Promise<void> {
	if (
		typeof session?.studentID !== "string"
		|| !Types.ObjectId.isValid(session.studentID)
		|| !Number.isSafeInteger(session.studentSessionVersion)
	) {
		return;
	}

	const result = await Student.updateOne(
		{
			_id: session.studentID,
			sessionVersion: session.studentSessionVersion
		},
		{ $inc: { sessionVersion: 1 } }
	);
	requireAcknowledged(result);
}

/**
 * Revoke every still-current identity represented by a signed classroom
 * cookie. Matching the stored version keeps logout idempotent when another
 * login, password reset, or logout already revoked the cookie.
 */
export async function revokeSessionIdentities(
	session: CustomSession | undefined
): Promise<void> {
	if (!session) return;
	await Promise.all([
		revokeAdminSessionIdentity(session),
		revokeStudentSessionIdentity(session)
	]);
}
