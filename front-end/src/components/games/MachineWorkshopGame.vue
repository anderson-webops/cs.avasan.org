<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type StationId = "energy" | "gears" | "lights" | "sorter";
type MissionLevel = "advanced" | "middle" | "simple";

interface WorkshopStation {
	color: string;
	id: StationId;
	key: string;
	label: string;
	x: number;
	y: number;
}

interface WorkshopMission {
	description: string;
	id: MissionLevel;
	label: string;
	sequence: readonly StationId[];
}

const CANVAS_WIDTH = 840;
const CANVAS_HEIGHT = 460;
const stations: WorkshopStation[] = [
	{
		color: "#f59e0b",
		id: "energy",
		key: "1",
		label: "Energy wheel",
		x: 32,
		y: 40
	},
	{
		color: "#2dd4bf",
		id: "gears",
		key: "2",
		label: "Gear train",
		x: 432,
		y: 40
	},
	{
		color: "#60a5fa",
		id: "sorter",
		key: "3",
		label: "Signal sorter",
		x: 32,
		y: 242
	},
	{
		color: "#c084fc",
		id: "lights",
		key: "4",
		label: "Memory lights",
		x: 432,
		y: 242
	}
];

const missions: readonly WorkshopMission[] = [
	{
		description: "A four-step tune-up with each station once.",
		id: "simple",
		label: "Simple",
		sequence: ["gears", "lights", "sorter", "energy"]
	},
	{
		description: "A six-step rebuild with two stations repeated.",
		id: "middle",
		label: "Middle",
		sequence: ["energy", "sorter", "gears", "lights", "sorter", "energy"]
	},
	{
		description: "An eight-step master repair with a longer pattern.",
		id: "advanced",
		label: "Advanced",
		sequence: [
			"lights",
			"gears",
			"energy",
			"sorter",
			"gears",
			"lights",
			"sorter",
			"energy"
		]
	}
];

const canvas = ref<HTMLCanvasElement | null>(null);
const selectedLevel = ref<MissionLevel>("simple");
const missionStep = ref(0);
const selected = ref<StationId>("gears");
const energyLevel = ref(0);
const gearTurns = ref(0);
const sortedSignals = ref(0);
const lightStep = ref(0);
const reducedMotion = ref(false);
const announcement = ref("Simple repair ready. Start with the Gear train.");

let animationFrame = 0;
let previousFrameTimestamp: number | null = null;
let energyRotation = 0;
let gearRotation = 0;
let sorterMotionOffset = 0;
let motionPreference: MediaQueryList | null = null;

const selectedStation = computed(
	() => stations.find(station => station.id === selected.value) ?? stations[0]
);
const currentMission = computed(
	() =>
		missions.find(mission => mission.id === selectedLevel.value) ??
		missions[0]
);
const missionComplete = computed(
	() => missionStep.value >= currentMission.value.sequence.length
);
const nextStation = computed(() => {
	const stationId = currentMission.value.sequence[missionStep.value];
	return stations.find(station => station.id === stationId) ?? null;
});
const progressPercent = computed(() =>
	Math.round((missionStep.value / currentMission.value.sequence.length) * 100)
);

function stationStatus(stationId: StationId) {
	if (stationId === "energy") return `Charge ${energyLevel.value} / 5`;
	if (stationId === "gears") return `Turns ${gearTurns.value}`;
	if (stationId === "sorter") return `Signals ${sortedSignals.value}`;
	return `Lights ${lightStep.value} / 8`;
}

function stationLabel(stationId: StationId) {
	return (
		stations.find(station => station.id === stationId)?.label ?? "Station"
	);
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

function drawGear(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	radius: number,
	angle: number,
	color: string
) {
	context.save();
	context.translate(x, y);
	context.rotate(angle);
	context.strokeStyle = color;
	context.lineWidth = 9;
	for (let tooth = 0; tooth < 10; tooth += 1) {
		context.rotate((Math.PI * 2) / 10);
		context.beginPath();
		context.moveTo(radius - 2, 0);
		context.lineTo(radius + 10, 0);
		context.stroke();
	}
	context.fillStyle = color;
	context.beginPath();
	context.arc(0, 0, radius, 0, Math.PI * 2);
	context.fill();
	context.fillStyle = "#f8fafc";
	context.beginPath();
	context.arc(0, 0, radius * 0.34, 0, Math.PI * 2);
	context.fill();
	context.restore();
}

function drawEnergyStation(
	context: CanvasRenderingContext2D,
	station: WorkshopStation
) {
	const centerX = station.x + 165;
	const centerY = station.y + 108;
	const angle = energyLevel.value * 0.5 + energyRotation;
	context.save();
	context.translate(centerX, centerY);
	context.rotate(angle);
	context.strokeStyle = station.color;
	context.lineWidth = 12;
	context.beginPath();
	context.arc(0, 0, 48, 0, Math.PI * 2);
	context.stroke();
	for (let spoke = 0; spoke < 8; spoke += 1) {
		context.rotate(Math.PI / 4);
		context.beginPath();
		context.moveTo(0, 0);
		context.lineTo(45, 0);
		context.stroke();
	}
	context.fillStyle = "#fff7d6";
	context.beginPath();
	context.arc(0, 0, 13 + energyLevel.value * 2, 0, Math.PI * 2);
	context.fill();
	context.restore();

	for (let bolt = 0; bolt < energyLevel.value; bolt += 1) {
		context.fillStyle = bolt % 2 ? "#fef08a" : "#fde047";
		context.beginPath();
		context.arc(
			station.x + 240 + bolt * 18,
			station.y + 112,
			6,
			0,
			Math.PI * 2
		);
		context.fill();
	}
}

function drawGearStation(
	context: CanvasRenderingContext2D,
	station: WorkshopStation
) {
	const movement = gearTurns.value * 0.55 + gearRotation;
	drawGear(
		context,
		station.x + 132,
		station.y + 104,
		42,
		movement,
		"#14b8a6"
	);
	drawGear(
		context,
		station.x + 220,
		station.y + 121,
		31,
		-movement * 1.35,
		"#0f766e"
	);
	context.strokeStyle = "#5eead4";
	context.lineWidth = 5;
	context.beginPath();
	context.moveTo(station.x + 265, station.y + 122);
	context.lineTo(station.x + 328, station.y + 122);
	context.stroke();
}

function drawSorterStation(
	context: CanvasRenderingContext2D,
	station: WorkshopStation
) {
	context.fillStyle = "#1e3a5f";
	roundedRect(context, station.x + 52, station.y + 100, 260, 26, 10);
	context.fill();
	const offset = sortedSignals.value * 24 + sorterMotionOffset;
	const colors = ["#fb7185", "#fde047", "#38bdf8", "#4ade80"];
	colors.forEach((color, index) => {
		context.fillStyle = color;
		context.beginPath();
		context.arc(
			station.x + 65 + ((index * 75 + offset) % 250),
			station.y + 87,
			10,
			0,
			Math.PI * 2
		);
		context.fill();
	});
	context.fillStyle = "#60a5fa";
	context.beginPath();
	context.moveTo(station.x + 310, station.y + 52);
	context.lineTo(station.x + 350, station.y + 92);
	context.lineTo(station.x + 310, station.y + 132);
	context.closePath();
	context.fill();
}

function drawLightStation(
	context: CanvasRenderingContext2D,
	station: WorkshopStation
) {
	const activeCount = lightStep.value;
	for (let light = 0; light < 8; light += 1) {
		const column = light % 4;
		const row = Math.floor(light / 4);
		context.fillStyle = light < activeCount ? "#d8b4fe" : "#403258";
		context.shadowColor = light < activeCount ? "#c084fc" : "transparent";
		context.shadowBlur = light < activeCount ? 16 : 0;
		context.beginPath();
		context.arc(
			station.x + 102 + column * 55,
			station.y + 83 + row * 55,
			15,
			0,
			Math.PI * 2
		);
		context.fill();
	}
	context.shadowBlur = 0;
}

function draw() {
	const context = canvas.value?.getContext("2d");
	if (!context) return;

	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	const background = context.createLinearGradient(
		0,
		0,
		CANVAS_WIDTH,
		CANVAS_HEIGHT
	);
	background.addColorStop(0, "#172554");
	background.addColorStop(0.5, "#12344b");
	background.addColorStop(1, "#1f2942");
	context.fillStyle = background;
	context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	context.strokeStyle = "rgba(148, 213, 235, .28)";
	context.lineWidth = 8;
	context.beginPath();
	context.moveTo(198, 138);
	context.lineTo(420, 138);
	context.lineTo(420, 342);
	context.lineTo(640, 342);
	context.stroke();

	stations.forEach(station => {
		const active = station.id === selected.value;
		context.fillStyle = active
			? "rgba(255,255,255,.15)"
			: "rgba(7,14,30,.38)";
		context.strokeStyle = active ? station.color : "rgba(255,255,255,.14)";
		context.lineWidth = active ? 4 : 2;
		roundedRect(context, station.x, station.y, 376, 178, 20);
		context.fill();
		context.stroke();
		context.fillStyle = "#f8fafc";
		context.font = "700 19px Avenir Next, sans-serif";
		context.textAlign = "left";
		context.fillText(
			`${station.key}. ${station.label}`,
			station.x + 20,
			station.y + 30
		);
	});

	drawEnergyStation(context, stations[0]);
	drawGearStation(context, stations[1]);
	drawSorterStation(context, stations[2]);
	drawLightStation(context, stations[3]);
}

function hasMovingStation() {
	return (
		energyLevel.value > 0 || gearTurns.value > 0 || sortedSignals.value > 0
	);
}

function animate(timestamp: number) {
	animationFrame = 0;
	if (document.hidden || reducedMotion.value || !hasMovingStation()) {
		previousFrameTimestamp = null;
		draw();
		return;
	}

	if (previousFrameTimestamp !== null) {
		const elapsed = Math.min(
			50,
			Math.max(0, timestamp - previousFrameTimestamp)
		);
		energyRotation += elapsed * 0.0002 * energyLevel.value;
		gearRotation += elapsed * 0.00012 * Math.min(gearTurns.value, 4);
		sorterMotionOffset =
			(sorterMotionOffset +
				elapsed * 0.025 * Math.min(sortedSignals.value, 4)) %
			90;
	}
	previousFrameTimestamp = timestamp;
	draw();
	animationFrame = window.requestAnimationFrame(animate);
}

function startAnimation() {
	if (
		reducedMotion.value ||
		document.hidden ||
		animationFrame ||
		!hasMovingStation()
	) {
		return;
	}
	animationFrame = window.requestAnimationFrame(animate);
}

function stopAnimation() {
	if (animationFrame) window.cancelAnimationFrame(animationFrame);
	animationFrame = 0;
	previousFrameTimestamp = null;
}

function activate(stationId: StationId) {
	selected.value = stationId;
	let actionMessage = "";
	if (stationId === "energy") {
		energyLevel.value = (energyLevel.value % 5) + 1;
		actionMessage = `The energy wheel sent ${energyLevel.value} bright ${energyLevel.value === 1 ? "pulse" : "pulses"} through the workshop.`;
	}
	if (stationId === "gears") {
		gearTurns.value += 1;
		actionMessage =
			"The large gear turns the smaller gear in the opposite direction.";
	}
	if (stationId === "sorter") {
		sortedSignals.value += 1;
		actionMessage =
			"The signal sorter guided colorful messages along the blue path.";
	}
	if (stationId === "lights") {
		lightStep.value = (lightStep.value % 8) + 1;
		actionMessage =
			"The memory lights changed their pattern and kept it on the panel.";
	}

	if (missionComplete.value) {
		announcement.value = `${actionMessage} The ${currentMission.value.label} repair is already complete. Keep experimenting or choose another mission.`;
	} else if (nextStation.value?.id === stationId) {
		missionStep.value += 1;
		if (missionComplete.value) {
			announcement.value = `${actionMessage} ${currentMission.value.label} repair complete! Every station is running in the right order.`;
		} else {
			announcement.value = `${actionMessage} Step ${missionStep.value} complete. Next: ${nextStation.value?.label}.`;
		}
	} else {
		announcement.value = `${actionMessage} The mission pattern still needs ${nextStation.value?.label} next.`;
	}
	draw();
	if (hasMovingStation()) startAnimation();
}

function resetWorkshop() {
	stopAnimation();
	missionStep.value = 0;
	selected.value = currentMission.value.sequence[0] ?? "energy";
	energyLevel.value = 0;
	gearTurns.value = 0;
	sortedSignals.value = 0;
	lightStep.value = 0;
	energyRotation = 0;
	gearRotation = 0;
	sorterMotionOffset = 0;
	announcement.value = `${currentMission.value.label} repair ready. Start with the ${nextStation.value?.label}.`;
	draw();
}

function selectMission(level: MissionLevel) {
	if (level === selectedLevel.value) return;
	selectedLevel.value = level;
	resetWorkshop();
}

function handleKeydown(event: KeyboardEvent) {
	const stationByKey: Partial<Record<string, StationId>> = {
		"1": "energy",
		"2": "gears",
		"3": "sorter",
		"4": "lights",
		e: "energy",
		g: "gears",
		l: "lights",
		s: "sorter"
	};
	const stationId = stationByKey[event.key.toLowerCase()];
	if (stationId) {
		event.preventDefault();
		activate(stationId);
		return;
	}
	if (event.key.toLowerCase() === "r") {
		event.preventDefault();
		resetWorkshop();
	}
}

function handleCanvasPointer(event: PointerEvent) {
	const target = canvas.value;
	if (!target) return;
	const bounds = target.getBoundingClientRect();
	if (!bounds.width || !bounds.height) return;
	const x = ((event.clientX - bounds.left) / bounds.width) * CANVAS_WIDTH;
	const y = ((event.clientY - bounds.top) / bounds.height) * CANVAS_HEIGHT;
	const station = stations.find(
		item =>
			x >= item.x && x <= item.x + 376 && y >= item.y && y <= item.y + 178
	);
	if (station) activate(station.id);
}

function handleVisibilityChange() {
	if (document.hidden) {
		stopAnimation();
		return;
	}
	if (hasMovingStation()) startAnimation();
}

function handleMotionPreferenceChange(event: MediaQueryListEvent) {
	reducedMotion.value = event.matches;
	if (event.matches) {
		stopAnimation();
		announcement.value =
			"Step-by-step motion is on. The machine stays still between choices.";
	} else {
		announcement.value =
			"Continuous motion is on. The active stations are running again.";
		if (hasMovingStation()) startAnimation();
	}
	draw();
}

onMounted(() => {
	motionPreference =
		window.matchMedia?.("(prefers-reduced-motion: reduce)") ?? null;
	reducedMotion.value = motionPreference?.matches ?? false;
	motionPreference?.addEventListener("change", handleMotionPreferenceChange);
	document.addEventListener("visibilitychange", handleVisibilityChange);
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
		class="machine-workshop"
		:data-reduced-motion="reducedMotion ? 'true' : 'false'"
		@keydown="handleKeydown"
	>
		<header class="workshop-intro">
			<div>
				<h1>Machine Workshop</h1>
				<p>
					Choose a repair mission, then operate the stations in order.
					Every tap changes the machine, and a different station can
					still be explored without losing progress.
				</p>
			</div>
			<RouterLink class="back-link" to="/games">All games</RouterLink>
		</header>

		<div class="workshop-panel">
			<div
				class="mission-picker"
				aria-label="Repair mission difficulty"
				role="group"
			>
				<button
					v-for="mission in missions"
					:key="mission.id"
					:aria-pressed="selectedLevel === mission.id"
					:class="{ active: selectedLevel === mission.id }"
					type="button"
					@click="selectMission(mission.id)"
				>
					<strong>{{ mission.label }}</strong>
					<span>{{ mission.description }}</span>
				</button>
			</div>

			<section
				class="mission-card"
				:data-mission-complete="missionComplete ? 'true' : 'false'"
			>
				<div class="mission-summary">
					<p>{{ currentMission.label }} repair mission</p>
					<h2 v-if="missionComplete">Repair complete!</h2>
					<h2 v-else>Next: {{ nextStation?.label }}</h2>
				</div>
				<div class="mission-progress">
					<span id="machine-mission-progress-label">
						Progress: {{ missionStep }} of
						{{ currentMission.sequence.length }}
					</span>
					<progress
						:max="currentMission.sequence.length"
						:value="missionStep"
						aria-labelledby="machine-mission-progress-label"
					>
						{{ progressPercent }}%
					</progress>
				</div>
				<ol class="mission-steps" aria-label="Ordered repair steps">
					<li
						v-for="(stationId, index) in currentMission.sequence"
						:key="`${index}-${stationId}`"
						:class="{
							current: !missionComplete && index === missionStep,
							done: index < missionStep
						}"
					>
						<span aria-hidden="true">{{ index + 1 }}</span>
						<strong>{{ stationLabel(stationId) }}</strong>
						<small v-if="index < missionStep">Done</small>
						<small
							v-else-if="
								index === missionStep && !missionComplete
							"
							>Next</small
						>
					</li>
				</ol>
			</section>

			<div class="workshop-badges" aria-label="Workshop information">
				<span
					><strong>Selected:</strong>
					{{ selectedStation.label }}</span
				>
				<span
					><strong>Mission:</strong> {{ currentMission.label }}</span
				>
				<span>No timer · No wrong answers</span>
				<span v-if="reducedMotion"
					>Motion stays still between choices</span
				>
			</div>

			<canvas
				ref="canvas"
				:height="CANVAS_HEIGHT"
				:width="CANVAS_WIDTH"
				:aria-label="`Interactive repair machine. ${missionStep} of ${currentMission.sequence.length} mission steps complete.`"
				aria-describedby="machine-workshop-instructions machine-workshop-announcement"
				class="workshop-canvas"
				:data-energy-level="energyLevel"
				:data-gear-turns="gearTurns"
				:data-light-step="lightStep"
				:data-sorted-signals="sortedSignals"
				role="img"
				@pointerdown="handleCanvasPointer"
			></canvas>

			<p
				id="machine-workshop-announcement"
				class="workshop-announcement"
				aria-live="polite"
			>
				{{ announcement }}
			</p>

			<div
				class="station-controls"
				aria-label="Machine station controls"
				role="group"
			>
				<button
					v-for="station in stations"
					:key="station.id"
					:aria-pressed="selected === station.id"
					:class="{
						active: selected === station.id,
						expected:
							!missionComplete && nextStation?.id === station.id
					}"
					type="button"
					@click="activate(station.id)"
				>
					<span class="station-key" aria-hidden="true">{{
						station.key
					}}</span>
					<span class="station-control-copy">
						<strong>{{ station.label }}</strong>
						<small>{{ stationStatus(station.id) }}</small>
					</span>
				</button>
			</div>

			<div class="workshop-footer">
				<p id="machine-workshop-instructions">
					Keyboard: 1–4 or E, G, S, L. Press R to reset the workshop.
				</p>
				<button
					class="reset-button"
					type="button"
					@click="resetWorkshop"
				>
					Reset workshop
				</button>
			</div>
		</div>
	</section>
</template>

<style scoped>
.machine-workshop {
	--game-heading-color: #29435f;

	width: min(1080px, calc(100% - 2rem));
	margin-inline: auto;
	padding: clamp(1.5rem, 4vw, 3.5rem) 0 clamp(3rem, 6vw, 5rem);
	display: grid;
	gap: 1.5rem;
}

.workshop-intro {
	display: flex;
	justify-content: space-between;
	align-items: start;
	gap: 1.5rem;
}

.workshop-intro > div {
	display: grid;
	gap: 0.65rem;
	max-width: 46rem;
}

.workshop-intro h1 {
	font-size: clamp(2.5rem, 7vw, 5rem);
	color: var(--game-heading-color);
}

.workshop-intro p {
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

.workshop-panel {
	padding: clamp(0.7rem, 2vw, 1.2rem);
	border: 1px solid rgba(96, 165, 250, 0.28);
	border-radius: 28px;
	background: #f6f8ff;
	box-shadow: 0 24px 60px -40px rgba(15, 23, 42, 0.5);
	display: grid;
	gap: 1rem;
}

.mission-picker {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 0.65rem;
}

.mission-picker button {
	min-height: 4.5rem;
	padding: 0.75rem;
	border: 1px solid rgba(41, 67, 95, 0.2);
	border-radius: 15px;
	background: #fff;
	color: #29435f;
	cursor: pointer;
	display: grid;
	gap: 0.2rem;
	text-align: left;
}

.mission-picker button strong {
	font-size: 1rem;
}

.mission-picker button span {
	color: #526b70;
	font-size: 0.82rem;
	line-height: 1.3;
}

.mission-picker button.active {
	border-color: #2563eb;
	background: #e9f2ff;
	box-shadow: inset 0 0 0 1px #2563eb;
}

.mission-card {
	padding: 0.9rem;
	border: 1px solid #c4d8f4;
	border-radius: 18px;
	background: #edf5ff;
	display: grid;
	gap: 0.8rem;
}

.mission-card[data-mission-complete="true"] {
	border-color: #34a36f;
	background: #e8f8ef;
}

.mission-summary {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	justify-content: space-between;
	gap: 0.35rem 1rem;
}

.mission-summary p {
	color: #526b70;
	font-size: 0.84rem;
	font-weight: 800;
	letter-spacing: 0.04em;
	text-transform: uppercase;
}

.mission-summary h2 {
	color: #243b63;
	font-size: clamp(1.2rem, 3vw, 1.65rem);
}

.mission-progress {
	display: grid;
	grid-template-columns: auto minmax(8rem, 1fr);
	align-items: center;
	gap: 0.65rem;
	color: #29435f;
	font-size: 0.88rem;
	font-weight: 800;
}

.mission-progress progress {
	width: 100%;
	height: 0.8rem;
	accent-color: #2563eb;
}

.mission-steps {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(7.5rem, 1fr));
	gap: 0.45rem;
	padding: 0;
	list-style: none;
}

.mission-steps li {
	min-height: 2.6rem;
	padding: 0.45rem;
	border: 1px solid #c7d4e6;
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.78);
	color: #526b70;
	display: grid;
	grid-template-columns: auto 1fr;
	align-items: center;
	gap: 0.15rem 0.4rem;
	font-size: 0.78rem;
}

.mission-steps li > span {
	grid-row: 1 / span 2;
	display: grid;
	width: 1.5rem;
	height: 1.5rem;
	place-items: center;
	border-radius: 50%;
	background: #dce8f8;
	font-weight: 900;
}

.mission-steps li strong {
	color: #29435f;
}

.mission-steps li small {
	font-weight: 800;
}

.mission-steps li.current {
	border-color: #f59e0b;
	background: #fff8df;
}

.mission-steps li.done {
	border-color: #34a36f;
	background: #edf9f2;
}

.mission-steps li.done > span {
	background: #c8efd8;
}

.workshop-badges {
	display: flex;
	flex-wrap: wrap;
	gap: 0.55rem;
}

.workshop-badges span {
	padding: 0.42rem 0.7rem;
	border-radius: 999px;
	background: #e5edff;
	color: #243b63;
	font-size: 0.9rem;
}

.workshop-canvas {
	width: 100%;
	border: 3px solid #263755;
	border-radius: 19px;
	background: #172554;
	box-shadow: 0 18px 36px -28px rgba(15, 23, 42, 0.7);
	cursor: pointer;
	touch-action: manipulation;
}

.workshop-announcement {
	min-height: 1.6rem;
	font-weight: 700;
	color: #29435f;
}

.station-controls {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 0.65rem;
}

.station-controls button,
.reset-button {
	min-height: 3rem;
	border: 1px solid rgba(41, 67, 95, 0.2);
	border-radius: 14px;
	background: #fff;
	color: #29435f;
	font-weight: 800;
	cursor: pointer;
}

.station-controls button {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	padding: 0.65rem;
}

.station-controls button .station-key {
	display: grid;
	width: 1.6rem;
	height: 1.6rem;
	place-items: center;
	border-radius: 50%;
	background: #e7e8fa;
}

.station-control-copy {
	display: grid;
	gap: 0.08rem;
	text-align: left;
}

.station-control-copy small {
	color: #526b70;
	font-size: 0.75rem;
	font-weight: 700;
}

.station-controls button.active {
	border-color: #7c3aed;
	background: #f2eafe;
	box-shadow: inset 0 0 0 1px #7c3aed;
}

.station-controls button.expected {
	border-color: #f59e0b;
	box-shadow: inset 0 0 0 2px #f59e0b;
}

.workshop-footer {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.8rem;
}

.workshop-footer p {
	font-size: 0.91rem;
	color: #526b70;
}

.reset-button {
	padding: 0.65rem 1rem;
}

:global(html.dark .machine-workshop) {
	--game-heading-color: #edf7ff;
}

:global(html.dark .machine-workshop .workshop-announcement) {
	color: #cfe7ff;
}

:global(html.dark .machine-workshop .workshop-panel) {
	background: #0b1527;
}

:global(html.dark .machine-workshop .mission-picker button) {
	border-color: rgba(148, 213, 235, 0.28);
	background: #15243b;
	color: #edf6ff;
}

:global(html.dark .machine-workshop .mission-picker button span),
:global(html.dark .machine-workshop .mission-summary p),
:global(html.dark .machine-workshop .station-control-copy small) {
	color: #bdd1da;
}

:global(html.dark .machine-workshop .mission-picker button.active) {
	border-color: #60a5fa;
	background: #1d3559;
}

:global(html.dark .machine-workshop .mission-card) {
	border-color: #31537e;
	background: #12233d;
}

:global(
	html.dark .machine-workshop .mission-card[data-mission-complete="true"]
) {
	border-color: #4ade80;
	background: #123326;
}

:global(html.dark .machine-workshop .mission-summary h2),
:global(html.dark .machine-workshop .mission-progress),
:global(html.dark .machine-workshop .mission-steps li strong) {
	color: #edf6ff;
}

:global(html.dark .machine-workshop .mission-steps li) {
	border-color: #31537e;
	background: #172b49;
	color: #bdd1da;
}

:global(html.dark .machine-workshop .mission-steps li.current) {
	border-color: #fbbf24;
	background: #3a3017;
}

:global(html.dark .machine-workshop .mission-steps li.done) {
	border-color: #4ade80;
	background: #153626;
}

:global(html.dark .machine-workshop .workshop-badges span) {
	background: #192e52;
	color: #edf6ff;
}

:global(html.dark .machine-workshop .station-controls button),
:global(html.dark .machine-workshop .reset-button) {
	border-color: rgba(148, 213, 235, 0.28);
	background: #15243b;
	color: #edf6ff;
}

:global(html.dark .machine-workshop .station-controls button.active) {
	border-color: #c084fc;
	background: #31214a;
}

:global(html.dark .machine-workshop .station-controls button.expected) {
	border-color: #fbbf24;
	box-shadow: inset 0 0 0 2px #fbbf24;
}

:global(html.dark .machine-workshop .workshop-footer p) {
	color: #bdd1da;
}

@media (max-width: 760px) {
	.workshop-intro {
		flex-direction: column-reverse;
	}

	.station-controls {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}

	.mission-picker {
		grid-template-columns: 1fr;
	}
}

@media (max-width: 480px) {
	.station-controls {
		grid-template-columns: 1fr;
	}
}

@media (prefers-reduced-motion: reduce) {
	* {
		transition: none !important;
	}
}
</style>
