import { defineStore } from "pinia";
import { computed } from "vue";

interface RawCourseModuleItem {
	title: string;
	content: string;
	projectLink?: string;
	solutionLink?: string;
	datasetLink?: string;
	mediaLink?: string;
}

interface RawCourseModule {
	title: string;
	curriculum: RawCourseModuleItem[];
	supplementalProjects: RawCourseModuleItem[];
}

interface RawCourse {
	name: string;
	modules: RawCourseModule[];
}

export interface CourseModuleItem extends RawCourseModuleItem {
	id: string;
}

export interface CourseModule {
	id: string;
	title: string;
	curriculum: CourseModuleItem[];
	supplementalProjects: CourseModuleItem[];
}

export interface CourseDefinition {
	id: string;
	name: string;
	modules: CourseModule[];
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036F]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

const HIDDEN_ITEM_TITLES = new Set([
	"session recap & assignment",
	"recap & assignment review"
]);

function shouldHideItem(title: string) {
	return HIDDEN_ITEM_TITLES.has(title.trim().toLowerCase());
}

function normalizeContent(content: string): string {
	const paragraphs = content
		.split(/\n{2,}/)
		.map(part => part.trim())
		.filter(Boolean)
		.filter(part => !/instructor note/i.test(part));
	return paragraphs
		.join("\n\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

const rawCourses: RawCourse[] = [
	{
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
						projectLink:
							"https://scratch.mit.edu/projects/304003593/",
						solutionLink:
							"https://scratch.mit.edu/projects/313184786/",
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
						projectLink:
							"https://scratch.mit.edu/projects/287920173/",
						solutionLink:
							"https://scratch.mit.edu/projects/287887351/",
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
						projectLink:
							"https://scratch.mit.edu/projects/287924505/",
						solutionLink:
							"https://scratch.mit.edu/projects/287922077/",
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
						projectLink:
							"https://scratch.mit.edu/projects/287707460/",
						solutionLink:
							"https://scratch.mit.edu/projects/284408078/",
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
						projectLink:
							"https://scratch.mit.edu/projects/313084455/",
						solutionLink:
							"https://scratch.mit.edu/projects/287952358/",
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
						projectLink:
							"https://scratch.mit.edu/projects/287738652/",
						solutionLink:
							"https://scratch.mit.edu/projects/285312799/",
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
						projectLink:
							"https://scratch.mit.edu/projects/288003770/",
						solutionLink:
							"https://scratch.mit.edu/projects/287999903/",
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
						projectLink:
							"https://scratch.mit.edu/projects/291122885/",
						solutionLink:
							"https://scratch.mit.edu/projects/291119943/",
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
						projectLink:
							"https://scratch.mit.edu/projects/291117784/",
						solutionLink:
							"https://scratch.mit.edu/projects/291115434/",
						content: `
This project uses the Music extension. When the green flag is clicked, play the song "Hot Cross Buns" twice:

E D C E D C C C C C D D D D E D C.

Use loops for repeated sections. Compose other songs as an extension.
`
					},
					{
						title: "Project 3 – Drawing Mouse",
						projectLink:
							"https://scratch.mit.edu/projects/289744824/",
						solutionLink:
							"https://scratch.mit.edu/projects/289445069/",
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
						projectLink:
							"https://scratch.mit.edu/projects/330468686/",
						solutionLink:
							"https://scratch.mit.edu/projects/330429172/",
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
						projectLink:
							"https://scratch.mit.edu/projects/291223299/",
						solutionLink:
							"https://scratch.mit.edu/projects/291220849/",
						content: `
1. Make the dinosaur follow the mouse pointer forever.
2. Use conditionals to make the dinosaur say "I'm in red!" when standing in red; similarly, add conditions for yellow, blue and grey.
`
					},
					{
						title: "Project 2 – Noisy Reactions",
						projectLink:
							"https://scratch.mit.edu/projects/291542721/",
						solutionLink:
							"https://scratch.mit.edu/projects/291530292/",
						content: `
1. When the green flag is clicked, make the ball bounce around the screen forever.
2. Use a conditional so that when the bell touches the ball, the bell swings back and forth and rings four times.
3. When the ball touches lightning, make the lightning strike the ground and play a thunder sound, then return the lightning to the cloud. (Introduce the "go to [sprite]" block.)
4. When the chick touches the ball, make the chick move 5 steps and chirp.
`
					},
					{
						title: "Project 3 – Magic Wand",
						projectLink:
							"https://scratch.mit.edu/projects/304279087/",
						solutionLink:
							"https://scratch.mit.edu/projects/304279316/",
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
						projectLink:
							"https://scratch.mit.edu/projects/326209430/",
						solutionLink:
							"https://scratch.mit.edu/projects/326209241/",
						content: `
1. Use event listeners to control the octopus with the arrow keys.
2. Use conditionals so the octopus turns blue when on a blue background.
3. Add conditionals for yellow, green and red backgrounds.`
					},
					{
						title: "GS5 Supplemental Project 2 – Playing Catch",
						projectLink:
							"https://scratch.mit.edu/projects/326211768/",
						solutionLink:
							"https://scratch.mit.edu/projects/326211724/",
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
						projectLink:
							"https://scratch.mit.edu/projects/293372295/",
						solutionLink:
							"https://scratch.mit.edu/projects/293366003/",
						content: `
Explain that "if … then … else" allows multiple outcomes. Discuss real-life examples of decisions with two possible results. Introduce the "if … then … else" block and demonstrate how it can be used to choose between two actions.`
					},
					{
						title: "Project 1 – Dino's Colors II",
						projectLink:
							"https://scratch.mit.edu/projects/293788691/",
						solutionLink:
							"https://scratch.mit.edu/projects/293787944/",
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
						projectLink:
							"https://scratch.mit.edu/projects/293457751/",
						solutionLink:
							"https://scratch.mit.edu/projects/293291715/",
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
						projectLink:
							"https://scratch.mit.edu/projects/332463981/",
						solutionLink:
							"https://scratch.mit.edu/projects/332459692/",
						content: `
1. When the green flag is clicked, start the rocketship at the center bottom of the stage.
2. If the user clicks the mouse, make the rocketship move up 5 steps; otherwise, it goes down 5 steps (always pointing upward).
3. When the rocketship reaches the star, make it blast off using sounds, motion or visual effects.`
					},
					{
						title: "GS6 Supplemental Project 2 – Baby Fish",
						projectLink:
							"https://scratch.mit.edu/projects/332468797/",
						solutionLink:
							"https://scratch.mit.edu/projects/332464646/",
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
						projectLink:
							"https://scratch.mit.edu/projects/295332936/",
						solutionLink:
							"https://scratch.mit.edu/projects/294539961/",
						content: `
1. When the "1" key is pressed, have Gobo ask a math question (e.g., "What's 9 – 7?"). Indicate whether the answer is correct or incorrect via costume, sound or speech.
2. When the "2" key is pressed, have Gobo ask a question like "What's a number less than 0?" and indicate whether the answer is correct or incorrect.
3. When the "3" key is pressed, have Gobo ask a harder math question and allow the user to keep answering until the answer is correct. If the answer is too low, Gobo should say "Higher!"; if too high, say "Lower!".`
					},
					{
						title: "Project 2 – Fortune Teller",
						projectLink:
							"https://scratch.mit.edu/projects/295333590/",
						solutionLink:
							"https://scratch.mit.edu/projects/294540150/",
						content: `
1. When the green flag is clicked, play an introduction and ask the user their name.
2. Ask the user "What do you want to know? (Type Love, Money, or Friendship)".
3. Use conditionals to give a fortune based on the user's input.
4. Ask another question such as "Choose a number between 1 and 5" and use conditionals to provide a response.
Challenge: Add more fortunes and questions to make the fortune teller more detailed.`
					},
					{
						title: "Project 3 – Number Guesser",
						projectLink:
							"https://scratch.mit.edu/projects/295335247/",
						solutionLink:
							"https://scratch.mit.edu/projects/294541979/",
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
						projectLink:
							"https://scratch.mit.edu/projects/330320360/",
						solutionLink:
							"https://scratch.mit.edu/projects/330316142/",
						content: `
1. Ask the user if they want to build a shop, plant a tree or explore the island.
2. Use the answer to determine which event occurs.
3. Ask the user yes/no questions to further customize the experience.
4. Use variables to store items collected or tasks completed.
5. Encourage the user to explore and discover secrets.`
					},
					{
						title: "GS7 Supplemental Project 2 – Space Cadets",
						projectLink:
							"https://scratch.mit.edu/projects/330321409/",
						solutionLink:
							"https://scratch.mit.edu/projects/330316808/",
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
						projectLink:
							"https://scratch.mit.edu/projects/302997680/",
						solutionLink:
							"https://scratch.mit.edu/projects/302865707/",
						content: `
1. When the green flag is clicked, make the praying mantis appear at a random position.
2. When the mouse is clicked, make the mantis glide to the mouse pointer's X and Y position.
3. If the mantis touches a bug, broadcast a message to make the bug disappear and increase the score.
4. Use variables for the score and a timer.
5. End the game when the timer runs out and display the score.`
					},
					{
						title: "Project 2 – Cake Chaser",
						projectLink:
							"https://scratch.mit.edu/projects/302998723/",
						solutionLink:
							"https://scratch.mit.edu/projects/302865909/",
						content: `
1. Set up two sprites: a person and a slice of cake.
2. Use the arrow keys to move the person around the stage.
3. Make the cake appear at random X and Y coordinates.
4. When the person touches the cake, play a sound, move the cake to a new random location and increase the score.
5. Add a timer that counts down and ends the game when it reaches zero.`
					},
					{
						title: "Project 3 – Talent Show",
						projectLink:
							"https://scratch.mit.edu/projects/302999957/",
						solutionLink:
							"https://scratch.mit.edu/projects/302866259/",
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
						projectLink:
							"https://scratch.mit.edu/projects/330290958/",
						solutionLink:
							"https://scratch.mit.edu/projects/330287678/",
						content: `
1. Use the arrow keys to move a sprite to each quadrant of the stage.
2. When the sprite reaches a quadrant, display a message such as "I'm in Quadrant I".
3. Challenge: Add shapes or obstacles that must be avoided.`
					},
					{
						title: "GS8 Supplemental Project 2 – Coordinate Drawings",
						projectLink:
							"https://scratch.mit.edu/projects/330291711/",
						solutionLink:
							"https://scratch.mit.edu/projects/330288612/",
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
						projectLink:
							"https://scratch.mit.edu/projects/302996579/",
						solutionLink:
							"https://scratch.mit.edu/projects/302864606/",
						content: `
1. When the green flag is clicked, create a timer variable and set it to 20.
2. Make a target sprite (e.g., a button) appear in random positions.
3. Each time the target is clicked, increase a score variable by 1.
4. Decrease the timer by 1 every second; when the timer reaches zero, stop the game and display the final score.
5. Consider adding a high-score variable.`
					},
					{
						title: "Project 2 – Spider Smash",
						projectLink:
							"https://scratch.mit.edu/projects/302996964/",
						solutionLink:
							"https://scratch.mit.edu/projects/302865093/",
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
						projectLink:
							"https://scratch.mit.edu/projects/330293454/",
						solutionLink:
							"https://scratch.mit.edu/projects/330289893/",
						content: `
1. Use the arrow keys to move a sprite around the stage.
2. Make a variable called "steps" that increases each time the sprite moves.
3. Display the number of steps taken.
4. Challenge: Add obstacles and a goal to reach.`
					},
					{
						title: "GS9 Supplemental Project 2 – Hungry Crab",
						projectLink:
							"https://scratch.mit.edu/projects/330294193/",
						solutionLink:
							"https://scratch.mit.edu/projects/330290622/",
						content: `
1. Control a crab with the arrow keys.
2. Create a variable called "food" and increase it each time the crab eats a piece of food.
3. Add a timer; when time runs out, end the game and display how much food was collected.`
					},
					{
						title: "GS9 Supplemental Project 3 – Lunch Money",
						projectLink:
							"https://scratch.mit.edu/projects/330294909/",
						solutionLink:
							"https://scratch.mit.edu/projects/330291357/",
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
						projectLink:
							"https://scratch.mit.edu/projects/301002220/",
						solutionLink:
							"https://scratch.mit.edu/projects/300644693/",
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
						projectLink:
							"https://scratch.mit.edu/projects/303008513/",
						solutionLink:
							"https://scratch.mit.edu/projects/302811491/",
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
						projectLink:
							"https://scratch.mit.edu/projects/330301165/",
						solutionLink:
							"https://scratch.mit.edu/projects/328309254/",
						content: `

Design your own play, and use the broadcast blocks to set up the scene changes and dialogue between characters!

1. Come up with a story that involves 3-4 characters and scenes. You can use movies or your real life as inspiration!
2. Add the sprites and backdrops you will need to your project.
3. Make your story come to life! Broadcast messages between your sprites to make sure everything happens in the correct sequence.`
					},
					{
						title: "GS10 Supplemental Project 2 – Cartoon Crash",
						projectLink:
							"https://scratch.mit.edu/projects/330302209/",
						solutionLink:
							"https://scratch.mit.edu/projects/328312475/",
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
						projectLink:
							"https://scratch.mit.edu/projects/304551665/",
						solutionLink:
							"https://scratch.mit.edu/projects/305082197/",
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
						projectLink:
							"https://scratch.mit.edu/projects/332395747/",
						solutionLink:
							"https://scratch.mit.edu/projects/330724703/",
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
						projectLink:
							"https://scratch.mit.edu/projects/303001451/",
						solutionLink:
							"https://scratch.mit.edu/projects/302948550/",
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
• Type Racer: https://replit.com/@JuniLearning/PS12-Type-Racer?v=1
`
					}
				],
				supplementalProjects: []
			}
		]
	},
	{
		name: "Scratch Level 2",
		modules: [
			{
				title: "Check-in #1",
				curriculum: [
					{
						title: "Check-in #1: Nested Loops",
						solutionLink:
							"https://scratch.mit.edu/projects/341945558/",
						content: `Create a new blank project in Scratch, and name it "Check-in #1".
Nested-1: What is a loop? What do we call it when we put a loop inside of another loop?
Nested-2: Add a sprite to your project and have it play a sound when the spacebar is pressed. Put a repeat 3 around the sound block and then a repeat 2 around the whole thing. Before you run the code, can you figure out how many times the sprite will make the sound?
Nested-3: When the green flag is clicked, draw a triangle. Turn 60 degrees and draw another triangle. Can you use a repeat to make a hexagon of triangles?
Note: You can draw this shape using the annotation tool on the screen for clarity.
Nested-4: Draw another, bigger hexagon around the first one. Can you do this by putting a loop around your existing code?`
					},
					{
						title: "Check-in #1: Cloning",
						solutionLink:
							"https://scratch.mit.edu/projects/341945558/",
						content: `Cloning-1: How can we duplicate sprites and make the duplicates do different things?
Cloning-2,3: Move your drawing code so that when the green flag is clicked, the parent sprite makes clones of itself every 2 seconds and the clones go to a random position and draw the hexagon shape.
Cloning-4: Make sure to show the clones when they are created and then delete them when they\'re done. What should we do with the sprite that isn\'t doing anything?`
					},
					{
						title: "Check-in #1: Complex Conditionals",
						solutionLink:
							"https://scratch.mit.edu/projects/341945558/",
						content: `Complex-1: What block would you use if you wanted to check if two things are true in the same if/then block?
Complex-2: What about if you wanted to check if, given two things, at least one of them is true?
Complex-3: What about if you wanted to check if a condition isn\'t true?
Complex-ALL: Using complex conditionals, update your code so that the clones that are in the top right portion of the screen all have a blue pen color. (Hint: You may have to use coordinates!) Now, can you add code so that each of the four quadrants uses a different pen color?`
					},
					{
						title: "Check-in #1: Additional Practice Project",
						projectLink:
							"https://scratch.mit.edu/projects/386649746/",
						solutionLink:
							"https://scratch.mit.edu/projects/386368696/",
						content: `Use a variable to make the owl count from 1 to 50.
Add a conditional so that if the spacebar or the up arrow is pressed, the owl says something instead of the number.
Add a conditional so that if the mouse pointer is on the owl, it gets shy and doesn\'t say anything at all!`
					}
				],
				supplementalProjects: []
			},
			{
				title: "Check-in #2",
				curriculum: [
					{
						title: "Check-in #2: Strings",
						solutionLink:
							"https://scratch.mit.edu/projects/342645999/",
						content: `Create a new blank project in Scratch, and name it "Check-in #2".
Strings-1: What does the word “string” mean in Scratch?
Strings-2: Add the Andie sprite to your project. When the 1 key is pressed, have him ask the user what their name is. Once the user responds, have him say “Hello [your name]” using one say block.
Strings-3,4: Report to the user the first letter of their name and how many letters are in their name.`
					},
					{
						title: "Check-in #2: Mathematical Operators and Randomness",
						solutionLink:
							"https://scratch.mit.edu/projects/342645999/",
						content: `Math-1: How can we perform operations on numbers in Scratch? Can you show me where these blocks are?
Math-2: When the 2 key is pressed, make Andie say the result of adding together 5 and 6!
Math-3,4: Create a random number between 1 and 20 and store it in a variable. If the number is less than 10, have Andie say “Wow, that\'s a small number!” otherwise, say “Whoa, that\'s a big number!”
Math-5: What is the mod block? Use it to report to the user the remainder of dividing any two numbers you want!`
					},
					{
						title: "Check-in #2: Lists",
						solutionLink:
							"https://scratch.mit.edu/projects/342645999/",
						content: `Lists-1: What do you use lists for in Scratch?
Lists-2,3: Change the name of each of Andie's costumes to match the action that each costume is performing ("pass", "shoot", etc). Can you create a list called “actions” and add each of the names of Andie\'s different costumes to it when the 3 key is pressed?
Lists-4: Make Andie say the second thing in the list.
Lists-5: Tell the user what actions Andie can perform by looping through the list.
Lists-6: Once you\'ve reported all of Andie\'s actions to the user, ask which action they would like to see and switch his costume to this action! If you haven\'t already, how do we make sure the list is cleared so we don\'t add duplicate items to the list when the 3 key is pressed?`
					},
					{
						title: "Check-in #2: Functions",
						solutionLink:
							"https://scratch.mit.edu/projects/342645999/",
						content: `Functions-1: What are functions in Scratch? Where can we create our own blocks in scratch?
Functions-2: Create a function called “Score!”, which changes Andie\'s costume, makes him say “Woohoo!” and play a clapping sound.
Functions-3: Make Andie score when the spacebar is pressed.
Functions-4: Create another function called “Find Multiples” that takes one number input and says the first 10 multiples of that number for one second each.
Functions-5: When the spacebar is pressed, make Andie say the multiples of a random number from 1 to 10.`
					},
					{
						title: "Check-in #2: Additional Practice Project",
						projectLink:
							"https://scratch.mit.edu/projects/386649865/",
						solutionLink:
							"https://scratch.mit.edu/projects/386376803/",
						content: `Add one of the dancing sprites to the project and create a function that loops through all of their costumes.
Add a number input that says how many seconds they should dance for in total. Can you use a division operator in the wait block to make sure they\'re dancing for the right number of seconds? Hint: Think about how long they should spend on each costume to add up to the right number of seconds.
When the green flag is pressed, make your sprite dance for 3 seconds.
When they\'re done dancing, ask the user to tell you their favorite dance move by the costume number. Get their top five favorites.
Create a function that loops through this list of favorite dance moves.
Make your sprite dance these moves forever!`
					}
				],
				supplementalProjects: []
			},
			{
				title: "GM1 Review: Events, Loops, Conditionals, & Broadcasting",
				curriculum: [
					{
						title: "Event listeners",
						content: `What do you think an event listener is? An event listener is a way to make our sprite wait and listen until a certain event happens, and then it will react to that event in the way we tell it to.
Can you remember any of the event listeners that you used to make the Hungry Hippo game? Click on the Events section. There were the when green flag clicked and when arrow key pressed blocks. Talk about how these blocks made the sprite do something in response to a certain event, whether it is the green flag being clicked or a certain key being pressed.
View CS Training's Code`
					},
					{
						title: "GM1 Project 1: Dragonfly Events",
						projectLink:
							"https://scratch.mit.edu/projects/287707460/",
						solutionLink:
							"https://scratch.mit.edu/projects/284408078/",
						content: `1. When the green flag is clicked, make the dragonfly go to a random spot on the stage.
2. When the arrow keys are pressed, make the dragonfly move 20 steps in that direction.
3. When the dragonfly is clicked, make it change its color.
4. When the space bar is pressed, make the dragonfly make a popping sound.
5. When 1 is pressed, make the dragonfly "pop" and then go to a random position.
6. When 2 is pressed, make the dragonfly say something ("Buzzzz", for example).
7. When 3 is pressed, make the background change.
Challenge: can you add another sprite that is moves around using the WASD keys?
View CS Training's Code`
					},
					{
						title: "Loops",
						content: `When have you heard the word "loop" before? What do you think loops are for in programming? Loops let us repeat code however many times we want!
Discuss with the why loops might be helpful. For example, we don\'t have to copy our code a bunch of times, we can keep our code simpler, and some things would be impossible without loops (i.e. things that happen forever).
Open a new Scratch project. Have click on the Control section and look at the repeat and forever blocks. Discuss what these might be used for. Point out that both of these blocks have a "mouth" where we can insert other code blocks to be repeated!
Show the an example of repeating the move __ steps and turn ___ degrees blocks. Start with the repeat block and then try the forever block.
View CS Training's Code`
					},
					{
						title: "GM1 Project 2: Drawing Mouse",
						projectLink:
							"https://scratch.mit.edu/projects/289744824/",
						solutionLink:
							"https://scratch.mit.edu/projects/289445069/",
						content: `1. Add an event listener so that when the flag is clicked, everything gets erased.
2. Add an event listener so that when the 1 key is pressed, the mouse draws a square (using a loop) in a random location.
3. Add a similar set of blocks so that the mouse draws a triangle.
4. Add a similar set of blocks so that the mouse draws a circle.
5. What other shapes can you create? Make some other sets of blocks that draw other shapes (e.g. an octagon, a star, etc.).
View CS Training's Code`
					},
					{
						title: "Conditionals",
						content: `In programming, a lot of the time we only want something to happen if something else is true or has been done. A conditional statement is something that needs be met in order for something else to happen.
Discuss with the about "conditionals" in real life, emphasizing the if/then aspect of such situations. Some examples include: If you eat your dinner, then you can have dessert. If you get your homework done, then you can play videogames. If it is cold outside, then you need to wear a jacket.
In addition, usually when we are checking a condition, there is more than one thing that can happen as a response to that condition. This is when a if... then... else conditional statement might come into use!
Open a new Scratch project. Take the time to introduce the to the various conditional blocks, in addition to asking for user input. Here are some rough projects you can use as guidance: if/then, if/then/else, user input.
View CS Training's Code`
					},
					{
						title: "GM1 Project 3: Math Facts",
						projectLink:
							"https://scratch.mit.edu/projects/295332936/",
						solutionLink:
							"https://scratch.mit.edu/projects/294539961/",
						content: `1. When 1 is pressed, have Gobo ask a question like "What's 9-7?" Based on how the user answers, Gobo should change his costume, make a sound, and/or say something to indicate a correct or incorrect answer.
2. When is 2 is pressed, have Gobo ask a question like "What's a number less than 0?" Based on how the user answers, Gobo should change his costume, make a sound, and/or say something to indicate a correct or incorrect answer.
3. When 3 is pressed, have Gobo ask a harder math question that allows the user to keep answering until the answer is correct. Gobo should indicate each time whether the answer was correct or incorrect.
View CS Training's Code`
					},
					{
						title: "Variables",
						content: `Variables are places that we store information that can change. Variables can store words, numbers, etc. Variables are helpful when we want to keep track of something like a score or time.
Open a new Scratch project. Have click on the Variables section and show them how to make a variable and use the set __ to __ and change __ by __ blocks.
Using a repeat block, make the cat say the numbers 1 to 10 (one by one). Here is a reference project.
Ask to figure out how to make the cat count backward from 10 to 0, and then how to count backward from 100 to 0 by 10s.
View CS Training's Code`
					},
					{
						title: "GM1 Project 4: Speed Click",
						projectLink:
							"https://scratch.mit.edu/projects/299327014/",
						solutionLink:
							"https://scratch.mit.edu/projects/299311602/",
						content: `Let's make a game: you get 10 seconds to click on the button as many times as you can. When the time is up, you can't click on the button anymore!
1. Make a variable to keep track of the number of clicks.
2. Use an event listener so that when the sprite is clicked, the variable goes up by one. Make the button switch to the pressed costume and make a sound, too!
3. Make a variable that keeps track of time.
4. When the green flag is clicked, make the timer start from 10 and count down to 0.
5. Before the timer starts, make the button say "Ready...", "Set...", and "Go!" for one second each.
6. When time runs out, make the button hide. Remember, if we make it hide when the game is over, that means that we need to show it when the game starts.
View CS Training's Code`
					},
					{
						title: "Message Broadcasting",
						content: `Previously, we learned about how to use conditional statements to do something if something else happens. However, we haven't learned how to make this work across different sprites. For example, we might want a sprite to say something once another sprite is done moving. In these situations, we use message broadcasting.
Open a new Scratch project. Have click on the Events section and and look at the broadcast __ when I receive __ blocks. Explain that broadcasting is a way that sprites can send each other messages to trigger/start certain parts of our code.
and
Using this project as a rough guide, show the how to make the ball start bouncing only after the cat is done talking.
View CS Training's Code`
					},
					{
						title: "GM1 Project 5: Dance Off",
						projectLink:
							"https://scratch.mit.edu/projects/301002220/",
						solutionLink:
							"https://scratch.mit.edu/projects/300644693/",
						content: `It's dancing time! Let's give each sprite a turn to "perform" on the stage.
1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she's done, have her glide off to the right side of the stage.
2. One by one, make each of the other dancers do the same thing. Can you add some clapping between each performer? We also need to be sure to make them start back on the left when the green flag is clicked!
3. A dance party isn't very fun without music! Add some code to the backdrop so that it plays some dancing music forever. When Champ is done dancing, broadcast a message that stops the music.
4. Can you make it so that the lights change, too? How about some clapping once everyone is done?
View CS Training's Code`
					},
					{
						title: "GM1 Project 6: Hedgehog Race",
						projectLink:
							"https://scratch.mit.edu/projects/304551665/",
						solutionLink:
							"https://scratch.mit.edu/projects/305082197/",
						content: `Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
Create a comment in the project to write out the different steps of what we will need to code.
Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.
View CS Training's Code`
					},
					{
						title: "GM1 Project 7: Asteroid Dodge",
						projectLink:
							"https://scratch.mit.edu/projects/303001451/",
						solutionLink:
							"https://scratch.mit.edu/projects/302948550/",
						content: `Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
Create a comment in the project to write out the different steps of what we will need to code.
Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.`
					}
				],
				supplementalProjects: []
			},
			{
				title: "GM2 Nested Loops",
				curriculum: [
					{
						title: "Nested loops",
						content: `Review what a loop is (there should be familiarity with the repeat block in Scratch). What does the word "nested" mean? Think of Russian nesting dolls: nested means something placed inside another thing. Thus, nested loops are loops inside of other loops!
Why might we want to use nested loops?
View CS Training's Code`
					},
					{
						title: "GM2 Project 1: Square Inception",
						projectLink:
							"https://scratch.mit.edu/projects/306391834/",
						solutionLink:
							"https://scratch.mit.edu/projects/306394145/",
						content: `1. Observe carefully the order in which the cat is drawing this pattern! First, program the cat to draw the first small square in the bottom right quadrant. (Make sure the canvas is erased and the cat's pen is down before he starts drawing.)
2. Next, program the cat to draw the medium square, and then the large square.
3. After the cat has drawn these three squares in the bottom right quadrant, have him turn 90 degrees and change his pen color by 25.
4. Using nested loops, program the cat to draw the squares in the other three quadrants as well.
5. Try to use a variable that stores the side length of the square to simplify your code even further.
Finally, share the project!
View CS Training's Code`
					},
					{
						title: "GM2 Project 2: Pyramid",
						projectLink:
							"https://scratch.mit.edu/projects/307922307",
						solutionLink:
							"https://scratch.mit.edu/projects/307918456",
						content: `1. Observe carefully the order in which the cat is drawing this pattern! First, program the cat to draw the first tiny triangle. (Make sure before he starts drawing, he starts at (0,120), pointing in direction 150 degrees, with his pen down.)
2. Next, program the cat to draw a slightly larger triangle, and then an even slightly larger triangle.
3. Using nested loops and a variable, draw 15 total triangles to make the pyramid!
Finally, share the project!`
					}
				],
				supplementalProjects: [
					{
						title: "GM2 Supplemental Project 1: Playing Baseball",
						projectLink:
							"https://scratch.mit.edu/projects/334075920",
						solutionLink:
							"https://scratch.mit.edu/projects/334073245/",
						content: `1. Start by setting the pitcher\'s costume to the first one, make him say “Batter up!”, and then cycle through all of his costumes. Send a message broadcast when he\'s done pitching and wait for the batter.
2. When the batter receives the message, make her cycle through all of her costumes.
3. How many strikes until the batter\'s out? Repeat your code this many times.`
					},
					{
						title: "GM2 Supplemental Project 2: Grid",
						projectLink:
							"https://scratch.mit.edu/projects/334073152/",
						solutionLink:
							"https://scratch.mit.edu/projects/334067890/",
						content: `Let\'s draw a grid!
1. Start by thinking about how we could draw one row of squares. What would we need to change after drawing each square? How many loops would we need?
2. Make the pencil start at (-200, 150) and draw 8 squares with a side length of 50 from left to right across the screen.
3. How might we make several rows of squares? What would we repeat? What would need to change?
4. Make the pencil draw 6 rows of squares from the top to the bottom of the screen.`
					},
					{
						title: "GM2 Supplemental Project 3: Rainbow Flower",
						projectLink:
							"https://scratch.mit.edu/projects/335808333/",
						solutionLink:
							"https://scratch.mit.edu/projects/335807180/",
						content: `Draw a beautiful rainbow flower!
1. When the green flag is clicked, make the pencil sprite go to the center of the screen and put the pen down.
2. Start by programming the code for a circle and then take a look at the turn block. What would happen if we changed the amount we were turning? What would happen if we changed the amount we turned each time we turned? Try to make a variable that keeps track of the angle we turn and increase it by 1 each time we go through the loop.
3. After you're done experimenting in step 2, set up the code so that the angle starts at 0 degrees and repeat 40 times to get a really pretty looking spiral!
4. Now that we have one petal of our flower, can you make the other six? Think about how we have to start from the center of the flower and move outwards each time.
5. Change the pen color after each petal to get a rainbow colored flower!`
					}
				]
			},
			{
				title: "GM3 Complex Conditionals",
				curriculum: [
					{
						title: "Complex conditionals",
						content: `Review with the what a conditional is (they should have familiarity with the if __ then __ and if __ then __ else __ blocks in Scratch). Often, we don\'t decide to do something because of just one thing; sometimes we want something to happen when two or more things are true at the same time, or when either one thing or another thing are true!
Open a new Scratch project. Using this project as a rough guide, introduce the and , or , and not blocks.
View CS Training's Code`
					},
					{
						title: "GM3 Project 1: Color Spotter",
						projectLink:
							"https://scratch.mit.edu/projects/306694840/",
						solutionLink:
							"https://scratch.mit.edu/projects/306689852/",
						content: `1. Program controls for the cat so that he moves around on the screen when you press the arrow keys.
2. Using conditionals, program the cat to say "I'm touching red and blue" if he is touching red and blue.
3. Add similar conditionals for if he is touching red and yellow, and blue and yellow.
4. If the cat is touching all three colors, make him say "I'm touching all 3 colors!"
5. If the cat is touching no colors, make him say "I'm touching no colors!"
6. If the cat is touching any one of the colors, make him say "I'm touching a color!"
Finally, share the project!
View CS Training's Code`
					},
					{
						title: "GM3 Project 2: Strength Tester",
						projectLink:
							"https://scratch.mit.edu/projects/307992404/",
						solutionLink:
							"https://scratch.mit.edu/projects/307934264/",
						content: `1. When the green flag is clicked, make the button say "Click me to see how strong you are!"
2. When the button is clicked, make it broadcast the message "How strong"
3. When the arrow receives this message, make it go to (-130, -160), pick a random number between 0 and 300, and move up by this amount.
4. Based on the random number, make the button say one of at least five different messages, like "You're the strongest person ever!" or "It looks like you need to go to the gym!"
Finally, share the project!`
					}
				],
				supplementalProjects: [
					{
						title: "GM3 Supplemental Project 1: Baby Chick",
						projectLink:
							"https://scratch.mit.edu/projects/335794156/",
						solutionLink:
							"https://scratch.mit.edu/projects/335790153/",
						content: `Use the arrow keys to help the baby chick find its parents!
1. Program the chick so that you can move it up/down/left/right with the arrow keys.
2. When the green flag is clicked, make the rooster point to the right and then move him back and forth across the screen forever. (Hint: Make him turn 180 degrees randomly as he's walking!)
3. Repeat step 2 for the hen.
4. Now, we\'re going to program the chick to know when it is with its parents! If it\'s touching both of its parents, make it say “I love my parents!”, if it\'s just touching its mom, make it say “Hi, Mom!”, if it\'s just touching its dad, make it say “Hi, Dad!”, and if it\'s not touching either, make it say “Where are my parents?”`
					},
					{
						title: "GM3 Supplemental Project 2: Save the Butterfly",
						projectLink:
							"https://scratch.mit.edu/projects/335798048",
						solutionLink:
							"https://scratch.mit.edu/projects/335794365",
						content: `Use the left and right arrow keys to help the butterfly escape the hungry frog!
1. When the green flag is pressed, make the butterfly go to (-60, 0) and the frog go to (-170, 0).
2. Next, the frog should say “I\'m hungry”, “Ooh, a butterfly!”, and “I\'m coming to get you!” for two seconds each.
3. After the frog broadcasts, it should start moving a random number of steps from 0 to 3 for the rest of the game. To make the game harder, you can increase the number of steps!
4. Let\'s help the butterfly escape! When it receives that the game has started, use the “wait until” block to make it move forward 5 steps when the user alternates between clicking the left and right key.
5. You might be able to cheat and hold down both keys, so think about how you could use complex conditionals to fix this!
6. If the butterfly is touching the frog, make it stop the other scripts, broadcast that you lost the game, and then hide (that means we need to show it at the beginning).
7. If the butterfly touches the dark purple tree on the other side of the screen, make it broadcast that you won the game and glide off the screen.
8. When the frog receives these win and lose broadcasts, make it stop the other scripts and respond accordingly to its meal!`
					}
				]
			},
			{
				title: "GM4 Cloning",
				curriculum: [
					{
						title: "Cloning",
						content: `Sometimes in our projects or games, we want to have one sprite that's duplicated many times, doing slightly different things. We can make clones or copies of this sprite in our code.
Create a new Scratch project. Using this project as rough guide, introduce the create clone of myself, when I start as a clone , and delete this clone blocks.
Most of the time we don\'t want to see the original sprite, since the clones are doing the things we actually want! Show how to “hide” the parent and “show” the clones.
View CS Training's Code`
					},
					{
						title: "GM4 Project 1: Jackson Pollock Clones",
						projectLink:
							"https://scratch.mit.edu/projects/307580100/",
						solutionLink:
							"https://scratch.mit.edu/projects/307575111/",
						content: `1. Start by making the parent pencil create clones of itself continuously.
2. When a clone is created, make it go to a random location, choose a random size and color, and then glide to another random location. Be sure to use the pen block that sets a color using a number, not the block that takes a color as an input. If the wrong block is used, only shades of blue will appear.
Challenge: Make the brush strokes look more realistic with slightly varying angles, colors, and widths.
Finally, share the project!
View CS Training's Code`
					},
					{
						title: "GM4 Project 2: Rainy Day",
						projectLink:
							"https://scratch.mit.edu/projects/307634451/",
						solutionLink:
							"https://scratch.mit.edu/projects/307629921/",
						content: `1. Program the umbrella so that it can be moved with the left and right arrow keys.
2. Program the chick to continuously move forward in little steps and bounce if it hits a wall. Also make the chick switch directions randomly, once every few steps.
3. Program the rain drop to create clones of itself continuously.
4. When a clone is created, it should fall from the sky. Think about what should happen when it touches the chick and when the clone should be deleted, and add these scenarios into your code.
5. Keep track of the number of times the chick got wet, and give the player 60 seconds to protect the chick as much as possible!
Finally, share the project!`
					}
				],
				supplementalProjects: [
					{
						title: "GM4 Supplemental Project 1: Fruity Fest",
						projectLink:
							"https://scratch.mit.edu/projects/336915372/",
						solutionLink:
							"https://scratch.mit.edu/projects/336928836/",
						content: `1. Set up the parrot to move around with the up/down/left/right arrow keys.
2. Set up the fruit so that a clone is created every second. Each clone should be a random piece of fruit, and it should show up in a random location!
3. Keep track of the total amount of fruit the parrot collects, and end the game and display the fruit platter once the parrot collects 10 pieces.`
					}
				]
			},
			{
				title: "GM5 Strings",
				curriculum: [
					{
						title: "Strings",
						content: `In programming, we work with different kinds of information, or data, that is stored inside of variables. Up until now, we\'ve mainly focused on numbers inside of variables. What kind of things have we done when working with numbers inside of variables? For example, we've kept track of a score and timer, we've added numbers together, and we've checked to see which of two numbers is bigger or smaller.
Another kind of information that we use a lot when coding is words and letters, which we call strings. If the struggles with the terminology of string, you can have them visualize spelling words with letters from a can of Alphabet Soup. We could (with a lot of messiness) put a thread through a bunch of letters to string them together into a word!
Create a new Scratch project. Using this project as a rough guide, introduce the join __ __, letter __ of __, and length of __ blocks. Make sure to explain that the length of a string in programming includes spaces and all other characters.
View CS Training's Code`
					},
					{
						title: "GM5 Project 1: Security Bot",
						projectLink:
							"https://scratch.mit.edu/projects/308722400/",
						solutionLink:
							"https://scratch.mit.edu/projects/308717171/",
						content: `The robot is protecting the city! Make his ask three questions (using the string blocks) to help him keep out intruders.
1. Program the robot to ask for the user's name, and make him reply, "Nice to meet you, _____"
2. Program the robot to ask for a word that starts with "q" and tell the user if they answered correctly.
3. Program the robot to ask for a 7-letter word and tell the user if they answered correctly.
4. Program the robot to ask for a word that ends in "y" and tell the user if they answered correctly.
Challenge: Program the robot to ask for a 6-letter word that starts with "a" and tell the user if they answered correctly.
Finally, share the project!
View CS Training's Code`
					},
					{
						title: "GM5 Project 2: Spelling Bee",
						projectLink:
							"https://scratch.mit.edu/projects/357452950/",
						solutionLink:
							"https://scratch.mit.edu/projects/357452924/",
						content: `1. When 1 is pressed, ask the user for a word and spell out the word letter by letter. e.x. C-O-D-I-N-G
2. When 2 is pressed, ask the user for a word and spell out all but the first letter. e.x. O-D-I-N-G
3. When 3 is pressed, ask the user for a word and spell out all but the last letter. e.x. C-O-D-I-N
4. When 4 is pressed, ask the user for a word and spell out all but the first and last letters. e.x. O-D-I-N
5. When 5 is pressed, ask the user for a word and spell out every other letter. e.x. C-D-N
6. When 6 is pressed, ask the user for a word and spell out the word backward. e.x. G-N-I-D-O-C
Finally, share the project!`
					}
				],
				supplementalProjects: [
					{
						title: "GM5 Supplemental Project 1: Crazy Country",
						projectLink:
							"https://scratch.mit.edu/projects/338824789",
						solutionLink:
							"https://scratch.mit.edu/projects/338828947/",
						content: `Create your own fictional crazy country, with its own leader and activity its citizens are known for!
1. Ask the user for the name of the country and save it.
2. Similarly, ask and save the leader of the country and the primary activity the country is known for.
3. Report this information back to the user using the "say" and "join" blocks.
Challenge: Try to accomplish step 3 using one "say" block with many "join" blocks.`
					},
					{
						title: "GM5 Supplemental Project 2: Beary Spelly",
						projectLink:
							"https://scratch.mit.edu/projects/338829500",
						solutionLink:
							"https://scratch.mit.edu/projects/338832976",
						content: `Build a spelling test for yourself to practice your spelling!
1. The starter code already has a secret word picked out and saved in the Secret Word variable for you.
2. Add the Text to Speech extension and speak the secret word to the user.
3. Ask the user to enter each letter of the word one by one. If the letter is correct, speak "Correct!" Otherwise end the game. (Hint: think about how to repeat through the word letter by letter.)
4. If the user has spelled the entire word correctly, speak "You spelled [secret word] correctly! Great work!"`
					}
				]
			},
			{
				title: "GM6 Mathematical Operators",
				curriculum: [
					{
						title: "Mathematical Operators",
						content: `What are you learning in math class right now? Allude to how a computer could help with these topics. Computers get their name from the word compute , since they can compute the answer to math problems for us!
Create a new Scratch project. Open the Operators section, and experiment with how different mathematical operations can be performed with these blocks.
View CS Training's Code`
					},
					{
						title: "GM6 Project 1: Calculator",
						projectLink:
							"https://scratch.mit.edu/projects/357453092/",
						solutionLink:
							"https://scratch.mit.edu/projects/357453067/",
						content: `1. Ask the user for the first number, the second number, and the operation (+, -, *, or /). Store each of them in variables.
2. Using conditionals, depending on what the user entered, have the calculator say the answer!
Challenge: Add "remainder" as an operation option. For example, the remainder when 10 is divided by 3 is 1.
Challenge #2: Add exponent (^) as operation option. For example, 2^3 = 8.
Finally, share the project!
View CS Training's Code`
					},
					{
						title: "GM6 Project 2: FizzBuzz",
						projectLink:
							"https://scratch.mit.edu/projects/357453182/",
						solutionLink:
							"https://scratch.mit.edu/projects/357453140/",
						content: `1. Program the butterfly to count from 1 to 50.
2. If the number is a multiple of 3, instead of saying the number, make the butterfly say Fizz!
3. If the number is a multiple of 5, instead of saying the number, make the butterfly say Buzz!
4. If the number is a multiple of 3 and 5, instead of saying the number (or any other word), make the butterfly say Fizzbuzz!
The first few numbers in the sequence are: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz...
Finally, share the project!
View CS Training's Code`
					}
				],
				supplementalProjects: [
					{
						title: "GM6 Supplemental Project 1: Times Tables",
						projectLink:
							"https://scratch.mit.edu/projects/338508588/",
						solutionLink:
							"https://scratch.mit.edu/projects/338505545/",
						content: `Let\'s test how well Scratch knows his times tables!
1. Start by asking the user which number they want to know the multiples of.
2. Create a variable to keep track of what we will be multiplying by and set it to 1.
3. Say the product of the user\'s answer and our variable, and then increase our variable by 1. Repeat this to get Scratch to say the first ten multiples!
Challenge: Have Scratch also ask the user how many multiples the user wants to hear, and update your code accordingly.`
					},
					{
						title: "GM6 Supplemental Project 2: Stamping with Dotty",
						projectLink:
							"https://scratch.mit.edu/projects/341759115",
						solutionLink:
							"https://scratch.mit.edu/projects/338501835/",
						content: `Help Dotty graph the absolute value function!
1. When the green flag is clicked, make Dotty go to the center of the screen and ask what x coordinate she should go to.
2. First, change her x-coordinate to the user\'s answer, then change her y-coordinate to the absolute value of the answer (hint: this is a mathematical operator).
3. Make her say what her new coordinates are and then leave a stamp with the pen tool.
4. Repeat this code 10 times so that we graph 10 points of the function.
5. Next, make Dotty go to (-180,180), put the pen down, and then repeatedly increase the x position by 1 and update the y position to be the absolute value of the x position.`
					}
				]
			},
			{
				title: "GM7 Lists",
				curriculum: [
					{
						title: "Lists",
						content: `Earlier, we learned about strings, which are a way to put single letters and symbols together and store them in variables. What if we wanted to store a whole bunch of different numbers or words together at once? We can store those kinds of things in another type of variable, called a list.
In real life, what might you put into a list? For example: groceries, your favorite sports, places you've lived, the names of your family members.
In programming, we put items into lists so that we can conveniently look through them in our programs!
Create a new Scratch project. Using this project as a rough guide, show the how to create a list, add elements to a list, get the length of a list, and delete of all a list.
View CS Training's Code`
					},
					{
						title: "GM7 Project 1: Bucket List",
						projectLink:
							"https://scratch.mit.edu/projects/308826506/",
						solutionLink:
							"https://scratch.mit.edu/projects/308824008/",
						content: `Have you ever heard of a “bucket list”? It\'s a list of things you want to do in life some day! Let\'s make a program that stores those things in a list, and then repeats it back to us.
1. When the green flag is clicked, have the cat ask, “Tell me 5 things on your bucket list!”
2. Program the cat to repeat this five times, adding the user's response to the list each time.
3. Now that the list is complete, have the cat loop through the list and repeat each bucket list item back to us.
Challenge: Change the code so that instead of asking for five items, the cat will keep asking for new things to put on the list until the user types “stop."
Finally, share the project!
View CS Training's Code`
					},
					{
						title: "GM7 Project 2: List Practice",
						projectLink:
							"https://scratch.mit.edu/projects/315090026/",
						solutionLink:
							"https://scratch.mit.edu/projects/315051160/",
						content: `1. When the spacebar is pressed, make the cat ask, “What number do you want to add to the list?” Add the number the user enters to the list.
2. When the green flag is clicked, delete everything in the list.
3. When the 1 key is pressed, program the cat to read the list normally, saying each number in the list for 1 second.
4. When the 2 key is pressed, program the cat to read each number in the list doubled.
5. When the 3 key is pressed, program the cat to read the list backwards.
6. When the 4 key is pressed, program the cat to read each number and then whether the number is odd or even (e.g.: “1, Odd, 14, Even,...”).
Say every other number in the list
Say every number in the list, multiplied by 10
Say each number and then turn that many degrees to the right
Finally, share the project!
View CS Training's Code`
					},
					{
						title: "GM7 Project 3: Music Memory",
						projectLink:
							"https://scratch.mit.edu/projects/309658040/",
						solutionLink:
							"https://scratch.mit.edu/projects/309653930/",
						content: `How good is your memory? The keyboard will play a series of notes, and you have to repeat them back correctly!
1. Make the keyboard introduce the game and say “Ready... Set... Go!”
2. Program the keyboard to say and play 3 random notes, adding these notes to a "solution" list.
3. Ask the user to type in their note guesses, one note at a time, adding these notes to a "guess" list.
4. If an incorrect note is typed in, game over!
5. If the user types in all the correct notes, make the game start over with the keyboard playing one more note than last time.
Finally, share the project!`
					}
				],
				supplementalProjects: [
					{
						title: "GM7 Supplemental Project 1: Multiple Magic",
						projectLink:
							"https://scratch.mit.edu/projects/337820507",
						solutionLink:
							"https://scratch.mit.edu/projects/337817856",
						content: `Build a game for yourself to test how quickly you can calculate multiples of a number!
1. When the green flag is pressed, create a variable and set it to a random number between 1 and 10. This will be the number we want multiples of.
2. Make a list to keep track of which multiples the player has entered, and a variable to keep track of their score.
3. Have the wizard introduce the game and then start asking for multiples of your number continuously.
4. Check if their answer is a multiple of that number, and also check if this multiple has already been entered. Play a noise, update the score, and update the list accordingly, depending on whether their guess counts toward their score.
5. It would be more challenging if this game were timed! Create a timer variable and give the user 30 seconds to play the game.`
					},
					{
						title: "GM7 Supplemental Project 2: Wheel of Fortune",
						projectLink:
							"https://scratch.mit.edu/projects/340691786",
						solutionLink:
							"https://scratch.mit.edu/projects/342643080",
						content: `Welcome to the Wheel of Fortune! In this game, the user has a certain number of guesses to guess every letter of the secret word.
1. Construct a word bank using a list, from which the computer will choose a random word of at the beginning of each game.
2. Once the secret word is decided, add all the letters of the word to a new list and count the total number of unique letters in the word. Use this variable to keep track of the total number of letters the user needs to guess correctly. As you are adding the letters, make sure you don't add the same letter twice.
3. Ask the user to guess a letter. If they guess a letter that is in the secret word (and they have not already guessed this letter), add this letter to the guess list and and update the variable you are using to keep track of how many correct guesses the user has made.
4. Allow the user a certain number of guesses to win the game (for example, the length of the word, plus 5).
5. The user wins the game if they have correctly guessed all of the letters in the word, and they lose if they run out of guesses!`
					}
				]
			},
			{
				title: "GM8 Functions",
				curriculum: [
					{
						title: "Functions",
						content: `We're going to learn how to make our own custom blocks in Scratch! When we make a block, we make a special set of instructions that have a name and can take in some specific inputs. If we want the sprite to use the instructions, we just use that new block. This custom block we create is called a function.
Using this project as a rough guide, show the the My Blocks section and guide them through creating and using an adding block like the one in the example. We can name the function with the label text, and choose what kind of information we can put into the function (e.g. numbers, words, conditions).
It is particularly important the the understands the difference between defining a function (or custom block) with the given inputs, and using that function in our code with specific inputs.
Making our own blocks can help us make our code look more organized. For example, in the Music Memory game, we could have divided our code up into functions to make it a bit easier to read! You may choose to work through editing the Music Memory game to simplify it with functions now or later, like in this project.
View CS Training's Code`
					},
					{
						title: "GM8 Project 1: My First Functions",
						projectLink:
							"https://scratch.mit.edu/projects/315773207",
						solutionLink:
							"https://scratch.mit.edu/projects/315770711/",
						content: `1. Create a function that makes the cat speak a given number of times (the input will be the number of times).
2. Create a function that makes the cat draw a square of a given size (the input will be the side length of the square).
3. Create a function that makes the cat jump (the input will be the height of the jump).
4. Create a function that makes the cat teleport by making the cat spin in a circle, go to a random spot with a sound effect, and then spin again (no inputs).
5. When the green flag is clicked, use these functions to make the cat jump 100 steps, speak 3 times, draw a square of size 100, teleport, and then draw another square.
Finally, share the project!
View CS Training's Code`
					},
					{
						title: "GM8 Project 2: Talent Show II",
						projectLink:
							"https://scratch.mit.edu/projects/309293557",
						solutionLink:
							"https://scratch.mit.edu/projects/309287208/",
						content: `Our talented cat is at it again, ready to perform his many talents! Create functions for each of his talents, so that the user can have some input into his performance.
1. Create functions for each of the cat's talents, such as playing a song with an inputted number of notes, or spinning in the air an inputted number of times. Create at least four talents of your choosing.
2. When the green flag is clicked, make the cat start his talent show. He should ask the user which talent to perform, and then he should ask the user for the input that function needs.
Finally, share the project!
View CS Training's Code`
					}
				],
				supplementalProjects: [
					{
						title: "GM8 Supplemental Project 1: Extra Functions",
						projectLink:
							"https://scratch.mit.edu/projects/339918479",
						solutionLink:
							"https://scratch.mit.edu/projects/339602908",
						content: `1. Write a function that draws a shape! It should take in as input the number of sides and the size of each side. To calculate how many degrees to turn after drawing each side, use 360 divided by the number of sides.
2. Write a function that takes in a starting number and an ending number, and make the function count from a starting number up to (and including) an ending number. (Challenge: If the ending number is smaller than the starting number, make it count down from the starting number.)
3. Write a function that takes in two numbers and reports the result of addition, subtraction, multiplication, and division with the two numbers. (Challenge: calculate the average of the two numbers as well.)
4. Write a function that takes in a number and says the first 10 multiples of that number. (Challenge: take in a number of multiples as another input, and say that many multiples of the number.)`
					},
					{
						title: "GM8 Supplemental Project 2: Rock Paper Scissors",
						projectLink:
							"https://scratch.mit.edu/projects/339972570/",
						solutionLink:
							"https://scratch.mit.edu/projects/339731727/",
						content: `Let\'s play rock, paper, scissors!
1. Take a look at the final project and then look at the code provided for you. All of the pink function blocks are the functions you need to write!
2. The “get computer answer” function should randomly pick rock, paper, or scissors and store it in a variable. Try using a list to do this!
3. The “get player answer” function will ask the player for rock, paper, or scissors and store it in a variable. If the user inputs something else, make sure to keep asking until they input either rock, paper, or scissors.
4. The “find winner” function needs to look at the two different answers and determines the winner. Remember, rock beats scissors, scissors beat paper, and paper beats rock!
5. You might also find it helpful to write functions for player wins, computer wins, and tie.`
					}
				]
			},
			{
				title: "GM9 Fish Food",
				curriculum: [
					{
						title: "GM9 Project 1: Fish Food",
						solutionLink:
							"https://scratch.mit.edu/projects/468227197",
						content: `Play through the demo and identify the different elements of the game to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
Create a blank Scratch project and add a comment in the project to write out the different steps of what we will need to code. This is created from a blank project in preparation for the Master Project. Set up custom sprites and backdrops to create Fish Food.
Finally, share the project!`
					}
				],
				supplementalProjects: [
					{
						title: "GM9 Supplemental Project 1: Platformer Pal",
						projectLink:
							"https://scratch.mit.edu/projects/343651574/",
						solutionLink:
							"https://scratch.mit.edu/projects/343348430/",
						content: `Help our pal collect the magic keys and to get through the levels of this platformer!
1. Take a look at the backdrops for each level and notice how they will all involve different code. Let\'s make message broadcasts for each level so that we can organize our code a little bit better.
2. When the green flag is clicked, switch the backdrop to Level 1 and broadcast Level 1.
3. When Pal receives Level 1, we should tell it where to go on the stage. Now, we need a forever loop that tells Pal to stay on the ground and move with the arrow keys. It might help to separate this code into functions.
4. To make Pal stay on the ground, we want it to move down if it\'s not touching green. (Hint: try using a "repeat until" block.)
5. Pal should move left and right using the left and right arrow keys.
6. If the user presses the up arrow key, make Pal jump. To make Pal jump, increase its y position and let it move left and right. (Challenge: Try to make it so Pal can\'t jump through platforms.)
7. Choose where you want the magical key to be placed for Level 1, and tell it to go there when it receives the message broadcast.
8. When Pal gets to the key, switch to the next backdrop, broadcast the next level, and stop the Level 1 script.
9. Repeat all of the same steps for Level 2, but this time make sure that when Pal touches the brown pitfall, it falls down and broadcasts to restart the level.
10. Repeat all of the same steps for Level 3, but this time make sure to tell the teleporters where to go, and make Pal go to teleporter out when it touches teleporter in.
11. When the user collects the key on Level 3, broadcast the end of the game and switch the backdrop.
12. Add any sounds or other special effects you want to the game!`
					}
				]
			},
			{
				title: "GM10 Treasure Cave",
				curriculum: [
					{
						title: "GM10 Project 1: Treasure Cave",
						projectLink:
							"https://scratch.mit.edu/projects/315336651/",
						solutionLink:
							"https://scratch.mit.edu/projects/309661591/",
						content: `Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
Create a comment in the project to write out the different steps of what we will need to code.
Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.
Finally, share the project!`
					}
				],
				supplementalProjects: [
					{
						title: "GM10 Supplemental Project 1: Fruit Ninja",
						projectLink:
							"https://scratch.mit.edu/projects/346953687/",
						solutionLink:
							"https://scratch.mit.edu/projects/348994271/",
						content: `Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
				Create a comment in the project to write out the different steps of what we will need to code.`
					}
				]
			},
			{
				title: "GM11 Master Project",
				curriculum: [
					{
						title: "GM11 Project 1: Master Project",
						content: `For your Master Project, you now have the skills and knowledge to design and build a game of your own! Spend some time brainstorming what kind of game to make, thinking about the past projects created and different elements to incorporate. Make sure to include lists and functions in the project.
				Once there is an idea, discuss the plan for programming the game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?
				Create a new Scratch project and add a comment to write out the different steps of what we will need to code.
				Program the game as independently as possible! As described above, this may take approximately two classes to complete.`
					},
					{
						title: "Master Project Presentation",
						content: `Once it's complete, prepare a simple presentation about how the project was programmed and share the accomplishment with friends or family.
				Another way to celebrate the project is by sharing it with friends or family.`
					},
					{
						title: "Course Recap",
						content: `We've learned a lot over these past few months! Can you recap the different topics we learned in this course?
				Help come up with a list of coding concepts they\'ve learned through Scratch. It might be helpful to look back at the module titles or code from previous projects they\'ve created.
				If anything is missing, make sure the list includes conditionals, XY coordinates, variables, event listeners, loops, and functions.
				Great job! Many of these concepts from Scratch will be used in Python as well. Let's take a closer look at the next course.
				Discuss the next course: Python Level 1. In Python Level 1, we will learn our first programming language that requires us to fully type out our code instead of using blocks! However, we are going to use a lot of the same concepts we've already become comfortable with in Scratch.
				View CS Training's Code`
					},
					{
						title: "Optional Extra Practice: Typing Games",
						content: `This optional section is for those transitioning from Scratch into Python Level 1.
				The purpose is to prepare for block-based to text-based coding and to assess typing and computer literacy skills.
				If someone is advanced, has strong typing skills, or is not taking a text based programming language as their next course, you may skip this activity at your discretion.
				These typing games are optional and don\'t all need to be completed. Choose games that are interesting and move on once there has been 15-20 minutes of practice, or if already a strong typist.
				Feel free to skip to the intermediate typing games if older than 6.
				One of the biggest differences between Python and Scratch is that we\'ll need to type our code out rather than using blocks. Let\'s play a few games to practice typing as we prepare ourselves to write Python code.
				Beginner Typing Games:
				Practice with the Keyboard - Typing Letters
				Navigate to https://scratch.mit.edu/projects/214833806/and practice typing letters. Try to reach 10 points!
				Practice with the Keyboard - Typing Numbers
				Navigate to https://scratch.mit.edu/projects/214828609/ and practice typing numbers. Try to reach 10 points!
				Practice with the Keyboard - Typing Letters Race
				Navigate to https://www.nitrotype.com/. See if you can type letters faster than your opponent and win the race.
				Intermediate Typing Games
				Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game
				Ghost Typing: https://www.abcya.com/games/ghost_typing
				Koala Paddleboards (spelling and typing practice): https://www.abcya.com/games/spelling_practice
				Advanced Typing Games
				Typing Rocket: https://www.abcya.com/games/typing_rocket
				Type Racer: https://replit.com/@JuniLearning/PS12-Type-Racer?v=1
				`
					}
				],
				supplementalProjects: []
			}
		]
	},
	{
		name: "PyGames",
		modules: [
			{
				title: "PyG1 Object-Oriented Programming: Actors",
				curriculum: [
					{
						title: "PyGame Setup with Mu",
						content:
							'Install the Mu editor from https://codewith.mu and switch it to PyGame mode using the "Mode" button. Confirm the mu_code folder exists and help find and move it to an easy-to-access location. Download the assets zip from https://static.classes.jacobdanderson.net/assets.zip, unzip it, and move the images, sounds, and music folders into mu_code. Create a new file alien.py in mu_code. If Mu cannot be installed, use PyCharm with pip install pgzero, import pgzrun, and pgzrun.go(), and keep images in an images folder and sounds in a sounds folder.'
					},
					{
						title: "Actors",
						content:
							'Define WIDTH = 400 and HEIGHT = 300 (all caps) at the top of the file to set the window size. Explain that an object groups data and functions (like the turtle object: position, color, movement functions). Introduce the Actor object for players, enemies, and collectibles; it has x, y, and an image, plus methods like draw() and collision helpers. Create an alien actor with alien = Actor("alien"). Define def draw(): and inside call screen.clear() then alien.draw(). Add an update() function that moves the alien, e.g. alien.x += 5. Let the experiment with changing x and y, positive vs negative values, and different speeds.'
					},
					{
						title: "Position Keywords",
						content:
							"Explain that the coordinate system starts at (0, 0) in the top-left, with y increasing downward. Show position keywords like topleft, topright, bottomleft, bottomright, midtop, midleft, midright, midbottom, and center. Place the alien with alien.bottomleft = (0, HEIGHT) or other keywords and let the experiment. Improve wrapping logic so the alien fully leaves the screen before reappearing: use if alien.left > WIDTH: alien.right = 0 in update()."
					},
					{
						title: "Global Variables & Bouncing",
						content:
							"Introduce global variables as those defined outside a function. Create a global speed variable, e.g. xspeed = 5, and use it in update() with alien.x += xspeed. When modifying a global inside a function, declare it with global xspeed at the top of update(). Instead of wrapping, make the alien bounce off a wall by flipping the sign of xspeed when the alien hits an edge, e.g. when alien.right >= WIDTH, set xspeed = -xspeed."
					},
					{
						title: "PyG1 Project 1: Rainbow Fill",
						content:
							"Create a project where rows of color scroll across the screen. Use random.randint() if needed and a list of colors. In draw(), clear the screen and fill it with rectangles or strips of varying colors from a list. Each frame, update the list or indices so the colors appear to move or cycle.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG1-Rainbow-Fill.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_1_rainbow_fill.mp4"
					},
					{
						title: "PyG1 Project 2: Bouncing Alien",
						content:
							"Reuse the alien actor and give it dynamic attributes alien.xspeed and alien.yspeed. In update(), move the alien with alien.x += alien.xspeed and alien.y += alien.yspeed. When the alien hits the left/right or top/bottom edges, reverse the appropriate speed to make it bounce. Optional: start the alien in a random position and slightly increase its speed each time it hits a wall.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG1-Bouncing-Alien.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_1_bouncing_alien.mp4"
					},
					{
						title: "PyG1 Project 3: Wandering Ball",
						content:
							"Create a ball actor at the center of the screen. Define global xspeed and yspeed, and a helper resetBall() that moves the ball back to the center and assigns random non-zero speeds. In update(), move the ball using xspeed and yspeed, and when it goes offscreen call resetBall() to restart with new speeds. Challenge: ensure neither speed is ever zero so the ball always moves.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG1-Wandering-Ball.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_1_wandering_ball.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG2 Event Handling",
				curriculum: [
					{
						title: "Keyboard Events",
						content:
							'Introduce event listeners as code that runs when specific events happen. Show on_key_down(key) which is called when a key is pressed. First, move the alien on any key press, then restrict it with if key == keys.RIGHT: so it only moves right with the right arrow. For continuous movement, check in update() with if keyboard.right: to keep moving while the key is held. Use alien.angle = 180 when "w" is pressed, alien.angle = 0 (or similar) on "s" to reset, and alien.angle += 5 / alien.angle -= 5 on "a" and "d" to rotate left and right. Use on_key_up(key) when you need to respond to key releases, e.g. move the alien up 10 pixels when the space key is released.'
					},
					{
						title: "Mouse Events",
						content:
							'Use on_mouse_down(pos, button) to react when the mouse is pressed. Make the alien look hurt when clicked with alien.image = "alien_hurt". Use alien.collidepoint(pos) so the change only happens when the alien itself is clicked, and button == mouse.LEFT to limit behavior to left-clicks. Play a sound with sounds.eep.play(). Use on_mouse_up() to reset the alien image back to normal so it only looks hurt while the button is down. Implement on_mouse_move(pos) so the alien follows the mouse by setting alien.x and alien.y (or alien.pos) equal to the mouse coordinates.'
					},
					{
						title: "PyG2 Project 1: Arrow Point",
						content:
							"Create an arrow actor that always points toward the mouse. Use keyboard events to move the arrow if desired, and update arrow.angle so it faces the mouse position. Compute the angle based on the relative position of the mouse to the arrow and set or adjust arrow.angle accordingly.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG2-Arrow-Point.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_2_arrow_point.mp4"
					},
					{
						title: "PyG2 Project 2: Apple Collector",
						content:
							"Create an apple actor positioned randomly on the screen. Implement on_mouse_down(pos, button) to check if the click is on the apple; if so, move the apple to a new random position and optionally increase a score counter and play a sound. Draw the score text in the corner of the screen so the player can track how many apples they have collected.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG2-Apple-Collector.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_2_apple_collector.mp4"
					},
					{
						title: "PyG2 Project 3: Art Box",
						content:
							'Create a box actor that can be dragged and recolored. Use a global boolean like box_grab which is True when the mouse is held down over the box and False otherwise. In on_mouse_move(pos), move the box with the mouse only if box_grab is true. Store image names for different colors in a list and track the current index. Change the box\'s image when "a" or "d" is pressed by decrementing or incrementing the index, wrapping it around so it stays within the list\'s bounds.',
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG2-Art-Box.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_2_art_box.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG3 Object-Oriented Programming: Advanced Actors",
				curriculum: [
					{
						title: "ZRect Class",
						content:
							"Explain that a ZRect object represents a rectangle with position, width, and height, and can be used to draw shapes and detect overlaps. Define WIDTH and HEIGHT, then create a rectangle with box = ZRect((100, 100), (50, 50)). In draw(), use screen.draw.rect(box, (255, 0, 0)) to draw a red rectangle. Experiment with different colors using (r, g, b) values and practice creating rectangles that cover the whole screen or only half. Show that ZRects support the same position keywords as actors (e.g. box.center, box.topleft)."
					},
					{
						title: "PyG3 Project 1: ZRect Art",
						content:
							"Create an empty list to store ZRects. Use a for loop to create 10 rectangles with random positions and sizes and append each to the list. In draw(), loop through the list and draw every rectangle with random colors (random r, g, and b values between 0 and 255). This produces a randomized art piece each frame.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG3-ZRect-Art.py"
					},
					{
						title: "Colliderect and Contains",
						content:
							"Create a randomBox ZRect with size 50×50 at a random position and a middleBox ZRect centered on the screen with size 200×200. In draw(), use middleBox.colliderect(randomBox) to check if they overlap; draw randomBox blue when colliding, red otherwise, and always draw middleBox to visualize the area. Add on_mouse_down(pos, button) to move randomBox to the mouse position on click and test collision. Then replace colliderect with contains to see the difference between overlapping and being fully inside another rectangle. Mention that these functions also work for actors: if actor1.colliderect(actor2): ...."
					},
					{
						title: "PyG3 Project 2: Light Control",
						content:
							'Create a bulb actor centered on the screen and a battery actor near the top-left. In on_mouse_move(pos, buttons), move the battery to the mouse position only when the left mouse button is held. In update(), check if the bulb and battery collide; set the bulb image to an "on" version when colliding and an "off" version otherwise. In draw(), draw both actors so it looks like the battery powers the bulb when it touches.',
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG3-Light-Control.py"
					},
					{
						title: "Dynamic Attributes",
						content:
							"Explain that using many global variables for per-actor data doesn't scale. Instead, create dynamic attributes on actors, such as ball.xspeed = 10 and ball.yspeed = 5, and in update() move with ball.x += ball.xspeed and ball.y += ball.yspeed. Use dynamic attributes for values tied to a single actor (speed, lives, color), and reserve globals for overall game state like score, timers, or isGameOver."
					},
					{
						title: "PyG3 Project 3: Beach Ball Chase",
						content:
							"Create an alien actor (controlled by the player) and a ball actor with random position and random xspeed and yspeed dynamic attributes. In update(), move the alien with arrow keys (up/down/left/right) and move the ball by its speeds, bouncing it off the walls. When the alien collides with the ball, increase a score variable and move the ball to a new random position. In draw(), draw both actors and display the score at the top-left using screen.draw.text(str(score), (10, 10)). Encourage breaking logic into helper functions for keyboard input, ball movement, and collision checks.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG3-Beach-Ball-Chase.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_3_beach_ball_chase.mp4"
					}
				],
				supplementalProjects: [
					{
						title: "PYG3 Supplemental Project 1: Asteroid Dodge",
						content:
							"Build a game where a player-controlled actor dodges falling asteroid actors. Asteroids spawn at random x positions at the top and move downward; if the player collides with an asteroid, the game ends or the player loses a life. Track how long the player survives or how many asteroids they dodge.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG3-Asteroid-Dodge.py"
					}
				]
			},
			{
				title: "PyG4 Managing Multiple Objects: Collectibles",
				curriculum: [
					{
						title: "Lists of Actors",
						content:
							"Explain that lists let us manage many objects at once. Define WIDTH and HEIGHT, then create an empty list aliens = []. Use a loop to create 10 alien actors, give each xspeed = 5, and append them to the list. In draw(), use for alien in aliens: alien.draw(). In update(), move each alien with alien.x += alien.xspeed and reverse its direction when it hits a screen edge by flipping alien.xspeed. Emphasize the pattern of per-actor dynamic attributes plus list loops."
					},
					{
						title: "PyG4 Project 1: Bouncy Ball Room",
						content:
							"Create many ball actors with random starting x and y positions and random xspeed and yspeed attributes, storing them in a list. In draw(), loop through and draw each ball. In update(), move each ball and bounce it off the walls using ball.top, ball.bottom, ball.left, and ball.right, reversing the appropriate speed when a wall is hit. For ball–ball collisions, write checkBallCollision(b1, b2) to reverse both balls' speeds when they collide, and call it within a nested loop over all pairs of balls.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG4-Bouncy-Ball-Room.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_4_bouncy_ball_room.mp4"
					},
					{
						title: "PyG4 Project 2: Falling Squares",
						content:
							"Build a column of colored squares that fall down the screen together. Create a resetSquares() function that moves all squares back to the top and scrambles their colors or order using a list of allowed x-positions. Call resetSquares() when the blue square is clicked or when the row reaches the bottom. Use a speed variable to control fall speed and increase it each time the blue square is clicked so the game becomes more challenging.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG4-Falling-Squares.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_4_falling_squares.mp4"
					},
					{
						title: "PyG4 Project 3: Jewel Catch",
						content:
							"Create a spaceship actor controlled with left/right arrow keys and prevent it from leaving the screen. Set the background to white with screen.fill((255, 255, 255)). Create a list of 5 gem actors and 4 bomb actors at random x positions, each with a random xspeed between 1 and 3. In update(), move gems and bombs downward while also sliding them left/right, reversing horizontal direction when they hit the sides. Write checkGemCollision(gem) to reset a gem to the top when it hits the bottom or is caught by the rocket, awarding 5 points on catch. Write checkBombCollision(bomb) to reset bombs from the bottom or when they hit the rocket, subtracting 10 points on a hit.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG4-Jewel-Catch.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_4_jewel_catch.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "Check-In #1: Actors, Events, ZRects, Collectibles",
				curriculum: [
					{
						title: "Check-In #1: Actors",
						content:
							'Actors-1: Have set up the PyGame window with width 500 and height 400. Actors-2/3: Ask them to define what an actor is and create alien = Actor("alien"). Actors-4: Place the alien so it starts in the bottom-right corner of the screen. Actors-5/6: Draw the alien on the screen using draw() and alien.draw(). Actors-7: Define and explain global variables by creating xspeed and yspeed. Actors-8/9: Use yspeed to move the alien upwards and make it bounce off the top edge using speed reversal.'
					},
					{
						title: "Check-In #1: Event Listeners",
						content:
							"Event Listeners-1: Ask to define an event listener and name at least two types they have used (keyboard and mouse). Event Listeners-2/3: Make the alien change orientation or direction based on the arrow keys, and bounce it back on screen whenever it leaves the window. Event Listeners-4/5/6: When the left mouse button is clicked, move the alien to the clicked position using the mouse coordinates."
					},
					{
						title: "Check-In #1: ZRect and Dynamic Attributes",
						content:
							"ZRect-1: Ask what a ZRect is and when it is useful. ZRect-2/3/4: Create a blue ZRect of width 50 and height 50 at a random position and draw it to the screen. ZRect-5: Ask what dynamic attributes are and how they help attach data like speed or color to a specific object. ZRect-6: Use dynamic attributes to move the blue ZRect up and down the screen. ZRect-7: When the alien collides with the ZRect, change its color to a random one. ZRect-8: Discuss how program behavior changes if .colliderect() is replaced with .contains()."
					},
					{
						title: "Check-In #1: Collectibles",
						content:
							"Collectibles-1: Ask what happens when we want multiple boxes on screen and how lists help manage them. Collectibles-2/3: Create 10 blue ZRects, store them in a list, move them in random directions, and make them bounce off the edges of the screen. Collectibles-4: When any box collides with the alien, change its color to a random one. Collectibles-5: When boxes collide with each other, make them bounce off each other by reversing their speeds."
					},
					{
						title: "Check-In #1: Additional Practice Project",
						content:
							"Create a game where an alien collects coins. Coins increase the score by 1 when collected. Add three red blocks that move up and down the screen; if the alien touches a red block, the player loses 10 points and the alien resets to a random position. Discuss how to structure the game using actors, lists, and collision checks.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/Check-in-1-Additional-Practice-Solution.py"
					}
				],
				supplementalProjects: []
			},
			{
				title: "Check-In #2: Gravity, Friction, Platforms",
				curriculum: [
					{
						title: "Check-In #2: Gravity (Bigfoot Game)",
						content:
							"Gravity-setup: Start from the Bigfoot starter game (check_in_2_starter.py) and walk through the code so the understands how Bigfoot moves left and right with the arrow keys. Gravity-1: Ask what global variables and dynamic attributes are needed to add gravity (a global gravity and a yspeed attribute on Bigfoot; xspeed is optional). Gravity-2: Add these variables to the game. Gravity-3: In update(), apply gravity to Bigfoot by increasing yspeed and updating his y position. Gravity-4: Add code to stop Bigfoot at the floor instead of letting him fall through. Gravity-5: Add an event listener so pressing the up arrow makes Bigfoot jump."
					},
					{
						title: "Check-In #2: Friction (Shuffleboard Game)",
						content:
							"Friction-setup: Use the Shuffleboard starter game. The goal is to tweak friction so the puck stops at the center of the bullseye. Friction-1: Create global variable(s) to represent friction. Friction-2: Modify update() so friction gradually reduces the puck's speed by multiplying its velocity by a friction factor each frame. Friction-3: Tweak the friction value (roughly around 0.967) so the puck slows and stops in the bullseye's center, discussing how changing this value affects motion."
					},
					{
						title: "Check-In #2: Single Platforms",
						content:
							"Platforms-1: Ask how to represent a platform in code (e.g. a ZRect or actor) and how to add it to a game. Platforms-2: In the Bigfoot game, create a 200×20 platform in the middle of the screen and draw it. Platforms-3/4: Add collision logic so Bigfoot can jump onto and stand on the platform: check if his feet intersect the platform from above, snap his bottom to the platform top, and set his vertical speed to 0. Platforms-5: Make the platform move horizontally and bounce off walls by adding a dynamic xspeed attribute and reversing it at screen edges."
					},
					{
						title: "Check-In #2: Many Platforms",
						content:
							"Many-1: Discuss how to store many platforms using a list. Many-setup: Make a copy of the Bigfoot game file for a version with multiple platforms. Many-2: Create a list of 10 platforms with random sizes, positions, and colors and store the color as a dynamic attribute. Many-3: Modify draw() to draw all platforms using their color attributes. Many-4: Update collision logic so Bigfoot can stand on any platform in the list, not just one."
					},
					{
						title: "Check-In #2: Additional Practice Project",
						content:
							'Have modify one of their Bigfoot games so pressing the "f" key flips gravity upside down. When gravity is reversed, Bigfoot should fall upward without leaving the screen; adjust collision so he can stand against the top or bottom surfaces appropriately. Optionally, flip Bigfoot\'s sprite with bigfoot.angle = 180 when gravity is reversed and make moving platforms behave correctly with inverted gravity.',
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/Check-in-2-Additional-Practice-Solution.py"
					}
				],
				supplementalProjects: []
			},
			{
				title: "Check-In #3: System Control, Projectiles, Enemy AI",
				curriculum: [
					{
						title: "Check-In #3: System Control",
						content:
							"System Control-setup: Start from the rocket-and-targets starter code (check_in_3_starter.py) where the rocket moves left and right with arrow keys. System Control-1/2: Add a start screen so the game only begins when the user presses Enter; before that, draw a start message and ignore normal game updates. System Control-3: Ask what tool is used to schedule events in the future (PyGame Zero's clock or timers). System Control-4/5: Use a scheduled event to move the targets to new random positions every 5 seconds. System Control-6: Add logic that can cancel or stop this repeating movement when needed (for example, after a win condition)."
					},
					{
						title: "Check-In #3: Projectiles and Enemy AI",
						content:
							"Projectiles-1: When the space key is pressed, fire a laser from the spaceship. Move the laser upwards (or toward the target) and make the target disappear when hit. Initially, restrict to one laser at a time. Projectiles-2/3/4: Update the code to support multiple simultaneous lasers, typically by storing them in a list and iterating to move and draw them. Projectiles-5: Choose one target and make it exhibit simple AI: it should continuously move toward the spaceship while still relocating to a random position every few seconds and resetting properly when shot."
					},
					{
						title: "Check-In #3: Additional Practice Project",
						content:
							"Extend the Shark Chase game by adding a crab enemy that patrols along the bottom of the ocean. The crab should move left and right following the diver's horizontal position. If the crab touches the diver while the diver is not hiding in seaweed, the game should end. Bonus: if the diver is hiding in seaweed, make the crab move away instead of toward the diver, and occasionally have the crab jump using the game clock to schedule jumps.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/Check-in-3-Solution.py"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG5 Physics",
				curriculum: [
					{
						title: "Gravity and Wind",
						content:
							'Explain forces as changes in speed over time, focusing on gravity pulling objects downward and wind pushing sideways. Start a new project and create a ball Actor using the "beach_ball" image with dynamic attributes ball.xspeed and ball.yspeed, setting ball.yspeed = 3. Define draw() and update() so that ball.x and ball.y are updated each frame. Add a global GRAVITY = 0.1 and, at the top of update(), do ball.yspeed += GRAVITY before updating ball.y so the ball accelerates downward. Discuss what the ball\'s speed would be after 10 and 20 updates and experiment with different GRAVITY values. Then make the ball bounce off the floor by reversing yspeed when it goes off the bottom of the screen and clamping it back in with ball.bottom = HEIGHT. Introduce a WIND global (e.g., WIND = 0.05) and add ball.xspeed += WIND in update() to push the ball sideways; experiment with positive, negative, and zero WIND values and talk about how update order and rounding can cause bounce heights to drift over time.'
					},
					{
						title: "PyG5 Project 1: Keep Up",
						content:
							"Build a click-based juggling game where the player keeps a ball in the air. Create a ball Actor with dynamic xspeed and yspeed and global variables GRAVITY and score. In draw(), clear the screen, draw the score text, and draw the ball. In update(), apply GRAVITY to yspeed, update the ball\'s x and y with xspeed and yspeed, and make it bounce off the floor and optionally the top. Add wall-bounce logic on the left and right edges, for example: if ball.right > WIDTH: ball.right = WIDTH; ball.xspeed = -ball.xspeed, and similarly for ball.left < 0. Implement on_mouse_down(pos) so that if ball.collidepoint(pos) is True, the ball\'s yspeed is set to -3, xspeed is set to a random value between -15 and 15, and score is incremented. Have tweak speeds and gravity so the game feels fair but challenging.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG5-Keep-Up.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_5_keep_up.mp4"
					},
					{
						title: "Friction",
						content:
							"Introduce friction as a force that slows moving objects when they are in contact with a surface. Create a ball Actor whose bottom touches the bottom of the screen with dynamic attributes xspeed and yspeed, setting xspeed = 10 and yspeed = 0. Define a global FRICTION = 0.95 and in update() multiply ball.xspeed and ball.yspeed by FRICTION each frame before updating position. Have observe that fast motion slows quickly while slow motion tapers off gently when multiplying by a value slightly less than 1. Experiment with different starting speeds and friction values, including cases where FRICTION is closer to 1 (gentle slowing), much lower (rapid stop), and greater than 1 (the ball speeds up instead of slowing down) and discuss which feels realistic for games."
					},
					{
						title: "PyG5 Project 2: Golf",
						content:
							"Create a simple top-down golf game where the player clicks to hit a ball toward a hole. Add Actors for a golf ball, hole, and flag. Give the ball dynamic xspeed and yspeed and create global FRICTION and strokes variables. Place the hole in the center and the flag above it. In draw(), set the background with screen.fill((50, 100, 50)), draw the stroke count in the top-left corner, and draw the hole, flag, and ball. In update(), apply friction to the ball, update its position based on xspeed and yspeed, and make it bounce off the walls. Implement on_mouse_down(pos) so that if the ball is essentially stopped (abs(xspeed) and abs(yspeed) < 0.5), clicking sets ball.xspeed = (mouseX - ball.x) / 10 and ball.yspeed = (mouseY - ball.y) / 10, where mouseX and mouseY come from pos, and increments strokes by 1. Detect when the ball reaches the hole and handle a win state, resetting or advancing as desired.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG5-Golf.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_5_golf.mp4"
					},
					{
						title: "PyG5 Project 3: Ball Pit",
						content:
							"Simulate a ball pit with many bouncing balls. Create a list containing 10 ball Actors at random positions and give each ball random dynamic xspeed and yspeed. Define global GRAVITY and FRICTION. In draw(), loop through the list and draw each ball. In update(), for each ball add GRAVITY to its yspeed, multiply both xspeed and yspeed by FRICTION, update its position, and bounce it off the edges, reversing speed and clamping the ball back on screen when it goes out of bounds. Implement on_key_down(key) so that pressing the space bar randomizes the position and speed of all balls. Add on_mouse_down(pos) to loop through the balls and, when collidepoint(pos) is True for a ball, assign it a new random xspeed and yspeed to make it shoot off in a new direction.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG5-Ball-Pit.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_5_ball_pit.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG6 Managing Multiple Objects: Obstacles and Surfaces",
				curriculum: [
					{
						title: "Platforms with ZRect",
						content:
							"Introduce ZRect for solid platforms that a character can stand on. Create a floor ZRect at the bottom of the screen using floor = ZRect((0, HEIGHT - 20), (WIDTH, 20)) and draw it in draw() with screen.draw.filled_rect(floor, (255, 255, 255)). Create an alien Actor in the center with dynamic xspeed and yspeed. Add global GRAVITY and FRICTION and in update() apply gravity to yspeed, friction to xspeed, and update alien.x and alien.y so the alien falls through the floor. Then implement platform collision with if alien.colliderect(floor): alien.bottom = floor.top; alien.yspeed = 0 so the alien stands on the floor. Add keyboard.left and keyboard.right controls that adjust xspeed, and implement jumping with a space key. To prevent double jumps, create alien.onground = False, change the jump condition to if keyboard.space and alien.onground and set alien.onground = False when jumping, and set alien.onground = True inside the platform collision logic. Test that the alien can only jump when standing on the platform."
					},
					{
						title: "Moving Platforms",
						content:
							"Teach how to make platforms move and bounce between limits. Shorten the floor platform to 200 pixels wide and give it a dynamic floor.xspeed = 2. In update(), move it with floor.x += floor.xspeed and observe that it disappears off the right side. Add dynamic bounds floor.leftlimit = 0 and floor.rightlimit = WIDTH and, in update(), bounce with if floor.right > floor.rightlimit: floor.right = floor.rightlimit; floor.xspeed = -floor.xspeed and a similar condition when floor.left < floor.leftlimit. Encourage to experiment with different limits so the platform stays only on the right side or in the center third of the screen. Add yspeed, toplimit, and bottomlimit attributes to support vertical and diagonal motion and bounce vertically in a similar way."
					},
					{
						title: "PyG6 Project 1: Stay on the Platform",
						content:
							'Create a game where the player must stay on an increasingly difficult moving platform. Make a platform with dynamic xspeed, yspeed, leftlimit, rightlimit, toplimit, and bottomlimit and an alien Actor with xspeed, yspeed, and onground. Define update() to apply gravity and friction to the alien, process keyboard input to move and jump, move the alien by its speeds, move the platform and bounce it within its limits, and handle platform collision by setting alien.bottom to the platform\'s top, alien.yspeed = 0, and alien.onground = True. Define draw() to draw the alien, platform, and score text in the top-left. Create global lose = False and score = 0 and in update() declare them global, wrap all movement and game logic in if not lose:, increase the platform speed over time, and set lose = True if the alien falls off the bottom of the screen. Increment score each update or based on survival time. In draw(), show only the score and a "Game Over" message when lose is True.',
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG6-Stay-on-the-Platform.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_6_stay_on_the_platform.mp4"
					},
					{
						title: "Multiple Platforms with Lists",
						content:
							"Teach managing many platforms with a list. Create an empty list platforms and add a floor platform plus two smaller platforms (platform1 and platform2) above it. In draw(), loop through platforms and draw each one. Reuse your alien, gravity, friction, and jumping code. In update(), before checking collisions, set alien.onground = False. Then loop through platforms and use if alien.colliderect(p) and alien.yspeed >= 0: alien.bottom = p.top; alien.yspeed = 0; alien.onground = True so the alien snaps to the top of any platform it lands on while moving downward. Discuss how this prevents snapping when jumping up through a platform. Next, loop through platforms after creating them to set p.xspeed = 0 and p.yspeed = 0 for all; then manually set xspeed and yspeed for any moving platforms. Add limits with p.leftlimit = 0, p.rightlimit = WIDTH, p.toplimit = 0, and p.bottomlimit = HEIGHT in the same loop and, in update(), move each platform and bounce it inside its limits. Emphasize how using a list scales to many platforms with little extra code."
					},
					{
						title: "PyG6 Project 2: Platformer Game",
						content:
							'Design and build a full platformer level. With the , sketch a level layout (for example using https://aggie.io) including at least 8 platforms, at least 1 moving platform, a start position for the alien, and a diamond. Convert the drawing into a list of ZRects for platforms, then write draw() and run to verify platform positions. Add dynamic motion attributes to selected platforms and update() logic so they move and stay within their limits. Add an alien Actor that can walk and jump on platforms and resets to the start when it falls off the screen. Add a diamond Actor using the "diamond_s" image at the goal location. Create a global gameOver flag initially False and another variable to track whether the diamond has been collected. When the alien touches the diamond, set gameOver to True, hide the diamond, and display a "Game Over" or "You Win" text instead of the regular game view.',
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG6-Platformer-Game.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_6_platformer_game.mp4"
					},
					{
						title: "PyG6 Project 3: Falling Jump",
						content:
							'Create an endless survival game with falling platforms. Start with an empty platforms list and a loop that creates 10 ZRects at random horizontal positions. For each platform, add dynamic attributes yspeed and color (an (r, g, b) tuple) and append it to platforms. Define draw() to draw all platforms. Add an alien Actor that moves left and right, is affected by gravity, and falls off-screen if unsupported. In update(), move each platform downward by its yspeed and when a platform goes below the bottom, send it back to the top with a new random position. Implement collision so that when the alien lands on a platform its yspeed becomes a negative value (a bounce). Create a global gameOver flag that, when True, stops motion and triggers a "Game Over" message in draw(). Encourage to tune bounce strength and platform speeds for a fair challenge.',
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG6-Falling-Jump.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_6_falling_jump.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG7 Levels and System Control",
				curriculum: [
					{
						title: "Game Screens with gameState",
						content:
							'Introduce the concept of multiple game screens such as start, play, pause, and end. Create an alien Actor in the center of the screen and a global string gameState = "start". In on_key_down(), when the space key is pressed, change gameState to "play". In draw(), use if/else on gameState so that when gameState is "start" you show only text like "Press Space to Play!" and when it is "play" you draw the alien and hide the start text. Discuss how this pattern can extend to pause and game-over screens later and why using a small set of string states keeps the logic organized.'
					},
					{
						title: "Time Module and Pausing",
						content:
							"Explain that Python\'s time module provides utilities for working with real time. Import time at the top of the file. Modify a simple alien-running game so that when the alien reaches the right edge of the screen, the game pauses for one second before resetting the alien to the left. Use time.sleep(1) to introduce a blocking delay and discuss its limitations: it freezes the entire game loop and is only appropriate for brief transitions or very simple effects."
					},
					{
						title: "Clock Scheduling in Pygame Zero",
						content:
							'Show how to schedule functions without freezing the game using Pygame Zero\'s clock. Create an alien that can be clicked to change its image to a "hurt" version. Define setAlienNormal() to restore the alien\'s normal image. Replace any time.sleep calls with clock.schedule_unique(setAlienNormal, 1.0) in the click handler so the alien looks hurt for one second while the game keeps running. Next, define moveRandom() to move the alien to a random screen position and use clock.schedule_interval(moveRandom, 0.5) when the player presses space so the alien teleports every half second. Add clock.unschedule(moveRandom) when the player presses "s" to stop the movement. Emphasize that schedule_unique runs once after a delay, schedule_interval runs repeatedly, and unschedule cancels scheduled callbacks.'
					},
					{
						title: "PyG7 Project 1: Alien Catch",
						content:
							"Build a game that uses multiple screens and timing to challenge the player\'s reactions. Show the final Alien Catch solution and discuss how many screens it has and how alien speed changes. Implement a start screen where the user presses Enter to begin (keyboard.RETURN or keyboard.kp_enter depending on the key). In play mode, have an alien move horizontally across the screen while the player presses space to stop the alien. If the alien stops on top of a target square, the player gains a point and the alien\'s speed increases; otherwise, the player loses a life. Before each new run, use time.sleep or a clock-based delay to pause for one second so the player can prepare. Track lives with a global variable and, when lives reach zero, switch gameState to an end screen where the player can press Enter/Return to play again or Escape to quit using quit().",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG7-Alien-Catch.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_7_alien_catch.mp4"
					},
					{
						title: "PyG7 Project 2: Beach Ball Dodge",
						content:
							"Create a survival game where a blue square dodges moving beach balls while two scheduled functions track difficulty and time. Show the final Beach Ball Dodge solution and identify its screens, components, and how the square changes over time. Implement a start screen controlled by the space key. In play mode, let the player move a blue square using the arrow keys while beach balls move horizontally across the screen. Create increaseSize(), which uses inflate_ip(w, l) to grow the square, and schedule it with clock.schedule_interval(increaseSize, 5) so the square increases in size every 5 seconds. Create increaseTimer(), which increments a timer variable and schedule it every second to track survival time. Ensure these scheduled functions start only when the game starts and are cancelled or stopped once the game ends. When the player collides with a beach ball, show an end screen displaying how long they lasted, and allow them to restart with space or quit with Escape.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG7-Beach-Ball-Dodge.py"
					},
					{
						title: "Level Design Concepts",
						content:
							"Discuss levels as a way to keep games challenging. Explain pre-generated levels (fixed layouts, specific enemy or power-up locations, designed maps) versus randomized levels (enemies or collectibles spawn at random positions or times). Point out that many games mix both approaches, using a pre-built map with some random enemy or item spawns. Introduce a global level variable to track the current level and show how it can drive logic such as difficulty, spawn rates, and layout changes. Connect this to gameState so it\'s clear which screen is active versus which level is being played."
					},
					{
						title: "PyG7 Project 3: Number Count",
						content:
							'Implement a memory and timing game that uses levels, music, and multiple screens. Show the final Number Count solution and discuss its components, how they interact, and how many screens it includes. On the start screen, let the player select easy, medium, or hard difficulty. Initialize the player with 3 lives and 3 numbered blocks in level 1. For each level, display purple tiles that show numbers in order; after the player clicks the tile labeled "1", hide numbers on the other tiles and start a timer. Track which number the player should click next with a variable and, when they click correctly, play a chime and keep that tile\'s number visible. Use music.play("tune.mp3") for background music. When time runs out, reduce lives by one; when lives reach zero, show a game-over screen where the player can choose to play again or quit with the space and Escape keys. When the player completes all 15 levels, show a winning end screen with a congratulatory message and restart options. Discuss how to store and increment the level and how to scale the number of tiles with each level.',
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG7-Number-Count.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_7_number_count.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG8 Game Elements: Projectiles",
				curriculum: [
					{
						title: "Single Projectile Mechanics",
						content:
							'Introduce projectiles as common game elements such as bullets, arrows, or magic spells. Create a simple scene with an alien Actor on the left side of the screen. Define a ZRect p representing a projectile with a small width and height (e.g., 10x10). Add a global boolean fired = False to track whether the projectile is currently in flight. In on_key_down(key), when space is pressed and fired is False, set fired = True and position p at the alien\'s current location. In update(), if fired is False, keep p locked to the alien and do not draw it; if fired is True, move p to the right each frame. In draw(), only draw the projectile when fired is True. When p reaches the right edge of the screen, reset fired to False so the player can fire again. Discuss how this pattern can generalize to any weapon or spell that must "return" before firing again.'
					},
					{
						title: "PyG8 Project 1: Target Shoot",
						content:
							"Develop a ninja-target shooting game using a single reusable projectile. Show the finished Target Shoot solution and discuss its components and how many screens it has. Add a start screen where the player presses Enter to begin. Create a ninja Actor that can move left, right, and jump on platforms using the arrow keys and space bar. Add a ninja star projectile that fires in the direction the ninja is facing when space is pressed and prevent firing a new star until the current one hits something or leaves the screen. Track the direction of the ninja with a property (e.g., facing left or right) and use it to set the projectile\'s x speed. When the star collides with a target, a platform, or the edge of the screen, hide it and reset it to the ninja so another shot can be fired. Move the target to a new location when it is hit. Track how many targets are hit; require the player to hit 10 targets before time runs out to win, otherwise display a loss message on an end screen. Allow restarting from the end screen and quitting with Escape.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG8-Target-Shoot.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_8_target_shoot.mp4"
					},
					{
						title: "Multiple Projectiles with Lists",
						content:
							"Explain that many games allow firing multiple bullets at once and that storing projectiles in a list is the natural solution. Create a global list projectiles. In on_key_down(key), whenever space is pressed, build a new projectile (e.g., a small ZRect or Actor) at the firing origin and append it to projectiles. In update(), loop through projectiles and advance each projectile in the appropriate direction. In draw(), iterate through projectiles and draw each one. Add logic so that if a projectile reaches the end of the screen, it is removed from the list to free memory and avoid clutter. Discuss safe removal patterns (such as building a new list or iterating over a copy) so the does not modify the list while iterating over it in a naive for-loop."
					},
					{
						title: "PyG8 Project 2: Asteroid Shoot",
						content:
							"Create a classic bottom-shooter game where a rocket fires multiple lasers at falling asteroids. Show the final Asteroid Shoot solution and identify its main components and interactions. Add a start screen that requires pressing Enter to start. Create a rocket Actor at the bottom of the screen that moves left and right with the arrow keys. Create a list player_lasers; when space is pressed, append a new laser to this list starting at the rocket\'s position. In update(), move lasers upward and remove any that leave the top of the screen. Create multiple asteroid Actors falling from the top; when a laser collides with an asteroid, remove the laser (checking it is still in the list to avoid errors) and reset the asteroid to a random position at the top. If any asteroid reaches the bottom or collides with the rocket, end the game. Increase asteroid speed every five seconds to ramp up difficulty. At game over, display how long the player survived and allow restarting with Enter and quitting with Escape.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG8-Asteroid-Shoot.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_8_asteroid_shoot.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG9 Game Elements: Enemy AI",
				curriculum: [
					{
						title: "PyG9 Project 1: Shark Chase (Fish Bowl)",
						content:
							"Build a Fish Bowl game where a shark chases a diver and seaweed can hide the player. Show the completed Shark Chase or Fish Bowl solution and ask how the diver is controlled, what happens when fish are collected, what happens when the shark catches the diver, how the shark behaves, and what happens when the player goes behind seaweed. Create a diver Actor controlled with the arrow keys; apply gravity and friction in both x and y directions for an underwater feel and prevent the diver from leaving the screen. Add a shark Actor with dynamic xspeed and yspeed; first test it by giving fixed speeds and moving it each frame. Define setDirection() to compute xspeed and yspeed so the shark moves toward the diver's current position (similar to the vector math used in the Golf project to move the ball toward a click). Use clock.schedule_interval(setDirection, 1.0) so the shark retargets the diver every second. Add a seaweed Actor and modify setDirection() so that if the diver is fully inside the seaweed, the shark's xspeed and yspeed become random values, simulating the shark \"losing sight\" of the player. Add game-over logic when the shark catches the diver and any needed gameState variables. Create a school of fish that swim across the screen and award points when the diver collects them, showing the score on screen.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG9-Shark-Chase.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_9_shark_chase.mp4"
					},
					{
						title: "PyG9 Project 2: Space Battle",
						content:
							"Create a boss-style Space Battle where an alien ship with AI fires at the player. Show the final Space Battle solution and discuss how the alien acts and how the lasers are created and stored. Create an alien Actor with dynamic xspeed and health that moves horizontally and bounces off the walls, speeding up each time it changes direction. Create a list enemy_lasers to hold enemy projectiles. Define alien_shoot() to spawn a new laser from the alien and add it to enemy_lasers. To simulate random firing, schedule alien_shoot() at several different intervals (e.g., 1.0, 1.3, 0.6 seconds) so the shots do not line up predictably. Create a player rocket at the bottom of the screen with a health attribute and allow it to move left and right with the arrow keys. Create a list player_lasers and add a new laser on each space press. In update(), move all lasers, remove them when they go offscreen, and check collisions: player lasers hitting the alien reduce its health; enemy lasers hitting the player reduce the player\'s health. End the game when either health reaches zero and display a win or loss message. Encourage to think of this as a simple AI that reacts by shooting at semi-random times and moving in a pattern.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG9-Space-Battle.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_9_space_battle.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG10 Ninja Versus Alien",
				curriculum: [
					{
						title: "PyG10 Project 1: Ninja Versus Alien",
						content:
							"Use Ninja Versus Alien as a capstone that combines movement, physics, projectiles, enemy AI, and game states. Show the finished game and plan the structure together. Identify all actors (such as ninja, alien, projectiles, platforms, and power-ups), which ones use gravity and friction, and where lists are needed (for multiple projectiles or enemies). Implement the game largely on your own, reusing patterns from previous modules: platforming movement and jumping for the ninja, projectiles for both players, enemy AI for the alien, score and health tracking, and gameState for start, play, and end screens. Reason through each subsystem (movement, shooting, collisions, scoring, win/lose) and wire them together into a complete game.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG10-Ninja-Versus-Alien.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_10_alien_vs_ninja.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG11 Space Invaders",
				curriculum: [
					{
						title: "PyG11 Project 1: Space Invaders",
						content:
							"Create a Space Invaders–style game that reviews everything learned in the course. Show the finished Space Invaders solution and plan the implementation together. Identify the key actors (player rocket, alien rows or grids, barriers, lasers, and possibly power-ups), how the alien fleets move as a group and change direction, what happens when barriers are hit, and how many screens the game has (start, play, end). Implement the game as independently as possible, reusing building blocks from earlier projects: lists for aliens and projectiles, collision detection, health or lives, scoring, gameState, and possibly levels where alien speed ramps up or formation patterns change. Think about code organization, such as grouping alien movement logic and separating player control from enemy AI.",
						solutionLink:
							"https://github.com/instruction-material/Python-Courses/blob/main/PyGames/PyG11-Space-Invaders.py",
						mediaLink:
							"https://static.classes.jacobdanderson.net/pyg_11_space_invaders.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG12 Master Project",
				curriculum: [
					{
						title: "Recap & Readiness Check",
						content:
							"Ask what was done to build Space Invaders and which parts were most enjoyable. At the start of this module, evaluate readiness to move on to Python Level 2 after finishing PyGame, keeping in mind that Juni courses are designed to flow continuously. If you are the instructor, follow the platform\'s process for updating the course when the learner is ready and reach out to support with any sequencing questions."
					},
					{
						title: "PyG12 Project 1: Master Project",
						content:
							"Guide the scoping and building of an original Master Project that showcases everything learned. Start by discussing favorite games on phone or computer and brainstorming ideas that fit within the course\'s time frame. Once a concept is chosen, write out the steps needed to program the project, including actors, physics, projectiles, screens, levels, and any AI behaviors desired. Encourage implementing the project as independently as possible, using class time for planning and debugging rather than typing every line. Aim for a project that spans about two weeks of class, with significant progress made as homework between sessions. If a more complex project or multiple projects are desired, coordinate expectations and communicate with Juni HQ as needed.",
						solutionLink: ""
					},
					{
						title: "Bonus Concepts for Assets",
						content:
							"If the wants to use images or sounds outside the provided asset bank, have them prototype with placeholder assets first and then, for homework, find or create the final images and sounds. Teach them how to resize images using free online tools so they match typical sprite sizes (for example, the standard alien is about 66 pixels wide by 92 pixels tall) and how to crop or normalize sounds. Encourage them to explore the PyGame Zero documentation for ideas such as more advanced input, music control, and simple particle effects that can make their Master Project feel more polished."
					},
					{
						title: "Master Project Presentation",
						content:
							"Once the project is complete or reaches a solid milestone, have present their game to you and any available family members. Ask them to explain their game concept, how they structured their code, what problems they solved along the way, and which concepts from the course they used (actors, physics, projectiles, AI, game states, levels). Encourage them to think of this as a portfolio piece they could show future teachers or mentors."
					},
					{
						title: "Course Recap & Next Course",
						content:
							"Wrap up by asking the to recap the main ideas from the entire PyGame course: actors, events, physics, platforms, projectiles, enemy AI, levels, and game states. Discuss Python Level 2 as the next step, explaining that they will continue building on their Python skills and move into more complex logic and program structures. If you are their instructor, proceed directly into Python Level 2 once the Master Project is done, and use the first few sessions there to connect new concepts back to the games they just built."
					}
				],
				supplementalProjects: []
			}
		]
	},
	{
		name: "C++ Level 1",
		modules: [
			{
				title: "CPPF1 Variables, Types, and Input/Output",
				curriculum: [
					{
						title: "Creating and Running a C++ Script",
						content:
							'Use an online C++ editor such as repl.it to compile and run code. Create a C++11 file named Objects and Variables and run the starter line `std::cout << "Hello World!\\n"` to print to the console. Show how `std::endl` adds a newline, what happens if it is missing, and that each statement ends with a semicolon.'
					},
					{
						title: "Primitive Types",
						content:
							"Reference: https://repl.it/@JuniLearning/CPPF1-Primitive-Types-and-Strings-Reference?skipMigration=1 Explain fundamental data types: integers, floating point numbers, booleans and characters. Demonstrate declaring variables with and without initial values and initializing several of the same type on one line. Create an integer myAge, a double myRating for a movie rating, and show arithmetic operators including %. Illustrate mod with 10 / 3 = 3 and 10 % 3 = 1. Cast a double to an int when printing. Create a boolean isHot and a char myChar for the first letter of your last name."
					},
					{
						title: "String",
						content:
							"Explain the `std::string` type and add `#include <string>` to use it. Create `myString` with double quotes, print its first letter with indexing, and use `string.length()` to print its length. Concatenate two strings and print the result. Demonstrate `str.insert(i, otherStr)` and `str.insert(i, amt, char)` to insert strings or characters."
					},
					{
						title: "Input and Output",
						content:
							'Reference: https://repl.it/@JuniLearning/CPPF1-Input-and-Output-Reference?skipMigration=1 Explain streams for input and output. Use the insertion operator (`<<`) to print "Enter your name: " to the console. Create a string variable name, use the extraction operator (`>>`) to read the response, and print "Nice to meet you, ___!" with the input inserted. Include `#include <iostream>` at the top. Explain `cin` and `cout`, and note that `<<` and `>>` point to where information is sent.'
					},
					{
						title: "Comments",
						content:
							"Add single-line comments with `//` to describe code. Use multi-line comments `/* ... */` to comment out sections of code and observe that commented code does not run."
					},
					{
						title: "Compilation (Advanced Concept)",
						content:
							"Explain that `std` stands for standard and `::` is the scope resolution operator that identifies where a function comes from. When you click Run, the compiler checks C++ rules, reports errors with line numbers, and then translates code into an object file."
					},
					{
						title: "CPPF1 Project 1: Mad Libs",
						content:
							"Demo the Mad Libs example, then build your own: create several string variables, prompt for inputs with `std::cin`, and use string concatenation or multiple insertion operators to print the final story. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF1-Mad-Libs-Solution"
					},
					{
						title: "CPPF1 Project 2: Chatbot",
						content:
							"Create a chatbot: ask for a name and respond, ask for a sentence and use `str.insert()` to insert **achoo** to make the bot sneeze, convert Fahrenheit to Celsius with float values, and convert a dollar amount to another currency. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF1-Chatbot-Solution"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF2 Loops and Conditionals",
				curriculum: [
					{
						title: "For Loops",
						content:
							"Explain that a loop repeats code. Show the three parts of a `for` loop: initialization variable, termination condition and increment, separated by semicolons. Practice printing 0–10, 11–20, even numbers from 2 to 10, numbers from 10 to 1, letters of a word forward and backward, the sum of 1 to 100, and the factorial of 10. Discuss ++, --, and compound assignment (+=, -=, *=, /=)."
					},
					{
						title: "While Loops",
						content:
							"Show how a `while` loop repeats until a condition is no longer true. Print numbers 0–9 with `while (x < 10)` and incrementing inside the loop. Redo the for-loop exercises using while loops."
					},
					{
						title: "CPPF2 Project 1: Number Games",
						content:
							"Use both `for` and `while` loops for each part: ask for a number and a larger number and print all numbers between them, ask how many numbers to enter and print their sum, then print the average using double division. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF2-Number-Games?skipMigration=1"
					},
					{
						title: "Conditionals and Logical Operators",
						content:
							"Introduce conditional statements with examples like `if (1+1 == 2)`. Explain comparison operators (==, !=, >, <, >=, <=) and logical operators `&&` (and) and `||` (or). Show `if`, `if-else`, and `if... else if... else` chains and how nested conditionals work."
					},
					{
						title: "CPPF2 Project 2: Rock, Paper, Scissors",
						content:
							"Use conditionals to build Rock, Paper, Scissors. Check each player's choice with nested conditionals to determine the winner. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF2-Rock-Paper-Scissors-Solution"
					},
					{
						title: "CPPF2 Project 3: FizzBuzz",
						content:
							'Print numbers 1 through 50. For multiples of 3 print "Fizz," for multiples of 5 print "Buzz," and for multiples of both print "FizzBuzz." Review the % operator with simple examples. Bonus: allow any two input numbers for a customizable FizzBuzz. Prepare a short presentation to share with friends or family.',
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF2-FizzBuzz-Solution"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF3 Functions",
				curriculum: [
					{
						title: "Basic Function Structure in C++",
						content:
							"Explain that functions run specific code repeatedly without rewriting it. Show syntax with return type, name and parameters, for example `int add(int x, int y) { int r = x + y; return r; }`, and how to call it. Note that parameters take the values of arguments and do not need matching names. Demonstrate declaring a function before it is called, using return values, and when to use `void`."
					},
					{
						title: "CPPF3 Project 1: Function Practice",
						content:
							"Write functions that: take two integers and return their precise average, check if an integer is even, return the smallest of three distinct doubles, return the factorial of an integer, and compute a positive integer base raised to a power.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF3-Function-Practice-Solution"
					},
					{
						title: "Random Numbers",
						content:
							"Use `rand()` to generate random numbers and seed with `srand(time(0))` so results change each run. `rand() % num` gives a value between 0 and num - 1. For a range like 15–75, use `rand() % (max - min + 1) + min`, and check odd/even with `rand() % 2`."
					},
					{
						title: "CPPF3 Project 2: Probability Events and Random",
						content:
							'Write functions that simulate probability events: flip a coin and return "heads" or "tails," roll two dice and return the sum, and draw a card returning "value of suit" such as "10 of Diamonds" or "King of Spades." Discuss suits and card values. Prepare a short presentation to share with friends or family.',
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF3-Probability-Events-Solution"
					},
					{
						title: "CPPF3 Project 3: Number Guesser",
						content:
							"Create a game that picks a random number between a user-provided range and allows a set number of guesses. Break the program into functions for the range, random number, prompting guesses and giving higher/lower feedback. End when the number is guessed or guesses run out. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF3-Number-Guesser-Solution"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF4 Classes and Objects",
				curriculum: [
					{
						title: "Object Oriented Programming Basics",
						content:
							"Explain object oriented programming using objects to hold data so code is extensible and reusable. Introduce classes as templates for creating objects, using examples like grouping properties of social media posts. Define an object as an instance of a class."
					},
					{
						title: ".h Files and .cpp Files",
						content:
							'Reference: https://repl.it/@JuniLearning/CPPF4-Point-Class Create a new project with point.cpp and point.h. Place declarations in the .h header file and implementations in the .cpp source file. Use the scope resolution operator with Point:: before functions in the .cpp file, and `#include "CLASS_NAME.h"` in .cpp and main files. Add header guards with `#ifndef CLASS_H`, `#define CLASS_H`, and `#endif` to avoid multiple inclusions.'
					},
					{
						title: "Public and Private Variables",
						content:
							"Describe encapsulation: keep sensitive data private and expose needed functions as public. Make variables like x and y coordinates private and keep functions public unless they should be hidden."
					},
					{
						title: "Class Functions",
						content:
							'Explain constructors, starting with a default constructor that sets values to 0 and an overloaded constructor that accepts x and y values. Add getters and setters for x and y. In main, use getters to print "The point\'s coordinate is (x, y)" to test access to private variables.'
					},
					{
						title: "CPPF4 Project 1: Person Class",
						content:
							"Build a Person class with private variables such as name, age and height (in inches), plus any others you choose. Include at least two constructors (default and one with parameters), getters and setters, and a toString function that converts height from inches to feet + inches (for example, 66 to 5' 6\"). Consider a private helper for the height conversion. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF4-Person-Class?skipMigration=1"
					},
					{
						title: "The Base Member Initialization List (BMI)",
						content:
							"Reference: https://repl.it/@JuniLearning/CPPF4-Person-Class-with-BMI Explain how a base member initialization list quickly initializes private variables. Show the order matching declarations in the .h file and the syntax Class::Class(params) : var(value) {}. Update Person constructors to use BMI."
					},
					{
						title: "CPPF4 Project 2: Cat Class",
						content:
							'Create a Cat class. Include a default constructor (name "cat," breed "unknown," age 0, color "unknown") and an overloaded constructor, both using BMI. Add changeAge, changeBreed, toString, meow, eat, and pet functions. Bonus: use "year" instead of "years" when the cat is one year old. Prepare a short presentation to share with friends or family.',
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF4-Cat-Class?skipMigration=1"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF5 Pointers",
				curriculum: [
					{
						title: "Memory and Pointers",
						content:
							"Reference: https://repl.it/@JuniLearning/CPPF5-Pointers Explain that memory locations have unique addresses visible with & before a variable. Create an int variable, print its address, and create a pointer with `int*` pointing to that address. Show dereferencing with `*` to access or change the value, assigning one pointer to another, changing pointer targets, and setting a pointer to `nullptr` when it points to nothing.",
						projectLink:
							"https://repl.it/@JuniLearning/CPPF5-Pointers-Reference"
					},
					{
						title: "CPPF5 Project 1: Pointers Introduction",
						content:
							"Answer conceptual questions about pointers: printing `*p1` vs. `p1`, changing `*p1`, copying pointers, dereferencing uninitialized or `nullptr` pointers, and why assignments like `*p1 = &val1` are incorrect.",
						projectLink:
							"https://repl.it/@JuniLearning/CPPF5-Pointers-Starter?skipMigration=1",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF5-Pointers?skipMigration=1"
					},
					{
						title: "CPPF5 Project 2: Problems Using Pointers",
						content:
							"Write code that demonstrates common pointer issues and observe the errors: dangling pointers, dereferencing a `nullptr`, improper initialization (`int* p1, p2`), uninitialized pointers, assigning values directly to pointer variables, and data type mismatches. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF5-Pointer-Error-Examples?skipMigration=1"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF6 References and Parameter Passing",
				curriculum: [
					{
						title: "References",
						content:
							"Explain that a reference is an alias for another variable, created with & after the type (for example, `int& ref1 = intVal1`). Changing the reference changes the original, which is useful in function parameters."
					},
					{
						title: "Parameter Passing",
						content:
							"Reference: https://repl.it/@JuniLearning/CPPF6-Parameter-Passing-Introduction Discuss passing by value (creates a local copy), by reference (modifies the original) and by const reference (efficient but unmodifiable). Show examples where spacing around & is flexible: int &param, int& param, int &param."
					},
					{
						title: "CPPF6 Project 1: Parameter Passing Tracing",
						content:
							"Write comments predicting how values change when passed by value, reference and const reference, then call the functions to test. Explain why const references cannot be modified.",
						projectLink:
							"https://repl.it/@JuniLearning/CPPF6-Parameter-Passing-Starter?skipMigration=1",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF6-Parameter-Passing-Tracing?skipMigration=1"
					},
					{
						title: "CPPF6 Project 2: Defanging a Website Address",
						content:
							"Defang a URL by turning periods into `[.]`. Write one function that edits the string directly (pass by reference) and another that builds and returns a new defanged string (pass by value), possibly using `str.replace()`.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF6-Defanging-a-Website-URL?skipMigration=1"
					},
					{
						title: "CPPF6 Project 3: Chaos Monkeys",
						content:
							"Write functions that pass strings by value, by reference and by const reference, inserting random characters with `insert(int index, int quantity, char newChar)`. Avoid infinite loops when the string length changes inside a loop. Bonus: add more scrambling functions. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF6-Chaos-Monkeys?skipMigration=1"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF7 Arrays",
				curriculum: [
					{
						title: "Array Basics",
						content:
							"Reference: https://repl.it/@JuniLearning/CPPF7-Array-Basics-Reference Explain that arrays store ordered values of the same type. Declare an array with type, name and size such as `int nums[10]`, or initialize with `int arr[] = {1,2,3}`. Access and change elements by index. Use sizeof(array) / sizeof(array[0]) to find length, loop to update and print elements, and note that printing an array name shows an address, so loop to print values."
					},
					{
						title: "Arrays in Memory",
						content:
							"Reference: https://repl.it/@JuniLearning/CPPF7-Pointer-Arithmetic-Reference Explain that arrays are contiguous memory and act like pointers to the first element. Create a pointer to the first element with `int *p1 = arr1`. Show accessing elements with pointer arithmetic like `*(p1 + index)` and advancing pointers with `p++`, warning about undefined behaviour outside the array."
					},
					{
						title: "CPPF7 Project 1: Array Practice",
						content:
							"Create and print an array of the first 10 perfect squares. Write functions that check whether the first and last array elements match, sum the elements of an int array, and return the total letters across an array of strings. Explain passing arrays to functions as `type arr[]` or as pointers.",
						projectLink:
							"https://repl.it/@JuniLearning/CPPF7-Array-Practice-Starter?skipMigration=1",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF7-Array-Practice?skipMigration=1"
					},
					{
						title: "CPPF7 Project 2: Bank Accounts",
						content:
							"Ask for the number of transactions in the past month, store withdrawals and deposits in an array with a loop, and write a function to calculate and print the final balance. Bonus: alert if the balance is low. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF7-Bank-Accounts?skipMigration=1"
					}
				],
				supplementalProjects: [
					{
						title: "CPPF7 Supplemental Project 1: Tic Tac Toe",
						content:
							"Use arrays and functions to build Tic Tac Toe. Plan the game steps, use an array to track moves, create a function to check all winning combinations, a function to print the board with dividers, and track players' moves while handling invalid choices. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF7-Tic-Tac-Toe?skipMigration=1"
					}
				]
			},
			{
				title: "CPPF8 Two-Dimensional Arrays",
				curriculum: [
					{
						title: "Two-Dimensional Arrays",
						content:
							"Reference: https://repl.it/@JuniLearning/CPPF8-Two-Dimensional-Arrays-Reference Create a 2D array such as `int arr[10][10];` and with initializer lists like `int arr[3][3] = {{1,2,3},{4,5,6},{7,8,9}};`. Calculate rows with sizeof(array) / sizeof(array[0]) and columns with sizeof(array[0]) / sizeof(array[0][0]). Access elements with arr[i][j] and print with nested loops."
					},
					{
						title: "Using Two-Dimensional Arrays in Functions",
						content:
							"Pass a 2D array into a function as `(int *arr, int row, int col)` and access elements in contiguous memory with `*((arr + i*n) + j)`. Show returning arrays from functions with `int**` for 2D arrays and `int*` for 1D arrays, such as a function returning numbers 0 through n."
					},
					{
						title: "CPPF8 Project 1: Two-Dimensional Array Practice",
						content:
							"Write methods that: sum all integers in a 2D array, find the minimum integer, return an n x n multiplication table and print it in a grid, and return a 1D array of the averages of each row as floats.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF8-2D-Array-Practice?skipMigration=1"
					},
					{
						title: "CPPF8 Project 2: Bank Balances",
						content:
							"Use a 2D array to track customers and recurring transactions. Build a `print()` function with nested for loops to show a grid, then implement the data structure for user interaction. Prepare a short presentation to share with friends or family.",
						projectLink:
							"https://repl.it/@JuniLearning/CPPF8-Two-Dimensional-Arrays-Reference",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF8-Bank-Transactions?skipMigration=1"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF9 Dynamic Arrays and Memory",
				curriculum: [
					{
						title: "Dynamic Variables",
						content:
							"Reference: https://repl.it/@JuniLearning/CPPF9-Dynamic-Variables-Reference Explain static variables and dynamic (anonymous) variables created at runtime with `new`, such as `int *p1 = new int;`. Store values with `*p1 = 5` or `std::cin >> *p1`. Always delete dynamic memory with `delete p1` to avoid leaks, and note that dereferencing after delete is a dangling pointer. Use `nullptr` to indicate a pointer to nothing.",
						projectLink:
							"https://repl.it/@JuniLearning/CPPF9-Dynamic-Variables-Reference"
					},
					{
						title: "CPPF9 Project 1: Assembly Line",
						content:
							"Create an Object class with name and weight (lbs), a BMI-based constructor, and a print function that outputs name, weight in pounds, and weight in kilograms (1 kg = 2.205 lbs). Repeatedly collect info to create a dynamic Object, print it, and free its memory before the next one. Bonus: ask how many Objects to process, store them in an array, then print each. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF9-Assembly-Line?skipMigration=1"
					},
					{
						title: "Introduction to Dynamic Arrays",
						content:
							"Static arrays have fixed size. To handle more data, declare a pointer, create the array with `new`, use the pointer like an array, and when out of space create a new array with double capacity, copy values over, delete the old array, and free memory with `delete` when done."
					},
					{
						title: "Dynamic Arrays and Memory",
						content:
							"Explain dynamic arrays that resize when full by allocating new space, copying old values and deleting the old array. Not calling delete causes memory leaks. When a class allocates memory, include a destructor `~ClassName` to free it when the object goes out of scope."
					},
					{
						title: "CPPF9 Project 2: Dynamic Array Implementation",
						content:
							"Implement a DynamicArray class. Private members: `mysize`, `maxSize`, and `int* myVals` (optionally a DEFAULT_SIZE). Default constructor sets `mysize` to 0, `maxSize` to a default size and allocates `myVals`. Destructor deletes `myVals` and resets `mysize`. `addVal(int val)` checks capacity, doubles size when full by creating a new array, copying values, swapping pointers, deleting the old array, then adding the value and incrementing `mysize`. `printVals()` iterates over stored values, and `get(index)` returns the value at an index.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF9-Dynamic-Array-Implementation?skipMigration=1"
					},
					{
						title: "Introduction to Structs",
						content:
							"Reference: https://repl.it/@JuniLearning/Structs-Example Explain that a struct is similar to a class but members are public by default. Structs group small related data such as a grocery item with name and price."
					},
					{
						title: "CPPF9 Project 3: Grocery List",
						content:
							"Update the DynamicArray to store Groceries (name and price) using a struct defined in DynamicArray.h with basic and overloaded constructors. Change pointer types and functions to the new data type. Include functions to print and add items. For removeItem by index, copy values into a new dynamic array while skipping the removed item. Build a simple menu to add, remove, print and quit. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF9-Grocery-List?skipMigration=1"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF10 Master Project: Matrix Fun",
				curriculum: [
					{
						title: "CPPF10 Master Project: Matrix Fun",
						content:
							"We can call grids of numbers matrices. Two matrices must have the same dimensions for addition. Map out the process: create variables for rows, columns and each matrix, ask for dimensions and elements, add the matrices and print the result in a grid. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF10-Matrix-Addition?skipMigration=1"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF11 Master Project: Profile Posts",
				curriculum: [
					{
						title: "CPPF11 Master Project: Profile Posts",
						content:
							"Create a Profile class that stores Post structs with a caption and heart count. Allow adding posts, printing a single post, printing all posts, and adding hearts. Track a changing number of posts with numPosts, maxSize and myPosts (a dynamic array of posts). Include a helper to validate indexes. Bonus: add more fields, sum hearts, edit or duplicate posts. Prepare a short presentation to share with friends or family.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF11-Profile-Posts?skipMigration=1"
					},
					{
						title: "Course recap",
						content:
							"Recap what this course covered and discuss which course to take next."
					}
				],
				supplementalProjects: []
			}
		]
	},
	{
		name: "JavaScript Level 1: JavaScript Superstar",
		modules: [
			{
				title: "Check-In #1",
				curriculum: [
					{
						title: "Check-In #1 Overview",
						content:
							"Use this module as a relaxed review. Let the learner attempt each prompt independently, guide with questions if needed, and focus on dialogue rather than testing.",
						solutionLink:
							"https://codepen.io/junilearning/pen/9023ac5a2ab1213c64d59d7b864aef8d"
					},
					{
						title: "Check-In #1: Variables",
						content:
							"Create variables for a number, a string and a boolean. Ask for a favorite color (store in userColor). Print “Your favorite color is ___” with printToScreen and also show it in an alert."
					},
					{
						title: "Check-In #1: Mathematical Operators and Randomness",
						content:
							"Generate a random number 1–256, round it, increment by 1 and divide by 3. printToScreen the random number plus 5, times 10 and the remainder."
					},
					{
						title: "Check-In #1: Loops",
						content:
							"Explain for vs while. Write both loop types to print even numbers 0–20. Use a loop to generate six random integers (0–10) and return their sum."
					},
					{
						title: "Check-In #1: Conditionals",
						content:
							"Explain if/else if/else. Ask for a number; if <= 50 print a success message else a sorry message. Create booleans for homework and chores; if both true print that you can go outside, otherwise that you cannot. Update to allow outside if either is true using ||."
					},
					{
						title: "Check-In #1: Drawing in JavaScript",
						content:
							"Create a 500x500 SVG. Draw a green square at x=100, y=120, width=200, height=200. Draw a blue circle centered in the square with radius 50."
					},
					{
						title: "Check-In #1: Nested Loops",
						content:
							"Use nested for loops to print **** then *** then ** then *. Repeat with nested while loops."
					},
					{
						title: "Check-In #1: Additional Practice Project",
						content:
							"Build a random number guessing game that scores like golf: fewer points when guesses are closer. Play three rounds with three guesses each.",
						projectLink:
							"https://codepen.io/junilearning/pen/b04e9208251c84d123c97daf37972988",
						solutionLink:
							"https://codepen.io/junilearning/pen/e0a4c125fb9fa7f0324934dc2fe9317f"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Note strengths and topics to review. Assign 30–60 minutes (finish practice projects, optional supplemental items) and have the learner share one project with friends or family."
					}
				],
				supplementalProjects: []
			},
			{
				title: "Check-In #2",
				curriculum: [
					{
						title: "Check-In #2 Overview",
						content:
							"Another review checkpoint; let the learner drive, guide with questions and adjust pacing.",
						solutionLink:
							"https://codepen.io/junilearning/pen/ce3da888e3e72bcaff1251f225b2f6fa"
					},
					{
						title: "Check-In #2: HTML & CSS",
						content:
							"Explain tags and div vs span. Create a red class div styled red with 10px height. Compare block, inline-block and inline. Make a yellow div with 50px margin, 50px padding and 3px black border. Place a blue square at the top-left that scrolls with the page and explain z-index.",
						projectLink:
							"https://codepen.io/junilearning/pen/f52dbec392b0c8ec4d21abcf8aecad43",
						solutionLink:
							"https://codepen.io/junilearning/pen/ce3da888e3e72bcaff1251f225b2f6fa"
					},
					{
						title: "Check-In #2: Animations and JavaScript Components",
						content:
							"Draw a red square in D3, animate it to double size, and on mouseover animate it green. Use Materialize docs to add a collapsible component."
					},
					{
						title: "Check-In #2: Website Layout",
						content:
							"Explain section vs container. Show using an icon and swapping it on mobile. Make a 3x3 CSS Grid with alternating colors and a 3x3 Materialize grid with alternating colors and numbers 1–9."
					},
					{
						title: "Check-In #2: Additional Practice Project",
						content:
							"Replicate the snowflake pattern with D3 and animation.",
						projectLink:
							"https://codepen.io/junilearning/pen/vYGWvaq",
						solutionLink:
							"https://codepen.io/junilearning/pen/084c3032877fa7f9c828bba2c5798551"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Capture wins and review topics. Assign 30–60 minutes (finish practice work, supplemental projects, videos) and have the learner share one piece with friends or family."
					}
				],
				supplementalProjects: []
			},
			{
				title: "JSS1 Variables and Data Types",
				curriculum: [
					{
						title: "Introductions & Setup",
						content:
							'Spend time on introductions: ask about interests and favorite sites; share your background. Create a CodePen account, fork https://codepen.io/junilearning/pen/JjGrYOG, and show saving and running code. Run printToScreen("Hello World"); in JavaScript.'
					},
					{
						title: "Variables and Data Types",
						content: `Project Link: https://codepen.io/junilearning/pen/eYpBWWX
Use let and const for numbers, strings, booleans, null and undefined. Assign values, use printToScreen(), explain comments, and show converting string numbers with a leading +. Compare "1" + "1" to 1 + 1.`
					},
					{
						title: "User Input and Printing",
						content:
							"Use prompt() to get input and store it. Use console.log() and alert() to display messages; show how to open the browser console."
					},
					{
						title: "Strings",
						content:
							"Explain strings as indexed characters from 0. Demonstrate indexing, concatenation with +, and length with string.length. Note prompt() returns strings."
					},
					{
						title: "JSS1 Project 1: Welcome Survey",
						content:
							"Use prompt() for first and last name and print them together. Prompt for two numbers and console.log their sum. Prompt for favorite food and alert the last letter.",
						projectLink:
							"https://codepen.io/junilearning/pen/OJMxyqw",
						solutionLink:
							"https://codepen.io/junilearning/pen/1efb04d2b3e13694f1bf614fef02c22c"
					},
					{
						title: "Debugging",
						content:
							"Explain syntax vs logic errors. Show console errors, out-of-range and type issues, and how the debugger keyword pauses code to inspect values."
					},
					{
						title: "JSS1 Project 2: Mad Libs",
						content:
							"Create a mad lib using prompt() for at least five words and print the story with printToScreen().",
						projectLink:
							"https://codepen.io/junilearning/pen/qBbPbPp",
						solutionLink:
							"https://codepen.io/junilearning/pen/ce06ca273ecc8c28529261846833d4c1"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign 30–60 minutes (finish projects, supplemental work, tutorials). Have the learner share one project with friends or family and confirm they can access their homework."
					}
				],
				supplementalProjects: [
					{
						title: "JSS1 Supplemental Project 1: Cookie Math",
						content:
							"Use prompt() to ask how much flour was brought and print how many eggs and chocolate chips are needed; consider Math.ceil() for rounding.",
						projectLink:
							"https://codepen.io/junilearning/pen/rNxGxKm",
						solutionLink:
							"https://codepen.io/junilearning/pen/27b890b0097969f24289d9abf77d1392"
					},
					{
						title: "JSS1 Supplemental Project 2: Hello World!",
						content:
							"Use string indexing on provided strings to print “Hello World!”.",
						projectLink:
							"https://codepen.io/junilearning/pen/MWKEKPJ",
						solutionLink:
							"https://codepen.io/junilearning/pen/36a808fbb70a55e25889b07c74debb6a"
					},
					{
						title: "JSS1 Supplemental Project 3: Debugging a Friend Survey",
						content:
							"Fix a friend’s survey code using prompts and outputs.",
						projectLink:
							"https://codepen.io/junilearning/pen/VwexoXw",
						solutionLink:
							"https://codepen.io/junilearning/pen/a16730b9a6d5bba63389d9e3f5614ab9"
					}
				]
			},
			{
				title: "JSS2 Operators and Math",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review prior homework and key concepts: variables, data types, let vs const."
					},
					{
						title: "Introduction to Operators",
						content:
							"Explain +, -, *, / and the assignment operator = for changing values. Show compound assignment (+=, -=, *=, /=) and ++/--."
					},
					{
						title: "Math Methods",
						content:
							"Use Math.random(), Math.floor(), Math.ceil(), Math.PI, and Math.pow(). Show how to get random integers in ranges."
					},
					{
						title: "JSS2 Project 1: Tips and Taxes",
						content:
							"Prompt for meal cost, tax percent, and tip. Print total cost with tax and tip.",
						projectLink:
							"https://codepen.io/junilearning/pen/RwrLayP",
						solutionLink:
							"https://codepen.io/junilearning/pen/06257a44b94db1486fac683ccaace7be"
					},
					{
						title: "JSS2 Project 2: Randomly Random Party",
						content:
							"Pick random values for month (5–7), day (1–30), and start time (hour 10–20, minute 0–59). Print the party time; optional challenge to handle any birth month.",
						projectLink:
							"https://codepen.io/junilearning/pen/xxZXVye",
						solutionLink:
							"https://codepen.io/junilearning/pen/29d1e4fde67a75fc4b5cdcacd458cb8d"
					},
					{
						title: "JSS2 Project 3: What's the Password?",
						content:
							"Compute a numeric password using Math.PI, powers, addition, division with Math.floor, and modulo; print result with printToScreen().",
						projectLink:
							"https://codepen.io/junilearning/pen/PoZJNXb",
						solutionLink:
							"https://codepen.io/junilearning/pen/c550ef1e284c55fa01964589bf19b21c"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign 30–60 minutes (finish projects, supplemental practice, tutorials) and have the learner share one project."
					}
				],
				supplementalProjects: [
					{
						title: "JSS2 Supplemental Project 1: Pie Eating Contest",
						content:
							"Prompt for number of pies; one contestant eats 1–5 pies at random. Recalculate pies per contestant and leftovers.",
						projectLink:
							"https://codepen.io/junilearning/pen/jOWGqJZ",
						solutionLink:
							"https://codepen.io/junilearning/pen/a9612fb435c5e334490c1eeb72e9c567"
					},
					{
						title: "JSS2 Supplemental Project 2: Random Practice",
						content:
							"Print random numbers in different ranges (0–5, 1–10, 20–50, even 0–50, odd 51–101).",
						projectLink:
							"https://codepen.io/junilearning/pen/JjGrXgg",
						solutionLink:
							"https://codepen.io/junilearning/pen/5bbc99927a71e48ec59e93b8dfbb585c"
					},
					{
						title: "JSS2 Supplemental Project 3: Circles",
						content:
							"Use a modified printToScreen(start, end) to draw arcs; convert degrees to radians; draw a rainbow, full circle, and 3/4 circle.",
						projectLink:
							"https://codepen.io/junilearning/pen/yLezJLx",
						solutionLink:
							"https://codepen.io/junilearning/pen/d004723cc01403a3db897db1206f449b"
					},
					{
						title: "JSS2 Supplemental Project 4: Debugging Math Homework",
						content: "Fix code solving a math problem.",
						projectLink:
							"https://codepen.io/junilearning/pen/VwexoVL",
						solutionLink:
							"https://codepen.io/junilearning/pen/f90710cc7e05de72ea7ff2b8b05a32bd"
					}
				]
			},
			{
				title: "JSS3 For and While Loops",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review prior assignment and discuss operators and Math object."
					},
					{
						title: "For Loops",
						content:
							"Explain loop structure (init, condition, update). Print sequences like 0–9, multiples of 3, and countdowns."
					},
					{
						title: "JSS3 Project 1: For Loops Practice",
						content:
							"Use printToScreen() to print sequences: 1–50, 50–1, evens to 100, odds down from 100, powers of 3, and 500,100,20,4.",
						projectLink:
							"https://codepen.io/junilearning/pen/PoZJGKV",
						solutionLink:
							"https://codepen.io/junilearning/pen/8c4bf4ddfb48b6a93a41d0347d6f78ef"
					},
					{
						title: "While Loops",
						content:
							"Show while loops and the need for termination to avoid infinite loops."
					},
					{
						title: "JSS3 Project 2: String Reversal",
						content:
							"Get a word and use a for loop to print letters forward, then a while loop to print them backward.",
						projectLink:
							"https://codepen.io/junilearning/pen/OJMxRvY",
						solutionLink:
							"https://codepen.io/junilearning/pen/3f802bef974fcccd10caafaac8c3eb04"
					},
					{
						title: "JSS3 Project 3: Looping Squares",
						content:
							"Use for loops to print colored squares (2 red, 3 yellow) and while loops to print 4 blue and 3 purple squares with printToScreen().",
						projectLink:
							"https://codepen.io/junilearning/pen/xxZXEzP",
						solutionLink:
							"https://codepen.io/junilearning/pen/56baa6b060aab0e3511c7c3608d53eaa"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign 30–60 minutes of follow-up practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS3 Supplemental Project 1: Powers of 3",
						content:
							"Print all powers of 3 less than 5000 using printToScreen().",
						projectLink:
							"https://codepen.io/junilearning/pen/wvMrzEw",
						solutionLink:
							"https://codepen.io/junilearning/pen/1c1201771499a38d4f15588580d7bfa1"
					},
					{
						title: "JSS3 Supplemental Project 2: Forgotten Math",
						content:
							"Compute a product of two inputs without using * or *=; print the result.",
						projectLink:
							"https://codepen.io/junilearning/pen/gOPGwBy",
						solutionLink:
							"https://codepen.io/junilearning/pen/53206f1e4800c28a4549aea7be49b7e0"
					},
					{
						title: "JSS3 Supplemental Project 3: Debugging Loops",
						content: "Fix a simulated race that uses loops.",
						projectLink:
							"https://codepen.io/junilearning/pen/KKVGBWx",
						solutionLink:
							"https://codepen.io/junilearning/pen/d56a9a00a8022b7f85434f295cc0dbec"
					}
				]
			},
			{
				title: "JSS4 Combining Loops and Variables",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review differences between for and while loops and when to use each."
					},
					{
						title: "Combining Loops and Variables",
						content:
							"Show how to increment or decrement counters inside loops to track attempts, lives, or guesses."
					},
					{
						title: "JSS4 Project 1: Totaling Up",
						content:
							"Write loops to sum numbers 1–100, sum squares 1–100, and compute factorial of a user input.",
						projectLink:
							"https://codepen.io/junilearning/pen/gOPGwNV",
						solutionLink:
							"https://codepen.io/junilearning/pen/71ad8b99ac4c707e75b4f0e136f82665"
					},
					{
						title: "JSS4 Project 2: Coin Machine",
						content:
							"Ask for cents and print how many of each coin are included; discuss while loop use.",
						projectLink:
							"https://codepen.io/junilearning/pen/VweMmZq",
						solutionLink:
							"https://codepen.io/junilearning/pen/17494fdc78b6e93db4e8206101f45ea7"
					},
					{
						title: "ASCII",
						content:
							"Explain ASCII codes; use char.charCodeAt() and String.fromCharCode()."
					},
					{
						title: "JSS4 Project 3: Random Password",
						content:
							"Create strings of random letters and numbers and combine them into an alternating password.",
						projectLink:
							"https://codepen.io/junilearning/pen/jOWGVVB",
						solutionLink:
							"https://codepen.io/junilearning/pen/1520f836e15f3d4e7f554b913a805b02"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign follow-up practice, supplemental work, and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS4 Supplemental Project 1: Debugging Football",
						content: "Fix code simulating a football drive.",
						projectLink:
							"https://codepen.io/junilearning/pen/gOPRqPr",
						solutionLink:
							"https://codepen.io/junilearning/pen/eb1d816cbecce4d20944284fc085ae36"
					}
				]
			},
			{
				title: "JSS5 Conditionals",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Discuss why to combine loops and variables and how ASCII helps with random letters."
					},
					{
						title: "Introduction to Conditionals",
						content:
							"Explain conditionals with real-world examples; demonstrate if syntax."
					},
					{
						title: "Equivalence Operators",
						content:
							"Show >, <, >=, <=, ===, !== and using ! to invert booleans; build simple if checks."
					},
					{
						title: "JSS5 Project 1: A-Checker",
						content:
							"Get a word and check for the letter ‘a’ using a loop and conditionals.",
						projectLink:
							"https://codepen.io/junilearning/pen/QWyqrLo",
						solutionLink:
							"https://codepen.io/junilearning/pen/3ef023d001ee721f608cac6b87a41bd2"
					},
					{
						title: "Else and Else If",
						content:
							"Show how to chain else if and else to cover multiple outcomes."
					},
					{
						title: "JSS5 Project 2: What Grade Is This?",
						content:
							"Given a number 0–100, print the letter grade using else-if and else.",
						projectLink:
							"https://codepen.io/junilearning/pen/yLezjje",
						solutionLink:
							"https://codepen.io/junilearning/pen/2d86a137a1c362df390051e86a298e9d"
					},
					{
						title: "Advanced String Functions",
						content:
							"Introduce template strings with backticks and ${}, plus toUpperCase() and toLowerCase()."
					},
					{
						title: "JSS5 Project 3: Wholesome Memes",
						content:
							"Convert a sentence to alternating case (“tHaT lOoKs LiKe ThIs”) with conditionals; optional alphabetic-only check via ASCII.",
						projectLink:
							"https://codepen.io/junilearning/pen/wvMrXdG",
						solutionLink:
							"https://codepen.io/junilearning/pen/bf0a3506f98d1b247c3f259986a941bd"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign 30–60 minutes of practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS5 Supplemental Project 1: Login Credentials",
						content:
							"Build a simple login loop that prompts until username/password match, then alerts success.",
						projectLink:
							"https://codepen.io/junilearning/pen/QWyqxqp",
						solutionLink:
							"https://codepen.io/junilearning/pen/d0f771c4f6fd24c86077e6b3fee4fa72"
					},
					{
						title: "JSS5 Supplemental Project 2: Snake Eyes",
						content:
							"Simulate rolling two dice until snake eyes; count rolls.",
						projectLink:
							"https://codepen.io/junilearning/pen/jOWGKZw",
						solutionLink:
							"https://codepen.io/junilearning/pen/6580937e9dfd9ce926651a6fe915e078"
					},
					{
						title: "JSS5 Supplemental Project 3: Debugging the Favorite Fruit Guesser",
						content:
							"Fix a fruit guesser that uses color and taste conditionals.",
						projectLink:
							"https://codepen.io/junilearning/pen/PoZdQeW",
						solutionLink:
							"https://codepen.io/junilearning/pen/949d30ec6dbcc0dfdda259392403b0b7"
					}
				]
			},
			{
				title: "JSS6 Advanced Conditionals",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review conditionals, template strings, and equality operators."
					},
					{
						title: "Nested Conditionals",
						content:
							"Explain nesting an if inside another when multiple checks are needed."
					},
					{
						title: "JSS6 Project 1: The Sorting Hat",
						content:
							"Prompt for house preference and a quality; if they match, print sorted, else try again.",
						projectLink:
							"https://codepen.io/junilearning/pen/JjGrxRB",
						solutionLink:
							"https://codepen.io/junilearning/pen/e7c85cf84c953eb5bc630e214fe476d8"
					},
					{
						title: "AND & OR Operators",
						content:
							"Explain && (both true) and || (either true) and short-circuit behavior; show examples where undefined variables aren’t evaluated."
					},
					{
						title: "JSS6 Project 2: FizzBuzz",
						content:
							"Print 1–100 substituting Fizz, Buzz, or FizzBuzz based on divisibility; check 3 and 5 first.",
						projectLink:
							"https://codepen.io/junilearning/pen/gOPGqKa",
						solutionLink:
							"https://codepen.io/junilearning/pen/0b39a6e7b85b790e7cd9a276e9ee2c4f"
					},
					{
						title: "True Versus Truthy",
						content:
							"Explain == type coercion vs === strict equality, truthy/falsy values, and recommend using === and !==."
					},
					{
						title: "Switch Statements",
						content:
							"Show switch syntax with cases, break, and default."
					},
					{
						title: "JSS6 Project 3: GCF of Two Numbers",
						content:
							"Find the greatest common factor of two numbers by checking factors or iterating digits.",
						projectLink:
							"https://codepen.io/junilearning/pen/NWxaJdX",
						solutionLink:
							"https://codepen.io/junilearning/pen/b418881c3e60c8c7ac8fcbc3b7d74aa0"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS6 Supplemental Project 1: What Does the _ Say?",
						content: "Use a switch to map animals to sounds.",
						projectLink:
							"https://codepen.io/junilearning/pen/NWxaJgy",
						solutionLink:
							"https://codepen.io/junilearning/pen/5b0bdb527344a081c9abf91138ce5f4a"
					},
					{
						title: "JSS6 Supplemental Project 2: Debugging Bugging Friends",
						content:
							"Fix a program that checks if messaging frequency is too high.",
						projectLink:
							"https://codepen.io/junilearning/pen/mdVGXLE",
						solutionLink:
							"https://codepen.io/junilearning/pen/67b0c29a104afde9cce553de6cacf882"
					}
				]
			},
			{
				title: "JSS7 Drawing in JavaScript",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review && vs ||, truthy vs true, and why to prefer ===."
					},
					{
						title: "Introduction to D3",
						content:
							"Explain D3 and SVG basics, pixels, and including D3 in CodePen. Append an SVG with width/height and note best practices for chaining calls."
					},
					{
						title: "Drawing Shapes in D3",
						content:
							"Append rectangles, circles, and ellipses; set attributes like x, y, height, width, fill, cx, cy, r, rx, ry.",
						projectLink:
							"https://codepen.io/junilearning/pen/zYrPBYM",
						solutionLink:
							"https://codepen.io/junilearning/pen/7ba2616cfb21c6a3fbf71ee0cfb78332"
					},
					{
						title: "Drawing Arcs",
						content:
							"Use d3.arc() with startAngle, endAngle, innerRadius, outerRadius in radians; attach via path d and translate as needed. Try edits in https://codepen.io/junilearning/pen/zYrPBbY."
					},
					{
						title: "JSS7 Project 2: Smiley Face",
						content:
							"Draw eyes and a curved mouth using arcs and degreesToRadians().",
						projectLink:
							"https://codepen.io/junilearning/pen/MWKOeRd",
						solutionLink:
							"https://codepen.io/junilearning/pen/593993382174caa7d510ddbd5b0009d8"
					},
					{
						title: "JSS7 Project 3: Pac-Man",
						content:
							"Draw Pac-Man as an arc missing a slice by choosing start and end angles.",
						projectLink:
							"https://codepen.io/junilearning/pen/JjGORoK",
						solutionLink:
							"https://codepen.io/junilearning/pen/6df064875eb631bc08eab5c342ef98f7"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS7 Supplemental Project 1: Snowman",
						content:
							"Draw a snowman with D3 shapes and arcs; draw lines as needed.",
						projectLink:
							"https://codepen.io/junilearning/pen/GRoOjjx",
						solutionLink:
							"https://codepen.io/junilearning/pen/bb6f6bcdf7ff47fef8a5f2dc3a2138f0"
					},
					{
						title: "JSS7 Supplemental Project 2: Captain America's Shield",
						content:
							"Draw the shield with arcs and a star using D3 symbol docs.",
						projectLink:
							"https://codepen.io/junilearning/pen/VweRVWq",
						solutionLink:
							"https://codepen.io/junilearning/pen/0736d5c2045c3ecd6969c5284b93b067"
					},
					{
						title: "JSS7 Supplemental Project 3: Debugging Olaf's Star",
						content: "Fix code so a star appears on a snowman.",
						projectLink:
							"https://codepen.io/junilearning/pen/rNxZJdQ",
						solutionLink:
							"https://codepen.io/junilearning/pen/20aeca54176134a3397922a9e98f3564"
					}
				]
			},
			{
				title: "JSS8 Nested Loops",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review SVGs, D3 attributes, and why nested loops use j as the inner index."
					},
					{
						title: "Nested Loops",
						content:
							"Explain loop within a loop for repeating steps; demonstrate nested for with i and j."
					},
					{
						title: "JSS8 Project 1: Multiplication Tables",
						content:
							"Use nested loops to print multiplication tables 1–10 and count operations.",
						projectLink:
							"https://codepen.io/junilearning/pen/WNrXoBj",
						solutionLink:
							"https://codepen.io/junilearning/pen/431a3c1e61b0fe9d0e6fa2e16e6d37f6"
					},
					{
						title: "JSS8 Project 2: Pattern Production",
						content:
							"Print a star pattern with nested loops, then create the same pattern with D3 Pac-Men using translate to align.",
						projectLink:
							"https://codepen.io/junilearning/pen/pogdRva",
						solutionLink:
							"https://codepen.io/junilearning/pen/9b713f294e21887a1a2c9b528764bd4b"
					},
					{
						title: "JSS8 Project 3: Armstrong Numbers",
						content:
							"Find all three-digit Armstrong numbers using loops and digit sums.",
						projectLink:
							"https://codepen.io/junilearning/pen/eYJegdP",
						solutionLink:
							"https://codepen.io/junilearning/pen/e12716e0c3e1cbfc0405c9da2e245b8a"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS8 Supplemental Project 1: Juni Archery",
						content:
							"Simulate five rounds of archery with three arrows each; random 1-in-3 chance for a hit; print results and total bullseyes.",
						projectLink:
							"https://codepen.io/junilearning/pen/xxZPgdv",
						solutionLink:
							"https://codepen.io/junilearning/pen/2882e6ebc5b146358627d5c4f5afd90c"
					},
					{
						title: "JSS8 Supplemental Project 2: Tower of Boxes",
						content:
							"Print the stacked box pattern shown using nested loops.",
						projectLink:
							"https://codepen.io/junilearning/pen/PoZOWWp",
						solutionLink:
							"https://codepen.io/junilearning/pen/6973a709e1c0d6932da2ed1e7650d30f"
					},
					{
						title: "JSS8 Supplemental Project 3: Shield Debugging",
						content:
							"Fix output order of a stacked shield pattern.",
						projectLink:
							"https://codepen.io/junilearning/pen/pogyeaj",
						solutionLink:
							"https://codepen.io/junilearning/pen/1ac928d6d9d777928c4439b4262310a3"
					}
				]
			},
			{
				title: "JSS9 Introduction to HTML & CSS",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review nested loops and why to use j in inner loops."
					},
					{
						title: "Introduction to HTML",
						content:
							"Define HTML and tags; show nesting, parent/child. Practice h1, div, span, br, a, img in CodePen."
					},
					{
						title: "Document Object Model (DOM)",
						content:
							"Explain how browsers build the DOM from HTML/CSS/JS; inspect a page to see html, head, body."
					},
					{
						title: "Introduction to CSS",
						content:
							"Target tags with selectors to style text-align, color, background-color, font-size, font-weight. Use class and id for flexible styling; create a div with class box and style it.",
						projectLink:
							"https://codepen.io/junilearning/pen/a4555b19dc5183859c0a6956be1f6c0a",
						solutionLink:
							"https://codepen.io/junilearning/pen/d14dd0596bbb8720c359688f460c9419"
					},
					{
						title: "Display Property and Table Tags",
						content:
							"Explain block, inline, inline-block; experiment with styled boxes. Show table, th, tr, td, tbody, thead tags.",
						projectLink:
							"https://codepen.io/junilearning/pen/eca1fa811c12940c388c331a07cb0dbb",
						solutionLink:
							"https://codepen.io/junilearning/pen/4ae1264dcfd25856b2d4d893eb3b2ffa"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign 30–60 minutes of practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS9 Supplemental Project 1: Practice with CSS Selectors",
						content:
							"Practice selectors at https://flukeout.github.io/.",
						projectLink: "https://flukeout.github.io/",
						solutionLink: "https://flukeout.github.io/"
					},
					{
						title: "JSS9 Supplemental Project 2: Practice with Flexbox",
						content:
							"Work through https://flexboxfroggy.com/ to learn flexbox.",
						projectLink: "https://flexboxfroggy.com/",
						solutionLink: "https://flexboxfroggy.com/"
					}
				]
			},
			{
				title: "JSS10 Animations in JavaScript",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review HTML vs CSS, the DOM, and CSS selection methods."
					},
					{
						title: "JSS10 Project 1: Car",
						content:
							"Draw a car with D3 using rectangles and circles.",
						projectLink:
							"https://codepen.io/junilearning/pen/38ef977913b6ce7e1a913883f984a4e5",
						solutionLink:
							"https://codepen.io/junilearning/pen/2723c8a04416bf8402171eb247a02bb5"
					},
					{
						title: "Moving Your Car",
						content:
							"Use d3.select/selectAll and transitions with duration and transform translate to animate the car.",
						projectLink:
							"https://codepen.io/junilearning/pen/46c3f402eb4100c983f22bbbb3f4cede"
					},
					{
						title: "JSS10 Project 2: Bouncing Ball",
						content:
							"Animate a ball across the screen and back; adjust duration and easing.",
						projectLink:
							"https://codepen.io/junilearning/pen/6a90681824ce331a3533469f911e2497",
						solutionLink:
							"https://codepen.io/junilearning/pen/a449284a2d08eecf0a0f61b644044f84"
					},
					{
						title: "DOM Events",
						content:
							"Explain events like click; use d3.on() with a callback to respond to clicks.",
						projectLink:
							"https://codepen.io/junilearning/pen/BajVdPQ"
					},
					{
						title: "JSS10 Project 3: Growing Ball",
						content:
							"Use mouseover and mouseout events to change a circle’s size.",
						projectLink:
							"https://codepen.io/junilearning/pen/ff4f98a080f26536a286835de4b1b9a2",
						solutionLink:
							"https://codepen.io/junilearning/pen/9d8630fbb5a9554618f11c649a95ab55"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign practice, supplemental work, and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS10 Supplemental Project 1: Bouncing and Growing",
						content:
							"Animate a ball moving across the screen, doubling in size, then returning and shrinking.",
						projectLink:
							"https://codepen.io/junilearning/pen/5e44ed4c619e2a3e960ba5cdf6ab067f",
						solutionLink:
							"https://codepen.io/junilearning/pen/be50c8f1430016572f95794d69800440"
					},
					{
						title: "JSS10 Supplemental Project 2: Rainbow",
						content:
							"Draw a rainbow with D3 arcs that animate from outside in.",
						projectLink:
							"https://codepen.io/junilearning/pen/36846ad022b36b072833ace22a9edbef",
						solutionLink:
							"https://codepen.io/junilearning/pen/b858a6f5c9b50333229dd36700cc4ac0"
					}
				]
			},
			{
				title: "JSS11 More HTML & CSS",
				curriculum: [
					{
						title: "Assignment Review",
						content: "Review transitions, triggers, and durations."
					},
					{
						title: "The Box Model",
						content:
							"Explain margin, border, padding, and content; demonstrate in CodePen."
					},
					{
						title: "The Position Property",
						content:
							"Show static, fixed, absolute, and relative positioning with top/left/right/bottom and z-index. Demonstrate layering.",
						projectLink:
							"https://codepen.io/junilearning/pen/261c1809ad0309dd584526c73c586289"
					},
					{
						title: "JSS11 Project 2: My Hero Page",
						content:
							"Add a custom Google Font, then create ordered and unordered lists with ul, ol, li.",
						projectLink:
							"https://codepen.io/junilearning/pen/d959f67d5f753f31d3fea61cd4e6e8e3",
						solutionLink:
							"https://codepen.io/junilearning/pen/f148f71f0ba2807f695133ab280a5b67"
					},
					{
						title: "JSS11 Project 3: My JavaScript Art",
						content:
							"Display three favorite D3 animations or drawings with a title and descriptions on a page.",
						projectLink:
							"https://codepen.io/junilearning/pen/b252c1398d97eda534482419d9103b87",
						solutionLink:
							"https://codepen.io/junilearning/pen/65a70df75b1168154b07ed73a09e9aa3"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS11 Supplemental Project 1: Berkshire Hathaway",
						content:
							"Replicate the Berkshire Hathaway page using learned HTML/CSS.",
						projectLink:
							"https://codepen.io/junilearning/pen/b24ef5d48d5f8e0fbcafee18631d0336",
						solutionLink:
							"https://codepen.io/junilearning/pen/3efe23650b01fd4f978f3f827cc1691e"
					},
					{
						title: "JSS11 Supplemental Project 2: W3 CSS Tutorial",
						content:
							"Optional deeper CSS practice at https://www.w3schools.com/css/."
					}
				]
			},
			{
				title: "JSS12 Basic Website Layout",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review position properties and adding Google Fonts."
					},
					{
						title: "Component Libraries",
						content:
							"Introduce Materialize; explain adding it via CodePen settings and using docs to apply classes."
					},
					{
						title: "JSS12 Project 1: Rainbow Sections",
						content:
							"Use Materialize sections, containers, cards, and colors to build a rainbow layout; add spacing with br tags.",
						projectLink:
							"https://codepen.io/junilearning/pen/ed06d5371daf7472425bea1c7e65e4bf",
						solutionLink:
							"https://codepen.io/junilearning/pen/3d22e6b16852d5226f7944331d44b315"
					},
					{
						title: "JSS12 Project 2: My Hobby Table",
						content:
							"Build a styled table with Materialize table docs, using thead and th.",
						projectLink:
							"https://codepen.io/junilearning/pen/0214806859946640ce1654c9c3ec08f0",
						solutionLink:
							"https://codepen.io/junilearning/pen/134bda10f6f852089b21d49498c47ad7"
					},
					{
						title: "Material Icons",
						content:
							"Add Material icons via dependency and use icons as scalable SVGs."
					},
					{
						title: "Mobile Wrappers",
						content:
							"Use Materialize helpers to hide/show content by screen size.",
						projectLink:
							"https://codepen.io/junilearning/pen/ab476697ba2b3957601555751bda65fb",
						solutionLink:
							"https://codepen.io/junilearning/pen/7da430381845aeb20d85bd435e7d8d03"
					},
					{
						title: "JSS12 Project 4: My JavaScript Art Part II",
						content:
							"Add another D3 piece to the art page and organize with sections and Materialize.",
						solutionLink:
							"https://codepen.io/junilearning/pen/68f7db60fabe38f5ff48cf4cfa631a4c"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign 30–60 minutes of practice, supplemental items, and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS12 Supplemental Project 1: Table Documentation Dive",
						content:
							"Make a table highlight on hover and link names to sources when clicked.",
						projectLink:
							"https://codepen.io/junilearning/pen/a08f05f994009cffe397dd6dd86dbddd",
						solutionLink:
							"https://codepen.io/junilearning/pen/0bbd6c8223876a9fa514f42411e3f37d"
					}
				]
			},
			{
				title: "JSS13 The Grid Layout",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review why to use component libraries, material icons, and responsive wrappers."
					},
					{
						title: "Introduction to CSS Grid",
						content:
							"Explain CSS Grid for precise placement; practice via https://codepen.io/junilearning/pen/NWNdaEd and the Grid Garden tutorial https://cssgridgarden.com/."
					},
					{
						title: "JSS13 Project 1: Chessboard",
						content: "Build a chessboard with CSS Grid.",
						projectLink:
							"https://codepen.io/junilearning/pen/2573f4cfc9cb525b5940f500fd22dc79",
						solutionLink:
							"https://codepen.io/junilearning/pen/6d8b7a81d39a66ce9536c1e700f287c0"
					},
					{
						title: "Component Library Grids",
						content:
							"Explain Materialize grid (12-column rows) and setting columns for small/medium/large screens.",
						projectLink:
							"https://codepen.io/junilearning/pen/a3eaa0595c2a0f55991e946605e38e60",
						solutionLink:
							"https://codepen.io/junilearning/pen/9efdb71bcb845f3d9c01b14f0fd1e32e"
					},
					{
						title: "JSS13 Project 3: Pokemon Team",
						content:
							"Create a Pokemon team layout with images, nicknames, moveset tables, and stats icons; use responsive grids and add a navbar.",
						projectLink:
							"https://codepen.io/junilearning/pen/ae3059e723f4f66779b4cd4e2a1fc520",
						solutionLink:
							"https://codepen.io/junilearning/pen/e96eae8cd85c1fe2bbaf3b5cdd046522"
					},
					{
						title: "JSS13 Project 4: My JavaScript Art Part III",
						content:
							"Add another D3 piece and organize art with CSS Grid or Materialize grid; add cards with descriptions in an alternating pattern.",
						solutionLink:
							"https://codepen.io/junilearning/pen/4735eaf3e168cfb944a3daad063e287c"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS13 Supplemental Project 1: FakeTech.io",
						content:
							"Build a company page with cards showing employees using Materialize components like circular images, valign wrappers, and hoverable shadows.",
						projectLink:
							"https://codepen.io/junilearning/pen/ca71737eccb1712a4a653a8f883c57cf",
						solutionLink:
							"https://codepen.io/junilearning/pen/cdf88ee56f7d30ee0b1eba24ae89353e"
					},
					{
						title: "JSS13 Supplemental Project 2: Art Gallery",
						content:
							"Create an online art gallery of 12 pieces using horizontal cards with descriptions and links; make responsive layouts for desktop, tablet, and mobile.",
						projectLink:
							"https://codepen.io/junilearning/pen/8a2437122b9c7eb4159c9cacccdedae8",
						solutionLink:
							"https://codepen.io/junilearning/pen/45dabf41b44570f312ef9334db333f97"
					}
				]
			},
			{
				title: "JSS14 Dynamic Websites with JavaScript",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Discuss grid usefulness and differences between Materialize grid and pure CSS Grid."
					},
					{
						title: "Manipulating HTML with JavaScript",
						content:
							"Select DOM elements (e.g., input) and use events to change text or attributes; practice with a simple demo: https://codepen.io/junilearning/pen/VwaPMoZ."
					},
					{
						title: "JSS14 Project 1: Calculator",
						content:
							"Finish a half-built calculator by wiring buttons to inputs and outputs; style with D3 if desired.",
						projectLink:
							"https://codepen.io/junilearning/pen/8cb69f2696d31b929107d3798ef095aa",
						solutionLink:
							"https://codepen.io/junilearning/pen/d394480277af12f893819f3d64c5ea81"
					},
					{
						title: "JSS14 Project 2: Strength Tester",
						content:
							"Generate a random number 0–500 on button click, show an image for prize tiers, and display a message.",
						projectLink:
							"https://codepen.io/junilearning/pen/afcffeca5355cf07d9882f08c90ab84c",
						solutionLink:
							"https://codepen.io/junilearning/pen/20af41540e7b43929ccf60cc88c8e8bd"
					},
					{
						title: "JavaScript Components",
						content:
							"Use Materialize JavaScript components; initialize with document.querySelectorAll() and M.* per docs after adding JS and icon CDNs."
					},
					{
						title: "JSS14 Project 3: Dynamic Components",
						content:
							"Pick three Materialize JS components from https://materializecss.com/auto-init.html to implement.",
						solutionLink:
							"https://codepen.io/junilearning/pen/e55b7c0d570df2c9943e06395a42c974"
					},
					{
						title: "JSS14 Project 4: My JavaScript Art Part IV",
						content:
							"Add another D3 piece and some JavaScript effects; make a nav with dropdown and scroll spy to sections using Materialize docs.",
						solutionLink:
							"https://codepen.io/junilearning/pen/68807d2000d19574d4c80d354eea197f"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign 30–60 minutes of follow-up work and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSS14 Supplemental Project 1: Video Collection",
						content:
							"Embed nine favorite videos using Materialize components and docs.",
						projectLink:
							"https://codepen.io/junilearning/pen/71ea495430eac148ba6c02e837de1727",
						solutionLink:
							"https://codepen.io/junilearning/pen/449ef8b56fdf70dca74400b0401655e1"
					},
					{
						title: "JSS14 Supplemental Project 2: National Park",
						content:
							"Create a parallax page for a national park using the Materialize parallax component with multiple background images.",
						projectLink:
							"https://codepen.io/junilearning/pen/bba3ef0f2520577fb92d3fc6cc546335",
						solutionLink:
							"https://codepen.io/junilearning/pen/1d2df4b333d28c9a00f17d0fa4f37978"
					}
				]
			},
			{
				title: "JSS15 Master Project",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Discuss dynamic websites and which elements need JavaScript vs static content."
					},
					{
						title: "JSS15 Project 1: Master Project",
						content:
							"Build a splash page (business, restaurant, news, e-commerce, or other idea) showcasing course concepts with Materialize components. Plan to complete over about two weeks while moving on to the next course once the core is done.",
						projectLink:
							"https://codepen.io/junilearning/pen/181b8577413d710bc8e669f2740d4c5b",
						solutionLink:
							"https://codepen.io/junilearning/pen/c8520963128a302c0e6aa6738965ae43"
					},
					{
						title: "Course Recap",
						content:
							"Recap what this course covered and discuss next steps in learning."
					}
				],
				supplementalProjects: [
					{
						title: "JSS15 Supplemental Project 1: Juni Eatz",
						content:
							"Optional restaurant page idea using Materialize parallax.",
						solutionLink:
							"https://codepen.io/junilearning/pen/eb5dc79c245ab907ddd8f56853cb817a"
					},
					{
						title: "JSS15 Supplemental Project 2: Juni News",
						content:
							"Optional news site idea using Materialize slider.",
						solutionLink:
							"https://codepen.io/junilearning/pen/910d8fa54b43a581c779c8dfab792c60"
					},
					{
						title: "JSS15 Supplemental Project 3: Jun-E-Commerce",
						content:
							"Optional e-commerce idea using Materialize carousel.",
						solutionLink:
							"https://codepen.io/junilearning/pen/c8048a26149f2dc5c4340a2d6cdb0ce2"
					}
				]
			}
		]
	},
	{
		name: "JavaScript Level 2: JavaScript Master",
		modules: [
			{
				title: "Check-In #1",
				curriculum: [
					{
						title: "Check-In #1 Overview",
						content:
							"Use this as a review dialog. Let the learner try each task independently, guide with questions, and keep pacing flexible.",
						solutionLink:
							"https://codepen.io/junilearning/pen/bbb5cce14f0a1bc5c5c4b5582da67750"
					},
					{
						title: "Check-In #1: Functions & Complex Conditionals",
						content:
							"Project Link: https://codepen.io/junilearning/pen/f1b05b8f30ae178563d6ecd20e816e3f\nCreate rollDie(), track sixes over 100 rolls, build playJackpot() with ternary, a sum function, and an isOdd function."
					},
					{
						title: "Check-In #1: Arrays",
						content:
							"Make an array of 20 rollDie() results, log the 10th element, count evens, and log doubled values."
					},
					{
						title: "Check-In #1: Objects and the Canvas",
						content:
							"Create a car object with properties, set up a 1200x1200 canvas, build a cards array of rectangle objects, draw one card, then draw all cards on the canvas."
					},
					{
						title: "Check-In #1: Additional Practice Project",
						content:
							"Create a 3x3 board of random squares or circles and keep redrawing until all match.",
						projectLink:
							"https://codepen.io/junilearning/pen/c9af625a0a84cbffef3dc7891aa804f9",
						solutionLink:
							"https://codepen.io/junilearning/pen/702bf96c0927e96b0089cdc58df366d0"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Summarize strengths and next topics. Assign 30–60 minutes of practice and have the learner share one outcome with friends or family."
					}
				],
				supplementalProjects: []
			},
			{
				title: "Check-In #2",
				curriculum: [
					{
						title: "Check-In #2 Overview",
						content:
							"Second review checkpoint; let the learner drive, guide with questions, and adjust pacing.",
						solutionLink:
							"https://codepen.io/junilearning/pen/7b72b5cd25d5372e9097f68de4b66db6"
					},
					{
						title: "Check-In #2: Helper Functions and Event Listeners",
						content:
							"Explain why helper functions matter; refactor starter code with helpers. Define event listeners and add a click listener to a canvas logging x and y.",
						projectLink:
							"https://codepen.io/junilearning/pen/f6a04f3b9405ba212662f72a776bc0cd"
					},
					{
						title: "Check-In #2: APIs",
						content:
							"Define APIs and requests. Fetch https://pokeapi.co/api/v2/move/ and log the name of the first returned object."
					},
					{
						title: "Check-In #2: Databases",
						content:
							"Explain SELECT, WHERE, JOIN in SQL. Create a simple schema on dbdiagram.io for books and bookshelves. List the four CRUD operations."
					},
					{
						title: "Check-In #2: Additional Practice Project",
						content:
							"Use PokeAPI moves to count move types; prompt for a type and display the total.",
						projectLink:
							"https://codepen.io/junilearning/pen/a320051c74a1a5baa1358818c5bca5bc",
						solutionLink:
							"https://codepen.io/junilearning/pen/ba366d22ab4a98e653a5b2bcb4affba8"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Capture wins and topics to review. Assign 30–60 minutes (finish practice work, optional supplements) and have the learner share one piece."
					}
				],
				supplementalProjects: []
			},
			{
				title: "JSM1 Fundamentals Review",
				curriculum: [
					{
						title: "Introductions & Setup",
						content:
							'Connect with the learner and set up CodePen (fork https://codepen.io/junilearning/pen/JjGrYOG). Show saving, running code, and printToScreen("Hello World").'
					},
					{
						title: "Variables and Strings",
						content:
							"Review numbers, strings, booleans, null, undefined with let/const. Explain strings and preferred let/const over var."
					},
					{
						title: "Alert and Prompt",
						content:
							"Use alert() to message users and prompt() to gather input; log with console.log()."
					},
					{
						title: "Conditionals",
						content:
							"Review if/else, === vs !== and why to prefer === over ==."
					},
					{
						title: "JSM1 Project 1: Finish the Lyrics",
						content:
							"Prompt for guesses on three snippets, track correct and total, and print results.",
						projectLink:
							"https://codepen.io/junilearning/pen/2d400625754c49aedbb72402eed3ba8f",
						solutionLink:
							"https://codepen.io/junilearning/pen/5e36bb6a04a440e18fb502b1cd635628"
					},
					{
						title: "Loops",
						content:
							"Review for and while loops, nested loops, and break; standardize on i and j."
					},
					{
						title: "Math",
						content:
							"Use Math.random(), Math.floor/ceil, and Math.PI for randomness and calculations."
					},
					{
						title: "JSM1 Project 2: Double or Nothing",
						content:
							"Simulate coin flips with Math.random(); prompt to continue or stop and print final dollars.",
						projectLink:
							"https://codepen.io/junilearning/pen/546a7d889ffe394b3efeca62a005209c",
						solutionLink:
							"https://codepen.io/junilearning/pen/2b0624ece93522ec526afca3700ede22",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ps2_double_or_nothing.gif"
					},
					{
						title: "Drawing in JavaScript",
						content:
							"Explain D3 and SVG basics; set up an svg and append shapes with random colors.",
						projectLink:
							"https://codepen.io/junilearning/pen/90973aa93a04ccb12c61f3a85280daed",
						solutionLink:
							"https://codepen.io/junilearning/pen/a057491eec4fc8ccc9e38a5fa9f727ac"
					},
					{
						title: "HTML & CSS",
						content:
							"Review common tags and CSS properties; practice styling a table and alternating rows.",
						projectLink:
							"https://codepen.io/junilearning/pen/90c67c576d9b57cccffe8a34b4b42525",
						solutionLink:
							"https://codepen.io/junilearning/pen/69f1a078e1066a1d71f0fa1b7cb92850"
					},
					{
						title: "Materialize and D3 Interaction",
						content:
							'Introduce Materialize components; use `d3.select().on("click", func)` for a simple interaction.',
						projectLink:
							"https://codepen.io/junilearning/pen/81d62c84dfa32d88f17d0e012229bf0c",
						solutionLink:
							"https://codepen.io/junilearning/pen/6014e92e4707defd82249fb10b43d70d"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign 30–60 minutes of practice and sharing; ensure access to all homework items."
					}
				],
				supplementalProjects: []
			},
			{
				title: "JSM2 Functions",
				curriculum: [
					{
						title: "Functions",
						content:
							"Define functions (arrow syntax), parameters vs arguments, closures, and calling order."
					},
					{
						title: "String Interpolation",
						content:
							"Use template strings with backticks and ${} for readable string assembly."
					},
					{
						title: "JSM2 Project 1: Functions Practice",
						content:
							"Write functions for sum, difference, product of three, average, factorial, and exponent.",
						projectLink:
							"https://codepen.io/junilearning/pen/22b54271a2ed49675c512f1034c0e749",
						solutionLink:
							"https://codepen.io/junilearning/pen/5cd805c9464780ddb07004ec7feedd7b"
					},
					{
						title: "JSM2 Project 2: Which MetroCard",
						content:
							"Compute savings for ride counts, recommend monthly vs pay-per-ride, and print results for sample ride counts and a user input.",
						projectLink:
							"https://codepen.io/junilearning/pen/7295dc0298b2f2da6af9e1287d32456a",
						solutionLink:
							"https://codepen.io/junilearning/pen/0ee1b7431e9ee2bf0befa562068702d7"
					},
					{
						title: "JSM2 Project 3: Rock Paper Scissors",
						content:
							"Build yourTurn(), computerTurn(), and findResult(); continue until someone reaches three wins.",
						projectLink:
							"https://codepen.io/junilearning/pen/30e42b5cf6775bbf059a3d313c96f7c5",
						solutionLink:
							"https://codepen.io/junilearning/pen/2813f8a526379aefbabc47ad2f65fcd3",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ps4_rock_paper_scissors.gif"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign practice, supplemental options, and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM2 Supplemental Project 1: Geometry Functions",
						content:
							"Write geometry helpers (circle circumference/area checks, triangle types, right triangle test) and print results with random inputs.",
						projectLink:
							"https://codepen.io/junilearning/pen/1f563eb4624314cf5b3673480ec18472",
						solutionLink:
							"https://codepen.io/junilearning/pen/b8bf00b13b1d7085a129e155c9c428eb"
					},
					{
						title: "JSM2 Supplemental Project 2: Pain at the Pump",
						content:
							"Compute fuel cost from MPG, miles, and gas price; test random values; format money with toFixed(2).",
						projectLink:
							"https://codepen.io/junilearning/pen/87b49903a68f15f9132d49b704444083",
						solutionLink:
							"https://codepen.io/junilearning/pen/0ec6f1fb939a959f455f1fb70519c29e"
					},
					{
						title: "JSM2 Supplemental Project 3: Game of War",
						content:
							"Simulate 10 rounds of War drawing random cards, printing draws and scores; Ace high.",
						projectLink:
							"https://codepen.io/junilearning/pen/06315e2ce4772499678cc4959f8e2360",
						solutionLink:
							"https://codepen.io/junilearning/pen/96fa9d7b8f7255c42c313b2d914abc48"
					},
					{
						title: "JSM2 Supplemental Project 4: Debugging Functions",
						content:
							"Fix coffee shop profit calculations involving ingredient usage and pricing.",
						projectLink:
							"https://codepen.io/junilearning/pen/789be1560455a424d23eacd04d4ac69b",
						solutionLink:
							"https://codepen.io/junilearning/pen/7afcb6feb94f958d3975a028b537b9cc"
					}
				]
			},
			{
				title: "JSM3 Complex Conditionals",
				curriculum: [
					{
						title: "Conditionals",
						content:
							"Review if/else, else-if chains, and execution order."
					},
					{
						title: "Ternary Operators",
						content:
							"Rewrite simple if-else logic with condition ? true : false; note when to keep standard conditionals."
					},
					{
						title: "JSM3 Project 1: Ternary Operators Practice",
						content:
							"Convert provided if-else statements to ternary expressions, including assignments and null checks.",
						projectLink:
							"https://codepen.io/junilearning/pen/a7c2ad78bc62de68676af56657849a9b",
						solutionLink:
							"https://codepen.io/junilearning/pen/b1db3868ed9880b007754b9003337700"
					},
					{
						title: "JSM3 Project 2: Juni Department Store",
						content:
							"Apply student discounts with extra adjustments for perfect squares or primes; print final price using functions and conditionals.",
						projectLink:
							"https://codepen.io/junilearning/pen/b3de9678fa8b77aae5cc988f74bd086e",
						solutionLink:
							"https://codepen.io/junilearning/pen/d37942e57460093f20ee6217402d4ba7"
					},
					{
						title: "JSM3 Project 3: Special Numbers",
						content:
							"Write functions to detect self-dividing, perfect, and palindrome numbers; print ranges of each.",
						projectLink:
							"https://codepen.io/junilearning/pen/1be13919321ab5708564a8a7ca928226",
						solutionLink:
							"https://codepen.io/junilearning/pen/2ccb91adaa2536ecc746e938b9411171"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM3 Supplemental Project 1: Age Milestones",
						content:
							"Use ternary operators to check milestone eligibility from a prompted age.",
						projectLink:
							"https://codepen.io/junilearning/pen/8b95795088fd04a2a6b77fba56416332",
						solutionLink:
							"https://codepen.io/junilearning/pen/a85d4be8f2f94812a0357dae2a1d1e00"
					}
				]
			},
			{
				title: "JSM4 Canvas",
				curriculum: [
					{
						title: "The Canvas API",
						content:
							"Create a canvas element, set width/height, get 2D context, and understand coordinate grid."
					},
					{
						title: "JSM4 Project 1: Basic Shapes",
						content:
							"Draw rectangles with fillStyle and fillRect; draw arcs with ctx.arc and fill; degreesToRadians provided.",
						projectLink:
							"https://codepen.io/junilearning/pen/7bdedd0b00112751b87d288e4b8120b5",
						solutionLink:
							"https://codepen.io/junilearning/pen/6d083a06497b47a62825f3d2c205813e"
					},
					{
						title: "JSM4 Project 2: Shining Stars",
						content:
							"Use paths with moveTo/lineTo to draw a star, refactor to drawStar(x, y), then draw five stars in a line.",
						projectLink:
							"https://codepen.io/junilearning/pen/fa66f3594a65a54d562d3932d97e2cb7",
						solutionLink:
							"https://codepen.io/junilearning/pen/425a78d7d054dfda21d4242e818f64ba"
					},
					{
						title: "Writing Text on the Canvas",
						content:
							"Set font, fillStyle, textAlign, and use fillText to place text.",
						projectLink:
							"https://codepen.io/junilearning/pen/9355a832c485b33c747b6c600f2d13ae",
						solutionLink:
							"https://codepen.io/junilearning/pen/1c3ffebb91e5c060c6b0ba4ae4df8275"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign practice, optional supplemental art, and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM4 Supplemental Project 1: Loopy Landscape",
						content:
							"Draw a landscape using shapes and canvas techniques.",
						projectLink:
							"https://codepen.io/junilearning/pen/7911fd2b7b0ff50be9320b0c069f0613",
						solutionLink:
							"https://codepen.io/junilearning/pen/d704fa037c5f913792b1df06c8fddd6d"
					},
					{
						title: "JSM4 Supplemental Project 2: JNI Stock Price",
						content:
							"Plot a stock price line graph with labeled axes on the canvas.",
						projectLink:
							"https://codepen.io/junilearning/pen/aa96160a1e7c1d1bdac74cfe5e6a9333",
						solutionLink:
							"https://codepen.io/junilearning/pen/1d48af84b840e8d7a72fd02e82de9f28"
					}
				]
			},
			{
				title: "JSM5 Arrays and Iterators",
				curriculum: [
					{
						title: "Arrays",
						content:
							"Explain arrays, indices, push/pop, slice vs splice, and element access/reassignment."
					},
					{
						title: "JSM5 Project 1: Foray into Arrays",
						content:
							"Manipulate pet arrays, perfect squares, sums, random arrays, and equality of first/last elements using printToScreen().",
						projectLink:
							"https://codepen.io/junilearning/pen/96047a35895a6620240bd2ce171a71ec",
						solutionLink:
							"https://codepen.io/junilearning/pen/6925d98f7583227a4c1c65996a10cf40"
					},
					{
						title: "For-Of and For-Each Iterators",
						content:
							"Show for...of and forEach callbacks and closure differences."
					},
					{
						title: "Advanced Iterators",
						content:
							"Demonstrate map, filter, and reduce with simple examples."
					},
					{
						title: "JSM5 Project 2: Integrating Iterators",
						content:
							"Apply iterators to adjust arrays, invoke functions in objects, sum evens, and filter divisibles.",
						projectLink:
							"https://codepen.io/junilearning/pen/2e76b16dbd71552eeb1179b45b57ae2d",
						solutionLink:
							"https://codepen.io/junilearning/pen/2d9117dd9b2d44b478d8155655c7bb9b"
					},
					{
						title: "JSM5 Project 3: Colorful Cards",
						content:
							"Create an array of colors and use an iterator to draw cards in a row on canvas.",
						projectLink:
							"https://codepen.io/junilearning/pen/b167fc3da0e85d5ff65158f799658566",
						solutionLink:
							"https://codepen.io/junilearning/pen/03f3b4a97545b4fcec50aa6b11ab4188"
					},
					{
						title: "Two-Dimensional Arrays",
						content:
							"Explain 2D arrays, access with arr[row][col], and generate a 12x12 multiplication table."
					},
					{
						title: "JSM5 Project 4: Colorful Cards in 2D",
						content:
							"Create a 5x5 2D array of colors and render as cards on the canvas using iterators.",
						projectLink:
							"https://codepen.io/junilearning/pen/1dce247c86d866c1f33a6dce86511c71",
						solutionLink:
							"https://codepen.io/junilearning/pen/54cadf32718bc4b635e9b82ea67a7a7f"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM5 Supplemental Project 1: Pokemon Master",
						content:
							"Work through 2D array tasks in the starter to catch them all.",
						projectLink:
							"https://codepen.io/junilearning/pen/61d80971229e4f85126de1fcfb54b1d8",
						solutionLink:
							"https://codepen.io/junilearning/pen/03693f4763858d7d7c10a34186e030f3"
					},
					{
						title: "JSM5 Supplemental Project 2: Random Icons",
						content:
							"Generate six randomly colored and chosen icons using arrays and D3/Materialize.",
						projectLink:
							"https://codepen.io/junilearning/pen/e3ae971ad6fd35c3c0829208cb049099",
						solutionLink:
							"https://codepen.io/junilearning/pen/f163e56c8fa75a482877d789d08fc784"
					}
				]
			},
			{
				title: "JSM6 Objects and Properties",
				curriculum: [
					{
						title: "Objects",
						content:
							"Define objects as key-value pairs, add properties, and compare to real-world examples."
					},
					{
						title: "JSM6 Project 1: Small Talk",
						content:
							"Create an object about yourself and a user object from prompts; use ternaries to respond to shared properties.",
						projectLink:
							"https://codepen.io/junilearning/pen/c8c02ee2db01eeb4c5f408d9a1f58815",
						solutionLink:
							"https://codepen.io/junilearning/pen/0ed9be7b36e44c36de057a37265095a3"
					},
					{
						title: "For-In Iterator",
						content:
							"Iterate object properties with for...in and note object flexibility."
					},
					{
						title: "JSM6 Project 2: My Favorite Businesses",
						content:
							"Create an array of business objects with properties and products; loop to build template strings.",
						projectLink:
							"https://codepen.io/junilearning/pen/bcc6527a03ffb7ca42b705ff3f3910dd",
						solutionLink:
							"https://codepen.io/junilearning/pen/c694262e464e83912c601ad1875d6cd2"
					},
					{
						title: "Animations in the Canvas",
						content:
							"Clear the canvas with clearRect and animate with requestAnimationFrame; review via demo.",
						projectLink:
							"https://codepen.io/junilearning/pen/zYBjpZE"
					},
					{
						title: "JSM6 Project 3: Inflate and Deflate",
						content:
							"Animate a ball object growing green then shrinking red using draw, inflate, deflate, and a loop with requestAnimationFrame().",
						projectLink:
							"https://codepen.io/junilearning/pen/d0195323eaa77fa2a273961fa3df61c3",
						solutionLink:
							"https://codepen.io/junilearning/pen/20f860c221cac7107010e0299f47b953"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM6 Supplemental Project 1: My Favorite Businesses II",
						content:
							"Extend businesses with images and Materialize Autocomplete to populate cards.",
						projectLink:
							"https://codepen.io/junilearning/pen/50854534e6dccd9c7bedc0a2d01aded7",
						solutionLink:
							"https://codepen.io/junilearning/pen/7cbfe6e04babe21bb34a6d6af1028f57"
					},
					{
						title: "JSM6 Supplemental Project 2: Circle March",
						content:
							"Animate a grid of circles marching using requestAnimationFrame and canvas drawing.",
						projectLink:
							"https://codepen.io/junilearning/pen/7ac4e84b6d1ce34caa732bc0945c6255",
						solutionLink:
							"https://codepen.io/junilearning/pen/abdb1b2dadb02ac244d8cf862bd9b321"
					}
				]
			},
			{
				title: "JSM7 Helper Functions and Event Listeners",
				curriculum: [
					{
						title: "Helper Functions",
						content:
							"Emphasize breaking repeated logic into small reusable, well-named functions."
					},
					{
						title: "JSM7 Project 1: Refactory",
						content:
							"Refactor starter code into helper functions to remove repetition.",
						projectLink:
							"https://codepen.io/junilearning/pen/3a1383fc8a60d0ff0f55419c9b4940fe",
						solutionLink:
							"https://codepen.io/junilearning/pen/4e1986a769365ecdef09ebeea1144a4f"
					},
					{
						title: "Mouse Events",
						content:
							"Add click, mousedown, and mouseup listeners to a canvas and inspect event data."
					},
					{
						title: "JSM7 Project 2: Which Card",
						content:
							"Reuse Colorful Cards, add a click listener to capture x/y and log which color was clicked.",
						projectLink:
							"https://codepen.io/junilearning/pen/88140a4225b8cfb5468e91fbccfaa100",
						solutionLink:
							"https://codepen.io/junilearning/pen/1e1ad471f376b1364cd157bd9c96f9ab"
					},
					{
						title: "Key Events",
						content:
							"Use keydown/keyup listeners and keycodes (e.g., 37/39) for input handling."
					},
					{
						title: "JSM7 Project 3: Paddle",
						content:
							"Program a paddle controlled by arrow keys; start moving on keydown and stop on keyup.",
						projectLink:
							"https://codepen.io/junilearning/pen/8ccc67de1bc03e5f2c81f78a411adee1",
						solutionLink:
							"https://codepen.io/junilearning/pen/f633db1559cc122a943d0a52bcf74ebc"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM7 Supplemental Project 1: Coastal Cruise",
						content:
							"Build helper functions to fill ship seats, check fullness, register passengers, and print manifests.",
						projectLink:
							"https://codepen.io/junilearning/pen/13e9d8e0ad56ecbaff7933d0e063d682",
						solutionLink:
							"https://codepen.io/junilearning/pen/8c0f86e9e4d1996ac073f2d675141072"
					},
					{
						title: "JSM7 Supplemental Project 2: Juggling Paddle",
						content:
							"Animate a falling ball bouncing off a paddle; ball falls off-screen if missed.",
						projectLink:
							"https://codepen.io/junilearning/pen/9c003b58d7ca7770e49f9243dbecb00f",
						solutionLink:
							"https://codepen.io/junilearning/pen/8f44f06f31939f0a56050f4718f0b608"
					}
				]
			},
			{
				title: "JSM8 Collisions and Controls",
				curriculum: [
					{
						title: "Object Collisions",
						content:
							"Explain collision detection for circles (distance vs radii) and rectangles (overlap of edges)."
					},
					{
						title: "JSM8 Project 1: Circles Collide",
						content:
							"Animate two circles moving toward each other; on collision change fill color using interval timing.",
						projectLink:
							"https://codepen.io/junilearning/pen/d4a36001e0d9b6e58c640ca0f280284a",
						solutionLink:
							"https://codepen.io/junilearning/pen/2cc6ea883fc971206d81c61a3f93582e"
					},
					{
						title: "JSM8 Project 2: Rectangular Collision",
						content:
							"Create random rectangles and detect overlap by comparing edges; display a message when overlapping.",
						projectLink:
							"https://codepen.io/junilearning/pen/1c22a392782c8551073c92fe3e825849",
						solutionLink:
							"https://codepen.io/junilearning/pen/ba1bd74c40cacbdddafc645ba3f7350a"
					},
					{
						title: "JSM8 Project 3: The Bouncy Ball",
						content:
							"Simulate motion with gravity and friction for a bouncing ball, reversing velocity on collisions with ground/walls.",
						projectLink:
							"https://codepen.io/junilearning/pen/1e97468ca0197dcf6ca6d933e175b6fb",
						solutionLink:
							"https://codepen.io/junilearning/pen/fb9156c7c34ad0319ba52c3c01b326c3"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: []
			},
			{
				title: "JSM9 Games in the Canvas",
				curriculum: [
					{
						title: "Choosing a Game",
						content:
							"Select one canvas game project to complete; scope to a 2–3 week effort."
					},
					{
						title: "JSM9 Project 1: Falling Skies",
						content:
							"Implement falling objects, player movement, collision checks, scoring, and spawn timing in a main loop.",
						projectLink:
							"https://codepen.io/junilearning/pen/8d640d76fa709de228ec6303625663e3",
						solutionLink:
							"https://codepen.io/junilearning/pen/643e3bf98d5a641557276dbc1f269a02"
					},
					{
						title: "JSM9 Project 2: 2D Breakout",
						content:
							"Draw bricks, move ball and paddle, handle collisions and brick removal, and show win state.",
						projectLink:
							"https://codepen.io/junilearning/pen/0d5f9c3b21921a4bc506a1139a3091bc",
						solutionLink:
							"https://codepen.io/junilearning/pen/778b7aa1d7bcd942b617d87a517d35e2"
					},
					{
						title: "JSM9 Project 3: Asteroids",
						content:
							"Create ship movement and shooting with angles, asteroid splitting, scoring, and game-over detection.",
						projectLink:
							"https://codepen.io/junilearning/pen/4d14f6e432dd3b2dcee15a9d95eac750",
						solutionLink:
							"https://codepen.io/junilearning/pen/8a5307a6643fbf762925b08229b5a847"
					},
					{
						title: "JSM9 Project 4: Animated Starfield",
						content:
							"Build star objects with positions and velocity; update and draw repeatedly for animation.",
						projectLink:
							"https://codepen.io/junilearning/pen/6d5f8181e8ea59009eadd259e249c5c5",
						solutionLink:
							"https://codepen.io/junilearning/pen/ac7242107973239507eebc571a767c5a"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: []
			},
			{
				title: "JSM10 APIs and Requests",
				curriculum: [
					{
						title: "APIs",
						content:
							"Explain APIs, requests, and why fetch is asynchronous. Handle promises with then and json()."
					},
					{
						title: "JSM10 Project 1: Programming Jokes",
						content:
							"Fetch a random programming joke from https://official-joke-api.appspot.com/jokes/programming/random and display setup and punchline.",
						projectLink:
							"https://codepen.io/junilearning/pen/55981d32b9659656bb8cc4a17a0526bc",
						solutionLink:
							"https://codepen.io/junilearning/pen/e82a3c7cb28fcfba32ad765c0fe3009a"
					},
					{
						title: "JSM10 Project 2: Random Fox Generator",
						content:
							"Fetch https://randomfox.ca/floof/, create an img element with the URL, and append it to the page via a button click.",
						projectLink:
							"https://codepen.io/junilearning/pen/93750fc08b5b2268a1d78b296295e2e8",
						solutionLink:
							"https://codepen.io/junilearning/pen/686374da7355c247854acf33c3904b25"
					},
					{
						title: "JSM10 Project 3: Pokedex",
						content:
							"Use PokeAPI to build an autocomplete search; display name, id, type, and image for selected Pokemon with error handling.",
						projectLink:
							"https://codepen.io/junilearning/pen/35923b1d6dee01a5f3004d67836eca46",
						solutionLink:
							"https://codepen.io/junilearning/pen/e72824bf10e7457a18774db2554f860e"
					},
					{
						title: "Session Recap & Assignment",
						content:
							"Assign practice, supplemental API exploration, and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM10 Supplemental Project 1: Funny Meter",
						content:
							"Fetch 10 programming jokes, gather user ratings, and present them one by one from the /jokes/programming/ten endpoint.",
						projectLink:
							"https://codepen.io/junilearning/pen/bf88ab46e0b7314e0b0999ba35363519",
						solutionLink:
							"https://codepen.io/junilearning/pen/d07e0093689c1e654fc59de47093b043"
					}
				]
			},
			{
				title: "JSM11 SQL and Schemas",
				curriculum: [
					{
						title: "Introduction to Databases",
						content:
							"Describe relational databases, tables, keys, and why to separate data; reference example diagram."
					},
					{
						title: "SQL Queries",
						content:
							"Explain SELECT/WHERE and UPDATE syntax for querying and modifying data."
					},
					{
						title: "JSM11 Project 1: SQL SELECT Practice",
						content:
							"Complete SQLBolt lessons 1–4 on SELECT queries.",
						projectLink:
							"https://sqlbolt.com/lesson/select_queries_introduction"
					},
					{
						title: "Primary and Foreign Keys",
						content:
							"Define primary vs foreign keys and JOIN usage; relate to real-world IDs."
					},
					{
						title: "JSM11 Project 2: Join Tables Practice",
						content: "Complete SQLBolt lessons 6–7 on JOINs.",
						projectLink:
							"https://sqlbolt.com/lesson/select_queries_with_joins"
					},
					{
						title: "Database Schemas",
						content:
							"Explain schemas and relationships (one-to-many, many-to-many) with dbdiagram example."
					},
					{
						title: "JSM11 Project 3: Apartment Building",
						content:
							"Design unit and resident tables with keys and at least five properties each on dbdiagram.io.",
						projectLink: "https://dbdiagram.io/d",
						solutionLink:
							"https://dbdiagram.io/d/5facb8cf3a78976d7b7b8d44"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign SQL practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM11 Supplemental Project 1: Advanced SQL Queries",
						content:
							"Complete SQLBolt lessons 8–12 (nulls and more).",
						projectLink:
							"https://sqlbolt.com/lesson/select_queries_with_nulls"
					},
					{
						title: "JSM11 Supplemental Project 2: Music Library",
						content:
							"Create a music library schema with artists, songs, albums, genres using primary/foreign keys.",
						projectLink: "https://dbdiagram.io/d",
						solutionLink:
							"https://dbdiagram.io/d/5fadb2e23a78976d7b7bb248"
					},
					{
						title: "JSM11 Supplemental Project 3: Altering Tables",
						content:
							"Complete SQLBolt lessons 13–18 on inserting and altering tables.",
						projectLink: "https://sqlbolt.com/lesson/inserting_rows"
					}
				]
			},
			{
				title: "JSM12 NoSQL and CRUD",
				curriculum: [
					{
						title: "Introduction to NoSQL",
						content:
							"Describe document/collection structure as JSON-like objects compared to relational tables."
					},
					{
						title: "CRUD",
						content:
							"Explain create/read/update/delete via HTTP methods (POST, GET, PUT, DELETE) with fetch options."
					},
					{
						title: "JSONBin Setup",
						content:
							'Create a public bin, store `{"notes": ["my first message"]}`, note GET latest endpoint and PUT endpoint, and practice GET/PUT requests.'
					},
					{
						title: "JSM12 Project 1: Todo List",
						content:
							"Use async/await to GET the bin, render notes, and add notes with PUT; build getDB, renderDB, and addNote functions.",
						projectLink:
							"https://codepen.io/junilearning/pen/1f218d8aafbcc33fd6409a8ab1616e29",
						solutionLink:
							"https://codepen.io/junilearning/pen/MWZzbmK",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ps10_todo_list.gif"
					},
					{
						title: "JSM12 Project 2: Deleting Notes",
						content:
							"Add deleteNote to remove items by index with splice, update renderDB to include delete buttons, and persist via PUT.",
						projectLink:
							"https://codepen.io/junilearning/pen/f8f84204c272d2a6449cda485cbe7736",
						solutionLink:
							"https://codepen.io/junilearning/pen/BavGpyN"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM12 Supplemental Project 1: Checking Notes",
						content:
							"Extend the Todo List to mark todos as completed with checkmarks or strike-through styling.",
						projectLink:
							"https://codepen.io/junilearning/pen/ab6bf77b9d85e1b9a7452d5a307b6b7f",
						solutionLink:
							"https://codepen.io/junilearning/pen/bc74a6591ecf2d986cd8fd83eb46e427"
					}
				]
			},
			{
				title: "JSM13 Message Board",
				curriculum: [
					{
						title: "JSM13 Project 1: Message Board",
						content:
							"Build a message board storing posts as JSON, with inputs for URL, image, and title; render posts above the form.",
						projectLink:
							"https://codepen.io/junilearning/pen/6c0b3c5a207fc24b58c44a5f481922e3",
						solutionLink:
							"https://codepen.io/junilearning/pen/GRPwwOg"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: [
					{
						title: "JSM13 Supplemental Project 1: Adding Comments",
						content:
							"Allow users to add comments to each post and display them beneath posts.",
						projectLink:
							"https://codepen.io/junilearning/pen/f40d31ed70aef27cee691e91d947ef14",
						solutionLink:
							"https://codepen.io/junilearning/pen/c3fb5542e72c66ad7264b94a8be3c4c0"
					}
				]
			},
			{
				title: "JSM14 Quiz Game",
				curriculum: [
					{
						title: "JSM14 Project 1: Quiz Game",
						content:
							"Build a state capitals quiz using canvas to color states based on answers; fetch state data from provided JSONBin and manage game states.",
						projectLink:
							"https://codepen.io/junilearning/pen/f8ec7312634d2011e58c44d691d1da13",
						solutionLink:
							"https://codepen.io/junilearning/pen/540c4d060641bb749cefde340d69acd6",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ps10_us_capitals_quiz.gif"
					},
					{
						title: "Session Recap & Assignment",
						content: "Assign practice and sharing."
					}
				],
				supplementalProjects: []
			},
			{
				title: "JSM15 Master Project",
				curriculum: [
					{
						title: "Assignment Review",
						content:
							"Review prior assignment and discuss next-course options."
					},
					{
						title: "JSM15 Project 1: Master Project",
						content:
							"Plan and build a web app or game (example chatroom). Scope to about two weeks, pseudocode stages, and work independently with support."
					},
					{
						title: "Course Recap",
						content:
							"Recap course concepts and discuss the next course."
					}
				],
				supplementalProjects: []
			}
		]
	},
	{
		name: "Machine Learning",
		modules: [
			{
				title: "ML1 K-Means Clustering",
				curriculum: [
					{
						title: "Introduction to Machine Learning",
						content:
							"Explain that AI is about building intelligent systems, and machine learning (ML) is the subset where systems learn patterns from data. Give everyday examples such as spam filters learning what emails to block and Netflix learning what shows to recommend based on viewing history. Briefly introduce the four main ML types: reinforcement learning (learning by reward and punishment), unsupervised learning (finding patterns without labels), supervised learning (learning from labeled examples), and semi-supervised learning (mix of labeled and unlabeled data). Emphasize that this course will focus mainly on unsupervised and supervised learning."
					},
					{
						title: "Unsupervised Learning & Clustering",
						content:
							"Introduce unsupervised learning as taking a dataset without labels and trying to find patterns or groupings in it. Use customer segmentation as a motivating example: a store owner can group customers by characteristics like age, income, or spending behavior to better target marketing. Define clustering as the process of finding distinct groups (clusters) of similar data points. Work through a simple 2D example with points A(1,1), B(2,1), C(3,3), and D(4,3). Have plot them and visually identify that {A,B} form one cluster and {C,D} form another. Discuss why algorithms are needed when there are hundreds or thousands of points instead of just four."
					},
					{
						title: "K-Means Clustering Algorithm",
						content:
							"Introduce k-means clustering as a popular algorithm that partitions data into k clusters. Define a centroid as the mean of all points in a cluster, thought of as the cluster\'s center. Explain that each point is assigned to the cluster whose centroid it is closest to, usually using Euclidean distance sqrt((y2 - y1)^2 + (x2 - x1)^2). Use the A, B, C, D example to walk through k-means for k = 2: (1) choose k, (2) pick initial centroids (e.g., A and B), (3) assign each point to the nearest centroid, (4) recompute centroids by averaging point coordinates in each cluster, and (5) repeat until centroids stop changing. Show one or two iterations, computing distances and new centroids, and highlight that results can depend on the initial random centroids."
					},
					{
						title: "Google Colab Setup",
						content:
							"Introduce Google Colab as the main IDE for this course and note that it requires a Google account. Have log in, go to https://colab.research.google.com, and bookmark it. Open the ‘Welcome to Colaboratory\' notebook and skim key features together. Create a new notebook (File → New notebook) and point out the left sidebar tools like Table of Contents, Find and Replace, and Files. Show how to add code and text cells, run code, and reorder cells. Have write a small code cell that creates a variable and prints it, then another that prints their name, and finally a text cell with a short description. Demonstrate Runtime → Restart and run all to re-execute the notebook from top to bottom."
					},
					{
						title: "ML1 Project 1: Customer Segmentation",
						content:
							"Using Google Colab and the Kaggle customer segmentation dataset, build k-means clustering from scratch to group customers by annual income and spending score. First, have create a dedicated folder in Google Drive for their ML projects and upload the dataset there. In Colab, mount Google Drive using the Files sidebar, then read the CSV with pandas (for example, data = pd.read_csv('/content/drive/MyDrive/MachineLearning/Mall_Customers.csv')). Examine the columns and decide which to use for clustering (annual income and spending score). Create a scatterplot of income vs. spending score before clustering and ask how many clusters they see by eye. Initialize k (e.g., k = 5), construct a list or array of data points, and choose k random points as initial centroids. Set up data structures for centroids, old centroids, and an array holding each customer\'s cluster index. Implement a loop that repeats until centroids stop changing: compute distances from each point to each centroid using Euclidean distance, assign each point to the nearest centroid, copy current centroids to old centroids using deepcopy, and recompute each centroid by averaging all points in that cluster. After convergence, call draw_clustered_graph() from the starter code to plot the final clusters. Run the algorithm multiple times and observe that clusters may change slightly due to random initialization. Experiment with different k values and compare the resulting cluster structures. Wrap up by having the record a short video explaining the dataset, the goal of clustering, their findings, and any surprising patterns they noticed.",
						projectLink:
							"https://replit.com/@JuniLearning/ML1-Customer-Segmentation-Starter-Updated?skipMigration=1",
						solutionLink:
							"https://replit.com/@JuniLearning/ML1-Customer-Segmentation-Updated?skipMigration=1",
						datasetLink:
							"https://www.kaggle.com/vjchoudhary7/customer-segmentation-tutorial-in-python",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml1_project_1.mp4"
					},
					{
						title: "ML1 Project 2: Disney Movie Clustering",
						content:
							"Use k-means via scikit-learn to cluster Disney movies by year and inflation-adjusted revenue. In Colab, read in the Disney movie dataset from Kaggle, then extract the release year and inflation columns. Because the release date is stored as a string, build a new list or column containing just the year as an integer. Create a scatterplot of year vs. inflation-based revenue before clustering and discuss how hard it is to visually see separate groups. Set k to a few different values and use scikit-learn\'s k-means implementation: build a 2D feature matrix, call fit_predict() to get cluster assignments, and access cluster_centers_ for centroids. Call draw_clustered_graph() to plot the clustered scatterplot. Have experiment with multiple k values and compare how cluster shapes and boundaries change. End with a short explanation (via recording) of what the dataset contains, what they tried to discover, and anything surprising in how movies grouped by time and inflation.",
						projectLink:
							"https://replit.com/@JuniLearning/ML1-Disney-Movie-Clustering-Starter-Updated?skipMigration=1",
						solutionLink:
							"https://replit.com/@JuniLearning/ML1-Disney-Movie-Clustering-Updated?skipMigration=1",
						datasetLink:
							"https://www.kaggle.com/prateekmaj21/disney-movies",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml1_project_2.mp4"
					}
				],
				supplementalProjects: [
					{
						title: "ML1 Supplemental Project 1: Flower Clustering",
						content:
							"Using the provided starter code and the iris flower dataset, implement or apply k-means clustering to group flowers by petal length and petal width. Load the iris.csv file from the given URL into your notebook. Either use scikit-learn\'s k-means or write the algorithm from scratch (as in the customer segmentation project). Plot the raw (unclustered) data first, then plot the clustered data with different colors for each cluster. Compare how many clusters you see visually versus the k you choose in code and discuss how the clusters relate to the three iris species.",
						projectLink:
							"https://repl.it/@JuniLearning/ML1-Flower-Clustering-Starter?skipMigration=1",
						solutionLink:
							"https://repl.it/@JuniLearning/ML1-Flower-Clustering?skipMigration=1",
						datasetLink:
							"https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/639388c2cbc2120a14dcf466e85730eb8be498bb/iris.csv",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml1_supplemental_project_1.mp4"
					}
				]
			},
			{
				title: "ML2 K-Nearest Neighbors",
				curriculum: [
					{
						title: "Introduction to Supervised Learning",
						content:
							"Define supervised learning as training on a dataset where both inputs and outputs (labels) are known. Explain that the algorithm learns a mapping from inputs to outputs, then uses that mapping to predict labels on new inputs where the output is unknown. Emphasize that the core steps are building feature vectors from the raw data, associating each vector with a label, training on these input–output pairs, and then evaluating the model on new data."
					},
					{
						title: "Classification Basics",
						content:
							"Introduce classification as a supervised learning task where the output is a discrete category. Use spam vs. non-spam email as a simple example. Connect classification back to the customer segmentation project: the clusters discovered with k-means can be treated as categories or labels (e.g., cluster 0, cluster 1, cluster 2, etc.). Explain that once you know which cluster each customer belongs to, you can train a classifier that takes a customer\'s income and spending score and predicts the correct cluster for new customers."
					},
					{
						title: "K-Nearest Neighbors Algorithm",
						content:
							"Introduce k-nearest neighbors (KNN) as a simple classification method that labels a new input based on the majority label among its k closest neighbors in the training data. Use the sample dataset with points A(1,1; Cluster 1), B(2,1; Cluster 1), C(3,3; Cluster 2), D(4,3; Cluster 2), and an unlabeled point E(4,4). Plot the dataset and have predict E\'s cluster visually. Then walk through the KNN algorithm: choose k (e.g., k = 2), compute Euclidean distance from E to each point, identify the k closest neighbors, and assign E to the cluster appearing most often among those neighbors. Show the distance table and highlight that E is closest to C and D, both in Cluster 2, so KNN classifies E as Cluster 2."
					},
					{
						title: "Training, Validation, and Testing Data",
						content:
							"Explain that to evaluate a classifier properly, the dataset is split into training, validation, and testing sets. Training data is used to fit the model; validation data is used to tune hyperparameters (like k) and check accuracy while making adjustments; and testing data is held out and used only at the end to measure final performance. For most course projects, focus on splitting into training and testing sets, using training for model fitting and testing to estimate how well the classifier generalizes to new data."
					},
					{
						title: "ML2 Project 1: KNN Customer Segment Classification",
						content:
							"Using the previous customer segmentation dataset and your clustering results, build a KNN classifier that predicts a customer\'s segment from annual income and spending score. In Colab, start from your saved segmentation work or reload the dataset and re-create the features and labels (cluster assignments). Decide on a value of k (for example, 3 or 5) and build feature vectors [income, spending score] for each customer. Split your data into training and testing sets. Implement KNN either manually (computing distances, finding nearest neighbors, and doing majority vote) or via scikit-learn\'s KNeighborsClassifier. Use the test set to compute accuracy and compare predictions to the original cluster labels. Create at least one new ‘fake\' customer feature vector and predict its segment, then check visually against your cluster plot. Record a short explanation of how you chose k, how well the classifier performed, and whether the classification of your new customer makes sense.",
						solutionLink:
							"https://replit.com/@JuniLearning/ML2-KNN-Customer-Segmentation-Classification-Updated?skipMigration=1",
						datasetLink:
							"https://www.kaggle.com/vjchoudhary7/customer-segmentation-tutorial-in-python",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml2_project_1.mp4"
					},
					{
						title: "ML2 Project 2: KNN Car Classification",
						content:
							"Build a KNN classifier to predict car ‘acceptability\' using the classic car evaluation dataset. In Colab, download the dataset and inspect its documentation to identify the target label (acceptability) and the features (buying, maintenance, doors, persons, luggage boot, safety). Notice that many features are categorical strings rather than numbers; design dictionaries mapping each category value to a numeric code and use pandas.replace() to encode them. Construct feature vectors from the encoded columns and labels from the acceptability column, whose possible values are {unacc, acc, good, vgood}. Split the data into training and testing sets with train_test_split(). Use scikit-learn\'s KNeighborsClassifier to train the model and compute accuracy on the test set. Create your own feature vector describing a hypothetical car and classify it; discuss whether the result seems reasonable. Finish by summarizing the dataset, your feature encoding choices, model accuracy, and any surprising results.",
						projectLink:
							"https://replit.com/@JuniLearning/ML2-KNN-Car-Classification-Starter?skipMigration=1",
						solutionLink:
							"https://repl.it/@JuniLearning/ML2-KNN-Car-Classification?skipMigration=1",
						datasetLink:
							"https://sci2s.ugr.es/keel/dataset.php?cod=56#sub2",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml2_project_2.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "ML3 Naive Bayes",
				curriculum: [
					{
						title: "Naive Bayes Overview",
						content:
							"Introduce Naive Bayes as a supervised classification method based on probability rules. Explain that it models the probability of each possible label given the input features and chooses the label with the highest probability. Mention that ‘naive\' refers to the simplifying assumption that features are conditionally independent given the label, which makes the math easier and still works surprisingly well in many real-world problems."
					},
					{
						title: "Naive Bayes with the Iris Dataset",
						content:
							"Use the iris flower dataset (sepal length, sepal width, petal length, petal width, species) to explain how Naive Bayes classification works in practice. Identify the labels as the three species setosa, versicolor, and virginica, and the feature vector as [sepal_length, sepal_width, petal_length, petal_width]. Stress that the feature order is fixed. Describe the process of splitting the data into training and testing sets, using the training data to estimate probabilities (how likely each feature pattern is for each species), and then classifying new feature vectors by choosing the label with the highest conditional probability. Emphasize that accuracy improves when features are informative and when there is enough training data."
					},
					{
						title: "ML3 Project 1: Iris Dataset Classification",
						content:
							"In Colab, build a Naive Bayes classifier for the iris dataset. Load the CSV from the provided URL, then separate it into X (feature vectors) and y (labels). Use pandas.drop() to remove the species column when constructing X. Print the first few rows of X and y with head() to verify that the features and labels align (X[i] corresponds to y[i]). Split the data into training and testing sets. Use scikit-learn\'s MultinomialNB or another suitable Naive Bayes variant, call fit() on the training data, then call predict() on the test data and compute accuracy with accuracy_score(). Finally, create a few custom feature vectors and have the classifier predict their species, noting that these examples may not exist in the original dataset. Summarize the dataset, model accuracy, and any surprising classifications.",
						solutionLink:
							"https://repl.it/@JuniLearning/ML3-Naive-Bayes-Iris-Flowers-Classification?skipMigration=1",
						datasetLink:
							"https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/639388c2cbc2120a14dcf466e85730eb8be498bb/iris.csv",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml3_project_1.mp4"
					},
					{
						title: "ML3 Project 2: Email Spam Classification",
						content:
							"Use Naive Bayes to classify emails as spam or not spam with a realistic text dataset. In Colab, load the spam mails dataset from Kaggle and drop irrelevant columns such as messageid and label columns that aren\'t needed for modeling. Remove duplicate rows. Write a preprocessing function that removes punctuation, lowercases the text, and filters out common stopwords like ‘the\', ‘is\', and ‘and\' to avoid over-emphasizing them. Use scikit-learn\'s CountVectorizer with your custom preprocessing function to turn each email into a bag-of-words feature vector. Build a list of labels corresponding to whether each email is spam or ham. Split the data into training and testing sets (e.g., 80% training, 20% testing), train a Naive Bayes classifier (such as MultinomialNB), and evaluate its accuracy on the test set. Discuss training time, any misclassifications, and why Naive Bayes is a good baseline for text classification. Wrap up with a short explanation of the dataset content, what you were trying to detect, your model\'s accuracy, and any surprising results.",
						projectLink:
							"https://colab.research.google.com/drive/1nV9spL17iCWHZMhJMzdWwjJ_Td6ZarIY",
						solutionLink:
							"https://colab.research.google.com/drive/1cwE9wp5LQ74Va3OtGnCoAjhCXkeYGPQy",
						datasetLink:
							"https://www.kaggle.com/venky73/spam-mails-dataset",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml3_project_2.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "ML4 Neural Networks",
				curriculum: [
					{
						title: "Neurons and Activation Functions",
						content:
							"Another technique or tool we can use for classification is called a neural network.\n\n" +
							"A neural network is built out of neurons. A neuron is a node in a graph that takes in a specific number of inputs then produces a single output by doing some math on the inputs.\n\n" +
							"A neuron contains some number of predetermined weights. The number of weights in a neuron is equivalent to the number of inputs to that neuron. For instance, the neuron above would have two weights in it (`w1` and `w2`).\n\n" +
							"Once the neuron takes an input, it calculates the output first multiplying each input by its corresponding weight: `x1\*w1` and `x2\*w2.`\n\n" +
							"Then, the neuron adds together each of these products along with a bias value called *b*: `x1\*w1 + x2\*w2 + b`.\n\n" +
							"Finally, the neuron passes the sum through a special function called an activation function f to turn the output into a nice predictable form. Show the a picture of the sigmoid function. The sigmoid function, for example, always returns a value between 0 and 1. Some common activation functions are the sigmoid and the relu functions.\n\n" +
							"The output of the activation function is the output of the neuron: `y = f(x1\*w1 + x2\*w2 + b)`.\n\n" +
							"Let's walk through this example of an input to the above neuron:\n" +
							"\tlet `x1 = 0`, `x2 = 1`, `w1 = 1`, `w2 = 2`, `b = 1`, `activation function = sigmoid`\n" +
							"\t`x1\*w1 + x2\*w2 + b = (0)(1) + (1)(2) + 1 = 3`\n" +
							"\t`f(3) = 0.953` (using a sigmoid calculator online)"
						// content:
						// 	"Introduce a neuron as a basic computational unit that takes multiple inputs and produces a single output. Explain that each neuron has weights (w1, w2, …) corresponding to each input and a bias term b. For two inputs x1 and x2, the neuron computes z = x1*w1 + x2*w2 + b and then passes z through an activation function f to get the final output y = f(z). Show or describe common activation functions such as sigmoid (outputs between 0 and 1) and ReLU (rectified linear unit). Work through a numeric example with x1 = 0, x2 = 1, w1 = 1, w2 = 2, b = 1, and a sigmoid activation, computing z and then f(z)."
					},
					{
						title: "ML4 Project 1: Build a Neuron Class",
						content:
							"What instance attributes should the Neuron class have? The `Neuron` class needs the weights (`w1` and `w2`) and the activation function (You may need to pass in a function as an argument).\n" +
							"What parameters does the `run()` method need? It needs the two inputs (`x1` and `x2`) into the neuron and the bias.\n" +
							"Outside the class, write a sigmoid function that takes in a single input and returns the output of the sigmoid function.\n" +
							"Create an instance of `Neuron` and pass an input into it.",
						// content:
						// 	"In Colab, implement a Neuron class that encapsulates the behavior of a single neuron. Decide on instance attributes such as a list or array of weights and an activation function passed in at initialization. Implement a run() method that takes input values (e.g., x1 and x2) plus a bias and computes the neuron\'s output by multiplying inputs by their weights, summing with the bias, and applying the activation function. Write a standalone sigmoid function that takes a numeric input and returns 1 / (1 + exp(-x)). Create an instance of Neuron using chosen weights and sigmoid as the activation, then call run() with various inputs to confirm the output matches manual calculations. Conclude with a short explanation of how the class works and what surprised you about implementing activation functions as function arguments.",
						solutionLink:
							"https://repl.it/@JuniLearning/ML4-Neuron-Implementation?skipMigration=1",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml4_project_1.mp4"
					},
					{
						title: "Neural Network Structure",
						content:
							"Explain that a neural network is a collection of neurons organized in layers. Describe the typical structure: an input layer that simply passes in the feature values, one or more hidden layers where neurons compute intermediate representations, and an output layer that produces the final prediction. Walk through a small example network with two inputs, a hidden layer of two neurons, and a single output neuron. Describe how data flows: inputs go into both hidden neurons; each hidden neuron computes its output; then the output neuron takes those two hidden outputs as inputs, applies its own weights and activation, and produces the final output. Use a worked numeric example similar to the one in the text to show how this network produces a continuous result."
					},
					{
						title: "ML4 Project 2: Simple Neural Network Simulation",
						content:
							"Using the Neuron class from the previous project, simulate a simple neural network with two inputs, one hidden layer with two neurons, and one output neuron. Initialize input values x1, x2, and a bias b. Create two Neuron objects to represent the hidden layer, each with its own weights and activation function (for example, sigmoid). Create a third Neuron object to represent the output layer, possibly using ReLU as the activation. Feed the input (x1, x2, b) into each hidden neuron, collect their outputs, then feed these outputs and the bias into the output neuron. Print intermediate results from each neuron so the flow of data through the network is easy to follow. Discuss how changing weights or activation functions changes the final output.",
						solutionLink:
							"https://repl.it/@JuniLearning/ML4-Simple-Neural-Network?skipMigration=1",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml4_project_2.mp4"
					},
					{
						title: "Neural Networks for Classification",
						content:
							"Explain how neural networks can be used for classification tasks. Connect back to feature vectors: each feature becomes an input node in the input layer. During training, each feature vector is fed forward through the network to produce an output, which is compared to the true label using a loss function that measures how far off the prediction is. Describe backpropagation as the process of computing gradients of the loss with respect to the network\'s weights and updating those weights to reduce loss over time. Emphasize that training is essentially finding weights and biases that minimize loss over all training examples. Note that outputs of a network for classification are continuous, so we need a mapping from the output to discrete categories, such as rounding a single output between 0 and 1 or using softmax for multi-class problems. Introduce keras as a high-level library that handles many of the implementation details for building and training neural networks."
					},
					{
						title: "ML4 Project 3: Diabetes Diagnosis with Neural Networks",
						content:
							"In Colab, use keras to build a neural network that predicts whether patients in the Pima Indians Diabetes dataset have diabetes. Download and inspect the dataset from Kaggle, identifying which columns will serve as features and which column is the label. Upload the data to Google Drive and mount it in Colab. Read the CSV into pandas, separate it into a feature matrix X and a labels vector y, and then split into training and testing sets. Use keras (via TensorFlow) to build a suitable network architecture for binary classification (for example, one or two dense hidden layers with ReLU activations and a final output layer with sigmoid). Compile the model with an appropriate loss function and optimizer, train it on the training data, and evaluate accuracy on the test set. Experiment with different numbers of epochs and batch sizes, observing how performance and training time change. Summarize the dataset contents, your network structure, model accuracy, and any surprising patterns in the predictions.",
						projectLink:
							"https://colab.research.google.com/drive/1CLK1xyg-6rvgj2Z8KtTkt2y4sGYL-dTG",
						solutionLink:
							"https://colab.research.google.com/drive/1tlWrkVmPQC3KPPgfLXAz6l9pk70jkS5b",
						datasetLink:
							"https://www.kaggle.com/uciml/pima-indians-diabetes-database",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml4_project_3.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "ML5 Introduction to Regression",
				curriculum: [
					{
						title: "Regression vs. Classification",
						content:
							"Contrast regression with classification: both use supervised learning and labeled datasets, but in regression the output is a continuous numeric value rather than a discrete category. Use predicting house prices as an example where outputs can take many possible numeric values. Emphasize that in regression it is acceptable and expected to be off by some margin and that the goal is to minimize average error rather than be exactly correct on every example."
					},
					{
						title: "Linear Regression Basics",
						content:
							"Introduce linear regression as modeling the relationship between an input x and an output y using a straight line y = m x + b. Draw example data points on a graph and show several potential lines; discuss which line better fits the data and why. Explain that in practice we use libraries to compute m (slope) and b (intercept) to minimize error over the whole dataset. Briefly describe correlation: a positive correlation means y tends to increase as x increases, a negative correlation means y tends to decrease as x increases, and the magnitude (close to 1 vs. close to 0) indicates strength of the relationship."
					},
					{
						title: "ML5 Project 1: Simple Linear Regression",
						content:
							"In Colab, open the starter code for simple linear regression. Plot the given x and y data as a scatterplot and ask whether the data appears to follow a roughly straight-line trend. Use scikit-learn\'s LinearRegression class to fit a model to the data. Show how to extract and print the slope, y-intercept, correlation (R^2 score), and use the model to predict y for a given x. Plot the line of best fit on top of the scatterplot to visually confirm that it matches the trend. Have describe whether the relationship is positive or negative and whether it appears strong, weak, or moderate based on both the graph and R^2 value. Encourage them to try predicting outputs for x values not in the original dataset and discuss whether the predictions seem reasonable.",
						projectLink:
							"https://repl.it/@JuniLearning/ML5-Simple-Linear-Regression-Starter?skipMigration=1",
						solutionLink:
							"https://replit.com/@JuniLearning/Simple-Linear-Regression-Updated?skipMigration=1",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml5_project_1.mp4"
					},
					{
						title: "Polynomial Regression",
						content:
							"Not all relationships are linear; some are better modeled with curves. Show an example of data that follows a U-shaped or curved pattern and introduce polynomial regression as fitting equations like y = a x^2 + b x + c (or higher degree polynomials) to the data. Polynomial regression adds terms with higher powers of x to capture curvature, and scikit-learn can generate polynomial features and fit these models similarly to linear regression."
					},
					{
						title: "ML5 Project 2: Simple Polynomial Regression",
						content:
							"Using the starter code in Colab, plot the given x and y data and discuss whether a straight line looks appropriate or whether the shape appears curved. First build a linear regression model and plot its line; evaluate how well it fits by examining residuals and the average error. Then build a polynomial regression model (for example, quadratic) using scikit-learn\'s PolynomialFeatures plus LinearRegression. Print the learned coefficients and intercept, and plot the resulting curve along with the data. Compare the fit quality and typical error of the linear versus polynomial models. For a chosen x value, compute predictions from both models and compare them to the actual y; discuss which model appears to capture the trend better.",
						projectLink:
							"https://replit.com/@JuniLearning/Simple-Polynomial-Regression-Starter-Updated?skipMigration=1",
						solutionLink:
							"https://replit.com/@JuniLearning/Simple-Polynomial-Regression-Updated?skipMigration=1",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml5_project_2.mp4"
					},
					{
						title: "ML5 Project 3: Predicting Life Expectancy",
						content:
							"In Colab, use WHO life expectancy data to build and compare regression models. Upload the dataset to Google Drive, create a Colab notebook, and mount Drive. Read the CSV into pandas, identify multiple features (such as health, economic, and demographic variables) as inputs, and life expectancy as the target output. Split data into training and testing sets. Build a linear regression model using scikit-learn and measure its performance with the model\'s score on the test data. Then build a polynomial regression model (for example by expanding some features or using polynomial transformations) and evaluate its score as well. Compare which model fits the data better and discuss whether extra complexity is justified. Summarize which factors seem most correlated with life expectancy and which model gave more reliable predictions.",
						projectLink:
							"https://colab.research.google.com/drive/1BAz3vBA8UefNbI5ejqjlEaKtJshEK3Bc",
						solutionLink:
							"https://colab.research.google.com/drive/1v08pPhtCoA6J8IdqT1c7SXemnA3exlcd#scrollTo=7BRzG9FlRD_L",
						datasetLink:
							"https://www.kaggle.com/kumarajarshi/life-expectancy-who",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml5_project_3.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "ML6 Regression with Neural Networks",
				curriculum: [
					{
						title: "Neural Networks for Regression",
						content:
							"Explain that neural networks can also be used for regression, not just classification. Emphasize that for nonlinear or complex relationships, neural networks can approximate a curved function that fits the data more flexibly than polynomial regression. Note the tradeoffs: networks usually require more data, take longer to train, and are harder to interpret, so they are best used when simpler models are not accurate enough."
					},
					{
						title: "Evaluating Regression Models",
						content:
							"Introduce mean squared error (MSE) and mean absolute error (MAE) as standard metrics for regression. Both measure average prediction error: MAE averages absolute differences, while MSE averages squared differences, which penalizes large errors more heavily. Explain that a good regression model aims to minimize these values on both training and test data. Discuss overfitting: if a model fits the training data extremely well but performs poorly on new data, it has memorized rather than generalized. Reinforce the importance of train–test splits (for example, 80% training and 20% testing) to check generalization."
					},
					{
						title: "ML6 Project 1: Predicting House Prices with Neural Networks",
						content:
							"In Colab, build a neural network regression model for the Boston housing dataset using keras. Create a new notebook, then load the dataset from keras and split it into training and testing sets. Use StandardScaler or a similar tool to normalize input features (so they have similar scales), which helps the network train more effectively. Design a neural network with one or more dense hidden layers suitable for regression, using an appropriate activation (such as ReLU) in hidden layers and a linear activation in the output layer. Compile the model with a loss function appropriate for regression (such as MSE) and a suitable optimizer. Train the model on the training data and record the mean absolute error over epochs; plot MAE vs. epoch to show how error decreases as training progresses. Evaluate the model on the test set, printing mean squared error to gauge performance. Finally, plot predicted vs. actual house prices for the test set on a scatterplot with the line y = x for reference; points close to this line indicate accurate predictions. Summarize how normalization, network architecture, and training epochs influence accuracy and overfitting.",
						projectLink:
							"https://colab.research.google.com/drive/1yuCcN855nKnL_25zYHiN8QORMhIy2zLm",
						solutionLink:
							"https://colab.research.google.com/drive/1bQ4JWcP0K0_lMEVks-cQ10HOMXAawvXX",
						datasetLink:
							"https://www.cs.toronto.edu/~delve/data/boston/bostonDetail.html",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml6_project_1.mp4"
					}
				],
				supplementalProjects: []
			},
			{
				title: "ML7 Image Classifier",
				curriculum: [
					{
						title: "Image Data and Classification",
						content:
							"Explain that images are just arrays of pixel values, so they can be used as input to machine learning models just like numerical datasets. Each pixel can store information such as brightness or RGB color values. Describe image classification as assigning a label to each image (for example, rainy vs. sunny vs. cloudy vs. sunrise). Emphasize that modern image classifiers are typically neural networks that learn from many labeled examples how patterns in pixel data correspond to categories."
					},
					{
						title: "ML7 Project 1: Weather Image Classifier",
						content:
							"In Colab, build a neural network to classify weather images (rainy, sunny, cloudy, sunrise). Upload the dataset to a Google Drive folder and mount Drive in Colab. Use Keras\'s ImageDataGenerator to define training, validation, and test image generators, handling image rescaling, batching, and directory loading. Design a neural network appropriate for image data—either a simple convolutional neural network (CNN) or a dense network after flattening the images. Compile the model with a suitable loss function for multi-class classification and train it on the training set while monitoring validation accuracy. Evaluate the trained model on the test set to estimate real-world performance. Then load individual images from an example set, run model.predict() on them, and interpret the outputs by taking the index of the largest predicted probability to determine the predicted class. Compare predictions with true labels and discuss success and failure cases. Summarize the dataset, model architecture, test accuracy, and any images where the model struggled.",
						projectLink:
							"https://colab.research.google.com/drive/12HpOOjmQgf5sLmrTgknSFX24aSln6rT6?usp=sharing",
						solutionLink:
							"https://colab.research.google.com/drive/1YvuhSoBOXsV7Iip3Xu5AGgQC4LmJWbnL?usp=sharing",
						datasetLink:
							"https://data.mendeley.com/datasets/4drtyfjtfy/",
						mediaLink:
							"https://static.classes.jacobdanderson.net/ml7_project_1.mp4"
					},
					{
						title: "Further Reading on ML Models",
						content:
							"Provide optional reading to deepen understanding of advanced concepts used in modern ML: loss functions (how models measure their error during training and why different problems use different loss definitions), convolutional neural networks (CNNs) for image processing and why convolutions help detect patterns like edges and textures, and the idea of a ‘model\' as a trained artifact that can be deployed and reused. Have skim articles on loss functions, convolutional networks, and machine learning models from sources such as Google\'s ML Crash Course, IBM, Microsoft, and Databricks. Encourage questions about how these concepts relate to the weather image classifier they just built."
					}
				],
				supplementalProjects: []
			},
			{
				title: "ML8 Master Project",
				curriculum: [
					{
						title: "Master Project Planning",
						content:
							"Introduce the Master Project as a capstone where the chooses a real dataset and builds a substantial machine learning project around it. Explain that the project can be classification or regression and can use any combination of algorithms learned throughout the course (k-means, KNN, Naive Bayes, neural networks, regression, etc.). Help browse suggested datasets and project ideas: classification (fake news detection, credit card fraud detection, Titanic survival prediction) or regression (loan amount prediction, Bitcoin price prediction, stock price prediction, medical insurance cost). Have them pick one idea that genuinely interests them and clearly define the problem they want to solve."
					},
					{
						title: "Master Project Implementation",
						content:
							"Once the topic and dataset are chosen, scope the project. Identify the input features, target labels or regression outputs, and evaluation metrics. Decide which two algorithms to compare: for classification, perhaps Naive Bayes vs. a neural network; for regression, maybe linear/polynomial regression vs. a neural network. Set up a new Colab notebook, upload or connect to the dataset, and perform standard steps: data cleaning, feature engineering, train–test split, model training, evaluation, and comparison. Encourage writing clear code cells and explanatory text cells documenting the process. Aim for a project that spans about two weeks, with substantial implementation and debugging done independently while you provide guidance and code reviews."
					},
					{
						title: "Master Project Examples",
						content:
							"Show the example notebooks for similar projects, such as a Titanic survival predictor or a medical insurance cost predictor. Walk through how those examples are structured: data exploration, feature selection, model building, evaluation, and reflection on results. Use these examples as inspiration but ensure the project is original work and analysis, not just a copy. Discuss how techniques or visualizations from these examples might be adapted to the chosen dataset."
					},
					{
						title: "Master Project Presentation",
						content:
							"When the project reaches a solid, working state, prepare a presentation. Explain which concepts from the course were used (clustering, classification, regression, neural networks, train–test split, etc.) and what was learned about the data. Consider sharing the accomplishment with friends or family."
					},
					{
						title: "Course Recap & Next Steps",
						content:
							"Wrap up the course by recapping the major ideas learned: unsupervised learning and clustering, supervised learning and classification, KNN, Naive Bayes, neural networks, regression, overfitting and evaluation, and image classification. Discuss how these pieces fit together in the Master Project. Then talk about recommended next courses based on interests and confidence—options might include USACO training for advanced competitive programming, AP Computer Science, or language-specific Level 1 courses in Java, JavaScript, or C++. Choose a path that best matches the goals at hand and treat the Master Project as a portfolio piece to share with teachers, mentors, or future programs."
					}
				],
				supplementalProjects: []
			}
		]
	}
];

const normalizedCourses: CourseDefinition[] = rawCourses.map(course => {
	const courseId = slugify(course.name);

	return {
		id: courseId,
		name: course.name,
		modules: course.modules.map(module => {
			const moduleId = slugify(`${courseId}-${module.title}`);

			const mapItems = (
				items: RawCourseModuleItem[],
				prefix: string
			): CourseModuleItem[] =>
				items
					.filter(item => !shouldHideItem(item.title))
					.map(item => ({
						id: slugify(`${moduleId}-${prefix}-${item.title}`),
						title: item.title,
						content: normalizeContent(item.content),
						projectLink: item.projectLink,
						solutionLink: item.solutionLink,
						datasetLink: item.datasetLink,
						mediaLink: item.mediaLink
					}));

			return {
				id: moduleId,
				title: module.title,
				curriculum: mapItems(module.curriculum, "curriculum"),
				supplementalProjects: mapItems(
					module.supplementalProjects,
					"supplemental"
				)
			};
		})
	};
});

export const useCoursesStore = defineStore("courses", () => {
	const courses = computed(() => normalizedCourses);

	function getCourseById(id: string) {
		return courses.value.find(course => course.id === id) ?? null;
	}

	return {
		courses,
		getCourseById
	};
});
