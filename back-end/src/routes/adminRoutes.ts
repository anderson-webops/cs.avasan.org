// src/routes/adminRoutes.ts

import express from "express";
import {
	createStudent,
	listStudents,
	resetStudentAccessCode,
	setStudentActive
} from "../controllers/students/studentController.js";
import { getLoggedInAdmin } from "../controllers/users/adminController.js";
import {
	createPythonProjectReview,
	listManagedPythonProjects,
	updatePythonProjectReview
} from "../controllers/users/pythonProjectController.js";
import { validAdmin } from "../middleware/auth.js";
import {
	createStudentProjectWriteLimiter,
	createTeacherVerificationLimiter
} from "../middleware/rateLimiters.js";

const router = express.Router();
const teacherVerificationLimiter = createTeacherVerificationLimiter();
const teacherProjectWriteLimiter = createStudentProjectWriteLimiter();

// There is no HTTP account creation, directory, or deletion surface. The sole
// teacher account is provisioned with create-admin-user.ts.
router.get("/loggedin", validAdmin, getLoggedInAdmin);

router.get("/students", validAdmin, listStudents);
router.post(
	"/students",
	validAdmin,
	teacherVerificationLimiter,
	createStudent
);
router.patch("/students/:studentID", validAdmin, setStudentActive);
router.post(
	"/students/:studentID/access-code",
	validAdmin,
	teacherVerificationLimiter,
	resetStudentAccessCode
);
router.get(
	"/students/:studentID/projects",
	validAdmin,
	listManagedPythonProjects
);
router.post(
	"/students/:studentID/projects/:projectID/review",
	validAdmin,
	teacherProjectWriteLimiter,
	createPythonProjectReview
);
router.put(
	"/students/:studentID/projects/:projectID/review/:reviewID",
	validAdmin,
	teacherProjectWriteLimiter,
	updatePythonProjectReview
);

export const adminRoutes = router;
