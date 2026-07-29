<script setup lang="ts">
import { defineAsyncComponent } from "vue";

defineOptions({ name: "GraphSketcherPage" });

const GraphSketcherWorkspace = defineAsyncComponent(
	() => import("@/components/GraphSketcherWorkspace.vue")
);
</script>

<template>
	<GraphSketcherWorkspace />
</template>
