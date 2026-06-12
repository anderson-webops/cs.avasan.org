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
	return moduleTitle.replace(/: Implementation Lab$/, "");
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

	return "inputs, state changes, system boundaries, observable behavior, edge cases, and verification evidence";
}

function referenceStep(hasReference = true) {
	return hasReference
		? "Compare the finished draft with the reference only after the artifact works; record one meaningful difference in behavior, robustness, readability, or design."
		: "Write a verification note that identifies the evidence used because no separate reference solution is available.";
}

export function buildImplementationLabGuidance({
	courseFamily,
	moduleTitle,
	section,
	hasReference = true
}: ImplementationLabGuidanceOptions) {
	const label = labLabel(moduleTitle);
	const focus = familyFocus(courseFamily);

	if (section === "concepts") {
		return [
			`Use **${label}** to connect the implementation target to ${focus}.`,
			"Define the artifact, the minimum working behavior, the input and output surfaces, and the invariant that should stay true as features are added.",
			"Keep the scope concrete: the concept is not complete until the result can be run, inspected, and explained with evidence rather than only described in source code."
		].join("\n\n");
	}

	if (section === "example") {
		return [
			`Trace one representative case for **${label}** before expanding the implementation.`,
			"Record the starting files or commands, the exact input, the expected result, the observed result, and the diagnostic checkpoint that proves the code is moving in the right direction.",
			"Then add one boundary or failure case so the project has a clear comparison between normal behavior and the edge condition that most needs protection."
		].join("\n\n");
	}

	if (section === "review") {
		return [
			`Close **${label}** with an engineering note rather than a generic reflection.`,
			"Summarize the final behavior, the most important edge case, the evidence used to verify the result, and one limitation or next improvement.",
			"The note should be specific enough that the same artifact could be rerun or reviewed later without reconstructing the reasoning from memory."
		].join("\n\n");
	}

	const artifact =
		section === "coreProject"
			? "core implementation checkpoint"
			: "extension implementation checkpoint";

	return [
		`**Project goal:** Build the **${label}** ${artifact} as a working artifact with visible behavior and verification evidence.`,
		`**Focus:** ${focus}.`,
		"**Required work:**",
		"1. Open the starter and name the concrete inputs, outputs, state changes, files, commands, services, or system boundaries involved.",
		"2. Implement the behavior in small runnable steps, checking output, logs, traces, tests, or browser/runtime behavior after each meaningful change.",
		"3. Verify one normal path, one boundary or failure path, and one case tied directly to the lab's main concept.",
		`4. ${referenceStep(hasReference)}`,
		"**Completion checks:**",
		"- The artifact demonstrates the lab concept through runnable behavior, output, tests, traces, logs, or another concrete result.",
		"- The boundary or failure case is named explicitly and is not only the provided sample.",
		"- The final note identifies one implementation, debugging, or reasoning choice that materially affected the result."
	].join("\n\n");
}
