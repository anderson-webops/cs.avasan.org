import type { RawCourse } from "./types";

export const pythonLevel1Course: RawCourse = {
	name: "Python Level 1",
	modules: [
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this check-in as a guided review of Turtle basics, loops, variables, random numbers, and conditionals. Try each prompt independently first, then revisit any topics that need more practice.",
					solutionLink: "https://replit.com/@JuniLearning/Check-in-1"
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
						"Write or record a short reflection about favorite concepts, challenges, problem-solving strategies, and a moment of pride from the course so far.",
					projectLink:
						"https://replit.com/@JuniLearning/Reflection-Template-Updated"
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Create a zigzagging line with about 30 turns and extend it by connecting the zigzag to one or more original shapes.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS-Check-in-1-Additional-Practice-Project"
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
						"Use this review to revisit advanced loops, functions, and event listeners. Focus on explaining not just how the code works, but why each structure is useful."
				},
				{
					title: "Check-In #2: Advanced Loops",
					content:
						"Use a changing `sideLength` variable inside loops, compare `for` loops and `while` loops, build nested loop drawings, and control when a value stops growing."
				},
				{
					title: "Check-In #2: Functions",
					content:
						"Review function definitions, function calls, and parameters by creating reusable movement and drawing helpers such as `moveForward50()` and `drawSquare(sideLength)`."
				},
				{
					title: "Check-In #2: Event Listeners",
					content:
						"Create a screen, connect keys to functions, and use keyboard input to move the turtle or draw shapes. Finish by enabling the screen to listen for those events."
				},
				{
					title: "Check-In #2 Reflection",
					content:
						"Reflect on favorite ideas, obstacles, strategies for improving, and progress made since the beginning of the course.",
					projectLink:
						"https://replit.com/@JuniLearning/Reflection-Template-Updated"
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Build an event-driven drawing program where different keys move the turtle to random locations or draw layered diamonds, pyramids, and circles in changing colors.",
					solutionLink:
						"https://replit.com/@JuniLearning/Check-in-Two-Additional-Practice-ProjectUpdated"
				}
			],
			supplementalProjects: []
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
					content:
						"Compare `elif` and `else`, then use ranges of random numbers to trigger different colors and outcomes."
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
						"https://replit.com/@JuniLearning/Reflection-Template-Updated"
				},
				{
					title: "Check-In #3: Additional Practice Project",
					content:
						"Create a simple target game with a spinning turtle, a randomly placed goal, and a spacebar-controlled launch mechanic.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS-Check-in-2-Practice-Project"
				}
			],
			supplementalProjects: []
		},
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
					solutionLink:
						"https://replit.com/@JuniLearning/GrS1-Turtle-Exporation-All-Star#main.py"
				}
			],
			supplementalProjects: [
				{
					title: "GrS1 Supplemental Project 1: Turtle Recap",
					content:
						"Answer short review questions about Python, Turtle setup, drawing commands, and debugging to create a personal study guide.",
					projectLink:
						"https://replit.com/@JuniLearning/Turtle-Recap-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/Turtle-Recap"
				},
				{
					title: "GrS1 Supplemental Project 2: Open Ended Project - Create a Drawing",
					content:
						"Create an original drawing using the movement, turning, coordinate, and color tools from the module."
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
						"https://replit.com/@JuniLearning/Basic-Shapes"
				},
				{
					title: "GrS2 Project 2: Smiley Face",
					content:
						"Combine loops, shape planning, colors, and background changes to draw a smiley face with features such as rectangular eyes and a curved mouth.",
					solutionLink: "https://replit.com/@JuniLearning/Smiley-Face"
				},
				{
					title: "GrS2 Project 3: Open Ended Project - Drawing with Loops",
					content:
						"Create an original drawing that uses loops intentionally, such as flowers, landscapes, symbols, or name art."
				}
			],
			supplementalProjects: [
				{
					title: "GrS2 Supplemental Project 1: More Shapes",
					content:
						"Draw a magenta hexagon, a purple decagon, and a teal star on different parts of a black screen.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS2-More-Shapes"
				},
				{
					title: "GrS2 Supplemental Project 2: Bullseye",
					content:
						"Draw a target made of alternating red and white circles.",
					solutionLink: "https://repl.it/@JuniLearning/GrS2-Bullseye"
				},
				{
					title: "GrS2 Supplemental Project 3: Watermelon Slice",
					content:
						"Use loops and fills to draw a watermelon slice with rind, fruit, and seeds.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS2-Watermelon-Slice"
				},
				{
					title: "GrS2 Supplemental Project 4: Taxi",
					content:
						"Draw a taxi and experiment with thicker pen sizes for bolder outlines.",
					solutionLink: "https://repl.it/@JuniLearning/GrS2-Taxi"
				},
				{
					title: "GrS2 Supplemental Project 5: Captain America Shield",
					content:
						"Use concentric circles and a centered star to build a layered shield design.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS2-Captain-America-Shield"
				},
				{
					title: "GrS2 Supplemental Project 6: Minion",
					content:
						"Combine many loop-based drawing ideas to create a more complex character illustration.",
					solutionLink: "https://repl.it/@JuniLearning/GrS2-Minion"
				},
				{
					title: "GrS2 Supplemental Project 7: Loops Recap",
					content:
						"Answer short review questions about loops and shape-building techniques to create a study guide for the module.",
					projectLink:
						"https://replit.com/@JuniLearning/Loops-Recap-Template",
					solutionLink: "https://replit.com/@JuniLearning/Loops-Recap"
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
						"https://replit.com/@JuniLearning/GrS3-Awesome-Angles"
				},
				{
					title: "GrS3 Project 2: Surprise Me Square",
					content:
						"Replace hardcoded coordinates, side lengths, and RGB values with variables, then use `random.randint()` to generate random locations, sizes, and colors for a square.",
					solutionLink:
						"https://replit.com/@JuniLearning/Surprise-Me-Square"
				},
				{
					title: "GrS3 Project 3: Random Walk",
					content:
						"Combine loops with random movement to simulate a random walk. Customize the turtle shape and pen size while practicing readable variable names.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS3-Random-Walk#main.py"
				}
			],
			supplementalProjects: [
				{
					title: "GrS3 Supplemental Project 1: Random Bowtie",
					content:
						"Draw a bowtie with random colors for each half and a randomly chosen background color.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS3-Random-Bowtie"
				},
				{
					title: "GrS3 Supplemental Project 2: Debugging Practice",
					content:
						"Read console errors and fix a buggy Turtle program step by step until it runs as intended.",
					projectLink:
						"https://repl.it/@JuniLearning/GrS3-Debugging-Practice",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS3-Debugging-Practice-Solution"
				},
				{
					title: "GrS3 Supplemental Project 3: Variables and Random Numbers Recap",
					content:
						"Answer short review questions about variables, random numbers, and data types to summarize the module.",
					projectLink:
						"https://replit.com/@JuniLearning/Variables-and-Random-Numbers-Recap-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/Variables-and-Random-Numbers-Recap"
				},
				{
					title: "GrS3 Supplemental Project 4: Open Ended Project - Haphazard Artwork",
					content:
						"Use loops and random values together to create an abstract artwork with random colors, positions, and shapes."
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
						"https://replit.com/@JuniLearning/GrS4-Surprise-Shape"
				},
				{
					title: "GrS4 Project 2: Find Your Turtle",
					content:
						"Use the coordinate plane, comparison operators, `and`, `or`, `xcor()`, and `ycor()` to detect where a turtle is and react differently in different regions of the canvas.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS4-Find-Your-Turtle"
				}
			],
			supplementalProjects: [
				{
					title: "GrS4 Supplemental Project 1: Navigating the Coordinate Plane",
					content:
						"Strengthen coordinate plane skills through targeted coordinate questions and movement practice.",
					projectLink:
						"https://replit.com/@JuniLearning/GrS4-Navigating-the-Coordinate-Plane-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS4-Navigating-the-Coordinate-Plane"
				},
				{
					title: "GrS4 Supplemental Project 2: Open Ended Project - Boolean Bonanza",
					content:
						"Create an original Turtle game that uses random numbers, booleans, and conditionals to produce different outcomes."
				},
				{
					title: "GrS4 Supplemental Project 3: Conditionals and Booleans Recap",
					content:
						"Answer short review questions about booleans, comparison operators, and conditionals.",
					projectLink:
						"https://replit.com/@JuniLearning/Conditionals-and-Booleans-Recap-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/Conditionals-and-Booleans-Recap"
				}
			]
		},
		{
			title: "GrS5 Loops with Variables",
			curriculum: [
				{
					title: "GrS5 Project 1: Fireworks",
					content:
						"Combine loops with reassignment so a value changes on every repetition. Use a `lineLength` variable that grows over time to create an expanding fireworks pattern.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS5-Fireworks"
				},
				{
					title: "GrS5 Project 2: While Loops Exploration",
					content:
						"Compare `while` loops with `for` loops, build loops that stop based on coordinates, and use `write()`, `clear()`, and coordinate checks to animate a turtle moving toward a stop sign.",
					solutionLink:
						"https://replit.com/@JuniLearning/While-Loops-Exploration"
				},
				{
					title: "GrS5 Project 3: Square Spiral",
					content:
						"Use a counter-controlled `while` loop plus a changing line length to create a square spiral with gradually changing properties.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS5-Square-Spiral"
				}
			],
			supplementalProjects: [
				{
					title: "GrS5 Supplemental Project 1: Rainbow Ninja Star",
					content:
						"Draw a ninja star pattern that starts from the center and gradually shifts through color values.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS5-Rainbow-Ninja-Star"
				},
				{
					title: "GrS5 Supplemental Project 2: Into the Void",
					content: "Draw a growing sequence of rotated squares.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS5-Into-the-Void"
				},
				{
					title: "GrS5 Supplemental Project 3: Out of the Void",
					content:
						"Create a spiral triangle pattern and experiment with negative movement values.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS5-Out-of-the-Void"
				},
				{
					title: "GrS5 Supplemental Project 4: Turtle Race",
					content:
						"Simulate a race between three turtles that move forward by random amounts until one crosses the finish line.",
					projectLink:
						"https://replit.com/@JuniLearning/Turtle-Race-Starter",
					solutionLink:
						"https://replit.com/@JuniLearning/Turtle-Race-Updated#main.py"
				},
				{
					title: "GrS5 Supplemental Project 5: Reassignment and While Loops Recap",
					content:
						"Answer short review questions about reassignment, counters, and `while` loops.",
					projectLink:
						"https://replit.com/@JuniLearning/Reassignment-and-While-Loops-Recap-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/Reassignment-and-While-Loops-Recap"
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
						"https://replit.com/@JuniLearning/Nested-Loops-Exploration"
				},
				{
					title: "GrS6 Project 2: Square Inception",
					content:
						"Use multiple layers of repetition to draw groups of squares and practice placing code in the correct loop so each action runs the right number of times.",
					solutionLink:
						"https://replit.com/@JuniLearning/Square-Inception"
				},
				{
					title: "GrS6 Project 3: Open Ended Project - Nested Loop Pattern",
					content:
						"Create an original pattern that clearly uses nested loops to build a repeated visual structure."
				}
			],
			supplementalProjects: [
				{
					title: "GrS6 Supplemental Project 1: Pyramid",
					content:
						"Draw a triangle pyramid that grows a little larger each time.",
					solutionLink: "https://repl.it/@JuniLearning/GrS5-Pyramid"
				},
				{
					title: "GrS6 Supplemental Project 2: Reverse Pyramid",
					content:
						"Reverse the pyramid order and fill each triangle with a random color.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS5-Reverse-Pyramid"
				},
				{
					title: "GrS6 Supplemental Project 3: Reverse Square Inception",
					content:
						"Draw the largest square first in each quadrant and fill each square with a random color.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS5-Reverse-Square-Inception"
				},
				{
					title: "GrS6 Supplemental Project 4: Rainbow Flower",
					content:
						"Combine nested loops and gradual color changes to create a multicolored flower pattern.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS5-Rainbow-Flower"
				},
				{
					title: "GrS6 Supplemental Project 5: Circle of Circles",
					content:
						"Build a larger circular pattern from many smaller circles.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS5-Circle-of-Circles"
				},
				{
					title: "GrS6 Supplemental Project 6: Spirals",
					content:
						"Draw many randomly sized, colored, and positioned spiral shapes across the screen.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS3-Spirals"
				}
			]
		},
		{
			title: "GrS7 Functions Part 1",
			curriculum: [
				{
					title: "GrS7 Project 1: Build a Neighborhood",
					content:
						"Discover why functions are useful by drawing several houses, then replacing repeated code with a reusable `drawHouse()` function.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS6-Build-a-Neighborhood"
				},
				{
					title: "GrS7 Project 2: Basic Functions",
					content:
						"Write helper functions for common Turtle actions such as moving to a random location, choosing a random color, and resetting the canvas. Practice the difference between defining a function and calling it.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS7-Basic-Functions"
				}
			],
			supplementalProjects: [
				{
					title: "GrS7 Supplemental Project 1: Open Ended Project - Make Your Own Function",
					content:
						"Design and write an original function of at least 10 lines that creates a meaningful Turtle behavior or drawing."
				},
				{
					title: "GrS7 Supplemental Project 2: Randomly Random Shapes",
					content:
						"Define a function that draws a random polygon, then call it repeatedly with random positions and colors.",
					solutionLink:
						"https://replit.com/@JuniLearning/Randomly-Random-Shapes-Updated#main.py"
				},
				{
					title: "GrS7 Supplemental Project 3: Functions Recap",
					content:
						"Answer short review questions about function definitions, calls, and reusable code.",
					projectLink:
						"https://replit.com/@JuniLearning/Functions-Recap-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/Functions-Recap"
				}
			]
		},
		{
			title: "GrS8 Event Listeners",
			curriculum: [
				{
					title: "GrS8 Project 1: Event Listener Discovery",
					content:
						"Learn what event listeners are by connecting key presses to functions with `screen.onkey()` and enabling them with `screen.listen()`.",
					solutionLink:
						"https://replit.com/@JuniLearning/Event-Listener-Discovery"
				},
				{
					title: "GrS8 Project 2: Etch A Sketch",
					content:
						"Use four event listeners to move and turn the turtle, turning the canvas into a simple interactive drawing toy.",
					solutionLink:
						"https://replit.com/@JuniLearning/Etch-A-Sketch"
				},
				{
					title: "GrS8 Project 3: Picasso Game",
					content:
						"Use key presses to draw different shapes and create more surprising patterns through interactive input.",
					solutionLink:
						"https://replit.com/@JuniLearning/Picasso-Game"
				}
			],
			supplementalProjects: [
				{
					title: "GrS8 Supplemental Project 1: Polka Dot Game",
					content:
						"Move and turn the turtle with arrow keys, then press space to stamp circles with random sizes and colors.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS8-Polka-Dot-Game"
				},
				{
					title: "GrS8 Supplemental Project 2: Fruit Stand",
					content:
						"Bind number keys to drawing different fruit shapes.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS8-Fruit-Stand"
				},
				{
					title: "GrS8 Supplemental Project 3: Open Ended Project - Interactive Drawing",
					content:
						"Create an interactive drawing that reveals different pieces only when certain keys are pressed in a chosen order.",
					solutionLink:
						"https://replit.com/@JuniParties/Event-Listener-Open-Ended#main.py"
				},
				{
					title: "GrS8 Supplemental Project 4: Event Listener Recap",
					content:
						"Answer short review questions about event listeners, key bindings, and interactive program structure.",
					projectLink:
						"https://replit.com/@JuniLearning/Event-Listener-Recap-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/Event-Listener-Recap"
				}
			]
		},
		{
			title: "GrS9 Functions Part 2",
			curriculum: [
				{
					title: "GrS9 Project 1: Build a Snowman",
					content:
						"See why function parameters matter by first writing several similar circle-drawing functions, then simplifying them into one reusable function that accepts size as an input.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS8-Build-a-Snowman"
				},
				{
					title: "GrS9 Project 2: More Functions",
					content:
						"Write `drawSquare(sideLength)` and `drawTriangle(sideLength)` and call them repeatedly with changing arguments to build patterns from many shapes.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS8-More-Functions"
				},
				{
					title: "GrS9 Project 3: Polka Dots",
					content:
						"Combine `screen.onclick()` with functions and parameters so mouse clicks place colorful random circles on the canvas.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS9-Polka-Dots#main.py"
				},
				{
					title: "GrS9 Project 4: Click and Draw Rectangles",
					content:
						"Use mouse coordinates as parameters to draw rectangles from the center of the screen to the clicked point.",
					solutionLink:
						"https://replit.com/@JuniLearning/Click-and-Draw-Rectangle"
				}
			],
			supplementalProjects: [
				{
					title: "GrS9 Supplemental Project 1: Any Shape Staircase",
					content:
						"Write `drawShape(sideLength, numSides)` and use it to build a staircase from polygons with changing sizes and side counts.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS7-Any-Shape-Staircase"
				},
				{
					title: "GrS9 Supplemental Project 2: Debugging Functions",
					content:
						"Fix a buggy snowman project by tracing function-related errors and correcting how functions are defined and used.",
					projectLink:
						"https://repl.it/@JuniLearning/GrS7-Debugging-Functions",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS7-Debugging-Functions-Solution"
				},
				{
					title: "GrS9 Supplemental Project 3: Pyramid with Functions",
					content:
						"Write `drawTriangle(sideLength)` and call it many times with larger inputs to create a pyramid.",
					projectLink:
						"https://repl.it/@JuniLearning/GrS7-Pyramid-with-Functions?skipMigration=1"
				},
				{
					title: "GrS9 Supplemental Project 4: Square Inception with Functions",
					content:
						"Remake Square Inception using a `drawSquare(sideLength, r, g, b)` helper function.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS7-Square-Inception-with-Functions?skipMigration=1"
				},
				{
					title: "GrS9 Supplemental Project 5: Functions Part 2 Recap",
					content:
						"Answer short review questions about parameters, reusable functions, and click-driven programs.",
					projectLink:
						"https://replit.com/@JuniLearning/Functions-2-Recap-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/Functions-2-Recap"
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
						"https://replit.com/@JuniLearning/Rainbow-Square-Inception"
				},
				{
					title: "GrS10 Project 2: Snowflake",
					content:
						"Use nested loops to build a snowflake from repeated branches and side branches, then adjust branch lengths, counts, and pen settings to customize the design.",
					solutionLink: "https://replit.com/@JuniLearning/Snowflake"
				},
				{
					title: "GrS10 Project 3: Winter Wonderland",
					content:
						"Turn a snowflake drawing into a reusable function with multiple parameters, then call it many times with random arguments to create a full winter scene.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS10-Winter-Wonderland"
				}
			],
			supplementalProjects: [
				{
					title: "GrS10 Supplemental Project 1: Spiral Staircase",
					content: "Draw a staircase pattern that spirals outward.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS6-Spiral-Staircase"
				},
				{
					title: "GrS10 Supplemental Project 2: Dizzy Hexagon",
					content:
						"Draw 100 hexagons in a spiral layout with random colors.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS6-Dizzy-Hexagon"
				},
				{
					title: "GrS10 Supplemental Project 3: Dot Grid",
					content:
						"Use variables and nested loops to generate a grid of dots with configurable rows, columns, and spacing.",
					solutionLink: "https://repl.it/@JuniLearning/GrS6-Dot-Grid"
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
						"https://replit.com/@JuniLearning/Advanced-Conditionals-Exploration"
				},
				{
					title: "GrS11 Project 2: Random Age",
					content:
						"Generate a random age, group it into named age ranges with `if`/`elif`/`else`, and display the result with Turtle writing commands.",
					solutionLink: "https://replit.com/@JuniLearning/Random-Age"
				}
			],
			supplementalProjects: [
				{
					title: "GrS11 Supplemental Project 1: Turtle Launch",
					content:
						"Create a launch simulation where a turtle shoots toward the moon and changes color if it overshoots the target.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS9-Turtle-Launch"
				},
				{
					title: "GrS11 Supplemental Project 2: Bullseye with Nested Loops",
					content:
						"Draw a target using one outer loop and the modulo operator to alternate colors.",
					solutionLink:
						"https://repl.it/@JuniLearning/GrS9-Bullseye-with-Nested-Loops"
				},
				{
					title: "GrS11 Supplemental Project 3: Advanced Conditionals Recap",
					content:
						"Answer short review questions about `if`, `elif`, `else`, and more complex conditional logic.",
					projectLink:
						"https://replit.com/@JuniLearning/Advanced-Conditionals-Recap-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS11-Advanced-Conditionals-Recap"
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
						"https://replit.com/@JuniLearning/GrS12-List-Exploration"
				},
				{
					title: "GrS12 Project 2: Which Way Turtles",
					content:
						"Store multiple turtles in a list and iterate through that list so each turtle can be positioned and moved using the same loop.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS12-Which-Way-Turtles"
				},
				{
					title: "GrS12 Project 3: Random Number Lists",
					content:
						"Build lists of random numbers, iterate through them, and use the stored data to display multiple lines of output based on those values.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS12-Random-Number-Lists"
				}
			],
			supplementalProjects: [
				{
					title: "GrS12 Supplemental Project 1: Turtle Launch with Lists",
					content:
						"Store many turtles in a list and launch them toward the moon with independent random travel distances.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS12-Turtle-Launch-with-Lists"
				},
				{
					title: "GrS12 Supplemental Project 2: Rainbow Path",
					content:
						"Store color strings in a list and iterate through them to create a path with changing colors and random turns.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS12-Rainbow-Path"
				},
				{
					title: "GrS12 Supplemental Project 3: Debugging Lists",
					content:
						"Fix a buggy list-based program by reading console errors and matching the repaired behavior to the stated goals in the comments.",
					projectLink:
						"https://replit.com/@JuniLearning/GrS12-Debugging-Lists",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS12-Debugging-Lists-Solution"
				},
				{
					title: "GrS12 Supplemental Project 4: Lists Recap",
					content:
						"Answer short review questions about list creation, iteration, indexing, and membership checks.",
					projectLink:
						"https://replit.com/@JuniLearning/GrS12-Lists-Recap-Template",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS12-Lists-Recap"
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
						"https://replit.com/@JuniLearning/GrS13-Perpetual-Motion"
				},
				{
					title: "GrS13 Project 2: Stay Inbounds",
					content:
						"Draw a boundary, monitor a turtle's coordinates, and use a conditional plus `break` to end the game when the turtle leaves the allowed area.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS13-Stay-Inbounds"
				},
				{
					title: "GrS13 Project 3: Fluid Motion",
					content:
						"Learn how `screen.tracer(0)` and `screen.update()` control animation timing, and use them to make movement look smoother.",
					solutionLink:
						"https://replit.com/@JuniLearning/Python-Level-1-ScreenUpdate"
				},
				{
					title: "GrS13 Project 4: Bouncy Ball Room",
					content:
						"Create many moving turtles inside a boundary box, store them in a list, and write a collision helper that turns them around when they hit the walls.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS13-Bouncy-Ball-Room"
				},
				{
					title: "GrS13 Project 5: Turtle Collision",
					content:
						"Use absolute value and coordinate differences to detect when two moving turtles are close enough to count as colliding.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS14-Turtle-Collision?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "GrS13 Supplemental Project 1: Light the Stars",
					content:
						"Control a player turtle through a timed sky scene and light stars before the background fades too far.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS14-Light-the-Stars"
				},
				{
					title: "GrS13 Supplemental Project 2: Dodgeball",
					content:
						"Turn Bouncy Ball Room into a dodgeball game with player movement, lives, and a game-over state.",
					solutionLink:
						"https://replit.com/@JuniLearning/Grs13-Dodgeball"
				}
			]
		},
		{
			title: "GrS14 Space Eater",
			curriculum: [
				{
					title: "GrS14 Project 1: Space Eater",
					content:
						"Bring together movement, lists, event listeners, collision logic, boundaries, scoring, and continuous loops to build a complete game where a player turtle eats moving targets.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS14-Space-Eater"
				}
			],
			supplementalProjects: [
				{
					title: "GrS14 Supplemental Project 1: Turtle Run",
					content:
						"Create a lane-based game where the player avoids moving enemies and collects targets for points.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS14-Turtle-Run"
				},
				{
					title: "GrS14 Supplemental Project 2: Target Practice",
					content:
						"Build a turning-and-firing game where the player aims at a target from the center of the screen.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS14-Target-Practice"
				},
				{
					title: "GrS14 Supplemental Project 3: Pong",
					content:
						"Program a two-player version of Pong with paddles, a ball, and bounce logic.",
					solutionLink: "https://replit.com/@JuniLearning/GrS14-Pong"
				},
				{
					title: "GrS14 Supplemental Project 4: Fidget Spinner",
					content:
						"Animate a fidget spinner whose turn speed changes based on keyboard input.",
					solutionLink:
						"https://replit.com/@JuniLearning/GrS14-Fidget-Spinner"
				},
				{
					title: "GrS14 Supplemental Project 5: Snake",
					content:
						"Create a Snake game using a list of turtle segments to represent the growing body.",
					solutionLink: "https://replit.com/@JuniLearning/GrS14-Snake"
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
						"https://replit.com/@JuniLearning/End-of-Course-Reflection#main.py"
				}
			],
			supplementalProjects: []
		}
	]
};
