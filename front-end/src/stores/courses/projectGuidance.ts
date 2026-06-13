export interface ProjectGuidanceOptions {
	courseFamily: string;
	moduleTitle: string;
	itemTitle?: string;
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

function referenceVariantIndex(
	courseFamily: string,
	moduleTitle: string,
	count: number
) {
	const seed = `${courseFamily}|${moduleTitle}|reference`;
	let hash = 0;

	for (const character of seed) {
		hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	}

	return hash % count;
}

function guidanceSubject(courseFamily: string, moduleTitle: string) {
	return `${courseFamily} ${moduleTitle}`;
}

function escapeStringForRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function capitalizeSentence(value: string) {
	return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function guidanceReference(courseFamily: string, moduleTitle: string) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) return "the solution";
	if (family.includes("web") || family.includes("javascript"))
		return "the feature";
	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return "the analysis";
	}
	if (family.includes("python")) return "the program";
	if (family.includes("security") || family.includes("network"))
		return "the lab";
	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return "the program";
	}
	if (family.includes("swift")) return "the app path";
	if (family.includes("java")) {
		const references = [
			"the Java implementation",
			"the class exercise",
			"the project",
			"the code checkpoint",
			"the object-design task",
			"the practice build"
		];

		return references[
			referenceVariantIndex(courseFamily, moduleTitle, references.length)
		];
	}

	return "the project";
}

function compactGuidanceBody(
	courseFamily: string,
	moduleTitle: string,
	body: string
) {
	const escapedTitle = escapeStringForRegExp(moduleTitle);
	const reference = guidanceReference(courseFamily, moduleTitle);
	const capitalizedReference = capitalizeSentence(reference);
	const bareReference = reference.replace(/^the\s+/i, "");
	const escapedCourseFamily = escapeStringForRegExp(courseFamily);
	const escapedReference = escapeStringForRegExp(reference);
	const escapedBareReference = escapeStringForRegExp(bareReference);
	const escapedCapitalizedReference =
		escapeStringForRegExp(capitalizedReference);

	return body
		.replace(new RegExp(`\\bFor ${escapedTitle}, `, "g"), "")
		.replace(
			new RegExp(`\\bUse ${escapedTitle} to\\b`, "g"),
			`Use ${reference} to`
		)
		.replace(
			new RegExp(`\\bKeep ${escapedTitle}\\b`, "g"),
			`Keep ${reference}`
		)
		.replace(
			new RegExp(`\\bConnect ${escapedTitle}\\b`, "g"),
			`Connect ${reference}`
		)
		.replace(
			new RegExp(`\\bBuild ${escapedTitle}\\b`, "g"),
			`Build ${reference}`
		)
		.replace(
			new RegExp(`\\bAfter ${escapedTitle}\\b`, "g"),
			`After ${reference}`
		)
		.replace(
			new RegExp(`\\bAfter the ${escapedTitle}\\b`, "g"),
			`After ${reference}`
		)
		.replace(
			new RegExp(`\\bCompare ${escapedTitle}\\b`, "g"),
			`Compare ${reference}`
		)
		.replace(
			new RegExp(
				`\\bThe ${escapedTitle} (page|app|program|result|lab|submitted program|artifact|feature|pipeline|checked cases)\\b`,
				"g"
			),
			"The $1"
		)
		.replace(
			new RegExp(
				`\\bthe ${escapedTitle} (page|app|program|result|lab|artifact|feature|pipeline|local lab|runtime evidence)\\b`,
				"g"
			),
			"the $1"
		)
		.replace(
			new RegExp(
				`\\bA normal ${escapedTitle} (interaction|case|input)\\b`,
				"g"
			),
			"A normal $1"
		)
		.replace(
			new RegExp(`\\bA tiny hand-traced ${escapedTitle} case\\b`, "g"),
			"A tiny hand-traced case"
		)
		.replace(
			new RegExp(`\\bA typical ${escapedTitle} (path|input)\\b`, "g"),
			"A typical $1"
		)
		.replace(
			new RegExp(`\\bAt least one ${escapedTitle} normal path\\b`, "g"),
			"At least one normal path"
		)
		.replace(
			new RegExp(
				`\\bone ${escapedTitle} (visible behavior|normal case|diagnostic observation)\\b`,
				"g"
			),
			"one $1"
		)
		.replace(
			new RegExp(
				`\\b${escapedTitle} (ordinary behavior|normal traffic|samples|findings)\\b`,
				"g"
			),
			(_match, phrase: string) => capitalizeSentence(phrase)
		)
		.replace(
			new RegExp(
				`\\b${escapedTitle} (compiles|has|demonstrates|can|builds|includes)\\b`,
				"g"
			),
			`${capitalizedReference} $1`
		)
		.replace(new RegExp(escapedTitle, "g"), reference)
		.replace(
			new RegExp(
				`\\b${escapedCourseFamily} ${escapedReference}\\b`,
				"gi"
			),
			reference
		)
		.replace(
			new RegExp(
				`\\b${escapedCourseFamily} ${escapedCapitalizedReference}\\b`,
				"g"
			),
			capitalizedReference
		)
		.replace(
			new RegExp(
				`\\b${escapedCourseFamily} ${escapedBareReference}\\b`,
				"gi"
			),
			reference
		)
		.replace(new RegExp(`\\bthe ${escapedReference}\\b`, "g"), reference)
		.replace(
			new RegExp(`\\bUse ${escapedReference} reference\\b`, "g"),
			"Use the reference"
		)
		.replace(
			new RegExp(
				`\\bchecked for ${escapedReference} where relevant\\b`,
				"g"
			),
			"checked where relevant"
		)
		.replace(
			new RegExp(`\\bfinal ${escapedReference} note\\b`, "g"),
			"final note"
		)
		.replace(
			new RegExp(`\\bFinal ${escapedReference} note\\b`, "g"),
			"Final note"
		)
		.replace(
			new RegExp(
				`\\bAfter ${escapedReference} ${escapedBareReference}\\b`,
				"g"
			),
			`After ${reference}`
		)
		.replace(
			new RegExp(`\\bAfter ${escapedCapitalizedReference}\\b`, "g"),
			`After ${reference}`
		)
		.replace(
			new RegExp(
				`\\bBuild the smallest compiling ${escapedReference} version first\\b`,
				"g"
			),
			`Build the smallest version of ${reference} that compiles first`
		)
		.replace(
			new RegExp(`\\bAfter ${escapedReference} page behavior\\b`, "g"),
			"After the page behavior"
		)
		.replace(
			new RegExp(`\\bAfter ${escapedReference} local lab works\\b`, "g"),
			"After the local lab works"
		)
		.replace(
			new RegExp(`\\bAfter ${escapedReference} simulator path\\b`, "g"),
			"After the simulator path"
		)
		.replace(
			new RegExp(
				`\\bBuild the smallest reproducible ${escapedReference} run first\\b`,
				"g"
			),
			"Build the smallest reproducible run first"
		)
		.replace(
			new RegExp(
				`\\bBuild the smallest reproducible ${escapedBareReference} run first\\b`,
				"g"
			),
			"Build the smallest reproducible run first"
		)
		.replace(
			new RegExp(`\\bImplement one ${escapedReference} `, "g"),
			"Implement one "
		)
		.replace(
			new RegExp(
				`\\b(one|each|every|a|an) ${escapedReference} (boundary|behavior|constructor|branch|method|collection operation|diagnostic|data-structure|resource|control-flow change|variable|state transition|view|model|persistence path|normal case|edge case|ordinary behavior|runtime evidence|local lab|page behavior|simulator path)\\b`,
				"g"
			),
			"$1 $2"
		)
		.replace(
			new RegExp(
				`\\b(one|each|every|a|an) ${escapedBareReference} (boundary|behavior|constructor|branch|method|collection operation|diagnostic|data-structure|resource|control-flow change|variable|state transition|view|model|persistence path|normal case|edge case|ordinary behavior|runtime evidence|local lab|page behavior|simulator path)\\b`,
				"g"
			),
			"$1 $2"
		)
		.replace(
			new RegExp(
				`\\bVerify ${capitalizeSentence(escapedReference)} (ordinary behavior|normal behavior|samples|findings|runtime evidence|page behavior|simulator path)\\b`,
				"g"
			),
			"Verify $1"
		)
		.replace(
			new RegExp(
				`\\bVerify ${capitalizeSentence(escapedBareReference)} (ordinary behavior|normal behavior|samples|findings|runtime evidence|page behavior|simulator path)\\b`,
				"g"
			),
			"Verify $1"
		)
		.replace(
			new RegExp(
				`\\bone tiny ${escapedReference} hand-built case\\b`,
				"g"
			),
			"one tiny hand-built case"
		)
		.replace(
			new RegExp(
				`\\bSolve one tiny ${escapedReference} hand-built case\\b`,
				"g"
			),
			"Solve one tiny hand-built case"
		)
		.replace(
			new RegExp(
				`\\bWrite a ${escapedReference} verification note\\b`,
				"g"
			),
			"Write a verification note"
		)
		.replace(
			new RegExp(
				`\\bWrite a ${escapedBareReference} verification note\\b`,
				"g"
			),
			"Write a verification note"
		)
		.replace(
			new RegExp(
				`\\bthe ${escapedReference} (behavior|runtime evidence|local lab|page behavior|program|simulator path)\\b`,
				"g"
			),
			`the ${bareReference} $1`
		)
		.replace(
			new RegExp(
				`\\bthe ${escapedBareReference} (behavior|runtime evidence|local lab|page behavior|program|simulator path)\\b`,
				"g"
			),
			`the ${bareReference} $1`
		)
		.replace(
			/\*\*Focus:\*\* ([a-z])/g,
			(_, first: string) => `**Focus:** ${first.toUpperCase()}`
		)
		.replace(
			/(^|\n)(\d+\. )([a-z])/g,
			(_match, prefix: string, marker: string, first: string) =>
				`${prefix}${marker}${first.toUpperCase()}`
		);
}

function checkInDetails(moduleTitle: string) {
	const trimmedTitle = moduleTitle.trim();
	const prefix = "Check-In #";
	if (!trimmedTitle.toLowerCase().startsWith(prefix.toLowerCase())) {
		return { isCheckIn: false, topic: "" };
	}

	let cursor = prefix.length;
	while (cursor < trimmedTitle.length && /\d/.test(trimmedTitle[cursor])) {
		cursor++;
	}

	const remainder = trimmedTitle.slice(cursor).trim();
	const topic = remainder.startsWith(":")
		? remainder.slice(1).trim()
		: remainder;

	return { isCheckIn: true, topic };
}

function guidanceModuleTitle(moduleTitle: string, itemTitle?: string) {
	if (!itemTitle) return moduleTitle;

	const { isCheckIn, topic: checkInTopic } = checkInDetails(moduleTitle);
	const supplementalMatch = itemTitle.match(/\bsupplemental\s+(\d+)\b/i);
	if (supplementalMatch) {
		if (checkInTopic) {
			return `${checkInTopic} Supplemental ${supplementalMatch[1]}`;
		}
		if (isCheckIn) {
			return `${moduleTitle.replace(/^Check-In/i, "Checkpoint")} Supplemental ${supplementalMatch[1]}`;
		}
		return `${moduleTitle} Supplemental ${supplementalMatch[1]}`;
	}

	const extensionMatch = itemTitle.match(/\bextension challenge\b/i);
	if (extensionMatch) {
		return `${moduleTitle} Extension Challenge`;
	}

	return moduleTitle;
}

function projectGoal(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();
	const artifact = projectArtifact(kind);
	const index = variantIndex(courseFamily, moduleTitle, kind, 4);

	if (family.includes("usaco")) {
		return [
			`**Project goal:** Solve the ${courseFamily} ${artifact} for **${moduleTitle}** with exact input/output behavior, a traceable invariant, and evidence from sample plus custom cases.`,
			`**Project goal:** Turn **${moduleTitle}** into a contest-ready ${courseFamily} ${artifact} with a proved idea, matching samples, and at least one custom edge case.`,
			`**Project goal:** Complete **${moduleTitle}** as a ${courseFamily} ${artifact} that states the constraints, preserves an invariant, and justifies complexity.`,
			`**Project goal:** Implement **${moduleTitle}** with strict USACO input/output discipline, then verify the algorithm against samples and a hand-built boundary case.`
		][index];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			`**Project goal:** Build the ${courseFamily} ${artifact} for **${moduleTitle}** as a browser-visible feature with clear state, interaction, and error-handling evidence.`,
			`**Project goal:** Complete **${moduleTitle}** as a ${courseFamily} ${artifact} that connects user input, page state, and visible output.`,
			`**Project goal:** Implement **${moduleTitle}** with a normal browser path, an invalid or empty path, and evidence from the page, console, or network flow.`,
			`**Project goal:** Produce **${moduleTitle}** as a user-facing ${courseFamily} ${artifact} with interaction, validation, and accessibility or layout evidence.`
		][index];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			`**Project goal:** Produce the ${courseFamily} ${artifact} for **${moduleTitle}** as an evidence-backed analysis, model, or search result with a stated limitation.`,
			`**Project goal:** Complete **${moduleTitle}** as a ${courseFamily} ${artifact} that inspects inputs, records assumptions, and verifies the output with a sanity check.`,
			`**Project goal:** Build **${moduleTitle}** around a clear question, measurable result, baseline or trace, and limitation that affects interpretation.`,
			`**Project goal:** Turn **${moduleTitle}** into a reproducible data/model checkpoint with visible intermediate evidence and a cautious conclusion.`
		][index];
	}

	if (family.includes("java")) {
		return [
			`**Project goal:** Implement the ${courseFamily} ${artifact} for **${moduleTitle}** with compiling Java code, clear object boundaries, and checks for normal and edge behavior.`,
			`**Project goal:** Complete **${moduleTitle}** as a Java ${artifact} that exposes class responsibilities, public behavior, and one edge case.`,
			`**Project goal:** Build **${moduleTitle}** through short compile/run cycles, then verify the relevant object state, method contract, or collection behavior.`,
			`**Project goal:** Produce **${moduleTitle}** with a named Java type boundary, observable behavior, and evidence from a normal case plus a boundary case.`
		][index];
	}

	if (family.includes("python")) {
		return [
			`**Project goal:** Build the ${courseFamily} ${artifact} for **${moduleTitle}** as a runnable Python program with readable data flow and traceable boundary cases.`,
			`**Project goal:** Complete **${moduleTitle}** as a Python ${artifact} with separated input, transformation, and output behavior.`,
			`**Project goal:** Implement **${moduleTitle}** with a hand-checkable normal case, an awkward input or boundary case, and readable helper boundaries.`,
			`**Project goal:** Produce **${moduleTitle}** as a runnable program whose data flow can be traced without guessing hidden state.`
		][index];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			`**Project goal:** Complete the ${courseFamily} ${artifact} for **${moduleTitle}** inside the approved local boundary, with defensive evidence and a rollback or hardening note.`,
			`**Project goal:** Turn **${moduleTitle}** into a scoped defensive checkpoint with captured evidence, interpretation, and mitigation or rollback notes.`,
			`**Project goal:** Build **${moduleTitle}** around an owned-lab symptom, diagnostic command, observed result, and hardening or validation step.`,
			`**Project goal:** Produce **${moduleTitle}** with explicit scope, safe test evidence, and a final state that can be verified.`
		][index];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			`**Project goal:** Build the ${courseFamily} ${artifact} for **${moduleTitle}** with a reproducible command, inspectable runtime behavior, and memory or diagnostic evidence.`,
			`**Project goal:** Complete **${moduleTitle}** as a systems ${artifact} that names the command path, resource boundary, and diagnostic evidence.`,
			`**Project goal:** Implement **${moduleTitle}** in short build/run/debug cycles, then verify one normal path and one boundary or failure path.`,
			`**Project goal:** Produce **${moduleTitle}** with visible low-level evidence such as compiler output, sanitizer output, logs, traces, timing, or memory state.`
		][index];
	}

	if (family.includes("swift")) {
		return [
			`**Project goal:** Implement the ${courseFamily} ${artifact} for **${moduleTitle}** as a simulator-verified app path with visible state, navigation, or persistence behavior.`,
			`**Project goal:** Complete **${moduleTitle}** as a Swift app checkpoint with a visible screen state and one verified interaction path.`,
			`**Project goal:** Build **${moduleTitle}** with a clear state owner, simulator evidence, and one empty, error, layout, or accessibility check.`,
			`**Project goal:** Produce **${moduleTitle}** as a runnable app slice whose behavior can be demonstrated from launch through the target interaction.`
		][index];
	}

	return [
		`**Project goal:** Create the ${courseFamily} ${artifact} for **${moduleTitle}** with an observable result, a checked boundary case, and a short reasoning note.`,
		`**Project goal:** Complete **${moduleTitle}** as a ${courseFamily} ${artifact} with a clear success condition and evidence that the result works.`,
		`**Project goal:** Build **${moduleTitle}** in small verifiable steps, then compare the expected result with the observed result.`,
		`**Project goal:** Produce **${moduleTitle}** as a focused artifact that demonstrates the module concept and one important edge case.`
	][index];
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
		return [
			`Connect ${moduleTitle} browser behavior to state changes, event handling, DOM or canvas output, and user input; the result should be inspectable in the page, not only in source code`,
			`For ${moduleTitle}, make the browser evidence visible through a user action, a state or data change, rendered output, and one failure or empty-state check`,
			`Use ${moduleTitle} to tie the code to the page: event listener, state update, DOM or canvas result, and keyboard or responsive-layout behavior should be observable`,
			`Keep ${moduleTitle} grounded in the actual user flow, with source code, browser output, console or network evidence, and one edge interaction all agreeing`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			`For ${moduleTitle}, connect the code to evidence: inspect the input data, describe the transformation or model behavior, and verify the result with a small sanity check before treating the output as meaningful`,
			`Use ${moduleTitle} to make the evidence path visible: name the source, expose an intermediate result, compare against a baseline or expectation, and state one limitation`,
			`Keep ${moduleTitle} grounded in data quality, transformation steps, measured output, and an interpretation that does not overclaim beyond the evidence`,
			`For ${moduleTitle}, show how the dataset or state space becomes a result by documenting the assumptions, calculation or model behavior, sanity check, and caveat`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("python")) {
		return [
			`Keep the ${moduleTitle} Python implementation readable and testable by separating input handling, data transformation, helper functions, and output; boundary cases should be small enough to trace by hand`,
			`Use ${moduleTitle} to practice Python structure: isolate the calculation, name the data shape, run one normal case, and run one boundary case without hiding logic in input prompts`,
			`For ${moduleTitle}, make the Python data flow visible from input or setup through transformation to output, with one small traceable case proving the main branch or loop`,
			`Build ${moduleTitle} as readable Python first: clear names, narrow helper functions when useful, predictable output, and a test case that catches more than syntax errors`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
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
		return [
			`For ${moduleTitle}, make the system boundary explicit: inputs, memory ownership, resource lifetime, build settings, and diagnostic output should be easy to inspect and reproduce`,
			`Use ${moduleTitle} to connect representation, ownership or resource lifetime, build evidence, and one diagnostic output that confirms behavior`,
			`Keep ${moduleTitle} reproducible by naming the compile or run command, the resource boundary, the expected output, and one failure or edge case`,
			`For ${moduleTitle}, show how the low-level representation or system state changes, then verify it with concrete terminal, debugger, sanitizer, or log evidence`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("swift")) {
		return [
			`Connect ${moduleTitle} to app behavior: state ownership, view updates, user interaction, and a simulator verification path should be clear from the running project`,
			`For ${moduleTitle}, make the SwiftUI behavior visible through the state owner, the screen update, one user action, and one empty, error, layout, or accessibility check`,
			`Use ${moduleTitle} to separate model state from view behavior, then verify the normal interaction and one edge state in the simulator or preview data`,
			`Keep ${moduleTitle} app-focused by showing launch state, the target interaction, the UI response, and the evidence that Xcode configuration is not hiding behavior`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
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
		const subject = guidanceSubject(courseFamily, moduleTitle);

		return [
			[
				`Sketch the classes, methods, records, interfaces, or collections that own the main responsibilities in ${subject}.`,
				`Implement one ${subject} constructor, method, branch, or test at a time, compiling after each meaningful change.`,
				`Check ${subject} with a normal case, an edge case, and one object-state or method-dispatch case tied to the module concept.`
			],
			[
				`For ${subject}, identify which type owns the state, which method exposes behavior, and which test or console trace proves it.`,
				`Build the smallest version of ${subject} that compiles first, then add one behavior or branch at a time.`,
				`Verify ${subject} with a standard case, a boundary case, and one case involving object identity, equality, inheritance, records, or collections when relevant.`
			],
			[
				`Map ${subject} into Java responsibilities before coding: constructor data, method parameters, return values, stored state, and any collection shape.`,
				`Compile ${subject} after each meaningful signature, field, branch, or loop change so errors stay local.`,
				`Check ${subject} with one ordinary path, one awkward or invalid input path, and one state transition or method-call sequence.`
			],
			[
				`Name the public behavior for ${subject}, then decide which class, helper method, interface, record, or collection should carry it.`,
				`Implement the ${subject} behavior in short compile/run cycles with a visible output, assertion, or trace after each stage.`,
				`Verify ${subject} with one normal case, one edge path, and one design boundary such as encapsulation, overriding, overloading, or collection mutation.`
			],
			[
				`Write the ${subject} object model first: type names, fields, public methods, and the evidence each method should produce.`,
				`Compile after each constructor, method signature, branch, or collection change so the next error has a narrow cause.`,
				`Check ${subject} with an ordinary call, a boundary call, and one state change that proves the object is not just storing data.`
			],
			[
				`For ${subject}, separate syntax setup from design setup by naming the package, class boundary, state, and public contract.`,
				`Build a minimal runnable version, then add one Java feature at a time: access control, overload, override, interface, record, or collection behavior.`,
				`Verify ${subject} with a traceable example and one awkward case that would expose a weak method contract.`
			],
			[
				`Start ${subject} with a concrete method-call example, including parameter values, expected return or output, and any state before and after the call.`,
				`Keep compile/run cycles short enough that a type error, null risk, equality issue, or dispatch mistake points to one recent edit.`,
				`Test ${subject} with a normal path, a boundary path, and one case that checks how classes collaborate.`
			],
			[
				`Decide what ${subject} should make public, what should stay private, and what evidence will prove the boundary works.`,
				`Implement one responsibility at a time and keep constructor setup, method behavior, and collection or inheritance logic separately testable.`,
				`Compare ${subject} against one expected scenario and one failure-shaped scenario before using the reference.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 8)];
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
		const subject = guidanceSubject(courseFamily, moduleTitle);

		return [
			`After ${subject} compiles and tests run, compare against the reference and record one difference in class responsibility, method contract, state handling, or edge-case coverage.`,
			`After the ${subject} behavior works, compare against the reference and note one difference in type design, public API, object state, or test coverage.`,
			`Use the ${subject} reference only after the local version runs; record one difference in constructor behavior, method boundaries, records/interfaces, or edge-case handling.`,
			`Compare ${subject} with the reference after the compile/run path is clean, then identify one design or robustness difference that matters.`
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
			],
			[
				`${moduleTitle} has a current compile/run result and the important method calls are traceable.`,
				`The checked cases include a typical call, a boundary call, and one state or collection interaction.`,
				`The final ${moduleTitle} note names the Java construct that carried the main responsibility.`
			],
			[
				`${moduleTitle} can be rebuilt from the documented files and still shows the expected behavior.`,
				`Constructor setup, public method behavior, and one awkward input or state transition are checked where relevant.`,
				`The final ${moduleTitle} note explains why the chosen class or interface boundary is useful.`
			],
			[
				`${moduleTitle} includes reproducible evidence through output, assertions, traces, or method-call examples.`,
				`A normal path, an edge path, and one object-collaboration path are verified when the prompt allows it.`,
				`The final ${moduleTitle} note separates the Java syntax issue from the design or API issue.`
			],
			[
				`${moduleTitle} demonstrates the target behavior after a clean compile, not just from previous run output.`,
				`The checked cases cover expected behavior, boundary behavior, and one class, record, interface, or collection interaction.`,
				`The final ${moduleTitle} note states which method contract or representation choice mattered most.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 8)];
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
	itemTitle,
	projectKind,
	hasReference
}: ProjectGuidanceOptions) {
	const scopedModuleTitle = guidanceModuleTitle(moduleTitle, itemTitle);
	const goal = projectGoal(courseFamily, scopedModuleTitle, projectKind);
	const body = [
		`**Focus:** ${focusFor(courseFamily, scopedModuleTitle, projectKind)}.`,
		"**Required work:**",
		...requiredWorkSteps(courseFamily, scopedModuleTitle, projectKind).map(
			(step, index) => `${index + 1}. ${step}`
		),
		`4. ${referenceReviewStep(courseFamily, scopedModuleTitle, projectKind, hasReference)}`,
		"**Completion checks:**",
		...completionCheckSteps(
			courseFamily,
			scopedModuleTitle,
			projectKind
		).map(step => `- ${step}`)
	].join("\n\n");

	return [
		goal,
		compactGuidanceBody(courseFamily, scopedModuleTitle, body)
	].join("\n\n");
}
