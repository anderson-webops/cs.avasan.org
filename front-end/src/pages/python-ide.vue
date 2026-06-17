<script lang="ts" setup>
import type {
	PythonIdeFile,
	PythonIdeMode,
	PythonIdeProject
} from "@/modules/pythonIde";
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
	clearLocalPythonProjects,
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
	loadLocalPythonProjects,
	normalizeImportedPythonIdeFileName,
	normalizePythonFileName,
	normalizePythonIdeMode,
	pythonIdeAllowedFileExtensions,
	pythonIdeFileUploadAccept,
	pythonIdeModeForCourseId,
	pythonIdeProjectToPayload,
	saveLocalPythonProjects,
	updateRemotePythonIdeProject
} from "@/modules/pythonIde";
import {
	runPythonProject,
	warmPythonRuntime
} from "@/modules/pythonIdeRuntime";
import { useAppStore } from "@/stores/app";

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
}

interface TurtleFillState {
	active: boolean;
	color: string;
	points: { x: number; y: number }[];
}

interface GameCanvasState {
	width: number;
	height: number;
	background: string;
}

interface GameInputEvent {
	type: "keydown" | "keyup" | "mousedown" | "mouseup" | "mousemove";
	key?: string;
	x?: number;
	y?: number;
	button?: "left" | "middle" | "right";
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

const imageAssetExtensions = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];
const audioAssetExtensions = [".wav", ".mp3", ".ogg"];

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
const showProjectMenu = ref(false);
const showFileTools = ref(false);
const deleteCandidateProjectID = ref("");
const deleteConfirmText = ref("");
const sidebarCollapsed = ref(false);
const stopRequested = ref(false);
const saveMessage = ref("Loading workspace");
const runMessage = ref("Ready");
const canvasRef = ref<HTMLCanvasElement | null>(null);
const artifactCounter = ref(0);
const outputCounter = ref(0);
const keyHandlers = new Map<string, () => void>();
const turtleClickHandlers = new Map<string, (x: number, y: number) => void>();
const turtleDragHandlers = new Map<string, (x: number, y: number) => void>();
const turtleTimerHandles = new Set<ReturnType<typeof window.setTimeout>>();
const gameKeysDown = new Set<string>();
const gameEvents: GameInputEvent[] = [];
const gameImageCache = new Map<string, CachedGameImage>();
const gameSoundAudio = new Map<string, HTMLAudioElement>();

let saveTimer: ReturnType<typeof window.setTimeout> | null = null;
let suppressAutoSave = false;
let resizeObserver: ResizeObserver | null = null;
let gameAnimationFrame: number | null = null;
let gameLoopRequested = false;
let gameTickInFlight = false;
let activeTurtleDragButton: string | null = null;
let lastGamePointerPoint: { x: number; y: number } | null = null;
let gameMusicAudio: HTMLAudioElement | null = null;
let turtleStampCounter = 0;

const turtleState: TurtleState = {
	x: 0,
	y: 0,
	heading: 0,
	penDown: true,
	penColor: "#0f766e",
	fillColor: "#0f766e",
	lineWidth: 3,
	background: "#ffffff"
};

const turtleFillState: TurtleFillState = {
	active: false,
	color: turtleState.fillColor,
	points: []
};

const gameState: GameCanvasState = {
	width: 640,
	height: 400,
	background: "#111827"
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
	return (
		project.files.find(file => file.name === project.activeFileName) ??
		project.files[0] ??
		null
	);
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
		activeTurtleTimerCount.value > 0
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
const requestedCourseId = computed(() =>
	typeof route.query.course === "string" ? route.query.course : ""
);
const requestedStarterMode = computed(() => {
	const rawMode =
		typeof route.query.mode === "string" ? route.query.mode : "";
	const courseMode = pythonIdeModeForCourseId(requestedCourseId.value);
	return normalizePythonIdeMode(rawMode, courseMode ?? "turtle");
});

function normalizeProjectMode(value: string): PythonIdeMode {
	return normalizePythonIdeMode(value, "python");
}

function appendOutput(kind: OutputLine["kind"], text: string) {
	if (!text) return;
	outputLines.value.push({
		id: outputCounter.value++,
		kind,
		text
	});
}

function appendArtifact(artifact: RuntimeArtifact) {
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

function mergeRuntimeProjectFiles(
	project: PythonIdeProject,
	files: PythonIdeFile[]
) {
	if (selectedProject.value?._id !== project._id) return;

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
		const existingIndex = project.files.findIndex(
			candidate => candidate.name === file.name
		);

		if (existingIndex >= 0) {
			const existingFile = project.files[existingIndex];
			if (
				existingFile?.content === nextFile.content &&
				(existingFile.encoding ?? "text") === nextFile.encoding
			) {
				continue;
			}
			project.files.splice(existingIndex, 1, nextFile);
		} else {
			project.files.push(nextFile);
			addedCount += 1;
		}
		changedCount += 1;
	}

	if (!changedCount) return;
	touchSelectedProject();
	void saveSelectedProject();
	appendOutput(
		"system",
		`Saved ${changedCount} changed project file${changedCount === 1 ? "" : "s"}${addedCount ? `, including ${addedCount} new file${addedCount === 1 ? "" : "s"}` : ""}.`
	);
}

function touchSelectedProject() {
	if (!selectedProject.value) return;
	selectedProject.value.updatedAt = new Date().toISOString();
}

function setProjects(nextProjects: PythonIdeProject[]) {
	projects.value = nextProjects;
	selectedProjectID.value = nextProjects[0]?._id ?? "";
}

function persistLocalProjects() {
	saveLocalPythonProjects(projects.value, storageUserID.value);
	saveMessage.value = canSyncToAccount.value
		? "Saved locally after sync issue"
		: "Saved locally";
}

async function loadProjects() {
	isLoading.value = true;
	suppressAutoSave = true;
	try {
		if (canSyncToAccount.value) {
			const remoteProjects = await fetchPythonIdeProjects();
			if (remoteProjects.length) {
				setProjects(remoteProjects);
				saveMessage.value = "Synced to account";
				return;
			}

			const localProjects = loadLocalPythonProjects(storageUserID.value);
			if (localProjects.length) {
				const migratedProjects = await Promise.all(
					localProjects.map(project =>
						createRemotePythonIdeProject(
							pythonIdeProjectToPayload(project)
						)
					)
				);
				setProjects(migratedProjects);
				clearLocalPythonProjects(storageUserID.value);
				saveMessage.value = "Synced local projects to account";
				return;
			}

			const starter = await createRemotePythonIdeProject(
				pythonIdeProjectToPayload(
					createPythonIdeProject(requestedStarterMode.value)
				)
			);
			setProjects([starter]);
			clearLocalPythonProjects(storageUserID.value);
			saveMessage.value = "Synced to account";
			return;
		}

		const localProjects = loadLocalPythonProjects(storageUserID.value);
		setProjects(
			localProjects.length
				? localProjects
				: [createPythonIdeProject(requestedStarterMode.value)]
		);
		persistLocalProjects();
	} catch (error) {
		const localProjects = loadLocalPythonProjects(storageUserID.value);
		setProjects(
			localProjects.length
				? localProjects
				: [createPythonIdeProject(requestedStarterMode.value)]
		);
		saveMessage.value =
			error instanceof Error ? error.message : "Using local workspace";
	} finally {
		await nextTick();
		suppressAutoSave = false;
		isLoading.value = false;
		resetActiveCanvas();
	}
}

async function saveSelectedProject() {
	const project = selectedProject.value;
	if (!project || suppressAutoSave) return;

	isSaving.value = true;
	try {
		if (!canSyncToAccount.value || project._id.startsWith("local-")) {
			persistLocalProjects();
			return;
		}

		const savedProject = await updateRemotePythonIdeProject(project._id, {
			title: project.title,
			mode: project.mode,
			files: project.files,
			activeFileName: project.activeFileName
		});
		const index = projects.value.findIndex(
			candidate => candidate._id === project._id
		);
		if (index >= 0) projects.value.splice(index, 1, savedProject);
		clearLocalPythonProjects(storageUserID.value);
		saveMessage.value = "Synced to account";
	} catch (error) {
		persistLocalProjects();
		appendOutput(
			"system",
			error instanceof Error
				? error.message
				: "Save failed; kept a local copy."
		);
	} finally {
		isSaving.value = false;
	}
}

function scheduleSave() {
	if (suppressAutoSave) return;
	if (saveTimer) window.clearTimeout(saveTimer);
	saveTimer = window.setTimeout(() => {
		void saveSelectedProject();
	}, 700);
}

async function createProject(mode: PythonIdeMode) {
	const starter = createPythonIdeProject(mode);
	suppressAutoSave = true;
	try {
		if (canSyncToAccount.value) {
			const remoteProject = await createRemotePythonIdeProject(
				pythonIdeProjectToPayload(starter)
			);
			projects.value.unshift(remoteProject);
			selectedProjectID.value = remoteProject._id;
			clearLocalPythonProjects(storageUserID.value);
			saveMessage.value = "Synced to account";
		} else {
			projects.value.unshift(starter);
			selectedProjectID.value = starter._id;
			persistLocalProjects();
		}
	} catch (error) {
		projects.value.unshift(starter);
		selectedProjectID.value = starter._id;
		persistLocalProjects();
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

async function createProjectFromMenu(mode: PythonIdeMode) {
	showProjectMenu.value = false;
	await createProject(mode);
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
		selectedProjectID.value = projects.value[0]?._id ?? "";
		if (isRemoteProject) {
			clearLocalPythonProjects(storageUserID.value);
			saveMessage.value = "Synced to account";
		} else {
			persistLocalProjects();
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

function updateProjectMode(event: Event) {
	if (!selectedProject.value) return;
	const select = event.target as HTMLSelectElement;
	selectedProject.value.mode = normalizeProjectMode(select.value);
	touchSelectedProject();
	scheduleSave();
	void nextTick(resetActiveCanvas);
}

function selectFile(fileName: string) {
	if (!selectedProject.value) return;
	selectedProject.value.activeFileName = fileName;
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

		const imported = await readImportedProjectFile(file, fileName);
		const nextFile: PythonIdeFile = {
			name: fileName,
			content: imported.content,
			encoding: imported.encoding
		};
		const existingIndex = project.files.findIndex(
			candidate => candidate.name === fileName
		);

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
	if (project.activeFileName === file.name) {
		project.activeFileName =
			getPythonIdeRunnableFile(project)?.name ??
			project.files[0]?.name ??
			"main.py";
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
}

function canvasCoordinates(x: number, y: number) {
	const canvas = canvasRef.value;
	if (!canvas) return { x: 0, y: 0 };
	const rect = canvas.getBoundingClientRect();
	return {
		x: rect.width / 2 + x,
		y: rect.height / 2 - y
	};
}

function getCanvasContext() {
	const canvas = canvasRef.value;
	if (!canvas) return null;
	return canvas.getContext("2d");
}

function resizeCanvasForDisplay() {
	const canvas = canvasRef.value;
	const context = getCanvasContext();
	if (!canvas || !context) return null;

	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	canvas.width = Math.max(1, Math.floor(rect.width * dpr));
	canvas.height = Math.max(1, Math.floor(rect.height * dpr));
	context.setTransform(dpr, 0, 0, dpr, 0, 0);

	return { context, rect };
}

function resetTurtleCanvas() {
	clearTurtleTimers();
	keyHandlers.clear();
	turtleClickHandlers.clear();
	turtleDragHandlers.clear();
	activeTurtleDragButton = null;
	turtleStampCounter = 0;
	turtleFillState.active = false;
	turtleFillState.points = [];
	stopGameLoop();
	const canvasContext = resizeCanvasForDisplay();
	if (!canvasContext) return;

	const { context, rect } = canvasContext;
	turtleState.x = 0;
	turtleState.y = 0;
	turtleState.heading = 0;
	turtleState.penDown = true;
	turtleState.penColor = "#0f766e";
	turtleState.fillColor = "#0f766e";
	turtleState.lineWidth = 3;

	context.fillStyle = turtleState.background;
	context.fillRect(0, 0, rect.width, rect.height);
}

function clearTurtleTimers() {
	for (const handle of turtleTimerHandles) {
		window.clearTimeout(handle);
	}
	turtleTimerHandles.clear();
	activeTurtleTimerCount.value = 0;
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
	const context = getCanvasContext();
	const points = turtleFillState.points;
	turtleFillState.active = false;
	turtleFillState.points = [];
	if (!context || points.length < 3) return;

	const [firstPoint, ...remainingPoints] = points;
	if (!firstPoint) return;

	const firstCanvasPoint = canvasCoordinates(firstPoint.x, firstPoint.y);
	context.fillStyle = turtleFillState.color;
	context.beginPath();
	context.moveTo(firstCanvasPoint.x, firstCanvasPoint.y);
	for (const point of remainingPoints) {
		const canvasPoint = canvasCoordinates(point.x, point.y);
		context.lineTo(canvasPoint.x, canvasPoint.y);
	}
	context.closePath();
	context.fill();
	context.strokeStyle = turtleState.penColor;
	context.lineWidth = turtleState.lineWidth;
	context.lineCap = "round";
	context.lineJoin = "round";
	context.stroke();
}

function drawForward(distance: number) {
	const context = getCanvasContext();
	if (!context) return;

	const start = canvasCoordinates(turtleState.x, turtleState.y);
	const radians = (turtleState.heading * Math.PI) / 180;
	turtleState.x += Math.cos(radians) * distance;
	turtleState.y += Math.sin(radians) * distance;
	const end = canvasCoordinates(turtleState.x, turtleState.y);
	trackTurtleFillPoint(turtleState.x, turtleState.y);

	if (!turtleState.penDown) return;
	context.strokeStyle = turtleState.penColor;
	context.lineWidth = turtleState.lineWidth;
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(start.x, start.y);
	context.lineTo(end.x, end.y);
	context.stroke();
}

function drawCircle(radius: number) {
	const context = getCanvasContext();
	if (!context) return;
	const center = canvasCoordinates(turtleState.x, turtleState.y + radius);
	context.strokeStyle = turtleState.penColor;
	context.lineWidth = turtleState.lineWidth;
	context.beginPath();
	context.arc(center.x, center.y, Math.abs(radius), 0, Math.PI * 2);
	if (turtleFillState.active) {
		context.fillStyle = turtleState.fillColor;
		context.fill();
		context.beginPath();
		context.arc(center.x, center.y, Math.abs(radius), 0, Math.PI * 2);
	}
	context.stroke();
}

function drawDot(size: number, color?: string) {
	const context = getCanvasContext();
	if (!context) return;
	const point = canvasCoordinates(turtleState.x, turtleState.y);
	context.fillStyle = color || turtleState.penColor;
	context.beginPath();
	context.arc(point.x, point.y, Math.max(1, size) / 2, 0, Math.PI * 2);
	context.fill();
}

function stampTurtle() {
	const context = getCanvasContext();
	if (!context) return ++turtleStampCounter;

	const point = canvasCoordinates(turtleState.x, turtleState.y);
	const radians = (turtleState.heading * Math.PI) / 180;
	const size = 14;
	const tip = { x: Math.cos(radians) * size, y: -Math.sin(radians) * size };
	const leftWing = {
		x: Math.cos(radians + 2.45) * size,
		y: -Math.sin(radians + 2.45) * size
	};
	const rightWing = {
		x: Math.cos(radians - 2.45) * size,
		y: -Math.sin(radians - 2.45) * size
	};

	context.fillStyle = turtleState.penColor;
	context.strokeStyle = "#0f172a";
	context.lineWidth = 1.5;
	context.beginPath();
	context.moveTo(point.x + tip.x, point.y + tip.y);
	for (const nextPoint of [leftWing, rightWing]) {
		context.lineTo(point.x + nextPoint.x, point.y + nextPoint.y);
	}
	context.closePath();
	context.fill();
	context.stroke();

	return ++turtleStampCounter;
}

function drawText(text: string) {
	const context = getCanvasContext();
	if (!context) return;
	const point = canvasCoordinates(turtleState.x, turtleState.y);
	context.fillStyle = turtleState.penColor;
	context.font = "16px Avenir Next, Segoe UI, sans-serif";
	context.fillText(text, point.x, point.y);
}

function setGameCanvasTransform() {
	const canvas = canvasRef.value;
	const context = getCanvasContext();
	if (!canvas || !context) return null;

	const rect = canvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	const nextWidth = Math.max(1, Math.floor(rect.width * dpr));
	const nextHeight = Math.max(1, Math.floor(rect.height * dpr));
	if (canvas.width !== nextWidth) canvas.width = nextWidth;
	if (canvas.height !== nextHeight) canvas.height = nextHeight;
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

function clearGameCanvas(color = gameState.background) {
	const context = setGameCanvasTransform();
	if (!context) return;

	context.fillStyle = color;
	context.fillRect(0, 0, gameState.width, gameState.height);
}

function resetGameCanvas(width = 640, height = 400) {
	keyHandlers.clear();
	gameKeysDown.clear();
	gameEvents.length = 0;
	gameLoopRequested = false;
	gameTickInFlight = false;
	stopAllGameAudio();
	gameState.width = Math.max(1, width);
	gameState.height = Math.max(1, height);
	gameState.background = "#111827";
	clearGameCanvas();
}

function stopGameLoop() {
	if (gameAnimationFrame !== null) {
		cancelAnimationFrame(gameAnimationFrame);
		gameAnimationFrame = null;
	}
	gameLoopRequested = false;
	gameTickInFlight = false;
	isGameLoopActive.value = false;
}

function stopAllGameAudio() {
	for (const audio of gameSoundAudio.values()) {
		audio.pause();
		audio.currentTime = 0;
	}
	gameSoundAudio.clear();
	stopGameMusic();
}

function assetCandidateNames(
	folder: "images" | "music" | "sounds",
	name: string,
	extensions: string[]
) {
	const normalized = name
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\/+/, "")
		.replace(/^images\/|^music\/|^sounds\//i, "");
	if (!normalized) return [];
	if (/\.[\dA-Z]+$/i.test(normalized)) return [`${folder}/${normalized}`];
	return extensions.map(extension => `${folder}/${normalized}${extension}`);
}

function findProjectAssetFile(
	folder: "images" | "music" | "sounds",
	name: string,
	extensions: string[]
) {
	const project = selectedProject.value;
	if (!project) return null;
	const candidateNames = new Set(
		assetCandidateNames(folder, name, extensions)
	);
	return project.files.find(file => candidateNames.has(file.name)) ?? null;
}

function getGameImageEntry(file: PythonIdeFile) {
	const src = getPythonIdeAssetDataUrl(file);
	if (!src) return null;

	const cached = gameImageCache.get(file.name);
	if (cached?.src === src) return cached;

	const entry: CachedGameImage = {
		element: new Image(),
		failed: false,
		loaded: false,
		src
	};
	entry.element.addEventListener("load", () => {
		entry.loaded = true;
	});
	entry.element.addEventListener("error", () => {
		entry.failed = true;
	});
	entry.element.src = src;
	gameImageCache.set(file.name, entry);
	return entry;
}

function playProjectAudio(
	folder: "music" | "sounds",
	name: string,
	loop = false
) {
	const file = findProjectAssetFile(folder, name, audioAssetExtensions);
	if (!file) {
		appendOutput("system", `Missing ${folder} asset: ${name}`);
		return null;
	}

	const src = getPythonIdeAssetDataUrl(file);
	if (!src) {
		appendOutput(
			"system",
			`Cannot play ${file.name}; import an audio file first.`
		);
		return null;
	}

	const audio = new Audio(src);
	audio.loop = loop;
	void audio.play().catch((error: unknown) => {
		appendOutput(
			"system",
			error instanceof Error
				? `Audio playback was blocked: ${error.message}`
				: "Audio playback was blocked."
		);
	});
	return audio;
}

function playGameSound(name: string) {
	const audio = playProjectAudio("sounds", name);
	if (audio) gameSoundAudio.set(name, audio);
}

function stopGameSound(name: string) {
	const audio = gameSoundAudio.get(name);
	if (!audio) return;
	audio.pause();
	audio.currentTime = 0;
	gameSoundAudio.delete(name);
}

function playGameMusic(name: string) {
	stopGameMusic();
	gameMusicAudio = playProjectAudio("music", name, true);
}

function stopGameMusic() {
	if (!gameMusicAudio) return;
	gameMusicAudio.pause();
	gameMusicAudio.currentTime = 0;
	gameMusicAudio = null;
}

function startGameLoop(tick: () => Promise<void>) {
	stopGameLoop();
	isGameLoopActive.value = true;

	const runTick = () => {
		if (gameTickInFlight) return;

		gameTickInFlight = true;
		tick()
			.catch((error: unknown) => {
				appendOutput(
					"stderr",
					error instanceof Error ? error.message : "Game loop failed."
				);
				stopGameLoop();
			})
			.finally(() => {
				gameTickInFlight = false;
			});
	};

	const runFrame = () => {
		gameAnimationFrame = requestAnimationFrame(runFrame);
		runTick();
	};

	runTick();
	runFrame();
}

function drawGameActor(
	image: string,
	x: number,
	y: number,
	width: number,
	height: number,
	angle: number
) {
	const context = setGameCanvasTransform();
	if (!context) return;
	const assetFile = findProjectAssetFile(
		"images",
		image,
		imageAssetExtensions
	);
	const assetImage = assetFile ? getGameImageEntry(assetFile) : null;

	context.save();
	context.translate(x, y);
	context.rotate((angle * Math.PI) / 180);
	const left = -width / 2;
	const top = -height / 2;
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
	filled: boolean
) {
	const context = setGameCanvasTransform();
	if (!context) return;

	if (filled) {
		context.fillStyle = color;
		context.fillRect(x, y, width, height);
		return;
	}

	context.strokeStyle = color;
	context.lineWidth = 3;
	context.strokeRect(x, y, width, height);
}

function normalizeKey(key: string) {
	const keyMap: Record<string, string> = {
		down: "arrowdown",
		enter: "enter",
		escape: "escape",
		left: "arrowleft",
		return: "enter",
		right: "arrowright",
		space: " ",
		up: "arrowup"
	};
	return keyMap[key.toLowerCase()] ?? key.toLowerCase();
}

function pythonGameKey(key: string) {
	const keyMap: Record<string, string> = {
		" ": "space",
		arrowdown: "down",
		arrowleft: "left",
		arrowright: "right",
		arrowup: "up",
		enter: "return",
		escape: "escape"
	};
	return keyMap[normalizeKey(key)] ?? normalizeKey(key);
}

const turtleBridge: TurtleBridge = {
	reset: resetTurtleCanvas,
	clear: resetTurtleCanvas,
	bgcolor(color: string) {
		turtleState.background = color;
		resetTurtleCanvas();
	},
	beginFill: beginTurtleFill,
	endFill: endTurtleFill,
	forward: drawForward,
	right(degrees: number) {
		turtleState.heading -= degrees;
	},
	left(degrees: number) {
		turtleState.heading += degrees;
	},
	setheading(degrees: number) {
		turtleState.heading = degrees;
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
		turtleState.x = x;
		turtleState.y = y;
		turtleState.heading = heading;
		turtleState.penDown = penDown;
		turtleState.penColor = penColor;
		turtleState.fillColor = fillColor;
		turtleState.lineWidth = Math.max(1, lineWidth);
	},
	xcor: () => turtleState.x,
	ycor: () => turtleState.y,
	goto(x: number, y: number) {
		const context = getCanvasContext();
		const start = canvasCoordinates(turtleState.x, turtleState.y);
		const end = canvasCoordinates(x, y);
		turtleState.x = x;
		turtleState.y = y;
		trackTurtleFillPoint(x, y);
		if (!context || !turtleState.penDown) return;
		context.strokeStyle = turtleState.penColor;
		context.lineWidth = turtleState.lineWidth;
		context.lineCap = "round";
		context.beginPath();
		context.moveTo(start.x, start.y);
		context.lineTo(end.x, end.y);
		context.stroke();
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
			return;
		}
		keyHandlers.set(normalizeKey(key), callback);
	},
	registerClick(
		button: string,
		callback: ((x: number, y: number) => void) | null
	) {
		if (!callback) {
			turtleClickHandlers.delete(button);
			return;
		}
		turtleClickHandlers.set(button, callback);
	},
	registerDrag(
		button: string,
		callback: ((x: number, y: number) => void) | null
	) {
		if (!callback) {
			turtleDragHandlers.delete(button);
			if (activeTurtleDragButton === button)
				activeTurtleDragButton = null;
			return;
		}
		turtleDragHandlers.set(button, callback);
	},
	scheduleTimer(delayMs: number, callback: (() => void) | null) {
		if (!callback) return;

		const handle = window.setTimeout(
			() => {
				turtleTimerHandles.delete(handle);
				activeTurtleTimerCount.value = turtleTimerHandles.size;
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
			},
			Math.max(0, delayMs)
		);

		turtleTimerHandles.add(handle);
		activeTurtleTimerCount.value = turtleTimerHandles.size;
	},
	listen() {
		canvasRef.value?.focus();
	}
};

const gameBridge: GameBridge = {
	reset: resetGameCanvas,
	clear: () => clearGameCanvas(),
	fill(color: string) {
		gameState.background = color;
		clearGameCanvas(color);
	},
	drawActor: drawGameActor,
	drawText: drawGameText,
	drawRect: drawGameRect,
	isKeyDown(key: string) {
		return gameKeysDown.has(normalizeKey(key));
	},
	popEventsJson() {
		const events = JSON.stringify(gameEvents.splice(0));
		return events === "[]" ? "" : events;
	},
	requestLoop() {
		gameLoopRequested = true;
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
	stopMusic: stopGameMusic,
	log(text: string) {
		appendOutput("system", text);
	}
};

function resetActiveCanvas() {
	if (selectedProject.value?.mode === "pgzero") {
		resetGameCanvas(gameState.width, gameState.height);
		return;
	}

	resetTurtleCanvas();
}

async function runCurrentProject() {
	const project = selectedProject.value;
	if (!project) return;

	stopRequested.value = false;
	await saveSelectedProject();
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

	try {
		await runPythonProject({
			files: project.files,
			activeFileName: runnableFile.name,
			inputText: inputText.value,
			mode: project.mode,
			gameBridge,
			turtleBridge,
			onArtifact: appendArtifact,
			onProjectFilesUpdate: files =>
				mergeRuntimeProjectFiles(project, files),
			onOutput: appendOutput
		});
		if (!stopRequested.value) {
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
		appendOutput("stderr", formatPythonRuntimeError(error));
		runMessage.value = "Run failed";
	} finally {
		isRunning.value = false;
		stopRequested.value = false;
	}
}

function stopCurrentProject() {
	if (!runControlIsStop.value) return;
	const hadPythonRunInFlight = isRunning.value;
	stopRequested.value = true;
	clearTurtleTimers();
	stopGameLoop();
	stopAllGameAudio();
	keyHandlers.clear();
	gameKeysDown.clear();
	gameEvents.length = 0;
	turtleClickHandlers.clear();
	turtleDragHandlers.clear();
	activeTurtleDragButton = null;
	runMessage.value = "Stopped";
	appendOutput("system", "Stopped active canvas handlers.");
	if (!hadPythonRunInFlight) stopRequested.value = false;
}

function activateRunControl() {
	if (runControlIsStop.value) {
		stopCurrentProject();
		return;
	}
	void runCurrentProject();
}

function handleKeyDown(event: KeyboardEvent) {
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

	const normalizedKey = normalizeKey(event.key);
	const wasDown = gameKeysDown.has(normalizedKey);
	gameKeysDown.add(normalizedKey);
	if (!wasDown) {
		gameEvents.push({
			type: "keydown",
			key: pythonGameKey(event.key)
		});
	}

	if (
		[" ", "arrowdown", "arrowleft", "arrowright", "arrowup"].includes(
			normalizedKey
		)
	) {
		event.preventDefault();
	}
}

function handleKeyUp(event: KeyboardEvent) {
	if (selectedProject.value?.mode !== "pgzero") return;

	const normalizedKey = normalizeKey(event.key);
	gameKeysDown.delete(normalizedKey);
	gameEvents.push({
		type: "keyup",
		key: pythonGameKey(event.key)
	});
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

	if (type === "mouseup") lastGamePointerPoint = null;
	if (type !== "mousemove" || event.buttons) event.preventDefault();
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
	canvasRef.value?.focus();
}

function clearTurtleDrag() {
	activeTurtleDragButton = null;
}

watch(
	() => currentUser.value?._id,
	() => {
		void loadProjects();
	}
);

watch(selectedProjectID, () => {
	void nextTick(resetActiveCanvas);
});

onMounted(() => {
	warmPythonRuntime();
	void loadProjects();
	window.addEventListener("keydown", handleKeyDown);
	window.addEventListener("keyup", handleKeyUp);
	window.addEventListener("mouseup", clearTurtleDrag);

	if (canvasRef.value) {
		resizeObserver = new ResizeObserver(() => resetActiveCanvas());
		resizeObserver.observe(canvasRef.value);
	}
});

onBeforeUnmount(() => {
	if (saveTimer) window.clearTimeout(saveTimer);
	window.removeEventListener("keydown", handleKeyDown);
	window.removeEventListener("keyup", handleKeyUp);
	window.removeEventListener("mouseup", clearTurtleDrag);
	clearTurtleTimers();
	stopGameLoop();
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
					<label>
						<span>Mode</span>
						<select
							:value="selectedProject.mode"
							@change="updateProjectMode"
						>
							<option value="python">Python</option>
							<option value="data">Data / AI</option>
							<option value="turtle">Python Turtle</option>
							<option value="pgzero">PyGame Zero</option>
						</select>
					</label>
					<button
						class="site-button site-button--secondary"
						:disabled="isSaving"
						type="button"
						@click="saveSelectedProject"
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

				<div class="ide-grid">
					<section class="code-panel" aria-label="Code editor">
						<div class="panel-header">
							<span>{{ activeFile?.name ?? "main.py" }}</span>
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
						<textarea
							v-else
							v-model="activeFileContent"
							autocapitalize="off"
							autocomplete="off"
							autocorrect="off"
							class="code-editor"
							spellcheck="false"
						/>
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

						<div v-show="usesDrawingCanvas" class="canvas-shell">
							<canvas
								ref="canvasRef"
								:aria-label="`${selectedModeLabel} canvas`"
								class="turtle-canvas"
								tabindex="0"
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
							/>
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
	width: min(1680px, calc(100% - 2rem));
	gap: 1.25rem;
}

.python-ide-page,
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
	border-color: rgba(148, 163, 184, 0.38);
	background: #cbd5e1;
	color: rgba(100, 116, 139, 0.78);
}

.file-delete.is-disabled::after,
.file-delete:disabled::after {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 135%;
	height: 2px;
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.78);
	content: "";
	transform: translate(-50%, -50%) rotate(-45deg);
}

html.dark .file-delete.is-disabled,
html.dark .file-delete:disabled {
	border-color: rgba(148, 163, 184, 0.36);
	background: #cbd5e1;
	color: rgba(100, 116, 139, 0.78);
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
.editor-toolbar input,
.editor-toolbar select,
.stdin-panel textarea {
	width: 100%;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	background: rgba(255, 255, 255, 0.84);
	color: var(--color-ink);
}

.new-file-row input,
.project-delete-confirm input,
.editor-toolbar input,
.editor-toolbar select {
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
	grid-template-columns: minmax(15rem, 1fr) minmax(10rem, 14rem) auto auto;
	gap: 0.75rem;
	align-items: end;
}

.editor-toolbar label,
.stdin-panel {
	display: grid;
	gap: 0.35rem;
}

.ide-grid {
	min-height: 38rem;
	display: grid;
	grid-template-columns: minmax(0, 1.08fr) minmax(24rem, 0.92fr);
	gap: 1rem;
}

.code-panel,
.result-panel {
	min-width: 0;
	display: grid;
	grid-template-rows: auto minmax(0, 1fr);
	overflow: hidden;
}

.panel-header {
	padding: 0.9rem 1rem;
	border-bottom: 1px solid var(--color-border);
}

.panel-header small {
	color: var(--color-ink-muted);
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0;
	text-transform: none;
}

.panel-link {
	color: var(--color-accent);
	font-size: 0.84rem;
	font-weight: 800;
}

.code-editor {
	width: 100%;
	min-height: 100%;
	padding: 1rem;
	border: 0;
	outline: 0;
	resize: none;
	background: #07111f;
	color: #d7fbe8;
	font-family:
		"SFMono-Regular", "Cascadia Code", "Liberation Mono", monospace;
	font-size: 0.94rem;
	line-height: 1.58;
	tab-size: 4;
	white-space: pre;
}

.asset-file-preview {
	min-height: 100%;
	display: grid;
	place-items: center;
	gap: 1rem;
	padding: 1.25rem;
	background: #07111f;
	color: #d7fbe8;
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
	color: #b7d4c6;
	font-size: 0.9rem;
	font-weight: 700;
}

.result-panel {
	grid-template-rows: auto auto minmax(0, 1fr);
}

.canvas-shell {
	padding: 1rem;
	border-bottom: 1px solid var(--color-border);
	background:
		linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
		linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
		#f8fafc;
	background-size: 24px 24px;
}

.turtle-canvas {
	width: 100%;
	height: 23rem;
	border: 1px solid var(--color-border);
	border-radius: 14px;
	background: #fff;
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
	border-bottom: 1px solid var(--color-border);
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
	background: #07111f;
	color: #e2e8f0;
}

.empty-output {
	color: #94a3b8;
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
	color: #fecaca;
}

.output-line--system {
	color: #a7f3d0;
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
		width: min(100% - 1rem, 1680px);
	}

	.python-ide-hero,
	.editor-toolbar,
	.python-ide-sidebar {
		grid-template-columns: 1fr;
	}

	.python-ide-status {
		min-width: 0;
	}

	.turtle-canvas {
		height: 18rem;
	}
}
</style>
