<script lang="ts" setup>
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch
} from "vue";
import {
	CALENDLY_ASSET_ORIGIN,
	CALENDLY_ORIGIN,
	calendlyEmbedUrl,
	calendlyScriptSrc,
	calendlyUrl,
	mountCalendlyInlineWidget,
	warmCalendlyConnections
} from "@/modules/calendly";

defineOptions({ name: "SignupPage" });

const INLINE_CALENDLY_MIN_WIDTH = 860;

const calendlyContainer = ref<HTMLDivElement | null>(null);
const calendlyInlineWidget = ref<HTMLDivElement | null>(null);
const calendlyState = ref<"loading" | "ready" | "error">("loading");
const calendlyDisplayMode = ref<"inline" | "compact">("inline");
const showInlineCalendly = computed(
	() => calendlyDisplayMode.value === "inline"
);

let calendlyObserver: MutationObserver | null = null;
let calendlyReadyTimeout: number | undefined;
let calendlyResizeObserver: ResizeObserver | null = null;

useHead({
	link: [
		{
			rel: "dns-prefetch",
			href: "//calendly.com"
		},
		{
			rel: "dns-prefetch",
			href: "//assets.calendly.com"
		},
		{
			rel: "preconnect",
			href: CALENDLY_ORIGIN
		},
		{
			rel: "preconnect",
			href: CALENDLY_ASSET_ORIGIN,
			crossorigin: "anonymous"
		},
		{
			rel: "preload",
			href: calendlyScriptSrc,
			as: "script",
			crossorigin: "anonymous"
		}
	]
});

function markCalendlyReady() {
	if (calendlyState.value !== "error") {
		calendlyState.value = "ready";
	}
}

function attachCalendlyIframeWatcher() {
	const iframe = calendlyInlineWidget.value?.querySelector("iframe");

	if (!iframe) {
		return false;
	}

	if (calendlyReadyTimeout) {
		window.clearTimeout(calendlyReadyTimeout);
	}

	if (iframe.dataset.calendlyObserved === "true") {
		return true;
	}

	iframe.dataset.calendlyObserved = "true";
	iframe.addEventListener("load", markCalendlyReady, { once: true });
	calendlyReadyTimeout = window.setTimeout(markCalendlyReady, 1800);
	return true;
}

function watchCalendlyIframe() {
	if (attachCalendlyIframeWatcher() || !calendlyInlineWidget.value) {
		return;
	}

	calendlyObserver?.disconnect();
	calendlyObserver = new MutationObserver(() => {
		if (attachCalendlyIframeWatcher()) {
			calendlyObserver?.disconnect();
		}
	});

	calendlyObserver.observe(calendlyInlineWidget.value, {
		childList: true,
		subtree: true
	});
}

function clearCalendlyReadyTimeout() {
	if (calendlyReadyTimeout) {
		window.clearTimeout(calendlyReadyTimeout);
		calendlyReadyTimeout = undefined;
	}
}

function resetCalendlyEmbed() {
	calendlyObserver?.disconnect();
	clearCalendlyReadyTimeout();
	calendlyInlineWidget.value?.replaceChildren();
}

function updateCalendlyDisplayMode() {
	const width = calendlyContainer.value?.clientWidth ?? window.innerWidth;
	calendlyDisplayMode.value =
		width >= INLINE_CALENDLY_MIN_WIDTH ? "inline" : "compact";
}

async function mountInlineCalendlyWidget() {
	if (!calendlyInlineWidget.value) {
		return;
	}

	calendlyState.value = "loading";
	watchCalendlyIframe();

	try {
		await mountCalendlyInlineWidget(calendlyInlineWidget.value);
		watchCalendlyIframe();
	} catch {
		calendlyState.value = "error";
	}
}

watch(calendlyDisplayMode, async mode => {
	if (mode === "compact") {
		resetCalendlyEmbed();
		return;
	}

	await nextTick();
	await mountInlineCalendlyWidget();
});

onMounted(async () => {
	warmCalendlyConnections();
	await nextTick();

	updateCalendlyDisplayMode();

	if (typeof ResizeObserver !== "undefined" && calendlyContainer.value) {
		calendlyResizeObserver = new ResizeObserver(() => {
			updateCalendlyDisplayMode();
		});
		calendlyResizeObserver.observe(calendlyContainer.value);
	}

	if (calendlyDisplayMode.value === "inline") {
		await mountInlineCalendlyWidget();
	}
});

onBeforeUnmount(() => {
	calendlyResizeObserver?.disconnect();
	resetCalendlyEmbed();
});
</script>

<template>
	<section class="Signup">
		<section class="intro">
			<h1>Schedule a Class</h1>
			<p>
				Use Calendly to choose a time that works for you. Share a few
				notes about the learner and the topics you want to cover so I
				can prepare before we meet.
			</p>
			<ul>
				<li>
					Sessions are 50 minutes with a built-in buffer for wrap-up
					questions.
				</li>
				<li>
					Need a recurring time? Book the first session and we can set
					up the rest together.
				</li>
				<li>
					Prefer email? Reach me at
					<a href="mailto:classes@jacobdanderson.net"
						>classes@jacobdanderson.net</a
					>.
				</li>
			</ul>
		</section>

		<div ref="calendlyContainer" class="calendly-container">
			<div
				v-if="showInlineCalendly"
				class="calendly-stage"
				:class="`is-${calendlyState}`"
			>
				<div
					v-if="calendlyState !== 'ready'"
					class="calendly-loading"
					aria-live="polite"
				>
					<p class="calendly-loading-kicker">
						{{
							calendlyState === "error"
								? "Trouble loading the scheduler"
								: "Opening scheduler…"
						}}
					</p>
					<div class="calendly-loading-shell">
						<span class="shell-line is-short" />
						<span class="shell-line" />
						<span class="shell-line" />
						<span class="shell-panel" />
					</div>
					<a
						class="calendly-direct-link"
						:href="calendlyUrl"
						rel="noopener"
						target="_blank"
					>
						Open Calendly in a New Tab
					</a>
				</div>

				<div
					ref="calendlyInlineWidget"
					class="calendly-inline-widget"
					:data-url="calendlyEmbedUrl"
				/>
			</div>
			<div v-else class="calendly-compact">
				<p class="calendly-loading-kicker">
					Open the scheduler in a new tab
				</p>
				<p class="calendly-compact-copy">
					The inline scheduler works best on wider viewports. On
					narrower windows, opening Calendly directly gives you the
					full booking experience without clipping.
				</p>
				<a
					class="calendly-direct-link"
					:href="calendlyUrl"
					rel="noopener"
					target="_blank"
				>
					Open Calendly
				</a>
			</div>
			<p class="calendly-fallback">
				If the scheduler is slow to appear, open Calendly directly:
				<a :href="calendlyUrl" rel="noopener" target="_blank">
					{{ calendlyUrl }}
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

.calendly-stage {
	position: relative;
	min-height: clamp(700px, 82vh, 860px);
}

.calendly-inline-widget {
	box-sizing: border-box;
	min-height: clamp(700px, 82vh, 860px);
	transition: opacity 0.25s ease;
}

.calendly-inline-widget:deep(iframe) {
	width: 100%;
	min-height: inherit;
	border-radius: 20px;
}

.calendly-loading {
	position: absolute;
	inset: 0;
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

.calendly-loading-kicker {
	margin: 0;
	font-size: 1.05rem;
	font-weight: 700;
	color: #19314a;
}

.calendly-loading-shell {
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
	animation: calendly-shell-shimmer 1.5s linear infinite;
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

.calendly-direct-link {
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

.calendly-direct-link:hover {
	background: #2d5c8a;
}

.calendly-compact {
	display: grid;
	justify-items: center;
	gap: 1rem;
	padding: clamp(2rem, 4vw, 3rem);
	text-align: center;
	border-radius: 22px;
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
	box-shadow: inset 0 0 0 1px rgba(58, 110, 165, 0.1);
}

.calendly-compact-copy {
	max-width: 40rem;
	margin: 0;
	line-height: 1.65;
	color: #405467;
}

.calendly-stage.is-ready .calendly-inline-widget {
	opacity: 1;
}

.calendly-stage.is-loading .calendly-inline-widget,
.calendly-stage.is-error .calendly-inline-widget {
	opacity: 0.18;
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
	display: grid;
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

@keyframes calendly-shell-shimmer {
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

	.calendly-container {
		padding: 1rem;
	}

	.calendly-stage,
	.calendly-inline-widget {
		min-height: 640px;
	}

	.calendly-loading {
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
