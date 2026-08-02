<script setup lang="ts">
import MachineWorkshopGame from "@/components/games/MachineWorkshopGame.vue";

defineOptions({ name: "MachineWorkshopPage" });

useHead({
	meta: [{ content: "noindex,nofollow", name: "robots" }],
	title: "Machine Workshop | Classes with Julio"
});
</script>

<template>
	<MachineWorkshopGame />
</template>
