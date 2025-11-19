<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";

const emit = defineEmits<{
	(e: "loginClick"): void;
	(e: "signupClick"): void;
}>();

const app = useAppStore();
const { isLoggedIn, isAdmin } = storeToRefs(app);

function logoutUser() {
	app.logout();
}
</script>

<template>
	<header>
		<nav class="navbar navbar-expand-lg navbar-light" style="background-color: #e3f2fd">
			<div class="container-fluid">
				<router-link aria-current="page" class="nav-item navbar-brand nav-link" to="/">
					Classes with Jacob
				</router-link>
				<button
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
					class="navbar-toggler"
					data-bs-target="#navbarSupportedContent"
					data-bs-toggle="collapse"
					type="button"
				>
					<span class="navbar-toggler-icon" />
				</button>
				<div id="navbarSupportedContent" class="collapse navbar-collapse px-3">
					<ul class="nav navbar-nav mb-lg-0 mb-2 me-auto gap-2">
						<li class="nav-item">
							<router-link class="nav-link" to="/"> Home </router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/signup"> Book a Class </router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/payment"> Tuition &amp; Payment </router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/zoom"> Zoom </router-link>
						</li>
						<li class="nav-item">
							<router-link class="nav-link" to="/about"> About </router-link>
						</li>
						<li v-if="isLoggedIn" class="nav-item">
							<router-link class="nav-link" to="/profile"> Profile </router-link>
						</li>
						<template v-if="isAdmin">
							<li class="nav-item">
								<router-link class="nav-link" to="/admin/student-management">
									Student Management
								</router-link>
							</li>
							<li class="nav-item">
								<router-link class="nav-link" to="/admin/mdmail"> Session Notes </router-link>
							</li>
						</template>
					</ul>
					<!-- Logout Button -->
					<button v-if="isLoggedIn" class="btn-outline-danger btn" @click="logoutUser">Logout</button>
					<!-- Login button -->
					<button v-else class="btn-outline-success btn" @click="emit('loginClick')">Login</button>
					<!-- Signup button -->
					<button v-if="!isLoggedIn" class="btn-outline-primary btn" @click="emit('signupClick')">
						Signup
					</button>
				</div>
			</div>
		</nav>
	</header>
</template>

<style scoped>
/* temporary no-op to avoid plugin crash */
:root {
}
</style>
