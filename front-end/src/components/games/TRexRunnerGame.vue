<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { mountChromiumTrex } from "@/vendor/chromium-t-rex";

defineOptions({ name: "TRexRunnerGame" });

const runnerHost = ref<HTMLElement | null>(null);
const running = ref(false);
const announcement = ref("Loading T-Rex Runner.");
let cleanupRunner: (() => void) | null = null;

function loadGame() {
	cleanupRunner?.();
	cleanupRunner = null;
	if (!runnerHost.value) return;

	cleanupRunner = mountChromiumTrex(runnerHost.value, {
		className: "trex-frame",
		title: "T-Rex Runner game"
	});
	running.value = true;
	announcement.value =
		"T-Rex Runner loaded. Focus the game, then press Space or Up Arrow to start.";
}

function stopGame() {
	cleanupRunner?.();
	cleanupRunner = null;
	running.value = false;
	announcement.value = "T-Rex Runner stopped.";
}

onMounted(loadGame);

onBeforeUnmount(() => {
	cleanupRunner?.();
	cleanupRunner = null;
});
</script>

<template>
	<section class="trex-runner page-shell page-shell--wide">
		<header class="trex-intro">
			<RouterLink class="back-link" to="/games">← All games</RouterLink>
			<h1>T-Rex Runner</h1>
			<p>
				Run, jump, and duck through Chromium's classic offline dinosaur
				game. This faithful local port keeps the original gameplay, art,
				and sound on this site.
			</p>
		</header>

		<div class="site-surface game-panel">
			<div
				ref="runnerHost"
				aria-label="Embedded T-Rex Runner"
				class="runner-host"
			/>

			<div class="game-actions" aria-label="T-Rex Runner controls">
				<button
					v-if="running"
					class="site-button site-button--primary"
					type="button"
					@click="loadGame"
				>
					Restart game
				</button>
				<button
					v-if="running"
					class="site-button"
					type="button"
					@click="stopGame"
				>
					Stop game
				</button>
				<button
					v-else
					class="site-button site-button--primary"
					type="button"
					@click="loadGame"
				>
					Load game
				</button>
			</div>

			<p class="instructions">
				<strong>Controls:</strong> Press Space or Up Arrow to jump. Hold
				Down Arrow to duck. Press Enter after a crash to play again. On
				a touchscreen, tap the game to jump. The Slow speed switch
				inside the game makes obstacles easier to follow.
			</p>
			<p class="motion-note">
				The runner stays stopped until you choose to start it. Use
				<strong>Stop game</strong> whenever you want all game motion to
				end.
			</p>
			<p class="sr-only" aria-live="polite">{{ announcement }}</p>
		</div>

		<footer class="attribution">
			<p>
				Gameplay and assets are adapted from the
				<a
					href="https://chromium.googlesource.com/chromium/src/+/ff37cfca210138f2a40b843b4a8195ab7e4fc7ff/components/neterror/resources/dino_game/"
					rel="noopener noreferrer"
					target="_blank"
				>
					Chromium open-source offline dinosaur game</a
				>. See the
				<a href="/licenses/chromium-bsd-license.txt"
					>Chromium BSD license</a
				>. This site is not affiliated with or endorsed by Google.
			</p>
		</footer>
	</section>
</template>

<style scoped>
.trex-runner {
	display: grid;
	gap: clamp(1rem, 3vw, 1.5rem);
	padding-block: clamp(1.5rem, 4vw, 3rem);
}

.trex-intro {
	display: grid;
	max-width: 54rem;
	gap: 0.55rem;
}

.trex-intro h1 {
	font-size: clamp(2rem, 6vw, 3.7rem);
}

.trex-intro p,
.instructions,
.motion-note,
.attribution {
	color: var(--color-ink-soft);
}

.back-link {
	width: fit-content;
	color: var(--color-link);
	font-weight: 800;
	text-decoration: none;
}

.back-link:hover,
.back-link:focus-visible {
	text-decoration: underline;
}

.game-panel {
	display: grid;
	gap: 1rem;
	padding: clamp(1rem, 3vw, 1.5rem);
}

.runner-host {
	height: clamp(20rem, 54vw, 32rem);
	overflow: hidden;
	border: 1px solid rgba(71, 85, 105, 0.28);
	border-radius: 0.9rem;
	background: #f7f7f7;
}

.runner-host :deep(.trex-frame) {
	display: block;
	width: 100%;
	height: clamp(20rem, 54vw, 32rem);
	border: 0;
	background: #f7f7f7;
}

.game-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.site-button {
	min-height: 2.75rem;
	padding: 0.7rem 1rem;
	border: 1px solid var(--color-border);
	border-radius: 0.8rem;
	background: var(--color-surface);
	color: var(--color-ink);
	font: inherit;
	font-weight: 800;
	cursor: pointer;
}

.site-button--primary {
	border-color: #0f766e;
	background: #0f766e;
	color: #fff;
}

.site-button:hover {
	box-shadow: var(--shadow-soft);
}

.site-button:focus-visible,
.back-link:focus-visible,
.attribution a:focus-visible {
	outline: 3px solid var(--focus-ring-color);
	outline-offset: 3px;
}

.instructions,
.motion-note,
.attribution p {
	max-width: 68rem;
}

.attribution {
	font-size: 0.82rem;
}

.attribution a {
	color: inherit;
}

@media (max-width: 540px) {
	.runner-host,
	.runner-host :deep(.trex-frame) {
		height: 25rem;
	}

	.game-actions {
		display: grid;
	}
}
</style>
