<script setup lang="ts">
import { defineAsyncComponent } from "vue";

const CodeIdeWorkspace = defineAsyncComponent(
	() => import("@/components/CodeIdeWorkspace.vue")
);
</script>

<template>
	<CodeIdeWorkspace />
</template>
