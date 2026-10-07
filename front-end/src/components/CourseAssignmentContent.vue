<script lang="ts" setup>
import type { LessonContentSection } from "@/modules/courseLessonPresentation";
import LazyMarkdownContent from "./LazyMarkdownContent.vue";

defineProps<{ sections: LessonContentSection[] }>();
</script>

<template>
	<div class="assignment-content">
		<template v-for="(section, index) in sections" :key="index">
			<section
				v-if="section.kind === 'assignment'"
				class="assignment-section"
			>
				<h6>{{ section.label }}</h6>
				<LazyMarkdownContent :content="section.content" />
			</section>
			<aside
				v-else-if="section.kind !== 'learn'"
				class="assignment-aside"
				:class="[`is-${section.kind}`]"
			>
				<h6>
					{{
						section.kind === "optional" &&
						section.label !== "Optional"
							? `Optional · ${section.label}`
							: section.label
					}}
				</h6>
				<LazyMarkdownContent :content="section.content" />
			</aside>
		</template>
	</div>
</template>

<style scoped>
.assignment-content {
	display: grid;
	gap: 1rem;
}
.assignment-section h6 {
	margin: 0 0 0.6rem;
	font: 600 1rem var(--font-sans);
	color: var(--color-ink);
}
.assignment-section :deep(.item-content-markdown) {
	color: var(--color-ink);
	font-size: 1rem;
	line-height: 1.7;
}
.assignment-aside {
	padding: 0.85rem 1rem;
	border-left: 3px solid var(--color-border-strong);
	background: var(--color-surface-inset);
	border-radius: 0 6px 6px 0;
}
.assignment-aside h6 {
	margin: 0 0 0.45rem;
	font: 600 0.88rem var(--font-sans);
	color: var(--color-ink-soft);
}
.assignment-aside :deep(.item-content-markdown) {
	font-size: 0.92rem;
	line-height: 1.6;
}
.assignment-aside :deep(.item-content-markdown > :last-child),
.assignment-section :deep(.item-content-markdown > :last-child) {
	margin-bottom: 0;
}
.assignment-aside.is-optional {
	border-left-color: var(--color-accent);
}
</style>
