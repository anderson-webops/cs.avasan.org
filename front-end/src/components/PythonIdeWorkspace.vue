<script setup lang="ts">
import type { EditorState as CodeEditorState } from "@codemirror/state";
import type { EditorView as CodeEditorView } from "@codemirror/view";
import type { PythonCodeMirrorAssetCompletionNames } from "@/modules/pythonCodeMirror";
import type {
	PythonIdeFile,
	PythonIdeMode,
	PythonIdeProject
} from "@/modules/pythonIde";
import type { PythonIdeCourseAssetPack } from "@/modules/pythonIdeCourseAssets";
import type {
	GameBridge,
	RuntimeArtifact,
	TurtleBridge
} from "@/modules/pythonIdeRuntime";
import { storeToRefs } from "pinia";
import {
	computed,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch
} from "vue";
import { useRoute } from "vue-router";
import {
	clearLocalPythonProjectsAsync,
	createPythonIdeProject,
	createRemotePythonIdeProject,
	deleteRemotePythonIdeProject,
	fetchPythonIdeProjects,
	getPythonIdeAssetDataUrl,
	getPythonIdeDefaultFileContent,
	getPythonIdeFileKindLabel,
	getPythonIdeModeLabel,
	getPythonIdeRunnableFile,
	isPythonIdeBinaryAssetFile,
	isPythonIdePythonFile,
	isPythonIdeTextFile,
	isValidPythonFileName,
	loadLocalPythonProjectsAsync,
	loadPythonIdeStarterFilesFromGitHub,
	normalizeImportedPythonIdeFileName,
	normalizePythonFileName,
	normalizePythonIdeMode,
	pythonIdeAllowedFileExtensions,
	pythonIdeFileUploadAccept,
	pythonIdeModeForCourseId,
	pythonIdeProjectToPayload,
	resolvePythonIdeActiveFileName,
	saveLocalPythonProjects,
	saveLocalPythonProjectsAsync,
	updateRemotePythonIdeProject
} from "@/modules/pythonIde";
import {
	findPythonIdeCourseAsset,
	getPythonIdeCourseAssetObjectUrl,
	loadPythonIdeCourseAssetPack,
	normalizePythonIdeAssetLookupPath,
	pythonIdeAssetCandidateNames
} from "@/modules/pythonIdeCourseAssets";
import { primePythonRuntimeConnection } from "@/modules/pythonIdeRuntimeHints";
import { useAppStore } from "@/stores/app";

type PythonCodeEditorModules = [
	typeof import("@codemirror/view"),
	typeof import("@codemirror/state"),
	typeof import("@/modules/pythonCodeMirror")
];
type PythonRuntimeModule = typeof import("@/modules/pythonIdeRuntime");

interface OutputLine {
	id: number;
	kind: "stdout" | "stderr" | "system";
	text: string;
}

interface RuntimeArtifactView {
	id: number;
	title: string;
	mimeType: string;
	audioUrl?: string;
	dataUrl?: string;
	srcdoc?: string;
	text?: string;
}

interface TurtleState {
	x: number;
	y: number;
	heading: number;
	penDown: boolean;
	penColor: string;
	fillColor: string;
	lineWidth: number;
	background: string;
	shape: TurtleShapeName;
	speed: number;
	visible: boolean;
}

interface TurtleFillState {
	active: boolean;
	color: string;
	points: { x: number; y: number }[];
}

interface TurtlePose {
	x: number;
	y: number;
	heading: number;
	penColor: string;
	shape: TurtleShapeName;
	speed: number;
	visible: boolean;
}

type CanvasCoordinateMapper = (
	x: number,
	y: number
) => { x: number; y: number };

type TurtleRenderCommand =
	| {
			color: string;
			from: { x: number; y: number };
			kind: "line";
			to: { x: number; y: number };
			width: number;
	  }
	| {
			color: string;
			kind: "circle";
			radius: number;
			width: number;
			x: number;
			y: number;
	  }
	| {
			color: string;
			fillColor: string;
			kind: "fill";
			points: { x: number; y: number }[];
			width: number;
	  }
	| {
			color: string;
			kind: "dot";
			size: number;
			x: number;
			y: number;
	  }
	| {
			color: string;
			heading: number;
			kind: "stamp";
			shape: TurtleShapeName;
			x: number;
			y: number;
	  }
	| {
			color: string;
			kind: "text";
			text: string;
			x: number;
			y: number;
	  };

interface TurtleAnimationStep {
	command?: TurtleRenderCommand;
	durationMs: number;
	fromPose: TurtlePose;
	turtleID: string;
	toPose: TurtlePose;
}

interface TurtleCompletedCommand {
	command: TurtleRenderCommand;
	turtleID: string;
}

interface CodeEditorViewState {
	mainIndex: number;
	ranges: Array<{ anchor: number; head: number }>;
	scrollLeft: number;
	scrollTop: number;
}

interface GameCanvasState {
	width: number;
	height: number;
	background: string;
	backgroundGradient: string | null;
}

interface GameInputEvent {
	type:
		| "keydown"
		| "keyup"
		| "mousedown"
		| "mouseup"
		| "mousemove"
		| "musicended";
	key?: string;
	mod?: number;
	unicode?: string;
	x?: number;
	y?: number;
	button?: "left" | "middle" | "right" | "wheel_down" | "wheel_up";
	buttons?: ("left" | "middle" | "right")[];
	relX?: number;
	relY?: number;
}

interface CachedGameImage {
	element: HTMLImageElement;
	failed: boolean;
	loaded: boolean;
	src: string;
}

interface ResolvedGameAsset {
	height?: number;
	key: string;
	src: string;
	width?: number;
}

interface GameToneHandle {
	gain: GainNode;
	oscillator: OscillatorNode;
	timeout: ReturnType<typeof window.setTimeout>;
}

type PythonIdeAssetFolder = "images" | "music" | "sounds";
type TurtleShapeName =
	| "arrow"
	| "blank"
	| "circle"
	| "classic"
	| "fancy"
	| "square"
	| "triangle"
	| "turtle";

const imageAssetExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
const audioAssetExtensions = [".wav", ".mp3", ".ogg"];
const assetCompletionExtensionMap = {
	images: imageAssetExtensions,
	music: audioAssetExtensions,
	sounds: audioAssetExtensions
} satisfies Record<PythonIdeAssetFolder, string[]>;
const defaultTurtleID = "default";
const defaultTurtleShape: TurtleShapeName = "classic";
const supportedTurtleShapes = new Set<TurtleShapeName>([
	"arrow",
	"blank",
	"circle",
	"classic",
	"fancy",
	"square",
	"triangle",
	"turtle"
]);
const turtleOriginalShapePolygons = {
	arrow: [
		[-10, 0],
		[10, 0],
		[0, 10]
	],
	circle: [
		[10, 0],
		[9.51, 3.09],
		[8.09, 5.88],
		[5.88, 8.09],
		[3.09, 9.51],
		[0, 10],
		[-3.09, 9.51],
		[-5.88, 8.09],
		[-8.09, 5.88],
		[-9.51, 3.09],
		[-10, 0],
		[-9.51, -3.09],
		[-8.09, -5.88],
		[-5.88, -8.09],
		[-3.09, -9.51],
		[0, -10],
		[3.09, -9.51],
		[5.88, -8.09],
		[8.09, -5.88],
		[9.51, -3.09]
	],
	classic: [
		[0, 0],
		[-5, -9],
		[0, -7],
		[5, -9]
	],
	square: [
		[10, -10],
		[10, 10],
		[-10, 10],
		[-10, -10]
	],
	triangle: [
		[10, -5.77],
		[0, 11.55],
		[-10, -5.77]
	],
	turtle: [
		[0, 16],
		[-2, 14],
		[-1, 10],
		[-4, 7],
		[-7, 9],
		[-9, 8],
		[-6, 5],
		[-7, 1],
		[-5, -3],
		[-8, -6],
		[-6, -8],
		[-4, -5],
		[0, -7],
		[4, -5],
		[6, -8],
		[8, -6],
		[5, -3],
		[7, 1],
		[6, 5],
		[9, 8],
		[7, 9],
		[4, 7],
		[1, 10],
		[2, 14]
	]
} satisfies Record<
	Exclude<TurtleShapeName, "blank" | "fancy">,
	Array<[number, number]>
>;
const maxPythonIdeProjectFiles = 40;
const maxImportedTextFileBytes = 512 * 1024;
const maxImportedBinaryFileBytes = 2 * 1024 * 1024;
const maxOutputLines = 500;
const maxOutputTextLength = 12000;
const maxRuntimeArtifacts = 12;
const maxRuntimeArtifactTextLength = 500000;
const maxRuntimeArtifactBase64Length = 1500000;
const maxCodeEditorViewStates = 120;
const pythonIdeAutoSaveStorageKey = "classes-python-ide-autosave";
const pythonIdeEditorViewStateStoragePrefix =
	"classes-python-ide-editor-view-state";
const turtleAnimationInitialFrameCreditMs = 16;
const turtleInstantStepMaxDurationMs = 16;
const turtleTurnStepDurationMs = turtleInstantStepMaxDurationMs;
const turtleInstantStepMaxDistance = 2;
const turtleDefaultSpeed = 3;
const turtleDistanceDurationMsPerPixelAtDefaultSpeed = 5;
const turtleInstantFrameDistanceBudget = 12;
const turtleInstantFrameStepBudget = 24;
const turtleBacklogFastForwardStepThreshold = 18;
const turtleBacklogFrameDistanceBudget = 420;
const turtleBacklogFrameStepBudget = 140;
const turtleMarkerHaloLineWidth = 4;
const turtleMarkerStrokeLineWidth = 1.2;
const outputEntryTruncatedMessage =
	"\n[Output truncated to keep the browser responsive.]";
const outputHistoryTrimmedMessage =
	"Earlier output was hidden to keep the browser responsive.";
const keyboardKeyWhitespaceRegex = /\s+/g;
const browserKeyboardLetterCodeRegex = /^Key([A-Z])$/;
const browserKeyboardDigitCodeRegex = /^Digit(\d)$/;
const browserKeyboardNumpadDigitCodeRegex = /^Numpad(\d)$/;
const browserKeyboardFunctionCodeRegex = /^F([1-9]|1[0-5])$/;
const pythonTracebackFrameRegex = /File "([^"]+)", line (\d+)/g;
const browserKeyboardCodeMap: Record<string, string> = {
	AltLeft: "lalt",
	AltRight: "ralt",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right",
	ArrowUp: "up",
	Backquote: "backquote",
	Backslash: "backslash",
	Backspace: "backspace",
	BracketLeft: "leftbracket",
	BracketRight: "rightbracket",
	CapsLock: "capslock",
	Comma: "comma",
	ContextMenu: "menu",
	ControlLeft: "lctrl",
	ControlRight: "rctrl",
	Delete: "delete",
	End: "end",
	Enter: "return",
	Equal: "equals",
	Escape: "escape",
	Home: "home",
	Insert: "insert",
	MetaLeft: "lmeta",
	MetaRight: "rmeta",
	Minus: "minus",
	NumLock: "numlock",
	NumpadAdd: "kp_plus",
	NumpadDecimal: "kp_period",
	NumpadDivide: "kp_divide",
	NumpadEnter: "kp_enter",
	NumpadMultiply: "kp_multiply",
	NumpadSubtract: "kp_minus",
	PageDown: "pagedown",
	PageUp: "pageup",
	Pause: "pause",
	Period: "period",
	Quote: "quote",
	Semicolon: "semicolon",
	ShiftLeft: "lshift",
	ShiftRight: "rshift",
	Slash: "slash",
	Space: "space",
	Tab: "tab"
};
const keyboardKeyAliasMap: Record<string, string> = {
	" ": "space",
	arrowdown: "down",
	arrowleft: "left",
	arrowright: "right",
	arrowup: "up",
	control: "ctrl",
	ctl: "ctrl",
	ctrlleft: "lctrl",
	ctrlright: "rctrl",
	down: "down",
	enter: "return",
	esc: "escape",
	escape: "escape",
	left: "left",
	option: "alt",
	page_down: "pagedown",
	page_up: "pageup",
	pgdn: "pagedown",
	pgup: "pageup",
	return: "return",
	right: "right",
	space: "space",
	spacebar: "space",
	up: "up"
};
for (let digit = 0; digit <= 9; digit += 1) {
	keyboardKeyAliasMap[`digit${digit}`] = String(digit);
	keyboardKeyAliasMap[`k_${digit}`] = String(digit);
	keyboardKeyAliasMap[`kp${digit}`] = `kp${digit}`;
	keyboardKeyAliasMap[`numpad${digit}`] = `kp${digit}`;
}

const app = useAppStore();
const route = useRoute();
const { currentUser } = storeToRefs(app);

const projects = ref<PythonIdeProject[]>([]);
const selectedProjectID = ref("");
const newFileName = ref("");
const inputText = ref("");
const outputLines = ref<OutputLine[]>([]);
const runtimeArtifacts = ref<RuntimeArtifactView[]>([]);
const isLoading = ref(true);
const isSaving = ref(false);
const isRunning = ref(false);
const isGameLoopActive = ref(false);
const activeTurtleTimerCount = ref(0);
const activeTurtleTimerCallbackCount = ref(0);
const activeTurtleEventHandlerCount = ref(0);
const showProjectMenu = ref(false);
const showFileTools = ref(false);
const showIdeSettings = ref(false);
const autoSaveEnabled = ref(loadPythonIdeAutoSavePreference());
const deleteCandidateProjectID = ref("");
const deleteConfirmText = ref("");
const sidebarCollapsed = ref(false);
const stopRequested = ref(false);
const saveMessage = ref("Loading workspace");
const runMessage = ref("Ready");
const storagePersistenceMessage = ref("Checking local save protection");
const storagePersistenceStatus = ref<
	"best-effort" | "checking" | "persistent" | "unsupported"
>("checking");
const codeEditorHostRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const editorCursorCount = ref(1);
const artifactCounter = ref(0);
const outputCounter = ref(0);
const keyHandlers = new Map<string, () => void>();
const turtleClickHandlers = new Map<string, (x: number, y: number) => void>();
const turtleDragHandlers = new Map<string, (x: number, y: number) => void>();
const turtleTimerHandles = new Set<ReturnType<typeof window.setTimeout>>();
const gameKeysDown = new Set<string>();
const gameEvents: GameInputEvent[] = [];
const gameImageCache = new Map<string, CachedGameImage>();
const gameSoundAudio = new Map<string, Set<HTMLAudioElement>>();
const gameToneAudio = new Map<number, GameToneHandle>();
const codeEditorViewStates = new Map<string, CodeEditorViewState>();
const codeEditorStateSnapshots = new Map<string, CodeEditorState>();

let saveTimer: ReturnType<typeof window.setTimeout> | null = null;
let localSnapshotTimer: ReturnType<typeof window.setTimeout> | null = null;
let saveInFlight: Promise<void> | null = null;
let localSnapshotInFlight: Promise<void> | null = null;
let localSnapshotQueued = false;
let saveQueued = false;
let suppressAutoSave = false;
const pendingSaveProjectIDs = new Set<string>();
const unsyncedProjectIDs = new Set<string>();
let resizeObserver: ResizeObserver | null = null;
let gameAnimationFrame: number | null = null;
let gameOnDemandTickFrame: number | null = null;
let turtleAnimationFrame: number | null = null;
let activeTurtleAnimationStep: TurtleAnimationStep | null = null;
let turtleAnimationStepStartedAt = 0;
let turtleAnimationPromise: Promise<void> | null = null;
let resolveTurtleAnimation: (() => void) | null = null;
let gameLoopRequested = false;
let gameLoopContinuous = false;
let gameTickInFlight = false;
let gameTickQueued = false;
let gameTickCallback: (() => Promise<void>) | null = null;
let gameContinuousFrameRunner: (() => void) | null = null;
let activeTurtleBridgeRunID = 0;
let turtleTimerGeneration = 0;
let activeTurtleID = defaultTurtleID;
let activeGameBridgeRunID = 0;
let activeGameLoopID = 0;
let activePythonIdeRunID = 0;
let expectedSelectedProjectIDMigration: { from: string; to: string } | null =
	null;
let activeTurtleDragButton: string | null = null;
let lastGamePointerPoint: { x: number; y: number } | null = null;
let gameMusicAudio: HTMLAudioElement | null = null;
let gameMusicVolume = 1;
let gameToneAudioContext: AudioContext | null = null;
let gameToneCounter = 0;
let gameAudioPlaybackBlockedNoticeShown = false;
let codeEditorView: CodeEditorView | null = null;
let syncingCodeMirrorContent = false;
let gameCourseAssetPack: PythonIdeCourseAssetPack | null = null;
let gameCourseAssetPackLoadFailed = false;
let gameCourseAssetPackSilentLoadFailed = false;
let turtleStampCounter = 0;
let turtleCompletedCommands: TurtleCompletedCommand[] = [];
let turtleQueuedSteps: TurtleAnimationStep[] = [];
let turtleVisiblePoses = new Map<string, TurtlePose>();
let codeEditorModulesPromise: Promise<PythonCodeEditorModules> | null = null;
let pythonRuntimeModulePromise: Promise<PythonRuntimeModule> | null = null;
let codeEditorResetToken = 0;
let activeCodeEditorViewStateKey = "";
let projectLoadRunID = 0;

function loadPythonCodeEditorModules() {
	codeEditorModulesPromise ??= Promise.all([
		import("@codemirror/view"),
		import("@codemirror/state"),
		import("@/modules/pythonCodeMirror")
	]);
	return codeEditorModulesPromise;
}

function loadPythonRuntimeModule() {
	pythonRuntimeModulePromise ??= import("@/modules/pythonIdeRuntime");
	return pythonRuntimeModulePromise;
}

function loadPythonIdeAutoSavePreference() {
	if (typeof window === "undefined") return true;
	return window.localStorage.getItem(pythonIdeAutoSaveStorageKey) !== "off";
}

function persistPythonIdeAutoSavePreference(enabled: boolean) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		pythonIdeAutoSaveStorageKey,
		enabled ? "on" : "off"
	);
}

function storageManagerWithPersistence() {
	if (typeof navigator === "undefined") return null;
	if (!navigator.storage?.persist || !navigator.storage.persisted)
		return null;
	return navigator.storage;
}

async function refreshPythonIdeStoragePersistenceStatus() {
	const storageManager = storageManagerWithPersistence();
	if (!storageManager) {
		storagePersistenceStatus.value = "unsupported";
		storagePersistenceMessage.value =
			"Your browser does not expose persistent local project storage.";
		return;
	}

	storagePersistenceStatus.value = "checking";
	try {
		const persisted = await storageManager.persisted();
		storagePersistenceStatus.value = persisted
			? "persistent"
			: "best-effort";
		storagePersistenceMessage.value = persisted
			? "Local project saves are protected from automatic browser cleanup."
			: "Local project saves use normal browser storage and may be cleared if the browser needs space.";
	} catch {
		storagePersistenceStatus.value = "unsupported";
		storagePersistenceMessage.value =
			"Could not check local project storage protection in this browser.";
	}
}

async function requestPythonIdeStoragePersistence() {
	const storageManager = storageManagerWithPersistence();
	if (!storageManager) {
		storagePersistenceStatus.value = "unsupported";
		storagePersistenceMessage.value =
			"Your browser does not support persistent local project storage.";
		return;
	}

	storagePersistenceStatus.value = "checking";
	try {
		const alreadyPersisted = await storageManager.persisted();
		const persisted = alreadyPersisted || (await storageManager.persist());
		storagePersistenceStatus.value = persisted
			? "persistent"
			: "best-effort";
		storagePersistenceMessage.value = persisted
			? "Local project saves are protected from automatic browser cleanup."
			: "The browser kept local project saves in normal storage for now.";
	} catch {
		storagePersistenceStatus.value = "unsupported";
		storagePersistenceMessage.value =
			"Could not request persistent local project storage.";
	}
}

function codeEditorViewStateStorageKey(userID: string | null) {
	return `${pythonIdeEditorViewStateStoragePrefix}:${userID ?? "guest"}`;
}

function isCodeEditorViewState(value: unknown): value is CodeEditorViewState {
	if (!value || typeof value !== "object") return false;
	const candidate = value as Partial<CodeEditorViewState>;
	return (
		Number.isInteger(candidate.mainIndex) &&
		Number.isFinite(candidate.scrollLeft) &&
		Number.isFinite(candidate.scrollTop) &&
		Array.isArray(candidate.ranges) &&
		candidate.ranges.every(range => {
			const candidateRange = range as Partial<
				CodeEditorViewState["ranges"][number]
			>;
			return (
				Number.isInteger(candidateRange.anchor) &&
				Number.isInteger(candidateRange.head)
			);
		})
	);
}

function loadPersistedCodeEditorViewStates(userID: string | null) {
	codeEditorViewStates.clear();
	if (typeof window === "undefined") return;

	try {
		const raw = window.localStorage.getItem(
			codeEditorViewStateStorageKey(userID)
		);
		if (!raw) return;
		const parsed = JSON.parse(raw) as Array<[string, unknown]>;
		if (!Array.isArray(parsed)) return;

		for (const [key, state] of parsed) {
			if (typeof key !== "string" || !isCodeEditorViewState(state))
				continue;
			codeEditorViewStates.set(key, state);
			if (codeEditorViewStates.size >= maxCodeEditorViewStates) break;
		}
	} catch {
		codeEditorViewStates.clear();
	}
}

function persistCodeEditorViewStates(userID: string | null) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(
			codeEditorViewStateStorageKey(userID),
			JSON.stringify([...codeEditorViewStates])
		);
	} catch (error) {
		console.warn("Could not persist Python IDE editor view state.", error);
	}
}

function releaseLoadedPythonRuntimeCallbacks(
	options: { reportErrors?: boolean } = {}
) {
	if (!pythonRuntimeModulePromise) return;
	void pythonRuntimeModulePromise
		.then(module => module.releasePythonIdeRuntimeCallbacks())
		.catch(error => {
			if (!options.reportErrors) return;
			appendOutput(
				"stderr",
				error instanceof Error
					? error.message
					: "Could not release Python runtime callbacks."
			);
		});
}

function stopLoadedPythonRuntimeRun() {
	if (!pythonRuntimeModulePromise) return;
	void pythonRuntimeModulePromise
		.then(module => module.stopPythonIdeRuntimeRun())
		.catch(error => {
			appendOutput(
				"stderr",
				error instanceof Error
					? error.message
					: "Could not stop Python runtime."
			);
		});
}

function createDefaultTurtleState(background = "#ffffff"): TurtleState {
	return {
		x: 0,
		y: 0,
		heading: 0,
		penDown: true,
		penColor: "#000000",
		fillColor: "#000000",
		lineWidth: 3,
		background,
		shape: defaultTurtleShape,
		speed: 3,
		visible: true
	};
}

let turtleState = createDefaultTurtleState();
let turtleStates = new Map<string, TurtleState>([
	[defaultTurtleID, turtleState]
]);
let turtleTracerEnabled = true;

const turtleFillState: TurtleFillState = {
	active: false,
	color: turtleState.fillColor,
	points: []
};

const gameState: GameCanvasState = {
	width: 640,
	height: 400,
	background: "#111827",
	backgroundGradient: null
};

const selectedProject = computed(
	() =>
		projects.value.find(
			project => project._id === selectedProjectID.value
		) ??
		projects.value[0] ??
		null
);

const activeFile = computed(() => {
	const project = selectedProject.value;
	if (!project) return null;
	const activeFileName = resolvePythonIdeActiveFileName(
		project.files,
		project.activeFileName
	);
	return project.files.find(file => file.name === activeFileName) ?? null;
});

const activeFileContent = computed({
	get: () => activeFile.value?.content ?? "",
	set: (content: string) => {
		if (!activeFile.value || !selectedProject.value) return;
		if (isPythonIdeBinaryAssetFile(activeFile.value)) return;
		activeFile.value.content = content;
		touchSelectedProject();
		scheduleSave();
	}
});

const activeFileDataUrl = computed(() =>
	activeFile.value ? getPythonIdeAssetDataUrl(activeFile.value) : ""
);
const activeFileIsBinaryAsset = computed(() =>
	activeFile.value ? isPythonIdeBinaryAssetFile(activeFile.value) : false
);
const activeFilePreviewKind = computed(() => {
	if (!activeFileDataUrl.value) return "";
	if (activeFileDataUrl.value.startsWith("data:image/")) return "image";
	if (activeFileDataUrl.value.startsWith("data:audio/")) return "audio";
	return "";
});

const canSyncToAccount = computed(() => !!currentUser.value?._id);
const storageUserID = computed(() => currentUser.value?._id ?? null);
const sortedProjects = computed(() => [...projects.value]);
const runControlIsStop = computed(
	() =>
		isRunning.value ||
		isGameLoopActive.value ||
		activeTurtleTimerCount.value > 0 ||
		activeTurtleTimerCallbackCount.value > 0 ||
		activeTurtleEventHandlerCount.value > 0
);
const selectedModeLabel = computed(() =>
	selectedProject.value
		? getPythonIdeModeLabel(selectedProject.value.mode)
		: "Python"
);
const usesDrawingCanvas = computed(
	() =>
		selectedProject.value?.mode === "turtle" ||
		selectedProject.value?.mode === "pgzero"
);
const usesGameCanvas = computed(() => selectedProject.value?.mode === "pgzero");
const drawingCanvasStyle = computed(() => {
	if (!usesGameCanvas.value) return {};
	const aspect = gameState.width / gameState.height;
	return {
		"--python-game-aspect": `${gameState.width} / ${gameState.height}`,
		"--python-game-max-width": `${Math.min(68, Math.max(18, aspect * 34))}rem`
	};
});
const requestedCourseId = computed(() =>
	typeof route.query.course === "string" ? route.query.course : ""
);
const requestedCourseProjectKey = computed(() =>
	typeof route.query.projectKey === "string" ? route.query.projectKey : ""
);
const requestedStarterUrl = computed(() =>
	typeof route.query.starterUrl === "string" ? route.query.starterUrl : ""
);
const requestedStarterTitle = computed(() =>
	typeof route.query.starterTitle === "string" ? route.query.starterTitle : ""
);
const requestedStarterLabel = computed(() =>
	typeof route.query.starterLabel === "string" ? route.query.starterLabel : ""
);
const requestedCourseStarter = computed(() => route.query.starter === "course");
const requestedStarterMode = computed(() => {
	const rawMode =
		typeof route.query.mode === "string" ? route.query.mode : "";
	const courseMode = pythonIdeModeForCourseId(requestedCourseId.value);
	return normalizePythonIdeMode(rawMode, courseMode ?? "turtle");
});

function appendOutput(kind: OutputLine["kind"], text: string) {
	if (!text) return;
	const outputText =
		text.length > maxOutputTextLength
			? `${text.slice(0, maxOutputTextLength)}${outputEntryTruncatedMessage}`
			: text;

	outputLines.value.push({
		id: outputCounter.value++,
		kind,
		text: outputText
	});
	if (outputLines.value.length <= maxOutputLines) return;

	const visibleOutput = outputLines.value.filter(
		line => line.text !== outputHistoryTrimmedMessage
	);
	outputLines.value = [
		{
			id: outputCounter.value++,
			kind: "system",
			text: outputHistoryTrimmedMessage
		},
		...visibleOutput.slice(-(maxOutputLines - 1))
	];
}

function appendArtifact(artifact: RuntimeArtifact) {
	if (runtimeArtifacts.value.length >= maxRuntimeArtifacts) {
		appendOutput(
			"system",
			`Skipped ${artifact.title}; this run already rendered ${maxRuntimeArtifacts} artifacts.`
		);
		return;
	}
	if (
		artifact.mimeType.startsWith("audio/") &&
		artifact.data.length > maxRuntimeArtifactBase64Length
	) {
		appendOutput(
			"system",
			`Skipped ${artifact.title}; audio artifacts must be under ${formatFileSize(maxRuntimeArtifactBase64Length)}.`
		);
		return;
	}
	if (
		!artifact.mimeType.startsWith("audio/") &&
		artifact.data.length > maxRuntimeArtifactTextLength
	) {
		appendOutput(
			"system",
			`Skipped ${artifact.title}; rendered artifacts must be under ${formatFileSize(maxRuntimeArtifactTextLength)}.`
		);
		return;
	}

	const view: RuntimeArtifactView = {
		id: artifactCounter.value++,
		title: artifact.title,
		mimeType: artifact.mimeType
	};

	if (artifact.mimeType === "image/svg+xml") {
		view.dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(artifact.data)}`;
	} else if (artifact.mimeType.startsWith("audio/")) {
		view.audioUrl = `data:${artifact.mimeType};base64,${artifact.data}`;
	} else if (artifact.mimeType === "text/html") {
		view.srcdoc = artifact.data;
	} else {
		view.text = artifact.data;
	}

	runtimeArtifacts.value.push(view);
}

function formatPythonRuntimeError(error: unknown) {
	const message =
		error instanceof Error ? error.message : "Python run failed.";
	const loopGuardMessage = message.match(
		/RuntimeError: Stopped a long-running (?:for|while) loop[^\n]*/
	);

	return loopGuardMessage?.[0] ?? message;
}

function pythonRuntimeDiagnosticMessage(message: string) {
	const lines = message
		.split("\n")
		.map(line => line.trim())
		.filter(Boolean);
	return lines.at(-1) ?? "Python run failed.";
}

function pythonTracebackLineForActiveFile(
	message: string,
	activeFileName: string
) {
	let lineNumber: number | null = null;

	for (const match of message.matchAll(pythonTracebackFrameRegex)) {
		const fileName = match[1] ?? "";
		if (
			fileName !== activeFileName &&
			!fileName.endsWith(`/${activeFileName}`)
		) {
			continue;
		}
		const parsedLineNumber = Number(match[2]);
		if (Number.isInteger(parsedLineNumber) && parsedLineNumber > 0) {
			lineNumber = parsedLineNumber;
		}
	}

	return lineNumber;
}

async function markPythonRuntimeErrorInEditor(
	message: string,
	activeFileName: string
) {
	const lineNumber = pythonTracebackLineForActiveFile(
		message,
		activeFileName
	);
	if (!lineNumber || !codeEditorView) return;

	const [, , codeMirrorModule] = await loadPythonCodeEditorModules();
	if (!codeEditorView || activeFile.value?.name !== activeFileName) return;

	const diagnostic = codeMirrorModule.pythonRuntimeDiagnosticForLine(
		codeEditorView.state,
		lineNumber,
		pythonRuntimeDiagnosticMessage(message)
	);
	if (!diagnostic) return;

	codeEditorView.dispatch({
		selection: { anchor: diagnostic.from, head: diagnostic.to },
		scrollIntoView: true,
		effects: codeMirrorModule.pythonRuntimeDiagnosticEffect.of(diagnostic)
	});
}

function clearPythonRuntimeDiagnosticInEditor() {
	if (!codeEditorView || !codeEditorModulesPromise) return;

	void codeEditorModulesPromise.then(([, , codeMirrorModule]) => {
		codeEditorView?.dispatch({
			effects: codeMirrorModule.pythonRuntimeDiagnosticEffect.of(null)
		});
	});
}

function mergeRuntimeProjectFiles(
	project: PythonIdeProject,
	files: PythonIdeFile[]
) {
	const currentProject = projects.value.find(
		candidate => candidate._id === project._id
	);
	if (!currentProject || selectedProject.value?._id !== currentProject._id)
		return;

	let changedCount = 0;
	let addedCount = 0;

	for (const file of files) {
		if (
			!isValidPythonFileName(file.name) ||
			!isPythonIdeTextFile(file.name) ||
			isPythonIdeBinaryAssetFile(file)
		) {
			continue;
		}

		const nextFile: PythonIdeFile = {
			name: file.name,
			content: file.content,
			encoding: "text"
		};
		const existingIndex = currentProject.files.findIndex(
			candidate => candidate.name === file.name
		);

		if (existingIndex >= 0) {
			const existingFile = currentProject.files[existingIndex];
			if (
				existingFile?.content === nextFile.content &&
				(existingFile.encoding ?? "text") === nextFile.encoding
			) {
				continue;
			}
			currentProject.files.splice(existingIndex, 1, nextFile);
		} else {
			currentProject.files.push(nextFile);
			addedCount += 1;
		}
		changedCount += 1;
	}

	if (!changedCount) return;
	touchProject(currentProject);
	void saveSelectedProject({ force: true });
	appendOutput(
		"system",
		`Saved ${changedCount} changed project file${changedCount === 1 ? "" : "s"}${addedCount ? `, including ${addedCount} new file${addedCount === 1 ? "" : "s"}` : ""}.`
	);
}

function touchProject(project: PythonIdeProject) {
	project.updatedAt = new Date().toISOString();
}

function touchSelectedProject() {
	if (!selectedProject.value) return;
	touchProject(selectedProject.value);
}

function requestedCourseProject() {
	if (!requestedCourseProjectKey.value) return null;
	return {
		courseID: requestedCourseId.value || undefined,
		courseProjectKey: requestedCourseProjectKey.value,
		courseProjectTitle: requestedStarterTitle.value || undefined,
		starterLabel: requestedStarterLabel.value || undefined,
		starterUrl: requestedStarterUrl.value || undefined
	};
}

function projectForRoute(projectList: PythonIdeProject[]) {
	const request = requestedCourseProject();
	if (!request) return null;
	return (
		projectList.find(
			project => project.courseProjectKey === request.courseProjectKey
		) ?? null
	);
}

async function createRequestedCourseProject() {
	const request = requestedCourseProject();
	if (!request) return null;

	let starterFiles: PythonIdeFile[] | undefined;
	if (request.starterUrl) {
		try {
			const loadedFiles = await loadPythonIdeStarterFilesFromGitHub(
				request.starterUrl
			);
			starterFiles = loadedFiles.length ? loadedFiles : undefined;
		} catch (error) {
			appendOutput(
				"stderr",
				error instanceof Error
					? `Could not load starter code: ${error.message}`
					: "Could not load starter code."
			);
		}
	}

	return createPythonIdeProject(requestedStarterMode.value, {
		...request,
		files: starterFiles,
		template:
			starterFiles || requestedCourseStarter.value ? "course" : "blank",
		title: request.courseProjectTitle
	});
}

function projectLoadIsCurrent(loadRunID?: number) {
	return loadRunID === undefined || loadRunID === projectLoadRunID;
}

async function saveNewProject(
	project: PythonIdeProject,
	localOnly = false,
	loadRunID?: number
) {
	if (!projectLoadIsCurrent(loadRunID)) return;

	if (canSyncToAccount.value && !localOnly) {
		const remoteProject = await createRemotePythonIdeProject(
			pythonIdeProjectToPayload(project)
		);
		if (!projectLoadIsCurrent(loadRunID)) return;
		projects.value.unshift(remoteProject);
		selectedProjectID.value = remoteProject._id;
		await discardLocalProjectSnapshotIfSafe();
		if (!projectLoadIsCurrent(loadRunID)) return;
		saveMessage.value = "Synced to account";
		return;
	}

	if (!projectLoadIsCurrent(loadRunID)) return;
	projects.value.unshift(project);
	selectedProjectID.value = project._id;
	await persistLocalProjects();
}

async function openRequestedCourseProjectIfNeeded(
	localOnly = false,
	loadRunID?: number
) {
	if (!projectLoadIsCurrent(loadRunID)) return false;

	const existingProject = projectForRoute(projects.value);
	if (existingProject) {
		selectedProjectID.value = existingProject._id;
		return true;
	}

	const requestedProject = await createRequestedCourseProject();
	if (!projectLoadIsCurrent(loadRunID)) return false;
	if (!requestedProject) return false;

	await saveNewProject(requestedProject, localOnly, loadRunID);
	return projectLoadIsCurrent(loadRunID);
}

async function createInitialProject() {
	const requestedProject = await createRequestedCourseProject();
	if (requestedProject) return requestedProject;
	return createPythonIdeProject(requestedStarterMode.value);
}

function setProjects(nextProjects: PythonIdeProject[]) {
	projects.value = nextProjects.map(project => ({
		...project,
		activeFileName: resolvePythonIdeActiveFileName(
			project.files,
			project.activeFileName
		)
	}));
	selectedProjectID.value =
		projectForRoute(projects.value)?._id ?? projects.value[0]?._id ?? "";
}

async function persistLocalProjects(
	options: { message?: string; quiet?: boolean } = {}
) {
	try {
		await saveLocalPythonProjectsAsync(projects.value, storageUserID.value);
		if (!options.quiet) {
			saveMessage.value =
				options.message ??
				(canSyncToAccount.value
					? "Saved locally after sync issue"
					: "Saved locally");
		}
	} catch (error) {
		saveMessage.value =
			error instanceof Error
				? error.message
				: "Could not save local project copy.";
		appendOutput("stderr", saveMessage.value);
	}
}

function saveLocalProjectSnapshot() {
	if (!projects.value.length) return;
	try {
		saveLocalPythonProjects(projects.value, storageUserID.value);
	} catch (error) {
		console.warn("Could not write Python IDE local snapshot.", error);
	}
}

async function persistLocalProjectSnapshot() {
	if (!projects.value.length) return;
	if (localSnapshotInFlight) {
		localSnapshotQueued = true;
		return localSnapshotInFlight;
	}

	localSnapshotInFlight = (async () => {
		do {
			localSnapshotQueued = false;
			await saveLocalPythonProjectsAsync(
				projects.value,
				storageUserID.value
			);
		} while (localSnapshotQueued);
	})();

	try {
		await localSnapshotInFlight;
	} catch (error) {
		console.warn("Could not write Python IDE local snapshot.", error);
	} finally {
		localSnapshotInFlight = null;
	}
}

function cancelLocalProjectSnapshot() {
	if (localSnapshotTimer) {
		window.clearTimeout(localSnapshotTimer);
		localSnapshotTimer = null;
	}
}

async function discardLocalProjectSnapshot() {
	cancelLocalProjectSnapshot();
	if (localSnapshotInFlight) {
		try {
			await localSnapshotInFlight;
		} catch {
			// Snapshot failures are already logged by persistLocalProjectSnapshot.
		}
	}
	localSnapshotQueued = false;
	unsyncedProjectIDs.clear();
	await clearLocalPythonProjectsAsync(storageUserID.value);
}

async function discardLocalProjectSnapshotIfSafe() {
	if (unsyncedProjectIDs.size) return;
	await discardLocalProjectSnapshot();
}

function scheduleLocalProjectSnapshot() {
	cancelLocalProjectSnapshot();
	localSnapshotTimer = window.setTimeout(() => {
		localSnapshotTimer = null;
		void persistLocalProjectSnapshot();
	}, 250);
}

async function syncProjectsToAccount(projectList: PythonIdeProject[]) {
	return Promise.all(
		projectList.map(project =>
			project._id.startsWith("local-")
				? createRemotePythonIdeProject(
						pythonIdeProjectToPayload(project)
					)
				: updateRemotePythonIdeProject(
						project._id,
						pythonIdeProjectToPayload(project)
					)
		)
	);
}

async function loadProjects() {
	const loadRunID = ++projectLoadRunID;
	isLoading.value = true;
	suppressAutoSave = true;
	loadPersistedCodeEditorViewStates(storageUserID.value);
	try {
		if (canSyncToAccount.value) {
			const remoteProjects = await fetchPythonIdeProjects();
			if (!projectLoadIsCurrent(loadRunID)) return;
			const localProjects = await loadLocalPythonProjectsAsync(
				storageUserID.value
			);
			if (!projectLoadIsCurrent(loadRunID)) return;
			if (localProjects.length) {
				try {
					const syncedProjects =
						await syncProjectsToAccount(localProjects);
					if (!projectLoadIsCurrent(loadRunID)) return;
					setProjects(syncedProjects);
					await discardLocalProjectSnapshot();
					if (!projectLoadIsCurrent(loadRunID)) return;
					await openRequestedCourseProjectIfNeeded(false, loadRunID);
					if (!projectLoadIsCurrent(loadRunID)) return;
					saveMessage.value = "Synced recovered local edits";
					return;
				} catch (error) {
					if (!projectLoadIsCurrent(loadRunID)) return;
					setProjects(localProjects);
					appendOutput(
						"system",
						error instanceof Error
							? error.message
							: "Recovered local edits; account sync can be retried with Save."
					);
				}

				await openRequestedCourseProjectIfNeeded(false, loadRunID);
				if (!projectLoadIsCurrent(loadRunID)) return;
				saveMessage.value = "Recovered local edits";
				return;
			}

			if (remoteProjects.length) {
				setProjects(remoteProjects);
				await openRequestedCourseProjectIfNeeded(false, loadRunID);
				if (!projectLoadIsCurrent(loadRunID)) return;
				saveMessage.value = "Synced to account";
				return;
			}

			const initialProject = await createInitialProject();
			if (!projectLoadIsCurrent(loadRunID)) return;
			const remoteProject = await createRemotePythonIdeProject(
				pythonIdeProjectToPayload(initialProject)
			);
			if (!projectLoadIsCurrent(loadRunID)) return;
			setProjects([remoteProject]);
			await discardLocalProjectSnapshot();
			if (!projectLoadIsCurrent(loadRunID)) return;
			saveMessage.value = "Synced to account";
			return;
		}

		const localProjects = await loadLocalPythonProjectsAsync(
			storageUserID.value
		);
		if (!projectLoadIsCurrent(loadRunID)) return;
		setProjects(
			localProjects.length
				? localProjects
				: [await createInitialProject()]
		);
		if (!projectLoadIsCurrent(loadRunID)) return;
		await openRequestedCourseProjectIfNeeded(false, loadRunID);
		if (!projectLoadIsCurrent(loadRunID)) return;
		await persistLocalProjects();
	} catch (error) {
		const localProjects = await loadLocalPythonProjectsAsync(
			storageUserID.value
		);
		if (!projectLoadIsCurrent(loadRunID)) return;
		setProjects(
			localProjects.length
				? localProjects
				: [await createInitialProject()]
		);
		if (!projectLoadIsCurrent(loadRunID)) return;
		await openRequestedCourseProjectIfNeeded(true, loadRunID);
		if (!projectLoadIsCurrent(loadRunID)) return;
		saveMessage.value =
			error instanceof Error ? error.message : "Using local workspace";
	} finally {
		if (projectLoadIsCurrent(loadRunID)) {
			await nextTick();
			suppressAutoSave = false;
			isLoading.value = false;
			resetActiveCanvas();
		}
	}
}

interface SaveProjectOptions {
	force?: boolean;
}

async function saveProjectOnce(
	projectID: string,
	options: SaveProjectOptions = {}
) {
	const index = projects.value.findIndex(
		candidate => candidate._id === projectID
	);
	const project = index >= 0 ? projects.value[index] : null;
	if (!project || (suppressAutoSave && !options.force)) return true;

	const startedProjectID = project._id;
	const startedUpdatedAt = project.updatedAt ?? "";
	const payload = pythonIdeProjectToPayload(project);

	try {
		if (!canSyncToAccount.value) {
			await persistLocalProjects();
			return true;
		}

		await persistLocalProjects({ quiet: true });
		const savedProject = startedProjectID.startsWith("local-")
			? await createRemotePythonIdeProject(payload)
			: await updateRemotePythonIdeProject(startedProjectID, payload);
		const currentIndex = projects.value.findIndex(
			candidate => candidate._id === startedProjectID
		);
		const currentProject =
			currentIndex >= 0 ? projects.value[currentIndex] : null;
		if (!currentProject) return true;

		const projectChangedDuringSave =
			currentProject.updatedAt !== startedUpdatedAt;

		if (projectChangedDuringSave) {
			if (startedProjectID.startsWith("local-")) {
				migrateCodeEditorViewStates(startedProjectID, savedProject._id);
				currentProject._id = savedProject._id;
				currentProject.createdAt =
					currentProject.createdAt ?? savedProject.createdAt;
				if (selectedProjectID.value === startedProjectID) {
					expectedSelectedProjectIDMigration = {
						from: startedProjectID,
						to: savedProject._id
					};
					selectedProjectID.value = savedProject._id;
				}
			}
			unsyncedProjectIDs.delete(startedProjectID);
			unsyncedProjectIDs.delete(savedProject._id);
			pendingSaveProjectIDs.add(currentProject._id);
			await saveLocalPythonProjectsAsync(
				projects.value,
				storageUserID.value
			);
			return true;
		}

		if (currentIndex >= 0) {
			if (startedProjectID.startsWith("local-"))
				migrateCodeEditorViewStates(startedProjectID, savedProject._id);
			projects.value.splice(currentIndex, 1, savedProject);
			if (selectedProjectID.value === startedProjectID) {
				expectedSelectedProjectIDMigration = {
					from: startedProjectID,
					to: savedProject._id
				};
				selectedProjectID.value = savedProject._id;
			}
		}
		unsyncedProjectIDs.delete(startedProjectID);
		unsyncedProjectIDs.delete(savedProject._id);
		return true;
	} catch (error) {
		unsyncedProjectIDs.add(startedProjectID);
		await persistLocalProjects({
			message: "Saved locally after sync issue"
		});
		appendOutput(
			"system",
			error instanceof Error
				? error.message
				: "Save failed; kept a local copy."
		);
		return false;
	}
}

async function savePendingProjects(options: SaveProjectOptions = {}) {
	if (suppressAutoSave && !options.force) return;
	if (saveInFlight) {
		saveQueued = true;
		return saveInFlight;
	}

	isSaving.value = true;
	saveInFlight = (async () => {
		let remoteSyncFailed = false;
		do {
			saveQueued = false;
			const projectIDs = pendingSaveProjectIDs.size
				? [...pendingSaveProjectIDs]
				: selectedProjectID.value
					? [selectedProjectID.value]
					: [];
			pendingSaveProjectIDs.clear();

			for (const projectID of projectIDs) {
				const saved = await saveProjectOnce(projectID, options);
				if (!saved) remoteSyncFailed = true;
			}
		} while (saveQueued || pendingSaveProjectIDs.size);

		if (
			canSyncToAccount.value &&
			!remoteSyncFailed &&
			!unsyncedProjectIDs.size
		) {
			await discardLocalProjectSnapshot();
			saveMessage.value = "Synced to account";
		}
	})();

	try {
		await saveInFlight;
	} finally {
		saveInFlight = null;
		isSaving.value = false;
	}
}

async function saveSelectedProject(options: SaveProjectOptions = {}) {
	const projectID = selectedProject.value?._id;
	if (projectID) pendingSaveProjectIDs.add(projectID);
	return savePendingProjects(options);
}

function scheduleSave() {
	if (suppressAutoSave) return;
	const projectID = selectedProject.value?._id;
	if (!projectID) return;
	pendingSaveProjectIDs.add(projectID);

	if (!autoSaveEnabled.value) {
		if (saveTimer) window.clearTimeout(saveTimer);
		saveTimer = null;
		cancelLocalProjectSnapshot();
		saveMessage.value = "Autosave off";
		return;
	}

	scheduleLocalProjectSnapshot();
	saveMessage.value = canSyncToAccount.value
		? "Autosaving to account"
		: "Autosaving locally";
	if (saveTimer) window.clearTimeout(saveTimer);
	saveTimer = window.setTimeout(() => {
		saveTimer = null;
		void savePendingProjects();
	}, 700);
}

function flushPendingProjectSave() {
	if (
		suppressAutoSave ||
		!autoSaveEnabled.value ||
		!pendingSaveProjectIDs.size
	) {
		return;
	}
	cancelLocalProjectSnapshot();
	if (saveTimer) {
		window.clearTimeout(saveTimer);
		saveTimer = null;
	}
	saveLocalProjectSnapshot();
	void savePendingProjects();
}

function flushPendingProjectSaveOnVisibilityChange() {
	if (document.visibilityState === "hidden") flushPendingProjectSave();
}

function updateAutoSavePreference(event: Event) {
	const enabled = (event.target as HTMLInputElement).checked;
	autoSaveEnabled.value = enabled;
	persistPythonIdeAutoSavePreference(enabled);
	if (!enabled) {
		if (saveTimer) window.clearTimeout(saveTimer);
		saveTimer = null;
		cancelLocalProjectSnapshot();
		saveMessage.value = "Autosave off";
		return;
	}

	saveMessage.value = "Autosave on";
	flushPendingProjectSave();
}

async function createProject(
	mode: PythonIdeMode,
	template: "blank" | "demo" = "blank"
) {
	const starter = createPythonIdeProject(mode, { template });
	suppressAutoSave = true;
	try {
		await saveNewProject(starter);
	} catch (error) {
		projects.value.unshift(starter);
		selectedProjectID.value = starter._id;
		await persistLocalProjects();
		appendOutput(
			"system",
			error instanceof Error ? error.message : "Project created locally."
		);
	} finally {
		suppressAutoSave = false;
		await nextTick();
		resetActiveCanvas();
	}
}

async function createProjectFromMenu(
	mode: PythonIdeMode,
	template: "blank" | "demo" = "blank"
) {
	showProjectMenu.value = false;
	await createProject(mode, template);
}

function projectLabel(project: PythonIdeProject) {
	return project.title || "Untitled Project";
}

function requestProjectDelete(project: PythonIdeProject) {
	if (projects.value.length <= 1) {
		appendOutput("system", "Keep at least one project in the workspace.");
		return;
	}
	selectedProjectID.value = project._id;
	deleteCandidateProjectID.value = project._id;
	deleteConfirmText.value = "";
}

function cancelProjectDelete() {
	deleteCandidateProjectID.value = "";
	deleteConfirmText.value = "";
}

async function confirmProjectDelete(project: PythonIdeProject) {
	if (deleteConfirmText.value.trim().toLowerCase() !== "confirm") return;
	await deleteProject(project);
	cancelProjectDelete();
}

async function deleteProject(project: PythonIdeProject) {
	if (projects.value.length <= 1) {
		appendOutput("system", "Keep at least one project in the workspace.");
		return;
	}

	try {
		const isRemoteProject =
			canSyncToAccount.value && !project._id.startsWith("local-");
		if (isRemoteProject) {
			await deleteRemotePythonIdeProject(project._id);
		}
		projects.value = projects.value.filter(
			candidate => candidate._id !== project._id
		);
		deleteCodeEditorStateForProject(project._id);
		selectedProjectID.value = projects.value[0]?._id ?? "";
		if (isRemoteProject) {
			await discardLocalProjectSnapshotIfSafe();
			saveMessage.value = "Synced to account";
		} else {
			await persistLocalProjects();
		}
	} catch (error) {
		appendOutput(
			"stderr",
			error instanceof Error ? error.message : "Could not delete project."
		);
	}
}

function updateProjectTitle(event: Event) {
	if (!selectedProject.value) return;
	const input = event.target as HTMLInputElement;
	selectedProject.value.title = input.value;
	touchSelectedProject();
	scheduleSave();
}

function codeEditorViewStateKey() {
	const projectID = selectedProject.value?._id;
	const fileName = activeFile.value?.name;
	return projectID && fileName ? `${projectID}:${fileName}` : "";
}

function saveCodeEditorViewState() {
	if (!codeEditorView || !activeCodeEditorViewStateKey) return;

	const { selection } = codeEditorView.state;
	codeEditorStateSnapshots.set(
		activeCodeEditorViewStateKey,
		codeEditorView.state
	);
	codeEditorViewStates.set(activeCodeEditorViewStateKey, {
		mainIndex: selection.mainIndex,
		ranges: selection.ranges.map(range => ({
			anchor: range.anchor,
			head: range.head
		})),
		scrollLeft: codeEditorView.scrollDOM.scrollLeft,
		scrollTop: codeEditorView.scrollDOM.scrollTop
	});

	if (codeEditorViewStates.size > maxCodeEditorViewStates) {
		const oldestKey = codeEditorViewStates.keys().next().value;
		if (oldestKey) {
			codeEditorViewStates.delete(oldestKey);
			codeEditorStateSnapshots.delete(oldestKey);
		}
	}
	persistCodeEditorViewStates(storageUserID.value);
}

function deleteCodeEditorStateForFile(projectID: string, fileName: string) {
	const key = `${projectID}:${fileName}`;
	codeEditorViewStates.delete(key);
	codeEditorStateSnapshots.delete(key);
	if (activeCodeEditorViewStateKey === key) activeCodeEditorViewStateKey = "";
	persistCodeEditorViewStates(storageUserID.value);
}

function deleteCodeEditorStateForProject(projectID: string) {
	for (const key of [
		...codeEditorViewStates.keys(),
		...codeEditorStateSnapshots.keys()
	]) {
		if (!key.startsWith(`${projectID}:`)) continue;
		codeEditorViewStates.delete(key);
		codeEditorStateSnapshots.delete(key);
		if (activeCodeEditorViewStateKey === key)
			activeCodeEditorViewStateKey = "";
	}
	persistCodeEditorViewStates(storageUserID.value);
}

function migrateCodeEditorViewStates(
	fromProjectID: string,
	toProjectID: string
) {
	if (!fromProjectID || !toProjectID || fromProjectID === toProjectID) return;

	for (const [key, state] of [...codeEditorViewStates]) {
		if (!key.startsWith(`${fromProjectID}:`)) continue;
		const nextKey = `${toProjectID}:${key.slice(fromProjectID.length + 1)}`;
		codeEditorViewStates.set(nextKey, state);
		codeEditorViewStates.delete(key);
		if (activeCodeEditorViewStateKey === key)
			activeCodeEditorViewStateKey = nextKey;
	}
	for (const [key, state] of [...codeEditorStateSnapshots]) {
		if (!key.startsWith(`${fromProjectID}:`)) continue;
		const nextKey = `${toProjectID}:${key.slice(fromProjectID.length + 1)}`;
		codeEditorStateSnapshots.set(nextKey, state);
		codeEditorStateSnapshots.delete(key);
		if (activeCodeEditorViewStateKey === key)
			activeCodeEditorViewStateKey = nextKey;
	}
	persistCodeEditorViewStates(storageUserID.value);
}

function clampCodeEditorPosition(position: number, docLength: number) {
	return Math.max(0, Math.min(docLength, position));
}

function restoreCodeEditorScroll(view: CodeEditorView, viewStateKey: string) {
	const state = codeEditorViewStates.get(viewStateKey);
	if (!state) return;

	requestAnimationFrame(() => {
		if (
			codeEditorView !== view ||
			activeCodeEditorViewStateKey !== viewStateKey
		) {
			return;
		}
		view.scrollDOM.scrollLeft = state.scrollLeft;
		view.scrollDOM.scrollTop = state.scrollTop;
	});
}

function restoreCodeEditorViewState(
	view: CodeEditorView,
	editorSelection: typeof import("@codemirror/state").EditorSelection,
	viewStateKey: string
) {
	const state = codeEditorViewStates.get(viewStateKey);
	if (!state) return;

	const docLength = view.state.doc.length;
	const ranges = state.ranges.length
		? state.ranges.map(range => {
				const anchor = clampCodeEditorPosition(range.anchor, docLength);
				const head = clampCodeEditorPosition(range.head, docLength);
				return anchor === head
					? editorSelection.cursor(anchor)
					: editorSelection.range(anchor, head);
			})
		: [editorSelection.cursor(0)];

	view.dispatch({
		selection: editorSelection.create(
			ranges,
			Math.min(state.mainIndex, ranges.length - 1)
		),
		scrollIntoView: true
	});

	restoreCodeEditorScroll(view, viewStateKey);
}

async function resetCodeEditor() {
	const resetToken = ++codeEditorResetToken;
	saveCodeEditorViewState();
	codeEditorView?.destroy();
	codeEditorView = null;
	activeCodeEditorViewStateKey = "";
	editorCursorCount.value = 1;

	const host = codeEditorHostRef.value;
	if (!host || activeFileIsBinaryAsset.value) return;

	host.textContent = "";
	const [
		{ EditorView },
		{ EditorSelection },
		{ createPythonCodeMirrorExtensions }
	] = await loadPythonCodeEditorModules();
	if (resetToken !== codeEditorResetToken) return;
	if (host !== codeEditorHostRef.value || activeFileIsBinaryAsset.value)
		return;

	const viewStateKey = codeEditorViewStateKey();
	const savedState = viewStateKey
		? codeEditorStateSnapshots.get(viewStateKey)
		: null;
	const restoredState =
		savedState?.doc.toString() === activeFileContent.value
			? savedState
			: null;
	const extensions = createPythonCodeMirrorExtensions({
		assetCompletions: loadPythonCodeMirrorAssetCompletions,
		mode: selectedProject.value?.mode ?? "python",
		onChange(content) {
			syncingCodeMirrorContent = true;
			activeFileContent.value = content;
			void nextTick(() => {
				syncingCodeMirrorContent = false;
			});
		},
		onCursorCountChange(count) {
			editorCursorCount.value = count;
		},
		onRun: activateRunControl,
		onSave: () => {
			void saveSelectedProject({ force: true });
		}
	});
	codeEditorView = restoredState
		? new EditorView({
				state: restoredState,
				parent: host
			})
		: new EditorView({
				doc: activeFileContent.value,
				extensions,
				parent: host
			});
	activeCodeEditorViewStateKey = viewStateKey;
	if (viewStateKey) {
		if (restoredState) {
			restoreCodeEditorScroll(codeEditorView, viewStateKey);
		} else {
			restoreCodeEditorViewState(
				codeEditorView,
				EditorSelection,
				viewStateKey
			);
		}
	}
}

function syncCodeEditorContent(content: string) {
	if (syncingCodeMirrorContent || !codeEditorView) return;
	if (codeEditorView.state.doc.toString() === content) return;

	codeEditorView.dispatch({
		changes: {
			from: 0,
			to: codeEditorView.state.doc.length,
			insert: content
		}
	});
}

function selectFile(fileName: string) {
	if (!selectedProject.value) return;
	selectedProject.value.activeFileName = fileName;
	editorCursorCount.value = 1;
	touchSelectedProject();
	scheduleSave();
}

function addFile() {
	if (!selectedProject.value) return;
	const fileName = normalizePythonFileName(newFileName.value);
	if (!isValidPythonFileName(fileName)) {
		appendOutput(
			"stderr",
			`Use a safe root code/data file or images/, sounds/, music/ asset file ending in ${pythonIdeAllowedFileExtensions.join(", ")}.`
		);
		return;
	}
	if (selectedProject.value.files.some(file => file.name === fileName)) {
		appendOutput("stderr", `${fileName} already exists in this project.`);
		return;
	}

	selectedProject.value.files.push({
		name: fileName,
		content: getPythonIdeDefaultFileContent(fileName)
	});
	selectedProject.value.activeFileName = fileName;
	newFileName.value = "";
	touchSelectedProject();
	scheduleSave();
}

function readFileAsDataUrl(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			resolve(typeof reader.result === "string" ? reader.result : "");
		});
		reader.addEventListener(
			"error",
			() => reject(new Error(`Could not import ${file.name}.`)),
			{ once: true }
		);
		reader.readAsDataURL(file);
	});
}

async function readImportedProjectFile(file: File, fileName: string) {
	if (isPythonIdeTextFile(fileName)) {
		return {
			content: await file.text(),
			encoding: "text" as const
		};
	}

	const dataUrl = await readFileAsDataUrl(file);
	return {
		content: dataUrl.includes(",")
			? (dataUrl.split(",")[1] ?? "")
			: dataUrl,
		encoding: "base64" as const
	};
}

function importedProjectFileSizeLimit(fileName: string) {
	return isPythonIdeTextFile(fileName)
		? maxImportedTextFileBytes
		: maxImportedBinaryFileBytes;
}

function formatFileSize(bytes: number) {
	if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${Math.ceil(bytes / 1024)} KB`;
}

async function importProjectFiles(event: Event) {
	const project = selectedProject.value;
	const input = event.target as HTMLInputElement;
	const files = [...(input.files ?? [])];
	if (!project || !files.length) return;

	const skippedFiles: string[] = [];
	let importedCount = 0;

	for (const file of files) {
		const fileName = normalizeImportedPythonIdeFileName(file.name);
		if (!isValidPythonFileName(fileName)) {
			skippedFiles.push(file.name);
			continue;
		}
		const existingIndex = project.files.findIndex(
			candidate => candidate.name === fileName
		);
		const sizeLimit = importedProjectFileSizeLimit(fileName);
		if (file.size > sizeLimit) {
			skippedFiles.push(
				`${file.name} (larger than ${formatFileSize(sizeLimit)})`
			);
			continue;
		}
		if (
			existingIndex < 0 &&
			project.files.length >= maxPythonIdeProjectFiles
		) {
			skippedFiles.push(
				`${file.name} (project already has ${maxPythonIdeProjectFiles} files)`
			);
			continue;
		}

		let imported: Awaited<ReturnType<typeof readImportedProjectFile>>;
		try {
			imported = await readImportedProjectFile(file, fileName);
		} catch (error) {
			skippedFiles.push(
				error instanceof Error ? error.message : file.name
			);
			continue;
		}
		const nextFile: PythonIdeFile = {
			name: fileName,
			content: imported.content,
			encoding: imported.encoding
		};

		if (existingIndex >= 0) {
			project.files.splice(existingIndex, 1, nextFile);
		} else {
			project.files.push(nextFile);
		}

		project.activeFileName = fileName;
		importedCount += 1;
	}

	if (importedCount) {
		touchSelectedProject();
		scheduleSave();
		appendOutput(
			"system",
			`Imported ${importedCount} project file${importedCount === 1 ? "" : "s"}.`
		);
	}
	if (skippedFiles.length) {
		appendOutput(
			"stderr",
			`Skipped unsupported file${skippedFiles.length === 1 ? "" : "s"}: ${skippedFiles.join(", ")}.`
		);
	}

	input.value = "";
}

function deleteFile(file: PythonIdeFile) {
	const project = selectedProject.value;
	if (!project) return;
	const pythonFileCount = project.files.filter(file =>
		isPythonIdePythonFile(file.name)
	).length;
	if (isPythonIdePythonFile(file.name) && pythonFileCount <= 1) {
		appendOutput(
			"system",
			"Keep at least one Python file so the project can run."
		);
		return;
	}

	project.files = project.files.filter(
		candidate => candidate.name !== file.name
	);
	deleteCodeEditorStateForFile(project._id, file.name);
	if (project.activeFileName === file.name) {
		project.activeFileName = resolvePythonIdeActiveFileName(project.files);
	}
	touchSelectedProject();
	scheduleSave();
}

function canDeleteFile(file: PythonIdeFile) {
	const project = selectedProject.value;
	if (!project) return false;
	if (project.files.length <= 1) return false;
	const pythonFileCount = project.files.filter(candidate =>
		isPythonIdePythonFile(candidate.name)
	).length;
	return !(isPythonIdePythonFile(file.name) && pythonFileCount <= 1);
}

function clearOutput() {
	outputLines.value = [];
	runtimeArtifacts.value = [];
	gameAudioPlaybackBlockedNoticeShown = false;
}

function refreshActiveTurtleEventHandlerCount() {
	activeTurtleEventHandlerCount.value =
		keyHandlers.size + turtleClickHandlers.size + turtleDragHandlers.size;
}

function createCanvasCoordinateMapper(rect: DOMRect): CanvasCoordinateMapper {
	return (x: number, y: number) => ({
		x: rect.width / 2 + x,
		y: rect.height / 2 - y
	});
}

function getCanvasContext() {
	const canvas = canvasRef.value;
	if (!canvas) return null;
	return canvas.getContext("2d");
}

function syncCanvasBitmapSize(
	canvas: HTMLCanvasElement,
	rect: DOMRect,
	dpr: number
) {
	const nextWidth = Math.max(1, Math.floor(rect.width * dpr));
	const nextHeight = Math.max(1, Math.floor(rect.height * dpr));
	if (canvas.width !== nextWidth) canvas.width = nextWidth;
	if (canvas.height !== nextHeight) canvas.height = nextHeight;
}

function resizeCanvasForDisplay() {
	const canvas = canvasRef.value;
	const context = getCanvasContext();
	if (!canvas || !context) return null;

	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	syncCanvasBitmapSize(canvas, rect, dpr);
	context.setTransform(dpr, 0, 0, dpr, 0, 0);

	return { context, rect };
}

function currentTurtlePose(): TurtlePose {
	return {
		x: turtleState.x,
		y: turtleState.y,
		heading: turtleState.heading,
		penColor: turtleState.penColor,
		shape: turtleState.shape,
		speed: turtleState.speed,
		visible: turtleState.visible
	};
}

function activateTurtleState(id: string) {
	activeTurtleID = id || defaultTurtleID;
	if (
		activeTurtleID !== defaultTurtleID &&
		turtleStates.size === 1 &&
		turtleStates.has(defaultTurtleID) &&
		turtleCompletedCommands.length === 0 &&
		turtleQueuedSteps.length === 0
	) {
		turtleStates.delete(defaultTurtleID);
		turtleVisiblePoses.delete(defaultTurtleID);
	}

	const existingState = turtleStates.get(activeTurtleID);
	if (existingState) {
		turtleState = existingState;
		return;
	}

	turtleState = createDefaultTurtleState(turtleState.background);
	turtleStates.set(activeTurtleID, turtleState);
	turtleVisiblePoses.set(activeTurtleID, currentTurtlePose());
}

function visibleTurtlePose(turtleID = activeTurtleID) {
	return turtleVisiblePoses.get(turtleID) ?? currentTurtlePose();
}

function setTurtleVisiblePose(pose: TurtlePose, turtleID = activeTurtleID) {
	turtleVisiblePoses.set(turtleID, { ...pose });
}

function turtlePoseChanged(fromPose: TurtlePose, toPose: TurtlePose) {
	return (
		fromPose.x !== toPose.x ||
		fromPose.y !== toPose.y ||
		fromPose.heading !== toPose.heading ||
		fromPose.penColor !== toPose.penColor ||
		fromPose.shape !== toPose.shape ||
		fromPose.visible !== toPose.visible
	);
}

function lerp(start: number, end: number, progress: number) {
	return start + (end - start) * progress;
}

function interpolateTurtlePose(
	fromPose: TurtlePose,
	toPose: TurtlePose,
	progress: number
): TurtlePose {
	return {
		x: lerp(fromPose.x, toPose.x, progress),
		y: lerp(fromPose.y, toPose.y, progress),
		heading: lerp(fromPose.heading, toPose.heading, progress),
		penColor: progress < 1 ? fromPose.penColor : toPose.penColor,
		shape: progress < 1 ? fromPose.shape : toPose.shape,
		speed: progress < 1 ? fromPose.speed : toPose.speed,
		visible: progress < 1 ? fromPose.visible : toPose.visible
	};
}

function turtleMovementDuration(fromPose: TurtlePose, toPose: TurtlePose) {
	if (!turtleTracerEnabled || fromPose.speed === 0)
		return turtleInstantStepMaxDurationMs;

	const speedScale = turtleAnimationSpeedScale(fromPose.speed);
	const distance = Math.hypot(toPose.x - fromPose.x, toPose.y - fromPose.y);
	const headingDelta = Math.abs(toPose.heading - fromPose.heading);
	if (distance > 0) {
		return Math.min(
			900,
			Math.max(
				1,
				distance *
					turtleDistanceDurationMsPerPixelAtDefaultSpeed *
					speedScale
			)
		);
	}
	if (headingDelta > 0)
		return Math.max(1, turtleTurnStepDurationMs * speedScale);
	return turtleInstantStepMaxDurationMs;
}

function turtleAnimationSpeedScale(speed: number) {
	const normalizedSpeed = Number.isFinite(speed)
		? Math.max(1, Math.min(10, speed))
		: turtleDefaultSpeed;
	return turtleDefaultSpeed / normalizedSpeed;
}

function normalizeTurtleShape(shape: string): TurtleShapeName {
	return supportedTurtleShapes.has(shape as TurtleShapeName)
		? (shape as TurtleShapeName)
		: defaultTurtleShape;
}

function drawTurtleMarker(
	context: CanvasRenderingContext2D,
	pose: TurtlePose,
	toCanvas: CanvasCoordinateMapper
) {
	if (!pose.visible) return;

	const point = toCanvas(pose.x, pose.y);
	const radians = (pose.heading * Math.PI) / 180;

	context.save();
	context.translate(point.x, point.y);
	context.rotate(-radians);
	context.lineCap = "round";
	context.lineJoin = "round";
	context.lineWidth = 1.5;
	context.strokeStyle = pose.penColor;
	context.fillStyle = pose.penColor;

	switch (pose.shape) {
		case "arrow":
			drawArrowTurtleShape(context);
			break;
		case "blank":
			break;
		case "circle":
			drawCircleTurtleShape(context);
			break;
		case "fancy":
			drawFancyTurtleShape(context);
			break;
		case "square":
			drawSquareTurtleShape(context);
			break;
		case "triangle":
			drawTriangleTurtleShape(context);
			break;
		case "turtle":
			drawOriginalTurtleShape(context);
			break;
		case "classic":
		default:
			drawClassicTurtleShape(context);
			break;
	}

	context.restore();
}

function drawClassicTurtleShape(context: CanvasRenderingContext2D) {
	drawOriginalTurtlePolygonShape(
		context,
		turtleOriginalShapePolygons.classic
	);
}

function drawArrowTurtleShape(context: CanvasRenderingContext2D) {
	drawOriginalTurtlePolygonShape(context, turtleOriginalShapePolygons.arrow);
}

function drawTriangleTurtleShape(context: CanvasRenderingContext2D) {
	drawOriginalTurtlePolygonShape(
		context,
		turtleOriginalShapePolygons.triangle
	);
}

function drawSquareTurtleShape(context: CanvasRenderingContext2D) {
	drawOriginalTurtlePolygonShape(context, turtleOriginalShapePolygons.square);
}

function drawCircleTurtleShape(context: CanvasRenderingContext2D) {
	drawOriginalTurtlePolygonShape(context, turtleOriginalShapePolygons.circle);
}

function drawOriginalTurtleShape(context: CanvasRenderingContext2D) {
	drawOriginalTurtlePolygonShape(context, turtleOriginalShapePolygons.turtle);
}

function drawOriginalTurtlePolygonShape(
	context: CanvasRenderingContext2D,
	points: Array<[number, number]>
) {
	const [firstPoint, ...remainingPoints] = points;
	if (!firstPoint) return;
	const markerColor = context.fillStyle;
	context.beginPath();
	context.moveTo(firstPoint[1], firstPoint[0]);
	for (const [x, y] of remainingPoints) context.lineTo(y, x);
	context.closePath();
	context.strokeStyle = turtleState.background;
	context.lineWidth = turtleMarkerHaloLineWidth;
	context.stroke();
	context.fillStyle = markerColor;
	context.fill();
	context.strokeStyle = markerColor;
	context.lineWidth = turtleMarkerStrokeLineWidth;
	context.stroke();
}

function drawFancyTurtleShape(context: CanvasRenderingContext2D) {
	context.lineWidth = 1.35;
	context.strokeStyle = "#14532d";
	context.fillStyle = "#86efac";
	for (const [x, y, radiusX, radiusY, rotation] of [
		[7.5, -9, 4.5, 2.5, -0.55],
		[7.5, 9, 4.5, 2.5, 0.55],
		[-8.5, -8.5, 4.2, 2.4, 0.55],
		[-8.5, 8.5, 4.2, 2.4, -0.55]
	] as const) {
		context.beginPath();
		context.ellipse(x, y, radiusX, radiusY, rotation, 0, Math.PI * 2);
		context.fill();
		context.stroke();
	}

	context.beginPath();
	context.ellipse(12.5, 0, 5.6, 4.6, 0, 0, Math.PI * 2);
	context.fill();
	context.stroke();

	context.beginPath();
	context.ellipse(-13.4, 0, 4.8, 3.4, 0, 0, Math.PI * 2);
	context.fill();
	context.stroke();

	context.fillStyle = "#22c55e";
	context.beginPath();
	context.ellipse(0, 0, 12, 9.25, 0, 0, Math.PI * 2);
	context.fill();
	context.stroke();

	context.strokeStyle = "rgba(20, 83, 45, 0.55)";
	context.lineWidth = 0.9;
	context.beginPath();
	context.moveTo(-7.2, -5.3);
	context.quadraticCurveTo(0, -8.2, 7.2, -5.3);
	context.moveTo(-8.3, 0);
	context.lineTo(8.3, 0);
	context.moveTo(-7.2, 5.3);
	context.quadraticCurveTo(0, 8.2, 7.2, 5.3);
	context.stroke();

	context.fillStyle = "#052e16";
	context.beginPath();
	context.arc(14.5, -1.6, 0.85, 0, Math.PI * 2);
	context.arc(14.5, 1.6, 0.85, 0, Math.PI * 2);
	context.fill();
}

function renderTurtleCommand(
	context: CanvasRenderingContext2D,
	command: TurtleRenderCommand,
	toCanvas: CanvasCoordinateMapper,
	progress = 1,
	activeLineEnd?: { x: number; y: number }
) {
	if (command.kind === "line") {
		const start = toCanvas(command.from.x, command.from.y);
		const partialEnd = activeLineEnd ?? {
			x: lerp(command.from.x, command.to.x, progress),
			y: lerp(command.from.y, command.to.y, progress)
		};
		const end = toCanvas(partialEnd.x, partialEnd.y);
		context.strokeStyle = command.color;
		context.lineWidth = command.width;
		context.lineCap = "butt";
		context.lineJoin = "round";
		context.beginPath();
		context.moveTo(start.x, start.y);
		context.lineTo(end.x, end.y);
		context.stroke();
		return;
	}

	if (progress < 1) return;

	if (command.kind === "circle") {
		const center = toCanvas(command.x, command.y + command.radius);
		context.strokeStyle = command.color;
		context.lineWidth = command.width;
		context.beginPath();
		context.arc(
			center.x,
			center.y,
			Math.abs(command.radius),
			0,
			Math.PI * 2
		);
		context.stroke();
		return;
	}

	if (command.kind === "dot") {
		const point = toCanvas(command.x, command.y);
		context.fillStyle = command.color;
		context.beginPath();
		context.arc(
			point.x,
			point.y,
			Math.max(1, command.size) / 2,
			0,
			Math.PI * 2
		);
		context.fill();
		return;
	}

	if (command.kind === "fill") {
		const [firstPoint, ...remainingPoints] = command.points;
		if (!firstPoint) return;
		const firstCanvasPoint = toCanvas(firstPoint.x, firstPoint.y);
		context.fillStyle = command.fillColor;
		context.beginPath();
		context.moveTo(firstCanvasPoint.x, firstCanvasPoint.y);
		for (const point of remainingPoints) {
			const canvasPoint = toCanvas(point.x, point.y);
			context.lineTo(canvasPoint.x, canvasPoint.y);
		}
		context.closePath();
		context.fill();
		context.strokeStyle = command.color;
		context.lineWidth = command.width;
		context.lineCap = "round";
		context.lineJoin = "round";
		context.stroke();
		return;
	}

	if (command.kind === "stamp") {
		drawTurtleMarker(
			context,
			{
				x: command.x,
				y: command.y,
				heading: command.heading,
				penColor: command.color,
				shape: command.shape,
				speed: 0,
				visible: true
			},
			toCanvas
		);
		return;
	}

	const point = toCanvas(command.x, command.y);
	context.fillStyle = command.color;
	context.font = "16px Avenir Next, Segoe UI, sans-serif";
	context.fillText(command.text, point.x, point.y);
}

function renderTurtleScene(
	markerPose = visibleTurtlePose(),
	activeCommand?: { command: TurtleRenderCommand; progress: number },
	activeMarkerTurtleID = activeTurtleID
) {
	const canvasContext = resizeCanvasForDisplay();
	if (!canvasContext) return;

	const { context, rect } = canvasContext;
	const toCanvas = createCanvasCoordinateMapper(rect);
	context.fillStyle = turtleState.background;
	context.fillRect(0, 0, rect.width, rect.height);
	for (const { command } of turtleCompletedCommands)
		renderTurtleCommand(context, command, toCanvas);
	if (activeCommand) {
		renderTurtleCommand(
			context,
			activeCommand.command,
			toCanvas,
			activeCommand.progress,
			activeCommand.command.kind === "line"
				? { x: markerPose.x, y: markerPose.y }
				: undefined
		);
	}

	for (const [turtleID, pose] of turtleVisiblePoses) {
		if (turtleID !== activeMarkerTurtleID)
			drawTurtleMarker(context, pose, toCanvas);
	}

	drawTurtleMarker(context, markerPose, toCanvas);
}

function turtleAnimationBacklogStepCount(turtleID: string) {
	return (
		(activeTurtleAnimationStep?.turtleID === turtleID ? 1 : 0) +
		turtleQueuedSteps.filter(step => step.turtleID === turtleID).length
	);
}

function shouldFastForwardTurtleBacklog(step: TurtleAnimationStep) {
	return (
		turtleAnimationBacklogStepCount(step.turtleID) >=
		turtleBacklogFastForwardStepThreshold
	);
}

function resolveActiveTurtleAnimation() {
	resolveTurtleAnimation?.();
	resolveTurtleAnimation = null;
	turtleAnimationPromise = null;
}

function cancelTurtleAnimation() {
	if (turtleAnimationFrame !== null) {
		cancelAnimationFrame(turtleAnimationFrame);
		turtleAnimationFrame = null;
	}
	activeTurtleAnimationStep = null;
	turtleAnimationStepStartedAt = 0;
	turtleQueuedSteps = [];
	resolveActiveTurtleAnimation();
}

function runTurtleAnimationFrame(timestamp: number) {
	if (!activeTurtleAnimationStep) {
		activeTurtleAnimationStep = turtleQueuedSteps.shift() ?? null;
		turtleAnimationStepStartedAt =
			timestamp -
			Math.min(
				turtleAnimationInitialFrameCreditMs,
				activeTurtleAnimationStep?.durationMs ?? 0
			);
	}

	const step = activeTurtleAnimationStep;
	if (!step) {
		turtleAnimationFrame = null;
		renderTurtleScene();
		resolveActiveTurtleAnimation();
		return;
	}

	if (shouldFastForwardTurtleBacklog(step)) {
		flushBackloggedTurtleAnimationSteps(timestamp);
		return;
	}

	if (isInstantTurtleAnimationStep(step)) {
		flushInstantTurtleAnimationSteps(timestamp);
		return;
	}

	const elapsed = timestamp - turtleAnimationStepStartedAt;
	const progress = Math.min(1, elapsed / Math.max(1, step.durationMs));
	const markerPose = interpolateTurtlePose(
		step.fromPose,
		step.toPose,
		progress
	);
	setTurtleVisiblePose(markerPose, step.turtleID);
	renderTurtleScene(
		markerPose,
		step.command ? { command: step.command, progress } : undefined,
		step.turtleID
	);

	if (progress >= 1) {
		if (step.command) {
			turtleCompletedCommands.push({
				command: step.command,
				turtleID: step.turtleID
			});
		}
		activeTurtleAnimationStep = null;
	}

	turtleAnimationFrame = requestAnimationFrame(runTurtleAnimationFrame);
}

function isInstantTurtleAnimationStep(step: TurtleAnimationStep) {
	return (
		!isVisibleTurtleTrailStep(step) &&
		step.durationMs <= turtleInstantStepMaxDurationMs &&
		turtleAnimationStepDistance(step) <= turtleInstantStepMaxDistance
	);
}

function isVisibleTurtleTrailStep(step: TurtleAnimationStep) {
	return (
		step.command?.kind === "line" &&
		step.fromPose.visible &&
		step.toPose.visible
	);
}

function turtleAnimationStepDistance(step: TurtleAnimationStep) {
	return Math.hypot(
		step.toPose.x - step.fromPose.x,
		step.toPose.y - step.fromPose.y
	);
}

function completeTurtleAnimationStep(step: TurtleAnimationStep) {
	if (step.command) {
		turtleCompletedCommands.push({
			command: step.command,
			turtleID: step.turtleID
		});
	}
	setTurtleVisiblePose(step.toPose, step.turtleID);
}

function flushInstantTurtleAnimationSteps(timestamp: number) {
	let consumedDistance = 0;
	let consumedSteps = 0;
	const synchronizedTurtleID =
		activeTurtleAnimationStep?.turtleID ?? activeTurtleID;
	let markerPose = visibleTurtlePose(synchronizedTurtleID);

	while (
		activeTurtleAnimationStep &&
		isInstantTurtleAnimationStep(activeTurtleAnimationStep) &&
		activeTurtleAnimationStep.turtleID === synchronizedTurtleID &&
		consumedSteps < turtleInstantFrameStepBudget &&
		(consumedDistance < turtleInstantFrameDistanceBudget ||
			consumedSteps === 0)
	) {
		const step = activeTurtleAnimationStep;
		markerPose = step.toPose;
		completeTurtleAnimationStep(step);
		consumedDistance += turtleAnimationStepDistance(step);
		consumedSteps += 1;
		activeTurtleAnimationStep = turtleQueuedSteps.shift() ?? null;
		turtleAnimationStepStartedAt = timestamp;
	}

	renderTurtleScene(markerPose, undefined, synchronizedTurtleID);
	if (!activeTurtleAnimationStep && turtleQueuedSteps.length === 0) {
		turtleAnimationFrame = null;
		resolveActiveTurtleAnimation();
		return;
	}

	turtleAnimationFrame = requestAnimationFrame(runTurtleAnimationFrame);
}

function flushBackloggedTurtleAnimationSteps(timestamp: number) {
	let consumedDistance = 0;
	let consumedSteps = 0;
	const synchronizedTurtleID =
		activeTurtleAnimationStep?.turtleID ?? activeTurtleID;
	let markerPose = visibleTurtlePose(synchronizedTurtleID);

	while (
		activeTurtleAnimationStep &&
		activeTurtleAnimationStep.turtleID === synchronizedTurtleID &&
		consumedSteps < turtleBacklogFrameStepBudget &&
		(consumedDistance < turtleBacklogFrameDistanceBudget ||
			consumedSteps === 0)
	) {
		const step = activeTurtleAnimationStep;
		markerPose = step.toPose;
		completeTurtleAnimationStep(step);
		consumedDistance += turtleAnimationStepDistance(step);
		consumedSteps += 1;
		activeTurtleAnimationStep = turtleQueuedSteps.shift() ?? null;
		turtleAnimationStepStartedAt = timestamp;
	}

	renderTurtleScene(markerPose, undefined, synchronizedTurtleID);
	if (!activeTurtleAnimationStep && turtleQueuedSteps.length === 0) {
		turtleAnimationFrame = null;
		resolveActiveTurtleAnimation();
		return;
	}

	turtleAnimationFrame = requestAnimationFrame(runTurtleAnimationFrame);
}

function scheduleTurtleAnimation() {
	if (!turtleAnimationPromise) {
		turtleAnimationPromise = new Promise<void>(resolve => {
			resolveTurtleAnimation = resolve;
		});
	}
	if (turtleAnimationFrame === null)
		turtleAnimationFrame = requestAnimationFrame(runTurtleAnimationFrame);
	return turtleAnimationPromise;
}

function queueTurtleStep(
	step: Omit<TurtleAnimationStep, "turtleID"> & { turtleID?: string }
) {
	turtleQueuedSteps.push({
		...step,
		turtleID: step.turtleID ?? activeTurtleID
	});
	void scheduleTurtleAnimation();
}

function waitForTurtleAnimation() {
	return turtleAnimationPromise ?? Promise.resolve();
}

function setTurtleState(
	x: number,
	y: number,
	heading: number,
	penDown: boolean,
	penColor: string,
	fillColor: string,
	lineWidth: number
) {
	const fromPose = currentTurtlePose();
	turtleState.x = x;
	turtleState.y = y;
	turtleState.heading = heading;
	turtleState.penDown = penDown;
	turtleState.penColor = penColor;
	turtleState.fillColor = fillColor;
	turtleState.lineWidth = Math.max(1, lineWidth);
	const toPose = currentTurtlePose();
	if (turtlePoseChanged(fromPose, toPose)) {
		queueTurtleStep({
			durationMs: turtleMovementDuration(fromPose, toPose),
			fromPose,
			toPose
		});
	}
}

function resetTurtleCanvas() {
	cancelTurtleAnimation();
	clearTurtleTimers();
	keyHandlers.clear();
	turtleClickHandlers.clear();
	turtleDragHandlers.clear();
	refreshActiveTurtleEventHandlerCount();
	activeTurtleDragButton = null;
	turtleStampCounter = 0;
	turtleCompletedCommands = [];
	turtleQueuedSteps = [];
	activeTurtleID = defaultTurtleID;
	turtleTracerEnabled = true;
	const background = turtleState.background;
	turtleState = createDefaultTurtleState(background);
	turtleStates = new Map<string, TurtleState>([
		[defaultTurtleID, turtleState]
	]);
	turtleVisiblePoses = new Map<string, TurtlePose>();
	turtleFillState.active = false;
	turtleFillState.points = [];
	stopGameLoop();
	const canvasContext = resizeCanvasForDisplay();
	if (!canvasContext) return;

	const { context, rect } = canvasContext;
	setTurtleVisiblePose(currentTurtlePose());

	context.fillStyle = turtleState.background;
	context.fillRect(0, 0, rect.width, rect.height);
	drawTurtleMarker(
		context,
		visibleTurtlePose(),
		createCanvasCoordinateMapper(rect)
	);
}

function cancelActiveTurtleDrawingSteps(turtleID = activeTurtleID) {
	turtleCompletedCommands = turtleCompletedCommands.filter(
		command => command.turtleID !== turtleID
	);
	turtleQueuedSteps = turtleQueuedSteps.filter(
		step => step.turtleID !== turtleID
	);
	if (activeTurtleAnimationStep?.turtleID === turtleID) {
		activeTurtleAnimationStep = null;
		turtleAnimationStepStartedAt = 0;
	}
	if (turtleFillState.active) {
		turtleFillState.active = false;
		turtleFillState.points = [];
	}
}

function clearActiveTurtleDrawing() {
	cancelActiveTurtleDrawingSteps();
	renderTurtleScene(visibleTurtlePose(), undefined, activeTurtleID);
	if (turtleQueuedSteps.length > 0) void scheduleTurtleAnimation();
}

function resetActiveTurtle() {
	cancelActiveTurtleDrawingSteps();
	const background = turtleState.background;
	turtleState = createDefaultTurtleState(background);
	turtleStates.set(activeTurtleID, turtleState);
	setTurtleVisiblePose(currentTurtlePose());
	renderTurtleScene(currentTurtlePose(), undefined, activeTurtleID);
	if (turtleQueuedSteps.length > 0) void scheduleTurtleAnimation();
}

function clearTurtleTimers() {
	turtleTimerGeneration += 1;
	for (const handle of turtleTimerHandles) {
		window.clearTimeout(handle);
	}
	turtleTimerHandles.clear();
	activeTurtleTimerCount.value = 0;
	activeTurtleTimerCallbackCount.value = 0;
}

async function runTurtleTimerCallback(
	callback: () => void,
	timerGeneration: number
) {
	await waitForTurtleAnimation();
	if (timerGeneration !== turtleTimerGeneration) return;

	try {
		callback();
	} catch (error) {
		appendOutput(
			"stderr",
			error instanceof Error
				? error.message
				: "Turtle timer handler failed."
		);
	}
}

function releaseIdlePythonRuntimeCallbacks() {
	if (isRunning.value) return;
	releaseLoadedPythonRuntimeCallbacks({ reportErrors: true });
}

function trackTurtleFillPoint(x: number, y: number) {
	if (!turtleFillState.active) return;
	const previous = turtleFillState.points.at(-1);
	if (previous && previous.x === x && previous.y === y) return;
	turtleFillState.points.push({ x, y });
}

function beginTurtleFill() {
	turtleFillState.active = true;
	turtleFillState.color = turtleState.fillColor;
	turtleFillState.points = [{ x: turtleState.x, y: turtleState.y }];
}

function endTurtleFill() {
	const points = turtleFillState.points;
	turtleFillState.active = false;
	turtleFillState.points = [];
	if (points.length < 3) return;

	const pose = currentTurtlePose();
	queueTurtleStep({
		command: {
			color: turtleState.penColor,
			fillColor: turtleFillState.color,
			kind: "fill",
			points: [...points],
			width: turtleState.lineWidth
		},
		durationMs: 120,
		fromPose: pose,
		toPose: pose
	});
}

function drawForward(distance: number) {
	const fromPose = currentTurtlePose();
	const radians = (turtleState.heading * Math.PI) / 180;
	turtleState.x += Math.cos(radians) * distance;
	turtleState.y += Math.sin(radians) * distance;
	const toPose = currentTurtlePose();
	trackTurtleFillPoint(turtleState.x, turtleState.y);

	queueTurtleStep({
		command: turtleState.penDown
			? {
					color: turtleState.penColor,
					from: { x: fromPose.x, y: fromPose.y },
					kind: "line",
					to: { x: toPose.x, y: toPose.y },
					width: turtleState.lineWidth
				}
			: undefined,
		durationMs: turtleMovementDuration(fromPose, toPose),
		fromPose,
		toPose
	});
}

function drawCircle(radius: number) {
	const pose = currentTurtlePose();
	queueTurtleStep({
		command: {
			color: turtleState.penColor,
			kind: "circle",
			radius,
			width: turtleState.lineWidth,
			x: turtleState.x,
			y: turtleState.y
		},
		durationMs: 120,
		fromPose: pose,
		toPose: pose
	});
}

function drawDot(size: number, color?: string) {
	const pose = currentTurtlePose();
	queueTurtleStep({
		command: {
			color: color || turtleState.penColor,
			kind: "dot",
			size,
			x: turtleState.x,
			y: turtleState.y
		},
		durationMs: 90,
		fromPose: pose,
		toPose: pose
	});
}

function stampTurtle() {
	const pose = currentTurtlePose();
	queueTurtleStep({
		command: {
			color: turtleState.penColor,
			heading: turtleState.heading,
			kind: "stamp",
			shape: turtleState.shape,
			x: turtleState.x,
			y: turtleState.y
		},
		durationMs: 90,
		fromPose: pose,
		toPose: pose
	});

	return ++turtleStampCounter;
}

function drawText(text: string) {
	const pose = currentTurtlePose();
	queueTurtleStep({
		command: {
			color: turtleState.penColor,
			kind: "text",
			text,
			x: turtleState.x,
			y: turtleState.y
		},
		durationMs: 90,
		fromPose: pose,
		toPose: pose
	});
}

function setGameCanvasTransform() {
	const canvas = canvasRef.value;
	const context = getCanvasContext();
	if (!canvas || !context) return null;

	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	syncCanvasBitmapSize(canvas, rect, dpr);
	context.setTransform(
		dpr * (rect.width / gameState.width),
		0,
		0,
		dpr * (rect.height / gameState.height),
		0,
		0
	);

	return context;
}

function gameCanvasFillStyle(
	context: CanvasRenderingContext2D,
	color: string,
	gcolor: string | null = gameState.backgroundGradient
) {
	if (!gcolor) return color;

	const gradient = context.createLinearGradient(0, 0, 0, gameState.height);
	gradient.addColorStop(0, color);
	gradient.addColorStop(1, gcolor);
	return gradient;
}

function clearGameCanvas(
	color = gameState.background,
	gcolor: string | null = gameState.backgroundGradient
) {
	const context = setGameCanvasTransform();
	if (!context) return;

	context.fillStyle = gameCanvasFillStyle(context, color, gcolor);
	context.fillRect(0, 0, gameState.width, gameState.height);
}

function resetGameCanvas(width = 640, height = 400) {
	stopGameLoop();
	keyHandlers.clear();
	refreshActiveTurtleEventHandlerCount();
	gameKeysDown.clear();
	gameEvents.length = 0;
	gameLoopRequested = false;
	gameLoopContinuous = false;
	gameTickInFlight = false;
	gameTickQueued = false;
	gameTickCallback = null;
	gameContinuousFrameRunner = null;
	stopAllGameAudio();
	gameState.width = Math.max(1, width);
	gameState.height = Math.max(1, height);
	gameState.background = "#111827";
	gameState.backgroundGradient = null;
	clearGameCanvas();
}

function stopGameLoop() {
	activeGameLoopID += 1;
	if (gameAnimationFrame !== null) {
		cancelAnimationFrame(gameAnimationFrame);
		gameAnimationFrame = null;
	}
	if (gameOnDemandTickFrame !== null) {
		cancelAnimationFrame(gameOnDemandTickFrame);
		gameOnDemandTickFrame = null;
	}
	gameLoopRequested = false;
	gameLoopContinuous = false;
	gameTickInFlight = false;
	gameTickQueued = false;
	gameTickCallback = null;
	gameContinuousFrameRunner = null;
	isGameLoopActive.value = false;
}

function stopAllGameAudio() {
	for (const soundName of [...gameSoundAudio.keys()])
		stopGameSound(soundName);
	gameSoundAudio.clear();
	stopGameMusic();
	stopAllGameTones();
	suspendGameAudioContext();
}

async function ensureGameCourseAssetsLoaded(
	options: { announce?: boolean } = {}
) {
	if (gameCourseAssetPack || gameCourseAssetPackLoadFailed) return;
	const announce = options.announce ?? true;
	if (!announce && gameCourseAssetPackSilentLoadFailed) return;

	if (announce) appendOutput("system", "Loading shared PyGame Zero assets.");

	try {
		gameCourseAssetPack = await loadPythonIdeCourseAssetPack();
		gameCourseAssetPackSilentLoadFailed = false;
		if (announce) {
			appendOutput(
				"system",
				`Loaded ${gameCourseAssetPack.assets.size} shared PyGame Zero assets.`
			);
		}
	} catch (error) {
		if (!announce) {
			gameCourseAssetPackSilentLoadFailed = true;
			return;
		}

		gameCourseAssetPackLoadFailed = true;
		appendOutput(
			"stderr",
			error instanceof Error
				? `Could not load shared PyGame Zero assets: ${error.message}`
				: "Could not load shared PyGame Zero assets."
		);
	}
}

async function loadPythonCodeMirrorAssetCompletions() {
	if (selectedProject.value?.mode === "pgzero")
		await ensureGameCourseAssetsLoaded({ announce: false });
	return pythonCodeMirrorAssetCompletions();
}

function pythonAssetCompletionName(path: string, folder: PythonIdeAssetFolder) {
	const normalizedPath = normalizePythonIdeAssetLookupPath(path);
	if (!normalizedPath.startsWith(`${folder}/`)) return "";

	const fileName = normalizedPath
		.slice(folder.length + 1)
		.split("/")
		.at(-1);
	if (!fileName) return "";

	const extension = assetCompletionExtensionMap[folder].find(candidate =>
		fileName.endsWith(candidate)
	);
	return extension ? fileName.slice(0, -extension.length) : "";
}

function pythonCodeMirrorAssetCompletions(): PythonCodeMirrorAssetCompletionNames {
	const completions: PythonCodeMirrorAssetCompletionNames = {};
	for (const folder of ["images", "music", "sounds"] as const) {
		const names = new Set<string>();
		for (const file of selectedProject.value?.files ?? []) {
			const name = pythonAssetCompletionName(file.name, folder);
			if (name) names.add(name);
		}
		for (const assetName of gameCourseAssetPack?.assets.keys() ?? []) {
			const name = pythonAssetCompletionName(assetName, folder);
			if (name) names.add(name);
		}
		if (names.size) completions[folder] = [...names].sort();
	}

	return completions;
}

function localAssetCandidateNames(
	folder: PythonIdeAssetFolder,
	name: string,
	extensions: string[]
) {
	return new Set(pythonIdeAssetCandidateNames(folder, name, extensions));
}

function findProjectAssetFile(
	folder: PythonIdeAssetFolder,
	name: string,
	extensions: string[]
) {
	const project = selectedProject.value;
	if (!project) return null;
	const candidateNames = localAssetCandidateNames(folder, name, extensions);
	return (
		project.files.find(file =>
			candidateNames.has(normalizePythonIdeAssetLookupPath(file.name))
		) ?? null
	);
}

function findCourseAsset(
	folder: PythonIdeAssetFolder,
	name: string,
	extensions: string[]
) {
	return findPythonIdeCourseAsset(
		gameCourseAssetPack,
		pythonIdeAssetCandidateNames(folder, name, extensions)
	);
}

function resolveGameAsset(
	folder: PythonIdeAssetFolder,
	name: string,
	extensions: string[]
): ResolvedGameAsset | null {
	const projectFile = findProjectAssetFile(folder, name, extensions);
	if (projectFile) {
		const src = getPythonIdeAssetDataUrl(projectFile);
		if (src) return { key: `project:${projectFile.name}`, src };
	}

	const courseAsset = findCourseAsset(folder, name, extensions);
	if (!courseAsset) return null;
	return {
		height: courseAsset.height,
		key: `course:${courseAsset.name}`,
		src: getPythonIdeCourseAssetObjectUrl(courseAsset),
		width: courseAsset.width
	};
}

function getGameImageEntry(asset: ResolvedGameAsset) {
	const src = asset.src;
	if (!src) return null;

	const cached = gameImageCache.get(asset.key);
	if (cached?.src === src) return cached;

	const entry: CachedGameImage = {
		element: new Image(),
		failed: false,
		loaded: false,
		src
	};
	entry.element.addEventListener("load", () => {
		entry.loaded = true;
		requestGameTick();
	});
	entry.element.addEventListener("error", () => {
		entry.failed = true;
		requestGameTick();
	});
	entry.element.src = src;
	gameImageCache.set(asset.key, entry);
	return entry;
}

function courseAssetSize(asset: ResolvedGameAsset | null) {
	if (!asset) return { height: 64, width: 64 };
	if (asset.width && asset.height)
		return { height: asset.height, width: asset.width };

	const cached = gameImageCache.get(asset.key);
	if (cached?.loaded && cached.element.naturalWidth > 0) {
		return {
			height: cached.element.naturalHeight,
			width: cached.element.naturalWidth
		};
	}

	return { height: 64, width: 64 };
}

function gameImageSizeJson(name: string) {
	return JSON.stringify(
		courseAssetSize(resolveGameAsset("images", name, imageAssetExtensions))
	);
}

function playProjectAudio(
	folder: "music" | "sounds",
	name: string,
	loop = false,
	onPlaybackBlocked?: (audio: HTMLAudioElement) => void
) {
	const asset = resolveGameAsset(folder, name, audioAssetExtensions);
	if (!asset) {
		appendOutput("system", `Missing ${folder} asset: ${name}`);
		return null;
	}

	const src = asset.src;
	if (!src) {
		appendOutput(
			"system",
			`Cannot play ${name}; import an audio file or use the shared asset pack.`
		);
		return null;
	}

	const audio = new Audio(src);
	audio.loop = loop;
	void audio.play().catch(() => {
		onPlaybackBlocked?.(audio);
		reportGameAudioPlaybackBlocked();
	});
	return audio;
}

function reportGameAudioPlaybackBlocked() {
	if (gameAudioPlaybackBlockedNoticeShown) return;
	gameAudioPlaybackBlockedNoticeShown = true;
	appendOutput(
		"system",
		"Audio is waiting for a browser gesture. Click the canvas or press a game key, then trigger the sound again."
	);
}

function trackGameSoundAudio(
	name: string,
	audio: HTMLAudioElement,
	options: { cleanupOnEnded?: boolean } = {}
) {
	const existing = gameSoundAudio.get(name) ?? new Set<HTMLAudioElement>();
	existing.add(audio);
	gameSoundAudio.set(name, existing);
	const cleanupOnEnded = options.cleanupOnEnded ?? true;

	const cleanup = () => {
		const activeSounds = gameSoundAudio.get(name);
		if (!activeSounds) return;
		activeSounds.delete(audio);
		if (!activeSounds.size) gameSoundAudio.delete(name);
	};

	if (cleanupOnEnded)
		audio.addEventListener("ended", cleanup, { once: true });
	audio.addEventListener("error", cleanup, { once: true });
	return cleanup;
}

function playGameSound(name: string, loops = 0) {
	const repeatCount = Math.max(
		-1,
		Math.trunc(Number.isFinite(loops) ? loops : 0)
	);
	let cleanup: (() => void) | null = null;
	const cleanupBlockedSound = () => {
		cleanup?.();
	};
	const audio = playProjectAudio(
		"sounds",
		name,
		repeatCount < 0,
		cleanupBlockedSound
	);
	if (!audio) return;

	if (repeatCount <= 0) {
		cleanup = trackGameSoundAudio(name, audio);
		return;
	}

	cleanup = trackGameSoundAudio(name, audio, { cleanupOnEnded: false });
	let remainingLoops = repeatCount;
	audio.addEventListener("ended", () => {
		if (remainingLoops <= 0) {
			cleanup?.();
			return;
		}

		remainingLoops -= 1;
		audio.currentTime = 0;
		void audio.play().catch(() => {
			cleanup?.();
			reportGameAudioPlaybackBlocked();
		});
	});
}

function stopGameSound(name: string) {
	const activeSounds = gameSoundAudio.get(name);
	if (!activeSounds) return;
	for (const audio of activeSounds) {
		audio.pause();
		audio.currentTime = 0;
	}
	gameSoundAudio.delete(name);
}

function queueGameMusicEndedEvent(audio: HTMLAudioElement) {
	if (gameMusicAudio !== audio) return;
	gameMusicAudio = null;
	gameEvents.push({ type: "musicended" });
	requestGameTick();
}

function playGameMusic(name: string, loop = true) {
	stopGameMusic();
	const audio = playProjectAudio("music", name, loop, blockedAudio => {
		if (gameMusicAudio === blockedAudio) gameMusicAudio = null;
	});
	gameMusicAudio = audio;
	if (!audio) return;
	audio.volume = gameMusicVolume;
	if (!loop) {
		audio.addEventListener("ended", () => queueGameMusicEndedEvent(audio), {
			once: true
		});
	}
}

function pauseGameMusic() {
	gameMusicAudio?.pause();
}

function unpauseGameMusic() {
	if (!gameMusicAudio) return;
	void gameMusicAudio.play().catch(() => reportGameAudioPlaybackBlocked());
}

function setGameMusicVolume(volume: number) {
	gameMusicVolume = Math.min(1, Math.max(0, volume));
	if (gameMusicAudio) gameMusicAudio.volume = gameMusicVolume;
}

function stopGameMusic() {
	if (!gameMusicAudio) return;
	gameMusicAudio.pause();
	gameMusicAudio.currentTime = 0;
	gameMusicAudio = null;
}

function gameAudioContext() {
	if (gameToneAudioContext) return gameToneAudioContext;
	const AudioContextConstructor =
		window.AudioContext ??
		(window as typeof window & { webkitAudioContext?: typeof AudioContext })
			.webkitAudioContext;
	if (!AudioContextConstructor) return null;
	gameToneAudioContext = new AudioContextConstructor();
	return gameToneAudioContext;
}

function suspendGameAudioContext() {
	if (!gameToneAudioContext || gameToneAudioContext.state !== "running")
		return;

	void gameToneAudioContext.suspend().catch((error: unknown) => {
		console.warn("Could not suspend PyGame Zero audio context.", error);
	});
}

function stopGameTone(toneID: number) {
	const handle = gameToneAudio.get(toneID);
	if (!handle) return;
	window.clearTimeout(handle.timeout);
	try {
		handle.gain.gain.cancelScheduledValues(handle.gain.context.currentTime);
		handle.gain.gain.setValueAtTime(0, handle.gain.context.currentTime);
		handle.oscillator.stop();
	} catch {
		// Already stopped.
	}
	gameToneAudio.delete(toneID);
}

function stopAllGameTones() {
	for (const toneID of [...gameToneAudio.keys()]) stopGameTone(toneID);
}

function playGameTone(frequency: number, duration: number) {
	const context = gameAudioContext();
	if (!context) {
		appendOutput(
			"system",
			"Tone playback is not available in this browser."
		);
		return 0;
	}

	const safeFrequency = Math.min(
		12000,
		Math.max(20, Number(frequency) || 440)
	);
	const safeDuration = Math.min(10, Math.max(0.02, Number(duration) || 0.2));
	const toneID = ++gameToneCounter;
	const oscillator = context.createOscillator();
	const gain = context.createGain();
	const startedAt = context.currentTime;
	const stoppedAt = startedAt + safeDuration;
	let timeout: ReturnType<typeof window.setTimeout> | null = null;

	oscillator.type = "sine";
	oscillator.frequency.setValueAtTime(safeFrequency, startedAt);
	gain.gain.setValueAtTime(0.0001, startedAt);
	gain.gain.exponentialRampToValueAtTime(0.22, startedAt + 0.01);
	gain.gain.setValueAtTime(
		0.22,
		Math.max(startedAt + 0.01, stoppedAt - 0.025)
	);
	gain.gain.exponentialRampToValueAtTime(0.0001, stoppedAt);
	oscillator.connect(gain);
	gain.connect(context.destination);

	const cleanup = () => {
		if (timeout !== null) {
			window.clearTimeout(timeout);
			timeout = null;
		}
		gameToneAudio.delete(toneID);
		try {
			oscillator.disconnect();
			gain.disconnect();
		} catch {
			// Already disconnected.
		}
	};
	oscillator.addEventListener("ended", cleanup, { once: true });

	timeout = window.setTimeout(
		stopGameTone,
		Math.ceil((safeDuration + 0.05) * 1000),
		toneID
	);
	gameToneAudio.set(toneID, { gain, oscillator, timeout });
	void context.resume().catch(() => reportGameAudioPlaybackBlocked());
	oscillator.start(startedAt);
	oscillator.stop(stoppedAt);
	return toneID;
}

interface StartGameLoopOptions {
	continuous?: boolean;
}

function requestContinuousGameLoop() {
	gameLoopRequested = true;
	if (!gameTickCallback || gameLoopContinuous) return;

	gameLoopContinuous = true;
	gameTickQueued = false;
	if (gameContinuousFrameRunner && gameAnimationFrame === null) {
		gameAnimationFrame = requestAnimationFrame(gameContinuousFrameRunner);
	}
}

function requestGameTick() {
	if (!gameTickCallback || gameLoopContinuous) return;

	if (gameTickInFlight || gameOnDemandTickFrame !== null) {
		gameTickQueued = true;
		return;
	}

	const loopID = activeGameLoopID;
	gameOnDemandTickFrame = requestAnimationFrame(() => {
		gameOnDemandTickFrame = null;
		void runGameTick(loopID);
	});
}

async function runGameTick(loopID: number) {
	const tick = gameTickCallback;
	if (loopID !== activeGameLoopID || !tick || gameTickInFlight) return;

	gameTickInFlight = true;
	try {
		await tick();
	} catch (error) {
		if (loopID !== activeGameLoopID) return;
		appendOutput(
			"stderr",
			error instanceof Error ? error.message : "Game loop failed."
		);
		stopGameLoop();
	} finally {
		if (loopID === activeGameLoopID) {
			gameTickInFlight = false;
			if (!gameLoopContinuous && gameTickQueued) {
				gameTickQueued = false;
				requestGameTick();
			}
		}
	}
}

function startGameLoop(
	tick: () => Promise<void>,
	options: StartGameLoopOptions = {}
) {
	stopGameLoop();
	const loopID = ++activeGameLoopID;
	gameTickCallback = tick;
	gameLoopContinuous = options.continuous ?? true;
	isGameLoopActive.value = true;

	const runFrame = () => {
		if (loopID !== activeGameLoopID || !gameLoopContinuous) {
			gameAnimationFrame = null;
			return;
		}

		gameAnimationFrame = requestAnimationFrame(runFrame);
		void runGameTick(loopID);
	};
	gameContinuousFrameRunner = runFrame;

	if (gameLoopContinuous) {
		void runGameTick(loopID);
		gameAnimationFrame = requestAnimationFrame(runFrame);
		return;
	}

	requestGameTick();
}

function drawGameActor(
	image: string,
	x: number,
	y: number,
	width: number,
	height: number,
	angle: number,
	anchorX = width / 2,
	anchorY = height / 2
) {
	const context = setGameCanvasTransform();
	if (!context) return;
	const asset = resolveGameAsset("images", image, imageAssetExtensions);
	const assetImage = asset ? getGameImageEntry(asset) : null;

	context.save();
	context.translate(x, y);
	context.rotate((-angle * Math.PI) / 180);
	const left = -anchorX;
	const top = -anchorY;
	if (
		assetImage?.loaded &&
		!assetImage.failed &&
		assetImage.element.naturalWidth > 0
	) {
		context.drawImage(assetImage.element, left, top, width, height);
		context.restore();
		return;
	}

	context.fillStyle = "#5eead4";
	context.strokeStyle = "#134e4a";
	context.lineWidth = 3;
	context.beginPath();
	context.roundRect(left, top, width, height, 12);
	context.fill();
	context.stroke();
	context.fillStyle = "#0f172a";
	context.font = "bold 14px Avenir Next, Segoe UI, sans-serif";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(image, 0, 0, Math.max(16, width - 10));
	context.restore();
}

function drawGameImage(
	image: string,
	x: number,
	y: number,
	width: number,
	height: number,
	angle: number
) {
	const context = setGameCanvasTransform();
	if (!context) return;
	const asset = resolveGameAsset("images", image, imageAssetExtensions);
	const assetImage = asset ? getGameImageEntry(asset) : null;

	context.save();
	context.translate(x + width / 2, y + height / 2);
	context.rotate((-angle * Math.PI) / 180);
	if (
		assetImage?.loaded &&
		!assetImage.failed &&
		assetImage.element.naturalWidth > 0
	) {
		context.drawImage(
			assetImage.element,
			-width / 2,
			-height / 2,
			width,
			height
		);
		context.restore();
		return;
	}

	context.fillStyle = "#5eead4";
	context.strokeStyle = "#134e4a";
	context.lineWidth = 3;
	context.beginPath();
	context.roundRect(-width / 2, -height / 2, width, height, 12);
	context.fill();
	context.stroke();
	context.fillStyle = "#0f172a";
	context.font = "bold 14px Avenir Next, Segoe UI, sans-serif";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(image, 0, 0, Math.max(16, width - 10));
	context.restore();
}

function drawGameText(
	text: string,
	x: number,
	y: number,
	color: string,
	fontSize: number
) {
	const context = setGameCanvasTransform();
	if (!context) return;

	context.fillStyle = color;
	context.font = `${Math.max(8, fontSize)}px Avenir Next, Segoe UI, sans-serif`;
	context.textBaseline = "top";
	context.fillText(text, x, y);
}

function drawGameRect(
	x: number,
	y: number,
	width: number,
	height: number,
	color: string,
	filled: boolean,
	lineWidth = 1
) {
	const context = setGameCanvasTransform();
	if (!context) return;

	if (filled) {
		context.fillStyle = color;
		context.fillRect(x, y, width, height);
		return;
	}

	context.strokeStyle = color;
	context.lineWidth = Math.max(1, lineWidth);
	context.strokeRect(x, y, width, height);
}

function drawGameLine(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	color: string,
	lineWidth = 1
) {
	const context = setGameCanvasTransform();
	if (!context) return;

	context.strokeStyle = color;
	context.lineWidth = Math.max(1, lineWidth);
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.stroke();
}

function drawGameCircle(
	x: number,
	y: number,
	radius: number,
	color: string,
	filled: boolean,
	lineWidth = 1
) {
	const context = setGameCanvasTransform();
	if (!context) return;

	context.beginPath();
	context.arc(x, y, Math.max(0, radius), 0, Math.PI * 2);
	if (filled) {
		context.fillStyle = color;
		context.fill();
		return;
	}

	context.strokeStyle = color;
	context.lineWidth = Math.max(1, lineWidth);
	context.stroke();
}

function normalizeKey(key: string | null | undefined) {
	if (!key) return "";
	const normalized = key
		.toLowerCase()
		.replace(keyboardKeyWhitespaceRegex, "");
	return keyboardKeyAliasMap[normalized] ?? normalized;
}

function pythonGameKeyFromEvent(event: KeyboardEvent) {
	const codeMatch =
		event.code.match(browserKeyboardLetterCodeRegex) ??
		event.code.match(browserKeyboardDigitCodeRegex);
	if (codeMatch?.[1]) return codeMatch[1].toLowerCase();

	const numpadDigitMatch = event.code.match(
		browserKeyboardNumpadDigitCodeRegex
	);
	if (numpadDigitMatch?.[1]) return `kp${numpadDigitMatch[1]}`;

	const functionKeyMatch = event.code.match(browserKeyboardFunctionCodeRegex);
	if (functionKeyMatch?.[1]) return `f${functionKeyMatch[1]}`;

	return browserKeyboardCodeMap[event.code] ?? normalizeKey(event.key);
}

function gameKeyModifierMask(event: KeyboardEvent) {
	let mod = 0;
	if (event.shiftKey)
		mod |= event.location === 1 ? 1 : event.location === 2 ? 2 : 3;
	if (event.ctrlKey)
		mod |= event.location === 1 ? 4 : event.location === 2 ? 8 : 12;
	if (event.altKey)
		mod |= event.location === 1 ? 16 : event.location === 2 ? 32 : 48;
	if (event.metaKey)
		mod |= event.location === 1 ? 64 : event.location === 2 ? 128 : 192;
	if (event.getModifierState?.("NumLock")) mod |= 256;
	if (event.getModifierState?.("CapsLock")) mod |= 512;
	return mod;
}

function gameKeyUnicode(event: KeyboardEvent) {
	return event.key.length === 1 ? event.key : "";
}

const turtleBridge: TurtleBridge = {
	activate(id: string) {
		activateTurtleState(id);
	},
	reset: resetTurtleCanvas,
	clear: resetTurtleCanvas,
	resetTurtle: resetActiveTurtle,
	clearTurtle: clearActiveTurtleDrawing,
	bgcolor(color: string) {
		for (const state of turtleStates.values()) state.background = color;
		renderTurtleScene();
	},
	beginFill: beginTurtleFill,
	endFill: endTurtleFill,
	forward: drawForward,
	right(degrees: number) {
		const fromPose = currentTurtlePose();
		turtleState.heading -= degrees;
		const toPose = currentTurtlePose();
		if (turtlePoseChanged(fromPose, toPose)) {
			queueTurtleStep({
				durationMs: turtleMovementDuration(fromPose, toPose),
				fromPose,
				toPose
			});
		}
	},
	left(degrees: number) {
		const fromPose = currentTurtlePose();
		turtleState.heading += degrees;
		const toPose = currentTurtlePose();
		if (turtlePoseChanged(fromPose, toPose)) {
			queueTurtleStep({
				durationMs: turtleMovementDuration(fromPose, toPose),
				fromPose,
				toPose
			});
		}
	},
	setheading(degrees: number) {
		const fromPose = currentTurtlePose();
		turtleState.heading = degrees;
		const toPose = currentTurtlePose();
		if (turtlePoseChanged(fromPose, toPose)) {
			queueTurtleStep({
				durationMs: turtleMovementDuration(fromPose, toPose),
				fromPose,
				toPose
			});
		}
	},
	heading: () => turtleState.heading,
	setState(
		x: number,
		y: number,
		heading: number,
		penDown: boolean,
		penColor: string,
		fillColor: string,
		lineWidth: number
	) {
		setTurtleState(x, y, heading, penDown, penColor, fillColor, lineWidth);
	},
	xcor: () => turtleState.x,
	ycor: () => turtleState.y,
	goto(x: number, y: number) {
		const fromPose = currentTurtlePose();
		turtleState.x = x;
		turtleState.y = y;
		const toPose = currentTurtlePose();
		trackTurtleFillPoint(x, y);
		queueTurtleStep({
			command: turtleState.penDown
				? {
						color: turtleState.penColor,
						from: { x: fromPose.x, y: fromPose.y },
						kind: "line",
						to: { x: toPose.x, y: toPose.y },
						width: turtleState.lineWidth
					}
				: undefined,
			durationMs: turtleMovementDuration(fromPose, toPose),
			fromPose,
			toPose
		});
	},
	home() {
		this.goto(0, 0);
		turtleState.heading = 0;
	},
	penup() {
		turtleState.penDown = false;
	},
	pendown() {
		turtleState.penDown = true;
	},
	isdown: () => turtleState.penDown,
	pensize(width: number) {
		turtleState.lineWidth = Math.max(1, width);
	},
	pencolor(color: string) {
		turtleState.penColor = color;
	},
	fillcolor(color: string) {
		turtleState.fillColor = color;
	},
	color(primary: string, secondary?: string) {
		turtleState.penColor = primary;
		turtleState.fillColor = secondary ?? primary;
	},
	circle: drawCircle,
	dot: drawDot,
	stamp: stampTurtle,
	write: drawText,
	registerKey(key: string, callback: (() => void) | null) {
		if (!callback) {
			keyHandlers.delete(normalizeKey(key));
			refreshActiveTurtleEventHandlerCount();
			return;
		}
		keyHandlers.set(normalizeKey(key), callback);
		refreshActiveTurtleEventHandlerCount();
	},
	registerClick(
		button: string,
		callback: ((x: number, y: number) => void) | null
	) {
		if (!callback) {
			turtleClickHandlers.delete(button);
			refreshActiveTurtleEventHandlerCount();
			return;
		}
		turtleClickHandlers.set(button, callback);
		refreshActiveTurtleEventHandlerCount();
	},
	registerDrag(
		button: string,
		callback: ((x: number, y: number) => void) | null
	) {
		if (!callback) {
			turtleDragHandlers.delete(button);
			if (activeTurtleDragButton === button)
				activeTurtleDragButton = null;
			refreshActiveTurtleEventHandlerCount();
			return;
		}
		turtleDragHandlers.set(button, callback);
		refreshActiveTurtleEventHandlerCount();
	},
	scheduleTimer(delayMs: number, callback: (() => void) | null) {
		if (!callback) return;

		const timerGeneration = turtleTimerGeneration;
		const handle = window.setTimeout(
			() => {
				activeTurtleTimerCallbackCount.value += 1;
				turtleTimerHandles.delete(handle);
				activeTurtleTimerCount.value = turtleTimerHandles.size;
				void runTurtleTimerCallback(callback, timerGeneration).finally(
					() => {
						activeTurtleTimerCallbackCount.value = Math.max(
							0,
							activeTurtleTimerCallbackCount.value - 1
						);
					}
				);
			},
			Math.max(0, delayMs)
		);

		turtleTimerHandles.add(handle);
		activeTurtleTimerCount.value = turtleTimerHandles.size;
	},
	listen() {
		canvasRef.value?.focus();
	},
	setShape(shape: string) {
		const fromPose = currentTurtlePose();
		turtleState.shape = normalizeTurtleShape(shape);
		const toPose = currentTurtlePose();
		if (turtlePoseChanged(fromPose, toPose)) {
			queueTurtleStep({
				durationMs: turtleInstantStepMaxDurationMs,
				fromPose,
				toPose
			});
		}
	},
	setSpeed(speed: number) {
		turtleState.speed = Number.isFinite(speed)
			? Math.max(0, Math.min(10, speed))
			: 3;
	},
	setTracer(value: number) {
		turtleTracerEnabled = value !== 0;
	},
	setVisible(visible: boolean) {
		const fromPose = currentTurtlePose();
		turtleState.visible = visible;
		const toPose = currentTurtlePose();
		if (turtlePoseChanged(fromPose, toPose)) {
			queueTurtleStep({
				durationMs: turtleInstantStepMaxDurationMs,
				fromPose,
				toPose
			});
		}
	},
	update() {
		renderTurtleScene();
	}
};

function invalidateTurtleBridgeRuns() {
	activeTurtleBridgeRunID += 1;
}

function createGuardedTurtleBridgeRun(): TurtleBridge {
	const runID = ++activeTurtleBridgeRunID;
	const isActiveRun = () => runID === activeTurtleBridgeRunID;

	return {
		activate(id: string) {
			if (isActiveRun()) turtleBridge.activate(id);
		},
		reset() {
			if (isActiveRun()) turtleBridge.reset();
		},
		clear() {
			if (isActiveRun()) turtleBridge.clear();
		},
		resetTurtle() {
			if (isActiveRun()) turtleBridge.resetTurtle();
		},
		clearTurtle() {
			if (isActiveRun()) turtleBridge.clearTurtle();
		},
		bgcolor(color: string) {
			if (isActiveRun()) turtleBridge.bgcolor(color);
		},
		beginFill() {
			if (isActiveRun()) turtleBridge.beginFill();
		},
		endFill() {
			if (isActiveRun()) turtleBridge.endFill();
		},
		forward(distance: number) {
			if (isActiveRun()) turtleBridge.forward(distance);
		},
		right(degrees: number) {
			if (isActiveRun()) turtleBridge.right(degrees);
		},
		left(degrees: number) {
			if (isActiveRun()) turtleBridge.left(degrees);
		},
		setheading(degrees: number) {
			if (isActiveRun()) turtleBridge.setheading(degrees);
		},
		heading() {
			return isActiveRun() ? turtleBridge.heading() : 0;
		},
		setState(...args) {
			if (isActiveRun()) turtleBridge.setState(...args);
		},
		xcor() {
			return isActiveRun() ? turtleBridge.xcor() : 0;
		},
		ycor() {
			return isActiveRun() ? turtleBridge.ycor() : 0;
		},
		goto(x: number, y: number) {
			if (isActiveRun()) turtleBridge.goto(x, y);
		},
		home() {
			if (isActiveRun()) turtleBridge.home();
		},
		penup() {
			if (isActiveRun()) turtleBridge.penup();
		},
		pendown() {
			if (isActiveRun()) turtleBridge.pendown();
		},
		isdown() {
			return isActiveRun() && turtleBridge.isdown();
		},
		pensize(width: number) {
			if (isActiveRun()) turtleBridge.pensize(width);
		},
		pencolor(color: string) {
			if (isActiveRun()) turtleBridge.pencolor(color);
		},
		fillcolor(color: string) {
			if (isActiveRun()) turtleBridge.fillcolor(color);
		},
		color(primary: string, secondary?: string) {
			if (isActiveRun()) turtleBridge.color(primary, secondary);
		},
		circle(radius: number) {
			if (isActiveRun()) turtleBridge.circle(radius);
		},
		dot(size: number, color?: string) {
			if (isActiveRun()) turtleBridge.dot(size, color);
		},
		stamp() {
			return isActiveRun() ? turtleBridge.stamp() : 0;
		},
		write(text: string) {
			if (isActiveRun()) turtleBridge.write(text);
		},
		registerKey(key: string, callback: (() => void) | null) {
			if (isActiveRun()) turtleBridge.registerKey(key, callback);
		},
		registerClick(
			button: string,
			callback: ((x: number, y: number) => void) | null
		) {
			if (isActiveRun()) turtleBridge.registerClick(button, callback);
		},
		registerDrag(
			button: string,
			callback: ((x: number, y: number) => void) | null
		) {
			if (isActiveRun()) turtleBridge.registerDrag(button, callback);
		},
		scheduleTimer(delayMs: number, callback: (() => void) | null) {
			if (!isActiveRun() || !callback) return;

			turtleBridge.scheduleTimer(delayMs, () => {
				if (isActiveRun()) callback();
			});
		},
		listen() {
			if (isActiveRun()) turtleBridge.listen();
		},
		setShape(shape: string) {
			if (isActiveRun()) turtleBridge.setShape(shape);
		},
		setSpeed(speed: number) {
			if (isActiveRun()) turtleBridge.setSpeed(speed);
		},
		setTracer(value: number) {
			if (isActiveRun()) turtleBridge.setTracer(value);
		},
		setVisible(visible: boolean) {
			if (isActiveRun()) turtleBridge.setVisible(visible);
		},
		update() {
			if (isActiveRun()) turtleBridge.update();
		}
	};
}

const gameBridge: GameBridge = {
	reset: resetGameCanvas,
	clear: () => clearGameCanvas(),
	fill(color: string, gcolor?: string) {
		gameState.background = color;
		gameState.backgroundGradient = gcolor ?? null;
		clearGameCanvas(color, gameState.backgroundGradient);
	},
	drawActor: drawGameActor,
	drawImage: drawGameImage,
	drawText: drawGameText,
	drawRect: drawGameRect,
	drawLine: drawGameLine,
	drawCircle: drawGameCircle,
	imageSizeJson: gameImageSizeJson,
	isKeyDown(key: string) {
		return gameKeysDown.has(normalizeKey(key));
	},
	popEventsJson() {
		const events = JSON.stringify(gameEvents.splice(0));
		return events === "[]" ? "" : events;
	},
	requestLoop() {
		requestContinuousGameLoop();
	},
	consumeLoopRequest() {
		const requested = gameLoopRequested;
		gameLoopRequested = false;
		return requested;
	},
	startLoop: startGameLoop,
	stopLoop: stopGameLoop,
	playSound: playGameSound,
	stopSound: stopGameSound,
	playMusic: playGameMusic,
	pauseMusic: pauseGameMusic,
	unpauseMusic: unpauseGameMusic,
	setMusicVolume: setGameMusicVolume,
	stopMusic: stopGameMusic,
	playTone: playGameTone,
	stopTone: stopGameTone,
	log(text: string) {
		appendOutput("system", text);
	}
};

function invalidateGameBridgeRuns() {
	activeGameBridgeRunID += 1;
}

function createGuardedGameBridgeRun(): GameBridge {
	const runID = ++activeGameBridgeRunID;
	const isActiveRun = () => runID === activeGameBridgeRunID;

	return {
		reset(width?: number, height?: number) {
			if (!isActiveRun()) return;
			gameBridge.reset(width, height);
		},
		clear() {
			if (isActiveRun()) gameBridge.clear();
		},
		fill(color: string, gcolor?: string) {
			if (isActiveRun()) gameBridge.fill(color, gcolor);
		},
		drawActor(...args) {
			if (isActiveRun()) gameBridge.drawActor(...args);
		},
		drawImage(...args) {
			if (isActiveRun()) gameBridge.drawImage(...args);
		},
		drawText(...args) {
			if (isActiveRun()) gameBridge.drawText(...args);
		},
		drawRect(...args) {
			if (isActiveRun()) gameBridge.drawRect(...args);
		},
		drawLine(...args) {
			if (isActiveRun()) gameBridge.drawLine(...args);
		},
		drawCircle(...args) {
			if (isActiveRun()) gameBridge.drawCircle(...args);
		},
		imageSizeJson(name: string) {
			return isActiveRun()
				? gameBridge.imageSizeJson(name)
				: JSON.stringify({ height: 64, width: 64 });
		},
		isKeyDown(key: string) {
			return isActiveRun() && gameBridge.isKeyDown(key);
		},
		popEventsJson() {
			return isActiveRun() ? gameBridge.popEventsJson() : "";
		},
		requestLoop() {
			if (isActiveRun()) gameBridge.requestLoop();
		},
		consumeLoopRequest() {
			return isActiveRun() && gameBridge.consumeLoopRequest();
		},
		startLoop(tick: () => Promise<void>, options?: StartGameLoopOptions) {
			if (!isActiveRun()) return;
			gameBridge.startLoop(async () => {
				if (!isActiveRun()) return;
				await tick();
			}, options);
		},
		stopLoop() {
			if (isActiveRun()) gameBridge.stopLoop();
		},
		playSound(name: string, loops?: number) {
			if (isActiveRun()) gameBridge.playSound(name, loops);
		},
		stopSound(name: string) {
			if (isActiveRun()) gameBridge.stopSound(name);
		},
		playMusic(name: string, loop?: boolean) {
			if (isActiveRun()) gameBridge.playMusic(name, loop);
		},
		pauseMusic() {
			if (isActiveRun()) gameBridge.pauseMusic();
		},
		unpauseMusic() {
			if (isActiveRun()) gameBridge.unpauseMusic();
		},
		setMusicVolume(volume: number) {
			if (isActiveRun()) gameBridge.setMusicVolume(volume);
		},
		stopMusic() {
			if (isActiveRun()) gameBridge.stopMusic();
		},
		playTone(frequency: number, duration: number) {
			return isActiveRun() ? gameBridge.playTone(frequency, duration) : 0;
		},
		stopTone(toneID: number) {
			if (isActiveRun()) gameBridge.stopTone(toneID);
		},
		log(text: string) {
			if (isActiveRun()) gameBridge.log(text);
		}
	};
}

function resetActiveCanvas() {
	if (selectedProject.value?.mode === "pgzero") {
		resetGameCanvas(gameState.width, gameState.height);
		return;
	}

	resetTurtleCanvas();
}

function redrawActiveCanvas() {
	if (selectedProject.value?.mode === "pgzero") {
		clearGameCanvas();
		return;
	}

	renderTurtleScene();
}

function nextPythonIdeRunID() {
	activePythonIdeRunID += 1;
	return activePythonIdeRunID;
}

function invalidatePythonIdeRuns() {
	activePythonIdeRunID += 1;
}

function isPythonIdeRunCurrent(runID: number, projectID: string) {
	return (
		runID === activePythonIdeRunID && selectedProjectID.value === projectID
	);
}

function shouldStopPythonIdeRun(runID: number, projectID: string) {
	return stopRequested.value || !isPythonIdeRunCurrent(runID, projectID);
}

async function runCurrentProject() {
	const runID = nextPythonIdeRunID();
	stopRequested.value = false;
	await saveSelectedProject({ force: true });
	const project = selectedProject.value;
	if (!project) return;
	if (shouldStopPythonIdeRun(runID, project._id)) return;

	clearOutput();
	const runnableFile = getPythonIdeRunnableFile(project);
	if (!runnableFile) {
		runMessage.value = "No Python file";
		appendOutput("stderr", "Add a .py file before running this project.");
		return;
	}

	isRunning.value = true;
	runMessage.value = "Starting Python";
	appendOutput("system", `Running ${runnableFile.name}`);
	clearPythonRuntimeDiagnosticInEditor();

	try {
		if (project.mode === "pgzero") {
			runMessage.value = "Loading assets";
			await ensureGameCourseAssetsLoaded();
			if (shouldStopPythonIdeRun(runID, project._id)) return;
		}

		const { runPythonProject } = await loadPythonRuntimeModule();
		if (shouldStopPythonIdeRun(runID, project._id)) return;
		await runPythonProject({
			files: project.files,
			activeFileName: runnableFile.name,
			inputText: inputText.value,
			mode: project.mode,
			gameBridge:
				project.mode === "pgzero"
					? createGuardedGameBridgeRun()
					: gameBridge,
			turtleBridge:
				project.mode === "turtle"
					? createGuardedTurtleBridgeRun()
					: turtleBridge,
			onArtifact: appendArtifact,
			onProjectFilesUpdate: files =>
				mergeRuntimeProjectFiles(project, files),
			onOutput: appendOutput,
			shouldStop: () => shouldStopPythonIdeRun(runID, project._id)
		});
		if (
			project.mode === "turtle" &&
			!shouldStopPythonIdeRun(runID, project._id)
		) {
			runMessage.value = "Drawing";
			await waitForTurtleAnimation();
		}
		if (!shouldStopPythonIdeRun(runID, project._id)) {
			runMessage.value =
				project.mode === "data"
					? "Analysis ready"
					: project.mode === "pgzero"
						? "Game running"
						: project.mode === "turtle"
							? "Drawing ready"
							: "Run complete";
		}
	} catch (error) {
		if (shouldStopPythonIdeRun(runID, project._id)) return;
		const formattedError = formatPythonRuntimeError(error);
		appendOutput("stderr", formattedError);
		void markPythonRuntimeErrorInEditor(formattedError, runnableFile.name);
		runMessage.value = "Run failed";
	} finally {
		if (isPythonIdeRunCurrent(runID, project._id)) {
			isRunning.value = false;
			stopRequested.value = false;
		}
	}
}

function stopCurrentProject() {
	if (!runControlIsStop.value) return;
	const hadPythonRunInFlight = isRunning.value;
	stopRequested.value = true;
	stopActiveRuntimeSurfaces();
	runMessage.value = "Stopped";
	appendOutput(
		"system",
		hadPythonRunInFlight
			? selectedProject.value?.mode === "python"
				? "Stop requested. Plain Python worker is being terminated."
				: "Stop requested. Python will halt at the next runtime checkpoint."
			: "Stopped active canvas handlers."
	);
	if (!hadPythonRunInFlight) {
		releaseIdlePythonRuntimeCallbacks();
		stopRequested.value = false;
	}
}

function stopActiveRuntimeSurfaces() {
	invalidatePythonIdeRuns();
	isRunning.value = false;
	invalidateTurtleBridgeRuns();
	invalidateGameBridgeRuns();
	stopLoadedPythonRuntimeRun();
	clearTurtleTimers();
	cancelTurtleAnimation();
	stopGameLoop();
	stopAllGameAudio();
	keyHandlers.clear();
	gameKeysDown.clear();
	gameEvents.length = 0;
	turtleClickHandlers.clear();
	turtleDragHandlers.clear();
	refreshActiveTurtleEventHandlerCount();
	activeTurtleDragButton = null;
}

function activateRunControl() {
	if (runControlIsStop.value) {
		stopCurrentProject();
		return;
	}
	void runCurrentProject();
}

function canvasOwnsKeyboardEvent(event: KeyboardEvent) {
	const canvas = canvasRef.value;
	return Boolean(
		canvas && (event.target === canvas || document.activeElement === canvas)
	);
}

function handleKeyDown(event: KeyboardEvent) {
	if (!canvasOwnsKeyboardEvent(event)) return;

	const handler = keyHandlers.get(normalizeKey(event.key));
	if (handler) {
		event.preventDefault();
		try {
			handler();
		} catch (error) {
			appendOutput(
				"stderr",
				error instanceof Error
					? error.message
					: "Turtle key handler failed."
			);
		}
		return;
	}

	if (selectedProject.value?.mode !== "pgzero") return;

	const normalizedKey = normalizeKey(pythonGameKeyFromEvent(event));
	const wasDown = gameKeysDown.has(normalizedKey);
	gameKeysDown.add(normalizedKey);
	if (!wasDown) {
		gameEvents.push({
			type: "keydown",
			key: normalizedKey,
			mod: gameKeyModifierMask(event),
			unicode: gameKeyUnicode(event)
		});
		requestGameTick();
	}

	if (["down", "left", "right", "space", "up"].includes(normalizedKey)) {
		event.preventDefault();
	}
}

function handleKeyUp(event: KeyboardEvent) {
	if (!canvasOwnsKeyboardEvent(event)) return;
	if (selectedProject.value?.mode !== "pgzero") return;

	const normalizedKey = normalizeKey(pythonGameKeyFromEvent(event));
	gameKeysDown.delete(normalizedKey);
	gameEvents.push({
		type: "keyup",
		key: normalizedKey,
		mod: gameKeyModifierMask(event)
	});
	requestGameTick();
}

function gamePointerPosition(event: MouseEvent) {
	const canvas = canvasRef.value;
	if (!canvas) return { x: 0, y: 0 };

	const rect = canvas.getBoundingClientRect();
	return {
		x: ((event.clientX - rect.left) / rect.width) * gameState.width,
		y: ((event.clientY - rect.top) / rect.height) * gameState.height
	};
}

function gameMouseButton(event: MouseEvent): GameInputEvent["button"] {
	if (event.button === 1) return "middle";
	if (event.button === 2) return "right";
	return "left";
}

function gameMouseButtons(event: MouseEvent) {
	const buttons: NonNullable<GameInputEvent["buttons"]> = [];
	if (event.buttons & 1) buttons.push("left");
	if (event.buttons & 4) buttons.push("middle");
	if (event.buttons & 2) buttons.push("right");
	return buttons;
}

function turtleMouseButton(event: MouseEvent) {
	if (event.button === 1) return "2";
	if (event.button === 2) return "3";
	return "1";
}

function turtlePointerPosition(event: MouseEvent) {
	const canvas = canvasRef.value;
	if (!canvas) return { x: 0, y: 0 };

	const rect = canvas.getBoundingClientRect();
	return {
		x: event.clientX - rect.left - rect.width / 2,
		y: rect.height / 2 - (event.clientY - rect.top)
	};
}

function queueGamePointerEvent(
	event: MouseEvent,
	type: GameInputEvent["type"]
) {
	if (selectedProject.value?.mode !== "pgzero") return;

	const point = gamePointerPosition(event);
	const relX = lastGamePointerPoint ? point.x - lastGamePointerPoint.x : 0;
	const relY = lastGamePointerPoint ? point.y - lastGamePointerPoint.y : 0;
	lastGamePointerPoint = point;

	gameEvents.push({
		type,
		x: point.x,
		y: point.y,
		button: gameMouseButton(event),
		buttons: gameMouseButtons(event),
		relX,
		relY
	});
	requestGameTick();

	if (type === "mouseup") lastGamePointerPoint = null;
	if (type !== "mousemove" || event.buttons) event.preventDefault();
}

function dispatchCanvasWheelEvent(event: WheelEvent) {
	if (selectedProject.value?.mode !== "pgzero") return;

	const point = gamePointerPosition(event);
	gameEvents.push({
		type: "mousedown",
		x: point.x,
		y: point.y,
		button: event.deltaY < 0 ? "wheel_up" : "wheel_down"
	});
	requestGameTick();
	canvasRef.value?.focus();
	event.preventDefault();
}

function callTurtlePointerHandler(
	handler: (x: number, y: number) => void,
	event: MouseEvent,
	failureMessage: string
) {
	const point = turtlePointerPosition(event);
	try {
		handler(point.x, point.y);
	} catch (error) {
		appendOutput(
			"stderr",
			error instanceof Error ? error.message : failureMessage
		);
	}
}

function dispatchCanvasPointerEvent(
	event: MouseEvent,
	type: GameInputEvent["type"]
) {
	if (type === "mousedown") canvasRef.value?.focus();

	if (selectedProject.value?.mode === "pgzero") {
		queueGamePointerEvent(event, type);
		return;
	}

	if (selectedProject.value?.mode !== "turtle") return;

	if (type === "mouseup") {
		activeTurtleDragButton = null;
		return;
	}

	if (type === "mousemove") {
		const dragHandler = activeTurtleDragButton
			? turtleDragHandlers.get(activeTurtleDragButton)
			: null;
		if (!dragHandler) return;
		callTurtlePointerHandler(
			dragHandler,
			event,
			"Turtle drag handler failed."
		);
		event.preventDefault();
		return;
	}

	if (type !== "mousedown") return;

	const button = turtleMouseButton(event);
	const clickHandler = turtleClickHandlers.get(button);
	const dragHandler = turtleDragHandlers.get(button);

	if (!clickHandler && !dragHandler) return;
	activeTurtleDragButton = dragHandler ? button : null;

	if (clickHandler) {
		callTurtlePointerHandler(
			clickHandler,
			event,
			"Turtle click handler failed."
		);
	}

	event.preventDefault();
}

function clearTurtleDrag() {
	activeTurtleDragButton = null;
}

function clearCanvasKeyboardState() {
	gameKeysDown.clear();
	activeTurtleDragButton = null;
}

watch(
	() => currentUser.value?._id,
	() => {
		void loadProjects();
	}
);

watch(
	() =>
		[
			route.query.course,
			route.query.mode,
			route.query.projectKey,
			route.query.starter,
			route.query.starterLabel,
			route.query.starterTitle,
			route.query.starterUrl
		].join(":"),
	() => {
		void loadProjects();
	}
);

watch(selectedProjectID, (projectID, previousProjectID) => {
	const expectedMigration = expectedSelectedProjectIDMigration;
	expectedSelectedProjectIDMigration = null;
	if (
		expectedMigration &&
		previousProjectID === expectedMigration.from &&
		projectID === expectedMigration.to
	) {
		void nextTick(resetActiveCanvas);
		return;
	}

	const hadPythonRunInFlight = isRunning.value;
	stopRequested.value = true;
	stopActiveRuntimeSurfaces();
	runMessage.value = "Ready";
	if (!hadPythonRunInFlight) {
		releaseIdlePythonRuntimeCallbacks();
		stopRequested.value = false;
	}
	void nextTick(resetActiveCanvas);
});

watch(
	() =>
		`${selectedProjectID.value}:${activeFile.value?.name ?? ""}:${activeFileIsBinaryAsset.value}`,
	() => {
		void nextTick(resetCodeEditor);
	},
	{ flush: "post" }
);

watch(activeFileContent, content => {
	syncCodeEditorContent(content);
});

watch(isLoading, loading => {
	if (!loading) void nextTick(resetCodeEditor);
});

onMounted(() => {
	primePythonRuntimeConnection();
	void refreshPythonIdeStoragePersistenceStatus();
	void loadProjects();
	window.addEventListener("pagehide", flushPendingProjectSave);
	document.addEventListener(
		"visibilitychange",
		flushPendingProjectSaveOnVisibilityChange
	);
	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);
	window.addEventListener("mouseup", clearTurtleDrag);

	if (canvasRef.value) {
		resizeObserver = new ResizeObserver(() => redrawActiveCanvas());
		resizeObserver.observe(canvasRef.value);
	}
});

onBeforeUnmount(() => {
	flushPendingProjectSave();
	saveCodeEditorViewState();
	codeEditorView?.destroy();
	window.removeEventListener("pagehide", flushPendingProjectSave);
	document.removeEventListener(
		"visibilitychange",
		flushPendingProjectSaveOnVisibilityChange
	);
	window.removeEventListener("keydown", handleKeyDown);
	window.removeEventListener("keyup", handleKeyUp);
	window.removeEventListener("mouseup", clearTurtleDrag);
	stopRequested.value = true;
	stopActiveRuntimeSurfaces();
	releaseLoadedPythonRuntimeCallbacks();
	resizeObserver?.disconnect();
});
</script>

<template>
	<section class="python-ide-page page-shell page-shell--wide">
		<div class="python-ide-hero">
			<div>
				<p class="python-ide-eyebrow">Python IDE</p>
				<h1>Code, run, and draw in Python</h1>
				<p>
					Build multi-file Python projects, run standard Python code,
					and use the Turtle canvas for drawing and keyboard-driven
					lessons, PyGame Zero game projects, or data/AI notebooks
					with rendered charts.
				</p>
			</div>
			<div class="python-ide-status" aria-live="polite">
				<span>{{ saveMessage }}</span>
				<strong>{{ runMessage }}</strong>
			</div>
		</div>

		<div v-if="isLoading" class="python-ide-loading site-surface">
			Loading Python workspace...
		</div>

		<div
			v-else
			class="python-ide-workspace"
			:class="{ 'is-sidebar-collapsed': sidebarCollapsed }"
		>
			<button
				v-if="sidebarCollapsed"
				:aria-expanded="!sidebarCollapsed"
				aria-label="Expand project sidebar"
				aria-controls="python-ide-sidebar"
				class="sidebar-collapse-toggle sidebar-collapse-toggle--rail"
				title="Expand project sidebar"
				type="button"
				@click="sidebarCollapsed = !sidebarCollapsed"
			>
				<span class="sidebar-collapse-icon" aria-hidden="true" />
			</button>
			<aside
				v-else
				id="python-ide-sidebar"
				class="python-ide-sidebar"
				aria-label="Python projects and files"
			>
				<div class="sidebar-block">
					<div class="sidebar-heading">
						<span>Projects</span>
						<div class="sidebar-actions">
							<button
								:aria-expanded="!sidebarCollapsed"
								aria-label="Collapse project sidebar"
								aria-controls="python-ide-sidebar"
								class="sidebar-collapse-toggle sidebar-collapse-toggle--inline"
								title="Collapse project sidebar"
								type="button"
								@click="sidebarCollapsed = true"
							>
								<span
									class="sidebar-collapse-icon"
									aria-hidden="true"
								/>
							</button>
							<div class="project-create">
								<button
									:aria-expanded="showProjectMenu"
									aria-haspopup="menu"
									aria-label="Create new project"
									class="icon-action icon-action--add"
									title="Create new project"
									type="button"
									@click="showProjectMenu = !showProjectMenu"
								>
									+
								</button>
								<div
									v-if="showProjectMenu"
									class="project-create-menu"
									role="menu"
								>
									<span>New project</span>
									<button
										type="button"
										role="menuitem"
										@click="createProjectFromMenu('python')"
									>
										Python
									</button>
									<button
										type="button"
										role="menuitem"
										@click="createProjectFromMenu('data')"
									>
										Data / AI notebook
									</button>
									<button
										type="button"
										role="menuitem"
										@click="createProjectFromMenu('turtle')"
									>
										Python Turtle
									</button>
									<button
										type="button"
										role="menuitem"
										@click="createProjectFromMenu('pgzero')"
									>
										PyGame Zero
									</button>
									<span>Demo project</span>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'python',
												'demo'
											)
										"
									>
										Demo Python
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'data',
												'demo'
											)
										"
									>
										Demo Data / AI
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'demo'
											)
										"
									>
										Demo Python Turtle
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'pgzero',
												'demo'
											)
										"
									>
										Demo PyGame Zero
									</button>
								</div>
							</div>
						</div>
					</div>

					<div class="project-list">
						<div
							v-for="project in sortedProjects"
							:key="project._id"
							class="project-row"
							:class="{
								'is-confirming':
									project._id === deleteCandidateProjectID
							}"
						>
							<div class="project-row-main">
								<button
									class="project-button"
									:class="{
										'is-active':
											project._id === selectedProject?._id
									}"
									type="button"
									@click="selectedProjectID = project._id"
								>
									<span>{{ projectLabel(project) }}</span>
									<small>{{
										getPythonIdeModeLabel(project.mode)
									}}</small>
								</button>
								<button
									:aria-label="`Delete project ${projectLabel(project)}`"
									class="file-delete project-delete-trigger"
									:class="{
										'is-disabled': projects.length <= 1
									}"
									:disabled="projects.length <= 1"
									:title="
										projects.length <= 1
											? 'Keep at least one project'
											: `Delete project ${projectLabel(project)}`
									"
									type="button"
									@click="requestProjectDelete(project)"
								>
									x
								</button>
							</div>
							<div
								v-if="
									project._id === selectedProject?._id &&
									project._id === deleteCandidateProjectID
								"
								class="project-delete-confirm"
							>
								<strong>
									Delete "{{ projectLabel(project) }}"?
								</strong>
								<p>Type confirm to permanently delete it.</p>
								<input
									v-model="deleteConfirmText"
									aria-label="Type confirm to delete project"
									placeholder="confirm"
									type="text"
									@keyup.enter="confirmProjectDelete(project)"
								/>
								<div class="project-delete-actions">
									<button
										class="site-button site-button--secondary compact-button"
										type="button"
										@click="cancelProjectDelete"
									>
										Cancel
									</button>
									<button
										class="site-button project-delete-final compact-button"
										:disabled="
											deleteConfirmText
												.trim()
												.toLowerCase() !== 'confirm'
										"
										type="button"
										@click="confirmProjectDelete(project)"
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div v-if="selectedProject" class="sidebar-block">
					<div class="sidebar-heading">
						<span>Files</span>
					</div>
					<div class="file-list">
						<div
							v-for="file in selectedProject.files"
							:key="file.name"
							class="file-row"
						>
							<button
								class="file-button"
								:class="{
									'is-active':
										file.name ===
										selectedProject.activeFileName
								}"
								type="button"
								@click="selectFile(file.name)"
							>
								<span>{{ file.name }}</span>
								<small>{{
									getPythonIdeFileKindLabel(file.name)
								}}</small>
							</button>
							<button
								aria-label="Delete file"
								class="file-delete"
								:class="{ 'is-disabled': !canDeleteFile(file) }"
								:disabled="!canDeleteFile(file)"
								title="Delete file"
								type="button"
								@click="deleteFile(file)"
							>
								x
							</button>
						</div>
					</div>
					<div class="file-tools-footer">
						<button
							:aria-expanded="showFileTools"
							aria-label="Add or import project files"
							class="file-tool-toggle"
							title="Add or import project files"
							type="button"
							@click="showFileTools = !showFileTools"
						>
							<span
								class="file-tool-toggle-icon"
								aria-hidden="true"
							/>
						</button>
					</div>
					<div v-if="showFileTools" class="file-tools-panel">
						<div class="new-file-row">
							<input
								v-model="newFileName"
								aria-label="New project file name"
								placeholder="helper.py, helpers/math_tools.py, or data.csv"
								type="text"
								@keyup.enter="addFile"
							/>
							<button
								class="site-button site-button--secondary compact-button"
								type="button"
								@click="addFile"
							>
								Add
							</button>
						</div>
						<label class="file-import-row">
							<span>Import images/audio</span>
							<input
								:accept="pythonIdeFileUploadAccept"
								multiple
								type="file"
								@change="importProjectFiles"
							/>
						</label>
					</div>
				</div>
			</aside>

			<main v-if="selectedProject" class="python-ide-main">
				<div class="editor-toolbar">
					<label>
						<span>Project name</span>
						<input
							:value="selectedProject.title"
							type="text"
							@input="updateProjectTitle"
						/>
					</label>
					<div class="editor-actions">
						<div class="ide-settings">
							<button
								:aria-expanded="showIdeSettings"
								aria-label="Python IDE settings"
								class="ide-settings-trigger"
								title="Python IDE settings"
								type="button"
								@click="showIdeSettings = !showIdeSettings"
							>
								<span aria-hidden="true">⚙</span>
							</button>
							<div
								v-if="showIdeSettings"
								class="ide-settings-panel"
								role="dialog"
								aria-label="Python IDE settings"
							>
								<label class="ide-setting-toggle">
									<input
										:checked="autoSaveEnabled"
										type="checkbox"
										@change="updateAutoSavePreference"
									/>
									<span>
										<strong>Autosave projects</strong>
										<small>
											Save edits locally right away and
											sync them to your account when
											possible.
										</small>
									</span>
								</label>
								<div class="ide-setting-storage">
									<button
										class="ide-setting-action"
										:disabled="
											storagePersistenceStatus ===
											'checking'
										"
										type="button"
										@click="
											requestPythonIdeStoragePersistence
										"
									>
										{{
											storagePersistenceStatus ===
											"checking"
												? "Checking storage"
												: "Protect local saves"
										}}
									</button>
									<small>
										{{ storagePersistenceMessage }}
									</small>
								</div>
							</div>
						</div>
						<button
							class="site-button site-button--secondary"
							:disabled="isSaving"
							type="button"
							@click="saveSelectedProject({ force: true })"
						>
							{{ isSaving ? "Saving" : "Save" }}
						</button>
						<button
							class="site-button site-button--primary run-control"
							:class="{ 'run-control--stop': runControlIsStop }"
							:disabled="!runControlIsStop && isSaving"
							type="button"
							@click="activateRunControl"
						>
							{{ runControlIsStop ? "Stop" : "Run" }}
						</button>
					</div>
				</div>

				<div
					class="ide-grid"
					:class="{ 'ide-grid--drawing': usesDrawingCanvas }"
				>
					<section class="code-panel" aria-label="Code editor">
						<div class="panel-header">
							<span>{{ activeFile?.name ?? "main.py" }}</span>
							<div class="editor-assist">
								<small v-if="editorCursorCount > 1">
									{{ editorCursorCount }} cursors
								</small>
								<details class="editor-shortcuts">
									<summary>Shortcuts</summary>
									<ul>
										<li>Cmd/Ctrl+F opens search.</li>
										<li>
											Cmd/Ctrl+Enter runs the project.
										</li>
										<li>Cmd/Ctrl+S saves the project.</li>
										<li>Cmd/Ctrl+/ toggles comments.</li>
										<li>
											Ctrl+Space opens completions; Enter
											accepts the highlighted option.
										</li>
										<li>
											Course snippets include main_guard,
											turtle_screen, ontimer_loop,
											onkey_handler, draw, update, actor,
											data_setup, scatter_plot, and
											decision_tree.
										</li>
										<li>
											Cmd/Ctrl+Alt+Up/Down adds cursors
											above or below.
										</li>
										<li>Tab indents; Shift+Tab dedents.</li>
										<li>
											Alt/Option+Up/Down moves lines; add
											Shift to copy them.
										</li>
										<li>
											Shift+Cmd/Ctrl+\ jumps to the
											matching bracket.
										</li>
										<li>
											Alt/Option-drag creates a
											rectangular selection.
										</li>
										<li>
											Quotes and brackets wrap highlighted
											text.
										</li>
									</ul>
								</details>
							</div>
						</div>
						<div
							v-if="activeFileIsBinaryAsset"
							class="asset-file-preview"
						>
							<img
								v-if="activeFilePreviewKind === 'image'"
								:alt="activeFile?.name"
								:src="activeFileDataUrl"
							/>
							<audio
								v-else-if="activeFilePreviewKind === 'audio'"
								controls
								:src="activeFileDataUrl"
								:title="activeFile?.name"
							/>
							<p>
								{{ activeFile?.name }} is stored as an imported
								asset for this project.
							</p>
						</div>
						<div v-else class="code-editor-shell">
							<div
								ref="codeEditorHostRef"
								class="code-editor-host"
							/>
						</div>
					</section>

					<section class="result-panel" aria-label="Python output">
						<div class="panel-header">
							<span>{{
								usesDrawingCanvas
									? `${selectedModeLabel} canvas`
									: "Runtime"
							}}</span>
							<button
								class="panel-link"
								type="button"
								@click="clearOutput"
							>
								Clear output
							</button>
						</div>

						<div
							v-show="usesDrawingCanvas"
							class="canvas-shell"
							:class="{ 'canvas-shell--game': usesGameCanvas }"
						>
							<div
								class="canvas-frame"
								:class="{
									'canvas-frame--game': usesGameCanvas
								}"
								:style="drawingCanvasStyle"
							>
								<canvas
									ref="canvasRef"
									:aria-label="`${selectedModeLabel} canvas`"
									class="turtle-canvas"
									:class="{
										'turtle-canvas--game': usesGameCanvas
									}"
									tabindex="0"
									@blur="clearCanvasKeyboardState"
									@mousedown="
										dispatchCanvasPointerEvent(
											$event,
											'mousedown'
										)
									"
									@mousemove="
										dispatchCanvasPointerEvent(
											$event,
											'mousemove'
										)
									"
									@mouseup="
										dispatchCanvasPointerEvent(
											$event,
											'mouseup'
										)
									"
									@wheel="dispatchCanvasWheelEvent"
								/>
							</div>
						</div>

						<div
							v-if="runtimeArtifacts.length"
							class="artifact-list"
							aria-label="Rendered Python charts and reports"
						>
							<figure
								v-for="artifact in runtimeArtifacts"
								:key="artifact.id"
								class="artifact-card"
							>
								<figcaption>
									<span>{{ artifact.title }}</span>
									<small>{{ artifact.mimeType }}</small>
								</figcaption>
								<img
									v-if="artifact.dataUrl"
									:alt="artifact.title"
									:src="artifact.dataUrl"
								/>
								<audio
									v-else-if="artifact.audioUrl"
									controls
									:src="artifact.audioUrl"
									:title="artifact.title"
								/>
								<iframe
									v-else-if="artifact.srcdoc"
									referrerpolicy="no-referrer"
									sandbox="allow-scripts"
									:srcdoc="artifact.srcdoc"
									:title="artifact.title"
								/>
								<pre v-else>{{ artifact.text }}</pre>
							</figure>
						</div>

						<div class="input-output-grid">
							<label class="stdin-panel">
								<span>Input</span>
								<textarea
									v-model="inputText"
									placeholder="One input() value per line"
								/>
							</label>

							<div class="output-panel" aria-live="polite">
								<div
									v-if="!outputLines.length"
									class="empty-output"
								>
									Output will appear here after a run.
								</div>
								<pre
									v-for="line in outputLines"
									:key="line.id"
									:class="`output-line output-line--${line.kind}`"
									>{{ line.text }}</pre
								>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	</section>
</template>

<style scoped>
.python-ide-page {
	width: min(1680px, calc(100% - clamp(2rem, 4vw, 4rem)));
	gap: 1.25rem;
	--python-code-bg: #f8fafc;
	--python-code-ink: #1e293b;
	--python-code-muted: #64748b;
	--python-code-selection: rgba(37, 99, 235, 0.18);
	--python-code-selection-ink: var(--python-code-ink);
	--python-code-caret: #0f172a;
	--python-output-bg: #f8fafc;
	--python-output-ink: #334155;
	--python-output-muted: #64748b;
	--python-output-stderr: #b91c1c;
	--python-output-system: #047857;
	--python-focus-ring: rgba(16, 185, 129, 0.34);
	--python-focus-glow: rgba(16, 185, 129, 0.16);
	--syntax-keyword: #7c3aed;
	--syntax-builtin: #2563eb;
	--syntax-function: #a16207;
	--syntax-property: #1d4ed8;
	--syntax-string: #15803d;
	--syntax-comment: #64748b;
	--syntax-number: #dc2626;
	--syntax-operator: #0891b2;
	--syntax-bracket: #334155;
	--syntax-bracket-pair-1: #047857;
	--syntax-bracket-pair-2: #7c3aed;
	--syntax-bracket-pair-3: #ca8a04;
	--syntax-bracket-pair-4: #dc2626;
	--syntax-bracket-pair-5: #2563eb;
	--syntax-bracket-pair-6: #0891b2;
}

.python-ide-page {
	letter-spacing: 0;
}

.python-ide-page :is(section, p, label, input, textarea, select, button) {
	margin: 0;
	letter-spacing: 0;
}

.python-ide-hero {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 1.25rem;
	align-items: end;
	padding: clamp(1.25rem, 2vw, 2rem);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-lg);
	background: linear-gradient(
		135deg,
		rgba(255, 255, 255, 0.96),
		rgba(236, 253, 245, 0.86)
	);
	box-shadow: var(--shadow-soft);
}

.python-ide-eyebrow,
.sidebar-heading,
.panel-header,
.editor-toolbar span,
.stdin-panel span {
	font-size: 0.75rem;
	font-weight: 800;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #0f766e;
}

.python-ide-hero h1 {
	margin-top: 0.35rem;
	font-size: clamp(2.4rem, 4vw, 4.5rem);
	color: var(--color-ink-strong);
}

.python-ide-hero p:not(.python-ide-eyebrow) {
	max-width: 58rem;
	margin-top: 0.75rem;
	color: var(--color-ink-soft);
	font-size: 1rem;
	line-height: 1.7;
}

.python-ide-status {
	min-width: 14rem;
	display: grid;
	gap: 0.35rem;
	padding: 1rem;
	border: 1px solid var(--color-border);
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.82);
	color: var(--color-ink-soft);
}

.python-ide-status strong {
	color: var(--color-ink-strong);
	font-size: 1.1rem;
}

html.dark .python-ide-hero {
	background: linear-gradient(
		135deg,
		rgba(8, 32, 43, 0.98),
		rgba(17, 65, 62, 0.88)
	);
}

html.dark .python-ide-hero h1 {
	color: #f8fbff;
}

html.dark .python-ide-hero p:not(.python-ide-eyebrow) {
	color: #c8dce6;
}

html.dark .python-ide-status {
	background: rgba(8, 17, 31, 0.8);
	color: #c8dce6;
}

html.dark .python-ide-status strong {
	color: #f8fbff;
}

html.dark .ide-settings-trigger,
html.dark .ide-settings-panel {
	background: rgba(8, 17, 31, 0.94);
	color: #f8fbff;
}

html.dark .ide-setting-toggle strong {
	color: #f8fbff;
}

html.dark .ide-setting-toggle small {
	color: #c8dce6;
}

html.dark .ide-setting-action {
	border-color: rgba(94, 234, 212, 0.42);
	background: rgba(20, 184, 166, 0.16);
	color: #7dd3fc;
}

html.dark .ide-setting-storage small {
	color: #c8dce6;
}

html.dark .python-ide-page {
	--python-code-bg: #07111f;
	--python-code-ink: #d7fbe8;
	--python-code-muted: #94a3b8;
	--python-code-selection: rgba(59, 130, 246, 0.4);
	--python-code-selection-ink: #f8fbff;
	--python-code-caret: #f8fbff;
	--python-output-bg: #07111f;
	--python-output-ink: #e2e8f0;
	--python-output-muted: #94a3b8;
	--python-output-stderr: #fecaca;
	--python-output-system: #a7f3d0;
	--python-focus-ring: rgba(45, 212, 191, 0.54);
	--python-focus-glow: rgba(45, 212, 191, 0.18);
	--syntax-keyword: #c084fc;
	--syntax-builtin: #60a5fa;
	--syntax-function: #fde68a;
	--syntax-property: #93c5fd;
	--syntax-string: #86efac;
	--syntax-comment: #94a3b8;
	--syntax-number: #fca5a5;
	--syntax-operator: #67e8f9;
	--syntax-bracket: #e2e8f0;
	--syntax-bracket-pair-1: hsl(137.5 95% 74%);
	--syntax-bracket-pair-2: hsl(275 95% 74%);
	--syntax-bracket-pair-3: hsl(52.5 95% 74%);
	--syntax-bracket-pair-4: hsl(190 95% 74%);
	--syntax-bracket-pair-5: hsl(327.5 95% 74%);
	--syntax-bracket-pair-6: hsl(105 95% 74%);
}

.python-ide-loading,
.python-ide-workspace {
	min-height: 42rem;
}

.python-ide-loading {
	display: grid;
	place-items: center;
	color: var(--color-ink-soft);
}

.python-ide-workspace {
	display: grid;
	grid-template-columns: minmax(18rem, 24rem) minmax(0, 1fr);
	gap: 1rem;
	align-items: stretch;
}

.python-ide-workspace.is-sidebar-collapsed {
	grid-template-columns: auto minmax(0, 1fr);
}

.python-ide-sidebar,
.python-ide-main,
.code-panel,
.result-panel {
	border: 1px solid var(--color-border);
	border-radius: var(--radius-lg);
	background: var(--color-surface-strong);
	box-shadow: var(--shadow-soft);
}

.python-ide-sidebar {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	padding: 1rem;
}

.sidebar-collapse-toggle {
	display: grid;
	place-items: center;
	align-self: start;
	border: 1px solid var(--color-border);
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.78);
	color: var(--color-ink-muted);
}

.sidebar-collapse-toggle--inline {
	width: 2.1rem;
	height: 2.1rem;
}

.sidebar-collapse-toggle--rail {
	width: 2.45rem;
	height: 2.45rem;
	margin-inline-start: clamp(0.35rem, 0.8vw, 0.75rem);
	margin-block-start: 0.15rem;
}

.sidebar-collapse-icon {
	position: relative;
	width: 1.15rem;
	height: 1rem;
	border: 2px solid currentColor;
	border-radius: 4px;
}

.sidebar-collapse-icon::before {
	position: absolute;
	top: 2px;
	bottom: 2px;
	left: 0.22rem;
	width: 2px;
	border-radius: 999px;
	background: currentColor;
	content: "";
}

.python-ide-workspace.is-sidebar-collapsed .sidebar-collapse-icon::before {
	right: 0.22rem;
	left: auto;
}

.sidebar-block {
	display: grid;
	gap: 0.8rem;
}

.sidebar-heading,
.panel-header {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	align-items: center;
}

.sidebar-actions {
	display: flex;
	gap: 0.4rem;
}

.project-create {
	position: relative;
}

.icon-action {
	width: 2.1rem;
	height: 2.1rem;
	border: 1px solid var(--color-border);
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.72);
	color: var(--color-ink);
	font-size: 0.72rem;
	font-weight: 800;
}

.icon-action--add {
	display: grid;
	place-items: center;
	border-radius: 999px;
	font-size: 1.4rem;
	line-height: 1;
}

.project-create-menu {
	position: absolute;
	z-index: 20;
	top: calc(100% + 0.45rem);
	right: 0;
	width: 15.5rem;
	display: grid;
	gap: 0.35rem;
	padding: 0.6rem;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	background: var(--color-surface-strong);
	box-shadow: var(--shadow-soft);
}

.project-create-menu span {
	padding: 0.25rem 0.45rem;
	color: #0f766e;
	font-size: 0.68rem;
	font-weight: 900;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.project-create-menu button {
	width: 100%;
	padding: 0.55rem 0.65rem;
	border: 0;
	border-radius: 8px;
	background: rgba(248, 250, 252, 0.9);
	color: var(--color-ink);
	font-weight: 800;
	text-align: left;
}

.project-create-menu button:hover,
.project-create-menu button:focus-visible {
	background: rgba(204, 251, 241, 0.5);
}

.project-list,
.file-list {
	display: grid;
	gap: 0.55rem;
}

.project-row {
	display: grid;
	gap: 0.45rem;
}

.project-row-main {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 0.45rem;
	align-items: stretch;
}

.project-button,
.file-button {
	width: 100%;
	display: grid;
	gap: 0.2rem;
	padding: 0.75rem;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	background: rgba(248, 250, 252, 0.74);
	color: var(--color-ink);
	text-align: left;
}

.project-button.is-active,
.file-button.is-active {
	border-color: rgba(15, 118, 110, 0.36);
	background: rgba(204, 251, 241, 0.34);
}

.project-delete-confirm {
	display: grid;
	gap: 0.55rem;
	padding: 0.75rem;
	border: 1px solid rgba(185, 28, 28, 0.32);
	border-radius: 12px;
	background: rgba(254, 242, 242, 0.94);
	color: #7f1d1d;
}

.project-delete-confirm strong {
	color: #7f1d1d;
}

.project-delete-confirm p {
	color: #991b1b;
	font-size: 0.82rem;
	line-height: 1.4;
}

.project-delete-actions {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.5rem;
}

.project-delete-final {
	border: 1px solid rgba(185, 28, 28, 0.58);
	background: #b91c1c;
	color: #ffffff;
}

.project-delete-final:disabled {
	cursor: not-allowed;
	opacity: 0.44;
}

html.dark .project-create-menu {
	border-color: rgba(94, 234, 212, 0.22);
	background: #0f1b2a;
}

html.dark .project-create-menu span {
	color: #5eead4;
}

html.dark .project-create-menu button {
	background: #172638;
	color: #f8fafc;
}

html.dark .project-create-menu button:hover,
html.dark .project-create-menu button:focus-visible {
	background: #164e4b;
}

html.dark .icon-action,
html.dark .file-tool-toggle,
html.dark .sidebar-collapse-toggle {
	border-color: rgba(148, 163, 184, 0.4);
	background: #e2e8f0;
	color: #0f172a;
}

html.dark .project-button,
html.dark .file-button {
	border-color: rgba(148, 163, 184, 0.18);
	background: #172638;
	color: #f8fafc;
}

html.dark .project-button.is-active,
html.dark .file-button.is-active {
	border-color: rgba(94, 234, 212, 0.5);
	background: #164e4b;
}

html.dark .project-button small {
	color: #b8c7d9;
}

html.dark .file-button small {
	color: #5eead4;
}

html.dark .project-delete-confirm {
	border-color: rgba(248, 113, 113, 0.36);
	background: #1e151d;
	color: #fecaca;
}

html.dark .project-delete-confirm strong {
	color: #fee2e2;
}

html.dark .project-delete-confirm p {
	color: #fca5a5;
}

html.dark .file-delete {
	border-color: rgba(248, 113, 113, 0.24);
	background: #2f1f27;
	color: #fca5a5;
}

html.dark .file-tool-toggle-icon::before {
	background: #e2e8f0;
}

.project-button span,
.file-button span {
	overflow-wrap: anywhere;
	font-weight: 800;
}

.project-button small {
	color: var(--color-ink-muted);
	font-size: 0.78rem;
}

.file-button small {
	color: #0f766e;
	font-size: 0.68rem;
	font-weight: 900;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.file-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 0.4rem;
	align-items: center;
}

.file-delete {
	position: relative;
	width: 2.7rem;
	height: 100%;
	min-height: 2.8rem;
	overflow: hidden;
	border: 1px solid rgba(185, 28, 28, 0.28);
	border-radius: 8px;
	background: rgba(254, 242, 242, 0.86);
	color: #991b1b;
}

.file-delete.is-disabled,
.file-delete:disabled {
	cursor: not-allowed;
	border-color: rgba(148, 163, 184, 0.28);
	background: rgba(248, 250, 252, 0.42);
	color: rgba(100, 116, 139, 0.64);
}

.file-delete.is-disabled::after,
.file-delete:disabled::after {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 135%;
	height: 2px;
	border-radius: 999px;
	background: rgba(100, 116, 139, 0.46);
	content: "";
	transform: translate(-50%, -50%) rotate(-45deg);
}

html.dark .file-delete.is-disabled,
html.dark .file-delete:disabled {
	border-color: rgba(148, 163, 184, 0.22);
	background: rgba(15, 23, 42, 0.36);
	color: rgba(148, 163, 184, 0.58);
}

html.dark .file-delete.is-disabled::after,
html.dark .file-delete:disabled::after {
	background: rgba(203, 213, 225, 0.42);
}

.new-file-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 0.5rem;
}

.file-tools-footer {
	display: flex;
	justify-content: flex-start;
}

.file-tool-toggle {
	width: 2.45rem;
	height: 2.45rem;
	display: grid;
	place-items: center;
	border: 1px solid var(--color-border);
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.78);
	color: #0f766e;
}

.file-tool-toggle-icon {
	position: relative;
	width: 1rem;
	height: 1.2rem;
	border: 2px solid currentColor;
	border-radius: 3px;
}

.file-tool-toggle-icon::before {
	position: absolute;
	top: -2px;
	right: -2px;
	width: 0.36rem;
	height: 0.36rem;
	border-bottom: 2px solid currentColor;
	border-left: 2px solid currentColor;
	background: rgba(255, 255, 255, 0.78);
	content: "";
}

.file-tool-toggle-icon::after {
	position: absolute;
	right: -0.55rem;
	bottom: -0.55rem;
	width: 0.9rem;
	height: 0.9rem;
	border-radius: 999px;
	background: #0f766e;
	color: #ffffff;
	content: "+";
	font-size: 0.75rem;
	font-weight: 900;
	line-height: 0.9rem;
	text-align: center;
}

.file-tools-panel {
	display: grid;
	gap: 0.65rem;
}

.file-import-row {
	display: grid;
	gap: 0.45rem;
	padding: 0.75rem;
	border: 1px dashed rgba(15, 118, 110, 0.4);
	border-radius: 12px;
	background: rgba(240, 253, 250, 0.56);
	color: var(--color-ink);
	font-weight: 800;
}

.file-import-row input {
	width: 100%;
	color: var(--color-ink-muted);
	font-size: 0.84rem;
	font-weight: 600;
}

.new-file-row input,
.project-delete-confirm input,
.editor-toolbar > label input,
.stdin-panel textarea {
	width: 100%;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.84);
	color: var(--color-ink);
}

.new-file-row input,
.project-delete-confirm input,
.editor-toolbar > label input {
	min-height: 2.8rem;
	padding: 0.55rem 0.75rem;
}

.compact-button {
	min-height: 2.8rem;
	padding: 0.55rem 0.75rem;
	border-radius: 12px;
}

.run-control {
	width: 5rem;
	justify-content: center;
	text-align: center;
}

.run-control--stop {
	border-color: rgba(185, 28, 28, 0.68);
	background: #b91c1c;
	color: #ffffff;
}

.run-control--stop:hover,
.run-control--stop:focus-visible {
	background: #991b1b;
}

.python-ide-main {
	min-width: 0;
	display: grid;
	gap: 1rem;
	padding: 1rem;
}

.editor-toolbar {
	display: grid;
	grid-template-columns: minmax(15rem, 1fr) auto;
	gap: 0.75rem;
	align-items: end;
}

.editor-toolbar > label,
.stdin-panel {
	display: grid;
	gap: 0.35rem;
}

.editor-toolbar > label {
	padding: 0.2rem;
	border: 1px solid transparent;
	border-radius: 14px;
	transition:
		border-color 150ms ease,
		box-shadow 150ms ease;
}

.editor-actions {
	position: relative;
	display: flex;
	gap: 0.65rem;
	align-items: end;
}

.ide-settings {
	position: relative;
}

.ide-settings-trigger {
	width: 2.8rem;
	height: 2.8rem;
	display: grid;
	place-items: center;
	border: 1px solid var(--color-border);
	border-radius: 14px;
	background: rgba(255, 255, 255, 0.84);
	color: var(--color-ink-strong);
	font-size: 1.15rem;
	font-weight: 900;
}

.ide-settings-panel {
	position: absolute;
	z-index: 8;
	top: calc(100% + 0.55rem);
	right: 0;
	width: min(20rem, calc(100vw - 2rem));
	padding: 0.85rem;
	border: 1px solid var(--color-border);
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.96);
	box-shadow: var(--shadow-soft);
}

.ide-setting-toggle {
	display: grid;
	grid-template-columns: auto minmax(0, 1fr);
	gap: 0.7rem;
	align-items: start;
	color: var(--color-ink);
}

.ide-setting-storage {
	display: grid;
	gap: 0.45rem;
	margin-top: 0.8rem;
	padding-top: 0.8rem;
	border-top: 1px solid var(--color-border);
}

.ide-setting-action {
	justify-self: start;
	padding: 0.48rem 0.72rem;
	border: 1px solid rgba(15, 118, 110, 0.35);
	border-radius: 999px;
	background: rgba(15, 118, 110, 0.1);
	color: #0f766e;
	font-size: 0.78rem;
	font-weight: 900;
	letter-spacing: 0.02em;
}

.ide-setting-action:disabled {
	cursor: wait;
	opacity: 0.65;
}

.ide-setting-toggle input {
	width: 1.1rem;
	height: 1.1rem;
	margin-top: 0.2rem;
	accent-color: #0f766e;
}

.ide-setting-toggle strong,
.ide-setting-toggle small {
	display: block;
}

.ide-setting-toggle strong {
	color: var(--color-ink-strong);
	font-size: 0.95rem;
}

.ide-setting-toggle small {
	margin-top: 0.2rem;
	color: var(--color-ink-soft);
	font-size: 0.78rem;
	line-height: 1.45;
}

.ide-setting-storage small {
	color: var(--color-ink-soft);
	font-size: 0.76rem;
	line-height: 1.4;
}

.ide-grid {
	min-height: 38rem;
	display: grid;
	grid-template-columns: minmax(0, 1.08fr) minmax(24rem, 0.92fr);
	gap: 1rem;
}

.ide-grid--drawing {
	grid-template-columns: minmax(0, 0.82fr) minmax(28rem, 1.18fr);
}

.code-panel,
.result-panel {
	min-width: 0;
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
	overflow: hidden;
}

.code-panel {
	overflow: visible;
}

.panel-header {
	padding: 0.9rem 1rem;
	border-bottom: 1px solid var(--color-border);
}

.editor-assist {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	gap: 0.55rem;
	align-items: center;
}

.panel-header small {
	color: var(--color-ink-muted);
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0;
	text-transform: none;
}

.editor-shortcuts {
	position: relative;
	text-transform: none;
}

.editor-shortcuts summary {
	list-style: none;
	cursor: pointer;
	border: 1px solid var(--color-border);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.72);
	color: var(--color-ink-soft);
	padding: 0.3rem 0.65rem;
	font-size: 0.76rem;
	font-weight: 800;
	letter-spacing: 0;
}

.editor-shortcuts summary::-webkit-details-marker {
	display: none;
}

.editor-shortcuts[open] summary {
	border-color: var(--python-focus-ring);
	box-shadow: 0 0 0 3px var(--python-focus-glow);
	color: var(--color-ink);
}

.editor-shortcuts ul {
	position: absolute;
	z-index: 25;
	top: calc(100% + 0.5rem);
	right: 0;
	width: min(17.5rem, 78vw);
	max-height: min(24rem, 44vh);
	display: grid;
	gap: 0.35rem;
	margin: 0;
	overflow: auto;
	padding: 0.8rem 0.9rem;
	border: 1px solid var(--color-border);
	border-radius: 14px;
	background: var(--color-surface-strong);
	box-shadow: var(--shadow-soft);
	color: var(--color-ink-soft);
	font-size: 0.82rem;
	font-weight: 700;
	letter-spacing: 0;
	line-height: 1.45;
	overscroll-behavior: contain;
	text-transform: none;
}

.editor-shortcuts li {
	margin-left: 1rem;
}

html.dark .editor-shortcuts summary {
	border-color: rgba(148, 163, 184, 0.32);
	background: rgba(15, 23, 42, 0.7);
	color: #c8dce6;
}

html.dark .editor-shortcuts[open] summary {
	border-color: rgba(94, 234, 212, 0.56);
	color: #f8fbff;
}

html.dark .editor-shortcuts ul {
	border-color: rgba(94, 234, 212, 0.22);
	background: #0f1b2a;
	color: #c8dce6;
}

.panel-link {
	color: var(--color-accent);
	font-size: 0.84rem;
	font-weight: 800;
}

.code-editor-shell {
	position: relative;
	min-height: 100%;
	overflow: hidden;
	border: 1px solid transparent;
	background: var(--python-code-bg);
	transition:
		border-color 150ms ease,
		box-shadow 150ms ease;
}

.code-editor-shell:focus-within,
.canvas-shell:focus-within,
.stdin-panel:focus-within,
.editor-toolbar > label:focus-within {
	border-color: var(--python-focus-ring);
	box-shadow:
		0 0 0 3px var(--python-focus-glow),
		inset 0 0 0 1px rgba(16, 185, 129, 0.12);
}

.code-editor-host {
	width: 100%;
	height: 100%;
	min-height: 100%;
}

.code-editor-host :deep(.cm-editor) {
	border: 0;
	background: var(--python-code-bg);
	color: var(--python-code-ink);
}

.asset-file-preview {
	min-height: 100%;
	display: grid;
	place-items: center;
	gap: 1rem;
	padding: 1.25rem;
	background: var(--python-code-bg);
	color: var(--python-code-ink);
	text-align: center;
}

.asset-file-preview img {
	max-width: min(100%, 34rem);
	max-height: 28rem;
	object-fit: contain;
}

.asset-file-preview audio {
	width: min(100%, 34rem);
}

.asset-file-preview p {
	color: var(--python-code-muted);
	font-size: 0.9rem;
	font-weight: 700;
}

.result-panel {
	grid-template-rows: auto auto minmax(0, 1fr);
}

.canvas-shell {
	display: grid;
	place-items: center;
	padding: 1rem;
	border: 1px solid transparent;
	border-bottom-color: var(--color-border);
	background:
		linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
		linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
		#f8fafc;
	background-size: 24px 24px;
	transition:
		border-color 150ms ease,
		box-shadow 150ms ease;
}

.canvas-shell--game {
	padding: 1.25rem;
}

.canvas-frame {
	width: 100%;
}

.canvas-frame--game {
	width: min(100%, var(--python-game-max-width, 54rem));
	aspect-ratio: var(--python-game-aspect, 640 / 400);
}

.turtle-canvas {
	display: block;
	width: 100%;
	height: 23rem;
	border: 1px solid var(--color-border);
	border-radius: 14px;
	background: #fff;
	outline: none;
}

.turtle-canvas--game {
	width: 100%;
	height: 100%;
}

.artifact-list {
	display: grid;
	gap: 1rem;
	max-height: 34rem;
	overflow: auto;
	padding: 1rem;
	border-bottom: 1px solid var(--color-border);
	background: #f8fafc;
}

.artifact-card {
	display: grid;
	gap: 0.75rem;
	margin: 0;
	padding: 0.85rem;
	border: 1px solid var(--color-border);
	border-radius: 14px;
	background: #fff;
	box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
}

.artifact-card figcaption {
	display: flex;
	justify-content: space-between;
	gap: 1rem;
	color: #0f172a;
	font-weight: 800;
}

.artifact-card figcaption small {
	color: #64748b;
	font-size: 0.74rem;
	font-weight: 700;
}

.artifact-card img,
.artifact-card audio,
.artifact-card iframe {
	width: 100%;
	border-radius: 10px;
}

.artifact-card img,
.artifact-card iframe {
	min-height: 18rem;
	border: 0;
	background: #fff;
}

.artifact-card img {
	min-height: 0;
	object-fit: contain;
}

.artifact-card pre {
	max-height: 22rem;
	margin: 0;
	overflow: auto;
	white-space: pre-wrap;
}

.input-output-grid {
	min-height: 0;
	display: grid;
	grid-template-rows: auto minmax(12rem, 1fr);
}

.stdin-panel {
	padding: 1rem;
	border: 1px solid transparent;
	border-bottom-color: var(--color-border);
	transition:
		border-color 150ms ease,
		box-shadow 150ms ease;
}

.stdin-panel textarea {
	min-height: 5rem;
	padding: 0.75rem;
	resize: vertical;
}

.output-panel {
	min-height: 0;
	overflow: auto;
	padding: 1rem;
	background: var(--python-output-bg);
	color: var(--python-output-ink);
}

.empty-output {
	color: var(--python-output-muted);
	font-family:
		"SFMono-Regular", "Cascadia Code", "Liberation Mono", monospace;
	font-size: 0.9rem;
}

.output-line {
	margin: 0 0 0.45rem;
	white-space: pre-wrap;
	font-family:
		"SFMono-Regular", "Cascadia Code", "Liberation Mono", monospace;
	font-size: 0.9rem;
	line-height: 1.5;
}

.output-line--stderr {
	color: var(--python-output-stderr);
}

.output-line--system {
	color: var(--python-output-system);
}

@media (max-width: 1180px) {
	.python-ide-workspace,
	.ide-grid {
		grid-template-columns: 1fr;
	}

	.python-ide-workspace.is-sidebar-collapsed {
		grid-template-columns: auto minmax(0, 1fr);
	}

	.python-ide-sidebar {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
	}
}

@media (max-width: 820px) {
	.python-ide-page {
		width: min(100% - 1.25rem, 1680px);
	}

	.python-ide-hero,
	.editor-toolbar,
	.python-ide-sidebar {
		grid-template-columns: 1fr;
	}

	.python-ide-status {
		min-width: 0;
	}

	.turtle-canvas:not(.turtle-canvas--game) {
		height: 18rem;
	}
}
</style>
