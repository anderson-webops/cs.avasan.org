import type { RawCourse } from "./types";

export const pythonLevel3Course: RawCourse = {
	name: "Python Level 3",
	modules: [
		{
			title: "AM1 Review: Variables, Strings, Input, Loops, & Conditionals",
			curriculum: [
				{
					title: "Introductions & Setup",
					content:
						"Start with a short introduction and get comfortable with the coding environment. Open the learner portal, review how to move between modules and projects, and explore the code editor, instructions, and console tabs. This review module can be used flexibly: move through it in order or jump to the sections that need the most reinforcement."
				},
				{
					title: "Variables, Strings, and Input",
					content:
						'Review variables as named places to store data such as numbers and strings. Use a variable like `x` to store `"Hello world"` and print it. Review string indexing with `x[i]`, where index `0` is the first character. Use `input("prompt")` to collect user input and store the result in a variable before using it later in the program.'
				},
				{
					title: "AM1 Project 1: Mad Libs",
					content:
						"Build a Mad Libs program by asking for at least five words such as nouns, adjectives, and verbs. Store each answer in a variable and print a completed story using the collected inputs. After finishing, prepare a short walkthrough explaining what the project does and how the code works.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM1-Mad-Libs"
				},
				{
					title: "Loops",
					content:
						"Compare `for` loops and `while` loops. Use `for i in range(10)` to print 0 through 9. Recreate the same result with `while x < 10`, updating `x` inside the loop. Then explore `while True` and use `break` to stop an otherwise infinite loop when a chosen condition is met."
				},
				{
					title: "Conditionals",
					content:
						'Review how conditionals control the flow of a program. Create examples with `if`, `elif`, and `else`, and compare conditions such as `==`, `>`, and `>=`. Test what happens when a conditional expression is replaced with `True` or `False`. Practice writing a chain that prints `"big"`, `"HUGE"`, `"H U M O N G O U S"`, or `"small"` depending on the value of `x`, and compare multiple independent `if` statements with an `if`/`elif` chain.'
				},
				{
					title: "AM1 Project 2: Junian Language Verifier",
					content:
						'Write a program that checks whether an input string is a valid Junian word. A valid word has an even number of characters, contains at least two vowels, and begins and ends with different letters. For example, `"Juni"` is valid. After finishing, prepare a short walkthrough of the logic used to verify each rule.',
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM1-Junian-Language-Verifier"
				},
				{
					title: "AM1 Project 3: Juni Assistant",
					content:
						"Create a simple assistant program that can respond to commands such as reporting the time or date, remembering a name, telling a joke, or sharing a fun fact. Use a loop so the assistant can continue accepting requests until a stopping condition is met. One possible design uses `while True`; another uses a boolean variable to control whether the program should keep running.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM1-Juni-Assistant"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM2 Review: Functions & Lists",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review the key ideas from the previous session: variables, input, conditionals, and loops. Revisit any project code that still needs debugging or cleanup before moving on."
				},
				{
					title: "Assignment Review",
					content:
						"Reopen the previous assignment, test it, and fix any remaining issues. If everything works, explain the main parts of the solution out loud before continuing."
				},
				{
					title: "Functions",
					content:
						"Review functions as reusable templates for computation. Define functions with `def`, pass values in through parameters, and send values back with `return`. Start with a simple example such as a function that squares its input, then extend the idea to functions with multiple parameters and more complex logic."
				},
				{
					title: "AM2 Project 1: Functions Practice",
					content:
						"Write a set of practice functions: return the product of three numbers, return the average of two numbers, count how many times a letter appears in a word, count how many digits in an integer are 7, and compute `a` to the power of `b`. Challenge extensions include factorials and the length of a Hailstone sequence.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM2-Functions-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM2-Functions-Practice"
				},
				{
					title: "Lists",
					content:
						"Review lists as ordered collections of values. Create an empty list with `x = []`, build lists of numbers, mutate list elements, and use `append()` to add values at the end. Compare iterating through a list directly with `for item in myList` versus iterating by index with `for i in range(len(myList))`."
				},
				{
					title: "AM2 Project 2: Lists Practice",
					content:
						"Practice building and using lists without hard-coding results. Create the numbers 1 through 20, the first 20 even numbers, and the first 10 perfect squares. Then write functions that sum lists, return minimum and maximum values, flatten a list of lists, and return the maximum value from each inner list.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM2-Lists-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM2-Lists-Practice"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM3 Review: Dictionaries & Recap",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review functions and lists from the previous module. Revisit examples that return values, mutate lists, or iterate with loops if any of those patterns still feel uncertain."
				},
				{
					title: "Assignment Review",
					content:
						"Run through the previous assignment, demonstrate working solutions, and correct any remaining bugs before starting new material."
				},
				{
					title: "Dictionaries",
					content:
						'Introduce dictionaries as collections of key-value pairs. Create examples such as `prices = {"soap": 2, "apple": 1, "frozen_pizza": 5}` and use `dictionary[key]` to look up values. Check whether a key exists with `if key in dictionary`, iterate with `for key in dictionary`, and explore dictionaries whose keys and values use different data types. Practice building dictionaries of squares, factorials, and letter counts for a word.'
				},
				{
					title: "AM3 Project 1: Python Fundamentals Problem Set",
					content:
						"Complete a fundamentals problem set that reviews the major ideas covered so far. The set includes list processing, counting, perfect squares, factorial sums, divisors, reverse strings, vowel counts, frequency analysis, and swapping values in a list. This module may take more than one class session, so focus on steady progress and clean solutions.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM3-Python-Fundamentals-Problem-Set-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM3-Python-Fundamentals-Problem-Set"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM4 Recursion Part 1",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review dictionaries and identify places where dictionary lookups, membership checks, and frequency counts were used."
				},
				{
					title: "Assignment Review",
					content:
						"Test and discuss the previous assignment before beginning recursion. Focus on explaining how the solution works, not just whether it runs."
				},
				{
					title: "Introduction to Recursion",
					content:
						"A recursive function is a function that calls itself on a smaller version of the same problem. Each recursive solution needs at least one base case, where the answer is known directly, and a recursive step, where the problem is reduced toward that base case. Use everyday examples such as nested dolls or repeated divide-and-repeat processes to build intuition."
				},
				{
					title: "AM4 Project 1: Recursive Factorials",
					content:
						"Write a recursive function that returns `n!`. Use a base case such as `1! = 1`, then define the recursive step so that `factorial(n)` returns `n * factorial(n - 1)`.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Recursive-Factorials"
				},
				{
					title: "AM4 Project 2: Recursive Exponents",
					content:
						"Write a recursive function that returns `b` raised to the power `p`. For positive powers, one useful base case is `p == 1`, and the recursive step multiplies by `b` while reducing the exponent by 1 each time.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Recursive-Exponents"
				},
				{
					title: "AM4 Project 3: Recursive Fibonacci Numbers",
					content:
						"Write a recursive function that returns the `n`th Fibonacci number. Since the sequence starts with 0 and 1, this project uses more than one base case. Then combine the two previous Fibonacci numbers to produce the next one.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Fibonacci-Numbers"
				}
			],
			supplementalProjects: [
				{
					title: "AM4 Supplemental Project 1: Binary Converter",
					content:
						"Convert a number to binary both iteratively and recursively. Review how place value works in base 10 and base 2, then repeatedly divide by 2 and track remainders to build the binary representation. Compare the iterative version with a recursive version that solves the same task on `n // 2` and appends the final bit.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM4-Binary-Converter"
				}
			]
		},
		{
			title: "AM5 Recursion Part 2",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review recursion by identifying the base case and recursive step in each previous project."
				},
				{
					title: "Assignment Review",
					content:
						"Run the previous recursion projects and explain how each recursive call gets the solution closer to its base case."
				},
				{
					title: "Substrings",
					content:
						"Use slicing to extract part of a string with `x[start:end]`. Review that the ending index is exclusive. Practice shortcuts such as `s[:i]`, `s[i:]`, and `s[:-1]`, and compare slicing with `split()` when separating a string into pieces based on a delimiter."
				},
				{
					title: "AM5 Project 1: Recursive Cascade",
					content:
						"Write a recursive `cascade()` function that prints the first character of a string, then the first two characters, and continues until the full string is printed. Then write an inverse version that prints the full string first and removes one character at a time. This project is also a good opportunity to compare head recursion and tail recursion.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Recursive-Cascade"
				},
				{
					title: "AM5 Project 2: Recursive Palindrome Checker",
					content:
						"Write a recursive function that returns `True` if a string is a palindrome and `False` otherwise. Compare matching characters at the front and back of the string and continue recursively on the smaller substring in the middle.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Recursive-Palindrome-Checker"
				},
				{
					title: "Stacks",
					content:
						"A stack is a last-in, first-out data structure. In Python, a stack can be represented with a list by adding items with `append()`, inspecting the top item with `myStack[-1]`, and removing the top item with `pop()`. Compare stack behavior with real-world examples such as a stack of papers or plates."
				},
				{
					title: "AM5 Project 3: Parentheses Validator",
					content:
						"Write a program that checks whether a string of brackets could be part of a valid expression. First solve the problem iteratively with a stack and a dictionary of matching pairs. Then explore a recursive approach that removes complete bracket pairs such as `()`, `[]`, or `{}` until the string is empty or no more valid reductions are possible.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Parentheses-Validator"
				}
			],
			supplementalProjects: [
				{
					title: "AM5 Supplemental Project 1: Recursive Sum and Max",
					content:
						"Practice recursion on lists by writing one function that sums the elements of a list and another that returns the maximum element. Use sublists to shrink the problem toward a base case.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Recursive-Sum-and-Max"
				},
				{
					title: "AM5 Supplemental Project 2: Substring Generator",
					content:
						"Generate all possible substrings of a string recursively. One approach is to treat each character as either included or excluded in a recursive tree of choices, then remove duplicates by converting the results to a set and back to a list.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM5-Substring-Generator"
				}
			]
		},
		{
			title: "AM6 Introduction to Algorithms & Runtime Analysis",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review recursion and identify examples of recursive thinking from earlier projects."
				},
				{
					title: "Assignment Review",
					content:
						"Revisit the previous assignment and focus on explaining why the solution works, especially how repeated subproblems were handled."
				},
				{
					title: "Introduction to Algorithms",
					content:
						"An algorithm is a step-by-step process for completing a task. Compare different ways to solve the same problem and discuss why some methods are more efficient than others. Searching for an element in a list is one common example that leads naturally into algorithm analysis."
				},
				{
					title: "AM6 Project 1: Linear Search Implementation",
					content:
						"Implement a linear search function that takes a list and a target value and returns `True` if the target appears in the list and `False` otherwise.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Linear-Search"
				},
				{
					title: "Runtime Analysis & Big-O Notation",
					content:
						"Use Big-O notation to describe how the runtime of an algorithm grows as the input size grows. Focus on the dominant term and ignore lower-order terms and constant factors. Connect this idea to best-case, average-case, and worst-case thinking."
				},
				{
					title: "AM6 Project 2: Big-O Notation",
					content:
						"Practice identifying Big-O notation from mathematical expressions such as `12n^2 + n`, `n - sqrt(n)`, `log(n) + 2`, and recursive definitions like `f(n) = 1 + f(n/2)`. Include challenge problems that compare multiple variables or use known summations such as `1 + 2 + ... + n`.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Big-O-Analysis",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Big-O-Analysis"
				},
				{
					title: "AM6 Project 3: Function Analysis",
					content:
						"Analyze several functions by counting the number of operations they perform relative to `n`. Break nested loops into outer-loop and inner-loop work, compare repeated addition with multiplication, and decide on the final Big-O classification.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM6-Function-Analysis"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM7 Binary Search",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review runtime analysis and linear search, including the meaning of Big-O notation and the difference between linear and logarithmic growth."
				},
				{
					title: "Assignment Review",
					content:
						"Check the previous assignment, verify that the search and analysis problems run correctly, and revisit any cases that were confusing."
				},
				{
					title: "Binary Search Introduction",
					content:
						"Binary search is a faster search method for sorted lists. At each step, compare the target value to the middle item and eliminate half of the remaining search space. This repeated halving connects directly to recursion and logarithmic runtime."
				},
				{
					title: "AM7 Project 1: Binary Search Implementation",
					content:
						"Implement binary search both iteratively and recursively. In the iterative version, track low and high indexes and continue while `low <= high`. In the recursive version, use slices or index bounds to search the appropriate half until the list is empty or the target is found.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Binary-Search"
				},
				{
					title: "Binary Search Big-O Analysis",
					content:
						"Analyze the worst case for binary search by tracking how many times the input can be cut in half before nothing remains. Compare `O(log n)` with `O(n)` and discuss why binary search only works reliably on sorted data."
				},
				{
					title: "AM7 Project 2: Reverse Number Guesser",
					content:
						"Write a program where the computer guesses the user's number by applying a binary search strategy. Use the shrinking interval of possible answers to make the guessing process efficient.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Reverse-Number-Guesser"
				},
				{
					title: "AM7 Project 3: Runtime Comparator",
					content:
						"Copy in iterative versions of linear search and binary search, then compare their performance on many random searches. Use `time.time()` before and after the repeated searches to measure runtime and compare the results.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Runtime-Comparator"
				}
			],
			supplementalProjects: [
				{
					title: "AM7 Supplemental Project 1: Number Guesser",
					content:
						"Design a number-guessing strategy that guarantees the correct answer within 7 tries. Focus on the process that always works, not on lucky guesses. This warm-up naturally motivates binary search.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM7-Number-Guesser"
				}
			]
		},
		{
			title: "AM8 Selection Sort & Insertion Sort",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review binary search, when it can be used, and why its runtime is `O(log n)`."
				},
				{
					title: "Assignment Review",
					content:
						"Test the previous search projects and confirm that both correctness and runtime reasoning are solid."
				},
				{
					title: "Selection Sort Introduction",
					content:
						"Selection sort repeatedly finds the smallest item in the unsorted portion of a list and places it into the next position of the sorted portion. It is a straightforward first sorting algorithm and leads naturally into runtime analysis."
				},
				{
					title: "AM8 Project 1: Selection Sort",
					content:
						"Write a function that sorts a list of numbers using selection sort. First build an approach that repeatedly removes the minimum value and adds it to a result list, then consider how an in-place version would reduce memory usage.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM8-Selection-Sort"
				},
				{
					title: "Selection Sort Big-O Analysis",
					content:
						"Count the repeated passes through the shrinking list to show that selection sort performs on the order of `n^2` work. Then compare time complexity with space complexity and discuss the tradeoff between building a new list and sorting in place."
				},
				{
					title: "Insertion Sort Introduction",
					content:
						"Insertion sort builds a sorted list one item at a time. Each new value is inserted into its proper location among the values already processed, often by swapping backward until the new value is in the correct place."
				},
				{
					title: "AM8 Project 2: Insertion Sort",
					content:
						"Implement insertion sort and test it on several kinds of input, including an already sorted list, a descending list, and a random list. Track how the sorted and unsorted portions change over time.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM8-Insertion-Sort"
				},
				{
					title: "Insertion Sort Big-O Analysis",
					content:
						"Analyze why the worst case for insertion sort occurs on a reversed list. Show that the total number of swaps forms the sum `1 + 2 + ... + (n - 1)`, giving `O(n^2)` time. Then compare this with the near-best case where the list is already almost sorted."
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM9 Bubble Sort",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review selection sort and insertion sort, including how each algorithm works and how their runtimes compare."
				},
				{
					title: "Assignment Review",
					content:
						"Run the sorting code from the previous session and revisit any edge cases or misunderstandings before adding another sorting algorithm."
				},
				{
					title: "Bubble Sort Introduction",
					content:
						"Bubble sort repeatedly walks through a list, compares adjacent items, and swaps them when they are out of order. One full pass moves a large value toward the end of the list, and repeated passes eventually sort the entire list."
				},
				{
					title: "AM9 Project 1: Bubble Sort",
					content:
						"Implement bubble sort by first coding a single pass, then extending it to repeat for enough passes to fully sort the list. Use a temporary variable when swapping values and test the result on randomly generated data.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM9-Bubble-Sort"
				},
				{
					title: "Bubble Sort Big-O Analysis",
					content:
						"Count the repeated adjacent comparisons and show why bubble sort is also `O(n^2)` in time. Then improve the algorithm by adding an early cutoff or reducing the comparison range once the largest values have already been moved into place."
				},
				{
					title: "AM9 Project 2: Baseball Analytics",
					content:
						"Adapt a sorting algorithm to rank a list of players by different statistics such as batting average, home runs, or RBI. Store each player's data together and sort based on the chosen field, returning a leaderboard in the correct order.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM9-Baseball-Analytics-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM9-Baseball-Analytics"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM10 Merge Sort",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review bubble sort and its quadratic runtime. Compare it with the previous sorting algorithms and identify common patterns among them."
				},
				{
					title: "Assignment Review",
					content:
						"Run and explain the previous sorting code, including any optimizations that were added."
				},
				{
					title: "Merge Sort Introduction",
					content:
						"Merge sort uses divide and conquer. Split a list into two halves, recursively sort each half, and then merge the two sorted halves back together. The key insight is that merging sorted lists is much faster than sorting from scratch."
				},
				{
					title: "AM10 Project 1: Merge",
					content:
						"Write a `merge()` function that combines two already sorted lists into one larger sorted list. Build the result one element at a time by comparing the front items of the two input lists.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM10-Merge-Sort"
				},
				{
					title: "AM10 Project 2: Split",
					content:
						"Write a recursive function that repeatedly splits a list into halves until each piece has length 1 or less. This project isolates the recursive structure used by merge sort.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM10-Merge-Sort"
				},
				{
					title: "AM10 Project 3: Merge Sort",
					content:
						"Combine the splitting and merging processes into a full merge sort implementation. Then explore whether the same logic can be written in a more compact form without relying on separate helper functions.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM10-Merge-Sort"
				},
				{
					title: "Merge Sort Big-O Analysis",
					content:
						"Use a recursion tree to analyze merge sort. Each level of the tree does `O(n)` total merge work, and the height of the tree is `O(log n)`, giving an overall runtime of `O(n log n)`. Compare this growth to `O(n^2)` and discuss why merge sort is usually preferable on larger inputs."
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM11 Quicksort",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review merge sort, including the roles of splitting, merging, and recursion in its implementation."
				},
				{
					title: "Assignment Review",
					content:
						"Retest the merge functions and the full merge sort implementation before moving on to another divide-and-conquer algorithm."
				},
				{
					title: "Quicksort Introduction",
					content:
						"Quicksort chooses a pivot value, partitions the list into values less than, equal to, and greater than the pivot, then recursively sorts the outer partitions. It is another divide-and-conquer algorithm, but unlike merge sort it relies on partitioning rather than merging."
				},
				{
					title: "AM11 Project 1: Partition",
					content:
						"Write a helper function that takes a list and a pivot and returns the three partitions: less than the pivot, equal to the pivot, and greater than the pivot. This helper keeps the main quicksort function easier to read and test.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM11-Quicksort"
				},
				{
					title: "AM11 Project 2: Quicksort",
					content:
						"Write a quicksort function that partitions the input, recursively sorts the needed pieces, and concatenates the final result. Test the function on a variety of lists, including inputs with repeated values.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM11-Quicksort"
				},
				{
					title: "Quicksort Big-O Analysis",
					content:
						"Use a recursion tree to compare quicksort's best and worst cases. If the pivot splits the list evenly, quicksort runs in `O(n log n)`. If the pivot is consistently poor and produces highly unbalanced partitions, the runtime degrades to `O(n^2)`. Explore strategies such as random pivots or shuffling the list first to avoid bad cases more often."
				},
				{
					title: "AM11 Project 3: Sorting Comparison",
					content:
						"Compare the runtime of several sorting algorithms on different kinds of input, such as random lists, sorted lists, or reversed lists. Use the results to reason about when one algorithm is a better fit than another.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM11-Sorting-Comparison"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM12 File Input/Output",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review quicksort and compare its recursive structure to merge sort."
				},
				{
					title: "Assignment Review",
					content:
						"Retest the quicksort implementation and any runtime comparison code before moving into file handling."
				},
				{
					title: "Writing to a File",
					content:
						'Use `open("filename.txt", "w+")` to create or open a file for writing, then use `f.write(...)` to store output in that file instead of only printing to the console. Practice writing multiple lines of text and generating output inside a loop.'
				},
				{
					title: "AM12 Project 1: Crazy Name Tags Printer",
					content:
						"Ask for a name and write it to a file in several ways: one letter at a time, every other letter, and backward. As an extension, send each version to a separate file.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-Crazy-Name-Tags-Printer"
				},
				{
					title: "Reading From a File",
					content:
						"Compare `f.read()` and `f.readlines()`. Use `read()` when the full file should be handled as one string and `readlines()` when it is more convenient to work with a list of lines. Review how newline characters appear in file input and remove them with `strip()` when needed."
				},
				{
					title: "AM12 Project 2: File IO and Dictionaries",
					content:
						"Read alternating lines from a file and store them in a dictionary where one line is the key and the next line is its value. This combines file input with dictionary construction.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-File-IO-and-Dictionaries-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-File-IO-and-Dictionaries"
				},
				{
					title: "AM12 Project 3: Juni Latin with File IO",
					content:
						"Read sentences from an input text file, translate each word using a Juni Latin function, and write the translated results to an output file. As a challenge, preserve punctuation in its correct place while translating the words.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-Juni-Latin-with-File-IO-Starter",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM12-Juni-Latin-with-File-IO"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM13 Master Project: Conway's Game of Life",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review reading from and writing to files, along with the difference between `read()`, `readlines()`, and `strip()`."
				},
				{
					title: "Assignment Review",
					content:
						"Retest the file I/O projects and verify that files are being read and written in the expected format."
				},
				{
					title: "Introduction to Conway's Game of Life",
					content:
						"Conway's Game of Life is a cellular automaton played on a grid of live and dead cells. Each generation updates based on four rules about underpopulation, survival, overpopulation, and reproduction. The project combines grids, loops, conditionals, and file input into a larger simulation."
				},
				{
					title: "AM13 Project 1: Conway's Game of Life",
					content:
						"Create a grid, load an initial pattern from a file, and print or display successive generations of the board. Implement the four update rules and pause briefly between generations so the simulation is easier to follow.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Conways-Game-of-Life"
				},
				{
					title: "AM13 Project 2: Two-Player Conway's Game of Life",
					content:
						"Extend the original simulation into a two-player version. Store dead cells and two different player states in the grid, allow each player to place and remove cells between generations, and end the game when one player's cells are completely gone.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Two-Player-Conways"
				},
				{
					title: "Master Project Presentation",
					content:
						"Once the project is working, prepare a short presentation explaining the grid representation, update rules, file input, and any additional features or strategies used in the implementation."
				}
			],
			supplementalProjects: []
		},
		{
			title: "AM14 Master Project: Tic Tac Toe AI",
			curriculum: [
				{
					title: "Recap From Last Session",
					content:
						"Review Conway's Game of Life and identify which parts of the program handled the grid, update rules, and repeated simulation steps."
				},
				{
					title: "Assignment Review",
					content:
						"Retest the Conway projects and fix any remaining issues before starting the final AI project."
				},
				{
					title: "Introduction to Artificial Intelligence",
					content:
						"Artificial intelligence can be described as making a computer act rationally for a specific task. In this module, the goal is to design a Tic Tac Toe program that chooses strong moves instead of playing randomly."
				},
				{
					title: "AM14 Project 1: Tic Tac Toe UI",
					content:
						"Create a user interface for Tic Tac Toe. Represent the board with a list or a list of lists, print the board clearly, alternate turns between two players, and detect wins or ties. Start with a computer player that makes random legal moves.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-UI"
				},
				{
					title: "AM14 Project 2: Tic Tac Toe AI",
					content:
						"Replace the random computer player with a rule-based AI. Prioritize immediate wins, blocks against an opponent's immediate win, center control, corners, and then sides. Test each candidate move on a copied board so the real game state is not changed during evaluation.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI"
				},
				{
					title: "AM14 Project 3: Tic Tac Toe AI Test",
					content:
						"Run the AI against the random player many times and record wins, losses, and ties. Use the results to evaluate how well the strategy performs and where it can still improve.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI-Test"
				},
				{
					title: "AM14 Project 4: Advanced Tic Tac Toe AI",
					content:
						"Add support for fork creation and fork blocking. A fork is a move that creates two simultaneous winning threats. Update the AI strategy order to include immediate wins, blocks, forks, fork blocks, center, corners, and sides.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM14-Tic-Tac-Toe-AI-with-Forks"
				},
				{
					title: "Master Project Presentation",
					content:
						"Prepare a short explanation of how the board is represented, how the AI evaluates moves, and what testing was used to measure the strength of the strategy."
				},
				{
					title: "Course Recap",
					content:
						"Review the main ideas from the course: functions, lists, dictionaries, recursion, stacks, searching, sorting, Big-O notation, file input/output, simulations, and simple AI. Then discuss which next course best fits future goals and interests."
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this module as a low-pressure review of recursion, stacks, and string processing. Work through each prompt independently first, then revisit any skill that still needs practice."
				},
				{
					title: "Check-In #1: String Functions",
					content:
						"Practice slicing and splitting strings. Remove the first and last letters from a word, and extract the second word from a sentence with at least two words."
				},
				{
					title: "Check-In #1: Recursion",
					content:
						"Explain what a recursive function is and identify its base case and recursive call. Then write recursive solutions for bowling-pin pyramids, Lucas numbers, and tracing the behavior of a provided recursive function."
				},
				{
					title: "Check-In #1: Stacks",
					content:
						"Review stack behavior, create a stack of numbers, push and pop items, and use a stack-based solution to process keyboard input where `#` represents backspace."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Write one recursive function that prints the running sums of the first `n` elements of a list and another that prints the same sums in reverse order.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM-Check-in-1-Additional-Project"
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
						"Use this check-in to review algorithm analysis and core search and sorting topics. Focus on explaining the reasoning behind each answer, not just the final result."
				},
				{
					title: "Check-In #2: Time Complexity",
					content:
						"Define Big-O analysis, simplify several runtime expressions, and identify best-case and worst-case behavior in sample functions."
				},
				{
					title: "Check-In #2: Linear Search",
					content:
						"Explain how linear search works, when it can be used, fill in missing code for a linear search function, and identify its best and worst cases."
				},
				{
					title: "Check-In #2: Binary Search",
					content:
						"Explain binary search, describe when it can be used, finish both iterative and recursive implementations, and identify its runtime behavior."
				},
				{
					title: "Check-In #2: Selection Sort",
					content:
						"Describe selection sort, trace the result of a few passes on a sample list, complete an implementation, and explain its runtime."
				},
				{
					title: "Check-In #2: Insertion Sort",
					content:
						"Describe insertion sort, trace several passes, complete an implementation, and compare its best and worst cases."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Reuse the sorting algorithms built earlier and compare their speed on random, sorted, and reversed lists of different sizes.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM-Check-In-2-Additional-Project"
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
						"Use this final check-in to review advanced sorting and file input/output. Work through examples independently first, then revisit any weak spots."
				},
				{
					title: "Check-In #3: Bubble Sort",
					content:
						"Explain bubble sort, trace the effect of a few passes, complete an implementation, and discuss simple efficiency improvements such as early cutoffs."
				},
				{
					title: "Check-In #3: Merge Sort",
					content:
						"Explain merge sort, complete a `merge()` helper, and identify why merge sort uses recursion rather than repeated passes."
				},
				{
					title: "Check-In #3: Quicksort",
					content:
						"Explain quicksort, complete a `partition()` helper, and compare its best and worst runtime behavior."
				},
				{
					title: "Check-In #3: File Input/Output",
					content:
						"Write letters of an input word to a file, read them back, count letter frequencies in a dictionary, and explain the difference between `.read()` and `.readlines()`."
				},
				{
					title: "Check-In #3: Additional Practice Project",
					content:
						"Read letters from a file into a list, sort them in ASCII order using one of the implemented sorting algorithms, and write the sorted results back to a file.",
					solutionLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM-Check-in-3-Additional-Project"
				}
			],
			supplementalProjects: []
		}
	]
};
