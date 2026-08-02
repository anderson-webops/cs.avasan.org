<script setup lang="ts">
import CometHopperGame from "@/components/games/CometHopperGame.vue";

defineOptions({ name: "CometHopperPage" });

useHead({
	meta: [{ content: "noindex,nofollow", name: "robots" }],
	title: "Comet Hopper | Classes with Julio"
});
</script>

<template>
	<CometHopperGame />
</template>
