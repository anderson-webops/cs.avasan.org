import { describe, expect, it } from "vitest";
import {
	cspDocumentNavigationTarget,
	documentCspProfile
} from "@/modules/cspNavigation";

describe("document CSP navigation boundary", () => {
	it.each([
		["/ide", "code-ide"],
		["/ide/", "code-ide"],
		["/ide/?course=python-1#editor", "code-ide"],
		["/ide.html", "code-ide"],
		["/bluej", "code-ide"],
		["/bluej.html?course=java#files", "code-ide"],
		["/python-ide", "code-ide"],
		["/python-ide.html?course=python-2#files", "code-ide"],
		[
			"https://cs.avasan.org/python-ide/assets/manifest.json",
			"code-ide"
		],
		["/", "standard"],
		["/student-privacy", "standard"],
		["/ideology", "standard"],
		["/courses/ide", "standard"],
		["/python-ideology", "standard"]
	] as const)("classifies %s as %s", (href, profile) => {
		expect(documentCspProfile(href)).toBe(profile);
	});

	it.each([
		[
			"https://cs.avasan.org/",
			"/ide?starterUrl=%2Fcourse.py#editor",
			"/ide/?starterUrl=%2Fcourse.py#editor"
		],
		[
			"https://cs.avasan.org/",
			"/python-ide?course=python-1#editor",
			"/ide/?course=python-1#editor"
		],
		[
			"https://cs.avasan.org/",
			"/bluej?course=java#files",
			"/ide/?course=java&mode=bluej#files"
		],
		[
			"https://cs.avasan.org/ide/?course=python-1#editor",
			"/student-privacy?from=ide#questions",
			"/student-privacy?from=ide#questions"
		],
		[
			"https://cs.avasan.org/admin/",
			"/ide.html?course=python-2#files",
			"/ide/?course=python-2#files"
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
			"https://cs.avasan.org/ide?course=python-1",
			"/ide/?course=python-2#editor"
		],
		["https://cs.avasan.org/ide/#editor", "/ide/#editor"],
		[
			"https://cs.avasan.org/ide/",
			"/python-ide?course=python-2#files"
		],
		["https://cs.avasan.org/ide/", "/bluej.html#editor"],
		["https://cs.avasan.org/", "https://example.com/ide"]
	] as const)(
		"does not reload within one profile or leave the current origin",
		(currentHref, targetHref) => {
			expect(
				cspDocumentNavigationTarget(currentHref, targetHref)
			).toBeNull();
		}
	);
});
