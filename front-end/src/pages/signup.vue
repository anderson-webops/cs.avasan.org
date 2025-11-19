<script lang="ts" setup>
import { onMounted } from "vue";

defineOptions({ name: "SignupPage" });

const calendlyUrl = "https://calendly.com/jacoba1100254352";

onMounted(() => {
	if (document.querySelector('script[data-calendly="true"]')) {
		return;
	}

	const script = document.createElement("script");
	script.src = "https://assets.calendly.com/assets/external/widget.js";
	script.async = true;
	script.setAttribute("data-calendly", "true");
	document.body.append(script);
});
</script>

<template>
	<section class="Signup">
		<section class="intro">
			<h1>Schedule a Class</h1>
			<p>
				Use Calendly to choose a time that works for you. Share a few
				notes about the learner and the topics you’d like to cover so I
				can tailor the session in advance.
			</p>
			<br />
			<ul>
				<li>
					Sessions are 50 minutes with an optional 10-minute buffer.
				</li>
				<li>
					Need a recurring spot? Book the first meeting and we’ll lock
					in the rest together.
				</li>
				<li>
					Prefer to coordinate by email? Reach me at
					<!--					<a href="mailto:jacob@jacobdanderson.net" -->
					<!--						>jacob@jacobdanderson.net</a -->
					<!--					>. -->
					<a href="mailto:bascule-skaters0n@icloud.com"
						>bascule-skaters0n@icloud.com</a
					>.
				</li>
			</ul>
		</section>

		<div class="calendly-container">
			<div
				class="calendly-inline-widget"
				:data-url="`${calendlyUrl}?hide_gdpr_banner=1`"
				style="height: 900px"
			/>
			<p class="calendly-fallback">
				If the scheduler doesn’t load, use the direct Calendly link:
				<a :href="calendlyUrl" rel="noopener" target="_blank">
					{{ calendlyUrl }}
				</a>
			</p>
		</div>

		<section
			aria-labelledby="after-booking-title"
			class="after-booking d-grid"
		>
			<h2 id="after-booking-title">After you book</h2>
			<ol>
				<li>I’ll send a welcome email within one business day.</li>
				<li>
					Before our first meeting we’ll outline goals, tools, and any
					materials needed for class.
				</li>
				<li>
					Payment is due only after class—see the tuition page for
					details.
				</li>
			</ol>
			<RouterLink class="cta" to="/payment"
				>View tuition details</RouterLink
			>
		</section>
	</section>
</template>

<style scoped>
.Signup {
	display: flex;
	flex-direction: column;
	gap: 3rem;
	padding: 2.5rem 1.5rem 4rem;
	color: #16202a;
	align-items: center;
}

.intro h1 {
	font-size: clamp(2rem, 3.5vw, 2.75rem);
}

.intro p {
	margin: 0;
	line-height: 1.6;
	color: #2d3f55;
	font-size: 1.05rem;
}

.intro ul {
	list-style: none;
	margin: 0;
	gap: 0.75rem;
	text-align: left;
	color: #1f3d5a;
	background: #f4f8fc;
	border-radius: 20px;
	padding: 1.5rem 1.75rem;
	box-shadow: inset 0 0 0 1px #dbe9f8;
	font-size: 1rem;
}

.intro a {
	color: #3a6ea5;
	font-weight: 600;
	text-decoration: none;
}

.intro a:hover {
	text-decoration: underline;
}

.calendly-container {
	background: white;
	border-radius: 28px;
	padding: 1.5rem;
	box-shadow: 0 18px 40px rgba(16, 42, 66, 0.08);
	max-width: 960px;
	width: 100%;

	overflow-x: auto;
}

.calendly-inline-widget {
	box-sizing: border-box;
}

.calendly-fallback {
	margin-top: 1.25rem;
	font-size: 0.95rem;
	color: #2d3f55;
	text-align: center;
}

.calendly-fallback a {
	color: #3a6ea5;
	font-weight: 600;
	text-decoration: none;
}

.calendly-fallback a:hover {
	text-decoration: underline;
}

.intro,
.after-booking {
	max-width: 720px;
	margin: 0;
	text-align: center;
	gap: 1.25rem;
}

.after-booking h2 {
	font-size: clamp(1.8rem, 3vw, 2.3rem);
}

.after-booking ol {
	margin: 0;
	padding-left: 1.25rem;
	text-align: left;
	line-height: 1.6;
	color: #2d3f55;
}

.cta {
	justify-self: center;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.5rem;
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

@media (max-width: 640px) {
	.Signup {
		padding: 2rem 1.25rem 3rem;
	}

	.calendly-container {
		padding: 1rem;
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
