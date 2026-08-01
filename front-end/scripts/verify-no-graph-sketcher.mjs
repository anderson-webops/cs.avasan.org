import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDistDir = path.resolve(__dirname, "../dist");
const forbiddenPathFragments = [
	".graphsketch",
	".ograph",
	"graph-sketcher",
	"graphsketcher"
];
const forbiddenRuntimeMarkers = [
	".graphsketch",
	".ograph",
	"cs-avasan-graph-sketcher-session-v1",
	"graphsketcher-omni-source-license",
	"graphsketcherarchive.worker",
	"graphsketcherworkspace"
];
const textExtensions = new Set([
	".css",
	".html",
	".js",
	".json",
	".map",
	".mjs",
	".svg",
	".txt",
	".xml"
]);

async function filesUnder(directory) {
	const files = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await filesUnder(entryPath)));
		} else if (entry.isFile()) {
			files.push(entryPath);
		}
	}
	return files;
}

export async function retiredGraphSketcherArtifacts(
	targetDistDir = defaultDistDir
) {
	const findings = [];
	for (const filePath of await filesUnder(targetDistDir)) {
		const relativePath = path.relative(targetDistDir, filePath);
		const normalizedPath = relativePath
			.split(path.sep)
			.join("/")
			.toLowerCase();
		if (
			forbiddenPathFragments.some(fragment =>
				normalizedPath.includes(fragment)
			)
		) {
			findings.push(`path:${relativePath}`);
			continue;
		}

		if (!textExtensions.has(path.extname(filePath).toLowerCase())) continue;
		const source = (await readFile(filePath, "utf8")).toLowerCase();
		if (forbiddenRuntimeMarkers.some(marker => source.includes(marker))) {
			findings.push(`content:${relativePath}`);
		}
	}
	return findings.sort();
}

export async function verifyNoRetiredGraphSketcherArtifacts(
	targetDistDir = defaultDistDir
) {
	const findings = await retiredGraphSketcherArtifacts(targetDistDir);
	if (findings.length) {
		throw new Error(
			`The CS build still contains retired Graph Sketcher artifacts:\n${findings.join("\n")}`
		);
	}
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	await verifyNoRetiredGraphSketcherArtifacts();
	console.log(
		"[verify-no-graph-sketcher] no retired Graph Sketcher artifacts found"
	);
}
