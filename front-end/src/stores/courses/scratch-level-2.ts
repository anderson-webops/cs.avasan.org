import type { RawCourse } from "./types";
import {
	buildScratchFluencyDrill,
	buildScratchOpenEndedVariant
} from "./scratchProjectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const scratchLevel2Course: RawCourse = {
	name: "Scratch Level 2",
	modules: [
		{
			title: "GM1 Review: Events, Loops, Conditionals, & Broadcasting",
			curriculum: [
				{
					title: "Event listeners",
					content:
						'An event listener makes a sprite wait for a specific event and then react with a script. Common Scratch event blocks include "when green flag clicked" and "when arrow key pressed"; these blocks connect user actions or project startup to visible sprite behavior.'
				},
				{
					title: "GM1 Project 1: Dragonfly Events",
					content: `**Project goal:** Practice event listeners by making the dragonfly respond to startup, keys, clicks, and backdrop changes.

**Event behaviors:**
1. When the green flag is clicked, move the dragonfly to a random spot on the stage.
2. When an arrow key is pressed, move the dragonfly 20 steps in that direction.
3. When the dragonfly is clicked, change its color.
4. When the spacebar is pressed, play a popping sound.
5. When 1 is pressed, make the dragonfly pop and then move to a random position.
6. When 2 is pressed, make the dragonfly say something, such as "Buzzzz".
7. When 3 is pressed, change the background.

**Extension:** Add another sprite controlled by the W-A-S-D keys.

**Completion check:** Each event triggers only the intended behavior, and the project resets cleanly when the green flag is clicked.`,
					projectLink: "https://scratch.mit.edu/projects/287707460/",
					solutionLink: "https://scratch.mit.edu/projects/284408078/"
				},
				{
					title: "Loops",
					content:
						'Loops repeat code without copying the same blocks over and over. They make movement, animation, drawing, and forever-running game behavior easier to build and easier to revise.\nOpen the Control blocks and compare `repeat` with `forever`. Both blocks contain a "mouth" where other blocks can be placed and repeated.\nPractice by repeating `move __ steps` and `turn ___ degrees`. Start with a fixed `repeat` count, then try the same motion inside a `forever` loop.'
				},
				{
					title: "GM1 Project 2: Drawing Mouse",
					content: `**Project goal:** Combine event listeners and loops to draw different shapes on command.

**Build steps:**
1. When the green flag is clicked, erase all drawings so the stage starts clean.
2. When the 1 key is pressed, move the mouse to a random location and draw a square using a loop.
3. Add a similar event so another key draws a triangle.
4. Add a similar event so another key draws a circle.
5. Create at least one additional shape, such as an octagon, star, or original geometric pattern.

**Completion check:** Each key draws a clear shape without leaving unwanted setup marks from the previous drawing.`,
					projectLink: "https://scratch.mit.edu/projects/289744824/",
					solutionLink: "https://scratch.mit.edu/projects/289445069/"
				},
				{
					title: "Conditionals",
					content:
						'Conditionals let a program choose what happens based on whether something is true. A real-life conditional looks like "if it is cold, wear a jacket." In Scratch, an `if` block runs code only when its condition is true.\nAn `if...then...else` block adds a second path: one set of blocks runs when the condition is true, and another set runs when it is false. Practice with sensing blocks, comparison blocks, and user input so the program can respond to different answers or game states.'
				},
				{
					title: "GM1 Project 3: Math Facts",
					content: `**Project goal:** Build a math-practice project where Gobo asks questions and reacts to correct or incorrect answers.

**Question events:**
1. When 1 is pressed, ask a direct arithmetic question such as "What's 9 - 7?"
2. When 2 is pressed, ask a comparison question such as "What's a number less than 0?"
3. When 3 is pressed, ask a harder question that repeats until the answer is correct.

**Feedback behavior:** For each question, have Gobo change costume, play a sound, or say a message that clearly shows whether the answer was correct.

**Completion check:** The harder question keeps asking until the correct answer is entered, while the simpler questions give immediate feedback.`,
					projectLink: "https://scratch.mit.edu/projects/295332936/",
					solutionLink: "https://scratch.mit.edu/projects/294539961/"
				},
				{
					title: "Variables",
					content:
						"Variables store information that can change, such as a score, timer, answer, or level number. In Scratch, the `set __ to __` block replaces a variable's value, while `change __ by __` increases or decreases the current value.\nPractice by making the cat count from 1 to 10 with a loop. Then modify the same idea so the cat counts backward from 10 to 0 and backward from 100 to 0 by 10s."
				},
				{
					title: "GM1 Project 4: Speed Click",
					content: `**Project goal:** Build a 10-second clicking game where the player clicks a button as many times as possible before time runs out.

**Variables:**
- clicks tracks the player's score.
- time tracks the countdown from 10 to 0.

**Build steps:**
1. When the sprite is clicked, increase clicks by one.
2. Make the button switch to its pressed costume and play a sound on each click.
3. When the green flag is clicked, reset clicks, show the button, and set time to 10.
4. Before the timer starts, make the button say "Ready...", "Set...", and "Go!" for one second each.
5. Count time down to 0.
6. When time runs out, hide the button and show the final score.

**Completion check:** Starting a new round resets the button visibility, score, and timer instead of carrying over old state.`,
					projectLink: "https://scratch.mit.edu/projects/299327014/",
					solutionLink: "https://scratch.mit.edu/projects/299311602/"
				},
				{
					title: "Message Broadcasting",
					content:
						"Broadcasting lets sprites send messages to each other. This is useful when one sprite waits for another sprite to finish speaking, moving, or changing state before its own script begins.\nOpen the Events blocks and compare `broadcast __` with `when I receive __`. Practice by making one sprite finish a short action, broadcast a message, and trigger a second sprite to start moving only after that message is received."
				},
				{
					title: "GM1 Project 5: Dance Off",
					content: `**Project goal:** Build a dance sequence where each sprite gets a turn to perform on the stage.

**Dance sequence:**
1. When the green flag is clicked, reset each dancer to the left side of the stage.
2. Make the ballerina glide to the middle and cycle twice through all costumes.
3. When the ballerina is done, glide her off to the right side.
4. Make each other dancer follow the same pattern one by one.
5. Add clapping or applause between performers.
6. Add backdrop code that plays dancing music during the show.
7. When the final dancer is done, broadcast a message that stops the music.

**Extension:** Add lighting changes, a final applause sequence, or a closing pose after everyone is done.

**Completion check:** The performers appear in a clear order, and the music stops because of a broadcast rather than by timing guesswork.`,
					projectLink: "https://scratch.mit.edu/projects/301002220/",
					solutionLink: "https://scratch.mit.edu/projects/300644693/"
				},
				{
					title: "GM1 Project 6: Hedgehog Race",
					content:
						"Plan Hedgehog Race around the racer controls, starting positions, finish condition, winner announcement, and any variables or broadcasts that coordinate the race.\nAdd a project comment that lists the implementation steps. The starter project can be used as a base, or the race can be rebuilt from a blank project with original sprites, costumes, and backdrops.",
					projectLink: "https://scratch.mit.edu/projects/304551665/",
					solutionLink: "https://scratch.mit.edu/projects/305082197/"
				},
				{
					title: "GM1 Project 7: Asteroid Dodge",
					content:
						"Plan Asteroid Dodge around the player movement, asteroid spawn or reset rules, collision response, score or survival state, and replay behavior.\nAdd a project comment that lists the implementation steps. The starter project can be used as a base, or the dodge game can be rebuilt from a blank project with original sprites, costumes, and backdrops.",
					projectLink: "https://scratch.mit.edu/projects/303001451/",
					solutionLink: "https://scratch.mit.edu/projects/302948550/"
				}
			],
			supplementalProjects: [
				{
					title: "Review: Events, Loops, Conditionals, & Broadcasting: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle:
							"Review: Events, Loops, Conditionals, & Broadcasting",
						section: "extension"
					}),
					projectLink: "https://scratch.mit.edu/projects/287707460/",
					solutionLink: "https://scratch.mit.edu/projects/284408078/"
				},
				{
					title: "Review: Events, Loops, Conditionals, & Broadcasting: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "multi-script review game",
						focus: "events, loops, conditionals, broadcasts, and variables working together in one small scene",
						restartCheck:
							"The scene restarts without leftover broadcasts, stale variable values, or scripts that keep running unexpectedly."
					})
				},
				{
					title: "Review: Events, Loops, Conditionals, & Broadcasting: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "review challenge",
						coreIdea:
							"events, loops, conditionals, and broadcasts as one coordinated system",
						variation:
							"the input controls, repeated behavior, branch condition, or broadcast-driven scene change",
						evidence:
							"At least one event starts a loop, one condition changes the outcome, and one broadcast coordinates another sprite."
					})
				}
			]
		},
		{
			title: "GM2 Nested Loops",
			curriculum: [
				{
					title: "Nested loops",
					content:
						"A nested-loop pattern places one loop inside another loop. The idea is similar to Russian nesting dolls: one structure sits inside another structure.\nThis pattern is useful when a repeated action itself contains another repeated action, such as drawing several rows of shapes, building grids, or repeating an animation pattern multiple times."
				},
				{
					title: "GM2 Project 1: Square Inception",
					content:
						"1. Trace the order of the sample pattern before building it.\n2. Program the cat to draw the first small square in the bottom-right quadrant. Clear the canvas first and put the pen down before drawing starts.\n3. Program the medium square and then the large square.\n4. After the three squares are drawn in the bottom-right quadrant, turn 90 degrees and change the pen color by 25.\n5. Add nested loops to draw the same square pattern in the other three quadrants.\n6. Store side length in a variable to simplify the code further.",
					projectLink: "https://scratch.mit.edu/projects/306391834/",
					solutionLink: "https://scratch.mit.edu/projects/306394145/"
				},
				{
					title: "GM2 Project 2: Pyramid",
					content:
						"1. Trace the sample pattern before building it.\n2. Program the cat to draw the first tiny triangle. Start at (0, 120), point in direction 150 degrees, and put the pen down before drawing starts.\n3. Program a slightly larger triangle, then an even larger triangle.\n4. Add nested loops and a variable to draw 15 total triangles for the pyramid.",
					projectLink: "https://scratch.mit.edu/projects/307922307",
					solutionLink: "https://scratch.mit.edu/projects/307918456"
				},
				{
					title: "Nested Loops: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Nested Loops",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GM2 Supplemental Project 1: Playing Baseball",
					content: `**Project goal:** Coordinate a pitcher and batter animation with loops and broadcasts.

**Build steps:**
1. Set the pitcher's costume to the first costume at the start.
2. Make the pitcher say "Batter up!" and cycle through all pitching costumes.
3. Broadcast a message when the pitch is complete.
4. When the batter receives the message, cycle through the batter's costumes.
5. Decide how many strikes create an out, then repeat the pitch-and-bat sequence that many times.

**Completion check:** The batter waits for the pitch broadcast instead of starting at the same time as the pitcher.

**Evidence check:** A correct sequence can be traced as pitcher action, broadcast, batter response, strike update, and repeat.`,
					projectLink: "https://scratch.mit.edu/projects/334075920",
					solutionLink: "https://scratch.mit.edu/projects/334073245/"
				},
				{
					title: "GM2 Supplemental Project 2: Grid",
					content: `**Project goal:** Draw a grid by treating one row as a repeated pattern and then repeating the row.

**Build steps:**
1. Plan how the pencil position changes after each square in one row.
2. Start the pencil at (-200, 150).
3. Draw 8 squares with side length 50 from left to right.
4. Extend the row logic into multiple rows by changing the starting position for each row.
5. Draw 6 rows of squares from the top to the bottom of the screen.

**Checkpoints:**
- The grid has consistent square size, row spacing, and column spacing.
- One row can be traced before the row logic repeats downward across the stage.`,
					projectLink: "https://scratch.mit.edu/projects/334073152/",
					solutionLink: "https://scratch.mit.edu/projects/334067890/"
				},
				{
					title: "GM2 Supplemental Project 3: Rainbow Flower",
					content: `**Project goal:** Draw a rainbow flower by repeating and rotating a circular petal pattern.

**Build steps:**
1. When the green flag is clicked, move the pencil to the center and put the pen down.
2. Start with a circle and inspect how the turn amount affects the drawing.
3. Store the angle in a variable and increase it by 1 each loop iteration.
4. Set the starting angle to 0 degrees and repeat 40 times to create a spiral.
5. Reuse the petal pattern to create six more petals that start near the flower center and move outward.
6. Change the pen color after each petal to create a rainbow effect.

**Completion check:** The finished flower shows both repetition and controlled variation: repeated petals, changing angle, and changing color.`,
					projectLink: "https://scratch.mit.edu/projects/335808333/",
					solutionLink: "https://scratch.mit.edu/projects/335807180/"
				}
			]
		},
		{
			title: "GM3 Complex Conditionals",
			curriculum: [
				{
					title: "Complex conditionals",
					content:
						"A complex conditional combines more than one condition. The `and` block requires both conditions to be true, the `or` block requires at least one condition to be true, and the `not` block reverses true and false.\nPractice by making a sprite respond differently when it touches multiple colors, either one of two colors, or none of the target colors."
				},
				{
					title: "GM3 Project 1: Color Spotter",
					content:
						'1. Program controls for the cat so that he moves around on the screen when the arrow keys are pressed.\n2. Using conditionals, program the cat to say "I\'m touching red and blue" if he is touching red and blue.\n3. Add similar conditionals for red and yellow, and blue and yellow.\n4. If the cat is touching all three colors, make him say "I\'m touching all 3 colors!"\n5. If the cat is touching no colors, make him say "I\'m touching no colors!"\n6. If the cat is touching any one of the colors, make him say "I\'m touching a color!"',
					projectLink: "https://scratch.mit.edu/projects/306694840/",
					solutionLink: "https://scratch.mit.edu/projects/306689852/"
				},
				{
					title: "GM3 Project 2: Strength Tester",
					content:
						'1. When the green flag is clicked, make the button say "Click me to see how strong you are!"\n2. When the button is clicked, make it broadcast the message "How strong".\n3. When the arrow receives this message, make it go to (-130, -160), pick a random number between 0 and 300, and move up by this amount.\n4. Based on the random number, make the button say one of at least five different messages, like "You\'re the strongest person ever!" or "It looks like you need to go to the gym!"',
					projectLink: "https://scratch.mit.edu/projects/307992404/",
					solutionLink: "https://scratch.mit.edu/projects/307934264/"
				},
				{
					title: "Complex Conditionals: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Complex Conditionals",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GM3 Supplemental Project 1: Baby Chick",
					content: `**Project goal:** Guide the baby chick to its parents with arrow-key movement and compound condition checks.

**Build steps:**
1. Program the chick so it can move up, down, left, and right with the arrow keys.
2. When the green flag is clicked, make the rooster point right and move back and forth forever.
3. Add variety by letting the rooster turn 180 degrees randomly while walking.
4. Repeat the same movement pattern for the hen.
5. Program the chick to detect four states: touching both parents, touching only the hen, touching only the rooster, or touching neither parent.
6. Display a different message for each state, such as "I love my parents!", "Hi, Mom!", "Hi, Dad!", or "Where are my parents?"

**Completion check:** The chick must update its message correctly as it moves between the four possible touching states.`,
					projectLink: "https://scratch.mit.edu/projects/335794156/",
					solutionLink: "https://scratch.mit.edu/projects/335790153/"
				},
				{
					title: "GM3 Supplemental Project 2: Save the Butterfly",
					content: `**Project goal:** Help the butterfly escape the frog with alternating-key controls, random movement, broadcasts, and compound conditionals.

**Setup:**
1. When the green flag is pressed, place the butterfly at (-60, 0) and the frog at (-170, 0).
2. Have the frog say "I'm hungry", "Ooh, a butterfly!", and "I'm coming to get you!" for two seconds each.
3. After the introduction, make the frog move a random number of steps from 0 to 3 for the rest of the game. Increase the step range for a harder version.

**Butterfly controls:**
1. Add a wait-until pattern so the butterfly moves forward 5 steps when the player alternates between the left and right arrow keys.
2. Prevent the shortcut where holding both keys down bypasses the intended control pattern.
3. Add complex conditionals to make the control rule explicit.

**Win and loss rules:**
1. If the butterfly touches the frog, stop the butterfly scripts, broadcast a loss message, hide the butterfly, and reset visibility on the next green flag.
2. If the butterfly touches the dark purple tree, broadcast a win message and glide the butterfly off the screen.
3. When the frog receives either the win or loss broadcast, stop the remaining scripts and respond with the matching outcome.

**Completion check:** The butterfly moves only with the intended alternating-key pattern, and the win/loss broadcasts end the game cleanly.`,
					projectLink: "https://scratch.mit.edu/projects/335798048",
					solutionLink: "https://scratch.mit.edu/projects/335794365"
				},
				{
					title: "Complex Conditionals: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "complex-conditional challenge",
						coreIdea:
							"AND, OR, NOT, or nested logic that separates similar-looking states",
						variation:
							"the combination of keys, touching states, score thresholds, or timer conditions that trigger an outcome",
						evidence:
							"Testing includes true, false, and partial-match cases so the combined logic is visibly necessary."
					})
				}
			]
		},
		{
			title: "GM4 Cloning",
			curriculum: [
				{
					title: "Cloning",
					content:
						"A clone is a temporary copy of a sprite while the project runs. This is useful when many similar objects appear on screen, such as raindrops, paint marks, enemies, stars, or collectibles.\nThe main Scratch blocks are `create clone of myself`, `when I start as a clone`, and `delete this clone`. Most clone-based projects hide the original parent sprite and show only the clones, because the clones are the objects that move, collide, and disappear."
				},
				{
					title: "GM4 Project 1: Jackson Pollock Clones",
					content:
						"1. Start by making the parent pencil create clones of itself continuously.\n2. When a clone is created, make it go to a random location, choose a random size and color, and then glide to another random location. Be sure to use the pen block that sets a color using a number, not the block that takes a color as an input. If the wrong block is used, only shades of blue will appear.\nChallenge: Make the brush strokes look more realistic with slightly varying angles, colors, and widths.",
					projectLink: "https://scratch.mit.edu/projects/307580100/",
					solutionLink: "https://scratch.mit.edu/projects/307575111/"
				},
				{
					title: "GM4 Project 2: Rainy Day",
					content:
						"1. Program the umbrella so that it can be moved with the left and right arrow keys.\n2. Program the chick to continuously move forward in little steps and bounce if it hits a wall. Also make the chick switch directions randomly, once every few steps.\n3. Program the rain drop to create clones of itself continuously.\n4. When a clone is created, make it fall from the sky. Decide what happens when it touches the chick and when the clone is deleted, then add these scenarios into the code.\n5. Keep track of the number of times the chick got wet, and give the player 60 seconds to protect the chick as much as possible.",
					projectLink: "https://scratch.mit.edu/projects/307634451/",
					solutionLink: "https://scratch.mit.edu/projects/307629921/"
				},
				{
					title: "Cloning: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Cloning",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GM4 Supplemental Project 1: Fruity Fest",
					content:
						"1. Set up the parrot to move around with the up/down/left/right arrow keys.\n2. Set up the fruit so that a clone is created every second. Each clone is a random piece of fruit and appears in a random location.\n3. Keep track of the total amount of fruit the parrot collects, and end the game and display the fruit platter once the parrot collects 10 pieces.",
					projectLink: "https://scratch.mit.edu/projects/336915372/",
					solutionLink: "https://scratch.mit.edu/projects/336928836/"
				},
				{
					title: "Cloning: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "clone-spawning scene",
						focus: "clone creation, clone startup behavior, clone deletion, and avoiding duplicated main-sprite logic",
						restartCheck:
							"Clones appear only when intended, clean themselves up, and do not multiply uncontrollably after restart."
					})
				},
				{
					title: "Cloning: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "clone-based game mechanic",
						coreIdea:
							"many similar objects controlled by one reusable script",
						variation:
							"the clone spawn pattern, movement behavior, lifetime, collision effect, or difficulty increase",
						evidence:
							"The main sprite and clones have distinct roles, and deleting a clone does not break future clone creation."
					})
				}
			]
		},
		{
			title: "Check-in #1",
			curriculum: [
				{
					title: "Check-in #1: Nested Loops",
					content: `**Check-in goal:** Review loops and nested loops with a small Scratch drawing project.

**Setup:** Create a new blank Scratch project named "Check-in #1".

**Prompts:**
1. Define a loop and explain what it means for one loop to be placed inside another loop.
2. Add a sprite that plays a sound when the spacebar is pressed. Put a repeat 3 around the sound block, then put a repeat 2 around the whole script. Predict the total number of sounds before running it.
3. When the green flag is clicked, draw a triangle, turn 60 degrees, and draw another triangle. Add a repeat block to form a hexagon of triangles.
4. Draw another larger hexagon around the first one. A loop around the existing code can remove repetition.

**Completion check:** The prediction for the sound loop matches the actual run, and the drawing shows why nested loops reduce repeated code.`,
					solutionLink: "https://scratch.mit.edu/projects/341945558/"
				},
				{
					title: "Check-in #1: Cloning",
					content: `**Check-in goal:** Review how clones let one sprite create temporary copies with their own behavior.

**Prompts:**
1. Explain how Scratch can duplicate sprites and make the duplicates do different things.
2. Move the drawing code so the parent sprite creates clones every 2 seconds after the green flag is clicked.
3. Make each clone go to a random position and draw the hexagon shape.
4. Make clones show when created and delete themselves when finished.
5. Decide what the original parent sprite does while it is not drawing.

**Completion check:** The parent sprite manages clone creation while the clones handle the drawing and cleanup.`,
					solutionLink: "https://scratch.mit.edu/projects/341945558/"
				},
				{
					title: "Check-in #1: Complex Conditionals",
					content:
						"Complex-1: What block would you use if you wanted to check if two things are true in the same if/then block?\nComplex-2: What about if you wanted to check if, given two things, at least one of them is true?\nComplex-3: What about if you wanted to check if a condition isn't true?\nComplex-ALL: Using complex conditionals, update your code so that the clones that are in the top right portion of the screen all have a blue pen color. (Hint: You may have to use coordinates!) Now, can you add code so that each of the four quadrants uses a different pen color?",
					solutionLink: "https://scratch.mit.edu/projects/341945558/"
				},
				{
					title: "Check-in #1: Additional Practice Project",
					content:
						"Make the owl count from 1 to 50 with a variable.\nAdd a conditional so that if the spacebar or the up arrow is pressed, the owl says something instead of the number.\nAdd a conditional so that if the mouse pointer is on the owl, it gets shy and doesn't say anything at all!",
					projectLink: "https://scratch.mit.edu/projects/386649746/",
					solutionLink: "https://scratch.mit.edu/projects/386368696/"
				}
			],
			supplementalProjects: [
				{
					title: "Check in #1: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Check in #1",
						section: "extension"
					}),
					solutionLink: "https://scratch.mit.edu/projects/341945558/"
				},
				{
					title: "Check in #1: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "checkpoint review slice",
						focus: "events, loops, conditionals, broadcasts, and clones in the smallest playable project possible",
						restartCheck:
							"The review slice shows which concept controls each behavior, rather than hiding everything in one long script."
					})
				},
				{
					title: "Check in #1: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "checkpoint remix",
						coreIdea:
							"a readable mini-project that combines first-half Scratch Level 2 concepts",
						variation:
							"one rule from a prior project, such as collision handling, message flow, clone behavior, or score logic",
						evidence:
							"The remix has a short explanation that names which concept each major script demonstrates."
					})
				}
			]
		},
		{
			title: "GM5 Strings",
			curriculum: [
				{
					title: "Strings",
					content:
						"Programs can store different kinds of data. Earlier variables mainly held numbers for scores, timers, movement, and comparisons. Strings store text: words, letters, spaces, punctuation, and other characters.\nA string can be thought of as characters connected in order. Scratch string blocks make it possible to join text, read a specific character, and measure text length. Practice with `join __ __`, `letter __ of __`, and `length of __`. String length includes spaces and punctuation, not just letters. Good string reasoning always checks position and length: the first character, last character, an input that is too short, and an input with a space can all change the result."
				},
				{
					title: "GM5 Project 1: Security Bot",
					content: `**Project goal:** Build a security robot with Scratch string blocks that ask questions and check text responses.

**String checks:**
1. Ask for the user's name and reply with "Nice to meet you, _____".
2. Ask for a word that starts with q and report whether it matches.
3. Ask for a 7-letter word and report whether it matches.
4. Ask for a word that ends in y and report whether it matches.

**Extension:** Ask for a 6-letter word that starts with a and report whether it matches.

**Completion check:** Each rule checks the user's actual text rather than only reacting to any answer.`,
					projectLink: "https://scratch.mit.edu/projects/308722400/",
					solutionLink: "https://scratch.mit.edu/projects/308717171/"
				},
				{
					title: "GM5 Project 2: Spelling Bee",
					content: `**Project goal:** Spell words in different patterns with string indexing and loops.

**Key commands:**
1. When 1 is pressed, ask for a word and spell it letter by letter. Example: C-O-D-I-N-G.
2. When 2 is pressed, spell all but the first letter. Example: O-D-I-N-G.
3. When 3 is pressed, spell all but the last letter. Example: C-O-D-I-N.
4. When 4 is pressed, spell all but the first and last letters. Example: O-D-I-N.
5. When 5 is pressed, spell every other letter. Example: C-D-N.
6. When 6 is pressed, spell the word backward. Example: G-N-I-D-O-C.

**Completion check:** Each key uses the same input idea but a different string traversal pattern.`,
					projectLink: "https://scratch.mit.edu/projects/357452950/",
					solutionLink: "https://scratch.mit.edu/projects/357452924/"
				},
				{
					title: "Strings: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Strings",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GM5 Supplemental Project 1: Crazy Country",
					content: `**Project goal:** Create a fictional country profile using user input and joined strings.

**Build steps:**
1. Ask for the country name and save the response.
2. Ask for the leader's name and save the response.
3. Ask for the main activity the country is known for and save the response.
4. Report the full country profile back using say and join blocks.

**Extension:** Build the full report with one say block that contains several joined text pieces.

**Completion check:** The final message includes all three user-provided details in a readable sentence.`,
					projectLink: "https://scratch.mit.edu/projects/338824789",
					solutionLink: "https://scratch.mit.edu/projects/338828947/"
				},
				{
					title: "GM5 Supplemental Project 2: Beary Spelly",
					content: `**Project goal:** Build a spelling test that checks one letter at a time.

**Build steps:**
1. Treat the starter's Secret Word variable as the word to spell.
2. Add the Text to Speech extension and speak the secret word.
3. Ask the user to enter the word one letter at a time.
4. If a letter is correct, speak "Correct!"
5. If a letter is incorrect, end the game.
6. If the full word is spelled correctly, speak "You spelled [secret word] correctly!"

**Completion check:** The spelling test compares each typed letter to the matching position in the secret word.`,
					projectLink: "https://scratch.mit.edu/projects/338829500",
					solutionLink: "https://scratch.mit.edu/projects/338832976"
				},
				{
					title: "Strings: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "string-input tool or word game",
						coreIdea:
							"text input, letter positions, string length, and response-specific output",
						variation:
							"the word rule, username formatter, secret-code checker, spelling helper, or revealed-letter pattern",
						evidence:
							"Testing uses one normal word, one short word, and one input with spaces or repeated letters."
					})
				}
			]
		},
		{
			title: "GM6 Mathematical Operators",
			curriculum: [
				{
					title: "Mathematical Operators",
					content:
						"Computers can calculate, compare, and combine numbers quickly, which makes mathematical operators useful for games, quizzes, simulations, and score systems.\nCreate a new Scratch project. Open the Operators section, and experiment with how different mathematical operations can be performed with these blocks."
				},
				{
					title: "GM6 Project 1: Calculator",
					content:
						'1. Ask the user for the first number, the second number, and the operation (+, -, *, or /). Store each of them in variables.\n2. Using conditionals, depending on what the user entered, have the calculator say the answer.\nChallenge: Add "remainder" as an operation option. For example, the remainder when 10 is divided by 3 is 1.\nChallenge #2: Add exponent (^) as operation option. For example, 2^3 = 8.',
					projectLink: "https://scratch.mit.edu/projects/357453092/",
					solutionLink: "https://scratch.mit.edu/projects/357453067/"
				},
				{
					title: "GM6 Project 2: FizzBuzz",
					content:
						"1. Program the butterfly to count from 1 to 50.\n2. If the number is a multiple of 3, instead of saying the number, make the butterfly say Fizz.\n3. If the number is a multiple of 5, instead of saying the number, make the butterfly say Buzz.\n4. If the number is a multiple of 3 and 5, instead of saying the number or any other word, make the butterfly say FizzBuzz.\nThe first few numbers in the sequence are: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz...",
					projectLink: "https://scratch.mit.edu/projects/357453182/",
					solutionLink: "https://scratch.mit.edu/projects/357453140/"
				},
				{
					title: "Mathematical Operators: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Mathematical Operators",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GM6 Supplemental Project 1: Times Tables",
					content: `**Project goal:** Build a multiples practice tool that generates a times table from user input.

**Build steps:**
1. Ask which number the user wants multiples of.
2. Create a multiplier variable and set it to 1.
3. Say the product of the user's number and the multiplier.
4. Increase the multiplier by 1.
5. Repeat until Scratch has said the first ten multiples.

**Extension:** Ask how many multiples the user wants to hear, then repeat for that many values instead of always stopping at ten.

**Completion check:** The multiplier updates each round so the output is a sequence, not the same product repeated.`,
					projectLink: "https://scratch.mit.edu/projects/338508588/",
					solutionLink: "https://scratch.mit.edu/projects/338505545/"
				},
				{
					title: "GM6 Supplemental Project 2: Stamping with Dotty",
					content: `**Project goal:** Graph the absolute value function with Dotty by turning user input into stamped coordinates.

**Interactive graphing:**
1. When the green flag is clicked, move Dotty to the center.
2. Ask for an x-coordinate.
3. Set Dotty's x-coordinate to the answer.
4. Set Dotty's y-coordinate to the absolute value of the answer.
5. Say the new coordinates and leave a stamp.
6. Repeat the process 10 times to graph 10 points.

**Automated graphing:** Move Dotty to (-180, 180), put the pen down, and repeatedly increase x by 1 while setting y to the absolute value of x.

**Completion check:** The stamped points form the expected V-shape for an absolute value function.`,
					projectLink: "https://scratch.mit.edu/projects/341759115",
					solutionLink: "https://scratch.mit.edu/projects/338501835/"
				},
				{
					title: "Mathematical Operators: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "math-driven game or calculator",
						coreIdea:
							"operators that compute values used by the program rather than values typed by hand",
						variation:
							"the formula, scoring rule, random number range, comparison threshold, or displayed calculation",
						evidence:
							"At least two input values produce different calculated outputs, and one edge case is checked for a sensible result."
					})
				}
			]
		},
		{
			title: "GM7 Lists",
			curriculum: [
				{
					title: "Lists",
					content:
						"A list stores many related values in one variable-like structure. A list can hold items such as groceries, favorite sports, places, names, scores, or words.\nIn programming, lists make it easier to store, inspect, add, remove, and count related items without creating a separate variable for each one.\nPractice by creating a list, adding elements, reading the list length, and deleting all items from the list."
				},
				{
					title: "GM7 Project 1: Bucket List",
					content: `**Project goal:** Build a list program that stores five bucket-list items and repeats them back.

**Build steps:**
1. When the green flag is clicked, have the cat ask for five bucket-list items.
2. Repeat five times, adding each answer to the list.
3. Once the list is complete, loop through the list.
4. Have the cat repeat each bucket-list item back to the user.

**Extension:** Keep asking for new items until the user types "stop" instead of always collecting exactly five items.

**Completion check:** The list preserves every entered item and reports the items in order.`,
					projectLink: "https://scratch.mit.edu/projects/308826506/",
					solutionLink: "https://scratch.mit.edu/projects/308824008/"
				},
				{
					title: "GM7 Project 2: List Practice",
					content: `**Project goal:** Practice adding numbers to a list and reading the same list in several different ways.

**List setup:**
1. When the green flag is clicked, delete everything in the list.
2. When the spacebar is pressed, request the number to add.
3. Add the user's number to the list.

**Read modes:**
1. When 1 is pressed, read the list normally.
2. When 2 is pressed, read each number doubled.
3. When 3 is pressed, read the list backward.
4. When 4 is pressed, read each number and say whether it is odd or even.

**Extensions:** Read every other number, multiply each number by 10, or turn the sprite by each number of degrees.

**Completion check:** The same stored list supports all four read modes without requiring separate variables for each item.`,
					projectLink: "https://scratch.mit.edu/projects/315090026/",
					solutionLink: "https://scratch.mit.edu/projects/315051160/"
				},
				{
					title: "GM7 Project 3: Music Memory",
					content: `**Project goal:** Build a memory game where the keyboard plays a note sequence and the player repeats it back.

**Game flow:**
1. Introduce the game with "Ready... Set... Go!"
2. Say and play 3 random notes.
3. Add those notes to a solution list.
4. Ask the player to type note guesses one at a time.
5. Add guesses to a guess list.
6. If a guess is incorrect, end the game.
7. If all guesses are correct, start a new round with one additional note.

**Completion check:** The solution list and guess list make it clear which note failed when the player makes a mistake.`,
					projectLink: "https://scratch.mit.edu/projects/309658040/",
					solutionLink: "https://scratch.mit.edu/projects/309653930/"
				}
			],
			supplementalProjects: [
				{
					title: "GM7 Supplemental Project 1: Multiple Magic",
					content: `**Project goal:** Build a quick math game where the player enters multiples of a randomly chosen target number.

**State to track:**
- target-number: the number whose multiples are accepted.
- score: the number of valid, non-duplicate multiples entered.
- A list of accepted multiples so repeated answers do not count twice.

**Game flow:**
1. When the green flag is pressed, set target-number to a random number from 1 to 10.
2. Clear the accepted-multiples list and reset the score.
3. Have the wizard introduce the game and repeatedly ask for multiples of the target number.
4. Check two conditions for each answer: the answer must be divisible by the target number and must not already be in the list.
5. For a valid new multiple, play a success sound, update the score, and add the answer to the list.
6. For an invalid or repeated answer, give feedback without increasing the score.

**Extension:** Add a timer variable and give the player 30 seconds to score as many valid multiples as possible.`,
					projectLink: "https://scratch.mit.edu/projects/337820507",
					solutionLink: "https://scratch.mit.edu/projects/337817856"
				},
				{
					title: "GM7 Supplemental Project 2: Wheel of Fortune",
					content: `**Project goal:** Build a word-guessing game where the player has a limited number of guesses to find every unique letter in a secret word.

**Lists and variables:**
- A word-bank list stores possible secret words.
- A secret-letter list stores the unique letters in the chosen word.
- A guess list stores letters already guessed correctly.
- A remaining-guesses variable controls when the game ends.

**Game flow:**
1. Choose a random word from the word bank at the beginning of each game.
2. Add the unique letters from the secret word to the secret-letter list. Do not add the same letter twice.
3. Ask the player to guess one letter at a time.
4. If the guessed letter is in the secret word and has not already been guessed, add it to the guess list and update the correct-guess count.
5. Reduce the remaining guess count after each guess or after each incorrect guess, depending on the chosen game rule.
6. The player wins after guessing all unique letters and loses after running out of guesses.

**Completion check:** Repeated guesses do not count as new progress, and the game clearly shows whether the player won or lost.`,
					projectLink: "https://scratch.mit.edu/projects/340691786",
					solutionLink: "https://scratch.mit.edu/projects/342643080"
				},
				{
					title: "Lists: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "list-backed quiz, inventory, or tracker",
						coreIdea:
							"lists as stored collections that can be read, updated, searched, or displayed",
						variation:
							"the list contents, add/remove rule, random selection rule, ranking behavior, or end-of-game summary",
						evidence:
							"The project shows the list changing during play and handles the first item, last item, or empty-list case deliberately."
					})
				}
			]
		},
		{
			title: "GM8 Functions",
			curriculum: [
				{
					title: "Functions",
					content: `**Concept path:** Custom blocks in Scratch work like functions. A function is a named set of instructions that can be reused whenever a sprite needs that behavior.

**Definition and call:** The My Blocks section creates custom blocks, defines what each block does, and calls those blocks from other scripts. Defining a function describes the behavior once; calling the function runs that behavior with specific input values.

**Why it matters:** Functions keep projects organized by separating repeated behavior into named pieces. A game such as Music Memory could use functions for playing a note sequence, checking an answer, resetting a round, or displaying feedback.`
				},
				{
					title: "GM8 Project 1: My First Functions",
					content: `**Project goal:** Create reusable custom blocks so the cat can perform several actions without duplicating scripts.

**Custom blocks to build:**
1. A speaking function that makes the cat speak a given number of times.
2. A square-drawing function that takes the side length as input.
3. A jump function that takes the jump height as input.
4. A teleport function with no inputs: spin, move to a random spot with a sound effect, then spin again.

**Green-flag sequence:** The main script calls the custom blocks to make the cat jump 100 steps, speak 3 times, draw a square of size 100, teleport, and draw another square.

**Completion check:** Each behavior is defined once as a custom block and then called from the main green-flag script.`,
					projectLink: "https://scratch.mit.edu/projects/315773207",
					solutionLink: "https://scratch.mit.edu/projects/315770711/"
				},
				{
					title: "GM8 Project 2: Talent Show II",
					content: `**Project goal:** Build a talent-show project where user input selects which custom function the cat performs.

**Function design:**
1. Create at least four talent functions.
2. Give each function a clear name, such as play song, spin, jump, or draw shape.
3. At least two talents use inputs, such as number of notes, number of spins, jump height, or drawing size.

**Interaction flow:**
1. When the green flag is clicked, the cat introduces the talent show.
2. Ask which talent to perform.
3. Ask for any input value that the selected talent needs.
4. Call the matching custom block with the selected input.

**Completion check:** The same talent function works with different input values, proving that the custom block is reusable.`,
					projectLink: "https://scratch.mit.edu/projects/309293557",
					solutionLink: "https://scratch.mit.edu/projects/309287208/"
				},
				{
					title: "Functions: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Functions",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GM8 Supplemental Project 1: Extra Functions",
					content: `**Project goal:** Practice custom blocks with inputs by building several small reusable tools.

**Function set:**
1. Shape drawer: takes the number of sides and side length as inputs. Turn 360 / sides degrees after each side.
2. Counter: takes a starting number and ending number, then counts inclusively from start to end.
3. Calculator reporter: takes two numbers and reports the sum, difference, product, and quotient.
4. Multiples announcer: takes a number and says the first 10 multiples of that number.

**Extensions:**
- Make the counter count down if the ending number is smaller than the starting number.
- Add average to the calculator reporter.
- Add a second input to the multiples function so it can say any requested number of multiples.

**Completion check:** Each function is reusable with different inputs and avoids copy-pasted blocks when the behavior is the same.`,
					projectLink: "https://scratch.mit.edu/projects/339918479",
					solutionLink: "https://scratch.mit.edu/projects/339602908"
				},
				{
					title: "GM8 Supplemental Project 2: Rock Paper Scissors",
					content: `**Project goal:** Build a rock-paper-scissors game whose main steps are separated into custom functions.

**Function roles:**
1. get computer answer: randomly choose rock, paper, or scissors and store the result in a variable. A list can simplify the random choice.
2. get player answer: ask for rock, paper, or scissors and store the result in a variable.
3. validate player answer: keep asking if the input is not rock, paper, or scissors.
4. find winner: compare both answers using the rules rock beats scissors, scissors beats paper, and paper beats rock.

**Extension:** Add helper functions for player wins, computer wins, and ties so the feedback code stays organized.

**Completion check:** The game handles invalid input, ties, and all six non-tie matchups without duplicated decision logic.`,
					projectLink: "https://scratch.mit.edu/projects/339972570/",
					solutionLink: "https://scratch.mit.edu/projects/339731727/"
				},
				{
					title: "Functions: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "custom-block project",
						coreIdea:
							"functions as reusable custom blocks with clear names and parameters where helpful",
						variation:
							"the repeated behavior placed in a block, the parameters, or the way multiple sprites reuse the same operation",
						evidence:
							"The project calls a custom block from more than one place or uses a parameter to avoid duplicate scripts."
					})
				}
			]
		},
		{
			title: "Check-in #2",
			curriculum: [
				{
					title: "Check-in #2: Strings",
					content:
						'Create a new blank project in Scratch, and name it "Check-in #2".\nStrings-1: What does the word “string” mean in Scratch?\nStrings-2: Add the Andie sprite to your project. When the 1 key is pressed, have him ask the user what their name is. Once the user responds, have him say “Hello [your name]” using one say block.\nStrings-3,4: Report to the user the first letter of their name and how many letters are in their name.',
					solutionLink: "https://scratch.mit.edu/projects/342645999/"
				},
				{
					title: "Check-in #2: Mathematical Operators and Randomness",
					content:
						"Math-1: How can Scratch perform operations on numbers? Where are these blocks located?\nMath-2: When the 2 key is pressed, make Andie say the result of adding together 5 and 6.\nMath-3,4: Create a random number between 1 and 20 and store it in a variable. If the number is less than 10, have Andie say “Wow, that's a small number!” otherwise, say “Whoa, that's a big number!”\nMath-5: What is the mod block? Have it report to the user the remainder of dividing any two numbers.",
					solutionLink: "https://scratch.mit.edu/projects/342645999/"
				},
				{
					title: "Check-in #2: Lists",
					content: `**Check-in goal:** Review how lists store related values and support repeated behavior.

**Prompts:**
1. Explain what lists are useful for in Scratch.
2. Rename each of Andie's costumes to match its action, such as pass or shoot.
3. Create a list called actions and add each costume name when 3 is pressed.
4. Make Andie say the second item in the list.
5. Report all available actions by looping through the list.
6. After reporting all actions, ask which action to show and switch to that costume.
7. Clear the list first so pressing 3 does not add duplicate items.

**Completion check:** The action list is rebuilt cleanly and controls the costume selection.`,
					solutionLink: "https://scratch.mit.edu/projects/342645999/"
				},
				{
					title: "Check-in #2: Functions",
					content: `**Check-in goal:** Review custom blocks as reusable Scratch functions.

**Prompts:**
1. Explain what functions are in Scratch and where custom blocks can be created.
2. Create a function called Score! that changes Andie's costume, says "Woohoo!", and plays a clapping sound.
3. Make Andie score when the spacebar is pressed.
4. Create a function called Find Multiples that takes one number input.
5. Have Find Multiples say the first 10 multiples of the input number.
6. When the spacebar is pressed, make Andie say the multiples of a random number from 1 to 10.

**Completion check:** The same Find Multiples custom block works for different random inputs.`,
					solutionLink: "https://scratch.mit.edu/projects/342645999/"
				},
				{
					title: "Check-in #2: Additional Practice Project",
					content: `**Project goal:** Combine functions, costume loops, math operators, and lists in one dancing-sprite project.

**Build steps:**
1. Add one dancing sprite.
2. Create a function that loops through all of the sprite's costumes.
3. Add a number input for how many seconds the dance lasts.
4. Calculate the wait block with division so the total costume loop lasts the requested number of seconds.
5. When the green flag is pressed, make the sprite dance for 3 seconds.
6. Ask for the user's top five favorite dance moves by costume number.
7. Store those favorite moves in a list.
8. Create a function that loops through the favorite-moves list.
9. Make the sprite repeat those favorite moves forever.

**Completion check:** The dance timing depends on the input value, and the favorite-move loop comes from the list rather than hard-coded costume changes.`,
					projectLink: "https://scratch.mit.edu/projects/386649865/",
					solutionLink: "https://scratch.mit.edu/projects/386376803/"
				}
			],
			supplementalProjects: [
				{
					title: "Check in #2: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Check in #2",
						section: "extension"
					}),
					solutionLink: "https://scratch.mit.edu/projects/342645999/"
				},
				{
					title: "Check in #2: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "second checkpoint review",
						focus: "strings, operators, lists, and custom blocks in a compact project with visible data flow",
						restartCheck:
							"The review project can be explained by tracing one input through storage, calculation, list update, and output."
					})
				},
				{
					title: "Check in #2: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "data-and-functions remix",
						coreIdea:
							"stored data and reusable blocks that make the project easier to extend",
						variation:
							"the data source, calculation rule, list operation, or custom block interface",
						evidence:
							"The remix includes one visible data structure and one custom block that reduces repeated code."
					})
				}
			]
		},
		{
			title: "GM9 Fish Food",
			curriculum: [
				{
					title: "GM9 Project 1: Fish Food",
					content:
						"Plan Fish Food around the fish controls, food movement, scoring, hazards or missed-food behavior, and the condition that ends or resets the game.\nCreate a blank Scratch project and add a project comment that lists the implementation steps. Build Fish Food with custom sprites and backdrops as preparation for the master project.\nTest that food appears predictably, score changes only when intended, and the game can be replayed from a clean state.",
					projectLink: "https://scratch.mit.edu/projects/468227197"
				},
				{
					title: "Fish Food: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Fish Food",
						section: "debugging"
					})
				},
				{
					title: "Fish Food: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Fish Food",
						section: "planning"
					})
				},
				{
					title: "Fish Food: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Fish Food",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GM9 Supplemental Project 1: Platformer Pal",
					content: `**Project goal:** Build a multi-level platformer where Pal collects magic keys and moves through level-specific rules.

**Level structure:**
1. Inspect the backdrops for each level and create broadcasts for Level 1, Level 2, and Level 3.
2. When the green flag is clicked, switch to the Level 1 backdrop and broadcast Level 1.
3. Keep each level's setup and movement scripts tied to its own broadcast so the code stays organized.

**Pal movement:**
1. When Pal receives Level 1, place Pal at the starting point.
2. Run a forever loop for ground checks and arrow-key movement.
3. Move Pal down when it is not touching green so gravity keeps it on the ground.
4. Move Pal left and right with the arrow keys.
5. When the up arrow is pressed, make Pal jump by increasing its y position. For a harder version, prevent Pal from jumping through platforms.

**Level transitions:**
1. Place the magic key for Level 1 and show it when Level 1 starts.
2. When Pal reaches the key, switch to the next backdrop, broadcast the next level, and stop the Level 1 script.
3. Repeat the structure for Level 2, including a pitfall reset when Pal touches the brown pitfall.
4. Repeat the structure for Level 3, including teleporters that move Pal from the teleporter in to the teleporter out.
5. When Pal collects the Level 3 key, broadcast the end of the game and switch to the ending backdrop.

**Completion check:** Each level resets cleanly, uses the correct broadcast, and avoids running old level scripts after the backdrop changes.`,
					projectLink: "https://scratch.mit.edu/projects/343651574/",
					solutionLink: "https://scratch.mit.edu/projects/343348430/"
				},
				{
					title: "Fish Food: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "collect-and-avoid game",
						focus: "spawning, movement, collision, score or health state, and end-game feedback",
						restartCheck:
							"Food, hazards, score, and health reset consistently, and each collision affects the correct state once."
					})
				},
				{
					title: "Fish Food: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "resource-collection game",
						coreIdea:
							"balancing reward objects, danger objects, movement, and state variables",
						variation:
							"the collectible type, hazard rule, growth mechanic, difficulty change, or scoring method",
						evidence:
							"The game has one positive collision, one negative collision, and a clear state change after each."
					})
				}
			]
		},
		{
			title: "GM10 Treasure Cave",
			curriculum: [
				{
					title: "GM10 Project 1: Treasure Cave",
					content:
						"Plan Treasure Cave around the explorer controls, treasure collection rules, obstacle or enemy behavior, level progress, and the win or restart condition.\nAdd a project comment that lists the implementation steps. The starter project can be used as a base, or the cave adventure can be rebuilt from a blank project with original sprites, costumes, and backdrops.\nTest that each treasure or obstacle changes game state only once and that the end condition is visible.",
					projectLink: "https://scratch.mit.edu/projects/315336651/",
					solutionLink: "https://scratch.mit.edu/projects/309661591/"
				},
				{
					title: "Treasure Cave: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Treasure Cave",
						section: "debugging"
					})
				},
				{
					title: "Treasure Cave: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Treasure Cave",
						section: "planning"
					})
				},
				{
					title: "Treasure Cave: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Treasure Cave",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GM10 Supplemental Project 1: Fruit Ninja",
					content:
						"Plan Fruit Ninja around the slicing control, fruit spawn timing, score changes, missed-fruit or hazard rules, and the condition that ends the round.\nAdd a project comment that lists the implementation steps. Test repeated slices, missed targets, and restart behavior so the score does not carry stale state between rounds.",
					projectLink: "https://scratch.mit.edu/projects/346953687/",
					solutionLink: "https://scratch.mit.edu/projects/348994271/"
				},
				{
					title: "Treasure Cave: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "maze or exploration scene",
						focus: "movement bounds, treasure or goal detection, hazards, level state, and end-of-level feedback",
						restartCheck:
							"The player starts in the correct position, goals reset correctly, and old win or loss messages disappear."
					})
				},
				{
					title: "Treasure Cave: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "exploration challenge",
						coreIdea:
							"navigation, goals, hazards, and state changes across a playable space",
						variation:
							"the cave layout, treasure rule, hazard behavior, key-and-door mechanic, or level transition",
						evidence:
							"The player has a clear objective, at least one obstacle, and a tested path for success and failure."
					})
				}
			]
		},
		{
			title: "GM11 Master Project",
			curriculum: [
				{
					title: "GM11 Project 1: Master Project",
					content:
						"The master project is an original Scratch game that combines the course's major ideas. Brainstorm the game type, sprites, controls, rules, win/loss condition, variables, lists, and functions before building.\nCreate a new Scratch project and add a planning comment that lists the implementation steps. Build the game as independently as possible, revising the plan when the design changes. A complete project may take more than one work period."
				},
				{
					title: "Master Project Presentation",
					content:
						"Once it's complete, prepare a simple project summary about how the game was programmed, which lists and functions were used, and what design choices made it work.\n\nThe summary reflects on the finished project, the problem-solving involved in building it, and one improvement that would make the game stronger."
				},
				{
					title: "Course Recap",
					content:
						"End the course by reviewing the major Scratch concepts: events, loops, conditionals, complex conditionals, variables, broadcasting, cloning, lists, functions, coordinates, game states, and project planning.\nConnect those ideas to the next text-based programming course. The same logic skills carry over into Python, but the blocks become typed code."
				},
				{
					title: "Optional Extra Practice: Typing and Code Fluency",
					content: `**Purpose:** This resource supports the transition from advanced Scratch projects into typed programming.

Scratch Level 2 already uses larger designs, lists, functions, and coordinated game state. Extra practice therefore focuses less on beginner keyboard discovery and more on maintaining typing comfort while translating familiar block logic into short typed-code patterns.

**Why it matters:** A student who can already plan a Scratch game still has to manage punctuation, spelling, indentation, and syntax in Python or JavaScript. Short typing warmups reduce that friction, but the main target is code fluency: recognizing how Scratch ideas such as variables, loops, conditionals, lists, and functions appear in text.

**Warm-up options:**
- Nitro Type: https://www.nitrotype.com/
- Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game
- Ghost Typing: https://www.abcya.com/games/ghost_typing

**Code-fluency transitions:**
1. Rewrite a Scratch variable update as a typed statement such as \`score = score + 1\`.
2. Rewrite a Scratch repeat loop as a short \`for\` loop.
3. Rewrite a Scratch \`if touching color\` rule as an \`if\` statement with a clear condition.
4. Write a short function name and describe its input, output, and side effect before coding it.

**Stretch practice:**
- Typing Rocket: https://www.abcya.com/games/typing_rocket
- Type Racer project reference: https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer/starter
- Choose one finished Scratch Level 2 project and write a five-line pseudocode version of its main loop.`
				}
			],
			supplementalProjects: [
				{
					title: "GM11 Master Project: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "GM11 Master Project",
						section: "extension"
					})
				},
				{
					title: "GM11 Master Project: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "advanced-project prototype",
						focus: "one finished mechanic, one data or state system, one feedback loop, and one clean restart path",
						restartCheck:
							"The prototype proves the hardest mechanic before extra levels, art, or polish are added."
					})
				},
				{
					title: "GM11 Master Project: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "advanced Scratch capstone",
						coreIdea:
							"a polished project that combines events, control flow, state, data, and reusable scripts",
						variation:
							"the genre, progression system, data model, custom-block structure, or replay challenge",
						evidence:
							"The capstone has a tested core loop, a visible success condition, and one extension that makes the design meaningfully more original."
					})
				}
			]
		},
		{
			title: "GM12 Arcade Systems Studio",
			curriculum: [
				{
					title: "Arcade Systems Concepts",
					content:
						"An arcade system depends on reusable structure: clone creation, list-backed state, custom blocks, broadcasts, and conditionals work together instead of living in separate one-off scripts. The project makes spawn rules, collisions, scoring, levels, and game-over cleanup traceable from the green flag."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Arcade Build Requirements",
					content:
						"Build spawn rules, collision rules, level progression, score state, difficulty changes, and game-over cleanup. Test the full game loop from green flag to restart so the systems can be inspected together."
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
					title: "Arcade Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Arcade Systems Game",
					content:
						"Create an arcade game with reusable reset, spawn, scoring, and level systems. Add one feature, clean up one repeated script pattern, and explain how the systems cooperate."
				}
			]
		},
		{
			title: "GM13 Simulation and Data Studio",
			curriculum: [
				{
					title: "Simulation Concepts",
					content:
						"A Scratch simulation uses variables and lists to represent a changing system over time. The important pieces are the starting values, repeated update rule, random or user-controlled event, visible display, and summary result that explains what happened."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Simulation Build Requirements",
					content:
						"Build population changes, resource collection, random events, graph-like list displays, and repeated trials. Run multiple trials from the green flag and compare how the data changes."
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
					title: "Simulation Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Interactive Data Simulation",
					content:
						"Create an interactive simulation with visible data, a summary statistic, and an explanation of randomness. Add one feature, clean up one repeated update rule, and explain what the data shows."
				}
			]
		},
		{
			title: "GM14 Code Organization and Debugging Studio",
			curriculum: [
				{
					title: "Organization Concepts",
					content:
						"Larger Scratch projects need organization before they become difficult to debug. Named custom blocks, consistent broadcasts, reset scripts, and small subsystems make it possible to explain what starts the project, what changes state, what repeats, and what ends or advances the experience."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Refactor Build Requirements",
					content:
						"Repair duplicated scripts, unclear message names, stale variable state, hidden clones, and custom blocks that do too many things. Test each subsystem separately, then test the whole project from the green flag."
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
					title: "Organization Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Refactored Scratch Project",
					content:
						"Create a refactored Scratch project with a before-and-after explanation. Add one feature only after the cleanup is complete, and explain why the refactor makes the project easier to test."
				}
			]
		},
		{
			title: "GM15 Text-Based Programming Bridge",
			curriculum: [
				{
					title: "Programming Bridge Concepts",
					content:
						"Advanced Scratch concepts map directly to Python readiness: lists store collections, custom blocks behave like functions, inputs resemble parameters, loops repeat actions, conditionals branch, and variables preserve state. The explanation translates a Scratch system into text-code terms without losing how the original project behaves."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Bridge Build Requirements",
					content:
						"Translate Scratch custom blocks into functions, list operations into Python-style list work, and broadcasts into function calls or state changes. Include a trace showing how one Scratch event becomes a text-code sequence."
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
					title: "Bridge Pitfalls",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Scratch-to-Python Bridge Portfolio",
					content:
						"Create a bridge portfolio that translates one Scratch game mechanic into pseudocode and Python-style code. Include the original Scratch behavior, the translated steps, and one explanation of what was easier or harder to express in text."
				}
			]
		}
	]
};
