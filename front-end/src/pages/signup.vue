<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
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

const calendlyInlineWidget = ref<HTMLDivElement | null>(null);
const calendlyState = ref<"loading" | "ready" | "error">("loading");

let calendlyObserver: MutationObserver | null = null;
let calendlyReadyTimeout: number | undefined;

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

onMounted(async () => {
	warmCalendlyConnections();
	await nextTick();
	watchCalendlyIframe();

	try {
		if (!calendlyInlineWidget.value) {
			return;
		}

		await mountCalendlyInlineWidget(calendlyInlineWidget.value);
		watchCalendlyIframe();
	} catch {
		calendlyState.value = "error";
	}
});

onBeforeUnmount(() => {
	calendlyObserver?.disconnect();

	if (calendlyReadyTimeout) {
		window.clearTimeout(calendlyReadyTimeout);
	}
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
					<a href="mailto:classes@jacobdanderson.net"
						>classes@jacobdanderson.net</a
					>.
				</li>
			</ul>
		</section>

		<div class="calendly-container">
			<div class="calendly-stage" :class="`is-${calendlyState}`">
				<div
					v-if="calendlyState !== 'ready'"
					class="calendly-loading"
					aria-live="polite"
				>
					<p class="calendly-loading-kicker">
						{{
							calendlyState === "error"
								? "Having trouble loading the scheduler"
								: "Opening scheduler..."
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
						Open Calendly directly
					</a>
				</div>

				<div
					ref="calendlyInlineWidget"
					class="calendly-inline-widget"
					:data-url="calendlyEmbedUrl"
				/>
			</div>
			<p class="calendly-fallback">
				If the scheduler is slow to appear, use the direct Calendly
				link:
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

.calendly-stage {
	position: relative;
	min-height: 900px;
}

.calendly-inline-widget {
	box-sizing: border-box;
	min-height: 900px;
	transition: opacity 0.25s ease;
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
