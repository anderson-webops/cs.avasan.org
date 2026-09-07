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
					content:
						'1. When the green flag is clicked, make the dragonfly go to a random spot on the stage.\n2. When the arrow keys are pressed, make the dragonfly move 20 steps in that direction.\n3. When the dragonfly is clicked, make it change its color.\n4. When the space bar is pressed, make the dragonfly make a popping sound.\n5. When 1 is pressed, make the dragonfly "pop" and then go to a random position.\n6. When 2 is pressed, make the dragonfly say something ("Buzzzz", for example).\n7. When 3 is pressed, make the background change.\nChallenge: can you add another sprite that is moves around using the WASD keys?\nView CS Training\'s Code',
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
					content:
						"1. Add an event listener so that when the flag is clicked, everything gets erased.\n2. Add an event listener so that when the 1 key is pressed, the mouse draws a square (using a loop) in a random location.\n3. Add a similar set of blocks so that the mouse draws a triangle.\n4. Add a similar set of blocks so that the mouse draws a circle.\n5. What other shapes can you create? Make some other sets of blocks that draw other shapes (e.g. an octagon, a star, etc.).\nView CS Training's Code",
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
					content:
						'1. When 1 is pressed, have Gobo ask a question like "What\'s 9-7?" Based on how the user answers, Gobo should change his costume, make a sound, and/or say something to indicate a correct or incorrect answer.\n2. When is 2 is pressed, have Gobo ask a question like "What\'s a number less than 0?" Based on how the user answers, Gobo should change his costume, make a sound, and/or say something to indicate a correct or incorrect answer.\n3. When 3 is pressed, have Gobo ask a harder math question that allows the user to keep answering until the answer is correct. Gobo should indicate each time whether the answer was correct or incorrect.\nView CS Training\'s Code',
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
					content:
						'Let\'s make a game: you get 10 seconds to click on the button as many times as you can. When the time is up, you can\'t click on the button anymore!\n1. Make a variable to keep track of the number of clicks.\n2. Use an event listener so that when the sprite is clicked, the variable goes up by one. Make the button switch to the pressed costume and make a sound, too!\n3. Make a variable that keeps track of time.\n4. When the green flag is clicked, make the timer start from 10 and count down to 0.\n5. Before the timer starts, make the button say "Ready...", "Set...", and "Go!" for one second each.\n6. When time runs out, make the button hide. Remember, if we make it hide when the game is over, that means that we need to show it when the game starts.\nView CS Training\'s Code',
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
					content:
						"It's dancing time! Let's give each sprite a turn to \"perform\" on the stage.\n1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she's done, have her glide off to the right side of the stage.\n2. One by one, make each of the other dancers do the same thing. Can you add some clapping between each performer? We also need to be sure to make them start back on the left when the green flag is clicked!\n3. A dance party isn't very fun without music! Add some code to the backdrop so that it plays some dancing music forever. When Champ is done dancing, broadcast a message that stops the music.\n4. Can you make it so that the lights change, too? How about some clapping once everyone is done?\nView CS Training's Code",
					projectLink: "https://scratch.mit.edu/projects/301002220/",
					solutionLink: "https://scratch.mit.edu/projects/300644693/"
				},
				{
					title: "GM1 Project 6: Hedgehog Race",
					content:
						"Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\nCreate a comment in the project to write out the different steps of what we will need to code.\nStarter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.\nView CS Training's Code",
					projectLink: "https://scratch.mit.edu/projects/304551665/",
					solutionLink: "https://scratch.mit.edu/projects/305082197/"
				},
				{
					title: "GM1 Project 7: Asteroid Dodge",
					content:
						"Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\nCreate a comment in the project to write out the different steps of what we will need to code.\nStarter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.",
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
						"1. Observe carefully the order in which the cat is drawing this pattern! First, program the cat to draw the first small square in the bottom right quadrant. (Make sure the canvas is erased and the cat's pen is down before he starts drawing.)\n2. Next, program the cat to draw the medium square, and then the large square.\n3. After the cat has drawn these three squares in the bottom right quadrant, have him turn 90 degrees and change his pen color by 25.\n4. Using nested loops, program the cat to draw the squares in the other three quadrants as well.\n5. Try to use a variable that stores the side length of the square to simplify your code even further.\nFinally, share the project!\nView CS Training's Code",
					projectLink: "https://scratch.mit.edu/projects/306391834/",
					solutionLink: "https://scratch.mit.edu/projects/306394145/"
				},
				{
					title: "GM2 Project 2: Pyramid",
					content:
						"1. Observe carefully the order in which the cat is drawing this pattern! First, program the cat to draw the first tiny triangle. (Make sure before he starts drawing, he starts at (0,120), pointing in direction 150 degrees, with his pen down.)\n2. Next, program the cat to draw a slightly larger triangle, and then an even slightly larger triangle.\n3. Using nested loops and a variable, draw 15 total triangles to make the pyramid!\nFinally, share the project!",
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
					content:
						"1. Start by setting the pitcher's costume to the first one, make him say “Batter up!”, and then cycle through all of his costumes. Send a message broadcast when he's done pitching and wait for the batter.\n2. When the batter receives the message, make her cycle through all of her costumes.\n3. How many strikes until the batter's out? Repeat your code this many times.",
					projectLink: "https://scratch.mit.edu/projects/334075920",
					solutionLink: "https://scratch.mit.edu/projects/334073245/"
				},
				{
					title: "GM2 Supplemental Project 2: Grid",
					content:
						"Let's draw a grid!\n1. Start by thinking about how we could draw one row of squares. What would we need to change after drawing each square? How many loops would we need?\n2. Make the pencil start at (-200, 150) and draw 8 squares with a side length of 50 from left to right across the screen.\n3. How might we make several rows of squares? What would we repeat? What would need to change?\n4. Make the pencil draw 6 rows of squares from the top to the bottom of the screen.",
					projectLink: "https://scratch.mit.edu/projects/334073152/",
					solutionLink: "https://scratch.mit.edu/projects/334067890/"
				},
				{
					title: "GM2 Supplemental Project 3: Rainbow Flower",
					content:
						"Draw a beautiful rainbow flower!\n1. When the green flag is clicked, make the pencil sprite go to the center of the screen and put the pen down.\n2. Start by programming the code for a circle and then take a look at the turn block. What would happen if we changed the amount we were turning? What would happen if we changed the amount we turned each time we turned? Try to make a variable that keeps track of the angle we turn and increase it by 1 each time we go through the loop.\n3. After you're done experimenting in step 2, set up the code so that the angle starts at 0 degrees and repeat 40 times to get a really pretty looking spiral!\n4. Now that we have one petal of our flower, can you make the other six? Think about how we have to start from the center of the flower and move outwards each time.\n5. Change the pen color after each petal to get a rainbow colored flower!",
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
						'1. Program controls for the cat so that he moves around on the screen when you press the arrow keys.\n2. Using conditionals, program the cat to say "I\'m touching red and blue" if he is touching red and blue.\n3. Add similar conditionals for if he is touching red and yellow, and blue and yellow.\n4. If the cat is touching all three colors, make him say "I\'m touching all 3 colors!"\n5. If the cat is touching no colors, make him say "I\'m touching no colors!"\n6. If the cat is touching any one of the colors, make him say "I\'m touching a color!"\nFinally, share the project!\nView CS Training\'s Code',
					projectLink: "https://scratch.mit.edu/projects/306694840/",
					solutionLink: "https://scratch.mit.edu/projects/306689852/"
				},
				{
					title: "GM3 Project 2: Strength Tester",
					content:
						'1. When the green flag is clicked, make the button say "Click me to see how strong you are!"\n2. When the button is clicked, make it broadcast the message "How strong"\n3. When the arrow receives this message, make it go to (-130, -160), pick a random number between 0 and 300, and move up by this amount.\n4. Based on the random number, make the button say one of at least five different messages, like "You\'re the strongest person ever!" or "It looks like you need to go to the gym!"\nFinally, share the project!',
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
					content:
						"Use the arrow keys to help the baby chick find its parents!\n1. Program the chick so that you can move it up/down/left/right with the arrow keys.\n2. When the green flag is clicked, make the rooster point to the right and then move him back and forth across the screen forever. (Hint: Make him turn 180 degrees randomly as he's walking!)\n3. Repeat step 2 for the hen.\n4. Now, we're going to program the chick to know when it is with its parents! If it's touching both of its parents, make it say “I love my parents!”, if it's just touching its mom, make it say “Hi, Mom!”, if it's just touching its dad, make it say “Hi, Dad!”, and if it's not touching either, make it say “Where are my parents?”",
					projectLink: "https://scratch.mit.edu/projects/335794156/",
					solutionLink: "https://scratch.mit.edu/projects/335790153/"
				},
				{
					title: "GM3 Supplemental Project 2: Save the Butterfly",
					content:
						"Use the left and right arrow keys to help the butterfly escape the hungry frog!\n1. When the green flag is pressed, make the butterfly go to (-60, 0) and the frog go to (-170, 0).\n2. Next, the frog should say “I'm hungry”, “Ooh, a butterfly!”, and “I'm coming to get you!” for two seconds each.\n3. After the frog broadcasts, it should start moving a random number of steps from 0 to 3 for the rest of the game. To make the game harder, you can increase the number of steps!\n4. Let's help the butterfly escape! When it receives that the game has started, use the “wait until” block to make it move forward 5 steps when the user alternates between clicking the left and right key.\n5. You might be able to cheat and hold down both keys, so think about how you could use complex conditionals to fix this!\n6. If the butterfly is touching the frog, make it stop the other scripts, broadcast that you lost the game, and then hide (that means we need to show it at the beginning).\n7. If the butterfly touches the dark purple tree on the other side of the screen, make it broadcast that you won the game and glide off the screen.\n8. When the frog receives these win and lose broadcasts, make it stop the other scripts and respond accordingly to its meal!",
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
						"1. Start by making the parent pencil create clones of itself continuously.\n2. When a clone is created, make it go to a random location, choose a random size and color, and then glide to another random location. Be sure to use the pen block that sets a color using a number, not the block that takes a color as an input. If the wrong block is used, only shades of blue will appear.\nChallenge: Make the brush strokes look more realistic with slightly varying angles, colors, and widths.\nFinally, share the project!\nView CS Training's Code",
					projectLink: "https://scratch.mit.edu/projects/307580100/",
					solutionLink: "https://scratch.mit.edu/projects/307575111/"
				},
				{
					title: "GM4 Project 2: Rainy Day",
					content:
						"1. Program the umbrella so that it can be moved with the left and right arrow keys.\n2. Program the chick to continuously move forward in little steps and bounce if it hits a wall. Also make the chick switch directions randomly, once every few steps.\n3. Program the rain drop to create clones of itself continuously.\n4. When a clone is created, it should fall from the sky. Think about what should happen when it touches the chick and when the clone should be deleted, and add these scenarios into your code.\n5. Keep track of the number of times the chick got wet, and give the player 60 seconds to protect the chick as much as possible!\nFinally, share the project!",
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
						"1. Set up the parrot to move around with the up/down/left/right arrow keys.\n2. Set up the fruit so that a clone is created every second. Each clone should be a random piece of fruit, and it should show up in a random location!\n3. Keep track of the total amount of fruit the parrot collects, and end the game and display the fruit platter once the parrot collects 10 pieces.",
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
						"Use a variable to make the owl count from 1 to 50.\nAdd a conditional so that if the spacebar or the up arrow is pressed, the owl says something instead of the number.\nAdd a conditional so that if the mouse pointer is on the owl, it gets shy and doesn't say anything at all!",
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
					content:
						'The robot is protecting the city! Make his ask three questions (using the string blocks) to help him keep out intruders.\n1. Program the robot to ask for the user\'s name, and make him reply, "Nice to meet you, _____"\n2. Program the robot to ask for a word that starts with "q" and tell the user if they answered correctly.\n3. Program the robot to ask for a 7-letter word and tell the user if they answered correctly.\n4. Program the robot to ask for a word that ends in "y" and tell the user if they answered correctly.\nChallenge: Program the robot to ask for a 6-letter word that starts with "a" and tell the user if they answered correctly.\nFinally, share the project!\nView CS Training\'s Code',
					projectLink: "https://scratch.mit.edu/projects/308722400/",
					solutionLink: "https://scratch.mit.edu/projects/308717171/"
				},
				{
					title: "GM5 Project 2: Spelling Bee",
					content:
						"1. When 1 is pressed, ask the user for a word and spell out the word letter by letter. e.x. C-O-D-I-N-G\n2. When 2 is pressed, ask the user for a word and spell out all but the first letter. e.x. O-D-I-N-G\n3. When 3 is pressed, ask the user for a word and spell out all but the last letter. e.x. C-O-D-I-N\n4. When 4 is pressed, ask the user for a word and spell out all but the first and last letters. e.x. O-D-I-N\n5. When 5 is pressed, ask the user for a word and spell out every other letter. e.x. C-D-N\n6. When 6 is pressed, ask the user for a word and spell out the word backward. e.x. G-N-I-D-O-C\nFinally, share the project!",
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
					content:
						'Create your own fictional crazy country, with its own leader and activity its citizens are known for!\n1. Ask the user for the name of the country and save it.\n2. Similarly, ask and save the leader of the country and the primary activity the country is known for.\n3. Report this information back to the user using the "say" and "join" blocks.\nChallenge: Try to accomplish step 3 using one "say" block with many "join" blocks.',
					projectLink: "https://scratch.mit.edu/projects/338824789",
					solutionLink: "https://scratch.mit.edu/projects/338828947/"
				},
				{
					title: "GM5 Supplemental Project 2: Beary Spelly",
					content:
						'Build a spelling test for yourself to practice your spelling!\n1. The starter code already has a secret word picked out and saved in the Secret Word variable for you.\n2. Add the Text to Speech extension and speak the secret word to the user.\n3. Ask the user to enter each letter of the word one by one. If the letter is correct, speak "Correct!" Otherwise end the game. (Hint: think about how to repeat through the word letter by letter.)\n4. If the user has spelled the entire word correctly, speak "You spelled [secret word] correctly! Great work!"',
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
						'1. Ask the user for the first number, the second number, and the operation (+, -, *, or /). Store each of them in variables.\n2. Using conditionals, depending on what the user entered, have the calculator say the answer!\nChallenge: Add "remainder" as an operation option. For example, the remainder when 10 is divided by 3 is 1.\nChallenge #2: Add exponent (^) as operation option. For example, 2^3 = 8.\nFinally, share the project!\nView CS Training\'s Code',
					projectLink: "https://scratch.mit.edu/projects/357453092/",
					solutionLink: "https://scratch.mit.edu/projects/357453067/"
				},
				{
					title: "GM6 Project 2: FizzBuzz",
					content:
						"1. Program the butterfly to count from 1 to 50.\n2. If the number is a multiple of 3, instead of saying the number, make the butterfly say Fizz!\n3. If the number is a multiple of 5, instead of saying the number, make the butterfly say Buzz!\n4. If the number is a multiple of 3 and 5, instead of saying the number (or any other word), make the butterfly say Fizzbuzz!\nThe first few numbers in the sequence are: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz...\nFinally, share the project!\nView CS Training's Code",
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
					content:
						"Let's test how well Scratch knows his times tables!\n1. Start by asking the user which number they want to know the multiples of.\n2. Create a variable to keep track of what we will be multiplying by and set it to 1.\n3. Say the product of the user's answer and our variable, and then increase our variable by 1. Repeat this to get Scratch to say the first ten multiples!\nChallenge: Have Scratch also ask the user how many multiples the user wants to hear, and update your code accordingly.",
					projectLink: "https://scratch.mit.edu/projects/338508588/",
					solutionLink: "https://scratch.mit.edu/projects/338505545/"
				},
				{
					title: "GM6 Supplemental Project 2: Stamping with Dotty",
					content:
						"Help Dotty graph the absolute value function!\n1. When the green flag is clicked, make Dotty go to the center of the screen and ask what x coordinate she should go to.\n2. First, change her x-coordinate to the user's answer, then change her y-coordinate to the absolute value of the answer (hint: this is a mathematical operator).\n3. Make her say what her new coordinates are and then leave a stamp with the pen tool.\n4. Repeat this code 10 times so that we graph 10 points of the function.\n5. Next, make Dotty go to (-180,180), put the pen down, and then repeatedly increase the x position by 1 and update the y position to be the absolute value of the x position.",
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
					content:
						"Have you ever heard of a “bucket list”? It's a list of things you want to do in life some day! Let's make a program that stores those things in a list, and then repeats it back to us.\n1. When the green flag is clicked, have the cat ask, “Tell me 5 things on your bucket list!”\n2. Program the cat to repeat this five times, adding the user's response to the list each time.\n3. Now that the list is complete, have the cat loop through the list and repeat each bucket list item back to us.\nChallenge: Change the code so that instead of asking for five items, the cat will keep asking for new things to put on the list until the user types “stop.\"\nFinally, share the project!\nView CS Training's Code",
					projectLink: "https://scratch.mit.edu/projects/308826506/",
					solutionLink: "https://scratch.mit.edu/projects/308824008/"
				},
				{
					title: "GM7 Project 2: List Practice",
					content:
						"1. When the spacebar is pressed, make the cat ask, “What number do you want to add to the list?” Add the number the user enters to the list.\n2. When the green flag is clicked, delete everything in the list.\n3. When the 1 key is pressed, program the cat to read the list normally, saying each number in the list for 1 second.\n4. When the 2 key is pressed, program the cat to read each number in the list doubled.\n5. When the 3 key is pressed, program the cat to read the list backwards.\n6. When the 4 key is pressed, program the cat to read each number and then whether the number is odd or even (e.g.: “1, Odd, 14, Even,...”).\nSay every other number in the list\nSay every number in the list, multiplied by 10\nSay each number and then turn that many degrees to the right\nFinally, share the project!\nView CS Training's Code",
					projectLink: "https://scratch.mit.edu/projects/315090026/",
					solutionLink: "https://scratch.mit.edu/projects/315051160/"
				},
				{
					title: "GM7 Project 3: Music Memory",
					content:
						'How good is your memory? The keyboard will play a series of notes, and you have to repeat them back correctly!\n1. Make the keyboard introduce the game and say “Ready... Set... Go!”\n2. Program the keyboard to say and play 3 random notes, adding these notes to a "solution" list.\n3. Ask the user to type in their note guesses, one note at a time, adding these notes to a "guess" list.\n4. If an incorrect note is typed in, game over!\n5. If the user types in all the correct notes, make the game start over with the keyboard playing one more note than last time.\nFinally, share the project!',
					projectLink: "https://scratch.mit.edu/projects/309658040/",
					solutionLink: "https://scratch.mit.edu/projects/309653930/"
				}
			],
			supplementalProjects: [
				{
					title: "GM7 Supplemental Project 1: Multiple Magic",
					content:
						"Build a game for yourself to test how quickly you can calculate multiples of a number!\n1. When the green flag is pressed, create a variable and set it to a random number between 1 and 10. This will be the number we want multiples of.\n2. Make a list to keep track of which multiples the player has entered, and a variable to keep track of their score.\n3. Have the wizard introduce the game and then start asking for multiples of your number continuously.\n4. Check if their answer is a multiple of that number, and also check if this multiple has already been entered. Play a noise, update the score, and update the list accordingly, depending on whether their guess counts toward their score.\n5. It would be more challenging if this game were timed! Create a timer variable and give the user 30 seconds to play the game.",
					projectLink: "https://scratch.mit.edu/projects/337820507",
					solutionLink: "https://scratch.mit.edu/projects/337817856"
				},
				{
					title: "GM7 Supplemental Project 2: Wheel of Fortune",
					content:
						"Welcome to the Wheel of Fortune! In this game, the user has a certain number of guesses to guess every letter of the secret word.\n1. Construct a word bank using a list, from which the computer will choose a random word of at the beginning of each game.\n2. Once the secret word is decided, add all the letters of the word to a new list and count the total number of unique letters in the word. Use this variable to keep track of the total number of letters the user needs to guess correctly. As you are adding the letters, make sure you don't add the same letter twice.\n3. Ask the user to guess a letter. If they guess a letter that is in the secret word (and they have not already guessed this letter), add this letter to the guess list and and update the variable you are using to keep track of how many correct guesses the user has made.\n4. Allow the user a certain number of guesses to win the game (for example, the length of the word, plus 5).\n5. The user wins the game if they have correctly guessed all of the letters in the word, and they lose if they run out of guesses!",
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
					content:
						"1. Create a function that makes the cat speak a given number of times (the input will be the number of times).\n2. Create a function that makes the cat draw a square of a given size (the input will be the side length of the square).\n3. Create a function that makes the cat jump (the input will be the height of the jump).\n4. Create a function that makes the cat teleport by making the cat spin in a circle, go to a random spot with a sound effect, and then spin again (no inputs).\n5. When the green flag is clicked, use these functions to make the cat jump 100 steps, speak 3 times, draw a square of size 100, teleport, and then draw another square.\nFinally, share the project!\nView CS Training's Code",
					projectLink: "https://scratch.mit.edu/projects/315773207",
					solutionLink: "https://scratch.mit.edu/projects/315770711/"
				},
				{
					title: "GM8 Project 2: Talent Show II",
					content:
						"Our talented cat is at it again, ready to perform his many talents! Create functions for each of his talents, so that the user can have some input into his performance.\n1. Create functions for each of the cat's talents, such as playing a song with an inputted number of notes, or spinning in the air an inputted number of times. Create at least four talents of your choosing.\n2. When the green flag is clicked, make the cat start his talent show. He should ask the user which talent to perform, and then he should ask the user for the input that function needs.\nFinally, share the project!\nView CS Training's Code",
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
					content:
						"1. Write a function that draws a shape! It should take in as input the number of sides and the size of each side. To calculate how many degrees to turn after drawing each side, use 360 divided by the number of sides.\n2. Write a function that takes in a starting number and an ending number, and make the function count from a starting number up to (and including) an ending number. (Challenge: If the ending number is smaller than the starting number, make it count down from the starting number.)\n3. Write a function that takes in two numbers and reports the result of addition, subtraction, multiplication, and division with the two numbers. (Challenge: calculate the average of the two numbers as well.)\n4. Write a function that takes in a number and says the first 10 multiples of that number. (Challenge: take in a number of multiples as another input, and say that many multiples of the number.)",
					projectLink: "https://scratch.mit.edu/projects/339918479",
					solutionLink: "https://scratch.mit.edu/projects/339602908"
				},
				{
					title: "GM8 Supplemental Project 2: Rock Paper Scissors",
					content:
						"Let's play rock, paper, scissors!\n1. Take a look at the final project and then look at the code provided for you. All of the pink function blocks are the functions you need to write!\n2. The “get computer answer” function should randomly pick rock, paper, or scissors and store it in a variable. Try using a list to do this!\n3. The “get player answer” function will ask the player for rock, paper, or scissors and store it in a variable. If the user inputs something else, make sure to keep asking until they input either rock, paper, or scissors.\n4. The “find winner” function needs to look at the two different answers and determines the winner. Remember, rock beats scissors, scissors beat paper, and paper beats rock!\n5. You might also find it helpful to write functions for player wins, computer wins, and tie.",
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
					content:
						"Add one of the dancing sprites to the project and create a function that loops through all of their costumes.\nAdd a number input that says how many seconds they should dance for in total. Can you use a division operator in the wait block to make sure they're dancing for the right number of seconds? Hint: Think about how long they should spend on each costume to add up to the right number of seconds.\nWhen the green flag is pressed, make your sprite dance for 3 seconds.\nWhen they're done dancing, ask the user to tell you their favorite dance move by the costume number. Get their top five favorites.\nCreate a function that loops through this list of favorite dance moves.\nMake your sprite dance these moves forever!",
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
						"Play through the demo and identify the different elements of the game to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\nCreate a blank Scratch project and add a comment in the project to write out the different steps of what we will need to code. This is created from a blank project in preparation for the Master Project. Set up custom sprites and backdrops to create Fish Food.\nFinally, share the project!",
					projectLink: "https://scratch.mit.edu/projects/315901981",
					solutionLink: "https://scratch.mit.edu/projects/468227197"
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
					content:
						"Help our pal collect the magic keys and to get through the levels of this platformer!\n1. Take a look at the backdrops for each level and notice how they will all involve different code. Let's make message broadcasts for each level so that we can organize our code a little bit better.\n2. When the green flag is clicked, switch the backdrop to Level 1 and broadcast Level 1.\n3. When Pal receives Level 1, we should tell it where to go on the stage. Now, we need a forever loop that tells Pal to stay on the ground and move with the arrow keys. It might help to separate this code into functions.\n4. To make Pal stay on the ground, we want it to move down if it's not touching green. (Hint: try using a \"repeat until\" block.)\n5. Pal should move left and right using the left and right arrow keys.\n6. If the user presses the up arrow key, make Pal jump. To make Pal jump, increase its y position and let it move left and right. (Challenge: Try to make it so Pal can't jump through platforms.)\n7. Choose where you want the magical key to be placed for Level 1, and tell it to go there when it receives the message broadcast.\n8. When Pal gets to the key, switch to the next backdrop, broadcast the next level, and stop the Level 1 script.\n9. Repeat all of the same steps for Level 2, but this time make sure that when Pal touches the brown pitfall, it falls down and broadcasts to restart the level.\n10. Repeat all of the same steps for Level 3, but this time make sure to tell the teleporters where to go, and make Pal go to teleporter out when it touches teleporter in.\n11. When the user collects the key on Level 3, broadcast the end of the game and switch the backdrop.\n12. Add any sounds or other special effects you want to the game!",
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
						"Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\nCreate a comment in the project to write out the different steps of what we will need to code.\nStarter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.\nFinally, share the project!",
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
						"Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\n\t\t\t\tCreate a comment in the project to write out the different steps of what we will need to code.",
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
						"For your Master Project, you now have the skills and knowledge to design and build a game of your own! Spend some time brainstorming what kind of game to make, thinking about the past projects created and different elements to incorporate. Make sure to include lists and functions in the project.\n\t\t\t\tOnce there is an idea, discuss the plan for programming the game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\n\t\t\t\tCreate a new Scratch project and add a comment to write out the different steps of what we will need to code.\n\t\t\t\tProgram the game as independently as possible! As described above, this may take approximately two classes to complete."
				},
				{
					title: "Master Project Presentation",
					content:
						"Once it's complete, prepare a simple presentation about how the project was programmed and share the accomplishment with friends or family.\n\t\t\t\tAnother way to celebrate the project is by sharing it with friends or family."
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
