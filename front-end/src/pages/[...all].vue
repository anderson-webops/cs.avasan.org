<template>
	<section class="page-shell page-shell--narrow not-found-page">
		<div class="not-found-card site-surface">
			<h1 class="page-title">Page not found</h1>
			<RouterLink class="site-button site-button--primary" to="/">
				View courses
			</RouterLink>
		</div>
	</section>
</template>

<style scoped>
.not-found-page {
	padding-top: clamp(2rem, 4vw, 3.5rem);
}

.not-found-card {
	display: grid;
	justify-items: start;
	gap: 1.1rem;
	padding: clamp(1.75rem, 4vw, 3rem);
}
</style>
