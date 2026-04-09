import type { RawCourse, RawCourseModuleItem } from "./types";

const USACO_BRONZE_REPO =
	"https://github.com/instruction-material/USACO-Bronze/tree/main";

function repoLink(projectId: string) {
	return `${USACO_BRONZE_REPO}/${projectId}`;
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
		title: `Bronze Log: ${unitTitle}`,
		content: `Keep a short contest log for ${unitTitle.toLowerCase()} that records one wrong assumption, one edge case that broke an early idea, and one note about ${focus}. Bronze-level progress comes from disciplined debugging as much as from knowing a trick.`
	};
}

export const usacoBronzeCourse: RawCourse = {
	name: "USACO Bronze",
	modules: [
		{
			title: "USB0 Setup and Contest Workflow",
			curriculum: [
				{
					title: "USACO File I/O and Submission Rhythm",
					content:
						"Set up a clean competitive-programming workflow with fast compile-run cycles, local sample files, and disciplined input/output handling. Students should understand that contest success depends on fast iteration and careful reading, not on large project scaffolding."
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
				}
			],
			supplementalProjects: [
				contestLog(
					"Setup and Contest Workflow",
					"which part of the problem statement is easiest to misread under time pressure"
				)
			]
		},
		{
			title: "Unit 1: Simulation and Careful Translation",
			curriculum: [
				{
					title: "Turn Story Problems into Variables and Steps",
					content:
						"Teach students to translate narrative wording into a tiny model: what is tracked, what changes each step, and when the answer should be updated. The first win at Bronze is usually accurate modeling, not deep theory."
				},
				{
					title: "Follow the Rules Exactly",
					content:
						"Bronze problems often reward literal implementation of a process. Students should resist inventing shortcuts until they can restate the official rules precisely and prove their simulation matches them."
				},
				{
					title: "Make Small Custom Tests",
					content:
						"Use intentionally tiny cases to catch off-by-one mistakes and state-update errors. Students should leave this unit knowing that small tests are the fastest path to correctness."
				},
				{
					title: "Use Tables and Traces",
					content:
						"Encourage tables of values, timeline traces, and manual updates. Bronze-level debugging becomes much easier when the evolving state is visible on paper."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Square Pasture",
					"Use geometric bounds and direct translation to practice reading a short statement carefully and converting it into a compact calculation.",
					"UB1-Square-Pasture"
				),
				problemItem(
					"Problem: Your Ride Is Here",
					"Use a classic warmup to reinforce modular arithmetic, string processing, and exact interpretation of a quirky problem statement.",
					"UB2-Your-Ride-Is-Here"
				),
				problemItem(
					"Problem: Transformations",
					"Practice rule-driven simulation by applying a fixed set of transformations and checking results systematically.",
					"UB10-Transformations"
				),
				contestLog(
					"Simulation and Careful Translation",
					"which state update or rule ordering choice most affected correctness"
				)
			]
		},
		{
			title: "Unit 2: Intervals, Arrays, and Greedy Warmups",
			curriculum: [
				{
					title: "Intervals and Coverage Thinking",
					content:
						"Teach students to reason about segments, overlaps, and gaps with small sorted lists or interval scans. Many Bronze tasks become easier once the timeline or number line is made explicit."
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
						"Teach students to sort when it clarifies the structure of the task. Bronze solutions often become dramatically simpler once the data is in a useful order."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Milking Cows",
					"Use interval merging and longest-gap reasoning to practice scanning sorted ranges carefully.",
					"UB6-Milking-Cows"
				),
				problemItem(
					"Problem: Barn Repair",
					"Use a clean greedy idea to decide where not to cover space, which is a great Bronze introduction to minimizing wasted coverage.",
					"UB12-Barn-Repair"
				),
				problemItem(
					"Problem: Speeding Ticket",
					"Practice range comparisons and piecewise simulation while keeping the data model simple enough to debug quickly.",
					"UB29-Speeding-Ticket"
				)
			]
		},
		{
			title: "Unit 3: Counting, Sorting, and Ranking",
			curriculum: [
				{
					title: "Frequency and Ranking Problems",
					content:
						"Teach students to count occurrences, rank values, and compare groups without overcomplicating the data structures. Many Bronze tasks can be solved with careful counts and sorted lists alone."
				},
				{
					title: "Look for the Key Ordering",
					content:
						"Emphasize that sorting often reveals the decisive pattern in a Bronze problem. Once data is ordered, the main logic may shrink to a single pass or a compact window scan."
				},
				{
					title: "Explain the Metric Being Optimized",
					content:
						"Require students to state exactly what quantity is being maximized, minimized, or counted. This helps prevent the common mistake of solving a nearby but different problem."
				},
				{
					title: "Compare Similar Solutions",
					content:
						"Have students compare two plausible but different approaches and identify why one is safer, simpler, or more general. This builds real contest judgment."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Diamond Collector",
					"Use sorting and window-style reasoning to capture a best group under a constraint.",
					"UB37-Diamond-Collector"
				),
				problemItem(
					"Problem: Promotion Counting",
					"Practice tier-by-tier counting and careful propagation of totals through a simple structure.",
					"UB31-Promotion-Counting"
				),
				problemItem(
					"Problem: Acowdemia",
					"Use ranking and threshold logic to reinforce the habit of naming the exact score or count the problem asks for.",
					"UB54-Acowdemia"
				),
				contestLog(
					"Counting, Sorting, and Ranking",
					"which sorting or counting step turned a messy problem into a clean one"
				)
			]
		},
		{
			title: "Unit 4: Search-Flavored Bronze Problems",
			curriculum: [
				{
					title: "Path Simulation and Reachability",
					content:
						"Introduce Bronze problems that feel a little more graph-like or stateful without demanding heavy graph theory. Students should practice staying organized as the state space becomes less linear."
				},
				{
					title: "Track Structure Explicitly",
					content:
						"Encourage tables, parent relationships, or step histories when the problem involves movement, ancestry, or repeated transitions. Explicit structure prevents guessing."
				},
				{
					title: "Separate Representation from Process",
					content:
						"Teach students to decide what data structure best represents the problem before choosing the algorithmic loop that uses it. This is the first step toward Silver-level thinking."
				},
				{
					title: "Stay Grounded in Bronze Simplicity",
					content:
						"Even when a problem hints at graphs or search, Bronze solutions are usually still modest. Students should avoid overengineering the problem beyond what the constraints require."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: The Lost Cow",
					"Use path simulation to model repeated movement and distance accumulation carefully.",
					"UB25-The-Lost-Cow"
				),
				problemItem(
					"Problem: Wormholes",
					"Treat pairings and repeated movement as a structured search exercise with a clear, bounded state space.",
					"UB16-Wormholes"
				),
				problemItem(
					"Problem: Family Tree",
					"Use parent and ancestor reasoning to practice a light graph-style relationship problem without leaving Bronze territory.",
					"UB51-Family-Tree"
				)
			]
		},
		{
			title: "Unit 5: Contest Sets and Tier Transition",
			curriculum: [
				{
					title: "Bundle Problems by Pattern",
					content:
						"Practice solving short sets of problems that share a theme such as simulation, intervals, or counting. Students should start to recognize families of Bronze tasks instead of experiencing each prompt as brand new."
				},
				{
					title: "Know When Bronze Is Solved",
					content:
						"Teach students to stop polishing once the solution is clearly correct, tested, and within constraints. This is important for contest pacing and prevents time loss on unnecessary rewrites."
				},
				{
					title: "Reflect on Weak Spots",
					content:
						"Use logs to identify whether the main obstacle is misreading statements, building the wrong state model, weak test design, or overcomplicating simple tasks. Bronze growth is very diagnosable when students track it honestly."
				},
				{
					title: "Prepare for USACO Silver",
					content:
						"Close by identifying the habits that carry forward: stronger use of sorting, cleaner state models, comfort with custom tests, and willingness to justify an approach before coding. Students should move to `USACO Silver` only once these habits are stable."
				}
			],
			supplementalProjects: [
				problemItem(
					"Problem: Milking Order",
					"Use ordering constraints and careful placement to rehearse the kind of structured reasoning that starts to appear near the top of Bronze.",
					"UB50-Milking-Order"
				),
				problemItem(
					"Problem: Feeding the Cows",
					"Use a late-Bronze constraint problem to test whether students can still keep the solution simple under a more layered prompt.",
					"UB63-Feeding-the-Cows"
				),
				problemItem(
					"Problem: Just Stalling",
					"Use a counting-and-ordering problem as a final check that students can combine sorting with a careful interpretation of what is being counted.",
					"UB55-Just-Stalling"
				),
				contestLog(
					"Contest Sets and Tier Transition",
					"which Bronze habit is most important to preserve when moving to Silver"
				)
			]
		}
	]
};
