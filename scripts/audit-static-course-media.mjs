#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";

const staticMediaRequestModuleUrl = new URL(
	"./static-media-request.mjs",
	import.meta.url
).href;

const auditSource = String.raw`
import {
	existsSync,
	readFileSync,
	readdirSync,
	statSync
} from "node:fs";
import {
	extname,
	join,
	relative
} from "node:path";
import {
	courseCatalog,
	loadRawCourse
} from "@/stores/courses/index";
import {
	KNOWN_PENDING_STATIC_MEDIA_FILENAMES,
	canonicalStaticMediaUrl,
	hasPendingStaticMediaNotice,
	staticMediaFilename,
	staticMediaUrlsFromText
} from "@/stores/courses/staticMedia";
import { requestStaticMedia } from ${JSON.stringify(staticMediaRequestModuleUrl)};

const knownPending = new Set(KNOWN_PENDING_STATIC_MEDIA_FILENAMES);
const urls = new Map();
const scanRoots = [
	"back-end/.env.EXAMPLE",
	"back-end/src",
	"front-end/public",
	"front-end/src",
	"package.json"
];
const ignoredPathParts = new Set([
	"__snapshots__",
	"coverage",
	"dist",
	"node_modules",
	"playwright-report",
	"test-results"
]);
const courseSourceRoot = "front-end/src/stores/courses/";
const textFileExtensions = new Set([
	".css",
	".env",
	".example",
	".html",
	".js",
	".json",
	".md",
	".mjs",
	".ts",
	".tsx",
	".vue"
]);
const staticAssetPathPattern =
	/\.(?:avif|csv|gif|jpe?g|json|md|mov|mp4|pdf|png|svg|webm|zip)(?:[?#].*)?$/i;

function add(url, reference) {
	if (!url) return;
	const canonicalUrl = canonicalStaticMediaUrl(url);
	if (!canonicalUrl) return;
	const references = urls.get(canonicalUrl) ?? [];
	references.push({
		...reference,
		...(canonicalUrl !== url ? { originalUrl: url } : {})
	});
	urls.set(canonicalUrl, references);
}

function isScannableStaticAssetUrl(url) {
	try {
		return staticAssetPathPattern.test(new URL(url).pathname);
	} catch {
		return false;
	}
}

function shouldSkipPath(path) {
	const sourcePath = relative(process.cwd(), path).replaceAll("\\", "/");
	// Course media is audited through the five-entry published catalog above.
	// Dormant upstream course files are not part of this fork's asset contract.
	if (sourcePath.startsWith(courseSourceRoot)) return true;

	return path
		.split("/")
		.some(part => ignoredPathParts.has(part)) ||
		/\.(?:spec|test)\.[cm]?[jt]sx?$/.test(path);
}

function isTextFile(path) {
	return textFileExtensions.has(extname(path).toLowerCase());
}

function scanFile(path) {
	if (!isTextFile(path) || shouldSkipPath(path)) return;

	const content = readFileSync(path, "utf8");
	const sourcePath = relative(process.cwd(), path);

	for (const url of staticMediaUrlsFromText(content)) {
		if (!isScannableStaticAssetUrl(url)) continue;

		const line = content.slice(0, content.indexOf(url)).split("\n").length;
		add(url, {
			content,
			key: "source-file",
			source: sourcePath + ":" + line
		});
	}
}

function scanPath(path) {
	if (!existsSync(path) || shouldSkipPath(path)) return;

	const stats = statSync(path);
	if (stats.isDirectory()) {
		for (const entry of readdirSync(path)) {
			scanPath(join(path, entry));
		}
		return;
	}

	if (stats.isFile()) scanFile(path);
}

for (const entry of courseCatalog) {
	const course = await loadRawCourse(entry.id);
	if (!course) continue;

	for (const module of course.modules) {
		const items = [
			...module.curriculum,
			...module.supplementalProjects
		];

		for (const item of items) {
			const source = [entry.id, module.title, item.title].join(" / ");
			add(item.mediaLink, {
				content: item.content,
				key: "mediaLink",
				source
			});
			add(item.datasetLink, {
				content: item.content,
				key: "datasetLink",
				source
			});
			add(item.projectLink, {
				content: item.content,
				key: "projectLink",
				source
			});
			add(item.solutionLink, {
				content: item.content,
				key: "solutionLink",
				source
			});
			for (const url of staticMediaUrlsFromText(item.content)) {
				add(url, {
					content: item.content,
					key: "content",
					source
				});
			}
		}
	}
}

for (const root of scanRoots) {
	scanPath(join(process.cwd(), root));
}

const missing = [];
const available = [];

for (const [url, references] of [...urls].sort(([left], [right]) =>
	left.localeCompare(right)
)) {
	let status = 0;
	let ok = false;
	let error = "";

	try {
		const response = await requestStaticMedia(url);
		status = response.status;
		ok = response.ok || response.status === 206;
	} catch (err) {
		error = err instanceof Error ? err.message : String(err);
	}

	const filename = staticMediaFilename(url);
	const sourceIssues = references.flatMap(reference => {
		if (hasPendingStaticMediaNotice(reference.content, filename)) {
			return [];
		}

		return [
			{
				key: reference.key,
				source: reference.source
			}
		];
	});
	const row = {
		filename,
		isKnownPending: knownPending.has(filename),
		sourceCount: new Set(references.map(reference => reference.source))
			.size,
		sources: [...new Set(references.map(reference => reference.source))],
		status,
		url,
		...(sourceIssues.length ? { sourceIssues } : {}),
		...(error ? { error } : {})
	};

	if (ok) available.push(row);
	else missing.push(row);
}

const unknownMissing = missing.filter(row => !row.isKnownPending);
const unnotedPending = missing.filter(
	row => row.isKnownPending && row.sourceIssues?.length
);
console.log(
	JSON.stringify(
		{
			availableCount: available.length,
			checkedCount: urls.size,
			missing,
			missingCount: missing.length,
			unnotedPending,
			unknownMissing
		},
		null,
		2
	)
);

if (unknownMissing.length > 0 || unnotedPending.length > 0) {
	process.exitCode = 1;
}
`;

const tempDir = await mkdtemp(join(tmpdir(), "classes-static-media-"));
const auditFile = join(tempDir, "audit.ts");

try {
	await writeFile(auditFile, auditSource);

	const child = spawn("npm", ["exec", "-w", "front-end", "--", "vite-node", auditFile], {
		stdio: "inherit"
	});

	const exitCode = await new Promise((resolve, reject) => {
		child.once("error", reject);
		child.once("exit", code => resolve(code ?? 1));
	});

	process.exitCode = exitCode;
}
finally {
	await rm(tempDir, { force: true, recursive: true });
}
