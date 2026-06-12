export interface ProjectGuidanceOptions {
	courseFamily: string;
	moduleTitle: string;
	projectKind: "core" | "extension";
	hasReference: boolean;
}

function projectArtifact(kind: ProjectGuidanceOptions["projectKind"]) {
	return kind === "core" ? "implementation checkpoint" : "applied challenge";
}

function projectGoal(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();
	const artifact = projectArtifact(kind);

	if (family.includes("usaco")) {
		return `**Project goal:** Solve the ${courseFamily} ${artifact} for **${moduleTitle}** with exact input/output behavior, a traceable invariant, and evidence from sample plus custom cases.`;
	}

	if (family.includes("web") || family.includes("javascript")) {
		return `**Project goal:** Build the ${courseFamily} ${artifact} for **${moduleTitle}** as a browser-visible feature with clear state, interaction, and error-handling evidence.`;
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return `**Project goal:** Produce the ${courseFamily} ${artifact} for **${moduleTitle}** as an evidence-backed analysis, model, or search result with a stated limitation.`;
	}

	if (family.includes("java")) {
		return `**Project goal:** Implement the ${courseFamily} ${artifact} for **${moduleTitle}** with compiling Java code, clear object boundaries, and checks for normal and edge behavior.`;
	}

	if (family.includes("python")) {
		return `**Project goal:** Build the ${courseFamily} ${artifact} for **${moduleTitle}** as a runnable Python program with readable data flow and traceable boundary cases.`;
	}

	if (family.includes("security") || family.includes("network")) {
		return `**Project goal:** Complete the ${courseFamily} ${artifact} for **${moduleTitle}** inside the approved local boundary, with defensive evidence and a rollback or hardening note.`;
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return `**Project goal:** Build the ${courseFamily} ${artifact} for **${moduleTitle}** with a reproducible command, inspectable runtime behavior, and memory or diagnostic evidence.`;
	}

	if (family.includes("swift")) {
		return `**Project goal:** Implement the ${courseFamily} ${artifact} for **${moduleTitle}** as a simulator-verified app path with visible state, navigation, or persistence behavior.`;
	}

	return `**Project goal:** Create the ${courseFamily} ${artifact} for **${moduleTitle}** with an observable result, a checked boundary case, and a short reasoning note.`;
}

function familyFocus(courseFamily: string) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) {
		return "Translate the problem statement into inputs, state, invariants, and output before optimizing. Sample tests should be supplemented with at least one tiny custom case and one edge case that targets bounds, ordering, or off-by-one behavior";
	}

	if (family.includes("web") || family.includes("javascript")) {
		return "Connect browser behavior to state changes, event handling, DOM or canvas output, and user input. The result should be inspectable in the page, not only in source code";
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return "Connect the code to evidence: inspect the input data, describe the transformation or model behavior, and verify the result with a small sanity check before treating the output as meaningful";
	}

	if (family.includes("java")) {
		return "Use Java syntax and object boundaries deliberately: method contracts, object state, collection choices, and compile-run feedback should all be visible in the finished artifact";
	}

	if (family.includes("python")) {
		return "Keep the Python implementation readable and testable by separating input handling, data transformation, helper functions, and output. Boundary cases should be small enough to trace by hand";
	}

	if (family.includes("security") || family.includes("network")) {
		return "Work only inside the provided local or owned lab boundary. The finished artifact should include defensive evidence such as logs, traces, validation results, or a short risk note";
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return "Make the system boundary explicit: inputs, memory ownership, resource lifetime, build settings, and diagnostic output should be easy to inspect and reproduce";
	}

	if (family.includes("swift")) {
		return "Connect the implementation to app behavior: state, view updates, user interaction, and a small verification path should be clear from the running project";
	}

	return "Connect the implementation to the module concept through observable behavior, a clear test path, and a short explanation of the reasoning behind the final design";
}

function requiredWorkSteps(courseFamily: string) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) {
		return [
			"Translate the prompt into input format, output format, constraints, and the invariant the solution must preserve.",
			"Solve one tiny hand-built case before coding so the algorithm has a traceable target.",
			"Implement the approach incrementally, checking the sample, a custom edge case, and one bounds or ordering case."
		];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			"Identify the user interaction, state change, DOM/canvas/API output, and visible error or empty state.",
			"Implement one visible behavior at a time, inspecting the page, console, network panel, or local server after each change.",
			"Verify a normal interaction, an invalid or empty input, and one accessibility, layout, or deployment-readiness check."
		];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			"Inspect the input data, state space, features, labels, or rules before deciding what result would count as evidence.",
			"Implement the transformation, model, search, or scoring step in small checks that expose intermediate results.",
			"Verify a normal case, a boundary or failure case, and one limitation that affects how confidently the output can be interpreted."
		];
	}

	if (family.includes("java")) {
		return [
			"Sketch the classes, methods, records, interfaces, or collections that own the main responsibilities.",
			"Implement one constructor, method, branch, or test at a time, compiling after each meaningful change.",
			"Check a normal case, an edge case, and one object-state or method-dispatch case tied to the module concept."
		];
	}

	if (family.includes("python")) {
		return [
			"Name the input, transformation, helper function boundary, data structure, and expected output before coding.",
			"Implement the behavior in small runnable pieces, keeping input handling, transformation, and output easy to inspect.",
			"Check a normal case, a boundary case, and one unexpected or awkward input that can be traced by hand."
		];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			"State the local lab boundary, protected asset, unsafe assumption, and evidence that would prove the issue or fix.",
			"Run or modify the fixture in small steps while capturing logs, traces, requests, responses, or configuration changes.",
			"Verify normal behavior, failure or attack-shaped behavior, and one remediation, detection, or hardening result."
		];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			"Identify the inputs, ownership or lifetime boundary, build command, runtime behavior, and diagnostic output.",
			"Implement or instrument one boundary at a time, rebuilding and rerunning after each meaningful change.",
			"Verify a normal case, a boundary or failure case, and one trace, sanitizer, debugger, memory, or performance observation."
		];
	}

	if (family.includes("swift")) {
		return [
			"Identify the screen, state, user action, data flow, and expected app behavior before changing the project.",
			"Implement one view, model, state transition, or persistence path at a time and run it in the simulator.",
			"Verify a normal interaction, an empty or invalid state, and one accessibility or navigation check."
		];
	}

	return [
		"Name the artifact, input surface, output surface, state change, and success condition before building.",
		"Build the behavior in small observable steps, checking the result after each meaningful change.",
		"Verify a normal path, a boundary or failure path, and one case tied directly to the module concept."
	];
}

function referenceReviewStep(courseFamily: string, hasReference: boolean) {
	const family = courseFamily.toLowerCase();

	if (!hasReference) {
		if (
			family.includes("data") ||
			family.includes("machine learning") ||
			family.includes("ai")
		) {
			return "Write a verification note that names the evidence, sanity check, and limitation used to interpret the result.";
		}

		if (family.includes("security") || family.includes("network")) {
			return "Write a verification note that records the local boundary, evidence captured, and remediation or hardening result.";
		}

		return "Write a verification note that identifies the tests, traces, logs, or observations used as evidence.";
	}

	if (family.includes("usaco")) {
		return "After samples and custom cases pass, compare against the reference and record one difference in invariant, complexity, or edge-case handling.";
	}

	if (family.includes("web") || family.includes("javascript")) {
		return "After the page behavior works, compare against the reference and record one difference in UI state, validation, accessibility, or error handling.";
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return "After the pipeline or model runs, compare against the reference and record one difference in data assumptions, metric behavior, model behavior, or stated limitation.";
	}

	if (family.includes("java")) {
		return "After the code compiles and tests run, compare against the reference and record one difference in class responsibility, method contract, state handling, or edge-case coverage.";
	}

	if (family.includes("python")) {
		return "After the program runs, compare against the reference and record one difference in helper boundaries, data handling, input validation, or output formatting.";
	}

	if (family.includes("security") || family.includes("network")) {
		return "After the local lab works, compare against the reference and record one difference in evidence capture, boundary assumptions, defensive control, or rollback path.";
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return "After the build and run checks pass, compare against the reference and record one difference in ownership, memory behavior, diagnostics, or performance evidence.";
	}

	if (family.includes("swift")) {
		return "After the simulator path works, compare against the reference and record one difference in view state, navigation, persistence, or accessibility behavior.";
	}

	return "After the artifact works, compare against the reference and record one meaningful difference in behavior, robustness, readability, or design.";
}

function completionCheckSteps(courseFamily: string) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) {
		return [
			"The submitted program matches the required input/output format exactly.",
			"A tiny hand-traced case, the sample case, and one boundary or ordering case have matching results.",
			"The final note names the invariant, complexity target, and one edge case that shaped the solution."
		];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			"The page or app shows the expected state change, output, validation, or canvas behavior.",
			"A normal interaction, an empty or invalid interaction, and one layout or accessibility check have been exercised.",
			"The final note names the event, state, DOM/canvas/API, or user-flow decision that mattered."
		];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			"The result is tied to inspected input data, model/search behavior, or an explicit transformation.",
			"A normal case, a sanity check, and one limitation or failure mode are recorded.",
			"The final note separates what the evidence supports from what remains uncertain."
		];
	}

	if (family.includes("java")) {
		return [
			"The Java code compiles cleanly and the expected behavior is visible through output, tests, or method calls.",
			"A normal case, an edge case, and one object-state, inheritance, interface, record, or collection case are checked.",
			"The final note names the class boundary, method contract, or data representation choice that mattered."
		];
	}

	if (family.includes("python")) {
		return [
			"The program can be rerun cleanly and the expected output or data change is visible.",
			"A normal input, a boundary input, and one awkward input or data shape are tested or traced.",
			"The final note names the helper, loop, collection, file, or algorithm decision that mattered."
		];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			"The lab boundary, target behavior, and evidence source are explicit.",
			"Normal traffic or behavior, failure or attack-shaped behavior, and a mitigation or diagnostic result are checked.",
			"The final note names the risk, control, trace, log, request, response, or rollback decision that mattered."
		];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			"The artifact builds from a clean command and produces inspectable runtime behavior.",
			"A normal case, a boundary or failure case, and one memory, lifetime, trace, debugger, or performance check are recorded.",
			"The final note names the ownership, resource, ABI, build, diagnostic, or complexity decision that mattered."
		];
	}

	if (family.includes("swift")) {
		return [
			"The app path runs in the simulator or preview and shows the expected view/state behavior.",
			"A normal interaction, an empty or invalid state, and one navigation, persistence, or accessibility check are exercised.",
			"The final note names the view, model, state, data-flow, or platform decision that mattered."
		];
	}

	return [
		"The finished artifact has an observable result tied to the module concept.",
		"A normal case, a boundary or failure case, and one transfer case have been checked.",
		"The final note names one design, debugging, or reasoning decision that affected the outcome."
	];
}

export function buildProjectGuidance({
	courseFamily,
	moduleTitle,
	projectKind,
	hasReference
}: ProjectGuidanceOptions) {
	return [
		projectGoal(courseFamily, moduleTitle, projectKind),
		`**Focus:** ${familyFocus(courseFamily)}.`,
		"**Required work:**",
		...requiredWorkSteps(courseFamily).map(
			(step, index) => `${index + 1}. ${step}`
		),
		`4. ${referenceReviewStep(courseFamily, hasReference)}`,
		"**Completion checks:**",
		...completionCheckSteps(courseFamily).map(step => `- ${step}`)
	].join("\n\n");
}
