<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useQuoteStore } from "@/stores/quote";

defineOptions({ name: "AboutPage" });

const quote = useQuoteStore();
const {
	text: quoteText,
	author: quoteAuthor,
	hasQuote,
	loading,
	error
} = storeToRefs(quote);

// Fetch once on client; cached for 5 minutes by the store
onMounted(() => {
	quote.fetchQuote({ tags: ["success"], limit: 100 });
});
</script>

<template>
	<section class="About">
		<section aria-labelledby="intro-title" class="intro">
			<h1 class="page-title">Meet Jacob</h1>

			<div class="image-wrapper">
				<img
					alt="Jacob Anderson"
					src="https://jacobdanderson.s3.us-east-1.amazonaws.com/images/Jacob_Anderson.jpg"
				/>
			</div>

			<div class="copy">
				<p>
					I’m a lifelong learner and educator who loves helping
					students discover how enjoyable problem-solving can be. Over
					the past several years, I taught coding, math, and science
					through Juni Learning, guiding hundreds of students from
					their first “Hello, World!” program to ambitious capstone
					projects.
				</p>
				<p>
					Today I work directly with families and adult learners,
					keeping the same collaborative, project-driven approach
					while offering more flexibility, clearer communication, and
					personalized support.
				</p>
			</div>
		</section>

		<section aria-labelledby="philosophy-title" class="philosophy">
			<h2 id="philosophy-title">Teaching Philosophy</h2>
			<ul>
				<li>
					<p>
						<strong>Curiosity First:</strong>
						Concepts stick when learners understand why they matter
						and have room to experiment.
					</p>
				</li>
				<li>
					<p>
						<strong>Transparent Goals:</strong>
						Every class ends with a clear milestone or next step, so
						you always know what we are building toward.
					</p>
				</li>
				<li>
					<p>
						<strong>Real-world Context:</strong>
						We connect lessons to meaningful projects—apps, games,
						data explorations, language practice, or engineering
						challenges.
					</p>
				</li>
			</ul>
		</section>

		<section aria-labelledby="experience-title" class="experience">
			<h2 id="experience-title">Experience Snapshot</h2>
			<div class="experience-grid">
				<article>
					<h3>Juni Learning Instructor</h3>
					<p>
						Led 1:1 and small-group classes in a variety of coding
						and STEM fields.
					</p>
				</article>
				<article>
					<h3>Curriculum Designer</h3>
					<p>
						Developed modules on circuit fundamentals, Python, and
						physics.
					</p>
				</article>
				<article>
					<h3>Multilingual Mentor</h3>
					<p>
						Fluent in Spanish and experienced working with bilingual
						families to support both academic and conversational
						goals.
					</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="cta-title" class="cta-group">
			<a
				class="cta"
				href="https://www.linkedin.com/in/jacoba1100254352/"
				target="_blank"
				rel="noreferrer"
			>
				View LinkedIn
			</a>
			<a
				class="cta ghost"
				href="https://www.jacobdanderson.net"
				target="_blank"
				rel="noreferrer"
			>
				Visit Portfolio
			</a>
		</section>

		<section aria-label="Quote" class="quote-section">
			<div v-if="hasQuote" class="quote">
				<blockquote>“{{ quoteText }}”</blockquote>
				<cite>— {{ quoteAuthor }}</cite>
			</div>
			<div v-else-if="loading" class="quote-skeleton">Loading…</div>
			<div v-else-if="error" class="quote-error">Quote unavailable.</div>
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

/* Assign areas */
.page-title {
	grid-area: title;
}

.page-title {
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

/* ===== Tablet stack: Title → Image → Text ===== */
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

.philosophy {
	display: grid;
}

.copy p,
.philosophy p,
.experience-grid p {
	margin: 0;
	line-height: 1.6;
	color: #2d3f55;
	font-size: 1.05rem;
}

.philosophy ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 1rem;
}

.quote,
.philosophy li {
	background: #f4f8fc;
	border-radius: 16px;
	padding: 1rem 1.25rem;
	box-shadow: inset 0 0 0 1px #dbe9f8;
	line-height: 1.6;
	color: #1f3d5a;
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
	transform: translateY(-1px);
}

.cta.ghost {
	background-color: transparent;
	color: #3a6ea5;
	border: 2px solid #3a6ea5;
}

.cta.ghost:hover {
	background-color: #e9f2fb;
}

h2 {
	font-size: clamp(1.8rem, 3vw, 2.4rem);
	margin-bottom: 2rem;
	text-align: center;
}

.experience-grid {
	display: grid;
	gap: 1.5rem;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

.experience-grid article {
	background: white;
	border-radius: 20px;
	padding: 1.75rem;
	box-shadow: 0 14px 30px rgba(18, 64, 112, 0.08);
}

h3 {
	margin-bottom: 0.75rem;
	font-size: 1.2rem;
	color: #1f3d5a;
	text-align: center;
}

.experience-grid p {
	margin: 0;
	color: #2d3f55;
	line-height: 1.6;
}

section p {
	text-align: left;
}

.quote,
.quote-section {
	text-align: right;
	margin: 0 auto;
}

@media (max-width: 640px) {
	.About {
		padding: 2rem 1.25rem 3rem;
	}

	.cta-group {
		flex-direction: column;
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
