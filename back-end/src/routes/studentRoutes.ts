import { Router } from "express";
import {
	createStudentSession,
	deleteStudentSession,
	getStudentSession,
	setStudentPassword
} from "../controllers/students/studentController.js";
import {
	createPythonProject,
	deletePythonProject,
	listPythonProjects,
	listVisiblePythonProjectReviews,
	updatePythonProject
} from "../controllers/users/pythonProjectController.js";
import {
	requireStudentContext,
	validStudent
} from "../middleware/auth.js";
import {
	createStudentCredentialLimiter,
	createStudentLoginIpLimiter,
	createStudentPasswordSetupLimiter,
	createStudentProjectWriteLimiter
} from "../middleware/rateLimiters.js";

const router = Router();
const studentLoginIpLimiter = createStudentLoginIpLimiter();
const studentCredentialLimiter = createStudentCredentialLimiter();
const studentPasswordSetupLimiter = createStudentPasswordSetupLimiter();
const studentProjectWriteLimiter = createStudentProjectWriteLimiter();

router.post(
	"/session",
	studentLoginIpLimiter,
	studentCredentialLimiter,
	createStudentSession
);
router.get("/session", getStudentSession);
router.put(
	"/session/password",
	studentPasswordSetupLimiter,
	setStudentPassword
);
router.delete("/session", deleteStudentSession);

router.use(
	["/projects", "/project-reviews"],
	validStudent,
	requireStudentContext
);
router.get("/projects", listPythonProjects);
router.post(
	"/projects",
	studentProjectWriteLimiter,
	createPythonProject
);
router.put(
	"/projects/:projectID",
	studentProjectWriteLimiter,
	updatePythonProject
);
router.delete(
	"/projects/:projectID",
	studentProjectWriteLimiter,
	deletePythonProject
);
router.get(
	"/project-reviews",
	listVisiblePythonProjectReviews
);

export const studentRoutes = router;
