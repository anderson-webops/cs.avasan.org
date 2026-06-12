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
		"1. Open the starter and name the concrete inputs, outputs, state changes, data structures, or system boundaries involved.",
		"2. Implement the missing behavior in small runnable steps, checking the result after each meaningful change.",
		"3. Test a normal path, a boundary or failure path, and one case tied directly to the module's main concept.",
		`4. ${comparisonStep}`,
		"**Completion checks:**",
		"- The artifact demonstrates the module concept through behavior, output, tests, traces, or another concrete result.",
		"- The boundary case is named explicitly and is not only the provided sample.",
		"- The final note identifies one implementation, debugging, or reasoning choice that mattered."
	].join("\n\n");
}
