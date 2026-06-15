import type { RawCourse } from "./types";
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
						'1. When the green flag is clicked, make the dragonfly go to a random spot on the stage.\n2. When the arrow keys are pressed, make the dragonfly move 20 steps in that direction.\n3. When the dragonfly is clicked, make it change its color.\n4. When the space bar is pressed, make the dragonfly make a popping sound.\n5. When 1 is pressed, make the dragonfly "pop" and then go to a random position.\n6. When 2 is pressed, make the dragonfly say something ("Buzzzz", for example).\n7. When 3 is pressed, make the background change.\nChallenge: can you add another sprite that is moves around using the WASD keys?',
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
						"1. Add an event listener so that when the flag is clicked, everything gets erased.\n2. Add an event listener so that when the 1 key is pressed, the mouse draws a square (using a loop) in a random location.\n3. Add a similar set of blocks so that the mouse draws a triangle.\n4. Add a similar set of blocks so that the mouse draws a circle.\n5. What other shapes can you create? Make some other sets of blocks that draw other shapes (e.g. an octagon, a star, etc.).",
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
						'1. When 1 is pressed, have Gobo ask a question like "What\'s 9-7?" Based on how the user answers, Gobo should change his costume, make a sound, and/or say something to indicate a correct or incorrect answer.\n2. When is 2 is pressed, have Gobo ask a question like "What\'s a number less than 0?" Based on how the user answers, Gobo should change his costume, make a sound, and/or say something to indicate a correct or incorrect answer.\n3. When 3 is pressed, have Gobo ask a harder math question that allows the user to keep answering until the answer is correct. Gobo should indicate each time whether the answer was correct or incorrect.',
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
						'Build a 10-second clicking game: the player clicks the button as many times as possible before time runs out.\n1. Make a variable to keep track of the number of clicks.\n2. Use an event listener so that when the sprite is clicked, the variable goes up by one. Make the button switch to the pressed costume and make a sound, too.\n3. Make a variable that keeps track of time.\n4. When the green flag is clicked, make the timer start from 10 and count down to 0.\n5. Before the timer starts, make the button say "Ready...", "Set...", and "Go!" for one second each.\n6. When time runs out, make the button hide. Because the button hides at the end, include a green-flag reset that shows it again when a new game starts.',
					projectLink: "https://scratch.mit.edu/projects/299327014/",
					solutionLink: "https://scratch.mit.edu/projects/299311602/"
				},
				{
					title: "Message Broadcasting",
					content:
						"Broadcasting lets sprites send messages to each other. This is useful when one sprite should wait for another sprite to finish speaking, moving, or changing state before its own script begins.\nOpen the Events blocks and compare `broadcast __` with `when I receive __`. Practice by making one sprite finish a short action, broadcast a message, and trigger a second sprite to start moving only after that message is received."
				},
				{
					title: "GM1 Project 5: Dance Off",
					content:
						"Build a dance sequence where each sprite gets a turn to perform on the stage.\n1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she is done, have her glide off to the right side of the stage.\n2. Make each of the other dancers follow the same pattern one by one. Add clapping or applause between performers, and reset each dancer to the left side when the green flag is clicked.\n3. Add backdrop code that plays dancing music forever. When Champ is done dancing, broadcast a message that stops the music.\n4. Optional extension: add lighting changes, a final applause sequence, or a closing pose after everyone is done.",
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
					content:
						"Repeat the core ideas from GM1 Review: Events, Loops, Conditionals, & Broadcasting on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Review: Events, Loops, Conditionals, & Broadcasting: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM1 Review: Events, Loops, Conditionals, & Broadcasting. Keep the scope small, but require one meaningful design or reasoning choice."
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
						"1. Trace the order of the sample pattern before building it.\n2. Program the cat to draw the first small square in the bottom-right quadrant. Clear the canvas first and put the pen down before drawing starts.\n3. Program the medium square and then the large square.\n4. After the three squares are drawn in the bottom-right quadrant, turn 90 degrees and change the pen color by 25.\n5. Use nested loops to draw the same square pattern in the other three quadrants.\n6. Use a variable for side length to simplify the code further.",
					projectLink: "https://scratch.mit.edu/projects/306391834/",
					solutionLink: "https://scratch.mit.edu/projects/306394145/"
				},
				{
					title: "GM2 Project 2: Pyramid",
					content:
						"1. Trace the sample pattern before building it.\n2. Program the cat to draw the first tiny triangle. Start at (0, 120), point in direction 150 degrees, and put the pen down before drawing starts.\n3. Program a slightly larger triangle, then an even larger triangle.\n4. Use nested loops and a variable to draw 15 total triangles for the pyramid.",
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
						"Draw a grid by treating one row as a repeated pattern.\n1. Plan how one row of squares changes after each square is drawn.\n2. Make the pencil start at (-200, 150) and draw 8 squares with a side length of 50 from left to right across the screen.\n3. Extend the row logic into multiple rows by changing the starting position for each row.\n4. Draw 6 rows of squares from the top to the bottom of the screen.",
					projectLink: "https://scratch.mit.edu/projects/334073152/",
					solutionLink: "https://scratch.mit.edu/projects/334067890/"
				},
				{
					title: "GM2 Supplemental Project 3: Rainbow Flower",
					content:
						"Draw a rainbow flower with repeated circular petals.\n1. When the green flag is clicked, make the pencil sprite go to the center of the screen and put the pen down.\n2. Start by programming a circle and inspecting the turn amount. Experiment with changing the turn amount and the amount added after each turn. Store the angle in a variable and increase it by 1 each loop iteration.\n3. After the experiment, set the starting angle to 0 degrees and repeat 40 times to create a spiral.\n4. Use the first petal pattern to create the other six petals. Each petal should start near the flower center and move outward.\n5. Change the pen color after each petal to create a rainbow-colored flower.",
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
					content:
						"Use the arrow keys to help the baby chick find its parents.\n1. Program the chick so it can move up, down, left, and right with the arrow keys.\n2. When the green flag is clicked, make the rooster point to the right and then move back and forth across the screen forever. (Hint: Make the rooster turn 180 degrees randomly while walking.)\n3. Repeat step 2 for the hen.\n4. Program the chick to recognize whether it is with both parents, only one parent, or neither parent. If it is touching both parents, make it say “I love my parents!”; if it is just touching its mom, make it say “Hi, Mom!”; if it is just touching its dad, make it say “Hi, Dad!”; and if it is not touching either, make it say “Where are my parents?”",
					projectLink: "https://scratch.mit.edu/projects/335794156/",
					solutionLink: "https://scratch.mit.edu/projects/335790153/"
				},
				{
					title: "GM3 Supplemental Project 2: Save the Butterfly",
					content:
						"Use the left and right arrow keys to help the butterfly escape the hungry frog.\n1. When the green flag is pressed, make the butterfly go to (-60, 0) and the frog go to (-170, 0).\n2. Next, the frog should say “I'm hungry”, “Ooh, a butterfly!”, and “I'm coming to get you!” for two seconds each.\n3. After the frog broadcasts, it should start moving a random number of steps from 0 to 3 for the rest of the game. To make the game harder, increase the number of steps.\n4. Help the butterfly escape by using a “wait until” block so it moves forward 5 steps when the player alternates between the left and right keys.\n5. Holding down both keys can bypass the intended controls, so use complex conditionals to prevent that shortcut.\n6. If the butterfly is touching the frog, make it stop the other scripts, broadcast that the player lost, and hide. Add a green-flag reset that shows it again at the beginning.\n7. If the butterfly touches the dark purple tree on the other side of the screen, make it broadcast that the player won and glide off the screen.\n8. When the frog receives these win and lose broadcasts, make it stop the other scripts and respond accordingly.",
					projectLink: "https://scratch.mit.edu/projects/335798048",
					solutionLink: "https://scratch.mit.edu/projects/335794365"
				},
				{
					title: "Complex Conditionals: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM3 Complex Conditionals. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "GM4 Cloning",
			curriculum: [
				{
					title: "Cloning",
					content:
						"A clone is a temporary copy of a sprite while the project runs. This is useful when many similar objects should appear on screen, such as raindrops, paint marks, enemies, stars, or collectibles.\nThe main Scratch blocks are `create clone of myself`, `when I start as a clone`, and `delete this clone`. Most clone-based projects hide the original parent sprite and show only the clones, because the clones are the objects that move, collide, and disappear."
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
						"1. Program the umbrella so that it can be moved with the left and right arrow keys.\n2. Program the chick to continuously move forward in little steps and bounce if it hits a wall. Also make the chick switch directions randomly, once every few steps.\n3. Program the rain drop to create clones of itself continuously.\n4. When a clone is created, it should fall from the sky. Think about what should happen when it touches the chick and when the clone should be deleted, and add these scenarios into the code.\n5. Keep track of the number of times the chick got wet, and give the player 60 seconds to protect the chick as much as possible.",
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
					content:
						"Repeat the core ideas from GM4 Cloning on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Cloning: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM4 Cloning. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "Check-in #1",
			curriculum: [
				{
					title: "Check-in #1: Nested Loops",
					content:
						'Create a new blank project in Scratch, and name it "Check-in #1".\nNested-1: What is a loop? What is it called when a loop is placed inside another loop?\nNested-2: Add a sprite to your project and have it play a sound when the spacebar is pressed. Put a repeat 3 around the sound block and then a repeat 2 around the whole thing. Before running the code, predict how many times the sprite will make the sound.\nNested-3: When the green flag is clicked, draw a triangle. Turn 60 degrees and draw another triangle. Use a repeat block to make a hexagon of triangles.\nNote: You can draw this shape using the annotation tool on the screen for clarity.\nNested-4: Draw another, bigger hexagon around the first one. Use a loop around the existing code if it helps remove repetition.',
					solutionLink: "https://scratch.mit.edu/projects/341945558/"
				},
				{
					title: "Check-in #1: Cloning",
					content:
						"Practice prompts:\n1. How can Scratch duplicate sprites and make the duplicates do different things?\n2. Move the drawing code so that when the green flag is clicked, the parent sprite makes clones of itself every 2 seconds and the clones go to a random position and draw the hexagon shape.\n3. Make the clones show when they are created and then delete themselves when they are done. Decide what the original sprite should do while it is not drawing.",
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
					content:
						"Repeat the core ideas from Check-in #1 on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Check in #1: Open-Ended Variant",
					content:
						"Create an original variation inspired by Check-in #1. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "GM5 Strings",
			curriculum: [
				{
					title: "Strings",
					content:
						"Programs can store different kinds of data. Earlier variables mainly held numbers for scores, timers, movement, and comparisons. Strings store text: words, letters, spaces, punctuation, and other characters.\nA string can be thought of as characters connected in order. Scratch string blocks make it possible to join text, read a specific character, and measure text length. Practice with `join __ __`, `letter __ of __`, and `length of __`. String length includes spaces and punctuation, not just letters."
				},
				{
					title: "GM5 Project 1: Security Bot",
					content:
						'The robot is protecting the city. Use string blocks to ask questions and check text responses.\n1. Program the robot to ask for the user\'s name, and make him reply, "Nice to meet you, _____"\n2. Program the robot to ask for a word that starts with "q" and tell the user if they answered correctly.\n3. Program the robot to ask for a 7-letter word and tell the user if they answered correctly.\n4. Program the robot to ask for a word that ends in "y" and tell the user if they answered correctly.\nChallenge: Program the robot to ask for a 6-letter word that starts with "a" and tell the user if they answered correctly.',
					projectLink: "https://scratch.mit.edu/projects/308722400/",
					solutionLink: "https://scratch.mit.edu/projects/308717171/"
				},
				{
					title: "GM5 Project 2: Spelling Bee",
					content:
						"1. When 1 is pressed, ask the user for a word and spell out the word letter by letter. Example: C-O-D-I-N-G\n2. When 2 is pressed, ask the user for a word and spell out all but the first letter. Example: O-D-I-N-G\n3. When 3 is pressed, ask the user for a word and spell out all but the last letter. Example: C-O-D-I-N\n4. When 4 is pressed, ask the user for a word and spell out all but the first and last letters. Example: O-D-I-N\n5. When 5 is pressed, ask the user for a word and spell out every other letter. Example: C-D-N\n6. When 6 is pressed, ask the user for a word and spell out the word backward. Example: G-N-I-D-O-C",
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
						'Build a spelling test that checks one letter at a time.\n1. The starter code already has a secret word picked out and saved in the Secret Word variable.\n2. Add the Text to Speech extension and speak the secret word to the user.\n3. Ask the user to enter each letter of the word one by one. If the letter is correct, speak "Correct!" Otherwise end the game. (Hint: think about how to repeat through the word letter by letter.)\n4. If the user has spelled the entire word correctly, speak "You spelled [secret word] correctly!"',
					projectLink: "https://scratch.mit.edu/projects/338829500",
					solutionLink: "https://scratch.mit.edu/projects/338832976"
				},
				{
					title: "Strings: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM5 Strings. Keep the scope small, but require one meaningful design or reasoning choice."
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
					content:
						"Build a multiples practice game.\n1. Start by asking the user which number they want to know the multiples of.\n2. Create a variable that tracks the multiplier and set it to 1.\n3. Say the product of the user's answer and the multiplier variable, and then increase the multiplier variable by 1. Repeat this to make Scratch say the first ten multiples.\nChallenge: Have Scratch also ask the user how many multiples the user wants to hear, and update the code accordingly.",
					projectLink: "https://scratch.mit.edu/projects/338508588/",
					solutionLink: "https://scratch.mit.edu/projects/338505545/"
				},
				{
					title: "GM6 Supplemental Project 2: Stamping with Dotty",
					content:
						"Graph the absolute value function with Dotty.\n1. When the green flag is clicked, make Dotty go to the center of the screen and ask the user for an x-coordinate.\n2. First, change her x-coordinate to the user's answer, then change her y-coordinate to the absolute value of the answer (hint: this is a mathematical operator).\n3. Make her say what her new coordinates are and then leave a stamp with the pen tool.\n4. Repeat this code 10 times to graph 10 points of the function.\n5. Next, make Dotty go to (-180, 180), put the pen down, and then repeatedly increase the x position by 1 and update the y position to be the absolute value of the x position.",
					projectLink: "https://scratch.mit.edu/projects/341759115",
					solutionLink: "https://scratch.mit.edu/projects/338501835/"
				},
				{
					title: "Mathematical Operators: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM6 Mathematical Operators. Keep the scope small, but require one meaningful design or reasoning choice."
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
						"Build a list program that stores five bucket-list items and repeats them back.\n1. When the green flag is clicked, have the cat ask, “Tell me 5 things on your bucket list!”\n2. Program the cat to repeat this five times, adding the user's response to the list each time.\n3. Once the list is complete, have the cat loop through the list and repeat each bucket-list item back to the user.\nChallenge: Change the code so that instead of asking for five items, the cat keeps asking for new things to put on the list until the user types “stop.”",
					projectLink: "https://scratch.mit.edu/projects/308826506/",
					solutionLink: "https://scratch.mit.edu/projects/308824008/"
				},
				{
					title: "GM7 Project 2: List Practice",
					content:
						"1. When the spacebar is pressed, make the cat ask, “What number do you want to add to the list?” Add the number the user enters to the list.\n2. When the green flag is clicked, delete everything in the list.\n3. When the 1 key is pressed, program the cat to read the list normally, saying each number in the list for 1 second.\n4. When the 2 key is pressed, program the cat to read each number in the list doubled.\n5. When the 3 key is pressed, program the cat to read the list backwards.\n6. When the 4 key is pressed, program the cat to read each number and then whether the number is odd or even (e.g.: “1, Odd, 14, Even,...”).\nExtensions: say every other number in the list, say every number multiplied by 10, or say each number and then turn that many degrees to the right.",
					projectLink: "https://scratch.mit.edu/projects/315090026/",
					solutionLink: "https://scratch.mit.edu/projects/315051160/"
				},
				{
					title: "GM7 Project 3: Music Memory",
					content:
						'Build a memory game where the keyboard plays a series of notes and the player repeats them back correctly.\n1. Make the keyboard introduce the game and say “Ready... Set... Go!”\n2. Program the keyboard to say and play 3 random notes, adding these notes to a "solution" list.\n3. Ask the user to type in their note guesses, one note at a time, adding these notes to a "guess" list.\n4. If an incorrect note is typed in, end the game.\n5. If the user types in all the correct notes, make the game start over with the keyboard playing one more note than last time.',
					projectLink: "https://scratch.mit.edu/projects/309658040/",
					solutionLink: "https://scratch.mit.edu/projects/309653930/"
				}
			],
			supplementalProjects: [
				{
					title: "GM7 Supplemental Project 1: Multiple Magic",
					content:
						"Build a game that tests how quickly the player can calculate multiples of a number.\n\n1. When the green flag is pressed, create a target-number variable and set it to a random number between 1 and 10.\n2. Make a list to keep track of which multiples the player has entered, and a variable to keep track of their score.\n3. Have the wizard introduce the game and then continuously ask for multiples of the target number.\n4. Check if the answer is a multiple of that number, and also check if this multiple has already been entered. Play a sound, update the score, and update the list depending on whether the guess counts toward the score.\n5. For a timed version, create a timer variable and give the user 30 seconds to play the game.",
					projectLink: "https://scratch.mit.edu/projects/337820507",
					solutionLink: "https://scratch.mit.edu/projects/337817856"
				},
				{
					title: "GM7 Supplemental Project 2: Wheel of Fortune",
					content:
						"Welcome to the Wheel of Fortune! In this game, the user has a certain number of guesses to guess every letter of the secret word.\n1. Construct a word bank using a list, from which the computer will choose a random word of at the beginning of each game.\n2. Once the secret word is decided, add all the letters of the word to a new list and count the total number of unique letters in the word. Use this variable to keep track of the total number of letters the user needs to guess correctly. As you are adding the letters, make sure you don't add the same letter twice.\n3. Ask the user to guess a letter. If they guess a letter that is in the secret word (and they have not already guessed this letter), add this letter to the guess list and update the variable you are using to keep track of how many correct guesses the user has made.\n4. Allow the user a certain number of guesses to win the game (for example, the length of the word, plus 5).\n5. The user wins the game if they have correctly guessed all of the letters in the word, and they lose if they run out of guesses!",
					projectLink: "https://scratch.mit.edu/projects/340691786",
					solutionLink: "https://scratch.mit.edu/projects/342643080"
				},
				{
					title: "Lists: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM7 Lists. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "GM8 Functions",
			curriculum: [
				{
					title: "Functions",
					content:
						"Custom blocks in Scratch work like functions. A function is a named set of instructions that can be reused whenever the sprite needs that behavior. Some functions also take inputs, such as numbers, words, or conditions.\nUse the My Blocks section to create a custom block, define what it does, and then call it from another script. The key distinction is definition versus use: defining a function describes the behavior once, while calling the function runs that behavior with specific input values.\nFunctions keep projects organized by separating repeated behavior into named pieces. A game such as Music Memory could use functions for playing a note sequence, checking an answer, resetting a round, or displaying feedback."
				},
				{
					title: "GM8 Project 1: My First Functions",
					content:
						"1. Create a function that makes the cat speak a given number of times (the input will be the number of times).\n2. Create a function that makes the cat draw a square of a given size (the input will be the side length of the square).\n3. Create a function that makes the cat jump (the input will be the height of the jump).\n4. Create a function that makes the cat teleport by making the cat spin in a circle, go to a random spot with a sound effect, and then spin again (no inputs).\n5. When the green flag is clicked, use these functions to make the cat jump 100 steps, speak 3 times, draw a square of size 100, teleport, and then draw another square.",
					projectLink: "https://scratch.mit.edu/projects/315773207",
					solutionLink: "https://scratch.mit.edu/projects/315770711/"
				},
				{
					title: "GM8 Project 2: Talent Show II",
					content:
						"Build a talent-show project where the cat performs different talents using custom functions and user input.\n1. Create functions for each of the cat's talents, such as playing a song with an inputted number of notes or spinning in the air an inputted number of times. Create at least four talents.\n2. When the green flag is clicked, make the cat start the talent show. The cat asks the user which talent to perform, and then asks for the input that function needs.",
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
						"Build a rock-paper-scissors game with custom functions.\n1. Inspect the starter and identify the pink function blocks that need behavior.\n2. The “get computer answer” function should randomly pick rock, paper, or scissors and store it in a variable. A list can make this selection easier.\n3. The “get player answer” function should ask the player for rock, paper, or scissors and store it in a variable. If the user inputs something else, keep asking until the input is rock, paper, or scissors.\n4. The “find winner” function should compare the two answers and determine the winner. Rock beats scissors, scissors beats paper, and paper beats rock.\n5. Optional helper functions can handle player wins, computer wins, and ties.",
					projectLink: "https://scratch.mit.edu/projects/339972570/",
					solutionLink: "https://scratch.mit.edu/projects/339731727/"
				},
				{
					title: "Functions: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM8 Functions. Keep the scope small, but require one meaningful design or reasoning choice."
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
						"Math-1: How can Scratch perform operations on numbers? Where are these blocks located?\nMath-2: When the 2 key is pressed, make Andie say the result of adding together 5 and 6.\nMath-3,4: Create a random number between 1 and 20 and store it in a variable. If the number is less than 10, have Andie say “Wow, that's a small number!” otherwise, say “Whoa, that's a big number!”\nMath-5: What is the mod block? Use it to report to the user the remainder of dividing any two numbers.",
					solutionLink: "https://scratch.mit.edu/projects/342645999/"
				},
				{
					title: "Check-in #2: Lists",
					content:
						'Practice prompts:\n1. What are lists useful for in Scratch?\n2. Change the name of each of Andie\'s costumes to match the action that each costume is performing ("pass", "shoot", etc.). Create a list called “actions” and add each costume name when the 3 key is pressed.\n3. Make Andie say the second item in the list.\n4. Report the actions Andie can perform by looping through the list.\n5. After reporting all actions, ask which action should appear and switch the costume to that action. Clear the list first so the 3 key does not add duplicate items.',
					solutionLink: "https://scratch.mit.edu/projects/342645999/"
				},
				{
					title: "Check-in #2: Functions",
					content:
						"Practice prompts:\n1. What are functions in Scratch, and where can custom blocks be created?\n2. Create a function called “Score!” that changes Andie's costume, makes him say “Woohoo!”, and plays a clapping sound.\n3. Make Andie score when the spacebar is pressed.\n4. Create another function called “Find Multiples” that takes one number input and says the first 10 multiples of that number for one second each.\n5. When the spacebar is pressed, make Andie say the multiples of a random number from 1 to 10.",
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
					content:
						"Repeat the core ideas from Check-in #2 on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Check in #2: Open-Ended Variant",
					content:
						"Create an original variation inspired by Check-in #2. Keep the scope small, but require one meaningful design or reasoning choice."
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
					projectLink: "https://scratch.mit.edu/projects/468227197",
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
						'Build a platformer where Pal collects magic keys and moves through multiple levels.\n1. Inspect the backdrops for each level and create broadcasts for Level 1, Level 2, and Level 3 so each level\'s code stays organized.\n2. When the green flag is clicked, switch the backdrop to Level 1 and broadcast Level 1.\n3. When Pal receives Level 1, place Pal at the starting point and create a forever loop for ground checks and arrow-key movement. Functions can keep this movement code easier to manage.\n4. To keep Pal on the ground, move Pal down when it is not touching green. (Hint: try using a "repeat until" block.)\n5. Pal should move left and right using the left and right arrow keys.\n6. If the user presses the up arrow key, make Pal jump. To make Pal jump, increase its y position and let it move left and right. Challenge: prevent Pal from jumping through platforms.\n7. Choose where the magical key should be placed for Level 1, and tell it to go there when it receives the message broadcast.\n8. When Pal gets to the key, switch to the next backdrop, broadcast the next level, and stop the Level 1 script.\n9. Repeat the same structure for Level 2, with a pitfall reset when Pal touches the brown pitfall.\n10. Repeat the same structure for Level 3, placing teleporters and making Pal go to teleporter out when it touches teleporter in.\n11. When the user collects the key on Level 3, broadcast the end of the game and switch the backdrop.\n12. Add sounds or other special effects to support the game state changes.',
					projectLink: "https://scratch.mit.edu/projects/343651574/",
					solutionLink: "https://scratch.mit.edu/projects/343348430/"
				},
				{
					title: "Fish Food: Fluency Drill",
					content:
						"Repeat the core ideas from GM9 Fish Food on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Fish Food: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM9 Fish Food. Keep the scope small, but require one meaningful design or reasoning choice."
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
					content:
						"Repeat the core ideas from GM10 Treasure Cave on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Treasure Cave: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM10 Treasure Cave. Keep the scope small, but require one meaningful design or reasoning choice."
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
						"Once it's complete, prepare a simple project summary about how the game was programmed, which lists and functions were used, and what design choices made it work.\n\nThe summary should reflect on the finished project, the problem-solving involved in building it, and one improvement that would make the game stronger."
				},
				{
					title: "Course Recap",
					content:
						"End the course by reviewing the major Scratch concepts: events, loops, conditionals, complex conditionals, variables, broadcasting, cloning, lists, functions, coordinates, game states, and project planning.\nConnect those ideas to the next text-based programming course. The same logic skills carry over into Python, but the blocks become typed code."
				},
				{
					title: "Optional Extra Practice: Typing Games",
					content:
						"This optional section is for the transition from Scratch into Python Level 1.\n\nThe purpose is to prepare for the shift from block-based to text-based coding and to strengthen typing and keyboard fluency. These games are optional and do not need to be completed in full. Choose games that feel useful, practice for about 15 to 20 minutes as needed, and move to the intermediate options if the beginner games feel too easy.\n\nOne of the biggest differences between Python and Scratch is that Python code must be typed rather than assembled from blocks. Typing practice makes it easier to focus on programming ideas instead of searching for keys.\n\nBeginner Typing Games:\n- Practice with the Keyboard - Typing Letters: https://scratch.mit.edu/projects/214833806/\n- Practice with the Keyboard - Typing Numbers: https://scratch.mit.edu/projects/214828609/\n- Practice with the Keyboard - Typing Letters Race: https://www.nitrotype.com/\n\nIntermediate Typing Games:\n- Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game\n- Ghost Typing: https://www.abcya.com/games/ghost_typing\n- Koala Paddleboards (spelling and typing practice): https://www.abcya.com/games/spelling_practice\n\nAdvanced Typing Games:\n- Typing Rocket: https://www.abcya.com/games/typing_rocket\n- Type Racer: https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer"
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
					content:
						"Repeat the core ideas from GM11 Master Project on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "GM11 Master Project: Open-Ended Variant",
					content:
						"Create an original variation inspired by GM11 Master Project. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "GM12 Arcade Systems Studio",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module focuses on combine cloning, lists, functions, broadcasts, and complex conditionals into a reusable arcade-game structure. The work should make the program structure visible: what starts the project, what changes state, what repeats, what responds to events, and what condition ends or advances the experience."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Build Requirements",
					content:
						"Build around spawn rules, collision rules, level progression, score state, difficulty changes, and game-over cleanup. The finished project should have visible behavior that can be tested from the green flag, not only isolated scripts that work one at a time."
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
					title: "Common Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: arcade game with reusable reset, spawn, scoring, and level systems. Include one new feature, one cleanup/refactor step, and one explanation of why the added behavior fits the original project."
				}
			]
		},
		{
			title: "GM13 Simulation and Data Studio",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module focuses on use Scratch lists and variables to model changing systems and display data over time. The work should make the program structure visible: what starts the project, what changes state, what repeats, what responds to events, and what condition ends or advances the experience."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Build Requirements",
					content:
						"Build around population changes, resource collection, random events, graph-like list displays, and repeated trials. The finished project should have visible behavior that can be tested from the green flag, not only isolated scripts that work one at a time."
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
					title: "Common Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: interactive simulation with visible data, summary statistic, and explanation of randomness. Include one new feature, one cleanup/refactor step, and one explanation of why the added behavior fits the original project."
				}
			]
		},
		{
			title: "GM14 Code Organization and Debugging Studio",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module focuses on organize larger Scratch projects with named custom blocks, consistent broadcasts, reset scripts, and testable subsystems. The work should make the program structure visible: what starts the project, what changes state, what repeats, what responds to events, and what condition ends or advances the experience."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Build Requirements",
					content:
						"Build around duplicated scripts, unclear message names, stale variable state, hidden clones, and functions that do too many things. The finished project should have visible behavior that can be tested from the green flag, not only isolated scripts that work one at a time."
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
					title: "Common Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: refactored Scratch project with a before-and-after explanation. Include one new feature, one cleanup/refactor step, and one explanation of why the added behavior fits the original project."
				}
			]
		},
		{
			title: "GM15 Text-Based Programming Bridge",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module focuses on map advanced Scratch concepts to Python readiness: lists, functions, parameters, loops, conditionals, state, and debugging traces. The work should make the program structure visible: what starts the project, what changes state, what repeats, what responds to events, and what condition ends or advances the experience."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Build Requirements",
					content:
						"Build around Scratch custom blocks translated to functions, list operations translated to Python lists, and broadcasts translated to function calls or state changes. The finished project should have visible behavior that can be tested from the green flag, not only isolated scripts that work one at a time."
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
					title: "Common Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: bridge portfolio that translates one Scratch game mechanic into pseudocode and Python-style code. Include one new feature, one cleanup/refactor step, and one explanation of why the added behavior fits the original project."
				}
			]
		}
	]
};
