import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	parseExpectedBoolean,
	readSmokeJson,
	validateContentSecurityPolicy
} from "../../scripts/post-deploy-smoke.mjs";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const nginxSource = readFileSync(
	resolve(repositoryRoot, "deploy/nginx.conf"),
	"utf8"
);
const netlifySource = readFileSync(
	resolve(repositoryRoot, "netlify.toml"),
	"utf8"
);
const nginxPolicies = [
	...nginxSource.matchAll(/add_header Content-Security-Policy "([^"]+)"/gu)
].map(match => match[1]);
const netlifyPolicies = [
	...netlifySource.matchAll(/Content-Security-Policy = "([^"]+)"/gu)
].map(match => match[1]);

function requiredPolicy(policy: string | undefined, profile: string) {
	if (!policy) throw new Error(`Missing ${profile} policy fixture.`);
	return policy;
}

const standardPolicy = requiredPolicy(
	nginxPolicies.find(policy => !policy.includes("unsafe-eval")),
	"standard"
);
const pythonIdePolicy = requiredPolicy(
	nginxPolicies.find(policy => policy.includes("unsafe-eval")),
	"Python IDE"
);

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

	it("accepts only the exact standard and Python IDE security policies", () => {
		expect(nginxPolicies).toHaveLength(4);
		expect(new Set(nginxPolicies).size).toBe(2);
		expect(netlifyPolicies).toHaveLength(2);
		expect(new Set(netlifyPolicies)).toEqual(new Set(nginxPolicies));
		expect(validateContentSecurityPolicy(standardPolicy, "standard")).toBe(true);
		expect(
			validateContentSecurityPolicy(pythonIdePolicy, "python-ide")
		).toBe(true);
	});

	it("rejects the former globally permissive security policy", () => {
		const broadPolicy = standardPolicy.replace(
			"script-src 'self' 'unsafe-inline'",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https:"
		);

		expect(() =>
			validateContentSecurityPolicy(broadPolicy, "standard")
		).toThrow("unexpected script-src sources");
	});

	it("rejects missing, duplicate, or unknown policy profiles", () => {
		expect(() => validateContentSecurityPolicy("", "standard")).toThrow(
			"missing Content-Security-Policy"
		);
		expect(() =>
			validateContentSecurityPolicy(
				`${standardPolicy}; script-src 'self'`,
				"standard"
			)
		).toThrow("repeats script-src");
		expect(() => validateContentSecurityPolicy(standardPolicy, "other"))
			.toThrow("Unknown Content-Security-Policy profile");
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
