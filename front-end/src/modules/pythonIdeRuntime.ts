import type { PythonIdeFile, PythonIdeMode } from "@/modules/pythonIde";
import {
	getPythonIdeRunnableFile,
	isPythonIdePythonFile,
	isPythonIdeTextFile,
	isValidPythonFileName
} from "@/modules/pythonIde";
import {
	PYODIDE_INDEX_URL,
	PYODIDE_SCRIPT_SRC,
	warmPythonRuntimeResources
} from "@/modules/pythonIdeRuntimeHints";

const PROJECT_ROOT = "/home/pyodide/classes_project";
const PYTHON_IDE_RUNTIME_BOOTSTRAP_VERSION =
	"2026-06-18-name-mangling-cache-bust";
const PYTHON_EXTENSION_RE = /\.py$/i;
const FROM_IMPORT_MODULE_RE =
	/^from\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s+import\b/;
const PYTHON_IDENTIFIER_RE = /^[A-Z_]\w*$/i;
const PYTHON_IMPORT_KEYWORD = "import";
const PYTHON_IMPORT_SEPARATOR_RE = /\s*,\s*/;
const PYTHON_IMPORT_ALIAS_RE = /\s+as\s+/i;
const PYTHON_MODULE_SEPARATOR_RE = /\./;
const FOR_LOOP_ITERATION_LIMIT = 500000;
const WHILE_LOOP_ITERATION_LIMIT = 25000;
const TURTLE_COOPERATIVE_WHILE_LOOP_ITERATION_LIMIT = 0;
const TURTLE_COOPERATIVE_LOOP_DELAY_MS = 8;
const MICROPIP_PACKAGES = new Map([
	["altair", "altair"],
	["networkx", "networkx"],
	["seaborn", "seaborn"]
]);
const PYTHON_IDE_RUNTIME_MODULES = [
	"_classes_artifacts",
	"_classes_keras",
	"_classes_pgzero",
	"keras",
	"pgzero",
	"pgzrun",
	"pygame",
	"pysynth",
	"streamlit",
	"tensorflow",
	"turtle",
	"zrect"
];
const BROWSER_SHIM_MODULES = new Set([
	"keras",
	"pysynth",
	"streamlit",
	"tensorflow"
]);

interface PyodideAPI {
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
	setStdout?: (options: { batched: (text: string) => void }) => void;
	setStderr?: (options: { batched: (text: string) => void }) => void;
}

interface LoadPyodideOptions {
	indexURL: string;
}

declare global {
	interface Window {
		__classesPythonIdeArtifacts?: ArtifactBridge;
		__classesPythonIdeGame?: GameBridge;
		loadPyodide?: (options: LoadPyodideOptions) => Promise<PyodideAPI>;
		__classesPythonIdeTurtle?: TurtleBridge;
	}
}

export interface RuntimeArtifact {
	title: string;
	mimeType: string;
	data: string;
}

interface ArtifactBridge {
	emit: (title: string, mimeType: string, data: string) => void;
}

export interface GameBridge {
	reset: (width?: number, height?: number) => void;
	clear: () => void;
	fill: (color: string) => void;
	drawActor: (
		image: string,
		x: number,
		y: number,
		width: number,
		height: number,
		angle: number,
		anchorX?: number,
		anchorY?: number
	) => void;
	drawImage: (
		image: string,
		x: number,
		y: number,
		width: number,
		height: number,
		angle: number
	) => void;
	drawText: (
		text: string,
		x: number,
		y: number,
		color: string,
		fontSize: number
	) => void;
	drawRect: (
		x: number,
		y: number,
		width: number,
		height: number,
		color: string,
		filled: boolean,
		lineWidth?: number
	) => void;
	drawLine: (
		x1: number,
		y1: number,
		x2: number,
		y2: number,
		color: string,
		lineWidth?: number
	) => void;
	drawCircle: (
		x: number,
		y: number,
		radius: number,
		color: string,
		filled: boolean,
		lineWidth?: number
	) => void;
	imageSizeJson: (name: string) => string;
	isKeyDown: (key: string) => boolean;
	popEventsJson: () => string;
	requestLoop: () => void;
	consumeLoopRequest: () => boolean;
	startLoop: (tick: () => Promise<void>) => void;
	stopLoop: () => void;
	playSound: (name: string) => void;
	stopSound: (name: string) => void;
	playMusic: (name: string, loop?: boolean) => void;
	pauseMusic: () => void;
	unpauseMusic: () => void;
	setMusicVolume: (volume: number) => void;
	stopMusic: () => void;
	playTone: (frequency: number, duration: number) => number;
	stopTone: (toneID: number) => void;
	log: (text: string) => void;
}

export interface TurtleBridge {
	reset: () => void;
	clear: () => void;
	bgcolor: (color: string) => void;
	beginFill: () => void;
	endFill: () => void;
	forward: (distance: number) => void;
	right: (degrees: number) => void;
	left: (degrees: number) => void;
	setheading: (degrees: number) => void;
	heading: () => number;
	setState: (
		x: number,
		y: number,
		heading: number,
		penDown: boolean,
		penColor: string,
		fillColor: string,
		lineWidth: number
	) => void;
	xcor: () => number;
	ycor: () => number;
	goto: (x: number, y: number) => void;
	home: () => void;
	penup: () => void;
	pendown: () => void;
	isdown: () => boolean;
	pensize: (width: number) => void;
	pencolor: (color: string) => void;
	fillcolor: (color: string) => void;
	color: (primary: string, secondary?: string) => void;
	circle: (radius: number) => void;
	dot: (size: number, color?: string) => void;
	stamp: () => number;
	write: (text: string) => void;
	registerKey: (key: string, callback: (() => void) | null) => void;
	registerClick: (
		button: string,
		callback: ((x: number, y: number) => void) | null
	) => void;
	registerDrag: (
		button: string,
		callback: ((x: number, y: number) => void) | null
	) => void;
	scheduleTimer: (delayMs: number, callback: (() => void) | null) => void;
	listen: () => void;
	setShape: (shape: string) => void;
	setVisible: (visible: boolean) => void;
}

export interface RunPythonProjectOptions {
	files: PythonIdeFile[];
	activeFileName: string;
	inputText: string;
	mode: PythonIdeMode;
	gameBridge: GameBridge;
	turtleBridge: TurtleBridge;
	onArtifact: (artifact: RuntimeArtifact) => void;
	onProjectFilesUpdate?: (files: PythonIdeFile[]) => void;
	onOutput: (kind: "stdout" | "stderr" | "system", text: string) => void;
	shouldStop?: () => boolean;
}

let pyodidePromise: Promise<PyodideAPI> | null = null;
let lastProjectFileNames = new Set<string>();
const loadedBrowserShimPackages = new Set<string>();
const installedMicropipPackages = new Set<string>();
const loadedPyodideImportModules = new Set<string>();
let micropipLoaded = false;

function throwIfRunStopped(
	options: Pick<RunPythonProjectOptions, "shouldStop">
) {
	if (options.shouldStop?.()) {
		throw new Error("Python run stopped before post-run work completed.");
	}
}

export function pythonIdeProjectModuleNames(
	files: Pick<PythonIdeFile, "name">[]
) {
	const modules = new Set<string>();
	const packageSuffix = ".__init__";

	for (const file of files) {
		if (!isPythonIdePythonFile(file.name)) continue;
		const moduleName = file.name
			.replace(PYTHON_EXTENSION_RE, "")
			.replaceAll("/", ".");
		if (!moduleName) continue;
		modules.add(
			moduleName.endsWith(packageSuffix)
				? moduleName.slice(0, -packageSuffix.length)
				: moduleName
		);
	}

	return [...modules];
}

function loadScript(src: string) {
	return new Promise<void>((resolve, reject) => {
		const existing = document.querySelector<HTMLScriptElement>(
			`script[src="${src}"]`
		);
		if (existing) {
			if (window.loadPyodide) {
				resolve();
			} else {
				existing.addEventListener("load", () => resolve(), {
					once: true
				});
			}
			return;
		}

		const script = document.createElement("script");
		script.src = src;
		script.async = true;
		script.addEventListener("load", () => resolve(), { once: true });
		script.addEventListener(
			"error",
			() => reject(new Error("Unable to load Python runtime.")),
			{ once: true }
		);
		document.head.append(script);
	});
}

export function warmPythonRuntime() {
	warmPythonRuntimeResources();
}

async function loadRuntime() {
	if (typeof window === "undefined" || typeof document === "undefined") {
		throw new TypeError("Python runtime is only available in the browser.");
	}

	if (!pyodidePromise) {
		warmPythonRuntimeResources();
		pyodidePromise = (async () => {
			await loadScript(PYODIDE_SCRIPT_SRC);
			if (!window.loadPyodide)
				throw new Error("Python runtime failed to initialize.");
			const pyodide = await window.loadPyodide({
				indexURL: PYODIDE_INDEX_URL
			});
			return pyodide;
		})();
	}

	return pyodidePromise;
}

const releaseRuntimeCallbackRegistriesSource = `
import sys

for __classes_module_name in ("turtle",):
    __classes_module = sys.modules.get(__classes_module_name)
    __classes_release = getattr(__classes_module, "_release_all_callbacks", None)
    if callable(__classes_release):
        __classes_release()

__classes_loop_proxies = globals().get("__classes_turtle_loop_proxies")
if isinstance(__classes_loop_proxies, dict):
    for __classes_proxy in list(__classes_loop_proxies.values()):
        if __classes_proxy is not None and hasattr(__classes_proxy, "destroy"):
            __classes_proxy.destroy()
    __classes_loop_proxies.clear()
`;

function releaseRuntimeCallbackRegistries(pyodide: PyodideAPI) {
	pyodide.runPython(releaseRuntimeCallbackRegistriesSource);
}

export async function releasePythonIdeRuntimeCallbacks() {
	if (!pyodidePromise) return;
	releaseRuntimeCallbackRegistries(await pyodidePromise);
}

function clearRuntimeShimModules(pyodide: PyodideAPI) {
	pyodide.runPython(`
import builtins
import json
import sys

__classes_runtime_module_roots = __import__("json").loads(${escapePythonString(JSON.stringify(PYTHON_IDE_RUNTIME_MODULES))})
for __classes_runtime_name in list(sys.modules):
    if any(
        __classes_runtime_name == __classes_root
        or __classes_runtime_name.startswith("{}.".format(__classes_root))
        for __classes_root in __classes_runtime_module_roots
    ):
        sys.modules.pop(__classes_runtime_name, None)

for __classes_builtin_name in (
    "Actor",
    "Rect",
    "ZRect",
    "screen",
    "keyboard",
    "keys",
    "mouse",
    "keymods",
    "clock",
    "Animation",
    "animate",
    "tone",
    "sounds",
    "music",
    "images",
    "pgzrun",
    "show_chart",
    "show_plots",
    "__classes_loop_guard",
    "__classes_schedule_turtle_loop",
):
    if not hasattr(builtins, __classes_builtin_name):
        continue
    __classes_builtin_value = getattr(builtins, __classes_builtin_name)
    __classes_builtin_owner = getattr(
        __classes_builtin_value,
        "__module__",
        getattr(type(__classes_builtin_value), "__module__", ""),
    )
    if (
        __classes_builtin_name.startswith("__classes_")
        or __classes_builtin_owner in ("_classes_pgzero", "_classes_artifacts")
    ):
        delattr(builtins, __classes_builtin_name)
`);
}

function escapePythonString(value: string) {
	return JSON.stringify(value);
}

function createInputBootstrap(inputText: string, mode: PythonIdeMode) {
	const inputLines = inputText.replaceAll("\r\n", "\n").split("\n");
	return `
import ast
import builtins
import importlib.abc
import importlib.machinery
import importlib.util
import textwrap
import time as __classes_time
from pathlib import Path as __ClassesPath
__classes_input_values = iter(__import__("json").loads(${escapePythonString(JSON.stringify(inputLines))}))
__classes_python_ide_mode = ${escapePythonString(mode)}
__classes_runtime_bootstrap_version = ${escapePythonString(PYTHON_IDE_RUNTIME_BOOTSTRAP_VERSION)}
__classes_project_root = __ClassesPath(${escapePythonString(PROJECT_ROOT)})
__classes_project_root_resolved = __classes_project_root.resolve()
__classes_reserved_import_roots = set(
    __import__("json").loads(${escapePythonString(JSON.stringify(PYTHON_IDE_RUNTIME_MODULES))})
)
_classes_project_root = __classes_project_root
_classes_project_root_resolved = __classes_project_root_resolved
_classes_reserved_import_roots = __classes_reserved_import_roots
__classes_loop_iterations = {"for": 0, "while": 0}
__classes_loop_iteration_limits = {
    "for": ${FOR_LOOP_ITERATION_LIMIT},
    "while": ${WHILE_LOOP_ITERATION_LIMIT},
    "turtle while": ${TURTLE_COOPERATIVE_WHILE_LOOP_ITERATION_LIMIT},
}
__classes_turtle_loop_delay_ms = ${TURTLE_COOPERATIVE_LOOP_DELAY_MS}
__classes_turtle_loop_counter = 0
__classes_existing_turtle_loop_proxies = globals().get("__classes_turtle_loop_proxies")
if isinstance(__classes_existing_turtle_loop_proxies, dict):
    for __classes_existing_proxy in list(__classes_existing_turtle_loop_proxies.values()):
        if __classes_existing_proxy is not None and hasattr(__classes_existing_proxy, "destroy"):
            __classes_existing_proxy.destroy()
    __classes_existing_turtle_loop_proxies.clear()
__classes_turtle_loop_proxies = {}
__classes_turtle_animation_call_names = {
    "back",
    "backward",
    "bgcolor",
    "bk",
    "circle",
    "clear",
    "color",
    "dot",
    "down",
    "fd",
    "fillcolor",
    "forward",
    "goto",
    "home",
    "left",
    "listen",
    "lt",
    "onclick",
    "ondrag",
    "onkey",
    "onkeypress",
    "onscreenclick",
    "ontimer",
    "pd",
    "pendown",
    "pensize",
    "pencolor",
    "penup",
    "pu",
    "right",
    "rt",
    "setheading",
    "seth",
    "setpos",
    "setposition",
    "stamp",
    "up",
    "write",
}
_classes_turtle_animation_call_names = __classes_turtle_animation_call_names

def __classes_input(prompt=""):
    print(prompt, end="")
    try:
        return next(__classes_input_values)
    except StopIteration:
        raise EOFError("No more input values are available in the input panel.")
builtins.input = __classes_input

def __classes_sleep(_seconds=0):
    return None

__classes_time.sleep = __classes_sleep

def __classes_loop_guard(kind):
    limit = __classes_loop_iteration_limits.get(kind, ${WHILE_LOOP_ITERATION_LIMIT})
    if limit <= 0:
        return
    __classes_loop_iterations[kind] = __classes_loop_iterations.get(kind, 0) + 1
    if __classes_loop_iterations[kind] > limit:
        raise RuntimeError(
            "Stopped a long-running {} loop after {} iterations. "
            "Add a break condition. For ongoing Turtle animation, use a top-level "
            "while True loop with Turtle calls inside it, or use screen.ontimer(...)."
            .format(kind, limit)
        )

class __ClassesLoopGuardTransformer(ast.NodeTransformer):
    def __init__(self, source, filename, allow_turtle_cooperative=False):
        self.source = source
        self.filename = filename
        self.allow_turtle_cooperative = allow_turtle_cooperative
        super().__init__()

    def _guard_statement(self, node, kind):
        return ast.copy_location(
            ast.Expr(
                value=ast.Call(
                    func=ast.Name(id="__classes_loop_guard", ctx=ast.Load()),
                    args=[ast.Constant(value=kind)],
                    keywords=[],
                )
            ),
            node,
        )

    def _guard_loop(self, node, kind):
        self.generic_visit(node)
        node.body.insert(0, self._guard_statement(node, kind))
        return node

    def _module_imports_turtle(self, node):
        for statement in node.body:
            if isinstance(statement, ast.Import):
                for alias in statement.names:
                    if alias.name == "turtle" or alias.name.startswith("turtle."):
                        return True
            if isinstance(statement, ast.ImportFrom):
                module = statement.module or ""
                if module == "turtle" or module.startswith("turtle."):
                    return True
        return False

    def _node_uses_turtle_api(self, node, turtle_helper_names=None):
        if turtle_helper_names is None:
            turtle_helper_names = set()
        for child in ast.walk(node):
            if not isinstance(child, ast.Call):
                continue
            function = child.func
            if isinstance(function, ast.Attribute) and function.attr in _classes_turtle_animation_call_names:
                return True
            if isinstance(function, ast.Name) and function.id in _classes_turtle_animation_call_names:
                return True
            if isinstance(function, ast.Name) and function.id in turtle_helper_names:
                return True
        return False

    def _module_turtle_helper_names(self, node):
        helper_names = set()
        changed = True
        while changed:
            changed = False
            for statement in node.body:
                if not isinstance(statement, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    continue
                if statement.name in helper_names:
                    continue
                if self._node_uses_turtle_api(statement, helper_names):
                    helper_names.add(statement.name)
                    changed = True
        return helper_names

    def _is_forever_while_loop(self, node):
        return (
            isinstance(node, ast.While)
            and isinstance(node.test, ast.Constant)
            and node.test.value in (True, 1)
        )

    def _is_simple_top_level_turtle_loop(self, node, module_allows_turtle_loop, turtle_helper_names):
        if not self._is_forever_while_loop(node):
            return False
        if node.orelse:
            return False
        unsupported_nodes = (
            ast.Await,
            ast.Break,
            ast.Continue,
            ast.Return,
            ast.Yield,
            ast.YieldFrom,
        )
        return (
            (module_allows_turtle_loop or self._node_uses_turtle_api(node, turtle_helper_names))
            and self._node_uses_turtle_api(node, turtle_helper_names)
            and not any(isinstance(child, unsupported_nodes) for child in ast.walk(node))
        )

    def _loop_body_source(self, node):
        body_segments = []
        for statement in node.body:
            segment = ast.get_source_segment(self.source, statement)
            if segment is None:
                return None
            body_segments.append(segment)
        body_source = textwrap.dedent("\\n".join(body_segments)).strip()
        return "{}\\n".format(body_source) if body_source else "pass\\n"

    def _turtle_loop_schedule_statement(self, node):
        body_source = self._loop_body_source(node)
        if body_source is None:
            return None
        return ast.copy_location(
            ast.Expr(
                value=ast.Call(
                    func=ast.Name(id="__classes_schedule_turtle_loop", ctx=ast.Load()),
                    args=[
                        ast.Constant(value=body_source),
                        ast.Constant(value=self.filename),
                        ast.Constant(value=node.lineno),
                        ast.Call(
                            func=ast.Name(id="globals", ctx=ast.Load()),
                            args=[],
                            keywords=[],
                        ),
                    ],
                    keywords=[],
                )
            ),
            node,
        )

    def visit_Module(self, node):
        module_allows_turtle_loop = (
            self.allow_turtle_cooperative or self._module_imports_turtle(node)
        )
        turtle_helper_names = self._module_turtle_helper_names(node)
        rewritten_body = []
        for statement in node.body:
            if self._is_simple_top_level_turtle_loop(
                statement,
                module_allows_turtle_loop,
                turtle_helper_names,
            ):
                scheduled = self._turtle_loop_schedule_statement(statement)
                if scheduled is not None:
                    rewritten_body.append(scheduled)
                    continue
            rewritten_body.append(self.visit(statement))
        node.body = rewritten_body
        return node

    def visit_For(self, node):
        return self._guard_loop(node, "for")

    def visit_While(self, node):
        return self._guard_loop(node, "while")

def __classes_compile_student_source(source, filename, allow_turtle_cooperative=None):
    if allow_turtle_cooperative is None:
        allow_turtle_cooperative = __classes_python_ide_mode == "turtle"
    tree = ast.parse(source, filename=filename, mode="exec")
    tree = __ClassesLoopGuardTransformer(
        source,
        filename,
        allow_turtle_cooperative=allow_turtle_cooperative,
    ).visit(tree)
    ast.fix_missing_locations(tree)
    return compile(tree, filename, "exec")
_classes_compile_student_source = __classes_compile_student_source

def _classes_is_project_path(path):
    try:
        resolved = path.resolve()
        return (
            resolved == _classes_project_root_resolved
            or _classes_project_root_resolved in resolved.parents
        )
    except Exception:
        return False

class __ClassesProjectSourceLoader(importlib.machinery.SourceFileLoader):
    def source_to_code(self, data, path, *, _optimize=-1):
        source = data.decode("utf-8") if isinstance(data, (bytes, bytearray)) else str(data)
        return _classes_compile_student_source(source, path)
_ClassesProjectSourceLoader = __ClassesProjectSourceLoader

class __ClassesProjectImportFinder(importlib.abc.MetaPathFinder):
    __classes_python_ide_project_finder__ = True

    def find_spec(self, fullname, path=None, target=None):
        root_name = fullname.split(".", 1)[0]
        if root_name in _classes_reserved_import_roots:
            return None

        module_path = _classes_project_root / fullname.replace(".", "/")
        candidates = (
            (module_path.with_suffix(".py"), False),
            (module_path / "__init__.py", True),
        )
        for candidate, is_package in candidates:
            if not _classes_is_project_path(candidate) or not candidate.is_file():
                continue
            loader = _ClassesProjectSourceLoader(fullname, str(candidate))
            if is_package:
                return importlib.util.spec_from_file_location(
                    fullname,
                    str(candidate),
                    loader=loader,
                    submodule_search_locations=[str(module_path)],
                )
            return importlib.util.spec_from_file_location(
                fullname,
                str(candidate),
                loader=loader,
            )
        return None

def __classes_install_project_import_hook():
    sys = __import__("sys")
    sys.meta_path[:] = [
        finder for finder in sys.meta_path
        if not getattr(finder, "__classes_python_ide_project_finder__", False)
    ]
    sys.meta_path.insert(0, __ClassesProjectImportFinder())

__classes_install_project_import_hook()

def __classes_schedule_turtle_loop(body_source, filename, line_number, namespace=None):
    global __classes_turtle_loop_counter
    if namespace is None:
        namespace = globals()
    try:
        from js import window as __classes_window
        from pyodide.ffi import create_proxy as __classes_create_proxy
    except Exception:
        raise RuntimeError("Scheduled Turtle while loops require the browser Turtle runtime.")

    __classes_turtle_loop_counter += 1
    loop_key = str(__classes_turtle_loop_counter)
    body_code = __classes_compile_student_source(
        body_source,
        "{}:while-{}".format(filename, line_number),
        allow_turtle_cooperative=False,
    )

    def __classes_run_turtle_loop():
        try:
            __classes_loop_guard("turtle while")
            exec(body_code, namespace)
            __classes_window.__classesPythonIdeTurtle.scheduleTimer(
                __classes_turtle_loop_delay_ms,
                __classes_turtle_loop_proxies[loop_key],
            )
        except Exception:
            proxy = __classes_turtle_loop_proxies.pop(loop_key, None)
            if proxy is not None and hasattr(proxy, "destroy"):
                proxy.destroy()
            raise

    __classes_turtle_loop_proxies[loop_key] = __classes_create_proxy(
        __classes_run_turtle_loop
    )
    __classes_window.__classesPythonIdeTurtle.scheduleTimer(
        0,
        __classes_turtle_loop_proxies[loop_key],
    )

builtins.__classes_loop_guard = __classes_loop_guard
builtins.__classes_schedule_turtle_loop = __classes_schedule_turtle_loop
`;
}

const turtleShim = `
import math
from js import window
from pyodide.ffi import create_proxy

_bridge = window.__classesPythonIdeTurtle
_callback_proxies = {}
_color_mode = 1.0
_timer_counter = 0
_builtin_shapes = {"arrow", "blank", "circle", "classic", "fancy", "square", "triangle", "turtle"}

def _is_number(value):
    try:
        float(value)
        return True
    except Exception:
        return False

def _color_channel(value):
    number = float(value)
    if _color_mode == 1.0 and 0 <= number <= 1:
        number *= 255
    return max(0, min(255, int(round(number))))

def _normalize_color(*values):
    if len(values) == 1:
        value = values[0]
        if isinstance(value, str):
            return value
        try:
            sequence = list(value)
        except TypeError:
            return str(value)
        if len(sequence) >= 3 and all(_is_number(part) for part in sequence[:3]):
            return "rgb({}, {}, {})".format(
                _color_channel(sequence[0]),
                _color_channel(sequence[1]),
                _color_channel(sequence[2]),
            )
        return str(value)

    if len(values) >= 3 and all(_is_number(part) for part in values[:3]):
        return "rgb({}, {}, {})".format(
            _color_channel(values[0]),
            _color_channel(values[1]),
            _color_channel(values[2]),
        )

    return str(values[0]) if values else "black"

def _set_color_mode(cmode=None):
    global _color_mode
    if cmode is None:
        return _color_mode
    _color_mode = float(cmode)
    return _color_mode

def _release_proxy(proxy):
    if proxy is not None and hasattr(proxy, "destroy"):
        proxy.destroy()

def _stored_callback(kind, key, function):
    storage_key = (kind, str(key))
    _release_proxy(_callback_proxies.pop(storage_key, None))

    if function is None:
        return None

    proxy = create_proxy(function)
    _callback_proxies[storage_key] = proxy
    return proxy

def _timer_callback(function):
    global _timer_counter
    if function is None:
        return None

    _timer_counter += 1
    storage_key = ("timer", str(_timer_counter))

    def run_timer():
        try:
            function()
        finally:
            _release_proxy(_callback_proxies.pop(storage_key, None))

    proxy = create_proxy(run_timer)
    _callback_proxies[storage_key] = proxy
    return proxy

def _release_all_callbacks():
    for proxy in list(_callback_proxies.values()):
        _release_proxy(proxy)
    _callback_proxies.clear()

class _Screen:
    def bgcolor(self, color):
        _bridge.bgcolor(_normalize_color(color))

    def clear(self):
        _bridge.clear()

    def reset(self):
        _release_all_callbacks()
        _bridge.reset()

    def listen(self):
        _bridge.listen()

    def onkey(self, function, key):
        _bridge.registerKey(str(key), _stored_callback("key", key, function))

    def onkeypress(self, function, key=None):
        _bridge.registerKey(str(key or ""), _stored_callback("key", key or "", function))

    def ontimer(self, function, t=0):
        _bridge.scheduleTimer(float(t), _timer_callback(function))

    def onclick(self, function, btn=1, add=None):
        _bridge.registerClick(str(btn), _stored_callback("click", btn, function))

    def onscreenclick(self, function, btn=1, add=None):
        self.onclick(function, btn, add)

    def title(self, *_args):
        return None

    def setup(self, *_args, **_kwargs):
        return None

    def tracer(self, *_args, **_kwargs):
        return None

    def update(self):
        return None

    def mainloop(self):
        return None

    def exitonclick(self):
        return None

    def colormode(self, cmode=None):
        return _set_color_mode(cmode)

_screen = _Screen()

def Screen():
    return _screen

class Turtle:
    def __init__(self, *_args, **_kwargs):
        self._x = 0.0
        self._y = 0.0
        self._heading = 0.0
        self._pen_down = True
        self._pen_color = "#000000"
        self._fill_color = "#000000"
        self._line_width = 3.0
        self._shape = "classic"
        self._visible = True

    def _sync_bridge(self):
        _bridge.setShape(str(self._shape))
        _bridge.setVisible(bool(self._visible))
        _bridge.setState(
            float(self._x),
            float(self._y),
            float(self._heading),
            bool(self._pen_down),
            str(self._pen_color),
            str(self._fill_color),
            float(self._line_width),
        )

    def _set_position(self, x, y):
        self._x = float(x)
        self._y = float(y)

    def forward(self, distance):
        amount = float(distance)
        self._sync_bridge()
        _bridge.forward(amount)
        radians = math.radians(self._heading)
        self._x += math.cos(radians) * amount
        self._y += math.sin(radians) * amount

    def fd(self, distance):
        self.forward(distance)

    def backward(self, distance):
        self.forward(-float(distance))

    def back(self, distance):
        self.backward(distance)

    def bk(self, distance):
        self.backward(distance)

    def right(self, degrees):
        self._heading -= float(degrees)
        self._sync_bridge()

    def rt(self, degrees):
        self.right(degrees)

    def left(self, degrees):
        self._heading += float(degrees)
        self._sync_bridge()

    def lt(self, degrees):
        self.left(degrees)

    def setheading(self, degrees):
        self._heading = float(degrees)
        self._sync_bridge()

    def seth(self, degrees):
        self.setheading(degrees)

    def heading(self):
        return self._heading

    def xcor(self):
        return self._x

    def ycor(self):
        return self._y

    def position(self):
        return (self.xcor(), self.ycor())

    def pos(self):
        return self.position()

    def goto(self, x, y=None):
        if y is None:
            x, y = x
        self._sync_bridge()
        _bridge.goto(float(x), float(y))
        self._set_position(x, y)

    def setpos(self, x, y=None):
        self.goto(x, y)

    def setposition(self, x, y=None):
        self.goto(x, y)

    def setx(self, x):
        self.goto(float(x), self.ycor())

    def sety(self, y):
        self.goto(self.xcor(), float(y))

    def home(self):
        self.goto(0, 0)
        self._heading = 0.0
        self._sync_bridge()

    def penup(self):
        self._pen_down = False
        self._sync_bridge()

    def pu(self):
        self.penup()

    def up(self):
        self.penup()

    def pendown(self):
        self._pen_down = True
        self._sync_bridge()

    def pd(self):
        self.pendown()

    def down(self):
        self.pendown()

    def isdown(self):
        return self._pen_down

    def pensize(self, width=None):
        if width is None:
            return self._line_width
        self._line_width = max(1.0, float(width))
        self._sync_bridge()

    def width(self, width=None):
        return self.pensize(width)

    def pencolor(self, *color):
        if len(color) == 0:
            return self._pen_color
        self._pen_color = _normalize_color(*color)
        self._sync_bridge()

    def fillcolor(self, *color):
        if len(color) == 0:
            return self._fill_color
        self._fill_color = _normalize_color(*color)
        self._sync_bridge()

    def color(self, *colors):
        if len(colors) == 0:
            return (self._pen_color, self._fill_color)
        if len(colors) == 1:
            normalized = _normalize_color(colors[0])
            self._pen_color = normalized
            self._fill_color = normalized
        elif len(colors) >= 3 and all(_is_number(part) for part in colors[:3]):
            normalized = _normalize_color(*colors)
            self._pen_color = normalized
            self._fill_color = normalized
        elif len(colors) >= 2:
            self._pen_color = _normalize_color(colors[0])
            self._fill_color = _normalize_color(colors[1])
        self._sync_bridge()

    def circle(self, radius, *_args, **_kwargs):
        self._sync_bridge()
        _bridge.circle(float(radius))

    def dot(self, size=8, color=None):
        self._sync_bridge()
        if color is None:
            _bridge.dot(float(size))
        else:
            _bridge.dot(float(size), str(color))

    def stamp(self):
        self._sync_bridge()
        return _bridge.stamp()

    def write(self, text, *_args, **_kwargs):
        self._sync_bridge()
        _bridge.write(str(text))

    def onclick(self, function, btn=1, add=None):
        self._sync_bridge()
        _bridge.registerClick(str(btn), _stored_callback("turtle-click", btn, function))

    def ondrag(self, function, btn=1, add=None):
        self._sync_bridge()
        _bridge.registerDrag(str(btn), _stored_callback("drag", btn, function))

    def speed(self, *_args):
        return None

    def shape(self, *_args):
        if len(_args) == 0:
            return self._shape
        shape_name = str(_args[0]).lower()
        if shape_name not in _builtin_shapes:
            raise ValueError("Unknown turtle shape: {}".format(_args[0]))
        self._shape = shape_name
        self._sync_bridge()
        return None

    def clear(self):
        _bridge.clear()

    def reset(self):
        self._x = 0.0
        self._y = 0.0
        self._heading = 0.0
        self._pen_down = True
        self._pen_color = "#000000"
        self._fill_color = "#000000"
        self._line_width = 3.0
        self._shape = "classic"
        self._visible = True
        _bridge.reset()

    def distance(self, x, y=None):
        if hasattr(x, "xcor") and hasattr(x, "ycor") and y is None:
            target_x, target_y = x.xcor(), x.ycor()
        elif y is None:
            target_x, target_y = x
        else:
            target_x, target_y = x, y
        return math.hypot(float(target_x) - self.xcor(), float(target_y) - self.ycor())

    def towards(self, x, y=None):
        if hasattr(x, "xcor") and hasattr(x, "ycor") and y is None:
            target_x, target_y = x.xcor(), x.ycor()
        elif y is None:
            target_x, target_y = x
        else:
            target_x, target_y = x, y
        return math.degrees(math.atan2(float(target_y) - self.ycor(), float(target_x) - self.xcor()))

    def hideturtle(self):
        self._visible = False
        self._sync_bridge()
        return None

    def showturtle(self):
        self._visible = True
        self._sync_bridge()
        return None

    def isvisible(self):
        return self._visible

    def begin_fill(self):
        self._sync_bridge()
        _bridge.beginFill()

    def end_fill(self):
        self._sync_bridge()
        _bridge.endFill()

_default = Turtle()

def forward(distance): _default.forward(distance)
def fd(distance): _default.forward(distance)
def backward(distance): _default.backward(distance)
def back(distance): _default.backward(distance)
def bk(distance): _default.backward(distance)
def right(degrees): _default.right(degrees)
def rt(degrees): _default.right(degrees)
def left(degrees): _default.left(degrees)
def lt(degrees): _default.left(degrees)
def setheading(degrees): _default.setheading(degrees)
def seth(degrees): _default.setheading(degrees)
def heading(): return _default.heading()
def xcor(): return _default.xcor()
def ycor(): return _default.ycor()
def position(): return _default.position()
def pos(): return _default.position()
def goto(x, y=None): _default.goto(x, y)
def setpos(x, y=None): _default.goto(x, y)
def setposition(x, y=None): _default.goto(x, y)
def setx(x): _default.setx(x)
def sety(y): _default.sety(y)
def home(): _default.home()
def penup(): _default.penup()
def pu(): _default.penup()
def up(): _default.penup()
def pendown(): _default.pendown()
def pd(): _default.pendown()
def down(): _default.pendown()
def isdown(): return _default.isdown()
def pensize(width=None): return _default.pensize(width)
def width(width=None): return _default.pensize(width)
def pencolor(*color): return _default.pencolor(*color)
def fillcolor(*color): return _default.fillcolor(*color)
def color(*colors): return _default.color(*colors)
def circle(radius, *args, **kwargs): _default.circle(radius, *args, **kwargs)
def dot(size=8, color=None): _default.dot(size, color)
def stamp(): return _default.stamp()
def write(text, *args, **kwargs): _default.write(text, *args, **kwargs)
def clear(): _default.clear()
def reset(): _default.reset()
def distance(x, y=None): return _default.distance(x, y)
def towards(x, y=None): return _default.towards(x, y)
def listen(): _screen.listen()
def onkey(function, key): _screen.onkey(function, key)
def onkeypress(function, key=None): _screen.onkeypress(function, key)
def ontimer(function, t=0): _screen.ontimer(function, t)
def onclick(function, btn=1, add=None): _screen.onclick(function, btn, add)
def onscreenclick(function, btn=1, add=None): _screen.onscreenclick(function, btn, add)
def ondrag(function, btn=1, add=None): _default.ondrag(function, btn, add)
def speed(*args): return _default.speed(*args)
def shape(*args): return _default.shape(*args)
def hideturtle(): return _default.hideturtle()
def ht(): return _default.hideturtle()
def showturtle(): return _default.showturtle()
def st(): return _default.showturtle()
def isvisible(): return _default.isvisible()
def begin_fill(): return _default.begin_fill()
def end_fill(): return _default.end_fill()
def mainloop(): _screen.mainloop()
def done(): _screen.mainloop()
def colormode(cmode=None): return _set_color_mode(cmode)
`;

const pgzeroShim = `
import builtins
import inspect
import json
import math
import time
from js import window

_bridge = window.__classesPythonIdeGame
_module_globals = {}
_scheduled = []
_animations = []
_last_tick = None

def _number(value, fallback=0):
    try:
        return float(value)
    except Exception:
        return float(fallback)

def _point(value, fallback=(0, 0)):
    try:
        return _number(value[0], fallback[0]), _number(value[1], fallback[1])
    except Exception:
        return float(fallback[0]), float(fallback[1])

def _point_from_args(args):
    if len(args) == 1:
        return _point(args[0])
    if len(args) == 2:
        return _number(args[0]), _number(args[1])
    raise TypeError("Expected a point as (x, y) or x, y.")

def _line_points_from_args(args):
    if len(args) == 4:
        return tuple(_number(value) for value in args)

    if len(args) == 2:
        start_x, start_y = _point(args[0])
        end_x, end_y = _point(args[1])
        return start_x, start_y, end_x, end_y

    if len(args) == 1:
        value = args[0]
        try:
            value_length = len(value)
        except Exception:
            value_length = 0

        if value_length == 4:
            return tuple(_number(item) for item in value)
        if value_length == 2:
            start_x, start_y = _point(value[0])
            end_x, end_y = _point(value[1])
            return start_x, start_y, end_x, end_y

    raise TypeError(
        "Expected a line as x1, y1, x2, y2; "
        "(x1, y1), (x2, y2); or a matching sequence."
    )

def _clipline_point(x, y):
    return int(round(x)), int(round(y))

def _rect_parts(value):
    if isinstance(value, Rect):
        return value.x, value.y, value.width, value.height

    if isinstance(value, Actor):
        return value.left, value.top, value.width, value.height

    if hasattr(value, "rect"):
        rect_value = getattr(value, "rect")
        if callable(rect_value):
            rect_value = rect_value()
        if rect_value is not value:
            return _rect_parts(rect_value)

    try:
        value_length = len(value)
    except Exception:
        raise TypeError("Expected a Rect, object with rect, ((x, y), (w, h)), or (x, y, w, h).")

    if value_length == 2 and len(value[0]) == 2 and len(value[1]) == 2:
        return (
            _number(value[0][0]),
            _number(value[0][1]),
            _number(value[1][0]),
            _number(value[1][1]),
        )

    if value_length == 4:
        return (
            _number(value[0]),
            _number(value[1]),
            _number(value[2]),
            _number(value[3]),
        )

    raise TypeError("Expected a Rect, object with rect, ((x, y), (w, h)), or (x, y, w, h).")

def _rect_parts_from_args(args):
    if len(args) == 1:
        return _rect_parts(args[0])
    if len(args) == 2:
        return _rect_parts((args[0], args[1]))
    if len(args) == 4:
        return tuple(_number(value) for value in args)
    raise TypeError("Rect expects (x, y, width, height), ((x, y), (width, height)), or object with rect.")

def _normalize_color(color):
    if isinstance(color, str):
        return color
    if isinstance(color, (tuple, list)) and len(color) >= 3:
        return "rgb({}, {}, {})".format(
            int(_number(color[0])),
            int(_number(color[1])),
            int(_number(color[2])),
        )
    return str(color)

_tone_note_offsets = {
    "c": -9,
    "c#": -8,
    "db": -8,
    "d": -7,
    "d#": -6,
    "eb": -6,
    "e": -5,
    "f": -4,
    "f#": -3,
    "gb": -3,
    "g": -2,
    "g#": -1,
    "ab": -1,
    "a": 0,
    "a#": 1,
    "bb": 1,
    "b": 2,
}

def _tone_frequency(pitch):
    if isinstance(pitch, (int, float)):
        return float(pitch)

    note = str(pitch).strip().lower()
    if len(note) >= 2 and note[1] in ("#", "b"):
        name = note[:2]
        octave_text = note[2:]
    else:
        name = note[:1]
        octave_text = note[1:]

    if name not in _tone_note_offsets:
        raise ValueError("Unsupported tone pitch: {}".format(pitch))

    octave = int(octave_text) if octave_text else 4
    semitones = _tone_note_offsets[name] + ((octave - 4) * 12)
    return 440.0 * (2 ** (semitones / 12))

def _asset_size(image, fallback=(64, 64)):
    try:
        raw_size = _bridge.imageSizeJson(str(image))
        size = json.loads(raw_size) if raw_size else {}
        width = _number(size.get("width"), fallback[0])
        height = _number(size.get("height"), fallback[1])
        if width > 0 and height > 0:
            return width, height
    except Exception:
        pass
    return float(fallback[0]), float(fallback[1])

def _callback_shape(callback):
    try:
        parameters = inspect.signature(callback).parameters.values()
    except Exception:
        return None, True

    positional_count = 0
    has_varargs = False
    for parameter in parameters:
        if parameter.kind == parameter.VAR_POSITIONAL:
            has_varargs = True
        elif parameter.kind in (parameter.POSITIONAL_ONLY, parameter.POSITIONAL_OR_KEYWORD):
            positional_count += 1

    return positional_count, has_varargs

def _call_callback(callback, *args):
    positional_count, has_varargs = _callback_shape(callback)
    if has_varargs or positional_count is None:
        return callback(*args)
    return callback(*args[:positional_count])

def _call_named_callback(callback, named_args, fallback_args=()):
    try:
        parameters = list(inspect.signature(callback).parameters.values())
    except Exception:
        return callback(*fallback_args)

    args = []
    kwargs = {}
    fallback_index = 0
    for parameter in parameters:
        if parameter.kind == parameter.VAR_POSITIONAL:
            args.extend(fallback_args[fallback_index:])
            fallback_index = len(fallback_args)
            continue
        if parameter.kind == parameter.VAR_KEYWORD:
            continue
        if parameter.kind == parameter.KEYWORD_ONLY:
            if parameter.name in named_args:
                kwargs[parameter.name] = named_args[parameter.name]
            continue
        if parameter.name in named_args:
            args.append(named_args[parameter.name])
        elif fallback_index < len(fallback_args):
            args.append(fallback_args[fallback_index])
            fallback_index += 1
        elif parameter.default is inspect._empty:
            break

    return callback(*args, **kwargs)

def _call_optional(name, *args):
    callback = _module_globals.get(name)
    if callable(callback):
        return _call_callback(callback, *args)
    return None

def _call_optional_named(name, named_args, fallback_args=()):
    callback = _module_globals.get(name)
    if not callable(callback):
        return None
    return _call_named_callback(callback, named_args, fallback_args)

class Rect:
    def __init__(self, *args):
        self.x, self.y, self.width, self.height = _rect_parts_from_args(args)

    def __iter__(self):
        return iter((self.x, self.y, self.width, self.height))

    def __len__(self):
        return 4

    def __getitem__(self, index):
        return (self.x, self.y, self.width, self.height)[index]

    @property
    def left(self):
        return self.x

    @left.setter
    def left(self, value):
        self.x = _number(value)

    @property
    def right(self):
        return self.x + self.width

    @right.setter
    def right(self, value):
        self.x = _number(value) - self.width

    @property
    def top(self):
        return self.y

    @top.setter
    def top(self, value):
        self.y = _number(value)

    @property
    def bottom(self):
        return self.y + self.height

    @bottom.setter
    def bottom(self, value):
        self.y = _number(value) - self.height

    @property
    def center(self):
        return (self.x + self.width / 2, self.y + self.height / 2)

    @center.setter
    def center(self, value):
        x, y = _point(value, self.center)
        self.x = x - self.width / 2
        self.y = y - self.height / 2

    @property
    def centerx(self):
        return self.center[0]

    @centerx.setter
    def centerx(self, value):
        self.center = (value, self.centery)

    @property
    def centery(self):
        return self.center[1]

    @centery.setter
    def centery(self, value):
        self.center = (self.centerx, value)

    @property
    def pos(self):
        return (self.x, self.y)

    @pos.setter
    def pos(self, value):
        self.x, self.y = _point(value, self.pos)

    @property
    def w(self):
        return self.width

    @w.setter
    def w(self, value):
        self.width = _number(value, self.width)

    @property
    def h(self):
        return self.height

    @h.setter
    def h(self, value):
        self.height = _number(value, self.height)

    @property
    def size(self):
        return (self.width, self.height)

    @size.setter
    def size(self, value):
        self.width, self.height = _point(value, self.size)

    @property
    def topleft(self):
        return (self.left, self.top)

    @topleft.setter
    def topleft(self, value):
        self.left, self.top = _point(value, self.topleft)

    @property
    def topright(self):
        return (self.right, self.top)

    @topright.setter
    def topright(self, value):
        self.right, self.top = _point(value, self.topright)

    @property
    def bottomleft(self):
        return (self.left, self.bottom)

    @bottomleft.setter
    def bottomleft(self, value):
        self.left, self.bottom = _point(value, self.bottomleft)

    @property
    def bottomright(self):
        return (self.right, self.bottom)

    @bottomright.setter
    def bottomright(self, value):
        self.right, self.bottom = _point(value, self.bottomright)

    @property
    def midtop(self):
        return (self.centerx, self.top)

    @midtop.setter
    def midtop(self, value):
        self.centerx, self.top = _point(value, self.midtop)

    @property
    def midbottom(self):
        return (self.centerx, self.bottom)

    @midbottom.setter
    def midbottom(self, value):
        self.centerx, self.bottom = _point(value, self.midbottom)

    @property
    def midleft(self):
        return (self.left, self.centery)

    @midleft.setter
    def midleft(self, value):
        self.left, self.centery = _point(value, self.midleft)

    @property
    def midright(self):
        return (self.right, self.centery)

    @midright.setter
    def midright(self, value):
        self.right, self.centery = _point(value, self.midright)

    def copy(self):
        return Rect(self.x, self.y, self.width, self.height)

    def move(self, x, y=None):
        moved = self.copy()
        moved.move_ip(x, y)
        return moved

    def move_ip(self, x, y=None):
        delta_x, delta_y = _point(x, (0, 0)) if y is None else (_number(x), _number(y))
        self.x += delta_x
        self.y += delta_y

    def inflate(self, width, height):
        inflated = self.copy()
        inflated.inflate_ip(width, height)
        return inflated

    def scale_by(self, *args):
        scaled = self.copy()
        scaled.scale_by_ip(*args)
        return scaled

    def scale_by_ip(self, *args):
        if len(args) == 1:
            scale_x = _number(args[0], 1)
            scale_y = scale_x
        elif len(args) == 2:
            scale_x = _number(args[0], 1)
            scale_y = _number(args[1], 1)
        else:
            raise TypeError("scale_by expects scalar or (scale_x, scale_y).")
        old_center = self.center
        self.width *= scale_x
        self.height *= scale_y
        self.center = old_center
        return None

    def update(self, *args):
        self.x, self.y, self.width, self.height = _rect_parts_from_args(args)
        return None

    def clamp(self, other):
        clamped = self.copy()
        clamped.clamp_ip(other)
        return clamped

    def clamp_ip(self, other):
        outer = Rect(other)
        if self.width >= outer.width:
            self.centerx = outer.centerx
        elif self.left < outer.left:
            self.left = outer.left
        elif self.right > outer.right:
            self.right = outer.right

        if self.height >= outer.height:
            self.centery = outer.centery
        elif self.top < outer.top:
            self.top = outer.top
        elif self.bottom > outer.bottom:
            self.bottom = outer.bottom
        return None

    def clip(self, other):
        other_rect = Rect(other)
        left = max(self.left, other_rect.left)
        top = max(self.top, other_rect.top)
        right = min(self.right, other_rect.right)
        bottom = min(self.bottom, other_rect.bottom)
        if right <= left or bottom <= top:
            return Rect(left, top, 0, 0)
        return Rect(left, top, right - left, bottom - top)

    def clipline(self, *args):
        if self.width <= 0 or self.height <= 0:
            return ()
        x1, y1, x2, y2 = _line_points_from_args(args)
        delta_x = x2 - x1
        delta_y = y2 - y1
        start = 0
        end = 1

        for boundary_delta, boundary_distance in (
            (-delta_x, x1 - self.left),
            (delta_x, self.right - x1),
            (-delta_y, y1 - self.top),
            (delta_y, self.bottom - y1),
        ):
            if boundary_delta == 0:
                if boundary_distance < 0:
                    return ()
                continue

            ratio = boundary_distance / boundary_delta
            if boundary_delta < 0:
                if ratio > end:
                    return ()
                if ratio > start:
                    start = ratio
            else:
                if ratio < start:
                    return ()
                if ratio < end:
                    end = ratio

        return (
            _clipline_point(x1 + start * delta_x, y1 + start * delta_y),
            _clipline_point(x1 + end * delta_x, y1 + end * delta_y),
        )

    def union(self, other):
        other_rect = Rect(other)
        left = min(self.left, other_rect.left)
        top = min(self.top, other_rect.top)
        right = max(self.right, other_rect.right)
        bottom = max(self.bottom, other_rect.bottom)
        return Rect(left, top, right - left, bottom - top)

    def union_ip(self, other):
        self.update(self.union(other))
        return None

    def unionall(self, rects):
        unioned = self.copy()
        for rect in rects:
            unioned.union_ip(rect)
        return unioned

    def unionall_ip(self, rects):
        self.update(self.unionall(rects))
        return None

    def fit(self, other):
        outer = Rect(other)
        if self.width <= 0 or self.height <= 0 or outer.width <= 0 or outer.height <= 0:
            return Rect(outer.x, outer.y, 0, 0)
        scale = min(outer.width / self.width, outer.height / self.height)
        fitted = Rect(0, 0, self.width * scale, self.height * scale)
        fitted.center = outer.center
        return fitted

    def normalize(self):
        if self.width < 0:
            self.x += self.width
            self.width = -self.width
        if self.height < 0:
            self.y += self.height
            self.height = -self.height
        return None

    def collidepoint(self, *args):
        if self.width <= 0 or self.height <= 0:
            return False
        x, y = _point_from_args(args)
        return self.left <= x < self.right and self.top <= y < self.bottom

    def colliderect(self, other):
        other_rect = Rect(other)
        if self.width <= 0 or self.height <= 0:
            return False
        if other_rect.width <= 0 or other_rect.height <= 0:
            return False
        return not (
            self.right <= other_rect.left or
            self.left >= other_rect.right or
            self.bottom <= other_rect.top or
            self.top >= other_rect.bottom
        )

    def collidelist(self, rects):
        for index, rect in enumerate(rects):
            if self.colliderect(rect):
                return index
        return -1

    def collidelistall(self, rects):
        return [
            index
            for index, rect in enumerate(rects)
            if self.colliderect(rect)
        ]

    def collidedict(self, rect_dict, use_values=0):
        for key, value in rect_dict.items():
            rect = value if use_values else key
            if self.colliderect(rect):
                return (key, value)
        return None

    def collidedictall(self, rect_dict, use_values=0):
        return [
            (key, value)
            for key, value in rect_dict.items()
            if self.colliderect(value if use_values else key)
        ]

    def collideobjects(self, objects, key=None):
        for obj in objects:
            rect = key(obj) if key is not None else obj
            if self.colliderect(rect):
                return obj
        return None

    def collideobjectsall(self, objects, key=None):
        return [
            obj
            for obj in objects
            if self.colliderect(key(obj) if key is not None else obj)
        ]

    def contains(self, other):
        other_rect = Rect(other)
        return (
            self.left <= other_rect.left and
            self.right >= other_rect.right and
            self.top <= other_rect.top and
            self.bottom >= other_rect.bottom
        )

    def inflate_ip(self, width, height):
        width = _number(width)
        height = _number(height)
        self.x -= width / 2
        self.y -= height / 2
        self.width += width
        self.height += height

class ZRect(Rect):
    pass

class Actor:
    def __init__(self, image, pos=None, **kwargs):
        self._image = str(image)
        natural_width, natural_height = _asset_size(self.image)
        self._auto_width = "width" not in kwargs
        self._auto_height = "height" not in kwargs
        self.width = _number(kwargs.pop("width", natural_width), natural_width)
        self.height = _number(kwargs.pop("height", natural_height), natural_height)
        self.angle = _number(kwargs.pop("angle", 0), 0)
        self.visible = kwargs.pop("visible", True)
        self._anchor = ("center", "center")
        self.anchor = kwargs.pop("anchor", self._anchor)
        initial_pos = pos if pos is not None else kwargs.pop("pos", None)

        self.x = self._anchor_x()
        self.y = self._anchor_y()
        if initial_pos is not None:
            self.pos = initial_pos
        if "x" in kwargs or "y" in kwargs:
            self.x = _number(kwargs.pop("x", self.x), self.x)
            self.y = _number(kwargs.pop("y", self.y), self.y)

        for key, value in kwargs.items():
            setattr(self, key, value)

    @property
    def image(self):
        return self._image

    @image.setter
    def image(self, value):
        self._image = str(value)
        if getattr(self, "_auto_width", False) or getattr(self, "_auto_height", False):
            natural_width, natural_height = _asset_size(self._image)
            if getattr(self, "_auto_width", False):
                self.width = natural_width
            if getattr(self, "_auto_height", False):
                self.height = natural_height

    def _anchor_component(self, value, axis):
        try:
            numeric_value = float(value)
            return numeric_value
        except Exception:
            pass

        label = str(value).strip().lower()
        if axis == "x":
            if label == "left":
                return 0.0
            if label in ("center", "middle"):
                return self.width / 2
            if label == "right":
                return self.width
        else:
            if label == "top":
                return 0.0
            if label in ("center", "middle"):
                return self.height / 2
            if label == "bottom":
                return self.height
        return self.width / 2 if axis == "x" else self.height / 2

    def _anchor_x(self):
        return self._anchor_component(self._anchor[0], "x")

    def _anchor_y(self):
        return self._anchor_component(self._anchor[1], "y")

    @property
    def anchor(self):
        return self._anchor

    @anchor.setter
    def anchor(self, value):
        if isinstance(value, str):
            self._anchor = (value, value)
        else:
            try:
                self._anchor = (value[0], value[1])
            except Exception:
                self._anchor = ("center", "center")

    @property
    def pos(self):
        return (self.x, self.y)

    @pos.setter
    def pos(self, value):
        self.x = _number(value[0])
        self.y = _number(value[1])

    @property
    def left(self):
        return self.x - self._anchor_x()

    @left.setter
    def left(self, value):
        self.x = _number(value) + self._anchor_x()

    @property
    def right(self):
        return self.left + self.width

    @right.setter
    def right(self, value):
        self.x = _number(value) - self.width + self._anchor_x()

    @property
    def top(self):
        return self.y - self._anchor_y()

    @top.setter
    def top(self, value):
        self.y = _number(value) + self._anchor_y()

    @property
    def bottom(self):
        return self.top + self.height

    @bottom.setter
    def bottom(self, value):
        self.y = _number(value) - self.height + self._anchor_y()

    @property
    def center(self):
        return (self.left + self.width / 2, self.top + self.height / 2)

    @center.setter
    def center(self, value):
        x, y = _point(value, self.center)
        self.left = x - self.width / 2
        self.top = y - self.height / 2

    @property
    def centerx(self):
        return self.center[0]

    @centerx.setter
    def centerx(self, value):
        self.center = (value, self.centery)

    @property
    def centery(self):
        return self.center[1]

    @centery.setter
    def centery(self, value):
        self.center = (self.centerx, value)

    @property
    def w(self):
        return self.width

    @w.setter
    def w(self, value):
        self.width = _number(value, self.width)

    @property
    def h(self):
        return self.height

    @h.setter
    def h(self, value):
        self.height = _number(value, self.height)

    @property
    def size(self):
        return (self.width, self.height)

    @size.setter
    def size(self, value):
        self.width, self.height = _point(value, self.size)

    @property
    def topleft(self):
        return (self.left, self.top)

    @topleft.setter
    def topleft(self, value):
        self.left, self.top = _point(value, self.topleft)

    @property
    def topright(self):
        return (self.right, self.top)

    @topright.setter
    def topright(self, value):
        self.right, self.top = _point(value, self.topright)

    @property
    def bottomleft(self):
        return (self.left, self.bottom)

    @bottomleft.setter
    def bottomleft(self, value):
        self.left, self.bottom = _point(value, self.bottomleft)

    @property
    def bottomright(self):
        return (self.right, self.bottom)

    @bottomright.setter
    def bottomright(self, value):
        self.right, self.bottom = _point(value, self.bottomright)

    @property
    def midtop(self):
        return (self.centerx, self.top)

    @midtop.setter
    def midtop(self, value):
        self.centerx, self.top = _point(value, self.midtop)

    @property
    def midbottom(self):
        return (self.centerx, self.bottom)

    @midbottom.setter
    def midbottom(self, value):
        self.centerx, self.bottom = _point(value, self.midbottom)

    @property
    def midleft(self):
        return (self.left, self.centery)

    @midleft.setter
    def midleft(self, value):
        self.left, self.centery = _point(value, self.midleft)

    @property
    def midright(self):
        return (self.right, self.centery)

    @midright.setter
    def midright(self, value):
        self.right, self.centery = _point(value, self.midright)

    def _rect(self):
        return Rect(self.left, self.top, self.width, self.height)

    def _target_position(self, target):
        if hasattr(target, "pos"):
            return _point(target.pos, self.pos)
        if hasattr(target, "x") and hasattr(target, "y"):
            return _number(target.x), _number(target.y)
        return _point(target, self.pos)

    def draw(self):
        if self.visible:
            _bridge.drawActor(
                self.image,
                float(self.x),
                float(self.y),
                float(self.width),
                float(self.height),
                float(self.angle),
                float(self._anchor_x()),
                float(self._anchor_y()),
            )

    def collidepoint(self, *args):
        return self._rect().collidepoint(*args)

    def colliderect(self, other):
        return self._rect().colliderect(other)

    def collidelist(self, rects):
        return self._rect().collidelist(rects)

    def collidelistall(self, rects):
        return self._rect().collidelistall(rects)

    def collidedict(self, rect_dict, use_values=0):
        return self._rect().collidedict(rect_dict, use_values)

    def collidedictall(self, rect_dict, use_values=0):
        return self._rect().collidedictall(rect_dict, use_values)

    def collideobjects(self, objects, key=None):
        return self._rect().collideobjects(objects, key)

    def collideobjectsall(self, objects, key=None):
        return self._rect().collideobjectsall(objects, key)

    def clipline(self, *args):
        return self._rect().clipline(*args)

    def contains(self, other):
        return self._rect().contains(other)

    def distance_to(self, target):
        target_x, target_y = self._target_position(target)
        return math.hypot(target_x - self.x, target_y - self.y)

    def angle_to(self, target):
        target_x, target_y = self._target_position(target)
        return math.degrees(math.atan2(self.y - target_y, target_x - self.x))

class _Keyboard:
    def __getattr__(self, key):
        return bool(_bridge.isKeyDown(str(key)))

    def __getitem__(self, key):
        return bool(_bridge.isKeyDown(str(key)))

keyboard = _Keyboard()

class _Keys:
    BACKSPACE = "backspace"
    TAB = "tab"
    CLEAR = "clear"
    RETURN = "return"
    ENTER = "return"
    PAUSE = "pause"
    ESCAPE = "escape"
    SPACE = "space"
    EXCLAIM = "exclaim"
    QUOTEDBL = "quotedbl"
    HASH = "hash"
    DOLLAR = "dollar"
    AMPERSAND = "ampersand"
    QUOTE = "quote"
    LEFTPAREN = "leftparen"
    RIGHTPAREN = "rightparen"
    ASTERISK = "asterisk"
    PLUS = "plus"
    COMMA = "comma"
    MINUS = "minus"
    PERIOD = "period"
    SLASH = "slash"
    K_0 = "0"
    K_1 = "1"
    K_2 = "2"
    K_3 = "3"
    K_4 = "4"
    K_5 = "5"
    K_6 = "6"
    K_7 = "7"
    K_8 = "8"
    K_9 = "9"
    COLON = "colon"
    SEMICOLON = "semicolon"
    LESS = "less"
    EQUALS = "equals"
    GREATER = "greater"
    QUESTION = "question"
    AT = "at"
    LEFTBRACKET = "leftbracket"
    BACKSLASH = "backslash"
    RIGHTBRACKET = "rightbracket"
    CARET = "caret"
    UNDERSCORE = "underscore"
    BACKQUOTE = "backquote"
    A = "a"
    B = "b"
    C = "c"
    D = "d"
    E = "e"
    F = "f"
    G = "g"
    H = "h"
    I = "i"
    J = "j"
    K = "k"
    L = "l"
    M = "m"
    N = "n"
    O = "o"
    P = "p"
    Q = "q"
    R = "r"
    S = "s"
    T = "t"
    U = "u"
    V = "v"
    W = "w"
    X = "x"
    Y = "y"
    Z = "z"
    DELETE = "delete"
    LEFT = "left"
    RIGHT = "right"
    UP = "up"
    DOWN = "down"
    INSERT = "insert"
    HOME = "home"
    END = "end"
    PAGEUP = "pageup"
    PAGEDOWN = "pagedown"
    F1 = "f1"
    F2 = "f2"
    F3 = "f3"
    F4 = "f4"
    F5 = "f5"
    F6 = "f6"
    F7 = "f7"
    F8 = "f8"
    F9 = "f9"
    F10 = "f10"
    F11 = "f11"
    F12 = "f12"
    F13 = "f13"
    F14 = "f14"
    F15 = "f15"
    NUMLOCK = "numlock"
    CAPSLOCK = "capslock"
    SCROLLOCK = "scrolllock"
    RSHIFT = "rshift"
    LSHIFT = "lshift"
    RCTRL = "rctrl"
    LCTRL = "lctrl"
    RALT = "ralt"
    LALT = "lalt"
    RMETA = "rmeta"
    LMETA = "lmeta"
    LSUPER = "lmeta"
    RSUPER = "rmeta"
    MODE = "mode"
    MENU = "menu"
    KP0 = "kp0"
    KP1 = "kp1"
    KP2 = "kp2"
    KP3 = "kp3"
    KP4 = "kp4"
    KP5 = "kp5"
    KP6 = "kp6"
    KP7 = "kp7"
    KP8 = "kp8"
    KP9 = "kp9"
    KP_PERIOD = "kp_period"
    KP_DIVIDE = "kp_divide"
    KP_MULTIPLY = "kp_multiply"
    KP_MINUS = "kp_minus"
    KP_PLUS = "kp_plus"
    KP_ENTER = "kp_enter"
    KP_EQUALS = "kp_equals"

    def __getattr__(self, key):
        return key.lower()

keys = _Keys()

class _Mouse:
    LEFT = "left"
    MIDDLE = "middle"
    RIGHT = "right"
    WHEEL_UP = "wheel_up"
    WHEEL_DOWN = "wheel_down"

mouse = _Mouse()

class _KeyMods:
    LSHIFT = 1
    RSHIFT = 2
    SHIFT = LSHIFT | RSHIFT
    LCTRL = 4
    RCTRL = 8
    CTRL = LCTRL | RCTRL
    LALT = 16
    RALT = 32
    ALT = LALT | RALT
    LMETA = 64
    RMETA = 128
    META = LMETA | RMETA
    NUM = 256
    CAPS = 512
    MODE = 1024

keymods = _KeyMods()

class _ScreenDraw:
    def text(self, text, pos=(0, 0), color="white", fontsize=24, center=None, **_kwargs):
        if center is not None:
            pos = center
        _bridge.drawText(
            str(text),
            float(_number(pos[0])),
            float(_number(pos[1])),
            _normalize_color(color),
            float(_number(fontsize, 24)),
        )

    def textbox(self, text, rect, color="white", fontsize=24, **_kwargs):
        x, y, width, height = _rect_parts(rect)
        _bridge.drawText(
            str(text),
            float(x + width / 2),
            float(y + height / 2),
            _normalize_color(color),
            float(_number(fontsize, 24)),
        )

    def rect(self, rect, color, width=1):
        x, y, rect_width, rect_height = _rect_parts(rect)
        _bridge.drawRect(
            x,
            y,
            rect_width,
            rect_height,
            _normalize_color(color),
            False,
            float(_number(width, 1)),
        )

    def filled_rect(self, rect, color):
        x, y, width, height = _rect_parts(rect)
        _bridge.drawRect(x, y, width, height, _normalize_color(color), True)

    def line(self, start, end, color, width=1):
        _bridge.drawLine(
            float(_number(start[0])),
            float(_number(start[1])),
            float(_number(end[0])),
            float(_number(end[1])),
            _normalize_color(color),
            float(_number(width, 1)),
        )

    def circle(self, pos, radius, color, width=1):
        _bridge.drawCircle(
            float(_number(pos[0])),
            float(_number(pos[1])),
            float(_number(radius)),
            _normalize_color(color),
            False,
            float(_number(width, 1)),
        )

    def filled_circle(self, pos, radius, color):
        _bridge.drawCircle(
            float(_number(pos[0])),
            float(_number(pos[1])),
            float(_number(radius)),
            _normalize_color(color),
            True,
        )

class _Screen:
    def __init__(self):
        self.draw = _ScreenDraw()

    def blit(self, image, pos, **kwargs):
        width, height = _asset_size(image)
        angle = _number(kwargs.get("angle", 0), 0)
        _bridge.drawImage(
            str(image),
            float(_number(pos[0])),
            float(_number(pos[1])),
            float(width),
            float(height),
            float(angle),
        )

    def clear(self):
        _bridge.clear()

    def fill(self, color):
        _bridge.fill(_normalize_color(color))

    def bounds(self):
        return ZRect(
            (0, 0),
            (
                _number(_module_globals.get("WIDTH", 640), 640),
                _number(_module_globals.get("HEIGHT", 400), 400),
            ),
        )

screen = _Screen()

class _Clock:
    def schedule(self, function, delay):
        _scheduled.append({
            "function": function,
            "due": time.monotonic() + float(_number(delay, 0)),
            "interval": None,
        })

    def schedule_unique(self, function, delay):
        self.unschedule(function)
        _scheduled.append({
            "function": function,
            "due": time.monotonic() + float(_number(delay, 0)),
            "interval": None,
        })

    def schedule_interval(self, function, interval):
        _scheduled.append({
            "function": function,
            "due": time.monotonic() + float(_number(interval, 0)),
            "interval": float(_number(interval, 0)),
        })

    def unschedule(self, function):
        _scheduled[:] = [
            entry for entry in _scheduled
            if entry["function"] is not function
        ]

clock = _Clock()

def _tween_progress(tween, progress):
    progress = max(0.0, min(1.0, float(progress)))
    tween = str(tween or "linear")
    if tween == "accelerate":
        return progress * progress
    if tween == "decelerate":
        return 1 - ((1 - progress) * (1 - progress))
    if tween == "accel_decel":
        return (3 * progress * progress) - (2 * progress * progress * progress)
    return progress

def _interpolate_value(start, target, progress):
    if isinstance(start, (tuple, list)) and isinstance(target, (tuple, list)):
        size = min(len(start), len(target))
        return tuple(
            _interpolate_value(start[index], target[index], progress)
            for index in range(size)
        )
    try:
        return _number(start) + ((_number(target) - _number(start)) * progress)
    except Exception:
        return target if progress >= 1 else start

class Animation:
    def __init__(self, obj, tween="linear", duration=1, on_finished=None, **targets):
        self.object = obj
        self.tween = tween
        self.duration = max(0.0, float(_number(duration, 1)))
        self.on_finished = on_finished
        self.running = True
        self._started = time.monotonic()
        self._targets = dict(targets)
        self._starts = {
            name: getattr(obj, name)
            for name in self._targets
            if hasattr(obj, name)
        }

    def _apply(self, progress):
        eased = _tween_progress(self.tween, progress)
        for name, target in self._targets.items():
            start = self._starts.get(name, target)
            setattr(self.object, name, _interpolate_value(start, target, eased))

    def _step(self, now):
        if not self.running:
            return False
        progress = 1.0 if self.duration <= 0 else (now - self._started) / self.duration
        self._apply(progress)
        if progress >= 1:
            self.running = False
            if callable(self.on_finished):
                self.on_finished()
            return False
        return True

    def stop(self, complete=False):
        if complete:
            self._apply(1.0)
        self.running = False

def animate(obj, tween="linear", duration=1, on_finished=None, **targets):
    animation = Animation(
        obj,
        tween=tween,
        duration=duration,
        on_finished=on_finished,
        **targets,
    )
    _animations.append(animation)
    return animation

def _run_animations(now):
    for animation in list(_animations):
        if animation.running:
            animation._step(now)
        if not animation.running and animation in _animations:
            _animations.remove(animation)

class _Sound:
    def __init__(self, name):
        self.name = str(name)

    def play(self, loops=0, *_args, **_kwargs):
        _bridge.playSound(self.name)
        return None

    def stop(self):
        _bridge.stopSound(self.name)
        return None

    def get_length(self):
        return 0.0

class _SoundLibrary:
    def __getattr__(self, name):
        return _Sound(name)

    def __getitem__(self, name):
        return _Sound(name)

sounds = _SoundLibrary()

class _Music:
    def __init__(self):
        self._volume = 1.0
        self._playing = False
        self._queued = None

    def play(self, name):
        _bridge.playMusic(str(name), True)
        self._playing = True
        self._queued = None

    def play_once(self, name):
        _bridge.playMusic(str(name), False)
        self._playing = True
        self._queued = None

    def queue(self, name):
        self._queued = str(name)

    def pause(self):
        _bridge.pauseMusic()
        self._playing = False
        return None

    def unpause(self):
        _bridge.unpauseMusic()
        self._playing = True
        return None

    def set_volume(self, volume):
        self._volume = max(0.0, min(1.0, float(_number(volume, 1))))
        _bridge.setMusicVolume(self._volume)
        return None

    def get_volume(self):
        return self._volume

    def is_playing(self):
        return bool(self._playing)

    def fadeout(self, duration):
        _bridge.stopMusic()
        self._playing = False
        return None

    def stop(self):
        _bridge.stopMusic()
        self._playing = False
        self._queued = None
        return None

    def _handle_music_end(self):
        if self._queued:
            next_track = self._queued
            self._queued = None
            self.play_once(next_track)
        else:
            self._playing = False

music = _Music()

class _ToneSound:
    def __init__(self, pitch, duration):
        self.pitch = pitch
        self.duration = max(0.02, float(_number(duration, 0.2)))
        self.frequency = _tone_frequency(pitch)
        self._active_ids = []

    def play(self, *_args, **_kwargs):
        tone_id = int(_bridge.playTone(float(self.frequency), float(self.duration)))
        if tone_id:
            self._active_ids.append(tone_id)
        return None

    def stop(self):
        for tone_id in list(self._active_ids):
            _bridge.stopTone(int(tone_id))
        self._active_ids.clear()
        return None

    def get_length(self):
        return self.duration

class _Tone:
    def create(self, pitch, duration):
        return _ToneSound(pitch, duration)

    def play(self, pitch, duration):
        sound = self.create(pitch, duration)
        sound.play()
        return sound

tone = _Tone()

class _Image:
    def __init__(self, name):
        self.name = str(name)

    def get_width(self):
        return int(_asset_size(self.name)[0])

    def get_height(self):
        return int(_asset_size(self.name)[1])

    def get_size(self):
        width, height = _asset_size(self.name)
        return (int(width), int(height))

    def get_rect(self):
        width, height = self.get_size()
        return Rect((0, 0), (width, height))

class _ImageLibrary:
    def __getattr__(self, name):
        return _Image(name)

    def __getitem__(self, name):
        return _Image(name)

images = _ImageLibrary()

class _Pgzrun:
    def go(self):
        go()

pgzrun = _Pgzrun()

def _run_scheduled():
    now = time.monotonic()
    for entry in list(_scheduled):
        if now < entry["due"]:
            continue
        entry["function"]()
        if entry["interval"] is None:
            if entry in _scheduled:
                _scheduled.remove(entry)
        else:
            entry["due"] = now + entry["interval"]

def _handle_events():
    raw_events = _bridge.popEventsJson()
    if not raw_events:
        return

    for event in json.loads(raw_events):
        event_type = event.get("type")
        if event_type == "keydown":
            key = event.get("key")
            unicode = event.get("unicode", key if isinstance(key, str) and len(key) == 1 else "")
            mod = event.get("mod", 0)
            _call_optional_named(
                "on_key_down",
                {"key": key, "mod": mod, "unicode": unicode},
                (key, mod, unicode),
            )
        elif event_type == "keyup":
            key = event.get("key")
            mod = event.get("mod", 0)
            _call_optional_named(
                "on_key_up",
                {"key": key, "mod": mod},
                (key, mod),
            )
        elif event_type == "mousedown":
            pos = (event.get("x", 0), event.get("y", 0))
            button = event.get("button", "left")
            _call_optional_named(
                "on_mouse_down",
                {"pos": pos, "button": button},
                (pos, button),
            )
        elif event_type == "mouseup":
            pos = (event.get("x", 0), event.get("y", 0))
            button = event.get("button", "left")
            _call_optional_named(
                "on_mouse_up",
                {"pos": pos, "button": button},
                (pos, button),
            )
        elif event_type == "mousemove":
            pos = (event.get("x", 0), event.get("y", 0))
            rel = (event.get("relX", 0), event.get("relY", 0))
            buttons = event.get("buttons", [])
            _call_optional_named(
                "on_mouse_move",
                {"pos": pos, "rel": rel, "buttons": buttons},
                (pos, rel, buttons),
            )
        elif event_type == "musicended":
            music._handle_music_end()
            _call_optional("on_music_end")

def install_builtins():
    builtins.Actor = Actor
    builtins.Rect = Rect
    builtins.ZRect = ZRect
    builtins.screen = screen
    builtins.keyboard = keyboard
    builtins.keys = keys
    builtins.mouse = mouse
    builtins.keymods = keymods
    builtins.clock = clock
    builtins.Animation = Animation
    builtins.animate = animate
    builtins.tone = tone
    builtins.sounds = sounds
    builtins.music = music
    builtins.images = images
    builtins.pgzrun = pgzrun

def start(module_globals=None):
    global _module_globals, _last_tick
    if module_globals is not None:
        _module_globals = module_globals
    _last_tick = None
    install_builtins()
    _bridge.reset(
        float(_number(_module_globals.get("WIDTH", 640), 640)),
        float(_number(_module_globals.get("HEIGHT", 400), 400)),
    )
    _bridge.requestLoop()

def go():
    frame = inspect.currentframe()
    if frame is not None and frame.f_back is not None:
        start(frame.f_back.f_globals)
    else:
        start({})

def __classes_pgzero_start(module_globals):
    start(module_globals)

def __classes_pgzero_tick():
    global _last_tick
    now = time.monotonic()
    dt = 0 if _last_tick is None else min(now - _last_tick, 0.25)
    _last_tick = now
    _handle_events()
    _run_scheduled()
    _call_optional("update", dt)
    _run_animations(now)
    _call_optional("draw")

install_builtins()
`;

const artifactShim = `
from js import window
import io
import json

_bridge = window.__classesPythonIdeArtifacts

def emit(title, mime_type, data):
    _bridge.emit(str(title), str(mime_type), str(data))

def emit_html(title, html):
    emit(title, "text/html", html)

def emit_json(title, value):
    emit(title, "application/json", json.dumps(value, indent=2, default=str))

def emit_matplotlib_figure(fig=None, title="Matplotlib figure"):
    if fig is None:
        import matplotlib.pyplot as plt
        fig = plt.gcf()

    buffer = io.StringIO()
    fig.savefig(buffer, format="svg", bbox_inches="tight")
    emit(title, "image/svg+xml", buffer.getvalue())

def emit_matplotlib_figures():
    try:
        import matplotlib.pyplot as plt
    except Exception:
        return

    figure_numbers = list(plt.get_fignums())
    for figure_number in figure_numbers:
        figure = plt.figure(figure_number)
        emit_matplotlib_figure(figure, "Matplotlib figure {}".format(figure_number))

    if figure_numbers:
        plt.close("all")

def show_chart(chart, title="Chart"):
    if hasattr(chart, "to_html"):
        emit_html(title, chart.to_html())
        return

    if hasattr(chart, "to_json"):
        emit(title, "application/json", chart.to_json())
        return

    emit(title, "text/plain", chart)
`;

const pysynthShim = `
import base64
import io
import math
import wave
from _classes_artifacts import emit

_SAMPLE_RATE = 44100
_NOTE_OFFSETS = {
    "c": -9,
    "c#": -8,
    "db": -8,
    "d": -7,
    "d#": -6,
    "eb": -6,
    "e": -5,
    "f": -4,
    "f#": -3,
    "gb": -3,
    "g": -2,
    "g#": -1,
    "ab": -1,
    "a": 0,
    "a#": 1,
    "bb": 1,
    "b": 2,
}

def _note_frequency(note, transpose=0):
    note = str(note).strip().lower()
    if note in ("", "r", "rest", "pause"):
        return 0

    if len(note) >= 2 and note[1] in ("#", "b"):
        pitch = note[:2]
        octave_text = note[2:]
    else:
        pitch = note[:1]
        octave_text = note[1:]

    if pitch not in _NOTE_OFFSETS:
        raise ValueError("Unsupported note name: {}".format(note))

    octave = int(octave_text) if octave_text else 4
    semitone_distance = _NOTE_OFFSETS[pitch] + (octave - 4) * 12 + int(transpose)
    return 440.0 * (2 ** (semitone_distance / 12))

def _duration_seconds(duration, bpm):
    try:
        denominator = abs(float(duration))
    except Exception:
        denominator = 4
    if denominator <= 0:
        denominator = 4
    return (60.0 / float(bpm)) * (4.0 / denominator)

def _samples_for_note(note, duration, bpm, transpose=0, pause=0.02):
    seconds = _duration_seconds(duration, bpm)
    sample_count = max(1, int(_SAMPLE_RATE * seconds))
    frequency = _note_frequency(note, transpose)
    fade_count = min(int(_SAMPLE_RATE * 0.01), max(1, sample_count // 8))
    samples = bytearray()

    for index in range(sample_count):
        if frequency <= 0:
            value = 0
        else:
            envelope = 1.0
            if index < fade_count:
                envelope = index / fade_count
            elif index > sample_count - fade_count:
                envelope = max(0.0, (sample_count - index) / fade_count)
            value = int(32767 * 0.28 * envelope * math.sin(2 * math.pi * frequency * index / _SAMPLE_RATE))
        samples.extend(int(value).to_bytes(2, "little", signed=True))

    pause_count = max(0, int(_SAMPLE_RATE * float(pause)))
    samples.extend(b"\\x00\\x00" * pause_count)
    return bytes(samples)

def _render_wav(song, bpm=120, transpose=0, pause=0.02):
    data = bytearray()
    for item in song:
        if not item:
            continue
        note = item[0]
        duration = item[1] if len(item) > 1 else 4
        data.extend(_samples_for_note(note, duration, bpm, transpose, pause))

    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(_SAMPLE_RATE)
        wav_file.writeframes(bytes(data))

    return buffer.getvalue()

def make_wav(song, fn="pysynth_output.wav", bpm=120, transpose=0, pause=0.02, **_kwargs):
    wav_bytes = _render_wav(song, bpm=bpm, transpose=transpose, pause=pause)
    with open(fn, "wb") as output_file:
        output_file.write(wav_bytes)

    encoded = base64.b64encode(wav_bytes).decode("ascii")
    emit("PySynth: {}".format(fn), "audio/wav", encoded)
    print("Wrote {} with {} notes.".format(fn, len(song)))
    return fn
`;

const streamlitShim = `
from _classes_artifacts import emit_html, emit_json, emit_matplotlib_figure, emit_matplotlib_figures, show_chart

def _as_list(options):
    if isinstance(options, str):
        return [options]
    try:
        return list(options)
    except TypeError:
        return [options]

def _bounded_index(options, index):
    if not options:
        return 0
    try:
        numeric_index = int(index)
    except Exception:
        numeric_index = 0
    return max(0, min(len(options) - 1, numeric_index))

def _format_value(value):
    if value is None:
        return ""
    return str(value)

def write(*values, **_kwargs):
    print(*values)

def success(value="", **_kwargs):
    print("Success:", value)

def info(value="", **_kwargs):
    print("Info:", value)

def warning(value="", **_kwargs):
    print("Warning:", value)

def error(value="", **_kwargs):
    print("Error:", value)

def text(value=""):
    print(value)

def caption(value=""):
    print(value)

def title(value=""):
    print(value)

def header(value=""):
    print(value)

def subheader(value=""):
    print(value)

def markdown(value="", unsafe_allow_html=False, **_kwargs):
    if unsafe_allow_html:
        emit_html("Markdown", str(value))
    else:
        print(value)

def dataframe(value, **_kwargs):
    if hasattr(value, "to_html"):
        emit_html("Dataframe", value.to_html())
    else:
        print(value)

def table(value):
    dataframe(value)

def json(value, **_kwargs):
    emit_json("JSON", value)

def pyplot(fig=None, **_kwargs):
    if fig is None:
        emit_matplotlib_figures()
    else:
        emit_matplotlib_figure(fig)

def altair_chart(chart, **_kwargs):
    show_chart(chart, "Altair chart")

def line_chart(data, **_kwargs):
    import matplotlib.pyplot as plt
    figure = plt.figure(figsize=(7, 4))
    axis = figure.add_subplot(111)
    data.plot(ax=axis)
    emit_matplotlib_figure(figure, "Line chart")

def bar_chart(data, **_kwargs):
    import matplotlib.pyplot as plt
    figure = plt.figure(figsize=(7, 4))
    axis = figure.add_subplot(111)
    data.plot(kind="bar", ax=axis)
    emit_matplotlib_figure(figure, "Bar chart")

def selectbox(_label, options, index=0, **_kwargs):
    values = _as_list(options)
    if not values:
        return None
    return values[_bounded_index(values, index)]

def radio(_label, options, index=0, **_kwargs):
    return selectbox(_label, options, index=index, **_kwargs)

def multiselect(_label, options, default=None, **_kwargs):
    values = _as_list(options)
    if default is None:
        return []
    if isinstance(default, str) or not hasattr(default, "__iter__"):
        default_values = [default]
    else:
        default_values = list(default)
    return [value for value in default_values if value in values]

def slider(_label, min_value=0, max_value=100, value=None, step=None, **_kwargs):
    if value is not None:
        return value
    return min_value

def checkbox(_label, value=False, **_kwargs):
    return bool(value)

def toggle(_label, value=False, **_kwargs):
    return checkbox(_label, value=value, **_kwargs)

def number_input(_label, min_value=None, max_value=None, value=None, step=None, **_kwargs):
    if value is not None:
        return value
    if min_value is not None:
        return min_value
    return 0

def text_input(_label, value="", placeholder=None, **_kwargs):
    return str(value or "")

def metric(label, value, delta=None, **_kwargs):
    line = "{}: {}".format(label, _format_value(value))
    if delta is not None:
        line += " ({})".format(delta)
    print(line)

def download_button(*_args, **_kwargs):
    print("Download button requested. Use a deployed Streamlit app for real downloads.")
    return False

def set_page_config(**_kwargs):
    return None

def stop():
    raise SystemExit

def cache_data(function=None, **_kwargs):
    def decorator(inner):
        return inner
    return decorator(function) if function else decorator

cache_resource = cache_data

class _Spinner:
    def __init__(self, text=""):
        self.text = text

    def __enter__(self):
        if self.text:
            print(self.text)
        return self

    def __exit__(self, *_args):
        return False

def spinner(text=""):
    return _Spinner(text)

class _Container:
    def __init__(self, name="Container"):
        self.name = name

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def write(self, *values, **kwargs):
        write(*values, **kwargs)

    def text(self, *values, **kwargs):
        text(*values, **kwargs)

    def markdown(self, *values, **kwargs):
        markdown(*values, **kwargs)

    def dataframe(self, *values, **kwargs):
        dataframe(*values, **kwargs)

    def table(self, *values, **kwargs):
        table(*values, **kwargs)

    def pyplot(self, *values, **kwargs):
        pyplot(*values, **kwargs)

    def altair_chart(self, *values, **kwargs):
        altair_chart(*values, **kwargs)

    def line_chart(self, *values, **kwargs):
        line_chart(*values, **kwargs)

    def bar_chart(self, *values, **kwargs):
        bar_chart(*values, **kwargs)

    def selectbox(self, *values, **kwargs):
        return selectbox(*values, **kwargs)

    def radio(self, *values, **kwargs):
        return radio(*values, **kwargs)

    def multiselect(self, *values, **kwargs):
        return multiselect(*values, **kwargs)

    def slider(self, *values, **kwargs):
        return slider(*values, **kwargs)

    def checkbox(self, *values, **kwargs):
        return checkbox(*values, **kwargs)

    def toggle(self, *values, **kwargs):
        return toggle(*values, **kwargs)

    def number_input(self, *values, **kwargs):
        return number_input(*values, **kwargs)

    def text_input(self, *values, **kwargs):
        return text_input(*values, **kwargs)

    def metric(self, *values, **kwargs):
        metric(*values, **kwargs)

def columns(spec, **_kwargs):
    if isinstance(spec, int):
        count = spec
    else:
        count = len(_as_list(spec))
    return [_Container("Column {}".format(index + 1)) for index in range(max(1, count))]

def container(**_kwargs):
    return _Container()

def expander(label, expanded=False, **_kwargs):
    return _Container("Expander: {}".format(label))

def empty():
    return _Container("Empty")

sidebar = _Container("Sidebar")
`;

const kerasShim = `
import math
import types

try:
    import numpy as np
except Exception:
    np = None

__version__ = "classes-teaching-shim"

def _array(values):
    if np is None:
        return values
    try:
        return np.asarray(values, dtype=float)
    except Exception:
        return np.asarray(list(values), dtype=float)

def _sigmoid(values):
    if np is None:
        return 1 / (1 + math.exp(-float(values)))
    return 1 / (1 + np.exp(-values))

def _softmax(values):
    if np is None:
        return values
    shifted = values - np.max(values, axis=1, keepdims=True)
    exp_values = np.exp(shifted)
    return exp_values / np.sum(exp_values, axis=1, keepdims=True)

def _metric_name(metric):
    if isinstance(metric, str):
        return metric
    return getattr(metric, "__name__", str(metric))

def _history_series(start, epochs, floor=0.0):
    return [max(floor, round(start / (index + 1), 4)) for index in range(epochs)]

class History:
    def __init__(self, history):
        self.history = history

class Dense:
    def __init__(self, units, activation=None, input_shape=None, name=None, **kwargs):
        self.units = int(units)
        self.activation = activation
        self.input_shape = input_shape
        self.name = name or "dense"
        self.kwargs = kwargs

    def __repr__(self):
        activation = self.activation or "linear"
        return f"Dense(units={self.units}, activation={activation!r})"

class Flatten:
    def __init__(self, input_shape=None, name=None, **kwargs):
        self.input_shape = input_shape
        self.name = name or "flatten"
        self.kwargs = kwargs

    def __repr__(self):
        return "Flatten()"

class Dropout:
    def __init__(self, rate, name=None, **kwargs):
        self.rate = float(rate)
        self.name = name or "dropout"
        self.kwargs = kwargs

    def __repr__(self):
        return f"Dropout(rate={self.rate})"

class Conv2D:
    def __init__(self, filters, kernel_size, activation=None, input_shape=None, name=None, **kwargs):
        self.filters = int(filters)
        self.kernel_size = kernel_size
        self.activation = activation
        self.input_shape = input_shape
        self.name = name or "conv2d"
        self.kwargs = kwargs

    def __repr__(self):
        return f"Conv2D(filters={self.filters}, kernel_size={self.kernel_size!r})"

class MaxPooling2D:
    def __init__(self, pool_size=(2, 2), name=None, **kwargs):
        self.pool_size = pool_size
        self.name = name or "max_pooling2d"
        self.kwargs = kwargs

    def __repr__(self):
        return f"MaxPooling2D(pool_size={self.pool_size!r})"

class _Optimizer:
    def __init__(self, learning_rate=0.001, **kwargs):
        self.learning_rate = learning_rate
        self.kwargs = kwargs

class Adam(_Optimizer):
    pass

class SGD(_Optimizer):
    pass

class RMSprop(_Optimizer):
    pass

class Sequential:
    def __init__(self, layers=None, name="sequential", **_kwargs):
        self.layers = []
        self.name = name
        self.optimizer = None
        self.loss = None
        self.metrics = []
        self.compiled = False
        if layers:
            for layer in layers:
                self.add(layer)

    def add(self, layer):
        self.layers.append(layer)

    def compile(self, optimizer="adam", loss=None, metrics=None, **_kwargs):
        self.optimizer = optimizer
        self.loss = loss
        self.metrics = list(metrics or [])
        self.compiled = True

    @property
    def output_units(self):
        for layer in reversed(self.layers):
            if hasattr(layer, "units"):
                return max(1, int(layer.units))
            if hasattr(layer, "filters"):
                return max(1, int(layer.filters))
        return 1

    @property
    def output_activation(self):
        for layer in reversed(self.layers):
            if hasattr(layer, "activation"):
                return layer.activation
        return None

    def _feature_scores(self, x):
        data = _array(x)
        if np is None:
            return [0.0 for _entry in data]
        if data.ndim == 0:
            data = data.reshape(1, 1)
        elif data.ndim == 1:
            data = data.reshape(-1, 1)
        else:
            data = data.reshape((data.shape[0], -1))
        if data.shape[1] == 0:
            return np.zeros((data.shape[0],))
        scale = np.std(data) or 1.0
        return (np.mean(data, axis=1) - np.mean(data)) / scale

    def predict(self, x, **_kwargs):
        scores = self._feature_scores(x)
        units = self.output_units
        activation = self.output_activation
        if np is None:
            return scores
        if units == 1:
            result = scores.reshape(-1, 1)
            if activation == "sigmoid":
                return _sigmoid(result)
            if activation == "relu":
                return np.maximum(0, result)
            return result
        offsets = np.linspace(-0.4, 0.4, units)
        logits = scores.reshape(-1, 1) + offsets.reshape(1, -1)
        if activation == "softmax":
            return _softmax(logits)
        return logits

    def _loss_value(self, x, y=None):
        predictions = self.predict(x)
        if np is None or y is None:
            return 0.5
        target = _array(y)
        if target.ndim == 1 and predictions.ndim == 2 and predictions.shape[1] > 1:
            target = np.eye(predictions.shape[1])[target.astype(int) % predictions.shape[1]]
        if target.ndim == 1:
            target = target.reshape(-1, 1)
        rows = min(len(predictions), len(target))
        if rows == 0:
            return 0.5
        return float(np.mean((predictions[:rows] - target[:rows]) ** 2))

    def _accuracy_value(self, x, y):
        if np is None or y is None:
            return 0.0
        predictions = self.predict(x)
        target = _array(y)
        if predictions.ndim == 2 and predictions.shape[1] > 1:
            predicted_labels = np.argmax(predictions, axis=1)
            expected = target if target.ndim == 1 else np.argmax(target, axis=1)
            rows = min(len(predicted_labels), len(expected))
            return float(np.mean(predicted_labels[:rows] == expected[:rows])) if rows else 0.0
        predicted_labels = (predictions.reshape(-1) >= 0.5).astype(int)
        expected = target.reshape(-1).astype(int)
        rows = min(len(predicted_labels), len(expected))
        return float(np.mean(predicted_labels[:rows] == expected[:rows])) if rows else 0.0

    def fit(self, x, y=None, epochs=1, batch_size=None, validation_data=None, verbose=1, **_kwargs):
        epoch_count = max(1, int(epochs))
        base_loss = max(self._loss_value(x, y), 0.01)
        history = {"loss": _history_series(base_loss, epoch_count, 0.001)}
        metric_names = [_metric_name(metric) for metric in self.metrics]
        for metric_name in metric_names:
            if "acc" in metric_name:
                start = min(0.98, max(0.05, self._accuracy_value(x, y)))
                history[metric_name] = [round(min(0.99, start + index * 0.03), 4) for index in range(epoch_count)]
            elif "mae" in metric_name or "mean_absolute_error" in metric_name:
                history[metric_name] = _history_series(base_loss ** 0.5, epoch_count, 0.001)
        if validation_data:
            val_x, val_y = validation_data[:2]
            history["val_loss"] = _history_series(max(self._loss_value(val_x, val_y), 0.01) * 1.08, epoch_count, 0.001)
        if verbose:
            print(f"Teaching shim trained {self.name} for {epoch_count} epoch(s).")
            print("This is a lightweight browser simulation, not TensorFlow backpropagation.")
        return History(history)

    def evaluate(self, x, y=None, verbose=1, **_kwargs):
        loss = round(max(self._loss_value(x, y), 0.001), 4)
        metric_values = []
        for metric in self.metrics:
            metric_name = _metric_name(metric)
            if "acc" in metric_name:
                metric_values.append(round(self._accuracy_value(x, y), 4))
            elif "mae" in metric_name or "mean_absolute_error" in metric_name:
                metric_values.append(round(loss ** 0.5, 4))
            else:
                metric_values.append(loss)
        if verbose:
            print(f"loss: {loss}")
        return [loss, *metric_values] if metric_values else loss

    def summary(self, print_fn=print, **_kwargs):
        print_fn(f'Model: "{self.name}"')
        if not self.layers:
            print_fn("(no layers)")
            return None
        for index, layer in enumerate(self.layers, start=1):
            print_fn(f"{index}. {layer!r}")
        return None

def Input(shape=None, **_kwargs):
    return {"shape": shape}

def to_categorical(y, num_classes=None, dtype="float32"):
    values = _array(y).astype(int)
    if num_classes is None:
        num_classes = int(values.max()) + 1 if values.size else 0
    result = np.zeros((len(values), int(num_classes)), dtype=dtype)
    for index, value in enumerate(values):
        result[index, int(value) % int(num_classes)] = 1
    return result

def _synthetic_boston_housing():
    if np is None:
        return ([], []), ([], [])
    rows = 120
    features = np.linspace(0, 1, rows * 13).reshape(rows, 13)
    prices = 18 + features[:, 0] * 12 + features[:, 5] * 8 - features[:, 9] * 3
    return (features[:90], prices[:90]), (features[90:], prices[90:])

class _BostonHousing:
    @staticmethod
    def load_data(**_kwargs):
        return _synthetic_boston_housing()

class _Datasets:
    boston_housing = _BostonHousing()

class ImageDataGenerator:
    def __init__(self, rescale=None, validation_split=None, **kwargs):
        self.rescale = rescale
        self.validation_split = validation_split
        self.kwargs = kwargs

    def flow_from_directory(self, directory, target_size=(256, 256), batch_size=32, class_mode="categorical", subset=None, **_kwargs):
        return DirectoryIterator(directory, target_size, batch_size, class_mode, subset)

class DirectoryIterator:
    def __init__(self, directory, target_size, batch_size, class_mode, subset):
        self.directory = directory
        self.target_size = target_size
        self.batch_size = batch_size
        self.class_mode = class_mode
        self.subset = subset
        self.class_indices = {"class_0": 0, "class_1": 1}
        self.samples = batch_size

    def __len__(self):
        return 1

    def __iter__(self):
        return self

    def __next__(self):
        if np is None:
            raise StopIteration
        x = np.zeros((self.batch_size, *self.target_size, 3))
        y = np.zeros((self.batch_size, len(self.class_indices)))
        return x, y

layers = types.SimpleNamespace(
    Dense=Dense,
    Flatten=Flatten,
    Dropout=Dropout,
    Conv2D=Conv2D,
    MaxPooling2D=MaxPooling2D,
)
models = types.SimpleNamespace(Sequential=Sequential)
optimizers = types.SimpleNamespace(Adam=Adam, SGD=SGD, RMSprop=RMSprop)
datasets = _Datasets()
preprocessing = types.SimpleNamespace(image=types.SimpleNamespace(ImageDataGenerator=ImageDataGenerator))
utils = types.SimpleNamespace(to_categorical=to_categorical)
`;

function ensureProjectDirectory(pyodide: PyodideAPI) {
	if (!pyodide.FS.analyzePath(PROJECT_ROOT).exists) {
		pyodide.FS.mkdirTree(PROJECT_ROOT);
	}
}

function decodeBase64File(content: string) {
	const binary = atob(content);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}
	return bytes;
}

function ensureProjectFileDirectory(pyodide: PyodideAPI, fileName: string) {
	const parts = fileName.split("/");
	const folderParts = parts.slice(0, -1);
	if (!folderParts.length) return;

	const directory = `${PROJECT_ROOT}/${folderParts.join("/")}`;
	if (!pyodide.FS.analyzePath(directory).exists) {
		pyodide.FS.mkdirTree(directory);
	}
}

function writeProjectFile(pyodide: PyodideAPI, file: PythonIdeFile) {
	ensureProjectFileDirectory(pyodide, file.name);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/${file.name}`,
		file.encoding === "base64"
			? decodeBase64File(file.content)
			: file.content
	);
}

function syncProjectFiles(pyodide: PyodideAPI, files: PythonIdeFile[]) {
	const currentFileNames = new Set(files.map(file => file.name));

	for (const staleFileName of lastProjectFileNames) {
		if (currentFileNames.has(staleFileName)) continue;
		safeUnlink(pyodide, `${PROJECT_ROOT}/${staleFileName}`);
	}

	for (const file of files) {
		writeProjectFile(pyodide, file);
	}

	lastProjectFileNames = currentFileNames;
}

async function captureProjectTextFiles(pyodide: PyodideAPI) {
	const snapshot = await pyodide.runPythonAsync(`
import json
from pathlib import Path

__classes_project_root = Path(${escapePythonString(PROJECT_ROOT)})
__classes_reserved_files = {
    "_classes_artifacts.py",
    "_classes_keras.py",
    "_classes_pgzero.py",
    "pgzrun.py",
    "pygame.py",
    "pysynth.py",
    "streamlit.py",
    "turtle.py",
    "zrect.py",
}
__classes_reserved_dirs = {"__pycache__", "keras", "pgzero", "tensorflow"}
__classes_text_suffixes = {".csv", ".json", ".md", ".py", ".svg", ".txt"}
__classes_files = []

for __classes_path in sorted(__classes_project_root.rglob("*")):
    if not __classes_path.is_file():
        continue
    __classes_rel = __classes_path.relative_to(__classes_project_root).as_posix()
    __classes_parts = __classes_rel.split("/")
    if __classes_rel in __classes_reserved_files:
        continue
    if any(__classes_part in __classes_reserved_dirs for __classes_part in __classes_parts):
        continue
    if __classes_path.suffix.lower() not in __classes_text_suffixes:
        continue
    try:
        __classes_content = __classes_path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        continue
    __classes_files.append({
        "name": __classes_rel,
        "content": __classes_content,
        "encoding": "text",
    })

json.dumps(__classes_files)
`);
	const files = JSON.parse(String(snapshot)) as PythonIdeFile[];
	return files.filter(
		file =>
			isValidPythonFileName(file.name) &&
			isPythonIdeTextFile(file.name) &&
			file.encoding === "text"
	);
}

function importedTopLevelModulesFromLine(line: string) {
	const trimmed = line.trim();
	const fromMatch = trimmed.match(FROM_IMPORT_MODULE_RE);
	if (fromMatch) {
		return [fromMatch[1].split(PYTHON_MODULE_SEPARATOR_RE)[0]].filter(
			moduleName => PYTHON_IDENTIFIER_RE.test(moduleName)
		);
	}

	if (!trimmed.startsWith(PYTHON_IMPORT_KEYWORD)) return [];
	const importWhitespace = trimmed.charAt(PYTHON_IMPORT_KEYWORD.length);
	if (importWhitespace !== " " && importWhitespace !== "\t") return [];

	return trimmed
		.slice(PYTHON_IMPORT_KEYWORD.length)
		.split("#")[0]
		.split(PYTHON_IMPORT_SEPARATOR_RE)
		.map(
			specifier =>
				specifier
					.split(PYTHON_IMPORT_ALIAS_RE)[0]
					.trim()
					.split(PYTHON_MODULE_SEPARATOR_RE)[0]
		)
		.filter(moduleName => PYTHON_IDENTIFIER_RE.test(moduleName));
}

export function pythonIdeImportedTopLevelModules(files: PythonIdeFile[]) {
	const modules = new Set<string>();

	for (const line of files
		.filter(file => isPythonIdePythonFile(file.name))
		.map(file => file.content)
		.join("\n")
		.split("\n")) {
		for (const moduleName of importedTopLevelModulesFromLine(line))
			modules.add(moduleName);
	}

	return modules;
}

function packageScanModules(files: PythonIdeFile[]) {
	const pythonFiles = files.filter(file => isPythonIdePythonFile(file.name));
	const localModules = new Set([
		"_classes_pgzero",
		"_classes_artifacts",
		...BROWSER_SHIM_MODULES,
		"pgzero",
		"pgzrun",
		"pygame",
		"turtle",
		"zrect",
		...pythonIdeProjectModuleNames(pythonFiles)
	]);

	return [...pythonIdeImportedTopLevelModules(pythonFiles)]
		.filter(
			moduleName =>
				!localModules.has(moduleName) &&
				!MICROPIP_PACKAGES.has(moduleName) &&
				!loadedPyodideImportModules.has(moduleName)
		)
		.sort();
}

async function loadPyodideImportPackages(
	pyodide: PyodideAPI,
	files: PythonIdeFile[]
) {
	const modules = packageScanModules(files);
	if (!modules.length) return;

	await pyodide.loadPackagesFromImports(
		modules.map(moduleName => `import ${moduleName}`).join("\n")
	);
	for (const moduleName of modules)
		loadedPyodideImportModules.add(moduleName);
}

async function installMicropipPackages(
	pyodide: PyodideAPI,
	modules: Set<string>,
	onOutput: RunPythonProjectOptions["onOutput"]
) {
	const packages = [...modules]
		.map(moduleName => MICROPIP_PACKAGES.get(moduleName))
		.filter(
			(packageName): packageName is string =>
				!!packageName && !installedMicropipPackages.has(packageName)
		);

	if (!packages.length) return;

	if (!pyodide.loadPackage) {
		throw new Error(
			`Python package installer is unavailable; cannot install ${packages.join(", ")}.`
		);
	}

	onOutput("system", `Loading Python packages: ${packages.join(", ")}`);
	if (!micropipLoaded) {
		await pyodide.loadPackage("micropip");
		micropipLoaded = true;
	}
	await pyodide.runPythonAsync(`
import micropip
await micropip.install(__import__("json").loads(${escapePythonString(JSON.stringify(packages))}))
`);
	for (const packageName of packages)
		installedMicropipPackages.add(packageName);
}

async function loadBrowserShimDependencies(
	pyodide: PyodideAPI,
	modules: Set<string>,
	onOutput: RunPythonProjectOptions["onOutput"]
) {
	if (!modules.has("tensorflow") && !modules.has("keras")) return;
	if (!pyodide.loadPackage) return;
	if (loadedBrowserShimPackages.has("numpy")) return;

	onOutput("system", "Loading Python packages: numpy");
	await pyodide.loadPackage("numpy");
	loadedBrowserShimPackages.add("numpy");
}

function warnForBrowserLimitedLibraries(
	modules: Set<string>,
	onOutput: RunPythonProjectOptions["onOutput"]
) {
	if (modules.has("streamlit")) {
		onOutput(
			"system",
			"Streamlit is running through a browser teaching shim: display calls and common dashboard widgets render here, but a full Streamlit server still needs local Python or deployment."
		);
	}

	if (modules.has("tensorflow") || modules.has("keras")) {
		onOutput(
			"system",
			"TensorFlow/Keras is running through a lightweight browser teaching shim: Sequential, common layers, fit/evaluate/predict, simple datasets, and ImageDataGenerator imports work for course demos, but real neural-network training still belongs in Colab or local Python."
		);
	}
}

function safeUnlink(pyodide: PyodideAPI, path: string) {
	if (!pyodide.FS.unlink || !pyodide.FS.analyzePath(path).exists) return;
	pyodide.FS.unlink(path);
}

function ensureDirectory(pyodide: PyodideAPI, path: string) {
	if (!pyodide.FS.analyzePath(path).exists) {
		pyodide.FS.mkdirTree(path);
	}
}

function writeKerasPackage(pyodide: PyodideAPI) {
	pyodide.FS.writeFile(`${PROJECT_ROOT}/_classes_keras.py`, kerasShim);
	safeUnlink(pyodide, `${PROJECT_ROOT}/keras.py`);
	ensureDirectory(pyodide, `${PROJECT_ROOT}/keras`);
	ensureDirectory(pyodide, `${PROJECT_ROOT}/keras/datasets`);
	ensureDirectory(pyodide, `${PROJECT_ROOT}/keras/preprocessing`);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/keras/__init__.py`,
		[
			"from _classes_keras import *",
			"from _classes_keras import datasets, layers, models, optimizers, preprocessing, utils",
			""
		].join("\n")
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/keras/layers.py`,
		"from _classes_keras import Conv2D, Dense, Dropout, Flatten, MaxPooling2D\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/keras/models.py`,
		"from _classes_keras import Sequential\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/keras/optimizers.py`,
		"from _classes_keras import Adam, RMSprop, SGD\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/keras/utils.py`,
		"from _classes_keras import to_categorical\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/keras/datasets/__init__.py`,
		"from _classes_keras import datasets\nboston_housing = datasets.boston_housing\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/keras/datasets/boston_housing.py`,
		"from _classes_keras import datasets\nload_data = datasets.boston_housing.load_data\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/keras/preprocessing/__init__.py`,
		"from _classes_keras import preprocessing\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/keras/preprocessing/image.py`,
		"from _classes_keras import DirectoryIterator, ImageDataGenerator\n"
	);
}

function writeTensorFlowPackage(pyodide: PyodideAPI) {
	safeUnlink(pyodide, `${PROJECT_ROOT}/tensorflow/keras.py`);
	ensureDirectory(pyodide, `${PROJECT_ROOT}/tensorflow`);
	ensureDirectory(pyodide, `${PROJECT_ROOT}/tensorflow/keras`);
	ensureDirectory(pyodide, `${PROJECT_ROOT}/tensorflow/keras/datasets`);
	ensureDirectory(pyodide, `${PROJECT_ROOT}/tensorflow/keras/preprocessing`);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/__init__.py`,
		[
			"from . import keras",
			"__version__ = 'classes-teaching-shim'",
			""
		].join("\n")
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/keras/__init__.py`,
		[
			"from keras import *",
			"from keras import datasets, layers, models, optimizers, preprocessing, utils",
			""
		].join("\n")
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/keras/layers.py`,
		"from keras.layers import *\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/keras/models.py`,
		"from keras.models import *\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/keras/optimizers.py`,
		"from keras.optimizers import *\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/keras/utils.py`,
		"from keras.utils import *\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/keras/datasets/__init__.py`,
		"from keras.datasets import *\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/keras/datasets/boston_housing.py`,
		"from keras.datasets.boston_housing import *\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/keras/preprocessing/__init__.py`,
		"from keras.preprocessing import *\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/tensorflow/keras/preprocessing/image.py`,
		"from keras.preprocessing.image import *\n"
	);
}

function writeRuntimeShims(pyodide: PyodideAPI) {
	pyodide.FS.writeFile(`${PROJECT_ROOT}/turtle.py`, turtleShim);
	pyodide.FS.writeFile(`${PROJECT_ROOT}/_classes_artifacts.py`, artifactShim);
	pyodide.FS.writeFile(`${PROJECT_ROOT}/pysynth.py`, pysynthShim);
	pyodide.FS.writeFile(`${PROJECT_ROOT}/streamlit.py`, streamlitShim);
	writeKerasPackage(pyodide);
	pyodide.FS.writeFile(`${PROJECT_ROOT}/_classes_pgzero.py`, pgzeroShim);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/pgzrun.py`,
		"from _classes_pgzero import go\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/zrect.py`,
		"from _classes_pgzero import ZRect, Rect\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/pygame.py`,
		"from _classes_pgzero import Rect\n"
	);

	if (!pyodide.FS.analyzePath(`${PROJECT_ROOT}/pgzero`).exists) {
		pyodide.FS.mkdirTree(`${PROJECT_ROOT}/pgzero`);
	}
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/pgzero/__init__.py`,
		"from _classes_pgzero import *\n"
	);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/pgzero/builtins.py`,
		"from _classes_pgzero import *\n"
	);

	writeTensorFlowPackage(pyodide);
}

export async function runPythonProject(options: RunPythonProjectOptions) {
	const pyodide = await loadRuntime();
	throwIfRunStopped(options);
	releaseRuntimeCallbackRegistries(pyodide);
	clearRuntimeShimModules(pyodide);
	throwIfRunStopped(options);
	window.__classesPythonIdeTurtle = options.turtleBridge;
	window.__classesPythonIdeGame = options.gameBridge;
	window.__classesPythonIdeArtifacts = {
		emit(title: string, mimeType: string, data: string) {
			options.onArtifact({ title, mimeType, data });
		}
	};
	options.gameBridge.stopLoop();
	if (options.mode === "pgzero") {
		options.gameBridge.reset();
	} else {
		options.turtleBridge.reset();
	}

	if (pyodide.setStdout) {
		pyodide.setStdout({
			batched: text => options.onOutput("stdout", text)
		});
	}
	if (pyodide.setStderr) {
		pyodide.setStderr({
			batched: text => options.onOutput("stderr", text)
		});
	}

	ensureProjectDirectory(pyodide);
	const importedModules = pythonIdeImportedTopLevelModules(options.files);
	const projectModuleNames = pythonIdeProjectModuleNames([
		...options.files,
		...[...lastProjectFileNames].map(name => ({ name }))
	]);
	warnForBrowserLimitedLibraries(importedModules, options.onOutput);

	syncProjectFiles(pyodide, options.files);
	writeRuntimeShims(pyodide);

	const activeFile = getPythonIdeRunnableFile(options);
	if (!activeFile)
		throw new Error("Project does not have a runnable Python file.");

	await loadPyodideImportPackages(pyodide, options.files);
	throwIfRunStopped(options);
	await loadBrowserShimDependencies(
		pyodide,
		importedModules,
		options.onOutput
	);
	throwIfRunStopped(options);
	await installMicropipPackages(pyodide, importedModules, options.onOutput);
	throwIfRunStopped(options);

	pyodide.runPython(`
import os
import sys
os.chdir(${escapePythonString(PROJECT_ROOT)})
if ${escapePythonString(PROJECT_ROOT)} not in sys.path:
    sys.path.insert(0, ${escapePythonString(PROJECT_ROOT)})
for __classes_module_name in __import__("json").loads(${escapePythonString(JSON.stringify(projectModuleNames))}):
    sys.modules.pop(__classes_module_name, None)
${createInputBootstrap(options.inputText, options.mode)}
if ${options.mode === "pgzero" ? "True" : "False"}:
    import _classes_pgzero
    _classes_pgzero.install_builtins()
if ${options.mode === "data" || importedModules.has("matplotlib") ? "True" : "False"}:
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
`);
	throwIfRunStopped(options);

	await pyodide.runPythonAsync(`
import __main__
__main__.__dict__["__name__"] = "__main__"
exec(
    __classes_compile_student_source(
        open(${escapePythonString(activeFile.name)}, "r", encoding="utf-8").read(),
        ${escapePythonString(activeFile.name)},
    ),
    __main__.__dict__,
	)
	`);
	throwIfRunStopped(options);

	await pyodide.runPythonAsync(`
try:
    from _classes_artifacts import emit_matplotlib_figures
    emit_matplotlib_figures()
except Exception as error:
    import sys
    print("Could not render chart artifact: {}".format(error), file=sys.stderr)
`);
	throwIfRunStopped(options);

	options.onProjectFilesUpdate?.(await captureProjectTextFiles(pyodide));
	throwIfRunStopped(options);

	if (options.mode === "pgzero") {
		await pyodide.runPythonAsync(`
	import __main__
	import _classes_pgzero
	_classes_pgzero.__classes_pgzero_start(__main__.__dict__)
	`);
		throwIfRunStopped(options);
		options.gameBridge.consumeLoopRequest();
		options.gameBridge.startLoop(async () => {
			await pyodide.runPythonAsync(`
	import _classes_pgzero
	_classes_pgzero.__classes_pgzero_tick()
	`);
		});
	}
}
