<script setup lang="ts">
import { useId } from "vue";

defineProps<{ label: string; options: { value: string; label: string }[] }>();
const model = defineModel<string>({ required: true });
const groupName = useId();
</script>

<template>
	<fieldset class="workspace-view-toggle">
		<legend class="sr-only">{{ label }}</legend>
		<label v-for="option in options" :key="option.value">
			<input
				v-model="model"
				:name="groupName"
				type="radio"
				:value="option.value"
			/>
			<span>{{ option.label }}</span>
		</label>
	</fieldset>
</template>

<style scoped>
.workspace-view-toggle {
	display: flex;
	flex-wrap: wrap;
	gap: 0.25rem;
	min-width: 0;
	margin: 0;
	padding: 0;
	border: 0;
}
.workspace-view-toggle label {
	position: relative;
	margin: 0;
	cursor: pointer;
}
.workspace-view-toggle input {
	position: absolute;
	width: 1px;
	height: 1px;
	opacity: 0;
}
.workspace-view-toggle span {
	display: block;
	padding: 0.55rem 0.85rem;
	border-radius: var(--radius-sm);
	font-size: 0.95rem;
	color: var(--color-ink-soft);
}
.workspace-view-toggle input:checked + span {
	background: var(--color-surface-strong);
	color: var(--color-ink);
	box-shadow: inset 0 0 0 1px var(--color-border);
}
.workspace-view-toggle input:focus-visible + span {
	outline: 2px solid var(--color-accent);
	outline-offset: 2px;
}
</style>
