import {
	prepareStudentSessionHandoff,
	resumeStudentSessionHandoff,
	StudentSessionHandoffError
} from "@/modules/studentSessionHandoff";

export type StudentSessionAuthLevel = "admin" | "full" | "none" | "setup";

export interface StudentSessionChangedMessage {
	type: "student-session-changed";
	authLevel: StudentSessionAuthLevel;
	nonce: string;
	studentID: string | null;
}

interface StudentActivityMessage {
	type: "student-activity";
	at: number;
	nonce: string;
	tabID: string;
}

interface StudentLogoutPrepareMessage {
	type: "student-logout-prepare";
	requestID: string;
	sourceTabID: string;
	studentID: string;
}

interface StudentLogoutPrepareStartedMessage {
	type: "student-logout-prepare-started";
	requestID: string;
	tabID: string;
}

interface StudentLogoutPrepareResultMessage {
	type: "student-logout-prepare-result";
	requestID: string;
	tabID: string;
	ok: boolean;
}

interface StudentLogoutCancelMessage {
	type: "student-logout-cancel";
	studentID: string;
}

interface StudentTabHelloMessage {
	type: "student-tab-hello";
	tabID: string;
}

interface StudentTabPresentMessage {
	type: "student-tab-present";
	tabID: string;
}

interface StudentTabSuspendedMessage {
	type: "student-tab-suspended";
	tabID: string;
}

interface StudentTabGoodbyeMessage {
	type: "student-tab-goodbye";
	tabID: string;
}

type StudentSessionMessage =
	| StudentActivityMessage
	| StudentLogoutCancelMessage
	| StudentLogoutPrepareMessage
	| StudentLogoutPrepareResultMessage
	| StudentLogoutPrepareStartedMessage
	| StudentSessionChangedMessage
	| StudentTabGoodbyeMessage
	| StudentTabHelloMessage
	| StudentTabPresentMessage
	| StudentTabSuspendedMessage;

type StudentSessionChangedListener = (
	message: StudentSessionChangedMessage
) => void;
type StudentActivityListener = (at: number) => void;

interface LogoutPreparationState {
	results: Map<string, boolean>;
	started: Set<string>;
	wake: (() => void) | null;
}

const channelName = "cs-avasan-student-session";
const storageEventKey = "cs-avasan-student-session-event";
const activityBroadcastThrottleMs = 30_000;
const tabPresenceHeartbeatMs = 30_000;
const tabPresenceStaleMs = 90_000;
const logoutPeerTimeoutMs = 15_000;
const logoutPeerDiscoveryMs = 300;
const tabID =
	typeof crypto === "undefined"
		? `tab-${Date.now()}-${Math.random()}`
		: crypto.randomUUID();
const sessionChangedListeners = new Set<StudentSessionChangedListener>();
const activityListeners = new Set<StudentActivityListener>();
const logoutPreparationStates = new Map<string, LogoutPreparationState>();
const knownTabIDs = new Map<string, number>();
const suspendedTabIDs = new Set<string>();

let channel: BroadcastChannel | null = null;
let listeningForStorageEvents = false;
let listeningForPageLifecycle = false;
let presenceHeartbeat: ReturnType<typeof window.setInterval> | null = null;
let lastActivityBroadcastAt = 0;

function isStudentSessionMessage(
	value: unknown
): value is StudentSessionMessage {
	if (!value || typeof value !== "object") return false;
	const type = (value as { type?: unknown }).type;
	return (
		type === "student-session-changed" ||
		type === "student-activity" ||
		type === "student-logout-cancel" ||
		type === "student-logout-prepare" ||
		type === "student-logout-prepare-started" ||
		type === "student-logout-prepare-result" ||
		type === "student-tab-goodbye" ||
		type === "student-tab-hello" ||
		type === "student-tab-present" ||
		type === "student-tab-suspended"
	);
}

function postStudentSessionMessage(message: StudentSessionMessage) {
	if (typeof window === "undefined") return;
	if (channel) {
		channel.postMessage(message);
		return;
	}

	try {
		window.localStorage.setItem(storageEventKey, JSON.stringify(message));
		window.localStorage.removeItem(storageEventKey);
	} catch {
		// Cross-tab coordination is unavailable when browser storage is blocked.
	}
}

async function respondToStudentLogoutPreparation(
	message: StudentLogoutPrepareMessage
) {
	if (message.sourceTabID === tabID) return;
	postStudentSessionMessage({
		type: "student-logout-prepare-started",
		requestID: message.requestID,
		tabID
	});

	let ok = true;
	try {
		await prepareStudentSessionHandoff(message.studentID);
	} catch {
		ok = false;
	}

	postStudentSessionMessage({
		type: "student-logout-prepare-result",
		requestID: message.requestID,
		tabID,
		ok
	});
}

function handleStudentSessionMessage(message: StudentSessionMessage) {
	if (message.type === "student-tab-hello") {
		if (message.tabID === tabID) return;
		suspendedTabIDs.delete(message.tabID);
		knownTabIDs.set(message.tabID, Date.now());
		postStudentSessionMessage({ type: "student-tab-present", tabID });
		return;
	}

	if (message.type === "student-tab-present") {
		if (message.tabID !== tabID) {
			suspendedTabIDs.delete(message.tabID);
			knownTabIDs.set(message.tabID, Date.now());
		}
		return;
	}

	if (message.type === "student-tab-suspended") {
		if (message.tabID !== tabID) {
			suspendedTabIDs.add(message.tabID);
			knownTabIDs.set(message.tabID, Date.now());
		}
		return;
	}

	if (message.type === "student-tab-goodbye") {
		suspendedTabIDs.delete(message.tabID);
		knownTabIDs.delete(message.tabID);
		return;
	}

	if (message.type === "student-session-changed") {
		for (const listener of sessionChangedListeners) listener(message);
		return;
	}

	if (message.type === "student-activity") {
		if (message.tabID !== tabID) knownTabIDs.set(message.tabID, Date.now());
		for (const listener of activityListeners) listener(message.at);
		return;
	}

	if (message.type === "student-logout-prepare") {
		void respondToStudentLogoutPreparation(message);
		return;
	}

	if (message.type === "student-logout-cancel") {
		void resumeStudentSessionHandoff(message.studentID);
		return;
	}

	const state = logoutPreparationStates.get(message.requestID);
	if (!state) return;
	state.started.add(message.tabID);
	if (message.type === "student-logout-prepare-result")
		state.results.set(message.tabID, message.ok);
	state.wake?.();
}

function handleBroadcastMessage(event: MessageEvent<unknown>) {
	if (isStudentSessionMessage(event.data))
		handleStudentSessionMessage(event.data);
}

function handleStorageEvent(event: StorageEvent) {
	if (event.key !== storageEventKey || !event.newValue) return;
	try {
		const message = JSON.parse(event.newValue) as unknown;
		if (isStudentSessionMessage(message))
			handleStudentSessionMessage(message);
	} catch {
		// Ignore unrelated or malformed local storage values.
	}
}

function postStudentTabPresence() {
	postStudentSessionMessage({ type: "student-tab-present", tabID });
}

function startPresenceHeartbeat() {
	if (presenceHeartbeat) return;
	presenceHeartbeat = window.setInterval(
		postStudentTabPresence,
		tabPresenceHeartbeatMs
	);
}

function stopPresenceHeartbeat() {
	if (!presenceHeartbeat) return;
	window.clearInterval(presenceHeartbeat);
	presenceHeartbeat = null;
}

function handlePageHide(event: PageTransitionEvent) {
	stopPresenceHeartbeat();
	if (event.persisted) {
		postStudentSessionMessage({
			type: "student-tab-suspended",
			tabID
		});
		return;
	}
	postStudentSessionMessage({
		type: "student-tab-goodbye",
		tabID
	});
}

function handlePageShow() {
	postStudentSessionMessage({ type: "student-tab-hello", tabID });
	postStudentTabPresence();
	startPresenceHeartbeat();
}

function ensureStudentSessionBroadcastListener() {
	if (typeof window === "undefined") return;

	if ("BroadcastChannel" in window && !channel) {
		channel = new BroadcastChannel(channelName);
		channel.addEventListener("message", handleBroadcastMessage);
		postStudentSessionMessage({ type: "student-tab-hello", tabID });
	} else if (!listeningForStorageEvents) {
		window.addEventListener("storage", handleStorageEvent);
		listeningForStorageEvents = true;
		postStudentSessionMessage({ type: "student-tab-hello", tabID });
	}

	if (!listeningForPageLifecycle) {
		window.addEventListener("pagehide", handlePageHide);
		window.addEventListener("pageshow", handlePageShow);
		listeningForPageLifecycle = true;
	}
	startPresenceHeartbeat();
}

function waitForPreparationState(
	state: LogoutPreparationState,
	timeoutMs: number
) {
	return new Promise<void>(resolve => {
		const timeout = window.setTimeout(() => {
			state.wake = null;
			resolve();
		}, timeoutMs);
		state.wake = () => {
			window.clearTimeout(timeout);
			state.wake = null;
			resolve();
		};
	});
}

export function subscribeToStudentSessionChanged(
	listener: StudentSessionChangedListener
) {
	sessionChangedListeners.add(listener);
	ensureStudentSessionBroadcastListener();
	return () => sessionChangedListeners.delete(listener);
}

export function subscribeToStudentActivity(listener: StudentActivityListener) {
	activityListeners.add(listener);
	ensureStudentSessionBroadcastListener();
	return () => activityListeners.delete(listener);
}

export function broadcastTrustedStudentActivity(at = Date.now()) {
	if (typeof window === "undefined") return;
	if (at - lastActivityBroadcastAt < activityBroadcastThrottleMs) return;
	lastActivityBroadcastAt = at;
	ensureStudentSessionBroadcastListener();
	postStudentSessionMessage({
		type: "student-activity",
		at,
		nonce: crypto.randomUUID(),
		tabID
	});
}

export async function prepareStudentLogoutInOtherTabs(studentID: string) {
	if (typeof window === "undefined") return;
	ensureStudentSessionBroadcastListener();
	const requestID = crypto.randomUUID();
	const state: LogoutPreparationState = {
		results: new Map(),
		started: new Set(),
		wake: null
	};
	logoutPreparationStates.set(requestID, state);

	try {
		const presentAfter = Date.now() - tabPresenceStaleMs;
		for (const [knownTabID, lastSeenAt] of knownTabIDs) {
			if (suspendedTabIDs.has(knownTabID) || lastSeenAt >= presentAfter) {
				state.started.add(knownTabID);
			} else {
				knownTabIDs.delete(knownTabID);
			}
		}
		postStudentSessionMessage({
			type: "student-logout-prepare",
			requestID,
			sourceTabID: tabID,
			studentID
		});

		// Give tabs that were opened too recently to appear in the presence map
		// a bounded window to announce that preparation has started. Without
		// this, logout could complete before an initially unknown peer had a
		// chance to preserve its project recovery copy.
		await new Promise<void>(resolve => {
			window.setTimeout(resolve, logoutPeerDiscoveryMs);
		});

		const deadline = Date.now() + logoutPeerTimeoutMs;
		while (
			[...state.started].some(tab => !state.results.has(tab)) &&
			Date.now() < deadline
		) {
			await waitForPreparationState(
				state,
				Math.min(500, Math.max(1, deadline - Date.now()))
			);
		}

		if ([...state.started].some(tab => state.results.get(tab) !== true)) {
			throw new StudentSessionHandoffError();
		}
	} finally {
		logoutPreparationStates.delete(requestID);
	}
}

export function cancelStudentLogoutInOtherTabs(studentID: string) {
	if (typeof window === "undefined") return;
	ensureStudentSessionBroadcastListener();
	postStudentSessionMessage({
		type: "student-logout-cancel",
		studentID
	});
}

export function broadcastStudentSessionEnded() {
	broadcastStudentSessionChanged(null, "none");
}

export function broadcastStudentSessionChanged(
	studentID: string | null,
	authLevel: StudentSessionAuthLevel
) {
	if (typeof window === "undefined") return;
	ensureStudentSessionBroadcastListener();
	postStudentSessionMessage({
		type: "student-session-changed",
		authLevel,
		nonce: crypto.randomUUID(),
		studentID
	});
}
