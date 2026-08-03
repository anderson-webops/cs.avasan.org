<script setup lang="ts">
import type { EditorState as CodeEditorState } from "@codemirror/state";
import type { EditorView as CodeEditorView } from "@codemirror/view";
import type { KarelWallSide, KarelWorldState } from "@/modules/javaIdeRuntime";
import type { PythonCodeMirrorAssetCompletionNames } from "@/modules/pythonCodeMirror";
import type {
	PythonIdeFile,
	PythonIdeMode,
	PythonIdeProject,
	PythonIdeProjectReview,
	PythonIdeProjectTemplate
} from "@/modules/pythonIde";
import type { PythonIdeCourseAssetPack } from "@/modules/pythonIdeCourseAssets";
import type {
	GameBridge,
	RuntimeArtifact,
	TurtleBridge
} from "@/modules/pythonIdeRuntime";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
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
import { reportClassroomUsage } from "@/modules/classroomUsage";
import { runJavaIdeProject } from "@/modules/javaIdeRuntime";
import { createKarelWorldPlaybackController } from "@/modules/karelWorldPlayback";
import {
	acknowledgeLocalPythonProjectRecovery,
	addPythonIdeClassroomSections,
	anonymousPythonWorkspaceWasClearedSinceLoad,
	applyPythonIdeRecoveryPlan,
	claimAnonymousPythonProjectForStudent,
	clearLocalPythonIdeEditorState,
	createPythonIdeProject,
	createRemotePythonIdeProject,
	deleteRemotePythonIdeProject,
	fetchPythonIdeProject,
	fetchPythonIdeProjects,
	fetchVisiblePythonIdeProjectReview,
	fetchVisiblePythonIdeProjectReviews,
	getPythonIdeAssetDataUrl,
	getPythonIdeDefaultFileContent,
	getPythonIdeFileKindLabel,
	getPythonIdeProjectKindLabel,
	getPythonIdeRunnableFile,
	isPythonIdeBinaryAssetFile,
	isPythonIdeBlueJProject,
	isPythonIdeJavaFile,
	isPythonIdeRunnableFile,
	isPythonIdeTextFile,
	isValidPythonFileName,
	loadCurrentTabPythonProjectRecoverySnapshot,
	loadLocalPythonProjectsAsync,
	loadPythonIdeStarterFilesFromGitHub,
	normalizeImportedPythonIdeFileName,
	normalizePythonFileName,
	normalizePythonIdeMode,
	plainPythonIdeProjectSnapshot,
	plainPythonIdeProjectsSnapshot,
	purgeAllStudentPythonProjectRecovery,
	purgeAnonymousPythonWorkspace,
	pythonIdeAllowedFileExtensions,
	pythonIdeAnonymousClearSignalStorageKey,
	pythonIdeEditorViewStateStoragePrefix,
	pythonIdeFileUploadAccept,
	pythonIdeImportID,
	pythonIdeModeForCourseId,
	pythonIdeProjectToPayload,
	reconcilePythonIdeRecoveryProjects,
	resolvePythonIdeActiveFileName,
	saveLocalPythonProjects,
	saveLocalPythonProjectsAsync,
	updateRemotePythonIdeProject,
	volatileStudentPythonProjectRecovery as volatileStudentProjectRecovery
} from "@/modules/pythonIde";
import {
	findPythonIdeCourseAsset,
	getPythonIdeCourseAssetObjectUrl,
	loadPythonIdeCourseAssetPack,
	normalizePythonIdeAssetLookupPath,
	pythonIdeAssetCandidateNames,
	pythonIdeAssetLookupAliases
} from "@/modules/pythonIdeCourseAssets";
import { primePythonRuntimeConnection } from "@/modules/pythonIdeRuntimeHints";
import {
	registerStudentSessionHandoff,
	studentSessionHandoffErrorMessage
} from "@/modules/studentSessionHandoff";
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

interface KarelWorldCell {
	avenue: number;
	beeperCount: number;
	key: string;
	paintColor: string;
	street: number;
	walls: Record<KarelWallSide, boolean>;
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
	stretchLength: number;
	stretchWidth: number;
	outlineWidth: number;
	shearFactor: number;
	shapeTransform: [number, number, number, number];
	tilt: number;
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
	fillColor: string;
	shape: TurtleShapeName;
	speed: number;
	stretchLength: number;
	stretchWidth: number;
	outlineWidth: number;
	shearFactor: number;
	shapeTransform: [number, number, number, number];
	tilt: number;
	visible: boolean;
}

interface TurtleShapeComponent {
	fill: string;
	outline: string;
	points: Array<[number, number]>;
}

type TurtleShapeDefinition =
	| { kind: "compound"; components: TurtleShapeComponent[] }
	| { kind: "image"; name: string }
	| { kind: "polygon"; points: Array<[number, number]> };

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
			kind: "stamp";
			pose: TurtlePose;
			stampID: number;
	  }
	| {
			align: CanvasTextAlign;
			color: string;
			font: string;
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
type CodeIdeWorkspacePresetID = PythonIdeMode | "bluej";

interface CodeIdeWorkspacePreset {
	id: CodeIdeWorkspacePresetID;
	label: string;
	mode: PythonIdeMode;
	template: PythonIdeProjectTemplate;
}

interface CodeIdeWorkspacePresetGroup {
	label: string;
	presets: CodeIdeWorkspacePreset[];
}

type BuiltinTurtleShapeName =
	| "arrow"
	| "blank"
	| "circle"
	| "classic"
	| "fancy"
	| "square"
	| "triangle"
	| "turtle";
type TurtleShapeName = string;

const imageAssetExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
const audioAssetExtensions = [".wav", ".mp3", ".ogg"];
const assetCompletionExtensionMap = {
	images: imageAssetExtensions,
	music: audioAssetExtensions,
	sounds: audioAssetExtensions
} satisfies Record<PythonIdeAssetFolder, string[]>;
const defaultTurtleID = "default";
const defaultTurtleShape: TurtleShapeName = "classic";
const supportedTurtleShapes = new Set<BuiltinTurtleShapeName>([
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
	Exclude<BuiltinTurtleShapeName, "blank" | "fancy">,
	Array<[number, number]>
>;
const maxPythonIdeProjectFiles = 40;
const maxImportedTextFileBytes = 512 * 1024;
const maxImportedBinaryFileBytes = 2 * 1024 * 1024;
const maxImportedBlueJArchiveBytes = 4 * 1024 * 1024;
const maxOutputLines = 500;
const maxOutputTextLength = 12000;
const maxRuntimeArtifacts = 12;
const maxRuntimeArtifactTextLength = 500000;
const maxRuntimeArtifactBase64Length = 1500000;
const runtimeArtifactContentSecurityPolicy =
	"default-src 'none'; base-uri 'none'; connect-src 'none'; font-src data:; form-action 'none'; frame-src 'none'; img-src data: blob:; media-src data: blob:; object-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' https://cdn.plot.ly; style-src 'unsafe-inline'; worker-src 'none'";
const maxCodeEditorViewStates = 120;
const pythonIdeAutoSaveStorageKey = "classes-python-ide-autosave";
const pythonIdeCodeRecommendationsStorageKey =
	"classes-python-ide-code-recommendations";
const pythonIdeEditorLineWrapStorageKey = "classes-python-ide-editor-line-wrap";
const pythonIdeExpandedWorkspaceStorageKey =
	"classes-python-ide-expanded-workspace";
const pythonIdeSplitPercentStorageKey = "classes-python-ide-split-percent";
const blueJProjectArchiveUploadAccept =
	".zip,application/zip,application/x-zip-compressed";
const blueJHomeUrl = "https://www.bluej.org/";
const blueJSourceUrl = "https://github.com/k-pet-group/BlueJ-Greenfoot";
const codeIdeWorkspacePresetGroups: CodeIdeWorkspacePresetGroup[] = [
	{
		label: "Browser IDE",
		presets: [
			{
				id: "python",
				label: "Python",
				mode: "python",
				template: "blank"
			},
			{
				id: "turtle",
				label: "Python Turtle",
				mode: "turtle",
				template: "blank"
			},
			{
				id: "pgzero",
				label: "PyGame Zero",
				mode: "pgzero",
				template: "blank"
			},
			{
				id: "data",
				label: "Data / AI",
				mode: "data",
				template: "blank"
			},
			{ id: "java", label: "Java", mode: "java", template: "blank" },
			{
				id: "karel",
				label: "Karel Java",
				mode: "karel",
				template: "blank"
			}
		]
	},
	{
		label: "BlueJ integration",
		presets: [
			{
				id: "bluej",
				label: "BlueJ Java",
				mode: "java",
				template: "bluej"
			}
		]
	}
];
const codeIdeWorkspacePresets = codeIdeWorkspacePresetGroups.flatMap(
	group => group.presets
);
const blueJClassNameRegex =
	/\b(?:public\s+)?(?:abstract\s+|final\s+)?class\s+([A-Z_$][\w$]*)/;
const blueJMainMethodRegex =
	/\bmain\s*\(\s*(?:\w+\s*\[\s*\]\s+\w+|\w+\s+\w+\s*\[\s*\]|\w+\s*\.\.\.\s+\w+)/;
const defaultCodeSplitPercent = 54;
const defaultDrawingCodeSplitPercent = 42;
const minCodeSplitPercent = 28;
const maxCodeSplitPercent = 72;
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
const karelPlaybackFrameDelayMs = 650;
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
const { currentStudent, studentRequiresPasswordSetup } = storeToRefs(app);
const studentProjectOwnerID = computed(() =>
	currentStudent.value && !studentRequiresPasswordSetup.value
		? currentStudent.value._id
		: null
);

const projects = ref<PythonIdeProject[]>([]);
const visibleProjectReviews = ref<PythonIdeProjectReview[]>([]);
const selectedProjectID = ref("");
const projectDetailLoadErrorID = ref("");
const selectedReviewFileName = ref("");
const newFileName = ref("");
const inputText = ref("");
const outputLines = ref<OutputLine[]>([]);
const runtimeArtifacts = ref<RuntimeArtifactView[]>([]);
const karelWorld = ref<KarelWorldState | null>(null);
const isLoading = ref(true);
const isSaving = ref(false);
const isDownloading = ref(false);
const isRunning = ref(false);
const isGameLoopActive = ref(false);
const activeTurtleTimerCount = ref(0);
const activeTurtleTimerCallbackCount = ref(0);
const activeTurtleEventHandlerCount = ref(0);
const showProjectMenu = ref(false);
const showFileTools = ref(false);
const showIdeSettings = ref(false);
const newWorkspacePresetID = ref<CodeIdeWorkspacePresetID>("turtle");
const autoSaveEnabled = ref(loadPythonIdeAutoSavePreference());
const codeRecommendationsEnabled = ref(
	loadPythonIdeCodeRecommendationsPreference()
);
const editorLineWrapEnabled = ref(loadPythonIdeEditorLineWrapPreference());
const ideExpanded = ref(loadPythonIdeExpandedWorkspacePreference());
const ideSplitPercent = ref(loadPythonIdeSplitPercentPreference());
const isResizingIdeSplit = ref(false);
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
const activeStorageOwnerID = ref<string | null>(studentProjectOwnerID.value);
const pendingAnonymousProjects = ref<PythonIdeProject[]>([]);
const isImportingAnonymousProjects = ref(false);
const anonymousImportError = ref("");
const isClearingAnonymousWorkspace = ref(false);
const showAnonymousWorkspaceClearConfirmation = ref(false);
const anonymousWorkspaceClearError = ref("");
const sharedComputerCleanupPanelIsVisible = false;
const pythonIdePageRef = ref<HTMLElement | null>(null);
const codeEditorHostRef = ref<HTMLDivElement | null>(null);
const ideGridRef = ref<HTMLDivElement | null>(null);
const ideSettingsRef = ref<HTMLDivElement | null>(null);
const blueJArchiveInputRef = ref<HTMLInputElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const karelWorldRef = ref<HTMLDivElement | null>(null);
const turtleCanvasWidth = ref(640);
const turtleCanvasHeight = ref(480);
const editorCursorCount = ref(1);
const artifactCounter = ref(0);
const outputCounter = ref(0);
const turtleKeyPressHandlers = new Map<string, () => void>();
const turtleKeyReleaseHandlers = new Map<string, () => void>();
const turtleClickHandlers = new Map<string, (x: number, y: number) => void>();
const turtleReleaseHandlers = new Map<string, (x: number, y: number) => void>();
const turtleDragHandlers = new Map<string, (x: number, y: number) => void>();
const turtleObjectClickHandlers = new Map<
	string,
	(x: number, y: number) => void
>();
const turtleObjectReleaseHandlers = new Map<
	string,
	(x: number, y: number) => void
>();
const turtleObjectDragHandlers = new Map<
	string,
	(x: number, y: number) => void
>();
const turtleTimerHandles = new Set<ReturnType<typeof window.setTimeout>>();
const gameKeysDown = new Set<string>();
const gameEvents: GameInputEvent[] = [];
const gameImageCache = new Map<string, CachedGameImage>();
const gameSoundAudio = new Map<string, Set<HTMLAudioElement>>();
const gameToneAudio = new Map<number, GameToneHandle>();
const codeEditorViewStates = new Map<string, CodeEditorViewState>();
const codeEditorStateSnapshots = new Map<string, CodeEditorState>();
const remoteProjectMetadata = new Map<string, PythonIdeProject>();
const remoteReviewMetadata = new Map<string, PythonIdeProjectReview>();
const remoteProjectDetailLoads = new Map<string, Promise<PythonIdeProject>>();
const remoteReviewDetailLoads = new Map<
	string,
	Promise<PythonIdeProjectReview>
>();
const remoteProjectDetailLru: string[] = [];
const maxCachedRemoteProjectDetails = 3;
const karelWorldPlaybackController = createKarelWorldPlaybackController({
	delayMs: karelPlaybackFrameDelayMs,
	showStep(step, stepNumber, stepCount) {
		karelWorld.value = step;
		runMessage.value = `Karel step ${stepNumber} of ${stepCount}`;
	}
});

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
let useFreshCodeEditorStateOnNextReset = false;
let gameCourseAssetPack: PythonIdeCourseAssetPack | null = null;
let gameCourseAssetPackLoadFailed = false;
let gameCourseAssetPackSilentLoadFailed = false;
let turtleStampCounter = 0;
let turtleCompletedCommands: TurtleCompletedCommand[] = [];
let turtleQueuedSteps: TurtleAnimationStep[] = [];
let turtleVisiblePoses = new Map<string, TurtlePose>();
let turtleWorldCoordinates: [number, number, number, number] | null = null;
let turtleBackgroundImage: CachedGameImage | null = null;
const turtleRegisteredShapes = new Map<string, TurtleShapeDefinition>();
let codeEditorModulesPromise: Promise<PythonCodeEditorModules> | null = null;
let pythonRuntimeModulePromise: Promise<PythonRuntimeModule> | null = null;
let loadedPythonRuntimeModule: PythonRuntimeModule | null = null;
let codeEditorResetToken = 0;
let activeCodeEditorViewStateKey = "";
let projectLoadRunID = 0;
let projectOwnerSwitchQueue = Promise.resolve();
let desiredProjectOwnerID = studentProjectOwnerID.value;
let preparedOwnerExitID: string | null = null;
let volatileSuspendedOwnerID: string | null = null;
let unregisterStudentSessionHandoff: (() => void) | null = null;
const ownerBoundMutations = new Set<Promise<unknown>>();

interface ProjectOwnerContext {
	ownerID: string | null;
	loadRunID: number;
}

function captureProjectOwnerContext(
	loadRunID = projectLoadRunID
): ProjectOwnerContext {
	return {
		ownerID: activeStorageOwnerID.value,
		loadRunID
	};
}

function projectOwnerContextIsCurrent(context: ProjectOwnerContext) {
	return (
		activeStorageOwnerID.value === context.ownerID &&
		desiredProjectOwnerID === context.ownerID &&
		projectLoadRunID === context.loadRunID
	);
}

function runOwnerBoundMutation<T>(operation: () => Promise<T>) {
	const mutation = operation();
	ownerBoundMutations.add(mutation);
	mutation.then(
		() => ownerBoundMutations.delete(mutation),
		() => ownerBoundMutations.delete(mutation)
	);
	return mutation;
}

async function waitForOwnerBoundMutations() {
	while (ownerBoundMutations.size) {
		await Promise.allSettled([...ownerBoundMutations]);
	}
}
let ideSplitPointerID: number | null = null;

function loadPythonCodeEditorModules() {
	codeEditorModulesPromise ??= Promise.all([
		import("@codemirror/view"),
		import("@codemirror/state"),
		import("@/modules/pythonCodeMirror")
	]);
	return codeEditorModulesPromise;
}

function loadPythonRuntimeModule() {
	pythonRuntimeModulePromise ??= import("@/modules/pythonIdeRuntime").then(
		module => {
			loadedPythonRuntimeModule = module;
			return module;
		}
	);
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

function loadPythonIdeCodeRecommendationsPreference() {
	if (typeof window === "undefined") return true;
	return (
		window.localStorage.getItem(pythonIdeCodeRecommendationsStorageKey) !==
		"off"
	);
}

function persistPythonIdeCodeRecommendationsPreference(enabled: boolean) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		pythonIdeCodeRecommendationsStorageKey,
		enabled ? "on" : "off"
	);
}

function loadPythonIdeEditorLineWrapPreference() {
	if (typeof window === "undefined") return true;
	return (
		window.localStorage.getItem(pythonIdeEditorLineWrapStorageKey) !== "off"
	);
}

function persistPythonIdeEditorLineWrapPreference(enabled: boolean) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		pythonIdeEditorLineWrapStorageKey,
		enabled ? "on" : "off"
	);
}

function loadPythonIdeExpandedWorkspacePreference() {
	if (typeof window === "undefined") return false;
	return (
		window.localStorage.getItem(pythonIdeExpandedWorkspaceStorageKey) ===
		"on"
	);
}

function persistPythonIdeExpandedWorkspacePreference(enabled: boolean) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		pythonIdeExpandedWorkspaceStorageKey,
		enabled ? "on" : "off"
	);
}

function loadPythonIdeSplitPercentPreference() {
	if (typeof window === "undefined") return null;
	const storedValue = window.localStorage.getItem(
		pythonIdeSplitPercentStorageKey
	);
	if (!storedValue?.trim()) return null;
	const value = Number(storedValue);
	if (!Number.isFinite(value)) return null;
	return clampIdeSplitPercent(value);
}

function persistPythonIdeSplitPercentPreference(value: number) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		pythonIdeSplitPercentStorageKey,
		String(Math.round(value))
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
	codeEditorStateSnapshots.clear();
	if (typeof window === "undefined") return;
	if (userID) {
		// Authenticated editor state stays in this live component only. Do not
		// read owner-keyed project or file metadata from a shared browser.
		window.localStorage.removeItem(codeEditorViewStateStorageKey(userID));
		return;
	}

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
	if (userID) {
		window.localStorage.removeItem(codeEditorViewStateStorageKey(userID));
		return;
	}
	try {
		window.localStorage.setItem(
			codeEditorViewStateStorageKey(userID),
			JSON.stringify([...codeEditorViewStates])
		);
	} catch (error) {
		console.warn("Could not persist IDE editor view state.", error);
	}
}

function releaseLoadedPythonRuntimeCallbacks(
	options: { reportErrors?: boolean } = {}
) {
	if (loadedPythonRuntimeModule) {
		void loadedPythonRuntimeModule
			.releasePythonIdeRuntimeCallbacks()
			.catch(error => {
				if (!options.reportErrors) return;
				appendOutput(
					"stderr",
					error instanceof Error
						? error.message
						: "Could not release Python runtime callbacks."
				);
			});
		return;
	}
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
	if (loadedPythonRuntimeModule) {
		// This removes the opaque iframe and its worker before this function
		// returns. Owner transitions must not leave an old student's code alive
		// for even one promise turn.
		loadedPythonRuntimeModule.stopPythonIdeRuntimeRun();
		return;
	}
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
		lineWidth: 1,
		background,
		shape: defaultTurtleShape,
		speed: 3,
		stretchLength: 1,
		stretchWidth: 1,
		outlineWidth: 1,
		shearFactor: 0,
		shapeTransform: [1, 0, 0, 1],
		tilt: 0,
		visible: true
	};
}

let turtleState = createDefaultTurtleState();
let turtleStates = new Map<string, TurtleState>([
	[defaultTurtleID, turtleState]
]);
let turtleTracerEnabled = true;
let turtleScreenDelayMs = 10;

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

const selectedProject = computed(() => {
	const selected = projects.value.find(
		project => project._id === selectedProjectID.value
	);
	if (selected) return selected;
	return selectedProjectID.value ? null : (projects.value[0] ?? null);
});
const selectedProjectContentLoaded = computed(
	() => selectedProject.value?.remoteContentLoaded !== false
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

const selectedVisibleReview = computed(
	() =>
		visibleProjectReviews.value.find(
			review => review.sourceProject === selectedProject.value?._id
		) ?? null
);
const visibleReviewFiles = computed(
	() => selectedVisibleReview.value?.files ?? []
);
const activeVisibleReviewFile = computed(() => {
	const review = selectedVisibleReview.value;
	if (!review) return null;
	const activeFileName =
		selectedReviewFileName.value &&
		review.files.some(file => file.name === selectedReviewFileName.value)
			? selectedReviewFileName.value
			: resolvePythonIdeActiveFileName(
					review.files,
					review.activeFileName
				);
	return review.files.find(file => file.name === activeFileName) ?? null;
});
const activeVisibleReviewFileContent = computed(() => {
	const file = activeVisibleReviewFile.value;
	if (!file) return "";
	if (isPythonIdeBinaryAssetFile(file))
		return `[Imported asset: ${file.name}]`;
	return file.content;
});

const canSyncToAccount = computed(() => !!activeStorageOwnerID.value);
const storageUserID = computed(() => activeStorageOwnerID.value);
const sortedProjects = computed(() => [...projects.value]);

type StudentSyncMode = Exclude<PythonIdeMode, "java" | "karel">;

function isStudentSyncMode(mode: PythonIdeMode): mode is StudentSyncMode {
	return mode !== "java" && mode !== "karel";
}

function projectUsesStudentSync(project: Pick<PythonIdeProject, "mode">) {
	return isStudentSyncMode(project.mode);
}
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
		? getPythonIdeProjectKindLabel(selectedProject.value)
		: "Code"
);
const newFileNamePlaceholder = computed(() => {
	if (selectedProject.value?.mode === "karel")
		return "MyProgram.java, helpers/Helper.java, or world.txt";
	if (selectedProject.value?.mode === "java")
		return "Main.java or src/main/java/Helper.java";
	return "helper.py, helpers/math_tools.py, or data.csv";
});
const usesDrawingCanvas = computed(
	() =>
		selectedProject.value?.mode === "turtle" ||
		selectedProject.value?.mode === "pgzero"
);
const usesGameCanvas = computed(() => selectedProject.value?.mode === "pgzero");
const usesKarelWorld = computed(() => selectedProject.value?.mode === "karel");
const usesVisualOutput = computed(
	() => usesDrawingCanvas.value || usesKarelWorld.value
);
const activeIdeSplitPercent = computed(
	() =>
		ideSplitPercent.value ??
		(usesVisualOutput.value
			? defaultDrawingCodeSplitPercent
			: defaultCodeSplitPercent)
);
const ideGridStyle = computed(() => ({
	"--code-ide-code-column": `${activeIdeSplitPercent.value}%`
}));
const drawingCanvasStyle = computed(() => {
	if (!usesGameCanvas.value) {
		return {
			"--python-turtle-aspect": `${turtleCanvasWidth.value} / ${turtleCanvasHeight.value}`,
			"--python-turtle-max-width": `${Math.min(80, Math.max(20, (turtleCanvasWidth.value / turtleCanvasHeight.value) * 36))}rem`
		};
	}
	const aspect = gameState.width / gameState.height;
	return {
		"--python-game-aspect": `${gameState.width} / ${gameState.height}`,
		"--python-game-max-width": `${Math.min(68, Math.max(18, aspect * 34))}rem`
	};
});
const karelWorldStyle = computed(() => ({
	"--karel-cols": `${karelWorld.value?.cols ?? 10}`,
	"--karel-rows": `${karelWorld.value?.rows ?? 10}`
}));
const karelRobotStyle = computed(() => {
	const world = karelWorld.value;
	const robot = world?.robot;
	if (!world || !robot) return {};

	const insetRatio = 0.21;
	const sizeRatio = 0.58;
	const leftPercent = ((robot.avenue - 1 + insetRatio) / world.cols) * 100;
	const topPercent =
		((world.rows - robot.street + insetRatio) / world.rows) * 100;

	return {
		height: `${(sizeRatio / world.rows) * 100}%`,
		left: `${leftPercent}%`,
		top: `${topPercent}%`,
		width: `${(sizeRatio / world.cols) * 100}%`
	};
});
const karelRobotDirectionClass = computed(() => {
	const direction =
		karelWorld.value?.robot?.direction.toLowerCase() ?? "east";
	return `karel-robot--${direction}`;
});
function karelCellStyle(cell: KarelWorldCell) {
	if (!cell.paintColor) return undefined;
	return { "--karel-cell-color": cell.paintColor };
}
function karelCellAriaLabel(cell: KarelWorldCell) {
	const label = `Street ${cell.street}, avenue ${cell.avenue}`;
	return cell.paintColor ? `${label}, painted ${cell.paintColor}` : label;
}
const karelWorldCells = computed<KarelWorldCell[]>(() => {
	const world = karelWorld.value;
	if (!world) return [];

	const beepers = new Map(
		world.beepers.map(beeper => [
			karelCellKey(beeper.street, beeper.avenue),
			beeper.count
		])
	);
	const paints = new Map(
		(world.paints ?? []).map(paint => [
			karelCellKey(paint.street, paint.avenue),
			paint.color
		])
	);
	const wallMap = new Map<string, Set<KarelWallSide>>();
	for (const wall of world.walls) {
		const key = karelCellKey(wall.street, wall.avenue);
		const walls = wallMap.get(key) ?? new Set<KarelWallSide>();
		walls.add(wall.side);
		wallMap.set(key, walls);
	}

	const cells: KarelWorldCell[] = [];
	for (let street = world.rows; street >= 1; street -= 1) {
		for (let avenue = 1; avenue <= world.cols; avenue += 1) {
			const key = karelCellKey(street, avenue);
			const walls = wallMap.get(key) ?? new Set<KarelWallSide>();
			cells.push({
				avenue,
				beeperCount: beepers.get(key) ?? 0,
				key,
				paintColor: paints.get(key) ?? "",
				street,
				walls: {
					east: walls.has("east"),
					north: walls.has("north"),
					south: walls.has("south"),
					west: walls.has("west")
				}
			});
		}
	}
	return cells;
});
const requestedCourseId = computed(() =>
	typeof route.query.course === "string" ? route.query.course : ""
);
const requestedCourseProjectKey = computed(() =>
	typeof route.query.projectKey === "string" ? route.query.projectKey : ""
);
const requestedClassroomSource = computed(() =>
	typeof route.query.classroomSource === "string"
		? route.query.classroomSource
		: ""
);
const requestedStarterUrl = computed(() => {
	if (typeof route.query.starterUrl === "string")
		return route.query.starterUrl;

	const classroomSource = requestedClassroomSource.value;
	if (
		!classroomSource ||
		classroomSource.includes("..") ||
		!/^[\w./-]+$/.test(classroomSource)
	) {
		return "";
	}
	return `https://github.com/instruction-material/${classroomSource}`;
});
const requestedStarterTitle = computed(() =>
	typeof route.query.starterTitle === "string" ? route.query.starterTitle : ""
);
const requestedStarterLabel = computed(() =>
	typeof route.query.starterLabel === "string" ? route.query.starterLabel : ""
);
const requestedCourseStarter = computed(() => route.query.starter === "course");
const requestedClassroomProject = computed(
	() =>
		route.query.classroom === "1" ||
		route.query.template === "classroom-project"
);
const requestedTemplate = computed<PythonIdeProjectTemplate>(() => {
	const rawTemplate =
		typeof route.query.template === "string" ? route.query.template : "";
	const rawMode =
		typeof route.query.mode === "string" ? route.query.mode : "";
	if (rawTemplate === "bluej" || rawMode === "bluej") return "bluej";
	if (rawTemplate === "circle-art") return "circle-art";
	if (rawTemplate === "classroom-project") return "classroom-project";
	if (rawTemplate === "course" && requestedCourseStarter.value)
		return "course";
	if (rawTemplate === "demo") return "demo";
	if (rawTemplate === "firework-festival") return "firework-festival";
	if (rawTemplate === "flower-garden") return "flower-garden";
	if (rawTemplate === "maze-explorer") return "maze-explorer";
	if (rawTemplate === "neon-trail") return "neon-trail";
	if (rawTemplate === "outline") return "outline";
	if (rawTemplate === "picasso") return "picasso";
	if (rawTemplate === "spiral-galaxy") return "spiral-galaxy";
	if (rawTemplate === "turtle-race") return "turtle-race";
	if (rawTemplate === "triangle-motion") return "triangle-motion";
	if (requestedClassroomProject.value) return "classroom-project";
	return "blank";
});
const requestedStarterMode = computed(() => {
	const rawMode =
		typeof route.query.mode === "string" ? route.query.mode : "";
	const courseMode = pythonIdeModeForCourseId(requestedCourseId.value);
	return normalizePythonIdeMode(rawMode, courseMode ?? "turtle");
});
const selectedProjectCanExportToBlueJ = computed(() =>
	selectedProject.value ? selectedProject.value.mode === "java" : false
);
const selectedProjectCanShowBlueJIntegration = computed(() =>
	selectedProject.value
		? selectedProject.value.mode === "java" ||
			selectedProject.value.mode === "karel"
		: false
);
const selectedProjectIsBlueJ = computed(() =>
	selectedProject.value
		? isPythonIdeBlueJProject(selectedProject.value)
		: false
);
const selectedProjectBlueJDescription = computed(() => {
	if (selectedProjectIsBlueJ.value) {
		return "This project is BlueJ-ready: download a ZIP with package.bluej for desktop object-bench work, then import the ZIP back here after class.";
	}
	if (selectedProjectCanExportToBlueJ.value) {
		return "Export this Java project as a BlueJ-ready ZIP with package.bluej, source files, and README notes.";
	}
	return "Practice Karel in the browser, or open a BlueJ desktop starter for object-bench inspection.";
});
const selectedBlueJClassTargets = computed(() => {
	const project = selectedProject.value;
	if (!project) return [];

	return project.files
		.filter(file => isPythonIdeJavaFile(file.name))
		.map(file => {
			const fallbackName =
				file.name
					.split("/")
					.filter(Boolean)
					.at(-1)
					?.replace(/\.java$/i, "") || file.name;
			return {
				fileName: file.name,
				hasMainMethod: blueJMainMethodRegex.test(file.content),
				name:
					file.content.match(blueJClassNameRegex)?.[1] ?? fallbackName
			};
		})
		.slice(0, 8);
});
const codeIdeHeroContent = {
	eyebrow: "IDE",
	title: "IDE",
	description:
		"Build multi-file Python and Java projects, use the Turtle canvas for drawing and " +
		"keyboard-driven lessons, explore PyGame Zero games and data/AI notebooks with " +
		"rendered charts, preview Java console programs or Karel robot worlds, and use " +
		"BlueJ integration for desktop object-bench projects, ZIP import, and package.bluej export."
};

function karelCellKey(street: number, avenue: number) {
	return `${street}:${avenue}`;
}

function clearKarelWorldPlayback() {
	karelWorldPlaybackController.clear();
}

function playKarelWorldSteps(
	steps: KarelWorldState[] | undefined,
	shouldContinue: () => boolean
) {
	return karelWorldPlaybackController.play(steps, shouldContinue);
}

function isJavaIdeMode(mode: PythonIdeMode): mode is "java" | "karel" {
	return mode === "java" || mode === "karel";
}

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
		view.srcdoc = `<!doctype html><meta http-equiv="Content-Security-Policy" content="${runtimeArtifactContentSecurityPolicy}">${artifact.data}`;
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

type PythonIdeProjectListItem = PythonIdeProject;

function projectForRoute(projectList: PythonIdeProjectListItem[]) {
	const request = requestedCourseProject();
	if (!request) return null;
	return (
		projectList.find(
			project => project.courseProjectKey === request.courseProjectKey
		) ?? null
	);
}

function requestedStandaloneProjectKey() {
	if (requestedCourseProjectKey.value) return "";
	const template = requestedTemplate.value;
	if (template === "bluej") return "ide-template:bluej";
	if (
		template === "circle-art" ||
		template === "classroom-project" ||
		template === "demo" ||
		template === "firework-festival" ||
		template === "flower-garden" ||
		template === "maze-explorer" ||
		template === "neon-trail" ||
		template === "outline" ||
		template === "picasso" ||
		template === "spiral-galaxy" ||
		template === "turtle-race" ||
		template === "triangle-motion"
	) {
		return `ide-template:${requestedStarterMode.value}:${template}`;
	}
	return "";
}

function standaloneProjectForRoute(projectList: PythonIdeProjectListItem[]) {
	const key = requestedStandaloneProjectKey();
	if (!key) return null;
	return (
		projectList.find(project => project.courseProjectKey === key) ?? null
	);
}

function standaloneProjectStarterLabel(template: PythonIdeProjectTemplate) {
	if (template === "bluej") return "BlueJ starter";
	if (
		template === "circle-art" ||
		template === "classroom-project" ||
		template === "firework-festival" ||
		template === "flower-garden" ||
		template === "maze-explorer" ||
		template === "neon-trail" ||
		template === "picasso" ||
		template === "spiral-galaxy" ||
		template === "turtle-race" ||
		template === "triangle-motion"
	) {
		return "Guided Turtle project";
	}
	if (template === "demo") return "Demo project";
	if (template === "outline") return "Template project";
	return undefined;
}

function applyStandaloneRouteMetadata(project: PythonIdeProject) {
	const key = requestedStandaloneProjectKey();
	if (!key) return project;

	project.courseProjectKey = key;
	project.courseProjectTitle = project.title;
	project.starterLabel = standaloneProjectStarterLabel(
		requestedTemplate.value
	);
	return project;
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
			starterFiles = loadedFiles.length
				? requestedClassroomProject.value
					? addPythonIdeClassroomSections(loadedFiles)
					: loadedFiles
				: undefined;
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
			starterFiles || requestedCourseStarter.value
				? "course"
				: requestedTemplate.value,
		title: request.courseProjectTitle
	});
}

async function openRemoteRequestedProjectsForLoad(loadRunID: number) {
	// prettier-ignore
	const openedCourseProject = await openRequestedCourseProjectIfNeeded(false, loadRunID);
	if (!projectLoadIsCurrent(loadRunID) || openedCourseProject) {
		return openedCourseProject;
	}
	return openRequestedStandaloneProjectIfNeeded(false, loadRunID);
}

async function openLocalRequestedProjectsForLoad(loadRunID: number) {
	// prettier-ignore
	const openedCourseProject = await openRequestedCourseProjectIfNeeded(true, loadRunID);
	if (!projectLoadIsCurrent(loadRunID) || openedCourseProject) {
		return openedCourseProject;
	}
	return openRequestedStandaloneProjectIfNeeded(true, loadRunID);
}

function projectLoadIsCurrent(loadRunID?: number) {
	return loadRunID === undefined || loadRunID === projectLoadRunID;
}

async function saveNewProject(
	project: PythonIdeProject,
	localOnly = false,
	loadRunID?: number,
	ownerContext = captureProjectOwnerContext(loadRunID)
) {
	return runOwnerBoundMutation(async () => {
		if (!projectOwnerContextIsCurrent(ownerContext)) return false;

		if (
			ownerContext.ownerID &&
			!localOnly &&
			projectUsesStudentSync(project)
		) {
			const studentID = ownerContext.ownerID;
			if (
				!projects.value.some(candidate => candidate._id === project._id)
			) {
				projects.value.unshift(project);
			}
			selectedProjectID.value = project._id;
			unsyncedProjectIDs.add(project._id);
			refreshVolatileStudentProjectRecovery();

			const remoteProject = await createRemotePythonIdeProject(
				pythonIdeProjectToPayload(project),
				studentID,
				{
					importID: pythonIdeImportID(project),
					localUpdatedAt: project.updatedAt
				}
			);
			if (!projectOwnerContextIsCurrent(ownerContext)) return false;

			const localIndex = projects.value.findIndex(
				candidate => candidate._id === project._id
			);
			if (localIndex >= 0) {
				migrateCodeEditorViewStates(project._id, remoteProject._id);
				projects.value.splice(localIndex, 1, remoteProject);
			} else {
				projects.value.unshift(remoteProject);
			}
			remoteProjectMetadata.set(
				remoteProject._id,
				projectMetadataSnapshot(remoteProject)
			);
			markRemoteProjectDetailUsed(remoteProject._id);
			trimRemoteProjectDetailCache(remoteProject._id);
			selectedProjectID.value = remoteProject._id;
			unsyncedProjectIDs.delete(project._id);
			unsyncedProjectIDs.delete(remoteProject._id);
			try {
				await discardLocalProjectSnapshotIfSafe();
			} catch {
				// The server save is authoritative. Browser cleanup can retry
				// without restoring or trusting any owner-keyed content.
			}
			if (!projectOwnerContextIsCurrent(ownerContext)) return false;
			saveMessage.value = "Synced to account";
			return true;
		}

		if (!projectOwnerContextIsCurrent(ownerContext)) return false;
		projects.value.unshift(project);
		selectedProjectID.value = project._id;
		if (ownerContext.ownerID && projectUsesStudentSync(project)) {
			unsyncedProjectIDs.add(project._id);
			refreshVolatileStudentProjectRecovery();
			saveMessage.value = "Waiting to sync to account";
			return true;
		}
		await saveLocalPythonProjectsAsync(
			browserProjectPersistenceSnapshot(),
			null
		);
		if (!projectOwnerContextIsCurrent(ownerContext)) return false;
		saveMessage.value = ownerContext.ownerID
			? "Saved in this browser"
			: "Saved locally";
		return true;
	});
}

async function openRequestedCourseProjectIfNeeded(
	localOnly = false,
	loadRunID?: number
) {
	if (!projectLoadIsCurrent(loadRunID)) return false;

	const availableProjects = projects.value;
	const existingProject = projectForRoute(availableProjects);
	if (existingProject) {
		selectedProjectID.value = existingProject._id;
		const studentID = activeStorageOwnerID.value;
		if (
			studentID &&
			!localOnly &&
			existingProject.remoteContentLoaded === false
		) {
			await hydrateRemoteSelection(
				existingProject._id,
				studentID,
				loadRunID
			);
		}
		return true;
	}

	const requestedProject = await createRequestedCourseProject();
	if (!projectLoadIsCurrent(loadRunID)) return false;
	if (!requestedProject) return false;

	await saveNewProject(requestedProject, localOnly, loadRunID);
	return projectLoadIsCurrent(loadRunID);
}

async function openRequestedStandaloneProjectIfNeeded(
	localOnly = false,
	loadRunID?: number
) {
	if (!projectLoadIsCurrent(loadRunID)) return false;

	const key = requestedStandaloneProjectKey();
	if (!key) return false;

	const availableProjects = projects.value;
	const existingProject = standaloneProjectForRoute(availableProjects);
	if (existingProject) {
		selectedProjectID.value = existingProject._id;
		const studentID = activeStorageOwnerID.value;
		if (
			studentID &&
			!localOnly &&
			existingProject.remoteContentLoaded === false
		) {
			await hydrateRemoteSelection(
				existingProject._id,
				studentID,
				loadRunID
			);
		}
		return true;
	}

	const project = applyStandaloneRouteMetadata(
		createPythonIdeProject(requestedStarterMode.value, {
			courseProjectKey: key,
			template: requestedTemplate.value
		})
	);
	await saveNewProject(project, localOnly, loadRunID);
	return projectLoadIsCurrent(loadRunID);
}

async function createInitialProject() {
	const requestedProject = await createRequestedCourseProject();
	if (requestedProject) return requestedProject;
	return applyStandaloneRouteMetadata(
		createPythonIdeProject(requestedStarterMode.value, {
			courseProjectKey: requestedStandaloneProjectKey() || undefined,
			template: requestedTemplate.value
		})
	);
}

function projectMetadataSnapshot(project: PythonIdeProject): PythonIdeProject {
	return {
		...project,
		files: [],
		remoteContentLoaded: false
	};
}

function reviewMetadataSnapshot(
	review: PythonIdeProjectReview
): PythonIdeProjectReview {
	return {
		...review,
		files: [],
		note: undefined,
		remoteContentLoaded: false
	};
}

function markRemoteProjectDetailUsed(projectID: string) {
	const previousIndex = remoteProjectDetailLru.indexOf(projectID);
	if (previousIndex >= 0) remoteProjectDetailLru.splice(previousIndex, 1);
	remoteProjectDetailLru.push(projectID);
}

function trimRemoteProjectDetailCache(keepProjectID: string) {
	const cachedIDs = remoteProjectDetailLru.filter(projectID =>
		projects.value.some(
			project =>
				project._id === projectID &&
				project.remoteContentLoaded === true
		)
	);
	remoteProjectDetailLru.splice(
		0,
		remoteProjectDetailLru.length,
		...cachedIDs
	);

	while (remoteProjectDetailLru.length > maxCachedRemoteProjectDetails) {
		const candidateIndex = remoteProjectDetailLru.findIndex(
			projectID =>
				projectID !== keepProjectID &&
				!pendingSaveProjectIDs.has(projectID) &&
				!unsyncedProjectIDs.has(projectID)
		);
		if (candidateIndex < 0) return;
		const [candidateID] = remoteProjectDetailLru.splice(candidateIndex, 1);
		const metadata = candidateID
			? remoteProjectMetadata.get(candidateID)
			: undefined;
		if (!candidateID || !metadata) continue;
		const projectIndex = projects.value.findIndex(
			project => project._id === candidateID
		);
		if (projectIndex >= 0) {
			projects.value.splice(
				projectIndex,
				1,
				plainPythonIdeProjectSnapshot(metadata)
			);
		}
	}
}

async function ensureRemoteProjectLoaded(
	projectID: string,
	studentID: string,
	loadRunID?: number,
	options: { trimCache?: boolean } = {}
) {
	const existing = projects.value.find(project => project._id === projectID);
	if (!existing || existing._id.startsWith("local-")) return existing ?? null;
	if (!projectUsesStudentSync(existing)) return existing;
	if (existing.remoteContentLoaded === true) {
		markRemoteProjectDetailUsed(projectID);
		if (options.trimCache !== false) {
			trimRemoteProjectDetailCache(projectID);
		}
		return existing;
	}

	let detailLoad = remoteProjectDetailLoads.get(projectID);
	if (!detailLoad) {
		detailLoad = fetchPythonIdeProject(projectID, studentID);
		remoteProjectDetailLoads.set(projectID, detailLoad);
		void detailLoad.then(
			() => {
				if (remoteProjectDetailLoads.get(projectID) === detailLoad) {
					remoteProjectDetailLoads.delete(projectID);
				}
			},
			() => {
				if (remoteProjectDetailLoads.get(projectID) === detailLoad) {
					remoteProjectDetailLoads.delete(projectID);
				}
			}
		);
	}
	const detail = await detailLoad;
	if (
		!projectLoadIsCurrent(loadRunID) ||
		activeStorageOwnerID.value !== studentID ||
		desiredProjectOwnerID !== studentID ||
		(options.trimCache !== false && selectedProjectID.value !== projectID)
	) {
		return null;
	}

	const projectIndex = projects.value.findIndex(
		project => project._id === projectID
	);
	if (projectIndex < 0) return null;
	remoteProjectMetadata.set(projectID, projectMetadataSnapshot(detail));
	projects.value.splice(projectIndex, 1, detail);
	markRemoteProjectDetailUsed(projectID);
	if (options.trimCache !== false) {
		trimRemoteProjectDetailCache(projectID);
	}
	return detail;
}

async function ensureVisibleReviewLoaded(
	projectID: string,
	studentID: string,
	loadRunID?: number
) {
	const project = projects.value.find(
		candidate => candidate._id === projectID
	);
	if (!project || !projectUsesStudentSync(project)) return null;
	const existing = visibleProjectReviews.value.find(
		review => review.sourceProject === projectID
	);
	if (!existing || existing.remoteContentLoaded === true)
		return existing ?? null;

	let detailLoad = remoteReviewDetailLoads.get(existing._id);
	if (!detailLoad) {
		detailLoad = fetchVisiblePythonIdeProjectReview(
			existing._id,
			studentID
		);
		remoteReviewDetailLoads.set(existing._id, detailLoad);
		void detailLoad.then(
			() => {
				if (remoteReviewDetailLoads.get(existing._id) === detailLoad) {
					remoteReviewDetailLoads.delete(existing._id);
				}
			},
			() => {
				if (remoteReviewDetailLoads.get(existing._id) === detailLoad) {
					remoteReviewDetailLoads.delete(existing._id);
				}
			}
		);
	}
	const detail = await detailLoad;
	if (
		!projectLoadIsCurrent(loadRunID) ||
		activeStorageOwnerID.value !== studentID ||
		desiredProjectOwnerID !== studentID ||
		selectedProjectID.value !== projectID
	) {
		return null;
	}

	const reviewIndex = visibleProjectReviews.value.findIndex(
		review => review._id === existing._id
	);
	if (reviewIndex < 0) return null;
	remoteReviewMetadata.set(detail._id, reviewMetadataSnapshot(detail));
	visibleProjectReviews.value.splice(reviewIndex, 1, detail);
	for (
		let index = 0;
		index < visibleProjectReviews.value.length;
		index += 1
	) {
		const review = visibleProjectReviews.value[index];
		if (
			!review ||
			review._id === detail._id ||
			review.remoteContentLoaded !== true
		) {
			continue;
		}
		const metadata = remoteReviewMetadata.get(review._id);
		if (metadata) {
			visibleProjectReviews.value.splice(index, 1, {
				...metadata,
				files: []
			});
		}
	}
	return detail;
}

async function hydrateRemoteSelection(
	projectID: string,
	studentID: string,
	loadRunID?: number
) {
	const candidate = projects.value.find(project => project._id === projectID);
	if (!candidate || !projectUsesStudentSync(candidate)) return false;
	const project = await ensureRemoteProjectLoaded(
		projectID,
		studentID,
		loadRunID
	);
	if (!project) return false;
	await ensureVisibleReviewLoaded(projectID, studentID, loadRunID).catch(
		() => null
	);
	return projectLoadIsCurrent(loadRunID);
}

async function retrySelectedProjectLoad() {
	const projectID = selectedProjectID.value;
	const studentID = activeStorageOwnerID.value;
	const project = projects.value.find(
		candidate => candidate._id === projectID
	);
	if (
		!projectID ||
		!studentID ||
		!project ||
		!projectUsesStudentSync(project)
	) {
		return;
	}

	projectDetailLoadErrorID.value = "";
	const selectionLoadRunID = projectLoadRunID;
	try {
		const loaded = await hydrateRemoteSelection(
			projectID,
			studentID,
			selectionLoadRunID
		);
		if (
			loaded &&
			selectedProjectID.value === projectID &&
			projectLoadIsCurrent(selectionLoadRunID)
		) {
			await nextTick(resetCodeEditor);
		}
	} catch (error) {
		if (
			selectedProjectID.value !== projectID ||
			!projectLoadIsCurrent(selectionLoadRunID)
		) {
			return;
		}
		projectDetailLoadErrorID.value = projectID;
		appendOutput(
			"system",
			error instanceof Error
				? error.message
				: "Could not load this saved project."
		);
	}
}

async function selectCatalogProject(projectID: string) {
	const project = projects.value.find(
		candidate => candidate._id === projectID
	);
	if (!project) return;
	selectedProjectID.value = projectID;
	projectDetailLoadErrorID.value = "";

	const studentID = activeStorageOwnerID.value;
	if (
		!studentID ||
		!projectUsesStudentSync(project) ||
		project._id.startsWith("local-") ||
		project.remoteContentLoaded !== false
	) {
		await nextTick(resetCodeEditor);
		return;
	}

	try {
		const loadRunID = projectLoadRunID;
		if (await hydrateRemoteSelection(projectID, studentID, loadRunID)) {
			await nextTick(resetCodeEditor);
		}
	} catch (error) {
		if (selectedProjectID.value !== projectID) return;
		projectDetailLoadErrorID.value = projectID;
		appendOutput(
			"system",
			error instanceof Error
				? error.message
				: "Could not load this saved project."
		);
	}
}

function setProjects(nextProjects: PythonIdeProject[]) {
	projects.value = nextProjects.map(project => ({
		...project,
		activeFileName:
			project.remoteContentLoaded === false
				? project.activeFileName
				: resolvePythonIdeActiveFileName(
						project.files,
						project.activeFileName
					)
	}));
	remoteProjectMetadata.clear();
	remoteProjectDetailLru.splice(0, remoteProjectDetailLru.length);
	for (const project of projects.value) {
		if (project.remoteContentLoaded === false) {
			remoteProjectMetadata.set(
				project._id,
				plainPythonIdeProjectSnapshot(project)
			);
		} else if (!project._id.startsWith("local-")) {
			remoteProjectMetadata.set(
				project._id,
				projectMetadataSnapshot(project)
			);
			markRemoteProjectDetailUsed(project._id);
		}
	}
	selectedProjectID.value =
		projectForRoute(projects.value)?._id ??
		standaloneProjectForRoute(projects.value)?._id ??
		projects.value[0]?._id ??
		"";
}

function locallyPersistableProjects() {
	return storageUserID.value
		? projects.value.filter(
				project =>
					!projectUsesStudentSync(project) &&
					project.remoteContentLoaded !== false
			)
		: projects.value.filter(
				project => project.remoteContentLoaded !== false
			);
}

function browserProjectPersistenceSnapshot() {
	const sourceProjects = storageUserID.value
		? [...pendingAnonymousProjects.value, ...locallyPersistableProjects()]
		: locallyPersistableProjects();
	const seen = new Set<string>();
	return plainPythonIdeProjectsSnapshot(sourceProjects).filter(project => {
		if (seen.has(project._id)) return false;
		seen.add(project._id);
		return true;
	});
}

function deduplicateProjectSnapshots(projectsToKeep: PythonIdeProject[]) {
	const seen = new Set<string>();
	return plainPythonIdeProjectsSnapshot(projectsToKeep).filter(project => {
		if (seen.has(project._id)) return false;
		seen.add(project._id);
		return true;
	});
}

async function persistBrowserProjectsBeforeOwnerTransition(
	previousOwnerID: string | null,
	previousProjects: PythonIdeProject[]
) {
	if (!previousOwnerID) {
		await saveLocalPythonProjectsAsync(
			deduplicateProjectSnapshots(previousProjects),
			null
		);
		return;
	}

	// Signed-in Python-family projects belong only to the account service.
	// Preserve the existing anonymous Python import queue, but keep Java and
	// Karel in the shared browser store so signing in, signing out, or changing
	// students never associates those browser-only projects with an account.
	const storedAnonymousProjects = await loadLocalPythonProjectsAsync(null);
	const anonymousPythonProjects = [
		...pendingAnonymousProjects.value,
		...storedAnonymousProjects
	].filter(projectUsesStudentSync);
	const browserOnlyProjects = previousProjects.filter(
		project => !projectUsesStudentSync(project)
	);
	await saveLocalPythonProjectsAsync(
		deduplicateProjectSnapshots([
			...anonymousPythonProjects,
			...browserOnlyProjects
		]),
		null
	);
}

async function persistBrowserProjectsBeforeOwnerTransitionBestEffort(
	previousOwnerID: string | null,
	previousProjects: PythonIdeProject[]
) {
	try {
		await persistBrowserProjectsBeforeOwnerTransition(
			previousOwnerID,
			previousProjects
		);
	} catch (error) {
		console.warn(
			"Could not preserve browser-only IDE projects during the account transition.",
			error
		);
	}
}

function refreshVolatileStudentProjectRecovery() {
	const studentID = activeStorageOwnerID.value;
	if (!studentID || !projects.value.length) return;
	volatileStudentProjectRecovery.replace(
		studentID,
		projects.value.filter(
			project =>
				projectUsesStudentSync(project) &&
				project.remoteContentLoaded !== false
		)
	);
}

function retainVolatileStudentProject(
	studentID: string,
	project: PythonIdeProject
) {
	if (!projectUsesStudentSync(project)) return;
	const existingProjects =
		volatileStudentProjectRecovery.forStudent(studentID);
	volatileStudentProjectRecovery.replace(studentID, [
		project,
		...existingProjects.filter(candidate => candidate._id !== project._id)
	]);
}

async function persistLocalProjects(
	options: { message?: string; quiet?: boolean } = {}
) {
	refreshVolatileStudentProjectRecovery();
	try {
		await saveLocalPythonProjectsAsync(
			browserProjectPersistenceSnapshot(),
			null
		);
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
	refreshVolatileStudentProjectRecovery();
	try {
		saveLocalPythonProjects(browserProjectPersistenceSnapshot(), null);
	} catch (error) {
		console.warn("Could not write IDE local snapshot.", error);
	}
}

async function persistLocalProjectSnapshot() {
	if (!projects.value.length) return;
	refreshVolatileStudentProjectRecovery();
	if (localSnapshotInFlight) {
		localSnapshotQueued = true;
		return localSnapshotInFlight;
	}

	localSnapshotInFlight = (async () => {
		do {
			localSnapshotQueued = false;
			await saveLocalPythonProjectsAsync(
				browserProjectPersistenceSnapshot(),
				null
			);
		} while (localSnapshotQueued);
	})();

	try {
		await localSnapshotInFlight;
	} catch (error) {
		console.warn("Could not write IDE local snapshot.", error);
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
	if (pendingSaveProjectIDs.size || saveQueued || unsyncedProjectIDs.size) {
		return;
	}
	const studentID = storageUserID.value;
	if (studentID) {
		volatileStudentProjectRecovery.acknowledge(studentID);
		await purgeAllStudentPythonProjectRecovery();
		unsyncedProjectIDs.clear();
		return;
	}
	const recoverySnapshot =
		await loadCurrentTabPythonProjectRecoverySnapshot(null);
	await acknowledgeLocalPythonProjectRecovery(recoverySnapshot);
	unsyncedProjectIDs.clear();
}

async function discardLocalProjectSnapshotIfSafe() {
	if (unsyncedProjectIDs.size) return;
	await discardLocalProjectSnapshot();
}

function scheduleLocalProjectSnapshot() {
	cancelLocalProjectSnapshot();
	refreshVolatileStudentProjectRecovery();
	if (storageUserID.value) return;
	localSnapshotTimer = window.setTimeout(() => {
		localSnapshotTimer = null;
		void persistLocalProjectSnapshot();
	}, 250);
}

function projectContainsSavedWork(project: PythonIdeProject) {
	return (
		!!project.courseID ||
		!!project.courseProjectKey ||
		project.files.length > 1 ||
		project.title !== "Untitled Code Project" ||
		project.files.some(file => file.content.trim().length > 0)
	);
}

async function importAnonymousProjects() {
	if (
		!activeStorageOwnerID.value ||
		!pendingAnonymousProjects.value.length ||
		isImportingAnonymousProjects.value
	) {
		return;
	}

	const ownerContext = captureProjectOwnerContext();
	const studentID = ownerContext.ownerID;
	if (!studentID) return;
	isImportingAnonymousProjects.value = true;
	anonymousImportError.value = "";
	let claimedProjectHeldInOpenPage = false;
	try {
		await runOwnerBoundMutation(async () => {
			// Each browser project uses its stable local id as the idempotency key.
			// First remove it atomically from shared anonymous storage, then hold
			// the claimed code only in this student's live workspace until the
			// idempotent server upload succeeds.
			for (const project of [...pendingAnonymousProjects.value]) {
				if (!projectOwnerContextIsCurrent(ownerContext)) return;
				if (!projectUsesStudentSync(project)) continue;
				const claimedProject =
					await claimAnonymousPythonProjectForStudent(project);
				if (!projectOwnerContextIsCurrent(ownerContext)) {
					if (volatileSuspendedOwnerID === studentID) {
						retainVolatileStudentProject(studentID, claimedProject);
					}
					return;
				}

				pendingAnonymousProjects.value =
					pendingAnonymousProjects.value.filter(
						candidate => candidate._id !== project._id
					);
				if (
					!projects.value.some(
						candidate => candidate._id === claimedProject._id
					)
				) {
					projects.value.unshift(claimedProject);
				}
				unsyncedProjectIDs.add(claimedProject._id);
				refreshVolatileStudentProjectRecovery();
				claimedProjectHeldInOpenPage = true;

				const importedProject = await createRemotePythonIdeProject(
					pythonIdeProjectToPayload(claimedProject),
					studentID,
					{
						importID: pythonIdeImportID(claimedProject),
						localUpdatedAt: claimedProject.updatedAt
					}
				);
				if (!projectOwnerContextIsCurrent(ownerContext)) return;

				const existingIndex = projects.value.findIndex(
					candidate => candidate._id === claimedProject._id
				);
				if (existingIndex >= 0) {
					migrateCodeEditorViewStates(
						claimedProject._id,
						importedProject._id
					);
					projects.value.splice(existingIndex, 1, importedProject);
				} else if (
					!projects.value.some(
						candidate => candidate._id === importedProject._id
					)
				) {
					projects.value.unshift(importedProject);
				}
				if (selectedProjectID.value === claimedProject._id) {
					selectedProjectID.value = importedProject._id;
				}
				unsyncedProjectIDs.delete(claimedProject._id);
				unsyncedProjectIDs.delete(importedProject._id);
				claimedProjectHeldInOpenPage = false;
			}
			if (projectOwnerContextIsCurrent(ownerContext)) {
				await discardLocalProjectSnapshotIfSafe().catch(
					() => undefined
				);
				saveMessage.value = "Browser projects saved to this account";
			}
		});
	} catch {
		if (projectOwnerContextIsCurrent(ownerContext)) {
			anonymousImportError.value = claimedProjectHeldInOpenPage
				? "This project is only in this open page and is not in the account yet. Keep this page open and try again."
				: "Couldn’t start saving this browser project. It is still saved in this browser; try again.";
		}
	} finally {
		if (projectOwnerContextIsCurrent(ownerContext)) {
			isImportingAnonymousProjects.value = false;
		}
	}
}

function keepAnonymousProjectsSeparate() {
	pendingAnonymousProjects.value = [];
	anonymousImportError.value = "";
}

async function resetAnonymousWorkspaceForNextStudent({
	broadcast,
	persistBlank
}: {
	broadcast: boolean;
	persistBlank: boolean;
}) {
	// A cross-tab clear signal must never affect a signed-in student's
	// account-backed workspace.
	if (currentStudent.value || activeStorageOwnerID.value) return;
	if (isClearingAnonymousWorkspace.value) return;

	isClearingAnonymousWorkspace.value = true;
	anonymousWorkspaceClearError.value = "";
	hideWorkspaceForOwnerTransition(null);

	try {
		await projectOwnerSwitchQueue;
		await waitForOwnerBoundMutations();
		if (localSnapshotInFlight) await localSnapshotInFlight;
		if (saveInFlight) await saveInFlight;

		// A sign-in that completed while old local writes drained owns the page
		// now; leave its workspace to the normal owner-transition path.
		if (currentStudent.value || activeStorageOwnerID.value) return;

		await purgeAnonymousPythonWorkspace({ broadcast });
		pendingSaveProjectIDs.clear();
		unsyncedProjectIDs.clear();
		saveQueued = false;
		localSnapshotQueued = false;
		const blankProject = createPythonIdeProject(requestedStarterMode.value);
		setProjects([blankProject]);
		if (persistBlank) {
			await saveLocalPythonProjectsAsync([blankProject], null);
		}
		showAnonymousWorkspaceClearConfirmation.value = false;
		saveMessage.value = "Browser projects cleared for the next student";
		runMessage.value = "Ready";
		await nextTick();
		resetActiveCanvas();
	} catch (error) {
		projects.value = [];
		selectedProjectID.value = "";
		anonymousWorkspaceClearError.value =
			error instanceof Error
				? error.message
				: "Could not clear every browser project. Try again.";
		saveMessage.value = "Browser projects were not fully cleared";
	} finally {
		suppressAutoSave = false;
		isLoading.value = false;
		isClearingAnonymousWorkspace.value = false;
	}
}

function clearAnonymousWorkspaceForNextStudent() {
	return resetAnonymousWorkspaceForNextStudent({
		broadcast: true,
		persistBlank: true
	});
}

function handleAnonymousWorkspaceClearSignal(event: StorageEvent) {
	if (
		event.key !== pythonIdeAnonymousClearSignalStorageKey ||
		(event.storageArea && event.storageArea !== window.localStorage)
	) {
		return;
	}
	void resetAnonymousWorkspaceForNextStudent({
		broadcast: false,
		persistBlank: false
	});
}

function handleAnonymousWorkspacePageShow() {
	if (!anonymousPythonWorkspaceWasClearedSinceLoad()) return;
	void resetAnonymousWorkspaceForNextStudent({
		broadcast: false,
		persistBlank: false
	});
}

async function loadRemoteProjectBodiesNeededForRecovery(
	remoteProjects: PythonIdeProject[],
	localProjects: PythonIdeProject[],
	studentID: string,
	loadRunID: number
) {
	const localRemoteIDs = new Set(
		localProjects
			.filter(projectUsesStudentSync)
			.map(project => project._id)
			.filter(projectID => !projectID.startsWith("local-"))
	);
	const localImportIDs = new Set(
		localProjects
			.filter(projectUsesStudentSync)
			.map(project => project.importID)
			.filter((value): value is string => Boolean(value))
	);
	const hydrated: PythonIdeProject[] = [];

	for (const remoteProject of remoteProjects) {
		if (!projectUsesStudentSync(remoteProject)) {
			hydrated.push(remoteProject);
			continue;
		}
		if (
			remoteProject.remoteContentLoaded !== false ||
			(!localRemoteIDs.has(remoteProject._id) &&
				(!remoteProject.importID ||
					!localImportIDs.has(remoteProject.importID)))
		) {
			hydrated.push(remoteProject);
			continue;
		}
		const detail = await fetchPythonIdeProject(
			remoteProject._id,
			studentID
		);
		if (!projectLoadIsCurrent(loadRunID)) return remoteProjects;
		hydrated.push(detail);
	}

	return hydrated;
}

async function loadProjects() {
	if (activeStorageOwnerID.value !== desiredProjectOwnerID) return;
	const loadRunID = ++projectLoadRunID;
	isLoading.value = true;
	suppressAutoSave = true;
	pendingAnonymousProjects.value = [];
	anonymousImportError.value = "";
	loadPersistedCodeEditorViewStates(storageUserID.value);
	let browserOnlyProjects: PythonIdeProject[] = [];
	try {
		if (canSyncToAccount.value) {
			const studentID = activeStorageOwnerID.value;
			if (!studentID)
				throw new Error("Student project session is not ready.");
			const anonymousProjects = await loadLocalPythonProjectsAsync(null);
			if (!projectLoadIsCurrent(loadRunID)) return;
			browserOnlyProjects = anonymousProjects.filter(
				project => !projectUsesStudentSync(project)
			);
			pendingAnonymousProjects.value = anonymousProjects.filter(
				project =>
					projectUsesStudentSync(project) &&
					projectContainsSavedWork(project)
			);
			let remoteProjects = await fetchPythonIdeProjects(studentID);
			remoteProjects = remoteProjects.filter(projectUsesStudentSync);
			if (!projectLoadIsCurrent(loadRunID)) return;
			visibleProjectReviews.value =
				await fetchVisiblePythonIdeProjectReviews(studentID).catch(
					() => []
				);
			remoteReviewMetadata.clear();
			for (const review of visibleProjectReviews.value) {
				remoteReviewMetadata.set(
					review._id,
					reviewMetadataSnapshot(review)
				);
			}
			if (!projectLoadIsCurrent(loadRunID)) return;
			const localProjects =
				volatileStudentProjectRecovery.forStudent(studentID);
			if (!projectLoadIsCurrent(loadRunID)) return;
			if (localProjects.length) {
				remoteProjects = await loadRemoteProjectBodiesNeededForRecovery(
					remoteProjects,
					localProjects,
					studentID,
					loadRunID
				);
				if (!projectLoadIsCurrent(loadRunID)) return;
				const recoveryPlan = reconcilePythonIdeRecoveryProjects(
					localProjects,
					remoteProjects
				);
				try {
					const syncedProjects = await applyPythonIdeRecoveryPlan(
						recoveryPlan,
						studentID
					);
					if (!projectLoadIsCurrent(loadRunID)) return;
					setProjects([...syncedProjects, ...browserOnlyProjects]);
					volatileStudentProjectRecovery.acknowledge(studentID);
					await purgeAllStudentPythonProjectRecovery();
					if (!projectLoadIsCurrent(loadRunID)) return;
					await openRemoteRequestedProjectsForLoad(loadRunID);
					if (!projectLoadIsCurrent(loadRunID)) return;
					await hydrateRemoteSelection(
						selectedProjectID.value,
						studentID,
						loadRunID
					);
					if (!projectLoadIsCurrent(loadRunID)) return;
					saveMessage.value = "Synced recovered local edits";
					return;
				} catch (error) {
					if (!projectLoadIsCurrent(loadRunID)) return;
					setProjects([
						...recoveryPlan.projects,
						...browserOnlyProjects
					]);
					for (const write of recoveryPlan.writes) {
						pendingSaveProjectIDs.add(write.project._id);
						unsyncedProjectIDs.add(write.project._id);
					}
					refreshVolatileStudentProjectRecovery();
					appendOutput(
						"system",
						error instanceof Error
							? error.message
							: "Recovered local edits; account sync can be retried with Save."
					);
				}

				await openRemoteRequestedProjectsForLoad(loadRunID);
				if (!projectLoadIsCurrent(loadRunID)) return;
				await hydrateRemoteSelection(
					selectedProjectID.value,
					studentID,
					loadRunID
				);
				if (!projectLoadIsCurrent(loadRunID)) return;
				saveMessage.value = "Recovered local edits";
				return;
			}

			if (remoteProjects.length) {
				setProjects([...remoteProjects, ...browserOnlyProjects]);
				await openRemoteRequestedProjectsForLoad(loadRunID);
				if (!projectLoadIsCurrent(loadRunID)) return;
				await hydrateRemoteSelection(
					selectedProjectID.value,
					studentID,
					loadRunID
				);
				if (!projectLoadIsCurrent(loadRunID)) return;
				saveMessage.value = "Synced to account";
				return;
			}

			setProjects(browserOnlyProjects);
			const openedRouteProject =
				await openRemoteRequestedProjectsForLoad(loadRunID);
			if (!projectLoadIsCurrent(loadRunID)) return;
			if (openedRouteProject) return;
			if (browserOnlyProjects.length) {
				saveMessage.value = "Browser projects ready";
				return;
			}

			const initialProject = await createInitialProject();
			if (!projectLoadIsCurrent(loadRunID)) return;
			await saveNewProject(initialProject, false, loadRunID);
			if (!projectLoadIsCurrent(loadRunID)) return;
			saveMessage.value = "Synced to account";
			return;
		}

		visibleProjectReviews.value = [];
		const localProjects = await loadLocalPythonProjectsAsync(
			storageUserID.value
		);
		if (!projectLoadIsCurrent(loadRunID)) return;
		if (localProjects.length) {
			setProjects(localProjects);
			await openRemoteRequestedProjectsForLoad(loadRunID);
			if (!projectLoadIsCurrent(loadRunID)) return;
			await persistLocalProjects();
			return;
		}

		setProjects([]);
		const openedRouteProject =
			await openRemoteRequestedProjectsForLoad(loadRunID);
		if (!projectLoadIsCurrent(loadRunID)) return;
		if (openedRouteProject) return;

		const initialProject = await createInitialProject();
		if (!projectLoadIsCurrent(loadRunID)) return;
		await saveNewProject(initialProject, false, loadRunID);
	} catch (error) {
		const studentID = activeStorageOwnerID.value;
		if (studentID) {
			const volatileProjects =
				volatileStudentProjectRecovery.forStudent(studentID);
			if (!projectLoadIsCurrent(loadRunID)) return;
			setProjects([...volatileProjects, ...browserOnlyProjects]);
			if (!projects.value.length) {
				setProjects([await createInitialProject()]);
			}
			if (!projectLoadIsCurrent(loadRunID)) return;
			await openLocalRequestedProjectsForLoad(loadRunID);
			if (!projectLoadIsCurrent(loadRunID)) return;
			for (const project of projects.value.filter(
				projectUsesStudentSync
			)) {
				pendingSaveProjectIDs.add(project._id);
				unsyncedProjectIDs.add(project._id);
			}
			refreshVolatileStudentProjectRecovery();
		} else {
			const localProjects = await loadLocalPythonProjectsAsync(null);
			if (!projectLoadIsCurrent(loadRunID)) return;
			setProjects(
				localProjects.length
					? localProjects
					: [await createInitialProject()]
			);
			if (!projectLoadIsCurrent(loadRunID)) return;
			await openLocalRequestedProjectsForLoad(loadRunID);
			if (!projectLoadIsCurrent(loadRunID)) return;
		}
		saveMessage.value =
			error instanceof Error ? error.message : "Using live workspace";
		visibleProjectReviews.value = [];
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
	if (project.remoteContentLoaded === false) return true;

	const startedProjectID = project._id;
	const startedUpdatedAt = project.updatedAt ?? "";
	const startedOwnerID = activeStorageOwnerID.value;
	const startedWorkspaceSnapshot = plainPythonIdeProjectsSnapshot(
		projects.value
	);
	if (!projectUsesStudentSync(project)) {
		await persistLocalProjects({
			message: "Saved in this browser",
			quiet: false
		});
		pendingSaveProjectIDs.delete(startedProjectID);
		unsyncedProjectIDs.delete(startedProjectID);
		return true;
	}
	const payload = pythonIdeProjectToPayload(project);

	try {
		if (!canSyncToAccount.value) {
			await persistLocalProjects();
			return true;
		}

		const studentID = startedOwnerID;
		if (!studentID)
			throw new Error("Student project session is not ready.");
		const expectedUpdatedAt = project.serverUpdatedAt;
		if (!startedProjectID.startsWith("local-") && !expectedUpdatedAt) {
			throw new Error(
				"Could not verify the latest server project version. Reload before saving."
			);
		}
		await persistLocalProjects({ quiet: true });
		const savedProject = startedProjectID.startsWith("local-")
			? await createRemotePythonIdeProject(payload, studentID, {
					importID: pythonIdeImportID(project),
					localUpdatedAt: project.updatedAt
				})
			: await updateRemotePythonIdeProject(
					startedProjectID,
					payload,
					studentID,
					{ expectedUpdatedAt: expectedUpdatedAt! }
				);
		const currentIndex = projects.value.findIndex(
			candidate => candidate._id === startedProjectID
		);
		const currentProject =
			currentIndex >= 0 ? projects.value[currentIndex] : null;
		if (!currentProject) return true;
		remoteProjectMetadata.set(
			savedProject._id,
			projectMetadataSnapshot(savedProject)
		);

		const projectChangedDuringSave =
			currentProject.updatedAt !== startedUpdatedAt;

		if (projectChangedDuringSave) {
			currentProject.serverUpdatedAt =
				savedProject.serverUpdatedAt ?? savedProject.updatedAt;
			currentProject.remoteContentLoaded = true;
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
			markRemoteProjectDetailUsed(savedProject._id);
			trimRemoteProjectDetailCache(savedProject._id);
			await persistLocalProjects({ quiet: true });
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
		markRemoteProjectDetailUsed(savedProject._id);
		trimRemoteProjectDetailCache(savedProject._id);
		unsyncedProjectIDs.delete(startedProjectID);
		unsyncedProjectIDs.delete(savedProject._id);
		return true;
	} catch (error) {
		unsyncedProjectIDs.add(startedProjectID);
		if (
			startedOwnerID &&
			activeStorageOwnerID.value === startedOwnerID &&
			desiredProjectOwnerID === startedOwnerID
		) {
			volatileStudentProjectRecovery.replace(
				startedOwnerID,
				projects.value.filter(
					project =>
						projectUsesStudentSync(project) &&
						project.remoteContentLoaded !== false
				)
			);
		} else if (startedOwnerID) {
			volatileStudentProjectRecovery.discard(startedOwnerID);
		} else {
			await saveLocalPythonProjectsAsync(startedWorkspaceSnapshot, null);
		}
		saveMessage.value = startedOwnerID
			? "Waiting to sync to account"
			: "Saved locally after sync issue";
		appendOutput(
			"system",
			error instanceof Error
				? error.message
				: "Save failed; kept this workspace open for retry."
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
			saveMessage.value =
				selectedProject.value &&
				!projectUsesStudentSync(selectedProject.value)
					? "Saved in this browser"
					: "Synced to account";
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
	preparedOwnerExitID = null;
	const projectID = selectedProject.value?._id;
	if (!projectID) return;
	pendingSaveProjectIDs.add(projectID);
	refreshVolatileStudentProjectRecovery();

	if (!autoSaveEnabled.value) {
		if (saveTimer) window.clearTimeout(saveTimer);
		saveTimer = null;
		cancelLocalProjectSnapshot();
		saveMessage.value = "Autosave off";
		return;
	}

	scheduleLocalProjectSnapshot();
	saveMessage.value =
		canSyncToAccount.value &&
		selectedProject.value &&
		projectUsesStudentSync(selectedProject.value)
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

function updateCodeRecommendationsPreference(event: Event) {
	const enabled = (event.target as HTMLInputElement).checked;
	codeRecommendationsEnabled.value = enabled;
	persistPythonIdeCodeRecommendationsPreference(enabled);
	useFreshCodeEditorStateOnNextReset = true;
	void nextTick(resetCodeEditor);
}

function updateEditorLineWrapPreference(event: Event) {
	const enabled = (event.target as HTMLInputElement).checked;
	editorLineWrapEnabled.value = enabled;
	persistPythonIdeEditorLineWrapPreference(enabled);
	useFreshCodeEditorStateOnNextReset = true;
	void nextTick(resetCodeEditor);
}

function updateExpandedIdePreference(event: Event) {
	const enabled = (event.target as HTMLInputElement).checked;
	ideExpanded.value = enabled;
	persistPythonIdeExpandedWorkspacePreference(enabled);
	void nextTick(refreshResizableIdeLayout);
}

function handleIdeSettingsOutsidePointerDown(event: PointerEvent) {
	if (!showIdeSettings.value) return;

	const target = event.target;
	if (target instanceof Node && ideSettingsRef.value?.contains(target)) {
		return;
	}

	showIdeSettings.value = false;
}

function clampIdeSplitPercent(value: number) {
	return Math.min(maxCodeSplitPercent, Math.max(minCodeSplitPercent, value));
}

function refreshResizableIdeLayout() {
	codeEditorView?.requestMeasure();
	redrawActiveCanvas();
}

function setIdeSplitPercent(value: number) {
	ideSplitPercent.value = clampIdeSplitPercent(value);
	persistPythonIdeSplitPercentPreference(ideSplitPercent.value);
	void nextTick(refreshResizableIdeLayout);
}

function updateIdeSplitFromClientX(clientX: number) {
	const grid = ideGridRef.value;
	if (!grid) return;
	const rect = grid.getBoundingClientRect();
	if (!rect.width) return;
	setIdeSplitPercent(((clientX - rect.left) / rect.width) * 100);
}

function startIdeSplitResize(event: PointerEvent) {
	if (!ideGridRef.value) return;
	event.preventDefault();
	ideSplitPointerID = event.pointerId;
	isResizingIdeSplit.value = true;
	(event.currentTarget as HTMLElement).setPointerCapture?.(event.pointerId);
	updateIdeSplitFromClientX(event.clientX);
	window.addEventListener("pointermove", handleIdeSplitPointerMove);
	window.addEventListener("pointerup", stopIdeSplitResize);
	window.addEventListener("pointercancel", stopIdeSplitResize);
}

function handleIdeSplitPointerMove(event: PointerEvent) {
	if (
		!isResizingIdeSplit.value ||
		(ideSplitPointerID !== null && event.pointerId !== ideSplitPointerID)
	) {
		return;
	}
	updateIdeSplitFromClientX(event.clientX);
}

function stopIdeSplitResize() {
	if (!isResizingIdeSplit.value) return;
	isResizingIdeSplit.value = false;
	ideSplitPointerID = null;
	window.removeEventListener("pointermove", handleIdeSplitPointerMove);
	window.removeEventListener("pointerup", stopIdeSplitResize);
	window.removeEventListener("pointercancel", stopIdeSplitResize);
	void nextTick(refreshResizableIdeLayout);
}

function handleIdeSplitKeydown(event: KeyboardEvent) {
	const wideStep = event.shiftKey ? 8 : 3;
	if (event.key === "ArrowLeft") {
		event.preventDefault();
		setIdeSplitPercent(activeIdeSplitPercent.value - wideStep);
	}
	if (event.key === "ArrowRight") {
		event.preventDefault();
		setIdeSplitPercent(activeIdeSplitPercent.value + wideStep);
	}
	if (event.key === "Home") {
		event.preventDefault();
		setIdeSplitPercent(minCodeSplitPercent);
	}
	if (event.key === "End") {
		event.preventDefault();
		setIdeSplitPercent(maxCodeSplitPercent);
	}
}

async function createProject(
	mode: PythonIdeMode,
	template: PythonIdeProjectTemplate = "blank"
) {
	const starter = createPythonIdeProject(mode, { template });
	const ownerContext = captureProjectOwnerContext();
	suppressAutoSave = true;
	try {
		await saveNewProject(starter, false, undefined, ownerContext);
	} catch (error) {
		if (!projectOwnerContextIsCurrent(ownerContext)) return;
		projects.value.unshift(starter);
		selectedProjectID.value = starter._id;
		if (ownerContext.ownerID && projectUsesStudentSync(starter)) {
			unsyncedProjectIDs.add(starter._id);
			refreshVolatileStudentProjectRecovery();
		} else {
			await saveLocalPythonProjectsAsync(
				browserProjectPersistenceSnapshot(),
				null
			);
		}
		if (!projectOwnerContextIsCurrent(ownerContext)) return;
		appendOutput(
			"system",
			error instanceof Error ? error.message : "Project created locally."
		);
	} finally {
		if (projectOwnerContextIsCurrent(ownerContext)) {
			suppressAutoSave = false;
			await nextTick();
			resetActiveCanvas();
		}
	}
}

async function createSelectedWorkspaceProject() {
	const preset = codeIdeWorkspacePresets.find(
		candidate => candidate.id === newWorkspacePresetID.value
	);
	if (!preset) return;
	await createProject(preset.mode, preset.template);
}

async function createProjectFromMenu(
	mode: PythonIdeMode,
	template: PythonIdeProjectTemplate = "blank"
) {
	showProjectMenu.value = false;
	await createProject(mode, template);
}

function openBlueJArchiveImporterFromMenu() {
	showProjectMenu.value = false;
	openBlueJArchiveImporter();
}

function bytesToArrayBuffer(bytes: Uint8Array) {
	const copy = new Uint8Array(bytes.byteLength);
	copy.set(bytes);
	return copy.buffer;
}

function downloadZipArchive(archiveBytes: Uint8Array, archiveName: string) {
	const archiveUrl = URL.createObjectURL(
		new Blob([bytesToArrayBuffer(archiveBytes)], {
			type: "application/zip"
		})
	);
	const link = document.createElement("a");
	link.href = archiveUrl;
	link.download = archiveName;
	link.rel = "noopener";
	document.body.append(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(archiveUrl), 1000);
}

async function downloadSelectedProject() {
	const project = selectedProject.value;
	if (!project || isDownloading.value) return;

	isDownloading.value = true;
	try {
		const { createProjectArchive, projectArchiveName } =
			await import("@/modules/projectArchive");
		const archiveBytes = createProjectArchive(project);
		const archiveName = projectArchiveName(project);
		downloadZipArchive(archiveBytes, archiveName);
		appendOutput(
			"system",
			`Downloaded ${archiveName} with ${project.files.length} file${project.files.length === 1 ? "" : "s"}.`
		);
	} catch (error) {
		appendOutput(
			"stderr",
			error instanceof Error
				? error.message
				: "Could not download the project."
		);
	} finally {
		isDownloading.value = false;
	}
}

async function downloadSelectedProjectForBlueJ() {
	const project = selectedProject.value;
	if (!project) return;
	if (project.mode !== "java") {
		appendOutput("system", "BlueJ export is available for Java projects.");
		return;
	}

	try {
		const { blueJProjectArchiveName, createBlueJProjectArchive } =
			await import("@/modules/blueJProjectExport");
		const archiveBytes = createBlueJProjectArchive(project);
		downloadZipArchive(archiveBytes, blueJProjectArchiveName(project));
		appendOutput(
			"system",
			"Downloaded a BlueJ project ZIP for this Java project."
		);
	} catch (error) {
		appendOutput(
			"stderr",
			error instanceof Error
				? error.message
				: "Could not download the BlueJ project."
		);
	}
}

function openBlueJArchiveImporter() {
	blueJArchiveInputRef.value?.click();
}

async function importBlueJProjectArchiveFromInput(event: Event) {
	const input = event.target as HTMLInputElement;
	const file = input.files?.[0];
	input.value = "";
	if (!file) return;

	if (!/\.zip$/i.test(file.name)) {
		appendOutput("stderr", "Choose a BlueJ project ZIP file.");
		return;
	}
	if (file.size > maxImportedBlueJArchiveBytes) {
		appendOutput(
			"stderr",
			`BlueJ ZIP is larger than ${formatFileSize(maxImportedBlueJArchiveBytes)}.`
		);
		return;
	}

	try {
		const { blueJProjectTitleFromArchiveName, importBlueJProjectArchive } =
			await import("@/modules/blueJProjectExport");
		const result = importBlueJProjectArchive(
			new Uint8Array(await file.arrayBuffer()),
			{
				maxArchiveBytes: maxImportedBlueJArchiveBytes,
				maxFiles: maxPythonIdeProjectFiles,
				maxTextFileBytes: maxImportedTextFileBytes
			}
		);
		if (
			!result.files.some(projectFile =>
				isPythonIdeJavaFile(projectFile.name)
			)
		) {
			throw new Error(
				"No safe Java source files were found in that BlueJ ZIP."
			);
		}

		const importedProject = createPythonIdeProject("java", {
			courseProjectTitle: "Imported BlueJ Project",
			files: result.files,
			starterLabel: result.hasBlueJPackage
				? "Imported BlueJ ZIP"
				: "Imported Java ZIP",
			title: blueJProjectTitleFromArchiveName(file.name)
		});

		suppressAutoSave = true;
		try {
			await saveNewProject(importedProject);
		} catch (error) {
			projects.value.unshift(importedProject);
			selectedProjectID.value = importedProject._id;
			await persistLocalProjects();
			appendOutput(
				"system",
				error instanceof Error
					? error.message
					: "Imported BlueJ project saved locally."
			);
		} finally {
			suppressAutoSave = false;
			await nextTick();
			resetActiveCanvas();
		}

		appendOutput(
			"system",
			`Imported ${result.files.length} file${result.files.length === 1 ? "" : "s"} from ${result.hasBlueJPackage ? "a BlueJ project ZIP" : "a Java ZIP"}.`
		);
		if (result.skippedFiles.length) {
			appendOutput(
				"stderr",
				`Skipped unsupported BlueJ archive file${result.skippedFiles.length === 1 ? "" : "s"}: ${result.skippedFiles.join(", ")}.`
			);
		}
	} catch (error) {
		appendOutput(
			"stderr",
			error instanceof Error
				? error.message
				: "Could not import the BlueJ project ZIP."
		);
	}
}

function projectLabel(project: PythonIdeProjectListItem) {
	return project.title || "Untitled Project";
}

function requestProjectDelete(project: PythonIdeProjectListItem) {
	if (sortedProjects.value.length <= 1) {
		appendOutput("system", "Keep at least one project in the workspace.");
		return;
	}
	deleteCandidateProjectID.value = project._id;
	deleteConfirmText.value = "";
}

function cancelProjectDelete() {
	deleteCandidateProjectID.value = "";
	deleteConfirmText.value = "";
}

async function confirmProjectDelete(project: PythonIdeProjectListItem) {
	if (deleteConfirmText.value.trim().toLowerCase() !== "confirm") return;
	const ownerContext = captureProjectOwnerContext();
	await deleteProject(project);
	if (projectOwnerContextIsCurrent(ownerContext)) cancelProjectDelete();
}

async function deleteProject(project: PythonIdeProjectListItem) {
	if (sortedProjects.value.length <= 1) {
		appendOutput("system", "Keep at least one project in the workspace.");
		return;
	}

	const ownerContext = captureProjectOwnerContext();
	try {
		await runOwnerBoundMutation(async () => {
			if (!projectOwnerContextIsCurrent(ownerContext)) return;
			const isRemoteProject =
				!!ownerContext.ownerID &&
				projectUsesStudentSync(project) &&
				!project._id.startsWith("local-");
			if (isRemoteProject) {
				const expectedUpdatedAt =
					project.serverUpdatedAt ?? project.updatedAt;
				if (!expectedUpdatedAt) {
					throw new Error(
						"Could not verify the latest server project version. Reload before deleting."
					);
				}
				await deleteRemotePythonIdeProject(
					project._id,
					ownerContext.ownerID!,
					{ expectedUpdatedAt }
				);
				if (!projectOwnerContextIsCurrent(ownerContext)) return;
			}

			projects.value = projects.value.filter(
				candidate => candidate._id !== project._id
			);
			pendingSaveProjectIDs.delete(project._id);
			unsyncedProjectIDs.delete(project._id);
			refreshVolatileStudentProjectRecovery();
			deleteCodeEditorStateForProject(project._id);
			selectedProjectID.value = projects.value[0]?._id ?? "";
			if (isRemoteProject) {
				await discardLocalProjectSnapshotIfSafe();
				if (!projectOwnerContextIsCurrent(ownerContext)) return;
				saveMessage.value = "Synced to account";
			} else {
				await saveLocalPythonProjectsAsync(
					browserProjectPersistenceSnapshot(),
					null
				);
				if (!projectOwnerContextIsCurrent(ownerContext)) return;
				saveMessage.value = ownerContext.ownerID
					? "Saved in this browser"
					: "Saved locally";
			}
		});
	} catch (error) {
		if (!projectOwnerContextIsCurrent(ownerContext)) return;
		appendOutput(
			"stderr",
			error instanceof Error ? error.message : "Could not delete project."
		);
	}
}

function updateProjectTitle(event: Event) {
	if (!selectedProject.value || !selectedProjectContentLoaded.value) return;
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
		!useFreshCodeEditorStateOnNextReset &&
		savedState?.doc.toString() === activeFileContent.value
			? savedState
			: null;
	useFreshCodeEditorStateOnNextReset = false;
	const extensions = createPythonCodeMirrorExtensions({
		assetCompletions: loadPythonCodeMirrorAssetCompletions,
		lineWrappingEnabled: editorLineWrapEnabled.value,
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
		},
		recommendationsEnabled: codeRecommendationsEnabled.value
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
	codeEditorView.scrollDOM.tabIndex = 0;
	codeEditorView.scrollDOM.setAttribute(
		"aria-label",
		"Code editor scrolling region"
	);
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
	if (!selectedProject.value || !selectedProjectContentLoaded.value) return;
	selectedProject.value.activeFileName = fileName;
	editorCursorCount.value = 1;
	touchSelectedProject();
	scheduleSave();
}

function addFile() {
	if (!selectedProject.value || !selectedProjectContentLoaded.value) return;
	const fileName = normalizePythonFileName(
		newFileName.value,
		isJavaIdeMode(selectedProject.value.mode) ? ".java" : ".py"
	);
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
	if (!project || !selectedProjectContentLoaded.value || !files.length)
		return;

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
	if (!project || !selectedProjectContentLoaded.value) return;
	const runnableFileCount = project.files.filter(candidate =>
		isPythonIdeRunnableFile(candidate.name, project.mode)
	).length;
	if (
		isPythonIdeRunnableFile(file.name, project.mode) &&
		runnableFileCount <= 1
	) {
		appendOutput(
			"system",
			`Keep at least one ${isJavaIdeMode(project.mode) ? "Java" : "Python"} file so the project can run.`
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
	if (!project || !selectedProjectContentLoaded.value) return false;
	if (project.files.length <= 1) return false;
	const runnableFileCount = project.files.filter(candidate =>
		isPythonIdeRunnableFile(candidate.name, project.mode)
	).length;
	return !(
		isPythonIdeRunnableFile(file.name, project.mode) &&
		runnableFileCount <= 1
	);
}

function clearOutput() {
	clearKarelWorldPlayback();
	outputLines.value = [];
	runtimeArtifacts.value = [];
	karelWorld.value = null;
	gameAudioPlaybackBlockedNoticeShown = false;
	resetActiveCanvas();
}

function refreshActiveTurtleEventHandlerCount() {
	activeTurtleEventHandlerCount.value =
		turtleKeyPressHandlers.size +
		turtleKeyReleaseHandlers.size +
		turtleClickHandlers.size +
		turtleReleaseHandlers.size +
		turtleDragHandlers.size +
		turtleObjectClickHandlers.size +
		turtleObjectReleaseHandlers.size +
		turtleObjectDragHandlers.size;
}

function createCanvasCoordinateMapper(rect: DOMRect): CanvasCoordinateMapper {
	if (turtleWorldCoordinates) {
		const [left, bottom, right, top] = turtleWorldCoordinates;
		const width = right - left;
		const height = top - bottom;
		return (x: number, y: number) => ({
			x: ((x - left) / width) * rect.width,
			y: rect.height - ((y - bottom) / height) * rect.height
		});
	}

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
		fillColor: turtleState.fillColor,
		shape: turtleState.shape,
		speed: turtleState.speed,
		stretchLength: turtleState.stretchLength,
		stretchWidth: turtleState.stretchWidth,
		outlineWidth: turtleState.outlineWidth,
		shearFactor: turtleState.shearFactor,
		shapeTransform: [...turtleState.shapeTransform],
		tilt: turtleState.tilt,
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
		fromPose.fillColor !== toPose.fillColor ||
		fromPose.shape !== toPose.shape ||
		fromPose.stretchLength !== toPose.stretchLength ||
		fromPose.stretchWidth !== toPose.stretchWidth ||
		fromPose.outlineWidth !== toPose.outlineWidth ||
		fromPose.shearFactor !== toPose.shearFactor ||
		fromPose.shapeTransform.some(
			(value, index) => value !== toPose.shapeTransform[index]
		) ||
		fromPose.tilt !== toPose.tilt ||
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
		fillColor: progress < 1 ? fromPose.fillColor : toPose.fillColor,
		shape: progress < 1 ? fromPose.shape : toPose.shape,
		speed: progress < 1 ? fromPose.speed : toPose.speed,
		stretchLength: lerp(
			fromPose.stretchLength,
			toPose.stretchLength,
			progress
		),
		stretchWidth: lerp(
			fromPose.stretchWidth,
			toPose.stretchWidth,
			progress
		),
		outlineWidth: lerp(
			fromPose.outlineWidth,
			toPose.outlineWidth,
			progress
		),
		shearFactor: lerp(fromPose.shearFactor, toPose.shearFactor, progress),
		shapeTransform: fromPose.shapeTransform.map((value, index) =>
			lerp(value, toPose.shapeTransform[index] ?? value, progress)
		) as [number, number, number, number],
		tilt: lerp(fromPose.tilt, toPose.tilt, progress),
		visible: progress < 1 ? fromPose.visible : toPose.visible
	};
}

function turtleMovementDuration(fromPose: TurtlePose, toPose: TurtlePose) {
	if (!turtleTracerEnabled || fromPose.speed === 0) return 0;

	const speedScale = turtleAnimationSpeedScale(fromPose.speed);
	const delayScale = Math.max(0, turtleScreenDelayMs) / 10;
	if (delayScale === 0) return 0;
	const distance = Math.hypot(toPose.x - fromPose.x, toPose.y - fromPose.y);
	const headingDelta = Math.abs(toPose.heading - fromPose.heading);
	if (distance > 0) {
		return Math.min(
			900,
			Math.max(
				1,
				distance *
					turtleDistanceDurationMsPerPixelAtDefaultSpeed *
					speedScale *
					delayScale
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
	return supportedTurtleShapes.has(shape as BuiltinTurtleShapeName) ||
		turtleRegisteredShapes.has(shape)
		? shape
		: defaultTurtleShape;
}

function drawTurtleMarker(
	context: CanvasRenderingContext2D,
	pose: TurtlePose,
	toCanvas: CanvasCoordinateMapper
) {
	if (!pose.visible) return;

	const point = toCanvas(pose.x, pose.y);
	const customShape = turtleRegisteredShapes.get(pose.shape);
	if (customShape?.kind === "image") {
		const asset = resolveGameAsset(
			"images",
			customShape.name,
			imageAssetExtensions
		);
		const image = asset ? getGameImageEntry(asset) : null;
		if (image?.loaded && !image.failed) {
			const width = image.element.naturalWidth * pose.stretchLength;
			const height = image.element.naturalHeight * pose.stretchWidth;
			context.drawImage(
				image.element,
				point.x - width / 2,
				point.y - height / 2,
				width,
				height
			);
		} else if (image && !image.failed) {
			image.element.addEventListener("load", () => renderTurtleScene(), {
				once: true
			});
		}
		return;
	}

	const radians = (pose.heading * Math.PI) / 180;

	context.save();
	context.translate(point.x, point.y);
	context.rotate(-radians);
	context.rotate((-pose.tilt * Math.PI) / 180);
	const [t11, t12, t21, t22] = pose.shapeTransform;
	context.transform(t22, t12, t21, t11, 0, 0);
	context.transform(1, 0, pose.shearFactor, 1, 0, 0);
	context.scale(pose.stretchLength, pose.stretchWidth);
	context.lineCap = "round";
	context.lineJoin = "round";
	context.lineWidth = Math.max(0.5, pose.outlineWidth);
	context.strokeStyle = pose.penColor;
	context.fillStyle = pose.fillColor;

	if (customShape) {
		drawCustomTurtleShape(context, customShape, pose);
		context.restore();
		return;
	}

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

function drawCustomTurtleShape(
	context: CanvasRenderingContext2D,
	shape: Exclude<TurtleShapeDefinition, { kind: "image" }>,
	pose: TurtlePose
) {
	const components: TurtleShapeComponent[] =
		shape.kind === "polygon"
			? [
					{
						fill: pose.fillColor,
						outline: pose.penColor,
						points: shape.points
					}
				]
			: shape.components;

	for (const component of components) {
		const [firstPoint, ...remainingPoints] = component.points;
		if (!firstPoint) continue;
		context.beginPath();
		context.moveTo(firstPoint[1], firstPoint[0]);
		for (const [x, y] of remainingPoints) context.lineTo(y, x);
		context.closePath();
		context.fillStyle = component.fill;
		context.strokeStyle = component.outline;
		context.fill();
		context.stroke();
	}
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
		drawTurtleMarker(context, command.pose, toCanvas);
		return;
	}

	const point = toCanvas(command.x, command.y);
	context.fillStyle = command.color;
	context.font = command.font;
	context.textAlign = command.align;
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
	if (turtleBackgroundImage?.loaded && !turtleBackgroundImage.failed) {
		context.drawImage(
			turtleBackgroundImage.element,
			0,
			0,
			rect.width,
			rect.height
		);
	}
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
		!isVisibleTurtleTrailStep(step) &&
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

function flushTurtleAnimation() {
	if (turtleAnimationFrame !== null) {
		cancelAnimationFrame(turtleAnimationFrame);
		turtleAnimationFrame = null;
	}
	const pendingSteps = [
		...(activeTurtleAnimationStep ? [activeTurtleAnimationStep] : []),
		...turtleQueuedSteps
	];
	activeTurtleAnimationStep = null;
	turtleAnimationStepStartedAt = 0;
	turtleQueuedSteps = [];
	for (const step of pendingSteps) completeTurtleAnimationStep(step);
	renderTurtleScene();
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
	if (step.durationMs <= 0) return true;

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
		shouldFastForwardTurtleBacklog(activeTurtleAnimationStep) &&
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
	turtleState.lineWidth = Math.max(0.1, lineWidth);
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
	turtleKeyPressHandlers.clear();
	turtleKeyReleaseHandlers.clear();
	turtleClickHandlers.clear();
	turtleReleaseHandlers.clear();
	turtleDragHandlers.clear();
	turtleObjectClickHandlers.clear();
	turtleObjectReleaseHandlers.clear();
	turtleObjectDragHandlers.clear();
	refreshActiveTurtleEventHandlerCount();
	activeTurtleDragButton = null;
	turtleStampCounter = 0;
	turtleCompletedCommands = [];
	turtleQueuedSteps = [];
	turtleCanvasWidth.value = 640;
	turtleCanvasHeight.value = 480;
	turtleWorldCoordinates = null;
	turtleBackgroundImage = null;
	turtleRegisteredShapes.clear();
	activeTurtleID = defaultTurtleID;
	turtleTracerEnabled = true;
	turtleScreenDelayMs = 10;
	turtleState = createDefaultTurtleState();
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

function teleportTurtle(x: number, y: number, fillGap = false) {
	const fromPose = currentTurtlePose();
	const wasFilling = turtleFillState.active;
	if (wasFilling && !fillGap) endTurtleFill();

	turtleState.x = x;
	turtleState.y = y;
	if (wasFilling && fillGap) trackTurtleFillPoint(x, y);

	const toPose = currentTurtlePose();
	queueTurtleStep({
		durationMs: 0,
		fromPose,
		toPose
	});

	if (wasFilling && !fillGap) beginTurtleFill();
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
	const stampID = ++turtleStampCounter;
	queueTurtleStep({
		command: {
			kind: "stamp",
			pose: {
				...pose,
				shapeTransform: [...pose.shapeTransform],
				speed: 0
			},
			stampID
		},
		durationMs: 90,
		fromPose: pose,
		toPose: pose
	});

	return stampID;
}

function removeTurtleStampCommands(stampID: number) {
	const commandMatchesStamp = (command: TurtleRenderCommand) =>
		command.kind === "stamp" && command.stampID === stampID;
	let removed = false;
	const completedCount = turtleCompletedCommands.length;
	turtleCompletedCommands = turtleCompletedCommands.filter(
		completed => !commandMatchesStamp(completed.command)
	);
	removed ||= completedCount !== turtleCompletedCommands.length;
	const queuedCount = turtleQueuedSteps.length;
	turtleQueuedSteps = turtleQueuedSteps.filter(
		step => !step.command || !commandMatchesStamp(step.command)
	);
	removed ||= queuedCount !== turtleQueuedSteps.length;
	if (
		activeTurtleAnimationStep?.command &&
		commandMatchesStamp(activeTurtleAnimationStep.command)
	) {
		activeTurtleAnimationStep = null;
		turtleAnimationStepStartedAt = 0;
		removed = true;
	}
	return removed;
}

function clearTurtleStamp(stampID: number) {
	if (!removeTurtleStampCommands(stampID)) return;
	renderTurtleScene();
	if (activeTurtleAnimationStep || turtleQueuedSteps.length > 0)
		void scheduleTurtleAnimation();
}

function turtleTextFont(fontName: string, fontSize: number, fontStyle: string) {
	const normalizedStyle = fontStyle.toLowerCase();
	const weight = normalizedStyle.includes("bold") ? "bold" : "normal";
	const style = normalizedStyle.includes("italic") ? "italic" : "normal";
	const family = fontName.trim() || "Arial";
	return `${style} ${weight} ${Math.max(1, fontSize)}px ${JSON.stringify(family)}`;
}

function drawText(
	text: string,
	align = "left",
	fontName = "Arial",
	fontSize = 8,
	fontStyle = "normal"
) {
	const pose = currentTurtlePose();
	const font = turtleTextFont(fontName, fontSize, fontStyle);
	const canvasTextAlign: CanvasTextAlign =
		align === "center" ? "center" : align === "right" ? "right" : "left";
	const context = getCanvasContext();
	if (context) context.font = font;
	const width =
		context?.measureText(text).width ?? text.length * fontSize * 0.6;
	queueTurtleStep({
		command: {
			align: canvasTextAlign,
			color: turtleState.penColor,
			font,
			kind: "text",
			text,
			x: turtleState.x,
			y: turtleState.y
		},
		durationMs: 90,
		fromPose: pose,
		toPose: pose
	});
	return width;
}

function setTurtleScreenSize(width: number, height: number) {
	if (Number.isFinite(width) && width > 0)
		turtleCanvasWidth.value = Math.max(1, Math.round(width));
	if (Number.isFinite(height) && height > 0)
		turtleCanvasHeight.value = Math.max(1, Math.round(height));
	void nextTick(renderTurtleScene);
}

function setTurtleWorldCoordinates(
	left: number,
	bottom: number,
	right: number,
	top: number
) {
	if (![left, bottom, right, top].every(Number.isFinite)) return;
	if (right === left || top === bottom) return;
	turtleWorldCoordinates = [left, bottom, right, top];
	renderTurtleScene();
}

function resetTurtleWorldCoordinates() {
	turtleWorldCoordinates = null;
	renderTurtleScene();
}

function setTurtleBackgroundImage(name: string) {
	const normalizedName = name.trim();
	if (!normalizedName || normalizedName.toLowerCase() === "nopic") {
		turtleBackgroundImage = null;
		renderTurtleScene();
		return;
	}

	const asset = resolveGameAsset(
		"images",
		normalizedName,
		imageAssetExtensions
	);
	if (!asset) {
		turtleBackgroundImage = null;
		appendOutput(
			"system",
			`Missing Turtle background image: ${normalizedName}`
		);
		renderTurtleScene();
		return;
	}

	turtleBackgroundImage = getGameImageEntry(asset);
	if (!turtleBackgroundImage) return;
	if (turtleBackgroundImage.loaded) {
		renderTurtleScene();
		return;
	}
	turtleBackgroundImage.element.addEventListener(
		"load",
		() => renderTurtleScene(),
		{ once: true }
	);
}

function registerTurtleShape(name: string, definitionJson: string) {
	try {
		const definition = JSON.parse(definitionJson) as TurtleShapeDefinition;
		if (
			definition.kind !== "compound" &&
			definition.kind !== "image" &&
			definition.kind !== "polygon"
		) {
			return;
		}
		turtleRegisteredShapes.set(name, definition);
	} catch {
		appendOutput("stderr", `Could not register Turtle shape: ${name}`);
	}
}

function setTurtleShapeTransform(
	stretchWidth: number,
	stretchLength: number,
	outlineWidth: number,
	shearFactor: number,
	tilt: number,
	t11: number,
	t12: number,
	t21: number,
	t22: number
) {
	const fromPose = currentTurtlePose();
	turtleState.stretchWidth = stretchWidth;
	turtleState.stretchLength = stretchLength;
	turtleState.outlineWidth = outlineWidth;
	turtleState.shearFactor = shearFactor;
	turtleState.tilt = tilt;
	turtleState.shapeTransform = [t11, t12, t21, t22];
	const toPose = currentTurtlePose();
	if (!turtlePoseChanged(fromPose, toPose)) return;
	queueTurtleStep({
		durationMs: turtleInstantStepMaxDurationMs,
		fromPose,
		toPose
	});
}

function undoTurtleDrawing(count = 1) {
	let remaining = Math.max(0, Math.trunc(count));
	for (
		let index = turtleQueuedSteps.length - 1;
		index >= 0 && remaining;
		index -= 1
	) {
		if (turtleQueuedSteps[index]?.turtleID !== activeTurtleID) continue;
		if (!turtleQueuedSteps[index]?.command) continue;
		turtleQueuedSteps.splice(index, 1);
		remaining -= 1;
	}

	for (
		let index = turtleCompletedCommands.length - 1;
		index >= 0 && remaining;
		index -= 1
	) {
		if (turtleCompletedCommands[index]?.turtleID !== activeTurtleID)
			continue;
		turtleCompletedCommands.splice(index, 1);
		remaining -= 1;
	}
	renderTurtleScene();
}

function turtlePostScriptColor(color: string) {
	const context = getCanvasContext();
	if (!context) return [0, 0, 0] as const;
	context.fillStyle = "#000000";
	context.fillStyle = color;
	const normalized = context.fillStyle;
	const match = normalized.match(/^#([\dA-F]{2})([\dA-F]{2})([\dA-F]{2})$/i);
	if (!match) return [0, 0, 0] as const;
	return [
		Number.parseInt(match[1] ?? "0", 16) / 255,
		Number.parseInt(match[2] ?? "0", 16) / 255,
		Number.parseInt(match[3] ?? "0", 16) / 255
	] as const;
}

function turtlePostScriptPoint(x: number, y: number) {
	if (turtleWorldCoordinates) {
		const [left, bottom, right, top] = turtleWorldCoordinates;
		return {
			x: ((x - left) / (right - left)) * turtleCanvasWidth.value,
			y: ((y - bottom) / (top - bottom)) * turtleCanvasHeight.value
		};
	}
	return {
		x: turtleCanvasWidth.value / 2 + x,
		y: turtleCanvasHeight.value / 2 + y
	};
}

function escapePostScriptText(text: string) {
	return text
		.replaceAll("\\", "\\\\")
		.replaceAll("(", "\\(")
		.replaceAll(")", "\\)");
}

function exportTurtlePostScript() {
	const lines = [
		"%!PS-Adobe-3.0 EPSF-3.0",
		`%%BoundingBox: 0 0 ${turtleCanvasWidth.value} ${turtleCanvasHeight.value}`,
		"%%Creator: IDE",
		"1 setlinejoin 1 setlinecap"
	];
	const commands = [
		...turtleCompletedCommands.map(entry => entry.command),
		...turtleQueuedSteps.flatMap(step =>
			step.command ? [step.command] : []
		)
	];

	for (const command of commands) {
		if (command.kind === "line") {
			const from = turtlePostScriptPoint(command.from.x, command.from.y);
			const to = turtlePostScriptPoint(command.to.x, command.to.y);
			const [red, green, blue] = turtlePostScriptColor(command.color);
			lines.push(
				`${red} ${green} ${blue} setrgbcolor`,
				`${command.width} setlinewidth`,
				`newpath ${from.x} ${from.y} moveto ${to.x} ${to.y} lineto stroke`
			);
			continue;
		}
		if (command.kind === "dot" || command.kind === "circle") {
			const point = turtlePostScriptPoint(command.x, command.y);
			const [red, green, blue] = turtlePostScriptColor(command.color);
			const radius =
				command.kind === "dot"
					? Math.max(1, command.size) / 2
					: Math.abs(command.radius);
			lines.push(
				`${red} ${green} ${blue} setrgbcolor`,
				`newpath ${point.x} ${point.y} ${radius} 0 360 arc ${command.kind === "dot" ? "fill" : "stroke"}`
			);
			continue;
		}
		if (command.kind === "fill") {
			const [first, ...rest] = command.points;
			if (!first) continue;
			const start = turtlePostScriptPoint(first.x, first.y);
			const [red, green, blue] = turtlePostScriptColor(command.fillColor);
			lines.push(
				`${red} ${green} ${blue} setrgbcolor`,
				`newpath ${start.x} ${start.y} moveto`
			);
			for (const point of rest) {
				const mapped = turtlePostScriptPoint(point.x, point.y);
				lines.push(`${mapped.x} ${mapped.y} lineto`);
			}
			lines.push("closepath fill");
			continue;
		}
		if (command.kind === "text") {
			const point = turtlePostScriptPoint(command.x, command.y);
			const [red, green, blue] = turtlePostScriptColor(command.color);
			lines.push(
				`${red} ${green} ${blue} setrgbcolor`,
				"/Helvetica findfont 12 scalefont setfont",
				`${point.x} ${point.y} moveto (${escapePostScriptText(command.text)}) show`
			);
		}
	}

	lines.push("showpage", "%%EOF");
	return `${lines.join("\n")}\n`;
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
	turtleKeyPressHandlers.clear();
	turtleKeyReleaseHandlers.clear();
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
			pythonIdeAssetLookupAliases(file.name).some(alias =>
				candidateNames.has(alias)
			)
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
	const lowercaseKey = key.toLowerCase();
	const directAlias = keyboardKeyAliasMap[lowercaseKey];
	if (directAlias) return directAlias;

	const normalized = lowercaseKey.replace(keyboardKeyWhitespaceRegex, "");
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
	bgpic: setTurtleBackgroundImage,
	setScreenSize: setTurtleScreenSize,
	setDelay(delayMs: number) {
		turtleScreenDelayMs = Number.isFinite(delayMs)
			? Math.max(0, delayMs)
			: 10;
	},
	setWorldCoordinates: setTurtleWorldCoordinates,
	resetWorldCoordinates: resetTurtleWorldCoordinates,
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
	teleport: teleportTurtle,
	home() {
		const fromPose = currentTurtlePose();
		turtleState.x = 0;
		turtleState.y = 0;
		turtleState.heading = 0;
		const toPose = currentTurtlePose();
		trackTurtleFillPoint(0, 0);
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
	penup() {
		turtleState.penDown = false;
	},
	pendown() {
		turtleState.penDown = true;
	},
	isdown: () => turtleState.penDown,
	pensize(width: number) {
		turtleState.lineWidth = Math.max(0.1, width);
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
	clearStamp: clearTurtleStamp,
	undo: undoTurtleDrawing,
	write: drawText,
	registerKey(
		key: string,
		callback: (() => void) | null,
		eventType: "press" | "release" = "release"
	) {
		const handlers =
			eventType === "press"
				? turtleKeyPressHandlers
				: turtleKeyReleaseHandlers;
		if (!callback) {
			handlers.delete(normalizeKey(key));
			refreshActiveTurtleEventHandlerCount();
			return;
		}
		handlers.set(normalizeKey(key), callback);
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
	registerRelease(
		button: string,
		callback: ((x: number, y: number) => void) | null
	) {
		if (!callback) {
			turtleReleaseHandlers.delete(button);
			refreshActiveTurtleEventHandlerCount();
			return;
		}
		turtleReleaseHandlers.set(button, callback);
		refreshActiveTurtleEventHandlerCount();
	},
	registerTurtleClick(
		turtleID: string,
		button: string,
		callback: ((x: number, y: number) => void) | null
	) {
		const key = `${turtleID}:${button}`;
		if (callback) turtleObjectClickHandlers.set(key, callback);
		else turtleObjectClickHandlers.delete(key);
		refreshActiveTurtleEventHandlerCount();
	},
	registerTurtleRelease(
		turtleID: string,
		button: string,
		callback: ((x: number, y: number) => void) | null
	) {
		const key = `${turtleID}:${button}`;
		if (callback) turtleObjectReleaseHandlers.set(key, callback);
		else turtleObjectReleaseHandlers.delete(key);
		refreshActiveTurtleEventHandlerCount();
	},
	registerTurtleDrag(
		turtleID: string,
		button: string,
		callback: ((x: number, y: number) => void) | null
	) {
		const key = `${turtleID}:${button}`;
		if (callback) {
			turtleObjectDragHandlers.set(key, callback);
		} else {
			turtleObjectDragHandlers.delete(key);
			if (activeTurtleDragButton === key) activeTurtleDragButton = null;
		}
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
		canvasRef.value?.focus({ preventScroll: true });
	},
	registerShape: registerTurtleShape,
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
	setShapeTransform: setTurtleShapeTransform,
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
	update: flushTurtleAnimation,
	exportPostScript: exportTurtlePostScript
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
		bgpic(name: string) {
			if (isActiveRun()) turtleBridge.bgpic(name);
		},
		setScreenSize(width: number, height: number) {
			if (isActiveRun()) turtleBridge.setScreenSize(width, height);
		},
		setDelay(delayMs: number) {
			if (isActiveRun()) turtleBridge.setDelay(delayMs);
		},
		setWorldCoordinates(
			left: number,
			bottom: number,
			right: number,
			top: number
		) {
			if (isActiveRun())
				turtleBridge.setWorldCoordinates(left, bottom, right, top);
		},
		resetWorldCoordinates() {
			if (isActiveRun()) turtleBridge.resetWorldCoordinates();
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
		teleport(x: number, y: number, fillGap?: boolean) {
			if (isActiveRun()) turtleBridge.teleport(x, y, fillGap);
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
		clearStamp(stampID: number) {
			if (isActiveRun()) turtleBridge.clearStamp(stampID);
		},
		undo(count?: number) {
			if (isActiveRun()) turtleBridge.undo(count);
		},
		write(
			text: string,
			align?: string,
			fontName?: string,
			fontSize?: number,
			fontStyle?: string
		) {
			return isActiveRun()
				? turtleBridge.write(text, align, fontName, fontSize, fontStyle)
				: 0;
		},
		registerKey(
			key: string,
			callback: (() => void) | null,
			eventType?: "press" | "release"
		) {
			if (isActiveRun())
				turtleBridge.registerKey(key, callback, eventType);
		},
		registerClick(
			button: string,
			callback: ((x: number, y: number) => void) | null
		) {
			if (isActiveRun()) turtleBridge.registerClick(button, callback);
		},
		registerRelease(
			button: string,
			callback: ((x: number, y: number) => void) | null
		) {
			if (isActiveRun()) turtleBridge.registerRelease(button, callback);
		},
		registerTurtleClick(turtleID, button, callback) {
			if (isActiveRun())
				turtleBridge.registerTurtleClick(turtleID, button, callback);
		},
		registerTurtleRelease(turtleID, button, callback) {
			if (isActiveRun())
				turtleBridge.registerTurtleRelease(turtleID, button, callback);
		},
		registerTurtleDrag(turtleID, button, callback) {
			if (isActiveRun())
				turtleBridge.registerTurtleDrag(turtleID, button, callback);
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
		registerShape(name: string, definitionJson: string) {
			if (isActiveRun()) turtleBridge.registerShape(name, definitionJson);
		},
		setShape(shape: string) {
			if (isActiveRun()) turtleBridge.setShape(shape);
		},
		setShapeTransform(...args) {
			if (isActiveRun()) turtleBridge.setShapeTransform(...args);
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
		},
		exportPostScript() {
			return isActiveRun() ? turtleBridge.exportPostScript() : "";
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
	runtimeInputJson() {
		const input = JSON.stringify({
			events: gameEvents.splice(0),
			keys: [...gameKeysDown]
		});
		return input;
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
		runtimeInputJson() {
			return isActiveRun()
				? (gameBridge.runtimeInputJson?.() ??
						JSON.stringify({ events: [], keys: [] }))
				: JSON.stringify({ events: [], keys: [] });
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
		const fileType = isJavaIdeMode(project.mode) ? "Java" : "Python";
		runMessage.value = `No ${fileType} file`;
		appendOutput(
			"stderr",
			`Add a ${isJavaIdeMode(project.mode) ? ".java" : ".py"} file before running this project.`
		);
		return;
	}

	isRunning.value = true;
	runMessage.value = isJavaIdeMode(project.mode)
		? "Starting Java"
		: "Starting Python";
	appendOutput("system", `Running ${runnableFile.name}`);
	clearPythonRuntimeDiagnosticInEditor();

	try {
		if (isJavaIdeMode(project.mode)) {
			const result = runJavaIdeProject({
				activeFileName: runnableFile.name,
				files: project.files,
				inputText: inputText.value,
				mode: project.mode
			});
			for (const line of result.stdout) appendOutput("stdout", line);
			for (const line of result.stderr) appendOutput("stderr", line);
			if (project.mode === "karel" && result.karelWorldSteps?.length) {
				runMessage.value = "Animating Karel world";
				const completedPlayback = await playKarelWorldSteps(
					result.karelWorldSteps,
					() => !shouldStopPythonIdeRun(runID, project._id)
				);
				if (
					!completedPlayback &&
					shouldStopPythonIdeRun(runID, project._id)
				) {
					return;
				}
				if (!completedPlayback) {
					karelWorld.value = result.karelWorld ?? null;
				}
			} else {
				karelWorld.value = result.karelWorld ?? null;
			}
			if (shouldStopPythonIdeRun(runID, project._id)) return;
			runMessage.value = result.stderr.length
				? "Run finished with issues"
				: project.mode === "karel"
					? "Karel world ready"
					: "Run complete";
			return;
		}

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
	const hadRunInFlight = isRunning.value;
	stopRequested.value = true;
	stopActiveRuntimeSurfaces();
	runMessage.value = "Stopped";
	appendOutput(
		"system",
		hadRunInFlight
			? selectedProject.value?.mode === "python"
				? "Stop requested. Plain Python worker is being terminated."
				: "Stop requested. The current run will halt at the next runtime checkpoint."
			: "Stopped active canvas handlers."
	);
	if (!hadRunInFlight) {
		releaseIdlePythonRuntimeCallbacks();
		stopRequested.value = false;
	}
}

function stopActiveRuntimeSurfaces() {
	invalidatePythonIdeRuns();
	isRunning.value = false;
	clearKarelWorldPlayback();
	invalidateTurtleBridgeRuns();
	invalidateGameBridgeRuns();
	stopLoadedPythonRuntimeRun();
	clearTurtleTimers();
	cancelTurtleAnimation();
	stopGameLoop();
	stopAllGameAudio();
	turtleKeyPressHandlers.clear();
	turtleKeyReleaseHandlers.clear();
	gameKeysDown.clear();
	gameEvents.length = 0;
	turtleClickHandlers.clear();
	turtleReleaseHandlers.clear();
	turtleDragHandlers.clear();
	turtleObjectClickHandlers.clear();
	turtleObjectReleaseHandlers.clear();
	turtleObjectDragHandlers.clear();
	refreshActiveTurtleEventHandlerCount();
	activeTurtleDragButton = null;
}

function focusVisualOutputForRun() {
	const projectMode = selectedProject.value?.mode;
	const visualOutput =
		projectMode === "karel" ? karelWorldRef.value : canvasRef.value;
	if (
		projectMode !== "turtle" &&
		projectMode !== "pgzero" &&
		projectMode !== "karel"
	) {
		return;
	}

	visualOutput?.focus({ preventScroll: true });
	window.requestAnimationFrame(() =>
		visualOutput?.focus({ preventScroll: true })
	);
}

function focusKarelWorldOutput(event: PointerEvent) {
	const output = event.currentTarget;
	if (!(output instanceof HTMLElement)) return;
	output.focus({ preventScroll: true });
}

function activateRunControl() {
	if (runControlIsStop.value) {
		stopCurrentProject();
		return;
	}
	focusVisualOutputForRun();
	void runCurrentProject().finally(focusVisualOutputForRun);
}

function canvasOwnsKeyboardEvent(event: KeyboardEvent) {
	const canvas = canvasRef.value;
	const karelWorld = karelWorldRef.value;
	const canvasOwnsEvent = Boolean(
		canvas && (event.target === canvas || document.activeElement === canvas)
	);
	const karelWorldOwnsEvent =
		Boolean(karelWorld) &&
		(event.target === karelWorld || document.activeElement === karelWorld);
	return canvasOwnsEvent || karelWorldOwnsEvent;
}

function isCanvasScrollKey(key: string) {
	return [
		"down",
		"end",
		"home",
		"left",
		"pagedown",
		"pageup",
		"right",
		"space",
		"up"
	].includes(key);
}

function dispatchTurtleKeyHandlers(
	handlers: Map<string, () => void>,
	key: string,
	event: KeyboardEvent
) {
	const callbacks = new Set(
		[handlers.get(key), handlers.get("")].filter(
			(callback): callback is () => void => Boolean(callback)
		)
	);
	if (!callbacks.size) return false;

	event.preventDefault();
	for (const callback of callbacks) {
		try {
			callback();
		} catch (error) {
			appendOutput(
				"stderr",
				error instanceof Error
					? error.message
					: "Turtle key handler failed."
			);
		}
	}
	return true;
}

function handleKeyDown(event: KeyboardEvent) {
	if (!canvasOwnsKeyboardEvent(event)) return;

	const normalizedTurtleKey = normalizeKey(event.key);
	if (
		selectedProject.value?.mode === "karel" &&
		isCanvasScrollKey(normalizedTurtleKey)
	) {
		event.preventDefault();
		return;
	}

	if (
		selectedProject.value?.mode === "turtle" &&
		isCanvasScrollKey(normalizedTurtleKey)
	) {
		event.preventDefault();
	}

	if (
		dispatchTurtleKeyHandlers(
			turtleKeyPressHandlers,
			normalizedTurtleKey,
			event
		)
	) {
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
	const normalizedTurtleKey = normalizeKey(event.key);
	if (
		dispatchTurtleKeyHandlers(
			turtleKeyReleaseHandlers,
			normalizedTurtleKey,
			event
		)
	) {
		return;
	}
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
	if (turtleWorldCoordinates) {
		const [left, bottom, right, top] = turtleWorldCoordinates;
		return {
			x:
				left +
				((event.clientX - rect.left) / rect.width) * (right - left),
			y: top - ((event.clientY - rect.top) / rect.height) * (top - bottom)
		};
	}
	return {
		x: event.clientX - rect.left - rect.width / 2,
		y: rect.height / 2 - (event.clientY - rect.top)
	};
}

function turtleObjectAtPoint(point: { x: number; y: number }) {
	const entries = [...turtleStates.entries()].reverse();
	for (const [turtleID, state] of entries) {
		if (!state.visible) continue;
		const [t11, t12, t21, t22] = state.shapeTransform;
		const matrixScale = Math.max(
			Math.hypot(t11, t21),
			Math.hypot(t12, t22)
		);
		const hitRadius =
			Math.max(
				12,
				14 *
					Math.max(
						state.stretchLength,
						state.stretchWidth,
						matrixScale
					)
			) +
			Math.abs(state.shearFactor) * 6;
		if (Math.hypot(point.x - state.x, point.y - state.y) <= hitRadius)
			return turtleID;
	}
	return "";
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
		const button = turtleMouseButton(event);
		const releaseHandler = turtleReleaseHandlers.get(button);
		const point = turtlePointerPosition(event);
		const turtleID = turtleObjectAtPoint(point);
		const objectReleaseHandler = turtleID
			? turtleObjectReleaseHandlers.get(`${turtleID}:${button}`)
			: null;
		if (releaseHandler) {
			callTurtlePointerHandler(
				releaseHandler,
				event,
				"Turtle release handler failed."
			);
			event.preventDefault();
		}
		if (objectReleaseHandler) {
			callTurtlePointerHandler(
				objectReleaseHandler,
				event,
				"Turtle release handler failed."
			);
			event.preventDefault();
		}
		activeTurtleDragButton = null;
		return;
	}

	if (type === "mousemove") {
		const dragHandler = activeTurtleDragButton
			? (turtleObjectDragHandlers.get(activeTurtleDragButton) ??
				turtleDragHandlers.get(activeTurtleDragButton))
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
	const point = turtlePointerPosition(event);
	const turtleID = turtleObjectAtPoint(point);
	const objectKey = turtleID ? `${turtleID}:${button}` : "";
	const objectClickHandler = objectKey
		? turtleObjectClickHandlers.get(objectKey)
		: null;
	const dragHandler = objectKey
		? turtleObjectDragHandlers.get(objectKey)
		: turtleDragHandlers.get(button);

	if (!clickHandler && !objectClickHandler && !dragHandler) return;
	activeTurtleDragButton = dragHandler ? objectKey || button : null;

	if (clickHandler) {
		callTurtlePointerHandler(
			clickHandler,
			event,
			"Turtle click handler failed."
		);
	}
	if (objectClickHandler) {
		callTurtlePointerHandler(
			objectClickHandler,
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

function clearOwnerRuntimeArtifactSurfaces() {
	const root = pythonIdePageRef.value;
	if (!root) return;
	for (const audio of root.querySelectorAll<HTMLAudioElement>("audio")) {
		audio.pause();
		audio.removeAttribute("src");
		audio.load();
	}
	for (const frame of root.querySelectorAll<HTMLIFrameElement>(
		".artifact-card iframe"
	)) {
		frame.srcdoc = "";
		frame.removeAttribute("srcdoc");
		frame.src = "about:blank";
	}
}

function hideWorkspaceForOwnerTransition(previousOwnerID: string | null) {
	// Tear down the old execution realm before clearing or loading any owner
	// state. The stop path is synchronous once the runtime module has loaded.
	stopActiveRuntimeSurfaces();
	turtleState.background = "#ffffff";
	resetTurtleCanvas();
	resetGameCanvas();
	clearOwnerRuntimeArtifactSurfaces();
	++projectLoadRunID;
	suppressAutoSave = true;
	isLoading.value = true;
	cancelLocalProjectSnapshot();
	if (saveTimer) {
		window.clearTimeout(saveTimer);
		saveTimer = null;
	}
	if (!previousOwnerID && preparedOwnerExitID !== previousOwnerID) {
		saveCodeEditorViewState();
	}
	codeEditorView?.destroy();
	codeEditorView = null;
	activeCodeEditorViewStateKey = "";
	codeEditorViewStates.clear();
	codeEditorStateSnapshots.clear();
	remoteProjectMetadata.clear();
	remoteReviewMetadata.clear();
	remoteProjectDetailLoads.clear();
	remoteReviewDetailLoads.clear();
	remoteProjectDetailLru.splice(0, remoteProjectDetailLru.length);
	editorCursorCount.value = 1;
	gameImageCache.clear();
	inputText.value = "";
	newFileName.value = "";
	clearOutput();
	runMessage.value = "Ready";
	saveMessage.value = "Loading workspace";
	pendingAnonymousProjects.value = [];
	isImportingAnonymousProjects.value = false;
	anonymousImportError.value = "";
	deleteCandidateProjectID.value = "";
	deleteConfirmText.value = "";
	showProjectMenu.value = false;
	showFileTools.value = false;
	projects.value = [];
	visibleProjectReviews.value = [];
	selectedProjectID.value = "";
	projectDetailLoadErrorID.value = "";
	selectedReviewFileName.value = "";
}

async function handleStudentSessionHandoff({
	mode,
	studentID
}: {
	mode: "prepare" | "resume" | "session-ended" | "suspend";
	studentID: string;
}) {
	if (mode === "resume") {
		if (
			studentID !== activeStorageOwnerID.value &&
			preparedOwnerExitID !== studentID
		) {
			return;
		}
		if (preparedOwnerExitID === studentID) preparedOwnerExitID = null;
		if (volatileSuspendedOwnerID === studentID) {
			volatileSuspendedOwnerID = null;
		}
		if (studentID === activeStorageOwnerID.value) {
			await loadProjects();
		}
		return;
	}

	if (mode === "session-ended") {
		volatileStudentProjectRecovery.discard(studentID);
		if (volatileSuspendedOwnerID === studentID) {
			volatileSuspendedOwnerID = null;
		}
		if (studentID !== activeStorageOwnerID.value) {
			await purgeAllStudentPythonProjectRecovery();
			return;
		}
		await persistBrowserProjectsBeforeOwnerTransitionBestEffort(
			studentID,
			projects.value
		);
		preparedOwnerExitID = studentID;
		hideWorkspaceForOwnerTransition(studentID);
		await purgeAllStudentPythonProjectRecovery();
		return;
	}

	if (studentID !== activeStorageOwnerID.value) return;

	if (mode === "suspend") {
		await persistBrowserProjectsBeforeOwnerTransitionBestEffort(
			studentID,
			projects.value
		);
		if (projects.value.length) {
			volatileStudentProjectRecovery.replace(
				studentID,
				projects.value.filter(
					project =>
						projectUsesStudentSync(project) &&
						project.remoteContentLoaded !== false
				),
				{
					unsynced:
						!!saveInFlight ||
						!!pendingSaveProjectIDs.size ||
						saveQueued ||
						!!unsyncedProjectIDs.size
				}
			);
		}
		volatileSuspendedOwnerID = studentID;
		preparedOwnerExitID = studentID;
		hideWorkspaceForOwnerTransition(studentID);
		return;
	}

	++projectLoadRunID;
	suppressAutoSave = true;
	isLoading.value = true;
	cancelLocalProjectSnapshot();
	if (saveTimer) {
		window.clearTimeout(saveTimer);
		saveTimer = null;
	}
	saveCodeEditorViewState();

	let handoffPrepared = false;
	try {
		await waitForOwnerBoundMutations();
		if (localSnapshotInFlight) await localSnapshotInFlight;
		if (saveInFlight) await saveInFlight;
		await persistBrowserProjectsBeforeOwnerTransition(
			studentID,
			projects.value
		);
		for (const project of projects.value.filter(projectUsesStudentSync)) {
			if (
				project._id.startsWith("local-") ||
				unsyncedProjectIDs.has(project._id)
			) {
				pendingSaveProjectIDs.add(project._id);
			}
		}
		if (pendingSaveProjectIDs.size) {
			await savePendingProjects({ force: true });
		}
		if (unsyncedProjectIDs.size) throw new Error("Project sync failed.");

		clearLocalPythonIdeEditorState(studentID);
		preparedOwnerExitID = studentID;
		handoffPrepared = true;
		isLoading.value = true;
		saveMessage.value = "Projects safely synced";
	} catch (error) {
		preparedOwnerExitID = null;
		saveMessage.value = studentSessionHandoffErrorMessage;
		throw error;
	} finally {
		if (!handoffPrepared) suppressAutoSave = false;
	}
}

async function switchProjectOwner(
	nextOwnerID: string | null,
	previousOwnerID: string | null,
	previousProjects: PythonIdeProject[]
) {
	let transitionError: unknown;
	const wasPrepared = preparedOwnerExitID === previousOwnerID;

	try {
		await waitForOwnerBoundMutations();
		if (localSnapshotInFlight) await localSnapshotInFlight;
		if (saveInFlight) await saveInFlight;
		if (!wasPrepared && previousProjects.length) {
			await persistBrowserProjectsBeforeOwnerTransition(
				previousOwnerID,
				previousProjects
			);
		}
	} catch (error) {
		transitionError = error;
	} finally {
		pendingSaveProjectIDs.clear();
		unsyncedProjectIDs.clear();
		saveQueued = false;
		localSnapshotQueued = false;
		if (preparedOwnerExitID === previousOwnerID) preparedOwnerExitID = null;
		activeStorageOwnerID.value = nextOwnerID;
		if (volatileSuspendedOwnerID === nextOwnerID) {
			volatileSuspendedOwnerID = null;
		}

		if (desiredProjectOwnerID === nextOwnerID) {
			await loadProjects();
			if (transitionError) {
				saveMessage.value =
					transitionError instanceof Error
						? transitionError.message
						: "Could not finish the previous project save.";
			}
		}
	}
}

watch(studentProjectOwnerID, nextOwnerID => {
	if (nextOwnerID === desiredProjectOwnerID) return;
	const previousOwnerID = activeStorageOwnerID.value;
	const previousProjects = plainPythonIdeProjectsSnapshot(projects.value);
	volatileStudentProjectRecovery.retainAcrossOwnerChange(nextOwnerID);
	if (
		nextOwnerID &&
		volatileSuspendedOwnerID &&
		volatileSuspendedOwnerID !== nextOwnerID
	) {
		volatileSuspendedOwnerID = null;
	}
	desiredProjectOwnerID = nextOwnerID;

	// Hide the prior student's code synchronously, before any storage or
	// network await, so it cannot flash for the next person at the device.
	hideWorkspaceForOwnerTransition(previousOwnerID);
	projectOwnerSwitchQueue = projectOwnerSwitchQueue
		.then(() =>
			switchProjectOwner(nextOwnerID, previousOwnerID, previousProjects)
		)
		.catch(error => {
			// switchProjectOwner transitions in a finally block. This catch is a
			// last-resort message and must never restore the old workspace.
			saveMessage.value =
				error instanceof Error
					? error.message
					: "Could not load the next IDE workspace.";
		});
});

watch(
	() =>
		[
			route.query.course,
			route.query.classroom,
			route.path,
			route.query.mode,
			route.query.projectKey,
			route.query.starter,
			route.query.starterLabel,
			route.query.starterTitle,
			route.query.starterUrl,
			route.query.template
		].join(":"),
	() => {
		void loadProjects();
	}
);

watch(
	selectedProject,
	project => {
		if (!project) return;
		newWorkspacePresetID.value = isPythonIdeBlueJProject(project)
			? "bluej"
			: project.mode;
	},
	{ immediate: true }
);

watch(selectedProjectID, (projectID, previousProjectID) => {
	projectDetailLoadErrorID.value = "";
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

	const hadRunInFlight = isRunning.value;
	stopRequested.value = true;
	stopActiveRuntimeSurfaces();
	karelWorld.value = null;
	runMessage.value = "Ready";
	if (!hadRunInFlight) {
		releaseIdlePythonRuntimeCallbacks();
		stopRequested.value = false;
	}
	const studentID = activeStorageOwnerID.value;
	if (studentID && projectID) {
		const selectionLoadRunID = projectLoadRunID;
		void hydrateRemoteSelection(projectID, studentID, selectionLoadRunID)
			.then(loaded => {
				if (
					loaded &&
					selectedProjectID.value === projectID &&
					projectLoadIsCurrent(selectionLoadRunID)
				) {
					projectDetailLoadErrorID.value = "";
					void nextTick(resetCodeEditor);
				}
			})
			.catch(error => {
				if (
					selectedProjectID.value === projectID &&
					projectLoadIsCurrent(selectionLoadRunID)
				) {
					projectDetailLoadErrorID.value = projectID;
					appendOutput(
						"system",
						error instanceof Error
							? error.message
							: "Could not load this saved project."
					);
				}
			});
	}
	void nextTick(resetActiveCanvas);
});

watch(
	selectedVisibleReview,
	review => {
		selectedReviewFileName.value = review
			? resolvePythonIdeActiveFileName(
					review.files,
					review.activeFileName
				)
			: "";
	},
	{ immediate: true }
);

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
	void reportClassroomUsage("ide-open", requestedCourseId.value);
	unregisterStudentSessionHandoff = registerStudentSessionHandoff(
		handleStudentSessionHandoff
	);
	primePythonRuntimeConnection();
	void refreshPythonIdeStoragePersistenceStatus();
	void loadProjects();
	window.addEventListener("pagehide", flushPendingProjectSave);
	window.addEventListener("pageshow", handleAnonymousWorkspacePageShow);
	window.addEventListener("storage", handleAnonymousWorkspaceClearSignal);
	document.addEventListener(
		"visibilitychange",
		flushPendingProjectSaveOnVisibilityChange
	);
	window.addEventListener("keydown", handleKeyDown, true);
	window.addEventListener("keyup", handleKeyUp, true);
	window.addEventListener("mouseup", clearTurtleDrag);
	document.addEventListener(
		"pointerdown",
		handleIdeSettingsOutsidePointerDown
	);

	if (canvasRef.value) {
		resizeObserver = new ResizeObserver(() => redrawActiveCanvas());
		resizeObserver.observe(canvasRef.value);
	}
});

onBeforeUnmount(() => {
	unregisterStudentSessionHandoff?.();
	unregisterStudentSessionHandoff = null;
	if (
		saveInFlight ||
		pendingSaveProjectIDs.size ||
		saveQueued ||
		unsyncedProjectIDs.size
	) {
		refreshVolatileStudentProjectRecovery();
	}
	flushPendingProjectSave();
	saveCodeEditorViewState();
	codeEditorView?.destroy();
	stopIdeSplitResize();
	window.removeEventListener("pagehide", flushPendingProjectSave);
	window.removeEventListener("pageshow", handleAnonymousWorkspacePageShow);
	window.removeEventListener("storage", handleAnonymousWorkspaceClearSignal);
	document.removeEventListener(
		"visibilitychange",
		flushPendingProjectSaveOnVisibilityChange
	);
	window.removeEventListener("keydown", handleKeyDown, true);
	window.removeEventListener("keyup", handleKeyUp, true);
	window.removeEventListener("mouseup", clearTurtleDrag);
	document.removeEventListener(
		"pointerdown",
		handleIdeSettingsOutsidePointerDown
	);
	stopRequested.value = true;
	stopActiveRuntimeSurfaces();
	releaseLoadedPythonRuntimeCallbacks();
	resizeObserver?.disconnect();
});
</script>

<template>
	<section
		ref="pythonIdePageRef"
		class="code-ide-page page-shell page-shell--wide"
		:class="{ 'code-ide-page--expanded': ideExpanded }"
	>
		<input
			ref="blueJArchiveInputRef"
			:accept="blueJProjectArchiveUploadAccept"
			aria-label="Import BlueJ project ZIP"
			class="sr-only"
			type="file"
			@change="importBlueJProjectArchiveFromInput"
		/>
		<div class="code-ide-hero">
			<div>
				<p class="code-ide-eyebrow">{{ codeIdeHeroContent.eyebrow }}</p>
				<h1>{{ codeIdeHeroContent.title }}</h1>
				<p>{{ codeIdeHeroContent.description }}</p>
			</div>
			<div class="code-ide-status">
				<div aria-live="polite">
					<span>{{ saveMessage }}</span>
					<strong>{{ runMessage }}</strong>
				</div>
			</div>
		</div>

		<p v-if="currentStudent" class="account-sync-privacy-notice">
			Account projects sync to the classroom server. Keep real names,
			contact details, locations, student numbers, passwords, and access
			codes out of project names, file names, code, and assets.
		</p>

		<section
			v-if="sharedComputerCleanupPanelIsVisible && !currentStudent"
			class="shared-computer-clear site-surface"
			aria-labelledby="shared-computer-clear-title"
		>
			<div>
				<h2 id="shared-computer-clear-title">
					Using a shared computer?
				</h2>
				<p>
					When you finish, remove the anonymous projects and editor
					state saved in this browser before the next student begins.
				</p>
				<p
					v-if="anonymousWorkspaceClearError"
					class="shared-computer-clear__error"
					role="alert"
				>
					{{ anonymousWorkspaceClearError }}
				</p>
			</div>
			<div
				v-if="showAnonymousWorkspaceClearConfirmation"
				class="shared-computer-clear__confirmation"
				role="group"
				aria-label="Confirm clearing browser projects"
			>
				<strong>Delete every anonymous IDE project here?</strong>
				<p>
					This cannot be undone. Projects already saved to a signed-in
					account are not changed.
				</p>
				<div class="shared-computer-clear__actions">
					<button
						class="site-button site-button--secondary"
						:disabled="isClearingAnonymousWorkspace"
						type="button"
						@click="showAnonymousWorkspaceClearConfirmation = false"
					>
						Cancel
					</button>
					<button
						class="site-button shared-computer-clear__final"
						:disabled="isClearingAnonymousWorkspace"
						type="button"
						@click="clearAnonymousWorkspaceForNextStudent"
					>
						{{
							isClearingAnonymousWorkspace
								? "Clearing…"
								: "Clear all browser projects"
						}}
					</button>
				</div>
			</div>
			<button
				v-else
				class="site-button site-button--secondary shared-computer-clear__trigger"
				type="button"
				@click="showAnonymousWorkspaceClearConfirmation = true"
			>
				Clear browser projects for next student
			</button>
		</section>

		<section
			v-if="pendingAnonymousProjects.length && currentStudent"
			class="browser-project-import site-surface"
			aria-labelledby="browser-project-import-title"
		>
			<div>
				<h2 id="browser-project-import-title">
					Projects already saved in this browser
				</h2>
				<p>
					Only add them if they are yours. They will be copied to
					<strong>{{ currentStudent.username }}</strong
					>'s account.
				</p>
				<p
					v-if="anonymousImportError"
					class="browser-project-import__error"
					role="alert"
				>
					{{ anonymousImportError }}
				</p>
			</div>
			<div class="browser-project-import__actions">
				<button
					class="site-button site-button--primary"
					:disabled="isImportingAnonymousProjects"
					type="button"
					@click="importAnonymousProjects"
				>
					{{
						isImportingAnonymousProjects
							? "Saving…"
							: "Save to my account"
					}}
				</button>
				<button
					class="site-button site-button--secondary"
					:disabled="isImportingAnonymousProjects"
					type="button"
					@click="keepAnonymousProjectsSeparate"
				>
					Keep separate
				</button>
			</div>
		</section>

		<div v-if="isLoading" class="code-ide-loading site-surface">
			Loading IDE workspace...
		</div>

		<div
			v-else
			class="code-ide-workspace"
			:class="{ 'is-sidebar-collapsed': sidebarCollapsed }"
		>
			<button
				v-if="sidebarCollapsed"
				:aria-expanded="!sidebarCollapsed"
				aria-label="Expand project sidebar"
				aria-controls="code-ide-sidebar"
				class="sidebar-collapse-toggle sidebar-collapse-toggle--rail"
				title="Expand project sidebar"
				type="button"
				@click="sidebarCollapsed = !sidebarCollapsed"
			>
				<span class="sidebar-collapse-icon" aria-hidden="true" />
			</button>
			<aside
				v-else
				id="code-ide-sidebar"
				class="code-ide-sidebar"
				aria-label="Code projects and files"
			>
				<div class="sidebar-block">
					<div class="sidebar-heading">
						<span>Projects</span>
						<div class="sidebar-actions">
							<button
								:aria-expanded="!sidebarCollapsed"
								aria-label="Collapse project sidebar"
								aria-controls="code-ide-sidebar"
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
									aria-label="More project options"
									class="icon-action icon-action--add"
									title="More project options"
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
									<span>Import project</span>
									<button
										type="button"
										role="menuitem"
										@click="
											openBlueJArchiveImporterFromMenu
										"
									>
										Import BlueJ ZIP
									</button>
									<span>Classroom projects</span>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'circle-art'
											)
										"
									>
										Color Circle Art
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'picasso'
											)
										"
									>
										Picasso Keyboard Painter
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'triangle-motion'
											)
										"
									>
										Triangle Motion Starter
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'neon-trail'
											)
										"
									>
										Neon Trail Painter
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'firework-festival'
											)
										"
									>
										Firework Festival
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'spiral-galaxy'
											)
										"
									>
										Spiral Galaxy
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'turtle-race'
											)
										"
									>
										Turtle Race Day
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'flower-garden'
											)
										"
									>
										Flower Garden Clicker
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'maze-explorer'
											)
										"
									>
										Maze Explorer
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'classroom-project'
											)
										"
									>
										Classroom Turtle Studio
									</button>
									<span>Template project</span>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'turtle',
												'outline'
											)
										"
									>
										Python Level 1 Outline
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'pgzero',
												'outline'
											)
										"
									>
										PyGame Zero Outline
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'java',
												'outline'
											)
										"
									>
										Java Outline
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'java',
												'bluej'
											)
										"
									>
										BlueJ Java Project
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'karel',
												'outline'
											)
										"
									>
										Karel Java Outline
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
												'java',
												'demo'
											)
										"
									>
										Demo Java
									</button>
									<button
										type="button"
										role="menuitem"
										@click="
											createProjectFromMenu(
												'karel',
												'demo'
											)
										"
									>
										Demo Karel Java
									</button>
								</div>
							</div>
						</div>
					</div>

					<div
						class="workspace-type-control"
						aria-label="IDE and language selector"
						role="group"
					>
						<label class="workspace-type-label">
							<span>Workspace type</span>
							<select v-model="newWorkspacePresetID">
								<optgroup
									v-for="group in codeIdeWorkspacePresetGroups"
									:key="group.label"
									:label="group.label"
								>
									<option
										v-for="preset in group.presets"
										:key="preset.id"
										:value="preset.id"
									>
										{{ preset.label }}
									</option>
								</optgroup>
							</select>
						</label>
						<button
							class="site-button site-button--secondary compact-button workspace-type-create"
							type="button"
							@click="createSelectedWorkspaceProject"
						>
							New project
						</button>
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
											project._id === selectedProjectID
									}"
									type="button"
									@click="selectCatalogProject(project._id)"
								>
									<span>{{ projectLabel(project) }}</span>
									<small>{{
										getPythonIdeProjectKindLabel(project)
									}}</small>
								</button>
								<button
									:aria-label="`Delete project ${projectLabel(project)}`"
									class="file-delete project-delete-trigger"
									:class="{
										'is-disabled':
											sortedProjects.length <= 1
									}"
									:disabled="sortedProjects.length <= 1"
									:title="
										sortedProjects.length <= 1
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
								v-if="project._id === deleteCandidateProjectID"
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

				<div
					v-if="selectedProject && selectedProjectContentLoaded"
					class="sidebar-block"
				>
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
								:aria-label="`Delete file ${file.name}`"
								class="file-delete"
								:class="{ 'is-disabled': !canDeleteFile(file) }"
								:disabled="!canDeleteFile(file)"
								:title="`Delete ${file.name}`"
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
							aria-controls="code-ide-file-tools-panel"
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
					<div
						v-if="showFileTools"
						id="code-ide-file-tools-panel"
						class="file-tools-panel"
					>
						<div class="new-file-row">
							<input
								v-model="newFileName"
								aria-label="New project file name"
								:placeholder="newFileNamePlaceholder"
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
						<div
							v-if="selectedProjectCanExportToBlueJ"
							class="file-export-row"
						>
							<button
								class="site-button site-button--secondary compact-button"
								type="button"
								@click="downloadSelectedProjectForBlueJ"
							>
								Download BlueJ ZIP
							</button>
							<a
								:href="blueJHomeUrl"
								target="_blank"
								rel="noopener noreferrer"
							>
								BlueJ
							</a>
							<a
								:href="blueJSourceUrl"
								target="_blank"
								rel="noopener noreferrer"
							>
								Source
							</a>
						</div>
					</div>
				</div>
			</aside>

			<main
				v-if="selectedProject && selectedProjectContentLoaded"
				class="code-ide-main"
			>
				<div class="editor-toolbar">
					<div class="project-title-field">
						<label
							class="project-title-label"
							for="code-ide-project-title"
						>
							Project name
						</label>
						<input
							id="code-ide-project-title"
							class="project-title-input"
							:value="selectedProject.title"
							type="text"
							@input="updateProjectTitle"
						/>
					</div>
					<div class="editor-actions">
						<div ref="ideSettingsRef" class="ide-settings">
							<button
								:aria-expanded="showIdeSettings"
								aria-controls="code-ide-settings-panel"
								aria-label="IDE settings"
								class="ide-settings-trigger"
								title="IDE settings"
								type="button"
								@click="showIdeSettings = !showIdeSettings"
							>
								<FontAwesomeIcon
									:icon="faGear"
									class="ide-settings-icon"
									aria-hidden="true"
								/>
							</button>
							<div
								v-if="showIdeSettings"
								id="code-ide-settings-panel"
								class="ide-settings-panel"
								role="dialog"
								aria-label="IDE settings"
							>
								<label class="ide-setting-toggle">
									<input
										:checked="autoSaveEnabled"
										type="checkbox"
										@change="updateAutoSavePreference"
									/>
									<span class="ide-setting-copy">
										<span class="ide-setting-title">
											Autosave projects
										</span>
										<small class="ide-setting-description">
											Save projects on this device and
											sync when possible.
										</small>
									</span>
								</label>
								<label class="ide-setting-toggle">
									<input
										:checked="codeRecommendationsEnabled"
										type="checkbox"
										@change="
											updateCodeRecommendationsPreference
										"
									/>
									<span class="ide-setting-copy">
										<span class="ide-setting-title">
											Suggestions
										</span>
										<small class="ide-setting-description">
											Show code suggestions while typing.
										</small>
									</span>
								</label>
								<label class="ide-setting-toggle">
									<input
										:checked="editorLineWrapEnabled"
										type="checkbox"
										@change="updateEditorLineWrapPreference"
									/>
									<span class="ide-setting-copy">
										<span class="ide-setting-title">
											Line wrap
										</span>
										<small class="ide-setting-description">
											Wrap long lines in the editor.
										</small>
									</span>
								</label>
								<label class="ide-setting-toggle">
									<input
										:checked="ideExpanded"
										type="checkbox"
										@change="updateExpandedIdePreference"
									/>
									<span class="ide-setting-copy">
										<span class="ide-setting-title">
											Expanded layout
										</span>
										<small class="ide-setting-description">
											Use more space for editor and
											output.
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
							aria-label="Download project ZIP"
							class="site-button site-button--secondary"
							:disabled="isDownloading"
							title="Download project ZIP"
							type="button"
							@click="downloadSelectedProject"
						>
							{{ isDownloading ? "Preparing" : "Download ZIP" }}
						</button>
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

				<section
					v-if="selectedProjectCanShowBlueJIntegration"
					class="bluej-integration-panel"
					aria-label="BlueJ integration"
				>
					<div>
						<p class="bluej-integration-eyebrow">BlueJ</p>
						<h2>BlueJ Desktop Integration</h2>
						<p>{{ selectedProjectBlueJDescription }}</p>
					</div>
					<div
						v-if="selectedBlueJClassTargets.length"
						class="bluej-class-map"
						aria-label="BlueJ class diagram preview"
					>
						<span class="bluej-class-map-label">
							Class diagram preview
						</span>
						<div class="bluej-class-targets">
							<div
								v-for="target in selectedBlueJClassTargets"
								:key="target.fileName"
								class="bluej-class-target"
							>
								<strong>{{ target.name }}</strong>
								<small>{{
									target.hasMainMethod
										? "Runs main"
										: "Object bench class"
								}}</small>
							</div>
						</div>
					</div>
					<div class="bluej-integration-actions">
						<button
							class="site-button site-button--secondary compact-button"
							type="button"
							@click="createProject('java', 'bluej')"
						>
							New BlueJ project
						</button>
						<button
							class="site-button site-button--secondary compact-button"
							type="button"
							@click="openBlueJArchiveImporter"
						>
							Import BlueJ ZIP
						</button>
						<button
							v-if="selectedProjectCanExportToBlueJ"
							class="site-button site-button--secondary compact-button"
							type="button"
							@click="downloadSelectedProjectForBlueJ"
						>
							Download BlueJ ZIP
						</button>
						<small v-else class="bluej-integration-note">
							Standard Java project required for ZIP export.
						</small>
						<a
							class="bluej-integration-link"
							:href="blueJHomeUrl"
							target="_blank"
							rel="noopener noreferrer"
						>
							BlueJ
						</a>
						<a
							class="bluej-integration-link"
							:href="blueJSourceUrl"
							target="_blank"
							rel="noopener noreferrer"
						>
							BlueJ source
						</a>
					</div>
				</section>

				<section
					v-if="selectedVisibleReview"
					class="visible-review-panel"
					aria-label="Julio's review copy"
				>
					<div class="visible-review-header">
						<div>
							<p class="visible-review-eyebrow">
								Julio's review copy
							</p>
							<h2>{{ selectedVisibleReview.title }}</h2>
							<p v-if="selectedVisibleReview.note">
								{{ selectedVisibleReview.note }}
							</p>
						</div>
						<label v-if="visibleReviewFiles.length">
							<span>Review file</span>
							<select v-model="selectedReviewFileName">
								<option
									v-for="file in visibleReviewFiles"
									:key="file.name"
									:value="file.name"
								>
									{{ file.name }}
								</option>
							</select>
						</label>
					</div>
					<pre
						v-if="activeVisibleReviewFile"
						class="visible-review-code"
					><code>{{ activeVisibleReviewFileContent }}</code></pre>
				</section>

				<div
					ref="ideGridRef"
					class="ide-grid"
					:class="{
						'ide-grid--drawing': usesVisualOutput,
						'is-resizing': isResizingIdeSplit
					}"
					:style="ideGridStyle"
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
										<li>
											Cmd/Ctrl+/ toggles comments for the
											line or selection.
										</li>
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
											Tab / Shift+Tab: Indent / outdent
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

					<button
						class="ide-splitter"
						type="button"
						role="separator"
						aria-label="Resize code and output panels"
						aria-orientation="vertical"
						:aria-valuemin="minCodeSplitPercent"
						:aria-valuemax="maxCodeSplitPercent"
						:aria-valuenow="Math.round(activeIdeSplitPercent)"
						title="Drag to resize code and output panels"
						@keydown="handleIdeSplitKeydown"
						@pointerdown="startIdeSplitResize"
					/>

					<section class="result-panel" aria-label="Code output">
						<div class="panel-header">
							<span>{{
								usesKarelWorld
									? "Karel world"
									: usesDrawingCanvas
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
							v-show="usesKarelWorld"
							ref="karelWorldRef"
							class="karel-shell"
							aria-label="Karel world"
							tabindex="0"
							@pointerdown="focusKarelWorldOutput"
						>
							<div
								v-if="karelWorld"
								class="karel-world"
								:style="karelWorldStyle"
							>
								<div
									v-for="cell in karelWorldCells"
									:key="cell.key"
									class="karel-cell"
									:class="{
										'has-paint': Boolean(cell.paintColor),
										'has-wall-east': cell.walls.east,
										'has-wall-north': cell.walls.north,
										'has-wall-south': cell.walls.south,
										'has-wall-west': cell.walls.west
									}"
									:style="karelCellStyle(cell)"
									:aria-label="karelCellAriaLabel(cell)"
								>
									<span
										v-if="cell.beeperCount"
										class="karel-beeper"
										aria-label="Beeper"
									>
										{{ cell.beeperCount }}
									</span>
								</div>
								<span
									v-if="karelWorld.robot"
									class="karel-robot"
									:class="karelRobotDirectionClass"
									:style="karelRobotStyle"
									aria-label="Karel robot"
								/>
							</div>
							<div v-else class="karel-empty">
								Run Karel code to render the world.
							</div>
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
									:csp="runtimeArtifactContentSecurityPolicy"
									credentialless
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
									placeholder="One input or Scanner value per line"
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
									>{{ line.text }}</pre>
							</div>
						</div>
					</section>
				</div>
			</main>
			<main
				v-else-if="selectedProject"
				class="code-ide-main code-ide-project-loading"
			>
				<p role="status">
					{{
						projectDetailLoadErrorID === selectedProject._id
							? "This project could not be loaded."
							: "Loading selected project…"
					}}
				</p>
				<button
					v-if="projectDetailLoadErrorID === selectedProject._id"
					class="site-button site-button--secondary compact-button"
					type="button"
					@click="retrySelectedProjectLoad"
				>
					Try again
				</button>
			</main>
		</div>
	</section>
</template>

<style scoped>
.code-ide-page {
	width: min(1680px, calc(100% - clamp(2rem, 4vw, 4rem)));
	gap: 1.25rem;
	--code-ide-toolbar-control-size: 3.5rem;
	--code-ide-toolbar-button-width: 6.75rem;
	--code-ide-toolbar-control-radius: 16px;
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

.code-ide-page {
	letter-spacing: 0;
}

.code-ide-page--expanded {
	width: min(100% - 0.75rem, 100vw);
	gap: 0.75rem;
}

.code-ide-page--expanded .code-ide-hero {
	display: none;
}

.code-ide-page--expanded .code-ide-workspace {
	min-height: calc(100vh - 1.5rem);
}

.code-ide-page--expanded .code-ide-main {
	padding: 0.75rem;
}

.code-ide-page :is(section, p, label, input, textarea, select, button) {
	margin: 0;
	letter-spacing: 0;
}

.code-ide-hero {
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

.code-ide-eyebrow,
.sidebar-heading,
.panel-header,
.editor-toolbar > span,
.stdin-panel span {
	font-size: 0.75rem;
	font-weight: 800;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #0f766e;
}

.code-ide-hero h1 {
	margin-top: 0.35rem;
	font-size: clamp(2.4rem, 4vw, 4.5rem);
	color: var(--color-ink-strong);
}

.code-ide-hero p:not(.code-ide-eyebrow) {
	max-width: 58rem;
	margin-top: 0.75rem;
	color: var(--color-ink-soft);
	font-size: 1rem;
	line-height: 1.7;
}

.code-ide-status {
	min-width: 14rem;
	display: grid;
	gap: 0.75rem;
	padding: 1rem;
	border: 1px solid var(--color-border);
	border-radius: 18px;
	background: rgba(255, 255, 255, 0.82);
	color: var(--color-ink-soft);
}

.code-ide-status > div {
	display: grid;
	gap: 0.35rem;
}

.code-ide-status strong {
	color: var(--color-ink-strong);
	font-size: 1.1rem;
}

html.dark .code-ide-hero {
	background: linear-gradient(
		135deg,
		rgba(8, 32, 43, 0.98),
		rgba(17, 65, 62, 0.88)
	);
}

html.dark .code-ide-hero h1 {
	color: #f8fbff;
}

html.dark .code-ide-hero p:not(.code-ide-eyebrow) {
	color: #c8dce6;
}

html.dark .code-ide-status {
	background: rgba(8, 17, 31, 0.8);
	color: #c8dce6;
}

html.dark .code-ide-status strong {
	color: #f8fbff;
}

.account-sync-privacy-notice {
	margin: -0.25rem 0 0;
	color: var(--color-ink-soft);
	font-size: 0.8rem;
	line-height: 1.5;
}

.shared-computer-clear {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 1rem;
	align-items: center;
	padding: 1rem 1.1rem;
	border-color: rgba(180, 83, 9, 0.32);
	background: rgba(255, 251, 235, 0.92);
}

.shared-computer-clear h2 {
	color: var(--color-ink-strong);
	font-size: 1rem;
}

.shared-computer-clear p {
	margin-top: 0.25rem;
	color: var(--color-ink-soft);
	line-height: 1.5;
}

.shared-computer-clear__confirmation {
	min-width: min(30rem, 100%);
	display: grid;
	gap: 0.45rem;
	padding: 0.8rem;
	border: 1px solid rgba(185, 28, 28, 0.3);
	border-radius: 14px;
	background: rgba(254, 242, 242, 0.96);
	color: #7f1d1d;
}

.shared-computer-clear__confirmation p {
	color: #991b1b;
	font-size: 0.82rem;
}

.shared-computer-clear__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.55rem;
}

.shared-computer-clear__final {
	border: 1px solid rgba(185, 28, 28, 0.58);
	background: #b91c1c;
	color: #ffffff;
}

.shared-computer-clear__error {
	color: var(--color-error-text) !important;
}

.shared-computer-clear__trigger {
	white-space: nowrap;
}

html.dark .shared-computer-clear {
	border-color: rgba(251, 191, 36, 0.28);
	background: rgba(69, 45, 10, 0.68);
}

html.dark .shared-computer-clear__confirmation {
	border-color: rgba(248, 113, 113, 0.38);
	background: rgba(69, 10, 10, 0.86);
	color: #fecaca;
}

html.dark .shared-computer-clear__confirmation p {
	color: #fecaca;
}

.browser-project-import {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.1rem;
	border-color: rgba(13, 148, 136, 0.32);
}

.browser-project-import h2 {
	margin: 0;
	color: var(--color-ink-strong);
	font-size: 1rem;
}

.browser-project-import p {
	margin-top: 0.25rem;
	color: var(--color-ink-soft);
	line-height: 1.5;
}

.browser-project-import__actions {
	display: flex;
	flex: 0 0 auto;
	flex-wrap: wrap;
	gap: 0.6rem;
}

.browser-project-import__error {
	color: var(--color-error-text) !important;
}

html.dark
	.code-ide-page
	:is(
		.code-ide-eyebrow,
		.sidebar-heading,
		.panel-header,
		.editor-toolbar span,
		.project-title-label,
		.stdin-panel span
	) {
	color: #5eead4;
}

html.dark .ide-settings-trigger,
html.dark .ide-settings-panel {
	color: #f8fbff;
}

html.dark .ide-settings-trigger {
	background: rgba(8, 17, 31, 0.94);
}

html.dark .ide-settings-panel {
	background: #08111f;
}

html.dark .ide-setting-title {
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

html.dark .code-ide-page {
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

html.dark .karel-shell {
	background: #0f172a;
}

html.dark .karel-empty {
	color: #c8dce6;
}

.code-ide-loading,
.code-ide-workspace {
	min-height: 42rem;
}

.code-ide-loading {
	display: grid;
	place-items: center;
	color: var(--color-ink-soft);
}

.code-ide-workspace {
	display: grid;
	grid-template-columns: minmax(18rem, 24rem) minmax(0, 1fr);
	gap: 1rem;
	align-items: stretch;
}

.code-ide-workspace.is-sidebar-collapsed {
	grid-template-columns: auto minmax(0, 1fr);
}

.code-ide-sidebar,
.code-ide-main,
.code-panel,
.result-panel {
	border: 1px solid var(--color-border);
	border-radius: var(--radius-lg);
	background: var(--color-surface-strong);
	box-shadow: var(--shadow-soft);
}

.code-ide-sidebar {
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

.code-ide-workspace.is-sidebar-collapsed .sidebar-collapse-icon::before {
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

.workspace-type-control {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 0.5rem;
	align-items: end;
}

.workspace-type-label {
	min-width: 0;
	display: grid;
	gap: 0.35rem;
}

.workspace-type-label span {
	color: var(--color-ink-soft);
	font-size: 0.72rem;
	font-weight: 800;
}

.workspace-type-label select {
	width: 100%;
	min-width: 0;
	height: 2.55rem;
	padding: 0 2rem 0 0.7rem;
	border: 1px solid var(--color-border);
	border-radius: 8px;
	background: rgba(255, 255, 255, 0.84);
	color: var(--color-ink);
	font: inherit;
	font-size: 0.82rem;
	font-weight: 700;
}

.workspace-type-create {
	min-height: 2.55rem;
	white-space: nowrap;
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

html.dark .workspace-type-label select {
	border-color: rgba(94, 234, 212, 0.22);
	background: #0f1b2a;
	color: #f8fafc;
}

html.dark .bluej-integration-panel {
	border-color: rgba(94, 234, 212, 0.24);
	background: rgba(15, 23, 42, 0.52);
}

html.dark .bluej-integration-panel h2 {
	color: #f8fafc;
}

html.dark .bluej-integration-panel p:not(.bluej-integration-eyebrow) {
	color: #cbd5e1;
}

html.dark .bluej-integration-note {
	color: #94a3b8;
}

html.dark .bluej-integration-eyebrow,
html.dark .bluej-integration-link {
	color: #5eead4;
}

html.dark .bluej-class-map-label {
	color: #5eead4;
}

html.dark .bluej-class-target {
	border-color: rgba(94, 234, 212, 0.32);
	background: rgba(8, 17, 31, 0.74);
}

html.dark .bluej-class-target strong {
	color: #f8fafc;
}

html.dark .bluej-class-target small {
	color: #c8dce6;
}

html.dark .bluej-integration-link {
	border-color: rgba(94, 234, 212, 0.2);
	background: rgba(15, 23, 42, 0.28);
}

html.dark .bluej-integration-link:hover,
html.dark .bluej-integration-link:focus-visible {
	border-color: rgba(94, 234, 212, 0.45);
	background: rgba(20, 78, 75, 0.52);
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

.file-export-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem;
	align-items: center;
	padding-top: 0.45rem;
	border-top: 1px solid var(--color-border);
}

.file-export-row a {
	color: #0f766e;
	font-size: 0.78rem;
	font-weight: 800;
	text-decoration: none;
}

.file-export-row a:hover,
.file-export-row a:focus-visible {
	text-decoration: underline;
}

.new-file-row input,
.project-delete-confirm input,
.project-title-input,
.stdin-panel textarea {
	width: 100%;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.84);
	color: var(--color-ink);
}

.new-file-row input,
.project-delete-confirm input,
.project-title-input {
	min-height: 2.8rem;
	padding: 0.55rem 0.75rem;
}

.compact-button {
	min-height: 2.8rem;
	padding: 0.55rem 0.75rem;
	border-radius: 12px;
}

.run-control {
	width: var(--code-ide-toolbar-button-width);
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

.code-ide-main {
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

.stdin-panel {
	display: grid;
	gap: 0.35rem;
}

.project-title-field {
	min-width: 0;
	display: grid;
	gap: 0.5rem;
}

.project-title-label {
	min-width: 0;
	color: #0f766e;
	font-size: 0.75rem;
	font-weight: 800;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	line-height: 1;
}

.project-title-input {
	min-width: 0;
}

.editor-actions {
	position: relative;
	grid-column: 2;
	align-self: end;
	display: flex;
	gap: 0.65rem;
	align-items: stretch;
	justify-content: flex-end;
	height: var(--code-ide-toolbar-control-size);
}

.project-title-input,
.editor-actions > .site-button,
.ide-settings-trigger {
	box-sizing: border-box;
	height: var(--code-ide-toolbar-control-size);
	min-height: var(--code-ide-toolbar-control-size);
	border-radius: var(--code-ide-toolbar-control-radius);
}

.editor-actions > .site-button {
	width: var(--code-ide-toolbar-button-width);
	padding: 0 1.2rem;
	line-height: 1;
}

.bluej-integration-panel {
	display: grid;
	grid-template-columns: 1fr;
	gap: 1rem;
	align-items: stretch;
	padding: 0.85rem 1rem;
	border: 1px solid rgba(20, 184, 166, 0.28);
	border-radius: 14px;
	background: rgba(240, 253, 250, 0.68);
}

.bluej-integration-panel h2,
.bluej-integration-panel p {
	margin: 0;
}

.bluej-integration-panel h2 {
	margin-top: 0.12rem;
	color: var(--color-ink-strong);
	font-size: 1rem;
	letter-spacing: 0;
	line-height: 1.25;
}

.bluej-integration-panel p:not(.bluej-integration-eyebrow) {
	margin-top: 0.28rem;
	color: var(--color-ink);
	font-size: 0.86rem;
	line-height: 1.45;
}

.bluej-class-map {
	display: grid;
	gap: 0.55rem;
	min-width: min(100%, 20rem);
}

.bluej-class-map-label {
	color: #0f766e;
	font-size: 0.68rem;
	font-weight: 900;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.bluej-class-targets {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.bluej-class-target {
	min-width: 7.25rem;
	display: grid;
	gap: 0.15rem;
	place-items: center;
	padding: 0.65rem 0.75rem;
	border: 1px solid rgba(15, 118, 110, 0.22);
	border-radius: 10px;
	background: rgba(236, 253, 245, 0.74);
	text-align: center;
}

.bluej-class-target strong,
.bluej-class-target small {
	display: block;
}

.bluej-class-target strong {
	color: var(--color-ink-strong);
	font-size: 0.88rem;
}

.bluej-class-target small {
	color: var(--color-ink-soft);
	font-size: 0.72rem;
	font-weight: 700;
}

.bluej-integration-eyebrow {
	color: #0f766e;
	font-size: 0.72rem;
	font-weight: 900;
	letter-spacing: 0.1em;
	text-transform: uppercase;
}

.bluej-integration-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
	justify-content: flex-start;
}

.bluej-integration-note {
	max-width: 12rem;
	color: var(--color-ink-muted);
	font-size: 0.8rem;
	font-weight: 700;
	line-height: 1.35;
	text-align: right;
}

.bluej-integration-link {
	min-height: 2.8rem;
	display: inline-flex;
	align-items: center;
	padding: 0.55rem 0.75rem;
	border: 1px solid rgba(15, 118, 110, 0.22);
	border-radius: 12px;
	color: #0f766e;
	font-weight: 800;
	text-decoration: none;
}

.bluej-integration-link:hover,
.bluej-integration-link:focus-visible {
	border-color: rgba(15, 118, 110, 0.42);
	background: rgba(204, 251, 241, 0.45);
	text-decoration: none;
}

.visible-review-panel {
	display: grid;
	gap: 0.9rem;
	padding: 1rem;
	border: 1px solid rgba(20, 184, 166, 0.28);
	border-radius: 18px;
	background: rgba(240, 253, 250, 0.74);
}

.visible-review-header {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(11rem, 16rem);
	gap: 1rem;
	align-items: end;
}

.visible-review-header h2,
.visible-review-header p {
	margin: 0;
}

.visible-review-header h2 {
	margin-top: 0.15rem;
	color: var(--color-ink-strong);
	font-size: 1.1rem;
	letter-spacing: 0;
}

.visible-review-header p:not(.visible-review-eyebrow) {
	margin-top: 0.45rem;
	color: var(--color-ink);
	line-height: 1.55;
}

.visible-review-eyebrow {
	color: #0f766e;
	font-size: 0.74rem;
	font-weight: 900;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.visible-review-header label {
	display: grid;
	gap: 0.35rem;
	color: var(--color-ink-strong);
	font-size: 0.82rem;
	font-weight: 800;
}

.visible-review-header select {
	width: 100%;
	padding: 0.62rem 0.72rem;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	background: #fff;
	color: var(--color-ink-strong);
	font: inherit;
}

.visible-review-code {
	max-height: 20rem;
	margin: 0;
	padding: 0.9rem;
	overflow: auto;
	border-radius: 14px;
	background: #0f172a;
	color: #e2e8f0;
	font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
	font-size: 0.82rem;
	line-height: 1.55;
	white-space: pre;
	tab-size: 4;
}

.ide-settings {
	position: relative;
	display: flex;
	align-items: stretch;
	height: 100%;
}

.ide-settings-trigger {
	width: var(--code-ide-toolbar-control-size);
	height: var(--code-ide-toolbar-control-size);
	flex: 0 0 var(--code-ide-toolbar-control-size);
	padding: 0;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border: 1px solid var(--color-border);
	background: rgba(255, 255, 255, 0.84);
	color: #0f766e;
	font-weight: 900;
	line-height: 1;
}

.ide-settings-icon {
	width: 1.35rem;
	height: 1.35rem;
	display: block;
	color: currentColor;
}

.ide-settings-panel {
	position: absolute;
	z-index: 18;
	top: calc(100% + 0.6rem);
	right: 0;
	width: min(26rem, calc(100vw - 2rem));
	max-height: min(36rem, calc(100vh - 8rem));
	display: grid;
	gap: 0.45rem;
	overflow: auto;
	overscroll-behavior: contain;
	padding: 0.8rem;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	background: #fff;
	box-shadow: var(--shadow-soft);
	font-family: var(--font-sans);
	font-size: 0.84rem;
	line-height: 1.42;
	font-variant: normal;
	font-weight: 400;
	text-align: left;
	text-transform: none;
	letter-spacing: normal;
	overflow-wrap: normal;
	word-break: normal;
}

.ide-settings-panel,
.ide-settings-panel :where(*) {
	color: inherit;
	font-family: var(--font-sans);
	font-variant: normal;
	letter-spacing: normal !important;
	text-transform: none !important;
	overflow-wrap: normal;
	word-break: normal;
}

.ide-settings-panel :is(label, span, small, button),
.ide-settings-panel .ide-setting-copy,
.ide-settings-panel .ide-setting-title,
.ide-settings-panel .ide-setting-description {
	font-variant: normal;
	letter-spacing: normal !important;
	text-transform: none !important;
}

.ide-setting-toggle {
	display: grid;
	grid-template-columns: 1rem minmax(0, 1fr);
	column-gap: 0.65rem;
	row-gap: 0.16rem;
	align-items: start;
	padding: 0.62rem 0.7rem;
	border-radius: 8px;
	color: var(--color-ink);
	cursor: pointer;
	font-size: 0.84rem;
	font-weight: 400;
	line-height: 1.42;
	text-align: left;
	text-transform: none;
	letter-spacing: normal;
}

.ide-setting-toggle + .ide-setting-toggle {
	margin-top: 0.15rem;
	border-top: 1px solid var(--color-border);
}

.ide-setting-note {
	color: var(--color-muted);
	font-size: 0.72rem;
	font-weight: 500;
	line-height: 1.38;
}

.ide-setting-storage {
	display: grid;
	gap: 0.42rem;
	margin-top: 0.15rem;
	padding: 0.52rem 0.7rem 0;
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
	font-weight: 600;
	letter-spacing: normal;
}

.ide-setting-action:disabled {
	cursor: wait;
	opacity: 0.65;
}

.ide-setting-toggle input[type="checkbox"] {
	width: 1rem;
	height: 1rem;
	margin: 0;
	margin-top: 0.07rem;
	accent-color: #0f766e;
	transform: none;
}

.ide-setting-copy {
	min-width: 0;
	display: grid;
	gap: 0.18rem;
}

.ide-settings-panel .ide-setting-title {
	display: block;
	color: var(--color-ink-strong);
	font-size: 0.86rem;
	font-weight: 550;
	letter-spacing: normal !important;
	line-height: 1.28;
	font-variant: normal;
	text-transform: none !important;
}

.ide-settings-panel .ide-setting-description {
	display: block;
	color: var(--color-ink-soft);
	font-size: 0.76rem;
	font-weight: 400;
	letter-spacing: normal !important;
	line-height: 1.36;
	font-variant: normal;
	text-transform: none !important;
}

.ide-setting-storage small {
	color: var(--color-ink-soft);
	font-size: 0.74rem;
	line-height: 1.4;
}

.ide-grid {
	--code-ide-splitter-width: 0.55rem;
	min-height: 38rem;
	height: clamp(38rem, 76vh, 54rem);
	display: grid;
	grid-template-columns:
		minmax(18rem, var(--code-ide-code-column, 54%))
		var(--code-ide-splitter-width) minmax(24rem, 1fr);
	column-gap: 0.3rem;
}

.ide-grid--drawing {
	height: clamp(40rem, 78vh, 56rem);
	grid-template-columns:
		minmax(16rem, var(--code-ide-code-column, 42%))
		var(--code-ide-splitter-width) minmax(28rem, 1fr);
}

.code-ide-page--expanded .ide-grid,
.code-ide-page--expanded .ide-grid--drawing {
	height: clamp(42rem, calc(100vh - 7.5rem), 72rem);
}

.ide-grid.is-resizing {
	cursor: col-resize;
	user-select: none;
}

.code-panel,
.result-panel {
	min-height: 0;
	min-width: 0;
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
	overflow: hidden;
}

.code-panel {
	overflow: hidden;
}

.ide-splitter {
	width: var(--code-ide-splitter-width);
	min-width: var(--code-ide-splitter-width);
	display: inline-flex;
	align-items: center;
	justify-content: center;
	align-self: stretch;
	padding: 0;
	border: 0;
	background: transparent;
	cursor: col-resize;
	touch-action: none;
}

.ide-splitter::before {
	width: 2px;
	height: 100%;
	border-radius: 999px;
	background: rgba(15, 118, 110, 0.46);
	content: "";
	pointer-events: none;
}

.ide-splitter:hover,
.ide-splitter:focus-visible,
.ide-grid.is-resizing .ide-splitter {
	background: transparent;
	box-shadow: none;
	outline: 0;
}

html.dark .ide-splitter::before {
	background: rgba(94, 234, 212, 0.52);
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
	height: 100%;
	min-height: 0;
	overflow: hidden;
	border: 1px solid transparent;
	background: var(--python-code-bg);
	transition:
		border-color 150ms ease,
		box-shadow 150ms ease;
}

.code-editor-shell:focus-within,
.canvas-shell:focus-within,
.karel-shell:focus-visible,
.stdin-panel:focus-within,
.project-title-input:focus-visible {
	border-color: var(--python-focus-ring);
	box-shadow:
		0 0 0 3px var(--python-focus-glow),
		inset 0 0 0 1px rgba(16, 185, 129, 0.12);
}

.code-editor-host {
	width: 100%;
	height: 100%;
	min-height: 0;
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
	width: min(100%, var(--python-turtle-max-width, 48rem));
	height: auto;
	aspect-ratio: var(--python-turtle-aspect, 640 / 480);
	border: 1px solid var(--color-border);
	border-radius: 14px;
	background: #fff;
	outline: none;
}

.turtle-canvas--game {
	width: 100%;
	height: 100%;
}

.karel-shell {
	display: grid;
	place-items: center;
	min-height: 26rem;
	padding: 1rem;
	border: 1px solid transparent;
	border-bottom: 1px solid var(--color-border);
	background: #f8fafc;
	outline: none;
	transition:
		border-color 150ms ease,
		box-shadow 150ms ease;
}

.karel-world {
	position: relative;
	display: grid;
	grid-template-columns: repeat(var(--karel-cols), minmax(0, 1fr));
	width: min(100%, 34rem);
	aspect-ratio: var(--karel-cols) / var(--karel-rows);
	border: 3px solid #111827;
	background: #fff;
	box-shadow: 0 18px 34px rgba(15, 23, 42, 0.14);
}

.karel-cell {
	position: relative;
	min-width: 0;
	min-height: 0;
	border-right: 1px solid #ef4444;
	border-bottom: 1px solid #ef4444;
}

.karel-cell.has-paint {
	background: var(--karel-cell-color);
}

.karel-cell.has-wall-east {
	border-right: 4px solid #111827;
}

.karel-cell.has-wall-north {
	border-top: 4px solid #111827;
}

.karel-cell.has-wall-south {
	border-bottom: 4px solid #111827;
}

.karel-cell.has-wall-west {
	border-left: 4px solid #111827;
}

.karel-robot {
	position: absolute;
	z-index: 3;
	border: 2px solid #1d4ed8;
	border-radius: 5px;
	background: #fde047;
	box-shadow: 0 2px 0 #111827;
	transition:
		left 240ms ease,
		top 240ms ease,
		transform 180ms ease;
	will-change: left, top, transform;
}

.karel-robot::after {
	position: absolute;
	top: 50%;
	right: -0.42rem;
	width: 0;
	height: 0;
	border-top: 0.35rem solid transparent;
	border-bottom: 0.35rem solid transparent;
	border-left: 0.55rem solid #111827;
	content: "";
	transform: translateY(-50%);
}

.karel-robot--north {
	transform: rotate(-90deg);
}

.karel-robot--south {
	transform: rotate(90deg);
}

.karel-robot--west {
	transform: rotate(180deg);
}

.karel-beeper {
	position: absolute;
	z-index: 2;
	top: 50%;
	left: 50%;
	display: grid;
	width: 1.25rem;
	height: 1.25rem;
	place-items: center;
	border-radius: 999px;
	background: #111827;
	color: #fff;
	font-size: 0.68rem;
	font-weight: 800;
	transform: translate(-50%, -50%);
}

.karel-empty {
	display: grid;
	width: min(100%, 34rem);
	min-height: 20rem;
	place-items: center;
	border: 1px dashed var(--color-border);
	border-radius: 14px;
	color: #64748b;
	font-family:
		"SFMono-Regular", "Cascadia Code", "Liberation Mono", monospace;
	font-size: 0.9rem;
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
	.code-ide-workspace,
	.ide-grid {
		grid-template-columns: 1fr;
	}

	.ide-grid,
	.ide-grid--drawing {
		height: auto;
	}

	.ide-splitter {
		display: none;
	}

	.code-panel {
		height: clamp(32rem, 68vh, 44rem);
	}

	.result-panel {
		height: clamp(30rem, 68vh, 42rem);
	}

	.code-ide-workspace.is-sidebar-collapsed {
		grid-template-columns: auto minmax(0, 1fr);
	}

	.code-ide-sidebar {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
	}
}

@media (max-width: 820px) {
	.code-ide-page {
		width: min(100% - 1.25rem, 1680px);
	}

	.code-ide-hero,
	.editor-toolbar,
	.code-ide-sidebar {
		grid-template-columns: 1fr;
	}

	.editor-toolbar {
		grid-template-rows: auto;
		align-items: stretch;
	}

	.bluej-integration-panel {
		grid-template-columns: 1fr;
		align-items: stretch;
	}

	.bluej-integration-actions {
		justify-content: flex-start;
	}

	.project-title-field,
	.editor-actions {
		grid-column: 1;
		grid-row: auto;
	}

	.editor-actions {
		align-self: stretch;
		justify-content: stretch;
	}

	.editor-actions > .site-button {
		flex: 1 1 0;
	}

	.code-ide-status {
		min-width: 0;
	}

	.browser-project-import {
		align-items: stretch;
		flex-direction: column;
	}

	.shared-computer-clear {
		grid-template-columns: 1fr;
	}

	.shared-computer-clear__trigger {
		justify-self: start;
		white-space: normal;
	}

	.browser-project-import__actions {
		width: 100%;
	}

	.browser-project-import__actions .site-button {
		flex: 1 1 12rem;
	}

	.ide-settings-panel {
		right: auto;
		left: 0;
		width: min(26rem, calc(100vw - 2rem));
	}

	.turtle-canvas:not(.turtle-canvas--game) {
		width: 100%;
	}
}
</style>
