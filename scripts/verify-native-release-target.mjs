#!/usr/bin/env node

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const configKeys = Object.freeze([
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
]);
const legacyConfigKeys = Object.freeze(
	configKeys.filter(name => name !== "CLASSROOM_ANALYTICS_RETENTION_DAYS")
);
const allowedTopLevelEntries = new Set([
	"back-end",
	"front-end",
	"native-release.json",
	"node_modules",
	"package-lock.json",
	"package.json",
	"public",
	"public-config.env",
	"release.env",
	"scripts"
]);
const requiredDirectories = Object.freeze([
	"back-end",
	"back-end/dist",
	"front-end",
	"node_modules",
	"public",
	"scripts"
]);
const requiredFiles = Object.freeze([
	"back-end/dist/server.js",
	"front-end/package.json",
	"native-release.json",
	"package-lock.json",
	"package.json",
	"public/404.html",
	"public/index.html",
	"public/release.json",
	"public-config.env",
	"release.env",
	"scripts/post-deploy-smoke.mjs",
	"scripts/verify-native-runtime-config.mjs"
]);
const versionPattern = /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/u;
const revisionPattern = /^[0-9a-f]{40}$/u;
const digestPattern = /^[0-9a-f]{64}$/u;
const lastPreRetentionContractVersion = Object.freeze([2, 7, 114]);

function fail(message) {
	throw new Error(`Native release target verification failed: ${message}`);
}

function isPlainObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isPreRetentionContractVersion(version) {
	const versionParts = version
		.split("-", 1)[0]
		.split(".")
		.map(Number);
	for (let index = 0; index < lastPreRetentionContractVersion.length; index += 1) {
		const difference
			= (versionParts[index] ?? 0)
				- (lastPreRetentionContractVersion[index] ?? 0);
		if (difference !== 0) return difference < 0;
	}
	return true;
}

async function lstatOrFail(target, description) {
	const stats = await fs.lstat(target).catch(() => null);
	if (!stats) fail(`${description} is missing.`);
	return stats;
}

async function requireDirectory(candidate, relativePath) {
	const absolutePath = path.join(candidate, relativePath);
	const stats = await lstatOrFail(absolutePath, `required directory ${relativePath}`);
	if (!stats.isDirectory() || stats.isSymbolicLink()) {
		fail(`required directory ${relativePath} is not a real directory`);
	}
}

async function requireFile(candidate, relativePath) {
	const absolutePath = path.join(candidate, relativePath);
	const stats = await lstatOrFail(absolutePath, `required file ${relativePath}`);
	if (!stats.isFile() || stats.isSymbolicLink()) {
		fail(`required file ${relativePath} is not a regular file`);
	}
	return absolutePath;
}

function publicEnvironment(buildConfig, selectedConfigKeys) {
	return `${selectedConfigKeys
		.map((name) => {
			const value = buildConfig[name];
			if (/[\r\n]/u.test(value)) {
				fail(`build configuration ${name} is not one line`);
			}
			const quoted = value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
			return `${name}="${quoted}"`;
		})
		.join("\n")}\n`;
}

function verifyAnalyticsRetention(buildConfig) {
	const collectionEnabled = ["1", "true", "yes"].includes(
		buildConfig.CLASSROOM_ANALYTICS_COLLECTION_ENABLED.trim().toLowerCase()
	);
	const value = buildConfig.CLASSROOM_ANALYTICS_RETENTION_DAYS;
	if (!value) {
		if (collectionEnabled) {
			fail("classroom analytics are enabled without an explicit retention period");
		}
		return;
	}
	const days = Number(value);
	if (!/^(?:[7-9]|[1-8]\d|90)$/.test(value) || !Number.isSafeInteger(days) || days < 7 || days > 90) {
		fail("classroom analytics retention must be an integer from 7 to 90");
	}
}

async function verifyIdentity(candidate) {
	const manifestPath = await requireFile(candidate, "native-release.json");
	const packagePath = await requireFile(candidate, "package.json");
	const publicReleasePath = await requireFile(candidate, "public/release.json");
	const releaseEnvironmentPath = await requireFile(candidate, "release.env");
	const publicEnvironmentPath = await requireFile(candidate, "public-config.env");
	const [manifest, packageManifest, publicRelease, releaseEnvironment, actualPublicEnvironment]
		= await Promise.all([
			fs.readFile(manifestPath, "utf8").then(JSON.parse),
			fs.readFile(packagePath, "utf8").then(JSON.parse),
			fs.readFile(publicReleasePath, "utf8").then(JSON.parse),
			fs.readFile(releaseEnvironmentPath, "utf8"),
			fs.readFile(publicEnvironmentPath, "utf8")
		]);

	if (!isPlainObject(manifest)) fail("native-release.json is not an object");
	if (
		!versionPattern.test(manifest.version)
		|| !revisionPattern.test(manifest.revision)
		|| !digestPattern.test(manifest.configDigest)
	) {
		fail("native-release.json has an invalid release identity");
	}
	if (!isPlainObject(manifest.buildConfig)) {
		fail("native-release.json is missing its build configuration");
	}
	const actualConfigKeys = Object.keys(manifest.buildConfig).sort();
	const currentConfigKeys = [...configKeys].sort();
	const oldConfigKeys = [...legacyConfigKeys].sort();
	const legacyAnalyticsSetting
		= manifest.buildConfig.CLASSROOM_ANALYTICS_COLLECTION_ENABLED;
	let selectedConfigKeys;
	if (JSON.stringify(actualConfigKeys) === JSON.stringify(currentConfigKeys)) {
		selectedConfigKeys = configKeys;
	}
	else if (
		JSON.stringify(actualConfigKeys) === JSON.stringify(oldConfigKeys)
		&& isPreRetentionContractVersion(manifest.version)
		&& typeof legacyAnalyticsSetting === "string"
		&& !["1", "true", "yes"].includes(
			legacyAnalyticsSetting.trim().toLowerCase()
		)
	) {
		// Releases built before the explicit-retention contract remain valid
		// rollback targets only when analytics collection was disabled.
		selectedConfigKeys = legacyConfigKeys;
	}
	else {
		fail("native-release.json has an unexpected build configuration");
	}
	for (const name of selectedConfigKeys) {
		if (typeof manifest.buildConfig[name] !== "string") {
			fail(`build configuration ${name} is not a string`);
		}
	}
	verifyAnalyticsRetention(manifest.buildConfig);
	const configDigest = createHash("sha256")
		.update(JSON.stringify(manifest.buildConfig))
		.digest("hex");
	if (manifest.configDigest !== configDigest) {
		fail("native-release.json has an inconsistent configuration digest");
	}
	if (
		packageManifest.version !== manifest.version
		|| publicRelease.version !== manifest.version
		|| publicRelease.revision !== manifest.revision
	) {
		fail("package and public release identities do not match native-release.json");
	}
	const expectedReleaseEnvironment
		= `CS_RELEASE_VERSION=${manifest.version}\nSOURCE_REVISION=${manifest.revision}\n`;
	if (releaseEnvironment !== expectedReleaseEnvironment) {
		fail("release.env does not match native-release.json");
	}
	if (actualPublicEnvironment !== publicEnvironment(
		manifest.buildConfig,
		selectedConfigKeys
	)) {
		fail("public-config.env does not match native-release.json");
	}

	return manifest;
}

async function verifyImmutableTree(candidate, expectedOwner) {
	async function visit(absolutePath, relativePath) {
		const stats = await fs.lstat(absolutePath);
		if (stats.uid !== expectedOwner) {
			fail(`release entry is not owned by uid ${expectedOwner}: ${relativePath || "."}`);
		}
		if (stats.isSymbolicLink()) {
			if (!relativePath.split(path.sep).includes("node_modules")) {
				fail(`release symlink is outside node_modules: ${relativePath}`);
			}
			const resolvedTarget = await fs.realpath(absolutePath).catch(() => "");
			if (
				!resolvedTarget
				|| (resolvedTarget !== candidate && !resolvedTarget.startsWith(`${candidate}${path.sep}`))
			) {
				fail(`release symlink escapes the immutable release: ${relativePath}`);
			}
			return;
		}
		if (!stats.isDirectory() && !stats.isFile()) {
			fail(`release contains an unsupported filesystem entry: ${relativePath || "."}`);
		}
		if ((stats.mode & 0o022) !== 0) {
			fail(`release entry is group- or world-writable: ${relativePath || "."}`);
		}
		if (!stats.isDirectory()) return;

		const entries = await fs.readdir(absolutePath);
		entries.sort((left, right) => left.localeCompare(right));
		for (const entry of entries) {
			await visit(
				path.join(absolutePath, entry),
				relativePath ? path.join(relativePath, entry) : entry
			);
		}
	}

	await visit(candidate, "");
}

export async function verifyNativeReleaseTarget(
	requestedCandidate,
	requestedReleaseRoot,
	{ expectedOwner = 0 } = {}
) {
	if (!Number.isSafeInteger(expectedOwner) || expectedOwner < 0) {
		fail("expected owner is invalid");
	}
	const candidatePath = path.resolve(requestedCandidate);
	const releaseRootPath = path.resolve(requestedReleaseRoot);
	const releasesPath = path.join(releaseRootPath, "releases");
	const [candidateStats, releaseRootStats, releasesStats] = await Promise.all([
		lstatOrFail(candidatePath, "release target"),
		lstatOrFail(releaseRootPath, "release root"),
		lstatOrFail(releasesPath, "managed releases directory")
	]);
	if (!candidateStats.isDirectory() || candidateStats.isSymbolicLink()) {
		fail("release target must be a real directory, not a symlink");
	}
	if ((candidateStats.mode & 0o777) !== 0o755) {
		fail("release target must use mode 0755");
	}
	if (!releaseRootStats.isDirectory() || releaseRootStats.isSymbolicLink()) {
		fail("release root must be a real directory, not a symlink");
	}
	if (!releasesStats.isDirectory() || releasesStats.isSymbolicLink()) {
		fail("managed releases directory must be a real directory, not a symlink");
	}
	for (const [description, stats] of [
		["release root", releaseRootStats],
		["managed releases directory", releasesStats]
	]) {
		if (stats.uid !== expectedOwner || (stats.mode & 0o022) !== 0) {
			fail(`${description} must be owned by uid ${expectedOwner} and not group- or world-writable`);
		}
	}

	const [candidate, releaseRoot, releases] = await Promise.all([
		fs.realpath(candidatePath),
		fs.realpath(releaseRootPath),
		fs.realpath(releasesPath)
	]);
	if (candidatePath !== candidate) {
		fail("release target path must be canonical and contain no symlink aliases");
	}
	if (releaseRootPath !== releaseRoot || releasesPath !== releases) {
		fail("release root paths must be canonical and contain no symlink aliases");
	}
	if (path.dirname(candidate) !== releases) {
		fail("release target is not an immediate child of the managed releases directory");
	}
	if (releaseRoot !== path.dirname(releases)) {
		fail("managed releases directory is not beneath the release root");
	}

	const manifest = await verifyIdentity(candidate);
	const expectedReleaseName = `${manifest.revision}-${manifest.configDigest}`;
	if (path.basename(candidate) !== expectedReleaseName) {
		fail("release directory name does not match its immutable identity");
	}

	const topLevelEntries = await fs.readdir(candidate);
	for (const entry of topLevelEntries) {
		if (!allowedTopLevelEntries.has(entry)) {
			fail(`release contains an unsupported top-level entry: ${entry}`);
		}
	}
	await Promise.all(requiredDirectories.map(relativePath =>
		requireDirectory(candidate, relativePath)
	));
	await Promise.all(requiredFiles.map(relativePath =>
		requireFile(candidate, relativePath)
	));
	await verifyImmutableTree(candidate, expectedOwner);

	console.log(`Verified immutable native release ${expectedReleaseName}.`);
	return { candidate, manifest };
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	if (process.argv.length !== 4) {
		console.error("Usage: verify-native-release-target.mjs RELEASE RELEASE_ROOT");
		process.exitCode = 2;
	}
	else {
		verifyNativeReleaseTarget(process.argv[2], process.argv[3]).catch((error) => {
			console.error(
				error instanceof Error
					? error.message
					: "Native release target verification failed."
			);
			process.exitCode = 1;
		});
	}
}
