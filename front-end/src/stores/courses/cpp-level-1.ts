import type { RawCourse } from "./types";

export const cppLevel1Course: RawCourse = {
	name: "C++ Level 1",
	modules: [
		{
			title: "CPPF1 Variables, Types, Strings, and Input/Output",
			curriculum: [
				{
					title: "Program Setup, Syntax, and Compile-Run Cycle",
					content:
						"Start with a single-file console program and make the compile-run cycle explicit. Cover: `#include`, `main`, braces, semicolons, comments, compiler errors versus runtime behavior, and the idea that C++ is compiled before it runs. Students should practice making one small change, recompiling, reading the output or error, and explaining what changed before the syntax load rises."
				},
				{
					title: "Primitive Types, Strings, and Console I/O",
					content:
						"Teach integers, doubles, booleans, chars, and `std::string` as the core beginner value types, then connect them directly to `std::cin` and `std::cout`. Cover: declaring and assigning variables, choosing a type, reading typed input, printing labels with values, basic string length/indexing, and common beginner mistakes such as missing quotes, invalid assignments, and input that stops at whitespace.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF1-Primitive-Types-and-Strings-Reference"
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
					title: "Branching and Repetition",
					content:
						"Teach control flow as a way to choose and repeat behavior. Cover: `if`, `else if`, and `else`; comparison operators; Boolean expressions; ordered branch checks; `for` loops for counted repetition; `while` loops for condition-driven repetition; loop initialization, stopping conditions, and updates; and how to trace variable changes without guessing.",
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
					title: "Function Signatures, Return Values, and Decomposition",
					content:
						"Teach functions as named units of work with parameters and return types. Cover: reading a function signature, deciding what data a function needs, deciding what it returns, separating calculation from printing, avoiding repeated code, and using small helper functions to make a larger program easier to test. Students should be able to explain why a function exists, not just how to call it."
				},
				{
					title: "Randomness and Small Simulation Helpers",
					content:
						"Introduce `rand()` only after basic function calls are comfortable. Cover: seeding at the correct level, generating bounded random values, wrapping random behavior in helper functions, testing code that has random output, and separating generation logic from game or simulation output. Randomness should create a reason to decompose the program instead of writing one long `main`.",
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
					title: "Classes, Objects, and Encapsulated State",
					content:
						"Teach a class as a way to package related data and behavior together. Cover: objects as individual instances, private state, public behavior, constructors, getters/setters when appropriate, and why methods should protect invariants instead of letting every part of the program edit fields directly. Keep the focus on object modeling, not advanced language mechanics."
				},
				{
					title: "Multi-File Class Implementation",
					content:
						"Use small multi-file classes to teach how real C++ projects split declarations and definitions. Cover: header files, source files, include guards, method declarations versus method bodies, default and overloaded constructors, member functions that update object state, and how to compile a project with more than one `.cpp` file.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF4-Point-Class"
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
					title: "Vectors as Growable Sequences and Function Inputs",
					content:
						"Introduce `std::vector` as the default beginner collection for ordered values that can grow over time. Cover: `push_back`, indexing, `size`, iterating with indexes and range-based loops, reading versus mutating a collection, passing vectors to functions, using `const` references for read-only access, and writing summary operations such as totals, filters, and searches.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF5-Vectors-Reference"
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
					title: "References, Const References, and Function Boundaries",
					content:
						"Teach references as aliases and `const` references as a safe way to avoid unnecessary copying. Cover: pass-by-value versus pass-by-reference, when a function should mutate caller-owned data, when it should only observe data, why `const` communicates intent, and how to trace what changes after a function call. This should feel like a data-flow topic, not a pointer topic.",
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
						"Introduce `struct` as a lightweight way to group related fields before the profile capstone. Cover: simple record shapes such as a student, transaction, or post; when a struct is clearer than parallel vectors; passing records to functions; using vectors of structs; and deciding whether a behavior belongs in a function now or in a class later.",
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
					title: "Nested Vectors, Grid Traversal, and Nested Loop Patterns",
					content:
						"Teach a 2D vector as a grid of rows instead of jumping directly into raw multi-dimensional arrays. Cover: reading `grid[row][col]`, row versus column meaning, printing a grid, updating a cell, nested loops for row totals and scans, rectangular versus irregular grids, and why this higher-level model prepares students for raw array layout later without introducing memory tricks too early.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF7-Grids-and-2D-Vectors-Reference"
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
					title: "Profile Modeling and API Design",
					content:
						"Model a `Post` as a small record and a `Profile` as a class that owns a vector of posts. Cover: why `Post` can be a simple record, why `Profile` should own the collection, how to design add/remove/print/update methods, how to validate indexes before mutation, and how to keep the API readable without introducing manual ownership logic.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts"
				},
				{
					title: "Command Loops, Switches, and Simple State Machines",
					content:
						"Convert one-shot profile operations into a menu-driven command loop. Cover: prompting until quit, rejecting invalid choices, separating input handling from `Profile` methods, using `switch` when one discrete value selects the next action, using `enum class` instead of magic numbers or strings, ending each `case` intentionally, drawing a small state diagram, and explaining states such as `MainMenu`, `ViewingPosts`, `EditingPost`, and `Quit`. Close by naming the Level 1 outcomes: decomposition, object modeling, records, vectors, grids, command loops, switches, scoped enums, and simple program states."
				},
				{
					title: "CPPF8 Project: Profile Posts",
					content:
						"Build a small profile manager that stores posts, prints them clearly, sums hearts, removes posts safely, and updates likes. The finished version should include a clear command loop, validated menu choices, and at least one named program state so students leave Level 1 with a small interactive application rather than a collection of isolated functions.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-1/tree/main/CPPF8-Profile-Posts"
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
