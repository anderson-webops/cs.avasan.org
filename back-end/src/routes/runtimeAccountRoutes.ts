import type { Express } from "express";
import { requireClassroomRequest } from "../middleware/classroomRequest.js";
import { createAccountRoutes } from "./accountRoutes.js";
import { createAdminRoutes } from "./adminRoutes.js";
import { createStudentRoutes } from "./studentRoutes.js";

export interface RuntimeAccountRouteOptions {
	analyticsRetentionDays: number;
	studentAccountsEnabled: boolean;
	studentOAuthEnabled: boolean;
}

/**
 * Mount the complete authenticated surface for this downstream application.
 *
 * Keeping this small registry shared by the server and route tests makes it
 * difficult to accidentally restore public student, tutor, or admin creation.
 */
export function mountRuntimeAccountRoutes(
	app: Express,
	options: RuntimeAccountRouteOptions
): void {
	app.use(
		["/accounts", "/students", "/admins"],
		(_req, res, next) => {
			res.setHeader("Cache-Control", "no-store");
			next();
		},
		requireClassroomRequest
	);
	app.use("/admins", createAdminRoutes({
		analyticsRetentionDays: options.analyticsRetentionDays,
		studentAccountsEnabled: options.studentAccountsEnabled
	}));
	if (options.studentAccountsEnabled) {
		app.use("/students", createStudentRoutes({
			oauthEnabled: options.studentOAuthEnabled
		}));
	}
	app.use("/accounts", createAccountRoutes());
}
