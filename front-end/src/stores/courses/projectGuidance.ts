export interface ProjectGuidanceOptions {
	courseFamily: string;
	moduleTitle: string;
	projectKind: "core" | "extension";
	hasReference: boolean;
}

function projectArtifact(kind: ProjectGuidanceOptions["projectKind"]) {
	return kind === "core" ? "implementation checkpoint" : "applied challenge";
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

export function buildProjectGuidance({
	courseFamily,
	moduleTitle,
	projectKind,
	hasReference
}: ProjectGuidanceOptions) {
	const artifact = projectArtifact(projectKind);
	const comparisonStep = hasReference
		? "Check the draft against the expected behavior after a working version exists; record one difference that affects correctness, readability, robustness, or design."
		: "Write a short verification note that includes the tests or traces used as evidence.";

	return [
		`**Project goal:** Complete the linked ${courseFamily} ${artifact} for **${moduleTitle}** with visible behavior and verification evidence.`,
		`**Focus:** ${familyFocus(courseFamily)}.`,
		"**Required work:**",
		...requiredWorkSteps(courseFamily).map(
			(step, index) => `${index + 1}. ${step}`
		),
		`4. ${comparisonStep}`,
		"**Completion checks:**",
		"- The artifact demonstrates the module concept through behavior, output, tests, traces, or another concrete result.",
		"- The boundary case is named explicitly and is not only the provided sample.",
		"- The final note identifies one implementation, debugging, or reasoning choice that mattered."
	].join("\n\n");
}
