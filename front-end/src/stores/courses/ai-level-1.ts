import type { RawCourse } from "./types";

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
				},
				{
					title: "FAI0 Setup and Tooling: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Legacy Archive: AI Level 1 Workspace",
					content:
						"Use the legacy umbrella Python archive when the older single-folder Juni layout is useful for comparison or for recovering an earlier classroom variant of the AI Level 1 materials. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
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
						"Review lists of objects, controlled randomness, and data modeling with a deck implementation. This gives students a concrete way to talk about state transitions before they build search trees and game logic.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI1-Deck-of-Cards"
				},
				{
					title: "The Marble Game AI(COPY)",
					content:
						"Use the linked starter and solution for a supplemental project tied to FAI0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI(COPY)"
				}
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
				},
				{
					title: "Unit 1: AI Landscape and State Representation: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Build a reusable graph model with explicit nodes, adjacency, and helper methods for traversal. This is the foundational starter for later DFS, BFS, and heuristic search work. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class-Starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI2-Node-and-Graph-Class"
				},
				{
					title: "Project: Graphs with Network Visualization",
					content:
						"Use `networkx` to draw graph structures and make the difference between representation and traversal visible. Students should see that a search algorithm is easier to debug when the structure is easy to inspect.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Graphs-with-Network-Updated"
				},
				{
					title: "Project: Airports Problem",
					content:
						"Model routes, hubs, and reachability in a graph-based setting. This keeps the early graph work grounded in a recognizable real-world system rather than a purely abstract diagram. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI3-Airports-Problem"
				},
				{
					title: "Unit 1: AI Landscape and State Representation supplemental 4",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 1: AI Landscape and State Representation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-unit-1-ai-landscape-and-state-representation-sup/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-unit-1-ai-landscape-and-state-representation-sup/solution"
				}
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
				},
				{
					title: "Unit 2: Stacks, Queues, and Traversal Intuition: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI4-Practice-with-Stacks"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Practice with Stacks",
					content:
						"Work directly with LIFO behavior so that the mechanics behind backtracking become automatic. This warmup is intentionally small because the real value is the mental model it creates. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI4-Practice-with-Stacks"
				},
				{
					title: "Project: Practice with Queues",
					content:
						"Build fluency with FIFO behavior before BFS is introduced on graphs. Students should leave this project knowing exactly what comes out next and why. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 2: Stacks, Queues, and Traversal Intuition. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-unit-2-stacks-queues-and-traversal-intuition-sup/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-unit-2-stacks-queues-and-traversal-intuition-sup/solution"
				}
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
				},
				{
					title: "Unit 3: DFS, BFS, and Reachability: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-Implement-DFS"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Implement DFS",
					content:
						"Build DFS explicitly rather than relying on library behavior. Students should be able to explain every mutation of the stack, visited set, and current node during execution. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-Implement-DFS"
				},
				{
					title: "Project: Implement BFS",
					content:
						"Build BFS with a queue, visited tracking, and path reconstruction. The emphasis is on why breadth-first ordering produces the right guarantee in an unweighted problem. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
				},
				{
					title: "Unit 4: Informed and Bounded Search: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Layer repeated depth-limited searches into an iterative-deepening workflow and compare its behavior to plain DFS. Students should be able to say when the extra repeated work is worth it.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-IDS"
				},
				{
					title: "Project: Implement UCS",
					content:
						"Handle weighted paths and prove to yourself that expanding the shallowest path is not enough once costs differ. UCS becomes the clean stepping stone into heuristic search. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Implement-UCS"
				},
				{
					title: "Project: Compare A* and Greedy Search",
					content:
						"Run the same state space through greedy best-first search and A* so students can see the difference between fast-looking decisions and cost-aware planning. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-A-Search"
				},
				{
					title: "Project: Greedy Search Lab",
					content:
						"Use a dedicated greedy search implementation to show how a heuristic can reduce work while still getting trapped by shortsighted choices. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
				},
				{
					title: "Unit 5: Rule-Based Systems and Puzzle Framing: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Use a structured decision or lookup problem to practice explicit rules, routing, and explainability. Students should be able to justify each program choice in natural language. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-Juni-Book"
				},
				{
					title: "Unit 5: Rule Based Systems and Puzzle Framing supplemental 4",
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 5: Rule-Based Systems and Puzzle Framing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-unit-5-rule-based-systems-and-puzzle-framing-sup/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-unit-5-rule-based-systems-and-puzzle-framing-sup/solution"
				}
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
				},
				{
					title: "Unit 6: Heuristics and Game AI: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Tic-Tac-Toe-TreeNode"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Tic-Tac-Toe Tree Nodes",
					content:
						"Build the board-state representation and successor logic that later AI strategies depend on. The quality of the tree structure determines how easy the rest of the project is to reason about.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Tic-Tac-Toe-TreeNode"
				},
				{
					title: "Project: Random Tic-Tac-Toe AI",
					content:
						"Start from a deliberately weak baseline so that later heuristic and search upgrades are easy to compare against. This makes evaluation visible rather than abstract. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Random-Tic-Tac-Toe-AI"
				},
				{
					title: "Project: Unbeatable Tic-Tac-Toe AI",
					content:
						"Push a simple game AI all the way to strong play and discuss what made the jump possible: better state modeling, lookahead, pruning of bad choices, and more disciplined scoring. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Unbeatable-TicTacToe-AI"
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
				},
				{
					title: "Unit 7: Features, Evaluation, and Responsible AI: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI10-Implement-Greedy-Search"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Search Strategy Comparison Lab",
					content:
						"Run multiple algorithms on related problems and compare memory use, runtime, and path quality. The real deliverable is the written comparison, not just the code output. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
					content:
						"Use the linked starter and solution for a supplemental project tied to Unit 7: Features, Evaluation, and Responsible AI. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-unit-7-features-evaluation-and-responsible-ai-su/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-unit-7-features-evaluation-and-responsible-ai-su/solution"
				}
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
				},
				{
					title: "Unit 8: Capstone and Portfolio Build: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Turn the earlier maze work into a polished search visualizer or comparison tool with cleaner reporting and a stronger interface for explaining results. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI9-Maze-Solver"
				},
				{
					title: "Capstone Option: Marble Game Strategy Lab",
					content:
						"Promote the marble game into a stronger strategy project by comparing heuristics, search depth, and game balance over multiple runs. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
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
						"Use `FAI7-Updated-TicTacToe-AI` as the main optional advanced Tic-Tac-Toe follow-up and keep `FAI7-Unbeatable-TicTacToe-AI-1` as an archive duplicate rather than a separate public requirement. Do the same for the marble-game branch by using the clean playable variant and hiding the `COPY` folder."
				},
				{
					title: "How to Use the Extra Repo Folders",
					content:
						"Students who want more practice should use the optional bank below for targeted reinforcement: class refresh, stack/queue mechanics, graph variants, and stronger game-AI comparisons. The point is discoverability without flooding the core syllabus."
				},
				{
					title: "Unit 9: Repo Extension Bank and Canonical Variants: Verification and Reflection",
					content:
						"Close Unit 9: Repo Extension Bank and Canonical Variants by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "Unit 9: Repo Extension Bank and Canonical Variants: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Special-Graphs"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: Special Graphs",
					content:
						"Use alternate graph structures and examples to strengthen representation choices before later search and heuristic work. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Special-Graphs"
				},
				{
					title: "Extension: Practice with Stacks (Reference Bank)",
					content:
						"Use the dedicated stacks folder as extra frontier-order practice when DFS mechanics still feel shaky. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI-Stacks"
				},
				{
					title: "Extension: BankAccount Class",
					content:
						"Keep a second lightweight class-design warmup available for students who need more confidence with object state before graph and game objects. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI1-BankAccount-Class"
				},
				{
					title: "Extension: DFS with a Stack Class",
					content:
						"Compare the earlier DFS implementation with a more class-structured stack-based version so students can see the same algorithm through a cleaner API boundary. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI5-DFS-With-a-Stack-Class"
				},
				{
					title: "Extension: BFS with a Queue Class",
					content:
						"Use a queue-centered class version of BFS to reinforce shortest-path intuition and explicit frontier management. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI6-BFS-With-a-Queue-Class"
				},
				{
					title: "Extension: Updated Tic-Tac-Toe AI",
					content:
						"Use the updated Tic-Tac-Toe branch as the canonical optional game-tree extension beyond the main course spine. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Updated-TicTacToe-AI"
				},
				{
					title: "Extension: Two-Player Marble Game",
					content:
						"Use the two-player marble variant as a lighter strategy and evaluation warmup before the stronger AI version. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-2-Player-Marble-Game"
				}
			]
		},
		{
			title: "Applied Studio 11: ai search lab 13",
			curriculum: [
				{
					title: "ai search lab 13: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 11: ai search lab 13, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "ai search lab 13: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 11: ai search lab 13, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "ai search lab 13: Core Project",
					content:
						"Build the central artifact for Applied Studio 11: ai search lab 13. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/solution"
				},
				{
					title: "ai search lab 13: Review and Reflection",
					content:
						"Close Applied Studio 11: ai search lab 13 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "ai search lab 13: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 11: ai search lab 13 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-01-ai-search-lab-13/solution"
				},
				{
					title: "Applied Studio 11: ai search lab 13 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: ai search lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-applied-studio-11-ai-search-lab-13-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-applied-studio-11-ai-search-lab-13-supplemental-/solution"
				},
				{
					title: "Applied Studio 11: ai search lab 13 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: ai search lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-06-applied-studio-11-ai-search-lab-13-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-06-applied-studio-11-ai-search-lab-13-supplemental-/solution"
				}
			]
		},
		{
			title: "Applied Studio 12: ai search lab 14",
			curriculum: [
				{
					title: "ai search lab 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: ai search lab 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "ai search lab 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: ai search lab 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "ai search lab 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: ai search lab 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/solution"
				},
				{
					title: "ai search lab 14: Review and Reflection",
					content:
						"Close Applied Studio 12: ai search lab 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "ai search lab 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: ai search lab 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-02-ai-search-lab-14/solution"
				},
				{
					title: "Applied Studio 12: ai search lab 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: ai search lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-07-applied-studio-12-ai-search-lab-14-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-07-applied-studio-12-ai-search-lab-14-supplemental-/solution"
				},
				{
					title: "Applied Studio 12: ai search lab 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: ai search lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-08-applied-studio-12-ai-search-lab-14-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-08-applied-studio-12-ai-search-lab-14-supplemental-/solution"
				}
			]
		},
		{
			title: "Applied Studio 13: ai search lab 15",
			curriculum: [
				{
					title: "ai search lab 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: ai search lab 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "ai search lab 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: ai search lab 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "ai search lab 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: ai search lab 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/solution"
				},
				{
					title: "ai search lab 15: Review and Reflection",
					content:
						"Close Applied Studio 13: ai search lab 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "ai search lab 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: ai search lab 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-03-ai-search-lab-15/solution"
				},
				{
					title: "Applied Studio 13: ai search lab 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: ai search lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-09-applied-studio-13-ai-search-lab-15-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-09-applied-studio-13-ai-search-lab-15-supplemental-/solution"
				},
				{
					title: "Applied Studio 13: ai search lab 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: ai search lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-10-applied-studio-13-ai-search-lab-15-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-10-applied-studio-13-ai-search-lab-15-supplemental-/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: ai search lab 16",
			curriculum: [
				{
					title: "ai search lab 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: ai search lab 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "ai search lab 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: ai search lab 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "ai search lab 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: ai search lab 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/solution"
				},
				{
					title: "ai search lab 16: Review and Reflection",
					content:
						"Close Applied Studio 14: ai search lab 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "ai search lab 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: ai search lab 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-04-ai-search-lab-16/solution"
				},
				{
					title: "Applied Studio 14: ai search lab 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: ai search lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-11-applied-studio-14-ai-search-lab-16-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-11-applied-studio-14-ai-search-lab-16-supplemental-/solution"
				},
				{
					title: "Applied Studio 14: ai search lab 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: ai search lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-12-applied-studio-14-ai-search-lab-16-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-12-applied-studio-14-ai-search-lab-16-supplemental-/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: ai search lab 17",
			curriculum: [
				{
					title: "ai search lab 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: ai search lab 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "ai search lab 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: ai search lab 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "ai search lab 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: ai search lab 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/solution"
				},
				{
					title: "ai search lab 17: Review and Reflection",
					content:
						"Close Applied Studio 15: ai search lab 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "ai search lab 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: ai search lab 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-05-ai-search-lab-17/solution"
				},
				{
					title: "Applied Studio 15: ai search lab 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: ai search lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-13-applied-studio-15-ai-search-lab-17-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-13-applied-studio-15-ai-search-lab-17-supplemental-/solution"
				},
				{
					title: "Applied Studio 15: ai search lab 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: ai search lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-14-applied-studio-15-ai-search-lab-17-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-14-applied-studio-15-ai-search-lab-17-supplemental-/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: Unbeatable TicTacToe AI 1",
			curriculum: [
				{
					title: "Unbeatable TicTacToe AI 1: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: Unbeatable TicTacToe AI 1, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "Unbeatable TicTacToe AI 1: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: Unbeatable TicTacToe AI 1, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unbeatable TicTacToe AI 1: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: Unbeatable TicTacToe AI 1. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Unbeatable-TicTacToe-AI-1"
				},
				{
					title: "Unbeatable TicTacToe AI 1: Review and Reflection",
					content:
						"Close Applied Studio 16: Unbeatable TicTacToe AI 1 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Unbeatable TicTacToe AI 1: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: Unbeatable TicTacToe AI 1 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI7-Unbeatable-TicTacToe-AI-1"
				},
				{
					title: "Applied Studio 16: Unbeatable TicTacToe AI 1 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: Unbeatable TicTacToe AI 1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-15-applied-studio-16-unbeatable-tictactoe-ai-1-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-15-applied-studio-16-unbeatable-tictactoe-ai-1-supp/solution"
				},
				{
					title: "Applied Studio 16: Unbeatable TicTacToe AI 1 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: Unbeatable TicTacToe AI 1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-16-applied-studio-16-unbeatable-tictactoe-ai-1-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-16-applied-studio-16-unbeatable-tictactoe-ai-1-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: The Marble Game AI(COPY)",
			curriculum: [
				{
					title: "The Marble Game AI(COPY): Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: The Marble Game AI(COPY), define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "The Marble Game AI(COPY): Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: The Marble Game AI(COPY), naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "The Marble Game AI(COPY): Core Project",
					content:
						"Build the central artifact for Applied Studio 17: The Marble Game AI(COPY). Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI(COPY)"
				},
				{
					title: "The Marble Game AI(COPY): Review and Reflection",
					content:
						"Close Applied Studio 17: The Marble Game AI(COPY) by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "The Marble Game AI(COPY): Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: The Marble Game AI(COPY) with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/FAI8-The-Marble-Game-AI(COPY)"
				},
				{
					title: "Applied Studio 17: The Marble Game AI(COPY) supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: The Marble Game AI(COPY). Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-17-applied-studio-17-the-marble-game-ai-copy-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-17-applied-studio-17-the-marble-game-ai-copy-supple/solution"
				},
				{
					title: "Applied Studio 17: The Marble Game AI(COPY) supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: The Marble Game AI(COPY). Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-18-applied-studio-17-the-marble-game-ai-copy-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main/AI-18-applied-studio-17-the-marble-game-ai-copy-supple/solution"
				}
			]
		}
	]
};
