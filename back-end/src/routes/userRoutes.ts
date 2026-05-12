// src/routes/userRoutes.ts
import type { Router } from "express";
import express from "express";
import { logout as logoutUser } from "../controllers/auth/authController.js";
import {
	createUser,
	getAllUsers,
	getLoggedInUser,
	updateUser
} from "../controllers/users/userController.js";
import {
	createUserScheduledSession,
	createUserSessionNote,
	deleteOwnUser,
	deleteUserAsAdmin,
	deleteUserAsTutor,
	getLoggedInUserCommunications,
	getUserRecentSessionNotes,
	getUserSchedule,
	getUsersOfTutor,
	promoteUserToTutor,
	setUserCourseAccess,
	setUserCourseProgress,
	setUserRecipientAssociation,
	setUserTutors,
	updateUserScheduledSession
} from "../controllers/users/userExtraController.js";
import {
	validAdmin,
	validTutor,
	validTutorOrAdminSession,
	validUser
} from "../middleware/auth.js";
import { createUserCourseAccessLimiter } from "../middleware/rateLimiters.js";

const router: Router = express.Router();

// Rate limiter for sensitive endpoints (e.g. 100 requests per 15 minutes)
const userCourseAccessLimiter = createUserCourseAccessLimiter();

// Create a user
router.post("/", createUser);

// Get users belonging to a given tutor
router.get("/oftutor/:tutorID", getUsersOfTutor);

// Get all users
router.get("/all", getAllUsers);

// Update user info by the user themselves
router.put("/user/:userID", validUser, updateUser);

// Update user info by the tutor
router.put("/tutor/:userID", validTutor, updateUser);

// Update tutor assignments for a user (admin only)
router.put("/:userID/tutors", validAdmin, setUserTutors);

// Update recipient association for a user (admin only)
router.put("/:userID/recipient", validAdmin, setUserRecipientAssociation);

// Promote a user to tutor (admin only)
router.post("/:userID/promote", validAdmin, promoteUserToTutor);

// Allow tutors and admins to manage course visibility for their students
router.put("/:userID/courses", userCourseAccessLimiter, validTutorOrAdminSession, setUserCourseAccess);
router.put("/:userID/course-progress", userCourseAccessLimiter, validTutorOrAdminSession, setUserCourseProgress);

// Allow tutors and admins to manage student schedules and private note-only logs
router.get("/:userID/schedule", validTutorOrAdminSession, getUserSchedule);
router.post("/:userID/schedule", validTutorOrAdminSession, createUserScheduledSession);
router.put("/:userID/schedule/:sessionID", validTutorOrAdminSession, updateUserScheduledSession);
router.get("/:userID/session-notes/recent", validTutorOrAdminSession, getUserRecentSessionNotes);
router.post("/:userID/session-notes", validTutorOrAdminSession, createUserSessionNote);

// Delete the user by the user themselves
router.delete("/user/:userID", validUser, deleteOwnUser);

// Delete the user by the tutor
router.delete("/tutor/:userID", validTutor, deleteUserAsTutor);

// Delete the user by the admin
router.delete("/admin/:userID", validAdmin, deleteUserAsAdmin);

// Get logged in user
router.get("/loggedin/communications", validUser, getLoggedInUserCommunications);

// Get logged in user
router.get("/loggedin", validUser, getLoggedInUser);

// Logout
router.delete("/logout", validUser, logoutUser);

export const userRoutes = router;
