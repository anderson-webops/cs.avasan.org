import type { RawCourse } from "./types";

export const usacoBronzeCourse: RawCourse = {
	name: "USACO Bronze",
	modules: [
		{
			title: "USB0 Setup and Contest Workflow",
			curriculum: [
				{
					title: "USACO File I/O and Submission Rhythm",
					content:
						"Set up a clean competitive-programming workflow with fast compile-run cycles, local sample files, and disciplined input/output handling. Key idea: Contest success depends on fast iteration and careful reading, not on large project scaffolding."
				},
				{
					title: "Bronze-Level Problem Framing",
					content:
						"Teach Bronze problems as exercises in accurate simulation, manageable brute force, careful counting, and well-structured conditionals. The course should reduce fear by showing that many Bronze tasks are approachable once the story is translated into data and steps."
				},
				{
					title: "Trace First, Optimize Second",
					content:
						"Require handwritten traces and small custom tests before students worry about speed. Bronze work usually fails because of overlooked cases or incorrect translation, not because the code is too slow."
				},
				{
					title: "Language Strategy",
					content:
						"Let students work in the language that supports their current growth best, but keep problem-solving habits language-agnostic. Python is often enough for Bronze, while Java versions in the repo are useful for students preparing for later tiers."
				},
				{
					title: "USB0 Setup and Contest Workflow: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java"
				}
			],
			supplementalProjects: [
				{
					title: "Bronze Log: Setup and Contest Workflow",
					content:
						"Keep a short contest log for setup and contest workflow that records one wrong assumption, one edge case that broke an early idea, and one note about which part of the problem statement is easiest to misread under time pressure. Bronze-level progress comes from disciplined debugging as much as from knowing a trick.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-22-Why-Did-the-Cow-Cross-the-Road-Java"
				},
				{
					title: "UB 23 Why Did the Cow Cross the Road II Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-23-Why-Did-the-Cow-Cross-the-Road-II-Java"
				},
				{
					title: "UB 24 Why Did the Cow Cross the Road III Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-24-Why-Did-the-Cow-Cross-the-Road-III-Java"
				}
			]
		},
		{
			title: "Unit 1: Simulation and Careful Translation",
			curriculum: [
				{
					title: "Turn Story Problems into Variables and Steps",
					content:
						"Translate narrative wording into a tiny model: what is tracked, what changes each step, and when the answer should be updated. The first win at Bronze is usually accurate modeling, not deep theory."
				},
				{
					title: "Follow the Rules Exactly",
					content:
						"Bronze problems often reward literal implementation of a process. Resist inventing shortcuts until they can restate the official rules precisely and prove their simulation matches them."
				},
				{
					title: "Make Small Custom Tests",
					content:
						"Use intentionally tiny cases to catch off-by-one mistakes and state-update errors. Leave this unit knowing that small tests are the fastest path to correctness."
				},
				{
					title: "Use Tables and Traces",
					content:
						"Encourage tables of values, timeline traces, and manual updates. Bronze-level debugging becomes much easier when the evolving state is visible on paper."
				},
				{
					title: "Unit 1: Simulation and Careful Translation: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Square Pasture",
					content:
						"Use geometric bounds and direct translation to practice reading a short statement carefully and converting it into a compact calculation.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture"
				},
				{
					title: "Problem: Your Ride Is Here",
					content:
						"Use a classic warmup to reinforce modular arithmetic, string processing, and exact interpretation of a quirky problem statement.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here"
				},
				{
					title: "Problem: Transformations",
					content:
						"Practice rule-driven simulation by applying a fixed set of transformations and checking results systematically.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations"
				},
				{
					title: "Square Pasture Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture-Java"
				}
			]
		},
		{
			title: "Unit 2: Intervals, Arrays, and Greedy Warmups",
			curriculum: [
				{
					title: "Intervals and Coverage Thinking",
					content:
						"Reason about segments, overlaps, and gaps with small sorted lists or interval scans. Many Bronze tasks become easier once the timeline or number line is made explicit."
				},
				{
					title: "Greedy Choice with Just Enough Justification",
					content:
						"Introduce small greedy arguments where choosing the earliest finish, largest gap, or best local option can be justified clearly. At Bronze level, the proof should stay intuitive but still be named aloud."
				},
				{
					title: "Scanning Arrays for Best Answers",
					content:
						"Use running best values, counts, and interval endpoints to show how one pass over data can be enough. This reinforces efficient habits without turning the unit into a complexity lecture."
				},
				{
					title: "Sorted Input as a Strategic Advantage",
					content:
						"Sort when it clarifies the structure of the task. Bronze solutions often become dramatically simpler once the data is in a useful order."
				},
				{
					title: "Unit 2: Intervals, Arrays, and Greedy Warmups: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Milking Cows",
					content:
						"Use interval merging and longest-gap reasoning to practice scanning sorted ranges carefully.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB6-Milking-Cows"
				},
				{
					title: "Problem: Barn Repair",
					content:
						"Use a clean greedy idea to decide where not to cover space, which is a great Bronze introduction to minimizing wasted coverage.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB12-Barn-Repair"
				},
				{
					title: "Problem: Speeding Ticket",
					content:
						"Practice range comparisons and piecewise simulation while keeping the data model simple enough to debug quickly.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket"
				}
			]
		},
		{
			title: "Unit 3: Counting, Sorting, and Ranking",
			curriculum: [
				{
					title: "Frequency and Ranking Problems",
					content:
						"Count occurrences, rank values, and compare groups without overcomplicating the data structures. Many Bronze tasks can be solved with careful counts and sorted lists alone."
				},
				{
					title: "Look for the Key Ordering",
					content:
						"Emphasize that sorting often reveals the decisive pattern in a Bronze problem. Once data is ordered, the main logic may shrink to a single pass or a compact window scan."
				},
				{
					title: "Explain the Metric Being Optimized",
					content:
						"State exactly what quantity is being maximized, minimized, or counted. This helps prevent the common mistake of solving a nearby but different problem."
				},
				{
					title: "Compare Similar Solutions",
					content:
						"Compare two plausible but different approaches and identify why one is safer, simpler, or more general. This builds real contest judgment."
				},
				{
					title: "Unit 3: Counting, Sorting, and Ranking: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Diamond Collector",
					content:
						"Use sorting and window-style reasoning to capture a best group under a constraint.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB37-Diamond-Collector"
				},
				{
					title: "Problem: Promotion Counting",
					content:
						"Practice tier-by-tier counting and careful propagation of totals through a simple structure.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB31-Promotion-Counting"
				},
				{
					title: "Problem: Acowdemia",
					content:
						"Use ranking and threshold logic to reinforce the habit of naming the exact score or count the problem asks for.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB54-Acowdemia"
				},
				{
					title: "Transformations Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB10-Transformations-Java"
				}
			]
		},
		{
			title: "Unit 4: Search-Flavored Bronze Problems",
			curriculum: [
				{
					title: "Path Simulation and Reachability",
					content:
						"Introduce Bronze problems that feel a little more graph-like or stateful without demanding heavy graph theory. Practice target: Staying organized as the state space becomes less linear."
				},
				{
					title: "Track Structure Explicitly",
					content:
						"Encourage tables, parent relationships, or step histories when the problem involves movement, ancestry, or repeated transitions. Explicit structure prevents guessing."
				},
				{
					title: "Separate Representation from Process",
					content:
						"Decide what data structure best represents the problem before choosing the algorithmic loop that uses it. This is the first step toward Silver-level thinking."
				},
				{
					title: "Stay Grounded in Bronze Simplicity",
					content:
						"Even when a problem hints at graphs or search, Bronze solutions are usually still modest. Avoid overengineering the problem beyond what the constraints require."
				},
				{
					title: "Unit 4: Search-Flavored Bronze Problems: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: The Lost Cow",
					content:
						"Use path simulation to model repeated movement and distance accumulation carefully.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow"
				},
				{
					title: "Problem: Wormholes",
					content:
						"Treat pairings and repeated movement as a structured search exercise with a clear, bounded state space.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB16-Wormholes"
				},
				{
					title: "Problem: Family Tree",
					content:
						"Use parent and ancestor reasoning to practice a light graph-style relationship problem without leaving Bronze territory.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB51-Family-Tree"
				}
			]
		},
		{
			title: "Unit 5: Contest Sets and Tier Transition",
			curriculum: [
				{
					title: "Bundle Problems by Pattern",
					content:
						"Practice solving short sets of problems that share a theme such as simulation, intervals, or counting. Start to recognize families of Bronze tasks instead of experiencing each prompt as brand new."
				},
				{
					title: "Know When Bronze Is Solved",
					content:
						"Stop polishing once the solution is clearly correct, tested, and within constraints. This is important for contest pacing and prevents time loss on unnecessary rewrites."
				},
				{
					title: "Reflect on Weak Spots",
					content:
						"Use logs to identify whether the main obstacle is misreading statements, building the wrong state model, weak test design, or overcomplicating simple tasks. Bronze growth is very diagnosable when students track it honestly."
				},
				{
					title: "Prepare for USACO Silver",
					content:
						"Close by identifying the habits that carry forward: stronger use of sorting, cleaner state models, comfort with custom tests, and willingness to justify an approach before coding. Move to `USACO Silver` only once these habits are stable."
				},
				{
					title: "Unit 5: Contest Sets and Tier Transition: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order"
				}
			],
			supplementalProjects: [
				{
					title: "Problem: Milking Order",
					content:
						"Use ordering constraints and careful placement to rehearse the kind of structured reasoning that starts to appear near the top of Bronze.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB50-Milking-Order"
				},
				{
					title: "Problem: Feeding the Cows",
					content:
						"Use a late-Bronze constraint problem to test whether students can still keep the solution simple under a more layered prompt.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB63-Feeding-the-Cows"
				},
				{
					title: "Problem: Just Stalling",
					content:
						"Use a counting-and-ordering problem as a final check that students can combine sorting with a careful interpretation of what is being counted.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB55-Just-Stalling"
				},
				{
					title: "Mixing Milk Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk-Java"
				}
			]
		},
		{
			title: "Unit 6: Optional Bronze Problem Bank",
			curriculum: [
				{
					title: "How to Read the Repo Bank",
					content:
						"Treat the extra `USACO-Bronze` repo folders as an optional canonical problem bank rather than as hidden missing lessons. The public course keeps a curated spine, while the repo holds a broader set of classical and modern Bronze problems for extra practice."
				},
				{
					title: "Classical Bronze Bank",
					content:
						"Classical training problems in the repo include `UB3 Friday the Thirteenth`, `UB4 Broken Necklace`, `UB5 Greedy Gift Givers`, `UB7 Name That Number`, `UB8 Palindromic Squares`, `UB9 Dual Palindromes`, `UB11 Mixing Milk`, `UB13 Combination Lock`, `UB14 Prime Cryptarithm`, and `UB15 Ski Course Design`."
				},
				{
					title: "Simulation, Arrays, and Grid Practice",
					content:
						"Mid-course optional problems include `UB17 Block Game`, `UB18 The Cow Signal`, `UB19 Don't Be Last`, `UB20 Hoof Paper Scissors`, `UB21 Cow Tipping`, `UB22/UB23/UB24 Why Did the Cow Cross the Road`, `UB26 Bovine Genomics`, `UB27 Modern Art`, and `UB28 Fence Painting`."
				},
				{
					title: "Late Bronze and Modern Contest Bank",
					content:
						"Later optional repo practice includes `UB30 Contaminated Milk`, `UB32 Angry Cows`, `UB33 Mowing the Field`, `UB34 Milk Pails`, `UB35 Circular Barn`, `UB36 Load Balancing`, `UB38 Bull in a China Shop`, `UB39 Field Reduction`, `UB40/UB43 Blocked Billboard`, `UB41 The Bovine Shuffle`, `UB42 Milk Measurement`, `UB44 Lifeguards`, `UB45 Out of Place`, `UB46 Teleportation`, `UB47 Hoofball`, `UB48 Taming the Herd`, `UB49 Team Tic-Tac-Toe`, `UB52 Do You Know Your ABCs`, `UB53 Daisy Chains`, `UB56 Photoshoot`, `UB57 Photoshoot 2`, `UB58 Air Cownditioning`, `UB59 Non-Transitive Dice`, `UB60 Rotate and Shift`, `UB61 FEB`, and `UB62 Cow College`."
				},
				{
					title: "Language Variants",
					content:
						"The repo also contains parallel `-Java` versions for many Bronze problems. Treat the plain folder as the canonical public problem entry and the `-Java` mirror as an alternate language path rather than as a duplicate lesson."
				},
				{
					title: "Unit 6: Optional Bronze Problem Bank: Core Project",
					content: "",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Problem Bank: Full Bronze Repo",
					content:
						"Browse the full Bronze repo bank, including the Python-side canonical problems and their parallel Java mirrors, when the curated course spine is not enough practice.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main"
				},
				{
					title: "Problem: Mixing Milk",
					content:
						"Use repeated pour operations to rehearse careful simulation and container-state updates.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB11-Mixing-Milk"
				},
				{
					title: "Problem: Hoof, Paper, Scissors",
					content:
						"Use case-based counting and matchup reasoning to strengthen simple game-logic analysis.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB20-Hoof-Paper-Scissors"
				},
				{
					title: "Problem: Circular Barn",
					content:
						"Use a stronger late-Bronze simulation and counting problem to test whether state modeling stays clean under more layered movement.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB35-Circular-Barn"
				},
				{
					title: "Problem: Cow College",
					content:
						"Use a late Bronze optimization prompt to practice sorting, revenue reasoning, and clear objective definition.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB62-Cow-College"
				}
			]
		},
		{
			title: "UB 12 Barn Repair Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 12 Barn Repair Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 12 Barn Repair Java: Guided Example",
					content:
						"A representative UB 12 Barn Repair Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 12 Barn Repair Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java"
				},
				{
					title: "UB 12 Barn Repair Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 12 Barn Repair Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-12-Barn-Repair-Java"
				},
				{
					title: "Combination Lock",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB13-Combination-Lock"
				},
				{
					title: "Prime Cryptarithm",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB14-Prime-Cryptarithm"
				}
			]
		},
		{
			title: "UB 13 Combination Lock Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 13 Combination Lock Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 13 Combination Lock Java: Guided Example",
					content:
						"A representative UB 13 Combination Lock Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 13 Combination Lock Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java"
				},
				{
					title: "UB 13 Combination Lock Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 13 Combination Lock Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-13-Combination-Lock-Java"
				},
				{
					title: "Ski Course Design",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB15-Ski-Course-Design"
				},
				{
					title: "Block Game",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB17-Block-Game"
				}
			]
		},
		{
			title: "UB 14 Prime Cryptarithm Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 14 Prime Cryptarithm Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 14 Prime Cryptarithm Java: Guided Example",
					content:
						"A representative UB 14 Prime Cryptarithm Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 14 Prime Cryptarithm Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java"
				},
				{
					title: "UB 14 Prime Cryptarithm Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 14 Prime Cryptarithm Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-14-Prime-Cryptarithm-Java"
				},
				{
					title: "The Cow Signal",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB18-The-Cow-Signal"
				},
				{
					title: "Dont Be Last",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB19-Dont-Be-Last"
				}
			]
		},
		{
			title: "UB 15 Ski Course Design Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 15 Ski Course Design Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 15 Ski Course Design Java: Guided Example",
					content:
						"A representative UB 15 Ski Course Design Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 15 Ski Course Design Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java"
				},
				{
					title: "UB 15 Ski Course Design Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 15 Ski Course Design Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-15-Ski-Course-Design-Java"
				},
				{
					title: "Your Ride Is Here Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB2-Your-Ride-Is-Here-Java"
				},
				{
					title: "Cow Tipping",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB21-Cow-Tipping"
				}
			]
		},
		{
			title: "UB 16 Wormholes Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 16 Wormholes Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 16 Wormholes Java: Guided Example",
					content:
						"A representative UB 16 Wormholes Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 16 Wormholes Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java"
				},
				{
					title: "UB 16 Wormholes Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 16 Wormholes Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-16-Wormholes-Java"
				},
				{
					title: "Why Did the Cow Cross the Road",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB22-Why-Did-the-Cow-Cross-the-Road"
				},
				{
					title: "Why Did the Cow Cross the Road II",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB23-Why-Did-the-Cow-Cross-the-Road-II"
				}
			]
		},
		{
			title: "UB 17 Block Game Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 17 Block Game Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 17 Block Game Java: Guided Example",
					content:
						"A representative UB 17 Block Game Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 17 Block Game Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java"
				},
				{
					title: "UB 17 Block Game Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 17 Block Game Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-17-Block-Game-Java"
				},
				{
					title: "Why Did the Cow Cross the Road III",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB24-Why-Did-the-Cow-Cross-the-Road-III"
				},
				{
					title: "The Lost Cow Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB25-The-Lost-Cow-Java"
				}
			]
		},
		{
			title: "UB 18 The Cow Signal Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 18 The Cow Signal Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 18 The Cow Signal Java: Guided Example",
					content:
						"A representative UB 18 The Cow Signal Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 18 The Cow Signal Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java"
				},
				{
					title: "UB 18 The Cow Signal Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 18 The Cow Signal Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-18-The-Cow-Signal-Java"
				},
				{
					title: "Bovine Genomics",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics"
				},
				{
					title: "Bovine Genomics Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB26-Bovine-Genomics-Java"
				}
			]
		},
		{
			title: "UB 19 Dont Be Last Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 19 Dont Be Last Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 19 Dont Be Last Java: Guided Example",
					content:
						"A representative UB 19 Dont Be Last Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 19 Dont Be Last Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java"
				},
				{
					title: "UB 19 Dont Be Last Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 19 Dont Be Last Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-19-Dont-Be-Last-Java"
				},
				{
					title: "Modern Art",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art"
				},
				{
					title: "Modern Art Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB27-Modern-Art-Java"
				}
			]
		},
		{
			title: "UB 20 Hoof Paper Scissors Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 20 Hoof Paper Scissors Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Guided Example",
					content:
						"A representative UB 20 Hoof Paper Scissors Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java"
				},
				{
					title: "UB 20 Hoof Paper Scissors Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 20 Hoof Paper Scissors Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-20-Hoof-Paper-Scissors-Java"
				},
				{
					title: "Fence Painting",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting"
				},
				{
					title: "Fence Painting Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB28-Fence-Painting-Java"
				}
			]
		},
		{
			title: "UB 21 Cow Tipping Java: Implementation Lab",
			curriculum: [
				{
					title: "UB 21 Cow Tipping Java: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "UB 21 Cow Tipping Java: Guided Example",
					content:
						"A representative UB 21 Cow Tipping Java example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "UB 21 Cow Tipping Java: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java"
				},
				{
					title: "UB 21 Cow Tipping Java: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "UB 21 Cow Tipping Java: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB-21-Cow-Tipping-Java"
				},
				{
					title: "Speeding Ticket Java",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB29-Speeding-Ticket-Java"
				},
				{
					title: "Friday the Thirteenth",
					content:
						"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.",
					projectLink:
						"https://github.com/instruction-material/USACO-Bronze/tree/main/UB3-Friday-the-Thirteenth"
				}
			]
		}
	]
};
