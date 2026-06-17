export const DEFAULT_SCHEDULER_ORIGIN =
	"https://scheduler.classes.jacobdanderson.net";
const httpProtocolPattern = /^https?:\/\//i;
const protocolPattern = /^[a-z][a-z\d+.-]*:\/\//i;
export type SchedulerUrlSearchParams = Record<
	string,
	boolean | number | string | null | undefined
>;

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

function normalizeSchedulerPath(rawPath: string) {
	const trimmedPath = rawPath.trim();
	if (!trimmedPath || trimmedPath.startsWith("//")) return "/";

	if (protocolPattern.test(trimmedPath)) {
		try {
			const url = new URL(trimmedPath);
			if (url.origin !== SCHEDULER_ORIGIN) return "/";
			return `${url.pathname}${url.search}${url.hash}`;
		} catch {
			return "/";
		}
	}

	return trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
}

export function buildSchedulerUrl(
	path = "/",
	searchParams: SchedulerUrlSearchParams = {}
) {
	const url = new URL(normalizeSchedulerPath(path), schedulerUrl);

	for (const [key, value] of Object.entries(searchParams)) {
		if (value === null || value === undefined || value === "") continue;
		url.searchParams.set(key, String(value));
	}

	return url.toString();
}

export function buildSchedulerEmbedUrl(
	theme?: SchedulerEmbedTheme,
	path = "/"
) {
	const url = new URL(buildSchedulerUrl(path));
	url.searchParams.set("embed", "1");

	if (theme) {
		url.searchParams.set("theme", theme);
	}

	return url.toString();
}

export const schedulerEmbedUrl = buildSchedulerEmbedUrl();
export const schedulerPortalUrl = buildSchedulerUrl("/portal");
export const schedulerManageBookingUrl = buildSchedulerUrl("/booking/manage");
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
