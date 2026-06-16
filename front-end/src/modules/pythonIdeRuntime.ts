import type { PythonIdeFile } from "@/modules/pythonIde";

const PYODIDE_VERSION = "314.0.0";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_SCRIPT_SRC = `${PYODIDE_INDEX_URL}pyodide.js`;
const PROJECT_ROOT = "/home/pyodide/classes_project";
const PYTHON_EXTENSION_RE = /\.py$/;
const IMPORT_MODULE_RE = /^import\s+([A-Za-z_]\w*)/;
const FROM_IMPORT_MODULE_RE = /^from\s+([A-Za-z_]\w*)\s+import\b/;

interface PyodideAPI {
	FS: {
		analyzePath: (path: string) => { exists: boolean };
		mkdirTree: (path: string) => void;
		writeFile: (path: string, data: string) => void;
	};
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
		loadPyodide?: (options: LoadPyodideOptions) => Promise<PyodideAPI>;
		__classesPythonIdeTurtle?: TurtleBridge;
	}
}

export interface TurtleBridge {
	reset: () => void;
	clear: () => void;
	bgcolor: (color: string) => void;
	forward: (distance: number) => void;
	right: (degrees: number) => void;
	left: (degrees: number) => void;
	setheading: (degrees: number) => void;
	heading: () => number;
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
	write: (text: string) => void;
	registerKey: (key: string, callback: () => void) => void;
	listen: () => void;
}

export interface RunPythonProjectOptions {
	files: PythonIdeFile[];
	activeFileName: string;
	inputText: string;
	turtleBridge: TurtleBridge;
	onOutput: (kind: "stdout" | "stderr" | "system", text: string) => void;
}

let pyodidePromise: Promise<PyodideAPI> | null = null;

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
	if (typeof document === "undefined") return;

	for (const [rel, href] of [
		["dns-prefetch", "//cdn.jsdelivr.net"],
		["preconnect", "https://cdn.jsdelivr.net"]
	]) {
		const existing = document.querySelector(
			`link[rel="${rel}"][href="${href}"]`
		);
		if (existing) continue;
		const link = document.createElement("link");
		link.rel = rel;
		link.href = href;
		if (rel === "preconnect") link.crossOrigin = "anonymous";
		document.head.append(link);
	}
}

async function loadRuntime() {
	if (typeof window === "undefined" || typeof document === "undefined") {
		throw new TypeError("Python runtime is only available in the browser.");
	}

	if (!pyodidePromise) {
		warmPythonRuntime();
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

function escapePythonString(value: string) {
	return JSON.stringify(value);
}

function createInputBootstrap(inputText: string) {
	const inputLines = inputText.replaceAll("\r\n", "\n").split("\n");
	return `
import builtins
__classes_input_values = iter(__import__("json").loads(${escapePythonString(JSON.stringify(inputLines))}))
def __classes_input(prompt=""):
    print(prompt, end="")
    try:
        return next(__classes_input_values)
    except StopIteration:
        raise EOFError("No more input values are available in the input panel.")
builtins.input = __classes_input
`;
}

const turtleShim = `
from js import window

_bridge = window.__classesPythonIdeTurtle

class _Screen:
    def bgcolor(self, color):
        _bridge.bgcolor(str(color))

    def clear(self):
        _bridge.clear()

    def reset(self):
        _bridge.reset()

    def listen(self):
        _bridge.listen()

    def onkey(self, function, key):
        _bridge.registerKey(str(key), function)

    def onkeypress(self, function, key=None):
        _bridge.registerKey(str(key or ""), function)

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

_screen = _Screen()

def Screen():
    return _screen

class Turtle:
    def __init__(self, *_args, **_kwargs):
        return None

    def forward(self, distance):
        _bridge.forward(float(distance))

    def fd(self, distance):
        self.forward(distance)

    def backward(self, distance):
        _bridge.forward(-float(distance))

    def back(self, distance):
        self.backward(distance)

    def bk(self, distance):
        self.backward(distance)

    def right(self, degrees):
        _bridge.right(float(degrees))

    def rt(self, degrees):
        self.right(degrees)

    def left(self, degrees):
        _bridge.left(float(degrees))

    def lt(self, degrees):
        self.left(degrees)

    def setheading(self, degrees):
        _bridge.setheading(float(degrees))

    def seth(self, degrees):
        self.setheading(degrees)

    def heading(self):
        return _bridge.heading()

    def goto(self, x, y=None):
        if y is None:
            x, y = x
        _bridge.goto(float(x), float(y))

    def setpos(self, x, y=None):
        self.goto(x, y)

    def setposition(self, x, y=None):
        self.goto(x, y)

    def home(self):
        _bridge.home()

    def penup(self):
        _bridge.penup()

    def pu(self):
        self.penup()

    def up(self):
        self.penup()

    def pendown(self):
        _bridge.pendown()

    def pd(self):
        self.pendown()

    def down(self):
        self.pendown()

    def isdown(self):
        return _bridge.isdown()

    def pensize(self, width=None):
        if width is None:
            return None
        _bridge.pensize(float(width))

    def width(self, width=None):
        self.pensize(width)

    def pencolor(self, color=None):
        if color is None:
            return None
        _bridge.pencolor(str(color))

    def fillcolor(self, color=None):
        if color is None:
            return None
        _bridge.fillcolor(str(color))

    def color(self, *colors):
        if len(colors) == 1:
            _bridge.color(str(colors[0]))
        elif len(colors) >= 2:
            _bridge.color(str(colors[0]), str(colors[1]))

    def circle(self, radius, *_args, **_kwargs):
        _bridge.circle(float(radius))

    def dot(self, size=8, color=None):
        if color is None:
            _bridge.dot(float(size))
        else:
            _bridge.dot(float(size), str(color))

    def write(self, text, *_args, **_kwargs):
        _bridge.write(str(text))

    def speed(self, *_args):
        return None

    def shape(self, *_args):
        return None

    def hideturtle(self):
        return None

    def showturtle(self):
        return None

    def begin_fill(self):
        return None

    def end_fill(self):
        return None

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
def goto(x, y=None): _default.goto(x, y)
def setpos(x, y=None): _default.goto(x, y)
def setposition(x, y=None): _default.goto(x, y)
def home(): _default.home()
def penup(): _default.penup()
def pu(): _default.penup()
def up(): _default.penup()
def pendown(): _default.pendown()
def pd(): _default.pendown()
def down(): _default.pendown()
def pensize(width=None): _default.pensize(width)
def width(width=None): _default.pensize(width)
def pencolor(color=None): _default.pencolor(color)
def fillcolor(color=None): _default.fillcolor(color)
def color(*colors): _default.color(*colors)
def circle(radius, *args, **kwargs): _default.circle(radius, *args, **kwargs)
def dot(size=8, color=None): _default.dot(size, color)
def write(text, *args, **kwargs): _default.write(text, *args, **kwargs)
def listen(): _screen.listen()
def onkey(function, key): _screen.onkey(function, key)
def onkeypress(function, key=None): _screen.onkeypress(function, key)
def mainloop(): _screen.mainloop()
def done(): _screen.mainloop()
`;

function ensureProjectDirectory(pyodide: PyodideAPI) {
	if (!pyodide.FS.analyzePath(PROJECT_ROOT).exists) {
		pyodide.FS.mkdirTree(PROJECT_ROOT);
	}
}

function packageScanCode(files: PythonIdeFile[]) {
	const localModules = new Set([
		"turtle",
		...files.map(file => file.name.replace(PYTHON_EXTENSION_RE, ""))
	]);

	return files
		.map(file => file.content)
		.join("\n")
		.split("\n")
		.filter(line => {
			const trimmed = line.trim();
			const importMatch = trimmed.match(IMPORT_MODULE_RE);
			const fromMatch = trimmed.match(FROM_IMPORT_MODULE_RE);
			const moduleName = importMatch?.[1] ?? fromMatch?.[1];
			return !moduleName || !localModules.has(moduleName);
		})
		.join("\n");
}

export async function runPythonProject(options: RunPythonProjectOptions) {
	const pyodide = await loadRuntime();
	window.__classesPythonIdeTurtle = options.turtleBridge;
	options.turtleBridge.reset();

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
	for (const file of options.files) {
		pyodide.FS.writeFile(`${PROJECT_ROOT}/${file.name}`, file.content);
	}
	pyodide.FS.writeFile(`${PROJECT_ROOT}/turtle.py`, turtleShim);

	const activeFile =
		options.files.find(file => file.name === options.activeFileName) ??
		options.files[0];
	if (!activeFile)
		throw new Error("Project does not have a runnable Python file.");

	await pyodide.loadPackagesFromImports(packageScanCode(options.files));

	pyodide.runPython(`
import os
import sys
os.chdir(${escapePythonString(PROJECT_ROOT)})
if ${escapePythonString(PROJECT_ROOT)} not in sys.path:
    sys.path.insert(0, ${escapePythonString(PROJECT_ROOT)})
${createInputBootstrap(options.inputText)}
`);

	await pyodide.runPythonAsync(`
__name__ = "__main__"
exec(compile(open(${escapePythonString(activeFile.name)}, "r", encoding="utf-8").read(), ${escapePythonString(activeFile.name)}, "exec"), globals())
`);
}
