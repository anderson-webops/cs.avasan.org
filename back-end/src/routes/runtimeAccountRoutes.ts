import type { Express } from "express";
import { requireClassroomRequest } from "../middleware/classroomRequest.js";
import { createAccountRoutes } from "./accountRoutes.js";
import { adminRoutes } from "./adminRoutes.js";
import { studentRoutes } from "./studentRoutes.js";

/**
 * Mount the complete authenticated surface for this downstream application.
 *
 * Keeping this small registry shared by the server and route tests makes it
 * difficult to accidentally restore public student, tutor, or admin creation.
 */
export function mountRuntimeAccountRoutes(app: Express): void {
	app.use(
		["/accounts", "/students", "/admins"],
		(_req, res, next) => {
			res.setHeader("Cache-Control", "no-store");
			next();
		},
		requireClassroomRequest
	);
	app.use("/admins", adminRoutes);
	app.use("/students", studentRoutes);
	app.use("/accounts", createAccountRoutes());
}
