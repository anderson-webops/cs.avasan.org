<script lang="ts" setup>
defineOptions({ name: "ZoomClassroomPage" });

const zoomMeetingUrl = "https://us06web.zoom.us/j/2543520025";
</script>

<template>
	<section class="page-shell page-shell--narrow zoom-page">
		<header class="hero">
			<p class="page-eyebrow">Zoom Room</p>
			<h1 class="page-title">Join the Virtual Classroom</h1>
			<p class="page-copy">Use this page to join the class Zoom room.</p>
		</header>

		<div class="card-grid">
			<article
				aria-labelledby="zoom-card-title"
				class="zoom-card site-surface"
			>
				<h2 id="zoom-card-title">Zoom Meeting Room</h2>
				<p>
					Open the room in a new tab. Join a few minutes early if you
					need to test audio.
				</p>
				<a
					class="site-button site-button--primary"
					:href="zoomMeetingUrl"
					rel="noopener"
					target="_blank"
				>
					Join on Zoom
				</a>
				<p class="fallback">
					Direct link:
					<a :href="zoomMeetingUrl" rel="noopener" target="_blank">
						{{ zoomMeetingUrl }}
					</a>
				</p>
			</article>
		</div>
	</section>
</template>

<style scoped>
.zoom-page {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
}

.hero {
	display: grid;
	gap: 1rem;
}

.card-grid {
	display: grid;
	gap: 2rem;
}

.zoom-card {
	padding: 2rem;
	display: grid;
	gap: 1.25rem;
}

.zoom-card h2 {
	margin: 0;
	font-size: clamp(1.8rem, 3vw, 2.3rem);
	text-align: center;
}

p {
	margin: 0;
	line-height: 1.6;
	color: var(--color-ink-soft);
}

.site-button {
	justify-self: flex-start;
}

.fallback {
	font-size: 0.95rem;
}

.fallback a {
	color: var(--color-accent);
	font-weight: 600;
	text-decoration: none;
}

.fallback a:hover {
	text-decoration: underline;
}

@media (max-width: 768px) {
	.zoom-card {
		padding: 1.5rem;
	}
}

@media (min-width: 768px) {
	.card-grid {
		grid-template-columns: minmax(0, 540px);
		justify-content: center;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
