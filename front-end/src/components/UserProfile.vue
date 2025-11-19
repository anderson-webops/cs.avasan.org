<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ProfileFields from "@/components/ProfileFields.vue";
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
/*  card active / accordion behavior                  */
/* -------------------------------------------------- */
const cardActive = ref(false);

function toggleCard() {
	// While editing, clicking the card should not hide/show anything.
	if (editing.value) return;
	cardActive.value = !cardActive.value;
}

/* -------------------------------------------------- */
/*  edit flow helpers                                 */
/* -------------------------------------------------- */
function onStartEdit() {
	if (!currentUser.value) return;
	// Enter edit mode, keep card open.
	if (!cardActive.value) cardActive.value = true;
	toggle();
}

function onCancelEdit() {
	// Just exit edit mode; card stays open with only Edit button visible.
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
	if (!user?.courseAccess?.length) return "No courses assigned";
	const names = courseNameMap.value ?? {};
	return user.courseAccess.map(id => names[id] ?? id).join(", ");
});

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
	<section class="Signup text-center">
		<h2>Profile</h2>

		<div
			v-if="currentUser"
			class="tutorList mt-2"
			:class="[{ active: cardActive }]"
			@click="toggleCard"
		>
			<br />

			<!-- Top: Assigned tutors + Course access (moved above name/email) -->
			<p class="assignment">
				<strong>Assigned tutors:</strong>
				{{
					assignedTutorNames.length
						? assignedTutorNames.join(", ")
						: "No tutors assigned"
				}}
			</p>

			<p class="assignment">
				<strong>Course access:</strong>
				{{ courseAccessText }}
			</p>

			<!-- Middle: either profile fields OR AccountSecurity while editing -->
			<div class="content-block">
				<ul v-if="!editing">
					<ProfileFields
						:editing="false"
						:entity="currentUser"
						:fields="fields"
					/>
				</ul>

				<AccountSecurity
					v-else
					:email="currentUser.email"
					:entity-id="currentUser._id"
					role="user"
					@click.stop
				/>
			</div>

			<!-- Bottom actions:
				 - When card is opened (active) and NOT editing → only Edit button.
				 - When editing → Cancel / Save buttons (Delete commented out). -->
			<div v-if="cardActive" class="card-actions" @click.stop>
				<template v-if="!editing">
					<button
						class="btn-primary btn"
						type="button"
						@click.stop="onStartEdit"
					>
						Edit
					</button>
				</template>

				<template v-else>
					<!--
					<button
					  class="btn-danger btn"
					  type="button"
					  @click.stop="deleteMe(currentUser!._id)"
					>
					  Delete account
					</button>
					-->
					<button
						class="btn-secondary btn"
						type="button"
						@click.stop="onCancelEdit"
					>
						Cancel
					</button>
					<button
						class="btn-primary btn"
						type="button"
						@click.stop="onSaveEdit"
					>
						Save
					</button>
				</template>
			</div>
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

.assignment {
	text-align: left;
	width: 90%;
	margin: 0.25rem auto;
}

.content-block {
	margin: 0.75rem auto 0.5rem;
	width: 90%;
}

.card-actions {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
	margin: 0.5rem auto 1rem;
	width: 90%;
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
