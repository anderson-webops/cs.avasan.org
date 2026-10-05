import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { unzipSync, strFromU8 } from "fflate";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import {
	createProject,
	lessons
} from "../front-end/scripts/scratch/generate-projects.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
test(
	"Scratch imports classroom projects, runs events and exports reusable files in isolation",
	{ timeout: 120000 },
	async () => {
		let server, browser;
		const previous = process.cwd();
		const files = await mkdtemp(
			path.join(tmpdir(), "classes-scratch-browser-")
		);
		try {
			process.chdir(root);
			const headerMaps = await readFile(
				new URL(
					"../deploy/native/cs-avasan-ide-security-headers.conf",
					import.meta.url
				),
				"utf8"
			);
			const productionCsp = headerMaps
				.split("\n")
				.find(line =>
					line.startsWith("add_header Content-Security-Policy")
				)
				?.split('"')[1];
			assert.ok(productionCsp);
			server = await createServer({
				root,
				plugins: [
					{
						name: "production-ide-policy-fixture",
						configureServer(server) {
							server.middlewares.use(
								(request, response, next) => {
									if (request.url?.startsWith("/ide?"))
										response.setHeader(
											"Content-Security-Policy",
											productionCsp
										);
									next();
								}
							);
						}
					}
				],
				server: { host: "127.0.0.1", port: 5198, strictPort: true }
			});
			await server.listen();
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome"
			].find(p => p && existsSync(p));
			browser = await puppeteer.launch({
				executablePath,
				headless: true
			});
			const page = await browser.newPage();
			await page.setViewport({ width: 1440, height: 1080 });
			const errors = [];
			page.on("pageerror", error => errors.push(error.message));
			page.on("dialog", dialog => dialog.accept());
			await page.setRequestInterception(true);
			page.on("request", request => {
				if (new URL(request.url()).pathname.startsWith("/api/"))
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: "{}"
					});
				else void request.continue();
			});
			const client = await page.createCDPSession();
			await client.send("Browser.setDownloadBehavior", {
				behavior: "allow",
				downloadPath: files
			});
			await page.goto(
				"http://127.0.0.1:5198/ide?mode=scratch&starter=two-arrows",
				{ waitUntil: "networkidle2" }
			);
			async function openProjectMenu() {
				if (!(await page.$eval(".scratch-project-menu", element => element.open))) {
					await page.locator(".scratch-project-menu summary").click();
				}
			}
			const loaded = () =>
				page.waitForFunction(
					() =>
						document
							.querySelector(".scratch-status[role=status]")
							?.textContent.includes("Project open"),
					{ timeout: 20000 }
				);
			await loaded();
			const frame = page.frames().find(f => f !== page.mainFrame());
			assert.equal(
				await page.$eval(".scratch-workspace iframe", e =>
					e.getAttribute("sandbox")
				),
				"allow-scripts allow-downloads"
			);
			assert.equal(
				await frame.evaluate(() => {
					try {
						void parent.document.body;
						return false;
					} catch {
						return true;
					}
				}),
				true
			);
			await frame.click('input[placeholder="x"]');
			// Leave numeric inputs and focus the actual stage before a game key.
			await frame.click("canvas");
			await page.keyboard.press("ArrowRight");
			await frame.waitForFunction(
				() =>
					document.querySelector('input[placeholder="x"]')?.value ===
					"10"
			);
			// Editing a sprite position is unsaved student work; cancelling
			// replacement must preserve it.
			await frame.locator('input[placeholder="x"]').fill("20");
			await page.keyboard.press("Enter");
			await frame.click("canvas");
			await page.waitForFunction(() => document.querySelector(".scratch-status[role=status]")?.textContent.includes("Unsaved changes"));
			page.removeAllListeners("dialog");
			const cancelledReplacement = new Promise(resolve => page.once("dialog", async dialog => {
				await dialog.dismiss();
				resolve();
			}));
			await openProjectMenu();
			await page.locator("::-p-text(New project)").click();
			await cancelledReplacement;
			assert.equal(await page.$eval(".scratch-project-menu select", select => select.value), "two-arrows");
			assert.equal(await frame.$eval('input[placeholder="x"]', input => input.value), "20");
			page.on("dialog", dialog => dialog.accept());
			await page.locator("::-p-text(Download project)")
				.click();
			await page.waitForFunction(() =>
				document
					.querySelector(".scratch-status[role=status]")
					?.textContent.includes("Downloaded")
			);
			const exported = path.join(files, "Two Arrows.sb3");
			for (let n = 0; n < 30 && !existsSync(exported); n++)
				await new Promise(resolve => setTimeout(resolve, 100));
			const project = JSON.parse(
				strFromU8(
					unzipSync(new Uint8Array(await readFile(exported)))[
						"project.json"
					]
				)
			);
			assert.equal(project.targets.find(t => t.name === "Player").x, 20);
			// The official editor validator, not just our own schema checks, opens
			// every starter and every teacher reference completion.
			for (const lesson of lessons)
				for (const solution of [false, true]) {
					const filename = path.join(
						files,
						`${lesson.id}${solution ? "-solution" : ""}.sb3`
					);
					await writeFile(
						filename,
						createProject(lesson.id, solution).archive
					);
					await openProjectMenu();
					await (
						await page.$(".file-control input")
					).uploadFile(filename);
					await loaded();
				}
			// September 30 first lesson: sprite clicks are local, size changes
			// accumulate, and the documented green-flag reset restores the scene.
			await openProjectMenu();
			await page.select(".scratch-project-menu select", "animate-word");
			await page.locator("::-p-text(Open starter)").click();
			await loaded();
			const stageCanvas = await frame.$("canvas");
			const stageBox = await stageCanvas.boundingBox();
			assert.ok(stageBox);
			const clickLetterE = () =>
				page.mouse.click(
					stageBox.x + stageBox.width * (0.5 + 135 / 480),
					stageBox.y + stageBox.height / 2
				);
			const nameFile = path.join(files, "Animate Your Name.sb3");
			async function exportName() {
				await rm(nameFile, { force: true });
				await page.locator("::-p-text(Download project)")
					.click();
				for (let n = 0; n < 50 && !existsSync(nameFile); n++)
					await new Promise(resolve => setTimeout(resolve, 100));
				return JSON.parse(
					strFromU8(
						unzipSync(new Uint8Array(await readFile(nameFile)))[
							"project.json"
						]
					)
				);
			}
			await clickLetterE();
			await new Promise(resolve => setTimeout(resolve, 250));
			let nameProject = await exportName();
			assert.equal(
				nameProject.targets.find(target => target.name === "E").size,
				80
			);
			assert.equal(
				nameProject.targets.find(target => target.name === "C").size,
				70
			);
			assert.equal(
				nameProject.targets.find(target => target.isStage)
					.currentCostume,
				1
			);
			await clickLetterE();
			await new Promise(resolve => setTimeout(resolve, 250));
			nameProject = await exportName();
			assert.equal(
				nameProject.targets.find(target => target.name === "E").size,
				90
			);
			await frame.locator('[title="Go"]').click();
			await new Promise(resolve => setTimeout(resolve, 250));
			nameProject = await exportName();
			assert.equal(
				nameProject.targets.find(target => target.name === "E").size,
				70
			);
			assert.equal(
				nameProject.targets.find(target => target.isStage)
					.currentCostume,
				0
			);
			await openProjectMenu();
			await page.select(".scratch-project-menu select", "dress-up");
			await page.locator("::-p-text(Open starter)").click();
			await loaded();
			// Independent work opens a fresh workspace through the host, even
			// though the embedded upstream New menu is intentionally disabled.
			await openProjectMenu();
			await page.locator("::-p-text(New project)").click();
			await loaded();
			const blankFile = path.join(files, "Independent Mini-Game.sb3");
			await page.locator("::-p-text(Download project)").click();
			for (let n = 0; n < 50 && !existsSync(blankFile); n++)
				await new Promise(resolve => setTimeout(resolve, 100));
			const blankProject = JSON.parse(strFromU8(unzipSync(new Uint8Array(await readFile(blankFile)))["project.json"]));
			assert.equal(blankProject.targets.length, 2);
			for (const target of blankProject.targets) assert.deepEqual(target.blocks, {});
			await openProjectMenu();
			await (await page.$(".file-control input")).uploadFile(blankFile);
			await loaded();
			// The course's direct launch opens the same code-free project.
			await page.goto("http://127.0.0.1:5198/ide?mode=scratch&starter=blank", { waitUntil: "networkidle2" });
			await loaded();
			assert.equal(await page.$eval('.scratch-toolbar input', input => input.value), "Independent Mini-Game");
			const blankFrame = page.frames().find(f => f !== page.mainFrame());
			await blankFrame.locator("::-p-text(Costumes)").click();
			await blankFrame.waitForSelector("canvas");
			await page.screenshot({
				path: "/tmp/scratch-classroom-editor.png"
			});
			assert.deepEqual(errors, []);
		} finally {
			await browser?.close();
			await server?.close();
			process.chdir(previous);
			await rm(files, { recursive: true, force: true });
		}
	}
);
