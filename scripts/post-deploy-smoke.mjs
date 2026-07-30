import process from "node:process";
import { pathToFileURL } from "node:url";
import { runProductionGraphSketcherSmoke } from "./production-graph-sketcher-smoke.mjs";

const productionOrigin = process.env.CS_SITE_ORIGIN || "https://cs.avasan.org";
const expectedRelease = process.env.CS_EXPECTED_RELEASE?.replace(/^v/, "");
const expectedRevision = process.env.CS_EXPECTED_REVISION;
const timeoutMs = Number(process.env.CS_SITE_SMOKE_TIMEOUT_MS || 15_000);
const releaseVersionPattern
	= /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9a-z.-]+)?$/i;
const sourceRevisionPattern = /^(?:[0-9a-f]{40}|unknown)$/;

function assertion(condition, message) {
	if (!condition) throw new Error(message);
}

async function request(path, init = {}) {
	const url = new URL(path, productionOrigin);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(url, {
			...init,
			cache: "no-store",
			signal: controller.signal
		});
	}
	finally {
		clearTimeout(timeout);
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

async function verifyFailClosedPrivacy() {
	const student = await request("/api/students/session", {
		redirect: "manual"
	});
	assertion(
		student.status === 404,
		`Disabled student session endpoint returned HTTP ${student.status} instead of 404.`
	);

	const usage = await request("/api/classroom-usage", {
		body: JSON.stringify({
			event: "ide-open",
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
		usage.status === 404,
		`Disabled classroom usage endpoint returned HTTP ${usage.status} instead of 404.`
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
	await verifyFailClosedPrivacy();
	await runProductionGraphSketcherSmoke();
	console.log(
		`OK: ${productionOrigin} reports one matching release across the public site and API.`
	);
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runProductionSmoke().catch((error) => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
}
