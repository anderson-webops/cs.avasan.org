import type { RawCourse } from "./types";

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
						"Students arriving from the Python sequence should use the `Python to Java and C++ Bridge` course or its equivalent addendum before or alongside the first Java module. The point is to translate typed variables, method signatures, `Scanner`, and compiler feedback into familiar concepts rather than treating Java as a fresh start."
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
						"Import `Scanner`, create a scanner object, prompt the user with `System.out.print`, and store responses with methods such as `nextLine()`. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JS1 Project 1: Chatbot",
					content:
						"Create a chatbot that asks at least five questions, stores the user's answers, and prints customized responses using string concatenation and input handling. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Chatbot",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Chatbot"
				},
				{
					title: "JS1 Project 2: First Middle Last",
					content:
						"Ask the user for a word and print its first, middle, and last characters. As an optional extension, remove one of those characters using substring logic. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Ask the user for different parts of speech and print a completed Mad Lib story using their responses. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Mad-Libs",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Mad-Libs"
				},
				{
					title: "JS1 Supplemental Project 2: Division Facts",
					content:
						"Ask the user for two numbers, then compute the quotient and remainder without using the `%` operator. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Division-Facts",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Division-Facts"
				}
			]
		},
		{
			title: "JS2 Casting and Operators",
			curriculum: [
				{
					title: "Casting",
					content:
						"Learn how casting changes the type the computer uses for a value. Compare automatic casting with explicit casts, especially when mixing `int` and `double` values in arithmetic. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS1-Casting-Reference"
				},
				{
					title: "Mathematical Operators",
					content:
						"Practice Java arithmetic with `+`, `-`, `*`, `/`, and `%`, and compare how order of operations and parentheses affect the result of expressions. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Math-Operators-Reference"
				},
				{
					title: "JS2 Project 1: Temperature Converter",
					content:
						"Read temperature input from the user, convert between Fahrenheit and Celsius, and use casting to produce more accurate results before rounding to whole numbers. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter/src/main/java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter/src/main/java"
				},
				{
					title: "Casting and Operators: Verification and Reflection",
					content:
						"Close JS2 Casting and Operators by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JS2 Supplemental Project 1: Rainbow",
					content:
						"Use the graphics methods introduced in the optional BlueJ workflow to create a six-color rainbow. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Rainbow"
				},
				{
					title: "JS2 Supplemental Project 2: Snowman",
					content:
						"Use graphics methods to draw and customize a snowman with extra features such as a scarf, arms, or snowflakes. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Snowman",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Snowman"
				},
				{
					title: "Setting Up an Applet (Optional)",
					content:
						"Optionally set up BlueJ for graphics projects, create a class-based applet, compile it, and run it with a basic graphics template. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Basic Shapes (Optional)",
					content:
						"Use BlueJ graphics methods such as `fillRect`, `fillOval`, and `fillArc` with `setColor` to explore Java graphics coordinates, color, and shape sizing. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://static.junilearning.com/java1/js2-basic-shapes.java"
				},
				{
					title: "Happy Graphics (Optional)",
					content:
						"Use the same drawing methods to create a smiley face and a pair of Pac-Man characters. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
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
						"Create a text-based choose-your-own-adventure game using nested conditionals to handle multiple user choices and branching outcomes. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Code-Your-Own-Adventure",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Code-Your-Own-Adventure"
				},
				{
					title: "JS3 Project 2: Color Mixer",
					content:
						"Ask the user for two primary colors, validate the input, and use conditional logic to determine the resulting mixed color or print an error if the input is invalid. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Color-Mixer",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Color-Mixer"
				},
				{
					title: "Conditionals: Verification and Reflection",
					content:
						"Close JS3 Conditionals by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental Graphics Project: Which Shape? (Optional)",
					content:
						"Use a string and conditionals in a BlueJ graphics project to decide whether to draw a circle, square, Pac-Man, or another shape. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://static.junilearning.com/java1/js3-which-shape.java",
					solutionLink:
						"https://static.junilearning.com/java1/js3-which-shape.java"
				},
				{
					title: "JS3 Supplemental Project 1: Elevator Limits",
					content:
						"Check whether an elevator is above or below its weight limit and print how far over or under the limit it is. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Elevator-Limits",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Elevator-Limits"
				},
				{
					title: "JS3 Supplemental Project 2: Weather Activities",
					content:
						"Ask the user about the weather and recommend an activity based on their answer. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Weather-Activities",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Weather-Activities"
				},
				{
					title: "JS3 Supplemental Project 3: Too Chicken to Cross the Road",
					content:
						"Read booleans for the left and right sides of the road and use conditionals to tell Charlie the chicken whether it is safe to cross. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Too-Chicken-to-Cross-the-Road",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS3-Too-Chicken-to-Cross-the-Road"
				},
				{
					title: "JS3 Supplemental Project 4: Spreadsheet Width",
					content:
						"Format a word so it fits within a given spreadsheet cell width by either trimming or padding it, then print it between vertical bars. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Use `for` loops to repeat code with a loop variable, a stopping condition, and an update step. Practice counting forward, backward, and by larger increments. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "While Loops",
					content:
						"Compare `while` loops with `for` loops, and practice using changing conditions and `while (true)` plus `break` to control repetition. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JS4 Project 1: Loops Practice",
					content:
						"Practice printing ranges of numbers, even numbers, countdowns, and the sum of 1 through 100 with both `for` loops and `while` loops. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Loop-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Loop-Practice"
				},
				{
					title: "JS4 Project 2: Nested Loops",
					content:
						"Use nested loops to print multiplication tables and text patterns such as triangles of stars and diagonal marker patterns that combine loops with conditionals. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Use loops and coordinates in a BlueJ graphics project to draw diagonals of circles and experiment with other repeated patterns. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://static.junilearning.com/java1/js4-paintball.java",
					solutionLink:
						"https://static.junilearning.com/java1/js4-paintball.java"
				},
				{
					title: "JS4 Supplemental Project 1: Letter Square",
					content:
						"Ask the user for a letter and a size, then print a square made of that letter using both `for` loops and `while` loops. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Letter-Square",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Letter-Square"
				},
				{
					title: "JS4 Supplemental Project 2: Checkout Calculator",
					content:
						"Keep asking the user for item prices until they enter 0, then print the total cost. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Checkout-Calculator",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS4-Checkout-Calculator"
				},
				{
					title: "JS4 Supplemental Project 3: Pyramid",
					content:
						"Use nested loops to print a slash-and-backslash pyramid pattern in the console. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Use `Math.random()` to create random integers in different ranges, then use ASCII values and casting to generate random lowercase letters and simple random words. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JS5 Project 1: Letter Guesser",
					content:
						"Pick a random lowercase letter, ask the user to guess until they get it right, and count how many guesses it took. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Letter-Guesser",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Letter-Guesser"
				},
				{
					title: "JS5 Project 2: Mathematical Challenges",
					content:
						"Complete several challenge problems, including FizzBuzz, listing all factors of a number, and reversing a string. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Mathematical-Challenges",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Mathematical-Challenges"
				},
				{
					title: "Practice with Loops & Conditionals: Verification and Reflection",
					content:
						"Close JS5 Practice with Loops & Conditionals by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JS5 Supplemental Project 1: Number Guesser",
					content:
						"Create a number guessing game with a user-defined range, random target, feedback on each guess, and a final guess count. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Random-Number-Guesser",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS5-Random-Number-Guesser"
				},
				{
					title: "Practice with Loops & Conditionals: Fluency Drill",
					content:
						"Repeat the core ideas from JS5 Practice with Loops & Conditionals on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this module as a low-pressure review of variables, strings, conditionals, and loops. Work through the prompts independently first, then revisit any ideas that need reinforcement. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
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
						"Ask the user for a row and column, then print a grid with `O` characters along that row and column and an `X` at the exact chosen coordinate. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS-Check-in-1-Additional-Project-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS-Check-in-1-Additional-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					content:
						"Extend the work from Check-In #1 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Check-in-1"
				},
				{
					title: "Check In #1: Fluency Drill",
					content:
						"Repeat the core ideas from Check-In #1 on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "JS6 Methods",
			curriculum: [
				{
					title: "Methods",
					content:
						"Learn how methods package reusable logic with parameters, return types, and method calls. Practice writing simple helpers such as `sum`, `subtract`, `double`, and `max`. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JS6 Project 1: Methods Practice",
					content:
						"Write methods that compute an average, test whether a number is even, find the smallest of three doubles, compute a factorial, and raise a base to a power. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Methods-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Methods-Practice"
				},
				{
					title: "Methods: Planning and Architecture",
					content:
						"Break JS6 Methods into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Methods: Verification and Reflection",
					content:
						"Close JS6 Methods by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JS6 Supplemental Graphics Project: Picasso (Optional)",
					content:
						"Use methods plus random size, color, and position values in a BlueJ graphics project to generate abstract art from multiple shapes. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://static.junilearning.com/java1/js6-picasso.java",
					solutionLink:
						"https://static.junilearning.com/java1/js6-picasso.java"
				},
				{
					title: "JS6 Supplemental Project 1: Min and Max",
					content:
						"Write `min()` and `max()` methods for three integers without using `Math.min()` or `Math.max()`. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Min-and-Max",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Min-and-Max"
				},
				{
					title: "JS6 Supplemental Project 2: Caught Speeding",
					content:
						"Write a method that returns a ticket category based on driving speed and whether it is the driver's birthday. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Caught-Speeding",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-Caught-Speeding"
				},
				{
					title: "JS6 Supplemental Project 3: String Expander",
					content:
						"Write a method that repeats each character in a string a specified number of times. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-String-Expander",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS6-String-Expander"
				},
				{
					title: "JS6 Supplemental Project 4: Palindrome Checker",
					content:
						"Write an `isPalindrome()` method that checks whether a string reads the same forward and backward. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Create arrays with fixed sizes, access and update elements by index, loop through arrays, and work with arrays of different types including strings and booleans. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
					title: "JS7 Project 2: Fortuneteller",
					content:
						"Store several fortunes in an array and print a random one each time the program runs. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Fortuneteller",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Fortuneteller"
				},
				{
					title: "ArrayLists",
					content:
						"Compare arrays with `ArrayList`s, then use `add()`, `get()`, `set()`, `remove()`, and `size()` to build dynamic lists that can grow and shrink. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JS7 Project 3: Practice with ArrayLists",
					content:
						"Write methods that generate lists of random integers, filter even numbers, remove the smallest value, add a sum, edit multiples of 3, collect user-entered words, and insert `MIDDLE` into the center of a list.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-ArrayList-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-ArrayList-Practice"
				},
				{
					title: "JS7 Project 4: High Score List",
					content:
						"Create a sorted high-score list that inserts each new score in the correct place from highest to lowest. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Ask the user for a lucky number, then check whether it appears in an array of random integers. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Lucky-Array",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Lucky-Array"
				},
				{
					title: "JS7 Supplemental Project 2: Arithmetic Sequence",
					content:
						"Write `generateArithSeq()` to return an array representing an arithmetic sequence from a starting value, term count, and common difference. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays"
				},
				{
					title: "JS7 Supplemental Project 3: String to Array",
					content:
						"Convert strings to arrays of characters, including a version that keeps every other character starting from the first. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-String-to-Array",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-String-to-Array"
				},
				{
					title: "JS7 Supplemental Project 4: Too Much Reversing",
					content:
						"Reverse every string in an array and also reverse the order of the strings in the array itself. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Too-Much-Reversing",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Too-Much-Reversing"
				},
				{
					title: "JS7 Supplemental Project 5: Airline Management",
					content:
						"Use a boolean array to represent airplane seats, then write methods that reserve seats and detect when the flight is full. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Airline-Management",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Airline-Management"
				},
				{
					title: "JS7 Supplemental Project 6: Song Shuffler",
					content:
						"Shuffle a list of songs by randomly moving entries from an original list into a new shuffled list. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Treat a 2D array as a grid or an array of arrays, and practice traversing it with nested loops while keeping track of row counts and column counts separately. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JS8 Project 1: Practice with 2D Arrays",
					content:
						"Write methods that sum all values in a grid, find the minimum value, generate an `N x N` multiplication table, and return row averages as doubles. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Practice-with-2D-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Practice-with-2D-Arrays"
				},
				{
					title: "JS8 Project 2: Grid Drawer",
					content:
						"Create a 10x10 grid that lets the user place `x` markers at chosen row and column positions until they enter `-1` to stop. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Grid-Drawer",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Grid-Drawer"
				},
				{
					title: "Two Dimensional Arrays: Verification and Reflection",
					content:
						"Close JS8 Two-Dimensional Arrays by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JS8 Supplemental Project 1: Square of Squares",
					content:
						"Ask the user for a size, fill a 2D array with perfect squares, and print the resulting square grid. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Square-of-Squares",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-Square-of-Squares"
				},
				{
					title: "JS8 Supplemental Project 2: 2D Array to String",
					content:
						"Write `arrToString()` to return a string representation of a 2D array using nested loops. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-2D-Array-to-String",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS8-2D-Array-to-String"
				},
				{
					title: "JS8 Supplemental Project 3: Magic Square",
					content:
						"Write `isMagicSquare()` to check whether all rows, columns, and diagonals in a square grid have the same sum. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Generate random integers and random letters, review ASCII, and practice using Java expressions to control ranges and convert between numbers and characters. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Methods",
					content:
						"Define and call methods that take inputs and return results, including a sum method and a coin-flip simulation that uses random values and conditional logic. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Arrays",
					content:
						"Create empty and pre-populated arrays, access specific elements, and use loops to fill arrays, print them, and update every element. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Two-Dimensional Arrays",
					content:
						"Create and access a 2D array, inspect its row and column counts, set specific values, and use nested loops to print every element. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Fill an integer array with random values and write a method called `countNumElementsAboveFive()` that returns how many entries are greater than 5. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS7-Practice-with-Arrays"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					content:
						"Extend the work from Check-In #2 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1"
				},
				{
					title: "Check In #2: Fluency Drill",
					content:
						"Repeat the core ideas from Check-In #2 on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
						"Extend the project into a configurable multiplayer Battleship game with custom board sizes, multiple ship types, setup validation, alternating turns, and win detection. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
					content:
						"Close JS9 Master Project: Battleship by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Battleship: Extension Challenge",
					content:
						"Extend the work from JS9 Master Project: Battleship with a tighter constraint, one extra feature, or a slightly more realistic input case. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS9-Simple-Battleship"
				},
				{
					title: "Master Project: Battleship: Fluency Drill",
					content:
						"Repeat the core ideas from JS9 Master Project: Battleship on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			]
		},
		{
			title: "Applied Studio 12: J1X02 java foundations build 13",
			curriculum: [
				{
					title: "J1X02 java foundations build 13: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: J1X02 java foundations build 13, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "J1X02 java foundations build 13: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: J1X02 java foundations build 13, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "J1X02 java foundations build 13: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: J1X02 java foundations build 13. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X02-java-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X02-java-foundations-build-13/solution"
				},
				{
					title: "J1X02 java foundations build 13: Review and Reflection",
					content:
						"Close Applied Studio 12: J1X02 java foundations build 13 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "J1X02 java foundations build 13: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: J1X02 java foundations build 13 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X02-java-foundations-build-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X02-java-foundations-build-13/solution"
				},
				{
					title: "J1X02 java foundations build 13: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 12: J1X02 java foundations build 13. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 13: J1X03 java foundations build 14",
			curriculum: [
				{
					title: "J1X03 java foundations build 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: J1X03 java foundations build 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "J1X03 java foundations build 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: J1X03 java foundations build 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "J1X03 java foundations build 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: J1X03 java foundations build 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X03-java-foundations-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X03-java-foundations-build-14/solution"
				},
				{
					title: "J1X03 java foundations build 14: Review and Reflection",
					content:
						"Close Applied Studio 13: J1X03 java foundations build 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "J1X03 java foundations build 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: J1X03 java foundations build 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X03-java-foundations-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X03-java-foundations-build-14/solution"
				},
				{
					title: "J1X03 java foundations build 14: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 13: J1X03 java foundations build 14. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 14: J1X04 java foundations build 15",
			curriculum: [
				{
					title: "J1X04 java foundations build 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: J1X04 java foundations build 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "J1X04 java foundations build 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: J1X04 java foundations build 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "J1X04 java foundations build 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: J1X04 java foundations build 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X04-java-foundations-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X04-java-foundations-build-15/solution"
				},
				{
					title: "J1X04 java foundations build 15: Review and Reflection",
					content:
						"Close Applied Studio 14: J1X04 java foundations build 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "J1X04 java foundations build 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: J1X04 java foundations build 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X04-java-foundations-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X04-java-foundations-build-15/solution"
				},
				{
					title: "J1X04 java foundations build 15: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 14: J1X04 java foundations build 15. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 15: J1X05 java foundations build 16",
			curriculum: [
				{
					title: "J1X05 java foundations build 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: J1X05 java foundations build 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "J1X05 java foundations build 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: J1X05 java foundations build 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "J1X05 java foundations build 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: J1X05 java foundations build 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X05-java-foundations-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X05-java-foundations-build-16/solution"
				},
				{
					title: "J1X05 java foundations build 16: Review and Reflection",
					content:
						"Close Applied Studio 15: J1X05 java foundations build 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "J1X05 java foundations build 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: J1X05 java foundations build 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X05-java-foundations-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X05-java-foundations-build-16/solution"
				},
				{
					title: "J1X05 java foundations build 16: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 15: J1X05 java foundations build 16. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 16: J1X06 java foundations build 17",
			curriculum: [
				{
					title: "J1X06 java foundations build 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: J1X06 java foundations build 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "J1X06 java foundations build 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: J1X06 java foundations build 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "J1X06 java foundations build 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: J1X06 java foundations build 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X06-java-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X06-java-foundations-build-17/solution"
				},
				{
					title: "J1X06 java foundations build 17: Review and Reflection",
					content:
						"Close Applied Studio 16: J1X06 java foundations build 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "J1X06 java foundations build 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: J1X06 java foundations build 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X06-java-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/J1X06-java-foundations-build-17/solution"
				},
				{
					title: "J1X06 java foundations build 17: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 16: J1X06 java foundations build 17. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 17: Temperature Converter",
			curriculum: [
				{
					title: "Temperature Converter: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: Temperature Converter, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "Temperature Converter: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: Temperature Converter, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Temperature Converter: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: Temperature Converter. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter"
				},
				{
					title: "Temperature Converter: Review and Reflection",
					content:
						"Close Applied Studio 17: Temperature Converter by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Temperature Converter: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: Temperature Converter with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-1/tree/main/JS2-Temperature-Converter"
				},
				{
					title: "Temperature Converter: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 17: Temperature Converter. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		}
	]
};
