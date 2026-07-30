// src/routes/adminRoutes.ts

import express from "express";
import { getClassroomAnalyticsSummary } from "../controllers/classroomAnalyticsController.js";
import {
	correctStudentUsername,
	createStudent,
	listStudents,
	resetStudentAccessCode,
	setStudentActive
} from "../controllers/students/studentController.js";
import {
	deleteStudentData,
	exportStudentData,
	listStudentDeletionReceipts
} from "../controllers/students/studentDataController.js";
import { getLoggedInAdmin } from "../controllers/users/adminController.js";
import {
	createPythonProjectReview,
	listManagedPythonProjects,
	updatePythonProjectReview
} from "../controllers/users/pythonProjectController.js";
import { validAdmin } from "../middleware/auth.js";
import { createStudentProjectWriteLimiter, createTeacherVerificationLimiter } from "../middleware/rateLimiters.js";
import { requireStudentDataWriteLease } from "../security/studentDataWriteBarrier.js";

export interface AdminRouteOptions {
	analyticsRetentionDays: number;
	studentAccountsEnabled: boolean;
	studentRecordMaintenanceEnabled: boolean;
}

export function createAdminRoutes(options: AdminRouteOptions) {
	const configuredRouter = express.Router();
	const teacherVerificationLimiter = createTeacherVerificationLimiter();
	const teacherProjectWriteLimiter = createStudentProjectWriteLimiter();

	// There is no HTTP Admin account creation or directory. The sole teacher
	// account is provisioned with create-admin-user.ts.
	configuredRouter.get("/loggedin", validAdmin, getLoggedInAdmin);
	configuredRouter.get(
		"/classroom-analytics/summary",
		validAdmin,
		getClassroomAnalyticsSummary(options.analyticsRetentionDays)
	);

	if (
		!options.studentAccountsEnabled
		&& !options.studentRecordMaintenanceEnabled
	) {
		return configuredRouter;
	}

	configuredRouter.get("/students", validAdmin, listStudents);
	configuredRouter.get("/student-deletion-receipts", validAdmin, listStudentDeletionReceipts);
	configuredRouter.patch(
		"/students/:studentID/username",
		validAdmin,
		teacherVerificationLimiter,
		requireStudentDataWriteLease,
		correctStudentUsername
	);
	configuredRouter.post(
		"/students/:studentID/export",
		validAdmin,
		teacherVerificationLimiter,
		requireStudentDataWriteLease,
		exportStudentData
	);
	configuredRouter.delete("/students/:studentID", validAdmin, teacherVerificationLimiter, deleteStudentData);

	if (!options.studentAccountsEnabled) {
		return configuredRouter;
	}

	configuredRouter.post("/students", validAdmin, teacherVerificationLimiter, createStudent);
	configuredRouter.patch("/students/:studentID", validAdmin, requireStudentDataWriteLease, setStudentActive);
	configuredRouter.post(
		"/students/:studentID/access-code",
		validAdmin,
		teacherVerificationLimiter,
		requireStudentDataWriteLease,
		resetStudentAccessCode
	);
	configuredRouter.get("/students/:studentID/projects", validAdmin, listManagedPythonProjects);
	configuredRouter.post(
		"/students/:studentID/projects/:projectID/review",
		validAdmin,
		requireStudentDataWriteLease,
		teacherProjectWriteLimiter,
		createPythonProjectReview
	);
	configuredRouter.put(
		"/students/:studentID/projects/:projectID/review/:reviewID",
		validAdmin,
		requireStudentDataWriteLease,
		teacherProjectWriteLimiter,
		updatePythonProjectReview
	);

	return configuredRouter;
}

// Kept as a complete route fixture for focused controller tests. Production
// mounts a configured instance through mountRuntimeAccountRoutes.
export const adminRoutes = createAdminRoutes({
	analyticsRetentionDays: 90,
	studentAccountsEnabled: true,
	studentRecordMaintenanceEnabled: true
});
