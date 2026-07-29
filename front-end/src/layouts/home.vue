<script lang="ts" setup>
import AccountManagement from "~/components/AccountManagement.vue";
import TheHeader from "~/components/TheHeader.vue";
import { useAppStore } from "../stores/app";

const app = useAppStore();

function showLoginModal() {
	app.setLoginBlock(true);
}
</script>

<template>
	<div class="site-frame">
		<a class="skip-link" href="#main-content">Skip to content</a>
		<TheHeader @login-click="showLoginModal" />

		<AccountManagement />

		<main id="main-content" class="site-main">
			<RouterView />
		</main>
		<TheFooter />
	</div>
</template>
