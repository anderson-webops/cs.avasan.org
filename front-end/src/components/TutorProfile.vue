<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ProfileFields from "@/components/ProfileFields.vue";
// import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

/* -------------------------------------------------- */
const app = useAppStore();
const { currentTutor, users } = storeToRefs(app);
const error = ref("");
const success = ref("");
// const deleteMe = useDeleteAccount("tutor");

/* editable (the tutor card itself) */
const {
	editing: tutorEdit,
	toggle: toggleTutor,
	save: saveTutor
} = useEditable("tutor");

/* field list (read-only for now) */
const tutorFields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" },
	{ key: "age", label: "Age" },
	{ key: "state", label: "State" }
];

/* load this tutor’s users once */
async function loadUsers() {
	if (!currentTutor.value) return;
	try {
		const { data } = await api.get(
			`/users/oftutor/${currentTutor.value._id}`
		);
		app.setUsers(data);
	} catch (e: any) {
		error.value = e.message;
	}
}

onMounted(loadUsers);

const usersHeader = computed(() =>
	currentTutor.value && users.value.length === 0
		? "No Learners Yet"
		: "Learners"
);

/* tutor edit flow */
function onStartTutorEdit() {
	if (!currentTutor.value) return;
	toggleTutor();
}

function onCancelTutorEdit() {
	toggleTutor();
}

async function onSaveTutorEdit() {
	if (!currentTutor.value) return;
	await saveTutor(currentTutor.value);
	// If useEditable doesn't flip tutorEdit to false, you could toggleTutor() here.
}

/* users under this tutor: course editing */
const userEditing = ref<Record<string, boolean>>({});
const userCourseSelections = ref<Record<string, string[]>>({});

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

const permittedCourseIds = computed(
	() => currentTutor.value?.coursePermissions ?? []
);

const permittedCourses = computed(() => {
	const allowed = new Set(permittedCourseIds.value);
	return (courses.value ?? []).filter(course => allowed.has(course.id));
});

const courseLookup = computed(() => {
	const map: Record<string, string> = {};
	for (const course of courses.value ?? []) map[course.id] = course.name;
	return map;
});

const learnerCount = computed(() => users.value.length);
const enabledCourseCount = computed(() => permittedCourses.value.length);

watch(
	users,
	value => {
		const selectionMap: Record<string, string[]> = {};
		for (const user of value) {
			selectionMap[user._id] = [...(user.courseAccess ?? [])];
		}
		userCourseSelections.value = selectionMap;
	},
	{ immediate: true }
);

function toggleUserEdit(userID: string) {
	userEditing.value = {
		...userEditing.value,
		[userID]: !userEditing.value[userID]
	};
	success.value = "";
	error.value = "";
}

function onCourseToggle(userID: string, courseID: string, checked: boolean) {
	const existing = new Set(userCourseSelections.value[userID] ?? []);
	if (checked) existing.add(courseID);
	else existing.delete(courseID);
	userCourseSelections.value = {
		...userCourseSelections.value,
		[userID]: [...existing]
	};
}

async function saveUserCourses(userID: string) {
	try {
		success.value = "";
		error.value = "";
		await api.put(`/users/${userID}/courses`, {
			courseIDs: userCourseSelections.value[userID] ?? []
		});
		success.value = "Saved course access.";
		await loadUsers();
		userEditing.value = { ...userEditing.value, [userID]: false };
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to save courses";
	}
}
</script>

<template>
	<section class="profile-workspace">
		<header class="workspace-header">
			<div>
				<p class="workspace-eyebrow">Tutor profile</p>
				<h2>Teaching workspace</h2>
				<p>
					Keep your account ready, check which classes you can teach,
					and manage learner course access from one organized view.
				</p>
			</div>
			<div class="workspace-stats">
				<div class="stat-pill">
					<span>Enabled courses</span>
					<strong>{{ enabledCourseCount }}</strong>
				</div>
				<div class="stat-pill">
					<span>Learners</span>
					<strong>{{ learnerCount }}</strong>
				</div>
			</div>
		</header>

		<article v-if="currentTutor" class="workspace-sheet">
			<div class="sheet-summary">
				<div class="summary-block">
					<p class="summary-label">Courses enabled</p>
					<p class="summary-copy">
						{{
							permittedCourses.length
								? permittedCourses
										.map(course => course.name)
										.join(", ")
								: "Waiting for admin course access"
						}}
					</p>
				</div>
				<div class="summary-block">
					<p class="summary-label">Learner roster</p>
					<p class="summary-copy">
						{{ learnerCount }} learner{{
							learnerCount === 1 ? "" : "s"
						}}
						currently assigned
					</p>
				</div>
			</div>

			<div class="sheet-body">
				<section class="sheet-panel">
					<div class="panel-header">
						<p class="panel-eyebrow">Tutor account</p>
						<h3>Profile details</h3>
					</div>
					<ul class="field-stack">
						<ProfileFields
							:editing="false"
							:entity="currentTutor"
							:fields="tutorFields"
						/>
					</ul>
				</section>

				<section class="sheet-panel security-panel">
					<div class="panel-header">
						<p class="panel-eyebrow">Access</p>
						<h3>
							{{
								tutorEdit
									? "Security settings"
									: "Password and login"
							}}
						</h3>
					</div>
					<p v-if="!tutorEdit" class="security-copy">
						Open edit mode to update your password or email
						credentials before the next class.
					</p>
					<AccountSecurity
						v-else
						:email="currentTutor.email"
						:entity-id="currentTutor._id"
						role="tutor"
					/>
				</section>
			</div>

			<div class="action-row">
				<template v-if="!tutorEdit">
					<button
						class="btn-primary btn"
						type="button"
						@click="onStartTutorEdit"
					>
						Manage account security
					</button>
				</template>
				<template v-else>
					<button
						class="btn-secondary btn"
						type="button"
						@click="onCancelTutorEdit"
					>
						Cancel
					</button>
					<button
						class="btn-primary btn"
						type="button"
						@click="onSaveTutorEdit"
					>
						Save
					</button>
				</template>
			</div>
		</article>

		<section class="directory-section">
			<div class="section-heading">
				<div>
					<p class="workspace-eyebrow">Learners</p>
					<h3>{{ usersHeader }}</h3>
				</div>
				<p class="section-copy">
					Update course access for each learner using only the courses
					already enabled for your account.
				</p>
			</div>

			<div class="directory-grid">
				<article v-for="u in users" :key="u._id" class="directory-card">
					<div class="directory-card-header">
						<div>
							<h4>{{ u.name }}</h4>
							<p>{{ u.email }}</p>
						</div>
						<button
							class="btn-secondary btn"
							type="button"
							@click="toggleUserEdit(u._id)"
						>
							{{
								userEditing[u._id]
									? "Close editor"
									: "Edit courses"
							}}
						</button>
					</div>

					<ul class="field-stack is-compact">
						<ProfileFields
							:editing="false"
							:entity="u"
							:fields="tutorFields"
						/>
					</ul>

					<div class="summary-block is-inline">
						<p class="summary-label">Course access</p>
						<p class="summary-copy">
							{{
								(u.courseAccess?.length ?? 0)
									? (u.courseAccess ?? [])
											.map(id => courseLookup[id] ?? id)
											.join(", ")
									: "No course access yet"
							}}
						</p>
					</div>

					<div v-if="userEditing[u._id]" class="course-editor">
						<p v-if="permittedCourses.length === 0" class="hint">
							Your admin hasn’t enabled course access yet.
						</p>
						<div v-else class="checkbox-grid">
							<label
								v-for="course in permittedCourses"
								:key="course.id"
							>
								<input
									:checked="
										userCourseSelections[u._id]?.includes(
											course.id
										)
									"
									type="checkbox"
									@change="
										onCourseToggle(
											u._id,
											course.id,
											($event.target as HTMLInputElement)
												.checked
										)
									"
								/>
								{{ course.name }}
							</label>
						</div>
						<div class="action-row">
							<button
								class="btn-primary btn"
								type="button"
								@click="saveUserCourses(u._id)"
							>
								Save courses
							</button>
						</div>
					</div>
				</article>
			</div>
		</section>

		<p v-if="success" class="status">{{ success }}</p>
		<p v-if="error" class="error">
			{{ error }}
		</p>
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

.profile-workspace section {
	margin: 0;
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

.workspace-header > div:first-child {
	display: grid;
	gap: 0.75rem;
	min-width: 0;
}

.section-heading,
.directory-card-header,
.action-row {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 1rem;
}

.section-heading {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.9fr);
	align-items: flex-start;
}

.workspace-header h2,
.section-heading h3 {
	margin: 0;
	color: #10263a;
}

.workspace-header h2 {
	font-size: clamp(2rem, 4vw, 3rem);
	line-height: 1.08;
}

.section-heading h3 {
	margin-top: 0.1rem;
	font-size: clamp(1.8rem, 3vw, 2.35rem);
	color: #10263a;
}

.workspace-header p:last-child,
.section-copy {
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

.stat-pill,
.summary-block,
.sheet-panel,
.directory-card {
	border-radius: 24px;
	background: rgba(255, 255, 255, 0.88);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.68);
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

.workspace-sheet,
.directory-section {
	display: grid;
	gap: 1.25rem;
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
.sheet-panel,
.directory-card {
	padding: 1.2rem 1.25rem;
}

.summary-block.is-inline {
	margin-top: 1rem;
}

.summary-copy {
	margin: 0.55rem 0 0;
	line-height: 1.55;
	color: #12263a;
}

.sheet-body {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
	align-items: stretch;
}

.panel-header h3,
.directory-card-header h4 {
	margin: 0.25rem 0 0;
	font-size: 1.25rem;
	color: #10263a;
}

.directory-card-header h4 {
	font-size: 1.1rem;
}

.directory-card-header p {
	margin: 0.25rem 0 0;
	color: #5f7a8e;
}

.field-stack {
	display: grid;
	gap: 0.75rem;
	margin: 1rem 0 0;
	padding: 0;
}

.field-stack.is-compact :deep(.field-row) {
	padding: 0.75rem 0.9rem;
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

.security-copy,
.hint {
	margin: 0.85rem 0 0;
	line-height: 1.6;
	color: #405467;
}

.directory-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	gap: 1rem;
}

.course-editor {
	display: grid;
	gap: 0.85rem;
	margin-top: 1rem;
	padding-top: 1rem;
	border-top: 1px solid rgba(203, 213, 225, 0.8);
}

.checkbox-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
	gap: 0.65rem;
}

.checkbox-grid label {
	display: flex;
	gap: 0.45rem;
	align-items: center;
	padding: 0.8rem 0.9rem;
	border-radius: 16px;
	background: rgba(248, 250, 252, 0.88);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.72);
	font-size: 0.93rem;
	color: #12263a;
}

.status {
	color: #15803d;
	margin-top: 0.5rem;
}

.error {
	color: red;
	margin-top: 10px;
}

@media (max-width: 1024px) {
	.workspace-header,
	.section-heading,
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
	.workspace-sheet,
	.directory-section {
		padding: 1.1rem;
		border-radius: 24px;
	}

	.action-row {
		flex-direction: column;
	}
}
</style>
