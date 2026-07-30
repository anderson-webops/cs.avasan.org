<script lang="ts" setup>
import { schoolPrivacyContact as configuredSchoolPrivacyContact } from "@/modules/classroomFeatures";

defineOptions({ name: "StudentPrivacyPage" });
const schoolPrivacyContact = configuredSchoolPrivacyContact();
</script>

<template>
	<article class="page-shell page-shell--narrow privacy-page">
		<header class="privacy-page__header">
			<p class="privacy-page__eyebrow">Classes with Julio</p>
			<h1 class="page-title">Student privacy</h1>
			<p>
				This classroom uses only the information needed to teach and to
				operate the features students choose to use. Optional accounts
				can sync Python work; Graph Sketcher work stays in the student's
				current browser tab.
			</p>
		</header>

		<section class="site-surface privacy-page__section">
			<h2>Anonymous classroom counts</h2>
			<p>
				When school-authorized classroom counts are enabled, the CS and
				Math sites may count a course opening once per selected course,
				a Python IDE opening on the CS site, and a Graph Sketcher
				opening on the Math site, once per browser tab each day. These
				are anonymous daily totals. They are kept for up to 90 days.
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
			<h2>Graph work saved in browser tabs</h2>
			<p>
				Graph Sketcher keeps a recovery copy in the current browser tab
				so it can survive a reload. Some browsers also copy this
				tab-only storage when a tab is duplicated. Graph projects and
				graph contents are not sent to the classroom server, student
				accounts, or analytics.
			</p>
			<p>
				On a shared computer, a student should download work they want
				to keep, then use <strong>Clear for next student</strong> in
				every open or duplicated Graph Sketcher tab and close those
				tabs. Work left in a tab may be visible to the next person who
				uses it.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Python work saved in a shared browser</h2>
			<p>
				Without an account, the Python IDE saves projects and editor
				state in browser storage on that computer. Anyone who later uses
				the same browser profile could otherwise see or change work left
				there.
			</p>
			<p>
				On a shared computer, download anything that should be kept and
				follow Julio’s instructions for ending the browser session
				before the next student begins. Close every Python IDE tab when
				finished. Projects already saved to a signed-in account are not
				part of the browser-local workspace.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Optional student accounts</h2>
			<p>
				Courses and browser saves work without an account. Julio may
				create an optional account with a username and no email, so a
				student can save Python projects across devices. The username
				must be a school-approved alias, not a full name, birthdate,
				student number, or other direct identifier; any roster mapping
				stays in the school’s approved system.
			</p>
			<p>
				For signed-in students, the classroom keeps the username, login
				and password-management records, and saved-project metadata
				needed for saving work and Julio’s instruction. Julio can view
				saved projects to teach and review student work. A student uses
				Julio’s one-time code before creating a password or connecting
				one Google or Apple sign-in. Access codes are never used as
				analytics identifiers.
			</p>
			<p>
				If a student connects Google or Apple, the classroom stores the
				provider and a hash of that provider’s opaque account
				identifier. It does not request or store the student’s provider
				email, name, profile, or provider access tokens. Google or Apple
				receives a sign-in request only when the student chooses its
				button. The classroom does not send the student’s classroom
				username, one-time code, or projects to the provider. The
				provider learns that its account was used to sign in and may
				receive ordinary browser and network information under
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
				Account and project retention is controlled by the school or
				district authorization for the classroom. When Julio permanently
				deletes an account, the classroom keeps a short-lived deletion
				receipt with the school-approved alias, internal account ID,
				status, and deletion counts for up to 90 days so the school can
				complete authorized backup deletion. The receipt does not
				include a password, access code, provider identifier, project,
				or code.
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
			<h2>What this classroom does not do</h2>
			<p>
				There are no ads, sales of student information, cross-site
				tracking, location tracking, device fingerprinting, session
				replay, keystroke tracking, or collection of code content as
				analytics.
			</p>
		</section>

		<section class="site-surface privacy-page__section">
			<h2>Questions and student record requests</h2>
			<p>
				A parent, guardian, student, school, or district may ask to
				access, correct, export, or delete account and project records
				through Julio and the school or district channel.
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
</style>
