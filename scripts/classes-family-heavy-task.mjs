#!/usr/bin/env node
import { execFileSync, spawn } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { loadavg } from "node:os";
import { basename, dirname, join } from "node:path";
import { cwd, exit, kill, pid, platform } from "node:process";

const LOCK_PATH = process.env.CLASSES_FAMILY_LOCK ?? "/tmp/classes-family-heavy-task.lock";
const LOG_PATH = process.env.CLASSES_FAMILY_HEAVY_LOG ?? "/tmp/classes-family-heavy-tasks.log";
const TIMEOUT_MS = numberFromEnv("CLASSES_FAMILY_HEAVY_TIMEOUT_MS", 30 * 60 * 1000);
const MAX_LOAD = numberFromEnv("CLASSES_FAMILY_MAX_LOAD", 8);
const MIN_DISK_GB = numberFromEnv("CLASSES_FAMILY_MIN_DISK_GB", 40);
const TASK_ID = process.env.CLASSES_FAMILY_TASK_ID ?? `manual-${Date.now()}-${pid}`;

const delimiter = process.argv.indexOf("--");
const command = delimiter >= 0 ? process.argv.slice(delimiter + 1) : process.argv.slice(2);

if (command.length === 0) {
	console.error("Usage: node scripts/classes-family-heavy-task.mjs -- <command> [args...]");
	exit(64);
}

ensureSystemCanStart();

acquireLock();
const startedAt = new Date();
let child = null;
let timeout = null;

logEvent({
	event: "start",
	taskId: TASK_ID,
	cwd: cwd(),
	command: command.join(" "),
	pid,
	startedAt: startedAt.toISOString()
});

try {
	child = spawn(command[0], command.slice(1), {
		cwd: cwd(),
		detached: platform !== "win32",
		env: process.env,
		stdio: "inherit"
	});

	writeLockMetadata(startedAt, child.pid);

	timeout = setTimeout(() => {
		logEvent({
			event: "timeout",
			taskId: TASK_ID,
			childPid: child?.pid,
			timeoutMs: TIMEOUT_MS,
			endedAt: new Date().toISOString()
		});
		terminateChild();
		exit(124);
	}, TIMEOUT_MS);

	for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
		process.once(signal, () => {
			logEvent({
				event: "signal",
				taskId: TASK_ID,
				signal,
				childPid: child?.pid,
				endedAt: new Date().toISOString()
			});
			terminateChild();
			releaseLock();
			process.kill(pid, signal);
		});
	}

	child.on("exit", (code, signal) => {
		if (timeout) clearTimeout(timeout);
		markDependencyTreesNonIndexable();
		logEvent({
			event: "end",
			taskId: TASK_ID,
			cwd: cwd(),
			command: command.join(" "),
			childPid: child?.pid,
			startedAt: startedAt.toISOString(),
			endedAt: new Date().toISOString(),
			exitCode: code,
			signal
		});
		releaseLock();
		exit(code ?? (signal ? 1 : 0));
	});
} catch (error) {
	if (timeout) clearTimeout(timeout);
	logEvent({
		event: "error",
		taskId: TASK_ID,
		cwd: cwd(),
		command: command.join(" "),
		message: error instanceof Error ? error.message : String(error),
		endedAt: new Date().toISOString()
	});
	terminateChild();
	releaseLock();
	throw error;
}

function numberFromEnv(name, fallback) {
	const rawValue = process.env[name];
	if (!rawValue) return fallback;
	const parsed = Number(rawValue);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function ensureSystemCanStart() {
	if (process.env.CLASSES_FAMILY_ALLOW_HIGH_LOAD === "1") return;
	if (platform !== "darwin") return;

	const [oneMinuteLoad] = loadavg();
	if (oneMinuteLoad > MAX_LOAD) {
		console.error(
			`System load is ${oneMinuteLoad.toFixed(2)}, above ${MAX_LOAD}. Deferring heavy task. ` +
				"Set CLASSES_FAMILY_ALLOW_HIGH_LOAD=1 to override."
		);
		exit(75);
	}

	const freeGb = availableDiskGb(cwd());
	if (freeGb !== null && freeGb < MIN_DISK_GB) {
		console.error(
			`Available disk is ${freeGb.toFixed(1)} GB, below ${MIN_DISK_GB} GB. Deferring heavy task. ` +
				"Set CLASSES_FAMILY_ALLOW_HIGH_LOAD=1 to override."
		);
		exit(75);
	}
}

function availableDiskGb(path) {
	try {
		const output = execFileSync("df", ["-Pk", path], { encoding: "utf8" }).trim().split("\n").at(-1);
		const fields = output?.split(/\s+/) ?? [];
		const availableKb = Number(fields[3]);
		return Number.isFinite(availableKb) ? availableKb / 1024 / 1024 : null;
	} catch {
		return null;
	}
}

function acquireLock() {
	mkdirSync(dirname(LOCK_PATH), { recursive: true });

	try {
		mkdirSync(LOCK_PATH);
		writeLockMetadata(new Date(), null);
		return;
	} catch (error) {
		if (error?.code !== "EEXIST") throw error;

		const existing = readExistingLock();
		if (existing?.parentPid && !isProcessAlive(existing.parentPid)) {
			rmSync(LOCK_PATH, { force: true, recursive: true });
			mkdirSync(LOCK_PATH);
			writeLockMetadata(new Date(), null);
			return;
		}

		console.error("Another classes/scheduler.classes heavy task is already running; skipping.");
		if (existing) {
			console.error(JSON.stringify(existing, null, 2));
		}
		exit(75);
	}
}

function readExistingLock() {
	try {
		return JSON.parse(readFileSync(join(LOCK_PATH, "owner.json"), "utf8"));
	} catch {
		return null;
	}
}

function writeLockMetadata(startedAt, childPid) {
	writeFileSync(
		join(LOCK_PATH, "owner.json"),
		JSON.stringify(
			{
				taskId: TASK_ID,
				cwd: cwd(),
				command: command.join(" "),
				parentPid: pid,
				childPid,
				startedAt: startedAt.toISOString()
			},
			null,
			2
		)
	);
}

function isProcessAlive(processId) {
	try {
		kill(processId, 0);
		return true;
	} catch {
		return false;
	}
}

function releaseLock() {
	rmSync(LOCK_PATH, { force: true, recursive: true });
}

function terminateChild() {
	if (!child?.pid) return;
	try {
		if (platform === "win32") {
			child.kill("SIGTERM");
			return;
		}
		kill(-child.pid, "SIGTERM");
		setTimeout(() => {
			try {
				kill(-child.pid, "SIGKILL");
			} catch {
				// The child process group already exited.
			}
		}, 3000).unref();
	} catch {
		// The child process group already exited.
	}
}

function markDependencyTreesNonIndexable() {
	for (const directory of ["node_modules", "front-end/node_modules", "back-end/node_modules"]) {
		const fullPath = join(cwd(), directory);
		if (!existsSync(fullPath)) continue;
		try {
			writeFileSync(join(fullPath, ".metadata_never_index"), "");
		} catch {
			// Dependency trees are generated; failure to mark them should not fail the parent task.
		}
	}
}

function logEvent(event) {
	try {
		appendFileSync(LOG_PATH, `${JSON.stringify({ repo: basename(cwd()), ...event })}\n`);
	} catch {
		// Logging must not block cleanup or task execution.
	}
}
