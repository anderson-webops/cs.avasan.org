<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import ProfileDetailsCard from "@/components/ProfileDetailsCard.vue";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
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
const tutorEditing = ref<Record<string, boolean>>({});
const tutorCourseSelections = ref<Record<string, string[]>>({});
const userCourseSelections = ref<Record<string, string[]>>({});
const activeCard = ref<string | null>(null);

const viewMode = computed(() => props.mode ?? "profile");

const adminDraft = ref<typeof currentAdmin.value | null>(null);

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);
const courseOptions = computed(() => courses.value ?? []);
const courseNameMap = computed<Record<string, string>>(
	() =>
		courseOptions.value?.reduce((map, course) => {
			map[course.id] = course.name;
			return map;
		}, {} as Record<string, string>) ?? {}
);

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
		for (const user of value) {
			assignments[user._id] = (user.tutors ?? []).map(t =>
				typeof t === "string" ? t : t._id
			);
			editing[user._id] = false;
			courses[user._id] = [...(user.courseAccess ?? [])];
		}
		userAssignments.value = assignments;
		userEditing.value = editing;
		userCourseSelections.value = courses;
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
	currentAdmin.value && tutors.value.length === 0 ? "No Tutors" : "Tutors"
);

const usersHeader = computed(() =>
	currentAdmin.value && users.value.length === 0 ? "No Users" : "Users"
);

const tutorLookup = computed(() => {
	const lookup: Record<string, string> = {};
	for (const t of tutors.value) lookup[t._id] = t.name;
	return lookup;
});

function formatAssignedTutors(userID: string) {
	const assigned = userAssignments.value[userID] ?? [];
	if (assigned.length === 0) return "No tutors assigned";
	return assigned.map(id => tutorLookup.value[id] ?? "Unknown").join(", ");
}

function formatTutorCourses(tutorID: string) {
	const list = tutorCourseSelections.value[tutorID] ?? [];
	if (list.length === 0) return "No courses enabled";
	const names = courseNameMap.value ?? {};
	return list.map(id => names[id] ?? id).join(", ");
}

watch(
	currentAdmin,
	value => {
		adminDraft.value = value ? { ...value } : null;
	},
	{ immediate: true }
);

function activateCard(id: string) {
        // Prevent collapsing the admin card while editing.
        if (adminEdit.value && id === "admin") return;
        if (id.startsWith("tutor-")) {
                const tutorID = id.slice("tutor-".length);
                if (tutorEditing.value[tutorID]) return; // keep open while editing
        }
        if (id.startsWith("user-")) {
                const userID = id.slice("user-".length);
                if (userEditing.value[userID]) return; // keep open while editing
        }
        activeCard.value = activeCard.value === id ? null : id;
}

function isCardActive(id: string) {
	return activeCard.value === id;
}

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
	}
	userEditing.value = { ...userEditing.value, [userID]: false };
	success.value = "";
	error.value = "";
}

function toggleTutorEdit(tutorID: string) {
	if (!tutorEditing.value[tutorID]) activeCard.value = `tutor-${tutorID}`;
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

async function saveAssignments(userID: string) {
	try {
		await api.put(`/users/${userID}/tutors`, {
			tutorIDs: userAssignments.value[userID] ?? []
		});
		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		success.value = "Saved tutor assignments.";
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to update tutors";
	}
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

function updateAdminDraft(key: string, value: any) {
	if (!adminDraft.value) return;
	adminDraft.value = { ...adminDraft.value, [key]: value };
}

function toggleAdminEdit() {
	if (!adminDraft.value && currentAdmin.value) {
		adminDraft.value = { ...currentAdmin.value };
	}
	toggleAdmin();
	// Ensure card stays open when entering edit mode.
	if (adminEdit.value) activeCard.value = "admin";
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

async function saveUserCourses(userID: string) {
	try {
		success.value = "";
		error.value = "";
		const allowed = userAllowedCourses.value[userID] ?? new Set<string>();
		const selection = (userCourseSelections.value[userID] ?? []).filter(
			id => allowed.has(id)
		);
		await api.put(`/users/${userID}/courses`, {
			courseIDs: selection
		});
		success.value = "Updated user course access.";
		await app.fetchUsers();
		userEditing.value = { ...userEditing.value, [userID]: false };
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to update courses";
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
		await api.delete(`/users/user/${userID}`);
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
	<section class="Signup text-center">
		<h2>{{ viewMode === "profile" ? "Profile" : "Manage profiles" }}</h2>

		<template v-if="viewMode === 'profile'">
			<!-- ───── Admin card ───── -->
			<div
				v-if="currentAdmin"
				class="tutorList mt-2"
				:class="[{ active: isCardActive('admin') }]"
				@click="activateCard('admin')"
			>
				<br />
				<!--				<p v-if="!isCardActive('admin')" class="card-hint">
					Click to edit admin details or security settings.
				</p> -->
				<ProfileDetailsCard
					v-if="currentAdmin"
					:editing="adminEdit"
					:entity="
						adminEdit && adminDraft ? adminDraft : currentAdmin
					"
					:entity-id="currentAdmin._id"
					:fields="fields"
					role="admin"
					:show-security="isCardActive('admin')"
					@update="updateAdminDraft"
				/>
				<br />

				<div
					v-if="adminEdit || isCardActive('admin')"
					class="card-actions"
				>
					<button
						v-if="adminEdit"
						class="btn btn-secondary"
						@click.stop="cancelAdminEdit"
					>
						Cancel
					</button>
					<button
						class="btn-primary btn"
						@click.stop="
							adminEdit ? saveAdminProfile() : toggleAdminEdit()
						"
					>
						{{ adminEdit ? "Save" : "Edit" }}
					</button>
				</div>
			</div>

			<!-- ───── Tutors list (read-only) ───── -->
			<hr />
			<h2>{{ tutorsHeader }}</h2>
			<div
				v-for="t in tutors"
				:key="t._id"
				class="tutorList mt-2"
				:class="[{ active: isCardActive(`tutor-${t._id}`) }]"
				@click="activateCard(`tutor-${t._id}`)"
			>
				<br />
				<ul>
					<ProfileFields
						:editing="false"
						:entity="t"
						:fields="fields"
					/>
				</ul>
				<p class="assignment">
					<strong>Course access:</strong>
					{{ formatTutorCourses(t._id) }}
				</p>
				<div v-if="isCardActive(`tutor-${t._id}`)" class="card-actions">
					<button
						v-if="!tutorEditing[t._id]"
						class="btn-secondary btn"
						type="button"
						@click.stop="toggleTutorEdit(t._id)"
					>
						Edit courses
					</button>
				</div>
				<div v-if="tutorEditing[t._id]" class="course-editor">
					<p class="helperText">
						Select which courses this tutor can access.
					</p>
					<div class="checkbox-grid">
						<label
							v-for="course in courseOptions"
							:key="course.id"
							@click.stop
						>
							<input
								:checked="
									tutorCourseSelections[t._id]?.includes(
										course.id
									)
								"
								type="checkbox"
								@change.stop="
									onTutorCourseToggle(
										t._id,
										course.id,
										($event.target as HTMLInputElement)
											.checked
									)
								"
							/>
							{{ course.name }}
						</label>
					</div>
					<div class="card-actions">
						<button
							class="btn btn-primary"
							type="button"
							@click.stop="saveTutorCourses(t._id)"
						>
							Save courses
						</button>
						<button
							class="btn btn-secondary"
							type="button"
							@click.stop="cancelTutorEdit(t._id)"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>

			<!-- ───── Users list (read-only) ───── -->
			<hr />
			<h2>{{ usersHeader }}</h2>
			<div
				v-for="u in users"
				:key="u._id"
				class="tutorList mt-2"
				:class="[{ active: isCardActive(`user-${u._id}`) }]"
				@click="activateCard(`user-${u._id}`)"
			>
				<br />
				<ul>
					<ProfileFields
						:editing="false"
						:entity="u"
						:fields="fields"
					/>
				</ul>
                                <p class="assignment">
                                        <strong>Assigned tutors:</strong>
                                        {{ formatAssignedTutors(u._id) }}
                                </p>
                                <p class="assignment">
                                        <strong>Course access:</strong>
{{
(userCourseSelections[u._id]?.length ?? 0)
? (userCourseSelections[u._id] ?? [])
.map(id => courseNameMap.value?.[id] ?? id)
.join(", ")
: "No courses assigned"
}}
</p>
				<div v-if="isCardActive(`user-${u._id}`)" class="card-actions">
					<button
						v-if="!userEditing[u._id]"
						class="btn-secondary btn"
						type="button"
						@click.stop="startUserEdit(u._id)"
					>
						Edit assignments
					</button>
				</div>

				<div v-if="userEditing[u._id]" class="assignmentControls">
					<!-- Tutor assignment select -->
					<label
						class="assignmentLabel"
						:for="`tutor-select-${u._id}`"
						@click.stop
					>
						Assign Tutors
					</label>
					<select
						:id="`tutor-select-${u._id}`"
						:disabled="tutors.length === 0"
						multiple
						:value="userAssignments[u._id] ?? []"
						@change.stop="onTutorSelectionChange(u._id, $event)"
						@click.stop
					>
						<option v-for="t in tutors" :key="t._id" :value="t._id">
							{{ t.name }}
						</option>
					</select>

					<!-- Courses editor -->
					<div class="course-editor">
						<p class="helperText">
							Enable courses available from the user's assigned
							tutors.
						</p>
						<div class="checkbox-grid">
							<label
								v-for="course in courseOptions"
								:key="course.id"
								:class="{
									disabled: !userAllowedCourses[u._id]?.has(
										course.id
									)
								}"
								@click.stop
							>
								<input
									:checked="
										userCourseSelections[u._id]?.includes(
											course.id
										)
									"
									:disabled="
										!userAllowedCourses[u._id]?.has(
											course.id
										)
									"
									type="checkbox"
									@change.stop="
										onUserCourseToggle(
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

						<!-- Unified actions -->
						<div class="assignmentActions">
							<button
								class="btn btn-primary"
								type="button"
								@click.stop="saveAssignments(u._id)"
							>
								Save Tutors
							</button>
							<button
								class="btn btn-primary"
								type="button"
								@click.stop="saveUserCourses(u._id)"
							>
								Save Courses
							</button>
							<button
								class="btn btn-secondary"
								type="button"
								@click.stop="cancelUserEdit(u._id)"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>

		<template v-else>
			<div
				v-if="currentAdmin"
				class="tutorList mt-2"
				:class="[{ active: isCardActive('admin-manage') }]"
				@click="activateCard('admin-manage')"
			>
				<br />
				<ul>
					<ProfileFields
						:editing="false"
						:entity="currentAdmin"
						:fields="fields"
					/>
				</ul>
				<div v-if="isCardActive('admin-manage')" class="card-actions">
					<button
						class="btn btn-danger"
						type="button"
						@click.stop="confirmDeleteAdmin"
					>
						Delete admin account
					</button>
				</div>
			</div>

			<hr />
			<h2>{{ tutorsHeader }}</h2>
			<div
				v-for="t in tutors"
				:key="t._id"
				class="tutorList mt-2"
				:class="[{ active: isCardActive(`manage-tutor-${t._id}`) }]"
				@click="activateCard(`manage-tutor-${t._id}`)"
			>
				<br />
				<ul>
					<ProfileFields
						:editing="false"
						:entity="t"
						:fields="fields"
					/>
				</ul>
				<div
					v-if="isCardActive(`manage-tutor-${t._id}`)"
					class="card-actions"
				>
					<button
						class="btn btn-secondary"
						type="button"
						@click.stop="confirmDemote(t._id)"
					>
						Demote to user
					</button>
					<button
						class="btn btn-danger"
						type="button"
						@click.stop="removeTutor(t._id)"
					>
						Delete tutor
					</button>
				</div>
			</div>

			<hr />
			<h2>{{ usersHeader }}</h2>
			<div
				v-for="u in users"
				:key="u._id"
				class="tutorList mt-2"
				:class="[{ active: isCardActive(`manage-user-${u._id}`) }]"
				@click="activateCard(`manage-user-${u._id}`)"
			>
				<br />
				<ul>
					<ProfileFields
						:editing="false"
						:entity="u"
						:fields="fields"
					/>
				</ul>
				<div
					v-if="isCardActive(`manage-user-${u._id}`)"
					class="card-actions"
				>
					<button
						class="btn btn-primary"
						type="button"
						@click.stop="promoteToTutor(u._id)"
					>
						Promote to tutor
					</button>
					<button
						class="btn btn-danger"
						type="button"
						@click.stop="removeUser(u._id)"
					>
						Delete user
					</button>
				</div>
			</div>
		</template>

		<p v-if="success" class="status">{{ success }}</p>
		<p v-if="error" class="error">
			{{ error }}
		</p>
	</section>
</template>

<style scoped>
ul {
	list-style-type: none;
	display: flex;
	flex-flow: column;
}

ul p {
	display: inline;
}

div.tutorList,
li {
	align-self: center;
}

.hidden {
	display: none;
}

div.tutorList {
	outline: black solid 1px;
	padding-bottom: 1%;
	width: 35%;
	margin: auto;
	cursor: pointer;
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
}

.tutorList.active {
	border-color: #2563eb;
	box-shadow: 0 12px 28px rgba(37, 99, 235, 0.2);
}

@media only screen and (max-width: 960px) {
	div.tutorList {
		width: 50%;
	}
}

.card-hint {
	color: rgba(15, 23, 42, 0.7);
	margin-bottom: 0.5rem;
}

.assignment {
	margin: 0.5rem 0 1rem;
}

.card-actions {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 0.5rem auto 1rem;
	width: 90%;
}

.assignmentControls {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 1rem auto 0;
	width: 90%;
}

.assignmentControls select {
	min-height: 6rem;
	padding: 0.25rem;
}

.assignmentActions {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	justify-content: center;
}

.course-editor {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 0.5rem auto 1rem;
	width: 90%;
}

.checkbox-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 0.5rem;
}

.checkbox-grid label {
	display: flex;
	align-items: center;
	gap: 0.35rem;
	font-size: 0.9rem;
}

.checkbox-grid label.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.status {
	color: #15803d;
	margin-top: 0.75rem;
}

.error {
	color: red;
	margin-top: 10px;
}
</style>
