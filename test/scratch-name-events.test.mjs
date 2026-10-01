import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { unzipSync } from "fflate";
import {
	createProject,
	lessons
} from "../front-end/scripts/scratch/generate-projects.mjs";

function script(target, event) {
	const start = Object.values(target.blocks).find(
		block => block.topLevel && block.opcode === event
	);
	const result = [];
	for (
		let block = start;
		block;
		block = block.next ? target.blocks[block.next] : null
	)
		result.push(block);
	return result;
}
test("first name lesson is loop-free and preserves exemplar plus learner gap", () => {
	assert.equal(lessons[0].id, "animate-word");
	const { project, archive } = createProject("animate-word");
	const targets = Object.fromEntries(
		project.targets.map(target => [target.name, target])
	);
	for (const target of project.targets)
		assert.ok(
			Object.values(target.blocks).every(
				block =>
					![
						"control_repeat",
						"control_forever",
						"event_broadcast"
					].includes(block.opcode)
			)
		);
	for (const name of ["C", "D", "E"])
		assert.ok(
			script(targets[name], "event_whenthisspriteclicked").length > 1
		);
	assert.equal(script(targets.O, "event_whenthisspriteclicked").length, 0);
	assert.ok(
		script(
			createProject("animate-word", true).project.targets.find(
				target => target.name === "O"
			),
			"event_whenthisspriteclicked"
		).length > 1
	);
	const sizeClick = script(targets.E, "event_whenthisspriteclicked");
	assert.equal(sizeClick[1].opcode, "looks_changesizeby");
	assert.ok(!sizeClick.some(block => block.opcode === "looks_setsizeto"));
	for (const name of ["C", "O", "D", "E"]) {
		const reset = script(targets[name], "event_whenflagclicked");
		assert.ok(reset.some(block => block.opcode === "motion_gotoxy"));
		assert.ok(
			reset.some(block => block.opcode === "looks_cleargraphiceffects")
		);
		assert.equal(
			reset.find(block => block.opcode === "looks_setsizeto").inputs
				.SIZE[1][1],
			"70"
		);
	}
	assert.equal(
		script(targets.Stage, "event_whenflagclicked")[1].inputs.BACKDROP[1][1],
		"Day"
	);
	const sound = targets.D.sounds[0],
		files = unzipSync(archive),
		wav = Buffer.from(files[sound.md5ext]);
	assert.equal(createHash("md5").update(wav).digest("hex"), sound.assetId);
	assert.equal(wav.toString("ascii", 0, 4), "RIFF");
	assert.equal(wav.toString("ascii", 8, 12), "WAVE");
	assert.equal(wav.readUInt32LE(24), sound.rate);
	assert.equal(wav.readUInt32LE(40), sound.sampleCount * 2);
});
