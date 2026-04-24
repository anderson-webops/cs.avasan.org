<script lang="ts" setup>
import { computed, useSlots } from "vue";
import { useRoute } from "vue-router";

interface WorkspaceAction {
	href: string;
	label: string;
	external?: boolean;
}

defineOptions({ name: "AdminWorkspaceShell" });

withDefaults(
	defineProps<{
		eyebrow?: string;
		title: string;
		intro: string;
		action?: WorkspaceAction | null;
	}>(),
	{
		eyebrow: "Admin workspace",
		action: null
	}
);

const route = useRoute();

const navItems = [
	{ label: "Overview", to: "/admin" },
	{ label: "Learner management", to: "/admin/student-management" },
	{ label: "Session notes", to: "/admin/mdmail" }
];

const hasActionSlot = computed(() => !!useSlots().actions);

function isActive(path: string) {
	const currentPath = route?.path ?? "";
	if (path === "/admin") return currentPath === "/admin";
	return currentPath === path || currentPath.startsWith(`${path}/`);
}
</script>

<template>
	<section class="admin-shell">
		<div class="admin-shell__frame">
			<header class="admin-shell__hero">
				<div class="admin-shell__copy">
					<p class="admin-shell__eyebrow">{{ eyebrow }}</p>
					<h1>{{ title }}</h1>
					<p>{{ intro }}</p>
				</div>

				<div
					v-if="action || hasActionSlot"
					class="admin-shell__actions"
				>
					<slot name="actions">
						<a
							v-if="action?.external"
							:href="action.href"
							class="admin-shell__action"
							rel="noreferrer"
							target="_blank"
						>
							{{ action.label }}
						</a>
						<RouterLink
							v-else-if="action"
							:to="action.href"
							class="admin-shell__action"
						>
							{{ action.label }}
						</RouterLink>
					</slot>
				</div>
			</header>

			<nav class="admin-shell__nav" aria-label="Admin sections">
				<RouterLink
					v-for="item in navItems"
					:key="item.to"
					class="admin-shell__nav-link"
					:class="{ 'is-active': isActive(item.to) }"
					:to="item.to"
				>
					{{ item.label }}
				</RouterLink>
			</nav>

			<div class="admin-shell__body">
				<slot />
			</div>
		</div>
	</section>
</template>

<style scoped>
.admin-shell {
	margin: 0;
	padding: clamp(2.5rem, 5vw, 4.5rem) 1.25rem 4.5rem;
	background:
		radial-gradient(
			circle at 5% 0%,
			rgba(125, 211, 252, 0.28),
			transparent 38%
		),
		radial-gradient(
			circle at 100% 10%,
			rgba(96, 165, 250, 0.2),
			transparent 30%
		),
		linear-gradient(160deg, #08111f 0%, #10213a 48%, #173456 100%);
}

.admin-shell__frame {
	max-width: 1180px;
	margin: 0 auto;
	display: grid;
	gap: 1rem;
}

.admin-shell__hero {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 1rem 1.5rem;
	align-items: end;
	padding: clamp(1.35rem, 3vw, 2rem);
	border: 1px solid rgba(191, 219, 254, 0.18);
	border-radius: 28px;
	background:
		linear-gradient(
			140deg,
			rgba(15, 23, 42, 0.94),
			rgba(30, 64, 175, 0.88)
		),
		radial-gradient(
			circle at top right,
			rgba(125, 211, 252, 0.24),
			transparent 35%
		);
	box-shadow: 0 28px 60px rgba(8, 15, 28, 0.32);
}

.admin-shell__copy {
	display: grid;
	gap: 0.7rem;
	color: #e2e8f0;
}

.admin-shell__eyebrow {
	margin: 0;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: #93c5fd;
}

.admin-shell__copy h1 {
	margin: 0;
	font-size: clamp(2rem, 4vw, 3rem);
	line-height: 1.02;
	color: #f8fbff;
}

.admin-shell__copy p:last-child {
	margin: 0;
	max-width: 56rem;
	line-height: 1.65;
	color: #c7d6e8;
}

.admin-shell__actions {
	display: flex;
	justify-content: flex-end;
}

.admin-shell__action {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.15rem;
	border-radius: 999px;
	border: 1px solid rgba(147, 197, 253, 0.42);
	background: rgba(241, 245, 249, 0.08);
	color: #eff6ff;
	font-weight: 700;
	text-decoration: none;
	transition:
		transform 0.18s ease,
		background-color 0.18s ease,
		border-color 0.18s ease;
}

.admin-shell__action:hover {
	transform: translateY(-1px);
	background: rgba(239, 246, 255, 0.14);
	border-color: rgba(191, 219, 254, 0.75);
}

.admin-shell__nav {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	padding: 0.2rem 0;
}

.admin-shell__nav-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem 1rem;
	border-radius: 999px;
	border: 1px solid rgba(191, 219, 254, 0.18);
	background: rgba(255, 255, 255, 0.08);
	color: #d6e3f1;
	font-weight: 700;
	text-decoration: none;
	transition:
		transform 0.18s ease,
		background-color 0.18s ease,
		border-color 0.18s ease,
		color 0.18s ease;
}

.admin-shell__nav-link:hover,
.admin-shell__nav-link.is-active {
	transform: translateY(-1px);
	background: #eff6ff;
	border-color: rgba(191, 219, 254, 0.95);
	color: #16375b;
}

.admin-shell__body {
	padding: clamp(1.15rem, 3vw, 1.75rem);
	border-radius: 28px;
	background: rgba(255, 255, 255, 0.96);
	border: 1px solid rgba(203, 213, 225, 0.7);
	box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
	backdrop-filter: blur(18px);
}

@media (max-width: 900px) {
	.admin-shell__hero {
		grid-template-columns: 1fr;
	}

	.admin-shell__actions {
		justify-content: flex-start;
	}
}

@media (max-width: 640px) {
	.admin-shell {
		padding-inline: 0.95rem;
	}

	.admin-shell__body {
		padding: 1rem;
		border-radius: 22px;
	}

	.admin-shell__nav {
		gap: 0.55rem;
	}

	.admin-shell__nav-link,
	.admin-shell__action {
		width: 100%;
	}
}
</style>
