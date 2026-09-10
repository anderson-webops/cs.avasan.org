import assert from "node:assert/strict";
import {
	chmodSync,
	chownSync,
	lstatSync,
	mkdirSync,
	readFileSync,
	renameSync,
	rmSync,
	writeFileSync
} from "node:fs";
import { isAbsolute, join, resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

export const RUNTIME_COMPATIBILITY_DROP_IN
	= "90-cs-release-runtime-compatibility.conf";
export const DISABLED_CLASSROOM_ANALYTICS_SERVICE_OVERRIDE
	= "[Service]\nEnvironment=CLASSROOM_ANALYTICS_SERVICE_KEY=\n";

function lstatIfPresent(path) {
	try {
		return lstatSync(path);
	}
	catch (error) {
		if (error?.code === "ENOENT") return null;
		throw error;
	}
}

function assertTrustedDirectory(path, expectedUid, expectedGid) {
	const stat = lstatSync(path);
	assert.ok(
		stat.isDirectory() && !stat.isSymbolicLink(),
		`Runtime compatibility parent must be a real directory: ${path}`
	);
	assert.equal(stat.uid, expectedUid, `Unexpected directory owner: ${path}`);
	assert.equal(stat.gid, expectedGid, `Unexpected directory group: ${path}`);
	assert.equal(
		stat.mode & 0o022,
		0,
		`Runtime compatibility parent must not be group/other writable: ${path}`
	);
}

function assertManagedOverride(path, expectedUid, expectedGid) {
	const stat = lstatSync(path);
	assert.ok(
		stat.isFile() && !stat.isSymbolicLink(),
		"The managed runtime compatibility override must be a regular file."
	);
	assert.equal(stat.uid, expectedUid, "The managed override has an unexpected owner.");
	assert.equal(stat.gid, expectedGid, "The managed override has an unexpected group.");
	assert.equal(
		stat.mode & 0o777,
		0o644,
		"The managed runtime compatibility override must use mode 0644."
	);
	assert.equal(
		readFileSync(path, "utf8"),
		DISABLED_CLASSROOM_ANALYTICS_SERVICE_OVERRIDE,
		"Refusing to replace an unrecognized runtime compatibility override."
	);
}

export function configureNativeRuntimeCompatibility({
	enabled,
	expectedGid,
	expectedUid,
	serviceName,
	systemdRoot
}) {
	assert.equal(typeof enabled, "boolean", "The companion service state must be boolean.");
	assert.match(
		serviceName,
		/^[a-zA-Z0-9_.@-]+[.]service$/u,
		"The systemd service name is invalid."
	);
	assert.ok(
		isAbsolute(systemdRoot) && resolve(systemdRoot) === systemdRoot && systemdRoot !== "/",
		"The systemd unit root must be a narrow canonical absolute path."
	);
	assert.ok(Number.isSafeInteger(expectedUid) && expectedUid >= 0, "Expected UID is invalid.");
	assert.ok(Number.isSafeInteger(expectedGid) && expectedGid >= 0, "Expected GID is invalid.");
	assertTrustedDirectory(systemdRoot, expectedUid, expectedGid);

	const overrideDirectory = join(systemdRoot, `${serviceName}.d`);
	const overridePath = join(overrideDirectory, RUNTIME_COMPATIBILITY_DROP_IN);
	const existingDirectory = lstatIfPresent(overrideDirectory);
	if (existingDirectory === null) {
		if (enabled) return { changed: false, overridePath };
		mkdirSync(overrideDirectory, { mode: 0o755 });
		chownSync(overrideDirectory, expectedUid, expectedGid);
		chmodSync(overrideDirectory, 0o755);
	}
	assertTrustedDirectory(overrideDirectory, expectedUid, expectedGid);

	const existingOverride = lstatIfPresent(overridePath);
	if (existingOverride !== null) {
		assertManagedOverride(overridePath, expectedUid, expectedGid);
		if (enabled) {
			rmSync(overridePath);
			return { changed: true, overridePath };
		}
		return { changed: false, overridePath };
	}
	if (enabled) return { changed: false, overridePath };

	const temporaryPath = join(
		overrideDirectory,
		`.${RUNTIME_COMPATIBILITY_DROP_IN}.${process.pid}.tmp`
	);
	assert.equal(
		lstatIfPresent(temporaryPath),
		null,
		"A stale runtime compatibility temporary file already exists."
	);
	try {
		writeFileSync(
			temporaryPath,
			DISABLED_CLASSROOM_ANALYTICS_SERVICE_OVERRIDE,
			{ flag: "wx", mode: 0o644 }
		);
		chownSync(temporaryPath, expectedUid, expectedGid);
		chmodSync(temporaryPath, 0o644);
		renameSync(temporaryPath, overridePath);
	}
	catch (error) {
		rmSync(temporaryPath, { force: true });
		throw error;
	}
	assertManagedOverride(overridePath, expectedUid, expectedGid);
	return { changed: true, overridePath };
}

function main() {
	assert.equal(process.geteuid?.(), 0, "Runtime compatibility changes require root.");
	assert.equal(process.argv.length, 4, "Usage: configure-native-runtime-compatibility.mjs <service> <enabled|disabled>");
	const serviceName = process.argv[2];
	const mode = process.argv[3];
	assert.ok(mode === "enabled" || mode === "disabled", "Runtime compatibility mode is invalid.");
	const result = configureNativeRuntimeCompatibility({
		enabled: mode === "enabled",
		expectedGid: 0,
		expectedUid: 0,
		serviceName,
		systemdRoot: "/etc/systemd/system"
	});
	console.log(
		result.changed
			? "Updated the reviewed CS runtime compatibility boundary."
			: "The reviewed CS runtime compatibility boundary is already current."
	);
}

const invokedUrl = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedUrl) main();
