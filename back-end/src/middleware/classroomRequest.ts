import type { RequestHandler } from "express";
import { env } from "node:process";
import { readClassroomOrigin } from "../security/environment.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const APPLE_OAUTH_CALLBACK_PATH
	= /^\/(?:api\/)?students\/oauth\/apple\/callback$/;
const MATH_CLASSROOM_ORIGIN = "https://math.avasan.org";

function normalizeOrigin(value: string): string | null {
	try {
		const origin = new URL(value).origin;
		return origin === "null" ? null : origin;
	}
	catch {
		return null;
	}
}

function expectedRequestOrigin(
	req: Parameters<RequestHandler>[0]
): string | null {
	const configuredOrigin = readClassroomOrigin(
		env.CLASSROOM_ORIGIN,
		env.NODE_ENV === "production"
	);
	if (configuredOrigin) return configuredOrigin;

	const host = req.get("host");
	if (!host) return null;
	return normalizeOrigin(`${req.protocol}://${host}`);
}

/**
 * Cookie-authenticated mutations must come through the same-origin API client.
 * The custom header forces cross-origin browsers to preflight, while the
 * Fetch-Metadata and Origin checks provide independent request-context checks.
 */
export const requireClassroomRequest: RequestHandler = (req, res, next) => {
	const method = req.method.toUpperCase();
	const originalPath = req.originalUrl.split("?", 1)[0];
	const isAppleOAuthCallback
		= method === "POST" && APPLE_OAUTH_CALLBACK_PATH.test(originalPath);
	const isStudentActivityHeartbeat
		= method === "GET" && req.get("X-Student-Activity") === "1";
	const isAdminActivityHeartbeat
		= method === "GET" && req.get("X-Admin-Activity") === "1";
	if (
		(isAppleOAuthCallback || SAFE_METHODS.has(method))
		&& !isStudentActivityHeartbeat
		&& !isAdminActivityHeartbeat
	) {
		next();
		return;
	}

	if (req.get("X-Classroom-Request") !== "1") {
		res.status(403).json({ message: "Classroom request header required." });
		return;
	}

	if (req.get("Sec-Fetch-Site")?.toLowerCase() === "cross-site") {
		res.status(403).json({ message: "Cross-site request denied." });
		return;
	}

	const originHeader = req.get("Origin");
	if (originHeader) {
		const origin = normalizeOrigin(originHeader);
		const expectedOrigin = expectedRequestOrigin(req);
		if (!origin || !expectedOrigin || origin !== expectedOrigin) {
			res.status(403).json({ message: "Request origin denied." });
			return;
		}
	}

	next();
};

/**
 * Anonymous aggregate events can arrive through either classroom's
 * same-origin reverse proxy. Unlike account and Admin routes, this endpoint
 * rejects credentials and binds each accepted browser Origin to its fixed
 * siteID.
 */
export const requireAnonymousClassroomUsageRequest: RequestHandler = (
	req,
	res,
	next
) => {
	if (req.headers.cookie !== undefined || req.headers.authorization !== undefined) {
		res.status(403).json({
			message: "Classroom usage requests must not include credentials."
		});
		return;
	}

	if (req.get("X-Classroom-Request") !== "1") {
		res.status(403).json({ message: "Classroom request header required." });
		return;
	}

	if (req.get("Sec-Fetch-Site")?.toLowerCase() === "cross-site") {
		res.status(403).json({ message: "Cross-site request denied." });
		return;
	}

	const originHeader = req.get("Origin");
	const origin = originHeader ? normalizeOrigin(originHeader) : null;
	const siteID = typeof req.body === "object" && req.body !== null
		? (req.body as { siteID?: unknown }).siteID
		: undefined;
	const isMathRequest = origin === MATH_CLASSROOM_ORIGIN
		&& siteID === "math";
	const isCSOrInvalidRequest = siteID !== "math" && (
		originHeader === undefined
		|| (
			origin !== null
			&& origin !== MATH_CLASSROOM_ORIGIN
			&& origin === expectedRequestOrigin(req)
		)
	);

	if (!isCSOrInvalidRequest && !isMathRequest) {
		res.status(403).json({ message: "Request origin denied." });
		return;
	}

	next();
};
