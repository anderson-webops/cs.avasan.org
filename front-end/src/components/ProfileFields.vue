<script lang="ts" setup>
interface Field {
	key: string;
	label: string;
}

defineProps<{
	fields: Field[];
	entity: Record<string, any>;
	editing: boolean;
}>();
const emit = defineEmits<{
	(e: "update", key: string, value: any): void;
}>();

function onInput(key: string, value: any) {
	emit("update", key, value);
}
</script>

<template>
	<template v-for="f in fields" :key="f.key">
		<li class="profile-field">
			<label v-if="editing" class="field-row is-editing" @click.stop>
				<span class="field-label">{{ f.label }}</span>
				<input
					:value="entity[f.key]"
					class="field-input"
					type="text"
					@input="
						onInput(
							f.key,
							($event.target as HTMLInputElement).value
						)
					"
					@click.stop
				/>
			</label>

			<div v-else class="field-row">
				<span class="field-label">{{ f.label }}</span>
				<p class="field-value">
					{{ entity[f.key] || "Not provided" }}
				</p>
			</div>
		</li>
	</template>
</template>

<style scoped>
.profile-field {
	list-style: none;
}

.field-row {
	display: grid;
	gap: 0.4rem;
	align-items: center;
	padding: 0.85rem 1rem;
	border-radius: 18px;
	background: rgba(248, 250, 252, 0.86);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.72);
}

.field-row.is-editing {
	gap: 0.55rem;
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

.field-input {
	width: 100%;
	border: 1px solid rgba(148, 163, 184, 0.55);
	border-radius: 14px;
	padding: 0.8rem 0.95rem;
	background: white;
	color: #0f172a;
	font: inherit;
}

.field-input:focus {
	outline: 2px solid rgba(37, 99, 235, 0.18);
	border-color: #3a6ea5;
}
</style>
