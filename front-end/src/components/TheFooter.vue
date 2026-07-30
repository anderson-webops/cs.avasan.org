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
	color: var(--color-ink);
	font-size: 0.95rem;
	font-weight: 750;
	line-height: 1.45;
	text-decoration: underline;
	text-decoration-thickness: 0.08em;
	text-underline-offset: 0.2em;
}

.site-footer__link:hover {
	color: var(--color-ink);
	text-decoration: underline;
}
</style>
