<template>
	<footer class="site-footer">
		<div class="site-shell site-shell--wide site-footer__inner">
			<section class="site-footer__brand">
				<p class="site-footer__eyebrow">
					A simple computer science classroom
				</p>
				<h2>Classes with Julio</h2>
				<p class="site-footer__summary">
					Scratch, Python, and game-making lessons for young coders.
					Course materials are open to every student—no account
					needed.
				</p>
			</section>

			<nav class="site-footer__group" aria-label="Footer navigation">
				<h3>Explore</h3>
				<ul>
					<li><RouterLink to="/courses">Courses</RouterLink></li>
					<li>
						<RouterLink to="/python-ide">Python IDE</RouterLink>
					</li>
					<li><RouterLink to="/about">About Julio</RouterLink></li>
				</ul>
			</nav>
		</div>

		<div class="site-shell site-shell--wide site-footer__bottom">
			<p>© {{ new Date().getFullYear() }} Classes with Julio.</p>
			<button
				class="site-footer__theme-toggle"
				type="button"
				:aria-label="
					isDark ? 'Switch to light mode' : 'Switch to dark mode'
				"
				:aria-pressed="isDark"
				@click="toggleDark()"
			>
				{{ isDark ? "Light mode" : "Dark mode" }}
			</button>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	margin-top: 4rem;
	padding: 3.5rem 0 1.75rem;
	background: #0c2630;
	color: #e8f7f4;
}

.site-footer__inner {
	display: grid;
	grid-template-columns: minmax(0, 1.5fr) minmax(12rem, 0.6fr);
	gap: 2rem 3rem;
	align-items: start;
}

.site-footer__brand,
.site-footer__group {
	display: grid;
	gap: 0.9rem;
	min-width: 0;
}

.site-footer__eyebrow {
	color: #8ee4d2;
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0.14em;
	text-transform: uppercase;
}

.site-footer h2,
.site-footer h3 {
	color: #f7fffd;
}

.site-footer h2 {
	font-size: clamp(1.9rem, 3vw, 2.4rem);
}

.site-footer h3 {
	font-size: 1.05rem;
}

.site-footer__summary {
	max-width: 36rem;
	color: #bdd9d5;
	line-height: 1.7;
}

.site-footer__group ul {
	display: grid;
	gap: 0.75rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.site-footer__group a {
	color: #a8eee0;
	font-weight: 700;
	text-decoration: none;
}

.site-footer__group a:hover {
	text-decoration: underline;
}

.site-footer__bottom {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.85rem 1rem;
	margin-top: 2rem;
	padding-top: 1rem;
	border-top: 1px solid rgba(189, 217, 213, 0.18);
}

.site-footer__bottom p {
	color: #93b8b2;
	font-size: 0.9rem;
}

.site-footer__theme-toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2.6rem;
	padding: 0.6rem 0.9rem;
	border: 1px solid rgba(142, 228, 210, 0.34);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.08);
	color: #f7fffd;
	font-weight: 800;
}

.site-footer__theme-toggle:hover {
	border-color: rgba(142, 228, 210, 0.65);
	background: rgba(142, 228, 210, 0.14);
}

@media (max-width: 760px) {
	.site-footer__inner {
		grid-template-columns: 1fr;
	}
}
</style>
