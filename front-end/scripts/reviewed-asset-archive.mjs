import { createHash } from "node:crypto";
import { open } from "node:fs/promises";

const ZIP_HEADER = [0x50, 0x4b];

export async function readReviewedAssetArchiveFile(
	filePath,
	{ expectedBytes, expectedSha256, label = "cached asset pack" }
) {
	const file = await open(filePath, "r");
	try {
		const fileStat = await file.stat();
		if (fileStat.size !== expectedBytes) {
			throw new Error(
				`${label} has unexpected size ${fileStat.size}; expected ${expectedBytes}`
			);
		}

		const bytes = new Uint8Array(expectedBytes);
		let offset = 0;
		while (offset < expectedBytes) {
			const { bytesRead } = await file.read(
				bytes,
				offset,
				expectedBytes - offset,
				offset
			);
			if (bytesRead === 0) break;
			offset += bytesRead;
		}
		if (offset !== expectedBytes) {
			throw new Error(
				`${label} became incomplete while being read; received ${offset} of ${expectedBytes} bytes`
			);
		}

		return verifyReviewedAssetArchiveBytes(bytes, {
			expectedBytes,
			expectedSha256,
			label
		});
	} finally {
		await file.close();
	}
}

export function verifyReviewedAssetArchiveBytes(
	bytes,
	{ expectedBytes, expectedSha256, label = "asset pack" }
) {
	if (bytes.byteLength !== expectedBytes) {
		throw new Error(
			`${label} has unexpected size ${bytes.byteLength}; expected ${expectedBytes}`
		);
	}
	const sha256 = createHash("sha256").update(bytes).digest("hex");
	if (sha256 !== expectedSha256) {
		throw new Error(
			`${label} failed SHA-256 verification; expected ${expectedSha256}`
		);
	}
	if (bytes[0] !== ZIP_HEADER[0] || bytes[1] !== ZIP_HEADER[1]) {
		throw new Error(`${label} does not look like a zip file`);
	}
	return bytes;
}
