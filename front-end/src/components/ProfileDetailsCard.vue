<script lang="ts" setup>
import { ref, watch } from "vue";
import AccountSecurity from "@/components/AccountSecurity.vue";

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

const securityEmail = ref<string>(String(props.entity.email ?? ""));

watch(
	() => props.entity.email,
	value => {
		securityEmail.value = String(value ?? "");
	}
);
</script>

<template>
	<div class="profile-details-card">
		<ul class="field-list">
			<template v-for="f in fields" :key="f.key">
				<li v-if="!editing">
					<strong v-if="false">{{ f.label }}</strong>
					&ensp;
					<p class="d-inline">
						{{ entity[f.key] }}
					</p>
				</li>
			</template>
		</ul>

		<AccountSecurity
			v-if="editing"
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
