import { getPythonIdeFileMimeType } from "@/modules/pythonIde";

export const pythonIdeCourseAssetsManifestUrl =
	"/python-ide/assets/manifest.json";
export const pythonIdeCourseAssetsZipUrl = "/api/python-assets/assets.zip";
export const pythonIdeCourseAssetZipSourceUrls = [pythonIdeCourseAssetsZipUrl];

const ASSET_PATH_RE = /^(?:images|music|sounds)\/[^/].+\.[\dA-Z]+$/i;
const IGNORED_ZIP_PATH_RE =
	/(?:^|\/)(?:__MACOSX|\.DS_Store|Thumbs\.db|desktop\.ini)(?:\/|$)/i;
interface AssetFetcherResponse {
	arrayBuffer: () => Promise<ArrayBuffer>;
	json?: () => Promise<unknown>;
	ok: boolean;
	status: number;
}

export interface LoadPythonIdeCourseAssetPackOptions {
	fetcher?: (url: string) => Promise<AssetFetcherResponse>;
	manifestUrl?: string;
	manifestUrls?: string[];
	url?: string;
	urls?: string[];
}

export interface PythonIdeCourseAsset {
	bytes?: Uint8Array;
	height?: number;
	mimeType: string;
	name: string;
	url?: string;
	width?: number;
}

export interface PythonIdeCourseAssetPack {
	assets: Map<string, PythonIdeCourseAsset>;
	sourceUrl: string;
}

let courseAssetPackPromise: Promise<PythonIdeCourseAssetPack> | null = null;
const assetObjectUrls = new Map<PythonIdeCourseAsset, string>();

export function resetPythonIdeCourseAssetPackCache() {
	courseAssetPackPromise = null;
	for (const url of assetObjectUrls.values()) URL.revokeObjectURL(url);
	assetObjectUrls.clear();
}

export async function loadPythonIdeCourseAssetPack(
	options: LoadPythonIdeCourseAssetPackOptions = {}
) {
	if (courseAssetPackPromise) return courseAssetPackPromise;

	const manifestUrls = options.manifestUrl
		? [options.manifestUrl]
		: (options.manifestUrls ?? [pythonIdeCourseAssetsManifestUrl]);
	const zipSourceUrls = options.url
		? [options.url]
		: (options.urls ?? pythonIdeCourseAssetZipSourceUrls);
	const fetcher = options.fetcher ?? window.fetch.bind(window);
	courseAssetPackPromise = (async () => {
		const failures: string[] = [];

		for (const sourceUrl of manifestUrls) {
			try {
				const response = await fetcher(sourceUrl);
				if (!response.ok) {
					failures.push(`${sourceUrl} returned ${response.status}`);
					continue;
				}

				return parsePythonIdeCourseAssetManifest(
					await readAssetManifestResponse(response),
					sourceUrl
				);
			} catch (error) {
				failures.push(
					`${sourceUrl} failed: ${formatAssetLoadError(error)}`
				);
			}
		}

		for (const sourceUrl of zipSourceUrls) {
			try {
				const response = await fetcher(sourceUrl);
				if (!response.ok) {
					failures.push(`${sourceUrl} returned ${response.status}`);
					continue;
				}

				return await parsePythonIdeCourseAssetZip(
					new Uint8Array(await response.arrayBuffer()),
					sourceUrl
				);
			} catch (error) {
				failures.push(
					`${sourceUrl} failed: ${formatAssetLoadError(error)}`
				);
			}
		}

		throw new Error(
			`Unable to load PyGame Zero assets (${failures.join("; ") || "no asset sources configured"}).`
		);
	})().catch(error => {
		courseAssetPackPromise = null;
		throw error;
	});

	return courseAssetPackPromise;
}

export function parsePythonIdeCourseAssetManifest(
	manifest: unknown,
	sourceUrl = pythonIdeCourseAssetsManifestUrl
): PythonIdeCourseAssetPack {
	const assets = new Map<string, PythonIdeCourseAsset>();

	if (!isCourseAssetManifest(manifest)) return { assets, sourceUrl };

	for (const manifestAsset of manifest.assets) {
		const name = normalizeZipAssetName(manifestAsset.name);
		if (!name || !ASSET_PATH_RE.test(name)) continue;
		if (isIgnoredZipAssetName(name)) continue;

		const mimeType =
			manifestAsset.mimeType || getPythonIdeFileMimeType(name);
		if (!mimeType || !manifestAsset.url) continue;

		assets.set(normalizePythonIdeAssetLookupPath(name), {
			height: numberOrUndefined(manifestAsset.height),
			mimeType,
			name,
			url: manifestAsset.url,
			width: numberOrUndefined(manifestAsset.width)
		});
	}

	return { assets, sourceUrl };
}

export async function parsePythonIdeCourseAssetZip(
	zipBytes: Uint8Array,
	sourceUrl = pythonIdeCourseAssetsZipUrl
): Promise<PythonIdeCourseAssetPack> {
	const { parsePythonIdeCourseAssetZipBytes } =
		await import("@/modules/pythonIdeCourseAssetZip");
	return parsePythonIdeCourseAssetZipBytes(zipBytes, sourceUrl);
}

export function normalizePythonIdeAssetLookupPath(path: string) {
	return path.trim().replaceAll("\\", "/").replace(/^\/+/, "").toLowerCase();
}

export function pythonIdeAssetCandidateNames(
	folder: "images" | "music" | "sounds",
	name: string,
	extensions: string[]
) {
	const normalized = name
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\/+/, "")
		.replace(/^images\/|^music\/|^sounds\//i, "");
	if (!normalized) return [];
	if (/\.[\dA-Z]+$/i.test(normalized)) {
		return [normalizePythonIdeAssetLookupPath(`${folder}/${normalized}`)];
	}

	return extensions.map(extension =>
		normalizePythonIdeAssetLookupPath(`${folder}/${normalized}${extension}`)
	);
}

export function findPythonIdeCourseAsset(
	pack: PythonIdeCourseAssetPack | null,
	candidateNames: Iterable<string>
) {
	if (!pack) return null;
	for (const candidateName of candidateNames) {
		const asset = pack.assets.get(
			normalizePythonIdeAssetLookupPath(candidateName)
		);
		if (asset) return asset;
	}
	return null;
}

export function getPythonIdeCourseAssetObjectUrl(asset: PythonIdeCourseAsset) {
	if (asset.url) return asset.url;

	const existing = assetObjectUrls.get(asset);
	if (existing) return existing;
	if (!asset.bytes) return "";

	const url = URL.createObjectURL(
		new Blob([copyBytesToArrayBuffer(asset.bytes)], {
			type: asset.mimeType
		})
	);
	assetObjectUrls.set(asset, url);
	return url;
}

async function readAssetManifestResponse(response: AssetFetcherResponse) {
	if (response.json) return response.json();

	return JSON.parse(
		new TextDecoder().decode(new Uint8Array(await response.arrayBuffer()))
	);
}

function isCourseAssetManifest(value: unknown): value is {
	assets: Array<{
		height?: unknown;
		mimeType?: string;
		name: string;
		url: string;
		width?: unknown;
	}>;
} {
	return (
		typeof value === "object" &&
		value !== null &&
		Array.isArray((value as { assets?: unknown }).assets)
	);
}

function numberOrUndefined(value: unknown) {
	return typeof value === "number" && Number.isFinite(value)
		? value
		: undefined;
}

function copyBytesToArrayBuffer(bytes: Uint8Array): ArrayBuffer {
	const copy = new Uint8Array(bytes.byteLength);
	copy.set(bytes);
	return copy.buffer;
}

function formatAssetLoadError(error: unknown) {
	return error instanceof Error ? error.message : String(error);
}

function normalizeZipAssetName(path: string) {
	return path
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\.\/+/, "");
}

function isIgnoredZipAssetName(path: string) {
	return (
		IGNORED_ZIP_PATH_RE.test(path) ||
		path.split("/").some(part => part.startsWith("."))
	);
}
