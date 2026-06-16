export const DEFAULT_SCHEDULER_ORIGIN =
	"https://scheduler.classes.jacobdanderson.net";
const httpProtocolPattern = /^https?:\/\//i;
const protocolPattern = /^[a-z][a-z\d+.-]*:\/\//i;

export function normalizeSchedulerOrigin(rawOrigin?: string) {
	const trimmedOrigin = rawOrigin?.trim();
	const originCandidate = trimmedOrigin || DEFAULT_SCHEDULER_ORIGIN;
	if (
		protocolPattern.test(originCandidate) &&
		!httpProtocolPattern.test(originCandidate)
	) {
		return DEFAULT_SCHEDULER_ORIGIN;
	}

	const originWithProtocol = httpProtocolPattern.test(originCandidate)
		? originCandidate
		: `https://${originCandidate}`;

	try {
		const url = new URL(originWithProtocol);
		if (url.protocol !== "http:" && url.protocol !== "https:") {
			return DEFAULT_SCHEDULER_ORIGIN;
		}

		return url.origin;
	} catch {
		return DEFAULT_SCHEDULER_ORIGIN;
	}
}

export const SCHEDULER_ORIGIN = normalizeSchedulerOrigin(
	import.meta.env.VITE_SCHEDULER_ORIGIN
);
export const schedulerUrl = `${SCHEDULER_ORIGIN}/`;
export const schedulerDnsPrefetchHref = `//${new URL(SCHEDULER_ORIGIN).host}`;
export type SchedulerEmbedTheme = "light" | "dark";

export function buildSchedulerEmbedUrl(theme?: SchedulerEmbedTheme) {
	const url = new URL(schedulerUrl);
	url.searchParams.set("embed", "1");

	if (theme) {
		url.searchParams.set("theme", theme);
	}

	return url.toString();
}

export const schedulerEmbedUrl = buildSchedulerEmbedUrl();
export const schedulerEmbedMessageSource =
	"scheduler.classes.jacobdanderson.net";
export const schedulerEmbedResizeType = "scheduler:resize";
export const schedulerEmbedThemeMessageSource = "classes.jacobdanderson.net";
export const schedulerEmbedThemeType = "scheduler:theme";

let schedulerWarmthApplied = false;

function ensureHeadLink(rel: string, href: string, crossorigin?: string) {
	if (typeof document === "undefined") {
		return;
	}

	const selector = crossorigin
		? `link[rel="${rel}"][href="${href}"][crossorigin="${crossorigin}"]`
		: `link[rel="${rel}"][href="${href}"]`;

	if (document.head.querySelector(selector)) {
		return;
	}

	const link = document.createElement("link");
	link.rel = rel;
	link.href = href;

	if (crossorigin) {
		link.crossOrigin = crossorigin;
	}

	document.head.appendChild(link);
}

export function warmSchedulerConnections() {
	if (schedulerWarmthApplied) {
		return;
	}

	schedulerWarmthApplied = true;
	ensureHeadLink("dns-prefetch", schedulerDnsPrefetchHref);
	ensureHeadLink("preconnect", SCHEDULER_ORIGIN);
}
