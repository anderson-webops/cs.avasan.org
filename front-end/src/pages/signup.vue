<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
	SCHEDULER_ORIGIN,
	schedulerEmbedMessageSource,
	schedulerEmbedResizeType,
	schedulerEmbedUrl,
	schedulerUrl
} from "@/modules/scheduler";

defineOptions({ name: "SignupPage" });

const MIN_FRAME_HEIGHT = 860;
const MAX_FRAME_HEIGHT = 2200;

const schedulerLoaded = ref(false);
const schedulerHeight = ref(MIN_FRAME_HEIGHT);

useHead({
	link: [
		{
			rel: "dns-prefetch",
			href: "//scheduler.classes.jacobdanderson.net"
		}
	]
});

function handleSchedulerMessage(event: MessageEvent) {
	if (event.origin !== SCHEDULER_ORIGIN) {
		return;
	}

	const payload = event.data;

	if (
		typeof payload !== "object" ||
		payload === null ||
		payload.source !== schedulerEmbedMessageSource ||
		payload.type !== schedulerEmbedResizeType ||
		typeof payload.height !== "number"
	) {
		return;
	}

	schedulerHeight.value = Math.max(
		MIN_FRAME_HEIGHT,
		Math.min(MAX_FRAME_HEIGHT, Math.ceil(payload.height))
	);
}

function markSchedulerLoaded() {
	schedulerLoaded.value = true;
}

onMounted(() => {
	window.addEventListener("message", handleSchedulerMessage);
});

onBeforeUnmount(() => {
	window.removeEventListener("message", handleSchedulerMessage);
});
</script>

<template>
	<section class="page-shell signup-page">
		<section class="intro">
			<p class="page-eyebrow">Schedule a Class</p>
			<h1 class="page-title">
				Book a Time &amp; Send the Context That Matters
			</h1>
			<p class="page-copy">
				Use the scheduler below to book a one-time or recurring
				50-minute class. Prefer email? Reach me at
				<a class="text-link" href="mailto:classes@jacobdanderson.net">
					classes@jacobdanderson.net
				</a>
				.
			</p>
		</section>

		<div class="scheduler-container site-surface">
			<div
				v-if="!schedulerLoaded"
				class="scheduler-loading"
				aria-live="polite"
			>
				<p class="scheduler-loading-kicker">Opening scheduler…</p>
				<div class="scheduler-loading-shell">
					<span class="shell-line is-short" />
					<span class="shell-line" />
					<span class="shell-line" />
					<span class="shell-panel" />
				</div>
			</div>

			<iframe
				class="scheduler-frame"
				:class="{ 'is-loaded': schedulerLoaded }"
				:src="schedulerEmbedUrl"
				title="Class scheduler"
				:style="{ height: `${schedulerHeight}px` }"
				loading="eager"
				@load="markSchedulerLoaded"
			/>

			<p class="scheduler-fallback">
				Trouble loading the scheduler?
				<a
					class="text-link"
					:href="schedulerUrl"
					rel="noopener"
					target="_blank"
				>
					Open it in a new tab.
				</a>
			</p>
		</div>

		<section
			aria-labelledby="after-booking-title"
			class="after-booking site-surface site-surface--soft"
		>
			<h2 id="after-booking-title" class="section-title">
				Before the First Class
			</h2>
			<p class="section-intro">
				You will receive the booking details by email. If you already
				have an assignment, repo link, screenshot, or project goal, send
				it ahead of time so class can start in the right place.
			</p>
			<RouterLink
				class="site-button site-button--secondary"
				to="/payment"
			>
				View Tuition Details
			</RouterLink>
		</section>
	</section>
</template>

<style scoped>
.signup-page {
	gap: clamp(2rem, 5vw, 3.25rem);
}

.intro {
	display: grid;
	gap: 1rem;
}

.scheduler-container {
	position: relative;
	padding: 1.5rem;
	overflow: hidden;
}

.scheduler-frame {
	display: block;
	width: 100%;
	border: 0;
	border-radius: 18px;
	background: white;
	opacity: 0.2;
	transition: opacity 0.25s ease;
}

.scheduler-frame.is-loaded {
	opacity: 1;
}

.scheduler-loading {
	position: absolute;
	inset: 1.5rem;
	z-index: 1;
	display: grid;
	align-content: center;
	justify-items: center;
	gap: 1rem;
	padding: 2.5rem;
	text-align: center;
	background:
		linear-gradient(
			180deg,
			rgba(250, 252, 255, 0.98),
			rgba(244, 248, 252, 0.95)
		),
		radial-gradient(
			circle at top left,
			rgba(58, 110, 165, 0.12),
			transparent 50%
		);
	border-radius: 18px;
	box-shadow: inset 0 0 0 1px rgba(58, 110, 165, 0.1);
}

.scheduler-loading-kicker {
	margin: 0;
	font-size: 1.05rem;
	font-weight: 700;
	color: #19314a;
}

.scheduler-loading-shell {
	display: grid;
	gap: 0.9rem;
	width: min(100%, 720px);
}

.shell-line,
.shell-panel {
	display: block;
	border-radius: var(--radius-pill);
	background: linear-gradient(
		90deg,
		rgba(220, 232, 245, 0.9),
		rgba(243, 248, 253, 1),
		rgba(220, 232, 245, 0.9)
	);
	background-size: 220% 100%;
	animation: scheduler-shell-shimmer 1.5s linear infinite;
}

.shell-line {
	height: 0.95rem;
}

.shell-line.is-short {
	width: 42%;
	justify-self: center;
}

.shell-panel {
	height: 560px;
	border-radius: 22px;
}

.scheduler-fallback {
	margin-top: 1.25rem;
	font-size: 0.95rem;
	color: var(--color-ink-soft);
	text-align: center;
}

.after-booking {
	display: grid;
	gap: 1rem;
	padding: clamp(1.4rem, 3vw, 1.9rem);
}

@keyframes scheduler-shell-shimmer {
	0% {
		background-position: 0% 50%;
	}

	100% {
		background-position: 220% 50%;
	}
}

@media (max-width: 640px) {
	.scheduler-container {
		padding: 1rem;
	}

	.scheduler-loading {
		inset: 1rem;
		padding: 1.5rem;
	}

	.shell-line.is-short {
		width: 70%;
	}

	.shell-panel {
		height: 420px;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
