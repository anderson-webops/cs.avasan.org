import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import process from "node:process";
import { pathToFileURL } from "node:url";

const configKeys = [
	"CLASSROOM_ANALYTICS_COLLECTION_ENABLED",
	"CLASSROOM_ANALYTICS_RETENTION_DAYS",
	"CLASSROOM_PRIVACY_APPROVED",
	"CLASSROOM_PRIVACY_OPERATOR_NOTICE",
	"CLASSROOM_PRIVACY_POLICY_EFFECTIVE_DATE",
	"CLASSROOM_PRIVACY_POLICY_VERSION",
	"CLASSROOM_SERVICE_PROVIDER_NOTICE",
	"SCHOOL_PRIVACY_CONTACT",
	"STUDENT_ACCOUNTS_ENABLED",
	"STUDENT_OAUTH_ENABLED",
	"STUDENT_RECORD_RETENTION_DAYS"
];
const versionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9a-z.-]+)?$/i;
const revisionPattern = /^[0-9a-f]{40}$/;

function analyticsCollectionIsEnabled(value) {
	return ["1", "true", "yes"].includes(value.trim().toLowerCase());
}

function validateAnalyticsRetention(buildConfig) {
	const value = buildConfig.CLASSROOM_ANALYTICS_RETENTION_DAYS;
	if (!value) {
		if (analyticsCollectionIsEnabled(
			buildConfig.CLASSROOM_ANALYTICS_COLLECTION_ENABLED
		)) {
			throw new Error(
				"CLASSROOM_ANALYTICS_RETENTION_DAYS is required before classroom analytics can be enabled."
			);
		}
		return;
	}
	const days = Number(value);
	if (!/^(?:[7-9]|[1-8]\d|90)$/.test(value) || !Number.isSafeInteger(days) || days < 7 || days > 90) {
		throw new Error(
			"CLASSROOM_ANALYTICS_RETENTION_DAYS must be an integer from 7 to 90."
		);
	}
}

export function nativeReleaseManifest(environment = process.env) {
	const version = environment.CS_RELEASE_VERSION?.replace(/^v/, "").trim();
	const revision = environment.SOURCE_REVISION?.trim();
	if (!version || !versionPattern.test(version)) {
		throw new Error("CS_RELEASE_VERSION must be a semantic version.");
	}
	if (!revision || !revisionPattern.test(revision)) {
		throw new Error("SOURCE_REVISION must be a full lowercase Git commit SHA.");
	}

	const buildConfig = Object.fromEntries(
		configKeys.map(key => [key, environment[key]?.trim() ?? ""])
	);
	validateAnalyticsRetention(buildConfig);
	const configDigest = createHash("sha256")
		.update(JSON.stringify(buildConfig))
		.digest("hex");
	return { buildConfig, configDigest, revision, version };
}

export function nativePublicEnvironment(manifest) {
	return `${Object.entries(manifest.buildConfig)
		.map(([name, value]) => {
			if (/[\r\n]/u.test(value)) {
				throw new Error(`${name} must stay on one line in the native environment file.`);
			}
			const quoted = value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');
			return `${name}="${quoted}"`;
		})
		.join("\n")}\n`;
}

async function main() {
	const outputIndex = process.argv.indexOf("--output");
	const output = outputIndex >= 0 ? process.argv[outputIndex + 1] : undefined;
	const environmentIndex = process.argv.indexOf("--output-environment");
	const environmentOutput = environmentIndex >= 0
		? process.argv[environmentIndex + 1]
		: undefined;
	const manifest = nativeReleaseManifest();
	if (output) {
		await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
	}
	if (environmentOutput) {
		await writeFile(environmentOutput, nativePublicEnvironment(manifest), "utf8");
	}
	if (process.argv.includes("--print-release-suffix")) {
		process.stdout.write(`${manifest.revision}-${manifest.configDigest}\n`);
	}
}

// Keep this module importable by tests without performing file writes.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	await main();
}
