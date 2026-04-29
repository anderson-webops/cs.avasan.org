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
				"This branch keeps Java focused on console programs, data modeling, files, collections, algorithms, testing habits, and larger service-style projects. It intentionally removes optional BlueJ/static drawing projects so the sequence works cleanly for students who do not want graphics setup or coordinate-drawing work."
		},
		{
			title: "What This Branch Keeps",
			content:
				"Keep the full Java Level 1-3 progression: typed variables, input/output, conditionals, loops, methods, arrays, 2D arrays, object modeling, inheritance, maps, file I/O, recursion, sorting/searching, data structures, graph work, and the new advanced Java continuation modules after C++ Level 3."
		}
	],
	supplementalProjects: [
		{
			title: "Branch Checkpoint: Console Project Choice",
			content:
				"Choose one console project from the current unit and add one stricter validation rule or cleaner helper method. The point is to reinforce program structure without adding graphics requirements."
		},
		{
			title: "Branch Checkpoint: Explain the No-Graphics Tradeoff",
			content:
				"Write a short note explaining what the branch gains by avoiding graphics setup and what kind of visual feedback a graphics branch would provide instead."
		}
	]
};

const graphicsIntroModule: RawCourseModule = {
	title: "Java Track Map: With Graphics",
	curriculum: [
		{
			title: "Graphics Branch Positioning",
			content:
				"This branch keeps the same core Java foundations but preserves and highlights drawing-based projects. Use it when a student benefits from coordinates, color, visual feedback, and scene composition alongside console and data-structure work."
		},
		{
			title: "Graphics Setup Expectations",
			content:
				"Keep graphics work intentionally small and local: students should understand coordinates, shape sizing, color selection, repeated drawing with loops, and helper methods that compose a larger scene. Do not let graphics setup replace the main Java goals of clean control flow and object design."
		}
	],
	supplementalProjects: [
		{
			title: "Graphics Branch Checkpoint: Coordinate Sketch",
			content:
				"Before coding, sketch a small coordinate plane and label the top-left origin, x direction, y direction, width, and height for three planned shapes."
		},
		{
			title: "Graphics Branch Checkpoint: Scene Decomposition",
			content:
				"Pick a drawing project and split it into helper methods such as background, main character, details, and repeated decorations."
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
					"Teach the drawing surface as a coordinate system with an origin, x/y directions, widths, heights, colors, and layering order. Students should predict where a shape appears before running the program."
			},
			{
				title: "Java Graphics Project 1: Rainbow",
				content:
					"Use rectangles, arcs, or repeated colored shapes to build a six-color rainbow while keeping the coordinate math readable.",
				projectLink:
					"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow",
				solutionLink:
					"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow"
			},
			{
				title: "Java Graphics Project 2: Snowman Scene",
				content:
					"Draw and customize a snowman with repeated shapes, color choices, and at least three extra scene details such as snowflakes, arms, scarf, or ground.",
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
					"Use conditionals to choose which shape to draw based on a string command, then add input validation for unknown shapes.",
				projectLink:
					"https://static.junilearning.com/java1/js3-which-shape.java",
				solutionLink:
					"https://static.junilearning.com/java1/js3-which-shape.java"
			}
		]
	},
	{
		title: "Java Graphics Branch 2: Loops, Methods, and Scene Composition",
		curriculum: [
			{
				title: "Drawing with Loops and Helper Methods",
				content:
					"Move from one-off shapes to repeated visual structure. Cover loop-driven patterns, random placement, helper methods for reusable drawing pieces, and the difference between visual complexity and code complexity."
			},
			{
				title: "Java Graphics Project 1: Paintball Pattern",
				content:
					"Use loops and coordinates to draw repeated circles or other marks in diagonal, grid, or randomized patterns.",
				projectLink:
					"https://static.junilearning.com/java1/js4-paintball.java",
				solutionLink:
					"https://static.junilearning.com/java1/js4-paintball.java"
			},
			{
				title: "Java Graphics Project 2: Picasso Method Art",
				content:
					"Use methods plus random size, color, and position choices to generate abstract art from repeated shape families.",
				projectLink:
					"https://static.junilearning.com/java1/js6-picasso.java",
				solutionLink:
					"https://static.junilearning.com/java1/js6-picasso.java"
			}
		],
		supplementalProjects: [
			{
				title: "Java Graphics Project 3: Scene Composer",
				content:
					"Combine at least three helper methods into one original scene. Require a short written plan that names each helper and explains what visual responsibility it owns."
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
