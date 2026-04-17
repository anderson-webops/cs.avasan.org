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
					title: "Optional Python-to-C++ Bridge",
					content:
						"Students coming from the Python track should use the `Python to Java and C++ Bridge` course or similar addendum so typed variables, compilation, braces, and `cout`/`cin` feel like a translation exercise before the main C++ sequence accelerates."
				},
				{
					title: "Primitive Types",
					content:
						"Explain fundamental data types: integers, floating point numbers, booleans and characters. Demonstrate declaring variables with and without initial values and initializing several of the same type on one line. Create an integer myAge, a double myRating for a movie rating, and show arithmetic operators including %. Illustrate mod with 10 / 3 = 3 and 10 % 3 = 1. Cast a double to an int when printing. Create a boolean isHot and a char myChar for the first letter of your last name.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Primitive-Types-and-Strings-Reference"
				},
				{
					title: "String",
					content:
						"Explain the `std::string` type and add `#include <string>` to use it. Create `myString` with double quotes, print its first letter with indexing, and use `string.length()` to print its length. Concatenate two strings and print the result. Demonstrate `str.insert(i, otherStr)` and `str.insert(i, amt, char)` to insert strings or characters."
				},
				{
					title: "Input and Output",
					content:
						'Explain streams for input and output. Use the insertion operator (`<<`) to print "Enter your name: " to the console. Create a string variable name, use the extraction operator (`>>`) to read the response, and print "Nice to meet you, ___!" with the input inserted. Include `#include <iostream>` at the top. Explain `cin` and `cout`, and note that `<<` and `>>` point to where information is sent.',
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Input-and-Output-Reference"
				},
				{
					title: "Comments",
					content:
						"Add single-line comments with `//` to describe code. Use multi-line comments `/* ... */` to comment out sections of code and observe that commented code does not run. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Compilation (Advanced Concept)",
					content:
						"Explain that `std` stands for standard and `::` is the scope resolution operator that identifies where a function comes from. When you click Run, the compiler checks C++ rules, reports errors with line numbers, and then translates code into an object file."
				},
				{
					title: "CPPF1 Project 1: Mad Libs",
					content:
						"Demo the Mad Libs example, then build your own: create several string variables, prompt for inputs with `std::cin`, and use string concatenation or multiple insertion operators to print the final story. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Mad-Libs",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Mad-Libs"
				},
				{
					title: "CPPF1 Project 2: Chatbot",
					content:
						"Create a chatbot: ask for a name and respond, ask for a sentence and use `str.insert()` to insert **achoo** to make the bot sneeze, convert Fahrenheit to Celsius with float values, and convert a dollar amount to another currency. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-ChatBot",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-ChatBot"
				}
			],
			supplementalProjects: [
				{
					title: "Variables, Types, and Input/Output: Extension Challenge",
					content:
						"Extend the work from CPPF1 Variables, Types, and Input/Output with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Primitive-Types-and-Strings-Reference"
				},
				{
					title: "Variables, Types, and Input/Output supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF1 Variables, Types, and Input/Output. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-01-cppf1-variables-types-and-input-output-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-01-cppf1-variables-types-and-input-output-supplemen/solution"
				},
				{
					title: "Variables, Types, and Input/Output supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF1 Variables, Types, and Input/Output. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-02-cppf1-variables-types-and-input-output-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-02-cppf1-variables-types-and-input-output-supplemen/solution"
				}
			]
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
						"Use both `for` and `while` loops for each part: ask for a number and a larger number and print all numbers between them, ask how many numbers to enter and print their sum, then print the average using double division. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games"
				},
				{
					title: "Conditionals and Logical Operators",
					content:
						"Introduce conditional statements with examples like `if (1+1 == 2)`. Explain comparison operators (==, !=, >, <, >=, <=) and logical operators `&&` (and) and `||` (or). Show `if`, `if-else`, and `if... else if... else` chains and how nested conditionals work."
				},
				{
					title: "CPPF2 Project 2: Rock, Paper, Scissors",
					content:
						"Use conditionals to build Rock, Paper, Scissors. Check each player's choice with nested conditionals to determine the winner. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Rock-Paper-Scissors",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Rock-Paper-Scissors"
				},
				{
					title: "CPPF2 Project 3: FizzBuzz",
					content:
						'Print numbers 1 through 50. For multiples of 3 print "Fizz," for multiples of 5 print "Buzz," and for multiples of both print "FizzBuzz." Review the % operator with simple examples. Bonus: allow any two input numbers for a customizable FizzBuzz. Write a short explanation of the program design, inputs, and test results.',
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-FizzBuzz",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-FizzBuzz"
				}
			],
			supplementalProjects: [
				{
					title: "Loops and Conditionals: Extension Challenge",
					content:
						"Extend the work from CPPF2 Loops and Conditionals with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games"
				},
				{
					title: "Loops and Conditionals supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF2 Loops and Conditionals. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-03-cppf2-loops-and-conditionals-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-03-cppf2-loops-and-conditionals-supplemental-2/solution"
				},
				{
					title: "Loops and Conditionals supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF2 Loops and Conditionals. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-04-cppf2-loops-and-conditionals-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-04-cppf2-loops-and-conditionals-supplemental-3/solution"
				}
			]
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
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Function-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Function-Practice"
				},
				{
					title: "Random Numbers",
					content:
						"Use `rand()` to generate random numbers and seed with `srand(time(0))` so results change each run. `rand() % num` gives a value between 0 and num - 1. For a range like 15–75, use `rand() % (max - min + 1) + min`, and check odd/even with `rand() % 2`."
				},
				{
					title: "CPPF3 Project 2: Probability Events and Random",
					content:
						'Write functions that simulate probability events: flip a coin and return "heads" or "tails," roll two dice and return the sum, and draw a card returning "value of suit" such as "10 of Diamonds" or "King of Spades." Discuss suits and card values. Write a short explanation of the program design, inputs, and test results.',
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Probability-Functions",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Probability-Functions"
				},
				{
					title: "CPPF3 Project 3: Number Guesser",
					content:
						"Create a game that picks a random number between a user-provided range and allows a set number of guesses. Break the program into functions for the range, random number, prompting guesses and giving higher/lower feedback. End when the number is guessed or guesses run out. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Number-Guesser",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Number-Guesser"
				}
			],
			supplementalProjects: [
				{
					title: "Functions: Extension Challenge",
					content:
						"Extend the work from CPPF3 Functions with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Function-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Function-Practice"
				},
				{
					title: "Functions supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF3 Functions. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-05-cppf3-functions-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-05-cppf3-functions-supplemental-2/solution"
				},
				{
					title: "Functions supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF3 Functions. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-06-cppf3-functions-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-06-cppf3-functions-supplemental-3/solution"
				}
			]
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
						'Create a new project with point.cpp and point.h. Place declarations in the .h header file and implementations in the .cpp source file. Use the scope resolution operator with Point:: before functions in the .cpp file, and `#include "CLASS_NAME.h"` in .cpp and main files. Add header guards with `#ifndef CLASS_H`, `#define CLASS_H`, and `#endif` to avoid multiple inclusions.',
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Point-Class"
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
						"Build a Person class with private variables such as name, age and height (in inches), plus any others you choose. Include at least two constructors (default and one with parameters), getters and setters, and a toString function that converts height from inches to feet + inches (for example, 66 to 5' 6\"). Consider a private helper for the height conversion. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Person-Class",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Person-Class"
				},
				{
					title: "The Base Member Initialization List (BMI)",
					content:
						"Explain how a base member initialization list quickly initializes private variables. Show the order matching declarations in the .h file and the syntax Class::Class(params) : var(value) {}. Update Person constructors to use BMI.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Person-Class-with-BMI"
				},
				{
					title: "CPPF4 Project 2: Cat Class",
					content:
						'Create a Cat class. Include a default constructor (name "cat," breed "unknown," age 0, color "unknown") and an overloaded constructor, both using BMI. Add changeAge, changeBreed, toString, meow, eat, and pet functions. Bonus: use "year" instead of "years" when the cat is one year old. Write a short explanation of the program design, inputs, and test results.',
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Cat-Class",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Cat-Class"
				}
			],
			supplementalProjects: [
				{
					title: "Classes and Objects: Extension Challenge",
					content:
						"Extend the work from CPPF4 Classes and Objects with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Point-Class"
				},
				{
					title: "Classes and Objects supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF4 Classes and Objects. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-07-cppf4-classes-and-objects-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-07-cppf4-classes-and-objects-supplemental-2/solution"
				},
				{
					title: "Classes and Objects supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF4 Classes and Objects. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-08-cppf4-classes-and-objects-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-08-cppf4-classes-and-objects-supplemental-3/solution"
				}
			]
		},
		{
			title: "CPPF5 Pointers",
			curriculum: [
				{
					title: "Memory and Pointers",
					content:
						"Explain that memory locations have unique addresses visible with & before a variable. Create an int variable, print its address, and create a pointer with `int*` pointing to that address. Show dereferencing with `*` to access or change the value, assigning one pointer to another, changing pointer targets, and setting a pointer to `nullptr` when it points to nothing.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Pointers"
				},
				{
					title: "CPPF5 Project 1: Pointers Introduction",
					content:
						"Answer conceptual questions about pointers: printing `*p1` vs. `p1`, changing `*p1`, copying pointers, dereferencing uninitialized or `nullptr` pointers, and why assignments like `*p1 = &val1` are incorrect.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF-Pointers-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Pointers"
				},
				{
					title: "CPPF5 Project 2: Problems Using Pointers",
					content:
						"Write code that demonstrates common pointer issues and observe the errors: dangling pointers, dereferencing a `nullptr`, improper initialization (`int* p1, p2`), uninitialized pointers, assigning values directly to pointer variables, and data type mismatches. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Pointer-Error-Examples",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Pointer-Error-Examples"
				},
				{
					title: "Pointers: Verification and Reflection",
					content:
						"Close CPPF5 Pointers by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Pointers: Extension Challenge",
					content:
						"Extend the work from CPPF5 Pointers with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Pointers"
				},
				{
					title: "Pointers supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF5 Pointers. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-09-cppf5-pointers-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-09-cppf5-pointers-supplemental-2/solution"
				},
				{
					title: "Pointers supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF5 Pointers. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-10-cppf5-pointers-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-10-cppf5-pointers-supplemental-3/solution"
				}
			]
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
						"Discuss passing by value (creates a local copy), by reference (modifies the original) and by const reference (efficient but unmodifiable). Show examples where spacing around & is flexible: int &param, int& param, int &param.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing-Introduction"
				},
				{
					title: "CPPF6 Project 1: Parameter Passing Tracing",
					content:
						"Write comments predicting how values change when passed by value, reference and const reference, then call the functions to test. Explain why const references cannot be modified. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing"
				},
				{
					title: "CPPF6 Project 2: Defanging a Website Address",
					content:
						"Defang a URL by turning periods into `[.]`. Write one function that edits the string directly (pass by reference) and another that builds and returns a new defanged string (pass by value), possibly using `str.replace()`.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Defanging-a-Website-URL",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Defanging-a-Website-URL"
				},
				{
					title: "CPPF6 Project 3: Chaos Monkeys",
					content:
						"Write functions that pass strings by value, by reference and by const reference, inserting random characters with `insert(int index, int quantity, char newChar)`. Avoid infinite loops when the string length changes inside a loop. Bonus: add more scrambling functions. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Chaos-Monkeys",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Chaos-Monkeys"
				}
			],
			supplementalProjects: [
				{
					title: "References and Parameter Passing: Extension Challenge",
					content:
						"Extend the work from CPPF6 References and Parameter Passing with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing-Introduction"
				},
				{
					title: "References and Parameter Passing supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF6 References and Parameter Passing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-11-cppf6-references-and-parameter-passing-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-11-cppf6-references-and-parameter-passing-supplemen/solution"
				},
				{
					title: "References and Parameter Passing supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF6 References and Parameter Passing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-12-cppf6-references-and-parameter-passing-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-12-cppf6-references-and-parameter-passing-supplemen/solution"
				}
			]
		},
		{
			title: "CPPF7 Arrays",
			curriculum: [
				{
					title: "Array Basics",
					content:
						"Explain that arrays store ordered values of the same type. Declare an array with type, name and size such as `int nums[10]`, or initialize with `int arr[] = {1,2,3}`. Access and change elements by index. Use sizeof(array) / sizeof(array[0]) to find length, loop to update and print elements, and note that printing an array name shows an address, so loop to print values.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Array-Basics-Reference"
				},
				{
					title: "Arrays in Memory",
					content:
						"Explain that arrays are contiguous memory and act like pointers to the first element. Create a pointer to the first element with `int *p1 = arr1`. Show accessing elements with pointer arithmetic like `*(p1 + index)` and advancing pointers with `p++`, warning about undefined behaviour outside the array.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Pointer-Arithmetic-Reference"
				},
				{
					title: "CPPF7 Project 1: Array Practice",
					content:
						"Create and print an array of the first 10 perfect squares. Write functions that check whether the first and last array elements match, sum the elements of an int array, and return the total letters across an array of strings. Explain passing arrays to functions as `type arr[]` or as pointers.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Array-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Array-Practice"
				},
				{
					title: "CPPF7 Project 2: Bank Accounts",
					content:
						"Ask for the number of transactions in the past month, store withdrawals and deposits in an array with a loop, and write a function to calculate and print the final balance. Bonus: alert if the balance is low. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Bank-Accounts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Bank-Accounts"
				}
			],
			supplementalProjects: [
				{
					title: "CPPF7 Supplemental Project 1: Tic Tac Toe",
					content:
						"Use arrays and functions to build Tic Tac Toe. Plan the game steps, use an array to track moves, create a function to check all winning combinations, a function to print the board with dividers, and track players' moves while handling invalid choices. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Tic-Tac-Toe",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Tic-Tac-Toe"
				},
				{
					title: "Arrays supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF7 Arrays. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-13-cppf7-arrays-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-13-cppf7-arrays-supplemental-2/solution"
				},
				{
					title: "Arrays supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF7 Arrays. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-14-cppf7-arrays-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-14-cppf7-arrays-supplemental-3/solution"
				}
			]
		},
		{
			title: "CPPF8 Two-Dimensional Arrays",
			curriculum: [
				{
					title: "Two-Dimensional Arrays",
					content:
						"Create a 2D array such as `int arr[10][10];` and with initializer lists like `int arr[3][3] = {{1,2,3},{4,5,6},{7,8,9}};`. Calculate rows with sizeof(array) / sizeof(array[0]) and columns with sizeof(array[0]) / sizeof(array[0][0]). Access elements with arr[i][j] and print with nested loops.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Two-Dimensional-Arrays-Reference"
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
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-2D-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-2D-Array-Practice"
				},
				{
					title: "CPPF8 Project 2: Bank Balances",
					content:
						"Use a 2D array to track customers and recurring transactions. Build a `print()` function with nested for loops to show a grid, then implement the data structure for user interaction. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Two-Dimensional-Arrays-Reference",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Bank-Transactions"
				}
			],
			supplementalProjects: [
				{
					title: "Two Dimensional Arrays: Extension Challenge",
					content:
						"Extend the work from CPPF8 Two-Dimensional Arrays with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Two-Dimensional-Arrays-Reference"
				},
				{
					title: "Two Dimensional Arrays supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF8 Two-Dimensional Arrays. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-15-cppf8-two-dimensional-arrays-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-15-cppf8-two-dimensional-arrays-supplemental-2/solution"
				},
				{
					title: "Two Dimensional Arrays supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF8 Two-Dimensional Arrays. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-16-cppf8-two-dimensional-arrays-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-16-cppf8-two-dimensional-arrays-supplemental-3/solution"
				}
			]
		},
		{
			title: "CPPF9 Dynamic Arrays and Memory",
			curriculum: [
				{
					title: "Dynamic Variables",
					content:
						"Explain static variables and dynamic (anonymous) variables created at runtime with `new`, such as `int *p1 = new int;`. Store values with `*p1 = 5` or `std::cin >> *p1`. Always delete dynamic memory with `delete p1` to avoid leaks, and note that dereferencing after delete is a dangling pointer. Use `nullptr` to indicate a pointer to nothing.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF9-Dynamic-Variables-Reference"
				},
				{
					title: "CPPF9 Project 1: Assembly Line",
					content:
						"Create an Object class with name and weight (lbs), a BMI-based constructor, and a print function that outputs name, weight in pounds, and weight in kilograms (1 kg = 2.205 lbs). Repeatedly collect info to create a dynamic Object, print it, and free its memory before the next one. Bonus: ask how many Objects to process, store them in an array, then print each. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF9-Assembly-Line",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF9-Assembly-Line"
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
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF9-Dynamic-Array-Implementation",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF9-Dynamic-Array-Implementation"
				},
				{
					title: "Introduction to Structs",
					content:
						"Explain that a struct is similar to a class but members are public by default. Structs group small related data such as a grocery item with name and price. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP_Structs-Example"
				},
				{
					title: "CPPF9 Project 3: Grocery List",
					content:
						"Update the DynamicArray to store Groceries (name and price) using a struct defined in DynamicArray.h with basic and overloaded constructors. Change pointer types and functions to the new data type. Include functions to print and add items. For removeItem by index, copy values into a new dynamic array while skipping the removed item. Build a simple menu to add, remove, print and quit. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF9-Grocery-List",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF9-Grocery-List"
				}
			],
			supplementalProjects: [
				{
					title: "Dynamic Arrays and Memory: Extension Challenge",
					content:
						"Extend the work from CPPF9 Dynamic Arrays and Memory with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF9-Dynamic-Variables-Reference"
				},
				{
					title: "Dynamic Arrays and Memory supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF9 Dynamic Arrays and Memory. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-17-cppf9-dynamic-arrays-and-memory-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-17-cppf9-dynamic-arrays-and-memory-supplemental-2/solution"
				},
				{
					title: "Dynamic Arrays and Memory supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF9 Dynamic Arrays and Memory. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-18-cppf9-dynamic-arrays-and-memory-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-18-cppf9-dynamic-arrays-and-memory-supplemental-3/solution"
				}
			]
		},
		{
			title: "CPPF10 Master Project: Matrix Fun",
			curriculum: [
				{
					title: "CPPF10 Master Project: Matrix Fun",
					content:
						"We can call grids of numbers matrices. Two matrices must have the same dimensions for addition. Map out the process: create variables for rows, columns and each matrix, ask for dimensions and elements, add the matrices and print the result in a grid. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF10-Matrix-Addition",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF10-Matrix-Addition"
				},
				{
					title: "Master Project: Matrix Fun: Debugging and Failure Modes",
					content:
						"Focus on the mistakes students are most likely to make in CPPF10 Master Project: Matrix Fun. Have them diagnose a broken attempt, repair it, and explain why the fix works. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				},
				{
					title: "Master Project: Matrix Fun: Planning and Architecture",
					content:
						"Break CPPF10 Master Project: Matrix Fun into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				},
				{
					title: "Master Project: Matrix Fun: Verification and Reflection",
					content:
						"Close CPPF10 Master Project: Matrix Fun by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Matrix Fun: Extension Challenge",
					content:
						"Extend the work from CPPF10 Master Project: Matrix Fun with a tighter constraint, one extra feature, or a slightly more realistic input case. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF10-Matrix-Addition",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF10-Matrix-Addition"
				},
				{
					title: "Master Project: Matrix Fun supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF10 Master Project: Matrix Fun. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-19-cppf10-master-project-matrix-fun-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-19-cppf10-master-project-matrix-fun-supplemental-2/solution"
				},
				{
					title: "Master Project: Matrix Fun supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF10 Master Project: Matrix Fun. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-20-cppf10-master-project-matrix-fun-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-20-cppf10-master-project-matrix-fun-supplemental-3/solution"
				}
			]
		},
		{
			title: "CPPF11 Master Project: Profile Posts",
			curriculum: [
				{
					title: "CPPF11 Master Project: Profile Posts",
					content:
						"Create a Profile class that stores Post structs with a caption and heart count. Allow adding posts, printing a single post, printing all posts, and adding hearts. Track a changing number of posts with numPosts, maxSize and myPosts (a dynamic array of posts). Include a helper to validate indexes. Bonus: add more fields, sum hearts, edit or duplicate posts. Write a short explanation of the program design, inputs, and test results.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF11-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF11-Profile-Posts"
				},
				{
					title: "Course recap",
					content:
						"Recap what this course covered and discuss which course to take next. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Master Project: Profile Posts: Planning and Architecture",
					content:
						"Break CPPF11 Master Project: Profile Posts into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				},
				{
					title: "Master Project: Profile Posts: Verification and Reflection",
					content:
						"Close CPPF11 Master Project: Profile Posts by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Profile Posts: Extension Challenge",
					content:
						"Extend the work from CPPF11 Master Project: Profile Posts with a tighter constraint, one extra feature, or a slightly more realistic input case. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF11-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF11-Profile-Posts"
				},
				{
					title: "Master Project: Profile Posts supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF11 Master Project: Profile Posts. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-21-cppf11-master-project-profile-posts-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-21-cppf11-master-project-profile-posts-supplemental/solution"
				},
				{
					title: "Master Project: Profile Posts supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to CPPF11 Master Project: Profile Posts. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-22-cppf11-master-project-profile-posts-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPP-22-cppf11-master-project-profile-posts-supplemental/solution"
				}
			]
		},
		{
			title: "CPPF12 Optional Reinforcement and Repo Library",
			curriculum: [
				{
					title: "What Stays Core vs. Optional",
					content:
						"Keep the public spine focused on the main C++ learning arc while exposing the remaining repo material as reinforcement. The missing folders are mostly drills, references, or alternate practice projects rather than hidden required units."
				},
				{
					title: "Pointers, Loops, and Matrix Reinforcement",
					content:
						"Use the optional folders below when a student needs one more pass over loop structure, pointer comfort, or matrix-style class design before moving to harder systems work. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Archive Boundary",
					content:
						"Treat `CPP_practice` as a loose archive bank rather than as a canonical public module. Students should rely on the curated extensions below before digging into that scratch-style folder."
				},
				{
					title: "Optional Reinforcement and Repo Library: Verification and Reflection",
					content:
						"Close CPPF12 Optional Reinforcement and Repo Library by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "CPPF12 Optional Reinforcement and Repo Library: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-For-Loop-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-For-Loop-Practice"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: For Loop Practice",
					content:
						"Use a focused counted-loop drill when the main loop module needs extra repetition without adding new concepts. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-For-Loop-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-For-Loop-Practice"
				},
				{
					title: "Extension: While Loop Practice",
					content:
						"Use a condition-driven loop drill to reinforce termination reasoning and update logic. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-While-Loop-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-While-Loop-Practice"
				},
				{
					title: "Reference: rand() and Randomness",
					content:
						"Keep the randomness reference available when students need a clearer explanation of pseudo-random generation and simple simulation setup. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-rand-Reference"
				},
				{
					title: "Extension: Pointer Practice",
					content:
						"Use a lighter pointer drill before the student commits to the more complex dynamic-memory projects. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Pointer-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Pointer-Practice"
				},
				{
					title: "Extension: Alternate Assembly Line Project",
					content:
						"Use the earlier assembly-line variant as an extra dynamic-memory and object-handling lab before the later dynamic-array work. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Project-2-Assembly-Line",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Project-2-Assembly-Line"
				},
				{
					title: "Extension: Matrix Class Practice",
					content:
						"Use the matrix-class folder as a richer follow-on to the matrix-addition capstone when a student is ready to model grid operations more formally. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF10-Matrix-Fun-with-Matrix-Class",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF10-Matrix-Fun-with-Matrix-Class"
				}
			]
		},
		{
			title: "Applied Studio 13: c foundations build 14",
			curriculum: [
				{
					title: "c foundations build 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: c foundations build 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "c foundations build 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: c foundations build 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "c foundations build 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: c foundations build 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-02-c-foundations-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-02-c-foundations-build-14/solution"
				},
				{
					title: "c foundations build 14: Review and Reflection",
					content:
						"Close Applied Studio 13: c foundations build 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "c foundations build 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: c foundations build 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-02-c-foundations-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-02-c-foundations-build-14/solution"
				},
				{
					title: "Applied Studio 13: c foundations build 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: c foundations build 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-23-applied-studio-13-c-foundations-build-14-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-23-applied-studio-13-c-foundations-build-14-supplem/solution"
				},
				{
					title: "Applied Studio 13: c foundations build 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: c foundations build 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-24-applied-studio-13-c-foundations-build-14-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-24-applied-studio-13-c-foundations-build-14-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: c foundations build 15",
			curriculum: [
				{
					title: "c foundations build 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: c foundations build 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "c foundations build 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: c foundations build 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "c foundations build 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: c foundations build 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-03-c-foundations-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-03-c-foundations-build-15/solution"
				},
				{
					title: "c foundations build 15: Review and Reflection",
					content:
						"Close Applied Studio 14: c foundations build 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "c foundations build 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: c foundations build 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-03-c-foundations-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-03-c-foundations-build-15/solution"
				},
				{
					title: "Applied Studio 14: c foundations build 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: c foundations build 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-25-applied-studio-14-c-foundations-build-15-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-25-applied-studio-14-c-foundations-build-15-supplem/solution"
				},
				{
					title: "Applied Studio 14: c foundations build 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: c foundations build 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-26-applied-studio-14-c-foundations-build-15-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-26-applied-studio-14-c-foundations-build-15-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: c foundations build 16",
			curriculum: [
				{
					title: "c foundations build 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: c foundations build 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "c foundations build 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: c foundations build 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "c foundations build 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: c foundations build 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-04-c-foundations-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-04-c-foundations-build-16/solution"
				},
				{
					title: "c foundations build 16: Review and Reflection",
					content:
						"Close Applied Studio 15: c foundations build 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "c foundations build 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: c foundations build 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-04-c-foundations-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-04-c-foundations-build-16/solution"
				},
				{
					title: "Applied Studio 15: c foundations build 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: c foundations build 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-27-applied-studio-15-c-foundations-build-16-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-27-applied-studio-15-c-foundations-build-16-supplem/solution"
				},
				{
					title: "Applied Studio 15: c foundations build 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: c foundations build 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-28-applied-studio-15-c-foundations-build-16-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-28-applied-studio-15-c-foundations-build-16-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: c foundations build 17",
			curriculum: [
				{
					title: "c foundations build 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: c foundations build 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "c foundations build 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: c foundations build 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "c foundations build 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: c foundations build 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-05-c-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-05-c-foundations-build-17/solution"
				},
				{
					title: "c foundations build 17: Review and Reflection",
					content:
						"Close Applied Studio 16: c foundations build 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "c foundations build 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: c foundations build 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-05-c-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-05-c-foundations-build-17/solution"
				},
				{
					title: "Applied Studio 16: c foundations build 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: c foundations build 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-29-applied-studio-16-c-foundations-build-17-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-29-applied-studio-16-c-foundations-build-17-supplem/solution"
				},
				{
					title: "Applied Studio 16: c foundations build 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: c foundations build 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-30-applied-studio-16-c-foundations-build-17-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-30-applied-studio-16-c-foundations-build-17-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: C++ foundations build 17",
			curriculum: [
				{
					title: "C++ foundations build 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: C++ foundations build 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "C++ foundations build 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: C++ foundations build 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "C++ foundations build 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: C++ foundations build 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-05-c-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-05-c-foundations-build-17/solution"
				},
				{
					title: "C++ foundations build 17: Review and Reflection",
					content:
						"Close Applied Studio 17: C++ foundations build 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "C++ foundations build 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: C++ foundations build 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-05-c-foundations-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-05-c-foundations-build-17/solution"
				},
				{
					title: "Applied Studio 17: C++ foundations build 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: C++ foundations build 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-31-applied-studio-17-c-foundations-build-17-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-31-applied-studio-17-c-foundations-build-17-supplem/solution"
				},
				{
					title: "Applied Studio 17: C++ foundations build 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: C++ foundations build 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-32-applied-studio-17-c-foundations-build-17-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Level-1-C-Fundamentals/tree/main/CPP-32-applied-studio-17-c-foundations-build-17-supplem/solution"
				}
			]
		}
	]
};
