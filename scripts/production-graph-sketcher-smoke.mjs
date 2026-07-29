import { pathToFileURL } from "node:url";

const origin = process.env.CLASSES_SITE_ORIGIN || "https://cs.avasan.org";
const timeoutMs = Number(process.env.CLASSES_SITE_SMOKE_TIMEOUT_MS || 15000);
const smokePath = "/graph-sketcher";

async function fetchText(url) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			headers: {
				accept: "text/html,application/javascript,text/javascript,*/*"
			},
			signal: controller.signal
		});
		if (!response.ok) {
			throw new Error(`${url} returned HTTP ${response.status}`);
		}
		return await response.text();
	} finally {
		clearTimeout(timeout);
	}
}

export function graphSketcherSmokePageUrl(baseOrigin = origin) {
	return new URL(smokePath, baseOrigin);
}

export function pageAssetUrls(html, pageUrl = graphSketcherSmokePageUrl()) {
	const urls = new Set();
	const assetAttributeRE = /\b(?:href|src)="([^"]+)"/g;
	for (const match of html.matchAll(assetAttributeRE)) {
		const value = match[1];
		if (!value || !/\.(?:css|js)(?:$|\?)/.test(value)) continue;
		const url = new URL(value, pageUrl);
		if (url.origin === pageUrl.origin) urls.add(url.href);
	}
	return [...urls];
}

export function containsGraphSketcherRuntimeMarkers(source) {
	return (
		source.includes("Graph Sketcher") &&
		source.includes("Math workspace") &&
		source.includes("Download project") &&
		source.includes("Plot function") &&
		source.includes(".graphsketch") &&
		source.includes(".ograph") &&
		source.includes("cs-avasan-graph-sketcher-session-v1") &&
		source.includes("All rendering, imports, and") &&
		source.includes("exports run in this browser.") &&
		source.includes("https://github.com/Jacoba1100254352/GraphSketcher.Linux")
	);
}

export function graphSketcherWorkerAssetUrls(source, pageUrl = graphSketcherSmokePageUrl()) {
	const urls = new Set();
	const workerAssetRE = /["'`]([^"'`]*graphSketcherArchive\.worker[^"'`]*\.js(?:\?[^"'`]*)?)["'`]/g;
	for (const match of source.matchAll(workerAssetRE)) {
		const url = new URL(match[1], pageUrl);
		if (url.origin === pageUrl.origin) urls.add(url.href);
	}
	return [...urls];
}

export function containsGraphSketcherWorkerMarkers(source) {
	return (
		source.includes("contents.xml") &&
		source.includes("The .ograph archive must contain exactly one contents.xml file.") &&
		source.includes("The .ograph archive could not be opened.")
	);
}

export async function runProductionGraphSketcherSmoke() {
	const pageUrl = graphSketcherSmokePageUrl();
	const html = await fetchText(pageUrl);
	const assetUrls = pageAssetUrls(html, pageUrl);
	if (!assetUrls.length) {
		throw new Error(`${pageUrl.href} did not reference any same-origin JavaScript or CSS assets`);
	}

	const assetSources = [];
	for (const url of assetUrls) {
		assetSources.push({
			source: await fetchText(url),
			url
		});
	}
	const combinedSource = [html, ...assetSources.map(asset => asset.source)].join("\n");
	if (!containsGraphSketcherRuntimeMarkers(combinedSource)) {
		throw new Error(`${pageUrl.href} did not reference the current client-side Graph Sketcher bundle`);
	}
	const runtimeAsset = assetSources.find(asset => asset.source.includes("cs-avasan-graph-sketcher-session-v1"));
	if (!runtimeAsset) {
		throw new Error(`${pageUrl.href} did not reference the current Graph Sketcher runtime asset`);
	}
	const workerAssetUrls = graphSketcherWorkerAssetUrls(runtimeAsset.source, pageUrl);
	if (workerAssetUrls.length !== 1) {
		throw new Error(`${pageUrl.href} did not reference exactly one Graph Sketcher archive worker`);
	}
	const workerSource = await fetchText(workerAssetUrls[0]);
	if (!containsGraphSketcherWorkerMarkers(workerSource)) {
		throw new Error(`${workerAssetUrls[0]} was not the current bounded Graph Sketcher archive worker`);
	}
	console.log(`OK: ${pageUrl.href} references ${runtimeAsset.url} and ${workerAssetUrls[0]}`);
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runProductionGraphSketcherSmoke().catch(error => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
}
