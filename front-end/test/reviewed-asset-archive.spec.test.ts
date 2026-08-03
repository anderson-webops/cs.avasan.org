import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	readReviewedAssetArchiveFile,
	verifyReviewedAssetArchiveBytes
} from "../scripts/reviewed-asset-archive.mjs";

let fixtureDirectory: string | undefined;

afterEach(async () => {
	if (!fixtureDirectory) return;
	await rm(fixtureDirectory, { force: true, recursive: true });
	fixtureDirectory = undefined;
});

async function archiveFixture(bytes: Uint8Array) {
	fixtureDirectory = await mkdtemp(join(tmpdir(), "reviewed-asset-cache-"));
	const filePath = join(fixtureDirectory, "assets.zip");
	await writeFile(filePath, bytes);
	return filePath;
}

function sha256(bytes: Uint8Array) {
	return createHash("sha256").update(bytes).digest("hex");
}

describe("reviewed asset archive", () => {
	it("returns bytes only after the cached file matches size and SHA-256", async () => {
		const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 1, 2, 3]);
		const filePath = await archiveFixture(bytes);

		await expect(
			readReviewedAssetArchiveFile(filePath, {
				expectedBytes: bytes.byteLength,
				expectedSha256: sha256(bytes)
			})
		).resolves.toEqual(bytes);
	});

	it("rejects cached files with the wrong size or digest", async () => {
		const bytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 4, 5, 6]);
		const filePath = await archiveFixture(bytes);

		await expect(
			readReviewedAssetArchiveFile(filePath, {
				expectedBytes: bytes.byteLength + 1,
				expectedSha256: sha256(bytes)
			})
		).rejects.toThrow("unexpected size");
		await expect(
			readReviewedAssetArchiveFile(filePath, {
				expectedBytes: bytes.byteLength,
				expectedSha256: "0".repeat(64)
			})
		).rejects.toThrow("failed SHA-256 verification");
	});

	it("rejects a matching digest when the reviewed bytes are not a ZIP", () => {
		const bytes = new Uint8Array([1, 2, 3, 4]);

		expect(() =>
			verifyReviewedAssetArchiveBytes(bytes, {
				expectedBytes: bytes.byteLength,
				expectedSha256: sha256(bytes)
			})
		).toThrow("does not look like a zip file");
	});
});
