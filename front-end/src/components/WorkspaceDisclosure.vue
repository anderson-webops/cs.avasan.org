<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from "vue";

const props = withDefaults(
	defineProps<{
		label?: string;
		popover?: boolean;
		embedded?: boolean;
		triggerClass?: string;
	}>(),
	{ label: "", popover: false, embedded: false, triggerClass: "" }
);
const emit = defineEmits<{ toggle: [open: boolean] }>();
const expanded = defineModel<boolean>("open", { default: false });
const root = ref<HTMLElement>();
const trigger = ref<HTMLButtonElement>();
const panelId = useId();
const triggerId = `${panelId}-trigger`;

watch(expanded, value => emit("toggle", value));

function close() {
	expanded.value = false;
}

async function onEscape(event: KeyboardEvent) {
	if (!expanded.value || props.embedded) return;
	event.preventDefault();
	event.stopPropagation();
	close();
	await nextTick();
	trigger.value?.focus();
}

function onOutsidePointer(event: PointerEvent) {
	if (
		props.popover &&
		expanded.value &&
		event.target instanceof Node &&
		!root.value?.contains(event.target)
	) {
		close();
	}
}

function onFocusOut(event: FocusEvent) {
	if (
		props.popover &&
		event.relatedTarget instanceof Node &&
		!root.value?.contains(event.relatedTarget)
	) {
		close();
	}
}

onMounted(() => {
	if (props.popover) {
		document.addEventListener("pointerdown", onOutsidePointer);
	}
});
onBeforeUnmount(() =>
	document.removeEventListener("pointerdown", onOutsidePointer)
);
defineExpose({ close });
</script>

<template>
	<section
		ref="root"
		class="workspace-disclosure"
		:class="{
			'is-open': expanded,
			'is-popover': popover,
			'is-embedded': embedded
		}"
		@keydown.esc="onEscape"
		@focusout="onFocusOut"
	>
		<button
			v-if="!embedded"
			:id="triggerId"
			ref="trigger"
			type="button"
			class="workspace-disclosure__trigger"
			:class="triggerClass"
			:aria-expanded="expanded"
			:aria-controls="panelId"
			@click="expanded = !expanded"
		>
			<span class="workspace-disclosure__label"
				><slot name="label">{{ label }}</slot></span
			>
			<span
				v-if="!popover"
				class="workspace-disclosure__action"
				aria-hidden="true"
				>{{ expanded ? "Hide" : "Show" }}</span
			>
		</button>
		<div
			v-show="embedded || expanded"
			:id="panelId"
			class="workspace-disclosure__content"
			:aria-labelledby="embedded ? undefined : triggerId"
		>
			<slot />
		</div>
	</section>
</template>

<style scoped>
.workspace-disclosure {
	min-width: 0;
}
.workspace-disclosure__trigger {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	width: 100%;
	min-height: 2.25rem;
	margin: 0;
	padding: 0.4rem 0.65rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm, 6px);
	background: transparent;
	color: var(--color-ink);
	font: inherit;
	font-size: 0.9rem;
	text-align: left;
	cursor: pointer;
}
.workspace-disclosure__trigger:hover {
	background: var(--color-surface-soft);
}
.workspace-disclosure__label {
	min-width: 0;
}
.workspace-disclosure__action {
	flex: 0 0 auto;
	font-size: 0.8rem;
	color: var(--color-ink-soft);
}
.workspace-disclosure__content {
	min-width: 0;
	padding-top: 0.75rem;
}
.workspace-disclosure.is-popover {
	position: relative;
	display: inline-block;
}
.is-popover .workspace-disclosure__content {
	position: absolute;
	top: calc(100% + 0.35rem);
	right: 0;
	z-index: 50;
	width: max-content;
	max-width: min(24rem, calc(100vw - 2rem));
	padding: 0.75rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm, 6px);
	background: var(--color-surface-strong);
	box-shadow: var(--shadow-soft);
}
.is-embedded > .workspace-disclosure__content {
	padding: 0;
}
</style>
