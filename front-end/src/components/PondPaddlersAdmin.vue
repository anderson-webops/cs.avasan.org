<script lang="ts" setup>
import type {
	PondPaddlersAdminRoom,
	PondPaddlersOperation,
	PondPaddlersRaceFormat
} from "@/modules/pondPaddlersAdmin";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { clearAdminSessionOnAuthorizationError } from "@/modules/adminSession";
import {
	closePondPaddlersRoom,
	createPondPaddlersRoom,
	listPondPaddlersRooms,
	POND_PADDLERS_OPERATIONS,
	startPondPaddlersRoom
} from "@/modules/pondPaddlersAdmin";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "PondPaddlersAdmin" });

type QuestionPreset = "challenge" | "custom" | "mixed" | "starter";

const POND_PADDLERS_STUDENT_URL = "https://cs.avasan.org/games/pond-paddlers";
const LOBBY_REFRESH_INTERVAL_MS = 5_000;
const QUESTION_PRESETS: Record<
	Exclude<QuestionPreset, "custom">,
	{
		finishAt: number;
		maxOperand: number;
		operations: PondPaddlersOperation[];
	}
> = {
	challenge: {
		finishAt: 15,
		maxOperand: 20,
		operations: [...POND_PADDLERS_OPERATIONS]
	},
	mixed: {
		finishAt: 10,
		maxOperand: 10,
		operations: [...POND_PADDLERS_OPERATIONS]
	},
	starter: {
		finishAt: 5,
		maxOperand: 10,
		operations: ["add", "subtract"]
	}
};

const app = useAppStore();
const rooms = ref<PondPaddlersAdminRoom[]>([]);
const operations = ref<PondPaddlersOperation[]>([...POND_PADDLERS_OPERATIONS]);
const maxOperand = ref(10);
const finishAt = ref(10);
const durationMinutes = ref(60);
const calmMode = ref(true);
const raceFormat = ref<PondPaddlersRaceFormat>("individual");
const questionPreset = ref<QuestionPreset>("mixed");
const loading = ref(true);
const creating = ref(false);
const closingRoomCode = ref("");
const startingRoomCode = ref("");
const confirmingClose = ref("");
const error = ref("");
const notice = ref("");
const adminSection = ref<HTMLElement | null>(null);
const closeTriggerRoomCode = ref("");
const noticeElement = ref<HTMLElement | null>(null);
let roomRefreshInFlight = false;
let roomMutationRevision = 0;
let lobbyRefreshTimer: ReturnType<typeof setInterval> | null = null;
const noPaddlersMessage =
	"At least one paddler must join before the race starts.";

const canCreate = computed(
	() => operations.value.length > 0 && !creating.value
);

const operationLabels: Record<PondPaddlersOperation, string> = {
	add: "Addition",
	divide: "Division",
	multiply: "Multiplication",
	subtract: "Subtraction"
};

const raceFormatLabels: Record<PondPaddlersRaceFormat, string> = {
	individual: "One student per device",
	"team-device": "One team per device"
};

function applyQuestionPreset() {
	if (questionPreset.value === "custom") return;
	const preset = QUESTION_PRESETS[questionPreset.value];
	operations.value = [...preset.operations];
	maxOperand.value = preset.maxOperand;
	finishAt.value = preset.finishAt;
}

function markQuestionsCustom() {
	questionPreset.value = "custom";
}

function friendlyError(caught: unknown) {
	if (clearAdminSessionOnAuthorizationError(caught, app)) return "";
	if (
		caught &&
		typeof caught === "object" &&
		"response" in caught &&
		caught.response &&
		typeof caught.response === "object"
	) {
		const response = caught.response as {
			data?: { message?: unknown };
			status?: unknown;
		};
		if (
			response.status === 409 &&
			response.data?.message === noPaddlersMessage
		) {
			return noPaddlersMessage;
		}
	}
	return "Couldn’t update Pond Paddlers rooms. Please try again.";
}

function formatTime(value: string) {
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? "soon"
		: new Intl.DateTimeFormat("en-US", {
				hour: "numeric",
				minute: "2-digit"
			}).format(date);
}

function statusLabel(status: PondPaddlersAdminRoom["status"]) {
	if (status === "waiting") return "Lobby open";
	if (status === "finished") return "Race finished";
	return "Race in progress";
}

async function loadRooms(quiet = false) {
	if (roomRefreshInFlight) return;
	roomRefreshInFlight = true;
	if (!quiet) loading.value = true;
	if (!quiet) error.value = "";
	const mutationRevisionAtRequestStart = roomMutationRevision;
	try {
		const listedRooms = await listPondPaddlersRooms();
		if (mutationRevisionAtRequestStart === roomMutationRevision) {
			rooms.value = listedRooms;
		}
	} catch (caught) {
		const message = friendlyError(caught);
		if (!quiet) error.value = message;
	} finally {
		roomRefreshInFlight = false;
		if (!quiet) loading.value = false;
	}
}

function roomSettings() {
	return {
		calmMode: calmMode.value,
		durationMinutes: durationMinutes.value,
		finishAt: finishAt.value,
		maxOperand: maxOperand.value,
		operations: [...operations.value],
		raceFormat: raceFormat.value
	};
}

function addCreatedRoom(room: PondPaddlersAdminRoom) {
	roomMutationRevision += 1;
	rooms.value = [
		room,
		...rooms.value.filter(item => item.roomCode !== room.roomCode)
	];
	notice.value = `Room ${room.roomCode} is ready.`;
}

async function createRoom() {
	if (!canCreate.value) return;
	creating.value = true;
	error.value = "";
	notice.value = "";
	try {
		const room = await createPondPaddlersRoom(roomSettings());
		addCreatedRoom(room);
	} catch (caught) {
		error.value = friendlyError(caught);
	} finally {
		creating.value = false;
	}
}

async function copyRoomCode(roomCode: string) {
	notice.value = "";
	try {
		await navigator.clipboard.writeText(roomCode);
		notice.value = `Copied room ${roomCode}.`;
	} catch {
		notice.value = `Room code: ${roomCode}`;
	}
}

function studentInstructions(room: PondPaddlersAdminRoom) {
	const directions =
		`Open ${POND_PADDLERS_STUDENT_URL} and enter room code ${room.roomCode}. ` +
		"Keep the page open until Julio starts the race.";
	return room.raceFormat === "team-device"
		? `Julio will form teams in the classroom. Each team should open ${POND_PADDLERS_STUDENT_URL} on one shared device and enter the same room code ${room.roomCode}. Each device will receive a random paddler. Keep the page open until Julio starts the race, and take turns after every correct answer.`
		: directions;
}

async function copyStudentInstructions(room: PondPaddlersAdminRoom) {
	notice.value = "";
	try {
		await navigator.clipboard.writeText(studentInstructions(room));
		notice.value = `Copied student instructions for room ${room.roomCode}.`;
	} catch {
		notice.value = studentInstructions(room);
	}
}

async function startRoom(roomCode: string) {
	const room = rooms.value.find(candidate => candidate.roomCode === roomCode);
	if (startingRoomCode.value || !room || room.status !== "waiting") {
		return;
	}
	startingRoomCode.value = roomCode;
	error.value = "";
	notice.value = "";
	try {
		const updatedRoom = await startPondPaddlersRoom(roomCode);
		roomMutationRevision += 1;
		rooms.value = rooms.value.map(room =>
			room.roomCode === roomCode ? updatedRoom : room
		);
		notice.value = `Race ${roomCode} has started.`;
		await nextTick();
		noticeElement.value?.focus();
	} catch (caught) {
		error.value = friendlyError(caught);
	} finally {
		startingRoomCode.value = "";
	}
}

async function beginClose(roomCode: string) {
	closeTriggerRoomCode.value = roomCode;
	confirmingClose.value = roomCode;
	await nextTick();
	adminSection.value
		?.querySelector<HTMLButtonElement>(".pond-admin__close-confirm")
		?.focus();
}

async function cancelClose() {
	const roomCode = closeTriggerRoomCode.value;
	confirmingClose.value = "";
	await nextTick();
	adminSection.value
		?.querySelector<HTMLButtonElement>(
			`[data-pond-close-room="${roomCode}"]`
		)
		?.focus();
	closeTriggerRoomCode.value = "";
}

async function closeRoom(roomCode: string) {
	closingRoomCode.value = roomCode;
	error.value = "";
	notice.value = "";
	try {
		await closePondPaddlersRoom(roomCode);
		roomMutationRevision += 1;
		rooms.value = rooms.value.filter(room => room.roomCode !== roomCode);
		confirmingClose.value = "";
		notice.value = `Room ${roomCode} is closed.`;
		closeTriggerRoomCode.value = "";
		await nextTick();
		noticeElement.value?.focus();
	} catch (caught) {
		error.value = friendlyError(caught);
	} finally {
		closingRoomCode.value = "";
	}
}

onMounted(() => {
	void loadRooms();
	lobbyRefreshTimer = setInterval(() => {
		if (rooms.value.length > 0) {
			void loadRooms(true);
		}
	}, LOBBY_REFRESH_INTERVAL_MS);
});

onBeforeUnmount(() => {
	if (lobbyRefreshTimer) clearInterval(lobbyRefreshTimer);
	lobbyRefreshTimer = null;
});
</script>

<template>
	<section
		ref="adminSection"
		class="pond-admin"
		aria-labelledby="pond-admin-title"
	>
		<div class="pond-admin__heading">
			<div>
				<p class="pond-admin__eyebrow">Class game</p>
				<h2 id="pond-admin-title">Pond Paddlers rooms</h2>
				<p>
					Create a private arithmetic race, share its code, and start
					when the class is ready. Room status refreshes
					automatically.
				</p>
			</div>
			<button
				class="site-button site-button--secondary"
				:disabled="loading"
				type="button"
				@click="loadRooms()"
			>
				{{ loading ? "Refreshing…" : "Refresh rooms" }}
			</button>
		</div>

		<form class="pond-admin__form" @submit.prevent="createRoom">
			<div class="pond-admin__settings pond-admin__settings--primary">
				<label>
					Race format
					<select v-model="raceFormat" data-pond-race-format>
						<option value="individual">
							One student per device
						</option>
						<option value="team-device">One team per device</option>
					</select>
				</label>
				<label>
					Question set
					<select
						v-model="questionPreset"
						data-pond-question-preset
						@change="applyQuestionPreset"
					>
						<option value="starter">Starter</option>
						<option value="mixed">Mixed</option>
						<option value="challenge">Challenge</option>
						<option value="custom">Custom</option>
					</select>
				</label>
			</div>

			<p class="pond-admin__preset-help">
				<template v-if="questionPreset === 'starter'">
					Starter uses addition and subtraction with operands through
					10; first to 5 correct wins.
				</template>
				<template v-else-if="questionPreset === 'mixed'">
					Mixed uses all four operations with operands through 10;
					first to 10 correct wins.
				</template>
				<template v-else-if="questionPreset === 'challenge'">
					Challenge uses all four operations with operands through 20;
					first to 15 correct wins.
				</template>
				<template v-else>
					Custom lets you choose each arithmetic setting below.
				</template>
			</p>

			<fieldset>
				<legend>Questions</legend>
				<div class="pond-admin__checks">
					<label
						v-for="operation in POND_PADDLERS_OPERATIONS"
						:key="operation"
					>
						<input
							v-model="operations"
							:name="`pond-operation-${operation}`"
							type="checkbox"
							:value="operation"
							@change="markQuestionsCustom"
						/>
						{{ operationLabels[operation] }}
					</label>
				</div>
			</fieldset>

			<div class="pond-admin__settings">
				<label>
					Largest operand
					<select
						v-model="maxOperand"
						data-pond-max-operand
						@change="markQuestionsCustom"
					>
						<option :value="10">10</option>
						<option :value="20">20</option>
						<option :value="50">50</option>
						<option :value="100">100</option>
					</select>
				</label>
				<label>
					Questions to finish
					<select
						v-model="finishAt"
						data-pond-finish-at
						@change="markQuestionsCustom"
					>
						<option :value="5">5</option>
						<option :value="10">10</option>
						<option :value="15">15</option>
						<option :value="20">20</option>
						<option :value="30">30</option>
					</select>
				</label>
				<label>
					Room closes after
					<select v-model="durationMinutes">
						<option :value="30">30 minutes</option>
						<option :value="60">1 hour</option>
						<option :value="90">90 minutes</option>
						<option :value="120">2 hours</option>
					</select>
				</label>
			</div>

			<label class="pond-admin__calm">
				<input v-model="calmMode" type="checkbox" />
				<span>
					<strong>Calm motion</strong>
					Keep the race animation gentle.
				</span>
			</label>

			<p
				v-if="raceFormat === 'team-device'"
				class="pond-admin__team-help"
			>
				Julio forms teams in the classroom. Each team opens Pond
				Paddlers on one shared device, enters the same room code, and
				receives a random paddler. Students take turns after every
				correct answer; no team names or rosters are entered or stored.
			</p>

			<p v-if="operations.length === 0" class="pond-admin__field-error">
				Choose at least one kind of question.
			</p>
			<button
				class="site-button site-button--primary"
				:disabled="!canCreate"
				type="submit"
			>
				{{ creating ? "Creating…" : "Create room" }}
			</button>
		</form>

		<p v-if="error" class="pond-admin__error" role="alert">{{ error }}</p>
		<p
			v-if="notice"
			ref="noticeElement"
			class="pond-admin__notice"
			aria-live="polite"
			role="status"
			tabindex="-1"
		>
			{{ notice }}
		</p>

		<p v-if="loading && rooms.length === 0" aria-live="polite">
			Loading rooms…
		</p>
		<p v-else-if="rooms.length === 0" class="pond-admin__empty">
			No rooms are open.
		</p>
		<ul
			v-else
			class="pond-admin__rooms"
			aria-label="Open Pond Paddlers rooms"
		>
			<li v-for="room in rooms" :key="room.roomCode">
				<div class="pond-admin__room-share">
					<p class="pond-admin__room-url">
						Students open
						<a
							:href="POND_PADDLERS_STUDENT_URL"
							target="_blank"
							rel="noopener noreferrer"
						>
							{{ POND_PADDLERS_STUDENT_URL }}
						</a>
					</p>
					<div class="pond-admin__room-code">
						<span>Room code</span>
						<strong>{{ room.roomCode }}</strong>
					</div>
					<p
						v-if="room.raceFormat === 'team-device'"
						class="pond-admin__room-team"
					>
						Give this same code to every team. Each team uses one
						shared device and receives a random paddler.
					</p>
				</div>
				<div
					:id="`pond-room-details-${room.roomCode}`"
					class="pond-admin__room-details"
				>
					<strong>{{ statusLabel(room.status) }}</strong>
					<span>
						{{ room.playerCount }}
						{{
							room.raceFormat === "team-device"
								? "team"
								: "paddler"
						}}<span v-if="room.playerCount !== 1">s</span> ·
						{{ raceFormatLabels[room.raceFormat] }} · closes at
						{{ formatTime(room.expiresAt) }}
					</span>
				</div>
				<div class="pond-admin__room-actions">
					<button
						v-if="room.status === 'waiting'"
						:aria-describedby="`pond-room-details-${room.roomCode}`"
						:aria-label="`Start race ${room.roomCode}`"
						:disabled="Boolean(startingRoomCode)"
						type="button"
						@click="startRoom(room.roomCode)"
					>
						{{
							startingRoomCode === room.roomCode
								? "Starting…"
								: "Start race"
						}}
					</button>
					<button
						:aria-label="`Copy student instructions for room ${room.roomCode}`"
						data-pond-copy-instructions
						type="button"
						@click="copyStudentInstructions(room)"
					>
						Copy student instructions
					</button>
					<button
						:aria-label="`Copy code for room ${room.roomCode}`"
						data-pond-copy-code
						type="button"
						@click="copyRoomCode(room.roomCode)"
					>
						Copy code
					</button>
					<div
						v-if="confirmingClose === room.roomCode"
						:aria-label="`Confirm closing room ${room.roomCode}`"
						class="pond-admin__close-actions"
						role="group"
						@keydown.esc.stop.prevent="cancelClose"
					>
						<button
							:aria-label="`Close room ${room.roomCode} now`"
							class="pond-admin__close-confirm"
							:disabled="closingRoomCode === room.roomCode"
							type="button"
							@click="closeRoom(room.roomCode)"
						>
							{{
								closingRoomCode === room.roomCode
									? "Closing…"
									: "Close now"
							}}
						</button>
						<button type="button" @click="cancelClose">
							Cancel
						</button>
					</div>
					<button
						v-else
						:aria-label="`Close room ${room.roomCode}`"
						class="pond-admin__close"
						:data-pond-close-room="room.roomCode"
						type="button"
						@click="beginClose(room.roomCode)"
					>
						Close room
					</button>
				</div>
			</li>
		</ul>
	</section>
</template>

<style scoped>
.pond-admin {
	display: grid;
	gap: 1.25rem;
}

.pond-admin__heading {
	display: flex;
	align-items: start;
	justify-content: space-between;
	gap: 1rem;
}

.pond-admin__heading > div {
	display: grid;
	gap: 0.3rem;
}

.pond-admin__eyebrow {
	margin: 0;
	color: var(--color-accent);
	font-size: 0.75rem;
	font-weight: 800;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}

.pond-admin__heading p:last-child,
.pond-admin__room-details span,
.pond-admin__empty,
.pond-admin__preset-help,
.pond-admin__room-url,
.pond-admin__room-team,
.pond-admin__team-help {
	color: var(--color-ink-soft);
}

.pond-admin__form {
	display: grid;
	gap: 1rem;
	padding: 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-surface-muted);
}

.pond-admin__form fieldset {
	margin: 0;
	padding: 0;
	border: 0;
}

.pond-admin__form legend,
.pond-admin__settings label {
	font-weight: 750;
}

.pond-admin__checks,
.pond-admin__settings {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem 1rem;
}

.pond-admin__settings--primary {
	padding-bottom: 1rem;
	border-bottom: 1px solid var(--color-border);
}

.pond-admin__preset-help,
.pond-admin__team-help {
	margin: 0;
}

.pond-admin__team-help {
	max-width: 54rem;
}

.pond-admin__checks label,
.pond-admin__calm {
	display: inline-flex;
	align-items: start;
	gap: 0.5rem;
}

.pond-admin__checks input,
.pond-admin__calm input {
	margin-top: 0.2rem;
}

.pond-admin__settings label {
	display: grid;
	min-width: min(100%, 10rem);
	gap: 0.35rem;
}

.pond-admin__settings select {
	min-height: 2.65rem;
	padding-inline: 0.7rem;
	border: 1px solid var(--color-border-strong);
	border-radius: var(--radius-sm);
	background: var(--color-surface-strong);
	color: var(--color-ink);
}

.pond-admin__calm span {
	display: grid;
	color: var(--color-ink-soft);
}

.pond-admin__calm strong {
	color: var(--color-ink);
}

.pond-admin__form > .site-button {
	justify-self: start;
}

.pond-admin__field-error,
.pond-admin__error {
	color: var(--color-error-text);
}

.pond-admin__notice {
	color: var(--color-success-text);
	font-weight: 700;
}

.pond-admin__rooms {
	display: grid;
	gap: 0.75rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.pond-admin__rooms li {
	display: grid;
	grid-template-columns: minmax(18rem, 1.4fr) minmax(12rem, 1fr);
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
}

.pond-admin__room-share {
	display: grid;
	gap: 0.55rem;
}

.pond-admin__room-url,
.pond-admin__room-team {
	margin: 0;
}

.pond-admin__room-url a {
	overflow-wrap: anywhere;
}

.pond-admin__room-code,
.pond-admin__room-details {
	display: grid;
	gap: 0.15rem;
}

.pond-admin__room-code span {
	color: var(--color-ink-soft);
	font-size: 0.72rem;
	font-weight: 750;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.pond-admin__room-code strong {
	font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	font-size: clamp(1.55rem, 4vw, 2.25rem);
	letter-spacing: 0.08em;
}

.pond-admin__room-actions {
	grid-column: 1 / -1;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 0.45rem;
}

.pond-admin__close-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem;
}

.pond-admin__room-actions button {
	cursor: pointer;
	color: var(--color-link);
	font-weight: 700;
	text-decoration: underline;
	text-underline-offset: 0.18em;
}

.pond-admin__room-actions button:disabled {
	cursor: not-allowed;
	opacity: 0.55;
}

.pond-admin__room-actions .pond-admin__close,
.pond-admin__room-actions .pond-admin__close-confirm {
	color: var(--color-error-text);
}

@media (max-width: 760px) {
	.pond-admin__heading,
	.pond-admin__rooms li {
		align-items: stretch;
		grid-template-columns: 1fr;
	}

	.pond-admin__room-actions {
		grid-column: auto;
	}

	.pond-admin__heading {
		display: grid;
	}

	.pond-admin__room-actions {
		justify-content: flex-start;
	}
}
</style>
