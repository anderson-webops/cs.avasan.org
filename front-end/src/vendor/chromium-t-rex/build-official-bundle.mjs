import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { build } from "esbuild";

const buildScriptPath = fileURLToPath(import.meta.url);
const vendorDirectory = path.dirname(buildScriptPath);
const compatibilityDirectory = path.join(vendorDirectory, "compat");
const upstreamDirectory = path.join(vendorDirectory, "upstream");
const outputPath = path.join(
	vendorDirectory,
	"generated",
	"chromium-t-rex-frame.js.txt"
);

const chromeImports = new Map([
	["chrome://resources/js/assert.js", "assert.ts"],
	["chrome://resources/js/load_time_data.js", "load-time-data.ts"]
]);

function assertVirtualPath(relativePath, label) {
	if (
		path.posix.isAbsolute(relativePath) ||
		relativePath === ".." ||
		relativePath.startsWith("../")
	) {
		throw new Error(`${label} escaped its reviewed source directory.`);
	}
	return relativePath;
}

function replaceExactlyOnce(source, expected, replacement, description) {
	const occurrences = source.split(expected).length - 1;
	if (occurrences !== 1) {
		throw new Error(
			`Expected one ${description} block in Chromium offline.ts; found ${occurrences}.`
		);
	}
	return source.replace(expected, replacement);
}

function removeChromeControllerHooks(source) {
	let adapted = replaceExactlyOnce(
		source,
		"\n    window.initializeEasterEggHighScore = this.initializeHighScore.bind(this);",
		"",
		"profile high-score initializer"
	);
	adapted = replaceExactlyOnce(
		adapted,
		`            if (window.errorPageController) {
              window.errorPageController.trackEasterEgg();
            }
`,
		"",
		"Chrome gameplay tracking"
	);
	adapted = replaceExactlyOnce(
		adapted,
		`      if (window.errorPageController) {
        window.errorPageController.updateEasterEggHighScore(this.highestScore);
      }
`,
		"",
		"Chrome high-score reconciliation"
	);
	adapted = replaceExactlyOnce(
		adapted,
		`    // Store the new high score in the profile.
    if (this.syncHighestScore && window.errorPageController) {
      if (resetScore) {
        window.errorPageController.resetEasterEggHighScore();
      } else {
        window.errorPageController.updateEasterEggHighScore(this.highestScore);
      }
    }
`,
		"",
		"Chrome high-score persistence"
	);
	return adapted;
}

const upstreamPlugin = {
	name: "chromium-t-rex-upstream",
	setup(buildApi) {
		buildApi.onResolve(
			{ filter: /^chromium:\/\/dino\/offline\.js$/ },
			() => ({
				namespace: "chromium-upstream",
				path: "dino_game/offline.ts.txt"
			})
		);

		buildApi.onResolve({ filter: /^chrome:\/\// }, args => {
			const shimPath = chromeImports.get(args.path);
			if (!shimPath)
				throw new Error(`Unsupported Chromium import: ${args.path}`);
			return { namespace: "chromium-compat", path: shimPath };
		});

		buildApi.onResolve(
			{ filter: /^\.\.?\//, namespace: "chromium-upstream" },
			args => {
				if (
					args.path === "../constants.js" &&
					args.importer === "dino_game/offline.ts.txt"
				) {
					return {
						namespace: "chromium-upstream",
						path: "parent-constants.ts.txt"
					};
				}

				const resolvedPath = path.posix.normalize(
					path.posix.join(
						path.posix.dirname(args.importer),
						args.path.replace(/\.js$/, ".ts.txt")
					)
				);
				return {
					namespace: "chromium-upstream",
					path: assertVirtualPath(resolvedPath, "Chromium import")
				};
			}
		);

		buildApi.onLoad(
			{ filter: /\.ts\.txt$/, namespace: "chromium-upstream" },
			async args => {
				const sourcePath = assertVirtualPath(
					args.path,
					"Chromium source"
				);
				let contents = await readFile(
					path.join(upstreamDirectory, sourcePath),
					"utf8"
				);
				if (sourcePath === "dino_game/offline.ts.txt") {
					contents = removeChromeControllerHooks(contents);
				}
				return {
					contents,
					loader: "ts"
				};
			}
		);

		buildApi.onLoad(
			{ filter: /\.ts$/, namespace: "chromium-compat" },
			async args => ({
				contents: await readFile(
					path.join(
						compatibilityDirectory,
						assertVirtualPath(args.path, "Compatibility import")
					),
					"utf8"
				),
				loader: "ts"
			})
		);
	}
};

export async function generateChromiumTrexBundle() {
	const entrySource = await readFile(
		path.join(vendorDirectory, "compat", "frame-entry.ts.txt"),
		"utf8"
	);
	const result = await build({
		banner: {
			js: [
				"/* Chromium T-Rex Runner, Chromium 151.0.7922.77",
				" * Commit ff37cfca210138f2a40b843b4a8195ab7e4fc7ff.",
				" * BSD license: /licenses/chromium-bsd-license.txt",
				" * Generated locally; see docs/third-party/chromium-t-rex.md.",
				" */"
			].join("\n")
		},
		bundle: true,
		charset: "utf8",
		entryPoints: ["chromium-t-rex-frame-entry"],
		format: "iife",
		legalComments: "inline",
		logLevel: "silent",
		plugins: [
			{
				name: "chromium-t-rex-entry",
				setup(buildApi) {
					buildApi.onResolve(
						{ filter: /^chromium-t-rex-frame-entry$/ },
						() => ({
							namespace: "chromium-entry",
							path: "entry.ts"
						})
					);
					buildApi.onLoad(
						{ filter: /^entry\.ts$/, namespace: "chromium-entry" },
						() => ({ contents: entrySource, loader: "ts" })
					);
				}
			},
			upstreamPlugin
		],
		sourcemap: false,
		target: ["es2020"],
		write: false
	});

	const output = result.outputFiles[0]?.text;
	if (!output) {
		throw new Error("Chromium T-Rex bundle generation produced no output.");
	}
	if (/<\/script/i.test(output)) {
		throw new Error(
			"Generated bundle cannot be safely embedded in srcdoc."
		);
	}

	for (const forbidden of [
		/\bfetch\s*\(/,
		/\bXMLHttpRequest\b/,
		/\bWebSocket\b/,
		/\bsendBeacon\b/,
		/\blocalStorage\b/,
		/\bsessionStorage\b/,
		/document\.cookie/,
		/errorPageController/,
		/initializeEasterEggHighScore/
	]) {
		if (forbidden.test(output)) {
			throw new Error(
				`Generated bundle contains forbidden API: ${forbidden}`
			);
		}
	}

	return output;
}

if (process.argv[1] && path.resolve(process.argv[1]) === buildScriptPath) {
	const output = await generateChromiumTrexBundle();
	await writeFile(outputPath, output, "utf8");
	console.log(`Wrote ${path.relative(process.cwd(), outputPath)}`);
}
