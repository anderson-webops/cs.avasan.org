// src/server.ts
import process, { env, exit } from "node:process";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import mongoose from "mongoose";

import { pythonIdeAssetsProxy } from "./controllers/common/pythonIdeAssetsProxy.js";
import { quoteProxy } from "./controllers/common/quoteProxy.js";
import { requireInternalDiagnostics } from "./middleware/internalDiagnostics.js";
import { mountRuntimeAccountRoutes } from "./routes/runtimeAccountRoutes.js";
import { readTrustProxySetting } from "./security/trustProxy.js";
import { readMongoSecret } from "./vaultClient.js";
import "dotenv/config";

async function main() {
	const app = express();
	const internalDiagnosticsKey = env.INTERNAL_DIAGNOSTICS_KEY;

	// health
	app.get("/healthz", (_req, res) => {
		res.set("Cache-Control", "no-store");
		res.json({ ok: true });
	});

	const SESSION_SECRET = env.SESSION_SECRET;
	if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET");

	app.set("trust proxy", readTrustProxySetting(env.TRUST_PROXY_HOPS));

	// 1) parsers first (with limits)
	app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
	app.use(bodyParser.json({ limit: "1mb" }));

	// 2) sessions BEFORE any route that needs req.session
	///   COOKIES   ///
	const isProd = env.NODE_ENV === "production";
	const isCrossSite = !!env.CROSS_SITE;
	type CookieSessionOpts = Parameters<typeof cookieSession>[0];

	const cookieOptions: CookieSessionOpts = {
		name: "session",
		keys: [SESSION_SECRET],
		maxAge: 24 * 60 * 60 * 1000,
		sameSite: "lax", // default, safe for dev & same-origin
		secure: false // default in dev
	};

	// Adjust for production
	if (isProd) {
		if (isCrossSite) {
			cookieOptions.sameSite = "none"; // required for cross-site
			cookieOptions.secure = true; // required when SameSite=None
			// cookieOptions.domain = ".example.com"; // optional if you want subdomain sharing
		}
		else {
			cookieOptions.sameSite = "lax"; // fine for same-origin
			cookieOptions.secure = true; // enforce HTTPS cookies
		}
	}

	app.use(cookieSession(cookieOptions));

	// 3) cache-control for auth endpoints
	app.use((req, res, next) => {
		if (req.path.startsWith("/accounts") || req.path.endsWith("/loggedin")) {
			res.setHeader("Cache-Control", "no-store");
		}
		next();
	});

	// 4) public, read-only classroom resources
	app.use("/quotes", quoteProxy);
	app.use("/python-assets", pythonIdeAssetsProxy);

	// ready
	app.get("/readyz", async (_req, res) => {
		const connection = mongoose.connection;
		const state = connection.readyState;
		if (state !== 1 || !connection.db) {
			return res.status(503).set("Cache-Control", "no-store").json({
				ready: false,
				components: {
					db: { ok: false, state }
				}
			});
		}

		try {
			await connection.db.admin().ping();
			return res.set("Cache-Control", "no-store").json({
				ready: true,
				components: {
					db: { ok: true, state }
				}
			});
		}
		catch (error) {
			return res.status(503).set("Cache-Control", "no-store").json({
				ready: false,
				components: {
					db: {
						ok: false,
						state,
						error: error instanceof Error ? error.message : "db-ping-failed"
					}
				}
			});
		}
	});

	// cache-control for auth endpoints
	app.use((req, res, next) => {
		if (req.path.startsWith("/accounts") || req.path.endsWith("/loggedin")) {
			res.setHeader("Cache-Control", "no-store");
		}
		next();
	});

	// --- Get Mongo URI from Vault (preferred), else env fallback ---
	let mongoUri: string | undefined;
	try {
		const { uri } = await readMongoSecret(); // your Vault client should read from KV v2
		mongoUri = uri;
	}
	catch (e) {
		// Fail silently if Vault is not available, then probably local test (Had to do this to avoid weird requirements
		// console.log("Vault unavailable, falling back to MONGODB_URI:", e);
		const m: string = e?.toString() || "";
		if (!m.includes("Failed to fetch") && !m.includes("connect ECONNREFUSED")) {
			console.log("");
		}

		mongoUri = env.MONGODB_URI;
	}

	if (!mongoUri) {
		throw new Error("No MongoDB URI available (Vault and MONGODB_URI missing)");
	}

	await mongoose.connect(mongoUri);
	console.log("Connected to MongoDB");
	const c = mongoose.connection;
	console.log(`Mongo connected: db=${c.db?.databaseName} host=${c.host} name=${c.name}`);
	app.get("/_dbinfo", requireInternalDiagnostics(internalDiagnosticsKey), (_req, res) => {
		res.set("Cache-Control", "no-store").json({
			databaseName: c.db?.databaseName ?? null,
			host: c.host || null,
			name: c.name || null,
			readyState: c.readyState,
			usingVault: !!env.VAULT_ROLE_ID && !!env.VAULT_SECRET_ID
		});
	});

	// Julio is the only authenticated account. Student, tutor, signup, and
	// admin-mail routes intentionally are not part of this downstream runtime.
	mountRuntimeAccountRoutes(app);

	const PORT = Number(env.PORT || 3008);
	const HOST = env.HOST || env.BACKEND_HOST || "127.0.0.1";
	const server = app.listen(PORT, HOST, () =>
		console.log(`Server listening on http://${HOST}:${PORT}!`));
	let isShuttingDown = false;

	const shutdown = async (signal: NodeJS.Signals) => {
		if (isShuttingDown) {
			return;
		}

		isShuttingDown = true;
		console.log(`${signal} received, shutting down gracefully...`);

		try {
			if (server.listening) {
				await new Promise<void>((resolve, reject) => {
					server.close((error) => {
						if (error) {
							reject(error);
							return;
						}

						resolve();
					});
				});
			}

			if (mongoose.connection.readyState !== 0) {
				await mongoose.disconnect();
			}

			console.log("Graceful shutdown complete.");
			exit(0);
		}
		catch (error) {
			console.error("Graceful shutdown failed:", error);
			exit(1);
		}
	};

	process.once("SIGINT", () => {
		void shutdown("SIGINT");
	});
	process.once("SIGTERM", () => {
		void shutdown("SIGTERM");
	});
}

main().catch((err) => {
	console.error(err);
	exit(1);
});
