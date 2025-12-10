// src/controllers/auth/authController.ts
import type { RequestHandler } from "express";
import type { IAdmin } from "../../types/entities/IAdmin.js";
import type { ITutor } from "../../types/entities/ITutor.js";
import type { IUser } from "../../types/entities/IUser.js";

import type { CustomSession } from "../../types/session/CustomSession.js";
import { Admin } from "../../models/schemas/Admin.js";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

// union of the three document types
type Entity = IUser | ITutor | IAdmin;

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// type‐guard: filters out `null` and tells TS that `u` is an Entity
function isEntity(u: any): u is Entity {
	return u != null && typeof u.comparePassword === "function";
}

function getEntityId(entity: Entity) {
	return entity._id.toString();
}

function canMutate(session: CustomSession, entity: Entity) {
	if (session.adminID) return true;
	const entityId = getEntityId(entity);
	if (entity instanceof Admin) return session.adminID === entityId;
	if (entity instanceof Tutor) return session.tutorID === entityId;
	if (entity instanceof User) return session.userID === entityId;
	return false;
}

// LOGIN
export const login: RequestHandler = async (req, res) => {
	const { email, password, remember } = req.body as {
		email?: string;
		password?: string;
		remember?: boolean;
	};
	if (!email || !password) return res.sendStatus(400);

	const e = email.trim().toLowerCase();

	// fetch all three, we’ll pick whichever isn’t null
	const results = (await Promise.all([
		User.findOne({ email: e }).exec(),
		Tutor.findOne({ email: e }).exec(),
		Admin.findOne({ email: e }).exec()
	])) as Array<IUser | ITutor | IAdmin | null>;

	// pick the first non‐null
	const entity = results.find(isEntity);
	if (!entity || !(await entity.comparePassword(password))) {
		return res.status(403).json({ message: "Bad credentials" });
	}

	// figure out whether it’s an admin/tutor/user
	const session = req.session as CustomSession;
	let sessionKey: keyof CustomSession;
	let responseKey: "currentAdmin" | "currentTutor" | "currentUser";

	if (entity instanceof Admin) {
		sessionKey = "adminID";
		responseKey = "currentAdmin";
	}
	else if (entity instanceof Tutor) {
		sessionKey = "tutorID";
		responseKey = "currentTutor";
	}
	else {
		sessionKey = "userID";
		responseKey = "currentUser";
	}

	// sign‐in
	session[sessionKey] = entity._id.toString();

	const options = ((req as any).sessionOptions ??= {});
	options.maxAge = remember ? THIRTY_DAYS_MS : undefined;
	return res.json({ [responseKey]: entity });
};

/** LOGOUT */
export const logout: RequestHandler = (req, res) => {
	// clear cookie-session
	// assuming your cookie-session name is “session”
	(req.session as any) = null;
	return res.sendStatus(200);
};

// CHECK EMAIL
export const checkEmail: RequestHandler = async (req, res) => {
	const { id, email } = req.body as { id?: string; email?: string };
	if (!email) return res.status(400).json({ message: "Email required" });
	const [u, t, a] = await Promise.all([User.findOne({ email }), Tutor.findOne({ email }), Admin.findOne({ email })]);
	const conflict = [u, t, a].some(x => x && x._id.toString() !== id);
	res.status(conflict ? 403 : 200).json({
		message: conflict ? "Already in use" : "Available"
	});
};

/** CHANGE EMAIL */
export const changeEmail: RequestHandler = async (req, res) => {
	// to satisfy TS union‐of‐models overloads, first coerce your array to a single Model<any> type:
	const models = [User, Tutor, Admin] as Array<import("mongoose").Model<any>>;
	const { ID } = req.params;
	const { email: newEmail } = req.body;

	if (!newEmail) return res.status(400).json({ message: "New email is required." });

	const session = req.session as CustomSession;
	const conflictChecks = await Promise.all(
		models.map(Model => Model.exists({ email: newEmail, _id: { $ne: ID } }))
	);
	if (conflictChecks.some(Boolean)) {
		return res.status(403).json({ message: "Email already exists." });
	}

	for (const Model of models) {
		const doc = await Model.findById(ID);
		if (!doc) continue;
		if (!canMutate(session, doc as Entity)) {
			return res.status(403).json({ message: "Not authorized to update this email." });
		}
		doc.email = newEmail;
		await doc.save();
		return res.json({ message: "Email updated successfully." });
	}

	return res.status(404).json({ message: "Entity not found." });
};

export const changePassword: RequestHandler = async (req, res) => {
	const models = [User, Tutor, Admin] as Array<import("mongoose").Model<any>>;
	const { ID } = req.params;
	const { currentPassword, newPassword } = req.body as {
		currentPassword?: string;
		newPassword?: string;
	};

	if (!newPassword) return res.status(400).json({ message: "New password is required." });

	const session = req.session as CustomSession;
	for (const Model of models) {
		const doc = await Model.findById(ID);
		if (!doc) continue;

		if (!canMutate(session, doc as Entity)) {
			return res.status(403).json({ message: "Not authorized to update this password." });
		}

		const isAdminOverride = !!session.adminID;
		if (!isAdminOverride) {
			if (!currentPassword) {
				return res.status(400).json({ message: "Current password is required." });
			}
			const matches = await (doc as Entity).comparePassword(currentPassword);
			if (!matches) {
				return res.status(403).json({ message: "Current password is incorrect." });
			}
		}

		doc.password = newPassword;
		await doc.save();
		return res.json({ message: "Password updated successfully." });
	}

	return res.status(404).json({ message: "Entity not found." });
};
