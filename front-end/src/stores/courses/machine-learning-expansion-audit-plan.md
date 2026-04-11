# Machine Learning Expansion Audit Plan

## Current State Snapshot

- Course file: `front-end/src/stores/courses/machine-learning.ts`
- Mapped repository: `Not mapped`
- Mapped repository link: No dedicated repository tracked in Instruction-Material
- Instruction-Material local inventory: No repository mapping yet. Review local Instruction-Material structure.
- Module count: 11
- Curriculum entry count: 53
- `projectLink` count: 12
- `solutionLink` count: 12
- Repo folder overlap: N/A (repository not mapped)
- Top-level repo folders detected from links: 20 across 1 repo(s)
- Representative linked folders: N/A

## Audit Findings

1. Catalog parity check indicates 11 module headers and 53 curriculum entries; confirm each has deliberate sequencing and completion criteria.
2. Starter/solution balance is uneven: `projectLink` count is 12 while `solutionLink` count is 12.
3. Link labels should consistently indicate requirement level (required, check-in, stretch, enrichment) before they become discoverability debt.
4. The course should document where source folders map to each lesson so instructors can verify no required work is omitted.
5. No verified source repository exists for deterministic starter/solution parity review.

### Expansion Plan

#### Phase 1: Source alignment
- Reconcile catalog modules against `(mapped candidate)` and confirm linkable starter/solution sources.
- Add milestone checks after each 3-4 modules with explicit deliverables.
- Add one synthesis project per quarter that forces reuse across multiple earlier modules.
- Add 1-2 optional stretch tracks for students who finish early with enrichment prompts.
- Add experiment-based checkpoints with small dataset changes and interpretation prompts.
- Add reproducibility notes (expected outputs, seeds, assumptions) in every major project.
- Add a capstone where students create one clean notebook/report pipeline.
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

