# Java Level 2 Expansion Audit Plan

## Current State Snapshot

- Course file: `front-end/src/stores/courses/java-level-2.ts`
- Mapped repository: `Java-Level-2`
- Mapped repository link: https://github.com/instruction-material/Java-Level-2
- Instruction-Material local inventory: 51 visible top-level directories, 0 top-level files
- Module count: 13
- Curriculum entry count: 66
- `projectLink` count: 15
- `solutionLink` count: 30
- Repo folder overlap: 45/51 (88%) of top-level repo folders appear in catalog links.
- Top-level repo folders detected from links: 45 across 1 repo(s)
- Representative linked folders: JM-Check-in-1, JM-Check-in-1-Additional-Project, JM-Check-in-2-Additional-Project, JM-Check-in-2-Starter-Updated, JM-Check-in-2-Updated, JM-Java-File-IO, JM-Java-HashMaps-Examples, JM-stdinstdout, JM1-Dog-Class, JM1-Dog-Class-Test, JM1-Supplemental-Project-1-Employee, JM10_TicTacToeConsole

## Audit Findings

1. Catalog parity check indicates 13 module headers and 66 curriculum entries; confirm each has deliberate sequencing and completion criteria.
2. Starter/solution balance is uneven: `projectLink` count is 15 while `solutionLink` count is 30.
3. Link labels should consistently indicate requirement level (required, check-in, stretch, enrichment) before they become discoverability debt.
4. The course should document where source folders map to each lesson so instructors can verify no required work is omitted.

### Expansion Plan

#### Phase 1: Source alignment
- Reconcile catalog modules against `Java-Level-2` and confirm linkable starter/solution sources.
- Add milestone checks after each 3-4 modules with explicit deliverables.
- Add one synthesis project per quarter that forces reuse across multiple earlier modules.
- Add 1-2 optional stretch tracks for students who finish early with enrichment prompts.
- Add a short concept bridge block when transitioning between syntax families.
- Add parity drills that compare old and new syntax patterns side by side.
- Add one capstone project where syntax, structure, and testing are all assessed together.
#### Phase 2: Learning sequence growth
- Add checkpoints (formative and summative) after each major section of the course.
- Add one remediation lane and one enrichment lane for students who are behind or ahead.
- Add a project taxonomy by skill level: foundational, applied, extension.
#### Phase 3: UX and governance
- Standardize all lesson-linked projects with the same button-based presentation patterns.
- Add explicit prerequisite notes when jumping between languages or abstraction layers.
- Add a maintenance note block so future contributors can update links and content without guessing.

## Suggested 60-day backlog

- Week 1–2: inventory and map every existing repo folder to a module or mark as intentionally omitted.
- Week 3–4: add starter/solution parity for required work and resolve missing link targets.
- Week 5–8: add checkpoints, remediation paths, and stretch modules in highest-impact chapters.

