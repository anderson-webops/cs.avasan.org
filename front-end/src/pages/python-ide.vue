<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const PythonIdeWorkspace = defineAsyncComponent(
	() => import("@/components/PythonIdeWorkspace.vue")
);
</script>

<template>
	<PythonIdeWorkspace />
</template>
