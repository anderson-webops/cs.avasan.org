import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strToU8, zipSync } from "fflate";
import {
	clearLocalPythonProjects,
	clearLocalPythonProjectsAsync,
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
	isPythonIdeRuntimeReservedPath,
	isPythonIdeTextFile,
	isValidPythonFileName,
	normalizeImportedPythonIdeFileName,
	normalizePythonIdeMode,
	loadPythonIdeStarterFilesFromGitHub,
	loadLocalPythonProjects,
	loadLocalPythonProjectsAsync,
	normalizePythonFileName,
	pythonIdeModeForCourseId,
	pythonIdeProjectToPayload,
	pythonIdeStorageKey,
	pythonIdeLibrarySupport,
	resolvePythonIdeActiveFileName,
	saveLocalPythonProjects,
	saveLocalPythonProjectsAsync,
	pgzeroCourseStarterCode,
	pgzeroStudentSvg,
	pgzeroStarterCode,
	turtleStarterCode
} from "../src/modules/pythonIde";
import { resetCodePreviewCaches } from "../src/modules/codePreview";
import {
	findPythonIdeCourseAsset,
	getPythonIdeCourseAssetObjectUrl,
	loadPythonIdeCourseAssetPack,
	parsePythonIdeCourseAssetZip,
	parsePythonIdeCourseAssetManifest,
	pythonIdeAssetCandidateNames,
	pythonIdeCourseAssetsManifestUrl,
	pythonIdeCourseAssetsZipUrl,
	resetPythonIdeCourseAssetPackCache
} from "../src/modules/pythonIdeCourseAssets";
import {
	pythonIdeImportedTopLevelModules,
	pythonIdeProjectModuleNames,
	warmPythonRuntime
} from "../src/modules/pythonIdeRuntime";
import { primePythonRuntimeConnection } from "../src/modules/pythonIdeRuntimeHints";
import {
	pythonStandardLibraryModules,
	resetPythonStandardLibraryModuleCache
} from "../src/modules/pythonStandardLibraryModules";

const oneByOnePngBytes = new Uint8Array([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
	0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01
]);

describe("python IDE project helpers", () => {
	beforeEach(() => {
		resetPythonIdeCourseAssetPackCache();
		resetCodePreviewCaches();
		resetPythonStandardLibraryModuleCache();
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
		Object.defineProperty(window, "indexedDB", {
			configurable: true,
			value: undefined
		});
	});

	afterEach(() => {
		document.head
			.querySelectorAll('link[href*="cdn.jsdelivr.net/pyodide"]')
			.forEach(element => element.remove());
		document.head
			.querySelectorAll(
				'link[href="//cdn.jsdelivr.net"], link[href="https://cdn.jsdelivr.net"]'
			)
			.forEach(element => element.remove());
		vi.unstubAllGlobals();
	});

	it("creates blank projects by default", () => {
		const pythonProject = createPythonIdeProject("python");
		const dataProject = createPythonIdeProject("data");
		const turtleProject = createPythonIdeProject("turtle");
		const pgzeroProject = createPythonIdeProject("pgzero");

		expect(pythonProject.files).toEqual([{ name: "main.py", content: "" }]);
		expect(dataProject.files).toEqual([{ name: "main.py", content: "" }]);
		expect(turtleProject.files).toEqual([{ name: "main.py", content: "" }]);
		expect(pgzeroProject.files).toEqual([{ name: "main.py", content: "" }]);
	});

	it("creates demo project templates only when requested", () => {
		const dataProject = createPythonIdeProject("data", {
			template: "demo"
		});
		const pgzeroProject = createPythonIdeProject("pgzero", {
			template: "demo"
		});
		const turtleProject = createPythonIdeProject("turtle", {
			template: "demo"
		});

		expect(dataProject.mode).toBe("data");
		expect(dataProject.title).toBe("Data / AI Notebook");
		expect(dataProject.files[0]?.content).toBe(dataScienceStarterCode);
		expect(dataProject.files[1]).toEqual({
			name: "scores.csv",
			content: dataScienceSampleCsv
		});
		expect(dataProject.files[0]?.content).toContain("pandas");
		expect(dataProject.files[0]?.content).toContain(
			'read_csv("scores.csv")'
		);
		expect(dataProject.files[0]?.content).toContain("plt.bar");

		expect(pgzeroProject.mode).toBe("pgzero");
		expect(pgzeroProject.title).toBe("PyGame Zero Game");
		expect(pgzeroProject.files[0]?.content).toBe(pgzeroStarterCode);
		expect(pgzeroProject.files[0]?.content).toContain("Actor(");
		expect(pgzeroProject.files[0]?.content).toContain("pgzrun.go()");
		expect(pgzeroProject.files[1]).toEqual({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});

		expect(turtleProject.mode).toBe("turtle");
		expect(turtleProject.files[0]?.content).toBe(turtleStarterCode);
		expect(turtleProject.files[0]?.content).toContain("screen.onkey");
		expect(turtleProject.files[0]?.content).toContain("screen.onclick");
		expect(turtleProject.files[0]?.content).toContain("screen.ontimer");
		expect(turtleProject.files[0]?.content).toContain("pen.ondrag");
	});

	it("creates PyGame course starters with dimensions only", () => {
		const project = createPythonIdeProject("pgzero", {
			courseID: "pygames",
			courseProjectKey: "pygames:course",
			template: "course"
		});

		expect(project.files).toEqual([
			{
				name: "main.py",
				content: pgzeroCourseStarterCode
			}
		]);
		expect(project.files[0]?.content).toContain("WIDTH = 640");
		expect(project.files[0]?.content).toContain("HEIGHT = 400");
		expect(project.files[0]?.content).not.toContain("Actor(");
		expect(project.files[0]?.content).not.toContain("pgzrun.go()");
	});

	it("selects an active file that exists in custom starter files", () => {
		const project = createPythonIdeProject("python", {
			files: [
				{
					name: "lesson.py",
					content: 'print("lesson")\n'
				},
				{
					name: "notes.md",
					content: "# Notes\n"
				}
			]
		});
		const dataProject = createPythonIdeProject("data", {
			files: [
				{
					name: "scores.csv",
					content: "name,score\n"
				}
			]
		});

		expect(project.activeFileName).toBe("lesson.py");
		expect(pythonIdeProjectToPayload(project).activeFileName).toBe(
			"lesson.py"
		);
		expect(resolvePythonIdeActiveFileName(project.files, "notes.md")).toBe(
			"notes.md"
		);
		expect(dataProject.activeFileName).toBe("scores.csv");

		project.activeFileName = "missing.py";
		expect(
			resolvePythonIdeActiveFileName(project.files, "missing.py")
		).toBe("lesson.py");
		expect(pythonIdeProjectToPayload(project).activeFileName).toBe(
			"lesson.py"
		);
	});

	it("preloads the Pyodide runtime script when warming the IDE", () => {
		warmPythonRuntime();
		warmPythonRuntime();

		const preloadSelector =
			'link[rel="preload"][as="script"][href="https://cdn.jsdelivr.net/pyodide/v314.0.0/full/pyodide.js"]';
		const preload = document.head.querySelector(preloadSelector);

		expect(preload).not.toBeNull();
		expect(preload?.getAttribute("crossorigin")).toBe("anonymous");
		expect(document.head.querySelectorAll(preloadSelector)).toHaveLength(1);
		expect(
			document.head.querySelector(
				'link[rel="preconnect"][href="https://cdn.jsdelivr.net"]'
			)
		).not.toBeNull();
	});

	it("primes the Python runtime connection without preloading Pyodide", () => {
		primePythonRuntimeConnection();
		primePythonRuntimeConnection();

		const preconnectSelector =
			'link[rel="preconnect"][href="https://cdn.jsdelivr.net"]';
		const preloadSelector =
			'link[rel="preload"][as="script"][href="https://cdn.jsdelivr.net/pyodide/v314.0.0/full/pyodide.js"]';

		expect(document.head.querySelector(preconnectSelector)).not.toBeNull();
		expect(document.head.querySelectorAll(preconnectSelector)).toHaveLength(
			1
		);
		expect(document.head.querySelector(preloadSelector)).toBeNull();
	});

	it("loads GitHub starter files into safe IDE file names", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string) => {
				if (url.includes("api.github.com")) {
					return new Response(
						JSON.stringify([
							{
								download_url:
									"https://raw.githubusercontent.com/example/main.py",
								html_url:
									"https://github.com/example/course/blob/main/starter/main.py",
								name: "main.py",
								path: "starter/main.py",
								size: 18,
								type: "file"
							},
							{
								download_url:
									"https://raw.githubusercontent.com/example/scores.csv",
								html_url:
									"https://github.com/example/course/blob/main/starter/data/scores.csv",
								name: "scores.csv",
								path: "starter/data/scores.csv",
								size: 17,
								type: "file"
							}
						])
					);
				}

				return new Response(
					url.endsWith("main.py")
						? 'print("starter")\n'
						: "name,score\nAri,10\n"
				);
			})
		);

		const files = await loadPythonIdeStarterFilesFromGitHub(
			"https://github.com/instruction-material/Python-Level-1/tree/main/starter"
		);

		expect(files).toEqual([
			{
				name: "main.py",
				content: 'print("starter")\n',
				encoding: "text"
			},
			{
				name: "scores.csv",
				content: "name,score\nAri,10\n",
				encoding: "text"
			}
		]);
	});

	it("serializes remote project payloads with course starter metadata", () => {
		const project = createPythonIdeProject("turtle", {
			courseID: "python-level-1",
			courseProjectKey: "python-level-1:lesson-1:starter",
			courseProjectTitle: "Turtle Coordinates",
			starterLabel: "Starter project",
			starterUrl:
				"https://github.com/instruction-material/Python-Level-1/tree/main/starter"
		});
		const payload = pythonIdeProjectToPayload(project);

		expect(payload).toEqual({
			title: project.title,
			mode: project.mode,
			files: project.files,
			activeFileName: project.activeFileName,
			courseID: "python-level-1",
			courseProjectKey: "python-level-1:lesson-1:starter",
			courseProjectTitle: "Turtle Coordinates",
			starterLabel: "Starter project",
			starterUrl:
				"https://github.com/instruction-material/Python-Level-1/tree/main/starter"
		});
		expect(payload).not.toHaveProperty("_id");
		expect(payload).not.toHaveProperty("createdAt");
		expect(payload).not.toHaveProperty("updatedAt");
	});

	it("keeps remote project payload titles valid when the name is blank", () => {
		const project = createPythonIdeProject("python");
		project.title = "   ";

		expect(pythonIdeProjectToPayload(project).title).toBe(
			"Untitled Python Project"
		);
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

	it("uses localStorage fallback when IndexedDB is unavailable", async () => {
		const project = createPythonIdeProject("pgzero");

		await saveLocalPythonProjectsAsync([project], "student-a");

		expect(loadLocalPythonProjects("student-a")).toHaveLength(1);
		await expect(
			loadLocalPythonProjectsAsync("student-a")
		).resolves.toHaveLength(1);

		await clearLocalPythonProjectsAsync("student-a");

		expect(loadLocalPythonProjects("student-a")).toEqual([]);
	});

	it("keeps newer localStorage snapshots ahead of stale IndexedDB records", () => {
		const moduleSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIde.ts"),
			"utf8"
		);

		expect(moduleSource).toContain("function pythonIdeProjectSetUpdatedAt");
		expect(moduleSource).toContain("const storedProjectsUpdatedAt");
		expect(moduleSource).toContain("const legacyProjectsUpdatedAt");
		expect(moduleSource).toContain(
			"if (legacyProjectsUpdatedAt > storedProjectsUpdatedAt)"
		);
		expect(moduleSource).toContain(
			"await saveLocalPythonProjectsAsync(legacyProjects, userID);"
		);
	});

	it("keeps IndexedDB wired as the primary local project store", () => {
		const moduleSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIde.ts"),
			"utf8"
		);

		expect(moduleSource).toContain("window.indexedDB.open");
		expect(moduleSource).toContain(
			'const PYTHON_IDE_PROJECT_STORE = "projectStores";'
		);
		expect(moduleSource).toContain(
			"export async function saveLocalPythonProjectsAsync"
		);
		expect(moduleSource).toContain("await writeIndexedDbPythonProjects");
		expect(moduleSource).toContain(
			"saveLegacyLocalPythonProjectsMirror(projects, userID);"
		);
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
		expect(pythonIdeModeForCourseId("data-science-in-python")).toBe("data");
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
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
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
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("def ontimer(self, function, t=0):");
		expect(runtimeSource).toContain("def ontimer(function, t=0):");
		expect(runtimeSource).toContain("_bridge.scheduleTimer");
		expect(runtimeSource).toContain("def _release_all_callbacks():");
		expect(runtimeSource).toContain("releaseRuntimeCallbackRegistries");
		expect(runtimeSource).toContain("releasePythonIdeRuntimeCallbacks");
		expect(pageSource).toContain("scheduleTimer(delayMs: number");
		expect(pageSource).toContain("clearTurtleTimers()");
		expect(pageSource).toContain("let turtleTimerGeneration = 0;");
		expect(pageSource).toContain("turtleTimerGeneration += 1;");
		expect(pageSource).toContain("async function runTurtleTimerCallback");
		expect(pageSource).toContain("await waitForTurtleAnimation();");
		expect(pageSource).toContain(
			"if (timerGeneration !== turtleTimerGeneration) return;"
		);
		expect(pageSource).toContain(
			"void runTurtleTimerCallback(callback, timerGeneration);"
		);
		expect(pageSource).toContain("releaseIdlePythonRuntimeCallbacks()");
	});

	it("keeps Turtle runs animated with a visible cursor marker", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
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

	it("keeps Turtle trail drawing synchronized to the visible cursor pose", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const renderCommandStart = pageSource.indexOf(
			"function renderTurtleCommand"
		);
		const renderSceneStart = pageSource.indexOf(
			"function renderTurtleScene"
		);
		const renderCommandSource = pageSource.slice(
			renderCommandStart,
			renderSceneStart
		);
		const renderSceneSource = pageSource.slice(
			renderSceneStart,
			pageSource.indexOf("function resolveActiveTurtleAnimation")
		);
		const forwardStart = runtimeSource.indexOf(
			"    def forward(self, distance):"
		);
		const forwardSource = runtimeSource.slice(
			forwardStart,
			runtimeSource.indexOf("    def fd(self, distance):", forwardStart)
		);
		const gotoStart = runtimeSource.indexOf(
			"    def goto(self, x, y=None):"
		);
		const gotoSource = runtimeSource.slice(
			gotoStart,
			runtimeSource.indexOf("    def setpos(self, x, y=None):", gotoStart)
		);

		expect(renderCommandSource).toContain(
			"activeLineEnd?: { x: number; y: number }"
		);
		expect(renderCommandSource).toContain("activeLineEnd ??");
		expect(renderCommandSource).toContain(
			'context.lineCap = activeLineEnd ? "butt" : "round";'
		);
		expect(renderSceneSource).toContain(
			'activeCommand.command.kind === "line"'
		);
		expect(renderSceneSource).toContain(
			"? { x: markerPose.x, y: markerPose.y }"
		);
		expect(pageSource).toContain(
			"turtleAnimationStepDistance(step) <= turtleInstantStepMaxDistance"
		);
		expect(pageSource).not.toContain(
			"return step.durationMs <= turtleInstantStepMaxDurationMs;"
		);
		expect(forwardSource).toContain("next_x = self._x +");
		expect(forwardSource).toContain("next_y = self._y +");
		expect(
			forwardSource.indexOf("self._set_position(next_x, next_y)")
		).toBeLessThan(
			forwardSource.indexOf("_bridge.goto(float(next_x), float(next_y))")
		);
		expect(gotoSource.indexOf("self._set_position(x, y)")).toBeLessThan(
			gotoSource.indexOf("_bridge.goto(float(x), float(y))")
		);
	});

	it("moves the Turtle through standard circle arcs instead of drawing a static circle", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const circleStart = runtimeSource.indexOf(
			"    def circle(self, radius, extent=None, steps=None):"
		);
		const circleSource = runtimeSource.slice(
			circleStart,
			runtimeSource.indexOf(
				"    def dot(self, size=8, color=None):",
				circleStart
			)
		);

		expect(circleSource).toContain("if extent is None:");
		expect(circleSource).toContain("extent = 360.0");
		expect(circleSource).toContain("steps = 1 + int(");
		expect(circleSource).toContain("turn = extent / steps");
		expect(circleSource).toContain("half_turn = turn * 0.5");
		expect(circleSource).toContain(
			"side_length = 2.0 * radius * math.sin(math.radians(half_turn))"
		);
		expect(circleSource).toContain("if radius < 0:");
		expect(circleSource).toContain("self.left(half_turn)");
		expect(circleSource).toContain("for _ in range(steps):");
		expect(circleSource).toContain("self.forward(side_length)");
		expect(circleSource).toContain("self.left(turn)");
		expect(circleSource).toContain("self.left(-half_turn)");
		expect(circleSource).not.toContain("_bridge.circle(float(radius))");
	});

	it("supports standard Turtle dot size and color overloads", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const dotStart = runtimeSource.indexOf(
			"    def dot(self, size=None, *color):"
		);
		const dotSource = runtimeSource.slice(
			dotStart,
			runtimeSource.indexOf("    def stamp(self):", dotStart)
		);

		expect(runtimeSource).toContain("def _looks_like_color(value):");
		expect(runtimeSource).toContain(
			"return len(sequence) >= 3 and all(_is_number(part) for part in sequence[:3])"
		);
		expect(runtimeSource).toContain("def _default_dot_size(self):");
		expect(runtimeSource).toContain(
			"return self._line_width + max(self._line_width, 4.0)"
		);
		expect(dotSource).toContain("if _looks_like_color(size):");
		expect(dotSource).toContain("dot_size = self._default_dot_size()");
		expect(dotSource).toContain("dot_color = _normalize_color(size)");
		expect(dotSource).toContain(
			"dot_size = size or self._default_dot_size()"
		);
		expect(dotSource).toContain("dot_color = _normalize_color(*color)");
		expect(dotSource).toContain(
			"_bridge.dot(float(dot_size), str(dot_color))"
		);
		expect(runtimeSource).toContain(
			"def dot(size=None, *color): _default.dot(size, *color)"
		);
	});

	it("renders the original Turtle built-in shapes with classic as default", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const markerStart = pageSource.indexOf("function drawTurtleMarker");
		const markerEnd = pageSource.indexOf(
			"function renderTurtleCommand",
			markerStart
		);
		const markerSource = pageSource.slice(markerStart, markerEnd);

		expect(pageSource).toContain(
			'const defaultTurtleShape: TurtleShapeName = "classic"'
		);
		expect(pageSource).toContain("shape: defaultTurtleShape");
		expect(pageSource).toContain('penColor: "#000000"');
		expect(pageSource).toContain("const turtleOriginalShapePolygons = {");
		expect(pageSource).toContain("classic: [");
		expect(pageSource).toContain("[0, 0]");
		expect(pageSource).toContain("[0, 16]");
		expect(pageSource).toContain("function drawClassicTurtleShape");
		expect(pageSource).toContain("function drawArrowTurtleShape");
		expect(pageSource).toContain("function drawOriginalTurtleShape");
		expect(pageSource).toContain("function drawFancyTurtleShape");
		expect(pageSource).toContain("function drawOriginalTurtlePolygonShape");
		expect(pageSource).toContain(
			"context.moveTo(firstPoint[1], firstPoint[0])"
		);
		expect(pageSource).toContain(
			"for (const [x, y] of remainingPoints) context.lineTo(y, x);"
		);
		expect(markerSource).toContain("context.rotate(-radians)");
		expect(markerSource).toContain('case "classic"');
		expect(markerSource).toContain('case "turtle"');
		expect(markerSource).toContain('case "blank"');
		expect(markerSource).toContain('case "fancy"');
		expect(runtimeSource).toContain(
			'_builtin_shapes = {"arrow", "blank", "circle", "classic", "fancy", "square", "triangle", "turtle"}'
		);
		expect(runtimeSource).toContain('self._shape = "classic"');
		expect(runtimeSource).toContain("def shape(self, *_args):");
		expect(runtimeSource).toContain("def hideturtle(self):");
		expect(runtimeSource).toContain("def showturtle(self):");
		expect(runtimeSource).toContain("def isvisible(self):");
		expect(runtimeSource).toContain(
			"def hideturtle(): return _default.hideturtle()"
		);
	});

	it("guards long-running student loops before executing Python files", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("const FOR_LOOP_ITERATION_LIMIT");
		expect(runtimeSource).toContain(
			"const PYTHON_IDE_RUNTIME_BOOTSTRAP_VERSION"
		);
		expect(runtimeSource).toContain("__classes_runtime_bootstrap_version");
		expect(runtimeSource).toContain("2026-06-19-stale-import-hook-reset");
		expect(runtimeSource).toContain("const WHILE_LOOP_ITERATION_LIMIT");
		expect(runtimeSource).toContain(
			"const TURTLE_COOPERATIVE_WHILE_LOOP_ITERATION_LIMIT"
		);
		expect(runtimeSource).toContain(
			"const TURTLE_COOPERATIVE_WHILE_LOOP_ITERATION_LIMIT = 0"
		);
		expect(runtimeSource).toContain(
			"const TURTLE_COOPERATIVE_LOOP_DELAY_MS = 8"
		);
		expect(runtimeSource).toContain("class __ClassesLoopGuardTransformer");
		expect(runtimeSource).toContain("def __classes_loop_guard(kind):");
		expect(runtimeSource).toContain("if limit <= 0:");
		expect(runtimeSource).toContain("__classes_loop_iteration_limits");
		expect(runtimeSource).toContain(
			"__classes_turtle_animation_call_names"
		);
		expect(runtimeSource).toContain("def __classes_schedule_turtle_loop");
		expect(runtimeSource).toContain("def _is_simple_top_level_turtle_loop");
		expect(runtimeSource).toContain("def _module_imports_turtle");
		expect(runtimeSource).toContain("def _node_uses_turtle_api");
		expect(runtimeSource).toContain("def _module_turtle_helper_names");
		expect(runtimeSource).toContain("def _is_forever_while_loop");
		expect(runtimeSource).toContain("node.test.value in (True, 1)");
		expect(runtimeSource).toContain("function.id in turtle_helper_names");
		expect(runtimeSource).toContain("def __classes_sleep(_seconds=0):");
		expect(runtimeSource).toContain(
			"__classes_time.sleep = __classes_sleep"
		);
		expect(runtimeSource).toContain("__classes_compile_student_source(");
		expect(runtimeSource).toContain("class __ClassesProjectSourceLoader");
		expect(runtimeSource).toContain(
			"return _classes_compile_student_source(source, path)"
		);
		expect(runtimeSource).toContain("class __ClassesProjectImportFinder");
		expect(runtimeSource).toContain(
			"__classes_install_project_import_hook()"
		);
		expect(runtimeSource).toContain(
			"createInputBootstrap(options.inputText, options.mode)"
		);
		expect(runtimeSource).toContain("visit_While");
		expect(runtimeSource).toContain("visit_For");
		expect(runtimeSource).toContain("visit_Module");
		expect(runtimeSource).toContain("ast.get_source_segment");
		expect(pageSource).toContain("function formatPythonRuntimeError");
		expect(pageSource).toContain("const pythonTracebackFrameRegex");
		expect(pageSource).toContain("function markPythonRuntimeErrorInEditor");
		expect(pageSource).toContain("pythonRuntimeDiagnosticForLine");
		expect(pageSource).toContain("pythonRuntimeDiagnosticEffect");
		expect(pageSource).toContain(
			"RuntimeError: Stopped a long-running (?:for|while) loop"
		);
		expect(pageSource).toContain("formatPythonRuntimeError(error)");
	});

	it("keeps tiny Turtle animation steps responsive for continuous movement", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			"return Math.min(900, Math.max(16, distance * 5));"
		);
		expect(pageSource).toContain(
			"const turtleAnimationInitialFrameCreditMs = 16"
		);
		expect(pageSource).toContain(
			"const turtleInstantStepMaxDurationMs = 16"
		);
		expect(pageSource).toContain(
			"const turtleTurnStepDurationMs = turtleInstantStepMaxDurationMs"
		);
		expect(pageSource).toContain("const turtleInstantStepMaxDistance = 2");
		expect(pageSource).toContain(
			"const turtleInstantFrameDistanceBudget = 12"
		);
		expect(pageSource).toContain("const turtleInstantFrameStepBudget = 24");
		expect(pageSource).toContain(
			"step.durationMs <= turtleInstantStepMaxDurationMs"
		);
		expect(pageSource).toContain("!isVisibleTurtleTrailStep(step)");
		expect(pageSource).toContain(
			"turtleAnimationStepDistance(step) <= turtleInstantStepMaxDistance"
		);
		expect(pageSource).toContain("let turtleVisiblePoses");
		expect(pageSource).toContain("function setTurtleVisiblePose");
		expect(pageSource).toContain(
			"markerPose = visibleTurtlePose(synchronizedTurtleID)"
		);
		expect(pageSource).toContain("Math.min(");
		expect(pageSource).toContain("turtleAnimationInitialFrameCreditMs,");
		expect(pageSource).toContain(
			"activeTurtleAnimationStep?.durationMs ?? 0"
		);
		expect(pageSource).toContain(
			"setTurtleVisiblePose(markerPose, step.turtleID)"
		);
		expect(pageSource).toContain(
			"setTurtleVisiblePose(step.toPose, step.turtleID)"
		);
		expect(pageSource).toContain("renderTurtleScene();");
	});

	it("keeps repeated Turtle turn controls off the slow animation queue", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			"if (headingDelta > 0) return turtleTurnStepDurationMs;"
		);
		expect(pageSource).not.toContain(
			"return Math.min(260, Math.max(90, headingDelta * 1.5));"
		);
	});

	it("supports Turtle speed and tracer animation controls", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(pageSource).toContain("let turtleTracerEnabled = true;");
		expect(pageSource).toContain(
			"if (!turtleTracerEnabled || fromPose.speed === 0)"
		);
		expect(pageSource).toContain("setSpeed(speed: number)");
		expect(pageSource).toContain("setTracer(value: number)");
		expect(runtimeSource).toContain("def _normalize_turtle_speed(value):");
		expect(runtimeSource).toContain('"fastest": 0.0');
		expect(runtimeSource).toContain(
			"def tracer(*args): return _screen.tracer(*args)"
		);
		expect(runtimeSource).toContain("def update(): return _screen.update()");
		expect(runtimeSource).toContain("_bridge.setSpeed(float(self._speed))");
		expect(runtimeSource).toContain("_bridge.setTracer(float(_tracer_value))");
	});

	it("keeps the Turtle cursor drawn directly above its trail", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const markerStart = pageSource.indexOf("function drawTurtleMarker");
		const markerEnd = pageSource.indexOf(
			"function drawClassicTurtleShape",
			markerStart
		);
		const markerSource = pageSource.slice(markerStart, markerEnd);

		expect(markerSource).toContain("if (!pose.visible) return;");
		expect(markerSource).not.toContain("drawTurtleMarkerTrailMask");
		expect(pageSource).not.toContain("function drawTurtleMarkerTrailMask");
		expect(
			markerSource.indexOf("context.translate(point.x, point.y)")
		).toBeLessThan(
			markerSource.indexOf("context.strokeStyle = pose.penColor")
		);
		expect(pageSource).toContain("const turtleMarkerHaloLineWidth = 4");
		expect(pageSource).toContain("const turtleMarkerStrokeLineWidth = 1.2");
		expect(pageSource).toContain(
			"context.strokeStyle = turtleState.background"
		);
		expect(pageSource).toContain(
			"context.lineWidth = turtleMarkerHaloLineWidth"
		);
		expect(pageSource).toContain("context.fillStyle = markerColor");
		expect(pageSource).toContain(
			"context.lineWidth = turtleMarkerStrokeLineWidth"
		);
	});

	it("keeps visible Turtle trail steps out of instant batching", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const instantStart = pageSource.indexOf(
			"function isInstantTurtleAnimationStep"
		);
		const instantSource = pageSource.slice(
			instantStart,
			pageSource.indexOf(
				"function isVisibleTurtleTrailStep",
				instantStart
			)
		);
		const flushStart = pageSource.indexOf(
			"function flushInstantTurtleAnimationSteps"
		);
		const flushSource = pageSource.slice(
			flushStart,
			pageSource.indexOf("function scheduleTurtleAnimation", flushStart)
		);

		expect(pageSource).toContain(
			"function flushInstantTurtleAnimationSteps"
		);
		expect(instantSource).toContain("!isVisibleTurtleTrailStep(step)");
		expect(pageSource).toContain("function isVisibleTurtleTrailStep");
		expect(flushSource).toContain(
			"consumedDistance < turtleInstantFrameDistanceBudget"
		);
		expect(flushSource).toContain(
			"consumedSteps < turtleInstantFrameStepBudget"
		);
		expect(flushSource).toContain("completeTurtleAnimationStep(step);");
		expect(flushSource).toContain(
			"renderTurtleScene(markerPose, undefined, synchronizedTurtleID);"
		);
		expect(flushSource).not.toContain("renderedActiveLineStep");
		expect(pageSource).toContain("void scheduleTurtleAnimation();");
	});

	it("keeps separate browser poses for independent Turtle instances", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain("_turtle_counter = 0");
		expect(runtimeSource).toContain(
			"self._bridge_id = str(_turtle_counter)"
		);
		expect(runtimeSource).toContain(
			"_bridge.activate(str(self._bridge_id))"
		);
		expect(runtimeSource).toContain("activate: (id: string) => void");
		expect(runtimeSource).toContain("clearTurtle: () => void");
		expect(runtimeSource).toContain("resetTurtle: () => void");
		expect(pageSource).toContain('const defaultTurtleID = "default"');
		expect(pageSource).toContain("let activeTurtleID = defaultTurtleID");
		expect(pageSource).toContain("let turtleVisiblePoses = new Map");
		expect(pageSource).toContain("interface TurtleCompletedCommand");
		expect(pageSource).toContain("function activateTurtleState");
		expect(pageSource).toContain("turtleStates.delete(defaultTurtleID)");
		expect(pageSource).toContain(
			"turtleID: step.turtleID ?? activeTurtleID"
		);
		expect(pageSource).toContain(
			"activeTurtleAnimationStep.turtleID === synchronizedTurtleID"
		);
		expect(pageSource).toContain(
			"for (const [turtleID, pose] of turtleVisiblePoses)"
		);
		expect(pageSource).toContain("activate(id: string)");
	});

	it("keeps Turtle clear and reset scoped to the active Turtle", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const turtleClearStart = runtimeSource.indexOf(
			"    def clear(self):",
			runtimeSource.indexOf("class Turtle")
		);
		const turtleClearSource = runtimeSource.slice(
			turtleClearStart,
			runtimeSource.indexOf("    def reset(self):", turtleClearStart)
		);
		const turtleResetStart = runtimeSource.indexOf(
			"    def reset(self):",
			turtleClearStart
		);
		const turtleResetSource = runtimeSource.slice(
			turtleResetStart,
			runtimeSource.indexOf("    def distance(self", turtleResetStart)
		);

		expect(turtleClearSource).toContain("_bridge.clearTurtle()");
		expect(turtleClearSource).not.toContain("_bridge.clear()");
		expect(turtleResetSource).toContain("_bridge.resetTurtle()");
		expect(turtleResetSource).not.toContain("_bridge.reset()");
		expect(pageSource).toContain("function cancelActiveTurtleDrawingSteps");
		expect(pageSource).toContain(
			"command => command.turtleID !== turtleID"
		);
		expect(pageSource).toContain("step => step.turtleID !== turtleID");
		expect(pageSource).toContain("function clearActiveTurtleDrawing");
		expect(pageSource).toContain("function resetActiveTurtle");
		expect(pageSource).toContain("resetTurtle: resetActiveTurtle");
		expect(pageSource).toContain("clearTurtle: clearActiveTurtleDrawing");
		expect(pageSource).toContain("reset: resetTurtleCanvas");
		expect(pageSource).toContain("clear: resetTurtleCanvas");
		expect(pageSource).toContain(
			"for (const state of turtleStates.values()) state.background = color"
		);
		expect(pageSource).toContain("renderTurtleScene();");
	});

	it("keeps visible Turtle trail movement on the synchronized animation path", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const instantStart = pageSource.indexOf(
			"function isInstantTurtleAnimationStep"
		);
		const instantSource = pageSource.slice(
			instantStart,
			pageSource.indexOf(
				"function isVisibleTurtleTrailStep",
				instantStart
			)
		);
		const flushStart = pageSource.indexOf(
			"function flushInstantTurtleAnimationSteps"
		);
		const flushSource = pageSource.slice(
			flushStart,
			pageSource.indexOf("function scheduleTurtleAnimation", flushStart)
		);

		expect(pageSource).toContain("function isVisibleTurtleTrailStep");
		expect(pageSource).toContain('step.command?.kind === "line"');
		expect(instantSource).toContain("!isVisibleTurtleTrailStep(step)");
		expect(flushSource).not.toContain("synchronizedTrailBatch");
		expect(flushSource).not.toContain("renderedActiveLineStep");
		expect(flushSource).toContain(
			"renderTurtleScene(markerPose, undefined, synchronizedTurtleID);"
		);
	});

	it("redraws Turtle canvas resizes without resetting active drawings", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const resizeCanvasStart = pageSource.indexOf(
			"function resizeCanvasForDisplay"
		);
		const resizeCanvasSource = pageSource.slice(
			resizeCanvasStart,
			pageSource.indexOf("function currentTurtlePose", resizeCanvasStart)
		);
		const gameTransformStart = pageSource.indexOf(
			"function setGameCanvasTransform"
		);
		const gameTransformSource = pageSource.slice(
			gameTransformStart,
			pageSource.indexOf("function clearGameCanvas", gameTransformStart)
		);

		expect(pageSource).toContain("function syncCanvasBitmapSize");
		expect(pageSource).toContain("if (canvas.width !== nextWidth)");
		expect(pageSource).toContain("if (canvas.height !== nextHeight)");
		expect(resizeCanvasSource).toContain(
			"syncCanvasBitmapSize(canvas, rect, dpr);"
		);
		expect(gameTransformSource).toContain(
			"syncCanvasBitmapSize(canvas, rect, dpr);"
		);
		expect(pageSource).toContain("function redrawActiveCanvas");
		expect(pageSource).toContain("renderTurtleScene();");
		expect(pageSource).toContain(
			"new ResizeObserver(() => redrawActiveCanvas())"
		);
	});

	it("maps Turtle coordinates without repeated layout reads per command", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const coordinateMapperStart = pageSource.indexOf(
			"function createCanvasCoordinateMapper"
		);
		const getCanvasContextStart = pageSource.indexOf(
			"function getCanvasContext"
		);
		const renderCommandStart = pageSource.indexOf(
			"function renderTurtleCommand"
		);
		const renderSceneStart = pageSource.indexOf(
			"function renderTurtleScene"
		);
		const coordinateMapperSource = pageSource.slice(
			coordinateMapperStart,
			getCanvasContextStart
		);
		const renderCommandSource = pageSource.slice(
			renderCommandStart,
			renderSceneStart
		);
		const renderSceneSource = pageSource.slice(
			renderSceneStart,
			pageSource.indexOf("function resolveActiveTurtleAnimation")
		);

		expect(pageSource).toContain("type CanvasCoordinateMapper");
		expect(coordinateMapperSource).not.toContain("getBoundingClientRect()");
		expect(renderCommandSource).toContain(
			"toCanvas: CanvasCoordinateMapper"
		);
		expect(renderCommandSource).not.toContain("getBoundingClientRect()");
		expect(renderSceneSource).toContain(
			"const toCanvas = createCanvasCoordinateMapper(rect);"
		);
		expect(renderSceneSource).toContain(
			"renderTurtleCommand(context, command, toCanvas);"
		);
		expect(renderSceneSource).toContain(
			"drawTurtleMarker(context, markerPose, toCanvas);"
		);
	});

	it("bounds output rendering so print-heavy runs stay responsive", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const maxOutputLines = 500;");
		expect(pageSource).toContain("const maxOutputTextLength = 12000;");
		expect(pageSource).toContain("outputEntryTruncatedMessage");
		expect(pageSource).toContain("outputHistoryTrimmedMessage");
		expect(pageSource).toContain("text.length > maxOutputTextLength");
		expect(pageSource).toContain(
			"line.text !== outputHistoryTrimmedMessage"
		);
		expect(pageSource).toContain("maxOutputLines - 1");
	});

	it("bounds runtime artifacts so chart-heavy runs stay responsive", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const maxRuntimeArtifacts = 12;");
		expect(pageSource).toContain(
			"const maxRuntimeArtifactTextLength = 500000;"
		);
		expect(pageSource).toContain(
			"const maxRuntimeArtifactBase64Length = 1500000;"
		);
		expect(pageSource).toContain(
			"runtimeArtifacts.value.length >= maxRuntimeArtifacts"
		);
		expect(pageSource).toContain(
			"artifact.data.length > maxRuntimeArtifactBase64Length"
		);
		expect(pageSource).toContain(
			"artifact.data.length > maxRuntimeArtifactTextLength"
		);
		expect(pageSource).toContain(
			"`Skipped ${artifact.title}; rendered artifacts must be under ${formatFileSize(maxRuntimeArtifactTextLength)}.`"
		);
	});

	it("keeps rendered HTML artifacts isolated from the IDE page", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const iframeStart = pageSource.indexOf("<iframe");
		const iframeEnd = pageSource.indexOf("/>", iframeStart);
		const iframeSource = pageSource.slice(iframeStart, iframeEnd);

		expect(pageSource).toContain('artifact.mimeType === "text/html"');
		expect(iframeSource).toContain('v-else-if="artifact.srcdoc"');
		expect(iframeSource).toContain('referrerpolicy="no-referrer"');
		expect(iframeSource).toContain('sandbox="allow-scripts"');
		expect(iframeSource).not.toContain("allow-same-origin");
	});

	it("bounds imported project files before local storage writes", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const maxPythonIdeProjectFiles = 40;");
		expect(pageSource).toContain(
			"const maxImportedTextFileBytes = 512 * 1024;"
		);
		expect(pageSource).toContain(
			"const maxImportedBinaryFileBytes = 2 * 1024 * 1024;"
		);
		expect(pageSource).toContain("function importedProjectFileSizeLimit");
		expect(pageSource).toContain("file.size > sizeLimit");
		expect(pageSource).toContain(
			"project.files.length >= maxPythonIdeProjectFiles"
		);
		expect(pageSource).toContain(
			"project already has ${maxPythonIdeProjectFiles} files"
		);
		expect(pageSource).toContain(
			"larger than ${formatFileSize(sizeLimit)}"
		);
		expect(pageSource).toContain("await readImportedProjectFile");
		expect(pageSource).toContain("continue;");
	});

	it("checks requested stops before post-run capture and game loop startup", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const captureIndex = runtimeSource.indexOf(
			"options.onProjectFilesUpdate?.(await captureProjectTextFiles(pyodide));"
		);
		const gameLoopIndex = runtimeSource.indexOf(
			"options.gameBridge.consumeLoopRequest();"
		);

		expect(runtimeSource).toContain("shouldStop?: () => boolean;");
		expect(runtimeSource).toContain("function throwIfRunStopped");
		expect(runtimeSource).toContain(
			"Python run stopped before post-run work completed."
		);
		expect(captureIndex).toBeGreaterThan(0);
		expect(
			runtimeSource.lastIndexOf(
				"throwIfRunStopped(options);",
				captureIndex
			)
		).toBeGreaterThan(0);
		expect(gameLoopIndex).toBeGreaterThan(0);
		expect(
			runtimeSource.lastIndexOf(
				"throwIfRunStopped(options);",
				gameLoopIndex
			)
		).toBeGreaterThan(captureIndex);
		expect(runtimeSource).toContain(
			"const runContinuously = options.gameBridge.consumeLoopRequest();"
		);
		expect(runtimeSource).toContain("{ continuous: runContinuously }");
		expect(pageSource).toContain("shouldStop: () => stopRequested.value");
		expect(pageSource).toContain("Stopped Python run.");
		expect(pageSource).toContain(
			"Python will halt at the next runtime checkpoint."
		);
		expect(pageSource).toContain("function stopActiveRuntimeSurfaces");
		expect(pageSource).toContain("invalidateTurtleBridgeRuns();");
		expect(pageSource).toContain("invalidateGameBridgeRuns();");
		expect(pageSource).toContain("stopLoadedPythonRuntimeRun();");
		expect(pageSource).toContain("stopAllGameAudio();");
		expect(pageSource).toContain("gameKeysDown.clear();");
		expect(pageSource).toContain("gameEvents.length = 0;");
		expect(pageSource).toContain("stopRequested.value = true;");
		expect(pageSource).toContain("stopActiveRuntimeSurfaces();");
	});

	it("guards PyGame Zero bridge calls to the active run", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const guardStart = pageSource.indexOf(
			"function createGuardedGameBridgeRun"
		);
		const guardSource = pageSource.slice(
			guardStart,
			pageSource.indexOf("function resetActiveCanvas", guardStart)
		);

		expect(pageSource).toContain("let activeGameBridgeRunID = 0;");
		expect(pageSource).toContain("function invalidateGameBridgeRuns");
		expect(pageSource).toContain(
			'project.mode === "pgzero"\n\t\t\t\t\t? createGuardedGameBridgeRun()\n\t\t\t\t\t: gameBridge'
		);
		expect(guardSource).toContain("const runID = ++activeGameBridgeRunID;");
		expect(guardSource).toContain(
			"const isActiveRun = () => runID === activeGameBridgeRunID;"
		);
		expect(guardSource).toContain("if (!isActiveRun()) return;");
		expect(guardSource).toContain(
			'return isActiveRun() ? gameBridge.popEventsJson() : "";'
		);
		expect(guardSource).toContain(
			"return isActiveRun() ? gameBridge.playTone(frequency, duration) : 0;"
		);
		expect(guardSource).toContain("gameBridge.fill(color, gcolor);");
	});

	it("guards PyGame Zero loop ticks from stale async completions", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const startGameLoopStart = pageSource.indexOf("function startGameLoop");
		const startGameLoopSource = pageSource.slice(
			startGameLoopStart,
			pageSource.indexOf("function drawGameActor", startGameLoopStart)
		);
		const stopGameLoopStart = pageSource.indexOf("function stopGameLoop");
		const stopGameLoopSource = pageSource.slice(
			stopGameLoopStart,
			pageSource.indexOf("function stopAllGameAudio", stopGameLoopStart)
		);

		expect(pageSource).toContain("let activeGameLoopID = 0;");
		expect(pageSource).toContain(
			"let gameOnDemandTickFrame: number | null = null;"
		);
		expect(pageSource).toContain("let gameLoopContinuous = false;");
		expect(pageSource).toContain("let gameTickQueued = false;");
		expect(pageSource).toContain(
			"let gameTickCallback: (() => Promise<void>) | null = null;"
		);
		expect(stopGameLoopSource).toContain("activeGameLoopID += 1;");
		expect(startGameLoopSource).toContain(
			"const loopID = ++activeGameLoopID;"
		);
		expect(pageSource).toContain("function requestGameTick");
		expect(pageSource).toContain("function requestContinuousGameLoop");
		expect(pageSource).toContain("async function runGameTick");
		expect(startGameLoopSource).toContain(
			"options: StartGameLoopOptions = {}"
		);
		expect(startGameLoopSource).toContain(
			"gameLoopContinuous = options.continuous ?? true;"
		);
		expect(startGameLoopSource).toContain(
			"if (loopID !== activeGameLoopID || !gameLoopContinuous)"
		);
		expect(startGameLoopSource).toContain(
			"gameAnimationFrame = requestAnimationFrame(runFrame);"
		);
		expect(startGameLoopSource).toContain("void runGameTick(loopID);");
		expect(startGameLoopSource).toContain("requestGameTick();");
		expect(pageSource).toContain(
			"if (!gameTickCallback || gameLoopContinuous) return;"
		);
		expect(pageSource).toContain("gameTickQueued = true;");
		expect(pageSource).toContain("requestContinuousGameLoop();");
		expect(pageSource).toContain("}, options);");
		expect(stopGameLoopSource).toContain(
			"if (gameOnDemandTickFrame !== null)"
		);
	});

	it("guards Turtle bridge calls to the active run", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const guardStart = pageSource.indexOf(
			"function createGuardedTurtleBridgeRun"
		);
		const guardSource = pageSource.slice(
			guardStart,
			pageSource.indexOf("const gameBridge", guardStart)
		);

		expect(pageSource).toContain("let activeTurtleBridgeRunID = 0;");
		expect(pageSource).toContain("function invalidateTurtleBridgeRuns");
		expect(pageSource).toContain(
			'project.mode === "turtle"\n\t\t\t\t\t? createGuardedTurtleBridgeRun()\n\t\t\t\t\t: turtleBridge'
		);
		expect(guardSource).toContain(
			"const runID = ++activeTurtleBridgeRunID;"
		);
		expect(guardSource).toContain(
			"const isActiveRun = () => runID === activeTurtleBridgeRunID;"
		);
		expect(guardSource).toContain(
			"if (isActiveRun()) turtleBridge.forward(distance);"
		);
		expect(guardSource).toContain("if (isActiveRun()) callback();");
		expect(guardSource).toContain(
			"return isActiveRun() ? turtleBridge.stamp() : 0;"
		);
	});

	it("stops active IDE runtime surfaces when the selected project changes", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const projectSwitchStart = pageSource.indexOf(
			"watch(selectedProjectID"
		);
		const projectSwitchSource = pageSource.slice(
			projectSwitchStart,
			pageSource.indexOf("watch(", projectSwitchStart + 1)
		);
		const resetGameCanvasStart = pageSource.indexOf(
			"function resetGameCanvas"
		);
		const resetGameCanvasSource = pageSource.slice(
			resetGameCanvasStart,
			pageSource.indexOf("function stopGameLoop", resetGameCanvasStart)
		);

		expect(projectSwitchSource).toContain(
			"const hadPythonRunInFlight = isRunning.value;"
		);
		expect(projectSwitchSource).toContain("stopRequested.value = true;");
		expect(projectSwitchSource).toContain("stopActiveRuntimeSurfaces();");
		expect(projectSwitchSource).toContain(
			"releaseIdlePythonRuntimeCallbacks();"
		);
		expect(projectSwitchSource).toContain("stopRequested.value = false;");
		expect(projectSwitchSource).toContain(
			"void nextTick(resetActiveCanvas);"
		);
		expect(resetGameCanvasSource).toContain("stopGameLoop();");
	});

	it("keeps PyGame Zero image cache entries reusable across canvas resets", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const resetGameCanvasStart = pageSource.indexOf(
			"function resetGameCanvas"
		);
		const resetGameCanvasSource = pageSource.slice(
			resetGameCanvasStart,
			pageSource.indexOf("function stopGameLoop", resetGameCanvasStart)
		);
		const getGameImageEntryStart = pageSource.indexOf(
			"function getGameImageEntry"
		);
		const getGameImageEntrySource = pageSource.slice(
			getGameImageEntryStart,
			pageSource.indexOf(
				"function courseAssetSize",
				getGameImageEntryStart
			)
		);

		expect(resetGameCanvasSource).not.toContain("gameImageCache.clear()");
		expect(getGameImageEntrySource).toContain(
			"if (cached?.src === src) return cached;"
		);
		expect(getGameImageEntrySource).toContain(
			"gameImageCache.set(asset.key, entry);"
		);
		expect(getGameImageEntrySource).toContain("requestGameTick();");
	});

	it("runs plain Python projects in a terminable Pyodide worker", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const workerSource = readFileSync(
			resolve(__dirname, "../src/workers/pythonIdePlainWorker.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain('if (options.mode === "python")');
		expect(runtimeSource).toContain(
			"return runPlainPythonProjectInWorker(options);"
		);
		expect(runtimeSource).toContain(
			'new URL("../workers/pythonIdePlainWorker.ts", import.meta.url)'
		);
		expect(runtimeSource).toContain(
			"export function stopPythonIdeRuntimeRun"
		);
		expect(runtimeSource).toContain("terminatePlainPythonWorker()");
		expect(runtimeSource).toContain("function clonePlainPythonIdeFiles");
		expect(runtimeSource).toContain("files: clonePlainPythonIdeFiles");
		expect(pageSource).toContain("stopLoadedPythonRuntimeRun()");
		expect(pageSource).toContain(
			"Plain Python worker is being terminated."
		);
		expect(workerSource).toContain("pyodide.mjs");
		expect(workerSource).toContain("loadPackagesFromImports");
		expect(workerSource).toContain("setStdout");
		expect(workerSource).toContain("setStderr");
		expect(workerSource).toContain("captureProjectTextFiles");
		expect(workerSource).toContain(
			'import {\n\tisPythonIdeTextFile,\n\tisValidPythonFileName\n} from "@/modules/pythonIde";'
		);
		expect(workerSource).toContain("function decodeBase64File");
		expect(workerSource).toContain("function writeProjectFile");
		expect(workerSource).toContain("function validProjectFiles");
		expect(workerSource).toContain('file.encoding === "base64"');
		expect(workerSource).toContain(
			"const writableFiles = validProjectFiles(files);"
		);
		expect(workerSource).toContain("isValidPythonFileName(file.name)");
		expect(workerSource).toContain("__classes_text_suffixes");
		expect(workerSource).toContain("isPythonIdeTextFile(file.name)");
		expect(workerSource).toContain("function isActiveRun");
		expect(workerSource).toContain("if (!isActiveRun(id)) return;");
		expect(workerSource).toContain("if (!isActiveRun(request.id)) return;");
		expect(workerSource).toContain(
			'import { pythonIdeImportedTopLevelModules } from "@/modules/pythonImportScanner";'
		);
		expect(workerSource).toContain(
			"const loadedPlainPythonImportModules = new Set<string>();"
		);
		expect(workerSource).toContain(
			"function plainPythonPackageScanModules"
		);
		expect(workerSource).toContain(
			"const validFiles = validProjectFiles(files);"
		);
		expect(workerSource).toContain("projectModuleNames(validFiles)");
		expect(workerSource).toContain("const projectModulesToClear =");
		expect(workerSource).toContain(
			"...[...lastProjectFileNames].map(name => ({ name }))"
		);
		expect(workerSource).toContain("projectModulesToClear");
		expect(workerSource).toContain(
			"pythonIdeImportedTopLevelModules(validFiles)"
		);
		expect(workerSource).toContain(
			"!loadedPlainPythonImportModules.has(moduleName)"
		);
		expect(workerSource).toContain(
			"loadedPlainPythonImportModules.add(moduleName)"
		);
	});

	it("preserves PyGame Zero canvas aspect ratio instead of stretching", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const usesGameCanvas = computed");
		expect(pageSource).toContain("drawingCanvasStyle");
		expect(pageSource).toContain("--python-game-aspect");
		expect(pageSource).toContain("--python-game-max-width");
		expect(pageSource).toContain("canvas-shell--game");
		expect(pageSource).toContain("canvas-frame--game");
		expect(pageSource).toContain("turtle-canvas--game");
		expect(pageSource).toContain("ide-grid--drawing");
		const gameFrameStart = pageSource.indexOf(".canvas-frame--game");
		const gameCanvasStart = pageSource.indexOf(".turtle-canvas--game");
		const gameFrameSource = pageSource.slice(
			gameFrameStart,
			gameCanvasStart
		);
		const gameCanvasSource = pageSource.slice(
			gameCanvasStart,
			pageSource.indexOf(".artifact-list", gameCanvasStart)
		);

		expect(gameFrameSource).toContain(
			"width: min(100%, var(--python-game-max-width, 54rem));"
		);
		expect(gameFrameSource).toContain(
			"aspect-ratio: var(--python-game-aspect, 640 / 400);"
		);
		expect(gameCanvasSource).toContain("height: 100%;");
		expect(gameCanvasSource).not.toContain("height: auto;");
		expect(gameCanvasSource).not.toContain("aspect-ratio:");
		expect(pageSource).toContain(
			".turtle-canvas:not(.turtle-canvas--game)"
		);
	});

	it("keeps PyGame Zero actor angles anticlockwise like Pygame Zero", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const actorStart = pageSource.indexOf("function drawGameActor");
		const imageStart = pageSource.indexOf("function drawGameImage");
		const actorSource = pageSource.slice(actorStart, imageStart);
		const imageSource = pageSource.slice(
			imageStart,
			pageSource.indexOf("function drawGameLine", imageStart)
		);

		expect(actorSource).toContain(
			"context.rotate((-angle * Math.PI) / 180);"
		);
		expect(imageSource).toContain(
			"context.rotate((-angle * Math.PI) / 180);"
		);
		expect(pageSource).not.toContain(
			"context.rotate((angle * Math.PI) / 180);"
		);
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

	it("caches runtime package setup after successful Pyodide installs", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const scannerSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonImportScanner.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain(
			"const loadedBrowserShimPackages = new Set<string>();"
		);
		expect(runtimeSource).toContain(
			"const installedMicropipPackages = new Set<string>();"
		);
		expect(runtimeSource).toContain(
			"const loadedPyodideImportModules = new Set<string>();"
		);
		expect(runtimeSource).toContain("function loadPyodideImportPackages");
		expect(runtimeSource).toContain("loadedPyodideImportModules.has");
		expect(runtimeSource).toContain("loadedPyodideImportModules.add");
		expect(runtimeSource).toContain(
			'onOutput("system", `Loading Python packages: ${modules.join(", ")}`);'
		);
		expect(runtimeSource).toContain("let micropipLoaded = false;");
		expect(runtimeSource).toContain(
			"!installedMicropipPackages.has(packageName)"
		);
		expect(runtimeSource).toContain("if (!micropipLoaded)");
		expect(runtimeSource).toContain(
			"installedMicropipPackages.add(packageName)"
		);
		expect(runtimeSource).toContain(
			'loadedBrowserShimPackages.has("numpy")'
		);
		expect(runtimeSource).toContain(
			'loadedBrowserShimPackages.add("numpy")'
		);
		expect(runtimeSource).toContain('from "@/modules/pythonImportScanner"');
		expect(scannerSource).toContain(
			"export function pythonIdeImportedTopLevelModules"
		);
	});

	it("skips standard-library imports before runtime package setup", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const workerSource = readFileSync(
			resolve(__dirname, "../src/workers/pythonIdePlainWorker.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain(
			'import { pythonStandardLibraryModules } from "@/modules/pythonStandardLibraryModules";'
		);
		expect(runtimeSource).toContain("standardLibraryModules: Set<string>");
		expect(runtimeSource).toContain(
			"!standardLibraryModules.has(moduleName)"
		);
		expect(runtimeSource).toContain(
			"const standardLibraryModules = await pythonStandardLibraryModules(pyodide);"
		);
		expect(runtimeSource).toContain(
			"packageScanModules(\n\t\tfiles,\n\t\timportedModules,\n\t\tstandardLibraryModules\n\t)"
		);
		expect(runtimeSource).toContain(
			"await loadPyodideImportPackages(\n\t\tpyodide,\n\t\toptions.files,\n\t\timportedModules,\n\t\toptions.onOutput\n\t);"
		);
		expect(workerSource).toContain(
			'import { pythonStandardLibraryModules } from "@/modules/pythonStandardLibraryModules";'
		);
		expect(workerSource).toContain("standardLibraryModules: Set<string>");
		expect(workerSource).toContain(
			"!standardLibraryModules.has(moduleName)"
		);
		expect(workerSource).toContain(
			"const modules = plainPythonPackageScanModules("
		);
		expect(workerSource).toContain("files,\n\t\tstandardLibraryModules");
	});

	it("loads the standard-library module list from Pyodide once", async () => {
		const runPython = vi.fn(() =>
			JSON.stringify(["csv", "json", "math", "random"])
		);
		const pyodide = { runPython };

		await expect(pythonStandardLibraryModules(pyodide)).resolves.toEqual(
			new Set(["csv", "json", "math", "random"])
		);
		await expect(pythonStandardLibraryModules(pyodide)).resolves.toEqual(
			new Set(["csv", "json", "math", "random"])
		);

		expect(runPython).toHaveBeenCalledTimes(1);
		expect(runPython.mock.calls[0]?.[0]).toContain("stdlib_module_names");
	});

	it("extracts multiple top-level import modules for runtime package setup", () => {
		expect([
			...pythonIdeImportedTopLevelModules([
				{
					name: "main.py",
					content: [
						"import os, numpy as np, pandas.io",
						"from sklearn.model_selection import train_test_split",
						"from .local import helper",
						"import invalid-name, altair # keep the valid item after a comma",
						"import matplotlib.pyplot as plt, \\",
						"    scipy.stats as stats",
						'"""',
						"import tensorflow",
						"import torch, \\",
						"    keras",
						"from keras import Sequential",
						'"""',
						'import csv # a comment with """ should not open a string'
					].join("\n")
				},
				{
					name: "notes.txt",
					content: "import should_not_count"
				}
			])
		]).toEqual([
			"os",
			"numpy",
			"pandas",
			"sklearn",
			"altair",
			"matplotlib",
			"scipy",
			"csv"
		]);
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
		expect(runtimeSource).toContain(
			"const writableFiles = files.filter(file =>"
		);
		expect(runtimeSource).toContain("isValidPythonFileName(file.name)");
		expect(runtimeSource).toContain("safeUnlink(pyodide");
		expect(runtimeSource).toContain(
			"sys.modules.pop(__classes_module_name, None)"
		);
	});

	it("writes browser runtime shims once per bootstrap version", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const writeRuntimeShimsStart = runtimeSource.indexOf(
			"function writeRuntimeShims"
		);
		const writeRuntimeShimsSource = runtimeSource.slice(
			writeRuntimeShimsStart,
			runtimeSource.indexOf(
				"export async function runPythonProject",
				writeRuntimeShimsStart
			)
		);

		expect(runtimeSource).toContain(
			'let runtimeShimsWrittenForBootstrapVersion = "";'
		);
		expect(writeRuntimeShimsSource).toContain(
			"runtimeShimsWrittenForBootstrapVersion ==="
		);
		expect(writeRuntimeShimsSource).toContain(
			"PYTHON_IDE_RUNTIME_BOOTSTRAP_VERSION"
		);
		expect(writeRuntimeShimsSource).toContain("return;");
		expect(writeRuntimeShimsSource).toContain(
			"runtimeShimsWrittenForBootstrapVersion ="
		);
	});

	it("guards imported local project modules through the IDE compiler", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain("__classes_project_root =");
		expect(runtimeSource).toContain("__classes_reserved_import_roots");
		expect(runtimeSource).toContain(
			'if not getattr(__classes_finder, "__classes_python_ide_project_finder__", False)'
		);
		expect(runtimeSource).toContain(
			"_classes_reserved_import_roots = __classes_reserved_import_roots"
		);
		expect(runtimeSource).toContain(
			"_ClassesProjectImportFinder__classes_reserved_import_roots = _classes_reserved_import_roots"
		);
		expect(runtimeSource).toContain(
			"root_name in _classes_reserved_import_roots"
		);
		expect(runtimeSource).toContain(
			"__classes_python_ide_project_finder__ = True"
		);
		expect(runtimeSource).toContain(
			"sys.meta_path.insert(0, __ClassesProjectImportFinder())"
		);
		expect(runtimeSource).toContain(
			"return _classes_compile_student_source(source, path)"
		);
		expect(runtimeSource).toContain(
			"builtins.__classes_loop_guard = __classes_loop_guard"
		);
		expect(runtimeSource).toContain(
			"builtins.__classes_schedule_turtle_loop = __classes_schedule_turtle_loop"
		);
	});

	it("avoids double-underscore global reads inside generated Python classes", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const loopClassStart = runtimeSource.indexOf(
			"class __ClassesLoopGuardTransformer"
		);
		const loopClassEnd = runtimeSource.indexOf(
			"def __classes_compile_student_source",
			loopClassStart
		);
		const sourceLoaderStart = runtimeSource.indexOf(
			"class __ClassesProjectSourceLoader"
		);
		const sourceLoaderEnd = runtimeSource.indexOf(
			"_ClassesProjectSourceLoader = __ClassesProjectSourceLoader",
			sourceLoaderStart
		);
		const importFinderStart = runtimeSource.indexOf(
			"class __ClassesProjectImportFinder"
		);
		const importFinderEnd = runtimeSource.indexOf(
			"def __classes_install_project_import_hook",
			importFinderStart
		);
		const loopClassSource = runtimeSource.slice(
			loopClassStart,
			loopClassEnd
		);
		const sourceLoaderSource = runtimeSource.slice(
			sourceLoaderStart,
			sourceLoaderEnd
		);
		const importFinderSource = runtimeSource.slice(
			importFinderStart,
			importFinderEnd
		);

		expect(loopClassSource).toContain(
			"_classes_turtle_animation_call_names"
		);
		expect(runtimeSource).toContain(
			"_ClassesLoopGuardTransformer__classes_turtle_animation_call_names = _classes_turtle_animation_call_names"
		);
		expect(loopClassSource).not.toContain(
			"__classes_turtle_animation_call_names"
		);
		expect(sourceLoaderSource).toContain(
			"_classes_compile_student_source(source, path)"
		);
		expect(sourceLoaderSource).not.toContain(
			"__classes_compile_student_source(source, path)"
		);
		expect(importFinderSource).toContain("_classes_reserved_import_roots");
		expect(importFinderSource).toContain("_classes_project_root");
		expect(importFinderSource).toContain("_classes_is_project_path");
		expect(importFinderSource).toContain("_ClassesProjectSourceLoader");
		expect(importFinderSource).not.toContain(
			"__classes_reserved_import_roots"
		);
		expect(importFinderSource).not.toContain("__classes_project_root /");
		expect(importFinderSource).not.toContain("__classes_is_project_path");
		expect(importFinderSource).not.toContain(
			"__ClassesProjectSourceLoader("
		);
	});

	it("clears browser-owned runtime shim modules before each run", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain("const PYTHON_IDE_RUNTIME_MODULES");
		expect(runtimeSource).toContain("function clearRuntimeShimModules");
		expect(runtimeSource).toContain("clearRuntimeShimModules(pyodide)");
		expect(runtimeSource).toContain('"_classes_pgzero"');
		expect(runtimeSource).toContain('"turtle"');
		expect(runtimeSource).toContain(
			"sys.modules.pop(__classes_runtime_name, None)"
		);
		expect(runtimeSource).toContain('"Actor"');
		expect(runtimeSource).toContain('"show_chart"');
		expect(runtimeSource).toContain('"__classes_loop_guard"');
		expect(runtimeSource).toContain(
			'__classes_builtin_name.startswith("__classes_")'
		);
		expect(runtimeSource).toContain(
			"delattr(builtins, __classes_builtin_name)"
		);
	});

	it("keeps imported Turtle loop bodies in the importing module namespace", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain(
			"def __classes_schedule_turtle_loop(body_source, filename, line_number, namespace=None):"
		);
		expect(runtimeSource).toContain("if namespace is None:");
		expect(runtimeSource).toContain("namespace = globals()");
		expect(runtimeSource).toContain("exec(body_code, namespace)");
		expect(runtimeSource).toContain(
			'__classes_turtle_bridge = getattr(__classes_window, "__classesPythonIdeTurtle", None)'
		);
		expect(runtimeSource).toContain(
			"__classes_turtle_bridge.scheduleTimer("
		);
		expect(runtimeSource).not.toContain(
			"__classes_window.__classesPythonIdeTurtle.scheduleTimer("
		);
		expect(runtimeSource).toContain(
			'func=ast.Name(id="globals", ctx=ast.Load())'
		);
		expect(runtimeSource).toContain("ast.Call(");
	});

	it("keeps generated text-file persistence wired between runtime and page", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain(
			"async function captureProjectTextFiles"
		);
		expect(runtimeSource).toContain("__classes_reserved_files");
		expect(runtimeSource).toContain("isValidPythonFileName(file.name)");
		expect(runtimeSource).toContain("options.onProjectFilesUpdate?.");
		expect(pageSource).toContain("function mergeRuntimeProjectFiles");
		expect(pageSource).toContain("onProjectFilesUpdate: files =>");
		expect(pageSource).toContain(
			"void saveSelectedProject({ force: true });"
		);
	});

	it("uses the current selected project after forced save before running", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const runStart = pageSource.indexOf("async function runCurrentProject");
		const runSource = pageSource.slice(
			runStart,
			pageSource.indexOf("function stopCurrentProject", runStart)
		);

		const saveIndex = runSource.indexOf(
			"await saveSelectedProject({ force: true });"
		);
		const projectIndex = runSource.indexOf("const project = selectedProject.value;");
		const runnableIndex = runSource.indexOf(
			"const runnableFile = getPythonIdeRunnableFile(project);"
		);

		expect(saveIndex).toBeGreaterThan(0);
		expect(projectIndex).toBeGreaterThan(saveIndex);
		expect(runnableIndex).toBeGreaterThan(projectIndex);
		expect(runSource).toContain(
			"onProjectFilesUpdate: files =>\n\t\t\t\tmergeRuntimeProjectFiles(project, files)"
		);
	});

	it("clears stale local account fallback after successful remote syncs", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			"await clearLocalPythonProjectsAsync(storageUserID.value);"
		);
		expect(pageSource).toContain("async function syncProjectsToAccount");
		expect(pageSource).toContain(
			'saveMessage.value = "Synced recovered local edits";'
		);
		expect(pageSource).toContain(
			'saveMessage.value = "Recovered local edits";'
		);
		expect(pageSource).toContain("Saved locally after sync issue");
		expect(pageSource).toContain("const isRemoteProject =");
	});

	it("autosaves Python IDE projects by default with a settings toggle", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			'const pythonIdeAutoSaveStorageKey = "classes-python-ide-autosave";'
		);
		expect(pageSource).toContain(
			"const autoSaveEnabled = ref(loadPythonIdeAutoSavePreference());"
		);
		expect(pageSource).toContain("function updateAutoSavePreference");
		expect(pageSource).toContain("Autosave projects");
		expect(pageSource).toContain('aria-label="Python IDE settings"');
		expect(pageSource).toContain(
			"const pendingSaveProjectIDs = new Set<string>();"
		);
		expect(pageSource).toContain(
			"const unsyncedProjectIDs = new Set<string>();"
		);
		expect(pageSource).toContain("interface SaveProjectOptions");
		expect(pageSource).toContain("async function savePendingProjects");
		expect(pageSource).toContain("pendingSaveProjectIDs.add(projectID);");
		expect(pageSource).toContain("unsyncedProjectIDs.add(startedProjectID);");
		expect(pageSource).toContain("void savePendingProjects();");
		expect(pageSource).toContain("saveSelectedProject({ force: true })");
		expect(pageSource).toContain("let localSnapshotTimer:");
		expect(pageSource).toContain("async function persistLocalProjectSnapshot");
		expect(pageSource).toContain("async function discardLocalProjectSnapshot");
		expect(pageSource).toContain(
			"async function discardLocalProjectSnapshotIfSafe"
		);
		expect(pageSource).toContain("await localSnapshotInFlight;");
		expect(pageSource).toContain("unsyncedProjectIDs.clear();");
		expect(pageSource).toContain("function scheduleLocalProjectSnapshot");
		expect(pageSource).toContain("scheduleLocalProjectSnapshot();");
		expect(pageSource).toContain("await discardLocalProjectSnapshot();");
		expect(pageSource).toContain("if (!autoSaveEnabled.value)");
		expect(pageSource).toContain(
			"await persistLocalProjects({ quiet: true });"
		);
		expect(pageSource).toContain(
			'message: "Saved locally after sync issue"'
		);
		expect(pageSource).toContain(
			'window.addEventListener("pagehide", flushPendingProjectSave);'
		);
		expect(pageSource).toContain(
			'document.addEventListener(\n\t\t"visibilitychange",'
		);
		expect(pageSource).toContain(
			"function flushPendingProjectSaveOnVisibilityChange"
		);
		expect(pageSource).toContain("flushPendingProjectSave();");
		expect(pageSource).toContain("saveLocalProjectSnapshot();");
	});

	it("persists CodeMirror view state across reloads and project ID migration", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			'const pythonIdeEditorViewStateStoragePrefix ='
		);
		expect(pageSource).toContain(
			"const codeEditorStateSnapshots = new Map<string, CodeEditorState>();"
		);
		expect(pageSource).toContain(
			"function loadPersistedCodeEditorViewStates"
		);
		expect(pageSource).toContain("function persistCodeEditorViewStates");
		expect(pageSource).toContain("function isCodeEditorViewState");
		expect(pageSource).toContain("function restoreCodeEditorScroll");
		expect(pageSource).toContain("function deleteCodeEditorStateForFile");
		expect(pageSource).toContain("function deleteCodeEditorStateForProject");
		expect(pageSource).toContain(
			'CodeEditorViewState["ranges"][number]'
		);
		expect(pageSource).toContain(
			"savedState?.doc.toString() === activeFileContent.value"
		);
		expect(pageSource).toContain("state: restoredState");
		expect(pageSource).toContain(
			"loadPersistedCodeEditorViewStates(storageUserID.value);"
		);
		expect(pageSource).toContain(
			"persistCodeEditorViewStates(storageUserID.value);"
		);
		expect(pageSource).toContain(
			"migrateCodeEditorViewStates(startedProjectID, savedProject._id);"
		);
	});

	it("ignores stale async project loads before mutating the workspace", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("let projectLoadRunID = 0;");
		expect(pageSource).toContain("function projectLoadIsCurrent");
		expect(pageSource).toContain("const loadRunID = ++projectLoadRunID;");
		expect(pageSource).toContain(
			"if (!projectLoadIsCurrent(loadRunID)) return;"
		);
		expect(pageSource).toContain(
			"await openRequestedCourseProjectIfNeeded(false, loadRunID);"
		);
		expect(pageSource).toContain(
			"await openRequestedCourseProjectIfNeeded(true, loadRunID);"
		);
		expect(pageSource).toContain(
			"await saveNewProject(requestedProject, localOnly, loadRunID);"
		);
	});

	it("suppresses CodeMirror-originated echo updates through the Vue flush", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const onChangeStart = pageSource.indexOf("onChange(content) {");
		const onChangeSource = pageSource.slice(
			onChangeStart,
			pageSource.indexOf("onCursorCountChange", onChangeStart)
		);

		expect(onChangeSource).toContain("syncingCodeMirrorContent = true;");
		expect(onChangeSource).toContain("activeFileContent.value = content;");
		expect(onChangeSource).toContain("void nextTick(() => {");
		expect(onChangeSource).toContain("syncingCodeMirrorContent = false;");
		expect(pageSource).toContain("watch(activeFileContent, content => {");
		expect(pageSource).toContain("syncCodeEditorContent(content);");
	});

	it("normalizes loaded project active files before rendering or saving", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const setProjectsStart = pageSource.indexOf("function setProjects");
		const setProjectsSource = pageSource.slice(
			setProjectsStart,
			pageSource.indexOf(
				"async function persistLocalProjects",
				setProjectsStart
			)
		);

		expect(setProjectsSource).toContain(
			"projects.value = nextProjects.map"
		);
		expect(setProjectsSource).toContain(
			"activeFileName: resolvePythonIdeActiveFileName("
		);
		expect(setProjectsSource).toContain(
			"project.files,\n\t\t\tproject.activeFileName"
		);
		expect(setProjectsSource).toContain("projectForRoute(projects.value)");
		expect(pageSource).toContain(
			"const activeFileName = resolvePythonIdeActiveFileName("
		);
	});

	it("serializes saves and protects newer edits from stale remote responses", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("let saveInFlight: Promise<void> | null");
		expect(pageSource).toContain("let saveQueued = false");
		expect(pageSource).toContain("async function saveProjectOnce");
		expect(pageSource).toContain("async function savePendingProjects");
		expect(pageSource).toContain("const pendingSaveProjectIDs");
		expect(pageSource).toContain("const startedUpdatedAt");
		expect(pageSource).toContain(
			"? await createRemotePythonIdeProject(payload)"
		);
		expect(pageSource).toContain("const projectChangedDuringSave");
		expect(pageSource).toContain("saveQueued = true");
		expect(pageSource).toContain(
			"} while (saveQueued || pendingSaveProjectIDs.size);"
		);
		expect(pageSource).toContain(
			"migrateCodeEditorViewStates(startedProjectID, savedProject._id);"
		);
		expect(pageSource).toContain("currentProject._id = savedProject._id");
		expect(pageSource).toContain(
			"pendingSaveProjectIDs.add(currentProject._id);"
		);
	});

	it("keeps canvas keyboard handlers separate from editor and input focus", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("function canvasOwnsKeyboardEvent");
		expect(pageSource).toContain("document.activeElement === canvas");
		expect(pageSource).toContain(
			"if (!canvasOwnsKeyboardEvent(event)) return;"
		);
		expect(
			pageSource.indexOf("if (!canvasOwnsKeyboardEvent(event)) return;")
		).toBeLessThan(
			pageSource.indexOf('["down", "left", "right", "space", "up"]')
		);
		expect(pageSource).toContain("function pythonGameKeyFromEvent");
		expect(pageSource).toContain("function gameKeyModifierMask");
		expect(pageSource).toContain("mod: gameKeyModifierMask(event)");
		expect(pageSource).toContain("unicode: gameKeyUnicode(event)");
		expect(pageSource).toContain('@blur="clearCanvasKeyboardState"');
		expect(pageSource).toContain("canvasRef.value?.focus();");
		expect(pageSource).toContain("--python-focus-ring");
		expect(pageSource).toContain(".code-editor-shell:focus-within");
		expect(pageSource).toContain(".canvas-shell:focus-within");
		expect(pageSource).toContain(".stdin-panel:focus-within");
	});

	it("routes PyGame Zero mouse wheel input through documented mouse constants", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain('@wheel="dispatchCanvasWheelEvent"');
		expect(pageSource).toContain("function dispatchCanvasWheelEvent");
		expect(pageSource).toContain(
			'if (selectedProject.value?.mode !== "pgzero") return;'
		);
		expect(pageSource).toContain(
			'button: event.deltaY < 0 ? "wheel_up" : "wheel_down"'
		);
		expect(pageSource).toContain('type: "mousedown"');
		expect(pageSource).toContain("event.preventDefault();");
		expect(runtimeSource).toContain('WHEEL_UP = "wheel_up"');
		expect(runtimeSource).toContain('WHEEL_DOWN = "wheel_down"');
		expect(runtimeSource).toContain(
			`_call_optional_named(
                "on_mouse_down"`
		);
	});

	it("tracks overlapping PyGame Zero sound instances for cleanup", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			"const gameSoundAudio = new Map<string, Set<HTMLAudioElement>>();"
		);
		expect(pageSource).toContain("function trackGameSoundAudio");
		expect(pageSource).toContain("existing.add(audio);");
		expect(pageSource).toContain('audio.addEventListener("ended", cleanup');
		expect(pageSource).toContain('audio.addEventListener("error", cleanup');
		expect(pageSource).toContain("for (const audio of activeSounds)");
		expect(pageSource).toContain(
			"for (const soundName of [...gameSoundAudio.keys()])"
		);
	});

	it("cleans up PyGame Zero tone timers and suspends idle audio context", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);
		const stopAllGameAudioStart = pageSource.indexOf(
			"function stopAllGameAudio"
		);
		const stopAllGameAudioSource = pageSource.slice(
			stopAllGameAudioStart,
			pageSource.indexOf("async function ensureGameCourseAssetsLoaded")
		);
		const playGameToneStart = pageSource.indexOf("function playGameTone");
		const playGameToneSource = pageSource.slice(
			playGameToneStart,
			pageSource.indexOf("function startGameLoop", playGameToneStart)
		);

		expect(pageSource).toContain("function suspendGameAudioContext");
		expect(pageSource).toContain(
			'console.warn("Could not suspend PyGame Zero audio context.", error);'
		);
		expect(stopAllGameAudioSource).toContain("stopAllGameTones();");
		expect(stopAllGameAudioSource).toContain("suspendGameAudioContext();");
		expect(playGameToneSource).toContain(
			"let timeout: ReturnType<typeof window.setTimeout> | null = null;"
		);
		expect(playGameToneSource).toContain("window.clearTimeout(timeout);");
		expect(playGameToneSource).toContain("timeout = null;");
		expect(playGameToneSource).toContain("timeout = window.setTimeout(");
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
		expect(isValidPythonFileName("package/submodule/tools.py")).toBe(true);
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
		expect(isPythonIdeRuntimeReservedPath("turtle.py")).toBe(true);
		expect(isPythonIdeRuntimeReservedPath("keras/layers.py")).toBe(true);
		expect(isValidPythonFileName("turtle.py")).toBe(false);
		expect(isValidPythonFileName("pgzrun.py")).toBe(false);
		expect(isValidPythonFileName("pygame.py")).toBe(false);
		expect(isValidPythonFileName("streamlit.py")).toBe(false);
		expect(isValidPythonFileName("keras.py")).toBe(false);
		expect(isValidPythonFileName("tensorflow.py")).toBe(false);
		expect(isValidPythonFileName("keras/layers.py")).toBe(false);
		expect(isValidPythonFileName("pgzero/builtins.py")).toBe(false);
		expect(isValidPythonFileName("tensorflow/keras/__init__.py")).toBe(
			false
		);
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

		const pack = await parsePythonIdeCourseAssetZip(
			zipBytes,
			"/assets.zip"
		);
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

	it("reuses and revokes generated PyGame Zero asset object URLs", async () => {
		const createdUrls: string[] = [];
		const revokedUrls: string[] = [];
		const createObjectUrlSpy = vi
			.spyOn(URL, "createObjectURL")
			.mockImplementation(() => {
				const url = `blob:test-${createdUrls.length}`;
				createdUrls.push(url);
				return url;
			});
		const revokeObjectUrlSpy = vi
			.spyOn(URL, "revokeObjectURL")
			.mockImplementation(url => {
				revokedUrls.push(url);
			});

		try {
			const pack = await parsePythonIdeCourseAssetZip(
				zipSync({ "images/alien.png": oneByOnePngBytes }),
				"/assets.zip"
			);
			const alien = findPythonIdeCourseAsset(
				pack,
				pythonIdeAssetCandidateNames("images", "alien", [".png"])
			);

			expect(alien).toBeTruthy();
			if (!alien) return;
			expect(getPythonIdeCourseAssetObjectUrl(alien)).toBe("blob:test-0");
			expect(getPythonIdeCourseAssetObjectUrl(alien)).toBe("blob:test-0");
			expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);

			resetPythonIdeCourseAssetPackCache();
			expect(revokeObjectUrlSpy).toHaveBeenCalledWith("blob:test-0");
			expect(revokedUrls).toEqual(["blob:test-0"]);
		} finally {
			createObjectUrlSpy.mockRestore();
			revokeObjectUrlSpy.mockRestore();
		}
	});

	it("loads deployed PyGame Zero assets from the extracted asset manifest", () => {
		const pack = parsePythonIdeCourseAssetManifest({
			assets: [
				{
					height: 18,
					mimeType: "image/png",
					name: "images/alien.png",
					url: "/python-ide/assets/images/alien.png",
					width: 20
				},
				{
					mimeType: "audio/wav",
					name: "sounds/eep.wav",
					url: "/python-ide/assets/sounds/eep.wav"
				},
				{
					mimeType: "audio/mpeg",
					name: "music/tune.mp3",
					url: "/python-ide/assets/music/tune.mp3"
				}
			]
		});
		const alien = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("images", "alien", [".png"])
		);

		expect(pack.assets.size).toBe(3);
		expect(alien?.url).toBe("/python-ide/assets/images/alien.png");
		expect(alien?.width).toBe(20);
		expect(alien?.height).toBe(18);
	});

	it("keeps zip parsing out of the normal course asset loader chunk", () => {
		const assetSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeCourseAssets.ts"),
			"utf8"
		);
		const zipSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeCourseAssetZip.ts"),
			"utf8"
		);

		expect(assetSource).not.toContain('from "fflate"');
		expect(assetSource).toMatch(
			/import\(\s*"@\/modules\/pythonIdeCourseAssetZip"\s*\)/
		);
		expect(zipSource).toContain('from "fflate"');
		expect(zipSource).toContain("parsePythonIdeCourseAssetZipBytes");
	});

	it("prefers the extracted asset manifest before falling back to the same-origin API proxy", async () => {
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				expect(url).toBe(pythonIdeCourseAssetsManifestUrl);

				return {
					arrayBuffer: async () => new ArrayBuffer(0),
					json: async () => ({
						assets: [
							{
								height: 18,
								mimeType: "image/png",
								name: "images/alien.png",
								url: "/python-ide/assets/images/alien.png",
								width: 20
							}
						]
					}),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([pythonIdeCourseAssetsManifestUrl]);
		expect(pack.assets.get("images/alien.png")?.url).toBe(
			"/python-ide/assets/images/alien.png"
		);
	});

	it("falls back to the same-origin zip proxy when the extracted manifest is missing", async () => {
		const zipBytes = zipSync({
			"images/alien.png": oneByOnePngBytes
		});
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				if (url === pythonIdeCourseAssetsManifestUrl) {
					return {
						arrayBuffer: async () => new ArrayBuffer(0),
						ok: false,
						status: 404
					};
				}

				expect(url).toBe(pythonIdeCourseAssetsZipUrl);
				return {
					arrayBuffer: async () => zipBytes.buffer.slice(0),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([
			pythonIdeCourseAssetsManifestUrl,
			pythonIdeCourseAssetsZipUrl
		]);
		expect(pack.assets.has("images/alien.png")).toBe(true);
	});

	it("falls back to the same-origin zip proxy when the asset manifest has no usable assets", async () => {
		const zipBytes = zipSync({
			"images/alien.png": oneByOnePngBytes
		});
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				if (url === pythonIdeCourseAssetsManifestUrl) {
					return {
						arrayBuffer: async () => new ArrayBuffer(0),
						json: async () => ({
							assets: [
								{
									mimeType: "text/plain",
									name: "README.txt",
									url: "/python-ide/assets/README.txt"
								}
							]
						}),
						ok: true,
						status: 200
					};
				}

				expect(url).toBe(pythonIdeCourseAssetsZipUrl);
				return {
					arrayBuffer: async () => zipBytes.buffer.slice(0),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([
			pythonIdeCourseAssetsManifestUrl,
			pythonIdeCourseAssetsZipUrl
		]);
		expect(pack.assets.has("images/alien.png")).toBe(true);
	});

	it("falls back to the same-origin zip proxy when the asset manifest fetch fails", async () => {
		const zipBytes = zipSync({
			"images/alien.png": oneByOnePngBytes
		});
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				if (url === pythonIdeCourseAssetsManifestUrl) {
					throw new TypeError("manifest network failure");
				}

				expect(url).toBe(pythonIdeCourseAssetsZipUrl);
				return {
					arrayBuffer: async () => zipBytes.buffer.slice(0),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([
			pythonIdeCourseAssetsManifestUrl,
			pythonIdeCourseAssetsZipUrl
		]);
		expect(pack.assets.has("images/alien.png")).toBe(true);
	});

	it("keeps shared PyGame Zero asset support wired into the page and runtime", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("def _asset_size(image");
		expect(runtimeSource).toContain("def _image_name(image):");
		expect(runtimeSource).toContain(
			'return str(getattr(image, "name", image))'
		);
		expect(runtimeSource).toContain("builtins.images = images");
		expect(runtimeSource).toContain("builtins.keymods = keymods");
		expect(runtimeSource).toContain("builtins.Animation = Animation");
		expect(runtimeSource).toContain("builtins.animate = animate");
		expect(runtimeSource).toContain("builtins.tone = tone");
		expect(runtimeSource).toContain("def blit(self, image, pos");
		expect(runtimeSource).toContain(
			"_bridge.drawImage(\n            _image_name(image),"
		);
		expect(runtimeSource).toContain(
			"fill: (color: string, gcolor?: string) => void;"
		);
		expect(runtimeSource).toContain("def fill(self, color, gcolor=None):");
		expect(runtimeSource).toContain(
			"_normalize_color(gcolor) if gcolor is not None else None"
		);
		expect(runtimeSource).toContain("def bounds(self):");
		expect(runtimeSource).toContain(
			"def rect(self, rect, color, width=1):"
		);
		expect(runtimeSource).toContain(
			"rect_width, rect_height = _rect_parts(rect)"
		);
		expect(runtimeSource).toContain(
			"def line(self, start, end, color, width=1):"
		);
		expect(runtimeSource).toContain(
			"def circle(self, pos, radius, color, width=1):"
		);
		expect(runtimeSource).toContain(
			"def filled_circle(self, pos, radius, color):"
		);
		expect(runtimeSource).toContain("def __bool__(self):");
		expect(runtimeSource).toContain(
			"return self.width != 0 and self.height != 0"
		);
		expect(runtimeSource).toContain("def textbox(self, text, rect");
		expect(runtimeSource).toContain("_bridge.drawLine(");
		expect(runtimeSource).toContain("_bridge.drawCircle(");
		expect(runtimeSource).toContain("float(_number(width, 1))");
		expect(runtimeSource).toContain("def schedule(self, function, delay):");
		expect(runtimeSource).toContain(
			"def schedule_unique(self, function, delay):"
		);
		expect(runtimeSource).toContain("def _same_callback(left, right):");
		expect(runtimeSource).toContain("if left is right:");
		expect(runtimeSource).toContain("return left == right");
		expect(runtimeSource).toContain(
			'if not _same_callback(entry["function"], function)'
		);
		expect(pageSource).toContain("backgroundGradient: string | null;");
		expect(pageSource).toContain("function gameCanvasFillStyle");
		expect(pageSource).toContain(
			"context.createLinearGradient(0, 0, 0, gameState.height)"
		);
		expect(pageSource).toContain("gradient.addColorStop(1, gcolor);");
		expect(pageSource).toContain(
			"gameState.backgroundGradient = gcolor ?? null;"
		);
		expect(runtimeSource).toContain("def distance_to(self, target):");
		expect(runtimeSource).toContain("def angle_to(self, target):");
		expect(runtimeSource).toContain("self._image = _image_name(image)");
		expect(runtimeSource).toContain("self._image = _image_name(value)");
		expect(runtimeSource).toContain(
			'self.anchor = kwargs.pop("anchor", self._anchor)'
		);
		expect(runtimeSource).toContain("def _apply_rect(self, rect):");
		expect(runtimeSource).toContain("self.width = rect.width");
		expect(runtimeSource).toContain("self.left = rect.left");
		expect(runtimeSource).toContain(
			"def _anchor_component(self, value, axis):"
		);
		expect(runtimeSource).toContain("def _anchor_x(self):");
		expect(runtimeSource).toContain("def _anchor_y(self):");
		expect(runtimeSource).toContain("def anchor(self):");
		expect(runtimeSource).toContain("return self.x - self._anchor_x()");
		expect(runtimeSource).toContain("float(self._anchor_x()),");
		expect(runtimeSource).toContain("def topleft(self):");
		expect(runtimeSource).toContain("def midbottom(self):");
		expect(runtimeSource).toContain("def move_ip(self, x, y=None):");
		expect(runtimeSource).toContain(
			"return self._apply_rect(self.move(x, y))"
		);
		expect(runtimeSource).toContain("def inflate_ip(self, width, height):");
		expect(runtimeSource).toContain("def scale_by_ip(self, *args):");
		expect(runtimeSource).toContain("def clamp_ip(self, other):");
		expect(runtimeSource).toContain("def unionall_ip(self, rects):");
		expect(runtimeSource).toContain("def normalize(self):");
		expect(runtimeSource).toContain("rect.normalize()");
		expect(runtimeSource).toContain("def __iter__(self):");
		expect(runtimeSource).toContain("return iter(self._rect())");
		expect(runtimeSource).toContain("def move_ip(self, x, y=None):");
		expect(runtimeSource).toContain("def _rect_parts_from_args(args):");
		expect(runtimeSource).toContain('if hasattr(value, "rect"):');
		expect(runtimeSource).toContain("if callable(rect_value):");
		expect(runtimeSource).toContain("rect_value = rect_value()");
		expect(runtimeSource).toContain("return _rect_parts(rect_value)");
		expect(runtimeSource).toContain("def _line_points_from_args(args):");
		expect(runtimeSource).toContain("def _clipline_point(x, y):");
		expect(runtimeSource).toContain(
			"self.x, self.y, self.width, self.height = _rect_parts_from_args(args)"
		);
		expect(runtimeSource).toContain("def __iter__(self):");
		expect(runtimeSource).toContain(
			"return iter((self.x, self.y, self.width, self.height))"
		);
		expect(runtimeSource).toContain("def __getitem__(self, index):");
		expect(runtimeSource).toContain("def _new(self, x, y, width, height):");
		expect(runtimeSource).toContain(
			"rect = self.__class__.__new__(self.__class__)"
		);
		expect(runtimeSource).toContain(
			"Rect.__init__(rect, x, y, width, height)"
		);
		expect(runtimeSource).toContain(
			"return self._new(self.x, self.y, self.width, self.height)"
		);
		expect(runtimeSource).toContain("def scale_by(self, *args):");
		expect(runtimeSource).toContain("def scale_by_ip(self, *args):");
		expect(runtimeSource).toContain("def update(self, *args):");
		expect(runtimeSource).toContain("def clamp(self, other):");
		expect(runtimeSource).toContain("def clamp_ip(self, other):");
		expect(runtimeSource).toContain("self.centerx = outer.centerx");
		expect(runtimeSource).toContain("def clip(self, other):");
		expect(runtimeSource).toContain("return self._new(left, top, 0, 0)");
		expect(runtimeSource).toContain(
			"return self._new(left, top, right - left, bottom - top)"
		);
		expect(runtimeSource).toContain("def clipline(self, *args):");
		expect(runtimeSource).toContain(
			"x1, y1, x2, y2 = _line_points_from_args(args)"
		);
		expect(runtimeSource).toContain(
			"_clipline_point(x1 + start * delta_x, y1 + start * delta_y)"
		);
		expect(runtimeSource).toContain("def union(self, other):");
		expect(runtimeSource).toContain("def union_ip(self, other):");
		expect(runtimeSource).toContain("def unionall(self, rects):");
		expect(runtimeSource).toContain("def unionall_ip(self, rects):");
		expect(runtimeSource).toContain("def fit(self, other):");
		expect(runtimeSource).toContain(
			"return self._new(outer.x, outer.y, 0, 0)"
		);
		expect(runtimeSource).toContain(
			"scale = min(outer.width / self.width, outer.height / self.height)"
		);
		expect(runtimeSource).toContain(
			"fitted = self._new(0, 0, self.width * scale, self.height * scale)"
		);
		expect(runtimeSource).toContain("def normalize(self):");
		expect(runtimeSource).toContain("self.width = -self.width");
		expect(runtimeSource).toContain("def _point_from_args(args):");
		expect(runtimeSource).toContain("def collidepoint(self, *args):");
		expect(runtimeSource).toContain(
			"return self.left <= x < self.right and self.top <= y < self.bottom"
		);
		expect(runtimeSource).toContain("self.right <= other_rect.left");
		expect(runtimeSource).toContain("self.left >= other_rect.right");
		expect(runtimeSource).toContain("self.bottom <= other_rect.top");
		expect(runtimeSource).toContain("self.top >= other_rect.bottom");
		expect(runtimeSource).toContain(
			"if other_rect.width <= 0 or other_rect.height <= 0:"
		);
		expect(runtimeSource).toContain("def collidelist(self, rects):");
		expect(runtimeSource).toContain("for index, rect in enumerate(rects):");
		expect(runtimeSource).toContain("return -1");
		expect(runtimeSource).toContain("def collidelistall(self, rects):");
		expect(runtimeSource).toContain(
			"def collidedict(self, rect_dict, use_values=0):"
		);
		expect(runtimeSource).toContain("rect = value if use_values else key");
		expect(runtimeSource).toContain("return (key, value)");
		expect(runtimeSource).toContain(
			"def collidedictall(self, rect_dict, use_values=0):"
		);
		expect(runtimeSource).toContain(
			"def collideobjects(self, objects, key=None):"
		);
		expect(runtimeSource).toContain(
			"rect = key(obj) if key is not None else obj"
		);
		expect(runtimeSource).toContain(
			"def collideobjectsall(self, objects, key=None):"
		);
		expect(runtimeSource).toContain(
			"return self._rect().collidepoint(*args)"
		);
		expect(runtimeSource).toContain(
			"return self._rect().collidelist(rects)"
		);
		expect(runtimeSource).toContain(
			"return self._rect().collidedict(rect_dict, use_values)"
		);
		expect(runtimeSource).toContain(
			"return self._rect().collideobjects(objects, key)"
		);
		expect(runtimeSource).toContain("return self._rect().clipline(*args)");
		expect(runtimeSource).toContain("def get_length(self):");
		expect(runtimeSource).toContain("def play_once(self, name):");
		expect(runtimeSource).toContain("def queue(self, name):");
		expect(runtimeSource).toContain("def is_playing(self):");
		expect(runtimeSource).toContain("def fadeout(self, duration):");
		expect(runtimeSource).toContain("def get_volume(self):");
		expect(runtimeSource).toContain("def pause(self):");
		expect(runtimeSource).toContain("def unpause(self):");
		expect(runtimeSource).toContain("def set_volume(self, volume):");
		expect(runtimeSource).toContain("def get_width(self):");
		expect(runtimeSource).toContain("def get_rect(self):");
		expect(runtimeSource).toContain('BACKSPACE = "backspace"');
		expect(runtimeSource).toContain('K_1 = "1"');
		expect(runtimeSource).toContain('LSHIFT = "lshift"');
		expect(runtimeSource).toContain('KP_ENTER = "kp_enter"');
		expect(runtimeSource).toContain("def _call_named_callback");
		expect(runtimeSource).toContain("def animate(obj");
		expect(runtimeSource).toContain("class Animation:");
		expect(runtimeSource).toContain("def _run_animations(now):");
		expect(runtimeSource).toContain("def _tone_frequency(pitch):");
		expect(runtimeSource).toContain("class _ToneSound:");
		expect(runtimeSource).toContain("def create(self, pitch, duration):");
		expect(runtimeSource).toContain("def play(self, pitch, duration):");
		expect(runtimeSource).toContain("def _handle_music_end(self):");
		expect(runtimeSource).toContain('elif event_type == "musicended":');
		expect(runtimeSource).toContain(
			"playSound: (name: string, loops?: number) => void"
		);
		expect(runtimeSource).toContain(
			"_bridge.playSound(self.name, int(_number(loops, 0)))"
		);
		expect(runtimeSource).toContain(
			`_call_optional_named(
                "on_mouse_down"`
		);
		expect(runtimeSource).toContain('_call_optional("update", dt)');
		expect(runtimeSource).toContain("_run_animations(now)");
		expect(pageSource).toContain("await ensureGameCourseAssetsLoaded()");
		expect(pageSource).not.toContain(
			"void ensureGameCourseAssetsLoaded({ announce: false })"
		);
		expect(pageSource).toContain(
			"async function loadPythonCodeMirrorAssetCompletions"
		);
		expect(pageSource).toContain(
			"assetCompletions: loadPythonCodeMirrorAssetCompletions"
		);
		expect(pageSource).toContain("pythonAssetCompletionName");
		expect(pageSource).toContain("drawImage: drawGameImage");
		expect(pageSource).toContain("anchorX = width / 2");
		expect(pageSource).toContain("const left = -anchorX");
		expect(pageSource).toContain("drawLine: drawGameLine");
		expect(pageSource).toContain("drawCircle: drawGameCircle");
		expect(pageSource).toContain(
			"function playGameSound(name: string, loops = 0)"
		);
		expect(pageSource).toContain("const repeatCount = Math.max(");
		expect(pageSource).toContain(
			"Math.trunc(Number.isFinite(loops) ? loops : 0)"
		);
		expect(pageSource).toContain("repeatCount < 0");
		expect(pageSource).toContain("let remainingLoops = repeatCount;");
		expect(pageSource).toContain("remainingLoops -= 1;");
		expect(pageSource).toContain("playSound(name: string, loops?: number)");
		expect(pageSource).toContain("gameBridge.playSound(name, loops)");
		expect(pageSource).toContain("lineWidth = 1");
		expect(pageSource).toContain(
			"context.lineWidth = Math.max(1, lineWidth)"
		);
		expect(pageSource).toContain("pauseMusic: pauseGameMusic");
		expect(pageSource).toContain("unpauseMusic: unpauseGameMusic");
		expect(pageSource).toContain("setMusicVolume: setGameMusicVolume");
		expect(pageSource).toContain("playTone: playGameTone");
		expect(pageSource).toContain("stopTone: stopGameTone");
		expect(pageSource).toContain('type: "musicended"');
		expect(pageSource).toContain("imageSizeJson: gameImageSizeJson");
		expect(pageSource).toContain("findPythonIdeCourseAsset");
		expect(pageSource).toContain("if (cached?.src === src) return cached;");
	});

	it("runs the selected Python file or falls back from resource files", () => {
		const project = createPythonIdeProject("data");

		expect(getPythonIdeRunnableFile(project)?.name).toBe("main.py");

		project.activeFileName = "scores.csv";
		expect(getPythonIdeRunnableFile(project)?.name).toBe("main.py");
	});
});
