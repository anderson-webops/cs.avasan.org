import type { PythonIdeFile } from "@/modules/pythonIde";
import {
	isPythonIdeTextFile,
	isValidPythonFileName
} from "@/modules/pythonIde";
import {
	PYODIDE_INDEX_URL,
	PYODIDE_MODULE_SRC
} from "@/modules/pythonIdeRuntimeHints";
import { pythonIdeImportedTopLevelModules } from "@/modules/pythonImportScanner";
import { pythonStandardLibraryModules } from "@/modules/pythonStandardLibraryModules";

const PROJECT_ROOT = "/home/pyodide/classes_project";
const PYTHON_EXTENSION_RE = /\.py$/i;

interface PyodideAPI {
	FS: {
		analyzePath: (path: string) => { exists: boolean };
		mkdirTree: (path: string) => void;
		unlink?: (path: string) => void;
		writeFile: (path: string, data: string | Uint8Array) => void;
	};
	loadPackagesFromImports: (code: string) => Promise<void>;
	runPython: (code: string) => unknown;
	runPythonAsync: (code: string) => Promise<unknown>;
	setStderr?: (options: { batched: (text: string) => void }) => void;
	setStdout?: (options: { batched: (text: string) => void }) => void;
}

interface PyodideModule {
	loadPyodide: (options: { indexURL: string }) => Promise<PyodideAPI>;
}

interface PlainPythonRunRequest {
	type: "run";
	id: number;
	activeFileName: string;
	files: PythonIdeFile[];
	inputText: string;
}

type PlainPythonWorkerRequest = PlainPythonRunRequest;

interface PlainPythonOutputMessage {
	type: "output";
	id: number;
	kind: "stdout" | "stderr" | "system";
	text: string;
}

interface PlainPythonDoneMessage {
	type: "done";
	id: number;
	files: PythonIdeFile[];
}

interface PlainPythonErrorMessage {
	type: "error";
	id: number;
	message: string;
}

type PlainPythonWorkerMessage =
	| PlainPythonDoneMessage
	| PlainPythonErrorMessage
	| PlainPythonOutputMessage;

let pyodidePromise: Promise<PyodideAPI> | null = null;
let activeRunID: number | null = null;
let lastProjectFileNames = new Set<string>();
const loadedPlainPythonImportModules = new Set<string>();

function isActiveRun(id: number) {
	return activeRunID === id;
}

function postWorkerMessage(message: PlainPythonWorkerMessage) {
	globalThis.postMessage(message);
}

function postOutput(
	id: number,
	kind: PlainPythonOutputMessage["kind"],
	text: string
) {
	if (!isActiveRun(id)) return;
	postWorkerMessage({ type: "output", id, kind, text });
}

function escapePythonString(value: string) {
	return JSON.stringify(value);
}

async function loadRuntime() {
	if (!pyodidePromise) {
		pyodidePromise = (async () => {
			const { loadPyodide } = (await import(
				/* @vite-ignore */ PYODIDE_MODULE_SRC
			)) as PyodideModule;
			return loadPyodide({ indexURL: PYODIDE_INDEX_URL });
		})();
	}

	return pyodidePromise;
}

function ensureDirectory(pyodide: PyodideAPI, path: string) {
	if (!pyodide.FS.analyzePath(path).exists) pyodide.FS.mkdirTree(path);
}

function ensureParentDirectories(pyodide: PyodideAPI, fileName: string) {
	const segments = fileName.split("/").slice(0, -1);
	let currentPath = PROJECT_ROOT;
	for (const segment of segments) {
		currentPath = `${currentPath}/${segment}`;
		ensureDirectory(pyodide, currentPath);
	}
}

function safeUnlink(pyodide: PyodideAPI, path: string) {
	if (!pyodide.FS.unlink || !pyodide.FS.analyzePath(path).exists) return;
	pyodide.FS.unlink(path);
}

function decodeBase64File(content: string) {
	const binary = atob(content);
	const bytes = new Uint8Array(binary.length);
	for (let index = 0; index < binary.length; index += 1)
		bytes[index] = binary.charCodeAt(index);
	return bytes;
}

function writeProjectFile(pyodide: PyodideAPI, file: PythonIdeFile) {
	ensureParentDirectories(pyodide, file.name);
	pyodide.FS.writeFile(
		`${PROJECT_ROOT}/${file.name}`,
		file.encoding === "base64"
			? decodeBase64File(file.content)
			: file.content
	);
}

function validProjectFiles(files: PythonIdeFile[]) {
	return files.filter(file => isValidPythonFileName(file.name));
}

function syncProjectFiles(pyodide: PyodideAPI, files: PythonIdeFile[]) {
	ensureDirectory(pyodide, PROJECT_ROOT);
	const writableFiles = validProjectFiles(files);
	const nextFileNames = new Set(writableFiles.map(file => file.name));
	for (const previousName of lastProjectFileNames) {
		if (!nextFileNames.has(previousName))
			safeUnlink(pyodide, `${PROJECT_ROOT}/${previousName}`);
	}

	for (const file of writableFiles) writeProjectFile(pyodide, file);

	lastProjectFileNames = nextFileNames;
}

function projectModuleNames(files: Pick<PythonIdeFile, "name">[]) {
	const packageSuffix = ".__init__";
	const modules = new Set<string>();

	for (const file of files) {
		if (
			!isValidPythonFileName(file.name) ||
			!PYTHON_EXTENSION_RE.test(file.name)
		) {
			continue;
		}
		const moduleName = file.name
			.replace(PYTHON_EXTENSION_RE, "")
			.replaceAll("/", ".");
		modules.add(
			moduleName.endsWith(packageSuffix)
				? moduleName.slice(0, -packageSuffix.length)
				: moduleName
		);
	}

	return [...modules];
}

function plainPythonPackageScanModules(
	files: PythonIdeFile[],
	standardLibraryModules: Set<string>
) {
	const validFiles = validProjectFiles(files);
	const localModules = new Set(
		projectModuleNames(validFiles).map(
			moduleName => moduleName.split(".")[0]
		)
	);

	return [...pythonIdeImportedTopLevelModules(validFiles)]
		.filter(
			moduleName =>
				!localModules.has(moduleName) &&
				!standardLibraryModules.has(moduleName) &&
				!loadedPlainPythonImportModules.has(moduleName)
		)
		.sort();
}

async function loadPlainPythonImportPackages(
	pyodide: PyodideAPI,
	files: PythonIdeFile[]
) {
	const standardLibraryModules = await pythonStandardLibraryModules(pyodide);
	const modules = plainPythonPackageScanModules(
		files,
		standardLibraryModules
	);
	if (!modules.length) return;

	await pyodide.loadPackagesFromImports(
		modules.map(moduleName => `import ${moduleName}`).join("\n")
	);
	for (const moduleName of modules)
		loadedPlainPythonImportModules.add(moduleName);
}

function projectBootstrap(
	activeFileName: string,
	inputText: string,
	projectModulesToClear: string[]
) {
	const inputLines = inputText.replaceAll("\r\n", "\n").split("\n");
	return `
def __classes_run_active_file():
    import builtins
    import json
    import os
    import sys

    __classes_project_root = ${escapePythonString(PROJECT_ROOT)}
    __classes_active_file = ${escapePythonString(activeFileName)}
    __classes_main = sys.modules["__main__"]
    __classes_preserved_main_names = {
        "__builtins__",
        "__doc__",
        "__loader__",
        "__package__",
        "__spec__",
    }
    for __classes_name in list(__classes_main.__dict__):
        if __classes_name not in __classes_preserved_main_names:
            del __classes_main.__dict__[__classes_name]
    __classes_main.__dict__["__builtins__"] = builtins
    __classes_main.__dict__["__file__"] = __classes_active_file
    __classes_main.__dict__["__name__"] = "__main__"

    os.chdir(__classes_project_root)
    if __classes_project_root not in sys.path:
        sys.path.insert(0, __classes_project_root)
    for __classes_module_name in json.loads(${escapePythonString(JSON.stringify(projectModulesToClear))}):
        sys.modules.pop(__classes_module_name, None)

    __classes_input_values = iter(json.loads(${escapePythonString(JSON.stringify(inputLines))}))

    def __classes_input(prompt=""):
        print(prompt, end="")
        try:
            return next(__classes_input_values)
        except StopIteration:
            raise EOFError("No more input values are available in the input panel.")

    builtins.input = __classes_input
    exec(
        compile(
            open(__classes_active_file, "r", encoding="utf-8").read(),
            __classes_active_file,
            "exec",
        ),
        __classes_main.__dict__,
        __classes_main.__dict__,
    )

__classes_run_active_file()
`;
}

async function captureProjectTextFiles(pyodide: PyodideAPI) {
	const snapshot = await pyodide.runPythonAsync(`
import json
from pathlib import Path

__classes_root = Path(${escapePythonString(PROJECT_ROOT)})
__classes_files = []
__classes_text_suffixes = {".csv", ".json", ".md", ".py", ".svg", ".txt"}
for __classes_path in sorted(__classes_root.rglob("*")):
    if not __classes_path.is_file():
        continue
    if __classes_path.suffix.lower() not in __classes_text_suffixes:
        continue
    try:
        __classes_content = __classes_path.read_text(encoding="utf-8")
    except Exception:
        continue
    __classes_files.append({
        "name": str(__classes_path.relative_to(__classes_root)),
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

async function runPlainPythonProject(request: PlainPythonRunRequest) {
	activeRunID = request.id;
	const pyodide = await loadRuntime();
	if (!isActiveRun(request.id)) return;

	pyodide.setStdout?.({
		batched: text => postOutput(request.id, "stdout", text)
	});
	pyodide.setStderr?.({
		batched: text => postOutput(request.id, "stderr", text)
	});

	const projectModulesToClear = projectModuleNames([
		...request.files,
		...[...lastProjectFileNames].map(name => ({ name }))
	]);
	syncProjectFiles(pyodide, request.files);
	if (!isActiveRun(request.id)) return;
	await loadPlainPythonImportPackages(pyodide, request.files);
	if (!isActiveRun(request.id)) return;
	await pyodide.runPythonAsync(
		projectBootstrap(
			request.activeFileName,
			request.inputText,
			projectModulesToClear
		)
	);
	if (!isActiveRun(request.id)) return;

	postWorkerMessage({
		type: "done",
		id: request.id,
		files: await captureProjectTextFiles(pyodide)
	});
}

globalThis.addEventListener("message", event => {
	const request = event.data as PlainPythonWorkerRequest;
	if (request.type !== "run") return;

	void runPlainPythonProject(request)
		.catch(error => {
			if (!isActiveRun(request.id)) return;
			postWorkerMessage({
				type: "error",
				id: request.id,
				message: error instanceof Error ? error.message : String(error)
			});
		})
		.finally(() => {
			if (activeRunID === request.id) activeRunID = null;
		});
});
