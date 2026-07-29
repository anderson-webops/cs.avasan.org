import { describe, expect, it } from "vitest";
import {
	containsGraphSketcherRuntimeMarkers,
	containsGraphSketcherWorkerMarkers,
	graphSketcherWorkerAssetUrls,
	graphSketcherSmokePageUrl,
	pageAssetUrls
} from "../../scripts/production-graph-sketcher-smoke.mjs";

describe("production Graph Sketcher smoke helpers", () => {
	it("checks the public Graph Sketcher route", () => {
		expect(
			graphSketcherSmokePageUrl("https://cs.avasan.org").pathname
		).toBe("/graph-sketcher");
	});

	it("extracts only same-origin JavaScript and CSS assets", () => {
		const pageUrl = new URL("https://cs.avasan.org/graph-sketcher");
		const html = [
			'<link rel="stylesheet" href="/assets/app.css">',
			'<script type="module" src="/assets/GraphSketcherWorkspace-a1.js"></script>',
			'<script src="https://cdn.example.test/external.js"></script>'
		].join("");

		expect(pageAssetUrls(html, pageUrl)).toEqual([
			"https://cs.avasan.org/assets/app.css",
			"https://cs.avasan.org/assets/GraphSketcherWorkspace-a1.js"
		]);
	});

	it("requires the current client-only editor markers", () => {
		const currentRuntime = [
			"Graph Sketcher",
			"Math workspace",
			"Download project",
			"Plot function",
			".graphsketch",
			".ograph",
			"cs-avasan-graph-sketcher-session-v1",
			"All rendering, imports, and",
			"exports run in this browser.",
			"https://github.com/Jacoba1100254352/GraphSketcher.Linux"
		].join("\n");

		expect(containsGraphSketcherRuntimeMarkers("Graph Sketcher")).toBe(
			false
		);
		expect(containsGraphSketcherRuntimeMarkers(currentRuntime)).toBe(true);
	});

	it("requires the bounded same-origin archive worker", () => {
		const pageUrl = new URL("https://cs.avasan.org/graph-sketcher");
		const runtime =
			'new Worker("/assets/graphSketcherArchive.worker-a1.js")';
		const worker = [
			"contents.xml",
			"The .ograph archive must contain exactly one contents.xml file.",
			"The .ograph archive could not be opened."
		].join("\n");

		expect(graphSketcherWorkerAssetUrls(runtime, pageUrl)).toEqual([
			"https://cs.avasan.org/assets/graphSketcherArchive.worker-a1.js"
		]);
		expect(containsGraphSketcherWorkerMarkers(worker)).toBe(true);
		expect(containsGraphSketcherWorkerMarkers("contents.xml")).toBe(false);
	});
});
