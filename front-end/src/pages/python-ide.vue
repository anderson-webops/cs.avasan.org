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
import {
	createPythonIdeProject,
	createRemotePythonIdeProject,
	deleteRemotePythonIdeProject,
	fetchPythonIdeProjects,
	getPythonIdeDefaultFileContent,
	getPythonIdeFileKindLabel,
	getPythonIdeModeLabel,
	getPythonIdeRunnableFile,
	isPythonIdePythonFile,
	isValidPythonFileName,
	loadLocalPythonProjects,
	normalizePythonFileName,
	pythonIdeAllowedFileExtensions,
	pythonIdeLibrarySupport,
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
}

const app = useAppStore();
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
const saveMessage = ref("Loading workspace");
const runMessage = ref("Ready");
const canvasRef = ref<HTMLCanvasElement | null>(null);
const artifactCounter = ref(0);
const outputCounter = ref(0);
const keyHandlers = new Map<string, () => void>();
const turtleClickHandlers = new Map<string, (x: number, y: number) => void>();
const gameKeysDown = new Set<string>();
const gameEvents: GameInputEvent[] = [];

let saveTimer: ReturnType<typeof window.setTimeout> | null = null;
let suppressAutoSave = false;
let resizeObserver: ResizeObserver | null = null;
let gameAnimationFrame: number | null = null;
let gameLoopRequested = false;
let gameTickInFlight = false;

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
		activeFile.value.content = content;
		touchSelectedProject();
		scheduleSave();
	}
});

const canSyncToAccount = computed(() => !!currentUser.value?._id);
const storageUserID = computed(() => currentUser.value?._id ?? null);
const sortedProjects = computed(() => [...projects.value]);
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

function normalizeProjectMode(value: string): PythonIdeMode {
	if (value === "data" || value === "pgzero" || value === "turtle")
		return value;
	return "python";
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

			const starter = await createRemotePythonIdeProject(
				createPythonIdeProject("turtle")
			);
			setProjects([starter]);
			saveMessage.value = "Synced to account";
			return;
		}

		const localProjects = loadLocalPythonProjects(storageUserID.value);
		setProjects(
			localProjects.length
				? localProjects
				: [createPythonIdeProject("turtle")]
		);
		persistLocalProjects();
	} catch (error) {
		const localProjects = loadLocalPythonProjects(storageUserID.value);
		setProjects(
			localProjects.length
				? localProjects
				: [createPythonIdeProject("turtle")]
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
			const remoteProject = await createRemotePythonIdeProject(starter);
			projects.value.unshift(remoteProject);
			selectedProjectID.value = remoteProject._id;
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

async function deleteProject(project: PythonIdeProject) {
	if (projects.value.length <= 1) {
		appendOutput("system", "Keep at least one project in the workspace.");
		return;
	}

	try {
		if (canSyncToAccount.value && !project._id.startsWith("local-")) {
			await deleteRemotePythonIdeProject(project._id);
		}
		projects.value = projects.value.filter(
			candidate => candidate._id !== project._id
		);
		selectedProjectID.value = projects.value[0]?._id ?? "";
		persistLocalProjects();
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
			`Use a safe file name ending in ${pythonIdeAllowedFileExtensions.join(", ")}.`
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
	keyHandlers.clear();
	turtleClickHandlers.clear();
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

function drawForward(distance: number) {
	const context = getCanvasContext();
	if (!context) return;

	const start = canvasCoordinates(turtleState.x, turtleState.y);
	const radians = (turtleState.heading * Math.PI) / 180;
	turtleState.x += Math.cos(radians) * distance;
	turtleState.y += Math.sin(radians) * distance;
	const end = canvasCoordinates(turtleState.x, turtleState.y);

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
	canvas.width = Math.max(1, Math.floor(rect.width * dpr));
	canvas.height = Math.max(1, Math.floor(rect.height * dpr));
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
}

function startGameLoop(tick: () => Promise<void>) {
	stopGameLoop();

	const runFrame = () => {
		gameAnimationFrame = requestAnimationFrame(runFrame);
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

	context.save();
	context.translate(x, y);
	context.rotate((angle * Math.PI) / 180);
	context.fillStyle = "#5eead4";
	context.strokeStyle = "#134e4a";
	context.lineWidth = 3;
	const left = -width / 2;
	const top = -height / 2;
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
	goto(x: number, y: number) {
		const context = getCanvasContext();
		const start = canvasCoordinates(turtleState.x, turtleState.y);
		const end = canvasCoordinates(x, y);
		turtleState.x = x;
		turtleState.y = y;
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
			onOutput: appendOutput
		});
		runMessage.value =
			project.mode === "data"
				? "Analysis ready"
				: project.mode === "pgzero"
					? "Game running"
					: project.mode === "turtle"
						? "Drawing ready"
						: "Run complete";
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Python run failed.";
		appendOutput("stderr", message);
		runMessage.value = "Run failed";
	} finally {
		isRunning.value = false;
	}
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
	gameEvents.push({
		type,
		x: point.x,
		y: point.y,
		button: gameMouseButton(event)
	});

	if (type !== "mousemove") event.preventDefault();
}

function dispatchCanvasPointerEvent(
	event: MouseEvent,
	type: GameInputEvent["type"]
) {
	if (selectedProject.value?.mode === "pgzero") {
		queueGamePointerEvent(event, type);
		return;
	}

	if (selectedProject.value?.mode !== "turtle" || type !== "mousedown")
		return;

	const handler = turtleClickHandlers.get(turtleMouseButton(event));
	if (!handler) return;

	const point = turtlePointerPosition(event);
	try {
		handler(point.x, point.y);
	} catch (error) {
		appendOutput(
			"stderr",
			error instanceof Error
				? error.message
				: "Turtle click handler failed."
		);
	}
	event.preventDefault();
	canvasRef.value?.focus();
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

	if (canvasRef.value) {
		resizeObserver = new ResizeObserver(() => resetActiveCanvas());
		resizeObserver.observe(canvasRef.value);
	}
});

onBeforeUnmount(() => {
	if (saveTimer) window.clearTimeout(saveTimer);
	window.removeEventListener("keydown", handleKeyDown);
	window.removeEventListener("keyup", handleKeyUp);
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

		<div v-else class="python-ide-workspace">
			<aside
				class="python-ide-sidebar"
				aria-label="Python projects and files"
			>
				<div class="sidebar-block">
					<div class="sidebar-heading">
						<span>Projects</span>
						<div class="sidebar-actions">
							<button
								class="icon-action"
								title="New Python project"
								type="button"
								@click="createProject('python')"
							>
								Py
							</button>
							<button
								class="icon-action"
								title="New data/AI notebook"
								type="button"
								@click="createProject('data')"
							>
								Da
							</button>
							<button
								class="icon-action"
								title="New Turtle project"
								type="button"
								@click="createProject('turtle')"
							>
								Tu
							</button>
							<button
								class="icon-action"
								title="New PyGame Zero project"
								type="button"
								@click="createProject('pgzero')"
							>
								Gm
							</button>
						</div>
					</div>

					<div class="project-list">
						<button
							v-for="project in sortedProjects"
							:key="project._id"
							class="project-button"
							:class="{
								'is-active':
									project._id === selectedProject?._id
							}"
							type="button"
							@click="selectedProjectID = project._id"
						>
							<span>{{
								project.title || "Untitled Project"
							}}</span>
							<small>{{
								getPythonIdeModeLabel(project.mode)
							}}</small>
						</button>
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
								title="Delete file"
								type="button"
								@click="deleteFile(file)"
							>
								x
							</button>
						</div>
					</div>
					<div class="new-file-row">
						<input
							v-model="newFileName"
							aria-label="New project file name"
							placeholder="helper.py or data.csv"
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
				</div>

				<div class="sidebar-block library-support">
					<div class="sidebar-heading">
						<span>Course libraries</span>
					</div>
					<div
						v-for="entry in pythonIdeLibrarySupport"
						:key="entry.name"
						class="library-support-row"
					>
						<div>
							<strong>{{ entry.name }}</strong>
							<p>{{ entry.detail }}</p>
						</div>
						<span
							:class="`library-status library-status--${entry.status}`"
						>
							{{
								entry.status === "browser"
									? "Browser"
									: entry.status === "shim"
										? "Shim"
										: "Local"
							}}
						</span>
					</div>
				</div>

				<button
					v-if="selectedProject"
					class="site-button site-button--ghost delete-project-button"
					type="button"
					@click="deleteProject(selectedProject)"
				>
					Delete project
				</button>
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
						class="site-button site-button--primary"
						:disabled="isRunning"
						type="button"
						@click="runCurrentProject"
					>
						{{ isRunning ? "Running" : "Run" }}
					</button>
				</div>

				<div class="ide-grid">
					<section class="code-panel" aria-label="Code editor">
						<div class="panel-header">
							<span>{{ activeFile?.name ?? "main.py" }}</span>
							<small
								>Python files can import each other; CSV, JSON,
								text, and Markdown files can be read by
								filename.</small
							>
						</div>
						<textarea
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

.project-list,
.file-list {
	display: grid;
	gap: 0.55rem;
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
	width: 2.7rem;
	height: 100%;
	min-height: 2.8rem;
	border: 1px solid var(--color-border);
	border-radius: 8px;
	background: rgba(248, 250, 252, 0.74);
	color: var(--color-ink-muted);
}

.new-file-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 0.5rem;
}

.new-file-row input,
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

.delete-project-button {
	margin-top: auto;
}

.library-support {
	align-self: start;
}

.library-support-row {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto;
	gap: 0.75rem;
	padding: 0.85rem 0;
	border-top: 1px solid var(--color-border);
}

.library-support-row strong {
	display: block;
	color: var(--color-ink-strong);
	font-size: 0.9rem;
}

.library-support-row p {
	margin: 0.25rem 0 0;
	color: var(--color-ink-muted);
	font-size: 0.78rem;
	line-height: 1.45;
}

.library-status {
	align-self: start;
	padding: 0.2rem 0.5rem;
	border-radius: 999px;
	font-size: 0.68rem;
	font-weight: 900;
	letter-spacing: 0.08em;
	text-transform: uppercase;
}

.library-status--browser {
	background: rgba(15, 118, 110, 0.14);
	color: #0f766e;
}

.library-status--shim {
	background: rgba(37, 99, 235, 0.13);
	color: #1d4ed8;
}

.library-status--local {
	background: rgba(180, 83, 9, 0.14);
	color: #92400e;
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

	.python-ide-sidebar {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		align-items: start;
	}

	.delete-project-button {
		grid-column: 1 / -1;
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
