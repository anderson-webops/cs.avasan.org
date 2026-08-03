import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
// This executable root-level configuration test intentionally uses Node's test runner.
// eslint-disable-next-line test/no-import-node-test
import test from "node:test";

const repositoryRoot = resolve(import.meta.dirname, "..");

function read(relativePath) {
	return readFileSync(join(repositoryRoot, relativePath), "utf8");
}

function readJson(relativePath) {
	return JSON.parse(read(relativePath));
}

function packageNameFromLockPath(location) {
	const packagePath = location.slice(location.lastIndexOf("node_modules/") + "node_modules/".length);
	const segments = packagePath.split("/");
	return segments[0].startsWith("@") ? `${segments[0]}/${segments[1]}` : segments[0];
}

function expectedInstallScriptPins(lockfile) {
	return Object.entries(lockfile.packages)
		.filter(([location, metadata]) => location.includes("node_modules/") && metadata.hasInstallScript === true)
		.map(([location, metadata]) => `${packageNameFromLockPath(location)}@${metadata.version}`)
		.sort();
}

function assertPinnedAllowScriptEntries(actualPins, lockfile) {
	assert.deepEqual(actualPins, expectedInstallScriptPins(lockfile));
	assert.equal(actualPins.every(pin => /@\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/u.test(pin)), true);
}

function assertPinnedAllowScripts(packageJson, lockfile) {
	const actualPins = Object.keys(packageJson.allowScripts).sort();
	assertPinnedAllowScriptEntries(actualPins, lockfile);
	assert.equal(Object.values(packageJson.allowScripts).every(value => value === true), true);
}

function exactPackageIdentity(identity) {
	const separator = identity.lastIndexOf("@");
	assert.notEqual(separator, -1, `invalid exact package identity: ${identity}`);
	return {
		name: identity.slice(0, separator),
		version: identity.slice(separator + 1)
	};
}

function expectedRegistryTarball(name, version) {
	const tarballName = name.slice(name.lastIndexOf("/") + 1);
	return `https://registry.npmjs.org/${name}/-/${tarballName}-${version}.tgz`;
}

function assertCanonicalRegistryOccurrence(location, metadata) {
	const name = packageNameFromLockPath(location);
	const identity = `${name}@${metadata.version}`;
	assert.equal(
		metadata.resolved,
		expectedRegistryTarball(name, metadata.version),
		`untrusted registry source for ${identity} at ${location}`
	);
	assert.match(
		metadata.integrity ?? "",
		/^sha512-[A-Za-z0-9+/]+={0,2}$/u,
		`missing sha512 integrity for ${identity} at ${location}`
	);
	assert.equal(
		Buffer.from(
			metadata.integrity.slice("sha512-".length),
			"base64"
		).length,
		64,
		`invalid sha512 integrity for ${identity} at ${location}`
	);
}

function npmrcAllowScripts(npmrc) {
	const matches = [...npmrc.matchAll(/^allow-scripts=(.+)$/gmu)];
	assert.equal(matches.length, 1);
	return matches[0][1].split(",").map(value => value.trim()).filter(Boolean).sort();
}

function workflowJob(source, name) {
	const marker = `    ${name}:\n`;
	const start = source.indexOf(marker);
	assert.notEqual(start, -1, `missing ${name} job`);
	const remainder = source.slice(start + marker.length);
	const nextJob = remainder.search(/^ {4}[\w-]+:\n/mu);
	return nextJob === -1 ? source.slice(start) : source.slice(start, start + marker.length + nextJob);
}

function workflowJobNames(source) {
	return [...source.matchAll(/^ {4}([\w-]+):\n/gmu)].map(match => match[1]);
}

test("install-script approvals are exact pins derived from each lockfile", () => {
	assertPinnedAllowScripts(readJson("package.json"), readJson("package-lock.json"));
	const backendPackage = readJson("back-end/package.json");
	const backendNpmrc = read("back-end/.npmrc");
	assert.equal(Object.hasOwn(backendPackage, "allowScripts"), false);
	assertPinnedAllowScriptEntries(
		npmrcAllowScripts(backendNpmrc),
		readJson("back-end/package-lock.json")
	);
	assert.equal(
		backendNpmrc,
		`strict-allow-scripts=true\nallow-scripts=${expectedInstallScriptPins(
			readJson("back-end/package-lock.json")
		).join(",")}\n`
	);
	assert.match(read(".npmrc"), /^include=optional$/mu);
	assert.match(read(".npmrc"), /^strict-allow-scripts=true$/mu);
});

test("every exact-approved root install script has canonical registry provenance", () => {
	const packageJson = readJson("package.json");
	const lockfile = readJson("package-lock.json");
	const approvals = Object.entries(packageJson.allowScripts)
		.filter(([, allowed]) => allowed === true)
		.map(([identity]) => identity);

	for (const identity of approvals) {
		const { name, version } = exactPackageIdentity(identity);
		const occurrences = Object.entries(lockfile.packages).filter(
			([location, metadata]) =>
				location.includes("node_modules/") &&
				packageNameFromLockPath(location) === name &&
				metadata.version === version
		);
		assert.notEqual(
			occurrences.length,
			0,
			`exact approval is absent from the root lockfile: ${identity}`
		);
		for (const [location, metadata] of occurrences) {
			assertCanonicalRegistryOccurrence(location, metadata);
		}
	}
});

test("both lockfiles pin every installed package to canonical npm provenance", () => {
	for (const lockfilePath of ["package-lock.json", "back-end/package-lock.json"]) {
		const lockfile = readJson(lockfilePath);
		const occurrences = Object.entries(lockfile.packages).filter(
			([location, metadata]) =>
				location.includes("node_modules/") &&
				typeof metadata.version === "string" &&
				metadata.version.length > 0
		);
		assert.notEqual(
			occurrences.length,
			0,
			`${lockfilePath} has no installed registry packages`
		);
		for (const [location, metadata] of occurrences) {
			assertCanonicalRegistryOccurrence(location, metadata);
		}
	}
});

test("every workflow checkout drops persisted credentials", () => {
	const workflows = [
		".github/workflows/ci.yml",
		".github/workflows/codeql-analysis.yml",
		".github/workflows/post-deploy.yml",
		".github/workflows/qodana_code_quality.yml"
	];
	let checkoutCount = 0;

	for (const workflow of workflows) {
		const lines = read(workflow).split("\n");
		for (const [index, line] of lines.entries()) {
			if (!line.includes("uses: actions/checkout@"))
				continue;
			checkoutCount += 1;
			assert.match(lines.slice(index + 1, index + 7).join("\n"), /persist-credentials:\s*false/u, workflow);
		}
	}

	assert.equal(checkoutCount > 0, true);
});

test("CI installs fail closed without unnecessary browser downloads", () => {
	const workflow = read(".github/workflows/ci.yml");
	const installCommands = workflow
		.split("\n")
		.filter(line => /\bnpm ci\b/u.test(line));
	assert.notEqual(installCommands.length, 0);
	assert.equal(
		installCommands.every(command => command.includes("--include=optional")),
		true
	);
	assert.equal(
		installCommands.every(command => command.includes("--strict-allow-scripts")),
		true
	);
	assert.match(workflowJob(workflow, "backend-install"), /npm ci[^\n]*--workspaces=false/u);
	const packageManager = readJson("package.json").packageManager;
	assert.match(packageManager, /^npm@\d+\.\d+\.\d+$/u);
	const npmVersion = packageManager.slice("npm@".length);
	const installJobs = workflowJobNames(workflow).filter(name =>
		/\bnpm ci\b/u.test(workflowJob(workflow, name))
	);
	assert.notEqual(installJobs.length, 0, "missing npm ci jobs");
	for (const name of installJobs) {
		const job = workflowJob(workflow, name);
		const pin = job.search(
			new RegExp(`^ {18}npm i -g ${packageManager}$`, "mu")
		);
		const assertion = job.search(
			new RegExp(
				`^ {18}test "\\$\\(npm --version\\)" = "${npmVersion}"$`,
				"mu"
			)
		);
		const install = job.search(/\bnpm ci\b/u);
		assert.ok(
			pin >= 0 && pin < assertion && assertion < install,
			`${name} must pin and assert ${packageManager} before npm ci`
		);
	}

	for (const job of ["lint", "typecheck", "test", "static-media", "build"]) {
		const block = workflowJob(workflow, job);
		assert.match(block, /CYPRESS_INSTALL_BINARY:\s*"0"/u);
		assert.match(block, /PUPPETEER_SKIP_DOWNLOAD:\s*"true"/u);
	}

	const accessibility = workflowJob(workflow, "accessibility");
	assert.match(accessibility, /CYPRESS_INSTALL_BINARY:\s*"0"/u);
	assert.doesNotMatch(accessibility, /PUPPETEER_SKIP_DOWNLOAD/u);

	const endToEnd = workflowJob(workflow, "test-e2e");
	assert.match(endToEnd, /PUPPETEER_SKIP_DOWNLOAD:\s*"true"/u);
	assert.doesNotMatch(endToEnd, /CYPRESS_INSTALL_BINARY/u);
	assert.equal(endToEnd.indexOf("uses: actions/cache@") < endToEnd.indexOf("run: npm ci"), true);
});

test("container installs use the same strict policy without downloading browsers", () => {
	const frontendDockerfile = read("Dockerfile");
	const backendDockerfile = read("back-end/Dockerfile");
	for (const dockerfile of [frontendDockerfile, backendDockerfile]) {
		const installCommands = dockerfile.match(/npm ci[^\\\n]*(?:\\\n\s+[^\n]*)*/gu) ?? [];
		assert.equal(installCommands.length > 0, true);
		assert.equal(installCommands.every(command => command.includes("--include=optional")), true);
		assert.equal(installCommands.every(command => command.includes("--strict-allow-scripts")), true);
	}
	assert.match(frontendDockerfile, /CYPRESS_INSTALL_BINARY=0 PUPPETEER_SKIP_DOWNLOAD=true/u);
	assert.equal((backendDockerfile.match(/CYPRESS_INSTALL_BINARY=0 PUPPETEER_SKIP_DOWNLOAD=true/gu) ?? []).length, 2);
});

test("the build gate audits dependencies, signatures, and dependency trees", () => {
	const build = workflowJob(read(".github/workflows/ci.yml"), "build");
	for (const command of [
		"npm run test:ci-security",
		"npm run audit:full",
		"npm run audit:production",
		"npm run audit:signatures",
		"npm run verify:dependency-tree"
	]) {
		assert.equal(build.includes(command), true);
	}
});

test("the static-media audit uses the pinned local TypeScript runner", () => {
	const audit = read("scripts/audit-static-course-media.mjs");
	assert.match(audit, /"node_modules",\s*\n\s*"tsx",\s*\n\s*"dist",\s*\n\s*"cli[.]mjs"/u);
	assert.match(audit, /process[.]execPath/u);
	assert.doesNotMatch(audit, /vite-node|spawn\("npm"/u);
});

test("container verification derives a validated release from package.json", () => {
	const packageJson = readJson("package.json");
	const containerStack = workflowJob(read(".github/workflows/ci.yml"), "container-stack");
	assert.match(
		packageJson.version,
		/^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u
	);
	assert.doesNotMatch(containerStack, /CS_RELEASE_VERSION:\s*["']?1\.0\.0/u);
	assert.match(containerStack, /readFileSync\("package\.json", "utf8"\)/u);
	assert.match(containerStack, /semver\.test\(version\)/u);
	assert.match(containerStack, /appendFileSync\(process\.env\.GITHUB_ENV/u);
});

test("Dependabot covers the root lock, standalone backend lock, and actions", () => {
	const dependabot = read(".github/dependabot.yml");
	assert.equal((dependabot.match(/package-ecosystem:/gu) ?? []).length, 3);
	assert.match(dependabot, /package-ecosystem: npm\n\s+directory: \/\n/u);
	assert.match(dependabot, /package-ecosystem: npm\n\s+directory: \/back-end\n/u);
	assert.match(dependabot, /package-ecosystem: github-actions\n\s+directory: \/\n/u);
	assert.equal((dependabot.match(/interval: weekly/gu) ?? []).length, 3);
});
