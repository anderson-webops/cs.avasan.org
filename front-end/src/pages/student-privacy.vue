<script lang="ts" setup>
import {
	classroomAnalyticsRetentionDays,
	classroomPrivacyOperatorNotice,
	classroomPrivacyPolicyEffectiveDate,
	classroomPrivacyPolicyVersion,
	classroomServiceProviderNotice,
	schoolPrivacyContact as configuredSchoolPrivacyContact,
	studentRecordRetentionDays
} from "@/modules/classroomFeatures";

defineOptions({ name: "StudentPrivacyPage" });
const schoolPrivacyContact = configuredSchoolPrivacyContact();
const analyticsRetentionDays = classroomAnalyticsRetentionDays();
const operatorNotice = classroomPrivacyOperatorNotice();
const serviceProviderNotice = classroomServiceProviderNotice();
const accountRetentionDays = studentRecordRetentionDays();
const policyVersion = classroomPrivacyPolicyVersion();
const policyEffectiveDate = classroomPrivacyPolicyEffectiveDate();
</script>

<template>
	<article class="page-shell page-shell--narrow privacy-page">
		<header class="privacy-page__header">
			<p class="privacy-page__eyebrow">Classes with Julio</p>
			<h1 class="page-title">Student privacy</h1>
			<p>
				This classroom uses only the information needed to teach and to
				operate the features students choose to use. Optional accounts
				can sync Python-family IDE work; Math's Graph Sketcher work
				stays in the student's current browser tab.
			</p>
		</header>

		<section class="site-surface privacy-page__section">
			<h2>Anonymous classroom counts</h2>
			<p v-if="analyticsRetentionDays">
				When school-authorized classroom counts are enabled, the CS and
				Math sites may count a course opening once per selected course,
				an IDE opening on the CS site, and a Graph Sketcher opening on
				the Math site, once per browser tab each day. These are
				anonymous daily totals. They logically expire and are excluded
				from reports after {{ analyticsRetentionDays }} days. Database
				cleanup is asynchronous, so physical removal may happen briefly
				later.
			</p>
			<p v-else>
				Anonymous classroom counts remain disabled until the school or
				district approves a specific whole-number period from 7 through
				90 days. No analytics retention default is assumed.
			</p>
			<p>
				These counts do not include a username, account or access code,
				project name, code, page address, referrer, location, or device
				fingerprint. Each count includes only the fixed site, supported
				event type, and, for a course opening, its fixed course ID. Both
				sites honor browser Do Not Track and Global Privacy Control
				signals.
			</p>
			<p>
				Each tab marks a count as attempted before sending it and does
				not retry after an error or missing response. This may
				undercount activity, but prevents an uncertain response from
				causing a duplicate count without adding an identifier.
			</p>
			<p>
				The classroom server may hold a network address in memory for up
				to five minutes to prevent automated flooding. Each temporary
				counter is deleted when that five-minute window ends. It is not
				added to classroom analytics. Any hosting security logs must
				follow the school or district’s approved retention rules.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Math graph work saved in browser tabs</h2>
			<p>
				Math's Graph Sketcher keeps a recovery copy in the current
				browser tab so it can survive a reload. Some browsers also copy
				this tab-only storage when a tab is duplicated. Graph projects
				and graph contents are not sent to the classroom server, student
				accounts, or analytics.
			</p>
			<p>
				On a shared computer, a student should download work they want
				to keep, then use <strong>Clear for next student</strong> in
				every open or duplicated Math Graph Sketcher tab and close those
				tabs. Work left in a tab may be visible to the next person who
				uses it.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Classroom games</h2>
			<p>
				Crosswalk Critters, Machine Workshop, and Comet Hopper run in
				the current browser. They do not save game play, send answers or
				scores to the classroom server, or add events to classroom
				analytics.
			</p>
			<p>
				For a Pond Paddlers class race, Julio creates a private room and
				students enter its short room code. The server assigns each
				browser a random preset animal alias and a separate secret seat
				cookie. During that room, it keeps only the alias, current
				arithmetic question, and progress needed to run the race. A
				student’s submitted answer is checked and then discarded. In
				team relay, one team shares one browser; the site does not store
				a team name or membership list. There is no student name,
				account link, chat, public lobby, permanent score, or game
				analytics.
			</p>
			<p>
				A Pond Paddlers room and its seat records stay only in the
				running server’s memory. Julio can close the room sooner;
				otherwise it ends within two hours or when the game service
				restarts. The browser seat cookie is unusable after the room
				ends.
			</p>
			<p>
				To prevent automated flooding, temporary game counters may keep
				a network address in server memory for up to five minutes and a
				one-way seat-cookie hash for up to one minute. Each counter is
				deleted when its window ends and is not added to a student
				record or analytics.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>IDE work saved in a shared browser</h2>
			<p>
				Without an account, the IDE saves projects and editor state in
				browser storage on that computer. Anyone who later uses the same
				browser profile could otherwise see or change work left there.
			</p>
			<p>
				On a shared computer, download anything that should be kept and
				follow Julio’s instructions for ending the browser session
				before the next student begins. Close every IDE tab when
				finished. Python-family projects already saved to a signed-in
				account are not part of the browser-local workspace. Java,
				Karel, and BlueJ projects always remain in browser storage
				unless a student downloads them.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Optional student accounts</h2>
			<p>
				Courses and browser saves work without an account. Julio may
				create an optional account with a username and no email, so a
				student can save Python-family projects across devices. The
				username must be a school-approved alias, not a full name,
				birthdate, student number, or other direct identifier; any
				roster mapping stays in the school’s approved system.
			</p>
			<p>
				For signed-in students, the classroom keeps the username, login
				timestamps, account status, record-deletion deadline, and
				password and one-time-code hashes, session version, failed-login
				counter, temporary lockout, and the last random password-setup
				request marker needed to recognize a safely retried password
				submission. The matching marker is kept in that tab’s session
				storage while setup may need to finish or retry; it is cleared
				after setup or sign-out and otherwise ends with the tab session.
				The account copy is replaced or cleared during later access
				setup and is deleted with the account. It is not a password or
				access code. During an open inspection or review request, the
				account also keeps a fixed preservation purpose and status, the
				latest placed and released times, and at most the last 32 fixed
				placed or released timestamp events. It does not keep a
				requester name or request notes. A saved Python project includes
				its title, mode, file names, source code or encoded project
				assets, selected file, course/starter metadata, size, import
				identifier, and creation and update times. Julio can view those
				projects to teach and may create a separate review copy
				containing the copied files, visibility setting, and a teacher
				note. A student uses Julio’s one-time code before creating a
				password or connecting one Google or Apple sign-in. Access codes
				are never used as analytics identifiers.
			</p>
			<p>
				Students should keep personal information out of synced work. Do
				not put a real name, email, phone number, home address, precise
				location, student number, password, or access code in a project
				title, file name, code, or asset. The classroom does not scan
				project contents for personal information and does not copy code
				into logs or analytics. A student can always keep using the IDE
				without signing in.
			</p>
			<p>
				If a student connects Google or Apple, the classroom stores the
				provider and a hash of that provider’s opaque account
				identifier. It does not request the student’s provider email,
				name, or profile. The code exchange may transiently receive a
				provider token response so the classroom can validate the
				sign-in; it uses only the verified opaque subject and does not
				persist provider tokens. Google or Apple receives a sign-in
				request only when the student chooses its button. The classroom
				does not send the student’s classroom username, one-time code,
				or projects to the provider. The provider learns that its
				account was used to sign in and may receive ordinary browser and
				network information under
				<a
					href="https://policies.google.com/privacy"
					rel="noopener noreferrer"
					>Google’s privacy policy</a
				>
				or
				<a
					href="https://www.apple.com/legal/privacy/"
					rel="noopener noreferrer"
					>Apple’s privacy policy</a
				>.
			</p>
			<p>
				During a provider round trip, the classroom temporarily keeps
				the provider, sign-in or connection mode, return path, expiry,
				one-way state and browser-binding hashes, PKCE verifier, nonce,
				and, only while connecting, the internal student ID and session
				version. That attempt expires after 10 minutes. The classroom
				does not retain the transient provider token response.
			</p>
			<p>
				A signed, secure browser cookie temporarily carries the internal
				student ID, authentication level, session version, and setup,
				inactivity, and absolute expiry times. It is used only to keep
				the correct student signed in and reject revoked sessions.
				Password setup lasts at most 30 minutes. A full student session
				ends after 30 minutes without activity or after 8 hours,
				whichever comes first. The server does not keep a separate
				session record.
			</p>
			<p>
				<template v-if="accountRetentionDays">
					An optional account and its synced projects are
					automatically deleted after {{ accountRetentionDays }} days
					without a successful student sign-in. A successful sign-in
					renews that deadline. Julio can see the deletion date in
					Admin and may correct, export, or delete the record sooner
					through the approved request process.
				</template>
				<template v-else>
					Optional accounts remain disabled until the school or
					district selects and approves a specific inactivity period
					from 30 to 365 days. The site fails closed when that
					retention setting is missing.
				</template>
			</p>
			<p>
				When Julio or the automatic retention process permanently
				deletes an account, the classroom keeps a short-lived deletion
				receipt with the school-approved alias, internal account ID,
				status, and deletion counts. An unfinished receipt remains
				available only while the deletion needs completion or retry and
				has no database-expiry deadline. After deletion completes, the
				receipt is excluded from Admin after 90 days and then becomes
				eligible for asynchronous database deletion, so physical removal
				may happen briefly later. This lets the school complete
				authorized backup deletion. The receipt does not include a
				password, access code, provider identifier, project, or code.
			</p>
			<p>
				If deletion stops partway, the JSON export contains only the
				account, project, and review records that still exist. The
				matching unfinished deletion receipt is a separate Admin
				download and must be kept with the request record through the
				school’s approved process.
			</p>
			<p>
				To protect account and project endpoints from automated misuse,
				temporary security counters may hold a network address,
				normalized username, or internal student account ID in server
				memory for up to 15 minutes. They are deleted when that window
				ends and are not added to analytics or the student record.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Why records are kept and when they are deleted</h2>
			<dl class="privacy-page__retention">
				<div>
					<dt>
						Optional account, credentials, synced projects, and
						review copies
					</dt>
					<dd v-if="accountRetentionDays">
						Needed to protect the account, sync the student’s work,
						and let Julio teach and review it. The initial deadline
						is
						{{ accountRetentionDays }} days after Julio creates the
						account; each successful password, one-time-code,
						Google, or Apple sign-in renews the deadline by
						{{ accountRetentionDays }} days. Startup and hourly
						cleanup remove the account, provider link, projects, and
						review copies when the deadline passes. After the first
						deletion fence succeeds, an incomplete cleanup leaves
						the account disabled and visible to Julio for retry. A
						failure before that fence leaves the record eligible for
						the next scheduled sweep. An account created before this
						deadline field existed, or carrying a previously
						approved retention period, receives one full
						{{ accountRetentionDays }}-day period when the current
						policy is first applied, so a policy migration does not
						delete a record immediately.
					</dd>
					<dd v-else>
						Accounts remain disabled until the school or district
						approves a specific 30-to-365-day inactivity period. No
						default is assumed.
					</dd>
				</div>
				<div>
					<dt>Open inspection or review preservation hold</dt>
					<dd>
						Needed only while the school has an outstanding request
						to inspect or review the student’s records. The hold
						makes project and review content and the approved alias
						read-only and pauses manual and automatic deletion.
						Julio can export the retained records for inspection
						through the school’s approved process. Student security
						controls remain available only while account routes are
						enabled, the retention deadline is current, and deletion
						has not begun. Maintenance-only, expired, and
						deletion-pending records do not regain student access
						because a hold is placed. The hold remains until Julio
						releases it after the school closes the request and
						keeps only the fixed purpose, status, latest times, and
						up to 32 fixed timestamp events. Request details stay in
						the school’s approved system. If deletion already failed
						partway, the hold preserves only records that remain and
						pauses the next retry; it cannot restore records already
						removed or reactivate the account and its access
						controls. Releasing the hold allows that pending
						deletion retry to resume, and removed records cannot be
						recovered.
					</dd>
				</div>
				<div>
					<dt>Provider sign-in attempt</dt>
					<dd>
						Needed to validate one Google or Apple response; expires
						after 10 minutes and is then scheduled for database
						deletion.
					</dd>
				</div>
				<div>
					<dt>Deleted project or review row</dt>
					<dd>
						A successful project deletion removes its project and
						review rows immediately. If an interrupted or incomplete
						final removal leaves a scrubbed tombstone, the
						application owns its fallback cleanup schedule. An
						active preservation hold suspends that cleanup;
						releasing the hold schedules a fresh one-hour grace
						period. Without a hold, the fallback tombstone becomes
						eligible one hour after deletion. Whole-account deletion
						removes these rows directly.
					</dd>
				</div>
				<div>
					<dt>Security counters</dt>
					<dd>
						Needed to limit automated misuse; anonymous-count
						network counters expire after five minutes, and
						account/project counters expire after at most 15
						minutes.
					</dd>
				</div>
				<div>
					<dt>Anonymous classroom totals</dt>
					<dd v-if="analyticsRetentionDays">
						Needed only for Julio’s coarse classroom-usage view. The
						row logically expires and is excluded after
						{{ analyticsRetentionDays }} days. It then becomes
						eligible for asynchronous database deletion, so physical
						removal may happen briefly later.
					</dd>
					<dd v-else>
						Collection remains disabled until the school or district
						selects a specific whole-number period from 7 through 90
						days. No analytics retention default is assumed.
					</dd>
				</div>
				<div>
					<dt>Deletion receipt</dt>
					<dd>
						Needed to confirm primary deletion and complete approved
						backup follow-up; contains the alias, internal student
						ID, reason, status, times, and deletion counts. While
						unfinished, it remains available only so deletion can be
						completed or retried and has no database-expiry
						deadline. After completion it is excluded from Admin
						after 90 days, then becomes eligible for asynchronous
						database deletion; physical removal may happen briefly
						later. It contains no credential or project content.
					</dd>
				</div>
				<div>
					<dt>Deleted-account write gate</dt>
					<dd>
						After permanent deletion, the running API process keeps
						only the deleted account’s internal database ID in a
						closed in-memory write gate until that process restarts.
						This process-lifetime tombstone contains no alias,
						credential, project, or code. It prevents a request that
						authenticated before deletion from arriving late and
						recreating deleted work.
					</dd>
				</div>
				<div>
					<dt>Pond Paddlers room and seat</dt>
					<dd>
						Needed only to run Julio’s private class race; kept in
						server memory until Julio closes the room, two hours
						pass, or the game service restarts. It is not retained
						as a student record or classroom analytics.
					</dd>
				</div>
				<div>
					<dt>Pond Paddlers security counters</dt>
					<dd>
						Needed to limit automated joining and answer flooding;
						network-address counters expire within five minutes and
						a seat-hash answer counter expires within one minute.
					</dd>
				</div>
				<div>
					<dt>Browser-local Math Graph and anonymous IDE work</dt>
					<dd>
						Kept in that browser only so a reload does not lose
						work; remains until the student clears it, the browser
						clears storage, or the browser profile is removed.
					</dd>
				</div>
			</dl>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Operator and approved service providers</h2>
			<p v-if="operatorNotice">
				<strong>Operator contact information:</strong>
				{{ operatorNotice }}
			</p>
			<p v-else>
				Optional student-data features remain disabled. Before any are
				enabled, this notice must identify every operator and provide
				the reviewed postal address, telephone number, and email
				address.
			</p>
			<p v-if="serviceProviderNotice">
				<strong>Approved service providers:</strong>
				{{ serviceProviderNotice }}
			</p>
			<p v-else>
				Before optional student-data features are enabled, this notice
				must name each approved infrastructure or identity provider,
				explain its limited classroom purpose, and describe the student
				information it handles.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>What this classroom does not do</h2>
			<p>
				There are no ads, sales of student information, cross-site
				tracking, location tracking, device fingerprinting, session
				replay, keystroke tracking, or collection of code content as
				analytics. Student accounts, projects, reviews, and deletion
				receipts are not public. A signed-in student sees only that
				student’s records; Julio is the only teacher/Admin.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Questions and student record requests</h2>
			<p>
				A parent, guardian, student, school, or district may ask to
				access or export retained account and project records, delete
				them, or correct the school-approved username alias associated
				with them through Julio and the school or district channel.
				While an account is active, the signed-in student can edit that
				student’s own saved project titles, code, and files in the IDE.
				Julio’s Admin correction tool changes only the approved alias;
				it does not rewrite a student’s project content or review
				copies.
			</p>
			<p>
				Once the school confirms an applicable inspection or review
				request, Julio can place a fixed-purpose preservation hold. The
				hold waits for content changes already in progress, then blocks
				project and review changes, alias correction, and manual or
				automatic deletion. Julio’s JSON export remains available for
				inspection. Security controls such as sign-in, sign-out,
				password or provider setup, access reset, and disabling an
				account remain available only when account routes are enabled,
				the retention deadline is current, and deletion has not begun. A
				hold does not reactivate a maintenance-only, expired, or
				deletion-pending record. Requester and case details stay in the
				school’s approved system, not this site. Julio releases the hold
				only after the school closes the request. If a deletion attempt
				already removed some records, the hold preserves only what
				remains and pauses the next retry; it cannot restore removed
				records or reactivate the account and its access controls.
				Releasing the hold allows a pending deletion retry to resume,
				and already-removed records cannot be recovered.
			</p>
			<p>
				The application hold controls only the canonical classroom
				database. The school must separately identify and preserve any
				approved backup, replica, export, or other system that contains
				the record. The school must provide access within a reasonable
				period and no later than 45 days, with explanations or an
				alternative such as copies when effective inspection cannot
				otherwise be provided. The hold preserves records; it does not
				by itself fulfill the request.
			</p>
			<p>
				If the school later authorizes an alias correction, complete the
				inspection or review first and preserve the original outside
				this application if required. After the school closes that
				request, Julio releases the hold and then performs the
				separately approved alias correction. The application does not
				amend a held record.
			</p>
			<p>
				Use the contact below, identify the school-approved alias and
				the requested action, and follow the school’s
				identity-verification process. After authorization, Julio can
				export the retained record as JSON, correct the alias, disable
				access, or permanently delete the complete account record. A
				parent or guardian may refuse further account collection or use
				by asking the school to disable and delete the optional account;
				the student can still use public courses, browser-local IDE
				saves, and Math's Graph Sketcher without signing in.
			</p>
			<p>
				California Business and Professions Code section 22584(d)(3)
				also provides a direct operator deletion path for CCPA-excluded
				covered information. A parent or guardian, or a former pupil who
				is at least 18, may use the configured operator contact after
				the pupil has been unenrolled from the local educational agency
				for at least 60 days. The operator must require documentation of
				non-enrollment before deletion. Statutory exclusions include
				mandatory permanent pupil records and certain official pupil
				records, including the categories described in that section; the
				authorized school or legal process decides whether an exclusion
				applies. This direct path does not replace the ordinary
				school-channel request process above.
			</p>
			<p v-if="operatorNotice" class="privacy-page__contact">
				<strong>Operator contact for that direct request:</strong>
				{{ operatorNotice }}
			</p>
			<p v-else class="privacy-page__contact">
				Optional student accounts remain disabled until the reviewed
				operator notice provides the direct operator contact.
			</p>
			<p>
				If student account routes are later disabled while records
				remain in retention maintenance, preservation review, alias
				correction, export, deletion-receipt access, and permanent
				deletion remain available to Julio. Student sign-in, project
				editing, and project-review tools do not. Julio uses the JSON
				export, not an in-app project viewer, to inspect maintenance or
				held records. Any other requested change must follow the school
				or district’s approved process; Julio does not rewrite retained
				student code in Admin.
			</p>
			<p v-if="schoolPrivacyContact" class="privacy-page__contact">
				<strong>School or district contact:</strong>
				{{ schoolPrivacyContact }}
			</p>
			<p v-else class="privacy-page__contact">
				Use the school or district contact information provided with
				student access. Before account-linked classroom use or anonymous
				activity counts are enabled in production, the direct privacy
				notice must include the current school or district contact.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Notice version and changes</h2>
			<p>Policy version: {{ policyVersion || "Not configured" }}.</p>
			<p>
				Effective date:
				{{ policyEffectiveDate || "Not yet effective" }}.
			</p>
			<p>
				Before a material change to the information collected, its use
				or disclosure, an approved provider, a retention period, or a
				security or deletion practice, the operator will send a new
				direct notice through the school’s approved channel and obtain
				renewed school or district authorization. This page will then
				show the new version and effective date. Optional student-data
				features remain disabled when either value is missing, invalid,
				or not yet effective.
			</p>
		</section>
	</article>
</template>

<style scoped>
.privacy-page {
	display: grid;
	gap: 1rem;
}

.privacy-page__header,
.privacy-page__section {
	display: grid;
	gap: 0.75rem;
}

.privacy-page__header {
	padding-bottom: 0.35rem;
}

.privacy-page__header > p:last-child,
.privacy-page__section p {
	color: var(--color-ink-soft);
	line-height: 1.65;
}

.privacy-page__eyebrow {
	color: var(--color-accent);
	font-size: 0.78rem;
	font-weight: 900;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.privacy-page__section {
	padding: clamp(1rem, 3vw, 1.5rem);
}

.privacy-page__section h2 {
	font-size: clamp(1.35rem, 3vw, 1.75rem);
}

.privacy-page__contact {
	padding: 0.8rem 0.9rem;
	border-radius: var(--radius-sm);
	background: var(--color-accent-soft);
}

.privacy-page__retention {
	display: grid;
	gap: 0.9rem;
	margin: 0;
}

.privacy-page__retention > div {
	display: grid;
	gap: 0.25rem;
	padding-bottom: 0.85rem;
	border-bottom: 1px solid var(--color-border);
}

.privacy-page__retention > div:last-child {
	padding-bottom: 0;
	border-bottom: 0;
}

.privacy-page__retention dt {
	color: var(--color-ink);
	font-weight: 800;
}

.privacy-page__retention dd {
	margin: 0;
	color: var(--color-ink-soft);
	line-height: 1.65;
}
</style>
