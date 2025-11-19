<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ProfileFields from "@/components/ProfileFields.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { useEditable } from "@/composables/useEditable";
import { useAppStore } from "@/stores/app";

/* -------------------------------------------------- */
/*  Pinia state                                       */
/* -------------------------------------------------- */
const app = useAppStore();
const { currentUser, tutors } = storeToRefs(app);
const deleteMe = useDeleteAccount("user");

/* -------------------------------------------------- */
/*  editable helper                                   */
/* -------------------------------------------------- */
const { editing, toggle, save } = useEditable("user");

const cardActive = ref(false);

function activateCard() {
	cardActive.value = true;
}

const assignedTutorNames = computed(() => {
	if (!currentUser.value?.tutors?.length) return [] as string[];
	return currentUser.value.tutors
		.map(t => (typeof t === "string" ? (tutors.value.find(tt => tt._id === t)?.name ?? null) : t.name))
		.filter((name): name is string => !!name);
});

/* -------------------------------------------------- */
/*  field list (only once)                            */
/* -------------------------------------------------- */
const fields = [
	{ key: "name", label: "Name" },
	{ key: "email", label: "Email" },
	{ key: "age", label: "Age" },
	{ key: "state", label: "State" }
];
</script>

<template>
	<section class="Signup text-center">
		<h2>Profile</h2>

		<div v-if="currentUser" class="tutorList mt-2" :class="[{ active: cardActive }]" @click="activateCard">
			<br />
			<p v-if="!cardActive" class="card-hint">Click the card to manage your details.</p>
			<ul>
				<li>
					<h4>User</h4>
				</li>

				<ProfileFields :editing="editing" :entity="currentUser" :fields="fields" />
			</ul>
			<br />
			<p class="assignment">
				<strong>Assigned tutor(s):</strong>
				{{ assignedTutorNames.length ? assignedTutorNames.join(", ") : "No tutor assigned" }}
			</p>

			<div v-if="cardActive" class="card-actions">
				<button class="btn-danger btn" @click.stop="deleteMe(currentUser!._id)">Delete</button>
				<button class="btn-primary btn" @click.stop="editing ? save(currentUser) : toggle()">
					{{ editing ? "Save" : "Edit" }}
				</button>
			</div>

			<AccountSecurity v-if="cardActive" :email="currentUser.email" :entity-id="currentUser._id" role="user" />
		</div>
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
