export const SITE_TITLE = "Classes with Julio";
export const SITE_URL = "https://cs.avasan.org";
export const SITE_DESCRIPTION =
	"Scratch, Python, and PyGames courses from grade-school teacher Julio.";
export const INDEX_ROBOTS =
	"index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
export const NOINDEX_ROBOTS = "noindex,nofollow";

const ROUTE_TITLES = new Map([
	["/", SITE_TITLE],
	["/course-resource", "Course Resource"],
	["/python-ide", "Python IDE"],
	["/games", "Games"],
	["/games/pond-paddlers", "Pond Paddlers"],
	["/games/crosswalk-critters", "Crosswalk Critters"],
	["/games/machine-workshop", "Machine Workshop"],
	["/games/comet-hopper", "Comet Hopper"],
	["/student-privacy", "Student Privacy"],
	["/admin", "Teacher Admin"]
]);

export function normalizePagePath(path: string) {
	const normalized = path.trim().split(/[?#]/, 1)[0] || "/";
	if (normalized === "/") return normalized;
	return normalized.replace(/\/+$/g, "");
}

export function pageTitleForPath(path: string) {
	const matchedTitle =
		ROUTE_TITLES.get(normalizePagePath(path)) ?? "Page Not Found";

	return matchedTitle === SITE_TITLE
		? SITE_TITLE
		: `${matchedTitle} | ${SITE_TITLE}`;
}

export function pageRobotsForPath(path: string) {
	return ["/", "/student-privacy"].includes(normalizePagePath(path))
		? INDEX_ROBOTS
		: NOINDEX_ROBOTS;
}

export function canonicalUrlForPath(path: string, siteUrl = SITE_URL) {
	return new URL(normalizePagePath(path), `${siteUrl}/`).toString();
}
