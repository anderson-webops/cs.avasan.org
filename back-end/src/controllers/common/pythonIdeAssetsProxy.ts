import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { env } from "node:process";
import { Readable } from "node:stream";
import { Router } from "express";

const DEFAULT_ASSETS_ZIP_URL = "https://static.classes.jacobdanderson.net/assets.zip";
const PYTHON_IDE_ASSETS_ZIP_URL = env.PYTHON_IDE_ASSETS_ZIP_URL || DEFAULT_ASSETS_ZIP_URL;

export const pythonIdeAssetsProxy = Router().get("/assets.zip", async (_req, res) => {
	try {
		const upstream = await fetch(PYTHON_IDE_ASSETS_ZIP_URL);
		if (!upstream.ok || !upstream.body) {
			const body = await upstream.text().catch(() => "");
			return res.status(upstream.status || 502).send(body || "Unable to load Python IDE asset pack.");
		}

		const contentType = upstream.headers.get("content-type") || "application/zip";
		const contentLength = upstream.headers.get("content-length");
		const etag = upstream.headers.get("etag");
		const lastModified = upstream.headers.get("last-modified");

		res.setHeader("Content-Type", contentType);
		res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
		if (contentLength) res.setHeader("Content-Length", contentLength);
		if (etag) res.setHeader("ETag", etag);
		if (lastModified) res.setHeader("Last-Modified", lastModified);

		Readable.fromWeb(upstream.body as unknown as NodeReadableStream<Uint8Array>).pipe(res);
	}
	catch (err) {
		console.error("python ide assets proxy failed:", err);
		res.status(502).json({ error: "Unable to reach Python IDE asset pack" });
	}
});
