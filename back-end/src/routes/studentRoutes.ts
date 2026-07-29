import { Router, urlencoded } from "express";
import {
	createStudentSession,
	deleteStudentSession,
	getStudentSession,
	setStudentPassword
} from "../controllers/students/studentController.js";
import {
	connectStudentOAuthProvider,
	finishStudentOAuth,
	getStudentOAuthProviders,
	startStudentOAuthSignIn
} from "../controllers/students/studentOAuthController.js";
import {
	createPythonProject,
	deletePythonProject,
	listPythonProjects,
	listVisiblePythonProjectReviews,
	updatePythonProject
} from "../controllers/users/pythonProjectController.js";
import {
	requireStudentContext,
	validStudent,
	validStudentSetup
} from "../middleware/auth.js";
import {
	createStudentCredentialLimiter,
	createStudentLoginIpLimiter,
	createStudentOAuthLimiter,
	createStudentPasswordSetupLimiter,
	createStudentProjectWriteLimiter
} from "../middleware/rateLimiters.js";

const router = Router();
const studentLoginIpLimiter = createStudentLoginIpLimiter();
const studentCredentialLimiter = createStudentCredentialLimiter();
const studentOAuthLimiter = createStudentOAuthLimiter();
const studentPasswordSetupLimiter = createStudentPasswordSetupLimiter();
const studentProjectWriteLimiter = createStudentProjectWriteLimiter();
const parseAppleOAuthCallback = urlencoded({
	extended: false,
	limit: "16kb",
	parameterLimit: 10
});

router.get("/oauth/providers", getStudentOAuthProviders);
router.get(
	"/oauth/:provider/start",
	studentLoginIpLimiter,
	studentOAuthLimiter,
	startStudentOAuthSignIn
);
router.post(
	"/oauth/:provider/connect",
	studentLoginIpLimiter,
	studentOAuthLimiter,
	validStudentSetup,
	connectStudentOAuthProvider
);
router.get(
	"/oauth/:provider/callback",
	studentOAuthLimiter,
	finishStudentOAuth
);
router.post(
	"/oauth/:provider/callback",
	(req, res, next) => {
		if (req.params.provider !== "apple") {
			res.sendStatus(404);
			return;
		}
		next();
	},
	studentOAuthLimiter,
	parseAppleOAuthCallback,
	finishStudentOAuth
);

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
