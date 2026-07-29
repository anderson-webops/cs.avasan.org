<script lang="ts" setup>
defineOptions({ name: "HomePage" });

const siteUrl = import.meta.env.VITE_SITE_URL || "https://cs.avasan.org";
const featuredCourses = [
	{
		icon: "🐱",
		title: "Scratch",
		copy: "Build stories and games with colorful blocks in Scratch Levels 1 and 2.",
		accent: "coral"
	},
	{
		icon: "🐍",
		title: "Python",
		copy: "Learn the foundations of typed programming in Python Levels 1 and 2.",
		accent: "blue"
	},
	{
		icon: "🎮",
		title: "PyGames",
		copy: "Use Python skills to design playable projects and explore game logic.",
		accent: "green"
	}
];

useHead({
	link: [{ href: `${siteUrl}/`, rel: "canonical" }],
	script: [
		{
			innerHTML: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "ItemList",
				itemListElement: [
					"Scratch Level 1",
					"Scratch Level 2",
					"Python Level 1",
					"Python Level 2",
					"PyGames"
				].map((name, index) => ({
					"@type": "Course",
					name,
					position: index + 1,
					provider: {
						"@type": "Person",
						name: "Julio",
						jobTitle: "Grade-school teacher"
					}
				}))
			}),
			key: "classes-with-julio-courses",
			type: "application/ld+json"
		}
	]
});
</script>

<template>
	<section class="page-shell page-shell--wide home-page">
		<section aria-labelledby="hero-title" class="page-hero home-hero">
			<div class="hero-copy">
				<p class="page-eyebrow">
					A computer science classroom for young learners
				</p>
				<h1 id="hero-title" class="page-title">
					Make something<br />
					<span>you can play.</span>
				</h1>
				<p class="page-copy">
					Grade-school teacher Julio shares a small, focused
					collection of Scratch, Python, and game-making courses. Pick
					a lesson and begin—no student account or sign-up form
					required.
				</p>
				<ul class="hero-proof" aria-label="Course benefits">
					<li class="site-chip">No student account</li>
					<li class="site-chip">Five focused courses</li>
					<li class="site-chip">Python runs in the browser</li>
				</ul>
				<div class="site-action-row">
					<RouterLink
						class="site-button site-button--primary"
						to="/courses"
					>
						Start a course
					</RouterLink>
					<RouterLink
						class="site-button site-button--secondary"
						to="/python-ide"
					>
						Open the Python IDE
					</RouterLink>
				</div>
			</div>

			<div
				class="code-playground site-surface"
				aria-label="A playful code example"
			>
				<div class="code-playground__bar">
					<span />
					<span />
					<span />
					<strong>hello.py</strong>
				</div>
				<pre><code><span class="code-keyword">name</span> = <span class="code-string">"young coder"</span>

<span class="code-keyword">for</span> level <span class="code-keyword">in</span> range(<span class="code-number">1</span>, <span class="code-number">4</span>):
    print(<span class="code-string">f"Level {level}: make it fun!"</span>)

<span class="code-comment"># Your idea goes here 🚀</span></code></pre>
				<div class="code-playground__result">
					<span aria-hidden="true">▶</span>
					<p>Level 1: make it fun!</p>
				</div>
				<div class="orbit orbit--one" aria-hidden="true">★</div>
				<div class="orbit orbit--two" aria-hidden="true">+</div>
			</div>
		</section>

		<section aria-labelledby="courses-title" class="home-section">
			<div class="section-heading">
				<p class="page-eyebrow">Choose a starting point</p>
				<h2 id="courses-title" class="section-title">
					Three ways to create
				</h2>
				<p class="section-intro">
					The library stays intentionally small so younger students
					can find their next step without sorting through dozens of
					choices.
				</p>
			</div>

			<div class="course-grid">
				<article
					v-for="course in featuredCourses"
					:key="course.title"
					class="course-card site-surface site-surface--soft"
					:class="`course-card--${course.accent}`"
				>
					<span class="course-card__icon" aria-hidden="true">{{
						course.icon
					}}</span>
					<h3>{{ course.title }}</h3>
					<p>{{ course.copy }}</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="steps-title" class="home-section">
			<div class="section-heading">
				<p class="page-eyebrow">How to use the site</p>
				<h2 id="steps-title" class="section-title">
					Open, learn, build
				</h2>
			</div>
			<ol class="steps-grid">
				<li class="site-surface site-surface--soft">
					<span>1</span>
					<div>
						<h3>Pick a course</h3>
						<p>
							Choose Scratch, Python, or PyGames from the public
							library.
						</p>
					</div>
				</li>
				<li class="site-surface site-surface--soft">
					<span>2</span>
					<div>
						<h3>Follow one lesson</h3>
						<p>
							Read the idea, try the example, and open the linked
							project.
						</p>
					</div>
				</li>
				<li class="site-surface site-surface--soft">
					<span>3</span>
					<div>
						<h3>Make it your own</h3>
						<p>
							Change the code, test a new idea, and show someone
							what you made.
						</p>
					</div>
				</li>
			</ol>
		</section>

		<section
			class="teacher-note site-surface"
			aria-labelledby="teacher-note-title"
		>
			<div>
				<p class="page-eyebrow">From Julio's classroom</p>
				<h2 id="teacher-note-title" class="section-title">
					Curiosity comes before complexity.
				</h2>
			</div>
			<p class="section-intro">
				These materials are meant to help grade-school students
				experiment, notice patterns, and turn small ideas into working
				projects. Students never need to manage an account just to
				learn.
			</p>
		</section>
	</section>
</template>

<style scoped>
.home-page {
	gap: clamp(3rem, 7vw, 6rem);
}

.home-hero {
	grid-template-columns: minmax(0, 1fr) minmax(19rem, 0.86fr);
}

.hero-copy {
	display: grid;
	gap: 1.25rem;
	max-width: 44rem;
}

.hero-copy .page-title span {
	color: #0f766e;
}

.hero-proof {
	display: flex;
	flex-wrap: wrap;
	gap: 0.65rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.code-playground {
	position: relative;
	overflow: hidden;
	padding: 0;
	border-color: rgba(15, 118, 110, 0.2);
	background: #102235;
	box-shadow: 0 32px 70px -42px rgba(15, 35, 53, 0.72);
	color: #eef8ff;
	transform: rotate(1.5deg);
}

.code-playground__bar {
	display: flex;
	align-items: center;
	gap: 0.45rem;
	padding: 0.9rem 1rem;
	background: #0a1725;
}

.code-playground__bar span {
	width: 0.72rem;
	height: 0.72rem;
	border-radius: 99px;
	background: #fb7185;
}

.code-playground__bar span:nth-child(2) {
	background: #fbbf24;
}

.code-playground__bar span:nth-child(3) {
	background: #34d399;
}

.code-playground__bar strong {
	margin-left: 0.35rem;
	color: #b7cadc;
	font-family: var(--font-sans);
	font-size: 0.82rem;
	letter-spacing: 0.03em;
}

.code-playground pre {
	margin: 0;
	padding: clamp(1.4rem, 4vw, 2.25rem);
	overflow-x: auto;
	background: transparent;
	color: #e7f1f8;
	font:
		600 clamp(0.76rem, 1.6vw, 0.98rem) / 1.8 "DM Mono",
		monospace;
	text-align: left;
}

.code-keyword {
	color: #78e7d2;
}

.code-string {
	color: #f8b4cf;
}

.code-number {
	color: #f9d56e;
}

.code-comment {
	color: #8ca6bb;
}

.code-playground__result {
	display: flex;
	align-items: center;
	gap: 0.7rem;
	margin: 0 1.25rem 1.25rem;
	padding: 0.85rem 1rem;
	border: 1px solid rgba(120, 231, 210, 0.18);
	border-radius: 14px;
	background: rgba(15, 118, 110, 0.16);
	color: #c7fff4;
	font: 700 0.86rem / 1.4 var(--font-sans);
}

.orbit {
	position: absolute;
	display: grid;
	place-items: center;
	border-radius: 999px;
	font-weight: 900;
}

.orbit--one {
	right: -1rem;
	top: 28%;
	width: 3.2rem;
	height: 3.2rem;
	background: #fbbf24;
	color: #713f12;
	transform: rotate(-12deg);
}

.orbit--two {
	left: 36%;
	bottom: -1.2rem;
	width: 2.7rem;
	height: 2.7rem;
	background: #fb7185;
	color: #fff1f2;
	font-size: 1.5rem;
}

.home-section {
	display: grid;
	gap: 1.4rem;
}

.section-heading {
	display: grid;
	gap: 0.75rem;
	max-width: 48rem;
}

.course-grid,
.steps-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.course-card {
	position: relative;
	display: grid;
	gap: 0.85rem;
	overflow: hidden;
	padding: clamp(1.3rem, 2.5vw, 1.8rem);
	border-top-width: 5px;
}

.course-card--coral {
	border-top-color: #fb7185;
}

.course-card--blue {
	border-top-color: #60a5fa;
}

.course-card--green {
	border-top-color: #34d399;
}

.course-card__icon {
	font-size: 2.2rem;
}

.course-card h3,
.steps-grid h3 {
	font-size: 1.35rem;
}

.course-card p,
.steps-grid p {
	color: var(--color-ink-soft);
	line-height: 1.65;
}

.steps-grid li {
	display: flex;
	gap: 1rem;
	padding: 1.25rem;
}

.steps-grid li > span {
	display: grid;
	place-items: center;
	flex: 0 0 2.6rem;
	width: 2.6rem;
	height: 2.6rem;
	border-radius: 14px;
	background: rgba(15, 118, 110, 0.11);
	color: #0f766e;
	font-weight: 900;
}

.steps-grid li div {
	display: grid;
	gap: 0.5rem;
}

.teacher-note {
	display: grid;
	grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
	gap: 1.5rem 3rem;
	align-items: center;
	padding: clamp(1.6rem, 4vw, 2.8rem);
	background:
		linear-gradient(120deg, rgba(15, 118, 110, 0.08), transparent 46%),
		var(--color-surface);
}

.teacher-note > div {
	display: grid;
	gap: 0.65rem;
}

@media (max-width: 900px) {
	.home-hero,
	.teacher-note {
		grid-template-columns: 1fr;
	}

	.code-playground {
		transform: none;
	}

	.course-grid,
	.steps-grid {
		grid-template-columns: 1fr;
	}
}
</style>

<route lang="yaml">
meta:
    layout: home
</route>
