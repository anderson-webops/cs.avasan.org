import type { RawCourse, RawCourseModuleItem } from "./types";

const USACO_GOLD_REPO
	= "https://github.com/instruction-material/USACO-Gold/tree/main";

function repoLink(projectId: string) {
	return `${USACO_GOLD_REPO}/${projectId}`;
}

function problemItem(
	title: string,
	content: string,
	projectId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: repoLink(projectId)
	};
}

function contestLog(unitTitle: string, focus: string): RawCourseModuleItem {
	return {
		title: `Gold Log: ${unitTitle}`,
		content: `Keep a compact Gold-level log for ${unitTitle.toLowerCase()} that records the core recurrence or invariant, one discarded approach, and one note about ${focus}. Gold progress depends on being able to explain the structure of a solution, not just implement it.`
	};
}

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
						"Teach students to use input limits to narrow the candidate solution family quickly. At Gold level, the constraints often tell you more than the story paragraph does."
				}
			],
			supplementalProjects: [
				contestLog(
					"Setup and Gold Mindset",
					"which constraint or invariant most clearly signals the right solution family"
				)
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
						"Teach when a DP can be compressed, when it cannot, and how to reason about whether a recurrence is actually feasible under the given limits."
				},
				{
					title: "Recognize DP in the Wild",
					content:
						"Have students compare several problem statements that look unrelated on the surface but collapse into the same state-transition mindset once the structure is exposed."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Dynamic Programming with Fibonacci",
					"Use a simple recurrence to make the DP mindset explicit before harder state spaces are introduced.",
					"UG1-Dynamic-Programming-with-Fibonacci"
				),
				problemItem(
					"Problem: 0-1 Knapsack",
					"Use a classic optimization recurrence to practice state design, choices, and table updates.",
					"UG2-0-1-Knapsack"
				),
				problemItem(
					"Problem: Teamwork",
					"Use grouped decisions and transition design to move beyond the most basic DP templates.",
					"UG3-Teamwork"
				),
				problemItem(
					"Problem: Fruit Feast",
					"Use a state-space DP problem to test whether students can manage reachable states and transitions without losing clarity.",
					"UG40-Fruit-Feast"
				)
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
						"Teach Dijkstra as repeated relaxation over the currently cheapest frontier. Students should understand the role of the priority queue and why nonnegative weights matter."
				},
				{
					title: "Use Distance Information Strategically",
					content:
						"Move beyond 'compute the shortest paths' and show how those distances become ingredients in a second layer of reasoning. This is where Gold graph problems start to feel richer than Silver traversal."
				},
				{
					title: "Be Explicit about Complexity",
					content:
						"Students should practice saying how many nodes, edges, and priority-queue operations the approach entails. Gold graph work demands a clearer sense of cost."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Dijkstra's Algorithm",
					"Use a direct shortest-path implementation to make priority-queue relaxation fully concrete.",
					"UG9-Dijkstras-Algorithm"
				),
				problemItem(
					"Problem: Shortcut",
					"Use shortest-path information inside a second optimization question so students see distance arrays as tools, not endpoints.",
					"UG11-Shortcut"
				),
				problemItem(
					"Problem: Fine Dining",
					"Use a more layered graph task to test whether students can adapt shortest-path ideas to a richer condition set.",
					"UG30-Fine-Dining"
				),
				contestLog(
					"Shortest Paths and Weighted Graphs",
					"what the distances actually mean in the original story of the problem"
				)
			]
		},
		{
			title: "Unit 3: MSTs, DSU, and Connectivity Optimization",
			curriculum: [
				{
					title: "Minimum Spanning Tree Intuition",
					content:
						"Teach MSTs as the cheapest way to connect everything under the given edge structure. Students should understand the objective clearly before they memorize Kruskal or Prim."
				},
				{
					title: "Disjoint Set Union as a Connectivity Tool",
					content:
						"Use DSU to support fast connectivity checks while edges are considered in sorted order. Students should understand the role of union-find in the larger algorithmic plan."
				},
				{
					title: "Edge Ordering and Greedy Validity",
					content:
						"Require students to explain why the chosen next edge is safe. This is an important place to practice small proof sketches for greedy algorithms."
				},
				{
					title: "Connectivity Problems beyond the Template",
					content:
						"Compare direct MST tasks with problems that use connectivity ideas in disguised forms. Gold students should build a wider pattern library than a single named algorithm."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: MST",
					"Use a direct MST implementation to practice sorted edges, cycle avoidance, and connection cost reasoning.",
					"UG14-MST"
				),
				problemItem(
					"Problem: Disjoint Sets and Kruskal's",
					"Use a dedicated DSU and Kruskal exercise to make the structure and proof idea explicit.",
					"UG19-Disjoint-Sets-and-Kruskals"
				),
				problemItem(
					"Problem: Moocast",
					"Use a connectivity optimization problem that turns graph reachability and distance structure into a stronger Gold-style challenge.",
					"UG17-Moocast"
				)
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
						"Make the Fenwick tree implementation meaningful by explaining what each node aggregates and why the lowbit jumps work. Students should not treat the structure as a magic snippet."
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
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Binary Indexed Tree / Fenwick Tree",
					"Use a direct Fenwick implementation lab to connect the data structure to concrete prefix-query behavior.",
					"UG22-Binary-Indexed-Tree-Fenwick-Tree"
				),
				problemItem(
					"Problem: Balanced Photo",
					"Use relative ordering and imbalance counts to practice range-style reasoning around positions.",
					"UG23-Balanced-Photo"
				),
				problemItem(
					"Problem: Out of Sorts",
					"Use ordering and movement analysis to show how a simple-looking sorting story hides richer structure.",
					"UG26-Out-of-Sorts"
				),
				contestLog(
					"Fenwick Trees, Ordering, and Range Structure",
					"which query or update pattern justified the heavier data structure"
				)
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
						"Use problems where the graph is only part of the story and a second objective or geometric constraint changes how the solution must be built."
				},
				{
					title: "Keep Spatial Reasoning Precise",
					content:
						"Whether the task involves geometry, movement, or mirrored structures, students should keep diagrams and coordinate reasoning explicit instead of relying on intuition alone."
				},
				{
					title: "Know When the Model Is the Real Challenge",
					content:
						"Make it clear that some Gold problems are hard not because the algorithm is exotic, but because finding the right representation takes real thought."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Lasers and Mirrors",
					"Use a spatially flavored graph problem to practice turning geometry into a graph you can actually search.",
					"UG33-Lasers-and-Mirrors"
				),
				problemItem(
					"Problem: Lights Out",
					"Use geometric structure and path reasoning to test whether students can keep multiple interpretations of distance and position aligned.",
					"UG35-Lights-Out"
				),
				problemItem(
					"Problem: Circular Barn Revisited",
					"Use a more involved structural problem to push representation and optimization thinking together.",
					"UG36-Circular-Barn-Revisited"
				)
			]
		},
		{
			title: "Unit 6: Advanced DP and Combinatorics",
			curriculum: [
				{
					title: "DP beyond the First Table",
					content:
						"Show students that Gold DP may involve richer transitions, combinatorial counts, or less obvious state compressions. The key is still the same: define the right subproblem first."
				},
				{
					title: "Count Carefully, Mod Carefully",
					content:
						"When combinatorics enters the picture, students should be precise about what is being counted, what constraints remain, and how modular arithmetic interacts with the recurrence."
				},
				{
					title: "Blend Math Insight with Algorithm Design",
					content:
						"Use these problems to show that mathematical structure and algorithmic structure often reinforce each other. A clean count or recurrence can completely change what looks feasible."
				},
				{
					title: "Explain the Transition in Words",
					content:
						"Students should be able to explain every DP transition or combinatorial term in a sentence. If they cannot, the implementation is probably ahead of the understanding."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Cow Poetry",
					"Use combinatorial counting and dynamic programming together in a problem where explanation matters as much as implementation.",
					"UG28-Cow-Poetry"
				),
				problemItem(
					"Problem: Stamp Painting",
					"Use a counting DP problem to practice recurrence design under modular arithmetic constraints.",
					"UG32-Stamp-Painting"
				),
				problemItem(
					"Problem: Time is Mooney",
					"Use a richer optimization problem that blends repeated transitions and scoring over time.",
					"UG-Time-is-Mooney"
				),
				problemItem(
					"Problem: Milk Visits",
					"Use a stronger capstone-style problem to test whether multiple Gold ideas can be held together in one coherent solution.",
					"UG-Milk-Visits"
				)
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
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Radio Contact",
					"Use a capstone-style state problem that blends movement and optimization in a way that rewards careful representation.",
					"UG34-Radio-Contact"
				),
				problemItem(
					"Problem: Cowpatibility",
					"Use a richer counting or combinatorial problem as one more test of explanation and implementation discipline.",
					"UG29-Cowpatibility"
				),
				contestLog(
					"Gold Capstone Sets",
					"which algorithm family the student can now recognize quickly and which still takes too long to identify"
				)
			]
		}
	]
};
