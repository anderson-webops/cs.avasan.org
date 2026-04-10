# USACO Gold Repo Alignment Plan

## Problem

`usaco-gold.ts` currently names only about 22 of the 46 top-level folders in `instruction-material/USACO-Gold`.

The repo contains a larger Gold problem bank than the current course reveals, which makes the live course look only partially wired to the available material.

Examples currently not surfaced in the course:

- `UG1-Dynamic-Programming-Practice`
- `UG1-Hoof-Paper-Scissors`
- `UG10-Roadblock`
- `UG12-Why-Did-the-Cow-Cross-the-Road`
- `UG13-Cow-Routing`
- `UG14-MST-II`
- `UG15-Superbull`
- `UG16-Watering-the-Fields`
- `UG18-I-Would-Walk-500-Miles`
- `UG20-Fenced-In`

## Plan

1. Decide whether Gold should function as:
    - a selective advanced sequence
    - or a course plus optional full problem bank
2. Expand `usaco-gold.ts` so the omitted dynamic-programming, MST/graph, shortest-path, and advanced greedy problems are discoverable.
3. Normalize the course around technique families rather than a thin sample of the repo.
4. Keep the public spine readable, but add an explicit optional-problems section if the repo is intentionally broader than the core teaching sequence.

## Validation

- Gold-level repo material is no longer mostly invisible from the course definition
- the course explains which repo problems are core, extension, or archive
