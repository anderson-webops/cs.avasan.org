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
						"Get familiar with the learner portal, custom Java projects, and the structure of a Java program. This module works well as a review resource for variables, strings, input, and commenting before moving into more advanced topics."
				},
				{
					title: "Creating and Running a Java Program",
					content:
						"Review the role of classes, methods, `main()`, console output, and the basic project structure used throughout the course."
				},
				{
					title: "Compilation",
					content:
						"Understand that Java code must be compiled before it runs, both to catch syntax issues and to translate source code into a form the computer can execute."
				},
				{
					title: "Variables, Primitive Data Types, and Strings",
					content:
						"Review variables, primitive data types such as `int`, `boolean`, and `double`, and object references such as `String`. Practice declaring, assigning, concatenating, indexing with `charAt()`, and measuring string length."
				},
				{
					title: "Input, Output, and Commenting",
					content:
						"Use `Scanner` to read console input, compare `System.out.print()` with `System.out.println()`, and review both single-line and block comments."
				},
				{
					title: "AJ1 Project 1: Mad Libs",
					content:
						"Ask the user for several words, store them in descriptive variables, and build a Mad Lib story by concatenating the inputs together.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ1-Mad-Lib?skipMigration=1"
				},
				{
					title: "AJ1 Project 2: Chatbot",
					content:
						"Create a simple chatbot that asks several questions, stores each response, and replies based on the answers.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ1-Chatbot?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ2 Review: Arrays and ArrayLists",
			curriculum: [
				{
					title: "Review Focus",
					content:
						"Use this module as a review resource for one-dimensional arrays, two-dimensional arrays, and `ArrayList`s before the course moves into more advanced data structures."
				},
				{
					title: "Arrays",
					content:
						"Review how arrays store ordered elements of one type, how indexing works, how to get the length, and how to print an array by iterating through it."
				},
				{
					title: "AJ2 Project 1: Array Practice",
					content:
						"Write methods that double array values, sum even numbers, generate arrays of random doubles, and total the lengths of words in an array.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ2-Array-Practice?skipMigration=1"
				},
				{
					title: "Two-Dimensional Arrays",
					content:
						"Review how 2D arrays represent grids, how to access rows and columns, and how nested loops traverse every element."
				},
				{
					title: "AJ2 Project 2: Two-Dimensional Array Practice",
					content:
						"Create and fill square grids, find maximum values, generate random matrices, and search 2D arrays for a target value.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ2-Two-Dimensional-Array-Practice?skipMigration=1"
				},
				{
					title: "ArrayLists",
					content:
						"Compare arrays with `ArrayList`s, then review `add()`, `get()`, `set()`, and `remove()` for dynamic collections."
				},
				{
					title: "Primitive Wrapper Objects",
					content:
						"Review how wrapper types such as `Integer` and `Double` allow primitive values to be stored inside `ArrayList`s through auto-boxing and unboxing."
				},
				{
					title: "AJ2 Project 3: ArrayList Practice",
					content:
						"Write methods that filter even numbers, test whether two values sum to zero, remove the smallest value, and append a total sum to an `ArrayList`.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ2-ArrayList-Practice?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "AJ2 Supplemental Project 1: Test Scores",
					content:
						"Store a set of test scores in an array, compute the average, and convert it into a letter grade.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ2-Test-Scores?skipMigration=1"
				},
				{
					title: "AJ2 Supplemental Project 2: Matrix Addition",
					content:
						"Read in two matrices of matching dimensions, add them entry by entry, and print the result.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ2-Matrix-Addition?skipMigration=1"
				},
				{
					title: "AJ2 Supplemental Project 3: Sandwich Orders",
					content:
						"Build an ingredient list with an `ArrayList`, collect a sandwich order, and convert it into an abbreviated string representation.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ2-Sandwich-Orders?skipMigration=1"
				}
			]
		},
		{
			title: "AJ3 Review: Objects and Classes",
			curriculum: [
				{
					title: "Object-Oriented Programming",
					content:
						"Review classes, objects, instance variables, methods, constructors, and the overall purpose of object-oriented programming in Java."
				},
				{
					title: "Public and Private Instance Variables",
					content:
						"Compare public and private variables, discuss encapsulation, and review why most instance data should stay private behind methods."
				},
				{
					title: "Constructors",
					content:
						"Review default constructors and overloaded constructors, then instantiate objects using different constructor signatures."
				},
				{
					title: "Class Methods",
					content:
						"Use getters, setters, and `toString()` to expose and update object state in a controlled way."
				},
				{
					title: "AJ3 Project 1: Student Class",
					content:
						"Create a `Student` class with private fields, constructors, getters, setters, and a coherent `toString()` method.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ3-Student-Class?skipMigration=1"
				},
				{
					title: "Static Variables and Methods",
					content:
						"Use a static variable such as `numStudents` to track a class-wide total and access it through a static getter."
				},
				{
					title: "Inheritance and Subclasses",
					content:
						"Review how subclasses extend superclasses, inherit public behavior, and use `super()` to reuse parent constructors."
				},
				{
					title: "AJ3 Project 2: BakedGood Class",
					content:
						"Create a `BakedGood` class and use it as a base for later work with inheritance, abstract classes, interfaces, and enums.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ3-Baked-Good?skipMigration=1"
				},
				{
					title: "Abstract Classes and Methods",
					content:
						"Make `BakedGood` abstract, add an abstract pricing method, and create a `Bread` subclass that provides a concrete implementation."
				},
				{
					title: "Interfaces",
					content:
						"Create and implement an interface such as `ForSale`, then use `Comparable` to compare baked goods by ingredient count."
				},
				{
					title: "Enums",
					content:
						"Use enums to restrict possible values such as loaf sizes and update constructors and instance variables to use those enum types."
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ4 Recursion",
			curriculum: [
				{
					title: "Recursion",
					content:
						"Learn how recursive methods solve problems by reducing them to smaller subproblems, and review the roles of the base case and recursive case."
				},
				{
					title: "Sum of the First N Numbers",
					content:
						"Trace a recursive example for summing the first `n` numbers and compare the recursive solution with an iterative one."
				},
				{
					title: "Call Stack",
					content:
						"Review how recursive calls build up on the call stack, why stack overflow happens, and why recursive overhead sometimes makes iterative solutions faster."
				},
				{
					title: "AJ4 Project 1: Recursion Practice",
					content:
						"Write recursive methods for exponents, factorials, digit sums, Fibonacci numbers, and palindrome checking.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ4-Recursion-Practice?skipMigration=1"
				},
				{
					title: "AJ4 Project 2: Divisible by 7",
					content:
						"Use a recursive divisibility rule to determine whether a number is divisible by 7, breaking it into smaller subproblems each step.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ4-Divisible-by-7?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ5 Linear Search and Big-O Notation",
			curriculum: [
				{
					title: "Linear Search",
					content:
						"Learn how linear search checks items one by one in order until the target is found or the collection ends."
				},
				{
					title: "AJ5 Project 1: Linear Search Implementation",
					content:
						"Write a method that searches an array for a target and returns its index or `-1` if it is not found.",
					solutionLink:
						"https://repl.it/@JuniLearning/Linear-Search?skipMigration=1"
				},
				{
					title: "Introduction to Big-O Analysis",
					content:
						"Use Big-O notation to estimate runtime growth based on input size, focusing on worst-case behavior and dominant terms."
				},
				{
					title: "AJ5 Project 2: Big-O Practice",
					content:
						"Determine the Big-O of several mathematical runtime expressions and connect those expressions to algorithm behavior.",
					projectLink:
						"https://repl.it/@JuniLearning/BigO-Practice-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/BigO-Practice?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ6 Binary Search",
			curriculum: [
				{
					title: "Binary Search",
					content:
						"Learn how binary search repeatedly narrows a sorted array by comparing the target to the middle element and discarding half the search space each time."
				},
				{
					title: "AJ6 Project 1: Binary Search with Iteration",
					content:
						"Implement binary search iteratively using lower and upper bounds plus a loop that updates the midpoint after every comparison.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ6-Binary-Search-with-Iteration?skipMigration=1"
				},
				{
					title: "AJ6 Project 2: Binary Search with Recursion",
					content:
						"Implement binary search recursively, either by passing bounds into each call or by splitting the array into subarrays.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ6-Binary-Search-with-Recursion?skipMigration=1"
				},
				{
					title: "Binary Search Big-O Analysis",
					content:
						"Compare binary search with linear search and reason about why halving the problem each step leads to `O(log n)` runtime."
				},
				{
					title: "AJ6 Project 3: Precise Square Roots",
					content:
						"Use a binary-search-style approach on a numeric interval to approximate square roots to a chosen precision.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ6-Precision-Square-Root?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ7 Selection and Insertion Sort",
			curriculum: [
				{
					title: "Selection Sort",
					content:
						"Learn how selection sort repeatedly finds the smallest remaining element and places it into the next sorted position."
				},
				{
					title: "AJ7 Project 1: Selection Sort",
					content:
						"Implement selection sort using two `ArrayList`s and test the algorithm on randomly generated values.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ7-Selection-Sort?skipMigration=1"
				},
				{
					title: "Selection Sort Big-O Analysis",
					content:
						"Analyze selection sort as a quadratic-time algorithm and compare in-place versus out-of-place space usage."
				},
				{
					title: "Insertion Sort",
					content:
						"Learn how insertion sort places each new element into the correct spot among the items that are already sorted."
				},
				{
					title: "AJ7 Project 2: Insertion Sort",
					content:
						"Implement insertion sort in-place on an array and compare how it behaves on sorted, reverse-sorted, and random input.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ7-Insertion-Sort?skipMigration=1"
				},
				{
					title: "Insertion Sort Big-O Analysis",
					content:
						"Compare insertion sort with selection sort, paying attention to why insertion sort performs especially well on nearly sorted data."
				}
			],
			supplementalProjects: [
				{
					title: "AJ7 Supplemental Project 1: Biggest to Smallest Bookshelf",
					content:
						"Store book page counts in an `ArrayList` and use selection sort to organize them from biggest to smallest.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ7-Biggest-to-Smallest-Bookshelf?skipMigration=1"
				}
			]
		},
		{
			title: "AJ8 Bubble Sort",
			curriculum: [
				{
					title: "Bubble Sort",
					content:
						"Learn how bubble sort repeatedly swaps adjacent values so that large elements bubble toward the end of the list over multiple passes."
				},
				{
					title: "AJ8 Project 1: Bubble Sort Implementation",
					content:
						"Implement bubble sort with nested loops, test it on random data, and improve it by shrinking the inner loop range over time.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ8-Bubble-Sort"
				},
				{
					title: "Bubble Sort Big-O Analysis",
					content:
						"Analyze why bubble sort is also quadratic time, compare it to other simple sorting algorithms, and review how in-place sorting affects space complexity."
				},
				{
					title: "AJ8 Project 2: Alphabetical Order",
					content:
						"Adapt bubble sort to work on `ArrayList<String>` values by using `compareTo()` to sort words alphabetically.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ8-Alphabetical-Order-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ8-Alphabetical-Order?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ9 Merge Sort",
			curriculum: [
				{
					title: "Merge Sort",
					content:
						"Learn how merge sort uses recursion to split an array into smaller pieces, sort those pieces, and merge them back together efficiently."
				},
				{
					title: "AJ9 Project 1: Merge Method",
					content:
						"Implement the helper method that merges two sorted lists into one sorted result.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ9-Merge?skipMigration=1"
				},
				{
					title: "AJ9 Project 2: Split Method",
					content:
						"Practice recursively splitting an `ArrayList` until all sublists are size 1, building intuition for merge sort's divide-and-conquer structure.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ9-Split?skipMigration=1"
				},
				{
					title: "AJ9 Project 3: Merge Sort",
					content:
						"Combine recursive splitting with the merge helper to implement full merge sort on a list of random numbers.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ9-Merge-Sort?skipMigration=1"
				},
				{
					title: "Merge Sort Big-O Analysis",
					content:
						"Analyze merge sort as a `O(n log n)` algorithm, compare it with quadratic-time sorts, and discuss why recursion overhead means it is most useful on sufficiently large lists."
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ10 Sustainable Programming",
			curriculum: [
				{
					title: "Nested Classes",
					content:
						"Compare static nested classes and inner classes, and learn when a HAS-A relationship makes nested classes a good fit."
				},
				{
					title: "AJ10 Project 1: Juni Bakery",
					content:
						"Use nested classes to model a bakery, its workers, and its baked goods, then collect input and print the resulting bakery state.",
					projectLink:
						"https://replit.com/@JuniLearning/AJ10-Juni-Bakery-Starter?skipMigration=1",
					solutionLink:
						"https://replit.com/@JuniLearning/AJ10-Juni-Bakery?skipMigration=1"
				},
				{
					title: "Generics",
					content:
						"Learn how generic type placeholders such as `T` let one class work with many kinds of data without committing to a concrete type in advance."
				},
				{
					title: "AJ10 Project 2: Anything Array",
					content:
						"Create a generic `Node`-style wrapper class, test it with several object types, and store those generic nodes inside an array.",
					solutionLink:
						"https://replit.com/@JuniLearning/AJ10-Anything-Array?skipMigration=1"
				},
				{
					title: "Exception Handling",
					content:
						"Review checked versus runtime exceptions, custom exceptions, `try-catch` blocks, and the difference between handling an exception immediately and declaring it with `throws`."
				},
				{
					title: "AJ10 Project 3: Exception Practice",
					content:
						"Handle file, input, null, and arithmetic exceptions, and create a custom `DivideByZeroException` for more precise error reporting.",
					projectLink:
						"https://replit.com/@JuniLearning/AJ10-Exception-Practice-Starter?skipMigration=1",
					solutionLink:
						"https://replit.com/@JuniLearning/AJ10-Exception-Practice?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ11 Linked Lists",
			curriculum: [
				{
					title: "Introduction to Linked Lists",
					content:
						"Compare linked lists with arrays and `ArrayList`s, focusing on how nodes and references make insertion and deletion easier at the cost of direct indexing."
				},
				{
					title: "Singly Linked Lists",
					content:
						"Review heads, nodes, links, and one-directional traversal in a singly linked list."
				},
				{
					title: "AJ11 Project 1: Singly Linked List",
					content:
						"Implement a singly linked list from starter code, write its inner `Node` class, and build out the methods defined in the interface.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ11-Linked-List-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ11-Linked-List?skipMigration=1"
				},
				{
					title: "Doubly Linked Lists",
					content:
						"Compare doubly linked lists with singly linked lists, focusing on head and tail references plus links in both directions."
				},
				{
					title: "AJ11 Project 2: Doubly Linked List",
					content:
						"Extend the linked list implementation to support both next and previous links, a tail reference, and more efficient inserts and deletions.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ11-Doubly-Linked-List-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ11-Doubly-Linked-List?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ12 Stacks and Queues",
			curriculum: [
				{
					title: "Stacks",
					content:
						"Learn how stacks use Last In First Out behavior and support operations such as `push`, `pop`, `top`, and `empty`."
				},
				{
					title: "AJ12 Project 1: Implementing a Stack",
					content:
						"Implement a stack with array storage, a top pointer, and checks for overflow and underflow.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ12-Stack-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ12-Stack?skipMigration=1"
				},
				{
					title: "Queues",
					content:
						"Learn how queues use First In First Out behavior and support `enqueue`, `dequeue`, `front`, and `empty`."
				},
				{
					title: "AJ12 Project 2: Implementing a Queue",
					content:
						"Implement a queue using an array with wrapping indices so that the structure behaves like a circular buffer.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ12-Queue-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ12-Queue?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "AJ12 Supplemental Project 1: Valid Parentheses",
					content:
						"Use a stack to determine whether parentheses, brackets, and braces are balanced and properly nested.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ12-Valid-Parentheses?skipMigration=1"
				},
				{
					title: "AJ12 Supplemental Project 2: Calculator with Stacks",
					content:
						"Build a stack-based calculator that treats operators as commands acting on the most recently entered numbers.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ12-Calculator-with-Stacks?skipMigration=1"
				},
				{
					title: "AJ12 Supplemental Project 3: Implementing a Deque",
					content:
						"Extend queue ideas into a double-ended queue implemented with a circular array.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ12-Deque-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ12-Deque?skipMigration=1"
				}
			]
		},
		{
			title: "AJ13 Priority Queues and Maps",
			curriculum: [
				{
					title: "Priority Queues",
					content:
						"Learn how priority queues differ from regular queues by removing highest-priority items first rather than strictly honoring insertion order."
				},
				{
					title: "Using a Java Priority Queue",
					content:
						"Practice the Java `PriorityQueue` API, including adding, peeking, polling, removing, iterating, checking membership, and converting the queue into an array.",
					projectLink:
						"https://repl.it/@JuniLearning/AM13-Priority-Queue"
				},
				{
					title: "AJ13 Project 1: Class Rank",
					content:
						"Create a `Student` class and a comparator that orders students by GPA, then use a priority queue to print students from highest GPA to lowest.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ13-Class-Rank?skipMigration=1"
				},
				{
					title: "Maps",
					content:
						"Review key-value storage with maps, compare ordered and unordered implementations, and practice the core operations for insertion, retrieval, updates, and iteration."
				},
				{
					title: "Using a Java Map",
					content:
						"Practice the Java `Map` API with `HashMap` and `TreeMap`, including creation, insertion, lookup, removal, and iteration through keys and values.",
					projectLink: "https://repl.it/@JuniLearning/AJ13-Maps"
				},
				{
					title: "AJ13 Project 2: Letter Frequencies",
					content:
						"Read a sentence from the user, build a frequency map of its letters, print the map contents, and identify the most frequent character.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ13-Letter-Frequencies?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ14 Binary Search Trees",
			curriculum: [
				{
					title: "Trees",
					content:
						"Learn the core vocabulary of trees, including nodes, edges, parents, children, ancestors, descendants, leaves, roots, height, and subtrees."
				},
				{
					title: "Binary Search Trees",
					content:
						"Review how BSTs organize values so smaller items go left and larger items go right, enabling efficient search, insert, and remove operations."
				},
				{
					title: "BST Practice Problems",
					content:
						"Practice inserting and deleting nodes from drawn binary search trees and reason through in-order predecessor replacement."
				},
				{
					title: "AJ14 Project 1: BST Basic Implementation",
					content:
						"Write the `Node` inner class, core BST instance variables, and basic methods such as insert and membership testing.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ14-BST-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ14-Basic-BST?skipMigration=1"
				},
				{
					title: "Depth First Search",
					content:
						"Use depth-first traversal to print a BST in preorder, inorder, and postorder, and understand how each traversal changes only the print order, not the path taken through the tree."
				},
				{
					title: "AJ14 Project 2: BST Traversals",
					content:
						"Implement preorder, inorder, and postorder traversals and use inorder traversal to define `toString()`.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ14-BST-Traversals?skipMigration=1"
				},
				{
					title: "AJ14 Project 3: BST Clear and Remove",
					content:
						"Add recursive clear and remove operations to the BST, including removal cases for nodes with zero, one, or two children.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ14-BST?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ15 Hash Tables",
			curriculum: [
				{
					title: "Hash Tables",
					content:
						"Learn how hash tables implement maps by storing key-value pairs in buckets chosen by hash functions, ideally enabling near-constant-time lookup."
				},
				{
					title: "Writing a Hash Function",
					content:
						"Review the properties of good hash functions, polynomial combinations, and how modulo compression maps a hash code into the table's bounds."
				},
				{
					title: "Dealing with Collisions",
					content:
						"Compare separate chaining with open addressing, and focus on linear probing plus tombstones as the strategy used in this course."
				},
				{
					title: "Rehashing",
					content:
						"Track load factor and resize the table when it becomes too full by rehashing items into a larger prime-sized array."
				},
				{
					title: "AJ15 Project 1: HashMap",
					content:
						"Implement a custom `HashMap` with linear probing, tombstones, rehashing, and the usual map operations.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ15-HashMap-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ15-HashMap?skipMigration=1"
				},
				{
					title: "AJ15 Project 2: Juni Search Engine",
					content:
						"Use the custom `HashMap`, file reading, and string splitting to build a simple keyword search engine over a text corpus of URLs and tags.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ15-Search-Engine-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ15-Search-Engine?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AJ16 Graphs",
			curriculum: [
				{
					title: "Graphs",
					content:
						"Learn how graphs use vertices and edges to represent relationships, and compare directed, undirected, weighted, and tree-like graph structures."
				},
				{
					title: "Representing a Graph",
					content:
						"Compare adjacency lists, adjacency matrices, and incidence lists, and discuss when each representation is most useful."
				},
				{
					title: "AJ16 Project 1: Basic Graph Implementation",
					content:
						"Implement a graph with a `HashMap` of adjacency lists, add vertices and edges, and test the result through a `toString()` method and a simple main program.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ16-Simple-Graph-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ16-Simple-Graph?skipMigration=1"
				},
				{
					title: "Dijkstra's Shortest Path Algorithm",
					content:
						"Learn how Dijkstra's algorithm uses distances, visited vertices, and a priority queue to find shortest paths in weighted graphs with positive edge weights."
				},
				{
					title: "AJ16 Project 2: Dijkstra's Shortest Path",
					content:
						"Use a completed `Vertex` class, an adjacency matrix, and a priority queue to compute shortest paths and reconstruct the shortest path tree.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ16-Dijkstras-Shortest-Path-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ16-Dijkstras-Shortest-Path?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "AJ16 Supplemental Project 1: Eulerian Mail Circuit",
					content:
						"Use graph traversal and vertex degree analysis to determine whether a graph has a Eulerian path, a Eulerian cycle, or neither.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ16-Eulerian-Mail-Circuit?skipMigration=1"
				}
			]
		},
		{
			title: "AJ17 Master Project: Google Maps",
			curriculum: [
				{
					title: "Introduction to Street Searcher",
					content:
						"Review a Google-Maps-style shortest path tool that loads locations and distances into a weighted graph and uses Dijkstra's algorithm to find routes."
				},
				{
					title: "AJ17 Project 1: Weighted Graph",
					content:
						"Create a weighted graph implementation that will support the street searcher project.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ17-Weighted-Graph-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ17-Weighted-Graph?skipMigration=1"
				},
				{
					title: "AJ17 Project 2: Loading Data",
					content:
						"Read location data from files, store locations in a `HashMap`, and connect those locations in the weighted graph using location names as vertices.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ17-Loading-Data-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ17-Loading-Data?skipMigration=1"
				},
				{
					title: "AJ17 Project 3: Finding Shortest Paths",
					content:
						"Complete the street searcher by running Dijkstra's algorithm on the loaded graph, printing the shortest path, and refining the user interface and error handling.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ17-Street-Searcher?skipMigration=1"
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including recursion, searching, sorting, OOP review, generics, exceptions, linked lists, stacks, queues, priority queues, maps, trees, hash tables, and graphs."
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-in #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this check-in as a review of recursion, time complexity, and search algorithms. Focus on explaining how each algorithm works and why its runtime behaves the way it does.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-1-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-1?skipMigration=1"
				},
				{
					title: "Check-In #1: Recursion",
					content:
						"Review recursive methods, base and recursive cases, the dangers of missing base cases, recursive string length, Pascal's triangle, and tracing recursive output."
				},
				{
					title: "Check-In #1: Time Complexity",
					content:
						"Practice Big-O notation by simplifying expressions and reasoning about the best and worst cases of different methods."
				},
				{
					title: "Check-In #1: Linear Search",
					content:
						"Explain when linear search is useful, complete an unfinished implementation, and describe its best and worst case runtime."
				},
				{
					title: "Check-In #1: Binary Search",
					content:
						"Review both iterative and recursive binary search, finish incomplete implementations, and compare its runtime with linear search."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Compare the real-world speeds of linear search and binary search by timing many runs on a large array with millisecond timestamps.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-1-Additional-Practice-Project?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-in #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"Use this check-in to review the major sorting algorithms in the course and compare how they behave, how they are implemented, and how their runtimes differ.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-2-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-2?skipMigration=1"
				},
				{
					title: "Check-In #2: Selection Sort",
					content:
						"Describe selection sort, predict the state of an array after several passes, complete an implementation, and discuss runtime plus in-place versus out-of-place behavior."
				},
				{
					title: "Check-In #2: Insertion Sort",
					content:
						"Review insertion sort, trace several passes on a given list, complete the algorithm, and compare it with selection sort."
				},
				{
					title: "Check-In #2: Bubble Sort",
					content:
						"Explain bubble sort, complete an implementation, consider optimizations such as early cutoffs, and compare it with other quadratic-time sorts."
				},
				{
					title: "Check-In #2: Merge Sort",
					content:
						"Merge sorted sublists by hand, finish an incomplete merge sort implementation, and explain why merge sort's time complexity differs from the other sorting algorithms."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Time multiple sorting algorithms on arrays of different sizes and compare how their observed speeds change as the test scale increases.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-2-Additional-Practice-Project?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-in #3",
			curriculum: [
				{
					title: "Check-In #3 Overview",
					content:
						"Use this check-in to revisit sustainable programming ideas, linked lists, stacks, queues, priority queues, and maps through a mix of short explanations and code extensions.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-3?skipMigration=1"
				},
				{
					title: "Check-In #3: Sustainable Programming",
					content:
						"Review nested classes, generics, and exception handling by building a nested `Riddle` class, a generic `Triple` class, and custom exception logic."
				},
				{
					title: "Check-In #3: Linked Lists",
					content:
						"Compare singly and doubly linked lists, complete `Node` class structures, add methods such as `indexOf()` and `remove()`, and test those methods on real lists."
				},
				{
					title: "Check-In #3: Stacks",
					content:
						"Review stack operations, LIFO behavior, and how stacks can process edit-style input such as backspaces in a stream of key presses."
				},
				{
					title: "Check-In #3: Queues",
					content:
						"Review queue operations, FIFO behavior, the idea of a priority queue, and examples where queue-based processing is useful."
				},
				{
					title: "Check-In #3: Maps",
					content:
						"Review map creation, iteration, membership checks, duplicate-key behavior, and practical use cases for key-value storage."
				},
				{
					title: "Check-In #3: Additional Practice Project",
					content:
						"Take a queue of names, reverse it with a stack, then sort it alphabetically with a priority queue, printing the queue after each transformation.",
					projectLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-3-Additional-Practice-Project-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-3-Additional-Practice-Project?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "Check-in #4",
			curriculum: [
				{
					title: "Check-In #4 Overview",
					content:
						"Use this final check-in to review binary search trees, hash tables, and graphs, along with the main vocabulary and algorithm ideas from those topics.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ-Check-in-4-Solution"
				},
				{
					title: "Check-In #4: Binary Search Trees",
					content:
						"Review BST ordering rules, traversal orders, insertion and deletion practice, and why BSTs are useful for ordered lookup structures."
				},
				{
					title: "Check-In #4: Hash Tables",
					content:
						"Explain how hash tables work, compute load factors, compare collision-handling strategies, and identify when rehashing is necessary."
				},
				{
					title: "Check-In #4: Graphs",
					content:
						"Define graphs and graph vocabulary, build adjacency lists and matrices, compare sparse versus dense representations, and describe Dijkstra's algorithm at a high level."
				},
				{
					title: "Check-In #4: Additional Practice Project",
					content:
						"Extend a BST with a breadth-first search method that prints nodes level by level using a queue.",
					solutionLink:
						"https://repl.it/@JuniLearning/AJ-Check-In-4-Additional-Practice-Project?skipMigration=1"
				}
			],
			supplementalProjects: []
		}
	]
};
