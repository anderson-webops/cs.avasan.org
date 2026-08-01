import type { UserModule } from "@/types";

export type DocumentCspProfile = "python-ide" | "standard";

const urlParsingBase = "https://cs.avasan.invalid/";

function parsedUrl(value: string | URL, base = urlParsingBase) {
	return value instanceof URL ? value : new URL(value, base);
}

export function documentCspProfile(value: string | URL): DocumentCspProfile {
	const { pathname } = parsedUrl(value);
	return pathname === "/python-ide" ||
		pathname === "/python-ide.html" ||
		pathname.startsWith("/python-ide/")
		? "python-ide"
		: "standard";
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

	const isPythonIdeAlias =
		target.pathname === "/python-ide" ||
		target.pathname === "/python-ide.html";
	const targetPath = isPythonIdeAlias ? "/python-ide/" : target.pathname;
	const navigationTarget = `${targetPath}${target.search}${target.hash}`;
	if (isPythonIdeAlias) return navigationTarget;

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
		// standard site and Python IDE therefore requires a fresh response.
		window.location.assign(target);
		return false;
	});
};
