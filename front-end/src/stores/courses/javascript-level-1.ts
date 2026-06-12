import type { RawCourse } from "./types";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const javascriptLevel1Course: RawCourse = {
	name: "JavaScript Level 1: JavaScript Superstar",
	modules: [
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this checkpoint as a review of JavaScript variables, operators, randomness, loops, conditionals, SVG drawing, and nested loops. Each prompt should produce a small runnable example and a short explanation of why the chosen JavaScript structure fits the task. The goal is to identify which fundamentals are fluent and which ones need more practice before the next project sequence.",
					solutionLink:
						"https://codepen.io/junilearning/pen/9023ac5a2ab1213c64d59d7b864aef8d"
				},
				{
					title: "Check-In #1: Variables",
					content:
						"Create variables for three different kinds of data: a number, a string, and a boolean. Then ask for a favorite color with `prompt()`, store the response in `userColor`, and use the value in two outputs: a `printToScreen()` sentence and an `alert()`. Check that the variable name, stored value, and printed message all match."
				},
				{
					title: "Check-In #1: Mathematical Operators and Randomness",
					content:
						"Generate a random number from 1 through 256, convert it into an integer, then apply several arithmetic operations to that value. Print the original integer, the value plus 5, the value multiplied by 10, and at least one remainder calculation. The finished code should make the order of operations and rounding step easy to inspect."
				},
				{
					title: "Check-In #1: Loops",
					content:
						"Compare a `for` loop and a `while` loop by using both to print the even numbers from 0 through 20. Then use a loop to generate six random integers from 0 through 10 and keep a running sum. Verify the loop count, update step, and final total by printing enough intermediate information to catch off-by-one mistakes."
				},
				{
					title: "Check-In #1: Conditionals",
					content:
						"Review `if`, `else if`, and `else` branches. Write a program that asks for a number; if the number is less than or equal to 50, print a success message, otherwise print a sorry message. Create booleans for homework and chores; if both are true, print that going outside is allowed, otherwise print that it is not. Then update the condition to allow going outside if either value is true using `||`."
				},
				{
					title: "Check-In #1: Drawing in JavaScript",
					content:
						"Create a 500-by-500 SVG and draw two aligned shapes: a green square at `x=100`, `y=120`, `width=200`, `height=200`, and a blue circle centered inside the square with radius 50. Use the square's position and size to reason about the circle's center point instead of guessing coordinates."
				},
				{
					title: "Check-In #1: Nested Loops",
					content:
						"Use nested loops to print a shrinking star pattern: four stars, then three, then two, then one. Build the pattern once with nested `for` loops and again with nested `while` loops. The outer loop should control the row and the inner loop should control how many stars appear in that row."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Build a three-round random number guessing game with golf-style scoring. Each round should choose a target number, allow three guesses, compare each guess to the target, and award fewer points for closer guesses. Track total score across rounds and print enough feedback for a player to understand whether a guess was close, far away, or exact.",
					projectLink:
						"https://codepen.io/junilearning/pen/b04e9208251c84d123c97daf37972988",
					solutionLink:
						"https://codepen.io/junilearning/pen/e0a4c125fb9fa7f0324934dc2fe9317f"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Check In #1",
						section: "extension"
					}),
					solutionLink:
						"https://codepen.io/junilearning/pen/9023ac5a2ab1213c64d59d7b864aef8d"
				},
				{
					title: "Check In #1 supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "Check-In #1",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-01-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-01-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check In #1 supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "Check-In #1",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-02-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-02-check-in-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"Use this checkpoint to review the web-development half of JavaScript Level 1: HTML structure, CSS layout, D3 animation, DOM events, components, and responsive page layout. Each task should connect a visible result to the underlying markup, style rule, or JavaScript event that created it.",
					solutionLink:
						"https://codepen.io/junilearning/pen/ce3da888e3e72bcaff1251f225b2f6fa"
				},
				{
					title: "Check-In #2: HTML & CSS",
					content:
						"Review HTML tags, nesting, and the difference between `div` and `span`. Create a red class-based `div` with a fixed height, compare `block`, `inline-block`, and `inline`, then build a yellow box with margin, padding, and a border so the box model is visible. Finish by placing a blue square at the top-left of the page, scrolling the page, and explaining how position and `z-index` affect layering.",
					projectLink:
						"https://codepen.io/junilearning/pen/f52dbec392b0c8ec4d21abcf8aecad43",
					solutionLink:
						"https://codepen.io/junilearning/pen/ce3da888e3e72bcaff1251f225b2f6fa"
				},
				{
					title: "Check-In #2: Animations and JavaScript Components",
					content:
						"Draw a red square with D3, animate it so the square doubles in size, and add a `mouseover` interaction that transitions the square to green. Then use the Materialize documentation to add a collapsible component. Confirm which code creates the SVG shape, which code handles animation, and which code initializes the external component."
				},
				{
					title: "Check-In #2: Website Layout",
					content:
						"Compare a page section with a layout container, then build two small layout examples: a 3-by-3 CSS Grid with alternating colors and a 3-by-3 Materialize grid with numbers 1 through 9. Add one icon and demonstrate how its display or placement changes on a smaller screen."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Replicate the snowflake pattern with D3 shapes and animation. Break the snowflake into repeated arms or segments, use a loop or helper to avoid manually duplicating every piece, and animate at least one property such as rotation, opacity, size, or position so the final result shows both structure and motion.",
					projectLink: "https://codepen.io/junilearning/pen/vYGWvaq",
					solutionLink:
						"https://codepen.io/junilearning/pen/084c3032877fa7f9c828bba2c5798551"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Check In #2",
						section: "extension"
					}),
					solutionLink:
						"https://codepen.io/junilearning/pen/ce3da888e3e72bcaff1251f225b2f6fa"
				},
				{
					title: "Check In #2 supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "Check-In #2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-03-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-03-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check In #2 supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "Check-In #2",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-04-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-04-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS1 Variables and Data Types",
			curriculum: [
				{
					title: "Introductions & Setup",
					content:
						'Get comfortable with the browser-based coding workspace by creating a CodePen account, forking https://codepen.io/junilearning/pen/JjGrYOG, saving changes, and running code. Start by calling printToScreen("Hello World"); in JavaScript.'
				},
				{
					title: "Variables and Data Types",
					content:
						'Project Link: https://codepen.io/junilearning/pen/eYpBWWX\nUse let and const for numbers, strings, booleans, null and undefined. Assign values, use printToScreen(), explain comments, and show converting string numbers with a leading +. Compare "1" + "1" to 1 + 1.'
				},
				{
					title: "User Input and Printing",
					content:
						"Use `prompt()` to collect text from the user and store the response in a variable. Display information three ways: `printToScreen()` for visible page output, `console.log()` for developer/debug output, and `alert()` for a popup message. Open the browser console and verify that console output is separate from page output."
				},
				{
					title: "Strings",
					content:
						"Treat strings as ordered characters whose indices start at 0. Practice reading a character by index, joining strings with `+`, and measuring text with `.length`. Remember that `prompt()` returns a string even when the user types digits, so numeric input needs conversion before arithmetic."
				},
				{
					title: "JSS1 Project 1: Welcome Survey",
					content:
						"Build a short welcome survey that collects a first name, last name, two numeric inputs, and a favorite food. Print the full name as one sentence, convert the numeric inputs before adding them, log the sum to the console, and alert the last letter of the favorite food. Test a one-letter food and a multi-word name so indexing and concatenation are not only tested on easy input.",
					projectLink: "https://codepen.io/junilearning/pen/OJMxyqw",
					solutionLink:
						"https://codepen.io/junilearning/pen/1efb04d2b3e13694f1bf614fef02c22c"
				},
				{
					title: "Debugging",
					content:
						"Compare syntax errors, which prevent code from running, with logic errors, which run but produce the wrong result. Use console error messages, out-of-range string indexing, type-conversion mistakes, and the `debugger` keyword to inspect program state. The debugging habit is to change one thing, rerun, and verify what changed."
				},
				{
					title: "JSS1 Project 2: Mad Libs",
					content:
						"Create a Mad Libs story that uses `prompt()` to collect at least five words, stores each response in a clearly named variable, and prints a complete story with `printToScreen()`. The story should include punctuation and spaces intentionally so the final sentence reads naturally instead of looking like raw concatenated fragments.",
					projectLink: "https://codepen.io/junilearning/pen/qBbPbPp",
					solutionLink:
						"https://codepen.io/junilearning/pen/ce06ca273ecc8c28529261846833d4c1"
				}
			],
			supplementalProjects: [
				{
					title: "JSS1 Supplemental Project 1: Cookie Math",
					content:
						"Use `prompt()` to ask how much flour is available, convert the input to a number, and calculate how many eggs and chocolate chips are needed for the matching recipe amount. Decide where rounding is necessary, such as with `Math.ceil()`, and print the recipe recommendation clearly enough that the units and rounded values are not ambiguous.",
					projectLink: "https://codepen.io/junilearning/pen/rNxGxKm",
					solutionLink:
						"https://codepen.io/junilearning/pen/27b890b0097969f24289d9abf77d1392"
				},
				{
					title: "JSS1 Supplemental Project 2: Hello World!",
					content:
						"Use string indexing to construct `Hello World!` from provided strings. Identify the index of each needed character, store or print the characters in order, and verify that spaces and punctuation are included intentionally. This project should make zero-based indexing concrete rather than relying on a prewritten full phrase.",
					projectLink: "https://codepen.io/junilearning/pen/MWKEKPJ",
					solutionLink:
						"https://codepen.io/junilearning/pen/36a808fbb70a55e25889b07c74debb6a"
				},
				{
					title: "JSS1 Supplemental Project 3: Debugging a Friend Survey",
					content:
						"Debug a friend's survey code by checking prompts, variable names, string concatenation, numeric conversion, and output statements. Run the broken version first, list what the program should ask and print, then fix one issue at a time until every answer appears in the intended place.",
					projectLink: "https://codepen.io/junilearning/pen/VwexoXw",
					solutionLink:
						"https://codepen.io/junilearning/pen/a16730b9a6d5bba63389d9e3f5614ab9"
				}
			]
		},
		{
			title: "JSS2 Operators and Math",
			curriculum: [
				{
					title: "Introduction to Operators",
					content:
						"An operator changes or combines values. Practice `+`, `-`, `*`, `/`, and `%`, then compare those arithmetic operators with the assignment operator `=`, which stores a value. Use compound assignment such as `+=` and `*=` when updating an existing variable, and test `++` or `--` only when the one-step change is clear."
				},
				{
					title: "Math Methods",
					content:
						"Use JavaScript's `Math` methods to make calculations more expressive. Practice `Math.random()`, `Math.floor()`, `Math.ceil()`, `Math.PI`, and `Math.pow()`. For random integers, show the full transformation from a decimal between 0 and 1 to a useful whole-number range, then test the smallest and largest possible values."
				},
				{
					title: "JSS2 Project 1: Tips and Taxes",
					content:
						"Prompt for meal cost, tax percent, and tip percent, then calculate the final total. Convert all numeric inputs before arithmetic, show the intermediate tax and tip values, and print the final cost with a readable label. Test a whole-dollar meal and a decimal meal cost so rounding and formatting choices are visible.",
					projectLink: "https://codepen.io/junilearning/pen/RwrLayP",
					solutionLink:
						"https://codepen.io/junilearning/pen/06257a44b94db1486fac683ccaace7be"
				},
				{
					title: "JSS2 Project 2: Randomly Random Party",
					content:
						"Generate a random party date and start time. Choose a month from 5 through 7, a day from 1 through 30, an hour from 10 through 20, and a minute from 0 through 59. Print the result in a readable sentence, and verify that the random formulas cannot produce an impossible value outside the intended ranges.",
					projectLink: "https://codepen.io/junilearning/pen/xxZXVye",
					solutionLink:
						"https://codepen.io/junilearning/pen/29d1e4fde67a75fc4b5cdcacd458cb8d"
				},
				{
					title: "JSS2 Project 3: What's the Password?",
					content:
						"Compute a numeric password from a sequence of math steps involving `Math.PI`, powers, addition, division with `Math.floor()`, and modulo. Keep each step in a named variable or clearly separated line so the password can be traced and checked. Print the final result with `printToScreen()` after verifying the intermediate values.",
					projectLink: "https://codepen.io/junilearning/pen/PoZJNXb",
					solutionLink:
						"https://codepen.io/junilearning/pen/c550ef1e284c55fa01964589bf19b21c"
				}
			],
			supplementalProjects: [
				{
					title: "JSS2 Supplemental Project 1: Pie Eating Contest",
					content:
						"Prompt for the starting number of pies, randomly choose how many pies one contestant eats from 1 through 5, and recalculate how many pies remain for the other contestants. Print the starting amount, amount eaten, remaining amount, and leftovers after division so the arithmetic story is easy to follow.",
					projectLink: "https://codepen.io/junilearning/pen/jOWGqJZ",
					solutionLink:
						"https://codepen.io/junilearning/pen/a9612fb435c5e334490c1eeb72e9c567"
				},
				{
					title: "JSS2 Supplemental Project 2: Random Practice",
					content:
						"Print random numbers from several target ranges: 0 through 5, 1 through 10, 20 through 50, even numbers from 0 through 50, and odd numbers from 51 through 101. For each range, write the formula first, then run several samples to check that the endpoints and parity rules are possible.",
					projectLink: "https://codepen.io/junilearning/pen/JjGrXgg",
					solutionLink:
						"https://codepen.io/junilearning/pen/5bbc99927a71e48ec59e93b8dfbb585c"
				},
				{
					title: "JSS2 Supplemental Project 3: Circles",
					content:
						"Use a modified `printToScreen(start, end)` helper to draw arcs. Convert degrees to radians before drawing, then create a rainbow arc, a full circle, and a three-quarter circle. Keep the angle values visible in the code so it is clear why each arc opens or closes where it does.",
					projectLink: "https://codepen.io/junilearning/pen/yLezJLx",
					solutionLink:
						"https://codepen.io/junilearning/pen/d004723cc01403a3db897db1206f449b"
				},
				{
					title: "JSS2 Supplemental Project 4: Debugging Math Homework",
					content:
						"Debug the math-homework program by first identifying the expected numeric result, then tracing each arithmetic step in the existing code. Fix one error at a time, rerun after each change, and leave the final version readable enough that the order of operations, rounding behavior, and printed answer are easy to verify.",
					projectLink: "https://codepen.io/junilearning/pen/VwexoVL",
					solutionLink:
						"https://codepen.io/junilearning/pen/f90710cc7e05de72ea7ff2b8b05a32bd"
				}
			]
		},
		{
			title: "JSS3 For and While Loops",
			curriculum: [
				{
					title: "For Loops",
					content:
						"A `for` loop is useful when the number of repetitions or the counting pattern is known. Read the loop as three parts: initialization, continuation condition, and update step. Practice by printing 0 through 9, multiples of 3, and countdowns, then trace the first two and last two iterations to confirm where the loop starts and stops."
				},
				{
					title: "JSS3 Project 1: For Loops Practice",
					content:
						"Use `printToScreen()` and `for` loops to print several numeric sequences: 1 through 50, 50 down to 1, even numbers through 100, odd numbers down from 100, powers of 3, and the sequence 500, 100, 20, 4. Each sequence should have its own loop rule so the start value, condition, and update step are visible.",
					projectLink: "https://codepen.io/junilearning/pen/PoZJGKV",
					solutionLink:
						"https://codepen.io/junilearning/pen/8c4bf4ddfb48b6a93a41d0347d6f78ef"
				},
				{
					title: "While Loops",
					content:
						"A `while` loop repeats as long as its condition stays true. It is useful when the stopping point depends on a changing value rather than a fixed number of repetitions. Every `while` loop should have a clear starting value, a condition, and an update that moves the loop toward stopping; otherwise it can become infinite."
				},
				{
					title: "JSS3 Project 2: String Reversal",
					content:
						"Prompt for a word, then print its letters forward with a `for` loop and backward with a `while` loop. Use string indices deliberately: the forward loop should start at 0, while the backward loop should start at the last valid index. Test a one-letter word and a longer word to confirm the boundary logic.",
					projectLink: "https://codepen.io/junilearning/pen/OJMxRvY",
					solutionLink:
						"https://codepen.io/junilearning/pen/3f802bef974fcccd10caafaac8c3eb04"
				},
				{
					title: "JSS3 Project 3: Looping Squares",
					content:
						"Use loops to print repeated colored squares with `printToScreen()`: two red squares, three yellow squares, four blue squares, and three purple squares. Use `for` loops for some groups and `while` loops for others, then compare which version makes the repeat count easiest to read.",
					projectLink: "https://codepen.io/junilearning/pen/xxZXEzP",
					solutionLink:
						"https://codepen.io/junilearning/pen/56baa6b060aab0e3511c7c3608d53eaa"
				}
			],
			supplementalProjects: [
				{
					title: "JSS3 Supplemental Project 1: Powers of 3",
					content:
						"Print every power of 3 that is less than 5000. Start with a value of 1, repeatedly multiply by 3, and stop before the value reaches the limit. The output should make the growth pattern clear, and the loop should avoid printing the first value that is too large.",
					projectLink: "https://codepen.io/junilearning/pen/wvMrzEw",
					solutionLink:
						"https://codepen.io/junilearning/pen/1c1201771499a38d4f15588580d7bfa1"
				},
				{
					title: "JSS3 Supplemental Project 2: Forgotten Math",
					content:
						"Compute the product of two user inputs without using `*` or `*=`. Use repeated addition in a loop, track the running total, and print the final result. Test multiplying by 0, multiplying by 1, and multiplying two larger positive numbers so the loop logic is not only tested on one easy case.",
					projectLink: "https://codepen.io/junilearning/pen/gOPGwBy",
					solutionLink:
						"https://codepen.io/junilearning/pen/53206f1e4800c28a4549aea7be49b7e0"
				},
				{
					title: "JSS3 Supplemental Project 3: Debugging Loops",
					content:
						"Repair the race simulation by tracing how each loop changes racer position over time. Verify that the loop starts at the right value, updates on every iteration, stops at the correct finish condition, and prints a final result that matches the simulated race state.",
					projectLink: "https://codepen.io/junilearning/pen/KKVGBWx",
					solutionLink:
						"https://codepen.io/junilearning/pen/d56a9a00a8022b7f85434f295cc0dbec"
				}
			]
		},
		{
			title: "JSS4 Combining Loops and Variables",
			curriculum: [
				{
					title: "Combining Loops and Variables",
					content:
						"Loops become more useful when variables change inside them. Use counters, totals, guesses, lives, or attempts to represent program state, then update that state on each iteration. The important habit is to identify what changes, where it changes, and how that change affects the loop condition or final output."
				},
				{
					title: "JSS4 Project 1: Totaling Up",
					content:
						"Write loops that build totals over time: sum the numbers from 1 through 100, sum the squares from 1 through 100, and compute the factorial of a user input. Use separate accumulator variables for each task, initialize them correctly, and print intermediate or final values with labels so the calculation can be checked.",
					projectLink: "https://codepen.io/junilearning/pen/gOPGwNV",
					solutionLink:
						"https://codepen.io/junilearning/pen/71ad8b99ac4c707e75b4f0e136f82665"
				},
				{
					title: "JSS4 Project 2: Coin Machine",
					content:
						"Ask for an amount of cents and break it into coins. Use division, modulo, or `while` loops to determine quarters, dimes, nickels, and pennies. Print each coin count with a label, and test values such as 0, 4, 25, 41, and 99 cents to confirm that leftover amounts are handled correctly.",
					projectLink: "https://codepen.io/junilearning/pen/VweMmZq",
					solutionLink:
						"https://codepen.io/junilearning/pen/17494fdc78b6e93db4e8206101f45ea7"
				},
				{
					title: "ASCII",
					content:
						"Character codes represent text characters as numbers, which makes it possible to shift or generate characters with arithmetic. Use `char.charCodeAt()` to inspect a character's numeric code and `String.fromCharCode()` to convert a number back into a character. Test uppercase letters, lowercase letters, digits, and punctuation so the ranges are not treated as one continuous alphabet."
				},
				{
					title: "JSS4 Project 3: Random Password",
					content:
						"Create a random password by generating letters and numbers, then combining them in an alternating pattern. Use ASCII or random index choices for characters, store the growing password in a variable, and verify that the requested length and character pattern match the output every time the program runs.",
					projectLink: "https://codepen.io/junilearning/pen/jOWGVVB",
					solutionLink:
						"https://codepen.io/junilearning/pen/1520f836e15f3d4e7f554b913a805b02"
				}
			],
			supplementalProjects: [
				{
					title: "JSS4 Supplemental Project 1: Debugging Football",
					content:
						"Debug the football-drive simulation by tracking yards, downs, and stopping conditions. The final program should update the drive state consistently, avoid off-by-one loop mistakes, and print enough information to tell whether the drive ends by scoring, failing, or reaching the intended limit.",
					projectLink: "https://codepen.io/junilearning/pen/gOPRqPr",
					solutionLink:
						"https://codepen.io/junilearning/pen/eb1d816cbecce4d20944284fc085ae36"
				},
				{
					title: "Combining Loops and Variables supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS4 Combining Loops and Variables",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-05-jss4-combining-loops-and-variables-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-05-jss4-combining-loops-and-variables-supplemental-2/solution"
				},
				{
					title: "Combining Loops and Variables supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS4 Combining Loops and Variables",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-06-jss4-combining-loops-and-variables-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-06-jss4-combining-loops-and-variables-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS5 Conditionals",
			curriculum: [
				{
					title: "Introduction to Conditionals",
					content:
						"Conditionals let a program choose what happens based on whether a condition is true. Start with simple real-world examples, then connect them to JavaScript `if` syntax: a condition in parentheses and a block of code in braces. Test both a true case and a false case so the branch behavior is visible."
				},
				{
					title: "Equivalence Operators",
					content:
						"Use comparison operators to create boolean expressions: `>`, `<`, `>=`, `<=`, `===`, and `!==`. Practice using `!` to invert a boolean, then build small `if` checks that print which comparison was true. Prefer strict equality so the code does not hide type-conversion surprises."
				},
				{
					title: "JSS5 Project 1: A-Checker",
					content:
						"Prompt for a word and check whether it contains the letter `a`. Use a loop to inspect characters one at a time and a conditional to detect a match. Print a clear result for words that contain `a` and words that do not, then test uppercase, lowercase, and empty input if the project allows it.",
					projectLink: "https://codepen.io/junilearning/pen/QWyqrLo",
					solutionLink:
						"https://codepen.io/junilearning/pen/3ef023d001ee721f608cac6b87a41bd2"
				},
				{
					title: "Else and Else If",
					content:
						"`else if` and `else` let one decision chain cover multiple outcomes. Use `if` for the first condition, `else if` for additional specific conditions, and `else` for the fallback. Check that the branches are ordered from most specific to most general when the conditions can overlap."
				},
				{
					title: "JSS5 Project 2: What Grade Is This?",
					content:
						"Given a number from 0 through 100, print the matching letter grade with an `if`/`else if`/`else` chain. Decide how boundary values such as 90, 80, 70, and invalid scores should be handled before coding. Test the exact boundary values as well as one score in the middle of each grade range.",
					projectLink: "https://codepen.io/junilearning/pen/yLezjje",
					solutionLink:
						"https://codepen.io/junilearning/pen/2d86a137a1c362df390051e86a298e9d"
				},
				{
					title: "Advanced String Functions",
					content:
						"Use template strings to build readable output with backticks and embedded placeholder expressions. Then use `.toUpperCase()` and `.toLowerCase()` to normalize or transform text. These tools are especially useful when user input might have unexpected capitalization."
				},
				{
					title: "JSS5 Project 3: Wholesome Memes",
					content:
						"Convert a sentence to alternating case, such as `tHaT lOoKs LiKe ThIs`. Loop through the characters, use conditionals or index parity to decide uppercase versus lowercase, and preserve spaces or punctuation intentionally. An extension can use ASCII checks so only alphabetic characters affect the alternating pattern.",
					projectLink: "https://codepen.io/junilearning/pen/wvMrXdG",
					solutionLink:
						"https://codepen.io/junilearning/pen/bf0a3506f98d1b247c3f259986a941bd"
				}
			],
			supplementalProjects: [
				{
					title: "JSS5 Supplemental Project 1: Login Credentials",
					content:
						"Build a simple login loop that keeps prompting until the username and password match the expected credentials. Track attempts if useful, give clear failure feedback, and alert success only when both values match. Make sure the loop has a reliable stopping condition so it does not continue after a correct login.",
					projectLink: "https://codepen.io/junilearning/pen/QWyqxqp",
					solutionLink:
						"https://codepen.io/junilearning/pen/d0f771c4f6fd24c86077e6b3fee4fa72"
				},
				{
					title: "JSS5 Supplemental Project 2: Snake Eyes",
					content:
						"Simulate rolling two dice until both dice show 1. Each iteration should roll both dice, count the attempt, and decide whether the stopping condition has been met. Print the total number of rolls and enough sample roll information to verify that the loop is actually waiting for snake eyes.",
					projectLink: "https://codepen.io/junilearning/pen/jOWGKZw",
					solutionLink:
						"https://codepen.io/junilearning/pen/6580937e9dfd9ce926651a6fe915e078"
				},
				{
					title: "JSS5 Supplemental Project 3: Debugging the Favorite Fruit Guesser",
					content:
						"Debug a fruit guesser that uses color and taste conditionals. First identify the intended decision tree, then check whether each condition is testing the correct variable and whether the branches are ordered correctly. Test at least one input that should match, one that should almost match, and one that should fall through to the default result.",
					projectLink: "https://codepen.io/junilearning/pen/PoZdQeW",
					solutionLink:
						"https://codepen.io/junilearning/pen/949d30ec6dbcc0dfdda259392403b0b7"
				}
			]
		},
		{
			title: "JSS6 Advanced Conditionals",
			curriculum: [
				{
					title: "Nested Conditionals",
					content:
						"Nested conditionals place one `if` statement inside another when a second decision only matters after the first decision is true. Use nesting sparingly: it is useful for dependent checks, but long nested code can become hard to read. Compare a nested version with a combined-condition version when both are possible."
				},
				{
					title: "JSS6 Project 1: The Sorting Hat",
					content:
						"Prompt for a preferred house and a personal quality, then use conditionals to decide whether the answers match the house rules. Print a sorting result when the combination is valid and a retry or mismatch message when it is not. Keep each house rule readable enough that the decision can be tested with several input combinations.",
					projectLink: "https://codepen.io/junilearning/pen/JjGrxRB",
					solutionLink:
						"https://codepen.io/junilearning/pen/e7c85cf84c953eb5bc630e214fe476d8"
				},
				{
					title: "AND & OR Operators",
					content:
						"`&&` requires both sides to be true, while `||` requires at least one side to be true. Use small examples to show how combined conditions reduce nested code. Also note short-circuit behavior: JavaScript may skip the second expression when the first expression already determines the result."
				},
				{
					title: "JSS6 Project 2: FizzBuzz",
					content:
						"Print the numbers from 1 through 100, but replace multiples of 3 with `Fizz`, multiples of 5 with `Buzz`, and multiples of both with `FizzBuzz`. Check the combined 3-and-5 condition first so 15, 30, and similar values do not get caught by a simpler branch too early.",
					projectLink: "https://codepen.io/junilearning/pen/gOPGqKa",
					solutionLink:
						"https://codepen.io/junilearning/pen/0b39a6e7b85b790e7cd9a276e9ee2c4f"
				},
				{
					title: "True Versus Truthy",
					content:
						"JavaScript distinguishes strict truth from truthy and falsy values. Compare `==`, which can coerce types, with `===`, which checks both value and type. Use examples such as empty strings, 0, nonempty strings, and booleans, then prefer `===` and `!==` unless coercion is intentional."
				},
				{
					title: "Switch Statements",
					content:
						"A `switch` statement is useful when one expression should be compared against several exact cases. Each case should handle one expected value, `break` should prevent accidental fall-through, and `default` should handle unknown values. Test at least one known case and one default case."
				},
				{
					title: "JSS6 Project 3: GCF of Two Numbers",
					content:
						"Find the greatest common factor of two input numbers. Iterate through possible factors, check which values divide both numbers evenly, and keep track of the largest valid factor found so far. Test pairs with a factor greater than 1, pairs whose GCF is 1, and pairs where the two inputs are equal.",
					projectLink: "https://codepen.io/junilearning/pen/NWxaJdX",
					solutionLink:
						"https://codepen.io/junilearning/pen/b418881c3e60c8c7ac8fcbc3b7d74aa0"
				}
			],
			supplementalProjects: [
				{
					title: "JSS6 Supplemental Project 1: What Does the _ Say?",
					content:
						"Use a `switch` statement to map several animal names to the sounds they make. Include a `default` case for unknown animals, check that every case ends correctly with `break`, and test at least one recognized animal plus one unrecognized input.",
					projectLink: "https://codepen.io/junilearning/pen/NWxaJgy",
					solutionLink:
						"https://codepen.io/junilearning/pen/5b0bdb527344a081c9abf91138ce5f4a"
				},
				{
					title: "JSS6 Supplemental Project 2: Debugging Bugging Friends",
					content:
						"Debug a program that decides whether messaging frequency is too high. Identify the intended thresholds, check whether `&&` or `||` is appropriate in each condition, and verify that edge values exactly on the threshold behave as expected. The fixed version should explain why each branch fires.",
					projectLink: "https://codepen.io/junilearning/pen/mdVGXLE",
					solutionLink:
						"https://codepen.io/junilearning/pen/67b0c29a104afde9cce553de6cacf882"
				},
				{
					title: "Advanced Conditionals supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS6 Advanced Conditionals",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-07-jss6-advanced-conditionals-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-07-jss6-advanced-conditionals-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS7 Drawing in JavaScript",
			curriculum: [
				{
					title: "Introduction to D3",
					content:
						"D3 can create and modify SVG elements with JavaScript. Start by adding D3 to CodePen, appending an SVG, and setting width and height attributes. Treat pixels as coordinates on the drawing surface, and keep chained calls readable by formatting each major step on its own line when the code becomes hard to scan."
				},
				{
					title: "Drawing Shapes in D3",
					content:
						"Draw rectangles, circles, and ellipses by appending SVG elements and setting their attributes. Use `x`, `y`, `width`, `height`, and `fill` for rectangles; `cx`, `cy`, and `r` for circles; and `rx` and `ry` for ellipses. Verify each shape by changing one coordinate or size attribute and predicting how the drawing will move.",
					projectLink: "https://codepen.io/junilearning/pen/zYrPBYM",
					solutionLink:
						"https://codepen.io/junilearning/pen/7ba2616cfb21c6a3fbf71ee0cfb78332"
				},
				{
					title: "Drawing Arcs",
					content:
						"Use `d3.arc()` to create curved shapes from `startAngle`, `endAngle`, `innerRadius`, and `outerRadius`. Angles must be in radians, so keep any degree-to-radian conversion visible. Attach the arc to a `path` through the `d` attribute and use `transform: translate(...)` to position it on the SVG canvas."
				},
				{
					title: "JSS7 Project 2: Smiley Face",
					content:
						"Draw a smiley face with D3 by combining circles, ellipses, and an arc-based mouth. Use `degreesToRadians()` or a similar helper so the mouth angles are understandable. The final drawing should place both eyes symmetrically and position the mouth relative to the face center instead of relying on unexplained coordinates.",
					projectLink: "https://codepen.io/junilearning/pen/MWKOeRd",
					solutionLink:
						"https://codepen.io/junilearning/pen/593993382174caa7d510ddbd5b0009d8"
				},
				{
					title: "JSS7 Project 3: Pac-Man",
					content:
						"Draw Pac-Man as an arc with a missing slice. Choose start and end angles that leave a visible mouth opening, set the inner radius to create a filled wedge, and translate the shape to the correct position. Test a wider and narrower mouth by changing only the angle values.",
					projectLink: "https://codepen.io/junilearning/pen/JjGORoK",
					solutionLink:
						"https://codepen.io/junilearning/pen/6df064875eb631bc08eab5c342ef98f7"
				}
			],
			supplementalProjects: [
				{
					title: "JSS7 Supplemental Project 1: Snowman",
					content:
						"Draw a snowman from multiple D3 shapes: stacked circles for the body, smaller shapes for eyes/buttons, arcs or lines for facial details, and optional lines for arms. Build the drawing from named sections so the body, face, and accessories can be adjusted independently.",
					projectLink: "https://codepen.io/junilearning/pen/GRoOjjx",
					solutionLink:
						"https://codepen.io/junilearning/pen/bb6f6bcdf7ff47fef8a5f2dc3a2138f0"
				},
				{
					title: "JSS7 Supplemental Project 2: Captain America's Shield",
					content:
						"Draw Captain America's shield with concentric circular or arc shapes and a centered star. Use the D3 symbol documentation for the star, keep the center coordinates consistent across layers, and verify that later shapes do not accidentally cover the star or important ring boundaries.",
					projectLink: "https://codepen.io/junilearning/pen/VweRVWq",
					solutionLink:
						"https://codepen.io/junilearning/pen/0736d5c2045c3ecd6969c5284b93b067"
				},
				{
					title: "JSS7 Supplemental Project 3: Debugging Olaf's Star",
					content:
						"Repair the D3 drawing so the star appears in the intended position on the snowman. Trace the shape creation, fill/stroke settings, and transform coordinates, then confirm the final drawing still preserves the rest of the snowman while adding the missing star.",
					projectLink: "https://codepen.io/junilearning/pen/rNxZJdQ",
					solutionLink:
						"https://codepen.io/junilearning/pen/20aeca54176134a3397922a9e98f3564"
				}
			]
		},
		{
			title: "JSS8 Nested Loops",
			curriculum: [
				{
					title: "Nested Loops",
					content:
						"Nested loops place one loop inside another so a program can repeat groups of repeated actions. The outer loop usually controls rows, rounds, or groups; the inner loop controls the repeated work inside each group. Use `i` and `j` examples, but focus on what each counter represents rather than memorizing the variable names."
				},
				{
					title: "JSS8 Project 1: Multiplication Tables",
					content:
						"Use nested loops to print multiplication tables from 1 through 10. The outer loop should choose the row number and the inner loop should choose the column number. Print each product in a readable format and count how many multiplication operations occur so the connection between nested loops and total work is visible.",
					projectLink: "https://codepen.io/junilearning/pen/WNrXoBj",
					solutionLink:
						"https://codepen.io/junilearning/pen/431a3c1e61b0fe9d0e6fa2e16e6d37f6"
				},
				{
					title: "JSS8 Project 2: Pattern Production",
					content:
						"Create a repeated pattern in two forms. First print a star pattern with nested loops, then recreate the same row-and-column structure with D3 Pac-Man shapes using `transform: translate(...)` for placement. The D3 version should preserve the same pattern logic rather than placing each Pac-Man manually.",
					projectLink: "https://codepen.io/junilearning/pen/pogdRva",
					solutionLink:
						"https://codepen.io/junilearning/pen/9b713f294e21887a1a2c9b528764bd4b"
				},
				{
					title: "JSS8 Project 3: Armstrong Numbers",
					content:
						"Find all three-digit Armstrong numbers. For each number, separate the hundreds, tens, and ones digits, cube each digit, and compare the digit-cube sum to the original number. Use loops to check the full three-digit range and print only the values that satisfy the rule.",
					projectLink: "https://codepen.io/junilearning/pen/eYJegdP",
					solutionLink:
						"https://codepen.io/junilearning/pen/e12716e0c3e1cbfc0405c9da2e245b8a"
				}
			],
			supplementalProjects: [
				{
					title: "JSS8 Supplemental Project 1: Juni Archery",
					content:
						"Simulate five rounds of archery with three arrows per round. Use nested loops so the outer loop represents rounds and the inner loop represents arrows. Each arrow should have a random one-in-three chance to hit, and the program should print per-round results plus the total number of bullseyes.",
					projectLink: "https://codepen.io/junilearning/pen/xxZPgdv",
					solutionLink:
						"https://codepen.io/junilearning/pen/2882e6ebc5b146358627d5c4f5afd90c"
				},
				{
					title: "JSS8 Supplemental Project 2: Tower of Boxes",
					content:
						"Print the stacked box pattern with nested loops. Decide which loop controls the height of the tower and which loop controls the symbols within each row. The finished output should match the target pattern exactly, including row lengths, spacing, and line breaks.",
					projectLink: "https://codepen.io/junilearning/pen/PoZOWWp",
					solutionLink:
						"https://codepen.io/junilearning/pen/6973a709e1c0d6932da2ed1e7650d30f"
				},
				{
					title: "JSS8 Supplemental Project 3: Shield Debugging",
					content:
						"Debug the stacked shield pattern by checking the order of nested-loop output. The final result should print or draw each layer in the correct sequence, with loop counters controlling rows and columns clearly enough to explain why the shield stacks correctly.",
					projectLink: "https://codepen.io/junilearning/pen/pogyeaj",
					solutionLink:
						"https://codepen.io/junilearning/pen/1ac928d6d9d777928c4439b4262310a3"
				}
			]
		},
		{
			title: "JSS9 Introduction to HTML & CSS",
			curriculum: [
				{
					title: "Introduction to HTML",
					content:
						"A webpage's structure comes from HTML tags. Practice headings, `div`, `span`, line breaks, links, and images in CodePen, then inspect how nesting creates parent and child elements. The goal is to read a small HTML snippet and explain which elements contain which other elements."
				},
				{
					title: "Document Object Model (DOM)",
					content:
						"The browser turns HTML into the Document Object Model, or DOM: a tree of objects that JavaScript and developer tools can inspect or change. Open the browser inspector and identify `html`, `head`, and `body`, then connect those nodes back to the original HTML source."
				},
				{
					title: "Introduction to CSS",
					content:
						"Page presentation comes from CSS rules. Use selectors to style text alignment, color, background color, font size, and font weight. Compare tag selectors, class selectors, and id selectors by creating a `div` with class `box`, styling it, and explaining why classes are usually better for reusable styles.",
					projectLink:
						"https://codepen.io/junilearning/pen/a4555b19dc5183859c0a6956be1f6c0a",
					solutionLink:
						"https://codepen.io/junilearning/pen/d14dd0596bbb8720c359688f460c9419"
				},
				{
					title: "Display Property and Table Tags",
					content:
						"The CSS `display` property affects how elements occupy space. Compare `block`, `inline`, and `inline-block` with styled boxes, then build a small table using `table`, `thead`, `tbody`, `tr`, `th`, and `td`. Verify that the visual layout matches the document structure.",
					projectLink:
						"https://codepen.io/junilearning/pen/eca1fa811c12940c388c331a07cb0dbb",
					solutionLink:
						"https://codepen.io/junilearning/pen/4ae1264dcfd25856b2d4d893eb3b2ffa"
				}
			],
			supplementalProjects: [
				{
					title: "JSS9 Supplemental Project 1: Practice with CSS Selectors",
					content:
						"Use CSS Diner to practice selector precision, not just clicking through the levels. Track examples of tag, class, id, descendant, child, adjacent-sibling, attribute, and pseudo-class selectors. After the practice, write three original selectors for a small HTML snippet and explain which elements each selector should match before testing it.",
					projectLink: "https://flukeout.github.io/",
					solutionLink: "https://flukeout.github.io/"
				},
				{
					title: "JSS9 Supplemental Project 2: Practice with Flexbox",
					content:
						"Use Flexbox Froggy as a layout reasoning drill. For each new property, record what changed about the main axis, cross axis, spacing, wrapping, or item order. Finish by building a small three-card layout in CodePen that uses at least `display: flex`, `justify-content`, `align-items`, `gap`, and one responsive wrapping behavior.",
					projectLink: "https://flexboxfroggy.com/",
					solutionLink: "https://flexboxfroggy.com/"
				},
				{
					title: "Introduction to HTML & CSS supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS9 Introduction to HTML & CSS",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-08-jss9-introduction-to-html-and-css-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-08-jss9-introduction-to-html-and-css-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS10 Animations in JavaScript",
			curriculum: [
				{
					title: "JSS10 Project 1: Car",
					content:
						"Draw a car using D3 rectangles and circles, with each visible part created intentionally rather than as a single copied shape. Include a body, wheels, and at least one detail such as windows or lights, then adjust coordinates so the pieces align as one coherent object.",
					projectLink:
						"https://codepen.io/junilearning/pen/38ef977913b6ce7e1a913883f984a4e5",
					solutionLink:
						"https://codepen.io/junilearning/pen/2723c8a04416bf8402171eb247a02bb5"
				},
				{
					title: "Moving Your Car",
					content:
						"Animate the car by selecting the correct SVG group or shape, applying a D3 transition, setting a readable duration, and moving it with a `transform: translate(...)` value. Keep the original drawing code separate from the animation code so it is clear what creates the car and what changes its position over time.",
					projectLink:
						"https://codepen.io/junilearning/pen/46c3f402eb4100c983f22bbbb3f4cede"
				},
				{
					title: "JSS10 Project 2: Bouncing Ball",
					content:
						"Create a ball that travels across the screen, returns, and visibly changes speed or feel through duration and easing choices. Verify the starting position, ending position, and return motion separately, then adjust one timing value and describe how the animation changed.",
					projectLink:
						"https://codepen.io/junilearning/pen/6a90681824ce331a3533469f911e2497",
					solutionLink:
						"https://codepen.io/junilearning/pen/a449284a2d08eecf0a0f61b644044f84"
				},
				{
					title: "DOM Events",
					content:
						"Connect browser events to visible page behavior. Use `d3.on()` with a callback, identify which element receives the event, and make the callback change something observable such as text, color, size, or position. Test at least two clicks so the event-response pattern is clearly repeatable.",
					projectLink: "https://codepen.io/junilearning/pen/BajVdPQ"
				},
				{
					title: "JSS10 Project 3: Growing Ball",
					content:
						"Use `mouseover` and `mouseout` events to change a circle's size without losing track of its center point. The ball should grow when hovered, shrink when the pointer leaves, and use transitions smooth enough that the event behavior is easy to see and debug.",
					projectLink:
						"https://codepen.io/junilearning/pen/ff4f98a080f26536a286835de4b1b9a2",
					solutionLink:
						"https://codepen.io/junilearning/pen/9d8630fbb5a9554618f11c649a95ab55"
				}
			],
			supplementalProjects: [
				{
					title: "JSS10 Supplemental Project 1: Bouncing and Growing",
					content:
						"Animate a ball that moves across the screen, grows to double size, returns to its starting area, and shrinks back down. Keep the movement transition and size transition readable as separate steps, then test that the ball does not drift offscreen or lose its intended center point after repeated animation cycles.",
					projectLink:
						"https://codepen.io/junilearning/pen/5e44ed4c619e2a3e960ba5cdf6ab067f",
					solutionLink:
						"https://codepen.io/junilearning/pen/be50c8f1430016572f95794d69800440"
				},
				{
					title: "JSS10 Supplemental Project 2: Rainbow",
					content:
						"Draw the rainbow as a set of D3 arcs with consistent center points and decreasing radii. Animate the arcs from the outside inward so the timing makes the layer order obvious. Include enough color and spacing choices that each band is readable rather than overlapping into one shape.",
					projectLink:
						"https://codepen.io/junilearning/pen/36846ad022b36b072833ace22a9edbef",
					solutionLink:
						"https://codepen.io/junilearning/pen/b858a6f5c9b50333229dd36700cc4ac0"
				},
				{
					title: "Animations in JavaScript supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS10 Animations in JavaScript",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-09-jss10-animations-in-javascript-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-09-jss10-animations-in-javascript-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS11 More HTML & CSS",
			curriculum: [
				{
					title: "The Box Model",
					content:
						"Use one visible box to separate the four box-model layers: content, padding, border, and margin. Change one layer at a time and predict whether the visible box, its internal spacing, or its distance from neighboring elements should change. This keeps layout debugging concrete instead of memorizing definitions."
				},
				{
					title: "The Position Property",
					content:
						"Compare `static`, `relative`, `absolute`, and `fixed` positioning by moving visible boxes with `top`, `left`, `right`, and `bottom`. Add overlapping boxes and change `z-index` so layering is visible. The goal is to predict whether a positioned element moves relative to itself, its containing block, or the viewport.",
					projectLink:
						"https://codepen.io/junilearning/pen/261c1809ad0309dd584526c73c586289"
				},
				{
					title: "JSS11 Project 2: My Hero Page",
					content:
						"Build a hero page that uses a custom Google Font, a clear heading, and both ordered and unordered lists. Use `ul`, `ol`, and `li` semantically: ordered lists should represent steps or rankings, while unordered lists should represent related items without a strict sequence. Check that the font loads and that list spacing is readable.",
					projectLink:
						"https://codepen.io/junilearning/pen/d959f67d5f753f31d3fea61cd4e6e8e3",
					solutionLink:
						"https://codepen.io/junilearning/pen/f148f71f0ba2807f695133ab280a5b67"
				},
				{
					title: "JSS11 Project 3: My JavaScript Art",
					content:
						"Create a page that presents three favorite D3 drawings or animations from the course. Each piece should have a title, a short description of the JavaScript or SVG concept it demonstrates, and enough page structure that the gallery feels intentional rather than a list of disconnected embeds.",
					projectLink:
						"https://codepen.io/junilearning/pen/b252c1398d97eda534482419d9103b87",
					solutionLink:
						"https://codepen.io/junilearning/pen/65a70df75b1168154b07ed73a09e9aa3"
				}
			],
			supplementalProjects: [
				{
					title: "JSS11 Supplemental Project 1: Berkshire Hathaway",
					content:
						"Recreate the basic structure of the Berkshire Hathaway page with semantic HTML, simple typography, links, spacing, and a readable layout. The goal is not pixel-perfect design; it is practicing how a plain information-heavy page is built from headings, lists, links, containers, and consistent CSS rules.",
					projectLink:
						"https://codepen.io/junilearning/pen/b24ef5d48d5f8e0fbcafee18631d0336",
					solutionLink:
						"https://codepen.io/junilearning/pen/3efe23650b01fd4f978f3f827cc1691e"
				},
				{
					title: "More HTML & CSS supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS11 More HTML & CSS",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-10-jss11-more-html-and-css-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-10-jss11-more-html-and-css-supplemental-2/solution"
				},
				{
					title: "More HTML & CSS supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS11 More HTML & CSS",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-11-jss11-more-html-and-css-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-11-jss11-more-html-and-css-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS12 Basic Website Layout",
			curriculum: [
				{
					title: "Component Libraries",
					content:
						"Component libraries provide prebuilt CSS and JavaScript patterns. Add Materialize through CodePen settings, read the relevant documentation before copying markup, and identify which classes control layout, color, spacing, or component behavior. The goal is to use the library deliberately rather than treating class names as magic."
				},
				{
					title: "JSS12 Project 1: Rainbow Sections",
					content:
						"Use Materialize sections, containers, cards, and color helpers to build a rainbow-themed page. Each section should have a clear color choice, readable text, and consistent spacing. Prefer Materialize spacing/layout classes where possible, and only use line breaks when they are intentionally part of the design.",
					projectLink:
						"https://codepen.io/junilearning/pen/ed06d5371daf7472425bea1c7e65e4bf",
					solutionLink:
						"https://codepen.io/junilearning/pen/3d22e6b16852d5226f7944331d44b315"
				},
				{
					title: "JSS12 Project 2: My Hobby Table",
					content:
						"Build a styled table about a hobby using the Materialize table documentation. Use `thead` and `th` for column labels, keep each row consistent, and choose hover, striped, or centered table styles intentionally. The finished table should be readable without relying only on color.",
					projectLink:
						"https://codepen.io/junilearning/pen/0214806859946640ce1654c9c3ec08f0",
					solutionLink:
						"https://codepen.io/junilearning/pen/134bda10f6f852089b21d49498c47ad7"
				},
				{
					title: "Material Icons",
					content:
						"Add the Material Icons dependency, place icons using the documented markup, and treat each icon as a scalable visual label rather than a bitmap image. Verify that icon names render correctly, that icon size/color can be controlled with CSS or Materialize helpers, and that surrounding text still explains the action for readability."
				},
				{
					title: "Mobile Wrappers",
					content:
						"Use Materialize responsive helper classes to show, hide, or rearrange content for small, medium, and large screens. Test the same page at multiple viewport widths and record which content should remain visible, which content should collapse or disappear, and why that choice improves the layout.",
					projectLink:
						"https://codepen.io/junilearning/pen/ab476697ba2b3957601555751bda65fb",
					solutionLink:
						"https://codepen.io/junilearning/pen/7da430381845aeb20d85bd435e7d8d03"
				},
				{
					title: "JSS12 Project 4: My JavaScript Art Part II",
					content:
						"Add another D3 piece to the JavaScript art page and reorganize the gallery with Materialize sections or containers. The new piece should include a title and description, and the page should show clearer grouping than the first version: sections, cards, or spacing should help a visitor scan the work.",
					projectLink:
						"https://codepen.io/junilearning/pen/68f7db60fabe38f5ff48cf4cfa631a4c",
					solutionLink:
						"https://codepen.io/junilearning/pen/68f7db60fabe38f5ff48cf4cfa631a4c"
				}
			],
			supplementalProjects: [
				{
					title: "JSS12 Supplemental Project 1: Table Documentation Dive",
					content:
						"Extend a table using documentation-driven changes. Add hover highlighting, make selected names or entries link to credible sources, and verify that the clickable area is obvious. The project should demonstrate reading documentation, applying a class or attribute, and checking the result in the browser.",
					projectLink:
						"https://codepen.io/junilearning/pen/a08f05f994009cffe397dd6dd86dbddd",
					solutionLink:
						"https://codepen.io/junilearning/pen/0bbd6c8223876a9fa514f42411e3f37d"
				},
				{
					title: "Basic Website Layout supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS12 Basic Website Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-12-jss12-basic-website-layout-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-12-jss12-basic-website-layout-supplemental-2/solution"
				},
				{
					title: "Basic Website Layout supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS12 Basic Website Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-13-jss12-basic-website-layout-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-13-jss12-basic-website-layout-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS13 The Grid Layout",
			curriculum: [
				{
					title: "Introduction to CSS Grid",
					content:
						"Two-dimensional page layout uses rows and columns at the same time. Practice grid terminology with the starter CodePen and Grid Garden, then identify the container, grid tracks, and grid items in a small example. The key skill is predicting where an item will land before checking the browser."
				},
				{
					title: "JSS13 Project 1: Chessboard",
					content:
						"Build an 8-by-8 chessboard with CSS Grid. Use a repeatable grid structure, alternate square colors accurately by row and column, and verify that the board stays square and readable when the browser width changes.",
					projectLink:
						"https://codepen.io/junilearning/pen/2573f4cfc9cb525b5940f500fd22dc79",
					solutionLink:
						"https://codepen.io/junilearning/pen/6d8b7a81d39a66ce9536c1e700f287c0"
				},
				{
					title: "Component Library Grids",
					content:
						"Materialize uses a 12-column responsive grid. Build rows with columns that change across small, medium, and large breakpoints, then resize the browser to verify when each layout rule takes effect. The page should make it clear why responsive component-library grids are different from manually placing every element.",
					projectLink:
						"https://codepen.io/junilearning/pen/a3eaa0595c2a0f55991e946605e38e60",
					solutionLink:
						"https://codepen.io/junilearning/pen/9efdb71bcb845f3d9c01b14f0fd1e32e"
				},
				{
					title: "JSS13 Project 3: Pokemon Team",
					content:
						"Create a responsive Pokemon team page with images, nicknames, moveset tables, stats icons, and a navbar. Use a grid so team cards reflow cleanly across screen sizes, and keep table labels readable on mobile. Each Pokemon card should feel like the same component filled with different content.",
					projectLink:
						"https://codepen.io/junilearning/pen/ae3059e723f4f66779b4cd4e2a1fc520",
					solutionLink:
						"https://codepen.io/junilearning/pen/e96eae8cd85c1fe2bbaf3b5cdd046522"
				},
				{
					title: "JSS13 Project 4: My JavaScript Art Part III",
					content:
						"Add another D3 piece to the art portfolio and reorganize the page with CSS Grid or the Materialize grid. Use cards with descriptions, and consider an alternating layout pattern so the page has visual rhythm. Verify that the layout still works at desktop and mobile widths.",
					projectLink:
						"https://codepen.io/junilearning/pen/4735eaf3e168cfb944a3daad063e287c",
					solutionLink:
						"https://codepen.io/junilearning/pen/4735eaf3e168cfb944a3daad063e287c"
				}
			],
			supplementalProjects: [
				{
					title: "JSS13 Supplemental Project 1: FakeTech.io",
					content:
						"Build a fictional company page with employee cards. Use Materialize components such as circular images, vertical alignment wrappers, card layouts, and hoverable shadows. Each card should include consistent content fields, and the page should stay readable when the cards wrap to a new row.",
					projectLink:
						"https://codepen.io/junilearning/pen/ca71737eccb1712a4a653a8f883c57cf",
					solutionLink:
						"https://codepen.io/junilearning/pen/cdf88ee56f7d30ee0b1eba24ae89353e"
				},
				{
					title: "JSS13 Supplemental Project 2: Art Gallery",
					content:
						"Create an online art gallery with 12 pieces using horizontal cards, descriptions, and links. Plan how the gallery should behave on desktop, tablet, and mobile widths, then use responsive classes or grid rules to make the cards readable at each size.",
					projectLink:
						"https://codepen.io/junilearning/pen/8a2437122b9c7eb4159c9cacccdedae8",
					solutionLink:
						"https://codepen.io/junilearning/pen/45dabf41b44570f312ef9334db333f97"
				},
				{
					title: "The Grid Layout supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS13 The Grid Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-14-jss13-the-grid-layout-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-14-jss13-the-grid-layout-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS14 Dynamic Websites with JavaScript",
			curriculum: [
				{
					title: "Manipulating HTML with JavaScript",
					content:
						"Use JavaScript to select DOM elements, read values from inputs, and change text, classes, attributes, or styles in response to events. Practice with the demo CodePen, then identify the selector, event listener, callback, and DOM update in the code."
				},
				{
					title: "JSS14 Project 1: Calculator",
					content:
						"Finish a half-built calculator by wiring buttons to inputs, parsing numeric values, performing the selected operation, and writing the result back to the page. Test addition, subtraction, multiplication, division, decimal values, and an invalid or empty input case. Styling can use D3 or CSS, but correctness comes first.",
					projectLink:
						"https://codepen.io/junilearning/pen/8cb69f2696d31b929107d3798ef095aa",
					solutionLink:
						"https://codepen.io/junilearning/pen/d394480277af12f893819f3d64c5ea81"
				},
				{
					title: "JSS14 Project 2: Strength Tester",
					content:
						"Create a strength tester that generates a random score from 0 through 500 when a button is clicked. Use score ranges to choose a prize tier, image, and message. Test the lowest, highest, and boundary values by temporarily replacing randomness with fixed values.",
					projectLink:
						"https://codepen.io/junilearning/pen/afcffeca5355cf07d9882f08c90ab84c",
					solutionLink:
						"https://codepen.io/junilearning/pen/20af41540e7b43929ccf60cc88c8e8bd"
				},
				{
					title: "JavaScript Components",
					content:
						"Materialize JavaScript components need both markup and initialization code. Add the required CSS, JavaScript, and icon dependencies, select component elements with `document.querySelectorAll()`, and initialize them with the documented `M.*` call. Verify that the component still works after refreshing the page."
				},
				{
					title: "JSS14 Project 3: Dynamic Components",
					content:
						"Pick three Materialize JavaScript components from the documentation and implement them on one page. For each component, include the required HTML structure, initialization code, and one sentence explaining what user interaction it supports. Test all three components after a page refresh.",
					projectLink:
						"https://codepen.io/junilearning/pen/e55b7c0d570df2c9943e06395a42c974",
					solutionLink:
						"https://codepen.io/junilearning/pen/e55b7c0d570df2c9943e06395a42c974"
				},
				{
					title: "JSS14 Project 4: My JavaScript Art Part IV",
					content:
						"Add another D3 piece to the art portfolio and enhance the page with JavaScript-driven effects. Add a navigation area with a dropdown and scroll spy sections using the Materialize documentation. Verify that navigation links move to the correct sections and that the D3 piece still renders after the component scripts initialize.",
					projectLink:
						"https://codepen.io/junilearning/pen/68807d2000d19574d4c80d354eea197f",
					solutionLink:
						"https://codepen.io/junilearning/pen/68807d2000d19574d4c80d354eea197f"
				}
			],
			supplementalProjects: [
				{
					title: "JSS14 Supplemental Project 1: Video Collection",
					content:
						"Create a video collection page with nine embedded videos. Use Materialize cards, grids, or responsive embeds so each video has a title, short description, and consistent spacing. Check that the page remains usable when the videos stack on smaller screens.",
					projectLink:
						"https://codepen.io/junilearning/pen/71ea495430eac148ba6c02e837de1727",
					solutionLink:
						"https://codepen.io/junilearning/pen/449ef8b56fdf70dca74400b0401655e1"
				},
				{
					title: "JSS14 Supplemental Project 2: National Park",
					content:
						"Create a national park page using the Materialize parallax component with multiple background images. Include sections for location, notable features, activities, and visitor tips. Verify that the parallax effect initializes correctly and that text remains readable over or between image sections.",
					projectLink:
						"https://codepen.io/junilearning/pen/bba3ef0f2520577fb92d3fc6cc546335",
					solutionLink:
						"https://codepen.io/junilearning/pen/1d2df4b333d28c9a00f17d0fa4f37978"
				},
				{
					title: "Dynamic Websites with JavaScript supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSS14 Dynamic Websites with JavaScript",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-15-jss14-dynamic-websites-with-javascript-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSS-15-jss14-dynamic-websites-with-javascript-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSS15 Master Project",
			curriculum: [
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
					title: "Recommended Next Course Path",
					content:
						"`JavaScript Level 2` should be the normal next step after this course. A comfortable JavaScript Level 1 finish should lead into deeper functions, arrays, objects, events, APIs, and data work in JavaScript Level 2 before moving into `Web Development Foundations`, which assumes stronger JavaScript fluency and shifts the emphasis from browser-only projects toward local project structure, Git, npm, servers, databases, and deployment."
				},
				{
					title: "Course Recap",
					content:
						"Review the main skills from JavaScript Level 1: variables, strings, input, math, loops, conditionals, D3/SVG drawing, HTML, CSS, responsive layout, DOM events, and Materialize components. Identify one project that best demonstrates programming logic and one project that best demonstrates page layout."
				},
				{
					title: "Master Project: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Master Project",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JSS15 Supplemental Project 1: Juni Eatz",
					content:
						"Build a restaurant splash page with a menu preview, location or hours section, and at least one Materialize parallax or card layout. The page should communicate a clear restaurant identity through typography, color, images, and navigation rather than only placing empty starter sections.",
					projectLink:
						"https://codepen.io/junilearning/pen/eb5dc79c245ab907ddd8f56853cb817a",
					solutionLink:
						"https://codepen.io/junilearning/pen/eb5dc79c245ab907ddd8f56853cb817a"
				},
				{
					title: "JSS15 Supplemental Project 2: Juni News",
					content:
						"Build a news-style homepage with a headline area, story cards, categories, and a Materialize slider for featured stories. Use layout choices that make article priority clear, and include enough text hierarchy that readers can distinguish headlines, summaries, and metadata.",
					projectLink:
						"https://codepen.io/junilearning/pen/910d8fa54b43a581c779c8dfab792c60",
					solutionLink:
						"https://codepen.io/junilearning/pen/910d8fa54b43a581c779c8dfab792c60"
				},
				{
					title: "JSS15 Supplemental Project 3: Jun-E-Commerce",
					content:
						"Build a small e-commerce landing page with featured products, prices or descriptions, and a Materialize carousel or card grid. The page should make product browsing clear, include at least one call-to-action, and remain readable on a narrow screen.",
					projectLink:
						"https://codepen.io/junilearning/pen/c8048a26149f2dc5c4340a2d6cdb0ce2",
					solutionLink:
						"https://codepen.io/junilearning/pen/c8048a26149f2dc5c4340a2d6cdb0ce2"
				}
			]
		}
	]
};
