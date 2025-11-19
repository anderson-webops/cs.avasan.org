<script lang="ts" setup>
import type { Tutor, User } from "@/stores/app";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const {
	tutors,
	currentUser,
	currentTutor,
	currentAdmin: admin
} = storeToRefs(app);

const selectedTutor = ref<Tutor | null>(null);
const showTutors = ref(false);
const numberOfUsers = ref(0);
const error = ref("");

// fetch tutors & init select
async function getTutors() {
	await app.fetchTutors();
	if (tutors.value.length && !selectedTutor.value) {
		selectedTutor.value = tutors.value[0];
	}
}

// fetch total users
async function getNumberOfUsers() {
	const { data } = await api.get<User[]>("/users/all");
	numberOfUsers.value = data.length;
}

// fetch users for one tutor & sync count
async function getUsers(t: Tutor | null) {
	await getNumberOfUsers();
	if (!t) return;

	const { data } = await api.get<User[]>(`/users/oftutor/${t._id}`);
	app.setUsers(data);
	await api.put(`/tutors/${t._id}`, {
		...t,
		usersOfTutorLength: data.length
	});
}

// form submit
async function addUser() {
	if (!selectedTutor.value) {
		error.value = "No tutor selected.";
		return;
	}
	try {
		const { data } = await api.post(`/users/${selectedTutor.value._id}`, {
			currentUser: currentUser.value
		});
		if (data.currentUser) {
			app.setCurrentUser(data.currentUser);
		}
		app.setSignupBlock(false);
		await getUsers(selectedTutor.value);
	} catch (e: any) {
		error.value = `Error: ${e.response?.data?.message ?? e.message}`;
	}
}

// select tutor as current user
async function selectTutor(t: Tutor) {
	if (!currentUser.value) return;
	try {
		await api.put(`/users/selectTutor/${currentUser.value._id}/${t._id}`);
		await app.refreshCurrentUser();
	} catch (e: any) {
		error.value = `Error: ${e.response?.data?.message ?? e.message}`;
	}
}

// admin/tutor edit & delete
async function editTutor(t: Tutor) {
	if (!admin.value && currentTutor.value?._id !== t._id) return;
	try {
		await api.put(`/tutors/${t._id}`, {
			...t,
			editTutors: !t.editTutors,
			saveEdit: t.editTutors ? "Edit" : "Save"
		});
		await getTutors();
	} catch (e: any) {
		error.value = `Error: ${e.response?.data?.message ?? e.message}`;
	}
}

async function deleteTutor(t: Tutor) {
	if (!admin.value && currentTutor.value?._id !== t._id) return;
	try {
		await getUsers(t);
		await api.delete(`/users/under/${t._id}`);
		await api.delete(`/tutors/remove/${t._id}`);
		await getTutors();
		await getUsers(null);
	} catch (e: any) {
		error.value = `Error: ${e.response?.data?.message ?? e.message}`;
	}
}

onMounted(() => {
	getTutors()
		.then(() => getUsers(selectedTutor.value))
		.catch(() => {});
});
</script>

<template>
	<div>
		<h2 class="mt-5">Sign Up</h2>

		<div id="signup">
			<form id="signupForm" @submit.prevent="addUser">
				<select
					v-if="tutors.length"
					id="tutorSelect"
					v-model="selectedTutor"
					required
				>
					<option v-for="t in tutors" :key="t._id" :value="t">
						{{ t.name }}
					</option>
				</select>
				<p v-else class="notutors">No Tutors are available</p>

				<br />
				<button id="infoSubmit" class="mt-3" type="submit">
					Submit
				</button>
			</form>

			<button v-if="tutors.length" @click="showTutors = !showTutors">
				{{ showTutors ? "Hide" : "Show" }} tutors
			</button>

			<hr v-if="showTutors && tutors.length" />

			<template v-if="tutors.length">
				<h3>Total Tutors: {{ tutors.length }}</h3>
				<h3>Total Users : {{ numberOfUsers }}</h3>
			</template>

			<div
				v-for="t in tutors"
				v-show="showTutors"
				:key="t._id"
				class="tutorList mt-2"
			>
				<br />
				<ul>
					<template v-if="!t.editTutors">
						<li>
							<label class="hidden">Name:</label>&emsp;
							<p>{{ t.name }}</p>
						</li>
						<li>
							<label class="hidden">Email:</label>&emsp;
							<p>{{ t.email }}</p>
						</li>
						<li>
							<label class="hidden">Age:</label>&emsp;
							<p>{{ t.age }}</p>
						</li>
						<li>
							<label class="hidden">State:</label>&emsp;
							<p>{{ t.state }}</p>
						</li>
						<li>
							<label class="hidden">Users:</label>&emsp;
							<p>{{ t.usersOfTutorLength }}</p>
						</li>
					</template>

					<template v-else>
						<li>
							<label
								>Name:&emsp;
								<input
									v-model="t.name"
									class="editTutor"
									type="text"
								/>
							</label>
						</li>
						<li>
							<label
								>Email:&emsp;
								<input
									v-model="t.email"
									class="editTutor"
									type="text"
								/>
							</label>
						</li>
						<li>
							<label
								>Age:&emsp;
								<input
									v-model="t.age"
									class="editTutor"
									type="text"
								/>
							</label>
						</li>
						<li>
							<label
								>State:&emsp;
								<input
									v-model="t.state"
									class="editTutor"
									type="text"
								/>
							</label>
						</li>
					</template>
				</ul>
				<br />

				<!-- Admin or this tutor can remove/edit -->
				<button
					v-if="admin || currentTutor?._id === t._id"
					@click="deleteTutor(t)"
				>
					Remove
				</button>
				<button
					v-if="admin || currentTutor?._id === t._id"
					@click="editTutor(t)"
				>
					{{ t.saveEdit }}
				</button>

				<!-- user select -->
				<button
					v-if="currentUser"
					:class="{ colorSelect: currentUser?._id === t._id }"
					@click="selectTutor(t)"
				>
					Select
				</button>
			</div>
		</div>

		<p v-if="error" class="error">
			{{ error }}
		</p>
	</div>
</template>

<style scoped>
ul {
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

.colorSelect {
	color: blue;
	background: lightblue;
}

.notutors {
	text-align: center;
}

div.tutorList {
	outline: black solid 1px;
	padding-bottom: 1%;
	width: 35%;
	margin: auto;
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
