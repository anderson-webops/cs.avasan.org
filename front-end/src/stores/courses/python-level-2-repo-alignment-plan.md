# Python Level 2 Repo Alignment Plan

## Problem

`python-level-2.ts` is largely aligned to `instruction-material/Python-Level-2`, but it still omits about 8 of the 111 repo folders.

Examples currently not surfaced in the course:

- `PS-Check-in-2`
- `PS15-Battleship`
- `PS15-Farkle`
- `PS15-Simple-RPG`
- `PS15-Tamagotchi`
- `PS15-Trivia-Master`
- `PS15-Trivia-Master-Starter`
- `PS2-For-Loop-Fun-Updated`

## Plan

1. Review the unmatched folders and decide which ones are:
    - real capstone options that should be visible
    - older alternates that should stay repo-side
    - starter duplicates that should collapse into a single canonical project
2. Add optional capstone or game-build sections for the missing `PS15` family if they are still part of the intended Python 2 experience.
3. Keep tiny updated drills like `PS2-For-Loop-Fun-Updated` out of the main spine unless they still matter pedagogically.
4. Clarify repo expectations so `Scratch Level 1` and `Scratch Level 2` do not further blur what belongs to Python 2 proper.

## Validation

- missing Python 2 capstones are either visible in the course or explicitly marked as non-core
- starter/updated duplicates do not masquerade as separate required projects
