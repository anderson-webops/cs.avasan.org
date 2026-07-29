import type { RawCourse, RawCourseModuleItem } from "./types";
import {
	copyClassroomCourseModules,
	createClassroomLaunchModule
} from "./classroom-course";
import { pyGamesCourse } from "./pygames";

const PYGAMES_SOURCE =
	"https://github.com/instruction-material/PyGames/blob/main";

function launchProject(
	title: string,
	content: string,
	sourceFile: string,
	learningPath: "choice" | "challenge"
): RawCourseModuleItem {
	return {
		title,
		content,
		learningPath,
		solutionLink: `${PYGAMES_SOURCE}/${sourceFile}`
	};
}

const classroomLaunchModule = createClassroomLaunchModule({
	courseId: "pygames-classroom",
	title: "Classroom Launch: Play, Extend, Explain",
	estimatedTime: "4–6 sessions · 45–60 minutes each",
	courseFlow:
		"Build Bouncing Alien and Apple Collector together as the shared launch. Choose later games by system: collections, physics, platforms, levels, projectiles, or enemy behavior. Platformer, Space Battle, and Space Invaders are the harder integrated builds.",
	keyBlocks: [
		"run the playable framework",
		"Normal section",
		"Hard section",
		"one-system-at-a-time playtest",
		"save, demonstrate, explain"
	],
	coreItems: [
		{
			title: "Classroom Workflow: Play, Normal, Hard",
			content: `Each classroom game begins with a playable program or a substantial completed framework. Run it unchanged, identify the input-update-draw cycle, and name the state that changes on each frame before editing.

Complete the **Normal** section first and save a playable checkpoint. The **Hard** section is independent and may remain empty without breaking the game. Add one system at a time and replay the same test after every change.

During a class share, demonstrate the controls, goal, feedback, and reset or end state. Explain one Normal change before showing any Hard extension.`
		},
		launchProject(
			"Launch Project 1: Bouncing Alien",
			`The working framework creates an Actor, updates velocity every frame, draws it, and reverses movement at the screen boundaries.

**Normal:** Complete the labeled addition with one visible speed, color, sound, or boundary-response change.

**Hard:** Add controlled acceleration, a second moving actor, or a state change on collision while keeping every edge bounce stable.`,
			"PyG1-Bouncing-Alien.py",
			"choice"
		),
		launchProject(
			"Launch Project 2: Apple Collector",
			`The completed game places an apple, handles mouse input, moves the target, and displays score feedback.

**Normal:** Add one score, timer, or position rule that responds to a successful click.

**Hard:** Add misses, lives, difficulty growth, or a restart state without breaking hit detection or allowing the target offscreen.`,
			"PyG2-Apple-Collector.py",
			"choice"
		),
		{
			title: "Classroom Playtest and Showcase Routine",
			content: `When a change fails, reproduce it with the same controls and record the state immediately before and after the failure. Check one responsibility at a time: input, update, collision, draw order, score, state transition, or reset.

For a showcase, play the Normal version first and explain the changed function or state variable. Show Hard second only if it remains reliably playable. End with one bug reproduction, one repair, and one next system that can be added without rewriting the framework.`
		}
	],
	optionalItems: [
		launchProject(
			"Launch Project 3: Asteroid Dodge",
			`The framework supplies a player, falling obstacles, movement, collision, and survival state.

**Normal:** Add one obstacle speed, spawn, score, or player-control adjustment and verify a complete play-to-failure loop.

**Hard:** Add waves, lives, multiple obstacle types, or a reliable restart while removing offscreen objects safely.`,
			"PyG3-Asteroid-Dodge.py",
			"choice"
		),
		launchProject(
			"Launch Project 4: Jewel Catch",
			`The completed game manages a player, lists of gems and bombs, score changes, resets, and boundary movement.

**Normal:** Add one collectible rule or feedback effect that works for every object in its list.

**Hard:** Add levels, increasing object speed, lives, or a second collectible type without duplicating the update framework.`,
			"PyG4-Jewel-Catch.py",
			"choice"
		),
		launchProject(
			"Launch Project 5: Keep Up",
			`The playable framework applies gravity, wall and floor responses, click input, and scoring to a moving ball.

**Normal:** Tune one named physics constant and add visible feedback that proves its effect.

**Hard:** Add wind, combos, misses, or difficulty growth while keeping motion bounded and reset behavior deterministic.`,
			"PyG5-Keep-Up.py",
			"choice"
		),
		launchProject(
			"Launch Project 6: Platformer Game",
			`The framework supplies a player, platforms, gravity, one-way landing rules, a level layout, and a collectible goal.

**Normal:** Add one platform, collectible, or movement adjustment and verify standing, jumping, falling, and goal collection.

**Hard:** Add moving platforms, hazards, camera or level state, or a complete restart without introducing false landing collisions.`,
			"PyG6-Platformer-Game.py",
			"challenge"
		),
		launchProject(
			"Launch Project 7: Alien Catch",
			`The game already separates start, play, and end states and uses timing, input, score, lives, and speed changes.

**Normal:** Add one readable state message or round rule and verify every transition.

**Hard:** Add levels, a countdown, accuracy feedback, or a second target while preserving restart and quit behavior.`,
			"PyG7-Alien-Catch.py",
			"choice"
		),
		launchProject(
			"Launch Project 8: Target Shoot",
			`The framework includes a player, target, reusable projectile, firing input, collision, and projectile reset.

**Normal:** Add one hit-feedback, score, or target-reset behavior.

**Hard:** Convert the projectile into a managed list, add limited ammunition, or add moving targets with complete offscreen cleanup.`,
			"PyG8-Target-Shoot.py",
			"challenge"
		),
		launchProject(
			"Launch Project 9: Space Battle",
			`The playable boss battle coordinates player and enemy movement, projectiles, health, collision, and win-loss state.

**Normal:** Add one visible health, damage, or enemy-movement feature and test both victory and defeat.

**Hard:** Add attack phases, multiple projectile patterns, or difficulty growth while keeping every projectile and state transition bounded.`,
			"PyG9-Space-Battle.py",
			"challenge"
		),
		launchProject(
			"Launch Project 10: Space Invaders",
			`The framework assembles player control, an enemy formation, projectile lists, collisions, waves, scoring, and restart behavior.

**Normal:** Add one enemy, scoring, wave, or feedback adjustment and verify a complete round.

**Hard:** Add formation behavior, power-ups, escalating waves, or richer enemy projectiles without leaking offscreen objects.`,
			"PyG11-Space-Invaders.py",
			"challenge"
		),
		{
			title: "Launch Remix: Controls and Feedback",
			content: `Choose one playable launch game and trace a control from input through state change to visible feedback.

**Normal:** Add one control or feedback element while preserving every original control.

**Hard:** Add remappable controls, a pause state, or an in-game instructions screen with a reliable return to play.`,
			learningPath: "choice",
			solutionLink: `${PYGAMES_SOURCE}/PyG8-Target-Shoot.py`
		},
		{
			title: "Launch Remix: Difficulty and Replay",
			content: `Choose one launch game with a clear goal or failure state.

**Normal:** Add one named difficulty value and a working replay path.

**Hard:** Change difficulty from measured play state while preserving a fair starting state and deterministic reset.`,
			learningPath: "challenge",
			solutionLink: `${PYGAMES_SOURCE}/PyG7-Alien-Catch.py`
		}
	]
});

export const pyGamesClassroomCourse: RawCourse = {
	name: "PyGames: Classroom Edition",
	modules: [
		classroomLaunchModule,
		...copyClassroomCourseModules(pyGamesCourse.modules)
	]
};
