import type { RawCourse } from "./types";

export const cppLevel1Course: RawCourse = {
	name: "C++ Level 1",
	modules: [
		{
			title: "CPPF1 Variables, Types, Strings, and Input/Output",
			curriculum: [
				{
					title: "Creating and Running a C++ Program",
					content:
						"Start with a single-file console program, the `#include` lines it needs, and the idea that C++ is compiled before it runs. The goal is to make braces, semicolons, and `std::cout` feel normal before the syntax load rises."
				},
				{
					title: "Primitive Types and Strings",
					content:
						"Teach integers, doubles, booleans, chars, and `std::string` as the core beginner value types. Students should create variables, read input, print values clearly, and understand simple indexing and string length before moving on.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Primitive-Types-and-Strings-Reference"
				},
				{
					title: "Input and Output",
					content:
						"Use `std::cin` and `std::cout` to build confidence with typed input and formatted output. The point here is not clever formatting. It is reliable reading, storing, and printing of user-provided values.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Input-and-Output-Reference"
				},
				{
					title: "CPPF1 Project 1: Mad Libs",
					content:
						"Build a short Mad Libs generator with string variables, prompts, and a printed story. Students should name their variables well, test at least two custom stories, and explain how inputs move through the program.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Mad-Libs",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Mad-Libs"
				},
				{
					title: "CPPF1 Project 2: Chat Bot",
					content:
						"Use strings, input, and simple arithmetic to make a small interactive chatbot. This is still a syntax-and-confidence project, not an algorithmic challenge.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Chat-Bot",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Chat-Bot"
				}
			],
			supplementalProjects: [
				{
					title: "Variables and Input/Output: Extension Challenge",
					content:
						"Extend the early syntax work with one extra input case, one more formatted output step, or a slightly more realistic text-processing task.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Variables-Types-and-Input-and-Output-Supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Variables-Types-and-Input-and-Output-Supplemental-2/solution"
				}
			]
		},
		{
			title: "CPPF2 Loops and Conditionals",
			curriculum: [
				{
					title: "Conditionals and Branching",
					content:
						"Teach `if`, `else if`, and `else` as the first control-flow fork. Students should compare values cleanly and explain why one branch runs instead of another."
				},
				{
					title: "For Loops and While Loops",
					content:
						"Teach loops as controlled repetition with clear start, stop, and update logic. Counted loops and condition-driven loops should both feel readable before students build larger games.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-For-Loop-Practice"
				},
				{
					title: "CPPF2 Project 1: Number Games",
					content:
						"Build small loop-driven tasks such as counting between bounds, summing values, and computing averages. The main habit here is tracing loop state instead of guessing.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Number-Games"
				},
				{
					title: "CPPF2 Project 2: Rock, Paper, Scissors",
					content:
						"Use conditionals to compare choices and decide winners. This project should feel like branching logic practice, not like a giant design exercise.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Rock-Paper-Scissors",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Rock-Paper-Scissors"
				},
				{
					title: "CPPF2 Project 3: Fizz Buzz",
					content:
						"Use modular arithmetic and ordered condition checks to build a correct Fizz Buzz solution. This is a compact way to reinforce both loops and branching.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Fizz-Buzz",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-Fizz-Buzz"
				}
			],
			supplementalProjects: [
				{
					title: "Loops and Conditionals: While-Loop Drill",
					content:
						"Use a short while-loop reinforcement task when termination logic is still shaky.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-While-Loop-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF2-While-Loop-Practice"
				}
			]
		},
		{
			title: "CPPF3 Functions",
			curriculum: [
				{
					title: "Function Signatures and Return Values",
					content:
						"Teach functions as named units of work with parameters and return types. Students should be able to read a signature and describe what a function needs and what it gives back."
				},
				{
					title: "Decomposition and Reuse",
					content:
						"Use functions to break a larger program into smaller steps. The main idea is not clever abstraction. It is reducing repeated code and making logic easier to test.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Function-Practice"
				},
				{
					title: "Randomness and Small Simulations",
					content:
						"Introduce `rand()` and simple simulation work only after students are comfortable with basic function calls. Randomness is useful here because it creates a reason to write helper functions instead of one long `main`.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-rand-Reference"
				},
				{
					title: "CPPF3 Project 1: Probability Functions",
					content:
						"Write functions that simulate small random events such as coin flips, dice rolls, or card draws. Students should separate generation logic from printing logic.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Probability-Functions",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Probability-Functions"
				},
				{
					title: "CPPF3 Project 2: Number Guesser",
					content:
						"Break the game into input handling, random-number selection, and guess checking. This is the point where function decomposition should start feeling necessary instead of optional.",
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
						"Use a focused starter/solution pair when students need one more pass on function design and testing.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Functions-Supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF3-Functions-Supplemental-2/solution"
				}
			]
		},
		{
			title: "CPPF4 Classes and Objects",
			curriculum: [
				{
					title: "Classes, Objects, and Encapsulation",
					content:
						"Teach a class as a way to package related data and behavior together. Students should understand public vs private access and why getters/setters exist before they start building bigger objects."
				},
				{
					title: "Headers and Source Files",
					content:
						"Use a small multi-file class to teach declarations, definitions, header guards, and the idea that class design spans multiple files in a real project.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Point-Class"
				},
				{
					title: "Constructors and Basic Class Methods",
					content:
						"Introduce default and overloaded constructors, along with clear class methods that print or update object state. Keep the focus on object modeling, not on advanced language detail.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Person-Class"
				},
				{
					title: "CPPF4 Project: Cat Class",
					content:
						"Build a small class with constructors, state updates, and readable output. The project should feel like modeling and method practice, not like memory management practice.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Cat-Class",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Cat-Class"
				}
			],
			supplementalProjects: [
				{
					title: "Classes and Objects: BMI Extension",
					content:
						"Treat the member-initializer-list version as an extension after students are already comfortable with the class shape itself.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Person-Class-with-BMI"
				}
			]
		},
		{
			title: "CPPF5 Vectors and Collection Patterns",
			curriculum: [
				{
					title: "Vectors as Growable Sequences",
					content:
						"Introduce `std::vector` as the default beginner collection for ordered values that can grow over time. This is the missing bridge between simple values and real collection-based programs.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vectors-Reference"
				},
				{
					title: "Passing Vectors to Functions",
					content:
						"Teach vectors in function signatures and simple read-only iteration. Students should be able to explain when they are reading from a collection versus updating it."
				},
				{
					title: "CPPF5 Project 1: Vector Practice",
					content:
						"Use vectors to store values, compute totals, and process strings through helper functions. This replaces the earlier raw-array jump with a safer container-first pattern.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vector-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vector-Practice"
				},
				{
					title: "CPPF5 Project 2: Bank Accounts",
					content:
						"Use a vector of transactions to compute a changing account balance. This is a better first collection project than raw arrays because the data model stays visible without manual resizing mechanics.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts"
				}
			],
			supplementalProjects: [
				{
					title: "Vectors and Collections: Extension Challenge",
					content:
						"Extend one of the vector projects with filtering, searching, or a new summary calculation so students keep practicing collection thinking.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Bank-Accounts"
				}
			]
		},
		{
			title: "CPPF6 Structs and Parameter Passing",
			curriculum: [
				{
					title: "References and Const References",
					content:
						"Teach references as aliases and `const` references as a safe way to avoid unnecessary copying. This should feel like a data-flow topic, not like a pointer topic.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing-Introduction"
				},
				{
					title: "CPPF6 Project 1: Parameter Passing Tracing",
					content:
						"Trace what changes and what does not when values are passed by value, by reference, and by const reference. The goal is to reason about function boundaries clearly.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Parameter-Passing"
				},
				{
					title: "Structs for Small Records",
					content:
						"Introduce `struct` as a lightweight way to group related fields. This is where students should first see simple records such as a student, transaction, or post shape.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Structs-Example"
				},
				{
					title: "CPPF6 Project 2: Defanging a Website Address",
					content:
						"Compare a function that edits a string directly with one that returns a new string. This creates a concrete reason to care about parameter passing choices.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Defanging-a-Website-URL",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Defanging-a-Website-URL"
				}
			],
			supplementalProjects: [
				{
					title: "Structs and Parameter Passing: String Mutation Lab",
					content:
						"Use the string-scrambling lab only after the main parameter-passing work is clear.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Chaos-Monkeys",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF6-Chaos-Monkeys"
				}
			]
		},
		{
			title: "CPPF7 Grids and 2D Vectors",
			curriculum: [
				{
					title: "Nested Vectors as Grids",
					content:
						"Teach a 2D vector as a grid of rows instead of jumping directly into raw multi-dimensional arrays. Students should be able to read `grid[row][col]`, print a grid, and update a cell without worrying about memory layout tricks.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Grids-and-2D-Vectors-Reference"
				},
				{
					title: "Nested Loop Patterns",
					content:
						"Use nested loops to print grids, compute row totals, and scan structured data. This should feel like an extension of vector work, not a completely new mental model."
				},
				{
					title: "CPPF7 Project: Matrix Addition",
					content:
						"Use two 2D vectors with the same dimensions and build a result grid cell by cell. This gives students a clean grid project without manual allocation or pointer arithmetic.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Matrix-Addition",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Matrix-Addition"
				}
			],
			supplementalProjects: [
				{
					title: "CPPF7 Project 2: Grid Statistics",
					content:
						"Extend grid work by computing row totals, column totals, diagonal totals, and the largest value in a rectangular 2D vector. This gives students a second grid project before the Level 1 capstone.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Grid-Statistics",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Grid-Statistics"
				}
			]
		},
		{
			title: "CPPF8 Master Project: Profile Posts",
			curriculum: [
				{
					title: "Combining Structs, Classes, and Vectors",
					content:
						"Model a `Post` as a small record and a `Profile` as a class that owns a vector of posts. This capstone should feel like a natural combination of the earlier class, struct, and collection work."
				},
				{
					title: "Profile Operations and Validation",
					content:
						"Teach add, remove, print, and update operations with index validation. The emphasis is on designing a readable small API, not on manual ownership logic.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts"
				},
				{
					title: "Command Loops and Menu Flow",
					content:
						"Before the capstone is finished, convert one-shot profile operations into a menu-driven command loop. Students should practice prompting until the user chooses to quit, rejecting invalid choices, and keeping input handling separate from the `Profile` methods that update data."
				},
				{
					title: "Switch Statements and Enum Class Modes",
					content:
						"Teach `switch` as the right tool when one discrete value selects the next action, then pair it with `enum class` so menu choices and program modes are named instead of stored as magic numbers or strings. Require each `case` to end with `break`, `return`, or an explicitly discussed fallthrough."
				},
				{
					title: "Simple State Machines and State Diagrams",
					content:
						"Draw a small state diagram for the profile manager before coding the loop. Students should identify states such as `MainMenu`, `ViewingPosts`, `EditingPost`, and `Quit`, then explain why the same command can mean different things in different states."
				},
				{
					title: "CPPF8 Project: Profile Posts",
					content:
						"Build a small profile manager that stores posts, prints them clearly, sums hearts, removes posts safely, and updates likes. The finished version should include a clear command loop, validated menu choices, and at least one named program state so students leave Level 1 with a small interactive application rather than a collection of isolated functions.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts"
				},
				{
					title: "Course Recap and Next Steps",
					content:
						"Close the course by naming the major ideas students should now be comfortable with: decomposition, object modeling, small records, vectors, grid-style iteration, command loops, `switch`, scoped enums, and simple program states. Position `C++ Level 2` as the low-level follow-on when they are ready for pointers and manual memory."
				}
			],
			supplementalProjects: [
				{
					title: "Profile Posts: Extension Challenge",
					content:
						"Extend the profile manager with search, extra post fields, or another summary statistic while keeping the `std::vector<Post>` design clean.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts"
				},
				{
					title: "CPPF8 Project 2: Profile Posts State Machine Extension",
					content:
						"Add a written state diagram and update the capstone so the user can move between at least three explicit modes. The extension should make students justify why a `switch` plus `enum class` is clearer than another long `if`/`else if` chain.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-State-Machine-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-State-Machine-Profile-Posts"
				}
			]
		}
	]
};
