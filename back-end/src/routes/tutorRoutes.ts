// src/routes/tutorRoutes.ts

import express from "express";
import {
	createTutor,
	deleteTutor,
	getAllTutors,
	getLoggedInTutor,
	updateTutor
} from "../controllers/users/tutorController.js";
import {
	demoteTutorToUser,
	updateTutorCoursePermissions
} from "../controllers/users/tutorExtraController.js";
import { validAdmin, validTutor, validTutorOrAdmin } from "../middleware/auth.js";

const router = express.Router();

// Route to create a tutor
router.post("/", createTutor);

// Route to get all tutors
router.get("/", getAllTutors);

// Route to update a tutor's information (protected - admin OR that tutor)
router.put("/:tutorID", validTutorOrAdmin, updateTutor);

// Route to delete a tutor (protected - admin OR that tutor)
router.delete("/remove/:tutorID", validTutorOrAdmin, deleteTutor);

// Route to get the currently logged-in tutor (protected)
router.get("/loggedin", validTutor, getLoggedInTutor);

// Admin-only course permissions for tutors
router.put("/:tutorID/courses", validAdmin, updateTutorCoursePermissions);

// Admin can demote a tutor back to a user
router.post("/:tutorID/demote", validAdmin, demoteTutorToUser);

// Export the router
export const tutorRoutes = router;
