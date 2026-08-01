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
const productionSmokeSource = readFileSync(
	resolve(repositoryRoot, "scripts/post-deploy-smoke.mjs"),
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

	it("redirects Python IDE aliases to the profiled directory route", () => {
		for (const aliasPattern of ["/python-ide", "/python-ide[.]html"]) {
			const nginxAlias = nginxSource.match(
				new RegExp(`location = ${aliasPattern} \\{([\\s\\S]*?)\\n\\t\\}`, "u")
			)?.[1];

			expect(nginxAlias?.trim()).toBe(
				"return 301 /python-ide/$is_args$args;"
			);
		}
		expect(netlifySource).toMatch(
			/\[\[redirects\]\]\nfrom = "\/python-ide"\nto = "\/python-ide\/"\nstatus = 301\nforce = true/u
		);
		expect(netlifySource).toMatch(
			/\[\[redirects\]\]\nfrom = "\/python-ide[.]html"\nto = "\/python-ide\/"\nstatus = 301\nforce = true/u
		);
	});

	it("keeps every former CS Graph Sketcher route explicitly retired", () => {
		for (const aliasPattern of ["/graph-sketcher", "/graph-sketcher[.]html"]) {
			const nginxAlias = nginxSource.match(
				new RegExp(`location = ${aliasPattern} \\{([\\s\\S]*?)\\n\\t\\}`, "u")
			)?.[1];
			expect(nginxAlias?.trim()).toBe("return 404;");
		}
		expect(nginxSource).toMatch(
			/location \^~ \/graph-sketcher\/ \{\n\t\treturn 404;\n\t\}/u
		);
		expect(nginxSource).toMatch(
			/location = \/licenses\/graphsketcher-omni-source-license[.]txt \{\n\t\treturn 404;\n\t\}/u
		);
		expect(nginxSource).toMatch(
			/location ~\* \^\/assets\/\[\^\/\]\*graph-\?sketcher\[\^\/\]\*\$ \{\n\t\treturn 404;\n\t\}/u
		);

		for (const aliasPattern of [
			"/graph-sketcher",
			"/graph-sketcher/",
			"/graph-sketcher/[*]",
			"/graph-sketcher[.]html"
		]) {
			expect(netlifySource).toMatch(
				new RegExp(
					`\\[\\[redirects\\]\\]\\nfrom = "${aliasPattern}"\\nto = "/graph-sketcher-unavailable"\\nstatus = 404\\nforce = true`,
					"u"
				)
			);
		}

		for (const retiredArtifact of [
			"/assets/GraphSketcherWorkspace-retired.js",
			"/assets/graphSketcherArchive.worker-retired.js",
			"/assets/graph-sketcher-retired.js",
			"/licenses/graphsketcher-omni-source-license.txt"
		]) {
			expect(productionSmokeSource).toContain(`"${retiredArtifact}"`);
		}
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
