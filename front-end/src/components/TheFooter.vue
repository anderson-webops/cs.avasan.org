<template>
	<footer class="site-footer">
		<div class="site-shell site-shell--wide site-footer__inner">
			<RouterLink class="site-footer__link" to="/student-privacy">
				Student privacy
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
	color: var(--color-ink-soft);
	font-size: 0.78rem;
	line-height: 1.3;
	text-decoration: none;
}

.site-footer__link:hover {
	color: var(--color-ink);
	text-decoration: underline;
}
</style>
