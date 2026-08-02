// src/middleware/auth.ts
import type { RequestHandler } from "express";
import type { CustomSession } from "../types/session/CustomSession.js";
import { Admin } from "../models/schemas/Admin.js";
import { Student } from "../models/schemas/Student.js";
import { ADMIN_SINGLETON_ID } from "../security/adminIdentity.js";
import {
	adminSessionTimingIsCurrent
} from "../security/adminSession.js";
import {
	STUDENT_INACTIVITY_TIMEOUT_MS
} from "../security/studentCredentials.js";

function clearStudentIdentity(session: CustomSession | undefined): void {
	if (!session) return;
	delete session.studentID;
	delete session.studentExpiresAt;
	delete session.studentSessionVersion;
	delete session.studentAuthLevel;
	delete session.studentSetupExpiresAt;
	delete session.studentLastActivityAt;
}

function clearAdminIdentity(session: CustomSession | undefined): void {
	if (!session) return;
	delete session.adminID;
	delete session.adminExpiresAt;
	delete session.adminLastActivityAt;
	delete session.adminSessionVersion;
}

async function validateStudentSession(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1],
	next: Parameters<RequestHandler>[2],
	requiredLevel: "setup" | "full"
): Promise<void> {
	if (req.currentStudent) {
		next();
		return;
	}

	const session = req.session as CustomSession | undefined;
	const now = Date.now();
	if (
		!session?.studentID
		|| session.studentAuthLevel !== requiredLevel
		|| !Number.isSafeInteger(session.studentSessionVersion)
	) {
		res.status(403).json({ message: "Student session required" });
		return;
	}
	if (
		requiredLevel === "setup"
		&& (
			!Number.isSafeInteger(session.studentSetupExpiresAt)
			|| (session.studentSetupExpiresAt ?? 0) <= now
		)
	) {
		clearStudentIdentity(session);
		res.status(403).json({ message: "Student setup session expired" });
		return;
	}
	if (
		requiredLevel === "full"
		&& (
			!Number.isSafeInteger(session.studentExpiresAt)
			|| (session.studentExpiresAt ?? 0) <= now
			|| !Number.isSafeInteger(session.studentLastActivityAt)
			|| now - (session.studentLastActivityAt ?? 0) >= STUDENT_INACTIVITY_TIMEOUT_MS
		)
	) {
		clearStudentIdentity(session);
		res.status(403).json({ message: "Student session expired" });
		return;
	}

	try {
		const student = await Student.findById(session.studentID)
			.where({
				dataDeletionPendingAt: { $exists: false },
				retentionExpiresAt: { $gt: new Date(now) }
			})
			.select(requiredLevel === "setup"
				? "+sessionVersion +pendingSetupCodeHash"
				: "+sessionVersion");
		if (
			!student
			|| !student.active
			|| student.sessionVersion !== session.studentSessionVersion
		) {
			clearStudentIdentity(session);
			res.status(403).json({ message: "Student session expired" });
			return;
		}

		req.currentStudent = student;
		next();
	}
	catch {
		res.status(500).json({ message: "Server error while validating student" });
	}
}

export const validStudent: RequestHandler = async (req, res, next) => {
	await validateStudentSession(req, res, next, "full");
};

export const validStudentSetup: RequestHandler = async (req, res, next) => {
	await validateStudentSession(req, res, next, "setup");
};

/**
 * Bind project requests to the student identity the browser most recently
 * loaded. This prevents an old tab from silently writing into a different
 * student's session after accounts are switched on a shared classroom device.
 */
export const requireStudentContext: RequestHandler = (req, res, next) => {
	const authenticatedStudentID = req.currentStudent?._id.toString();
	if (
		!authenticatedStudentID
		|| req.get("X-Student-ID") !== authenticatedStudentID
	) {
		res.status(409).json({
			message: "Student context changed. Refresh and try again."
		});
		return;
	}

	next();
};

// Middleware to validate Admin
export const validAdmin: RequestHandler = async (req, res, next) => {
	if (req.currentAdmin) {
		next();
		return;
	}
	const session = req.session as CustomSession | undefined;
	const now = Date.now();
	if (
		!session?.adminID
		|| !adminSessionTimingIsCurrent(session, now)
		|| !Number.isSafeInteger(session.adminSessionVersion)
	) {
		clearAdminIdentity(session);
		res.status(403).json({ message: "Not logged in or session expired" });
		return;
	}
	if (session.adminID !== ADMIN_SINGLETON_ID) {
		clearAdminIdentity(session);
		res.status(403).json({ message: "Admin account not found" });
		return;
	}
	try {
		const admin = await Admin.findById(ADMIN_SINGLETON_ID)
			.select("+sessionVersion");
		if (
			!admin
			|| (
				Number.isSafeInteger(admin.sessionVersion)
					? admin.sessionVersion
					: 0
			) !== session.adminSessionVersion
		) {
			clearAdminIdentity(session);
			res.status(403).json({ message: "Admin account not found" });
			return;
		}
		req.currentAdmin = admin;
		// Visible Admin pages periodically revalidate and remount their roster,
		// and failed mutations can be scripted. Only the dedicated same-origin
		// heartbeat, emitted after trusted interaction on /admin, proves enough
		// presence to extend the idle window.
		const isAdminActivityHeartbeat = req.method === "GET"
			&& req.baseUrl === "/admins"
			&& req.path === "/loggedin"
			&& req.get("X-Admin-Activity") === "1";
		if (isAdminActivityHeartbeat) {
			session.adminLastActivityAt = now;
		}
		next();
	}
	catch (error) {
		console.error("Error in validAdmin middleware:", error);
		res.status(500).json({ message: "Server error while validating admin" });
	}
};
