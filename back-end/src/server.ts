// src/server.ts
import { env, exit } from "node:process";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import { quoteProxy } from "./controllers/common/quoteProxy.js";
import { accountRoutes } from "./routes/accountRoutes.js";
import { adminMailRoutes } from "./routes/adminMailRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { tutorRoutes } from "./routes/tutorRoutes.js";

import { userRoutes } from "./routes/userRoutes.js";

import { readMongoSecret } from "./vaultClient.js";
import "dotenv/config";

async function main() {
	const app = express();
	const internalDiagnosticsKey = env.INTERNAL_DIAGNOSTICS_KEY;
	const loopbackAddresses = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

	// health
	app.get("/healthz", (_req, res) => {
		res.set("Cache-Control", "no-store");
		res.json({ ok: true });
	});

	const SESSION_SECRET = env.SESSION_SECRET;
	if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET");

	app.set("trust proxy", 1);

	// 1) parsers first (with limits)
	app.use(bodyParser.urlencoded({ extended: false, limit: "256kb" }));
	app.use(bodyParser.json({ limit: "256kb" }));

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

	// 4) rate limit (can be before or after parsers; keep before routes)
	const rateWindowMs = Number(env.RATE_WINDOW_MS || 60000);
	const rateMax = Number(env.RATE_MAX || 20); // v7 also accepts `limit`; be consistent
	const adminMailLimiter = rateLimit({
		windowMs: rateWindowMs,
		limit: rateMax,
		standardHeaders: true,
		legacyHeaders: false,
		message: { message: "Too many requests, slow down." }
	});
	app.use("/admin-mail", adminMailLimiter, adminMailRoutes);

	//
	app.use("/quotes", quoteProxy);

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
	app.get("/_dbinfo", (req, res) => {
		const forwardedFor = req.headers["x-forwarded-for"];
		const forwardedIp = typeof forwardedFor === "string"
			? forwardedFor.split(",")[0]?.trim()
			: Array.isArray(forwardedFor)
				? forwardedFor[0]?.trim()
				: undefined;
		const clientIp = forwardedIp || req.ip || req.socket.remoteAddress || "";
		const isInternalRequest = env.NODE_ENV !== "production"
			|| (internalDiagnosticsKey && req.get("x-internal-diagnostics-key") === internalDiagnosticsKey)
			|| loopbackAddresses.has(clientIp);

		if (!isInternalRequest) {
			return res.status(403).set("Cache-Control", "no-store").json({ ok: false, error: "forbidden" });
		}

		res.set("Cache-Control", "no-store").json({
			databaseName: c.db?.databaseName ?? null,
			host: c.host || null,
			name: c.name || null,
			readyState: c.readyState,
			usingVault: !!env.VAULT_ROLE_ID && !!env.VAULT_SECRET_ID
		});
	});

	// Your routes (note: you’ve commented an axios baseURL elsewhere; these are mounted as-is)
	app.use("/tutors", tutorRoutes);
	app.use("/users", userRoutes);
	app.use("/admins", adminRoutes);
	app.use("/accounts", accountRoutes);

	// after your session middleware in server.ts
	app.get("/accounts/me", (req, res) => {
		const s = req.session as any;
		res.json({ adminID: s?.adminID ?? null, tutorID: s?.tutorID ?? null, userID: s?.userID ?? null });
	});

	const PORT = env.PORT || 3008;
	const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
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
