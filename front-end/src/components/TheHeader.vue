<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import StudentAccess from "@/components/StudentAccess.vue";
import { studentAccountsAreEnabled } from "@/modules/classroomFeatures";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const route = useRoute();
const { currentAdmin } = storeToRefs(app);

const primaryLinks = [
	{ label: "Courses", to: "/" },
	{ label: "IDE", to: "/ide" },
	{ label: "Games", to: "/games" }
];

function isLinkActive(to: string) {
	return to === "/" ? route.path === "/" : route.path.startsWith(to);
}

async function logout() {
	await app.logout();
}
</script>

<template>
	<header class="site-header">
		<div class="site-shell site-shell--wide">
			<nav
				class="navbar navbar-expand-lg site-nav"
				aria-label="Main navigation"
			>
				<div class="site-nav__inner site-surface site-surface--strong">
					<RouterLink
						class="site-brand"
						to="/"
						aria-label="Classes with Julio courses"
					>
						<span class="site-brand__mark" aria-hidden="true">
							&lt;/&gt;
						</span>
						<span class="site-brand__title"
							>Classes with Julio</span
						>
					</RouterLink>

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
									<RouterLink
										class="site-nav__link"
										:class="{
											'is-active': isLinkActive(link.to)
										}"
										:to="link.to"
									>
										{{ link.label }}
									</RouterLink>
								</li>
							</ul>

							<div v-if="currentAdmin" class="site-nav__actions">
								<RouterLink
									class="site-button site-button--secondary site-nav__action"
									:class="{
										'is-active': isLinkActive('/admin')
									}"
									to="/admin"
								>
									Admin
								</RouterLink>
								<button
									class="site-button site-button--secondary site-nav__action site-nav__action--danger"
									type="button"
									@click="logout"
								>
									Log out
								</button>
							</div>
							<StudentAccess
								v-if="studentAccountsAreEnabled()"
								v-show="!currentAdmin"
							/>
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
	z-index: 10;
	padding-top: 0.9rem;
}

.site-nav {
	width: 100%;
	padding: 0;
}

.site-nav__inner {
	display: flex;
	width: 100%;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.85rem 1.25rem;
	padding: 0.85rem 1rem;
}

.site-brand {
	display: inline-flex;
	flex: 0 0 auto;
	align-items: center;
	gap: 0.75rem;
	color: var(--color-ink);
	text-decoration: none;
}

.site-brand__mark {
	display: grid;
	width: 2.75rem;
	height: 2.75rem;
	place-items: center;
	border-radius: 14px;
	background: linear-gradient(145deg, #0f766e, #2563eb);
	box-shadow: 0 12px 24px -18px rgba(15, 118, 110, 0.72);
	color: white;
	font-family: var(--font-sans);
	font-size: 0.86rem;
	font-weight: 900;
	letter-spacing: -0.08em;
}

.site-brand__title {
	font-family: var(--font-display);
	font-size: clamp(1.2rem, 2vw, 1.45rem);
	font-weight: 700;
	line-height: 1.1;
	letter-spacing: -0.025em;
}

.site-toggler {
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	background: rgba(255, 255, 255, 0.74);
}

.site-nav__panel {
	flex: 1 1 auto;
	min-width: 0;
}

.site-nav__content {
	display: flex;
	width: 100%;
	min-width: 0;
	align-items: center;
	justify-content: flex-end;
	gap: clamp(1rem, 2vw, 2.25rem);
}

.site-nav__links {
	display: flex;
	flex: 1 1 auto;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	gap: 0.45rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.site-nav__link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.55rem 0.72rem;
	border-radius: var(--radius-sm);
	color: var(--color-ink-soft);
	font-weight: 700;
	text-decoration: none;
	transition:
		background-color 0.18s ease,
		color 0.18s ease,
		box-shadow 0.18s ease;
}

.site-nav__link:hover,
.site-nav__link.is-active {
	background: rgba(255, 255, 255, 0.7);
	box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
	color: var(--color-ink);
}

.site-nav__actions {
	display: flex;
	flex: 0 0 auto;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.55rem;
}

.site-nav__action {
	min-height: 2.75rem;
	padding-inline: 0.9rem;
}

.site-nav__action--danger {
	color: #9f1239;
}

@media (max-width: 991px) {
	.site-nav__panel {
		flex-basis: 100%;
	}

	.site-nav__content,
	.site-nav__links,
	.site-nav__actions {
		width: 100%;
		flex-direction: column;
		align-items: stretch;
	}

	.site-nav__content {
		padding-top: 0.9rem;
	}

	.site-nav__link,
	.site-nav__action {
		width: 100%;
	}
}
</style>
