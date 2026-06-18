import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

export const usacoGoldCourse: RawCourse = {
	name: "USACO Gold",
	modules: [
		{
			title: "USG0 Setup and Gold Mindset",
			curriculum: [
				{
					title: "Gold as Algorithmic Structure",
					content:
						"Frame Gold as the tier where dynamic programming, graph optimization, MSTs, Dijkstra-style shortest paths, Fenwick trees, and more formal invariants become normal. Expect fewer purely literal simulations and more algorithmic compression of the problem."
				},
				{
					title: "Implementation Discipline at Higher Complexity",
					content:
						"Use careful naming, helper methods, and meaningful intermediate checks. Gold problems often have an elegant core idea that becomes fragile if the implementation is rushed or opaque."
				},
				{
					title: "From Pattern Recognition to Proof Sketches",
					content:
						"Practice target: Short proof sketches for why a DP transition, greedy choice, or graph method is valid. Gold work rewards the ability to justify the method, not just to recall one."
				},
				{
					title: "Read Constraints as Design Signals",
					content:
						"Use input limits to narrow the candidate solution family quickly. At Gold level, the constraints often tell you more than the story paragraph does."
				},
				{
					title: "USG0 Setup and Gold Mindset: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "USG0 Setup and Gold Mindset",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Gold Log: Setup and Gold Mindset",
					content:
						"Keep a compact Gold-level log for setup and gold mindset that records the core recurrence or invariant, one discarded approach, and one note about which constraint or invariant most clearly signals the right solution family. Gold progress depends on being able to explain the structure of a solution, not just implement it.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube/solution"
				},
				{
					title: "Why Did the Cow Cross the Road III",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "USG0 Setup and Gold Mindset",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG24-Why-Did-the-Cow-Cross-the-Road-III/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG24-Why-Did-the-Cow-Cross-the-Road-III/solution"
				},
				{
					title: "Snow Boots",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "USG0 Setup and Gold Mindset",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG27-Snow-Boots/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG27-Snow-Boots/solution"
				}
			]
		},
		{
			title: "Unit 1: Dynamic Programming Foundations",
			curriculum: [
				{
					title: "State Design and Recurrence Thinking",
					content:
						"Define a DP state so that each smaller answer supports a larger one cleanly. The most important Gold habit here is choosing the right subproblem, not coding the table quickly."
				},
				{
					title: "Transitions, Base Cases, and Ordering",
					content:
						"State how each DP cell depends on earlier work and in what order the states can be computed. The recurrence should be explainable in plain language before it is translated into code."
				},
				{
					title: "Space and Time Tradeoffs",
					content:
						"This section covers when a DP can be compressed, when it cannot, and how to reason about whether a recurrence is actually feasible under the given limits."
				},
				{
					title: "Recognize DP in the Wild",
					content:
						"Compare several problem statements that look unrelated on the surface but collapse into the same state-transition mindset once the structure is exposed."
				},
				{
					title: "Unit 1: Dynamic Programming Foundations: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 1: Dynamic Programming Foundations",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Dynamic Programming with Fibonacci",
					content:
						"Use a simple recurrence to make the DP mindset explicit before harder state spaces are introduced.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci/solution"
				},
				{
					title: "Problem: 0-1 Knapsack",
					content:
						"Use a classic optimization recurrence to practice state design, choices, and table updates.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-0-1-Knapsack/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-0-1-Knapsack/solution"
				},
				{
					title: "Problem: Teamwork",
					content:
						"Use grouped decisions and transition design to move beyond the most basic DP templates.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG3-Teamwork/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG3-Teamwork/solution"
				},
				{
					title: "Problem: Fruit Feast",
					content:
						"Use a state-space DP problem to test whether reachable states and transitions can be managed without losing clarity.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG40-Fruit-Feast/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG40-Fruit-Feast/solution"
				}
			]
		},
		{
			title: "Unit 2: Shortest Paths and Weighted Graphs",
			curriculum: [
				{
					title: "Weighted Graph Modeling",
					content:
						"Identify what the nodes and edges actually represent in a weighted setting. Gold shortest-path work becomes much easier when the model is precise before Dijkstra's algorithm is even considered."
				},
				{
					title: "Dijkstra's Algorithm and Relaxation",
					content:
						"This section covers Dijkstra as repeated relaxation over the currently cheapest frontier. Key idea: The role of the priority queue and why nonnegative weights matter."
				},
				{
					title: "Use Distance Information Strategically",
					content:
						"Move beyond 'compute the shortest paths' and show how those distances become ingredients in a second layer of reasoning. This is where Gold graph problems start to feel richer than Silver traversal."
				},
				{
					title: "Be Explicit about Complexity",
					content:
						"Practice target: Saying how many nodes, edges, and priority-queue operations the approach entails. Gold graph work demands a clearer sense of cost."
				},
				{
					title: "Unit 2: Shortest Paths and Weighted Graphs: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 2: Shortest Paths and Weighted Graphs",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Dijkstra's Algorithm",
					content:
						"Use a direct shortest-path implementation to make priority-queue relaxation fully concrete.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm/solution"
				},
				{
					title: "Problem: Shortcut",
					content:
						"Use shortest-path information inside a second optimization question so distance arrays become tools, not endpoints.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG11-Shortcut/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG11-Shortcut/solution"
				},
				{
					title: "Problem: Fine Dining",
					content:
						"Use a more layered graph task to test whether shortest-path ideas can be adapted to a richer condition set.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG30-Fine-Dining/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG30-Fine-Dining/solution"
				},
				{
					title: "Why Did the Cow Cross the Road II",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 2: Shortest Paths and Weighted Graphs",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG31-Why-Did-the-Cow-Cross-the-Road-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG31-Why-Did-the-Cow-Cross-the-Road-II/solution"
				}
			]
		},
		{
			title: "Unit 3: MSTs, DSU, and Connectivity Optimization",
			curriculum: [
				{
					title: "Minimum Spanning Tree Intuition",
					content:
						"This section covers MSTs as the cheapest way to connect everything under the given edge structure. Key idea: The objective clearly before they memorize Kruskal or Prim."
				},
				{
					title: "Disjoint Set Union as a Connectivity Tool",
					content:
						"Use DSU to support fast connectivity checks while edges are considered in sorted order. Key idea: The role of union-find in the larger algorithmic plan."
				},
				{
					title: "Edge Ordering and Greedy Validity",
					content:
						"Explain why the chosen next edge is safe. This is an important place to practice small proof sketches for greedy algorithms."
				},
				{
					title: "Connectivity Problems beyond the Template",
					content:
						"Compare direct MST tasks with problems that use connectivity ideas in disguised forms. Gold Build a wider pattern library than a single named algorithm."
				},
				{
					title: "Unit 3: MSTs, DSU, and Connectivity Optimization: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 3: MSTs, DSU, and Connectivity Optimization",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: MST",
					content:
						"Use a direct MST implementation to practice sorted edges, cycle avoidance, and connection cost reasoning.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST/solution"
				},
				{
					title: "Problem: Disjoint Sets and Kruskal's",
					content:
						"Use a dedicated DSU and Kruskal exercise to make the structure and proof idea explicit.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG19-Disjoint-Sets-and-Kruskals/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG19-Disjoint-Sets-and-Kruskals/solution"
				},
				{
					title: "Problem: Moocast",
					content:
						"Use a connectivity optimization problem that turns graph reachability and distance structure into a stronger Gold-style challenge.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG17-Moocast/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG17-Moocast/solution"
				}
			]
		},
		{
			title: "Unit 4: Fenwick Trees, Ordering, and Range Structure",
			curriculum: [
				{
					title: "Prefix Structure beyond Simple Arrays",
					content:
						"Move from simple prefix sums into update-friendly structures when the problem demands repeated changes and queries. The point is to keep the range intuition while upgrading the data structure."
				},
				{
					title: "Fenwick Tree Mechanics",
					content:
						"Make the Fenwick tree implementation meaningful by explaining what each node aggregates and why the lowbit jumps work. Do not treat the structure as a magic snippet."
				},
				{
					title: "Ordering Problems with Hidden Statistics",
					content:
						"Use sorted order, inversion-like thinking, and relative positions to solve problems that are really about where elements sit with respect to one another."
				},
				{
					title: "Choose the Smallest Structure that Works",
					content:
						"Compare direct arrays, prefix sums, Fenwick trees, and sorting passes to distinguish when a heavier data structure is necessary and when it is just extra complexity."
				},
				{
					title: "Unit 4: Fenwick Trees, Ordering, and Range Structure: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 4: Fenwick Trees, Ordering, and Range Structure",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Binary Indexed Tree / Fenwick Tree",
					content:
						"Build a direct Fenwick tree checkpoint that connects the data structure to concrete prefix-query behavior.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree/solution"
				},
				{
					title: "Problem: Balanced Photo",
					content:
						"Use relative ordering and imbalance counts to practice range-style reasoning around positions.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG23-Balanced-Photo/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG23-Balanced-Photo/solution"
				},
				{
					title: "Problem: Out of Sorts",
					content:
						"Use ordering and movement analysis to show how a simple-looking sorting story hides richer structure.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG26-Out-of-Sorts/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG26-Out-of-Sorts/solution"
				},
				{
					title: "Circular Barn",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 4: Fenwick Trees, Ordering, and Range Structure",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG37-Circular-Barn/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG37-Circular-Barn/solution"
				}
			]
		},
		{
			title: "Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems",
			curriculum: [
				{
					title: "Model the Right Nodes, Not the Obvious Ones",
					content:
						"Gold graph problems often depend on a less obvious graph representation than the story first suggests. Practice target: Redesigning the graph until the algorithm fits naturally."
				},
				{
					title: "Combine Structure with Optimization",
					content:
						"Use problems where the graph is only part of the story and a second objective or geometric constraint changes how the solution must be built."
				},
				{
					title: "Keep Spatial Reasoning Precise",
					content:
						"Whether the task involves geometry, movement, or mirrored structures, Keep diagrams and coordinate reasoning explicit instead of relying on intuition alone."
				},
				{
					title: "Know When the Model Is the Real Challenge",
					content:
						"Make it clear that some Gold problems are hard not because the algorithm is exotic, but because finding the right representation takes real thought."
				},
				{
					title: "Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Lasers and Mirrors",
					content:
						"Use a spatially flavored graph problem to practice turning geometry into a graph you can actually search.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors/solution"
				},
				{
					title: "Problem: Lights Out",
					content:
						"Use geometric structure and path reasoning to test whether multiple interpretations of distance and position stay aligned.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG35-Lights-Out/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG35-Lights-Out/solution"
				},
				{
					title: "Problem: Circular Barn Revisited",
					content:
						"Use a more involved structural problem to push representation and optimization thinking together.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG36-Circular-Barn-Revisited/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG36-Circular-Barn-Revisited/solution"
				}
			]
		},
		{
			title: "Unit 6: Advanced DP and Combinatorics",
			curriculum: [
				{
					title: "DP beyond the First Table",
					content:
						"Gold DP often involves richer transitions, combinatorial counts, or less obvious state compressions. The key is still the same: define the right subproblem first."
				},
				{
					title: "Count Carefully, Mod Carefully",
					content:
						"When combinatorics enters the picture, Be precise about what is being counted, what constraints remain, and how modular arithmetic interacts with the recurrence."
				},
				{
					title: "Blend Math Insight with Algorithm Design",
					content:
						"Use these problems to show that mathematical structure and algorithmic structure often reinforce each other. A clean count or recurrence can completely change what looks feasible."
				},
				{
					title: "Explain the Transition in Words",
					content:
						"Skill target: Explain every DP transition or combinatorial term in a sentence. If they cannot, the implementation is probably ahead of the understanding."
				},
				{
					title: "Unit 6: Advanced DP and Combinatorics: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 6: Advanced DP and Combinatorics",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Cow Poetry",
					content:
						"Use combinatorial counting and dynamic programming together in a problem where explanation matters as much as implementation.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry/solution"
				},
				{
					title: "Problem: Stamp Painting",
					content:
						"Use a counting DP problem to practice recurrence design under modular arithmetic constraints.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG32-Stamp-Painting/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG32-Stamp-Painting/solution"
				},
				{
					title: "Problem: Time is Mooney",
					content:
						"Use a richer optimization problem that blends repeated transitions and scoring over time.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Time-is-Mooney/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Time-is-Mooney/solution"
				},
				{
					title: "Problem: Milk Visits",
					content:
						"Use a stronger capstone-style problem to test whether multiple Gold ideas can be held together in one coherent solution.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Milk-Visits/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Milk-Visits/solution"
				}
			]
		},
		{
			title: "Unit 7: Gold Capstone Sets",
			curriculum: [
				{
					title: "Mix Families on Purpose",
					content:
						"Practice sets that force a choice among DP, graph optimization, range structures, and combinatorial reasoning. Gold readiness is as much about classification speed as raw implementation skill."
				},
				{
					title: "Write Proof Sketches and Design Notes",
					content:
						"Include a short explanation of the invariant, recurrence, or greedy safety argument behind each serious Gold solution. This turns solved problems into reusable knowledge rather than isolated wins."
				},
				{
					title: "Identify Personal Strengths and Gaps",
					content:
						"Use the capstone sets to diagnose which Gold families are strongest and which still need targeted work. That diagnosis matters more than the number of problems completed."
				},
				{
					title: "Prepare for Independent Gold and Beyond",
					content:
						"Close by positioning the path toward continued Gold training, open contest prep, or deeper systems and algorithms coursework. The outcome is a stronger internal map of advanced problem types."
				},
				{
					title: "Unit 7: Gold Capstone Sets: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 7: Gold Capstone Sets",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Radio Contact",
					content:
						"Use a capstone-style state problem that blends movement and optimization in a way that rewards careful representation.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact/solution"
				},
				{
					title: "Problem: Cowpatibility",
					content:
						"Use a richer counting or combinatorial problem as one more test of explanation and implementation discipline.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG29-Cowpatibility/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG29-Cowpatibility/solution"
				},
				{
					title: "Bovine Genomics",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 7: Gold Capstone Sets",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG38-Bovine-Genomics/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG38-Bovine-Genomics/solution"
				}
			]
		},
		{
			title: "Unit 8: Optional Gold Problem Bank",
			curriculum: [
				{
					title: "Why Gold Needs a Bigger Library",
					content:
						"The `USACO-Gold` repo is broader than the main course by design. A larger technique-indexed library supports pattern recognition at this level because advanced classification depends on seeing many structurally similar problems."
				},
				{
					title: "Advanced DP and Optimization Bank",
					content:
						"Optional DP-heavy and optimization folders include `UG1 Dynamic Programming Practice`, `UG1 Hoof Paper Scissors`, `UG2 Talent Show`, `UG4 Cow Checklist`, `UG5 Marathon`, `UG6 248`, `UG7 Treasure Chest`, and `UG8 Bookshelf`."
				},
				{
					title: "Graph, MST, and Shortest-Path Extensions",
					content:
						"Optional graph-heavy extensions include `UG10 Roadblock`, `UG12/UG24/UG31 Why Did the Cow Cross the Road`, `UG13 Cow Routing`, `UG14 MST II`, `UG15 Superbull`, `UG16 Watering the Fields`, `UG18 I Would Walk 500 Miles`, `UG20 Fenced In`, `UG21 MooTube`, and `UG9 Dijkstra's Algorithm II`."
				},
				{
					title: "Late Gold Counting and Structure Bank",
					content:
						"Additional late-Gold folders include `UG25 Sleepy Cow Sorting`, `UG27 Snow Boots`, `UG28 Cow Poetry`, `UG29 Cowpatibility`, `UG32 Stamp Painting`, `UG36 Circular Barn Revisited`, `UG37 Circular Barn`, `UG38 Bovine Genomics`, `UG-Milk-Visits`, and `UG-Time-is-Mooney`."
				},
				{
					title: "Unit 8: Optional Gold Problem Bank: Core Project",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Unit 8: Optional Gold Problem Bank",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Problem Bank: Full Gold Repo",
					content:
						"Browse the full Gold repo library when the core sequence is not enough and you want the wider advanced-problem inventory.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main"
				},
				{
					title: "Problem: Roadblock",
					content:
						"Use shortest-path sensitivity analysis to deepen understanding of weighted-graph optimization.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG10-Roadblock/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG10-Roadblock/solution"
				},
				{
					title: "Problem: Superbull",
					content:
						"Use an MST-style optimization problem as a stronger extension of connectivity and edge-choice reasoning.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG15-Superbull/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG15-Superbull/solution"
				},
				{
					title: "Problem: Fenced In",
					content:
						"Use a richer connectivity and cost-optimization problem to strengthen MST and graph-structure judgment.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG20-Fenced-In/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG20-Fenced-In/solution"
				},
				{
					title: "Problem: Sleepy Cow Sorting",
					content:
						"Use a strong ordering and invariants problem to test whether the work can reason about progress without brute force.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG25-Sleepy-Cow-Sorting/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG25-Sleepy-Cow-Sorting/solution"
				}
			]
		},
		{
			title: "Dynamic Programming Practice: Implementation Lab",
			curriculum: [
				{
					title: "Dynamic Programming Practice: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Dynamic Programming Practice: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Dynamic Programming Practice: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Dynamic Programming Practice: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Dynamic Programming Practice: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Dynamic Programming Practice: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice/solution"
				},
				{
					title: "Dynamic Programming Practice: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Dynamic Programming Practice: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Dynamic Programming Practice: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Dynamic Programming Practice: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice/solution"
				},
				{
					title: "Cow Checklist",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Dynamic Programming Practice: Implementation Lab",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG4-Cow-Checklist/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG4-Cow-Checklist/solution"
				},
				{
					title: "Marathon",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Dynamic Programming Practice: Implementation Lab",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG5-Marathon/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG5-Marathon/solution"
				}
			]
		},
		{
			title: "Hoof Paper Scissors: Implementation Lab",
			curriculum: [
				{
					title: "Hoof Paper Scissors: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Hoof Paper Scissors: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Hoof Paper Scissors: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Hoof Paper Scissors: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Hoof Paper Scissors: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Hoof Paper Scissors: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors/solution"
				},
				{
					title: "Hoof Paper Scissors: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Hoof Paper Scissors: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Hoof Paper Scissors: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Hoof Paper Scissors: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors/solution"
				},
				{
					title: "248",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Hoof Paper Scissors: Implementation Lab",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG6-248/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG6-248/solution"
				},
				{
					title: "Treasure Chest",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Hoof Paper Scissors: Implementation Lab",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG7-Treasure-Chest/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG7-Treasure-Chest/solution"
				}
			]
		},
		{
			title: "Why Did the Cow Cross the Road: Implementation Lab",
			curriculum: [
				{
					title: "Why Did the Cow Cross the Road: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Why Did the Cow Cross the Road: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Why Did the Cow Cross the Road: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Why Did the Cow Cross the Road: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Why Did the Cow Cross the Road: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Why Did the Cow Cross the Road: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road/solution"
				},
				{
					title: "Why Did the Cow Cross the Road: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Why Did the Cow Cross the Road: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Why Did the Cow Cross the Road: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Why Did the Cow Cross the Road: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road/solution"
				},
				{
					title: "Bookshelf",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Why Did the Cow Cross the Road: Implementation Lab",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG8-Bookshelf/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG8-Bookshelf/solution"
				},
				{
					title: "Dijkstras Algorithm II",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"Why Did the Cow Cross the Road: Implementation Lab",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm-II/solution"
				}
			]
		},
		{
			title: "Cow Routing: Implementation Lab",
			curriculum: [
				{
					title: "Cow Routing: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Cow Routing: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Cow Routing: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Cow Routing: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Cow Routing: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Cow Routing: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing/solution"
				},
				{
					title: "Cow Routing: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Cow Routing: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Cow Routing: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Cow Routing: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing/solution"
				},
				{
					title: "Cow Routing Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Cow Routing: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-01-applied-studio-13-cow-routing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-01-applied-studio-13-cow-routing-supplemental-2/solution"
				},
				{
					title: "Cow Routing Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Cow Routing: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-02-applied-studio-13-cow-routing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-02-applied-studio-13-cow-routing-supplemental-3/solution"
				}
			]
		},
		{
			title: "MST II: Implementation Lab",
			curriculum: [
				{
					title: "MST II: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "MST II: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "MST II: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "MST II: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "MST II: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "MST II: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II/solution"
				},
				{
					title: "MST II: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "MST II: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "MST II: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "MST II: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II/solution"
				},
				{
					title: "MST II Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "MST II: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-03-applied-studio-14-mst-ii-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-03-applied-studio-14-mst-ii-supplemental-2/solution"
				},
				{
					title: "MST II Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "MST II: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-04-applied-studio-14-mst-ii-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-04-applied-studio-14-mst-ii-supplemental-3/solution"
				}
			]
		},
		{
			title: "Watering the Fields: Implementation Lab",
			curriculum: [
				{
					title: "Watering the Fields: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Watering the Fields: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Watering the Fields: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Watering the Fields: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Watering the Fields: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Watering the Fields: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields/solution"
				},
				{
					title: "Watering the Fields: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Watering the Fields: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Watering the Fields: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Watering the Fields: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields/solution"
				},
				{
					title: "Watering the Fields Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Watering the Fields: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-05-applied-studio-15-watering-the-fields-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-05-applied-studio-15-watering-the-fields-supplemental-2/solution"
				},
				{
					title: "Watering the Fields Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Watering the Fields: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-06-applied-studio-15-watering-the-fields-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-06-applied-studio-15-watering-the-fields-supplemental-3/solution"
				}
			]
		},
		{
			title: "I Would Walk 500 Miles: Implementation Lab",
			curriculum: [
				{
					title: "I Would Walk 500 Miles: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"I Would Walk 500 Miles: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "I Would Walk 500 Miles: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"I Would Walk 500 Miles: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "I Would Walk 500 Miles: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"I Would Walk 500 Miles: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles/solution"
				},
				{
					title: "I Would Walk 500 Miles: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"I Would Walk 500 Miles: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "I Would Walk 500 Miles: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"I Would Walk 500 Miles: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles/solution"
				},
				{
					title: "I Would Walk 500 Miles Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"I Would Walk 500 Miles: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-07-applied-studio-16-i-would-walk-500-miles-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-07-applied-studio-16-i-would-walk-500-miles-supplemental-2/solution"
				},
				{
					title: "I Would Walk 500 Miles Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle:
							"I Would Walk 500 Miles: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-08-applied-studio-16-i-would-walk-500-miles-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-08-applied-studio-16-i-would-walk-500-miles-supplemental-3/solution"
				}
			]
		},
		{
			title: "Talent Show: Implementation Lab",
			curriculum: [
				{
					title: "Talent Show: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Talent Show: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Talent Show: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Talent Show: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Talent Show: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Talent Show: Implementation Lab",
						section: "coreProject",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show/solution"
				},
				{
					title: "Talent Show: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Talent Show: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Talent Show: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "USACO",
						moduleTitle: "Talent Show: Implementation Lab",
						section: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show/solution"
				},
				{
					title: "Talent Show Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Talent Show: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-09-applied-studio-17-talent-show-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-09-applied-studio-17-talent-show-supplemental-2/solution"
				},
				{
					title: "Talent Show Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "USACO",
						moduleTitle: "Talent Show: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-10-applied-studio-17-talent-show-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-10-applied-studio-17-talent-show-supplemental-3/solution"
				}
			]
		}
	]
};
