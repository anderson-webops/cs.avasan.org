<script setup lang="ts">
import CrosswalkCrittersGame from "@/components/games/CrosswalkCrittersGame.vue";

defineOptions({ name: "CrosswalkCrittersPage" });

useHead({
	meta: [{ content: "noindex,nofollow", name: "robots" }],
	title: "Crosswalk Critters | Classes with Julio"
});
</script>

<template>
	<CrosswalkCrittersGame />
</template>
