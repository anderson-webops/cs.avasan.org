<script lang="ts" setup>
const router = useRouter();

useHead({
	title: "Page not found | Classes with Jacob"
});

function goBack() {
	if (window.history.length > 1) router.back();
	else router.push("/");
}
</script>

<template>
	<section class="page-shell page-shell--narrow not-found-page">
		<div class="not-found-card site-surface">
			<p class="page-eyebrow">Page not found</p>
			<h1 class="page-title">This page is not on the schedule.</h1>
			<p class="page-copy">
				The link may have moved, or the page may no longer be part of
				the site. Use one of the main paths below to get back to the
				current class resources.
			</p>
			<div class="site-action-row not-found-actions">
				<RouterLink class="site-button site-button--primary" to="/">
					Go home
				</RouterLink>
				<RouterLink
					class="site-button site-button--secondary"
					to="/courses"
				>
					View courses
				</RouterLink>
				<button
					class="site-button site-button--secondary"
					type="button"
					@click="goBack"
				>
					Go back
				</button>
			</div>
		</div>
	</section>
</template>

<style scoped>
.not-found-page {
	padding-top: clamp(2rem, 4vw, 3.5rem);
}

.not-found-card {
	display: grid;
	gap: 1.1rem;
	padding: clamp(1.75rem, 4vw, 3rem);
	overflow: hidden;
	position: relative;
}

.not-found-card::before {
	content: "";
	position: absolute;
	inset: auto -8rem -10rem auto;
	width: 20rem;
	height: 20rem;
	border-radius: 999px;
	background: radial-gradient(
		circle,
		rgba(15, 118, 110, 0.12),
		transparent 68%
	);
	pointer-events: none;
}

.not-found-card > * {
	position: relative;
}

.not-found-actions {
	margin-top: 0.4rem;
}
</style>

<route lang="yaml">
meta:
layout: 404
</route>
