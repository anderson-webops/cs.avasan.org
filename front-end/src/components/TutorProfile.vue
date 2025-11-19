<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

/* -------------------------------------------------- */
const app = useAppStore();
const { currentTutor, users } = storeToRefs(app);
const error = ref("");
const success = ref("");
const deleteMe = useDeleteAccount("tutor");

/* editable (the tutor card itself) */
const {
	editing: tutorEdit,
	toggle: toggleTutor,
	save: saveTutor
} = useEditable("tutor");

/* field list */
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
	currentTutor.value && users.value.length === 0 ? "No Users" : "Users"
);

const cardState = ref<string | null>(null);

function activateCard(id: string) {
	cardState.value = cardState.value === id ? null : id;
}

function isCardActive(id: string) {
	return cardState.value === id;
}

function userCardId(id: string) {
	return `user-${id}`;
}

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
	<section class="Signup text-center">
		<h2>Profile</h2>

		<!-- ───── Tutor card ───── -->
		<div
			v-if="currentTutor"
			class="tutorList mt-2"
			:class="[{ active: isCardActive('tutor') }]"
			@click="activateCard('tutor')"
		>
			<br />
			<p v-if="!isCardActive('tutor')" class="card-hint">
				Click your card to edit details or manage security.
			</p>
			<ul>
				<li><h4>Tutor</h4></li>

				<ProfileFields
					:editing="tutorEdit"
					:entity="currentTutor"
					:fields="tutorFields"
				/>
			</ul>
			<br />
			<p class="assignment">
				<strong>Courses enabled:</strong>
				{{
					permittedCourses.length
						? permittedCourses.map(course => course.name).join(", ")
						: "Waiting for admin access"
				}}
			</p>

			<div v-if="isCardActive('tutor')" class="card-actions">
				<button
					class="btn-danger btn"
					@click.stop="deleteMe(currentTutor!._id)"
				>
					Delete
				</button>
				<button
					class="btn-primary btn"
					@click.stop="
						tutorEdit ? saveTutor(currentTutor) : toggleTutor()
					"
				>
					{{ tutorEdit ? "Save" : "Edit" }}
				</button>
			</div>

			<AccountSecurity
				v-if="isCardActive('tutor')"
				:email="currentTutor.email"
				:entity-id="currentTutor._id"
				role="tutor"
			/>
		</div>

		<!-- ───── Users under this tutor (read-only) ───── -->
		<hr />
		<h2>{{ usersHeader }}</h2>

		<div
			v-for="u in users"
			:key="u._id"
			class="tutorList mt-2"
			:class="[{ active: isCardActive(userCardId(u._id)) }]"
			@click="activateCard(userCardId(u._id))"
		>
			<br />
			<ul>
				<!-- Fields: name / email / age / state -->
				<!-- Editing = false: read-only list -->
				<ProfileFields
					:editing="false"
					:entity="u"
					:fields="tutorFields"
				/>
			</ul>
			<p class="assignment">
				<strong>Course access:</strong>
				{{
					(u.courseAccess?.length ?? 0)
						? (u.courseAccess ?? [])
								.map(id => courseLookup[id] ?? id)
								.join(", ")
						: "No courses assigned"
				}}
			</p>

			<div v-if="isCardActive(userCardId(u._id))" class="card-actions">
				<button
					class="btn-secondary btn"
					type="button"
					@click.stop="toggleUserEdit(u._id)"
				>
					{{ userEditing[u._id] ? "Close" : "Edit courses" }}
				</button>
			</div>

			<div v-if="userEditing[u._id]" class="course-editor">
				<p v-if="permittedCourses.length === 0" class="hint">
					Your admin hasn't enabled any courses yet.
				</p>
				<div v-else class="checkbox-grid">
					<label
						v-for="course in permittedCourses"
						:key="course.id"
						@click.stop
					>
						<input
							:checked="
								userCourseSelections[u._id]?.includes(course.id)
							"
							type="checkbox"
							@change.stop="
								onCourseToggle(
									u._id,
									course.id,
									($event.target as HTMLInputElement).checked
								)
							"
						/>
						{{ course.name }}
					</label>
				</div>
				<button
					class="btn btn-primary"
					type="button"
					@click.stop="saveUserCourses(u._id)"
				>
					Save courses
				</button>
			</div>
		</div>

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
	flex-direction: column;
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

.card-hint {
	color: rgba(15, 23, 42, 0.7);
	margin-bottom: 0.5rem;
}

.assignment {
	margin: 0.5rem 0 1rem;
}

.card-actions {
	display: flex;
	gap: 0.75rem;
	justify-content: center;
	flex-wrap: wrap;
}

.course-editor {
	margin-top: 1rem;
	border-top: 1px solid rgba(15, 23, 42, 0.15);
	padding-top: 1rem;
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

.status {
	color: #15803d;
	margin-top: 0.5rem;
}

.hint {
	color: rgba(15, 23, 42, 0.7);
	margin-bottom: 0.75rem;
}

@media (max-width: 960px) {
	div.tutorList {
		width: 50%;
	}
}

.error {
	color: red;
	margin-top: 10px;
}
</style>
