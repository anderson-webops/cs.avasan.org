<script lang="ts" setup>
import { ref, watch } from "vue";
import {
	courseAssetViewerUrl,
	isPreviewableCourseAsset
} from "@/modules/courseAssetPreview";

const props = defineProps<{
	content: string;
}>();

interface MarkdownToken {
	attrs: [string, string][] | null;
	attrIndex: (name: string) => number;
}

interface MarkdownRendererHelpers {
	renderToken: (
		tokens: MarkdownToken[],
		index: number,
		options: unknown
	) => string;
}

type MarkdownRenderRule = (
	tokens: MarkdownToken[],
	index: number,
	options: unknown,
	env: unknown,
	self: MarkdownRendererHelpers
) => string;

interface MarkdownRendererInstance {
	render: (content: string) => string;
	renderer: {
		rules: Record<string, MarkdownRenderRule | undefined>;
	};
}

let markdownRendererPromise: Promise<MarkdownRendererInstance> | null = null;

function getMarkdownRenderer() {
	if (!markdownRendererPromise) {
		markdownRendererPromise = import("markdown-it").then(
			({ default: MarkdownIt }) => {
				const markdown = new MarkdownIt({
					breaks: true,
					linkify: true
				}) as unknown as MarkdownRendererInstance;
				const defaultLinkOpen =
					markdown.renderer.rules.link_open ??
					((tokens, index, options, _env, self) =>
						self.renderToken(tokens, index, options));

				markdown.renderer.rules.link_open = (
					tokens,
					index,
					options,
					env,
					self
				) => {
					const token = tokens[index];
					const hrefIndex = token.attrIndex("href");

					if (hrefIndex >= 0) {
						const href = token.attrs?.[hrefIndex]?.[1] ?? "";
						if (isPreviewableCourseAsset(href)) {
							token.attrs![hrefIndex][1] =
								courseAssetViewerUrl(href);
						}
					}

					return defaultLinkOpen(tokens, index, options, env, self);
				};

				return markdown;
			}
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
