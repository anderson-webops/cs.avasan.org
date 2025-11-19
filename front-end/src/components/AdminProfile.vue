<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";

/* -------------------------------------------------- */
const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const error = ref("");
const deleteMe = useDeleteAccount("admin");
const userAssignments = ref<Record<string, string[]>>({});

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
		for (const user of value) {
			assignments[user._id] = [...(user.tutors ?? []).map(String)];
		}
		userAssignments.value = assignments;
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
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to update tutors";
	}
}

async function promoteToTutor(userID: string) {
	try {
		await api.post(`/users/${userID}/promote`);
		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to promote user";
	}
}
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<!-- ───── Admin card ───── -->
		<div v-if="currentAdmin" class="tutorList mt-2">
			<br />
			<ul>
				<li><h4>Admin</h4></li>

				<ProfileFields
					:editing="adminEdit"
					:entity="currentAdmin"
					:fields="fields"
				/>
			</ul>
			<br />

			<button class="btn-danger btn" @click="deleteMe(currentAdmin!._id)">
				Delete
			</button>
			<button
				class="btn-primary btn"
				@click="adminEdit ? saveAdmin(currentAdmin) : toggleAdmin()"
			>
				{{ adminEdit ? "Save" : "Edit" }}
			</button>
		</div>

		<!-- ───── Tutors list (read-only) ───── -->
		<hr />
		<h2>{{ tutorsHeader }}</h2>
		<div v-for="t in tutors" :key="t._id" class="tutorList mt-2">
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="t" :fields="fields" />
			</ul>
		</div>

		<!-- ───── Users list (read-only) ───── -->
		<hr />
		<h2>{{ usersHeader }}</h2>
		<div v-for="u in users" :key="u._id" class="tutorList mt-2">
			<br />
			<ul>
				<ProfileFields :editing="false" :entity="u" :fields="fields" />
			</ul>
			<div class="assignmentControls">
				<label class="assignmentLabel" :for="`tutor-select-${u._id}`">
					Assign Tutors
				</label>
				<select
					:id="`tutor-select-${u._id}`"
					:disabled="tutors.length === 0"
					multiple
					:value="userAssignments[u._id] ?? []"
					@change="onTutorSelectionChange(u._id, $event)"
				>
					<option v-for="t in tutors" :key="t._id" :value="t._id">
						{{ t.name }}
					</option>
				</select>
				<p class="currentAssignments">
					<strong>Current:</strong>
					{{ formatAssignedTutors(u._id) }}
				</p>
				<div class="assignmentActions">
					<button
						class="btn btn-primary"
						type="button"
						@click="saveAssignments(u._id)"
					>
						Save Assignments
					</button>
					<button
						class="btn btn-secondary"
						type="button"
						@click="promoteToTutor(u._id)"
					>
						Promote to Tutor
					</button>
				</div>
			</div>
		</div>

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
}

@media only screen and (max-width: 960px) {
	div.tutorList {
		width: 50%;
	}
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

.currentAssignments {
	margin: 0;
}

.error {
	color: red;
	margin-top: 10px;
}
</style>
