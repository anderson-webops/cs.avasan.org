import type { RequestHandler } from "express";
import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";

function keysMatch(expected: string | undefined, provided: string | undefined): boolean {
	if (!expected || !provided) return false;
	const expectedBytes = Buffer.from(expected);
	const providedBytes = Buffer.from(provided);
	return expectedBytes.length === providedBytes.length
		&& timingSafeEqual(expectedBytes, providedBytes);
}

export function requireInternalDiagnostics(
	internalDiagnosticsKey: string | undefined
): RequestHandler {
	return (req, res, next) => {
		if (!keysMatch(
			internalDiagnosticsKey,
			req.get("x-internal-diagnostics-key")
		)) {
			res.status(403).set("Cache-Control", "no-store").json({
				ok: false,
				error: "forbidden"
			});
			return;
		}

		next();
	};
}
