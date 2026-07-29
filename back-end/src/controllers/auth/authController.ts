// src/controllers/auth/authController.ts
import type { Request, RequestHandler } from "express";
import type { HydratedDocument } from "mongoose";
import type { IAdmin } from "../../types/entities/IAdmin.js";
import type { CustomSession } from "../../types/session/CustomSession.js";
import { Admin } from "../../models/schemas/Admin.js";
import { ADMIN_SINGLETON_ID } from "../../security/adminIdentity.js";
import {
	isValidTeacherPassword,
	MIN_TEACHER_PASSWORD_LENGTH
} from "../../security/passwordPolicy.js";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function normalizeAccountEmail(email: string): string {
	return email.trim().toLowerCase();
}

function getCurrentAdmin(req: Request): HydratedDocument<IAdmin> | undefined {
	return req.currentAdmin as HydratedDocument<IAdmin> | undefined;
}

// LOGIN
export const login: RequestHandler = async (req, res) => {
	const { email, password, remember } = req.body as {
		email?: string;
		password?: string;
		remember?: boolean;
	};
	if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
		return res.sendStatus(400);
	}

	const admin = await Admin.findOne({
		_id: ADMIN_SINGLETON_ID,
		email: normalizeAccountEmail(email)
	}).exec();
	if (!admin || !(await admin.comparePassword(password))) {
		return res.status(403).json({ message: "Bad credentials" });
	}

	const session = req.session as CustomSession | undefined;
	if (!session) {
		return res.status(500).json({ message: "Session unavailable" });
	}

	session.adminID = admin._id.toString();
	const options = ((req as any).sessionOptions ??= {});
	options.maxAge = remember === true ? THIRTY_DAYS_MS : undefined;
	return res.json({ currentAdmin: admin });
};

/** LOGOUT */
export const logout: RequestHandler = (req, res) => {
	(req.session as any) = null;
	return res.sendStatus(200);
};

/** Check whether a normalized email is available to the current Admin. */
export const checkEmail: RequestHandler = async (req, res) => {
	const { email } = req.body as { email?: string };
	const admin = getCurrentAdmin(req);
	if (!admin) return res.status(403).json({ message: "Not logged in or session expired" });
	if (typeof email !== "string" || !email.trim()) {
		return res.status(400).json({ message: "Email required" });
	}

	const conflict = await Admin.exists({
		email: normalizeAccountEmail(email),
		_id: { $ne: admin._id }
	});
	return res.status(conflict ? 403 : 200).json({
		message: conflict ? "Already in use" : "Available"
	});
};

/** Change the current Admin's own email address. */
export const changeEmail: RequestHandler = async (req, res) => {
	const requestedId = req.params.ID;
	const { email } = req.body as { email?: string };
	const admin = getCurrentAdmin(req);

	if (!admin || typeof requestedId !== "string" || admin._id.toString() !== requestedId) {
		return res.status(403).json({ message: "Not authorized to update this email." });
	}
	if (typeof email !== "string" || !email.trim()) {
		return res.status(400).json({ message: "New email is required." });
	}

	const normalizedEmail = normalizeAccountEmail(email);
	const conflict = await Admin.exists({
		email: normalizedEmail,
		_id: { $ne: admin._id }
	});
	if (conflict) {
		return res.status(403).json({ message: "Email already exists." });
	}

	admin.email = normalizedEmail;
	await admin.save();
	return res.json({ message: "Email updated successfully." });
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

	admin.password = newPassword;
	await admin.save();
	return res.json({ message: "Password updated successfully." });
};
