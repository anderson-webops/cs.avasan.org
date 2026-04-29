import type { RawCourse } from "./types";

export const cppLevel2Course: RawCourse = {
	name: "C++ Level 2",
	modules: [
		{
			title: "CPPM0 Lifetime, References, and Ownership Framing",
			curriculum: [
				{
					title: "Course Positioning After C++ Level 1",
					content:
						"Position this course as the low-level follow-on after students can already write menu-driven programs with functions, classes, vectors, structs, references, and simple state. Level 2 should deepen the memory model rather than introduce pointer syntax as disconnected trivia."
				},
				{
					title: "References, Const, and API Boundaries",
					content:
						"Review pass-by-value, pass-by-reference, and `const` reference before raw pointers. Students should be able to explain when a function owns data, when it only observes data, and when it is allowed to mutate caller-owned data."
				},
				{
					title: "Stack, Heap, and Lifetime Vocabulary",
					content:
						"Make lifetime explicit before allocation begins. Students should distinguish stack objects, heap objects, aliases, dangling references, leaks, and objects that clean themselves up when they leave scope."
				},
				{
					title: "Debugging Memory by Evidence",
					content:
						"Use small tracing examples, address prints, and debugger inspection to prove where values live and why an alias changes what it changes. The habit is evidence first, assumptions second."
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
					title: "Memory Addresses and Dereferencing",
					content:
						"Introduce pointers as variables that store addresses, not regular values. Students should understand `&`, `*`, and `nullptr` before they do anything more complicated."
				},
				{
					title: "Pointer Aliasing and Common Failure Modes",
					content:
						"Show how two pointers can refer to the same value, why uninitialized pointers are dangerous, and what makes dangling pointers hard to debug.",
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
					title: "Fixed-Size Arrays in Contiguous Memory",
					content:
						"Teach raw arrays as contiguous blocks with fixed size known at compile time. This should be framed as a lower-level model than `std::vector`, not as the new default beginner container.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM2-Array-Basics-Reference"
				},
				{
					title: "Arrays as Addresses and Offsets",
					content:
						"Use pointer arithmetic carefully so students understand what `arr + i` really means. The point is memory layout reasoning, not style preference.",
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
					title: "Two-Dimensional Array Basics",
					content:
						"Teach 2D arrays as rows and columns with a concrete storage layout. Students should understand nested loops first and pointer-based flattening only after the grid shape is clear.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM3-Two-Dimensional-Arrays-Reference"
				},
				{
					title: "Flattened Access and Function Boundaries",
					content:
						"Show how a 2D array can be viewed as contiguous memory and what changes when functions receive a pointer view instead of a higher-level container."
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
					title: "Dynamic Variables and Lifetime",
					content:
						"Teach `new` and `delete` explicitly so students understand heap allocation, leaks, and dangling pointers. This is where lifetime becomes a first-class design concern.",
					projectLink:
						"https://github.com/instruction-material/CPP-Level-2/tree/main/CPPM4-Dynamic-Variables-Reference"
				},
				{
					title: "Manual Ownership Before Modern Ownership",
					content:
						"Frame raw `new` and `delete` as a teaching tool for understanding ownership, not as the default modern C++ style. Students should name exactly who is responsible for deleting each allocation before they write code that creates it."
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
					title: "Class-Owned Storage and Invariants",
					content:
						"Use capstone-sized classes that own their own storage so students must maintain invariants across multiple methods, not just in a single free function."
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
					title: "RAII and Unique Pointer Review",
					content:
						"After the manual-memory capstones, show the modern correction: resources should normally be tied to object lifetime, and single-owner heap data should usually move toward `std::unique_ptr` or a standard container. Students do not need a deep smart-pointer unit yet, but they should not leave thinking raw ownership is the preferred endpoint."
				},
				{
					title: "Next-Step Positioning",
					content:
						"Position this course as the bridge into `C++ Level 3`, `Data Structures and Algorithms in C++`, or `C Systems Engineering`. Students leaving this sequence should now be ready for pointer-heavy debugging, ownership reasoning, stricter low-level invariants, and a first pass at modern ownership vocabulary."
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
