import type { RawCourse, RawCourseModuleItem } from "./types";

const USACO_SILVER_REPO =
	"https://github.com/instruction-material/USACO-Silver/tree/main";

function repoLink(projectId: string) {
	return `${USACO_SILVER_REPO}/${projectId}`;
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
		title: `Silver Log: ${unitTitle}`,
		content: `Keep a short contest log for ${unitTitle.toLowerCase()} that records one structural idea, one failed approach, and one note about ${focus}. Silver progress comes from recognizing patterns quickly and abandoning weak ideas early.`
	};
}

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
						"Require custom tests, reasoning about invariants, and quick rejection of bad approaches. Silver students should not only find bugs; they should diagnose whether the entire strategy is wrong before wasting time polishing it."
				},
				{
					title: "Comfort with Java or Another Strong Contest Language",
					content:
						"Many of the Silver repo solutions lean on Java, so students should be comfortable reading and writing contest code in a strongly structured environment. The language still matters less than the algorithmic habit."
				},
				{
					title: "Catalog the Core Silver Patterns",
					content:
						"Keep a running list of the patterns that repeatedly appear: graph traversal, sorted sweeps, range accumulation, simulation with structure, and search over answer space. Students should actively build a mental index of problem types."
				}
			],
			supplementalProjects: [
				contestLog(
					"Setup and Silver Transition",
					"which Bronze habit still helps and which old instinct now causes wasted effort"
				)
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
						"Use object-like or structured representations when the problem is about relationships rather than raw numbers. Students should be able to say what the true 'thing' in the problem is before deciding how to store it."
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
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Exam and BankAccount Classes",
					"Use a structured warmup to keep class design and data modeling fluent before heavier graph and range problems dominate.",
					"US4-Exam-and-BankAccount-Classes"
				),
				problemItem(
					"Problem: HashSets",
					"Practice membership and deduplication logic in a contest setting where the structure choice matters directly.",
					"US5-HashSets"
				),
				problemItem(
					"Problem: HashMaps",
					"Use keyed storage and frequency-style reasoning to reinforce when a map is the cleanest expression of the problem.",
					"US5-HashMaps"
				),
				contestLog(
					"Data Structures and Problem Modeling",
					"which data structure made the intended algorithm possible"
				)
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
						"Use DFS for component finding, recursive exploration, and bounded search over connected structures. Students should understand what DFS proves and what it does not."
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
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Mothers Milk",
					"Use state-space exploration to practice traversal on a generated graph instead of a fixed one.",
					"US6-Mothers-Milk"
				),
				problemItem(
					"Problem: MooTube",
					"Treat relationships and thresholds as graph structure so that traversal answers a query cleanly.",
					"US7-MooTube"
				),
				problemItem(
					"Problem: Dance Mooves",
					"Use repeated transitions and component reasoning to rehearse graph thinking in a problem that does not announce itself as graph theory at first glance.",
					"US34-Dance-Mooves"
				)
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
						"Differentiate between searching a sorted structure and binary searching over a possible answer range. Silver students should know that binary search is a strategy for monotonic questions, not just for arrays."
				},
				{
					title: "Prove the Predicate",
					content:
						"Whenever answer-space search appears, students should practice writing the monotonic predicate in plain language before coding. This keeps binary search tied to logic instead of template memorization."
				},
				{
					title: "Compare Candidate Approaches Honestly",
					content:
						"Have students compare brute force, sorted scans, and binary search options so they can justify why a more structured approach is necessary."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Prime Palindromes",
					"Use a search-heavy numeric problem to practice pruning and candidate generation with strong test discipline.",
					"US10-Prime-Palindromes"
				),
				problemItem(
					"Problem: Ordered Fractions",
					"Use ordering and careful generation of candidates to practice sorted reasoning in a mathematically flavored setting.",
					"US14-Ordered-Fractions"
				),
				problemItem(
					"Problem: Loan Repayment",
					"Use binary search over the answer space to practice monotonic reasoning and careful predicate design.",
					"US-Loan-Repayment"
				),
				problemItem(
					"Problem: Searching for Soulmates",
					"Use a later Silver search-style problem to compare direct transformation ideas with cleaner search reasoning.",
					"US40-Searching-For-Soulmates"
				)
			]
		},
		{
			title: "Unit 4: Prefix Sums, Ranges, and Counting",
			curriculum: [
				{
					title: "Range Aggregation as a Core Silver Tool",
					content:
						"Teach prefix sums and cumulative counts as the right abstraction when the problem asks repeated questions about segments or totals. Students should stop recomputing the same range work from scratch."
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
						"Students should be able to explain what each prefix value means in plain language, not just compute it mechanically. This protects them from writing correct-looking but meaningless code."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Counting Haybales",
					"Use sorted positions and repeated range queries to practice structural counting instead of repeated scanning.",
					"US18-Counting-Haybales"
				),
				problemItem(
					"Problem: Prefix Sums",
					"Treat a direct prefix-sum exercise as a template for broader Silver range reasoning.",
					"US22-Prefix-Sums"
				),
				problemItem(
					"Problem: Just Green Enough",
					"Use a more layered counting problem to test whether students can keep transformed values aligned with the real goal.",
					"US33-Just-Green-Enough"
				),
				contestLog(
					"Prefix Sums, Ranges, and Counting",
					"how the transformed representation made repeated work cheaper or clearer"
				)
			]
		},
		{
			title: "Unit 5: Greedy and Structured Simulation",
			curriculum: [
				{
					title: "Greedy Choice with Better Justification",
					content:
						"Silver greedy problems demand stronger explanation than Bronze ones. Students should practice naming why a local choice preserves optimality or why no future decision can benefit from delaying it."
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
						"Have students ask whether a greedy plan is truly safe or whether the problem is hinting at a different family altogether. This question becomes even more important on the path to Gold."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Cow Dance Show",
					"Use scheduling and ordered simulation to practice reasoning about feasibility and bottlenecks.",
					"US21-Cow-Dance-Show"
				),
				problemItem(
					"Problem: Secret Cow Code",
					"Use structured reasoning and repeated transformations to avoid naive simulation of a much larger process.",
					"US23-Secret-Cow-Code"
				),
				problemItem(
					"Problem: Rental Service",
					"Compare multiple ways to allocate resources and justify the order in which choices should be considered.",
					"US34-Rental-Service"
				)
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
						"Close by positioning Gold as the tier where dynamic programming, shortest paths, MSTs, and more formal optimization ideas become normal. Students should move on only once Silver patterns feel recognizable rather than mysterious."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Redistributing Gifts",
					"Use a more layered relationship problem to test whether graph and constraint reasoning are becoming automatic.",
					"US38-Redistributing-Gifts"
				),
				problemItem(
					"Problem: Wormhole Sort",
					"Use a Silver capstone that mixes structural reasoning, search thinking, and strong implementation discipline.",
					"US-Wormhole-Sort"
				),
				contestLog(
					"Silver Capstone Sets",
					"which problem family still needs the most work before Gold-level study begins"
				)
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
				problemItem(
					"Problem: Floodfill",
					"Use a direct flood-fill and component-style problem to reinforce traversal fundamentals in a contest setting.",
					"US12-Floodfill"
				),
				problemItem(
					"Problem: Cities and States",
					"Use hashed counting and pair reasoning to strengthen map-based Silver problem modeling.",
					"US19-Cities-and-States"
				),
				problemItem(
					"Problem: Moocast",
					"Use reachability and graph construction in a problem where the hidden structure matters more than the story text.",
					"US20-Moocast"
				),
				problemItem(
					"Problem: Rectangular Pasture",
					"Use geometric counting and structure-aware iteration as a stronger late-Silver challenge.",
					"US36-Rectangular-Pasture"
				)
			]
		}
	]
};
