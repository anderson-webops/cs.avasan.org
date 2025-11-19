<script lang="ts" setup>
defineOptions({ name: "ZoomClassroomPage" });

const zoomMeetingUrl = "https://us06web.zoom.us/j/2543520025";
</script>

<template>
	<section class="ZoomClassroom">
		<header class="hero">
			<h1>Join the Virtual Classroom</h1>
			<p>
				Sessions take place on Zoom. Use the button below to open the
				live classroom. Bookmark this page so you can always reach the
				meeting quickly.
			</p>
		</header>

		<div class="card-grid">
			<article class="zoom-card" aria-labelledby="zoom-card-title">
				<h2 id="zoom-card-title">Zoom Meeting</h2>
				<p>
					Click the button to launch Zoom in a new tab. Make sure you
					are signed in to Zoom before class time for the smoothest
					experience.
				</p>
				<a
					class="cta"
					:href="zoomMeetingUrl"
					rel="noopener"
					target="_blank"
				>
					Join on Zoom
				</a>
				<p class="fallback">
					Zoom link (copy &amp; paste):
					<a :href="zoomMeetingUrl" rel="noopener" target="_blank">
						{{ zoomMeetingUrl }}
					</a>
				</p>
			</article>
		</div>
	</section>
</template>

<style scoped>
.ZoomClassroom {
	padding: 2.5rem 1.5rem 4rem;
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	color: #16202a;
	align-items: center;
}

.hero {
	max-width: 720px;
	text-align: center;
	display: grid;
	gap: 1.25rem;
}

.hero h1 {
	font-size: clamp(2rem, 4vw, 2.75rem);
	margin: 0;
}

.hero p {
	margin: 0;
	font-size: 1.05rem;
	line-height: 1.6;
	color: #2d3f55;
}

.card-grid {
	display: grid;
	gap: 2rem;
	width: 100%;
	max-width: 960px;
}

.zoom-card {
	background: white;
	border-radius: 28px;
	padding: 2rem;
	box-shadow: 0 18px 40px rgba(16, 42, 66, 0.08);
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
}

.cta {
	justify-self: center;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.5rem;
	border-radius: 999px;
	font-weight: 600;
	text-decoration: none;
	background-color: #3a6ea5;
	color: white;
	transition:
		background-color 0.2s ease,
		transform 0.2s ease;
}

.cta:hover {
	background-color: #2d5c8a;
	transform: translateY(-2px);
}

.fallback {
	font-size: 0.95rem;
	color: #2d3f55;
}

.fallback a {
	color: #3a6ea5;
	font-weight: 600;
	text-decoration: none;
}

.fallback a:hover {
	text-decoration: underline;
}

@media (max-width: 768px) {
	.ZoomClassroom {
		padding: 2rem 1.25rem 3rem;
	}

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

<route lang="json">
{
	"meta": {
		"layout": "default"
	}
}
</route>
