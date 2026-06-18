import type { RawCourse } from "./types";

export const pythonLevel1Course: RawCourse = {
	name: "Python Level 1",
	modules: [
		{
			title: "GrS1 Coordinates and Movement",
			curriculum: [
				{
					title: "Introduction and Setup",
					content:
						"Get comfortable with the coding environment, the Turtle canvas, the console, and project instructions. Learn what Python is used for and how Turtle programs are organized."
				},
				{
					title: "GrS1 Project 1: Turtle Exploration",
					content:
						"Import `turtle`, create a turtle, move it with `forward()`, turn with `left()` and `right()`, and use `goto()`, `penup()`, `pendown()`, `color()`, `begin_fill()`, and `end_fill()` to create a square, a triangle, and a filled shape in a new location. Practice reading console errors, fixing mistakes, and adding comments to explain code.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS1-Turtle-Exporation-All-Star/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS1 Supplemental Project 1: Turtle Recap",
					content:
						"Create a personal study guide for the first Turtle module. Answer review questions about what Python does, how a Turtle program starts, how movement and turn commands change the drawing, and how pen control affects visible lines. Include one small code example that moves to a new coordinate, draws a filled shape, and uses a comment to explain the intent.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Recap/solution"
				},
				{
					title: "GrS1 Supplemental Project 2: Open Ended Project - Create a Drawing",
					content:
						"Create an original Turtle drawing that uses movement, turning, coordinates, pen control, and color deliberately. Plan the drawing as at least three visible parts before coding, then place each part with `goto()`, `penup()`, and `pendown()` instead of relying only on the turtle's current position. The finished program should include comments naming each part of the drawing and at least one filled shape."
				}
			]
		},
		{
			title: "GrS2 Loops",
			curriculum: [
				{
					title: "GrS2 Project 1: Basic Shapes",
					content:
						"Learn how `for` loops repeat code and use them to draw a square, triangle, and circle more efficiently. Compare repeated code with loop-based code and explore how shape sides and turn angles work together.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS2-Basic-Shapes/solution"
				},
				{
					title: "GrS2 Project 2: Smiley Face",
					content:
						"Combine loops, shape planning, colors, and background changes to draw a smiley face with features such as rectangular eyes and a curved mouth.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Smiley-Face/solution"
				},
				{
					title: "GrS2 Project 3: Open Ended Project - Drawing with Loops",
					content:
						"Create an original drawing that uses loops because repetition is genuinely part of the design. Good options include flowers, landscapes, symbols, patterned borders, or name art. The finished code should have at least two loops, a clear reason for the repeated movement, and one short comment explaining which repeated visual feature each loop creates."
				}
			],
			supplementalProjects: [
				{
					title: "GrS2 Supplemental Project 1: More Shapes",
					content:
						"Draw a magenta hexagon, a purple decagon, and a teal star on different parts of a black screen. Use loops for the repeated sides, calculate or choose turns intentionally, and move between shapes with the pen lifted so the travel lines do not appear. Verify that each shape has the correct number of visible points or sides.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS2-More-Shapes/solution"
				},
				{
					title: "GrS2 Supplemental Project 2: Bullseye",
					content:
						"Draw a target made of alternating red and white circles. Keep the circles centered by returning to a predictable position before each ring, and use a loop or repeated helper pattern so the radius changes consistently. The final target should show clear alternating colors and rings that stay aligned around the same center point.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS2-Bullseye/solution"
				},
				{
					title: "GrS2 Supplemental Project 3: Watermelon Slice",
					content:
						"Use loops and fills to draw a watermelon slice with rind, fruit, and seeds. Separate the drawing into layers: outer rind, inner fruit, and repeated seed shapes. The repeated seeds should be positioned with a visible pattern rather than placed randomly, and the fill colors should make each layer easy to distinguish.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS2-Watermelon-Slice/solution"
				},
				{
					title: "GrS2 Supplemental Project 4: Taxi",
					content:
						"Draw a taxi using basic Turtle shapes for the body, wheels, windows, and at least one extra detail such as a sign, headlights, or road line. Experiment with thicker pen sizes for bolder outlines, but keep the fill colors and outlines readable. The finished drawing should make the taxi recognizable from separate planned pieces, not one continuous accidental path.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS2-Taxi/solution"
				},
				{
					title: "GrS2 Supplemental Project 5: Captain America Shield",
					content:
						"Use concentric circles and a centered star to build a layered shield design. The circles should share a center point, shrink in a predictable order, and alternate colors cleanly. Finish by checking that the star is centered inside the smallest circle and that the layer order does not hide important parts of the shield.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS2-Captain-America-Shield/solution"
				},
				{
					title: "GrS2 Supplemental Project 6: Minion",
					content:
						"Combine loop-based drawing ideas to create a more complex character illustration. Break the minion into body, eye or goggles, clothing, arms, and facial details before coding. Use loops for repeated features such as eyes, buttons, hair, or clothing details, and verify that the drawing still works if one size or position variable changes slightly.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS2-Minion/solution"
				},
				{
					title: "GrS2 Supplemental Project 7: Loops Recap",
					content:
						"Create a study guide for loops and shape-building. Explain what a `for` loop repeats, why loops reduce copied code, and how side count relates to turn angle when drawing polygons. Include one short traced example showing how many times the loop body runs and one drawing example where changing the loop count changes the finished shape.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS-Loops-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS-Loops-Recap/solution"
				}
			]
		},
		{
			title: "GrS3 Variables and Random Numbers",
			curriculum: [
				{
					title: "GrS3 Project 1: Awesome Angles",
					content:
						"Use variables such as `length` and `degrees` to control turtle movement, compare assignment in code with equality in math, and experiment with changing variable values to alter the drawing.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Awesome-Angles/solution"
				},
				{
					title: "GrS3 Project 2: Surprise Me Square",
					content:
						"Replace hardcoded coordinates, side lengths, and RGB values with variables, then use `random.randint()` to generate random locations, sizes, and colors for a square.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Surprise-Me-Square/solution"
				},
				{
					title: "GrS3 Project 3: Random Walk",
					content:
						"Combine loops with random movement to simulate a random walk. Customize the turtle shape and pen size while practicing readable variable names.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Random-Walk/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Random-Walk/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS3 Supplemental Project 1: Random Bowtie",
					content:
						"Draw a bowtie with random colors for each half and a randomly chosen background color. Store the random choices in variables before drawing so the color decisions can be printed, reused, or debugged. The two halves should stay symmetric in shape while color changes from run to run.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Random-Bowtie/solution"
				},
				{
					title: "GrS3 Supplemental Project 2: Debugging Practice",
					content:
						"Read console errors and fix a buggy Turtle program one issue at a time. Start with the first error message, identify the line it points to, and decide whether the problem is spelling, missing punctuation, variable naming, command order, or an invalid value. After each fix, rerun the program and confirm that the drawing moves closer to the intended result instead of changing several things at once.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Debugging-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Debugging-Practice/solution"
				},
				{
					title: "GrS3 Supplemental Project 3: Variables and Random Numbers Recap",
					content:
						"Summarize variables, random numbers, and basic data types. Explain how a variable stores a value, why descriptive variable names make Turtle drawings easier to adjust, and how `random.randint()` can choose a size, coordinate, or color value. Include examples of an integer, string, and boolean, then describe one bug that can happen when a value is the wrong type.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Game-Mechanics-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Game-Mechanics-Recap/solution"
				},
				{
					title: "GrS3 Supplemental Project 4: Open Ended Project - Haphazard Artwork",
					content:
						"Use loops and random values together to create abstract artwork with random colors, positions, and shapes. Decide which properties should be random and which should stay controlled, then store important ranges in variables such as minimum size, maximum size, or number of shapes. The finished artwork should be different on each run while still following a recognizable design rule."
				}
			]
		},
		{
			title: "GrS4 Conditionals Part 1",
			curriculum: [
				{
					title: "GrS4 Project 1: Surprise Shape",
					content:
						"Learn booleans, comparison operators, and `if` statements by generating a random number and using conditionals to choose which shape to draw.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS4-Surprise-Shape/solution"
				},
				{
					title: "GrS4 Project 2: Find Your Turtle",
					content:
						"Use the coordinate plane, comparison operators, `and`, `or`, `xcor()`, and `ycor()` to detect where a turtle is and react differently in different regions of the canvas.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS4-Find-Your-Turtle/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS4 Supplemental Project 1: Navigating the Coordinate Plane",
					content:
						"Strengthen coordinate-plane skills through targeted coordinate questions and movement practice. Use the x-axis, y-axis, quadrants, and ordered pairs to predict where the turtle should move before running the program. Include at least one check involving a positive coordinate, one involving a negative coordinate, and one involving the origin or an axis.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS4-Navigating-the-Coordinate-Plane/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS4-Navigating-the-Coordinate-Plane/solution"
				},
				{
					title: "GrS4 Supplemental Project 2: Open Ended Project - Boolean Bonanza",
					content:
						"Create an original Turtle game that uses random numbers, booleans, and conditionals to produce different outcomes. Define what counts as a win, loss, hit, miss, or special event before coding. The finished game should use at least two boolean expressions, one compound condition with `and` or `or`, and visible feedback that proves different branches can run."
				},
				{
					title: "GrS4 Supplemental Project 3: Conditionals and Booleans Recap",
					content:
						"Answer short review questions about booleans, comparison operators, and conditionals, then write one tiny Turtle example for a comparison that is true and one for a comparison that is false. The recap should connect vocabulary to visible behavior, such as a turtle changing color only when a condition is met.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS-Conditionals-and-Booleans-Recap-Template/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS-Conditionals-and-Booleans-Recap-Template/solution"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this check-in as a guided review of Turtle basics, loops, variables, random numbers, and conditionals. Try each prompt independently first, then revisit any topics that need more practice.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Check-in-1/solution"
				},
				{
					title: "Check-In #1: Basics with Turtle",
					content:
						"Review how to import Turtle, create a turtle, move forward, turn, change colors, use `goto()`, lift and lower the pen, and draw outlined and filled shapes at chosen coordinates."
				},
				{
					title: "Check-In #1: Loops",
					content:
						"Explain what loops do, then use them to repeat movement, draw polygons such as a dodecagon, scale shapes to different sizes, and approximate circles with many short repeated turns."
				},
				{
					title: "Check-In #1: Variables and Random Numbers",
					content:
						"Review variables as reusable names for values, store side lengths and random values, and use RGB variables to generate random turtle colors."
				},
				{
					title: "Check-In #1: Conditionals",
					content:
						"Practice `if`, `elif`, and `else` by reacting to random numbers and turtle positions. Use coordinate checks with `and` and `or` to change color based on where the turtle is on the canvas."
				},
				{
					title: "Check-In #1 Reflection",
					content:
						"Write a short reflection about favorite concepts, challenges, problem-solving strategies, and a moment of pride from the course so far.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/solution"
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Create a zigzagging line with about 30 turns, then extend it by connecting the zigzag to one or more original shapes. Use variables for repeated values such as turn amount, step length, and number of turns so the pattern can be adjusted without rewriting the loop. Verify that the extension is connected intentionally rather than added as unrelated drawing code.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS-Check-in-1-Additional-Practice-Project/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "GrS5 Loops with Variables",
			curriculum: [
				{
					title: "GrS5 Project 1: Fireworks",
					content:
						"Combine loops with reassignment so a value changes on every repetition. Use a `lineLength` variable that grows over time to create an expanding fireworks pattern.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Fireworks/solution"
				},
				{
					title: "GrS5 Project 2: While Loops Exploration",
					content:
						"Compare `while` loops with `for` loops, build loops that stop based on coordinates, and use `write()`, `clear()`, and coordinate checks to animate a turtle moving toward a stop sign.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/While-Loops-Exploration/solution"
				},
				{
					title: "GrS5 Project 3: Square Spiral",
					content:
						"Use a counter-controlled `while` loop plus a changing line length to create a square spiral with gradually changing properties. Track the loop counter, current line length, and turn direction separately so the stopping condition is easy to explain. The final spiral should show steady growth rather than disconnected squares.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Square-Spiral/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS5 Supplemental Project 1: Rainbow Ninja Star",
					content:
						"Draw a ninja star pattern that starts from the center and gradually shifts through color values. Use variables for length, turn amount, and color components so the visual change is produced by reassignment inside the loop. The finished pattern should make both the repeated geometry and the color progression visible.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Rainbow-Ninja-Star/solution"
				},
				{
					title: "GrS5 Supplemental Project 2: Into the Void",
					content:
						"Draw a growing sequence of rotated squares using a loop that changes size and rotation in a predictable pattern. The final drawing should make the growth rule visible, and the code should keep the repeated drawing steps inside the loop rather than manually duplicating square commands.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Into-the-Void/solution"
				},
				{
					title: "GrS5 Supplemental Project 3: Out of the Void",
					content:
						"Create a spiral triangle pattern and experiment with negative movement values. Before running the full drawing, predict how a negative movement changes the turtle's direction compared with turning. The final code should use a loop, a changing size value, and one short comment explaining why the spiral moves outward or inward.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Out-of-the-Void/solution"
				},
				{
					title: "GrS5 Supplemental Project 4: Turtle Race",
					content:
						"Simulate a race between three turtles that move forward by random amounts until one crosses the finish line. Store each turtle's setup clearly, draw or mark a finish line, and use a loop condition tied to turtle position rather than a fixed number of turns. The result should announce or visibly show the winner.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Race-Starter/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Turtle-Race-Starter/solution"
				},
				{
					title: "GrS5 Supplemental Project 5: Reassignment and While Loops Recap",
					content:
						"Answer short review questions about reassignment, counters, and `while` loops, then trace one loop by hand before running it. The recap should identify the starting value, the condition, the update step, and the reason the loop eventually stops.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reassignment-and-While-Loops-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reassignment-and-While-Loops-Recap/solution"
				}
			]
		},
		{
			title: "GrS6 Nested Loops Part 1",
			curriculum: [
				{
					title: "GrS6 Project 1: Nested Loops Exploration",
					content:
						"Learn what nested loops are by drawing repeated squares with changing sizes and identifying what repeats inside the outer pattern versus inside each shape.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Nested-Loops-Exploration/solution"
				},
				{
					title: "GrS6 Project 2: Square Inception",
					content:
						"Use multiple layers of repetition to draw groups of squares and practice placing code in the correct loop so each action runs the right number of times.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Square-Inception/solution"
				},
				{
					title: "GrS6 Project 3: Open Ended Project - Nested Loop Pattern",
					content:
						"Create an original pattern that clearly uses nested loops to build a repeated visual structure. The outer loop should control where or how many groups appear, and the inner loop should control the repeated shape within each group. Include comments naming the outer-loop job and inner-loop job so the nesting is understandable from the code."
				}
			],
			supplementalProjects: [
				{
					title: "GrS6 Supplemental Project 1: Pyramid",
					content:
						"Draw a triangle pyramid that grows a little larger each time. Use one loop to repeat the triangle and a changing size or position value to make the growth rule visible. The final pyramid should have aligned layers rather than a cluster of unrelated triangles.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Pyramid/solution"
				},
				{
					title: "GrS6 Supplemental Project 2: Reverse Pyramid",
					content:
						"Reverse the pyramid order and fill each triangle with a random color. Keep the same pyramid idea, but change the loop values so the largest or smallest triangle appears first as required. Store random colors cleanly and verify that fill blocks start and end around exactly one triangle at a time.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Reverse-Pyramid/solution"
				},
				{
					title: "GrS6 Supplemental Project 3: Reverse Square Inception",
					content:
						"Draw the largest square first in each quadrant and fill each square with a random color. Use nested loops to manage the repeated squares and the repeated quadrant positions separately. The finished image should make the reversal obvious: each quadrant begins with the largest square and builds inward.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Reverse-Square-Inception/solution"
				},
				{
					title: "GrS6 Supplemental Project 4: Rainbow Flower",
					content:
						"Combine nested loops and gradual color changes to create a multicolored flower pattern. One loop should repeat the petal or circle shape, and another should rotate or reposition the group to build the flower. Use controlled changes to color values so the rainbow effect follows the structure of the drawing instead of appearing random.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Rainbow-Flower/solution"
				},
				{
					title: "GrS6 Supplemental Project 5: Circle of Circles",
					content:
						"Build a larger circular pattern from many smaller circles. Use a loop to draw each small circle, then rotate or move by a consistent amount before drawing the next one. Verify that the repeated circles form one intentional overall shape instead of drifting away from the center.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS5-Circle-of-Circles/solution"
				},
				{
					title: "GrS6 Supplemental Project 6: Spirals",
					content:
						"Draw many randomly sized, colored, and positioned spiral shapes across the screen. Use one loop or helper pattern to create a single spiral, then another loop to repeat that spiral at different locations. Keep the random ranges controlled so the screen looks intentionally filled rather than cluttered by shapes outside the visible area.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS3-Spirals/solution"
				}
			]
		},
		{
			title: "GrS7 Functions Part 1",
			curriculum: [
				{
					title: "GrS7 Project 1: Build a Neighborhood",
					content:
						"Discover why functions are useful by drawing several houses in a neighborhood. First notice which commands repeat for every house, such as drawing the body, roof, door, or windows. Then move that repeated code into a reusable `drawHouse()` function and call it at different positions or sizes. The final code should make it easier to add another house without duplicating the entire drawing sequence.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS6-Build-a-Neighborhood/solution"
				},
				{
					title: "GrS7 Project 2: Basic Functions",
					content:
						"Write helper functions for common Turtle actions such as moving to a random location, choosing a random color, and resetting the canvas. Practice the difference between defining a function and calling it.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Basic-Functions/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS7 Supplemental Project 1: Open Ended Project - Make Your Own Function",
					content:
						"Design and write an original function of at least 10 lines that creates a meaningful Turtle behavior or drawing. Give the function a descriptive name, keep all repeated steps inside the function body, and call it more than once so the reuse is visible. The final program should make it clear why a function is better than copying the same drawing commands repeatedly."
				},
				{
					title: "GrS7 Supplemental Project 2: Randomly Random Shapes",
					content:
						"Define a function that draws a random polygon, then call it repeatedly with random positions and colors. Keep the random side count, size, position, and color choices readable by storing them in variables before drawing. The result should demonstrate both function reuse and controlled randomness.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/blob/main/Randomly-Random-Shapes-Updated/solution/main.py"
				},
				{
					title: "GrS7 Supplemental Project 3: Functions Recap",
					content:
						"Answer short review questions about function definitions, calls, and reusable code, then write a tiny example showing a function definition and two separate calls. The recap should distinguish between code that creates a function and code that actually runs it.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Functions-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Functions-Recap/solution"
				}
			]
		},
		{
			title: "GrS8 Event Listeners",
			curriculum: [
				{
					title: "GrS8 Project 1: Event Listener Discovery",
					content:
						"Learn what event listeners are by connecting key presses to functions. Define small movement or drawing functions, bind them to keys with `screen.onkey()`, and enable keyboard input with `screen.listen()`. Test one key at a time and keep each callback focused on one action so it is clear which function runs when a key is pressed.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Event-Listener-Discovery/solution"
				},
				{
					title: "GrS8 Project 2: Etch A Sketch",
					content:
						"Use four event listeners to move and turn the turtle, turning the canvas into a simple interactive drawing toy. Each key should call a named function, and the screen should listen continuously for input. Test every direction key and verify that the turtle responds immediately without needing to rerun the program.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Etch-A-Sketch/solution"
				},
				{
					title: "GrS8 Project 3: Picasso Game",
					content:
						"Use key presses to draw different shapes and create more surprising patterns through interactive input. Map each key to a clear drawing function, and include at least one key that changes color, position, or size before drawing. The project should feel like a small interactive art tool rather than a fixed drawing.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Picasso-Game/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS8 Supplemental Project 1: Polka Dot Game",
					content:
						"Move and turn the turtle with arrow keys, then press space to stamp circles with random sizes and colors. Separate movement functions from the stamping function so each key has one clear responsibility. Verify that repeated spacebar presses create different dots without breaking movement controls.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS9-Polka-Dots/solution"
				},
				{
					title: "GrS8 Supplemental Project 2: Fruit Stand",
					content:
						"Bind number keys to drawing different fruit shapes. Each fruit should have its own function, and each function should draw enough detail to make the fruit recognizable. Test every number key, then add one shared helper such as move-to-random-location or choose-random-color if the fruit functions repeat setup code.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS8-Fruit-Stand/solution"
				},
				{
					title: "GrS8 Supplemental Project 3: Open Ended Project - Interactive Drawing",
					content:
						"Create an interactive drawing that reveals different pieces only when certain keys are pressed in a chosen order. Plan the key map before coding, name each function after the part it reveals, and include at least one reset, clear, or surprise action. The finished program should be understandable from the controls as well as from the code.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS8-Picasso-Game/solution"
				},
				{
					title: "GrS8 Supplemental Project 4: Event Listener Recap",
					content:
						"Answer short review questions about event listeners, key bindings, and interactive program structure, then write one minimal example that connects a key press to a named function. The recap should identify the function being called, the key that triggers it, and the line that makes the screen listen for events.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Event-Listener-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Event-Listener-Recap/solution"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"Use this review to revisit advanced loops, functions, and event listeners. Focus on explaining not just how the code works, but why each structure is useful."
				},
				{
					title: "Check-In #2: Advanced Loops",
					content:
						"Use a changing `sideLength` variable inside loops, compare `for` loops and `while` loops, build nested loop drawings, and control when a value stops growing."
				},
				{
					title: "Check-In #2: Functions",
					content: `Review how functions organize code into named actions. A function definition stores a reusable set of instructions, and a function call runs those instructions at a specific moment in the program.

Start with simple helpers such as \`moveForward50()\`, then move to parameterized helpers such as \`drawSquare(sideLength)\`. A strong solution uses descriptive function names, calls each helper more than once, and changes the argument values to prove that the function is reusable rather than copied code.`
				},
				{
					title: "Check-In #2: Event Listeners",
					content:
						"Create a screen, connect keys to functions, and use keyboard input to move the turtle or draw shapes. Finish by enabling the screen to listen for those events."
				},
				{
					title: "Check-In #2 Reflection",
					content: `Reflect on the course so far by naming one idea that feels stronger now, one idea that still needs practice, and one debugging strategy that helped when a program did not behave as expected.

The reflection should be specific. Instead of saying "loops are easier," explain what changed: predicting loop counts, tracking a variable as it changes, reading console errors, testing one function at a time, or using comments to plan a drawing before coding it.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/solution"
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Build an event-driven drawing program where different keys move the turtle to random locations or draw layered diamonds, pyramids, and circles in changing colors.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Check-in-Two-Additional-Practice-ProjectUpdated/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "GrS9 Functions Part 2",
			curriculum: [
				{
					title: "GrS9 Project 1: Build a Snowman",
					content:
						"See why function parameters matter by first writing several similar circle-drawing functions, then simplifying them into one reusable function that accepts size as an input.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS8-Build-a-Snowman/solution"
				},
				{
					title: "GrS9 Project 2: More Functions",
					content: `Create reusable shape functions, then use parameter values to control the finished drawing. Write \`drawSquare(sideLength)\` and \`drawTriangle(sideLength)\` so the same function can draw small, medium, and large versions of the shape.

After both functions work independently, call them repeatedly with different sizes, positions, or colors to build a pattern. Verify the design by changing one argument and checking that only the intended shape size changes, not the whole program structure.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS8-More-Functions/solution"
				},
				{
					title: "GrS9 Project 3: Polka Dots",
					content: `Build an interactive drawing that reacts to mouse clicks. Use \`screen.onclick()\` to connect the canvas to a function that receives the click coordinates, moves the turtle to that position, and draws a circle or dot.

The dot function should use parameters or random values for details such as size, color, or pen width. Test clicks near the center, edges, and corners of the canvas so the final program feels responsive and does not assume every click happens in one easy location.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/blob/main/GrS9-Polka-Dots/solution/main.py"
				},
				{
					title: "GrS9 Project 4: Click and Draw Rectangles",
					content: `Use mouse coordinates as input data for a drawing function. The click handler should receive \`x\` and \`y\`, then draw a rectangle whose width and height are based on the distance from a reference point such as the center of the screen.

Plan how negative coordinates should behave before coding. A strong version handles clicks in all four quadrants, labels or comments the coordinate logic, and verifies that the rectangle changes shape predictably when the click location changes.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS9-Click-and-Draw-Rectangle/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS9 Supplemental Project 1: Any Shape Staircase",
					content: `Write a general polygon helper, \`drawShape(sideLength, numSides)\`, and use it as the foundation for a staircase of shapes. The function should calculate the turn angle from the number of sides instead of hard-coding one shape.

Build the staircase by changing at least one value each step, such as side length, position, color, or number of sides. Completion means the code can draw several different polygons from the same helper and the staircase rule is visible from the loop structure.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Any-Shape-Staircase/solution"
				},
				{
					title: "GrS9 Supplemental Project 2: Debugging Functions",
					content: `Debug a function-based snowman program by reading one error at a time and connecting each error to the relevant function definition or function call.

Look for common function mistakes: calling a function before it exists, forgetting parentheses, passing the wrong number of arguments, changing a local variable that does not affect the rest of the program, or duplicating code that should be a helper. Keep a short note beside each fix explaining what changed and how the visible drawing proves the repair worked.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Debugging-Functions/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Debugging-Functions/solution"
				},
				{
					title: "GrS9 Supplemental Project 3: Pyramid with Functions",
					content: `Use a single \`drawTriangle(sideLength)\` helper to create a pyramid made from repeated triangles. The helper should only know how to draw one triangle; the surrounding loop should control placement, row changes, and size changes.

Before coding, decide how each row should differ from the previous one. The finished program should show that functions can separate "how to draw one piece" from "how to arrange many pieces."`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Pyramid-with-Functions/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Pyramid-with-Functions/solution"
				},
				{
					title: "GrS9 Supplemental Project 4: Square Inception with Functions",
					content: `Remake Square Inception with a helper function that accepts both size and color information: \`drawSquare(sideLength, r, g, b)\`.

The goal is to remove repeated square-drawing code while keeping the visual effect from the earlier project. Use a loop to call the helper with changing side lengths and RGB values, then verify that changing the loop rule changes the whole pattern without editing the helper body.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS7-Square-Inception-with-Functions/solution"
				},
				{
					title: "GrS9 Supplemental Project 5: Functions Part 2 Recap",
					content: `Create a short study guide for function parameters, reusable helpers, and click-driven programs. Include the difference between defining a function and calling it, why parameters make a function more flexible, and how event listeners pass information such as mouse coordinates into a callback function.

Finish with one small original example: a function with at least one parameter, two different calls using different arguments, and one sentence explaining why that is better than copying the same code twice.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Functions-2-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Functions-2-Recap/solution"
				}
			]
		},
		{
			title: "GrS10 Nested Loops Part 2",
			curriculum: [
				{
					title: "GrS10 Project 1: Rainbow Square Inception",
					content:
						"Extend earlier nested loop work by increasing the number of shapes, adjusting turn amounts, and gradually changing color values to create a rainbow effect.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Rainbow-Square-Inception/solution"
				},
				{
					title: "GrS10 Project 2: Snowflake",
					content:
						"Use nested loops to build a snowflake from repeated branches and side branches, then adjust branch lengths, counts, and pen settings to customize the design.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Snowflake/solution"
				},
				{
					title: "GrS10 Project 3: Winter Wonderland",
					content:
						"Turn a snowflake drawing into a reusable function with multiple parameters, then call it many times with random arguments to create a full winter scene.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS10-Winter-Wonderland/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS10 Supplemental Project 1: Spiral Staircase",
					content:
						"Draw a staircase pattern that spirals outward by combining movement, turns, and a changing step length. Keep the rule for changing the step size explicit in the loop, and verify that the final image shows a consistent outward spiral rather than disconnected line segments.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS6-Spiral-Staircase/solution"
				},
				{
					title: "GrS10 Supplemental Project 2: Dizzy Hexagon",
					content: `Draw a spiral made from 100 hexagons. Each repetition should draw one hexagon, rotate or move the turtle, then prepare for the next hexagon so the final image grows into a controlled spiral instead of stacking shapes on top of each other.

Use random colors to add variety, but keep the movement rule deterministic enough to debug. If the drawing looks messy, test with fewer hexagons first, confirm one hexagon is correct, then increase the loop count gradually.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS6-Dizzy-Hexagon/solution"
				},
				{
					title: "GrS10 Supplemental Project 3: Dot Grid",
					content: `Use nested loops to generate a dot grid with configurable rows, columns, and spacing. The outer loop should control rows, while the inner loop should draw dots across a row.

Store the row count, column count, dot size, and spacing in variables near the top of the program. Completion means those variables can be changed to create a wider, taller, denser, or more spread-out grid without rewriting the loop logic.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS6-Dot-Grid/solution"
				}
			]
		},
		{
			title: "GrS11 Conditionals Part 2",
			curriculum: [
				{
					title: "GrS11 Project 1: Advanced Conditionals Exploration",
					content:
						"Learn how `elif` and `else` connect to an `if` statement and use them to handle several mutually exclusive outcomes cleanly.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS11-Advanced-Conditionals-Exploration/solution"
				},
				{
					title: "GrS11 Project 2: Random Age",
					content:
						"Generate a random age, group it into named age ranges with `if`/`elif`/`else`, and display the result with Turtle writing commands.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Random-Age/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS11 Supplemental Project 1: Turtle Launch",
					content: `Create a launch simulation where a turtle travels toward a target moon. Use a random or chosen launch distance, then compare the turtle's final position to the target zone with conditionals.

The program should clearly distinguish at least three outcomes: undershoot, successful landing, and overshoot. Use color, text, or turtle position to show the result, and test boundary values close to the target so the conditional ranges are not accidentally overlapping or leaving gaps.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS9-Turtle-Launch/solution"
				},
				{
					title: "GrS11 Supplemental Project 2: Bullseye with Nested Loops",
					content: `Draw a bullseye target using a loop and the modulo operator. Each ring should be drawn from the same repeated structure, while the ring size and color change from one iteration to the next.

Use \`i % 2\` or a similar expression to alternate colors predictably. Verify the pattern by changing the number of rings and checking that the alternating rule still works for both even and odd totals.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS9-Bullseye-with-Nested-Loops/solution"
				},
				{
					title: "GrS11 Supplemental Project 3: Advanced Conditionals Recap",
					content: `Create a recap for advanced conditionals. Explain when to use separate \`if\` statements, when to use an \`if\`/\`elif\`/\`else\` chain, and why the order of conditions matters when ranges overlap.

Include one original example with at least three possible outcomes. A strong recap identifies the exact condition for each branch and describes what should happen at boundary values such as the smallest accepted value, largest accepted value, and values just outside the intended range.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS11Advanced-Conditionals-Recap-Template/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GRS11Advanced-Conditionals-Recap-Template/solution"
				}
			]
		},
		{
			title: "GrS12 Lists",
			curriculum: [
				{
					title: "GrS12 Project 1: List Exploration",
					content:
						"Create empty lists, append values, loop through list items, and check whether a value is present with the `in` operator.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-List-Exploration/solution"
				},
				{
					title: "GrS12 Project 2: Which Way Turtles",
					content:
						"Store multiple turtles in a list and iterate through that list so each turtle can be positioned and moved using the same loop.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Which-Way-Turtles/solution"
				},
				{
					title: "GrS12 Project 3: Random Number Lists",
					content:
						"Build lists of random numbers, iterate through them, and use the stored data to display multiple lines of output based on those values.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Random-Number-Lists/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS12 Supplemental Project 1: Turtle Launch with Lists",
					content: `Upgrade Turtle Launch so several turtles can launch in one simulation. Store the turtle objects in a list, then iterate through the list so every turtle receives the same launch process while still getting its own random distance or result.

The list should remove repeated launch code. Completion means adding another turtle only requires adding it to the list, not copying the entire movement and conditional section again.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Turtle-Launch-with-Lists/solution"
				},
				{
					title: "GrS12 Supplemental Project 2: Rainbow Path",
					content:
						"Store color strings in a list and iterate through them to create a path with changing colors and random turns.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Rainbow-Path/solution"
				},
				{
					title: "GrS12 Supplemental Project 3: Debugging Lists",
					content:
						"Fix a buggy list-based program by reading console errors and matching the repaired behavior to the stated goals in the comments.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Debugging-Lists/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Debugging-Lists/solution"
				},
				{
					title: "GrS12 Supplemental Project 4: Lists Recap",
					content: `Create a recap for list creation, iteration, indexing, and membership checks. Include examples of an empty list, a list with starting values, \`.append()\`, a \`for item in list\` loop, a direct index lookup, and an \`in\` check.

For each example, explain what kind of problem it solves. The recap should make clear when a list is useful: storing related values together, applying the same command to many items, or checking whether a collection contains a value.`,
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Lists-Recap/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS12-Lists-Recap/solution"
				}
			]
		},
		{
			title: "GrS13 Game Mechanics",
			curriculum: [
				{
					title: "GrS13 Project 1: Perpetual Motion",
					content:
						"Use `while True` loops to create continuous movement and pair that loop with event listeners that let the player turn the turtle in real time.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS13-Perpetual-Motion/solution"
				},
				{
					title: "GrS13 Project 2: Stay Inbounds",
					content:
						"Draw a boundary, monitor a turtle's coordinates, and use a conditional plus `break` to end the game when the turtle leaves the allowed area.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS13-Stay-Inbounds/solution"
				},
				{
					title: "GrS13 Project 3: Fluid Motion",
					content: `Use \`screen.tracer(0)\` and \`screen.update()\` to control when the Turtle screen redraws. This makes animations smoother because the program can move objects first and then update the screen once per frame.

Build a small animation loop that moves one or more turtles, calls \`screen.update()\`, and pauses briefly if needed. Compare the result with and without manual screen updates so the reason for the pattern is visible, not just memorized.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Python-Level-1-ScreenUpdate/solution"
				},
				{
					title: "GrS13 Project 4: Bouncy Ball Room",
					content:
						"Create many moving turtles inside a boundary box, store them in a list, and write a collision helper that turns them around when they hit the walls.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS13-Bouncy-Ball-Room/solution"
				},
				{
					title: "GrS13 Project 5: Turtle Collision",
					content: `Detect collisions by comparing two turtles' positions. Use absolute value or distance calculations to decide when their x and y coordinates are close enough to count as a hitbox overlap.

Start with two turtles and print or display a message when they collide. Then test boundary cases: barely touching, almost touching, clearly overlapping, and far apart. A reliable collision check should behave consistently before it is added to a larger game.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Turtle-Collision/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS13 Supplemental Project 1: Light the Stars",
					content: `Create a timed sky scene where the player controls a turtle and lights stars before time runs out. The game should combine keyboard movement, a list of star objects or positions, collision checks, and a visible timer or changing background state.

Keep the game state explicit: which stars are still unlit, how time is represented, and what condition ends the game. Test both outcomes, winning by lighting enough stars and losing when time expires.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Light-the-Stars/solution"
				},
				{
					title: "GrS13 Supplemental Project 2: Dodgeball",
					content: `Turn Bouncy Ball Room into a dodgeball game. Keep the bouncing-object logic, then add a player turtle, keyboard controls, collision checks between the player and each ball, a lives counter, and a game-over state.

Build the game in layers: movement first, then bouncing balls, then player collision, then lives and ending behavior. This makes bugs easier to isolate because each mechanic can be tested before the next one is added.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Grs13-Dodgeball/solution"
				}
			]
		},
		{
			title: "Check-In #3",
			curriculum: [
				{
					title: "Check-In #3 Overview",
					content:
						"Use this module to review nested loops, game mechanics, advanced conditionals, and lists. Treat it as a progress snapshot and a chance to strengthen weaker topics."
				},
				{
					title: "Check-In #3: Nested Loops and Game Mechanics",
					content:
						"Review nested loops by drawing repeated shapes at random positions, then add screen updates and `while True` loops with counters or `break` conditions to simulate basic game behavior."
				},
				{
					title: "Check-In #3: Advanced Conditionals",
					content: `Compare \`elif\` and \`else\` by creating a program with several possible outcomes. Use ranges of random numbers to trigger different colors, messages, or movement rules.

The check-in should show that only one branch of an \`if\`/\`elif\`/\`else\` chain runs. Test the smallest and largest values in each range, then explain why a final \`else\` is useful for everything not matched earlier.`
				},
				{
					title: "Check-In #3: Lists",
					content:
						"Create empty lists, add multiple turtles to a list, and loop through that list to give each turtle the same command."
				},
				{
					title: "Check-In #3 Reflection",
					content:
						"Write or record a reflection about what has been most interesting, what still feels challenging, and how problem-solving has improved over time.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/Reflection-Template-Updated/solution"
				},
				{
					title: "Check-In #3: Additional Practice Project",
					content: `Create a simple target game with a spinning turtle, a randomly placed goal, and a spacebar-controlled launch mechanic. The player should wait for the turtle to face a useful direction, press space, and see whether the launch reaches the target.

Use conditionals or collision checks to decide whether the launch succeeds. Include a clear reset or replay path so the game can be tested several times without restarting the whole program.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS-Check-in-2-Practice-Project/solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "GrS14 Space Eater",
			curriculum: [
				{
					title: "GrS14 Project 1: Space Eater",
					content:
						"Bring together movement, lists, event listeners, collision logic, boundaries, scoring, and continuous loops to build a complete game where a player turtle eats moving targets.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Space-Eater/solution"
				}
			],
			supplementalProjects: [
				{
					title: "GrS14 Supplemental Project 1: Turtle Run",
					content: `Create a lane-based game where the player avoids moving enemies and collects targets for points. Organize the screen into lanes, decide how enemies move through those lanes, and give the player controls that feel predictable.

The game should track score, detect collisions with enemies, detect successful collection of targets, and define a clear win or loss condition. Test slow and fast enemy speeds so the game is challenging but still playable.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Turtle-Run/solution"
				},
				{
					title: "GrS14 Supplemental Project 2: Target Practice",
					content: `Build a turning-and-firing game where the player aims from the center of the screen. Keyboard controls should rotate the player, and a launch key should send a projectile or turtle forward toward a target.

Use coordinate checks, distance checks, or a target radius to decide whether the shot hits. Add feedback for hit and miss outcomes, then verify edge cases where the shot passes close to the target but should not count as a hit.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Target-Practice/solution"
				},
				{
					title: "GrS14 Supplemental Project 3: Pong",
					content: `Program a two-player version of Pong with two paddles, a moving ball, wall bounces, paddle collision, scoring, and a reset after each point.

Keep the ball state explicit: position, direction, speed, and what changes after a collision. Completion means both players can control their paddles, the ball bounces from the correct surfaces, missed balls update the score, and the game can continue after a point.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Pong/solution"
				},
				{
					title: "GrS14 Supplemental Project 4: Fidget Spinner",
					content: `Animate a fidget spinner whose turn speed changes based on keyboard input. Store the current speed in a variable, update that variable when keys are pressed, and use an animation loop to rotate the spinner.

The program should make the relationship between input and state clear: one key can speed up, another can slow down, and the spinner should eventually stop or slow toward a minimum speed if that rule is included. Test repeated key presses to make sure the speed does not jump unpredictably.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Fidget-Spinner/solution"
				},
				{
					title: "GrS14 Supplemental Project 5: Snake",
					content: `Create a Snake game using a list of turtle segments to represent the growing body. The head should move on a steady loop, food should appear at random positions, and the body list should grow when food is collected.

Track the game-over conditions explicitly: hitting a wall, colliding with the snake's own body, or any other rule chosen for the game. Test movement, food collection, body following, growth, wall collision, and self-collision separately before treating the full game as complete.`,
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/GrS14-Snake/solution"
				}
			]
		},
		{
			title: "GrS15 Master Project",
			curriculum: [
				{
					title: "Bonus Concepts",
					content:
						"Explore optional advanced ideas that can support custom games, including custom turtle shapes, global variables for shared state, and mouse dragging with `.ondrag()`."
				},
				{
					title: "GrS15 Project 1: Master Project",
					content:
						"Plan and build an original game that combines the major ideas from the course. Break the project into steps, prototype core mechanics first, and then add polish or bonus features."
				},
				{
					title: "Master Project Presentation",
					content:
						"Record or share a presentation that explains how the project works and highlights the Python and Turtle concepts used to build it."
				},
				{
					title: "GrS15 Project 2: End of Course Reflection",
					content:
						"Reflect on what concepts were learned, the most challenging and most rewarding parts of the course, and how skills have grown from the beginning to the end.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/End-of-Course-Reflection/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main/End-of-Course-Reflection/solution"
				}
			],
			supplementalProjects: []
		}
	]
};
