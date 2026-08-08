import errorIcon1x from "./assets/100-error-offline.png?inline";
import sprite1x from "./assets/100-offline-sprite.png?inline";
import errorIcon2x from "./assets/200-error-offline.png?inline";
import sprite2x from "./assets/200-offline-sprite.png?inline";
import buttonPressSound from "./assets/button-press.mp3?inline";
import hitSound from "./assets/hit.mp3?inline";
import scoreReachedSound from "./assets/score-reached.mp3?inline";
import frameStyles from "./frame.css?raw";
import frameScript from "./generated/chromium-t-rex-frame.js.txt?raw";

export const CHROMIUM_TREX_VERSION = "151.0.7922.77";
export const CHROMIUM_TREX_COMMIT = "ff37cfca210138f2a40b843b4a8195ab7e4fc7ff";

export interface ChromiumTrexOptions {
	className?: string;
	title?: string;
}

function escapeAttribute(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

function assertDataUrl(value: string, mediaType: "audio" | "image"): string {
	const pattern =
		mediaType === "image"
			? /^data:image\/png;base64,[A-Za-z0-9+/=]+$/
			: /^data:audio\/[A-Za-z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/;
	if (!pattern.test(value)) {
		throw new Error(`Chromium T-Rex ${mediaType} asset is not inlined.`);
	}
	return value;
}

function createFrameDocument(title: string): string {
	if (/<\/style/i.test(frameStyles) || /<\/script/i.test(frameScript)) {
		throw new Error(
			"Chromium T-Rex frame resources are not safe for srcdoc."
		);
	}

	const safeTitle = escapeAttribute(title);
	const imageSprite1x = assertDataUrl(sprite1x, "image");
	const imageSprite2x = assertDataUrl(sprite2x, "image");
	const offlineIcon1x = assertDataUrl(errorIcon1x, "image");
	const offlineIcon2x = assertDataUrl(errorIcon2x, "image");
	const buttonSound = assertDataUrl(buttonPressSound, "audio");
	const crashSound = assertDataUrl(hitSound, "audio");
	const scoreSound = assertDataUrl(scoreReachedSound, "audio");

	return `<!doctype html>
<html class="offline" lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; media-src data:; script-src 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'none'; font-src 'none'; object-src 'none'; frame-src 'none'; worker-src 'none'; base-uri 'none'; form-action 'none'">
<title>${safeTitle}</title>
<style>:root{--offline-icon-1x:url("${offlineIcon1x}");--offline-icon-2x:url("${offlineIcon2x}")}${frameStyles}</style>
</head>
<body>
<main id="main-content" class="interstitial-wrapper">
<div class="icon-offline" aria-hidden="true"></div>
</main>
<div id="offline-resources" aria-hidden="true">
<img id="offline-resources-1x" alt="" src="${escapeAttribute(imageSprite1x)}">
<img id="offline-resources-2x" alt="" src="${escapeAttribute(imageSprite2x)}">
<template id="audio-resources">
<audio id="offline-sound-press" src="${escapeAttribute(buttonSound)}"></audio>
<audio id="offline-sound-hit" src="${escapeAttribute(crashSound)}"></audio>
<audio id="offline-sound-reached" src="${escapeAttribute(scoreSound)}"></audio>
</template>
</div>
<script>${frameScript}</script>
</body>
</html>`;
}

/**
 * Mounts Chromium's T-Rex Runner in an isolated local iframe.
 *
 * The frame has no same-origin capability, so Chromium's document-wide input
 * listeners, animation frames, and in-memory score remain inside the frame.
 * Removing the frame tears down that complete browser realm.
 */
export function mountChromiumTrex(
	host: HTMLElement,
	options: ChromiumTrexOptions = {}
): () => void {
	if (typeof window === "undefined" || typeof document === "undefined") {
		throw new TypeError(
			"Chromium T-Rex Runner can only mount in a browser."
		);
	}

	const title = options.title?.trim() || "T-Rex Runner game";
	const frame = host.ownerDocument.createElement("iframe");
	frame.className = options.className?.trim() || "chromium-trex-frame";
	frame.dataset.chromiumCommit = CHROMIUM_TREX_COMMIT;
	frame.referrerPolicy = "no-referrer";
	frame.setAttribute("sandbox", "allow-scripts");
	frame.setAttribute("title", title);
	frame.srcdoc = createFrameDocument(title);
	frame.style.display = "block";
	frame.style.width = "100%";
	frame.style.height = "100%";
	frame.style.border = "0";

	host.replaceChildren(frame);

	let cleanedUp = false;
	return () => {
		if (cleanedUp) return;
		cleanedUp = true;
		frame.remove();
	};
}
