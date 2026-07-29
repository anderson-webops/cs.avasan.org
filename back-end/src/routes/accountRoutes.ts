// src/routes/accountRoutes.ts

import { Router } from "express";
import { changeEmail, changePassword, checkEmail, login, logout } from "../controllers/auth/authController.js";
import { validAdmin } from "../middleware/auth.js";
import { createLoginLimiter } from "../middleware/rateLimiters.js";

export function createAccountRoutes(): Router {
	const router = Router();

	// Account security belongs to the sole authenticated teacher account.
	router.post("/checkEmail", validAdmin, checkEmail);

	router.post("/changeEmail/:ID", validAdmin, changeEmail);

	router.post("/changePassword/:ID", validAdmin, changePassword);

	// Login is the only public account operation and is throttled per client IP.
	router.post("/login", createLoginLimiter(), login);

	router.delete("/logout", logout);

	router.get("/me", (req, res) => {
		res.json({ adminID: req.session?.adminID ?? null });
	});

	return router;
}
