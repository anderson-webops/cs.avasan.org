import type { Express } from "express";
import { Router } from "express";
import { getClassroomAnalyticsSummary, recordClassroomUsage } from "../controllers/classroomAnalyticsController.js";
import { requireClassroomAnalyticsService } from "../middleware/classroomAnalyticsAuth.js";
import { requireAnonymousClassroomUsageRequest } from "../middleware/classroomRequest.js";
import { createClassroomUsageLimiter } from "../middleware/rateLimiters.js";

interface ClassroomAnalyticsRouteOptions {
	collectionEnabled: boolean;
	retentionDays: number;
	serviceKey: string | undefined;
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
	router.get(
		"/classroom-analytics/summary",
		requireClassroomAnalyticsService(options.serviceKey),
		getClassroomAnalyticsSummary(options.retentionDays)
	);

	app.use(router);
}
