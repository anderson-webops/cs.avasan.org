import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_ASSETS_ZIP_URL = "https://static.classes.jacobdanderson.net/assets.zip";
const MINIMUM_ZIP_BYTES = 1024;
const ZIP_HEADER = [0x50, 0x4b];

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontEndDir = path.resolve(scriptDir, "..");
const outputPath = path.join(frontEndDir, "public", "python-ide", "assets.zip");
const cachePath = path.join(frontEndDir, ".cache", "python-ide-assets.json");
const sourceUrl = process.env.PYTHON_IDE_ASSETS_ZIP_URL || DEFAULT_ASSETS_ZIP_URL;
const forceRefresh =
	process.argv.includes("--force") ||
	process.env.PYTHON_IDE_ASSETS_REFRESH === "always";
const skipDownload = process.env.PYTHON_IDE_ASSETS_DOWNLOAD === "skip";

await stagePythonIdeAssets();

async function stagePythonIdeAssets() {
	if (skipDownload) {
		console.log("[python-ide-assets] skipped by PYTHON_IDE_ASSETS_DOWNLOAD=skip");
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
		console.log(`[python-ide-assets] using cached ${relativeOutputPath()}`);
		return;
	}

	try {
		const response = await fetch(sourceUrl);
		if (!response.ok) {
			throw new Error(`download failed with status ${response.status}`);
		}

		const bytes = new Uint8Array(await response.arrayBuffer());
		assertLooksLikeZip(bytes);

		await mkdir(path.dirname(outputPath), { recursive: true });
		await mkdir(path.dirname(cachePath), { recursive: true });

		const tempPath = `${outputPath}.tmp`;
		await writeFile(tempPath, bytes);
		await rename(tempPath, outputPath);
		await writeFile(
			cachePath,
			`${JSON.stringify({
				contentLength:
					response.headers.get("content-length") ?? String(bytes.byteLength),
				downloadedAt: new Date().toISOString(),
				etag: response.headers.get("etag"),
				lastModified: response.headers.get("last-modified"),
				sourceUrl
			}, null, "\t")}\n`
		);

		console.log(
			`[python-ide-assets] downloaded ${formatBytes(bytes.byteLength)} to ${relativeOutputPath()}`
		);
	}
	catch (error) {
		if (localInfo.exists) {
			console.warn(
				`[python-ide-assets] download failed, using existing ${relativeOutputPath()}: ${formatError(error)}`
			);
			return;
		}

		throw error;
	}
}

async function localAssetInfo() {
	const [fileStat, cache] = await Promise.all([
		stat(outputPath).catch(() => null),
		readJson(cachePath).catch(() => null)
	]);

	return {
		cache,
		exists: Boolean(fileStat),
		size: fileStat?.size ?? 0
	};
}

async function remoteAssetInfo() {
	const response = await fetch(sourceUrl, { method: "HEAD" });
	if (!response.ok) {
		throw new Error(`metadata request failed with status ${response.status}`);
	}

	return {
		contentLength: response.headers.get("content-length"),
		etag: response.headers.get("etag"),
		lastModified: response.headers.get("last-modified"),
		sourceUrl
	};
}

async function readJson(filePath) {
	return JSON.parse(await readFile(filePath, "utf8"));
}

function isCurrent(localInfo, remoteInfo) {
	if (!localInfo.exists || !remoteInfo) return false;

	const remoteLength = Number(remoteInfo.contentLength);
	if (Number.isFinite(remoteLength) && remoteLength !== localInfo.size) return false;

	return (
		localInfo.cache?.sourceUrl === remoteInfo.sourceUrl &&
		(!remoteInfo.etag || localInfo.cache?.etag === remoteInfo.etag) &&
		(!remoteInfo.lastModified ||
			localInfo.cache?.lastModified === remoteInfo.lastModified)
	);
}

function assertLooksLikeZip(bytes) {
	if (
		bytes.byteLength < MINIMUM_ZIP_BYTES ||
		bytes[0] !== ZIP_HEADER[0] ||
		bytes[1] !== ZIP_HEADER[1]
	) {
		throw new Error("downloaded asset pack does not look like a zip file");
	}
}

function relativeOutputPath() {
	return path.relative(frontEndDir, outputPath);
}

function formatBytes(bytes) {
	return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatError(error) {
	return error instanceof Error ? error.message : String(error);
}
