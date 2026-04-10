# Workspace Instructions

## Lockfiles, Commits, Tags, And Releases
- Do not leave completed work uncommitted. After each coherent, validated change set, create a commit and push it in the same session.
- Use multiple commits and pushes when that keeps unrelated changes, partial validations, or follow-up fixes clearly separated. Prefer small, logically grouped commits over one mixed commit.
- Keep both `package-lock.json` and `back-end/package-lock.json` synchronized before every commit or push.
- Use lowercase annotated semver tags only. Do not invent ad-hoc labels such as `V1`, `torca-r07`, `pre-lfs-migration-*`, or similar one-off names.
- This repo follows the stable `v2.x` line. Stay on `v2` for routine work; only cut `v3` for an intentional breaking application or API change.
- Before creating a new tag, check the latest tag in the active semver line and decide whether the new commit is still the same release milestone. If it is, move that existing tag forward to the new validated commit instead of minting a new version number.
- Keep the GitHub release aligned with that decision: when the commit still belongs to the same milestone, update or recreate the existing release so it points at the moved tag/current commit; only create a brand-new release when the change creates a genuinely new milestone.
- Cut a fresh semver tag and release only when the work crosses a real release boundary, such as a new deployable milestone, a materially different operator/user-facing state, or a version-line change that deserves its own notes and rollback point.
- Create an annotated tag when a deployable course-catalog, front-end UX, back-end API, health/deploy, performance, or security change is ready to ship.
- Create a GitHub release when that tag represents a real site milestone for users, admins, or operators. Release notes should summarize scope, validation, rollout notes, and any migration or recovery steps.
- If the existing tag or release history contains stale drafts, redundant entries, or ad-hoc labels, clean that history up instead of preserving clutter.
- Skip tags and releases for trivial doc-only edits, formatting-only changes, or routine housekeeping unless they change deployment, operations, or a consumer-facing contract.

## Downstream Sync Workflow
- This repository is a curated downstream of `anderson-webops/classes.jacobdanderson.net`. Treat the downstream tree as authoritative for public student-facing content and design separation.
- Keep `origin` pointed at `instruction-material/classes.jacobdanderson.net` and keep an `upstream` remote pointed at `anderson-webops/classes.jacobdanderson.net` for selective sync work.
- Prefer selective imports of reusable material only: course catalog files under `front-end/src/stores/courses/`, generalized course-library UI, neutral docs, and other content that students or instructors can use directly.
- Do not wholesale merge upstream backend, auth, payment, admin, personal contact, scheduling, or other implementation-specific operational content unless it is intentionally generalized first.
- For a course-content-only sync, use this sequence: `git fetch upstream`, inspect candidate changes, port only the generalized material, validate the downstream site, then commit and push the content change.
- If GitHub fork comparison still shows the downstream branch as behind after a selective sync, record upstream ancestry with `git merge -s ours --no-ff upstream/main -m "Record upstream main as merged"` so the downstream tree stays unchanged while upstream history becomes reachable.
- Use the `-s ours` merge only as bookkeeping after the desired content has already been imported. It is not a substitute for reviewing and selectively syncing the actual material.
