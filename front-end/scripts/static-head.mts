import {
	canonicalUrlForPath,
	pageRobotsForPath,
	pageTitleForPath
} from "../src/modules/pageHead";

const TITLE_RE = /<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi;
const ROBOTS_META_RE = /<meta\b(?=[^>]*\bname\s*=\s*["']robots["'])[^>]*\/?>/gi;
const CANONICAL_LINK_RE =
	/<link\b(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*\/?>/gi;
const HEAD_CLOSE_RE = /<\/head\s*>/i;

export interface StaticHead {
	canonicalUrl: string;
	robots: string;
	title: string;
}

function escapeHtmlText(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}

function escapeHtmlAttribute(value: string) {
	return escapeHtmlText(value).replaceAll('"', "&quot;");
}

function upsertHeadElement(html: string, matcher: RegExp, element: string) {
	const withoutExisting = html.replace(matcher, "");
	const headClose = withoutExisting.search(HEAD_CLOSE_RE);
	if (headClose < 0) {
		throw new Error("Static page is missing a closing head element.");
	}

	return `${withoutExisting.slice(0, headClose)}${element}${withoutExisting.slice(headClose)}`;
}

export function staticHeadForPath(path: string): StaticHead {
	return {
		canonicalUrl: canonicalUrlForPath(path),
		robots: pageRobotsForPath(path),
		title: pageTitleForPath(path)
	};
}

export function rewriteStaticHead(html: string, path: string) {
	const head = staticHeadForPath(path);
	let rewritten = upsertHeadElement(
		html,
		TITLE_RE,
		`<title>${escapeHtmlText(head.title)}</title>`
	);
	rewritten = upsertHeadElement(
		rewritten,
		ROBOTS_META_RE,
		`<meta content="${escapeHtmlAttribute(head.robots)}" name="robots">`
	);
	rewritten = upsertHeadElement(
		rewritten,
		CANONICAL_LINK_RE,
		`<link href="${escapeHtmlAttribute(head.canonicalUrl)}" rel="canonical">`
	);

	return rewritten;
}
