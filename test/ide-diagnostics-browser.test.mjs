import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));

test(
	"IDE diagnostics preview real runtime failures and require consent",
	{ timeout: 240000 },
	async () => {
		let browser;
		let server;
		const previousDirectory = process.cwd();
		const reports = [];
		try {
			process.chdir(root);
			server = await createServer({
				root,
				server: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			await server.listen();
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(value => value && existsSync(value));
			assert.ok(
				executablePath,
				"Chrome is required for the browser smoke test"
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true
			});
			for (const [mode, title, code, expected] of [
				[
					"python",
					"Python diagnostics",
					"print(STUDENT_PRIVATE_VALUE)",
					"NameError"
				],
				[
					"turtle",
					"Turtle diagnostics",
					'import turtle\nraise ValueError("STUDENT_PRIVATE_VALUE")',
					"ValueError"
				],
				[
					"pgzero",
					"Pygame diagnostics",
					'import pygame\ncard = pygame.Surface((5, 5))\nraise ValueError("STUDENT_PRIVATE_VALUE")',
					"ValueError"
				],
				[
					"turtle",
					"Runtime unavailable",
					"import turtle",
					"runtime-unavailable"
				],
				[
					"karel",
					"Karel diagnostics",
					"public class MyProgram extends SuperKarel { public void run() { move(); } }",
					"None"
				],
				[
					"java",
					"BlueJ diagnostics",
					'public class Main { public static void main(String[] args) { System.out.println("READY"); } }',
					"None"
				]
			]) {
				console.log(`Checking ${mode} diagnostics`);
				const context = await browser.createBrowserContext();
				const page = await context.newPage();
				page.on("console", message => {
					if (message.type() === "error")
						console.log("Browser:", message.text());
				});
				page.on("pageerror", error =>
					console.log("Page error:", error.message)
				);
				page.on("requestfailed", request =>
					console.log(
						"Request failed:",
						request.url(),
						request.failure()?.errorText
					)
				);
				await page.setViewport({ width: 1200, height: 1000 });
				await page.setRequestInterception(true);
				page.on("request", request => {
					if (
						!request.interceptResolutionState ||
						request.interceptResolutionState().action === "disabled"
					)
						return;
					const path = new URL(request.url()).pathname;
					if (
						title === "Runtime unavailable" &&
						request
							.url()
							.startsWith("https://cdn.jsdelivr.net/pyodide/")
					) {
						void request.abort();
					} else if (
						path === "/api/ide-reports" &&
						request.method() === "POST"
					) {
						const body = JSON.parse(request.postData());
						reports.push(body);
						void request.respond({
							status: 201,
							contentType: "application/json",
							body: JSON.stringify({
								referenceID: body.diagnostics.referenceID
							})
						});
					} else if (path.startsWith("/api/")) {
						void request.respond({
							status: 200,
							contentType: "application/json",
							body: "{}"
						});
					} else if (
						/\/(?:python-ide|ide)\/assets\/manifest\.json/.test(
							path
						)
					) {
						void request.respond({
							status: 200,
							contentType: "application/json",
							body: '{"assets":[]}'
						});
					} else void request.continue();
				});
				await page.evaluateOnNewDocument(
					({ mode, title, code }) => {
						if (window.top !== window) return;
						const name = ["java", "karel"].includes(mode)
							? "Main.java"
							: "main.py";
						const date = new Date().toISOString();
						localStorage.setItem(
							"classes-python-ide-projects:anonymous",
							JSON.stringify([
								{
									_id: "local-diagnostics",
									title,
									mode,
									activeFileName: name,
									files: [{ name, content: code }],
									shared: false,
									createdAt: date,
									updatedAt: date
								}
							])
						);
					},
					{ mode, title, code }
				);
				await page.goto(`${origin}/ide`, { waitUntil: "networkidle2" });
				await page.waitForSelector(".cm-content");
				await page.waitForSelector(
					"button.run-control:not([disabled])"
				);
				// Chrome worker imports stall under Puppeteer page-level interception.
				// Leave runtime traffic untouched, then intercept only the report POST.
				await page.setRequestInterception(false);
				if (expected === "runtime-unavailable")
					await page.setOfflineMode(true);
				await page.click("button.run-control");
				try {
					await page.waitForFunction(
						() =>
							/Run failed|Run complete|Karel world ready|Run finished with issues|No Java file|No Python file/.test(
								document.querySelector(
									".code-ide-status strong"
								)?.textContent ?? ""
							),
						{ timeout: 60000 }
					);
				} catch (error) {
					await page.click(
						".ide-diagnostics-controls > button:nth-child(2)"
					);
					await page.waitForSelector(".ide-report-body pre");
					console.log(
						"Stalled diagnostics:",
						await page.$eval(
							".ide-report-body pre",
							element => element.textContent
						)
					);
					throw new Error(
						`${mode}: ${await page.$eval(".code-ide-status", element => element.textContent)}; ${await page.$eval(".output-panel", element => element.textContent)}`,
						{ cause: error }
					);
				}
				await page.setOfflineMode(false);
				await page.setRequestInterception(true);
				const count = reports.length;
				await page.click(
					".ide-diagnostics-controls > button:nth-child(2)"
				);
				await page.waitForSelector(
					".ide-diagnostics-controls dialog[open]"
				);
				const preview = await page.$eval(
					".ide-report-body pre",
					element => JSON.parse(element.textContent)
				);
				assert.equal(
					preview.diagnostics.errorType,
					expected === "runtime-unavailable" ? "TypeError" : expected,
					JSON.stringify(preview)
				);
				assert.equal(
					preview.diagnostics.mode,
					mode === "java" ? "bluej" : mode
				);
				assert.ok(
					!JSON.stringify(preview).includes("STUDENT_PRIVATE_VALUE")
				);
				if (expected === "runtime-unavailable") {
					assert.equal(preview.diagnostics.category, "ide-runtime");
					assert.equal(preview.diagnostics.stage, "loading-runtime");
				} else if (["python", "turtle", "pgzero"].includes(mode)) {
					assert.equal(preview.diagnostics.category, "student-code");
					assert.equal(preview.diagnostics.stage, "executing");
					assert.match(
						preview.diagnostics.runtime.pythonVersion,
						/^3\.14\./
					);
					assert.ok(
						preview.diagnostics.stack.some(
							frame => frame.scope === "project"
						)
					);
				}
				assert.equal(reports.length, count, "Preview must not submit");
				assert.equal(
					await page.$eval(
						".ide-report-actions button:last-child",
						element => element.disabled
					),
					true
				);
				await page.click(
					".ide-report-body fieldset > label:last-child input"
				);
				await page.click(".ide-report-actions button:last-child");
				await page.waitForFunction(() =>
					document
						.querySelector(".ide-report-body")
						?.textContent.includes("Report saved. Reference:")
				);
				assert.deepEqual(reports.at(-1), preview);
				if (
					title === "Turtle diagnostics" &&
					process.env.IDE_DIAGNOSTICS_SCREENSHOT
				)
					await page.screenshot({
						path: process.env.IDE_DIAGNOSTICS_SCREENSHOT
					});
				await page.keyboard.press("Escape");
				assert.equal(
					await page.$eval(
						".ide-diagnostics-controls dialog",
						element => element.open
					),
					false
				);
				await context.close();
			}
			// The admin page renders report text safely, including a hostile description.
			const admin = await browser.newPage();
			await admin.setRequestInterception(true);
			admin.on("request", request => {
				if (
					!request.interceptResolutionState ||
					request.interceptResolutionState().action === "disabled"
				)
					return;
				const path = new URL(request.url()).pathname;
				let data;
				if (path === "/api/accounts/me")
					data = { adminID: "fixture-admin" };
				else if (path === "/api/admins/loggedin")
					data = {
						currentAdmin: {
							_id: "fixture-admin",
							name: "Test admin"
						}
					};
				else if (path === "/api/pond-paddlers/rooms")
					data = { rooms: [] };
				else if (path === "/api/admins/classroom-analytics/summary") {
					const activity = {
						totals: { courseOpens: 0, ideOpens: 0, graphOpens: 0 },
						daily: [],
						courses: []
					};
					data = {
						generatedAt: new Date().toISOString(),
						period: {
							days: 30,
							startDate: "2026-09-01",
							endDate: "2026-09-26"
						},
						retentionDays: 90,
						siteActivity: { cs: activity, math: activity },
						studentWork: {
							recentWindowDays: 30,
							activeAccounts: 0,
							accountsWithRecentSignIn: 0,
							studentsWithProjects: 0,
							studentsWithRecentProjectUpdates: 0,
							activeProjects: 0,
							recentlyUpdatedProjects: 0
						}
					};
				} else if (path === "/api/ide-reports")
					data = {
						reports: [
							{
								...reports[0],
								description:
									'<img src=x onerror="window.REPORT_XSS=true">',
								status: "new",
								referenceID: reports[0].diagnostics.referenceID,
								createdAt: new Date().toISOString()
							}
						],
						nextCursor: null
					};
				if (data)
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: JSON.stringify(data)
					});
				else if (path.startsWith("/api/"))
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: "{}"
					});
				else void request.continue();
			});
			await admin.goto(`${origin}/admin`, {
				waitUntil: "networkidle2"
			});
			await admin.waitForSelector(".report-inbox article");
			assert.ok(
				await admin.$eval(".report-description", element =>
					element.textContent.includes("<img")
				)
			);
			assert.equal(
				await admin.evaluate(() => window.REPORT_XSS),
				undefined
			);
			assert.equal(await admin.$(".report-description img"), null);
			await admin.close();
		} finally {
			await browser?.close();
			await server?.close();
			process.chdir(previousDirectory);
		}
	}
);
