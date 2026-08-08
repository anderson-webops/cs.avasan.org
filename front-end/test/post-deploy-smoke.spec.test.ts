import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	parseExpectedAnalyticsRetentionDays,
	parseExpectedBoolean,
	readSmokeJson,
	validateClassroomAnalyticsHealth,
	validateContentSecurityPolicy,
	validateStudentPrivacyRetention,
	visibleTextFromHtml,
	verifyApiNotFound,
	verifyBrandedNotFound
} from "../../scripts/post-deploy-smoke.mjs";
import {
	nativePublicEnvironment,
	nativeReleaseManifest
} from "../../scripts/write-native-release-manifest.mjs";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const nginxSource = readFileSync(
	resolve(repositoryRoot, "deploy/nginx.conf"),
	"utf8"
);
const hostNginxSource = readFileSync(
	resolve(repositoryRoot, "deploy/host-nginx.conf.example"),
	"utf8"
);
const nativeNginxSource = readFileSync(
	resolve(repositoryRoot, "deploy/native/nginx.conf.example"),
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
const codeIdePolicy = requiredPolicy(
	nginxPolicies.find(policy => policy.includes("unsafe-eval")),
	"IDE"
);

describe("production smoke feature expectations", () => {
	it("builds a secret-free native public configuration", () => {
		const manifest = nativeReleaseManifest({
			CLASSROOM_PRIVACY_APPROVED: "false",
			CS_RELEASE_VERSION: "2.7.115",
			MONGODB_URI: "mongodb://secret-value",
			SESSION_SECRET: "secret-value",
			SOURCE_REVISION: "a".repeat(40),
			STUDENT_ACCOUNTS_ENABLED: "false"
		});
		const environment = nativePublicEnvironment(manifest);

		expect(environment).toContain('CLASSROOM_PRIVACY_APPROVED="false"');
		expect(environment).toContain('CLASSROOM_PRIVACY_POLICY_VERSION=""');
		expect(environment).toContain(
			'CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE=""'
		);
		expect(environment).toContain('STUDENT_ACCOUNTS_ENABLED="false"');
		expect(environment).toContain('CLASSROOM_ANALYTICS_RETENTION_DAYS=""');
		expect(environment).not.toContain("MONGODB_URI");
		expect(environment).not.toContain("SESSION_SECRET");
		expect(environment).not.toContain("secret-value");
		expect(() => nativePublicEnvironment({
			...manifest,
			buildConfig: { ...manifest.buildConfig, SCHOOL_PRIVACY_CONTACT: "line one\nline two" }
		})).toThrow("must stay on one line");
	});

	it("refuses native analytics collection without one explicit retention period", () => {
		const identity = {
			CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "true",
			CS_RELEASE_VERSION: "2.7.115",
			SOURCE_REVISION: "a".repeat(40)
		};
		expect(() => nativeReleaseManifest(identity)).toThrow(
			"CLASSROOM_ANALYTICS_RETENTION_DAYS is required"
		);
		for (const value of ["6", "07", "90.0", "9e1", "+45", "91"]) {
			expect(() => nativeReleaseManifest({
				...identity,
				CLASSROOM_ANALYTICS_RETENTION_DAYS: value
			})).toThrow("must be an integer from 7 to 90");
		}
		expect(nativeReleaseManifest({
			...identity,
			CLASSROOM_ANALYTICS_RETENTION_DAYS: "45"
		}).buildConfig.CLASSROOM_ANALYTICS_RETENTION_DAYS).toBe("45");
	});

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

	it("requires the exact analytics retention expectation when collection is enabled", () => {
		expect(parseExpectedAnalyticsRetentionDays(undefined, false)).toBeNull();
		expect(parseExpectedAnalyticsRetentionDays(" 45 ", true)).toBe(45);
		expect(() => parseExpectedAnalyticsRetentionDays(undefined, true)).toThrow(
			"is required when classroom analytics are expected to be enabled"
		);
		for (const value of ["6", "07", "90.0", "9e1", "+45", "91"]) {
			expect(() => parseExpectedAnalyticsRetentionDays(value, false)).toThrow(
				"must be an integer from 7 to 90"
			);
		}
	});

	it("compares the backend and Student Privacy with the exact retention expectation", () => {
		expect(validateClassroomAnalyticsHealth({
			classroomAnalytics: {
				collectionEnabled: true,
				retentionDays: 45
			},
			ok: true
		}, true, 45)).toBe(true);
		expect(() => validateClassroomAnalyticsHealth({
			classroomAnalytics: {
				collectionEnabled: true,
				retentionDays: 90
			},
			ok: true
		}, true, 45)).toThrow("exact analytics configuration");

		const configuredNotice = [
			"These are anonymous daily totals. They logically expire and are excluded from reports after 45 days.",
			"The row logically expires and is excluded after 45 days."
		].join(" ");
		expect(validateStudentPrivacyRetention(configuredNotice, 45)).toBe(true);
		expect(() => validateStudentPrivacyRetention(configuredNotice, 30)).toThrow(
			"exact configured analytics retention period"
		);
		const staleNotice = configuredNotice.replaceAll("45 days", "90 days");
		expect(() => validateStudentPrivacyRetention(
			`${configuredNotice} ${staleNotice}`,
			45
		)).toThrow("exact configured analytics retention period");
		const disabledNotice = [
			"Anonymous classroom counts remain disabled until the school or district approves a specific whole-number period from 7 through 90 days. No analytics retention default is assumed.",
			"Collection remains disabled until the school or district selects a specific whole-number period from 7 through 90 days. No analytics retention default is assumed."
		].join(" ");
		expect(validateStudentPrivacyRetention(disabledNotice, null)).toBe(true);
		expect(() => validateStudentPrivacyRetention(
			`${disabledNotice} ${configuredNotice}`,
			null
		)).toThrow("retention remains unconfigured");
	});

	it("extracts visible privacy text without script or style content", () => {
		expect(visibleTextFromHtml(`
			<main data-example=">">
				Visible <strong>privacy</strong> text.
				<script data-example="</script>">hidden <\" script claim</script >
				<script>hidden parser-error claim</script foo="bar">
				<script/>hidden self-closing claim</script>
				<STYLE data-example='>'>hidden style claim</STYLE\t>
				<!-- hidden comment claim -->
			</main>
		`)).toBe("Visible privacy text.");
	});

	it.each(["head", "template", "noscript"])(
		"does not accept a privacy disclosure rendered only inside <%s>",
		tag => {
			const hiddenDisclosure = [
				"These are anonymous daily totals. They logically expire and are excluded from reports after 45 days.",
				"The row logically expires and is excluded after 45 days."
			].join(" ");
			const visibleText = visibleTextFromHtml(`
				<html>
					<${tag}><p>${hiddenDisclosure}</p></${tag}>
					<body><main>Visible page text.</main></body>
				</html>
			`);

			expect(visibleText).toBe("Visible page text.");
			expect(() => validateStudentPrivacyRetention(visibleText, 45))
				.toThrow("exact configured analytics retention period");
		}
	);

	it.each([
		["template", "< /template>"],
		["template", "</ template>"],
		["script", "</ script>"]
	])(
		"keeps disclosure after malformed %s pseudo-close %s hidden",
		(tag, pseudoClose) => {
			const hiddenDisclosure = [
				"These are anonymous daily totals. They logically expire and are excluded from reports after 45 days.",
				"The row logically expires and is excluded after 45 days."
			].join(" ");
			const visibleText = visibleTextFromHtml(`
				<${tag}>
					hidden start ${pseudoClose} ${hiddenDisclosure}
				</${tag}>
				<main>Visible page text.</main>
			`);

			expect(visibleText).toBe("Visible page text.");
			expect(() => validateStudentPrivacyRetention(visibleText, 45))
				.toThrow("exact configured analytics retention period");
		}
	);

	it("rejects unterminated hidden HTML content", () => {
		for (const tag of ["head", "template", "noscript", "script", "style"]) {
			expect(() => visibleTextFromHtml(`<main>Visible<${tag}>hidden`))
				.toThrow("Student Privacy returned malformed HTML.");
		}
		expect(() => visibleTextFromHtml("<main>Visible<!-- hidden"))
			.toThrow("Student Privacy returned malformed HTML.");
	});

	it("accepts only the exact standard and IDE security policies", () => {
		expect(nginxPolicies).toHaveLength(6);
		expect(new Set(nginxPolicies).size).toBe(2);
		expect(netlifyPolicies).toHaveLength(3);
		expect(new Set(netlifyPolicies)).toEqual(new Set(nginxPolicies));
		expect(validateContentSecurityPolicy(standardPolicy, "standard")).toBe(true);
		expect(
			validateContentSecurityPolicy(codeIdePolicy, "code-ide")
		).toBe(true);
	});

	it("redirects IDE aliases to the primary profiled directory route", () => {
		for (const aliasPattern of ["/ide", "/ide[.]html"]) {
			const nginxAlias = nginxSource.match(
				new RegExp(`location = ${aliasPattern} \\{([\\s\\S]*?)\\n\\t\\}`, "u")
			)?.[1];

			expect(nginxAlias?.trim()).toBe("return 301 /ide/$is_args$args;");
		}
		for (const legacyAliasPattern of [
			"/python-ide",
			"/python-ide[.]html",
			"/python-ide/"
		]) {
			const nginxAlias = nginxSource.match(
				new RegExp(
					`location = ${legacyAliasPattern} \\{([\\s\\S]*?)\\n\\t\\}`,
					"u"
				)
			)?.[1];

			expect(nginxAlias?.trim()).toBe("return 301 /ide/$is_args$args;");
		}
		expect(nginxSource).toContain("location ^~ /python-ide/assets/");
		expect(nginxSource).toContain("map $args $bluej_redirect_args");
		expect(nginxSource).toContain("~(^|&)mode= $args;");
		expect(nginxSource).toContain(
			"return 301 /ide/?$bluej_redirect_args;"
		);
		expect(netlifySource).toMatch(
			/\[\[redirects\]\]\nfrom = "\/ide"\nto = "\/ide\/"\nstatus = 301\nforce = true/u
		);
		expect(netlifySource).toMatch(
			/\[\[redirects\]\]\nfrom = "\/python-ide"\nto = "\/ide\/"\nstatus = 301\nforce = true/u
		);
		expect(netlifySource).toMatch(
			/\[\[redirects\]\]\nfrom = "\/python-ide[.]html"\nto = "\/ide\/"\nstatus = 301\nforce = true/u
		);
		expect(netlifySource).toMatch(
			/\[\[redirects\]\]\nfrom = "\/python-ide\/"\nto = "\/ide\/"\nstatus = 301\nforce = true/u
		);
	});

	it("canonicalizes generated index documents and rejects raw route documents", () => {
		for (const source of [nginxSource, nativeNginxSource]) {
			expect(source).toContain("location ~ ^(.+)/index[.]html$");
			expect(source).toContain("return 301 $1/$is_args$args;");
			expect(source).toContain("location = /ide/index.html");
		}
		for (const legacyPath of [
			"/admin.html",
			"/course-resource.html",
			"/student-privacy.html",
			"/games.html",
			"/games/comet-hopper.html",
			"/games/crosswalk-critters.html",
			"/games/machine-workshop.html",
			"/games/pond-paddlers.html"
		]) {
			expect(productionSmokeSource).toContain(`"${legacyPath}"`);
		}
	});

	it("packages and serves a branded 404 without exposing it as a public page", async () => {
		expect(nginxSource).toContain("error_page 404 =404 /404.html;");
		expect(nginxSource).toMatch(
			/location = \/404[.]html \{\n\t\tinternal;\n\t\ttry_files \$uri =404;\n\t\}/u
		);
		expect(netlifySource).toMatch(
			/\[\[redirects\]\]\nfrom = "\/\*"\nto = "\/404[.]html"\nstatus = 404/u
		);
		expect(hostNginxSource).toContain("proxy_intercept_errors off;");
		expect(hostNginxSource).not.toMatch(/\n\s*(?:error_page|root|try_files)\b/u);

		await expect(
			verifyBrandedNotFound(
				new Response(
					'<main data-site-error-page="not-found"><h1>Page not found</h1><a>View courses</a></main>',
					{
							headers: {
							"Content-Security-Policy": standardPolicy,
							"Content-Type": "text/html; charset=utf-8",
							"Cross-Origin-Opener-Policy": "same-origin",
							"Cross-Origin-Resource-Policy": "same-origin",
							"Permissions-Policy": "camera=(), geolocation=(), microphone=()",
							"Referrer-Policy": "no-referrer",
							"Strict-Transport-Security": "max-age=31536000; includeSubDomains",
							"X-Content-Type-Options": "nosniff",
							"X-Frame-Options": "DENY"
						},
						status: 404
					}
				),
				"/login"
			)
		).resolves.toBeUndefined();
	});

	it("removes internal build metadata and blocks hidden paths at both edges", () => {
		const hiddenPathLocation = "location ~ (^|/)\\. {\n\t\treturn 404;\n\t}";

		expect(nginxSource).toContain(hiddenPathLocation);
		expect(nativeNginxSource).toContain(hiddenPathLocation);
		expect(nginxSource).toContain("location ^~ /api/");
		expect(nativeNginxSource).toContain("location ^~ /api/");
		expect(nativeNginxSource).toContain(
			"location ^~ /.well-known/acme-challenge/"
		);
		for (const hiddenPath of [
			"/.env",
			"/.git/config",
			"/.vite/ssr-manifest.json",
			"/api/.env"
		]) {
			expect(productionSmokeSource).toContain(`"${hiddenPath}"`);
		}
	});

	it("requires unknown API paths to return JSON and rejects duplicate headers", async () => {
		const response = (duplicateHeader: string[] = [standardPolicy]) => ({
			headers: {
				get: (name: string) => {
					const values: Record<string, string | null> = {
						"cache-control": "no-store",
						"content-security-policy": duplicateHeader.join(", "),
						"content-type": "application/json; charset=utf-8",
						"cross-origin-opener-policy": "same-origin",
						"cross-origin-resource-policy": "same-origin",
						"permissions-policy": "camera=(), geolocation=(), microphone=()",
						"referrer-policy": "no-referrer",
						"strict-transport-security": "max-age=31536000; includeSubDomains",
						"x-content-type-options": "nosniff",
						"x-frame-options": "DENY"
					};
					return values[name.toLowerCase()] ?? null;
				},
				getAll: (name: string) => name.toLowerCase() === "content-security-policy"
					? duplicateHeader
					: []
			},
			json: async () => ({ message: "Not found" }),
			status: 404
		});

		// Populate single-value arrays for every required non-CSP header.
		const valid = response();
		const originalGetAll = valid.headers.getAll;
		valid.headers.getAll = (name: string) => {
			const value = valid.headers.get(name);
			return name.toLowerCase() === "content-security-policy"
				? originalGetAll(name)
				: (value === null ? [] : [value]);
		};
		await expect(verifyApiNotFound(valid, "/api/missing"))
			.resolves.toBeUndefined();

		const duplicated = response([standardPolicy, standardPolicy]);
		await expect(verifyApiNotFound(duplicated, "/api/missing"))
			.rejects.toThrow("duplicate Content-Security-Policy");
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
					`\\[\\[redirects\\]\\]\\nfrom = "${aliasPattern}"\\nto = "/404[.]html"\\nstatus = 404\\nforce = true`,
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
