import type { RawCourse } from "./types";

export const dataStructuresAndAlgorithmsInCppCourse: RawCourse = {
	name: "Data Structures and Algorithms in C++",
	modules: [
		{
			title: "DSCPP0 Setup and Positioning",
			curriculum: [
				{
					title: "Course Positioning After C++ Level 2",
					content:
						"Position this course as the algorithmic next step after `C++ Level 2`, with `C++ Level 3` preferred first when file-backed programs, recursion, STL containers, RAII, and medium-size C++ structure need more practice. Learners entering this sequence should already be comfortable with variables, control flow, functions, classes, vectors, pointers, references, and ownership reasoning before the focus shifts to data structures, algorithm design, and complexity."
				},
				{
					title: "Preferred Toolchain",
					content:
						"Standardize on `CLion` or `VS Code` with a working local compiler, debugger, and `CMake`. This course depends on multi-file structure, repeatable builds, and enough debugging fluency to inspect recursive and pointer-heavy code without guessing."
				},
				{
					title: "Why This Course Uses Small Labs Instead of Giant Apps",
					content:
						"Keep the codebases small enough that students can inspect every pointer update, recursive branch, and container mutation. The goal is not flashy UI work. It is clear reasoning about structure, invariants, and algorithmic tradeoffs."
				},
				{
					title: "Working Habits for the Sequence",
					content:
						"Get used to tracing data by hand, printing intermediate structure states, and explaining asymptotic behavior in plain language. Every unit should end with at least one debugging pass that checks the shape of the structure, not just final output."
				},
				{
					title: "DSCPP0 Setup and Positioning: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-08-dscpp0-setup-and-positioning/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-08-dscpp0-setup-and-positioning/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Complexity Checkpoint: Setup and Positioning",
					content:
						"Pause after setup and positioning and record the key operation count story, the dominant data movement pattern, and one plain-language explanation of why the cost of debugging late is much higher once recursion and ownership bugs enter the picture.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-08-dscpp0-setup-and-positioning/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-08-dscpp0-setup-and-positioning/solution"
				},
				{
					title: "Setup and Positioning supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-dscpp0-setup-and-positioning-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-dscpp0-setup-and-positioning-supplemental-2/solution"
				},
				{
					title: "Setup and Positioning supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-dscpp0-setup-and-positioning-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-dscpp0-setup-and-positioning-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP1 Interfaces, Records, and a Task Manager CLI",
			curriculum: [
				{
					title: "Small Record Types and Sequence Storage",
					content:
						"Use a simple task manager to re-center students on structured records, not just primitive values. This is the point where a vector of objects should start to feel normal instead of advanced."
				},
				{
					title: "Filtering, Removal, and Stable Output",
					content:
						"This section covers sequence mutation through task filtering and removal. Key idea: The difference between searching, erasing, and printing sorted views rather than treating a vector like a magical bag of values."
				},
				{
					title: "Command-Style Program Structure",
					content:
						"Model programs that interpret an action, update state, and print a clear result. This becomes a useful pattern later when tree and graph labs expose many small operations through a driver."
				},
				{
					title: "Interfaces, Records, and a Task Manager CLI: Verification and Reflection",
					content:
						"Finish DSCPP1 Interfaces, Records, and a Task Manager CLI with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "DSCPP1 Interfaces, Records, and a Task Manager CLI: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP1-Task-Manager-CLI/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP1-Task-Manager-CLI/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Task Manager CLI",
					content:
						"Build a file-ready task manager that stores dated tasks, filters by date, removes tasks safely, and prints consistent views of the current schedule. The lab is intentionally small so students can focus on clean data handling and interface boundaries.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP1-Task-Manager-CLI/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP1-Task-Manager-CLI/solution"
				},
				{
					title: "Interfaces, Records, and a Task Manager CLI supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-dscpp1-interfaces-records-and-a-task-manager-cli-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-dscpp1-interfaces-records-and-a-task-manager-cli-supplemental-2/solution"
				},
				{
					title: "Interfaces, Records, and a Task Manager CLI supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-dscpp1-interfaces-records-and-a-task-manager-cli-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-dscpp1-interfaces-records-and-a-task-manager-cli-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP2 Graphs and Shortest Paths",
			curriculum: [
				{
					title: "Adjacency Matrices and Weighted Connectivity",
					content:
						"Represent a graph as weighted node-to-node connectivity and make the storage format explicit. Skill target: Explain what `-1` or another sentinel means in the matrix instead of only copying loops that walk it. The CS235 navigation lab maps cleanly here: a road network file, weighted adjacency matrix, and route query become the concrete project shape."
				},
				{
					title: "Shortest Path Thinking",
					content:
						"This section covers shortest-path work as a repeated relaxation problem rather than as memorized Dijkstra vocabulary. The key judgment is understanding why a currently known best cost can still improve through another route until the frontier closes."
				},
				{
					title: "Path Reconstruction",
					content:
						"Do not stop at distance values. Record parent relationships and reconstruct the actual route so they understand the difference between knowing a cost and knowing the path that produced it. If visual output is useful, treat map rendering as an optional extension after the path logic is correct."
				},
				{
					title: "Graphs and Shortest Paths: Verification and Reflection",
					content:
						"Finish DSCPP2 Graphs and Shortest Paths with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "DSCPP2 Graphs and Shortest Paths: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP2-Graph-Navigation/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP2-Graph-Navigation/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Graph Navigation",
					content:
						"Read a weighted road-style network, compute the shortest path between two nodes, and reconstruct the route from start to goal. The project is directly aligned with the graph-navigation lab style from the source course, but rewritten for cleaner learner-facing starter and solution code.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP2-Graph-Navigation/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP2-Graph-Navigation/solution"
				},
				{
					title: "Graphs and Shortest Paths supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-dscpp2-graphs-and-shortest-paths-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-dscpp2-graphs-and-shortest-paths-supplemental-2/solution"
				},
				{
					title: "Graphs and Shortest Paths supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-dscpp2-graphs-and-shortest-paths-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-dscpp2-graphs-and-shortest-paths-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP3 STL Containers and State-Based Text Generation",
			curriculum: [
				{
					title: "Vectors, Sets, Maps, and Deques as Different Stories",
					content:
						"Each container solves a different problem: vectors preserve sequence, sets track uniqueness, maps connect keys to values, and deques are helpful when the state window slides forward over time."
				},
				{
					title: "Tokenization and Cleanup",
					content:
						"Use a text pipeline to normalize tokens, remove punctuation, and distinguish total tokens from unique vocabulary. This gives students a concrete reason to combine multiple container types in one coherent program."
				},
				{
					title: "State Windows and Markov-Style Generation",
					content:
						"Introduce an n-gram or state-window model where the next output token depends on the recent history. The data-structure lesson matters more than the novelty of generated text."
				},
				{
					title: "STL Containers and State Based Text Generation: Verification and Reflection",
					content:
						"Finish DSCPP3 STL Containers and State-Based Text Generation with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "DSCPP3 STL Containers and State-Based Text Generation: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP3-Markov-Text-Generator/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP3-Markov-Text-Generator/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Markov Text Generator",
					content:
						"Build a small text generator that tokenizes an input string, records unique vocabulary, and uses a deque-backed state window with a map to produce sample output. This adapts the container-heavy source lab into a more readable course project.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP3-Markov-Text-Generator/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP3-Markov-Text-Generator/solution"
				},
				{
					title: "STL Containers and State Based Text Generation supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-dscpp3-stl-containers-and-state-based-text-generation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-dscpp3-stl-containers-and-state-based-text-generation-supplemental-2/solution"
				},
				{
					title: "STL Containers and State Based Text Generation supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-08-dscpp3-stl-containers-and-state-based-text-generation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-08-dscpp3-stl-containers-and-state-based-text-generation-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP4 Recursion and Backtracking in 3D Mazes",
			curriculum: [
				{
					title: "Recursive Search as Controlled Exploration",
					content:
						"Treat recursion as a disciplined search strategy, not a mysterious language trick. Explain what each call means, what state is local to that call, and when the recursion is done."
				},
				{
					title: "Visited State and Cycle Prevention",
					content:
						"Backtracking only works cleanly when students mark visited cells and reason about state changes carefully. This is the unit where accidental revisits, coordinate mistakes, and off-by-one bugs should be surfaced deliberately. Use the CS235 5x5x5 maze constraints as the anchor: exactly 125 imported cells, six legal directions, and no mutation of the current maze after a bad import."
				},
				{
					title: "Path Construction and Rollback",
					content:
						"Make path handling explicit: add a coordinate when the recursion advances, remove it when a branch fails, and keep the successful path intact. This becomes an important mental model for recursive data-structure work later."
				},
				{
					title: "Recursion and Backtracking in 3D Mazes: Verification and Reflection",
					content:
						"Finish DSCPP4 Recursion and Backtracking in 3D Mazes with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "DSCPP4 Recursion and Backtracking in 3D Mazes: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP4-Recursive-Maze-Pathfinder/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP4-Recursive-Maze-Pathfinder/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Recursive Maze Pathfinder",
					content:
						"Import a 5x5x5 maze, validate the data, and recursively search for a path from the entrance to the exit without cycles. This keeps the original maze-lab spirit but removes the grading harness clutter from the learner-facing version.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP4-Recursive-Maze-Pathfinder/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP4-Recursive-Maze-Pathfinder/solution"
				},
				{
					title: "Recursion and Backtracking in 3D Mazes supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-09-dscpp4-recursion-and-backtracking-in-3d-mazes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-09-dscpp4-recursion-and-backtracking-in-3d-mazes-supplemental-2/solution"
				},
				{
					title: "Recursion and Backtracking in 3D Mazes supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-10-dscpp4-recursion-and-backtracking-in-3d-mazes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-10-dscpp4-recursion-and-backtracking-in-3d-mazes-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP5 Quicksort and Partitioning",
			curriculum: [
				{
					title: "Why Partition-Based Sorting Works",
					content:
						"Explain quicksort through the partitioning story first: choose a pivot, move smaller elements left, larger elements right, and recurse on the remaining subranges. Skill target: Narrate the array state after each partition."
				},
				{
					title: "Median of Three and Practical Pivot Choice",
					content:
						"Introduce median-of-three as a practical improvement rather than as ritual. The lesson is about reducing bad pivot choices on partially sorted data, not about memorizing a special case in isolation. The source quicksort lab is useful because it separates dynamic buffer ownership, pivot selection, partitioning, and recursive sorting into testable responsibilities."
				},
				{
					title: "Recursive Boundaries and Base Cases",
					content:
						"Require proof of where the recursion stops and why the subranges shrink. Quicksort bugs often come from boundary confusion rather than from misunderstanding the big idea."
				},
				{
					title: "Quicksort and Partitioning: Verification and Reflection",
					content:
						"Finish DSCPP5 Quicksort and Partitioning with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "DSCPP5 Quicksort and Partitioning: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP5-Quicksort-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP5-Quicksort-Toolkit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Quicksort Toolkit",
					content:
						"Build the buffer management, median-of-three selection, partition logic, and recursive quicksort flow needed to sort an integer sequence cleanly. The project mirrors the source quicksort lab but uses a cleaner starter/solution layout.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP5-Quicksort-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP5-Quicksort-Toolkit/solution"
				},
				{
					title: "Quicksort and Partitioning supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-11-dscpp5-quicksort-and-partitioning-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-11-dscpp5-quicksort-and-partitioning-supplemental-2/solution"
				},
				{
					title: "Quicksort and Partitioning supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-12-dscpp5-quicksort-and-partitioning-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-12-dscpp5-quicksort-and-partitioning-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP6 Templates and Linked Structures",
			curriculum: [
				{
					title: "Why Templates Matter Here",
					content:
						"This section covers templates as a way to reuse the same linked-list logic across multiple data types without copying code. Key idea: The compile-time nature of templates instead of treating them like runtime generics."
				},
				{
					title: "Single-Linked Nodes and Pointer Updates",
					content:
						"Walk through insertion and removal one pointer change at a time. This is the point where head updates, middle insertions, and missing-target behavior must be fluent. Keep the CS235 linked-list discipline: templated list, no STL inside the implementation, clear/remove/index tests, and no leaks."
				},
				{
					title: "Index Access and Structural Tradeoffs",
					content:
						"Use index-based access mainly as a teaching contrast: linked lists are good at local insertion patterns and poor at random access. Connect that tradeoff to later tree and array conversations."
				},
				{
					title: "Templates and Linked Structures: Verification and Reflection",
					content:
						"Finish DSCPP6 Templates and Linked Structures with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "DSCPP6 Templates and Linked Structures: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP6-Template-Linked-List/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP6-Template-Linked-List/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Template Linked List",
					content:
						"Implement a templated singly linked list with insert, remove, clear, indexed access, and string rendering helpers. This is the structural bridge into the tree labs and keeps the pointer discipline visible.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP6-Template-Linked-List/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP6-Template-Linked-List/solution"
				},
				{
					title: "Templates and Linked Structures supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-13-dscpp6-templates-and-linked-structures-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-13-dscpp6-templates-and-linked-structures-supplemental-2/solution"
				},
				{
					title: "Templates and Linked Structures supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-14-dscpp6-templates-and-linked-structures-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-14-dscpp6-templates-and-linked-structures-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP7 Binary Search Trees",
			curriculum: [
				{
					title: "Ordering Invariants in Tree Form",
					content:
						"Introduce BSTs as ordered structure, not just as branching shape. Skill target: State the left-subtree and right-subtree invariants clearly and use those invariants to justify insertion, search, and removal behavior."
				},
				{
					title: "Recursive Insert and Search",
					content:
						"Make recursive tree traversal feel like controlled narrowing: each comparison shrinks the problem to one subtree. This is the first place where recursion becomes a natural tool for data-structure navigation instead of only maze search."
				},
				{
					title: "Removal with Predecessors",
					content:
						"Removal should be taught carefully because it combines structure cases with invariant preservation. Explicitly reason through leaf removal, one-child replacement, two-child replacement using the in-order predecessor, duplicate rejection, and invalid removals that should leave the tree unchanged."
				},
				{
					title: "Binary Search Trees: Verification and Reflection",
					content:
						"Finish DSCPP7 Binary Search Trees with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "DSCPP7 Binary Search Trees: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP7-Binary-Search-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP7-Binary-Search-Tree/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Binary Search Tree",
					content:
						"Implement BST insertion, duplicate rejection, level-order debugging output, and removal using the in-order predecessor convention. This follows the structure of the source BST lab while cleaning up the learner-facing project surface.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP7-Binary-Search-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP7-Binary-Search-Tree/solution"
				},
				{
					title: "Binary Search Trees supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-15-dscpp7-binary-search-trees-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-15-dscpp7-binary-search-trees-supplemental-2/solution"
				},
				{
					title: "Binary Search Trees supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-16-dscpp7-binary-search-trees-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-16-dscpp7-binary-search-trees-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP8 AVL Trees and Rebalancing",
			curriculum: [
				{
					title: "Why Balancing Exists",
					content:
						"Start from the BST weakness: ordered insert patterns can destroy the expected performance story. AVL trees exist to keep height under control by repairing local imbalance as insertions and removals change the shape."
				},
				{
					title: "Heights and Balance Factors",
					content:
						"This section covers height maintenance and balance factors as structural evidence. Key idea: How to compute imbalance, not just memorize the names of the rotation cases."
				},
				{
					title: "Single and Double Rotations",
					content:
						"Make left-left, right-right, left-right, and right-left cases concrete with tiny examples. Rotations should be presented as local rewiring that preserves in-order structure while reducing height problems. Stress the CS235-style verification cases: ordered inserts, duplicate inserts, missing removals, and repeated add/remove operations that keep every balance factor valid."
				},
				{
					title: "AVL Trees and Rebalancing: Verification and Reflection",
					content:
						"Finish DSCPP8 AVL Trees and Rebalancing with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "DSCPP8 AVL Trees and Rebalancing: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP8-AVL-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP8-AVL-Tree/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: AVL Tree",
					content:
						"Extend the BST ideas into a self-balancing AVL tree with height tracking, rotations, and removal that preserves both BST ordering and balance constraints. This is the natural sequel to the source AVL lab.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP8-AVL-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP8-AVL-Tree/solution"
				},
				{
					title: "AVL Trees and Rebalancing supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-17-dscpp8-avl-trees-and-rebalancing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-17-dscpp8-avl-trees-and-rebalancing-supplemental-2/solution"
				},
				{
					title: "AVL Trees and Rebalancing supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-18-dscpp8-avl-trees-and-rebalancing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-18-dscpp8-avl-trees-and-rebalancing-supplemental-3/solution"
				}
			]
		},
		{
			title: "DSCPP9 Benchmarking and Data-Structure Tradeoffs",
			curriculum: [
				{
					title: "Asymptotic Language versus Real Measurements",
					content:
						"Close the course by connecting complexity claims to actual timing data. Key idea: Big-O is still the right long-run story, but practical measurements depend on constants, memory layout, balancing, and container implementation details."
				},
				{
					title: "Comparing Standard Containers and Custom Structures",
					content:
						"Use timed inserts, removals, and lookups to compare `set`, `unordered_set`, a custom linked list, a BST, and an AVL tree under both random and ordered workloads. The point is not to crown one universal winner, but to connect operation patterns to the right tool and to explain why ordered input punishes an unbalanced BST."
				},
				{
					title: "Interpreting Results Without Overclaiming",
					content:
						"Skill target: Talk cautiously about benchmarks: sample size, workload shape, randomness, and implementation detail all matter. Good benchmarking language is part of engineering maturity."
				},
				{
					title: "Benchmarking and Data Structure Tradeoffs: Verification and Reflection",
					content:
						"Finish DSCPP9 Benchmarking and Data-Structure Tradeoffs with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "DSCPP9 Benchmarking and Data-Structure Tradeoffs: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP9-Performance-Benchmarks/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP9-Performance-Benchmarks/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Performance Benchmarks",
					content:
						"Benchmark standard containers and custom linked or tree structures on a controlled insertion workload, then explain the timing differences in terms of structure, lookup behavior, and balancing. This is the reflective capstone to the whole sequence.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP9-Performance-Benchmarks/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSCPP9-Performance-Benchmarks/solution"
				},
				{
					title: "Benchmarking and Data Structure Tradeoffs supplemental 2",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-19-dscpp9-benchmarking-and-data-structure-tradeoffs-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-19-dscpp9-benchmarking-and-data-structure-tradeoffs-supplemental-2/solution"
				},
				{
					title: "Benchmarking and Data Structure Tradeoffs supplemental 3",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-20-dscpp9-benchmarking-and-data-structure-tradeoffs-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-20-dscpp9-benchmarking-and-data-structure-tradeoffs-supplemental-3/solution"
				}
			]
		},
		{
			title: "c algorithm lab 11: Implementation Lab",
			curriculum: [
				{
					title: "c algorithm lab 11: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "c algorithm lab 11: Guided Example",
					content:
						"A representative c algorithm lab 11 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "c algorithm lab 11: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-cpp-algorithm-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-cpp-algorithm-lab-11/solution"
				},
				{
					title: "c algorithm lab 11: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "c algorithm lab 11: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-cpp-algorithm-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-01-cpp-algorithm-lab-11/solution"
				},
				{
					title: "c algorithm lab 11 supplemental 2: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-21-applied-studio-11-c-algorithm-lab-11-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-21-applied-studio-11-c-algorithm-lab-11-supplemental-2/solution"
				},
				{
					title: "c algorithm lab 11 supplemental 3: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-22-applied-studio-11-c-algorithm-lab-11-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-22-applied-studio-11-c-algorithm-lab-11-supplemental-3/solution"
				}
			]
		},
		{
			title: "c algorithm lab 12: Implementation Lab",
			curriculum: [
				{
					title: "c algorithm lab 12: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "c algorithm lab 12: Guided Example",
					content:
						"A representative c algorithm lab 12 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "c algorithm lab 12: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-cpp-algorithm-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-cpp-algorithm-lab-12/solution"
				},
				{
					title: "c algorithm lab 12: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "c algorithm lab 12: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-cpp-algorithm-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-02-cpp-algorithm-lab-12/solution"
				},
				{
					title: "c algorithm lab 12 supplemental 2: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-23-applied-studio-12-c-algorithm-lab-12-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-23-applied-studio-12-c-algorithm-lab-12-supplemental-2/solution"
				},
				{
					title: "c algorithm lab 12 supplemental 3: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-24-applied-studio-12-c-algorithm-lab-12-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-24-applied-studio-12-c-algorithm-lab-12-supplemental-3/solution"
				}
			]
		},
		{
			title: "c algorithm lab 13: Implementation Lab",
			curriculum: [
				{
					title: "c algorithm lab 13: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "c algorithm lab 13: Guided Example",
					content:
						"A representative c algorithm lab 13 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "c algorithm lab 13: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-cpp-algorithm-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-cpp-algorithm-lab-13/solution"
				},
				{
					title: "c algorithm lab 13: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "c algorithm lab 13: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-cpp-algorithm-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-03-cpp-algorithm-lab-13/solution"
				},
				{
					title: "c algorithm lab 13 supplemental 2: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-25-applied-studio-13-c-algorithm-lab-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-25-applied-studio-13-c-algorithm-lab-13-supplemental-2/solution"
				},
				{
					title: "c algorithm lab 13 supplemental 3: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-26-applied-studio-13-c-algorithm-lab-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-26-applied-studio-13-c-algorithm-lab-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "c algorithm lab 14: Implementation Lab",
			curriculum: [
				{
					title: "c algorithm lab 14: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "c algorithm lab 14: Guided Example",
					content:
						"A representative c algorithm lab 14 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "c algorithm lab 14: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-cpp-algorithm-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-cpp-algorithm-lab-14/solution"
				},
				{
					title: "c algorithm lab 14: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "c algorithm lab 14: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-cpp-algorithm-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-04-cpp-algorithm-lab-14/solution"
				},
				{
					title: "c algorithm lab 14 supplemental 2: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-27-applied-studio-14-c-algorithm-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-27-applied-studio-14-c-algorithm-lab-14-supplemental-2/solution"
				},
				{
					title: "c algorithm lab 14 supplemental 3: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-28-applied-studio-14-c-algorithm-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-28-applied-studio-14-c-algorithm-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "c algorithm lab 15: Implementation Lab",
			curriculum: [
				{
					title: "c algorithm lab 15: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "c algorithm lab 15: Guided Example",
					content:
						"A representative c algorithm lab 15 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "c algorithm lab 15: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-cpp-algorithm-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-cpp-algorithm-lab-15/solution"
				},
				{
					title: "c algorithm lab 15: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "c algorithm lab 15: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-cpp-algorithm-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-05-cpp-algorithm-lab-15/solution"
				},
				{
					title: "c algorithm lab 15 supplemental 2: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-29-applied-studio-15-c-algorithm-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-29-applied-studio-15-c-algorithm-lab-15-supplemental-2/solution"
				},
				{
					title: "c algorithm lab 15 supplemental 3: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-30-applied-studio-15-c-algorithm-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-30-applied-studio-15-c-algorithm-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "c algorithm lab 16: Implementation Lab",
			curriculum: [
				{
					title: "c algorithm lab 16: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "c algorithm lab 16: Guided Example",
					content:
						"A representative c algorithm lab 16 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "c algorithm lab 16: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-cpp-algorithm-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-cpp-algorithm-lab-16/solution"
				},
				{
					title: "c algorithm lab 16: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "c algorithm lab 16: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-cpp-algorithm-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-06-cpp-algorithm-lab-16/solution"
				},
				{
					title: "c algorithm lab 16 supplemental 2: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-31-applied-studio-16-c-algorithm-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-31-applied-studio-16-c-algorithm-lab-16-supplemental-2/solution"
				},
				{
					title: "c algorithm lab 16 supplemental 3: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-32-applied-studio-16-c-algorithm-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-32-applied-studio-16-c-algorithm-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "c algorithm lab 17: Implementation Lab",
			curriculum: [
				{
					title: "c algorithm lab 17: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "c algorithm lab 17: Guided Example",
					content:
						"A representative c algorithm lab 17 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "c algorithm lab 17: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-cpp-algorithm-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-cpp-algorithm-lab-17/solution"
				},
				{
					title: "c algorithm lab 17: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "c algorithm lab 17: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-cpp-algorithm-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-07-cpp-algorithm-lab-17/solution"
				},
				{
					title: "c algorithm lab 17 supplemental 2: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-33-applied-studio-17-c-algorithm-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-33-applied-studio-17-c-algorithm-lab-17-supplemental-2/solution"
				},
				{
					title: "c algorithm lab 17 supplemental 3: Implementation Lab",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-34-applied-studio-17-c-algorithm-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main/DSA-34-applied-studio-17-c-algorithm-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};
