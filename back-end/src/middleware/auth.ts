// src/middleware/auth.ts
import type { RequestHandler } from "express";
import { Admin } from "../models/schemas/Admin.js";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";

// Middleware to validate User
export const validUser: RequestHandler = async (req, res, next) => {
	if (!req.session?.userID) {
		res.status(403).json({ message: "Not logged in or session expired" });
		return;
	}
	try {
		const user = await User.findById(req.session.userID);
		if (!user) {
			res.status(403).json({ message: "User account not found" });
			return;
		}
		req.currentUser = user;
		next();
	}
	catch (error) {
		console.error("Error in validUser middleware:", error);
		res.status(500).json({ message: "Server error while validating user" });
	}
};

// Middleware to validate Tutor
export const validTutor: RequestHandler = async (req, res, next) => {
        if (!req.session?.tutorID) {
                res.status(403).json({ message: "Not logged in or session expired" });
                return;
        }
	try {
		const tutor = await Tutor.findById(req.session.tutorID);
		if (!tutor) {
			res.status(403).json({ message: "Tutor account not found" });
			return;
		}
		req.currentTutor = tutor;
		next();
	}
	catch (error) {
		console.error("Error in validTutor middleware:", error);
		res.status(500).json({ message: "Server error while validating tutor" });
        }
};

// Middleware to allow either tutor or admin sessions
export const validTutorOrAdminSession: RequestHandler = async (req, res, next) => {
        if (req.session?.adminID) {
                try {
                        const admin = await Admin.findById(req.session.adminID);
                        if (!admin) {
                                res.status(403).json({ message: "Admin account not found" });
                                return;
                        }
                        req.currentAdmin = admin;
                        next();
                }
                catch (error) {
                        console.error("Error in validTutorOrAdminSession middleware (admin):", error);
                        res.status(500).json({ message: "Server error while validating admin" });
                }
                return;
        }

        if (req.session?.tutorID) {
                try {
                        const tutor = await Tutor.findById(req.session.tutorID);
                        if (!tutor) {
                                res.status(403).json({ message: "Tutor account not found" });
                                return;
                        }
                        req.currentTutor = tutor;
                        next();
                }
                catch (error) {
                        console.error("Error in validTutorOrAdminSession middleware (tutor):", error);
                        res.status(500).json({ message: "Server error while validating tutor" });
                }
                return;
        }

        res.status(403).json({ message: "Not logged in or session expired" });
};

// Middleware to validate Admin
export const validAdmin: RequestHandler = async (req, res, next) => {
	if (!req.session?.adminID) {
		res.status(403).json({ message: "Not logged in or session expired" });
		return;
	}
	try {
		const admin = await Admin.findById(req.session.adminID);
		if (!admin) {
			res.status(403).json({ message: "Admin account not found" });
			return;
		}
		req.currentAdmin = admin;
		next();
	}
	catch (error) {
		console.error("Error in validAdmin middleware:", error);
		res.status(500).json({ message: "Server error while validating admin" });
	}
};

/**
 * Allow update/delete if:
 *  • adminID is in session, OR
 *  • tutorID in session matches the :tutorID param
 */
export const validTutorOrAdmin: RequestHandler = (req, res, next) => {
	const sess = req.session as any;
	const { tutorID } = req.params;

	// if admin, always OK
	if (sess.adminID) {
		return next();
	}

	// if tutor and it's their own ID
	if (sess.tutorID === tutorID) {
		return next();
	}

	res.status(403).json({ message: "Not authorized to perform this action." });
};
