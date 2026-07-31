import type { RequestHandler } from "express";
import { Buffer } from "node:buffer";
import { timingSafeEqual } from "node:crypto";

export const MIN_INTERNAL_DIAGNOSTICS_KEY_BYTES = 32;

export function readInternalDiagnosticsKey(value: string | undefined): string | undefined {
	if (value === undefined || value === "") return undefined;
	if (!value.trim()) {
		throw new TypeError("INTERNAL_DIAGNOSTICS_KEY cannot contain only whitespace");
	}
	if (Buffer.byteLength(value, "utf8") < MIN_INTERNAL_DIAGNOSTICS_KEY_BYTES) {
		throw new TypeError(
			`INTERNAL_DIAGNOSTICS_KEY must be at least ${MIN_INTERNAL_DIAGNOSTICS_KEY_BYTES} UTF-8 bytes when configured`
		);
	}
	return value;
}

function keysMatch(expected: string | undefined, provided: string | undefined): boolean {
	if (!expected || !provided) return false;
	const expectedBytes = Buffer.from(expected);
	const providedBytes = Buffer.from(provided);
	return expectedBytes.length === providedBytes.length && timingSafeEqual(expectedBytes, providedBytes);
}

export function requireInternalDiagnostics(internalDiagnosticsKey: string | undefined): RequestHandler {
	return (req, res, next) => {
		if (!keysMatch(internalDiagnosticsKey, req.get("x-internal-diagnostics-key"))) {
			res.status(403).set("Cache-Control", "no-store").json({
				ok: false,
				error: "forbidden"
			});
			return;
		}

		next();
	};
}
