import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
// This dependency check also runs independently of the application test runner.
// eslint-disable-next-line test/no-import-node-test
import test from "node:test";

const require = createRequire(import.meta.url);
const braces = require("braces");

const repository = join(import.meta.dirname, "..");
const nestingError = { name: "SyntaxError", message: /Brace nesting exceeds/ };

function nestedAst(depth) {
	let node = { type: "text", value: "x" };
	for (let index = 0; index < depth; index++) {
		node = { type: "root", nodes: [node] };
	}
	return node;
}

test("installed package is the reviewed source, not an unpatched registry copy", () => {
	assert.equal(require("braces/package.json").name, "@classes/braces");
	assert.equal(require("braces/package.json").version, "3.0.3-classes.1");
	for (const name of [
		"package.json",
		"LICENSE",
		"index.js",
		"lib/limits.js",
		"lib/parse.js",
		"lib/compile.js",
		"lib/expand.js",
		"lib/stringify.js",
		"lib/utils.js",
		"lib/constants.js"
	]) {
		assert.deepEqual(
			readFileSync(require.resolve(`braces/${name}`)),
			readFileSync(join(repository, "vendor/braces", name)),
			name
		);
	}
});

test("public parser and consumers reject deeply nested braces and parentheses", () => {
	for (const input of [
		`${"{".repeat(4096)}a,b${"}".repeat(4096)}`,
		`${"(".repeat(4096)}x${")".repeat(4096)}`,
		`${"{(".repeat(2000)}a,b${")}".repeat(2000)}`,
		`${"{".repeat(4096)}a..b,c`
	]) {
		for (const run of [
			braces,
			braces.create,
			braces.parse,
			braces.compile,
			braces.expand,
			braces.stringify,
			require("braces/lib/parse"),
			value => braces([value], { expand: true })
		]) {
			assert.throws(() => run(input), nestingError);
		}
		for (const run of [
			require("micromatch").braces,
			require("micromatch").braceExpand
		]) {
			// Micromatch short-circuits inputs without a complete brace group.
			if (input.includes("{") && input.includes("}")) {
				assert.throws(() => run(input), nestingError);
			} else {
				assert.deepEqual(run(input), [input]);
			}
		}
	}
});

test("the structural bound cannot be raised or disabled with parser options", () => {
	for (const pair of [
		["{", "}"],
		["(", ")"]
	]) {
		for (const depth of [127, 128, 129]) {
			const input = `${pair[0].repeat(depth)}x${pair[1].repeat(depth)}`;
			for (const run of [
				braces.parse,
				braces.compile,
				braces.expand,
				braces.stringify
			]) {
				if (depth === 127) {
					assert.doesNotThrow(() => run(input));
				} else {
					assert.throws(
						() =>
							run(input, {
								maxLength: Infinity,
								maxDepth: Infinity,
								depth: 0,
								rangeLimit: false
							}),
						nestingError
					);
				}
			}
		}
	}
});

test("public and direct walkers bound supplied, mutated, and cyclic ASTs", () => {
	for (const run of [
		braces.compile,
		braces.expand,
		braces.stringify,
		require("braces/lib/compile"),
		require("braces/lib/expand"),
		require("braces/lib/stringify")
	]) {
		assert.throws(() => run(nestedAst(12000)), nestingError);
		const cyclic = { type: "root", nodes: [] };
		cyclic.nodes.push(cyclic);
		assert.throws(() => run(cyclic), nestingError);
		const mutated = braces.parse("x");
		mutated.nodes.push(nestedAst(12000));
		assert.throws(() => run(mutated), nestingError);
		const shared = { type: "text", value: "x" };
		assert.deepEqual(
			run({ type: "root", nodes: [shared, shared] }),
			run === braces.expand || run === require("braces/lib/expand")
				? ["xx"]
				: "xx"
		);
	}
});

test("expansion bounds parent-only cycles and long parent chains", () => {
	for (const run of [braces.expand, require("braces/lib/expand")]) {
		for (const cycle of [true, false]) {
			const child = {
				type: "paren",
				nodes: [{ type: "text", value: "x" }]
			};
			if (cycle) {
				child.parent = child;
			} else {
				let parent = child;
				for (let index = 0; index < 200; index++) {
					parent.parent = { type: "paren" };
					parent = parent.parent;
				}
			}
			assert.throws(
				() => run({ type: "root", nodes: [child] }),
				nestingError
			);
		}
	}
});

test("expansion and flattening bound cyclic array values", () => {
	const value = [];
	value.push(value);
	assert.throws(
		() =>
			braces.expand({
				type: "root",
				nodes: [{ type: "text", value }]
			}),
		nestingError
	);
	assert.throws(
		() => require("braces/lib/utils").flatten(value),
		nestingError
	);
});

test("ordinary options, recovery, and literal characters retain upstream behavior", () => {
	assert.deepEqual(braces.expand("src/{pages,components}/file{01..03}.js"), [
		"src/pages/file01.js",
		"src/pages/file02.js",
		"src/pages/file03.js",
		"src/components/file01.js",
		"src/components/file02.js",
		"src/components/file03.js"
	]);
	assert.deepEqual(
		braces(["{a,b}", "{b,c}"], { expand: true, nodupes: true }),
		["a", "b", "c"]
	);
	assert.deepEqual(
		braces.expand("{,a,a}", { noempty: true, nodupes: true }),
		["a"]
	);
	assert.deepEqual(
		braces.expand("{1..3}", { transform: value => `v${value}` }),
		["v1", "v2", "v3"]
	);
	assert.throws(() => braces.expand("{1..1001}"), /range limit/);
	assert.equal(braces.compile("a/{b,c}/d"), "a/(b|c)/d");
	assert.equal(braces.compile("{a", { escapeInvalid: true }), "\\{a");
	for (const input of ["{a", "(a", "((a)", "$" + "{a,b}"]) {
		assert.equal(braces.stringify(input), input);
		assert.deepEqual(braces.expand(input), [input]);
	}
	const literal = "{".repeat(2000);
	assert.equal(braces.stringify(`"${literal}"`), literal);
	assert.equal(braces.stringify("\\{".repeat(2000)), literal);
	assert.equal(
		braces.stringify("\\{".repeat(2000), { keepEscaping: true }),
		"\\{".repeat(2000)
	);
	assert.equal(braces.stringify(`[${literal}]`), `[${literal}]`);
	assert.equal(braces.stringify("'a,b'", { keepQuotes: true }), "'a,b'");
});

test("micromatch and fast-glob preserve real build patterns", () => {
	const micromatch = require("micromatch");
	assert.deepEqual(micromatch(["a.ts", "b.vue", "c.css"], "*.{ts,vue}"), [
		"a.ts",
		"b.vue"
	]);
	const fastGlob = require("fast-glob");
	assert.deepEqual(
		fastGlob
			.generateTasks(["src/{pages,components}/**/*.{vue,ts}"])
			.flatMap(task => task.positive)
			.sort(),
		[
			"src/components/**/*.ts",
			"src/components/**/*.vue",
			"src/pages/**/*.ts",
			"src/pages/**/*.vue"
		]
	);
});
