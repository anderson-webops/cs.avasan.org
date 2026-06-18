import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const javaLevel1Course: RawCourse = {
	name: "Java Level 1",
	modules: [
		{
			title: "JS1 Variable Types & Input/Output",
			curriculum: [
				{
					title: "Introductions and Java Setup",
					content:
						"Get comfortable with the Java workspace, the console, project instructions, and a reference project for reusable examples. Start by writing code inside `main()` and using the console to run and inspect output."
				},
				{
					title: "Optional Python-to-Java Bridge",
					content:
						"The `Python to Java and C++ Bridge` course or its equivalent addendum fits before or alongside the first Java module when the Python sequence is already familiar. The point is to translate typed variables, method signatures, `Scanner`, and compiler feedback into familiar concepts rather than treating Java as a fresh start."
				},
				{
					title: "Primitive Types",
					content:
						"Learn the built-in Java types `int`, `double`, `char`, and `boolean`, and practice declaring variables, assigning values, printing them, and noticing Java syntax such as semicolons and single quotes for characters.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Primitives"
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
					title: "JS1 Project 1: Chat Bot",
					content:
						"Create a chatbot that asks at least five questions, stores the user's answers, and prints customized responses using string concatenation and input handling.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Chat-Bot",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Chat-Bot"
				},
				{
					title: "JS1 Project 2: First Middle Last",
					content:
						"Ask the user for a word and print its first, middle, and last characters. As an optional extension, remove one of those characters using substring logic.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-First-Middle-Last",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-First-Middle-Last"
				}
			],
			supplementalProjects: [
				{
					title: "JS1 Supplemental Project 1: Mad Libs",
					content:
						"Ask the user for different parts of speech and print a completed Mad Lib story using their responses.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Mad-Libs",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Mad-Libs"
				},
				{
					title: "JS1 Supplemental Project 2: Division Facts",
					content:
						"Ask the user for two numbers, then compute the quotient and remainder without using the `%` operator.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Division-Facts",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Division-Facts"
				},
				{
					title: "Variable Types & Input/Output Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS1 Variable Types & Input/Output",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-01-js1-variable-types-input-output-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-01-js1-variable-types-input-output-supplemental-3/solution"
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
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Casting-Reference"
				},
				{
					title: "Mathematical Operators",
					content:
						"Practice Java arithmetic with `+`, `-`, `*`, `/`, and `%`, and compare how order of operations and parentheses affect the result of expressions.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Math-Operators-Reference"
				},
				{
					title: "JS2 Project 1: Temperature Converter",
					content:
						"Read temperature input from the user, convert between Fahrenheit and Celsius, and use casting to produce more accurate results before rounding to whole numbers.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter/src/main/java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter/src/main/java"
				},
				{
					title: "Casting and Operators: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Casting and Operators",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JS2 Supplemental Project 1: Rainbow",
					content:
						"Use the graphics methods introduced in the optional BlueJ workflow to create a six-color rainbow.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow"
				},
				{
					title: "JS2 Supplemental Project 2: Snowman",
					content:
						"Use graphics methods to draw and customize a snowman with extra features such as a scarf, arms, or snowflakes.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Snowman",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Snowman"
				},
				{
					title: "Casting and Operators Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS2 Casting and Operators",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-js2-casting-and-operators-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-js2-casting-and-operators-supplemental-3/solution"
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Code-Your-Own-Adventure",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Code-Your-Own-Adventure"
				},
				{
					title: "JS3 Project 2: Color Mixer",
					content:
						"Ask the user for two primary colors, validate the input, and use conditional logic to determine the resulting mixed color or print an error if the input is invalid.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Color-Mixer",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Color-Mixer"
				},
				{
					title: "Conditionals: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Conditionals",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental Graphics Project: Which Shape? (Optional)",
					content:
						"Use a string and conditionals in a BlueJ graphics project to decide whether to draw a circle, square, Pac-Man, or another shape.",
					projectLink:
						"https://static.junilearning.com/java1/js3-which-shape.java",
					solutionLink:
						"https://static.junilearning.com/java1/js3-which-shape.java"
				},
				{
					title: "JS3 Supplemental Project 1: Elevator Limits",
					content:
						"Check whether an elevator is above or below its weight limit and print how far over or under the limit it is.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Elevator-Limits",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Elevator-Limits"
				},
				{
					title: "JS3 Supplemental Project 2: Weather Activities",
					content:
						"Ask the user about the weather and recommend an activity based on their answer.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Weather-Activities",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Weather-Activities"
				},
				{
					title: "JS3 Supplemental Project 3: Too Chicken to Cross the Road",
					content:
						"Read booleans for the left and right sides of the road and use conditionals to tell Charlie the chicken whether it is safe to cross.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Too-Chicken-to-Cross-the-Road",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Too-Chicken-to-Cross-the-Road"
				},
				{
					title: "JS3 Supplemental Project 4: Spreadsheet Width",
					content:
						"Format a word so it fits within a given spreadsheet cell width by either trimming or padding it, then print it between vertical bars.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Spreadsheet-Width",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Spreadsheet-Width"
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
						"Use loops to print ranges of numbers, even numbers, countdowns, and the sum of 1 through 100 with both `for` loops and `while` loops.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Loop-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Loop-Practice"
				},
				{
					title: "JS4 Project 2: Nested Loops",
					content:
						"Use nested loops to print multiplication tables and text patterns such as triangles of stars and diagonal marker patterns that combine loops with conditionals.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Nested-Loops",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Nested-Loops"
				}
			],
			supplementalProjects: [
				{
					title: "JS4 Supplemental Graphics Project: Paintball (Optional)",
					content:
						"Use loops and coordinates in a BlueJ graphics project to draw diagonals of circles and experiment with other repeated patterns.",
					projectLink:
						"https://static.junilearning.com/java1/js4-paintball.java",
					solutionLink:
						"https://static.junilearning.com/java1/js4-paintball.java"
				},
				{
					title: "JS4 Supplemental Project 1: Letter Square",
					content:
						"Ask the user for a letter and a size, then print a square made of that letter using both `for` loops and `while` loops.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Letter-Square",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Letter-Square"
				},
				{
					title: "JS4 Supplemental Project 2: Checkout Calculator",
					content:
						"Keep asking the user for item prices until they enter 0, then print the total cost.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Checkout-Calculator",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Checkout-Calculator"
				},
				{
					title: "JS4 Supplemental Project 3: Pyramid",
					content:
						"Use nested loops to print a slash-and-backslash pyramid pattern in the console.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Pyramid",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Pyramid"
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Letter-Guesser",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Letter-Guesser"
				},
				{
					title: "JS5 Project 2: Mathematical Challenges",
					content:
						"Complete several challenge problems, including FizzBuzz, listing all factors of a number, and reversing a string.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Mathematical-Challenges",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Mathematical-Challenges"
				},
				{
					title: "Practice with Loops & Conditionals: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Practice with Loops & Conditionals",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JS5 Supplemental Project 1: Number Guesser",
					content:
						"Create a number guessing game with a user-defined range, random target, feedback on each guess, and a final guess count.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Random-Number-Guesser",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Random-Number-Guesser"
				},
				{
					title: "Practice with Loops & Conditionals Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS5 Practice with Loops & Conditionals",
						itemTitle:
							"Practice with Loops & Conditionals Supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-js5-practice-with-loops-conditionals-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-js5-practice-with-loops-conditionals-supplemental-2/solution"
				},
				{
					title: "Practice with Loops & Conditionals Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS5 Practice with Loops & Conditionals",
						itemTitle:
							"Practice with Loops & Conditionals Supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-js5-practice-with-loops-conditionals-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-js5-practice-with-loops-conditionals-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this module as a low-pressure review of variables, strings, conditionals, and loops. Work through the prompts independently first, then revisit any ideas that need reinforcement.",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Check-in-1"
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
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS-Check-in-1-Additional-Project-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS-Check-in-1-Additional-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check In #1",
						section: "extension"
					}),
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Check-in-1"
				},
				{
					title: "Check In #1 Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check-In #1",
						itemTitle: "Check In #1 Supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check In #1 Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check-In #1",
						itemTitle: "Check In #1 Supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-check-in-1-supplemental-3/solution"
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Methods-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Methods-Practice"
				},
				{
					title: "Methods: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Methods",
						section: "planning"
					})
				},
				{
					title: "Methods: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Methods",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JS6 Supplemental Graphics Project: Picasso (Optional)",
					content:
						"Use methods plus random size, color, and position values in a BlueJ graphics project to generate abstract art from multiple shapes.",
					projectLink:
						"https://static.junilearning.com/java1/js6-picasso.java",
					solutionLink:
						"https://static.junilearning.com/java1/js6-picasso.java"
				},
				{
					title: "JS6 Supplemental Project 1: Min and Max",
					content:
						"Write `min()` and `max()` methods for three integers without using `Math.min()` or `Math.max()`.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Min-and-Max",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Min-and-Max"
				},
				{
					title: "JS6 Supplemental Project 2: Caught Speeding",
					content:
						"Write a method that returns a ticket category based on driving speed and whether it is the driver's birthday.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Caught-Speeding",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Caught-Speeding"
				},
				{
					title: "JS6 Supplemental Project 3: String Expander",
					content:
						"Write a method that repeats each character in a string a specified number of times.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-String-Expander",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-String-Expander"
				},
				{
					title: "JS6 Supplemental Project 4: Palindrome Checker",
					content:
						"Write an `isPalindrome()` method that checks whether a string reads the same forward and backward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Palindrome-Checker",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Palindrome-Checker"
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays"
				},
				{
					title: "JS7 Project 2: Fortune Teller",
					content:
						"Store several fortunes in an array and print a random one each time the program runs.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Fortune-Teller",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Fortune-Teller"
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Array-List-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Array-List-Practice"
				},
				{
					title: "JS7 Project 4: High Score List",
					content:
						"Create a sorted high-score list that inserts each new score in the correct place from highest to lowest.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-High-Score-List",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-High-Score-List"
				}
			],
			supplementalProjects: [
				{
					title: "JS7 Supplemental Project 1: Lucky Array",
					content:
						"Ask the user for a lucky number, then check whether it appears in an array of random integers.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Lucky-Array",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Lucky-Array"
				},
				{
					title: "JS7 Supplemental Project 2: Arithmetic Sequence",
					content:
						"Write `generateArithSeq()` to return an array representing an arithmetic sequence from a starting value, term count, and common difference.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays"
				},
				{
					title: "JS7 Supplemental Project 3: String to Array",
					content:
						"Convert strings to arrays of characters, including a version that keeps every other character starting from the first.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-String-to-Array",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-String-to-Array"
				},
				{
					title: "JS7 Supplemental Project 4: Too Much Reversing",
					content:
						"Reverse every string in an array and also reverse the order of the strings in the array itself.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Too-Much-Reversing",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Too-Much-Reversing"
				},
				{
					title: "JS7 Supplemental Project 5: Airline Management",
					content:
						"Use a boolean array to represent airplane seats, then write methods that reserve seats and detect when the flight is full.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Airline-Management",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Airline-Management"
				},
				{
					title: "JS7 Supplemental Project 6: Song Shuffler",
					content:
						"Shuffle a list of songs by randomly moving entries from an original list into a new shuffled list.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Song-Shuffler-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Song-Shuffler"
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Practice-with-2D-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Practice-with-2D-Arrays"
				},
				{
					title: "JS8 Project 2: Grid Drawer",
					content:
						"Create a 10x10 grid that lets the user place `x` markers at chosen row and column positions until they enter `-1` to stop.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Grid-Drawer",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Grid-Drawer"
				},
				{
					title: "Two Dimensional Arrays: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Two Dimensional Arrays",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JS8 Supplemental Project 1: Square of Squares",
					content:
						"Ask the user for a size, fill a 2D array with perfect squares, and print the resulting square grid.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Square-of-Squares",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Square-of-Squares"
				},
				{
					title: "JS8 Supplemental Project 2: 2D Array to String",
					content:
						"Write `arrToString()` to return a string representation of a 2D array using nested loops.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-2D-Array-to-String",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-2D-Array-to-String"
				},
				{
					title: "JS8 Supplemental Project 3: Magic Square",
					content:
						"Write `isMagicSquare()` to check whether all rows, columns, and diagonals in a square grid have the same sum.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Magic-Square",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Magic-Square"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"Use this review to revisit math operators, randomness, methods, arrays, and two-dimensional arrays. Focus on explaining not just what the code does, but why each structure fits the problem.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1"
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check In #2",
						section: "extension"
					}),
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1"
				},
				{
					title: "Check In #2 Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check-In #2",
						itemTitle: "Check In #2 Supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-07-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-07-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check In #2 Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Check-In #2",
						itemTitle: "Check In #2 Supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-08-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-08-check-in-2-supplemental-3/solution"
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship"
				},
				{
					title: "JS9 Master Project: Advanced Battleship",
					content:
						"Extend the project into a configurable multiplayer Battleship game with custom board sizes, multiple ship types, setup validation, alternating turns, and win detection.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Advanced-Battleship",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Advanced-Battleship"
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including primitive types, strings, input and output, operators, conditionals, loops, randomness, methods, arrays, ArrayLists, two-dimensional arrays, and building a larger game."
				},
				{
					title: "Master Project: Battleship: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Master Project: Battleship",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Battleship: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "Master Project: Battleship",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship"
				},
				{
					title: "Master Project: Battleship Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS9 Master Project: Battleship",
						itemTitle: "Master Project: Battleship Supplemental 2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-09-js9-master-project-battleship-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-09-js9-master-project-battleship-supplemental-2/solution"
				},
				{
					title: "Master Project: Battleship Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle: "JS9 Master Project: Battleship",
						itemTitle: "Master Project: Battleship Supplemental 3",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-10-js9-master-project-battleship-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-10-js9-master-project-battleship-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X02 Java Foundations Build 13: Implementation Lab",
			curriculum: [
				{
					title: "J1X02 Java Foundations Build 13: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X02 Java Foundations Build 13: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "J1X02 Java Foundations Build 13: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X02 Java Foundations Build 13: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "J1X02 Java Foundations Build 13: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X02 Java Foundations Build 13: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-java-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-java-foundations-build-13/solution"
				},
				{
					title: "J1X02 Java Foundations Build 13: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X02 Java Foundations Build 13: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "J1X02 Java Foundations Build 13: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X02 Java Foundations Build 13: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-java-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-02-java-foundations-build-13/solution"
				},
				{
					title: "J1X02 Java Foundations Build 13 Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X02 Java Foundations Build 13: Implementation Lab",
						itemTitle:
							"J1X02 Java Foundations Build 13 Supplemental 2: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-11-applied-studio-12-j1x02-java-foundations-build-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-11-applied-studio-12-j1x02-java-foundations-build-13-supplemental-2/solution"
				},
				{
					title: "J1X02 Java Foundations Build 13 Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X02 Java Foundations Build 13: Implementation Lab",
						itemTitle:
							"J1X02 Java Foundations Build 13 Supplemental 3: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-12-applied-studio-12-j1x02-java-foundations-build-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-12-applied-studio-12-j1x02-java-foundations-build-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X03 Java Foundations Build 14: Implementation Lab",
			curriculum: [
				{
					title: "J1X03 Java Foundations Build 14: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X03 Java Foundations Build 14: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "J1X03 Java Foundations Build 14: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X03 Java Foundations Build 14: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "J1X03 Java Foundations Build 14: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X03 Java Foundations Build 14: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-java-foundations-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-java-foundations-build-14/solution"
				},
				{
					title: "J1X03 Java Foundations Build 14: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X03 Java Foundations Build 14: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "J1X03 Java Foundations Build 14: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X03 Java Foundations Build 14: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-java-foundations-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-03-java-foundations-build-14/solution"
				},
				{
					title: "J1X03 Java Foundations Build 14 Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X03 Java Foundations Build 14: Implementation Lab",
						itemTitle:
							"J1X03 Java Foundations Build 14 Supplemental 2: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-13-applied-studio-13-j1x03-java-foundations-build-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-13-applied-studio-13-j1x03-java-foundations-build-14-supplemental-2/solution"
				},
				{
					title: "J1X03 Java Foundations Build 14 Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X03 Java Foundations Build 14: Implementation Lab",
						itemTitle:
							"J1X03 Java Foundations Build 14 Supplemental 3: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-14-applied-studio-13-j1x03-java-foundations-build-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-14-applied-studio-13-j1x03-java-foundations-build-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X04 Java Foundations Build 15: Implementation Lab",
			curriculum: [
				{
					title: "J1X04 Java Foundations Build 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X04 Java Foundations Build 15: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "J1X04 Java Foundations Build 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X04 Java Foundations Build 15: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "J1X04 Java Foundations Build 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X04 Java Foundations Build 15: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-java-foundations-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-java-foundations-build-15/solution"
				},
				{
					title: "J1X04 Java Foundations Build 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X04 Java Foundations Build 15: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "J1X04 Java Foundations Build 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X04 Java Foundations Build 15: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-java-foundations-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-04-java-foundations-build-15/solution"
				},
				{
					title: "J1X04 Java Foundations Build 15 Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X04 Java Foundations Build 15: Implementation Lab",
						itemTitle:
							"J1X04 Java Foundations Build 15 Supplemental 2: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-15-applied-studio-14-j1x04-java-foundations-build-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-15-applied-studio-14-j1x04-java-foundations-build-15-supplemental-2/solution"
				},
				{
					title: "J1X04 Java Foundations Build 15 Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X04 Java Foundations Build 15: Implementation Lab",
						itemTitle:
							"J1X04 Java Foundations Build 15 Supplemental 3: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-16-applied-studio-14-j1x04-java-foundations-build-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-16-applied-studio-14-j1x04-java-foundations-build-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X05 Java Foundations Build 16: Implementation Lab",
			curriculum: [
				{
					title: "J1X05 Java Foundations Build 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X05 Java Foundations Build 16: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "J1X05 Java Foundations Build 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X05 Java Foundations Build 16: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "J1X05 Java Foundations Build 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X05 Java Foundations Build 16: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-java-foundations-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-java-foundations-build-16/solution"
				},
				{
					title: "J1X05 Java Foundations Build 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X05 Java Foundations Build 16: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "J1X05 Java Foundations Build 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X05 Java Foundations Build 16: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-java-foundations-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-05-java-foundations-build-16/solution"
				},
				{
					title: "J1X05 Java Foundations Build 16 Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X05 Java Foundations Build 16: Implementation Lab",
						itemTitle:
							"J1X05 Java Foundations Build 16 Supplemental 2: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-17-applied-studio-15-j1x05-java-foundations-build-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-17-applied-studio-15-j1x05-java-foundations-build-16-supplemental-2/solution"
				},
				{
					title: "J1X05 Java Foundations Build 16 Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X05 Java Foundations Build 16: Implementation Lab",
						itemTitle:
							"J1X05 Java Foundations Build 16 Supplemental 3: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-18-applied-studio-15-j1x05-java-foundations-build-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-18-applied-studio-15-j1x05-java-foundations-build-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "J1X06 Java Foundations Build 17: Implementation Lab",
			curriculum: [
				{
					title: "J1X06 Java Foundations Build 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X06 Java Foundations Build 17: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "J1X06 Java Foundations Build 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X06 Java Foundations Build 17: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "J1X06 Java Foundations Build 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X06 Java Foundations Build 17: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-java-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-java-foundations-build-17/solution"
				},
				{
					title: "J1X06 Java Foundations Build 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X06 Java Foundations Build 17: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "J1X06 Java Foundations Build 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X06 Java Foundations Build 17: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-java-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-06-java-foundations-build-17/solution"
				},
				{
					title: "J1X06 Java Foundations Build 17 Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X06 Java Foundations Build 17: Implementation Lab",
						itemTitle:
							"J1X06 Java Foundations Build 17 Supplemental 2: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-19-applied-studio-16-j1x06-java-foundations-build-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-19-applied-studio-16-j1x06-java-foundations-build-17-supplemental-2/solution"
				},
				{
					title: "J1X06 Java Foundations Build 17 Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"J1X06 Java Foundations Build 17: Implementation Lab",
						itemTitle:
							"J1X06 Java Foundations Build 17 Supplemental 3: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-20-applied-studio-16-j1x06-java-foundations-build-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-20-applied-studio-16-j1x06-java-foundations-build-17-supplemental-3/solution"
				}
			]
		},
		{
			title: "Temperature Converter: Implementation Lab",
			curriculum: [
				{
					title: "Temperature Converter: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"Temperature Converter: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Temperature Converter: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"Temperature Converter: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Temperature Converter: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"Temperature Converter: Implementation Lab",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter"
				},
				{
					title: "Temperature Converter: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"Temperature Converter: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Temperature Converter: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"Temperature Converter: Implementation Lab",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter"
				},
				{
					title: "Temperature Converter Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"Temperature Converter: Implementation Lab",
						itemTitle:
							"Temperature Converter Supplemental 2: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-21-applied-studio-17-temperature-converter-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-21-applied-studio-17-temperature-converter-supplemental-2/solution"
				},
				{
					title: "Temperature Converter Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Java Level 1",
						moduleTitle:
							"Temperature Converter: Implementation Lab",
						itemTitle:
							"Temperature Converter Supplemental 3: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-22-applied-studio-17-temperature-converter-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1-22-applied-studio-17-temperature-converter-supplemental-3/solution"
				}
			]
		}
	]
};
