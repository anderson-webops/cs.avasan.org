<script setup lang="ts">
defineOptions({ name: "ZellePaymentPage" });
</script>

<template>
	<section class="zelle-page">
		<header class="hero">
			<h1>Pay with Zelle</h1>
			<p>
				Use the email below in your bank’s Zelle flow. If you want to
				double-check before sending, email me and I’ll confirm the
				details.
			</p>
		</header>

		<div class="zelle-card">
			<img
				alt="Zelle payment email for Classes with Jacob"
				class="zelle-image"
				src="../assets/Images/Zelle_Email.jpeg"
				width="300"
			/>

			<div class="zelle-copy">
				<p class="eyebrow">Zelle Contact</p>
				<p class="zelle-email">classes@jacobdanderson.net</p>
				<p class="zelle-note">
					If your bank app asks for the recipient email, use the
					classes address shown above.
				</p>
			</div>

			<div class="actions">
				<RouterLink class="cta" to="/payment">
					Back to Tuition &amp; Payment
				</RouterLink>
				<a class="cta ghost" href="mailto:classes@jacobdanderson.net">
					Email Jacob
				</a>
			</div>
		</div>
	</section>
</template>

<style scoped>
.zelle-page {
	padding: 2.5rem 1.5rem 4rem;
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	align-items: center;
	color: #16202a;
}

.hero,
.zelle-card {
	width: 100%;
	max-width: 760px;
}

.hero {
	display: grid;
	gap: 1rem;
	text-align: center;
}

.hero h1 {
	margin: 0;
	font-size: clamp(2rem, 3.8vw, 2.8rem);
}

.hero p,
.zelle-note {
	margin: 0;
	line-height: 1.6;
	color: #2d3f55;
}

.zelle-card {
	display: grid;
	gap: 1.5rem;
	justify-items: center;
	padding: 2rem;
	border-radius: 28px;
	background: white;
	box-shadow: 0 18px 40px rgba(16, 42, 66, 0.08);
	text-align: center;
}

.zelle-image {
	max-width: min(100%, 320px);
	height: auto;
	display: block;
	border-radius: 24px;
	box-shadow: 0 12px 28px rgba(13, 38, 63, 0.12);
}

.zelle-copy {
	display: grid;
	gap: 0.75rem;
}

.eyebrow {
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 0.18em;
	font-size: 0.8rem;
	font-weight: 700;
	color: #3a6ea5;
}

.zelle-email {
	margin: 0;
	font-size: clamp(1.25rem, 3vw, 1.7rem);
	font-weight: 700;
	color: #10263a;
	word-break: break-word;
}

.actions {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;
}

.cta {
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
	border: 2px solid transparent;
}

.cta:hover {
	background-color: #2d5c8a;
	transform: translateY(-2px);
}

.cta.ghost {
	background-color: white;
	border-color: #3a6ea5;
	color: #3a6ea5;
}

.cta.ghost:hover {
	background-color: #e9f2fb;
}

@media (max-width: 640px) {
	.zelle-page {
		padding: 2rem 1.25rem 3rem;
	}

	.zelle-card {
		padding: 1.5rem;
	}

	.actions {
		flex-direction: column;
		width: 100%;
	}

	.actions > * {
		width: 100%;
	}
}
</style>

<route lang="yaml">
  meta:
    layout: default</route>
