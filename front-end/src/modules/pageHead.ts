const SITE_TITLE = "Classes with Julio";

const ROUTE_TITLES: Array<[RegExp, string]> = [
	[/^\/$/, SITE_TITLE],
	[/^\/courses(?:\/|$)/, "Courses"],
	[/^\/course-resource(?:\/|$)/, "Course Resource"],
	[/^\/python-ide(?:\/|$)/, "Python IDE"],
	[/^\/about(?:\/|$)/, "About Julio"],
	[/^\/admin(?:\/|$)/, "Teacher Admin"],
	[/^\/profile(?:\/|$)/, "Teacher Account"]
];

function normalizePath(path: string) {
	const normalized = path.trim().split(/[?#]/, 1)[0] || "/";
	if (normalized === "/") return normalized;
	return normalized.replace(/\/+$/g, "");
}

export function pageTitleForPath(path: string) {
	const normalized = normalizePath(path);
	const matchedTitle =
		ROUTE_TITLES.find(([pattern]) => pattern.test(normalized))?.[1] ??
		"Page Not Found";

	return matchedTitle === SITE_TITLE
		? SITE_TITLE
		: `${matchedTitle} | ${SITE_TITLE}`;
}
