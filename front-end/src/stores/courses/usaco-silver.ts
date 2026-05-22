import type { RawCourse } from "./types";

export const usacoSilverCourse: RawCourse = {
	name: "USACO Silver",
	modules: [
		{
			title: "USS0 Setup and Silver Transition",
			curriculum: [
				{
					title: "Move from Bronze Accuracy to Silver Structure",
					content:
						"Frame Silver as the tier where clean modeling is still necessary but no longer sufficient. Students now need to recognize algorithm families such as DFS, BFS, prefix sums, sorting-based reasoning, and binary search more deliberately."
				},
				{
					title: "Stronger Debugging under Time Pressure",
					content:
						"Require custom tests, reasoning about invariants, and quick rejection of bad approaches. Silver Not only find bugs; they should diagnose whether the entire strategy is wrong before wasting time polishing it."
				},
				{
					title: "Comfort with Java or Another Strong Contest Language",
					content:
						"Many of the Silver repo solutions lean on Java, so Be comfortable reading and writing contest code in a strongly structured environment. The language still matters less than the algorithmic habit."
				},
				{
					title: "Catalog the Core Silver Patterns",
					content:
						"Keep a running list of the patterns that repeatedly appear: graph traversal, sorted sweeps, range accumulation, simulation with structure, and search over answer space. Actively build a mental index of problem types."
				},
				{
					title: "USS0 Setup and Silver Transition: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US25-Why-Did-the-Cow-Cross-the-Road-II"
				}
			],
			supplementalProjects: [
				{
					title: "Silver Log: Setup and Silver Transition",
					content:
						"Keep a short contest log for setup and silver transition that records one structural idea, one failed approach, and one note about which Bronze habit still helps and which old instinct now causes wasted effort. Silver progress comes from recognizing patterns quickly and abandoning weak ideas early.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US25-Why-Did-the-Cow-Cross-the-Road-II"
				},
				{
					title: "Why Did the Cow Cross the Road III",
					content:
						"Supplemental project connected to USS0 Setup and Silver Transition. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US26-Why-Did-the-Cow-Cross-the-Road-III"
				},
				{
					title: "Paired Up",
					content:
						"Supplemental project connected to USS0 Setup and Silver Transition. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US27-Paired-Up"
				}
			]
		},
		{
			title: "Unit 1: Data Structures and Problem Modeling",
			curriculum: [
				{
					title: "Sets, Maps, and Fast Membership Reasoning",
					content:
						"Teach students to reach for hash-based structures when the problem is really about uniqueness, fast lookup, or counting distinct states. This is one of the first Silver shifts away from only array-based thinking."
				},
				{
					title: "Model the Right Entity",
					content:
						"Use object-like or structured representations when the problem is about relationships rather than raw numbers. Skill target: Say what the true 'thing' in the problem is before deciding how to store it."
				},
				{
					title: "Separate Storage from Strategy",
					content:
						"Train students to distinguish the data structure from the algorithm using it. A HashSet does not solve the problem by itself; it enables a class of faster reasoning."
				},
				{
					title: "Trace with Structure",
					content:
						"Continue written tracing, but now with collections, maps, and richer state. Silver errors often come from losing track of what a structure is supposed to contain at each stage."
				},
				{
					title: "Unit 1: Data Structures and Problem Modeling: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US4-Exam-and-Bank-Account-Classes"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Exam and BankAccount Classes",
					content:
						"Use a structured warmup to keep class design and data modeling fluent before heavier graph and range problems dominate.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US4-Exam-and-Bank-Account-Classes"
				},
				{
					title: "Problem: HashSets",
					content:
						"Practice membership and deduplication logic in a contest setting where the structure choice matters directly.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US5-Hash-Sets"
				},
				{
					title: "Problem: HashMaps",
					content:
						"Use keyed storage and frequency-style reasoning to reinforce when a map is the cleanest expression of the problem.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US5-Hash-Maps"
				},
				{
					title: "Bovine Genomics",
					content:
						"Supplemental project connected to Unit 1: Data Structures and Problem Modeling. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US28-Bovine-Genomics"
				}
			]
		},
		{
			title: "Unit 2: DFS, BFS, and Graph Traversal",
			curriculum: [
				{
					title: "Traversal as a Problem Family",
					content:
						"Teach students to recognize when a problem is secretly about reachability, components, shortest unweighted paths, or propagation through a state graph. Silver success often starts with spotting the hidden graph."
				},
				{
					title: "DFS for Exhaustive Structure",
					content:
						"Use DFS for component finding, recursive exploration, and bounded search over connected structures. Key idea: What DFS proves and what it does not."
				},
				{
					title: "BFS for Layers and Minimum-Step Reasoning",
					content:
						"Use BFS when step count matters or when the frontier naturally expands in layers. The key lesson is to link the algorithm to the guarantee it offers."
				},
				{
					title: "Graph Construction from Non-Graph Statements",
					content:
						"Practice rewriting problem statements into nodes and edges even when the original prompt talks about videos, containers, or rooms rather than explicit graph vocabulary."
				},
				{
					title: "Unit 2: DFS, BFS, and Graph Traversal: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-Mothers-Milk"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Mothers Milk",
					content:
						"Use state-space exploration to practice traversal on a generated graph instead of a fixed one.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-Mothers-Milk"
				},
				{
					title: "Problem: MooTube",
					content:
						"Treat relationships and thresholds as graph structure so that traversal answers a query cleanly.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US7-Moo-Tube"
				},
				{
					title: "Problem: Dance Mooves",
					content:
						"Use repeated transitions and component reasoning to rehearse graph thinking in a problem that does not announce itself as graph theory at first glance.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US34-Dance-Mooves"
				}
			]
		},
		{
			title: "Unit 3: Sorting, Searching, and Binary Search",
			curriculum: [
				{
					title: "Sort to Reveal Structure",
					content:
						"Teach students to look for orderings that make the problem simpler: numeric order, lexical order, or a custom ranking that exposes the main constraint. Silver problems frequently unlock once the data is sorted the right way."
				},
				{
					title: "Search over Data and Search over Answers",
					content:
						"Differentiate between searching a sorted structure and binary searching over a possible answer range. Silver Know that binary search is a strategy for monotonic questions, not just for arrays."
				},
				{
					title: "Prove the Predicate",
					content:
						"Whenever answer-space search appears, Practice writing the monotonic predicate in plain language before coding. This keeps binary search tied to logic instead of template memorization."
				},
				{
					title: "Compare Candidate Approaches Honestly",
					content:
						"Compare brute force, sorted scans, and binary search options so they can justify why a more structured approach is necessary."
				},
				{
					title: "Unit 3: Sorting, Searching, and Binary Search: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US10-Prime-Palindromes"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Prime Palindromes",
					content:
						"Use a search-heavy numeric problem to practice pruning and candidate generation with strong test discipline.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US10-Prime-Palindromes"
				},
				{
					title: "Problem: Ordered Fractions",
					content:
						"Use ordering and careful generation of candidates to practice sorted reasoning in a mathematically flavored setting.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US14-Ordered-Fractions"
				},
				{
					title: "Problem: Loan Repayment",
					content:
						"Use binary search over the answer space to practice monotonic reasoning and careful predicate design.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Loan-Repayment"
				},
				{
					title: "Problem: Searching for Soulmates",
					content:
						"Use a later Silver search-style problem to compare direct transformation ideas with cleaner search reasoning.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US40-Searching-For-Soulmates"
				}
			]
		},
		{
			title: "Unit 4: Prefix Sums, Ranges, and Counting",
			curriculum: [
				{
					title: "Range Aggregation as a Core Silver Tool",
					content:
						"Teach prefix sums and cumulative counts as the right abstraction when the problem asks repeated questions about segments or totals. Stop recomputing the same range work from scratch."
				},
				{
					title: "Count Indirectly when Direct Counting Is Awkward",
					content:
						"Show how partial sums, difference reasoning, and transformed arrays can make a messy direct count suddenly simple. Silver problems often reward this change in perspective."
				},
				{
					title: "Build Small Examples First",
					content:
						"Use small arrays and hand-built prefixes to verify that the transformed representation really answers the original question. This is especially important when students are new to cumulative reasoning."
				},
				{
					title: "Keep the Interpretation Visible",
					content:
						"Skill target: Explain what each prefix value means in plain language, not just compute it mechanically. This protects them from writing correct-looking but meaningless code."
				},
				{
					title: "Unit 4: Prefix Sums, Ranges, and Counting: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US18-Counting-Haybales"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Counting Haybales",
					content:
						"Use sorted positions and repeated range queries to practice structural counting instead of repeated scanning.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US18-Counting-Haybales"
				},
				{
					title: "Problem: Prefix Sums",
					content:
						"Treat a direct prefix-sum exercise as a template for broader Silver range reasoning.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US22-Prefix-Sums"
				},
				{
					title: "Problem: Just Green Enough",
					content:
						"Use a more layered counting problem to test whether students can keep transformed values aligned with the real goal.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US33-Just-Green-Enough"
				},
				{
					title: "Dance Mooves",
					content:
						"Supplemental project connected to Unit 4: Prefix Sums, Ranges, and Counting. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US34-Dance-Mooves"
				}
			]
		},
		{
			title: "Unit 5: Greedy and Structured Simulation",
			curriculum: [
				{
					title: "Greedy Choice with Better Justification",
					content:
						"Silver greedy problems demand stronger explanation than Bronze ones. Practice target: Naming why a local choice preserves optimality or why no future decision can benefit from delaying it."
				},
				{
					title: "Simulation with Real Structure",
					content:
						"Use simulations that require sorted events, careful updates, or auxiliary data structures. The goal is to show that simulation can still be the answer, but now it needs better organization."
				},
				{
					title: "Spot the Bottleneck",
					content:
						"Require students to say which step of their simulation dominates the runtime and whether restructuring could fix it. This grows algorithmic awareness without losing the practical contest mindset."
				},
				{
					title: "Compare Greedy to Search or DP Alternatives",
					content:
						"Ask whether a greedy plan is truly safe or whether the problem is hinting at a different family altogether. This question becomes even more important on the path to Gold."
				},
				{
					title: "Unit 5: Greedy and Structured Simulation: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Cow-Dance-Show"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Cow Dance Show",
					content:
						"Use scheduling and ordered simulation to practice reasoning about feasibility and bottlenecks.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Cow-Dance-Show"
				},
				{
					title: "Problem: Secret Cow Code",
					content:
						"Use structured reasoning and repeated transformations to avoid naive simulation of a much larger process.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US23-Secret-Cow-Code"
				},
				{
					title: "Problem: Rental Service",
					content:
						"Compare multiple ways to allocate resources and justify the order in which choices should be considered.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US34-Rental-Service"
				}
			]
		},
		{
			title: "Unit 6: Silver Capstone Sets",
			curriculum: [
				{
					title: "Mix Patterns Deliberately",
					content:
						"Practice short sets that combine graph reasoning, sorting, simulation, and counting so students stop expecting the problem category to be obvious from the first sentence."
				},
				{
					title: "Write Cleaner Contest Explanations",
					content:
						"Require a one-paragraph explanation for each finished problem that names the pattern, the key data structure, and the reason the approach fits the constraints. This is how students build a reusable mental library."
				},
				{
					title: "Find the Gaps before Gold",
					content:
						"Identify whether the student still struggles most with graph modeling, answer-space search, counting transforms, or structured simulation. The transition to Gold is much smoother when that diagnosis is honest."
				},
				{
					title: "Prepare for USACO Gold",
					content:
						"Close by positioning Gold as the tier where dynamic programming, shortest paths, MSTs, and more formal optimization ideas become normal. Move on only once Silver patterns feel recognizable rather than mysterious."
				},
				{
					title: "Unit 6: Silver Capstone Sets: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US38-Redistributing-Gifts"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Redistributing Gifts",
					content:
						"Use a more layered relationship problem to test whether graph and constraint reasoning are becoming automatic.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US38-Redistributing-Gifts"
				},
				{
					title: "Problem: Wormhole Sort",
					content:
						"Use a Silver capstone that mixes structural reasoning, search thinking, and strong implementation discipline.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Wormhole-Sort"
				},
				{
					title: "Stuck in a Rut Silver",
					content:
						"Supplemental project connected to Unit 6: Silver Capstone Sets. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US35-Stuck-in-a-Rut-Silver"
				}
			]
		},
		{
			title: "Unit 7: Optional Silver Problem Bank",
			curriculum: [
				{
					title: "Why the Repo Is Larger than the Main Course",
					content:
						"The `USACO-Silver` repo is intentionally broader than the required course spine. Use it as an optional canonical library grouped by technique families once the core Silver modules are stable."
				},
				{
					title: "Classical Training and Search Problems",
					content:
						"Important classical and structure-building problems in the repo include `US8 Arithmetic Progressions`, `US9 Number Triangles`, `US11 Superprime Rib`, `US12 Floodfill`, `US13 The Castle`, `US15 Sorting a Three-Valued Sequence`, `US16 Healthy Holsteins`, and `US17 Hamming Codes`."
				},
				{
					title: "Graph, Reachability, and Simulation Extensions",
					content:
						"Graph and structured simulation extensions include `US19 Cities and States`, `US20 Moocast`, `US21 Priority Queues`, `US22 Hoof Paper Scissors`, `US24/US25/US26 Why Did the Cow Cross the Road`, `US27 Paired Up`, `US28 Bovine Genomics`, `US35 Stuck in a Rut`, and `US36 Rectangular Pasture`."
				},
				{
					title: "Support Labs and Late Silver Bank",
					content:
						"Support and late-Silver folders include `US5 Custom Classes with HashSets and HashMaps`, `US6 DFS`, `US6 Stacks`, `US7 BFS`, `US7 Queues`, `US23 Secret Cow Code`, `US34 Rental Service`, `US37 Subset Equality`, `US38 Redistributing Gifts`, `US39 Closest Cow Wins`, and `US-Wormhole-Sort`."
				},
				{
					title: "Unit 7: Optional Silver Problem Bank: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Problem Bank: Full Silver Repo",
					content:
						"Browse the full Silver repo bank when the public spine is not enough practice and you want the larger contest-library view.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main"
				},
				{
					title: "Problem: Floodfill",
					content:
						"Use a direct flood-fill and component-style problem to reinforce traversal fundamentals in a contest setting.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US12-Floodfill"
				},
				{
					title: "Problem: Cities and States",
					content:
						"Use hashed counting and pair reasoning to strengthen map-based Silver problem modeling.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US19-Cities-and-States"
				},
				{
					title: "Problem: Moocast",
					content:
						"Use reachability and graph construction in a problem where the hidden structure matters more than the story text.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US20-Moocast"
				},
				{
					title: "Problem: Rectangular Pasture",
					content:
						"Use geometric counting and structure-aware iteration as a stronger late-Silver challenge.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US36-Rectangular-Pasture"
				}
			]
		},
		{
			title: "US Berry Picking: Implementation Studio",
			curriculum: [
				{
					title: "US Berry Picking: Core Concepts",
					content:
						"US Berry Picking: Implementation Studio defines the target artifact, required behavior, and core concepts needed for the build or problem set."
				},
				{
					title: "US Berry Picking: Guided Example",
					content:
						"A representative US Berry Picking example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "US Berry Picking: Core Project",
					content:
						"US Berry Picking: Implementation Studio centers on one complete artifact. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Berry-Picking"
				},
				{
					title: "US Berry Picking: Review and Reflection",
					content:
						"US Berry Picking: Implementation Studio closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "US Berry Picking: Extension Challenge",
					content:
						"Extend the core build from US Berry Picking: Implementation Studio with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-Berry-Picking"
				},
				{
					title: "Subset Equality",
					content:
						"Supplemental project connected to US Berry Picking: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US37-Subset-Equality"
				},
				{
					title: "Closest Cow Wins",
					content:
						"Supplemental project connected to US Berry Picking: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US39-Closest-Cow-Wins"
				}
			]
		},
		{
			title: "Superprime Rib: Implementation Studio",
			curriculum: [
				{
					title: "Superprime Rib: Core Concepts",
					content:
						"Superprime Rib: Implementation Studio defines the target artifact, required behavior, and core concepts needed for the build or problem set."
				},
				{
					title: "Superprime Rib: Guided Example",
					content:
						"A representative Superprime Rib example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Superprime Rib: Core Project",
					content:
						"Superprime Rib: Implementation Studio centers on one complete artifact. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US11-Superprime-Rib"
				},
				{
					title: "Superprime Rib: Review and Reflection",
					content:
						"Superprime Rib: Implementation Studio closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Superprime Rib: Extension Challenge",
					content:
						"Extend the core build from Superprime Rib: Implementation Studio with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US11-Superprime-Rib"
				},
				{
					title: "Custom Classes with HashSets and HashMaps",
					content:
						"Supplemental project connected to Superprime Rib: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US5-Custom-Classes-with-Hash-Sets-and-Hash-Maps"
				},
				{
					title: "DFS",
					content:
						"Supplemental project connected to Superprime Rib: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-DFS"
				}
			]
		},
		{
			title: "The Castle: Implementation Studio",
			curriculum: [
				{
					title: "The Castle: Core Concepts",
					content:
						"The Castle: Implementation Studio defines the target artifact, required behavior, and core concepts needed for the build or problem set."
				},
				{
					title: "The Castle: Guided Example",
					content:
						"A representative The Castle example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "The Castle: Core Project",
					content:
						"The Castle: Implementation Studio centers on one complete artifact. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US13-The-Castle"
				},
				{
					title: "The Castle: Review and Reflection",
					content:
						"The Castle: Implementation Studio closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "The Castle: Extension Challenge",
					content:
						"Extend the core build from The Castle: Implementation Studio with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US13-The-Castle"
				},
				{
					title: "Stacks",
					content:
						"Supplemental project connected to The Castle: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US6-Stacks"
				},
				{
					title: "BFS",
					content:
						"Supplemental project connected to The Castle: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US7-BFS"
				}
			]
		},
		{
			title: "Sorting a Three Valued Sequence: Implementation Studio",
			curriculum: [
				{
					title: "Sorting a Three Valued Sequence: Core Concepts",
					content:
						"Sorting a Three Valued Sequence: Implementation Studio defines the target artifact, required behavior, and core concepts needed for the build or problem set."
				},
				{
					title: "Sorting a Three Valued Sequence: Guided Example",
					content:
						"A representative Sorting a Three Valued Sequence example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Sorting a Three Valued Sequence: Core Project",
					content:
						"Sorting a Three Valued Sequence: Implementation Studio centers on one complete artifact. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US15-Sorting-a-Three-Valued-Sequence"
				},
				{
					title: "Sorting a Three Valued Sequence: Review and Reflection",
					content:
						"Sorting a Three Valued Sequence: Implementation Studio closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Sorting a Three Valued Sequence: Extension Challenge",
					content:
						"Extend the core build from Sorting a Three Valued Sequence: Implementation Studio with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US15-Sorting-a-Three-Valued-Sequence"
				},
				{
					title: "Queues",
					content:
						"Supplemental project connected to Sorting a Three Valued Sequence: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US7-Queues"
				},
				{
					title: "Arithmetic Progressions",
					content:
						"Supplemental project connected to Sorting a Three Valued Sequence: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US8-Arithmetic-Progressions"
				}
			]
		},
		{
			title: "Healthy Holsteins: Implementation Studio",
			curriculum: [
				{
					title: "Healthy Holsteins: Core Concepts",
					content:
						"Healthy Holsteins: Implementation Studio defines the target artifact, required behavior, and core concepts needed for the build or problem set."
				},
				{
					title: "Healthy Holsteins: Guided Example",
					content:
						"A representative Healthy Holsteins example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Healthy Holsteins: Core Project",
					content:
						"Healthy Holsteins: Implementation Studio centers on one complete artifact. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US16-Healthy-Holsteins"
				},
				{
					title: "Healthy Holsteins: Review and Reflection",
					content:
						"Healthy Holsteins: Implementation Studio closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Healthy Holsteins: Extension Challenge",
					content:
						"Extend the core build from Healthy Holsteins: Implementation Studio with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US16-Healthy-Holsteins"
				},
				{
					title: "Number Triangles",
					content:
						"Supplemental project connected to Healthy Holsteins: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US9-Number-Triangles"
				},
				{
					title: "Healthy Holsteins supplemental 3: Implementation Studio",
					content:
						"Supplemental project connected to Healthy Holsteins: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-01-applied-studio-13-healthy-holsteins-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-01-applied-studio-13-healthy-holsteins-supplemental-3/solution"
				}
			]
		},
		{
			title: "Hamming Codes: Implementation Studio",
			curriculum: [
				{
					title: "Hamming Codes: Core Concepts",
					content:
						"Hamming Codes: Implementation Studio defines the target artifact, required behavior, and core concepts needed for the build or problem set."
				},
				{
					title: "Hamming Codes: Guided Example",
					content:
						"A representative Hamming Codes example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Hamming Codes: Core Project",
					content:
						"Hamming Codes: Implementation Studio centers on one complete artifact. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US17-Hamming-Codes"
				},
				{
					title: "Hamming Codes: Review and Reflection",
					content:
						"Hamming Codes: Implementation Studio closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Hamming Codes: Extension Challenge",
					content:
						"Extend the core build from Hamming Codes: Implementation Studio with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US17-Hamming-Codes"
				},
				{
					title: "Hamming Codes supplemental 2: Implementation Studio",
					content:
						"Supplemental project connected to Hamming Codes: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-02-applied-studio-14-hamming-codes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-02-applied-studio-14-hamming-codes-supplemental-2/solution"
				},
				{
					title: "Hamming Codes supplemental 3: Implementation Studio",
					content:
						"Supplemental project connected to Hamming Codes: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-03-applied-studio-14-hamming-codes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-03-applied-studio-14-hamming-codes-supplemental-3/solution"
				}
			]
		},
		{
			title: "Priority Queues: Implementation Studio",
			curriculum: [
				{
					title: "Priority Queues: Core Concepts",
					content:
						"Priority Queues: Implementation Studio defines the target artifact, required behavior, and core concepts needed for the build or problem set."
				},
				{
					title: "Priority Queues: Guided Example",
					content:
						"A representative Priority Queues example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Priority Queues: Core Project",
					content:
						"Priority Queues: Implementation Studio centers on one complete artifact. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Priority-Queues"
				},
				{
					title: "Priority Queues: Review and Reflection",
					content:
						"Priority Queues: Implementation Studio closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Priority Queues: Extension Challenge",
					content:
						"Extend the core build from Priority Queues: Implementation Studio with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US21-Priority-Queues"
				},
				{
					title: "Priority Queues supplemental 2: Implementation Studio",
					content:
						"Supplemental project connected to Priority Queues: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-04-applied-studio-15-priority-queues-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-04-applied-studio-15-priority-queues-supplemental-2/solution"
				},
				{
					title: "Priority Queues supplemental 3: Implementation Studio",
					content:
						"Supplemental project connected to Priority Queues: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-05-applied-studio-15-priority-queues-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-05-applied-studio-15-priority-queues-supplemental-3/solution"
				}
			]
		},
		{
			title: "Hoof Paper Scissors: Implementation Studio",
			curriculum: [
				{
					title: "Hoof Paper Scissors: Core Concepts",
					content:
						"Hoof Paper Scissors: Implementation Studio defines the target artifact, required behavior, and core concepts needed for the build or problem set."
				},
				{
					title: "Hoof Paper Scissors: Guided Example",
					content:
						"A representative Hoof Paper Scissors example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Hoof Paper Scissors: Core Project",
					content:
						"Hoof Paper Scissors: Implementation Studio centers on one complete artifact. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US22-Hoof-Paper-Scissors"
				},
				{
					title: "Hoof Paper Scissors: Review and Reflection",
					content:
						"Hoof Paper Scissors: Implementation Studio closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Hoof Paper Scissors: Extension Challenge",
					content:
						"Extend the core build from Hoof Paper Scissors: Implementation Studio with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US22-Hoof-Paper-Scissors"
				},
				{
					title: "Hoof Paper Scissors supplemental 2: Implementation Studio",
					content:
						"Supplemental project connected to Hoof Paper Scissors: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-06-applied-studio-16-hoof-paper-scissors-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-06-applied-studio-16-hoof-paper-scissors-supplemental-2/solution"
				},
				{
					title: "Hoof Paper Scissors supplemental 3: Implementation Studio",
					content:
						"Supplemental project connected to Hoof Paper Scissors: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-07-applied-studio-16-hoof-paper-scissors-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-07-applied-studio-16-hoof-paper-scissors-supplemental-3/solution"
				}
			]
		},
		{
			title: "Why Did the Cow Cross the Road: Implementation Studio",
			curriculum: [
				{
					title: "Why Did the Cow Cross the Road: Core Concepts",
					content:
						"Why Did the Cow Cross the Road: Implementation Studio defines the target artifact, required behavior, and core concepts needed for the build or problem set."
				},
				{
					title: "Why Did the Cow Cross the Road: Guided Example",
					content:
						"A representative Why Did the Cow Cross the Road example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "Why Did the Cow Cross the Road: Core Project",
					content:
						"Why Did the Cow Cross the Road: Implementation Studio centers on one complete artifact. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US24-Why-Did-the-Cow-Cross-the-Road"
				},
				{
					title: "Why Did the Cow Cross the Road: Review and Reflection",
					content:
						"Why Did the Cow Cross the Road: Implementation Studio closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "Why Did the Cow Cross the Road: Extension Challenge",
					content:
						"Extend the core build from Why Did the Cow Cross the Road: Implementation Studio with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US24-Why-Did-the-Cow-Cross-the-Road"
				},
				{
					title: "Why Did the Cow Cross the Road supplemental 2: Implementation Studio",
					content:
						"Supplemental project connected to Why Did the Cow Cross the Road: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-08-applied-studio-17-why-did-the-cow-cross-the-road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-08-applied-studio-17-why-did-the-cow-cross-the-road/solution"
				},
				{
					title: "Why Did the Cow Cross the Road supplemental 3: Implementation Studio",
					content:
						"Supplemental project connected to Why Did the Cow Cross the Road: Implementation Studio. The linked starter provides the implementation artifact, and the solution provides the reference state.",
					projectLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-09-applied-studio-17-why-did-the-cow-cross-the-road/starter",
					solutionLink:
						"https://github.com/instruction-material/USACO-Silver/tree/main/US-09-applied-studio-17-why-did-the-cow-cross-the-road/solution"
				}
			]
		}
	]
};
