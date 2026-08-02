<script lang="ts" setup>
import type {
	PondPaddler,
	PondPaddlersEventConnection,
	PondPaddlersPublicState,
	PondPaddlersQuestion,
	PondPaddlersRoomStatus
} from "@/modules/pondPaddlers";
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import {
	answerPondPaddlersQuestion,
	connectPondPaddlersEvents,
	joinPondPaddlersRoom,
	PondPaddlersRequestError
} from "@/modules/pondPaddlers";

defineOptions({ name: "PondPaddlersGame" });

type GamePhase = "join" | "race";
type ConnectionState = "closed" | "connecting" | "live" | "reconnecting";

const phase = ref<GamePhase>("join");
const roomCodeInput = ref("");
const roomCode = ref("");
const alias = ref("");
const question = ref<PondPaddlersQuestion | null>(null);
const answer = ref("");
const progress = ref(0);
const finished = ref(false);
const joining = ref(false);
const answering = ref(false);
const joinError = ref("");
const answerFeedback = ref("");
const connectionState = ref<ConnectionState>("connecting");
const calmMode = ref(false);
const finishAt = ref(1);
const raceStatus = ref<PondPaddlersRoomStatus>("waiting");
const answerInput = ref<HTMLInputElement | null>(null);
const paddlers = ref<PondPaddler[]>([]);

let eventConnection: PondPaddlersEventConnection | null = null;
let joinController: AbortController | null = null;
let answerController: AbortController | null = null;
let raceGeneration = 0;

const normalizedRoomCodeInput = computed(() =>
	roomCodeInput.value.trim().toUpperCase()
);
const roomCodeEntry = computed({
	get: () => roomCodeInput.value,
	set: (value: string) => {
		roomCodeInput.value = value
			.toUpperCase()
			.replaceAll(/[^A-HJ-NP-Z2-9]/g, "")
			.slice(0, 8);
	}
});
const canJoin = computed(
	() =>
		/^[A-HJ-NP-Z2-9]{8}$/.test(normalizedRoomCodeInput.value) &&
		!joining.value
);
const connectionLabel = computed(() => {
	if (connectionState.value === "closed") return "Room closed";
	if (connectionState.value === "live") return "Race connected";
	if (connectionState.value === "reconnecting") return "Reconnecting to race";
	return "Connecting to race";
});
const sortedPaddlers = computed(() =>
	[...paddlers.value].sort((left, right) => {
		if (left.progress !== right.progress)
			return right.progress - left.progress;
		return left.alias.localeCompare(right.alias);
	})
);
const roomClosed = computed(() => raceStatus.value === "closed");

function friendlyError(error: unknown): string {
	if (error instanceof PondPaddlersRequestError) return error.message;
	return "Pond Paddlers could not connect. Please try again.";
}

function safeProgress(value: number): number {
	return Math.round(Math.min(100, Math.max(0, value)));
}

function percentComplete(paddler: PondPaddler): number {
	return safeProgress((paddler.progress / finishAt.value) * 100);
}

function paddlerProgressStyle(paddler: PondPaddler) {
	return { "--paddler-progress": `${percentComplete(paddler)}%` };
}

function paddlerProgressText(paddler: PondPaddler): string {
	if (paddler.progress >= finishAt.value) return "Finished!";
	if (raceStatus.value === "finished") {
		return `${paddler.progress} of ${finishAt.value} questions`;
	}
	return `${paddler.progress} of ${finishAt.value} questions`;
}

function applyRaceState(state: PondPaddlersPublicState) {
	finishAt.value = state.finishAt;
	raceStatus.value = state.status;
	paddlers.value = state.players;
	const ownPaddler = state.players.find(
		player => player.alias === alias.value
	);
	if (ownPaddler) progress.value = ownPaddler.progress;
	finished.value = Boolean(
		ownPaddler && ownPaddler.progress >= state.finishAt
	);
	if (state.status === "closed") {
		answerFeedback.value =
			"This room has closed. Ask Julio for a new room code.";
		connectionState.value = "closed";
		eventConnection?.close();
		eventConnection = null;
	}
}

function startEventConnection() {
	eventConnection?.close();
	connectionState.value = "connecting";
	eventConnection = connectPondPaddlersEvents(roomCode.value, {
		onError: () => {
			connectionState.value = "reconnecting";
		},
		onOpen: () => {
			connectionState.value = "live";
		},
		onState: applyRaceState
	});
}

function addOwnPaddler() {
	const ownIndex = paddlers.value.findIndex(
		player => player.alias === alias.value
	);
	if (ownIndex === -1) {
		paddlers.value = [
			...paddlers.value,
			{ alias: alias.value, progress: progress.value }
		];
		return;
	}
	const next = [...paddlers.value];
	next[ownIndex] = { alias: alias.value, progress: progress.value };
	paddlers.value = next;
}

async function joinRoom() {
	if (!canJoin.value) return;
	joining.value = true;
	joinError.value = "";
	joinController?.abort();
	answerController?.abort();
	answerController = null;
	const controller = new AbortController();
	joinController = controller;
	const generation = ++raceGeneration;

	try {
		const joined = await joinPondPaddlersRoom(
			normalizedRoomCodeInput.value,
			controller.signal
		);
		if (controller.signal.aborted || generation !== raceGeneration) return;
		roomCode.value = joined.roomCode;
		roomCodeInput.value = joined.roomCode;
		alias.value = joined.alias;
		question.value = joined.question;
		calmMode.value = joined.calmMode;
		applyRaceState(joined.state);
		answer.value = "";
		answerFeedback.value = joined.resumed
			? "Welcome back! Your paddler is right where you left it."
			: "You are in! Solve the first question to paddle.";
		phase.value = "race";
		startEventConnection();
		await nextTick();
		answerInput.value?.focus();
	} catch (error) {
		if (
			generation === raceGeneration &&
			!(error instanceof DOMException && error.name === "AbortError")
		) {
			joinError.value = friendlyError(error);
		}
	} finally {
		if (joinController === controller) {
			joinController = null;
			joining.value = false;
		}
	}
}

async function submitAnswer() {
	const currentQuestion = question.value;
	const submittedAnswer = answer.value.trim();
	if (
		!currentQuestion ||
		!submittedAnswer ||
		answering.value ||
		finished.value
	) {
		return;
	}
	const numericAnswer = Number(submittedAnswer);
	if (!Number.isInteger(numericAnswer)) {
		answerFeedback.value = "Please type a whole number.";
		await nextTick();
		answerInput.value?.select();
		return;
	}

	answering.value = true;
	answerFeedback.value = "Checking your answer…";
	answerController?.abort();
	const controller = new AbortController();
	answerController = controller;
	const generation = raceGeneration;
	const activeRoomCode = roomCode.value;
	try {
		const result = await answerPondPaddlersQuestion(
			activeRoomCode,
			currentQuestion.questionID,
			numericAnswer,
			controller.signal
		);
		if (
			controller.signal.aborted ||
			generation !== raceGeneration ||
			phase.value !== "race" ||
			roomCode.value !== activeRoomCode ||
			question.value?.questionID !== currentQuestion.questionID
		) {
			return;
		}
		progress.value = Math.max(0, result.progress);
		finished.value = result.finished;
		addOwnPaddler();

		if (!result.correct) {
			answerFeedback.value = "Not quite. Try that question again.";
			await nextTick();
			answerInput.value?.select();
			return;
		}

		answer.value = "";
		question.value = result.nextQuestion;
		answerFeedback.value = result.finished
			? "You reached the finish! Nice paddling."
			: "Correct! Your paddler moved forward.";
		await nextTick();
		answerInput.value?.focus();
	} catch (error) {
		if (
			generation === raceGeneration &&
			!controller.signal.aborted &&
			!(error instanceof DOMException && error.name === "AbortError")
		) {
			answerFeedback.value = friendlyError(error);
		}
	} finally {
		if (answerController === controller) {
			answerController = null;
			answering.value = false;
		}
	}
}

function leaveRoom() {
	raceGeneration += 1;
	joinController?.abort();
	joinController = null;
	answerController?.abort();
	answerController = null;
	eventConnection?.close();
	eventConnection = null;
	joining.value = false;
	answering.value = false;
	phase.value = "join";
	roomCodeInput.value = "";
	roomCode.value = "";
	alias.value = "";
	question.value = null;
	answer.value = "";
	progress.value = 0;
	finished.value = false;
	calmMode.value = false;
	finishAt.value = 1;
	raceStatus.value = "waiting";
	answerFeedback.value = "";
	paddlers.value = [];
}

onBeforeUnmount(() => {
	raceGeneration += 1;
	joinController?.abort();
	joinController = null;
	answerController?.abort();
	answerController = null;
	eventConnection?.close();
});
</script>

<template>
	<section class="pond-page page-shell page-shell--wide">
		<header class="pond-hero">
			<RouterLink class="pond-hero__back" to="/games"
				>← All games</RouterLink
			>
			<h1>Pond Paddlers</h1>
			<p class="pond-hero__intro">
				Solve quick math questions to help your paddler glide across the
				pond.
			</p>
		</header>

		<div v-if="phase === 'join'" class="join-card site-surface">
			<div class="join-card__copy">
				<h2>Join your class race</h2>
				<p>Enter the private room code Julio gives you.</p>
			</div>

			<form
				autocomplete="off"
				class="join-form"
				@submit.prevent="joinRoom"
			>
				<label for="pond-room-code">Room code</label>
				<div class="join-form__row">
					<input
						id="pond-room-code"
						v-model="roomCodeEntry"
						aria-describedby="pond-room-code-help"
						autocapitalize="characters"
						autocomplete="off"
						inputmode="text"
						maxlength="8"
						minlength="8"
						pattern="[A-HJ-NP-Z2-9]{8}"
						placeholder="ABCD2345"
						required
						spellcheck="false"
						type="text"
					/>
					<button
						class="site-button site-button--primary"
						:disabled="!canJoin"
						type="submit"
					>
						{{ joining ? "Joining…" : "Join race" }}
					</button>
				</div>
				<p id="pond-room-code-help" class="join-form__help">
					Use all eight letters and numbers from Julio's code.
				</p>
				<p
					v-if="joinError"
					class="form-message form-message--error"
					role="alert"
				>
					{{ joinError }}
				</p>
			</form>

			<div class="join-card__pond" aria-hidden="true">
				<span class="join-card__lily join-card__lily--one"></span>
				<span class="join-card__lily join-card__lily--two"></span>
				<span class="paddler paddler--preview">
					<span class="paddler__body"></span>
					<span class="paddler__head"></span>
					<span class="paddler__eye"></span>
					<span class="paddler__beak"></span>
				</span>
			</div>
		</div>

		<div
			v-else
			class="race-layout"
			:class="{ 'race-layout--calm': calmMode }"
		>
			<section
				class="race-card site-surface"
				aria-labelledby="race-heading"
			>
				<header class="race-card__header">
					<div>
						<p class="race-card__room">Room {{ roomCode }}</p>
						<h2 id="race-heading">Paddler {{ alias }}</h2>
					</div>
					<div class="race-card__actions">
						<span
							class="connection-pill"
							:class="`connection-pill--${connectionState}`"
							aria-live="polite"
							role="status"
						>
							<span aria-hidden="true"></span
							>{{ connectionLabel }}
						</span>
						<button
							class="leave-button"
							type="button"
							@click="leaveRoom"
						>
							Leave room
						</button>
					</div>
				</header>

				<div v-if="finished" class="finish-panel" role="status">
					<p class="finish-panel__stars" aria-hidden="true">★ ★ ★</p>
					<h3>You made it across!</h3>
					<p>Watch the pond while the other paddlers finish.</p>
				</div>

				<div v-else-if="roomClosed" class="restart-panel">
					<h3>This room has closed</h3>
					<p>
						Ask Julio for a new room code when it is time to race
						again.
					</p>
					<button
						class="site-button site-button--primary"
						type="button"
						@click="leaveRoom"
					>
						Enter a new code
					</button>
				</div>

				<div v-else-if="raceStatus === 'finished'" class="finish-panel">
					<h3>The race is finished</h3>
					<p>Nice work! You answered {{ progress }} questions.</p>
				</div>

				<form
					v-else-if="question"
					class="question-panel"
					autocomplete="off"
					@submit.prevent="submitAnswer"
				>
					<p class="question-panel__label">Your question</p>
					<p class="question-panel__prompt">{{ question.prompt }}</p>
					<label for="pond-answer">Answer</label>
					<div class="question-panel__answer">
						<input
							id="pond-answer"
							ref="answerInput"
							v-model="answer"
							aria-describedby="pond-answer-help"
							autocomplete="off"
							inputmode="numeric"
							placeholder="Type a number"
							required
							spellcheck="false"
							type="text"
						/>
						<button
							class="site-button site-button--primary"
							:disabled="answering || !answer.trim()"
							type="submit"
						>
							{{ answering ? "Checking…" : "Paddle!" }}
						</button>
					</div>
					<p id="pond-answer-help" class="question-panel__help">
						Press Enter or tap Paddle.
					</p>
				</form>

				<p
					v-if="answerFeedback"
					class="answer-feedback"
					aria-live="polite"
					role="status"
				>
					{{ answerFeedback }}
				</p>
			</section>

			<section
				class="pond-board site-surface"
				aria-labelledby="pond-heading"
			>
				<header class="pond-board__header">
					<div>
						<p class="pond-board__eyebrow">Live race</p>
						<h2 id="pond-heading">Across the pond</h2>
					</div>
					<p>
						{{ sortedPaddlers.length }} paddler<span
							v-if="sortedPaddlers.length !== 1"
							>s</span
						>
					</p>
				</header>

				<ol class="paddler-list" aria-label="Race progress">
					<li
						v-for="paddler in sortedPaddlers"
						:key="paddler.alias"
						class="paddler-lane"
						:class="{
							'paddler-lane--you': paddler.alias === alias
						}"
					>
						<div class="paddler-lane__label">
							<strong>
								{{ paddler.alias
								}}<span v-if="paddler.alias === alias">
									(you)</span
								>
							</strong>
							<span>{{ paddlerProgressText(paddler) }}</span>
						</div>
						<div
							class="paddler-lane__water"
							:style="paddlerProgressStyle(paddler)"
						>
							<span
								class="paddler-lane__start"
								aria-hidden="true"
							></span>
							<span
								class="paddler-lane__finish"
								aria-hidden="true"
								>⚑</span
							>
							<span class="paddler" aria-hidden="true">
								<span class="paddler__wake"></span>
								<span class="paddler__body"></span>
								<span class="paddler__head"></span>
								<span class="paddler__eye"></span>
								<span class="paddler__beak"></span>
							</span>
						</div>
					</li>
				</ol>
			</section>
		</div>
	</section>
</template>

<style scoped>
.pond-page {
	display: grid;
	gap: clamp(1.25rem, 3vw, 2rem);
	padding-block: clamp(1.25rem, 4vw, 3rem);
}

.pond-hero {
	display: grid;
	justify-items: start;
	gap: 0.35rem;
}

.pond-hero__back {
	margin-bottom: 0.35rem;
	color: var(--color-link);
	font-size: 0.9rem;
	font-weight: 750;
}

.race-card__room,
.question-panel__label,
.pond-board__eyebrow {
	margin: 0;
	color: var(--color-accent);
	font-size: 0.74rem;
	font-weight: 850;
	letter-spacing: 0.11em;
	text-transform: uppercase;
}

.pond-hero h1 {
	font-size: clamp(2.25rem, 7vw, 4.4rem);
}

.pond-hero__intro {
	max-width: 39rem;
	color: var(--color-ink-soft);
	font-size: clamp(1rem, 2vw, 1.15rem);
}

.join-card {
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(13rem, 0.55fr);
	gap: clamp(1.5rem, 4vw, 3rem);
	overflow: hidden;
	padding: clamp(1.25rem, 4vw, 2.5rem);
}

.join-card__copy,
.join-form {
	display: grid;
	gap: 0.55rem;
}

.join-card__copy h2 {
	font-size: clamp(1.55rem, 4vw, 2.2rem);
}

.join-card__copy p:last-child,
.join-form label,
.question-panel label {
	color: var(--color-ink-soft);
}

.join-form {
	align-content: start;
}

.join-form label,
.question-panel label {
	font-size: 0.92rem;
	font-weight: 750;
}

.join-form__row,
.question-panel__answer {
	display: flex;
	gap: 0.65rem;
}

.join-form input,
.question-panel input {
	min-width: 0;
	border: 1px solid var(--color-border-strong);
	border-radius: var(--radius-sm);
	background: var(--color-surface-strong);
	box-shadow: var(--shadow-inset-soft);
	color: var(--color-ink);
}

.join-form input {
	width: min(18rem, 100%);
	padding: 0.82rem 0.95rem;
	font-size: 1.15rem;
	font-weight: 800;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.site-button:disabled {
	cursor: not-allowed;
	opacity: 0.55;
}

.form-message,
.answer-feedback {
	padding: 0.65rem 0.8rem;
	border-radius: 0.75rem;
	font-weight: 650;
}

.form-message--error {
	border: 1px solid var(--color-error-border);
	background: var(--color-error-surface);
	color: var(--color-error-text);
}

.join-card__pond {
	position: relative;
	min-height: 15rem;
	border-radius: var(--radius-lg);
	background:
		radial-gradient(
			circle at 25% 35%,
			rgba(255, 255, 255, 0.42) 0 2px,
			transparent 3px
		),
		repeating-radial-gradient(
			ellipse at 50% 110%,
			transparent 0 16px,
			rgba(255, 255, 255, 0.24) 17px 19px
		),
		linear-gradient(155deg, #8ed8db, #4ca7be);
	box-shadow: inset 0 0 0 1px rgba(10, 82, 97, 0.13);
}

.join-card__lily {
	position: absolute;
	width: 2.8rem;
	height: 1.5rem;
	border-radius: 50%;
	background: #5fa85c;
	box-shadow: inset -0.5rem -0.2rem rgba(31, 111, 67, 0.24);
}

.join-card__lily::after {
	position: absolute;
	right: 0.15rem;
	bottom: 0.52rem;
	width: 0.9rem;
	height: 0.7rem;
	background: #6ab8c4;
	clip-path: polygon(0 0, 100% 50%, 0 100%);
	content: "";
}

.join-card__lily--one {
	right: 14%;
	top: 22%;
}

.join-card__lily--two {
	left: 11%;
	bottom: 16%;
	transform: scale(0.72);
}

.race-layout {
	display: grid;
	grid-template-columns: minmax(18rem, 0.72fr) minmax(0, 1.28fr);
	align-items: start;
	gap: 1rem;
}

.race-card,
.pond-board {
	display: grid;
	gap: 1.15rem;
	padding: clamp(1rem, 3vw, 1.5rem);
}

.race-card__header,
.pond-board__header {
	display: flex;
	align-items: start;
	justify-content: space-between;
	gap: 1rem;
}

.race-card__header h2,
.pond-board__header h2 {
	font-size: clamp(1.35rem, 3vw, 1.8rem);
}

.race-card__actions {
	display: grid;
	justify-items: end;
	gap: 0.45rem;
}

.connection-pill {
	display: inline-flex;
	align-items: center;
	gap: 0.4rem;
	padding: 0.32rem 0.58rem;
	border-radius: var(--radius-pill);
	background: var(--color-surface-muted);
	color: var(--color-ink-soft);
	font-size: 0.74rem;
	font-weight: 750;
}

.connection-pill span {
	width: 0.48rem;
	height: 0.48rem;
	border-radius: 50%;
	background: #d97706;
}

.connection-pill--live span {
	background: #16a34a;
}

.leave-button {
	cursor: pointer;
	color: var(--color-link);
	font-size: 0.78rem;
	font-weight: 750;
	text-decoration: underline;
	text-underline-offset: 0.2em;
}

.question-panel,
.finish-panel,
.restart-panel {
	display: grid;
	gap: 0.7rem;
	padding: clamp(1rem, 3vw, 1.35rem);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	background: var(--color-surface-muted);
}

.question-panel__prompt {
	padding-block: 0.25rem 0.5rem;
	color: var(--color-ink-strong);
	font-family: var(--font-display);
	font-size: clamp(2rem, 7vw, 3.4rem);
	font-weight: 700;
	line-height: 1;
	text-align: center;
}

.question-panel input {
	width: 100%;
	padding: 0.78rem 0.9rem;
	font-size: 1.1rem;
}

.join-form__help,
.question-panel__help {
	color: var(--color-ink-muted);
	font-size: 0.82rem;
}

.answer-feedback {
	background: var(--color-accent-soft);
	color: var(--color-ink);
}

.finish-panel,
.restart-panel {
	justify-items: start;
	background: var(--color-success-surface);
	border-color: var(--color-success-border);
}

.finish-panel__stars {
	color: #ca8a04;
	letter-spacing: 0.25em;
}

.pond-board {
	overflow: hidden;
}

.pond-board__header > p {
	color: var(--color-ink-soft);
	font-size: 0.88rem;
}

.paddler-list {
	display: grid;
	gap: 0.8rem;
	list-style: none;
}

.paddler-lane {
	display: grid;
	gap: 0.35rem;
	padding: 0.55rem;
	border: 1px solid transparent;
	border-radius: var(--radius-sm);
}

.paddler-lane--you {
	border-color: rgba(15, 118, 110, 0.26);
	background: var(--color-accent-soft);
}

.paddler-lane__label {
	display: flex;
	justify-content: space-between;
	gap: 0.75rem;
	font-size: 0.82rem;
}

.paddler-lane__label span {
	color: var(--color-ink-soft);
}

.paddler-lane__water {
	position: relative;
	height: 3.45rem;
	overflow: hidden;
	border-radius: 0.8rem;
	background:
		repeating-radial-gradient(
			ellipse at 50% 120%,
			transparent 0 12px,
			rgba(255, 255, 255, 0.24) 13px 15px
		),
		linear-gradient(180deg, #8edce1, #5bb3c6);
	box-shadow: inset 0 0 0 1px rgba(8, 83, 98, 0.14);
}

.paddler-lane__start {
	position: absolute;
	left: 1rem;
	top: 0;
	bottom: 0;
	border-left: 2px dashed rgba(20, 83, 95, 0.35);
}

.paddler-lane__finish {
	position: absolute;
	right: 0.45rem;
	top: 0.35rem;
	color: #14532d;
	font-size: 1.2rem;
}

.paddler {
	position: absolute;
	left: clamp(1.55rem, var(--paddler-progress), calc(100% - 3.65rem));
	top: 0.75rem;
	width: 3rem;
	height: 2rem;
	filter: drop-shadow(0 0.24rem 0.12rem rgba(20, 83, 95, 0.2));
	transition: left 0.65s ease-out;
}

.race-layout--calm .paddler {
	transition: none;
}

.paddler--preview {
	--paddler-progress: 45%;
	top: 47%;
	transform: scale(1.45);
}

.paddler__body {
	position: absolute;
	left: 0.15rem;
	bottom: 0.15rem;
	width: 2.15rem;
	height: 1.12rem;
	border-radius: 58% 52% 48% 44%;
	background: #f4c84b;
	box-shadow: inset -0.3rem -0.22rem #dca92c;
}

.paddler__head {
	position: absolute;
	right: 0.36rem;
	top: 0.02rem;
	width: 1.13rem;
	height: 1.13rem;
	border-radius: 50%;
	background: #f8d45a;
	box-shadow: inset -0.18rem -0.1rem #dfa92b;
}

.paddler__eye {
	position: absolute;
	right: 0.55rem;
	top: 0.28rem;
	width: 0.15rem;
	height: 0.15rem;
	border-radius: 50%;
	background: #17313a;
}

.paddler__beak {
	position: absolute;
	right: 0;
	top: 0.47rem;
	width: 0.55rem;
	height: 0.28rem;
	border-radius: 0 80% 80% 0;
	background: #e87835;
}

.paddler__wake {
	position: absolute;
	left: -0.6rem;
	bottom: 0.05rem;
	width: 1rem;
	height: 0.35rem;
	border-bottom: 2px solid rgba(255, 255, 255, 0.65);
	border-radius: 50%;
}

@media (max-width: 850px) {
	.join-card,
	.race-layout {
		grid-template-columns: 1fr;
	}

	.join-card__pond {
		min-height: 10rem;
	}
}

@media (max-width: 560px) {
	.join-form__row,
	.question-panel__answer,
	.race-card__header,
	.pond-board__header {
		align-items: stretch;
		flex-direction: column;
	}

	.join-form input {
		width: 100%;
	}

	.race-card__actions {
		justify-items: start;
	}

	.paddler-lane__label {
		align-items: start;
		flex-direction: column;
		gap: 0;
	}
}

@media (prefers-reduced-motion: reduce) {
	.paddler {
		transition: none;
	}
}
</style>
