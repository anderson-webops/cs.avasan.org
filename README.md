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
  Level 1: Classroom Edition, Python Level 2: Classroom Edition, and PyGames:
  Classroom Edition.
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

The five current courses are public at `/`, the browser IDE is public at
`/python-ide`, and Graph Sketcher is public at `/graph-sketcher`. Graph
Sketcher runs entirely in the browser and keeps its recovery copy in browser
tab storage; a duplicated tab may receive its own browser-managed copy. Graph
projects and graph contents are not sent to the backend or analytics.
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

Julio can also export retained account and educational records for one student
and permanently delete that student's account, provider binding, pending
provider setup attempts, projects, and review copies. Temporary sign-in proof
records are counted in the export inventory but excluded from the downloaded
file. Both operations require Julio to re-enter his password; deletion also
requires the exact username and returns an operation ID for the school or
district's required backup follow-up. See
[`docs/privacy-operations.md`](docs/privacy-operations.md).

Julio's name and email are fixed by code provisioning. The runtime exposes no
profile or email mutation, and his browser cookie is nonpersistent with an
eight-hour absolute session cap.

Do not add a second teacher account or public registration without an explicit
product decision.

## Shared Classroom Counts

When explicitly enabled, the same privacy-limited aggregate service accepts
anonymous counts from `cs.avasan.org` and `math.avasan.org`. Each request must
use the fixed `cs` or `math` site ID and one supported event: CS course or
Python IDE opens, or Math course or Graph Sketcher opens. Course events accept
only the corresponding public catalog IDs. The service rejects arbitrary
fields and credentials and never receives usernames, access codes, project
names, source code, graph contents, expressions, coordinates, referrers, or
device identifiers.

The Admin activity panel at `/admin?section=analytics` separates CS and Math
activity while retaining only aggregate optional-account and Python-project
counts under student work. It uses Julio's existing Admin session; there is no
external summary API or analytics service key. Rows written before the Math
site was connected remain part of the CS totals.

Collection stays off unless school/district approval, a direct privacy contact,
the backend `CLASSROOM_ANALYTICS_COLLECTION_ENABLED`, and the frontend
`VITE_CLASSROOM_USAGE_ENABLED` are all explicitly configured. Browser Do Not
Track and Global Privacy Control signals are honored. Reports are marked only
as attempted before the request and are never retried in that tab after an
error or ambiguous response. This prefers undercounting to a duplicate count
without adding an identifier for server-side deduplication. These
client-supplied totals remain low-stakes directional signals rather than
attendance or grading evidence.

### Provision Julio

Use a new, empty `cs-avasan-org` MongoDB database. After setting
`MONGODB_URI` in an ignored backend environment file, run:

```bash
npm run -w back-end create-admin-ts
```

The setup prompts for Julio's email and password, fixes the display name to
`Julio`, requires a password of at least 14 characters, and refuses to create a
second teacher account. Never reuse the upstream site's database.

Optional accounts, provider sign-in, and anonymous counts fail closed. Before
enabling any of them, complete the approval, contact, record-management, and
end-of-service checklist in
[`docs/privacy-operations.md`](docs/privacy-operations.md). The checked-in
backend and frontend templates keep every optional feature off.

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
nvm use
npm run dev
npm run server
npm run typecheck
npm run lint
npm run build
```

`.nvmrc` and `.node-version` pin Node 24.18.0 LTS. Use its bundled
npm 11.16.0 release, which matches the root `packageManager` field.

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

Set `CLASSROOM_PRIVACY_APPROVED=true`, `SCHOOL_PRIVACY_CONTACT`, and
`STUDENT_ACCOUNTS_ENABLED=true` in the backend only after the rollout checklist
is complete. The frontend build independently requires
`VITE_CLASSROOM_PRIVACY_APPROVED=true`, `VITE_SCHOOL_PRIVACY_CONTACT`, and
`VITE_STUDENT_ACCOUNTS_ENABLED=true`. A missing approval or contact keeps the
student routes and UI unavailable without affecting anonymous classroom use.

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

A frontend-only static build may be used for local or private-preview review of
anonymous classroom pages. It must not be promoted to `cs.avasan.org`; Julio's
Admin and the site's production health, readiness, and release contracts
require the full-stack Compose handoff and exact same-origin `/api/*` mapping.

## Reproducible Production Deployment

[`compose.production.yml`](compose.production.yml) builds this repository's
frontend proxy and Express API, keeps the API and authenticated MongoDB off
host ports, publishes only the frontend proxy on loopback, pins every base
image by digest, and runs the frontend and API with read-only filesystems,
dropped capabilities, and bounded temporary storage. The container Nginx
configuration:

- strips `/api` exactly once and preserves same-origin session cookies;
- streams API requests and responses without writing student project or export
  payloads to proxy temporary files;
- replaces the trusted proxy boundary documented by `TRUST_PROXY_HOPS=1`;
- disables application and example host access logs so student network and
  request metadata are not retained;
- applies browser security headers; and
- serves only generated public routes and returns real 404 responses for
  unknown paths.

Every frontend build also writes `/release.json`. The full-stack container
serves that file and `/api/release` with `Cache-Control: no-store`; both expose
only the semantic `version` and `revision`. They must agree because the
frontend and API are built from the same checkout. The authoritative
`compose.production.yml` handoff refuses to build unless `SOURCE_REVISION` is
the exact full commit SHA being deployed. Direct Dockerfile and static-preview
builds may still report `"revision": "unknown"` when no revision is supplied;
that fallback is not permitted by the production Compose path. Inject the
deployment identity without changing application secrets:

```bash
export CS_RELEASE_VERSION=1.0.0
export SOURCE_REVISION="$(git rev-parse HEAD)"
docker compose --env-file deploy/cs.env -f compose.production.yml build
```

`SOURCE_REVISION` must be the full lowercase 40-character Git SHA or production
Compose fails before building. Netlify uses its built-in full `COMMIT_REF` when
`SOURCE_REVISION` is absent. Neither release endpoint reports classroom flags,
student state, credentials, or infrastructure data.

To prepare a deployment:

```bash
install -m 600 deploy/cs.env.example deploy/cs.env
# Fill secrets, keep all optional features false until the privacy gate is met.
export CS_RELEASE_VERSION=1.0.0
export SOURCE_REVISION="$(git rev-parse HEAD)"
./scripts/verify-deploy-env-permissions.sh
docker compose --env-file deploy/cs.env -f compose.production.yml build
docker compose --env-file deploy/cs.env -f compose.production.yml up -d mongo
# This is idempotent and is required for an existing Mongo volume because
# /docker-entrypoint-initdb.d runs automatically only on the first initialization.
docker compose --env-file deploy/cs.env -f compose.production.yml exec -T mongo sh -lc 'mongosh --quiet --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin /docker-entrypoint-initdb.d/01-create-app-user.js'
docker compose --env-file deploy/cs.env -f compose.production.yml --profile tools run --rm admin-tools npm run -w back-end create-admin-ts
docker compose --env-file deploy/cs.env -f compose.production.yml up -d
```

Generate `MONGO_ROOT_PASSWORD`, `MONGO_APP_PASSWORD`, `SESSION_SECRET`, and
`INTERNAL_DIAGNOSTICS_KEY` as separate random values. Hexadecimal Mongo
passwords avoid URI-encoding ambiguity. `deploy/cs.env` is ignored by Git and
the verifier refuses permissions other than `0600`. Mongo root is available
only to the database container for initialization and maintenance. The API and
the isolated Admin tools image receive only the dedicated
`cs-avasan-org` application credential, whose only database role is
`readWrite`. In MongoDB 8 that role already includes the collection and index
operations required by the application's Mongoose startup; do not add
`dbAdmin` to the runtime credential.

The one-off Admin command uses TypeScript source in the isolated tools image,
prompts for Julio's credentials, and refuses to create a second Admin; omit
that step when the database already contains his provisioned account. If an
existing deployment rotates `MONGO_APP_PASSWORD`, run the idempotent
`mongosh` initialization command above before restarting the API. A Vault
secret, when enabled, must contain the same least-privilege application URI,
never a Mongo root URI. An explicit Vault address or AppRole setup fails
closed on incomplete configuration, authentication, or read errors; it never
silently falls back to the environment URI. A remote production Vault origin
must use HTTPS.
Adapt [`deploy/host-nginx.conf.example`](deploy/host-nginx.conf.example) to the
existing TLS host; it replaces forwarding headers and proxies only to the
loopback container port. This proxy-only vhost and `compose.production.yml`
are the single supported production handoff for `cs.avasan.org`. Do not serve
a copied frontend build, add a host-side `root` or `try_files`, or duplicate
route and cache policy outside the immutable web image. The container
configuration is the sole owner of strict unknown-route 404 responses,
relative directory redirects, release headers, and same-origin `/api/*`
routing.

Once the new stack is reachable through the proxy, but before the deployment
timer records success, run the mandatory production gate from that exact
checkout:

```bash
CS_EXPECTED_RELEASE="${CS_RELEASE_VERSION}" \
CS_EXPECTED_REVISION="${SOURCE_REVISION}" \
CS_SITE_ORIGIN=https://cs.avasan.org \
  npm run verify:production
```

The deployment must fail without recording success unless that command verifies
the exact matching revision at `/release.json` and `/api/release`, `no-store`
on both endpoints, known anonymous routes, a real 404 for a synthetic unknown
path, API health and readiness, the Graph Sketcher bundle, and the current
fail-closed student and aggregate-usage boundaries. The manual **Verify
production deployment** GitHub workflow runs the same gate from an independent
external runner and should follow each production promotion. Also verify
`/admin` and `git diff --check`. If the privacy-approved features are
intentionally enabled in a future rollout, update the external smoke
expectations in the same reviewed change. The frontend build packages the
reviewed Python IDE asset manifest; the backend does not stream an upstream
asset archive at runtime.

Project quota counters are rebuilt from non-deleted projects before the API
starts listening. Project and counter writes remain separate MongoDB
operations, so an abrupt process or database failure can temporarily leave the
ledger over-counted; the next successful startup reconciliation repairs that
drift before accepting traffic.

Student record deletion uses an in-process operation gate to drain project,
review, export, account-management, and provider-link work before its database
sweep. The supplied Compose deployment therefore fixes the API to one named
container and intentionally cannot be scaled with `docker compose --scale`.
Do not remove that single-process boundary or run another API instance against
this database unless the operation gate is first replaced with a tested
database-distributed implementation.

Authenticated project writes use a dedicated 80 MB JSON ceiling before the
global 1 MB parser. This covers worst-case JSON escaping at the editor's
12,000,000-character project limit; authentication and write throttling run
before that larger body is accepted. Bodies above 4 MiB and requests without a
trustworthy `Content-Length` use a separate low-frequency tier with one active
request process-wide. Normal bodies retain a wider classroom tier but are also
bounded to two concurrent requests per account and eight process-wide.
Compressed project requests are rejected to prevent request-inflation attacks.
