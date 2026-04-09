import type { RawCourse } from "./types";

export const javascriptLevel1Course: RawCourse = {
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
					projectLink: "https://codepen.io/junilearning/pen/vYGWvaq",
					solutionLink:
						"https://codepen.io/junilearning/pen/084c3032877fa7f9c828bba2c5798551"
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
					projectLink: "https://codepen.io/junilearning/pen/OJMxyqw",
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
					projectLink: "https://codepen.io/junilearning/pen/qBbPbPp",
					solutionLink:
						"https://codepen.io/junilearning/pen/ce06ca273ecc8c28529261846833d4c1"
				}
			],
			supplementalProjects: [
				{
					title: "JSS1 Supplemental Project 1: Cookie Math",
					content:
						"Use prompt() to ask how much flour was brought and print how many eggs and chocolate chips are needed; consider Math.ceil() for rounding.",
					projectLink: "https://codepen.io/junilearning/pen/rNxGxKm",
					solutionLink:
						"https://codepen.io/junilearning/pen/27b890b0097969f24289d9abf77d1392"
				},
				{
					title: "JSS1 Supplemental Project 2: Hello World!",
					content:
						"Use string indexing on provided strings to print “Hello World!”.",
					projectLink: "https://codepen.io/junilearning/pen/MWKEKPJ",
					solutionLink:
						"https://codepen.io/junilearning/pen/36a808fbb70a55e25889b07c74debb6a"
				},
				{
					title: "JSS1 Supplemental Project 3: Debugging a Friend Survey",
					content:
						"Fix a friend’s survey code using prompts and outputs.",
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
					projectLink: "https://codepen.io/junilearning/pen/RwrLayP",
					solutionLink:
						"https://codepen.io/junilearning/pen/06257a44b94db1486fac683ccaace7be"
				},
				{
					title: "JSS2 Project 2: Randomly Random Party",
					content:
						"Pick random values for month (5–7), day (1–30), and start time (hour 10–20, minute 0–59). Print the party time; optional challenge to handle any birth month.",
					projectLink: "https://codepen.io/junilearning/pen/xxZXVye",
					solutionLink:
						"https://codepen.io/junilearning/pen/29d1e4fde67a75fc4b5cdcacd458cb8d"
				},
				{
					title: "JSS2 Project 3: What's the Password?",
					content:
						"Compute a numeric password using Math.PI, powers, addition, division with Math.floor, and modulo; print result with printToScreen().",
					projectLink: "https://codepen.io/junilearning/pen/PoZJNXb",
					solutionLink:
						"https://codepen.io/junilearning/pen/c550ef1e284c55fa01964589bf19b21c"
				}
			],
			supplementalProjects: [
				{
					title: "JSS2 Supplemental Project 1: Pie Eating Contest",
					content:
						"Prompt for number of pies; one contestant eats 1–5 pies at random. Recalculate pies per contestant and leftovers.",
					projectLink: "https://codepen.io/junilearning/pen/jOWGqJZ",
					solutionLink:
						"https://codepen.io/junilearning/pen/a9612fb435c5e334490c1eeb72e9c567"
				},
				{
					title: "JSS2 Supplemental Project 2: Random Practice",
					content:
						"Print random numbers in different ranges (0–5, 1–10, 20–50, even 0–50, odd 51–101).",
					projectLink: "https://codepen.io/junilearning/pen/JjGrXgg",
					solutionLink:
						"https://codepen.io/junilearning/pen/5bbc99927a71e48ec59e93b8dfbb585c"
				},
				{
					title: "JSS2 Supplemental Project 3: Circles",
					content:
						"Use a modified printToScreen(start, end) to draw arcs; convert degrees to radians; draw a rainbow, full circle, and 3/4 circle.",
					projectLink: "https://codepen.io/junilearning/pen/yLezJLx",
					solutionLink:
						"https://codepen.io/junilearning/pen/d004723cc01403a3db897db1206f449b"
				},
				{
					title: "JSS2 Supplemental Project 4: Debugging Math Homework",
					content: "Fix code solving a math problem.",
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
						"Explain loop structure (init, condition, update). Print sequences like 0–9, multiples of 3, and countdowns."
				},
				{
					title: "JSS3 Project 1: For Loops Practice",
					content:
						"Use printToScreen() to print sequences: 1–50, 50–1, evens to 100, odds down from 100, powers of 3, and 500,100,20,4.",
					projectLink: "https://codepen.io/junilearning/pen/PoZJGKV",
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
					projectLink: "https://codepen.io/junilearning/pen/OJMxRvY",
					solutionLink:
						"https://codepen.io/junilearning/pen/3f802bef974fcccd10caafaac8c3eb04"
				},
				{
					title: "JSS3 Project 3: Looping Squares",
					content:
						"Use for loops to print colored squares (2 red, 3 yellow) and while loops to print 4 blue and 3 purple squares with printToScreen().",
					projectLink: "https://codepen.io/junilearning/pen/xxZXEzP",
					solutionLink:
						"https://codepen.io/junilearning/pen/56baa6b060aab0e3511c7c3608d53eaa"
				}
			],
			supplementalProjects: [
				{
					title: "JSS3 Supplemental Project 1: Powers of 3",
					content:
						"Print all powers of 3 less than 5000 using printToScreen().",
					projectLink: "https://codepen.io/junilearning/pen/wvMrzEw",
					solutionLink:
						"https://codepen.io/junilearning/pen/1c1201771499a38d4f15588580d7bfa1"
				},
				{
					title: "JSS3 Supplemental Project 2: Forgotten Math",
					content:
						"Compute a product of two inputs without using * or *=; print the result.",
					projectLink: "https://codepen.io/junilearning/pen/gOPGwBy",
					solutionLink:
						"https://codepen.io/junilearning/pen/53206f1e4800c28a4549aea7be49b7e0"
				},
				{
					title: "JSS3 Supplemental Project 3: Debugging Loops",
					content: "Fix a simulated race that uses loops.",
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
						"Show how to increment or decrement counters inside loops to track attempts, lives, or guesses."
				},
				{
					title: "JSS4 Project 1: Totaling Up",
					content:
						"Write loops to sum numbers 1–100, sum squares 1–100, and compute factorial of a user input.",
					projectLink: "https://codepen.io/junilearning/pen/gOPGwNV",
					solutionLink:
						"https://codepen.io/junilearning/pen/71ad8b99ac4c707e75b4f0e136f82665"
				},
				{
					title: "JSS4 Project 2: Coin Machine",
					content:
						"Ask for cents and print how many of each coin are included; discuss while loop use.",
					projectLink: "https://codepen.io/junilearning/pen/VweMmZq",
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
					projectLink: "https://codepen.io/junilearning/pen/jOWGVVB",
					solutionLink:
						"https://codepen.io/junilearning/pen/1520f836e15f3d4e7f554b913a805b02"
				}
			],
			supplementalProjects: [
				{
					title: "JSS4 Supplemental Project 1: Debugging Football",
					content: "Fix code simulating a football drive.",
					projectLink: "https://codepen.io/junilearning/pen/gOPRqPr",
					solutionLink:
						"https://codepen.io/junilearning/pen/eb1d816cbecce4d20944284fc085ae36"
				}
			]
		},
		{
			title: "JSS5 Conditionals",
			curriculum: [
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
					projectLink: "https://codepen.io/junilearning/pen/QWyqrLo",
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
					projectLink: "https://codepen.io/junilearning/pen/yLezjje",
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
					projectLink: "https://codepen.io/junilearning/pen/wvMrXdG",
					solutionLink:
						"https://codepen.io/junilearning/pen/bf0a3506f98d1b247c3f259986a941bd"
				}
			],
			supplementalProjects: [
				{
					title: "JSS5 Supplemental Project 1: Login Credentials",
					content:
						"Build a simple login loop that prompts until username/password match, then alerts success.",
					projectLink: "https://codepen.io/junilearning/pen/QWyqxqp",
					solutionLink:
						"https://codepen.io/junilearning/pen/d0f771c4f6fd24c86077e6b3fee4fa72"
				},
				{
					title: "JSS5 Supplemental Project 2: Snake Eyes",
					content:
						"Simulate rolling two dice until snake eyes; count rolls.",
					projectLink: "https://codepen.io/junilearning/pen/jOWGKZw",
					solutionLink:
						"https://codepen.io/junilearning/pen/6580937e9dfd9ce926651a6fe915e078"
				},
				{
					title: "JSS5 Supplemental Project 3: Debugging the Favorite Fruit Guesser",
					content:
						"Fix a fruit guesser that uses color and taste conditionals.",
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
						"Explain nesting an if inside another when multiple checks are needed."
				},
				{
					title: "JSS6 Project 1: The Sorting Hat",
					content:
						"Prompt for house preference and a quality; if they match, print sorted, else try again.",
					projectLink: "https://codepen.io/junilearning/pen/JjGrxRB",
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
					projectLink: "https://codepen.io/junilearning/pen/gOPGqKa",
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
					projectLink: "https://codepen.io/junilearning/pen/NWxaJdX",
					solutionLink:
						"https://codepen.io/junilearning/pen/b418881c3e60c8c7ac8fcbc3b7d74aa0"
				}
			],
			supplementalProjects: [
				{
					title: "JSS6 Supplemental Project 1: What Does the _ Say?",
					content: "Use a switch to map animals to sounds.",
					projectLink: "https://codepen.io/junilearning/pen/NWxaJgy",
					solutionLink:
						"https://codepen.io/junilearning/pen/5b0bdb527344a081c9abf91138ce5f4a"
				},
				{
					title: "JSS6 Supplemental Project 2: Debugging Bugging Friends",
					content:
						"Fix a program that checks if messaging frequency is too high.",
					projectLink: "https://codepen.io/junilearning/pen/mdVGXLE",
					solutionLink:
						"https://codepen.io/junilearning/pen/67b0c29a104afde9cce553de6cacf882"
				}
			]
		},
		{
			title: "JSS7 Drawing in JavaScript",
			curriculum: [
				{
					title: "Introduction to D3",
					content:
						"Explain D3 and SVG basics, pixels, and including D3 in CodePen. Append an SVG with width/height and note best practices for chaining calls."
				},
				{
					title: "Drawing Shapes in D3",
					content:
						"Append rectangles, circles, and ellipses; set attributes like x, y, height, width, fill, cx, cy, r, rx, ry.",
					projectLink: "https://codepen.io/junilearning/pen/zYrPBYM",
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
					projectLink: "https://codepen.io/junilearning/pen/MWKOeRd",
					solutionLink:
						"https://codepen.io/junilearning/pen/593993382174caa7d510ddbd5b0009d8"
				},
				{
					title: "JSS7 Project 3: Pac-Man",
					content:
						"Draw Pac-Man as an arc missing a slice by choosing start and end angles.",
					projectLink: "https://codepen.io/junilearning/pen/JjGORoK",
					solutionLink:
						"https://codepen.io/junilearning/pen/6df064875eb631bc08eab5c342ef98f7"
				}
			],
			supplementalProjects: [
				{
					title: "JSS7 Supplemental Project 1: Snowman",
					content:
						"Draw a snowman with D3 shapes and arcs; draw lines as needed.",
					projectLink: "https://codepen.io/junilearning/pen/GRoOjjx",
					solutionLink:
						"https://codepen.io/junilearning/pen/bb6f6bcdf7ff47fef8a5f2dc3a2138f0"
				},
				{
					title: "JSS7 Supplemental Project 2: Captain America's Shield",
					content:
						"Draw the shield with arcs and a star using D3 symbol docs.",
					projectLink: "https://codepen.io/junilearning/pen/VweRVWq",
					solutionLink:
						"https://codepen.io/junilearning/pen/0736d5c2045c3ecd6969c5284b93b067"
				},
				{
					title: "JSS7 Supplemental Project 3: Debugging Olaf's Star",
					content: "Fix code so a star appears on a snowman.",
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
						"Explain loop within a loop for repeating steps; demonstrate nested for with i and j."
				},
				{
					title: "JSS8 Project 1: Multiplication Tables",
					content:
						"Use nested loops to print multiplication tables 1–10 and count operations.",
					projectLink: "https://codepen.io/junilearning/pen/WNrXoBj",
					solutionLink:
						"https://codepen.io/junilearning/pen/431a3c1e61b0fe9d0e6fa2e16e6d37f6"
				},
				{
					title: "JSS8 Project 2: Pattern Production",
					content:
						"Print a star pattern with nested loops, then create the same pattern with D3 Pac-Men using translate to align.",
					projectLink: "https://codepen.io/junilearning/pen/pogdRva",
					solutionLink:
						"https://codepen.io/junilearning/pen/9b713f294e21887a1a2c9b528764bd4b"
				},
				{
					title: "JSS8 Project 3: Armstrong Numbers",
					content:
						"Find all three-digit Armstrong numbers using loops and digit sums.",
					projectLink: "https://codepen.io/junilearning/pen/eYJegdP",
					solutionLink:
						"https://codepen.io/junilearning/pen/e12716e0c3e1cbfc0405c9da2e245b8a"
				}
			],
			supplementalProjects: [
				{
					title: "JSS8 Supplemental Project 1: Juni Archery",
					content:
						"Simulate five rounds of archery with three arrows each; random 1-in-3 chance for a hit; print results and total bullseyes.",
					projectLink: "https://codepen.io/junilearning/pen/xxZPgdv",
					solutionLink:
						"https://codepen.io/junilearning/pen/2882e6ebc5b146358627d5c4f5afd90c"
				},
				{
					title: "JSS8 Supplemental Project 2: Tower of Boxes",
					content:
						"Print the stacked box pattern shown using nested loops.",
					projectLink: "https://codepen.io/junilearning/pen/PoZOWWp",
					solutionLink:
						"https://codepen.io/junilearning/pen/6973a709e1c0d6932da2ed1e7650d30f"
				},
				{
					title: "JSS8 Supplemental Project 3: Shield Debugging",
					content: "Fix output order of a stacked shield pattern.",
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
					title: "JSS10 Project 1: Car",
					content: "Draw a car with D3 using rectangles and circles.",
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
					projectLink: "https://codepen.io/junilearning/pen/BajVdPQ"
				},
				{
					title: "JSS10 Project 3: Growing Ball",
					content:
						"Use mouseover and mouseout events to change a circle’s size.",
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
};
