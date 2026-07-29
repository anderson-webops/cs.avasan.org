export type ImplementationLabSection =
	"concepts" | "example" | "coreProject" | "review" | "extension";

export interface ImplementationLabGuidanceOptions {
	courseFamily: string;
	moduleTitle: string;
	section: ImplementationLabSection;
	hasReference?: boolean;
	context?: {
		focus?: string;
		artifact?: string;
		invariant?: string;
		exampleCase?: string;
		boundaryCase?: string;
		reviewEvidence?: string;
	};
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

function capitalizeSentence(value: string) {
	return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function familyFocus(courseFamily: string) {
	const family = courseFamily.toLowerCase();

	if (family.includes("assembly")) {
		return "register state, flags, stack layout, memory addresses, calling-convention assumptions, and debugger evidence";
	}

	if (family.includes("c systems") || family.includes("systems build")) {
		return "byte-level representation, pointer ownership, resource lifetime, compiler warnings, sanitizer output, and reproducible command-line behavior";
	}

	if (family.includes("linux")) {
		return "shell commands, file permissions, process state, service configuration, log evidence, and repeatable terminal workflows";
	}

	if (family.includes("network security")) {
		return "local service boundaries, request validation, authentication or authorization assumptions, logging, rate or error behavior, and defensive evidence";
	}

	if (family.includes("network")) {
		return "protocol messages, sockets, ports, latency or failure behavior, packet/service traces, and clear client-server boundaries";
	}

	if (family.includes("web")) {
		return "page structure, user input, browser state, API boundaries, validation, accessibility, error handling, and deployment assumptions";
	}

	if (family.includes("machine learning")) {
		return "dataset inspection, feature choices, train/test separation, baseline comparison, model behavior, evaluation metrics, and limits of the conclusion";
	}

	if (family.includes("data science") || family.includes("data analysis")) {
		return "data source assumptions, column meaning, cleaning decisions, missing values, transformations, visual evidence, and a reproducible analysis note";
	}

	if (family.includes("ai")) {
		return "state representation, actions, goal tests, search strategy, heuristic or scoring behavior, experiment logs, and evidence that the agent improves or behaves intentionally";
	}

	if (family.includes("usaco")) {
		return "input format, constraints, a brute-force baseline, the chosen algorithm, complexity, sample traces, hidden edge cases, and contest-style output discipline";
	}

	if (family.includes("design pattern")) {
		return "object roles, collaboration boundaries, before-and-after coupling, extensibility tradeoffs, and tests that prove the pattern changes behavior rather than only class names";
	}

	if (family.includes("data structures") || family.includes("algorithm")) {
		return "data-structure invariants, input constraints, algorithm state, asymptotic complexity, memory behavior, and edge-case traces";
	}

	if (family.includes("language bridge")) {
		return "syntax translation, type differences, object and memory model differences, build/run workflow, and equivalent behavior across languages";
	}

	if (family.includes("pygame")) {
		return "game-loop state, event handling, sprites or assets, collision/timing behavior, frame-by-frame debugging, and playable feedback";
	}

	if (family.includes("java")) {
		return "Java syntax, class design, object state, method contracts, package or import boundaries, exceptions, tests, and command-line runtime behavior";
	}

	return "inputs, state changes, system boundaries, observable behavior, edge cases, and verification evidence";
}

function referenceStep(artifact: string, hasReference = true) {
	return hasReference
		? `Compare the finished ${artifact} with the reference only after it works; record one meaningful difference in behavior, robustness, readability, or design.`
		: `Write a verification note for the ${artifact} that identifies the evidence used to confirm the result.`;
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
	hasReference = true,
	context
}: ImplementationLabGuidanceOptions) {
	const label = labLabel(moduleTitle);
	const focus = context?.focus ?? familyFocus(courseFamily);

	if (section === "concepts") {
		const artifact =
			context?.artifact ??
			`${definiteLabel(label)} artifact, minimum working behavior, input/output surfaces`;
		const invariant =
			context?.invariant ??
			"invariant that remains true as features are added";

		return [
			`**${label}** connects the build target to ${focus}.`,
			`Define ${artifact}, and ${invariant}.`,
			`Keep **${label}** concrete: the concept is complete only when the result can be run, inspected, and explained with evidence from the artifact.`
		].join("\n\n");
	}

	if (section === "example") {
		const variant = variantIndex(courseFamily, moduleTitle, section, 4);
		const opener = [
			`Walk through one representative **${label}** case before expanding the implementation.`,
			`Start **${label}** with one narrow case that can be traced from input to result.`,
			`Before adding features to **${label}**, run one standard scenario slowly enough to explain each checkpoint.`,
			`A small **${label}** example comes first so the later build has a known baseline.`
		][variant];
		const traceStep = [
			"Use the same vocabulary the later work will use: inputs, state changes, boundaries, outputs, and the evidence that confirms each step.",
			"Connect the example to the later build by naming the input, state transition, boundary, output, and verification evidence in order.",
			"Keep the example inspectable: record what enters the system, what changes, where the boundary is, what comes out, and how the result is checked.",
			"Describe the example as a reusable pattern, not a script to copy: starting condition, transition, result, and evidence all need names."
		][variant];

		return [
			opener,
			context?.exampleCase ??
				"Record the starting files or commands, exact input, expected result, observed result, and a visible checkpoint that proves the code is moving in the right direction.",
			traceStep,
			context?.boundaryCase ??
				"Then add one boundary or failure-mode check so the project has a clear comparison between standard behavior and the edge condition that most needs protection."
		].join("\n\n");
	}

	if (section === "review") {
		return [
			`Close **${label}** with an engineering note rather than a generic reflection.`,
			context?.reviewEvidence ??
				`Summarize the final **${label}** behavior, the most important edge case, the evidence used to verify the result, and one limitation or next improvement.`,
			`${capitalizedDefiniteLabel(label)} note is specific enough for the same artifact to be rerun or reviewed later without reconstructing the reasoning from memory.`
		].join("\n\n");
	}

	const artifact =
		section === "coreProject" ? "working version" : "extension version";
	const artifactArticle = artifact.startsWith("extension") ? "an" : "a";
	const artifactReference = `the ${artifact}`;
	const capitalizedArtifactReference = capitalizeSentence(artifactReference);
	const projectGoal = [
		`**Project goal:** Build **${label}** as ${artifactArticle} ${artifact} with runnable behavior, inspectable evidence, and a clear boundary case.`,
		`**Project goal:** Complete **${label}** as ${artifactArticle} ${artifact} that exposes the lab concept through a working run and one protected edge case.`,
		`**Project goal:** Turn **${label}** into ${artifactArticle} ${artifact} with a reproducible run, visible diagnostics, and a named success condition.`,
		`**Project goal:** Produce **${label}** as ${artifactArticle} ${artifact} whose standard path and failure or boundary path can both be inspected.`
	][variantIndex(courseFamily, moduleTitle, section, 4)];

	return [
		projectGoal,
		`**Focus:** ${focus}.`,
		"**Core work:**",
		`1. For ${artifactReference}, identify the concrete inputs, outputs, state changes, files, commands, services, or system boundaries involved.`,
		`2. Build ${artifactReference} in small runnable steps, checking output, logs, traces, tests, or browser/runtime behavior after each meaningful change.`,
		`3. Check ${artifactReference} with one standard path, one boundary or failure path, and one case tied directly to the lab's main concept.`,
		`4. ${referenceStep(artifact, hasReference)}`,
		"**Completion checks:**",
		`- ${capitalizedArtifactReference} demonstrates the lab concept through runnable behavior, output, tests, traces, logs, or another concrete result.`,
		`- ${capitalizedArtifactReference} includes a named boundary, failure path, or constraint check beyond the provided sample.`,
		"- Record one implementation, debugging, or reasoning choice that materially affected the result."
	].join("\n\n");
}
