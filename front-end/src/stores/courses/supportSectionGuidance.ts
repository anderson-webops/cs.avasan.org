export type SupportSectionKind =
	| "debugging"
	| "planning"
	| "verification"
	| "extension";

export interface SupportSectionGuidanceOptions {
	courseFamily: string;
	moduleTitle: string;
	section: SupportSectionKind;
}

function normalizedTitle(moduleTitle: string) {
	return moduleTitle.replace(/: Implementation Lab$/, "");
}

function familyFocus(courseFamily: string, moduleTitle: string) {
	const family = courseFamily.toLowerCase();
	const label = normalizedTitle(moduleTitle);
	const focusFor = (focus: string) => `${label} focus: ${focus}`;

	if (family.includes("scratch")) {
		return focusFor(
			"sprite roles, event timing, broadcasts, clones, variables, stage behavior, and the playable feedback loop"
		);
	}

	if (family.includes("web") || family.includes("javascript")) {
		return focusFor(
			"DOM or canvas state, event flow, data structures, browser console evidence, user input, and API or storage boundaries"
		);
	}

	if (family.includes("pygame")) {
		return focusFor(
			"game-loop state, events, actors, collisions, asset names, timing, and frame-by-frame playable behavior"
		);
	}

	if (family.includes("machine learning")) {
		return focusFor(
			"data assumptions, feature choices, baseline behavior, train/test separation, metric interpretation, and limits of the model claim"
		);
	}

	if (family.includes("ai")) {
		return focusFor(
			"state representation, action choices, goal tests, heuristic or scoring behavior, logs, and evidence of intentional agent behavior"
		);
	}

	if (family.includes("usaco")) {
		return focusFor(
			"input parsing, constraints, sample traces, brute-force baselines, complexity, and contest-output discipline"
		);
	}

	if (family.includes("security")) {
		return focusFor(
			"local lab boundaries, attacker-controlled input, validation, logs, sanitizer or trace evidence, and defensive interpretation"
		);
	}

	if (family.includes("rust")) {
		return focusFor(
			"ownership, borrowing, typed errors, trait boundaries, unsafe boundaries, compiler diagnostics, and runtime evidence"
		);
	}

	if (family.includes("design pattern")) {
		return focusFor(
			"object roles, collaboration boundaries, coupling before and after the change, extensibility, and behavior-level tests"
		);
	}

	if (family.includes("data structures") || family.includes("algorithm")) {
		return focusFor(
			"invariants, constraints, state transitions, complexity, memory behavior, and edge-case traces"
		);
	}

	if (family.includes("language bridge")) {
		return focusFor(
			"syntax translation, type differences, object or memory model differences, build workflow, and equivalent behavior across languages"
		);
	}

	if (family.includes("swift")) {
		return focusFor(
			"state, view updates, user interaction, preview or simulator behavior, and a small verification path through the app"
		);
	}

	if (family.includes("java")) {
		return focusFor(
			"class contracts, object state, method signatures, package or import boundaries, exceptions, and testable console behavior"
		);
	}

	if (family.includes("c++")) {
		return focusFor(
			"types, ownership, resource lifetime, containers, build output, diagnostics, and behavior that can be traced from input to output"
		);
	}

	return focusFor(
		"inputs, state changes, boundaries, observable behavior, edge cases, and verification evidence"
	);
}

export function buildSupportSectionGuidance({
	courseFamily,
	moduleTitle,
	section
}: SupportSectionGuidanceOptions) {
	const title = normalizedTitle(moduleTitle);
	const focus = familyFocus(courseFamily, moduleTitle);

	if (section === "debugging") {
		return [
			`Use **${title}** to diagnose realistic failure modes instead of only rerunning the normal case.`,
			`Check the work for ${focus}.`,
			`Record the ${courseFamily} symptom, the smallest reproduction, the suspected cause, the fix, and the evidence that the fix changed the behavior.`
		].join("\n\n");
	}

	if (section === "planning") {
		return [
			`Plan **${title}** as a sequence of runnable checkpoints.`,
			`Name the core state, inputs, outputs, boundaries, and verification evidence connected to ${focus}.`,
			"Choose an order that produces a small working version early, then add complexity only after the current checkpoint can be explained."
		].join("\n\n");
	}

	if (section === "verification") {
		return [
			`Finish **${title}** with a concrete verification pass.`,
			`Compare expected and observed behavior for ${focus}.`,
			"Record the main result, one meaningful edge case, one design or debugging decision, and one limitation that would guide a later revision."
		].join("\n\n");
	}

	return [
		`Extend **${title}** in ${courseFamily} by changing one meaningful constraint rather than adding unrelated features.`,
		`Focus the extension on ${focus} in the context of ${courseFamily}.`,
		`Keep the new ${courseFamily} requirement testable: define the expected behavior, run one normal case and one boundary case, and record what changed from the base version.`
	].join("\n\n");
}
