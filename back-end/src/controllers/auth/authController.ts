// src/controllers/auth/authController.ts
import type { Request, RequestHandler } from "express";
import type { HydratedDocument } from "mongoose";
import type { IAdmin } from "../../types/entities/IAdmin.js";
import type { CustomSession } from "../../types/session/CustomSession.js";
import argon2 from "argon2";
import { Admin } from "../../models/schemas/Admin.js";
import { ADMIN_SINGLETON_ID } from "../../security/adminIdentity.js";
import {
	ADMIN_ABSOLUTE_SESSION_MS
} from "../../security/adminSession.js";
import {
	isValidTeacherPassword,
	MIN_TEACHER_PASSWORD_LENGTH
} from "../../security/passwordPolicy.js";
import {
	revokeSessionIdentities,
	revokeStudentSessionIdentity
} from "../../security/sessionLifecycle.js";

const DUMMY_ADMIN_PASSWORD = "not-a-real-admin-credential";
const dummyAdminPasswordHash = argon2.hash(DUMMY_ADMIN_PASSWORD);

export function normalizeAccountEmail(email: string): string {
	return email.trim().toLowerCase();
}

function getCurrentAdmin(req: Request): HydratedDocument<IAdmin> | undefined {
	return req.currentAdmin as HydratedDocument<IAdmin> | undefined;
}

// LOGIN
export const login: RequestHandler = async (req, res) => {
	if (
		!req.body
		|| typeof req.body !== "object"
		|| Array.isArray(req.body)
		|| Object.keys(req.body).some(key => key !== "email" && key !== "password")
	) {
		return res.sendStatus(400);
	}
	const { email, password } = req.body as {
		email?: string;
		password?: string;
	};
	if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
		return res.sendStatus(400);
	}

	const admin = await Admin.findOne({ _id: ADMIN_SINGLETON_ID }).exec();
	const passwordMatches = admin
		? await admin.comparePassword(password)
		: await argon2.verify(await dummyAdminPasswordHash, password);
	const emailMatches = admin?.email === normalizeAccountEmail(email);
	if (!admin || !emailMatches || !passwordMatches) {
		return res.status(403).json({ message: "Bad credentials" });
	}
	const session = req.session as CustomSession | undefined;
	if (!session) {
		return res.status(500).json({ message: "Session unavailable" });
	}
	const currentSessionVersion = Number.isSafeInteger(admin.sessionVersion)
		? admin.sessionVersion
		: 0;
	const sessionVersionFilter = currentSessionVersion === 0
		? {
				$or: [
					{ sessionVersion: 0 },
					{ sessionVersion: { $exists: false } }
				]
			}
		: { sessionVersion: currentSessionVersion };
	const authenticated = await Admin.findOneAndUpdate(
		{
			_id: ADMIN_SINGLETON_ID,
			email: admin.email,
			password: admin.password,
			...sessionVersionFilter
		},
		{ $inc: { sessionVersion: 1 } },
		{ new: true }
	).exec();
	if (!authenticated) {
		return res.status(403).json({ message: "Bad credentials" });
	}

	try {
		// Rotate only the prior Student identity. The new Admin version has been
		// reserved in the database but is not placed in the cookie until copied
		// Student cookies are confirmed revoked.
		await revokeStudentSessionIdentity(session);
	}
	catch {
		return res.status(503).json({
			message: "Could not safely switch accounts. Admin sign-in was not completed."
		});
	}

	session.adminID = authenticated._id.toString();
	const authenticatedAt = Date.now();
	session.adminExpiresAt = authenticatedAt + ADMIN_ABSOLUTE_SESSION_MS;
	session.adminLastActivityAt = authenticatedAt;
	session.adminSessionVersion = authenticated.sessionVersion;
	delete session.studentID;
	delete session.studentExpiresAt;
	delete session.studentSessionVersion;
	delete session.studentAuthLevel;
	delete session.studentSetupExpiresAt;
	delete session.studentLastActivityAt;
	const options = ((req as any).sessionOptions ??= {});
	delete options.maxAge;
	delete options.expires;
	return res.json({ currentAdmin: authenticated });
};

/** LOGOUT */
export const logout: RequestHandler = async (req, res) => {
	const session = req.session as CustomSession | undefined;
	try {
		await revokeSessionIdentities(session);
	}
	catch {
		// Clear this browser even when the database is temporarily unavailable.
		// The non-success response tells the client that copied cookies could not
		// be confirmed revoked.
		(req.session as any) = null;
		return res.status(503).json({
			message: "Signed out here, but other session copies could not be revoked."
		});
	}

	(req.session as any) = null;
	return res.sendStatus(200);
};

/** Change the current Admin's own password after verifying the old password. */
export const changePassword: RequestHandler = async (req, res) => {
	const requestedId = req.params.ID;
	const { currentPassword, newPassword } = req.body as {
		currentPassword?: string;
		newPassword?: string;
	};
	const admin = getCurrentAdmin(req);

	if (!admin || typeof requestedId !== "string" || admin._id.toString() !== requestedId) {
		return res.status(403).json({ message: "Not authorized to update this password." });
	}
	if (typeof currentPassword !== "string" || !currentPassword) {
		return res.status(400).json({ message: "Current password is required." });
	}
	if (!isValidTeacherPassword(newPassword)) {
		return res.status(400).json({
			message: `New password must be at least ${MIN_TEACHER_PASSWORD_LENGTH} characters.`
		});
	}
	if (!(await admin.comparePassword(currentPassword))) {
		return res.status(403).json({ message: "Current password is incorrect." });
	}
	const session = req.session as CustomSession | undefined;
	if (!session) {
		return res.status(500).json({ message: "Session unavailable" });
	}

	const expectedSessionVersion = session.adminSessionVersion;
	if (!Number.isSafeInteger(expectedSessionVersion)) {
		return res.status(403).json({ message: "Admin session expired." });
	}
	const passwordChangedAt = new Date();
	const passwordHash = await argon2.hash(newPassword);
	const updated = await Admin.findOneAndUpdate(
		{
			_id: admin._id,
			password: admin.password,
			sessionVersion: expectedSessionVersion
		},
		{
			$inc: { sessionVersion: 1 },
			$set: {
				password: passwordHash,
				passwordChangedAt
			}
		},
		{ new: true }
	).exec();
	if (!updated) {
		delete session.adminID;
		delete session.adminExpiresAt;
		delete session.adminLastActivityAt;
		delete session.adminSessionVersion;
		return res.status(409).json({
			message: "Admin session changed. Sign in again before changing the password."
		});
	}
	session.adminSessionVersion = updated.sessionVersion;
	return res.json({
		currentAdmin: updated,
		message: "Password updated successfully."
	});
};
