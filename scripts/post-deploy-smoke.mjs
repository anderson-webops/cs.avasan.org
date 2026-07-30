import process from "node:process";
import { pathToFileURL } from "node:url";
import {
	smokeErrorMessage,
	smokeRequest
} from "./http-smoke-client.mjs";
import { runProductionGraphSketcherSmoke } from "./production-graph-sketcher-smoke.mjs";

const productionOrigin = process.env.CS_SITE_ORIGIN || "https://cs.avasan.org";
const expectedRelease = process.env.CS_EXPECTED_RELEASE?.replace(/^v/, "");
const expectedRevision = process.env.CS_EXPECTED_REVISION;
const timeoutMs = Number(process.env.CS_SITE_SMOKE_TIMEOUT_MS || 15_000);
const releaseVersionPattern
	= /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9a-z.-]+)?$/i;
const sourceRevisionPattern = /^[0-9a-f]{40}$/;

function assertion(condition, message) {
	if (!condition) throw new Error(message);
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
	return validateReleaseMetadata(await response.json(), path);
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

async function verifyPublicRoutes() {
	for (const path of ["/", "/python-ide", "/graph-sketcher"]) {
		const response = await request(path);
		assertion(response.ok, `${path} returned HTTP ${response.status}`);
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
	assertion(
		healthResponse.ok && (await healthResponse.json()).ok === true,
		`/api/healthz returned HTTP ${healthResponse.status} or an invalid body.`
	);

	const readyResponse = await request("/api/readyz");
	assertion(
		readyResponse.ok && (await readyResponse.json()).ready === true,
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
		const session = await student.json();
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
		const providers = await oauth.json();
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
	await verifyReleaseIdentity();
	await verifyPublicRoutes();
	await verifyApiReadiness();
	await verifyPrivacyFeatureBoundaries();
	await runProductionGraphSketcherSmoke();
	console.log(
		`OK: ${productionOrigin} reports one matching release across the public site and API.`
	);
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runProductionSmoke().catch((error) => {
		console.error(smokeErrorMessage(error));
		process.exitCode = 1;
	});
}
