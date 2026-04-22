<script lang="ts" setup>
import { warmSchedulerConnections } from "@/modules/scheduler";
</script>

<template>
	<footer class="site-footer">
		<div class="site-shell site-shell--wide site-footer__inner">
			<section class="site-footer__brand">
				<p class="site-footer__eyebrow">Private Online Tutoring</p>
				<h2>Classes with Jacob</h2>
				<p class="site-footer__summary">
					One-on-one support for active coursework, projects, and
					structured course paths.
				</p>
			</section>

			<section class="site-footer__group">
				<h3>Connect</h3>
				<ul>
					<li>
						<a href="mailto:classes@jacobdanderson.net">
							Email Jacob
						</a>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/in/jacoba1100254352/"
							rel="noreferrer"
							target="_blank"
						>
							LinkedIn
						</a>
					</li>
					<li>
						<a
							href="https://github.com/jacoba1100254352"
							rel="noreferrer"
							target="_blank"
						>
							GitHub
						</a>
					</li>
				</ul>
			</section>

			<section class="site-footer__group">
				<h3>Use the Site</h3>
				<ul>
					<li>
						<RouterLink
							to="/signup"
							@focus="warmSchedulerConnections"
							@mouseenter="warmSchedulerConnections"
							@touchstart.passive="warmSchedulerConnections"
						>
							Book a Class
						</RouterLink>
					</li>
					<li>
						<RouterLink to="/payment">View Tuition</RouterLink>
					</li>
					<li>
						<RouterLink to="/about">About Jacob</RouterLink>
					</li>
				</ul>
			</section>
		</div>

		<div class="site-shell site-shell--wide site-footer__bottom">
			<p>© {{ new Date().getFullYear() }} Jacob Anderson.</p>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	margin-top: 4rem;
	padding: 3.5rem 0 1.75rem;
	background: #0f1c2a;
	color: #e6edf5;
}

.site-footer__inner {
	display: grid;
	grid-template-columns: minmax(0, 1.4fr) repeat(2, minmax(0, 0.9fr));
	gap: 2rem 2.5rem;
	align-items: start;
}

.site-footer__eyebrow {
	margin: 0 0 0.75rem;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #9ec3f4;
}

.site-footer__brand,
.site-footer__group {
	min-width: 0;
	display: grid;
	gap: 0.9rem;
	text-align: left;
}

.site-footer__brand h2 {
	font-size: clamp(1.9rem, 3vw, 2.4rem);
	color: #f6fbff;
}

.site-footer__summary {
	margin: 0;
	max-width: 28rem;
	color: #b8cadd;
	line-height: 1.7;
}

.site-footer__group h3 {
	margin: 0;
	font-size: 1.05rem;
	color: #f6fbff;
}

.site-footer__group ul {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.75rem;
}

.site-footer__group a {
	color: #9ec3f4;
	font-weight: 600;
	text-decoration: none;
}

.site-footer__group a:hover {
	text-decoration: underline;
}

.site-footer__bottom {
	margin-top: 2rem;
	padding-top: 1rem;
	border-top: 1px solid rgba(184, 202, 221, 0.16);
}

.site-footer__bottom p {
	margin: 0;
	color: #8fa6c1;
	font-size: 0.9rem;
	text-align: left;
}

@media (max-width: 960px) {
	.site-footer__inner {
		grid-template-columns: 1fr;
	}

	.site-footer__brand h2 {
		font-size: clamp(1.6rem, 8vw, 2rem);
	}
}
</style>
