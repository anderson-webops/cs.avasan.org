import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, rename, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

export const scratchVersion = "15.1.1";
const archiveUrl = `https://registry.npmjs.org/@scratch/scratch-gui/-/scratch-gui-${scratchVersion}.tgz`;
const archiveBytes = 149917654;
const archiveHash =
	"b00073c1321daef2beb9f8d9bf0750654f85811f57b6f9203221d1dbd9ec1258";
const output = fileURLToPath(
	new URL("../../public/scratch-runtime/vendor/", import.meta.url)
);
const cache = path.join(tmpdir(), `scratch-gui-${scratchVersion}.tgz`);
const hash = data => createHash("sha256").update(data).digest("hex");

export async function prepareScratchEditor() {
	try {
		const inventory = JSON.parse(
			await readFile(path.join(output, "inventory.json"), "utf8")
		);
		if (
			inventory.archiveHash === archiveHash &&
			inventory.adapterRevision === 1
		) {
			for (const file of inventory.files)
				if (
					hash(await readFile(path.join(output, file.path))) !==
					file.sha256
				)
					throw new Error("Stale Scratch asset");
			return;
		}
	} catch {
		/* Rebuild a missing or changed verified distribution. */
	}
	let archive;
	try {
		archive = await readFile(cache);
	} catch {
		/* Download below. */
	}
	if (
		!archive ||
		archive.length !== archiveBytes ||
		hash(archive) !== archiveHash
	) {
		const response = await fetch(archiveUrl, {
			signal: AbortSignal.timeout(180000)
		});
		if (!response.ok || !response.body)
			throw new Error(`Scratch download failed (${response.status})`);
		const chunks = [];
		let size = 0;
		for await (const chunk of response.body) {
			size += chunk.length;
			if (size > archiveBytes)
				throw new Error("Oversized Scratch archive");
			chunks.push(chunk);
		}
		archive = Buffer.concat(chunks);
		if (size !== archiveBytes || hash(archive) !== archiveHash)
			throw new Error("Scratch archive integrity check failed");
		await writeFile(cache, archive);
	}
	const tar = gunzipSync(archive, { maxOutputLength: 300 * 1024 * 1024 });
	const staging = `${output.replace(/\/$/, "")}.staging-${process.pid}`;
	await mkdir(staging, { recursive: true });
	const files = [];
	try {
		for (let offset = 0; offset + 512 <= tar.length;) {
			const header = tar.subarray(offset, offset + 512);
			const name = header
				.subarray(0, 100)
				.toString()
				.replace(/\0.*$/s, "");
			if (!name) break;
			const size = Number.parseInt(
				header
					.subarray(124, 136)
					.toString()
					.replace(/\0.*$/s, "")
					.trim(),
				8
			);
			if (
				!Number.isSafeInteger(size) ||
				size < 0 ||
				offset + 512 + size > tar.length
			)
				throw new Error("Invalid Scratch archive entry");
			let data = tar.subarray(offset + 512, offset + 512 + size);
			offset += 512 + Math.ceil(size / 512) * 512;
			const relative = name.startsWith("package/dist/")
				? name.slice(13)
				: ["package/LICENSE", "package/TRADEMARK"].includes(name)
					? name.slice(8)
					: null;
			if (
				!relative ||
				relative.endsWith(".map") ||
				/^scratch-gui\.js/.test(relative) ||
				!["0", "\0"].includes(String.fromCharCode(header[156]))
			)
				continue;
			if (
				relative
					.split("/")
					.some(part => !part || part === "." || part === "..") ||
				relative.includes("\\")
			)
				throw new Error("Unsafe Scratch archive entry");
			if (relative === "scratch-gui-standalone.js") {
				const source = data.toString();
				const matches = source.match(/\.p="\/"/g) || [];
				if (matches.length !== 2)
					throw new Error(
						"Scratch asset base changed; review the adapter"
					);
				data = Buffer.from(
					source.replace(
						/\.p="\/"/g,
						'.p=new URL("/scratch-runtime/vendor/",document.baseURI).href'
					)
				);
			}
			const destination = path.join(staging, relative);
			await mkdir(path.dirname(destination), { recursive: true });
			await writeFile(destination, data);
			files.push({ path: relative, sha256: hash(data) });
		}
		if (!files.some(f => f.path === "scratch-gui-standalone.js"))
			throw new Error("Scratch editor bundle is missing");
		await writeFile(
			path.join(staging, "inventory.json"),
			JSON.stringify(
				{
					version: scratchVersion,
					archiveUrl,
					archiveHash,
					adapterRevision: 1,
					files
				},
				null,
				2
			)
		);
		await rm(output, { recursive: true, force: true });
		await rename(staging, output);
		console.log(
			`[scratch-editor] Verified official Scratch ${scratchVersion}: ${files.length} local assets`
		);
	} finally {
		await rm(staging, { recursive: true, force: true });
	}
}

if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
	await prepareScratchEditor();
