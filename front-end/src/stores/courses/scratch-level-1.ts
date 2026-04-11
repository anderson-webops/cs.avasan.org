import type { RawCourse } from "./types";

export const scratchLevel1Course: RawCourse = {
	name: "Scratch Level 1",
	modules: [
		{
			title: "GS1 Starting in Scratch",
			curriculum: [
				{
					title: "Scratch basics",
					content:
						"Create a Scratch account and explore the code blocks. Learn how the stage and sprites work, and experiment with the green flag to start scripts. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
					content:
						"Break GS1 Starting in Scratch into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Starting in Scratch: Verification and Reflection",
					content:
						"Close GS1 Starting in Scratch by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Starting in Scratch: Extension Challenge",
					content:
						"Extend the work from GS1 Starting in Scratch with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink: "https://scratch.mit.edu/projects/304003593/",
					solutionLink: "https://scratch.mit.edu/projects/313184786/"
				},
				{
					title: "Starting in Scratch: Fluency Drill",
					content:
						"Repeat the core ideas from GS1 Starting in Scratch on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "GS2 Event Listeners",
			curriculum: [
				{
					title: "Basic event listeners",
					content:
						'Introduce the concept of event listeners (blocks that wait for something to happen). Show the "when green flag clicked" and "when arrow key pressed" events. Demonstrate how event listeners start scripts when specific keys are pressed.'
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
					content:
						"Extend the work from GS2 Event Listeners with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink: "https://scratch.mit.edu/projects/287920173/",
					solutionLink: "https://scratch.mit.edu/projects/287887351/"
				},
				{
					title: "Event Listeners: Fluency Drill",
					content:
						"Repeat the core ideas from GS2 Event Listeners on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "GS3 Pen with Event Listeners",
			curriculum: [
				{
					title: "Pen extension introduction",
					content:
						"Show how to add the Pen extension in Scratch. Explain that the Pen down block makes the sprite draw, Pen up stops drawing, Erase all clears drawings and Change color changes the pen color."
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
					content:
						"Extend the work from GS3 Pen with Event Listeners with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink: "https://scratch.mit.edu/projects/313084455/",
					solutionLink: "https://scratch.mit.edu/projects/287952358/"
				},
				{
					title: "Pen with Event Listeners: Fluency Drill",
					content:
						"Repeat the core ideas from GS3 Pen with Event Listeners on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "GS4 Loops",
			curriculum: [
				{
					title: "Introduction to loops",
					content:
						'Explain that loops are used to repeat code blocks. Show the Repeat and Forever blocks. Demonstrate how loops can control a sprite\'s movement by repeating "move" and "turn" instructions.'
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
						'This project uses the Music extension. When the green flag is clicked, play the song "Hot Cross Buns" twice:\n\nE D C E D C C C C C D D D D E D C.\n\nUse loops for repeated sections. Compose other songs as an extension.',
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
						"Repeat the core ideas from GS4 Loops on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "GS5 Basic Conditionals",
			curriculum: [
				{
					title: "Introducing conditionals",
					content:
						'Explain that conditionals let a program make decisions. Discuss real-life examples of conditions. Show the "if … then" block and sensing blocks like "touching mouse pointer", "key right arrow pressed" and "touching color ___". Emphasize that conditionals need to be inside a forever loop.'
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
						'1. When the green flag is clicked, make the ball bounce around the screen forever.\n2. Use a conditional so that when the bell touches the ball, the bell swings back and forth and rings four times.\n3. When the ball touches lightning, make the lightning strike the ground and play a thunder sound, then return the lightning to the cloud. (Introduce the "go to [sprite]" block.)\n4. When the chick touches the ball, make the chick move 5 steps and chirp.',
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
				}
			]
		},
		{
			title: "GS6 Advanced Conditionals",
			curriculum: [
				{
					title: "Conditionals: if/then/else",
					content:
						'Explain that "if … then … else" allows multiple outcomes. Discuss real-life examples of decisions with two possible results. Introduce the "if … then … else" block and demonstrate how it can be used to choose between two actions.',
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
					content:
						"Close GS6 Advanced Conditionals by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
				}
			]
		},
		{
			title: "GS7 User Input",
			curriculum: [
				{
					title: "Getting user input",
					content:
						'Explain that event listeners respond to button presses, but sometimes we want to respond to text typed by the user. Introduce the "ask ___ and wait" block and the "answer" variable. Show how to use the equality (=) block to compare the user\'s answer to a correct value and how to use < and > blocks to compare numbers.'
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
						"1. Ask the user if they want to build a shop, plant a tree or explore the island.\n2. Use the answer to determine which event occurs.\n3. Ask the user yes/no questions to further customize the experience.\n4. Use variables to store items collected or tasks completed.\n5. Encourage the user to explore and discover secrets.",
					projectLink: "https://scratch.mit.edu/projects/330320360/",
					solutionLink: "https://scratch.mit.edu/projects/330316142/"
				},
				{
					title: "GS7 Supplemental Project 2 – Space Cadets",
					content:
						'1. Ask the user for their name and call them "Captain".\n2. Ask which planet (Mars, Jupiter or Saturn) they want to explore.\n3. Use conditionals to set the scene for the chosen planet.\n4. Ask additional questions (e.g., "Do you want to collect rocks or search for life?") and branch the story based on the answers.\n5. Use variables to track discoveries or points.',
					projectLink: "https://scratch.mit.edu/projects/330321409/",
					solutionLink: "https://scratch.mit.edu/projects/330316808/"
				}
			]
		},
		{
			title: "GS8 X & Y Coordinates",
			curriculum: [
				{
					title: "Introduction to X & Y coordinates",
					content:
						'Explain the coordinate plane in Scratch. The X-axis goes left and right; the Y-axis goes up and down. Show how to use "go to x: ___ y: ___" and "glide ___ secs to x: ___ y: ___" blocks. Discuss how sprites can be positioned at specific coordinates.'
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
						"1. Using the Pen extension, draw a picture by moving the sprite to various X and Y coordinates.\n2. Allow the user to enter coordinates to draw their own shapes.\n3. Encourage drawing initials or simple pictures.",
					projectLink: "https://scratch.mit.edu/projects/330291711/",
					solutionLink: "https://scratch.mit.edu/projects/330288612/"
				}
			]
		},
		{
			title: "GS9 Variables",
			curriculum: [
				{
					title: "Introducing variables",
					content:
						'Explain that variables store information such as scores, timers or other values. Show how to make a variable in Scratch and demonstrate the "set [variable] to" and "change [variable] by" blocks. Use a loop for the cat to count from 1 to 10. Ask how to count backwards. Discuss customizing variables.'
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
					content:
						"Close GS9 Variables by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
						"Previously we learned how to use conditional statements to do something if something else happens. However, we haven't learned how to make this work across different sprites. For example, we might want a sprite to say something once another sprite is done moving. In these situations, we use message broadcasting.\n\nOpen a new Scratch project. Have click on the Events section and look at the broadcast __ and when I receive __ blocks. Explain that broadcasting is a way that sprites can send each other messages to trigger or start certain parts of our code.\n\nUsing this project as a rough guide, show the how to make the ball start bouncing only after the cat is done talking."
				},
				{
					title: "GS10 Project 1 – Dance Off",
					content:
						"It's dancing time! Let's give each sprite a turn to \"perform\" on the stage.\n\n1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she's done, have her glide off to the right side of the stage.\n2. One by one, make each of the other dancers do the same thing. Can you add some clapping between each performer? We also need to be sure to make them start back on the left when the green flag is clicked!\n3. A dance party isn't very fun without music! Add some code to the backdrop so that it plays dancing music forever. When Champ is done dancing, broadcast a message that stops the music.\n4. Can you make it so that the lights change, too? How about some clapping once everyone is done?",
					projectLink: "https://scratch.mit.edu/projects/301002220/",
					solutionLink: "https://scratch.mit.edu/projects/300644693/"
				},
				{
					title: "GS10 Project 2 – Bowl Fill",
					content:
						'Let\'s make a game where you control a bowl and try to collect various items!\n\n1. Start by programming the bowl so that it can be controlled by the arrow keys once the green flag is clicked.\n2. When a sprite is touched by the bowl, make it broadcast a message (like "Cheese touched", for example).\n3. Think about what each sprite should do when it receives these messages. Should they move? Make a sound? What should the bowl do?\n4. Add variables to your program that keep track of the number of times each object has been collected.\n5. Add a timer that stops the game after 15 seconds. When the timer runs out, broadcast a message that makes all sprites on the screen do something (e.g., spin in a circle, grow and shrink, etc.).\n\nFinally, share the project!',
					projectLink: "https://scratch.mit.edu/projects/303008513/",
					solutionLink: "https://scratch.mit.edu/projects/302811491/"
				},
				{
					title: "Message Broadcasting: Verification and Reflection",
					content:
						"Close GS10 Message Broadcasting by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
				}
			]
		},
		{
			title: "GS11 Hedgehog Race",
			curriculum: [
				{
					title: "GS11 Project 1 – Hedgehog Race",
					content:
						"Let's put our skills to the test! Let's use what we've learned in the course to build this Hedgehog Race game.\n\nPlay through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\n\nCreate a comment in the project to write out the different steps of what we will need to code.\n\nStarter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.\n\nFinally, share the project!",
					projectLink: "https://scratch.mit.edu/projects/304551665/",
					solutionLink: "https://scratch.mit.edu/projects/305082197/"
				},
				{
					title: "Hedgehog Race: Debugging and Failure Modes",
					content:
						"Focus on the mistakes students are most likely to make in GS11 Hedgehog Race. Have them diagnose a broken attempt, repair it, and explain why the fix works. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Hedgehog Race: Planning and Architecture",
					content:
						"Break GS11 Hedgehog Race into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Hedgehog Race: Verification and Reflection",
					content:
						"Close GS11 Hedgehog Race by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "GS11 Supplemental Project 1 – Save the Wizard",
					content:
						"Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\n\nCreate a comment in the project to write out the different steps of what we will need to code.\n\nThe wizard has been turned into a frog! Help him collect potions while avoiding skeletons to turn back into a wizard.\n\n1. Let's start by working on our frog wizard! Make it so when the green flag is clicked, he goes to the center of the screen, changes his size and moves when the arrow keys are pressed.\n2. Next, let's make the skeleton move! We want the skeleton to go to a random position on the far right side of the screen and constantly move left. When it is touching the frog or the left edge, make it go back to the right side.\n3. Now do the same thing to the potion. If you want to make the game more challenging, make the potion wait a few seconds before appearing on the right again. (Hint: you'll need to use show/hide blocks).\n4. Our frog needs to be able to level up and down in order to win or lose the game. Start by making a variable to keep track of the level and set it to 1 when the green flag is clicked.\n5. Make message broadcasts for leveling up and down. When they level up, if they are at level 4, they win the game. Otherwise, increase their level by 1, switch the costume and increase the size. When they level down, if they are at level 1, they lose the game. Otherwise, decrease their level by 1, switch the costume and decrease the size.\n6. Make sure to broadcast the level-up/level-down messages when the skeletons or potion touch the frog.\n7. Feel free to add another skeleton to make the game more difficult.\n8. Add sound effects and backdrop changes for the finishing touches!",
					projectLink: "https://scratch.mit.edu/projects/332395747/",
					solutionLink: "https://scratch.mit.edu/projects/330724703/"
				},
				{
					title: "Hedgehog Race: Fluency Drill",
					content:
						"Repeat the core ideas from GS11 Hedgehog Race on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "GS12 Asteroid Dodge",
			curriculum: [
				{
					title: "GS12 Project 1 – Asteroid Dodge",
					content:
						"Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?\n\nCreate a comment in the project to write out the different steps of what we will need to code.\n\nStarter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.\n\nFinally, share the project!",
					projectLink: "https://scratch.mit.edu/projects/303001451/",
					solutionLink: "https://scratch.mit.edu/projects/302948550/"
				},
				{
					title: "Asteroid Dodge: Debugging and Failure Modes",
					content:
						"Focus on the mistakes students are most likely to make in GS12 Asteroid Dodge. Have them diagnose a broken attempt, repair it, and explain why the fix works. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Asteroid Dodge: Planning and Architecture",
					content:
						"Break GS12 Asteroid Dodge into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Asteroid Dodge: Verification and Reflection",
					content:
						"Close GS12 Asteroid Dodge by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Asteroid Dodge: Extension Challenge",
					content:
						"Extend the work from GS12 Asteroid Dodge with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink: "https://scratch.mit.edu/projects/303001451/",
					solutionLink: "https://scratch.mit.edu/projects/302948550/"
				},
				{
					title: "Asteroid Dodge: Fluency Drill",
					content:
						"Repeat the core ideas from GS12 Asteroid Dodge on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
						"Once it's complete, prepare a simple project summary explaining how the game was programmed, which sprites and variables were used, and what problems were solved along the way.\n\nTreat this as a short reflection on the design process and the finished result."
				},
				{
					title: "Course recap",
					content:
						"We've learned a lot over these past few months! Can you recap the different topics we learned in this course?\n\nHelp compile a list of coding concepts learned through Scratch. It might be helpful to look back at the module titles or code from previous projects created.\n\nIf any are missing, make sure the list includes conditionals, XY coordinates, variables, event listeners and loops."
				},
				{
					title: "Optional Extra Practice – Typing Games",
					content:
						"This optional section is for those transitioning from Scratch Level 1 into Python Level 1.\n\nThe purpose of this section is to prepare for the shift from block-based to text-based coding and to strengthen typing and computer literacy skills. These typing games are optional and do not need to be completed in full. Choose games that feel useful, spend about 15 to 20 minutes practicing as needed, and move to the intermediate options if the beginner games feel too easy.\n\nOne of the biggest differences between Python and Scratch is that we'll need to type our code out rather than using blocks. Let's play a few games to practice typing as we prepare ourselves to write Python code.\n\nBeginner Typing Games:\n• Practice with the Keyboard – Typing Letters: https://scratch.mit.edu/projects/214833806/\n• Practice with the Keyboard – Typing Numbers: https://scratch.mit.edu/projects/214828609/\n• Practice with the Keyboard – Typing Letters Race: https://www.nitrotype.com/\n\nIntermediate Typing Games:\n• Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game\n• Ghost Typing: https://www.abcya.com/games/ghost_typing\n• Koala Paddleboards (spelling and typing practice): https://www.abcya.com/games/spelling_practice\n\nAdvanced Typing Games:\n• Typing Rocket: https://www.abcya.com/games/typing_rocket\n• Type Racer: https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer"
				}
			],
			supplementalProjects: [
				{
					title: "GS13 Master Project: Extension Challenge",
					content:
						"Extend the work from GS13 Master Project with a tighter constraint, one extra feature, or a slightly more realistic input case. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				},
				{
					title: "GS13 Master Project: Fluency Drill",
					content:
						"Repeat the core ideas from GS13 Master Project on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			]
		},
		{
			title: "Applied Studio 14: Scratch studio",
			curriculum: [
				{
					title: "Scratch studio: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: Scratch studio, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: Scratch studio, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: Scratch studio. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "Scratch studio: Review and Reflection",
					content:
						"Close Applied Studio 14: Scratch studio by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Scratch studio: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: Scratch studio with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 14: Scratch studio. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 15: Scratch studio",
			curriculum: [
				{
					title: "Scratch studio: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: Scratch studio, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: Scratch studio, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: Scratch studio. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "Scratch studio: Review and Reflection",
					content:
						"Close Applied Studio 15: Scratch studio by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Scratch studio: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: Scratch studio with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 15: Scratch studio. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 16: Scratch studio",
			curriculum: [
				{
					title: "Scratch studio: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: Scratch studio, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: Scratch studio, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: Scratch studio. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "Scratch studio: Review and Reflection",
					content:
						"Close Applied Studio 16: Scratch studio by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Scratch studio: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: Scratch studio with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 16: Scratch studio. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 17: Scratch studio",
			curriculum: [
				{
					title: "Scratch studio: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: Scratch studio, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: Scratch studio, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: Scratch studio. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "Scratch studio: Review and Reflection",
					content:
						"Close Applied Studio 17: Scratch studio by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Scratch studio: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: Scratch studio with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Scratch studio: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 17: Scratch studio. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		}
	]
};
