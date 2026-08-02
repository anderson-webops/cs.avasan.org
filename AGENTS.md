# cs.avasan.org Repository Guidance

## Purpose and Product Boundary

`cs.avasan.org` is Julio's grade-school computer science classroom. It is a
deliberately simplified downstream adaptation of
`instruction-material/classes.jacobdanderson.net`, not a general tutoring or
freelance-business platform.

Keep these constraints intact:

- The current public catalog contains exactly Scratch Level 1, Scratch Level 2,
  Python Level 1, Python Level 2: Classroom Edition, and PyGames: Classroom
  Edition. The two Classroom Editions use the existing stable course IDs.
- The original Python Level 2 and PyGames curricula may remain visible in a
  separate archived-reference group for Julio. Archived entries are not
  current course offerings and must not be added to student course access.
- Keep the four original activities under `/games` separate from the course
  catalog. Crosswalk Critters, Machine Workshop, and Comet Hopper are
  browser-local and untracked. Pond Paddlers uses only private, Julio-created,
  memory-only rooms lasting no more than two hours, random preset aliases, and
  separate high-entropy seat cookies. Do not add names, free text, chat, public
  lobbies, spectators, persistent scores, account links, or game analytics.
- Within the Avasan sites, Graph Sketcher is hosted only by
  `math.avasan.org`. CS must return `404` for `/graph-sketcher`, the entire
  `/graph-sketcher/` namespace (including stale direct artifacts), and
  `/graph-sketcher.html`, and must not ship its page, runtime, worker, license,
  or project artifacts. The shared aggregate service may retain Math
  `graph-open` counts, but never graph projects or contents.
- Students browse courses and use the browser IDE anonymously. An optional
  student account may sync Python IDE projects, but
  it must never gate course access or anonymous browser saves.
- Student accounts have a username but no email. Julio creates them and issues
  unique, expiring setup codes; students cannot register or recover accounts
  themselves. After consuming the code, a student may choose a password or
  connect exactly one Apple or Google identity. Never match provider identities
  by email or retain provider profile data or tokens.
- Julio is the sole teacher and sole authenticated Admin. His Admin account is
  provisioned only through `npm run -w back-end create-admin-ts`.
- Do not add HTTP Admin creation, additional admins, tutor roles, separate
  tutor/admin workflows, shared class codes, or universal recovery codes.
- Do not restore scheduler, booking, Zoom, tuition, payment, freelance,
  tutoring-business, intake, or expectation-setting flows.

Any change that expands those boundaries requires an explicit product decision.

## Downstream and Git Policy

- `origin` is `git@github.com:anderson-webops/cs.avasan.org.git`; commit and push
  completed downstream work there.
- `upstream` is
  `git@github.com:instruction-material/classes.jacobdanderson.net.git`; treat it
  as a read-only source of selected changes.
- Preserve this repository as a deliberate Julio-specific overlay. Before an
  upstream sync, inspect the target commits and the downstream-only diff, then
  replay or adapt only compatible changes.
- Never blindly merge, reset, rebase, or replace the downstream branch with
  upstream. Never push downstream work to `upstream`.
- Do not import or recreate upstream tags during a sync. Create or move an
  annotated downstream semver tag only for an explicit, validated release, and
  verify the tag, release, and commit all point to the same revision.
- Preserve unrelated work already present in the working tree.

After a coherent change is complete and validated, commit it with a concise,
present-tense subject and push it to `origin`. Do not leave completed work
uncommitted unless the user asks you to.

## Repository Shape

- `front-end/`: Vue 3/Vite SSG public course site, browser IDE, and games.
- `back-end/`: Express/Mongoose service for Julio's private Admin session.
- `front-end/test/` and `back-end/test/`: Vitest suites.
- Root configuration controls shared TypeScript, ESLint, workspaces, and builds.

Keep public course delivery independent of student identity. Store student
credentials only as hashes, keep Julio-issued access codes unique and limited
to initial setup, store only a hash of an opaque Google or Apple subject when a
student chooses provider sign-in, and preserve anonymous browser projects until
a student explicitly chooses to import them. Use the fork-specific
`cs-avasan-org` database, environment variables or the configured Vault path
for secrets, and never reuse or commit upstream credentials or data.

## Dependency and Lockfile Discipline

- Use the repository's pinned npm toolchain; do not mix package managers.
- Treat root `npm ci` as the clean-install source of truth.
- When dependencies change, update the relevant manifest and lockfile together.
  Keep the root and backend lockfiles consistent with their manifests; never
  hand-edit dependency resolutions.
- Do not run install/update commands merely for source or documentation edits.
  If dependencies or lockfiles change, run root `npm ci` and `npm audit` before
  committing. Never commit dependency changes while the clean install fails.

## Required Validation

Before committing or pushing code or dependency changes, run:

```bash
npm run lint
npm run typecheck
npm run -w front-end test:unit
npm run -w back-end test
npm run build
git diff --check
```

Run relevant browser/accessibility checks for affected user flows. For
documentation-only work, at minimum review the rendered text, confirm repository
facts against the live checkout, and run `git diff --check`.

Validation must specifically confirm that the five current public courses,
separate archived references, anonymous course/IDE access, optional student
project sync, Julio-only Admin boundary, retained Math-only aggregate Graph
counts, and the absence of every CS Graph Sketcher route and runtime remain
intact.
