import { describe, expect, it } from "vitest";
import {
	parseExpectedBoolean,
	readSmokeJson
} from "../../scripts/post-deploy-smoke.mjs";

describe("production smoke feature expectations", () => {
	it("defaults omitted feature expectations to disabled", () => {
		expect(parseExpectedBoolean(undefined, "FEATURE")).toBe(false);
	});

	it("accepts explicit boolean strings without case or whitespace drift", () => {
		expect(parseExpectedBoolean(" true ", "FEATURE")).toBe(true);
		expect(parseExpectedBoolean("FALSE", "FEATURE")).toBe(false);
	});

	it("rejects ambiguous feature expectations", () => {
		expect(() => parseExpectedBoolean("1", "FEATURE")).toThrow(
			"FEATURE must be either true or false."
		);
	});

	it("does not copy a malformed response body into diagnostics", async () => {
		const response = {
			json: async () => {
				throw new Error("student-oauth-secret-value");
			}
		};

		const error = await readSmokeJson(
			response,
			"/api/students/oauth/providers"
		).catch((cause: unknown) => cause);

		expect(error).toBeInstanceOf(Error);
		expect(String(error)).toContain(
			"/api/students/oauth/providers returned invalid JSON."
		);
		expect(String(error)).not.toContain("student-oauth-secret-value");
	});
});
