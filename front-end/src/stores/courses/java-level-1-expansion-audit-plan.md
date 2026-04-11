# Java Level 1 Expansion Audit Plan

## Current State Snapshot

- Course file: `front-end/src/stores/courses/java-level-1.ts`
- Mapped repository: `Java-Level-1`
- Mapped repository link: https://github.com/instruction-material/Java-Level-1
- Instruction-Material local inventory: 50 visible top-level directories, 0 top-level files
- Module count: 11
- Curriculum entry count: 76
- `projectLink` count: 4
- `solutionLink` count: 53
- Repo folder overlap: 48/50 (96%) of top-level repo folders appear in catalog links.
- Top-level repo folders detected from links: 49 across 2 repo(s)
- Representative linked folders: JS-Check-in-1-Additional-Project, JS-Check-in-1-Additional-Project-Starter, JS1-Casting-Reference, JS1-Chatbot, JS1-Division-Facts, JS1-First-Middle-Last, JS1-Mad-Libs, JS1-Primitives, JS2-Math-Operators-Reference, JS2-Rainbow, JS2-Snowman, JS2-Temperature-Converter

## Audit Findings

1. Catalog parity check indicates 11 module headers and 76 curriculum entries; confirm each has deliberate sequencing and completion criteria.
2. Starter/solution balance is uneven: `projectLink` count is 4 while `solutionLink` count is 53.
3. Link labels should consistently indicate requirement level (required, check-in, stretch, enrichment) before they become discoverability debt.
4. The course should document where source folders map to each lesson so instructors can verify no required work is omitted.

### Expansion Plan

#### Phase 1: Source alignment
- Reconcile catalog modules against `Java-Level-1` and confirm linkable starter/solution sources.
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

