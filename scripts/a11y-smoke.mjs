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
const routes = [
	"/",
	"/profile",
	"/signup",
	"/courses",
	"/wheel",
	"/admin/mdmail",
	"/admin/student-management"
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
	const admin = {
		_id: "admin-accessibility",
		name: "Accessibility Admin",
		email: "admin@example.com",
		editAdmins: false,
		saveEdit: ""
	};
	const users = [
		{
			_id: "user-accessibility",
			name: "Recipient 3",
			email: "jinen@example.com",
			age: 15,
			state: "GA",
			editUsers: false,
			saveEdit: "",
			courseAccess: ["javascript-level-1"]
		}
	];
	const tutors = [
		{
			_id: "tutor-accessibility",
			name: "Jacob",
			email: "classes@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			editTutors: false,
			saveEdit: "",
			coursePermissions: ["javascript-level-1"]
		}
	];

	return http.createServer((req, res) => {
		const url = new URL(req.url || "/", `http://127.0.0.1:${apiPort}`);
		if (req.method === "OPTIONS") {
			sendJson(res, {}, 204);
			return;
		}

		if (url.pathname === "/accounts/me") {
			sendJson(res, { adminID: admin._id });
			return;
		}
		if (url.pathname === "/admins/loggedin") {
			sendJson(res, { currentAdmin: admin });
			return;
		}
		if (url.pathname === "/users/all") {
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

function closeServer(server) {
	return new Promise(resolve => server.close(resolve));
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
	for (const route of routes) {
		const url = `${baseUrl}${route}`;
		const page = await browser.newPage();
		await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1 });
		await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
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
		await page.close();
		const violations = result.violations.filter(violation => violation.id !== "frame-tested");
		if (violations.length) {
			failures.push({ url, violations });
			continue;
		}
		console.log(`a11y ok: ${url}`);
	}

	if (failures.length) {
		for (const failure of failures) {
			console.error(`\nAccessibility issues for ${failure.url}`);
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
	viteProcess.kill("SIGTERM");
	await closeServer(apiServer);
}
