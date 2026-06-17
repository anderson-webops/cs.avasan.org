import { describe, expect, it } from "vitest";
import {
	createPythonIdeProject,
	dataScienceSampleCsv,
	dataScienceStarterCode,
	getPythonIdeAssetDataUrl,
	getPythonIdeDefaultFileContent,
	getPythonIdeFileKindLabel,
	getPythonIdeModeLabel,
	getPythonIdeRunnableFile,
	isPythonIdeBinaryAssetFile,
	isPythonIdePythonFile,
	isPythonIdeTextFile,
	normalizeImportedPythonIdeFileName,
	isValidPythonFileName,
	normalizePythonFileName,
	pythonIdeLibrarySupport,
	pgzeroStudentSvg,
	pgzeroStarterCode,
	turtleStarterCode
} from "../src/modules/pythonIde";

describe("python IDE project helpers", () => {
	it("creates data/AI notebook starter projects", () => {
		const project = createPythonIdeProject("data");

		expect(project.mode).toBe("data");
		expect(project.title).toBe("Data / AI Notebook");
		expect(project.files[0]?.content).toBe(dataScienceStarterCode);
		expect(project.files[1]).toEqual({
			name: "scores.csv",
			content: dataScienceSampleCsv
		});
		expect(project.files[0]?.content).toContain("pandas");
		expect(project.files[0]?.content).toContain('read_csv("scores.csv")');
		expect(project.files[0]?.content).toContain("plt.bar");
	});

	it("creates PyGame Zero starter projects", () => {
		const project = createPythonIdeProject("pgzero");

		expect(project.mode).toBe("pgzero");
		expect(project.title).toBe("PyGame Zero Game");
		expect(project.files[0]?.content).toBe(pgzeroStarterCode);
		expect(project.files[0]?.content).toContain("Actor(");
		expect(project.files[0]?.content).toContain("pgzrun.go()");
		expect(project.files[1]).toEqual({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});
	});

	it("creates interactive Turtle starter projects", () => {
		const project = createPythonIdeProject("turtle");

		expect(project.mode).toBe("turtle");
		expect(project.files[0]?.content).toBe(turtleStarterCode);
		expect(project.files[0]?.content).toContain("screen.onkey");
		expect(project.files[0]?.content).toContain("screen.onclick");
		expect(project.files[0]?.content).toContain("pen.ondrag");
	});

	it("labels supported runtime modes", () => {
		expect(getPythonIdeModeLabel("data")).toBe("Data / AI");
		expect(getPythonIdeModeLabel("python")).toBe("Python");
		expect(getPythonIdeModeLabel("turtle")).toBe("Turtle");
		expect(getPythonIdeModeLabel("pgzero")).toBe("PyGame Zero");
	});

	it("documents browser and local course-library support", () => {
		expect(
			pythonIdeLibrarySupport.some(
				entry =>
					entry.name === "Data science stack" &&
					entry.status === "browser"
			)
		).toBe(true);
		expect(
			pythonIdeLibrarySupport.some(
				entry =>
					entry.name === "TensorFlow / Keras" &&
					entry.status === "local"
			)
		).toBe(true);
		expect(
			pythonIdeLibrarySupport.some(
				entry =>
					entry.name === "PySynth song projects" &&
					entry.status === "shim"
			)
		).toBe(true);
		expect(
			pythonIdeLibrarySupport.some(
				entry =>
					entry.name === "Turtle and PyGame Zero" &&
					entry.detail.includes("xcor()") &&
					entry.detail.includes("distance()") &&
					entry.detail.includes("stamp()") &&
					entry.detail.includes("Turtle.ondrag") &&
					entry.detail.includes("mouse handlers")
			)
		).toBe(true);
	});

	it("normalizes project file names without accepting unsafe names", () => {
		expect(normalizePythonFileName("helper tools")).toBe("helper_tools.py");
		expect(normalizePythonFileName("lesson data.CSV")).toBe(
			"lesson_data.csv"
		);
		expect(isValidPythonFileName("helper_tools.py")).toBe(true);
		expect(isValidPythonFileName("scores.csv")).toBe(true);
		expect(isValidPythonFileName("notes.md")).toBe(true);
		expect(isValidPythonFileName("images/player.svg")).toBe(true);
		expect(isValidPythonFileName("sounds/eep.wav")).toBe(true);
		expect(isValidPythonFileName("music/theme.mp3")).toBe(true);
		expect(isValidPythonFileName("../helper.py")).toBe(false);
		expect(isValidPythonFileName("images/../player.svg")).toBe(false);
		expect(isValidPythonFileName("images/player.py")).toBe(false);
		expect(isValidPythonFileName("script.exe")).toBe(false);
	});

	it("labels file kinds and creates safe default content", () => {
		expect(getPythonIdeFileKindLabel("scores.csv")).toBe("CSV");
		expect(getPythonIdeFileKindLabel("notes.md")).toBe("Markdown");
		expect(getPythonIdeFileKindLabel("images/player.png")).toBe("Image");
		expect(getPythonIdeFileKindLabel("sounds/eep.wav")).toBe("Sound");
		expect(getPythonIdeFileKindLabel("music/theme.mp3")).toBe("Music");
		expect(getPythonIdeDefaultFileContent("data.json")).toContain(
			'"items"'
		);
		expect(getPythonIdeDefaultFileContent("main.py")).toContain(
			"Python code"
		);
		expect(isPythonIdePythonFile("main.py")).toBe(true);
		expect(isPythonIdePythonFile("scores.csv")).toBe(false);
	});

	it("normalizes imported course assets into PyGame Zero folders", () => {
		expect(normalizeImportedPythonIdeFileName("player.PNG")).toBe(
			"images/player.png"
		);
		expect(normalizeImportedPythonIdeFileName("eep.wav")).toBe(
			"sounds/eep.wav"
		);
		expect(normalizeImportedPythonIdeFileName("theme.MP3")).toBe(
			"music/theme.mp3"
		);
		expect(isPythonIdeTextFile("images/player.svg")).toBe(true);
		expect(isPythonIdeTextFile("images/player.png")).toBe(false);
		expect(isPythonIdeBinaryAssetFile({ encoding: "base64" })).toBe(true);
	});

	it("builds data URLs for project assets", () => {
		expect(
			getPythonIdeAssetDataUrl({
				name: "images/player.svg",
				content: "<svg></svg>"
			})
		).toBe("data:image/svg+xml;charset=utf-8,%3Csvg%3E%3C%2Fsvg%3E");
		expect(
			getPythonIdeAssetDataUrl({
				name: "sounds/eep.wav",
				content: "UklGRg==",
				encoding: "base64"
			})
		).toBe("data:audio/wav;base64,UklGRg==");
	});

	it("runs the selected Python file or falls back from resource files", () => {
		const project = createPythonIdeProject("data");

		expect(getPythonIdeRunnableFile(project)?.name).toBe("main.py");

		project.activeFileName = "scores.csv";
		expect(getPythonIdeRunnableFile(project)?.name).toBe("main.py");
	});
});
