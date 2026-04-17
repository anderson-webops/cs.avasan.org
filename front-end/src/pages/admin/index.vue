<script setup lang="ts">
import AdminWorkspaceShell from "@/components/AdminWorkspaceShell.vue";

const adminTools = [
	{
		title: "Learner Management",
		description:
			"Review the shared student management spreadsheet and current roster workflows.",
		href: "/admin/student-management"
	},
	{
		title: "Markdown Mail",
		description:
			"Send session notes and internal admin messages with markdown formatting.",
		href: "/admin/mdmail"
	}
];
</script>

<template>
	<AdminWorkspaceShell
		intro="Move between the main operator workflows without losing context. The shell and navigation stay consistent across admin pages so the workspace feels like one place instead of separate tools."
		title="Admin Workspace"
	>
		<nav class="tool-grid" aria-label="Admin tools">
			<RouterLink
				v-for="tool in adminTools"
				:key="tool.href"
				:to="tool.href"
				class="tool-card"
			>
				<p class="tool-label">Workspace</p>
				<h2>{{ tool.title }}</h2>
				<p>{{ tool.description }}</p>
			</RouterLink>
		</nav>
	</AdminWorkspaceShell>
</template>

<style scoped>
.tool-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: 1rem;
}

.tool-card {
	display: grid;
	gap: 0.75rem;
	padding: 1.35rem;
	border-radius: 22px;
	border: 1px solid #d9e2ec;
	background: #fff;
	box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
	color: inherit;
	text-decoration: none;
	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease,
		border-color 0.18s ease;
}

.tool-card:hover {
	transform: translateY(-2px);
	border-color: #93c5fd;
	box-shadow: 0 20px 38px rgba(30, 41, 59, 0.12);
}

.tool-label {
	margin: 0;
	font-size: 0.75rem;
	font-weight: 800;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #2563eb;
}

.tool-card h2 {
	margin: 0;
	font-size: 1.3rem;
}

.tool-card p {
	margin: 0;
	color: #53697f;
	line-height: 1.6;
}
</style>

<route lang="yaml">
  meta:
    layout: default
    requiresAdmin: true</route>
