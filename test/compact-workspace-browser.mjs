import { spawn } from "node:child_process";
import { appendFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createServer } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(resolve(root, "package.json"));
const port = 4333;
const logPath = "/tmp/classes-compact-browser-processes.jsonl";
const taskId = process.env.CLASSES_FAMILY_TASK_ID || "compact-workspace-browser";
const children = [];
function log(event) {
	appendFileSync(logPath, JSON.stringify({ taskId, parentPid: process.pid, at: new Date().toISOString(), ...event }) + "\n");
}
function launch(command, args, cwd) {
	const child = spawn(command, args, { cwd, detached: true, stdio: "inherit", env: process.env });
	children.push(child);
	log({ event: "start", cwd, command: [command, ...args].join(" "), pid: child.pid, timeout: 360_000 });
	child.on("exit", (code, signal) => log({ event: "end", pid: child.pid, exitCode: code, signal }));
	return child;
}
async function available() {
	await new Promise((resolvePort, reject) => {
		const probe = createServer();
		probe.once("error", reject);
		probe.listen(port, "127.0.0.1", () => probe.close(resolvePort));
	});
}
let timeout;
let cancelled = false;
function stopChildren() {
	for (const child of children) { try { process.kill(-child.pid, "SIGTERM"); } catch {} }
}
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
	process.once(signal, () => {
		cancelled = true;
		process.exitCode = signal === "SIGINT" ? 130 : 143;
		log({ event: "cancelled", signal });
		stopChildren();
	});
}
try {
	await available();
	timeout = setTimeout(() => {
		log({ event: "timeout" });
		cancelled = true;
		stopChildren();
		process.exitCode = 124;
	}, 360_000);
	const vite = launch(process.execPath, [resolve(dirname(require.resolve("vite/package.json")), "bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], resolve(root, "front-end"));
	let ready = false;
	for (let attempt = 0; attempt < 100; attempt++) {
		if (cancelled) throw new Error("Workspace browser checks cancelled");
		if (vite.exitCode !== null) throw new Error("Workspace preview exited before becoming ready");
		try { ready = (await fetch("http://127.0.0.1:" + port)).ok; } catch {}
		if (ready) break;
		await delay(200);
	}
	if (!ready || cancelled) throw new Error("Workspace preview was not ready or was cancelled");
	const runner = launch(process.execPath, [resolve(dirname(require.resolve("cypress/package.json")), "bin/cypress"), "run", "--browser", "electron", "--config", "baseUrl=http://127.0.0.1:" + port + ",video=false,defaultCommandTimeout=20000", "--spec", "cypress/e2e/compact-workspaces.spec.ts"], resolve(root, "front-end"));
	const code = await new Promise((resolveRun, reject) => { runner.once("error", reject); runner.once("exit", resolveRun); });
	if (code !== 0) throw new Error("Workspace browser regression checks failed: " + code);
} finally {
	clearTimeout(timeout);
	for (const child of children) {
		try { process.kill(-child.pid, "SIGTERM"); } catch {}
		log({ event: "cleanup", pid: child.pid, childProcessGroup: true });
	}
	await delay(300);
	for (const child of children) { try { process.kill(-child.pid, "SIGKILL"); } catch {} }
}
