<script lang="ts" setup>
import type {
	PondPaddlersAdminRoom,
	PondPaddlersOperation
} from "@/modules/pondPaddlersAdmin";
import { computed, nextTick, onMounted, ref } from "vue";
import { clearAdminSessionOnAuthorizationError } from "@/modules/adminSession";
import {
	closePondPaddlersRoom,
	createPondPaddlersRoom,
	listPondPaddlersRooms,
	POND_PADDLERS_OPERATIONS
} from "@/modules/pondPaddlersAdmin";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "PondPaddlersAdmin" });

const app = useAppStore();
const rooms = ref<PondPaddlersAdminRoom[]>([]);
const operations = ref<PondPaddlersOperation[]>([...POND_PADDLERS_OPERATIONS]);
const maxOperand = ref(20);
const finishAt = ref(10);
const durationMinutes = ref(60);
const calmMode = ref(true);
const loading = ref(true);
const creating = ref(false);
const closingRoomCode = ref("");
const confirmingClose = ref("");
const error = ref("");
const notice = ref("");
const adminSection = ref<HTMLElement | null>(null);
const closeTriggerRoomCode = ref("");
const noticeElement = ref<HTMLElement | null>(null);

const canCreate = computed(
	() => operations.value.length > 0 && !creating.value
);

const operationLabels: Record<PondPaddlersOperation, string> = {
	add: "Addition",
	divide: "Division",
	multiply: "Multiplication",
	subtract: "Subtraction"
};

function friendlyError(caught: unknown) {
	if (clearAdminSessionOnAuthorizationError(caught, app)) return "";
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
	if (status === "waiting") return "Waiting for paddlers";
	if (status === "finished") return "Race finished";
	return "Race in progress";
}

async function loadRooms() {
	loading.value = true;
	error.value = "";
	try {
		rooms.value = await listPondPaddlersRooms();
	} catch (caught) {
		error.value = friendlyError(caught);
	} finally {
		loading.value = false;
	}
}

async function createRoom() {
	if (!canCreate.value) return;
	creating.value = true;
	error.value = "";
	notice.value = "";
	try {
		const room = await createPondPaddlersRoom({
			calmMode: calmMode.value,
			durationMinutes: durationMinutes.value,
			finishAt: finishAt.value,
			maxOperand: maxOperand.value,
			operations: [...operations.value]
		});
		rooms.value = [
			room,
			...rooms.value.filter(item => item.roomCode !== room.roomCode)
		];
		notice.value = `Room ${room.roomCode} is ready.`;
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

onMounted(loadRooms);
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
					Create a private arithmetic race and give students its code.
				</p>
			</div>
			<button
				class="site-button site-button--secondary"
				:disabled="loading"
				type="button"
				@click="loadRooms"
			>
				{{ loading ? "Refreshing…" : "Refresh rooms" }}
			</button>
		</div>

		<form class="pond-admin__form" @submit.prevent="createRoom">
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
						/>
						{{ operationLabels[operation] }}
					</label>
				</div>
			</fieldset>

			<div class="pond-admin__settings">
				<label>
					Largest number
					<select v-model="maxOperand">
						<option :value="10">10</option>
						<option :value="20">20</option>
						<option :value="50">50</option>
						<option :value="100">100</option>
					</select>
				</label>
				<label>
					Questions to finish
					<select v-model="finishAt">
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
				<div class="pond-admin__room-code">
					<span>Room code</span>
					<strong>{{ room.roomCode }}</strong>
				</div>
				<div class="pond-admin__room-details">
					<strong>{{ statusLabel(room.status) }}</strong>
					<span>
						{{ room.playerCount }} paddler<span
							v-if="room.playerCount !== 1"
							>s</span
						>
						· closes at {{ formatTime(room.expiresAt) }}
					</span>
				</div>
				<div class="pond-admin__room-actions">
					<button type="button" @click="copyRoomCode(room.roomCode)">
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
.pond-admin__empty {
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
	grid-template-columns: auto minmax(10rem, 1fr) auto;
	align-items: center;
	gap: 1rem;
	padding: 0.9rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
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
	font-size: 1.35rem;
	letter-spacing: 0.08em;
}

.pond-admin__room-actions {
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

	.pond-admin__heading {
		display: grid;
	}

	.pond-admin__room-actions {
		justify-content: flex-start;
	}
}
</style>
