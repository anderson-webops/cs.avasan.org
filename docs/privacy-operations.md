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

Courses, the Python IDE, browser saves, and Graph Sketcher remain available
without these features. Do not enable any student-data feature until all of the
following are complete:

1. The school or district has approved the feature and its intended classroom
   use.
2. The exact direct privacy contact supplied with student access is available.
   Do not invent a contact.
3. The public `/student-privacy` page has been built with that contact and
   reviewed in the deployed site.
4. The school or district has supplied its record-access, correction, export,
   deletion, backup, security-log, and end-of-service retention process.
5. Julio understands that anonymous totals are directional signals, not
   attendance, grades, or evidence about an individual student.

The backend requires `CLASSROOM_PRIVACY_APPROVED=true`,
`SCHOOL_PRIVACY_CONTACT`, and the desired feature flag. The frontend build
independently requires `VITE_CLASSROOM_PRIVACY_APPROVED=true`,
`VITE_SCHOOL_PRIVACY_CONTACT`, and its matching feature flag. Missing or
inconsistent configuration fails closed.

| Feature                                   | Backend                                                                 | Frontend build                                      |
| ----------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------- |
| Optional student accounts and Python sync | `STUDENT_ACCOUNTS_ENABLED=true`                                         | `VITE_STUDENT_ACCOUNTS_ENABLED=true`                |
| Apple or Google sign-in                   | `STUDENT_OAUTH_ENABLED=true` plus account flag and provider credentials | `VITE_STUDENT_OAUTH_ENABLED=true` plus account flag |
| Anonymous CS and Math counts              | `CLASSROOM_ANALYTICS_COLLECTION_ENABLED=true`                           | `VITE_CLASSROOM_USAGE_ENABLED=true` in each site    |

OAuth is unavailable unless accounts are enabled. Provider apps must request
only the OpenID identity needed for an opaque subject. Do not add email,
profile, name, avatar, or offline-access scopes.

## Data inventory

Julio must create each username as a school-approved, non-identifying alias
(for example, `river-7`), never a student's full legal name, email, birthdate,
student number, or other direct identifier. Any alias-to-roster mapping belongs
only in the school or district's approved record system, not this classroom
application.

The optional account system owns:

- the username, account status, login timestamps, credential hashes, and
  session-version counter;
- a provider name and hash of an opaque Apple or Google subject, when chosen;
- pending provider attempts, containing short-lived verifier, nonce, state,
  and browser-binding proof;
- in-memory abuse-prevention counters keyed by a network address, normalized
  username, or internal student account ID for no longer than their configured
  window (five minutes for anonymous activity reporting and at most 15 minutes
  for account and project endpoints);
- synced Python projects, including code and project metadata; and
- Julio's separate project review copies and notes.

Sessions are signed browser cookies, not a server-side session collection.
Rotating or deleting the student's session version invalidates every existing
copy. Each abuse-prevention key uses an exact-expiry in-process store, is
deleted when its own window ends, and is never written to MongoDB or analytics.
Anonymous graph projects never enter this inventory.

The anonymous count system owns only UTC day, fixed site, fixed event, optional
allowlisted course ID, total count, and expiry. It has no account key or
student-level join.

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
late request cannot recreate those records after the deletion sweep. A partial
failure leaves the account disabled, marks the receipt for retry where
possible, and lets Julio retry the operation.

The response supplies an operation ID, subject-linked receipt, and
primary-database deletion counts. The receipt contains the internal student ID
and school-approved alias so an authorized backup operator can find the right
record; it does not contain credentials or project contents. `/admin`
automatically downloads the receipt after a completed deletion and lets Julio
download any still-retained receipt again. Receipts are excluded from that
Admin list after 90 days and are scheduled for physical deletion by MongoDB's
asynchronous TTL cleanup.

The application cannot erase independent infrastructure backups. Store or
transmit a downloaded receipt only through the school or district's approved
channel, use its subject fields to complete deletion from any retained backup
copy, and remove the downloaded receipt under that approved process when the
follow-up is complete. Do not restore a deleted student record from backup
except through an authorized incident-recovery process that also reapplies the
deletion.

The operation gate is process-local. The reviewed production Compose file
intentionally fixes the API to one named container, which prevents
`docker compose --scale` from creating a second API process. Do not run another
API process against this database unless the gate is replaced with a tested
database-distributed design.

## Retention and reporting

Anonymous daily rows are capped to the configured 7–90 day window at startup,
on each write, and on summary reads. MongoDB TTL cleanup is asynchronous, so
expired rows are excluded before physical cleanup.

Browsers make at most one reporting attempt per tab, fixed event, fixed course,
and UTC day. The tab-local attempt marker is written before the request and is
never cleared during that tab, including after an error or ambiguous response.
This intentionally prefers undercounting over duplicate counts because the
anonymous request has no identifier with which the server could distinguish an
unrecorded request from a recorded request whose response was lost. These
client-supplied counts can still undercount or be manipulated; use them only as
a broad engagement indicator.

The production container and supplied host proxy disable access logs. If a
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
4. Set all five backend/frontend feature flags to `false` and rebuild the
   frontend.
5. Confirm student and OAuth HTTP routes return `404` and the header has no
   student sign-in control.
6. While anonymous collection remains disabled, permanently remove its
   database rows with the non-HTTP operator command below. It refuses to run
   without the exact confirmation flag, reports the deletion count, and exits
   unsuccessfully unless a second primary-database count verifies zero rows:

    ```bash
    ./scripts/verify-deploy-env-permissions.sh
    docker compose --env-file deploy/cs.env -f compose.production.yml --profile tools run --rm admin-tools npm run -w back-end purge-classroom-analytics-ts -- --confirm-delete-all-classroom-analytics
    ```

    Record the command output in the school or district's approved closure
    record, complete any separately approved backup deletion, and retire the
    provider credentials. Do not add an HTTP purge endpoint.

7. Verify the public anonymous courses, IDE, browser saves, and Graph Sketcher
   still work.
