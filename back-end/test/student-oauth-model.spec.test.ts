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
					message:
						"External sign-in provider and subject hash must be stored together."
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
		expect(
			Student.schema.path("externalAuthProvider").options.select
		).toBe(false);
		expect(
			Student.schema.path("externalAuthSubjectHash").options.select
		).toBe(false);
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
			externalAuthProvider: "google",
			externalAuthSubjectHash: "b".repeat(64)
		}).toJSON();

		expect(serialized).not.toHaveProperty("externalAuthProvider");
		expect(serialized).not.toHaveProperty("externalAuthSubjectHash");
	});
});
