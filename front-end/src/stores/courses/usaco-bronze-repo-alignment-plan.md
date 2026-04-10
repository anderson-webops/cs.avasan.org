# USACO Bronze Repo Alignment Plan

## Problem

`usaco-bronze.ts` currently names only about 15 of the 126 top-level folders in `instruction-material/USACO-Bronze`.

Right now the live course reads like a curated representative syllabus, while the repo looks like a much fuller contest bank with both Python and Java variants. The result is that the course appears incomplete relative to the repo.

Examples currently not surfaced in the course:

- `UB11-Mixing-Milk`
- `UB13-Combination-Lock`
- `UB14-Prime-Cryptarithm`
- `UB15-Ski-Course-Design`
- `UB17-Block-Game`
- `UB18-The-Cow-Signal`
- `UB19-Dont-Be-Last`
- `UB20-Hoof-Paper-Scissors`
- `UB21-Cow-Tipping`
- `UB22-Why-Did-the-Cow-Cross-the-Road`
- plus the parallel `-Java` versions for many of the same problems

## Plan

1. Decide the public policy for USACO repo exposure:
    - full visible problem bank
    - curated core sequence plus optional problem library
2. Group repo folders by canonical problem rather than by raw folder count so Python and Java variants do not appear as duplicate first-class lessons.
3. Expand `usaco-bronze.ts` to cover the missing canonical Bronze problems, at least as optional or extension entries.
4. Add language notes so students can choose Python or Java without the course looking duplicated.
5. If the repo remains much larger than the course spine, add a dedicated optional problem-bank section instead of pretending the extra material does not exist.

## Validation

- every canonical Bronze problem present in the repo is either linked from the course or intentionally marked as outside the main syllabus
- Python and Java variants are normalized under one problem entry where appropriate
