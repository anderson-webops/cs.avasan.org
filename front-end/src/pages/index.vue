<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useContentStore } from "@/stores/content";

defineOptions({ name: "HomePage" });

const content = useContentStore();
const { subjectGroups, highlights } = storeToRefs(content);
</script>

<template>
	<section class="Home">
		<section aria-labelledby="hero-title" class="hero">
			<div class="hero-text">
				<p class="eyebrow">Classes with Jacob</p>
				<h1>Build confidence in coding, STEM, and Spanish.</h1>
				<p>
					I specialize in teaching programming, engineering, and language topics to learners of all ages—from
					grade school through adulthood. Every session focuses on their individual goals—whether that’s
					discovering new skills or strengthening existing ones.
				</p>
			</div>
			<img
				alt="Student and tutor collaborating on a laptop"
				class="hero-image"
				src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
			/>
		</section>

		<section aria-labelledby="cta-title" class="cta-group">
			<RouterLink class="cta primary" to="/signup">Book a class</RouterLink>
			<RouterLink class="cta secondary" to="/payment">See tuition details</RouterLink>
		</section>

		<section aria-labelledby="subjects-title" class="subjects">
			<h2 id="subjects-title">What I teach</h2>
			<!--			<p class="intro">
				Learn coding, STEM, and languages your way—with lessons and
				projects that match your goals.
			</p> -->
			<div class="subject-grid">
				<article v-for="group in subjectGroups" :key="group.title" class="subject-card">
					<h3>{{ group.title }}</h3>
					<ul>
						<li v-for="subject in group.subjects" :key="subject">
							{{ subject }}
						</li>
					</ul>
				</article>
			</div>
		</section>

		<section aria-labelledby="highlights-title" class="highlights">
			<h2 id="highlights-title">What I offer</h2>
			<div class="highlight-grid">
				<article v-for="highlight in highlights" :key="highlight.title" class="highlight-card">
					<h3>{{ highlight.title }}</h3>
					<p>{{ highlight.copy }}</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="next-steps-title" class="next-steps">
			<div class="next-steps-card">
				<h2 id="next-steps-title">Ready to get started?</h2>
				<p>
					Pick a time on my Calendly, tell me a bit about the learner, and I’ll confirm within one business
					day. Returning students can use the same link to book ongoing sessions.
				</p>
				<RouterLink class="cta primary" to="/signup">Schedule on Calendly</RouterLink>
				<!--				href="mailto:jacob@jacobdanderson.net" -->
				<a class="cta secondary" href="mailto:bascule-skaters0n@icloud.com">Email me a question</a>
			</div>
		</section>
	</section>
</template>

<style scoped>
.Home {
	display: flex;
	flex-direction: column;
	gap: 4rem;
	padding: 2.5rem 1.5rem 4rem;
	color: #16202a;
}

.hero {
	display: grid;
	gap: 2rem;
	align-items: center;
	grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
}

.hero-text {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.hero-text h1 {
	font-size: clamp(2.25rem, 4vw, 3rem);
	line-height: 1.1;
	font-weight: 700;
}

.hero-text p {
	font-size: 1.05rem;
	line-height: 1.6;
	margin: 0;
}

.eyebrow {
	text-transform: uppercase;
	letter-spacing: 0.2em;
	font-size: 0.85rem;
	color: #3a6ea5;
	font-weight: 600;
}

.cta-group {
	display: flex;
	gap: 2rem;
	justify-content: space-around;
	align-items: center;
}

.cta-group * {
	width: 40%;
	margin: 0 auto;
}

.cta {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.5rem;
	border-radius: 999px;
	font-weight: 600;
	text-decoration: none;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;
	border: 2px solid transparent;
}

.cta.primary {
	background-color: #3a6ea5;
	color: white;
}

.cta.primary:hover {
	background-color: #2d5c8a;
	transform: translateY(-2px);
}

.cta.secondary {
	background-color: white;
	border-color: #3a6ea5;
	color: #3a6ea5;
}

.cta.secondary:hover {
	background-color: #e9f2fb;
	transform: translateY(-2px);
}

.hero-image {
	width: 100%;
	max-height: 420px;
	object-fit: cover;
	border-radius: 24px;
	box-shadow: 0 18px 40px rgba(14, 33, 58, 0.18);
}

.hero,
.cta-group,
.subjects,
.highlights,
.next-steps {
	max-width: 1100px;
	width: 100%;
	margin: 0 auto;
	text-align: center;
}

.subjects h2,
.highlights h2,
.next-steps h2 {
	font-size: clamp(1.8rem, 3vw, 2.4rem);
	margin-bottom: 0.75rem;
}

/*.intro {
	max-width: 720px;
	margin: 0 auto 2.5rem;
	font-size: 1.05rem;
	line-height: 1.6;
	color: #334155;
}*/

.subject-grid {
	display: grid;
	gap: 1.5rem;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.subject-card {
	padding: 1.75rem;
	background: white;
	border-radius: 20px;
	box-shadow: 0 10px 30px rgba(16, 42, 66, 0.08);
	text-align: left;
}

.subject-card h3 {
	margin-bottom: 0.75rem;
	font-size: 1.2rem;
	color: #1f3d5a;
}

.subject-card ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 0.4rem;
	color: #334155;
}

.highlight-grid {
	display: grid;
	gap: 1.5rem;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.highlight-card {
	padding: 1.75rem;
	border-radius: 20px;
	background: linear-gradient(145deg, #e7f2ff, #f7fbff);
	box-shadow: 0 14px 30px rgba(18, 64, 112, 0.08);
}

.highlight-card h3 {
	margin-bottom: 0.75rem;
	font-size: 1.2rem;
	color: #1f3d5a;
}

.highlight-card p {
	margin: 0;
	color: #2d3f55;
	line-height: 1.6;
	text-align: left;
}

.next-steps {
	text-align: center;
}

.next-steps-card {
	margin: 0 auto;
	max-width: 720px;
	padding: 2.5rem;
	background: #0f1f2f;
	color: white;
	border-radius: 24px;
	display: grid;
	gap: 1.5rem;
	box-shadow: 0 24px 50px rgba(10, 25, 40, 0.25);
}

.next-steps-card p {
	margin: 0;
	font-size: 1.05rem;
	line-height: 1.6;
	color: #e6edf5;
}

.next-steps-card .cta.secondary {
	background-color: transparent;
	color: white;
	border-color: rgba(255, 255, 255, 0.6);
}

.next-steps-card .cta.secondary:hover {
	background-color: rgba(255, 255, 255, 0.12);
}

@media (max-width: 600px) {
	.eyebrow {
		text-align: center;
	}

	.Home {
		padding: 1.5rem 1rem 3rem;
	}

	.Home > .hero + .cta-group {
		margin-top: -15%; /* negative of the gap value */
	}

	.hero {
		gap: 1.5rem;
	}

	.hero-image {
		display: none;
	}

	.cta-group {
		display: block;
	}

	.cta-group * {
		margin: 1% 0;
		width: 100%;
	}

	.subject-card,
	.highlight-card {
		padding: 1.5rem;
	}

	.next-steps-card {
		padding: 2rem 1.5rem;
	}
}
</style>

<route lang="json">
{
	"meta": {
		"layout": "default"
	}
}
</route>
