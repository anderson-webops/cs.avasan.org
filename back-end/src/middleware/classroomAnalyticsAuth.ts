import type { RequestHandler } from "express";
import type { Buffer } from "node:buffer";
import { createHash, timingSafeEqual } from "node:crypto";

const SERVICE_KEY_HEADER = "X-Classroom-Analytics-Key";

function keyDigest(value: string): Buffer {
	return createHash("sha256").update(value, "utf8").digest();
}

function keysMatch(expected: string, provided: string | undefined): boolean {
	return timingSafeEqual(
		keyDigest(expected),
		keyDigest(provided ?? "")
	);
}

export function requireClassroomAnalyticsService(
	serviceKey: string | undefined
): RequestHandler {
	return (req, res, next) => {
		res.set("Cache-Control", "no-store");
		if (!serviceKey) {
			res.status(503).json({
				message: "Classroom analytics summary is not configured."
			});
			return;
		}
		if (!keysMatch(serviceKey, req.get(SERVICE_KEY_HEADER))) {
			res.status(401).json({ message: "Analytics service authentication required." });
			return;
		}

		next();
	};
}
