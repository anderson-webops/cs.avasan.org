// src/routes/userRoutes.ts
import express from "express";
import { logout as logoutUser } from "../controllers/auth/authController.js";
import {
	createUser,
	deleteUser,
	getAllUsers,
	getLoggedInUser,
	updateUser
} from "../controllers/users/userController.js";
import { getUsersOfTutor, promoteUserToTutor, setUserTutors } from "../controllers/users/userExtraController.js";
import { validAdmin, validTutor, validUser } from "../middleware/auth.js";

const router = express.Router();

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

// Promote a user to tutor (admin only)
router.post("/:userID/promote", validAdmin, promoteUserToTutor);

// Delete the user by the user themselves
router.delete("/user/:userID", validUser, deleteUser);

// Delete the user by the tutor
router.delete("/tutor/:userID", validTutor, deleteUser);

// Get logged in user
router.get("/loggedin", validUser, getLoggedInUser);

// Logout
router.delete("/logout", validUser, logoutUser);

export const userRoutes = router;
