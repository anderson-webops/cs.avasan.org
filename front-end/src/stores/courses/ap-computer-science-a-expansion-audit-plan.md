# AP Computer Science A Expansion Audit Plan

## Current State Snapshot

- Course file: `front-end/src/stores/courses/ap-computer-science-a.ts`
- Mapped repository: `APCS`
- Mapped repository link: https://github.com/instruction-material/APCS
- Instruction-Material local inventory: 116 visible top-level directories, 1 top-level files
- Module count: 11
- Curriculum entry count: 43
- `projectLink` count: 2
- `solutionLink` count: 1
- Repo folder overlap: 0/116 (0%) of top-level repo folders appear in catalog links.
- Top-level repo folders detected from links: 0 across 0 repo(s)
- Representative linked folders: No overlap detected yet.

## Audit Findings

1. Catalog parity check indicates 11 module headers and 43 curriculum entries; confirm each has deliberate sequencing and completion criteria.
2. Starter/solution balance is uneven: `projectLink` count is 2 while `solutionLink` count is 1.
3. Link labels should consistently indicate requirement level (required, check-in, stretch, enrichment) before they become discoverability debt.
4. The course should document where source folders map to each lesson so instructors can verify no required work is omitted.

### Expansion Plan

#### Phase 1: Source alignment
- Reconcile catalog modules against `APCS` and confirm linkable starter/solution sources.
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

