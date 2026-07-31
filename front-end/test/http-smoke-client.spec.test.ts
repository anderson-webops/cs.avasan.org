import { createServer } from "node:http";
import { afterEach, describe, expect, it } from "vitest";
import {
	smokeErrorMessage,
	smokeRequest
} from "../../scripts/http-smoke-client.mjs";

let server: ReturnType<typeof createServer> | undefined;

afterEach(async () => {
	if (!server) return;
	await new Promise<void>((resolve, reject) => {
		server!.close(error => {
			if (error) reject(error);
			else resolve();
		});
	});
	server = undefined;
});

async function localOrigin() {
	server = createServer((request, response) => {
		if (request.url === "/redirect") {
			response.statusCode = 302;
			response.setHeader("Location", "/release.json");
			response.end();
			return;
		}
		if (request.url === "/cross-origin") {
			response.statusCode = 302;
			response.setHeader("Location", "https://example.test/release.json");
			response.end();
			return;
		}
		if (request.url === "/loop") {
			response.statusCode = 302;
			response.setHeader("Location", "/loop");
			response.end();
			return;
		}
		if (request.url === "/slow-drip") {
			response.setHeader("Content-Type", "text/plain");
			const timer = setInterval(() => {
				response.write(".");
			}, 20);
			response.on("close", () => clearInterval(timer));
			return;
		}
		if (request.url?.startsWith("/slow-redirect/")) {
			const step = Number(request.url.split("/").at(-1));
			setTimeout(() => {
				if (step < 4) {
					response.statusCode = 302;
					response.setHeader(
						"Location",
						`/slow-redirect/${step + 1}`
					);
					response.end();
					return;
				}
				response.setHeader("Content-Type", "application/json");
				response.end(JSON.stringify({ ok: true }));
			}, 30);
			return;
		}
		response.setHeader("Cache-Control", "no-store");
		response.setHeader("Content-Type", "application/json");
		response.end(
			JSON.stringify({
				method: request.method,
				revision: "a".repeat(40),
				version: "1.0.0"
			})
		);
	});
	await new Promise<void>(resolve => {
		server!.listen(0, "127.0.0.1", resolve);
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("The smoke-test fixture did not bind a TCP port.");
	}
	return `http://127.0.0.1:${address.port}`;
}

describe("HTTP smoke client", () => {
	it("reads local HTTP responses without browser fetch semantics", async () => {
		const response = await smokeRequest(
			`${await localOrigin()}/release.json`
		);

		expect(response.ok).toBe(true);
		expect(response.status).toBe(200);
		expect(response.headers.get("cache-control")).toContain("no-store");
		expect(await response.json()).toEqual({
			method: "GET",
			revision: "a".repeat(40),
			version: "1.0.0"
		});
	});

	it("follows a bounded same-origin redirect by default", async () => {
		const response = await smokeRequest(`${await localOrigin()}/redirect`);

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({
			revision: "a".repeat(40),
			version: "1.0.0"
		});
	});

	it("returns redirects untouched in manual mode", async () => {
		const response = await smokeRequest(`${await localOrigin()}/redirect`, {
			redirect: "manual"
		});

		expect(response.status).toBe(302);
		expect(response.headers.get("location")).toBe("/release.json");
	});

	it("refuses cross-origin redirects before following them", async () => {
		await expect(
			smokeRequest(`${await localOrigin()}/cross-origin`)
		).rejects.toThrow("Refused cross-origin smoke-test redirect");
	});

	it("stops same-origin redirect loops after five hops", async () => {
		await expect(
			smokeRequest(`${await localOrigin()}/loop`)
		).rejects.toThrow("redirect limit of 5 exceeded");
	});

	it("uses a wall-clock deadline even while response bytes keep arriving", async () => {
		await expect(
			smokeRequest(`${await localOrigin()}/slow-drip`, {
				timeoutMs: 90
			})
		).rejects.toThrow("timed out after 90 ms");
	});

	it("shares one deadline across the entire redirect chain", async () => {
		await expect(
			smokeRequest(`${await localOrigin()}/slow-redirect/1`, {
				timeoutMs: 75
			})
		).rejects.toThrow("timed out after 75 ms");
	});

	it("reports the exact URL and underlying connection failure", async () => {
		const message = await smokeRequest("http://127.0.0.1:1/release.json", {
			timeoutMs: 100
		})
			.then(() => "")
			.catch(smokeErrorMessage);

		expect(message).toContain("http://127.0.0.1:1/release.json");
		expect(message).toContain("Caused by:");
	});
});
