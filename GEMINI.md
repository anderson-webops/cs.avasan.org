# cs.avasan.org Workspace Instructions

Follow `AGENTS.md` as the primary repository guidance. These downstream rules
are non-negotiable:

- This is Julio's grade-school classroom, maintained as a deliberate overlay on
  `git@github.com:instruction-material/classes.jacobdanderson.net.git`.
- `origin` is `git@github.com:anderson-webops/cs.avasan.org.git`; `upstream` is
  read-only.
- Adopt upstream work selectively after reviewing both the upstream commits and
  downstream-only changes. Never blindly merge/reset the fork, push to
  `upstream`, or copy upstream tags.
- The only courses are Scratch Levels 1–2, Python Levels 1–2, and PyGames.
- Students access courses and the browser IDE anonymously. Optional,
  Julio-provisioned student accounts may sync Python projects, but never gate
  public material or anonymous browser saves. Students have no email and
  cannot self-register or self-recover; after Julio's one-time setup code they
  may choose a password or connect one Apple or Google identity.
- Julio is the sole Admin and is provisioned only with
  `npm run -w back-end create-admin-ts`. Do not add public account creation,
  another admin, or tutor-role workflows.
- Do not restore scheduler, booking, Zoom, payment, tuition, freelance,
  tutoring-business, intake, or expectation-setting features.
- Use the fork-specific database and secret configuration; never reuse or commit
  upstream credentials or data.

Use npm only. Keep package manifests and lockfiles synchronized, treat root
`npm ci` as the clean-install gate, and do not install dependencies for ordinary
source or documentation edits.

Before committing or pushing code or dependency work, require:

```bash
npm run lint
npm run typecheck
npm run -w front-end test:unit
npm run -w back-end test
npm run build
git diff --check
```

Verify the public five-course catalog, anonymous student access, and Julio-only
Admin boundary whenever affected. Commit each coherent validated change with a
concise present-tense subject and push completed work to `origin`. Create or move
an annotated downstream tag only for an explicit validated release, never as a
routine upstream-sync step.
