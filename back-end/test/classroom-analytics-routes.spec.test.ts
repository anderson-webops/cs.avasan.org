import type { Server } from "node:http";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	projectAggregate: vi.fn(),
	projectCountDocuments: vi.fn(),
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
		countDocuments: modelMocks.studentCountDocuments
	}
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		aggregate: modelMocks.projectAggregate,
		countDocuments: modelMocks.projectCountDocuments
	}
}));

const { enforceClassroomAnalyticsRetention, getClassroomAnalyticsSummary } =
	await import("../src/controllers/classroomAnalyticsController.js");
const { mountClassroomAnalyticsRoutes } = await import("../src/routes/classroomAnalyticsRoutes.js");

interface RuntimeOptions {
	collectionEnabled?: boolean;
	retentionDays?: number;
}

async function withRuntime<T>(options: RuntimeOptions, run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.set("trust proxy", false);
	app.use(express.json());
	mountClassroomAnalyticsRoutes(app, {
		collectionEnabled: options.collectionEnabled ?? true,
		retentionDays: options.retentionDays ?? 90
	});
	// Controller harness; production exposes this handler only inside the
	// validAdmin-protected /admins router.
	app.get("/test-admin-summary", getClassroomAnalyticsSummary(options.retentionDays ?? 90));

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

describe("privacy-preserving classroom analytics routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.usageUpdateOne.mockReturnValue(resultQuery({ modifiedCount: 1 }));
		modelMocks.usageUpdateMany.mockReturnValue(resultQuery({ modifiedCount: 1 }));
		modelMocks.usageFind.mockReturnValue(usageFindQuery([]));
		modelMocks.studentCountDocuments.mockImplementation(filter => resultQuery("lastLoginAt" in filter ? 3 : 12));
		modelMocks.projectCountDocuments.mockImplementation(filter => resultQuery("updatedAt" in filter ? 4 : 20));
		modelMocks.projectAggregate.mockImplementation(pipeline => {
			const filter = pipeline[0]?.$match ?? {};
			return Promise.resolve([{ count: "updatedAt" in filter ? 1 : 2 }]);
		});
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

	it("does not expose the retired service-key summary route", async () => {
		await withRuntime({}, async baseUrl => {
			const response = await fetch(`${baseUrl}/classroom-analytics/summary`);
			expect(response.status).toBe(404);
		});
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
