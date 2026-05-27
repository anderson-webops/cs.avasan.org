import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	extractMarkdownSection,
	loadCourseAssetSection,
	parseCourseAssetUrl,
	resetCourseAssetPreviewCache,
	slugMarkdownHeading
} from "@/modules/courseAssetPreview";

describe("course asset preview utilities", () => {
	beforeEach(() => {
		resetCourseAssetPreviewCache();
	});

	it("parses local Markdown course asset URLs and fragments", () => {
		expect(
			parseCourseAssetUrl(
				"/course-assets/chemistry/chemistry-materials-pack.md#heating-curve-data"
			)
		).toEqual({
			hash: "heating-curve-data",
			path: "/course-assets/chemistry/chemistry-materials-pack.md"
		});
		expect(parseCourseAssetUrl("https://example.com/file.md")).toBeNull();
		expect(parseCourseAssetUrl("/course-assets/chemistry/image.png")).toBeNull();
	});

	it("uses the same heading slug style as authored chemistry asset links", () => {
		expect(slugMarkdownHeading("Heating Curve Data")).toBe(
			"heating-curve-data"
		);
		expect(slugMarkdownHeading("Formula `H₂O` and pH")).toBe(
			"formula-ho-and-ph"
		);
	});

	it("extracts only the requested Markdown section", () => {
		const markdown = [
			"# Packet",
			"",
			"## Measurement Tables",
			"",
			"Measurement text.",
			"",
			"## Heating Curve Data",
			"",
			"Heating text.",
			"",
			"### Detail",
			"",
			"Nested detail.",
			"",
			"## Capstone Evidence Seeds",
			"",
			"Capstone text."
		].join("\n");

		const section = extractMarkdownSection(markdown, "heating-curve-data");

		expect(section).toContain("## Heating Curve Data");
		expect(section).toContain("Nested detail.");
		expect(section).not.toContain("Measurement text.");
		expect(section).not.toContain("Capstone text.");
	});

	it("fetches the asset file once and extracts the fragment locally", async () => {
		const fetcher = vi.fn(async () => ({
			ok: true,
			text: async () =>
				[
					"# Packet",
					"",
					"## Phase Diagram Data",
					"",
					"Phase text.",
					"",
					"## Other",
					"",
					"Other text."
				].join("\n")
		})) as any;

		const section = await loadCourseAssetSection(
			"/course-assets/chemistry/chemistry-materials-pack.md#phase-diagram-data",
			"Phase diagram data",
			fetcher
		);

		expect(fetcher).toHaveBeenCalledWith(
			"/course-assets/chemistry/chemistry-materials-pack.md"
		);
		expect(section.title).toBe("Phase Diagram Data");
		expect(section.content).toContain("Phase text.");
		expect(section.content).not.toContain("Other text.");
	});
});
