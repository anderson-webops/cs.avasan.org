# Shared workspace layout sync

Date: October 7, 2026.

## Source and applicability

- Downstream starting revision: fb45b78c3309333bd276ad2ab8563f85afbeaf2c.
- Shared layout source: Classes revision 63cf37f87a51bc2fdb9631e92695e62a60f4f83f.
- The neutral instructor fork subsequently published the same reviewed overlay
  over 6c52e758a3059c6213db525074def0779fbfa994 at
  0278d1e29aa284a4f6246f4daa295545042282c0. It was not replaced by this sync.
- This is a selective CS adaptation, not a merge of tutoring or instructor
  account workflows. Existing course IDs, anonymous access, private teacher
  authorization, student retention controls, and solution privacy are unchanged.

## Shared presentation

The course reader uses Projects, Supplemental Projects, and Learn views.
Assignments stay in cards; objectives and concepts appear in Learn, while
optional work and notes have secondary styling. An activity's only task stays
beside its completion evidence. Bookmarks, aliases, search, keyboard focus,
mobile lesson navigation, and accessible code/resource previews are preserved.

Math and CS carry equivalent shared lesson-presentation modules, view selection,
assignment cards, toggle controls, and course-reader styles. Their data stores,
resource policy, identity models, and product-specific modules remain separate.

The teacher workspace shows one selected student and one workspace mode at a
time. Switching students dismisses credential and destructive-action controls.
Account creation, teacher-password verification, preservation holds, pending
removal restrictions, and private reports retain their existing authorization.

Existing compact IDE controls, local/account saves, settings ZIP download,
console focus, Tab-at-cursor behavior, and Turtle/PyGame runtime fixes remain.
Graph Sketcher stays absent from all CS pages and generated artifacts.

## Verification and rollout

- Lint, frontend/backend typechecking, frontend/backend suites, and production
  build are required before publication.
- Regression coverage includes view switching, bookmarked aliases, module/search
  transitions, preserving the activity prompt, single-student credential views,
  clearing sensitive controls on student changes, and teacher workspace modes.
- Generated build checks retain the five current courses, archived references,
  anonymous IDE access, exact Scratch solution policy, and no-Graph boundary.
- Local desktop/phone previews check visible course content and compact chrome.
- The starter smoke check now uses the upstream bounded first-frame wait:
  "Game running" establishes runtime readiness, not that the browser has
  painted yet. It still fails if the canvas never changes and still verifies
  that Stop freezes further drawing. No fixture or runtime isolation contract
  from another account model is imported into this fork.
- Dependencies and both lockfiles are unchanged; existing matching dependency
  trees were reused. Hosted CI provides the clean-install gate.
- No production activation, emails, database writes, credential changes, or
  deployment-policy changes are part of this source sync.

No migration is needed. Roll back via a separately validated source revert or
preserve the prior release artifact through the existing native operator flow.
