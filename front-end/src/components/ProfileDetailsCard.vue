<script lang="ts" setup>
import { ref, watch } from "vue";
import AccountSecurity from "@/components/AccountSecurity.vue";

type Role = "admin" | "tutor" | "user";

interface Field {
	key: string;
	label: string;
}

const props = defineProps<{
	fields: Field[];
	entity: Record<string, any>;
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
				<li v-if="!editing" class="field-item">
					<span class="field-label">{{ f.label }}</span>
					<p class="field-value">
						{{ entity[f.key] || "Not provided" }}
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
	gap: 0.7rem;
}

.field-item {
	display: grid;
	gap: 0.4rem;
	padding: 0.9rem 1rem;
	border-radius: 18px;
	background: rgba(248, 250, 252, 0.86);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.72);
}

.field-label {
	font-size: 0.76rem;
	font-weight: 700;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: #5f7a8e;
}

.field-value {
	margin: 0;
	font-size: 1rem;
	line-height: 1.45;
	color: #12263a;
	word-break: break-word;
}
</style>
