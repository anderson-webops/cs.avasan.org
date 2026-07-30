import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import {
	STUDENT_DELETION_RECEIPT_RETENTION_DAYS,
	StudentDataDeletionReceipt
} from "../src/models/schemas/StudentDataDeletionReceipt.js";

describe("student data deletion receipt", () => {
	it("keeps a valid subject-linked receipt for a bounded period", async () => {
		const requestedAt = new Date("2026-07-29T12:00:00.000Z");
		const expiresAt = new Date(
			requestedAt.getTime() + STUDENT_DELETION_RECEIPT_RETENTION_DAYS * 24 * 60 * 60 * 1000
		);
		const receipt = new StudentDataDeletionReceipt({
			operationID: "47b3ce74-5bcc-4a04-8dd4-c362e5f43886",
			studentID: new Types.ObjectId(),
			username: "student-one",
			status: "in-progress",
			requestedAt,
			expiresAt
		});

		await expect(receipt.validate()).resolves.toBeUndefined();
		expect(STUDENT_DELETION_RECEIPT_RETENTION_DAYS).toBe(90);
		expect(receipt.expiresAt.getTime() - receipt.requestedAt.getTime()).toBe(90 * 24 * 60 * 60 * 1000);
	});

	it("declares an exact-expiry TTL index", () => {
		const ttlIndex = StudentDataDeletionReceipt.schema.indexes().find(([fields]) => fields.expiresAt === 1);

		expect(ttlIndex?.[1]).toMatchObject({ expireAfterSeconds: 0 });
	});
});
