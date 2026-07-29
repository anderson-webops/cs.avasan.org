import { describe, expect, it } from "vitest";
import {
	INDEX_ROBOTS,
	NOINDEX_ROBOTS,
	canonicalUrlForPath,
	pageRobotsForPath,
	pageTitleForPath
} from "@/modules/pageHead";

describe("page head helpers", () => {
	it.each([
		["/", "Classes with Julio"],
		[
			"/course-resource?asset=/course-assets/python/reference.md",
			"Course Resource | Classes with Julio"
		],
		["/python-ide", "Python IDE | Classes with Julio"],
		["/admin", "Teacher Admin | Classes with Julio"],
		["/not-a-real-page", "Page Not Found | Classes with Julio"]
	])("returns a useful title for %s", (path, title) => {
		expect(pageTitleForPath(path)).toBe(title);
	});

	it.each([
		"/about",
		"/courses",
		"/profile",
		"/signup",
		"/payment",
		"/zoom",
		"/pathways"
	])("does not preserve a product title for removed route %s", path => {
		expect(pageTitleForPath(path)).toBe(
			"Page Not Found | Classes with Julio"
		);
	});

	it("indexes only the canonical public course catalog", () => {
		expect(pageRobotsForPath("/")).toBe(INDEX_ROBOTS);

		for (const path of [
			"/admin",
			"/course-resource",
			"/python-ide",
			"/not-a-real-page"
		]) {
			expect(pageRobotsForPath(path)).toBe(NOINDEX_ROBOTS);
		}
	});

	it("builds stable canonical URLs without query strings or trailing slashes", () => {
		expect(canonicalUrlForPath("/")).toBe("https://cs.avasan.org/");
		expect(canonicalUrlForPath("/python-ide/")).toBe(
			"https://cs.avasan.org/python-ide"
		);
		expect(
			canonicalUrlForPath(
				"/course-resource?asset=/course-assets/python/reference.md"
			)
		).toBe("https://cs.avasan.org/course-resource");
	});
});
