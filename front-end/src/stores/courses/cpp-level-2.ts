import type { RawCourse } from "./types";

export const cppLevel2Course: RawCourse = {
	name: "C++ Level 2",
	modules: [
		{
			title: "CPPM0 Lifetime, References, and Ownership Framing",
			curriculum: [
				{
					title: "Level 2 Positioning and Ownership Vocabulary",
					content:
						"Position this course as the low-level follow-on after students can already write menu-driven programs with functions, classes, vectors, structs, references, and simple state. Cover: why Level 2 deepens the memory model instead of introducing pointer syntax as disconnected trivia; what it means for a function or class to own data; how observation, mutation, borrowing, and ownership differ; and the vocabulary students will need before raw arrays, heap allocation, and custom containers."
				},
				{
					title: "References, Lifetimes, and Evidence-Based Debugging",
					content:
						"Review pass-by-value, pass-by-reference, and `const` reference before raw pointers. Cover: stack objects, heap objects, aliases, dangling references, leaks, and objects that clean themselves up when they leave scope; when a function may mutate caller-owned data; when it only observes data; and how to use address prints, trace output, and debugger inspection as evidence for where values live and why an alias changes what it changes."
				},
				{
					title: "CPPM0 Project 1: Lifetime Tracing Warm-Up",
					content:
						"Trace a short multi-function program by drawing stack frames, aliases, and mutation points. Students should identify which variables are independent copies, which are references, and which values would become invalid after a scope ends.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Lifetime-Tracing-Warm-Up",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Lifetime-Tracing-Warm-Up"
				},
				{
					title: "CPPM0 Project 2: Ownership Boundary Debugging",
					content:
						"Debug a small program that mixes copies, references, const references, and borrowed observations. Students should explain which function owns data, which function mutates caller-owned data, and which value is only safe because the original object still exists.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Ownership-Boundary-Debugging",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Ownership-Boundary-Debugging"
				}
			],
			supplementalProjects: [
				{
					title: "CPPM0 Project 3: Lifetime Diagram Extension",
					content:
						"Extend one CPM0 tracing project with a written before/after diagram. The diagram should label stack values, aliases, mutation points, and lifetime boundaries.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Lifetime-Tracing-Warm-Up",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM0-Lifetime-Tracing-Warm-Up"
				}
			]
		},
		{
			title: "CPPM1 Pointers and Addresses",
			curriculum: [
				{
					title: "Pointer Basics, Aliasing, and Failure Modes",
					content:
						"Introduce pointers as variables that store addresses, not regular values. Cover: `&`, `*`, `nullptr`, reading through a pointer, writing through a pointer, pointer aliasing, and how two names can change the same object. Then make failure modes explicit: uninitialized pointers, dangling pointers, null dereferences, stale observations, and why pointer bugs need evidence instead of guessing.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointers"
				},
				{
					title: "CPPM1 Project 1: Pointer Starter",
					content:
						"Use a guided starter to answer conceptual questions about reading and writing through pointers. This module is about memory model clarity, not clever syntax.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointers-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointers"
				},
				{
					title: "CPPM1 Project 2: Pointer Error Examples",
					content:
						"Walk through incorrect pointer patterns and explain exactly why they fail. Students should be able to name the bug, not just observe that the program misbehaves.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointer-Error-Examples",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointer-Error-Examples"
				}
			],
			supplementalProjects: [
				{
					title: "Pointers: Practice Lab",
					content:
						"Use the pointer-practice lab when students need a longer tracing exercise with moving pointers and string-backed memory.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointer-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM1-Pointer-Practice"
				}
			]
		},
		{
			title: "CPPM2 Raw Arrays and Pointer Arithmetic",
			curriculum: [
				{
					title: "Raw Arrays as Contiguous Memory",
					content:
						"Teach raw arrays as fixed-size contiguous blocks and frame them as a lower-level model than `std::vector`, not as the new default beginner container. Cover: explicit size parameters, valid index ranges, how array names decay to addresses, why bounds are not tracked for you, and how raw arrays help explain what safer containers are doing.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Basics-Reference"
				},
				{
					title: "Pointer Arithmetic and Offset Reasoning",
					content:
						"Use pointer arithmetic carefully so students understand what `arr + i` really means. Cover: element-size offsets, moving a pointer through an array, comparing pointer traversal with indexed traversal, stopping before the end, and explaining why the point is memory-layout reasoning rather than style preference.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Pointer-Arithmetic-Reference"
				},
				{
					title: "CPPM2 Project 1: Array Practice",
					content:
						"Write small array-processing functions that depend on an explicit size parameter. Students should see exactly what raw arrays gain and what safety they lose.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Practice"
				},
				{
					title: "CPPM2 Project 2: Tic Tac Toe",
					content:
						"Use a flat raw array to represent a board and enforce valid moves. This is a good capstone for fixed-size indexed storage before multi-dimensional layout enters the picture.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Tic-Tac-Toe",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Tic-Tac-Toe"
				}
			],
			supplementalProjects: [
				{
					title: "Raw Arrays: Verification Drill",
					content:
						"Re-run the array practice with one or two custom cases and have students explain how indexes and addresses line up in memory.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Practice"
				}
			]
		},
		{
			title: "CPPM3 Two-Dimensional Arrays and Layout",
			curriculum: [
				{
					title: "Two-Dimensional Arrays, Layout, and Function Boundaries",
					content:
						"Teach 2D arrays as rows and columns with a concrete storage layout. Cover: nested loops, row/column meaning, row-major storage, rectangular dimensions, multiplication-table tracing, and when a 2D array can be viewed as contiguous memory. Keep pointer-based flattening secondary until the grid shape is clear, then explain what changes when a function receives a pointer view instead of a higher-level container.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-Two-Dimensional-Arrays-Reference"
				},
				{
					title: "CPPM3 Project 1: 2D Array Practice",
					content:
						"Compute sums, minimums, multiplication tables, and row averages with raw 2D array logic. This should reinforce layout reasoning and careful indexing.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-2D-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-2D-Array-Practice"
				},
				{
					title: "CPPM3 Project 2: Bank Transactions",
					content:
						"Use a raw 2D grid to model recurring account data and print it clearly. The project matters because it forces students to keep row/column meaning straight.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-Bank-Transactions",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-Bank-Transactions"
				}
			],
			supplementalProjects: [
				{
					title: "Two-Dimensional Arrays: Extension Challenge",
					content:
						"Add one more grid calculation or validation rule so students have to defend their row/column logic in a fresh case.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-2D-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-2D-Array-Practice"
				}
			]
		},
		{
			title: "CPPM4 Dynamic Memory and Custom Dynamic Arrays",
			curriculum: [
				{
					title: "Dynamic Allocation and Manual Ownership",
					content:
						"Teach `new` and `delete` explicitly so students understand heap allocation, leaks, and dangling pointers. Cover: why heap objects outlive the current stack frame until deleted; how ownership must be assigned before allocation; why every allocation needs exactly one cleanup path; what can go wrong during replacement and resizing; and why raw `new`/`delete` is a teaching tool for ownership rather than the preferred modern endpoint.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Variables-Reference"
				},
				{
					title: "CPPM4 Project 1: Assembly Line",
					content:
						"Use dynamically created objects in a small loop-driven workflow so students can see allocation, replacement, and cleanup happen in a concrete program.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Assembly-Line",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Assembly-Line"
				},
				{
					title: "CPPM4 Project 2: Dynamic Array Implementation",
					content:
						"Implement a growable array manually with capacity tracking, reallocation, copying, and cleanup. This is the course's core ownership and resizing lab.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Array-Implementation",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Array-Implementation"
				},
				{
					title: "CPPM4 Project 3: Grocery List",
					content:
						"Adapt the custom dynamic array to store real record data instead of plain integers. This is where students see how quickly manual container management becomes more demanding.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Grocery-List",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Grocery-List"
				}
			],
			supplementalProjects: [
				{
					title: "Dynamic Memory: Verification and Reflection",
					content:
						"Pause after the custom-array work and have students explain what gets allocated, copied, and deleted at each stage of a resize.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Array-Implementation",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Array-Implementation"
				}
			]
		},
		{
			title: "CPPM5 Manual-Memory Capstones",
			curriculum: [
				{
					title: "Manual-Memory Class Design",
					content:
						"Use capstone-sized classes that own their own storage so students must maintain invariants across multiple methods, not just in a single free function. Cover: constructors that establish valid storage, methods that preserve size/capacity rules, copy or resize operations that must not leak, input validation before mutation, and how matrix/profile examples force students to keep class boundaries and ownership rules aligned."
				},
				{
					title: "CPPM5 Project 1: Matrix Fun with a Matrix Class",
					content:
						"Model a matrix as a class, then implement fill, add, multiply, and display operations. This is a useful design capstone because it combines grid reasoning with class boundaries.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Matrix-Fun-with-Matrix-Class",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Matrix-Fun-with-Matrix-Class"
				},
				{
					title: "CPPM5 Project 2: Profile Posts",
					content:
						"Rebuild the profile-posts concept with manual dynamic storage instead of `std::vector`. This is intentionally harder than the Level 1 capstone and should feel like a second-course endpoint.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Profile-Posts"
				},
				{
					title: "Modern Ownership and Next-Step Positioning",
					content:
						"After the manual-memory capstones, show the modern correction: resources should normally be tied to object lifetime, and single-owner heap data should usually move toward `std::unique_ptr` or a standard container. Cover: what cleanup responsibility disappears with RAII, what design responsibility remains, and where the student should go next: `C++ Level 3` for medium-size idiomatic C++, `Data Structures and Algorithms in C++` for implementation depth, or `C Systems Engineering` for lower-level representation."
				}
			],
			supplementalProjects: [
				{
					title: "Manual-Memory Capstones: Extension Challenge",
					content:
						"Extend either capstone with one extra operation or safety check so students can keep reasoning about ownership under a little more pressure.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Profile-Posts",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Profile-Posts"
				},
				{
					title: "CPPM5 Project 3: Modern Ownership Reflection",
					content:
						"Pick one manual allocation from a capstone and compare it with a standard container or `std::unique_ptr` version. The goal is to compare ownership responsibilities, not to rewrite the whole project.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Modern-Ownership-Reflection",
					solutionLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM5-Modern-Ownership-Reflection"
				}
			]
		}
	]
};
