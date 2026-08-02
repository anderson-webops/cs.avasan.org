<script lang="ts" setup>
import PondPaddlersGame from "@/components/PondPaddlersGame.vue";

defineOptions({ name: "PondPaddlersPage" });

const siteUrl = import.meta.env.VITE_SITE_URL || "https://cs.avasan.org";

useHead({
	link: [{ href: `${siteUrl}/games/pond-paddlers`, rel: "canonical" }],
	meta: [
		{
			content:
				"A friendly classroom arithmetic race where every correct answer helps a paddler cross the pond.",
			name: "description"
		},
		{
			content: "noindex,nofollow",
			name: "robots"
		}
	],
	title: "Pond Paddlers | Classes with Julio"
});
</script>

<template>
	<PondPaddlersGame />
</template>
