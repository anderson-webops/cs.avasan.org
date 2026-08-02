# Classroom Privacy Operations

This runbook describes the operational gates for optional student accounts,
provider sign-in, and anonymous classroom counts. It is a technical control
document, not a substitute for the school or district's legal review.

## School authorization and official review points

Julio's role as the teacher does not, by itself, approve this service or decide
which consent or disclosure exception applies. Before enabling a student-data
feature, the school or district's authorized privacy/technology reviewer must
document the applicable basis and review the current official sources,
including:

- the FTC's [COPPA guidance for schools](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions#N.%20COPPA%20AND%20SCHOOLS).
  School authorization can substitute for parental consent only in the
  educational context, for the school's use and benefit and no other commercial
  purpose; the operator still remains responsible for its own COPPA duties and
  must give the school the required direct notice, review, deletion, and
  stop-collection controls;
- the U.S. Department of Education's
  [online classroom tool guidance](https://studentprivacy.ed.gov/faq/i-want-use-online-tool-or-application-part-my-course-however-i-am-worried-it-violation-ferpa)
  and [FERPA school-official criteria](https://studentprivacy.ed.gov/faq/who-school-official-under-ferpa).
  If that exception is used, document the institutional function, the school's
  direct control, legitimate educational interest, annual-notice criteria, and
  limits on use and redisclosure;
- [California Education Code section 49073.1](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=EDC&sectionNum=49073.1.).
  If it applies to the arrangement, the local educational agency must ensure
  its agreement addresses pupil-record ownership and control, pupil-generated
  content, purpose limits, access and correction, security, incident notice,
  end-of-service deletion, FERPA coordination, and targeted advertising; and
- the current
  [California K–12 Pupil Online Personal Information Protection Act, Business and Professions Code section 22584](https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?article=&chapter=22.2.&division=8.&lawCode=BPC&part=&title=).
  The reviewer must address its limits on targeted advertising, noneducational
  profiling, sale, and disclosure, along with reasonable security and covered
  information deletion.

The review record must also identify every approved infrastructure or identity
provider, confirm the provider terms and data handling fit the authorized
school purpose, and assign responsibility for parent/student notices, record
requests, security incidents, backups, and end-of-service deletion. Do not
enable a feature merely because this implementation minimizes data.

## Fail-closed rollout gate

CS courses, the IDE, browser saves, and Math's browser-local Graph
Sketcher remain available without these features. Do not enable any
student-data feature until all of the following are complete:

1. The school or district has approved the feature and its intended classroom
   use.
2. The exact direct privacy contact supplied with student access is available.
   Do not invent a contact.
3. The school or district has supplied and reviewed the public operator notice,
   including every operator's postal address, telephone number, and email, and
   the provider notice naming each approved infrastructure or identity
   provider, its limited purpose, and the student information it handles. Do
   not invent either notice.
4. The public `/student-privacy` page has been built with the contact and both
   notices and reviewed in the deployed site.
5. For accounts, the authorized reviewer has selected a whole-number record
   retention period from 30 through 365 days. There is no application default.
6. The school or district has supplied its record-access, correction, export,
   deletion, backup, security-log, and end-of-service retention process.
7. Julio understands that anonymous totals are directional signals, not
   attendance, grades, or evidence about an individual student.

The backend requires `CLASSROOM_PRIVACY_APPROVED=true`,
`SCHOOL_PRIVACY_CONTACT`, `CLASSROOM_PRIVACY_OPERATOR_NOTICE`,
`CLASSROOM_SERVICE_PROVIDER_NOTICE`, and the desired feature flag. Accounts
additionally require a whole-number `STUDENT_RECORD_RETENTION_DAYS` value from
30 through 365. The canonical native deployer and the manually selected
Compose fallback both derive the frontend approval and feature switches
directly from those canonical backend values and map the same contact, notices,
and retention value into the frontend build. There is no second production set
of `VITE_` feature switches to drift. Missing or invalid configuration fails
closed.

| Feature                                   | Backend                                                                                      | Frontend build                                               |
| ----------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Optional student accounts and Python sync | `STUDENT_ACCOUNTS_ENABLED=true` and `STUDENT_RECORD_RETENTION_DAYS=30..365`                  | Derived by the selected deployer from the same canonical values |
| Apple or Google sign-in                   | `STUDENT_OAUTH_ENABLED=true` plus account flag, retention, and complete provider credentials | Derived by the selected deployer from the same canonical values |
| Anonymous CS and Math counts              | `CLASSROOM_ANALYTICS_COLLECTION_ENABLED=true`                                                | Derived by the selected deployer from the same canonical value  |

OAuth is unavailable unless accounts are enabled. Provider apps must request
only the OpenID identity needed for an opaque subject. Do not add email,
profile, name, avatar, or offline-access scopes. The authorization-code
exchange transiently receives the provider token response needed to validate
the ID token. Only the one-way hash of the verified opaque subject is
persisted; provider tokens are not retained.

## Data inventory

Julio must create each username as a school-approved, non-identifying alias
(for example, `river-7`), never a student's full legal name, email, birthdate,
student number, or other direct identifier. Any alias-to-roster mapping belongs
only in the school or district's approved record system, not this classroom
application.

The optional account system owns:

- the username, account status, creation and successful-login timestamps,
  record-deletion deadline, password and one-time-code hashes, session-version
  counter, failed-login count, temporary account lockout, and the last random
  password-setup request marker used to recognize an interrupted or retried
  password submission;
- a provider name and hash of an opaque Apple or Google subject, when chosen;
- pending provider attempts, containing short-lived verifier, nonce, state,
  browser-binding proof, sign-in or connection mode, expiry, and, while
  connecting, the internal student ID and session version;
- in-memory abuse-prevention counters keyed by a network address, normalized
  username, or internal student account ID for no longer than their configured
  window (five minutes for anonymous activity reporting and at most 15 minutes
  for account and project endpoints);
- synced Python projects, including titles, mode, filenames, source or encoded
  project assets, selected file, course/starter metadata, size, import
  identifier, and creation/update times; and
- Julio's separate project review copies, visibility setting, and notes.

Sessions are signed browser cookies, not a server-side session collection.
The cookie carries only the internal student ID, authentication level, session
version, and setup, inactivity, and absolute expiry times. Setup lasts at most
30 minutes; a full session ends after 30 minutes without activity or eight
hours, whichever comes first.
Rotating or deleting the student's session version invalidates every existing
copy. Each abuse-prevention key uses an exact-expiry in-process store, is
deleted when its own window ends, and is never written to MongoDB or analytics.
Math's anonymous graph projects never enter this inventory.

The browser keeps the matching random password-setup request marker in that
tab's `sessionStorage` only while it may need to finish or safely retry setup.
It is cleared after setup or sign-out and otherwise ends with the tab session.
The account copy is replaced or cleared during later access setup and is
deleted with the account. It is not a password or access code.

After permanent deletion, the running API process keeps only the deleted
account's internal database ID in a closed in-memory write gate until that
process restarts. This process-lifetime tombstone contains no alias,
credential, project, or code. It prevents a request that authenticated before
deletion from arriving late and recreating deleted work.

The anonymous count system owns only UTC day, fixed site, fixed event, optional
allowlisted course ID, total count, and expiry. It has no account key or
student-level join.

Three solo classroom games run entirely in the current browser and create no
server record or analytics event. A Pond Paddlers room exists only in the
running API process for no more than two hours. It contains the private room
configuration and each seat's random preset alias, secret-token hash, current
arithmetic question and correct answer, and progress count. A submitted answer
is checked and then discarded; it is not added to the room. The room code is
not a seat credential. The secret seat token is sent
only in a secure, HTTP-only, same-site cookie; it is unusable when the room is
closed, expires, or is erased by an API restart. Rooms have no student name,
account link, roster mapping, free text, chat, public lobby, spectators,
persistent scores, or analytics.

Game abuse prevention holds a normalized network-address key in an exact-expiry
in-process counter for no more than five minutes and an answer counter keyed by
the one-way seat-token hash for no more than one minute. These counters are not
written to MongoDB, student records, or analytics. The room's own seat-token
hash remains only until that room closes, expires, or the process restarts.

## Access and correction

Parents, guardians, students, the school, or the district use the exact
`SCHOOL_PRIVACY_CONTACT` process shown on `/student-privacy`. The requester
provides the school-approved alias and requested action; the school or district
performs its approved identity and authority verification before Julio uses
Admin.

For an alias typo, choose **Correct username**, re-enter Julio's password, and
enter the corrected school-approved alias. This preserves the same account,
credentials, synced projects, and review copies while rotating the session
version so existing student sessions must sign in again. Do not implement an
alias correction by deleting and recreating the account.

Alias correction is the only Admin correction operation. While student account
routes are enabled and the account is active, the signed-in student can edit
that student's own saved project titles, code, and files in the IDE. Julio may
view a project and maintain a separate review copy, but Admin does not rewrite
the student's source project. If account routes are disabled while retained
records remain in maintenance, student sign-in, project editing, and project
review are unavailable; Julio retains only the roster, alias-correction, export,
deletion-receipt, and permanent-deletion tools needed to service authorized
record requests. Do not promise a generic Admin project-correction workflow.

Export, disable, or permanently delete the record when that is the authorized
action. For any other requested change, follow the school or district's approved
process rather than altering retained student code in Admin. A parent or
guardian may refuse future optional account collection or use through the
school process; anonymous courses and browser-local Python saves remain
available on CS, while Graph Sketcher remains available on Math.

## Export

At `/admin`, choose **Export records** for the student and re-enter Julio's
password. The JSON export includes every retained active or soft-deleted Python
project and review copy plus safe account metadata and a record inventory. It
reports the count of pending provider attempts but does not export those
temporary attempt records. The server reads projects and reviews from the
database one record at a time and streams the JSON response, rather than
building a second complete classroom record in server memory.

Credential hashes and temporary provider verifier, nonce, state, and
browser-binding values are deliberately excluded because they are security
proofs rather than useful educational records. The export includes an
operation ID and timestamp. Store or transmit the downloaded file only through
the school or district's approved channel. The Admin browser treats the
response as a download Blob instead of parsing and re-serializing the complete
record as JavaScript objects.

## Permanent deletion

Before deletion, export the record if the approved request process requires a
copy. Then choose **Delete records**, re-enter Julio's password, and type the
exact username.

The API first disables the account and rotates its session version. It closes
that student's record-operation gate and waits for any project or review write,
Admin account change, export, or provider-link operation that already entered
to finish. A provider callback also requires the original active account and
session version, so a callback cannot attach an identity after revocation.
After the drain, the API writes a second disabled session-version fence. This
closes the race in which an Admin account operation that entered just before
the gate closed could otherwise finish after the first revocation. The student
row also carries a hidden deletion-pending marker, so a partial operation cannot
be reactivated, reset, or reviewed after an API restart. Only then does the API
create a durable deletion receipt and delete pending provider
attempts associated with setup, all Python projects, all review copies, and the
student row containing password, access-code, and provider-subject hashes. A
late request cannot recreate those records after the deletion sweep. After the
first deletion fence succeeds, a partial failure leaves the account disabled,
marks the receipt for retry where possible, appears in Julio's roster as
**Deletion needs retry**, and lets Julio retry the same **Delete records**
operation. A failure before that first fence leaves the record eligible for the
next scheduled sweep only when the operation was an automatic retention
deletion. For a manual request, no pending state was recorded; reissue the
authorized **Delete records** operation. Other account-management and
project-review controls remain unavailable while deletion is pending.

The response supplies an operation ID, subject-linked receipt, and
primary-database deletion counts. The receipt contains the internal student ID
and school-approved alias so an authorized backup operator can find the right
record; it does not contain credentials or project contents. `/admin`
automatically downloads the receipt after a completed deletion and lets Julio
download any still-retained receipt again. An unfinished receipt has no TTL
deadline and remains available only while deletion needs completion or retry.
Once deletion completes, its 90-day follow-up period begins. It is then
excluded from Admin and scheduled for physical deletion by MongoDB's
asynchronous TTL cleanup. It may remain physically present briefly after
logical exclusion while that cleanup runs.

The application cannot erase independent infrastructure backups. Store or
transmit a downloaded receipt only through the school or district's approved
channel, use its subject fields to complete deletion from any retained backup
copy, and remove the downloaded receipt under that approved process when the
follow-up is complete. Do not restore a deleted student record from backup
except through an authorized incident-recovery process that also reapplies the
deletion.

The operation gate is process-local. Canonical native production runs exactly
one systemd API process. The manually selected Compose fallback likewise fixes
the API to one named container and prevents `docker compose --scale` from
creating a second API process. Do not run another API process against this
database unless the gate is replaced with a tested database-distributed
design.

## Retention and reporting

New accounts receive the selected 30–365-day deadline at creation. Every
successful password, one-time-code, Google, or Apple sign-in renews that
deadline from the successful authentication time; Admin inspection, alias
correction, password reset, export, and project review do not renew it. At
startup, legacy account rows that predate the deadline field and rows carrying
a different previously configured policy receive one full current period from
that migration time. The persisted policy-days value prevents later sweeps
from repeatedly extending the deadline. This deliberately avoids immediate
retroactive deletion when a policy is first enabled, increased, or decreased.

The API completes one retention sweep before it begins listening and then runs
a non-overlapping sweep hourly. Expired rows use the same two-fence,
write-drain, receipt, and collection-deletion path as Julio's manual deletion.
A concurrent successful sign-in wins only by atomically renewing the deadline
before the first deletion fence. After that fence succeeds, failed cleanup
leaves a disabled, deletion-pending row visible to Julio for retry. A failure
before the fence leaves the record eligible for the next scheduled sweep.
Automatic receipts identify
their reason as `retention-expiry`; manual receipts use `julio-request`. Both
remain without a TTL deadline while unfinished. Their 90-day follow-up period
starts only after completion; they are then excluded from Admin and scheduled
for asynchronous physical TTL deletion, so they may remain physically present
briefly afterward. A pending retry keeps the original reason and operation ID
and reuses the same receipt. Legacy pending rows without that metadata are
treated as Julio-requested deletions and receive stable metadata on their first
retry.

Anonymous daily rows are capped to the configured 7–90 day window at startup,
on each write, and on summary reads. MongoDB TTL cleanup is asynchronous, so
expired rows are excluded before physical cleanup and may remain physically
present briefly afterward.

Browsers make at most one reporting attempt per tab, fixed event, fixed course,
and UTC day. The tab-local attempt marker is written before the request and is
never cleared during that tab, including after an error or ambiguous response.
This intentionally prefers undercounting over duplicate counts because the
anonymous request has no identifier with which the server could distinguish an
unrecorded request from a recorded request whose response was lost. These
client-supplied counts can still undercount or be manipulated; use them only as
a broad engagement indicator.

Both reviewed production handoffs disable classroom access logs. If a
school-authorized infrastructure layer separately retains narrowly scoped
security logs, it remains outside the application database and must use the
approved short retention and deletion process.

## End of service

When the classroom use ends:

1. Stop issuing access codes. In Admin, disable every remaining student account
   so its signed sessions are invalidated.
2. Export any records the approved process requires.
3. Delete each student through the Admin workflow and complete backup
   follow-up.
4. Set `STUDENT_ACCOUNTS_ENABLED`, `STUDENT_OAUTH_ENABLED`, and
   `CLASSROOM_ANALYTICS_COLLECTION_ENABLED` to `false`, while retaining the
   approved `STUDENT_RECORD_RETENTION_DAYS` until all account records and
   still-available deletion receipts are gone, then rebuild the frontend.
5. Confirm student and OAuth HTTP routes return `404` and the header has no
   student sign-in control.
6. While anonymous collection remains disabled, permanently remove its
   database rows with the non-HTTP operator command for the active deployment.
   Both paths refuse a missing or additional confirmation argument, require
   `CLASSROOM_ANALYTICS_COLLECTION_ENABLED=false`, select the configured
   application Mongo credential through the same fail-closed environment/Vault
   path as the API, require the actual connected database to be exactly
   `cs-avasan-org`, report the deletion count, and exit unsuccessfully unless a
   second primary-database count verifies zero rows.

   For the Compose fallback:

    ```bash
    ./scripts/verify-deploy-env-permissions.sh
    docker compose --env-file deploy/cs.env -f compose.production.yml --profile tools run --rm admin-tools npm run -w back-end purge-classroom-analytics-ts -- --confirm-delete-all-classroom-analytics
    ```

   For the canonical native deployment, use the wrapper from the active
   immutable release:

    ```bash
    sudo /srv/cs.avasan.org/current/scripts/purge-native-classroom-analytics.sh --confirm-delete-all-classroom-analytics
    ```

   The native wrapper also requires the canonical API environment to be a
   regular root-owned mode-`0600` file, verifies the active release identity and
   public-policy configuration, and runs only the compiled active-release CLI
   as the unprivileged `cs-avasan` service user. If `api.env` was changed to
   disable collection after the current release was built, deploy a coherent
   release before purging; the wrapper intentionally rejects that drift.

    Record the command output in the school or district's approved closure
    record, complete any separately approved backup deletion, and retire the
    provider credentials. Do not add an HTTP purge endpoint.

7. Verify the public anonymous CS courses, IDE, and browser saves still work;
   verify Graph Sketcher separately on `math.avasan.org`.
