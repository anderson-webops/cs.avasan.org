import type { Express } from "express";
import type { QueryFilter } from "mongoose";
import type { IStudentDataDeletionReceipt } from "../models/schemas/StudentDataDeletionReceipt.js";
import { requireClassroomRequest } from "../middleware/classroomRequest.js";
import { MAX_STUDENT_RECORD_RETENTION_DAYS, MIN_STUDENT_RECORD_RETENTION_DAYS } from "../security/classroomPrivacy.js";
import { createAccountRoutes } from "./accountRoutes.js";
import { createAdminRoutes } from "./adminRoutes.js";
import { createStudentRoutes } from "./studentRoutes.js";

export interface RuntimeAccountRouteOptions {
	analyticsRetentionDays: number;
	studentAccountsEnabled: boolean;
	studentOAuthEnabled: boolean;
	studentRecordRetentionDays: number | null;
}

export function hasStudentRecordRetentionPeriod(retentionDays: number | null): retentionDays is number {
	return (
		Number.isSafeInteger(retentionDays)
		&& (retentionDays ?? 0) >= MIN_STUDENT_RECORD_RETENTION_DAYS
		&& (retentionDays ?? 0) <= MAX_STUDENT_RECORD_RETENTION_DAYS
	);
}

export function retainedStudentDeletionReceiptFilter(now: Date): QueryFilter<IStudentDataDeletionReceipt> {
	return {
		$or: [{ status: { $in: ["in-progress", "needs-retry"] } }, { status: "completed", expiresAt: { $gt: now } }]
	};
}

export function assertRetainedStudentDataHasRetentionPeriod(
	retentionDays: number | null,
	retainedData: {
		deletionReceiptsExist: boolean;
		studentRecordsExist: boolean;
	}
): void {
	if (
		(retainedData.studentRecordsExist || retainedData.deletionReceiptsExist)
		&& !hasStudentRecordRetentionPeriod(retentionDays)
	) {
		throw new Error(
			"Student records or deletion receipts remain, but STUDENT_RECORD_RETENTION_DAYS is not configured. Refusing to start with retained student data outside an active retention policy."
		);
	}
}

/**
 * Mount the complete authenticated surface for this downstream application.
 *
 * Keeping this small registry shared by the server and route tests makes it
 * difficult to accidentally restore public student, tutor, or admin creation.
 */
export function mountRuntimeAccountRoutes(app: Express, options: RuntimeAccountRouteOptions): void {
	const studentRecordMaintenanceEnabled = hasStudentRecordRetentionPeriod(options.studentRecordRetentionDays);
	if (options.studentAccountsEnabled && !studentRecordMaintenanceEnabled) {
		throw new Error("Student account routes require a configured record retention period.");
	}
	app.locals.studentRecordRetentionDays = options.studentRecordRetentionDays;
	const classroomRequestPaths = options.studentAccountsEnabled
		? ["/accounts", "/students", "/admins"]
		: ["/accounts", "/admins"];
	app.use(
		classroomRequestPaths,
		(_req, res, next) => {
			res.setHeader("Cache-Control", "no-store");
			next();
		},
		requireClassroomRequest
	);
	app.use(
		"/admins",
		createAdminRoutes({
			analyticsRetentionDays: options.analyticsRetentionDays,
			studentAccountsEnabled: options.studentAccountsEnabled,
			studentRecordMaintenanceEnabled
		})
	);
	if (options.studentAccountsEnabled) {
		app.use(
			"/students",
			createStudentRoutes({
				oauthEnabled: options.studentOAuthEnabled
			})
		);
	}
	app.use("/accounts", createAccountRoutes());
}
