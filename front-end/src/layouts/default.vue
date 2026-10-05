<script lang="ts" setup>
import { useRoute } from "vue-router";
import TheFooter from "~/components/TheFooter.vue";
import TheHeader from "~/components/TheHeader.vue";

const route = useRoute();
</script>

<template>
	<div
		class="site-frame"
		:class="{ 'site-frame--content': route.path !== '/' }"
	>
		<a class="skip-link" href="#main-content">Skip to content</a>

		<TheHeader />

		<main id="main-content" class="site-main">
			<RouterView />
		</main>

		<TheFooter />
	</div>
</template>
