<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { warmSchedulerConnections } from "@/modules/scheduler";
import { useAppStore } from "@/stores/app";

const emit = defineEmits<{
	(e: "loginClick"): void;
	(e: "signupClick"): void;
}>();

const app = useAppStore();
const route = useRoute();
const { currentAdmin, currentTutor, currentUser, isLoggedIn, isAdmin } =
	storeToRefs(app);

interface NavLink {
	label: string;
	to: string;
	exact?: boolean;
	warmScheduler?: boolean;
}

const primaryLinks = computed<NavLink[]>(() => {
	const links: NavLink[] = [
		{ label: "Home", to: "/", exact: true },
		{ label: "Courses", to: "/courses", exact: true }
	];

	if (!isAdmin.value) {
		links.push({
			label: "Book a Class",
			to: "/signup",
			exact: true,
			warmScheduler: true
		});
	}

	links.push({ label: "About", to: "/about", exact: true });

	return links;
});

const utilityLinks = computed<NavLink[]>(() => {
	if (isAdmin.value) return [];
	if (isLoggedIn.value) {
		return [
			{ label: "Zoom", to: "/zoom", exact: true },
			{ label: "Tuition", to: "/payment", exact: true }
		];
	}
	return [{ label: "Tuition", to: "/payment", exact: true }];
});

const workspaceLinks = computed<NavLink[]>(() => {
	const links: NavLink[] = [];

	if (isAdmin.value) {
		links.push({ label: "Admin", to: "/admin", exact: false });
	}

	if (isLoggedIn.value) {
		links.push({ label: "Profile", to: "/profile", exact: false });
	}

	return links;
});

const accountBadge = computed(() => {
	if (currentAdmin.value) return "Administrator";
	if (currentTutor.value) return "Tutor";
	if (currentUser.value) return "Student";
	return null;
});

function logoutUser() {
	app.logout();
}

function isLinkActive(link: NavLink) {
	if (link.exact === false) {
		return route.path === link.to || route.path.startsWith(`${link.to}/`);
	}

	return route.path === link.to;
}

function maybeWarmScheduler(link: NavLink) {
	if (link.warmScheduler) warmSchedulerConnections();
}
</script>

<template>
	<header class="site-header">
		<nav class="navbar navbar-expand-xl site-nav">
			<div class="container-fluid site-nav__inner">
				<router-link class="site-brand" to="/">
					<span class="site-brand__title">Classes with Jacob</span>
					<span class="site-brand__tagline">
						Project-driven tutoring in coding, STEM, and Spanish
					</span>
				</router-link>
				<button
					aria-controls="siteNavbar"
					aria-expanded="false"
					aria-label="Toggle navigation"
					class="navbar-toggler site-toggler"
					data-bs-target="#siteNavbar"
					data-bs-toggle="collapse"
					type="button"
				>
					<span class="navbar-toggler-icon" />
				</button>
				<div id="siteNavbar" class="collapse navbar-collapse">
					<div class="site-nav__content">
						<ul class="site-nav__links">
							<li v-for="link in primaryLinks" :key="link.to">
								<router-link
									class="site-nav__link"
									:class="{ 'is-active': isLinkActive(link) }"
									:to="link.to"
									@focus="maybeWarmScheduler(link)"
									@mouseenter="maybeWarmScheduler(link)"
									@touchstart.passive="
										maybeWarmScheduler(link)
									"
								>
									{{ link.label }}
								</router-link>
							</li>
						</ul>

						<div class="site-nav__aside">
							<div
								v-if="utilityLinks.length"
								class="site-nav__utility"
							>
								<router-link
									v-for="link in utilityLinks"
									:key="link.to"
									class="site-nav__utility-link"
									:class="{ 'is-active': isLinkActive(link) }"
									:to="link.to"
								>
									{{ link.label }}
								</router-link>
							</div>

							<div class="site-nav__actions">
								<span
									v-if="accountBadge"
									class="site-nav__badge"
								>
									{{ accountBadge }}
								</span>

								<router-link
									v-for="link in workspaceLinks"
									:key="link.to"
									class="site-nav__action site-nav__action--secondary"
									:class="{ 'is-active': isLinkActive(link) }"
									:to="link.to"
								>
									{{ link.label }}
								</router-link>

								<button
									v-if="isLoggedIn"
									class="site-nav__action site-nav__action--danger"
									type="button"
									@click="logoutUser"
								>
									Log out
								</button>
								<button
									v-else
									class="site-nav__action site-nav__action--secondary"
									type="button"
									@click="emit('loginClick')"
								>
									Log in
								</button>
								<button
									v-if="!isLoggedIn"
									class="site-nav__action site-nav__action--primary"
									type="button"
									@click="emit('signupClick')"
								>
									Sign up
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	</header>
</template>

<style scoped>
.site-header {
	position: sticky;
	top: 0;
	z-index: 1030;
	width: 100%;
	background: rgba(248, 250, 252, 0.88);
	border-bottom: 1px solid rgba(148, 163, 184, 0.2);
	box-shadow: 0 10px 28px -24px rgba(15, 23, 42, 0.35);
	backdrop-filter: blur(16px);
}

.site-nav {
	padding: 0;
}

.site-nav__inner {
	max-width: 1280px;
	margin: 0 auto;
	padding: 0.85rem 1rem;
}

.site-brand {
	display: grid;
	gap: 0.18rem;
	text-decoration: none;
}

.site-brand__title {
	font-size: 1.2rem;
	font-weight: 800;
	letter-spacing: 0.01em;
	color: #10253c;
}

.site-brand__tagline {
	font-size: 0.82rem;
	color: #587089;
}

.site-toggler {
	border: 1px solid #cbd5e1;
	border-radius: 14px;
}

.site-nav__content {
	display: flex;
	align-items: center;
	gap: 1.25rem;
	width: 100%;
	margin-top: 0.8rem;
}

.site-nav__links,
.site-nav__utility {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.55rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.site-nav__links {
	flex: 1 1 auto;
}

.site-nav__aside {
	display: flex;
	flex: 0 0 auto;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.85rem;
	margin-left: auto;
}

.site-nav__link,
.site-nav__utility-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.72rem 0.95rem;
	border-radius: 999px;
	color: #27425a;
	font-weight: 700;
	text-decoration: none;
	transition:
		background-color 0.18s ease,
		color 0.18s ease,
		transform 0.18s ease,
		box-shadow 0.18s ease;
}

.site-nav__link:hover,
.site-nav__utility-link:hover,
.site-nav__link.is-active,
.site-nav__utility-link.is-active {
	color: #0f2f4e;
	background: rgba(191, 219, 254, 0.44);
	box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.2);
	transform: translateY(-1px);
}

.site-nav__utility-link {
	padding: 0.55rem 0.8rem;
	font-size: 0.9rem;
	color: #50677c;
}

.site-nav__actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.65rem;
}

.site-nav__badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.52rem 0.8rem;
	border-radius: 999px;
	background: #e2e8f0;
	color: #334155;
	font-size: 0.82rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

.site-nav__action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.72rem 1rem;
	border-radius: 999px;
	border: 1px solid transparent;
	font-weight: 700;
	text-decoration: none;
	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease,
		background-color 0.18s ease,
		border-color 0.18s ease;
}

.site-nav__action:hover,
.site-nav__action.is-active {
	transform: translateY(-1px);
}

.site-nav__action--primary {
	color: #eff6ff;
	background: linear-gradient(140deg, #2563eb, #1d4ed8);
	box-shadow: 0 12px 24px rgba(37, 99, 235, 0.24);
}

.site-nav__action--secondary {
	color: #16324d;
	background: #ffffff;
	border-color: #cbd5e1;
	box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.site-nav__action--secondary.is-active {
	background: #e0f2fe;
	border-color: #7dd3fc;
}

.site-nav__action--danger {
	color: #991b1b;
	background: #fff5f5;
	border-color: #fecaca;
}

@media (max-width: 1199px) {
	.site-nav__content {
		flex-direction: column;
		align-items: stretch;
	}

	.site-nav__aside {
		margin-left: 0;
		justify-content: flex-start;
	}

	.site-nav__actions {
		justify-content: flex-start;
	}
}

@media (min-width: 1200px) {
	.site-nav__content {
		margin-top: 0;
	}
}

@media (max-width: 700px) {
	.site-brand__tagline {
		display: none;
	}

	.site-nav__link,
	.site-nav__utility-link,
	.site-nav__action {
		width: 100%;
	}

	.site-nav__utility,
	.site-nav__actions {
		width: 100%;
	}
}
</style>
