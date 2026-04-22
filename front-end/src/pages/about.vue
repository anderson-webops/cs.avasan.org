<script lang="ts" setup>
defineOptions({ name: "AboutPage" });
</script>

<template>
	<section class="About">
		<section aria-labelledby="intro-title" class="intro">
			<h1 id="intro-title" class="page-title">About Jacob</h1>

			<div class="image-wrapper">
				<img
					alt="Jacob Anderson"
					src="https://jacobdanderson.s3.us-east-1.amazonaws.com/images/Jacob_Anderson.jpg"
				/>
			</div>

			<div class="copy">
				<p>
					I taught hundreds of students through Juni Learning before
					moving into direct private instruction. Most students come
					to me with an assignment, bug, lab, or project that needs
					focused one-on-one help.
				</p>
				<p>
					That means sessions are built around the work in front of
					the learner: debugging code, finishing coursework, reviewing
					reasoning, or moving through a structured course path when
					there is no active class assignment.
				</p>
			</div>
		</section>

		<section aria-labelledby="fit-title" class="fit">
			<h2 id="fit-title">Best Fit</h2>
			<div class="fit-grid">
				<article>
					<h3>Active Coursework</h3>
					<p>
						A strong fit for students who need help finishing an
						assignment, understanding a module, or preparing for the
						next check-in.
					</p>
				</article>
				<article>
					<h3>Debugging and Project Work</h3>
					<p>
						Useful for students building apps, games, labs, or other
						project work and needing direct feedback while the work
						is still in progress.
					</p>
				</article>
				<article>
					<h3>Structured Course Progression</h3>
					<p>
						A good fit when a student needs a defined path with
						linked projects and supplemental practice instead of
						improvised enrichment.
					</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="approach-title" class="approach">
			<h2 id="approach-title">How Sessions Run</h2>
			<ul>
				<li>
					<p>
						<strong>Start with the exact problem:</strong>
						We work from the assignment, bug, or project in front of
						the student instead of drifting into generic lecture.
					</p>
				</li>
				<li>
					<p>
						<strong>Make the reasoning visible:</strong>
						Students explain choices, test cases, and edge cases out
						loud so understanding is easy to check.
					</p>
				</li>
				<li>
					<p>
						<strong>Leave with a next step:</strong>
						Each session ends with what was solved, what still needs
						work, and what to do next.
					</p>
				</li>
			</ul>
		</section>

		<section aria-label="About page actions" class="cta-group">
			<RouterLink class="cta" to="/signup">Book a Class</RouterLink>
			<a
				class="cta ghost"
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
.About {
	padding: 2.5rem 1.5rem 4rem;
	display: flex;
	flex-direction: column;
	gap: 3rem;
	color: #16202a;
	align-items: center;
}

.About > * {
	max-width: 1200px;
	margin: 1% auto;
	width: 100%;
}

.intro {
	margin: 0 auto 1%;
	display: grid;
	gap: 2.5rem;
	align-items: center;
	grid-template-columns: auto 25%;
	grid-template-areas:
		"title title"
		"copy image";
}

.page-title {
	grid-area: title;
	font-size: clamp(2.4rem, 4vw, 3.2rem);
	margin: 0 0 0.25rem 0;
	text-align: center;
}

.image-wrapper {
	grid-area: image;
	align-self: stretch;
	width: 100%;
	display: flex;
}

.image-wrapper img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 28px;
	box-shadow: 0 20px 45px rgba(13, 38, 63, 0.18);
}

@media (max-width: 960px) {
	.intro {
		grid-template-columns: 1fr;
		grid-template-areas:
			"title"
			"image"
			"copy";
		gap: 2rem;
	}

	.image-wrapper {
		max-width: 55%;
		justify-self: center;
	}

	.page-title {
		font-size: clamp(1.8rem, 6vw, 2.2rem);
	}
}

.copy {
	grid-area: copy;
	display: grid;
	gap: 1.25rem;
}

.approach,
.fit {
	display: grid;
	gap: 1.25rem;
}

.copy p,
.approach p,
.fit-grid p {
	margin: 0;
	line-height: 1.6;
	color: #2d3f55;
	font-size: 1.05rem;
}

.approach ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 1rem;
}

.approach li {
	background: #f4f8fc;
	border-radius: 16px;
	padding: 1rem 1.25rem;
	box-shadow: inset 0 0 0 1px #dbe9f8;
	line-height: 1.6;
	color: #1f3d5a;
}

.fit-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1.25rem;
}

.fit-grid article {
	background: white;
	border-radius: 20px;
	padding: 1.4rem;
	box-shadow: 0 14px 32px rgba(16, 42, 66, 0.08);
	display: grid;
	gap: 0.75rem;
}

.fit-grid h3,
.approach h2,
.fit h2 {
	margin: 0;
}

.cta-group {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-content: space-around;
	align-items: center;
	width: 100%;
	margin: 0.5rem 0 auto;
	text-align: center;
}

.cta-group > * {
	min-width: 220px;
}

.cta {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem 1.4rem;
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

.cta.ghost {
	background-color: white;
	color: #3a6ea5;
	box-shadow: inset 0 0 0 2px #3a6ea5;
}

.cta.ghost:hover {
	background-color: #e9f2fb;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
