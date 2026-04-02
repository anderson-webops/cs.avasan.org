import type { RawCourse } from "./types";

export const scratchLevel1Course: RawCourse = {
	name: "Scratch Level 1",
	modules: [
		{
			title: "GS1 Starting in Scratch",
			curriculum: [
				{
					title: "Scratch basics",
					content: `Create a Scratch account and explore the code blocks. Learn how the stage and sprites work, and experiment with the green flag to start scripts.`
				},
				{
					title: "Project 1 – Hungry Hippo",
					projectLink: "https://scratch.mit.edu/projects/304003593/",
					solutionLink: "https://scratch.mit.edu/projects/313184786/",
					content: `
• Play a sample Hungry Hippo game.
• Create a custom version of the game using a sprite of your choice.
• Make the sprite move using the left, right, up and down arrow keys (use the "point in direction" and "move 10 steps" blocks).
• Decide which module to start in based on understanding of the controls.
• Program the sprite to collect objects and increase its score each time it collects one.
• Create variables for "score" and a timer; increase the score when objects are collected and decrease time as the game runs.
`
				}
			],
			supplementalProjects: []
		},
		{
			title: "GS2 Event Listeners",
			curriculum: [
				{
					title: "Basic event listeners",
					content: `Introduce the concept of event listeners (blocks that wait for something to happen). Show the "when green flag clicked" and "when arrow key pressed" events. Demonstrate how event listeners start scripts when specific keys are pressed.`
				},
				{
					title: "Project 1 – Spinner",
					projectLink: "https://scratch.mit.edu/projects/287920173/",
					solutionLink: "https://scratch.mit.edu/projects/287887351/",
					content: `
It's time to build a fun spinner:

1. When the green flag is clicked, make the arrow point to the right.
2. When the up, left, right or down arrow keys are pressed, point the arrow in the corresponding direction.
3. When the "A" key is pressed, turn the arrow 15 degrees to the left.
4. When the "D" key is pressed, turn the arrow 15 degrees to the right.
5. When the spacebar is pressed, make the arrow point towards the mouse.
`
				},
				{
					title: "Project 2 – Bouncy Ball Room",
					projectLink: "https://scratch.mit.edu/projects/287924505/",
					solutionLink: "https://scratch.mit.edu/projects/287922077/",
					content: `
1. When the green flag is clicked, have the ball go to a random position.
2. When the space key is pressed, make the ball move 10 steps and bounce off the edge.
3. When the right-arrow key is pressed, change the backdrop.
4. When the up or down arrows are pressed, make the ball grow or shrink (use negative numbers for shrinking).
5. When the ball is clicked, play a sound and change its color.
`
				},
				{
					title: "Project 3 – Dragonfly Events",
					projectLink: "https://scratch.mit.edu/projects/287707460/",
					solutionLink: "https://scratch.mit.edu/projects/284408078/",
					content: `
1. When the green flag is clicked, move the dragonfly to a random spot.
2. Use the arrow keys to move the dragonfly 20 steps.
3. When the dragonfly is clicked, change its color.
4. When the space bar is pressed, play a pop sound.
5. When the "1" key is pressed, make the dragonfly pop and go to a random position.
6. When the "2" key is pressed, have the dragonfly say something.
7. When the "3" key is pressed, change the background.
Challenge: Add another sprite controlled by the W-A-S-D keys.
`
				}
			],
			supplementalProjects: []
		},
		{
			title: "GS3 Pen with Event Listeners",
			curriculum: [
				{
					title: "Pen extension introduction",
					content: `Show how to add the Pen extension in Scratch. Explain that the Pen down block makes the sprite draw, Pen up stops drawing, Erase all clears drawings and Change color changes the pen color.`
				},
				{
					title: "Project 1 – Bouncy Ball with Pen",
					projectLink: "https://scratch.mit.edu/projects/313084455/",
					solutionLink: "https://scratch.mit.edu/projects/287952358/",
					content: `
1. When the green flag is clicked, send the ball to a random position.
2. When the spacebar is pressed, make the ball move 10 steps and bounce off the edge.
3. Each time the ball moves, put the pen down so the ball leaves a trail.
4. Each time the ball moves, change the pen color.
5. When the green flag is clicked, erase any existing drawings and lift the pen up before moving the ball to a random position.

`
				},
				{
					title: "Project 2 – Stencil Pencil",
					projectLink: "https://scratch.mit.edu/projects/287738652/",
					solutionLink: "https://scratch.mit.edu/projects/285312799/",
					content: `
1. The up arrow moves the pencil forward; the down arrow moves it backward.
2. The left arrow rotates the pencil 10 degrees left; the right arrow rotates it 10 degrees right.
3. Pressing "1" lowers the pen (start drawing).
4. Pressing "2" lifts the pen (stop drawing).
5. Clicking the pencil changes its pen color.
6. Pressing "3" increases the pen size; pressing "4" decreases the pen size.
7. When the green flag is clicked, erase all drawings, move the pencil back to the middle of the stage facing right and reset the pen size/color.

Challenge: Trace shapes on other backdrops.

`
				},
				{
					title: "Project 3 – Beetle Artist",
					projectLink: "https://scratch.mit.edu/projects/288003770/",
					solutionLink: "https://scratch.mit.edu/projects/287999903/",
					content: `
1. Use the arrow keys to move the beetle 10 steps.
2. When the green flag is clicked, erase all drawings.
3. Press "1" to draw a square.
4. Press "2" to draw a triangle.
5. Press "3" to draw an arrow shape.
Challenge: Trace shapes on other backdrops.
`
				}
			],
			supplementalProjects: []
		},
		{
			title: "GS4 Loops",
			curriculum: [
				{
					title: "Introduction to loops",
					content: `Explain that loops are used to repeat code blocks. Show the Repeat and Forever blocks. Demonstrate how loops can control a sprite's movement by repeating "move" and "turn" instructions.`
				},
				{
					title: "Project 1 – Elephant Effects",
					projectLink: "https://scratch.mit.edu/projects/291122885/",
					solutionLink: "https://scratch.mit.edu/projects/291119943/",
					content: `
1. When the "1" key is pressed, grow the elephant ten times (increase size by 10, ten times).
2. When the "2" key is pressed, shrink the elephant ten times.
3. When the "3" key is pressed, change the elephant's color effect forever.
4. When the "4" key is pressed, change a different graphic effect forever.
5. When the "5" key is pressed, hide the elephant, wait one second, then show it again (repeat this sequence).
6. When the space bar is pressed, switch the costume, play a sound and then switch back to the original costume, repeating the whole sequence three times.
`
				},
				{
					title: "Project 2 – Hot Cross Buns",
					projectLink: "https://scratch.mit.edu/projects/291117784/",
					solutionLink: "https://scratch.mit.edu/projects/291115434/",
					content: `
This project uses the Music extension. When the green flag is clicked, play the song "Hot Cross Buns" twice:

E D C E D C C C C C D D D D E D C.

Use loops for repeated sections. Compose other songs as an extension.
`
				},
				{
					title: "Project 3 – Drawing Mouse",
					projectLink: "https://scratch.mit.edu/projects/289744824/",
					solutionLink: "https://scratch.mit.edu/projects/289445069/",
					content: `
1. Add an event listener so that when the green flag is clicked, all drawings are erased.
2. When the "1" key is pressed, make the mouse draw a square using a loop at a random location.
3. When the "2" key is pressed, make the mouse draw a triangle.
4. When the "3" key is pressed, make the mouse draw a circle (explain that a circle can be drawn by repeating many small steps that turn in small increments to total 360 degrees).
Challenge: Create other shapes, like an octagon or a star, possibly adding random sizes and colors.
`
				}
			],
			supplementalProjects: [
				{
					title: "GS4 Supplemental Project 1 – Shapify",
					projectLink: "https://scratch.mit.edu/projects/330468686/",
					solutionLink: "https://scratch.mit.edu/projects/330429172/",
					content: `
1. Use Pen blocks to draw a hexagon. (Hint: divide 360 degrees by the number of sides.)
2. Use the same method to draw an octagon, a decagon, a dodecagon and a circle.
3. Predict what happens if the loop around the circle is replaced with a forever loop, and then try it.
Challenge: Draw a different circle using different numbers.`
				}
			]
		},
		{
			title: "GS5 Basic Conditionals",
			curriculum: [
				{
					title: "Introducing conditionals",
					content: `Explain that conditionals let a program make decisions. Discuss real-life examples of conditions. Show the "if … then" block and sensing blocks like "touching mouse pointer", "key right arrow pressed" and "touching color ___". Emphasize that conditionals need to be inside a forever loop.`
				},
				{
					title: "Project 1 – Dino's Colors",
					projectLink: "https://scratch.mit.edu/projects/291223299/",
					solutionLink: "https://scratch.mit.edu/projects/291220849/",
					content: `
1. Make the dinosaur follow the mouse pointer forever.
2. Use conditionals to make the dinosaur say "I'm in red!" when standing in red; similarly, add conditions for yellow, blue and grey.
`
				},
				{
					title: "Project 2 – Noisy Reactions",
					projectLink: "https://scratch.mit.edu/projects/291542721/",
					solutionLink: "https://scratch.mit.edu/projects/291530292/",
					content: `
1. When the green flag is clicked, make the ball bounce around the screen forever.
2. Use a conditional so that when the bell touches the ball, the bell swings back and forth and rings four times.
3. When the ball touches lightning, make the lightning strike the ground and play a thunder sound, then return the lightning to the cloud. (Introduce the "go to [sprite]" block.)
4. When the chick touches the ball, make the chick move 5 steps and chirp.
`
				},
				{
					title: "Project 3 – Magic Wand",
					projectLink: "https://scratch.mit.edu/projects/304279087/",
					solutionLink: "https://scratch.mit.edu/projects/304279316/",
					content: `
1. Make a magic wand move to the frog and turn it into a wizard.
2. Make the wand move to the piano and play three notes (any instrument/notes are fine).
3. Make the wand move to the ghost and send the ghost toward the star.
4. When the ghost touches the star, make the star grow to fill the screen.
`
				}
			],
			supplementalProjects: [
				{
					title: "GS5 Supplemental Project 1 – Camouflaging Octopus",
					projectLink: "https://scratch.mit.edu/projects/326209430/",
					solutionLink: "https://scratch.mit.edu/projects/326209241/",
					content: `
1. Use event listeners to control the octopus with the arrow keys.
2. Use conditionals so the octopus turns blue when on a blue background.
3. Add conditionals for yellow, green and red backgrounds.`
				},
				{
					title: "GS5 Supplemental Project 2 – Playing Catch",
					projectLink: "https://scratch.mit.edu/projects/326211768/",
					solutionLink: "https://scratch.mit.edu/projects/326211724/",
					content: `
1. When the green flag is clicked, make the basketball go to Gobo and move forever.
2. When Pico has the ball, use conditionals to pass it back to Gobo.
3. When Gobo has the ball, pass it to Pico.
Challenge: Add more sprites to the game and have the ball pass between them.`
				}
			]
		},
		{
			title: "GS6 Advanced Conditionals",
			curriculum: [
				{
					title: "Conditionals: if/then/else",
					projectLink: "https://scratch.mit.edu/projects/293372295/",
					solutionLink: "https://scratch.mit.edu/projects/293366003/",
					content: `
Explain that "if … then … else" allows multiple outcomes. Discuss real-life examples of decisions with two possible results. Introduce the "if … then … else" block and demonstrate how it can be used to choose between two actions.`
				},
				{
					title: "Project 1 – Dino's Colors II",
					projectLink: "https://scratch.mit.edu/projects/293788691/",
					solutionLink: "https://scratch.mit.edu/projects/293787944/",
					content: `
1. Create controls for the dinosaur using the arrow keys.
2. When the "b" key is pressed, have the dinosaur say "Move me to blue!" for 2 seconds.
3. After speaking, use an if/then/else to check if the dinosaur is touching blue; if it is, say "Good job!", otherwise say "This isn't the right color!".
4. Repeat the previous step for the "r" (red) and "y" (yellow) keys.
5. Add sounds and costume changes for each color.

`
				},
				{
					title: "Project 2 – Hungry Dinosaur",
					projectLink: "https://scratch.mit.edu/projects/293457751/",
					solutionLink: "https://scratch.mit.edu/projects/293291715/",
					content: `
1. When the green flag is clicked, use if/then blocks to control the dinosaur with the arrow keys.
2. When the space bar is pressed, the dinosaur attempts to eat bananas: if it is touching bananas, change the dinosaur's costume, play a sound or otherwise show the bananas being eaten; if not touching bananas, say "There aren't any bananas here!".
3. When the space bar is pressed, if the bananas are touching the dinosaur, wait one second then move the bananas to a random location; otherwise have the bananas say "I'm over here!".
`
				}
			],
			supplementalProjects: [
				{
					title: "GS6 Supplemental Project 1 – Blast Off Rocketship",
					projectLink: "https://scratch.mit.edu/projects/332463981/",
					solutionLink: "https://scratch.mit.edu/projects/332459692/",
					content: `
1. When the green flag is clicked, start the rocketship at the center bottom of the stage.
2. If the user clicks the mouse, make the rocketship move up 5 steps; otherwise, it goes down 5 steps (always pointing upward).
3. When the rocketship reaches the star, make it blast off using sounds, motion or visual effects.`
				},
				{
					title: "GS6 Supplemental Project 2 – Baby Fish",
					projectLink: "https://scratch.mit.edu/projects/332468797/",
					solutionLink: "https://scratch.mit.edu/projects/332464646/",
					content: `
1. When the green flag is clicked, make the baby fish continuously go to the mouse pointer.
2. If the baby fish is touching the mom fish, make it say "I found her"; otherwise say "Take me to my mom".
3. Make the mom fish glide around the screen randomly.`
				}
			]
		},
		{
			title: "GS7 User Input",
			curriculum: [
				{
					title: "Getting user input",
					content: `Explain that event listeners respond to button presses, but sometimes we want to respond to text typed by the user. Introduce the "ask ___ and wait" block and the "answer" variable. Show how to use the equality (=) block to compare the user's answer to a correct value and how to use < and > blocks to compare numbers.`
				},
				{
					title: "Project 1 – Math Facts",
					projectLink: "https://scratch.mit.edu/projects/295332936/",
					solutionLink: "https://scratch.mit.edu/projects/294539961/",
					content: `
1. When the "1" key is pressed, have Gobo ask a math question (e.g., "What's 9 – 7?"). Indicate whether the answer is correct or incorrect via costume, sound or speech.
2. When the "2" key is pressed, have Gobo ask a question like "What's a number less than 0?" and indicate whether the answer is correct or incorrect.
3. When the "3" key is pressed, have Gobo ask a harder math question and allow the user to keep answering until the answer is correct. If the answer is too low, Gobo should say "Higher!"; if too high, say "Lower!".`
				},
				{
					title: "Project 2 – Fortune Teller",
					projectLink: "https://scratch.mit.edu/projects/295333590/",
					solutionLink: "https://scratch.mit.edu/projects/294540150/",
					content: `
1. When the green flag is clicked, play an introduction and ask the user their name.
2. Ask the user "What do you want to know? (Type Love, Money, or Friendship)".
3. Use conditionals to give a fortune based on the user's input.
4. Ask another question such as "Choose a number between 1 and 5" and use conditionals to provide a response.
Challenge: Add more fortunes and questions to make the fortune teller more detailed.`
				},
				{
					title: "Project 3 – Number Guesser",
					projectLink: "https://scratch.mit.edu/projects/295335247/",
					solutionLink: "https://scratch.mit.edu/projects/294541979/",
					content: `
1. When the green flag is clicked, have the sprite choose a random number between 1 and 20.
2. Ask the user to guess the number.
3. Use if/then/else blocks to tell the user if their guess is too high or too low.
4. Allow the user to keep guessing until they get the number right.
Challenge: Add a counter for the number of guesses and congratulate the player if they guess the number in fewer than 5 tries.`
				}
			],
			supplementalProjects: [
				{
					title: "GS7 Supplemental Project 1 – Animal Crossing",
					projectLink: "https://scratch.mit.edu/projects/330320360/",
					solutionLink: "https://scratch.mit.edu/projects/330316142/",
					content: `
1. Ask the user if they want to build a shop, plant a tree or explore the island.
2. Use the answer to determine which event occurs.
3. Ask the user yes/no questions to further customize the experience.
4. Use variables to store items collected or tasks completed.
5. Encourage the user to explore and discover secrets.`
				},
				{
					title: "GS7 Supplemental Project 2 – Space Cadets",
					projectLink: "https://scratch.mit.edu/projects/330321409/",
					solutionLink: "https://scratch.mit.edu/projects/330316808/",
					content: `
1. Ask the user for their name and call them "Captain".
2. Ask which planet (Mars, Jupiter or Saturn) they want to explore.
3. Use conditionals to set the scene for the chosen planet.
4. Ask additional questions (e.g., "Do you want to collect rocks or search for life?") and branch the story based on the answers.
5. Use variables to track discoveries or points.`
				}
			]
		},
		{
			title: "GS8 X & Y Coordinates",
			curriculum: [
				{
					title: "Introduction to X & Y coordinates",
					content: `Explain the coordinate plane in Scratch. The X-axis goes left and right; the Y-axis goes up and down. Show how to use "go to x: ___ y: ___" and "glide ___ secs to x: ___ y: ___" blocks. Discuss how sprites can be positioned at specific coordinates.`
				},
				{
					title: "Project 1 – Bug Eater",
					projectLink: "https://scratch.mit.edu/projects/302997680/",
					solutionLink: "https://scratch.mit.edu/projects/302865707/",
					content: `
1. When the green flag is clicked, make the praying mantis appear at a random position.
2. When the mouse is clicked, make the mantis glide to the mouse pointer's X and Y position.
3. If the mantis touches a bug, broadcast a message to make the bug disappear and increase the score.
4. Use variables for the score and a timer.
5. End the game when the timer runs out and display the score.`
				},
				{
					title: "Project 2 – Cake Chaser",
					projectLink: "https://scratch.mit.edu/projects/302998723/",
					solutionLink: "https://scratch.mit.edu/projects/302865909/",
					content: `
1. Set up two sprites: a person and a slice of cake.
2. Use the arrow keys to move the person around the stage.
3. Make the cake appear at random X and Y coordinates.
4. When the person touches the cake, play a sound, move the cake to a new random location and increase the score.
5. Add a timer that counts down and ends the game when it reaches zero.`
				},
				{
					title: "Project 3 – Talent Show",
					projectLink: "https://scratch.mit.edu/projects/302999957/",
					solutionLink: "https://scratch.mit.edu/projects/302866259/",
					content: `
1. Choose three performers (sprites).
2. When the green flag is clicked, have each performer go to their starting position using X and Y coordinates.
3. Use broadcast messages to make each performer do an act in sequence (dance, jump or play an instrument).
4. After the performances, have all performers bow together.`
				}
			],
			supplementalProjects: [
				{
					title: "GS8 Supplemental Project 1 – Quadrant Practice",
					projectLink: "https://scratch.mit.edu/projects/330290958/",
					solutionLink: "https://scratch.mit.edu/projects/330287678/",
					content: `
1. Use the arrow keys to move a sprite to each quadrant of the stage.
2. When the sprite reaches a quadrant, display a message such as "I'm in Quadrant I".
3. Challenge: Add shapes or obstacles that must be avoided.`
				},
				{
					title: "GS8 Supplemental Project 2 – Coordinate Drawings",
					projectLink: "https://scratch.mit.edu/projects/330291711/",
					solutionLink: "https://scratch.mit.edu/projects/330288612/",
					content: `
1. Using the Pen extension, draw a picture by moving the sprite to various X and Y coordinates.
2. Allow the user to enter coordinates to draw their own shapes.
3. Encourage drawing initials or simple pictures.`
				}
			]
		},
		{
			title: "GS9 Variables",
			curriculum: [
				{
					title: "Introducing variables",
					content: `Explain that variables store information such as scores, timers or other values. Show how to make a variable in Scratch and demonstrate the "set [variable] to" and "change [variable] by" blocks. Use a loop for the cat to count from 1 to 10. Ask how to count backwards. Discuss customizing variables.`
				},
				{
					title: "Project 1 – Speed Click",
					projectLink: "https://scratch.mit.edu/projects/302996579/",
					solutionLink: "https://scratch.mit.edu/projects/302864606/",
					content: `
1. When the green flag is clicked, create a timer variable and set it to 20.
2. Make a target sprite (e.g., a button) appear in random positions.
3. Each time the target is clicked, increase a score variable by 1.
4. Decrease the timer by 1 every second; when the timer reaches zero, stop the game and display the final score.
5. Consider adding a high-score variable.`
				},
				{
					title: "Project 2 – Spider Smash",
					projectLink: "https://scratch.mit.edu/projects/302996964/",
					solutionLink: "https://scratch.mit.edu/projects/302865093/",
					content: `
1. When the green flag is clicked, have spiders appear at random positions and move downward.
2. When a spider is clicked, hide it, play a sound and increase the score.
3. Create a timer that counts down; end the game when it reaches zero.
4. Optionally increase difficulty by speeding up the spiders over time.`
				}
			],
			supplementalProjects: [
				{
					title: "GS9 Supplemental Project 1 – Counting Steps",
					projectLink: "https://scratch.mit.edu/projects/330293454/",
					solutionLink: "https://scratch.mit.edu/projects/330289893/",
					content: `
1. Use the arrow keys to move a sprite around the stage.
2. Make a variable called "steps" that increases each time the sprite moves.
3. Display the number of steps taken.
4. Challenge: Add obstacles and a goal to reach.`
				},
				{
					title: "GS9 Supplemental Project 2 – Hungry Crab",
					projectLink: "https://scratch.mit.edu/projects/330294193/",
					solutionLink: "https://scratch.mit.edu/projects/330290622/",
					content: `
1. Control a crab with the arrow keys.
2. Create a variable called "food" and increase it each time the crab eats a piece of food.
3. Add a timer; when time runs out, end the game and display how much food was collected.`
				},
				{
					title: "GS9 Supplemental Project 3 – Lunch Money",
					projectLink: "https://scratch.mit.edu/projects/330294909/",
					solutionLink: "https://scratch.mit.edu/projects/330291357/",
					content: `
1. Start with a variable "money" set to 10.
2. Ask the user what they want to buy for lunch (e.g., pizza, sandwich or salad) and subtract the cost from the money variable.
3. If the user can't afford an item, display a message.
4. Allow them to continue buying until the money runs out.`
				}
			]
		},
		{
			title: "GS10 Message Broadcasting",
			curriculum: [
				{
					title: "Message broadcasting",
					content: `Previously we learned how to use conditional statements to do something if something else happens. However, we haven't learned how to make this work across different sprites. For example, we might want a sprite to say something once another sprite is done moving. In these situations, we use message broadcasting.

Open a new Scratch project. Have click on the Events section and look at the broadcast __ and when I receive __ blocks. Explain that broadcasting is a way that sprites can send each other messages to trigger or start certain parts of our code.

Using this project as a rough guide, show the how to make the ball start bouncing only after the cat is done talking.`
				},
				{
					title: "GS10 Project 1 – Dance Off",
					projectLink: "https://scratch.mit.edu/projects/301002220/",
					solutionLink: "https://scratch.mit.edu/projects/300644693/",
					content: `
It's dancing time! Let's give each sprite a turn to "perform" on the stage.

1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she's done, have her glide off to the right side of the stage.
2. One by one, make each of the other dancers do the same thing. Can you add some clapping between each performer? We also need to be sure to make them start back on the left when the green flag is clicked!
3. A dance party isn't very fun without music! Add some code to the backdrop so that it plays dancing music forever. When Champ is done dancing, broadcast a message that stops the music.
4. Can you make it so that the lights change, too? How about some clapping once everyone is done?

`
				},
				{
					title: "GS10 Project 2 – Bowl Fill",
					projectLink: "https://scratch.mit.edu/projects/303008513/",
					solutionLink: "https://scratch.mit.edu/projects/302811491/",
					content: `
Let's make a game where you control a bowl and try to collect various items!

1. Start by programming the bowl so that it can be controlled by the arrow keys once the green flag is clicked.
2. When a sprite is touched by the bowl, make it broadcast a message (like "Cheese touched", for example).
3. Think about what each sprite should do when it receives these messages. Should they move? Make a sound? What should the bowl do?
4. Add variables to your program that keep track of the number of times each object has been collected.
5. Add a timer that stops the game after 15 seconds. When the timer runs out, broadcast a message that makes all sprites on the screen do something (e.g., spin in a circle, grow and shrink, etc.).

Finally, share the project!`
				}
			],
			supplementalProjects: [
				{
					title: "GS10 Supplemental Project 1 – Magical Quest",
					projectLink: "https://scratch.mit.edu/projects/330301165/",
					solutionLink: "https://scratch.mit.edu/projects/328309254/",
					content: `

Design your own play, and use the broadcast blocks to set up the scene changes and dialogue between characters!

1. Come up with a story that involves 3-4 characters and scenes. You can use movies or your real life as inspiration!
2. Add the sprites and backdrops you will need to your project.
3. Make your story come to life! Broadcast messages between your sprites to make sure everything happens in the correct sequence.`
				},
				{
					title: "GS10 Supplemental Project 2 – Cartoon Crash",
					projectLink: "https://scratch.mit.edu/projects/330302209/",
					solutionLink: "https://scratch.mit.edu/projects/328312475/",
					content: `
Pick a partner for Dani to play with, and they will bounce around the screen together!

1. When the green flag is clicked, set up the Start button in the correct position and have Dani explain the instructions.
2. When the Start button is clicked, set up the sprites in the correct positions.
3. Program each sprite so that if it is chosen (i.e., clicked on), it bounces around the room with Dani! If it is not chosen, it should also react appropriately.`
				}
			]
		},
		{
			title: "GS11 Hedgehog Race",
			curriculum: [
				{
					title: "GS11 Project 1 – Hedgehog Race",
					projectLink: "https://scratch.mit.edu/projects/304551665/",
					solutionLink: "https://scratch.mit.edu/projects/305082197/",
					content: `
Let's put our skills to the test! Let's use what we've learned in the course to build this Hedgehog Race game.

Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.

Finally, share the project!`
				}
			],
			supplementalProjects: [
				{
					title: "GS11 Supplemental Project 1 – Save the Wizard",
					projectLink: "https://scratch.mit.edu/projects/332395747/",
					solutionLink: "https://scratch.mit.edu/projects/330724703/",
					content: `
Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

The wizard has been turned into a frog! Help him collect potions while avoiding skeletons to turn back into a wizard.

1. Let's start by working on our frog wizard! Make it so when the green flag is clicked, he goes to the center of the screen, changes his size and moves when the arrow keys are pressed.
2. Next, let's make the skeleton move! We want the skeleton to go to a random position on the far right side of the screen and constantly move left. When it is touching the frog or the left edge, make it go back to the right side.
3. Now do the same thing to the potion. If you want to make the game more challenging, make the potion wait a few seconds before appearing on the right again. (Hint: you'll need to use show/hide blocks).
4. Our frog needs to be able to level up and down in order to win or lose the game. Start by making a variable to keep track of the level and set it to 1 when the green flag is clicked.
5. Make message broadcasts for leveling up and down. When they level up, if they are at level 4, they win the game. Otherwise, increase their level by 1, switch the costume and increase the size. When they level down, if they are at level 1, they lose the game. Otherwise, decrease their level by 1, switch the costume and decrease the size.
6. Make sure to broadcast the level-up/level-down messages when the skeletons or potion touch the frog.
7. Feel free to add another skeleton to make the game more difficult.
8. Add sound effects and backdrop changes for the finishing touches!`
				}
			]
		},
		{
			title: "GS12 Asteroid Dodge",
			curriculum: [
				{
					title: "GS12 Project 1 – Asteroid Dodge",
					projectLink: "https://scratch.mit.edu/projects/303001451/",
					solutionLink: "https://scratch.mit.edu/projects/302948550/",
					content: `
Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.

Finally, share the project!`
				}
			],
			supplementalProjects: []
		},
		{
			title: "GS13 Master Project",
			curriculum: [
				{
					title: "GS13 Project 1 – Master Project",
					content: `For your Master Project, you now have the skills and knowledge to design and build a game of your own! Spend some time brainstorming what kind of game to make, thinking about the past projects created and different elements to incorporate.

Once there is an idea, discuss the plan for programming the game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?`
				},
				{
					title: "Master Project Presentation",
					content: `Once it's complete, prepare a simple presentation about how the project was programmed and share the accomplishment with friends or family.

Another way to celebrate the project is by sharing it with friends or family.`
				},
				{
					title: "Course recap",
					content: `We've learned a lot over these past few months! Can you recap the different topics we learned in this course?

Help compile a list of coding concepts learned through Scratch. It might be helpful to look back at the module titles or code from previous projects created.

If any are missing, make sure the list includes conditionals, XY coordinates, variables, event listeners and loops.`
				},
				{
					title: "Optional Extra Practice – Typing Games",
					content: `This optional section is for those transitioning from Scratch Level 1 into Python Level 1.

The purpose of this section is to prepare for transitioning from block-based to text-based coding and to assess typing and computer literacy skills. If someone is advanced, has strong typing skills or is not taking a text-based programming language as their next course, you may skip this activity at your discretion. These typing games are optional and don\'t need to be all completed. Choose games that are interesting and move on once there has been 15-20 minutes of practice, or if the person is already a strong typist. Feel free to skip to the intermediate typing games if older than 6.

One of the biggest differences between Python and Scratch is that we'll need to type our code out rather than using blocks. Let's play a few games to practice typing as we prepare ourselves to write Python code.

Beginner Typing Games:
• Practice with the Keyboard – Typing Letters: https://scratch.mit.edu/projects/214833806/
• Practice with the Keyboard – Typing Numbers: https://scratch.mit.edu/projects/214828609/
• Practice with the Keyboard – Typing Letters Race: https://www.nitrotype.com/

Intermediate Typing Games:
• Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game
• Ghost Typing: https://www.abcya.com/games/ghost_typing
• Koala Paddleboards (spelling and typing practice): https://www.abcya.com/games/spelling_practice

Advanced Typing Games:
• Typing Rocket: https://www.abcya.com/games/typing_rocket
• Type Racer: https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer
`
				}
			],
			supplementalProjects: []
		}
	]
};
