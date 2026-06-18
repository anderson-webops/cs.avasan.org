import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strToU8, zipSync } from "fflate";
import {
	clearLocalPythonProjects,
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
	loadLocalPythonProjects,
	normalizePythonFileName,
	pythonIdeModeForCourseId,
	pythonIdeProjectToPayload,
	pythonIdeStorageKey,
	pythonIdeLibrarySupport,
	saveLocalPythonProjects,
	pgzeroStudentSvg,
	pgzeroStarterCode,
	turtleStarterCode
} from "../src/modules/pythonIde";
import {
	findPythonIdeCourseAsset,
	parsePythonIdeCourseAssetZip,
	pythonIdeAssetCandidateNames,
	resetPythonIdeCourseAssetPackCache,
	loadPythonIdeCourseAssetPack
} from "../src/modules/pythonIdeCourseAssets";
import { pythonIdeProjectModuleNames } from "../src/modules/pythonIdeRuntime";

const oneByOnePngBytes = new Uint8Array([
	0x89,
	0x50,
	0x4E,
	0x47,
	0x0D,
	0x0A,
	0x1A,
	0x0A,
	0x00,
	0x00,
	0x00,
	0x0D,
	0x49,
	0x48,
	0x44,
	0x52,
	0x00,
	0x00,
	0x00,
	0x01,
	0x00,
	0x00,
	0x00,
	0x01
]);

describe("python IDE project helpers", () => {
	beforeEach(() => {
		resetPythonIdeCourseAssetPackCache();
		const storage = new Map<string, string>();
		Object.defineProperty(window, "localStorage", {
			configurable: true,
			value: {
				clear: vi.fn(() => storage.clear()),
				getItem: vi.fn((key: string) => storage.get(key) ?? null),
				removeItem: vi.fn((key: string) => storage.delete(key)),
				setItem: vi.fn((key: string, value: string) =>
					storage.set(key, value)
				)
			}
		});
	});

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

	it("clears local Python projects for one storage user only", () => {
		const firstProject = createPythonIdeProject("python");
		const secondProject = createPythonIdeProject("data");

		saveLocalPythonProjects([firstProject], "student-a");
		saveLocalPythonProjects([secondProject], "student-b");

		expect(
			window.localStorage.getItem(pythonIdeStorageKey("student-a"))
		).toContain(firstProject.title);

		clearLocalPythonProjects("student-a");

		expect(loadLocalPythonProjects("student-a")).toEqual([]);
		expect(loadLocalPythonProjects("student-b")).toHaveLength(1);
		expect(
			window.localStorage.getItem(pythonIdeStorageKey("student-b"))
		).toContain(secondProject.title);
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

	it("keeps Turtle runs animated with a visible cursor marker", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/pages/python-ide.vue"),
			"utf8"
		);

		expect(pageSource).toContain("function drawTurtleMarker");
		expect(pageSource).toContain("function queueTurtleStep");
		expect(pageSource).toContain("function runTurtleAnimationFrame");
		expect(pageSource).toContain(
			"requestAnimationFrame(runTurtleAnimationFrame)"
		);
		expect(pageSource).toContain("await waitForTurtleAnimation()");
		expect(pageSource).toContain("cancelTurtleAnimation()");
	});

	it("guards long-running student loops before executing Python files", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/pages/python-ide.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("const FOR_LOOP_ITERATION_LIMIT");
		expect(runtimeSource).toContain("const WHILE_LOOP_ITERATION_LIMIT");
		expect(runtimeSource).toContain("class __ClassesLoopGuardTransformer");
		expect(runtimeSource).toContain("def __classes_loop_guard(kind):");
		expect(runtimeSource).toContain("__classes_loop_iteration_limits");
		expect(runtimeSource).toContain("def __classes_sleep(_seconds=0):");
		expect(runtimeSource).toContain("__classes_time.sleep = __classes_sleep");
		expect(runtimeSource).toContain("__classes_compile_student_source(");
		expect(runtimeSource).toContain("visit_While");
		expect(runtimeSource).toContain("visit_For");
		expect(pageSource).toContain("function formatPythonRuntimeError");
		expect(pageSource).toContain(
			"RuntimeError: Stopped a long-running (?:for|while) loop"
		);
		expect(pageSource).toContain("formatPythonRuntimeError(error)");
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

	it("keeps generated text-file persistence wired between runtime and page", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/pages/python-ide.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("async function captureProjectTextFiles");
		expect(runtimeSource).toContain("__classes_reserved_files");
		expect(runtimeSource).toContain("isValidPythonFileName(file.name)");
		expect(runtimeSource).toContain("options.onProjectFilesUpdate?.");
		expect(pageSource).toContain("function mergeRuntimeProjectFiles");
		expect(pageSource).toContain("onProjectFilesUpdate: files =>");
		expect(pageSource).toContain("void saveSelectedProject()");
	});

	it("clears stale local account fallback after successful remote syncs", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/pages/python-ide.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			"clearLocalPythonProjects(storageUserID.value);"
		);
		expect(pageSource).toContain("Saved locally after sync issue");
		expect(pageSource).toContain("const isRemoteProject =");
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

	it("loads shared PyGame Zero assets from the static assets zip", async () => {
		const zipBytes = zipSync({
			"__MACOSX/images/._alien.png": strToU8("ignored"),
			"images/.DS_Store": strToU8("ignored"),
			"images/alien.png": oneByOnePngBytes,
			"music/tune.mp3": new Uint8Array([1, 2, 3]),
			"sounds/eep.wav": new Uint8Array([4, 5, 6])
		});

		const pack = parsePythonIdeCourseAssetZip(zipBytes, "/assets.zip");
		const alien = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("images", "alien", [".png"])
		);
		const eep = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("sounds", "eep", [".wav"])
		);
		const tune = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("music", "tune.mp3", [".mp3"])
		);

		expect(pack.assets.size).toBe(3);
		expect(alien?.mimeType).toBe("image/png");
		expect(alien?.width).toBe(1);
		expect(alien?.height).toBe(1);
		expect(eep?.mimeType).toBe("audio/wav");
		expect(tune?.mimeType).toBe("audio/mpeg");
	});

	it("fetches the shared PyGame Zero asset pack through the same-origin API proxy", async () => {
		const zipBytes = zipSync({
			"images/alien.png": oneByOnePngBytes
		});
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				expect(url).toBe("/api/python-assets/assets.zip");
				return {
					arrayBuffer: async () => zipBytes.buffer.slice(0),
					ok: true,
					status: 200
				};
			}
		});

		expect(pack.assets.has("images/alien.png")).toBe(true);
	});

	it("keeps shared PyGame Zero asset support wired into the page and runtime", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/pages/python-ide.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("def _asset_size(image");
		expect(runtimeSource).toContain("builtins.images = images");
		expect(runtimeSource).toContain("def blit(self, image, pos");
		expect(runtimeSource).toContain("def get_width(self):");
		expect(pageSource).toContain("await ensureGameCourseAssetsLoaded()");
		expect(pageSource).toContain("drawImage: drawGameImage");
		expect(pageSource).toContain("imageSizeJson: gameImageSizeJson");
		expect(pageSource).toContain("findPythonIdeCourseAsset");
	});

	it("runs the selected Python file or falls back from resource files", () => {
		const project = createPythonIdeProject("data");

		expect(getPythonIdeRunnableFile(project)?.name).toBe("main.py");

		project.activeFileName = "scores.csv";
		expect(getPythonIdeRunnableFile(project)?.name).toBe("main.py");
	});
});
