import type { Express } from "express";
import { Router } from "express";
import { recordClassroomUsage } from "../controllers/classroomAnalyticsController.js";
import { requireAnonymousClassroomUsageRequest } from "../middleware/classroomRequest.js";
import { createClassroomUsageLimiter } from "../middleware/rateLimiters.js";

interface ClassroomAnalyticsRouteOptions {
	collectionEnabled: boolean;
	retentionDays: number;
}

export function mountClassroomAnalyticsRoutes(app: Express, options: ClassroomAnalyticsRouteOptions): void {
	const router = Router();

	router.use((_req, res, next) => {
		res.set("Cache-Control", "no-store");
		next();
	});
	if (options.collectionEnabled) {
		const usageLimiter = createClassroomUsageLimiter();
		router.post(
			"/classroom-usage",
			requireAnonymousClassroomUsageRequest,
			usageLimiter,
			recordClassroomUsage(options.retentionDays)
		);
	}
	app.use(router);
}
