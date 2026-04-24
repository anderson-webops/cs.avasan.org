export const SCHEDULER_ORIGIN = "https://scheduler.classes.jacobdanderson.net";
export const schedulerUrl = `${SCHEDULER_ORIGIN}/`;
export const schedulerEmbedUrl = `${schedulerUrl}?embed=1`;
export const schedulerEmbedMessageSource =
	"scheduler.classes.jacobdanderson.net";
export const schedulerEmbedResizeType = "scheduler:resize";

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
