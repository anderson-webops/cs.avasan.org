# IDE diagnostics and problem reports

The shared IDE workspace exposes **Copy diagnostics** and **Report a problem**
for Python, Turtle, Pygame, data analysis, Java, Karel, and BlueJ integration.
There is no automatic report submission, global error collector, email, or
outage alert. Java and Python execution remain in the browser.

## What is collected

Copying produces a local JSON snapshot. Reporting opens a dialog showing the
exact proposed submission. The user can omit stack locations, add an optional
description, and must confirm the preview before sending. Editing the preview
invalidates consent. Once submission is attempted, the payload is frozen so a
retry uses the same reference ID and cannot overwrite an earlier submission.
Close and reopen the report dialog to start a different report.

The snapshot includes a random reference ID, site origin (no URL path or query),
build tag and revision, browser family/version (no raw user agent), configured
Pyodide version and observed Python version, Java-preview adapter identity,
selected mode, execution stage, error type, and an initial classification.
Unloaded or unavailable versions are explicitly marked. Desktop BlueJ runs
outside the website; its Java/BlueJ versions and tracebacks cannot be observed.

Sanitized stacks contain only bounded numeric line/column locations and a
project/runtime/browser scope, plus recognized product module labels where available. Exception messages, code lines, function names,
file names, URLs, paths, variables, console output, inputs, and credentials are
never automatically included. Descriptions are text the user explicitly writes
and previews; the UI asks them to omit personal information and code. They may
still contain sensitive information, so the inbox is private. No report records
contain account IDs, session cookies, request headers, or IP addresses. Existing
rate limiting and web-server access logs retain their existing behavior.

## Classification and runtime coverage

Known Python exceptions originating in student code are labeled **Likely
programming error**. Runtime initialization failures and exceptions originating
inside browser shims are labeled **IDE or runtime issue**. Ambiguous errors,
including Java preview limitations, are labeled **Needs review**. Classifications
are clues, not definitive fault attribution or server health signals.

Runtime stage/version callbacks cover the isolated Python worker for every Python mode. The workspace also captures Java/Karel diagnostics,
animation failures, BlueJ import/export failures, and later interactive stderr.
Starting another run or changing project clears stale error context. Errors
which prevent the entire page loading cannot be reported through its controls.

## Private administrator inbox

Open the **IDE problem reports** section on `/admin`. Review the
reference, description, diagnostics, and status; mark reports new, reviewed, or
resolved. All read/update APIs use live administrator/session-version checks.
There is no public report lookup, even when someone knows a reference ID.
Find a specific reference ID or load 25 reports at a time using a bounded cursor.

Reports expire after 90 days through MongoDB's `createdAt` TTL index. The API
also hides expired records while waiting for TTL cleanup. Ensure the
`IdeProblemReport` indexes are created on deployments that disable automatic
Mongoose index creation. Payloads are strict allowlists, bodies are capped at
12 KiB before the general parser, and submissions are limited to 60 per hour
per network using the bounded process-local rate-limit store. Cross-origin writes
use the existing request-origin guard. Invalid payloads and parser errors do
not echo input or enter alert paths. Submitting student code is never executed.

## Build identity

The front-end embeds `CLASSES_BUILD_RELEASE` and `CLASSES_BUILD_REVISION` at
build time, falling back to the checked-out exact tag/commit where available.
Native release preparation already supplies `CS_RELEASE_VERSION` and
`SOURCE_REVISION`; the frontend accepts those verified values for its archived build. No public release-identity endpoint is added. Alternate build
pipelines using archives should pass these variables; unavailable identity is
shown as `unreleased` / `unknown`. Administrator reports treat all client-sent
metadata as unverified context.
