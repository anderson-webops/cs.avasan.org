import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
	normalizePythonIdeMode,
	isValidPythonFileName,
	normalizePythonFileName,
	pythonIdeModeForCourseId,
	pythonIdeProjectToPayload,
	pythonIdeLibrarySupport,
	pgzeroStudentSvg,
	pgzeroStarterCode,
	turtleStarterCode
} from "../src/modules/pythonIde";
import { pythonIdeProjectModuleNames } from "../src/modules/pythonIdeRuntime";

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

	it("serializes remote project create/update payloads without local metadata", () => {
		const project = createPythonIdeProject("turtle");
		const payload = pythonIdeProjectToPayload(project);

		expect(payload).toEqual({
			title: project.title,
			mode: project.mode,
			files: project.files,
			activeFileName: project.activeFileName
		});
		expect(payload).not.toHaveProperty("_id");
		expect(payload).not.toHaveProperty("createdAt");
		expect(payload).not.toHaveProperty("updatedAt");
	});

	it("labels supported runtime modes", () => {
		expect(getPythonIdeModeLabel("data")).toBe("Data / AI");
		expect(getPythonIdeModeLabel("python")).toBe("Python");
		expect(getPythonIdeModeLabel("turtle")).toBe("Turtle");
		expect(getPythonIdeModeLabel("pgzero")).toBe("PyGame Zero");
	});

	it("maps Python-family courses to the right IDE starter modes", () => {
		expect(pythonIdeModeForCourseId("python-level-1")).toBe("turtle");
		expect(pythonIdeModeForCourseId("pygames")).toBe("pgzero");
		expect(pythonIdeModeForCourseId("data-science-in-python")).toBe(
			"data"
		);
		expect(pythonIdeModeForCourseId("machine-learning")).toBe("data");
		expect(pythonIdeModeForCourseId("python-level-3")).toBe("python");
		expect(pythonIdeModeForCourseId("scratch-level-1")).toBeNull();
		expect(normalizePythonIdeMode("pgzero", "turtle")).toBe("pgzero");
		expect(normalizePythonIdeMode("unknown", "turtle")).toBe("turtle");
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
					entry.status === "shim" &&
					entry.detail.includes("Sequential") &&
					entry.detail.includes("ImageDataGenerator")
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
					entry.detail.includes("begin_fill()") &&
					entry.detail.includes("colormode()") &&
					entry.detail.includes("independent Turtle() objects") &&
					entry.detail.includes("xcor()") &&
					entry.detail.includes("distance()") &&
					entry.detail.includes("stamp()") &&
					entry.detail.includes("Turtle.ondrag") &&
					entry.detail.includes("Screen.ontimer") &&
					entry.detail.includes("mouse handlers")
			)
		).toBe(true);
		expect(
			pythonIdeLibrarySupport.some(
				entry =>
					entry.name === "Streamlit-style reports" &&
					entry.detail.includes("selectbox") &&
					entry.detail.includes("slider") &&
					entry.detail.includes("metric")
			)
		).toBe(true);
	});

	it("keeps Turtle fill and RGB color hooks wired in the runtime shim", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/pages/python-ide.vue"),
			"utf8"
		);

		expect(pageSource).toContain("beginFill: beginTurtleFill");
		expect(pageSource).toContain("endFill: endTurtleFill");
		expect(runtimeSource).toContain("def colormode(cmode=None)");
		expect(runtimeSource).toContain("def _normalize_color(*values)");
		expect(runtimeSource).toContain("def begin_fill(self):");
		expect(runtimeSource).toContain("_bridge.beginFill()");
		expect(runtimeSource).toContain("_bridge.endFill()");
	});

	it("keeps Turtle timer hooks wired in the runtime bridge", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/pages/python-ide.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("def ontimer(self, function, t=0):");
		expect(runtimeSource).toContain("def ontimer(function, t=0):");
		expect(runtimeSource).toContain("_bridge.scheduleTimer");
		expect(pageSource).toContain("scheduleTimer(delayMs: number");
		expect(pageSource).toContain("clearTurtleTimers()");
	});

	it("keeps Streamlit dashboard widget helpers wired in the runtime shim", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain("def selectbox(");
		expect(runtimeSource).toContain("def multiselect(");
		expect(runtimeSource).toContain("def slider(");
		expect(runtimeSource).toContain("def checkbox(");
		expect(runtimeSource).toContain("def number_input(");
		expect(runtimeSource).toContain("def text_input(");
		expect(runtimeSource).toContain("def metric(");
		expect(runtimeSource).toContain("def columns(");
		expect(runtimeSource).toContain("class _Container:");
		expect(runtimeSource).toContain("sidebar = _Container");
	});

	it("normalizes local Python project module names for fresh imports", () => {
		expect(
			pythonIdeProjectModuleNames([
				{ name: "main.py" },
				{ name: "helper_tools.py" },
				{ name: "notes.md" },
				{ name: "package/__init__.py" },
				{ name: "package/util.py" }
			])
		).toEqual(["main", "helper_tools", "package", "package.util"]);
	});

	it("clears stale project files and cached modules before each run", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain("lastProjectFileNames");
		expect(runtimeSource).toContain("function syncProjectFiles");
		expect(runtimeSource).toContain("safeUnlink(pyodide");
		expect(runtimeSource).toContain("sys.modules.pop(__classes_module_name, None)");
	});

	it("normalizes project file names without accepting unsafe names", () => {
		expect(normalizePythonFileName("helper tools")).toBe("helper_tools.py");
		expect(normalizePythonFileName("helpers/math tools")).toBe(
			"helpers/math_tools.py"
		);
		expect(normalizePythonFileName("helpers / math tools")).toBe(
			"helpers/math_tools.py"
		);
		expect(normalizePythonFileName("lesson data.CSV")).toBe(
			"lesson_data.csv"
		);
		expect(isValidPythonFileName("helper_tools.py")).toBe(true);
		expect(isValidPythonFileName("package/__init__.py")).toBe(true);
		expect(isValidPythonFileName("package/util.py")).toBe(true);
		expect(isValidPythonFileName("package/submodule/tools.py")).toBe(
			true
		);
		expect(isValidPythonFileName("scores.csv")).toBe(true);
		expect(isValidPythonFileName("notes.md")).toBe(true);
		expect(isValidPythonFileName("images/player.svg")).toBe(true);
		expect(isValidPythonFileName("sounds/eep.wav")).toBe(true);
		expect(isValidPythonFileName("music/theme.mp3")).toBe(true);
		expect(isValidPythonFileName("../helper.py")).toBe(false);
		expect(isValidPythonFileName("package//util.py")).toBe(false);
		expect(isValidPythonFileName("package/../util.py")).toBe(false);
		expect(isValidPythonFileName("package/.hidden.py")).toBe(false);
		expect(isValidPythonFileName("images/../player.svg")).toBe(false);
		expect(isValidPythonFileName("images/player.py")).toBe(false);
		expect(isValidPythonFileName("sounds/eep.py")).toBe(false);
		expect(isValidPythonFileName("package/data.csv")).toBe(false);
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
