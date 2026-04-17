import type { RawCourse } from "./types";

export const javascriptLevel2Course: RawCourse = {
	name: "JavaScript Level 2: JavaScript Master",
	modules: [
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this as a review dialog. Let the learner try each task independently, guide with questions, and keep pacing flexible. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
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
						"Make an array of 20 rollDie() results, log the 10th element, count evens, and log doubled values. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Objects and the Canvas",
					content:
						"Create a car object with properties, set up a 1200x1200 canvas, build a cards array of rectangle objects, draw one card, then draw all cards on the canvas. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Create a 3x3 board of random squares or circles and keep redrawing until all match. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/c9af625a0a84cbffef3dc7891aa804f9",
					solutionLink:
						"https://codepen.io/junilearning/pen/702bf96c0927e96b0089cdc58df366d0"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					content:
						"Extend the work from Check-In #1 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://codepen.io/junilearning/pen/bbb5cce14f0a1bc5c5c4b5582da67750"
				},
				{
					title: "Check In #1 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check In #1 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-02-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-02-check-in-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"Second review checkpoint; let the learner drive, guide with questions, and adjust pacing. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://codepen.io/junilearning/pen/7b72b5cd25d5372e9097f68de4b66db6"
				},
				{
					title: "Check-In #2: Helper Functions and Event Listeners",
					content:
						"Explain why helper functions matter; refactor starter code with helpers. Define event listeners and add a click listener to a canvas logging x and y. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://codepen.io/junilearning/pen/f6a04f3b9405ba212662f72a776bc0cd"
				},
				{
					title: "Check-In #2: APIs",
					content:
						"Define APIs and requests. Fetch https://pokeapi.co/api/v2/move/ and log the name of the first returned object. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Databases",
					content:
						"Explain SELECT, WHERE, JOIN in SQL. Create a simple schema on dbdiagram.io for books and bookshelves. List the four CRUD operations. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Use PokeAPI moves to count move types; prompt for a type and display the total. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/a320051c74a1a5baa1358818c5bca5bc",
					solutionLink:
						"https://codepen.io/junilearning/pen/ba366d22ab4a98e653a5b2bcb4affba8"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					content:
						"Extend the work from Check-In #2 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://codepen.io/junilearning/pen/7b72b5cd25d5372e9097f68de4b66db6"
				},
				{
					title: "Check In #2 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-03-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-03-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check In #2 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-04-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-04-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM1 Fundamentals Review",
			curriculum: [
				{
					title: "Introductions & Setup",
					content:
						'Connect with the learner and set up CodePen (fork https://codepen.io/junilearning/pen/JjGrYOG). Show saving, running code, and printToScreen("Hello World"). Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.'
				},
				{
					title: "Variables and Strings",
					content:
						"Review numbers, strings, booleans, null, undefined with let/const. Explain strings and preferred let/const over var. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Alert and Prompt",
					content:
						"Use alert() to message users and prompt() to gather input; log with console.log(). Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Conditionals",
					content:
						"Review if/else, === vs !== and why to prefer === over ==. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM1 Project 1: Finish the Lyrics",
					content:
						"Prompt for guesses on three snippets, track correct and total, and print results. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/2d400625754c49aedbb72402eed3ba8f",
					solutionLink:
						"https://codepen.io/junilearning/pen/5e36bb6a04a440e18fb502b1cd635628"
				},
				{
					title: "Loops",
					content:
						"Review for and while loops, nested loops, and break; standardize on i and j. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Math",
					content:
						"Use Math.random(), Math.floor/ceil, and Math.PI for randomness and calculations. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM1 Project 2: Double or Nothing",
					content:
						"Simulate coin flips with Math.random(); prompt to continue or stop and print final dollars. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Explain D3 and SVG basics; set up an svg and append shapes with random colors. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://codepen.io/junilearning/pen/90973aa93a04ccb12c61f3a85280daed",
					solutionLink:
						"https://codepen.io/junilearning/pen/a057491eec4fc8ccc9e38a5fa9f727ac"
				},
				{
					title: "HTML & CSS",
					content:
						"Review common tags and CSS properties; practice styling a table and alternating rows. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://codepen.io/junilearning/pen/90c67c576d9b57cccffe8a34b4b42525",
					solutionLink:
						"https://codepen.io/junilearning/pen/69f1a078e1066a1d71f0fa1b7cb92850"
				},
				{
					title: "Materialize and D3 Interaction",
					content:
						'Introduce Materialize components; use `d3.select().on("click", func)` for a simple interaction. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.',
					projectLink:
						"https://codepen.io/junilearning/pen/81d62c84dfa32d88f17d0e012229bf0c",
					solutionLink:
						"https://codepen.io/junilearning/pen/6014e92e4707defd82249fb10b43d70d"
				}
			],
			supplementalProjects: [
				{
					title: "Fundamentals Review: Extension Challenge",
					content:
						"Extend the work from JSM1 Fundamentals Review with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://codepen.io/junilearning/pen/2d400625754c49aedbb72402eed3ba8f",
					solutionLink:
						"https://codepen.io/junilearning/pen/5e36bb6a04a440e18fb502b1cd635628"
				},
				{
					title: "Fundamentals Review supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM1 Fundamentals Review. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-05-jsm1-fundamentals-review-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-05-jsm1-fundamentals-review-supplemental-2/solution"
				},
				{
					title: "Fundamentals Review supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM1 Fundamentals Review. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-06-jsm1-fundamentals-review-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-06-jsm1-fundamentals-review-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM2 Functions",
			curriculum: [
				{
					title: "Functions",
					content:
						"Define functions (arrow syntax), parameters vs arguments, closures, and calling order. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "String Interpolation",
					content:
						"Use template strings with backticks and ${} for readable string assembly. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM2 Project 1: Functions Practice",
					content:
						"Write functions for sum, difference, product of three, average, factorial, and exponent. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/22b54271a2ed49675c512f1034c0e749",
					solutionLink:
						"https://codepen.io/junilearning/pen/5cd805c9464780ddb07004ec7feedd7b"
				},
				{
					title: "JSM2 Project 2: Which MetroCard",
					content:
						"Compute savings for ride counts, recommend monthly vs pay-per-ride, and print results for sample ride counts and a user input. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/7295dc0298b2f2da6af9e1287d32456a",
					solutionLink:
						"https://codepen.io/junilearning/pen/0ee1b7431e9ee2bf0befa562068702d7"
				},
				{
					title: "JSM2 Project 3: Rock Paper Scissors",
					content:
						"Build yourTurn(), computerTurn(), and findResult(); continue until someone reaches three wins. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/30e42b5cf6775bbf059a3d313c96f7c5",
					solutionLink:
						"https://codepen.io/junilearning/pen/2813f8a526379aefbabc47ad2f65fcd3",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_rock_paper_scissors.gif"
				}
			],
			supplementalProjects: [
				{
					title: "JSM2 Supplemental Project 1: Geometry Functions",
					content:
						"Write geometry helpers (circle circumference/area checks, triangle types, right triangle test) and print results with random inputs. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/1f563eb4624314cf5b3673480ec18472",
					solutionLink:
						"https://codepen.io/junilearning/pen/b8bf00b13b1d7085a129e155c9c428eb"
				},
				{
					title: "JSM2 Supplemental Project 2: Pain at the Pump",
					content:
						"Compute fuel cost from MPG, miles, and gas price; test random values; format money with toFixed(2). Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/87b49903a68f15f9132d49b704444083",
					solutionLink:
						"https://codepen.io/junilearning/pen/0ec6f1fb939a959f455f1fb70519c29e"
				},
				{
					title: "JSM2 Supplemental Project 3: Game of War",
					content:
						"Simulate 10 rounds of War drawing random cards, printing draws and scores; Ace high. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/06315e2ce4772499678cc4959f8e2360",
					solutionLink:
						"https://codepen.io/junilearning/pen/96fa9d7b8f7255c42c313b2d914abc48"
				},
				{
					title: "JSM2 Supplemental Project 4: Debugging Functions",
					content:
						"Fix coffee shop profit calculations involving ingredient usage and pricing. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Review if/else, else-if chains, and execution order. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Ternary Operators",
					content:
						"Rewrite simple if-else logic with condition ? true : false; note when to keep standard conditionals. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM3 Project 1: Ternary Operators Practice",
					content:
						"Convert provided if-else statements to ternary expressions, including assignments and null checks. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/a7c2ad78bc62de68676af56657849a9b",
					solutionLink:
						"https://codepen.io/junilearning/pen/b1db3868ed9880b007754b9003337700"
				},
				{
					title: "JSM3 Project 2: Juni Department Store",
					content:
						"Apply student discounts with extra adjustments for perfect squares or primes; print final price using functions and conditionals. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/b3de9678fa8b77aae5cc988f74bd086e",
					solutionLink:
						"https://codepen.io/junilearning/pen/d37942e57460093f20ee6217402d4ba7"
				},
				{
					title: "JSM3 Project 3: Special Numbers",
					content:
						"Write functions to detect self-dividing, perfect, and palindrome numbers; print ranges of each. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/1be13919321ab5708564a8a7ca928226",
					solutionLink:
						"https://codepen.io/junilearning/pen/2ccb91adaa2536ecc746e938b9411171"
				}
			],
			supplementalProjects: [
				{
					title: "JSM3 Supplemental Project 1: Age Milestones",
					content:
						"Use ternary operators to check milestone eligibility from a prompted age. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/8b95795088fd04a2a6b77fba56416332",
					solutionLink:
						"https://codepen.io/junilearning/pen/a85d4be8f2f94812a0357dae2a1d1e00"
				},
				{
					title: "Complex Conditionals supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM3 Complex Conditionals. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-07-jsm3-complex-conditionals-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-07-jsm3-complex-conditionals-supplemental-2/solution"
				},
				{
					title: "Complex Conditionals supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM3 Complex Conditionals. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-08-jsm3-complex-conditionals-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-08-jsm3-complex-conditionals-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM4 Canvas",
			curriculum: [
				{
					title: "The Canvas API",
					content:
						"Create a canvas element, set width/height, get 2D context, and understand coordinate grid. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM4 Project 1: Basic Shapes",
					content:
						"Draw rectangles with fillStyle and fillRect; draw arcs with ctx.arc and fill; degreesToRadians provided. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/7bdedd0b00112751b87d288e4b8120b5",
					solutionLink:
						"https://codepen.io/junilearning/pen/6d083a06497b47a62825f3d2c205813e"
				},
				{
					title: "JSM4 Project 2: Shining Stars",
					content:
						"Use paths with moveTo/lineTo to draw a star, refactor to drawStar(x, y), then draw five stars in a line. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/fa66f3594a65a54d562d3932d97e2cb7",
					solutionLink:
						"https://codepen.io/junilearning/pen/425a78d7d054dfda21d4242e818f64ba"
				},
				{
					title: "Writing Text on the Canvas",
					content:
						"Set font, fillStyle, textAlign, and use fillText to place text. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://codepen.io/junilearning/pen/9355a832c485b33c747b6c600f2d13ae",
					solutionLink:
						"https://codepen.io/junilearning/pen/1c3ffebb91e5c060c6b0ba4ae4df8275"
				}
			],
			supplementalProjects: [
				{
					title: "JSM4 Supplemental Project 1: Loopy Landscape",
					content:
						"Draw a landscape using shapes and canvas techniques. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/7911fd2b7b0ff50be9320b0c069f0613",
					solutionLink:
						"https://codepen.io/junilearning/pen/d704fa037c5f913792b1df06c8fddd6d"
				},
				{
					title: "JSM4 Supplemental Project 2: JNI Stock Price",
					content:
						"Plot a stock price line graph with labeled axes on the canvas. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/aa96160a1e7c1d1bdac74cfe5e6a9333",
					solutionLink:
						"https://codepen.io/junilearning/pen/1d48af84b840e8d7a72fd02e82de9f28"
				},
				{
					title: "Canvas supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM4 Canvas. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-09-jsm4-canvas-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-09-jsm4-canvas-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM5 Arrays and Iterators",
			curriculum: [
				{
					title: "Arrays",
					content:
						"Explain arrays, indices, push/pop, slice vs splice, and element access/reassignment. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM5 Project 1: Foray into Arrays",
					content:
						"Manipulate pet arrays, perfect squares, sums, random arrays, and equality of first/last elements using printToScreen(). Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/96047a35895a6620240bd2ce171a71ec",
					solutionLink:
						"https://codepen.io/junilearning/pen/6925d98f7583227a4c1c65996a10cf40"
				},
				{
					title: "For-Of and For-Each Iterators",
					content:
						"Show for...of and forEach callbacks and closure differences. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Advanced Iterators",
					content:
						"Demonstrate map, filter, and reduce with simple examples. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM5 Project 2: Integrating Iterators",
					content:
						"Apply iterators to adjust arrays, invoke functions in objects, sum evens, and filter divisibles. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/2e76b16dbd71552eeb1179b45b57ae2d",
					solutionLink:
						"https://codepen.io/junilearning/pen/2d9117dd9b2d44b478d8155655c7bb9b"
				},
				{
					title: "JSM5 Project 3: Colorful Cards",
					content:
						"Create an array of colors and use an iterator to draw cards in a row on canvas. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/b167fc3da0e85d5ff65158f799658566",
					solutionLink:
						"https://codepen.io/junilearning/pen/03f3b4a97545b4fcec50aa6b11ab4188"
				},
				{
					title: "Two-Dimensional Arrays",
					content:
						"Explain 2D arrays, access with arr[row][col], and generate a 12x12 multiplication table. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM5 Project 4: Colorful Cards in 2D",
					content:
						"Create a 5x5 2D array of colors and render as cards on the canvas using iterators. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/1dce247c86d866c1f33a6dce86511c71",
					solutionLink:
						"https://codepen.io/junilearning/pen/54cadf32718bc4b635e9b82ea67a7a7f"
				}
			],
			supplementalProjects: [
				{
					title: "JSM5 Supplemental Project 1: Pokemon Master",
					content:
						"Work through 2D array tasks in the starter to catch them all. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/61d80971229e4f85126de1fcfb54b1d8",
					solutionLink:
						"https://codepen.io/junilearning/pen/03693f4763858d7d7c10a34186e030f3"
				},
				{
					title: "JSM5 Supplemental Project 2: Random Icons",
					content:
						"Generate six randomly colored and chosen icons using arrays and D3/Materialize. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/e3ae971ad6fd35c3c0829208cb049099",
					solutionLink:
						"https://codepen.io/junilearning/pen/f163e56c8fa75a482877d789d08fc784"
				},
				{
					title: "Arrays and Iterators supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM5 Arrays and Iterators. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-10-jsm5-arrays-and-iterators-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-10-jsm5-arrays-and-iterators-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM6 Objects and Properties",
			curriculum: [
				{
					title: "Objects",
					content:
						"Define objects as key-value pairs, add properties, and compare to real-world examples. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM6 Project 1: Small Talk",
					content:
						"Create an object about yourself and a user object from prompts; use ternaries to respond to shared properties. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/c8c02ee2db01eeb4c5f408d9a1f58815",
					solutionLink:
						"https://codepen.io/junilearning/pen/0ed9be7b36e44c36de057a37265095a3"
				},
				{
					title: "For-In Iterator",
					content:
						"Iterate object properties with for...in and note object flexibility. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM6 Project 2: My Favorite Businesses",
					content:
						"Create an array of business objects with properties and products; loop to build template strings. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/bcc6527a03ffb7ca42b705ff3f3910dd",
					solutionLink:
						"https://codepen.io/junilearning/pen/c694262e464e83912c601ad1875d6cd2"
				},
				{
					title: "Animations in the Canvas",
					content:
						"Clear the canvas with clearRect and animate with requestAnimationFrame; review via demo. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink: "https://codepen.io/junilearning/pen/zYBjpZE"
				},
				{
					title: "JSM6 Project 3: Inflate and Deflate",
					content:
						"Animate a ball object growing green then shrinking red using draw, inflate, deflate, and a loop with requestAnimationFrame(). Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/d0195323eaa77fa2a273961fa3df61c3",
					solutionLink:
						"https://codepen.io/junilearning/pen/20f860c221cac7107010e0299f47b953"
				}
			],
			supplementalProjects: [
				{
					title: "JSM6 Supplemental Project 1: My Favorite Businesses II",
					content:
						"Extend businesses with images and Materialize Autocomplete to populate cards. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/50854534e6dccd9c7bedc0a2d01aded7",
					solutionLink:
						"https://codepen.io/junilearning/pen/7cbfe6e04babe21bb34a6d6af1028f57"
				},
				{
					title: "JSM6 Supplemental Project 2: Circle March",
					content:
						"Animate a grid of circles marching using requestAnimationFrame and canvas drawing. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/7ac4e84b6d1ce34caa732bc0945c6255",
					solutionLink:
						"https://codepen.io/junilearning/pen/abdb1b2dadb02ac244d8cf862bd9b321"
				},
				{
					title: "Objects and Properties supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM6 Objects and Properties. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-11-jsm6-objects-and-properties-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-11-jsm6-objects-and-properties-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM7 Helper Functions and Event Listeners",
			curriculum: [
				{
					title: "Helper Functions",
					content:
						"Emphasize breaking repeated logic into small reusable, well-named functions. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM7 Project 1: Refactory",
					content:
						"Refactor starter code into helper functions to remove repetition. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/3a1383fc8a60d0ff0f55419c9b4940fe",
					solutionLink:
						"https://codepen.io/junilearning/pen/4e1986a769365ecdef09ebeea1144a4f"
				},
				{
					title: "Mouse Events",
					content:
						"Add click, mousedown, and mouseup listeners to a canvas and inspect event data. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM7 Project 2: Which Card",
					content:
						"Reuse Colorful Cards, add a click listener to capture x/y and log which color was clicked. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/88140a4225b8cfb5468e91fbccfaa100",
					solutionLink:
						"https://codepen.io/junilearning/pen/1e1ad471f376b1364cd157bd9c96f9ab"
				},
				{
					title: "Key Events",
					content:
						"Use keydown/keyup listeners and keycodes (e.g., 37/39) for input handling. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM7 Project 3: Paddle",
					content:
						"Program a paddle controlled by arrow keys; start moving on keydown and stop on keyup. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/8ccc67de1bc03e5f2c81f78a411adee1",
					solutionLink:
						"https://codepen.io/junilearning/pen/f633db1559cc122a943d0a52bcf74ebc"
				}
			],
			supplementalProjects: [
				{
					title: "JSM7 Supplemental Project 1: Coastal Cruise",
					content:
						"Build helper functions to fill ship seats, check fullness, register passengers, and print manifests. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/13e9d8e0ad56ecbaff7933d0e063d682",
					solutionLink:
						"https://codepen.io/junilearning/pen/8c0f86e9e4d1996ac073f2d675141072"
				},
				{
					title: "JSM7 Supplemental Project 2: Juggling Paddle",
					content:
						"Animate a falling ball bouncing off a paddle; ball falls off-screen if missed. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/9c003b58d7ca7770e49f9243dbecb00f",
					solutionLink:
						"https://codepen.io/junilearning/pen/8f44f06f31939f0a56050f4718f0b608"
				},
				{
					title: "Helper Functions and Event Listeners supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM7 Helper Functions and Event Listeners. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-12-jsm7-helper-functions-and-event-listeners-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-12-jsm7-helper-functions-and-event-listeners-supple/solution"
				}
			]
		},
		{
			title: "JSM8 Collisions and Controls",
			curriculum: [
				{
					title: "Object Collisions",
					content:
						"Explain collision detection for circles (distance vs radii) and rectangles (overlap of edges). Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM8 Project 1: Circles Collide",
					content:
						"Animate two circles moving toward each other; on collision change fill color using interval timing. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/d4a36001e0d9b6e58c640ca0f280284a",
					solutionLink:
						"https://codepen.io/junilearning/pen/2cc6ea883fc971206d81c61a3f93582e"
				},
				{
					title: "JSM8 Project 2: Rectangular Collision",
					content:
						"Create random rectangles and detect overlap by comparing edges; display a message when overlapping. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/1c22a392782c8551073c92fe3e825849",
					solutionLink:
						"https://codepen.io/junilearning/pen/ba1bd74c40cacbdddafc645ba3f7350a"
				},
				{
					title: "JSM8 Project 3: The Bouncy Ball",
					content:
						"Simulate motion with gravity and friction for a bouncing ball, reversing velocity on collisions with ground/walls. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/1e97468ca0197dcf6ca6d933e175b6fb",
					solutionLink:
						"https://codepen.io/junilearning/pen/fb9156c7c34ad0319ba52c3c01b326c3"
				}
			],
			supplementalProjects: [
				{
					title: "Collisions and Controls: Extension Challenge",
					content:
						"Extend the work from JSM8 Collisions and Controls with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://codepen.io/junilearning/pen/d4a36001e0d9b6e58c640ca0f280284a",
					solutionLink:
						"https://codepen.io/junilearning/pen/2cc6ea883fc971206d81c61a3f93582e"
				},
				{
					title: "Collisions and Controls supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM8 Collisions and Controls. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-13-jsm8-collisions-and-controls-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-13-jsm8-collisions-and-controls-supplemental-2/solution"
				},
				{
					title: "Collisions and Controls supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM8 Collisions and Controls. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-14-jsm8-collisions-and-controls-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-14-jsm8-collisions-and-controls-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM9 Games in the Canvas",
			curriculum: [
				{
					title: "Choosing a Game",
					content:
						"Select one canvas game project to complete; scope to a 2–3 week effort. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM9 Project 1: Falling Skies",
					content:
						"Implement falling objects, player movement, collision checks, scoring, and spawn timing in a main loop. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/8d640d76fa709de228ec6303625663e3",
					solutionLink:
						"https://codepen.io/junilearning/pen/643e3bf98d5a641557276dbc1f269a02"
				},
				{
					title: "JSM9 Project 2: 2D Breakout",
					content:
						"Draw bricks, move ball and paddle, handle collisions and brick removal, and show win state. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/0d5f9c3b21921a4bc506a1139a3091bc",
					solutionLink:
						"https://codepen.io/junilearning/pen/778b7aa1d7bcd942b617d87a517d35e2"
				},
				{
					title: "JSM9 Project 3: Asteroids",
					content:
						"Create ship movement and shooting with angles, asteroid splitting, scoring, and game-over detection. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/4d14f6e432dd3b2dcee15a9d95eac750",
					solutionLink:
						"https://codepen.io/junilearning/pen/8a5307a6643fbf762925b08229b5a847"
				},
				{
					title: "JSM9 Project 4: Animated Starfield",
					content:
						"Build star objects with positions and velocity; update and draw repeatedly for animation. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/6d5f8181e8ea59009eadd259e249c5c5",
					solutionLink:
						"https://codepen.io/junilearning/pen/ac7242107973239507eebc571a767c5a"
				}
			],
			supplementalProjects: [
				{
					title: "Games in the Canvas: Extension Challenge",
					content:
						"Extend the work from JSM9 Games in the Canvas with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://codepen.io/junilearning/pen/8d640d76fa709de228ec6303625663e3",
					solutionLink:
						"https://codepen.io/junilearning/pen/643e3bf98d5a641557276dbc1f269a02"
				},
				{
					title: "Games in the Canvas supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM9 Games in the Canvas. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-15-jsm9-games-in-the-canvas-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-15-jsm9-games-in-the-canvas-supplemental-2/solution"
				},
				{
					title: "Games in the Canvas supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM9 Games in the Canvas. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-16-jsm9-games-in-the-canvas-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-16-jsm9-games-in-the-canvas-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM10 APIs and Requests",
			curriculum: [
				{
					title: "APIs",
					content:
						"Explain APIs, requests, and why fetch is asynchronous. Handle promises with then and json(). Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM10 Project 1: Programming Jokes",
					content:
						"Fetch a random programming joke from https://official-joke-api.appspot.com/jokes/programming/random and display setup and punchline. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/55981d32b9659656bb8cc4a17a0526bc",
					solutionLink:
						"https://codepen.io/junilearning/pen/e82a3c7cb28fcfba32ad765c0fe3009a"
				},
				{
					title: "JSM10 Project 2: Random Fox Generator",
					content:
						"Fetch https://randomfox.ca/floof/, create an img element with the URL, and append it to the page via a button click. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/93750fc08b5b2268a1d78b296295e2e8",
					solutionLink:
						"https://codepen.io/junilearning/pen/686374da7355c247854acf33c3904b25"
				},
				{
					title: "JSM10 Project 3: Pokedex",
					content:
						"Use PokeAPI to build an autocomplete search; display name, id, type, and image for selected Pokemon with error handling. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/35923b1d6dee01a5f3004d67836eca46",
					solutionLink:
						"https://codepen.io/junilearning/pen/e72824bf10e7457a18774db2554f860e"
				}
			],
			supplementalProjects: [
				{
					title: "JSM10 Supplemental Project 1: Funny Meter",
					content:
						"Fetch 10 programming jokes, gather user ratings, and present them one by one from the /jokes/programming/ten endpoint. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/bf88ab46e0b7314e0b0999ba35363519",
					solutionLink:
						"https://codepen.io/junilearning/pen/d07e0093689c1e654fc59de47093b043"
				},
				{
					title: "APIs and Requests supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM10 APIs and Requests. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-17-jsm10-apis-and-requests-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-17-jsm10-apis-and-requests-supplemental-2/solution"
				},
				{
					title: "APIs and Requests supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM10 APIs and Requests. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-18-jsm10-apis-and-requests-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-18-jsm10-apis-and-requests-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM11 SQL and Schemas",
			curriculum: [
				{
					title: "Introduction to Databases",
					content:
						"Describe relational databases, tables, keys, and why to separate data; reference example diagram. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "SQL Queries",
					content:
						"Explain SELECT/WHERE and UPDATE syntax for querying and modifying data. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM11 Project 1: SQL SELECT Practice",
					content:
						"Complete SQLBolt lessons 1–4 on SELECT queries. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://sqlbolt.com/lesson/select_queries_introduction"
				},
				{
					title: "Primary and Foreign Keys",
					content:
						"Define primary vs foreign keys and JOIN usage; relate to real-world IDs. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM11 Project 2: Join Tables Practice",
					content:
						"Complete SQLBolt lessons 6–7 on JOINs. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://sqlbolt.com/lesson/select_queries_with_joins"
				},
				{
					title: "Database Schemas",
					content:
						"Explain schemas and relationships (one-to-many, many-to-many) with dbdiagram example. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM11 Project 3: Apartment Building",
					content:
						"Design unit and resident tables with keys and at least five properties each on dbdiagram.io. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink: "https://dbdiagram.io/d",
					solutionLink:
						"https://dbdiagram.io/d/5facb8cf3a78976d7b7b8d44"
				}
			],
			supplementalProjects: [
				{
					title: "JSM11 Supplemental Project 1: Advanced SQL Queries",
					content:
						"Complete SQLBolt lessons 8–12 (nulls and more). Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://sqlbolt.com/lesson/select_queries_with_nulls"
				},
				{
					title: "JSM11 Supplemental Project 2: Music Library",
					content:
						"Create a music library schema with artists, songs, albums, genres using primary/foreign keys. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink: "https://dbdiagram.io/d",
					solutionLink:
						"https://dbdiagram.io/d/5fadb2e23a78976d7b7bb248"
				},
				{
					title: "JSM11 Supplemental Project 3: Altering Tables",
					content:
						"Complete SQLBolt lessons 13–18 on inserting and altering tables. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Describe document/collection structure as JSON-like objects compared to relational tables. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "CRUD",
					content:
						"Explain create/read/update/delete via HTTP methods (POST, GET, PUT, DELETE) with fetch options. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSONBin Setup",
					content:
						'Create a public bin, store `{"notes": ["my first message"]}`, note GET latest endpoint and PUT endpoint, and practice GET/PUT requests. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.'
				},
				{
					title: "JSM12 Project 1: Todo List",
					content:
						"Use async/await to GET the bin, render notes, and add notes with PUT; build getDB, renderDB, and addNote functions. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/1f218d8aafbcc33fd6409a8ab1616e29",
					solutionLink: "https://codepen.io/junilearning/pen/MWZzbmK",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_todo_list.gif"
				},
				{
					title: "JSM12 Project 2: Deleting Notes",
					content:
						"Add deleteNote to remove items by index with splice, update renderDB to include delete buttons, and persist via PUT. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/f8f84204c272d2a6449cda485cbe7736",
					solutionLink: "https://codepen.io/junilearning/pen/BavGpyN"
				}
			],
			supplementalProjects: [
				{
					title: "JSM12 Supplemental Project 1: Checking Notes",
					content:
						"Extend the Todo List to mark todos as completed with checkmarks or strike-through styling. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/ab6bf77b9d85e1b9a7452d5a307b6b7f",
					solutionLink:
						"https://codepen.io/junilearning/pen/bc74a6591ecf2d986cd8fd83eb46e427"
				},
				{
					title: "NoSQL and CRUD supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM12 NoSQL and CRUD. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-19-jsm12-nosql-and-crud-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-19-jsm12-nosql-and-crud-supplemental-2/solution"
				},
				{
					title: "NoSQL and CRUD supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM12 NoSQL and CRUD. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-20-jsm12-nosql-and-crud-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-20-jsm12-nosql-and-crud-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM13 Message Board",
			curriculum: [
				{
					title: "JSM13 Project 1: Message Board",
					content:
						"Build a message board storing posts as JSON, with inputs for URL, image, and title; render posts above the form. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/6c0b3c5a207fc24b58c44a5f481922e3",
					solutionLink: "https://codepen.io/junilearning/pen/GRPwwOg"
				},
				{
					title: "Message Board: Debugging and Failure Modes",
					content:
						"Focus on the mistakes students are most likely to make in JSM13 Message Board. Have them diagnose a broken attempt, repair it, and explain why the fix works. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Message Board: Planning and Architecture",
					content:
						"Break JSM13 Message Board into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Message Board: Verification and Reflection",
					content:
						"Close JSM13 Message Board by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JSM13 Supplemental Project 1: Adding Comments",
					content:
						"Allow users to add comments to each post and display them beneath posts. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/f40d31ed70aef27cee691e91d947ef14",
					solutionLink:
						"https://codepen.io/junilearning/pen/c3fb5542e72c66ad7264b94a8be3c4c0"
				},
				{
					title: "Message Board supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM13 Message Board. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-21-jsm13-message-board-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-21-jsm13-message-board-supplemental-2/solution"
				},
				{
					title: "Message Board supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM13 Message Board. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-22-jsm13-message-board-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-22-jsm13-message-board-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM14 Quiz Game",
			curriculum: [
				{
					title: "JSM14 Project 1: Quiz Game",
					content:
						"Build a state capitals quiz using canvas to color states based on answers; fetch state data from provided JSONBin and manage game states. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://codepen.io/junilearning/pen/f8ec7312634d2011e58c44d691d1da13",
					solutionLink:
						"https://codepen.io/junilearning/pen/540c4d060641bb749cefde340d69acd6",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_us_capitals_quiz.gif"
				},
				{
					title: "Quiz Game: Debugging and Failure Modes",
					content:
						"Focus on the mistakes students are most likely to make in JSM14 Quiz Game. Have them diagnose a broken attempt, repair it, and explain why the fix works. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Quiz Game: Planning and Architecture",
					content:
						"Break JSM14 Quiz Game into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Quiz Game: Verification and Reflection",
					content:
						"Close JSM14 Quiz Game by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Quiz Game: Extension Challenge",
					content:
						"Extend the work from JSM14 Quiz Game with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://codepen.io/junilearning/pen/f8ec7312634d2011e58c44d691d1da13",
					solutionLink:
						"https://codepen.io/junilearning/pen/540c4d060641bb749cefde340d69acd6"
				},
				{
					title: "Quiz Game supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM14 Quiz Game. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-23-jsm14-quiz-game-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-23-jsm14-quiz-game-supplemental-2/solution"
				},
				{
					title: "Quiz Game supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM14 Quiz Game. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-24-jsm14-quiz-game-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-24-jsm14-quiz-game-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM15 Master Project",
			curriculum: [
				{
					title: "JSM15 Project 1: Master Project",
					content:
						"Plan and build a web app or game (example chatroom). Scope to about two weeks, pseudocode stages, and work independently with support. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				},
				{
					title: "Handoff to Web Development Foundations",
					content:
						"`Web Development Foundations` should be the default follow-on course for students who complete JavaScript Level 2 successfully. Students should be reasonably comfortable with functions, conditionals, arrays, objects, events, APIs, and basic data modeling before starting it. The goal of that next course is not to reteach core syntax, but to move into file-based local projects, Git and GitHub, npm, dev servers, back-end basics, databases, and deployment. Students who are still shaky in the `JSM10` through `JSM13` range should review those units before making the jump."
				},
				{
					title: "Course Recap",
					content:
						"Recap course concepts and discuss the next course. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JSM15 Master Project: Verification and Reflection",
					content:
						"Close JSM15 Master Project by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				},
				{
					title: "JSM15 Master Project: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/solution"
				}
			],
			supplementalProjects: [
				{
					title: "JSM15 Master Project: Extension Challenge",
					content:
						"Extend the work from JSM15 Master Project with a tighter constraint, one extra feature, or a slightly more realistic input case. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/solution"
				},
				{
					title: "Master Project supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM15 Master Project. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-25-jsm15-master-project-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-25-jsm15-master-project-supplemental-2/solution"
				},
				{
					title: "Master Project supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JSM15 Master Project. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-26-jsm15-master-project-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-26-jsm15-master-project-supplemental-3/solution"
				}
			]
		}
	]
};
