import type { RateLimitRequestHandler } from "express-rate-limit";
import { env } from "node:process";
import rateLimit from "express-rate-limit";

interface TunableRateLimitOptions {
	limit?: number;
	windowMs?: number;
}

const standardRateLimitHeaders = {
	standardHeaders: true,
	legacyHeaders: false
} as const;

function positiveIntegerFromEnv(name: string, fallback: number): number {
	const value = Number(env[name]);
	return Number.isSafeInteger(value) && value > 0 ? value : fallback;
}

export function createLoginLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: positiveIntegerFromEnv("LOGIN_RATE_WINDOW_MS", 15 * 60 * 1000),
		limit: positiveIntegerFromEnv("LOGIN_RATE_MAX", 10),
		...standardRateLimitHeaders,
		message: { message: "Too many login attempts. Please try again later." },
		...options
	});
}

export function createUserCourseAccessLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 100,
		...standardRateLimitHeaders,
		...options
	});
}

export function createAdminMailLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: Number(env.RATE_WINDOW_MS || 60000),
		limit: Number(env.RATE_MAX || 20),
		...standardRateLimitHeaders,
		message: { message: "Too many requests, slow down." },
		...options
	});
}
