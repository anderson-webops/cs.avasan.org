import { describe, expect, it } from "vitest";
import {
	cspDocumentNavigationTarget,
	documentCspProfile
} from "@/modules/cspNavigation";

describe("document CSP navigation boundary", () => {
	it.each([
		["/python-ide", "python-ide"],
		["/python-ide/", "python-ide"],
		["/python-ide/?course=python-1#editor", "python-ide"],
		["/python-ide.html", "python-ide"],
		["/python-ide.html?course=python-2#files", "python-ide"],
		["https://cs.avasan.org/python-ide/assets/manifest.json", "python-ide"],
		["/", "standard"],
		["/student-privacy", "standard"],
		["/python-ideology", "standard"],
		["/courses/python-ide", "standard"]
	] as const)("classifies %s as %s", (href, profile) => {
		expect(documentCspProfile(href)).toBe(profile);
	});

	it.each([
		[
			"https://cs.avasan.org/",
			"/python-ide?starterUrl=%2Fcourse.py#editor",
			"/python-ide/?starterUrl=%2Fcourse.py#editor"
		],
		[
			"https://cs.avasan.org/python-ide/?course=python-1#editor",
			"/student-privacy?from=ide#questions",
			"/student-privacy?from=ide#questions"
		],
		[
			"https://cs.avasan.org/admin/",
			"/python-ide.html?course=python-2#files",
			"/python-ide/?course=python-2#files"
		]
	] as const)(
		"requires a fresh document when crossing policy profiles",
		(currentHref, targetHref, expected) => {
			expect(cspDocumentNavigationTarget(currentHref, targetHref)).toBe(
				expected
			);
		}
	);

	it.each([
		["https://cs.avasan.org/", "/student-privacy"],
		[
			"https://cs.avasan.org/python-ide?course=python-1",
			"/python-ide/?course=python-2#editor"
		],
		["https://cs.avasan.org/python-ide/#editor", "/python-ide/#editor"],
		[
			"https://cs.avasan.org/python-ide/",
			"/python-ide?course=python-2#files"
		],
		[
			"https://cs.avasan.org/python-ide/",
			"/python-ide.html?course=python-2#files"
		],
		["https://cs.avasan.org/python-ide", "/python-ide"],
		[
			"https://cs.avasan.org/python-ide.html#editor",
			"/python-ide.html#editor"
		],
		["https://cs.avasan.org/", "https://example.com/python-ide"]
	] as const)(
		"does not reload within one profile or leave the current origin",
		(currentHref, targetHref) => {
			expect(
				cspDocumentNavigationTarget(currentHref, targetHref)
			).toBeNull();
		}
	);
});
