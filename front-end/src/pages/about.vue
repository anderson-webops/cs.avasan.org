<script lang="ts" setup>
defineOptions({ name: "AboutPage" });
</script>

<template>
	<section class="page-shell page-shell--wide about-page">
		<section aria-labelledby="intro-title" class="page-hero about-intro">
			<div class="about-copy">
				<p class="page-eyebrow">About Julio</p>
				<h1 id="intro-title" class="page-title">
					A teacher's small coding library
				</h1>
				<p class="page-copy">
					Julio is a grade-school teacher. He made this site to give
					young learners a clear place to practice computer science
					without managing another school account.
				</p>
				<p class="page-copy">
					The library is intentionally focused: Scratch for visual
					beginnings, Python for typed programming, and PyGames for
					bringing code to life.
				</p>
				<div class="site-action-row">
					<RouterLink
						class="site-button site-button--primary"
						to="/courses"
					>
						Explore the courses
					</RouterLink>
					<RouterLink
						class="site-button site-button--secondary"
						to="/python-ide"
					>
						Try Python
					</RouterLink>
				</div>
			</div>

			<div class="classroom-board site-surface" aria-hidden="true">
				<div
					class="classroom-board__tape classroom-board__tape--left"
				/>
				<div
					class="classroom-board__tape classroom-board__tape--right"
				/>
				<p>Julio's classroom recipe</p>
				<ol>
					<li><span>1</span> Ask a question</li>
					<li><span>2</span> Try a small idea</li>
					<li><span>3</span> Test what happens</li>
					<li><span>4</span> Make it yours</li>
				</ol>
				<strong>Curiosity + practice = progress</strong>
			</div>
		</section>

		<section aria-labelledby="approach-title" class="about-section">
			<div class="section-heading">
				<p class="page-eyebrow">The teaching approach</p>
				<h2 id="approach-title" class="section-title">
					Built for younger learners
				</h2>
			</div>
			<div class="principle-grid">
				<article class="site-surface site-surface--soft">
					<span aria-hidden="true">🔎</span>
					<h3>One idea at a time</h3>
					<p>
						Lessons break programming into pieces that are small
						enough to explore, explain, and remember.
					</p>
				</article>
				<article class="site-surface site-surface--soft">
					<span aria-hidden="true">🛠️</span>
					<h3>Projects over passwords</h3>
					<p>
						Students can spend their time making things instead of
						creating and managing a site account.
					</p>
				</article>
				<article class="site-surface site-surface--soft">
					<span aria-hidden="true">🌱</span>
					<h3>Room to experiment</h3>
					<p>
						Examples are starting points. Changing them, breaking
						them, and fixing them is part of learning.
					</p>
				</article>
			</div>
		</section>

		<section
			class="access-note site-surface"
			aria-labelledby="access-title"
		>
			<div>
				<p class="page-eyebrow">Simple access</p>
				<h2 id="access-title" class="section-title">
					Students just open and learn.
				</h2>
			</div>
			<p class="section-intro">
				There is no student sign-up, enrollment form, payment page,
				scheduler, or video-meeting link on this site. Julio has the
				only private account, used to maintain the classroom.
			</p>
		</section>
	</section>
</template>

<style scoped>
.about-page {
	gap: clamp(2.8rem, 6vw, 5rem);
}

.about-intro {
	grid-template-columns: minmax(0, 1.05fr) minmax(18rem, 0.8fr);
}

.about-copy,
.about-section,
.section-heading {
	display: grid;
	gap: 1.15rem;
}

.classroom-board {
	position: relative;
	padding: clamp(1.6rem, 4vw, 2.5rem);
	background:
		linear-gradient(rgba(255, 255, 255, 0.94), rgba(255, 255, 255, 0.94)),
		repeating-linear-gradient(
			0deg,
			transparent,
			transparent 29px,
			rgba(96, 165, 250, 0.25) 30px
		);
	transform: rotate(-1.5deg);
}

.classroom-board > p {
	color: #0f766e;
	font-size: 0.8rem;
	font-weight: 900;
	letter-spacing: 0.13em;
	text-transform: uppercase;
}

.classroom-board ol {
	display: grid;
	gap: 0.85rem;
	margin: 1.4rem 0;
	padding: 0;
	list-style: none;
}

.classroom-board li {
	display: flex;
	align-items: center;
	gap: 0.8rem;
	color: #183044;
	font-weight: 800;
}

.classroom-board li span {
	display: grid;
	place-items: center;
	width: 2rem;
	height: 2rem;
	border-radius: 10px;
	background: #e0f2fe;
	color: #075985;
}

.classroom-board strong {
	color: #9f1239;
	font-family: var(--font-display);
	font-size: 1.15rem;
}

html.dark .classroom-board > p {
	color: #ccfbf1 !important;
}

html.dark .classroom-board li {
	color: #f8fafc !important;
}

html.dark .classroom-board li span {
	background: #164e63 !important;
	color: #e0f2fe !important;
}

html.dark .classroom-board strong {
	color: #fecdd3 !important;
}

.classroom-board__tape {
	position: absolute;
	top: -0.8rem;
	width: 4.5rem;
	height: 1.5rem;
	background: rgba(253, 230, 138, 0.76);
}

.classroom-board__tape--left {
	left: 1.6rem;
	transform: rotate(-6deg);
}

.classroom-board__tape--right {
	right: 1.6rem;
	transform: rotate(5deg);
}

.principle-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;
}

.principle-grid article {
	display: grid;
	gap: 0.75rem;
	padding: 1.4rem;
}

.principle-grid article > span {
	font-size: 2rem;
}

.principle-grid h3 {
	font-size: 1.3rem;
}

.principle-grid p {
	color: var(--color-ink-soft);
	line-height: 1.65;
}

.access-note {
	display: grid;
	grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
	gap: 1.5rem 3rem;
	align-items: center;
	padding: clamp(1.6rem, 4vw, 2.6rem);
	background:
		linear-gradient(120deg, rgba(96, 165, 250, 0.1), transparent 46%),
		var(--color-surface);
}

.access-note > div {
	display: grid;
	gap: 0.65rem;
}

@media (max-width: 880px) {
	.about-intro,
	.access-note {
		grid-template-columns: 1fr;
	}

	.principle-grid {
		grid-template-columns: 1fr;
	}

	.classroom-board {
		transform: none;
	}
}
</style>
