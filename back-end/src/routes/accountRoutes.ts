// src/routes/accountRoutes.ts

import { Router } from "express";
import { changeEmail, changePassword, checkEmail, login, logout } from "../controllers/auth/authController.js";

const router = Router();

// Route to check if email is available (useful for account creation)
router.post("/checkEmail", checkEmail);

// Route to change email (could be used by users, tutors, or admins)
router.post("/changeEmail/:ID", changeEmail);

// Route to change password
router.post("/changePassword/:ID", changePassword);

// Route to handle login
router.post("/login", login);

router.delete("/logout", logout);

// in accountRoutes.ts
router.get("/me", (req, res) => {
	const s = req.session as any;
	res.json({
		adminID: s?.adminID ?? null,
		tutorID: s?.tutorID ?? null,
		userID: s?.userID ?? null
	});
});

// Export the router
export const accountRoutes = router;
