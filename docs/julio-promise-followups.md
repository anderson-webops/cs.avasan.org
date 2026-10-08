# Julio's classroom promise follow-ups

This is the implementation and dependency ledger for the June through
September 30 classroom commitments. Source implementation, permission to
activate a feature, and verified production availability are separate states.
Do not mark a deferred item complete merely because its prerequisite document
or code exists.

## Last-class Scratch follow-up: delivered

The classroom sequence includes twelve original Scratch starters, beginning
with Animate Your Name and individual sprite-click events, then movement,
coordinate-first dress-up and reset, dialogue, loops, conditions, variables,
and games. A separate blank project supports independent work. Lessons
include Normal, Hard, and concrete checks, with browser import/export and
downloadable `.sb3` files. The previous curriculum remains in Reference
Materials. See [Scratch classroom workflow](scratch-classroom.md).

The exact frog/crab X/Y coordinate game with its catch sound is delivered on
Math through Julio's public Scratch project `1367463968`. Keep it on Math;
do not copy the Math graphing runtime into CS or replace it with the different
mouse-controlled Juni Bug Eater solution.

These teaching materials are original adaptations. This does not mean every
referenced teacher page, image, original project, or finished-project video has
been copied onto both sites.

## Implemented in this follow-up

- **Julio's forgotten password:** an authorized site operator can reset only
  the existing sole Admin with an interactive, non-HTTP tool. The reset
  revokes existing Admin sessions. The sign-in form explains this private
  recovery path without claiming that a reset email will be sent. See
  [Admin recovery](admin-recovery.md). This is operator-assisted recovery,
  not self-service email recovery, and does not need student-account approval.
- **Share a public classroom starter:** lesson cards offer Copy starter link.
  Only a published starter from the five current courses is eligible; no
  edited project contents, student identity, credential, or private project
  identifier is put in a link. See [Starter sharing](starter-sharing.md).
  This does not implement publicly shareable edited student projects.
- **Missing preview handoff:** the exact Python Level 1 preview requirements
  and acceptance checks are documented in
  [Preview materials](python-level-1-preview-materials.md). Missing media is
  not replaced with invented URLs, unrelated videos, or empty public cards.

These changes require normal source integration and release promotion before
they can be described as live. Do not run recovery against a real account as a
test.

## To do later: provide the missing Python Level 1 demonstrations

**Required input:** actual GIF, MP4, or WebM recordings of the finished result
for the named current lessons in the preview-materials checklist. Supply the
lesson identity, original file or stable approved hosting location, author,
source, and redistribution/attribution terms. The recordings must not expose
student names, credentials, accounts, or private work.

**Then:** verify that each recording matches the lesson's expected result,
publish it through the reviewed media path, add the correct `mediaLink` to the
current lesson, and test the rendered preview and its delivery/MIME type.
Check that the same lesson still launches its starter without exposing a
teacher-only solution. Existing Python Level 2 or PyGames previews do not
fulfill a Python Level 1 demonstration.

## To do later: activate optional accounts, sync, and Google sign-in

The implementations already exist, but must remain disabled until the
school/district's authorized reviewer supplies the activation inputs. Julio's
classroom role alone is not an approval record.

**Required input:** affirmative authorization for the exact features; the
reviewed direct/public notices and actual privacy contact; policy version and
effective date; operator/provider information and required assurances;
school-selected account retention; and the approved access, correction,
export, deletion, backup, and end-of-service process. Use the complete
[privacy operations checklist](privacy-operations.md), rather than treating
this paragraph as a substitute for that review.

Google sign-in additionally needs separate identity-provider approval and the
provider application's credentials and approved callbacks, stored privately
through the existing configuration/Vault path. Do not put credentials in this
ledger, a URL, a prompt, a commit, or a browser build.

**Then:** the server operator configures the existing approved account/OAuth
flags and retention values, rebuilds/promotes a coherent release, and checks
teacher-created setup codes, optional project sync, and the approved provider
flow. Keep course/IDE access and browser-local saves anonymous. Do not create
student accounts or a second Admin merely to test the rollout.

## To do later: share edited projects by link

The original-site sharing promise is not satisfied by Copy starter link.
Edited projects can currently be downloaded and passed through the school's
approved file-sharing channel, then imported by the recipient.

**Required input:** an explicit product decision and school-approved sharing
purpose, recipients, access controls, expiry/revocation, retention/deletion,
and handling of project content and personal information. Define whether
access is teacher-only or recipient-authenticated. Never infer permission for
public student-content hosting from approval for private account sync.

**Then:** design and review the approved access model, implement it behind the
same fail-closed approval boundary, and test authorization, revocation,
retention, and deletion. Preserve teacher-only non-Scratch course solutions.
Do not restore the original platform's general public sharing endpoints as a
shortcut.

## To do later: optional self-service recovery for Julio

Operator-assisted recovery is available without a public recovery endpoint.

**Required input:** an explicit decision to add self-service teacher recovery,
an independently verified recovery destination/channel, its delivery
configuration, and approval of the identity-verification and abuse-prevention
workflow. The provisioned email alone is not proof that recovery delivery is
configured or approved.

**Then:** implement and validate a narrowly scoped, expiring, one-use teacher
recovery flow, including session revocation and a no-enumeration response.
Never create an Admin through HTTP, add student self-recovery, or introduce a
shared/universal recovery code. Until then, use the operator tool.

## To do later: the complete reference-teacher resource collection

**Required input:** the precise pages/projects/files Julio wants reproduced,
the originals where they are not publicly downloadable, and asset-specific
reuse terms or permission, including required credits. Confirm the intended
publication on both Julio's and Jacob's sites. Do not assume one curriculum's
license covers another source or proprietary Juni material.

**Then:** ingest only the approved scope, retain authorship and provenance,
apply the required attribution and reuse terms, adapt the classroom structure,
and verify every copied project/download on both destinations. Do not claim a
complete mirror of a changing external website when only an original
teaching adaptation has been supplied.

## Production handoff

Do not SSH from this task or bypass the deployment timer. Run the required
repository checks before committing and pushing to `origin`; follow the
separate annotated-release validation/promotion process when a release is
authorized. Let the existing timer deploy the selected release. Check public
release metadata and the affected browser flows afterward; a pushed commit
is not proof of deployment. Server-only configuration or recovery operations
belong in a separate server-AI/operator handoff, with no passwords or secrets
in that handoff.

The downloadable desktop grapher is outside this follow-up's scope.
