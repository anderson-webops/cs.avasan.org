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
		<div class="site-shell site-shell--wide">
			<nav class="navbar navbar-expand-xl site-nav">
				<div class="site-nav__inner site-surface site-surface--strong">
					<router-link class="site-brand" to="/">
						<span class="site-brand__title"
							>Classes with Jacob</span
						>
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
					<div
						id="siteNavbar"
						class="collapse navbar-collapse site-nav__panel"
					>
						<div class="site-nav__content">
							<ul class="site-nav__links">
								<li v-for="link in primaryLinks" :key="link.to">
									<router-link
										class="site-nav__link"
										:class="{
											'is-active': isLinkActive(link)
										}"
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
										:class="{
											'is-active': isLinkActive(link)
										}"
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
										class="site-button site-button--secondary site-nav__action"
										:class="{
											'is-active': isLinkActive(link)
										}"
										:to="link.to"
									>
										{{ link.label }}
									</router-link>

									<button
										v-if="isLoggedIn"
										class="site-button site-button--secondary site-nav__action site-nav__action--danger"
										type="button"
										@click="logoutUser"
									>
										Log out
									</button>
									<button
										v-else
										class="site-button site-button--secondary site-nav__action"
										type="button"
										@click="emit('loginClick')"
									>
										Log in
									</button>
									<button
										v-if="!isLoggedIn"
										class="site-button site-button--primary site-nav__action"
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
		</div>
	</header>
</template>

<style scoped>
.site-header {
	position: relative;
	z-index: 1;
	padding-top: 0.9rem;
}

.site-nav {
	padding: 0;
}

.site-nav__panel {
	flex: 1 1 auto;
	min-width: 0;
}

.site-nav__inner {
	padding: 0.9rem 1rem;
}

.site-brand {
	display: inline-flex;
	align-items: center;
	flex: 0 0 auto;
	text-decoration: none;
}

.site-brand__title {
	font-family: var(--font-display);
	font-size: clamp(1.35rem, 2vw, 1.55rem);
	font-weight: 600;
	letter-spacing: -0.02em;
	color: var(--color-ink);
}

.site-toggler {
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	background: rgba(255, 255, 255, 0.74);
}

.site-nav__content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: clamp(1rem, 2vw, 2.25rem);
	width: 100%;
	min-width: 0;
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
	justify-content: center;
	min-width: 0;
}

.site-nav__aside {
	display: flex;
	flex: 0 0 auto;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.85rem;
	margin-left: auto;
	min-width: 0;
}

.site-nav__link,
.site-nav__utility-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.55rem 0.75rem;
	border-radius: var(--radius-sm);
	color: var(--color-ink-soft);
	font-weight: 600;
	text-decoration: none;
	transition:
		background-color 0.18s ease,
		color 0.18s ease,
		box-shadow 0.18s ease;
}

.site-nav__link:hover,
.site-nav__utility-link:hover,
.site-nav__link.is-active,
.site-nav__utility-link.is-active {
	color: var(--color-ink);
	background: rgba(255, 255, 255, 0.64);
	box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
}

.site-nav__utility-link {
	padding-inline: 0.45rem;
	font-size: 0.95rem;
}

.site-nav__actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.65rem;
	flex-shrink: 0;
}

.site-nav__badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.45rem 0.7rem;
	border-radius: var(--radius-pill);
	background: rgba(31, 92, 145, 0.08);
	color: var(--color-accent);
	font-size: 0.78rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

.site-nav__action {
	min-height: 2.9rem;
	padding-inline: 1rem;
}

.site-nav__action.is-active {
	background: rgba(255, 255, 255, 0.92);
	border-color: rgba(31, 92, 145, 0.24);
}

.site-nav__action--danger {
	color: #8c1d26;
	background: rgba(255, 245, 245, 0.96);
	border-color: rgba(244, 114, 114, 0.35);
	box-shadow: none;
}

@media (max-width: 1199px) {
	.site-nav__content {
		flex-direction: column;
		align-items: stretch;
		margin-top: 0.9rem;
	}

	.site-nav__aside {
		flex: 0 0 auto;
		justify-content: flex-start;
	}

	.site-nav__actions {
		justify-content: flex-start;
	}
}

@media (max-width: 700px) {
	.site-nav__links {
		width: 100%;
	}

	.site-nav__links > li {
		width: 100%;
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
