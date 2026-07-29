import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	ClassroomUsageDaily
} from "../src/models/schemas/ClassroomUsageDaily.js";

function findIndex(
	fields: Record<string, number>
) {
	return ClassroomUsageDaily.schema.indexes().find(([definition]) =>
		JSON.stringify(definition) === JSON.stringify(fields)
	);
}

describe("anonymous classroom usage persistence", () => {
	it("contains only daily aggregate fields and rejects identity-shaped extras", () => {
		expect(Object.keys(ClassroomUsageDaily.schema.paths).sort()).toEqual([
			"_id",
			"count",
			"courseID",
			"day",
			"event",
			"expiresAt"
		]);
		expect(() => new ClassroomUsageDaily({
			count: 1,
			day: new Date("2026-07-29T00:00:00.000Z"),
			event: "course-open",
			expiresAt: new Date("2026-10-27T00:00:00.000Z"),
			studentID: "not-allowed"
		})).toThrow();
	});

	it("allows only the public catalog and the two coarse event types", async () => {
		const valid = new ClassroomUsageDaily({
			count: 1,
			courseID: "python-level-1",
			day: new Date("2026-07-29T00:00:00.000Z"),
			event: "ide-open",
			expiresAt: new Date("2026-10-27T00:00:00.000Z")
		});
		await expect(valid.validate()).resolves.toBeUndefined();

		const unsupportedCourse = new ClassroomUsageDaily({
			count: 1,
			courseID: "python-level-3",
			day: new Date("2026-07-29T00:00:00.000Z"),
			event: "course-open",
			expiresAt: new Date("2026-10-27T00:00:00.000Z")
		});
		await expect(unsupportedCourse.validate()).rejects.toThrow();

		const detailedEvent = new ClassroomUsageDaily({
			count: 1,
			day: new Date("2026-07-29T00:00:00.000Z"),
			event: "code-keystroke",
			expiresAt: new Date("2026-10-27T00:00:00.000Z")
		});
		await expect(detailedEvent.validate()).rejects.toThrow();
	});

	it("uniquely aggregates a UTC day and automatically expires the row", async () => {
		expect(findIndex({ day: 1, event: 1, courseID: 1 })?.[1])
			.toMatchObject({ unique: true });
		expect(findIndex({ expiresAt: 1 })?.[1])
			.toMatchObject({ expireAfterSeconds: 0 });

		const nonUtcDay = new ClassroomUsageDaily({
			count: 1,
			day: new Date("2026-07-29T12:00:00.000Z"),
			event: "course-open",
			expiresAt: new Date("2026-10-27T00:00:00.000Z")
		});
		await expect(nonUtcDay.validate()).rejects.toThrow("UTC midnight");
	});

	it("initializes the privacy aggregate indexes before serving requests", () => {
		const serverSource = readFileSync(
			resolve(__dirname, "../src/server.ts"),
			"utf8"
		);

		expect(serverSource).toContain("ClassroomUsageDaily.init()");
	});
});
