import { describe, expect, it } from "vitest";
import {
	isLessonLearningItem,
	lessonContentSections
} from "@/modules/courseLessonPresentation";
import { normalizeInlineCourseMarkdown } from "@/modules/courseMarkdown";

describe("lesson content presentation", () => {
	it("never absorbs required steps into a preceding learning goal", () => {
		for (const label of ["Build steps", "Your custom task"]) {
			const sections = lessonContentSections(
				`**Goal:** Learn events. **${label}:** Add keyboard controls. **Optional:** Add a score.`
			);
			expect(
				sections
					.filter(section => section.kind === "assignment")
					.map(section => section.content)
					.join(" ")
			).toContain("Add keyboard controls.");
			expect(
				sections.find(section => section.kind === "learn")?.content
			).not.toContain("Add keyboard controls.");
		}
	});

	it("keeps a goal visible when it is the only required work among asides", () => {
		const sections = lessonContentSections(
			"**Goal:** Build a game. **Note:** Save often. **Optional:** Add a score."
		);
		expect(sections.map(section => section.kind)).toEqual([
			"assignment",
			"note",
			"optional"
		]);
		expect(sections[0].content).toContain("Build a game.");
	});
	it("keeps shared Markdown reference definitions with their links", () => {
		const content =
			"**Instructions:** Read [the guide][guide].\n\n**Optional:** Try the extension.\n\n[guide]: https://example.invalid/guide";
		expect(lessonContentSections(content)).toEqual([
			{ kind: "assignment", label: "Assignment", content }
		]);
	});
	it("separates assignments, concepts, information and optional challenges", () => {
		const sections = lessonContentSections(
			"**Goal:** Understand keyboard events. **Instructions:** 1. Add a sprite. 2. Move it with arrows. **Info:** The stage uses coordinates. **Challenge:** Add a score."
		);
		expect(sections.map(section => section.kind)).toEqual([
			"learn",
			"assignment",
			"note",
			"optional"
		]);
		expect(sections[1].content).toContain(
			"1. Add a sprite.\n2. Move it with arrows."
		);
		expect(sections[3].content).toContain("Add a score.");
	});

	it("keeps normal work prominent and hard work optional", () => {
		expect(
			lessonContentSections(
				"**Normal:** Fill in the function.\n\n**Hard:** Add a second shape."
			).map(section => section.kind)
		).toEqual(["assignment", "optional"]);
		expect(
			lessonContentSections("**Focus:** Create a working loop.")[0].kind
		).toBe("assignment");
	});

	it("never hides a task that is written only as an objective", () => {
		const content = "**Objective:** Build a maze and test it.";
		expect(lessonContentSections(content)).toEqual([
			{ kind: "assignment", label: "Assignment", content }
		]);
	});

	it("preserves fenced and indented code, nested instructions and tables", () => {
		const content = [
			"Instructions:",
			"Build the program.",
			"",
			"```python",
			"Goal: = 'literal'",
			"• raw code",
			"```",
			"",
			"    Optional: = 'indented code'",
			"",
			"- **Note:** nested instruction",
			"",
			"| Name | Value |",
			"| --- | --- |",
			"| Goal: | 1 |"
		].join("\n");
		const sections = lessonContentSections(content);
		expect(sections).toHaveLength(1);
		expect(sections[0].content).toContain(
			"\n    Optional: = 'indented code'"
		);
		expect(sections[0].content).toContain("• raw code");
		expect(sections[0].content).toContain("- **Note:** nested instruction");
		expect(sections[0].content).toContain("| Goal: | 1 |");
	});

	it("does not interpret inherited object names as section labels", () => {
		expect(
			lessonContentSections("constructor: keep this instruction")[0]
		).toMatchObject({
			kind: "assignment",
			content: "constructor: keep this instruction"
		});
	});

	it("normalizes display bullets without changing program indentation", () => {
		expect(
			normalizeInlineCourseMarkdown("• Add a sprite.\n    • literal")
		).toBe("- Add a sprite.\n    • literal");
	});

	it("moves conceptual items to Learn but keeps linked projects and tasks", () => {
		const item = {
			id: "intro",
			title: "Scratch basics",
			content: "An overview."
		};
		expect(isLessonLearningItem(item)).toBe(true);
		expect(
			isLessonLearningItem({
				...item,
				title: "Verification Review: Starting in Scratch"
			})
		).toBe(true);
		expect(
			isLessonLearningItem({
				...item,
				title: "Clock Scheduling",
				content: "**Concept focus:** Learn timers."
			})
		).toBe(true);
		expect(
			isLessonLearningItem({
				...item,
				projectLink: "https://scratch.mit.edu/projects/123/"
			})
		).toBe(false);
		expect(
			isLessonLearningItem({ ...item, title: "Concepts Project" })
		).toBe(false);
		expect(isLessonLearningItem({ ...item, title: "Maze Challenge" })).toBe(
			false
		);
	});
});
