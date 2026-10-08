# Julio's Admin password recovery

An authorized server operator can reset the password on Julio's existing sole
Admin account when he has forgotten it. This is operator-assisted recovery,
not a self-service forgot-password email flow. It adds no HTTP endpoint,
recovery token, universal code, new Admin, or student recovery mechanism.

## Operator procedure

Only use this after confirming Julio's request through your established trusted
contact process. Never request or transmit his current password. Agree on a
private way for Julio to receive the replacement, or let him enter it directly
in an authorized operator-assisted terminal session.

Use the repository's pinned Node toolchain and the same least-privilege database
credential source as the API. Load the protected API environment through the
operator's existing trusted procedure; do not paste, print, or commit its
database/Vault secrets. Do not create a new environment or account to bypass an
unavailable approved one.

For the canonical native deployment, run the compiled command from the active
reviewed release as the existing `cs-avasan` service user, using the protected
environment-loading procedure documented under
[Admin and retention operations](native-production-deployment.md#admin-and-retention-operations):

First confirm that a reviewed release containing this command has been promoted
by the deployment timer and that the compiled file exists in that active
release. Older releases do not acquire the command merely because source was
pushed. Do not copy a new script into an older immutable runtime artifact.

```bash
/usr/bin/node /srv/cs.avasan.org/current/back-end/dist/reset-admin-password.js --confirm-reset-julio-password
```

The equivalent package command in a compiled backend checkout is
`npm run -w back-end reset-admin-password -- --confirm-reset-julio-password`.
The compiled command reads only the already-loaded environment; it does not
search the operator's working directory for an `.env` file.

The native release deliberately omits development dependencies, so do not try to
install `tsx` or run the source script inside its runtime artifact. For an
approved source checkout that already has the pinned development toolchain:

```bash
npm run -w back-end reset-admin-password-ts -- --confirm-reset-julio-password
```

The command must run in an interactive terminal. It prompts for Julio's existing
email and the replacement password twice, with password input hidden. The
password must be nonblank and at least 14 characters. Do not supply a password
in arguments, environment variables, piped input, logs, or screenshots.

The command uses the API's fail-closed environment/Vault credential selection,
requires the fork-specific Vault secret path when Vault is selected, requires a
MongoDB URI using `cs-avasan-org` as both database and `authSource`, and checks
that the connected database is actually `cs-avasan-org` before account access.
It refuses unless exactly one Admin exists and it is Julio's deterministic
singleton with the matching existing email. It never creates or upserts an
account, and it never changes the email, role, display name, or student records.

The new Argon2 password hash and password-change timestamp are committed in one
conditional update with an incremented Admin session version. That invalidates
all previous Admin sessions, including copied signed cookies. A concurrent
login or password change causes the conditional reset to fail instead of
overwriting newer state. Julio must sign in again after a confirmed reset.
Once a release containing the command is active, the reset operation itself
needs no application restart, additional deployment, or Nginx change.

If it does not report confirmed success, do not assume the replacement works.
Verify the current sign-in state and investigate with the authorized operator.
Do not rerun account creation or remove/recreate the singleton as a workaround.

## Specifically deferred: self-service recovery

A true forgot-password flow remains a separate follow-up. It needs an explicit
owner decision approving the recovery design, an independently verified contact
channel for Julio, and the approved delivery service/configuration. A historical
provisioning email alone is not proof that an automated recovery channel is
currently verified or authorized. No email, SMS, identity-provider recovery, or
public recovery route is enabled by this change.

Students still cannot recover accounts themselves. Julio's existing private
student access-reset controls remain the only student recovery path.

## Deployment and access boundary

This document does not authorize running the command against production.
Source delivery happens through the usual deployment timer. If a real password
reset is needed later, provide these instructions to the authorized server
operator/server AI and have the replacement entered privately. Do not attempt
SSH access from this workspace or place the replacement password in an AI
prompt.
