import type { RequestHandler } from "express";
import { Buffer } from "node:buffer";
import { createHash, timingSafeEqual } from "node:crypto";

export const CLASSROOM_ANALYTICS_SERVICE_HEADER
	= "x-classroom-analytics-key";
export const MIN_CLASSROOM_ANALYTICS_SERVICE_KEY_BYTES = 32;
export const MAX_CLASSROOM_ANALYTICS_SERVICE_KEY_BYTES = 256;
export const CLASSROOM_ANALYTICS_SERVICE_HOST = "127.0.0.2";
const CLASSROOM_ANALYTICS_SERVICE_PATH = "/classroom-analytics/summary";

function secretDigest(value: string): Buffer {
	return createHash("sha256").update(value, "utf8").digest();
}

export function readClassroomAnalyticsServiceKey(
	value: string | undefined
): string | null {
	if (value === undefined || value === "") return null;
	if (value !== value.trim()) {
		throw new Error(
			"CLASSROOM_ANALYTICS_SERVICE_KEY must not have surrounding whitespace."
		);
	}
	const byteLength = Buffer.byteLength(value, "utf8");
	if (
		byteLength < MIN_CLASSROOM_ANALYTICS_SERVICE_KEY_BYTES
		|| byteLength > MAX_CLASSROOM_ANALYTICS_SERVICE_KEY_BYTES
		|| /[\r\n]/u.test(value)
	) {
		throw new Error(
			"CLASSROOM_ANALYTICS_SERVICE_KEY must contain 32 through 256 UTF-8 bytes on one line."
		);
	}
	return value;
}

function hasRequestBody(req: Parameters<RequestHandler>[0]): boolean {
	const contentLength = req.get("content-length");
	if (contentLength !== undefined) {
		const parsedLength = Number(contentLength);
		if (!Number.isSafeInteger(parsedLength) || parsedLength < 0) return true;
		if (parsedLength > 0) return true;
	}
	return req.get("transfer-encoding") !== undefined;
}

function isLoopbackAddress(value: string | undefined): boolean {
	return value === "127.0.0.1"
		|| value === "::1"
		|| value === "::ffff:127.0.0.1";
}

function directLoopbackHost(req: Parameters<RequestHandler>[0]): string | null {
	if (
		req.socket.localAddress !== CLASSROOM_ANALYTICS_SERVICE_HOST
		|| !Number.isSafeInteger(req.socket.localPort)
		|| (req.socket.localPort ?? 0) <= 0
	) {
		return null;
	}
	return `${CLASSROOM_ANALYTICS_SERVICE_HOST}:${req.socket.localPort}`;
}

/**
 * Express routes are case-insensitive and non-strict by default. Enforce the
 * raw origin-form path and direct loopback Host before any limiter, secret
 * comparison, or database work so proxy and spelling variants remain the same
 * indistinguishable JSON 404 as an absent route.
 */
export function requireExactClassroomAnalyticsServiceTarget(): RequestHandler {
	return (req, res, next) => {
		res.set("Cache-Control", "no-store");
		const queryStart = req.originalUrl.indexOf("?");
		const rawPath = queryStart === -1
			? req.originalUrl
			: req.originalUrl.slice(0, queryStart);
		const expectedHost = directLoopbackHost(req);
		if (
			rawPath !== CLASSROOM_ANALYTICS_SERVICE_PATH
			|| expectedHost === null
			|| req.headers.host !== expectedHost
		) {
			res.status(404).json({ message: "Not found" });
			return;
		}
		next();
	};
}

/**
 * Authenticate the server-to-server summary request before the controller can
 * perform any MongoDB work. Hashing both values first gives timingSafeEqual a
 * fixed-size comparison without exposing the configured secret's length.
 */
export function requireClassroomAnalyticsService(
	serviceKey: string
): RequestHandler {
	const expectedDigest = secretDigest(serviceKey);

	return (req, res, next) => {
		res.set("Cache-Control", "no-store");
		if (req.method !== "GET") {
			res.set("Allow", "GET").status(405).json({ message: "Method not allowed" });
			return;
		}
		if (
			req.get("authorization") !== undefined
			|| req.get("cookie") !== undefined
			|| req.get("forwarded") !== undefined
			|| req.get("x-forwarded-for") !== undefined
			|| req.get("x-forwarded-host") !== undefined
			|| req.get("x-forwarded-proto") !== undefined
			|| hasRequestBody(req)
			|| !isLoopbackAddress(req.socket.remoteAddress)
		) {
			res.status(400).json({ message: "Invalid request" });
			return;
		}

		const provided = req.headers[CLASSROOM_ANALYTICS_SERVICE_HEADER];
		if (
			typeof provided !== "string"
			|| Buffer.byteLength(provided, "utf8")
			> MAX_CLASSROOM_ANALYTICS_SERVICE_KEY_BYTES
		) {
			res.status(403).json({ message: "Forbidden" });
			return;
		}
		const providedDigest = secretDigest(provided);
		if (!timingSafeEqual(expectedDigest, providedDigest)) {
			res.status(403).json({ message: "Forbidden" });
			return;
		}
		next();
	};
}
