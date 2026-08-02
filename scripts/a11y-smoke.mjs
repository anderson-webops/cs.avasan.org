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
const courseResourceRoute =
	"/course-resource?asset=%2Fcourse-assets%2Fpython%2Fturtle-project-reference.md%23turtle-command-reference&label=Turtle+command+reference";
const routeScenarios = [
	{
		name: "public",
		role: "public",
		routes: runFullMatrix
			? [
					"/",
					"/login",
					"/python-ide",
					"/games",
					"/games/pond-paddlers",
					"/games/crosswalk-critters",
					"/games/machine-workshop",
					"/games/comet-hopper",
					courseResourceRoute,
					"/admin"
				]
			: ["/", "/admin"]
	},
	{
		name: "teacher",
		role: "teacher",
		routes: ["/admin", "/"]
	},
	{
		interaction: "open-student-sign-in",
		name: "student-sign-in",
		role: "public",
		routes: ["/"]
	},
	{
		interaction: "open-student-navigation",
		name: "student-setup",
		role: "student-setup",
		routes: ["/"]
	},
	{
		name: "student",
		role: "student",
		routes: ["/", "/python-ide"]
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
	_id: "julio",
	name: "Julio",
	email: "julio@example.com",
	editAdmins: false,
	saveEdit: ""
};
const student = {
	_id: "student-1",
	username: "alex-r",
	active: true,
	passwordSetAt: "2026-07-29T12:00:00.000Z",
	lastLoginAt: "2026-07-29T12:00:00.000Z",
	createdAt: "2026-07-29T12:00:00.000Z",
	updatedAt: "2026-07-29T12:00:00.000Z"
};
const studentProject = {
	_id: "project-1",
	title: "My Python Project",
	mode: "python",
	files: [{ name: "main.py", content: "", encoding: "text" }],
	activeFileName: "main.py",
	createdAt: "2026-07-29T12:00:00.000Z",
	updatedAt: "2026-07-29T12:00:00.000Z"
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
	return http.createServer((req, res) => {
		const url = new URL(req.url || "/", `http://127.0.0.1:${apiPort}`);
		if (req.method === "OPTIONS") {
			sendJson(res, {}, 204);
			return;
		}

		if (url.pathname === "/accounts/me") {
			if (activeRole === "teacher") {
				sendJson(res, { adminID: admin._id });
			} else if (
				activeRole === "student"
				|| activeRole === "student-setup"
			) {
				sendJson(res, { studentID: student._id });
			} else {
				sendJson(res, {});
			}
			return;
		}
		if (url.pathname === "/admins/loggedin") {
			sendJson(
				res,
				activeRole === "teacher" ? { currentAdmin: admin } : {},
				activeRole === "teacher" ? 200 : 401
			);
			return;
		}
		if (url.pathname === "/students/session") {
			sendJson(
				res,
				activeRole === "student"
					? { student, requiresPasswordSetup: false }
					: activeRole === "student-setup"
						? { student, requiresPasswordSetup: true }
					: {},
				activeRole === "student" || activeRole === "student-setup"
					? 200
					: 401
			);
			return;
		}
		if (url.pathname === "/students/oauth/providers") {
			sendJson(res, { apple: true, google: true });
			return;
		}
		if (
			url.pathname === "/students/projects" &&
			req.method === "GET"
		) {
			sendJson(
				res,
				activeRole === "student"
					? { projects: [studentProject] }
					: { message: "Student session required" },
				activeRole === "student" ? 200 : 403
			);
			return;
		}
		if (url.pathname === "/students/project-reviews") {
			sendJson(
				res,
				activeRole === "student"
					? { reviews: [] }
					: { message: "Student session required" },
				activeRole === "student" ? 200 : 403
			);
			return;
		}
		if (url.pathname === "/admins/students") {
			sendJson(
				res,
				activeRole === "teacher" ? { students: [] } : {},
				activeRole === "teacher" ? 200 : 403
			);
			return;
		}
		if (url.pathname === "/admins/classroom-analytics/summary") {
			const siteActivity = {
				totals: {
					courseOpens: 0,
					graphOpens: 0,
					ideOpens: 0
				},
				daily: [
					{
						date: "2026-07-29",
						courseOpens: 0,
						graphOpens: 0,
						ideOpens: 0
					}
				],
				courses: []
			};
			sendJson(
				res,
				activeRole === "teacher"
					? {
							generatedAt: "2026-07-29T12:00:00.000Z",
							period: {
								days: 30,
								startDate: "2026-06-30",
								endDate: "2026-07-29"
							},
							retentionDays: 90,
							siteActivity: {
								cs: structuredClone(siteActivity),
								math: structuredClone(siteActivity)
							},
							studentWork: {
								recentWindowDays: 7,
								activeAccounts: 0,
								accountsWithRecentSignIn: 0,
								studentsWithProjects: 0,
								studentsWithRecentProjectUpdates: 0,
								activeProjects: 0,
								recentlyUpdatedProjects: 0
							}
						}
					: {},
				activeRole === "teacher" ? 200 : 403
			);
			return;
		}
		if (
			url.pathname === "/pond-paddlers/rooms"
			&& req.method === "GET"
		) {
			sendJson(
				res,
				activeRole === "teacher" ? { rooms: [] } : {},
				activeRole === "teacher" ? 200 : 403
			);
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
				BROWSER: "none",
				VITE_API_PROXY_TARGET: `http://127.0.0.1:${apiPort}`,
				VITE_CLASSROOM_PRIVACY_APPROVED:
					process.env.VITE_CLASSROOM_PRIVACY_APPROVED ?? "true",
				VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE:
					process.env.VITE_CLASSROOM_PRIVACY_OPERATOR_NOTICE
					?? "Test operator, 1 Test Way, Test City, CA 90000; 555-0100; privacy@example.test",
				VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE:
					process.env.VITE_CLASSROOM_SERVICE_PROVIDER_NOTICE
					?? "Test hosting provider stores the approved classroom database solely to operate account and project sync.",
				VITE_SCHOOL_PRIVACY_CONTACT:
					process.env.VITE_SCHOOL_PRIVACY_CONTACT
					?? "Julio via the school office",
				VITE_STUDENT_ACCOUNTS_ENABLED:
					process.env.VITE_STUDENT_ACCOUNTS_ENABLED ?? "true",
				VITE_STUDENT_OAUTH_ENABLED:
					process.env.VITE_STUDENT_OAUTH_ENABLED ?? "true",
				VITE_STUDENT_RECORD_RETENTION_DAYS:
					process.env.VITE_STUDENT_RECORD_RETENTION_DAYS ?? "90",
				VITE_CLASSROOM_USAGE_ENABLED:
					process.env.VITE_CLASSROOM_USAGE_ENABLED ?? "false"
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
	await Promise.race([waitForChildExit(child), new Promise(resolve => setTimeout(resolve, 2_000))]);
}

const transientNavigationError =
	/Execution context was destroyed|Cannot find context with specified id|Navigating frame was detached/i;

async function runAxeAudit(page, url, interaction) {
	for (let attempt = 1; attempt <= 3; attempt += 1) {
		try {
			await page.goto(url, {
				timeout: 15_000,
				waitUntil: "domcontentloaded"
			});
			await page.waitForSelector("body", { timeout: 10_000 });
			await page.waitForFunction(() => document.body.innerText.trim().length > 0, {
				timeout: 10_000
			});
			await page.waitForFunction(
				() => document.querySelector("#app")?.hasAttribute("data-v-app"),
				{ timeout: 10_000 }
			);
			if (
				interaction === "open-student-sign-in"
				|| interaction === "open-student-navigation"
			) {
				const targetSelector = interaction === "open-student-sign-in"
					? ".student-access__trigger"
					: "#student-access-panel";
				let target = await page.$(targetSelector);
				if (!target || !(await target.boundingBox())) {
					await page.click(".site-toggler");
					await page.waitForFunction(() => {
						const navigation = document.querySelector("#siteNavbar");
						const studentAccess = document.querySelector(
							".student-access"
						);
						return navigation?.classList.contains("show")
							&& !navigation.classList.contains("collapsing")
							&& studentAccess instanceof HTMLElement
							&& studentAccess.getClientRects().length > 0;
					}, { timeout: 10_000 });
					target = await page.waitForSelector(targetSelector, {
						timeout: 10_000,
						visible: true
					});
				}
				if (interaction === "open-student-sign-in") {
					await page.click(targetSelector);
					await page.waitForSelector("#student-access-panel", {
						timeout: 10_000,
						visible: true
					});
				}
			}
			await new Promise(resolve => setTimeout(resolve, 250));
			await page.addScriptTag({ path: axeSourcePath });

			return await page.evaluate(async () => {
				return await axe.run(document, {
					resultTypes: ["violations"],
					runOnly: {
						type: "tag",
						values: ["wcag2a", "wcag2aa"]
					}
				});
			});
		} catch (error) {
			if (attempt === 3 || !(error instanceof Error) || !transientNavigationError.test(error.message)) {
				throw error;
			}

			console.warn(`a11y retrying after a development-server reload: ${url}`);
		}
	}

	throw new Error(`Unable to audit ${url}.`);
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
						console.log(`a11y checking: ${url} (${scenario.name}, ${viewport.name}, ${media.name})`);
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
							window.localStorage.setItem("vueuse-color-scheme", storedTheme);
						}, media.storedTheme);
						const result = await runAxeAudit(
							page,
							url,
							scenario.interaction
						);
						const violations = result.violations.filter(violation => violation.id !== "frame-tested");
						if (violations.length) {
							failures.push({
								context: `${scenario.name}/${viewport.name}/${media.name}`,
								url,
								violations
							});
							continue;
						}
						console.log(`a11y ok: ${url} (${scenario.name}, ${viewport.name}, ${media.name})`);
					} finally {
						await page.close().catch(() => {});
					}
				}
			}
		}
	}

	if (failures.length) {
		for (const failure of failures) {
			console.error(`\nAccessibility issues for ${failure.url} (${failure.context})`);
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
