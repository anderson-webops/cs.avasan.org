import { strFromU8, unzipSync } from "fflate";

export interface GraphSketcherArchiveWorkerRequest {
	archive: ArrayBuffer;
	maxArchiveBytes: number;
	maxXmlBytes: number;
}

export type GraphSketcherArchiveWorkerResponse =
	{ ok: true; xml: string } | { ok: false; message: string };

function contentsXmlName(name: string) {
	const normalized = name.toLowerCase();
	return (
		normalized === "contents.xml" || normalized.endsWith("/contents.xml")
	);
}

export function extractLegacyGraphXmlFromArchive(
	data: Uint8Array,
	maxArchiveBytes: number,
	maxXmlBytes: number
) {
	if (data.byteLength > maxArchiveBytes) {
		throw new Error(
			"The legacy graph archive is larger than the 8 MB import limit."
		);
	}

	let contentsEntries = 0;
	let oversizedEntry = false;
	const files = unzipSync(data, {
		filter(file) {
			if (!contentsXmlName(file.name)) return false;
			contentsEntries += 1;
			if (file.originalSize > maxXmlBytes) {
				oversizedEntry = true;
				return false;
			}
			return contentsEntries === 1;
		}
	});

	if (oversizedEntry) {
		throw new Error(
			"The archived contents.xml is larger than the 16 MB import limit."
		);
	}
	if (contentsEntries !== 1) {
		throw new Error(
			"The .ograph archive must contain exactly one contents.xml file."
		);
	}

	const contents = Object.entries(files).find(([name]) =>
		contentsXmlName(name)
	)?.[1];
	if (!contents) {
		throw new Error(
			"The .ograph archive must contain exactly one contents.xml file."
		);
	}
	if (contents.byteLength > maxXmlBytes) {
		throw new Error(
			"The archived contents.xml is larger than the 16 MB import limit."
		);
	}
	return strFromU8(contents);
}

export function safeGraphArchiveErrorMessage(error: unknown) {
	if (
		error instanceof Error &&
		[
			"The legacy graph archive is larger than the 8 MB import limit.",
			"The archived contents.xml is larger than the 16 MB import limit.",
			"The .ograph archive must contain exactly one contents.xml file."
		].includes(error.message)
	) {
		return error.message;
	}
	return "The .ograph archive could not be opened.";
}
