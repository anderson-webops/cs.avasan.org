import type { RawCourse } from "./types";

export const cppLevel3Course: RawCourse = {
	name: "C++ Level 3",
	modules: [
		{
			title: "CPPI0 Bridge Course Setup and Positioning",
			curriculum: [
				{
					title: "Why This Course Exists",
					content:
						"Position `C++ Level 3` as the bridge between beginner C++ plus manual-memory practice and larger idiomatic C++ work. Students should already know functions, classes, vectors, structs, references, pointers, raw arrays, dynamic memory, and simple command-loop programs."
				},
				{
					title: "From Working Programs to Medium-Size Programs",
					content:
						"Set the goal clearly: write programs whose structure survives growth. The course emphasizes command structure, file-backed data, standard-library fluency, recursion, RAII, and small tests before students move into data structures or design patterns."
				},
				{
					title: "Tooling Baseline",
					content:
						"Use a local compiler, debugger, warnings, and a repeatable build command from the start. Students should be able to compile a multi-file program, step through a function call, and explain one warning or runtime failure using evidence."
				},
				{
					title: "CPPI0 Project: Build and Debug Checkpoint",
					content:
						"Create a tiny multi-file command-line project with one class, one helper module, and one deliberately broken case. Students should fix the bug with a debugger or trace output and record the evidence that proved the fix.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI0-Build-and-Debug-Checkpoint/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI0-Build-and-Debug-Checkpoint/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI0 Project 2: Warnings and Debugger Evidence Notebook",
					content:
						"Keep a short notebook entry showing the compiler command, one warning or debugger observation, and the code change made because of that evidence.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI0-Warnings-and-Debugger-Notebook/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI0-Warnings-and-Debugger-Notebook/solution"
				}
			]
		},
		{
			title: "CPPI1 Command Architecture, File I/O, and Small Parsers",
			curriculum: [
				{
					title: "Command-Driven Program Structure",
					content:
						"Refine the Level 1 command-loop pattern into a cleaner architecture: parse a command, validate it, call a focused function, update program state, and print a stable result. Students should separate command interpretation from data mutation."
				},
				{
					title: "Line-Based Text File I/O",
					content:
						"Introduce `ifstream`, `ofstream`, `getline`, and simple text-file formats. The focus is persistence for small programs, not complex serialization or binary files."
				},
				{
					title: "Scanner and Token Stream Design",
					content:
						"Adapt the CS236 scanner idea at a smaller scale: turn raw command text into typed tokens with line numbers, quoted strings, numbers, symbols, comments, and unknown-token handling. This makes `switch`, enums, string parsing, and validation work together before students attempt a full parser."
				},
				{
					title: "Recursive-Descent Parser Boundaries",
					content:
						"Introduce the parser boundary without making this a compiler course. Students should see how `match`, `advance`, and one or two recursive list rules keep syntax errors out of the business logic for a command-driven program."
				},
				{
					title: "Simple Parsing and Error Paths",
					content:
						"Parse small records from strings or files and decide what should happen when a line is missing a field, has the wrong type, or names an unknown command. Students should practice rejecting bad input without corrupting existing state."
				},
				{
					title: "CPPI1 Project: Saveable Task Manager",
					content:
						"Build a command-driven task manager that can add tasks, mark them complete, filter by status, save to a text file, and reload on startup. The project should require at least one explicit parser function and one validation path.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Saveable-Task-Manager/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Saveable-Task-Manager/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI1 Project 2: Import and Reject Bad Rows",
					content:
						"Add a small import command that reports malformed rows without stopping the entire program. Students should explain which data was accepted, which data was rejected, and why.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Import-and-Reject-Bad-Rows/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Import-and-Reject-Bad-Rows/solution"
				},
				{
					title: "CPPI1 Project 3: Mini Command Scanner",
					content:
						"Build a small tokenizer for task-manager-style commands. It should recognize words, numbers, quoted strings, punctuation, comments, line numbers, and malformed input before any command mutates application state.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Mini-Command-Scanner/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI1-Mini-Command-Scanner/solution"
				}
			]
		},
		{
			title: "CPPI2 Recursion and the Call Stack",
			curriculum: [
				{
					title: "Base Cases, Recursive Steps, and Stack Frames",
					content:
						"Teach recursion through call-stack diagrams before algorithm vocabulary. Students should identify the base case, the smaller subproblem, and the value returned to the previous frame."
				},
				{
					title: "Recursive Traversal Before Recursive Data Structures",
					content:
						"Start with strings, vectors, and small grids before linked lists or trees. The goal is confidence with the control flow and stack model, not a premature data-structures unit."
				},
				{
					title: "Backtracking as Try, Recurse, Undo",
					content:
						"Introduce backtracking as a disciplined pattern: choose a move, recurse, undo the move, and try the next possibility. Keep the search space small enough that students can draw it."
				},
				{
					title: "CPPI2 Project: Recursive Maze or Word Search",
					content:
						"Implement a recursive search through a small grid. Students should mark visited cells, backtrack safely, and explain why the algorithm stops instead of looping forever.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursive-Maze-Search/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursive-Maze-Search/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI2 Project 2: Recursion Trace Drill",
					content:
						"Trace three recursive calls by hand before running the program. The submitted work should include the predicted output, the actual output, and one corrected misconception.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursion-Trace-Drill/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI2-Recursion-Trace-Drill/solution"
				}
			]
		},
		{
			title: "CPPI3 STL Containers, Iterators, and Algorithms",
			curriculum: [
				{
					title: "Choosing Containers by Behavior",
					content:
						"Move beyond `vector` by introducing `array`, `deque`, `set`, `map`, and `unordered_map` as answers to different storage questions. Students should choose containers based on ordering, uniqueness, key lookup, and mutation patterns."
				},
				{
					title: "Iterators as Generalized Positions",
					content:
						"Teach iterators as a common way to point at positions in containers. Connect them back to pointer thinking, but keep the emphasis on safe traversal and standard-library conventions."
				},
				{
					title: "Standard Algorithms Before Hand-Written Loops",
					content:
						"Introduce algorithms such as `find`, `count`, `sort`, and `transform` as reusable operations. Students should learn when a standard algorithm expresses intent more clearly than another custom loop."
				},
				{
					title: "Relation-Style Table Operations",
					content:
						"Use the CS236 relation project as a practical container exercise: model rows as records, then implement small `select`, `project`, `rename`, and join-style views with `vector`, `set`, and `map`. The goal is database-style thinking without leaving C++ container fluency."
				},
				{
					title: "CPPI3 Project: Inventory Indexer",
					content:
						"Build an inventory or library index that stores records in a sequence, maps IDs to records, tracks unique categories, and produces sorted relation-style views such as selected rows, projected names, renamed categories, and supplier joins. The point is practical standard-library fluency before custom data structures.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Inventory-Indexer/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Inventory-Indexer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI3 Project 2: Container Tradeoff Mini-Audit",
					content:
						"Take one part of the inventory project and justify why the selected container is better than at least one alternative for the operations the program actually performs.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Container-Tradeoff-Audit/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI3-Container-Tradeoff-Audit/solution"
				}
			]
		},
		{
			title: "CPPI4 RAII, Smart Pointers, and Robust Error Handling",
			curriculum: [
				{
					title: "RAII as the Default Ownership Habit",
					content:
						"Teach resource acquisition is initialization as the normal modern C++ answer to cleanup. Students should connect destructors, scope exit, standard containers, and file streams to the same lifetime principle."
				},
				{
					title: "Unique Ownership with std::unique_ptr",
					content:
						"Introduce `std::unique_ptr` as the first smart pointer because it models single ownership clearly. Students should practice moving ownership deliberately and avoid treating heap allocation as the default."
				},
				{
					title: "Exceptions and Validation Boundaries",
					content:
						"Teach simple exceptions only after RAII is visible. Students should distinguish expected bad input that should be validated from exceptional failures that should interrupt the current operation."
				},
				{
					title: "CPPI4 Project: Resource-Safe File Processor",
					content:
						"Build a file-processing tool that opens input/output files, validates records, reports errors, and relies on object lifetime for cleanup. The project should include at least one deliberately failed open or parse case.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Resource-Safe-File-Processor/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Resource-Safe-File-Processor/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI4 Project 2: Ownership Rewrite Reflection",
					content:
						"Rewrite one small raw-pointer example from Level 2 using a standard container or `std::unique_ptr`, then explain what cleanup responsibility disappeared and what responsibility remains.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Ownership-Rewrite-Reflection/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI4-Ownership-Rewrite-Reflection/solution"
				}
			]
		},
		{
			title: "CPPI5 Value Types, Operator Overloading, and Templates",
			curriculum: [
				{
					title: "Designing Predictable Value Types",
					content:
						"Review constructors, invariants, `const` methods, and value semantics before adding operator overloading. Students should understand what makes a class safe to copy, compare, print, and store in containers."
				},
				{
					title: "Operator Overloading with Restraint",
					content:
						"Teach operator overloading only when it makes a value type read more naturally. Students should avoid clever overloads that hide side effects or make a class harder to understand."
				},
				{
					title: "Function and Class Templates",
					content:
						"Introduce templates as a way to write type-independent code after students have used the standard library. Keep the examples small: reusable min/max helpers, tiny container wrappers, and comparison utilities."
				},
				{
					title: "CPPI5 Project: Score or Fraction Toolkit",
					content:
						"Build a small value type such as `Fraction`, `Score`, or `Measurement` with validation, output, comparisons, and one or two restrained overloaded operators. Add a templated helper where it improves reuse.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Fraction-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Fraction-Toolkit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI5 Project 2: Template Error Reading Drill",
					content:
						"Trigger one controlled template compile error and practice reading the first useful diagnostic instead of reacting to the entire wall of compiler output.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Template-Error-Reading-Drill/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI5-Template-Error-Reading-Drill/solution"
				}
			]
		},
		{
			title: "CPPI6 Polymorphism and Bridge to Advanced C++",
			curriculum: [
				{
					title: "Inheritance Only When Roles Differ",
					content:
						"Introduce inheritance as a tool for shared interfaces and substitutable roles, not as the default way to reuse code. Students should compare inheritance with composition before choosing either."
				},
				{
					title: "Virtual Functions and Runtime Dispatch",
					content:
						"Teach virtual dispatch through a small collection of objects that share a common interface but perform different behavior. Connect this directly to future design-pattern work, especially the difference between a simple enum-based state machine and polymorphic state objects."
				},
				{
					title: "Bridge to Data Structures and Design Patterns",
					content:
						"Close the course by naming the next paths clearly. Students ready for algorithmic implementation should continue to `Data Structures and Algorithms in C++`; students interested in architecture should continue to `Design Patterns in C++`; students interested in lower-level representation can move into `C Systems Engineering`."
				},
				{
					title: "Interpreter Pipeline as a Capstone Option",
					content:
						"Offer a CS236-inspired capstone path for strong students: scanner, parser, command or AST objects, table-style evaluation, and a dependency graph. This should stay smaller than the original course project, but it gives a clear bridge from medium-size C++ into data structures and patterns."
				},
				{
					title: "CPPI6 Capstone: Saveable Command-Driven Simulation",
					content:
						"Build a small simulation, game, or interpreter-style command engine with saved data, explicit states, STL containers, one recursive or algorithmic subsystem, and a narrow polymorphic interface. The capstone should prove the student can organize a medium-size C++ program without jumping into a full application framework.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Saveable-Command-Simulation/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Saveable-Command-Simulation/solution"
				}
			],
			supplementalProjects: [
				{
					title: "CPPI6 Project 2: Enum State versus Polymorphic State Review",
					content:
						"Take one capstone state transition and compare the simple `enum class` approach with a possible polymorphic State-pattern design. Students should explain which version is more appropriate for the current project size.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Enum-vs-Polymorphic-State-Review/starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-3/tree/main/CPPI6-Enum-vs-Polymorphic-State-Review/solution"
				}
			]
		}
	]
};
