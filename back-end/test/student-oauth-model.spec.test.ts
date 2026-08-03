import { describe, expect, it } from "vitest";
import { Student } from "../src/models/schemas/Student.js";

function studentDocument(overrides: Record<string, unknown> = {}) {
	return new Student({
		active: true,
		sessionVersion: 0,
		username: "student-one",
		...overrides
	});
}

describe("student external sign-in model", () => {
	it("requires the provider and subject hash to be stored together", async () => {
		await expect(
			studentDocument({
				externalAuthProvider: "google"
			}).validate()
		).rejects.toMatchObject({
			errors: {
				externalAuthProvider: {
					message: "External sign-in provider and subject hash must be stored together."
				}
			}
		});

		await expect(
			studentDocument({
				externalAuthProvider: "apple",
				externalAuthSubjectHash: "a".repeat(64)
			}).validate()
		).resolves.toBeUndefined();
	});

	it("keeps the provider binding private and unique across students", () => {
		expect(Student.schema.path("externalAuthProvider").options.select).toBe(false);
		expect(Student.schema.path("externalAuthSubjectHash").options.select).toBe(false);
		expect(Student.schema.indexes()).toContainEqual([
			{
				externalAuthProvider: 1,
				externalAuthSubjectHash: 1
			},
			expect.objectContaining({
				partialFilterExpression: {
					externalAuthProvider: { $type: "string" },
					externalAuthSubjectHash: { $type: "string" }
				},
				unique: true
			})
		]);
	});

	it("never serializes the provider or subject hash", () => {
		const serialized = studentDocument({
			dataDeletionPendingAt: new Date("2026-07-29T12:00:00.000Z"),
			externalAuthProvider: "google",
			externalAuthSubjectHash: "b".repeat(64)
		}).toJSON();

		expect(Student.schema.path("dataDeletionPendingAt").options.select).toBe(false);
		expect(serialized).not.toHaveProperty("dataDeletionPendingAt");
		expect(serialized).not.toHaveProperty("externalAuthProvider");
		expect(serialized).not.toHaveProperty("externalAuthSubjectHash");
	});

	it("keeps preservation state private with a fixed bounded event shape", async () => {
		const placedAt = new Date("2026-08-02T12:00:00.000Z");
		const student = studentDocument({
			recordPreservationEvents: [{ action: "placed", at: placedAt }],
			recordPreservationHoldActive: true,
			recordPreservationHoldPlacedAt: placedAt
		});
		await expect(student.validate()).resolves.toBeUndefined();

		for (const path of [
			"recordPreservationEvents",
			"recordPreservationHoldActive",
			"recordPreservationHoldPlacedAt",
			"recordPreservationHoldReleasedAt"
		]) {
			expect(Student.schema.path(path).options.select).toBe(false);
			expect(student.toJSON()).not.toHaveProperty(path);
		}
		expect(student.recordPreservationEvents).toMatchObject([
			{ action: "placed", at: placedAt }
		]);

		await expect(
			studentDocument({
				recordPreservationEvents: [
					{ action: "requested by parent", at: placedAt }
				]
			}).validate()
		).rejects.toMatchObject({
			errors: {
				"recordPreservationEvents.0.action": expect.any(Object)
			}
		});
	});
});
