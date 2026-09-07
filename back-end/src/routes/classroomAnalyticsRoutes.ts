import type { Express } from "express";
import { Router } from "express";
import {
	getClassroomAnalyticsSummary,
	recordClassroomUsage
} from "../controllers/classroomAnalyticsController.js";
import { requireAnonymousClassroomUsageRequest } from "../middleware/classroomRequest.js";
import {
	createClassroomAnalyticsServiceClientLimiter,
	createClassroomAnalyticsServiceGlobalLimiter,
	createClassroomUsageLimiter
} from "../middleware/rateLimiters.js";
import {
	requireClassroomAnalyticsService,
	requireExactClassroomAnalyticsServiceTarget
} from "../security/classroomAnalyticsService.js";

interface ClassroomAnalyticsRouteOptions {
	collectionEnabled: boolean;
	retentionDays: number | null;
}

interface ClassroomAnalyticsServiceRouteOptions {
	retentionDays: number | null;
	serviceKey: string | null;
}

export function mountClassroomAnalyticsRoutes(app: Express, options: ClassroomAnalyticsRouteOptions): void {
	const router = Router();

	router.use((_req, res, next) => {
		res.set("Cache-Control", "no-store");
		next();
	});
	if (options.collectionEnabled) {
		if (options.retentionDays === null) {
			throw new Error(
				"Classroom analytics collection requires a configured retention period."
			);
		}
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

/**
 * Mount the loopback-only companion before session and body-parser middleware.
 * Only a request that passes the exact-target and service-key gates can spend
 * the authenticated companion's rate-limit budget or reach MongoDB.
 */
export function mountClassroomAnalyticsServiceRoute(
	app: Express,
	options: ClassroomAnalyticsServiceRouteOptions
): void {
	if (!options.serviceKey) return;

	const globalLimiter = createClassroomAnalyticsServiceGlobalLimiter();
	const clientLimiter = createClassroomAnalyticsServiceClientLimiter();
	app.all(
		"/classroom-analytics/summary",
		requireExactClassroomAnalyticsServiceTarget(),
		requireClassroomAnalyticsService(options.serviceKey),
		globalLimiter,
		clientLimiter,
		getClassroomAnalyticsSummary(options.retentionDays)
	);
}
