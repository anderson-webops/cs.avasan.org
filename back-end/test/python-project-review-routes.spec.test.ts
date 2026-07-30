import type { Server } from "node:http";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN_SINGLETON_ID } from "../src/security/adminIdentity.js";

const modelMocks = vi.hoisted(() => ({
	adminFindById: vi.fn(),
	studentFindById: vi.fn(),
	pythonProjectFind: vi.fn(),
	pythonProjectFindOne: vi.fn(),
	pythonProjectReviewFind: vi.fn(),
	pythonProjectReviewFindOne: vi.fn(),
	pythonProjectReviewCreate: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: {
		findById: modelMocks.adminFindById
	}
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		findById: modelMocks.studentFindById
	}
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		find: modelMocks.pythonProjectFind,
		findOne: modelMocks.pythonProjectFindOne
	}
}));

vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		create: modelMocks.pythonProjectReviewCreate,
		find: modelMocks.pythonProjectReviewFind,
		findOne: modelMocks.pythonProjectReviewFindOne
	}
}));

const { mountRuntimeAccountRoutes } = await import("../src/routes/runtimeAccountRoutes.js");

const adminID = new Types.ObjectId(ADMIN_SINGLETON_ID);
const studentID = new Types.ObjectId();
const projectID = new Types.ObjectId();
const reviewID = new Types.ObjectId();
const now = new Date("2026-06-20T12:00:00.000Z");

function queryWith<T>(result: T) {
	const query = {
		select: vi.fn(() => query),
		sort: vi.fn(() => query),
		limit: vi.fn(() => query),
		exec: vi.fn().mockResolvedValue(result),
		then: (resolve: (value: T) => unknown, reject: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(resolve, reject),
		catch: (reject: (reason: unknown) => unknown) => Promise.resolve(result).catch(reject)
	};
	return query;
}

function makeStudent(overrides: Record<string, unknown> = {}) {
	return {
		_id: studentID,
		username: "student-one",
		active: true,
		sessionVersion: 3,
		failedLoginAttempts: 0,
		activeProjectCount: 1,
		activeProjectBytes: 25,
		createdAt: now,
		updatedAt: now,
		...overrides
	};
}

function makeProject(overrides: Record<string, unknown> = {}) {
	return {
		_id: projectID,
		user: studentID,
		title: "Loops practice",
		mode: "python",
		files: [
			{
				name: "main.py",
				content: "print('student')\n",
				encoding: "text"
			}
		],
		activeFileName: "main.py",
		byteCount: 25,
		courseID: "python-level-2",
		courseProjectKey: "python-level-2:loops:starter",
		courseProjectTitle: "Loops practice",
		createdAt: now,
		updatedAt: now,
		...overrides
	};
}

function makeReview(overrides: Record<string, unknown> = {}) {
	return {
		_id: reviewID,
		user: studentID,
		sourceProject: projectID,
		title: "Loops practice",
		mode: "python",
		files: [
			{
				name: "main.py",
				content: "# Try a for loop here.\nprint('review')\n",
				encoding: "text"
			}
		],
		activeFileName: "main.py",
		courseID: "python-level-2",
		courseProjectKey: "python-level-2:loops:starter",
		courseProjectTitle: "Loops practice",
		reviewer: adminID,
		reviewerRole: "admin",
		reviewerName: "Julio",
		lastEditedBy: adminID,
		lastEditedByRole: "admin",
		lastEditedByName: "Julio",
		visibleToStudent: false,
		note: "",
		sourceUpdatedAt: now,
		createdAt: now,
		updatedAt: now,
		save: vi.fn().mockResolvedValue(undefined),
		...overrides
	};
}

async function withRuntime<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json({ limit: "15mb" }));
	app.use((req: any, _res, next) => {
		const requestStudentID = req.get("x-session-student-id") || req.get("x-student-id") || undefined;
		req.session = {
			adminID: req.get("x-admin-id") || undefined,
			adminExpiresAt: req.get("x-admin-id") ? Date.now() + 8 * 60 * 60 * 1000 : undefined,
			adminLastActivityAt: req.get("x-admin-id") ? Date.now() : undefined,
			adminSessionVersion: req.get("x-admin-id") ? 0 : undefined,
			studentID: requestStudentID,
			studentExpiresAt: requestStudentID ? Date.now() + 8 * 60 * 60 * 1000 : undefined,
			studentSessionVersion: requestStudentID ? 3 : undefined,
			studentAuthLevel: requestStudentID ? "full" : undefined,
			studentLastActivityAt: requestStudentID ? Date.now() : undefined
		};
		next();
	});
	mountRuntimeAccountRoutes(app, {
		analyticsRetentionDays: 90,
		studentAccountsEnabled: true,
		studentOAuthEnabled: true
	});

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
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

function mutationHeaders(extra: Record<string, string> = {}) {
	return {
		"content-type": "application/json",
		"x-classroom-request": "1",
		...extra
	};
}

describe("student and Julio project routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		modelMocks.adminFindById.mockImplementation((id: string) =>
			id === ADMIN_SINGLETON_ID
				? queryWith({
						_id: adminID,
						name: "Julio",
						email: "julio@example.org",
						sessionVersion: 0
					})
				: queryWith(null)
		);
		modelMocks.studentFindById.mockReturnValue(queryWith(makeStudent()));
		modelMocks.pythonProjectFind.mockReturnValue(queryWith([makeProject()]));
		modelMocks.pythonProjectFindOne.mockResolvedValue(makeProject());
		modelMocks.pythonProjectReviewFind.mockReturnValue(queryWith([makeReview()]));
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(makeReview());
		modelMocks.pythonProjectReviewCreate.mockImplementation(async payload => makeReview(payload));
	});

	it("lets a full student session list only active owned projects", async () => {
		await withRuntime(async baseUrl => {
			const response = await fetch(`${baseUrl}/students/projects`, {
				headers: { "x-student-id": studentID.toString() }
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectFind).toHaveBeenCalledWith({
				deletedAt: { $exists: false },
				user: studentID
			});
			expect(body.projects).toHaveLength(1);
			expect(body.projects[0].files[0].content).toBe("print('student')\n");
		});
	});

	it("rejects a missing or mismatched explicit student context", async () => {
		await withRuntime(async baseUrl => {
			const missing = await fetch(`${baseUrl}/students/projects`, {
				headers: { "x-session-student-id": studentID.toString() }
			});
			const mismatch = await fetch(`${baseUrl}/students/projects`, {
				headers: {
					"x-session-student-id": studentID.toString(),
					"x-student-id": new Types.ObjectId().toString()
				}
			});

			expect(missing.status).toBe(409);
			expect(mismatch.status).toBe(409);
			expect(modelMocks.pythonProjectFind).not.toHaveBeenCalled();
		});
	});

	it("lets Julio list active student projects with review copies", async () => {
		await withRuntime(async baseUrl => {
			const response = await fetch(`${baseUrl}/admins/students/${studentID}/projects`, {
				headers: { "x-admin-id": ADMIN_SINGLETON_ID }
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectFind).toHaveBeenCalledWith({
				deletedAt: { $exists: false },
				user: studentID
			});
			expect(modelMocks.pythonProjectReviewFind).toHaveBeenCalledWith({
				deletedAt: { $exists: false },
				sourceProject: { $in: [projectID] },
				user: studentID
			});
			expect(body.projects[0].project.files[0].content).toBe("print('student')\n");
		});
	});

	it("blocks project review access while permanent deletion is pending", async () => {
		modelMocks.studentFindById.mockReturnValue(
			queryWith(
				makeStudent({
					active: false,
					dataDeletionPendingAt: new Date("2026-07-29T12:05:00.000Z")
				})
			)
		);

		await withRuntime(async baseUrl => {
			const response = await fetch(`${baseUrl}/admins/students/${studentID}/projects`, {
				headers: { "x-admin-id": ADMIN_SINGLETON_ID }
			});

			expect(response.status).toBe(409);
			expect(modelMocks.pythonProjectFind).not.toHaveBeenCalled();
			expect(modelMocks.pythonProjectReviewFind).not.toHaveBeenCalled();
		});
	});

	it("lets only Julio create a non-destructive review copy", async () => {
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(null);

		await withRuntime(async baseUrl => {
			const anonymous = await fetch(`${baseUrl}/admins/students/${studentID}/projects/${projectID}/review`, {
				method: "POST",
				headers: mutationHeaders(),
				body: "{}"
			});
			expect(anonymous.status).toBe(403);

			const response = await fetch(`${baseUrl}/admins/students/${studentID}/projects/${projectID}/review`, {
				method: "POST",
				headers: mutationHeaders({
					"x-admin-id": ADMIN_SINGLETON_ID
				}),
				body: "{}"
			});
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectReviewCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					user: studentID,
					sourceProject: projectID,
					reviewer: adminID,
					reviewerRole: "admin",
					visibleToStudent: false
				})
			);
			expect(body.project.files[0].content).toBe("print('student')\n");
		});
	});

	it("updates only Julio's review copy and its student visibility", async () => {
		const review = makeReview();
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(review);

		await withRuntime(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/admins/students/${studentID}/projects/${projectID}/review/${reviewID}`,
				{
					method: "PUT",
					headers: mutationHeaders({
						"x-admin-id": ADMIN_SINGLETON_ID
					}),
					body: JSON.stringify({
						files: [
							{
								name: "main.py",
								content: "# Nice decomposition.\nprint('reviewed')\n"
							}
						],
						activeFileName: "main.py",
						visibleToStudent: true,
						note: "Review this before class."
					})
				}
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(review.save).toHaveBeenCalledOnce();
			expect(body.project.files[0].content).toBe("print('student')\n");
			expect(body.review.files[0].content).toContain("Nice decomposition");
			expect(body.review.visibleToStudent).toBe(true);
		});
	});

	it("lists visible reviews only for non-deleted student projects", async () => {
		modelMocks.pythonProjectReviewFind.mockReturnValue(
			queryWith([
				makeReview({
					visibleToStudent: true,
					note: "Julio's comments are in the code."
				})
			])
		);

		await withRuntime(async baseUrl => {
			const response = await fetch(`${baseUrl}/students/project-reviews`, {
				headers: { "x-student-id": studentID.toString() }
			});
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectReviewFind).toHaveBeenCalledWith({
				deletedAt: { $exists: false },
				sourceProject: { $in: [projectID] },
				user: studentID,
				visibleToStudent: true
			});
			expect(body.reviews).toHaveLength(1);
		});
	});
});
