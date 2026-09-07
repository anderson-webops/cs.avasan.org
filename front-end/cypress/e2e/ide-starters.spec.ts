/// <reference types="cypress" />

type StarterKind =
	"canvas" | "data" | "java" | "karel" | "python" | "readiness";

interface StarterScenario {
	button: string;
	expectedOutput?: string;
	kind: StarterKind;
	title: string;
}

interface StarterResult {
	detail: string;
	name: string;
	passed: boolean;
}

const starterScenarios: StarterScenario[] = [
	{
		button: "Demo Java",
		expectedOutput: "Hello, Java!",
		kind: "java",
		title: "Java Practice"
	},
	{
		button: "Java Outline",
		expectedOutput: "Student: 0",
		kind: "java",
		title: "Java Outline"
	},
	{
		button: "BlueJ Java Project",
		expectedOutput: "Average: 91",
		kind: "java",
		title: "BlueJ Java Project"
	},
	{
		button: "Demo Karel Java",
		kind: "karel",
		title: "Karel Java World"
	},
	{
		button: "Karel Java Outline",
		kind: "karel",
		title: "Karel Java Outline"
	},
	{
		button: "Python Level 1 Outline",
		kind: "readiness",
		title: "Python Level 1 Outline"
	},
	{
		button: "Demo Python",
		expectedOutput: "Nice to meet you, Ada.",
		kind: "python",
		title: "Python Practice"
	},
	{
		button: "Demo PyGame Zero",
		kind: "canvas",
		title: "PyGame Zero Game"
	},
	{
		button: "PyGame Zero Outline",
		kind: "canvas",
		title: "PyGame Zero Outline"
	},
	{
		button: "Color Circle Art",
		kind: "canvas",
		title: "Color Circle Art"
	},
	{
		button: "Picasso Keyboard Painter",
		kind: "canvas",
		title: "Picasso Keyboard Painter"
	},
	{
		button: "Triangle Motion Starter",
		kind: "canvas",
		title: "Triangle Motion Starter"
	},
	{
		button: "Neon Trail Painter",
		kind: "canvas",
		title: "Neon Trail Painter"
	},
	{
		button: "Firework Festival",
		kind: "canvas",
		title: "Firework Festival"
	},
	{
		button: "Spiral Galaxy",
		kind: "canvas",
		title: "Spiral Galaxy"
	},
	{
		button: "Turtle Race Day",
		kind: "canvas",
		title: "Turtle Race Day"
	},
	{
		button: "Flower Garden Clicker",
		kind: "canvas",
		title: "Flower Garden Clicker"
	},
	{
		button: "Maze Explorer",
		kind: "canvas",
		title: "Maze Explorer"
	},
	{
		button: "Classroom Turtle Studio",
		kind: "canvas",
		title: "Classroom Turtle Studio"
	},
	{
		button: "Demo Python Turtle",
		kind: "canvas",
		title: "Turtle Drawing"
	},
	{
		button: "Demo Data / AI",
		expectedOutput: "Average growth: 15.25",
		kind: "data",
		title: "Data / AI Notebook"
	}
];

function selectedStarterScenarios(filters: Record<string, unknown>) {
	const requestedStarter = String(filters.IDE_STARTER ?? "").trim();
	const requestedKinds = String(filters.IDE_STARTER_KINDS ?? "")
		.split(/[+|]/)
		.map(value => value.trim())
		.filter(Boolean);
	const selected = starterScenarios.filter(
		scenario =>
			(!requestedStarter || scenario.button === requestedStarter) &&
			(!requestedKinds.length || requestedKinds.includes(scenario.kind))
	);
	if (!selected.length) {
		throw new Error(
			"The requested IDE starter smoke filter matched nothing."
		);
	}
	return selected;
}

function delay(milliseconds: number) {
	return new Cypress.Promise<void>(resolve => {
		window.setTimeout(resolve, milliseconds);
	});
}

async function waitFor(
	condition: () => boolean,
	description: string,
	timeoutMs = 120_000
) {
	const startedAt = Date.now();
	while (Date.now() - startedAt < timeoutMs) {
		if (condition()) return;
		await delay(100);
	}
	throw new Error(`Timed out waiting for ${description}.`);
}

function elementText(element: Element | null) {
	return element?.textContent?.trim() ?? "";
}

function runButton(document: Document) {
	return document.querySelector<HTMLButtonElement>("button.run-control");
}

function activeProjectTitle(document: Document) {
	return elementText(
		document.querySelector(".project-button.is-active span")
	);
}

function outputText(document: Document) {
	return elementText(document.querySelector(".output-panel"));
}

function runtimeStatus(document: Document) {
	return elementText(document.querySelector(".code-ide-status strong"));
}

function canvasSnapshot(document: Document) {
	return (
		document
			.querySelector<HTMLCanvasElement>(".turtle-canvas")
			?.toDataURL() ?? ""
	);
}

async function clickStarterButton(document: Document, label: string) {
	const menuToggle = document.querySelector<HTMLButtonElement>(
		'button[aria-label="More project options"]'
	);
	if (!menuToggle)
		throw new Error("The project starter menu is unavailable.");
	if (menuToggle.getAttribute("aria-expanded") !== "true") menuToggle.click();

	let button: HTMLButtonElement | undefined;
	await waitFor(
		() => {
			button = [
				...document.querySelectorAll<HTMLButtonElement>(
					".project-create-menu button"
				)
			].find(candidate => elementText(candidate) === label);
			return Boolean(button);
		},
		`${label} to appear in the starter menu`,
		10_000
	);
	if (!button) throw new Error(`Starter button ${label} is unavailable.`);
	button.click();
}

async function stopAndVerifyFrozen(document: Document) {
	const button = runButton(document);
	if (!button || elementText(button) !== "Stop") return;

	button.click();
	await waitFor(
		() => elementText(runButton(document)) === "Run",
		"the stopped Run control",
		10_000
	);
	await delay(100);
	const stoppedSnapshot = canvasSnapshot(document);
	await delay(250);
	if (canvasSnapshot(document) !== stoppedSnapshot) {
		throw new Error("The canvas continued changing after Stop.");
	}
}

async function runStarterScenario(
	document: Document,
	scenario: StarterScenario,
	assetRequests: string[]
) {
	await clickStarterButton(document, scenario.button);
	await waitFor(
		() => activeProjectTitle(document) === scenario.title,
		`${scenario.title} to become active`,
		20_000
	);

	const button = runButton(document);
	if (!button) throw new Error("The Run control is unavailable.");
	await waitFor(
		() => !button.disabled,
		"the Run control to become enabled",
		10_000
	);

	if (scenario.kind === "readiness") {
		await waitFor(
			() =>
				elementText(
					document.querySelector(
						'.code-editor-host [contenteditable="true"]'
					)
				).includes("import turtle"),
			"the guided outline source to finish loading",
			10_000
		);
		if (elementText(button) !== "Run") {
			throw new Error(
				"The guided outline did not reach runtime readiness."
			);
		}
		return "ready for student completion; execution intentionally skipped";
	}

	if (scenario.kind === "python") {
		const input = document.querySelector<HTMLTextAreaElement>(
			'textarea[placeholder*="Scanner value"]'
		);
		if (!input) throw new Error("The IDE input field is unavailable.");
		input.value = "Ada";
		const InputEvent = document.defaultView?.Event ?? Event;
		input.dispatchEvent(new InputEvent("input", { bubbles: true }));
	}

	const initialCanvas =
		scenario.kind === "canvas" ? canvasSnapshot(document) : "";
	if (scenario.button === "Demo PyGame Zero" && assetRequests.length) {
		throw new Error(
			"PyGame course media loaded before the explicit Run action."
		);
	}

	button.click();
	const expectedStatus =
		scenario.kind === "canvas"
			? /^(?:Drawing ready|Game running)$/
			: scenario.kind === "karel"
				? /^Karel world ready$/
				: scenario.kind === "data"
					? /^Analysis ready$/
					: /^Run complete$/;
	await waitFor(() => {
		const status = runtimeStatus(document);
		if (status === "Run failed") {
			throw new Error(
				`Runtime failed: ${outputText(document) || "no diagnostic was shown"}.`
			);
		}
		return expectedStatus.test(status);
	}, `${scenario.title} to finish running`);

	const stderr = document.querySelectorAll(".output-line--stderr");
	if (stderr.length) {
		throw new Error(`Runtime stderr: ${elementText(stderr[0])}`);
	}
	if (
		scenario.expectedOutput &&
		!outputText(document).includes(scenario.expectedOutput)
	) {
		throw new Error(
			`Expected output ${JSON.stringify(scenario.expectedOutput)} was absent.`
		);
	}

	if (scenario.kind === "canvas") {
		if (canvasSnapshot(document) === initialCanvas) {
			throw new Error("The canvas did not render a changed frame.");
		}
		await stopAndVerifyFrozen(document);
	}
	if (scenario.kind === "karel") {
		const robot = document.querySelector(
			'.karel-world [aria-label="Karel robot"]'
		);
		if (!robot)
			throw new Error("The Karel world did not render its robot.");
	}
	if (
		scenario.kind === "data" &&
		!document.querySelector(".artifact-list img")
	) {
		throw new Error("The Data / AI starter did not render its chart.");
	}
	if (scenario.button === "Demo PyGame Zero") {
		const manifestRequests = assetRequests.filter(request =>
			request.endsWith("/python-ide/assets/manifest.json")
		);
		const eagerLargeMedia = assetRequests.filter(request =>
			/(?:stars\.jpg|battle_theme\.mp3)$/.test(request)
		);
		if (manifestRequests.length !== 1) {
			throw new Error(
				"PyGame media manifest did not load exactly once on Run."
			);
		}
		if (eagerLargeMedia.length) {
			throw new Error("Unreferenced large PyGame media loaded eagerly.");
		}
	}

	return runtimeStatus(document);
}

context("IDE starter runtime matrix", { testIsolation: false }, () => {
	it(
		"runs every visible demo and template in one browser workspace",
		{ defaultCommandTimeout: 20_000 },
		() => {
			const assetRequests: string[] = [];
			const browserErrors: string[] = [];
			const results: StarterResult[] = [];

			cy.viewport(1440, 900);
			cy.intercept("GET", "/api/accounts/me", { body: {} });
			cy.intercept("GET", "/api/students/session", {
				body: { requiresPasswordSetup: false, student: null }
			});
			cy.intercept("POST", "/api/classroom-usage", {
				body: {},
				statusCode: 204
			});
			cy.intercept("GET", "/python-ide/assets/**", request => {
				assetRequests.push(request.url);
			});
			cy.visit("/ide", {
				onBeforeLoad(window) {
					const originalError = window.console.error.bind(
						window.console
					);
					window.console.error = (...values: unknown[]) => {
						browserErrors.push(values.map(String).join(" "));
						originalError(...values);
					};
				}
			});
			cy.get(".code-ide-workspace").should("be.visible");
			cy.env(["IDE_STARTER", "IDE_STARTER_KINDS"]).then(filters => {
				cy.document().then({ timeout: 720_000 }, async document => {
					for (const scenario of selectedStarterScenarios(filters)) {
						const errorsBefore = browserErrors.length;
						try {
							const detail = await runStarterScenario(
								document,
								scenario,
								assetRequests
							);
							const newErrors = browserErrors.slice(errorsBefore);
							if (newErrors.length) {
								throw new Error(
									`Browser console: ${newErrors.join(" | ")}`
								);
							}
							results.push({
								detail,
								name: scenario.button,
								passed: true
							});
						} catch (error) {
							const failureDetail =
								error instanceof Error
									? error.message
									: String(error);
							const statusDetail = runtimeStatus(document);
							const outputDetail = outputText(document);
							await stopAndVerifyFrozen(document);
							results.push({
								detail: `${failureDetail} Status: ${statusDetail || "missing"}. Output: ${outputDetail || "empty"}.`,
								name: scenario.button,
								passed: false
							});
						}
					}

					const failures = results.filter(result => !result.passed);
					if (failures.length) {
						throw new Error(
							`IDE starter failures:\n${failures
								.map(
									result =>
										`- ${result.name}: ${result.detail}`
								)
								.join("\n")}`
						);
					}
				});
			});
		}
	);
});
