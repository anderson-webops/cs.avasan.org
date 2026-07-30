import type { RawCourse } from "./types";
import {
	buildScratchFluencyDrill,
	buildScratchOpenEndedVariant
} from "./scratchProjectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const scratchLevel1Course: RawCourse = {
	name: "Scratch Level 1",
	modules: [
		{
			title: "GS1 Starting in Scratch",
			curriculum: [
				{
					title: "Scratch basics",
					content:
						"Open the Scratch editor and explore the code blocks—no account is required to begin. Learn how the stage and sprites work, and experiment with the green flag to start scripts. Download the project file when you want to save work without signing in."
				},
				{
					title: "Project 1 – Hungry Hippo",
					content: `**Project goal:** Build a simple collection game with keyboard controls, score, and a countdown timer.

**Build steps:**
1. Start by playing the sample Hungry Hippo game and identifying the player sprite, collectable objects, score, and timer.
2. Create a custom version with a sprite of your choice.
3. Program arrow-key movement with direction and movement blocks.
4. Add collectable objects that disappear or reset when the player sprite touches them.
5. Create a score variable that increases when an object is collected.
6. Create a timer variable that decreases as the game runs.

**Completion check:** The player moves in four directions, collects objects, gains points, and has a visible countdown that changes during play.`,
					projectLink: "https://scratch.mit.edu/projects/304003593/",
					solutionLink: "https://scratch.mit.edu/projects/313184786/"
				},
				{
					title: "Starting in Scratch: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Starting in Scratch",
						section: "planning"
					})
				},
				{
					title: "Starting in Scratch: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Starting in Scratch",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Starting in Scratch: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Starting in Scratch",
						section: "extension"
					}),
					projectLink: "https://scratch.mit.edu/projects/304003593/",
					solutionLink: "https://scratch.mit.edu/projects/313184786/"
				},
				{
					title: "Starting in Scratch: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "Hungry Hippo-style collection",
						focus: "green-flag setup, keyboard movement, score updates, and timer reset",
						restartCheck:
							"The score and timer reset cleanly, and collecting an item changes only the intended variable."
					})
				},
				{
					title: "Starting in Scratch: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "starter collection game",
						coreIdea:
							"basic sprite control, scoring, and visible feedback",
						variation:
							"what gets collected, how points are earned, or how the countdown creates pressure",
						evidence:
							"The finished game makes the start script, score script, and end condition easy to identify."
					})
				}
			]
		},
		{
			title: "GS2 Event Listeners",
			curriculum: [
				{
					title: "Basic event listeners",
					content:
						'Event listeners are blocks that wait for something to happen and then start a script. The "when green flag clicked" and "when arrow key pressed" blocks connect user actions to sprite behavior, so a project can respond when the game starts or when a specific key is pressed.'
				},
				{
					title: "Project 1 – Spinner",
					content: `**Project goal:** Build a spinner that responds to the green flag, arrow keys, letter keys, and the mouse pointer.

**Event behaviors:**
1. When the green flag is clicked, point the arrow to the right.
2. When the up, left, right, or down arrow key is pressed, point the arrow in that direction.
3. When A is pressed, turn the arrow 15 degrees left.
4. When D is pressed, turn the arrow 15 degrees right.
5. When the spacebar is pressed, point the arrow toward the mouse.

**Completion check:** Each event changes only the intended direction or rotation, so the spinner is easy to test one key at a time.`,
					projectLink: "https://scratch.mit.edu/projects/287920173/",
					solutionLink: "https://scratch.mit.edu/projects/287887351/"
				},
				{
					title: "Project 2 – Bouncy Ball Room",
					content: `**Project goal:** Make a ball respond to keyboard and click events while changing position, backdrop, size, sound, and color.

**Event behaviors:**
1. When the green flag is clicked, move the ball to a random position.
2. When the space key is pressed, move 10 steps and bounce off the edge.
3. When the right-arrow key is pressed, change the backdrop.
4. When the up or down arrow is pressed, grow or shrink the ball.
5. When the ball is clicked, play a sound and change its color.

**Completion check:** The ball resets on green flag, and each input produces visible feedback.`,
					projectLink: "https://scratch.mit.edu/projects/287924505/",
					solutionLink: "https://scratch.mit.edu/projects/287922077/"
				},
				{
					title: "Project 3 – Dragonfly Events",
					content: `**Project goal:** Practice several event types by making the dragonfly react to startup, keys, clicks, sounds, and backdrops.

**Event behaviors:**
1. When the green flag is clicked, move the dragonfly to a random spot.
2. Arrow-key events move the dragonfly 20 steps.
3. When the dragonfly is clicked, change its color.
4. When the spacebar is pressed, play a pop sound.
5. When 1 is pressed, make the dragonfly pop and move to a random position.
6. When 2 is pressed, have the dragonfly say something.
7. When 3 is pressed, change the background.

**Extension:** Add another sprite controlled by the W-A-S-D keys.

**Completion check:** Every event is independently testable without breaking the green-flag reset.`,
					projectLink: "https://scratch.mit.edu/projects/287707460/",
					solutionLink: "https://scratch.mit.edu/projects/284408078/"
				}
			],
			supplementalProjects: [
				{
					title: "Event Listeners: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Event Listeners",
						section: "extension"
					}),
					projectLink: "https://scratch.mit.edu/projects/287920173/",
					solutionLink: "https://scratch.mit.edu/projects/287887351/"
				},
				{
					title: "Event Listeners: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "event-listener reaction",
						focus: "green-flag, keypress, click, and backdrop events that each cause a different visible response",
						restartCheck:
							"Every event still works after restart, and no event depends on another event being triggered first."
					})
				},
				{
					title: "Event Listeners: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "event-driven interaction",
						coreIdea:
							"events as the connection between user actions and sprite behavior",
						variation:
							"which inputs trigger movement, sound, costume changes, messages, or backdrop changes",
						evidence:
							"At least three different event blocks produce distinct results without conflicting scripts."
					})
				}
			]
		},
		{
			title: "GS3 Pen with Event Listeners",
			curriculum: [
				{
					title: "Pen extension introduction",
					content:
						"The Pen extension adds drawing blocks to Scratch. `Pen down` makes the sprite draw as it moves, `Pen up` stops drawing, `erase all` clears the stage drawings, and `change color` changes the pen color."
				},
				{
					title: "Project 1 – Bouncy Ball with Pen",
					content: `**Project goal:** Add Pen behavior to a bouncing ball so movement creates a visible trail.

**Build steps:**
1. The green flag sends the ball to a random position.
2. The spacebar makes the ball move 10 steps and bounce off the edge.
3. Each movement puts the pen down so the ball leaves a trail.
4. Each movement changes the pen color.
5. The green flag erases old drawings and lifts the pen before resetting the ball.

**Completion check:** The stage starts clean, the ball leaves a visible trail while moving, and repeated green-flag runs do not preserve old drawings.`,
					projectLink: "https://scratch.mit.edu/projects/313084455/",
					solutionLink: "https://scratch.mit.edu/projects/287952358/"
				},
				{
					title: "Project 2 – Stencil Pencil",
					content: `**Project goal:** Build a pencil tool with movement, rotation, color, size, and reset controls.

**Build steps:**
1. The up arrow moves the pencil forward, and the down arrow moves it backward.
2. The left and right arrows rotate the pencil by 10 degrees.
3. Pressing 1 lowers the pen to start drawing.
4. Pressing 2 lifts the pen to stop drawing.
5. Clicking the pencil changes its pen color.
6. Pressing 3 increases pen size, and pressing 4 decreases pen size.
7. The green flag erases the stage, returns the pencil to the center facing right, and resets pen size and color.

**Extension:** Trace shapes on other backdrops.

**Completion check:** The controls feel like a drawing tool, and the green flag always returns the project to the same clean starting state.`,
					projectLink: "https://scratch.mit.edu/projects/287738652/",
					solutionLink: "https://scratch.mit.edu/projects/285312799/"
				},
				{
					title: "Project 3 – Beetle Artist",
					content: `**Project goal:** Turn the beetle into a keyboard-controlled drawing tool with reusable shape commands.

**Build steps:**
1. Arrow keys move the beetle 10 steps.
2. The green flag erases all previous drawings.
3. Pressing 1 draws a square.
4. Pressing 2 draws a triangle.
5. Pressing 3 draws an arrow shape.

**Extension:** Trace shapes on other backdrops.

**Completion check:** Each key draws only its assigned shape, and the green flag resets the drawing area cleanly.

**Reasoning check:** The square, triangle, and arrow work best as repeatable command patterns instead of copied random motion. Compare the number of turns and side lengths for each shape, then explain why changing the beetle's starting direction or position does not break the next shape command.`,
					projectLink: "https://scratch.mit.edu/projects/288003770/",
					solutionLink: "https://scratch.mit.edu/projects/287999903/"
				}
			],
			supplementalProjects: [
				{
					title: "Pen with Event Listeners: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Pen with Event Listeners",
						section: "extension"
					}),
					projectLink: "https://scratch.mit.edu/projects/313084455/",
					solutionLink: "https://scratch.mit.edu/projects/287952358/"
				},
				{
					title: "Pen with Event Listeners: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "pen-control drawing",
						focus: "pen down, pen up, color change, clear, and movement events that make the drawing state visible",
						restartCheck:
							"The drawing clears when expected, and pen state changes do not accidentally continue across unrelated controls."
					})
				},
				{
					title: "Pen with Event Listeners: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "interactive drawing tool",
						coreIdea:
							"event-controlled pen state and visual output",
						variation:
							"the drawing tool, color rule, erase behavior, or movement pattern used to create the image",
						evidence:
							"The project demonstrates clear pen-up and pen-down cases, plus one intentional way to reset or revise the drawing."
					})
				}
			]
		},
		{
			title: "GS4 Loops",
			curriculum: [
				{
					title: "Introduction to loops",
					content:
						'Loops repeat code blocks without copying the same instructions many times. The `repeat` block runs a set number of times, while the `forever` block keeps running until the project stops. Repeated "move" and "turn" instructions can create animations, patterns, and continuous sprite movement.'
				},
				{
					title: "Project 1 – Elephant Effects",
					content: `**Project goal:** Explore loops by giving the elephant repeated size, color, visibility, costume, and sound effects.

**Build steps:**
1. Pressing 1 grows the elephant ten times.
2. Pressing 2 shrinks the elephant ten times.
3. Pressing 3 changes the elephant's color effect forever.
4. Pressing 4 changes a different graphic effect forever.
5. Pressing 5 repeats a hide, wait, and show sequence.
6. Pressing the spacebar repeats a costume switch, sound, and return-to-original-costume sequence three times.

**Completion check:** Each key demonstrates a different kind of repetition, and the repeated behavior is visible enough to compare with a non-loop version.`,
					projectLink: "https://scratch.mit.edu/projects/291122885/",
					solutionLink: "https://scratch.mit.edu/projects/291119943/"
				},
				{
					title: "Project 2 – Hot Cross Buns",
					content: `**Project goal:** Program a short song with the Music extension and reduce repetition with loops.

**Song pattern:**
E-D-C, E-D-C, C-C-C-C, D-D-D-D, E-D-C.

**Build steps:**
1. The green flag plays "Hot Cross Buns" twice.
2. Repeated note patterns go inside loops instead of copied block by block.
3. The timing stays steady enough for the melody to be recognizable.

**Extension:** Compose another short song that also has repeated sections.

**Completion check:** The song plays twice from the green flag, and the repeated sections are implemented with loops.`,
					projectLink: "https://scratch.mit.edu/projects/291117784/",
					solutionLink: "https://scratch.mit.edu/projects/291115434/"
				},
				{
					title: "Project 3 – Drawing Mouse",
					content: `**Project goal:** Draw multiple shapes with loops and keyboard-triggered events.

**Build steps:**
1. The green flag erases all drawings.
2. Pressing 1 draws a square with a loop at a random location.
3. Pressing 2 draws a triangle.
4. Pressing 3 draws a circle-like shape by repeating many small steps and turns that total 360 degrees.

**Extension:** Add other shapes, such as an octagon or a star, with optional random sizes and colors.

**Completion check:** Each key produces the intended shape, and the code reuses loops instead of manually copying every side or turn.`,
					projectLink: "https://scratch.mit.edu/projects/289744824/",
					solutionLink: "https://scratch.mit.edu/projects/289445069/"
				}
			],
			supplementalProjects: [
				{
					title: "GS4 Supplemental Project 1 – Shapify",
					content: `**Project goal:** Draw regular polygons by connecting side count, turn angle, and loop repetition.

**Build steps:**
1. Draw a hexagon with Pen blocks. The turn angle comes from dividing 360 degrees by the number of sides.
2. Apply the same angle pattern to an octagon, a decagon, a dodecagon, and a circle-like shape.
3. Predict what happens if the repeat loop around the circle is replaced with a forever loop, then test the prediction.

**Extension:** Draw a different circle-like shape with different step and turn values.

**Completion check:** The shapes close cleanly, and the explanation connects the number of sides to the turn angle.`,
					projectLink: "https://scratch.mit.edu/projects/330468686/",
					solutionLink: "https://scratch.mit.edu/projects/330429172/"
				},
				{
					title: "Loops: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "loop-driven animation",
						focus: "repeat counts, forever loops, timing, and the difference between one-time setup and repeated behavior",
						restartCheck:
							"The animation starts from the same state each run, and changing the loop count changes the repeated result predictably."
					})
				},
				{
					title: "Loops: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "loop-based motion or pattern",
						coreIdea:
							"repetition as a way to control timing, animation, and repeated actions",
						variation:
							"the repeated movement, timing rhythm, costume cycle, or pattern rule",
						evidence:
							"The loop is necessary for the behavior; removing it would make the project visibly incomplete or repetitive by hand."
					})
				}
			]
		},
		{
			title: "GS5 Basic Conditionals",
			curriculum: [
				{
					title: "Introducing conditionals",
					content:
						'Conditionals let a program make decisions. The "if … then" block checks a condition, and sensing blocks such as "touching mouse pointer", "key right arrow pressed", and "touching color ___" provide facts the condition can test. In games, conditionals often sit inside a `forever` loop so Scratch keeps checking for changes.'
				},
				{
					title: "Project 1 – Dino's Colors",
					content: `**Project goal:** Make the dinosaur react to the color under its feet.

**Build steps:**
1. The dinosaur follows the mouse pointer forever.
2. A conditional checks whether the dinosaur is standing on red and says "I'm in red!" when the condition is true.
3. Additional color checks handle yellow, blue, and grey.

**Completion check:** Moving the dinosaur onto each target color produces the matching response without triggering the wrong color message.`,
					projectLink: "https://scratch.mit.edu/projects/291223299/",
					solutionLink: "https://scratch.mit.edu/projects/291220849/"
				},
				{
					title: "Project 2 – Noisy Reactions",
					content: `**Project goal:** Build a scene where different sprites react when the bouncing ball touches them.

**Build steps:**
1. The green flag starts the ball bouncing around the screen forever.
2. A bell-touching-ball conditional makes the bell swing back and forth and ring four times.
3. A lightning-touching-ball conditional makes the lightning strike the ground, play thunder, and return to the cloud.
4. A chick-touching-ball conditional makes the chick move 5 steps and chirp.

**Debug target:** Watch for reactions that repeat too quickly while the ball remains touching a sprite. Add timing, movement, or reset behavior if a collision triggers more times than intended.

**Completion check:** Each sprite reacts only when the ball touches it, then returns to a clear ready state for the next collision.`,
					projectLink: "https://scratch.mit.edu/projects/291542721/",
					solutionLink: "https://scratch.mit.edu/projects/291530292/"
				},
				{
					title: "Project 3 – Magic Wand",
					content: `**Project goal:** Create a magic-wand scene where one sprite triggers different reactions from other sprites.

**Build steps:**
1. The magic wand moves to the frog and turns it into a wizard.
2. The wand moves to the piano and plays three notes.
3. The wand moves to the ghost and sends the ghost toward the star.
4. When the ghost touches the star, the star grows to fill the screen.

**Completion check:** Each wand action causes the intended sprite reaction, and the scene clearly shows cause and effect.`,
					projectLink: "https://scratch.mit.edu/projects/304279087/",
					solutionLink: "https://scratch.mit.edu/projects/304279316/"
				}
			],
			supplementalProjects: [
				{
					title: "GS5 Supplemental Project 1 – Camouflaging Octopus",
					content: `**Project goal:** Build a camouflage effect that changes the octopus color based on the background.

**Build steps:**
1. Arrow-key event listeners control octopus movement.
2. A conditional turns the octopus blue when it is on a blue background.
3. Additional conditionals handle yellow, green, and red backgrounds.

**Completion check:** The octopus matches the background color after moving onto each color zone.`,
					projectLink: "https://scratch.mit.edu/projects/326209430/",
					solutionLink: "https://scratch.mit.edu/projects/326209241/"
				},
				{
					title: "GS5 Supplemental Project 2 – Playing Catch",
					content: `**Project goal:** Simulate a game of catch where conditionals decide who receives the ball next.

**Build steps:**
1. The green flag sends the basketball to Gobo and starts continuous movement.
2. When Pico has the ball, conditionals pass it back to Gobo.
3. When Gobo has the ball, conditionals pass it to Pico.

**Extension:** Add more sprites and make the ball pass among all players.

**Completion check:** The ball moves to the correct next player based on who currently has it.

**Reasoning check:** Treat the current holder as game state. Test at least two handoff moments and one restart, then explain which condition decides the next target and how the project avoids sending the ball to the wrong sprite after a repeated click or green-flag run.`,
					projectLink: "https://scratch.mit.edu/projects/326211768/",
					solutionLink: "https://scratch.mit.edu/projects/326211724/"
				},
				{
					title: "Basic Conditionals: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "conditional response game",
						coreIdea:
							"if blocks that choose behavior from current sprite or variable state",
						variation:
							"the touch condition, score threshold, color check, or message shown when a condition is met",
						evidence:
							"The project includes at least one case where the condition is true and one case where it is false."
					})
				}
			]
		},
		{
			title: "GS6 Advanced Conditionals",
			curriculum: [
				{
					title: "Conditionals: if/then/else",
					content:
						'The "if … then … else" block allows two possible outcomes. If the condition is true, Scratch runs the first branch; otherwise, it runs the else branch. This structure is useful for choices such as correct versus incorrect, win versus lose, touching versus not touching, or enough points versus not enough points.',
					projectLink: "https://scratch.mit.edu/projects/293372295/",
					solutionLink: "https://scratch.mit.edu/projects/293366003/"
				},
				{
					title: "Project 1 – Dino's Colors II",
					content: `**Project goal:** Add if/then/else checks so the dinosaur can tell whether it reached the requested color.

**Build steps:**
1. Arrow keys control the dinosaur.
2. Pressing b makes the dinosaur say "Move me to blue!" for 2 seconds.
3. After speaking, an if/then/else block checks whether the dinosaur is touching blue. It says "Good job!" for success and "This isn't the right color!" otherwise.
4. The same pattern works for r (red) and y (yellow).
5. Sounds and costume changes provide extra feedback for each color.

**Completion check:** Correct colors and incorrect colors produce different responses for every tested key.`,
					projectLink: "https://scratch.mit.edu/projects/293788691/",
					solutionLink: "https://scratch.mit.edu/projects/293787944/"
				},
				{
					title: "Project 2 – Hungry Dinosaur",
					content: `**Project goal:** Build a banana-eating interaction with success and failure branches.

**Build steps:**
1. The green flag starts arrow-key controls for the dinosaur.
2. Pressing the spacebar makes the dinosaur attempt to eat bananas.
3. If the dinosaur is touching bananas, the project changes costume, plays a sound, or otherwise shows the bananas being eaten.
4. If the dinosaur is not touching bananas, it says "There aren't any bananas here!".
5. If the bananas are touching the dinosaur, they wait one second and move to a random location; otherwise, they say "I'm over here!".

**Completion check:** The spacebar produces one clear branch when the dinosaur is touching bananas and a different branch when it is not.`,
					projectLink: "https://scratch.mit.edu/projects/293457751/",
					solutionLink: "https://scratch.mit.edu/projects/293291715/"
				},
				{
					title: "Advanced Conditionals: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Advanced Conditionals",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GS6 Supplemental Project 1 – Blast Off Rocketship",
					content: `**Project goal:** Build a rocketship challenge where mouse clicks determine whether the ship climbs or falls.

**Build steps:**
1. The green flag starts the rocketship at the center bottom of the stage.
2. If the mouse is clicked, the rocketship moves up 5 steps.
3. Otherwise, the rocketship moves down 5 steps while still pointing upward.
4. Reaching the star triggers a blastoff effect with sound, motion, or visual feedback.

**Completion check:** Clicking and not clicking create visibly different movement, and reaching the star produces a clear win moment.`,
					projectLink: "https://scratch.mit.edu/projects/332463981/",
					solutionLink: "https://scratch.mit.edu/projects/332459692/"
				},
				{
					title: "GS6 Supplemental Project 2 – Baby Fish",
					content: `**Project goal:** Build a fish-following scene with an if/then/else message based on whether the baby fish found the mom fish.

**Build steps:**
1. The green flag makes the baby fish continuously go to the mouse pointer.
2. If the baby fish touches the mom fish, it says "I found her".
3. Otherwise, it says "Take me to my mom".
4. The mom fish glides randomly around the screen.

**Completion check:** The baby fish updates its message correctly as it touches or does not touch the mom fish.`,
					projectLink: "https://scratch.mit.edu/projects/332468797/",
					solutionLink: "https://scratch.mit.edu/projects/332464646/"
				},
				{
					title: "Advanced Conditionals: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "multi-condition Scratch challenge",
						coreIdea:
							"nested or combined conditions that distinguish several game states",
						variation:
							"the rule that separates win, loss, near-miss, bonus, or warning outcomes",
						evidence:
							"Testing covers each branch, including the case where only part of the combined condition is true."
					})
				}
			]
		},
		{
			title: "GS7 User Input",
			curriculum: [
				{
					title: "Getting user input",
					content:
						'Event listeners respond to button presses, but many projects also need text typed by the user. The "ask ___ and wait" block collects typed input, and the "answer" variable stores the most recent response. The equality (=) block compares the answer to a correct value, while < and > blocks compare typed numbers by size.'
				},
				{
					title: "Project 1 – Math Facts",
					content: `**Project goal:** Build a math practice sprite that asks typed questions and reacts to answers.

**Build steps:**
1. Pressing 1 makes Gobo ask a math question such as "What's 9 - 7?" and respond with costume, sound, or speech.
2. Pressing 2 asks a comparison question such as "What's a number less than 0?" and checks the answer.
3. Pressing 3 asks a harder question and repeats until the answer is correct.
4. For the harder question, answers that are too low trigger "Higher!", and answers that are too high trigger "Lower!".

**Completion check:** Correct, incorrect, too-low, and too-high answers each produce clear feedback.`,
					projectLink: "https://scratch.mit.edu/projects/295332936/",
					solutionLink: "https://scratch.mit.edu/projects/294539961/"
				},
				{
					title: "Project 2 – Fortune Teller",
					content: `**Project goal:** Build a fortune teller that asks questions and branches based on typed answers.

**Build steps:**
1. The green flag plays an introduction and asks for the player's name.
2. The fortune teller asks, "What do you want to know? (Type Love, Money, or Friendship)".
3. Conditionals choose a fortune based on the typed topic.
4. A second question, such as "Choose a number between 1 and 5", changes the next response.

**Extension:** Add more fortunes and questions to make the fortune teller more detailed.

**Completion check:** Different answers produce different fortunes, and unexpected answers do not break the project.`,
					projectLink: "https://scratch.mit.edu/projects/295333590/",
					solutionLink: "https://scratch.mit.edu/projects/294540150/"
				},
				{
					title: "Project 3 – Number Guesser",
					content: `**Project goal:** Build a guessing game that gives higher/lower feedback until the player finds the random number.

**Build steps:**
1. The green flag makes the sprite choose a random number between 1 and 20.
2. The sprite asks the player to guess the number.
3. If/then/else blocks tell the player whether the guess is too high or too low.
4. The guessing loop continues until the answer is correct.

**Extension:** Add a guess counter and congratulate the player for guessing in fewer than 5 tries.

**Completion check:** A wrong guess keeps the game running, and a correct guess ends the loop with clear feedback.`,
					projectLink: "https://scratch.mit.edu/projects/295335247/",
					solutionLink: "https://scratch.mit.edu/projects/294541979/"
				}
			],
			supplementalProjects: [
				{
					title: "GS7 Supplemental Project 1 – Animal Crossing",
					content: `**Project goal:** Create a small island story where typed choices change what happens next.

**Build steps:**
1. Ask whether the player wants to build a shop, plant a tree, or explore the island.
2. The answer determines which event occurs.
3. Yes/no questions customize the chosen path.
4. Variables store items collected or tasks completed.
5. Prompts or rewards make exploration and hidden secrets clear.

**Completion check:** Each major choice leads to a different visible event and updates any related variables correctly.`,
					projectLink: "https://scratch.mit.edu/projects/330320360/",
					solutionLink: "https://scratch.mit.edu/projects/330316142/"
				},
				{
					title: "GS7 Supplemental Project 2 – Space Cadets",
					content: `**Project goal:** Build a space-exploration story where typed choices control the planet, mission, and discoveries.

**Build steps:**
1. Ask for the player's name and call them "Captain".
2. Ask which planet, such as Mars, Jupiter, or Saturn, they want to explore.
3. Conditionals set the scene for the chosen planet.
4. Additional questions, such as "Do you want to collect rocks or search for life?", branch the story.
5. Variables track discoveries or points.

**Design target:** Each planet feels distinct through backdrop, dialogue, sprite behavior, or point changes rather than only changing a line of text.

**Completion check:** Planet choice and mission choice both affect the story path, and the variable values match the choices made.`,
					projectLink: "https://scratch.mit.edu/projects/330321409/",
					solutionLink: "https://scratch.mit.edu/projects/330316808/"
				},
				{
					title: "User Input: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "input-based quiz or customization",
						coreIdea:
							"ask-and-answer input that changes variables, messages, or game behavior",
						variation:
							"the prompt, accepted answers, scoring rule, or way the user's response changes the scene",
						evidence:
							"The result changes for at least two different inputs, and blank or unexpected input is handled deliberately."
					})
				}
			]
		},
		{
			title: "GS8 X & Y Coordinates",
			curriculum: [
				{
					title: "Introduction to X & Y coordinates",
					content:
						'The Scratch stage uses an X and Y coordinate plane. The X-axis moves left and right, and the Y-axis moves up and down. The "go to x: ___ y: ___" and "glide ___ secs to x: ___ y: ___" blocks place sprites at specific coordinates or move them smoothly to a target point.'
				},
				{
					title: "Project 1 – Bug Eater",
					content: `**Project goal:** Build a click-to-move collection game using X and Y coordinates.

**Build steps:**
1. The green flag places the praying mantis at a random position.
2. A mouse click makes the mantis glide to the mouse pointer's X and Y position.
3. When the mantis touches a bug, a broadcast makes the bug disappear and increases the score.
4. Score and timer variables track game progress.
5. The game ends when the timer runs out and displays the final score.

**Completion check:** Clicking different stage locations moves the mantis accurately, and touching a bug updates the game state once per catch.`,
					projectLink: "https://scratch.mit.edu/projects/302997680/",
					solutionLink: "https://scratch.mit.edu/projects/302865707/"
				},
				{
					title: "Project 2 – Cake Chaser",
					content: `**Project goal:** Build a timed chase game where a player sprite collects cake at random coordinates.

	**Build steps:**
	1. Set up two sprites: a person and a slice of cake.
	2. Arrow keys move the person around the stage.
		3. The cake appears at random X and Y coordinates.
		4. Touching the cake plays a sound, moves the cake to a new random location, and increases the score.
		5. A countdown timer ends the game when it reaches zero.

		**Design notes:** Keep the cake's random position separate from the player movement logic so each part can be tested on its own. The catch behavior happens once per touch, then immediately places the cake somewhere new so the game does not award repeated points for the same catch.

		**Evidence:** Test the game from a clean green-flag start, catch the cake at least three times, and confirm the score, sound, random location, and timer all change for the intended reason.

		**Completion check:** The cake relocates after every catch, and the timer produces a clear end state.`,
					projectLink: "https://scratch.mit.edu/projects/302998723/",
					solutionLink: "https://scratch.mit.edu/projects/302865909/"
				},
				{
					title: "Project 3 – Talent Show",
					content: `**Project goal:** Create a coordinated talent show with starting positions, broadcasts, and a final bow.

**Build steps:**
1. Choose three performer sprites.
2. The green flag sends each performer to a starting position using X and Y coordinates.
3. Broadcast messages trigger each act in sequence, such as dancing, jumping, or playing an instrument.
4. After every act is finished, all performers bow together.

**Completion check:** The acts run in a clear order, and the final bow happens only after the individual performances finish.`,
					projectLink: "https://scratch.mit.edu/projects/302999957/",
					solutionLink: "https://scratch.mit.edu/projects/302866259/"
				}
			],
			supplementalProjects: [
				{
					title: "GS8 Supplemental Project 1 – Quadrant Practice",
					content: `**Project goal:** Practice stage coordinates by moving a sprite into each quadrant.

**Build steps:**
1. Arrow keys move a sprite around the stage.
2. Each quadrant displays a message such as "I'm in Quadrant I" when the sprite enters it.
3. Shapes or obstacles can make the path more challenging.

**Completion check:** The displayed quadrant message matches the sprite's current X/Y position.`,
					projectLink: "https://scratch.mit.edu/projects/330290958/",
					solutionLink: "https://scratch.mit.edu/projects/330287678/"
				},
				{
					title: "GS8 Supplemental Project 2 – Coordinate Drawings",
					content: `**Project goal:** Draw pictures by moving a sprite to exact X and Y coordinates.

**Build steps:**
1. The Pen extension draws a picture as the sprite moves through chosen coordinates.
2. Typed input lets the player enter coordinates for custom shapes.
3. Example coordinate sets can draw initials or simple pictures.

**Completion check:** The drawn shape matches the coordinate plan, and user-entered coordinates move the sprite predictably.`,
					projectLink: "https://scratch.mit.edu/projects/330291711/",
					solutionLink: "https://scratch.mit.edu/projects/330288612/"
				},
				{
					title: "X & Y Coordinates: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "coordinate-navigation scene",
						coreIdea:
							"x and y positions as visible control over sprite placement and movement",
						variation:
							"the target positions, movement bounds, spawn rule, or coordinate-based scoring condition",
						evidence:
							"The project uses both x and y values intentionally, not only drag-and-drop placement."
					})
				}
			]
		},
		{
			title: "GS9 Variables",
			curriculum: [
				{
					title: "Introducing variables",
					content:
						'Variables store information such as scores, timers, answers, or other values that can change while a project runs. The "set [variable] to" block replaces the current value, while "change [variable] by" increases or decreases it. A counting loop can make a sprite count from 1 to 10, count backward, or count by larger steps.'
				},
				{
					title: "Project 1 – Speed Click",
					content: `**Project goal:** Build a timed clicking game with score, random target placement, and an end state.

**Build steps:**
1. The green flag creates or resets a timer variable to 20.
2. A target sprite appears in random positions.
3. Clicking the target increases the score by 1.
4. The timer decreases by 1 every second.
5. When the timer reaches zero, the game stops and displays the final score.
6. A high-score variable can track the best result across plays.

**Completion check:** The score increases only from target clicks, and the timer reliably stops the game at zero.`,
					projectLink: "https://scratch.mit.edu/projects/302996579/",
					solutionLink: "https://scratch.mit.edu/projects/302864606/"
				},
				{
					title: "Project 2 – Spider Smash",
					content: `**Project goal:** Create a timed target game where spiders appear, move, and award points when clicked.

**Build steps:**
1. The green flag makes spiders appear at random positions and move downward.
2. Clicking a spider hides it, plays a sound, and increases the score.
3. A countdown timer ends the game when it reaches zero.
4. Difficulty can increase by speeding up spiders over time.

**Completion check:** Each spider click counts once, and the game ends cleanly when the timer expires.`,
					projectLink: "https://scratch.mit.edu/projects/302996964/",
					solutionLink: "https://scratch.mit.edu/projects/302865093/"
				},
				{
					title: "Variables: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Variables",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GS9 Supplemental Project 1 – Counting Steps",
					content: `**Project goal:** Track movement by counting each step the sprite takes.

**Build steps:**
1. Arrow keys move a sprite around the stage.
2. A variable called "steps" increases each time the sprite moves.
3. The project displays the number of steps taken.
4. Obstacles and a goal can turn the counter into a small maze challenge.

**Completion check:** The steps variable increases only when movement happens, not when unrelated keys or events occur.`,
					projectLink: "https://scratch.mit.edu/projects/330293454/",
					solutionLink: "https://scratch.mit.edu/projects/330289893/"
				},
				{
					title: "GS9 Supplemental Project 2 – Hungry Crab",
					content: `**Project goal:** Build a food-collection game with arrow controls, a food counter, and a timer.

**Build steps:**
1. Arrow keys control the crab.
2. A variable called "food" increases each time the crab eats a piece of food.
3. A timer ends the game when time runs out.
4. The final screen displays how much food was collected.

**Completion check:** The food count increases only when the crab collects food, and the timer creates a clear end state.`,
					projectLink: "https://scratch.mit.edu/projects/330294193/",
					solutionLink: "https://scratch.mit.edu/projects/330290622/"
				},
				{
					title: "GS9 Supplemental Project 3 – Lunch Money",
					content: `**Project goal:** Build a small shopping simulation that tracks remaining lunch money.

**Build steps:**
1. A variable called "money" starts at 10.
2. The project asks what the player wants to buy for lunch, such as pizza, sandwich, or salad.
3. The chosen item's cost is subtracted from the money variable.
4. If the player cannot afford an item, a message explains the problem.
5. Buying continues until the money runs out.

**Completion check:** Affordable purchases reduce the money variable correctly, while unaffordable purchases do not make the total go negative.`,
					projectLink: "https://scratch.mit.edu/projects/330294909/",
					solutionLink: "https://scratch.mit.edu/projects/330291357/"
				}
			]
		},
		{
			title: "GS10 Message Broadcasting",
			curriculum: [
				{
					title: "Message broadcasting",
					content:
						"Broadcasting lets sprites send messages to each other. This is useful when one sprite needs to wait for another sprite to finish speaking, moving, or changing state before its own script begins.\n\nOpen the Events blocks and compare `broadcast __` with `when I receive __`. Practice by making one sprite finish a short action, broadcast a message, and trigger a second sprite to start moving only after that message is received."
				},
				{
					title: "GS10 Project 1 – Dance Off",
					content: `**Project goal:** Build a dance sequence where each sprite gets a turn to perform on the stage.

**Dance sequence:**
1. When the green flag is clicked, reset each dancer to the left side.
2. Make the ballerina glide to the middle and cycle twice through all costumes.
3. When the ballerina is done, glide her off to the right side.
4. Make each other dancer follow the same pattern one by one.
5. Add clapping or applause between performers.
6. Add backdrop code that plays dancing music during the show.
7. When Champ is done dancing, broadcast a message that stops the music.

**Extension:** Add lighting changes, a final applause sequence, or a closing pose after everyone is done.

**Completion check:** The dancers perform in a clear sequence, and the music stops from a broadcast rather than an unrelated timer.`,
					projectLink: "https://scratch.mit.edu/projects/301002220/",
					solutionLink: "https://scratch.mit.edu/projects/300644693/"
				},
				{
					title: "GS10 Project 2 – Bowl Fill",
					content: `**Project goal:** Build a collection game where the player controls a bowl and collects different items.

**Build steps:**
1. Program the bowl so the arrow keys control it after the green flag is clicked.
2. When an item sprite touches the bowl, broadcast a message such as "Cheese touched".
3. Decide what each sprite does after receiving its message. It might move, play a sound, hide, or trigger a bowl reaction.
4. Add variables that track how many times each object has been collected.
5. Add a 15-second timer.
6. When the timer ends, broadcast a message that makes every sprite react, such as spinning, growing, shrinking, or showing a final result.

**Completion check:** Each collected object updates the correct variable and triggers the correct broadcast response.`,
					projectLink: "https://scratch.mit.edu/projects/303008513/",
					solutionLink: "https://scratch.mit.edu/projects/302811491/"
				},
				{
					title: "Message Broadcasting: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Message Broadcasting",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GS10 Supplemental Project 1 – Magical Quest",
					content: `**Project goal:** Design a short interactive play that uses broadcasts to coordinate scene changes and dialogue.

**Build steps:**
1. Create a story with 3 to 4 characters and multiple scenes.
2. Add the sprites and backdrops needed for the story.
3. Broadcast messages make each character speak or move at the correct time.
4. Additional broadcasts handle scene changes or major story events.

**Completion check:** The story runs in a clear sequence because sprites react to broadcasts, not because unrelated scripts happen to finish at the same time.`,
					projectLink: "https://scratch.mit.edu/projects/330301165/",
					solutionLink: "https://scratch.mit.edu/projects/328309254/"
				},
				{
					title: "GS10 Supplemental Project 2 – Cartoon Crash",
					content: `**Project goal:** Build a partner-selection game where Dani bounces around the room with the chosen sprite.

**Build steps:**
1. When the green flag is clicked, reset the Start button and have Dani explain the instructions.
2. When Start is clicked, place all sprites in their starting positions.
3. Let the player choose a partner sprite by clicking it.
4. If a sprite is chosen, make it bounce around the room with Dani.
5. If a sprite is not chosen, give it an appropriate alternate reaction.

**Completion check:** The chosen and unchosen sprites respond differently, and the project resets correctly with the green flag.`,
					projectLink: "https://scratch.mit.edu/projects/330302209/",
					solutionLink: "https://scratch.mit.edu/projects/328312475/"
				},
				{
					title: "Message Broadcasting: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "broadcast-coordinated scene",
						coreIdea:
							"messages that synchronize sprites, levels, or state changes",
						variation:
							"the message names, receiver responses, scene transition, or chain of actions after a broadcast",
						evidence:
							"Each broadcast has a clear sender, at least one receiver, and no receiver reacts to the wrong message."
					})
				}
			]
		},
		{
			title: "GS11 Hedgehog Race",
			curriculum: [
				{
					title: "GS11 Project 1 – Hedgehog Race",
					content: `**Project goal:** Build Hedgehog Race by planning the moving pieces before programming.

**Planning targets:** Identify the sprite behavior, controls, event reactions, variables, scoring, and end conditions. Add a project comment that lists the implementation steps.

**Implementation options:** The starter project can be used as a base, or the race can be rebuilt from a blank project with original sprites, costumes, and backdrops.

**Completion check:** The race has clear starting positions, player controls, a finish condition, and visible feedback when the race ends.`,
					projectLink: "https://scratch.mit.edu/projects/304551665/",
					solutionLink: "https://scratch.mit.edu/projects/305082197/"
				},
				{
					title: "Hedgehog Race: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Hedgehog Race",
						section: "debugging"
					})
				},
				{
					title: "Hedgehog Race: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Hedgehog Race",
						section: "planning"
					})
				},
				{
					title: "Hedgehog Race: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Hedgehog Race",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GS11 Supplemental Project 1 – Save the Wizard",
					content: `**Project goal:** Help the wizard collect potions, avoid skeletons, and turn back from a frog into a wizard.

**Planning targets:** Before programming, identify the sprite behavior, controls, event reactions, variables, scoring or level rules, and end conditions. Add a project comment that lists the implementation steps.

**Build steps:**
1. Program the frog wizard so that the green flag places it at the center, sets its size, and enables arrow-key movement.
2. Program the skeleton to start at a random position on the far right and move left.
3. When the skeleton touches the frog or the left edge, send it back to the right side.
4. Program the potion with a similar reset pattern.
5. Add a level variable, set it to 1 at the start, and use it to control win/loss progress.
6. Create broadcasts for leveling up and leveling down.
7. Leveling up at level 4 wins the game. Otherwise, increase the level, switch costume, and increase size.
8. Leveling down at level 1 loses the game. Otherwise, decrease the level, switch costume, and decrease size.
9. Broadcast the level-up or level-down messages when the skeletons or potion touch the frog.

**Extensions:** Add another skeleton for extra difficulty. Add sound effects and backdrop changes for the finishing touches. For a harder potion pattern, make the potion wait a few seconds before appearing again.

**Completion check:** The level variable changes exactly once per collision event, and the win/loss broadcasts make the final state clear.`,
					projectLink: "https://scratch.mit.edu/projects/332395747/",
					solutionLink: "https://scratch.mit.edu/projects/330724703/"
				},
				{
					title: "Hedgehog Race: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "race simulation",
						focus: "random movement, finish-line detection, score or winner state, and clean restart behavior",
						restartCheck:
							"A winner is declared only once, and a new race does not preserve old positions or winner messages."
					})
				},
				{
					title: "Hedgehog Race: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "randomized race game",
						coreIdea: "random movement and finish-line logic",
						variation:
							"the racers, track layout, random speed range, obstacle rule, or winner display",
						evidence:
							"Multiple runs can produce different outcomes, and the finish condition remains fair and easy to observe."
					})
				}
			]
		},
		{
			title: "GS12 Asteroid Dodge",
			curriculum: [
				{
					title: "GS12 Project 1 – Asteroid Dodge",
					content: `**Project goal:** Build Asteroid Dodge with clear controls, collision rules, scoring or survival timing, and restart behavior.

		**Planning targets:** Identify player controls, asteroid movement, collision rules, score or survival timer, and restart behavior before programming. Add a project comment that lists the implementation steps.

		**Build options:** The starter project can be used as a base, or the same mechanics can be rebuilt from a blank project with original sprites, costumes, and backdrops.

		**Design notes:** Treat the player, asteroids, timer, and collision response as separate systems. A good first version has only one asteroid and one clear collision outcome; additional asteroids, speed changes, sounds, or polish come after the reset and end-state behavior are reliable.

		**Evidence:** Test a normal dodge path, a collision path, and a restart path. The game shows what changed after a collision, resets old asteroid positions when replayed, and avoids hidden score or timer state from the previous run.

		**Completion check:** The player moves reliably, asteroids reset cleanly, collisions are detected consistently, and the game has a clear ending or replay path.`,
					projectLink: "https://scratch.mit.edu/projects/303001451/",
					solutionLink: "https://scratch.mit.edu/projects/302948550/"
				},
				{
					title: "Asteroid Dodge: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Asteroid Dodge",
						section: "debugging"
					})
				},
				{
					title: "Asteroid Dodge: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Asteroid Dodge",
						section: "planning"
					})
				},
				{
					title: "Asteroid Dodge: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Asteroid Dodge",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Asteroid Dodge: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Asteroid Dodge",
						section: "extension"
					}),
					projectLink: "https://scratch.mit.edu/projects/303001451/",
					solutionLink: "https://scratch.mit.edu/projects/302948550/"
				},
				{
					title: "Asteroid Dodge: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "dodge game",
						focus: "player movement, falling hazards, collision detection, score or lives, and reset timing",
						restartCheck:
							"Hazards restart from sensible positions, and collisions affect the intended lives or score variable exactly once."
					})
				},
				{
					title: "Asteroid Dodge: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "avoidance challenge",
						coreIdea:
							"collision rules, movement control, and escalating pressure",
						variation:
							"the hazard pattern, player control scheme, scoring method, or difficulty curve",
						evidence:
							"The project has a clear safe state, danger state, and end condition that can be reproduced during testing."
					})
				}
			]
		},
		{
			title: "GS13 Master Project",
			curriculum: [
				{
					title: "GS13 Project 1 – Master Project",
					content: `**Project goal:** Design an original Scratch game that combines events, loops, conditionals, variables, coordinates, broadcasts, and project planning.

**Planning targets:** Choose the game type, sprites, controls, rules, win/loss condition, variables, and event structure before building.

**Design questions:**
1. What does each sprite do?
2. How is each sprite controlled?
3. How does each sprite react to events?
4. Which variables track game state?
5. How does the game end?

**Build target:** A playable minimum version comes before polish. The minimum version proves the controls, main rule, score or progress state, and ending.

**Completion check:** The game feels like one connected system rather than isolated scripts, and the final behavior is traceable from green flag to ending state.`
				},
				{
					title: "Master Project Presentation",
					content: `**Presentation goal:** Explain how the finished game works and what design decisions shaped it.

**Summary targets:**
1. Name the main sprites and variables.
2. Explain the most important event, loop, conditional, and broadcast or message.
3. Describe one problem that came up during development and how it was solved.
4. Reflect on the finished result and one improvement that would make the game stronger.

**Completion check:** The explanation makes the game logic understandable to someone viewing the project for the first time.`
				},
				{
					title: "Course recap",
					content:
						"End the course by reviewing the major Scratch concepts: events, loops, conditionals, variables, broadcasting, coordinates, game states, sprite behavior, and project planning.\n\nConnect those ideas to Python Level 1. The same logic skills carry over, but the blocks become typed code."
				},
				{
					title: "Optional Extra Practice – Typing Games",
					content: `**Purpose:** This resource supports the transition from Scratch Level 1 into Python Level 1.

Typing practice is not required to complete the Scratch course, but it can make the move to text-based programming smoother. Choose games that feel useful, practice for about 15 to 20 minutes as needed, and move to the intermediate options if the beginner games feel too easy.

**Why it matters:** Scratch programs are assembled from blocks, while Python programs are typed. Keyboard fluency reduces friction so more attention can go toward variables, loops, conditionals, and debugging.

**Beginner typing games:**
- Practice with the Keyboard - Typing Letters: https://scratch.mit.edu/projects/214833806/
- Practice with the Keyboard - Typing Numbers: https://scratch.mit.edu/projects/214828609/
- Practice with the Keyboard - Typing Letters Race: https://www.nitrotype.com/

**Intermediate typing games:**
- Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game
- Ghost Typing: https://www.abcya.com/games/ghost_typing
- Koala Paddleboards: https://www.abcya.com/games/spelling_practice

**Advanced typing games:**
- Typing Rocket: https://www.abcya.com/games/typing_rocket
- Type Racer: https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer/starter`
				}
			],
			supplementalProjects: [
				{
					title: "GS13 Master Project: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "GS13 Master Project",
						section: "extension"
					})
				},
				{
					title: "GS13 Master Project: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "master-project prototype",
						focus: "one playable slice with controls, feedback, a rule for success or failure, and a visible reset path",
						restartCheck:
							"The prototype demonstrates the main mechanic without needing all final art, levels, or polish."
					})
				},
				{
					title: "GS13 Master Project: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "capstone game or interactive story",
						coreIdea:
							"a complete Scratch experience with player input, state, feedback, and replayability",
						variation:
							"the core mechanic, theme, level structure, scoring system, or story branch",
						evidence:
							"The final design includes a playable beginning, middle, and ending or replay loop, plus one tested extension beyond the base version."
					})
				}
			]
		},
		{
			title: "GS14 Mini Game Polish Studio",
			curriculum: [
				{
					title: "Game Polish Concepts",
					content:
						"A polished Scratch game is more than a set of working controls. It needs clear instructions, visible score or progress feedback, balanced difficulty, sound or visual polish, and an ending state that makes the result feel complete. The project is easy to trace from green flag to reset, normal play, win/loss state, and replay."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Polish Build Requirements",
					content:
						"Build a title screen, clear controls, score feedback, timer or lives, win/loss messages, and a replay path. Test the whole game from the green flag so the finished behavior is visible as one connected experience rather than isolated scripts."
				},
				{
					title: "Debugging and Test Pass",
					content:
						"Test the start state, normal play path, boundary case, and ending state. Record at least one bug or confusing behavior, the likely cause, and the exact Scratch block or script change that fixed it."
				},
				{
					title: "Share and Explain",
					content:
						"Prepare a short explanation of how the project works. Name the most important event, variable, loop, conditional, and message or custom block, then explain how those pieces cooperate."
				}
			],
			supplementalProjects: [
				{
					title: "Checkpoint: Trace the Project State",
					content:
						"Pick one moment during the project and name the current sprite positions, visible variables, active loops, and next event. This checks whether the project is understood as a system rather than as scattered blocks."
				},
				{
					title: "Mini Game Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Polished Mini Game",
					content:
						"Create a polished version of Bug Eater, Cake Chaser, Hedgehog Race, or Asteroid Dodge. Add one feature, clean up one confusing script or repeated block pattern, and explain why the added behavior fits the original game."
				}
			]
		},
		{
			title: "GS15 Interactive Story Studio",
			curriculum: [
				{
					title: "Branching Story Concepts",
					content:
						"An interactive story uses events, broadcasts, costumes, backdrops, and variables to make choices visible. The project shows how a scene starts, which choice changes the story state, what message moves the project to the next scene, and how each ending is reached."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Story Build Requirements",
					content:
						"Build scene transitions, dialogue timing, character reactions, choice variables, and alternate endings. Test the story from the green flag through at least two different paths so the branching behavior is visible."
				},
				{
					title: "Debugging and Test Pass",
					content:
						"Test the start state, normal play path, boundary case, and ending state. Record at least one bug or confusing behavior, the likely cause, and the exact Scratch block or script change that fixed it."
				},
				{
					title: "Share and Explain",
					content:
						"Prepare a short explanation of how the project works. Name the most important event, variable, loop, conditional, and message or custom block, then explain how those pieces cooperate."
				}
			],
			supplementalProjects: [
				{
					title: "Checkpoint: Trace the Project State",
					content:
						"Pick one moment during the project and name the current sprite positions, visible variables, active loops, and next event. This checks whether the project is understood as a system rather than as scattered blocks."
				},
				{
					title: "Story Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Branching Story",
					content:
						"Create a branching story with at least two meaningful choices and two endings. Add one feature, clean up one script or message sequence, and explain how the added behavior supports the story."
				}
			]
		},
		{
			title: "GS16 Debugging and Remix Studio",
			curriculum: [
				{
					title: "Debugging Concepts",
					content:
						"Scratch debugging starts by making the project state visible. Check green-flag setup, forever loops, sprite visibility, variable resets, coordinates, clone cleanup, and broadcast timing before changing features. A good repair explains what was broken, why it happened, and what evidence shows the fix worked."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Repair Build Requirements",
					content:
						"Repair broken controls, missing score updates, sprites hidden at start, scripts running in the wrong order, and games that never end. Test each repair from the green flag and keep a short bug log that connects symptoms to script changes."
				},
				{
					title: "Debugging and Test Pass",
					content:
						"Test the start state, normal play path, boundary case, and ending state. Record at least one bug or confusing behavior, the likely cause, and the exact Scratch block or script change that fixed it."
				},
				{
					title: "Share and Explain",
					content:
						"Prepare a short explanation of how the project works. Name the most important event, variable, loop, conditional, and message or custom block, then explain how those pieces cooperate."
				}
			],
			supplementalProjects: [
				{
					title: "Checkpoint: Trace the Project State",
					content:
						"Pick one moment during the project and name the current sprite positions, visible variables, active loops, and next event. This checks whether the project is understood as a system rather than as scattered blocks."
				},
				{
					title: "Debugging Pitfalls",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Debug Log and Remix Repair",
					content:
						"Create a debug log plus repaired remix of a small broken project. Add one feature only after the original issue is fixed, clean up one confusing script, and explain how the final version behaves differently."
				}
			]
		},
		{
			title: "GS17 Text-Based Programming Bridge",
			curriculum: [
				{
					title: "Scratch-to-Python Concepts",
					content:
						"Scratch blocks can be translated into text-code ideas: events become starting points, loops become repeated instructions, conditionals become branches, variables store state, custom blocks resemble functions, and coordinates act like numeric data. The bridge task is to explain a Scratch script in pseudocode before writing any Python-style version."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Translation Build Requirements",
					content:
						"Translate Scratch block screenshots or descriptions into pseudocode and then into simple Python-style statements. For each translated script, identify the start event, stored state, repeated behavior, condition, and output."
				},
				{
					title: "Debugging and Test Pass",
					content:
						"Test the start state, normal play path, boundary case, and ending state. Record at least one bug or confusing behavior, the likely cause, and the exact Scratch block or script change that fixed it."
				},
				{
					title: "Share and Explain",
					content:
						"Prepare a short explanation of how the project works. Name the most important event, variable, loop, conditional, and message or custom block, then explain how those pieces cooperate."
				}
			],
			supplementalProjects: [
				{
					title: "Checkpoint: Trace the Project State",
					content:
						"Pick one moment during the project and name the current sprite positions, visible variables, active loops, and next event. This checks whether the project is understood as a system rather than as scattered blocks."
				},
				{
					title: "Translation Pitfalls",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Scratch-to-Python Portfolio",
					content:
						"Create a Scratch-to-Python readiness portfolio with three translated scripts. Include the original Scratch idea, pseudocode, a Python-style version, and a short note explaining what changed during translation."
				}
			]
		}
	]
};
