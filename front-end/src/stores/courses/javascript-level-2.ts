import type { RawCourse } from "./types";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const javascriptLevel2Course: RawCourse = {
	name: "JavaScript Level 2: JavaScript Master",
	modules: [
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content: `**Review scope:** This checkpoint brings together JavaScript functions, conditionals, random values, arrays, objects, and canvas rendering. The goal is clear reasoning about where values are stored, when code runs, and how the visible output proves the program state.

**Working pattern:** Attempt each small task as an isolated program first. When the output is wrong, name the expected value, the actual value, and the line where the state first diverges. Console output, printed page output, and canvas drawings all count as evidence when they make the program behavior visible.

**Evidence target:** A complete check-in has working code for every topic area, at least one custom test case beyond the provided prompt, and a short explanation of the bug or design choice that required the most careful reasoning.`,
					solutionLink:
						"https://codepen.io/junilearning/pen/bbb5cce14f0a1bc5c5c4b5582da67750"
				},
				{
					title: "Check-In #1: Functions & Complex Conditionals",
					content: `**Concept path:** Functions package repeatable logic, while conditionals decide which path runs for each value. This section checks whether a program can isolate one job per function and then combine those functions into a larger result.

**Practice targets:** Create \`rollDie()\` so each call returns a random integer from 1 through 6. Run it 100 times, count how often the result is 6, and print both the raw count and a short interpretation. Build \`playJackpot()\` with a ternary expression for the win/loss message, then add a sum function and an \`isOdd\` function that return values instead of only printing.

**Evidence target:** The output changes across runs because randomness is involved, but every die roll remains within range. The function calls are reusable, and the conditional logic can be checked with fixed test values before the random loop is trusted.`,
					projectLink:
						"https://codepen.io/junilearning/pen/f1b05b8f30ae178563d6ecd20e816e3f"
				},
				{
					title: "Check-In #1: Arrays",
					content: `**Concept path:** Arrays preserve ordered data, so the index, length, and loop boundaries matter as much as the values themselves. This section connects random generation to later analysis.

**Practice targets:** Fill an array with 20 \`rollDie()\` results. Log the 10th element by using index 9, count how many rolls are even, and create doubled output without losing the original roll data. Use the array length rather than hard-coded loop limits when possible.

**Evidence target:** The array contains exactly 20 values, every value is in the die range, the even count matches a manual scan of one printed sample, and the doubled values are derived from the original array rather than generated separately.`
				},
				{
					title: "Check-In #1: Objects and the Canvas",
					content: `**Concept path:** Objects group related properties under one name. Canvas drawing turns object state into visible geometry, which makes the connection between data and rendering concrete.

**Practice targets:** Create a car object with descriptive properties such as make, model, color, and year. Set up a 1200 by 1200 canvas, then build a cards array where each object stores at least x position, y position, width, height, and color. Render one card first, then render the full array with a loop.

**Evidence target:** Changing a card object's coordinates or color changes the drawing without rewriting the drawing logic. The card data and the rendering function stay separate enough that new cards can be added by changing the array.`
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content: `**Project target:** Build a 3 by 3 board where each cell randomly becomes either a square or a circle. The board represents both a data problem and a drawing problem: the program needs a way to generate the board state, render it, and decide whether every cell matches.

**Build path:** Store the board in an array or two-dimensional array before drawing. Write a rendering function that clears the canvas and redraws the full board from the current data. Write a matching check that returns true only when every cell has the same shape.

**Evidence target:** The board can redraw multiple times without leaving old shapes behind. The matching check works for a manually created all-square board, a manually created mixed board, and the random board produced by the program.`,
					projectLink:
						"https://codepen.io/junilearning/pen/c9af625a0a84cbffef3dc7891aa804f9",
					solutionLink:
						"https://codepen.io/junilearning/pen/702bf96c0927e96b0089cdc58df366d0"
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
						"https://codepen.io/junilearning/pen/bbb5cce14f0a1bc5c5c4b5582da67750"
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
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-check-in-1-supplemental-2/solution"
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
					content: `**Review scope:** This checkpoint connects helper functions, event listeners, DOM updates, arrays, objects, APIs, and database vocabulary. The central question is how a browser program responds when input, events, or remote data change the available state.

**Working pattern:** Keep each feature small enough to test independently. A helper function can be checked with fixed inputs, an event listener can be checked with a visible log or page update, and an API request can be checked by inspecting the returned object before building display logic.

**Evidence target:** A complete checkpoint has at least one event-driven page change, one remote-data example, one organized data structure, and one explanation of how a value moved from input or response data into visible output.`,
					solutionLink:
						"https://codepen.io/junilearning/pen/7b72b5cd25d5372e9097f68de4b66db6"
				},
				{
					title: "Check-In #2: Helper Functions and Event Listeners",
					content: `**Concept path:** Helper functions reduce repeated code by naming one small operation. Event listeners connect browser actions to JavaScript functions, so a program can respond after the page loads.

**Practice targets:** Refactor the starter code so repeated drawing, formatting, or calculation logic lives in named helpers. Add a canvas click listener that reads the event coordinates and logs both x and y. If the canvas is positioned with CSS, account for the canvas bounding rectangle before interpreting the click location.

**Evidence target:** The refactored code has less repetition, the helper names describe their jobs, and clicking different canvas positions produces different coordinate output that matches the visible location.`,
					projectLink:
						"https://codepen.io/junilearning/pen/f6a04f3b9405ba212662f72a776bc0cd"
				},
				{
					title: "Check-In #2: APIs",
					content: `**Concept path:** An API is a structured way for one program to request data from another program. In browser JavaScript, \`fetch\` starts the request and the response must be converted to usable data before the values can be read.

**Practice targets:** Request \`https://pokeapi.co/api/v2/move/\`, convert the response to JSON, inspect the top-level object, and log the name of the first returned move. Keep the request code separate from any display code so the data shape is easy to inspect.

**Evidence target:** The console shows the full response shape during development and prints the first move name from \`results[0].name\`. Network or data errors produce a visible message instead of a silent failure.`
				},
				{
					title: "Check-In #2: Databases",
					content: `**Concept path:** Databases store related records so programs can create, read, update, and delete persistent data. SQL queries describe what data to retrieve and how tables relate.

**Practice targets:** Define \`SELECT\`, \`WHERE\`, and \`JOIN\` using a books-and-bookshelves example. Create a simple dbdiagram.io schema with a books table, a bookshelves table, and a relationship showing which shelf stores each book. List the four CRUD operations and connect each one to a possible app action.

**Evidence target:** The schema makes the relationship visible, the query vocabulary is tied to concrete records, and the CRUD examples distinguish changing stored data from merely displaying it.`
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content: `**Project target:** Build a small PokeAPI analyzer that counts move types and displays the total for a prompted type. The project combines remote data, array/object traversal, input handling, and page output.

**Build path:** Fetch move data, inspect the response, and decide which field contains the move type information needed by the project. Normalize the prompted type so capitalization does not break the comparison. Store counts in an object where each key is a type name and each value is the number of matching moves.

**Evidence target:** The page displays a count for at least two different type inputs, handles an unknown type clearly, and includes a console or page-level trace showing the data used to build the counts.`,
					projectLink:
						"https://codepen.io/junilearning/pen/a320051c74a1a5baa1358818c5bca5bc",
					solutionLink:
						"https://codepen.io/junilearning/pen/ba366d22ab4a98e653a5b2bcb4affba8"
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
						"https://codepen.io/junilearning/pen/7b72b5cd25d5372e9097f68de4b66db6"
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
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-03-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-03-check-in-2-supplemental-2/solution"
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
					content: `**Setup path:** JavaScript Level 2 uses CodePen as a fast browser workspace with separate HTML, CSS, and JavaScript panels. Fork the starter at https://codepen.io/junilearning/pen/JjGrYOG, save a personal copy, run the page, and confirm that JavaScript changes update the visible output.

**Core workflow:** Use \`printToScreen("Hello World")\` for page output and \`console.log()\` for diagnostic output. The page output is for the user-visible result; the console is for inspecting intermediate values, types, and errors.

**Evidence target:** The saved pen runs after a refresh, a small text change appears on the page, and the console can be opened to inspect a test value.`
				},
				{
					title: "Variables and Strings",
					content: `**Concept path:** Variables give names to values so a program can reuse and update information. JavaScript values commonly include numbers, strings, booleans, \`null\`, and \`undefined\`; each type behaves differently in comparisons and output.

**Practice targets:** Create examples with \`let\` and \`const\`, then inspect each value with \`typeof\`. Use \`const\` for values that are not reassigned and \`let\` for values that change. Avoid \`var\` in new code because its function-scoped behavior makes state harder to reason about.

**Evidence target:** The examples show at least one reassigned \`let\`, one protected \`const\`, one string concatenation, and one case where \`null\` and \`undefined\` mean different things.`
				},
				{
					title: "Alert and Prompt",
					content: `**Concept path:** \`alert()\` displays a blocking browser message, while \`prompt()\` collects a string from the user. Prompted input is text even when it looks like a number, so numeric calculations require conversion.

**Practice targets:** Collect a name and a number with \`prompt()\`, print a greeting to the page, and log the raw input plus converted numeric value to the console. Test canceling the prompt and entering blank text so the program handles missing input deliberately.

**Evidence target:** The page output changes based on input, numeric conversion is explicit, and invalid or missing input produces a clear fallback instead of \`NaN\` spreading through later calculations.`
				},
				{
					title: "Conditionals",
					content: `**Concept path:** Conditionals choose a code path based on a boolean expression. In JavaScript, strict equality (\`===\`) compares value and type, while loose equality (\`==\`) performs coercion that can hide bugs.

**Practice targets:** Write an \`if\`, an \`else if\`, and an \`else\` branch for a small input decision. Compare \`"5" === 5\` and \`"5" == 5\`, then connect the result to prompt input and number conversion.

**Evidence target:** The branch order is intentional, every path can be triggered with a test input, and strict comparison is used unless the code explicitly documents a conversion.`
				},
				{
					title: "JSM1 Project 1: Finish the Lyrics",
					content: `**Project target:** Build a lyric guessing game that asks three prompts, checks each answer, tracks score, and prints a final result. The project combines strings, prompt input, conditionals, and simple state updates.

**Build path:** Store the lyric snippets and accepted answers in variables or arrays. Normalize guesses with trimming and a consistent case before comparing. Update a correct-answer count after each guess, then print both the number correct and a short result message.

**Evidence target:** Three different prompts appear, exact or normalized matching is consistent, the score changes only when an answer is accepted, and the final output reports both the score and total number of questions.`,
					projectLink:
						"https://codepen.io/junilearning/pen/2d400625754c49aedbb72402eed3ba8f",
					solutionLink:
						"https://codepen.io/junilearning/pen/5e36bb6a04a440e18fb502b1cd635628"
				},
				{
					title: "Loops",
					content: `**Concept path:** Loops repeat work without duplicating code. A \`for\` loop is useful when the repeat count is known, while a \`while\` loop is useful when repetition depends on a condition that may change during execution.

**Practice targets:** Print a counting sequence with a \`for\` loop, repeat input validation with a \`while\` loop, and build a small nested-loop pattern using \`i\` for the outer loop and \`j\` for the inner loop. Use \`break\` only when there is a clear stop condition that exits early.

**Evidence target:** Loop boundaries produce the intended number of iterations, the loop variable updates in the correct place, and the program cannot become infinite under the tested inputs.`
				},
				{
					title: "Math",
					content: `**Concept path:** The \`Math\` object provides standard numeric tools for randomness, rounding, and geometry. Random values become useful only after the range and rounding rules are made explicit.

**Practice targets:** Generate a random decimal, a random integer from 1 through 10, and a random integer in a custom inclusive range. Use \`Math.floor\`, \`Math.ceil\`, and \`Math.round\` on the same decimal to compare their behavior. Use \`Math.PI\` in a circle area or circumference calculation.

**Evidence target:** The random integer formula never returns a value outside the target range, and the rounding examples show why each rounding method fits a different situation.`
				},
				{
					title: "JSM1 Project 2: Double or Nothing",
					content: `**Project target:** Build a risk-and-reward coin-flip game. Each successful flip doubles the current dollars, and a losing flip ends the round with zero.

**Build path:** Represent the current dollars with a variable, use \`Math.random()\` to simulate heads or tails, and prompt after each successful round to continue or stop. Keep the random flip, user choice, and score update as separate pieces of logic so each part can be tested.

**Evidence target:** A win doubles the displayed value, a loss resets the round correctly, stopping preserves the current total, and the game prints a final message for every ending path.`,
					projectLink:
						"https://codepen.io/junilearning/pen/546a7d889ffe394b3efeca62a005209c",
					solutionLink:
						"https://codepen.io/junilearning/pen/2b0624ece93522ec526afca3700ede22",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_double_or_nothing.gif"
				},
				{
					title: "Drawing in JavaScript",
					content: `**Concept path:** SVG describes shapes as elements in the page, and D3 helps create or update those elements from JavaScript data. Unlike canvas, SVG shapes remain as individual DOM nodes that can be selected and styled.

**Practice targets:** Create an SVG area, append at least one rectangle and one circle, and assign random colors from a small palette. Store shape settings in data objects before rendering so the drawing logic depends on data rather than repeated hard-coded calls.

**Evidence target:** The page contains visible SVG shapes, refreshing or rerunning can change color, and changing one data object changes the matching shape without rewriting the render code.`,
					projectLink:
						"https://codepen.io/junilearning/pen/90973aa93a04ccb12c61f3a85280daed",
					solutionLink:
						"https://codepen.io/junilearning/pen/a057491eec4fc8ccc9e38a5fa9f727ac"
				},
				{
					title: "HTML & CSS",
					content: `**Concept path:** HTML gives page content structure, while CSS controls presentation. JavaScript can generate or modify page content, but the result remains easier to maintain when markup, style, and behavior each have a clear job.

**Practice targets:** Build a small table with headings, rows, and cells. Style borders, spacing, font size, and alternating rows with CSS. Add at least one class that communicates meaning, such as a highlighted row or a warning value.

**Evidence target:** The table is readable without JavaScript console output, CSS selectors are specific enough to avoid accidental global changes, and the alternating-row styling still works after adding another row.`,
					projectLink:
						"https://codepen.io/junilearning/pen/90c67c576d9b57cccffe8a34b4b42525",
					solutionLink:
						"https://codepen.io/junilearning/pen/69f1a078e1066a1d71f0fa1b7cb92850"
				},
				{
					title: "Materialize and D3 Interaction",
					content: `**Concept path:** Materialize provides prebuilt interface styling, while D3 can attach behavior to selected page elements. Together they make it possible to create a styled control that changes visible state.

**Practice targets:** Add a Materialize button or card, select it with D3, and attach a click handler using \`d3.select().on("click", handler)\`. The handler can update text, color, count, or another visible property.

**Evidence target:** The interaction works after a page refresh, the selected element is specific enough to avoid affecting unrelated elements, and the visible state changes every time the event fires.`,
					projectLink:
						"https://codepen.io/junilearning/pen/81d62c84dfa32d88f17d0e012229bf0c",
					solutionLink:
						"https://codepen.io/junilearning/pen/6014e92e4707defd82249fb10b43d70d"
				}
			],
			supplementalProjects: [
				{
					title: "Fundamentals Review: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Fundamentals Review",
						section: "extension"
					}),
					projectLink:
						"https://codepen.io/junilearning/pen/2d400625754c49aedbb72402eed3ba8f",
					solutionLink:
						"https://codepen.io/junilearning/pen/5e36bb6a04a440e18fb502b1cd635628"
				},
				{
					title: "Fundamentals Review supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM1 Fundamentals Review",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-05-jsm1-fundamentals-review-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-05-jsm1-fundamentals-review-supplemental-2/solution"
				},
				{
					title: "Fundamentals Review supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM1 Fundamentals Review",
						projectKind: "extension",
						hasReference: true
					}),
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
					content: `**Concept path:** Functions turn a repeated process into a named operation. Parameters are the names used inside the function, arguments are the actual values passed during a call, and return values allow the result to be reused by other code.

**Practice targets:** Write the same small calculation as a function declaration and as an arrow function. Call each function before and after its definition where JavaScript allows it, then compare the calling-order behavior. Add one example where an inner function closes over a variable from an outer scope.

**Evidence target:** Each function has one clear job, the parameter names match the meaning of the data, and at least one returned value is used in a later calculation rather than only printed.`
				},
				{
					title: "String Interpolation",
					content: `**Concept path:** Template strings make dynamic text easier to read by placing expressions directly inside backticks. This is especially useful when output combines labels, numbers, and calculated values.

**Practice targets:** Rewrite a concatenated string using placeholder expressions inside backticks. Include at least one variable, one arithmetic expression, and one function call inside a template string. Compare the result to the older concatenation version.

**Evidence target:** The output text is identical to the concatenated version, but the source code is easier to scan because the sentence order matches the displayed sentence.`
				},
				{
					title: "JSM2 Project 1: Functions Practice",
					content: `**Project target:** Build a small function library for arithmetic practice. Each function needs a clear contract: input values, returned value, and any assumptions about valid input.

**Build path:** Implement functions for sum, difference, product of three values, average, factorial, and exponentiation. Keep printing outside the functions where possible so the same function can be reused by different callers. Include simple tests with known answers before trying random inputs.

**Evidence target:** Each function returns the expected value for at least two fixed cases, factorial handles the base case correctly, and exponentiation works for powers of 0, 1, and a larger positive integer.`,
					projectLink:
						"https://codepen.io/junilearning/pen/22b54271a2ed49675c512f1034c0e749",
					solutionLink:
						"https://codepen.io/junilearning/pen/5cd805c9464780ddb07004ec7feedd7b"
				},
				{
					title: "JSM2 Project 2: Which MetroCard",
					content: `**Project target:** Compare two transit pricing plans and recommend the cheaper option for a given ride count. The project turns a real decision into a function-driven cost model.

**Build path:** Store the monthly-pass cost and pay-per-ride cost as named constants. Write functions that compute each total, compare the results, and return a recommendation message. Print results for several sample ride counts, then add a prompted ride count for an interactive case.

**Evidence target:** The recommendation changes at the correct break-even point, the output includes both prices rather than only the winner, and invalid ride counts are rejected or repaired before calculation.`,
					projectLink:
						"https://codepen.io/junilearning/pen/7295dc0298b2f2da6af9e1287d32456a",
					solutionLink:
						"https://codepen.io/junilearning/pen/0ee1b7431e9ee2bf0befa562068702d7"
				},
				{
					title: "JSM2 Project 3: Rock Paper Scissors",
					content: `**Project target:** Build a Rock Paper Scissors match that separates input, random computer choice, round comparison, and match scoring. This separation keeps the game easier to debug than one long conditional block.

**Build path:** Implement \`yourTurn()\`, \`computerTurn()\`, and \`findResult()\`. Normalize player input before comparison, generate the computer choice from a fixed list, and update win counters after each round. Continue rounds until one side reaches three wins.

**Evidence target:** Every pair of choices produces the correct round result, ties do not change the score, invalid input does not count as a round, and the match stops immediately when a player reaches three wins.`,
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
					content: `**Project target:** Build geometry helper functions that convert formulas and classification rules into reusable JavaScript code.

**Build path:** Implement circle circumference and area helpers, triangle classification helpers, and a right-triangle check. Use named parameters for side lengths and radius, then print sample results from both fixed inputs and random inputs.

**Evidence target:** Formula outputs match hand-checkable cases, triangle classification handles equal sides and invalid side lengths, and the right-triangle check accounts for side order before applying the Pythagorean relationship.`,
					projectLink:
						"https://codepen.io/junilearning/pen/1f563eb4624314cf5b3673480ec18472",
					solutionLink:
						"https://codepen.io/junilearning/pen/b8bf00b13b1d7085a129e155c9c428eb"
				},
				{
					title: "JSM2 Supplemental Project 2: Pain at the Pump",
					content: `**Project target:** Model fuel cost from miles driven, miles per gallon, and price per gallon. The main challenge is keeping units clear so the arithmetic matches the real-world meaning.

**Build path:** Write helpers for gallons needed and total cost. Test with fixed values first, then generate random values to produce several scenarios. Format currency with \`toFixed(2)\` only at the display boundary so calculations keep full numeric precision.

**Evidence target:** The output labels miles, MPG, gallons, price, and total cost; zero or negative inputs are handled deliberately; and the rounded display does not change the underlying calculation logic.`,
					projectLink:
						"https://codepen.io/junilearning/pen/87b49903a68f15f9132d49b704444083",
					solutionLink:
						"https://codepen.io/junilearning/pen/0ec6f1fb939a959f455f1fb70519c29e"
				},
				{
					title: "JSM2 Supplemental Project 3: Game of War",
					content: `**Project target:** Simulate a simplified Game of War where random card draws determine each round winner. The project focuses on functions, randomness, scoring state, and repeatable round output.

**Build path:** Represent card ranks with numbers or named values, with Ace treated as high. Write helpers to draw a card, compare two cards, update score, and print the round summary. Run exactly 10 rounds before printing the final winner.

**Evidence target:** Ties are handled consistently, scores add up to the number of non-tied rounds, Ace beats every other rank, and each printed round includes both card values plus the updated score.`,
					projectLink:
						"https://codepen.io/junilearning/pen/06315e2ce4772499678cc4959f8e2360",
					solutionLink:
						"https://codepen.io/junilearning/pen/96fa9d7b8f7255c42c313b2d914abc48"
				},
				{
					title: "JSM2 Supplemental Project 4: Debugging Functions",
					content: `**Project target:** Debug a coffee-shop profit calculator by tracing how ingredient cost, drink price, quantity, and total profit move through the functions.

**Build path:** Identify the expected formula before changing code. Add temporary console logs around each function call to inspect inputs and returned values. Repair one bug at a time, then remove noisy diagnostic logs once the output is reliable.

**Evidence target:** The final profit calculation matches a hand-worked example, function names match their business meaning, and the corrected code avoids duplicating the same price or ingredient formula in multiple places.`,
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
					content: `**Concept path:** Complex conditionals are about ordering decisions carefully. The first matching branch runs, so overlapping conditions need to be arranged from most specific to most general or split into separate checks when multiple outcomes can apply.

**Practice targets:** Build examples with simple \`if/else\`, chained \`else if\`, nested conditions, and compound boolean expressions using \`&&\` and \`||\`. Trace each example with values that hit the first branch, a middle branch, the final \`else\`, and an edge case.

**Evidence target:** Every branch has a test value, overlapping conditions are intentional, and the code avoids unreachable branches caused by a broad condition appearing too early.`
				},
				{
					title: "Ternary Operators",
					content: `**Concept path:** A ternary expression chooses between two values with \`condition ? valueIfTrue : valueIfFalse\`. It is best for short value selection, not for multi-step behavior.

**Practice targets:** Rewrite simple assignment-based \`if/else\` logic as ternary expressions. Keep standard conditionals for cases with several statements, many branches, or side effects such as printing and score updates.

**Evidence target:** The ternary version returns the same value as the original conditional, and readability is preserved because each expression fits on one understandable line.`
				},
				{
					title: "JSM3 Project 1: Ternary Operators Practice",
					content: `**Project target:** Convert small \`if/else\` decisions into ternary expressions while preserving behavior. The purpose is not to make every conditional shorter; the purpose is to recognize when a two-way value choice is simple enough for a ternary.

**Build path:** Work one conversion at a time. Identify the condition, the true value, and the false value before writing the expression. Include examples with assignments, null checks, and default messages.

**Evidence target:** Each rewritten expression produces the same output as the original version for true and false cases, and any conditional that becomes harder to read remains in standard \`if/else\` form.`,
					projectLink:
						"https://codepen.io/junilearning/pen/a7c2ad78bc62de68676af56657849a9b",
					solutionLink:
						"https://codepen.io/junilearning/pen/b1db3868ed9880b007754b9003337700"
				},
				{
					title: "JSM3 Project 2: Department Store Discounts",
					content: `**Project target:** Build a discount calculator where multiple rules can affect the final price. The project requires careful rule ordering, function boundaries, and numeric formatting.

**Build path:** Store the original price, shopper category, and any special-number rule inputs. Write helper functions for percent discounts, perfect-square detection, prime detection, and final-price formatting. Apply rules in a documented order so the same cart always produces the same answer.

**Evidence target:** The final output shows the original price, every applied discount, and the final price. Perfect-square and prime checks include edge cases such as 1, 2, and a larger composite number.`,
					projectLink:
						"https://codepen.io/junilearning/pen/b3de9678fa8b77aae5cc988f74bd086e",
					solutionLink:
						"https://codepen.io/junilearning/pen/d37942e57460093f20ee6217402d4ba7"
				},
				{
					title: "JSM3 Project 3: Special Numbers",
					content: `**Project target:** Classify numbers by writing predicate functions that return true or false. This project strengthens digit processing, loops, modular arithmetic, and range scanning.

**Build path:** Implement separate functions for self-dividing numbers, perfect numbers, and palindrome numbers. Use small helper functions for digit extraction or divisor sums when that keeps the code clearer. Print the matching numbers from a chosen range for each category.

**Evidence target:** Each predicate has known true and false test cases, zero and repeated digits are handled deliberately, and the range output can be checked by calling the predicate directly on a few printed values.`,
					projectLink:
						"https://codepen.io/junilearning/pen/1be13919321ab5708564a8a7ca928226",
					solutionLink:
						"https://codepen.io/junilearning/pen/2ccb91adaa2536ecc746e938b9411171"
				}
			],
			supplementalProjects: [
				{
					title: "JSM3 Supplemental Project 1: Age Milestones",
					content: `**Project target:** Build an age-milestone checker that reports which milestones apply to a prompted age. The project practices ternary expressions, validation, and readable output.

**Build path:** Convert the prompted value to a number before comparison. Define milestone checks such as driving, voting, or other chosen age thresholds. Use ternary expressions for short eligibility messages and standard conditionals for validation or multi-step output.

**Evidence target:** The program handles nonnumeric input, ages below zero, exact threshold ages, and ages above every threshold. The output distinguishes eligible, not yet eligible, and invalid cases.`,
					projectLink:
						"https://codepen.io/junilearning/pen/8b95795088fd04a2a6b77fba56416332",
					solutionLink:
						"https://codepen.io/junilearning/pen/a85d4be8f2f94812a0357dae2a1d1e00"
				},
				{
					title: "Complex Conditionals supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM3 Complex Conditionals",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-07-jsm3-complex-conditionals-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-07-jsm3-complex-conditionals-supplemental-2/solution"
				},
				{
					title: "Complex Conditionals supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM3 Complex Conditionals",
						projectKind: "extension",
						hasReference: true
					}),
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
					content: `**Concept path:** The Canvas API draws pixels into a rectangular coordinate space. The origin is the top-left corner, x increases to the right, and y increases downward. Unlike SVG, canvas does not preserve each drawn shape as a separate page element.

**Practice targets:** Create a canvas element, set width and height, retrieve the 2D context, and draw simple test marks at known coordinates. Clear the canvas and redraw to verify that the current frame is fully controlled by the code.

**Evidence target:** The coordinate grid is visible through test marks, shapes appear at expected positions, and changing the canvas size or drawing coordinates produces predictable movement.`
				},
				{
					title: "JSM4 Project 1: Basic Shapes",
					content: `**Project target:** Draw basic canvas shapes using explicit position, size, color, and angle values. This project establishes the drawing vocabulary needed for later animation and games.

**Build path:** Draw rectangles with \`fillStyle\` and \`fillRect\`. Draw circles or arcs with \`ctx.arc\` and \`fill\`, using the provided degrees-to-radians helper when angles are easier to think about in degrees. Group repeated drawing into small helper functions once the first shape works.

**Evidence target:** The canvas contains at least one rectangle and one circular shape, color changes are controlled by code, and each shape's position can be predicted from its x/y coordinates.`,
					projectLink:
						"https://codepen.io/junilearning/pen/7bdedd0b00112751b87d288e4b8120b5",
					solutionLink:
						"https://codepen.io/junilearning/pen/6d083a06497b47a62825f3d2c205813e"
				},
				{
					title: "JSM4 Project 2: Shining Stars",
					content: `**Project target:** Draw stars with canvas paths, then refactor the drawing into a reusable function. The key idea is that a complex shape can be described as a sequence of line segments relative to an anchor point.

**Build path:** Use \`beginPath\`, \`moveTo\`, and \`lineTo\` to draw one star. Refactor the code into \`drawStar(x, y)\`, then call the function five times with different positions. Add color or size parameters as an extension if the base function is stable.

**Evidence target:** The five stars appear in predictable locations, the function call controls position without duplicating path code, and one coordinate change moves only the intended star.`,
					projectLink:
						"https://codepen.io/junilearning/pen/fa66f3594a65a54d562d3932d97e2cb7",
					solutionLink:
						"https://codepen.io/junilearning/pen/425a78d7d054dfda21d4242e818f64ba"
				},
				{
					title: "Writing Text on the Canvas",
					content: `**Concept path:** Canvas text is drawn into pixels just like shapes, so text placement depends on the current font, fill color, alignment, and coordinates. Redrawing text requires clearing or covering the old pixels first.

**Practice targets:** Set \`font\`, \`fillStyle\`, and \`textAlign\`, then place text with \`fillText\`. Draw labels near shapes so the connection between coordinate position and text baseline is visible.

**Evidence target:** Text appears at the intended coordinates, alignment changes affect placement predictably, and labels remain readable against the background color.`,
					projectLink:
						"https://codepen.io/junilearning/pen/9355a832c485b33c747b6c600f2d13ae",
					solutionLink:
						"https://codepen.io/junilearning/pen/1c3ffebb91e5c060c6b0ba4ae4df8275"
				}
			],
			supplementalProjects: [
				{
					title: "JSM4 Supplemental Project 1: Loopy Landscape",
					content: `**Project target:** Create a landscape scene with repeated canvas shapes. The main challenge is using loops and helper functions so the scene is structured rather than hand-coded one shape at a time.

**Build path:** Choose a background, horizon, and at least three repeated elements such as stars, trees, buildings, clouds, or mountains. Store repeated element settings in arrays or generate them with loops. Use helper functions for each repeated shape family.

**Evidence target:** The scene contains repeated elements created by loops, the drawing order places background shapes behind foreground shapes, and changing one helper or data value updates a visible group of shapes.`,
					projectLink:
						"https://codepen.io/junilearning/pen/7911fd2b7b0ff50be9320b0c069f0613",
					solutionLink:
						"https://codepen.io/junilearning/pen/d704fa037c5f913792b1df06c8fddd6d"
				},
				{
					title: "JSM4 Supplemental Project 2: JNI Stock Price",
					content: `**Project target:** Draw a stock-price line graph on canvas with labels and scaled data. The project connects numeric arrays to visual coordinates.

**Build path:** Store stock prices in an array, calculate the minimum and maximum values, and map each price to a y-coordinate inside the graph area. Draw axes, labels, plotted points, and line segments connecting the points.

**Evidence target:** The graph includes labeled axes, the highest price appears near the top of the plot area, the lowest price appears near the bottom, and changing one data value updates the plotted line correctly.`,
					projectLink:
						"https://codepen.io/junilearning/pen/aa96160a1e7c1d1bdac74cfe5e6a9333",
					solutionLink:
						"https://codepen.io/junilearning/pen/1d48af84b840e8d7a72fd02e82de9f28"
				},
				{
					title: "Canvas supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM4 Canvas",
						projectKind: "extension",
						hasReference: true
					}),
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
					content: `**Concept path:** Arrays store ordered collections. Index 0 is the first element, \`length\` counts the elements, and array methods can either leave the original array unchanged or mutate it directly.

**Practice targets:** Read and reassign values by index, add and remove values with \`push\` and \`pop\`, and compare \`slice\` with \`splice\` on the same sample array. Print the original and changed arrays after each operation.

**Evidence target:** The output shows which operations mutate the original array, which return a new array, and how off-by-one errors appear when index and length are confused.`
				},
				{
					title: "JSM5 Project 1: Foray into Arrays",
					content: `**Project target:** Practice common array operations through small data tasks. The project emphasizes reading, updating, generating, and analyzing array values without losing track of index boundaries.

**Build path:** Manipulate pet arrays, identify perfect squares, compute sums, generate random arrays, and compare first and last elements. Use \`printToScreen()\` after each task so the result is visible without relying only on the console.

**Evidence target:** Each array task prints the starting data and final result, random arrays stay within the requested range, and first/last comparisons handle arrays of different lengths including a one-element array.`,
					projectLink:
						"https://codepen.io/junilearning/pen/96047a35895a6620240bd2ce171a71ec",
					solutionLink:
						"https://codepen.io/junilearning/pen/6925d98f7583227a4c1c65996a10cf40"
				},
				{
					title: "For-Of and For-Each Iterators",
					content: `**Concept path:** \`for...of\` loops iterate directly over values, while \`forEach\` runs a callback once for each element. Both are useful when the code needs every value, but they differ in syntax and control flow.

**Practice targets:** Print the same array with a classic index loop, \`for...of\`, and \`forEach\`. Add a callback that uses a variable from the surrounding scope so closure behavior is visible. Compare which loop form is easiest when the index is needed.

**Evidence target:** The three loop styles produce the same value order, the callback example uses outside state intentionally, and the chosen loop form matches whether the task needs values only or values plus indices.`
				},
				{
					title: "Advanced Iterators",
					content: `**Concept path:** \`map\`, \`filter\`, and \`reduce\` express common transformations. \`map\` changes each element into a new value, \`filter\` keeps matching elements, and \`reduce\` combines all elements into one result.

**Practice targets:** Use \`map\` to double numbers, \`filter\` to keep values divisible by a chosen number, and \`reduce\` to calculate a sum. Print the original array after each operation to confirm whether it changed.

**Evidence target:** Each iterator has a clear input array and output value, the callback return value is correct for the method, and \`reduce\` includes an explicit starting value when that makes the result safer.`
				},
				{
					title: "JSM5 Project 2: Integrating Iterators",
					content: `**Project target:** Use iterator methods to transform and analyze arrays without writing every task as a manual index loop. The project highlights method choice: transformation, selection, or accumulation.

**Build path:** Adjust arrays with \`map\`, invoke functions stored in objects, sum even values with \`reduce\`, and filter values divisible by a selected number. Keep each task in a named function so the iterator method and callback are easy to inspect.

**Evidence target:** The output identifies which iterator method was used for each task, original arrays remain available for comparison, and edge cases such as empty arrays or no matching values are handled clearly.`,
					projectLink:
						"https://codepen.io/junilearning/pen/2e76b16dbd71552eeb1179b45b57ae2d",
					solutionLink:
						"https://codepen.io/junilearning/pen/2d9117dd9b2d44b478d8155655c7bb9b"
				},
				{
					title: "JSM5 Project 3: Colorful Cards",
					content: `**Project target:** Render a row of canvas cards from an array of colors. The project connects array order, iterator callbacks, and x-coordinate spacing.

**Build path:** Store the colors in an array, write a card drawing helper, and use an iterator to draw each card at the correct x position. Derive card position from the index rather than hard-coding every coordinate.

**Evidence target:** The number of drawn cards matches the array length, changing the color array changes the rendered row, and card spacing remains consistent when another color is added.`,
					projectLink:
						"https://codepen.io/junilearning/pen/b167fc3da0e85d5ff65158f799658566",
					solutionLink:
						"https://codepen.io/junilearning/pen/03f3b4a97545b4fcec50aa6b11ab4188"
				},
				{
					title: "Two-Dimensional Arrays",
					content: `**Concept path:** A two-dimensional array is an array whose elements are also arrays. It is useful for grid data because values can be addressed by row and column.

**Practice targets:** Create a small 2D array manually, access values with \`arr[row][col]\`, then generate a 12 by 12 multiplication table with nested loops. Print row and column labels so the grid meaning is clear.

**Evidence target:** The multiplication table has the correct dimensions, row and column positions match the expected products, and the nested loop variables are not accidentally swapped.`
				},
				{
					title: "JSM5 Project 4: Colorful Cards in 2D",
					content: `**Project target:** Render a 5 by 5 grid of colored cards from a two-dimensional array. The project combines grid data, nested iteration, and canvas coordinate mapping.

**Build path:** Create the color grid as a 2D array, then use nested iteration to draw one card for each row and column. Calculate x from the column index and y from the row index. Keep card size and gap values as named constants.

**Evidence target:** The rendered grid has 25 cards, row and column changes map to the correct direction on the canvas, and changing one color in the data changes one matching card.`,
					projectLink:
						"https://codepen.io/junilearning/pen/1dce247c86d866c1f33a6dce86511c71",
					solutionLink:
						"https://codepen.io/junilearning/pen/54cadf32718bc4b635e9b82ea67a7a7f"
				}
			],
			supplementalProjects: [
				{
					title: "JSM5 Supplemental Project 1: Pokemon Master",
					content: `**Project target:** Use two-dimensional arrays to represent a Pokemon-style grid of locations or encounters. The core skill is translating row/column data into meaningful game state.

**Build path:** Inspect the starter grid, identify what each row and column represents, and write functions that read or update specific cells. Add at least one search or count operation across the full grid.

**Evidence target:** The program can access a specific cell, scan the full grid, and update a value without disturbing neighboring cells. Boundary cases for the first and last row or column are checked explicitly.`,
					projectLink:
						"https://codepen.io/junilearning/pen/61d80971229e4f85126de1fcfb54b1d8",
					solutionLink:
						"https://codepen.io/junilearning/pen/03693f4763858d7d7c10a34186e030f3"
				},
				{
					title: "JSM5 Supplemental Project 2: Random Icons",
					content: `**Project target:** Generate a small icon gallery by combining arrays, randomness, D3 selection, and Materialize styling.

**Build path:** Store icon names and color choices in arrays. Randomly choose six icon/color pairs, then render them into styled page elements. Keep random selection separate from rendering so the chosen data can be logged and checked.

**Evidence target:** Six icons appear on the page, icon and color choices come from the configured arrays, repeated runs can produce different combinations, and the layout remains readable when duplicate icons appear.`,
					projectLink:
						"https://codepen.io/junilearning/pen/e3ae971ad6fd35c3c0829208cb049099",
					solutionLink:
						"https://codepen.io/junilearning/pen/f163e56c8fa75a482877d789d08fc784"
				},
				{
					title: "Arrays and Iterators supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM5 Arrays and Iterators",
						projectKind: "extension",
						hasReference: true
					}),
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
					content: `**Concept path:** Objects store related values as key-value pairs. They are useful when several pieces of information describe the same thing, such as one business, one player, one card, or one animated shape.

**Practice targets:** Create objects with string, number, boolean, and array properties. Read properties with dot notation and bracket notation, add a new property after creation, and update an existing property. Compare object organization with parallel arrays to see why named properties make code easier to read.

**Evidence target:** The same object can be printed, updated, and passed into a function. The function reads named properties rather than relying on the order of separate arrays.`
				},
				{
					title: "JSM6 Project 1: Small Talk",
					content: `**Project target:** Build a small comparison program that stores profile data in objects and responds based on shared properties. The project practices prompts, object construction, property access, and ternary expressions.

**Build path:** Create one object with fixed profile data and another object from prompted input. Compare at least three properties such as favorite color, hobby, or preferred food. Use short ternary expressions for simple match messages, then print a friendly summary.

**Evidence target:** The prompted object contains the expected keys, comparisons are case-normalized when appropriate, and the output changes when one shared property matches versus when none match.`,
					projectLink:
						"https://codepen.io/junilearning/pen/c8c02ee2db01eeb4c5f408d9a1f58815",
					solutionLink:
						"https://codepen.io/junilearning/pen/0ed9be7b36e44c36de057a37265095a3"
				},
				{
					title: "For-In Iterator",
					content: `**Concept path:** A \`for...in\` loop iterates over an object's property names. It is useful when the exact keys may vary or when an object needs to be displayed without manually listing every property.

**Practice targets:** Print every key and value in a sample object. Add a property and rerun the same loop to prove the display logic adapts. Compare this with looping through an array using \`for...of\`.

**Evidence target:** The loop output includes all current object properties, newly added properties appear without changing the loop body, and array iteration is kept separate from object-key iteration.`
				},
				{
					title: "JSM6 Project 2: My Favorite Businesses",
					content: `**Project target:** Model favorite businesses as objects and render a readable summary for each one. The project combines arrays, objects, loops, and template strings.

**Build path:** Create an array of business objects with properties such as name, category, location, rating, and products. Loop through the array and build a template-string summary for each business. Include a nested products array when a business sells more than one item.

**Evidence target:** The page displays every business from the data array, adding a new business object adds a new rendered summary, and product lists render without hard-coded output for a specific business.`,
					projectLink:
						"https://codepen.io/junilearning/pen/bcc6527a03ffb7ca42b705ff3f3910dd",
					solutionLink:
						"https://codepen.io/junilearning/pen/c694262e464e83912c601ad1875d6cd2"
				},
				{
					title: "Animations in the Canvas",
					content: `**Concept path:** Canvas animation works by repeatedly clearing the previous frame, updating state, and drawing the next frame. \`requestAnimationFrame\` schedules drawing in sync with the browser.

**Practice targets:** Create an object with position and velocity, update its position each frame, clear the canvas with \`clearRect\`, and redraw the object. Keep update logic separate from drawing logic so movement can be changed without rewriting the visual code.

**Evidence target:** The animation moves smoothly, old frames do not leave trails unless trails are intentional, and pausing or changing velocity affects future frames predictably.`,
					projectLink: "https://codepen.io/junilearning/pen/zYBjpZE"
				},
				{
					title: "JSM6 Project 3: Inflate and Deflate",
					content: `**Project target:** Animate a ball object that grows and shrinks while changing color. The project uses object state to control radius, color, and animation phase.

**Build path:** Store the ball's x position, y position, radius, color, and growth direction in an object. Write \`draw\`, \`inflate\`, and \`deflate\` functions, then call them from a \`requestAnimationFrame\` loop. Switch from inflating to deflating at a maximum radius and back again at a minimum radius.

**Evidence target:** The ball stays centered while its radius changes, the color changes with the current phase, and the animation continues without the radius becoming negative or growing forever.`,
					projectLink:
						"https://codepen.io/junilearning/pen/d0195323eaa77fa2a273961fa3df61c3",
					solutionLink:
						"https://codepen.io/junilearning/pen/20f860c221cac7107010e0299f47b953"
				}
			],
			supplementalProjects: [
				{
					title: "JSM6 Supplemental Project 1: My Favorite Businesses II",
					content: `**Project target:** Extend the business data project into a richer interface with images, cards, and autocomplete. The focus is connecting object data to reusable UI rendering.

**Build path:** Add image URLs and product data to the business objects. Render each business into a Materialize card, then configure autocomplete choices from the same business data. Selecting a business fills the page with the matching card details.

**Evidence target:** The autocomplete options are generated from the data array, cards render from object properties rather than copied markup, and missing images or unknown names produce a safe fallback.`,
					projectLink:
						"https://codepen.io/junilearning/pen/50854534e6dccd9c7bedc0a2d01aded7",
					solutionLink:
						"https://codepen.io/junilearning/pen/7cbfe6e04babe21bb34a6d6af1028f57"
				},
				{
					title: "JSM6 Supplemental Project 2: Circle March",
					content: `**Project target:** Animate a grid of circles moving together across the canvas. The project practices arrays of objects, repeated drawing, and coordinated state updates.

**Build path:** Store each circle as an object with position, radius, color, and velocity. Draw the full grid each frame, then update every circle's position before the next frame. Add wraparound or boundary logic so the animation remains on screen.

**Evidence target:** The grid contains multiple circles generated from data, every circle updates through the same loop, and the animation can run for many frames without drifting into an unusable state.`,
					projectLink:
						"https://codepen.io/junilearning/pen/7ac4e84b6d1ce34caa732bc0945c6255",
					solutionLink:
						"https://codepen.io/junilearning/pen/abdb1b2dadb02ac244d8cf862bd9b321"
				},
				{
					title: "Objects and Properties supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM6 Objects and Properties",
						projectKind: "extension",
						hasReference: true
					}),
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
					content: `**Concept path:** Helper functions keep a program understandable by giving a name to repeated or low-level work. A good helper has one purpose, a clear input contract, and a result that the caller can use.

**Practice targets:** Find repeated drawing or formatting code, extract it into helper functions, and replace the copied code with calls. Use names that describe the result, such as \`drawCard\`, \`isInsideRectangle\`, or \`formatScore\`.

**Evidence target:** The refactored program produces the same visible result as before, but changing one helper updates every matching use case.`
				},
				{
					title: "JSM7 Project 1: Refactory",
					content: `**Project target:** Refactor a working starter into smaller helper functions without changing visible behavior. The purpose is to improve structure while preserving correctness.

**Build path:** Identify repeated blocks, name the shared job, extract parameters for the values that change, and replace repeated code with helper calls. Run the program after each extraction so regressions are easy to locate.

**Evidence target:** The final output matches the starter behavior, repeated code is removed, and each helper name communicates its purpose without needing to inspect the full body.`,
					projectLink:
						"https://codepen.io/junilearning/pen/3a1383fc8a60d0ff0f55419c9b4940fe",
					solutionLink:
						"https://codepen.io/junilearning/pen/4e1986a769365ecdef09ebeea1144a4f"
				},
				{
					title: "Mouse Events",
					content: `**Concept path:** Mouse events carry information about what happened and where it happened. Canvas programs usually need to translate page coordinates into canvas coordinates before deciding what was clicked.

**Practice targets:** Add \`click\`, \`mousedown\`, and \`mouseup\` listeners to a canvas. Log event coordinates, convert them relative to the canvas, and display the converted coordinates on the page or console.

**Evidence target:** Clicking different canvas positions produces different converted coordinates, and the program distinguishes a press, release, and full click.`
				},
				{
					title: "JSM7 Project 2: Which Card",
					content: `**Project target:** Extend the Colorful Cards project so clicking a card reports which card was selected. The project combines canvas geometry, event coordinates, and array data.

**Build path:** Reuse the card data from the previous project, add a canvas click listener, convert the click coordinates, and compare the click point with each card's rectangle. Print the selected color or a clear message when the click misses every card.

**Evidence target:** Clicking inside each card reports the correct color, clicking the gap between cards does not produce a false match, and changing card size or spacing only requires updating the card data or constants.`,
					projectLink:
						"https://codepen.io/junilearning/pen/88140a4225b8cfb5468e91fbccfaa100",
					solutionLink:
						"https://codepen.io/junilearning/pen/1e1ad471f376b1364cd157bd9c96f9ab"
				},
				{
					title: "Key Events",
					content: `**Concept path:** Keyboard events let a browser game respond to pressed and released keys. For smooth movement, the program usually tracks which keys are currently active rather than moving only once per key press.

**Practice targets:** Add \`keydown\` and \`keyup\` listeners, record left and right arrow state, and compare older numeric key codes with modern key names such as \`ArrowLeft\` and \`ArrowRight\`.

**Evidence target:** Pressing a key changes stored input state, releasing it clears that state, and the program can handle holding a key down for repeated movement.`
				},
				{
					title: "JSM7 Project 3: Paddle",
					content: `**Project target:** Build a keyboard-controlled paddle that moves smoothly left and right. This creates the control foundation for later canvas games.

**Build path:** Store paddle position, width, speed, and key state. On \`keydown\`, mark the matching direction active; on \`keyup\`, mark it inactive. In the animation loop, update the paddle position based on active keys and keep it inside the canvas bounds.

**Evidence target:** The paddle begins moving when an arrow key is held, stops when the key is released, cannot leave the canvas, and remains responsive when switching directions quickly.`,
					projectLink:
						"https://codepen.io/junilearning/pen/8ccc67de1bc03e5f2c81f78a411adee1",
					solutionLink:
						"https://codepen.io/junilearning/pen/f633db1559cc122a943d0a52bcf74ebc"
				}
			],
			supplementalProjects: [
				{
					title: "JSM7 Supplemental Project 1: Coastal Cruise",
					content: `**Project target:** Model a cruise registration system with helper functions that manage passenger data and ship capacity.

**Build path:** Store seats or rooms in arrays, then write helpers to check whether space remains, register a passenger, remove or reject invalid entries, and print a manifest. Keep capacity checks separate from display formatting.

**Evidence target:** Full ships reject additional passengers, manifests match the stored passenger data, and helper functions can be tested with small sample ships before running the full scenario.`,
					projectLink:
						"https://codepen.io/junilearning/pen/13e9d8e0ad56ecbaff7933d0e063d682",
					solutionLink:
						"https://codepen.io/junilearning/pen/8c0f86e9e4d1996ac073f2d675141072"
				},
				{
					title: "JSM7 Supplemental Project 2: Juggling Paddle",
					content: `**Project target:** Combine paddle controls with a falling ball to create a small juggling challenge. The project introduces collision checks between moving objects.

**Build path:** Animate the ball with vertical velocity, control the paddle with keyboard input, and check whether the ball overlaps the paddle when it reaches paddle height. Reverse or reset the ball on a successful hit; end or mark a miss when the ball falls below the screen.

**Evidence target:** The ball bounces only when it overlaps the paddle, misses are detected reliably, and score or lives update based on hit and miss events.`,
					projectLink:
						"https://codepen.io/junilearning/pen/9c003b58d7ca7770e49f9243dbecb00f",
					solutionLink:
						"https://codepen.io/junilearning/pen/8f44f06f31939f0a56050f4718f0b608"
				},
				{
					title: "Helper Functions and Event Listeners supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle:
							"JSM7 Helper Functions and Event Listeners",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-12-jsm7-helper-functions-and-event-listeners-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-12-jsm7-helper-functions-and-event-listeners-supplemental-3/solution"
				}
			]
		},
		{
			title: "JSM8 Collisions and Controls",
			curriculum: [
				{
					title: "Object Collisions",
					content: `**Concept path:** Collision detection turns geometry into boolean logic. Circle collision compares distance between centers with the combined radii, while rectangle collision checks whether edges overlap on both axes.

**Practice targets:** Write one circle-collision function and one rectangle-collision function. Test with clearly separated objects, touching objects, overlapping objects, and edge cases where one object is exactly on the boundary.

**Evidence target:** The functions return true only when the shapes overlap or touch according to the chosen rule, and false when they are separated horizontally or vertically.`
				},
				{
					title: "JSM8 Project 1: Circles Collide",
					content: `**Project target:** Animate two circles moving toward each other and detect the moment they collide. This project connects motion state with a geometric condition.

**Build path:** Store each circle's center, radius, velocity, and color. Update positions on a timed loop or animation frame, calculate center distance, and change fill color once the distance is less than or equal to the combined radii.

**Evidence target:** The circles change color at the collision boundary, not before they visibly meet and not after they pass through each other. Adjusting speed or radius still produces correct collision timing.`,
					projectLink:
						"https://codepen.io/junilearning/pen/d4a36001e0d9b6e58c640ca0f280284a",
					solutionLink:
						"https://codepen.io/junilearning/pen/2cc6ea883fc971206d81c61a3f93582e"
				},
				{
					title: "JSM8 Project 2: Rectangular Collision",
					content: `**Project target:** Generate rectangles and detect whether they overlap. The core idea is that rectangles collide when their x-ranges and y-ranges overlap at the same time.

**Build path:** Create rectangle objects with x, y, width, height, and color. Draw each rectangle, calculate left/right/top/bottom edges, and compare edges to detect overlap. Display a message showing whether the current rectangles collide.

**Evidence target:** The collision result matches visible overlap, touching edges are handled according to a documented rule, and random rectangles can be regenerated without breaking the check.`,
					projectLink:
						"https://codepen.io/junilearning/pen/1c22a392782c8551073c92fe3e825849",
					solutionLink:
						"https://codepen.io/junilearning/pen/ba1bd74c40cacbdddafc645ba3f7350a"
				},
				{
					title: "JSM8 Project 3: The Bouncy Ball",
					content: `**Project target:** Simulate a bouncing ball with velocity, gravity, friction, and wall collisions. The project turns simple physics ideas into repeated state updates.

**Build path:** Store position and velocity on both axes. Add gravity to vertical velocity each frame, update position, reverse velocity when the ball hits the ground or walls, and apply friction or damping so bounces gradually change.

**Evidence target:** The ball accelerates downward, bounces at boundaries, loses or preserves energy according to the chosen damping value, and does not sink through the floor or disappear past the canvas edges.`,
					projectLink:
						"https://codepen.io/junilearning/pen/1e97468ca0197dcf6ca6d933e175b6fb",
					solutionLink:
						"https://codepen.io/junilearning/pen/fb9156c7c34ad0319ba52c3c01b326c3"
				}
			],
			supplementalProjects: [
				{
					title: "Collisions and Controls: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Collisions and Controls",
						section: "extension"
					}),
					projectLink:
						"https://codepen.io/junilearning/pen/d4a36001e0d9b6e58c640ca0f280284a",
					solutionLink:
						"https://codepen.io/junilearning/pen/2cc6ea883fc971206d81c61a3f93582e"
				},
				{
					title: "Collisions and Controls supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM8 Collisions and Controls",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-13-jsm8-collisions-and-controls-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-13-jsm8-collisions-and-controls-supplemental-2/solution"
				},
				{
					title: "Collisions and Controls supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM8 Collisions and Controls",
						projectKind: "extension",
						hasReference: true
					}),
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
					content: `**Project selection:** Choose one canvas game and treat it as a multi-session build. The goal is a playable loop with visible state, input handling, collision or scoring logic, and a clear win/loss or completion condition.

**Scope path:** Define the smallest playable version first: one player action, one obstacle or target, one score or state display, and one restart or end condition. Extra art, levels, and polish belong after the core loop works.

**Evidence target:** The selected game has a written feature list, a minimal playable milestone, and at least one planned extension that can be cut without breaking the base game.`
				},
				{
					title: "JSM9 Project 1: Falling Skies",
					content: `**Project target:** Build a falling-object game where the player dodges or catches objects. The main challenge is coordinating spawn timing, movement, collision checks, and score updates inside one game loop.

**Build path:** Create player state, falling-object state, keyboard or mouse controls, and a loop that updates positions before drawing. Spawn new objects on a timer or frame count, remove off-screen objects, and update score or lives when collisions occur.

**Evidence target:** Objects fall consistently, player controls remain responsive, collisions affect score or lives exactly once per event, and the game has a visible end or restart state.`,
					projectLink:
						"https://codepen.io/junilearning/pen/8d640d76fa709de228ec6303625663e3",
					solutionLink:
						"https://codepen.io/junilearning/pen/643e3bf98d5a641557276dbc1f269a02"
				},
				{
					title: "JSM9 Project 2: 2D Breakout",
					content: `**Project target:** Build a Breakout-style game with a paddle, ball, brick grid, collision response, and win condition.

**Build path:** Store bricks in an array or grid, draw the paddle and ball, update ball position each frame, and detect collisions with walls, paddle, and bricks. Remove or mark bricks after collision, then check whether all bricks are gone.

**Evidence target:** The ball bounces from the paddle and walls, bricks disappear only after collision, the score or remaining-brick count updates correctly, and a win state appears when no bricks remain.`,
					projectLink:
						"https://codepen.io/junilearning/pen/0d5f9c3b21921a4bc506a1139a3091bc",
					solutionLink:
						"https://codepen.io/junilearning/pen/778b7aa1d7bcd942b617d87a517d35e2"
				},
				{
					title: "JSM9 Project 3: Asteroids",
					content: `**Project target:** Build an Asteroids-style game with ship rotation, movement, projectiles, asteroid collisions, scoring, and game-over logic.

**Build path:** Store ship angle, velocity, bullets, and asteroid objects. Convert angles into x/y movement, update bullets each frame, split or remove asteroids on hit, and detect collisions between the ship and asteroids.

**Evidence target:** Rotation affects movement direction, bullets travel independently from the ship, asteroid hits change the asteroid list and score, and game-over detection cannot be bypassed by fast motion.`,
					projectLink:
						"https://codepen.io/junilearning/pen/4d14f6e432dd3b2dcee15a9d95eac750",
					solutionLink:
						"https://codepen.io/junilearning/pen/8a5307a6643fbf762925b08229b5a847"
				},
				{
					title: "JSM9 Project 4: Animated Starfield",
					content: `**Project target:** Create an animated starfield using many small objects that move across the canvas. The project focuses on object arrays, repeated updates, and visual polish through simple rules.

**Build path:** Generate star objects with x, y, size, speed, and brightness. Update each star every frame, redraw the scene, and wrap or reset stars that leave the screen. Add depth by varying speed or size.

**Evidence target:** Many stars animate at once, motion continues smoothly after wraparound, and changing the star data generation changes the visual density or depth without rewriting the animation loop.`,
					projectLink:
						"https://codepen.io/junilearning/pen/6d5f8181e8ea59009eadd259e249c5c5",
					solutionLink:
						"https://codepen.io/junilearning/pen/ac7242107973239507eebc571a767c5a"
				}
			],
			supplementalProjects: [
				{
					title: "Games in the Canvas: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Games in the Canvas",
						section: "extension"
					}),
					projectLink:
						"https://codepen.io/junilearning/pen/8d640d76fa709de228ec6303625663e3",
					solutionLink:
						"https://codepen.io/junilearning/pen/643e3bf98d5a641557276dbc1f269a02"
				},
				{
					title: "Games in the Canvas supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM9 Games in the Canvas",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-15-jsm9-games-in-the-canvas-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-15-jsm9-games-in-the-canvas-supplemental-2/solution"
				},
				{
					title: "Games in the Canvas supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM9 Games in the Canvas",
						projectKind: "extension",
						hasReference: true
					}),
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
					content: `**Concept path:** API requests are asynchronous because the browser must wait for another service to respond. \`fetch\` returns a promise, and the response body must be parsed, commonly with \`.json()\`, before the data can be used.

**Practice targets:** Fetch a small public API, log the raw response status, parse JSON, and inspect the data shape before rendering. Add a visible loading state and an error state so the page does not look broken while waiting or after failure.

**Evidence target:** The page behavior distinguishes loading, successful data, and failed request states. The code reads data from the parsed response instead of assuming the shape without inspection.`
				},
				{
					title: "JSM10 Project 1: Programming Jokes",
					content: `**Project target:** Fetch a random programming joke and display both setup and punchline in the page. The project practices promise handling and data-driven rendering.

**Build path:** Request \`https://official-joke-api.appspot.com/jokes/programming/random\`, parse the JSON response, inspect whether the API returns an array or object, and render the joke fields safely. Add a button to request another joke.

**Evidence target:** The page displays a joke after the request finishes, repeated clicks can load new jokes, and request errors display a readable fallback message.`,
					projectLink:
						"https://codepen.io/junilearning/pen/55981d32b9659656bb8cc4a17a0526bc",
					solutionLink:
						"https://codepen.io/junilearning/pen/e82a3c7cb28fcfba32ad765c0fe3009a"
				},
				{
					title: "JSM10 Project 2: Random Fox Generator",
					content: `**Project target:** Build a random fox image generator that fetches image data and updates the page on demand.

**Build path:** Request \`https://randomfox.ca/floof/\`, read the returned image URL, create or update an \`img\` element, and trigger the request from a button click. Keep the old image visible or show a loading state while the next image is loading.

**Evidence target:** Clicking the button updates the displayed image, the image has useful alt text, and network errors produce a visible fallback instead of leaving an empty page.`,
					projectLink:
						"https://codepen.io/junilearning/pen/93750fc08b5b2268a1d78b296295e2e8",
					solutionLink:
						"https://codepen.io/junilearning/pen/686374da7355c247854acf33c3904b25"
				},
				{
					title: "JSM10 Project 3: Pokedex",
					content: `**Project target:** Build a small Pokedex that searches PokeAPI and renders selected Pokemon details. The project combines autocomplete, remote data, error handling, and structured display.

**Build path:** Load or define autocomplete options, request the selected Pokemon from PokeAPI, and display name, id, type, and image. Normalize search input and handle unknown Pokemon names without crashing the page.

**Evidence target:** Valid searches render the correct details, invalid searches produce a clear message, the image and text update together, and the interface remains usable after a failed request.`,
					projectLink:
						"https://codepen.io/junilearning/pen/35923b1d6dee01a5f3004d67836eca46",
					solutionLink:
						"https://codepen.io/junilearning/pen/e72824bf10e7457a18774db2554f860e"
				}
			],
			supplementalProjects: [
				{
					title: "JSM10 Supplemental Project 1: Funny Meter",
					content: `**Project target:** Build a joke-rating interface that fetches multiple jokes, presents them one at a time, and records a rating for each.

**Build path:** Request the \`/jokes/programming/ten\` endpoint, store the returned jokes in an array, and track the current joke index plus user ratings. Advance only after a rating is recorded, then show a final summary with average rating or highest-rated joke.

**Evidence target:** Ten jokes are available after the request, each rating is stored with the correct joke, navigation does not skip or repeat jokes accidentally, and the final summary reflects the recorded data.`,
					projectLink:
						"https://codepen.io/junilearning/pen/bf88ab46e0b7314e0b0999ba35363519",
					solutionLink:
						"https://codepen.io/junilearning/pen/d07e0093689c1e654fc59de47093b043"
				},
				{
					title: "APIs and Requests supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM10 APIs and Requests",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-17-jsm10-apis-and-requests-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-17-jsm10-apis-and-requests-supplemental-2/solution"
				},
				{
					title: "APIs and Requests supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM10 APIs and Requests",
						projectKind: "extension",
						hasReference: true
					}),
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
						"Complete SQLBolt lessons 1-4 and record the core `SELECT` patterns used: selecting specific columns, filtering with `WHERE`, ordering results, and limiting output. After the practice, write two original query examples and explain what table shape each query expects.",
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
					content:
						"Complete SQLBolt lessons 6-7 and focus on why `JOIN` requires a relationship between tables. Identify the key columns being matched, describe what rows should appear in the result, and write one extra join query that would answer a realistic question about related records.",
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
				}
			],
			supplementalProjects: [
				{
					title: "JSM11 Supplemental Project 1: Advanced SQL Queries",
					content:
						"Complete SQLBolt lessons 8-12 with attention to `NULL`, aggregation, grouping, and query cleanup. For each new query feature, write down one case where it changes the answer compared with a simpler `SELECT` query, then test at least one query that handles missing data deliberately.",
					projectLink:
						"https://sqlbolt.com/lesson/select_queries_with_nulls"
				},
				{
					title: "JSM11 Supplemental Project 2: Music Library",
					content:
						"Create a music library schema with tables for artists, songs, albums, and genres. Use primary keys for each table, foreign keys for relationships, and at least one many-to-many relationship where appropriate. Finish by explaining how the schema avoids duplicating the same artist or genre information across many rows.",
					projectLink: "https://dbdiagram.io/d",
					solutionLink:
						"https://dbdiagram.io/d/5fadb2e23a78976d7b7bb248"
				},
				{
					title: "JSM11 Supplemental Project 3: Altering Tables",
					content:
						"Complete SQLBolt lessons 13-18 and focus on how data changes after `INSERT`, `UPDATE`, `DELETE`, and table-altering commands. For each operation, identify the before-and-after state of the table and write one safety check that would prevent accidental data loss or malformed records.",
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
						'Create a public JSONBin record with a small starter object such as `{"notes": ["my first message"]}`. Identify the latest-record GET endpoint and the PUT endpoint, then test both requests before building UI around them. The key skill is separating local page state from persisted remote state: after a refresh, the saved data should still be recoverable from the bin.'
				},
				{
					title: "JSM12 Project 1: To-Do List",
					content:
						"Build a persistent to-do list by loading the current bin with `async`/`await`, rendering the notes, adding a new note from user input, and saving the updated array with PUT. Keep the workflow split into `getDB`, `renderDB`, and `addNote` so fetching, drawing, and mutation can be tested separately. Verify persistence by adding a note, refreshing the page, and confirming the note still appears.",
					projectLink:
						"https://codepen.io/junilearning/pen/1f218d8aafbcc33fd6409a8ab1616e29",
					solutionLink: "https://codepen.io/junilearning/pen/MWZzbmK",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_todo_list.gif"
				},
				{
					title: "JSM12 Project 2: Deleting Notes",
					content:
						"Extend the to-do list with a `deleteNote` function that removes the selected note by index, re-renders the list, and persists the changed array with PUT. Include a delete button beside each rendered note and verify that deleting the first, last, and only remaining note all produce the expected saved state.",
					projectLink:
						"https://codepen.io/junilearning/pen/f8f84204c272d2a6449cda485cbe7736",
					solutionLink: "https://codepen.io/junilearning/pen/BavGpyN"
				}
			],
			supplementalProjects: [
				{
					title: "JSM12 Supplemental Project 1: Checking Notes",
					content:
						"Extend the to-do list so each item can be marked complete without deleting it. Store completion state in the saved data, render completed notes with a visible checkmark or strike-through style, and verify that completed/uncompleted status survives a page refresh. This turns the data model from plain strings into objects with both text and state.",
					projectLink:
						"https://codepen.io/junilearning/pen/ab6bf77b9d85e1b9a7452d5a307b6b7f",
					solutionLink:
						"https://codepen.io/junilearning/pen/bc74a6591ecf2d986cd8fd83eb46e427"
				},
				{
					title: "NoSQL and CRUD supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM12 NoSQL and CRUD",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-19-jsm12-nosql-and-crud-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-19-jsm12-nosql-and-crud-supplemental-2/solution"
				},
				{
					title: "NoSQL and CRUD supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM12 NoSQL and CRUD",
						projectKind: "extension",
						hasReference: true
					}),
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
						"Build a message board that stores posts as JSON objects with at least a title, URL, and image URL. The form should create a new post, save it to the remote data store, clear or reset the inputs, and render the newest posts in a readable order above the form. Verify the board by adding multiple posts and refreshing to confirm that the saved posts return.",
					projectLink:
						"https://codepen.io/junilearning/pen/6c0b3c5a207fc24b58c44a5f481922e3",
					solutionLink: "https://codepen.io/junilearning/pen/GRPwwOg"
				},
				{
					title: "Message Board: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Message Board",
						section: "debugging"
					})
				},
				{
					title: "Message Board: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Message Board",
						section: "planning"
					})
				},
				{
					title: "Message Board: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Message Board",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JSM13 Supplemental Project 1: Adding Comments",
					content:
						"Add comments as nested data under each message-board post. Each rendered post should show its existing comments, provide an input for a new comment, update only the intended post, and persist the changed board back to the data store. Test with at least two posts so comments do not accidentally attach to the wrong item.",
					projectLink:
						"https://codepen.io/junilearning/pen/f40d31ed70aef27cee691e91d947ef14",
					solutionLink:
						"https://codepen.io/junilearning/pen/c3fb5542e72c66ad7264b94a8be3c4c0"
				},
				{
					title: "Message Board supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM13 Message Board",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-21-jsm13-message-board-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-21-jsm13-message-board-supplemental-2/solution"
				},
				{
					title: "Message Board supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM13 Message Board",
						projectKind: "extension",
						hasReference: true
					}),
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
						"Build a state capitals quiz using canvas to color states based on answers; fetch state data from provided JSONBin and manage game states.",
					projectLink:
						"https://codepen.io/junilearning/pen/f8ec7312634d2011e58c44d691d1da13",
					solutionLink:
						"https://codepen.io/junilearning/pen/540c4d060641bb749cefde340d69acd6",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_us_capitals_quiz.gif"
				},
				{
					title: "Quiz Game: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Quiz Game",
						section: "debugging"
					})
				},
				{
					title: "Quiz Game: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Quiz Game",
						section: "planning"
					})
				},
				{
					title: "Quiz Game: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Quiz Game",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Quiz Game: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "Quiz Game",
						section: "extension"
					}),
					projectLink:
						"https://codepen.io/junilearning/pen/f8ec7312634d2011e58c44d691d1da13",
					solutionLink:
						"https://codepen.io/junilearning/pen/540c4d060641bb749cefde340d69acd6"
				},
				{
					title: "Quiz Game supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM14 Quiz Game",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-23-jsm14-quiz-game-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-23-jsm14-quiz-game-supplemental-2/solution"
				},
				{
					title: "Quiz Game supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM14 Quiz Game",
						projectKind: "extension",
						hasReference: true
					}),
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
						"Plan and build a web app or game (example chatroom). Scope to about two weeks, pseudocode stages, and complete an independent implementation pass with checkpoints."
				},
				{
					title: "Handoff to Web Development Foundations",
					content:
						"`Web Development Foundations` should be the default follow-on course after JavaScript Level 2. Be reasonably comfortable with functions, conditionals, arrays, objects, events, APIs, and basic data modeling before starting it. The goal of that next course is not to reteach core syntax, but to move into file-based local projects, Git and GitHub, npm, dev servers, back-end basics, databases, and deployment. If the `JSM10` through `JSM13` range still feels shaky, review those units before making the jump."
				},
				{
					title: "Course Recap",
					content:
						"Review the main JavaScript Level 2 skills: helper functions, events, canvas drawing, collision logic, arrays, objects, API requests, SQL and NoSQL data models, CRUD flows, and full project planning. Choose one project that best demonstrates interactive browser logic and one project that best demonstrates data flow or persistence."
				},
				{
					title: "JSM15 Master Project: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "JSM15 Master Project",
						section: "verification"
					})
				},
				{
					title: "JSM15 Master Project: Core Project",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM15 Master Project",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/solution"
				}
			],
			supplementalProjects: [
				{
					title: "JSM15 Master Project: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "JavaScript",
						moduleTitle: "JSM15 Master Project",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-01-jsm15-master-project/solution"
				},
				{
					title: "Master Project supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM15 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-25-jsm15-master-project-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-25-jsm15-master-project-supplemental-2/solution"
				},
				{
					title: "Master Project supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "web development",
						moduleTitle: "JSM15 Master Project",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-26-jsm15-master-project-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/JSM-26-jsm15-master-project-supplemental-3/solution"
				}
			]
		}
	]
};
