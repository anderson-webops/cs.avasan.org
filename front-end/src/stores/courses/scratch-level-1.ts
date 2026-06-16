import type { RawCourse } from "./types";
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
						"Create a Scratch account and explore the code blocks. Learn how the stage and sprites work, and experiment with the green flag to start scripts."
				},
				{
					title: "Project 1 – Hungry Hippo",
					content:
						'• Play a sample Hungry Hippo game.\n• Create a custom version of the game using a sprite of your choice.\n• Make the sprite move using the left, right, up and down arrow keys (use the "point in direction" and "move 10 steps" blocks).\n• Decide which module to start in based on understanding of the controls.\n• Program the sprite to collect objects and increase its score each time it collects one.\n• Create variables for "score" and a timer; increase the score when objects are collected and decrease time as the game runs.',
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
					content:
						"Repeat the core ideas from GS1 Starting in Scratch on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Starting in Scratch: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS1 Starting in Scratch. Keep the scope small, but require one meaningful design or reasoning choice."
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
						'It\'s time to build a fun spinner:\n\n1. When the green flag is clicked, make the arrow point to the right.\n2. When the up, left, right or down arrow keys are pressed, point the arrow in the corresponding direction.\n3. When the "A" key is pressed, turn the arrow 15 degrees to the left.\n4. When the "D" key is pressed, turn the arrow 15 degrees to the right.\n5. When the spacebar is pressed, make the arrow point towards the mouse.',
					projectLink: "https://scratch.mit.edu/projects/287920173/",
					solutionLink: "https://scratch.mit.edu/projects/287887351/"
				},
				{
					title: "Project 2 – Bouncy Ball Room",
					content:
						"1. When the green flag is clicked, have the ball go to a random position.\n2. When the space key is pressed, make the ball move 10 steps and bounce off the edge.\n3. When the right-arrow key is pressed, change the backdrop.\n4. When the up or down arrows are pressed, make the ball grow or shrink (use negative numbers for shrinking).\n5. When the ball is clicked, play a sound and change its color.",
					projectLink: "https://scratch.mit.edu/projects/287924505/",
					solutionLink: "https://scratch.mit.edu/projects/287922077/"
				},
				{
					title: "Project 3 – Dragonfly Events",
					content:
						'1. When the green flag is clicked, move the dragonfly to a random spot.\n2. Use the arrow keys to move the dragonfly 20 steps.\n3. When the dragonfly is clicked, change its color.\n4. When the space bar is pressed, play a pop sound.\n5. When the "1" key is pressed, make the dragonfly pop and go to a random position.\n6. When the "2" key is pressed, have the dragonfly say something.\n7. When the "3" key is pressed, change the background.\nChallenge: Add another sprite controlled by the W-A-S-D keys.',
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
					content:
						"Repeat the core ideas from GS2 Event Listeners on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Event Listeners: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS2 Event Listeners. Keep the scope small, but require one meaningful design or reasoning choice."
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
						"1. When the green flag is clicked, send the ball to a random position.\n2. When the spacebar is pressed, make the ball move 10 steps and bounce off the edge.\n3. Each time the ball moves, put the pen down so the ball leaves a trail.\n4. Each time the ball moves, change the pen color.\n5. When the green flag is clicked, erase any existing drawings and lift the pen up before moving the ball to a random position.",
					projectLink: "https://scratch.mit.edu/projects/313084455/",
					solutionLink: "https://scratch.mit.edu/projects/287952358/"
				},
				{
					title: "Project 2 – Stencil Pencil",
					content:
						'1. The up arrow moves the pencil forward; the down arrow moves it backward.\n2. The left arrow rotates the pencil 10 degrees left; the right arrow rotates it 10 degrees right.\n3. Pressing "1" lowers the pen (start drawing).\n4. Pressing "2" lifts the pen (stop drawing).\n5. Clicking the pencil changes its pen color.\n6. Pressing "3" increases the pen size; pressing "4" decreases the pen size.\n7. When the green flag is clicked, erase all drawings, move the pencil back to the middle of the stage facing right and reset the pen size/color.\n\nChallenge: Trace shapes on other backdrops.',
					projectLink: "https://scratch.mit.edu/projects/287738652/",
					solutionLink: "https://scratch.mit.edu/projects/285312799/"
				},
				{
					title: "Project 3 – Beetle Artist",
					content:
						'1. Use the arrow keys to move the beetle 10 steps.\n2. When the green flag is clicked, erase all drawings.\n3. Press "1" to draw a square.\n4. Press "2" to draw a triangle.\n5. Press "3" to draw an arrow shape.\nChallenge: Trace shapes on other backdrops.',
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
					content:
						"Repeat the core ideas from GS3 Pen with Event Listeners on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Pen with Event Listeners: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS3 Pen with Event Listeners. Keep the scope small, but require one meaningful design or reasoning choice."
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
						'1. When the "1" key is pressed, grow the elephant ten times (increase size by 10, ten times).\n2. When the "2" key is pressed, shrink the elephant ten times.\n3. When the "3" key is pressed, change the elephant\'s color effect forever.\n4. When the "4" key is pressed, change a different graphic effect forever.\n5. When the "5" key is pressed, hide the elephant, wait one second, then show it again (repeat this sequence).\n6. When the space bar is pressed, switch the costume, play a sound and then switch back to the original costume, repeating the whole sequence three times.',
					projectLink: "https://scratch.mit.edu/projects/291122885/",
					solutionLink: "https://scratch.mit.edu/projects/291119943/"
				},
				{
					title: "Project 2 – Hot Cross Buns",
					content:
						'This project uses the Music extension. When the green flag is clicked, play the song "Hot Cross Buns" twice:\n\nE-D-C, E-D-C, C-C-C-C, D-D-D-D, E-D-C.\n\nUse loops for repeated sections. Compose other songs as an extension.',
					projectLink: "https://scratch.mit.edu/projects/291117784/",
					solutionLink: "https://scratch.mit.edu/projects/291115434/"
				},
				{
					title: "Project 3 – Drawing Mouse",
					content:
						'1. Add an event listener so that when the green flag is clicked, all drawings are erased.\n2. When the "1" key is pressed, make the mouse draw a square using a loop at a random location.\n3. When the "2" key is pressed, make the mouse draw a triangle.\n4. When the "3" key is pressed, make the mouse draw a circle (explain that a circle can be drawn by repeating many small steps that turn in small increments to total 360 degrees).\nChallenge: Create other shapes, like an octagon or a star, possibly adding random sizes and colors.',
					projectLink: "https://scratch.mit.edu/projects/289744824/",
					solutionLink: "https://scratch.mit.edu/projects/289445069/"
				}
			],
			supplementalProjects: [
				{
					title: "GS4 Supplemental Project 1 – Shapify",
					content:
						"1. Use Pen blocks to draw a hexagon. (Hint: divide 360 degrees by the number of sides.)\n2. Use the same method to draw an octagon, a decagon, a dodecagon and a circle.\n3. Predict what happens if the loop around the circle is replaced with a forever loop, and then try it.\nChallenge: Draw a different circle using different numbers.",
					projectLink: "https://scratch.mit.edu/projects/330468686/",
					solutionLink: "https://scratch.mit.edu/projects/330429172/"
				},
				{
					title: "Loops: Fluency Drill",
					content:
						"Repeat the core ideas from GS4 Loops on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Loops: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS4 Loops. Keep the scope small, but require one meaningful design or reasoning choice."
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
						'1. Make the dinosaur follow the mouse pointer forever.\n2. Use conditionals to make the dinosaur say "I\'m in red!" when standing in red; similarly, add conditions for yellow, blue and grey.',
					projectLink: "https://scratch.mit.edu/projects/291223299/",
					solutionLink: "https://scratch.mit.edu/projects/291220849/"
				},
				{
					title: "Project 2 – Noisy Reactions",
					content:
						'1. When the green flag is clicked, make the ball bounce around the screen forever.\n2. Use a conditional so that when the bell touches the ball, the bell swings back and forth and rings four times.\n3. When the ball touches lightning, make the lightning strike the ground and play a thunder sound, then return the lightning to the cloud. Use the "go to [sprite]" block to reset the lightning.\n4. When the chick touches the ball, make the chick move 5 steps and chirp.',
					projectLink: "https://scratch.mit.edu/projects/291542721/",
					solutionLink: "https://scratch.mit.edu/projects/291530292/"
				},
				{
					title: "Project 3 – Magic Wand",
					content:
						"1. Make a magic wand move to the frog and turn it into a wizard.\n2. Make the wand move to the piano and play three notes (any instrument/notes are fine).\n3. Make the wand move to the ghost and send the ghost toward the star.\n4. When the ghost touches the star, make the star grow to fill the screen.",
					projectLink: "https://scratch.mit.edu/projects/304279087/",
					solutionLink: "https://scratch.mit.edu/projects/304279316/"
				}
			],
			supplementalProjects: [
				{
					title: "GS5 Supplemental Project 1 – Camouflaging Octopus",
					content:
						"1. Use event listeners to control the octopus with the arrow keys.\n2. Use conditionals so the octopus turns blue when on a blue background.\n3. Add conditionals for yellow, green and red backgrounds.",
					projectLink: "https://scratch.mit.edu/projects/326209430/",
					solutionLink: "https://scratch.mit.edu/projects/326209241/"
				},
				{
					title: "GS5 Supplemental Project 2 – Playing Catch",
					content:
						"1. When the green flag is clicked, make the basketball go to Gobo and move forever.\n2. When Pico has the ball, use conditionals to pass it back to Gobo.\n3. When Gobo has the ball, pass it to Pico.\nChallenge: Add more sprites to the game and have the ball pass between them.",
					projectLink: "https://scratch.mit.edu/projects/326211768/",
					solutionLink: "https://scratch.mit.edu/projects/326211724/"
				},
				{
					title: "Basic Conditionals: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS5 Basic Conditionals. Keep the scope small, but require one meaningful design or reasoning choice."
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
						'1. Create controls for the dinosaur using the arrow keys.\n2. When the "b" key is pressed, have the dinosaur say "Move me to blue!" for 2 seconds.\n3. After speaking, use an if/then/else to check if the dinosaur is touching blue; if it is, say "Good job!", otherwise say "This isn\'t the right color!".\n4. Repeat the previous step for the "r" (red) and "y" (yellow) keys.\n5. Add sounds and costume changes for each color.',
					projectLink: "https://scratch.mit.edu/projects/293788691/",
					solutionLink: "https://scratch.mit.edu/projects/293787944/"
				},
				{
					title: "Project 2 – Hungry Dinosaur",
					content:
						'1. When the green flag is clicked, use if/then blocks to control the dinosaur with the arrow keys.\n2. When the space bar is pressed, the dinosaur attempts to eat bananas: if it is touching bananas, change the dinosaur\'s costume, play a sound or otherwise show the bananas being eaten; if not touching bananas, say "There aren\'t any bananas here!".\n3. When the space bar is pressed, if the bananas are touching the dinosaur, wait one second then move the bananas to a random location; otherwise have the bananas say "I\'m over here!".',
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
						"1. When the green flag is clicked, start the rocketship at the center bottom of the stage.\n2. If the user clicks the mouse, make the rocketship move up 5 steps; otherwise, it goes down 5 steps (always pointing upward).\n3. When the rocketship reaches the star, make it blast off using sounds, motion or visual effects.",
					projectLink: "https://scratch.mit.edu/projects/332463981/",
					solutionLink: "https://scratch.mit.edu/projects/332459692/"
				},
				{
					title: "GS6 Supplemental Project 2 – Baby Fish",
					content:
						'1. When the green flag is clicked, make the baby fish continuously go to the mouse pointer.\n2. If the baby fish is touching the mom fish, make it say "I found her"; otherwise say "Take me to my mom".\n3. Make the mom fish glide around the screen randomly.',
					projectLink: "https://scratch.mit.edu/projects/332468797/",
					solutionLink: "https://scratch.mit.edu/projects/332464646/"
				},
				{
					title: "Advanced Conditionals: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS6 Advanced Conditionals. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "GS7 User Input",
			curriculum: [
				{
					title: "Getting user input",
					content:
						'Event listeners respond to button presses, but many projects also need text typed by the user. The "ask ___ and wait" block collects typed input, and the "answer" variable stores the most recent response. Use the equality (=) block to compare the answer to a correct value, and use < and > blocks when a typed number should be compared by size.'
				},
				{
					title: "Project 1 – Math Facts",
					content:
						'1. When the "1" key is pressed, have Gobo ask a math question (e.g., "What\'s 9 – 7?"). Indicate whether the answer is correct or incorrect via costume, sound or speech.\n2. When the "2" key is pressed, have Gobo ask a question like "What\'s a number less than 0?" and indicate whether the answer is correct or incorrect.\n3. When the "3" key is pressed, have Gobo ask a harder math question and allow the user to keep answering until the answer is correct. If the answer is too low, Gobo should say "Higher!"; if too high, say "Lower!".',
					projectLink: "https://scratch.mit.edu/projects/295332936/",
					solutionLink: "https://scratch.mit.edu/projects/294539961/"
				},
				{
					title: "Project 2 – Fortune Teller",
					content:
						'1. When the green flag is clicked, play an introduction and ask the user their name.\n2. Ask the user "What do you want to know? (Type Love, Money, or Friendship)".\n3. Use conditionals to give a fortune based on the user\'s input.\n4. Ask another question such as "Choose a number between 1 and 5" and use conditionals to provide a response.\nChallenge: Add more fortunes and questions to make the fortune teller more detailed.',
					projectLink: "https://scratch.mit.edu/projects/295333590/",
					solutionLink: "https://scratch.mit.edu/projects/294540150/"
				},
				{
					title: "Project 3 – Number Guesser",
					content:
						"1. When the green flag is clicked, have the sprite choose a random number between 1 and 20.\n2. Ask the user to guess the number.\n3. Use if/then/else blocks to tell the user if their guess is too high or too low.\n4. Allow the user to keep guessing until they get the number right.\nChallenge: Add a counter for the number of guesses and congratulate the player if they guess the number in fewer than 5 tries.",
					projectLink: "https://scratch.mit.edu/projects/295335247/",
					solutionLink: "https://scratch.mit.edu/projects/294541979/"
				}
			],
			supplementalProjects: [
				{
					title: "GS7 Supplemental Project 1 – Animal Crossing",
					content:
						"1. Ask the user if they want to build a shop, plant a tree or explore the island.\n2. Use the answer to determine which event occurs.\n3. Ask the user yes/no questions to further customize the experience.\n4. Use variables to store items collected or tasks completed.\n5. Add prompts or rewards that make exploration and hidden secrets clear.",
					projectLink: "https://scratch.mit.edu/projects/330320360/",
					solutionLink: "https://scratch.mit.edu/projects/330316142/"
				},
				{
					title: "GS7 Supplemental Project 2 – Space Cadets",
					content:
						'1. Ask the user for their name and call them "Captain".\n2. Ask which planet (Mars, Jupiter or Saturn) they want to explore.\n3. Use conditionals to set the scene for the chosen planet.\n4. Ask additional questions (e.g., "Do you want to collect rocks or search for life?") and branch the story based on the answers.\n5. Use variables to track discoveries or points.',
					projectLink: "https://scratch.mit.edu/projects/330321409/",
					solutionLink: "https://scratch.mit.edu/projects/330316808/"
				},
				{
					title: "User Input: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS7 User Input. Keep the scope small, but require one meaningful design or reasoning choice."
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
					content:
						"1. When the green flag is clicked, make the praying mantis appear at a random position.\n2. When the mouse is clicked, make the mantis glide to the mouse pointer's X and Y position.\n3. If the mantis touches a bug, broadcast a message to make the bug disappear and increase the score.\n4. Use variables for the score and a timer.\n5. End the game when the timer runs out and display the score.",
					projectLink: "https://scratch.mit.edu/projects/302997680/",
					solutionLink: "https://scratch.mit.edu/projects/302865707/"
				},
				{
					title: "Project 2 – Cake Chaser",
					content:
						"1. Set up two sprites: a person and a slice of cake.\n2. Use the arrow keys to move the person around the stage.\n3. Make the cake appear at random X and Y coordinates.\n4. When the person touches the cake, play a sound, move the cake to a new random location and increase the score.\n5. Add a timer that counts down and ends the game when it reaches zero.",
					projectLink: "https://scratch.mit.edu/projects/302998723/",
					solutionLink: "https://scratch.mit.edu/projects/302865909/"
				},
				{
					title: "Project 3 – Talent Show",
					content:
						"1. Choose three performers (sprites).\n2. When the green flag is clicked, have each performer go to their starting position using X and Y coordinates.\n3. Use broadcast messages to make each performer do an act in sequence (dance, jump or play an instrument).\n4. After the performances, have all performers bow together.",
					projectLink: "https://scratch.mit.edu/projects/302999957/",
					solutionLink: "https://scratch.mit.edu/projects/302866259/"
				}
			],
			supplementalProjects: [
				{
					title: "GS8 Supplemental Project 1 – Quadrant Practice",
					content:
						'1. Use the arrow keys to move a sprite to each quadrant of the stage.\n2. When the sprite reaches a quadrant, display a message such as "I\'m in Quadrant I".\n3. Challenge: Add shapes or obstacles that must be avoided.',
					projectLink: "https://scratch.mit.edu/projects/330290958/",
					solutionLink: "https://scratch.mit.edu/projects/330287678/"
				},
				{
					title: "GS8 Supplemental Project 2 – Coordinate Drawings",
					content:
						"1. Using the Pen extension, draw a picture by moving the sprite to various X and Y coordinates.\n2. Allow the user to enter coordinates to draw their own shapes.\n3. Include example coordinate sets for initials or simple pictures.",
					projectLink: "https://scratch.mit.edu/projects/330291711/",
					solutionLink: "https://scratch.mit.edu/projects/330288612/"
				},
				{
					title: "X & Y Coordinates: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS8 X & Y Coordinates. Keep the scope small, but require one meaningful design or reasoning choice."
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
						"1. When the green flag is clicked, create a timer variable and set it to 20.\n2. Make a target sprite (e.g., a button) appear in random positions.\n3. Each time the target is clicked, increase a score variable by 1.\n4. Decrease the timer by 1 every second; when the timer reaches zero, stop the game and display the final score.\n5. Consider adding a high-score variable.",
					projectLink: "https://scratch.mit.edu/projects/302996579/",
					solutionLink: "https://scratch.mit.edu/projects/302864606/"
				},
				{
					title: "Project 2 – Spider Smash",
					content:
						"1. When the green flag is clicked, have spiders appear at random positions and move downward.\n2. When a spider is clicked, hide it, play a sound and increase the score.\n3. Create a timer that counts down; end the game when it reaches zero.\n4. Optionally increase difficulty by speeding up the spiders over time.",
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
					content:
						'1. Use the arrow keys to move a sprite around the stage.\n2. Make a variable called "steps" that increases each time the sprite moves.\n3. Display the number of steps taken.\n4. Challenge: Add obstacles and a goal to reach.',
					projectLink: "https://scratch.mit.edu/projects/330293454/",
					solutionLink: "https://scratch.mit.edu/projects/330289893/"
				},
				{
					title: "GS9 Supplemental Project 2 – Hungry Crab",
					content:
						'1. Control a crab with the arrow keys.\n2. Create a variable called "food" and increase it each time the crab eats a piece of food.\n3. Add a timer; when time runs out, end the game and display how much food was collected.',
					projectLink: "https://scratch.mit.edu/projects/330294193/",
					solutionLink: "https://scratch.mit.edu/projects/330290622/"
				},
				{
					title: "GS9 Supplemental Project 3 – Lunch Money",
					content:
						'1. Start with a variable "money" set to 10.\n2. Ask the user what they want to buy for lunch (e.g., pizza, sandwich or salad) and subtract the cost from the money variable.\n3. If the user can\'t afford an item, display a message.\n4. Allow them to continue buying until the money runs out.',
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
						"Broadcasting lets sprites send messages to each other. This is useful when one sprite should wait for another sprite to finish speaking, moving, or changing state before its own script begins.\n\nOpen the Events blocks and compare `broadcast __` with `when I receive __`. Practice by making one sprite finish a short action, broadcast a message, and trigger a second sprite to start moving only after that message is received."
				},
				{
					title: "GS10 Project 1 – Dance Off",
					content:
						"Build a dance sequence where each sprite gets a turn to perform on the stage.\n\n1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she is done, have her glide off to the right side of the stage.\n2. Make each of the other dancers follow the same pattern one by one. Add clapping or applause between performers, and reset each dancer to the left side when the green flag is clicked.\n3. Add backdrop code that plays dancing music forever. When Champ is done dancing, broadcast a message that stops the music.\n4. Optional extension: add lighting changes, a final applause sequence, or a closing pose after everyone is done.",
					projectLink: "https://scratch.mit.edu/projects/301002220/",
					solutionLink: "https://scratch.mit.edu/projects/300644693/"
				},
				{
					title: "GS10 Project 2 – Bowl Fill",
					content:
						'Build a collection game where the player controls a bowl and collects different items.\n\n1. Program the bowl so it can be controlled with the arrow keys after the green flag is clicked.\n2. When a sprite is touched by the bowl, make it broadcast a message such as "Cheese touched".\n3. Decide what each sprite should do when it receives its message. It might move, play a sound, hide, or trigger a bowl reaction.\n4. Add variables that track how many times each object has been collected.\n5. Add a timer that stops the game after 15 seconds. When the timer runs out, broadcast a message that makes all sprites on the screen react, such as spinning, growing, shrinking, or showing the final result.',
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
						"Design your own play, and use the broadcast blocks to set up the scene changes and dialogue between characters!\n\n1. Come up with a story that involves 3-4 characters and scenes. You can use movies or your real life as inspiration!\n2. Add the sprites and backdrops you will need to your project.\n3. Make your story come to life! Broadcast messages between your sprites to make sure everything happens in the correct sequence.",
					projectLink: "https://scratch.mit.edu/projects/330301165/",
					solutionLink: "https://scratch.mit.edu/projects/328309254/"
				},
				{
					title: "GS10 Supplemental Project 2 – Cartoon Crash",
					content:
						"Pick a partner for Dani to play with, and they will bounce around the screen together!\n\n1. When the green flag is clicked, set up the Start button in the correct position and have Dani explain the instructions.\n2. When the Start button is clicked, set up the sprites in the correct positions.\n3. Program each sprite so that if it is chosen (i.e., clicked on), it bounces around the room with Dani! If it is not chosen, it should also react appropriately.",
					projectLink: "https://scratch.mit.edu/projects/330302209/",
					solutionLink: "https://scratch.mit.edu/projects/328312475/"
				},
				{
					title: "Message Broadcasting: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS10 Message Broadcasting. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "GS11 Hedgehog Race",
			curriculum: [
				{
					title: "GS11 Project 1 – Hedgehog Race",
					content:
						"Build Hedgehog Race by planning the moving pieces before programming. Play through the demo and identify the game elements that need to be built: sprite behavior, controls, event reactions, variables, scoring, and end conditions.\n\nAdd a project comment that lists the implementation steps. Starter code is provided, but a custom version can also be built from a blank project with original sprites, costumes, and backdrops.",
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
						"Play through the demo and identify the game elements that need to be programmed: sprite behavior, controls, event reactions, variables, scoring, and end conditions.\n\nAdd a project comment that lists the implementation steps.\n\nThe wizard has been turned into a frog. Help him collect potions while avoiding skeletons to turn back into a wizard.\n\n1. Program the frog wizard so that when the green flag is clicked, he goes to the center of the screen, changes size, and moves with the arrow keys.\n2. Program the skeleton to start at a random position on the far right side and move left. When it touches the frog or the left edge, send it back to the right side.\n3. Program the potion with a similar reset pattern. For a harder version, make the potion wait a few seconds before appearing on the right again. Hint: use show/hide blocks.\n4. Add a level variable. Set it to 1 at the start of the game and use it to control win/loss progress.\n5. Create broadcasts for leveling up and leveling down. Leveling up at level 4 wins the game; otherwise, increase the level, switch costume, and increase size. Leveling down at level 1 loses the game; otherwise, decrease the level, switch costume, and decrease size.\n6. Broadcast the level-up or level-down messages when the skeletons or potion touch the frog.\n7. Add another skeleton for extra difficulty.\n8. Add sound effects and backdrop changes for the finishing touches.",
					projectLink: "https://scratch.mit.edu/projects/332395747/",
					solutionLink: "https://scratch.mit.edu/projects/330724703/"
				},
				{
					title: "Hedgehog Race: Fluency Drill",
					content:
						"Repeat the core ideas from GS11 Hedgehog Race on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Hedgehog Race: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS11 Hedgehog Race. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "GS12 Asteroid Dodge",
			curriculum: [
				{
					title: "GS12 Project 1 – Asteroid Dodge",
					content:
						"Build Asteroid Dodge by identifying the player controls, asteroid movement, collision rules, score or survival timer, and restart behavior before programming.\n\nAdd a project comment that lists the implementation steps. The starter project can be used as a base, or the same mechanics can be rebuilt from a blank project with original sprites, costumes, and backdrops.\n\nTest that the player can move, asteroids reset cleanly, collisions are detected reliably, and the game has a clear ending or replay path.",
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
					content:
						"Repeat the core ideas from GS12 Asteroid Dodge on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "Asteroid Dodge: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS12 Asteroid Dodge. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "GS13 Master Project",
			curriculum: [
				{
					title: "GS13 Project 1 – Master Project",
					content:
						"The master project is an original Scratch game that combines the course's major ideas. Brainstorm the game type, sprites, controls, rules, win/loss condition, variables, and event structure before building.\n\nPlan the implementation by answering: what does each sprite do, how is it controlled, how does it react to events, what variables track game state, and how does the game end?"
				},
				{
					title: "Master Project Presentation",
					content:
						"Once it's complete, prepare a simple project summary explaining how the game was programmed, which sprites and variables were used, and what problems were solved along the way.\n\nThe summary should reflect on the design process, the finished result, and one improvement that would make the game stronger."
				},
				{
					title: "Course recap",
					content:
						"End the course by reviewing the major Scratch concepts: events, loops, conditionals, variables, broadcasting, coordinates, game states, sprite behavior, and project planning.\n\nConnect those ideas to Python Level 1. The same logic skills carry over, but the blocks become typed code."
				},
				{
					title: "Optional Extra Practice – Typing Games",
					content:
						"This optional section supports the transition from Scratch Level 1 into Python Level 1.\n\nThe purpose of this section is to prepare for the shift from block-based to text-based coding and to strengthen typing and computer literacy skills. These typing games are optional and do not need to be completed in full. Choose games that feel useful, spend about 15 to 20 minutes practicing as needed, and move to the intermediate options if the beginner games feel too easy.\n\nOne of the biggest differences between Python and Scratch is that Python code is typed rather than assembled from blocks. Typing practice makes that transition smoother and reduces friction when writing Python programs.\n\nBeginner Typing Games:\n• Practice with the Keyboard – Typing Letters: https://scratch.mit.edu/projects/214833806/\n• Practice with the Keyboard – Typing Numbers: https://scratch.mit.edu/projects/214828609/\n• Practice with the Keyboard – Typing Letters Race: https://www.nitrotype.com/\n\nIntermediate Typing Games:\n• Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game\n• Ghost Typing: https://www.abcya.com/games/ghost_typing\n• Koala Paddleboards (spelling and typing practice): https://www.abcya.com/games/spelling_practice\n\nAdvanced Typing Games:\n• Typing Rocket: https://www.abcya.com/games/typing_rocket\n• Type Racer: https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer"
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
					content:
						"Repeat the core ideas from GS13 Master Project on a smaller problem to build speed, independence, and cleaner reasoning."
				},
				{
					title: "GS13 Master Project: Open-Ended Variant",
					content:
						"Create an original variation inspired by GS13 Master Project. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "GS14 Mini Game Polish Studio",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module focuses on turn a working Scratch game into a more finished experience by improving instructions, scoring, difficulty, sound, and ending screens. The work should make the program structure visible: what starts the project, what changes state, what repeats, what responds to events, and what condition ends or advances the experience."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Build Requirements",
					content:
						"Build around a title screen, clear controls, score feedback, timer or lives, win/loss messages, and a replay path. The finished project should have visible behavior that can be tested from the green flag, not only isolated scripts that work one at a time."
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
					title: "Extension Project: Polished Mini Game",
					content:
						"Complete an extension project: polished version of Bug Eater, Cake Chaser, Hedgehog Race, or Asteroid Dodge. Include one new feature, one cleanup/refactor step, and one explanation of why the added behavior fits the original project."
				}
			]
		},
		{
			title: "GS15 Interactive Story Studio",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module focuses on use events, broadcasts, costumes, backdrops, and variables to build a story that changes based on choices. The work should make the program structure visible: what starts the project, what changes state, what repeats, what responds to events, and what condition ends or advances the experience."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Build Requirements",
					content:
						"Build around scene transitions, dialogue timing, character reactions, choice variables, and alternate endings. The finished project should have visible behavior that can be tested from the green flag, not only isolated scripts that work one at a time."
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
					title: "Extension Project: Branching Story",
					content:
						"Complete an extension project: branching story with at least two meaningful choices and two endings. Include one new feature, one cleanup/refactor step, and one explanation of why the added behavior fits the original project."
				}
			]
		},
		{
			title: "GS16 Debugging and Remix Studio",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module focuses on diagnose Scratch projects by checking event starts, forever loops, sprite visibility, variable reset, coordinate mistakes, and broadcast timing. The work should make the program structure visible: what starts the project, what changes state, what repeats, what responds to events, and what condition ends or advances the experience."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Build Requirements",
					content:
						"Build around broken controls, missing score updates, sprites hidden at start, scripts running in the wrong order, and games that never end. The finished project should have visible behavior that can be tested from the green flag, not only isolated scripts that work one at a time."
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
					title: "Extension Project: Debug Log and Remix Repair",
					content:
						"Complete an extension project: debug log plus repaired remix of a small broken project. Include one new feature, one cleanup/refactor step, and one explanation of why the added behavior fits the original project."
				}
			]
		},
		{
			title: "GS17 Text-Based Programming Bridge",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module focuses on connect Scratch blocks to text-code ideas such as events, loops, if statements, variables, functions, input, and coordinates. The work should make the program structure visible: what starts the project, what changes state, what repeats, what responds to events, and what condition ends or advances the experience."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Build Requirements",
					content:
						"Build around Scratch block screenshots or descriptions translated into pseudocode and then into simple Python-style statements. The finished project should have visible behavior that can be tested from the green flag, not only isolated scripts that work one at a time."
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
					title: "Extension Project: Scratch-to-Python Portfolio",
					content:
						"Complete an extension project: Scratch-to-Python readiness portfolio with three translated scripts. Include one new feature, one cleanup/refactor step, and one explanation of why the added behavior fits the original project."
				}
			]
		}
	]
};
