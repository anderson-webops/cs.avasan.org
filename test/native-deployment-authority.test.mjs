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

function workflowJob(source, name) {
	const marker = `    ${name}:\n`;
	const start = source.indexOf(marker);
	assert.notEqual(start, -1, `missing ${name} job`);
	const remainder = source.slice(start + marker.length);
	const nextJob = remainder.search(/^ {4}[\w-]+:\n/mu);
	return nextJob === -1 ? source.slice(start) : source.slice(start, start + marker.length + nextJob);
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
	assert.match(nativeContract, /node --test test\/native-deployment-authority\.test\.mjs/u);

	const composeFallback = workflowJob(workflow, "container-stack");
	assert.match(composeFallback, /name: Compose fallback full-stack fixture/u);
});
