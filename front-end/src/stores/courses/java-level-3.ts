import type { RawCourse } from "./types";

export const javaLevel3Course: RawCourse = {
	name: "Java Level 3",
	modules: [
		{
			title: "AJ1 Review: Variables, Strings, and Input",
			curriculum: [
				{
					title: "Introductions and Setup",
					content:
						"Get familiar with the Java workspace, custom Java projects, and the structure of a Java program. This module works well as a review resource for variables, strings, input, and commenting before moving into more advanced topics."
				},
				{
					title: "Creating and Running a Java Program",
					content:
						"Review the role of classes, methods, `main()`, console output, and the basic project structure used throughout the course. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Compilation",
					content:
						"Understand that Java code must be compiled before it runs, both to catch syntax issues and to translate source code into a form the computer can execute. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Variables, Primitive Data Types, and Strings",
					content:
						"Review variables, primitive data types such as `int`, `boolean`, and `double`, and object references such as `String`. Practice declaring, assigning, concatenating, indexing with `charAt()`, and measuring string length."
				},
				{
					title: "Input, Output, and Commenting",
					content:
						"Use `Scanner` to read console input, compare `System.out.print()` with `System.out.println()`, and review both single-line and block comments. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ1 Project 1: Mad Libs",
					content:
						"Ask the user for several words, store them in descriptive variables, and build a Mad Lib story by concatenating the inputs together. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib"
				},
				{
					title: "AJ1 Project 2: Chatbot",
					content:
						"Create a simple chatbot that asks several questions, stores each response, and replies based on the answers. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Chatbot",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Chatbot"
				}
			],
			supplementalProjects: [
				{
					title: "Review: Variables, Strings, and Input: Extension Challenge",
					content:
						"Extend the work from AJ1 Review: Variables, Strings, and Input with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib"
				},
				{
					title: "Review: Variables, Strings, and Input supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ1 Review: Variables, Strings, and Input. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-01-aj1-review-variables-strings-and-input-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-01-aj1-review-variables-strings-and-input-supplemental-2/solution"
				},
				{
					title: "Review: Variables, Strings, and Input supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ1 Review: Variables, Strings, and Input. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-02-aj1-review-variables-strings-and-input-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-02-aj1-review-variables-strings-and-input-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ2 Review: Arrays and ArrayLists",
			curriculum: [
				{
					title: "Review Focus",
					content:
						"Use this module as a review resource for one-dimensional arrays, two-dimensional arrays, and `ArrayList`s before the course moves into more advanced data structures. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Arrays",
					content:
						"Review how arrays store ordered elements of one type, how indexing works, how to get the length, and how to print an array by iterating through it. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ2 Project 1: Array Practice",
					content:
						"Write methods that double array values, sum even numbers, generate arrays of random doubles, and total the lengths of words in an array. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-Practice"
				},
				{
					title: "Two-Dimensional Arrays",
					content:
						"Review how 2D arrays represent grids, how to access rows and columns, and how nested loops traverse every element. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ2 Project 2: Two-Dimensional Array Practice",
					content:
						"Create and fill square grids, find maximum values, generate random matrices, and search 2D arrays for a target value. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Two-Dimensional-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Two-Dimensional-Array-Practice"
				},
				{
					title: "ArrayLists",
					content:
						"Compare arrays with `ArrayList`s, then review `add()`, `get()`, `set()`, and `remove()` for dynamic collections. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Primitive Wrapper Objects",
					content:
						"Review how wrapper types such as `Integer` and `Double` allow primitive values to be stored inside `ArrayList`s through auto-boxing and unboxing. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ2 Project 3: ArrayList Practice",
					content:
						"Write methods that filter even numbers, test whether two values sum to zero, remove the smallest value, and append a total sum to an `ArrayList`. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-List-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-List-Practice"
				}
			],
			supplementalProjects: [
				{
					title: "AJ2 Supplemental Project 1: Test Scores",
					content:
						"Store a set of test scores in an array, compute the average, and convert it into a letter grade. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Test-Scores",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Test-Scores"
				},
				{
					title: "AJ2 Supplemental Project 2: Matrix Addition",
					content:
						"Read in two matrices of matching dimensions, add them entry by entry, and print the result. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Matrix-Addition",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Matrix-Addition"
				},
				{
					title: "AJ2 Supplemental Project 3: Sandwich Orders",
					content:
						"Build an ingredient list with an `ArrayList`, collect a sandwich order, and convert it into an abbreviated string representation. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Sandwich-Orders",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Sandwich-Orders"
				}
			]
		},
		{
			title: "AJ3 Review: Objects and Classes",
			curriculum: [
				{
					title: "Object-Oriented Programming",
					content:
						"Review classes, objects, instance variables, methods, constructors, and the overall purpose of object-oriented programming in Java. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Public and Private Instance Variables",
					content:
						"Compare public and private variables, discuss encapsulation, and review why most instance data should stay private behind methods. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Constructors",
					content:
						"Review default constructors and overloaded constructors, then instantiate objects using different constructor signatures. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Class Methods",
					content:
						"Use getters, setters, and `toString()` to expose and update object state in a controlled way. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ3 Project 1: Student Class",
					content:
						"Create a `Student` class with private fields, constructors, getters, setters, and a coherent `toString()` method. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class"
				},
				{
					title: "Static Variables and Methods",
					content:
						"Use a static variable such as `numStudents` to track a class-wide total and access it through a static getter. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Inheritance and Subclasses",
					content:
						"Review how subclasses extend superclasses, inherit public behavior, and use `super()` to reuse parent constructors. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ3 Project 2: BakedGood Class",
					content:
						"Create a `BakedGood` class and use it as a base for later work with inheritance, abstract classes, interfaces, and enums. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Baked-Good",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Baked-Good"
				},
				{
					title: "Abstract Classes and Methods",
					content:
						"Make `BakedGood` abstract, add an abstract pricing method, and create a `Bread` subclass that provides a concrete implementation. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Interfaces",
					content:
						"Create and implement an interface such as `ForSale`, then use `Comparable` to compare baked goods by ingredient count. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Enums",
					content:
						"Use enums to restrict possible values such as loaf sizes and update constructors and instance variables to use those enum types. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Review: Objects and Classes: Extension Challenge",
					content:
						"Extend the work from AJ3 Review: Objects and Classes with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class"
				},
				{
					title: "Review: Objects and Classes supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ3 Review: Objects and Classes. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-03-aj3-review-objects-and-classes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-03-aj3-review-objects-and-classes-supplemental-2/solution"
				},
				{
					title: "Review: Objects and Classes supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ3 Review: Objects and Classes. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-04-aj3-review-objects-and-classes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-04-aj3-review-objects-and-classes-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ4 Recursion",
			curriculum: [
				{
					title: "Recursion",
					content:
						"Learn how recursive methods solve problems by reducing them to smaller subproblems, and review the roles of the base case and recursive case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Sum of the First N Numbers",
					content:
						"Trace a recursive example for summing the first `n` numbers and compare the recursive solution with an iterative one. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Call Stack",
					content:
						"Review how recursive calls build up on the call stack, why stack overflow happens, and why recursive overhead sometimes makes iterative solutions faster. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ4 Project 1: Recursion Practice",
					content:
						"Write recursive methods for exponents, factorials, digit sums, Fibonacci numbers, and palindrome checking. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice"
				},
				{
					title: "AJ4 Project 2: Divisible by 7",
					content:
						"Use a recursive divisibility rule to determine whether a number is divisible by 7, breaking it into smaller subproblems each step. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Divisible-by-7",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Divisible-by-7"
				}
			],
			supplementalProjects: [
				{
					title: "Recursion: Extension Challenge",
					content:
						"Extend the work from AJ4 Recursion with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice"
				},
				{
					title: "Recursion supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ4 Recursion. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-05-aj4-recursion-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-05-aj4-recursion-supplemental-2/solution"
				},
				{
					title: "Recursion supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ4 Recursion. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-06-aj4-recursion-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-06-aj4-recursion-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ5 Linear Search and Big-O Notation",
			curriculum: [
				{
					title: "Linear Search",
					content:
						"Learn how linear search checks items one by one in order until the target is found or the collection ends. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ5 Project 1: Linear Search Implementation",
					content:
						"Write a method that searches an array for a target and returns its index or `-1` if it is not found. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search"
				},
				{
					title: "Introduction to Big-O Analysis",
					content:
						"Use Big-O notation to estimate runtime growth based on input size, focusing on worst-case behavior and dominant terms. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ5 Project 2: Big-O Practice",
					content:
						"Determine the Big-O of several mathematical runtime expressions and connect those expressions to algorithm behavior. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Big-O-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Big-O-Practice"
				}
			],
			supplementalProjects: [
				{
					title: "Linear Search and Big O Notation: Extension Challenge",
					content:
						"Extend the work from AJ5 Linear Search and Big-O Notation with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search"
				},
				{
					title: "Linear Search and Big O Notation supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ5 Linear Search and Big-O Notation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-07-aj5-linear-search-and-big-o-notation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-07-aj5-linear-search-and-big-o-notation-supplemental-2/solution"
				},
				{
					title: "Linear Search and Big O Notation supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ5 Linear Search and Big-O Notation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-08-aj5-linear-search-and-big-o-notation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-08-aj5-linear-search-and-big-o-notation-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ6 Binary Search",
			curriculum: [
				{
					title: "Binary Search",
					content:
						"Learn how binary search repeatedly narrows a sorted array by comparing the target to the middle element and discarding half the search space each time. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ6 Project 1: Binary Search with Iteration",
					content:
						"Implement binary search iteratively using lower and upper bounds plus a loop that updates the midpoint after every comparison. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Iteration",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Iteration"
				},
				{
					title: "AJ6 Project 2: Binary Search with Recursion",
					content:
						"Implement binary search recursively, either by passing bounds into each call or by splitting the array into subarrays. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Recursion",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Recursion"
				},
				{
					title: "Binary Search Big-O Analysis",
					content:
						"Compare binary search with linear search and reason about why halving the problem each step leads to `O(log n)` runtime. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ6 Project 3: Precise Square Roots",
					content:
						"Use a binary-search-style approach on a numeric interval to approximate square roots to a chosen precision. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Precision-Square-Root",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Precision-Square-Root"
				}
			],
			supplementalProjects: [
				{
					title: "Binary Search: Extension Challenge",
					content:
						"Extend the work from AJ6 Binary Search with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Iteration",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ6-Binary-Search-with-Iteration"
				},
				{
					title: "Binary Search supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ6 Binary Search. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-09-aj6-binary-search-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-09-aj6-binary-search-supplemental-2/solution"
				},
				{
					title: "Binary Search supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ6 Binary Search. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-10-aj6-binary-search-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-10-aj6-binary-search-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this check-in as a review of recursion, time complexity, and search algorithms. Focus on explaining how each algorithm works and why its runtime behaves the way it does. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1"
				},
				{
					title: "Check-In #1: Recursion",
					content:
						"Review recursive methods, base and recursive cases, the dangers of missing base cases, recursive string length, Pascal's triangle, and tracing recursive output. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Time Complexity",
					content:
						"Practice Big-O notation by simplifying expressions and reasoning about the best and worst cases of different methods. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Linear Search",
					content:
						"Explain when linear search is useful, complete an unfinished implementation, and describe its best and worst case runtime. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Binary Search",
					content:
						"Review both iterative and recursive binary search, finish incomplete implementations, and compare its runtime with linear search. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Compare the real-world speeds of linear search and binary search by timing many runs on a large array with millisecond timestamps. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1-Additional-Practice-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1-Additional-Practice-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					content:
						"Extend the work from Check-In #1 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-1"
				},
				{
					title: "Check In #1 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-11-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-11-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check In #1 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-12-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-12-check-in-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ7 Selection and Insertion Sort",
			curriculum: [
				{
					title: "Selection Sort",
					content:
						"Learn how selection sort repeatedly finds the smallest remaining element and places it into the next sorted position. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ7 Project 1: Selection Sort",
					content:
						"Implement selection sort using two `ArrayList`s and test the algorithm on randomly generated values. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Selection-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Selection-Sort"
				},
				{
					title: "Selection Sort Big-O Analysis",
					content:
						"Analyze selection sort as a quadratic-time algorithm and compare in-place versus out-of-place space usage. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Insertion Sort",
					content:
						"Learn how insertion sort places each new element into the correct spot among the items that are already sorted. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ7 Project 2: Insertion Sort",
					content:
						"Implement insertion sort in-place on an array and compare how it behaves on sorted, reverse-sorted, and random input. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Insertion-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Insertion-Sort"
				},
				{
					title: "Insertion Sort Big-O Analysis",
					content:
						"Compare insertion sort with selection sort, paying attention to why insertion sort performs especially well on nearly sorted data. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "AJ7 Supplemental Project 1: Biggest to Smallest Bookshelf",
					content:
						"Store book page counts in an `ArrayList` and use selection sort to organize them from biggest to smallest. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Biggest-to-Smallest-Bookshelf",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ7-Biggest-to-Smallest-Bookshelf"
				},
				{
					title: "Selection and Insertion Sort supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ7 Selection and Insertion Sort. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-13-aj7-selection-and-insertion-sort-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-13-aj7-selection-and-insertion-sort-supplemental-2/solution"
				},
				{
					title: "Selection and Insertion Sort supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ7 Selection and Insertion Sort. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-14-aj7-selection-and-insertion-sort-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-14-aj7-selection-and-insertion-sort-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ8 Bubble Sort",
			curriculum: [
				{
					title: "Bubble Sort",
					content:
						"Learn how bubble sort repeatedly swaps adjacent values so that large elements bubble toward the end of the list over multiple passes. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ8 Project 1: Bubble Sort Implementation",
					content:
						"Implement bubble sort with nested loops, test it on random data, and improve it by shrinking the inner loop range over time. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Bubble-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Bubble-Sort"
				},
				{
					title: "Bubble Sort Big-O Analysis",
					content:
						"Analyze why bubble sort is also quadratic time, compare it to other simple sorting algorithms, and review how in-place sorting affects space complexity. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ8 Project 2: Alphabetical Order",
					content:
						"Adapt bubble sort to work on `ArrayList<String>` values by using `compareTo()` to sort words alphabetically. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Alphabetical-Order-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Alphabetical-Order"
				}
			],
			supplementalProjects: [
				{
					title: "Bubble Sort: Extension Challenge",
					content:
						"Extend the work from AJ8 Bubble Sort with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Bubble-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ8-Bubble-Sort"
				},
				{
					title: "Bubble Sort supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ8 Bubble Sort. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-15-aj8-bubble-sort-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-15-aj8-bubble-sort-supplemental-2/solution"
				},
				{
					title: "Bubble Sort supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ8 Bubble Sort. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-16-aj8-bubble-sort-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-16-aj8-bubble-sort-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ9 Merge Sort",
			curriculum: [
				{
					title: "Merge Sort",
					content:
						"Learn how merge sort uses recursion to split an array into smaller pieces, sort those pieces, and merge them back together efficiently. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ9 Project 1: Merge Method",
					content:
						"Implement the helper method that merges two sorted lists into one sorted result. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge"
				},
				{
					title: "AJ9 Project 2: Split Method",
					content:
						"Practice recursively splitting an `ArrayList` until all sublists are size 1, building intuition for merge sort's divide-and-conquer structure. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Split",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Split"
				},
				{
					title: "AJ9 Project 3: Merge Sort",
					content:
						"Combine recursive splitting with the merge helper to implement full merge sort on a list of random numbers. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge-Sort",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge-Sort"
				},
				{
					title: "Merge Sort Big-O Analysis",
					content:
						"Analyze merge sort as a `O(n log n)` algorithm, compare it with quadratic-time sorts, and discuss why recursion overhead means it is most useful on sufficiently large lists. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Merge Sort: Extension Challenge",
					content:
						"Extend the work from AJ9 Merge Sort with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ9-Merge"
				},
				{
					title: "Merge Sort supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ9 Merge Sort. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-17-aj9-merge-sort-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-17-aj9-merge-sort-supplemental-2/solution"
				},
				{
					title: "Merge Sort supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ9 Merge Sort. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-18-aj9-merge-sort-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-18-aj9-merge-sort-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"Use this check-in to review the major sorting algorithms in the course and compare how they behave, how they are implemented, and how their runtimes differ. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2"
				},
				{
					title: "Check-In #2: Selection Sort",
					content:
						"Describe selection sort, predict the state of an array after several passes, complete an implementation, and discuss runtime plus in-place versus out-of-place behavior. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Insertion Sort",
					content:
						"Review insertion sort, trace several passes on a given list, complete the algorithm, and compare it with selection sort. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Bubble Sort",
					content:
						"Explain bubble sort, complete an implementation, consider optimizations such as early cutoffs, and compare it with other quadratic-time sorts. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Merge Sort",
					content:
						"Merge sorted sublists by hand, finish an incomplete merge sort implementation, and explain why merge sort's time complexity differs from the other sorting algorithms. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Time multiple sorting algorithms on arrays of different sizes and compare how their observed speeds change as the test scale increases. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2-Additional-Practice-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2-Additional-Practice-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					content:
						"Extend the work from Check-In #2 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-2"
				},
				{
					title: "Check In #2 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-19-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-19-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check In #2 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-20-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-20-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ10 Sustainable Programming",
			curriculum: [
				{
					title: "Nested Classes",
					content:
						"Compare static nested classes and inner classes, and learn when a HAS-A relationship makes nested classes a good fit. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ10 Project 1: Juni Bakery",
					content:
						"Use nested classes to model a bakery, its workers, and its baked goods, then collect input and print the resulting bakery state. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Juni-Bakery-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Juni-Bakery"
				},
				{
					title: "Generics",
					content:
						"Learn how generic type placeholders such as `T` let one class work with many kinds of data without committing to a concrete type in advance. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ10 Project 2: Anything Array",
					content:
						"Create a generic `Node`-style wrapper class, test it with several object types, and store those generic nodes inside an array. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Anything-Array",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Anything-Array"
				},
				{
					title: "Exception Handling",
					content:
						"Review checked versus runtime exceptions, custom exceptions, `try-catch` blocks, and the difference between handling an exception immediately and declaring it with `throws`. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ10 Project 3: Exception Practice",
					content:
						"Handle file, input, null, and arithmetic exceptions, and create a custom `DivideByZeroException` for more precise error reporting. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Exception-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Exception-Practice"
				}
			],
			supplementalProjects: [
				{
					title: "Sustainable Programming: Extension Challenge",
					content:
						"Extend the work from AJ10 Sustainable Programming with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Juni-Bakery-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Juni-Bakery"
				},
				{
					title: "Sustainable Programming supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ10 Sustainable Programming. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-21-aj10-sustainable-programming-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-21-aj10-sustainable-programming-supplemental-2/solution"
				},
				{
					title: "Sustainable Programming supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ10 Sustainable Programming. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-22-aj10-sustainable-programming-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-22-aj10-sustainable-programming-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ11 Linked Lists",
			curriculum: [
				{
					title: "Introduction to Linked Lists",
					content:
						"Compare linked lists with arrays and `ArrayList`s, focusing on how nodes and references make insertion and deletion easier at the cost of direct indexing. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Singly Linked Lists",
					content:
						"Review heads, nodes, links, and one-directional traversal in a singly linked list. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ11 Project 1: Singly Linked List",
					content:
						"Implement a singly linked list from starter code, write its inner `Node` class, and build out the methods defined in the interface. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Linked-List-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Linked-List"
				},
				{
					title: "Doubly Linked Lists",
					content:
						"Compare doubly linked lists with singly linked lists, focusing on head and tail references plus links in both directions. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ11 Project 2: Doubly Linked List",
					content:
						"Extend the linked list implementation to support both next and previous links, a tail reference, and more efficient inserts and deletions. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Doubly-Linked-List-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Doubly-Linked-List"
				}
			],
			supplementalProjects: [
				{
					title: "Linked Lists: Extension Challenge",
					content:
						"Extend the work from AJ11 Linked Lists with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Linked-List-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ11-Linked-List"
				},
				{
					title: "Linked Lists supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ11 Linked Lists. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-23-aj11-linked-lists-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-23-aj11-linked-lists-supplemental-2/solution"
				},
				{
					title: "Linked Lists supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ11 Linked Lists. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-24-aj11-linked-lists-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-24-aj11-linked-lists-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ12 Stacks and Queues",
			curriculum: [
				{
					title: "Stacks",
					content:
						"Learn how stacks use Last In First Out behavior and support operations such as `push`, `pop`, `top`, and `empty`. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ12 Project 1: Implementing a Stack",
					content:
						"Implement a stack with array storage, a top pointer, and checks for overflow and underflow. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Stack-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Stack"
				},
				{
					title: "Queues",
					content:
						"Learn how queues use First In First Out behavior and support `enqueue`, `dequeue`, `front`, and `empty`. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ12 Project 2: Implementing a Queue",
					content:
						"Implement a queue using an array with wrapping indices so that the structure behaves like a circular buffer. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Queue-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Queue"
				}
			],
			supplementalProjects: [
				{
					title: "AJ12 Supplemental Project 1: Valid Parentheses",
					content:
						"Use a stack to determine whether parentheses, brackets, and braces are balanced and properly nested. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Valid-Parentheses",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Valid-Parentheses"
				},
				{
					title: "AJ12 Supplemental Project 2: Calculator with Stacks",
					content:
						"Build a stack-based calculator that treats operators as commands acting on the most recently entered numbers. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Calculator-with-Stacks",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Calculator-with-Stacks"
				},
				{
					title: "AJ12 Supplemental Project 3: Implementing a Deque",
					content:
						"Extend queue ideas into a double-ended queue implemented with a circular array. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Deque-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ12-Deque"
				}
			]
		},
		{
			title: "AJ13 Priority Queues and Maps",
			curriculum: [
				{
					title: "Priority Queues",
					content:
						"Learn how priority queues differ from regular queues by removing highest-priority items first rather than strictly honoring insertion order. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Using a Java Priority Queue",
					content:
						"Practice the Java `PriorityQueue` API, including adding, peeking, polling, removing, iterating, checking membership, and converting the queue into an array. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Priority-Queue"
				},
				{
					title: "AJ13 Project 1: Class Rank",
					content:
						"Create a `Student` class and a comparator that orders students by GPA, then use a priority queue to print students from highest GPA to lowest. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Class-Rank",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Class-Rank"
				},
				{
					title: "Maps",
					content:
						"Review key-value storage with maps, compare ordered and unordered implementations, and practice the core operations for insertion, retrieval, updates, and iteration. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Using a Java Map",
					content:
						"Practice the Java `Map` API with `HashMap` and `TreeMap`, including creation, insertion, lookup, removal, and iteration through keys and values. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Maps"
				},
				{
					title: "AJ13 Project 2: Letter Frequencies",
					content:
						"Read a sentence from the user, build a frequency map of its letters, print the map contents, and identify the most frequent character. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Letter-Frequencies",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ13-Letter-Frequencies"
				}
			],
			supplementalProjects: [
				{
					title: "Priority Queues and Maps: Extension Challenge",
					content:
						"Extend the work from AJ13 Priority Queues and Maps with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main/AM13-Priority-Queue"
				},
				{
					title: "Priority Queues and Maps supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ13 Priority Queues and Maps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-25-aj13-priority-queues-and-maps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-25-aj13-priority-queues-and-maps-supplemental-2/solution"
				},
				{
					title: "Priority Queues and Maps supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ13 Priority Queues and Maps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-26-aj13-priority-queues-and-maps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-26-aj13-priority-queues-and-maps-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #3",
			curriculum: [
				{
					title: "Check-In #3 Overview",
					content:
						"Use this check-in to revisit sustainable programming ideas, linked lists, stacks, queues, priority queues, and maps through a mix of short explanations and code extensions. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3"
				},
				{
					title: "Check-In #3: Sustainable Programming",
					content:
						"Review nested classes, generics, and exception handling by building a nested `Riddle` class, a generic `Triple` class, and custom exception logic. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #3: Linked Lists",
					content:
						"Compare singly and doubly linked lists, complete `Node` class structures, add methods such as `indexOf()` and `remove()`, and test those methods on real lists. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #3: Stacks",
					content:
						"Review stack operations, LIFO behavior, and how stacks can process edit-style input such as backspaces in a stream of key presses. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #3: Queues",
					content:
						"Review queue operations, FIFO behavior, the idea of a priority queue, and examples where queue-based processing is useful. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #3: Maps",
					content:
						"Review map creation, iteration, membership checks, duplicate-key behavior, and practical use cases for key-value storage. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #3: Additional Practice Project",
					content:
						"Take a queue of names, reverse it with a stack, then sort it alphabetically with a priority queue, printing the queue after each transformation. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3-Additional-Practice-Project-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3-Additional-Practice-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #3: Extension Challenge",
					content:
						"Extend the work from Check-In #3 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3"
				},
				{
					title: "Check In #3 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #3. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-27-check-in-3-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-27-check-in-3-supplemental-2/solution"
				},
				{
					title: "Check In #3 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #3. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-28-check-in-3-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-28-check-in-3-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ14 Binary Search Trees",
			curriculum: [
				{
					title: "Trees",
					content:
						"Learn the core vocabulary of trees, including nodes, edges, parents, children, ancestors, descendants, leaves, roots, height, and subtrees. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Binary Search Trees",
					content:
						"Review how BSTs organize values so smaller items go left and larger items go right, enabling efficient search, insert, and remove operations. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "BST Practice Problems",
					content:
						"Practice inserting and deleting nodes from drawn binary search trees and reason through in-order predecessor replacement. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ14 Project 1: BST Basic Implementation",
					content:
						"Write the `Node` inner class, core BST instance variables, and basic methods such as insert and membership testing. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-Basic-BST"
				},
				{
					title: "Depth First Search",
					content:
						"Use depth-first traversal to print a BST in preorder, inorder, and postorder, and understand how each traversal changes only the print order, not the path taken through the tree. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ14 Project 2: BST Traversals",
					content:
						"Implement preorder, inorder, and postorder traversals and use inorder traversal to define `toString()`. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST-Traversals",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST-Traversals"
				},
				{
					title: "AJ14 Project 3: BST Clear and Remove",
					content:
						"Add recursive clear and remove operations to the BST, including removal cases for nodes with zero, one, or two children. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST"
				}
			],
			supplementalProjects: [
				{
					title: "Binary Search Trees: Extension Challenge",
					content:
						"Extend the work from AJ14 Binary Search Trees with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-BST-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ14-Basic-BST"
				},
				{
					title: "Binary Search Trees supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ14 Binary Search Trees. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-29-aj14-binary-search-trees-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-29-aj14-binary-search-trees-supplemental-2/solution"
				},
				{
					title: "Binary Search Trees supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ14 Binary Search Trees. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-30-aj14-binary-search-trees-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-30-aj14-binary-search-trees-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ15 Hash Tables",
			curriculum: [
				{
					title: "Hash Tables",
					content:
						"Learn how hash tables implement maps by storing key-value pairs in buckets chosen by hash functions, ideally enabling near-constant-time lookup. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Writing a Hash Function",
					content:
						"Review the properties of good hash functions, polynomial combinations, and how modulo compression maps a hash code into the table's bounds. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Dealing with Collisions",
					content:
						"Compare separate chaining with open addressing, and focus on linear probing plus tombstones as the strategy used in this course. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Rehashing",
					content:
						"Track load factor and resize the table when it becomes too full by rehashing items into a larger prime-sized array. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ15 Project 1: HashMap",
					content:
						"Implement a custom `HashMap` with linear probing, tombstones, rehashing, and the usual map operations. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Hash-Map-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Hash-Map"
				},
				{
					title: "AJ15 Project 2: Juni Search Engine",
					content:
						"Use the custom `HashMap`, file reading, and string splitting to build a simple keyword search engine over a text corpus of URLs and tags. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Search-Engine-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Search-Engine"
				}
			],
			supplementalProjects: [
				{
					title: "Hash Tables: Extension Challenge",
					content:
						"Extend the work from AJ15 Hash Tables with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Hash-Map-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Hash-Map"
				},
				{
					title: "Hash Tables supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ15 Hash Tables. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-31-aj15-hash-tables-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-31-aj15-hash-tables-supplemental-2/solution"
				},
				{
					title: "Hash Tables supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ15 Hash Tables. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-32-aj15-hash-tables-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-32-aj15-hash-tables-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ16 Graphs",
			curriculum: [
				{
					title: "Graphs",
					content:
						"Learn how graphs use vertices and edges to represent relationships, and compare directed, undirected, weighted, and tree-like graph structures. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Representing a Graph",
					content:
						"Compare adjacency lists, adjacency matrices, and incidence lists, and discuss when each representation is most useful. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ16 Project 1: Basic Graph Implementation",
					content:
						"Implement a graph with a `HashMap` of adjacency lists, add vertices and edges, and test the result through a `toString()` method and a simple main program. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Simple-Graph-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Simple-Graph"
				},
				{
					title: "Dijkstra's Shortest Path Algorithm",
					content:
						"Learn how Dijkstra's algorithm uses distances, visited vertices, and a priority queue to find shortest paths in weighted graphs with positive edge weights. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ16 Project 2: Dijkstra's Shortest Path",
					content:
						"Use a completed `Vertex` class, an adjacency matrix, and a priority queue to compute shortest paths and reconstruct the shortest path tree. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Dijkstras-Shortest-Path-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Dijkstras-Shortest-Path"
				}
			],
			supplementalProjects: [
				{
					title: "AJ16 Supplemental Project 1: Eulerian Mail Circuit",
					content:
						"Use graph traversal and vertex degree analysis to determine whether a graph has a Eulerian path, a Eulerian cycle, or neither. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Eulerian-Mail-Circuit",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ16-Eulerian-Mail-Circuit"
				},
				{
					title: "Graphs supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ16 Graphs. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-33-aj16-graphs-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-33-aj16-graphs-supplemental-2/solution"
				},
				{
					title: "Graphs supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ16 Graphs. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-34-aj16-graphs-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-34-aj16-graphs-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #4",
			curriculum: [
				{
					title: "Check-In #4 Overview",
					content:
						"Use this final check-in to review binary search trees, hash tables, and graphs, along with the main vocabulary and algorithm ideas from those topics. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-in-4"
				},
				{
					title: "Check-In #4: Binary Search Trees",
					content:
						"Review BST ordering rules, traversal orders, insertion and deletion practice, and why BSTs are useful for ordered lookup structures. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #4: Hash Tables",
					content:
						"Explain how hash tables work, compute load factors, compare collision-handling strategies, and identify when rehashing is necessary. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #4: Graphs",
					content:
						"Define graphs and graph vocabulary, build adjacency lists and matrices, compare sparse versus dense representations, and describe Dijkstra's algorithm at a high level. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #4: Additional Practice Project",
					content:
						"Extend a BST with a breadth-first search method that prints nodes level by level using a queue. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-4-Additional-Practice-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-4-Additional-Practice-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #4: Extension Challenge",
					content:
						"Extend the work from Check-In #4 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-in-4"
				},
				{
					title: "Check In #4 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #4. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-35-check-in-4-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-35-check-in-4-supplemental-2/solution"
				},
				{
					title: "Check In #4 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #4. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-36-check-in-4-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-36-check-in-4-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ17 Master Project: Google Maps",
			curriculum: [
				{
					title: "Introduction to Street Searcher",
					content:
						"Review a Google-Maps-style shortest path tool that loads locations and distances into a weighted graph and uses Dijkstra's algorithm to find routes. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ17 Project 1: Weighted Graph",
					content:
						"Create a weighted graph implementation that will support the street searcher project. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Weighted-Graph-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Weighted-Graph"
				},
				{
					title: "AJ17 Project 2: Loading Data",
					content:
						"Read location data from files, store locations in a `HashMap`, and connect those locations in the weighted graph using location names as vertices. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Loading-Data-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Loading-Data"
				},
				{
					title: "AJ17 Project 3: Finding Shortest Paths",
					content:
						"Complete the street searcher by running Dijkstra's algorithm on the loaded graph, printing the shortest path, and refining the user interface and error handling. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Street-Searcher",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Street-Searcher"
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including recursion, searching, sorting, OOP review, generics, exceptions, linked lists, stacks, queues, priority queues, maps, trees, hash tables, and graphs."
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Google Maps: Extension Challenge",
					content:
						"Extend the work from AJ17 Master Project: Google Maps with a tighter constraint, one extra feature, or a slightly more realistic input case. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Weighted-Graph-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Weighted-Graph"
				},
				{
					title: "Master Project: Google Maps supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ17 Master Project: Google Maps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-37-aj17-master-project-google-maps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-37-aj17-master-project-google-maps-supplemental-2/solution"
				},
				{
					title: "Master Project: Google Maps supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to AJ17 Master Project: Google Maps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-38-aj17-master-project-google-maps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-38-aj17-master-project-google-maps-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ18 Repo Extension, Starter, and Capstone Library",
			curriculum: [
				{
					title: "Classify the Extra Java Level 3 Folders",
					content:
						"Treat the remaining `Java-Level-3` folders as a mix of starter scaffolds, reference implementations, and optional advanced labs. The public course should surface the useful ones without forcing every starter and check-in into the core path."
				},
				{
					title: "Data-Structures Reinforcement without Clutter",
					content:
						"Use the extra linked-list, stack, queue, hash-table, and graph folders when a student needs more depth on one structure family after the main module is already complete. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Capstone Support Material",
					content:
						"Keep the `AJ17` starters and side folders visible as capstone support, not as hidden repo drift. Students who want to push the Google Maps branch further should be able to find the supporting scaffolds quickly."
				},
				{
					title: "Repo Extension, , and Capstone Library: Verification and Reflection",
					content:
						"Close AJ18 Repo Extension, Starter, and Capstone Library by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "AJ18 Repo Extension, Starter, and Capstone Library: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Exceptions"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: Exceptions Reference Lab",
					content:
						"Use the standalone exceptions folder when the student needs a cleaner error-handling example than the larger bakery or data-structures projects. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Exceptions"
				},
				{
					title: "Extension: Nested Classes",
					content:
						"Use nested classes as an optional design extension for students who want a stronger sense of how helper types can live inside larger structures. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Nested-Classes"
				},
				{
					title: "Reference: Node Class",
					content:
						"Keep the node-class reference visible because it supports the linked-list, tree, and graph sections that arrive later in the course. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Node-Class"
				},
				{
					title: "Extension: Separate Chaining Hash Table",
					content:
						"Use the separate-chaining implementation when students want one more explicit collision-handling model beyond the main hash-map work. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Separate-Chaining-Hash-Table"
				},
				{
					title: "Reference: Open Addressing Hash Tables",
					content:
						"Keep the open-addressing reference alongside separate chaining so students can compare the main collision strategies directly. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ15-Open-Addressing-Reference"
				},
				{
					title: "Extension: Google Maps Showcase",
					content:
						"Use the repo's Google Maps branch as a stronger capstone framing example once the weighted-graph and street-searcher work is complete. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Google-Maps"
				},
				{
					title: "Starter: Street Searcher",
					content:
						"Expose the starter variant so students can re-enter the capstone path from a scaffold instead of only from the finished solution. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Street-Searcher-Starter"
				},
				{
					title: "Starter: Master Project",
					content:
						"Use the final master-project starter when a student wants an additional capstone scaffold beyond the main public sequence. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ17-Master-Project-Starter"
				}
			]
		}
	]
};
