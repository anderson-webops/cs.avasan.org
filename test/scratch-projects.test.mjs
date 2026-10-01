import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { unzipSync, strFromU8 } from "fflate";
import {
	createProject,
	lessons
} from "../front-end/scripts/scratch/generate-projects.mjs";

for (const lesson of lessons)
	for (const solution of [false, true]) {
		test(`${lesson.name}: ${solution ? "reference" : "starter"} is a portable Scratch 3 archive`, () => {
			const { archive, project } = createProject(lesson.id, solution);
			const files = unzipSync(archive);
			assert.deepEqual(
				JSON.parse(strFromU8(files["project.json"])),
				project
			);
			assert.equal(project.targets.filter(t => t.isStage).length, 1);
			assert.ok(project.targets.length >= 2);
			for (const target of project.targets) {
				for (const costume of target.costumes) {
					assert.ok(files[costume.md5ext]);
					assert.equal(
						createHash("md5")
							.update(files[costume.md5ext])
							.digest("hex"),
						costume.assetId
					);
				}
				for (const [id, block] of Object.entries(target.blocks)) {
					if (block.next)
						assert.equal(target.blocks[block.next].parent, id);
					if (block.parent) assert.ok(target.blocks[block.parent]);
					if (block.topLevel) assert.equal(block.parent, null);
					for (const input of Object.values(block.inputs)) {
						if (typeof input[1] === "string")
							assert.equal(target.blocks[input[1]].parent, id);
					}
				}
			}
		});
	}
test("keyboard warmup is four blocks; dress-up retains an example and two student areas", () => {
	assert.equal(
		Object.keys(createProject("two-arrows").project.targets[1].blocks)
			.length,
		4
	);
	const targets = createProject("dress-up").project.targets;
	assert.ok(
		Object.keys(targets.find(t => t.name === "Hat").blocks).length > 0
	);
	for (const name of ["Badge", "Boots"])
		assert.equal(
			Object.keys(targets.find(t => t.name === name).blocks).length,
			0
		);
});
test("published starters match the reproducible generator and do not include solutions", async () => {
	for (const lesson of lessons)
		assert.deepEqual(
			new Uint8Array(
				await readFile(
					new URL(
						`../front-end/public/scratch-projects/${lesson.id}.sb3`,
						import.meta.url
					)
				)
			),
			createProject(lesson.id).archive
		);
});

test("blank independent project has portable artwork but no scripts or solutions", async () => {
	const { project, archive } = createProject("blank");
	assert.equal(project.targets.length, 2);
	for (const target of project.targets) {
		assert.deepEqual(target.blocks, {});
		assert.deepEqual(target.variables, {});
	}
	assert.deepEqual(project.monitors, []);
	assert.deepEqual(new Uint8Array(await readFile(new URL("../front-end/public/scratch-projects/blank.sb3", import.meta.url))), archive);
});
