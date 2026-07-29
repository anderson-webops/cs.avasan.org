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
