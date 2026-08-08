import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
	CHROMIUM_TREX_COMMIT,
	CHROMIUM_TREX_VERSION,
	mountChromiumTrex
} from "@/vendor/chromium-t-rex";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const vendorDirectory = resolve(testDirectory, "../src/vendor/chromium-t-rex");

describe("vendored Chromium T-Rex Runner", () => {
	it("pins and verifies every reviewed upstream source, asset, and license", () => {
		expect(CHROMIUM_TREX_VERSION).toBe("151.0.7922.77");
		expect(CHROMIUM_TREX_COMMIT).toBe(
			"ff37cfca210138f2a40b843b4a8195ab7e4fc7ff"
		);

		const entries = readFileSync(
			resolve(vendorDirectory, "UPSTREAM_SHA256SUMS"),
			"utf8"
		)
			.trim()
			.split("\n")
			.map(line => {
				const match = /^(?<hash>[0-9a-f]{64})  (?<path>.+)$/.exec(line);
				expect(match).not.toBeNull();
				return match?.groups as { hash: string; path: string };
			});

		expect(entries).toHaveLength(30);
		for (const entry of entries) {
			const contents = readFileSync(resolve(vendorDirectory, entry.path));
			expect(createHash("sha256").update(contents).digest("hex")).toBe(
				entry.hash
			);
		}
	});

	it("mounts a script-only opaque frame with an internal no-network policy", () => {
		const host = document.createElement("div");
		const cleanup = mountChromiumTrex(host, {
			className: "reviewed-frame",
			title: "Reviewed T-Rex game"
		});
		const frame = host.querySelector("iframe");

		expect(frame).not.toBeNull();
		expect(frame?.className).toBe("reviewed-frame");
		expect(frame?.title).toBe("Reviewed T-Rex game");
		expect(frame?.getAttribute("sandbox")).toBe("allow-scripts");
		expect(frame?.getAttribute("sandbox")).not.toContain(
			"allow-same-origin"
		);
		expect(frame?.referrerPolicy).toBe("no-referrer");
		expect(frame?.dataset.chromiumCommit).toBe(CHROMIUM_TREX_COMMIT);
		expect(frame?.srcdoc).toContain("connect-src 'none'");
		expect(frame?.srcdoc).toContain("worker-src 'none'");
		expect(frame?.srcdoc).toContain("form-action 'none'");
		expect(frame?.srcdoc).toContain("data:image/png;base64,");
		expect(frame?.srcdoc).toContain("data:audio/");
		expect(frame?.srcdoc).not.toMatch(/\bfetch\s*\(/u);
		expect(frame?.srcdoc).not.toContain("XMLHttpRequest");
		expect(frame?.srcdoc).not.toContain("sendBeacon");
		expect(frame?.srcdoc).not.toContain("localStorage");
		expect(frame?.srcdoc).not.toContain("sessionStorage");
		expect(frame?.srcdoc).not.toContain("document.cookie");

		cleanup();
		cleanup();
		expect(host.querySelector("iframe")).toBeNull();
	});

	it("ships a checkout-independent derived runtime", () => {
		const generatedBundle = readFileSync(
			resolve(
				vendorDirectory,
				"generated/chromium-t-rex-frame.js.txt"
			),
			"utf8"
		);

		expect(generatedBundle).toContain(
			"chromium-upstream:dino_game/offline.ts.txt"
		);
		expect(generatedBundle).not.toMatch(
			/(?:[A-Za-z]:\\|\/(?:Users|home|private|srv|tmp)\/)/u
		);
		expect(generatedBundle).not.toContain("errorPageController");
		expect(generatedBundle).not.toContain(
			"initializeEasterEggHighScore"
		);
	});

	it("documents the exact adaptation boundary and non-endorsement", () => {
		const provenance = readFileSync(
			resolve(testDirectory, "../../docs/third-party/chromium-t-rex.md"),
			"utf8"
		);

		expect(provenance).toContain(CHROMIUM_TREX_VERSION);
		expect(provenance).toContain(CHROMIUM_TREX_COMMIT);
		expect(provenance).toContain("preserved byte for byte");
		expect(provenance).toContain("does not change obstacle generation");
		expect(provenance).toContain("Chromium and Google do not endorse");
		expect(provenance).toMatch(/There is no game\s+analytics/u);
	});
});
