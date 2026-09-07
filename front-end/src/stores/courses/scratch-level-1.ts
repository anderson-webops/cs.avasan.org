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
			title: "GS0 Play, Notice, and Change",
			estimatedTime: "30–40 minutes",
			keyBlocks: [
				"when green flag clicked",
				"when key pressed",
				"move 10 steps",
				"touching",
				"change score by 1",
				"play sound",
				"forever"
			],
			curriculum: [
				{
					title: "Play first – Bouncy Ball Room",
					learningPath: "core",
					content: `**Project goal:** Play a working project, enjoy it, and notice how several events create different visible or audible responses.

**First 10 minutes:**
1. Select **Play solution** and start the game with the green flag.
2. Press Space to move and bounce the ball.
3. Press Right Arrow to change the backdrop, then press Up Arrow and Down Arrow to change the ball's size.
4. Click the ball to hear a sound and change its color.
5. Pick one response that makes the project fun and one response that could become more interesting.

**Completion checks:**
- The project starts and responds to Space, Right Arrow, Up Arrow, Down Arrow, and a click on the ball.
- One player action can be matched to the response it causes.
- Playing and noticing is a complete first step.`,
					solutionLink: "https://scratch.mit.edu/projects/287922077/"
				},
				{
					title: "Make one small change",
					learningPath: "core",
					content: `**Project goal:** Make one safe, visible change to a game that already works.

Open the Hungry Hippo project and run it once before changing any blocks. Then choose **one** small change:

- choose a different sound for a cheesy puff;
- change one **move 10 steps** block to **move 15 steps**;
- choose a different costume for the hippo;
- choose a different backdrop.

Run the project again and compare the result with the original.

**Completion checks:**
- The four-arrow controls still work.
- One change can be seen or heard.
- One working change completes this activity; extra changes are optional.`,
					projectLink: "https://scratch.mit.edu/projects/304003593/"
				},
				{
					title: "Find blocks by category and color",
					learningPath: "core",
					content: `**Concept path:** Use the category name and color together when finding a block.

- **Events — yellow:** **when green flag clicked**, **when [key] key pressed**, and **when this sprite clicked** start scripts.
- **Motion — blue:** **move**, **turn**, **go to**, **glide**, and **if on edge, bounce** change a sprite's movement or position.
- **Looks — purple:** **say**, costumes, size, and color effects change what students see.
- **Sound — pink:** **start sound** and **play sound until done** control what students hear.
- **Control — orange:** **wait**, **repeat**, **forever**, and **if** control when blocks run.
- **Sensing — light blue:** **ask and wait**, **answer**, **key [ ] pressed?**, and **touching [ ]?** report input or contact; they do not start scripts.
- **Variables — dark orange:** **set [variable] to** and **change [variable] by** store values such as score and time.

Scratch comments can hold short directions beside a script. To add one, right-click an empty white area of the Code workspace and choose **Add Comment**. Type the direction, then drag the comment onto a block to attach it. A comment can explain what a group of blocks does and why it is needed.`
				}
			],
			supplementalProjects: [
				{
					title: "Choice – Add one more reaction",
					learningPath: "choice",
					content: `**Project goal:** Add one more reaction to Hungry Hippo after the one-change activity works.

Choose a small reaction, such as a message when a cheesy puff is collected, a sound when Hard mode starts, or a backdrop change from a key.

**Completion checks:**
- The original controls, score, and timer still work.
- The new reaction happens only from its chosen event or condition.`
				},
				{
					title: "Challenge – Explain and reorder a script",
					learningPath: "challenge",
					content: `**Project goal:** Explain how the order of blocks changes a script's behavior.

Choose one short script and detach its blocks. Put the blocks back in a working order. Right-click an empty white area of the Code workspace, choose **Add Comment**, type an explanation, and drag the comment onto the first block of the rebuilt script so it attaches.

**Completion checks:**
- The rebuilt script produces the same result it produced before.
- The comment names the event, action, and visible or audible response.`
				}
			]
		},
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
					content:
						'\n• Play a sample Hungry Hippo game.\n• Create a custom version of the game using a sprite of your choice.\n• Make the sprite move using the left, right, up and down arrow keys (use the "point in direction" and "move 10 steps" blocks).\n• Decide which module to start in based on understanding of the controls.\n• Program the sprite to collect objects and increase its score each time it collects one.\n• Create variables for "score" and a timer; increase the score when objects are collected and decrease time as the game runs.\n',
					projectLink: "https://scratch.mit.edu/projects/304003593/"
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
					projectLink: "https://scratch.mit.edu/projects/304003593/"
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
					content:
						'\nIt\'s time to build a fun spinner:\n\n1. When the green flag is clicked, make the arrow point to the right.\n2. When the up, left, right or down arrow keys are pressed, point the arrow in the corresponding direction.\n3. When the "A" key is pressed, turn the arrow 15 degrees to the left.\n4. When the "D" key is pressed, turn the arrow 15 degrees to the right.\n5. When the spacebar is pressed, make the arrow point towards the mouse.\n',
					projectLink: "https://scratch.mit.edu/projects/287920173/",
					solutionLink: "https://scratch.mit.edu/projects/287887351/"
				},
				{
					title: "Project 2 – Bouncy Ball Room",
					content:
						"\n1. When the green flag is clicked, have the ball go to a random position.\n2. When the space key is pressed, make the ball move 10 steps and bounce off the edge.\n3. When the right-arrow key is pressed, change the backdrop.\n4. When the up or down arrows are pressed, make the ball grow or shrink (use negative numbers for shrinking).\n5. When the ball is clicked, play a sound and change its color.\n",
					projectLink: "https://scratch.mit.edu/projects/287924505/",
					solutionLink: "https://scratch.mit.edu/projects/287922077/"
				},
				{
					title: "Project 3 – Dragonfly Events",
					content:
						'\n1. When the green flag is clicked, move the dragonfly to a random spot.\n2. Use the arrow keys to move the dragonfly 20 steps.\n3. When the dragonfly is clicked, change its color.\n4. When the space bar is pressed, play a pop sound.\n5. When the "1" key is pressed, make the dragonfly pop and go to a random position.\n6. When the "2" key is pressed, have the dragonfly say something.\n7. When the "3" key is pressed, change the background.\nChallenge: Add another sprite controlled by the W-A-S-D keys.\n',
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
					content:
						"\n1. When the green flag is clicked, send the ball to a random position.\n2. When the spacebar is pressed, make the ball move 10 steps and bounce off the edge.\n3. Each time the ball moves, put the pen down so the ball leaves a trail.\n4. Each time the ball moves, change the pen color.\n5. When the green flag is clicked, erase any existing drawings and lift the pen up before moving the ball to a random position.\n\n",
					projectLink: "https://scratch.mit.edu/projects/313084455/",
					solutionLink: "https://scratch.mit.edu/projects/287952358/"
				},
				{
					title: "Project 2 – Stencil Pencil",
					content:
						'\n1. The up arrow moves the pencil forward; the down arrow moves it backward.\n2. The left arrow rotates the pencil 10 degrees left; the right arrow rotates it 10 degrees right.\n3. Pressing "1" lowers the pen (start drawing).\n4. Pressing "2" lifts the pen (stop drawing).\n5. Clicking the pencil changes its pen color.\n6. Pressing "3" increases the pen size; pressing "4" decreases the pen size.\n7. When the green flag is clicked, erase all drawings, move the pencil back to the middle of the stage facing right and reset the pen size/color.\n\nChallenge: Trace shapes on other backdrops.\n\n',
					projectLink: "https://scratch.mit.edu/projects/287738652/",
					solutionLink: "https://scratch.mit.edu/projects/285312799/"
				},
				{
					title: "Project 3 – Beetle Artist",
					content:
						'\n1. Use the arrow keys to move the beetle 10 steps.\n2. When the green flag is clicked, erase all drawings.\n3. Press "1" to draw a square.\n4. Press "2" to draw a triangle.\n5. Press "3" to draw an arrow shape.\nChallenge: Trace shapes on other backdrops.\n',
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
					content:
						'\n1. When the "1" key is pressed, grow the elephant ten times (increase size by 10, ten times).\n2. When the "2" key is pressed, shrink the elephant ten times.\n3. When the "3" key is pressed, change the elephant\'s color effect forever.\n4. When the "4" key is pressed, change a different graphic effect forever.\n5. When the "5" key is pressed, hide the elephant, wait one second, then show it again (repeat this sequence).\n6. When the space bar is pressed, switch the costume, play a sound and then switch back to the original costume, repeating the whole sequence three times.\n',
					projectLink: "https://scratch.mit.edu/projects/291122885/",
					solutionLink: "https://scratch.mit.edu/projects/291119943/"
				},
				{
					title: "Project 2 – Hot Cross Buns",
					content:
						'\nThis project uses the Music extension. When the green flag is clicked, play the song "Hot Cross Buns" twice:\n\nE D C E D C C C C C D D D D E D C.\n\nUse loops for repeated sections. Compose other songs as an extension.\n',
					projectLink: "https://scratch.mit.edu/projects/291117784/",
					solutionLink: "https://scratch.mit.edu/projects/291115434/"
				},
				{
					title: "Project 3 – Drawing Mouse",
					content:
						'\n1. Add an event listener so that when the green flag is clicked, all drawings are erased.\n2. When the "1" key is pressed, make the mouse draw a square using a loop at a random location.\n3. When the "2" key is pressed, make the mouse draw a triangle.\n4. When the "3" key is pressed, make the mouse draw a circle (explain that a circle can be drawn by repeating many small steps that turn in small increments to total 360 degrees).\nChallenge: Create other shapes, like an octagon or a star, possibly adding random sizes and colors.\n',
					projectLink: "https://scratch.mit.edu/projects/289744824/",
					solutionLink: "https://scratch.mit.edu/projects/289445069/"
				}
			],
			supplementalProjects: [
				{
					title: "GS4 Supplemental Project 1 – Shapify",
					content:
						"\n1. Use Pen blocks to draw a hexagon. (Hint: divide 360 degrees by the number of sides.)\n2. Use the same method to draw an octagon, a decagon, a dodecagon and a circle.\n3. Predict what happens if the loop around the circle is replaced with a forever loop, and then try it.\nChallenge: Draw a different circle using different numbers.",
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
					content:
						'\n1. Make the dinosaur follow the mouse pointer forever.\n2. Use conditionals to make the dinosaur say "I\'m in red!" when standing in red; similarly, add conditions for yellow, blue and grey.\n',
					projectLink: "https://scratch.mit.edu/projects/291223299/",
					solutionLink: "https://scratch.mit.edu/projects/291220849/"
				},
				{
					title: "Project 2 – Noisy Reactions",
					content:
						'\n1. When the green flag is clicked, make the ball bounce around the screen forever.\n2. Use a conditional so that when the bell touches the ball, the bell swings back and forth and rings four times.\n3. When the ball touches lightning, make the lightning strike the ground and play a thunder sound, then return the lightning to the cloud. (Introduce the "go to [sprite]" block.)\n4. When the chick touches the ball, make the chick move 5 steps and chirp.\n',
					projectLink: "https://scratch.mit.edu/projects/291542721/",
					solutionLink: "https://scratch.mit.edu/projects/291530292/"
				},
				{
					title: "Project 3 – Magic Wand",
					content:
						"\n1. Make a magic wand move to the frog and turn it into a wizard.\n2. Make the wand move to the piano and play three notes (any instrument/notes are fine).\n3. Make the wand move to the ghost and send the ghost toward the star.\n4. When the ghost touches the star, make the star grow to fill the screen.\n",
					projectLink: "https://scratch.mit.edu/projects/304279087/",
					solutionLink: "https://scratch.mit.edu/projects/304279316/"
				}
			],
			supplementalProjects: [
				{
					title: "GS5 Supplemental Project 1 – Camouflaging Octopus",
					content:
						"\n1. Use event listeners to control the octopus with the arrow keys.\n2. Use conditionals so the octopus turns blue when on a blue background.\n3. Add conditionals for yellow, green and red backgrounds.",
					projectLink: "https://scratch.mit.edu/projects/326209430/",
					solutionLink: "https://scratch.mit.edu/projects/326209241/"
				},
				{
					title: "GS5 Supplemental Project 2 – Playing Catch",
					content:
						"\n1. When the green flag is clicked, make the basketball go to Gobo and move forever.\n2. When Pico has the ball, use conditionals to pass it back to Gobo.\n3. When Gobo has the ball, pass it to Pico.\nChallenge: Add more sprites to the game and have the ball pass between them.",
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
					content:
						'\n1. Create controls for the dinosaur using the arrow keys.\n2. When the "b" key is pressed, have the dinosaur say "Move me to blue!" for 2 seconds.\n3. After speaking, use an if/then/else to check if the dinosaur is touching blue; if it is, say "Good job!", otherwise say "This isn\'t the right color!".\n4. Repeat the previous step for the "r" (red) and "y" (yellow) keys.\n5. Add sounds and costume changes for each color.\n\n',
					projectLink: "https://scratch.mit.edu/projects/293788691/",
					solutionLink: "https://scratch.mit.edu/projects/293787944/"
				},
				{
					title: "Project 2 – Hungry Dinosaur",
					content:
						'\n1. When the green flag is clicked, use if/then blocks to control the dinosaur with the arrow keys.\n2. When the space bar is pressed, the dinosaur attempts to eat bananas: if it is touching bananas, change the dinosaur\'s costume, play a sound or otherwise show the bananas being eaten; if not touching bananas, say "There aren\'t any bananas here!".\n3. When the space bar is pressed, if the bananas are touching the dinosaur, wait one second then move the bananas to a random location; otherwise have the bananas say "I\'m over here!".\n',
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
					content:
						"\n1. When the green flag is clicked, start the rocketship at the center bottom of the stage.\n2. If the user clicks the mouse, make the rocketship move up 5 steps; otherwise, it goes down 5 steps (always pointing upward).\n3. When the rocketship reaches the star, make it blast off using sounds, motion or visual effects.",
					projectLink: "https://scratch.mit.edu/projects/332463981/",
					solutionLink: "https://scratch.mit.edu/projects/332459692/"
				},
				{
					title: "GS6 Supplemental Project 2 – Baby Fish",
					content:
						'\n1. When the green flag is clicked, make the baby fish continuously go to the mouse pointer.\n2. If the baby fish is touching the mom fish, make it say "I found her"; otherwise say "Take me to my mom".\n3. Make the mom fish glide around the screen randomly.',
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
					content:
						'\n1. When the "1" key is pressed, have Gobo ask a math question (e.g., "What\'s 9 – 7?"). Indicate whether the answer is correct or incorrect via costume, sound or speech.\n2. When the "2" key is pressed, have Gobo ask a question like "What\'s a number less than 0?" and indicate whether the answer is correct or incorrect.\n3. When the "3" key is pressed, have Gobo ask a harder math question and allow the user to keep answering until the answer is correct. If the answer is too low, Gobo should say "Higher!"; if too high, say "Lower!".',
					projectLink: "https://scratch.mit.edu/projects/295332936/",
					solutionLink: "https://scratch.mit.edu/projects/294539961/"
				},
				{
					title: "Project 2 – Fortune Teller",
					content:
						'\n1. When the green flag is clicked, play an introduction and ask the user their name.\n2. Ask the user "What do you want to know? (Type Love, Money, or Friendship)".\n3. Use conditionals to give a fortune based on the user\'s input.\n4. Ask another question such as "Choose a number between 1 and 5" and use conditionals to provide a response.\nChallenge: Add more fortunes and questions to make the fortune teller more detailed.',
					projectLink: "https://scratch.mit.edu/projects/297744913/",
					solutionLink: "https://scratch.mit.edu/projects/297735619/"
				},
				{
					title: "Project 3 – Number Guesser",
					content:
						"\n1. When the green flag is clicked, have the sprite choose a random number between 1 and 20.\n2. Ask the user to guess the number.\n3. Use if/then/else blocks to tell the user if their guess is too high or too low.\n4. Allow the user to keep guessing until they get the number right.\nChallenge: Add a counter for the number of guesses and congratulate the player if they guess the number in fewer than 5 tries.",
					projectLink: "https://scratch.mit.edu/projects/295334181/",
					solutionLink: "https://scratch.mit.edu/projects/294561252/"
				}
			],
			supplementalProjects: [
				{
					title: "GS7 Supplemental Project 1 – Animal Crossing",
					content:
						"\n1. Ask the user if they want to build a shop, plant a tree or explore the island.\n2. Use the answer to determine which event occurs.\n3. Ask the user yes/no questions to further customize the experience.\n4. Use variables to store items collected or tasks completed.\n5. Encourage the user to explore and discover secrets.",
					projectLink: "https://scratch.mit.edu/projects/328309551/",
					solutionLink: "https://scratch.mit.edu/projects/328310531/"
				},
				{
					title: "GS7 Supplemental Project 2 – Space Cadets",
					content:
						'\n1. Ask the user for their name and call them "Captain".\n2. Ask which planet (Mars, Jupiter or Saturn) they want to explore.\n3. Use conditionals to set the scene for the chosen planet.\n4. Ask additional questions (e.g., "Do you want to collect rocks or search for life?") and branch the story based on the answers.\n5. Use variables to track discoveries or points.',
					projectLink: "https://scratch.mit.edu/projects/328310783/",
					solutionLink: "https://scratch.mit.edu/projects/328308418/"
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
					title: "Guided warm-up – Coordinate Catcher",
					learningPath: "core",
					content: `**Project goal:** Move a frog to typed X and Y coordinates, then make a collectible react when the frog catches it.

Before building, select **Play solution** on Project 1 – Bug Eater below. Notice how movement and touching a collectible create immediate feedback.

**Build a working slice:**
1. Add a frog and a collectible such as a crab, bug, or fruit.
2. Under **when green flag clicked**, send the frog to X 0, Y 0 and make it say, “Press X or Y to move.”
3. Under **when X key pressed**, use **ask and wait** to request an X position, then **set x to answer**. Repeat the control message after moving.
4. Under **when Y key pressed**, ask for a Y position, then **set y to answer**. Repeat the control message again.
5. Select the collectible. Under its green-flag event, place a **touching frog?** check inside **if** and **forever** blocks.
6. When the collectible touches the frog, play one of the collectible's sounds and send it to a random position.
7. Test at least three coordinate pairs and catch the collectible once.

**Set and change are different:** **set x to 5** moves directly to X 5. **change x by 5** adds 5 to the current X position.

**Block finder:** **ask and wait** and **answer** are light-blue Sensing blocks. **say** is a purple Looks block. **if** and **forever** are orange Control blocks.

**Sound check:** Scratch sounds belong to the selected sprite. Select the collectible before adding or choosing its catch sound.

**Success paths:** Coordinate movement is the core result. The collectible and sound are the next choice. A score, timer, or another event is an optional challenge.`
				},
				{
					title: "Project 1 – Bug Eater",
					content:
						"\n1. When the green flag is clicked, make the praying mantis appear at a random position.\n2. When the mouse is clicked, make the mantis glide to the mouse pointer's X and Y position.\n3. If the mantis touches a bug, broadcast a message to make the bug disappear and increase the score.\n4. Use variables for the score and a timer.\n5. End the game when the timer runs out and display the score.",
					projectLink: "https://scratch.mit.edu/projects/297831461/",
					solutionLink: "https://scratch.mit.edu/projects/297828061/"
				},
				{
					title: "Bug Eater: Classroom walkthrough",
					learningPath: "core",
					content: `**Project goal:** Move a frog to typed X and Y coordinates and make a collectible react when the frog catches it.

**Build steps:**
1. Under **when green flag clicked**, add a **forever** loop for the frog's coordinate questions.
2. Ask, “What X should I go to?” and use **set x to answer**.
3. Ask, “What Y should I go to?” and use **set y to answer**.
4. Add a ladybug, bug, fruit, or other collectible sprite.
5. Select the collectible, open its Sounds tab, and add or choose a sound such as Chomp.
6. Under the collectible's green-flag event, repeatedly check **if touching Frog?**.
7. When the collectible touches the frog, send it to a random position and play the sound selected for that sprite.

**Completion check:** The frog repeatedly accepts X and Y positions, moves to the typed coordinates, and triggers the collectible's movement and sound when the two sprites touch.`
				},
				{
					title: "Project 2 – Cake Chaser",
					content:
						"\n1. Set up two sprites: a person and a slice of cake.\n2. Use the arrow keys to move the person around the stage.\n3. Make the cake appear at random X and Y coordinates.\n4. When the person touches the cake, play a sound, move the cake to a new random location and increase the score.\n5. Add a timer that counts down and ends the game when it reaches zero.",
					projectLink: "https://scratch.mit.edu/projects/299085513/",
					solutionLink: "https://scratch.mit.edu/projects/297843021/"
				},
				{
					title: "Project 3 – Talent Show",
					content:
						"\n1. Choose three performers (sprites).\n2. When the green flag is clicked, have each performer go to their starting position using X and Y coordinates.\n3. Use broadcast messages to make each performer do an act in sequence (dance, jump or play an instrument).\n4. After the performances, have all performers bow together.",
					projectLink: "https://scratch.mit.edu/projects/295339505/",
					solutionLink: "https://scratch.mit.edu/projects/295340057/"
				}
			],
			supplementalProjects: [
				{
					title: "GS8 Supplemental Project 1 – Quadrant Practice",
					content:
						'\n1. Use the arrow keys to move a sprite to each quadrant of the stage.\n2. When the sprite reaches a quadrant, display a message such as "I\'m in Quadrant I".\n3. Challenge: Add shapes or obstacles that must be avoided.',
					projectLink: "https://scratch.mit.edu/projects/329289426/",
					solutionLink: "https://scratch.mit.edu/projects/329283944/"
				},
				{
					title: "GS8 Supplemental Project 2 – Coordinate Drawings",
					content:
						"\n1. Using the Pen extension, draw a picture by moving the sprite to various X and Y coordinates.\n2. Allow the user to enter coordinates to draw their own shapes.\n3. Encourage drawing initials or simple pictures.",
					projectLink: "https://scratch.mit.edu/projects/329294838/",
					solutionLink: "https://scratch.mit.edu/projects/329290359/"
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
					content:
						"\n1. When the green flag is clicked, create a timer variable and set it to 20.\n2. Make a target sprite (e.g., a button) appear in random positions.\n3. Each time the target is clicked, increase a score variable by 1.\n4. Decrease the timer by 1 every second; when the timer reaches zero, stop the game and display the final score.\n5. Consider adding a high-score variable.",
					projectLink: "https://scratch.mit.edu/projects/299327014/",
					solutionLink: "https://scratch.mit.edu/projects/299311602/"
				},
				{
					title: "Project 2 – Spider Smash",
					content:
						"\n1. When the green flag is clicked, have spiders appear at random positions and move downward.\n2. When a spider is clicked, hide it, play a sound and increase the score.\n3. Create a timer that counts down; end the game when it reaches zero.\n4. Optionally increase difficulty by speeding up the spiders over time.",
					projectLink: "https://scratch.mit.edu/projects/299272518/",
					solutionLink: "https://scratch.mit.edu/projects/299094220/"
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
					content:
						'\n1. Use the arrow keys to move a sprite around the stage.\n2. Make a variable called "steps" that increases each time the sprite moves.\n3. Display the number of steps taken.\n4. Challenge: Add obstacles and a goal to reach.',
					projectLink: "https://scratch.mit.edu/projects/327635693/",
					solutionLink: "https://scratch.mit.edu/projects/327634746/"
				},
				{
					title: "GS9 Supplemental Project 2 – Hungry Crab",
					content:
						'\n1. Control a crab with the arrow keys.\n2. Create a variable called "food" and increase it each time the crab eats a piece of food.\n3. Add a timer; when time runs out, end the game and display how much food was collected.',
					projectLink: "https://scratch.mit.edu/projects/327610777/",
					solutionLink: "https://scratch.mit.edu/projects/327610727/"
				},
				{
					title: "GS9 Supplemental Project 3 – Lunch Money",
					content:
						'\n1. Start with a variable "money" set to 10.\n2. Ask the user what they want to buy for lunch (e.g., pizza, sandwich or salad) and subtract the cost from the money variable.\n3. If the user can\'t afford an item, display a message.\n4. Allow them to continue buying until the money runs out.',
					projectLink: "https://scratch.mit.edu/projects/327607937/",
					solutionLink: "https://scratch.mit.edu/projects/327607840/"
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
					content:
						"\nIt's dancing time! Let's give each sprite a turn to \"perform\" on the stage.\n\n1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she's done, have her glide off to the right side of the stage.\n2. One by one, make each of the other dancers do the same thing. Can you add some clapping between each performer? We also need to be sure to make them start back on the left when the green flag is clicked!\n3. A dance party isn't very fun without music! Add some code to the backdrop so that it plays dancing music forever. When Champ is done dancing, broadcast a message that stops the music.\n4. Can you make it so that the lights change, too? How about some clapping once everyone is done?\n\n",
					projectLink: "https://scratch.mit.edu/projects/301002220/",
					solutionLink: "https://scratch.mit.edu/projects/300644693/"
				},
				{
					title: "GS10 Project 2 – Bowl Fill",
					content:
						'\nLet\'s make a game where you control a bowl and try to collect various items!\n\n1. Start by programming the bowl so that it can be controlled by the arrow keys once the green flag is clicked.\n2. When a sprite is touched by the bowl, make it broadcast a message (like "Cheese touched", for example).\n3. Think about what each sprite should do when it receives these messages. Should they move? Make a sound? What should the bowl do?\n4. Add variables to your program that keep track of the number of times each object has been collected.\n5. Add a timer that stops the game after 15 seconds. When the timer runs out, broadcast a message that makes all sprites on the screen do something (e.g., spin in a circle, grow and shrink, etc.).\n\nFinally, share the project!',
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
					content:
						"\n\nDesign your own play, and use the broadcast blocks to set up the scene changes and dialogue between characters!\n\n1. Come up with a story that involves 3-4 characters and scenes. You can use movies or your real life as inspiration!\n2. Add the sprites and backdrops you will need to your project.\n3. Make your story come to life! Broadcast messages between your sprites to make sure everything happens in the correct sequence.",
					projectLink: "https://scratch.mit.edu/projects/330301165/",
					solutionLink: "https://scratch.mit.edu/projects/328309254/"
				},
				{
					title: "GS10 Supplemental Project 2 – Cartoon Crash",
					content:
						"\nPick a partner for Dani to play with, and they will bounce around the screen together!\n\n1. When the green flag is clicked, set up the Start button in the correct position and have Dani explain the instructions.\n2. When the Start button is clicked, set up the sprites in the correct positions.\n3. Program each sprite so that if it is chosen (i.e., clicked on), it bounces around the room with Dani! If it is not chosen, it should also react appropriately.",
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
					content:
						"\nLet's put our skills to the test! Let's use what we've learned in the course to build this Hedgehog Race game.\n\nPlay through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\n\nCreate a comment in the project to write out the different steps of what we will need to code.\n\nStarter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.\n\nFinally, share the project!",
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
					content:
						"\nPlay through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\n\nCreate a comment in the project to write out the different steps of what we will need to code.\n\nThe wizard has been turned into a frog! Help him collect potions while avoiding skeletons to turn back into a wizard.\n\n1. Let's start by working on our frog wizard! Make it so when the green flag is clicked, he goes to the center of the screen, changes his size and moves when the arrow keys are pressed.\n2. Next, let's make the skeleton move! We want the skeleton to go to a random position on the far right side of the screen and constantly move left. When it is touching the frog or the left edge, make it go back to the right side.\n3. Now do the same thing to the potion. If you want to make the game more challenging, make the potion wait a few seconds before appearing on the right again. (Hint: you'll need to use show/hide blocks).\n4. Our frog needs to be able to level up and down in order to win or lose the game. Start by making a variable to keep track of the level and set it to 1 when the green flag is clicked.\n5. Make message broadcasts for leveling up and down. When they level up, if they are at level 4, they win the game. Otherwise, increase their level by 1, switch the costume and increase the size. When they level down, if they are at level 1, they lose the game. Otherwise, decrease their level by 1, switch the costume and decrease the size.\n6. Make sure to broadcast the level-up/level-down messages when the skeletons or potion touch the frog.\n7. Feel free to add another skeleton to make the game more difficult.\n8. Add sound effects and backdrop changes for the finishing touches!",
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
					content:
						"\nPlay through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\n\nCreate a comment in the project to write out the different steps of what we will need to code.\n\nStarter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.\n\nFinally, share the project!",
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
					content:
						"For your Master Project, you now have the skills and knowledge to design and build a game of your own! Spend some time brainstorming what kind of game to make, thinking about the past projects created and different elements to incorporate.\n\nOnce there is an idea, discuss the plan for programming the game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?"
				},
				{
					title: "Master Project Presentation",
					content:
						"Once it's complete, prepare a simple presentation about how the project was programmed and share the accomplishment with friends or family.\n\nAnother way to celebrate the project is by sharing it with friends or family."
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
