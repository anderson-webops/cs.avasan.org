import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const sandboxSource = readFileSync(
	resolve(__dirname, "../src/modules/pythonIdeSandbox.ts"),
	"utf8"
);
const runtimeSource = readFileSync(
	resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
	"utf8"
);
const workspaceSource = readFileSync(
	resolve(__dirname, "../src/components/PythonIdeWorkspace.vue"),
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

describe("Python IDE browser-runtime isolation", () => {
	it("routes every student-code mode through the opaque sandbox", () => {
		const publicRunner = sourceBetween(
			runtimeSource,
			"export async function runPythonProject",
			"\n}"
		);

		expect(publicRunner).toContain("runPythonProjectInSandbox(");
		expect(publicRunner).not.toContain("loadRuntime(");
		expect(publicRunner).not.toContain(
			"runPlainPythonProjectInWorker("
		);
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
		expect(sandboxSource).toContain(
			'worker-src blob:'
		);
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

		expect(sandboxSource).toContain(
			'typeof document === "undefined"'
		);
		expect(sandboxSource).toContain("localStorageBlocked");
		expect(sandboxSource).toContain("indexedDbBlocked");
		expect(sandboxSource).toContain(
			'credentials: "include"'
		);
		expect(sandboxSource).toContain(
			'"/api/students/session?runtime-isolation-probe=1"'
		);
		expect(sandboxSource).toContain(
			"Python runtime isolation checks failed; code was not run."
		);
		expect(sandboxSource).toContain(
			"!security?.ambientAppFetchBlocked"
		);
		expect(sandboxSource).toContain(
			"!security.indexedDbBlocked"
		);
		expect(sandboxSource).toContain(
			"!security.localStorageBlocked"
		);
		expect(sandboxSource).toContain(
			"!security.parentDomBlocked"
		);
		expect(sandboxSource).toContain(
			"setTimeout(finish, 1000, false)"
		);
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
			'event.source !== iframe.contentWindow'
		);
		expect(sandboxSource).toContain('event.origin !== "null"');
		expect(sandboxSource).toContain(
			"event.data.token !== token"
		);
		expect(sandboxSource).toContain("safePrimitiveArgs(");
		expect(sandboxSource).toContain(
			'message.bridge === "turtle"'
		);
		expect(sandboxSource).toContain(
			'message.bridge === "game"'
		);
		expect(sandboxSource).toContain(
			'message.bridge === "artifact"'
		);
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
		expect(workspaceSource).toContain(
			"connect-src 'none';"
		);
		expect(workspaceSource).toContain(
			':csp="runtimeArtifactContentSecurityPolicy"'
		);
		expect(workspaceSource).toContain("credentialless");
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
		expect(sandboxSource).toContain(
			"operationMessageCount > 5000"
		);
		expect(sandboxSource).toContain(
			"windowMessageCount > 2000"
		);
		expect(sandboxSource).toContain(
			"runtimeMessageBytes > 512 * 1024 * 1024"
		);
		expect(sandboxSource).toContain(
			"callbackRegistry.size >= 2048"
		);
		expect(sandboxSource).toContain(
			"oneShotCallbackIDs.delete(id)"
		);
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
		expect(transitionSource.indexOf("stopActiveRuntimeSurfaces();")).toBeLessThan(
			transitionSource.indexOf("projects.value = [];")
		);
		expect(transitionSource.indexOf("stopActiveRuntimeSurfaces();")).toBeLessThan(
			transitionSource.indexOf("selectedProjectID.value =")
		);

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
		expect(exportedRunner).toContain(
			"session.destroy("
		);
		expect(exportedStop).toContain("activeSandbox?.destroy(reason)");
		expect(runtimeSource).toContain("stopPythonIdeSandboxRun();");
	});
});
