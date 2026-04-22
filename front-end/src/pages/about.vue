<script lang="ts" setup>
defineOptions({ name: "AboutPage" });
</script>

<template>
	<section class="page-shell page-shell--wide about-page">
		<section aria-labelledby="intro-title" class="page-hero about-intro">
			<div class="copy">
				<p class="page-eyebrow">About Jacob</p>
				<h1 id="intro-title" class="page-title">
					Focused Help for the Work in Front of the Student
				</h1>
				<p class="page-copy">
					I taught hundreds of students through Juni Learning before
					moving into direct private instruction. Most students come
					to me with an assignment, bug, lab, or project that needs
					focused one-on-one help.
				</p>
				<p class="page-copy">
					That means sessions are built around the work in front of
					the learner: debugging code, finishing coursework, reviewing
					reasoning, or moving through a structured course path when
					there is no active class assignment.
				</p>
			</div>
			<figure class="image-wrapper media-frame">
				<img
					alt="Jacob Anderson"
					height="1200"
					loading="lazy"
					src="https://jacobdanderson.s3.us-east-1.amazonaws.com/images/Jacob_Anderson.jpg"
					width="960"
				/>
			</figure>
		</section>

		<section aria-labelledby="fit-title" class="about-section">
			<div class="section-heading">
				<h2 id="fit-title" class="section-title">Best Fit</h2>
			</div>
			<div class="fit-grid">
				<article class="site-surface site-surface--soft">
					<h3>Active Coursework</h3>
					<p>
						A strong fit for students who need help finishing an
						assignment, understanding a module, or preparing for the
						next check-in.
					</p>
				</article>
				<article class="site-surface site-surface--soft">
					<h3>Debugging and Project Work</h3>
					<p>
						Useful for students building apps, games, labs, or other
						project work and needing direct feedback while the work
						is still in progress.
					</p>
				</article>
				<article class="site-surface site-surface--soft">
					<h3>Structured Course Progression</h3>
					<p>
						A good fit when a student needs a defined path with
						linked projects and supplemental practice instead of
						improvised enrichment.
					</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="approach-title" class="about-section">
			<div class="section-heading">
				<h2 id="approach-title" class="section-title">
					How Sessions Run
				</h2>
			</div>
			<ul>
				<li class="site-surface site-surface--soft">
					<p>
						<strong>Start with the exact problem:</strong>
						We work from the assignment, bug, or project in front of
						the student instead of drifting into generic lecture.
					</p>
				</li>
				<li class="site-surface site-surface--soft">
					<p>
						<strong>Make the reasoning visible:</strong>
						Students explain choices, test cases, and edge cases out
						loud so understanding is easy to check.
					</p>
				</li>
				<li class="site-surface site-surface--soft">
					<p>
						<strong>Leave with a next step:</strong>
						Each session ends with what was solved, what still needs
						work, and what to do next.
					</p>
				</li>
			</ul>
		</section>

		<section aria-label="About page actions" class="site-action-row">
			<RouterLink class="site-button site-button--primary" to="/signup">
				Book a Class
			</RouterLink>
			<a
				class="site-button site-button--secondary"
				href="https://www.linkedin.com/in/jacoba1100254352/"
				target="_blank"
				rel="noreferrer"
			>
				View LinkedIn
			</a>
		</section>
	</section>
</template>

<style scoped>
.about-page {
	gap: clamp(2.25rem, 5vw, 4rem);
}

.about-intro {
	grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.8fr);
	align-items: center;
}

.image-wrapper {
	aspect-ratio: 4 / 5;
}

.image-wrapper img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.copy {
	display: grid;
	gap: 1.25rem;
}

.about-section {
	display: grid;
	gap: 1.25rem;
}

.section-heading {
	display: grid;
	gap: 0.8rem;
	max-width: 42rem;
}

.about-section ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 1rem;
}

.about-section li {
	padding: 1rem 1.25rem;
}

.fit-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.25rem;
}

.fit-grid article {
	padding: 1.4rem;
	display: grid;
	gap: 0.75rem;
}

.fit-grid p,
.about-section li p {
	color: var(--color-ink-soft);
	line-height: 1.65;
}

@media (max-width: 920px) {
	.about-intro {
		grid-template-columns: 1fr;
	}

	.image-wrapper {
		max-width: 26rem;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
