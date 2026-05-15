export const SCHEDULER_ORIGIN = "https://scheduler.classes.jacobdanderson.net";
export const schedulerUrl = `${SCHEDULER_ORIGIN}/`;
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
	ensureHeadLink("dns-prefetch", "//scheduler.classes.jacobdanderson.net");
}
