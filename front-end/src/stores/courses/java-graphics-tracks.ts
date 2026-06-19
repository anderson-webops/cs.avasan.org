import type { RawCourse, RawCourseModule, RawCourseModuleItem } from "./types";
import { javaLevel1Course } from "./java-level-1";
import { javaLevel2Course } from "./java-level-2";
import { javaLevel3Course } from "./java-level-3";

const graphicsTerms = [
	"bluej",
	"graphics",
	"fillrect",
	"filloval",
	"fillarc",
	"setcolor",
	"pac-man",
	"paintball",
	"picasso",
	"rainbow",
	"snowman",
	"which shape",
	"basic shapes",
	"happy graphics"
];

function cloneItem(item: RawCourseModuleItem): RawCourseModuleItem {
	return { ...item };
}

function cloneModule(
	module: RawCourseModule,
	courseLabel: string
): RawCourseModule {
	return {
		title: `${courseLabel}: ${module.title}`,
		curriculum: module.curriculum.map(cloneItem),
		supplementalProjects: module.supplementalProjects.map(cloneItem)
	};
}

function isGraphicsItem(item: RawCourseModuleItem) {
	const searchable = [
		item.title,
		item.content,
		item.projectLink ?? "",
		item.solutionLink ?? ""
	]
		.join(" ")
		.toLowerCase();

	return graphicsTerms.some(term => searchable.includes(term));
}

function withoutGraphics(module: RawCourseModule, courseLabel: string) {
	const filteredModule = {
		title: `${courseLabel}: ${module.title}`,
		curriculum: module.curriculum
			.filter(item => !isGraphicsItem(item))
			.map(cloneItem),
		supplementalProjects: module.supplementalProjects
			.filter(item => !isGraphicsItem(item))
			.map(cloneItem)
	};

	return filteredModule.curriculum.length > 0 ||
		filteredModule.supplementalProjects.length > 0
		? filteredModule
		: null;
}

function courseModules(course: RawCourse, courseLabel: string) {
	return course.modules.map(module => cloneModule(module, courseLabel));
}

function courseModulesWithoutGraphics(course: RawCourse, courseLabel: string) {
	return course.modules
		.map(module => withoutGraphics(module, courseLabel))
		.filter((module): module is RawCourseModule => module !== null);
}

const noGraphicsIntroModule: RawCourseModule = {
	title: "Java Track Map: Without Graphics",
	curriculum: [
		{
			title: "Console-First Java Path",
			content:
				"**Concept path:** This branch keeps Java focused on console programs, data modeling, files, collections, algorithms, testing habits, and larger service-style projects. It intentionally removes optional BlueJ/static drawing projects so the sequence works cleanly without graphics setup or coordinate-drawing work.\n\n**What changes:** Visual feedback is replaced with stronger command-line evidence: prompts, output transcripts, saved files, test fixtures, and small service objects that can be exercised without a UI. The result is better preparation for backend tools, AP CSA review, data processing, and design-pattern work.\n\n**Pacing note:** The branch can move quickly through drawing-only projects, but it should not skip the design decisions those projects sometimes hide: naming state, decomposing helpers, validating inputs, and proving behavior with repeatable examples."
		},
		{
			title: "What This Branch Keeps",
			content:
				"**Concept path:** Keep the full Java Level 1-3 progression: typed variables, input/output, conditionals, loops, methods, arrays, 2D arrays, object modeling, inheritance, maps, file I/O, recursion, sorting/searching, data structures, graph work, and the advanced Java continuation modules after C++ Level 3.\n\n**Replacement emphasis:** When a graphics module is skipped, replace it with console or file-backed practice that exercises the same programming idea. Repeated drawing becomes loop practice, scene helpers become method decomposition, and visual state becomes printed, saved, or tested state.\n\n**Evidence target:** A no-graphics project should still be observable. Use tests, sample input/output runs, saved fixture files, and clear error cases so correctness is not reduced to “the console did something.”"
		}
	],
	supplementalProjects: [
		{
			title: "Branch Checkpoint: Console Project Choice",
			content:
				"Choose one console project from the current unit and add one stricter validation rule or cleaner helper method. The point is to reinforce program structure without adding graphics requirements.\n\n**Completion check:** Name the exact behavior being protected, show one input that used to be weak or ambiguous, and explain how the helper method or validation rule makes the main program easier to read."
		},
		{
			title: "Branch Checkpoint: Explain the No-Graphics Tradeoff",
			content:
				"Write a short note explaining what the branch gains by avoiding graphics setup and what kind of visual feedback a graphics branch would provide instead.\n\n**Completion check:** The note should identify one strength of console-first work, one limitation, and one concrete form of non-visual evidence such as tests, logs, saved files, or a reproducible transcript."
		}
	]
};

const graphicsIntroModule: RawCourseModule = {
	title: "Java Track Map: With Graphics",
	curriculum: [
		{
			title: "Graphics Branch Positioning",
			content:
				"**Concept path:** This branch keeps the same core Java foundations but preserves and highlights drawing-based projects. Use it for work that benefits from coordinates, color, visual feedback, and scene composition alongside console and data-structure practice.\n\n**Design guardrail:** Graphics should make program state easier to inspect, not replace reasoning about state. The stronger projects still name their inputs, model values, helper methods, and edge cases before adding visual polish.\n\n**Evidence target:** A graphics project is complete when the visual output can be explained from code structure: which method draws each part, which variables control placement or size, and what change would produce a predictable new result."
		},
		{
			title: "Graphics Setup Expectations",
			content:
				"**Concept path:** Keep graphics work intentionally small and local: understand coordinates, shape sizing, color selection, repeated drawing with loops, and helper methods that compose a larger scene. Do not let graphics setup replace the main Java goals of clean control flow and object design.\n\n**Setup boundary:** Graphics setup is useful only after the compile-run workflow is stable. The project should first prove that a tiny shape renders, then add coordinate reasoning, repeated shapes, helper methods, and scene-level organization in separate steps.\n\n**Evidence target:** A graphics project should include a coordinate sketch, named helper methods, and at least one changed input or setting that visibly changes the output in a predictable way."
		}
	],
	supplementalProjects: [
		{
			title: "Graphics Branch Checkpoint: Coordinate Sketch",
			content:
				"Before coding, sketch a small coordinate plane and label the top-left origin, x direction, y direction, width, and height for three planned shapes.\n\n**Completion check:** The sketch should predict at least one exact rectangle or oval position before the program runs, then compare the prediction with the rendered result and revise the coordinate model if needed."
		},
		{
			title: "Graphics Branch Checkpoint: Scene Decomposition",
			content:
				"Pick a drawing project and split it into helper methods such as background, main character, details, and repeated decorations.\n\n**Completion check:** Each helper should own one visual responsibility and receive enough parameters to avoid hard-coding every detail. The final scene should be easier to modify because repeated drawing logic lives in named methods."
		}
	]
};

const graphicsBranchModules: RawCourseModule[] = [
	{
		title: "Java Graphics Branch 1: Coordinates, Color, and Shapes",
		curriculum: [
			{
				title: "Coordinate Systems and Drawing Primitives",
				content:
					"**Concept path:** This section covers the drawing surface as a coordinate system with an origin, x/y directions, widths, heights, colors, and layering order. Predict where a shape appears before running the program.\n\n**Practice targets:** Draw one shape by hand from its coordinates, change only one parameter, and predict the visual effect before rerunning. Include one overlap or layering example so drawing order is visible.\n\n**Evidence target:** The coordinate explanation should account for both position and size. A common error is treating width and height as the second corner instead of dimensions measured from the starting coordinate."
			},
			{
				title: "Java Graphics Project 1: Rainbow",
				content:
					"Use rectangles, arcs, or repeated colored shapes to build a six-color rainbow while keeping the coordinate math readable.\n\n**Completion check:** The color sequence, repeated spacing rule, and shape dimensions should be easy to adjust from one place instead of copied across unrelated statements.",
				projectLink:
					"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow",
				solutionLink:
					"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow"
			},
			{
				title: "Java Graphics Project 2: Snowman Scene",
				content:
					"Draw and customize a snowman with repeated shapes, color choices, and at least three extra scene details such as snowflakes, arms, scarf, or ground.\n\n**Completion check:** The scene should use helper methods or grouped code so body parts, accessories, and background details can be understood separately.",
				projectLink:
					"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Snowman",
				solutionLink:
					"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Snowman"
			}
		],
		supplementalProjects: [
			{
				title: "Java Graphics Project 3: Which Shape?",
				content:
					"Use conditionals to choose which shape to draw based on a string command, then add input validation for unknown shapes.\n\n**Completion check:** Test at least three known shape commands and one unknown command. The unknown case should produce a clear fallback instead of failing silently.",
				projectLink:
					"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS3_Which_Shape.java",
				solutionLink:
					"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS3_Which_Shape.java"
			}
		]
	},
	{
		title: "Java Graphics Branch 2: Loops, Methods, and Scene Composition",
		curriculum: [
			{
				title: "Drawing with Loops and Helper Methods",
				content:
					"**Concept path:** Move from one-off shapes to repeated visual structure. Cover loop-driven patterns, random placement, helper methods for reusable drawing pieces, and the difference between visual complexity and code complexity.\n\n**Practice targets:** Start with one correctly placed shape, convert it into a helper method, then call it from a loop with changing coordinates, color, or size. A strong result makes the repeated rule visible in code.\n\n**Evidence target:** The final scene should become shorter or easier to adjust because repetition moved into a loop or helper method. If adding the tenth object requires copying the same long block again, the decomposition has not done enough work."
			},
			{
				title: "Java Graphics Project 1: Paintball Pattern",
				content:
					"Use loops and coordinates to draw repeated circles or other marks in diagonal, grid, or randomized patterns.\n\n**Completion check:** The pattern should have a named rule: diagonal step, grid spacing, random seed/range, or another repeatable constraint that can be explained from the loop variables.",
				projectLink:
					"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS4_Paintball.java",
				solutionLink:
					"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS4_Paintball.java"
			},
			{
				title: "Java Graphics Project 2: Picasso Method Art",
				content:
					"Use methods plus random size, color, and position choices to generate abstract art from repeated shape families.\n\n**Completion check:** At least two helper methods should draw different shape families, and the random choices should stay within visible bounds so the result looks intentional rather than accidental.",
				projectLink:
					"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS6_Picasso.java",
				solutionLink:
					"https://github.com/instruction-material/Java-Level-1/blob/main/graphics/JS6_Picasso.java"
			}
		],
		supplementalProjects: [
			{
				title: "Java Graphics Project 3: Scene Composer",
				content:
					"Combine at least three helper methods into one original scene. Include a short written plan that names each helper and explains what visual responsibility it owns.\n\n**Completion check:** The scene should be easier to extend because new details can be added through another helper call instead of editing one long drawing block."
			}
		]
	}
];

export const javaWithoutGraphicsCourse: RawCourse = {
	name: "Java without Graphics",
	modules: [
		noGraphicsIntroModule,
		...courseModulesWithoutGraphics(javaLevel1Course, "Java Level 1"),
		...courseModulesWithoutGraphics(javaLevel2Course, "Java Level 2"),
		...courseModulesWithoutGraphics(javaLevel3Course, "Java Level 3")
	]
};

export const javaWithGraphicsCourse: RawCourse = {
	name: "Java with Graphics",
	modules: [
		graphicsIntroModule,
		...courseModules(javaLevel1Course, "Java Level 1"),
		...graphicsBranchModules,
		...courseModules(javaLevel2Course, "Java Level 2"),
		...courseModules(javaLevel3Course, "Java Level 3")
	]
};
