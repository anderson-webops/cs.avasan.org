import type { RawCourse, RawCourseModuleItem } from "./types";

const AI_LEVEL_1_REPO =
	"https://github.com/instruction-material/AI-Level-1/tree/main";
const PYTHON_COURSES_AI_LEVEL_1_ARCHIVE =
	"https://github.com/instruction-material/Python-Courses/tree/main/AI%20Level%201";

function repoLink(projectId: string) {
	return `${AI_LEVEL_1_REPO}/${projectId}`;
}

function projectItem(
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

function pairedProjectItem(
	title: string,
	content: string,
	starterId: string,
	solutionId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: repoLink(starterId),
		solutionLink: repoLink(solutionId)
	};
}

function searchNotebook(unitTitle: string, focus: string): RawCourseModuleItem {
	return {
		title: `Search Notebook: ${unitTitle}`,
		content: `Keep a running search notebook for ${unitTitle.toLowerCase()} that records one state representation, one frontier snapshot, one explanation of the next move, and one short comparison about ${focus}. The habit should be to justify the algorithm, not just the answer.`
	};
}

export const aiLevel1Course: RawCourse = {
	name: "AI Level 1",
	modules: [
		{
			title: "FAI0 Setup and Tooling",
			curriculum: [
				{
					title: "Python Environment for Search and Graph Labs",
					content:
						"Set up `Python 3`, a virtual environment, and a lightweight editor workflow in either `PyCharm` or `VS Code`. Install `networkx`, `matplotlib`, and notebook support early so students can inspect graphs, visualize search spaces, and keep small experiment logs without changing tools halfway through the course."
				},
				{
					title: "Bridge Positioning between Core Python and ML",
					content:
						"Frame the course as a bridge from programming fundamentals into AI thinking. The emphasis should be on state, goals, search, rules, heuristics, and evaluation so students gain AI intuition before they need heavier statistics or model-training pipelines."
				},
				{
					title: "How to Read an AI Problem Statement",
					content:
						"Train students to identify the state, the valid actions, the goal condition, and the cost or score function before they touch code. This is the key shift from basic programming tasks into AI-style problem solving."
				},
				{
					title: "Experiment Logging and Reflection",
					content:
						"Require short written notes after each search or game AI lab: what representation was used, what strategy was tried, what failed, and what evidence supports the next revision. Students should leave the course able to explain why an algorithm behaved the way it did."
				}
			],
			supplementalProjects: [
				{
					title: "Legacy Archive: AI Level 1 Workspace",
					content:
						"Use the legacy umbrella Python archive when the older single-folder Juni layout is useful for comparison or for recovering an earlier classroom variant of the AI Level 1 materials.",
					projectLink: PYTHON_COURSES_AI_LEVEL_1_ARCHIVE
				},
				projectItem(
					"Object Refresh: Dog Class",
					"Use a small class-design warmup to refresh attributes, methods, and state changes before graph and game objects enter the course. The goal is not the dog model itself; it is confidence with objects as containers for AI state.",
					"FAI1-Dog-Class"
				),
				projectItem(
					"Object Refresh: Deck of Cards",
					"Review lists of objects, controlled randomness, and data modeling with a deck implementation. This gives students a concrete way to talk about state transitions before they build search trees and game logic.",
					"FAI1-Deck-of-Cards"
				),
				searchNotebook(
					"Setup and Tooling",
					"how states, actions, and goals will be documented across the entire course"
				)
			]
		},
		{
			title: "Unit 1: AI Landscape and State Representation",
			curriculum: [
				{
					title: "What AI Is and What It Is Not",
					content:
						"Introduce AI as a family of approaches: rules, search, planning, heuristics, machine learning, and modern generative systems. Students should understand that this course focuses on explicit state and decision processes rather than jumping straight to model fitting."
				},
				{
					title: "States, Actions, Goals, and Costs",
					content:
						"Teach every AI problem as a question about state changes. Students should be able to say what a valid state looks like, what transitions are allowed, what counts as success, and whether a path should be judged by steps, cost, score, or some other metric."
				},
				{
					title: "Graphs as a Universal Representation",
					content:
						"Show why graphs are such a useful abstraction for AI. Locations, social links, game boards, dependency chains, and puzzle moves can all be phrased as nodes and edges once students decide what information the structure must preserve."
				},
				{
					title: "Knowledge Representation for Small Systems",
					content:
						"Use simple Python classes and dictionaries to represent entities, edges, metadata, and rules. The course should emphasize representations that are easy to inspect, reason about, and debug."
				}
			],
			supplementalProjects: [
				pairedProjectItem(
					"Project: Node and Graph Class",
					"Build a reusable graph model with explicit nodes, adjacency, and helper methods for traversal. This is the foundational starter for later DFS, BFS, and heuristic search work.",
					"FAI2-Node-and-Graph-Class-Starter",
					"FAI2-Node-and-Graph-Class"
				),
				projectItem(
					"Project: Graphs with Network Visualization",
					"Use `networkx` to draw graph structures and make the difference between representation and traversal visible. Students should see that a search algorithm is easier to debug when the structure is easy to inspect.",
					"FAI-Graphs-with-Network-Updated"
				),
				projectItem(
					"Project: Airports Problem",
					"Model routes, hubs, and reachability in a graph-based setting. This keeps the early graph work grounded in a recognizable real-world system rather than a purely abstract diagram.",
					"FAI3-Airports-Problem"
				),
				searchNotebook(
					"AI Landscape and State Representation",
					"which details belong in a state and which details are irrelevant noise"
				)
			]
		},
		{
			title: "Unit 2: Stacks, Queues, and Traversal Intuition",
			curriculum: [
				{
					title: "Why Search Needs a Frontier",
					content:
						"Introduce the frontier as the set of states that have been generated but not fully explored. Students should understand that search behavior is largely determined by how the frontier is organized and updated."
				},
				{
					title: "Stack Behavior and Depth-First Thinking",
					content:
						"Use stacks to show what it means to commit to one branch before backtracking. The point is to make the control flow of DFS concrete long before students optimize or compare it formally."
				},
				{
					title: "Queue Behavior and Breadth-First Thinking",
					content:
						"Use queues to show layer-by-layer exploration and shortest-path intuition in unweighted settings. Students should see why data structure choice changes the order of discovery and the type of guarantees an algorithm can make."
				},
				{
					title: "Tracing Traversals by Hand",
					content:
						"Require whiteboard or notebook traces before implementation. Students should be able to follow push, pop, enqueue, dequeue, and visited-set changes step by step instead of treating search as magic recursion or copy-pasted code."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Practice with Stacks",
					"Work directly with LIFO behavior so that the mechanics behind backtracking become automatic. This warmup is intentionally small because the real value is the mental model it creates.",
					"FAI4-Practice-with-Stacks"
				),
				projectItem(
					"Project: Practice with Queues",
					"Build fluency with FIFO behavior before BFS is introduced on graphs. Students should leave this project knowing exactly what comes out next and why.",
					"FAI4-Practice-with-Queues"
				),
				projectItem(
					"Project: Stacks and Queues Reference",
					"Keep a reference implementation of stack- and queue-based workflows nearby while later search code gets more complex. The goal is to separate data-structure confusion from algorithmic confusion.",
					"FAI-Queues"
				),
				searchNotebook(
					"Stacks, Queues, and Traversal Intuition",
					"how frontier order changes what the algorithm discovers first"
				)
			]
		},
		{
			title: "Unit 3: DFS, BFS, and Reachability",
			curriculum: [
				{
					title: "Depth-First Search as Structured Exploration",
					content:
						"Teach DFS as a systematic way to explore one branch fully, record visited nodes, and backtrack cleanly. Students should understand where DFS is useful for reachability, component finding, and exhaustive path exploration."
				},
				{
					title: "Breadth-First Search and Unweighted Shortest Paths",
					content:
						"Teach BFS as the correct default when edge costs are uniform and the first shortest path matters. Students should be able to defend BFS in a shortest-step setting instead of choosing it only because they remember the name."
				},
				{
					title: "Visited Sets, Parents, and Path Reconstruction",
					content:
						"Move beyond simple discovery and show how to reconstruct actual solutions. Students should record parent pointers or equivalent state so that the search output explains the path, not just the destination."
				},
				{
					title: "Instrumentation and Debugging Search",
					content:
						"Add counters, frontier-size tracking, and simple visual markers to search code. This keeps performance and correctness observable, which matters once informed search and game trees arrive."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Implement DFS",
					"Build DFS explicitly rather than relying on library behavior. Students should be able to explain every mutation of the stack, visited set, and current node during execution.",
					"FAI5-Implement-DFS"
				),
				projectItem(
					"Project: Implement BFS",
					"Build BFS with a queue, visited tracking, and path reconstruction. The emphasis is on why breadth-first ordering produces the right guarantee in an unweighted problem.",
					"FAI6-Implement-BFS"
				),
				projectItem(
					"Project: Magic Portals",
					"Use a graph puzzle with teleports and special moves to distinguish state transitions from physical movement on a simple map. This sharpens the habit of designing the right graph before running the algorithm.",
					"FAI6-Magic-Portals"
				),
				pairedProjectItem(
					"Project: Maze Solver",
					"Start with a constrained maze-search starter, then extend it into a working solver that traces paths and compares candidate routes. This becomes the anchor example for later informed search units.",
					"FAI9-Maze-Solver-Starter",
					"FAI9-Maze-Solver"
				)
			]
		},
		{
			title: "Unit 4: Informed and Bounded Search",
			curriculum: [
				{
					title: "Depth-Limited and Iterative Deepening Search",
					content:
						"Teach DLS and IDS as tools for controlling explosion in deep trees while still reasoning about completeness. Students should see why search often needs operational constraints as much as it needs cleverness."
				},
				{
					title: "Uniform Cost Search and Weighted Paths",
					content:
						"Move from step counts to path costs so students can distinguish shortest-by-steps from cheapest-by-total-cost. This sets up a clearer understanding of why BFS is not enough once edge weights matter."
				},
				{
					title: "Heuristics, Greedy Choice, and A*",
					content:
						"Introduce heuristics as informed guesses that help order the frontier. Students should compare greedy best-first search with A* and learn that a better-looking local move is not the same thing as a guaranteed optimal plan."
				},
				{
					title: "Comparing Search Strategies Honestly",
					content:
						"Require students to compare algorithms by memory use, guarantees, path quality, and runtime behavior on the same problem family. The goal is to make tradeoffs explicit rather than celebrating any single algorithm as 'the AI one'."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Implement DLS",
					"Add depth limits deliberately and observe what gets missed, what gets found, and what the algorithm spends time revisiting. This is a good lab for understanding search control rather than only search success.",
					"FAI9-Implement-DLS"
				),
				projectItem(
					"Project: Implement IDS",
					"Layer repeated depth-limited searches into an iterative-deepening workflow and compare its behavior to plain DFS. Students should be able to say when the extra repeated work is worth it.",
					"FAI9-Implement-IDS"
				),
				projectItem(
					"Project: Implement UCS",
					"Handle weighted paths and prove to yourself that expanding the shallowest path is not enough once costs differ. UCS becomes the clean stepping stone into heuristic search.",
					"FAI9-Implement-UCS"
				),
				projectItem(
					"Project: Compare A* and Greedy Search",
					"Run the same state space through greedy best-first search and A* so students can see the difference between fast-looking decisions and cost-aware planning.",
					"FAI10-Implement-A-Search"
				),
				projectItem(
					"Project: Greedy Search Lab",
					"Use a dedicated greedy search implementation to show how a heuristic can reduce work while still getting trapped by shortsighted choices.",
					"FAI10-Implement-Greedy-Search"
				)
			]
		},
		{
			title: "Unit 5: Rule-Based Systems and Puzzle Framing",
			curriculum: [
				{
					title: "Rules as Small AI",
					content:
						"Introduce rule-based systems as a legitimate form of AI when the domain is structured and the reasoning can be written down clearly. Students should see that not all intelligent behavior comes from statistical models."
				},
				{
					title: "Decision Logic, Constraints, and State Tracking",
					content:
						"Use text adventures and small puzzles to represent progress, conditions, and allowed actions explicitly. This reinforces the idea that good AI work often starts with clean state definitions rather than advanced math."
				},
				{
					title: "When Search Beats Rules and When Rules Beat Search",
					content:
						"Teach students to choose between hand-authored rules and search over a space of possibilities. The right answer often depends on whether the structure is known, stable, and explainable."
				},
				{
					title: "Feature Thinking before Machine Learning",
					content:
						"Start the bridge to ML by asking what information a system would need in order to make a good decision. Students should learn to name candidate features even when they are not training a predictive model yet."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Adventure Game State Tracker",
					"Use a branching text-style environment to manage inventory, location, and permitted actions. This is a good exercise in representing knowledge and gating decisions through explicit rules.",
					"FAI2-Adventure-Game"
				),
				projectItem(
					"Project: Puzzle Solver Warmup",
					"Frame a small puzzle in terms of state transitions and allowable moves before the capstone solver arrives. The lesson is to model the problem cleanly before choosing the search algorithm.",
					"FAI-Puzzle"
				),
				projectItem(
					"Project: Juni Book Rule System",
					"Use a structured decision or lookup problem to practice explicit rules, routing, and explainability. Students should be able to justify each program choice in natural language.",
					"FAI5-Juni-Book"
				),
				searchNotebook(
					"Rule-Based Systems and Puzzle Framing",
					"which parts of the task can be encoded directly and which require search or scoring"
				)
			]
		},
		{
			title: "Unit 6: Heuristics and Game AI",
			curriculum: [
				{
					title: "Game State Trees",
					content:
						"Represent turn-based games as trees of future possibilities. Students should understand how one move creates a new state and how repeated expansion leads to a search tree instead of a single graph walk."
				},
				{
					title: "Random Play, Heuristic Play, and Stronger Play",
					content:
						"Compare purely random agents with agents that score positions and look ahead. The point is to see how even simple heuristics can change behavior dramatically before a full minimax treatment is introduced."
				},
				{
					title: "Evaluation Functions and Tradeoffs",
					content:
						"Teach heuristic evaluation as a practical compromise when exhaustive search is too expensive. Students should practice designing scores that reflect the actual objectives of the game, not just arbitrary numbers."
				},
				{
					title: "Debugging a Game AI",
					content:
						"Require concrete debugging methods: inspect candidate moves, print evaluation scores, compare turns against human reasoning, and capture failure positions. Students should learn that AI bugs are often representation bugs or scoring bugs."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Tic-Tac-Toe Tree Nodes",
					"Build the board-state representation and successor logic that later AI strategies depend on. The quality of the tree structure determines how easy the rest of the project is to reason about.",
					"FAI7-Tic-Tac-Toe-TreeNode"
				),
				projectItem(
					"Project: Random Tic-Tac-Toe AI",
					"Start from a deliberately weak baseline so that later heuristic and search upgrades are easy to compare against. This makes evaluation visible rather than abstract.",
					"FAI7-Random-Tic-Tac-Toe-AI"
				),
				projectItem(
					"Project: Unbeatable Tic-Tac-Toe AI",
					"Push a simple game AI all the way to strong play and discuss what made the jump possible: better state modeling, lookahead, pruning of bad choices, and more disciplined scoring.",
					"FAI7-Unbeatable-TicTacToe-AI"
				),
				projectItem(
					"Project: Marble Game AI",
					"Use a two-player strategy game to compare state explosion, heuristics, and planning depth in a setting that is different enough from tic-tac-toe to test whether the reasoning generalizes.",
					"FAI8-The-Marble-Game-AI"
				)
			]
		},
		{
			title: "Unit 7: Features, Evaluation, and Responsible AI",
			curriculum: [
				{
					title: "From States to Features",
					content:
						"Turn raw states into measurable signals such as path cost, remaining distance, mobility, piece control, or resource counts. This is the conceptual bridge into ML because students begin to ask which inputs actually help a system make better decisions."
				},
				{
					title: "Labels, Benchmarks, and Success Criteria",
					content:
						"Teach students to define what counts as a correct or useful output before they optimize anything. Even in small AI systems, evaluation depends on clear labels, goals, baselines, and constraints."
				},
				{
					title: "Bias, Failure Cases, and Overconfidence",
					content:
						"Use toy AI examples to discuss blind spots, brittle heuristics, misleading benchmarks, and the danger of calling a system 'intelligent' when it only works on a narrow slice of cases. Responsible AI starts with honest evaluation."
				},
				{
					title: "Bridge to Later Machine Learning Work",
					content:
						"Connect search and rule systems to later ML topics by emphasizing features, labels, evaluation, training data, and the difference between hand-authored behavior and learned behavior. Students should leave this unit ready to enter `Machine Learning` with better intuition."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Search Strategy Comparison Lab",
					"Run multiple algorithms on related problems and compare memory use, runtime, and path quality. The real deliverable is the written comparison, not just the code output.",
					"FAI10-Implement-Greedy-Search"
				),
				projectItem(
					"Project: Water Jug Riddle",
					"Treat a classic reasoning puzzle as an exercise in formal state definition, action generation, and evaluation. This makes it easy to discuss how small changes in representation can completely change the search behavior.",
					"FAI10-Water-Jug-Riddle"
				),
				searchNotebook(
					"Features, Evaluation, and Responsible AI",
					"what the system is optimizing for and which failure cases would still matter to a real user"
				)
			]
		},
		{
			title: "Unit 8: Capstone and Portfolio Build",
			curriculum: [
				{
					title: "Choose a Toy AI Direction",
					content:
						"Have students choose a capstone direction such as a puzzle solver, game AI, rule-based recommender, or search visualizer. The scope should be ambitious enough to show real thinking but small enough to finish cleanly."
				},
				{
					title: "Build for Explanation, Not Just Output",
					content:
						"Require the capstone to expose its logic through traces, notes, diagrams, or evaluation summaries. A student should be able to explain why the system made a choice and how it would fail, not just demonstrate that it runs."
				},
				{
					title: "Measure Improvement over a Baseline",
					content:
						"Every capstone should compare itself to a simpler starting point: random play, uninformed search, fewer rules, or a shallower heuristic. The comparison is what makes the project feel like AI rather than a generic programming assignment."
				},
				{
					title: "Reflect on the Next Course Step",
					content:
						"Close by deciding whether the next step should be `Machine Learning`, `Data Science in Python`, `AP Computer Science A`, or deeper algorithmic work such as `USACO Bronze`. Students should be able to justify that next step based on the kind of thinking they enjoyed most."
				}
			],
			supplementalProjects: [
				projectItem(
					"Capstone: 8-Puzzle Solver",
					"Build a full puzzle solver that makes representation, heuristic choice, and evaluation visible. This is the natural capstone because it rewards careful modeling as much as algorithm selection.",
					"FAI11-8-Puzzle-Solver"
				),
				projectItem(
					"Capstone Option: Maze Solver Showcase",
					"Turn the earlier maze work into a polished search visualizer or comparison tool with cleaner reporting and a stronger interface for explaining results.",
					"FAI9-Maze-Solver"
				),
				projectItem(
					"Capstone Option: Marble Game Strategy Lab",
					"Promote the marble game into a stronger strategy project by comparing heuristics, search depth, and game balance over multiple runs.",
					"FAI8-The-Marble-Game-AI"
				)
			]
		},
		{
			title: "Unit 9: Repo Extension Bank and Canonical Variants",
			curriculum: [
				{
					title: "Optional Reinforcement versus Archive Material",
					content:
						"Treat the extra `AI-Level-1` repo folders as a structured extension bank, not as missing core lessons. The public course keeps one canonical Tic-Tac-Toe and Marble Game path visible while still exposing worthwhile extra graph, stack, and class-based practice."
				},
				{
					title: "Canonical Variants for Game AI",
					content:
						"Use `FAI7-Updated-TicTacToe-AI` as the main optional advanced Tic-Tac-Toe follow-up and keep `FAI7-Unbeatable-TicTacToe-AI-1` as an archive duplicate rather than a separate public requirement. Do the same for the marble-game branch by using the clean playable variant and hiding the `COPY` folder."
				},
				{
					title: "How to Use the Extra Repo Folders",
					content:
						"Students who want more practice should use the optional bank below for targeted reinforcement: class refresh, stack/queue mechanics, graph variants, and stronger game-AI comparisons. The point is discoverability without flooding the core syllabus."
				}
			],
			supplementalProjects: [
				projectItem(
					"Extension: Special Graphs",
					"Use alternate graph structures and examples to strengthen representation choices before later search and heuristic work.",
					"FAI-Special-Graphs"
				),
				projectItem(
					"Extension: Practice with Stacks (Reference Bank)",
					"Use the dedicated stacks folder as extra frontier-order practice when DFS mechanics still feel shaky.",
					"FAI-Stacks"
				),
				projectItem(
					"Extension: BankAccount Class",
					"Keep a second lightweight class-design warmup available for students who need more confidence with object state before graph and game objects.",
					"FAI1-BankAccount-Class"
				),
				projectItem(
					"Extension: DFS with a Stack Class",
					"Compare the earlier DFS implementation with a more class-structured stack-based version so students can see the same algorithm through a cleaner API boundary.",
					"FAI5-DFS-With-a-Stack-Class"
				),
				projectItem(
					"Extension: BFS with a Queue Class",
					"Use a queue-centered class version of BFS to reinforce shortest-path intuition and explicit frontier management.",
					"FAI6-BFS-With-a-Queue-Class"
				),
				projectItem(
					"Extension: Updated Tic-Tac-Toe AI",
					"Use the updated Tic-Tac-Toe branch as the canonical optional game-tree extension beyond the main course spine.",
					"FAI7-Updated-TicTacToe-AI"
				),
				projectItem(
					"Extension: Two-Player Marble Game",
					"Use the two-player marble variant as a lighter strategy and evaluation warmup before the stronger AI version.",
					"FAI8-2-Player-Marble-Game"
				)
			]
		}
	]
};
