import type { RawCourse } from "./types";

export const cppLevel3Course: RawCourse = {
	name: "C++ Level 3",
	modules: [
		{
			title: "CPPI0 Bridge Course Setup and Positioning",
			curriculum: [
				{
					title: "Bridge Course Goals, Scale, and Tooling",
					content:
						"Position `C++ Level 3` as the bridge between beginner/manual-memory C++ and larger idiomatic C++ work. Cover: assumed baseline from Levels 1-2; what makes a program medium-size instead of just longer; why command structure, file-backed state, standard-library fluency, recursion, RAII, and small tests matter together; how to use a repeatable build command, warnings, debugger stepping, and trace output as evidence. By the end of this setup module, students should be able to compile a multi-file program, explain one warning or runtime failure, and describe what structure they will need before moving into data structures or design patterns."
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
					title: "Command Architecture and File Persistence",
					content:
						"Refine the Level 1 command-loop pattern into a structure that can grow: read a line, parse the command, validate arguments, call a focused function, update state, and print a stable result. Cover: separating command interpretation from data mutation; choosing a small text format; using `ifstream`, `ofstream`, and `getline`; deciding what data should be saved; reloading state on startup; and testing persistence by closing and reopening the program. Keep the focus on readable line-based formats, not binary files or complex serialization."
				},
				{
					title: "Scanning, Parsing, and Error Boundaries",
					content:
						"Adapt the CS236 scanner/parser ideas at a smaller scale without turning this into a compiler course. Cover: tokenizing raw command text into words, numbers, quoted strings, punctuation, comments, and unknown tokens; tracking line numbers; using `enum class` token types; defining a narrow parser boundary with helpers such as `match` and `advance`; rejecting malformed rows, missing fields, wrong types, and unknown commands; and preventing bad input from corrupting existing application state."
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
					title: "Recursion, Base Cases, and Stack Frames",
					content:
						"Teach recursion through call-stack diagrams before algorithm vocabulary. Cover: the base case, the recursive step, the smaller subproblem, what data each stack frame owns, what value returns to the previous frame, and why missing or non-progressing base cases lead to infinite recursion. Start with strings, vectors, and small grids so students build control-flow confidence before linked lists or trees."
				},
				{
					title: "Recursive Traversal and Backtracking",
					content:
						"Use traversal problems to show recursion as a practical tool rather than a trick. Cover: marking visited grid cells, stopping at invalid positions, returning success/failure, and the backtracking pattern of choose, recurse, undo, and try the next possibility. Keep the search space small enough that students can draw it and explain exactly why the algorithm stops."
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
					title: "Choosing Containers and Traversing with Iterators",
					content:
						"Move beyond `vector` by treating standard containers as design choices. Cover: when `array`, `deque`, `set`, `map`, and `unordered_map` fit better than a vector; how ordering, uniqueness, key lookup, insertion, and mutation patterns affect the choice; how iterators represent positions across different containers; and how iterator invalidation differs from pointer arithmetic. Students should be able to justify a container choice by the operations the program actually performs."
				},
				{
					title: "Standard Algorithms and Relation-Style Views",
					content:
						"Introduce standard algorithms as reusable operations that often communicate intent better than another hand-written loop. Cover: `find`, `count`, `sort`, `transform`, custom predicates, and when explicit loops are still clearer. Then adapt the CS236 relation idea into a practical container exercise: model rows as records and implement small `select`, `project`, `rename`, and join-style views with `vector`, `set`, and `map`."
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
					title: "RAII and Single-Owner Resource Design",
					content:
						"Teach RAII as the default modern C++ answer to cleanup: resources are acquired by objects and released automatically when those objects leave scope. Cover: destructors, scope exit, standard containers, file streams, and why this is the same lifetime principle students saw in Level 2. Introduce `std::unique_ptr` as the first smart pointer because it models single ownership clearly; practice deliberate moves and avoid treating heap allocation as the default."
				},
				{
					title: "Validation, Exceptions, and Resource Boundaries",
					content:
						"Teach error handling at the same time as resource safety. Cover: expected bad input that should be validated and reported normally; exceptional failures that should interrupt the current operation; failed file opens; parse errors; partial output; and why RAII makes cleanup reliable even when a function returns early or throws. Students should be able to explain what state is preserved after a failed operation."
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
					title: "Predictable Value Types and Restrained Operators",
					content:
						"Review constructors, invariants, `const` methods, and value semantics before adding operator overloading. Cover: what makes a class safe to copy, compare, print, and store in containers; when `operator<<`, comparison operators, or arithmetic operators make a type read naturally; and why overloaded operators should not hide surprising side effects. Students should leave with a bias toward readable value behavior, not clever syntax."
				},
				{
					title: "Templates and Diagnostic Reading",
					content:
						"Introduce templates as a way to write type-independent code after students have used the standard library. Cover: small function templates, tiny class-template wrappers, comparison helpers, constraints students should state in plain language, and how to read template compiler errors by finding the first useful diagnostic instead of reacting to the full wall of output."
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
					title: "Polymorphism, Composition, and Runtime Dispatch",
					content:
						"Introduce inheritance as a tool for shared interfaces and substitutable roles, not as the default way to reuse code. Cover: composition versus inheritance, virtual functions, runtime dispatch through a small collection of objects with a common interface, and how this differs from a simple `enum class` state machine. Connect the discussion directly to future design-pattern work, especially polymorphic state objects."
				},
				{
					title: "Advanced Pathways and Program Framing",
					content:
						"Close the course by naming the next paths clearly and framing the capstone as evidence of readiness. Cover: when to continue into `Data Structures and Algorithms in C++`, when `Design Patterns in C++` is the better architecture path, and when lower-level representation points toward `C Systems Engineering`. Offer a CS236-inspired capstone option for strong students: scanner, parser, command or AST objects, table-style evaluation, and a dependency graph, kept smaller than the original college project."
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
