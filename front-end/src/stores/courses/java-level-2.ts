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
						"Learn how a class acts as a template and an object acts as an instance with its own data and behavior. Use this module to connect class design to real-world entities. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
						"Connect the `Dog` class to broader OOP ideas such as modularity, reusability, encapsulation, and scalability. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JM1 Supplemental Project 1: Employee Class",
					content:
						"Create an `Employee` class with identifying information, getters, setters, and a `toString()` method, then create and update employee objects in `main()`. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Supplemental-Project-1-Employee",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Supplemental-Project-1-Employee"
				},
				{
					title: "Project 2 File IO and Maps",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM1 Instance Variables, Constructors, and Methods. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-2-File-IO-and-Maps"
				},
				{
					title: "Reading from a File",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM1 Instance Variables, Constructors, and Methods. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Reading-from-a-File"
				}
			]
		},
		{
			title: "JM2 Overloaded Constructors & Comparison Methods",
			curriculum: [
				{
					title: "JM2 Project 1: Person Class",
					content:
						"Create a `Person` class with core instance variables, constructors, getters, setters, and `toString()`, then create multiple people and update their state through methods. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Person-Class",
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Book-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Book-Class"
				},
				{
					title: "Overloaded Constructors & Comparison Methods: Verification and Reflection",
					content:
						"Close JM2 Overloaded Constructors & Comparison Methods by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				}
			],
			supplementalProjects: [
				{
					title: "JM2 Supplemental Project 1: Boba Shop",
					content:
						"Create a `Boba` class with multiple constructors, update methods, and a comparison method to check whether two drink orders are the same. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Supplemental-Project-2-Boba",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Supplemental-Project-2-Boba"
				},
				{
					title: "Supplemental Project Bank Account",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM2 Overloaded Constructors & Comparison Methods. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Supplemental-Project-Bank-Account"
				},
				{
					title: "Master Project Example Quiz Game",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM2 Overloaded Constructors & Comparison Methods. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Master-Project-Example-Quiz-Game"
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
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Quiz-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Quiz-Class"
				},
				{
					title: "Static Variables and Methods",
					content:
						"Use static members for class-wide information and practice calling static methods through the class itself rather than through an object. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JM3 Project 2: House Class",
					content:
						"Create a `House` class with a static total count, implement `Comparable<House>`, sort an array of houses by price with square footage as a tiebreaker, and print the sorted results. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-House-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-House-Class"
				},
				{
					title: "compareTo Method",
					content:
						"Learn how `compareTo()` defines ordering for custom objects and why that ordering enables `Arrays.sort()` to work on arrays of those objects. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JM3 Supplemental Project 1: Basketball Statistics",
					content:
						"Create a `Player` class with stats, sorting behavior, and foul tracking, then sort a team of players and determine whether each player is disqualified. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Supplemental-Project-1-Basketball-Statistics",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Supplemental-Project-1-Basketball-Statistics"
				},
				{
					title: "Maze Runner",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM3 Static Variables & Methods. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner"
				},
				{
					title: "Static Variables & Methods supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM3 Static Variables & Methods. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X01-jm3-static-variables-methods-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X01-jm3-static-variables-methods-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"Use this module as a low-pressure review of object-oriented programming basics in Java, including classes, constructors, instance methods, static members, and comparable objects. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1"
				},
				{
					title: "Check-In #1: Classes and Objects",
					content:
						"Review the difference between a class and an object by creating a `Car` class with private instance variables, multiple constructors, and several `Car` instances in `main()`. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Class Methods",
					content:
						"Add getters, a `drive` method, a `toString` method, and a comparison method such as `sameMileage()` that takes another object and checks shared state. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Static Variables and Methods",
					content:
						"Use a static variable to track how many `Car` objects exist and a static getter method to return that class-wide count. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Comparable Objects",
					content:
						"Implement `Comparable` for the `Car` class, define `compareTo()`, sort an array of cars, and explain when `compareTo()` should return `-1`, `0`, or `1`. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Create a comparable `Card` class with rank and suit, implement constructors and getters, write `toString()`, define `compareTo()`, and sort an array of randomly generated cards. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1-Additional-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1-Additional-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #1: Extension Challenge",
					content:
						"Extend the work from Check-In #1 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1"
				},
				{
					title: "Check In #1 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X02-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X02-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check In #1 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X03-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X03-check-in-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM4 Subclasses & Inheritance",
			curriculum: [
				{
					title: "Subclasses",
					content:
						"Learn how subclasses extend superclasses, inherit public behavior, and add or override their own features while still respecting encapsulation. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JM4 Project 1: Rectangle and Square Class",
					content:
						"Create a `Rectangle` class, then create a `Square` subclass that uses `extends`, calls parent constructors with `super()`, and optionally overrides methods such as `getArea()`. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Rectangle-and-Square-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Rectangle-and-Square-Class"
				},
				{
					title: "JM4 Project 2: Book and PictureBook Class",
					content:
						"Extend a previous `Book` class by creating a `PictureBook` subclass with an illustrator field, custom comparison methods, and an overridden `toString()` method. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Book-and-PictureBook-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Book-and-PictureBook-Class"
				},
				{
					title: "JM4 Project 3: Vehicle Inheritance",
					content:
						"Use a starter project with `Vehicle`, `LandVehicle`, `Car`, and `Motorcycle` classes to practice multi-level inheritance, `super`, and subclass-specific implementations. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Create a `Pet` superclass with `Dog` and `Cat` subclasses, override `toString()`, add subclass-specific behaviors, and optionally extend the hierarchy with another pet type. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Supplemental-Project-1-Pet-Dog-and-Cat-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Supplemental-Project-1-Pet-Dog-and-Cat-Class"
				},
				{
					title: "JM4 Supplemental Project 2: Lesson and DanceLesson Class",
					content:
						"Create a `Lesson` class, extend it with a `DanceLesson` subclass, sort lesson objects, and write comparison helpers based on difficulty. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Lesson-and-DanceLesson-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Lesson-and-DanceLesson-Class"
				},
				{
					title: "Subclasses & Inheritance supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM4 Subclasses & Inheritance. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X04-jm4-subclasses-inheritance-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X04-jm4-subclasses-inheritance-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM5 Maps",
			curriculum: [
				{
					title: "Maps",
					content:
						"Learn how Java maps store key-value pairs and why they are useful for contact lists, lookups, inventories, and other associative data problems. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Using a Java Map",
					content:
						"Practice `put()`, `get()`, `containsKey()`, `remove()`, `size()`, `keySet()`, `values()`, `getOrDefault()`, and `putIfAbsent()` while working with `HashMap` examples. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Maps"
				},
				{
					title: "JM5 Project 1: Letter Frequencies",
					content:
						"Read a sentence from the user, build a frequency map of its letters, print the map contents, and determine which character appears most often. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Letter-Frequencies",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Letter-Frequencies"
				},
				{
					title: "JM5 Project 2: Dealership Database",
					content:
						"Extend the vehicle inheritance project by using a map to build a dealership inventory keyed by vehicle identification number, with methods to add, remove, search, and display cars. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-PROJECT-2-DealershipDatabase",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-PROJECT-2-DealershipDatabase"
				}
			],
			supplementalProjects: [
				{
					title: "JM5 Supplemental Project 1: Lending Library",
					content:
						"Build a library lookup program using a map from book titles to authors, with searching and full inventory display. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Supplemental-Project-1-Lending-Library",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Supplemental-Project-1-Lending-Library"
				},
				{
					title: "Maps supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM5 Maps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X05-jm5-maps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X05-jm5-maps-supplemental-2/solution"
				},
				{
					title: "Maps supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM5 Maps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X06-jm5-maps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X06-jm5-maps-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM6 Threading & Error Handling",
			curriculum: [
				{
					title: "Errors and Exception Handling",
					content:
						"Review exceptions as a way to detect and manage problems in a program, then use `try-catch` blocks to keep programs running even when some operations fail. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JM6 Project 1: Try-Catch This",
					content:
						"Practice writing `try-catch` blocks for arithmetic errors such as division by zero and array access errors such as out-of-bounds indices. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Try-Catch-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Try-Catch-Practice"
				},
				{
					title: "Threading in Java",
					content:
						"Learn how a thread creates an independent path of execution, how `run()` and `start()` work together, and how `sleep()` introduces delays that often need `try-catch` protection. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JM6 Project 2: Bouncing Zeros",
					content:
						"Create a simple console animation by printing a moving `0`, updating its position, and running the animation inside a thread with controlled timing. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Bouncing-Zeros",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Bouncing-Zeros"
				}
			],
			supplementalProjects: [
				{
					title: "JM6 Supplemental Project 1: Barnyard Orchestra",
					content:
						"Use multiple threads to create a simple orchestra of repeating animal sounds played at different intervals. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Supplemental-Project-1-Barnyard-Orchestra",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Supplemental-Project-1-Barnyard-Orchestra"
				},
				{
					title: "Threading & Error Handling supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM6 Threading & Error Handling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X07-jm6-threading-error-handling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X07-jm6-threading-error-handling-supplemental-2/solution"
				},
				{
					title: "Threading & Error Handling supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM6 Threading & Error Handling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X08-jm6-threading-error-handling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X08-jm6-threading-error-handling-supplemental-3/solution"
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
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Updated"
				},
				{
					title: "Check-In #2: Inheritance",
					content:
						"Read and analyze an `HourClock` class, then create a `RomanClock` subclass that extends the original behavior and overrides `displayTime()`. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Threading and Error Handling",
					content:
						"Add a thread to a clock so it updates itself over time, define `start()` and `run()`, use `sleep()` to delay updates, and explain how `try-catch` protects the program when thread-related exceptions occur."
				},
				{
					title: "Check-In #2: Maps",
					content:
						"Create a map inside the `RomanClock` class, populate it with Roman numeral keys and decimal values, iterate through the entries, and conditionally insert missing values. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Create a `MinuteClock` subclass that tracks minutes as well as hours, overrides `displayTime()`, and updates both fields correctly in `tick()`. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Additional-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Additional-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check In #2: Extension Challenge",
					content:
						"Extend the work from Check-In #2 with a tighter constraint, one extra feature, or a slightly more realistic input case. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Updated"
				},
				{
					title: "Check In #2 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X09-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X09-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check In #2 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Check-In #2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X10-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X10-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM7 Bank Account",
			curriculum: [
				{
					title: "JM7 Project 1: Bank Account",
					content:
						"Design and build a `BankAccount` class and a `BankSystem` class that manages accounts with a map. Implement methods for registration, login, deposits, withdrawals, password changes, and balance checks.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Bank-Account",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Bank-Account"
				},
				{
					title: "Bank Account: Debugging and Failure Modes",
					content:
						"Focus on the mistakes students are most likely to make in JM7 Bank Account. Have them diagnose a broken attempt, repair it, and explain why the fix works. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Bank Account: Planning and Architecture",
					content:
						"Break JM7 Bank Account into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Bank Account: Verification and Reflection",
					content:
						"Close JM7 Bank Account by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JM7 Supplemental Project 1: Calculator",
					content:
						"Create a `Calculator` class with methods for arithmetic operations, factorials, and exponents, then build a console interface for the user to choose operations and inputs. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Calculator/src/main/java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Calculator/src/main/java"
				},
				{
					title: "Bank Account supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM7 Bank Account. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X11-jm7-bank-account-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X11-jm7-bank-account-supplemental-2/solution"
				},
				{
					title: "Bank Account supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM7 Bank Account. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X12-jm7-bank-account-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X12-jm7-bank-account-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM8 File I/O",
			curriculum: [
				{
					title: "Writing to a File",
					content:
						"Use `FileWriter` inside a try-with-resources block to create or open files and write lines of output directly to disk instead of only printing to the console. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Writing-to-a-File"
				},
				{
					title: "JM8 Project 1: Crazy Name Tags Printer",
					content:
						"Ask the user for a name, then write different letter-by-letter transformations of that name into one or more files. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-1-Crazy-Name-Tags-Printer",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-1-Crazy-Name-Tags-Printer"
				},
				{
					title: "Reading from a File",
					content:
						"Use `File` and `Scanner` inside `try-catch` logic to read lines from a text file, collect them into a string, and close resources properly after reading. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Reading-from-a-File/src/main/java"
				},
				{
					title: "JM8 Project 2: File IO and Maps",
					content:
						"Read alternating lines from a file and load them into a map so odd-numbered lines become keys and the following lines become their values. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-2-File-IO-and-Maps/src/main/java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-2-File-IO-and-Maps/src/main/java"
				}
			],
			supplementalProjects: [
				{
					title: "JM8 Supplemental Project 1: Bank Account with File I/O",
					content:
						"Extend the bank account system so account information can be saved to a file and loaded again when the program starts. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Supplemental-Project-Bank-Account/src/main/java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Supplemental-Project-Bank-Account/src/main/java"
				},
				{
					title: "File I/O supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM8 File I/O. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X13-jm8-file-i-o-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X13-jm8-file-i-o-supplemental-2/solution"
				},
				{
					title: "File I/O supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM8 File I/O. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X14-jm8-file-i-o-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X14-jm8-file-i-o-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM9 Maze Runner",
			curriculum: [
				{
					title: "JM9 Project 1: Maze Reader",
					content:
						"Create a `Maze` class that reads maze layouts from text files, stores the starting position, prints the maze, and determines whether moves and exits are valid. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Reader-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Reader"
				},
				{
					title: "JM9 Project 2: Maze Runner",
					content:
						"Build a playable maze game by adding a `Player` class and a `MazeGame` controller that processes user input, updates player movement, and ends the game when the exit is reached. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-2",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-2"
				},
				{
					title: "Maze Runner: Planning and Architecture",
					content:
						"Break JM9 Maze Runner into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Maze Runner: Verification and Reflection",
					content:
						"Close JM9 Maze Runner by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JM9 Supplemental Project 1: Maze Runner Part 3",
					content:
						"Add a countdown timer to the maze game with threading and end the game when time runs out. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-3",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-3"
				},
				{
					title: "Maze Runner supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM9 Maze Runner. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X15-jm9-maze-runner-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X15-jm9-maze-runner-supplemental-2/solution"
				},
				{
					title: "Maze Runner supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM9 Maze Runner. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X16-jm9-maze-runner-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X16-jm9-maze-runner-supplemental-3/solution"
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
				},
				{
					title: "JM10 Master Project: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Calculator"
				}
			],
			supplementalProjects: [
				{
					title: "JM10 Master Project: Extension Challenge",
					content:
						"Extend the work from JM10 Master Project with a tighter constraint, one extra feature, or a slightly more realistic input case. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Calculator"
				},
				{
					title: "Master Project supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM10 Master Project. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X17-jm10-master-project-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X17-jm10-master-project-supplemental-2/solution"
				},
				{
					title: "Master Project supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to JM10 Master Project. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X18-jm10-master-project-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X18-jm10-master-project-supplemental-3/solution"
				}
			]
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
						"Starter-only or solution-only folders stay support-oriented. The public course surfaces the most useful ones below while still keeping the main Java 2 progression readable. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "When to Reach for the Extension Bank",
					content:
						"Use these extensions when a student needs more structured practice with maps, file handling, console project design, or threading previews before moving on to higher-level Java work. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Repo Extension and Reference Library: Verification and Reflection",
					content:
						"Close JM11 Repo Extension and Reference Library by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "JM11 Repo Extension and Reference Library: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-stdinstdout"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: stdin/stdout Practice",
					content:
						"Use a focused console-I/O exercise when students need more confidence with Java input/output mechanics in isolation. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-stdinstdout"
				},
				{
					title: "Extension: Java File I/O",
					content:
						"Use the dedicated file-I/O folder when the student needs one more direct pass over reading, writing, and file handling before the larger JM8 work. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Java-File-IO"
				},
				{
					title: "Reference: HashMaps Examples",
					content:
						"Keep a smaller maps example bank available when the main dealership or file-I/O projects feel too large for the immediate practice need. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Java-HashMaps-Examples"
				},
				{
					title: "Extension: Dog Class Test",
					content:
						"Use the dog-class test harness as a lightweight object-model review before students move into the later multi-class projects. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Dog-Class-Test"
				},
				{
					title: "Extension: Tic Tac Toe Console",
					content:
						"Use a compact console game to reinforce control flow, object organization, and user interaction without the complexity of the maze branch. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM10_TicTacToeConsole"
				},
				{
					title: "Preview: Threading Example",
					content:
						"Keep the threading example visible as a preview for students who are ready to see how timed or concurrent behavior starts to appear in Java. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Threading-Example"
				},
				{
					title: "Reference: Try-Catch Example",
					content:
						"Use a smaller exception-handling example when students need a cleaner reference than the larger try-catch projects. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Try-Catch-Example"
				},
				{
					title: "Extension: Password Management System",
					content:
						"Use a stronger practical console project to reinforce classes, file handling, and guarded user interaction in one place. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM_Password-Management-System"
				}
			]
		},
		{
			title: "Applied Studio 14: JM Master Project Example Quiz Game",
			curriculum: [
				{
					title: "JM Master Project Example Quiz Game: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: JM Master Project Example Quiz Game, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "JM Master Project Example Quiz Game: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: JM Master Project Example Quiz Game, naming the key inputs, the expected outputs, and the checkpoints worth verifying early."
				},
				{
					title: "JM Master Project Example Quiz Game: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: JM Master Project Example Quiz Game. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM_Master-Project-Example-Quiz-Game"
				},
				{
					title: "JM Master Project Example Quiz Game: Review and Reflection",
					content:
						"Close Applied Studio 14: JM Master Project Example Quiz Game by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "JM Master Project Example Quiz Game: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: JM Master Project Example Quiz Game with one extra requirement, stricter input handling, or a more realistic variation of the same task. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM_Master-Project-Example-Quiz-Game"
				},
				{
					title: "Applied Studio 14: JM Master Project Example Quiz Game supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: JM Master Project Example Quiz Game. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X19-applied-studio-14-jm-master-project-example-quiz/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X19-applied-studio-14-jm-master-project-example-quiz/solution"
				},
				{
					title: "Applied Studio 14: JM Master Project Example Quiz Game supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: JM Master Project Example Quiz Game. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X20-applied-studio-14-jm-master-project-example-quiz/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X20-applied-studio-14-jm-master-project-example-quiz/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: JM Maze Runner Project",
			curriculum: [
				{
					title: "JM Maze Runner Project: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: JM Maze Runner Project, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "JM Maze Runner Project: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: JM Maze Runner Project, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				},
				{
					title: "JM Maze Runner Project: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: JM Maze Runner Project. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM_Maze-Runner-Project-Solution"
				},
				{
					title: "JM Maze Runner Project: Review and Reflection",
					content:
						"Close Applied Studio 15: JM Maze Runner Project by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			],
			supplementalProjects: [
				{
					title: "JM Maze Runner Project: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: JM Maze Runner Project with one extra requirement, stricter input handling, or a more realistic variation of the same task. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM_Maze-Runner-Project-Solution"
				},
				{
					title: "Applied Studio 15: JM Maze Runner Project supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: JM Maze Runner Project. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X21-applied-studio-15-jm-maze-runner-project-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X21-applied-studio-15-jm-maze-runner-project-supplem/solution"
				},
				{
					title: "Applied Studio 15: JM Maze Runner Project supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: JM Maze Runner Project. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X22-applied-studio-15-jm-maze-runner-project-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X22-applied-studio-15-jm-maze-runner-project-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: JM Check in 2",
			curriculum: [
				{
					title: "JM Check in 2: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: JM Check in 2, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JM Check in 2: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: JM Check in 2, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JM Check in 2: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: JM Check in 2. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2"
				},
				{
					title: "JM Check in 2: Review and Reflection",
					content:
						"Close Applied Studio 16: JM Check in 2 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JM Check in 2: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: JM Check in 2 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2"
				},
				{
					title: "Applied Studio 16: JM Check in 2 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: JM Check in 2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X23-applied-studio-16-jm-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X23-applied-studio-16-jm-check-in-2-supplemental-2/solution"
				},
				{
					title: "Applied Studio 16: JM Check in 2 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: JM Check in 2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X24-applied-studio-16-jm-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X24-applied-studio-16-jm-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: JM Check in 2",
			curriculum: [
				{
					title: "JM Check in 2: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: JM Check in 2, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JM Check in 2: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: JM Check in 2, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "JM Check in 2: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: JM Check in 2. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Starter"
				},
				{
					title: "JM Check in 2: Review and Reflection",
					content:
						"Close Applied Studio 17: JM Check in 2 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "JM Check in 2: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: JM Check in 2 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Starter"
				},
				{
					title: "Applied Studio 17: JM Check in 2 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: JM Check in 2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X25-applied-studio-17-jm-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X25-applied-studio-17-jm-check-in-2-supplemental-2/solution"
				},
				{
					title: "Applied Studio 17: JM Check in 2 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: JM Check in 2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X26-applied-studio-17-jm-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2X26-applied-studio-17-jm-check-in-2-supplemental-3/solution"
				}
			]
		}
	]
};
