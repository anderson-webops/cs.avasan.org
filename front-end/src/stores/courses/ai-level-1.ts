import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

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
						"Include short written notes after each search or game AI lab: what representation was used, what strategy was tried, what failed, and what evidence supports the next revision. Leave the course able to explain why an algorithm behaved the way it did."
				},
				{
					title: "FAI0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "FAI0 Setup and Tooling",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Legacy Archive: AI Level 1 Workspace",
					content:
						"Use the legacy umbrella Python archive when the older single-folder Juni layout is useful for comparison or for recovering an earlier classroom variant of the AI Level 1 materials.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main"
				},
				{
					title: "Object Refresh: Dog Class",
					content:
						"Use a small class-design warmup to refresh attributes, methods, and state changes before graph and game objects enter the course. The goal is not the dog model itself; it is confidence with objects as containers for AI state.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI1-Dog-Class"
				},
				{
					title: "Object Refresh: Deck of Cards",
					content:
						"Review lists of objects, controlled randomness, and data modeling with a deck implementation. The deck gives state transitions a concrete form before search trees and game logic enter the course.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI1-Deck-of-Cards"
				},
				{
					title: "The Marble Game AI",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "FAI0 Setup and Tooling",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI-Copy"
				}
			]
		},
		{
			title: "Unit 1: AI Landscape and State Representation",
			curriculum: [
				{
					title: "What AI Is and What It Is Not",
					content:
						"Introduce AI as a family of approaches: rules, search, planning, heuristics, machine learning, and modern generative systems. Key idea: This course focuses on explicit state and decision processes rather than jumping straight to model fitting."
				},
				{
					title: "States, Actions, Goals, and Costs",
					content:
						"Every AI problem can be framed as a question about state changes. Skill target: say what a valid state looks like, what transitions are allowed, what counts as success, and whether a path should be judged by steps, cost, score, or some other metric."
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
				},
				{
					title: "Unit 1: AI Landscape and State Representation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 1: AI Landscape and State Representation",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Node and Graph Class",
					content:
						"Build a reusable graph model with explicit nodes, adjacency, and helper methods for traversal. This is the foundational starter for later DFS, BFS, and heuristic search work.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class"
				},
				{
					title: "Project: Graphs with Network Visualization",
					content:
						"Use `networkx` to draw graph structures and make the difference between representation and traversal visible. A search algorithm is easier to debug when the structure is easy to inspect.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Graphs-with-Network-Updated"
				},
				{
					title: "Project: Airports Problem",
					content:
						"Model routes, hubs, and reachability in a graph-based setting. This keeps the early graph work grounded in a recognizable real-world system rather than a purely abstract diagram.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI3-Airports-Problem"
				},
				{
					title: "Unit 1: AI Landscape and State Representation supplemental 4",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 1: AI Landscape and State Representation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-unit-1-ai-landscape-and-state-representation-supplemental-4/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-unit-1-ai-landscape-and-state-representation-supplemental-4/solution"
				}
			]
		},
		{
			title: "Unit 2: Stacks, Queues, and Traversal Intuition",
			curriculum: [
				{
					title: "Why Search Needs a Frontier",
					content:
						"Introduce the frontier as the set of states that have been generated but not fully explored. Key idea: Search behavior is largely determined by how the frontier is organized and updated."
				},
				{
					title: "Stack Behavior and Depth-First Thinking",
					content:
						"Use stacks to show what it means to commit to one branch before backtracking. The point is to make the control flow of DFS concrete long before students optimize or compare it formally."
				},
				{
					title: "Queue Behavior and Breadth-First Thinking",
					content:
						"Use queues to show layer-by-layer exploration and shortest-path intuition in unweighted settings. Visible pattern: Why data structure choice changes the order of discovery and the type of guarantees an algorithm can make."
				},
				{
					title: "Tracing Traversals by Hand",
					content:
						"Use whiteboard or notebook traces before implementation. Skill target: Follow push, pop, enqueue, dequeue, and visited-set changes step by step instead of treating search as magic recursion or copy-pasted code."
				},
				{
					title: "Unit 2: Stacks, Queues, and Traversal Intuition: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 2: Stacks, Queues, and Traversal Intuition",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI4-Practice-with-Stacks"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Practice with Stacks",
					content:
						"Work directly with LIFO behavior so that the mechanics behind backtracking become automatic. This warmup is intentionally small because the real value is the mental model it creates.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI4-Practice-with-Stacks"
				},
				{
					title: "Project: Practice with Queues",
					content:
						"Build fluency with FIFO behavior before BFS is introduced on graphs. Leave this project knowing exactly what comes out next and why.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI4-Practice-with-Queues"
				},
				{
					title: "Project: Stacks and Queues Reference",
					content:
						"Keep a reference implementation of stack- and queue-based workflows nearby while later search code gets more complex. The goal is to separate data-structure confusion from algorithmic confusion.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Queues"
				},
				{
					title: "Unit 2: Stacks, Queues, and Traversal Intuition supplemental 4",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 2: Stacks, Queues, and Traversal Intuition",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-unit-2-stacks-queues-and-traversal-intuition-supplemental-4/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-unit-2-stacks-queues-and-traversal-intuition-supplemental-4/solution"
				}
			]
		},
		{
			title: "Unit 3: DFS, BFS, and Reachability",
			curriculum: [
				{
					title: "Depth-First Search as Structured Exploration",
					content:
						"This section covers DFS as a systematic way to explore one branch fully, record visited nodes, and backtrack cleanly. Key idea: Where DFS is useful for reachability, component finding, and exhaustive path exploration."
				},
				{
					title: "Breadth-First Search and Unweighted Shortest Paths",
					content:
						"This section covers BFS as the correct default when edge costs are uniform and the first shortest path matters. Skill target: Defend BFS in a shortest-step setting instead of choosing it only because they remember the name."
				},
				{
					title: "Visited Sets, Parents, and Path Reconstruction",
					content:
						"Move beyond simple discovery and show how to reconstruct actual solutions. Record parent pointers or equivalent state so that the search output explains the path, not just the destination."
				},
				{
					title: "Instrumentation and Debugging Search",
					content:
						"Add counters, frontier-size tracking, and simple visual markers to search code. This keeps performance and correctness observable, which matters once informed search and game trees arrive."
				},
				{
					title: "Unit 3: DFS, BFS, and Reachability: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "Unit 3: DFS, BFS, and Reachability",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-Implement-DFS"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Implement DFS",
					content:
						"Build DFS explicitly rather than relying on library behavior. Skill target: Explain every mutation of the stack, visited set, and current node during execution.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-Implement-DFS"
				},
				{
					title: "Project: Implement BFS",
					content:
						"Build BFS with a queue, visited tracking, and path reconstruction. The emphasis is on why breadth-first ordering produces the right guarantee in an unweighted problem.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI6-Implement-BFS"
				},
				{
					title: "Project: Magic Portals",
					content:
						"Use a graph puzzle with teleports and special moves to distinguish state transitions from physical movement on a simple map. This sharpens the habit of designing the right graph before running the algorithm.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI6-Magic-Portals"
				},
				{
					title: "Project: Maze Solver",
					content:
						"Start with a constrained maze-search starter, then extend it into a working solver that traces paths and compares candidate routes. This becomes the anchor example for later informed search units.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Maze-Solver-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Maze-Solver"
				}
			]
		},
		{
			title: "Unit 4: Informed and Bounded Search",
			curriculum: [
				{
					title: "Depth-Limited and Iterative Deepening Search",
					content:
						"This section covers DLS and IDS as tools for controlling explosion in deep trees while still reasoning about completeness. Visible pattern: Why search often needs operational constraints as much as it needs cleverness."
				},
				{
					title: "Uniform Cost Search and Weighted Paths",
					content:
						"Move from step counts to path costs so students can distinguish shortest-by-steps from cheapest-by-total-cost. This sets up a clearer understanding of why BFS is not enough once edge weights matter."
				},
				{
					title: "Heuristics, Greedy Choice, and A*",
					content:
						"Introduce heuristics as informed guesses that help order the frontier. Compare greedy best-first search with A* and learn that a better-looking local move is not the same thing as a guaranteed optimal plan."
				},
				{
					title: "Comparing Search Strategies Honestly",
					content:
						"Compare algorithms by memory use, guarantees, path quality, and runtime behavior on the same problem family. The goal is to make tradeoffs explicit rather than celebrating any single algorithm as 'the AI one'."
				},
				{
					title: "Unit 4: Informed and Bounded Search: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "Unit 4: Informed and Bounded Search",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-DLS"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Implement DLS",
					content:
						"Add depth limits deliberately and observe what gets missed, what gets found, and what the algorithm spends time revisiting. This is a good lab for understanding search control rather than only search success.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-DLS"
				},
				{
					title: "Project: Implement IDS",
					content:
						"Layer repeated depth-limited searches into an iterative-deepening workflow and compare its behavior to plain DFS. Skill target: Say when the extra repeated work is worth it.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-IDS"
				},
				{
					title: "Project: Implement UCS",
					content:
						"Handle weighted paths and prove to yourself that expanding the shallowest path is not enough once costs differ. UCS becomes the clean stepping stone into heuristic search.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-UCS"
				},
				{
					title: "Project: Compare A* and Greedy Search",
					content:
						"Run the same state space through greedy best-first search and A* so students can see the difference between fast-looking decisions and cost-aware planning.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-A-Search"
				},
				{
					title: "Project: Greedy Search Lab",
					content:
						"Use a dedicated greedy search implementation to show how a heuristic can reduce work while still getting trapped by shortsighted choices.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-Greedy-Search"
				}
			]
		},
		{
			title: "Unit 5: Rule-Based Systems and Puzzle Framing",
			curriculum: [
				{
					title: "Rules as Small AI",
					content:
						"Introduce rule-based systems as a legitimate form of AI when the domain is structured and the reasoning can be written down clearly. Not all intelligent behavior comes from statistical models."
				},
				{
					title: "Decision Logic, Constraints, and State Tracking",
					content:
						"Use text adventures and small puzzles to represent progress, conditions, and allowed actions explicitly. This reinforces the idea that good AI work often starts with clean state definitions rather than advanced math."
				},
				{
					title: "When Search Beats Rules and When Rules Beat Search",
					content:
						"Choose between hand-authored rules and search over a space of possibilities. The right answer often depends on whether the structure is known, stable, and explainable."
				},
				{
					title: "Feature Thinking before Machine Learning",
					content:
						"Start the bridge to ML by asking what information a system would need in order to make a good decision. Skill target: Name candidate features even when they are not training a predictive model yet."
				},
				{
					title: "Unit 5: Rule-Based Systems and Puzzle Framing: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 5: Rule-Based Systems and Puzzle Framing",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Adventure-Game"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Adventure Game State Tracker",
					content:
						"Use a branching text-style environment to manage inventory, location, and permitted actions. This is a good exercise in representing knowledge and gating decisions through explicit rules.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Adventure-Game"
				},
				{
					title: "Project: Puzzle Solver Warmup",
					content:
						"Frame a small puzzle in terms of state transitions and allowable moves before the capstone solver arrives. The lesson is to model the problem cleanly before choosing the search algorithm.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Puzzle"
				},
				{
					title: "Project: Juni Book Rule System",
					content:
						"Use a structured decision or lookup problem to practice explicit rules, routing, and explainability. Skill target: Justify each program choice in natural language.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-Juni-Book"
				},
				{
					title: "Unit 5: Rule Based Systems and Puzzle Framing supplemental 4",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 5: Rule-Based Systems and Puzzle Framing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-unit-5-rule-based-systems-and-puzzle-framing-supplemental-4/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-unit-5-rule-based-systems-and-puzzle-framing-supplemental-4/solution"
				}
			]
		},
		{
			title: "Unit 6: Heuristics and Game AI",
			curriculum: [
				{
					title: "Game State Trees",
					content:
						"Represent turn-based games as trees of future possibilities. Key idea: How one move creates a new state and how repeated expansion leads to a search tree instead of a single graph walk."
				},
				{
					title: "Random Play, Heuristic Play, and Stronger Play",
					content:
						"Compare purely random agents with agents that score positions and look ahead. The point is to see how even simple heuristics can change behavior dramatically before a full minimax treatment is introduced."
				},
				{
					title: "Evaluation Functions and Tradeoffs",
					content:
						"This section covers heuristic evaluation as a practical compromise when exhaustive search is too expensive. Practice target: Designing scores that reflect the actual objectives of the game, not just arbitrary numbers."
				},
				{
					title: "Debugging a Game AI",
					content:
						"Use concrete debugging methods: inspect candidate moves, print evaluation scores, compare turns against human reasoning, and capture failure positions. Learn that AI bugs are often representation bugs or scoring bugs."
				},
				{
					title: "Unit 6: Heuristics and Game AI: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "Unit 6: Heuristics and Game AI",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Tic-Tac-Toe-Tree-Node"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Tic-Tac-Toe Tree Nodes",
					content:
						"Build the board-state representation and successor logic that later AI strategies depend on. The quality of the tree structure determines how easy the rest of the project is to reason about.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Tic-Tac-Toe-Tree-Node"
				},
				{
					title: "Project: Random Tic-Tac-Toe AI",
					content:
						"Start from a deliberately weak baseline so that later heuristic and search upgrades are easy to compare against. This makes evaluation visible rather than abstract.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Random-Tic-Tac-Toe-AI"
				},
				{
					title: "Project: Unbeatable Tic-Tac-Toe AI",
					content:
						"Push a simple game AI all the way to strong play and discuss what made the jump possible: better state modeling, lookahead, pruning of bad choices, and more disciplined scoring.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Unbeatable-Tic-Tac-Toe-AI"
				},
				{
					title: "Project: Marble Game AI",
					content:
						"Use a two-player strategy game to compare state explosion, heuristics, and planning depth in a setting that is different enough from tic-tac-toe to test whether the reasoning generalizes.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI"
				}
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
						"Define what counts as a correct or useful output before optimizing anything. Even in small AI systems, evaluation depends on clear labels, goals, baselines, and constraints."
				},
				{
					title: "Bias, Failure Cases, and Overconfidence",
					content:
						"Use toy AI examples to discuss blind spots, brittle heuristics, misleading benchmarks, and the danger of calling a system 'intelligent' when it only works on a narrow slice of cases. Responsible AI starts with honest evaluation."
				},
				{
					title: "Bridge to Later Machine Learning Work",
					content:
						"Connect search and rule systems to later ML topics by emphasizing features, labels, evaluation, training data, and the difference between hand-authored behavior and learned behavior. Leave this unit ready to enter `Machine Learning` with better intuition."
				},
				{
					title: "Unit 7: Features, Evaluation, and Responsible AI: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 7: Features, Evaluation, and Responsible AI",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-Greedy-Search"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Search Strategy Comparison Lab",
					content:
						"Run multiple algorithms on related problems and compare memory use, runtime, and path quality. The real deliverable is the written comparison, not just the code output.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-Greedy-Search"
				},
				{
					title: "Project: Water Jug Riddle",
					content:
						"Treat a classic reasoning puzzle as an exercise in formal state definition, action generation, and evaluation. This makes it easy to discuss how small changes in representation can completely change the search behavior.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Water-Jug-Riddle"
				},
				{
					title: "Unit 7: Features, Evaluation, and Responsible AI supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 7: Features, Evaluation, and Responsible AI",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-unit-7-features-evaluation-and-responsible-ai-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-unit-7-features-evaluation-and-responsible-ai-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: Capstone and Portfolio Build",
			curriculum: [
				{
					title: "Choose a Toy AI Direction",
					content:
						"Choose a capstone direction such as a puzzle solver, game AI, rule-based recommender, or search visualizer. The scope should be ambitious enough to show real thinking but small enough to finish cleanly."
				},
				{
					title: "Build for Explanation, Not Just Output",
					content:
						"The capstone should expose its logic through traces, notes, diagrams, or evaluation summaries. The expected outcome is an explanation of why the system made a choice and how it would fail, not just a demonstration that it runs."
				},
				{
					title: "Measure Improvement over a Baseline",
					content:
						"Every capstone should compare itself to a simpler starting point: random play, uninformed search, fewer rules, or a shallower heuristic. The comparison is what makes the project feel like AI rather than a generic programming assignment."
				},
				{
					title: "Reflect on the Next Course Step",
					content:
						"Close by deciding whether the next step should be `Machine Learning`, `Data Science in Python`, `AP Computer Science A`, or deeper algorithmic work such as `USACO Bronze`. Skill target: Justify that next step based on the kind of thinking they enjoyed most."
				},
				{
					title: "Unit 8: Capstone and Portfolio Build: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "Unit 8: Capstone and Portfolio Build",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI11-8-Puzzle-Solver"
				}
			],
			supplementalProjects: [
				{
					title: "Capstone: 8-Puzzle Solver",
					content:
						"Build a full puzzle solver that makes representation, heuristic choice, and evaluation visible. This is the natural capstone because it rewards careful modeling as much as algorithm selection.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI11-8-Puzzle-Solver"
				},
				{
					title: "Capstone Option: Maze Solver Showcase",
					content:
						"Turn the earlier maze work into a polished search visualizer or comparison tool with cleaner reporting and a stronger interface for explaining results.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Maze-Solver"
				},
				{
					title: "Capstone Option: Marble Game Strategy Lab",
					content:
						"Promote the marble game into a stronger strategy project by comparing heuristics, search depth, and game balance over multiple runs.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI"
				}
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
						"Use `FAI7-Updated-Tic-Tac-Toe-AI` as the main optional advanced Tic-Tac-Toe follow-up and keep `FAI7-Unbeatable-Tic-Tac-Toe-AI-1` as an archive duplicate rather than a separate public requirement. Do the same for the marble-game branch by using the clean playable variant and hiding the `COPY` folder."
				},
				{
					title: "How to Use the Extra Repo Folders",
					content:
						"Students who want more practice should use the optional bank below for targeted reinforcement: class refresh, stack/queue mechanics, graph variants, and stronger game-AI comparisons. The point is discoverability without flooding the core syllabus."
				},
				{
					title: "Unit 9: Repo Extension Bank and Canonical Variants: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "AI",
						moduleTitle:
							"Unit 9: Repo Extension Bank and Canonical Variants",
						section: "verification"
					})
				},
				{
					title: "Unit 9: Repo Extension Bank and Canonical Variants: Core Project",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unit 9: Repo Extension Bank and Canonical Variants",
						projectKind: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Special-Graphs"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: Special Graphs",
					content:
						"Use alternate graph structures and examples to strengthen representation choices before later search and heuristic work.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Special-Graphs"
				},
				{
					title: "Extension: Practice with Stacks (Reference Bank)",
					content:
						"Use the dedicated stacks folder as extra frontier-order practice when DFS mechanics still feel shaky.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Stacks"
				},
				{
					title: "Extension: BankAccount Class",
					content:
						"Keep a second lightweight class-design warmup available for students who need more confidence with object state before graph and game objects.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI1-Bank-Account-Class"
				},
				{
					title: "Extension: DFS with a Stack Class",
					content:
						"Compare the earlier DFS implementation with a more class-structured stack-based version so students can see the same algorithm through a cleaner API boundary.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-DFS-With-a-Stack-Class"
				},
				{
					title: "Extension: BFS with a Queue Class",
					content:
						"Use a queue-centered class version of BFS to reinforce shortest-path intuition and explicit frontier management.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI6-BFS-With-a-Queue-Class"
				},
				{
					title: "Extension: Updated Tic-Tac-Toe AI",
					content:
						"Use the updated Tic-Tac-Toe branch as the canonical optional game-tree extension beyond the main course spine.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Updated-Tic-Tac-Toe-AI"
				},
				{
					title: "Extension: Two-Player Marble Game",
					content:
						"Use the two-player marble variant as a lighter strategy and evaluation warmup before the stronger AI version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-2-Player-Marble-Game"
				}
			]
		},
		{
			title: "AI Search Lab 13: Implementation Lab",
			curriculum: [
				{
					title: "AI Search Lab 13: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 13: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 13: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/solution"
				},
				{
					title: "AI Search Lab 13: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 13: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/solution"
				},
				{
					title: "AI Search Lab 13 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-applied-studio-11-ai-search-lab-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-applied-studio-11-ai-search-lab-13-supplemental-2/solution"
				},
				{
					title: "AI Search Lab 13 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 13: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-06-applied-studio-11-ai-search-lab-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-06-applied-studio-11-ai-search-lab-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "AI Search Lab 14: Implementation Lab",
			curriculum: [
				{
					title: "AI Search Lab 14: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 14: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 14: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/solution"
				},
				{
					title: "AI Search Lab 14: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 14: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/solution"
				},
				{
					title: "AI Search Lab 14 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-07-applied-studio-12-ai-search-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-07-applied-studio-12-ai-search-lab-14-supplemental-2/solution"
				},
				{
					title: "AI Search Lab 14 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 14: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-08-applied-studio-12-ai-search-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-08-applied-studio-12-ai-search-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "AI Search Lab 15: Implementation Lab",
			curriculum: [
				{
					title: "AI Search Lab 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/solution"
				},
				{
					title: "AI Search Lab 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/solution"
				},
				{
					title: "AI Search Lab 15 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-09-applied-studio-13-ai-search-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-09-applied-studio-13-ai-search-lab-15-supplemental-2/solution"
				},
				{
					title: "AI Search Lab 15 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-10-applied-studio-13-ai-search-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-10-applied-studio-13-ai-search-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "AI Search Lab 16: Implementation Lab",
			curriculum: [
				{
					title: "AI Search Lab 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/solution"
				},
				{
					title: "AI Search Lab 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/solution"
				},
				{
					title: "AI Search Lab 16 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-11-applied-studio-14-ai-search-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-11-applied-studio-14-ai-search-lab-16-supplemental-2/solution"
				},
				{
					title: "AI Search Lab 16 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-12-applied-studio-14-ai-search-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-12-applied-studio-14-ai-search-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "AI Search Lab 17: Implementation Lab",
			curriculum: [
				{
					title: "AI Search Lab 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "AI Search Lab 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "AI Search Lab 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/solution"
				},
				{
					title: "AI Search Lab 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "AI Search Lab 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/solution"
				},
				{
					title: "AI Search Lab 17 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-13-applied-studio-15-ai-search-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-13-applied-studio-15-ai-search-lab-17-supplemental-2/solution"
				},
				{
					title: "AI Search Lab 17 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "AI Search Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-14-applied-studio-15-ai-search-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-14-applied-studio-15-ai-search-lab-17-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unbeatable TicTacToe AI 1: Implementation Lab",
			curriculum: [
				{
					title: "Unbeatable TicTacToe AI 1: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Unbeatable TicTacToe AI 1: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Unbeatable TicTacToe AI 1: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Implementation Lab",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Unbeatable-Tic-Tac-Toe-AI-1"
				},
				{
					title: "Unbeatable TicTacToe AI 1: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Unbeatable TicTacToe AI 1: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Implementation Lab",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Unbeatable-Tic-Tac-Toe-AI-1"
				},
				{
					title: "Unbeatable TicTacToe AI 1 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-15-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-15-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-2/solution"
				},
				{
					title: "Unbeatable TicTacToe AI 1 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle:
							"Unbeatable TicTacToe AI 1: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-16-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-16-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "The Marble Game AI: Implementation Lab",
			curriculum: [
				{
					title: "The Marble Game AI: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "The Marble Game AI: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "The Marble Game AI: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Implementation Lab",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI-Copy"
				},
				{
					title: "The Marble Game AI: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "The Marble Game AI: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Implementation Lab",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI-Copy"
				},
				{
					title: "The Marble Game AI supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-17-applied-studio-17-the-marble-game-ai-copy-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-17-applied-studio-17-the-marble-game-ai-copy-supplemental-2/solution"
				},
				{
					title: "The Marble Game AI supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "AI/Python",
						moduleTitle: "The Marble Game AI: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-18-applied-studio-17-the-marble-game-ai-copy-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-18-applied-studio-17-the-marble-game-ai-copy-supplemental-3/solution"
				}
			]
		}
	]
};
