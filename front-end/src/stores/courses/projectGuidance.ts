export interface ProjectGuidanceOptions {
	courseFamily: string;
	moduleTitle: string;
	projectKind: "core" | "extension";
	hasReference: boolean;
}

function projectArtifact(kind: ProjectGuidanceOptions["projectKind"]) {
	return kind === "core" ? "implementation checkpoint" : "applied challenge";
}

function variantIndex(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"],
	count: number
) {
	const seed = `${courseFamily}|${moduleTitle}|${kind}`;
	let hash = 0;

	for (const character of seed) {
		hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	}

	return hash % count;
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

function familyFocus(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) {
		return [
			`Translate ${moduleTitle} into inputs, state, invariants, and output before optimizing; add one tiny custom case and one bounds, ordering, or off-by-one case beyond the sample`,
			`Use ${moduleTitle} to practice contest discipline: restate the constraints, trace the invariant on a hand-built case, then test a sample and a custom edge case`,
			`For ${moduleTitle}, prove the idea before coding by writing a smallest-case trace, then confirm the implementation against sample output and one adversarial boundary case`,
			`Keep ${moduleTitle} grounded in the official input/output contract, the preserved invariant, the expected complexity, and at least one non-sample case that could expose a wrong assumption`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
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

	if (family.includes("python")) {
		return "Keep the Python implementation readable and testable by separating input handling, data transformation, helper functions, and output. Boundary cases should be small enough to trace by hand";
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			`Work on ${moduleTitle} only inside the provided local or owned lab boundary; the finished artifact should include defensive evidence such as logs, traces, validation results, or a short risk note`,
			`Keep ${moduleTitle} scoped to approved local systems and include concrete defensive evidence, rollback notes, or validation results in the finished artifact`,
			`Treat ${moduleTitle} as a defensive evidence exercise: name the allowed boundary, capture the relevant logs or traces, and finish with a risk or hardening note`,
			`For ${moduleTitle}, connect every security or networking claim to owned-lab evidence such as configuration, packet, log, validation, or mitigation output`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
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

function javaFamilyFocus(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	return [
		`Use Java syntax and object boundaries deliberately in ${moduleTitle}: method contracts, object state, collection choices, and compile-run feedback should all be visible in the finished artifact`,
		`Make ${moduleTitle} show how Java responsibilities are divided across classes, methods, records, interfaces, collections, or tests instead of hiding everything in one procedure`,
		`Connect ${moduleTitle} to concrete Java behavior: object construction, method calls, state changes, access boundaries, and one edge case should be easy to inspect`,
		`Keep ${moduleTitle} structured enough to explain: name the owning type, the public behavior, the state or data representation, and the compile/run evidence that proves it`
	][variantIndex(courseFamily, moduleTitle, kind, 4)];
}

function systemsFamilyFocus(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	return [
		`Make ${moduleTitle} inspectable from the command line: inputs, ownership or resource boundaries, build settings, and diagnostic output should be easy to reproduce`,
		`Use ${moduleTitle} to expose the system boundary directly: command, file, memory, lifetime, process, register, or runtime evidence should be visible`,
		`Keep ${moduleTitle} reproducible by naming the build/run command, the relevant boundary, and the trace, log, sanitizer, debugger, or performance evidence`,
		`Treat ${moduleTitle} as a systems checkpoint: the artifact should show what was built, what resource or memory assumption matters, and how the result was verified`
	][variantIndex(courseFamily, moduleTitle, kind, 4)];
}

function focusFor(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();

	if (family.includes("java")) {
		return javaFamilyFocus(courseFamily, moduleTitle, kind);
	}
	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return systemsFamilyFocus(courseFamily, moduleTitle, kind);
	}

	return familyFocus(courseFamily, moduleTitle, kind);
}

function requiredWorkSteps(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) {
		return [
			`Translate ${moduleTitle} into input format, output format, constraints, and the invariant the solution must preserve.`,
			`Solve one tiny ${moduleTitle} hand-built case before coding so the algorithm has a traceable target.`,
			`Implement the ${moduleTitle} approach incrementally, checking the sample, a custom edge case, and one bounds or ordering case.`
		];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			`Identify the ${moduleTitle} user interaction, state change, DOM/canvas/API output, and visible error or empty state.`,
			`Implement one ${moduleTitle} visible behavior at a time, inspecting the page, console, network panel, or local server after each change.`,
			`Verify ${moduleTitle} with a normal interaction, an invalid or empty input, and one accessibility, layout, or deployment-readiness check.`
		];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			`Inspect the ${moduleTitle} input data, state space, features, labels, or rules before deciding what result would count as evidence.`,
			`Implement the ${moduleTitle} transformation, model, search, or scoring step in small checks that expose intermediate results.`,
			`Verify ${moduleTitle} with a normal case, a boundary or failure case, and one limitation that affects how confidently the output can be interpreted.`
		];
	}

	if (family.includes("java")) {
		return [
			[
				`Sketch the classes, methods, records, interfaces, or collections that own the main responsibilities in ${moduleTitle}.`,
				`Implement one ${moduleTitle} constructor, method, branch, or test at a time, compiling after each meaningful change.`,
				`Check ${moduleTitle} with a normal case, an edge case, and one object-state or method-dispatch case tied to the module concept.`
			],
			[
				`For ${moduleTitle}, identify which type owns the state, which method exposes behavior, and which test or console trace proves it.`,
				`Build the smallest compiling ${moduleTitle} version first, then add one behavior or branch at a time.`,
				`Verify ${moduleTitle} with a standard case, a boundary case, and one case involving object identity, equality, inheritance, records, or collections when relevant.`
			],
			[
				`Map ${moduleTitle} into Java responsibilities before coding: constructor data, method parameters, return values, stored state, and any collection shape.`,
				`Compile ${moduleTitle} after each meaningful signature, field, branch, or loop change so errors stay local.`,
				`Check ${moduleTitle} with one ordinary path, one awkward or invalid input path, and one state transition or method-call sequence.`
			],
			[
				`Name the public behavior for ${moduleTitle}, then decide which class, helper method, interface, record, or collection should carry it.`,
				`Implement the ${moduleTitle} behavior in short compile/run cycles with a visible output, assertion, or trace after each stage.`,
				`Verify ${moduleTitle} with one happy path, one edge path, and one design boundary such as encapsulation, overriding, overloading, or collection mutation.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("python")) {
		return [
			`Name the ${moduleTitle} input, transformation, helper function boundary, data structure, and expected output before coding.`,
			`Implement ${moduleTitle} in small runnable pieces, keeping input handling, transformation, and output easy to inspect.`,
			`Check ${moduleTitle} with a normal case, a boundary case, and one unexpected or awkward input that can be traced by hand.`
		];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			`State the ${moduleTitle} local lab boundary, protected asset, unsafe assumption, and evidence that would prove the issue or fix.`,
			`Run or modify the ${moduleTitle} fixture in small steps while capturing logs, traces, requests, responses, or configuration changes.`,
			`Verify ${moduleTitle} normal behavior, failure or attack-shaped behavior, and one remediation, detection, or hardening result.`
		];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			[
				`Identify the inputs, ownership or lifetime boundary, build command, runtime behavior, and diagnostic output for ${moduleTitle}.`,
				`Implement or instrument ${moduleTitle} one boundary at a time, rebuilding and rerunning after each meaningful change.`,
				`Verify ${moduleTitle} with a normal case, a boundary or failure case, and one trace, sanitizer, debugger, memory, or performance observation.`
			],
			[
				`For ${moduleTitle}, name the command, file or memory boundary, expected runtime behavior, and evidence source before changing code.`,
				`Build the smallest reproducible ${moduleTitle} run first, then add one diagnostic, data-structure, resource, or control-flow change at a time.`,
				`Check ${moduleTitle} with a typical run, a smallest or failing run, and one observation from logs, debugger state, sanitizer output, timing, or memory state.`
			],
			[
				`Map ${moduleTitle} to its low-level contract: inputs, outputs, ownership, lifetime, build mode, and observable machine or runtime state.`,
				`Change one ${moduleTitle} boundary at a time and keep the build/run command close enough to rerun immediately.`,
				`Verify ${moduleTitle} ordinary behavior, a boundary or invalid case, and one diagnostic trace tied to the systems concept.`
			],
			[
				`Start ${moduleTitle} by recording the starting state, command path, resource boundary, and expected observable result.`,
				`Implement ${moduleTitle} in short compile/run/debug cycles so failures point to a specific boundary or assumption.`,
				`Check ${moduleTitle} with one normal path, one failure or edge path, and one memory, lifetime, performance, register, or process-state detail.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("swift")) {
		return [
			`Identify the ${moduleTitle} screen, state, user action, data flow, and expected app behavior before changing the project.`,
			`Implement one ${moduleTitle} view, model, state transition, or persistence path at a time and run it in the simulator.`,
			`Verify ${moduleTitle} with a normal interaction, an empty or invalid state, and one accessibility or navigation check.`
		];
	}

	return [
		`Name the ${moduleTitle} artifact, input surface, output surface, state change, and success condition before building.`,
		`Build the ${moduleTitle} behavior in small observable steps, checking the result after each meaningful change.`,
		`Verify ${moduleTitle} with a normal path, a boundary or failure path, and one case tied directly to the module concept.`
	];
}

function referenceReviewStep(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"],
	hasReference: boolean
) {
	const family = courseFamily.toLowerCase();

	if (!hasReference) {
		if (
			family.includes("data") ||
			family.includes("machine learning") ||
			family.includes("ai")
		) {
			return `Write a ${moduleTitle} verification note that names the evidence, sanity check, and limitation used to interpret the result.`;
		}

		if (family.includes("security") || family.includes("network")) {
			return `Write a ${moduleTitle} verification note that records the local boundary, evidence captured, and remediation or hardening result.`;
		}

		return `Write a ${moduleTitle} verification note that identifies the tests, traces, logs, or observations used as evidence.`;
	}

	if (family.includes("usaco")) {
		return `After ${moduleTitle} samples and custom cases pass, compare against the reference and record one difference in invariant, complexity, or edge-case handling.`;
	}

	if (family.includes("web") || family.includes("javascript")) {
		return `After the ${moduleTitle} page behavior works, compare against the reference and record one difference in UI state, validation, accessibility, or error handling.`;
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return `After the ${moduleTitle} pipeline or model runs, compare against the reference and record one difference in data assumptions, metric behavior, model behavior, or stated limitation.`;
	}

	if (family.includes("java")) {
		return [
			`After ${moduleTitle} compiles and tests run, compare against the reference and record one difference in class responsibility, method contract, state handling, or edge-case coverage.`,
			`After the ${moduleTitle} behavior works, compare against the reference and note one difference in type design, public API, object state, or test coverage.`,
			`Use the ${moduleTitle} reference only after the local version runs; record one difference in constructor behavior, method boundaries, records/interfaces, or edge-case handling.`,
			`Compare ${moduleTitle} with the reference after the compile/run path is clean, then identify one design or robustness difference that matters.`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("python")) {
		return `After the ${moduleTitle} program runs, compare against the reference and record one difference in helper boundaries, data handling, input validation, or output formatting.`;
	}

	if (family.includes("security") || family.includes("network")) {
		return `After the ${moduleTitle} local lab works, compare against the reference and record one difference in evidence capture, boundary assumptions, defensive control, or rollback path.`;
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			`After ${moduleTitle} builds and runs, compare against the reference and record one difference in ownership, memory behavior, diagnostics, or performance evidence.`,
			`Compare ${moduleTitle} with the reference only after the local command path is reproducible; note one difference in resource lifetime, trace output, or failure handling.`,
			`Use the ${moduleTitle} reference to check one systems assumption after the build is clean: ownership, layout, timing, command behavior, or diagnostic evidence.`,
			`After the ${moduleTitle} runtime evidence is captured, compare against the reference and name one boundary or tooling difference that affects confidence.`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("swift")) {
		return `After the ${moduleTitle} simulator path works, compare against the reference and record one difference in view state, navigation, persistence, or accessibility behavior.`;
	}

	return `After the ${moduleTitle} artifact works, compare against the reference and record one meaningful difference in behavior, robustness, readability, or design.`;
}

function completionCheckSteps(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) {
		return [
			`The ${moduleTitle} submitted program matches the required input/output format exactly.`,
			`A tiny hand-traced ${moduleTitle} case, the sample case, and one boundary or ordering case have matching results.`,
			`The final ${moduleTitle} note names the invariant, complexity target, and one edge case that shaped the solution.`
		];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			`The ${moduleTitle} page or app shows the expected state change, output, validation, or canvas behavior.`,
			`A normal ${moduleTitle} interaction, an empty or invalid interaction, and one layout or accessibility check have been exercised.`,
			`The final ${moduleTitle} note names the event, state, DOM/canvas/API, or user-flow decision that mattered.`
		];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			`The ${moduleTitle} result is tied to inspected input data, model/search behavior, or an explicit transformation.`,
			`A normal ${moduleTitle} case, a sanity check, and one limitation or failure mode are recorded.`,
			`The final ${moduleTitle} note separates what the evidence supports from what remains uncertain.`
		];
	}

	if (family.includes("java")) {
		return [
			[
				`${moduleTitle} compiles cleanly and the expected behavior is visible through output, tests, or method calls.`,
				`A normal ${moduleTitle} case, an edge case, and one object-state, inheritance, interface, record, or collection case are checked.`,
				`The final ${moduleTitle} note names the class boundary, method contract, or data representation choice that mattered.`
			],
			[
				`${moduleTitle} has a fresh compile/run result and at least one concrete output, assertion, or trace.`,
				`The ${moduleTitle} checked cases include ordinary behavior, boundary behavior, and one object or collection interaction.`,
				`The final ${moduleTitle} note explains which Java type owns the behavior and why that boundary is useful.`
			],
			[
				`${moduleTitle} demonstrates the required Java behavior without relying on stale build output or hidden IDE state.`,
				`Constructor, method, branch, and data-representation behavior are checked for ${moduleTitle} where relevant.`,
				`The final ${moduleTitle} note names the API, state, equality, inheritance, interface, record, or collection decision that affected correctness.`
			],
			[
				`${moduleTitle} can be rebuilt and rerun with current evidence for the target behavior.`,
				`A typical ${moduleTitle} path, an awkward path, and one stateful or polymorphic path are checked when relevant.`,
				`The final ${moduleTitle} note separates syntax fixes from design choices such as encapsulation, method contracts, or data ownership.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("python")) {
		return [
			`The ${moduleTitle} program can be rerun cleanly and the expected output or data change is visible.`,
			`A normal ${moduleTitle} input, a boundary input, and one awkward input or data shape are tested or traced.`,
			`The final ${moduleTitle} note names the helper, loop, collection, file, or algorithm decision that mattered.`
		];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			`The ${moduleTitle} lab boundary, target behavior, and evidence source are explicit.`,
			`${moduleTitle} normal traffic or behavior, failure or attack-shaped behavior, and a mitigation or diagnostic result are checked.`,
			`The final ${moduleTitle} note names the risk, control, trace, log, request, response, or rollback decision that mattered.`
		];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			[
				`${moduleTitle} builds from a clean command and produces inspectable runtime behavior.`,
				`A normal ${moduleTitle} case, a boundary or failure case, and one memory, lifetime, trace, debugger, or performance check are recorded.`,
				`The final ${moduleTitle} note names the ownership, resource, ABI, build, diagnostic, or complexity decision that mattered.`
			],
			[
				`${moduleTitle} has a reproducible build/run command and current evidence for the expected behavior.`,
				`${moduleTitle} ordinary behavior, edge or failure behavior, and one diagnostic observation are checked.`,
				`The final ${moduleTitle} note identifies the resource, ownership, lifetime, layout, command, or performance assumption that shaped the result.`
			],
			[
				`${moduleTitle} can be rebuilt from a clean starting point and inspected through output, logs, traces, debugger state, or sanitizer evidence.`,
				`A typical ${moduleTitle} input, a boundary or invalid input, and one low-level observation are recorded.`,
				`The final ${moduleTitle} note separates the algorithm or API behavior from the system-level evidence.`
			],
			[
				`${moduleTitle} includes the command, expected output, and evidence needed to reproduce the result.`,
				`At least one ${moduleTitle} normal path, one failure or edge path, and one memory, process, register, or timing detail are checked.`,
				`The final ${moduleTitle} note explains the most important ownership, build, diagnostic, or complexity choice.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("swift")) {
		return [
			`The ${moduleTitle} app path runs in the simulator or preview and shows the expected view/state behavior.`,
			`A normal ${moduleTitle} interaction, an empty or invalid state, and one navigation, persistence, or accessibility check are exercised.`,
			`The final ${moduleTitle} note names the view, model, state, data-flow, or platform decision that mattered.`
		];
	}

	return [
		`The finished ${moduleTitle} artifact has an observable result tied to the module concept.`,
		`A normal ${moduleTitle} case, a boundary or failure case, and one transfer case have been checked.`,
		`The final ${moduleTitle} note names one design, debugging, or reasoning decision that affected the outcome.`
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
		`**Focus:** ${focusFor(courseFamily, moduleTitle, projectKind)}.`,
		"**Required work:**",
		...requiredWorkSteps(courseFamily, moduleTitle, projectKind).map(
			(step, index) => `${index + 1}. ${step}`
		),
		`4. ${referenceReviewStep(courseFamily, moduleTitle, projectKind, hasReference)}`,
		"**Completion checks:**",
		...completionCheckSteps(courseFamily, moduleTitle, projectKind).map(
			step => `- ${step}`
		)
	].join("\n\n");
}
