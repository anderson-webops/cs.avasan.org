import { defineStore } from "pinia";
import { computed } from "vue";

interface RawCourseModuleItem {
	title: string;
	content: string;
	projectLink?: string;
	solutionLink?: string;
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

function normalizeContent(content: string): string {
	return content.replace(/\n{3,}/g, "\n\n").trim();
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
•  Play a sample Hungry Hippo game.
•  Create a custom version of the game using a sprite of your choice.
•  Make the sprite move using the left, right, up and down arrow keys (use the “point in direction” and “move 10 steps” blocks).
•  Decide which module your student should start in based on their understanding of the controls.
•  Program the sprite to collect objects and increase its score each time it collects one.
•  Create variables for “score” and a timer; increase the score when objects are collected and decrease time as the game runs.
•  Once the game is finished, make sure the student records a Recording Studio Video explaining how their game works and shares their project.`
					}
				],
				supplementalProjects: []
			},
			{
				title: "GS2 Event Listeners",
				curriculum: [
					{
						title: "Basic event listeners",
						content: `Introduce the concept of event listeners (blocks that wait for something to happen). Show the “when green flag clicked” and “when arrow key pressed” events. Demonstrate how event listeners start scripts when specific keys are pressed.`
					},
					{
						title: "Project 1 – Spinner",
						projectLink:
							"https://scratch.mit.edu/projects/287920173/",
						solutionLink:
							"https://scratch.mit.edu/projects/287887351/",
						content: `
It’s time to build a fun spinner:

1. When the green flag is clicked, make the arrow point to the right.
2. When the up, left, right or down arrow keys are pressed, point the arrow in the corresponding direction.
3. When the “A” key is pressed, turn the arrow 15 degrees to the left.
4. When the “D” key is pressed, turn the arrow 15 degrees to the right.
5. When the spacebar is pressed, make the arrow point towards the mouse.

**Instructor Note**: Show the solution demo first. Encourage the student to use Motion and Events blocks. Show how to Remix the starter project. Have the student create a Recording Studio Video and share the finished project.`
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

Have the student record a Recording Studio Video and share their project.`
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
5. When the “1” key is pressed, make the dragonfly pop and go to a random position.
6. When the “2” key is pressed, have the dragonfly say something.
7. When the “3” key is pressed, change the background.
Challenge: Add another sprite controlled by the W-A-S-D keys.

Have the student record a Recording Studio Video and share their project.`
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

Have the student create and share a Recording Studio Video.`
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
3. Pressing “1” lowers the pen (start drawing).
4. Pressing “2” lifts the pen (stop drawing).
5. Clicking the pencil changes its pen color.
6. Pressing “3” increases the pen size; pressing “4” decreases the pen size.
7. When the green flag is clicked, erase all drawings, move the pencil back to the middle of the stage facing right and reset the pen size/color.

**Instructor Note**: There’s no need to explain X and Y coordinates in depth—just mention that (0, 0) is the center.
Challenge: Encourage the student to trace shapes on other backdrops.

Have the student record a Recording Studio Video and share their project.`
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
3. Press “1” to draw a square.
4. Press “2” to draw a triangle.
5. Press “3” to draw an arrow shape.
Challenge: Encourage the student to trace shapes on other backdrops.

**Instructor Note**: Encourage using different event listeners to draw different shapes and adding functionality to change pen color and size.

Have the student record a Recording Studio Video and share their project.`
					}
				],
				supplementalProjects: []
			},
			{
				title: "GS4 Loops",
				curriculum: [
					{
						title: "Introduction to loops",
						content: `Explain that loops are used to repeat code blocks. Show the Repeat and Forever blocks. Demonstrate how loops can control a sprite’s movement by repeating “move” and “turn” instructions.`
					},
					{
						title: "Project 1 – Elephant Effects",
						projectLink:
							"https://scratch.mit.edu/projects/291122885/",
						solutionLink:
							"https://scratch.mit.edu/projects/291119943/",
						content: `
1. When the “1” key is pressed, grow the elephant ten times (increase size by 10, ten times).
2. When the “2” key is pressed, shrink the elephant ten times.
3. When the “3” key is pressed, change the elephant’s color effect forever.
4. When the “4” key is pressed, change a different graphic effect forever.
5. When the “5” key is pressed, hide the elephant, wait one second, then show it again (repeat this sequence).
6. When the space bar is pressed, switch the costume, play a sound and then switch back to the original costume, repeating the whole sequence three times.

Have the student record a Recording Studio Video and share their project.`
					},
					{
						title: "Project 2 – Hot Cross Buns",
						projectLink:
							"https://scratch.mit.edu/projects/291117784/",
						solutionLink:
							"https://scratch.mit.edu/projects/291115434/",
						content: `
This project uses the Music extension.  When the green flag is clicked, play the song “Hot Cross Buns” twice:

E D C  E D C  C C C C  D D D D  E D C.

Encourage the student to use loops for repeated sections. They can compose other songs as an extension.

Have the student record a Recording Studio Video and share their project.`
					},
					{
						title: "Project 3 – Drawing Mouse",
						projectLink:
							"https://scratch.mit.edu/projects/289744824/",
						solutionLink:
							"https://scratch.mit.edu/projects/289445069/",
						content: `
1. Add an event listener so that when the green flag is clicked, all drawings are erased.
2. When the “1” key is pressed, make the mouse draw a square using a loop at a random location.
3. When the “2” key is pressed, make the mouse draw a triangle.
4. When the “3” key is pressed, make the mouse draw a circle (explain that a circle can be drawn by repeating many small steps that turn in small increments to total 360 degrees).
Challenge: Encourage advanced students to create other shapes, like an octagon or a star, possibly adding random sizes and colors.

Have the student record a Recording Studio Video and share their project.`
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
						content: `Explain that conditionals let a program make decisions. Discuss real-life examples of conditions. Show the “if … then” block and sensing blocks like “touching mouse pointer”, “key right arrow pressed” and “touching color ___”. Emphasize that conditionals need to be inside a forever loop.`
					},
					{
						title: "Project 1 – Dino’s Colors",
						projectLink:
							"https://scratch.mit.edu/projects/291223299/",
						solutionLink:
							"https://scratch.mit.edu/projects/291220849/",
						content: `
1. Make the dinosaur follow the mouse pointer forever.
2. Use conditionals to make the dinosaur say “I’m in red!” when standing in red; similarly, add conditions for yellow, blue and grey.

**Instructor Note**: If the student asks about checking multiple conditions at once, briefly introduce the “and/or” operators.

Have the student record a Recording Studio Video and share their project.`
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
3. When the ball touches lightning, make the lightning strike the ground and play a thunder sound, then return the lightning to the cloud. (Introduce the “go to [sprite]” block.)
4. When the chick touches the ball, make the chick move 5 steps and chirp.

Have the student record a Recording Studio Video and share their project.`
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

**Instructor Note**: This project encourages independent work.

Have the student record a Recording Studio Video and share their project.`
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
Explain that “if … then … else” allows multiple outcomes. Discuss real-life examples of decisions with two possible results. Introduce the “if … then … else” block and demonstrate how it can be used to choose between two actions.`
					},
					{
						title: "Project 1 – Dino’s Colors II",
						projectLink:
							"https://scratch.mit.edu/projects/293788691/",
						solutionLink:
							"https://scratch.mit.edu/projects/293787944/",
						content: `
1. Create controls for the dinosaur using the arrow keys.
2. When the “b” key is pressed, have the dinosaur say “Move me to blue!” for 2 seconds.
3. After speaking, use an if/then/else to check if the dinosaur is touching blue; if it is, say “Good job!”, otherwise say “This isn’t the right color!”.
4. Repeat the previous step for the “r” (red) and “y” (yellow) keys.
5. Add sounds and costume changes for each color.

Have the student record a Recording Studio Video and share their project.`
					},
					{
						title: "Project 2 – Hungry Dinosaur",
						projectLink:
							"https://scratch.mit.edu/projects/293457751/",
						solutionLink:
							"https://scratch.mit.edu/projects/293291715/",
						content: `
1. When the green flag is clicked, use if/then blocks to control the dinosaur with the arrow keys.
2. When the space bar is pressed, the dinosaur attempts to eat bananas: if it is touching bananas, change the dinosaur’s costume, play a sound or otherwise show the bananas being eaten; if not touching bananas, say “There aren’t any bananas here!”.
3. When the space bar is pressed, if the bananas are touching the dinosaur, wait one second then move the bananas to a random location; otherwise have the bananas say “I’m over here!”.

**Instructor Note**: Encourage the student to extend this project by interacting with another sprite.

Have the student record a Recording Studio Video and share their project.`
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
2. If the baby fish is touching the mom fish, make it say “I found her”; otherwise say “Take me to my mom”.
3. Make the mom fish glide around the screen randomly.`
					}
				]
			},
			{
				title: "GS7 User Input",
				curriculum: [
					{
						title: "Getting user input",
						content: `Explain that event listeners respond to button presses, but sometimes we want to respond to text typed by the user. Introduce the “ask ___ and wait” block and the “answer” variable. Show how to use the equality (=) block to compare the user’s answer to a correct value and how to use < and > blocks to compare numbers.`
					},
					{
						title: "Project 1 – Math Facts",
						projectLink:
							"https://scratch.mit.edu/projects/295332936/",
						solutionLink:
							"https://scratch.mit.edu/projects/294539961/",
						content: `
1. When the “1” key is pressed, have Gobo ask a math question (e.g., “What’s 9 – 7?”). Indicate whether the answer is correct or incorrect via costume, sound or speech.
2. When the “2” key is pressed, have Gobo ask a question like “What’s a number less than 0?” and indicate whether the answer is correct or incorrect.
3. When the “3” key is pressed, have Gobo ask a harder math question and allow the user to keep answering until the answer is correct. If the answer is too low, Gobo should say “Higher!”; if too high, say “Lower!”.

**Instructor Note**: Emphasize asking forever until the correct answer is given and mention nested conditionals (putting one conditional inside another).`
					},
					{
						title: "Project 2 – Fortune Teller",
						projectLink:
							"https://scratch.mit.edu/projects/295333590/",
						solutionLink:
							"https://scratch.mit.edu/projects/294540150/",
						content: `
1. When the green flag is clicked, play an introduction and ask the user their name.
2. Ask the user “What do you want to know? (Type Love, Money, or Friendship)”.
3. Use conditionals to give a fortune based on the user’s input.
4. Ask another question such as “Choose a number between 1 and 5” and use conditionals to provide a response.
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
1. Ask the user for their name and call them “Captain”.
2. Ask which planet (Mars, Jupiter or Saturn) they want to explore.
3. Use conditionals to set the scene for the chosen planet.
4. Ask additional questions (e.g., “Do you want to collect rocks or search for life?”) and branch the story based on the answers.
5. Use variables to track discoveries or points.`
					}
				]
			},
			{
				title: "GS8 X & Y Coordinates",
				curriculum: [
					{
						title: "Introduction to X & Y coordinates",
						content: `Explain the coordinate plane in Scratch. The X-axis goes left and right; the Y-axis goes up and down. Show how to use “go to x: ___ y: ___” and “glide ___ secs to x: ___ y: ___” blocks. Discuss how sprites can be positioned at specific coordinates.`
					},
					{
						title: "Project 1 – Bug Eater",
						projectLink:
							"https://scratch.mit.edu/projects/302997680/",
						solutionLink:
							"https://scratch.mit.edu/projects/302865707/",
						content: `
1. When the green flag is clicked, make the praying mantis appear at a random position.
2. When the mouse is clicked, make the mantis glide to the mouse pointer’s X and Y position.
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
2. When the sprite reaches a quadrant, display a message such as “I’m in Quadrant I”.
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
3. Encourage students to draw their initials or simple pictures.`
					}
				]
			},
			{
				title: "GS9 Variables",
				curriculum: [
					{
						title: "Introducing variables",
						content: `Explain that variables store information such as scores, timers or other values. Show how to make a variable in Scratch and demonstrate the “set [variable] to” and “change [variable] by” blocks. Use a loop for the cat to count from 1 to 10. Ask the student how to count backwards. Discuss customizing variables.`
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
5. Encourage the student to add a high-score variable.`
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
2. Make a variable called “steps” that increases each time the sprite moves.
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
2. Create a variable called “food” and increase it each time the crab eats a piece of food.
3. Add a timer; when time runs out, end the game and display how much food was collected.`
					},
					{
						title: "GS9 Supplemental Project 3 – Lunch Money",
						projectLink:
							"https://scratch.mit.edu/projects/330294909/",
						solutionLink:
							"https://scratch.mit.edu/projects/330291357/",
						content: `
1. Start with a variable “money” set to 10.
2. Ask the user what they want to buy for lunch (e.g., pizza, sandwich or salad) and subtract the cost from the money variable.
3. If the user can’t afford an item, display a message.
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

Open a new Scratch project. Have your student click on the Events section and look at the broadcast __ and when I receive __ blocks. Explain that broadcasting is a way that sprites can send each other messages to trigger or start certain parts of our code.

Using this project as a rough guide, show the student how to make the ball start bouncing only after the cat is done talking.`
					},
					{
						title: "GS10 Project 1 – Dance Off",
						projectLink:
							"https://scratch.mit.edu/projects/301002220/",
						solutionLink:
							"https://scratch.mit.edu/projects/300644693/",
						content: `
It’s dancing time! Let’s give each sprite a turn to “perform” on the stage.

1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she’s done, have her glide off to the right side of the stage.
2. One by one, make each of the other dancers do the same thing. Can you add some clapping between each performer? We also need to be sure to make them start back on the left when the green flag is clicked!
3. A dance party isn’t very fun without music! Add some code to the backdrop so that it plays dancing music forever. When Champ is done dancing, broadcast a message that stops the music.
4. Can you make it so that the lights change, too? How about some clapping once everyone is done?

Have the student record a Recording Studio Video and share the project.`
					},
					{
						title: "GS10 Project 2 – Bowl Fill",
						projectLink:
							"https://scratch.mit.edu/projects/303008513/",
						solutionLink:
							"https://scratch.mit.edu/projects/302811491/",
						content: `
Let’s make a game where you control a bowl and try to collect various items!

1. Start by programming the bowl so that it can be controlled by the arrow keys once the green flag is clicked.
2. When a sprite is touched by the bowl, make it broadcast a message (like “Cheese touched”, for example).
3. Think about what each sprite should do when it receives these messages. Should they move? Make a sound? What should the bowl do?
4. Add variables to your program that keep track of the number of times each object has been collected.
5. Add a timer that stops the game after 15 seconds. When the timer runs out, broadcast a message that makes all sprites on the screen do something (e.g., spin in a circle, grow and shrink, etc.).

**Instructor Note**: As an extension, the student can turn Bowl Fill into a two-player game (e.g., a second bowl controlled with W-A-S-D).

When your student finishes their project, have them make a Recording Studio Video explaining what the project does and how they programmed it. Finally, have them share their project!`
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
**Instructor Note**: This project allows for a lot of creativity – keep your student on track by deciding on a premise or short scene for the play, and cast relevant characters that already exist in Scratch or can be drawn quickly. Make sure they can map out the sequence of events (they can even write it in a comment block) before implementing their code!

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
Let’s put our skills to the test! Let’s use what we’ve learned in the course to build this Hedgehog Race game.

Have your student play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

Starter code is provided, but the student is also welcome to create a project from scratch with custom sprites, costumes and backdrops.

**Instructor Note**: The solution provided uses the wait until __ block. Other solutions not using that block may exist, but it shouldn’t be too difficult for the student to pick out this block and incorporate it appropriately.

**Instructor Note**: Ideas for extensions for this game include: adding another button that stops the whole game, adding a timer that shows how long it takes to reach the end and making the hedgehogs customizable by clicking on them to change their color.

When your student finishes their project, have them make a Recording Studio Video where they explain what the project does and how they programmed it. Finally, have them share their project!`
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
Have your student play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

**Instructor Note**: If needed, the steps that we have written are available in the Scratch Cat sprite of the starter project and included below for reference. However, it is important that the student practice breaking down larger projects into specific steps.

The wizard has been turned into a frog! Help him collect potions while avoiding skeletons to turn back into a wizard.

1. Let’s start by working on our frog wizard! Make it so when the green flag is clicked, he goes to the center of the screen, changes his size and moves when the arrow keys are pressed.
2. Next, let’s make the skeleton move! We want the skeleton to go to a random position on the far right side of the screen and constantly move left. When it is touching the frog or the left edge, make it go back to the right side.
3. Now do the same thing to the potion. If you want to make the game more challenging, make the potion wait a few seconds before appearing on the right again. (Hint: you’ll need to use show/hide blocks).
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
Have your student play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

Starter code is provided, but the student is also welcome to create a project from scratch with custom sprites, costumes and backdrops.

When your student finishes their project, have them make a Recording Studio Video where they explain what the project does and how they programmed it. Finally, have them share their project!`
					}
				],
				supplementalProjects: []
			},
			{
				title: "GS13 Master Project",
				curriculum: [
					{
						title: "GS13 Project 1 – Master Project",
						content: `**Instructor Note**: As you’re starting this module, begin thinking about the next course for the student. Juni courses are continuous, meaning you should proceed directly into the next course after the current one is completed. Typically, the student should progress with you into Scratch Level 2, but some students may be ready for Python Level 1 after completing Scratch 1. We typically recommend Scratch Level 2 for students who are interested in building more complex Scratch projects, enjoy custom graphics or don’t yet have the keyboarding skills needed for typing code. If your student is interested in learning text-based programming and has proficient typing skills, they might be ready for Python Level 1!  We look to the instructor to discuss with the student and parent to make a recommendation. When you are ready to move your student into the next course, navigate to your student’s profile, click the edit icon next to their current course and follow the instructions in the modal. If you run into any issues updating the course or have questions about student readiness, reach out to @HQ Support on Slack.

For your Master Project, you now have the skills and knowledge to design and build a game of your own! Spend some time brainstorming what kind of game the student would like to make, thinking about the past projects we have created and different elements we’d like to incorporate.

**Instructor Note**: In general, the Master Project should span the course of approximately two weeks, with the student making significant progress on the project for homework each week. Please keep this in mind when scoping the project with the student. If the student wishes to continue working on additional features after this timeframe, they are welcome to continue asking you questions during the 5-10 minutes at the end of each class while you move on to the next course. If you feel there are special circumstances where this two-week timeframe should not apply (e.g., a parent requests a more complex project), please speak with Juni HQ.

Once the student has an idea, discuss the plan for programming the game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?`
					},
					{
						title: "Master Project Presentation",
						content: `Once the project is complete, the student should use the Recording Studio to record a presentation about how they programmed their project! Make sure the student knows how to click “I’ve completed this project and want to add it to my portfolio,” follow the steps listed and then use the Record button at the bottom right corner of the project. They should try to touch on all of the concepts from this course they used to build their game. Optionally, they can also bring a family member to class to present their project.

Encourage your student to publish their project using their Learner Portal (click the Share button at the bottom right corner of the project) and share the link with their friends and family! You can also nominate the project for Juni Project of the Month.

Another way the student can celebrate their project is by hosting a Juni Party! The student can invite their friends to a special Juni Party, where they show off their Master Project and code with their friends. Ask your student if this is something they would be interested in, and add the link https://start.junilearning.com/juniparty to your session notes so students and parents can learn more about this free offering to Juni students!`
					},
					{
						title: "Course recap",
						content: `We’ve learned a lot over these past few months! Can you recap the different topics we learned in this course?

Help the student come up with a list of coding concepts they’ve learned through Scratch. It might be helpful to look back at the module titles or code from previous projects they’ve created.

If the student hasn’t thought of them, make sure they include conditionals, XY coordinates, variables, event listeners and loops in their list.

Discuss with the student their next course: Scratch Level 2 or Python Level 1. If your student is taking Scratch Level 2 as their next course, proceed directly into Scratch Level 2 by following the instructions in the Instructor Note at the top of this page. If your student is taking Python Level 1, proceed with the Optional Extra Practice activity below.`
					},
					{
						title: "Optional Extra Practice – Typing Games",
						content: `This optional section is for students transitioning from Scratch Level 1 into Python Level 1.

The purpose of this section is to prepare students to transition from block-based to text-based coding and to assess their typing and computer literacy skills. If your student is advanced, has strong typing skills or is not taking a text-based programming language as their next course, you may skip this activity at your discretion. These typing games are optional and students don’t need to play all of them. Encourage your student to choose games that are interesting to them and move on once the student has practiced for 15-20 minutes or if the student is already a strong typist. Feel free to skip to the intermediate typing games if your student is older than 6.

One of the biggest differences between Python and Scratch is that we’ll need to type our code out rather than using blocks. Let’s play a few games to practice typing as we prepare ourselves to write Python code.

Beginner Typing Games:
•  Practice with the Keyboard – Typing Letters: https://scratch.mit.edu/projects/214833806/
•  Practice with the Keyboard – Typing Numbers: https://scratch.mit.edu/projects/214828609/
•  Practice with the Keyboard – Typing Letters Race: https://www.nitrotype.com/

Intermediate Typing Games:
•  Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game
•  Ghost Typing: https://www.abcya.com/games/ghost_typing
•  Koala Paddleboards (spelling and typing practice): https://www.abcya.com/games/spelling_practice

Advanced Typing Games:
•  Typing Rocket: https://www.abcya.com/games/typing_rocket
•  Type Racer: https://replit.com/@JuniLearning/PS12-Type-Racer?v=1

Assuming you have followed the Instructor Note at the beginning of this module, feel free to proceed directly into Python 1 after this activity.

**Instructor Note**: If your student is still developing their typing skills, it can be helpful to start their Python classes with a warmup of five minutes working on these typing games.`
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
				title: "GM1 Review: Events, Loops, Conditionals, & Broadcasting",
				curriculum: [
					{
						title: "Review overview",
						content: `**Instructor Note**: This module is for students who started directly in Scratch Level 2. Students who completed Scratch Level 1 should skip this module. Use these review projects as extra practice or homework if needed.`
					},
					{
						title: "Event listeners",
						content: `Event listeners make a sprite wait until something happens, then respond. For example, we used event listeners in our Hungry Hippo game. Event listeners include the when green flag clicked and when arrow key pressed blocks.`
					},
					{
						title: "Dragonfly Events",
						content: `3. When the dragonfly is clicked, make it change its color.
4. When the space bar is pressed, make the dragonfly make a popping sound.
5. When 1 is pressed, make the dragonfly “pop” and then go to a random position.
6. When 2 is pressed, make the dragonfly say something (for example, “Buzzzz”).
7. When 3 is pressed, make the background change.
Challenge: Can you add another sprite that moves around using the W-A-S-D keys?`
					},
					{
						title: "Loops",
						content: `Where have you heard the word “loop” before? In programming, a loop allows you to repeat code blocks. Loops are helpful because they reduce the amount of code and can do tasks that would be impossible to code step by step. Open a new Scratch project and look at the repeat and forever blocks in the Control section. Try using a loop to repeat “move __ steps” and “turn __ degrees” blocks.`
					},
					{
						title: "GM1 Project 3: Math Facts",
						projectLink:
							"https://scratch.mit.edu/projects/295332936/",
						solutionLink:
							"https://scratch.mit.edu/projects/295539961/",
						content: `
1. When 1 is pressed, have Gobo ask a question like “What’s 3 − 7?” After the user answers, Gobo should change its costume, make a sound and/or say something to indicate whether the answer is correct or incorrect.
2. When 2 is pressed, have Gobo ask a question like “What’s a number less than 0?” Based on the answer, Gobo should change his costume, make a sound and/or say something to indicate whether the answer is correct or incorrect.
3. When 3 is pressed, have Gobo ask a harder math question that allows the user to keep answering until the answer is correct. Gobo should indicate each time whether the answer is correct or incorrect. **Instructor Note**: Emphasize the need to ask forever until the user answers correctly. The conditional logic must be inside a loop (a nested conditional).`
					}
				],
				supplementalProjects: []
			},
			{
				title: "GM2 Nested Loops",
				curriculum: [
					{
						title: "Nested loops",
						content: `Introduce the idea of nested loops—placing one loop inside another. Discuss why nested loops are useful: they can save time and make code more concise. Use examples such as drawing multiple shapes or patterns.`
					},
					{
						title: "GM2 Project 1: Square Inception",
						projectLink:
							"https://scratch.mit.edu/projects/304012026/",
						solutionLink:
							"https://scratch.mit.edu/projects/303954115/",
						content: `
1. Open the Jackson Pollock project from Scratch Level 1 and click “See Inside”.
2. Add another repeat loop around the existing loop to draw a series of squares inside each other.
3. Use the Pen extension to set the color and size of each square.
4. Experiment with different numbers of repeats and side lengths.
**Instructor Note**: Show the demo first to illustrate what nested loops do. Encourage students to experiment with different color and size values.`
					},
					{
						title: "GM2 Project 2: Pyramid",
						projectLink:
							"https://scratch.mit.edu/projects/304012956/",
						solutionLink:
							"https://scratch.mit.edu/projects/303955461/",
						content: `
1. Use nested loops and the Pen extension to draw a series of triangles that increase in size to form a pyramid shape.
2. Encourage the student to adjust the angle and length parameters to perfect their pyramid.
3. Show how changing the repeat counts affects the number of triangles.
**Instructor Note**: Use variables to control the size of each triangle. This project helps students practice controlling loops within loops.`
					}
				],
				supplementalProjects: [
					{
						title: "GM2 Supplemental Project 1: Playing Baseball",
						projectLink:
							"https://scratch.mit.edu/projects/330302948/",
						solutionLink:
							"https://scratch.mit.edu/projects/328314692/",
						content: `
1. Program a pitcher sprite to pitch the ball when the green flag is clicked.
2. Program a batter sprite to swing the bat when the ball gets close.
3. Use a broadcast message (e.g., “Batter up!”) to start the game.
4. Keep score and award a point if the ball is hit.
5. Challenge: Add fielders that move to catch the ball.`
					},
					{
						title: "GM2 Supplemental Project 2: Grid",
						projectLink:
							"https://scratch.mit.edu/projects/330303721/",
						solutionLink:
							"https://scratch.mit.edu/projects/328315826/",
						content: `
1. Use nested loops to draw a grid of squares on the stage.
2. Ask the user for the number of rows and columns and draw the corresponding grid.
3. Challenge: Color the squares randomly or create a checkerboard pattern.`
					},
					{
						title: "GM2 Supplemental Project 3: Rainbow Flower",
						projectLink:
							"https://scratch.mit.edu/projects/330304501/",
						solutionLink:
							"https://scratch.mit.edu/projects/328316339/",
						content: `
1. Use a repeat loop to create a spiral pattern.
2. Within that loop, create a second loop that changes the pen color and draws petals.
3. Adjust the angle and length to make the flower look like a rainbow spiral.`
					}
				]
			},
			{
				title: "GM3 Complex Conditionals",
				curriculum: [
					{
						title: "Complex conditionals",
						content: `Review conditional statements and introduce AND, OR and NOT blocks for more complex conditions. Use a guide project to demonstrate how multiple conditions can be combined.`
					},
					{
						title: "GM3 Project 1: Color Spotter",
						projectLink:
							"https://scratch.mit.edu/projects/304013663/",
						solutionLink:
							"https://scratch.mit.edu/projects/303956811/",
						content: `
1. Program the cat sprite to move around the stage using the arrow keys.
2. When the cat touches the red color, have it say something like “Red!”.
3. When the cat touches blue, have it say “Blue!”.
4. When the cat touches yellow, have it say “Yellow!”.
5. If the cat touches no color, have it say “No color here!”.
6. Use AND, OR and NOT blocks to handle cases where the cat touches more than one color at the same time.
**Instructor Note**: Discuss ordering of conditions. If more than one condition is true, decide which message should appear first.`
					},
					{
						title: "GM3 Project 2: Strength Tester",
						projectLink:
							"https://scratch.mit.edu/projects/304014220/",
						solutionLink:
							"https://scratch.mit.edu/projects/303957902/",
						content: `
1. Use a broadcast message to start the strength tester.
2. When the broadcast is received, generate a random number and use that number to set the height of an arrow.
3. If the arrow height is below 3, display a weak message.
4. If the arrow height is between 3 and 6, display a medium-strength message.
5. If the arrow height is above 6, display a strong message.
6. Challenge: Ask the user to type a number to set the arrow height and compare it to the random number.
**Instructor Note**: Talk about nested conditionals and using random numbers for unpredictability.`
					}
				],
				supplementalProjects: [
					{
						title: "GM3 Supplemental Project 1: Baby Chick",
						projectLink:
							"https://scratch.mit.edu/projects/330305574/",
						solutionLink:
							"https://scratch.mit.edu/projects/328318062/",
						content: `
1. Move the baby chick with the arrow keys.
2. Make the rooster and hen move back and forth across the stage.
3. When the chick touches the rooster, display “Hi Dad!”; when it touches the hen, display “Hi Mom!”.
4. If it touches neither parent, display “Where are my parents?”.
5. Challenge: Add an egg that the chick must protect.`
					},
					{
						title: "GM3 Supplemental Project 2: Save the Butterfly",
						projectLink:
							"https://scratch.mit.edu/projects/330306402/",
						solutionLink:
							"https://scratch.mit.edu/projects/328318577/",
						content: `
1. When the green flag is clicked, broadcast a message to start the game.
2. Program the frog to move randomly around the stage.
3. Program the butterfly to fly away by alternating between the left and right arrow keys.
4. Use complex conditionals to check if the correct key is being pressed; if not, the butterfly should slow down.
5. If the butterfly touches the frog, the player loses; if it reaches a tree, the player wins.
6. Challenge: Add multiple levels with increasing difficulty.`
					}
				]
			},
			{
				title: "GM4 Cloning",
				curriculum: [
					{
						title: "Cloning",
						content: `Explain how to duplicate sprites using the create clone of myself, when I start as a clone and delete this clone blocks. Discuss why the parent sprite should be hidden and how clones can be programmed to act independently.`
					},
					{
						title: "GM4 Project 1: Jackson Pollock Clones",
						projectLink:
							"https://scratch.mit.edu/projects/304043508/",
						solutionLink:
							"https://scratch.mit.edu/projects/303958509/",
						content: `
1. Use a pencil sprite as the parent.
2. Have the parent create clones continuously.
3. Each clone should go to a random location, choose a random size and pen color, and glide to a random position while drawing.
4. Experiment with pen colors and sizes.
**Instructor Note**: Use the Pen block that sets the color with a number. Challenge advanced students to vary angles, colors and widths.

Encourage the student to record a video and share the project.`
					},
					{
						title: "GM4 Project 2: Rainy Day",
						projectLink:
							"https://scratch.mit.edu/projects/304044182/",
						solutionLink:
							"https://scratch.mit.edu/projects/303959602/",
						content: `
1. Program an umbrella controlled by the arrow keys.
2. Program a chick to move around and bounce off the edges.
3. Use a rain sprite that continuously creates clones falling from the sky.
4. When a raindrop clone touches the chick, broadcast a message to show the chick getting wet.
5. Keep track of how many times the chick gets wet within 60 seconds.
6. **Instructor Note**: Encourage the student to add a timer and different difficulty levels. Have them record a Recording Studio Video and share the project.`
					}
				],
				supplementalProjects: [
					{
						title: "GM4 Supplemental Project 1: Fruity Fest",
						projectLink:
							"https://scratch.mit.edu/projects/330307274/",
						solutionLink:
							"https://scratch.mit.edu/projects/328320105/",
						content: `
1. Move the parrot using the arrow keys.
2. Create clones of fruit every second that appear at random positions.
3. Keep track of how many pieces of fruit are collected. When 10 fruits have been collected, display a victory message.
4. Encourage the student to add different types of fruit and a timer.`
					}
				]
			},
			{
				title: "GM5 Strings",
				curriculum: [
					{
						title: "Strings",
						content: `Explain that strings are words or letters stored in variables. Show how to use the join, letter of and length blocks. Emphasize that spaces count as characters.`
					},
					{
						title: "GM5 Project 1: Security Bot",
						projectLink:
							"https://scratch.mit.edu/projects/304048236/",
						solutionLink:
							"https://scratch.mit.edu/projects/303961395/",
						content: `
1. Ask the user for their name and respond with a greeting.
2. Ask the user to type a word that starts with the letter “q”; check if the first letter is q and respond accordingly.
3. Ask the user to type a seven-letter word; check the length and respond accordingly.
4. Ask the user to type a word ending in “y”; check the last letter and respond accordingly.

Encourage the student to record and share the project.`
					},
					{
						title: "GM5 Project 2: Spelling Bee",
						projectLink:
							"https://scratch.mit.edu/projects/304048878/",
						solutionLink:
							"https://scratch.mit.edu/projects/303962521/",
						content: `
1. When the key 1 is pressed, ask the user to type a word and then spell all of its letters.
2. When 2 is pressed, ask for a word and spell all but the first letter.
3. When 3 is pressed, ask for a word and spell all but the last letter.
4. When 4 is pressed, ask for a word and spell all but the first and last letters.
5. When 5 is pressed, ask for a word and spell every other letter.
6. When 6 is pressed, ask for a word and spell it backwards.

Encourage the student to record and share the project.`
					}
				],
				supplementalProjects: [
					{
						title: "GM5 Supplemental Project 1: Crazy Country",
						projectLink:
							"https://scratch.mit.edu/projects/330309012/",
						solutionLink:
							"https://scratch.mit.edu/projects/328322024/",
						content: `
1. Ask the user for the name of a country, its leader and what the country is known for.
2. Use the say and join blocks to make the program respond with a silly sentence that combines those answers.
3. Challenge: Use one say block with multiple join blocks to create the sentence.`
					},
					{
						title: "GM5 Supplemental Project 2: Beary Spelly",
						projectLink:
							"https://scratch.mit.edu/projects/330309721/",
						solutionLink:
							"https://scratch.mit.edu/projects/328322577/",
						content: `
1. Store a secret word using a variable or list.
2. Use text-to-speech to say the word.
3. Ask the user to type the letters of the word one by one.
4. If the user spells it correctly, congratulate them; otherwise, end the game.
5. Encourage the student to add a time limit or score.`
					}
				]
			},
			{
				title: "GM6 Mathematical Operators",
				curriculum: [
					{
						title: "Mathematical operators",
						content: `Introduce arithmetic operations in Scratch: addition, subtraction, multiplication, division and modulo. Show how to use the Operators blocks to perform calculations.`
					},
					{
						title: "GM6 Project 1: Calculator",
						projectLink:
							"https://scratch.mit.edu/projects/304052069/",
						solutionLink:
							"https://scratch.mit.edu/projects/303963892/",
						content: `
1. Ask the user for two numbers and which operation to perform (add, subtract, multiply or divide).
2. Use conditionals to perform the correct operation and display the result.
3. Challenge: Add remainder and exponent operations.
**Instructor Note**: Encourage the student to add more operations and test different inputs.`
					},
					{
						title: "GM6 Project 2: FizzBuzz",
						projectLink:
							"https://scratch.mit.edu/projects/304052734/",
						solutionLink:
							"https://scratch.mit.edu/projects/303964901/",
						content: `
1. Have a butterfly count from 1 to 50.
2. For multiples of 3, the butterfly says “Fizz”.
3. For multiples of 5, the butterfly says “Buzz”.
4. For multiples of both 3 and 5, the butterfly says “Fizzbuzz”.
5. Otherwise, the butterfly says the number.
**Instructor Note**: Ask the student to create variations of FizzBuzz (e.g., multiples of 2 and 7).`
					}
				],
				supplementalProjects: [
					{
						title: "GM6 Supplemental Project 1: Times Tables",
						projectLink:
							"https://scratch.mit.edu/projects/330310535/",
						solutionLink:
							"https://scratch.mit.edu/projects/328323094/",
						content: `
1. Ask the user what number they want to practice multiples of.
2. Set a variable (e.g., “multiplier”) to 1.
3. Use a repeat loop to display the product of the number and the multiplier.
4. Increase the multiplier each time and repeat until a desired number of multiples is reached.
5. Challenge: Ask the user how many multiples they want to recite.`
					},
					{
						title: "GM6 Supplemental Project 2: Stamping with Dotty",
						projectLink:
							"https://scratch.mit.edu/projects/330311348/",
						solutionLink:
							"https://scratch.mit.edu/projects/328323614/",
						content: `
1. Ask the user for an x-coordinate.
2. Set y to the absolute value of x.
3. Stamp the sprite at the (x, y) position.
4. Repeat this process 10 times with different x values to create a graph of the absolute-value function.
5. Challenge: Allow the user to specify how many points to graph.`
					}
				]
			},
			{
				title: "GM7 Lists",
				curriculum: [
					{
						title: "Lists",
						content: `Explain that lists can store multiple items in one variable. Show how to create a list, add items, get the length of a list and delete items.`
					},
					{
						title: "GM7 Project 1: Bucket List",
						projectLink:
							"https://scratch.mit.edu/projects/304055981/",
						solutionLink:
							"https://scratch.mit.edu/projects/303967022/",
						content: `
1. Ask the user for five things they want to do in their lifetime.
2. Store each answer in a list called “bucket list”.
3. After all items are entered, repeat through the list and display each item.
**Instructor Note**: Use loops to iterate through the list.`
					},
					{
						title: "GM7 Project 2: List Practice",
						projectLink:
							"https://scratch.mit.edu/projects/304056597/",
						solutionLink:
							"https://scratch.mit.edu/projects/303968062/",
						content: `
1. When the spacebar is pressed, ask the user for a number and add it to a list.
2. When the green flag is clicked, reset the list.
3. When the key 1 is pressed, display all numbers in the list.
4. When 2 is pressed, display each number multiplied by 2.
5. When 3 is pressed, display the numbers in reverse order.
6. When 4 is pressed, display each number with “even” or “odd” next to it.
**Instructor Note**: Encourage the student to think of additional list manipulations.`
					},
					{
						title: "GM7 Project 3: Music Memory",
						projectLink:
							"https://scratch.mit.edu/projects/304057210/",
						solutionLink:
							"https://scratch.mit.edu/projects/303969274/",
						content: `
1. Create two lists: one for the correct sequence of notes and one for the player’s guesses.
2. When the green flag is clicked, play a sequence of notes (e.g., C-E-G).
3. Ask the user to repeat the sequence.
4. Compare the player’s guesses to the correct sequence.
5. If they match, add another note to the sequence and repeat.
6. If they do not match, end the game and display the correct sequence.
**Instructor Note**: You can extend the game by providing hints or showing the correct notes when the player makes a mistake.`
					}
				],
				supplementalProjects: [
					{
						title: "GM7 Supplemental Project 1: Multiple Magic",
						projectLink:
							"https://scratch.mit.edu/projects/330312164/",
						solutionLink:
							"https://scratch.mit.edu/projects/328324158/",
						content: `
1. Choose a random number between 1 and 10.
2. Ask the user to enter multiples of that number.
3. Store the entered multiples in a list.
4. Increase a score each time a correct multiple is entered.
5. End the game if the user enters an incorrect multiple or runs out of time.
6. Challenge: Add a timer to see how many correct multiples the player can enter in a certain amount of time.`
					},
					{
						title: "GM7 Supplemental Project 2: Wheel of Fortune",
						projectLink:
							"https://scratch.mit.edu/projects/330312909/",
						solutionLink:
							"https://scratch.mit.edu/projects/328324694/",
						content: `
1. Create a list of words (your word bank).
2. Choose a random word from the list.
3. Create a second list that contains all the unique letters of the chosen word.
4. Ask the user to guess letters.
5. If the guessed letter is in the word, reveal it; otherwise, decrease the number of guesses remaining.
6. The user wins if they guess all the letters before running out of guesses.
7. Challenge: Allow the user to choose the number of guesses or difficulty level.`
					}
				]
			},
			{
				title: "GM8 Functions",
				curriculum: [
					{
						title: "Functions",
						content: `Introduce custom blocks (functions) in Scratch. Explain that functions let us group code together and reuse it. Show how to add inputs to functions to make them more flexible.`
					},
					{
						title: "GM8 Project 1: My First Functions",
						projectLink:
							"https://scratch.mit.edu/projects/304059607/",
						solutionLink:
							"https://scratch.mit.edu/projects/303970399/",
						content: `
Define four functions:
1. A function that makes the cat say a message a given number of times.
2. A function that draws a square with a given side length.
3. A function that makes the cat jump to a given height.
4. A function that makes the cat teleport by spinning and going to a random position.

Use inputs for each function and then call the functions from the main script.`
					},
					{
						title: "GM8 Project 2: Talent Show II",
						projectLink:
							"https://scratch.mit.edu/projects/304060264/",
						solutionLink:
							"https://scratch.mit.edu/projects/303971615/",
						content: `
1. Decide on several “talents” for a sprite to perform (such as playing a song, dancing or spinning).
2. Create a custom block (function) for each talent.
3. When the program starts, ask the user which talent they would like to see.
4. Ask for any necessary inputs (such as number of notes or number of spins).
5. Call the appropriate function with the given inputs.
**Instructor Note**: Brainstorm additional functions with the student and encourage creativity.`
					}
				],
				supplementalProjects: [
					{
						title: "GM8 Supplemental Project 1: Extra Functions",
						projectLink:
							"https://scratch.mit.edu/projects/330313635/",
						solutionLink:
							"https://scratch.mit.edu/projects/328325212/",
						content: `
Write the following functions:
1. A function that draws a shape when given the number of sides and the size of each side.
2. A function that counts from a starting number to an ending number (it should count down if the ending number is smaller).
3. A function that performs addition, subtraction, multiplication and division of two numbers and optionally calculates their average.
4. A function that says the first 10 multiples of a number (or a user-specified number of multiples).`
					},
					{
						title: "GM8 Supplemental Project 2: Rock Paper Scissors",
						projectLink:
							"https://scratch.mit.edu/projects/330314302/",
						solutionLink:
							"https://scratch.mit.edu/projects/328325745/",
						content: `
1. Create a function called get computer answer that returns a random choice from a list of rock, paper and scissors.
2. Create a function called get player answer that repeatedly asks the player for a valid answer until they type rock, paper or scissors.
3. Create a function called find winner that compares the player’s answer to the computer’s answer and calls one of three functions: player wins, computer wins or tie.
4. Use lists and functions to organise the code.`
					}
				]
			},
			{
				title: "GM9 Fish Food",
				curriculum: [
					{
						title: "GM9 Project 1: Fish Food",
						projectLink:
							"https://scratch.mit.edu/projects/304062617/",
						solutionLink:
							"https://scratch.mit.edu/projects/303972772/",
						content: `
Have your student play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

Starter code is provided, but the student is also welcome to create a project from scratch with custom sprites, costumes and backdrops.

A tricky part of this project is that the size block only changes the size of the sprite that uses it. We want the size of all the fish to change over time! We’ll need to keep track of each fish’s size using a variable. Alternatively, you can access another sprite’s size through the sensing block [size of] of [sprite] and save the size there.

The final sizes: 20–40 (Guppy), 40–80 (Goldfish), 80–120 (Flounder), 120–160 (Barracuda), 160–200 (Bluefin Tuna), >200 (Blue Whale).

When your student finishes their project, have them make a Recording Studio Video explaining what the project does and how they programmed it. Finally, have them share their project!`
					}
				],
				supplementalProjects: []
			},
			{
				title: "GM10 Treasure Cave",
				curriculum: [
					{
						title: "GM10 Project 1: Treasure Cave",
						projectLink:
							"https://scratch.mit.edu/projects/304063312/",
						solutionLink:
							"https://scratch.mit.edu/projects/303973845/",
						content: `
Have your student play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

Starter code is provided, but the student is also welcome to create a project from scratch with custom sprites, costumes and backdrops.

A tricky part of this project is the treasure chest motion: it appears randomly on either the left or right side of the cave and moves toward the elf while the elf stays in the center. We recommend using lists and custom functions to organise the code. A background animation script is provided in the starter.

When your student finishes their project, have them make a Recording Studio Video explaining what the project does and how they programmed it. Finally, have them share their project!`
					}
				],
				supplementalProjects: []
			},
			{
				title: "GM11 Master Project",
				curriculum: [
					{
						title: "GM11 Project 1: Master Project",
						content: `For your Master Project, you now have the skills and knowledge to design and build a game of your own! Spend some time brainstorming what kind of game the student would like to make, thinking about the past projects we have created and different elements we'd like to incorporate. Make sure the student incorporates lists and functions into their project.

**Instructor Note**: In general, the Master Project should span the course of approximately two weeks, with the student making significant progress on the progress for homework each week. Please keep this in mind when scoping the project with the student. If the student wishes to continue working on additional features after this timeframe, they are welcome to continue asking you questions during the 5-10 minutes at the end of each class, while you move onto the next course. If you feel there are special circumstances where this two-week timeframe should not apply (e.g. parent is requesting student to work on a more complex project), please speak with Juni HQ.

Once the student has an idea, discuss the plan for programming the game. Again, helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a new Scratch project and add a comment to write out the different steps of what we will need to code.

Have the student program their game as independently as possible! As described above, this may take approximately two classes to complete.`
					},
					{
						title: "Master Project presentation",
						content: `Once it's complete, the student should use the Recording Studio to record a presentation about how they programmed their project! (Make sure the student knows how click "I've completed this project and want to add it to my portfolio," follow the steps listed, and then how to use the Record button at the bottom right corner of the project.) They should try to touch on all of the concepts from this course they used to build their game. Optionally, in addition, they can also bring a family member to class to present their project.

Encourage your student to publish their project using their Learner Portal (click the Share button at the bottom right corner of the project), and share the link with their friends and family! If you'd like, you can also nominate the project for Juni Project of the Month!

Another way the student can celebrate their project is by hosting a Juni Party! The student can invite their friends to a special Juni Party, where they show off their Master Project and code with their friends. Ask your student if this is something they would be interested in, and add the link https://start.junilearning.com/juniparty to your session notes so students and parents can learn more about this free offering to Juni students!`
					},
					{
						title: "Course recap",
						content: `We've learned a lot over these past few months! Can you recap the different topics we learned in this course?

Help the student come up with a list of coding concepts they’ve learned through Scratch. It might be helpful to look back at the module titles or code from previous projects they’ve created.

If the student hasn’t thought of them, make sure they include conditionals, XY coordinates, variables, event listeners, loops, and functions in their list.

Great job! Many of these concepts that we’ve learned in Scratch we are going to use in Python as well. Let's take a closer look at our next course.

Discuss with the student their next course: Python Level 1. In Python Level 1, we will learn our first programming language that requires us to fully type out our code instead of using blocks! However, we are going to use a lot of the same concepts we've already become comfortable with in Scratch.`
					},
					{
						title: "Optional Extra Practice: Typing Games",
						content: `This is an optional section for students transitioning from Scratch into Python Level 1.

The purpose of this section is to prepare students to transition from block based to text based coding and to assess their typing and computer literacy skills.

If your student is advanced, has strong typing skills, or is not taking a text based programming language as their next course, you may skip this activity at your discretion.

These typing games are optional and students don’t need to play all of them. Encourage your student to choose games that are interesting to them and move on once the student has practiced for 15-20 minutes, or if the student is already a strong typist.

Feel free to skip to the intermediate typing games if your student is older than 6.

One of the biggest differences between Python and Scratch is that we’ll need to type our code out rather than using blocks. Let’s play a few games to practice typing as we prepare ourselves to write Python code.

Beginner Typing Games:
- Practice with the Keyboard - Typing Letters: https://scratch.mit.edu/projects/214833806/ — Try to reach 10 points!
- Practice with the Keyboard - Typing Numbers: https://scratch.mit.edu/projects/214828609/ — Try to reach 10 points!
- Practice with the Keyboard - Typing Letters Race: https://www.nitrotype.com/ — See if you can type letters faster than your opponent and win the race.

Intermediate Typing Games:
- Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game
- Ghost Typing: https://www.abcya.com/games/ghost_typing
- Koala Paddleboards (spelling and typing practice): https://www.abcya.com/games/spelling_practice

Advanced Typing Games:
- Typing Rocket: https://www.abcya.com/games/typing_rocket
- Type Racer: https://replit.com/@JuniLearning/PS12-Type-Racer?v=1

Assuming you have followed the Instructor Note at the beginning of this module, feel free to proceed directly into the student's next course after this activity.

**Instructor Note**: If your student is still developing their typing skills, it can be helpful to start their Python classes with a “warmup” of five minutes working on these typing games.`
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
						title: "Actors",
						content:
							"Define **WIDTH** and **HEIGHT** variables (all caps) to set the window size. Explain that an object in computer science has data and functions—like Python’s turtle. Create an alien actor using `alien = Actor('alien')`. Implement `draw()` to call `screen.clear()` and then draw the alien. In `update()`, increment `alien.x` to move the alien right. Experiment with different speeds and directions by adjusting the increment values:contentReference[oaicite:5]{index=5}."
					},
					{
						title: "Position Keywords",
						content:
							"Show how to position actors using keywords like `alien.bottomleft = (0, HEIGHT)` or `alien.topleft`, etc. Add code in `update()` to move the alien and wrap it around: `if alien.left > WIDTH: alien.right = 0`. Create an `xspeed` attribute and set it, then update the alien’s position with `alien.x += alien.xspeed`. Reverse direction when hitting edges by setting `alien.xspeed = -alien.xspeed`:contentReference[oaicite:6]{index=6}."
					},
					{
						title: "PyG1 Project 1: Rainbow Fill",
						content:
							"Create a list of colors. In `draw()`, clear the screen and fill rows of the screen with rectangles of different colors from the list. Each time through the game loop, rotate the list so that the colors appear to scroll.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg1_rainbow_fill.py"
					},
					{
						title: "PyG1 Project 2: Bouncing Alien",
						content:
							"Use the alien actor and give it `xspeed` and `yspeed` dynamic attributes. Move the alien by adding these speeds to `alien.x` and `alien.y` in `update()`. When the alien hits a wall (left/right or top/bottom), multiply the corresponding speed by −1 to bounce it. Bonus: start the alien at a random position and increase its speed each time it hits a wall.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg1_bouncing_alien.py"
					},
					{
						title: "PyG1 Project 3: Wandering Ball",
						content:
							"Create a ball actor at the center of the screen. Define global `xspeed` and `yspeed`. Define a `resetBall()` function that assigns random non-zero speeds between −5 and 5 to `xspeed` and `yspeed`. In `update()`, move the ball by adding `xspeed` and `yspeed` to its position. If the ball goes offscreen, call `resetBall()` to choose new speeds. Bonus: ensure speeds are never zero.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg1_wandering_ball.py"
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
							"Use `on_key_down(key)` to move an actor when a key is pressed. For example, move an alien right on any key press or use `if key == keys.RIGHT:` to move only when the right arrow is pressed. For continuous movement, in `update()` check `if keyboard.right:` to move right. Use `alien.angle = 180` when the **W** key is pressed to flip the alien upside-down, and reset orientation on **S**. Use `alien.angle += 5` when **A** is pressed to rotate left and `alien.angle -= 5` on **D** to rotate right:contentReference[oaicite:7]{index=7}."
					},
					{
						title: "Mouse Events",
						content:
							"Implement `on_mouse_down(pos, button)` to respond to mouse clicks. Use `alien.image = 'alien_hurt'` when the alien is clicked and revert the image in `on_mouse_up()`. Check if a click is on the alien with `alien.collidepoint(pos)` and detect left clicks via `button == mouse.LEFT`. Use `sounds.eep.play()` to play a sound when clicked:contentReference[oaicite:8]{index=8}. Add `on_mouse_move(pos)` to make the alien follow the mouse by updating `alien.pos = pos`."
					},
					{
						title: "PyG2 Project 1: Arrow Point",
						content:
							"Create an arrow actor that always points toward the mouse. Use `arrow.angle` to rotate the arrow so it faces the current mouse position. Update the angle either continuously in `update()` or in a mouse-move event.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg2_arrow_point.py"
					},
					{
						title: "PyG2 Project 2: Apple Collector",
						content:
							"Create an apple actor that appears at random positions. When the apple is clicked, play a sound, increment a score variable and move the apple to a new random location. Display the score on the screen.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg2_apple_collector.py"
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
							"Explain that a **ZRect** is a rectangle with `x`, `y`, width and height. It can be used to draw shapes or detect overlaps. Create `WIDTH` and `HEIGHT` constants. Create a ZRect: `box = ZRect((100, 100), (50, 50))`. In `draw()`, draw it with `screen.draw.rect(box, (255, 0, 0))`. Experiment with different colors like blue, purple, orange and white by changing the RGB tuple:contentReference[oaicite:9]{index=9}."
					},
					{
						title: "Colliderect and Contains",
						content:
							"Create two ZRects: `randomBox` (50×50) at a random location and `middleBox` (200×200) centered on the screen. In `draw()`, use `middleBox.colliderect(randomBox)` to check if they collide. If they collide, draw `randomBox` in blue (`(0,0,255)`); otherwise draw it in red (`(255,0,0)`). Encourage experimenting with collision detection for more shapes:contentReference[oaicite:10]{index=10}."
					},
					{
						title: "Dynamic Attributes",
						content:
							"Discuss using actor-specific dynamic attributes (e.g., `xspeed`, `yspeed`, `lives`, `color`) instead of global variables when values are tied to a particular actor. Use global variables only for game-wide info like score, timer or `isGameOver`."
					},
					{
						title: "PyG3 Project 2: Light Control",
						content:
							"Create two actors: a bulb in the middle of the screen and a battery in the top-left corner. Add an `on_mouse_move()` handler so that when the left mouse button is held down, the battery follows the mouse. In `update()`, check if the bulb and battery are touching; if they collide, change the bulb’s image to the 'on' state, otherwise use the 'off' image. In `draw()`, draw both actors:contentReference[oaicite:11]{index=11}.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg3_light_control.py"
					},
					{
						title: "PyG3 Project 3: Beach Ball Chase",
						content:
							"Create a beach ball actor with random `x` and `y` positions and random `xspeed` and `yspeed` values. Let the player control an alien actor using arrow keys (move up, down, left, right). In `update()`, move the ball by its speeds and have it bounce off the walls. When the alien collides with the ball, move the ball to a new random position and increase a `score` variable. In `draw()`, draw the ball, the alien and display the score at the top left (e.g., `screen.draw.text(score, (10, 10))`). **Instructor Note**: Encourage breaking the program into helper functions: one to handle keyboard movement, one to move the ball and one to check collisions. Bonus: prevent the alien from moving offscreen:contentReference[oaicite:12]{index=12}.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg3_beach_ball_chase.py"
					}
				],
				supplementalProjects: []
			},
			{
				title: "PyG4 Managing Multiple Objects: Collectibles",
				curriculum: [
					{
						title: "Lists of Actors",
						content:
							"Instead of defining many variables, create a list to store multiple actors. Define `WIDTH` and `HEIGHT`. Use a loop to create 10 alien actors, set each alien’s `xspeed = 5` and append it to a list with `aliens.append(a)`. In `draw()`, loop through `aliens` and call `alien.draw()` for each. In `update()`, loop through the list to move each alien by its `xspeed` and reverse direction when it hits the screen edges. Emphasize using dynamic attributes for per-object values and global variables for overall game state."
					},
					{
						title: "PyG4 Project 1: Bouncy Ball Room",
						content:
							"Create multiple ball actors with random `x` and `y` positions and random `xspeed` and `yspeed`, storing them in a list. In `draw()`, loop through the list and draw each ball. In `update()`, move each ball and bounce it off the walls by checking `ball.top`, `ball.left`, `ball.right` and `ball.bottom`—reverse the appropriate speed when a wall is hit. **Nested loops**: to make balls bounce off each other, write a function `checkBallCollision(b1, b2)` that multiplies the `xspeed` and `yspeed` of both balls by −1 when they collide, and call it inside a double loop over the list:contentReference[oaicite:13]{index=13}.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg4_bouncy_ball_room.py"
					},
					{
						title: "PyG4 Project 2: Falling Squares",
						content:
							"Show the final solution. Define a `resetSquares()` function that resets the positions of square actors to the top of the screen and randomizes their order of blue and red squares. Call this function when the blue square is clicked or when squares reach the bottom. Maintain a list of possible x-positions for squares to avoid overlapping; monitor when a row of squares reaches the bottom to trigger `resetSquares()`. Use a `speed` variable for how fast the squares fall and increase it each time the blue square is clicked.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg4_falling_squares.py"
					},
					{
						title: "PyG4 Project 3: Jewel Catch",
						content:
							"Show the student the final solution. Set the background to white with `screen.fill((255, 255, 255))`. Create a list of 5 gem actors and 4 bomb actors. Set each gem and bomb at a random x-position and assign an `xspeed` between 1 and 3, ensuring they aren’t clumped together. Write `moveShip()` to move a rocket left and right with arrow keys, preventing it from leaving the screen. In `update()`, continuously move the gems and bombs downward. Write `checkGemCollision(gem)` to reset a gem to the top when it reaches the bottom or the rocket catches it, adding 5 points when caught. Write `checkBombCollision(bomb)` to reset a bomb to the top when it reaches the bottom or hits the rocket, subtracting 10 points if hit. Gems and bombs move left and right while falling; when they hit the screen sides, reverse their horizontal direction. Implement these checks inside `checkGemCollision()` and `checkBombCollision()`:contentReference[oaicite:14]{index=14}.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg4_jewel_catch.py"
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
							"Introduce gravity as a force that pulls actors downward; we can add a gravity factor to actors to simulate this. Create a `beach_ball` actor with dynamic attributes `xspeed` and `yspeed`. In `draw()`, draw the ball. In `update()`, update `ball.x` and `ball.y` using `ball.x += ball.xspeed` and `ball.y += ball.yspeed`. Then add a global `GRAVITY` variable (e.g., `0.1`) and in `update()` increase `ball.yspeed` by `GRAVITY`. Test how the ball accelerates. Discuss adding wind by introducing a `WIND` variable that modifies `ball.xspeed`; explore what happens when `WIND` is zero or nonzero:contentReference[oaicite:15]{index=15}.",
						projectLink:
							"https://static.junilearning.com/pygame/pyg5_gravity"
					},
					{
						title: "PyG5 Project 1: Keep Up",
						content:
							"Create a ball actor with `xspeed` and `yspeed`. Create global `GRAVITY` and `score` variables. In `draw()`, show the score and draw the ball. In `update()`, add `GRAVITY` to the ball’s y-speed, update the ball’s position using `xspeed` and `yspeed`, and make the ball bounce off the left and right walls. Implement `on_mouse_down(pos)` to check if the click collides with the ball; if so, set the y-speed of the ball to −3, set the x-speed to a random value between −15 and 15, and increment the score. Make the ball bounce off the right wall using a conditional like `if ball.right >= WIDTH: ball.right = WIDTH; ball.xspeed = -ball.xspeed` and similarly for the left wall. Bonus: add a small amount of wind and play a popping sound each time the ball is clicked:contentReference[oaicite:16]{index=16}.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg5_keep_up.py"
					},
					{
						title: "Friction",
						content:
							"Create dynamic variables `xspeed` and `yspeed` for a ball, set `xspeed` to 10 and `yspeed` to 0. Create a global `FRICTION` variable (e.g., 0.95). In `update()`, multiply `ball.xspeed` and `ball.yspeed` by `FRICTION` to slowly decrease the speed. Run the program with different starting speeds and friction values; observe that higher friction slows the ball more quickly. Discuss the effect of friction values greater than 1 or less than 1:contentReference[oaicite:17]{index=17}."
					},
					{
						title: "PyG5 Project 2: Golf",
						content:
							"Create actors for the golf ball, hole and flag. Assign dynamic attributes for the ball’s `xspeed` and `yspeed`. Make global variables for the `FRICTION` and the number of `strokes`. Position the hole and flag in the center of the screen and place the hole where the flag is. When the player clicks on the screen, set `xspeed` and `yspeed` of the ball to move it toward the click location. In `draw()`, set the background color to green (`screen.fill((50, 100, 50))`), display the number of strokes in the top-left corner and draw the hole, flag and ball. In `update()`, apply friction to reduce speeds, update the ball’s position based on `xspeed` and `yspeed`, and make it bounce off walls. When the ball reaches the hole, center it in the hole and stop movement. Record the number of strokes and display a congratulatory message when finished:contentReference[oaicite:18]{index=18}.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg5_golf.py"
					},
					{
						title: "PyG5 Project 3: Multi-Ball Physics",
						content:
							"Create a list of 10 ball actors, each with a random location and random `xspeed` and `yspeed`. Create global `GRAVITY` and `FRICTION` variables. Define `draw()` to draw each ball. In `update()`, for each ball: add `GRAVITY` to its y-speed, multiply `xspeed` and `yspeed` by `FRICTION` to slow it down, update its position by adding the speeds, and if a ball goes offscreen reverse the corresponding speed and set its position back on screen. Add an `on_key_down()` event that randomizes the location and speeds of all balls when the space key is pressed. Add an `on_mouse_down(pos)` event that loops through the balls; if a ball is clicked (using `collidepoint()`), set its `xspeed` and `yspeed` to random values. **Bonus**: Add wind controlled by arrow keys: left arrow decreases the wind, right arrow increases the wind, and pressing spacebar resets wind to zero:contentReference[oaicite:19]{index=19}.",
						solutionLink:
							"https://static.junilearning.com/pygame/pyg5_multiball_physics.py"
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
							'**Instructor Note**: Students new to C++ may be unfamiliar with its syntax and structure. Guide them through setting up an account on repl.it, choosing C++ 11, creating a file (e.g., Objects and Variables), and running code. Introduce a basic program: `std::cout << "Hello World!\\n";` and show how it prints to the console. Emphasize compiling/running via Repl.it’s Run button.'
					},
					{
						title: "Primitive Types",
						content:
							"Discuss fundamental data types in C++: integers, floating-point numbers, booleans and characters. Show how to declare variables of each type and assign values. Explain arithmetic operations including modulus. Demonstrate printing values using `std::cout` and reading values with `std::cin`."
					},
					{
						title: "String",
						content:
							"Explain the `std::string` class. Demonstrate declaring strings, concatenating them, indexing characters, using `string.length()` and adding characters. Show how to modify and print strings."
					},
					{
						title: "Input and Output",
						content:
							"Introduce `iostream` and explain insertion (`<<`) and extraction (`>>`) operators. Demonstrate reading input from the user with `std::cin` and printing results with `std::cout`. Example: prompt the user for their name and greet them by printing “Nice to meet you, <name>”."
					},
					{
						title: "Comments",
						content:
							"Teach single-line comments using `//` and multi-line comments using `/* … */`. Explain why comments are useful for documenting code."
					},
					{
						title: "Compilation (Advanced Concept)",
						content:
							"Briefly explain what happens when a C++ program is compiled. Touch on namespaces (`std::`), the scope-resolution operator `::`, object files and linking."
					},
					{
						title: "CPPF1 Project 1: Mad Libs",
						content:
							"Have the student play a Mad Libs game from the solution to understand the goal. Then have them build their own Mad Libs: create several string variables and prompt the user to enter words (nouns, verbs, adjectives, etc.) via `std::cin`. After gathering inputs, concatenate the strings into a story using `std::cout`. Encourage creativity. Finally, have the student record a video explaining the project and share it.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF1-Mad-Libs-Solution"
					},
					{
						title: "CPPF1 Project 2: Chatbot",
						content:
							"Create a simple chatbot that interacts with the user. Ask for the user’s name and respond. Ask for a sentence, use `str.insert()` to insert “achoo” into the user’s sentence, and have the bot “sneeze.” Ask for a temperature in Fahrenheit and convert it to Celsius using floating-point arithmetic. Ask for an amount in dollars and convert it to another currency. Emphasize correct use of floats. When finished, have the student record a video explaining and share the project.",
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
							"Introduce the structure of a `for` loop: initialization, condition and increment. Practice writing loops to print numbers from 11 to 20, print even numbers from 2 to 10, print numbers from 10 down to 1, ask the user for a word and print its letters one by one, print the word backward, sum the numbers from 1 to 100 and calculate the factorial of 10. Discuss the `++` and `--` operators and compound assignment."
					},
					{
						title: "While Loops",
						content:
							"Explain `while` loops and how they repeat until a condition becomes false. Practice converting the for-loop exercises into while-loop versions. Emphasize careful loop termination to avoid infinite loops."
					},
					{
						title: "CPPF2 Project 1: Loop Practice",
						content:
							"Ask the user for two numbers (a smaller and a larger). Print all the numbers between them. Then ask how many numbers the user wants to enter; read that many numbers and print their sum. Finally, compute and print the average (using a `double` for precision). Implement each part using both `for` and `while` loops. Finish by recording and sharing a video of the project."
					},
					{
						title: "Conditionals and Logical Operators",
						content:
							"Introduce comparison operators (`==`, `!=`, `>`, `<`, `>=`, `<=`) and logical operators (`&&` for AND, `||` for OR). Show how to construct `if`, `else if` and `else` chains. Demonstrate simple decision-making based on user input."
					},
					{
						title: "CPPF2 Project 2: Rock, Paper, Scissors",
						content:
							"Discuss how to implement Rock–Paper–Scissors using conditionals. Prompt both players for their choice, then use nested conditionals to determine the winner by comparing the choices. After coding, have the student record a video explaining and share the project.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF2-Rock-Paper-Scissors-Solution"
					},
					{
						title: "CPPF2 Project 3: FizzBuzz",
						content:
							"Print the numbers 1 through 50, but for multiples of 3 print “Fizz,” for multiples of 5 print “Buzz,” and for multiples of both 3 and 5 print “FizzBuzz.” Emphasize using the modulo operator. Challenge: allow the user to input two numbers and print a customized FizzBuzz. Record a video and share.",
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
							"Explain that a function is a reusable block of code that takes inputs (parameters) and returns a value. Show the syntax: return type, function name and parameters. Demonstrate defining functions outside `main` and calling them from `main`. Explain prototypes and how return types determine what a function returns."
					},
					{
						title: "CPPF3 Project 1: Function Practice",
						content:
							"Write several functions: (1) a function that takes two integers and returns their average (use `double` for precision); (2) a function that takes an integer and returns `true` if it’s even, `false` otherwise; (3) a function that takes three doubles and returns the smallest; (4) a function that takes an integer and returns its factorial; (5) a function that takes a base and exponent and returns the base raised to that power. Have the student test each function, record a video explaining, and share.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF3-Function-Practice-Solution"
					},
					{
						title: "Random Numbers",
						content:
							"Introduce `rand()` from `<cstdlib>` to generate random numbers. Show how to seed the random number generator using `srand(time(NULL))` for varied results. Explain using modulo to restrict random numbers to a range (e.g., `rand() % (max - min) + min`)."
					},
					{
						title: "CPPF3 Project 2: Probability Events and Random",
						content:
							"Write functions to simulate random events: (1) flip a coin and return “heads” or “tails”; (2) roll two dice and return the sum; (3) draw a card from a standard 52-card deck and return a string like “10 of Diamonds” or “King of Spades.” Discuss how to use random numbers to choose card values and suits. Record and share a video.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF3-Probability-Events-Solution"
					},
					{
						title: "CPPF3 Project 3: Number Guesser",
						content:
							"Create a game where the program picks a random number within a range specified by the user. Ask the user for the range bounds and for the number of guesses allowed. Implement separate functions for asking the range, generating the number, prompting guesses and giving feedback (higher/lower). End the game when the user guesses correctly or runs out of guesses. Record and share a video.",
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
						title: "Introduction to Classes and Objects",
						content:
							"Explain object-oriented programming and why classes are useful. Show how to define a class with private member variables and public member functions. Demonstrate creating objects, constructors and destructors."
					},
					{
						title: "Public and Private Variables",
						content:
							"Discuss encapsulation and why member variables should be private. Show how to use getter and setter functions to access and modify private data."
					},
					{
						title: "More about Classes (getters, setters, printing, etc.)",
						content:
							"Expand on class features: default constructors, copy constructors, overloaded constructors, and how to print class objects by writing a `print()` method."
					},
					{
						title: "CPPF4 Project 1: Cat Class",
						content:
							"Create a `Cat` class with private attributes such as name, age and weight. Write appropriate constructors, getters and setters. Add a method `meow()` that prints a message. In `main`, instantiate several cats and call their methods. Record a video explaining and share.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF4-Cat-Class-Solution"
					},
					{
						title: "CPPF4 Project 2: Bookcase",
						content:
							"Design a `Book` class with attributes like title, author and page count. Then design a `Bookcase` class that stores multiple books. Implement methods to add books, remove books and list all books. Encourage using arrays or vectors. Record and share a video.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF4-Bookcase-Solution"
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
							"**Instructor Note**: The reference code includes material on pointers and references; a formal walkthrough is provided later. Use it to guide discussion. Pointers allow us to store memory addresses of variables. Every variable has a memory address, which we can obtain using the `&` operator. A pointer is declared by placing `*` after the type (e.g., `int* p1`), and we assign it the address of a variable using `&`. A pointer’s type must match the type of the variable it points to. Use `nullptr` to indicate that a pointer doesn’t point anywhere.",
						projectLink:
							"https://repl.it/@JuniLearning/CPPF5-Pointers-Reference"
					},
					{
						title: "CPPF5 Project 1: Pointers Introduction",
						content:
							"Project questions walk through pointer fundamentals, including dereferencing, copying pointers, and handling `nullptr`. When your student finishes the project, have them create a Recording Studio video explaining what the project does and how they programmed it, then share it.",
						projectLink:
							"https://repl.it/@JuniLearning/CPPF5-Pointers-Starter?skipMigration=1",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF5-Pointers?skipMigration=1"
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
							"Explain that a reference is an alias for another variable. Create a reference using `&` after the type (e.g., `int& ref1 = intVal1`). Modifying the reference changes the original variable. References are often used for passing parameters to functions."
					},
					{
						title: "Parameter Passing",
						content:
							"Discuss three ways to pass parameters: by value, by reference and by const reference. • Pass by value copies the argument; modifications don’t affect the original. • Pass by reference allows the function to modify the original value. • Pass by const reference allows the function to read the value without modifying it. Show examples where spacing around `&` doesn’t matter (e.g., `int& ref` vs. `int &ref`)."
					},
					{
						title: "CPPF6 Project 1: Parameter Passing Tracing",
						content:
							"Write comments predicting what will happen to parameters passed by value, reference and const reference, then run the program to test the predictions. Discuss why parameters passed by const reference cannot be changed inside the function. After finishing, have the student record a video explaining and share the project.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF6-Parameter-Passing-Tracing?skipMigration=1"
					},
					{
						title: "CPPF6 Project 2: Defanging a Website Address",
						content:
							"Write a program that replaces periods in a URL with `[.]` to “defang” the address. Create one function that defangs by editing the string directly (pass the string by reference) and another function that returns a defanged copy (pass by value). Use `str.replace()` to substitute each period. At the end, record a video explaining the project and share it.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF6-Defanging?skipMigration=1"
					},
					{
						title: "CPPF6 Project 3: Chaos Monkeys",
						content:
							"Write functions that insert random uppercase characters into a string. Create three functions that each take a string and (a) pass by value, (b) pass by reference, and (c) pass by const reference; each function should insert characters differently. Use the string method `.insert(int index, int count, char newChar)` to add characters at random positions. Note: be careful when iterating over a changing string—if you call `.length()` each time, the loop might not terminate. Challenge the student to explore other string-scrambling functions. After finishing, record and share a video.",
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
							"Explain that arrays hold multiple values of the same type. Declare an array by specifying its type, name and size, e.g., `int arr[10]`. Ask the student to create an array `nums` with 10 ints. Show how to initialise arrays with an initializer list: `int arr[] = {1, 2, 3}`. Access elements by index (0-based) and modify them. Explain how `sizeof(array) / sizeof(array[0])` gives the number of rows or columns. Demonstrate iterating over an array with a loop and using pointers to traverse arrays, but caution against undefined behaviour when accessing memory out of bounds."
					},
					{
						title: "CPPF7 Project 1: Array Practice",
						content:
							"1. Create and print an array containing the first 10 perfect squares. 2. Write a function that takes an array of ints and returns `true` if the first and last elements are the same. 3. Write a function that sums all elements in an array of ints. 4. Write a function that takes an array of strings and returns the total number of letters in all strings. Explain how arrays are passed to functions: either as `type arr[]` or as a pointer. At the end, have the student record and share a video.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF7-Array-Practice?skipMigration=1"
					}
				],
				supplementalProjects: []
			},
			{
				title: "CPPF8 Two-Dimensional Arrays",
				curriculum: [
					{
						title: "Two-Dimensional Arrays",
						content:
							"Explain how to create a 2D array in C++ (an array of arrays). For example, `int arr[10][10];` allocates 10×10 integers. Show initializer lists for 2D arrays, e.g., `int arr[3][3] = { {1,2,3}, {4,5,6}, {7,8,9} };`. Teach how to compute the number of rows using `sizeof(array) / sizeof(array[0])` and the number of columns using `sizeof(array[0]) / sizeof(array[0][0])`. Demonstrate accessing `arr[i][j]` and printing all elements with nested loops. Discuss passing 2D arrays to functions and returning them using pointers (`int**`) or arrays."
					},
					{
						title: "Using Two-Dimensional Arrays in Functions",
						content:
							"Explain that when passing a 2D array to a function, the array parameter should be written as `(int *arr, int row, int col)` so that the function can access the memory. Within functions, 2D arrays are continuous blocks of memory; to access element `(i, j)` in an `m-by-n` array, use `*((arr + i*n) + j)`. Show how to return a 2D array from a function using `int**` for a 2D array and `int*` for a 1D array. Demonstrate creating a basic array-generating function that returns an array with numbers 0 through `n`."
					},
					{
						title: "CPPF8 Project 1: Two-Dimensional Array Practice",
						content:
							"Solve the following problems using 2D arrays: • Write a method that takes in a 2D array of integers and returns the sum of all of the integers in the array. • Write a method that takes in a 2D array of integers and returns the minimum of all of the integers in the array. • Write a method that takes in an integer `n` and returns a 2D array of the `n × n` multiplication table. Then, print the array in grid format. • Write a method that takes in a 2D array of integers and returns a one-dimensional array of the averages of the integers in each row (averages returned as floats). When your student finishes, have them make a Recording Studio video explaining the project and share it.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF8-2D-Array-Practice?skipMigration=1"
					},
					{
						title: "CPPF8 Project 2: Bank Balances",
						content:
							"Show the student what you are trying to create and ask what components might be needed. How can we use a 2D array? How might we store a customer and their recurring transactions to show their total balance? Work with the student on the `print()` function to print out a grid. How can we use nested `for` loops to do this? Once the `print()` method is complete, have the student implement the necessary data structure to allow user interaction. When your student finishes their project, have them make a Recording Studio video where they explain what the project does and how they programmed it. Finally, have them share their project!",
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
							"Pointers let us point to values that don’t have variable names. Variables we define manually are called static variables. Variables created during runtime via pointers are called dynamic (or anonymous) variables. Use the `new` operator to allocate memory and create dynamic variables (e.g., `int* p1 = new int;`). Assign values to them using `*p1 = 5` or `std::cin >> *p1`. Always call `delete p1` when done to avoid memory leaks. After deleting, a pointer becomes invalid (a dangling pointer) and dereferencing it leads to undefined behaviour. Use `nullptr` to indicate that a pointer doesn’t point to anything.",
						projectLink:
							"https://repl.it/@JuniLearning/CPPF9-Dynamic-Variables-Reference"
					},
					{
						title: "CPPF9 Project 1: Assembly Line",
						content:
							"1. Create a basic Object class with variables for its name and weight (in pounds), a constructor using the BMI, and a `print()` function that prints the name, the weight of the object in pounds, and the weight of the object in kilograms (1 kg = 2.205 lbs). 2. Repeatedly ask the user for the necessary information to create a new Object and store that Object using a dynamic variable. 3. Print out the newly created Object and then free up the memory that was allocated for it in preparation for processing the next Object. 4. Bonus: Ask the user how many Objects they will be processing and then store that many Objects in an array. Once the information is entered, loop through the array and print out the information for each of the Objects. 5. When the student finishes the project, have them make a Recording Studio video explaining what the project does and how they programmed it. Finally, have them share their project.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF9-Assembly-Line?skipMigration=1"
					},
					{
						title: "Introduction to Dynamic Arrays",
						content:
							"Static arrays are limited because their size is fixed at compile time. If we need more data than the array can hold, we must create a new array of a larger size and copy the data over. If we keep appending data past the array’s end without checking capacity, we could overwrite memory we don’t own. To create dynamic arrays: (1) declare a pointer to the array; (2) create the array with `new`; (3) use the pointer as the array; (4) if we run out of space, allocate a new (larger) array, copy over the elements and delete the old one; (5) remember to free memory with `delete` when done."
					},
					{
						title: "Dynamic Arrays and Memory",
						content:
							"A dynamic array automatically resizes itself when it runs out of room. We’ll write our own `DynamicArray` class that creates a new array with more space when the old one runs out, copies old values to the new array and deletes the old one. Failing to call `delete` can cause memory leaks. When a class allocates memory, write a destructor (prefixed with `~`) that frees that memory. Destructors are called automatically when the object goes out of scope."
					},
					{
						title: "CPPF9 Project 2: Dynamic Array Implementation",
						content:
							"Implement your own `DynamicArray` class. Include private members: `mysize` (number of elements), `maxSize` (capacity) and `int* myVals` (pointer to the array). Optionally define a constant `DEFAULT_SIZE` for initial capacity. Write: • A default constructor that sets `mysize` to 0, `maxSize` to a default size and `myVals` to a new array of that size. • A destructor that deletes `myVals` and sets `mysize` to 0. • `addVal(int val)`: check if there’s enough space; if not, create a new array with double the previous capacity, copy values over, swap pointers, delete the old array and then add the new value. Increment `mysize`. • `printVals()`: print out the values stored, iterating over `myVals` based on `mysize`. • `get(int index)`: return the value at a specific index. When finished, have the student record a video explaining and share the project.",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF9-Dynamic-Array-Implementation?skipMigration=1"
					},
					{
						title: "Introduction to Structs",
						content:
							"Explain that a struct is like a class but defaults to public members. Structs are useful for grouping small, related data items (e.g., a `node` struct with `int data` and `node* next`). They appear often in code because they’re concise. In the next project we’ll create a Grocery List using structs to combine item names and prices."
					},
					{
						title: "CPPF9 Project 3: Grocery List",
						content:
							"We need to change the DynamicArray implementation to store Groceries instead of ints. Because groceries contain just a name and a price, create a simple struct in the DynamicArray.h file. Include a basic constructor and an all-members constructor to initialize its private variables. Modify the dynamic array to store this struct instead of int; update any functions that depend on the array’s data type. Desired functionality: printing the list and adding an item. To remove an item at an index, shift elements by copying into a new array and skipping the removed item (ensure the Grocery item being added is newly constructed to avoid pass-by-value errors). Create a basic menu that lets the user add, remove, print and quit. When finished, record a video explaining what the project does and how it was programmed, then share it.",
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
							"We can call grids of numbers matrices. There’s a lot of operations we can do with matrices such as addition. It’s important to remember that two matrices need to have the same dimension for us to do matrix addition. Show the student what we’re trying to create and have them map out the process they would take to make this matrix addition possible. Create variables for the number of rows, columns, and for each of the matrices. Ask the user for the dimensions of the matrix and for the elements of the matrix. Add the matrices and print out the result in a grid layout. When your student finishes their project, have them make a Recording Studio Video where they explain what the project does and how they programmed it. Finally, have them share their project!",
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
							"Create a Profile class that stores posts that have a caption and a number of hearts on them. The user can then add posts to their profile, and print out the posts’ captions and the total number of hearts on all of the posts. The Profile class needs to store a changing amount of Post structs: we need to be able to add more Posts as necessary. Variables: numPosts, maxSize, myPosts. Functions include addPost(newPost), printPost(index), printPosts(), addHearts(index, numHearts) and a helper to validate indexes. Bonus extensions include adding more fields, duplicating posts, and summing hearts. When your student finishes their project, have them make a Recording Studio Video where they explain what the project does and how they programmed it. Finally, have them share their project!",
						solutionLink:
							"https://repl.it/@JuniLearning/CPPF11-Profile-Posts?skipMigration=1"
					},
					{
						title: "Course recap",
						content:
							"We've learned a lot over these past few months! Can you recap what this course covered? Discuss with the student the next Juni course they will be starting."
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
				items.map(item => ({
					id: slugify(`${moduleId}-${prefix}-${item.title}`),
					title: item.title,
					content: normalizeContent(item.content),
					projectLink: item.projectLink,
					solutionLink: item.solutionLink
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
