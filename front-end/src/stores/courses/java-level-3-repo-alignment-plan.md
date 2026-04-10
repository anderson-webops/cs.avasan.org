# Java Level 3 Repo Alignment Plan

## Problem

`java-level-3.ts` is close to the `instruction-material/Java-Level-3` repo, but it still omits about 12 of the 88 repo folders.

Examples currently not surfaced in the course:

- `AJ-Check-In-3-Starter`
- `AJ-Check-in-4-Starter`
- `AJ10-Exceptions`
- `AJ10-Nested-Classes`
- `AJ10-Node-Class`
- `AJ15-Open-Addressing-Reference`
- `AJ15-Separate-Chaining-Hash-Table`
- `AJ17-Google-Maps`
- `AJ17-Master-Project-Starter`
- `AJ17-Street-Searcher-Starter`

## Plan

1. Separate the unmatched repo folders into starter-only assets, references, and real missing project coverage.
2. Add any missing advanced Java topics that materially belong in the course, especially if they support the data-structures and capstone sequence.
3. Keep pure starter folders and hash-table references from cluttering the course unless they are presented as optional scaffolds.
4. Decide whether `AJ17` material should become a visible capstone branch or remain repo-side support material.

## Validation

- the advanced Java course and repo agree on the intended capstone/data-structures arc
- reference implementations and starters are intentionally classified rather than silently omitted
