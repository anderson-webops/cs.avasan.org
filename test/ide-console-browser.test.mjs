import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import { test } from "node:test";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));

test(
	"keeps the IDE console scrollable and expands without losing workspace state",
	{ timeout: 120000 },
	async () => {
		let browser;
		let server;
		const previousDirectory = process.cwd();
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
				"Chrome is required for the console layout test"
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true
			});
			for (const mode of [
				"turtle",
				"pgzero",
				"karel",
				"java",
				"python",
				"data"
			]) {
				const context = await browser.createBrowserContext();
				const page = await context.newPage();
				await page.setRequestInterception(true);
				page.on("request", request => {
					if (
						request.interceptResolutionState().action === "disabled"
					)
						return;
					const path = new URL(request.url()).pathname;
					if (path.startsWith("/api/")) {
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
					} else {
						void request.continue();
					}
				});
				await page.evaluateOnNewDocument(mode => {
					if (window.top !== window) return;
					const name = ["java", "karel"].includes(mode)
						? "Main.java"
						: "main.py";
					const date = new Date().toISOString();
					localStorage.setItem(
						"classes-python-ide-projects:anonymous",
						JSON.stringify([
							{
								_id: "local-console",
								title: "Console layout",
								mode,
								activeFileName: name,
								files: [
									{
										name,
										content: ["java", "karel"].includes(
											mode
										)
											? "class Main { static void move(int distance) {} static void run() { move(); } }"
											: "class OrbitSim:\n    def move(self, distance): pass\norb = OrbitSim()\norb.move()"
									}
								],
								createdAt: date,
								updatedAt: date
							}
						])
					);
				}, mode);
				await page.goto(`${origin}/ide`, { waitUntil: "networkidle2" });
				await page.waitForSelector(".cm-content");
				await page.waitForSelector(".cm-lintRange-warning");
				await page.hover(".cm-lintRange-warning");
				await page.waitForSelector(".cm-tooltip-lint");
				assert.match(
					await page.$eval(
						".cm-tooltip-lint",
						element => element.textContent
					),
					/(?:missing required argument|requires at least 1 argument)/
				);
				assert.match(
					await page.$eval(
						".output-panel",
						element => element.textContent
					),
					/Output will appear here after a run/
				);
				const originalCode = await page.$eval(
					".cm-content",
					element => element.textContent
				);
				const editorModifier = await page.evaluate(() =>
					/Mac/.test(navigator.platform) ? "Meta" : "Control"
				);
				await page.click(".cm-content");
				await page.keyboard.down(editorModifier);
				await page.keyboard.press("a");
				await page.keyboard.up(editorModifier);
				// CodeMirror's textContent omits line breaks between its line elements.
				const correctedCode = ["java", "karel"].includes(mode)
					? "class Main { static void move(int distance) {} static void run() { move(1); } }"
					: "class OrbitSim:\n    def move(self, distance): pass\norb = OrbitSim()\norb.move(1)";
				await page.keyboard.sendCharacter(correctedCode);
				await page.waitForFunction(
					() => !document.querySelector(".cm-lintRange-warning")
				);
				assert.notEqual(
					await page.$eval(
						".cm-content",
						element => element.textContent
					),
					originalCode
				);
				// A caret inserts indentation at its own position; highlighted text
				// still indents the whole selected line, with Shift+Tab undoing it.
				await page.keyboard.press("Tab");
				assert.equal(
					await page.$eval(
						".cm-content",
						element => element.textContent
					),
					correctedCode.replaceAll("\n", "") + "    "
				);
				await page.keyboard.down("Shift");
				await page.keyboard.press("ArrowLeft");
				await page.keyboard.up("Shift");
				await page.keyboard.press("Tab");
				assert.equal(
					await page.$eval(
						".cm-line:last-child",
						element => element.textContent
					),
					"    " + correctedCode.split("\n").at(-1) + "    "
				);
				await page.keyboard.down("Shift");
				await page.keyboard.press("Tab");
				await page.keyboard.up("Shift");
				assert.equal(
					await page.$eval(
						".cm-line:last-child",
						element => element.textContent
					),
					correctedCode.split("\n").at(-1) + "    "
				);
				// Exercise the real layout with bounded synthetic output, without downloading
				// a Python runtime or coupling a scrolling regression to program execution.
				await page.$eval(".output-panel", element => {
					const output = document.createElement("pre");
					output.className = "output-line output-line--stderr";
					output.textContent = `${Array.from({ length: 80 }, (_, index) => `Traceback fixture line ${index + 1}`).join("\n")}\nTypeError: example missing argument\n${"long_value".repeat(80)}\nEND OF TRACEBACK`;
					element.append(output);
				});
				await page.$eval(".stdin-panel textarea", element => {
					element.value = "Preserve this input";
					element.dispatchEvent(
						new Event("input", { bubbles: true })
					);
				});
				for (const [width, height] of [
					[1440, 900],
					[1920, 1080],
					[1000, 660],
					[820, 720],
					[390, 844]
				]) {
					await page.setViewport({ width, height });
					const context = `${mode} at ${width}x${height}`;
					console.log(context);
					await page.$eval(".result-panel", element =>
						element.scrollIntoView({
							block: "center",
							behavior: "instant"
						})
					);
					if (["turtle", "pgzero"].includes(mode)) {
						assert.ok(
							await page.$eval(".turtle-canvas", canvas => {
								const bounds = canvas.getBoundingClientRect();
								const viewport = canvas
									.closest(".result-visuals")
									.getBoundingClientRect();
								return (
									bounds.height > 0 &&
									bounds.top >= viewport.top &&
									bounds.bottom <= viewport.bottom + 1 &&
									document.elementFromPoint(
										bounds.x + bounds.width / 2,
										bounds.y + bounds.height / 2
									) === canvas
								);
							}),
							`${context}: the full canvas and its center must stay accessible`
						);
					}
					const bounds = await page.evaluate(() => {
						const console = document.querySelector(".output-panel");
						const panel = document.querySelector(".result-panel");
						const rect = console.getBoundingClientRect();
						const parent = panel.getBoundingClientRect();
						return {
							bottom: rect.bottom,
							parentBottom: parent.bottom,
							height: console.clientHeight,
							scrollHeight: console.scrollHeight,
							width: console.clientWidth,
							scrollWidth: console.scrollWidth
						};
					});
					assert.ok(
						bounds.bottom <= bounds.parentBottom + 1,
						`${context}: console bottom is clipped: ${JSON.stringify(bounds)}`
					);
					assert.ok(
						bounds.height >= 60,
						`${context}: console must have usable height`
					);
					assert.ok(
						bounds.scrollHeight > bounds.height,
						`${context}: fixture should overflow`
					);
					assert.ok(
						bounds.scrollWidth <= bounds.width + 1,
						`${context}: long values should wrap`
					);
					await page.$eval(".output-panel", element => {
						element.scrollTop = 0;
						element.focus({ preventScroll: true });
					});
					const scrollY = await page.evaluate(() => window.scrollY);
					const box = await page.$eval(".output-panel", element => {
						const rect = element.getBoundingClientRect();
						return {
							x: rect.x + rect.width / 2,
							y: rect.y + rect.height / 2
						};
					});
					await page.mouse.move(box.x, box.y);
					await page.mouse.wheel({ deltaY: 180 });
					await page.waitForFunction(
						() =>
							document.querySelector(".output-panel").scrollTop >
							0
					);
					await page.keyboard.press("End");
					await page.waitForFunction(() => {
						const element = document.querySelector(".output-panel");
						return (
							element.scrollTop + element.clientHeight >=
							element.scrollHeight - 2
						);
					});
					assert.equal(
						await page.evaluate(() => window.scrollY),
						scrollY,
						`${context}: console scrolling must not move the page`
					);
					await page.mouse.click(box.x, box.y);
					assert.equal(
						await page.evaluate(() => document.activeElement.id),
						"ide-console-output",
						`${context}: clicking console text should focus its shortcuts`
					);
					for (const modifier of ["Meta", "Control"]) {
						await page.keyboard.down(modifier);
						await page.keyboard.press("a");
						await page.keyboard.up(modifier);
						assert.ok(
							await page.$eval(".output-panel", element => {
								const selection = window.getSelection();
								return (
									selection.rangeCount === 1 &&
									element.contains(
										selection.getRangeAt(0)
											.commonAncestorContainer
									) &&
									selection.getRangeAt(0).cloneContents()
										.textContent === element.textContent
								);
							}),
							`${context}: ${modifier}+A must select only console output`
						);
					}
					await page.click(".console-expand-toggle");
					assert.equal(
						await page.$eval(".console-expand-toggle", element =>
							element.getAttribute("aria-expanded")
						),
						"true"
					);
					assert.ok(
						(await page.$eval(
							".output-panel",
							element => element.clientHeight
						)) > bounds.height,
						`${context}: expansion must increase console height`
					);
					await page.click(".console-expand-toggle");
					assert.equal(
						await page.$eval(
							".stdin-panel textarea",
							element => element.value
						),
						"Preserve this input"
					);
					assert.match(
						await page.$eval(
							".output-panel",
							element => element.textContent
						),
						/END OF TRACEBACK/
					);
					if (
						process.env.IDE_CONSOLE_SCREENSHOT &&
						mode === "turtle" &&
						width === 1440
					) {
						await page.$eval(".output-panel", element => {
							element.scrollTop = element.scrollHeight;
						});
						await (
							await page.$(".result-panel")
						).screenshot({
							path: process.env.IDE_CONSOLE_SCREENSHOT
						});
					}
				}
				await context.close();
			}
		} finally {
			await browser?.close();
			await server?.close();
			process.chdir(previousDirectory);
		}
	}
);
