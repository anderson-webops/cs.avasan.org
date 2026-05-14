import type { Server } from "node:http";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminFindById: vi.fn(),
	tutorFindById: vi.fn(),
	userFindById: vi.fn(),
	scheduledSessionCreate: vi.fn(),
	scheduledSessionFind: vi.fn(),
	scheduledSessionFindOne: vi.fn(),
	sessionNoteCreate: vi.fn(),
	sessionNoteFind: vi.fn(),
	internalEmailFind: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: { findById: modelMocks.adminFindById }
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: { findById: modelMocks.tutorFindById }
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: { findById: modelMocks.userFindById }
}));

vi.mock("../src/models/schemas/ScheduledSession.js", () => ({
	ScheduledSession: {
		create: modelMocks.scheduledSessionCreate,
		find: modelMocks.scheduledSessionFind,
		findOne: modelMocks.scheduledSessionFindOne
	}
}));

vi.mock("../src/models/schemas/SessionNote.js", () => ({
	SessionNote: {
		create: modelMocks.sessionNoteCreate,
		find: modelMocks.sessionNoteFind
	}
}));

vi.mock("../src/models/schemas/InternalEmail.js", () => ({
	InternalEmail: { find: modelMocks.internalEmailFind }
}));

const { userRoutes } = await import("../src/routes/userRoutes.js");

const tutorID = new Types.ObjectId();
const otherTutorID = new Types.ObjectId();
const adminID = new Types.ObjectId();
const studentID = new Types.ObjectId();
const now = new Date("2026-05-12T18:00:00.000Z");

function queryWith<T>(result: T) {
	const query = {
		populate: vi.fn().mockResolvedValue(result),
		sort: vi.fn(() => query),
		limit: vi.fn(() => query),
		select: vi.fn(() => query),
		lean: vi.fn().mockResolvedValue(result),
		then: (resolve: (value: T) => unknown, reject: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(resolve, reject),
		catch: (reject: (reason: unknown) => unknown) => Promise.resolve(result).catch(reject)
	};
	return query;
}

function makeStudent(tutors: Types.ObjectId[] = [tutorID]) {
	return {
		_id: studentID,
		name: "Student One",
		email: "student@example.com",
		tutors
	};
}

function makeSession(overrides: Record<string, unknown> = {}) {
	return {
		_id: new Types.ObjectId(),
		user: studentID,
		tutor: tutorID,
		title: "Class session",
		startAt: now,
		endAt: new Date(now.getTime() + 60 * 60_000),
		timezone: "America/New_York",
		status: "scheduled",
		notes: undefined,
		sourceEmail: "student@example.com",
		externalEventId: undefined,
		recurrenceId: undefined,
		createdAt: now,
		updatedAt: now,
		...overrides
	};
}

function makeNote(overrides: Record<string, unknown> = {}) {
	return {
		_id: new Types.ObjectId(),
		studentName: "Student One",
		primaryEmail: "student@example.com",
		ccEmails: [],
		subject: "Session Notes (05/12)",
		sessionDate: new Date("2026-05-12T12:00:00.000Z"),
		markdown: "Worked on loops.",
		html: "<p>Worked on loops.</p>",
		createdAt: now,
		updatedAt: now,
		...overrides
	};
}

async function withUserRoutes<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json());
	app.use((req: any, _res, next) => {
		req.session = {
			adminID: req.get("x-admin-id") || undefined,
			tutorID: req.get("x-tutor-id") || undefined,
			userID: req.get("x-user-id") || undefined
		};
		next();
	});
	app.use("/users", userRoutes);

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

async function postJson(baseUrl: string, path: string, body: unknown, headers: Record<string, string> = {}) {
	return fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...headers
		},
		body: JSON.stringify(body)
	});
}

async function putJson(baseUrl: string, path: string, body: unknown, headers: Record<string, string> = {}) {
	return fetch(`${baseUrl}${path}`, {
		method: "PUT",
		headers: {
			"content-type": "application/json",
			...headers
		},
		body: JSON.stringify(body)
	});
}

describe("user schedule and note-only routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		modelMocks.adminFindById.mockImplementation((id: string) =>
			id === adminID.toString()
				? Promise.resolve({ _id: adminID, name: "Admin", email: "admin@example.com" })
				: Promise.resolve(null)
		);
		modelMocks.tutorFindById.mockImplementation((id: string) =>
			id === tutorID.toString()
				? Promise.resolve({ _id: tutorID, name: "Tutor", email: "tutor@example.com", coursePermissions: [] })
				: Promise.resolve(null)
		);
		modelMocks.userFindById.mockImplementation(() => queryWith(makeStudent()));
		modelMocks.scheduledSessionCreate.mockImplementation(async payload => makeSession(payload));
		modelMocks.scheduledSessionFind.mockReturnValue(queryWith([makeSession()]));
		modelMocks.scheduledSessionFindOne.mockResolvedValue(makeSession());
		modelMocks.sessionNoteCreate.mockImplementation(async payload => makeNote(payload));
		modelMocks.sessionNoteFind.mockReturnValue(queryWith([makeNote(), makeNote(), makeNote()]));
		modelMocks.internalEmailFind.mockReturnValue(queryWith([]));
	});

	it("lets an assigned tutor create a visible scheduled session for their student", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/schedule`,
				{
					title: "C++ lesson",
					startAt: "2026-05-12T18:00:00.000Z",
					endAt: "2026-05-12T19:00:00.000Z",
					timezone: "America/New_York"
				},
				{ "x-tutor-id": tutorID.toString() }
			);

			expect(response.status).toBe(201);
			const body = await response.json();
			expect(body.scheduledSession.title).toBe("C++ lesson");
			expect(body.scheduledSession.tutor).toBe(tutorID.toString());
			expect(modelMocks.scheduledSessionCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					user: studentID,
					tutor: tutorID,
					sourceEmail: "student@example.com"
				})
			);
		});
	});

	it("rejects unsupported no_show status before creating a scheduled session", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/schedule`,
				{
					startAt: "2026-05-12T18:00:00.000Z",
					endAt: "2026-05-12T19:00:00.000Z",
					status: "no_show"
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(response.status).toBe(400);
			await expect(response.json()).resolves.toEqual({
				message: "status must be scheduled, cancelled, completed, or rescheduled"
			});
			expect(modelMocks.scheduledSessionCreate).not.toHaveBeenCalled();
		});
	});

	it("blocks tutors from managing students not assigned to them", async () => {
		modelMocks.userFindById.mockImplementation(() => queryWith(makeStudent([otherTutorID])));

		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/schedule`,
				{
					startAt: "2026-05-12T18:00:00.000Z",
					endAt: "2026-05-12T19:00:00.000Z"
				},
				{ "x-tutor-id": tutorID.toString() }
			);

			expect(response.status).toBe(403);
			expect(modelMocks.scheduledSessionCreate).not.toHaveBeenCalled();
		});
	});

	it("saves note-only logs without trimming older notes from storage", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/session-notes`,
				{
					sessionDate: "2026-05-12",
					markdown: "Worked on recursion and traced two edge cases."
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(response.status).toBe(201);
			const body = await response.json();
			expect(body.sessionNote.subject).toBe("Session Notes (05/12)");
			expect(body.recentSessionNotes).toHaveLength(3);
			expect(modelMocks.sessionNoteCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					user: studentID,
					primaryEmail: "student@example.com",
					markdown: "Worked on recursion and traced two edge cases."
				})
			);
			expect("deleteMany" in modelMocks).toBe(false);
		});
	});

	it("stores course progress metadata for autosaved staff updates", async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const student = {
			...makeStudent(),
			courseAccess: ["javascript-level-1"],
			courseProgress: [],
			save
		};
		modelMocks.userFindById.mockImplementation(() => queryWith(student));

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "javascript-level-1",
					completedModuleIds: ["module-1"],
					completedItemIds: ["item-1"]
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(response.status).toBe(200);
			expect(save).toHaveBeenCalledOnce();
			expect(student.courseProgress[0]).toEqual(
				expect.objectContaining({
					completedItemIds: ["item-1"],
					completedModuleIds: ["module-1"],
					courseId: "javascript-level-1",
					updatedBy: adminID,
					updatedByRole: "admin"
				})
			);
			expect(student.courseProgress[0].updatedAt).toBeInstanceOf(Date);
		});
	});

	it("includes upcoming schedule items in the logged-in student's communications feed", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/loggedin/communications`, {
				headers: { "x-user-id": studentID.toString() }
			});

			expect(response.status).toBe(200);
			const body = await response.json();
			expect(body.scheduledSessions).toHaveLength(1);
			expect(body.scheduledSessions[0]).toEqual(
				expect.objectContaining({
					title: "Class session",
					status: "scheduled",
					sourceEmail: "student@example.com"
				})
			);
		});
	});
});
