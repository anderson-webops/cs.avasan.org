# AI Level 1 Repo Alignment Plan

## Problem

`ai-level-1.ts` currently names about 28 of the 37 top-level folders in `instruction-material/AI-Level-1`.

The main unresolved gap is not the core course spine. It is the leftover cluster of auxiliary class examples, stack and graph demos, and alternate game projects that still exist in the repo but are not explained in the live course.

Examples currently not surfaced in the course:

- `FAI-Special-Graphs`
- `FAI-Stacks`
- `FAI1-BankAccount-Class`
- `FAI5-DFS-With-a-Stack-Class`
- `FAI6-BFS-With-a-Queue-Class`
- `FAI7-Unbeatable-TicTacToe-AI-1`
- `FAI7-Updated-TicTacToe-AI`
- `FAI8-2-Player-Marble-Game`
- `FAI8-The-Marble-Game-AI(COPY)`

## Plan

1. Audit the unmatched repo folders into three buckets:
    - real missing student projects
    - optional reinforcement or reference demos
    - duplicate, outdated, or copy folders that should stay hidden or be cleaned from the repo
2. Expand `ai-level-1.ts` only for the first two buckets.
3. Keep the live course focused on search, game trees, heuristics, and graph reasoning instead of dumping every historical experiment into the syllabus.
4. If multiple Tic-Tac-Toe or Marble Game variants are still useful, expose only one canonical required version and one optional extension.
5. Add a short repo README section mapping hidden legacy folders to their disposition so the repo and course do not drift again.

## Validation

- every retained instructional folder in `AI-Level-1` is either linked in `ai-level-1.ts` or explicitly marked optional/archive
- no `COPY`, duplicate, or superseded folder is presented as the canonical student project
