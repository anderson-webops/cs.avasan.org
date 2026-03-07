import type { RawCourse } from "./types";

export const javaLevel1Course: RawCourse = {
	name: "Java Level 1",
	modules: [
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this module as a low-pressure review of variables, strings, conditionals, and loops. Work through the prompts independently first, then revisit any ideas that need reinforcement.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS-Check-in-1?skipMigration=1"
				},
				{
					title: "Check-In #1: Variables and Strings",
					content:
						"Review primitive variable types such as `int`, `double`, and `boolean`, compare `System.out.print` with `System.out.println`, store and inspect strings, read user input, access characters with indexing, and measure string length."
				},
				{
					title: "Check-In #1: Conditionals",
					content:
						"Practice `if`, `else if`, and nested conditionals by checking guessed animals and colors. Use `&&`, `||`, and branching logic to distinguish exact matches, partial matches, and incorrect guesses."
				},
				{
					title: "Check-In #1: Loops",
					content:
						"Compare `for` loops and `while` loops, print number ranges in different directions and steps, and use nested loops to build a multiplication table while tracking how often the inner loop runs."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Ask the user for a row and column, then print a grid with `O` characters along that row and column and an `X` at the exact chosen coordinate.",
					projectLink:
						"https://repl.it/@JuniLearning/JS-Check-in-1-Additional-Project-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/JS-Check-in-1-Additional-Project?skipMigration=1"
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
						"Use this review to revisit math operators, randomness, methods, arrays, and two-dimensional arrays. Focus on explaining not just what the code does, but why each structure fits the problem.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS-Check-in-2?skipMigration=1"
				},
				{
					title: "Check-In #2: Mathematical Operators and Randomness",
					content:
						"Generate random integers and random letters, review ASCII, and practice using Java expressions to control ranges and convert between numbers and characters."
				},
				{
					title: "Check-In #2: Methods",
					content:
						"Define and call methods that take inputs and return results, including a sum method and a coin-flip simulation that uses random values and conditional logic."
				},
				{
					title: "Check-In #2: Arrays",
					content:
						"Create empty and pre-populated arrays, access specific elements, and use loops to fill arrays, print them, and update every element."
				},
				{
					title: "Check-In #2: Two-Dimensional Arrays",
					content:
						"Create and access a 2D array, inspect its row and column counts, set specific values, and use nested loops to print every element."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Fill an integer array with random values and write a method called `countNumElementsAboveFive()` that returns how many entries are greater than 5.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS-Check-in-2-Additional-Project?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "JS1 Variable Types & Input/Output",
			curriculum: [
				{
					title: "Introductions and Java Setup",
					content:
						"Get comfortable with the learner portal, the console, project instructions, and a custom reference project for reusable examples. Start by writing code inside `main()` and using the console to run and inspect output."
				},
				{
					title: "Primitive Types",
					content:
						"Learn the built-in Java types `int`, `double`, `char`, and `boolean`, and practice declaring variables, assigning values, printing them, and noticing Java syntax such as semicolons and single quotes for characters.",
					solutionLink: "https://repl.it/@JuniLearning/JS1-Primitives"
				},
				{
					title: "Strings",
					content:
						"Use `String` values, compare them with primitive types, and practice built-in string methods such as `length()`, `charAt()`, and `substring()`. Then combine strings with other values using concatenation."
				},
				{
					title: "Input and Output",
					content:
						"Import `Scanner`, create a scanner object, prompt the user with `System.out.print`, and store responses with methods such as `nextLine()`."
				},
				{
					title: "JS1 Project 1: Chatbot",
					content:
						"Create a chatbot that asks at least five questions, stores the user's answers, and prints customized responses using string concatenation and input handling.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS1-Chatbot?skipMigration=1"
				},
				{
					title: "JS1 Project 2: First Middle Last",
					content:
						"Ask the user for a word and print its first, middle, and last characters. As an optional extension, remove one of those characters using substring logic.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS1-First-Middle-Last?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "JS1 Supplemental Project 1: Mad Libs",
					content:
						"Ask the user for different parts of speech and print a completed Mad Lib story using their responses.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS1-Mad-Libs?skipMigration=1"
				},
				{
					title: "JS1 Supplemental Project 2: Division Facts",
					content:
						"Ask the user for two numbers, then compute the quotient and remainder without using the `%` operator.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS1-Division-Facts?skipMigration=1"
				}
			]
		},
		{
			title: "JS2 Casting and Operators",
			curriculum: [
				{
					title: "Casting",
					content:
						"Learn how casting changes the type the computer uses for a value. Compare automatic casting with explicit casts, especially when mixing `int` and `double` values in arithmetic.",
					projectLink:
						"https://replit.com/@JuniLearning/JS1-Casting-Reference"
				},
				{
					title: "Mathematical Operators",
					content:
						"Practice Java arithmetic with `+`, `-`, `*`, `/`, and `%`, and compare how order of operations and parentheses affect the result of expressions.",
					projectLink:
						"https://replit.com/@JuniLearning/JS2-Math-Operators-Reference#Main.java"
				},
				{
					title: "JS2 Project 1: Temperature Converter",
					content:
						"Read temperature input from the user, convert between Fahrenheit and Celsius, and use casting to produce more accurate results before rounding to whole numbers.",
					solutionLink:
						"https://replit.com/@JuniLearning/JS2-Temperature-Converter#src/main/java/Main.java"
				}
			],
			supplementalProjects: [
				{
					title: "JS2 Supplemental Project 1: Rainbow",
					content:
						"Use the graphics methods introduced in the optional BlueJ workflow to create a six-color rainbow.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS2-Rainbow?skipMigration=1"
				},
				{
					title: "JS2 Supplemental Project 2: Snowman",
					content:
						"Use graphics methods to draw and customize a snowman with extra features such as a scarf, arms, or snowflakes.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS2-Snowman?skipMigration=1"
				},
				{
					title: "Setting Up an Applet (Optional)",
					content:
						"Optionally set up BlueJ for graphics projects, create a class-based applet, compile it, and run it with a basic graphics template."
				},
				{
					title: "Basic Shapes (Optional)",
					content:
						"Use BlueJ graphics methods such as `fillRect`, `fillOval`, and `fillArc` with `setColor` to explore Java graphics coordinates, color, and shape sizing.",
					solutionLink:
						"https://static.junilearning.com/java1/js2-basic-shapes.java"
				},
				{
					title: "Happy Graphics (Optional)",
					content:
						"Use the same drawing methods to create a smiley face and a pair of Pac-Man characters.",
					solutionLink:
						"https://static.junilearning.com/java1/js2-happy-graphics.java"
				}
			]
		},
		{
			title: "JS3 Conditionals",
			curriculum: [
				{
					title: "Conditionals",
					content:
						"Practice `if`, `else if`, and `else`, along with comparison operators and logical operators such as `!`, `&&`, and `||`. Pay special attention to comparing strings with `.equals()` rather than `==`."
				},
				{
					title: "JS3 Project 1: Code Your Own Adventure",
					content:
						"Create a text-based choose-your-own-adventure game using nested conditionals to handle multiple user choices and branching outcomes.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS3-Code-Your-Own-Adventure?skipMigration=1"
				},
				{
					title: "JS3 Project 2: Color Mixer",
					content:
						"Ask the user for two primary colors, validate the input, and use conditional logic to determine the resulting mixed color or print an error if the input is invalid.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS3-Color-Mixer?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental Graphics Project: Which Shape? (Optional)",
					content:
						"Use a string and conditionals in a BlueJ graphics project to decide whether to draw a circle, square, Pac-Man, or another shape.",
					solutionLink:
						"https://static.junilearning.com/java1/js3-which-shape.java"
				},
				{
					title: "JS3 Supplemental Project 1: Elevator Limits",
					content:
						"Check whether an elevator is above or below its weight limit and print how far over or under the limit it is.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS3-Elevator-Limits?skipMigration=1"
				},
				{
					title: "JS3 Supplemental Project 2: Weather Activities",
					content:
						"Ask the user about the weather and recommend an activity based on their answer.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS3-Weather-Activities?skipMigration=1"
				},
				{
					title: "JS3 Supplemental Project 3: Too Chicken to Cross the Road",
					content:
						"Read booleans for the left and right sides of the road and use conditionals to tell Charlie the chicken whether it is safe to cross.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS3-Too-Chicken-to-Cross-the-Road?skipMigration=1"
				},
				{
					title: "JS3 Supplemental Project 4: Spreadsheet Width",
					content:
						"Format a word so it fits within a given spreadsheet cell width by either trimming or padding it, then print it between vertical bars.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS3-Spreadsheet-Width?skipMigration=1"
				}
			]
		},
		{
			title: "JS4 Loops",
			curriculum: [
				{
					title: "For Loops",
					content:
						"Use `for` loops to repeat code with a loop variable, a stopping condition, and an update step. Practice counting forward, backward, and by larger increments."
				},
				{
					title: "While Loops",
					content:
						"Compare `while` loops with `for` loops, and practice using changing conditions and `while (true)` plus `break` to control repetition."
				},
				{
					title: "JS4 Project 1: Loops Practice",
					content:
						"Practice printing ranges of numbers, even numbers, countdowns, and the sum of 1 through 100 with both `for` loops and `while` loops.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS4-Loop-Practice?skipMigration=1"
				},
				{
					title: "JS4 Project 2: Nested Loops",
					content:
						"Use nested loops to print multiplication tables and text patterns such as triangles of stars and diagonal marker patterns that combine loops with conditionals.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS4-Nested-Loops?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "JS4 Supplemental Graphics Project: Paintball (Optional)",
					content:
						"Use loops and coordinates in a BlueJ graphics project to draw diagonals of circles and experiment with other repeated patterns.",
					solutionLink:
						"https://static.junilearning.com/java1/js4-paintball.java"
				},
				{
					title: "JS4 Supplemental Project 1: Letter Square",
					content:
						"Ask the user for a letter and a size, then print a square made of that letter using both `for` loops and `while` loops.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS4-Letter-Square?skipMigration=1"
				},
				{
					title: "JS4 Supplemental Project 2: Checkout Calculator",
					content:
						"Keep asking the user for item prices until they enter 0, then print the total cost.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS4-Checkout-Calculator?skipMigration=1"
				},
				{
					title: "JS4 Supplemental Project 3: Pyramid",
					content:
						"Use nested loops to print a slash-and-backslash pyramid pattern in the console.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS4-Pyramid?skipMigration=1"
				}
			]
		},
		{
			title: "JS5 Practice with Loops & Conditionals",
			curriculum: [
				{
					title: "Random Numbers and Letters",
					content:
						"Use `Math.random()` to create random integers in different ranges, then use ASCII values and casting to generate random lowercase letters and simple random words."
				},
				{
					title: "JS5 Project 1: Letter Guesser",
					content:
						"Pick a random lowercase letter, ask the user to guess until they get it right, and count how many guesses it took.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS5-Letter-Guesser?skipMigration=1"
				},
				{
					title: "JS5 Project 2: Mathematical Challenges",
					content:
						"Complete several challenge problems, including FizzBuzz, listing all factors of a number, and reversing a string.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS5-Mathematical-Challenges?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "JS5 Supplemental Project 1: Number Guesser",
					content:
						"Create a number guessing game with a user-defined range, random target, feedback on each guess, and a final guess count.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS5-Random-Number-Guesser?skipMigration=1"
				}
			]
		},
		{
			title: "JS6 Methods",
			curriculum: [
				{
					title: "Methods",
					content:
						"Learn how methods package reusable logic with parameters, return types, and method calls. Practice writing simple helpers such as `sum`, `subtract`, `double`, and `max`."
				},
				{
					title: "JS6 Project 1: Methods Practice",
					content:
						"Write methods that compute an average, test whether a number is even, find the smallest of three doubles, compute a factorial, and raise a base to a power.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS6-Methods-Practice?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "JS6 Supplemental Graphics Project: Picasso (Optional)",
					content:
						"Use methods plus random size, color, and position values in a BlueJ graphics project to generate abstract art from multiple shapes.",
					solutionLink:
						"https://static.junilearning.com/java1/js6-picasso.java"
				},
				{
					title: "JS6 Supplemental Project 1: Min and Max",
					content:
						"Write `min()` and `max()` methods for three integers without using `Math.min()` or `Math.max()`.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS6-Min-and-Max?skipMigration=1"
				},
				{
					title: "JS6 Supplemental Project 2: Caught Speeding",
					content:
						"Write a method that returns a ticket category based on driving speed and whether it is the driver's birthday.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS6-Caught-Speeding?skipMigration=1"
				},
				{
					title: "JS6 Supplemental Project 3: String Expander",
					content:
						"Write a method that repeats each character in a string a specified number of times.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS6-String-Expander?skipMigration=1"
				},
				{
					title: "JS6 Supplemental Project 4: Palindrome Checker",
					content:
						"Write an `isPalindrome()` method that checks whether a string reads the same forward and backward.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS6-Palindrome-Checker?skipMigration=1"
				}
			]
		},
		{
			title: "JS7 Arrays and ArrayLists",
			curriculum: [
				{
					title: "Arrays",
					content:
						"Create arrays with fixed sizes, access and update elements by index, loop through arrays, and work with arrays of different types including strings and booleans."
				},
				{
					title: "JS7 Project 1: Practice with Arrays",
					content:
						"Build arrays of perfect squares, write methods that inspect or transform arrays, test for values such as 0, create arrays of random doubles, and optionally reverse arrays or swap the smallest and largest values.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-Practice-with-Arrays?skipMigration=1"
				},
				{
					title: "JS7 Project 2: Fortuneteller",
					content:
						"Store several fortunes in an array and print a random one each time the program runs.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-Fortuneteller?skipMigration=1"
				},
				{
					title: "ArrayLists",
					content:
						"Compare arrays with `ArrayList`s, then use `add()`, `get()`, `set()`, `remove()`, and `size()` to build dynamic lists that can grow and shrink."
				},
				{
					title: "JS7 Project 3: Practice with ArrayLists",
					content:
						"Write methods that generate lists of random integers, filter even numbers, remove the smallest value, add a sum, edit multiples of 3, collect user-entered words, and insert `MIDDLE` into the center of a list.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-ArrayList-Practice?skipMigration=1"
				},
				{
					title: "JS7 Project 4: High Score List",
					content:
						"Create a sorted high-score list that inserts each new score in the correct place from highest to lowest.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-High-Score-List?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "JS7 Supplemental Project 1: Lucky Array",
					content:
						"Ask the user for a lucky number, then check whether it appears in an array of random integers.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-Lucky-Array?skipMigration=1"
				},
				{
					title: "JS7 Supplemental Project 2: Arithmetic Sequence",
					content:
						"Write `generateArithSeq()` to return an array representing an arithmetic sequence from a starting value, term count, and common difference.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-Arithmetic-Sequence?skipMigration=1"
				},
				{
					title: "JS7 Supplemental Project 3: String to Array",
					content:
						"Convert strings to arrays of characters, including a version that keeps every other character starting from the first.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-String-to-Array?skipMigration=1"
				},
				{
					title: "JS7 Supplemental Project 4: Too Much Reversing",
					content:
						"Reverse every string in an array and also reverse the order of the strings in the array itself.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-Too-Much-Reversing?skipMigration=1"
				},
				{
					title: "JS7 Supplemental Project 5: Airline Management",
					content:
						"Use a boolean array to represent airplane seats, then write methods that reserve seats and detect when the flight is full.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-Airline-Management?skipMigration=1"
				},
				{
					title: "JS7 Supplemental Project 6: Song Shuffler",
					content:
						"Shuffle a list of songs by randomly moving entries from an original list into a new shuffled list.",
					projectLink:
						"https://repl.it/@JuniLearning/JS7-Song-Shuffler-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/JS7-Song-Shuffler?skipMigration=1"
				}
			]
		},
		{
			title: "JS8 Two-Dimensional Arrays",
			curriculum: [
				{
					title: "Two-Dimensional Arrays",
					content:
						"Treat a 2D array as a grid or an array of arrays, and practice traversing it with nested loops while keeping track of row counts and column counts separately."
				},
				{
					title: "JS8 Project 1: Practice with 2D Arrays",
					content:
						"Write methods that sum all values in a grid, find the minimum value, generate an `N x N` multiplication table, and return row averages as doubles.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS8-Practice-with-2D-Arrays?skipMigration=1"
				},
				{
					title: "JS8 Project 2: Grid Drawer",
					content:
						"Create a 10x10 grid that lets the user place `x` markers at chosen row and column positions until they enter `-1` to stop.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS8-Grid-Drawer?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "JS8 Supplemental Project 1: Square of Squares",
					content:
						"Ask the user for a size, fill a 2D array with perfect squares, and print the resulting square grid.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS8-Square-of-Squares?skipMigration=1"
				},
				{
					title: "JS8 Supplemental Project 2: 2D Array to String",
					content:
						"Write `arrToString()` to return a string representation of a 2D array using nested loops.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS8-2D-Array-to-String?skipMigration=1"
				},
				{
					title: "JS8 Supplemental Project 3: Magic Square",
					content:
						"Write `isMagicSquare()` to check whether all rows, columns, and diagonals in a square grid have the same sum.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS8-Magic-Square?skipMigration=1"
				}
			]
		},
		{
			title: "JS9 Master Project: Battleship",
			curriculum: [
				{
					title: "JS9 Master Project: Simple Battleship",
					content:
						"Plan and build a playable Battleship game using the core ideas from the course, including loops, conditionals, methods, arrays, and two-dimensional arrays. Think carefully about how to store ships, guesses, and hits, and keep the player guessing until all ships are sunk.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS9-Simple-Battleship?skipMigration=1"
				},
				{
					title: "JS9 Master Project: Advanced Battleship",
					content:
						"Extend the project into a configurable multiplayer Battleship game with custom board sizes, multiple ship types, setup validation, alternating turns, and win detection.",
					solutionLink:
						"https://repl.it/@JuniLearning/JS9-Advanced-Battleship?skipMigration=1"
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including primitive types, strings, input and output, operators, conditionals, loops, randomness, methods, arrays, ArrayLists, two-dimensional arrays, and building a larger game."
				}
			],
			supplementalProjects: []
		}
	]
};
