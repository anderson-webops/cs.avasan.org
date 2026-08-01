import process from "node:process";
import { pathToFileURL } from "node:url";
import { smokeRequest } from "./http-smoke-client.mjs";

const productionOrigin = process.env.CS_SITE_ORIGIN || "https://cs.avasan.org";
const expectedRelease = process.env.CS_EXPECTED_RELEASE?.replace(/^v/, "");
const expectedRevision = process.env.CS_EXPECTED_REVISION;
const timeoutMs = Number(process.env.CS_SITE_SMOKE_TIMEOUT_MS || 15_000);
const releaseVersionPattern
	= /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9a-z.-]+)?$/i;
const sourceRevisionPattern = /^[0-9a-f]{40}$/;
let currentSmokePhase = "initialization";
const securityHeaders = Object.freeze({
	"permissions-policy": "camera=(), geolocation=(), microphone=()",
	"referrer-policy": "no-referrer",
	"strict-transport-security": "max-age=31536000; includeSubDomains",
	"x-content-type-options": "nosniff",
	"x-frame-options": "DENY"
});
const standardContentSecurityPolicy = Object.freeze({
	"base-uri": ["'self'"],
	"connect-src": ["'self'"],
	"default-src": ["'self'"],
	"font-src": ["'self'", "data:"],
	"form-action": ["'self'"],
	"frame-ancestors": ["'none'"],
	"frame-src": ["'self'"],
	"img-src": ["'self'", "blob:", "data:"],
	"manifest-src": ["'self'"],
	"media-src": ["'self'", "blob:", "data:"],
	"object-src": ["'none'"],
	"script-src": ["'self'", "'unsafe-inline'"],
	"style-src": ["'self'", "'unsafe-inline'"],
	"worker-src": ["'self'", "blob:"]
});
const pythonIdeContentSecurityPolicy = Object.freeze({
	...standardContentSecurityPolicy,
	"connect-src": [
		"'self'",
		"https://cdn.jsdelivr.net",
		"https://files.pythonhosted.org",
		"https://pypi.org"
	],
	"script-src": [
		"'self'",
		"'unsafe-eval'",
		"'unsafe-inline'",
		"'wasm-unsafe-eval'",
		"https://cdn.jsdelivr.net",
		"https://cdn.plot.ly"
	]
});

function assertion(condition, message) {
	if (!condition) throw new Error(message);
}

function normalizedSources(sources) {
	return [...sources].sort().join(" ");
}

export function validateContentSecurityPolicy(value, policyName) {
	assertion(
		policyName === "standard" || policyName === "python-ide",
		"Unknown Content-Security-Policy profile."
	);
	assertion(
		typeof value === "string" && value.trim(),
		`${policyName} response is missing Content-Security-Policy.`
	);

	const actual = new Map();
	for (const directiveText of value.split(";")) {
		const tokens = directiveText.trim().split(/\s+/u).filter(Boolean);
		if (!tokens.length) continue;
		const [directive, ...sources] = tokens;
		assertion(
			!actual.has(directive),
			`${policyName} Content-Security-Policy repeats ${directive}.`
		);
		actual.set(directive, sources);
	}

	const expected = policyName === "python-ide"
		? pythonIdeContentSecurityPolicy
		: standardContentSecurityPolicy;
	assertion(
		actual.size === Object.keys(expected).length,
		`${policyName} Content-Security-Policy has an unexpected directive set.`
	);
	for (const [directive, expectedSources] of Object.entries(expected)) {
		const actualSources = actual.get(directive);
		assertion(
			actualSources
			&& normalizedSources(actualSources) === normalizedSources(expectedSources),
			`${policyName} Content-Security-Policy has unexpected ${directive} sources.`
		);
	}
	return true;
}

export function parseExpectedBoolean(value, name) {
	const normalized = (value ?? "false").trim().toLowerCase();
	assertion(
		normalized === "true" || normalized === "false",
		`${name} must be either true or false.`
	);
	return normalized === "true";
}

const expectedStudentAccountsEnabled = parseExpectedBoolean(
	process.env.CS_EXPECT_STUDENT_ACCOUNTS_ENABLED,
	"CS_EXPECT_STUDENT_ACCOUNTS_ENABLED"
);
const expectedStudentOAuthEnabled = parseExpectedBoolean(
	process.env.CS_EXPECT_STUDENT_OAUTH_ENABLED,
	"CS_EXPECT_STUDENT_OAUTH_ENABLED"
);
const expectedClassroomAnalyticsEnabled = parseExpectedBoolean(
	process.env.CS_EXPECT_CLASSROOM_ANALYTICS_COLLECTION_ENABLED,
	"CS_EXPECT_CLASSROOM_ANALYTICS_COLLECTION_ENABLED"
);
assertion(
	!expectedStudentOAuthEnabled || expectedStudentAccountsEnabled,
	"CS_EXPECT_STUDENT_OAUTH_ENABLED=true requires CS_EXPECT_STUDENT_ACCOUNTS_ENABLED=true."
);

async function request(path, init = {}) {
	const url = new URL(path, productionOrigin);
	return await smokeRequest(url, {
		...init,
		timeoutMs
	});
}

export async function readSmokeJson(response, path) {
	try {
		return await response.json();
	}
	catch {
		throw new Error(`${path} returned invalid JSON.`);
	}
}

function validateReleaseMetadata(metadata, path) {
	assertion(
		metadata
		&& typeof metadata === "object"
		&& !Array.isArray(metadata)
		&& Object.keys(metadata).sort().join(",") === "revision,version"
		&& releaseVersionPattern.test(metadata.version)
		&& sourceRevisionPattern.test(metadata.revision),
		`${path} did not contain the minimal release metadata contract.`
	);
	return metadata;
}

async function releaseMetadata(path) {
	const response = await request(path);
	assertion(response.ok, `${path} returned HTTP ${response.status}`);
	assertion(
		response.headers.get("cache-control")?.includes("no-store"),
		`${path} must not be cached.`
	);
	assertion(
		response.headers.get("set-cookie") === null,
		`${path} unexpectedly set a cookie.`
	);
	return validateReleaseMetadata(await readSmokeJson(response, path), path);
}

async function verifyReleaseIdentity() {
	if (expectedRelease) {
		assertion(
			releaseVersionPattern.test(expectedRelease),
			"CS_EXPECTED_RELEASE must be a semantic version."
		);
	}
	if (expectedRevision) {
		assertion(
			/^[0-9a-f]{40}$/.test(expectedRevision),
			"CS_EXPECTED_REVISION must be a full lowercase Git commit SHA."
		);
	}

	const publicRelease = await releaseMetadata("/release.json");
	const apiRelease = await releaseMetadata("/api/release");
	assertion(
		JSON.stringify(publicRelease) === JSON.stringify(apiRelease),
		"The public site and API report different release identities."
	);

	if (expectedRelease) {
		assertion(
			publicRelease.version === expectedRelease,
			`Expected release ${expectedRelease}, received ${publicRelease.version}.`
		);
	}
	if (expectedRevision) {
		assertion(
			publicRelease.revision === expectedRevision,
			`Expected revision ${expectedRevision}, received ${publicRelease.revision}.`
		);
	}
}

async function verifySecurityHeaders() {
	for (const [path, policyName] of [
		["/", "standard"],
		["/python-ide/", "python-ide"]
	]) {
		const response = await request(path);
		assertion(response.ok, `${path} returned HTTP ${response.status}`);
		validateContentSecurityPolicy(
			response.headers.get("content-security-policy"),
			policyName
		);
		for (const [header, expectedValue] of Object.entries(securityHeaders)) {
			assertion(
				response.headers.get(header) === expectedValue,
				`${path} returned an unexpected ${header} header.`
			);
		}
	}
}

async function verifyPublicRoutes() {
	for (const path of ["/", "/python-ide"]) {
		const response = await request(path);
		assertion(response.ok, `${path} returned HTTP ${response.status}`);
	}

	for (const [alias, canonical] of [
		["/python-ide?course=python-1", "/python-ide/?course=python-1"],
		["/python-ide.html?course=python-1", "/python-ide/?course=python-1"]
	]) {
		const response = await request(alias, { redirect: "manual" });
		assertion(
			response.status === 301,
			`${alias} returned HTTP ${response.status} instead of a canonical redirect.`
		);
		assertion(
			response.headers.get("location") === canonical,
			`${alias} did not preserve its query in the canonical redirect.`
		);
	}

	for (const path of [
		"/graph-sketcher",
		"/graph-sketcher/",
		"/graph-sketcher/index.html",
		"/graph-sketcher.html",
		"/assets/GraphSketcherWorkspace-retired.js",
		"/assets/graphSketcherArchive.worker-retired.js",
		"/assets/graph-sketcher-retired.js",
		"/licenses/graphsketcher-omni-source-license.txt"
	]) {
		const response = await request(path, { redirect: "manual" });
		assertion(
			response.status === 404,
			`${path} returned HTTP ${response.status} instead of 404.`
		);
		assertion(
			response.headers.get("set-cookie") === null,
			`${path} unexpectedly set a cookie.`
		);
	}

	const adminRedirect = await request("/admin", {
		redirect: "manual"
	});
	assertion(
		adminRedirect.status === 301,
		`/admin returned HTTP ${adminRedirect.status} instead of a directory redirect.`
	);
	assertion(
		adminRedirect.headers.get("location") === "/admin/",
		`/admin returned an unexpected Location header: ${
			adminRedirect.headers.get("location") ?? "(missing)"
		}.`
	);

	const unknown = await request("/__cs-avasan-deployment-probe-missing", {
		redirect: "manual"
	});
	assertion(
		unknown.status === 404,
		`The unknown-route probe returned HTTP ${unknown.status} instead of 404.`
	);
	assertion(
		unknown.headers.get("set-cookie") === null,
		"The unknown-route probe unexpectedly set a cookie."
	);
}

async function verifyApiReadiness() {
	const healthResponse = await request("/api/healthz");
	const health = await readSmokeJson(healthResponse, "/api/healthz");
	assertion(
		healthResponse.ok && health.ok === true,
		`/api/healthz returned HTTP ${healthResponse.status} or an invalid body.`
	);

	const readyResponse = await request("/api/readyz");
	const readiness = await readSmokeJson(readyResponse, "/api/readyz");
	assertion(
		readyResponse.ok && readiness.ready === true,
		`/api/readyz returned HTTP ${readyResponse.status} or an invalid body.`
	);
}

async function verifyPrivacyFeatureBoundaries() {
	const student = await request("/api/students/session", {
		redirect: "manual"
	});
	assertion(
		student.status === (expectedStudentAccountsEnabled ? 200 : 404),
		`Student session endpoint returned HTTP ${student.status}; expected ${
			expectedStudentAccountsEnabled ? 200 : 404
		}.`
	);
	assertion(
		student.headers.get("cache-control")?.includes("no-store"),
		"Student session endpoint must not be cached."
	);
	assertion(
		student.headers.get("set-cookie") === null,
		"Unauthenticated student session probe unexpectedly set a cookie."
	);
	if (expectedStudentAccountsEnabled) {
		const session = await readSmokeJson(student, "/api/students/session");
		assertion(
			session
			&& typeof session === "object"
			&& !Array.isArray(session)
			&& Object.keys(session).sort().join(",") === "requiresPasswordSetup,student"
			&& session.student === null
			&& session.requiresPasswordSetup === false,
			"Enabled student session endpoint returned an unexpected anonymous-session body."
		);
	}

	const oauth = await request("/api/students/oauth/providers", {
		redirect: "manual"
	});
	assertion(
		oauth.status === (expectedStudentOAuthEnabled ? 200 : 404),
		`Student OAuth provider endpoint returned HTTP ${oauth.status}; expected ${
			expectedStudentOAuthEnabled ? 200 : 404
		}.`
	);
	assertion(
		oauth.headers.get("cache-control")?.includes("no-store"),
		"Student OAuth provider endpoint must not be cached."
	);
	assertion(
		oauth.headers.get("set-cookie") === null,
		"Student OAuth provider probe unexpectedly set a cookie."
	);
	if (expectedStudentOAuthEnabled) {
		const providers = await readSmokeJson(
			oauth,
			"/api/students/oauth/providers"
		);
		assertion(
			providers
			&& typeof providers === "object"
			&& !Array.isArray(providers)
			&& Object.keys(providers).sort().join(",") === "apple,google"
			&& typeof providers.apple === "boolean"
			&& typeof providers.google === "boolean"
			&& (providers.apple || providers.google),
			"Enabled student OAuth endpoint did not report a configured Apple or Google provider."
		);
	}

	const usage = await request("/api/classroom-usage", {
		body: JSON.stringify({
			event: "__deployment-probe-invalid",
			siteID: "cs"
		}),
		headers: {
			"Content-Type": "application/json",
			"Origin": "https://cs.avasan.org",
			"X-Classroom-Request": "1"
		},
		method: "POST",
		redirect: "manual"
	});
	assertion(
		usage.status === (expectedClassroomAnalyticsEnabled ? 400 : 404),
		`Classroom usage endpoint returned HTTP ${usage.status}; expected ${
			expectedClassroomAnalyticsEnabled ? 400 : 404
		}.`
	);
	assertion(
		usage.headers.get("cache-control")?.includes("no-store"),
		"Classroom usage endpoint must not be cached."
	);
	assertion(
		usage.headers.get("set-cookie") === null,
		"Anonymous classroom usage probe unexpectedly set a cookie."
	);

	const admin = await request("/api/admins/loggedin", {
		redirect: "manual"
	});
	assertion(
		admin.status === 403,
		`Unauthenticated Admin session endpoint returned HTTP ${admin.status} instead of 403.`
	);
}

export async function runProductionSmoke() {
	currentSmokePhase = "release identity";
	await verifyReleaseIdentity();
	currentSmokePhase = "security headers";
	await verifySecurityHeaders();
	currentSmokePhase = "public routes";
	await verifyPublicRoutes();
	currentSmokePhase = "API readiness";
	await verifyApiReadiness();
	currentSmokePhase = "privacy feature boundaries";
	await verifyPrivacyFeatureBoundaries();
	currentSmokePhase = "complete";
	console.log(
		`OK: ${productionOrigin} reports one matching release across the public site and API.`
	);
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runProductionSmoke().catch(() => {
		// HTTP and OAuth responses are deliberately excluded from logs. The
		// phase identifies the failed gate without retaining response data.
		console.error(
			`CS production verification failed during ${currentSmokePhase}; response details were not logged.`
		);
		process.exitCode = 1;
	});
}
