// src/server.ts
import process, { env, exit } from "node:process";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

import {
	requireStudentContext,
	validAdmin,
	validStudent
} from "./middleware/auth.js";
import { requireClassroomRequest } from "./middleware/classroomRequest.js";
import { requireInternalDiagnostics } from "./middleware/internalDiagnostics.js";
import {
	createProjectJsonParser,
	createProjectPayloadConcurrencyGuard
} from "./middleware/projectPayload.js";
import {
	createHeavyProjectPayloadLimiter,
	createStudentProjectWriteLimiter
} from "./middleware/rateLimiters.js";
import { Admin } from "./models/schemas/Admin.js";
import { ClassroomUsageDaily } from "./models/schemas/ClassroomUsageDaily.js";
import { PythonProject } from "./models/schemas/PythonProject.js";
import { PythonProjectReview } from "./models/schemas/PythonProjectReview.js";
import { Student } from "./models/schemas/Student.js";
import { mountClassroomAnalyticsRoutes } from "./routes/classroomAnalyticsRoutes.js";
import { mountRuntimeAccountRoutes } from "./routes/runtimeAccountRoutes.js";
import {
	readClassroomAnalyticsRetentionDays,
	readClassroomAnalyticsServiceKey
} from "./security/classroomAnalytics.js";
import {
	readBooleanSetting,
	readClassroomOrigin,
	readSessionSecret
} from "./security/environment.js";
import { readTrustProxySetting } from "./security/trustProxy.js";
import { reconcilePythonProjectQuotas } from "./services/pythonProjectQuotaReconciliation.js";
import { readMongoSecret } from "./vaultClient.js";
import "dotenv/config";

async function main() {
	const app = express();
	const internalDiagnosticsKey = env.INTERNAL_DIAGNOSTICS_KEY;
	const classroomAnalyticsRetentionDays
		= readClassroomAnalyticsRetentionDays(
			env.CLASSROOM_ANALYTICS_RETENTION_DAYS
		);
	const classroomAnalyticsCollectionEnabled = readBooleanSetting(
		env.CLASSROOM_ANALYTICS_COLLECTION_ENABLED,
		"CLASSROOM_ANALYTICS_COLLECTION_ENABLED"
	);
	const classroomAnalyticsServiceKey
		= readClassroomAnalyticsServiceKey(
			env.CLASSROOM_ANALYTICS_SERVICE_KEY
		);
	app.use(helmet());

	// health
	app.get("/healthz", (_req, res) => {
		res.set("Cache-Control", "no-store");
		res.json({ ok: true });
	});

	app.set("trust proxy", readTrustProxySetting(env.TRUST_PROXY_HOPS));

	// Sessions precede parsers so large project payloads can be authenticated
	// before the server accepts them.
	///   COOKIES   ///
	const isProd = env.NODE_ENV === "production";
	const sessionSecret = readSessionSecret(env.SESSION_SECRET, isProd);
	const isCrossSite = readBooleanSetting(env.CROSS_SITE, "CROSS_SITE");
	readClassroomOrigin(env.CLASSROOM_ORIGIN, isProd);
	type CookieSessionOpts = Parameters<typeof cookieSession>[0];
	if (isCrossSite) {
		throw new Error(
			"CROSS_SITE=true is not supported; classroom sessions must stay same-origin."
		);
	}

	const cookieOptions: CookieSessionOpts = {
		name: isProd ? "__Host-session" : "session",
		keys: [sessionSecret],
		httpOnly: true,
		overwrite: true,
		path: "/",
		sameSite: "lax", // default, safe for dev & same-origin
		secure: false // default in dev
	};

	// Production keeps the same-origin cookie boundary and adds HTTPS-only
	// delivery. The API is intentionally exposed through the site's /api path.
	if (isProd) {
		cookieOptions.secure = true;
	}

	app.use(cookieSession(cookieOptions));

	// Cookie-authenticated mutations require the same-origin API client's
	// custom header before any request body is parsed.
	app.use(
		["/accounts", "/students", "/admins"],
		requireClassroomRequest
	);

	// Authenticated project payloads may include binary assets and are the only
	// requests allowed above the global 1 MB JSON limit.
	const projectJson = createProjectJsonParser();
	const studentProjectWriteLimiter = createStudentProjectWriteLimiter();
	const teacherProjectWriteLimiter = createStudentProjectWriteLimiter();
	const heavyProjectPayloadLimiter = createHeavyProjectPayloadLimiter();
	const projectPayloadConcurrencyGuard = createProjectPayloadConcurrencyGuard();
	const projectMutationMethods = new Set(["DELETE", "PATCH", "POST", "PUT"]);
	const isProjectMutation = (req: express.Request) =>
		projectMutationMethods.has(req.method.toUpperCase());
	const limitProjectMutation = (
		limiter: express.RequestHandler
	) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
		if (!isProjectMutation(req)) {
			next();
			return;
		}
		limiter(req, res, next);
	};
	const parseProjectMutation = (
		req: express.Request,
		res: express.Response,
		next: express.NextFunction
	) => {
		if (!isProjectMutation(req)) {
			next();
			return;
		}
		projectJson(req, res, next);
	};
	app.use(
		["/students/projects", "/students/project-reviews"],
		validStudent,
		requireStudentContext
	);
	app.use(
		"/students/projects",
		limitProjectMutation(studentProjectWriteLimiter),
		limitProjectMutation(heavyProjectPayloadLimiter),
		limitProjectMutation(projectPayloadConcurrencyGuard),
		parseProjectMutation
	);
	app.use(
		/^\/admins\/students\/[a-f\d]{24}\/projects(?:\/|$)/i,
		validAdmin,
		limitProjectMutation(teacherProjectWriteLimiter),
		limitProjectMutation(heavyProjectPayloadLimiter),
		limitProjectMutation(projectPayloadConcurrencyGuard),
		parseProjectMutation
	);

	app.use(bodyParser.json({ limit: "1mb" }));

	// Authentication and student data must never be stored by intermediaries.
	app.use((req, res, next) => {
		if (
			req.path.startsWith("/accounts")
			|| req.path.startsWith("/students")
			|| req.path.startsWith("/admins/students")
		) {
			res.setHeader("Cache-Control", "no-store");
		}
		next();
	});

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
	await Promise.all([
		Admin.init(),
		ClassroomUsageDaily.init(),
		Student.init(),
		// Reconcile the former sparse import-ID index with the partial index.
		// Legacy projects without an import ID remain readable while every new
		// project is required to have a stable idempotency key.
		PythonProject.syncIndexes(),
		PythonProjectReview.init()
	]);
	await reconcilePythonProjectQuotas();
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

	// Students have an optional, teacher-provisioned project-saving account.
	// Tutor, self-signup, scheduler, and admin-mail routes remain unmounted.
	mountClassroomAnalyticsRoutes(app, {
		collectionEnabled: classroomAnalyticsCollectionEnabled,
		retentionDays: classroomAnalyticsRetentionDays,
		serviceKey: classroomAnalyticsServiceKey
	});
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
