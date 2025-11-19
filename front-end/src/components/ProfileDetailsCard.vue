<script lang="ts" setup>
import { ref, watch } from "vue";
import AccountSecurity from "@/components/AccountSecurity.vue";
import ProfileFields from "@/components/ProfileFields.vue";

type Displayable = string | number | boolean | null | undefined;
type Role = "admin" | "tutor" | "user";

interface Field {
	key: string;
	label: string;
}

const props = defineProps<{
	fields: Field[];
	entity: Record<string, Displayable>;
	editing: boolean;
	showSecurity?: boolean;
	role: Role;
	entityId: string;
}>();

const emit = defineEmits<{
	(e: "update", key: string, value: Displayable): void;
}>();

const securityEmail = ref<string>(String(props.entity.email ?? ""));

watch(
	() => props.entity.email,
	value => {
		securityEmail.value = String(value ?? "");
	}
);

function forwardUpdate(key: string, value: Displayable) {
	emit("update", key, value);
}
</script>

<template>
	<div class="profile-details-card">
		<ul class="field-list">
			<ProfileFields
				:editing="editing"
				:entity="entity"
				:fields="fields"
				@update="forwardUpdate"
			/>
		</ul>

		<AccountSecurity
			v-if="showSecurity"
			:email="securityEmail"
			:entity-id="entityId"
			:role="role"
		/>
	</div>
</template>

<style scoped>
.field-list {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
}
</style>
