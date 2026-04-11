# Java Level 3 Expansion Audit Plan

## Current State Snapshot

- Course file: `front-end/src/stores/courses/java-level-3.ts`
- Mapped repository: `Java-Level-3`
- Mapped repository link: https://github.com/instruction-material/Java-Level-3
- Instruction-Material local inventory: 88 visible top-level directories, 1 top-level files
- Module count: 22
- Curriculum entry count: 142
- `projectLink` count: 29
- `solutionLink` count: 56
- Repo folder overlap: 84/88 (95%) of top-level repo folders appear in catalog links.
- Top-level repo folders detected from links: 85 across 2 repo(s)
- Representative linked folders: AJ-Check-In-1, AJ-Check-In-1-Additional-Practice-Project, AJ-Check-In-1-Starter, AJ-Check-In-2, AJ-Check-In-2-Additional-Practice-Project, AJ-Check-In-2-Starter, AJ-Check-In-3, AJ-Check-In-3-Additional-Practice-Project, AJ-Check-In-3-Additional-Practice-Project-Starter, AJ-Check-In-4-Additional-Practice-Project, AJ-Check-in-4, AJ1-Chatbot

## Audit Findings

1. Catalog parity check indicates 22 module headers and 142 curriculum entries; confirm each has deliberate sequencing and completion criteria.
2. Starter/solution balance is uneven: `projectLink` count is 29 while `solutionLink` count is 56.
3. Link labels should consistently indicate requirement level (required, check-in, stretch, enrichment) before they become discoverability debt.
4. The course should document where source folders map to each lesson so instructors can verify no required work is omitted.

### Expansion Plan

#### Phase 1: Source alignment
- Reconcile catalog modules against `Java-Level-3` and confirm linkable starter/solution sources.
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

