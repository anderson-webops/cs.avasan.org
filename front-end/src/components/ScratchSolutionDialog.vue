<script lang="ts" setup>
import { computed } from "vue";
import { isScratchProjectEmbedUrl } from "@/modules/resourceUrls";
import AccessibleDialog from "./AccessibleDialog.vue";

const props = defineProps<{ embedUrl: string; open: boolean; title: string }>();
const emit = defineEmits<{ close: [] }>();
const verifiedEmbedUrl = computed(() =>
	isScratchProjectEmbedUrl(props.embedUrl) ? props.embedUrl : null
);
const isOpen = computed(() => props.open && Boolean(verifiedEmbedUrl.value));
</script>

<template>
	<AccessibleDialog
		:open="isOpen"
		dialog-id="scratch-solution-dialog"
		:title="`Play ${title}`"
		description="This Scratch player loads only after you choose to play it."
		close-label="Close playable solution"
		@close="emit('close')"
	>
		<div class="scratch-player">
			<iframe
				v-if="isOpen && verifiedEmbedUrl"
				:src="verifiedEmbedUrl"
				:title="`Playable Scratch solution for ${title}`"
				width="485"
				height="402"
				frameborder="0"
				scrolling="no"
				loading="lazy"
				referrerpolicy="no-referrer"
				sandbox="allow-scripts allow-same-origin"
				allow="fullscreen"
				allowfullscreen
			/>
		</div>
		<p class="scratch-player-exit-help">
			When keyboard focus is inside Scratch, press Tab until “Close
			playable solution,” then activate it.
		</p>
		<template #footer>
			<button
				class="scratch-player-close"
				type="button"
				@click="emit('close')"
			>
				Close playable solution
			</button>
		</template>
	</AccessibleDialog>
</template>

<style scoped>
.scratch-player {
	width: min(100%, 485px);
	margin-inline: auto;
	aspect-ratio: 485 / 402;
	overflow: hidden;
	border-radius: 16px;
	background: #e2e8f0;
}
.scratch-player iframe {
	display: block;
	width: 100%;
	height: 100%;
	border: 0;
}
.scratch-player-exit-help {
	margin: 0.8rem 0 0;
	color: var(--color-ink-soft, #526779);
	font-size: 0.82rem;
	line-height: 1.5;
}
.scratch-player-close {
	min-height: 2.75rem;
	padding: 0.65rem 1rem;
	border: 1px solid var(--color-border, rgba(148, 163, 184, 0.35));
	border-radius: 999px;
	background: var(--color-surface-soft, #f8fafc);
	color: var(--color-ink, #10263a);
	font: inherit;
	font-weight: 800;
	cursor: pointer;
}
.scratch-player-close:hover {
	background: var(--color-surface, #eef4fa);
}
.scratch-player-close:focus-visible {
	outline: 3px solid var(--focus-ring-color, #2563eb);
	outline-offset: 3px;
}
</style>
