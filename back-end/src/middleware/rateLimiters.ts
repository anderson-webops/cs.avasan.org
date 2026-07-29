import type { RateLimitRequestHandler } from "express-rate-limit";
import { env } from "node:process";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { normalizeStudentUsername } from "../security/studentCredentials.js";
import {
	HEAVY_PROJECT_PAYLOAD_THRESHOLD_BYTES,
	isHeavyProjectPayload,
	projectPayloadIdentity
} from "./projectPayload.js";

interface TunableRateLimitOptions {
	limit?: number;
	windowMs?: number;
}

interface HeavyProjectRateLimitOptions extends TunableRateLimitOptions {
	heavyThresholdBytes?: number;
}

const standardRateLimitHeaders = {
	standardHeaders: true,
	legacyHeaders: false
} as const;
const PROJECT_WRITE_LIMIT_APPLIED = Symbol.for(
	"cs.avasan.org.project-write-limit-applied"
);

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

export function createStudentLoginIpLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: 15 * 60 * 1000,
		// A classroom commonly shares one public IP, so this ceiling is
		// deliberately much higher than the per-username limiter below.
		limit: 120,
		...standardRateLimitHeaders,
		message: { message: "Too many login attempts. Please try again later." },
		...options
	});
}

export function createStudentCredentialLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 10,
		...standardRateLimitHeaders,
		skipSuccessfulRequests: true,
		keyGenerator: (req) => {
			const rawUsername = typeof req.body?.username === "string"
				? req.body.username
				: "";
			const username = normalizeStudentUsername(rawUsername).slice(0, 24);
			if (username) return `student:${username}`;
			const client = ipKeyGenerator(
				req.ip || req.socket.remoteAddress || "unknown"
			);
			return `invalid:${client}`;
		},
		message: { message: "Too many login attempts. Please try again later." },
		...options
	});
}

export function createStudentProjectWriteLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 300,
		...standardRateLimitHeaders,
		keyGenerator: req => req.session?.studentID
			?? ipKeyGenerator(req.ip || req.socket.remoteAddress || "unknown"),
		message: { message: "Too many project changes. Please try again shortly." },
		...options
	});
	const applyOnce = ((req, res, next) => {
		const limitedRequest = req as typeof req & {
			[PROJECT_WRITE_LIMIT_APPLIED]?: boolean;
		};
		if (limitedRequest[PROJECT_WRITE_LIMIT_APPLIED]) {
			next();
			return;
		}

		limitedRequest[PROJECT_WRITE_LIMIT_APPLIED] = true;
		limiter(req, res, next);
	}) as RateLimitRequestHandler;
	applyOnce.resetKey = limiter.resetKey;
	applyOnce.getKey = limiter.getKey;
	return applyOnce;
}

export function createHeavyProjectPayloadLimiter(
	options: HeavyProjectRateLimitOptions = {}
): RateLimitRequestHandler {
	const {
		heavyThresholdBytes = HEAVY_PROJECT_PAYLOAD_THRESHOLD_BYTES,
		...rateOptions
	} = options;
	return rateLimit({
		windowMs: 15 * 60 * 1000,
		// Large bodies are exceptional imports/snapshots. Normal autosaves never
		// enter this tier and retain the 300-request classroom allowance.
		limit: 20,
		...standardRateLimitHeaders,
		keyGenerator: projectPayloadIdentity,
		skip: req => !isHeavyProjectPayload(req, heavyThresholdBytes),
		message: {
			message: "Too many large project saves. Please try again later."
		},
		...rateOptions
	});
}

export function createStudentPasswordSetupLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 10,
		...standardRateLimitHeaders,
		keyGenerator: req => req.session?.studentID
			?? ipKeyGenerator(req.ip || req.socket.remoteAddress || "unknown"),
		message: {
			message: "Too many password setup attempts. Please try again later."
		},
		...options
	});
}

export function createStudentOAuthLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: positiveIntegerFromEnv(
			"OAUTH_RATE_WINDOW_MS",
			15 * 60 * 1000
		),
		// Each provider round trip makes two requests. This accommodates a
		// classroom behind one address while still bounding automated churn.
		limit: positiveIntegerFromEnv("OAUTH_RATE_MAX", 120),
		...standardRateLimitHeaders,
		message: {
			message: "Too many sign-in attempts. Please try again later."
		},
		...options
	});
}

/**
 * Classroom usage events are anonymous. The default in-memory rate-limit store
 * uses a client address only for a short abuse-prevention window; it is never
 * written to MongoDB or included in the analytics aggregate.
 */
export function createClassroomUsageLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: 5 * 60 * 1000,
		// Shared school networks need room for a full class opening courses and
		// the IDE together while still bounding automated event floods.
		limit: 600,
		...standardRateLimitHeaders,
		message: {
			message: "Too many classroom activity updates. Please try again shortly."
		},
		...options
	});
}

export function createTeacherVerificationLimiter(
	options: TunableRateLimitOptions = {}
): RateLimitRequestHandler {
	return rateLimit({
		windowMs: 15 * 60 * 1000,
		limit: 10,
		...standardRateLimitHeaders,
		skipSuccessfulRequests: true,
		requestWasSuccessful: (_req, res) => res.statusCode !== 403,
		message: { message: "Too many password checks. Please try again later." },
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
