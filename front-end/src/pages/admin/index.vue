<script setup lang="ts">
const adminTools = [
	{
		title: "Student Management",
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
	<section class="wrap">
		<p class="eyebrow">Admin</p>
		<h1>Admin Workspace</h1>
		<p class="intro">Choose an admin tool below.</p>

		<nav class="tool-grid" aria-label="Admin tools">
			<a
				v-for="tool in adminTools"
				:key="tool.href"
				:href="tool.href"
				class="tool-card"
			>
				<h2>{{ tool.title }}</h2>
				<p>{{ tool.description }}</p>
			</a>
		</nav>
	</section>
</template>

<style scoped>
.wrap {
	max-width: 960px;
	margin: 32px auto;
	padding: 20px;
	display: grid;
	gap: 16px;
}

.eyebrow {
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 0.16em;
	font-size: 0.8rem;
	font-weight: 700;
	color: #4e6780;
}

.wrap h1,
.wrap p {
	margin: 0;
}

.intro {
	color: #4f667c;
	line-height: 1.6;
}

.tool-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
	gap: 16px;
	margin-top: 8px;
}

.tool-card {
	display: grid;
	gap: 10px;
	padding: 20px;
	border-radius: 16px;
	border: 1px solid #d4dde7;
	background: #fff;
	box-shadow: 0 8px 24px rgba(16, 42, 66, 0.08);
	color: inherit;
	text-decoration: none;
	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease,
		border-color 0.18s ease;
}

.tool-card:hover {
	transform: translateY(-2px);
	border-color: #9fb7cf;
	box-shadow: 0 12px 28px rgba(16, 42, 66, 0.12);
}

.tool-card h2 {
	margin: 0;
	font-size: 1.2rem;
}

.tool-card p {
	color: #53697f;
	line-height: 1.6;
}
</style>

<route lang="json">
{
	"meta": {
		"layout": false,
		"requiresAdmin": true
	}
}
</route>
