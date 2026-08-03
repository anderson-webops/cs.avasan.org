import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import {
	assetHttpStatusError,
	runAssetNetworkRequest
} from "./asset-network-retry.mjs";

const DEFAULT_ASSETS_ZIP_URL = "https://static.cs.avasan.org/assets.zip";
const REVIEWED_ASSETS_ZIP_BYTES = 14_676_489;
const REVIEWED_ASSETS_ZIP_SHA256 =
	"6ab65a710032ca71cf957bfd56f8b60579d66c94395bbc34fc433be4bb0f92a1";
const ASSET_REQUEST_TIMEOUT_MS = 60_000;
const ASSET_RETRY_DELAYS_MS = [1_000, 3_000];
const ZIP_HEADER = [0x50, 0x4b];
const ASSET_PATH_RE = /^(?:images|music|sounds)\/(?:[^/]+\/)*[^/]+\.[\dA-Z]+$/i;
const IGNORED_ZIP_PATH_RE =
	/(?:^|\/)(?:__MACOSX|\.DS_Store|Thumbs\.db|desktop\.ini)(?:\/|$)/i;
const IMAGE_EXTENSION_RE = /\.(?:gif|jpe?g|png|svg|webp)$/i;
const GIF_SIGNATURE = "GIF";
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const SVG_DIMENSION_RE = /\b(?:width|height)=["']?([\d.]+)(?:px)?["']?/gi;
const SVG_VIEWBOX_RE =
	/\bviewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i;
const MIME_TYPES = new Map([
	[".gif", "image/gif"],
	[".jpg", "image/jpeg"],
	[".jpeg", "image/jpeg"],
	[".mp3", "audio/mpeg"],
	[".ogg", "audio/ogg"],
	[".png", "image/png"],
	[".svg", "image/svg+xml"],
	[".wav", "audio/wav"],
	[".webp", "image/webp"]
]);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontEndDir = path.resolve(scriptDir, "..");
const assetsOutputDir = path.join(
	frontEndDir,
	"public",
	"python-ide",
	"assets"
);
const manifestPath = path.join(assetsOutputDir, "manifest.json");
const ideManifestPath = path.join(
	frontEndDir,
	"public",
	"ide",
	"assets",
	"manifest.json"
);
const stalePublicZipPath = path.join(
	frontEndDir,
	"public",
	"python-ide",
	"assets.zip"
);
const cacheDir = path.join(frontEndDir, ".cache");
const cachePath = path.join(cacheDir, "python-ide-assets.json");
const cacheZipPath = path.join(cacheDir, "python-ide-assets.zip");
const sourceUrl =
	process.env.PYTHON_IDE_ASSETS_ZIP_URL || DEFAULT_ASSETS_ZIP_URL;
const forceRefresh =
	process.argv.includes("--force") ||
	process.env.PYTHON_IDE_ASSETS_REFRESH === "always";
const skipDownload = process.env.PYTHON_IDE_ASSETS_DOWNLOAD === "skip";

await stagePythonIdeAssets();

async function stagePythonIdeAssets() {
	await rm(stalePublicZipPath, { force: true });

	if (skipDownload) {
		await mirrorIdeManifest();
		console.log(
			"[python-ide-assets] skipped by PYTHON_IDE_ASSETS_DOWNLOAD=skip"
		);
		return;
	}

	const [localInfo, remoteInfo] = await Promise.all([
		localAssetInfo(),
		remoteAssetInfo().catch(error => {
			console.warn(
				`[python-ide-assets] could not read remote metadata: ${formatError(error)}`
			);
			return null;
		})
	]);

	if (!forceRefresh && isCurrent(localInfo, remoteInfo)) {
		await mirrorIdeManifest();
		console.log(
			`[python-ide-assets] using extracted ${relativeManifestPath()}`
		);
		return;
	}

	try {
		const { bytes, response } = await withAssetNetworkRetry(
			"asset download",
			async signal => {
				const response = await fetch(sourceUrl, { signal });
				if (!response.ok) {
					throw assetHttpStatusError("download", response.status);
				}
				return {
					bytes: await readReviewedAssetArchive(response),
					response
				};
			}
		);

		await mkdir(cacheDir, { recursive: true });
		const tempZipPath = `${cacheZipPath}.tmp`;
		await writeFile(tempZipPath, bytes);
		await rename(tempZipPath, cacheZipPath);

		const manifest = await extractAssets(bytes);
		await writeFile(
			cachePath,
			`${JSON.stringify(
				{
					assetCount: manifest.assets.length,
					contentLength:
						response.headers.get("content-length") ??
						String(bytes.byteLength),
					downloadedAt: new Date().toISOString(),
					etag: response.headers.get("etag"),
					lastModified: response.headers.get("last-modified"),
					sha256: REVIEWED_ASSETS_ZIP_SHA256,
					sourceUrl
				},
				null,
				"\t"
			)}\n`
		);

		console.log(
			`[python-ide-assets] extracted ${manifest.assets.length} files from ${formatBytes(bytes.byteLength)} into ${relativeAssetsPath()}`
		);
	} catch (error) {
		if (
			localInfo.exists &&
			localInfo.cache?.sha256 === REVIEWED_ASSETS_ZIP_SHA256
		) {
			await mirrorIdeManifest();
			console.warn(
				`[python-ide-assets] download failed, using existing ${relativeManifestPath()}: ${formatError(error)}`
			);
			return;
		}

		throw error;
	}
}

async function extractAssets(zipBytes) {
	const files = unzipSync(zipBytes);
	const assets = [];

	await rm(assetsOutputDir, { force: true, recursive: true });
	await mkdir(assetsOutputDir, { recursive: true });

	for (const [rawName, bytes] of Object.entries(files)) {
		const name = normalizeZipAssetName(rawName);
		if (!name || !ASSET_PATH_RE.test(name)) continue;
		if (isIgnoredZipAssetName(name)) continue;

		const outputPath = path.join(assetsOutputDir, name);
		if (!outputPath.startsWith(`${assetsOutputDir}${path.sep}`)) continue;

		const mimeType = mimeTypeFor(name);
		if (!mimeType) continue;

		await mkdir(path.dirname(outputPath), { recursive: true });
		await writeFile(outputPath, bytes);

		const dimensions = imageDimensions(name, bytes);
		assets.push({
			byteLength: bytes.byteLength,
			height: dimensions?.height,
			mimeType,
			name,
			url: `/python-ide/assets/${encodeAssetPath(name)}`,
			width: dimensions?.width
		});
	}

	assets.sort((first, second) => first.name.localeCompare(second.name));

	const manifest = {
		assets,
		generatedAt: new Date().toISOString(),
		sourceUrl,
		version: 1
	};
	await writeFile(manifestPath, `${JSON.stringify(manifest, null, "\t")}\n`);
	await writeIdeManifest(manifest);
	return manifest;
}

async function mirrorIdeManifest() {
	const manifest = await readJson(manifestPath).catch(() => null);
	if (manifest) await writeIdeManifest(manifest);
}

async function writeIdeManifest(manifest) {
	await mkdir(path.dirname(ideManifestPath), { recursive: true });
	await writeFile(
		ideManifestPath,
		`${JSON.stringify(manifest, null, "\t")}\n`
	);
}

async function localAssetInfo() {
	const [fileStat, cache] = await Promise.all([
		stat(manifestPath).catch(() => null),
		readJson(cachePath).catch(() => null)
	]);

	return {
		cache,
		exists: Boolean(fileStat)
	};
}

async function remoteAssetInfo() {
	const response = await withAssetNetworkRetry(
		"asset metadata request",
		async signal => {
			const response = await fetch(sourceUrl, {
				method: "HEAD",
				signal
			});
			if (!response.ok) {
				throw assetHttpStatusError("metadata request", response.status);
			}
			return response;
		}
	);

	return {
		contentLength: response.headers.get("content-length"),
		etag: response.headers.get("etag"),
		lastModified: response.headers.get("last-modified"),
		sourceUrl
	};
}

async function withAssetNetworkRetry(label, operation) {
	return await runAssetNetworkRequest(label, operation, {
		onRetry: ({ attempt, delayMs, error, maximumAttempts }) => {
			console.warn(
				`[python-ide-assets] ${label} attempt ${attempt}/${maximumAttempts} failed; retrying in ${delayMs} ms: ${formatError(error)}`
			);
		},
		retryDelaysMs: ASSET_RETRY_DELAYS_MS,
		timeoutMs: ASSET_REQUEST_TIMEOUT_MS
	});
}

async function readJson(filePath) {
	return JSON.parse(await readFile(filePath, "utf8"));
}

function isCurrent(localInfo, remoteInfo) {
	if (!localInfo.exists || !remoteInfo) return false;

	return (
		localInfo.cache?.sha256 === REVIEWED_ASSETS_ZIP_SHA256 &&
		localInfo.cache?.sourceUrl === remoteInfo.sourceUrl &&
		(!remoteInfo.contentLength ||
			localInfo.cache?.contentLength === remoteInfo.contentLength) &&
		(!remoteInfo.etag || localInfo.cache?.etag === remoteInfo.etag) &&
		(!remoteInfo.lastModified ||
			localInfo.cache?.lastModified === remoteInfo.lastModified)
	);
}

async function readReviewedAssetArchive(response) {
	const contentEncoding = response.headers.get("content-encoding");
	if (contentEncoding && contentEncoding !== "identity") {
		throw new Error(
			`downloaded asset pack used unsupported content encoding ${contentEncoding}`
		);
	}
	const declaredLength = response.headers.get("content-length");
	if (
		declaredLength &&
		(!/^\d+$/.test(declaredLength) ||
			Number(declaredLength) !== REVIEWED_ASSETS_ZIP_BYTES)
	) {
		throw new Error(
			`downloaded asset pack declared unexpected size ${declaredLength}; expected ${REVIEWED_ASSETS_ZIP_BYTES}`
		);
	}
	if (!response.body) {
		throw new Error("downloaded asset pack response had no readable body");
	}

	const reader = response.body.getReader();
	const chunks = [];
	const hash = createHash("sha256");
	let byteLength = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk =
				value instanceof Uint8Array ? value : new Uint8Array(value);
			byteLength += chunk.byteLength;
			if (byteLength > REVIEWED_ASSETS_ZIP_BYTES) {
				await reader
					.cancel("reviewed Python asset archive size exceeded")
					.catch(() => undefined);
				throw new Error(
					`downloaded asset pack exceeded ${REVIEWED_ASSETS_ZIP_BYTES} bytes`
				);
			}
			chunks.push(chunk);
			hash.update(chunk);
		}
	} finally {
		reader.releaseLock();
	}
	if (byteLength !== REVIEWED_ASSETS_ZIP_BYTES) {
		throw new Error(
			`downloaded asset pack has unexpected size ${byteLength}; expected ${REVIEWED_ASSETS_ZIP_BYTES}`
		);
	}
	const sha256 = hash.digest("hex");
	if (sha256 !== REVIEWED_ASSETS_ZIP_SHA256) {
		throw new Error(
			`downloaded asset pack failed SHA-256 verification; expected ${REVIEWED_ASSETS_ZIP_SHA256}`
		);
	}

	const bytes = new Uint8Array(byteLength);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	if (bytes[0] !== ZIP_HEADER[0] || bytes[1] !== ZIP_HEADER[1]) {
		throw new Error("downloaded asset pack does not look like a zip file");
	}
	return bytes;
}

function normalizeZipAssetName(filePath) {
	return filePath
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\.\/+/, "");
}

function isIgnoredZipAssetName(filePath) {
	return (
		IGNORED_ZIP_PATH_RE.test(filePath) ||
		filePath.split("/").some(part => part.startsWith("."))
	);
}

function encodeAssetPath(filePath) {
	return filePath.split("/").map(encodeURIComponent).join("/");
}

function mimeTypeFor(filePath) {
	const extension = path.extname(filePath).toLowerCase();
	return MIME_TYPES.get(extension) ?? "";
}

function imageDimensions(name, bytes) {
	if (!IMAGE_EXTENSION_RE.test(name)) return null;
	if (isPng(bytes)) {
		return {
			height: readUint32BE(bytes, 20),
			width: readUint32BE(bytes, 16)
		};
	}
	if (isGif(bytes)) {
		return {
			height: readUint16LE(bytes, 8),
			width: readUint16LE(bytes, 6)
		};
	}
	if (/\.svg$/i.test(name)) return svgDimensions(strFromU8(bytes));
	if (/\.jpe?g$/i.test(name)) return jpegDimensions(bytes);
	return null;
}

function isPng(bytes) {
	return PNG_SIGNATURE.every((value, index) => bytes[index] === value);
}

function isGif(bytes) {
	return strFromU8(bytes.subarray(0, 3)) === GIF_SIGNATURE;
}

function readUint16LE(bytes, offset) {
	return bytes[offset] + ((bytes[offset + 1] ?? 0) << 8);
}

function readUint32BE(bytes, offset) {
	return (
		(bytes[offset] ?? 0) * 0x1000000 +
		((bytes[offset + 1] ?? 0) << 16) +
		((bytes[offset + 2] ?? 0) << 8) +
		(bytes[offset + 3] ?? 0)
	);
}

function jpegDimensions(bytes) {
	let offset = 2;
	while (offset + 9 < bytes.length) {
		if (bytes[offset] !== 0xff) {
			offset += 1;
			continue;
		}

		const marker = bytes[offset + 1] ?? 0;
		const length =
			((bytes[offset + 2] ?? 0) << 8) + (bytes[offset + 3] ?? 0);
		if (
			marker >= 0xc0 &&
			marker <= 0xcf &&
			![0xc4, 0xc8, 0xcc].includes(marker)
		) {
			return {
				height:
					((bytes[offset + 5] ?? 0) << 8) + (bytes[offset + 6] ?? 0),
				width:
					((bytes[offset + 7] ?? 0) << 8) + (bytes[offset + 8] ?? 0)
			};
		}

		offset += Math.max(2, length + 2);
	}
	return null;
}

function svgDimensions(svg) {
	const viewBoxMatch = svg.match(SVG_VIEWBOX_RE);
	if (viewBoxMatch?.[1] && viewBoxMatch[2]) {
		return {
			height: Number(viewBoxMatch[2]),
			width: Number(viewBoxMatch[1])
		};
	}

	const dimensions = [...svg.matchAll(SVG_DIMENSION_RE)]
		.map(match => Number(match[1]))
		.filter(Number.isFinite);
	if (dimensions.length >= 2) {
		return {
			height: dimensions[1],
			width: dimensions[0]
		};
	}
	return null;
}

function relativeAssetsPath() {
	return path.relative(frontEndDir, assetsOutputDir);
}

function relativeManifestPath() {
	return path.relative(frontEndDir, manifestPath);
}

function formatBytes(bytes) {
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatError(error) {
	return error instanceof Error ? error.message : String(error);
}
