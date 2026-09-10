import type { Server } from "node:http";
import { request as httpRequest } from "node:http";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	projectAggregate: vi.fn(),
	studentCountDocuments: vi.fn(),
	usageFind: vi.fn(),
	usageUpdateMany: vi.fn(),
	usageUpdateOne: vi.fn()
}));

function resultQuery<T>(result: T) {
	return {
		exec: vi.fn().mockResolvedValue(result)
	};
}

function usageFindQuery<T>(result: T) {
	const query = {
		exec: vi.fn().mockResolvedValue(result),
		lean: vi.fn(() => query),
		select: vi.fn(() => query)
	};
	return query;
}

vi.mock("../src/models/schemas/ClassroomUsageDaily.js", () => ({
	ClassroomUsageDaily: {
		find: modelMocks.usageFind,
		updateMany: modelMocks.usageUpdateMany,
		updateOne: modelMocks.usageUpdateOne
	}
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		collection: { name: "students" },
		countDocuments: modelMocks.studentCountDocuments
	}
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		aggregate: modelMocks.projectAggregate
	}
}));

const { enforceClassroomAnalyticsRetention, getClassroomAnalyticsSummary } =
	await import("../src/controllers/classroomAnalyticsController.js");
const {
	createClassroomAnalyticsSummaryLimiter,
	createClassroomAnalyticsSummaryPreAuthLimiter
} = await import("../src/middleware/rateLimiters.js");
const { apiNotFound } = await import("../src/middleware/notFound.js");
const {
	mountClassroomAnalyticsRoutes,
	mountClassroomAnalyticsServiceRoute
} = await import("../src/routes/classroomAnalyticsRoutes.js");
const { CLASSROOM_ANALYTICS_SERVICE_HOST } = await import(
	"../src/security/classroomAnalyticsService.js"
);

interface RuntimeOptions {
	collectionEnabled?: boolean;
	postServiceMiddleware?: express.RequestHandler;
	retentionDays?: number | null;
	serviceKey?: string | null;
	summaryLimit?: number;
}

async function withRuntime<T>(options: RuntimeOptions, run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	const retentionDays = options.retentionDays === undefined
		? 90
		: options.retentionDays;
	app.set("trust proxy", false);
	// macOS does not bind arbitrary 127/8 aliases by default. Model the Linux
	// production socket and Host exactly while the test transport remains on
	// 127.0.0.1; the middleware unit test separately proves the old Classes
	// listener and other Host values are rejected.
	app.use((req, _res, next) => {
		Object.defineProperty(req.socket, "localAddress", {
			configurable: true,
			value: CLASSROOM_ANALYTICS_SERVICE_HOST
		});
		if (req.headers.host?.startsWith("127.0.0.1:")) {
			req.headers.host = `${CLASSROOM_ANALYTICS_SERVICE_HOST}:${req.socket.localPort}`;
		}
		next();
	});
	mountClassroomAnalyticsServiceRoute(app, {
		retentionDays,
		serviceKey: options.serviceKey ?? null
	});
	if (options.postServiceMiddleware) {
		app.use(options.postServiceMiddleware);
	}
	app.use(express.json());
	mountClassroomAnalyticsRoutes(app, {
		collectionEnabled: options.collectionEnabled ?? true,
		retentionDays
	});
	// Controller harness; production exposes this handler only inside the
	// two-tier rate-limited, validAdmin-protected /admins router. This test-only
	// marker represents the identity validAdmin has already loaded from MongoDB.
	app.get(
		"/test-admin-summary",
		createClassroomAnalyticsSummaryPreAuthLimiter({ windowMs: 60_000 }),
		(req, _res, next) => {
			req.currentAdmin = {
				_id: "validated-test-admin"
			} as NonNullable<typeof req.currentAdmin>;
			next();
		},
		createClassroomAnalyticsSummaryLimiter({
			...(options.summaryLimit === undefined ? {} : { limit: options.summaryLimit }),
			windowMs: 60_000
		}),
		getClassroomAnalyticsSummary(retentionDays)
	);
	app.use(apiNotFound);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

function postUsage(baseUrl: string, body: object, headers = {}) {
	return fetch(`${baseUrl}/classroom-usage`, {
		body: JSON.stringify(body),
		headers: {
			"content-type": "application/json",
			"x-classroom-request": "1",
			...headers
		},
		method: "POST"
	});
}

function getWithBody(url: string, body: string): Promise<{
	body: string;
	status: number;
}> {
	return new Promise((resolve, reject) => {
		const request = httpRequest(url, {
			headers: {
				"Content-Length": Buffer.byteLength(body),
				"Content-Type": "application/json",
				"X-Classroom-Analytics-Key": "s".repeat(32)
			},
			method: "GET"
		}, (response) => {
			let responseBody = "";
			response.setEncoding("utf8");
			response.on("data", chunk => responseBody += chunk);
			response.on("end", () => resolve({
				body: responseBody,
				status: response.statusCode ?? 0
			}));
		});
		request.on("error", reject);
		request.end(body);
	});
}

function getWithHost(url: string, host: string): Promise<{
	body: string;
	cacheControl: string | undefined;
	status: number;
}> {
	return new Promise((resolve, reject) => {
		const request = httpRequest(url, {
			headers: {
				Host: host,
				"X-Classroom-Analytics-Key": "s".repeat(32)
			},
			method: "GET"
		}, (response) => {
			let responseBody = "";
			response.setEncoding("utf8");
			response.on("data", chunk => responseBody += chunk);
			response.on("end", () => resolve({
				body: responseBody,
				cacheControl: typeof response.headers["cache-control"] === "string"
					? response.headers["cache-control"]
					: undefined,
				status: response.statusCode ?? 0
			}));
		});
		request.on("error", reject);
		request.end();
	});
}

describe("privacy-preserving classroom analytics routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.usageUpdateOne.mockReturnValue(resultQuery({ modifiedCount: 1 }));
		modelMocks.usageUpdateMany.mockReturnValue(resultQuery({ modifiedCount: 1 }));
		modelMocks.usageFind.mockReturnValue(usageFindQuery([]));
		modelMocks.studentCountDocuments.mockImplementation(filter => resultQuery("lastLoginAt" in filter ? 3 : 12));
		modelMocks.projectAggregate.mockResolvedValue([
			{
				activeProjects: [{ count: 20 }],
				recentlyUpdatedProjects: [{ count: 4 }],
				studentsWithProjects: [{ count: 2 }],
				studentsWithRecentProjectUpdates: [{ count: 1 }]
			}
		]);
	});

	it("accepts only constrained anonymous events and stores no request identity", async () => {
		await withRuntime({}, async baseUrl => {
			const extra = await postUsage(baseUrl, {
				siteID: "cs",
				event: "course-open",
				courseId: "python-level-1",
				username: "student-one"
			});
			expect(extra.status).toBe(400);

			const unsupportedCourse = await postUsage(baseUrl, {
				siteID: "cs",
				event: "course-open",
				courseId: "python-level-3"
			});
			expect(unsupportedCourse.status).toBe(400);

			const missingCourse = await postUsage(baseUrl, {
				siteID: "cs",
				event: "course-open"
			});
			expect(missingCourse.status).toBe(400);

			const missingSite = await postUsage(baseUrl, {
				event: "ide-open"
			});
			expect(missingSite.status).toBe(400);

			const crossSiteCourse = await postUsage(
				baseUrl,
				{
					siteID: "math",
					event: "course-open",
					courseId: "python-level-1"
				},
				{
					Origin: "https://math.avasan.org"
				}
			);
			expect(crossSiteCourse.status).toBe(400);

			const response = await postUsage(
				baseUrl,
				{
					siteID: "cs",
					event: "course-open",
					courseId: "python-level-1"
				},
				{
					"User-Agent": "Highly identifying browser",
					"X-Forwarded-For": "203.0.113.42"
				}
			);
			expect(response.status).toBe(204);
			expect(response.headers.get("cache-control")).toBe("no-store");
		});

		expect(modelMocks.usageUpdateOne).toHaveBeenCalledTimes(1);
		const [filter, update, options] = modelMocks.usageUpdateOne.mock.calls[0];
		expect(filter).toMatchObject({
			$or: [{ siteID: "cs" }, { siteID: { $exists: false } }],
			courseID: "python-level-1",
			event: "course-open"
		});
		expect(filter.day).toBeInstanceOf(Date);
		expect(filter.day.toISOString()).toMatch(/T00:00:00\.000Z$/);
		expect(update).toMatchObject({
			$inc: { count: 1 },
			$set: {
				expiresAt: expect.any(Date)
			},
			$setOnInsert: {
				courseID: "python-level-1",
				event: "course-open",
				siteID: "cs"
			}
		});
		expect(options).toEqual({
			runValidators: true,
			setDefaultsOnInsert: false,
			upsert: true
		});
		expect(JSON.stringify([filter, update])).not.toMatch(
			/user|student|account|cookie|ip|agent|browser|referrer|password|code/i
		);
	});

	it("caps existing rows when retention is shortened", async () => {
		await enforceClassroomAnalyticsRetention(30);

		expect(modelMocks.usageUpdateMany).toHaveBeenCalledWith(
			{
				$or: [
					{ expiresAt: { $exists: false } },
					{
						$expr: {
							$gt: [
								"$expiresAt",
								{
									$dateAdd: {
										amount: 30,
										startDate: "$day",
										unit: "day"
									}
								}
							]
						}
					}
				]
			},
			[
				{
					$set: {
						expiresAt: {
							$dateAdd: {
								amount: 30,
								startDate: "$day",
								unit: "day"
							}
						}
					}
				}
			],
			{ updatePipeline: true }
		);
	});

	it("requires the same-origin classroom guard before accepting events", async () => {
		await withRuntime({}, async baseUrl => {
			const missingHeader = await fetch(`${baseUrl}/classroom-usage`, {
				body: JSON.stringify({ siteID: "cs", event: "ide-open" }),
				headers: { "content-type": "application/json" },
				method: "POST"
			});
			expect(missingHeader.status).toBe(403);

			const crossSite = await postUsage(
				baseUrl,
				{ siteID: "cs", event: "ide-open" },
				{ "Sec-Fetch-Site": "cross-site" }
			);
			expect(crossSite.status).toBe(403);

			const credentialed = await postUsage(
				baseUrl,
				{ siteID: "cs", event: "ide-open" },
				{ Cookie: "session=not-allowed" }
			);
			expect(credentialed.status).toBe(403);
		});

		expect(modelMocks.usageUpdateOne).not.toHaveBeenCalled();
	});

	it("accepts Math only through its credential-free fixed-origin proxy", async () => {
		await withRuntime({}, async baseUrl => {
			const missingOrigin = await postUsage(baseUrl, { siteID: "math", event: "graph-open" });
			expect(missingOrigin.status).toBe(403);

			const mismatchedSite = await postUsage(
				baseUrl,
				{ siteID: "cs", event: "ide-open" },
				{
					Origin: "https://math.avasan.org",
					"Sec-Fetch-Site": "same-origin"
				}
			);
			expect(mismatchedSite.status).toBe(403);

			const response = await postUsage(
				baseUrl,
				{ siteID: "math", event: "graph-open" },
				{
					Origin: "https://math.avasan.org",
					"Sec-Fetch-Site": "same-origin"
				}
			);
			expect(response.status).toBe(204);
		});

		expect(modelMocks.usageUpdateOne).toHaveBeenCalledTimes(1);
		const [filter, update] = modelMocks.usageUpdateOne.mock.calls[0];
		expect(filter).toMatchObject({
			courseID: { $exists: false },
			event: "graph-open",
			siteID: "math"
		});
		expect(update.$setOnInsert).toMatchObject({
			event: "graph-open",
			siteID: "math"
		});
		expect(JSON.stringify([filter, update])).not.toMatch(
			/user|student|account|cookie|ip|agent|browser|referrer|password|code/i
		);
	});

	it("fails closed until anonymous collection is explicitly enabled", async () => {
		await withRuntime({ collectionEnabled: false }, async baseUrl => {
			const response = await postUsage(baseUrl, {
				siteID: "cs",
				event: "course-open",
				courseId: "python-level-1"
			});
			expect(response.status).toBe(404);
		});

		expect(modelMocks.usageUpdateOne).not.toHaveBeenCalled();
	});

	it("keeps the companion summary route absent until its service key is configured", async () => {
		await withRuntime({}, async baseUrl => {
			const response = await fetch(`${baseUrl}/classroom-analytics/summary?days=7`, {
				headers: { "X-Classroom-Analytics-Key": "s".repeat(32) }
			});
			expect(response.status).toBe(404);
		});
	});

	it("serves the same exact aggregate to an authenticated companion", async () => {
		await withRuntime({
			collectionEnabled: false,
			retentionDays: null,
			serviceKey: "s".repeat(32)
		}, async baseUrl => {
			for (const headers of [
				{},
				{ "X-Classroom-Analytics-Key": "wrong".repeat(8) }
			]) {
				const denied = await fetch(
					`${baseUrl}/classroom-analytics/summary?days=7`,
					{ headers }
				);
				expect(denied.status).toBe(403);
				expect(denied.headers.get("cache-control")).toBe("no-store");
				expect(denied.headers.get("set-cookie")).toBeNull();
				await expect(denied.json()).resolves.toEqual({ message: "Forbidden" });
			}

			const response = await fetch(
				`${baseUrl}/classroom-analytics/summary?days=7`,
				{ headers: { "X-Classroom-Analytics-Key": "s".repeat(32) } }
			);
			const body = await response.json();
			expect(response.status).toBe(200);
			expect(response.headers.get("cache-control")).toBe("no-store");
			expect(response.headers.get("set-cookie")).toBeNull();
			expect(body.retentionDays).toBeNull();
			expect(body.siteActivity.cs.daily).toHaveLength(7);
			expect(body.siteActivity.math.daily).toHaveLength(7);
			expect(body.siteActivity.cs.totals).toEqual({
				courseOpens: 0,
				graphOpens: 0,
				ideOpens: 0
			});
			expect(body.siteActivity.math.totals).toEqual({
				courseOpens: 0,
				graphOpens: 0,
				ideOpens: 0
			});
			expect(body.studentWork).toEqual({
				accountsWithRecentSignIn: 3,
				activeAccounts: 12,
				activeProjects: 20,
				recentWindowDays: 7,
				recentlyUpdatedProjects: 4,
				studentsWithProjects: 2,
				studentsWithRecentProjectUpdates: 1
			});
			expect(Object.keys(body.studentWork).sort()).toEqual([
				"accountsWithRecentSignIn",
				"activeAccounts",
				"activeProjects",
				"recentWindowDays",
				"recentlyUpdatedProjects",
				"studentsWithProjects",
				"studentsWithRecentProjectUpdates"
			]);
		});

		expect(modelMocks.usageFind).toHaveBeenCalledTimes(1);
		expect(modelMocks.studentCountDocuments).toHaveBeenCalledTimes(2);
		expect(modelMocks.projectAggregate).toHaveBeenCalledTimes(1);
	});

	it("does not let wrong keys spend the authenticated service budget", async () => {
		const postServiceMiddleware = vi.fn<express.RequestHandler>(
			(_req, _res, next) => next()
		);
		await withRuntime({
			collectionEnabled: false,
			postServiceMiddleware,
			serviceKey: "s".repeat(32)
		}, async baseUrl => {
			for (let attempt = 0; attempt < 125; attempt += 1) {
				const denied = await fetch(
					`${baseUrl}/classroom-analytics/summary?days=7`,
					{ headers: { "X-Classroom-Analytics-Key": "wrong".repeat(8) } }
				);
				expect(denied.status).toBe(403);
			}

			expect(postServiceMiddleware).not.toHaveBeenCalled();
			expect(modelMocks.usageFind).not.toHaveBeenCalled();
			expect(modelMocks.studentCountDocuments).not.toHaveBeenCalled();
			expect(modelMocks.projectAggregate).not.toHaveBeenCalled();

			const allowed = await fetch(
				`${baseUrl}/classroom-analytics/summary?days=7`,
				{ headers: { "X-Classroom-Analytics-Key": "s".repeat(32) } }
			);
			expect(allowed.status).toBe(200);
			expect(allowed.headers.get("cache-control")).toBe("no-store");
			expect(postServiceMiddleware).not.toHaveBeenCalled();
		});

		expect(modelMocks.usageFind).toHaveBeenCalledTimes(1);
	});

	it("rejects browser credentials, bodies, methods, and extra query keys before aggregation", async () => {
		await withRuntime({ serviceKey: "s".repeat(32) }, async baseUrl => {
			const authenticatedHeaders = {
				"X-Classroom-Analytics-Key": "s".repeat(32)
			};
			for (const headers of [
				{ ...authenticatedHeaders, Authorization: "Bearer browser-token" },
				{ ...authenticatedHeaders, Cookie: "session=browser-session" }
			]) {
				const response = await fetch(
					`${baseUrl}/classroom-analytics/summary?days=7`,
					{ headers }
				);
				expect(response.status).toBe(400);
				await expect(response.json()).resolves.toEqual({ message: "Invalid request" });
			}

			const method = await fetch(
				`${baseUrl}/classroom-analytics/summary?days=7`,
				{
					body: "{}",
					headers: {
						...authenticatedHeaders,
						"Content-Type": "application/json"
					},
					method: "POST"
				}
			);
			expect(method.status).toBe(405);
			expect(method.headers.get("allow")).toBe("GET");
			expect(method.headers.get("cache-control")).toBe("no-store");

			const body = await getWithBody(
				`${baseUrl}/classroom-analytics/summary?days=7`,
				"{}"
			);
			expect(body.status).toBe(400);
			expect(JSON.parse(body.body)).toEqual({ message: "Invalid request" });

			const duplicateHeaders = new Headers();
			duplicateHeaders.append("X-Classroom-Analytics-Key", "s".repeat(32));
			duplicateHeaders.append("X-Classroom-Analytics-Key", "s".repeat(32));
			const duplicate = await fetch(
				`${baseUrl}/classroom-analytics/summary?days=7`,
				{ headers: duplicateHeaders }
			);
			expect(duplicate.status).toBe(403);
			await expect(duplicate.json()).resolves.toEqual({ message: "Forbidden" });

			const query = await fetch(
				`${baseUrl}/classroom-analytics/summary?days=7&student=one`,
				{ headers: authenticatedHeaders }
			);
			expect(query.status).toBe(400);
			await expect(query.json()).resolves.toEqual({
				message: "Only the days query is accepted."
			});
		});

		expect(modelMocks.usageFind).not.toHaveBeenCalled();
		expect(modelMocks.studentCountDocuments).not.toHaveBeenCalled();
		expect(modelMocks.projectAggregate).not.toHaveBeenCalled();
	});

	it("hides every non-canonical path and public-proxy Host before authentication", async () => {
		await withRuntime({ serviceKey: "s".repeat(32) }, async baseUrl => {
			const variants = [
				"/classroom-analytics/summary/?days=7",
				"/Classroom-Analytics/Summary?days=7",
				"/classroom-analytics%2Fsummary?days=7",
				"/classroom-analytics//summary?days=7"
			];
			for (const path of variants) {
				const response = await fetch(`${baseUrl}${path}`, {
					headers: { "X-Classroom-Analytics-Key": "s".repeat(32) }
				});
				expect(response.status, path).toBe(404);
				expect(response.headers.get("cache-control"), path).toBe("no-store");
				await expect(response.json(), path).resolves.toEqual({
					message: "Not found"
				});
			}

			const proxied = await getWithHost(
				`${baseUrl}/classroom-analytics/summary?days=7`,
				"cs.avasan.org"
			);
			expect(proxied.status).toBe(404);
			expect(proxied.cacheControl).toBe("no-store");
			expect(JSON.parse(proxied.body)).toEqual({ message: "Not found" });
		});

		expect(modelMocks.usageFind).not.toHaveBeenCalled();
		expect(modelMocks.studentCountDocuments).not.toHaveBeenCalled();
		expect(modelMocks.projectAggregate).not.toHaveBeenCalled();
	});

	it("refuses an enabled collection route without a retention period", () => {
		const app = express();
		expect(() => mountClassroomAnalyticsRoutes(app, {
			collectionEnabled: true,
			retentionDays: null
		})).toThrow("requires a configured retention period");
	});

	it("returns only zero-filled aggregate activity and coarse work counts", async () => {
		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);
		const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
		modelMocks.usageFind.mockReturnValue(
			usageFindQuery([
				{
					count: 5,
					courseID: "python-level-1",
					day: today,
					event: "course-open"
				},
				{
					count: 2,
					day: yesterday,
					event: "ide-open",
					siteID: "cs"
				},
				{
					count: 7,
					courseID: "algebra-1a",
					day: today,
					event: "course-open",
					siteID: "math"
				},
				{
					count: 4,
					day: yesterday,
					event: "graph-open",
					siteID: "math"
				}
			])
		);

		await withRuntime({ retentionDays: 45 }, async baseUrl => {
			const response = await fetch(`${baseUrl}/test-admin-summary?days=7`);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(response.headers.get("cache-control")).toBe("no-store");
			expect(body).toMatchObject({
				generatedAt: expect.any(String),
				period: {
					days: 7,
					startDate: expect.any(String),
					endDate: expect.any(String)
				},
				retentionDays: 45,
				siteActivity: {
					cs: {
						totals: {
							courseOpens: 5,
							ideOpens: 2,
							graphOpens: 0
						}
					},
					math: {
						totals: {
							courseOpens: 7,
							ideOpens: 0,
							graphOpens: 4
						}
					}
				},
				studentWork: {
					recentWindowDays: 7,
					activeAccounts: 12,
					accountsWithRecentSignIn: 3,
					studentsWithProjects: 2,
					studentsWithRecentProjectUpdates: 1,
					activeProjects: 20,
					recentlyUpdatedProjects: 4
				}
			});
			expect(body.siteActivity.cs.daily).toHaveLength(7);
			expect(body.siteActivity.math.daily).toHaveLength(7);
			expect(body.siteActivity.cs.daily.every((row: { graphOpens: number }) => row.graphOpens === 0)).toBe(true);
			expect(body.siteActivity.math.daily.every((row: { ideOpens: number }) => row.ideOpens === 0)).toBe(true);
			expect(body.siteActivity.cs.courses).toEqual([
				{ courseId: "scratch-level-1", label: "Scratch Level 1", opens: 0 },
				{ courseId: "scratch-level-2", label: "Scratch Level 2", opens: 0 },
				{
					courseId: "python-level-1",
					label: "Python Level 1: Classroom Edition",
					opens: 5
				},
				{
					courseId: "python-level-2",
					label: "Python Level 2: Classroom Edition",
					opens: 0
				},
				{
					courseId: "pygames",
					label: "PyGames: Classroom Edition",
					opens: 0
				}
			]);
			expect(body.siteActivity.math.courses.map((course: { courseId: string }) => course.courseId)).toEqual([
				"early-elementary-a-math",
				"early-elementary-b-math",
				"late-elementary-a-math",
				"late-elementary-b-math",
				"pre-algebra-a",
				"pre-algebra-b",
				"algebra-1a",
				"algebra-1b",
				"geometry-a",
				"geometry-b",
				"algebra-2a",
				"algebra-2b",
				"pre-calculus-a",
				"pre-calculus-b",
				"ap-calculus"
			]);
			expect(
				body.siteActivity.math.courses.find((course: { courseId: string }) => course.courseId === "algebra-1a")
					?.opens
			).toBe(7);
			expect(Object.keys(body.studentWork).sort()).toEqual([
				"accountsWithRecentSignIn",
				"activeAccounts",
				"activeProjects",
				"recentWindowDays",
				"recentlyUpdatedProjects",
				"studentsWithProjects",
				"studentsWithRecentProjectUpdates"
			]);
			expect(JSON.stringify(body)).not.toMatch(
				/username|studentID|projectID|projectName|source|files|password|accessCode/i
			);
			expect(modelMocks.usageFind).toHaveBeenCalledWith({
				day: {
					$gte: expect.any(Date),
					$lte: expect.any(Date)
				},
				expiresAt: { $gt: expect.any(Date) }
			});
			expect(modelMocks.studentCountDocuments).toHaveBeenNthCalledWith(1, {
				active: true,
				dataDeletionPendingAt: { $exists: false },
				retentionExpiresAt: { $gt: expect.any(Date) }
			});
			expect(modelMocks.studentCountDocuments).toHaveBeenNthCalledWith(2, {
				active: true,
				dataDeletionPendingAt: { $exists: false },
				lastLoginAt: { $gte: expect.any(Date) },
				retentionExpiresAt: { $gt: expect.any(Date) }
			});
			expect(modelMocks.projectAggregate).toHaveBeenCalledWith([
				{ $match: { deletedAt: { $exists: false } } },
				{ $project: { updatedAt: 1, user: 1 } },
				{
					$lookup: {
						as: "activeStudent",
						foreignField: "_id",
						from: "students",
						localField: "user",
						pipeline: [
							{
								$match: {
									active: true,
									dataDeletionPendingAt: { $exists: false },
									retentionExpiresAt: { $gt: expect.any(Date) }
								}
							},
							{ $project: { _id: 1 } }
						]
					}
				},
				{ $match: { "activeStudent.0": { $exists: true } } },
				{
					$facet: {
						activeProjects: [{ $count: "count" }],
						recentlyUpdatedProjects: [
							{ $match: { updatedAt: { $gte: expect.any(Date) } } },
							{ $count: "count" }
						],
						studentsWithProjects: [{ $group: { _id: "$user" } }, { $count: "count" }],
						studentsWithRecentProjectUpdates: [
							{ $match: { updatedAt: { $gte: expect.any(Date) } } },
							{ $group: { _id: "$user" } },
							{ $count: "count" }
						]
					}
				}
			]);
		});
	});

	it("rate-limits the teacher summary before repeated aggregate queries run", async () => {
		await withRuntime({ summaryLimit: 1 }, async baseUrl => {
			const first = await fetch(`${baseUrl}/test-admin-summary?days=7`);
			const limited = await fetch(`${baseUrl}/test-admin-summary?days=7`);

			expect(first.status).toBe(200);
			expect(limited.status).toBe(429);
			await expect(limited.json()).resolves.toEqual({
				message: "Too many classroom summary requests. Please try again shortly."
			});
		});

		expect(modelMocks.usageFind).toHaveBeenCalledTimes(1);
		expect(modelMocks.studentCountDocuments).toHaveBeenCalledTimes(2);
		expect(modelMocks.projectAggregate).toHaveBeenCalledTimes(1);
	});

	it("reports an unconfigured Admin retention period as null", async () => {
		await withRuntime({
			collectionEnabled: false,
			retentionDays: null
		}, async baseUrl => {
			const response = await fetch(`${baseUrl}/test-admin-summary?days=7`);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.retentionDays).toBeNull();
		});
	});

	it("bounds summary queries to 7 through 90 days", async () => {
		await withRuntime({}, async baseUrl => {
			for (const days of ["6", "91", "7.5", "thirty"]) {
				const response = await fetch(`${baseUrl}/test-admin-summary?days=${days}`);
				expect(response.status).toBe(400);
			}
		});

		expect(modelMocks.usageFind).not.toHaveBeenCalled();
	});
});
