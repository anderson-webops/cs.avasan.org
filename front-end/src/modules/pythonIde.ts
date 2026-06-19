import { api } from "@/api";
import {
	listPreviewFiles,
	loadPreviewFile,
	parseGitHubResource
} from "@/modules/codePreview";

const WHITESPACE_RE = /\s+/g;
const FILE_EXTENSION_RE = /\.[\dA-Z]+$/i;
const PYTHON_EXTENSION_RE = /\.py$/i;
const SAFE_FILE_SEGMENT_RE = /^\w[\w.-]*$/;
const ROOT_TEXT_FILE_RE = /^\w[\w.-]*\.(?:csv|json|md|py|txt)$/i;
const IMAGE_FILE_RE = /^images\/\w[\w.-]*\.(?:gif|jpe?g|png|svg|webp)$/i;
const AUDIO_FILE_RE = /^(?:music|sounds)\/\w[\w.-]*\.(?:mp3|ogg|wav)$/i;
const ASSET_DIRECTORY_NAMES = new Set(["images", "music", "sounds"]);
const PYTHON_IDE_RUNTIME_RESERVED_FILE_NAMES = new Set([
	"_classes_artifacts.py",
	"_classes_keras.py",
	"_classes_pgzero.py",
	"keras.py",
	"pgzero.py",
	"pgzrun.py",
	"pygame.py",
	"pysynth.py",
	"streamlit.py",
	"tensorflow.py",
	"turtle.py",
	"zrect.py"
]);
const PYTHON_IDE_RUNTIME_RESERVED_ROOTS = new Set([
	"keras",
	"pgzero",
	"tensorflow"
]);
const TEXT_FILE_RE = /\.(?:csv|json|md|py|txt|svg)$/i;
const IMAGE_EXTENSION_RE = /\.(?:gif|jpe?g|png|svg|webp)$/i;
const SOUND_EXTENSION_RE = /\.wav$/i;
const MUSIC_EXTENSION_RE = /\.(?:mp3|ogg)$/i;
const STARTER_RELATIVE_PREFIX_RE = /^(?:starter|src)\//i;
const PYTHON_IDE_INDEXED_DB_NAME = "classes-python-ide";
const PYTHON_IDE_INDEXED_DB_VERSION = 1;
const PYTHON_IDE_PROJECT_STORE = "projectStores";

export type PythonIdeFileEncoding = "text" | "base64";

export type PythonIdeMode = "data" | "pgzero" | "python" | "turtle";
export type PythonIdeProjectTemplate = "blank" | "course" | "demo";

export interface PythonIdeFile {
	name: string;
	content: string;
	encoding?: PythonIdeFileEncoding;
}

export interface PythonIdeProject {
	_id: string;
	title: string;
	mode: PythonIdeMode;
	files: PythonIdeFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface PythonIdeProjectPayload {
	title?: string;
	mode?: PythonIdeMode;
	files?: PythonIdeFile[];
	activeFileName?: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
}

export interface CreatePythonIdeProjectOptions {
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	files?: PythonIdeFile[];
	starterLabel?: string;
	starterUrl?: string;
	template?: PythonIdeProjectTemplate;
	title?: string;
}

interface PythonIdeProjectStorageRecord {
	key: string;
	projects: PythonIdeProject[];
	updatedAt: string;
}

export interface PythonIdeLibrarySupport {
	name: string;
	status: "browser" | "shim" | "local";
	detail: string;
}

export const pythonIdeStorageNamespace = "classes-python-ide-projects";
export const pythonIdeAllowedFileExtensions = [
	".py",
	".csv",
	".json",
	".txt",
	".md",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".svg",
	".webp",
	".wav",
	".mp3",
	".ogg"
] as const;
export const pythonIdeFileUploadAccept =
	pythonIdeAllowedFileExtensions.join(",");

let pythonIdeStorageDbPromise: Promise<IDBDatabase> | null = null;

export const pythonIdeLibrarySupport: PythonIdeLibrarySupport[] = [
	{
		name: "Python standard library",
		status: "browser",
		detail: "Core course modules such as random, math, json, csv, time, pathlib, and collections run directly in the browser runtime."
	},
	{
		name: "Turtle and PyGame Zero",
		status: "shim",
		detail: "Turtle drawing, filled shapes with begin_fill()/end_fill(), colormode()/RGB colors, independent Turtle() objects for list/collision projects, coordinate helpers such as xcor(), ycor(), distance(), stamp(), Screen.onkey, Screen.onclick, Screen.ontimer, Turtle.ondrag, Actor, screen, keyboard, mouse handlers, clock, Rect, images/, sounds/, music/, and common PyGame Zero patterns run through course-specific browser shims."
	},
	{
		name: "Data science stack",
		status: "browser",
		detail: "NumPy, pandas, matplotlib, and scikit-learn load through Pyodide; NetworkX, Altair, and Seaborn are installed on demand for imported projects."
	},
	{
		name: "Streamlit-style reports",
		status: "shim",
		detail: "Common st.write, dataframe, pyplot, altair_chart, selectbox, slider, checkbox, columns, and metric calls render as IDE output or deterministic browser controls, but full Streamlit apps still require a local/deployed server."
	},
	{
		name: "PySynth song projects",
		status: "shim",
		detail: "Python Level 2 song-generator projects can call make_wav(...) to create a playable WAV artifact in the browser output."
	},
	{
		name: "TensorFlow / Keras",
		status: "shim",
		detail: "Sequential, Dense, common layers, compile(), fit(), evaluate(), predict(), simple datasets, and ImageDataGenerator imports run through a lightweight teaching shim; real neural-network training still belongs in Colab or local Python."
	}
];

const pythonIdeCourseModes: Record<string, PythonIdeMode> = {
	"ai-level-1": "data",
	"data-science-in-python": "data",
	"machine-learning": "data",
	pygames: "pgzero",
	"python-level-1": "turtle",
	"python-level-2": "python",
	"python-level-3": "python",
	"python-to-java-and-cpp-bridge": "python",
	"pythonic-design-patterns": "python"
};

export function normalizePythonIdeMode(
	value: string | null | undefined,
	fallback: PythonIdeMode = "python"
): PythonIdeMode {
	if (value === "data" || value === "pgzero" || value === "turtle")
		return value;
	if (value === "python") return "python";
	return fallback;
}

export function pythonIdeModeForCourseId(courseId: string | null | undefined) {
	return courseId ? (pythonIdeCourseModes[courseId] ?? null) : null;
}

export const pythonStarterCode = `print("Hello, Python!")

name = input("What is your name? ")
print(f"Nice to meet you, {name}.")
`;

export const turtleStarterCode = `import turtle

screen = turtle.Screen()
screen.bgcolor("white")

pen = turtle.Turtle()
pen.color("teal")
pen.pensize(3)
is_moving = True

def move_forward():
\tpen.forward(30)

def turn_left():
\tpen.left(20)

def toggle_motion():
\tglobal is_moving
\tis_moving = not is_moving

def animate():
\tif is_moving:
\t\tpen.forward(2)
\tscreen.ontimer(animate, 16)

def draw_dot(x, y):
\tpen.penup()
\tpen.goto(x, y)
\tpen.pendown()
\tpen.dot(18, "coral")

def drag_pen(x, y):
\tpen.goto(x, y)

screen.onkey(move_forward, "Up")
screen.onkey(turn_left, "Left")
screen.onkey(toggle_motion, "space")
screen.onclick(draw_dot)
pen.ondrag(drag_pen)
screen.ontimer(animate, 16)
screen.listen()
`;

export const pgzeroStarterCode = `import pgzrun

WIDTH = 640
HEIGHT = 400

player = Actor("student", (WIDTH / 2, HEIGHT / 2))
player.width = 72
player.height = 72

def draw():
\tscreen.clear()
\tscreen.draw.text("Use the arrow keys to move.", (24, 24), color="white", fontsize=28)
\tplayer.draw()

def update():
\tif keyboard.left:
\t\tplayer.x -= 4
\tif keyboard.right:
\t\tplayer.x += 4
\tif keyboard.up:
\t\tplayer.y -= 4
\tif keyboard.down:
\t\tplayer.y += 4

pgzrun.go()
`;

export const pgzeroCourseStarterCode = `WIDTH = 640
HEIGHT = 400
`;

export const pgzeroStudentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
	<rect width="120" height="120" rx="26" fill="#5eead4"/>
	<circle cx="42" cy="48" r="8" fill="#0f172a"/>
	<circle cx="78" cy="48" r="8" fill="#0f172a"/>
	<path d="M36 75c13 14 35 14 48 0" fill="none" stroke="#0f172a" stroke-linecap="round" stroke-width="8"/>
</svg>
`;

export const dataScienceSampleCsv = `student,pre,post
Ari,62,81
Bao,71,85
Cleo,58,76
Dev,80,90
`;

export const dataScienceStarterCode = `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

scores = pd.read_csv("scores.csv")

scores["growth"] = scores["post"] - scores["pre"]
print(scores)
print()
print("Average growth:", round(scores["growth"].mean(), 2))

plt.figure(figsize=(7, 4))
plt.bar(scores["student"], scores["growth"], color="#0f766e")
plt.title("Growth from pre-check to post-check")
plt.xlabel("Student")
plt.ylabel("Point growth")
plt.tight_layout()
`;

export function getPythonIdeModeLabel(mode: PythonIdeMode) {
	if (mode === "data") return "Data / AI";
	if (mode === "pgzero") return "PyGame Zero";
	if (mode === "turtle") return "Turtle";
	return "Python";
}

function getDemoStarterCode(mode: PythonIdeMode) {
	if (mode === "data") return dataScienceStarterCode;
	if (mode === "pgzero") return pgzeroStarterCode;
	if (mode === "turtle") return turtleStarterCode;
	return pythonStarterCode;
}

function clonePythonIdeFiles(files: PythonIdeFile[]) {
	return files.map(file => ({
		name: file.name,
		content: file.content,
		encoding: file.encoding
	}));
}

function getBlankStarterFiles(): PythonIdeFile[] {
	return [
		{
			name: "main.py",
			content: ""
		}
	];
}

function getCourseStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "pgzero") {
		return [
			{
				name: "main.py",
				content: pgzeroCourseStarterCode
			}
		];
	}

	return getBlankStarterFiles();
}

function getDemoStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	const files = [
		{
			name: "main.py",
			content: getDemoStarterCode(mode)
		}
	];

	if (mode === "data") {
		files.push({
			name: "scores.csv",
			content: dataScienceSampleCsv
		});
	}

	if (mode === "pgzero") {
		files.push({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});
	}

	return files;
}

function getStarterFilesForTemplate(
	mode: PythonIdeMode,
	template: PythonIdeProjectTemplate
) {
	if (template === "demo") return getDemoStarterFiles(mode);
	if (template === "course") return getCourseStarterFiles(mode);
	return getBlankStarterFiles();
}

export function resolvePythonIdeActiveFileName(
	files: PythonIdeFile[],
	preferredFileName?: string
) {
	return (
		files.find(file => file.name === preferredFileName)?.name ??
		files.find(file => file.name === "main.py")?.name ??
		files.find(file => isPythonIdePythonFile(file.name))?.name ??
		files[0]?.name ??
		"main.py"
	);
}

function projectTitleForMode(mode: PythonIdeMode) {
	return mode === "data"
		? "Data / AI Notebook"
		: mode === "pgzero"
			? "PyGame Zero Game"
			: mode === "turtle"
				? "Turtle Drawing"
				: "Python Practice";
}

export function createPythonIdeProject(
	mode: PythonIdeMode = "python",
	options: CreatePythonIdeProjectOptions = {}
): PythonIdeProject {
	const now = new Date().toISOString();
	const template = options.template ?? "blank";
	const files = options.files?.length
		? clonePythonIdeFiles(options.files)
		: getStarterFilesForTemplate(mode, template);
	return {
		_id: `local-${crypto.randomUUID()}`,
		title: options.title ?? projectTitleForMode(mode),
		mode,
		files,
		activeFileName: resolvePythonIdeActiveFileName(files),
		courseID: options.courseID,
		courseProjectKey: options.courseProjectKey,
		courseProjectTitle: options.courseProjectTitle,
		starterLabel: options.starterLabel,
		starterUrl: options.starterUrl,
		createdAt: now,
		updatedAt: now
	};
}

export function pythonIdeProjectToPayload(
	project: PythonIdeProject
): PythonIdeProjectPayload {
	return {
		title: project.title,
		mode: project.mode,
		files: project.files,
		activeFileName: resolvePythonIdeActiveFileName(
			project.files,
			project.activeFileName
		),
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		starterLabel: project.starterLabel,
		starterUrl: project.starterUrl
	};
}

export function pythonIdeStorageKey(userID?: string | null) {
	return `${pythonIdeStorageNamespace}:${userID || "anonymous"}`;
}

export function normalizePythonFileName(value: string) {
	const cleaned = value
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\.\/+/, "")
		.replace(/\/+/g, "/");
	if (!cleaned) return "";
	const segments = cleaned
		.split("/")
		.map(segment => segment.trim().replaceAll(WHITESPACE_RE, "_"))
		.filter(Boolean);
	if (!segments.length) return "";
	const fileName = segments[segments.length - 1] ?? "";
	const extensionMatch = fileName.match(FILE_EXTENSION_RE);
	if (!extensionMatch) return `${segments.join("/")}.py`;
	const extension = extensionMatch[0].toLowerCase();
	const stem = fileName.slice(0, -extensionMatch[0].length);
	segments[segments.length - 1] = `${stem}${extension}`;
	return segments.join("/");
}

export function isPythonIdeRuntimeReservedPath(value: string) {
	const normalized = value.trim().replaceAll("\\", "/").toLowerCase();
	if (!normalized) return false;
	if (PYTHON_IDE_RUNTIME_RESERVED_FILE_NAMES.has(normalized)) return true;

	const root = normalized.split("/")[0] ?? "";
	return PYTHON_IDE_RUNTIME_RESERVED_ROOTS.has(root);
}

export function isValidPythonFileName(value: string) {
	if (!value || value.length > 80) return false;
	if (value.startsWith("/") || value.includes("\\") || value.includes("//"))
		return false;

	const segments = value.split("/");
	if (
		segments.some(
			segment =>
				!segment ||
				segment === "." ||
				segment === ".." ||
				!SAFE_FILE_SEGMENT_RE.test(segment)
		)
	) {
		return false;
	}

	if (isPythonIdeRuntimeReservedPath(value)) return false;

	if (PYTHON_EXTENSION_RE.test(value)) {
		const rootDirectory = segments[0]?.toLowerCase();
		return !rootDirectory || !ASSET_DIRECTORY_NAMES.has(rootDirectory);
	}

	if (segments.length === 1) return ROOT_TEXT_FILE_RE.test(value);
	if (segments.length !== 2) return false;
	return IMAGE_FILE_RE.test(value) || AUDIO_FILE_RE.test(value);
}

export function isPythonIdePythonFile(value: string) {
	return PYTHON_EXTENSION_RE.test(value);
}

export function isPythonIdeTextFile(value: string) {
	return TEXT_FILE_RE.test(value);
}

export function isPythonIdeBinaryAssetFile(
	file: Pick<PythonIdeFile, "encoding">
) {
	return file.encoding === "base64";
}

export function normalizeImportedPythonIdeFileName(value: string) {
	const baseName = value.split(/[\\/]/).pop() ?? value;
	const normalized = normalizePythonFileName(baseName);
	if (IMAGE_EXTENSION_RE.test(normalized)) return `images/${normalized}`;
	if (SOUND_EXTENSION_RE.test(normalized)) return `sounds/${normalized}`;
	if (MUSIC_EXTENSION_RE.test(normalized)) return `music/${normalized}`;
	return normalized;
}

export function getPythonIdeFileMimeType(value: string) {
	const extension = value.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".gif") return "image/gif";
	if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
	if (extension === ".mp3") return "audio/mpeg";
	if (extension === ".ogg") return "audio/ogg";
	if (extension === ".png") return "image/png";
	if (extension === ".svg") return "image/svg+xml";
	if (extension === ".wav") return "audio/wav";
	if (extension === ".webp") return "image/webp";
	return "";
}

export function getPythonIdeAssetDataUrl(file: PythonIdeFile) {
	const mimeType = getPythonIdeFileMimeType(file.name);
	if (!mimeType) return "";
	if (file.encoding === "base64")
		return `data:${mimeType};base64,${file.content}`;
	if (mimeType === "image/svg+xml") {
		return `data:${mimeType};charset=utf-8,${encodeURIComponent(file.content)}`;
	}
	return "";
}

export function getPythonIdeFileKindLabel(value: string) {
	const extension = value.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".csv") return "CSV";
	if (extension === ".json") return "JSON";
	if (extension === ".md") return "Markdown";
	if (extension === ".txt") return "Text";
	if (IMAGE_EXTENSION_RE.test(value)) return "Image";
	if (value.startsWith("music/")) return "Music";
	if (AUDIO_FILE_RE.test(value)) return "Sound";
	return "Python";
}

export function getPythonIdeDefaultFileContent(fileName: string) {
	const extension = fileName.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".csv") return "name,value\nsample,1\n";
	if (extension === ".json") return '{\n\t"items": []\n}\n';
	if (extension === ".md") return "# Notes\n\n";
	if (extension === ".txt") return "";
	return "# Add your Python code here.\n";
}

function baseName(path: string) {
	return path.split("/").filter(Boolean).at(-1) ?? path;
}

function safeProjectFileNameFromStarterPath(
	path: string,
	resourceBasePath: string,
	usedFileNames: Set<string>
) {
	const basePath = resourceBasePath.replace(/\/+$/, "");
	const relativePath =
		basePath && path.startsWith(`${basePath}/`)
			? path.slice(basePath.length + 1)
			: path;
	const normalizedRelativePath = relativePath
		.replace(STARTER_RELATIVE_PREFIX_RE, "")
		.replace(/^\/+/, "");
	const candidatePath = normalizePythonFileName(normalizedRelativePath);
	let fileName = isValidPythonFileName(candidatePath)
		? candidatePath
		: normalizePythonFileName(baseName(normalizedRelativePath));

	if (!isValidPythonFileName(fileName)) return "";

	if (usedFileNames.has(fileName)) {
		const extension = fileName.match(FILE_EXTENSION_RE)?.[0] ?? "";
		const stem = extension
			? fileName.slice(0, -extension.length)
			: fileName;
		let duplicateIndex = 2;
		while (usedFileNames.has(`${stem}_${duplicateIndex}${extension}`)) {
			duplicateIndex += 1;
		}
		fileName = `${stem}_${duplicateIndex}${extension}`;
	}

	usedFileNames.add(fileName);
	return fileName;
}

export async function loadPythonIdeStarterFilesFromGitHub(
	starterUrl: string
): Promise<PythonIdeFile[]> {
	const resource = parseGitHubResource(starterUrl);
	if (!resource) {
		throw new Error(
			"Only public GitHub starter links can open in the IDE."
		);
	}

	const previewFiles = await listPreviewFiles(starterUrl);
	const usedFileNames = new Set<string>();
	const starterFiles: PythonIdeFile[] = [];

	for (const file of previewFiles) {
		const name = safeProjectFileNameFromStarterPath(
			file.path,
			resource.path,
			usedFileNames
		);
		if (!name || !isPythonIdeTextFile(name)) continue;

		const preview = await loadPreviewFile(file);
		starterFiles.push({
			name,
			content: preview.content,
			encoding: "text"
		});
	}

	const runnableFileIndex = starterFiles.findIndex(file =>
		isPythonIdePythonFile(file.name)
	);
	if (runnableFileIndex <= 0) return starterFiles;

	const [runnableFile] = starterFiles.splice(runnableFileIndex, 1);
	if (runnableFile) starterFiles.unshift(runnableFile);
	return starterFiles;
}

export function getPythonIdeRunnableFile(
	project: Pick<PythonIdeProject, "activeFileName" | "files">
) {
	return (
		project.files.find(
			file =>
				file.name === project.activeFileName &&
				isPythonIdePythonFile(file.name)
		) ??
		project.files.find(file => isPythonIdePythonFile(file.name)) ??
		null
	);
}

export function loadLocalPythonProjects(userID?: string | null) {
	if (typeof window === "undefined") return [];

	try {
		const raw = window.localStorage.getItem(pythonIdeStorageKey(userID));
		if (!raw) return [];
		const parsed = JSON.parse(raw) as PythonIdeProject[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export async function loadLocalPythonProjectsAsync(userID?: string | null) {
	const key = pythonIdeStorageKey(userID);
	const storedProjects = await readIndexedDbPythonProjects(key);
	if (storedProjects) return storedProjects;

	const legacyProjects = loadLocalPythonProjects(userID);
	if (legacyProjects.length) {
		await saveLocalPythonProjectsAsync(legacyProjects, userID);
	}
	return legacyProjects;
}

export function saveLocalPythonProjects(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		pythonIdeStorageKey(userID),
		JSON.stringify(projects)
	);
}

export async function saveLocalPythonProjectsAsync(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	const key = pythonIdeStorageKey(userID);

	try {
		await writeIndexedDbPythonProjects(key, projects);
		clearLegacyLocalPythonProjects(key);
	} catch (indexedDbError) {
		try {
			saveLocalPythonProjects(projects, userID);
		} catch {
			throw new Error(
				`Could not save Python IDE projects locally. Browser project storage may be full or unavailable. (${formatStorageError(indexedDbError)})`
			);
		}
	}
}

export function clearLocalPythonProjects(userID?: string | null) {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(pythonIdeStorageKey(userID));
}

export async function clearLocalPythonProjectsAsync(userID?: string | null) {
	const key = pythonIdeStorageKey(userID);
	await deleteIndexedDbPythonProjects(key).catch(() => undefined);
	clearLegacyLocalPythonProjects(key);
}

async function readIndexedDbPythonProjects(key: string) {
	try {
		const db = await openPythonIdeStorageDb();
		const transaction = db.transaction(
			PYTHON_IDE_PROJECT_STORE,
			"readonly"
		);
		const record = await indexedDbRequest<
			PythonIdeProjectStorageRecord | undefined
		>(transaction.objectStore(PYTHON_IDE_PROJECT_STORE).get(key));
		await indexedDbTransactionDone(transaction);
		return Array.isArray(record?.projects) ? record.projects : null;
	} catch {
		return null;
	}
}

async function writeIndexedDbPythonProjects(
	key: string,
	projects: PythonIdeProject[]
) {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	await indexedDbRequest(
		transaction.objectStore(PYTHON_IDE_PROJECT_STORE).put({
			key,
			projects,
			updatedAt: new Date().toISOString()
		} satisfies PythonIdeProjectStorageRecord)
	);
	await indexedDbTransactionDone(transaction);
}

async function deleteIndexedDbPythonProjects(key: string) {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	await indexedDbRequest(
		transaction.objectStore(PYTHON_IDE_PROJECT_STORE).delete(key)
	);
	await indexedDbTransactionDone(transaction);
}

function openPythonIdeStorageDb() {
	if (typeof window === "undefined" || !window.indexedDB) {
		return Promise.reject(new Error("IndexedDB is unavailable."));
	}

	pythonIdeStorageDbPromise ??= new Promise<IDBDatabase>(
		(resolve, reject) => {
			const request = window.indexedDB.open(
				PYTHON_IDE_INDEXED_DB_NAME,
				PYTHON_IDE_INDEXED_DB_VERSION
			);

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(PYTHON_IDE_PROJECT_STORE)) {
					db.createObjectStore(PYTHON_IDE_PROJECT_STORE, {
						keyPath: "key"
					});
				}
			};
			request.onsuccess = () => {
				const db = request.result;
				db.onversionchange = () => {
					db.close();
					pythonIdeStorageDbPromise = null;
				};
				resolve(db);
			};
			request.onerror = () =>
				reject(request.error ?? new Error("Could not open IndexedDB."));
			request.onblocked = () =>
				reject(
					new Error(
						"Python IDE project storage is blocked by another tab."
					)
				);
		}
	).catch(error => {
		pythonIdeStorageDbPromise = null;
		throw error;
	});

	return pythonIdeStorageDbPromise;
}

function indexedDbRequest<T>(request: IDBRequest<T>) {
	return new Promise<T>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () =>
			reject(request.error ?? new Error("IndexedDB request failed."));
	});
}

function indexedDbTransactionDone(transaction: IDBTransaction) {
	return new Promise<void>((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () =>
			reject(
				transaction.error ?? new Error("IndexedDB transaction failed.")
			);
		transaction.onabort = () =>
			reject(
				transaction.error ?? new Error("IndexedDB transaction aborted.")
			);
	});
}

function clearLegacyLocalPythonProjects(key: string) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.removeItem(key);
	} catch {
		// Cleanup is best-effort because IndexedDB is the primary store.
	}
}

function formatStorageError(error: unknown) {
	return error instanceof Error ? error.message : "storage unavailable";
}

export async function fetchPythonIdeProjects() {
	const { data } = await api.get<{ projects: PythonIdeProject[] }>(
		"/users/loggedin/python-projects"
	);
	return data.projects;
}

export async function createRemotePythonIdeProject(
	payload: PythonIdeProjectPayload
) {
	const { data } = await api.post<{ project: PythonIdeProject }>(
		"/users/loggedin/python-projects",
		payload
	);
	return data.project;
}

export async function updateRemotePythonIdeProject(
	projectID: string,
	payload: PythonIdeProjectPayload
) {
	const { data } = await api.put<{ project: PythonIdeProject }>(
		`/users/loggedin/python-projects/${projectID}`,
		payload
	);
	return data.project;
}

export async function deleteRemotePythonIdeProject(projectID: string) {
	await api.delete(`/users/loggedin/python-projects/${projectID}`);
}
