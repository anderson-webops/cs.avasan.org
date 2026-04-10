# AP Computer Science A Repo Alignment Plan

## Problem

`ap-computer-science-a.ts` currently exposes only part of the very large `instruction-material/APCS` repo. The audit found about 43 matched folders out of 116.

This is the clearest example of the repo and the live course drifting apart. The repo mixes:

- required course projects
- check-ins
- reference examples
- free-response practice
- alternate practice projects
- starter variants

Examples currently not surfaced in the course:

- `APCS-Check-in-2-Additional-Practice-Project`
- `APCS1-Casting-Reference`
- `APCS1-Strings-and-Printing-Reference`
- `APCS1-Variables-Reference`
- `APCS10-Farm-Class`
- `APCS10-Playlist`
- `APCS11-ArrayList-Reference`
- `APCS11-Card-and-Deck-Classes`
- `APCS11-Free-Response-Practice`

## Plan

1. Treat `APCS` as a mixed-content repo and build an explicit content taxonomy:
    - required AP CSA projects
    - optional reinforcement labs
    - references and examples
    - teacher-side or archive material
2. Expand `ap-computer-science-a.ts` so every required or strongly recommended AP CSA folder is represented.
3. Keep `java-level-1.ts` independent; that course should continue to use `Java-Level-1` as its main repo and only borrow isolated APCS supplemental items where helpful.
4. Add optional-project sections to AP CSA instead of forcing every reference or practice file into the main weekly spine.
5. If the repo is too mixed to surface cleanly, split future AP CSA canonical material into a cleaner repo or clearly document the canonical subfolders.

## Validation

- every required AP CSA folder is visible in the AP course
- references, check-ins, and alternate practice items are either intentionally linked as optional or documented as non-core
- `ap-computer-science-a.ts` and the `APCS` repo no longer feel contradictory
