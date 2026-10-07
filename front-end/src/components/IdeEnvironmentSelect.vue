<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const scratch = computed(() => route.query.mode === "scratch");
function choose(event: Event) {
	const query = { ...route.query };
	delete query.starter;
	delete query.template;
	if ((event.target as HTMLSelectElement).value === "scratch")
		query.mode = "scratch";
	else delete query.mode;
	void router.replace({ path: "/ide", query });
}
</script>

<template>
	<select
		aria-label="Editor environment"
		class="ide-environment-select"
		:value="scratch ? 'scratch' : 'code'"
		@change="choose"
	>
		<option value="code">Code</option>
		<option value="scratch">Scratch blocks</option>
	</select>
</template>

<style scoped>
.ide-environment-select {
	font: inherit;
	font-size: 0.9rem;
	padding: 0.3rem 0.5rem;
	border: 1px solid var(--color-border);
	border-radius: 6px;
	color: var(--color-ink);
	background: var(--color-surface);
}
</style>
