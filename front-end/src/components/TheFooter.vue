<template>
	<footer class="site-footer">
		<div class="site-shell site-shell--wide site-footer__inner">
			<RouterLink class="site-footer__link" to="/student-privacy">
				Student privacy and record requests
			</RouterLink>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	padding: 0.5rem 0 1.25rem;
}

.site-footer__inner {
	display: flex;
	justify-content: flex-end;
}

.site-footer__link {
	color: var(--color-footer-link);
	font-size: 0.75rem;
	font-weight: 500;
	line-height: 1.45;
	text-decoration: none;
	text-decoration-thickness: 0.08em;
	text-underline-offset: 0.2em;
}

.site-footer__link:hover,
.site-footer__link:focus-visible {
	color: var(--color-ink-soft);
	text-decoration: underline;
}

.site-footer__link:focus-visible {
	border-radius: 0.2rem;
	outline: 2px solid var(--focus-ring-color);
	outline-offset: 0.2rem;
}
</style>
