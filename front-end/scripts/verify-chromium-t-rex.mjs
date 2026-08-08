import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateChromiumTrexBundle } from "../src/vendor/chromium-t-rex/build-official-bundle.mjs";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const frontendDirectory = resolve(scriptsDirectory, "..");
const vendorDirectory = resolve(frontendDirectory, "src/vendor/chromium-t-rex");
const expectedVersion = "151.0.7922.77";
const expectedCommit = "ff37cfca210138f2a40b843b4a8195ab7e4fc7ff";

function assertion(condition, message) {
	if (!condition) throw new Error(message);
}

const checksumText = await readFile(
	resolve(vendorDirectory, "UPSTREAM_SHA256SUMS"),
	"utf8"
);
const entries = checksumText
	.trim()
	.split("\n")
	.map(line => {
		const match = /^(?<hash>[0-9a-f]{64})  (?<path>.+)$/u.exec(line);
		assertion(match?.groups, `Invalid Chromium checksum line: ${line}`);
		return match.groups;
	});

assertion(entries.length === 30, "Expected 30 pinned Chromium files.");
assertion(
	new Set(entries.map(entry => entry.path)).size === entries.length,
	"Chromium checksum paths must be unique."
);
assertion(
	entries.filter(entry => entry.path.startsWith("upstream/dino_game/"))
		.length === 19,
	"Expected all 19 Chromium dino_game source modules."
);

for (const entry of entries) {
	const absolutePath = resolve(vendorDirectory, entry.path);
	const pathFromFrontend = relative(frontendDirectory, absolutePath);
	assertion(
		pathFromFrontend !== "" && !pathFromFrontend.startsWith(".."),
		`Chromium checksum escapes the frontend directory: ${entry.path}`
	);
	const contents = await readFile(absolutePath);
	const actualHash = createHash("sha256").update(contents).digest("hex");
	assertion(
		actualHash === entry.hash,
		`Chromium checksum mismatch: ${entry.path}`
	);
}

const [entrypoint, generatedBundle, provenance, license] = await Promise.all([
	readFile(resolve(vendorDirectory, "index.ts"), "utf8"),
	readFile(
		resolve(vendorDirectory, "generated/chromium-t-rex-frame.js.txt"),
		"utf8"
	),
	readFile(
		resolve(frontendDirectory, "../docs/third-party/chromium-t-rex.md"),
		"utf8"
	),
	readFile(
		resolve(frontendDirectory, "public/licenses/chromium-bsd-license.txt"),
		"utf8"
	)
]);

const regeneratedBundle = await generateChromiumTrexBundle();
assertion(
	generatedBundle === regeneratedBundle,
	"The committed Chromium browser bundle is not reproducible from the pinned source and reviewed adapters."
);
assertion(
	!/(?:[A-Za-z]:\\|\/(?:Users|home|private|srv|tmp)\/)/u.test(
		generatedBundle
	),
	"The Chromium browser bundle exposes a checkout-specific absolute path."
);

for (const [label, contents] of [
	["entrypoint", entrypoint],
	["generated bundle", generatedBundle],
	["provenance", provenance]
]) {
	assertion(
		contents.includes(expectedVersion) && contents.includes(expectedCommit),
		`Chromium ${label} does not identify the pinned stable source.`
	);
}

assertion(
	entrypoint.includes('frame.setAttribute("sandbox", "allow-scripts")') &&
		!entrypoint.includes('"allow-scripts allow-same-origin"'),
	"Chromium frame must remain script-only and opaque."
);
assertion(
	entrypoint.includes("connect-src 'none'") &&
		entrypoint.includes("img-src data:") &&
		entrypoint.includes("media-src data:"),
	"Chromium frame CSP must remain local and connection-free."
);

for (const forbidden of [
	/\bfetch\s*\(/u,
	/\bXMLHttpRequest\b/u,
	/\bWebSocket\b/u,
	/\bsendBeacon\b/u,
	/\blocalStorage\b/u,
	/\bsessionStorage\b/u,
	/document\.cookie/u,
	/errorPageController/u,
	/initializeEasterEggHighScore/u
]) {
	assertion(
		!forbidden.test(generatedBundle),
		`Chromium frame contains forbidden runtime capability: ${forbidden}`
	);
}

assertion(
	license.includes("Redistribution and use in source and binary forms") &&
		license.includes("THIS SOFTWARE IS PROVIDED") &&
		license.includes("Neither the name of Google LLC"),
	"The public Chromium BSD license is incomplete."
);
assertion(
	provenance.includes("preserved byte for byte") &&
		provenance.includes("Chromium and Google do not endorse") &&
		/There is no game\s+analytics/u.test(provenance),
	"Chromium provenance does not preserve the reviewed adaptation boundary."
);

console.log(
	`Verified Chromium T-Rex Runner ${expectedVersion} at ${expectedCommit}.`
);
