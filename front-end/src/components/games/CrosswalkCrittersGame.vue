<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type Challenge = "advanced" | "middle" | "simple";
type Direction = "down" | "left" | "right" | "up" | "wait";
type GamePhase = "idle" | "lost" | "paused" | "playing" | "won";
type TrafficMode = "continuous" | "step";

interface BoardPosition {
	x: number;
	y: number;
}

interface TrafficCar {
	color: string;
	direction: -1 | 1;
	lane: number;
	speed: number;
	width: number;
	x: number;
}

interface ChallengeConfig {
	description: string;
	label: "Advanced" | "Middle" | "Simple";
	pointMultiplier: 1 | 2 | 3;
	speedMultipliers: readonly [number, number, number];
	tries: number;
	vehicleIndexes: readonly [
		readonly number[],
		readonly number[],
		readonly number[]
	];
}

const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 500;
const PLAYER_SIZE = 34;
const START_X = BOARD_WIDTH / 2 - PLAYER_SIZE / 2;
const START_Y = 442;
const GOAL_Y = 50;
const STAGE_COUNT = 3;
const BUMP_PENALTY = 25;

const TRAFFIC_TEMPLATES: readonly TrafficCar[] = [
	{ color: "#f97316", direction: 1, lane: 0, speed: 120, width: 92, x: -20 },
	{ color: "#facc15", direction: -1, lane: 1, speed: 145, width: 82, x: 190 },
	{ color: "#fb7185", direction: 1, lane: 2, speed: 165, width: 86, x: 80 },
	{ color: "#60a5fa", direction: -1, lane: 3, speed: 190, width: 94, x: 310 },
	{ color: "#38bdf8", direction: 1, lane: 0, speed: 120, width: 76, x: 410 },
	{
		color: "#c084fc",
		direction: -1,
		lane: 1,
		speed: 145,
		width: 100,
		x: 650
	},
	{ color: "#4ade80", direction: 1, lane: 2, speed: 165, width: 74, x: 520 },
	{ color: "#f59e0b", direction: -1, lane: 3, speed: 190, width: 80, x: 760 },
	{ color: "#14b8a6", direction: 1, lane: 0, speed: 120, width: 66, x: 210 },
	{ color: "#e879f9", direction: -1, lane: 1, speed: 145, width: 72, x: 430 },
	{ color: "#a3e635", direction: 1, lane: 2, speed: 165, width: 68, x: 300 },
	{ color: "#f43f5e", direction: -1, lane: 3, speed: 190, width: 70, x: 540 }
];

const CHALLENGE_ORDER: readonly Challenge[] = ["simple", "middle", "advanced"];
const CHALLENGE_CONFIGS: Record<Challenge, ChallengeConfig> = {
	advanced: {
		description: "2 tries · fastest traffic",
		label: "Advanced",
		pointMultiplier: 3,
		speedMultipliers: [1.2, 1.4, 1.6],
		tries: 2,
		vehicleIndexes: [
			[0, 1, 2, 3, 4, 5, 6, 7],
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 10],
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
		]
	},
	middle: {
		description: "3 tries · busy traffic",
		label: "Middle",
		pointMultiplier: 2,
		speedMultipliers: [1, 1.15, 1.3],
		tries: 3,
		vehicleIndexes: [
			[0, 1, 2, 3, 4, 5, 6, 7],
			[0, 1, 2, 3, 4, 5, 6, 7],
			[0, 1, 2, 3, 4, 5, 6, 7]
		]
	},
	simple: {
		description: "5 tries · gentler traffic",
		label: "Simple",
		pointMultiplier: 1,
		speedMultipliers: [0.7, 0.85, 1],
		tries: 5,
		vehicleIndexes: [
			[0, 1, 2, 7],
			[0, 1, 2, 3, 4, 6],
			[0, 1, 2, 3, 4, 5, 6, 7]
		]
	}
};

const canvas = ref<HTMLCanvasElement | null>(null);
const challenge = ref<Challenge>("simple");
const trafficMode = ref<TrafficMode>("continuous");
const phase = ref<GamePhase>("idle");
const stage = ref(1);
const lives = ref(CHALLENGE_CONFIGS.simple.tries);
const crossings = ref(0);
const score = ref(0);
const best = ref(0);
const reducedMotion = ref(false);
const playerLocation = ref("starting curb");
const announcement = ref(
	"Choose a challenge, then start and guide Pip to the flower meadow."
);

const player = { x: START_X, y: START_Y };
const traffic: TrafficCar[] = [];

let animationFrame = 0;
let lastFrame = 0;
let motionPreference: MediaQueryList | null = null;

const selectedConfig = computed(() => CHALLENGE_CONFIGS[challenge.value]);
const stageIndex = computed(() => stage.value - 1);
const speedMultiplier = computed(
	() => selectedConfig.value.speedMultipliers[stageIndex.value]
);
const activeTrafficCount = computed(
	() => selectedConfig.value.vehicleIndexes[stageIndex.value].length
);
const stepByStep = computed(
	() => reducedMotion.value || trafficMode.value === "step"
);
const challengeSelectionLocked = computed(
	() => phase.value === "paused" || phase.value === "playing"
);

const phaseLabel = computed(() => {
	switch (phase.value) {
		case "lost":
			return "Run over";
		case "paused":
			return "Paused";
		case "playing":
			return stepByStep.value ? "Your turn" : "Crossing";
		case "won":
			return "Meadow champion";
		default:
			return "Ready";
	}
});

const primaryActionLabel = computed(() => {
	if (stepByStep.value && phase.value === "playing") return "Restart run";
	if (phase.value === "paused") return "Keep crossing";
	if (phase.value === "playing") return "Pause";
	if (phase.value === "lost") return "Try again";
	if (phase.value === "won") return "Play again";
	return `Start ${selectedConfig.value.label}`;
});

function stepGuidance() {
	if (!stepByStep.value || phase.value !== "playing") return "";
	return (["up", "left", "right", "down", "wait"] as const)
		.map(direction => {
			const label = direction === "wait" ? "Wait" : capitalize(direction);
			return `${label} ${moveWouldCollide(direction) ? "blocked" : "clear"}`;
		})
		.join(" · ");
}

function laneY(lane: number) {
	return 126 + lane * 76;
}

function capitalize(value: string) {
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function describePlayerLocation(y: number) {
	if (y <= GOAL_Y) return "flower meadow";
	if (y < 100) return "meadow curb";
	if (y < 176) return "lane 1";
	if (y < 252) return "lane 2";
	if (y < 328) return "lane 3";
	if (y < 404) return "lane 4";
	return "starting curb";
}

function positionAfterMove(
	direction: Direction,
	origin: BoardPosition = player
): BoardPosition {
	let { x, y } = origin;
	if (direction === "up") y -= 38;
	if (direction === "down") y += 38;
	if (direction === "left") x -= 48;
	if (direction === "right") x += 48;
	return {
		x: Math.max(22, Math.min(BOARD_WIDTH - PLAYER_SIZE - 22, x)),
		y: Math.max(GOAL_Y, Math.min(START_Y, y))
	};
}

function projectedCar(car: TrafficCar, elapsed: number): TrafficCar {
	const projection = { ...car };
	projection.x +=
		projection.speed *
		projection.direction *
		elapsed *
		speedMultiplier.value;
	if (projection.direction === 1 && projection.x > BOARD_WIDTH + 30) {
		projection.x = -projection.width - 80;
	}
	if (projection.direction === -1 && projection.x + projection.width < -30) {
		projection.x = BOARD_WIDTH + 80;
	}
	return projection;
}

function collidesAt(position: BoardPosition, cars: readonly TrafficCar[]) {
	return cars.some(car => {
		const carY = laneY(car.lane) - 22;
		return (
			position.x + PLAYER_SIZE - 6 > car.x &&
			position.x + 6 < car.x + car.width &&
			position.y + PLAYER_SIZE - 5 > carY &&
			position.y + 5 < carY + 44
		);
	});
}

function moveWouldCollide(direction: Direction) {
	const nextPosition = positionAfterMove(direction);
	if (nextPosition.y <= GOAL_Y) return false;
	const nextTraffic = traffic.map(car => projectedCar(car, 0.24));
	return collidesAt(nextPosition, nextTraffic);
}

function moveControlLabel(direction: Direction) {
	const action =
		direction === "wait"
			? "Wait one traffic step"
			: `Move Pip ${direction}`;
	if (!stepByStep.value || phase.value !== "playing") return action;
	return `${action} — ${moveWouldCollide(direction) ? "blocked" : "clear"}`;
}

function resetPlayer() {
	player.x = START_X;
	player.y = START_Y;
	playerLocation.value = "starting curb";
}

function resetTraffic() {
	const vehicleIndexes =
		selectedConfig.value.vehicleIndexes[stageIndex.value];
	traffic.splice(
		0,
		traffic.length,
		...vehicleIndexes.map(index => ({ ...TRAFFIC_TEMPLATES[index] }))
	);
}

function stopAnimation() {
	if (animationFrame) window.cancelAnimationFrame(animationFrame);
	animationFrame = 0;
	lastFrame = 0;
}

function startAnimation() {
	if (stepByStep.value || phase.value !== "playing" || animationFrame) return;
	lastFrame = 0;
	animationFrame = window.requestAnimationFrame(update);
}

function startGame() {
	stopAnimation();
	stage.value = 1;
	lives.value = selectedConfig.value.tries;
	crossings.value = 0;
	score.value = 0;
	resetPlayer();
	resetTraffic();
	phase.value = "playing";
	announcement.value = stepByStep.value
		? `${selectedConfig.value.label} stage 1 is open. Pip is at the starting curb. ${stepGuidance()}.`
		: `${selectedConfig.value.label} stage 1 is open. Find a safe path to the meadow!`;
	draw();
	startAnimation();
}

function returnToChallengeChoice() {
	stopAnimation();
	phase.value = "idle";
	stage.value = 1;
	lives.value = selectedConfig.value.tries;
	crossings.value = 0;
	score.value = 0;
	resetPlayer();
	resetTraffic();
	announcement.value = "Choose a challenge when you are ready for a new run.";
	draw();
}

function handleChallengeChange() {
	if (challengeSelectionLocked.value) return;
	stage.value = 1;
	lives.value = selectedConfig.value.tries;
	crossings.value = 0;
	score.value = 0;
	phase.value = "idle";
	resetPlayer();
	resetTraffic();
	announcement.value = `${selectedConfig.value.label} selected. ${selectedConfig.value.description}.`;
	draw();
}

function handleTrafficModeChange() {
	if (challengeSelectionLocked.value) return;
	phase.value = "idle";
	stage.value = 1;
	lives.value = selectedConfig.value.tries;
	crossings.value = 0;
	score.value = 0;
	resetPlayer();
	resetTraffic();
	announcement.value =
		trafficMode.value === "step"
			? "Step-by-step traffic selected. Each movement control says whether the next step is clear or blocked."
			: "Continuous traffic selected. Watch the moving cars and choose a safe moment.";
	draw();
}

function toggleGame() {
	if (stepByStep.value && phase.value === "playing") {
		startGame();
		return;
	}
	if (phase.value === "playing") {
		phase.value = "paused";
		announcement.value = "Crossing paused.";
		stopAnimation();
		draw();
		return;
	}
	if (phase.value === "paused") {
		phase.value = "playing";
		announcement.value = "Crossing resumed.";
		draw();
		startAnimation();
		return;
	}
	startGame();
}

function advanceTraffic(elapsed: number) {
	traffic.forEach((car, index) => {
		traffic[index] = projectedCar(car, elapsed);
	});
}

function finishRun(nextPhase: "lost" | "won") {
	phase.value = nextPhase;
	best.value = Math.max(best.value, score.value);
	stopAnimation();
}

function completeStage() {
	crossings.value += 1;
	score.value += 100 * selectedConfig.value.pointMultiplier;
	if (stage.value === STAGE_COUNT) {
		score.value += lives.value * 25;
		finishRun("won");
		announcement.value = `Meadow champion! Pip cleared all three ${selectedConfig.value.label.toLowerCase()} stages with ${score.value} points.`;
		return;
	}

	stage.value += 1;
	resetPlayer();
	resetTraffic();
	lastFrame = 0;
	announcement.value = `Pip reached the meadow! Stage ${stage.value} of ${STAGE_COUNT} is getting busier.${
		stepByStep.value
			? ` Pip is back at the starting curb. ${stepGuidance()}.`
			: ""
	}`;
}

function move(direction: Direction) {
	if (phase.value !== "playing") return;

	const nextPosition = positionAfterMove(direction);
	player.x = nextPosition.x;
	player.y = nextPosition.y;
	playerLocation.value = describePlayerLocation(player.y);

	if (stepByStep.value) {
		advanceTraffic(0.24);
	}
	if (collidesWithTraffic()) {
		handleBump();
		draw();
		return;
	}
	if (player.y <= GOAL_Y) {
		completeStage();
		draw();
		return;
	}

	if (stepByStep.value) {
		const action =
			direction === "wait"
				? "Pip waited safely"
				: `Pip moved ${direction} and is safe`;
		announcement.value = `${action} at the ${playerLocation.value}. ${stepGuidance()}.`;
	}

	draw();
}

function collidesWithTraffic() {
	return collidesAt(player, traffic);
}

function handleBump() {
	lives.value -= 1;
	score.value = Math.max(0, score.value - BUMP_PENALTY);
	resetPlayer();
	resetTraffic();
	lastFrame = 0;
	if (lives.value <= 0) {
		finishRun("lost");
		announcement.value = `Run over. Pip cleared ${crossings.value} stages and scored ${score.value} points.`;
		return;
	}
	announcement.value = `Bump! Pip is safe back at the starting curb. ${lives.value} tries left. ${BUMP_PENALTY} points off.${
		stepByStep.value ? ` ${stepGuidance()}.` : ""
	}`;
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
	animationFrame = 0;
	if (phase.value !== "playing" || reducedMotion.value) return;

	if (!lastFrame) lastFrame = timestamp;
	const elapsed = Math.min(0.04, (timestamp - lastFrame) / 1000);
	lastFrame = timestamp;

	advanceTraffic(elapsed);
	if (collidesWithTraffic()) handleBump();

	draw();
	if (phase.value === "playing") {
		animationFrame = window.requestAnimationFrame(update);
	}
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
		w: "up",
		x: "wait"
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
		if (stepByStep.value && event.repeat) return;
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
	if (document.hidden && phase.value === "playing") {
		phase.value = "paused";
		announcement.value = "Crossing paused while this tab was away.";
		stopAnimation();
		draw();
	}
}

function handleMotionPreferenceChange(event: MediaQueryListEvent) {
	reducedMotion.value = event.matches;
	if (event.matches) {
		trafficMode.value = "step";
		stopAnimation();
		if (phase.value === "playing") {
			announcement.value = `Step-by-step motion is on. Pip is at the ${playerLocation.value}. ${stepGuidance()}.`;
		}
	} else {
		if (phase.value === "playing") {
			announcement.value =
				trafficMode.value === "step"
					? `Step-by-step traffic remains on. Pip is at the ${playerLocation.value}. ${stepGuidance()}.`
					: "Continuous traffic is on. Watch for a safe path.";
		}
		startAnimation();
	}
	draw();
}

onMounted(() => {
	motionPreference =
		window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? null;
	reducedMotion.value = motionPreference?.matches ?? false;
	if (reducedMotion.value) trafficMode.value = "step";
	motionPreference?.addEventListener("change", handleMotionPreferenceChange);
	document.addEventListener("visibilitychange", handleVisibilityChange);
	resetTraffic();
	draw();
});

onBeforeUnmount(() => {
	stopAnimation();
	motionPreference?.removeEventListener(
		"change",
		handleMotionPreferenceChange
	);
	document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>

<template>
	<section
		class="crosswalk-game"
		:data-active-run="challengeSelectionLocked ? 'true' : 'false'"
		:data-challenge="challenge"
		:data-player-location="playerLocation"
		:data-reduced-motion="reducedMotion ? 'true' : 'false'"
		:data-stage="stage"
		:data-stage-speed="speedMultiplier"
		:data-traffic-count="activeTrafficCount"
		:data-traffic-mode="stepByStep ? 'step' : 'continuous'"
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
			<div v-show="!challengeSelectionLocked" class="game-setup">
				<fieldset class="challenge-picker">
					<legend>Choose a challenge</legend>
					<div class="challenge-options">
						<label
							v-for="challengeName in CHALLENGE_ORDER"
							:key="challengeName"
							:class="{
								'challenge-option--selected':
									challenge === challengeName
							}"
							class="challenge-option"
						>
							<input
								v-model="challenge"
								:disabled="challengeSelectionLocked"
								name="crosswalk-challenge"
								:value="challengeName"
								type="radio"
								@change="handleChallengeChange"
							/>
							<span>
								<strong>{{
									CHALLENGE_CONFIGS[challengeName].label
								}}</strong>
								<small>{{
									CHALLENGE_CONFIGS[challengeName].description
								}}</small>
							</span>
						</label>
					</div>
				</fieldset>

				<fieldset class="traffic-mode-picker">
					<legend>Choose how traffic moves</legend>
					<div class="traffic-mode-options">
						<label
							:class="{
								'challenge-option--selected':
									trafficMode === 'continuous' &&
									!reducedMotion
							}"
							class="challenge-option"
						>
							<input
								v-model="trafficMode"
								:disabled="
									challengeSelectionLocked || reducedMotion
								"
								name="crosswalk-traffic-mode"
								type="radio"
								value="continuous"
								@change="handleTrafficModeChange"
							/>
							<span>
								<strong>Moving traffic</strong>
								<small
									>Cars move continuously while you
									cross.</small
								>
							</span>
						</label>
						<label
							:class="{
								'challenge-option--selected': stepByStep
							}"
							class="challenge-option"
						>
							<input
								v-model="trafficMode"
								:disabled="challengeSelectionLocked"
								name="crosswalk-traffic-mode"
								type="radio"
								value="step"
								@change="handleTrafficModeChange"
							/>
							<span>
								<strong>Step-by-step traffic</strong>
								<small
									>Hear clear or blocked choices before every
									move.</small
								>
							</span>
						</label>
					</div>
					<p v-if="reducedMotion" class="motion-note">
						Step-by-step traffic stays on while reduced motion is
						enabled.
					</p>
				</fieldset>
			</div>

			<canvas
				ref="canvas"
				:height="BOARD_HEIGHT"
				:width="BOARD_WIDTH"
				:aria-label="`Crosswalk game board. ${selectedConfig.label} challenge, stage ${stage} of ${STAGE_COUNT}. Pip is at the ${playerLocation}. ${stepByStep ? 'Step-by-step traffic.' : 'Moving traffic.'}`"
				aria-describedby="crosswalk-instructions crosswalk-step-guidance crosswalk-announcement"
				class="game-canvas"
				role="application"
				tabindex="0"
			></canvas>

			<div class="direction-pad" aria-label="Movement controls">
				<button
					:aria-label="moveControlLabel('up')"
					:disabled="phase !== 'playing'"
					type="button"
					@click="move('up')"
				>
					↑
				</button>
				<button
					:aria-label="moveControlLabel('left')"
					:disabled="phase !== 'playing'"
					type="button"
					@click="move('left')"
				>
					←
				</button>
				<button
					:aria-label="moveControlLabel('down')"
					:disabled="phase !== 'playing'"
					type="button"
					@click="move('down')"
				>
					↓
				</button>
				<button
					:aria-label="moveControlLabel('right')"
					:disabled="phase !== 'playing'"
					type="button"
					@click="move('right')"
				>
					→
				</button>
				<button
					v-if="stepByStep"
					:aria-label="moveControlLabel('wait')"
					:disabled="phase !== 'playing'"
					class="wait-button"
					type="button"
					@click="move('wait')"
				>
					Wait
				</button>
			</div>

			<p
				v-show="stepByStep && phase === 'playing'"
				id="crosswalk-step-guidance"
				class="step-guidance"
			>
				<strong>Location:</strong> {{ playerLocation }}.
				<strong>Next step:</strong> {{ stepGuidance() }}.
			</p>

			<p
				id="crosswalk-announcement"
				class="game-announcement"
				aria-live="polite"
			>
				{{ announcement }}
			</p>

			<div class="game-hud" aria-label="Game status">
				<span><strong>Status:</strong> {{ phaseLabel }}</span>
				<span
					><strong>Challenge:</strong>
					{{ selectedConfig.label }}</span
				>
				<span
					><strong>Stage:</strong> {{ stage }} of
					{{ STAGE_COUNT }}</span
				>
				<span><strong>Crossings:</strong> {{ crossings }}</span>
				<span><strong>Score:</strong> {{ score }}</span>
				<span><strong>Tries:</strong> {{ lives }}</span>
				<span><strong>Session best:</strong> {{ best }}</span>
				<span v-if="stepByStep"
					><strong>Traffic:</strong> Step by step</span
				>
			</div>

			<div class="game-actions">
				<button
					class="primary-button"
					type="button"
					@click="toggleGame"
				>
					{{ primaryActionLabel }}
				</button>
				<button
					v-if="challengeSelectionLocked"
					class="secondary-button"
					type="button"
					@click="returnToChallengeChoice"
				>
					Choose another challenge
				</button>
				<p v-if="stepByStep" id="crosswalk-instructions">
					Traffic moves only after Pip moves or waits. Use arrow keys
					or W A S D; press X to wait.
				</p>
				<p v-else id="crosswalk-instructions">
					Keyboard: arrow keys or W A S D. Enter starts or resumes.
				</p>
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

.game-setup {
	display: grid;
	grid-template-columns: minmax(0, 3fr) minmax(15rem, 2fr);
	gap: 1rem;
}

.challenge-picker,
.traffic-mode-picker {
	margin: 0;
	padding: 0;
	border: 0;
}

.challenge-picker legend,
.traffic-mode-picker legend {
	margin-bottom: 0.65rem;
	color: #163b4a;
	font-size: 1rem;
	font-weight: 800;
}

.challenge-options {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 0.65rem;
}

.traffic-mode-options {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.65rem;
}

.motion-note {
	margin-top: 0.55rem;
	color: #526b70;
	font-size: 0.82rem;
	font-weight: 700;
}

.challenge-option {
	display: flex;
	align-items: start;
	gap: 0.65rem;
	min-height: 4.5rem;
	padding: 0.75rem;
	border: 2px solid #b6d6df;
	border-radius: 14px;
	background: #fff;
	color: #163b4a;
	cursor: pointer;
}

.challenge-option--selected {
	border-color: #0f766e;
	background: #e3faf4;
}

.challenge-option:has(input:focus-visible) {
	outline: 3px solid var(--focus-ring-color);
	outline-offset: 2px;
}

.challenge-option:has(input:disabled) {
	cursor: not-allowed;
	opacity: 0.7;
}

.challenge-option input {
	flex: none;
	width: 1.1rem;
	height: 1.1rem;
	margin: 0.15rem 0 0;
	accent-color: #0f766e;
}

.challenge-option span {
	display: grid;
	gap: 0.2rem;
}

.challenge-option small {
	color: #526b70;
	font-size: 0.82rem;
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
	display: block;
	width: 100%;
	height: auto;
	aspect-ratio: 8 / 5;
	border: 3px solid #163b4a;
	border-radius: 19px;
	background: #bdeef7;
	box-shadow: 0 18px 36px -28px rgba(15, 23, 42, 0.7);
	touch-action: pan-y pinch-zoom;
}

.game-canvas:focus-visible {
	outline: 4px solid var(--focus-ring-color);
	outline-offset: 4px;
}

.step-guidance {
	padding: 0.7rem 0.8rem;
	border: 1px solid #99c9d8;
	border-radius: 14px;
	background: #e8f8fc;
	color: #163b4a;
	font-size: 0.9rem;
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
.secondary-button,
.direction-pad button {
	min-height: 3rem;
	border-radius: 14px;
	font-weight: 800;
	cursor: pointer;
}

.primary-button {
	border: 0;
	padding: 0.7rem 1.2rem;
	background: #0f766e;
	color: #fff;
}

.secondary-button {
	padding: 0.65rem 1rem;
	border: 2px solid #0f766e;
	background: transparent;
	color: #0f5f59;
}

.primary-button:focus-visible,
.secondary-button:focus-visible,
.direction-pad button:focus-visible {
	outline: 3px solid var(--focus-ring-color);
	outline-offset: 3px;
}

.direction-pad {
	display: grid;
	grid-template-columns: repeat(3, 3.25rem);
	grid-template-rows: repeat(2, 3.25rem);
	gap: 0.45rem;
	justify-content: center;
}

.direction-pad button {
	border: 0;
	background: #163b4a;
	color: #fff;
	font-size: 1.35rem;
}

.direction-pad button:disabled {
	cursor: not-allowed;
	opacity: 0.45;
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

.direction-pad .wait-button {
	grid-column: 1 / -1;
	grid-row: 3;
	padding-inline: 0.75rem;
	font-size: 0.9rem;
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

:global(html.dark .crosswalk-game .challenge-picker legend) {
	color: #eefaff;
}

:global(html.dark .crosswalk-game .traffic-mode-picker legend) {
	color: #eefaff;
}

:global(html.dark .crosswalk-game .challenge-option) {
	border-color: #315467;
	background: #132a39;
	color: #eefaff;
}

:global(html.dark .crosswalk-game .challenge-option--selected) {
	border-color: #5eead4;
	background: #123f3d;
}

:global(html.dark .crosswalk-game .challenge-option small) {
	color: #bdd1da;
}

:global(html.dark .crosswalk-game .game-hud span) {
	background: #15384a;
	color: #eefaff;
}

:global(html.dark .crosswalk-game .game-actions p) {
	color: #bdd1da;
}

:global(html.dark .crosswalk-game .motion-note) {
	color: #bdd1da;
}

:global(html.dark .crosswalk-game .step-guidance) {
	border-color: #315467;
	background: #15384a;
	color: #eefaff;
}

:global(html.dark .crosswalk-game .secondary-button) {
	border-color: #5eead4;
	color: #bffdf2;
}

@media (max-width: 660px) {
	.game-intro {
		flex-direction: column-reverse;
	}

	.game-setup,
	.challenge-options,
	.traffic-mode-options {
		grid-template-columns: 1fr;
	}

	.crosswalk-game[data-active-run="true"] .game-panel {
		gap: 0.65rem;
	}

	.crosswalk-game[data-active-run="true"] .game-hud {
		max-height: 5.5rem;
		overflow-y: auto;
	}
}

@media (prefers-reduced-motion: reduce) {
	* {
		scroll-behavior: auto !important;
		transition: none !important;
	}
}
</style>
