# cs.avasan.org

`cs.avasan.org` is Julio's grade-school computer science course site. It is a
deliberately simplified downstream adaptation of
[`instruction-material/classes.jacobdanderson.net`](https://github.com/instruction-material/classes.jacobdanderson.net).

## Product Scope

- Julio is a grade-school teacher and the site's sole teacher/administrator.
- Students browse course material and use the browser IDE anonymously.
  Optional student accounts exist only to sync saved Python projects.
- Students cannot register or recover accounts themselves. Julio creates each
  username and issues a unique, expiring setup code. After using it once, a
  student chooses a password or connects either Google or Apple; student email
  is never requested or collected by this site.
- Julio's account is provisioned through the repository's code-based setup
  process. HTTP Admin creation must remain disabled.
- The current course catalog contains only Scratch Levels 1 and 2, Python
  Level 1, Python Level 2: Classroom Edition, and PyGames: Classroom Edition.
  Their original Level 2 and PyGames curricula remain in a separate
  archived-reference group for Julio.
- The upstream browser Graph Sketcher remains available as a separate,
  anonymous tool. It uses browser tab storage and lets students download a
  separate project copy; browsers may copy tab storage when a tab is
  duplicated.
- The site does not provide tutoring-business, freelance, tuition, booking,
  scheduler, or Zoom workflows.

## Repository Layout

- `front-end/` contains the Vue 3 and Vite SSG course site, browser-based
  Python IDE, and Graph Sketcher.
- `back-end/` contains the small Express and MongoDB service used for Julio's
  private account and optional student project sync.
- `HEALTHCHECKS.md` documents service health and readiness endpoints.

## Access Model

The five current courses and Julio's separately labeled archived references
are public at `/`, the browser IDE is public at `/python-ide`, and Graph
Sketcher is public at `/graph-sketcher`. Archived references are not student
course assignments. Graph Sketcher runs entirely in the browser and keeps its
recovery copy in browser tab storage; a duplicated tab may receive its own
browser-managed copy. Graph projects and graph contents are not sent to the
backend or analytics.
Anonymous IDE projects stay in the browser unless a signed-in student
explicitly imports them. A student first signs in with the username and unique,
expiring setup code Julio provides. The first successful exchange irreversibly
consumes that code and opens a short setup session. The student then either
creates a password or connects one Google or Apple account. Later sign-ins use
the chosen method. Google and Apple connection uses only the provider's opaque
account identifier: this site does not request or store the student's provider
email, name, profile, avatar, or access tokens. The browser can continue an
interrupted password setup only when its setup session was saved and it
presents the exact strong request ID from its password submission; otherwise
Julio must issue a new code.

Teacher-only account controls are available to Julio at `/admin`. Julio can
create, disable, reactivate, and recover student accounts and can inspect
student projects through a separate editable review copy. Recovery issues a
new per-student code, signs the student out everywhere, and removes the old
password or Google/Apple connection. There is no shared class code, universal
recovery code, student email, provider-email matching, or self-service
registration.

Julio's name and email are fixed by code provisioning. The runtime exposes no
profile or email mutation, and his browser cookie is nonpersistent with an
eight-hour absolute session cap.

Do not add a second teacher account or public registration without an explicit
product decision.

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
3. Validate the public catalog, anonymous IDE, optional student sync, and
   Julio-only Admin boundary.
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

The normal build downloads the reviewed Python/PyGames asset archive from
[`static.cs.avasan.org`](https://static.cs.avasan.org). For an
offline application-only validation, use
`PYTHON_IDE_ASSETS_DOWNLOAD=skip npm run build`; that verifies both workspaces
but intentionally omits the optional IDE asset pack.

The root `package-lock.json` is the authoritative lockfile. Use environment
variables for session and database secrets, and never commit credentials.
Production refuses to start unless `SESSION_SECRET` is configured with at least
32 UTF-8 bytes. Generate a random secret with `openssl rand -base64 32`; do not
reuse it for any other service or commit it.
Leave `TRUST_PROXY_HOPS` unset unless the API is exclusively behind a known
proxy chain that replaces incoming forwarding headers. Database diagnostics
always require `INTERNAL_DIAGNOSTICS_KEY`, including during local development.
Set `CLASSROOM_ORIGIN=http://127.0.0.1:3333` for the local Vite classroom and
`CLASSROOM_ORIGIN=https://cs.avasan.org` in production. `CROSS_SITE` must remain
false: browser sessions are served through the same-origin `/api` route.

Google and Apple buttons appear only when `STUDENT_OAUTH_ENABLED=true` and the
provider's complete credentials are configured. Keep the feature disabled
until the school or district has approved it, supplied the required direct
privacy notice, and approved the app for managed student provider accounts.
Register these exact production return URLs with the providers:

```text
https://cs.avasan.org/api/students/oauth/google/callback
https://cs.avasan.org/api/students/oauth/apple/callback
```

Apple must be configured as a web Services ID using the site's HTTPS domain.
Provider secrets belong only in the backend environment or configured secret
store; see `back-end/.env.EXAMPLE`. Do not enable email, name, profile, or
offline-access scopes. The production proxy must preserve callback `Set-Cookie`
headers and must not record callback query strings or request bodies in access
logs; they can contain short-lived authorization codes and state values.

The static front-end is deployable independently, but teacher and student
sessions and cloud project sync require the Express API and an `/api/*` route
to that service. The frontend build packages the reviewed Python IDE asset
manifest; the backend does not stream an upstream asset archive at runtime.

Project quota counters are rebuilt from non-deleted projects before the API
starts listening. Project and counter writes remain separate MongoDB
operations, so an abrupt process or database failure can temporarily leave the
ledger over-counted; the next successful startup reconciliation repairs that
drift before accepting traffic.

Authenticated project writes use a dedicated 80 MB JSON ceiling before the
global 1 MB parser. This covers worst-case JSON escaping at the editor's
12,000,000-character project limit; authentication and write throttling run
before that larger body is accepted. Bodies above 4 MiB and requests without a
trustworthy `Content-Length` use a separate low-frequency tier with one active
request process-wide. Normal bodies retain a wider classroom tier but are also
bounded to two concurrent requests per account and eight process-wide.
Compressed project requests are rejected to prevent request-inflation attacks.
