import { api } from "@/api";

const WHITESPACE_RE = /\s+/g;
const FILE_EXTENSION_RE = /\.[\dA-Z]+$/i;
const PYTHON_EXTENSION_RE = /\.py$/i;
const PYTHON_IDE_FILE_NAME_RE = /^[A-Z_][\w.-]*\.(?:csv|json|md|py|txt)$/i;

export type PythonIdeMode = "data" | "pgzero" | "python" | "turtle";

export interface PythonIdeFile {
	name: string;
	content: string;
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
	".md"
] as const;

export const pythonIdeLibrarySupport: PythonIdeLibrarySupport[] = [
	{
		name: "Python standard library",
		status: "browser",
		detail: "Core course modules such as random, math, json, csv, time, pathlib, and collections run directly in the browser runtime."
	},
	{
		name: "Turtle and PyGame Zero",
		status: "shim",
		detail: "Turtle drawing, Screen.onkey input, Actor, screen, keyboard, clock, Rect, and common PyGame Zero patterns run through course-specific browser shims."
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

screen.onkey(move_forward, "Up")
screen.onkey(turn_left, "Left")
screen.onclick(draw_dot)
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
	const cleaned = value.trim().replaceAll(WHITESPACE_RE, "_");
	if (!cleaned) return "";
	const extensionMatch = cleaned.match(FILE_EXTENSION_RE);
	if (!extensionMatch) return `${cleaned}.py`;
	const extension = extensionMatch[0].toLowerCase();
	const stem = cleaned.slice(0, -extensionMatch[0].length);
	return `${stem}${extension}`;
}

export function isValidPythonFileName(value: string) {
	return PYTHON_IDE_FILE_NAME_RE.test(value);
}

export function isPythonIdePythonFile(value: string) {
	return PYTHON_EXTENSION_RE.test(value);
}

export function getPythonIdeFileKindLabel(value: string) {
	const extension = value.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".csv") return "CSV";
	if (extension === ".json") return "JSON";
	if (extension === ".md") return "Markdown";
	if (extension === ".txt") return "Text";
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
