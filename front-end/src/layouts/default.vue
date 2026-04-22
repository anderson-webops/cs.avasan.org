<script lang="ts" setup>
import AccountManagement from "~/components/AccountManagement.vue";
import TheHeader from "~/components/TheHeader.vue";
import { useAppStore } from "../stores/app";

const app = useAppStore();

function showLoginModal() {
	app.setLoginBlock(true);
}

function showSignupModal() {
	app.setSignupBlock(true);
}
</script>

<template>
	<div class="site-frame">
		<a class="skip-link" href="#main-content">Skip to content</a>

		<TheHeader
			@login-click="showLoginModal"
			@signup-click="showSignupModal"
		/>

		<!----------------------------
		-   Login and Signup Forms   -
		----------------------------->

		<AccountManagement />

		<main id="main-content" class="site-main">
			<RouterView />
		</main>
		<TheFooter />
	</div>
</template>
