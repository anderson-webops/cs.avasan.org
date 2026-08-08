# Native production deployment

This is the canonical automatic production handoff for `cs.avasan.org`. It
serves immutable frontend files directly from Nginx, runs exactly one compiled
Node API under systemd, and uses a dedicated `cs-avasan-org` MongoDB credential.
The existing Compose handoff remains supported only as a manually selected,
isolation-focused fallback and as a full-stack CI fixture.

## Automation contract

The server must classify this repository explicitly as native and invoke
`npm run deploy:native` from a clean checkout at the exact annotated release
tag. That checkout must use the canonical `anderson-webops/cs.avasan.org`
`origin`, and its already-fetched `origin/main` must resolve to exactly `HEAD`;
the deployer never fetches or mutates Git refs. The root Dockerfiles and
`compose.production.yml` do not authorize a file-presence detector to choose
Compose. Compose requires an intentional operator decision, and native and
Compose CS stacks must never run together.

Install the native Nginx, systemd, and header artifacts from that same release
before invoking the deployer as regular, root-owned mode-`0644` files. The
deployer uses a fixed system executable path, builds and preflights the
candidate before activation, switches releases atomically, and restores the
previous healthy release if readiness or the production smoke gate fails.

The native path does not change DNS, TLS records, student-data policy, or
feature approval. Student accounts, provider sign-in, and aggregate classroom
counts stay fail-closed unless the same canonical settings, including the
reviewed privacy-policy version and real `YYYY-MM-DD` effective date, pass the
existing privacy gates during both the frontend build and API startup.

## One-time server preparation

Install system Node.js 24.18 or later within major 24, npm 11, Nginx, Git,
`curl`, and either MongoDB 8 or access to a reviewed managed MongoDB service.
Do not use an NVM path in systemd. Create the unprivileged API identity and
configuration directory:

```bash
sudo useradd --system --home-dir /nonexistent --shell /usr/sbin/nologin cs-avasan
sudo install -d -o root -g root -m 0755 /srv/cs.avasan.org /etc/cs.avasan.org
sudo install -o root -g root -m 0600 deploy/native/api.env.example /etc/cs.avasan.org/api.env
```

Fill `/etc/cs.avasan.org/api.env`. It is the only canonical input for settings
that affect both the public build and API. Do not add `VITE_*`, release identity,
host, port, origin, or proxy variables to it.

Use exactly one Mongo credential source:

- Direct MongoDB: set `MONGODB_URI` to a URI for the dedicated `readWrite` user
  whose database and `authSource` are both `cs-avasan-org`. Bind a self-hosted
  MongoDB only to loopback or a private network. Never give the API the Mongo
  root credential.
- Vault: set the HTTPS or loopback `VAULT_ADDR` and a narrowly scoped AppRole.
  Store only the application URI at
  `secret/data/cs.avasan.org/mongodb`. Any partial Vault configuration fails
  closed and never falls back to `MONGODB_URI`.

For a new self-hosted MongoDB, keep its administrative values in a separate
root-only file and initialize or rotate the application user with the existing
idempotent script:

```bash
sudo install -o root -g root -m 0600 deploy/native/mongo-admin.env.example /etc/cs.avasan.org/mongo-admin.env
sudo bash -c 'set -a; source /etc/cs.avasan.org/mongo-admin.env; set +a; mongosh --quiet --username "$MONGO_ROOT_USERNAME" --password "$MONGO_ROOT_PASSWORD" --authenticationDatabase admin deploy/mongo-init/01-create-app-user.js'
```

Install the reviewed Nginx and systemd artifacts from the same tagged checkout.
Repeat these install commands whenever a release changes any native deployment
artifact; the deployer refuses source/server configuration drift:

```bash
sudo install -o root -g root -m 0644 deploy/native/cs-avasan-security-headers.conf /etc/nginx/snippets/cs-avasan-security-headers.conf
sudo install -o root -g root -m 0644 deploy/native/cs-avasan-ide-security-headers.conf /etc/nginx/snippets/cs-avasan-ide-security-headers.conf
sudo install -o root -g root -m 0644 deploy/native/nginx.conf.example /etc/nginx/sites-available/cs.avasan.org
sudo ln -s /etc/nginx/sites-available/cs.avasan.org /etc/nginx/sites-enabled/cs.avasan.org
sudo install -o root -g root -m 0644 deploy/native/cs-avasan-api.service /etc/systemd/system/cs-avasan-api.service
sudo nginx -t
sudo systemctl daemon-reload
sudo systemctl enable cs-avasan-api.service nginx.service
```

Review the certificate paths before enabling the vhost. The native Nginx vhost
owns static files, the custom HTML 404, the same-origin `/api` proxy, and the one
external security-header profile. It preserves dual-stack HTTP/2 and HTTP/3;
keep the server's single existing `reuseport` declaration on whichever QUIC
vhost already owns it rather than adding a second one here. It also opens
loopback port 8080 only for the full release gate. Remove or stop the former CS container listener before
activating this vhost; do not run native and Compose CS stacks together.

Keep access logs disabled. The API binds only to `127.0.0.1:3008`; MongoDB and
the API must never be published directly to the Internet. The systemd unit is
intentionally one process because deletion fencing and Pond Paddlers rooms are
process-local.

## Deploying a release

Start from a clean tagged checkout whose `package.json` version is the intended
release. The script archives exactly `HEAD`, performs the pinned clean install
and both builds in a temporary directory, installs production-only backend
dependencies, and creates an immutable release at:

```text
/srv/cs.avasan.org/releases/<commit>-<public-config-digest>
```

The deployer is not an initial-cutover tool. Before it runs, `current` must be
an existing symlink to a complete, root-owned, non-group/world-writable release
directly beneath `releases/`. Its directory name, native manifest, public
release identity, public configuration, and release environment must agree;
the immutable release directory must use mode `0755` so the unprivileged API and
Nginx workers can traverse it, and required executable and public files must be
regular files.
Workspace package symlinks are accepted only inside `node_modules` and only when
they resolve inside the same immutable release. A separately reviewed
first-install procedure must establish and verify that rollback target before
automatic deployments are enabled.

The config digest contains no secret values, including the exact approved
analytics retention period when one is configured. It prevents a frontend built
with one privacy/feature decision from being reused after `api.env` changes. The
root deployer strips runtime credentials before invoking any child process;
dependency lifecycle scripts and builds run as the unprivileged `cs-avasan`
identity inside a disposable directory.

```bash
sudo ./scripts/deploy-native-release.sh --source /path/to/clean/cs.avasan.org
```

Activation changes the `current` symlink atomically, restarts the single API,
reloads Nginx, waits for Mongo-backed readiness, and runs the full production
smoke suite through `http://127.0.0.1:8080`. The gate checks release identity,
real branded page 404s, JSON API 404s, one non-conflicting security-header set,
Admin login behavior, private games, Math-only Graph Sketcher retirement, and
the configured privacy-feature boundaries. It compares the exact analytics
collection and retention settings reported by the API with the exact period in
Student Privacy; enabled collection without an explicit 7–90-day period fails
before activation. Any failure restores the former
symlink and services. Recovery is not reported from the symlink alone: the
deployer restarts and reloads the restored stack, waits for API readiness, then
runs the full route and security smoke suite against the former manifest's
exact version, revision, privacy-feature values, and analytics retention period.
The activation failure and
any separate rollback failure retain their own status and diagnostics. The
successful former target is retained as `previous`; releases are not
automatically deleted.

Each immutable release carries a non-secret `public-config.env` generated from
the same canonical values as its frontend. It overrides only those public
settings when systemd starts the API, so code and policy decisions switch and
roll back together without copying Mongo, session, OAuth, Vault, or diagnostics
secrets. The API service verifies that coherence on every restart. Editing
`api.env` alone does not activate a public feature; run the deployment script
again after every approved privacy/feature change.

After activation, run the public A and AAAA production workflow or equivalent
external probes. Confirm `/release.json` and `/api/release` match the exact tag
and commit, `/api/readyz` is ready, unknown page paths use the classroom 404,
and unknown API paths return the small JSON contract. Same-network hairpin
failure is not deployment evidence; use an external probe or the loopback gate.

Source provenance and the unchanged rollback target are verified again after
the candidate build and immediately before activation. Reused and newly built
release directories are structurally verified before any release-owned code is
executed. A systemd reload, API restart, Nginx reload, readiness, smoke, or
previous-link preservation failure initiates restoration of the verified
former release. Restoration succeeds only when that prior runtime passes
readiness and the full loopback smoke suite under its own manifest identity.

## Rollback

The deployer rolls back automatically when activation or verification fails.
To intentionally return to the preserved successful release:

```bash
sudo ./scripts/rollback-native-release.sh
```

Rollback atomically swaps `current` and `previous`, restarts the API, reloads
Nginx, and must pass the same loopback smoke suite. If that gate fails, the
original release is restored, restarted, reloaded, and rechecked for readiness
and full route behavior under its own version and revision before restoration
is reported. Both links must remain absolute symlinks to
distinct, structurally verified immutable releases throughout preflight;
rollback refuses dangling, aliased, writable, identity-inconsistent, or
out-of-tree targets.

## Admin and retention operations

Provision Julio only after the API is healthy and only when the database does
not already contain the sole Admin. Load the two root-owned environment files
without putting secrets on a command line, then run the compiled code as the
service user:

```bash
sudo bash -c 'set -a; source /etc/cs.avasan.org/api.env; source /srv/cs.avasan.org/current/release.env; set +a; runuser --preserve-environment --user cs-avasan -- /usr/bin/node /srv/cs.avasan.org/current/back-end/dist/create-admin-user.js'
```

After classroom analytics collection has been explicitly disabled in
`/etc/cs.avasan.org/api.env` and a coherent release with that setting has been
deployed, permanently purge the anonymous aggregate rows with exactly:

```bash
sudo /srv/cs.avasan.org/current/scripts/purge-native-classroom-analytics.sh --confirm-delete-all-classroom-analytics
```

The wrapper refuses every other argument shape, requires the API environment to
be a regular root-owned mode-`0600` file, resolves `current` only within the
managed immutable release directory, loads and verifies the release identity,
and runs the native runtime-config preflight before connecting. The compiled
CLI uses the API's same fail-closed Vault-or-environment credential selector,
checks the actual connected database name is exactly `cs-avasan-org`, and
performs a second primary-database count that must report zero remaining rows.
Only the Mongo/Vault variables, explicit collection flag, and release identity
reach the unprivileged one-shot process; session, OAuth, and diagnostics secrets
are removed from its environment. Preserve the successful command output in
the approved closure record and never add an HTTP purge endpoint.

Do not activate student accounts until the school or district has supplied and
approved the operator notice, provider notice, direct contact, and a 30–365-day
retention period. Before first activation, verify whether the fork-specific
database already holds student records or deletion receipts. After activation,
exercise one disposable account through creation, setup, project save,
correction, export, and deletion before classroom use. Database backups and
restores must preserve the same retention and deletion obligations.

Do not activate classroom analytics until the same reviewer has selected and
approved an exact whole-number `CLASSROOM_ANALYTICS_RETENTION_DAYS` value from 7
through 90. Keep that value in `api.env` while any anonymous rows remain
physically stored, including logically expired rows awaiting cleanup, so a later
disabled release continues to disclose and enforce the approved period.
