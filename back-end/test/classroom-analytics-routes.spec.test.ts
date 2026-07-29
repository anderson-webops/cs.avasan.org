import type { Server } from "node:http";
import express from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	projectAggregate: vi.fn(),
	projectCountDocuments: vi.fn(),
	studentCountDocuments: vi.fn(),
	usageFind: vi.fn(),
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

const { mountClassroomAnalyticsRoutes } = await import("../src/routes/classroomAnalyticsRoutes.js");

const serviceKey = "a".repeat(32);

interface RuntimeOptions {
	collectionEnabled?: boolean;
	retentionDays?: number;
	serviceKey?: string;
}

async function withRuntime<T>(options: RuntimeOptions, run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.set("trust proxy", false);
	app.use(express.json());
	mountClassroomAnalyticsRoutes(app, {
		collectionEnabled: options.collectionEnabled ?? true,
		retentionDays: options.retentionDays ?? 90,
		serviceKey: options.serviceKey
	});

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
		modelMocks.usageFind.mockReturnValue(usageFindQuery([]));
		modelMocks.studentCountDocuments.mockImplementation(filter => resultQuery("lastLoginAt" in filter ? 3 : 12));
		modelMocks.projectCountDocuments.mockImplementation(filter => resultQuery("updatedAt" in filter ? 4 : 20));
		modelMocks.projectAggregate.mockImplementation(pipeline => {
			const filter = pipeline[0]?.$match ?? {};
			return Promise.resolve([{ count: "updatedAt" in filter ? 1 : 2 }]);
		});
	});

	it("accepts only constrained anonymous events and stores no request identity", async () => {
		await withRuntime({ serviceKey }, async baseUrl => {
			const extra = await postUsage(baseUrl, {
				event: "course-open",
				courseId: "python-level-1",
				username: "student-one"
			});
			expect(extra.status).toBe(400);

			const unsupportedCourse = await postUsage(baseUrl, {
				event: "course-open",
				courseId: "python-level-3"
			});
			expect(unsupportedCourse.status).toBe(400);

			const missingCourse = await postUsage(baseUrl, {
				event: "course-open"
			});
			expect(missingCourse.status).toBe(400);

			const response = await postUsage(
				baseUrl,
				{
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
			courseID: "python-level-1",
			event: "course-open"
		});
		expect(filter.day).toBeInstanceOf(Date);
		expect(filter.day.toISOString()).toMatch(/T00:00:00\.000Z$/);
		expect(update).toMatchObject({
			$inc: { count: 1 },
			$setOnInsert: {
				courseID: "python-level-1",
				event: "course-open",
				expiresAt: expect.any(Date)
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

	it("requires the same-origin classroom guard before accepting events", async () => {
		await withRuntime({ serviceKey }, async baseUrl => {
			const missingHeader = await fetch(`${baseUrl}/classroom-usage`, {
				body: JSON.stringify({ event: "ide-open" }),
				headers: { "content-type": "application/json" },
				method: "POST"
			});
			expect(missingHeader.status).toBe(403);

			const crossSite = await postUsage(baseUrl, { event: "ide-open" }, { "Sec-Fetch-Site": "cross-site" });
			expect(crossSite.status).toBe(403);
		});

		expect(modelMocks.usageUpdateOne).not.toHaveBeenCalled();
	});

	it("fails closed until anonymous collection is explicitly enabled", async () => {
		await withRuntime({ collectionEnabled: false, serviceKey }, async baseUrl => {
			const response = await postUsage(baseUrl, {
				event: "course-open",
				courseId: "python-level-1"
			});
			expect(response.status).toBe(404);
		});

		expect(modelMocks.usageUpdateOne).not.toHaveBeenCalled();
	});

	it("authenticates the coarse summary with the dedicated service key", async () => {
		await withRuntime({}, async baseUrl => {
			const disabled = await fetch(`${baseUrl}/classroom-analytics/summary`);
			expect(disabled.status).toBe(503);
			expect(disabled.headers.get("cache-control")).toBe("no-store");
		});

		await withRuntime({ serviceKey }, async baseUrl => {
			const missing = await fetch(`${baseUrl}/classroom-analytics/summary`);
			expect(missing.status).toBe(401);

			const wrong = await fetch(`${baseUrl}/classroom-analytics/summary`, {
				headers: { "X-Classroom-Analytics-Key": "b".repeat(32) }
			});
			expect(wrong.status).toBe(401);

			const allowed = await fetch(`${baseUrl}/classroom-analytics/summary`, {
				headers: { "X-Classroom-Analytics-Key": serviceKey }
			});
			expect(allowed.status).toBe(200);
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
					event: "ide-open"
				}
			])
		);

		await withRuntime({ retentionDays: 45, serviceKey }, async baseUrl => {
			const response = await fetch(`${baseUrl}/classroom-analytics/summary?days=7`, {
				headers: { "X-Classroom-Analytics-Key": serviceKey }
			});
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
					totals: { courseOpens: 5, ideOpens: 2 }
				},
				studentWork: {
					recentWindowDays: 7,
					activeAccounts: 12,
					recentSignIns: 3,
					studentsWithProjects: 2,
					studentsWithRecentProjectUpdates: 1,
					activeProjects: 20,
					recentlyUpdatedProjects: 4
				}
			});
			expect(body.siteActivity.daily).toHaveLength(7);
			expect(body.siteActivity.courses).toEqual([
				{ courseId: "scratch-level-1", label: "Scratch Level 1", opens: 0 },
				{ courseId: "scratch-level-2", label: "Scratch Level 2", opens: 0 },
				{ courseId: "python-level-1", label: "Python Level 1", opens: 5 },
				{ courseId: "python-level-2", label: "Python Level 2", opens: 0 },
				{ courseId: "pygames", label: "PyGames", opens: 0 }
			]);
			expect(Object.keys(body.studentWork).sort()).toEqual([
				"activeAccounts",
				"activeProjects",
				"recentSignIns",
				"recentWindowDays",
				"recentlyUpdatedProjects",
				"studentsWithProjects",
				"studentsWithRecentProjectUpdates"
			]);
			expect(JSON.stringify(body)).not.toMatch(
				/username|studentID|projectID|projectName|source|files|password|accessCode/i
			);
		});
	});

	it("bounds summary queries to 7 through 90 days", async () => {
		await withRuntime({ serviceKey }, async baseUrl => {
			for (const days of ["6", "91", "7.5", "thirty"]) {
				const response = await fetch(`${baseUrl}/classroom-analytics/summary?days=${days}`, {
					headers: { "X-Classroom-Analytics-Key": serviceKey }
				});
				expect(response.status).toBe(400);
			}
		});

		expect(modelMocks.usageFind).not.toHaveBeenCalled();
	});
});
