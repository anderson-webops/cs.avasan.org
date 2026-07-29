// src/controllers/users/adminController.ts
import type { RequestHandler } from "express";
import type { HydratedDocument } from "mongoose";
import type { IAdmin } from "../../types/entities/IAdmin.js";

function currentAdminFromRequest(
	req: Parameters<RequestHandler>[0]
): HydratedDocument<IAdmin> | undefined {
	return req.currentAdmin as HydratedDocument<IAdmin> | undefined;
}

/** Return only the Admin already validated from the current session. */
export const getLoggedInAdmin: RequestHandler = (req, res) => {
	const admin = currentAdminFromRequest(req);
	if (!admin) return res.status(403).json({ message: "Not logged in or session expired" });
	return res.json({ currentAdmin: admin });
};

/** Allow Julio to update his own display name, but no account-management fields. */
export const updateAdmin: RequestHandler = async (req, res) => {
	const admin = currentAdminFromRequest(req);
	if (!admin) return res.status(403).json({ message: "Not logged in or session expired" });
	if (admin._id.toString() !== req.params.adminID) {
		return res.status(403).json({ message: "Not authorized to update this account." });
	}

	const { name } = req.body as { name?: unknown };
	if (name !== undefined) {
		if (typeof name !== "string" || !name.trim()) {
			return res.status(400).json({ message: "Name is required." });
		}
		admin.name = name.trim();
	}

	await admin.save();
	return res.json({ currentAdmin: admin });
};
