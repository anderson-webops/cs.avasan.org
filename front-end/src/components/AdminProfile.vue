<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { ADMIN_RECIPIENT_NAMES } from "@/modules/adminRecipients";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const props = defineProps<{ mode?: "profile" | "manage" }>();

/* -------------------------------------------------- */
const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const error = ref("");
const success = ref("");
const deleteMe = useDeleteAccount("admin");
const userAssignments = ref<Record<string, string[]>>({});
const userEditing = ref<Record<string, boolean>>({});
const userRecipientNames = ref<Record<string, string>>({});
const tutorEditing = ref<Record<string, boolean>>({});
const tutorCourseSelections = ref<Record<string, string[]>>({});
const userCourseSelections = ref<Record<string, string[]>>({});

const viewMode = computed(() => props.mode ?? "profile");

const adminDraft = ref<typeof currentAdmin.value | null>(null);

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
const courseLabel = (id: string) => courseNameMap.value[id] ?? id;
const tutorCount = computed(() => tutors.value.length);
const userCount = computed(() => users.value.length);

/* editable helper for the admin card */
const {
	editing: adminEdit,
	toggle: toggleAdmin,
	save: saveAdmin
} = useEditable("admin");

/* field list (admin / tutor / user share the same set) */
const fields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" }
	// { key: "age", label: "Age" },
	// { key: "state", label: "State" }
];

/* fetch everything once */
async function loadAll() {
	await Promise.all([
		app.fetchTutors(),
		app.fetchUsers(),
		app.refreshCurrentAdmin()
	]);
}

onMounted(loadAll);

watch(
	users,
	value => {
		const assignments: Record<string, string[]> = {};
		const editing: Record<string, boolean> = {};
		const courses: Record<string, string[]> = {};
		const recipientNames: Record<string, string> = {};
		for (const user of value) {
			assignments[user._id] = (user.tutors ?? []).map(t =>
				typeof t === "string" ? t : t._id
			);
			editing[user._id] = false;
			courses[user._id] = [...(user.courseAccess ?? [])];
			recipientNames[user._id] = user.recipientName ?? "";
		}
		userAssignments.value = assignments;
		userEditing.value = editing;
		userCourseSelections.value = courses;
		userRecipientNames.value = recipientNames;
	},
	{ immediate: true }
);

watch(
	tutors,
	value => {
		const selections: Record<string, string[]> = {};
		const editing: Record<string, boolean> = {};
		for (const tutor of value) {
			selections[tutor._id] = [...(tutor.coursePermissions ?? [])];
			editing[tutor._id] = false;
		}
		tutorCourseSelections.value = selections;
		tutorEditing.value = editing;
	},
	{ immediate: true }
);

const tutorsHeader = computed(() =>
	currentAdmin.value && tutors.value.length === 0 ? "No Tutors Yet" : "Tutors"
);

const usersHeader = computed(() =>
	currentAdmin.value && users.value.length === 0
		? "No Learners Yet"
		: "Learners"
);

const tutorLookup = computed(() => {
	const lookup: Record<string, string> = {};
	for (const t of tutors.value) lookup[t._id] = t.name;
	return lookup;
});

function assignedTutorNames(userID: string) {
	const assigned = userAssignments.value[userID] ?? [];
	return assigned.map(id => tutorLookup.value[id] ?? "Unknown");
}

function assignedTutorLabel(userID: string) {
	return assignedTutorNames(userID).length === 1
		? "Assigned tutor"
		: "Assigned tutors";
}

function tutorCourseLabels(tutorID: string) {
	const list = tutorCourseSelections.value[tutorID] ?? [];
	const names = courseNameMap.value ?? {};
	return list.map(id => names[id] ?? id);
}

function userCourseLabels(userID: string) {
	const list = userCourseSelections.value[userID] ?? [];
	return list.map(id => courseLabel(id));
}

function recipientOptionsForUser(userID: string) {
	const currentValue = userRecipientNames.value[userID]?.trim();
	if (!currentValue || ADMIN_RECIPIENT_NAMES.includes(currentValue)) {
		return ADMIN_RECIPIENT_NAMES;
	}
	return [...ADMIN_RECIPIENT_NAMES, currentValue];
}

watch(
	currentAdmin,
	value => {
		adminDraft.value = value ? { ...value } : null;
	},
	{ immediate: true }
);

function startUserEdit(userID: string) {
	userEditing.value = { ...userEditing.value, [userID]: true };
	success.value = "";
	error.value = "";
}

function cancelUserEdit(userID: string) {
	const user = users.value.find(u => u._id === userID);
	if (user) {
		userAssignments.value = {
			...userAssignments.value,
			[userID]: (user.tutors ?? []).map(t =>
				typeof t === "string" ? t : t._id
			)
		};
		userCourseSelections.value = {
			...userCourseSelections.value,
			[userID]: [...(user.courseAccess ?? [])]
		};
		userRecipientNames.value = {
			...userRecipientNames.value,
			[userID]: user.recipientName ?? ""
		};
	}
	userEditing.value = { ...userEditing.value, [userID]: false };
	success.value = "";
	error.value = "";
}

function toggleTutorEdit(tutorID: string) {
	tutorEditing.value = {
		...tutorEditing.value,
		[tutorID]: !tutorEditing.value[tutorID]
	};
	success.value = "";
	error.value = "";
}

function cancelTutorEdit(tutorID: string) {
	const tutor = tutors.value.find(t => t._id === tutorID);
	if (tutor) {
		tutorCourseSelections.value = {
			...tutorCourseSelections.value,
			[tutorID]: [...(tutor.coursePermissions ?? [])]
		};
	}
	tutorEditing.value = { ...tutorEditing.value, [tutorID]: false };
	success.value = "";
	error.value = "";
}

function onTutorCourseToggle(
	tutorID: string,
	courseID: string,
	checked: boolean
) {
	const existing = new Set(tutorCourseSelections.value[tutorID] ?? []);
	if (checked) existing.add(courseID);
	else existing.delete(courseID);
	tutorCourseSelections.value = {
		...tutorCourseSelections.value,
		[tutorID]: [...existing]
	};
}

function onTutorSelectionChange(userID: string, event: Event) {
	const target = event.target as HTMLSelectElement;
	const selected = Array.from(target.selectedOptions).map(
		option => option.value
	);
	userAssignments.value = {
		...userAssignments.value,
		[userID]: selected
	};
}

async function saveTutorCourses(tutorID: string) {
	try {
		success.value = "";
		error.value = "";
		await api.put(`/tutors/${tutorID}/courses`, {
			courseIDs: tutorCourseSelections.value[tutorID] ?? []
		});
		success.value = "Updated tutor course access.";
		await app.fetchTutors();
		tutorEditing.value = { ...tutorEditing.value, [tutorID]: false };
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to update tutor courses";
	}
}

async function demoteTutor(tutorID: string) {
	try {
		success.value = "";
		error.value = "";
		await api.post(`/tutors/${tutorID}/demote`);
		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		success.value = "Tutor demoted to user.";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to demote tutor";
	}
}

function toggleAdminEdit() {
	if (!adminDraft.value && currentAdmin.value) {
		adminDraft.value = { ...currentAdmin.value };
	}
	toggleAdmin();
}

function cancelAdminEdit() {
	adminDraft.value = currentAdmin.value ? { ...currentAdmin.value } : null;
	adminEdit.value = false;
}

async function saveAdminProfile() {
	if (!adminDraft.value) return;
	await saveAdmin(adminDraft.value);
	adminEdit.value = false; // Explicitly leave edit mode.
	success.value = "Profile updated.";
}

const userAllowedCourses = computed(() => {
	const lookup: Record<string, Set<string>> = {};
	for (const userID of Object.keys(userAssignments.value)) {
		const tutorsForUser = userAssignments.value[userID] ?? [];
		const allowed = new Set<string>();
		for (const tutorID of tutorsForUser) {
			const courses = tutorCourseSelections.value[tutorID] ?? [];
			for (const course of courses) allowed.add(course);
		}
		lookup[userID] = allowed;
	}
	return lookup;
});

function onUserCourseToggle(
	userID: string,
	courseID: string,
	checked: boolean
) {
	const existing = new Set(userCourseSelections.value[userID] ?? []);
	if (checked) existing.add(courseID);
	else existing.delete(courseID);
	userCourseSelections.value = {
		...userCourseSelections.value,
		[userID]: [...existing]
	};
}

async function saveUserEditorChanges(userID: string) {
	try {
		success.value = "";
		error.value = "";
		const allowed = userAllowedCourses.value[userID] ?? new Set<string>();
		const selection = (userCourseSelections.value[userID] ?? []).filter(
			id => allowed.has(id)
		);

		await api.put(`/users/${userID}/recipient`, {
			recipientName: userRecipientNames.value[userID] ?? ""
		});
		await api.put(`/users/${userID}/tutors`, {
			tutorIDs: userAssignments.value[userID] ?? []
		});
		await api.put(`/users/${userID}/courses`, {
			courseIDs: selection
		});

		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		userEditing.value = { ...userEditing.value, [userID]: false };
		success.value = "Saved learner assignments.";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to save learner assignments";
	}
}

async function promoteToTutor(userID: string) {
	// eslint-disable-next-line no-alert
	if (!window.confirm("Are you sure you want to Promote?")) return;
	try {
		await api.post(`/users/${userID}/promote`);
		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		success.value = "User promoted to tutor.";
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to promote user";
	}
}

async function confirmDemote(tutorID: string) {
	// eslint-disable-next-line no-alert
	if (!window.confirm("Are you sure you want to Demote?")) return;
	await demoteTutor(tutorID);
}

async function removeTutor(tutorID: string) {
	// eslint-disable-next-line no-alert
	if (!window.confirm("Are you sure you want to Delete?")) return;
	try {
		await api.delete(`/tutors/remove/${tutorID}`);
		await app.fetchTutors();
		success.value = "Tutor removed.";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to delete tutor";
	}
}

async function removeUser(userID: string) {
	// eslint-disable-next-line no-alert
	if (!window.confirm("Are you sure you want to Delete?")) return;
	try {
		await api.delete(`/users/admin/${userID}`);
		await app.fetchUsers();
		success.value = "User removed.";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to delete user";
	}
}

function confirmDeleteAdmin() {
	if (!currentAdmin.value) return;
	// eslint-disable-next-line no-alert
	if (!window.confirm("Are you sure you want to Delete?")) return;
	deleteMe(currentAdmin.value._id);
}
</script>

<template>
	<section class="admin-workspace">
		<header class="workspace-header">
			<div>
				<p class="workspace-eyebrow">
					{{
						viewMode === "profile"
							? "Administrator profile"
							: "Administration"
					}}
				</p>
				<h2>
					{{
						viewMode === "profile"
							? "Account and teaching access"
							: "Manage profiles"
					}}
				</h2>
				<p>
					{{
						viewMode === "profile"
							? "Review your admin account, set tutor course permissions, and shape each learner’s access from one shared workspace."
							: "Handle role changes and account removals from the same structured workspace used across the rest of the site."
					}}
				</p>
			</div>
			<div class="workspace-stats">
				<div class="stat-pill">
					<span>Tutors</span>
					<strong>{{ tutorCount }}</strong>
				</div>
				<div class="stat-pill">
					<span>Learners</span>
					<strong>{{ userCount }}</strong>
				</div>
			</div>
		</header>

		<p v-if="success" class="status-banner is-success">{{ success }}</p>
		<p v-if="error" class="status-banner is-error">{{ error }}</p>

		<template v-if="viewMode === 'profile'">
			<article v-if="currentAdmin" class="workspace-sheet">
				<div class="sheet-summary">
					<div class="summary-block">
						<p class="summary-label">Directory overview</p>
						<p class="summary-copy">
							{{ tutorCount }} tutor{{
								tutorCount === 1 ? "" : "s"
							}}
							and {{ userCount }} learner{{
								userCount === 1 ? "" : "s"
							}}
							are currently active in the workspace.
						</p>
					</div>
					<div class="summary-block">
						<p class="summary-label">Primary responsibility</p>
						<p class="summary-copy">
							Control who can teach which courses and which
							students can open each curriculum.
						</p>
					</div>
				</div>

				<div class="sheet-body">
					<section class="sheet-panel">
						<div class="panel-header">
							<p class="panel-eyebrow">Admin account</p>
							<h3>Profile details</h3>
						</div>
						<ul class="field-stack">
							<ProfileFields
								:editing="false"
								:entity="currentAdmin"
								:fields="fields"
							/>
						</ul>
					</section>

					<section class="sheet-panel security-panel">
						<div class="panel-header">
							<p class="panel-eyebrow">Security</p>
							<h3>
								{{
									adminEdit
										? "Admin access settings"
										: "Password and login"
								}}
							</h3>
						</div>
						<p v-if="!adminEdit" class="security-copy">
							Open edit mode to update the password or email for
							the primary admin account.
						</p>
						<AccountSecurity
							v-else
							:email="currentAdmin.email"
							:entity-id="currentAdmin._id"
							role="admin"
						/>
					</section>
				</div>

				<div class="action-row">
					<template v-if="!adminEdit">
						<button
							class="btn-primary btn"
							type="button"
							@click="toggleAdminEdit"
						>
							Manage account security
						</button>
					</template>
					<template v-else>
						<button
							class="btn-secondary btn"
							type="button"
							@click="cancelAdminEdit"
						>
							Cancel
						</button>
						<button
							class="btn-primary btn"
							type="button"
							@click="saveAdminProfile"
						>
							Save
						</button>
					</template>
				</div>
			</article>

			<section class="directory-section">
				<div class="section-heading">
					<div>
						<p class="workspace-eyebrow">Tutors</p>
						<h3>{{ tutorsHeader }}</h3>
					</div>
					<p class="section-copy">
						Enable course access for each tutor so learner
						assignments always reflect the right teaching scope.
					</p>
				</div>

				<div class="directory-grid">
					<article
						v-for="t in tutors"
						:key="t._id"
						class="directory-card"
					>
						<div class="directory-card-header">
							<div>
								<h4>{{ t.name }}</h4>
								<p>{{ t.email }}</p>
							</div>
							<button
								class="btn-secondary btn"
								type="button"
								@click="toggleTutorEdit(t._id)"
							>
								{{
									tutorEditing[t._id]
										? "Close editor"
										: "Edit courses"
								}}
							</button>
						</div>

						<div class="summary-block is-inline">
							<p class="summary-label">Course access</p>
							<ul
								v-if="tutorCourseLabels(t._id).length"
								class="summary-list"
							>
								<li
									v-for="course in tutorCourseLabels(t._id)"
									:key="`${t._id}-${course}`"
								>
									{{ course }}
								</li>
							</ul>
							<p v-else class="summary-copy is-muted">
								No course access enabled
							</p>
						</div>

						<div v-if="tutorEditing[t._id]" class="course-editor">
							<p class="helper-text">
								Select which courses this tutor can access.
							</p>
							<div class="checkbox-grid">
								<label
									v-for="course in courseOptions"
									:key="course.id"
								>
									<input
										:checked="
											tutorCourseSelections[
												t._id
											]?.includes(course.id)
										"
										type="checkbox"
										@change="
											onTutorCourseToggle(
												t._id,
												course.id,
												(
													$event.target as HTMLInputElement
												).checked
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
									@click="saveTutorCourses(t._id)"
								>
									Save courses
								</button>
								<button
									class="btn-secondary btn"
									type="button"
									@click="cancelTutorEdit(t._id)"
								>
									Cancel
								</button>
							</div>
						</div>
					</article>
				</div>
			</section>

			<section class="directory-section">
				<div class="section-heading">
					<div>
						<p class="workspace-eyebrow">Learners</p>
						<h3>{{ usersHeader }}</h3>
					</div>
				</div>

				<div class="directory-grid">
					<article
						v-for="u in users"
						:key="u._id"
						class="directory-card"
					>
						<div class="directory-card-header is-user-card-header">
							<div class="directory-card-identity">
								<div class="directory-card-name-row">
									<h4>{{ u.name }}</h4>
									<p
										v-if="u.recipientName"
										class="recipient-association"
									>
										{{ u.recipientName }}
									</p>
								</div>
								<p>{{ u.email }}</p>
							</div>
							<button
								class="btn-secondary btn"
								type="button"
								@click="
									userEditing[u._id]
										? cancelUserEdit(u._id)
										: startUserEdit(u._id)
								"
							>
								{{
									userEditing[u._id]
										? "Close editor"
										: "Edit assignments"
								}}
							</button>
						</div>

						<div class="info-grid">
							<div class="summary-block is-inline">
								<p class="summary-label">
									{{ assignedTutorLabel(u._id) }}
								</p>
								<ul
									v-if="assignedTutorNames(u._id).length"
									class="summary-list"
								>
									<li
										v-for="tutorName in assignedTutorNames(
											u._id
										)"
										:key="`${u._id}-${tutorName}`"
									>
										{{ tutorName }}
									</li>
								</ul>
								<p v-else class="summary-copy is-muted">
									No tutor assigned yet
								</p>
							</div>
							<details
								class="summary-block is-inline is-collapsible"
							>
								<summary class="summary-toggle">
									<span class="summary-label">
										Course access
									</span>
								</summary>
								<ul
									v-if="
										userCourseLabels(String(u._id)).length
									"
									class="summary-list"
								>
									<li
										v-for="course in userCourseLabels(
											String(u._id)
										)"
										:key="`${u._id}-${course}`"
									>
										{{ course }}
									</li>
								</ul>
								<p v-else class="summary-copy is-muted">
									No course access yet
								</p>
							</details>
						</div>

						<div
							v-if="userEditing[u._id]"
							class="assignment-editor"
						>
							<div class="editor-block">
								<label
									class="editor-label"
									:for="`recipient-name-${u._id}`"
								>
									Associated recipient
								</label>
								<select
									:id="`recipient-name-${u._id}`"
									v-model="userRecipientNames[String(u._id)]"
									class="editor-select is-single"
								>
									<option value="">
										No associated recipient
									</option>
									<option
										v-for="recipientName in recipientOptionsForUser(
											String(u._id)
										)"
										:key="`${u._id}-${recipientName}`"
										:value="recipientName"
									>
										{{ recipientName }}
									</option>
								</select>
								<p class="helper-text">
									Choose the same recipient label used in Send
									Markdown Email. Pick the blank option to
									remove the association.
								</p>
							</div>

							<div class="editor-block">
								<label
									class="editor-label"
									:for="`tutor-select-${u._id}`"
								>
									Assign tutors
								</label>
								<select
									:id="`tutor-select-${u._id}`"
									class="editor-select"
									:disabled="tutors.length === 0"
									multiple
									:value="userAssignments[u._id] ?? []"
									@change="
										onTutorSelectionChange(u._id, $event)
									"
								>
									<option
										v-for="t in tutors"
										:key="t._id"
										:value="t._id"
									>
										{{ t.name }}
									</option>
								</select>
							</div>

							<div class="editor-block">
								<p class="editor-label">Allowed courses</p>
								<p class="helper-text">
									Enable courses available from the learner's
									assigned tutors.
								</p>
								<div class="checkbox-grid">
									<label
										v-for="course in courseOptions"
										:key="course.id"
										:class="{
											disabled: !userAllowedCourses[
												String(u._id)
											]?.has(course.id)
										}"
									>
										<input
											:checked="
												userCourseSelections[
													String(u._id)
												]?.includes(course.id)
											"
											:disabled="
												!userAllowedCourses[
													String(u._id)
												]?.has(course.id)
											"
											type="checkbox"
											@change="
												onUserCourseToggle(
													u._id,
													course.id,
													(
														$event.target as HTMLInputElement
													).checked
												)
											"
										/>
										{{ course.name }}
									</label>
								</div>
							</div>

							<div class="action-row">
								<button
									class="btn-primary btn"
									type="button"
									@click="saveUserEditorChanges(u._id)"
								>
									Save
								</button>
								<button
									class="btn-secondary btn"
									type="button"
									@click="cancelUserEdit(u._id)"
								>
									Cancel
								</button>
							</div>
						</div>
					</article>
				</div>
			</section>
		</template>

		<template v-else>
			<section class="directory-section">
				<div class="section-heading">
					<div>
						<p class="workspace-eyebrow">Administrator</p>
						<h3>Primary account</h3>
					</div>
					<p class="section-copy">
						Account removal is destructive. Keep it isolated from
						the role-management actions below.
					</p>
				</div>

				<article v-if="currentAdmin" class="directory-card">
					<div class="directory-card-header">
						<div>
							<h4>{{ currentAdmin.name }}</h4>
							<p>{{ currentAdmin.email }}</p>
						</div>
					</div>
					<div class="action-row">
						<button
							class="btn-danger btn"
							type="button"
							@click="confirmDeleteAdmin"
						>
							Delete admin account
						</button>
					</div>
				</article>
			</section>

			<section class="directory-section">
				<div class="section-heading">
					<div>
						<p class="workspace-eyebrow">Tutors</p>
						<h3>{{ tutorsHeader }}</h3>
					</div>
					<p class="section-copy">
						Demote tutors back to users or fully remove accounts.
					</p>
				</div>

				<div class="directory-grid">
					<article
						v-for="t in tutors"
						:key="t._id"
						class="directory-card"
					>
						<div class="directory-card-header">
							<div>
								<h4>{{ t.name }}</h4>
								<p>{{ t.email }}</p>
							</div>
						</div>
						<div class="action-row">
							<button
								class="btn-secondary btn"
								type="button"
								@click="confirmDemote(t._id)"
							>
								Demote to user
							</button>
							<button
								class="btn-danger btn"
								type="button"
								@click="removeTutor(t._id)"
							>
								Delete tutor
							</button>
						</div>
					</article>
				</div>
			</section>

			<section class="directory-section">
				<div class="section-heading">
					<div>
						<p class="workspace-eyebrow">Users</p>
						<h3>{{ usersHeader }}</h3>
					</div>
					<p class="section-copy">
						Promote learners to tutors when needed, or remove unused
						accounts.
					</p>
				</div>

				<div class="directory-grid">
					<article
						v-for="u in users"
						:key="u._id"
						class="directory-card"
					>
						<div class="directory-card-header">
							<div>
								<h4>{{ u.name }}</h4>
								<p>{{ u.email }}</p>
							</div>
						</div>
						<div class="action-row">
							<button
								class="btn-primary btn"
								type="button"
								@click="promoteToTutor(u._id)"
							>
								Promote to tutor
							</button>
							<button
								class="btn-danger btn"
								type="button"
								@click="removeUser(u._id)"
							>
								Delete user
							</button>
						</div>
					</article>
				</div>
			</section>
		</template>
	</section>
</template>

<style scoped>
.admin-workspace {
	display: grid;
	gap: 1.1rem;
	width: 100%;
	margin: 0;
}

.admin-workspace p,
.admin-workspace label,
.admin-workspace button,
.admin-workspace input,
.admin-workspace select {
	font-family: inherit;
	text-align: left;
}

.admin-workspace section {
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

.directory-card-header,
.action-row {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 1rem;
}

.section-heading {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0.7rem;
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
	font-family: inherit;
	font-weight: 700;
	letter-spacing: -0.03em;
}

.workspace-header p:last-child,
.section-copy {
	margin: 0;
	line-height: 1.65;
	color: #41566a;
}

.workspace-eyebrow,
.panel-eyebrow,
.summary-label,
.editor-label {
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
.directory-card,
.status-banner {
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

.status-banner {
	padding: 0.95rem 1.1rem;
	margin: 0;
}

.status-banner.is-success {
	color: #166534;
	background: rgba(240, 253, 244, 0.92);
	box-shadow: inset 0 0 0 1px rgba(134, 239, 172, 0.8);
}

.status-banner.is-error {
	color: #b91c1c;
	background: rgba(254, 242, 242, 0.92);
	box-shadow: inset 0 0 0 1px rgba(252, 165, 165, 0.82);
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
	padding: 1rem 1.05rem;
}

.summary-block.is-collapsible {
	padding: 0;
}

.summary-toggle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.05rem;
	cursor: pointer;
	list-style: none;
}

.summary-toggle::-webkit-details-marker {
	display: none;
}

.summary-toggle::after {
	content: "+";
	color: #5f7a8e;
	font-size: 1.1rem;
	font-weight: 700;
	line-height: 1;
}

.summary-block.is-collapsible[open] .summary-toggle::after {
	content: "−";
}

.summary-copy {
	margin: 0.55rem 0 0;
	line-height: 1.55;
	color: #41566a;
}

.summary-copy.is-muted {
	color: #5c7387;
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
	font-family: inherit;
	font-weight: 700;
	letter-spacing: -0.025em;
}

.directory-card-header h4 {
	font-size: 1.1rem;
}

.directory-card-header p {
	margin: 0.25rem 0 0;
	color: #5f7a8e;
}

.directory-card-header.is-user-card-header {
	align-items: start;
}

.directory-card-identity {
	min-width: 0;
	flex: 1 1 18rem;
}

.directory-card-name-row {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 1rem;
}

.directory-card-name-row h4 {
	margin: 0;
}

.recipient-association {
	margin: 0;
	color: #7a8795;
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.4;
	text-align: right;
	white-space: nowrap;
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

.security-copy,
.helper-text,
.section-copy {
	line-height: 1.6;
}

.security-copy,
.helper-text {
	margin: 0.85rem 0 0;
	color: #41566a;
}

.directory-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	gap: 1rem;
}

.directory-card {
	display: grid;
	align-content: start;
	gap: 0.95rem;
}

.info-grid {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0.85rem;
}

.summary-list {
	display: grid;
	gap: 0;
	list-style: none;
	margin: 0.7rem 0 0;
	padding: 0;
}

.summary-block.is-collapsible .summary-list,
.summary-block.is-collapsible .summary-copy {
	margin-top: 0;
	padding: 0 1.05rem 1rem;
}

.summary-list li {
	padding: 0.45rem 0;
	line-height: 1.55;
	color: #10263a;
}

.summary-list li + li {
	border-top: 1px solid rgba(203, 213, 225, 0.62);
}

.assignment-editor,
.course-editor {
	display: grid;
	gap: 1rem;
	margin-top: 1rem;
	padding-top: 1rem;
	border-top: 1px solid rgba(203, 213, 225, 0.8);
}

.editor-block {
	display: grid;
	gap: 0.7rem;
}

.editor-select {
	min-height: 7rem;
	border: 1px solid rgba(148, 163, 184, 0.55);
	border-radius: 16px;
	padding: 0.75rem 0.85rem;
	background: white;
	color: #10263a;
}

.editor-select.is-single {
	min-height: auto;
	appearance: auto;
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

.checkbox-grid label.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.error {
	color: red;
	margin-top: 10px;
}

@media (max-width: 960px) {
	.workspace-header,
	.section-heading,
	.sheet-summary,
	.sheet-body,
	.info-grid {
		grid-template-columns: 1fr;
	}

	.workspace-stats {
		width: 100%;
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
