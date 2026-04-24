<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

defineOptions({ name: "WheelPage" });

const isWheelLoaded = ref(false);
const wheelUrl =
	"https://wheeldecide.com/e.php?c1=lies&c2=lier&c3=lies&c4=frog&c5=lier&c6=lies&c7=lier&c8=lies&c9=lier&c10=frog&c11=lies&c12=lier&c13=lies&c14=lier&c15=frog&t=Sophia%27s+Wheel&time=5";

onMounted(() => {
	document.body.classList.add("wheel-mode");
});

onBeforeUnmount(() => {
	document.body.classList.remove("wheel-mode");
});
</script>

<template>
	<section class="WheelPage" aria-label="Sophia's Wheel">
		<div class="wheel-panel">
			<div class="wheel-heading">
				<p>Class picker</p>
				<h1>Sophia's Wheel</h1>
			</div>
			<div class="wheel-frame" :class="{ 'is-loaded': isWheelLoaded }">
				<div v-if="!isWheelLoaded" class="wheel-loading">
					<span>Opening wheel...</span>
				</div>
				<iframe
					title="Sophia's Wheel"
					:src="wheelUrl"
					width="500"
					height="500"
					scrolling="no"
					frameborder="0"
					@load="isWheelLoaded = true"
				>
				</iframe>
			</div>
			<a
				class="wheel-link"
				:href="wheelUrl"
				rel="noopener"
				target="_blank"
			>
				Open wheel in new tab
			</a>
		</div>
	</section>
</template>

<style scoped>
:global(body.wheel-mode) {
	background-color: #000;
	color: #fff;
}

.WheelPage {
	margin: 0;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background:
		radial-gradient(
			circle at 50% 5%,
			rgba(59, 130, 246, 0.22),
			transparent 34rem
		),
		#000;
	padding: clamp(1rem, 3vw, 2.5rem);
	overflow: auto;
}

.wheel-panel {
	width: min(100%, 680px);
	display: grid;
	justify-items: center;
	gap: clamp(0.9rem, 2.4vw, 1.35rem);
	color: #f8fafc;
}

.wheel-heading {
	display: grid;
	gap: 0.35rem;
	text-align: center;
}

.wheel-heading p {
	margin: 0;
	font-size: 0.78rem;
	font-weight: 800;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: #bfdbfe;
}

.wheel-heading h1 {
	margin: 0;
	color: #f8fafc;
	font-size: clamp(2rem, 6vw, 3.6rem);
	text-shadow: 0 18px 40px rgba(37, 99, 235, 0.38);
}

.wheel-frame {
	position: relative;
	width: min(82vh, 88vw, 560px);
	aspect-ratio: 1;
	overflow: hidden;
	border-radius: 28px;
	background:
		linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(30, 64, 175, 0.8)),
		#0f172a;
	border: 1px solid rgba(191, 219, 254, 0.28);
	box-shadow:
		0 34px 90px -42px rgba(37, 99, 235, 0.72),
		inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

.wheel-frame iframe {
	width: 100%;
	height: 100%;
	border: 0;
	display: block;
	opacity: 0;
	transition: opacity 0.18s ease;
	background: #f8fafc;
}

.wheel-frame.is-loaded iframe {
	opacity: 1;
}

.wheel-loading {
	position: absolute;
	inset: 0;
	z-index: 1;
	display: grid;
	place-items: center;
	padding: 2rem;
	text-align: center;
	background:
		radial-gradient(
			circle at 50% 45%,
			rgba(96, 165, 250, 0.22),
			transparent 17rem
		),
		linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(30, 64, 175, 0.86));
	color: #dbeafe;
	font-weight: 800;
	letter-spacing: 0.04em;
}

.wheel-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2.75rem;
	padding: 0.7rem 1.25rem;
	border-radius: 999px;
	color: #dbeafe;
	background: rgba(15, 23, 42, 0.72);
	border: 1px solid rgba(191, 219, 254, 0.26);
	text-decoration: none;
	font-weight: 700;
	box-shadow: 0 22px 44px -32px rgba(37, 99, 235, 0.68);
}

@media (max-width: 600px) {
	.wheel-frame {
		width: min(92vw, 480px);
	}
}
</style>

<route lang="yaml">
meta:
    layout: blank
</route>
