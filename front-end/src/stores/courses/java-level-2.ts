import type { RawCourse } from "./types";

export const javaLevel2Course: RawCourse = {
	name: "Java Level 2",
	modules: [
		{
			title: "JM1 Instance Variables, Constructors, and Methods",
			curriculum: [
				{
					title: "Introductions and Java Setup",
					content:
						"Get comfortable with the Java workspace, the console, custom Java files, and the shift from procedural Java to object-oriented programming. Review the role of `main()` while starting to define additional classes in separate files."
				},
				{
					title: "Objects vs. Classes",
					content:
						"Learn how a class acts as a template and an object acts as an instance with its own data and behavior. Use this module to connect class design to real-world entities."
				},
				{
					title: "JM1 Project 1: Dog Class",
					content:
						"Create a `Dog` class with private instance variables, constructors, getters, setters, and a `toString()` method. Then create dog objects in `main()` and use them to practice encapsulation and controlled updates.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Dog-Class"
				},
				{
					title: "More on Object-Oriented Programming",
					content:
						"Connect the `Dog` class to broader OOP ideas such as modularity, reusability, encapsulation, and scalability."
				}
			],
			supplementalProjects: [
				{
					title: "JM1 Supplemental Project 1: Employee Class",
					content:
						"Create an `Employee` class with identifying information, getters, setters, and a `toString()` method, then create and update employee objects in `main()`.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Supplemental-Project-1-Employee"
				}
			]
		},
		{
			title: "JM2 Overloaded Constructors & Comparison Methods",
			curriculum: [
				{
					title: "JM2 Project 1: Person Class",
					content:
						"Create a `Person` class with core instance variables, constructors, getters, setters, and `toString()`, then create multiple people and update their state through methods.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Person-Class"
				},
				{
					title: "Overloaded and Default Constructors",
					content:
						"Use overloaded constructors to support different object initialization patterns, compare custom constructors with Java's default constructor, and optionally use `this()` to reduce repeated constructor code."
				},
				{
					title: "JM2 Project 2: Book Class",
					content:
						"Create a `Book` class with overloaded constructors, getters, state-updating methods, and a `toString()` method. Then add comparison methods such as `hasSameAuthor()` and `isSameBook()`.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Book-Class"
				}
			],
			supplementalProjects: [
				{
					title: "JM2 Supplemental Project 1: Boba Shop",
					content:
						"Create a `Boba` class with multiple constructors, update methods, and a comparison method to check whether two drink orders are the same.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Supplemental-Project-2-Boba"
				}
			]
		},
		{
			title: "JM3 Static Variables & Methods",
			curriculum: [
				{
					title: "JM3 Project 1: Quiz Class",
					content:
						"Create a `Quiz` class with instance data, multiple constructors, getters, and a `toString()` method, then add a static variable and static getter to track how many quizzes have been created.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Quiz-Class"
				},
				{
					title: "Static Variables and Methods",
					content:
						"Use static members for class-wide information and practice calling static methods through the class itself rather than through an object."
				},
				{
					title: "JM3 Project 2: House Class",
					content:
						"Create a `House` class with a static total count, implement `Comparable<House>`, sort an array of houses by price with square footage as a tiebreaker, and print the sorted results.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-House-Class"
				},
				{
					title: "compareTo Method",
					content:
						"Learn how `compareTo()` defines ordering for custom objects and why that ordering enables `Arrays.sort()` to work on arrays of those objects."
				}
			],
			supplementalProjects: [
				{
					title: "JM3 Supplemental Project 1: Basketball Statistics",
					content:
						"Create a `Player` class with stats, sorting behavior, and foul tracking, then sort a team of players and determine whether each player is disqualified.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Supplemental-Project-1-Basketball-Statistics"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this module as a low-pressure review of object-oriented programming basics in Java, including classes, constructors, instance methods, static members, and comparable objects.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1"
				},
				{
					title: "Check-In #1: Classes and Objects",
					content:
						"Review the difference between a class and an object by creating a `Car` class with private instance variables, multiple constructors, and several `Car` instances in `main()`."
				},
				{
					title: "Check-In #1: Class Methods",
					content:
						"Add getters, a `drive` method, a `toString` method, and a comparison method such as `sameMileage()` that takes another object and checks shared state."
				},
				{
					title: "Check-In #1: Static Variables and Methods",
					content:
						"Use a static variable to track how many `Car` objects exist and a static getter method to return that class-wide count."
				},
				{
					title: "Check-In #1: Comparable Objects",
					content:
						"Implement `Comparable` for the `Car` class, define `compareTo()`, sort an array of cars, and explain when `compareTo()` should return `-1`, `0`, or `1`."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Create a comparable `Card` class with rank and suit, implement constructors and getters, write `toString()`, define `compareTo()`, and sort an array of randomly generated cards.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1-Additional-Project"
				}
			],
			supplementalProjects: []
		},
		{
			title: "JM4 Subclasses & Inheritance",
			curriculum: [
				{
					title: "Subclasses",
					content:
						"Learn how subclasses extend superclasses, inherit public behavior, and add or override their own features while still respecting encapsulation."
				},
				{
					title: "JM4 Project 1: Rectangle and Square Class",
					content:
						"Create a `Rectangle` class, then create a `Square` subclass that uses `extends`, calls parent constructors with `super()`, and optionally overrides methods such as `getArea()`.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Rectangle-and-Square-Class"
				},
				{
					title: "JM4 Project 2: Book and PictureBook Class",
					content:
						"Extend a previous `Book` class by creating a `PictureBook` subclass with an illustrator field, custom comparison methods, and an overridden `toString()` method.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Book-and-PictureBook-Class"
				},
				{
					title: "JM4 Project 3: Vehicle Inheritance",
					content:
						"Use a starter project with `Vehicle`, `LandVehicle`, `Car`, and `Motorcycle` classes to practice multi-level inheritance, `super`, and subclass-specific implementations.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Project-3-Vehicle-Inheritance-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Project-3-Vehicle-Inheritance"
				}
			],
			supplementalProjects: [
				{
					title: "JM4 Supplemental Project 1: Pet, Dog, and Cat Class",
					content:
						"Create a `Pet` superclass with `Dog` and `Cat` subclasses, override `toString()`, add subclass-specific behaviors, and optionally extend the hierarchy with another pet type.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Supplemental-Project-1-Pet-Dog-and-Cat-Class"
				},
				{
					title: "JM4 Supplemental Project 2: Lesson and DanceLesson Class",
					content:
						"Create a `Lesson` class, extend it with a `DanceLesson` subclass, sort lesson objects, and write comparison helpers based on difficulty.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Lesson-and-DanceLesson-Class"
				}
			]
		},
		{
			title: "JM5 Maps",
			curriculum: [
				{
					title: "Maps",
					content:
						"Learn how Java maps store key-value pairs and why they are useful for contact lists, lookups, inventories, and other associative data problems."
				},
				{
					title: "Using a Java Map",
					content:
						"Practice `put()`, `get()`, `containsKey()`, `remove()`, `size()`, `keySet()`, `values()`, `getOrDefault()`, and `putIfAbsent()` while working with `HashMap` examples.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Maps"
				},
				{
					title: "JM5 Project 1: Letter Frequencies",
					content:
						"Read a sentence from the user, build a frequency map of its letters, print the map contents, and determine which character appears most often.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Letter-Frequencies"
				},
				{
					title: "JM5 Project 2: Dealership Database",
					content:
						"Extend the vehicle inheritance project by using a map to build a dealership inventory keyed by vehicle identification number, with methods to add, remove, search, and display cars.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-PROJECT-2-DealershipDatabase"
				}
			],
			supplementalProjects: [
				{
					title: "JM5 Supplemental Project 1: Lending Library",
					content:
						"Build a library lookup program using a map from book titles to authors, with searching and full inventory display.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Supplemental-Project-1-Lending-Library"
				}
			]
		},
		{
			title: "JM6 Threading & Error Handling",
			curriculum: [
				{
					title: "Errors and Exception Handling",
					content:
						"Review exceptions as a way to detect and manage problems in a program, then use `try-catch` blocks to keep programs running even when some operations fail."
				},
				{
					title: "JM6 Project 1: Try-Catch This",
					content:
						"Practice writing `try-catch` blocks for arithmetic errors such as division by zero and array access errors such as out-of-bounds indices.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Try-Catch-Practice"
				},
				{
					title: "Threading in Java",
					content:
						"Learn how a thread creates an independent path of execution, how `run()` and `start()` work together, and how `sleep()` introduces delays that often need `try-catch` protection."
				},
				{
					title: "JM6 Project 2: Bouncing Zeros",
					content:
						"Create a simple console animation by printing a moving `0`, updating its position, and running the animation inside a thread with controlled timing.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Bouncing-Zeros"
				}
			],
			supplementalProjects: [
				{
					title: "JM6 Supplemental Project 1: Barnyard Orchestra",
					content:
						"Use multiple threads to create a simple orchestra of repeating animal sounds played at different intervals.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Supplemental-Project-1-Barnyard-Orchestra"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"Use this review to revisit inheritance, method overriding, threading, try-catch handling, and maps. This module combines reading existing class code with extending it in new directions.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/blob/main/JM-Check-in-2-Starter-Updated/Main.java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/blob/main/JM-Check-in-2-Updated/Main.java"
				},
				{
					title: "Check-In #2: Inheritance",
					content:
						"Read and analyze an `HourClock` class, then create a `RomanClock` subclass that extends the original behavior and overrides `displayTime()`."
				},
				{
					title: "Check-In #2: Threading and Error Handling",
					content:
						"Add a thread to a clock so it updates itself over time, define `start()` and `run()`, use `sleep()` to delay updates, and explain how `try-catch` protects the program when thread-related exceptions occur."
				},
				{
					title: "Check-In #2: Maps",
					content:
						"Create a map inside the `RomanClock` class, populate it with Roman numeral keys and decimal values, iterate through the entries, and conditionally insert missing values."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Create a `MinuteClock` subclass that tracks minutes as well as hours, overrides `displayTime()`, and updates both fields correctly in `tick()`.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Additional-Project"
				}
			],
			supplementalProjects: []
		},
		{
			title: "JM7 Bank Account",
			curriculum: [
				{
					title: "JM7 Project 1: Bank Account",
					content:
						"Design and build a `BankAccount` class and a `BankSystem` class that manages accounts with a map. Implement methods for registration, login, deposits, withdrawals, password changes, and balance checks.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Bank-Account"
				}
			],
			supplementalProjects: [
				{
					title: "JM7 Supplemental Project 1: Calculator",
					content:
						"Create a `Calculator` class with methods for arithmetic operations, factorials, and exponents, then build a console interface for the user to choose operations and inputs.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/blob/main/JM7-Calculator/src/main/java/Main.java"
				}
			]
		},
		{
			title: "JM8 File I/O",
			curriculum: [
				{
					title: "Writing to a File",
					content:
						"Use `FileWriter` inside a try-with-resources block to create or open files and write lines of output directly to disk instead of only printing to the console.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Writing-to-a-File"
				},
				{
					title: "JM8 Project 1: Crazy Name Tags Printer",
					content:
						"Ask the user for a name, then write different letter-by-letter transformations of that name into one or more files.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-1-Crazy-Name-Tags-Printer"
				},
				{
					title: "Reading from a File",
					content:
						"Use `File` and `Scanner` inside `try-catch` logic to read lines from a text file, collect them into a string, and close resources properly after reading.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/blob/main/JM8-Reading-from-a-File/src/main/java/Main.java"
				},
				{
					title: "JM8 Project 2: File IO and Maps",
					content:
						"Read alternating lines from a file and load them into a map so odd-numbered lines become keys and the following lines become their values.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/blob/main/JM8-Project-2-File-IO-and-Maps/src/main/java/Main.java"
				}
			],
			supplementalProjects: [
				{
					title: "JM8 Supplemental Project 1: Bank Account with File I/O",
					content:
						"Extend the bank account system so account information can be saved to a file and loaded again when the program starts.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/blob/main/JM8-Supplemental-Project-Bank-Account/src/main/java/Main.java"
				}
			]
		},
		{
			title: "JM9 Maze Runner",
			curriculum: [
				{
					title: "JM9 Project 1: Maze Reader",
					content:
						"Create a `Maze` class that reads maze layouts from text files, stores the starting position, prints the maze, and determines whether moves and exits are valid.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Reader-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Reader"
				},
				{
					title: "JM9 Project 2: Maze Runner",
					content:
						"Build a playable maze game by adding a `Player` class and a `MazeGame` controller that processes user input, updates player movement, and ends the game when the exit is reached.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-2"
				}
			],
			supplementalProjects: [
				{
					title: "JM9 Supplemental Project 1: Maze Runner Part 3",
					content:
						"Add a countdown timer to the maze game with threading and end the game when time runs out.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-3"
				}
			]
		},
		{
			title: "JM10 Master Project",
			curriculum: [
				{
					title: "JM10 Master Project",
					content:
						"Design and build an original console-based Java project that showcases the key ideas from the course, such as classes, inheritance, maps, file I/O, error handling, and larger multi-class program structure."
				},
				{
					title: "Master Project Planning",
					content:
						"Brainstorm games, simulations, or real-world tools, then write out the main steps and data structures before coding. Example directions include tic-tac-toe, quiz games, or other projects inspired by earlier modules."
				},
				{
					title: "Portfolio Project",
					content:
						"Learn how to move a finished project from Replit to GitHub by creating a repository, initializing Git in Replit, connecting the project, and pushing the code so it can become part of a public coding portfolio."
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including classes and objects, constructors, static members, inheritance, maps, threading, error handling, file I/O, and multi-class Java applications."
				}
			],
			supplementalProjects: []
		},
		{
			title: "JM11 Repo Extension and Reference Library",
			curriculum: [
				{
					title: "How to Use the Extra Java Level 2 Folders",
					content:
						"Treat the additional `Java-Level-2` folders as a deliberate extension bank for file I/O, exception handling, data-structure examples, and alternate console projects. They reinforce the main course rather than replacing it."
				},
				{
					title: "Reference and Solution Boundaries",
					content:
						"Starter-only or solution-only folders stay support-oriented. The public course surfaces the most useful ones below while still keeping the main Java 2 progression readable."
				},
				{
					title: "When to Reach for the Extension Bank",
					content:
						"Use these extensions when a student needs more structured practice with maps, file handling, console project design, or threading previews before moving on to higher-level Java work."
				}
			],
			supplementalProjects: [
				{
					title: "Extension: stdin/stdout Practice",
					content:
						"Use a focused console-I/O exercise when students need more confidence with Java input/output mechanics in isolation.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-stdinstdout"
				},
				{
					title: "Extension: Java File I/O",
					content:
						"Use the dedicated file-I/O folder when the student needs one more direct pass over reading, writing, and file handling before the larger JM8 work.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Java-File-IO"
				},
				{
					title: "Reference: HashMaps Examples",
					content:
						"Keep a smaller maps example bank available when the main dealership or file-I/O projects feel too large for the immediate practice need.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Java-HashMaps-Examples"
				},
				{
					title: "Extension: Dog Class Test",
					content:
						"Use the dog-class test harness as a lightweight object-model review before students move into the later multi-class projects.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Dog-Class-Test"
				},
				{
					title: "Extension: Tic Tac Toe Console",
					content:
						"Use a compact console game to reinforce control flow, object organization, and user interaction without the complexity of the maze branch.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM10_TicTacToeConsole"
				},
				{
					title: "Preview: Threading Example",
					content:
						"Keep the threading example visible as a preview for students who are ready to see how timed or concurrent behavior starts to appear in Java.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Threading-Example"
				},
				{
					title: "Reference: Try-Catch Example",
					content:
						"Use a smaller exception-handling example when students need a cleaner reference than the larger try-catch projects.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Try-Catch-Example"
				},
				{
					title: "Extension: Password Management System",
					content:
						"Use a stronger practical console project to reinforce classes, file handling, and guarded user interaction in one place.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM_Password-Management-System"
				}
			]
		}
	]
};
