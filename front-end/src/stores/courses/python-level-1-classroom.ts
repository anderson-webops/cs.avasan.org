import type { RawCourse, RawCourseModule, RawCourseModuleItem } from "./types";
import { pythonLevel1Course } from "./python-level-1";

function copyItem(item: RawCourseModuleItem): RawCourseModuleItem {
	return {
		...item,
		aliases: item.aliases ? [...item.aliases] : undefined
	};
}

function copyModule(module: RawCourseModule): RawCourseModule {
	return {
		...module,
		aliases: module.aliases ? [...module.aliases] : undefined,
		curriculum: module.curriculum.map(copyItem),
		supplementalProjects: module.supplementalProjects.map(copyItem)
	};
}

const classroomLaunchModule: RawCourseModule = {
	title: "Classroom Launch: Normal and Hard Projects",
	curriculum: [
		{
			title: "Classroom Workflow: Run, Normal, Hard",
			content: `Every classroom starter opens with a large completed framework so the first Run already produces something visible or interactive. Read the project card, run the unchanged code, and identify the two student-owned sections before editing.

Complete the **Normal** section first and test it without changing the shared framework. The **Hard** section is a separate challenge that can remain empty without breaking the project. Save a working checkpoint before attempting Hard so every student keeps a version they can demonstrate.

During a class share, show the finished result, point to the section you changed, and explain one prediction, one test, and one repair. Outputs and ideas may be compared, but every presenter explains their own Normal work before presenting a Hard addition.`
		},
		{
			title: "Launch Project 1: Color Circle Art",
			content: `The completed framework draws three colorful circle bursts and keeps the reusable movement, fill, loop, and positioning code intact.

**Normal:** Complete \`choose_circle_color(circle_index)\` by returning one color from \`ART_COLORS\`. Use the index to alternate colors after one constant color works.

**Hard:** Complete \`add_burst_detail(x_position, y_position)\` with a center, border, label, or smaller repeated design. Keep all three bursts visible and avoid connecting travel lines.`,
			projectLink: "/ide?mode=turtle&template=circle-art"
		},
		{
			title: "Launch Project 2: Picasso Keyboard Painter",
			content: `The starter supplies the imports, color list, black canvas, Turtle object, key bindings, and event loop so the editable work stays focused on visible drawing functions.

**Normal:** Complete \`draw_square()\` so pressing S draws a filled square at the current position. Start with four equal sides and four right turns, then use \`choice(colors)\` for the fill.

**Hard:** Complete \`draw_bonus_shape()\` so pressing B adds a different shape, layered design, or short animation. The S key must continue working after the Hard addition.`,
			projectLink: "/ide?mode=turtle&template=picasso"
		},
		{
			title: "Launch Project 3: Triangle Motion",
			content: `The completed framework manages the yellow canvas, redraw cycle, horizontal movement, arrow-key listeners, and screen updates.

**Normal:** Complete \`draw_triangle()\` with three equal sides and the provided turn angle. Add a fill only after the outline closes correctly.

**Hard:** Complete \`add_triangle_detail()\` with an interior pattern, face, border, or second shape that moves with the triangle. Verify both arrow keys still redraw cleanly.`,
			projectLink: "/ide?mode=turtle&template=triangle-motion"
		},
		{
			title: "Launch Project 4: Neon Trail Painter",
			content: `The finished controls already move, turn, clear, and draw a glowing trail on a black canvas. A fallback palette keeps the painter working before either student section is complete.

**Normal:** Complete \`choose_trail_color()\` by returning a valid palette color. Then try \`random.choice(TRAIL_COLORS)\` and compare the two results.

**Hard:** Complete \`add_special_effect()\` with a stamp, burst, shape, or short pattern for the Space bar. The arrow controls and C clear key must still work.`,
			projectLink: "/ide?mode=turtle&template=neon-trail"
		},
		{
			title: "Launch Project 5: Firework Festival",
			content: `The shared code draws complete radial fireworks wherever the canvas is clicked and begins with two finished examples.

**Normal:** Complete \`choose_firework_color()\` by returning a palette color or using \`random.choice(FIREWORK_COLORS)\`. Click several positions to test the result.

**Hard:** Complete \`add_bonus_sparks(x_position, y_position, color_name)\` with a second ring, contrasting center, or smaller sparks. Keep the click location as the center of every added feature.`,
			projectLink: "/ide?mode=turtle&template=firework-festival"
		},
		{
			title: "Launch Project 6: Spiral Galaxy",
			content: `The completed loop builds a mathematical spiral, changes colors safely, places stars, and updates the full scene.

**Normal:** Complete \`choose_star_color(step_number)\` with a valid color. Use the step number and remainder operator to create a repeating two-color pattern.

**Hard:** Complete \`add_space_feature()\` with a planet, moon, comet, constellation, or second galaxy. Place the feature without erasing or covering the main spiral.`,
			projectLink: "/ide?mode=turtle&template=spiral-galaxy"
		},
		{
			title: "Launch Project 7: Turtle Race Day",
			content: `The starter builds the track, creates four racers, animates random movement, detects a winner, and supports a new race with the Space bar.

**Normal:** Complete \`choose_racer_color(racer_number)\` so every racer receives a valid color. Use the racer number to select from the provided list.

**Hard:** Complete \`add_finish_celebration(winner)\` with confetti, a winner label, a victory lap, or another visible effect. A second race must still reset correctly.`,
			projectLink: "/ide?mode=turtle&template=turtle-race"
		},
		{
			title: "Launch Project 8: Flower Garden Clicker",
			content: `The completed framework plants flowers at click positions, draws stems and petals, supplies fallback colors, and starts with a small garden.

**Normal:** Complete \`choose_petal_color(x_position, y_position)\` by returning a palette color. Use one coordinate to make flowers on different sides use different colors.

**Hard:** Complete \`add_garden_detail(x_position, y_position)\` with a leaf, butterfly, face, grass, or another detail positioned relative to the flower. C must still clear the garden.`,
			projectLink: "/ide?mode=turtle&template=flower-garden"
		},
		{
			title: "Launch Project 9: Maze Explorer",
			content: `The shared code draws a complete maze, blocks movement through walls and boundaries, handles all arrow keys, and detects the goal.

**Normal:** Complete \`choose_player_color()\` with one valid color, then run and guide the explorer through the existing path.

**Hard:** Complete \`add_victory_art()\` with a message, trophy, burst, or animation that appears only at the goal. The collision rules must remain correct after the addition.`,
			projectLink: "/ide?mode=turtle&template=maze-explorer"
		},
		{
			title: "Classroom Debugging and Showcase Routine",
			content: `When a change fails, stop at the first useful error or unexpected visual result. Read the named line, compare it with the last working checkpoint, make one edit, and run again. Keep the completed framework unchanged unless that section is explicitly opened for study.

For a project share, demonstrate the Normal result first. If the Hard section is complete, show it second and identify how it depends on the original framework. End by naming one Python idea used, one bug repaired, and one next improvement that would be safe to attempt.`
		}
	],
	supplementalProjects: [
		{
			title: "Launch Remix: Palette and Theme",
			content: `Choose one launch project and preserve its completed framework while creating a consistent visual theme.

**Normal:** Replace the provided palette with a readable set of colors and explain which constant or list controls the result.

**Hard:** Add a second theme that can be selected with a key, click, variable, or function argument without duplicating the drawing framework.`,
			projectLink: "/ide?mode=turtle&template=circle-art"
		},
		{
			title: "Launch Remix: Controls and Feedback",
			content: `Choose an interactive launch project and trace each control from its event listener to the visible canvas response.

**Normal:** Add one control that changes movement, color, drawing, or clearing and verify that the original controls still work.

**Hard:** Add visible feedback for the current mode or state, then test repeated input and a reset path.`,
			projectLink: "/ide?mode=turtle&template=neon-trail"
		}
	]
};

const CLASSROOM_LAUNCH_CORE_TITLES = new Set([
	"Classroom Workflow: Run, Normal, Hard",
	"Launch Project 1: Color Circle Art",
	"Launch Project 2: Picasso Keyboard Painter",
	"Classroom Debugging and Showcase Routine"
]);
const CLASSROOM_LAUNCH_CHOICE_TITLES = new Set([
	"Launch Project 3: Triangle Motion",
	"Launch Project 4: Neon Trail Painter",
	"Launch Project 5: Firework Festival",
	"Launch Project 6: Spiral Galaxy",
	"Launch Remix: Palette and Theme"
]);
const CLASSROOM_LAUNCH_CHALLENGE_TITLES = new Set([
	"Launch Project 7: Turtle Race Day",
	"Launch Project 8: Flower Garden Clicker",
	"Launch Project 9: Maze Explorer",
	"Launch Remix: Controls and Feedback"
]);
const CLASSROOM_SLUG_COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const CLASSROOM_SLUG_NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const CLASSROOM_SLUG_LEADING_HYPHENS_RE = /^-+/;
const CLASSROOM_SLUG_TRAILING_HYPHENS_RE = /-+$/;

function classroomSlugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(CLASSROOM_SLUG_COMBINING_MARKS_RE, "")
		.replace(CLASSROOM_SLUG_NON_ALPHANUMERIC_RE, "-")
		.replace(CLASSROOM_SLUG_LEADING_HYPHENS_RE, "")
		.replace(CLASSROOM_SLUG_TRAILING_HYPHENS_RE, "");
}

function configureClassroomLaunch(module: RawCourseModule) {
	const legacyModuleId = classroomSlugify(
		`python-level-1-classroom-${module.title}`
	);
	module.id ??= legacyModuleId;

	for (const item of module.curriculum) {
		item.id ??= classroomSlugify(
			`${legacyModuleId}-curriculum-${item.title}`
		);
	}
	for (const item of module.supplementalProjects) {
		item.id ??= classroomSlugify(
			`${legacyModuleId}-supplemental-${item.title}`
		);
	}

	const movedProjects = module.curriculum.filter(
		item => !CLASSROOM_LAUNCH_CORE_TITLES.has(item.title)
	);
	module.curriculum = module.curriculum.filter(item =>
		CLASSROOM_LAUNCH_CORE_TITLES.has(item.title)
	);

	for (const item of module.curriculum) {
		item.learningPath = "core";
	}
	for (const item of movedProjects) {
		if (CLASSROOM_LAUNCH_CHALLENGE_TITLES.has(item.title)) {
			item.learningPath = "challenge";
		} else if (CLASSROOM_LAUNCH_CHOICE_TITLES.has(item.title)) {
			item.learningPath = "choice";
		} else {
			throw new Error(
				`Classroom launch project is missing a path: ${item.title}.`
			);
		}
	}
	for (const item of module.supplementalProjects) {
		if (CLASSROOM_LAUNCH_CHALLENGE_TITLES.has(item.title)) {
			item.learningPath = "challenge";
		} else if (CLASSROOM_LAUNCH_CHOICE_TITLES.has(item.title)) {
			item.learningPath = "choice";
		} else {
			throw new Error(
				`Classroom launch remix is missing a path: ${item.title}.`
			);
		}
	}

	module.supplementalProjects = [
		...movedProjects,
		...module.supplementalProjects
	];
	module.estimatedTime = "2–3 sessions · 45–60 minutes each";
	module.keyBlocks = [
		"run before editing",
		"Normal section",
		"Hard section",
		"save a working checkpoint",
		"predict, test, repair, explain"
	];

	const workflow = module.curriculum[0];
	if (workflow) {
		workflow.content = [
			workflow.content,
			"**Course flow:** Complete Color Circle Art and Picasso Keyboard Painter as the shared launch. Choose the remaining showcase projects by concept or interest; Turtle Race, Flower Garden, and Maze Explorer are the harder systems challenges."
		].join("\n\n");
	}
}

configureClassroomLaunch(classroomLaunchModule);

export const pythonLevel1ClassroomCourse: RawCourse = {
	name: "Python Level 1: Classroom Edition",
	modules: [
		classroomLaunchModule,
		...pythonLevel1Course.modules.slice(1).map(copyModule)
	]
};
