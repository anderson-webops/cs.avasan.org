# cs.avasan.org

`cs.avasan.org` is Julio's grade-school computer science course site. It is a
deliberately simplified downstream adaptation of
[`instruction-material/classes.jacobdanderson.net`](https://github.com/instruction-material/classes.jacobdanderson.net).

## Product Scope

- Julio is a grade-school teacher and the site's sole teacher/administrator.
- Students browse course material anonymously. They do not need, and cannot
  create, site accounts.
- Julio's account is provisioned through the repository's code-based setup
  process. Public account creation must remain disabled.
- The course catalog contains only Scratch Levels 1 and 2, Python Levels 1 and
  2, and PyGames.
- The site does not provide tutoring-business, freelance, tuition, booking,
  scheduler, or Zoom workflows.

## Repository Layout

- `front-end/` contains the Vue 3 and Vite SSG course site and browser-based
  Python IDE.
- `back-end/` contains the small Express and MongoDB service used for Julio's
  private account.
- `HEALTHCHECKS.md` documents service health and readiness endpoints.

## Access Model

Course pages and the Python IDE are public. Anonymous IDE projects stay in the
student's browser. Teacher-only capabilities are unlocked by Julio's
code-provisioned account; there is no learner or self-service registration
flow.

Do not add a second teacher account or re-enable public registration without an
explicit product decision.

### Provision Julio

Use a new, empty `cs-avasan-org` MongoDB database. After setting
`MONGODB_URI` in an ignored backend environment file, run:

```bash
npm run -w back-end create-admin-ts
```

The setup prompts for Julio's email and password, fixes the display name to
`Julio`, requires a password of at least 14 characters, and refuses to create a
second teacher account. Never reuse the upstream site's database.

## Downstream Policy

This repository keeps two remotes with distinct purposes:

- `origin` is `git@github.com:anderson-webops/cs.avasan.org.git` and is the
  downstream deployment repository.
- `upstream` is
  `git@github.com:instruction-material/classes.jacobdanderson.net.git` and is
  read as the source project.

Keep the Julio-specific product changes as a deliberate downstream overlay.
When adopting upstream work:

1. Fetch and inspect the desired upstream commits.
2. Replay or adapt only the changes that fit this site's narrow course and
   access model.
3. Validate the public catalog, anonymous IDE, and Julio-only account boundary.
4. Push downstream work only to `origin`.

Do not blindly reset or merge the downstream branch to upstream, and do not
push downstream changes to the upstream repository.

## Common Commands

```bash
npm run dev
npm run server
npm run typecheck
npm run lint
npm run build
```

The normal build downloads the inherited Python/PyGames asset archive. For an
offline application-only validation, use
`PYTHON_IDE_ASSETS_DOWNLOAD=skip npm run build`; that verifies both workspaces
but intentionally omits the optional IDE asset pack.

The root `package-lock.json` is the authoritative lockfile. Use environment
variables for session and database secrets, and never commit credentials.
Leave `TRUST_PROXY_HOPS` unset unless the API is exclusively behind a known
proxy chain that replaces incoming forwarding headers. Database diagnostics
always require `INTERNAL_DIAGNOSTICS_KEY`, including during local development.

The static front-end is deployable independently, but teacher login additionally
requires the Express API and an `/api/*` route to that service. The course build
continues to use the inherited Python asset archive until an equivalent archive
is published and verified at `static.cs.avasan.org`.
