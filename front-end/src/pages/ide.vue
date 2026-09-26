<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const CodeIdeWorkspace = defineAsyncComponent(
	() => import("@/components/CodeIdeWorkspace.vue")
);
const ScratchIdeWorkspace = defineAsyncComponent(
	() => import("@/components/ScratchIdeWorkspace.vue")
);
const route = useRoute();
const router = useRouter();
const scratch = computed(() => route.query.mode === "scratch");
const scratchVisited = ref(scratch.value);
const codeVisited = ref(!scratch.value);
const codeWorkspace = ref<{ stop: () => void }>();
const scratchWorkspace = ref<{ stop: () => void }>();
watch(scratch, value => {
	if (value) {
		scratchVisited.value = true;
		codeWorkspace.value?.stop();
	} else {
		codeVisited.value = true;
		scratchWorkspace.value?.stop();
	}
});
function choose(event: Event) {
	const selected = (event.target as HTMLSelectElement).value;
	const query = { ...route.query };
	delete query.starter;
	delete query.template;
	if (selected === "scratch") query.mode = "scratch";
	else delete query.mode;
	void router.replace({ path: "/ide", query });
}
</script>

<template>
	<div class="integrated-ide">
		<label class="ide-environment"
			>Editor
			<select :value="scratch ? 'scratch' : 'code'" @change="choose">
				<option value="code">Python or Java</option>
				<option value="scratch">Scratch blocks</option>
			</select>
		</label>
		<CodeIdeWorkspace
			v-if="codeVisited"
			v-show="!scratch"
			ref="codeWorkspace"
		/>
		<ScratchIdeWorkspace
			v-if="scratchVisited"
			v-show="scratch"
			ref="scratchWorkspace"
		/>
	</div>
</template>

<style scoped>
.integrated-ide {
	width: 100%;
	min-width: 0;
}
.ide-environment {
	display: flex;
	align-items: center;
	gap: 0.7rem;
	margin: 0.5rem 1rem;
	font: inherit;
	color: var(--color-ink);
	text-transform: none;
	letter-spacing: normal;
}
.ide-environment select {
	font: inherit;
	padding: 0.4rem 0.7rem;
	border-radius: 0.5rem;
}
</style>
