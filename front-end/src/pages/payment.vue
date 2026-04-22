<script lang="ts" setup>
import { warmSchedulerConnections } from "@/modules/scheduler";
import { useContentStore } from "@/stores/content";

defineOptions({ name: "SupportUsPage" });
const content = useContentStore();

useHead(
	() =>
		({
			title: "Tuition & Payment",
			meta: [
				{
					name: "description",
					content:
						"Tuition, payment methods, and common scheduling questions for private classes with Jacob Anderson."
				}
			],
			link: [
				{
					rel: "canonical",
					href: "https://classes.jacobdanderson.net/payment"
				}
			],
			script: [
				{
					innerHTML: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "FAQPage",
						mainEntity: content.faqs.map(faq => ({
							"@type": "Question",
							acceptedAnswer: {
								"@type": "Answer",
								text: faq.answer
							},
							name: faq.question
						}))
					}),
					key: "tuition-faq-jsonld",
					type: "application/ld+json"
				}
			]
		}) as any
);
</script>

<template>
	<section class="page-shell payment-page">
		<div class="payment-hero">
			<p class="page-eyebrow">Tuition &amp; Payment</p>
			<h1 class="page-title">
				Straightforward Pricing for Private Classes
			</h1>
			<p class="page-copy">
				Private one-on-one sessions are $40 for 50 minutes.
			</p>
			<div class="tuition-card">
				<div class="rate">
					<span class="amount">$40</span>
					<span class="details">Per Session • 50 Minutes</span>
				</div>
				<ul>
					<li>One learner at a time</li>
					<li>Book one-time or recurring sessions</li>
					<li>Pay after completed classes</li>
				</ul>
			</div>
		</div>

		<section
			aria-labelledby="payment-title"
			class="payment-section site-surface site-surface--soft"
		>
			<h2 id="payment-title" class="section-title">How to Pay</h2>
			<p class="section-intro">Use Venmo or Zelle for most payments.</p>
			<div class="site-action-row">
				<a
					class="site-button site-button--primary"
					href="https://www.venmo.com/u/jacoba1100254352-classes"
					rel="noreferrer"
					target="_blank"
				>
					Open Venmo
				</a>
				<RouterLink
					class="site-button site-button--secondary"
					to="/zelle"
				>
					Pay with Zelle
				</RouterLink>
			</div>
			<div class="note">
				<p>
					Need Cash App, Apple Cash, or a mailed check instead? Email
					<a
						class="text-link"
						href="mailto:classes@jacobdanderson.net"
					>
						classes@jacobdanderson.net
					</a>
					.
				</p>
			</div>
		</section>

		<section aria-labelledby="faq-title" class="faq-section">
			<h2 id="faq-title" class="section-title">Common Questions</h2>
			<div id="faqAccordion" class="accordion">
				<div
					v-for="(faq, i) in content.faqs"
					:key="i"
					class="accordion-item"
				>
					<h2 :id="`faq${i}-heading`" class="accordion-header">
						<button
							class="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							:data-bs-target="`#faq${i}`"
							:aria-expanded="false"
							:aria-controls="`faq${i}`"
						>
							{{ faq.question }}
						</button>
					</h2>
					<div
						:id="`faq${i}`"
						class="accordion-collapse collapse"
						:class="{ show: false }"
						:aria-labelledby="`faq${i}-heading`"
						data-bs-parent="#faqAccordion"
					>
						<div class="accordion-body">
							{{ faq.answer }}
						</div>
					</div>
				</div>
			</div>
		</section>

		<section
			aria-labelledby="schedule-title"
			class="schedule-section site-surface"
		>
			<h2 id="schedule-title" class="section-title">
				Ready to Schedule?
			</h2>
			<p class="section-intro">
				Use the scheduler to book a time, or email if you need help
				choosing a recurring slot.
			</p>
			<div class="site-action-row">
				<RouterLink
					class="site-button site-button--primary"
					to="/signup"
					@focus="warmSchedulerConnections"
					@mouseenter="warmSchedulerConnections"
					@touchstart.passive="warmSchedulerConnections"
				>
					Open Scheduler
				</RouterLink>
				<a
					class="site-button site-button--secondary"
					href="mailto:classes@jacobdanderson.net"
				>
					Email Jacob
				</a>
			</div>
		</section>
	</section>
</template>

<style scoped>
.payment-page {
	gap: clamp(2rem, 5vw, 3.5rem);
}

.payment-hero {
	display: grid;
	gap: 1.5rem;
}

.tuition-card {
	padding: 2rem;
	border-radius: 22px;
	background: linear-gradient(135deg, #1f3d5a, #3a6ea5);
	color: white;
	display: grid;
	gap: 1.25rem;
	max-width: 32rem;
	box-shadow: 0 24px 50px -26px rgba(13, 38, 63, 0.42);
}

.rate {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	align-items: center;
}

.amount {
	font-size: clamp(2.5rem, 5vw, 3.5rem);
	font-weight: 700;
}

.details {
	font-size: 0.95rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.tuition-card ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 0.75rem;
	text-align: left;
	font-size: 1rem;
}

.payment-section,
.schedule-section {
	display: grid;
	gap: 1rem;
	padding: clamp(1.5rem, 3vw, 2rem);
}

.faq-section {
	display: grid;
	gap: 1.25rem;
}

.note {
	padding: 1rem 1.1rem;
	border-radius: 16px;
	background: rgba(31, 92, 145, 0.06);
	border: 1px solid rgba(31, 92, 145, 0.1);
}

.faq-section {
	text-align: left;
}

.accordion-item {
	border-radius: 16px;
	border: 1px solid var(--color-border);
	overflow: hidden;
	margin-bottom: 0.85rem;
	background: rgba(255, 255, 255, 0.82);
}

.accordion-button {
	font-weight: 700;
}

.accordion-button:not(.collapsed) {
	color: var(--color-ink);
	background: rgba(31, 92, 145, 0.08);
	box-shadow: none;
}

.accordion-body {
	color: var(--color-ink-soft);
	line-height: 1.7;
}

@media (max-width: 600px) {
	.tuition-card {
		padding: 1.75rem 1.5rem;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
