import type { Server } from "node:http";
import type { RequestHandler } from "express";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	studentExists: vi.fn()
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		exists: modelMocks.studentExists
	}
}));

const {
	acquireStudentRecordMutationLease,
	holdStudentRecordMutationsAndWait,
	releaseStudentRecordMutationHold,
	resetStudentRecordMutationBarriersForTests,
	withStudentRecordMutationLease
} = await import("../src/security/studentRecordMutationBarrier.js");

function queryWith<T>(value: T) {
	return {
		then: (
			resolve: (result: T) => unknown,
			reject: (reason: unknown) => unknown
		) => Promise.resolve(value).then(resolve, reject)
	};
}

async function withMutationRoute(
	studentID: string,
	run: (baseUrl: string) => Promise<void>,
	handler: RequestHandler = (_req, res) => res.sendStatus(204)
) {
	const app = express();
	app.post(
		"/students/:studentID/change",
		withStudentRecordMutationLease(handler)
	);
	const server = await new Promise<Server>((resolve) => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to IPv4.");
	}
	try {
		await run(`http://127.0.0.1:${address.port}/students/${studentID}`);
	}
	finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => error ? reject(error) : resolve());
		});
	}
}

describe("student record mutation preservation barrier", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetStudentRecordMutationBarriersForTests();
		modelMocks.studentExists.mockReturnValue(queryWith(null));
	});

	it("waits for an earlier mutation before making the record read-only", async () => {
		const studentID = new Types.ObjectId().toString();
		const release = acquireStudentRecordMutationLease(studentID);
		expect(release).toBeTypeOf("function");

		let holdFinished = false;
		const hold = holdStudentRecordMutationsAndWait(studentID).then(() => {
			holdFinished = true;
		});
		await Promise.resolve();
		expect(holdFinished).toBe(false);
		expect(acquireStudentRecordMutationLease(studentID)).toBeNull();

		release?.();
		await hold;
		expect(holdFinished).toBe(true);
		expect(acquireStudentRecordMutationLease(studentID)).toBeNull();

		releaseStudentRecordMutationHold(studentID);
		const afterRelease = acquireStudentRecordMutationLease(studentID);
		expect(afterRelease).toBeTypeOf("function");
		afterRelease?.();
	});

	it("restores a durable hold after restart and fails closed on lookup errors", async () => {
		const studentID = new Types.ObjectId().toString();
		modelMocks.studentExists.mockReturnValueOnce(queryWith({ _id: studentID }));

		await withMutationRoute(studentID, async baseUrl => {
			const held = await fetch(`${baseUrl}/change`, { method: "POST" });
			expect(held.status).toBe(409);
			await expect(held.json()).resolves.toMatchObject({
				message: expect.stringContaining("temporarily read-only")
			});
		});

		resetStudentRecordMutationBarriersForTests();
		modelMocks.studentExists.mockImplementationOnce(() => {
			throw new Error("database unavailable");
		});
		await withMutationRoute(studentID, async baseUrl => {
			const unavailable = await fetch(`${baseUrl}/change`, {
				method: "POST"
			});
			expect(unavailable.status).toBe(503);
		});
	});

	it("keeps an aborted request leased until its async mutation settles", async () => {
		const studentID = new Types.ObjectId().toString();
		let markClosed!: () => void;
		let markStarted!: () => void;
		let releaseMutation!: () => void;
		const closed = new Promise<void>(resolve => {
			markClosed = resolve;
		});
		const started = new Promise<void>(resolve => {
			markStarted = resolve;
		});
		const mutation = new Promise<void>(resolve => {
			releaseMutation = resolve;
		});

		await withMutationRoute(
			studentID,
			async baseUrl => {
				const abortController = new AbortController();
				const abortedRequest = fetch(`${baseUrl}/change`, {
					method: "POST",
					signal: abortController.signal
				}).catch(error => error);
				await started;
				abortController.abort();
				await abortedRequest;
				await closed;

				let holdFinished = false;
				const hold = holdStudentRecordMutationsAndWait(studentID).then(() => {
					holdFinished = true;
				});
				await Promise.resolve();
				expect(holdFinished).toBe(false);
				expect(acquireStudentRecordMutationLease(studentID)).toBeNull();

				releaseMutation();
				await hold;
				expect(holdFinished).toBe(true);
				releaseStudentRecordMutationHold(studentID);
			},
			async (_req, res) => {
				res.once("close", markClosed);
				markStarted();
				await mutation;
				res.sendStatus(204);
			}
		);
	});
});
