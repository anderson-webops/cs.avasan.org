import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { PythonProject } from "../src/models/schemas/PythonProject.js";
import { PythonProjectReview } from "../src/models/schemas/PythonProjectReview.js";

function findIndex(
	indexes: ReturnType<typeof PythonProject.schema.indexes>,
	fields: Record<string, number>
) {
	return indexes.find(([definition]) =>
		JSON.stringify(definition) === JSON.stringify(fields)
	);
}

describe("Python project persistence", () => {
	it("requires import IDs and uniquely indexes only string-valued legacy-compatible keys", () => {
		const importIDPath = PythonProject.schema.path("importID");
		const importIDIndex = findIndex(
			PythonProject.schema.indexes(),
			{ user: 1, importID: 1 }
		);

		expect(importIDPath.options.required).toBe(true);
		expect(importIDIndex?.[1]).toMatchObject({
			partialFilterExpression: {
				importID: { $type: "string" }
			},
			unique: true
		});
		expect(importIDIndex?.[1]).not.toHaveProperty("sparse");
	});

	it("bounds scrubbed project and review tombstones with short TTL indexes", () => {
		const projectTTL = findIndex(
			PythonProject.schema.indexes(),
			{ deletedAt: 1 }
		);
		const reviewTTL = findIndex(
			PythonProjectReview.schema.indexes(),
			{ deletedAt: 1 }
		);

		expect(projectTTL?.[1]).toMatchObject({ expireAfterSeconds: 60 * 60 });
		expect(reviewTTL?.[1]).toMatchObject({ expireAfterSeconds: 60 * 60 });
	});

	it("reconciles the former sparse project index during startup", () => {
		const serverSource = readFileSync(
			resolve(__dirname, "../src/server.ts"),
			"utf8"
		);

		expect(serverSource).toContain("PythonProject.syncIndexes()");
	});
});
