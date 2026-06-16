import { api } from "@/api";

const WHITESPACE_RE = /\s+/g;
const PYTHON_FILE_NAME_RE = /^[A-Za-z_][\w.-]*\.py$/;

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

export const pythonIdeStorageNamespace = "classes-python-ide-projects";

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

for side in range(4):
\tpen.forward(100)
\tpen.right(90)

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

export const dataScienceStarterCode = `import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

scores = pd.DataFrame({
\t"student": ["Ari", "Bao", "Cleo", "Dev"],
\t"pre": [62, 71, 58, 80],
\t"post": [81, 85, 76, 90],
})

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
		files: [
			{
				name: "main.py",
				content: getStarterCode(mode)
			}
		],
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
	return cleaned.endsWith(".py") ? cleaned : `${cleaned}.py`;
}

export function isValidPythonFileName(value: string) {
	return PYTHON_FILE_NAME_RE.test(value);
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
