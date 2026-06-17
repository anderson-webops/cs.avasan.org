import { api } from "@/api";

const WHITESPACE_RE = /\s+/g;
const FILE_EXTENSION_RE = /\.[\dA-Z]+$/i;
const PYTHON_EXTENSION_RE = /\.py$/i;
const SAFE_FILE_SEGMENT_RE = /^\w[\w.-]*$/;
const ROOT_TEXT_FILE_RE = /^\w[\w.-]*\.(?:csv|json|md|py|txt)$/i;
const IMAGE_FILE_RE = /^images\/\w[\w.-]*\.(?:gif|jpe?g|png|svg|webp)$/i;
const AUDIO_FILE_RE = /^(?:music|sounds)\/\w[\w.-]*\.(?:mp3|ogg|wav)$/i;
const TEXT_FILE_RE = /\.(?:csv|json|md|py|txt|svg)$/i;
const IMAGE_EXTENSION_RE = /\.(?:gif|jpe?g|png|svg|webp)$/i;
const SOUND_EXTENSION_RE = /\.wav$/i;
const MUSIC_EXTENSION_RE = /\.(?:mp3|ogg)$/i;

export type PythonIdeFileEncoding = "text" | "base64";

export type PythonIdeMode = "data" | "pgzero" | "python" | "turtle";

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
	createdAt?: string;
	updatedAt?: string;
}

export interface PythonIdeProjectPayload {
	title?: string;
	mode?: PythonIdeMode;
	files?: PythonIdeFile[];
	activeFileName?: string;
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

export const pythonIdeLibrarySupport: PythonIdeLibrarySupport[] = [
	{
		name: "Python standard library",
		status: "browser",
		detail: "Core course modules such as random, math, json, csv, time, pathlib, and collections run directly in the browser runtime."
	},
	{
		name: "Turtle and PyGame Zero",
		status: "shim",
		detail: "Turtle drawing, Screen.onkey, Screen.onclick, Turtle.ondrag, Actor, screen, keyboard, mouse handlers, clock, Rect, images/, sounds/, music/, and common PyGame Zero patterns run through course-specific browser shims."
	},
	{
		name: "Data science stack",
		status: "browser",
		detail: "NumPy, pandas, matplotlib, and scikit-learn load through Pyodide; NetworkX, Altair, and Seaborn are installed on demand for imported projects."
	},
	{
		name: "Streamlit-style reports",
		status: "shim",
		detail: "Common st.write, dataframe, pyplot, and altair_chart calls render as IDE output or artifacts, but full Streamlit apps still require a local/deployed server."
	},
	{
		name: "PySynth song projects",
		status: "shim",
		detail: "Python Level 2 song-generator projects can call make_wav(...) to create a playable WAV artifact in the browser output."
	},
	{
		name: "TensorFlow / Keras",
		status: "local",
		detail: "Neural-network lessons should run in Colab or local Python. The browser IDE warns clearly when those heavy APIs are imported."
	}
];

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

def move_forward():
\tpen.forward(30)

def turn_left():
\tpen.left(20)

def draw_dot(x, y):
\tpen.penup()
\tpen.goto(x, y)
\tpen.pendown()
\tpen.dot(18, "coral")

def drag_pen(x, y):
\tpen.goto(x, y)

screen.onkey(move_forward, "Up")
screen.onkey(turn_left, "Left")
screen.onclick(draw_dot)
pen.ondrag(drag_pen)
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

function getStarterCode(mode: PythonIdeMode) {
	if (mode === "data") return dataScienceStarterCode;
	if (mode === "pgzero") return pgzeroStarterCode;
	if (mode === "turtle") return turtleStarterCode;
	return pythonStarterCode;
}

function getStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	const files = [
		{
			name: "main.py",
			content: getStarterCode(mode)
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

export function createPythonIdeProject(
	mode: PythonIdeMode = "python"
): PythonIdeProject {
	const now = new Date().toISOString();
	return {
		_id: `local-${crypto.randomUUID()}`,
		title:
			mode === "data"
				? "Data / AI Notebook"
				: mode === "pgzero"
					? "PyGame Zero Game"
					: mode === "turtle"
						? "Turtle Drawing"
						: "Python Practice",
		mode,
		files: getStarterFiles(mode),
		activeFileName: "main.py",
		createdAt: now,
		updatedAt: now
	};
}

export function pythonIdeStorageKey(userID?: string | null) {
	return `${pythonIdeStorageNamespace}:${userID || "anonymous"}`;
}

export function normalizePythonFileName(value: string) {
	const cleaned = value
		.trim()
		.replaceAll("\\", "/")
		.replaceAll(WHITESPACE_RE, "_")
		.replace(/^\.\/+/, "")
		.replace(/\/+/g, "/");
	if (!cleaned) return "";
	const extensionMatch = cleaned.match(FILE_EXTENSION_RE);
	if (!extensionMatch) return `${cleaned}.py`;
	const extension = extensionMatch[0].toLowerCase();
	const stem = cleaned.slice(0, -extensionMatch[0].length);
	return `${stem}${extension}`;
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
