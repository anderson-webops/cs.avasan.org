export type ImplementationLabSection =
	| "concepts"
	| "example"
	| "coreProject"
	| "review"
	| "extension";

export interface ImplementationLabGuidanceOptions {
	courseFamily: string;
	moduleTitle: string;
	section: ImplementationLabSection;
	hasReference?: boolean;
}

function labLabel(moduleTitle: string) {
	return moduleTitle.replace(/: (?:Implementation|Applied) Lab$/, "");
}

function articleSafeLabel(label: string) {
	return label.replace(/^(?:the|a|an)\s+/i, "");
}

function definiteLabel(label: string) {
	return `the **${articleSafeLabel(label)}**`;
}

function capitalizedDefiniteLabel(label: string) {
	return `The **${articleSafeLabel(label)}**`;
}

function sectionLabel(section: ImplementationLabSection) {
	return {
		concepts: "concept path",
		example: "worked example",
		coreProject: "core project",
		review: "review",
		extension: "extension"
	}[section];
}

function familyFocus(
	courseFamily: string,
	moduleTitle: string,
	section: ImplementationLabSection
) {
	const family = courseFamily.toLowerCase();
	const label = labLabel(moduleTitle);
	const focusLabel = articleSafeLabel(label);
	const focusFor = (focus: string) =>
		`${focusLabel} ${sectionLabel(section)} focus: ${focus}`;

	if (family.includes("assembly")) {
		return focusFor(
			"register state, flags, stack layout, memory addresses, calling-convention assumptions, and debugger evidence"
		);
	}

	if (family.includes("c systems") || family.includes("systems build")) {
		return focusFor(
			"byte-level representation, pointer ownership, resource lifetime, compiler warnings, sanitizer output, and reproducible command-line behavior"
		);
	}

	if (family.includes("linux")) {
		return focusFor(
			"shell commands, file permissions, process state, service configuration, log evidence, and repeatable terminal workflows"
		);
	}

	if (family.includes("network security")) {
		return focusFor(
			"local service boundaries, request validation, authentication or authorization assumptions, logging, rate or error behavior, and defensive evidence"
		);
	}

	if (family.includes("network")) {
		return focusFor(
			"protocol messages, sockets, ports, latency or failure behavior, packet/service traces, and clear client-server boundaries"
		);
	}

	if (family.includes("web")) {
		return focusFor(
			"page structure, user input, browser state, API boundaries, validation, accessibility, error handling, and deployment assumptions"
		);
	}

	if (family.includes("machine learning")) {
		return focusFor(
			"dataset inspection, feature choices, train/test separation, baseline comparison, model behavior, evaluation metrics, and limits of the conclusion"
		);
	}

	if (family.includes("data science") || family.includes("data analysis")) {
		return focusFor(
			"data source assumptions, column meaning, cleaning decisions, missing values, transformations, visual evidence, and a reproducible analysis note"
		);
	}

	if (family.includes("ai")) {
		return focusFor(
			"state representation, actions, goal tests, search strategy, heuristic or scoring behavior, experiment logs, and evidence that the agent improves or behaves intentionally"
		);
	}

	if (family.includes("usaco")) {
		return focusFor(
			"input format, constraints, a brute-force baseline, the chosen algorithm, complexity, sample traces, hidden edge cases, and contest-style output discipline"
		);
	}

	if (family.includes("design pattern")) {
		return focusFor(
			"object roles, collaboration boundaries, before-and-after coupling, extensibility tradeoffs, and tests that prove the pattern changes behavior rather than only class names"
		);
	}

	if (family.includes("data structures") || family.includes("algorithm")) {
		return focusFor(
			"data-structure invariants, input constraints, algorithm state, asymptotic complexity, memory behavior, and edge-case traces"
		);
	}

	if (family.includes("language bridge")) {
		return focusFor(
			"syntax translation, type differences, object and memory model differences, build/run workflow, and equivalent behavior across languages"
		);
	}

	if (family.includes("pygame")) {
		return focusFor(
			"game-loop state, event handling, sprites or assets, collision/timing behavior, frame-by-frame debugging, and playable feedback"
		);
	}

	if (family.includes("java")) {
		return focusFor(
			"Java syntax, class design, object state, method contracts, package or import boundaries, exceptions, tests, and command-line runtime behavior"
		);
	}

	return focusFor(
		"inputs, state changes, system boundaries, observable behavior, edge cases, and verification evidence"
	);
}

function referenceStep(label: string, artifact: string, hasReference = true) {
	const artifactLabel = definiteLabel(label);

	return hasReference
		? `Compare the finished **${label}** ${artifact} draft with the reference only after the artifact works; record one meaningful difference in behavior, robustness, readability, or design.`
		: `Write a verification note for ${artifactLabel} ${artifact} that identifies the evidence used to confirm the result.`;
}

function variantIndex(
	courseFamily: string,
	moduleTitle: string,
	section: ImplementationLabSection,
	count: number
) {
	const seed = `${courseFamily}|${moduleTitle}|${section}`;
	let hash = 0;

	for (const character of seed) {
		hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	}

	return hash % count;
}

export function buildImplementationLabGuidance({
	courseFamily,
	moduleTitle,
	section,
	hasReference = true
}: ImplementationLabGuidanceOptions) {
	const label = labLabel(moduleTitle);
	const focus = familyFocus(courseFamily, moduleTitle, section);

	if (section === "concepts") {
		return [
			`Use **${label}** to connect the build target to ${focus}.`,
			`Define ${definiteLabel(label)} artifact, minimum working behavior, input/output surfaces, and invariant that should stay true as features are added.`,
			`Keep **${label}** concrete: the concept is complete only when the result can be run, inspected, and explained with evidence from the artifact.`
		].join("\n\n");
	}

	if (section === "example") {
		return [
			`Trace one representative case for **${label}** before expanding the implementation.`,
			`For **${label}**, record the starting files or commands, exact input, expected result, observed result, and diagnostic checkpoint that proves the code is moving in the right direction.`,
			`Then add one **${label}** boundary or failure case so the project has a clear comparison between normal behavior and the edge condition that most needs protection.`
		].join("\n\n");
	}

	if (section === "review") {
		return [
			`Close **${label}** with an engineering note rather than a generic reflection.`,
			`Summarize the final **${label}** behavior, the most important edge case, the evidence used to verify the result, and one limitation or next improvement.`,
			`${capitalizedDefiniteLabel(label)} note should be specific enough that the same artifact could be rerun or reviewed later without reconstructing the reasoning from memory.`
		].join("\n\n");
	}

	const artifact =
		section === "coreProject"
			? "core build checkpoint"
			: "extension build checkpoint";
	const artifactArticle = artifact.startsWith("extension") ? "an" : "a";
	const projectGoal = [
		`**Project goal:** Build **${label}** as ${artifactArticle} ${artifact} with runnable behavior, inspectable evidence, and a clear boundary case.`,
		`**Project goal:** Complete **${label}** as ${artifactArticle} ${artifact} that exposes the lab concept through a working run and one protected edge case.`,
		`**Project goal:** Turn **${label}** into ${artifactArticle} ${artifact} with a reproducible run, visible diagnostics, and a named success condition.`,
		`**Project goal:** Produce **${label}** as ${artifactArticle} ${artifact} whose normal path and failure or boundary path can both be inspected.`
	][variantIndex(courseFamily, moduleTitle, section, 4)];

	return [
		projectGoal,
		`**Focus:** ${focus}.`,
		"**Required work:**",
		`1. For ${definiteLabel(label)} ${artifact}, identify the concrete inputs, outputs, state changes, files, commands, services, or system boundaries involved.`,
		`2. Build ${definiteLabel(label)} ${artifact} in small runnable steps, checking output, logs, traces, tests, or browser/runtime behavior after each meaningful change.`,
		`3. Check ${definiteLabel(label)} ${artifact} with one normal path, one boundary or failure path, and one case tied directly to the lab's main concept.`,
		`4. ${referenceStep(label, artifact, hasReference)}`,
		"**Completion checks:**",
		`- ${capitalizedDefiniteLabel(label)} ${artifact} demonstrates the lab concept through runnable behavior, output, tests, traces, logs, or another concrete result.`,
		`- The protected boundary or failure case for ${definiteLabel(label)} ${artifact} is named explicitly and is not only the provided sample.`,
		`- The final **${articleSafeLabel(label)}** ${artifact} note identifies one implementation, debugging, or reasoning choice that materially affected the result.`
	].join("\n\n");
}
