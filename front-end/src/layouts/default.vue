<script lang="ts" setup>
import TheFooter from "~/components/TheFooter.vue";
import TheHeader from "~/components/TheHeader.vue";
</script>

<template>
	<div class="site-frame">
		<a class="skip-link" href="#main-content">Skip to content</a>

		<TheHeader />

		<main id="main-content" class="site-main">
			<RouterView />
		</main>

		<TheFooter />
	</div>
</template>
