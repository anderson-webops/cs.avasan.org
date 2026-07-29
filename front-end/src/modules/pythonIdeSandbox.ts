import type { PythonIdeFile, PythonIdeMode } from "@/modules/pythonIde";
import type {
	GameBridge,
	RunPythonProjectOptions,
	RuntimeArtifact,
	TurtleBridge
} from "@/modules/pythonIdeRuntime";
import {
	isPythonIdeTextFile,
	isValidPythonFileName
} from "@/modules/pythonIde";
import {
	PYODIDE_INDEX_URL,
	PYODIDE_SCRIPT_SRC
} from "@/modules/pythonIdeRuntimeHints";

const SANDBOX_CHANNEL = "cs-avasan-python-runtime-v1";
const SANDBOX_READY_TIMEOUT_MS = 30000;
const SANDBOX_RUN_TIMEOUT_MS = 120000;
const SANDBOX_TICK_TIMEOUT_MS = 15000;
const MAX_BRIDGE_STRING_LENGTH = 1_500_000;
const MAX_PROJECT_FILES = 40;
const MAX_PROJECT_TEXT_LENGTH = 512 * 1024;
const MAX_RUNTIME_RESULT_CHARACTERS = 12_000_000;
const MAX_RUNTIME_RESULT_BYTES = 32 * 1024 * 1024;

export interface PythonIdeSandboxRunPacket {
	activeFileName: string;
	files: PythonIdeFile[];
	imageSizes: Record<string, { height: number; width: number }>;
	importedModules: string[];
	inputBootstrap: string;
	inputText: string;
	micropipPackages: Array<[string, string]>;
	mode: PythonIdeMode;
	projectModuleNames: string[];
	projectRoot: string;
	runtimeFiles: PythonIdeFile[];
	runtimeModules: string[];
}

interface SandboxWorkerConfig {
	appProbeUrl: string;
	channel: string;
	indexUrl: string;
	scriptSrc: string;
}

interface SandboxSecurityProbe {
	ambientAppFetchBlocked: boolean;
	indexedDbBlocked: boolean;
	localStorageBlocked: boolean;
	parentDomBlocked: boolean;
}

interface SandboxResult {
	continuous: boolean;
	files: PythonIdeFile[];
	requestedLoop: boolean;
}

interface RuntimeMessage {
	channel: string;
	kind: string;
	[key: string]: unknown;
}

interface PendingRequest {
	reject: (error: Error) => void;
	resolve: (result: SandboxResult) => void;
	timeout: ReturnType<typeof window.setTimeout>;
}

interface ActiveSandbox {
	destroy: (reason: string) => void;
	run: (packet: PythonIdeSandboxRunPacket) => Promise<SandboxResult>;
	sendCallback: (callbackID: number, args: unknown[]) => void;
	tick: (input: SandboxRuntimeInput) => Promise<SandboxResult>;
}

interface SandboxRuntimeInput {
	events: unknown[];
	keys: string[];
}

interface SandboxSessionContext {
	gameBridge: GameBridge;
	onArtifact: (artifact: RuntimeArtifact) => void;
	onOutput: RunPythonProjectOptions["onOutput"];
	turtleBridge: TurtleBridge;
}

interface SandboxPyodideAPI {
	FS: {
		analyzePath: (path: string) => { exists: boolean };
		mkdirTree: (path: string) => void;
		unlink?: (path: string) => void;
		writeFile: (path: string, data: string | Uint8Array) => void;
	};
	loadPackage?: (packages: string | string[]) => Promise<void>;
	loadPackagesFromImports: (code: string) => Promise<void>;
	runPython: (code: string) => unknown;
	runPythonAsync: (code: string) => Promise<unknown>;
	setStderr?: (options: { batched: (text: string) => void }) => void;
	setStdout?: (options: { batched: (text: string) => void }) => void;
}

interface SandboxWorkerScope {
	addEventListener: (
		type: "message",
		listener: (event: MessageEvent<RuntimeMessage>) => void
	) => void;
	importScripts: (...urls: string[]) => void;
	loadPyodide?: (options: { indexURL: string }) => Promise<SandboxPyodideAPI>;
	postMessage: (message: RuntimeMessage) => void;
	window?: SandboxWorkerScope;
}

let activeSandbox: ActiveSandbox | null = null;

function pythonIdeSandboxWorkerMain(config: SandboxWorkerConfig) {
	const scope = globalThis as unknown as SandboxWorkerScope;
	const callbackRegistry = new Map<number, (...args: unknown[]) => unknown>();
	const oneShotCallbackIDs = new Set<number>();
	const messageEncoder = new TextEncoder();
	const encodeMessage = messageEncoder.encode.bind(messageEncoder);
	const serializeMessage = JSON.stringify.bind(JSON);
	const monotonicNow = performance.now.bind(performance);
	let postToHost: ((message: RuntimeMessage) => void) | null = null;
	let callbackCounter = 0;
	let pyodidePromise: Promise<SandboxPyodideAPI> | null = null;
	let activePacket: PythonIdeSandboxRunPacket | null = null;
	let gameEvents: unknown[] = [];
	let gameKeys = new Set<string>();
	let gameLoopRequested = false;
	let toneCounter = 0;
	let turtleStampCounter = 0;
	let budgetFailed = false;
	let operationMessageBytes = 0;
	let operationMessageCount = 0;
	let runtimeMessageBytes = 0;
	let runtimeMessageCount = 0;
	let windowMessageBytes = 0;
	let windowMessageCount = 0;
	let windowStartedAt = monotonicNow();

	const failBudget = (reason: string): never => {
		if (!budgetFailed) {
			budgetFailed = true;
			postToHost?.({
				channel: config.channel,
				kind: "fatal",
				message: reason
			});
		}
		throw new Error(reason);
	};
	const resetOperationBudget = () => {
		operationMessageBytes = 0;
		operationMessageCount = 0;
	};

	const send = (
		message: Omit<RuntimeMessage, "channel"> & { kind: string }
	) => {
		if (budgetFailed)
			throw new Error("Python runtime safety budget was exceeded.");
		if (!postToHost)
			throw new Error("Python runtime control channel is unavailable.");
		const packet = { channel: config.channel, ...message };
		const now = monotonicNow();
		if (now - windowStartedAt >= 1000) {
			windowStartedAt = now;
			windowMessageBytes = 0;
			windowMessageCount = 0;
		}
		let messageBytes: number;
		try {
			messageBytes = encodeMessage(serializeMessage(packet)).byteLength;
		} catch {
			return failBudget(
				"Python runtime produced an unreadable browser message."
			);
		}
		operationMessageBytes += messageBytes;
		operationMessageCount += 1;
		runtimeMessageBytes += messageBytes;
		runtimeMessageCount += 1;
		windowMessageBytes += messageBytes;
		windowMessageCount += 1;
		if (
			operationMessageCount > 5000 ||
			operationMessageBytes > 32 * 1024 * 1024 ||
			windowMessageCount > 2000 ||
			windowMessageBytes > 32 * 1024 * 1024 ||
			runtimeMessageCount > 6_000_000 ||
			runtimeMessageBytes > 512 * 1024 * 1024
		) {
			return failBudget(
				"Python runtime produced too much browser output; reduce drawing, printing, or callback activity."
			);
		}
		postToHost(packet);
	};

	const finiteNumber = (value: unknown, fallback = 0) =>
		typeof value === "number" && Number.isFinite(value) ? value : fallback;
	const boundedString = (value: unknown, limit = 4096) =>
		String(value ?? "").slice(0, limit);
	const bridge = (bridgeName: string, method: string, args: unknown[]) =>
		send({
			kind: "bridge",
			bridge: bridgeName,
			method,
			args: args.map(value =>
				typeof value === "string"
					? boundedString(value, 1_500_000)
					: value
			)
		});
	const callbackID = (callback: unknown, oneShot = false) => {
		if (typeof callback !== "function") return null;
		if (callbackRegistry.size >= 2048) {
			return failBudget(
				"Python runtime registered too many active callbacks."
			);
		}
		const id = ++callbackCounter;
		callbackRegistry.set(id, callback as (...args: unknown[]) => unknown);
		if (oneShot) oneShotCallbackIDs.add(id);
		return id;
	};

	const turtleBridge = {
		activate: (id: unknown) =>
			bridge("turtle", "activate", [boundedString(id, 128)]),
		reset: () => bridge("turtle", "reset", []),
		clear: () => bridge("turtle", "clear", []),
		resetTurtle: () => bridge("turtle", "resetTurtle", []),
		clearTurtle: () => bridge("turtle", "clearTurtle", []),
		bgcolor: (color: unknown) =>
			bridge("turtle", "bgcolor", [boundedString(color, 128)]),
		beginFill: () => bridge("turtle", "beginFill", []),
		endFill: () => bridge("turtle", "endFill", []),
		forward: (distance: unknown) =>
			bridge("turtle", "forward", [finiteNumber(distance)]),
		right: (degrees: unknown) =>
			bridge("turtle", "right", [finiteNumber(degrees)]),
		left: (degrees: unknown) =>
			bridge("turtle", "left", [finiteNumber(degrees)]),
		setheading: (degrees: unknown) =>
			bridge("turtle", "setheading", [finiteNumber(degrees)]),
		heading: () => 0,
		setState: (...args: unknown[]) =>
			bridge(
				"turtle",
				"setState",
				args
					.slice(0, 7)
					.map(value =>
						typeof value === "string"
							? boundedString(value, 128)
							: value
					)
			),
		xcor: () => 0,
		ycor: () => 0,
		goto: (x: unknown, y: unknown) =>
			bridge("turtle", "goto", [finiteNumber(x), finiteNumber(y)]),
		home: () => bridge("turtle", "home", []),
		penup: () => bridge("turtle", "penup", []),
		pendown: () => bridge("turtle", "pendown", []),
		isdown: () => true,
		pensize: (width: unknown) =>
			bridge("turtle", "pensize", [finiteNumber(width)]),
		pencolor: (color: unknown) =>
			bridge("turtle", "pencolor", [boundedString(color, 128)]),
		fillcolor: (color: unknown) =>
			bridge("turtle", "fillcolor", [boundedString(color, 128)]),
		color: (primary: unknown, secondary?: unknown) =>
			bridge("turtle", "color", [
				boundedString(primary, 128),
				...(secondary === undefined
					? []
					: [boundedString(secondary, 128)])
			]),
		circle: (radius: unknown) =>
			bridge("turtle", "circle", [finiteNumber(radius)]),
		dot: (size: unknown, color?: unknown) =>
			bridge("turtle", "dot", [
				finiteNumber(size),
				...(color === undefined ? [] : [boundedString(color, 128)])
			]),
		stamp: () => {
			const id = ++turtleStampCounter;
			bridge("turtle", "stamp", [id]);
			return id;
		},
		write: (text: unknown) =>
			bridge("turtle", "write", [boundedString(text, 12000)]),
		registerKey: (key: unknown, callback: unknown) =>
			bridge("turtle", "registerKey", [
				boundedString(key, 64),
				callbackID(callback)
			]),
		registerClick: (button: unknown, callback: unknown) =>
			bridge("turtle", "registerClick", [
				boundedString(button, 32),
				callbackID(callback)
			]),
		registerDrag: (button: unknown, callback: unknown) =>
			bridge("turtle", "registerDrag", [
				boundedString(button, 32),
				callbackID(callback)
			]),
		scheduleTimer: (delayMs: unknown, callback: unknown) =>
			bridge("turtle", "scheduleTimer", [
				Math.max(0, finiteNumber(delayMs)),
				callbackID(callback, true)
			]),
		listen: () => bridge("turtle", "listen", []),
		setShape: (shape: unknown) =>
			bridge("turtle", "setShape", [boundedString(shape, 64)]),
		setSpeed: (speed: unknown) =>
			bridge("turtle", "setSpeed", [finiteNumber(speed)]),
		setTracer: (value: unknown) =>
			bridge("turtle", "setTracer", [finiteNumber(value)]),
		setVisible: (visible: unknown) =>
			bridge("turtle", "setVisible", [Boolean(visible)]),
		update: () => bridge("turtle", "update", [])
	};

	const gameBridge = {
		reset: (width?: unknown, height?: unknown) =>
			bridge("game", "reset", [
				finiteNumber(width, 640),
				finiteNumber(height, 400)
			]),
		clear: () => bridge("game", "clear", []),
		fill: (color: unknown, gradient?: unknown) =>
			bridge("game", "fill", [
				boundedString(color, 128),
				...(gradient === undefined
					? []
					: [boundedString(gradient, 128)])
			]),
		drawActor: (...args: unknown[]) =>
			bridge("game", "drawActor", args.slice(0, 8)),
		drawImage: (...args: unknown[]) =>
			bridge("game", "drawImage", args.slice(0, 6)),
		drawText: (...args: unknown[]) =>
			bridge("game", "drawText", args.slice(0, 5)),
		drawRect: (...args: unknown[]) =>
			bridge("game", "drawRect", args.slice(0, 8)),
		drawLine: (...args: unknown[]) =>
			bridge("game", "drawLine", args.slice(0, 7)),
		drawCircle: (...args: unknown[]) =>
			bridge("game", "drawCircle", args.slice(0, 7)),
		imageSizeJson: (name: unknown) => {
			const safeName = boundedString(name, 256);
			const size = activePacket?.imageSizes[safeName] ?? {
				height: 64,
				width: 64
			};
			return JSON.stringify(size);
		},
		isKeyDown: (key: unknown) =>
			gameKeys.has(boundedString(key, 64).toLowerCase()),
		popEventsJson: () => {
			const events = gameEvents;
			gameEvents = [];
			return events.length ? JSON.stringify(events) : "";
		},
		requestLoop: () => {
			gameLoopRequested = true;
			bridge("game", "requestLoop", []);
		},
		consumeLoopRequest: () => {
			const requested = gameLoopRequested;
			gameLoopRequested = false;
			return requested;
		},
		startLoop: () => undefined,
		stopLoop: () => bridge("game", "stopLoop", []),
		playSound: (name: unknown, loops?: unknown) =>
			bridge("game", "playSound", [
				boundedString(name, 256),
				finiteNumber(loops)
			]),
		stopSound: (name: unknown) =>
			bridge("game", "stopSound", [boundedString(name, 256)]),
		playMusic: (name: unknown, loop?: unknown) =>
			bridge("game", "playMusic", [
				boundedString(name, 256),
				Boolean(loop)
			]),
		pauseMusic: () => bridge("game", "pauseMusic", []),
		unpauseMusic: () => bridge("game", "unpauseMusic", []),
		setMusicVolume: (volume: unknown) =>
			bridge("game", "setMusicVolume", [finiteNumber(volume)]),
		stopMusic: () => bridge("game", "stopMusic", []),
		playTone: (frequency: unknown, duration: unknown) => {
			const id = ++toneCounter;
			bridge("game", "playTone", [
				id,
				finiteNumber(frequency),
				finiteNumber(duration)
			]);
			return id;
		},
		stopTone: (toneID: unknown) =>
			bridge("game", "stopTone", [finiteNumber(toneID)]),
		log: (text: unknown) =>
			bridge("game", "log", [boundedString(text, 12000)])
	};

	const artifactBridge = {
		emit: (title: unknown, mimeType: unknown, data: unknown) =>
			bridge("artifact", "emit", [
				boundedString(title, 200),
				boundedString(mimeType, 128),
				boundedString(data, 1_500_000)
			])
	};

	const storageUnavailable = async (
		storageFactory: () => IDBFactory | Storage | undefined
	) => {
		try {
			const storage = storageFactory();
			if (!storage) return true;
			if ("open" in storage) {
				return await new Promise<boolean>(resolve => {
					let settled = false;
					const finish = (blocked: boolean) => {
						if (settled) return;
						settled = true;
						resolve(blocked);
					};
					const request = (storage as IDBFactory).open(
						"__cs_avasan_runtime_probe__"
					);
					request.addEventListener("error", () => finish(true), {
						once: true
					});
					request.addEventListener(
						"success",
						() => {
							request.result.close();
							finish(false);
						},
						{ once: true }
					);
					// Unknown or stalled storage behavior must fail closed.
					setTimeout(finish, 1000, false);
				});
			}
			void (storage as Storage).length;
			return false;
		} catch {
			return true;
		}
	};

	const runSecurityProbe = async (): Promise<SandboxSecurityProbe> => {
		const parentDomBlocked =
			typeof document === "undefined" &&
			typeof (scope as unknown as { parent?: unknown }).parent ===
				"undefined";
		const localStorageBlocked = await storageUnavailable(
			() => (scope as unknown as { localStorage?: Storage }).localStorage
		);
		const indexedDbBlocked = await storageUnavailable(
			() => (scope as unknown as { indexedDB?: IDBFactory }).indexedDB
		);
		let ambientAppFetchBlocked = false;
		try {
			await fetch(config.appProbeUrl, {
				credentials: "include",
				headers: { "X-Classroom-Request": "1" }
			});
		} catch {
			ambientAppFetchBlocked = true;
		}
		return {
			ambientAppFetchBlocked,
			indexedDbBlocked,
			localStorageBlocked,
			parentDomBlocked
		};
	};

	const loadRuntime = async () => {
		if (!pyodidePromise) {
			pyodidePromise = (async () => {
				scope.importScripts(config.scriptSrc);
				if (!scope.loadPyodide)
					throw new Error("Python runtime failed to initialize.");
				return scope.loadPyodide({ indexURL: config.indexUrl });
			})();
		}
		return pyodidePromise;
	};

	const ensureDirectory = (pyodide: SandboxPyodideAPI, path: string) => {
		if (!pyodide.FS.analyzePath(path).exists) pyodide.FS.mkdirTree(path);
	};
	const ensureParentDirectories = (
		pyodide: SandboxPyodideAPI,
		root: string,
		fileName: string
	) => {
		const segments = fileName.split("/").slice(0, -1);
		let current = root;
		for (const segment of segments) {
			current = `${current}/${segment}`;
			ensureDirectory(pyodide, current);
		}
	};
	const decodeBase64 = (content: string) => {
		const binary = atob(content);
		const bytes = new Uint8Array(binary.length);
		for (let index = 0; index < binary.length; index += 1)
			bytes[index] = binary.charCodeAt(index);
		return bytes;
	};
	const validRuntimeFile = (file: PythonIdeFile) =>
		typeof file.name === "string" &&
		file.name.length > 0 &&
		file.name.length <= 240 &&
		!file.name.startsWith("/") &&
		!file.name.split("/").includes("..") &&
		typeof file.content === "string";
	const writeFile = (
		pyodide: SandboxPyodideAPI,
		root: string,
		file: PythonIdeFile
	) => {
		if (!validRuntimeFile(file)) return;
		ensureParentDirectories(pyodide, root, file.name);
		pyodide.FS.writeFile(
			`${root}/${file.name}`,
			file.encoding === "base64"
				? decodeBase64(file.content)
				: file.content
		);
	};

	const escapePython = (value: unknown) => JSON.stringify(value);
	const plainBootstrap = (packet: PythonIdeSandboxRunPacket) => `
def __classes_run_active_file():
    import builtins
    import json
    import os
    import sys
    __classes_project_root = ${escapePython(packet.projectRoot)}
    __classes_active_file = ${escapePython(packet.activeFileName)}
    __classes_main = sys.modules["__main__"]
    for __classes_name in list(__classes_main.__dict__):
        if __classes_name not in {"__builtins__", "__doc__", "__loader__", "__package__", "__spec__"}:
            del __classes_main.__dict__[__classes_name]
    __classes_main.__dict__["__builtins__"] = builtins
    __classes_main.__dict__["__file__"] = __classes_active_file
    __classes_main.__dict__["__name__"] = "__main__"
    os.chdir(__classes_project_root)
    if __classes_project_root not in sys.path:
        sys.path.insert(0, __classes_project_root)
    for __classes_module_name in json.loads(${escapePython(JSON.stringify(packet.projectModuleNames))}):
        sys.modules.pop(__classes_module_name, None)
    __classes_input_values = iter(json.loads(${escapePython(JSON.stringify(packet.inputText.replaceAll("\r\n", "\n").split("\n")))}))
    def __classes_input(prompt=""):
        print(prompt, end="")
        try:
            return next(__classes_input_values)
        except StopIteration:
            raise EOFError("No more input values are available in the input panel.")
    builtins.input = __classes_input
    exec(
        compile(open(__classes_active_file, "r", encoding="utf-8").read(), __classes_active_file, "exec"),
        __classes_main.__dict__,
        __classes_main.__dict__,
    )
__classes_run_active_file()
`;

	const captureFiles = async (
		pyodide: SandboxPyodideAPI,
		root: string,
		excludedNames: string[]
	) => {
		const snapshot = await pyodide.runPythonAsync(`
import json
import re
from pathlib import Path
__classes_root = Path(${escapePython(root)})
__classes_excluded_names = set(json.loads(${escapePython(JSON.stringify(excludedNames))}))
__classes_reserved_names = {
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
    "zrect.py",
}
__classes_reserved_roots = {"keras", "pgzero", "tensorflow"}
__classes_safe_segment = re.compile(r"^[A-Za-z0-9_][A-Za-z0-9_.-]*$")
def __classes_valid_snapshot_name(__classes_name):
    if not __classes_name or len(__classes_name) > 80:
        return False
    if __classes_name.startswith("/") or "\\\\" in __classes_name or "//" in __classes_name:
        return False
    __classes_segments = __classes_name.split("/")
    if any(
        not __classes_segment
        or __classes_segment in {".", ".."}
        or not __classes_safe_segment.fullmatch(__classes_segment)
        for __classes_segment in __classes_segments
    ):
        return False
    __classes_lower = __classes_name.lower()
    if __classes_lower in __classes_reserved_names or __classes_segments[0].lower() in __classes_reserved_roots:
        return False
    if __classes_lower.endswith(".py"):
        return __classes_segments[0].lower() not in {"images", "music", "sounds"}
    if len(__classes_segments) == 1:
        return bool(re.fullmatch(r"[A-Za-z0-9_][A-Za-z0-9_.-]*\\.(?:csv|json|md|txt)", __classes_name, re.IGNORECASE))
    return (
        len(__classes_segments) == 2
        and __classes_segments[0].lower() == "images"
        and __classes_lower.endswith(".svg")
    )
__classes_files = []
__classes_total_bytes = 0
__classes_total_characters = 0
__classes_scanned_entries = 0
for __classes_path in sorted(__classes_root.rglob("*")):
    __classes_scanned_entries += 1
    if __classes_scanned_entries > 2048:
        raise RuntimeError("Project produced too many files to save safely.")
    if __classes_path.is_symlink() or not __classes_path.is_file() or __classes_path.suffix.lower() not in {".csv", ".json", ".md", ".py", ".svg", ".txt"}:
        continue
    __classes_name = str(__classes_path.relative_to(__classes_root))
    if __classes_name in __classes_excluded_names or not __classes_valid_snapshot_name(__classes_name):
        continue
    if len(__classes_files) >= 40:
        raise RuntimeError("Project produced more than 40 files; reduce the project before saving.")
    if __classes_path.stat().st_size > 512 * 1024:
        raise RuntimeError("Project file '{}' is too large to save.".format(__classes_name))
    try:
        __classes_content = __classes_path.read_text(encoding="utf-8")
    except Exception:
        continue
    __classes_file_bytes = len(__classes_content.encode("utf-8"))
    __classes_file_characters = (
        len(__classes_name.encode("utf-16-le")) // 2
        + len(__classes_content.encode("utf-16-le")) // 2
    )
    __classes_total_bytes += __classes_file_bytes
    __classes_total_characters += __classes_file_characters
    if (
        __classes_file_bytes > 512 * 1024
        or __classes_total_bytes > 32 * 1024 * 1024
        or __classes_total_characters > 12_000_000
    ):
        raise RuntimeError("Project output is too large to save safely.")
    __classes_files.append({
        "name": __classes_name,
        "content": __classes_content,
        "encoding": "text",
    })
json.dumps(__classes_files)
`);
		return JSON.parse(String(snapshot)) as PythonIdeFile[];
	};

	const loadPackages = async (
		pyodide: SandboxPyodideAPI,
		packet: PythonIdeSandboxRunPacket
	) => {
		const standardLibrarySnapshot = pyodide.runPython(`
import json
import sys
json.dumps(sorted(getattr(sys, "stdlib_module_names", [])))
`);
		const standardLibrary = new Set(
			JSON.parse(String(standardLibrarySnapshot)) as string[]
		);
		const localModules = new Set([
			"js",
			"pyodide",
			...packet.runtimeModules,
			...packet.projectModuleNames.map(name => name.split(".")[0])
		]);
		const micropip = new Map(packet.micropipPackages);
		const pyodideModules = packet.importedModules.filter(
			name =>
				!localModules.has(name) &&
				!standardLibrary.has(name) &&
				!micropip.has(name)
		);
		if (pyodideModules.length) {
			send({
				kind: "output",
				outputKind: "system",
				text: `Loading Python packages: ${pyodideModules.join(", ")}`
			});
			await pyodide.loadPackagesFromImports(
				pyodideModules.map(name => `import ${name}`).join("\n")
			);
		}
		const micropipPackages = packet.importedModules
			.map(name => micropip.get(name))
			.filter((name): name is string => Boolean(name));
		if (micropipPackages.length) {
			if (!pyodide.loadPackage)
				throw new Error("Python package installer is unavailable.");
			send({
				kind: "output",
				outputKind: "system",
				text: `Loading Python packages: ${micropipPackages.join(", ")}`
			});
			await pyodide.loadPackage("micropip");
			await pyodide.runPythonAsync(`
import micropip
await micropip.install(__import__("json").loads(${escapePython(JSON.stringify(micropipPackages))}))
`);
		}
		if (
			(packet.importedModules.includes("tensorflow") ||
				packet.importedModules.includes("keras")) &&
			pyodide.loadPackage
		) {
			await pyodide.loadPackage("numpy");
		}
	};

	const runProject = async (packet: PythonIdeSandboxRunPacket) => {
		resetOperationBudget();
		activePacket = packet;
		gameLoopRequested = false;
		const pyodide = await loadRuntime();
		pyodide.setStdout?.({
			batched: text =>
				send({
					kind: "output",
					outputKind: "stdout",
					text: boundedString(text, 12000)
				})
		});
		pyodide.setStderr?.({
			batched: text =>
				send({
					kind: "output",
					outputKind: "stderr",
					text: boundedString(text, 12000)
				})
		});
		ensureDirectory(pyodide, packet.projectRoot);
		for (const file of packet.files)
			writeFile(pyodide, packet.projectRoot, file);
		for (const file of packet.runtimeFiles)
			writeFile(pyodide, packet.projectRoot, file);
		await loadPackages(pyodide, packet);
		if (packet.mode === "python") {
			await pyodide.runPythonAsync(plainBootstrap(packet));
		} else {
			await pyodide.runPythonAsync(`
import os
import sys
os.chdir(${escapePython(packet.projectRoot)})
if ${escapePython(packet.projectRoot)} not in sys.path:
    sys.path.insert(0, ${escapePython(packet.projectRoot)})
for __classes_module_name in __import__("json").loads(${escapePython(JSON.stringify(packet.projectModuleNames))}):
    sys.modules.pop(__classes_module_name, None)
${packet.inputBootstrap}
if ${packet.mode === "pgzero" ? "True" : "False"}:
    import _classes_pgzero
    _classes_pgzero.install_builtins()
if ${packet.mode === "data" || packet.importedModules.includes("matplotlib") ? "True" : "False"}:
    try:
        import matplotlib
        matplotlib.use("Agg")
    except Exception:
        pass
try:
    import builtins
    from _classes_artifacts import emit_matplotlib_figures, show_chart
    builtins.show_chart = show_chart
    builtins.show_plots = emit_matplotlib_figures
except Exception:
    pass
import __main__
__main__.__dict__["__name__"] = "__main__"
__main__.__dict__["__file__"] = ${escapePython(packet.activeFileName)}
exec(
    __classes_compile_student_source(
        open(${escapePython(packet.activeFileName)}, "r", encoding="utf-8").read(),
        ${escapePython(packet.activeFileName)},
    ),
    __main__.__dict__,
    __main__.__dict__,
)
`);
			if (packet.mode === "data") {
				await pyodide.runPythonAsync(`
try:
    from _classes_artifacts import emit_matplotlib_figures
    emit_matplotlib_figures()
except Exception as error:
    import sys
    print("Could not render chart artifact: {}".format(error), file=sys.stderr)
`);
			}
			if (packet.mode === "pgzero") {
				await pyodide.runPythonAsync(`
import __main__
import _classes_pgzero
_classes_pgzero.__classes_pgzero_start(__main__.__dict__)
`);
			}
		}
		const continuous = gameLoopRequested;
		gameLoopRequested = false;
		return {
			continuous,
			files: await captureFiles(
				pyodide,
				packet.projectRoot,
				packet.runtimeFiles.map(file => file.name)
			),
			requestedLoop: continuous
		};
	};

	const runTick = async (input: SandboxRuntimeInput) => {
		resetOperationBudget();
		if (!activePacket || activePacket.mode !== "pgzero")
			throw new Error("No PyGame Zero project is running.");
		gameEvents = Array.isArray(input.events)
			? input.events.slice(0, 256)
			: [];
		gameKeys = new Set(
			(Array.isArray(input.keys) ? input.keys : [])
				.filter(key => typeof key === "string")
				.slice(0, 128)
				.map(key => key.toLowerCase())
		);
		gameLoopRequested = false;
		const pyodide = await loadRuntime();
		await pyodide.runPythonAsync(`
import _classes_pgzero
_classes_pgzero.__classes_pgzero_tick()
`);
		const requestedLoop = gameLoopRequested;
		gameLoopRequested = false;
		return {
			continuous: requestedLoop,
			files: [],
			requestedLoop
		};
	};

	Object.defineProperty(scope, "window", {
		configurable: false,
		enumerable: false,
		value: scope,
		writable: false
	});
	Object.defineProperties(scope, {
		__classesPythonIdeArtifacts: { value: artifactBridge },
		__classesPythonIdeGame: { value: gameBridge },
		__classesPythonIdeTurtle: { value: turtleBridge },
		postMessage: {
			configurable: false,
			value: () => {
				throw new Error(
					"Direct runtime messaging is unavailable to student code."
				);
			},
			writable: false
		}
	});

	const handleControlMessage = (event: MessageEvent<RuntimeMessage>) => {
		const message = event.data;
		if (
			!message ||
			message.channel !== config.channel ||
			typeof message.kind !== "string"
		) {
			return;
		}
		if (message.kind === "stop") {
			close();
			return;
		}
		if (message.kind === "callback") {
			resetOperationBudget();
			const id = Number(message.callbackID);
			const callback = callbackRegistry.get(id);
			if (!callback) return;
			if (oneShotCallbackIDs.delete(id)) callbackRegistry.delete(id);
			Promise.resolve(
				callback(
					...(Array.isArray(message.args)
						? message.args.slice(0, 4)
						: [])
				)
			).catch(error =>
				send({
					kind: "output",
					outputKind: "stderr",
					text: error instanceof Error ? error.message : String(error)
				})
			);
			return;
		}
		const requestID = Number(message.requestID);
		const operation =
			message.kind === "run"
				? runProject(message.packet as PythonIdeSandboxRunPacket)
				: message.kind === "tick"
					? runTick(message.input as SandboxRuntimeInput)
					: null;
		if (!operation || !Number.isSafeInteger(requestID)) return;
		void operation
			.then(result =>
				send({
					kind: "result",
					requestID,
					...result
				})
			)
			.catch(error =>
				send({
					kind: "error",
					requestID,
					message:
						error instanceof Error ? error.message : String(error)
				})
			);
	};
	let controlPortConnected = false;
	scope.addEventListener("message", event => {
		const message = event.data;
		if (
			controlPortConnected ||
			!message ||
			message.channel !== config.channel ||
			message.kind !== "worker-connect" ||
			event.ports.length !== 1
		) {
			return;
		}
		controlPortConnected = true;
		const controlPort = event.ports[0];
		postToHost = controlPort.postMessage.bind(controlPort);
		controlPort.onmessage = handleControlMessage;
		controlPort.start();
		void runSecurityProbe()
			.then(security => send({ kind: "runtime-ready", security }))
			.catch(() =>
				send({
					kind: "runtime-ready",
					security: {
						ambientAppFetchBlocked: false,
						indexedDbBlocked: false,
						localStorageBlocked: false,
						parentDomBlocked: false
					}
				})
			);
	});
}

function pythonIdeSandboxFrameMain(
	config: SandboxWorkerConfig,
	workerSource: string,
	token: string
) {
	let parentPort: MessagePort | null = null;
	const pendingWorkerMessages: RuntimeMessage[] = [];
	const worker = new Worker(
		URL.createObjectURL(
			new Blob([workerSource], { type: "text/javascript" })
		)
	);
	const workerChannel = new MessageChannel();
	const workerControlPort = workerChannel.port1;
	const forwardToParent = (message: RuntimeMessage) => {
		if (!parentPort) {
			if (pendingWorkerMessages.length < 16)
				pendingWorkerMessages.push(message);
			return;
		}
		parentPort.postMessage(message);
	};
	const failRuntime = (message: string) => {
		forwardToParent({
			channel: config.channel,
			kind: "fatal",
			message: message.slice(0, 12000)
		});
		workerControlPort.close();
		worker.terminate();
	};
	const safeWorkerMessage = (value: unknown): value is RuntimeMessage => {
		if (!value || typeof value !== "object") return false;
		const message = value as RuntimeMessage;
		if (
			message.channel !== config.channel ||
			typeof message.kind !== "string"
		) {
			return false;
		}
		if (message.kind === "bridge") {
			return (
				typeof message.bridge === "string" &&
				typeof message.method === "string" &&
				Array.isArray(message.args) &&
				message.args.length <= 10 &&
				message.args.every(
					value =>
						value === null ||
						typeof value === "boolean" ||
						(typeof value === "number" && Number.isFinite(value)) ||
						(typeof value === "string" && value.length <= 1_500_000)
				)
			);
		}
		if (message.kind === "output") {
			return (
				["stdout", "stderr", "system"].includes(
					String(message.outputKind)
				) &&
				typeof message.text === "string" &&
				message.text.length <= 12000
			);
		}
		if (message.kind === "result") {
			let totalBytes = 0;
			let totalCharacters = 0;
			const filesAreSafe =
				Array.isArray(message.files) &&
				message.files.length <= 40 &&
				message.files.every(file => {
					if (!file || typeof file !== "object") return false;
					const candidate = file as PythonIdeFile;
					if (
						typeof candidate.name !== "string" ||
						!candidate.name ||
						candidate.name.length > 80 ||
						candidate.name.startsWith("/") ||
						candidate.name.includes("\\") ||
						candidate.name.includes("//") ||
						candidate.name.split("/").includes("..") ||
						candidate.encoding !== "text" ||
						typeof candidate.content !== "string"
					) {
						return false;
					}
					const fileBytes = new TextEncoder().encode(
						candidate.content
					).byteLength;
					totalBytes += fileBytes;
					totalCharacters +=
						candidate.name.length + candidate.content.length;
					return (
						fileBytes <= 512 * 1024 &&
						totalBytes <= 32 * 1024 * 1024 &&
						totalCharacters <= 12_000_000
					);
				});
			return (
				Number.isSafeInteger(message.requestID) &&
				typeof message.continuous === "boolean" &&
				typeof message.requestedLoop === "boolean" &&
				filesAreSafe
			);
		}
		if (message.kind === "error") {
			return (
				Number.isSafeInteger(message.requestID) &&
				typeof message.message === "string" &&
				message.message.length <= 12000
			);
		}
		if (message.kind === "runtime-ready") {
			if (!message.security || typeof message.security !== "object")
				return false;
			const security = message.security as SandboxSecurityProbe;
			return (
				typeof security.ambientAppFetchBlocked === "boolean" &&
				typeof security.indexedDbBlocked === "boolean" &&
				typeof security.localStorageBlocked === "boolean" &&
				typeof security.parentDomBlocked === "boolean"
			);
		}
		return (
			message.kind === "fatal" &&
			typeof message.message === "string" &&
			message.message.length <= 12000
		);
	};
	const relayToParent = (value: unknown) => {
		if (!safeWorkerMessage(value)) {
			const kind =
				value && typeof value === "object"
					? (value as { kind?: unknown }).kind
					: undefined;
			if (
				["error", "fatal", "result", "runtime-ready"].includes(
					String(kind)
				)
			) {
				failRuntime(
					"Isolated Python worker returned an invalid control message."
				);
			}
			return;
		}
		forwardToParent(value);
	};
	workerControlPort.onmessage = event => relayToParent(event.data);
	workerControlPort.addEventListener("messageerror", () => {
		failRuntime("Isolated Python worker sent an unreadable message.");
	});
	workerControlPort.start();
	worker.addEventListener("error", () => {
		failRuntime("Isolated Python worker failed.");
	});
	worker.postMessage({ channel: config.channel, kind: "worker-connect" }, [
		workerChannel.port2
	]);
	window.addEventListener(
		"message",
		event => {
			if (
				event.source !== parent ||
				!event.data ||
				event.data.channel !== config.channel ||
				event.data.token !== token ||
				event.data.kind !== "connect" ||
				event.ports.length !== 1
			) {
				return;
			}
			parentPort = event.ports[0];
			parentPort.onmessage = portEvent => {
				const message = portEvent.data as RuntimeMessage;
				if (
					!message ||
					message.channel !== config.channel ||
					typeof message.kind !== "string"
				) {
					return;
				}
				if (message.kind === "stop") {
					workerControlPort.close();
					worker.terminate();
					parentPort?.close();
					parentPort = null;
					return;
				}
				workerControlPort.postMessage(message);
			};
			parentPort.start();
			for (const message of pendingWorkerMessages)
				parentPort.postMessage(message);
			pendingWorkerMessages.length = 0;
		},
		{ once: true }
	);
	parent.postMessage(
		{ channel: config.channel, kind: "frame-ready", token },
		"*"
	);
}

function escapedInlineJson(value: unknown) {
	return JSON.stringify(value).replaceAll("<", "\\u003c");
}

function sandboxFrameSource(token: string) {
	const appProbeUrl = new URL(
		"/api/students/session?runtime-isolation-probe=1",
		window.location.href
	).href;
	const config: SandboxWorkerConfig = {
		appProbeUrl,
		channel: SANDBOX_CHANNEL,
		indexUrl: PYODIDE_INDEX_URL,
		scriptSrc: PYODIDE_SCRIPT_SRC
	};
	const workerSource = `(${pythonIdeSandboxWorkerMain.toString()})(${escapedInlineJson(config)});`;
	const frameScript = `(${pythonIdeSandboxFrameMain.toString()})(${escapedInlineJson(config)},${escapedInlineJson(workerSource)},${escapedInlineJson(token)});`;
	return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; base-uri 'none'; form-action 'none'; script-src 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://cdn.jsdelivr.net; connect-src https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org; worker-src blob:; img-src data: blob:; media-src data: blob:; style-src 'unsafe-inline'">
</head>
<body>
<script>${frameScript}</script>
</body>
</html>`;
}

function randomSandboxToken() {
	const bytes = new Uint8Array(24);
	crypto.getRandomValues(bytes);
	return [...bytes]
		.map(value => value.toString(16).padStart(2, "0"))
		.join("");
}

function safeNumber(value: unknown): value is number {
	return typeof value === "number" && Number.isFinite(value);
}

function safeString(value: unknown, maxLength = 4096): value is string {
	return typeof value === "string" && value.length <= maxLength;
}

function safePrimitiveArgs(
	args: unknown,
	options: { max?: number; maxString?: number } = {}
): args is unknown[] {
	if (!Array.isArray(args) || args.length > (options.max ?? 10)) return false;
	return args.every(
		value =>
			value === null ||
			typeof value === "boolean" ||
			safeNumber(value) ||
			safeString(value, options.maxString ?? 4096)
	);
}

function validatedRuntimeResultFiles(value: unknown) {
	if (!Array.isArray(value) || value.length > MAX_PROJECT_FILES) return null;
	let totalBytes = 0;
	let totalCharacters = 0;
	const files: PythonIdeFile[] = [];
	for (const item of value) {
		if (!item || typeof item !== "object") return null;
		const file = item as Partial<PythonIdeFile>;
		if (
			typeof file.name !== "string" ||
			!isValidPythonFileName(file.name) ||
			!isPythonIdeTextFile(file.name) ||
			file.encoding !== "text" ||
			typeof file.content !== "string"
		) {
			return null;
		}
		const fileBytes = new TextEncoder().encode(file.content).byteLength;
		totalBytes += fileBytes;
		totalCharacters += file.name.length + file.content.length;
		if (
			fileBytes > MAX_PROJECT_TEXT_LENGTH ||
			totalCharacters > MAX_RUNTIME_RESULT_CHARACTERS ||
			totalBytes > MAX_RUNTIME_RESULT_BYTES
		) {
			return null;
		}
		files.push({
			name: file.name,
			content: file.content,
			encoding: "text"
		});
	}
	return files;
}

function invokeMethod(target: object, method: string, args: unknown[]) {
	const candidate = (target as Record<string, unknown>)[method];
	if (typeof candidate !== "function") return;
	(candidate as (...values: unknown[]) => unknown)(...args);
}

function parseRuntimeInput(gameBridge: GameBridge): SandboxRuntimeInput {
	if (gameBridge.runtimeInputJson) {
		try {
			const value = JSON.parse(gameBridge.runtimeInputJson()) as {
				events?: unknown[];
				keys?: unknown[];
			};
			return {
				events: Array.isArray(value.events)
					? value.events.slice(0, 256)
					: [],
				keys: Array.isArray(value.keys)
					? value.keys
							.filter(
								(key): key is string => typeof key === "string"
							)
							.slice(0, 128)
					: []
			};
		} catch {
			// Fall back to the legacy event-only bridge below.
		}
	}
	const rawEvents = gameBridge.popEventsJson();
	try {
		const events = rawEvents ? JSON.parse(rawEvents) : [];
		return { events: Array.isArray(events) ? events : [], keys: [] };
	} catch {
		return { events: [], keys: [] };
	}
}

function createSandboxSession(
	context: SandboxSessionContext
): Promise<ActiveSandbox> {
	activeSandbox?.destroy("Python runtime replaced by a new run.");
	return new Promise<ActiveSandbox>((resolve, reject) => {
		const token = randomSandboxToken();
		const iframe = document.createElement("iframe");
		iframe.dataset.pythonIdeRuntimeSandbox = "true";
		iframe.setAttribute("sandbox", "allow-scripts");
		iframe.setAttribute("aria-hidden", "true");
		iframe.setAttribute("tabindex", "-1");
		iframe.setAttribute("referrerpolicy", "no-referrer");
		iframe.style.display = "none";
		iframe.srcdoc = sandboxFrameSource(token);

		let destroyed = false;
		let ready = false;
		let readyTimer: ReturnType<typeof window.setTimeout> | null = null;
		readyTimer = window.setTimeout(() => {
			const reason = "Isolated Python runtime did not become ready.";
			destroy(reason);
			reject(new Error(reason));
		}, SANDBOX_READY_TIMEOUT_MS);
		let port: MessagePort | null = null;
		let requestCounter = 0;
		let session: ActiveSandbox;
		const pendingRequests = new Map<number, PendingRequest>();
		const toneIDs = new Map<number, number>();

		const rejectPending = (reason: string) => {
			for (const pending of pendingRequests.values()) {
				window.clearTimeout(pending.timeout);
				pending.reject(new Error(reason));
			}
			pendingRequests.clear();
		};
		function destroy(reason: string) {
			if (destroyed) return;
			destroyed = true;
			if (readyTimer !== null) window.clearTimeout(readyTimer);
			readyTimer = null;
			window.removeEventListener("message", onFrameReady);
			try {
				port?.postMessage({
					channel: SANDBOX_CHANNEL,
					kind: "stop"
				});
			} catch {
				// The opaque runtime may already be gone.
			}
			port?.close();
			port = null;
			iframe.remove();
			context.gameBridge.stopLoop();
			rejectPending(reason);
			if (activeSandbox === session) activeSandbox = null;
		}
		const sendCallback = (callbackID: number, args: unknown[]) => {
			if (
				destroyed ||
				!port ||
				!Number.isSafeInteger(callbackID) ||
				!safePrimitiveArgs(args, { max: 4, maxString: 1024 })
			) {
				return;
			}
			port.postMessage({
				channel: SANDBOX_CHANNEL,
				kind: "callback",
				callbackID,
				args
			});
		};
		const dispatchTurtle = (method: string, args: unknown[]) => {
			if (method === "registerKey") {
				const [key, callbackID] = args;
				if (
					!safeString(key, 64) ||
					!(callbackID === null || Number.isSafeInteger(callbackID))
				) {
					return;
				}
				context.turtleBridge.registerKey(
					key as string,
					callbackID === null
						? null
						: (...callbackArgs: unknown[]) =>
								sendCallback(callbackID as number, callbackArgs)
				);
				return;
			}
			if (method === "registerClick" || method === "registerDrag") {
				const [button, callbackID] = args;
				if (
					!safeString(button, 32) ||
					!(callbackID === null || Number.isSafeInteger(callbackID))
				) {
					return;
				}
				const callback =
					callbackID === null
						? null
						: (x: number, y: number) =>
								sendCallback(callbackID as number, [x, y]);
				if (method === "registerClick") {
					context.turtleBridge.registerClick(
						button as string,
						callback
					);
				} else {
					context.turtleBridge.registerDrag(
						button as string,
						callback
					);
				}
				return;
			}
			if (method === "scheduleTimer") {
				const [delay, callbackID] = args;
				if (
					!safeNumber(delay) ||
					!(callbackID === null || Number.isSafeInteger(callbackID))
				) {
					return;
				}
				context.turtleBridge.scheduleTimer(
					Math.min(Math.max(delay as number, 0), 86_400_000),
					callbackID === null
						? null
						: () => sendCallback(callbackID as number, [])
				);
				return;
			}
			const allowed = new Set([
				"activate",
				"reset",
				"clear",
				"resetTurtle",
				"clearTurtle",
				"bgcolor",
				"beginFill",
				"endFill",
				"forward",
				"right",
				"left",
				"setheading",
				"setState",
				"goto",
				"home",
				"penup",
				"pendown",
				"pensize",
				"pencolor",
				"fillcolor",
				"color",
				"circle",
				"dot",
				"stamp",
				"write",
				"listen",
				"setShape",
				"setSpeed",
				"setTracer",
				"setVisible",
				"update"
			]);
			if (!allowed.has(method)) return;
			if (method === "stamp") {
				context.turtleBridge.stamp();
				return;
			}
			invokeMethod(context.turtleBridge, method, args);
		};
		const dispatchGame = (method: string, args: unknown[]) => {
			if (method === "playTone") {
				const [sandboxID, frequency, duration] = args;
				if (
					!Number.isSafeInteger(sandboxID) ||
					!safeNumber(frequency) ||
					!safeNumber(duration)
				) {
					return;
				}
				toneIDs.set(
					sandboxID as number,
					context.gameBridge.playTone(
						frequency as number,
						duration as number
					)
				);
				return;
			}
			if (method === "stopTone") {
				const [sandboxID] = args;
				if (!Number.isSafeInteger(sandboxID)) return;
				const actualID = toneIDs.get(sandboxID as number);
				if (actualID !== undefined)
					context.gameBridge.stopTone(actualID);
				toneIDs.delete(sandboxID as number);
				return;
			}
			const allowed = new Set([
				"reset",
				"clear",
				"fill",
				"drawActor",
				"drawImage",
				"drawText",
				"drawRect",
				"drawLine",
				"drawCircle",
				"requestLoop",
				"stopLoop",
				"playSound",
				"stopSound",
				"playMusic",
				"pauseMusic",
				"unpauseMusic",
				"setMusicVolume",
				"stopMusic",
				"log"
			]);
			if (!allowed.has(method)) return;
			invokeMethod(context.gameBridge, method, args);
		};
		const handleRuntimeMessage = (message: RuntimeMessage) => {
			if (destroyed || !message || message.channel !== SANDBOX_CHANNEL) {
				return;
			}
			if (message.kind === "fatal") {
				const reason = safeString(message.message, 12000)
					? (message.message as string)
					: "Isolated Python runtime failed.";
				destroy(reason);
				reject(new Error(reason));
				return;
			}
			if (message.kind === "runtime-ready") {
				if (ready) return;
				const security = message.security as
					Partial<SandboxSecurityProbe> | undefined;
				if (
					!security?.ambientAppFetchBlocked ||
					!security.indexedDbBlocked ||
					!security.localStorageBlocked ||
					!security.parentDomBlocked
				) {
					destroy(
						"Python runtime isolation checks failed; code was not run."
					);
					reject(
						new Error(
							"Python runtime isolation checks failed; code was not run."
						)
					);
					return;
				}
				if (readyTimer !== null) window.clearTimeout(readyTimer);
				readyTimer = null;
				ready = true;
				activeSandbox = session;
				resolve(session);
				return;
			}
			if (message.kind === "output") {
				const kind = message.outputKind;
				const outputText = message.text;
				if (
					(kind === "stdout" ||
						kind === "stderr" ||
						kind === "system") &&
					safeString(outputText, 12000)
				) {
					context.onOutput(kind, outputText as string);
				}
				return;
			}
			if (message.kind === "bridge") {
				if (
					!safeString(message.bridge, 16) ||
					!safeString(message.method, 64) ||
					!safePrimitiveArgs(message.args, {
						max: 10,
						maxString: MAX_BRIDGE_STRING_LENGTH
					})
				) {
					return;
				}
				if (message.bridge === "turtle") {
					dispatchTurtle(
						message.method as string,
						message.args as unknown[]
					);
				} else if (message.bridge === "game") {
					dispatchGame(
						message.method as string,
						message.args as unknown[]
					);
				} else if (
					message.bridge === "artifact" &&
					message.method === "emit"
				) {
					const [title, mimeType, data] = message.args as unknown[];
					if (
						safeString(title, 200) &&
						safeString(mimeType, 128) &&
						safeString(data, MAX_BRIDGE_STRING_LENGTH)
					) {
						context.onArtifact({
							title: title as string,
							mimeType: mimeType as string,
							data: data as string
						});
					}
				}
				return;
			}
			if (message.kind !== "error" && message.kind !== "result") return;
			const requestID = Number(message.requestID);
			if (!Number.isSafeInteger(requestID)) return;
			const pending = pendingRequests.get(requestID);
			if (!pending) return;
			pendingRequests.delete(requestID);
			window.clearTimeout(pending.timeout);
			if (message.kind === "error") {
				pending.reject(
					new Error(
						safeString(message.message, 12000)
							? (message.message as string)
							: "Isolated Python runtime failed."
					)
				);
				return;
			}
			const files = validatedRuntimeResultFiles(message.files);
			if (!files) {
				const reason =
					"Python runtime returned an invalid project snapshot.";
				pending.reject(new Error(reason));
				destroy(reason);
				return;
			}
			pending.resolve({
				continuous: message.continuous === true,
				files,
				requestedLoop: message.requestedLoop === true
			});
		};
		const request = (
			kind: "run" | "tick",
			payload: Record<string, unknown>
		) => {
			if (destroyed || !port) {
				return Promise.reject(
					new Error("Isolated Python runtime is not available.")
				);
			}
			const requestID = ++requestCounter;
			return new Promise<SandboxResult>(
				(requestResolve, requestReject) => {
					const timeoutMs =
						kind === "run"
							? SANDBOX_RUN_TIMEOUT_MS
							: SANDBOX_TICK_TIMEOUT_MS;
					const timeout = window.setTimeout(() => {
						if (!pendingRequests.has(requestID)) return;
						pendingRequests.delete(requestID);
						const reason =
							kind === "run"
								? "Python run exceeded the two-minute safety limit."
								: "PyGame update exceeded the safety time limit.";
						requestReject(new Error(reason));
						destroy(reason);
					}, timeoutMs);
					pendingRequests.set(requestID, {
						reject: requestReject,
						resolve: requestResolve,
						timeout
					});
					try {
						port?.postMessage({
							channel: SANDBOX_CHANNEL,
							kind,
							requestID,
							...payload
						});
					} catch {
						window.clearTimeout(timeout);
						pendingRequests.delete(requestID);
						const reason =
							"Could not contact the isolated Python runtime.";
						requestReject(new Error(reason));
						destroy(reason);
					}
				}
			);
		};
		session = {
			destroy,
			run: packet => request("run", { packet }),
			sendCallback,
			tick: input => request("tick", { input })
		};
		function onFrameReady(event: MessageEvent) {
			if (
				destroyed ||
				event.source !== iframe.contentWindow ||
				event.origin !== "null" ||
				!event.data ||
				event.data.channel !== SANDBOX_CHANNEL ||
				event.data.kind !== "frame-ready" ||
				event.data.token !== token
			) {
				return;
			}
			window.removeEventListener("message", onFrameReady);
			const channel = new MessageChannel();
			port = channel.port1;
			port.onmessage = portEvent =>
				handleRuntimeMessage(portEvent.data as RuntimeMessage);
			port.start();
			iframe.contentWindow?.postMessage(
				{
					channel: SANDBOX_CHANNEL,
					kind: "connect",
					token
				},
				"*",
				[channel.port2]
			);
		}
		window.addEventListener("message", onFrameReady);
		document.body.append(iframe);
	});
}

function collectImageSizes(options: RunPythonProjectOptions) {
	const names = new Set<string>();
	for (const file of options.files) {
		const imageMatch = /^images\/(.+)\.[^.]+$/i.exec(file.name);
		if (imageMatch) names.add(imageMatch[1]);
		if (file.encoding === "base64") continue;
		for (const match of file.content.matchAll(
			/["']([A-Z0-9][\w./ -]{0,127})["']/gi
		)) {
			names.add(match[1]);
			if (names.size >= 256) break;
		}
		if (names.size >= 256) break;
	}
	const sizes: Record<string, { height: number; width: number }> = {};
	for (const name of names) {
		try {
			const size = JSON.parse(options.gameBridge.imageSizeJson(name)) as {
				height?: unknown;
				width?: unknown;
			};
			if (safeNumber(size.height) && safeNumber(size.width)) {
				sizes[name] = {
					height: size.height as number,
					width: size.width as number
				};
			}
		} catch {
			// Unknown assets retain the existing 64x64 teaching fallback.
		}
	}
	return sizes;
}

export async function runPythonProjectInSandbox(
	options: RunPythonProjectOptions,
	packet: Omit<PythonIdeSandboxRunPacket, "imageSizes">
) {
	const session = await createSandboxSession({
		gameBridge: options.gameBridge,
		onArtifact: options.onArtifact,
		onOutput: options.onOutput,
		turtleBridge: options.turtleBridge
	});
	if (options.shouldStop?.()) {
		session.destroy("Python run stopped.");
		throw new Error("Python run stopped.");
	}
	let result: SandboxResult;
	try {
		result = await session.run({
			...packet,
			imageSizes: collectImageSizes(options)
		});
	} catch (error) {
		session.destroy(
			error instanceof Error
				? error.message
				: "Isolated Python run failed."
		);
		throw error;
	}
	if (options.shouldStop?.()) {
		session.destroy("Python run stopped.");
		throw new Error("Python run stopped.");
	}
	options.onProjectFilesUpdate?.(result.files);
	if (options.mode === "python" || options.mode === "data") {
		session.destroy("Python run complete.");
		return;
	}
	if (options.mode === "pgzero") {
		options.gameBridge.startLoop(
			async () => {
				let tickResult: SandboxResult;
				try {
					tickResult = await session.tick(
						parseRuntimeInput(options.gameBridge)
					);
				} catch (error) {
					session.destroy(
						error instanceof Error
							? error.message
							: "PyGame update failed."
					);
					throw error;
				}
				if (tickResult.requestedLoop) options.gameBridge.requestLoop();
			},
			{ continuous: result.continuous }
		);
	}
}

export function stopPythonIdeSandboxRun(reason = "Python run stopped.") {
	activeSandbox?.destroy(reason);
}

export function releasePythonIdeSandboxCallbacks() {
	stopPythonIdeSandboxRun("Python runtime callbacks released.");
}
