// src/routes/accountRoutes.ts

import { Router } from "express";
import {
	changePassword,
	login,
	logout
} from "../controllers/auth/authController.js";
import { validAdmin } from "../middleware/auth.js";
import {
	createLoginLimiter,
	createTeacherVerificationLimiter
} from "../middleware/rateLimiters.js";

export function createAccountRoutes(): Router {
	const router = Router();
	const teacherVerificationLimiter = createTeacherVerificationLimiter();

	// Julio's email is provisioned only by code; runtime account security is
	// limited to changing his own password.
	router.post(
		"/changePassword/:ID",
		validAdmin,
		teacherVerificationLimiter,
		changePassword
	);

	// Login is the only public account operation and is throttled per client IP.
	router.post("/login", createLoginLimiter(), login);

	router.delete("/logout", logout);

	router.get("/me", (req, res) => {
		res.json({ adminID: req.session?.adminID ?? null });
	});

	return router;
}
