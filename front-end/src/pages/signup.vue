<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
	SCHEDULER_ORIGIN,
	legacyCalendlyUrl,
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
		},
		{
			rel: "preconnect",
			href: SCHEDULER_ORIGIN
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
	<section class="Signup">
		<section class="intro">
			<h1>Schedule a Class</h1>
			<p>
				Choose a one-time or recurring 50-minute session below. Prefer
				email? Reach me at
				<a href="mailto:classes@jacobdanderson.net"
					>classes@jacobdanderson.net</a
				>.
			</p>
			<div class="transition-banner" role="note">
				<p>
					Calendly is being phased out and will be retired on
					April 30, 2026. If you prefer it, you can still use it until
					then.
				</p>
				<a
					class="transition-banner-link"
					:href="legacyCalendlyUrl"
					rel="noopener"
					target="_blank"
				>
					Use Calendly Instead
				</a>
			</div>
		</section>

		<div class="scheduler-container">
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
				<a
					class="scheduler-direct-link"
					:href="schedulerUrl"
					rel="noopener"
					target="_blank"
				>
					Open Scheduler in a New Tab
				</a>
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
				If the scheduler is slow to appear, open it directly:
				<a :href="schedulerUrl" rel="noopener" target="_blank">
					{{ schedulerUrl }}
				</a>
			</p>
		</div>

		<section
			aria-labelledby="after-booking-title"
			class="after-booking d-grid"
		>
			<h2 id="after-booking-title">After You Book</h2>
			<ol>
				<li>
					I’ll send a confirmation or follow-up within one business
					day.
				</li>
				<li>
					Before our first meeting, we’ll outline goals, tools, and
					any materials needed for class.
				</li>
				<li>
					Payment is due only after class. The tuition page covers the
					details.
				</li>
			</ol>
			<RouterLink class="cta" to="/payment"
				>View Tuition Details</RouterLink
			>
		</section>
	</section>
</template>

<style scoped>
.Signup {
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
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

.intro a {
	color: #3a6ea5;
	font-weight: 600;
	text-decoration: none;
}

.intro a:hover {
	text-decoration: underline;
}

.transition-banner {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.85rem 1rem;
	padding: 0.95rem 1.1rem;
	border-radius: 18px;
	background: linear-gradient(135deg, #fff7e8, #fffdf7);
	box-shadow: inset 0 0 0 1px rgba(201, 150, 51, 0.28);
	text-align: left;
}

.transition-banner p {
	margin: 0;
	flex: 1 1 420px;
	color: #6a4a13;
	font-size: 0.98rem;
	line-height: 1.5;
}

.transition-banner-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.75rem 1.15rem;
	border-radius: 999px;
	background: #fff;
	color: #8f5b00;
	font-weight: 700;
	text-decoration: none;
	box-shadow: inset 0 0 0 1px rgba(201, 150, 51, 0.35);
	white-space: nowrap;
}

.transition-banner-link:hover {
	background: #fff8eb;
	text-decoration: none;
}

.scheduler-container {
	position: relative;
	background: white;
	border-radius: 28px;
	padding: 1.5rem;
	box-shadow: 0 18px 40px rgba(16, 42, 66, 0.08);
	max-width: 960px;
	width: 100%;
	overflow: hidden;
}

.scheduler-frame {
	display: block;
	width: 100%;
	border: 0;
	border-radius: 22px;
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
	border-radius: 20px;
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
	border-radius: 999px;
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
	border-radius: 28px;
}

.scheduler-direct-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.35rem;
	border-radius: 999px;
	background: #3a6ea5;
	color: white;
	font-weight: 600;
	text-decoration: none;
}

.scheduler-direct-link:hover {
	background: #2d5c8a;
}

.scheduler-fallback {
	margin-top: 1.25rem;
	font-size: 0.95rem;
	color: #2d3f55;
	text-align: center;
}

.scheduler-fallback a {
	color: #3a6ea5;
	font-weight: 600;
	text-decoration: none;
}

.scheduler-fallback a:hover {
	text-decoration: underline;
}

.intro,
.after-booking {
	display: grid;
	max-width: 960px;
	margin: 0;
	text-align: center;
	gap: 1rem;
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

@keyframes scheduler-shell-shimmer {
	0% {
		background-position: 0% 50%;
	}

	100% {
		background-position: 220% 50%;
	}
}

@media (max-width: 640px) {
	.Signup {
		padding: 2rem 1.25rem 3rem;
	}

	.transition-banner {
		text-align: center;
	}

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

<route lang="json">
{
	"meta": {
		"layout": "default"
	}
}
</route>
