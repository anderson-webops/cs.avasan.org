<script lang="ts" setup>
import { storeToRefs } from "pinia";
import TutorProfile from "@/components/TutorProfile.vue";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const { currentTutor } = storeToRefs(app);
</script>

<template>
	<section class="teaching-page">
		<div class="teaching-frame">
			<header class="teaching-hero">
				<p class="teaching-eyebrow">Teaching workspace</p>
				<h1>Manage assigned learners.</h1>
				<p>
					Use this workspace for learner-facing operations that are
					not personal account settings. Course progress can be marked
					directly from the course workspace.
				</p>
			</header>

			<TutorProfile v-if="currentTutor" mode="teaching" />

			<div v-else class="teaching-empty">
				<h2>Sign in as a tutor</h2>
				<p>
					The teaching workspace is available after a tutor account is
					signed in.
				</p>
			</div>
		</div>
	</section>
</template>

<style scoped>
.teaching-page {
	margin: 0;
	padding: clamp(2.5rem, 5vw, 4.5rem) 1.25rem 4.5rem;
	background:
		radial-gradient(
			circle at 4% 0%,
			rgba(125, 211, 252, 0.22),
			transparent 40%
		),
		linear-gradient(160deg, #08111f 0%, #10213a 52%, #123b55 100%);
}

.teaching-frame {
	width: min(1180px, 100%);
	margin: 0 auto;
	display: grid;
	gap: 1rem;
}

.teaching-hero,
.teaching-empty {
	border: 1px solid rgba(191, 219, 254, 0.18);
	border-radius: 28px;
	background: rgba(15, 23, 42, 0.9);
	color: #e2e8f0;
	box-shadow: 0 28px 60px rgba(8, 15, 28, 0.32);
}

.teaching-hero {
	display: grid;
	gap: 0.7rem;
	padding: clamp(1.35rem, 3vw, 2rem);
}

.teaching-eyebrow {
	margin: 0;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.18em;
	text-transform: uppercase;
	color: #93c5fd;
}

.teaching-hero h1,
.teaching-empty h2 {
	margin: 0;
	color: #f8fbff;
}

.teaching-hero h1 {
	font-size: clamp(2rem, 4vw, 3rem);
	line-height: 1.02;
}

.teaching-hero p:last-child,
.teaching-empty p {
	margin: 0;
	max-width: 58rem;
	line-height: 1.65;
	color: #c7d6e8;
}

.teaching-empty {
	display: grid;
	gap: 0.7rem;
	padding: clamp(1.35rem, 3vw, 2rem);
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
