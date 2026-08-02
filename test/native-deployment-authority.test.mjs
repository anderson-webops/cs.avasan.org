import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { chmod, mkdir, mkdtemp, realpath, rename, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";
// This executable root-level configuration test intentionally uses Node's test runner.
// eslint-disable-next-line test/no-import-node-test
import test from "node:test";
import { verifyNativeReleaseTarget } from "../scripts/verify-native-release-target.mjs";

const repositoryRoot = resolve(import.meta.dirname, "..");

function read(relativePath) {
	return readFileSync(join(repositoryRoot, relativePath), "utf8");
}

function git(directory, ...args) {
	return execFileSync("git", args, {
		cwd: directory,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"]
	}).trim();
}

async function releaseRepository(t) {
	const directory = await mkdtemp(join(tmpdir(), "cs-native-source-"));
	t.after(async () => rm(directory, { force: true, recursive: true }));
	git(directory, "init", "--quiet", "--initial-branch=main");
	git(directory, "config", "user.name", "Native Fixture");
	git(directory, "config", "user.email", "native-fixture@example.invalid");
	await writeFile(join(directory, "release.txt"), "release\n");
	git(directory, "add", "release.txt");
	git(directory, "commit", "--quiet", "-m", "Release fixture");
	git(
		directory,
		"remote",
		"add",
		"origin",
		"git@github.com:anderson-webops/cs.avasan.org.git"
	);
	git(directory, "update-ref", "refs/remotes/origin/main", "HEAD");
	git(directory, "tag", "--annotate", "v2.7.999", "-m", "v2.7.999");
	return directory;
}

function runSourceVerifier(directory) {
	return spawnSync(
		"bash",
		[
			join(repositoryRoot, "scripts/verify-native-source.sh"),
			directory,
			"v2.7.999"
		],
		{ encoding: "utf8" }
	);
}

const buildConfig = Object.freeze({
	CLASSROOM_ANALYTICS_COLLECTION_ENABLED: "false",
	CLASSROOM_PRIVACY_APPROVED: "false",
	CLASSROOM_PRIVACY_OPERATOR_NOTICE: "",
	CLASSROOM_SERVICE_PROVIDER_NOTICE: "",
	SCHOOL_PRIVACY_CONTACT: "",
	STUDENT_ACCOUNTS_ENABLED: "false",
	STUDENT_OAUTH_ENABLED: "false",
	STUDENT_RECORD_RETENTION_DAYS: ""
});

function publicEnvironment() {
	return `${Object.entries(buildConfig)
		.map(([name, value]) => `${name}="${value}"`)
		.join("\n")}\n`;
}

async function nativeReleaseFixture(t) {
	const temporaryRoot = await mkdtemp(join(tmpdir(), "cs-native-target-"));
	t.after(async () => rm(temporaryRoot, { force: true, recursive: true }));
	const releaseRoot = join(temporaryRoot, "cs.avasan.org");
	const revision = "a".repeat(40);
	const configDigest = createHash("sha256")
		.update(JSON.stringify(buildConfig))
		.digest("hex");
	const candidate = join(releaseRoot, "releases", `${revision}-${configDigest}`);
	for (const directory of [
		"back-end/dist",
		"front-end",
		"node_modules/.bin",
		"node_modules/runtime-package",
		"public",
		"scripts"
	]) {
		await mkdir(join(candidate, directory), { recursive: true });
	}
	const files = {
		"back-end/dist/server.js": "export {};\n",
		"front-end/package.json": "{\"name\":\"front-end\",\"private\":true}\n",
		"native-release.json": `${JSON.stringify({
			buildConfig,
			configDigest,
			revision,
			version: "2.7.999"
		}, null, 2)}\n`,
		"node_modules/runtime-package/tool.js": "export {};\n",
		"package-lock.json": "{\"name\":\"cs-avasan-org\",\"lockfileVersion\":3}\n",
		"package.json": "{\"name\":\"cs-avasan-org\",\"version\":\"2.7.999\"}\n",
		"public/404.html": "<h1>Page not found</h1>\n",
		"public/index.html": "<h1>Computer Science with Julio</h1>\n",
		"public/release.json": `${JSON.stringify({ revision, version: "2.7.999" }, null, 2)}\n`,
		"public-config.env": publicEnvironment(),
		"release.env": `CS_RELEASE_VERSION=2.7.999\nSOURCE_REVISION=${revision}\n`,
		"scripts/post-deploy-smoke.mjs": "export {};\n",
		"scripts/verify-native-runtime-config.mjs": "export {};\n"
	};
	await Promise.all(Object.entries(files).map(([relativePath, contents]) =>
		writeFile(join(candidate, relativePath), contents)
	));
	await symlink(
		"../runtime-package/tool.js",
		join(candidate, "node_modules/.bin/runtime-tool")
	);
	return {
		candidate: await realpath(candidate),
		releaseRoot: await realpath(releaseRoot)
	};
}

function workflowJob(source, name) {
	const marker = `    ${name}:\n`;
	const start = source.indexOf(marker);
	assert.notEqual(start, -1, `missing ${name} job`);
	const remainder = source.slice(start + marker.length);
	const nextJob = remainder.search(/^ {4}[\w-]+:\n/mu);
	return nextJob === -1 ? source.slice(start) : source.slice(start, start + marker.length + nextJob);
}

function shellFunction(source, name) {
	const marker = `${name}() {\n`;
	const start = source.indexOf(marker);
	assert.notEqual(start, -1, `missing ${name} function`);
	const remainder = source.slice(start + marker.length);
	const nextFunction = remainder.search(/^[_a-z][_a-z0-9]*\(\) \{\n/mu);
	return nextFunction === -1
		? source.slice(start)
		: source.slice(start, start + marker.length + nextFunction);
}

test("native systemd and Nginx are the explicit automatic production authority", () => {
	const agents = read("AGENTS.md");
	const readme = read("README.md");
	const nativeRunbook = read("docs/native-production-deployment.md");
	const privacyRunbook = read("docs/privacy-operations.md");
	const packageManifest = JSON.parse(read("package.json"));
	const workflow = read(".github/workflows/ci.yml");

	assert.match(agents, /Native Nginx and systemd are the canonical automatic production path/u);
	assert.match(agents, /Do not infer a container deployment from the root/u);
	assert.match(readme, /Native Nginx and systemd are the canonical automatic production path/u);
	assert.doesNotMatch(readme, /single supported production handoff/u);
	assert.match(nativeRunbook, /The server must classify this repository explicitly as native/u);
	assert.match(privacyRunbook, /Canonical native production runs exactly/u);
	assert.match(privacyRunbook, /Derived by the selected deployer/u);
	assert.doesNotMatch(privacyRunbook, /Production Compose derives/u);
	assert.doesNotMatch(privacyRunbook, /preferred native deployment/u);
	assert.equal(
		packageManifest.scripts["deploy:native"],
		"bash scripts/deploy-native-release.sh --source ."
	);

	const nativeContract = workflowJob(workflow, "native-contract");
	assert.match(nativeContract, /name: Canonical native deployment contract/u);
	assert.match(nativeContract, /bash -n scripts\/deploy-native-release\.sh/u);
	assert.match(nativeContract, /scripts\/verify-native-source\.sh/u);
	assert.match(nativeContract, /node --test test\/native-deployment-authority\.test\.mjs/u);

	const composeFallback = workflowJob(workflow, "container-stack");
	assert.match(composeFallback, /name: Compose fallback full-stack fixture/u);
});

test("native source provenance requires the canonical fetched main and annotated tag", async (t) => {
	const directory = await releaseRepository(t);
	let result = runSourceVerifier(directory);
	assert.equal(result.status, 0, result.stderr);
	assert.match(result.stdout, /exact canonical origin\/main revision/u);

	git(directory, "remote", "set-url", "origin", "git@github.com:anderson-webops/math.avasan.org.git");
	result = runSourceVerifier(directory);
	assert.notEqual(result.status, 0);
	assert.match(result.stderr, /origin is not anderson-webops\/cs\.avasan\.org/u);
	git(directory, "remote", "set-url", "origin", "https://github.com/anderson-webops/cs.avasan.org.git");

	git(directory, "update-ref", "-d", "refs/remotes/origin/main");
	result = runSourceVerifier(directory);
	assert.notEqual(result.status, 0);
	assert.match(result.stderr, /missing the fetched origin\/main/u);
	git(directory, "update-ref", "refs/remotes/origin/main", "HEAD");

	git(directory, "tag", "--delete", "v2.7.999");
	git(directory, "tag", "v2.7.999");
	result = runSourceVerifier(directory);
	assert.notEqual(result.status, 0);
	assert.match(result.stderr, /must exist as an annotated tag/u);
	git(directory, "tag", "--delete", "v2.7.999");
	git(directory, "tag", "--annotate", "v2.7.999", "-m", "v2.7.999");

	await writeFile(join(directory, "next.txt"), "not fetched\n");
	git(directory, "add", "next.txt");
	git(directory, "commit", "--quiet", "-m", "Unfetched fixture commit");
	result = runSourceVerifier(directory);
	assert.notEqual(result.status, 0);
	assert.match(result.stderr, /HEAD is not the exact fetched origin\/main/u);

	assert.doesNotMatch(read("scripts/verify-native-source.sh"), /git[^\n]*fetch/u);
});

test("native release target accepts an immutable internal workspace tree", async (t) => {
	const fixture = await nativeReleaseFixture(t);
	const result = await verifyNativeReleaseTarget(
		fixture.candidate,
		fixture.releaseRoot,
		{ expectedOwner: process.getuid?.() ?? 0 }
	);

	assert.equal(result.candidate, await realpath(fixture.candidate));
	assert.equal(result.manifest.version, "2.7.999");
});

test("native release target rejects symlink, identity, mode, and containment manipulation", async (t) => {
	const expectedOwner = process.getuid?.() ?? 0;

	const symlinkFixture = await nativeReleaseFixture(t);
	const alias = join(symlinkFixture.releaseRoot, "releases", "alias");
	await symlink(symlinkFixture.candidate, alias);
	await assert.rejects(
		verifyNativeReleaseTarget(alias, symlinkFixture.releaseRoot, { expectedOwner }),
		/not a symlink/u
	);

	const identityFixture = await nativeReleaseFixture(t);
	await writeFile(
		join(identityFixture.candidate, "release.env"),
		`CS_RELEASE_VERSION=2.7.998\nSOURCE_REVISION=${"a".repeat(40)}\n`
	);
	await assert.rejects(
		verifyNativeReleaseTarget(identityFixture.candidate, identityFixture.releaseRoot, { expectedOwner }),
		/release\.env does not match/u
	);

	const modeFixture = await nativeReleaseFixture(t);
	await chmod(join(modeFixture.candidate, "public/index.html"), 0o664);
	await assert.rejects(
		verifyNativeReleaseTarget(modeFixture.candidate, modeFixture.releaseRoot, { expectedOwner }),
		/group- or world-writable/u
	);

	const escapingFixture = await nativeReleaseFixture(t);
	const outsideFile = join(escapingFixture.releaseRoot, "outside.js");
	await writeFile(outsideFile, "outside\n");
	await rm(join(escapingFixture.candidate, "node_modules/.bin/runtime-tool"));
	await symlink(
		outsideFile,
		join(escapingFixture.candidate, "node_modules/.bin/runtime-tool")
	);
	await assert.rejects(
		verifyNativeReleaseTarget(escapingFixture.candidate, escapingFixture.releaseRoot, { expectedOwner }),
		/escapes the immutable release/u
	);

	const ownerFixture = await nativeReleaseFixture(t);
	await assert.rejects(
		verifyNativeReleaseTarget(ownerFixture.candidate, ownerFixture.releaseRoot, {
			expectedOwner: expectedOwner + 1
		}),
		/must be owned by uid/u
	);

	const nameFixture = await nativeReleaseFixture(t);
	const renamedCandidate = join(nameFixture.releaseRoot, "releases", "forged-release-name");
	await rename(nameFixture.candidate, renamedCandidate);
	await assert.rejects(
		verifyNativeReleaseTarget(renamedCandidate, nameFixture.releaseRoot, { expectedOwner }),
		/directory name does not match its immutable identity/u
	);

	const rootAliasFixture = await nativeReleaseFixture(t);
	const rootAliasParent = join(
		resolve(rootAliasFixture.releaseRoot, ".."),
		"release-root-parent-alias"
	);
	await symlink(resolve(rootAliasFixture.releaseRoot, ".."), rootAliasParent);
	await assert.rejects(
		verifyNativeReleaseTarget(
			rootAliasFixture.candidate,
			join(rootAliasParent, "cs.avasan.org"),
			{ expectedOwner }
		),
		/root paths must be canonical/u
	);
});

test("native activation failures prove the selected runtime after every recovery", () => {
	const deploy = read("scripts/deploy-native-release.sh");
	const rollback = read("scripts/rollback-native-release.sh");
	const restorePrevious = shellFunction(deploy, "restore_previous");
	const failActivation = shellFunction(deploy, "fail_activation");
	const restoreCurrent = shellFunction(rollback, "restore_current");
	const failRollback = shellFunction(rollback, "fail_rollback");

	assert.match(restorePrevious, /systemctl restart "\$cs_api_service"/u);
	assert.match(restorePrevious, /systemctl reload "\$cs_nginx_service"/u);
	assert.match(restorePrevious, /verify_release_health/u);
	assert.match(restorePrevious, /"\$cs_previous_version"/u);
	assert.match(restorePrevious, /"\$cs_previous_revision"/u);
	assert.match(restorePrevious, /prior-release health verification failed/u);
	assert.match(failActivation, /restore_previous \|\| cs_rollback_status=\$\?/u);
	assert.match(failActivation, /cs_activation_status/u);
	assert.match(failActivation, /automatic rollback separately failed with status/u);
	assert.doesNotMatch(failActivation, />\/dev\/null 2>&1/u);

	assert.match(restoreCurrent, /systemctl restart "\$cs_api_service"/u);
	assert.match(restoreCurrent, /systemctl reload "\$cs_nginx_service"/u);
	assert.match(restoreCurrent, /verify_release_health/u);
	assert.match(restoreCurrent, /"\$cs_current_manifest_version"/u);
	assert.match(restoreCurrent, /"\$cs_current_manifest_revision"/u);
	assert.match(restoreCurrent, /Original release health verification failed/u);
	assert.match(failRollback, /restore_current \|\| cs_restore_status=\$\?/u);
	assert.match(failRollback, /cs_rollback_status/u);
	assert.match(failRollback, /separately failed with status/u);
	assert.doesNotMatch(failRollback, />\/dev\/null 2>&1/u);

	for (const script of [deploy, rollback]) {
		assert.match(script, /CS_EXPECTED_RELEASE="\$cs_expected_version"/u);
		assert.match(script, /CS_EXPECTED_REVISION="\$cs_expected_revision"/u);
		assert.match(script, /wait_for_api_readiness \|\| cs_health_status=\$\?/u);
		assert.doesNotMatch(script, /if\s+!\s*\(/u);
	}
});
