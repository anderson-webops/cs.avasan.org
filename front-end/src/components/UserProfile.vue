<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ProfileFields from "@/components/ProfileFields.vue";
import UserCommunicationPanel from "@/components/UserCommunicationPanel.vue";
// import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

/* -------------------------------------------------- */
/*  Pinia state                                       */
/* -------------------------------------------------- */
const app = useAppStore();
const { currentUser, tutors } = storeToRefs(app);
// const deleteMe = useDeleteAccount("user");

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);
const courseOptions = computed(() => courses.value ?? []);
const courseNameMap = computed<Record<string, string>>(
	() =>
		courseOptions.value?.reduce(
			(map, course) => {
				map[course.id] = course.name;
				return map;
			},
			{} as Record<string, string>
		) ?? {}
);

/* -------------------------------------------------- */
/*  editable helper                                   */
/* -------------------------------------------------- */
const { editing, toggle, save } = useEditable("user");

/* -------------------------------------------------- */
/*  edit flow helpers                                 */
/* -------------------------------------------------- */
function onStartEdit() {
	if (!currentUser.value) return;
	toggle();
}

function onCancelEdit() {
	toggle();
}

async function onSaveEdit() {
	if (!currentUser.value) return;
	await save(currentUser.value);
	// Assuming `save` handles updating state / possibly toggling editing.
	// If not, you can explicitly set editing.value = false here.
}

/* -------------------------------------------------- */
/*  assigned tutor names                              */
/* -------------------------------------------------- */
const assignedTutorNames = computed(() => {
	if (!currentUser.value?.tutors?.length) return [] as string[];
	return currentUser.value.tutors
		.map(t =>
			typeof t === "string"
				? (tutors.value.find(tt => tt._id === t)?.name ?? null)
				: t.name
		)
		.filter((name): name is string => !!name);
});

/* -------------------------------------------------- */
/*  course access text                                */
/* -------------------------------------------------- */
const courseAccessText = computed(() => {
	const user = currentUser.value;
	if (!user?.courseAccess?.length) return "No course access yet";
	const names = courseNameMap.value ?? {};
	return user.courseAccess.map(id => names[id] ?? id).join(", ");
});

const assignedTutorCount = computed(() => assignedTutorNames.value.length);
const courseAccessCount = computed(
	() => currentUser.value?.courseAccess?.length ?? 0
);

/* -------------------------------------------------- */
/*  field list (aligned with Admin users list)        */
/* -------------------------------------------------- */
const fields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" }
	// Age / State omitted here to mirror the admin Users list.
];
</script>

<template>
	<section class="profile-workspace">
		<header class="workspace-header">
			<div>
				<p class="workspace-eyebrow">Student profile</p>
				<h2>Account overview</h2>
				<p>
					Review tutor assignments, confirm course access, and keep
					your login details current in one calm workspace.
				</p>
			</div>
			<div class="workspace-stats">
				<div class="stat-pill">
					<span>Tutors</span>
					<strong>{{ assignedTutorCount }}</strong>
				</div>
				<div class="stat-pill">
					<span>Courses</span>
					<strong>{{ courseAccessCount }}</strong>
				</div>
			</div>
		</header>

		<article v-if="currentUser" class="workspace-sheet">
			<div class="sheet-summary">
				<div class="summary-block">
					<p class="summary-label">Assigned tutors</p>
					<p class="summary-copy">
						{{
							assignedTutorNames.length
								? assignedTutorNames.join(", ")
								: "No tutor assigned yet"
						}}
					</p>
				</div>
				<div class="summary-block">
					<p class="summary-label">Course access</p>
					<p class="summary-copy">{{ courseAccessText }}</p>
				</div>
			</div>

			<div class="sheet-body" :class="{ 'is-editing': editing }">
				<section class="sheet-panel">
					<div class="panel-header">
						<p class="panel-eyebrow">Profile details</p>
						<h3>Contact information</h3>
					</div>
					<ul class="field-stack">
						<ProfileFields
							:editing="false"
							:entity="currentUser"
							:fields="fields"
						/>
					</ul>
				</section>

				<section class="sheet-panel security-panel">
					<div class="panel-header">
						<p class="panel-eyebrow">Access</p>
						<h3>
							{{
								editing
									? "Security settings"
									: "Password and login"
							}}
						</h3>
					</div>
					<p v-if="!editing" class="security-copy">
						Open edit mode to change your password or update the
						email attached to this account.
					</p>
					<AccountSecurity
						v-else
						:email="currentUser.email"
						:entity-id="currentUser._id"
						role="user"
					/>
				</section>
			</div>

			<div class="action-row">
				<template v-if="!editing">
					<button
						class="btn-primary btn"
						type="button"
						@click="onStartEdit"
					>
						Manage account security
					</button>
				</template>

				<template v-else>
					<button
						class="btn-secondary btn"
						type="button"
						@click="onCancelEdit"
					>
						Cancel
					</button>
					<button
						class="btn-primary btn"
						type="button"
						@click="onSaveEdit"
					>
						Save
					</button>
				</template>
			</div>
		</article>

		<UserCommunicationPanel v-if="currentUser" />
	</section>
</template>

<style scoped>
.profile-workspace {
	display: grid;
	gap: 1.1rem;
	width: 100%;
	margin: 0;
}

.profile-workspace p,
.profile-workspace label,
.profile-workspace button,
.profile-workspace input,
.profile-workspace select {
	font-family: inherit;
	text-align: left;
}

.workspace-header {
	width: 100%;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	align-items: start;
	gap: 1rem 1.5rem;
	padding: clamp(1.35rem, 2.1vw, 1.8rem);
	border-radius: 28px;
	background: linear-gradient(
		180deg,
		rgba(248, 250, 252, 0.9),
		rgba(255, 255, 255, 0.82)
	);
	border: 1px solid rgba(255, 255, 255, 0.48);
	box-shadow: 0 28px 60px -44px rgba(15, 23, 42, 0.44);
}

.profile-workspace section {
	margin: 0;
}

.workspace-header > div:first-child {
	display: grid;
	gap: 0.75rem;
	min-width: 0;
}

.workspace-header h2 {
	margin: 0;
	font-size: clamp(2rem, 4vw, 3rem);
	line-height: 1.08;
	color: #10263a;
}

.workspace-header p:last-child {
	margin: 0;
	line-height: 1.65;
	color: #405467;
}

.workspace-eyebrow,
.panel-eyebrow,
.summary-label {
	margin: 0;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #0f766e;
}

.workspace-stats {
	width: min(100%, 19rem);
	display: grid;
	grid-template-columns: repeat(2, minmax(7.5rem, 1fr));
	gap: 0;
	border-radius: 22px;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.66);
	border: 1px solid rgba(148, 163, 184, 0.22);
	box-shadow: 0 24px 45px -38px rgba(15, 23, 42, 0.55);
}

.stat-pill {
	min-width: 0;
	padding: 1rem 1.1rem;
	border-radius: 0;
	background: transparent;
	box-shadow: none;
	border-right: 1px solid rgba(203, 213, 225, 0.78);
}

.stat-pill:last-child {
	border-right: none;
}

.stat-pill span {
	display: block;
	font-size: 0.74rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #5f7a8e;
}

.stat-pill strong {
	display: block;
	margin-top: 0.35rem;
	font-size: 1.75rem;
	line-height: 1;
	color: #10263a;
}

.workspace-sheet {
	display: grid;
	gap: 1.35rem;
	width: 100%;
	margin: 0;
	padding: clamp(1.2rem, 2vw, 1.5rem);
	border-radius: 30px;
	background: linear-gradient(
		180deg,
		rgba(245, 249, 253, 0.98),
		rgba(255, 255, 255, 0.96)
	);
	box-shadow: 0 30px 50px -42px rgba(15, 23, 42, 0.5);
}

.sheet-summary {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.summary-block,
.sheet-panel {
	padding: 1.2rem 1.25rem;
	border-radius: 24px;
	background: rgba(255, 255, 255, 0.88);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.68);
}

.summary-copy {
	margin: 0.55rem 0 0;
	color: #41566a;
	line-height: 1.55;
}

.sheet-body {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
	align-items: stretch;
}

.sheet-body.is-editing {
	align-items: flex-start;
}

.panel-header h3 {
	margin: 0.25rem 0 0;
	font-size: 1.25rem;
	color: #10263a;
	font-family: inherit;
	font-weight: 700;
	letter-spacing: -0.025em;
}

.field-stack {
	display: grid;
	gap: 0.75rem;
	margin: 1rem 0 0;
	padding: 0;
}

.security-panel {
	display: grid;
	align-content: start;
	gap: 1rem;
}

.sheet-panel {
	display: grid;
	align-content: start;
	gap: 1rem;
}

.security-copy {
	margin: 0.85rem 0 0;
	line-height: 1.6;
	color: #41566a;
}

.action-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	justify-content: flex-start;
}

.error {
	color: red;
	margin-top: 10px;
}

@media (max-width: 1024px) {
	.workspace-header,
	.sheet-summary,
	.sheet-body {
		grid-template-columns: 1fr;
	}

	.workspace-stats {
		width: 100%;
	}
}

@media (max-width: 900px) {
	.sheet-summary,
	.sheet-body {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 640px) {
	.workspace-sheet {
		padding: 1.1rem;
		border-radius: 24px;
	}

	.action-row {
		flex-direction: column;
	}
}
</style>
