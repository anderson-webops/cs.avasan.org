import type { RawCourse, RawCourseModuleItem } from "./types";

const DATA_STRUCTURES_CPP_REPO =
	"https://github.com/instruction-material/Data-Structures-and-Algorithms-in-CPP/tree/main";

function starterRepoLink(projectId: string) {
	return `${DATA_STRUCTURES_CPP_REPO}/${projectId}/starter`;
}

function solutionRepoLink(projectId: string) {
	return `${DATA_STRUCTURES_CPP_REPO}/${projectId}/solution`;
}

function projectItem(
	title: string,
	content: string,
	projectId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: starterRepoLink(projectId),
		solutionLink: solutionRepoLink(projectId)
	};
}

function complexityCheckpoint(
	title: string,
	focus: string
): RawCourseModuleItem {
	return {
		title: `Complexity Checkpoint: ${title}`,
		content: `Pause after ${title.toLowerCase()} and record the key operation count story, the dominant data movement pattern, and one plain-language explanation of why ${focus}.`
	};
}

function debuggingDrill(title: string, prompt: string): RawCourseModuleItem {
	return {
		title: `Debugging Drill: ${title}`,
		content: `Require students to inspect a failing edge case before changing code. ${prompt}`
	};
}

export const dataStructuresAndAlgorithmsInCppCourse: RawCourse = {
	name: "Data Structures and Algorithms in C++",
	modules: [
		{
			title: "DSCPP0 Setup and Positioning",
			curriculum: [
				{
					title: "Course Positioning After C++ Level 1",
					content:
						"Position this course as the next serious step after `C++ Level 1`. Students should already be comfortable with variables, control flow, functions, classes, headers, pointers, and references before this sequence shifts the focus to data structures, algorithm design, and complexity."
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
						"Students should get used to tracing data by hand, printing intermediate structure states, and explaining asymptotic behavior in plain language. Every unit should end with at least one debugging pass that checks the shape of the structure, not just final output."
				}
			],
			supplementalProjects: [
				complexityCheckpoint(
					"Setup and Positioning",
					"the cost of debugging late is much higher once recursion and ownership bugs enter the picture"
				),
				debuggingDrill(
					"Build and Run Sanity Check",
					"Have students intentionally break one include or function signature, then explain the compiler feedback before fixing it."
				)
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
						"Teach sequence mutation through task filtering and removal. Students should understand the difference between searching, erasing, and printing sorted views rather than treating a vector like a magical bag of values."
				},
				{
					title: "Command-Style Program Structure",
					content:
						"Model programs that interpret an action, update state, and print a clear result. This becomes a useful pattern later when tree and graph labs expose many small operations through a driver."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Task Manager CLI",
					"Build a file-ready task manager that stores dated tasks, filters by date, removes tasks safely, and prints consistent views of the current schedule. The lab is intentionally small so students can focus on clean data handling and interface boundaries.",
					"DSCPP1-Task-Manager-CLI"
				),
				debuggingDrill(
					"Task Removal Cases",
					"Test removing the first task, the last task, a missing task, and two tasks with the same date so students do not accidentally only solve the happy path."
				)
			]
		},
		{
			title: "DSCPP2 Graphs and Shortest Paths",
			curriculum: [
				{
					title: "Adjacency Matrices and Weighted Connectivity",
					content:
						"Represent a graph as weighted node-to-node connectivity and make the storage format explicit. Students should be able to explain what `-1` or another sentinel means in the matrix instead of only copying loops that walk it."
				},
				{
					title: "Shortest Path Thinking",
					content:
						"Teach shortest-path work as a repeated relaxation problem rather than as memorized Dijkstra vocabulary. The key judgment is understanding why a currently known best cost can still improve through another route until the frontier closes."
				},
				{
					title: "Path Reconstruction",
					content:
						"Do not stop at distance values. Students should record parent relationships and reconstruct the actual route so they understand the difference between knowing a cost and knowing the path that produced it."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Graph Navigation",
					"Read a weighted road-style network, compute the shortest path between two nodes, and reconstruct the route from start to goal. The project is directly aligned with the graph-navigation lab style from the source course, but rewritten for cleaner student-facing starter and solution code.",
					"DSCPP2-Graph-Navigation"
				),
				complexityCheckpoint(
					"Graphs and Shortest Paths",
					"the difference between scanning every node each step and using a more structured frontier matters once graphs grow"
				)
			]
		},
		{
			title: "DSCPP3 STL Containers and State-Based Text Generation",
			curriculum: [
				{
					title: "Vectors, Sets, Maps, and Deques as Different Stories",
					content:
						"Teach each container as solving a different problem: vectors preserve sequence, sets track uniqueness, maps connect keys to values, and deques are helpful when the state window slides forward over time."
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
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Markov Text Generator",
					"Build a small text generator that tokenizes an input string, records unique vocabulary, and uses a deque-backed state window with a map to produce sample output. This adapts the container-heavy source lab into a more readable course project.",
					"DSCPP3-Markov-Text-Generator"
				),
				debuggingDrill(
					"Token Cleanup",
					"Compare raw tokens and cleaned tokens side by side so students can spot when punctuation handling quietly changes the model."
				)
			]
		},
		{
			title: "DSCPP4 Recursion and Backtracking in 3D Mazes",
			curriculum: [
				{
					title: "Recursive Search as Controlled Exploration",
					content:
						"Treat recursion as a disciplined search strategy, not a mysterious language trick. Students should explain what each call means, what state is local to that call, and when the recursion is done."
				},
				{
					title: "Visited State and Cycle Prevention",
					content:
						"Backtracking only works cleanly when students mark visited cells and reason about state changes carefully. This is the unit where accidental revisits, coordinate mistakes, and off-by-one bugs should be surfaced deliberately."
				},
				{
					title: "Path Construction and Rollback",
					content:
						"Make path handling explicit: add a coordinate when the recursion advances, remove it when a branch fails, and keep the successful path intact. This becomes an important mental model for recursive data-structure work later."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Recursive Maze Pathfinder",
					"Import a 5x5x5 maze, validate the data, and recursively search for a path from the entrance to the exit without cycles. This keeps the original maze-lab spirit but removes the grading harness clutter from the student-facing version.",
					"DSCPP4-Recursive-Maze-Pathfinder"
				),
				debuggingDrill(
					"Backtracking Trace",
					"Have students print when a coordinate is entered and when it is removed from the path so the recursion tree becomes visible instead of magical."
				)
			]
		},
		{
			title: "DSCPP5 Quicksort and Partitioning",
			curriculum: [
				{
					title: "Why Partition-Based Sorting Works",
					content:
						"Explain quicksort through the partitioning story first: choose a pivot, move smaller elements left, larger elements right, and recurse on the remaining subranges. Students should be able to narrate the array state after each partition."
				},
				{
					title: "Median of Three and Practical Pivot Choice",
					content:
						"Introduce median-of-three as a practical improvement rather than as ritual. The lesson is about reducing bad pivot choices on partially sorted data, not about memorizing a special case in isolation."
				},
				{
					title: "Recursive Boundaries and Base Cases",
					content:
						"Make students prove where the recursion stops and why the subranges shrink. Quicksort bugs often come from boundary confusion rather than from misunderstanding the big idea."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Quicksort Toolkit",
					"Build the buffer management, median-of-three selection, partition logic, and recursive quicksort flow needed to sort an integer sequence cleanly. The project mirrors the source quicksort lab but uses a cleaner starter/solution layout.",
					"DSCPP5-Quicksort-Toolkit"
				),
				complexityCheckpoint(
					"Quicksort and Partitioning",
					"the pivot story determines whether the recursive splits stay healthy or collapse toward worst-case behavior"
				)
			]
		},
		{
			title: "DSCPP6 Templates and Linked Structures",
			curriculum: [
				{
					title: "Why Templates Matter Here",
					content:
						"Teach templates as a way to reuse the same linked-list logic across multiple data types without copying code. Students should understand the compile-time nature of templates instead of treating them like runtime generics."
				},
				{
					title: "Single-Linked Nodes and Pointer Updates",
					content:
						"Walk through insertion and removal one pointer change at a time. This is the point where students need to be fluent about head updates, middle insertions, and what happens when the target value is missing."
				},
				{
					title: "Index Access and Structural Tradeoffs",
					content:
						"Use index-based access mainly as a teaching contrast: linked lists are good at local insertion patterns and poor at random access. Students should connect that tradeoff to later tree and array conversations."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Template Linked List",
					"Implement a templated singly linked list with insert, remove, clear, indexed access, and string rendering helpers. This is the structural bridge into the tree labs and keeps the pointer discipline visible.",
					"DSCPP6-Template-Linked-List"
				),
				debuggingDrill(
					"Head and Middle Removals",
					"Trace the node links before and after removing the head, a middle value, and a missing value so students can verify pointer rewiring instead of hoping it worked."
				)
			]
		},
		{
			title: "DSCPP7 Binary Search Trees",
			curriculum: [
				{
					title: "Ordering Invariants in Tree Form",
					content:
						"Introduce BSTs as ordered structure, not just as branching shape. Students should be able to state the left-subtree and right-subtree invariants clearly and use those invariants to justify insertion, search, and removal behavior."
				},
				{
					title: "Recursive Insert and Search",
					content:
						"Make recursive tree traversal feel like controlled narrowing: each comparison shrinks the problem to one subtree. This is the first place where recursion becomes a natural tool for data-structure navigation instead of only maze search."
				},
				{
					title: "Removal with Predecessors",
					content:
						"Removal should be taught carefully because it combines structure cases with invariant preservation. Students should explicitly reason through leaf removal, one-child replacement, and two-child replacement using the in-order predecessor."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Binary Search Tree",
					"Implement BST insertion, duplicate rejection, level-order debugging output, and removal using the in-order predecessor convention. This follows the structure of the source BST lab while cleaning up the student-facing project surface.",
					"DSCPP7-Binary-Search-Tree"
				),
				complexityCheckpoint(
					"Binary Search Trees",
					"tree shape determines whether the structure behaves like a helpful logarithmic search tool or degrades toward linked-list behavior"
				)
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
						"Teach height maintenance and balance factors as structural evidence. Students should know how to compute imbalance, not just memorize the names of the rotation cases."
				},
				{
					title: "Single and Double Rotations",
					content:
						"Make left-left, right-right, left-right, and right-left cases concrete with tiny examples. Rotations should be presented as local rewiring that preserves in-order structure while reducing height problems."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: AVL Tree",
					"Extend the BST ideas into a self-balancing AVL tree with height tracking, rotations, and removal that preserves both BST ordering and balance constraints. This is the natural sequel to the source AVL lab.",
					"DSCPP8-AVL-Tree"
				),
				debuggingDrill(
					"Rotation Cases",
					"Build tiny insertion sequences that force each rotation family so students can verify the tree shape after every rebalance."
				)
			]
		},
		{
			title: "DSCPP9 Benchmarking and Data-Structure Tradeoffs",
			curriculum: [
				{
					title: "Asymptotic Language versus Real Measurements",
					content:
						"Close the course by connecting complexity claims to actual timing data. Students should understand that big-O is still the right long-run story, but practical measurements depend on constants, memory layout, balancing, and container implementation details."
				},
				{
					title: "Comparing Standard Containers and Custom Structures",
					content:
						"Use timed inserts and lookups to compare `vector`, `set`, `unordered_set`, and the custom linked or tree structures from the course. The point is not to crown one universal winner, but to connect operation patterns to the right tool."
				},
				{
					title: "Interpreting Results Without Overclaiming",
					content:
						"Students should learn to talk cautiously about benchmarks: sample size, workload shape, randomness, and implementation detail all matter. Good benchmarking language is part of engineering maturity."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Performance Benchmarks",
					"Benchmark standard containers and custom linked or tree structures on a controlled insertion workload, then explain the timing differences in terms of structure, lookup behavior, and balancing. This is the reflective capstone to the whole sequence.",
					"DSCPP9-Performance-Benchmarks"
				),
				complexityCheckpoint(
					"Benchmarking and Data-Structure Tradeoffs",
					"students should be able to reconcile the measured results with the theoretical lookup and insertion stories from earlier modules"
				)
			]
		}
	]
};
