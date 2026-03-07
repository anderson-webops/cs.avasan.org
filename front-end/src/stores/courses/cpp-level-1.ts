import type { RawCourse } from "./types";

export const cppLevel1Course: RawCourse = {
	name: "C++ Level 1",
	modules: [
		{
			title: "CPPF1 Variables, Types, and Input/Output",
			curriculum: [
				{
					title: "Creating and Running a C++ Script",
					content:
						'Use an online C++ editor such as repl.it to compile and run code. Create a C++11 file named Objects and Variables and run the starter line `std::cout << "Hello World!\\n"` to print to the console. Show how `std::endl` adds a newline, what happens if it is missing, and that each statement ends with a semicolon.'
				},
				{
					title: "Primitive Types",
					content:
						"Reference: https://repl.it/@JuniLearning/CPPF1-Primitive-Types-and-Strings-Reference?skipMigration=1 Explain fundamental data types: integers, floating point numbers, booleans and characters. Demonstrate declaring variables with and without initial values and initializing several of the same type on one line. Create an integer myAge, a double myRating for a movie rating, and show arithmetic operators including %. Illustrate mod with 10 / 3 = 3 and 10 % 3 = 1. Cast a double to an int when printing. Create a boolean isHot and a char myChar for the first letter of your last name."
				},
				{
					title: "String",
					content:
						"Explain the `std::string` type and add `#include <string>` to use it. Create `myString` with double quotes, print its first letter with indexing, and use `string.length()` to print its length. Concatenate two strings and print the result. Demonstrate `str.insert(i, otherStr)` and `str.insert(i, amt, char)` to insert strings or characters."
				},
				{
					title: "Input and Output",
					content:
						'Reference: https://repl.it/@JuniLearning/CPPF1-Input-and-Output-Reference?skipMigration=1 Explain streams for input and output. Use the insertion operator (`<<`) to print "Enter your name: " to the console. Create a string variable name, use the extraction operator (`>>`) to read the response, and print "Nice to meet you, ___!" with the input inserted. Include `#include <iostream>` at the top. Explain `cin` and `cout`, and note that `<<` and `>>` point to where information is sent.'
				},
				{
					title: "Comments",
					content:
						"Add single-line comments with `//` to describe code. Use multi-line comments `/* ... */` to comment out sections of code and observe that commented code does not run."
				},
				{
					title: "Compilation (Advanced Concept)",
					content:
						"Explain that `std` stands for standard and `::` is the scope resolution operator that identifies where a function comes from. When you click Run, the compiler checks C++ rules, reports errors with line numbers, and then translates code into an object file."
				},
				{
					title: "CPPF1 Project 1: Mad Libs",
					content:
						"Demo the Mad Libs example, then build your own: create several string variables, prompt for inputs with `std::cin`, and use string concatenation or multiple insertion operators to print the final story. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF1-Mad-Libs-Solution"
				},
				{
					title: "CPPF1 Project 2: Chatbot",
					content:
						"Create a chatbot: ask for a name and respond, ask for a sentence and use `str.insert()` to insert **achoo** to make the bot sneeze, convert Fahrenheit to Celsius with float values, and convert a dollar amount to another currency. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF1-Chatbot-Solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF2 Loops and Conditionals",
			curriculum: [
				{
					title: "For Loops",
					content:
						"Explain that a loop repeats code. Show the three parts of a `for` loop: initialization variable, termination condition and increment, separated by semicolons. Practice printing 0–10, 11–20, even numbers from 2 to 10, numbers from 10 to 1, letters of a word forward and backward, the sum of 1 to 100, and the factorial of 10. Discuss ++, --, and compound assignment (+=, -=, *=, /=)."
				},
				{
					title: "While Loops",
					content:
						"Show how a `while` loop repeats until a condition is no longer true. Print numbers 0–9 with `while (x < 10)` and incrementing inside the loop. Redo the for-loop exercises using while loops."
				},
				{
					title: "CPPF2 Project 1: Number Games",
					content:
						"Use both `for` and `while` loops for each part: ask for a number and a larger number and print all numbers between them, ask how many numbers to enter and print their sum, then print the average using double division. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF2-Number-Games?skipMigration=1"
				},
				{
					title: "Conditionals and Logical Operators",
					content:
						"Introduce conditional statements with examples like `if (1+1 == 2)`. Explain comparison operators (==, !=, >, <, >=, <=) and logical operators `&&` (and) and `||` (or). Show `if`, `if-else`, and `if... else if... else` chains and how nested conditionals work."
				},
				{
					title: "CPPF2 Project 2: Rock, Paper, Scissors",
					content:
						"Use conditionals to build Rock, Paper, Scissors. Check each player's choice with nested conditionals to determine the winner. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF2-Rock-Paper-Scissors-Solution"
				},
				{
					title: "CPPF2 Project 3: FizzBuzz",
					content:
						'Print numbers 1 through 50. For multiples of 3 print "Fizz," for multiples of 5 print "Buzz," and for multiples of both print "FizzBuzz." Review the % operator with simple examples. Bonus: allow any two input numbers for a customizable FizzBuzz. Prepare a short presentation to share with friends or family.',
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF2-FizzBuzz-Solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF3 Functions",
			curriculum: [
				{
					title: "Basic Function Structure in C++",
					content:
						"Explain that functions run specific code repeatedly without rewriting it. Show syntax with return type, name and parameters, for example `int add(int x, int y) { int r = x + y; return r; }`, and how to call it. Note that parameters take the values of arguments and do not need matching names. Demonstrate declaring a function before it is called, using return values, and when to use `void`."
				},
				{
					title: "CPPF3 Project 1: Function Practice",
					content:
						"Write functions that: take two integers and return their precise average, check if an integer is even, return the smallest of three distinct doubles, return the factorial of an integer, and compute a positive integer base raised to a power.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF3-Function-Practice-Solution"
				},
				{
					title: "Random Numbers",
					content:
						"Use `rand()` to generate random numbers and seed with `srand(time(0))` so results change each run. `rand() % num` gives a value between 0 and num - 1. For a range like 15–75, use `rand() % (max - min + 1) + min`, and check odd/even with `rand() % 2`."
				},
				{
					title: "CPPF3 Project 2: Probability Events and Random",
					content:
						'Write functions that simulate probability events: flip a coin and return "heads" or "tails," roll two dice and return the sum, and draw a card returning "value of suit" such as "10 of Diamonds" or "King of Spades." Discuss suits and card values. Prepare a short presentation to share with friends or family.',
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF3-Probability-Events-Solution"
				},
				{
					title: "CPPF3 Project 3: Number Guesser",
					content:
						"Create a game that picks a random number between a user-provided range and allows a set number of guesses. Break the program into functions for the range, random number, prompting guesses and giving higher/lower feedback. End when the number is guessed or guesses run out. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF3-Number-Guesser-Solution"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF4 Classes and Objects",
			curriculum: [
				{
					title: "Object Oriented Programming Basics",
					content:
						"Explain object oriented programming using objects to hold data so code is extensible and reusable. Introduce classes as templates for creating objects, using examples like grouping properties of social media posts. Define an object as an instance of a class."
				},
				{
					title: ".h Files and .cpp Files",
					content:
						'Reference: https://repl.it/@JuniLearning/CPPF4-Point-Class Create a new project with point.cpp and point.h. Place declarations in the .h header file and implementations in the .cpp source file. Use the scope resolution operator with Point:: before functions in the .cpp file, and `#include "CLASS_NAME.h"` in .cpp and main files. Add header guards with `#ifndef CLASS_H`, `#define CLASS_H`, and `#endif` to avoid multiple inclusions.'
				},
				{
					title: "Public and Private Variables",
					content:
						"Describe encapsulation: keep sensitive data private and expose needed functions as public. Make variables like x and y coordinates private and keep functions public unless they should be hidden."
				},
				{
					title: "Class Functions",
					content:
						'Explain constructors, starting with a default constructor that sets values to 0 and an overloaded constructor that accepts x and y values. Add getters and setters for x and y. In main, use getters to print "The point\'s coordinate is (x, y)" to test access to private variables.'
				},
				{
					title: "CPPF4 Project 1: Person Class",
					content:
						"Build a Person class with private variables such as name, age and height (in inches), plus any others you choose. Include at least two constructors (default and one with parameters), getters and setters, and a toString function that converts height from inches to feet + inches (for example, 66 to 5' 6\"). Consider a private helper for the height conversion. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF4-Person-Class?skipMigration=1"
				},
				{
					title: "The Base Member Initialization List (BMI)",
					content:
						"Reference: https://repl.it/@JuniLearning/CPPF4-Person-Class-with-BMI Explain how a base member initialization list quickly initializes private variables. Show the order matching declarations in the .h file and the syntax Class::Class(params) : var(value) {}. Update Person constructors to use BMI."
				},
				{
					title: "CPPF4 Project 2: Cat Class",
					content:
						'Create a Cat class. Include a default constructor (name "cat," breed "unknown," age 0, color "unknown") and an overloaded constructor, both using BMI. Add changeAge, changeBreed, toString, meow, eat, and pet functions. Bonus: use "year" instead of "years" when the cat is one year old. Prepare a short presentation to share with friends or family.',
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF4-Cat-Class?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF5 Pointers",
			curriculum: [
				{
					title: "Memory and Pointers",
					content:
						"Reference: https://repl.it/@JuniLearning/CPPF5-Pointers Explain that memory locations have unique addresses visible with & before a variable. Create an int variable, print its address, and create a pointer with `int*` pointing to that address. Show dereferencing with `*` to access or change the value, assigning one pointer to another, changing pointer targets, and setting a pointer to `nullptr` when it points to nothing.",
					projectLink:
						"https://repl.it/@JuniLearning/CPPF5-Pointers-Reference"
				},
				{
					title: "CPPF5 Project 1: Pointers Introduction",
					content:
						"Answer conceptual questions about pointers: printing `*p1` vs. `p1`, changing `*p1`, copying pointers, dereferencing uninitialized or `nullptr` pointers, and why assignments like `*p1 = &val1` are incorrect.",
					projectLink:
						"https://repl.it/@JuniLearning/CPPF5-Pointers-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF5-Pointers?skipMigration=1"
				},
				{
					title: "CPPF5 Project 2: Problems Using Pointers",
					content:
						"Write code that demonstrates common pointer issues and observe the errors: dangling pointers, dereferencing a `nullptr`, improper initialization (`int* p1, p2`), uninitialized pointers, assigning values directly to pointer variables, and data type mismatches. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF5-Pointer-Error-Examples?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF6 References and Parameter Passing",
			curriculum: [
				{
					title: "References",
					content:
						"Explain that a reference is an alias for another variable, created with & after the type (for example, `int& ref1 = intVal1`). Changing the reference changes the original, which is useful in function parameters."
				},
				{
					title: "Parameter Passing",
					content:
						"Reference: https://repl.it/@JuniLearning/CPPF6-Parameter-Passing-Introduction Discuss passing by value (creates a local copy), by reference (modifies the original) and by const reference (efficient but unmodifiable). Show examples where spacing around & is flexible: int &param, int& param, int &param."
				},
				{
					title: "CPPF6 Project 1: Parameter Passing Tracing",
					content:
						"Write comments predicting how values change when passed by value, reference and const reference, then call the functions to test. Explain why const references cannot be modified.",
					projectLink:
						"https://repl.it/@JuniLearning/CPPF6-Parameter-Passing-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF6-Parameter-Passing-Tracing?skipMigration=1"
				},
				{
					title: "CPPF6 Project 2: Defanging a Website Address",
					content:
						"Defang a URL by turning periods into `[.]`. Write one function that edits the string directly (pass by reference) and another that builds and returns a new defanged string (pass by value), possibly using `str.replace()`.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF6-Defanging-a-Website-URL?skipMigration=1"
				},
				{
					title: "CPPF6 Project 3: Chaos Monkeys",
					content:
						"Write functions that pass strings by value, by reference and by const reference, inserting random characters with `insert(int index, int quantity, char newChar)`. Avoid infinite loops when the string length changes inside a loop. Bonus: add more scrambling functions. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF6-Chaos-Monkeys?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF7 Arrays",
			curriculum: [
				{
					title: "Array Basics",
					content:
						"Reference: https://repl.it/@JuniLearning/CPPF7-Array-Basics-Reference Explain that arrays store ordered values of the same type. Declare an array with type, name and size such as `int nums[10]`, or initialize with `int arr[] = {1,2,3}`. Access and change elements by index. Use sizeof(array) / sizeof(array[0]) to find length, loop to update and print elements, and note that printing an array name shows an address, so loop to print values."
				},
				{
					title: "Arrays in Memory",
					content:
						"Reference: https://repl.it/@JuniLearning/CPPF7-Pointer-Arithmetic-Reference Explain that arrays are contiguous memory and act like pointers to the first element. Create a pointer to the first element with `int *p1 = arr1`. Show accessing elements with pointer arithmetic like `*(p1 + index)` and advancing pointers with `p++`, warning about undefined behaviour outside the array."
				},
				{
					title: "CPPF7 Project 1: Array Practice",
					content:
						"Create and print an array of the first 10 perfect squares. Write functions that check whether the first and last array elements match, sum the elements of an int array, and return the total letters across an array of strings. Explain passing arrays to functions as `type arr[]` or as pointers.",
					projectLink:
						"https://repl.it/@JuniLearning/CPPF7-Array-Practice-Starter?skipMigration=1",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF7-Array-Practice?skipMigration=1"
				},
				{
					title: "CPPF7 Project 2: Bank Accounts",
					content:
						"Ask for the number of transactions in the past month, store withdrawals and deposits in an array with a loop, and write a function to calculate and print the final balance. Bonus: alert if the balance is low. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF7-Bank-Accounts?skipMigration=1"
				}
			],
			supplementalProjects: [
				{
					title: "CPPF7 Supplemental Project 1: Tic Tac Toe",
					content:
						"Use arrays and functions to build Tic Tac Toe. Plan the game steps, use an array to track moves, create a function to check all winning combinations, a function to print the board with dividers, and track players' moves while handling invalid choices. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF7-Tic-Tac-Toe?skipMigration=1"
				}
			]
		},
		{
			title: "CPPF8 Two-Dimensional Arrays",
			curriculum: [
				{
					title: "Two-Dimensional Arrays",
					content:
						"Reference: https://repl.it/@JuniLearning/CPPF8-Two-Dimensional-Arrays-Reference Create a 2D array such as `int arr[10][10];` and with initializer lists like `int arr[3][3] = {{1,2,3},{4,5,6},{7,8,9}};`. Calculate rows with sizeof(array) / sizeof(array[0]) and columns with sizeof(array[0]) / sizeof(array[0][0]). Access elements with arr[i][j] and print with nested loops."
				},
				{
					title: "Using Two-Dimensional Arrays in Functions",
					content:
						"Pass a 2D array into a function as `(int *arr, int row, int col)` and access elements in contiguous memory with `*((arr + i*n) + j)`. Show returning arrays from functions with `int**` for 2D arrays and `int*` for 1D arrays, such as a function returning numbers 0 through n."
				},
				{
					title: "CPPF8 Project 1: Two-Dimensional Array Practice",
					content:
						"Write methods that: sum all integers in a 2D array, find the minimum integer, return an n x n multiplication table and print it in a grid, and return a 1D array of the averages of each row as floats.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF8-2D-Array-Practice?skipMigration=1"
				},
				{
					title: "CPPF8 Project 2: Bank Balances",
					content:
						"Use a 2D array to track customers and recurring transactions. Build a `print()` function with nested for loops to show a grid, then implement the data structure for user interaction. Prepare a short presentation to share with friends or family.",
					projectLink:
						"https://repl.it/@JuniLearning/CPPF8-Two-Dimensional-Arrays-Reference",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF8-Bank-Transactions?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF9 Dynamic Arrays and Memory",
			curriculum: [
				{
					title: "Dynamic Variables",
					content:
						"Reference: https://repl.it/@JuniLearning/CPPF9-Dynamic-Variables-Reference Explain static variables and dynamic (anonymous) variables created at runtime with `new`, such as `int *p1 = new int;`. Store values with `*p1 = 5` or `std::cin >> *p1`. Always delete dynamic memory with `delete p1` to avoid leaks, and note that dereferencing after delete is a dangling pointer. Use `nullptr` to indicate a pointer to nothing.",
					projectLink:
						"https://repl.it/@JuniLearning/CPPF9-Dynamic-Variables-Reference"
				},
				{
					title: "CPPF9 Project 1: Assembly Line",
					content:
						"Create an Object class with name and weight (lbs), a BMI-based constructor, and a print function that outputs name, weight in pounds, and weight in kilograms (1 kg = 2.205 lbs). Repeatedly collect info to create a dynamic Object, print it, and free its memory before the next one. Bonus: ask how many Objects to process, store them in an array, then print each. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF9-Assembly-Line?skipMigration=1"
				},
				{
					title: "Introduction to Dynamic Arrays",
					content:
						"Static arrays have fixed size. To handle more data, declare a pointer, create the array with `new`, use the pointer like an array, and when out of space create a new array with double capacity, copy values over, delete the old array, and free memory with `delete` when done."
				},
				{
					title: "Dynamic Arrays and Memory",
					content:
						"Explain dynamic arrays that resize when full by allocating new space, copying old values and deleting the old array. Not calling delete causes memory leaks. When a class allocates memory, include a destructor `~ClassName` to free it when the object goes out of scope."
				},
				{
					title: "CPPF9 Project 2: Dynamic Array Implementation",
					content:
						"Implement a DynamicArray class. Private members: `mysize`, `maxSize`, and `int* myVals` (optionally a DEFAULT_SIZE). Default constructor sets `mysize` to 0, `maxSize` to a default size and allocates `myVals`. Destructor deletes `myVals` and resets `mysize`. `addVal(int val)` checks capacity, doubles size when full by creating a new array, copying values, swapping pointers, deleting the old array, then adding the value and incrementing `mysize`. `printVals()` iterates over stored values, and `get(index)` returns the value at an index.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF9-Dynamic-Array-Implementation?skipMigration=1"
				},
				{
					title: "Introduction to Structs",
					content:
						"Reference: https://repl.it/@JuniLearning/Structs-Example Explain that a struct is similar to a class but members are public by default. Structs group small related data such as a grocery item with name and price."
				},
				{
					title: "CPPF9 Project 3: Grocery List",
					content:
						"Update the DynamicArray to store Groceries (name and price) using a struct defined in DynamicArray.h with basic and overloaded constructors. Change pointer types and functions to the new data type. Include functions to print and add items. For removeItem by index, copy values into a new dynamic array while skipping the removed item. Build a simple menu to add, remove, print and quit. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF9-Grocery-List?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF10 Master Project: Matrix Fun",
			curriculum: [
				{
					title: "CPPF10 Master Project: Matrix Fun",
					content:
						"We can call grids of numbers matrices. Two matrices must have the same dimensions for addition. Map out the process: create variables for rows, columns and each matrix, ask for dimensions and elements, add the matrices and print the result in a grid. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF10-Matrix-Addition?skipMigration=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "CPPF11 Master Project: Profile Posts",
			curriculum: [
				{
					title: "CPPF11 Master Project: Profile Posts",
					content:
						"Create a Profile class that stores Post structs with a caption and heart count. Allow adding posts, printing a single post, printing all posts, and adding hearts. Track a changing number of posts with numPosts, maxSize and myPosts (a dynamic array of posts). Include a helper to validate indexes. Bonus: add more fields, sum hearts, edit or duplicate posts. Prepare a short presentation to share with friends or family.",
					solutionLink:
						"https://repl.it/@JuniLearning/CPPF11-Profile-Posts?skipMigration=1"
				},
				{
					title: "Course recap",
					content:
						"Recap what this course covered and discuss which course to take next."
				}
			],
			supplementalProjects: []
		}
	]
};
