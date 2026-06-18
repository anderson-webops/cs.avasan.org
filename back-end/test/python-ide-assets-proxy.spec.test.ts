import type { Server } from "node:http";
import express from "express";
import { afterEach, describe, expect, it, vi } from "vitest";
import { pythonIdeAssetsProxy } from "../src/controllers/common/pythonIdeAssetsProxy.js";

async function withPythonAssetsProxy<T>(
	run: (baseUrl: string) => Promise<T>
): Promise<T> {
	const app = express();
	app.use("/python-assets", pythonIdeAssetsProxy);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

const realFetch = globalThis.fetch.bind(globalThis);
const staticAssetsZipUrl = "https://static.classes.jacobdanderson.net/assets.zip";
const fetchSpy = vi.spyOn(globalThis, "fetch");

function fetchUrl(input: Parameters<typeof fetch>[0]) {
	if (typeof input === "string") return input;
	if (input instanceof URL) return input.href;
	return input.url;
}

describe("Python IDE assets proxy", () => {
	afterEach(() => {
		fetchSpy.mockReset();
	});

	it("streams the shared static assets zip through the same-origin API", async () => {
		const zipBytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
		fetchSpy.mockImplementation((input, init) => {
			if (fetchUrl(input) !== staticAssetsZipUrl) return realFetch(input, init);

			return Promise.resolve(
				new Response(zipBytes, {
					headers: {
						"content-length": String(zipBytes.byteLength),
						"content-type": "application/zip",
						etag: "\"asset-pack-test\"",
						"last-modified": "Fri, 12 Jun 2026 15:37:01 GMT"
					},
					status: 200
				})
			);
		});

		await withPythonAssetsProxy(async baseUrl => {
			const response = await fetch(`${baseUrl}/python-assets/assets.zip`);

			expect(response.status).toBe(200);
			expect(response.headers.get("content-type")).toContain("application/zip");
			expect(response.headers.get("content-length")).toBe(String(zipBytes.byteLength));
			expect(response.headers.get("cache-control")).toContain("stale-while-revalidate");
			expect(response.headers.get("etag")).toBe("\"asset-pack-test\"");
			expect(new Uint8Array(await response.arrayBuffer())).toEqual(zipBytes);
		});

		expect(fetchSpy).toHaveBeenCalledWith(staticAssetsZipUrl);
	});
});
