<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{
	content: string;
}>();

let markdownRendererPromise: Promise<{
	render: (content: string) => string;
}> | null = null;

function getMarkdownRenderer() {
	if (!markdownRendererPromise) {
		markdownRendererPromise = import("markdown-it").then(
			({ default: MarkdownIt }) =>
				new MarkdownIt({
					breaks: true,
					linkify: true
				})
		);
	}

	return markdownRendererPromise;
}

const renderedHtml = ref("");

watch(
	() => props.content,
	async (content, _previousContent, onCleanup) => {
		let cancelled = false;
		onCleanup(() => {
			cancelled = true;
		});

		if (!content) {
			renderedHtml.value = "";
			return;
		}

		const markdown = await getMarkdownRenderer();

		if (cancelled) {
			return;
		}

		renderedHtml.value = markdown.render(content);
	},
	{ immediate: true }
);
</script>

<template>
	<div class="item-content-markdown" v-html="renderedHtml" />
</template>
