import { describe, expect, it } from "vitest";
import { pageTitleForPath } from "@/modules/pageHead";

describe("page head helpers", () => {
	it.each([
		["/", "Classes with Julio"],
		["/courses", "Courses | Classes with Julio"],
		[
			"/course-resource?asset=/course-assets/python/reference.md",
			"Course Resource | Classes with Julio"
		],
		["/python-ide", "Python IDE | Classes with Julio"],
		["/about/", "About Julio | Classes with Julio"],
		["/admin", "Teacher Admin | Classes with Julio"],
		["/profile", "Teacher Account | Classes with Julio"],
		["/not-a-real-page", "Page Not Found | Classes with Julio"]
	])("returns a useful title for %s", (path, title) => {
		expect(pageTitleForPath(path)).toBe(title);
	});

	it.each(["/signup", "/payment", "/zoom", "/pathways"])(
		"does not preserve a product title for removed route %s",
		path => {
			expect(pageTitleForPath(path)).toBe(
				"Page Not Found | Classes with Julio"
			);
		}
	);
});
