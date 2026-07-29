import type { RequestHandler } from "express";
import { env } from "node:process";
import { readClassroomOrigin } from "../security/environment.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

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
	const isStudentActivityHeartbeat
		= method === "GET" && req.get("X-Student-Activity") === "1";
	const isAdminActivityHeartbeat
		= method === "GET" && req.get("X-Admin-Activity") === "1";
	if (
		SAFE_METHODS.has(method)
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
