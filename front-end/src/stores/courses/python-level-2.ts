import type { RawCourse } from "./types";
import {
	staticMediaFilename,
	withPendingStaticMediaNotice
} from "./staticMedia";

function conceptBrief({
	evidence,
	focus,
	practice
}: {
	evidence: string;
	focus: string;
	practice: string[];
}) {
	return [
		`**Focus:** ${focus}`,
		`**Practice:**\n${practice.map((item, index) => `${index + 1}. ${item}`).join("\n")}`,
		`**Evidence:** ${evidence}`,
		`**Concept check:** The explanation is complete when the main idea is connected to a runnable example, one edge or awkward case, and the exact Python syntax or data structure that makes the result work.`
	].join("\n\n");
}

function stripFinalPunctuation(text: string) {
	return text.trim().replace(/[.!?]+$/u, "");
}

function lowerFirst(text: string) {
	const trimmed = stripFinalPunctuation(text);
	return trimmed ? trimmed.charAt(0).toLowerCase() + trimmed.slice(1) : "";
}

function joinReadable(items: string[]) {
	if (items.length <= 1) return items[0] ?? "";
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function defaultProjectOutcome(checkpoints: string[]) {
	const checkpointSummary = joinReadable(
		checkpoints.slice(0, 2).map(lowerFirst)
	);
	const evidenceTarget =
		checkpointSummary ||
		"the result matches the stated goal and the code path can be traced";

	return `The finished project is complete when ${evidenceTarget}, and the result can be explained from Python input or setup through state changes to final output.`;
}

function defaultProjectVerification(checkpoints: string[]) {
	const stressTarget = checkpoints.at(-1);
	const specificCheck = stressTarget
		? ` The stress case is tied to this project check: ${stripFinalPunctuation(stressTarget)}.`
		: "";

	return `Run one straightforward case and one stress case that changes an input, boundary value, repeated value, empty collection, or formatting assumption.${specificCheck} Keep the sample input and output evidence with the project notes.`;
}

function projectBrief({
	build,
	checkpoints,
	extension,
	goal,
	outcome
}: {
	build: string[];
	checkpoints: string[];
	extension?: string;
	goal: string;
	outcome?: string;
}) {
	return [
		`**Goal:** ${goal}`,
		`**Outcome:** ${outcome ?? defaultProjectOutcome(checkpoints)}`,
		`**Build path:**\n${build.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
		`**Checkpoints:**\n${checkpoints.map(checkpoint => `- ${checkpoint}`).join("\n")}`,
		`**Verification:** ${defaultProjectVerification(checkpoints)}`,
		extension ? `**Extension:** ${extension}` : ""
	]
		.filter(Boolean)
		.join("\n\n");
}

function reviewBrief({
	evidence,
	focus,
	tasks
}: {
	evidence: string;
	focus: string;
	tasks: string[];
}) {
	return [
		`**Focus:** ${focus}`,
		`**Tasks:**\n${tasks.map((task, index) => `${index + 1}. ${task}`).join("\n")}`,
		`**Evidence:** ${evidence}`
	].join("\n\n");
}

function applyPythonLevel2PendingMediaNotices(course: RawCourse) {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			if (!item.mediaLink) continue;

			const filename = staticMediaFilename(item.mediaLink);
			if (!filename) continue;

			item.content = withPendingStaticMediaNotice(item.content, filename);
		}
	}
}

export const pythonLevel2Course: RawCourse = {
	name: "Python Level 2",
	modules: [
		{
			title: "PS1 Variables, Strings, and Input",
			curriculum: [
				{
					title: "Introductions and Setup",
					content: conceptBrief({
						focus: "The first module establishes a reliable edit-run-debug loop before the projects depend on user input, strings, and numeric conversion.",
						practice: [
							'Run a tiny program such as `print("hello world")` and identify exactly where output appears.',
							"Open an existing project, create a blank reference file, and keep reusable examples separate from project submissions.",
							"Change one line, rerun the file, and confirm the output changed for the expected reason."
						],
						evidence:
							"The environment is ready when a small program can be edited, run, inspected in the console, and corrected after a simple typo without losing track of which file is being executed."
					})
				},
				{
					title: "Variables and Strings",
					content: conceptBrief({
						focus: "Variables give names to values so later code can reuse or transform them. Strings are ordered sequences of characters, so they support length checks, indexing, and combination with other strings.",
						practice: [
							"Store a name, word, or short phrase in a variable and print it more than once.",
							"Measure the string with `len()` and compare that length to the visible characters, including spaces.",
							"Retrieve the first character, a middle character, and the last character with indexes when the string is long enough."
						],
						evidence:
							"A complete explanation distinguishes the variable name from the value it stores and explains why string indexes begin at 0."
					})
				},
				{
					title: "Asking the User for Input",
					content: conceptBrief({
						focus: "`input()` collects text from the user. Programs that need math must convert that text with `int()` or `float()` before using arithmetic.",
						practice: [
							"Collect two or more responses and store each response in a clearly named variable.",
							"Build a sentence from user-provided strings while preserving spaces and punctuation.",
							"Convert a numeric response before adding, subtracting, multiplying, or rounding it."
						],
						evidence:
							"The program output proves which values are still strings and which values have been converted for numeric work."
					})
				},
				{
					title: "Comments",
					content: conceptBrief({
						focus: "Comments clarify intent for a reader and can temporarily remove a line from execution during debugging. They do not fix unclear variable names or replace testing.",
						practice: [
							"Add short comments above sections that collect input, transform values, or print final output.",
							"Comment out one experimental line, rerun the program, and observe which behavior disappeared.",
							"Remove comments that only repeat the exact code and keep comments that explain purpose or assumptions."
						],
						evidence:
							"Useful comments make the program easier to review without hiding what the code actually does."
					})
				},
				{
					title: "PS1 Project 1: Mad Libs",
					content: projectBrief({
						goal: "Create a Mad Libs program that gathers words from the user and inserts them into a complete story.",
						build: [
							"Ask for at least five pieces of text, such as a noun, adjective, verb, place, animal, or name.",
							"Store each answer in a clearly named variable.",
							"Print a story that combines fixed story text with the collected words.",
							"Run the story with different answers to confirm the variables control the final output."
						],
						checkpoints: [
							"The story includes every requested word.",
							"Spacing and punctuation are readable.",
							"The explanation can trace one input prompt through to the final printed sentence."
						],
						extension:
							"Add a title, multiple paragraphs, or a replay loop that creates a different story with new answers."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Mad-Libs/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_mad_libs.gif"
				},
				{
					title: "PS1 Project 2: Index Picker",
					content: projectBrief({
						goal: "Build a small string-indexing tool that reveals the character stored at a requested position.",
						build: [
							"Ask for a word or short phrase.",
							"Ask for an index and convert it to an integer.",
							"Print the original word and the character found at that index.",
							"Test the first index, a middle index, and the last valid index."
						],
						checkpoints: [
							"The index is converted before it is used.",
							"The program demonstrates that index 0 points to the first character.",
							"The output makes the selected character easy to identify."
						],
						extension:
							"Check whether the requested index is valid before indexing so the program can print a helpful message instead of crashing."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Index-Picker/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_index_picker.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PS1 Supplemental Project 1: Space Mountain",
					content: projectBrief({
						goal: "Track a roller coaster car's remaining safe capacity as riders board one at a time.",
						build: [
							"Define the starting capacity.",
							"Ask for four rider weights and convert each response to a number.",
							"Subtract each rider's weight from the remaining capacity.",
							"Print the remaining capacity after every rider boards."
						],
						checkpoints: [
							"Every rider changes the same running total.",
							"The printed values make the order of updates clear.",
							"The final output identifies whether capacity remains or has been exceeded."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Space-Mountain/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_space_mountain.gif"
				},
				{
					title: "PS1 Supplemental Project 2: Tip Calculator",
					content: projectBrief({
						goal: "Calculate a restaurant tip and compare whole-dollar rounding with cents-based rounding.",
						build: [
							"Ask for the bill total and tip percentage.",
							"Convert both inputs to numeric values.",
							"Calculate the tip and the total including tip.",
							"Print a whole-dollar estimate and a cents-accurate value."
						],
						checkpoints: [
							"Percent input is interpreted correctly.",
							"Money output includes clear labels.",
							"The explanation distinguishes rounding for readability from the exact calculated value."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Tip-Calculator/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_tip_calculator.gif"
				},
				{
					title: "PS1 Supplemental Project 3: Relay Race",
					content: projectBrief({
						goal: "Calculate total and average relay-race time from four split times.",
						build: [
							"Ask for four lap or runner split times.",
							"Convert the inputs to numbers.",
							"Add the times to find the team total.",
							"Divide by four to find the average split."
						],
						checkpoints: [
							"The total and average use numeric addition, not string concatenation.",
							"The output labels the units of time.",
							"The average changes correctly if one split time is changed."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Relay-Race/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_relay_race.gif"
				}
			]
		},
		{
			title: "PS2 For Loops and While Loops",
			curriculum: [
				{
					title: "For Loops",
					content: conceptBrief({
						focus: "`for i in range(...)` fits repetition with a known count or a predictable number sequence. The range start, stop, and step determine exactly which values appear.",
						practice: [
							"Print 0 through 9 and identify why the stop value is not included.",
							"Print every third number in a range by changing the step.",
							"Count backward with a negative step.",
							"Print perfect squares by using the loop variable in a calculation."
						],
						evidence:
							"A correct explanation predicts the first value, final printed value, number of iterations, and step direction before the loop runs."
					})
				},
				{
					title: "While Loops",
					content: conceptBrief({
						focus: "`while` loops fit repetition controlled by a changing condition. The loop must move toward a stopping state or it can run forever.",
						practice: [
							"Write a loop that counts upward until a limit is reached.",
							"Write a loop that keeps asking for input until a target answer appears.",
							"Compare a condition-based `while` loop with `while True` plus an explicit `break`."
						],
						evidence:
							"The loop design is solid when the condition, the update, and the stopping case can be explained separately."
					})
				},
				{
					title: "PS2 Project 1: Crazy Nametags",
					content: projectBrief({
						goal: "Print a name in several patterns to compare `for` loops, `while` loops, indexes, and stepping rules.",
						build: [
							"Ask for a name and store it as a string.",
							"Print the letters forward.",
							"Print every other character by controlling the index or range step.",
							"Print the name backward with a reverse loop."
						],
						checkpoints: [
							"At least one version uses a `for` loop.",
							"At least one version uses a `while` loop.",
							"The backward version starts at the last valid index rather than one past the end."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Crazy-Nametags/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_crazy_nametags.gif"
				},
				{
					title: "PS2 Project 2: Change Machine",
					content: projectBrief({
						goal: "Convert a number of cents into quarters, dimes, nickels, and pennies.",
						build: [
							"Ask for an amount in cents and convert it to an integer.",
							"Count how many quarters fit and update the remaining cents.",
							"Repeat the process for dimes, nickels, and pennies.",
							"Print the final coin breakdown."
						],
						checkpoints: [
							"The remaining-cent value decreases after each coin type.",
							"The breakdown adds back up to the original amount.",
							"Boundary cases such as 0, 4, 5, 10, 25, and 99 cents are tested."
						],
						extension:
							"Rebuild the solution with integer division and modulo, then compare that version with the loop-and-counter approach."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Change-Machine/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_change_machine.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS2 Supplemental Project 1: Interest Aggregator",
					content: projectBrief({
						goal: "Model compound growth over time and print a readable year-by-year projection.",
						build: [
							"Ask for a starting balance and interest rate.",
							"Convert the inputs to numeric values.",
							"Loop through 20 years of growth.",
							"Update the balance each year and print the year number with the projected balance."
						],
						checkpoints: [
							"The balance changes cumulatively rather than resetting each year.",
							"The interest rate is converted from a percent into a multiplier correctly.",
							"The output is rounded or formatted so the trend is readable."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Interest-Aggregator/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_interest_aggregator.gif"
				},
				{
					title: "PS2 Supplemental Project 2: Password Guesser",
					content: projectBrief({
						goal: "Build a guessing loop that continues until the user enters the target phrase.",
						build: [
							"Define a target password or phrase.",
							"Ask for guesses inside a loop.",
							"Track the number of attempts.",
							"Stop only when the guess matches the target exactly."
						],
						checkpoints: [
							"The loop has a clear stopping condition.",
							"The attempt count matches the number of guesses made.",
							"The output distinguishes a failed guess from the final successful guess."
						],
						extension:
							"Add case-insensitive comparison, a maximum attempt limit, or hints after repeated failed guesses."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Password-Guesser/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_password_guesser.gif"
				},
				{
					title: "PS2 Supplemental Project 3: For Loop Fun",
					content: projectBrief({
						goal: "Create structured number and shape patterns with nested loops.",
						build: [
							"Print a repeated row pattern first.",
							"Add an outer loop so the row repeats across multiple lines.",
							"Change the inner-loop range so the pattern grows, shrinks, or shifts by row.",
							"Compare the loop variables used for rows with the loop variables used for columns."
						],
						checkpoints: [
							"The output shape matches the intended row and column counts.",
							"The inner loop controls content inside a row.",
							"The outer loop controls how many rows appear."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-For-Loop-Fun/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_for_loop_fun.gif"
				},
				{
					title: "PS2 Supplemental Project 4: Calendar Machine",
					content: projectBrief({
						goal: "Convert a raw day count into larger calendar-style units.",
						outcome:
							"The final program explains how many whole years, months, weeks, and days fit into the original total, while keeping the leftover days consistent with the chosen unit assumptions.",
						build: [
							"Ask for a number of days and convert it to an integer.",
							"Compute complete years, remaining months, remaining weeks, and leftover days using a consistent approximation.",
							"Update the remaining day count after each unit.",
							"Print the result with clear labels."
						],
						checkpoints: [
							"The chosen year and month assumptions are stated.",
							"The remaining day count is updated in the correct order.",
							"The final units reconstruct the original day count under the chosen assumptions.",
							"Test zero days, a small number of days, and a value large enough to use every unit."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Calendar-Machine/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_calendar_machine.gif"
				},
				{
					title: "PS2 Supplemental Project 5: Double or Nothing",
					content: projectBrief({
						goal: "Simulate a simple risk-reward game driven by random coin flips and a stopping choice.",
						build: [
							"Begin with a fixed starting amount.",
							"Ask whether the player wants to risk the current amount.",
							"Flip a random coin when the player continues.",
							"Double the amount on a win, set it to zero on a loss, and stop when the player quits or loses."
						],
						checkpoints: [
							"The current amount is updated in only one place per round.",
							"The game stops cleanly after a loss or a quit choice.",
							"The output explains the result of each flip before the next decision."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Double-or-Nothing/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_double_or_nothing.gif"
				},
				{
					title: "PS2 Supplemental Project 6: Debugging Loops",
					content: projectBrief({
						goal: "Repair a loop-based rocket launch simulator by using console evidence instead of guessing.",
						build: [
							"Run the starter code and record the first error or incorrect behavior.",
							"Fix one issue at a time, then rerun the program.",
							"Inspect loop starts, stops, updates, and indentation.",
							"Continue until the launch countdown and post-launch behavior run completely."
						],
						checkpoints: [
							"Each fix is connected to a specific error or observed behavior.",
							"The loop no longer skips values, repeats forever, or stops too early.",
							"The final run demonstrates the complete launch sequence."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Debugging-Loops/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Debugging-Loops/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_debugging_loops.gif"
				},
				{
					title: "PS2 Supplemental Project 7: Multiplication Tables",
					content: projectBrief({
						goal: "Generate a complete multiplication table with nested loops.",
						build: [
							"Create one loop for the first factor.",
							"Create a nested loop for the second factor.",
							"Compute and print each product from 1 x 1 through 12 x 12.",
							"Format the output so row and column structure is visible."
						],
						checkpoints: [
							"All 144 facts appear exactly once.",
							"The row factor and column factor are not accidentally swapped in the label.",
							"The structure remains readable when the maximum factor changes."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Multiplication-Tables/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_multiplication_tables.gif"
				},
				{
					title: "PS2 Supplemental Project 8: Archery Simulator",
					content: projectBrief({
						goal: "Simulate an archery session with nested rounds, random outcomes, and a running score.",
						build: [
							"Loop through five rounds.",
							"Inside each round, simulate three shots.",
							"Generate a random outcome to determine whether each shot is a bullseye.",
							"Track round results and the total number of bullseyes."
						],
						checkpoints: [
							"The nested loops match the round and shot structure.",
							"The total score accumulates across all rounds.",
							"The output makes it possible to verify the total from the printed shot results."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Juni-Archery/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_juni_archery.gif"
				}
			]
		},
		{
			title: "PS3 ASCII and Ciphers",
			curriculum: [
				{
					title: "ASCII and Ciphers",
					content: conceptBrief({
						focus: "`ord()` converts a character into its numeric code, and `chr()` converts a numeric code back into a character. Ciphers use this relationship to transform messages in predictable ways.",
						practice: [
							"Convert several letters and symbols with `ord()` and compare the returned numbers.",
							"Convert numbers back into characters with `chr()`.",
							"Shift a letter by adding or subtracting from its numeric code.",
							"Discuss why wraparound is needed when a shift moves past `z` or before `a`."
						],
						evidence:
							"A correct cipher explanation names the original character, the numeric transformation, and the final decoded character."
					})
				},
				{
					title: "PS3 Project 1: Simple Cipher",
					content: projectBrief({
						goal: "Encode text by converting characters into numeric ASCII values and applying a simple numeric key.",
						build: [
							"Ask for a short message.",
							"Convert each character to its ASCII number.",
							"Print the plain ASCII sequence with clear spacing.",
							"Add a constant key to each value and print the shifted sequence."
						],
						checkpoints: [
							"Every input character produces one output number.",
							"Spaces between numbers make the encoded result readable.",
							"The key changes all numeric values consistently."
						],
						extension:
							"Add a decoder that subtracts the same key and reconstructs the original message."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Simple-Cipher/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_simple_cipher.gif"
				},
				{
					title: "PS3 Project 2: Caesar Cipher",
					content: projectBrief({
						goal: "Build a Caesar cipher that shifts letters through the alphabet and supports decoding with the reverse shift.",
						build: [
							"Ask for a message and shift amount.",
							"Convert each letter to a position in the alphabet.",
							"Apply the shift and wrap around when the result leaves the alphabet range.",
							"Convert the shifted positions back into letters."
						],
						checkpoints: [
							"`z` shifted forward and `a` shifted backward both wrap correctly.",
							"Encryption and decryption undo one another with the same key.",
							"Non-letter characters are either preserved or handled by a stated rule."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Caesar-Cipher/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_caesar_cipher.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS3 Supplemental Project 1: ASCII Art",
					content: projectBrief({
						goal: "Generate a square block of text art from a user-selected size.",
						build: [
							"Ask for the square size.",
							"Build each row with nested loops or string repetition.",
							"Print the requested number of rows.",
							"Test small, medium, and larger sizes."
						],
						checkpoints: [
							"The number of rows equals the number of columns.",
							"Size 1 still works.",
							"The pattern is produced by loop logic rather than manually written rows.",
							"The output remains aligned when the size changes from one digit to two digits if numbers are added later."
						],
						extension:
							"Add hollow squares, diagonal marks, or alternating characters so the row/column condition becomes more meaningful than printing the same repeated symbol every time."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-ASCII-Art/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_ascii_art.gif"
				},
				{
					title: "PS3 Supplemental Project 2: Uppercase to Lowercase",
					content: projectBrief({
						goal: "Convert uppercase letters to lowercase by using ASCII offsets directly.",
						build: [
							"Ask for an uppercase word.",
							"Convert each character with `ord()`.",
							"Add the uppercase-to-lowercase offset when the character is uppercase.",
							"Convert the result back with `chr()` and build the lowercase word."
						],
						checkpoints: [
							"The solution does not rely on `.lower()`.",
							"Each character transformation can be traced numerically.",
							"Already-lowercase or nonletter characters have a defined behavior."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Uppercase-to-Lowercase/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_uppercase_to_lowercase.gif"
				},
				{
					title: "PS3 Supplemental Project 3: Nested Boxes",
					content: projectBrief({
						goal: "Print nested or progressively larger box outlines using loop-controlled row and column logic.",
						build: [
							"Choose a maximum box size.",
							"Print one box outline correctly before adding more.",
							"Grow or nest the outlines with loops.",
							"Decide when a cell belongs to a border versus an empty interior."
						],
						checkpoints: [
							"Horizontal and vertical borders line up.",
							"Interior spaces remain empty where expected.",
							"The same logic works for more than one size."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Nested-Boxes/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_nested_boxes.gif"
				},
				{
					title: "PS3 Supplemental Project 4: Password Cracker",
					content: projectBrief({
						goal: "Try every Caesar-shift possibility and identify which decoded message looks most plausible.",
						build: [
							"Load or define an encoded sample phrase.",
							"Loop through all 26 possible shifts.",
							"Decode the phrase with each shift.",
							"Print the candidates so the readable one can be selected."
						],
						checkpoints: [
							"All 26 shift values are attempted.",
							"Wraparound works for every candidate.",
							"The final answer is supported by visible decoded output, not guessed."
						],
						extension:
							"Add a simple word-list score that ranks candidates by how many common English words they contain."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Password-Cracker/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_password_cracker.gif"
				}
			]
		},
		{
			title: "PS4 Conditionals",
			curriculum: [
				{
					title: "Conditionals",
					content: conceptBrief({
						focus: "Conditionals let a program choose different behavior based on boolean expressions. `if`, `elif`, and `else` form an ordered decision chain, while `and` and `or` combine multiple checks.",
						practice: [
							"Write a two-branch decision with `if` and `else`.",
							"Add `elif` cases and predict which branch runs first when more than one condition could be true.",
							"Combine comparisons with `and` and `or` for cases where two facts matter.",
							"Test boundary values that sit exactly on the cutoff between branches."
						],
						evidence:
							"A good conditional design explains the order of branches, the boundary cases, and why the final `else` handles everything left."
					})
				},
				{
					title: "PS4 Project 1: Rock, Paper, Scissors",
					content: projectBrief({
						goal: "Build a two-player Rock, Paper, Scissors game that determines ties, wins, losses, and invalid input.",
						build: [
							"Ask both players for a move.",
							"Normalize or validate the input.",
							"Check ties before win/loss cases.",
							"Decide the winner with a clear conditional structure."
						],
						checkpoints: [
							"All nine valid move combinations have a correct outcome.",
							"Invalid moves do not accidentally count as wins.",
							"The branch order is explainable without reading every line aloud."
						],
						extension:
							"Add replay, a computer opponent, score tracking, or an expanded version such as Rock, Paper, Scissors, Lizard, Spock."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Rock-Paper-Scissors/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_rock_paper_scissors.gif"
				},
				{
					title: "PS4 Project 2: FizzBuzz",
					content: projectBrief({
						goal: "Print the classic FizzBuzz sequence while handling overlapping divisibility rules correctly.",
						build: [
							"Loop through the numbers 1 through 50.",
							"Check whether the current number is divisible by both 3 and 5.",
							"Check the single-divisor cases for 3 and 5.",
							"Print the original number when none of the special cases apply."
						],
						checkpoints: [
							"Multiples of 15 print `FizzBuzz`, not only `Fizz` or only `Buzz`.",
							"The modulo operator is used intentionally.",
							"The branch order prevents the overlapping case from being swallowed by an earlier condition."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-FizzBuzz/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_fizzbuzz.gif"
				},
				{
					title: "PS4 Project 3: Credit Card Validator",
					content: projectBrief({
						goal: "Implement a simplified checksum validator for card-style number strings.",
						build: [
							"Read the card number as text so individual digits can be inspected.",
							"Move through the digits in the required order.",
							"Double every other digit according to the validation rule and adjust multi-digit results if needed.",
							"Sum the processed digits and check whether the total is a multiple of 10."
						],
						checkpoints: [
							"The program treats digits as characters until conversion is needed.",
							"The doubling pattern is consistent from the correct side of the number.",
							"Valid and invalid sample numbers produce different, explained outcomes."
						],
						extension:
							"Add length checks, digit-only validation, or issuer-style prefix checks as separate rules."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Credit-Card-Validator/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_credit_card_validator.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS4 Supplemental Project 1: Carnival Strength Tester",
					content: projectBrief({
						goal: "Classify a carnival strength-test result into a prize tier.",
						build: [
							"Ask for the measured height.",
							"Convert the response to a number.",
							"Compare the height against ordered prize thresholds.",
							"Print the matching prize tier."
						],
						checkpoints: [
							"Boundary heights land in the intended tier.",
							"The thresholds are checked in an order that avoids unreachable branches.",
							"The output includes both the measured value and the result."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Carnival-Strength-Tester/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_carnival_strength_tester.gif"
				},
				{
					title: "PS4 Supplemental Project 2: Test Statistics",
					content: projectBrief({
						goal: "Compute a small set of summary statistics from five test scores.",
						build: [
							"Collect five numeric scores.",
							"Track or compute the highest score.",
							"Track or compute the lowest score.",
							"Calculate and print the average."
						],
						checkpoints: [
							"All inputs are converted before arithmetic.",
							"The average divides by the correct number of scores.",
							"Repeated high or low values still produce the correct result.",
							"Scores at 0, 100, and repeated middle values are tested so boundary and tie behavior is visible."
						],
						extension:
							"Add a letter-grade summary, a median, or a dropped-lowest-score version and explain how the summary changes."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Test-Statistics/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_test_statistics.gif"
				},
				{
					title: "PS4 Supplemental Project 3: Relay Race Statistics",
					content: projectBrief({
						goal: "Compare each relay split against the team average.",
						build: [
							"Collect four lap times.",
							"Compute the total and average.",
							"Compare each split to the average.",
							"Print whether each runner was faster than, slower than, or equal to the average pace."
						],
						checkpoints: [
							"The average is computed once from all four values.",
							"Each runner is compared against the same average.",
							"Equal-to-average cases are handled deliberately."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Relay-Race-Statistics/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_relay_race_statistics.gif"
				},
				{
					title: "PS4 Supplemental Project 4: Joe's Donuts Opening Day",
					content: projectBrief({
						goal: "Determine which donut-shop promotions apply to a customer number.",
						build: [
							"Ask for the customer's position in line.",
							"Represent each promotion rule as a conditional check.",
							"Handle overlapping promotions without losing any applicable reward.",
							"Print every promotion the customer receives."
						],
						checkpoints: [
							"Multiple promotions can apply to the same customer when the rules overlap.",
							"Universal promotions are not blocked by earlier branches.",
							"The solution distinguishes independent `if` statements from an exclusive `if`/`elif` chain."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Joes-Donuts-Opening-Day/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_joes_donuts.gif"
				},
				{
					title: "PS4 Supplemental Project 5: Number Guesser",
					content: projectBrief({
						goal: "Build a higher/lower number guessing game with a random target.",
						build: [
							"Generate a random target from 1 to 50.",
							"Ask for guesses in a loop.",
							"Print higher or lower feedback after each incorrect guess.",
							"Stop when the guess matches the target and report the attempt count."
						],
						checkpoints: [
							"The random target is chosen once per game, not once per guess.",
							"Guesses are converted before comparison.",
							"The feedback direction is correct for both too-low and too-high guesses."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Number-Guesser/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_number_guesser.gif"
				},
				{
					title: "PS4 Supplemental Project 6: Debugging Conditionals",
					content: projectBrief({
						goal: "Debug a ticket-prize script by connecting each wrong result to the conditional rule that produced it.",
						build: [
							"Run the starter and note the first incorrect branch or error.",
							"Check comparison operators, branch order, and indentation.",
							"Fix one issue at a time and rerun after each change.",
							"Test values at the exact prize cutoffs."
						],
						checkpoints: [
							"Each ticket range maps to the intended prize.",
							"Boundary values do not fall through to the wrong branch.",
							"The final explanation names at least one conditional bug and why the fix worked."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Debugging-Conditionals/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Debugging-Conditionals/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_debugging_conditionals.gif"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content: reviewBrief({
						focus: "This checkpoint reviews variables, strings, input, loops, and conditionals without introducing a new large project.",
						tasks: [
							"Solve each prompt independently before comparing approaches.",
							"Record which prompts were immediate, which required a reminder, and which need more practice.",
							"Choose the most useful supplemental project based on any missed prompt."
						],
						evidence:
							"A useful checkpoint result identifies specific skills, not a vague sense of being ready or not ready."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS-Check-in-1/solution"
				},
				{
					title: "Check-In #1: Variables",
					content: reviewBrief({
						focus: "Variables, type conversion, string length, indexing, and formatted output.",
						tasks: [
							"Store several values with clear variable names and print them.",
							"Collect user input and convert numeric input only when arithmetic is required.",
							"Measure a string, access selected indexes, and combine strings with clean spacing."
						],
						evidence:
							"The work shows the difference between storing a value, printing a value, and transforming a value."
					})
				},
				{
					title: "Check-In #1: Loops",
					content: reviewBrief({
						focus: "`for` loops, `while` loops, range parameters, string iteration, and stop conditions.",
						tasks: [
							"Print number sequences with different starts, stops, and steps.",
							"Iterate through a string by character.",
							"Rewrite one fixed-count loop as a condition-controlled `while` loop."
						],
						evidence:
							"The explanation predicts how many times the loop runs and why it stops."
					})
				},
				{
					title: "Check-In #1: Conditionals",
					content: reviewBrief({
						focus: "Branch order, combined conditions, nested conditionals, and boundary cases.",
						tasks: [
							"Check guesses against target values.",
							"Combine conditions with `and` and `or`.",
							"Rewrite one decision with a nested conditional and compare readability."
						],
						evidence:
							"The work identifies which branch runs for correct, partially correct, and incorrect inputs."
					})
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content: projectBrief({
						goal: "Create a letter shifter that changes characters according to a simple rule.",
						build: [
							"Ask for a word or short phrase.",
							"Choose a shifting rule based on word length or character index parity.",
							"Shift each alphabetic character forward or backward.",
							"Preserve or intentionally handle spaces and punctuation."
						],
						checkpoints: [
							"Alphabet wraparound is handled.",
							"The same rule is applied consistently across the whole input.",
							"The result can be explained by tracing at least two characters."
						]
					}),
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_caesar_cipher.gif"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PS5 Functions",
			curriculum: [
				{
					title: "Functions",
					content: conceptBrief({
						focus: "Functions package reusable behavior behind a name. Parameters bring information into the function, return values send information back out, and scope controls which names exist inside or outside the function.",
						practice: [
							"Compare built-in functions such as `input()`, `print()`, and `str()` with a user-defined helper.",
							"Write one function that prints a result and one function that returns a result.",
							"Trace how argument order affects parameter values.",
							"Call one helper from another helper to build a larger behavior from smaller pieces."
						],
						evidence:
							"A complete function explanation states the inputs, output, side effects, and where the result is used."
					})
				},
				{
					title: "PS5 Project 1: Functions Practice",
					content: projectBrief({
						goal: "Write a set of focused practice functions and explain each function's contract.",
						build: [
							"Create arithmetic helpers with parameters.",
							"Write an average helper that returns a computed result.",
							"Write factorial and exponent helpers that use loops.",
							"Call each function with several test inputs."
						],
						checkpoints: [
							"Each function has a clear name and one main responsibility.",
							"Returned values are used by the caller rather than ignored.",
							"Tests include ordinary values and at least one boundary case such as 0 or 1."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Functions-Practice/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_functions_practice.gif"
				},
				{
					title: "Parameter Tracing",
					content: reviewBrief({
						focus: "Parameter tracing connects a function call to the values received inside the function body.",
						tasks: [
							"Label each argument at the call site.",
							"Map each argument to its matching parameter by position.",
							"Trace local variables separately from variables outside the function.",
							"Predict the output before running the starter."
						],
						evidence:
							"The trace explains why changing argument order can change the result even when the same values are present."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Parameter-Tracing/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Parameter-Tracing/solution"
				},
				{
					title: "PS5 Project 2: Coin Flipper",
					content: projectBrief({
						goal: "Estimate heads/tails frequencies with a function and repeated simulation.",
						build: [
							"Write `flipCoin()` so it returns either heads or tails.",
							"Call the function many times inside a loop.",
							"Count how many times each result appears.",
							"Print totals and percentages."
						],
						checkpoints: [
							"The flip function returns a value instead of printing all results internally.",
							"The tally variables update once per flip.",
							"The observed percentages are compared to the expected 50/50 pattern without assuming every run will be exact."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Coin-Flipper/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_coin_flipper.gif"
				},
				{
					title: "PS5 Project 3: Dice Roller",
					content: projectBrief({
						goal: "Simulate two dice and analyze the distribution of possible sums.",
						build: [
							"Write or reuse a function that returns a random die roll.",
							"Roll two dice repeatedly and add their values.",
							"Track how often each sum appears.",
							"Print a summary that makes common and rare sums visible."
						],
						checkpoints: [
							"Sums range from 2 through 12.",
							"The frequency table updates the correct sum each roll.",
							"The explanation connects middle sums to more possible dice combinations."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Dice-Roller/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_dice_roller.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS5 Supplemental Project 1: Squawka Zilly Floog",
					content: projectBrief({
						goal: "Build a chain of math helpers where later functions reuse earlier functions.",
						build: [
							"Define a small group of simple arithmetic functions.",
							"Create larger functions that call the smaller helpers.",
							"Print intermediate and final results while testing.",
							"Clean the output once the function chain is correct."
						],
						checkpoints: [
							"Functions are reused rather than copied.",
							"Argument order is consistent across calls.",
							"The final expression can be traced through the helper calls."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Squawka-Zilly-Floog/solution"
				},
				{
					title: "PS5 Supplemental Project 2: Word Translator",
					content: projectBrief({
						goal: "Write a reusable word-translation function for a simplified Pig Latin-style rule.",
						build: [
							"Ask for a word.",
							"Define a function that receives one word as a parameter.",
							"Apply the translation rule by moving or adding characters.",
							"Return and print the translated word."
						],
						checkpoints: [
							"The translation logic lives inside a function.",
							"Short words and ordinary words have defined behavior.",
							"The original and translated words are both visible in the output."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Juni-Latin/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_juni_latin.gif"
				},
				{
					title: "PS5 Supplemental Project 3: Number Games",
					content: projectBrief({
						goal: "Create predicate helper functions that classify numbers and reuse them across ranges.",
						build: [
							"Write boolean helpers such as `isEven`, `isOdd`, `isMultiple7`, and `isPrime`.",
							"Test each helper with known true and false examples.",
							"Loop through a range of numbers.",
							"Print categories based on which helpers return `True`."
						],
						checkpoints: [
							"Each helper returns a boolean.",
							"Prime checking handles 0, 1, 2, and composite numbers correctly.",
							"The output proves the helper functions are being reused."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Number-Games/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_number_games.gif"
				},
				{
					title: "PS5 Supplemental Project 4: Debugging Functions",
					content: projectBrief({
						goal: "Repair a guessing-game script by tracing function definitions, calls, parameters, and returns.",
						build: [
							"Run the starter and record the first error or incorrect result.",
							"Check whether functions are defined before they are called.",
							"Verify parameter counts, argument order, and return values.",
							"Fix one issue at a time and rerun after each fix."
						],
						checkpoints: [
							"Every function call matches the function definition.",
							"Returned values are captured where needed.",
							"The final game flow works without hidden global-state assumptions."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Debugging-Functions/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Debugging-Functions/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_debugging_functions.gif"
				}
			]
		},
		{
			title: "PS6 Lists and Music",
			curriculum: [
				{
					title: "Lists",
					content: conceptBrief({
						focus: "Lists store ordered collections. They are useful when the number of values can grow, when positions matter, or when a program needs to process many related items with one loop.",
						practice: [
							"Create empty and pre-filled lists.",
							"Append values and remove values.",
							"Iterate directly through values and by index when positions matter.",
							"Check membership and print list contents in a readable way."
						],
						evidence:
							"A list-based solution is justified when it avoids many separate variables and allows the same logic to process every item."
					})
				},
				{
					title: "PS6 Project 1: Lists Practice",
					content: projectBrief({
						goal: "Generate and analyze several lists to practice list construction, iteration, and aggregation.",
						build: [
							"Create a list of descending numbers.",
							"Create a list of letters from a word.",
							"Generate lists of perfect squares and factorials.",
							"Write helper functions that compute properties such as sum, maximum, or length."
						],
						checkpoints: [
							"Generated lists have the expected number of items.",
							"Aggregation functions work for more than one list.",
							"The code distinguishes list construction from list analysis."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Lists-Practice-1/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_lists_practice.gif"
				},
				{
					title: "PS6 Project 2: Build a Song",
					content: projectBrief({
						goal: "Represent a melody as list data and generate a playable audio file.",
						build: [
							"Represent notes and durations in the structure expected by `pysynth`.",
							"Create a short melody manually.",
							"Generate a `.wav` file from the list.",
							"Change note order or duration values and compare the result."
						],
						checkpoints: [
							"The music data is stored as structured list values.",
							"The generated file reflects changes to the list.",
							"The explanation connects list order to the order of notes played."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Build-a-Song/solution"
				},
				{
					title: "PS6 Project 3: Song Generator",
					content: projectBrief({
						goal: "Generate a song from user-provided note data stored in a list structure.",
						build: [
							"Ask for notes and, if supported, note durations.",
							"Validate or normalize the input values.",
							"Append each note entry to the song list.",
							"Generate an audio file from the completed sequence."
						],
						checkpoints: [
							"The list grows as the user adds notes.",
							"Invalid note or duration choices have a defined behavior.",
							"The resulting audio matches the order of the stored entries."
						],
						extension:
							"Add a menu that lets the user preview, delete, or replace a note before generating the final file."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Song-Generator/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Song-Generator/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_song_generator.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS6 Supplemental Project 1: Tower of Terror",
					content: projectBrief({
						goal: "Store rider weights in a list and compute ride-summary values.",
						build: [
							"Collect each rider weight and append it to a list.",
							"Print the full weight list.",
							"Compute total weight.",
							"Compute average weight."
						],
						checkpoints: [
							"The number of list entries matches the number of riders entered.",
							"The total and average use the list data rather than separate repeated variables.",
							"Empty or invalid input behavior is considered before division."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Tower-of-Terror/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_tower_of_terror.gif"
				},
				{
					title: "PS6 Supplemental Project 2: Basketball Stars",
					content: projectBrief({
						goal: "Store player statistics in nested lists and detect triple-double performances.",
						build: [
							"Represent each player's points, rebounds, and assists together.",
							"Store all players in a larger list.",
							"Loop through players and inspect each stat category.",
							"Print which players meet the triple-double threshold."
						],
						checkpoints: [
							"Nested indexing retrieves the intended stat.",
							"All three categories must meet the threshold.",
							"The output identifies both the player and the stats that qualified."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Basketball-Stars/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_basketball_stars.gif"
				},
				{
					title: "PS6 Supplemental Project 3: Stock Trader",
					content: projectBrief({
						goal: "Analyze stock trade histories stored in starter lists.",
						build: [
							"Inspect the structure of the starter trade-history lists.",
							"Retrieve the most recent price for each company.",
							"Compute average trade price from each history.",
							"Print a clear summary for every company."
						],
						checkpoints: [
							"Indexing retrieves the intended recent trade.",
							"The average divides by the number of trades in that company's list.",
							"The output remains correct if trade-history lengths differ."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Stock-Trader/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Stock-Trader/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_stock_trader.gif"
				},
				{
					title: "PS6 Supplemental Project 4: Dog Breeds",
					content: projectBrief({
						goal: "Store dog breeds in a list and print derived information for each entry.",
						build: [
							"Create or collect a list of breed names.",
							"Loop through every breed.",
							"Print the breed name, first letter, and length.",
							"Format the output consistently."
						],
						checkpoints: [
							"The same loop handles every breed.",
							"Indexing is safe for the provided breed names.",
							"The printed summary is readable for names with spaces.",
							"Empty strings or accidentally blank entries have a defined behavior before first-letter indexing occurs."
						],
						extension:
							"Add sorting, filtering by first letter, or a count of long breed names to turn the list into a small searchable catalog."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Dog-Breeds/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_dog_breeds.gif"
				},
				{
					title: "PS6 Supplemental Project 5: Card Shuffler",
					content: projectBrief({
						goal: "Represent a deck as a list and shuffle it through repeated random swaps.",
						build: [
							"Generate an ordered deck representation.",
							"Pick two random indexes.",
							"Swap the values at those positions.",
							"Repeat the swap process many times and print the resulting deck."
						],
						checkpoints: [
							"The deck keeps the same number of cards after shuffling.",
							"No card values are lost or duplicated by the swap operation.",
							"Different numbers of swaps visibly change how mixed the deck appears."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Card-Shuffler/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_card_shuffler.mp4"
				},
				{
					title: "PS6 Supplemental Project 6: Debugging Lists",
					content: projectBrief({
						goal: "Debug an ice-cream survey program by tracing list operations and indexes.",
						build: [
							"Run the starter and record the first error or wrong survey result.",
							"Check list creation, appending, indexing, and removal operations.",
							"Fix one list issue at a time.",
							"Rerun with several survey inputs to confirm the final behavior."
						],
						checkpoints: [
							"Indexes stay within list bounds.",
							"Items are added and removed from the intended list.",
							"The final survey summary matches the entered responses."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Debugging-Lists/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Debugging-Lists/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_debugging_lists.gif"
				}
			]
		},
		{
			title: "PS7 Dictionaries",
			curriculum: [
				{
					title: "Dictionaries",
					content: conceptBrief({
						focus: "Dictionaries map keys to values. They are usually clearer than parallel lists when one value is looked up by name, code, category, or identifier.",
						practice: [
							"Create a dictionary with several key-value pairs.",
							"Look up values by key and handle missing keys deliberately.",
							"Add and update entries.",
							"Iterate through keys, values, or key-value pairs depending on the task."
						],
						evidence:
							"A dictionary design is justified when the key explains how the program finds the value."
					})
				},
				{
					title: "PS7 Project 1: Dictionaries Practice",
					content: projectBrief({
						goal: "Practice dictionary construction through vocabulary, computed values, and frequency counts.",
						build: [
							"Create a word-definition dictionary.",
							"Generate dictionaries of squares and factorials.",
							"Count letter frequencies in a word or phrase.",
							"Print entries in a readable format."
						],
						checkpoints: [
							"Keys and values are chosen intentionally for each dictionary.",
							"Frequency counts update existing entries instead of replacing the whole dictionary.",
							"The same lookup pattern works across multiple dictionary examples."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Dictionaries-Practice/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_dictionaries_practice.gif"
				},
				{
					title: "PS7 Project 2: Song Generator 2",
					content: projectBrief({
						goal: "Upgrade the song generator by translating human-readable duration names through a dictionary.",
						build: [
							"Create a duration dictionary for names such as whole, half, quarter, and eighth.",
							"Ask the user for notes and duration names.",
							"Look up each duration value before storing the note entry.",
							"Generate the final song from the translated note data."
						],
						checkpoints: [
							"Duration names are not hard-coded in several unrelated conditionals.",
							"Invalid duration names are handled clearly.",
							"The dictionary boundary makes the music data easier to read and revise."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Song-Generator-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Song-Generator-2/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_song_generator_2.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS7 Supplemental Project 1: Birthday Converter",
					content: projectBrief({
						goal: "Convert numeric birthday text into a written date.",
						build: [
							"Parse a birthday written as `mm/dd/yyyy`.",
							"Convert the month number into a month name with a dictionary.",
							"Choose the day suffix with rules or a dictionary.",
							"Handle special suffix cases such as 11th, 12th, and 13th."
						],
						checkpoints: [
							"The date parts are split and converted safely.",
							"Month lookup uses dictionary data.",
							"Suffix rules handle ordinary and special-case days."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Birthday-Converter/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Birthday-Converter/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_birthday_converter.gif"
				},
				{
					title: "PS7 Supplemental Project 2: Test Scores",
					content: projectBrief({
						goal: "Store multiple test scores per person and compute average scores.",
						build: [
							"Create a dictionary where each key is a person and each value is a list of scores.",
							"Loop through the dictionary entries.",
							"Compute each person's average.",
							"Store or print the average results."
						],
						checkpoints: [
							"The values are lists, not a single overwritten score.",
							"Each average divides by that person's score count.",
							"The output identifies which average belongs to which person."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Test-Scores/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_test_scores.gif"
				},
				{
					title: "PS7 Supplemental Project 3: Coffee Shop",
					content: projectBrief({
						goal: "Replace parallel menu lists with a dictionary and print a readable menu.",
						build: [
							"Inspect the starter item and price lists.",
							"Create a dictionary where item names map to prices.",
							"Loop through the dictionary to print the menu.",
							"Format prices consistently."
						],
						checkpoints: [
							"Each item maps to the correct price.",
							"The dictionary removes the need to keep two list indexes synchronized manually.",
							"The formatted menu remains readable if another item is added."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Coffee-Shop/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Coffee-Shop/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_coffee_shop.gif"
				},
				{
					title: "PS7 Supplemental Project 4: Dictionary Indexing",
					content: projectBrief({
						goal: "Trace nested data structures and extract target values from dictionaries, lists, and tuples.",
						build: [
							"Inspect the outer data structure before writing code.",
							"Identify whether each step requires a key, list index, or tuple index.",
							"Extract the target words in order.",
							"Print the required sequence."
						],
						checkpoints: [
							"Each indexing step matches the structure at that level.",
							"The code does not rely on trial-and-error guessing.",
							"The final output is supported by a trace of how each word was reached."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Dictionary-Indexing/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Dictionary-Indexing/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_dictionary_indexing.gif"
				},
				{
					title: "PS7 Supplemental Project 5: Debugging Dictionaries",
					content: projectBrief({
						goal: "Repair a candy counter by tracing dictionary keys, updates, and lookup behavior.",
						build: [
							"Run the starter and record the first dictionary-related error or wrong count.",
							"Check key spelling, missing keys, and update logic.",
							"Fix one issue at a time.",
							"Verify the final candy counts with a known input sequence."
						],
						checkpoints: [
							"Counts increment instead of replacing unrelated entries.",
							"Missing-key behavior is handled deliberately.",
							"The final dictionary matches the expected candy totals."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Debugging-Dictionaries/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Debugging-Dictionaries/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_debugging_dictionaries.gif"
				}
			]
		},
		{
			title: "PS8 Ciphers and Music",
			curriculum: [
				{
					title: "PS8 Project 1: Morse Code",
					content: projectBrief({
						goal: "Translate text into Morse code and then represent the dots and dashes as musical durations.",
						build: [
							"Create or inspect a dictionary that maps letters to Morse code.",
							"Translate each input character into dots and dashes.",
							"Map dots and dashes to short and long note durations.",
							"Generate or print the encoded result in a way that preserves letter boundaries."
						],
						checkpoints: [
							"Unsupported characters have a defined behavior.",
							"The translation preserves spaces or word boundaries clearly.",
							"The dictionary makes the code easier to extend than a long conditional chain."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS8-Morse-Code/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS8-Morse-Code/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps8_morse_code.gif"
				}
			],
			supplementalProjects: []
		},
		{
			title: "PS9 Sets",
			curriculum: [
				{
					title: "Sets",
					content: conceptBrief({
						focus: "Sets store unique values without preserving a meaningful order. They are useful for membership tests, deduplication, and comparing groups.",
						practice: [
							"Create sets directly and from lists or strings.",
							"Add and remove values.",
							"Check membership with `in`.",
							"Compare two sets with union, intersection, and difference."
						],
						evidence:
							"A set-based solution is appropriate when uniqueness or group comparison matters more than order."
					})
				},
				{
					title: "PS9 Project 1: Sets Practice",
					content: projectBrief({
						goal: "Practice set creation, comparison, filtering, and deduplication.",
						build: [
							"Create random or fixed sets.",
							"Compare sets with union and intersection.",
							"Extract unique letters from words.",
							"Write helper functions that filter set values by conditions."
						],
						checkpoints: [
							"Duplicate values collapse to one set entry.",
							"Union and intersection results are explained correctly.",
							"Filtering returns a new meaningful set rather than mutating unexpectedly."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Sets-Practice/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_sets_practice.gif"
				},
				{
					title: "PS9 Project 2: Wheel of Fortune",
					content: projectBrief({
						goal: "Build a word-guessing game that uses sets to track target letters and guessed letters.",
						build: [
							"Choose or ask for a target word.",
							"Create one set for unique letters in the target word.",
							"Create another set for correctly guessed letters.",
							"Update the guessed set until every target letter has been found."
						],
						checkpoints: [
							"Repeated letters do not require repeated guesses.",
							"Wrong guesses do not pollute the correct-letter set.",
							"The win condition compares sets rather than a fragile string pattern."
						],
						extension:
							"Add replay, random word selection, wrong-guess tracking, or a displayed puzzle board."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Wheel-of-Fortune/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_9_wheel_of_fortune.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PS9 Supplemental Project 1: Class Registration",
					content: projectBrief({
						goal: "Clean class rosters by removing duplicates and reporting real enrollment counts.",
						build: [
							"Load or create course rosters with repeated names.",
							"Convert each roster to a set to remove duplicates.",
							"Compute the actual enrollment count.",
							"Print the cleaned roster and count for each course."
						],
						checkpoints: [
							"Duplicates are removed without manual special cases.",
							"The count comes from the cleaned set.",
							"The result explains what information was lost when order and duplicates were removed."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Class-Registration/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Class-Registration/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_class_registration.gif"
				},
				{
					title: "PS9 Supplemental Project 2: Class Registration II",
					content: projectBrief({
						goal: "Apply enrollment caps after roster deduplication and identify waitlisted students.",
						build: [
							"Clean duplicate registrations.",
							"Apply each class capacity limit.",
							"Separate enrolled students from waitlisted students.",
							"Print both groups clearly."
						],
						checkpoints: [
							"Capacity is enforced after duplicates are removed.",
							"Waitlisted students are not also counted as enrolled.",
							"The output handles full, under-filled, and exactly-full classes."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Class-Registration-II/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Class-Registration-II/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_class_registration_ii.gif"
				},
				{
					title: "PS9 Supplemental Project 3: Favorite Foods",
					content: projectBrief({
						goal: "Compare two people or groups by shared and unique favorite foods.",
						build: [
							"Create two sets of favorite foods.",
							"Compute the shared favorites with intersection.",
							"Compute foods unique to each set with difference.",
							"Print each comparison category."
						],
						checkpoints: [
							"Shared values appear only in the shared category.",
							"Unique values are reported for the correct person or group.",
							"The explanation names which set operation produced each result."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Favorite-Foods/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_favorite_foods.gif"
				},
				{
					title: "PS9 Supplemental Project 4: Soccer Nationalities",
					content: projectBrief({
						goal: "Combine dictionary lookup with set deduplication to summarize team nationalities.",
						build: [
							"Represent player nationalities with a dictionary that maps player names to countries.",
							"Loop through the player entries.",
							"Add each nationality to a set.",
							"Print the unique countries and the total number represented."
						],
						checkpoints: [
							"Players from the same country count once in the unique set.",
							"The dictionary keeps player identity separate from nationality grouping.",
							"The output makes the distinction between players and countries clear."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Soccer-Nationalities/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Soccer-Nationalities/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_soccer_nationalities.gif"
				},
				{
					title: "PS9 Supplemental Project 5: Debugging Sets",
					content: projectBrief({
						goal: "Debug a capture-the-flag tracker by inspecting set operations and state after each change.",
						build: [
							"Run the starter and identify the first incorrect set state.",
							"Check add, remove, membership, union, and intersection logic.",
							"Fix one problem at a time.",
							"Print or inspect set contents after each important step."
						],
						checkpoints: [
							"Set operations match the intended game rule.",
							"Duplicate entries do not create fake progress.",
							"The final tracker state matches the expected captured flags."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Debugging-Sets/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Debugging-Sets/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_debugging_sets.gif"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content: reviewBrief({
						focus: "This checkpoint revisits functions, lists, dictionaries, and sets with emphasis on choosing the right tool for the data.",
						tasks: [
							"Solve the prompts without changing the data structure just to make the code easier temporarily.",
							"Explain why a function, list, dictionary, or set is appropriate for each prompt.",
							"Record any prompt where the data model was unclear before the syntax."
						],
						evidence:
							"Readiness is demonstrated by matching data structures to the task and explaining the tradeoff."
					})
				},
				{
					title: "Check-In #2: Functions",
					content: reviewBrief({
						focus: "Function definitions, calls, parameters, return values, imports, and small simulations.",
						tasks: [
							"Define and call helper functions with clear parameters.",
							"Return values that are used by later code.",
							"Include `random` in a controlled simulation such as a lottery or game."
						],
						evidence:
							"The solution identifies what each function receives, returns, and changes."
					})
				},
				{
					title: "Check-In #2: Lists",
					content: reviewBrief({
						focus: "List construction, mutation, iteration, formatting, and generated numeric sequences.",
						tasks: [
							"Build lists from scratch and from loops.",
							"Add, remove, and inspect elements.",
							"Generate number lists such as ranges, even values, or calculated values."
						],
						evidence:
							"The list is used to simplify repeated work rather than to hide several unrelated variables."
					})
				},
				{
					title: "Check-In #2: Dictionaries",
					content: reviewBrief({
						focus: "Key-value modeling, lookup behavior, dictionary updates, iteration, and generated dictionaries.",
						tasks: [
							"Create dictionaries manually and from computed values.",
							"Look up, add, and update entries.",
							"Iterate through keys and values while preserving what each key means."
						],
						evidence:
							"The solution explains why each key is stable enough to retrieve the matching value."
					})
				},
				{
					title: "Check-In #2: Sets",
					content: reviewBrief({
						focus: "Uniqueness, membership tests, intersections, unions, and deduplication.",
						tasks: [
							"Create sets from text, lists, or explicit values.",
							"Compare sets with union and intersection.",
							"Remove duplicates with sets and explain what information is lost."
						],
						evidence:
							"The answer distinguishes unique membership from ordered sequence data."
					})
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content: projectBrief({
						goal: "Analyze user-provided text by comparing total items with unique items.",
						build: [
							"Ask for a word, sentence, or short paragraph.",
							"Split or iterate through the text according to whether letters or words are being analyzed.",
							"Create a set of unique items.",
							"Compare the total count with the unique count."
						],
						checkpoints: [
							"The item definition is clear: letter, word, or other token.",
							"Case and punctuation behavior are defined.",
							"The final comparison explains what the set removed."
						]
					})
				}
			],
			supplementalProjects: []
		},
		{
			title: "PS10 To-Do List",
			curriculum: [
				{
					title: "PS10 Project 1: To-Do List",
					content: projectBrief({
						goal: "Build an interactive to-do list with menu-driven list operations.",
						build: [
							"Store tasks in a list.",
							"Provide menu options to add a task, remove a task, display the list, and quit.",
							"Number the displayed tasks so removal is understandable.",
							"Validate removal choices before mutating the list."
						],
						checkpoints: [
							"The program loop keeps running until the user chooses to quit.",
							"Adding and removing tasks updates the same list.",
							"Invalid menu choices or invalid removal indexes do not crash the program."
						],
						extension:
							"Add priority labels, completed-task status, saving/loading, or due-date sorting."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-Todo-List/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_todo_list.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS10 Supplemental Project 1: US Capitals Quiz",
					content: projectBrief({
						goal: "Run a state-capitals quiz with dictionary lookup and score tracking.",
						build: [
							"Represent state-capital pairs with a dictionary.",
							"Ask quiz questions in a loop.",
							"Compare the user's answer to the expected capital.",
							"Stop on an incorrect answer and print the final score."
						],
						checkpoints: [
							"The state prompt and capital answer come from the same dictionary entry.",
							"The score increments only after correct answers.",
							"Case and spelling behavior are stated."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-US-Capitals-Quiz/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-US-Capitals-Quiz/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_us_capitals_quiz.gif"
				},
				{
					title: "PS10 Supplemental Project 2: Field Day",
					content: projectBrief({
						goal: "Assign classmates to event rosters and compare group membership.",
						build: [
							"Represent classmates and event choices with sets or lists.",
							"Assign students to kickball, capture the flag, both, or neither.",
							"Compute each final roster.",
							"Print the groups clearly."
						],
						checkpoints: [
							"Students in both events are represented accurately.",
							"Students in neither event are not accidentally dropped from the reasoning.",
							"The data structure choice matches whether order or uniqueness matters."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-Field-Day/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_field_day.gif"
				},
				{
					title: "PS10 Supplemental Project 3: Field Day II",
					content: projectBrief({
						goal: "Randomly divide a class into two teams while tracking unassigned players.",
						build: [
							"Store the full class roster.",
							"Randomly choose a student for Team Red or Team Blue.",
							"Remove assigned students from the unassigned group.",
							"Print team rosters and remaining players after each round."
						],
						checkpoints: [
							"No student appears on both teams.",
							"Every assigned student is removed from the unassigned group.",
							"The process ends with balanced or intentionally handled uneven teams."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-Field-Day-II/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_field_day_ii.gif"
				}
			]
		},
		{
			title: "PS11 Bank Account",
			curriculum: [
				{
					title: "PS11 Project 1: Bank Account",
					content: projectBrief({
						goal: "Create a console bank-account simulator with login, balances, and transaction actions.",
						build: [
							"Represent sample accounts with sample login names, access phrases, and balances.",
							"Validate a login before allowing account actions.",
							"Add menu options for deposits, withdrawals, balance display, and credential updates.",
							"Reject invalid withdrawals or malformed numeric input."
						],
						checkpoints: [
							"Authentication state is checked before account actions run.",
							"Balances update only after valid transactions.",
							"Account data is organized so credentials and balances stay connected to the correct user."
						],
						extension:
							"Add simple interest, transaction history, account lockout after repeated failures, or save/load behavior."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS11-Bank-Account/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps11_bank_account.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS11 Supplemental Project 1: Calculator",
					content: projectBrief({
						goal: "Build a calculator from small arithmetic helper functions.",
						build: [
							"Write helper functions for supported operations.",
							"Ask the user for two numbers and an operation.",
							"Call the matching helper based on the chosen operation.",
							"Print the result with the original expression."
						],
						checkpoints: [
							"Division by zero has a defined behavior.",
							"Each arithmetic operation lives in one helper.",
							"Invalid operation choices are handled separately from arithmetic errors."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS11-Calculator/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps11_calculator.gif"
				},
				{
					title: "PS11 Supplemental Project 2: Theme Park Planner",
					content: projectBrief({
						goal: "Plan a theme-park visit by tracking ride choices and remaining time.",
						build: [
							"Represent ride names and estimated durations in a dictionary.",
							"Begin with a six-hour time budget.",
							"Let the user choose rides from a menu.",
							"Subtract ride time and print the updated plan after each choice."
						],
						checkpoints: [
							"Ride durations come from the dictionary.",
							"The remaining time never silently goes negative.",
							"The final plan lists chosen rides and unused time."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS11-Juni-World/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS11-Juni-World/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps11_juni_world.gif"
				}
			]
		},
		{
			title: "PS12 Type Racer",
			curriculum: [
				{
					title: "Time Module",
					content: conceptBrief({
						focus: "The `time` module can pause execution and measure elapsed time. `time.sleep()` delays the program, while `time.time()` returns a timestamp that can be compared against another timestamp.",
						practice: [
							"Create a short countdown with `time.sleep()`.",
							"Record a start time and end time with `time.time()`.",
							"Subtract timestamps to calculate elapsed seconds.",
							"Discuss why elapsed time can vary slightly between runs."
						],
						evidence:
							"A timing program is correct when it measures a duration from two timestamps rather than hard-coding how long the user took."
					})
				},
				{
					title: "PS12 Project 1: Type Racer",
					content: projectBrief({
						goal: "Build a typing race that measures how long the user takes to type a target sentence.",
						build: [
							"Choose a random sentence from a list.",
							"Show a countdown before timing begins.",
							"Record the start time, collect the typed response, and record the end time.",
							"Accept only exact completion or report accuracy before calculating the final result."
						],
						checkpoints: [
							"Timing starts after the countdown and stops after the user submits text.",
							"The target and typed response are compared clearly.",
							"The final report includes elapsed time and, if included, accuracy."
						],
						extension:
							"Add multiplayer rounds, words-per-minute scoring, typo highlighting, or a high-score table."
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps12_type_racer.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PS12 Supplemental Project 1: Review Sentiment",
					content: projectBrief({
						goal: "Classify a review by comparing its words to positive and negative vocabularies.",
						build: [
							"Collect or load a short review.",
							"Split the review into words and normalize case or punctuation.",
							"Compare words against positive and negative word sets.",
							"Compute a score and print the resulting sentiment."
						],
						checkpoints: [
							"Text cleaning rules are stated.",
							"Positive and negative matches are counted separately.",
							"The result is described as a simple heuristic rather than perfect language understanding."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Review-Sentiment/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Review-Sentiment/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps12_review_sentiment.gif"
				},
				{
					title: "PS12 Supplemental Project 2: Evil Wheel of Fortune",
					content: projectBrief({
						goal: "Implement a harder word-guessing game that delays choosing a fixed secret word.",
						build: [
							"Load a list of possible words.",
							"Filter possible words after each guess.",
							"Choose a response pattern that keeps the largest useful word family.",
							"Continue until the game ends with a consistent remaining word."
						],
						checkpoints: [
							"The possible-word list only contains words consistent with previous answers.",
							"The computer's responses remain logically possible.",
							"The final word belongs to the remaining candidate set."
						],
						extension:
							"Display the candidate count after each guess or compare the strategy to a normal fixed-word version."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Evil-Wheel-of-Fortune/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Evil-Wheel-of-Fortune/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_12_evil_hangman.mp4"
				}
			]
		},
		{
			title: "PS13 Wordsmith",
			curriculum: [
				{
					title: "PS13 Project 1: Wordsmith",
					content: projectBrief({
						goal: "Build a timed word game from seven random letters and a valid-word list.",
						build: [
							"Choose or generate seven letters.",
							"Load the valid-word list.",
							"Accept guesses until the timer expires or the round ends.",
							"Reject repeated, impossible, or invalid words and score accepted words."
						],
						checkpoints: [
							"Guesses use only available letters.",
							"Repeated guesses do not score twice.",
							"The score rule is visible and testable."
						],
						extension:
							"Add guaranteed vowels, round replay, high scores, or difficulty levels based on word length."
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Wordsmith/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Wordsmith/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps13_wordsmith.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS13 Supplemental Project 1: Typewriter Monkeys",
					content: projectBrief({
						goal: "Simulate random typing until the newest three-letter sequence forms a valid word.",
						build: [
							"Load or define a set of valid three-letter words.",
							"Generate random letters one at a time.",
							"Track the most recent three-letter window.",
							"Stop when the window is a valid word and report the number of generated letters."
						],
						checkpoints: [
							"The rolling window updates correctly after each new letter.",
							"Membership checking uses the word set efficiently.",
							"The final output includes the found word and attempt count."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Typewriter-Monkeys/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Typewriter-Monkeys/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps13_typewriter_monkeys.gif"
				},
				{
					title: "PS13 Supplemental Project 2: Advanced Typewriter Monkeys",
					content: projectBrief({
						goal: "Generalize random typing to search for valid words of length `n` and observe how runtime changes.",
						build: [
							"Ask for or set a target word length.",
							"Load valid words of that length.",
							"Track a rolling window of length `n`.",
							"Measure attempts or elapsed time until a valid word appears."
						],
						checkpoints: [
							"The same logic works for more than one word length.",
							"The rolling window stays exactly length `n` after enough letters are generated.",
							"The runtime comparison explains why longer targets usually take more attempts."
						]
					}),
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Advanced-Typewriter-Monkeys/starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Advanced-Typewriter-Monkeys/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps13_advanced_typewriter_monkeys.gif"
				}
			]
		},
		{
			title: "PS14 Blackjack",
			curriculum: [
				{
					title: "PS14 Project 1: Simple Blackjack",
					content: projectBrief({
						goal: "Build a simplified Blackjack game with player choices, dealer rules, and round outcomes.",
						build: [
							"Represent card values from 2 through 11.",
							"Let the player hit or stay in a loop.",
							"Have the dealer draw until reaching at least 17.",
							"Compare final totals and report win, loss, bust, or tie."
						],
						checkpoints: [
							"Player and dealer totals update separately.",
							"Bust conditions stop or resolve the round correctly.",
							"Replay starts a fresh round rather than reusing stale totals."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS14-Simple-Blackjack/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps14_blackjack.gif"
				},
				{
					title: "PS14 Project 2: Advanced Blackjack",
					content: projectBrief({
						goal: "Extend Blackjack with richer card representation, face cards, aces, and hand-value helpers.",
						build: [
							"Represent card names separately from card values where needed.",
							"Add face-card output for Jack, Queen, and King.",
							"Handle aces as 1 or 11 depending on the hand.",
							"Write helper functions that compute the best valid hand value."
						],
						checkpoints: [
							"Ace handling prevents unnecessary busts when possible.",
							"Card display is readable to the player.",
							"Hand-value logic is reusable for both player and dealer."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS14-Advanced-Blackjack/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps14_advanced_blackjack.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS14 Supplemental Project 1: Game of War",
					content: projectBrief({
						goal: "Simulate a fixed number of War card-game rounds and track the winner count.",
						build: [
							"Loop through ten rounds.",
							"Generate a random card value for each player.",
							"Compare card values and print the round result.",
							"Track wins, losses, and ties."
						],
						checkpoints: [
							"Each round has independent random values.",
							"The score table updates after every round.",
							"The final summary matches the printed round outcomes."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS14-Game-of-War/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps14_game_of_war.gif"
				},
				{
					title: "PS14 Supplemental Project 2: Mastermind",
					content: projectBrief({
						goal: "Implement a Mastermind-style code-breaking game with feedback for exact and partial matches.",
						build: [
							"Generate or define a hidden four-digit code.",
							"Ask for guesses in a loop.",
							"Count exact matches in the correct position.",
							"Count close matches that use a correct digit in the wrong position without double-counting."
						],
						checkpoints: [
							"Guess length and digit validity are checked.",
							"Exact matches and close matches are reported separately.",
							"Repeated digits are handled by a clear rule."
						]
					}),
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS14-Mastermind/solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_14_mastermind.mp4"
				}
			]
		},
		{
			title: "PS15 Master Project",
			curriculum: [
				{
					title: "PS15 Project 1: Master Project",
					content: projectBrief({
						goal: "Design and build a larger console project that combines the main Python Level 2 skills.",
						build: [
							"Choose a project direction such as trivia, a virtual pet, a dice game, a text RPG, or another console application with meaningful state.",
							"Outline the main program loop, user actions, data structures, and helper functions before implementation.",
							"Build a small playable or usable version first.",
							"Add polish only after the core data and control flow are reliable."
						],
						checkpoints: [
							"The project uses at least three major course ideas such as functions, loops, lists, dictionaries, sets, random, or timing.",
							"The main loop, data model, and helper functions can be explained separately.",
							"The finished program handles ordinary input and at least one invalid or edge-case input."
						],
						extension:
							"Add save/load, scoring, levels, configuration, or replay if those features strengthen the core design instead of distracting from it."
					}),
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_15_master_project.mp4"
				},
				{
					title: "Master Project Presentation",
					content: reviewBrief({
						focus: "The presentation explains how the project works, why it was structured that way, and what tradeoffs were made.",
						tasks: [
							"Describe the user flow from program start to program end.",
							"Identify the most important variables, functions, and data structures.",
							"Show one bug or design decision that required revision.",
							"Run a short demo with an ordinary path and one edge case."
						],
						evidence:
							"A strong presentation connects code choices to behavior instead of only showing that the final program runs."
					})
				},
				{
					title: "Course Recap",
					content: reviewBrief({
						focus: "The recap connects the individual projects into a map of Python Level 2 skills and possible next directions.",
						tasks: [
							"Review variables, strings, input, loops, ASCII/ciphers, conditionals, functions, lists, dictionaries, sets, timing, and larger game structure.",
							"Identify which skills feel automatic and which still need deliberate practice.",
							"Compare next-course options such as Python Level 3, Java Level 1, Data Science in Python, PyGame, or JavaScript Level 1 based on goals."
						],
						evidence:
							"The next step follows from demonstrated strengths and gaps, not only from completing the last module."
					})
				}
			],
			supplementalProjects: []
		}
	]
};

applyPythonLevel2PendingMediaNotices(pythonLevel2Course);
