# USACO Gold Expansion Audit Plan

## Current State Snapshot

- Course file: `front-end/src/stores/courses/usaco-gold.ts`
- Mapped repository: `USACO-Gold`
- Mapped repository link: https://github.com/instruction-material/USACO-Gold
- Instruction-Material local inventory: 46 visible top-level directories, 1 top-level files
- Module count: 9
- Curriculum entry count: 37
- `projectLink` count: 2
- `solutionLink` count: 0
- Repo folder overlap: 0/46 (0%) of top-level repo folders appear in catalog links.
- Top-level repo folders detected from links: 0 across 0 repo(s)
- Representative linked folders: No overlap detected yet.

## Audit Findings

1. Catalog parity check indicates 9 module headers and 37 curriculum entries; confirm each has deliberate sequencing and completion criteria.
2. Starter/solution balance is uneven: `projectLink` count is 2 while `solutionLink` count is 0.
3. Link labels should consistently indicate requirement level (required, check-in, stretch, enrichment) before they become discoverability debt.
4. The course should document where source folders map to each lesson so instructors can verify no required work is omitted.

### Expansion Plan

#### Phase 1: Source alignment
- Reconcile catalog modules against `USACO-Gold` and confirm linkable starter/solution sources.
- Add milestone checks after each 3-4 modules with explicit deliverables.
- Add one synthesis project per quarter that forces reuse across multiple earlier modules.
- Add 1-2 optional stretch tracks for students who finish early with enrichment prompts.
- Add complexity reasoning checkpoints for each algorithmic family.
- Add one performance-focused implementation optimization lab after each major unit.
- Add structured reflection prompts on trade-offs between correctness, speed, and memory.
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

