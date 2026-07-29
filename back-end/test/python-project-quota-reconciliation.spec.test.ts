import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	aggregate: vi.fn(),
	toArray: vi.fn()
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		collection: { name: "pythonprojects" }
	}
}));

vi.mock("../src/models/schemas/Student.js", () => ({
	Student: {
		collection: {
			aggregate: modelMocks.aggregate,
			name: "students"
		}
	}
}));

const { reconcilePythonProjectQuotas } = await import(
	"../src/services/pythonProjectQuotaReconciliation.js"
);

describe("Python project quota reconciliation", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.toArray.mockResolvedValue([]);
		modelMocks.aggregate.mockReturnValue({ toArray: modelMocks.toArray });
	});

	it("idempotently merges exact active project counts and bytes for every student", async () => {
		await reconcilePythonProjectQuotas();
		await reconcilePythonProjectQuotas();

		expect(modelMocks.aggregate).toHaveBeenCalledTimes(2);
		expect(modelMocks.aggregate.mock.calls[0]?.[0]).toEqual(
			modelMocks.aggregate.mock.calls[1]?.[0]
		);
		const pipeline = modelMocks.aggregate.mock.calls[0]?.[0];
		expect(pipeline[0].$lookup.from).toBe("pythonprojects");
		expect(pipeline[0].$lookup.pipeline[0]).toEqual({
			$match: {
				deletedAt: { $exists: false },
				$expr: { $eq: ["$user", "$$studentID"] }
			}
		});
		expect(pipeline.at(-1)).toEqual({
			$merge: {
				into: "students",
				on: "_id",
				whenMatched: [
					{
						$set: {
							activeProjectBytes: "$$new.activeProjectBytes",
							activeProjectCount: "$$new.activeProjectCount"
						}
					}
				],
				whenNotMatched: "discard"
			}
		});
		expect(modelMocks.toArray).toHaveBeenCalledTimes(2);
	});

	it("runs reconciliation before the API begins listening", () => {
		const serverSource = readFileSync(resolve(__dirname, "../src/server.ts"), "utf8");
		expect(serverSource.indexOf("await reconcilePythonProjectQuotas()")).toBeGreaterThan(
			serverSource.indexOf("await mongoose.connect")
		);
		expect(serverSource.indexOf("await reconcilePythonProjectQuotas()")).toBeLessThan(
			serverSource.indexOf("app.listen")
		);
	});
});
