<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type StationId = "energy" | "gears" | "lights" | "sorter";

interface WorkshopStation {
	color: string;
	id: StationId;
	key: string;
	label: string;
	x: number;
	y: number;
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

const canvas = ref<HTMLCanvasElement | null>(null);
const selected = ref<StationId>("energy");
const energyLevel = ref(1);
const gearTurns = ref(0);
const sortedSignals = ref(0);
const lightStep = ref(0);
const reducedMotion = ref(false);
const announcement = ref(
	"The workshop is ready. Pick any station and see what changes."
);

let animationFrame = 0;
let lastTimestamp = 0;

const selectedStation = computed(
	() => stations.find(station => station.id === selected.value) ?? stations[0]
);

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
	station: WorkshopStation,
	clock: number
) {
	const centerX = station.x + 165;
	const centerY = station.y + 108;
	const angle = reducedMotion.value
		? energyLevel.value * 0.35
		: clock * 0.001;
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
	station: WorkshopStation,
	clock: number
) {
	const movement = reducedMotion.value
		? gearTurns.value * 0.2
		: clock * 0.0008;
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
	station: WorkshopStation,
	clock: number
) {
	context.fillStyle = "#1e3a5f";
	roundedRect(context, station.x + 52, station.y + 100, 260, 26, 10);
	context.fill();
	const offset = reducedMotion.value
		? sortedSignals.value * 24
		: (clock * 0.08) % 90;
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
	const activeCount = (lightStep.value % 8) + 1;
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

function draw(clock = 0) {
	lastTimestamp = clock;
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

	drawEnergyStation(context, stations[0], clock);
	drawGearStation(context, stations[1], clock);
	drawSorterStation(context, stations[2], clock);
	drawLightStation(context, stations[3]);
}

function animate(timestamp: number) {
	draw(timestamp);
	animationFrame = window.requestAnimationFrame(animate);
}

function activate(stationId: StationId) {
	selected.value = stationId;
	if (stationId === "energy") {
		energyLevel.value = (energyLevel.value % 5) + 1;
		announcement.value = `The energy wheel sent ${energyLevel.value} bright pulses through the workshop.`;
	}
	if (stationId === "gears") {
		gearTurns.value += 1;
		announcement.value =
			"The large gear turns the smaller gear in the opposite direction.";
	}
	if (stationId === "sorter") {
		sortedSignals.value += 1;
		announcement.value =
			"The signal sorter guided colorful messages along the blue path.";
	}
	if (stationId === "lights") {
		lightStep.value += 1;
		announcement.value =
			"The memory lights changed their pattern and kept it on the panel.";
	}
	draw(lastTimestamp);
}

function resetWorkshop() {
	selected.value = "energy";
	energyLevel.value = 1;
	gearTurns.value = 0;
	sortedSignals.value = 0;
	lightStep.value = 0;
	announcement.value = "The workshop is reset and ready for more exploring.";
	draw(lastTimestamp);
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

onMounted(() => {
	reducedMotion.value =
		window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
		false;
	draw();
	if (!reducedMotion.value)
		animationFrame = window.requestAnimationFrame(animate);
});

onBeforeUnmount(() => {
	window.cancelAnimationFrame(animationFrame);
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
					Tap, click, or use the number keys to wake up each part of
					the machine. Explore in any order and notice how the parts
					connect.
				</p>
			</div>
			<RouterLink class="back-link" to="/games">All games</RouterLink>
		</header>

		<div class="workshop-panel">
			<div class="workshop-badges" aria-label="Workshop information">
				<span
					><strong>Selected:</strong>
					{{ selectedStation.label }}</span
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
				aria-label="Interactive machine with an energy wheel, gear train, signal sorter, and memory lights."
				class="workshop-canvas"
				role="img"
				tabindex="0"
				@pointerdown="handleCanvasPointer"
			></canvas>

			<p class="workshop-announcement" aria-live="polite">
				{{ announcement }}
			</p>

			<div class="station-controls" aria-label="Machine station controls">
				<button
					v-for="station in stations"
					:key="station.id"
					:aria-pressed="selected === station.id"
					:class="{ active: selected === station.id }"
					type="button"
					@click="activate(station.id)"
				>
					<span aria-hidden="true">{{ station.key }}</span>
					{{ station.label }}
				</button>
			</div>

			<div class="workshop-footer">
				<p>
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

.station-controls button span {
	display: grid;
	width: 1.6rem;
	height: 1.6rem;
	place-items: center;
	border-radius: 50%;
	background: #e7e8fa;
}

.station-controls button.active {
	border-color: #7c3aed;
	background: #f2eafe;
	box-shadow: inset 0 0 0 1px #7c3aed;
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
