import type { RequestHandler } from "express";

/**
 * Keep the API boundary machine-readable even when a feature is intentionally
 * unavailable. The public Nginx 404 remains a branded HTML page, while callers
 * below /api receive only this small, non-cacheable response.
 */
export const apiNotFound: RequestHandler = (_req, res) => {
	res
		.status(404)
		.set("Cache-Control", "no-store")
		.json({ message: "Not found" });
};
