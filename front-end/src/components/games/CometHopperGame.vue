<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type GamePhase = "finished" | "idle" | "paused" | "playing";
type ObstacleKind = "moon-rock" | "orbiting-seed";

interface TrailObstacle {
	height: number;
	kind: ObstacleKind;
	width: number;
	x: number;
	y: number;
}

const CANVAS_WIDTH = 840;
const CANVAS_HEIGHT = 420;
const GROUND_Y = 336;
const COMET_X = 106;
const STANDING_HEIGHT = 54;
const DUCKING_HEIGHT = 31;
const REDUCED_STEP_DISTANCE = 56;

const canvas = ref<HTMLCanvasElement | null>(null);
const phase = ref<GamePhase>("idle");
const score = ref(0);
const sessionBest = ref(0);
const ducking = ref(false);
const reducedMotion = ref(false);
const reducedPose = ref<"duck" | "hop" | "stand">("stand");
const announcement = ref(
	"Choose Start trail, then hop over moon rocks and duck under orbiting seeds."
);

const obstacles: TrailObstacle[] = [];
let cometBottom = GROUND_Y;
let verticalSpeed = 0;
let animationFrame = 0;
let lastFrame = 0;
let distance = 0;
let spawnClock = 1.4;
let obstacleNumber = 0;

const phaseLabel = computed(() => {
	if (reducedMotion.value && phase.value === "playing") return "Your turn";
	if (phase.value === "playing") return "On the trail";
	if (phase.value === "paused") return "Paused";
	if (phase.value === "finished") return "Trail ended";
	return "Ready";
});

const primaryActionLabel = computed(() => {
	if (reducedMotion.value && phase.value === "playing") {
		return "Restart trail";
	}
	if (phase.value === "playing") return "Pause";
	if (phase.value === "paused") return "Keep going";
	if (phase.value === "finished") return "Try again";
	return "Start trail";
});

function isOnGround() {
	return cometBottom >= GROUND_Y - 0.5;
}

function resetTrail() {
	obstacles.splice(0);
	cometBottom = GROUND_Y;
	verticalSpeed = 0;
	distance = 0;
	score.value = 0;
	ducking.value = false;
	reducedPose.value = "stand";
	spawnClock = 1.2;
	obstacleNumber = 0;
}

function startTrail() {
	resetTrail();
	phase.value = "playing";
	if (reducedMotion.value) {
		addObstacle(CANVAS_WIDTH - 120);
		announcement.value =
			"The trail moves one step each time you choose Hop or Duck.";
	} else {
		announcement.value =
			"The comet trail has started. Hop or duck when you need to.";
	}
	draw();
}

function toggleGame() {
	if (reducedMotion.value) {
		startTrail();
		return;
	}
	if (phase.value === "playing") {
		phase.value = "paused";
		ducking.value = false;
		announcement.value = "Trail paused.";
		draw();
		return;
	}
	if (phase.value === "paused") {
		phase.value = "playing";
		announcement.value = "Trail resumed.";
		draw();
		return;
	}
	startTrail();
}

function hop() {
	if (phase.value !== "playing") return;
	if (reducedMotion.value) {
		advanceReducedTrail("hop");
		return;
	}
	if (!isOnGround()) return;
	ducking.value = false;
	verticalSpeed = -710;
	announcement.value = "Comet hopping.";
}

function setDucking(value: boolean) {
	if (reducedMotion.value) {
		if (value && phase.value === "playing") {
			advanceReducedTrail("duck");
		}
		return;
	}
	if (phase.value !== "playing" || !isOnGround()) {
		ducking.value = false;
		return;
	}
	ducking.value = value;
	announcement.value = value ? "Comet ducking." : "Comet standing tall.";
}

function toggleDuck() {
	if (reducedMotion.value) {
		if (phase.value === "playing") advanceReducedTrail("duck");
		return;
	}
	setDucking(!ducking.value);
}

function addObstacle(x = CANVAS_WIDTH + 40) {
	obstacleNumber += 1;
	const seedNext = obstacleNumber > 2 && obstacleNumber % 3 === 0;
	if (seedNext) {
		obstacles.push({
			height: 25,
			kind: "orbiting-seed",
			width: 48,
			x,
			y: GROUND_Y - 68
		});
		return;
	}
	const height = 38 + (obstacleNumber % 3) * 7;
	obstacles.push({
		height,
		kind: "moon-rock",
		width: 36 + (obstacleNumber % 2) * 10,
		x,
		y: GROUND_Y - height
	});
}

function reducedActionCollides(
	obstacle: TrailObstacle,
	action: "duck" | "hop"
) {
	const cometLeft = COMET_X + 7;
	const cometRight = COMET_X + 48 - 7;
	const overlaps =
		cometRight > obstacle.x + 5 &&
		cometLeft < obstacle.x + obstacle.width - 5;
	if (!overlaps) return false;
	return obstacle.kind === "moon-rock" ? action !== "hop" : action !== "duck";
}

function advanceReducedTrail(action: "duck" | "hop") {
	if (phase.value !== "playing") return;
	reducedPose.value = action;
	distance += REDUCED_STEP_DISTANCE;
	score.value = Math.floor(distance / 32);

	for (let index = obstacles.length - 1; index >= 0; index -= 1) {
		const obstacle = obstacles[index];
		obstacle.x -= REDUCED_STEP_DISTANCE;
		if (reducedActionCollides(obstacle, action)) {
			finishTrail();
			break;
		}
		if (obstacle.x + obstacle.width < -30) obstacles.splice(index, 1);
	}

	if (phase.value === "playing") {
		const lastObstacle = obstacles.at(-1);
		if (!lastObstacle || lastObstacle.x < CANVAS_WIDTH - 340) {
			addObstacle(CANVAS_WIDTH + 20);
		}
		announcement.value =
			action === "hop"
				? "Hop complete. The trail moved one step."
				: "Duck complete. The trail moved one step.";
	}
	draw();
}

function collides(obstacle: TrailObstacle) {
	const cometHeight =
		ducking.value && isOnGround() ? DUCKING_HEIGHT : STANDING_HEIGHT;
	const cometTop = cometBottom - cometHeight;
	const cometLeft = COMET_X + 7;
	const cometRight = COMET_X + 48 - 7;
	const cometBottomEdge = cometBottom - 4;
	return (
		cometRight > obstacle.x + 5 &&
		cometLeft < obstacle.x + obstacle.width - 5 &&
		cometBottomEdge > obstacle.y + 4 &&
		cometTop + 5 < obstacle.y + obstacle.height - 3
	);
}

function finishTrail() {
	phase.value = "finished";
	ducking.value = false;
	sessionBest.value = Math.max(sessionBest.value, score.value);
	announcement.value = `Trail complete! You traveled ${score.value} star steps.`;
}

function drawStars(context: CanvasRenderingContext2D, shift: number) {
	const stars = [
		[52, 74, 2],
		[122, 138, 3],
		[204, 62, 2],
		[282, 170, 2],
		[366, 88, 3],
		[452, 144, 2],
		[530, 58, 2],
		[624, 118, 3],
		[710, 74, 2],
		[788, 174, 2]
	];
	context.fillStyle = "#fff7c2";
	stars.forEach(([baseX, y, radius]) => {
		const x =
			((baseX - shift + CANVAS_WIDTH + 40) % (CANVAS_WIDTH + 40)) - 20;
		context.beginPath();
		context.arc(x, y, radius, 0, Math.PI * 2);
		context.fill();
	});
}

function drawComet(context: CanvasRenderingContext2D) {
	const reducedDuck = reducedMotion.value && reducedPose.value === "duck";
	const reducedHop = reducedMotion.value && reducedPose.value === "hop";
	const height =
		reducedDuck || (ducking.value && isOnGround())
			? DUCKING_HEIGHT
			: STANDING_HEIGHT;
	const displayedBottom = reducedHop ? GROUND_Y - 72 : cometBottom;
	const top = displayedBottom - height;
	const centerY = top + height / 2;
	context.save();
	context.fillStyle = "rgba(96, 165, 250, .46)";
	context.beginPath();
	context.moveTo(COMET_X + 7, centerY);
	context.lineTo(COMET_X - 35, centerY - 18);
	context.lineTo(COMET_X - 18, centerY);
	context.lineTo(COMET_X - 40, centerY + 18);
	context.closePath();
	context.fill();
	context.fillStyle = "#8b5cf6";
	context.beginPath();
	context.arc(COMET_X + 24, centerY, height / 2, 0, Math.PI * 2);
	context.fill();
	context.fillStyle = "#f8fafc";
	context.beginPath();
	context.arc(COMET_X + 17, centerY - 5, 4, 0, Math.PI * 2);
	context.arc(COMET_X + 31, centerY - 5, 4, 0, Math.PI * 2);
	context.fill();
	context.fillStyle = "#172554";
	context.beginPath();
	context.arc(COMET_X + 18, centerY - 5, 1.7, 0, Math.PI * 2);
	context.arc(COMET_X + 32, centerY - 5, 1.7, 0, Math.PI * 2);
	context.fill();
	context.strokeStyle = "#f8fafc";
	context.lineWidth = 2;
	context.beginPath();
	context.arc(COMET_X + 25, centerY + 4, 8, 0.15, Math.PI - 0.15);
	context.stroke();
	context.restore();
}

function drawObstacle(
	context: CanvasRenderingContext2D,
	obstacle: TrailObstacle
) {
	if (obstacle.kind === "orbiting-seed") {
		context.save();
		context.translate(obstacle.x + obstacle.width / 2, obstacle.y + 12);
		context.strokeStyle = "#f9a8d4";
		context.lineWidth = 5;
		context.beginPath();
		context.ellipse(0, 0, 23, 9, -0.2, 0, Math.PI * 2);
		context.stroke();
		context.fillStyle = "#fde68a";
		context.beginPath();
		context.arc(0, 0, 9, 0, Math.PI * 2);
		context.fill();
		context.restore();
		return;
	}
	context.fillStyle = "#61718c";
	context.beginPath();
	context.moveTo(obstacle.x, obstacle.y + obstacle.height);
	context.lineTo(obstacle.x + 6, obstacle.y + 12);
	context.lineTo(obstacle.x + obstacle.width * 0.48, obstacle.y);
	context.lineTo(obstacle.x + obstacle.width - 4, obstacle.y + 18);
	context.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
	context.closePath();
	context.fill();
	context.fillStyle = "rgba(255,255,255,.22)";
	context.beginPath();
	context.arc(
		obstacle.x + obstacle.width * 0.45,
		obstacle.y + 17,
		5,
		0,
		Math.PI * 2
	);
	context.fill();
}

function draw() {
	const context = canvas.value?.getContext("2d");
	if (!context) return;
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	const sky = context.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
	sky.addColorStop(0, "#101436");
	sky.addColorStop(0.65, "#253369");
	sky.addColorStop(1, "#544477");
	context.fillStyle = sky;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	const starShift = reducedMotion.value ? 0 : distance * 0.15;
	drawStars(context, starShift);

	context.fillStyle = "#8b6c7d";
	context.beginPath();
	context.moveTo(0, GROUND_Y + 8);
	for (let x = 0; x <= CANVAS_WIDTH; x += 42) {
		context.lineTo(x, GROUND_Y - 8 + ((x / 42) % 2) * 10);
	}
	context.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
	context.lineTo(0, CANVAS_HEIGHT);
	context.closePath();
	context.fill();
	context.fillStyle = "#5f4a68";
	context.fillRect(0, GROUND_Y + 26, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);

	obstacles.forEach(obstacle => drawObstacle(context, obstacle));
	drawComet(context);

	if (phase.value !== "playing") {
		context.fillStyle = "rgba(7, 10, 31, .58)";
		context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
		context.fillStyle = "#ffffff";
		context.font = "700 34px Avenir Next, sans-serif";
		context.textAlign = "center";
		context.fillText(phaseLabel.value, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
	}
}

function update(timestamp: number) {
	if (!lastFrame) lastFrame = timestamp;
	const elapsed = Math.min(0.036, (timestamp - lastFrame) / 1000);
	lastFrame = timestamp;

	if (phase.value === "playing") {
		const trailSpeed = Math.min(470, 270 + distance * 0.008);
		distance += trailSpeed * elapsed;
		score.value = Math.floor(distance / 32);

		verticalSpeed += 1850 * elapsed;
		cometBottom += verticalSpeed * elapsed;
		if (cometBottom >= GROUND_Y) {
			cometBottom = GROUND_Y;
			verticalSpeed = 0;
		}

		spawnClock -= elapsed;
		if (spawnClock <= 0) {
			addObstacle();
			spawnClock = 1.25 + (obstacleNumber % 4) * 0.16;
		}

		for (let index = obstacles.length - 1; index >= 0; index -= 1) {
			const obstacle = obstacles[index];
			obstacle.x -= trailSpeed * elapsed;
			if (collides(obstacle)) {
				finishTrail();
				break;
			}
			if (obstacle.x + obstacle.width < -30) obstacles.splice(index, 1);
		}
	}

	draw();
	animationFrame = window.requestAnimationFrame(update);
}

function handleKeydown(event: KeyboardEvent) {
	const target = event.target instanceof HTMLElement ? event.target : null;
	if (
		target?.matches("input, textarea, select") ||
		target?.isContentEditable
	) {
		return;
	}
	const isNativeActivation =
		(event.key === "Enter" || event.key === " ") &&
		Boolean(target?.closest("a[href], button"));
	if (isNativeActivation) return;
	if (reducedMotion.value && event.repeat) return;

	if ([" ", "ArrowUp", "w", "W"].includes(event.key)) {
		event.preventDefault();
		if (phase.value === "idle" || phase.value === "finished") startTrail();
		hop();
		return;
	}
	if (["ArrowDown", "s", "S"].includes(event.key)) {
		event.preventDefault();
		setDucking(true);
		return;
	}
	if (event.key === "Enter" && phase.value !== "playing") {
		event.preventDefault();
		toggleGame();
	}
}

function handleKeyup(event: KeyboardEvent) {
	const target = event.target instanceof HTMLElement ? event.target : null;
	if (
		target?.matches("input, textarea, select") ||
		target?.isContentEditable
	) {
		return;
	}
	if (["ArrowDown", "s", "S"].includes(event.key)) setDucking(false);
}

function handleVisibilityChange() {
	if (document.hidden && phase.value === "playing" && !reducedMotion.value) {
		phase.value = "paused";
		ducking.value = false;
		announcement.value = "Trail paused while this tab was away.";
	}
	lastFrame = 0;
}

onMounted(() => {
	reducedMotion.value =
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
		false;
	document.addEventListener("visibilitychange", handleVisibilityChange);
	draw();
	if (!reducedMotion.value) {
		animationFrame = window.requestAnimationFrame(update);
	}
});

onBeforeUnmount(() => {
	window.cancelAnimationFrame(animationFrame);
	document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<template>
	<section
		class="comet-hopper"
		:data-reduced-motion="reducedMotion ? 'true' : 'false'"
		@keydown="handleKeydown"
		@keyup="handleKeyup"
	>
		<header class="trail-intro">
			<div>
				<h1>Comet Hopper</h1>
				<p>
					Guide a cheerful comet along a tiny moon trail. Hop over
					rocks, duck under orbiting seeds, and see how many star
					steps you can go.
				</p>
			</div>
			<RouterLink class="back-link" to="/games">All games</RouterLink>
		</header>

		<div class="trail-panel">
			<div class="trail-hud" aria-label="Game status">
				<span><strong>Status:</strong> {{ phaseLabel }}</span>
				<span><strong>Star steps:</strong> {{ score }}</span>
				<span><strong>Session best:</strong> {{ sessionBest }}</span>
				<span v-if="reducedMotion"
					><strong>Motion:</strong> Step by step</span
				>
			</div>

			<canvas
				ref="canvas"
				:height="CANVAS_HEIGHT"
				:width="CANVAS_WIDTH"
				:aria-label="
					reducedMotion
						? 'Step-by-step comet trail. Choose Hop or Duck to move the trail one step.'
						: 'Comet trail game. Press Space or Up to hop. Hold Down to duck.'
				"
				class="trail-canvas"
				role="img"
				tabindex="0"
				@pointerdown="hop"
			></canvas>

			<p class="trail-announcement" aria-live="polite">
				{{ announcement }}
			</p>

			<div class="trail-actions">
				<button
					class="primary-button"
					type="button"
					@click="toggleGame"
				>
					{{ primaryActionLabel }}
				</button>
				<button
					aria-label="Make the comet hop"
					class="move-button"
					type="button"
					@click="hop"
				>
					Hop ↑
				</button>
				<button
					:aria-pressed="reducedMotion ? undefined : ducking"
					class="move-button"
					type="button"
					@click="toggleDuck"
				>
					{{ reducedMotion ? "Duck" : ducking ? "Stand" : "Duck" }} ↓
				</button>
				<p v-if="reducedMotion">
					Choose Hop or Duck to move the trail one step. Nothing moves
					between choices.
				</p>
				<p v-else>
					Keyboard: Space or ↑ to hop; hold ↓ to duck. Enter starts.
				</p>
			</div>
		</div>
	</section>
</template>

<style scoped>
.comet-hopper {
	--game-heading-color: #4c3b75;

	width: min(1080px, calc(100% - 2rem));
	margin-inline: auto;
	padding: clamp(1.5rem, 4vw, 3.5rem) 0 clamp(3rem, 6vw, 5rem);
	display: grid;
	gap: 1.5rem;
}

.trail-intro {
	display: flex;
	justify-content: space-between;
	align-items: start;
	gap: 1.5rem;
}

.trail-intro > div {
	display: grid;
	gap: 0.65rem;
	max-width: 46rem;
}

.trail-intro h1 {
	font-size: clamp(2.5rem, 7vw, 5rem);
	color: var(--game-heading-color);
}

.trail-intro p {
	font-size: 1.05rem;
	color: var(--color-ink-soft);
}

.back-link {
	flex: none;
	padding: 0.65rem 0.9rem;
	border: 1px solid var(--color-border);
	border-radius: 999px;
	background: var(--color-surface);
	font-weight: 750;
	text-decoration: none;
}

.trail-panel {
	padding: clamp(0.7rem, 2vw, 1.2rem);
	border: 1px solid rgba(124, 58, 237, 0.24);
	border-radius: 28px;
	background: #f9f7ff;
	box-shadow: 0 24px 60px -40px rgba(15, 23, 42, 0.5);
	display: grid;
	gap: 1rem;
}

.trail-hud {
	display: flex;
	flex-wrap: wrap;
	gap: 0.55rem;
}

.trail-hud span {
	padding: 0.42rem 0.7rem;
	border-radius: 999px;
	background: #eee7ff;
	color: #49386d;
	font-size: 0.9rem;
}

.trail-canvas {
	width: 100%;
	border: 3px solid #32265a;
	border-radius: 19px;
	background: #101436;
	box-shadow: 0 18px 36px -28px rgba(15, 23, 42, 0.7);
	cursor: pointer;
	touch-action: manipulation;
}

.trail-announcement {
	min-height: 1.6rem;
	font-weight: 700;
	color: #4c3b75;
}

.trail-actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.7rem;
}

.trail-actions p {
	font-size: 0.91rem;
	color: #526b70;
}

.primary-button,
.move-button {
	min-height: 3rem;
	padding: 0.7rem 1rem;
	border-radius: 14px;
	font-weight: 800;
	cursor: pointer;
}

.primary-button {
	border: 1px solid #6d28d9;
	background: #6d28d9;
	color: #fff;
}

.move-button {
	border: 1px solid rgba(76, 59, 117, 0.24);
	background: #fff;
	color: #4c3b75;
}

:global(html.dark .comet-hopper) {
	--game-heading-color: #f0eaff;
}

:global(html.dark .comet-hopper .trail-announcement) {
	color: #ded3ff;
}

:global(html.dark .comet-hopper .trail-panel) {
	background: #0c1427;
}

:global(html.dark .comet-hopper .trail-hud span) {
	background: #30254b;
	color: #f5f0ff;
}

:global(html.dark .comet-hopper .move-button) {
	border-color: rgba(196, 181, 253, 0.28);
	background: #211a38;
	color: #f5f0ff;
}

:global(html.dark .comet-hopper .trail-actions p) {
	color: #bdd1da;
}

@media (max-width: 660px) {
	.trail-intro {
		flex-direction: column-reverse;
	}

	.trail-actions p {
		flex-basis: 100%;
	}
}

@media (prefers-reduced-motion: reduce) {
	* {
		transition: none !important;
	}
}
</style>
