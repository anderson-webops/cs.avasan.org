import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { zipSync, strToU8 } from "fflate";

export const lessons = JSON.parse(
	await readFile(new URL("./projects.json", import.meta.url), "utf8")
);
const number = value => [1, [4, String(value)]];
const text = value => [1, [10, String(value)]];
const block = (opcode, inputs = {}, fields = {}, substacks = {}) => ({
	opcode,
	inputs,
	fields,
	substacks
});
const flag = () => block("event_whenflagclicked");
const click = () => block("event_whenthisspriteclicked");
const key = value =>
	block("event_whenkeypressed", {}, { KEY_OPTION: [value, null] });
const x = value => block("motion_changexby", { DX: number(value) });
const y = value => block("motion_changeyby", { DY: number(value) });
const go = (a, b) => block("motion_gotoxy", { X: number(a), Y: number(b) });
const glide = (a, b) =>
	block("motion_glidesecstoxy", {
		SECS: number(1),
		X: number(a),
		Y: number(b)
	});
const turn = value => block("motion_turnright", { DEGREES: number(value) });
const wait = value => block("control_wait", { DURATION: number(value) });
const say = message =>
	block("looks_sayforsecs", { MESSAGE: text(message), SECS: number(2) });
const repeat = (count, blocks) =>
	block("control_repeat", { TIMES: number(count) }, {}, { SUBSTACK: blocks });
const forever = blocks =>
	block("control_forever", {}, {}, { SUBSTACK: blocks });
const color = () =>
	block(
		"looks_changeeffectby",
		{ CHANGE: number(25) },
		{ EFFECT: ["COLOR", null] }
	);
const score = () =>
	block(
		"data_changevariableby",
		{ VALUE: number(1) },
		{ VARIABLE: ["Score", "score"] }
	);
const resetScore = () =>
	block(
		"data_setvariableto",
		{ VALUE: number(0) },
		{ VARIABLE: ["Score", "score"] }
	);
const random = () =>
	block("motion_goto", {
		TO: {
			reporter: block("motion_goto_menu", {}, { TO: ["_random_", null] }),
			shadow: true
		}
	});
const touching = name => ({
	reporter: block("sensing_touchingobject", {
		TOUCHINGOBJECTMENU: {
			reporter: block(
				"sensing_touchingobjectmenu",
				{},
				{ TOUCHINGOBJECTMENU: [name, null] }
			),
			shadow: true
		}
	})
});
const ifBlock = (condition, blocks) =>
	block("control_if", { CONDITION: condition }, {}, { SUBSTACK: blocks });

export function createProject(id, solution = false) {
	const lesson = lessons.find(item => item.id === id);
	if (!lesson) throw new Error("Unknown Scratch lesson");
	const assets = {};
	let nextId = 0;
	function costume(name, body, width = 80, height = 80) {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
		const assetId = createHash("md5").update(svg).digest("hex");
		assets[`${assetId}.svg`] = strToU8(svg);
		return {
			name,
			bitmapResolution: 1,
			dataFormat: "svg",
			assetId,
			md5ext: `${assetId}.svg`,
			rotationCenterX: width / 2,
			rotationCenterY: height / 2
		};
	}
	const robot = fill =>
		`<rect x="10" y="10" width="60" height="60" rx="12" fill="${fill}" stroke="#172b4d" stroke-width="3"/><circle cx="28" cy="32" r="5" fill="white"/><circle cx="52" cy="32" r="5" fill="white"/><path d="M25 53h30" stroke="white" stroke-width="5"/>`;
	function target(
		name,
		isStage = false,
		a = 0,
		b = 0,
		costumes = [costume("Robot", robot("#237ec2"))]
	) {
		return {
			isStage,
			name,
			variables: {},
			lists: {},
			broadcasts: {},
			blocks: {},
			comments: {},
			currentCostume: 0,
			costumes,
			sounds: [],
			volume: 100,
			layerOrder: 1,
			...(isStage
				? {
						tempo: 60,
						videoTransparency: 50,
						videoState: "off",
						textToSpeechLanguage: null
					}
				: {
						visible: true,
						x: a,
						y: b,
						size: 70,
						direction: 90,
						draggable: false,
						rotationStyle: "all around"
					})
		};
	}
	const stage = target("Stage", true, 0, 0, [
		costume(
			"Day",
			'<path fill="#e4f4ff" d="M0 0h480v360H0z"/><path fill="#d0e6ca" d="M0 285h480v75H0z"/>',
			480,
			360
		)
	]);
	const player = target("Player");
	const targets = [stage, player];
	function stack(t, specs, parent = null, top = true) {
		let first = null,
			previous = null;
		for (const spec of specs) {
			const id = `b${++nextId}`;
			const entry = {
				opcode: spec.opcode,
				next: null,
				parent: previous || parent,
				inputs: {},
				fields: spec.fields,
				shadow: false,
				topLevel: top && !previous,
				...(top && !previous
					? {
							x:
								40 +
								(Object.values(t.blocks).filter(v => v.topLevel)
									.length %
									3) *
									300,
							y:
								50 +
								Math.floor(
									Object.values(t.blocks).filter(
										v => v.topLevel
									).length / 3
								) *
									260
						}
					: {})
			};
			t.blocks[id] = entry;
			if (previous) t.blocks[previous].next = id;
			if (!first) first = id;
			for (const [name, value] of Object.entries(spec.inputs)) {
				if (value.reporter) {
					const child = stack(t, [value.reporter], id, false);
					t.blocks[child].shadow = Boolean(value.shadow);
					entry.inputs[name] = [value.shadow ? 1 : 2, child];
				} else entry.inputs[name] = value;
			}
			for (const [name, list] of Object.entries(spec.substacks))
				if (list.length)
					entry.inputs[name] = [2, stack(t, list, id, false)];
			previous = id;
		}
		return first;
	}
	function note(t, message) {
		t.comments[`c${++nextId}`] = {
			blockId: null,
			x: 40,
			y: 620,
			width: 330,
			height: 160,
			minimized: false,
			text: message
		};
	}
	function second(name = "Orange", a = 120, b = 0) {
		const s = target(name, false, a, b, [costume(name, robot("#e79930"))]);
		targets.push(s);
		player.x = -120;
		return s;
	}
	function arrows(all = false) {
		stack(player, [key("left arrow"), x(-10)]);
		stack(player, [key("right arrow"), x(10)]);
		if (all) {
			stack(player, [key("up arrow"), y(10)]);
			stack(player, [key("down arrow"), y(-10)]);
		}
	}
	if (id === "two-arrows" || id === "third-direction") {
		arrows();
		if (solution && id === "third-direction")
			stack(player, [key("up arrow"), y(10)]);
	}
	if (id === "click-reactions") {
		stack(player, [click(), color()]);
		const s = second();
		if (solution) stack(s, [click(), color()]);
	}
	if (id === "dress-up") {
		player.size = 140;
		const pieces = [
			[
				"Hat",
				-175,
				100,
				0,
				70,
				'<path d="M8 58h64v12H8zM22 18h36v40H22z" fill="#784bb4"/>'
			],
			[
				"Badge",
				170,
				50,
				0,
				0,
				'<path d="M40 8l10 21 23 3-17 16 4 23-20-11-20 11 4-23L7 32l23-3z" fill="#efbb28" stroke="#704b0a"/>'
			],
			[
				"Boots",
				170,
				-110,
				0,
				-65,
				'<path d="M10 12h22v42h9v20H6V54h4zM48 12h22v42h8v20H43V54h5z" fill="#b64c51"/>'
			]
		];
		for (const [name, a, b, c, d, shape] of pieces) {
			const s = target(name, false, a, b, [costume(name, shape)]);
			targets.push(s);
			if (name === "Hat" || solution) {
				stack(s, [flag(), go(a, b)]);
				stack(s, [
					click(),
					block(
						"looks_gotofrontback",
						{},
						{ FRONT_BACK: ["front", null] }
					),
					glide(c, d)
				]);
			} else
				note(
					s,
					`${name}: complete the reset and click scripts using Hat as your example. Drag the sprite before reading its coordinates.`
				);
		}
	}
	if (id === "animate-word") {
		targets.splice(1);
		stage.costumes.push(
			costume(
				"Night",
				'<path fill="#162547" d="M0 0h480v360H0z"/>',
				480,
				360
			)
		);
		stack(stage, [
			flag(),
			block("looks_switchbackdropto", { BACKDROP: text("Day") })
		]);
		// Original short PCM chime; package the sound so offline imports remain self-contained.
		const rate = 22050,
			samples = 3308;
		const wav = Buffer.alloc(44 + samples * 2);
		wav.write("RIFF");
		wav.writeUInt32LE(wav.length - 8, 4);
		wav.write("WAVEfmt ", 8);
		wav.writeUInt32LE(16, 16);
		wav.writeUInt16LE(1, 20);
		wav.writeUInt16LE(1, 22);
		wav.writeUInt32LE(rate, 24);
		wav.writeUInt32LE(rate * 2, 28);
		wav.writeUInt16LE(2, 32);
		wav.writeUInt16LE(16, 34);
		wav.write("data", 36);
		wav.writeUInt32LE(samples * 2, 40);
		for (let n = 0; n < samples; n++)
			wav.writeInt16LE(
				Math.round(
					6000 *
						Math.sin((2 * Math.PI * 440 * n) / rate) *
						Math.sin((Math.PI * n) / samples)
				),
				44 + n * 2
			);
		const soundId = createHash("md5").update(wav).digest("hex");
		assets[`${soundId}.wav`] = wav;
		for (const [i, letter] of [..."CODE"].entries()) {
			const s = target(letter, false, -135 + i * 90, 0, [
				costume(
					letter,
					`<text x="8" y="64" font-family="sans-serif" font-size="64" font-weight="bold" fill="${["#237ec2", "#ab4e8a", "#dc7628", "#278770"][i]}">${letter}</text>`
				)
			]);
			targets.push(s);
			stack(s, [
				flag(),
				go(s.x, s.y),
				block("motion_pointindirection", { DIRECTION: number(90) }),
				block("looks_setsizeto", { SIZE: number(70) }),
				block("looks_cleargraphiceffects"),
				block("looks_say", { MESSAGE: text("") })
			]);
			if (i === 0)
				stack(s, [click(), turn(30), color(), wait(0.3), turn(-30)]);
			if (i === 1 && solution)
				stack(s, [click(), say("This is my letter!")]);
			if (i === 2) {
				s.sounds.push({
					name: "Chime",
					assetId: soundId,
					dataFormat: "wav",
					md5ext: `${soundId}.wav`,
					rate,
					sampleCount: samples
				});
				stack(s, [
					click(),
					block("sound_playuntildone", { SOUND_MENU: text("Chime") }),
					say("Hello!")
				]);
			}
			if (i === 3)
				stack(s, [
					click(),
					block("looks_changesizeby", { CHANGE: number(10) }),
					block("looks_nextbackdrop")
				]);
		}
	}
	if (id === "scene-switch") {
		stage.costumes.push(
			costume(
				"Night",
				'<path fill="#162547" d="M0 0h480v360H0z"/><circle cx="400" cy="60" r="30" fill="#ffe8a0"/><path fill="#2d4254" d="M0 285h480v75H0z"/>',
				480,
				360
			)
		);
		stack(stage, [key("space"), block("looks_nextbackdrop")]);
		if (solution)
			stack(stage, [
				flag(),
				block("looks_switchbackdropto", {
					BACKDROP: {
						reporter: block(
							"looks_backdrops",
							{},
							{ BACKDROP: ["Day", null] }
						),
						shadow: true
					}
				})
			]);
	}
	if (id === "conversation") {
		const s = second();
		stage.broadcasts.reply = "reply";
		stack(player, [
			flag(),
			say("Hello! I am ready to build."),
			block("event_broadcast", {
				BROADCAST_INPUT: [1, [11, "reply", "reply"]]
			})
		]);
		if (solution)
			stack(s, [
				block(
					"event_whenbroadcastreceived",
					{},
					{ BROADCAST_OPTION: ["reply", "reply"] }
				),
				say("Me too! What shall we make?")
			]);
	}
	if (id === "dance-loop") {
		const s = second();
		stack(player, [flag(), repeat(12, [turn(30), wait(0.15)])]);
		if (solution) stack(s, [flag(), repeat(12, [turn(-30), wait(0.15)])]);
	}
	if (id === "patrol")
		stack(player, [
			flag(),
			go(0, 0),
			forever([
				block("motion_movesteps", { STEPS: number(5) }),
				block("motion_ifonedgebounce"),
				...(solution ? [wait(0.04)] : [])
			])
		]);
	if (id === "maze-reset") {
		arrows(true);
		player.x = -180;
		player.y = -120;
		player.size = 30;
		const wall = target("Wall", false, 0, -75, [
			costume(
				"Wall",
				'<rect x="0" y="0" width="20" height="210" fill="#784bb4"/>',
				20,
				210
			)
		]);
		wall.size = 100;
		targets.push(wall);
		targets.push(
			target("Goal", false, 180, -120, [
				costume(
					"Goal",
					'<circle cx="40" cy="40" r="25" fill="#efbb28"/>'
				)
			])
		);
		stack(player, [
			flag(),
			forever([ifBlock(touching("Wall"), [go(-180, -120)]), wait(0.03)])
		]);
		if (solution) stack(player, [flag(), go(-180, -120)]);
	}
	if (id === "click-score") {
		stage.variables.score = ["Score", 0];
		const s = second();
		stack(stage, [flag(), resetScore()]);
		stack(player, [click(), score()]);
		if (solution) stack(s, [click(), score()]);
	}
	if (id === "collect-game") {
		stage.variables.score = ["Score", 0];
		arrows(true);
		stack(player, [flag(), go(-120, 0), resetScore()]);
		const s = second("Token", 130, 50);
		stack(s, [
			flag(),
			forever([
				ifBlock(touching("Player"), [
					...(solution ? [score()] : []),
					random()
				]),
				wait(0.04)
			])
		]);
	}
	note(
		targets[1],
		`${lesson.name}\n${solution ? "TEACHER REFERENCE: one possible Normal completion." : "NORMAL: " + lesson.normal}\nHARD: ${lesson.hard}\nCHECK: ${lesson.check}`
	);
	targets.forEach((item, index) => {
		item.layerOrder = index;
	});
	const project = {
		targets,
		monitors: stage.variables.score
			? [
					{
						id: "score",
						mode: "default",
						opcode: "data_variable",
						params: { VARIABLE: "Score" },
						spriteName: null,
						value: 0,
						width: 0,
						height: 0,
						x: 5,
						y: 5,
						visible: true,
						sliderMin: 0,
						sliderMax: 100,
						isDiscrete: true
					}
				]
			: [],
		extensions: [],
		meta: {
			semver: "3.0.0",
			vm: "15.1.1",
			agent: "Classes classroom project generator"
		}
	};
	const archive = zipSync(
		{ "project.json": strToU8(JSON.stringify(project)), ...assets },
		{ level: 6, mtime: new Date(2026, 0, 1) }
	);
	return { project, archive };
}

export async function generateProjects(output, teachers) {
	await mkdir(output, { recursive: true });
	if (teachers) await mkdir(teachers, { recursive: true });
	for (const lesson of lessons) {
		await writeFile(
			path.join(output, `${lesson.id}.sb3`),
			createProject(lesson.id).archive
		);
		if (teachers)
			await writeFile(
				path.join(teachers, `${lesson.id}-solution.sb3`),
				createProject(lesson.id, true).archive
			);
	}
	await writeFile(
		path.join(output, "catalog.json"),
		JSON.stringify(lessons, null, 2) + "\n"
	);
}
if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	const output =
		process.argv[2] ||
		fileURLToPath(
			new URL("../../public/scratch-projects/", import.meta.url)
		);
	await generateProjects(output, process.argv[3]);
	console.log(`Created ${lessons.length} Scratch starters in ${output}`);
}
