import type { UserModule } from "@/types";

export type DocumentCspProfile = "code-ide" | "standard";

const urlParsingBase = "https://cs.avasan.invalid/";

function parsedUrl(value: string | URL, base = urlParsingBase) {
	return value instanceof URL ? value : new URL(value, base);
}

export function documentCspProfile(value: string | URL): DocumentCspProfile {
	const { pathname } = parsedUrl(value);
	return /^\/(?:bluej|ide|python-ide)(?:\.html)?(?:\/|$)/u.test(pathname)
		? "code-ide"
		: "standard";
}

function canonicalCodeIdeAliasTarget(target: URL) {
	const normalizedPath = target.pathname.replace(/\/+$/u, "");
	const aliasPath = normalizedPath.replace(/\.html$/u, "");
	if (!["/bluej", "/ide", "/python-ide"].includes(aliasPath)) {
		return null;
	}

	if (aliasPath !== "/bluej" || target.searchParams.has("mode")) {
		return `/ide/${target.search}${target.hash}`;
	}

	const search = new URLSearchParams(target.search);
	search.set("mode", "bluej");
	return `/ide/?${search.toString()}${target.hash}`;
}

export function cspDocumentNavigationTarget(
	currentHref: string,
	targetHref: string
) {
	const current = parsedUrl(currentHref);
	const target = parsedUrl(targetHref, current.href);

	if (current.origin !== target.origin) {
		return null;
	}
	if (documentCspProfile(current) === documentCspProfile(target)) {
		return null;
	}

	const canonicalCodeIdeTarget = canonicalCodeIdeAliasTarget(target);
	if (canonicalCodeIdeTarget) return canonicalCodeIdeTarget;

	const navigationTarget = `${target.pathname}${target.search}${target.hash}`;

	if (
		navigationTarget ===
		`${current.pathname}${current.search}${current.hash}`
	) {
		return null;
	}

	return navigationTarget;
}

export const install: UserModule = ({ isClient, router }) => {
	if (!isClient) return;

	router.beforeEach(to => {
		const target = cspDocumentNavigationTarget(
			window.location.href,
			router.resolve(to).href
		);
		if (!target) return;

		// CSP belongs to the current HTML document. Crossing between the
		// standard site and the IDE therefore requires a fresh response.
		window.location.assign(target);
		return false;
	});
};
