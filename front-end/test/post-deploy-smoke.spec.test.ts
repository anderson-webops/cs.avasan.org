import { describe, expect, it } from "vitest";
import { parseExpectedBoolean } from "../../scripts/post-deploy-smoke.mjs";

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
});
