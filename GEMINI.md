# Workspace Instructions

## Local Course Material Paths
- Place local starter/solution packs and source course working folders under `/Users/jacobanderson/Documents/Work/Juni`, not under `/Users/jacobanderson/Work/Juni`.
- Prefer the existing top-level course folder layout there, including names such as `Low Level Security`, `Intro to Swift App Development`, `Linux Systems`, and `Web Development Foundations`, unless the user asks for a different local structure.

## Lockfiles, Commits, Tags, And Releases
- Do not leave completed work uncommitted. After each coherent, validated change set, create a commit and push it in the same session.
- Use multiple commits and pushes when that keeps unrelated changes, partial validations, or follow-up fixes clearly separated. Prefer small, logically grouped commits over one mixed commit.
- Keep both `package-lock.json` and `back-end/package-lock.json` synchronized before every commit or push.
- Use lowercase annotated semver tags only. Do not invent ad-hoc labels such as `V1`, `torca-r07`, `pre-lfs-migration-*`, or similar one-off names.
- This repo follows the stable `v2.x` line. Stay on `v2` for routine work; only cut `v3` for an intentional breaking application or API change.
- Create an annotated tag when a deployable course-catalog, front-end UX, back-end API, health/deploy, performance, or security change is ready to ship.
- Create a GitHub release when that tag represents a real site milestone for users, admins, or operators. Release notes should summarize scope, validation, rollout notes, and any migration or recovery steps.
- If the existing tag or release history contains stale drafts, redundant entries, or ad-hoc labels, clean that history up instead of preserving clutter.
- Skip tags and releases for trivial doc-only edits, formatting-only changes, or routine housekeeping unless they change deployment, operations, or a consumer-facing contract.
