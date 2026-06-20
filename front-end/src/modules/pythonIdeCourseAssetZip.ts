import type { PythonIdeCourseAssetPack } from "@/modules/pythonIdeCourseAssets";
import { strFromU8, unzipSync } from "fflate";
import { getPythonIdeFileMimeType } from "@/modules/pythonIde";
import {
	normalizePythonIdeAssetLookupPath,
	pythonIdeAssetLookupAliases,
	pythonIdeCourseAssetsZipUrl
} from "@/modules/pythonIdeCourseAssets";

const ASSET_PATH_RE = /^(?:images|music|sounds)\/[^/].+\.[\dA-Z]+$/i;
const IGNORED_ZIP_PATH_RE =
	/(?:^|\/)(?:__MACOSX|\.DS_Store|Thumbs\.db|desktop\.ini)(?:\/|$)/i;
const IMAGE_EXTENSION_RE = /\.(?:gif|jpe?g|png|svg|webp)$/i;
const GIF_SIGNATURE = "GIF";
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const SVG_DIMENSION_RE = /\b(?:width|height)=["']?([\d.]+)(?:px)?["']?/gi;
const SVG_VIEWBOX_RE =
	/\bviewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i;

export function parsePythonIdeCourseAssetZipBytes(
	zipBytes: Uint8Array,
	sourceUrl = pythonIdeCourseAssetsZipUrl
): PythonIdeCourseAssetPack {
	const files = unzipSync(zipBytes);
	const aliases = new Map<string, string>();
	const assets = new Map();

	for (const [rawName, bytes] of Object.entries(files)) {
		const name = normalizeZipAssetName(rawName);
		if (!name || !ASSET_PATH_RE.test(name)) continue;
		if (isIgnoredZipAssetName(name)) continue;

		const mimeType = getPythonIdeFileMimeType(name);
		if (!mimeType) continue;

		const dimensions = imageDimensions(name, bytes);
		const lookupPath = normalizePythonIdeAssetLookupPath(name);
		assets.set(lookupPath, {
			bytes,
			height: dimensions?.height,
			mimeType,
			name,
			width: dimensions?.width
		});
		for (const alias of pythonIdeAssetLookupAliases(name)) {
			if (alias === lookupPath || aliases.has(alias)) continue;
			aliases.set(alias, lookupPath);
		}
	}

	return { aliases, assets, sourceUrl };
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

function imageDimensions(name: string, bytes: Uint8Array) {
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

function isPng(bytes: Uint8Array) {
	return PNG_SIGNATURE.every((value, index) => bytes[index] === value);
}

function isGif(bytes: Uint8Array) {
	return strFromU8(bytes.subarray(0, 3)) === GIF_SIGNATURE;
}

function readUint16LE(bytes: Uint8Array, offset: number) {
	return bytes[offset] + ((bytes[offset + 1] ?? 0) << 8);
}

function readUint32BE(bytes: Uint8Array, offset: number) {
	return (
		(bytes[offset] ?? 0) * 0x1000000 +
		((bytes[offset + 1] ?? 0) << 16) +
		((bytes[offset + 2] ?? 0) << 8) +
		(bytes[offset + 3] ?? 0)
	);
}

function jpegDimensions(bytes: Uint8Array) {
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

function svgDimensions(svg: string) {
	const viewBoxMatch = svg.match(SVG_VIEWBOX_RE);
	if (viewBoxMatch?.[1] && viewBoxMatch[2]) {
		return {
			height: Number(viewBoxMatch[2]),
			width: Number(viewBoxMatch[1])
		};
	}

	const values = [...svg.matchAll(SVG_DIMENSION_RE)].map(match =>
		Number(match[1])
	);
	if (values.length >= 2) return { height: values[1], width: values[0] };
	return null;
}
