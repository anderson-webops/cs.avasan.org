# Instruction-Material Repo Alignment Audit

This audit identifies courses where the public catalog currently exposes only part of the material that exists in the corresponding `instruction-material` repo.

The comparison used a practical heuristic:

- find every course file in `front-end/src/stores/courses/*.ts` that references `https://github.com/instruction-material/...`
- compare the referenced course file text against the top-level directory names in the matching local repo clone under `/Users/jacobanderson/Documents/Work/Instruction-Material`
- flag courses where the repo contains materially more project folders than the live course currently names or links

This is not a final curriculum judgment by itself. Some missing repo folders are valid exclusions because they are:

- duplicates
- starter-only or solution-only variants
- legacy or archive material
- references rather than student projects
- language variants that should remain optional

The goal of the follow-up plans is to decide that explicitly instead of leaving the mismatch ambiguous.

## Courses That Need Repo-Alignment Follow-Up

- `AI Level 1`: 28 matched repo folders out of 37
- `Machine Learning`: 22 matched repo folders out of 33
- `AP Computer Science A`: 43 matched repo folders out of 116 across the shared `APCS` repo
- `C++ Level 1`: 38 matched repo folders out of 45
- `Java Level 2`: 40 matched repo folders out of 51
- `Java Level 3`: 76 matched repo folders out of 88
- `Python Level 1`: 115 matched repo folders out of 224
- `Python Level 2`: 103 matched repo folders out of 111
- `Python Level 3`: 51 matched repo folders out of 63
- `Intro to Swift App Development`: 7 matched repo folders out of 22 in the legacy `Swift` repo
- `USACO Bronze`: 15 matched repo folders out of 126
- `USACO Silver`: 18 matched repo folders out of 46
- `USACO Gold`: 22 matched repo folders out of 46

## Courses That Already Look Aligned

These courses did not show the same problem in the audit and do not currently need separate repo-alignment plans:

- `Assembly`
- `C Systems Engineering`
- `Data Science in Python`
- `Data Structures and Algorithms in C++`
- `Design Patterns in C++`
- `Java Level 1` against `Java-Level-1`
- `Linux Systems`
- `Low Level Security`
- `Low Level Security Part 2`
- `Network Security`
- `Network Systems`
- `PyGames`
- `Web Development Foundations`

## Follow-Up Files

- `ai-level-1-repo-alignment-plan.md`
- `machine-learning-repo-alignment-plan.md`
- `ap-computer-science-a-repo-alignment-plan.md`
- `cpp-level-1-repo-alignment-plan.md`
- `java-level-2-repo-alignment-plan.md`
- `java-level-3-repo-alignment-plan.md`
- `python-level-1-repo-alignment-plan.md`
- `python-level-2-repo-alignment-plan.md`
- `python-level-3-repo-alignment-plan.md`
- `intro-to-swift-app-development-repo-alignment-plan.md`
- `usaco-bronze-repo-alignment-plan.md`
- `usaco-silver-repo-alignment-plan.md`
- `usaco-gold-repo-alignment-plan.md`
