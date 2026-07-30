import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import {
	STUDENT_DELETION_RECEIPT_RETENTION_DAYS,
	StudentDataDeletionReceipt
} from "../src/models/schemas/StudentDataDeletionReceipt.js";

describe("student data deletion receipt", () => {
	it("keeps an unfinished subject-linked receipt outside TTL eligibility", async () => {
		const requestedAt = new Date("2026-07-29T12:00:00.000Z");
		const receipt = new StudentDataDeletionReceipt({
			operationID: "47b3ce74-5bcc-4a04-8dd4-c362e5f43886",
			studentID: new Types.ObjectId(),
			username: "student-one",
			status: "in-progress",
			requestedAt
		});

		await expect(receipt.validate()).resolves.toBeUndefined();
		expect(receipt.reason).toBe("julio-request");
		expect(receipt.expiresAt).toBeUndefined();
		expect(STUDENT_DELETION_RECEIPT_RETENTION_DAYS).toBe(90);
	});

	it("starts the bounded receipt period only when deletion completes", async () => {
		const completedAt = new Date("2026-07-30T12:00:00.000Z");
		const receipt = new StudentDataDeletionReceipt({
			completedAt,
			deletedRecords: {
				oauthAttempts: 1,
				projects: 2,
				reviews: 3,
				students: 1
			},
			expiresAt: new Date(
				completedAt.getTime()
				+ STUDENT_DELETION_RECEIPT_RETENTION_DAYS * 24 * 60 * 60 * 1000
			),
			operationID: "47b3ce74-5bcc-4a04-8dd4-c362e5f43886",
			reason: "retention-expiry",
			requestedAt: new Date("2026-03-01T12:00:00.000Z"),
			status: "completed",
			studentID: new Types.ObjectId(),
			username: "student-one"
		});

		await expect(receipt.validate()).resolves.toBeUndefined();
		expect(receipt.reason).toBe("retention-expiry");
		expect(receipt.expiresAt!.getTime() - completedAt.getTime()).toBe(
			90 * 24 * 60 * 60 * 1000
		);
	});

	it("stores the pre-delete inventory as internal retry metadata", async () => {
		const receipt = new StudentDataDeletionReceipt({
			operationID: "47b3ce74-5bcc-4a04-8dd4-c362e5f43886",
			reason: "retention-expiry",
			recordInventory: {
				oauthAttempts: 1,
				projects: 2,
				reviews: 3,
				students: 1
			},
			requestedAt: new Date("2026-07-30T12:00:00.000Z"),
			status: "in-progress",
			studentID: new Types.ObjectId(),
			username: "student-one"
		});

		await expect(receipt.validate()).resolves.toBeUndefined();
		expect(receipt.recordInventory?.projects).toBe(2);
		expect(StudentDataDeletionReceipt.schema.path("recordInventory").options.select).toBe(false);
		expect(receipt.deletedRecords).toBeUndefined();
	});

	it("rejects TTL metadata on an unfinished receipt", async () => {
		const receipt = new StudentDataDeletionReceipt({
			expiresAt: new Date("2026-10-28T12:00:00.000Z"),
			operationID: "47b3ce74-5bcc-4a04-8dd4-c362e5f43886",
			requestedAt: new Date("2026-07-30T12:00:00.000Z"),
			status: "needs-retry",
			studentID: new Types.ObjectId(),
			username: "student-one"
		});

		await expect(receipt.validate()).rejects.toThrow(
			"Unfinished deletion receipts cannot carry completion or TTL metadata."
		);
	});

	it("declares an exact-expiry TTL index", () => {
		const ttlIndex = StudentDataDeletionReceipt.schema.indexes().find(([fields]) => fields.expiresAt === 1);

		expect(ttlIndex?.[1]).toMatchObject({ expireAfterSeconds: 0 });
	});
});
