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
	<main>
		<TheHeader
			@login-click="showLoginModal"
			@signup-click="showSignupModal"
		/>

		<!----------------------------
		-   Login and Signup Forms   -
		----------------------------->

		<AccountManagement />

		<RouterView />
		<TheFooter />
	</main>
</template>
