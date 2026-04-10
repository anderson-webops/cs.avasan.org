# Intro to Swift App Development Repo Alignment Plan

## Problem

`intro-to-swift-app-development.ts` does not align closely with `instruction-material/Swift`. The audit found only about 7 matched top-level folders out of 22.

This mismatch is not just a missing-links problem. The repo itself is legacy-oriented, while the live course was already rebuilt around a newer local `SAD1` through `SAD7` structure and the `SADX-SwiftUI-Shapes-Studio` enrichment pack.

Examples still present in the repo but not surfaced in the course:

- `Mod1Pro1`
- `Mod1Pro2`
- `Mod1Pro3`
- `Mod2Pro1`
- `Mod3Pro1`
- `Mod4Pro1`
- `Mod5Pro1`
- `SADX-SwiftUI-Shapes-Studio`
- `legacy`

## Plan

1. Decide the canonical source of truth:
    - migrate the public course to a cleaned and modernized `Swift` repo layout
    - or treat the current `Swift` repo as a legacy archive and publish the newer `SAD*` pack to a dedicated canonical repo
2. Do not blindly add legacy `Mod*` folders to the course. First classify which of them are still pedagogically valuable.
3. Expose `SADX-SwiftUI-Shapes-Studio` intentionally as optional enrichment if it remains part of the active course.
4. Add repo documentation that clearly labels `legacy/` as archive-only material if that path remains.

## Validation

- the Swift course and its linked repo use the same canonical project structure
- legacy module folders are either migrated, archived, or clearly excluded
