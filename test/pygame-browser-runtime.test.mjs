import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import puppeteer from "puppeteer";
import { createServer } from "vite";

// Uses the real IDE and Pyodide runtime. No account or backend is required.
const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const code = `import pygame
from pygame import Surface, SRCALPHA

WIDTH = 160
HEIGHT = 120
card = Surface((40, 30))
assert card.get_size() == (40, 30)
assert card.get_at((0, 0)) == (0, 0, 0, 255)
assert tuple(card.fill("red")) == (0, 0, 40, 30)
pygame.draw.rect(card, "lime", (5, 5, 10, 10))
assert card.get_at((7, 7)) == (0, 255, 0, 255)
assert tuple(card.get_rect(center=(20, 15))) == (0, 0, 40, 30)
copy = card.copy()
copy.fill("blue")
assert card.get_at((1, 1)) == (255, 0, 0, 255)
copy.set_clip((5, 5, 10, 10))
copy.fill("yellow")
assert copy.get_at((1, 1)) == (0, 0, 255, 255)
assert copy.get_at((6, 6)) == (255, 255, 0, 255)
copy.set_clip(None)
copy.blit(card, (0, 0), (5, 5, 10, 10))
assert copy.get_at((2, 2)) == (0, 255, 0, 255)
alpha = Surface((20, 20), SRCALPHA)
assert alpha.get_at((0, 0)) == (0, 0, 0, 0)
alpha.fill((0, 0, 255, 128))
assert alpha.get_at((1, 1)) == (0, 0, 255, 128)
assert alpha.convert().get_at((0, 0)) == (0, 0, 255, 255)
opaque = Surface((1, 1))
opaque.fill((0, 0, 255, 128))
assert opaque.get_at((0, 0)) == (0, 0, 255, 255)
assert card.convert_alpha().get_flags() & SRCALPHA
scaled = pygame.transform.scale(card, (80, 60))
assert scaled.get_at((14, 14)) == (0, 255, 0, 255)
flipped = pygame.transform.flip(card, True, False)
assert flipped.get_at((32, 7)) == (0, 255, 0, 255)
pygame.transform.scale(card, card.get_size(), card)
assert card.get_at((7, 7)) == (0, 255, 0, 255)
empty = Surface((0, 0))
assert empty.copy().convert().convert_alpha().get_size() == (0, 0)
shapes = Surface((20, 20))
pygame.draw.circle(shapes, "lime", (10, 10), 6, 10)
assert shapes.get_at((10, 10)) == (0, 255, 0, 255)
keyed = Surface((10, 10))
keyed.fill("magenta")
keyed.set_colorkey("magenta")
copy.blit(keyed, (0, 0))
assert copy.get_at((2, 2)) == (0, 255, 0, 255)
for size in [(-1, 20), (5000, 1)]:
    try:
        Surface(size)
        raise AssertionError("Invalid dimensions accepted")
    except ValueError:
        pass
try:
    pygame.display
    raise AssertionError("Unavailable native display API accepted")
except AttributeError as error:
    assert "Pygame Zero" in str(error)
held_surfaces = []
try:
    for index in range(256):
        held_surfaces.append(Surface((1, 1)))
    raise AssertionError("Live surface limit not enforced")
except MemoryError:
    pass
held_surfaces.clear()

def draw():
    screen.fill("white")
    screen.blit(card, (10, 10))
    screen.blit(alpha, (60, 10))
    screen.blit(keyed, (100, 10))

print("SURFACE_TEST_PASS")
`;

test(
	"Pygame surfaces render in the real browser IDE and survive a rerun",
	{ timeout: 180000 },
	async () => {
		let server;
		let browser;
		const previousDirectory = process.cwd();
		try {
			process.chdir(root);
			server = await createServer({
				root,
				server: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			await server.listen();
			const address = server.httpServer.address();
			const installedChrome =
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				installedChrome,
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(path => path && existsSync(path));
			assert.ok(
				executablePath,
				"Install Chrome or set PUPPETEER_EXECUTABLE_PATH."
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true
			});
			const page = await browser.newPage();
			await page.setViewport({ width: 1440, height: 1000 });
			// Suppress network-only shared assets; this fixture uses generated images.
			await page.setRequestInterception(true);
			page.on("request", request => {
				if (request.interceptResolutionState().action === "disabled")
					return;
				if (new URL(request.url()).pathname === "/accounts/me") {
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: "{}"
					});
				} else if (
					/\/(?:python-ide|ide)\/assets\/manifest\.json/.test(
						request.url()
					)
				) {
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: JSON.stringify({
							assets: [
								{
									name: "images/fixture.svg",
									mimeType: "image/svg+xml",
									width: 1,
									height: 1,
									url: "/fixture.svg"
								}
							]
						})
					});
				} else if (request.url().endsWith("/fixture.svg")) {
					void request.respond({
						status: 200,
						contentType: "image/svg+xml",
						body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" />'
					});
				} else {
					void request.continue();
				}
			});
			await page.evaluateOnNewDocument(code => {
				if (window.top !== window) return;
				const now = new Date().toISOString();
				localStorage.setItem(
					"classes-python-ide-projects:anonymous",
					JSON.stringify([
						{
							_id: "local-surface-regression",
							title: "Surface regression",
							mode: "pgzero",
							shared: false,
							activeFileName: "main.py",
							files: [{ name: "main.py", content: code }],
							createdAt: now,
							updatedAt: now
						}
					])
				);
			}, code);
			await page.goto(`http://127.0.0.1:${address.port}/ide`, {
				waitUntil: "networkidle2"
			});
			await page.waitForSelector("button.run-control:not([disabled])");
			await page.setRequestInterception(false);
			for (let run = 0; run < 2; run += 1) {
				await page.click("button.run-control");
				try {
					await page.waitForFunction(
						() =>
							document
								.querySelector(".output-panel")
								?.textContent?.includes("SURFACE_TEST_PASS"),
						{ timeout: 90000 }
					);
					await page.waitForFunction(
						() => {
							const canvas = document.querySelector(
								"canvas.turtle-canvas--game"
							);
							if (!canvas) return false;
							const pixel = canvas
								.getContext("2d")
								.getImageData(
									(12 * canvas.width) / 160,
									(12 * canvas.height) / 120,
									1,
									1
								).data;
							return pixel[0] === 255 && pixel[1] === 0;
						},
						{ timeout: 15000 }
					);
				} catch (error) {
					throw new Error(
						`${error.message}\n${await page.$eval(".code-ide", element => element.innerText).catch(() => page.$eval("body", element => element.innerText))}`
					);
				}
				// Expanding the console must preserve the running game and its surfaces.
				await page.click(".console-expand-toggle");
				assert.equal(
					await page.$eval("button.run-control", element =>
						element.textContent.trim()
					),
					"Stop"
				);
				await page.click(".console-expand-toggle");
				await page.waitForFunction(() => {
					const canvas = document.querySelector(
						"canvas.turtle-canvas--game"
					);
					if (!canvas?.clientHeight) return false;
					const pixel = canvas
						.getContext("2d")
						.getImageData(
							(12 * canvas.width) / 160,
							(12 * canvas.height) / 120,
							1,
							1
						).data;
					return pixel[0] === 255 && pixel[1] === 0;
				});
				const pixels = await page.$eval(
					"canvas.turtle-canvas--game",
					canvas => {
						const context = canvas.getContext("2d");
						return [
							[12, 12],
							[17, 17],
							[65, 15],
							[105, 15]
						].map(([x, y]) => [
							...context.getImageData(
								(x * canvas.width) / 160,
								(y * canvas.height) / 120,
								1,
								1
							).data
						]);
					}
				);
				assert.deepEqual(pixels[0], [255, 0, 0, 255]);
				assert.deepEqual(pixels[1], [0, 255, 0, 255]);
				assert.deepEqual(pixels[2], [127, 127, 255, 255]);
				assert.deepEqual(pixels[3], [255, 255, 255, 255]);
				// Exercise Mu-style Play/Stop from the editor without refreshing the page.
				await page.click(".cm-content");
				await page.keyboard.press("F5");
				await page.waitForFunction(
					() =>
						document
							.querySelector("button.run-control")
							?.textContent?.trim() === "Run"
				);
			}
		} finally {
			await browser?.close();
			await server?.close();
			process.chdir(previousDirectory);
		}
	}
);
