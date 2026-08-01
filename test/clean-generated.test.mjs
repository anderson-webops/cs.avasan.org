import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, parse, resolve } from "node:path";
// This executable root-level safety test intentionally uses Node's test runner.
// eslint-disable-next-line test/no-import-node-test
import test from "node:test";
import {
	cleanGenerated,
	cleanupTarget,
	GENERATED_PATHS
} from "../scripts/clean-generated.mjs";

const repositoryRoot = resolve(import.meta.dirname, "..");

async function writeWorkspacePackage(root) {
	await writeFile(
		join(root, "package.json"),
		`${JSON.stringify({
			name: "classes-monorepo",
			private: true,
			workspaces: ["front-end", "back-end"]
		})}\n`,
		"utf8"
	);
}

test("the package clean command delegates without sudo or lockfile deletion", () => {
	const packageJson = JSON.parse(readFileSync(join(repositoryRoot, "package.json"), "utf8"));

	assert.equal(packageJson.scripts.clean, "node scripts/clean-generated.mjs");
	assert.doesNotMatch(packageJson.scripts.clean, /sudo|rm\s+-rf|package-lock|node_modules/u);
	assert.equal(packageJson.scripts["test:clean"], "node --test test/clean-generated.test.mjs");
});

test("cleanup targets are fixed inside a non-root workspace", () => {
	assert.throws(
		() => cleanupTarget(parse(repositoryRoot).root, GENERATED_PATHS[0]),
		/filesystem root/u
	);
	assert.throws(
		() => cleanupTarget(repositoryRoot, "package-lock.json"),
		/not approved/u
	);
	assert.throws(
		() => cleanupTarget(repositoryRoot, "../outside"),
		/not approved/u
	);
});

test("cleaning removes only approved generated output", async () => {
	const fixtureRoot = await mkdtemp(join(tmpdir(), "cs-clean-generated-"));
	try {
		await writeWorkspacePackage(fixtureRoot);
		await writeFile(join(fixtureRoot, "package-lock.json"), "preserve lockfile\n", "utf8");
		await writeFile(join(fixtureRoot, "keep.txt"), "preserve unrelated file\n", "utf8");
		for (const generatedPath of GENERATED_PATHS) {
			const target = join(fixtureRoot, generatedPath);
			await mkdir(target, { recursive: true });
			await writeFile(join(target, "generated.txt"), "generated\n", "utf8");
		}
		for (const workspace of ["front-end", "back-end"]) {
			await writeFile(join(fixtureRoot, workspace, "package-lock.json"), "preserve workspace lockfile\n", "utf8");
			await mkdir(join(fixtureRoot, workspace, "node_modules"), { recursive: true });
			await writeFile(join(fixtureRoot, workspace, "node_modules", "keep.txt"), "preserve dependencies\n", "utf8");
		}
		await mkdir(join(fixtureRoot, "node_modules"), { recursive: true });
		await writeFile(join(fixtureRoot, "node_modules", "keep.txt"), "preserve dependencies\n", "utf8");

		const messages = [];
		await cleanGenerated({
			root: fixtureRoot,
			log: message => messages.push(message)
		});

		for (const generatedPath of GENERATED_PATHS) {
			assert.equal(existsSync(join(fixtureRoot, generatedPath)), false);
		}
		assert.equal(readFileSync(join(fixtureRoot, "package-lock.json"), "utf8"), "preserve lockfile\n");
		assert.equal(readFileSync(join(fixtureRoot, "keep.txt"), "utf8"), "preserve unrelated file\n");
		for (const workspace of ["front-end", "back-end"]) {
			assert.equal(
				readFileSync(join(fixtureRoot, workspace, "package-lock.json"), "utf8"),
				"preserve workspace lockfile\n"
			);
			assert.equal(
				readFileSync(join(fixtureRoot, workspace, "node_modules", "keep.txt"), "utf8"),
				"preserve dependencies\n"
			);
		}
		assert.equal(
			readFileSync(join(fixtureRoot, "node_modules", "keep.txt"), "utf8"),
			"preserve dependencies\n"
		);
		assert.deepEqual(messages, GENERATED_PATHS.map(generatedPath => `Cleaned ${generatedPath}`));
	}
	finally {
		await rm(fixtureRoot, { force: true, recursive: true });
	}
});

test("cleaning refuses a symbolic-link path before removing anything", async () => {
	const fixtureRoot = await mkdtemp(join(tmpdir(), "cs-clean-symlink-"));
	const outsideRoot = await mkdtemp(join(tmpdir(), "cs-clean-outside-"));
	try {
		await writeWorkspacePackage(fixtureRoot);
		await writeFile(join(fixtureRoot, "keep.txt"), "preserve\n", "utf8");
		await writeFile(join(outsideRoot, "outside.txt"), "preserve outside\n", "utf8");
		await symlink(outsideRoot, join(fixtureRoot, "front-end"), "dir");

		await assert.rejects(
			cleanGenerated({ root: fixtureRoot, log: () => {} }),
			/symbolic link/u
		);
		assert.equal(readFileSync(join(fixtureRoot, "keep.txt"), "utf8"), "preserve\n");
		assert.equal(readFileSync(join(outsideRoot, "outside.txt"), "utf8"), "preserve outside\n");
	}
	finally {
		await rm(fixtureRoot, { force: true, recursive: true });
		await rm(outsideRoot, { force: true, recursive: true });
	}
});
