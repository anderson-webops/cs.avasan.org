import type { RawCourse } from "./types";

export const pythonLevel2Course: RawCourse = {
	name: "Python Level 2",
	modules: [
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this module as a low-pressure review of variables, loops, and conditionals. Work through the prompts independently first, then revisit any areas that need reinforcement.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS-Check-in-1"
				},
				{
					title: "Check-In #1: Variables",
					content:
						"Review variables and basic string operations by storing values, printing them, converting between data types, gathering user input, measuring string length, indexing into strings, and printing combined output with clear spacing."
				},
				{
					title: "Check-In #1: Loops",
					content:
						"Compare `for` loops and `while` loops, print number sequences with different ranges and steps, iterate through strings character by character, and use a `while True` loop with a stopping condition as an optional extension."
				},
				{
					title: "Check-In #1: Conditionals",
					content:
						"Review `if`, `elif`, and `else` by checking guesses against target values, combining conditions with `and` and `or`, and rewriting part of the solution using a nested conditional."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Create a letter shifter that moves characters forward or backward through the alphabet based on either the overall word length or the parity of each index.",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_caesar_cipher.gif"
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
						"Use this review module to revisit functions, lists, dictionaries, and sets. Focus on explaining why each data structure or function design is a good fit for the task."
				},
				{
					title: "Check-In #2: Functions",
					content:
						"Review the difference between defining and calling functions, returning values, importing `random`, and using functions to build small simulations such as a lottery game."
				},
				{
					title: "Check-In #2: Lists",
					content:
						"Practice building lists from scratch, adding and removing elements, printing formatted output, and generating lists of numbers such as ranges and even values."
				},
				{
					title: "Check-In #2: Dictionaries",
					content:
						"Review how dictionaries store key-value pairs, how to look up values, add entries, iterate through keys and values, and generate dictionaries from computed data."
				},
				{
					title: "Check-In #2: Sets",
					content:
						"Practice using sets for unique values, membership tests, intersections, unions, and deduplicating characters or words from input text."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Use sets to analyze unique letters or words in user-provided text and compare the number of unique items with the total number of items."
				}
			],
			supplementalProjects: []
		},
		{
			title: "PS1 Variables, Strings, and Input",
			curriculum: [
				{
					title: "Introductions and Setup",
					content:
						'Get familiar with the coding environment, including how to open projects, run code, view output in the console, and create a blank reference project for reusable examples. Start with `print("hello world")` and use it to review what printed output means.'
				},
				{
					title: "Variables and Strings",
					content:
						"Review variables as named places to store changing data such as strings and numbers. Practice creating a string variable, printing it, and using `len()` to measure its length."
				},
				{
					title: "Asking the User for Input",
					content:
						"Use `input()` to collect user responses and store them in variables. Then build output from those values with string concatenation, indexing, `str()`, and `int()` or `float()` when numeric conversions are needed."
				},
				{
					title: "Comments",
					content:
						"Add comments with `#` to explain code, document input being collected, and temporarily disable lines during testing."
				},
				{
					title: "PS1 Project 1: Mad Libs",
					content:
						"Create a Mad Libs program that asks for at least five words and prints a completed story using those values.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Mad-Libs",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_mad_libs.gif"
				},
				{
					title: "PS1 Project 2: Index Picker",
					content:
						"Ask the user for a word and an index, then print both the word and the character stored at that index.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Index-Picker",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_index_picker.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PS1 Supplemental Project 1: Space Mountain",
					content:
						"Track the remaining safe weight capacity on a roller coaster car by asking for four rider weights and printing how much capacity remains after each rider boards.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Space-Mountain",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_space_mountain.gif"
				},
				{
					title: "PS1 Supplemental Project 2: Tip Calculator",
					content:
						"Ask for a bill total and tip percentage, calculate the tip, and print both a rounded-dollar version and a version rounded to the nearest cent.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Tip-Calculator",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_tip_calculator.gif"
				},
				{
					title: "PS1 Supplemental Project 3: Relay Race",
					content:
						"Collect four relay split times, then print both the team's total time and the average lap time.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS1-Relay-Race",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps1_relay_race.gif"
				}
			]
		},
		{
			title: "PS2 For Loops and While Loops",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review variables, strings, and input, then retest any prior project code that still needs cleanup."
				},
				{
					title: "For Loops",
					content:
						"Use `for i in range(...)` to repeat actions a fixed number of times, start from different values, count backward, and step by larger increments. Practice sequences such as 0 to 9, every third number, reverse counting, and perfect squares."
				},
				{
					title: "While Loops",
					content:
						"Use `while` loops when repetition should continue until a condition changes. Compare standard condition-based loops with `while True` plus `break`."
				},
				{
					title: "PS2 Project 1: Crazy Nametags",
					content:
						"Ask for a name, then print its letters in several ways with both `for` loops and `while` loops: forward, every other character, and backward.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Crazy-Nametags",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_crazy_nametags.gif"
				},
				{
					title: "PS2 Project 2: Change Machine",
					content:
						"Ask for an amount of money in cents and compute quarters, dimes, nickels, and pennies using loops and counters.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Change-Machine",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_change_machine.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS2 Supplemental Project 1: Interest Aggregator",
					content:
						"Model compound growth over time by asking for a starting balance and printing projected balances across 20 years at a chosen interest rate.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Interest-Aggregator",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_interest_aggregator.gif"
				},
				{
					title: "PS2 Supplemental Project 2: Password Guesser",
					content:
						"Store a correct password in code and keep asking the user to guess until the answer is correct, then print how many guesses it took.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Password-Guesser",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_password_guesser.gif"
				},
				{
					title: "PS2 Supplemental Project 3: For Loop Fun",
					content:
						"Use nested loops to print number patterns, including repeated rows, shifting rows, and growing or shrinking triangle-style output.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-For-Loop-Fun",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_for_loop_fun.gif"
				},
				{
					title: "PS2 Supplemental Project 4: Calendar Machine",
					content:
						"Convert a number of days into years, months, weeks, and days.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Calendar-Machine",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_calendar_machine.gif"
				},
				{
					title: "PS2 Supplemental Project 5: Double or Nothing",
					content:
						"Simulate a betting game where the user starts with $10 and can keep risking all current winnings on a coin flip until choosing to stop or losing everything.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Double-or-Nothing",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_double_or_nothing.gif"
				},
				{
					title: "PS2 Supplemental Project 6: Debugging Loops",
					content:
						"Fix a loop-based rocket launch simulator by reading console errors, locating each bug, and correcting the loop logic until the program runs fully.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Debugging-Loops",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Debugging-Loops-Solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_debugging_loops.gif"
				},
				{
					title: "PS2 Supplemental Project 7: Multiplication Tables",
					content:
						"Use nested loops to print the multiplication facts from 1 x 1 through 12 x 12.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Multiplication-Tables",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_multiplication_tables.gif"
				},
				{
					title: "PS2 Supplemental Project 8: Juni Archery",
					content:
						"Simulate five rounds of archery with three shots per round, use randomness to determine hits and misses, and track the total number of bullseyes.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS2-Juni-Archery",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps2_juni_archery.gif"
				}
			]
		},
		{
			title: "PS3 ASCII and Ciphers",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review how `for` loops and `while` loops differ, and revisit any loop patterns that still need practice."
				},
				{
					title: "ASCII and Ciphers",
					content:
						"Use `ord()` and `chr()` to move between characters and their ASCII codes, then apply that knowledge to build simple encoders and decoders. Review how ciphers transform messages into coded text."
				},
				{
					title: "PS3 Project 1: Simple Cipher",
					content:
						"Translate a message into ASCII with spaces between values, then build a second version that adds a constant key to each ASCII code.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Simple-Cipher",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_simple_cipher.gif"
				},
				{
					title: "PS3 Project 2: Caesar Cipher",
					content:
						"Encrypt and decrypt text by shifting letters forward or backward through the alphabet by a chosen key, including wraparound behavior at both ends of the alphabet.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Caesar-Cipher",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_caesar_cipher.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS3 Supplemental Project 1: ASCII Art",
					content:
						"Ask for a number and print a square grid of `#` symbols with that dimension.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-ASCII-Art",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_ascii_art.gif"
				},
				{
					title: "PS3 Supplemental Project 2: Uppercase to Lowercase",
					content:
						"Convert an uppercase word to lowercase using ASCII math with `ord()` and `chr()` rather than calling `.lower()`.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Uppercase-to-Lowercase",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_uppercase_to_lowercase.gif"
				},
				{
					title: "PS3 Supplemental Project 3: Nested Boxes",
					content:
						"Print progressively larger box outlines using loops and concise pattern logic.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Nested-Boxes",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_nested_boxes.gif"
				},
				{
					title: "PS3 Supplemental Project 4: Password Cracker",
					content:
						"Reverse a secret string and try all 26 Caesar-shift possibilities to identify the most plausible original password.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS3-Password-Cracker",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps3_password_cracker.gif"
				}
			]
		},
		{
			title: "PS4 Conditionals",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review how ciphers encoded and decoded messages, then revisit `ord()` and `chr()` if needed."
				},
				{
					title: "Conditionals",
					content:
						"Use `if`, `elif`, and `else` to control program flow based on conditions, and combine checks with `and` and `or` when more than one condition matters."
				},
				{
					title: "PS4 Project 1: Rock, Paper, Scissors",
					content:
						"Build a two-player Rock, Paper, Scissors game and determine the winner with either a long conditional chain or nested conditionals. Optional extensions can add replay, CPU simulation, and invalid-input handling.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Rock-Paper-Scissors",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_rock_paper_scissors.gif"
				},
				{
					title: "PS4 Project 2: FizzBuzz",
					content:
						"Print numbers 1 through 50, replacing multiples of 3 with `Fizz`, multiples of 5 with `Buzz`, and multiples of both with `FizzBuzz`.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-FizzBuzz",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_fizzbuzz.gif"
				},
				{
					title: "PS4 Project 3: Credit Card Validator",
					content:
						"Validate a card number by summing digits with every other digit doubled and checking whether the total is a multiple of 10.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Credit-Card-Validator",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_credit_card_validator.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS4 Supplemental Project 1: Carnival Strength Tester",
					content:
						"Ask how high a puck flew and print a prize tier based on the measured height.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Carnival-Strength-Tester",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_carnival_strength_tester.gif"
				},
				{
					title: "PS4 Supplemental Project 2: Test Statistics",
					content:
						"Read five test scores and print the highest score, the lowest score, and the average.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Test-Statistics",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_test_statistics.gif"
				},
				{
					title: "PS4 Supplemental Project 3: Relay Race Statistics",
					content:
						"Collect four lap times, compute the average pace, and report whether each runner was faster than, slower than, or equal to the average.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Relay-Race-Statistics",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_relay_race_statistics.gif"
				},
				{
					title: "PS4 Supplemental Project 4: Joe's Donuts Opening Day",
					content:
						"Use a conditional chain to determine which promotions apply to a given customer number on opening day, including overlapping offers and a universal year-round deal.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Joes-Donuts-Opening-Day",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_joes_donuts.gif"
				},
				{
					title: "PS4 Supplemental Project 5: Number Guesser",
					content:
						"Build a number guessing game with a random target from 1 to 50 and give higher/lower feedback until the correct number is guessed.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Number-Guesser",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_number_guesser.gif"
				},
				{
					title: "PS4 Supplemental Project 6: Debugging Conditionals",
					content:
						"Fix a ticket-prize script by reading console output, identifying incorrect conditionals, and repairing the program until it behaves correctly.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Debugging-Conditionals",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS4-Debugging-Conditionals-Solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps4_debugging_conditionals.gif"
				}
			]
		},
		{
			title: "PS5 Functions",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review conditionals and identify places where branching logic was required in recent projects."
				},
				{
					title: "Functions",
					content:
						"Define functions as reusable blocks of code with a name, parameters, a body, and often a return value. Compare built-in functions such as `input()`, `print()`, and `str()` with user-defined functions."
				},
				{
					title: "PS5 Project 1: Functions Practice",
					content:
						"Write practice functions for arithmetic, averages, factorials, and exponents, and describe what each function takes in and returns.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Functions-Practice",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_functions_practice.gif"
				},
				{
					title: "Parameter Tracing",
					content:
						"Trace a provided program to reinforce the importance of parameter order, variable scope, and calling functions inside other functions.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Parameter-Tracing"
				},
				{
					title: "PS5 Project 2: Coin Flipper",
					content:
						"Build a `flipCoin()` function that returns heads or tails, call it many times, tally the outcomes, and compare the observed percentages with the expected distribution.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Coin-Flipper",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_coin_flipper.gif"
				},
				{
					title: "PS5 Project 3: Dice Roller",
					content:
						"Simulate rolling two dice repeatedly, track sums, and analyze why middle totals appear more often than edge totals.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Dice-Roller",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_dice_roller.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS5 Supplemental Project 1: Squawka Zilly Floog",
					content:
						"Define a small set of math functions that call one another to compute increasingly complex expressions.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Squawka-Zilly-Floog"
				},
				{
					title: "PS5 Supplemental Project 2: Juni Latin",
					content:
						"Write a translator function for a simplified Pig Latin variant and use it to translate a user-provided word.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Juni-Latin",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_juni_latin.gif"
				},
				{
					title: "PS5 Supplemental Project 3: Number Games",
					content:
						"Write helper functions such as `isEven`, `isOdd`, `isMultiple7`, and `isPrime`, then use them to print categorized ranges of numbers.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Number-Games",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_number_games.gif"
				},
				{
					title: "PS5 Supplemental Project 4: Debugging Functions",
					content:
						"Repair a guessing-game script by interpreting function-related error messages and fixing bugs one by one.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Debugging-Functions",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS5-Debugging-Functions-Solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps5_debugging_functions.gif"
				}
			]
		},
		{
			title: "PS6 Lists and Music",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review what functions are, why they are useful, and where recent projects used return values and helper functions."
				},
				{
					title: "Lists",
					content:
						"Use lists as ordered collections of values. Practice creating empty lists, iterating directly or by index, appending and removing items, printing full lists, and checking whether an item exists."
				},
				{
					title: "PS6 Project 1: Lists Practice",
					content:
						"Generate lists of descending numbers, letters from a word, perfect squares, and factorials, then write functions that compute aggregate properties such as the sum or maximum of a list.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Lists-Practice-1",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_lists_practice.gif"
				},
				{
					title: "PS6 Project 2: Build a Song",
					content:
						"Use the `pysynth` module to turn a list of note-duration pairs into a `.wav` file and experiment with changing melodies and rhythm values.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Build-a-Song"
				},
				{
					title: "PS6 Project 3: Song Generator",
					content:
						"Ask the user for notes and optionally durations, store them in a list structure, and generate a song file from the resulting sequence.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Song-Generator-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Song-Generator",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_song_generator.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS6 Supplemental Project 1: Tower of Terror",
					content:
						"Collect rider weights into a list, then print the list, the total weight, and the average weight.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Tower-of-Terror",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_tower_of_terror.gif"
				},
				{
					title: "PS6 Supplemental Project 2: Basketball Stars",
					content:
						"Use a list of sublists to store points, rebounds, and assists for several players and identify which players recorded a triple double.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Basketball-Stars",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_basketball_stars.gif"
				},
				{
					title: "PS6 Supplemental Project 3: Stock Trader",
					content:
						"Read stock trade histories from starter lists and print the most recent trade price and average trade price for each company.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Stock-Trader-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Stock-Trader",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_stock_trader.gif"
				},
				{
					title: "PS6 Supplemental Project 4: Dog Breeds",
					content:
						"Build a list of dog breeds and print formatted information about each breed, including its first letter and length.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Dog-Breeds",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_dog_breeds.gif"
				},
				{
					title: "PS6 Supplemental Project 5: Card Shuffler",
					content:
						"Generate an ordered deck representation, repeatedly swap two random positions, and compare how shuffled the deck looks after different numbers of swaps.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Card-Shuffler",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_card_shuffler.mp4"
				},
				{
					title: "PS6 Supplemental Project 6: Debugging Lists",
					content:
						"Debug an ice-cream survey program by locating list-related mistakes from the console errors and fixing them in sequence.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Debugging-Lists",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS6-Debugging-Lists-Solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps6_debugging_lists.gif"
				}
			]
		},
		{
			title: "PS7 Dictionaries",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review lists and how they were used for data storage, looping, and music generation."
				},
				{
					title: "Dictionaries",
					content:
						"Use dictionaries as key-value stores for fast lookups and clearer modeling than parallel lists. Practice accessing values, checking membership, iterating through keys, and storing different data types as keys and values."
				},
				{
					title: "PS7 Project 1: Dictionaries Practice",
					content:
						"Create dictionaries of words and definitions, squares, factorials, and letter frequencies from a word.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Dictionaries-Practice",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_dictionaries_practice.gif"
				},
				{
					title: "PS7 Project 2: Song Generator 2",
					content:
						"Upgrade the song generator by using a dictionary that translates note-duration names such as whole, half, quarter, or eighth into the values expected by the music generator.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Song-Generator-2-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Song-Generator-2",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_song_generator_2.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS7 Supplemental Project 1: Birthday Converter",
					content:
						"Convert a birthday written as `mm/dd/yyyy` into a full written date using dictionaries for month names and day suffixes, including special cases such as 11th through 13th.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Birthday-Converter-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Birthday-Converter",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_birthday_converter.gif"
				},
				{
					title: "PS7 Supplemental Project 2: Test Scores",
					content:
						"Store student test scores in a dictionary whose values are lists, then compute a second dictionary of student averages.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Test-Scores",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_test_scores.gif"
				},
				{
					title: "PS7 Supplemental Project 3: Coffee Shop",
					content:
						"Convert menu prices stored in parallel lists into a dictionary and print a formatted menu from the result.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Coffee-Shop-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Coffee-Shop",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_coffee_shop.gif"
				},
				{
					title: "PS7 Supplemental Project 4: Dictionary Indexing",
					content:
						"Use nested indexing across dictionaries, lists, and tuples to extract the values needed to print a target sequence of words.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Dictionary-Indexing-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Dictionary-Indexing",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_dictionary_indexing.gif"
				},
				{
					title: "PS7 Supplemental Project 5: Debugging Dictionaries",
					content:
						"Fix a Halloween candy counter by tracing dictionary-related bugs from console messages until the program works correctly.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Debugging-Dictionaries",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS7-Debugging-Dictionaries-Solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps7_debugging_dictionaries.gif"
				}
			]
		},
		{
			title: "PS8 Ciphers and Music",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review what dictionaries are good for, including translation tables and other key-based lookups."
				},
				{
					title: "PS8 Project 1: Morse Code",
					content:
						"Use a dictionary-based translation system to convert text into Morse code and then into a music-based version using short and long note durations.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS8-Morse-Code-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS8-Morse-Code",
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
					title: "Recap From Last Session",
					content:
						"Review how message translation worked in Morse code and how dictionaries made that translation process easier."
				},
				{
					title: "Sets",
					content:
						"Use sets for unordered collections of unique values. Practice creating sets, adding and removing values, checking membership, measuring size, and comparing sets with union and intersection."
				},
				{
					title: "PS9 Project 1: Sets Practice",
					content:
						"Create random sets, compare them with union and intersection, extract unique letters from words, compare words by common letters, and write functions that filter sets by conditions.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Sets-Practice",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_sets_practice.gif"
				},
				{
					title: "PS9 Project 2: Wheel of Fortune",
					content:
						"Build a word-guessing game that uses sets to track both all letters in the target word and the letters the user has guessed correctly, then add replay or random-word extensions if desired.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Wheel-of-Fortune",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_9_wheel_of_fortune.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PS9 Supplemental Project 1: Class Registration",
					content:
						"Remove duplicate student names from class rosters and report the actual number of enrolled students in each course.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Class-Registration-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Class-Registration",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_class_registration.gif"
				},
				{
					title: "PS9 Supplemental Project 2: Class Registration II",
					content:
						"Determine which students are waitlisted once duplicates are removed and enrollment caps are enforced.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Class-Registration-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Class-Registration-II",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_class_registration_ii.gif"
				},
				{
					title: "PS9 Supplemental Project 3: Favorite Foods",
					content:
						"Compare two sets of favorite foods and print the shared foods as well as the foods unique to each person.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Favorite-Foods",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_favorite_foods.gif"
				},
				{
					title: "PS9 Supplemental Project 4: Soccer Nationalities",
					content:
						"Use a dictionary of player nationalities and a set to count and print the distinct countries represented on a team.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Soccer-Nationalities-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Soccer-Nationalities",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_soccer_nationalities.gif"
				},
				{
					title: "PS9 Supplemental Project 5: Debugging Sets",
					content:
						"Fix a capture-the-flag tracker by correcting set-related errors and verifying the program state after each repair.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Debugging-Sets",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS9-Debugging-Sets-Solution",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps9_debugging_sets.gif"
				}
			]
		},
		{
			title: "PS10 Todo List",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review what sets are useful for and how they supported larger game logic in the previous module."
				},
				{
					title: "PS10 Project 1: Todo List",
					content:
						"Build an interactive todo list that lets the user add tasks, remove tasks, display the numbered list, and optionally prioritize tasks or reject invalid removals.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-Todo-List",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_todo_list.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS10 Supplemental Project 1: US Capitals Quiz",
					content:
						"Quiz the user on state capitals until an incorrect answer is given, then print the final score.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-US-Capitals-Quiz-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-US-Capitals-Quiz",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_us_capitals_quiz.gif"
				},
				{
					title: "PS10 Supplemental Project 2: Field Day",
					content:
						"Assign classmates to kickball, capture the flag, both, or neither, then print the final rosters for both teams.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-Field-Day",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_field_day.gif"
				},
				{
					title: "PS10 Supplemental Project 3: Field Day II",
					content:
						"Randomly split a class into Team Red and Team Blue while printing roster updates and the remaining unassigned players after each round.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS10-Field-Day-II",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps10_field_day_ii.gif"
				}
			]
		},
		{
			title: "PS11 Bank Account",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review how the todo list combined lists, loops, indexing, and conditionals into a larger interactive program."
				},
				{
					title: "PS11 Project 1: Bank Account",
					content:
						"Create a login-based bank account simulator with usernames, passwords, balances, deposits, withdrawals, password changes, and optional interest collection.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS11-Bank-Account",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps11_bank_account.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS11 Supplemental Project 1: Calculator",
					content:
						"Write arithmetic helper functions and combine them into a calculator that lets the user choose an operation and print the result.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS11-Calculator",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps11_calculator.gif"
				},
				{
					title: "PS11 Supplemental Project 2: Juni World",
					content:
						"Use dictionaries and looping menu logic to track how much time remains in a six-hour amusement park visit and which rides the user chooses.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS11-Juni-World-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS11-Juni-World",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps11_juni_world.gif"
				}
			]
		},
		{
			title: "PS12 Type Racer",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review the pieces needed to build the bank account program, especially menu loops, dictionaries, and validation checks."
				},
				{
					title: "Time Module",
					content:
						"Use the `time` module to pause execution with `time.sleep()` and measure elapsed time with `time.time()` and Unix timestamps."
				},
				{
					title: "PS12 Project 1: Type Racer",
					content:
						"Pick a random sentence, count down, time the user while typing, require exact completion before stopping the timer, and optionally score accuracy or support multiple players.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps12_type_racer.mp4"
				}
			],
			supplementalProjects: [
				{
					title: "PS12 Supplemental Project 1: Review Sentiment",
					content:
						"Split a review into words, compare them against positive and negative vocabularies, and classify the overall review sentiment.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Review-Sentiment-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Review-Sentiment",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps12_review_sentiment.gif"
				},
				{
					title: "PS12 Supplemental Project 2: Evil Wheel of Fortune",
					content:
						"Implement a harder version of Wheel of Fortune where the computer keeps a changing list of possible words and avoids committing to a secret word for as long as possible.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Evil-Wheel-of-Fortune-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Evil-Wheel-of-Fortune",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_12_evil_hangman.mp4"
				}
			]
		},
		{
			title: "PS13 Wordsmith",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review how the time module supported pausing and timing in Type Racer."
				},
				{
					title: "PS13 Project 1: Wordsmith",
					content:
						"Use a provided word list to build a timed word game around seven random letters, validating guesses, preventing repeats, and scoring accepted words. Optional extensions can add a high score, new game loop, or guaranteed vowels.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Wordsmith-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Wordsmith",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps13_wordsmith.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS13 Supplemental Project 1: Typewriter Monkeys",
					content:
						"Continuously generate random letters and stop when the last three letters typed form a valid three-letter English word.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Typewriter-Monkeys-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Typewriter-Monkeys",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps13_typewriter_monkeys.gif"
				},
				{
					title: "PS13 Supplemental Project 2: Advanced Typewriter Monkeys",
					content:
						"Generalize the monkey-typing simulation so it searches for a valid word of length `n` and compare how runtime changes as `n` increases.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Typewriter-Monkeys-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS13-Advanced-Typewriter-Monkeys",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps13_advanced_typewriter_monkeys.gif"
				}
			]
		},
		{
			title: "PS14 Blackjack",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review the major pieces of the Wordsmith game, including sets, word validation, repeated input, and scoring."
				},
				{
					title: "PS14 Project 1: Simple Blackjack",
					content:
						"Build a simplified Blackjack game with cards valued 2 through 11, repeated player hit/stay choices, dealer drawing until at least 17, and replay support.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS14-Simple-Blackjack",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps14_blackjack.gif"
				},
				{
					title: "PS14 Project 2: Advanced Blackjack",
					content:
						"Extend Blackjack with face cards, named card output, ace handling as 1 or 11, and helper functions that compute the best available hand value.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS14-Advanced-Blackjack",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps14_advanced_blackjack.gif"
				}
			],
			supplementalProjects: [
				{
					title: "PS14 Supplemental Project 1: Game of War",
					content:
						"Simulate ten rounds of War by giving each player a random card value each round, printing the result, and tracking total wins.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS14-Game-of-War",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps14_game_of_war.gif"
				},
				{
					title: "PS14 Supplemental Project 2: Mastermind",
					content:
						"Implement the code-breaking game Mastermind by comparing user guesses to a hidden four-digit code and reporting how many digits are correct or close.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main/PS14-Mastermind",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_14_mastermind.mp4"
				}
			]
		},
		{
			title: "PS15 Master Project",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review the structure of the Blackjack game and identify the concepts it combined from across the course."
				},
				{
					title: "PS15 Project 1: Master Project",
					content:
						"Design and build a larger console project that showcases the core concepts from the course. Possible directions include trivia games, virtual pets, dice games, or text-based RPGs. Start by outlining the major program steps and data structures before implementation.",
					mediaLink:
						"https://static.classes.jacobdanderson.net/ps_15_master_project.mp4"
				},
				{
					title: "Master Project Presentation",
					content:
						"Prepare a short presentation that explains the project structure, the most important coding decisions, and how the course concepts came together in the final program."
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course: variables, strings, input, loops, ASCII and ciphers, conditionals, functions, lists, dictionaries, sets, timing, and larger game structure. Then discuss the next course that best fits future goals, such as Python Level 3, Java Level 1, Data Science in Python, PyGame, or JavaScript Level 1."
				}
			],
			supplementalProjects: []
		}
	]
};
