# AI Level 1 Expansion Plan

## Setup and Tooling

Preferred IDEs: `PyCharm` or `VS Code`.

Official links:

- [PyCharm install guide](https://www.jetbrains.com/help/pycharm/installation-guide.html)
- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code Python guide](https://code.visualstudio.com/docs/languages/python)
- [Python downloads](https://www.python.org/downloads/?m=landing)

macOS walkthrough:

1. Install Python 3 from python.org.
2. Install PyCharm or VS Code.
3. If using VS Code, install the `Python` and `Jupyter` extensions.
4. Create a virtual environment with `python3 -m venv .venv`.
5. Activate it and install starter packages such as `jupyter`, `matplotlib`, and `networkx`.

Windows walkthrough:

1. Install Python 3 from python.org and enable `Add Python to PATH`.
2. Install PyCharm or VS Code.
3. If using VS Code, install the `Python` and `Jupyter` extensions.
4. Create a virtual environment with `py -m venv .venv`.
5. Activate it and install `jupyter`, `matplotlib`, and `networkx`.

Course-specific notes:

- This course benefits from notebooks for search visualizations and small AI demos.
- If projects become game-like, add `pygame-ce` later instead of at initial setup.

## Positioning

AI Level 1 should be a bridge between core programming and model-centric
machine learning. It should build intuition about intelligent systems, search,
rules, data representation, and simple project design without depending on
heavy math too early.

## Current Direction to Strengthen

- Add more projects
- Make the course feel like a real bridge into AI/ML instead of a thin intro
- Reuse Python skills while introducing new ways to think

## Core Outcomes

- Explain what AI is and what it is not
- Represent knowledge in simple program structures
- Build rule-based and search-based toy AI systems
- Understand data features, labels, and simple evaluation
- Prepare for later ML work

## Recommended Structure

### Unit 1: AI Landscape and History

- rules
- search
- planning
- machine learning
- generative systems

### Unit 2: State, Goals, and Search

- graph search
- BFS and DFS intuition
- shortest path thinking

### Unit 3: Rule-Based Systems

- decision logic
- simple expert systems
- knowledge representation

### Unit 4: Heuristics and Game AI

- heuristic evaluation
- turn-based toy games
- greedy vs exhaustive thinking

### Unit 5: Intro Data and Features

- what features are
- turning messy input into structured representation

### Unit 6: Simple Classification Concepts

- labels
- decision boundaries
- nearest-neighbor intuition

### Unit 7: Responsible AI and Evaluation

- bias
- failure cases
- benchmarks
- what "works" means in practice

### Unit 8: Capstone Projects

- choose one toy AI path and build a portfolio project

## Example Project Outlines

- Maze solver visualizer
- Tic-tac-toe or Connect Four heuristic player
- Rule-based recommendation engine
- Chatbot with state tracking and intent routing
- Mini fraud detector using hand-built features

## Expansion Ideas

- Add more visual search projects
- Add reinforcement-learning-flavored toy environments
- Add a stronger bridge to decision trees and classification
- Add project videos and walkthroughs for every unit
