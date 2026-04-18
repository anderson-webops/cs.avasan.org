import type { RawCourse } from "./types";

export const usacoGoldCourse: RawCourse = {
	name: "USACO Gold",
	modules: [
		{
			title: "USG0 Setup and Gold Mindset",
			curriculum: [
				{
					title: "Gold as Algorithmic Structure",
					content:
						"Frame Gold as the tier where dynamic programming, graph optimization, MSTs, Dijkstra-style shortest paths, Fenwick trees, and more formal invariants become normal. Students should expect fewer purely literal simulations and more algorithmic compression of the problem."
				},
				{
					title: "Implementation Discipline at Higher Complexity",
					content:
						"Require careful naming, helper methods, and meaningful intermediate checks. Gold problems often have an elegant core idea that becomes fragile if the implementation is rushed or opaque."
				},
				{
					title: "From Pattern Recognition to Proof Sketches",
					content:
						"Students should practice short proof sketches for why a DP transition, greedy choice, or graph method is valid. Gold work rewards the ability to justify the method, not just to recall one."
				},
				{
					title: "Read Constraints as Design Signals",
					content:
						"Teach students to use input limits to narrow the candidate solution family quickly. At Gold level, the constraints often tell you more than the story paragraph does. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "USG0 Setup and Gold Mindset: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube"
				}
			],
			supplementalProjects: [
				{
					title: "Gold Log: Setup and Gold Mindset",
					content:
						"Keep a compact Gold-level log for setup and gold mindset that records the core recurrence or invariant, one discarded approach, and one note about which constraint or invariant most clearly signals the right solution family. Gold progress depends on being able to explain the structure of a solution, not just implement it.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG21-Moo-Tube"
				},
				{
					title: "Why Did the Cow Cross the Road III",
					content:
						"Use the linked starter and solution for a supplemental project tied to USG0 Setup and Gold Mindset. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG24-Why-Did-the-Cow-Cross-the-Road-III"
				},
				{
					title: "Snow Boots",
					content:
						"Use the linked starter and solution for a supplemental project tied to USG0 Setup and Gold Mindset. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG27-Snow-Boots"
				}
			]
		},
		{
			title: "Unit 1: Dynamic Programming Foundations",
			curriculum: [
				{
					title: "State Design and Recurrence Thinking",
					content:
						"Teach students to define a DP state so that each smaller answer supports a larger one cleanly. The most important Gold habit here is choosing the right subproblem, not coding the table quickly."
				},
				{
					title: "Transitions, Base Cases, and Ordering",
					content:
						"Require students to state how each DP cell depends on earlier work and in what order the states can be computed. The recurrence should be explainable in plain language before it is translated into code."
				},
				{
					title: "Space and Time Tradeoffs",
					content:
						"Teach when a DP can be compressed, when it cannot, and how to reason about whether a recurrence is actually feasible under the given limits. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Recognize DP in the Wild",
					content:
						"Have students compare several problem statements that look unrelated on the surface but collapse into the same state-transition mindset once the structure is exposed. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 1: Dynamic Programming Foundations: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Dynamic Programming with Fibonacci",
					content:
						"Use a simple recurrence to make the DP mindset explicit before harder state spaces are introduced. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci"
				},
				{
					title: "Problem: 0-1 Knapsack",
					content:
						"Use a classic optimization recurrence to practice state design, choices, and table updates. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-0-1-Knapsack"
				},
				{
					title: "Problem: Teamwork",
					content:
						"Use grouped decisions and transition design to move beyond the most basic DP templates. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG3-Teamwork"
				},
				{
					title: "Problem: Fruit Feast",
					content:
						"Use a state-space DP problem to test whether students can manage reachable states and transitions without losing clarity. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG40-Fruit-Feast"
				}
			]
		},
		{
			title: "Unit 2: Shortest Paths and Weighted Graphs",
			curriculum: [
				{
					title: "Weighted Graph Modeling",
					content:
						"Teach students to identify what the nodes and edges actually represent in a weighted setting. Gold shortest-path work becomes much easier when the model is precise before Dijkstra's algorithm is even considered."
				},
				{
					title: "Dijkstra's Algorithm and Relaxation",
					content:
						"Teach Dijkstra as repeated relaxation over the currently cheapest frontier. Students should understand the role of the priority queue and why nonnegative weights matter. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Use Distance Information Strategically",
					content:
						"Move beyond 'compute the shortest paths' and show how those distances become ingredients in a second layer of reasoning. This is where Gold graph problems start to feel richer than Silver traversal."
				},
				{
					title: "Be Explicit about Complexity",
					content:
						"Students should practice saying how many nodes, edges, and priority-queue operations the approach entails. Gold graph work demands a clearer sense of cost. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 2: Shortest Paths and Weighted Graphs: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Dijkstra's Algorithm",
					content:
						"Use a direct shortest-path implementation to make priority-queue relaxation fully concrete. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm"
				},
				{
					title: "Problem: Shortcut",
					content:
						"Use shortest-path information inside a second optimization question so students see distance arrays as tools, not endpoints. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG11-Shortcut"
				},
				{
					title: "Problem: Fine Dining",
					content:
						"Use a more layered graph task to test whether students can adapt shortest-path ideas to a richer condition set. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG30-Fine-Dining"
				},
				{
					title: "Why Did the Cow Cross the Road II",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 2: Shortest Paths and Weighted Graphs. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG31-Why-Did-the-Cow-Cross-the-Road-II"
				}
			]
		},
		{
			title: "Unit 3: MSTs, DSU, and Connectivity Optimization",
			curriculum: [
				{
					title: "Minimum Spanning Tree Intuition",
					content:
						"Teach MSTs as the cheapest way to connect everything under the given edge structure. Students should understand the objective clearly before they memorize Kruskal or Prim. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Disjoint Set Union as a Connectivity Tool",
					content:
						"Use DSU to support fast connectivity checks while edges are considered in sorted order. Students should understand the role of union-find in the larger algorithmic plan. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Edge Ordering and Greedy Validity",
					content:
						"Require students to explain why the chosen next edge is safe. This is an important place to practice small proof sketches for greedy algorithms. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Connectivity Problems beyond the Template",
					content:
						"Compare direct MST tasks with problems that use connectivity ideas in disguised forms. Gold students should build a wider pattern library than a single named algorithm. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 3: MSTs, DSU, and Connectivity Optimization: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: MST",
					content:
						"Use a direct MST implementation to practice sorted edges, cycle avoidance, and connection cost reasoning. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST"
				},
				{
					title: "Problem: Disjoint Sets and Kruskal's",
					content:
						"Use a dedicated DSU and Kruskal exercise to make the structure and proof idea explicit. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG19-Disjoint-Sets-and-Kruskals"
				},
				{
					title: "Problem: Moocast",
					content:
						"Use a connectivity optimization problem that turns graph reachability and distance structure into a stronger Gold-style challenge. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG17-Moocast"
				}
			]
		},
		{
			title: "Unit 4: Fenwick Trees, Ordering, and Range Structure",
			curriculum: [
				{
					title: "Prefix Structure beyond Simple Arrays",
					content:
						"Teach students to move from simple prefix sums into update-friendly structures when the problem demands repeated changes and queries. The point is to keep the range intuition while upgrading the data structure."
				},
				{
					title: "Fenwick Tree Mechanics",
					content:
						"Make the Fenwick tree implementation meaningful by explaining what each node aggregates and why the lowbit jumps work. Students should not treat the structure as a magic snippet. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Ordering Problems with Hidden Statistics",
					content:
						"Use sorted order, inversion-like thinking, and relative positions to solve problems that are really about where elements sit with respect to one another. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Choose the Smallest Structure that Works",
					content:
						"Compare direct arrays, prefix sums, Fenwick trees, and sorting passes so students learn when a heavier data structure is necessary and when it is just extra complexity. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 4: Fenwick Trees, Ordering, and Range Structure: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Binary Indexed Tree / Fenwick Tree",
					content:
						"Use a direct Fenwick implementation lab to connect the data structure to concrete prefix-query behavior. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree"
				},
				{
					title: "Problem: Balanced Photo",
					content:
						"Use relative ordering and imbalance counts to practice range-style reasoning around positions. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG23-Balanced-Photo"
				},
				{
					title: "Problem: Out of Sorts",
					content:
						"Use ordering and movement analysis to show how a simple-looking sorting story hides richer structure. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG26-Out-of-Sorts"
				},
				{
					title: "Circular Barn",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 4: Fenwick Trees, Ordering, and Range Structure. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG37-Circular-Barn"
				}
			]
		},
		{
			title: "Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems",
			curriculum: [
				{
					title: "Model the Right Nodes, Not the Obvious Ones",
					content:
						"Gold graph problems often depend on a less obvious graph representation than the story first suggests. Students should practice redesigning the graph until the algorithm fits naturally."
				},
				{
					title: "Combine Structure with Optimization",
					content:
						"Use problems where the graph is only part of the story and a second objective or geometric constraint changes how the solution must be built. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Keep Spatial Reasoning Precise",
					content:
						"Whether the task involves geometry, movement, or mirrored structures, students should keep diagrams and coordinate reasoning explicit instead of relying on intuition alone. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Know When the Model Is the Real Challenge",
					content:
						"Make it clear that some Gold problems are hard not because the algorithm is exotic, but because finding the right representation takes real thought. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Lasers and Mirrors",
					content:
						"Use a spatially flavored graph problem to practice turning geometry into a graph you can actually search. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors"
				},
				{
					title: "Problem: Lights Out",
					content:
						"Use geometric structure and path reasoning to test whether students can keep multiple interpretations of distance and position aligned. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG35-Lights-Out"
				},
				{
					title: "Problem: Circular Barn Revisited",
					content:
						"Use a more involved structural problem to push representation and optimization thinking together. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG36-Circular-Barn-Revisited"
				}
			]
		},
		{
			title: "Unit 6: Advanced DP and Combinatorics",
			curriculum: [
				{
					title: "DP beyond the First Table",
					content:
						"Show students that Gold DP may involve richer transitions, combinatorial counts, or less obvious state compressions. The key is still the same: define the right subproblem first. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Count Carefully, Mod Carefully",
					content:
						"When combinatorics enters the picture, students should be precise about what is being counted, what constraints remain, and how modular arithmetic interacts with the recurrence. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Blend Math Insight with Algorithm Design",
					content:
						"Use these problems to show that mathematical structure and algorithmic structure often reinforce each other. A clean count or recurrence can completely change what looks feasible. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Explain the Transition in Words",
					content:
						"Students should be able to explain every DP transition or combinatorial term in a sentence. If they cannot, the implementation is probably ahead of the understanding. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 6: Advanced DP and Combinatorics: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Cow Poetry",
					content:
						"Use combinatorial counting and dynamic programming together in a problem where explanation matters as much as implementation. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry"
				},
				{
					title: "Problem: Stamp Painting",
					content:
						"Use a counting DP problem to practice recurrence design under modular arithmetic constraints. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG32-Stamp-Painting"
				},
				{
					title: "Problem: Time is Mooney",
					content:
						"Use a richer optimization problem that blends repeated transitions and scoring over time. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Time-is-Mooney"
				},
				{
					title: "Problem: Milk Visits",
					content:
						"Use a stronger capstone-style problem to test whether multiple Gold ideas can be held together in one coherent solution. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Milk-Visits"
				}
			]
		},
		{
			title: "Unit 7: Gold Capstone Sets",
			curriculum: [
				{
					title: "Mix Families on Purpose",
					content:
						"Practice sets that force students to choose among DP, graph optimization, range structures, and combinatorial reasoning. Gold readiness is as much about classification speed as raw implementation skill."
				},
				{
					title: "Write Proof Sketches and Design Notes",
					content:
						"Require a short explanation of the invariant, recurrence, or greedy safety argument behind each serious Gold solution. This turns solved problems into reusable knowledge rather than isolated wins."
				},
				{
					title: "Identify Personal Strengths and Gaps",
					content:
						"Use the capstone sets to diagnose which Gold families are strongest and which still need targeted work. That diagnosis matters more than the number of problems completed. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Prepare for Independent Gold and Beyond",
					content:
						"Close by positioning the student for continued Gold training, open contest prep, or deeper systems and algorithms coursework. The course should leave them with a stronger internal map of advanced problem types."
				},
				{
					title: "Unit 7: Gold Capstone Sets: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Radio Contact",
					content:
						"Use a capstone-style state problem that blends movement and optimization in a way that rewards careful representation. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact"
				},
				{
					title: "Problem: Cowpatibility",
					content:
						"Use a richer counting or combinatorial problem as one more test of explanation and implementation discipline. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG29-Cowpatibility"
				},
				{
					title: "Bovine Genomics",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 7: Gold Capstone Sets. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG38-Bovine-Genomics"
				}
			]
		},
		{
			title: "Unit 8: Optional Gold Problem Bank",
			curriculum: [
				{
					title: "Why Gold Needs a Bigger Library",
					content:
						"The `USACO-Gold` repo is broader than the main course by design. Gold students benefit from a larger technique-indexed library because pattern recognition at this level depends on seeing many structurally similar problems."
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
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Problem Bank: Full Gold Repo",
					content:
						"Browse the full Gold repo library when the core sequence is not enough and you want the wider advanced-problem inventory. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main"
				},
				{
					title: "Problem: Roadblock",
					content:
						"Use shortest-path sensitivity analysis to deepen the student's understanding of weighted-graph optimization. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG10-Roadblock"
				},
				{
					title: "Problem: Superbull",
					content:
						"Use an MST-style optimization problem as a stronger extension of connectivity and edge-choice reasoning. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG15-Superbull"
				},
				{
					title: "Problem: Fenced In",
					content:
						"Use a richer connectivity and cost-optimization problem to strengthen MST and graph-structure judgment. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG20-Fenced-In"
				},
				{
					title: "Problem: Sleepy Cow Sorting",
					content:
						"Use a strong ordering and invariants problem to test whether the student can reason about progress without brute force. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG25-Sleepy-Cow-Sorting"
				}
			]
		},
		{
			title: "Applied Studio 10: Dynamic Programming Practice",
			curriculum: [
				{
					title: "Dynamic Programming Practice: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 10: Dynamic Programming Practice, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "Dynamic Programming Practice: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 10: Dynamic Programming Practice, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Dynamic Programming Practice: Core Project",
					content:
						"Build the central artifact for Applied Studio 10: Dynamic Programming Practice. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice"
				},
				{
					title: "Dynamic Programming Practice: Review and Reflection",
					content:
						"Close Applied Studio 10: Dynamic Programming Practice by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Dynamic Programming Practice: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 10: Dynamic Programming Practice with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice"
				},
				{
					title: "Cow Checklist",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 10: Dynamic Programming Practice. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG4-Cow-Checklist"
				},
				{
					title: "Marathon",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 10: Dynamic Programming Practice. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG5-Marathon"
				}
			]
		},
		{
			title: "Applied Studio 11: Hoof Paper Scissors",
			curriculum: [
				{
					title: "Hoof Paper Scissors: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 11: Hoof Paper Scissors, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "Hoof Paper Scissors: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 11: Hoof Paper Scissors, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Hoof Paper Scissors: Core Project",
					content:
						"Build the central artifact for Applied Studio 11: Hoof Paper Scissors. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors"
				},
				{
					title: "Hoof Paper Scissors: Review and Reflection",
					content:
						"Close Applied Studio 11: Hoof Paper Scissors by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Hoof Paper Scissors: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 11: Hoof Paper Scissors with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors"
				},
				{
					title: "248",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: Hoof Paper Scissors. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG6-248"
				},
				{
					title: "Treasure Chest",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: Hoof Paper Scissors. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG7-Treasure-Chest"
				}
			]
		},
		{
			title: "Applied Studio 12: Why Did the Cow Cross the Road",
			curriculum: [
				{
					title: "Why Did the Cow Cross the Road: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: Why Did the Cow Cross the Road, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "Why Did the Cow Cross the Road: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: Why Did the Cow Cross the Road, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Why Did the Cow Cross the Road: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: Why Did the Cow Cross the Road. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road"
				},
				{
					title: "Why Did the Cow Cross the Road: Review and Reflection",
					content:
						"Close Applied Studio 12: Why Did the Cow Cross the Road by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Why Did the Cow Cross the Road: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: Why Did the Cow Cross the Road with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road"
				},
				{
					title: "Bookshelf",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: Why Did the Cow Cross the Road. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG8-Bookshelf"
				},
				{
					title: "Dijkstras Algorithm II",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: Why Did the Cow Cross the Road. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm-II"
				}
			]
		},
		{
			title: "Applied Studio 13: Cow Routing",
			curriculum: [
				{
					title: "Cow Routing: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: Cow Routing, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Cow Routing: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: Cow Routing, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Cow Routing: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: Cow Routing. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing"
				},
				{
					title: "Cow Routing: Review and Reflection",
					content:
						"Close Applied Studio 13: Cow Routing by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Cow Routing: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: Cow Routing with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing"
				},
				{
					title: "Applied Studio 13: Cow Routing supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: Cow Routing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-01-applied-studio-13-cow-routing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-01-applied-studio-13-cow-routing-supplemental-2/solution"
				},
				{
					title: "Applied Studio 13: Cow Routing supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: Cow Routing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-02-applied-studio-13-cow-routing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-02-applied-studio-13-cow-routing-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: MST II",
			curriculum: [
				{
					title: "MST II: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: MST II, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "MST II: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: MST II, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "MST II: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: MST II. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II"
				},
				{
					title: "MST II: Review and Reflection",
					content:
						"Close Applied Studio 14: MST II by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "MST II: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: MST II with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II"
				},
				{
					title: "Applied Studio 14: MST II supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: MST II. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-03-applied-studio-14-mst-ii-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-03-applied-studio-14-mst-ii-supplemental-2/solution"
				},
				{
					title: "Applied Studio 14: MST II supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: MST II. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-04-applied-studio-14-mst-ii-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-04-applied-studio-14-mst-ii-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: Watering the Fields",
			curriculum: [
				{
					title: "Watering the Fields: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: Watering the Fields, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "Watering the Fields: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: Watering the Fields, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Watering the Fields: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: Watering the Fields. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields"
				},
				{
					title: "Watering the Fields: Review and Reflection",
					content:
						"Close Applied Studio 15: Watering the Fields by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Watering the Fields: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: Watering the Fields with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields"
				},
				{
					title: "Applied Studio 15: Watering the Fields supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: Watering the Fields. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-05-applied-studio-15-watering-the-fields-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-05-applied-studio-15-watering-the-fields-supplemental-2/solution"
				},
				{
					title: "Applied Studio 15: Watering the Fields supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: Watering the Fields. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-06-applied-studio-15-watering-the-fields-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-06-applied-studio-15-watering-the-fields-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: I Would Walk 500 Miles",
			curriculum: [
				{
					title: "I Would Walk 500 Miles: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: I Would Walk 500 Miles, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "I Would Walk 500 Miles: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: I Would Walk 500 Miles, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "I Would Walk 500 Miles: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: I Would Walk 500 Miles. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles"
				},
				{
					title: "I Would Walk 500 Miles: Review and Reflection",
					content:
						"Close Applied Studio 16: I Would Walk 500 Miles by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "I Would Walk 500 Miles: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: I Would Walk 500 Miles with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles"
				},
				{
					title: "Applied Studio 16: I Would Walk 500 Miles supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: I Would Walk 500 Miles. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-07-applied-studio-16-i-would-walk-500-miles-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-07-applied-studio-16-i-would-walk-500-miles-supplem/solution"
				},
				{
					title: "Applied Studio 16: I Would Walk 500 Miles supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: I Would Walk 500 Miles. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-08-applied-studio-16-i-would-walk-500-miles-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-08-applied-studio-16-i-would-walk-500-miles-supplem/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: Talent Show",
			curriculum: [
				{
					title: "Talent Show: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: Talent Show, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Talent Show: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: Talent Show, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Talent Show: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: Talent Show. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show"
				},
				{
					title: "Talent Show: Review and Reflection",
					content:
						"Close Applied Studio 17: Talent Show by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Talent Show: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: Talent Show with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show"
				},
				{
					title: "Applied Studio 17: Talent Show supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: Talent Show. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-09-applied-studio-17-talent-show-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-09-applied-studio-17-talent-show-supplemental-2/solution"
				},
				{
					title: "Applied Studio 17: Talent Show supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: Talent Show. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-10-applied-studio-17-talent-show-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-10-applied-studio-17-talent-show-supplemental-3/solution"
				}
			]
		}
	]
};
