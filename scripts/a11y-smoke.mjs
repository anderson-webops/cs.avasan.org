import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import http from "node:http";
import { createRequire } from "node:module";
import puppeteer from "puppeteer";

const require = createRequire(import.meta.url);
const axeSourcePath = require.resolve("axe-core/axe.min.js");

const frontendPort = Number(process.env.A11Y_FRONTEND_PORT || 3333);
const apiPort = Number(process.env.A11Y_API_PORT || 3008);
const baseUrl = `http://127.0.0.1:${frontendPort}`;
const isCi = process.env.CI === "true";
const runFullMatrix = process.env.A11Y_FULL === "true" || !isCi;
const routeScenarios = [
	{
		name: "public",
		role: "public",
		routes: runFullMatrix
			? [
					"/",
					"/about",
					"/courses",
					"/pathways",
					"/signup",
					"/payment",
					"/zoom",
					"/wheel"
				]
			: ["/", "/courses", "/signup", "/zoom"]
	},
	{
		name: "student",
		role: "student",
		routes: runFullMatrix
			? ["/profile", "/courses", "/pathways", "/zoom", "/wheel"]
			: ["/profile", "/courses"]
	},
	{
		name: "tutor",
		role: "tutor",
		routes: runFullMatrix
			? ["/profile", "/courses", "/teaching", "/pathways", "/zoom"]
			: ["/profile", "/courses", "/teaching"]
	},
	{
		name: "admin",
		role: "admin",
		routes: runFullMatrix
			? [
					"/profile",
					"/courses",
					"/admin",
					"/admin/people",
					"/admin/mdmail",
					"/admin/student-management"
				]
			: ["/admin", "/admin/mdmail", "/admin/student-management"]
	}
];
const viewportScenarios = runFullMatrix
	? [
			{ height: 900, name: "mobile", width: 390 },
			{ height: 1000, name: "tablet", width: 768 },
			{ height: 1000, name: "desktop", width: 1280 }
		]
	: [
			{ height: 900, name: "mobile", width: 390 },
			{ height: 1000, name: "desktop", width: 1280 }
		];
const mediaScenarios = [
	{
		colorScheme: "light",
		name: "light",
		prefersReducedMotion: "no-preference",
		storedTheme: "light"
	},
	{
		colorScheme: "dark",
		name: "dark-reduced-motion",
		prefersReducedMotion: "reduce",
		storedTheme: "dark"
	}
];

const chromeCandidates = [
	process.env.PUPPETEER_EXECUTABLE_PATH,
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/Applications/Chromium.app/Contents/MacOS/Chromium",
	"/usr/bin/google-chrome-stable",
	"/usr/bin/google-chrome",
	"/usr/bin/chromium-browser",
	"/usr/bin/chromium"
].filter(Boolean);

const chromePath = chromeCandidates.find(candidate => existsSync(candidate));
if (chromePath) process.env.PUPPETEER_EXECUTABLE_PATH = chromePath;

let activeRole = "public";

const admin = {
	_id: "admin-accessibility",
	name: "Accessibility Admin",
	email: "admin@example.com",
	editAdmins: false,
	saveEdit: ""
};
const tutor = {
	_id: "tutor-accessibility",
	name: "Jacob",
	email: "classes@example.com",
	age: 30,
	state: "GA",
	usersOfTutorLength: 1,
	editTutors: false,
	saveEdit: "",
	coursePermissions: ["javascript-level-1"]
};
const student = {
	_id: "user-accessibility",
	name: "Student Test",
	email: "student@example.com",
	age: 15,
	state: "GA",
	editUsers: false,
	saveEdit: "",
	tutors: [tutor],
	courseAccess: ["javascript-level-1"],
	courseProgress: [
		{
			courseId: "javascript-level-1",
			completedModuleIds: [],
			completedItemIds: []
		}
	]
};

function writeServerLine(prefix, data) {
	const text = data.toString().trim();
	if (text) process.stderr.write(`[${prefix}] ${text}\n`);
}

function sendJson(res, body, status = 200) {
	res.writeHead(status, {
		"content-type": "application/json",
		"access-control-allow-origin": baseUrl,
		"access-control-allow-credentials": "true",
		"access-control-allow-headers": "content-type",
		"access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS"
	});
	res.end(JSON.stringify(body));
}

function createMockApiServer() {
	const users = [student];
	const tutors = [tutor];

	return http.createServer((req, res) => {
		const url = new URL(req.url || "/", `http://127.0.0.1:${apiPort}`);
		if (req.method === "OPTIONS") {
			sendJson(res, {}, 204);
			return;
		}

		if (url.pathname === "/accounts/me") {
			if (activeRole === "admin") sendJson(res, { adminID: admin._id });
			else if (activeRole === "tutor") sendJson(res, { tutorID: tutor._id });
			else if (activeRole === "student") sendJson(res, { userID: student._id });
			else sendJson(res, {});
			return;
		}
		if (url.pathname === "/admins/loggedin") {
			sendJson(
				res,
				activeRole === "admin" ? { currentAdmin: admin } : {},
				activeRole === "admin" ? 200 : 401
			);
			return;
		}
		if (url.pathname === "/tutors/loggedin") {
			sendJson(
				res,
				activeRole === "tutor" ? { currentTutor: tutor } : {},
				activeRole === "tutor" ? 200 : 401
			);
			return;
		}
		if (url.pathname === "/users/loggedin") {
			sendJson(
				res,
				activeRole === "student" ? { currentUser: student } : {},
				activeRole === "student" ? 200 : 401
			);
			return;
		}
		if (url.pathname === "/users/all") {
			sendJson(res, users);
			return;
		}
		if (url.pathname === `/users/oftutor/${tutor._id}`) {
			sendJson(res, users);
			return;
		}
		if (url.pathname === "/tutors") {
			sendJson(res, tutors);
			return;
		}
		if (url.pathname === "/admins") {
			sendJson(res, [admin]);
			return;
		}
		if (url.pathname === "/quotes") {
			sendJson(res, []);
			return;
		}

		sendJson(res, { error: "not mocked", path: url.pathname }, 404);
	});
}

async function listen(server, port) {
	await new Promise((resolve, reject) => {
		server.once("error", reject);
		server.listen(port, "127.0.0.1", resolve);
	});
}

async function waitForHttp(url, timeoutMs = 30_000) {
	const start = Date.now();
	let lastError;
	while (Date.now() - start < timeoutMs) {
		try {
			const response = await fetch(url);
			if (response.ok) return;
			lastError = new Error(`${url} returned ${response.status}`);
		} catch (error) {
			lastError = error;
		}
		await new Promise(resolve => setTimeout(resolve, 400));
	}
	throw lastError || new Error(`Timed out waiting for ${url}`);
}

function startVite() {
	const child = spawn(
		"npm",
		[
			"exec",
			"-w",
			"front-end",
			"--",
			"vite",
			"--host",
			"127.0.0.1",
			"--port",
			String(frontendPort),
			"--strictPort"
		],
		{
			detached: process.platform !== "win32",
			env: {
				...process.env,
				BROWSER: "none"
			},
			stdio: ["ignore", "pipe", "pipe"]
		}
	);
	child.stdout.on("data", data => writeServerLine("vite", data));
	child.stderr.on("data", data => writeServerLine("vite", data));
	return child;
}

function killChild(child, signal) {
	if (!child.pid) return;

	if (process.platform === "win32") {
		child.kill(signal);
		return;
	}

	try {
		process.kill(-child.pid, signal);
	} catch {
		child.kill(signal);
	}
}

function closeServer(server) {
	return new Promise(resolve => server.close(resolve));
}

function waitForChildExit(child) {
	return new Promise(resolve => {
		if (child.exitCode !== null || child.signalCode) {
			resolve();
			return;
		}
		child.once("exit", resolve);
	});
}

async function stopChild(child) {
	if (child.exitCode !== null || child.signalCode) return;

	killChild(child, "SIGTERM");
	const exited = await Promise.race([
		waitForChildExit(child).then(() => true),
		new Promise(resolve => setTimeout(() => resolve(false), 5_000))
	]);

	if (exited) return;

	killChild(child, "SIGKILL");
	await Promise.race([
		waitForChildExit(child),
		new Promise(resolve => setTimeout(resolve, 2_000))
	]);
}

const apiServer = createMockApiServer();
const viteProcess = startVite();
let browser;

try {
	await listen(apiServer, apiPort);
	await waitForHttp(baseUrl);

	browser = await puppeteer.launch({
		executablePath: chromePath,
		headless: "new",
		args: ["--no-sandbox", "--disable-dev-shm-usage"]
	});

	const failures = [];
	for (const scenario of routeScenarios) {
		activeRole = scenario.role;
		for (const route of scenario.routes) {
			for (const viewport of viewportScenarios) {
				for (const media of mediaScenarios) {
					const url = `${baseUrl}${route}`;
					const page = await browser.newPage();
					try {
						console.log(
							`a11y checking: ${url} (${scenario.name}, ${viewport.name}, ${media.name})`
						);
						page.setDefaultNavigationTimeout(15_000);
						await page.setViewport({
							deviceScaleFactor: 1,
							height: viewport.height,
							width: viewport.width
						});
						await page.emulateMediaFeatures([
							{
								name: "prefers-color-scheme",
								value: media.colorScheme
							},
							{
								name: "prefers-reduced-motion",
								value: media.prefersReducedMotion
							}
						]);
						await page.evaluateOnNewDocument(storedTheme => {
							window.localStorage.setItem(
								"vueuse-color-scheme",
								storedTheme
							);
						}, media.storedTheme);
						await page.goto(url, {
							timeout: 15_000,
							waitUntil: "domcontentloaded"
						});
						await page.waitForSelector("body", { timeout: 10_000 });
						await page.waitForFunction(
							() => document.body.innerText.trim().length > 0,
							{ timeout: 10_000 }
						);
						await new Promise(resolve => setTimeout(resolve, 250));
						await page.addScriptTag({ path: axeSourcePath });
						const result = await page.evaluate(async () => {
							return await axe.run(document, {
								resultTypes: ["violations"],
								runOnly: {
									type: "tag",
									values: ["wcag2a", "wcag2aa"]
								}
							});
						});
						const violations = result.violations.filter(
							violation => violation.id !== "frame-tested"
						);
						if (violations.length) {
							failures.push({
								context: `${scenario.name}/${viewport.name}/${media.name}`,
								url,
								violations
							});
							continue;
						}
						console.log(
							`a11y ok: ${url} (${scenario.name}, ${viewport.name}, ${media.name})`
						);
					} finally {
						await page.close().catch(() => {});
					}
				}
			}
		}
	}

	if (failures.length) {
		for (const failure of failures) {
			console.error(
				`\nAccessibility issues for ${failure.url} (${failure.context})`
			);
			for (const violation of failure.violations) {
				console.error(`- [${violation.impact ?? "unknown"}] ${violation.id}: ${violation.help}`);
				console.error(`  ${violation.helpUrl}`);
				for (const node of violation.nodes) {
					console.error(`  ${node.target.join(", ")}`);
				}
			}
		}
		process.exitCode = 1;
	}
} finally {
	if (browser) await browser.close();
	await stopChild(viteProcess);
	apiServer.closeAllConnections?.();
	await closeServer(apiServer);
}
