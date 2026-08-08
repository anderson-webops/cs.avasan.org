<script setup lang="ts">
import TRexRunnerGame from "@/components/games/TRexRunnerGame.vue";

defineOptions({ name: "TRexRunnerPage" });

useHead({
	meta: [{ content: "noindex,nofollow", name: "robots" }],
	title: "T-Rex Runner | Classes with Julio"
});
</script>

<template>
	<TRexRunnerGame />
</template>
