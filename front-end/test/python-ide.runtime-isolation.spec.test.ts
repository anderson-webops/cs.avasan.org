import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createTurtlePostScriptRecorder } from "@/modules/pythonIdeSandbox";

const sandboxSource = readFileSync(
	resolve(__dirname, "../src/modules/pythonIdeSandbox.ts"),
	"utf8"
);
const runtimeSource = readFileSync(
	resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
	"utf8"
);
const workspaceSource = readFileSync(
	resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
	"utf8"
);

function sourceBetween(
	source: string,
	startMarker: string,
	endMarker?: string
) {
	const start = source.indexOf(startMarker);
	expect(start).toBeGreaterThanOrEqual(0);
	const end = endMarker ? source.indexOf(endMarker, start) : source.length;
	expect(end).toBeGreaterThan(start);
	return source.slice(start, end);
}

describe("IDE browser-runtime isolation", () => {
	it("routes every student-code mode through the opaque sandbox", () => {
		const publicRunner = sourceBetween(
			runtimeSource,
			"export async function runPythonProject",
			"\n}"
		);

		expect(publicRunner).toContain("runPythonProjectInSandbox(");
		expect(publicRunner).not.toContain("loadRuntime(");
		expect(publicRunner).not.toContain("runPlainPythonProjectInWorker(");
		expect(sandboxSource).toContain(
			'iframe.setAttribute("sandbox", "allow-scripts")'
		);
		expect(sandboxSource).not.toContain(
			'iframe.setAttribute("sandbox", "allow-scripts allow-same-origin")'
		);
		expect(sandboxSource).toContain(
			'iframe.dataset.pythonIdeRuntimeSandbox = "true"'
		);
		expect(sandboxSource).toContain("new Worker(");
		expect(sandboxSource).toContain("worker-src blob:");
	});

	it("fails closed unless DOM, storage, and ambient authenticated fetch are blocked", () => {
		const csp = sourceBetween(
			sandboxSource,
			'<meta http-equiv="Content-Security-Policy"',
			'">'
		);
		expect(csp).toContain("default-src 'none'");
		expect(csp).toContain("connect-src https://cdn.jsdelivr.net");
		expect(csp).not.toContain("connect-src 'self'");
		expect(csp).toContain("form-action 'none'");

		expect(sandboxSource).toContain('typeof document === "undefined"');
		expect(sandboxSource).toContain("localStorageBlocked");
		expect(sandboxSource).toContain("indexedDbBlocked");
		expect(sandboxSource).toContain('credentials: "include"');
		expect(sandboxSource).toContain(
			'"/api/students/session?runtime-isolation-probe=1"'
		);
		expect(sandboxSource).toContain(
			"Python runtime isolation checks failed; code was not run."
		);
		expect(sandboxSource).toContain("!security?.ambientAppFetchBlocked");
		expect(sandboxSource).toContain("!security.indexedDbBlocked");
		expect(sandboxSource).toContain("!security.localStorageBlocked");
		expect(sandboxSource).toContain("!security.parentDomBlocked");
		expect(sandboxSource).toContain("setTimeout(finish, 1000, false)");
	});

	it("uses a capability channel and a narrow validated rendering bridge", () => {
		expect(sandboxSource).toContain("new MessageChannel()");
		expect(sandboxSource).toContain(
			"controlPort.onmessage = handleControlMessage"
		);
		expect(sandboxSource).toContain(
			"workerControlPort.postMessage(message)"
		);
		expect(sandboxSource).toContain(
			"event.source !== iframe.contentWindow"
		);
		expect(sandboxSource).toContain('event.origin !== "null"');
		expect(sandboxSource).toContain("event.data.token !== token");
		expect(sandboxSource).toContain("safePrimitiveArgs(");
		expect(sandboxSource).toContain('message.bridge === "turtle"');
		expect(sandboxSource).toContain('message.bridge === "game"');
		expect(sandboxSource).toContain('message.bridge === "artifact"');
		expect(sandboxSource).toContain("const allowed = new Set([");
		expect(sandboxSource).toContain(
			"Direct runtime messaging is unavailable to student code."
		);
		expect(sandboxSource).toContain(
			"postToHost = controlPort.postMessage.bind(controlPort)"
		);
		expect(sandboxSource).toContain('kind: "worker-connect"');
		expect(sandboxSource).not.toContain("eval(message");
		expect(sandboxSource).not.toContain("fetch(message");
		expect(workspaceSource).toContain("connect-src 'none';");
		expect(workspaceSource).toContain(
			':csp="runtimeArtifactContentSecurityPolicy"'
		);
		expect(workspaceSource).toContain("credentialless");
	});

	it("carries the complete Turtle 3.14 bridge through the same sandbox", () => {
		for (const method of [
			"bgpic",
			"setScreenSize",
			"setWorldCoordinates",
			"teleport",
			"clearStamp",
			"undo",
			"registerRelease",
			"registerTurtleClick",
			"registerTurtleRelease",
			"registerTurtleDrag",
			"registerShape",
			"setShapeTransform"
		]) {
			expect(sandboxSource).toContain(`"${method}"`);
		}
		expect(runtimeSource).toContain(
			'__classes_turtle_api_version__ = "3.14"'
		);
		expect(runtimeSource).toContain("def teleport(");
		expect(runtimeSource).toContain("def clearstamps(");
		expect(runtimeSource).toContain("def setworldcoordinates(");
		expect(runtimeSource).toContain("def onkeyrelease(");
		expect(runtimeSource).toContain("def register_shape(");
		expect(runtimeSource).toContain("def shapetransform(");
		expect(runtimeSource).toContain("runPythonProjectInSandbox(");
		expect(runtimeSource).not.toContain("pythonIdePlainWorker");
	});

	it("serializes the worker-local Turtle drawing as real bounded PostScript", () => {
		const recorder = createTurtlePostScriptRecorder();
		recorder.record("setScreenSize", [320, 240]);
		recorder.record("activate", ["student-turtle"]);
		recorder.record("setState", [0, 0, 0, true, "#ff0000", "#00ff00", 2]);
		recorder.record("goto", [50, 25]);
		recorder.record("beginFill", []);
		recorder.record("goto", [50, 50]);
		recorder.record("goto", [0, 50]);
		recorder.record("goto", [50, 25]);
		recorder.record("endFill", []);
		recorder.record("dot", [10, "blue"]);
		recorder.record("write", [
			"Julio) show\n0 0 moveto (not code",
			"center",
			"Arial",
			14,
			"bold"
		]);

		const postScript = recorder.exportPostScript();

		expect(postScript).toMatch(/^%!PS-Adobe-3\.0 EPSF-3\.0\n/);
		expect(postScript).toContain("%%BoundingBox: 0 0 320 240");
		expect(postScript).toContain("%%Creator: IDE");
		expect(postScript).toContain("1 0 0 setrgbcolor");
		expect(postScript).toContain(
			"newpath 160 120 moveto 210 145 lineto stroke"
		);
		expect(postScript).toContain("0 1 0 setrgbcolor");
		expect(postScript).toContain("closepath fill");
		expect(postScript).toContain("/Helvetica-Bold findfont 14");
		expect(postScript).toContain(
			"(Julio\\) show\\0120 0 moveto \\(not code)"
		);
		expect(postScript).not.toContain("Julio) show\n0 0 moveto");
		expect(postScript).toMatch(/showpage\n%%EOF\n$/);
	});

	it("keeps PostScript export synchronous, isolated, and within its hard limit", () => {
		const recorderSource = sourceBetween(
			sandboxSource,
			"export function createTurtlePostScriptRecorder",
			"\nlet activeSandbox"
		);
		for (const forbidden of [
			"Atomics",
			"SharedArrayBuffer",
			"fetch(",
			"postMessage",
			"XMLHttpRequest"
		]) {
			expect(recorderSource).not.toContain(forbidden);
		}
		expect(sandboxSource).not.toContain("SharedArrayBuffer");
		expect(sandboxSource).not.toContain("Atomics.");
		expect(sandboxSource).toContain(
			"return turtlePostScriptRecorder.exportPostScript();"
		);
		const workerTurtleBridge = sourceBetween(
			sandboxSource,
			"const turtleBridge = {",
			"\n\tconst gameBridge = {"
		);
		const workerExport = sourceBetween(
			workerTurtleBridge,
			"exportPostScript: () =>",
			"\n\t};"
		);
		expect(workerExport).not.toContain('bridge("turtle"');
		const hostAllowlist = sourceBetween(
			sandboxSource,
			"const allowed = new Set([",
			"]);"
		);
		expect(hostAllowlist).not.toContain('"exportPostScript"');

		const recorder = createTurtlePostScriptRecorder();
		for (let index = 0; index < 20_100; index += 1) {
			recorder.record("write", [
				`bounded drawing ${index} ${"x".repeat(80)}`,
				"left",
				"Arial",
				12,
				"normal"
			]);
		}
		const postScript = recorder.exportPostScript();
		expect(postScript.length).toBeLessThanOrEqual(480_000);
		expect(new TextEncoder().encode(postScript).byteLength).toBeLessThan(
			500_000
		);
		expect(postScript).toContain(
			"%%IDEWarning: drawing truncated at the safe export limit"
		);
		expect(postScript).toMatch(/showpage\n%%EOF\n$/);

		recorder.record("activate", ["default"]);
		recorder.record("clearTurtle", []);
		recorder.record("setState", [0, 0, 0, true, "black", "black", 1]);
		recorder.record("goto", [10, 0]);
		const recoveredPostScript = recorder.exportPostScript();
		expect(recoveredPostScript).not.toContain("%%IDEWarning");
		expect(recoveredPostScript).not.toContain("bounded drawing");
		expect(recoveredPostScript).toContain(
			"newpath 320 240 moveto 330 240 lineto stroke"
		);
	});

	it("keeps later Turtle clears exact after an earlier export was truncated", () => {
		const recorder = createTurtlePostScriptRecorder();
		recorder.record("activate", ["one"]);
		for (let index = 0; index < 45; index += 1) {
			recorder.record("write", [
				"🔥".repeat(800),
				"left",
				"Arial",
				12,
				"normal"
			]);
		}
		expect(recorder.exportPostScript()).toContain(
			"%%IDEWarning: drawing truncated at the safe export limit"
		);

		recorder.record("activate", ["one"]);
		recorder.record("clearTurtle", []);
		recorder.record("setState", [0, 0, 0, true, "black", "black", 1]);
		recorder.record("goto", [10, 0]);
		const clearedPostScript = recorder.exportPostScript();

		expect(clearedPostScript).not.toContain("%%IDEWarning");
		expect(clearedPostScript).not.toContain("findfont");
		expect(clearedPostScript).toContain(
			"newpath 320 240 moveto 330 240 lineto stroke"
		);
	});

	it("writes .ps and .eps exports into the isolated project snapshot", () => {
		const captureSource = sourceBetween(
			sandboxSource,
			"const captureFiles = async",
			"const loadPackages = async"
		);
		expect(captureSource).toContain("csv|eps|json|md|ps|txt");
		expect(captureSource).toContain('".eps"');
		expect(captureSource).toContain('".ps"');
		expect(runtimeSource).toContain("def postscript(self, **kwargs):");
		expect(runtimeSource).toContain('filename = kwargs.get("file")');
		expect(runtimeSource).toContain(
			'if path.suffix.lower() not in (".ps", ".eps"):'
		);
		expect(runtimeSource).toContain(
			'path.write_text(document, encoding="utf-8")'
		);
		expect(runtimeSource).toContain(
			'path.write_text(str(_bridge.exportPostScript()), encoding="utf-8")'
		);
	});

	it("bounds snapshots and fails closed on stalled or invalid worker control messages", () => {
		const captureSource = sourceBetween(
			sandboxSource,
			"const captureFiles = async",
			"const loadPackages = async"
		);
		expect(captureSource).toContain(
			"Project produced too many files to save safely."
		);
		expect(captureSource).toContain(
			"__classes_path.stat().st_size > 512 * 1024"
		);
		expect(captureSource).toContain(
			"__classes_total_bytes > 32 * 1024 * 1024"
		);
		expect(captureSource).toContain(
			"__classes_total_characters > 12_000_000"
		);
		expect(captureSource).toContain(
			"__classes_valid_snapshot_name(__classes_name)"
		);
		expect(sandboxSource).toContain("operationMessageCount > 5000");
		expect(sandboxSource).toContain("windowMessageCount > 2000");
		expect(sandboxSource).toContain(
			"runtimeMessageBytes > 512 * 1024 * 1024"
		);
		expect(sandboxSource).toContain("callbackRegistry.size >= 2048");
		expect(sandboxSource).toContain("oneShotCallbackIDs.delete(id)");
		expect(sandboxSource).toContain(
			"Python runtime produced too much browser output"
		);

		const frameSource = sourceBetween(
			sandboxSource,
			"function pythonIdeSandboxFrameMain",
			"function escapedInlineJson"
		);
		expect(frameSource).toContain('message.kind === "fatal"');
		expect(frameSource).toContain("worker.terminate()");
		expect(frameSource).toContain(
			"Isolated Python worker returned an invalid control message."
		);

		const sessionSource = sourceBetween(
			sandboxSource,
			"function createSandboxSession",
			"function collectImageSizes"
		);
		expect(sessionSource).toContain("SANDBOX_RUN_TIMEOUT_MS");
		expect(sessionSource).toContain("SANDBOX_TICK_TIMEOUT_MS");
		expect(sessionSource).toContain("window.clearTimeout(pending.timeout)");
		expect(sessionSource).toContain(
			"Python runtime returned an invalid project snapshot."
		);
		expect(sessionSource).toContain('message.kind === "fatal"');
	});

	it("destroys the old realm synchronously before an owner workspace is cleared", () => {
		const stopSource = sourceBetween(
			workspaceSource,
			"function stopLoadedPythonRuntimeRun",
			"function createDefaultTurtleState"
		);
		expect(stopSource).toContain(
			"loadedPythonRuntimeModule.stopPythonIdeRuntimeRun();"
		);
		const directStop = stopSource.indexOf(
			"loadedPythonRuntimeModule.stopPythonIdeRuntimeRun();"
		);
		const fallbackPromise = stopSource.indexOf(
			"pythonRuntimeModulePromise"
		);
		expect(directStop).toBeGreaterThanOrEqual(0);
		expect(directStop).toBeLessThan(fallbackPromise);

		const transitionSource = sourceBetween(
			workspaceSource,
			"function hideWorkspaceForOwnerTransition",
			"async function handleStudentSessionHandoff"
		);
		expect(
			transitionSource.indexOf("stopActiveRuntimeSurfaces();")
		).toBeLessThan(transitionSource.indexOf("projects.value = [];"));
		expect(
			transitionSource.indexOf("stopActiveRuntimeSurfaces();")
		).toBeLessThan(transitionSource.indexOf("selectedProjectID.value ="));

		const unmountSource = sourceBetween(
			workspaceSource,
			"onBeforeUnmount(() =>",
			"</script>"
		);
		expect(unmountSource).toContain("stopActiveRuntimeSurfaces();");
	});

	it("cannot preserve execution across a new run or session teardown", () => {
		const createSessionSource = sourceBetween(
			sandboxSource,
			"function createSandboxSession",
			"function collectImageSizes"
		);
		expect(createSessionSource).toContain(
			'activeSandbox?.destroy("Python runtime replaced by a new run.")'
		);
		expect(createSessionSource).toContain('kind: "stop"');
		expect(createSessionSource).toContain("port?.close()");
		expect(createSessionSource).toContain("iframe.remove()");
		expect(createSessionSource).toContain(
			"if (activeSandbox === session) activeSandbox = null"
		);

		const exportedStop = sourceBetween(
			sandboxSource,
			"export function stopPythonIdeSandboxRun"
		);
		const exportedRunner = sourceBetween(
			sandboxSource,
			"export async function runPythonProjectInSandbox",
			"export function stopPythonIdeSandboxRun"
		);
		expect(exportedRunner).toContain(
			'options.mode === "python" || options.mode === "data"'
		);
		expect(exportedRunner).toContain(
			'session.destroy("Python run complete.")'
		);
		expect(exportedRunner).toContain("session.destroy(");
		expect(exportedStop).toContain("activeSandbox?.destroy(reason)");
		expect(runtimeSource).toContain("stopPythonIdeSandboxRun();");
	});
});
