# USACO Silver Repo Alignment Plan

## Problem

`usaco-silver.ts` currently names only about 18 of the 46 top-level folders in `instruction-material/USACO-Silver`.

The repo contains a broader Silver problem bank than the course currently exposes, so the public course looks like a partial sampling rather than a coherent map of the available material.

Examples currently not surfaced in the course:

- `US-Berry-Picking`
- `US11-Superprime-Rib`
- `US12-Floodfill`
- `US13-The-Castle`
- `US15-Sorting-a-Three-Valued-Sequence`
- `US16-Healthy-Holsteins`
- `US17-Hamming-Codes`
- `US19-Cities-and-States`
- `US20-Moocast`
- `US21-Priority-Queues`

## Plan

1. Decide whether the Silver course should expose:
    - a full problem-bank view
    - or a curated required track plus optional contest-library section
2. Expand `usaco-silver.ts` so the missing canonical Silver topics are at least discoverable from the course page.
3. Organize by technique families such as flood fill, greedy, binary search, graph reachability, sorting, and prefix-style reasoning.
4. Keep the main learning sequence coherent, but stop hiding large portions of the repo inventory.

## Validation

- the Silver course maps cleanly onto the repo’s real set of canonical problems
- missing repo problems are either surfaced or explicitly classified as outside the public course
