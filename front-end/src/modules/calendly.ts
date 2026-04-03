export const CALENDLY_ORIGIN = "https://calendly.com";
export const CALENDLY_ASSET_ORIGIN = "https://assets.calendly.com";
export const calendlyUrl = `${CALENDLY_ORIGIN}/jacoba1100254352`;
export const calendlyEmbedUrl = `${calendlyUrl}?hide_gdpr_banner=1`;
export const calendlyScriptSrc = `${CALENDLY_ASSET_ORIGIN}/assets/external/widget.js`;

declare global {
	interface Window {
		Calendly?: {
			initInlineWidget?: (options: {
				parentElement: HTMLElement;
				url: string;
				resize?: boolean;
			}) => void;
		};
	}
}

let calendlyScriptPromise: Promise<void> | null = null;

function ensureHeadLink(attributes: Record<string, string>) {
	if (typeof document === "undefined") {
		return;
	}

	const selector = Object.entries(attributes)
		.map(([key, value]) => `[${key}="${value}"]`)
		.join("");

	if (document.head.querySelector(`link${selector}`)) {
		return;
	}

	const link = document.createElement("link");

	for (const [key, value] of Object.entries(attributes)) {
		link.setAttribute(key, value);
	}

	document.head.append(link);
}

export function warmCalendlyConnections() {
	ensureHeadLink({
		rel: "dns-prefetch",
		href: "//calendly.com"
	});
	ensureHeadLink({
		rel: "dns-prefetch",
		href: "//assets.calendly.com"
	});
	ensureHeadLink({
		rel: "preconnect",
		href: CALENDLY_ORIGIN
	});
	ensureHeadLink({
		rel: "preconnect",
		href: CALENDLY_ASSET_ORIGIN,
		crossorigin: "anonymous"
	});
	ensureHeadLink({
		rel: "preload",
		href: calendlyScriptSrc,
		as: "script",
		crossorigin: "anonymous"
	});
}

export function loadCalendlyWidget() {
	if (typeof document === "undefined") {
		return Promise.resolve();
	}

	warmCalendlyConnections();

	if (window.Calendly?.initInlineWidget) {
		return Promise.resolve();
	}

	if (calendlyScriptPromise) {
		return calendlyScriptPromise;
	}

	const existingScript = document.querySelector<HTMLScriptElement>(
		'script[data-calendly="true"]'
	);

	calendlyScriptPromise = new Promise((resolve, reject) => {
		const handleLoad = () => {
			resolve();
		};

		const handleError = () => {
			calendlyScriptPromise = null;
			reject(new Error("Calendly widget failed to load"));
		};

		if (existingScript) {
			if (
				window.Calendly?.initInlineWidget ||
				existingScript.dataset.loaded === "true"
			) {
				resolve();
				return;
			}

			existingScript.addEventListener("load", handleLoad, { once: true });
			existingScript.addEventListener("error", handleError, {
				once: true
			});
			return;
		}

		const script = document.createElement("script");
		script.src = calendlyScriptSrc;
		script.async = true;
		script.defer = true;
		script.setAttribute("data-calendly", "true");
		script.addEventListener(
			"load",
			() => {
				script.dataset.loaded = "true";
				handleLoad();
			},
			{ once: true }
		);
		script.addEventListener("error", handleError, { once: true });
		document.head.append(script);
	});

	return calendlyScriptPromise;
}

export async function mountCalendlyInlineWidget(parentElement: HTMLElement) {
	await loadCalendlyWidget();

	parentElement.innerHTML = "";
	parentElement.removeAttribute("data-processed");
	parentElement.setAttribute("data-url", calendlyEmbedUrl);

	window.Calendly?.initInlineWidget?.({
		url: calendlyEmbedUrl,
		parentElement,
		resize: true
	});
}

export function primeCalendlyWidget() {
	void loadCalendlyWidget();
}
