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
						"Frame Gold as the tier where dynamic programming, graph optimization, MSTs, Dijkstra-style shortest paths, Fenwick trees, and more formal invariants become normal. Expect fewer purely literal simulations and more algorithmic compression of the problem."
				},
				{
					title: "Implementation Discipline at Higher Complexity",
					content:
						"Require careful naming, helper methods, and meaningful intermediate checks. Gold problems often have an elegant core idea that becomes fragile if the implementation is rushed or opaque."
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
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for USG0 Setup and Gold Mindset. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
						"**Project goal:** Complete the linked C++ core implementation checkpoint for USG0 Setup and Gold Mindset. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG24-Why-Did-the-Cow-Cross-the-Road-III"
				},
				{
					title: "Snow Boots",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for USG0 Setup and Gold Mindset. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 1: Dynamic Programming Foundations. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Dynamic Programming with Fibonacci",
					content:
						"Use a simple recurrence to make the DP mindset explicit before harder state spaces are introduced.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-with-Fibonacci"
				},
				{
					title: "Problem: 0-1 Knapsack",
					content:
						"Use a classic optimization recurrence to practice state design, choices, and table updates.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-0-1-Knapsack"
				},
				{
					title: "Problem: Teamwork",
					content:
						"Use grouped decisions and transition design to move beyond the most basic DP templates.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG3-Teamwork"
				},
				{
					title: "Problem: Fruit Feast",
					content:
						"Use a state-space DP problem to test whether students can manage reachable states and transitions without losing clarity.",
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
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 2: Shortest Paths and Weighted Graphs. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Dijkstra's Algorithm",
					content:
						"Use a direct shortest-path implementation to make priority-queue relaxation fully concrete.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm"
				},
				{
					title: "Problem: Shortcut",
					content:
						"Use shortest-path information inside a second optimization question so distance arrays become tools, not endpoints.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG11-Shortcut"
				},
				{
					title: "Problem: Fine Dining",
					content:
						"Use a more layered graph task to test whether students can adapt shortest-path ideas to a richer condition set.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG30-Fine-Dining"
				},
				{
					title: "Why Did the Cow Cross the Road II",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 2: Shortest Paths and Weighted Graphs. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 3: MSTs, DSU, and Connectivity Optimization. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: MST",
					content:
						"Use a direct MST implementation to practice sorted edges, cycle avoidance, and connection cost reasoning.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST"
				},
				{
					title: "Problem: Disjoint Sets and Kruskal's",
					content:
						"Use a dedicated DSU and Kruskal exercise to make the structure and proof idea explicit.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG19-Disjoint-Sets-and-Kruskals"
				},
				{
					title: "Problem: Moocast",
					content:
						"Use a connectivity optimization problem that turns graph reachability and distance structure into a stronger Gold-style challenge.",
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
						"Move from simple prefix sums into update-friendly structures when the problem demands repeated changes and queries. The point is to keep the range intuition while upgrading the data structure."
				},
				{
					title: "Fenwick Tree Mechanics",
					content:
						"Make the Fenwick tree implementation meaningful by explaining what each node aggregates and why the lowbit jumps work. Not treat the structure as a magic snippet."
				},
				{
					title: "Ordering Problems with Hidden Statistics",
					content:
						"Use sorted order, inversion-like thinking, and relative positions to solve problems that are really about where elements sit with respect to one another."
				},
				{
					title: "Choose the Smallest Structure that Works",
					content:
						"Compare direct arrays, prefix sums, Fenwick trees, and sorting passes so students learn when a heavier data structure is necessary and when it is just extra complexity."
				},
				{
					title: "Unit 4: Fenwick Trees, Ordering, and Range Structure: Core Project",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 4: Fenwick Trees, Ordering, and Range Structure. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Binary Indexed Tree / Fenwick Tree",
					content:
						"Use a direct Fenwick implementation lab to connect the data structure to concrete prefix-query behavior.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG22-Binary-Indexed-Tree-Fenwick-Tree"
				},
				{
					title: "Problem: Balanced Photo",
					content:
						"Use relative ordering and imbalance counts to practice range-style reasoning around positions.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG23-Balanced-Photo"
				},
				{
					title: "Problem: Out of Sorts",
					content:
						"Use ordering and movement analysis to show how a simple-looking sorting story hides richer structure.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG26-Out-of-Sorts"
				},
				{
					title: "Circular Barn",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 4: Fenwick Trees, Ordering, and Range Structure. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 5: Advanced Graph Modeling and Geometry-Flavored Problems. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Lasers and Mirrors",
					content:
						"Use a spatially flavored graph problem to practice turning geometry into a graph you can actually search.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG33-Lasers-and-Mirrors"
				},
				{
					title: "Problem: Lights Out",
					content:
						"Use geometric structure and path reasoning to test whether students can keep multiple interpretations of distance and position aligned.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG35-Lights-Out"
				},
				{
					title: "Problem: Circular Barn Revisited",
					content:
						"Use a more involved structural problem to push representation and optimization thinking together.",
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
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 6: Advanced DP and Combinatorics. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Cow Poetry",
					content:
						"Use combinatorial counting and dynamic programming together in a problem where explanation matters as much as implementation.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG28-Cow-Poetry"
				},
				{
					title: "Problem: Stamp Painting",
					content:
						"Use a counting DP problem to practice recurrence design under modular arithmetic constraints.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG32-Stamp-Painting"
				},
				{
					title: "Problem: Time is Mooney",
					content:
						"Use a richer optimization problem that blends repeated transitions and scoring over time.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-Time-is-Mooney"
				},
				{
					title: "Problem: Milk Visits",
					content:
						"Use a stronger capstone-style problem to test whether multiple Gold ideas can be held together in one coherent solution.",
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
						"Use the capstone sets to diagnose which Gold families are strongest and which still need targeted work. That diagnosis matters more than the number of problems completed."
				},
				{
					title: "Prepare for Independent Gold and Beyond",
					content:
						"Close by positioning the student for continued Gold training, open contest prep, or deeper systems and algorithms coursework. The course should leave them with a stronger internal map of advanced problem types."
				},
				{
					title: "Unit 7: Gold Capstone Sets: Core Project",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 7: Gold Capstone Sets. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Radio Contact",
					content:
						"Use a capstone-style state problem that blends movement and optimization in a way that rewards careful representation.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG34-Radio-Contact"
				},
				{
					title: "Problem: Cowpatibility",
					content:
						"Use a richer counting or combinatorial problem as one more test of explanation and implementation discipline.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG29-Cowpatibility"
				},
				{
					title: "Bovine Genomics",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 7: Gold Capstone Sets. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Unit 8: Optional Gold Problem Bank. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
						"Use shortest-path sensitivity analysis to deepen the student's understanding of weighted-graph optimization.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG10-Roadblock"
				},
				{
					title: "Problem: Superbull",
					content:
						"Use an MST-style optimization problem as a stronger extension of connectivity and edge-choice reasoning.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG15-Superbull"
				},
				{
					title: "Problem: Fenced In",
					content:
						"Use a richer connectivity and cost-optimization problem to strengthen MST and graph-structure judgment.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG20-Fenced-In"
				},
				{
					title: "Problem: Sleepy Cow Sorting",
					content:
						"Use a strong ordering and invariants problem to test whether the work can reason about progress without brute force.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG25-Sleepy-Cow-Sorting"
				}
			]
		},
		{
			title: "Dynamic Programming Practice: Implementation Lab",
			curriculum: [
				{
					title: "Dynamic Programming Practice: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "Dynamic Programming Practice: Guided Example",
					content:
						"A representative Dynamic Programming Practice example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Dynamic Programming Practice: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice"
				},
				{
					title: "Dynamic Programming Practice: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Dynamic Programming Practice: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Dynamic-Programming-Practice"
				},
				{
					title: "Cow Checklist",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Dynamic Programming Practice: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG4-Cow-Checklist"
				},
				{
					title: "Marathon",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Dynamic Programming Practice: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG5-Marathon"
				}
			]
		},
		{
			title: "Hoof Paper Scissors: Implementation Lab",
			curriculum: [
				{
					title: "Hoof Paper Scissors: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "Hoof Paper Scissors: Guided Example",
					content:
						"A representative Hoof Paper Scissors example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Hoof Paper Scissors: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors"
				},
				{
					title: "Hoof Paper Scissors: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Hoof Paper Scissors: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG1-Hoof-Paper-Scissors"
				},
				{
					title: "248",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Hoof Paper Scissors: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG6-248"
				},
				{
					title: "Treasure Chest",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Hoof Paper Scissors: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG7-Treasure-Chest"
				}
			]
		},
		{
			title: "Why Did the Cow Cross the Road: Implementation Lab",
			curriculum: [
				{
					title: "Why Did the Cow Cross the Road: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "Why Did the Cow Cross the Road: Guided Example",
					content:
						"A representative Why Did the Cow Cross the Road example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Why Did the Cow Cross the Road: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road"
				},
				{
					title: "Why Did the Cow Cross the Road: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Why Did the Cow Cross the Road: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG12-Why-Did-the-Cow-Cross-the-Road"
				},
				{
					title: "Bookshelf",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Why Did the Cow Cross the Road: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG8-Bookshelf"
				},
				{
					title: "Dijkstras Algorithm II",
					content:
						"**Project goal:** Complete the linked C++ core implementation checkpoint for Why Did the Cow Cross the Road: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Write a short verification note because no separate solution link is available yet.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG9-Dijkstras-Algorithm-II"
				}
			]
		},
		{
			title: "Cow Routing: Implementation Lab",
			curriculum: [
				{
					title: "Cow Routing: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "Cow Routing: Guided Example",
					content:
						"A representative Cow Routing example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Cow Routing: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing"
				},
				{
					title: "Cow Routing: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Cow Routing: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG13-Cow-Routing"
				},
				{
					title: "Cow Routing supplemental 2: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for Cow Routing: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-01-applied-studio-13-cow-routing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-01-applied-studio-13-cow-routing-supplemental-2/solution"
				},
				{
					title: "Cow Routing supplemental 3: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for Cow Routing: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "MST II: Guided Example",
					content:
						"A representative MST II example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "MST II: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II"
				},
				{
					title: "MST II: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "MST II: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG14-MST-II"
				},
				{
					title: "MST II supplemental 2: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for MST II: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-03-applied-studio-14-mst-ii-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-03-applied-studio-14-mst-ii-supplemental-2/solution"
				},
				{
					title: "MST II supplemental 3: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for MST II: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "Watering the Fields: Guided Example",
					content:
						"A representative Watering the Fields example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Watering the Fields: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields"
				},
				{
					title: "Watering the Fields: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Watering the Fields: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG16-Watering-the-Fields"
				},
				{
					title: "Watering the Fields supplemental 2: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for Watering the Fields: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-05-applied-studio-15-watering-the-fields-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-05-applied-studio-15-watering-the-fields-supplemental-2/solution"
				},
				{
					title: "Watering the Fields supplemental 3: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for Watering the Fields: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "I Would Walk 500 Miles: Guided Example",
					content:
						"A representative I Would Walk 500 Miles example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "I Would Walk 500 Miles: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles"
				},
				{
					title: "I Would Walk 500 Miles: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "I Would Walk 500 Miles: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG18-I-Would-Walk-500-Miles"
				},
				{
					title: "I Would Walk 500 Miles supplemental 2: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for I Would Walk 500 Miles: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-07-applied-studio-16-i-would-walk-500-miles-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-07-applied-studio-16-i-would-walk-500-miles-supplemental-2/solution"
				},
				{
					title: "I Would Walk 500 Miles supplemental 3: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for I Would Walk 500 Miles: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
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
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "Talent Show: Guided Example",
					content:
						"A representative Talent Show example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Talent Show: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show"
				},
				{
					title: "Talent Show: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Talent Show: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG2-Talent-Show"
				},
				{
					title: "Talent Show supplemental 2: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for Talent Show: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-09-applied-studio-17-talent-show-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-09-applied-studio-17-talent-show-supplemental-2/solution"
				},
				{
					title: "Talent Show supplemental 3: Implementation Lab",
					content:
						"**Project goal:** Complete the linked C++ transfer or extension project for Talent Show: Implementation Lab. The project should prove the module concept through a working artifact, not only through reading the repository link.\n\n**Required work:**\n\n1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.\n\n2. Implement the missing behavior in the smallest clear steps.\n\n3. Test one normal case and one awkward or boundary case.\n\n4. Compare with the reference solution only after a working draft exists.\n\n**Completion checks:**\n\n- The implemented behavior matches the module concept.\n\n- The changed or awkward case is named explicitly.\n\n- The final explanation identifies one design, debugging, or reasoning choice that mattered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-10-applied-studio-17-talent-show-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Gold/tree/main/UG-10-applied-studio-17-talent-show-supplemental-3/solution"
				}
			]
		}
	]
};
