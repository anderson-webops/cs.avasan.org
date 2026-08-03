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

	it("indexes explicit purge dates without granting MongoDB an out-of-band TTL writer", () => {
		const projectPurgeIndex = findIndex(
			PythonProject.schema.indexes(),
			{ purgeAt: 1 }
		);
		const reviewPurgeIndex = findIndex(
			PythonProjectReview.schema.indexes(),
			{ purgeAt: 1 }
		);

		expect(projectPurgeIndex?.[1]).not.toHaveProperty("expireAfterSeconds");
		expect(reviewPurgeIndex?.[1]).not.toHaveProperty("expireAfterSeconds");
		expect(findIndex(PythonProject.schema.indexes(), { deletedAt: 1 }))
			.toBeUndefined();
		expect(findIndex(PythonProjectReview.schema.indexes(), { deletedAt: 1 }))
			.toBeUndefined();
		expect(PythonProject.schema.options.autoIndex).toBe(false);
		expect(PythonProjectReview.schema.options.autoIndex).toBe(false);
	});

	it("reconciles tombstones and indexes before the service listens", () => {
		const serverSource = readFileSync(
			resolve(__dirname, "../src/server.ts"),
			"utf8"
		);
		const preparation = serverSource.indexOf(
			"await preparePythonProjectTombstoneLifecycle()"
		);
		const listen = serverSource.indexOf("app.listen(PORT, HOST");

		expect(preparation).toBeGreaterThan(
			serverSource.indexOf("await mongoose.connect(mongoUri)")
		);
		expect(listen).toBeGreaterThan(preparation);
		expect(serverSource).toContain(
			"startPythonProjectTombstoneReconciler()"
		);
	});
});
