import type { Express } from "express";
import { createAccountRoutes } from "./accountRoutes.js";
import { adminRoutes } from "./adminRoutes.js";

/**
 * Mount the complete authenticated surface for this downstream application.
 *
 * Keeping this small registry shared by the server and route tests makes it
 * difficult to accidentally restore public student, tutor, or admin creation.
 */
export function mountRuntimeAccountRoutes(app: Express): void {
	app.use("/admins", adminRoutes);
	app.use("/accounts", createAccountRoutes());
}
