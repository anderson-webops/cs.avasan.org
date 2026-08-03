import type { Server } from "node:http";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	resumePythonProjectTombstonePurge: vi.fn(),
	studentExists: vi.fn(),
	studentFindById: vi.fn(),
	studentFindOneAndUpdate: vi.fn(),
	suspendPythonProjectTombstonePurge: vi.fn()
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		exists: modelMocks.studentExists,
		findById: modelMocks.studentFindById,
		findOneAndUpdate: modelMocks.studentFindOneAndUpdate
	}
}));

vi.mock("../src/services/pythonProjectTombstoneLifecycle.js", () => ({
	resumePythonProjectTombstonePurge:
		modelMocks.resumePythonProjectTombstonePurge,
	suspendPythonProjectTombstonePurge:
		modelMocks.suspendPythonProjectTombstonePurge
}));

const { setStudentRecordPreservation } = await import(
	"../src/controllers/students/studentRecordPreservationController.js"
);
const { resetStudentRecordMutationBarriersForTests } = await import(
	"../src/security/studentRecordMutationBarrier.js"
);
const { resetStudentDataWriteBarriersForTests } = await import(
	"../src/security/studentDataWriteBarrier.js"
);

function queryWith<T>(value: T) {
	const query = {
		select: vi.fn(() => query),
		then: (
			resolve: (result: T) => unknown,
			reject: (reason: unknown) => unknown
		) => Promise.resolve(value).then(resolve, reject)
	};
	return query;
}

async function withRoute(run: (baseUrl: string) => Promise<void>) {
	const app = express();
	app.use(express.json());
	app.use((req, _res, next) => {
		req.currentAdmin = {
			comparePassword: vi.fn(
				async value => value === "teacher-passphrase"
			)
		} as any;
		next();
	});
	app.put("/students/:studentID/record-preservation", setStudentRecordPreservation);
	const server = await new Promise<Server>((resolve) => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to IPv4.");
	}
	try {
		await run(`http://127.0.0.1:${address.port}`);
	}
	finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => error ? reject(error) : resolve());
		});
	}
}

describe("student record preservation Admin route", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetStudentDataWriteBarriersForTests();
		resetStudentRecordMutationBarriersForTests();
		modelMocks.studentExists.mockReturnValue(queryWith(null));
		modelMocks.resumePythonProjectTombstonePurge.mockResolvedValue(undefined);
		modelMocks.suspendPythonProjectTombstonePurge.mockResolvedValue(undefined);
	});

	it("keeps Julio's Admin session and verification limiter before the controller", () => {
		const source = readFileSync(
			resolve(__dirname, "../src/routes/adminRoutes.ts"),
			"utf8"
		).replace(/\s+/gu, " ");

		expect(source).toContain(
			'configuredRouter.put( "/students/:studentID/record-preservation", validAdmin, teacherVerificationLimiter, setStudentRecordPreservation )'
		);
	});

	it("requires Julio's password and accepts no requester or notes fields", async () => {
		const studentID = new Types.ObjectId().toString();
		await withRoute(async baseUrl => {
			const wrongPassword = await fetch(
				`${baseUrl}/students/${studentID}/record-preservation`,
				{
					body: JSON.stringify({
						active: true,
						teacherPassword: "wrong"
					}),
					headers: { "content-type": "application/json" },
					method: "PUT"
				}
			);
			expect(wrongPassword.status).toBe(403);

			const freeText = await fetch(
				`${baseUrl}/students/${studentID}/record-preservation`,
				{
					body: JSON.stringify({
						active: true,
						notes: "parent requested this",
						teacherPassword: "teacher-passphrase"
					}),
					headers: { "content-type": "application/json" },
					method: "PUT"
				}
			);
			expect(freeText.status).toBe(400);
			expect(modelMocks.studentFindOneAndUpdate).not.toHaveBeenCalled();
		});
	});

	it("preserves a fixed-purpose bounded state after a partial deletion", async () => {
		const studentID = new Types.ObjectId().toString();
		const placedAt = new Date("2026-08-02T12:00:00.000Z");
		modelMocks.studentFindOneAndUpdate.mockReturnValue(
			queryWith({
				_id: new Types.ObjectId(studentID),
				active: true,
				createdAt: placedAt,
				dataDeletionPendingAt: new Date("2026-08-02T11:00:00.000Z"),
				failedLoginAttempts: 0,
				recordPreservationEvents: [{ action: "placed", at: placedAt }],
				recordPreservationHoldActive: true,
				recordPreservationHoldPlacedAt: placedAt,
				sessionVersion: 1,
				updatedAt: placedAt,
				username: "river-7"
			})
		);

		await withRoute(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/students/${studentID}/record-preservation`,
				{
					body: JSON.stringify({
						active: true,
						teacherPassword: "teacher-passphrase"
					}),
					headers: { "content-type": "application/json" },
					method: "PUT"
				}
			);
			expect(response.status).toBe(200);
			await expect(response.json()).resolves.toEqual({
				recordPreservation: {
					active: true,
					events: [
						{ action: "placed", at: placedAt.toISOString() }
					],
					placedAt: placedAt.toISOString(),
					purpose: "ferpa-inspection-review",
					releasedAt: null
				}
			});
		});
	});
});
