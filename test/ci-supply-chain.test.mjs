import assert from "node:assert/strict";
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

test("install-script approvals are exact pins derived from each lockfile", () => {
	assertPinnedAllowScripts(readJson("package.json"), readJson("package-lock.json"));
	const backendPackage = readJson("back-end/package.json");
	const backendNpmrc = read("back-end/.npmrc");
	assert.equal(Object.hasOwn(backendPackage, "allowScripts"), false);
	assertPinnedAllowScriptEntries(
		npmrcAllowScripts(backendNpmrc),
		readJson("back-end/package-lock.json")
	);

	for (const npmrc of [read(".npmrc"), backendNpmrc]) {
		assert.match(npmrc, /^include=optional$/mu);
		assert.match(npmrc, /^strict-allow-scripts=true$/mu);
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
	const installCommands = workflow.match(/run: npm ci[^\n]*/gu) ?? [];
	assert.equal(installCommands.length > 0, true);
	assert.equal(installCommands.every(command => command.includes("--include=optional")), true);
	assert.equal(installCommands.every(command => command.includes("--strict-allow-scripts")), true);
	assert.match(workflowJob(workflow, "backend-install"), /npm ci[^\n]*--workspaces=false/u);

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
