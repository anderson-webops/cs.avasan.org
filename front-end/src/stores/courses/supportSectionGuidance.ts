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

function variantIndex(
	courseFamily: string,
	moduleTitle: string,
	section: SupportSectionKind,
	count: number
) {
	const seed = `${courseFamily}|${moduleTitle}|${section}`;
	let hash = 0;

	for (const character of seed) {
		hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	}

	return hash % count;
}

function familyFocus(courseFamily: string) {
	const family = courseFamily.toLowerCase();

	if (family.includes("scratch")) {
		return "sprite roles, event timing, broadcasts, clones, variables, stage behavior, and the playable feedback loop";
	}

	if (family.includes("web") || family.includes("javascript")) {
		return "DOM or canvas state, event flow, data structures, browser console evidence, user input, and API or storage boundaries";
	}

	if (family.includes("pygame")) {
		return "game-loop state, events, actors, collisions, asset names, timing, and frame-by-frame playable behavior";
	}

	if (family.includes("machine learning")) {
		return "data assumptions, feature choices, baseline behavior, train/test separation, metric interpretation, and limits of the model claim";
	}

	if (family.includes("ai")) {
		return "state representation, action choices, goal tests, heuristic or scoring behavior, logs, and evidence of intentional agent behavior";
	}

	if (family.includes("usaco")) {
		return "input parsing, constraints, sample traces, brute-force baselines, complexity, and contest-output discipline";
	}

	if (family.includes("security")) {
		return "local lab boundaries, attacker-controlled input, validation, logs, sanitizer or trace evidence, and defensive interpretation";
	}

	if (family.includes("rust")) {
		return "ownership, borrowing, typed errors, trait boundaries, unsafe boundaries, compiler diagnostics, and runtime evidence";
	}

	if (family.includes("design pattern")) {
		return "object roles, collaboration boundaries, coupling before and after the change, extensibility, and behavior-level tests";
	}

	if (family.includes("data structures") || family.includes("algorithm")) {
		return "invariants, constraints, state transitions, complexity, memory behavior, and edge-case traces";
	}

	if (family.includes("language bridge")) {
		return "syntax translation, type differences, object or memory model differences, build workflow, and equivalent behavior across languages";
	}

	if (family.includes("swift")) {
		return "state, view updates, user interaction, preview or simulator behavior, and a small verification path through the app";
	}

	if (family.includes("java")) {
		return "class contracts, object state, method signatures, package or import boundaries, exceptions, and testable console behavior";
	}

	if (family.includes("c++")) {
		return "types, ownership, resource lifetime, containers, build output, diagnostics, and behavior that can be traced from input to output";
	}

	return "inputs, state changes, boundaries, observable behavior, edge cases, and verification evidence";
}

export function buildSupportSectionGuidance({
	courseFamily,
	moduleTitle,
	section
}: SupportSectionGuidanceOptions) {
	const title = normalizedTitle(moduleTitle);
	const focus = familyFocus(courseFamily);
	const variant = variantIndex(courseFamily, moduleTitle, section, 3);

	if (section === "debugging") {
		const opener = [
			`**${title}** diagnoses realistic failure modes instead of only rerunning the normal case.`,
			`**${title}** narrows the failure before changing the solution.`,
			`**${title}** is a controlled troubleshooting pass with evidence before and after the fix.`
		][variant];

		return [
			opener,
			`The **${title}** work is checked for ${focus}.`,
			`The ${courseFamily} evidence names the symptom in **${title}**, the smallest reproduction, the suspected cause, the fix, and the proof that the fix changed the behavior.`
		].join("\n\n");
	}

	if (section === "planning") {
		const opener = [
			`**${title}** is planned as a sequence of runnable checkpoints.`,
			`**${title}** is divided into checkpoints that can be tested before the full version is complete.`,
			`**${title}** starts with a map of the pieces that need to work, followed by the first runnable checkpoint.`
		][variant];

		return [
			opener,
			`The **${title}** plan names the core state, inputs, outputs, boundaries, and verification evidence for ${focus}.`,
			`The build order for **${title}** produces a small working version early, then adds complexity only after the current checkpoint can be explained.`
		].join("\n\n");
	}

	if (section === "verification") {
		const opener = [
			`**${title}** ends with a concrete verification pass.`,
			`**${title}** compares the expected result with what actually happened.`,
			`**${title}** is reviewed through evidence, not just whether the final answer looks plausible.`
		][variant];

		return [
			opener,
			`Expected and observed behavior in **${title}** are compared for ${focus}.`,
			`The **${title}** record includes the main result, one meaningful edge case, one design or debugging decision, and one limitation that would guide a later revision.`
		].join("\n\n");
	}

	const opener = [
		`**${title}** extends the ${courseFamily} work by changing one meaningful constraint rather than adding unrelated features.`,
		`**${title}** adds one new constraint, input shape, or behavior that still fits the original goal.`,
		`**${title}** gains depth by making one requirement more realistic and then checking the result.`
	][variant];

	return [
		opener,
		`The **${title}** extension stays centered on ${focus}.`,
		`The new ${courseFamily} requirement in **${title}** remains testable: expected behavior is defined, one normal case and one boundary case are run, and the change from the base version is recorded.`
	].join("\n\n");
}
