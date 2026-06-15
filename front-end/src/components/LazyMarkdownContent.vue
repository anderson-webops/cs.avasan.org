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

<style scoped>
.item-content-markdown {
	--markdown-border: var(
		--course-border,
		var(--color-border, rgba(15, 23, 42, 0.12))
	);
	--markdown-text: var(--course-text, var(--color-ink, #0f172a));
	--markdown-text-soft: var(
		--course-text-soft,
		var(--color-ink-soft, #475569)
	);
	--markdown-accent: var(--course-accent, var(--color-accent, #0f766e));
	--markdown-code-bg: var(
		--course-code-bg,
		var(--color-surface-inset, rgba(15, 23, 42, 0.08))
	);
	--markdown-code-text: var(
		--course-code-text,
		var(--color-accent-strong, #17476f)
	);
	--markdown-table-bg: var(
		--course-table-bg,
		var(--color-surface-strong, rgba(255, 255, 255, 0.76))
	);
	--markdown-table-heading-bg: var(
		--course-table-heading-bg,
		var(--color-accent-soft, rgba(14, 116, 144, 0.1))
	);
	--markdown-table-row-alt-bg: var(
		--course-table-row-alt-bg,
		var(--color-surface-inset, rgba(15, 23, 42, 0.035))
	);
	max-width: 82ch;
	font-size: 1.02rem;
	line-height: 1.8;
	color: var(--markdown-text-soft);
}

.item-content-markdown :deep(h1),
.item-content-markdown :deep(h2),
.item-content-markdown :deep(h3),
.item-content-markdown :deep(h4) {
	margin: 0 0 0.85rem;
	line-height: 1.3;
	color: var(--markdown-text);
}

.item-content-markdown :deep(p),
.item-content-markdown :deep(ul),
.item-content-markdown :deep(ol),
.item-content-markdown :deep(blockquote) {
	margin: 0 0 0.95rem;
}

.item-content-markdown :deep(ul),
.item-content-markdown :deep(ol) {
	margin-inline-start: 0;
	padding-inline-start: 1.85rem;
	list-style-position: outside;
}

.item-content-markdown :deep(ul) {
	list-style-type: disc;
}

.item-content-markdown :deep(ol) {
	list-style-type: decimal;
}

.item-content-markdown :deep(table) {
	display: block;
	width: max-content;
	max-width: 100%;
	border-spacing: 0;
	border-collapse: separate;
	overflow-x: auto;
	border: 1px solid var(--markdown-border);
	border-radius: 14px;
	background: var(--markdown-table-bg);
	box-shadow: 0 12px 26px -24px rgba(15, 23, 42, 0.28);
}

.item-content-markdown :deep(th),
.item-content-markdown :deep(td) {
	padding: 0.65rem 0.8rem;
	border-right: 1px solid var(--markdown-border);
	border-bottom: 1px solid var(--markdown-border);
	text-align: left;
	vertical-align: top;
	min-width: 7.5rem;
}

.item-content-markdown :deep(th:last-child),
.item-content-markdown :deep(td:last-child) {
	border-right: 0;
}

.item-content-markdown :deep(tr:last-child td) {
	border-bottom: 0;
}

.item-content-markdown :deep(th) {
	background: var(--markdown-table-heading-bg);
	color: var(--markdown-text);
	font-weight: 900;
}

.item-content-markdown :deep(tbody tr:nth-child(even) td) {
	background: var(--markdown-table-row-alt-bg);
}

.item-content-markdown :deep(li) {
	padding-inline-start: 0.35rem;
}

.item-content-markdown :deep(li + li) {
	margin-top: 0.45rem;
}

.item-content-markdown :deep(li::marker) {
	color: var(--markdown-accent);
	font-weight: 800;
}

.item-content-markdown :deep(li > p) {
	margin-bottom: 0.35rem;
}

.item-content-markdown :deep(a) {
	color: var(--markdown-accent);
	font-weight: 700;
	text-decoration-thickness: 0.08em;
	text-underline-offset: 0.16em;
}

.item-content-markdown :deep(code) {
	font-family:
		"JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono",
		monospace;
	font-size: 0.88rem;
	background: var(--markdown-code-bg);
	color: var(--markdown-code-text);
	padding: 0.15rem 0.4rem;
	border-radius: 0.35rem;
}

.item-content-markdown :deep(pre) {
	padding: 0.95rem 1rem;
	border-radius: 16px;
	background: #0f172a;
	color: #e2e8f0;
	overflow-x: auto;
}

.item-content-markdown :deep(pre code) {
	padding: 0;
	background: transparent;
	color: inherit;
}

.item-content-markdown :deep(blockquote) {
	padding: 0.85rem 1rem;
	border-left: 4px solid var(--markdown-accent);
	border-radius: 0 14px 14px 0;
	background: var(--markdown-table-row-alt-bg);
	color: var(--markdown-text);
}
</style>
