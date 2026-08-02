<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type Direction = "down" | "left" | "right" | "up";
type GamePhase = "finished" | "idle" | "paused" | "playing";

interface TrafficCar {
	color: string;
	direction: -1 | 1;
	lane: number;
	speed: number;
	width: number;
	x: number;
}

const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 500;
const PLAYER_SIZE = 34;
const START_X = BOARD_WIDTH / 2 - PLAYER_SIZE / 2;
const START_Y = 442;
const GOAL_Y = 50;

const canvas = ref<HTMLCanvasElement | null>(null);
const phase = ref<GamePhase>("idle");
const lives = ref(3);
const crossings = ref(0);
const best = ref(0);
const reducedMotion = ref(false);
const announcement = ref(
	"Choose Start crossing, then guide Pip to the flower meadow."
);

const player = { x: START_X, y: START_Y };
const traffic: TrafficCar[] = [
	{ color: "#f97316", direction: 1, lane: 0, speed: 120, width: 92, x: -20 },
	{ color: "#38bdf8", direction: 1, lane: 0, speed: 120, width: 76, x: 410 },
	{ color: "#facc15", direction: -1, lane: 1, speed: 145, width: 82, x: 190 },
	{
		color: "#c084fc",
		direction: -1,
		lane: 1,
		speed: 145,
		width: 100,
		x: 650
	},
	{ color: "#fb7185", direction: 1, lane: 2, speed: 165, width: 86, x: 80 },
	{ color: "#4ade80", direction: 1, lane: 2, speed: 165, width: 74, x: 520 },
	{ color: "#60a5fa", direction: -1, lane: 3, speed: 190, width: 94, x: 310 },
	{ color: "#f59e0b", direction: -1, lane: 3, speed: 190, width: 80, x: 760 }
];

let animationFrame = 0;
let lastFrame = 0;

const phaseLabel = computed(() => {
	switch (phase.value) {
		case "finished":
			return "Crossing complete";
		case "paused":
			return "Paused";
		case "playing":
			return reducedMotion.value ? "Your turn" : "Crossing";
		default:
			return "Ready";
	}
});

const primaryActionLabel = computed(() => {
	if (reducedMotion.value && phase.value === "playing") {
		return "Restart crossing";
	}
	if (phase.value === "paused") return "Keep crossing";
	if (phase.value === "playing") return "Pause";
	if (phase.value === "finished") return "Try again";
	return "Start crossing";
});

function laneY(lane: number) {
	return 126 + lane * 76;
}

function resetPlayer() {
	player.x = START_X;
	player.y = START_Y;
}

function startGame() {
	lives.value = 3;
	crossings.value = 0;
	resetPlayer();
	phase.value = "playing";
	announcement.value = reducedMotion.value
		? "The crossing is open. Traffic moves one step each time Pip moves."
		: "The crossing is open. Find a safe path to the meadow!";
	draw();
}

function toggleGame() {
	if (reducedMotion.value) {
		startGame();
		return;
	}
	if (phase.value === "playing") {
		phase.value = "paused";
		announcement.value = "Crossing paused.";
		draw();
		return;
	}
	if (phase.value === "paused") {
		phase.value = "playing";
		announcement.value = "Crossing resumed.";
		draw();
		return;
	}
	startGame();
}

function advanceTraffic(elapsed: number) {
	const difficulty = Math.min(1.45, 1 + crossings.value * 0.06);
	traffic.forEach(car => {
		car.x += car.speed * car.direction * elapsed * difficulty;
		if (car.direction === 1 && car.x > BOARD_WIDTH + 30) {
			car.x = -car.width - 80;
		}
		if (car.direction === -1 && car.x + car.width < -30) {
			car.x = BOARD_WIDTH + 80;
		}
	});
}

function move(direction: Direction) {
	if (phase.value !== "playing") return;

	if (direction === "up") player.y -= 38;
	if (direction === "down") player.y += 38;
	if (direction === "left") player.x -= 48;
	if (direction === "right") player.x += 48;

	player.x = Math.max(22, Math.min(BOARD_WIDTH - PLAYER_SIZE - 22, player.x));
	player.y = Math.max(GOAL_Y, Math.min(START_Y, player.y));

	if (player.y <= GOAL_Y) {
		crossings.value += 1;
		if (crossings.value > best.value) {
			best.value = crossings.value;
		}
		announcement.value = `Pip reached the meadow! Crossing ${crossings.value} complete.`;
		resetPlayer();
	}
	if (reducedMotion.value && phase.value === "playing") {
		advanceTraffic(0.24);
		if (collidesWithTraffic()) handleBump();
	}

	draw();
}

function collidesWithTraffic() {
	return traffic.some(car => {
		const carY = laneY(car.lane) - 22;
		return (
			player.x + PLAYER_SIZE - 6 > car.x &&
			player.x + 6 < car.x + car.width &&
			player.y + PLAYER_SIZE - 5 > carY &&
			player.y + 5 < carY + 44
		);
	});
}

function handleBump() {
	lives.value -= 1;
	resetPlayer();
	if (lives.value <= 0) {
		phase.value = "finished";
		announcement.value = `Nice try! Pip made ${crossings.value} safe crossings.`;
		return;
	}
	announcement.value = `Bump! Pip is safe back at the start. ${lives.value} tries left.`;
}

function roundedRect(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number
) {
	context.beginPath();
	context.moveTo(x + radius, y);
	context.lineTo(x + width - radius, y);
	context.quadraticCurveTo(x + width, y, x + width, y + radius);
	context.lineTo(x + width, y + height - radius);
	context.quadraticCurveTo(
		x + width,
		y + height,
		x + width - radius,
		y + height
	);
	context.lineTo(x + radius, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - radius);
	context.lineTo(x, y + radius);
	context.quadraticCurveTo(x, y, x + radius, y);
	context.closePath();
}

function drawCar(context: CanvasRenderingContext2D, car: TrafficCar) {
	const y = laneY(car.lane) - 22;
	context.save();
	context.fillStyle = car.color;
	roundedRect(context, car.x, y, car.width, 40, 12);
	context.fill();
	context.fillStyle = "rgba(255,255,255,.75)";
	roundedRect(
		context,
		car.x + 20,
		y + 7,
		Math.max(24, car.width - 40),
		15,
		5
	);
	context.fill();
	context.fillStyle = "#172033";
	context.beginPath();
	context.arc(car.x + 20, y + 40, 8, 0, Math.PI * 2);
	context.arc(car.x + car.width - 20, y + 40, 8, 0, Math.PI * 2);
	context.fill();
	context.restore();
}

function drawCritter(context: CanvasRenderingContext2D) {
	const centerX = player.x + PLAYER_SIZE / 2;
	const centerY = player.y + PLAYER_SIZE / 2;
	context.save();
	context.fillStyle = "#fef3c7";
	context.beginPath();
	context.arc(centerX, centerY, 16, 0, Math.PI * 2);
	context.fill();
	context.fillStyle = "#f59e0b";
	context.beginPath();
	context.moveTo(centerX - 13, centerY - 10);
	context.lineTo(centerX - 8, centerY - 23);
	context.lineTo(centerX - 2, centerY - 12);
	context.moveTo(centerX + 13, centerY - 10);
	context.lineTo(centerX + 8, centerY - 23);
	context.lineTo(centerX + 2, centerY - 12);
	context.fill();
	context.fillStyle = "#172033";
	context.beginPath();
	context.arc(centerX - 5, centerY - 2, 2, 0, Math.PI * 2);
	context.arc(centerX + 5, centerY - 2, 2, 0, Math.PI * 2);
	context.fill();
	context.strokeStyle = "#92400e";
	context.lineWidth = 2;
	context.beginPath();
	context.arc(centerX, centerY + 3, 5, 0.15, Math.PI - 0.15);
	context.stroke();
	context.restore();
}

function draw() {
	const context = canvas.value?.getContext("2d");
	if (!context) return;

	context.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
	const sky = context.createLinearGradient(0, 0, 0, BOARD_HEIGHT);
	sky.addColorStop(0, "#bdeef7");
	sky.addColorStop(1, "#e8f8c7");
	context.fillStyle = sky;
	context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

	context.fillStyle = "#86c66b";
	context.fillRect(0, 0, BOARD_WIDTH, 88);
	context.fillStyle = "#4c586b";
	context.fillRect(0, 90, BOARD_WIDTH, 344);
	context.fillStyle = "#d7d7cf";
	context.fillRect(0, 88, BOARD_WIDTH, 18);
	context.fillRect(0, 424, BOARD_WIDTH, 22);
	context.fillStyle = "rgba(255,255,255,.65)";
	for (let lane = 0; lane < 4; lane += 1) {
		const y = laneY(lane) + 34;
		for (let x = 14; x < BOARD_WIDTH; x += 78) {
			context.fillRect(x, y, 42, 4);
		}
	}

	context.fillStyle = "#fef3c7";
	for (let x = 45; x < BOARD_WIDTH; x += 95) {
		context.beginPath();
		context.arc(x, 38, 7, 0, Math.PI * 2);
		context.arc(x - 7, 31, 4, 0, Math.PI * 2);
		context.arc(x + 7, 31, 4, 0, Math.PI * 2);
		context.arc(x - 7, 45, 4, 0, Math.PI * 2);
		context.arc(x + 7, 45, 4, 0, Math.PI * 2);
		context.fill();
	}

	traffic.forEach(car => drawCar(context, car));
	drawCritter(context);

	if (phase.value !== "playing") {
		context.fillStyle = "rgba(10, 22, 38, .52)";
		context.fillRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);
		context.fillStyle = "#ffffff";
		context.font = "700 34px Avenir Next, sans-serif";
		context.textAlign = "center";
		context.fillText(phaseLabel.value, BOARD_WIDTH / 2, BOARD_HEIGHT / 2);
	}
}

function update(timestamp: number) {
	if (!lastFrame) lastFrame = timestamp;
	const elapsed = Math.min(0.04, (timestamp - lastFrame) / 1000);
	lastFrame = timestamp;

	if (phase.value === "playing") {
		advanceTraffic(elapsed);
		if (collidesWithTraffic()) handleBump();
	}

	draw();
	animationFrame = window.requestAnimationFrame(update);
}

function handleKeydown(event: KeyboardEvent) {
	const directionByKey: Partial<Record<string, Direction>> = {
		ArrowDown: "down",
		ArrowLeft: "left",
		ArrowRight: "right",
		ArrowUp: "up",
		a: "left",
		d: "right",
		s: "down",
		w: "up"
	};
	const target = event.target instanceof HTMLElement ? event.target : null;
	if (
		target?.matches("input, textarea, select") ||
		target?.isContentEditable
	) {
		return;
	}

	const normalizedKey =
		event.key.length === 1 ? event.key.toLowerCase() : event.key;
	const direction = directionByKey[normalizedKey];
	if (direction && phase.value === "playing") {
		if (reducedMotion.value && event.repeat) return;
		event.preventDefault();
		move(direction);
		return;
	}
	if (
		(event.key === "Enter" || event.key === " ") &&
		phase.value !== "playing" &&
		!target?.closest("a[href], button")
	) {
		event.preventDefault();
		toggleGame();
	}
}

function handleVisibilityChange() {
	if (document.hidden && phase.value === "playing" && !reducedMotion.value) {
		phase.value = "paused";
		announcement.value = "Crossing paused while this tab was away.";
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
		class="crosswalk-game"
		:data-reduced-motion="reducedMotion ? 'true' : 'false'"
		@keydown="handleKeydown"
	>
		<header class="game-intro">
			<div>
				<h1>Crosswalk Critters</h1>
				<p>
					Help Pip cross four busy lanes to reach the flower meadow.
					Watch the patterns, choose a safe moment, and take your
					time.
				</p>
			</div>
			<RouterLink class="back-link" to="/games">All games</RouterLink>
		</header>

		<div class="game-panel">
			<div class="game-hud" aria-label="Game status">
				<span><strong>Status:</strong> {{ phaseLabel }}</span>
				<span><strong>Crossings:</strong> {{ crossings }}</span>
				<span><strong>Tries:</strong> {{ lives }}</span>
				<span><strong>Session best:</strong> {{ best }}</span>
				<span v-if="reducedMotion"
					><strong>Motion:</strong> Step by step</span
				>
			</div>

			<canvas
				ref="canvas"
				:height="BOARD_HEIGHT"
				:width="BOARD_WIDTH"
				aria-label="Crosswalk game board. Use arrow keys or W A S D to move Pip toward the meadow."
				class="game-canvas"
				role="img"
				tabindex="0"
			></canvas>

			<p class="game-announcement" aria-live="polite">
				{{ announcement }}
			</p>

			<div class="game-actions">
				<button
					class="primary-button"
					type="button"
					@click="toggleGame"
				>
					{{ primaryActionLabel }}
				</button>
				<p v-if="reducedMotion">
					Traffic moves only after Pip moves. Use arrow keys or W A S
					D.
				</p>
				<p v-else>
					Keyboard: arrow keys or W A S D. Enter starts or resumes.
				</p>
			</div>

			<div class="direction-pad" aria-label="Touch movement controls">
				<button
					aria-label="Move Pip up"
					type="button"
					@click="move('up')"
				>
					↑
				</button>
				<button
					aria-label="Move Pip left"
					type="button"
					@click="move('left')"
				>
					←
				</button>
				<button
					aria-label="Move Pip down"
					type="button"
					@click="move('down')"
				>
					↓
				</button>
				<button
					aria-label="Move Pip right"
					type="button"
					@click="move('right')"
				>
					→
				</button>
			</div>
		</div>
	</section>
</template>

<style scoped>
.crosswalk-game {
	--game-heading-color: #12455a;

	width: min(1040px, calc(100% - 2rem));
	margin-inline: auto;
	padding: clamp(1.5rem, 4vw, 3.5rem) 0 clamp(3rem, 6vw, 5rem);
	display: grid;
	gap: 1.5rem;
	color: var(--color-ink);
}

.game-intro {
	display: flex;
	justify-content: space-between;
	align-items: start;
	gap: 1.5rem;
}

.game-intro > div {
	display: grid;
	gap: 0.65rem;
	max-width: 46rem;
}

.game-intro h1 {
	font-size: clamp(2.5rem, 7vw, 5rem);
	color: var(--game-heading-color);
}

.game-intro p {
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

.game-panel {
	padding: clamp(0.7rem, 2vw, 1.2rem);
	border: 1px solid rgba(18, 69, 90, 0.18);
	border-radius: 28px;
	background: #f5fbff;
	box-shadow: 0 24px 60px -40px rgba(15, 23, 42, 0.5);
	display: grid;
	gap: 1rem;
}

.game-hud {
	display: flex;
	flex-wrap: wrap;
	gap: 0.55rem;
}

.game-hud span {
	padding: 0.42rem 0.7rem;
	border-radius: 999px;
	background: #e0f3f8;
	color: #163b4a;
	font-size: 0.9rem;
}

.game-canvas {
	width: 100%;
	border: 3px solid #163b4a;
	border-radius: 19px;
	background: #bdeef7;
	box-shadow: 0 18px 36px -28px rgba(15, 23, 42, 0.7);
	touch-action: pan-y pinch-zoom;
}

.game-announcement {
	min-height: 1.6rem;
	font-weight: 700;
	color: #12455a;
}

.game-actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.8rem 1rem;
}

.game-actions p {
	font-size: 0.91rem;
	color: #526b70;
}

.primary-button,
.direction-pad button {
	min-height: 3rem;
	border: 0;
	border-radius: 14px;
	font-weight: 800;
	cursor: pointer;
}

.primary-button {
	padding: 0.7rem 1.2rem;
	background: #0f766e;
	color: #fff;
}

.direction-pad {
	display: grid;
	grid-template-columns: repeat(3, 3.25rem);
	grid-template-rows: repeat(2, 3.25rem);
	gap: 0.45rem;
	justify-content: center;
}

.direction-pad button {
	background: #163b4a;
	color: #fff;
	font-size: 1.35rem;
}

.direction-pad button:first-child {
	grid-column: 2;
}

.direction-pad button:nth-child(2) {
	grid-column: 1;
	grid-row: 2;
}

.direction-pad button:nth-child(3) {
	grid-column: 2;
	grid-row: 2;
}

.direction-pad button:nth-child(4) {
	grid-column: 3;
	grid-row: 2;
}

:global(html.dark .crosswalk-game) {
	--game-heading-color: #e8f8ff;
}

:global(html.dark .crosswalk-game .game-announcement) {
	color: #b9ecff;
}

:global(html.dark .crosswalk-game .game-panel) {
	border-color: rgba(148, 213, 235, 0.22);
	background: #0c1c2a;
}

:global(html.dark .crosswalk-game .game-hud span) {
	background: #15384a;
	color: #eefaff;
}

:global(html.dark .crosswalk-game .game-actions p) {
	color: #bdd1da;
}

@media (max-width: 660px) {
	.game-intro {
		flex-direction: column-reverse;
	}

	.game-canvas {
		min-height: 18rem;
		object-fit: cover;
	}
}

@media (prefers-reduced-motion: reduce) {
	* {
		scroll-behavior: auto !important;
		transition: none !important;
	}
}
</style>
