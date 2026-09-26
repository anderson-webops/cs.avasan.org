import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const code = readFileSync(
	new URL("./fixtures/turtle-orbit.py", import.meta.url),
	"utf8"
);

async function pixels(page) {
	const data = await page.$eval(".turtle-canvas", canvas =>
		canvas.toDataURL()
	);
	return createHash("sha256").update(data).digest("hex");
}

async function checkpoint(page, text) {
	await page.waitForFunction(
		text =>
			document.querySelector(".output-panel")?.textContent.includes(text),
		{ timeout: 60000 },
		text
	);
	assert.doesNotMatch(
		await page.$eval(".output-panel", el => el.textContent),
		/Traceback/
	);
}

async function key(page, value) {
	await page.$eval(".turtle-canvas", el => el.focus({ preventScroll: true }));
	await page.keyboard.press(value);
	await page.evaluate(
		() =>
			new Promise(resolve =>
				requestAnimationFrame(() => requestAnimationFrame(resolve))
			)
	);
}

test(
	"search contrast and manual Turtle frames survive cooperative loops and resize",
	{ timeout: 180000 },
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
				"Chrome is required for the Turtle runtime regression"
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				// Keep pixel comparisons deterministic across repeated readbacks.
				args: ["--disable-accelerated-2d-canvas"]
			});
			const page = await browser.newPage();
			await page.setViewport({ width: 1440, height: 1000 });
			page.on("pageerror", error =>
				console.log("Browser error:", error.message)
			);
			await page.setRequestInterception(true);
			page.on("request", request => {
				if (request.interceptResolutionState().action === "disabled")
					return;
				const path = new URL(request.url()).pathname;
				if (path.startsWith("/api/"))
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: "{}"
					});
				else if (
					/\/(?:python-ide|ide)\/assets\/manifest\.json/.test(path)
				)
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: '{"assets":[]}'
					});
				else void request.continue();
			});
			await page.evaluateOnNewDocument(code => {
				if (window.top !== window) return;
				const date = new Date().toISOString();
				localStorage.setItem(
					"classes-python-ide-projects:anonymous",
					JSON.stringify([
						{
							_id: "local-tracer",
							title: "Orbit tracer regression",
							mode: "turtle",
							activeFileName: "main.py",
							files: [{ name: "main.py", content: code }],
							createdAt: date,
							updatedAt: date
						}
					])
				);
			}, code);
			await page.goto(`${origin}/ide`, { waitUntil: "networkidle2" });
			await page.waitForSelector(".cm-content");
			const modifier = await page.evaluate(() =>
				/Mac/.test(navigator.platform) ? "Meta" : "Control"
			);
			await page.click(".cm-content");
			await page.keyboard.down(modifier);
			await page.keyboard.press("f");
			await page.keyboard.up(modifier);
			await page.waitForSelector(".cm-search");
			for (const dark of [false, true]) {
				await page.evaluate(
					dark =>
						document.documentElement.classList.toggle("dark", dark),
					dark
				);
				const buttons = await page.$$eval(
					".cm-search button",
					elements => {
						const ctx = document
							.createElement("canvas")
							.getContext("2d");
						function luminance(color) {
							ctx.fillStyle = color;
							ctx.fillRect(0, 0, 1, 1);
							const rgb = [...ctx.getImageData(0, 0, 1, 1).data]
								.slice(0, 3)
								.map(v => {
									v /= 255;
									return v <= 0.04045
										? v / 12.92
										: ((v + 0.055) / 1.055) ** 2.4;
								});
							return (
								rgb[0] * 0.2126 +
								rgb[1] * 0.7152 +
								rgb[2] * 0.0722
							);
						}
						return elements
							.filter(el => el.name !== "close")
							.map(el => {
								const style = getComputedStyle(el);
								const ink = luminance(style.color),
									fill = luminance(style.backgroundColor);
								return {
									text: el.textContent,
									gradient: style.backgroundImage,
									contrast:
										(Math.max(ink, fill) + 0.05) /
										(Math.min(ink, fill) + 0.05)
								};
							});
					}
				);
				console.log(
					dark ? "Dark search buttons" : "Light search buttons",
					buttons
				);
				assert.ok(buttons.length >= 5);
				for (const button of buttons) {
					assert.equal(button.gradient, "none");
					assert.ok(
						button.contrast >= 4.5,
						`${button.text} contrast in ${dark ? "dark" : "light"} mode`
					);
				}
			}
			if (process.env.IDE_SEARCH_SCREENSHOT)
				await page.$eval(".cm-search", el =>
					el.scrollIntoView({ block: "center", behavior: "instant" })
				);
			if (process.env.IDE_SEARCH_SCREENSHOT)
				await (
					await page.$(".cm-search")
				).screenshot({ path: process.env.IDE_SEARCH_SCREENSHOT });
			await page.keyboard.press("Escape");
			await page.waitForSelector("button.run-control:not([disabled])");
			await page.setRequestInterception(false);
			await page.click("button.run-control");
			await checkpoint(page, "READY");
			const initial = await pixels(page);
			await checkpoint(page, "CHECKPOINT 999");
			assert.equal(
				await pixels(page),
				initial,
				"999 orbit movements must remain hidden"
			);
			await page.setViewport({ width: 1280, height: 900 });
			await page.evaluate(
				() =>
					new Promise(resolve =>
						requestAnimationFrame(() =>
							requestAnimationFrame(resolve)
						)
					)
			);
			await page.setViewport({ width: 1440, height: 1000 });
			await page.evaluate(
				() =>
					new Promise(resolve =>
						requestAnimationFrame(() =>
							requestAnimationFrame(resolve)
						)
					)
			);
			assert.equal(
				await pixels(page),
				initial,
				"resize must not publish pending orbit movements"
			);
			await page.click(".console-expand-toggle");
			await page.click(".console-expand-toggle");
			await page.evaluate(
				() =>
					new Promise(resolve =>
						requestAnimationFrame(() =>
							requestAnimationFrame(resolve)
						)
					)
			);
			assert.equal(
				await pixels(page),
				initial,
				"restoring the canvas preserves the published frame"
			);
			await key(page, "n");
			await checkpoint(page, "CHECKPOINT 1000");
			const published = await pixels(page);
			assert.notEqual(
				published,
				initial,
				"screen.update must publish the orbit"
			);
			await key(page, "n");
			await checkpoint(page, "CHECKPOINT 1100");
			assert.equal(
				await pixels(page),
				published,
				"further movement must wait for another update"
			);
			await key(page, "c");
			await checkpoint(page, "CLEARED LOGICALLY");
			assert.equal(
				await pixels(page),
				published,
				"clear and background changes cannot leak pending state"
			);
			await key(page, "h");
			await page.click(".console-expand-toggle");
			await checkpoint(page, "PUBLISHED WHILE HIDDEN");
			await page.click(".console-expand-toggle");
			await page.evaluate(
				() =>
					new Promise(resolve =>
						requestAnimationFrame(() =>
							requestAnimationFrame(resolve)
						)
					)
			);
			const cleared = await pixels(page);
			assert.notEqual(
				cleared,
				published,
				"explicit update publishes the clear and background"
			);
			await key(page, "u");
			assert.equal(
				await pixels(page),
				cleared,
				"repeated explicit updates retain the same scene"
			);
			await page.evaluate(() => {
				window.tracerFrames = new Set();
				window.sampleTracerFrames = true;
				function sample() {
					window.tracerFrames.add(
						document.querySelector(".turtle-canvas").toDataURL()
					);
					if (window.sampleTracerFrames)
						requestAnimationFrame(sample);
				}
				requestAnimationFrame(sample);
			});
			await key(page, "a");
			await checkpoint(page, "ANIMATING");
			await page.waitForFunction(() => window.tracerFrames.size >= 3);
			await page.evaluate(() => {
				window.sampleTracerFrames = false;
			});
			console.log(
				"Manual updates, resize isolation, background/clear, and resumed animation passed"
			);
			// Stop must remain responsive, and clearing must discard the frozen frame.
			await page.click("button.run-control");
			await page.$$eval(".result-panel .panel-link", buttons =>
				buttons
					.find(button => button.textContent.includes("Clear output"))
					.click()
			);
			assert.notEqual(await pixels(page), cleared);
			await page.close();
		} finally {
			await browser?.close();
			await server?.close();
			process.chdir(previousDirectory);
		}
	}
);
