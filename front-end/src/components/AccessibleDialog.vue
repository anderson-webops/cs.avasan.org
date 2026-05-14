<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, ref, useSlots, watch } from "vue";

const props = withDefaults(
	defineProps<{
		closeLabel?: string;
		description?: string;
		dialogId: string;
		open: boolean;
		title: string;
	}>(),
	{
		closeLabel: "Close dialog",
		description: ""
	}
);

const emit = defineEmits<{
	close: [];
}>();

const FOCUSABLE_SELECTOR = [
	"a[href]",
	"button:not([disabled])",
	"textarea:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"[tabindex]:not([tabindex='-1'])"
].join(",");

const slots = useSlots();
const panel = ref<HTMLElement | null>(null);
let previousActiveElement: HTMLElement | null = null;
let previousBodyOverflow = "";

const titleId = computed(() => `${props.dialogId}-title`);
const descriptionId = computed(() =>
	props.description ? `${props.dialogId}-description` : undefined
);
const hasFooter = computed(() => !!slots.footer);

watch(
	() => props.open,
	async open => {
		if (!open) {
			restoreDocumentState();
			return;
		}

		if (typeof document !== "undefined") {
			previousActiveElement =
				document.activeElement as HTMLElement | null;
			previousBodyOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
		}

		await nextTick();
		focusFirstElement();
	}
);

onBeforeUnmount(restoreDocumentState);

function requestClose() {
	emit("close");
}

function restoreDocumentState() {
	if (typeof document !== "undefined") {
		document.body.style.overflow = previousBodyOverflow;
	}

	if (previousActiveElement?.isConnected) {
		previousActiveElement.focus();
	}
	previousActiveElement = null;
}

function focusableElements() {
	if (!panel.value) return [];
	return Array.from(
		panel.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
	).filter(element => !element.hasAttribute("disabled"));
}

function focusFirstElement() {
	const elements = focusableElements();
	(elements[0] ?? panel.value)?.focus();
}

function handleKeydown(event: KeyboardEvent) {
	if (event.key === "Escape") {
		event.preventDefault();
		requestClose();
		return;
	}

	if (event.key !== "Tab") return;

	const elements = focusableElements();
	if (elements.length === 0) {
		event.preventDefault();
		panel.value?.focus();
		return;
	}

	const first = elements[0];
	const last = elements[elements.length - 1];
	const active = document.activeElement;

	if (event.shiftKey && active === first) {
		event.preventDefault();
		last.focus();
		return;
	}

	if (!event.shiftKey && active === last) {
		event.preventDefault();
		first.focus();
	}
}
</script>

<template>
	<Teleport to="body">
		<div v-if="open" class="dialog-backdrop" @mousedown.self="requestClose">
			<section
				:id="dialogId"
				ref="panel"
				class="dialog-panel"
				role="dialog"
				aria-modal="true"
				:aria-labelledby="titleId"
				:aria-describedby="descriptionId"
				tabindex="-1"
				@keydown="handleKeydown"
			>
				<header class="dialog-header">
					<div>
						<h2 :id="titleId">{{ title }}</h2>
						<p
							v-if="description"
							:id="descriptionId"
							class="dialog-description"
						>
							{{ description }}
						</p>
					</div>
					<button
						class="dialog-close"
						type="button"
						:aria-label="closeLabel"
						@click="requestClose"
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</header>

				<div class="dialog-body">
					<slot />
				</div>

				<footer v-if="hasFooter" class="dialog-footer">
					<slot name="footer" />
				</footer>
			</section>
		</div>
	</Teleport>
</template>

<style scoped>
.dialog-backdrop {
	position: fixed;
	inset: 0;
	z-index: 1000;
	display: grid;
	place-items: start center;
	padding: clamp(1rem, 4vw, 3rem);
	overflow: auto;
	background: rgba(8, 15, 28, 0.68);
	backdrop-filter: blur(6px);
}

.dialog-panel {
	width: min(100%, 42rem);
	max-height: calc(100vh - 2rem);
	display: grid;
	gap: 1rem;
	overflow: auto;
	padding: clamp(1.25rem, 3vw, 1.8rem);
	border: 1px solid var(--color-border, rgba(148, 163, 184, 0.35));
	border-radius: 28px;
	background: var(--color-surface-strong, #fff);
	color: var(--color-ink, #10263a);
	box-shadow: 0 34px 90px -44px rgba(8, 15, 28, 0.8);
	outline: none;
}

.dialog-header {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 1rem;
	align-items: start;
}

.dialog-header h2 {
	margin: 0;
	color: var(--color-ink, #10263a);
	font-size: clamp(1.55rem, 4vw, 2.05rem);
	line-height: 1.12;
}

.dialog-description {
	margin: 0.5rem 0 0;
	color: var(--color-ink-soft, #526779);
	line-height: 1.6;
}

.dialog-close {
	display: inline-grid;
	place-items: center;
	width: 2.75rem;
	height: 2.75rem;
	border: 1px solid var(--color-border, rgba(148, 163, 184, 0.35));
	border-radius: 999px;
	background: var(--color-surface-soft, #f8fafc);
	color: var(--color-ink, #10263a);
	font-size: 1.65rem;
	font-weight: 800;
	line-height: 1;
	cursor: pointer;
}

.dialog-close:hover {
	background: var(--color-surface, #eef4fa);
}

.dialog-body {
	min-width: 0;
}

.dialog-footer {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 0.75rem;
	padding-top: 1rem;
	border-top: 1px solid var(--color-border, rgba(148, 163, 184, 0.28));
}

@media (max-width: 520px) {
	.dialog-footer {
		flex-direction: column-reverse;
	}

	.dialog-footer :deep(.btn),
	.dialog-footer :deep(button) {
		width: 100%;
	}
}
</style>
