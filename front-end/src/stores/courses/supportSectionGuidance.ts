export type SupportSectionKind =
	"debugging" | "planning" | "verification" | "extension";

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

interface AcademicSupportFrame {
	evidenceTypes: string;
	extensionFocus: string;
	focus: string;
	mismatchTypes: string;
	planningNouns: string;
	productCheckpoint: string;
	reliabilityTarget: string;
}

function academicSupportFrame(
	courseFamily: string
): AcademicSupportFrame | null {
	const family = courseFamily.toLowerCase();

	if (
		/math|algebra|geometry|calculus|pre-calculus|number|fraction|decimal|measurement|arithmetic/.test(
			family
		)
	) {
		return {
			evidenceTypes:
				"diagram, equation, table, graph, estimation check, inverse-operation check, or substitution check",
			extensionFocus:
				"a changed number, unit, representation, graph feature, shape condition, or reasonableness question",
			focus: "given quantities, labels, diagrams, equations, representation choices, calculation checks, and reasonableness evidence",
			mismatchTypes:
				"arithmetic slip, missing label, wrong representation, invalid assumption, or answer that fails a reasonableness check",
			planningNouns:
				"the known quantities, needed representation, operation or relationship, units or labels, and answer check",
			productCheckpoint:
				"a worked example with visible steps, labels, and a reasonableness check",
			reliabilityTarget:
				"which representation, calculation, or check supports the answer"
		};
	}

	if (
		/speaking|presentation|speech|public speaking|storyteller|comedy|radio/.test(
			family
		)
	) {
		return {
			evidenceTypes:
				"outline, rehearsal note, timing check, delivery checklist, audience feedback note, or revised speaking cue",
			extensionFocus:
				"a changed audience, speaking purpose, time limit, tone, structure, or delivery constraint",
			focus: "audience, purpose, central message, outline structure, supporting details, rehearsal evidence, and delivery choices",
			mismatchTypes:
				"unclear purpose, weak support, rushed pacing, missing transition, audience mismatch, or delivery choice that weakens the message",
			planningNouns:
				"the audience, purpose, central message, main points, support details, delivery focus, and revision evidence",
			productCheckpoint:
				"a short outline or rehearsal pass with a clear message and one delivery target",
			reliabilityTarget:
				"which outline choice, support detail, rehearsal note, or delivery adjustment improves the message"
		};
	}

	if (
		/reading|literary|literature|grammar|writing|novel|story|book|narrative|picture book|english/.test(
			family
		)
	) {
		return {
			evidenceTypes:
				"quoted detail, paraphrase, sentence revision, grammar rule, draft note, outline, annotation, or reflection",
			extensionFocus:
				"a changed passage, sentence pattern, audience, point of view, scene, structure, or revision goal",
			focus: "text evidence, claim quality, sentence or draft choices, revision evidence, audience, voice, structure, and mechanics",
			mismatchTypes:
				"unsupported claim, vague evidence, grammar mismatch, unclear structure, audience mismatch, or revision that does not improve clarity",
			planningNouns:
				"the passage or draft section, claim or writing goal, evidence, rule or craft choice, revision target, and final reflection",
			productCheckpoint:
				"a short reading response, sentence revision, or draft section with visible evidence and one revision note",
			reliabilityTarget:
				"which text detail, grammar rule, draft choice, or revision note supports the response"
		};
	}

	if (
		/finance|invest|entrepreneur|business|credit|bank|portfolio|stock|income|spending/.test(
			family
		)
	) {
		return {
			evidenceTypes:
				"budget table, assumption list, calculation, comparison chart, risk note, customer evidence, or recommendation memo",
			extensionFocus:
				"a changed budget, customer, time horizon, risk level, market condition, cost, or revenue assumption",
			focus: "goals, assumptions, numerical evidence, customer or market context, time horizon, tradeoffs, risks, and recommendation quality",
			mismatchTypes:
				"missing assumption, weak evidence, calculation error, ignored risk, unrealistic timeline, or recommendation that does not match the goal",
			planningNouns:
				"the goal, assumptions, available evidence, calculation path, tradeoffs, risks, and recommendation criteria",
			productCheckpoint:
				"a decision record with assumptions, calculations, tradeoffs, and a tentative recommendation",
			reliabilityTarget:
				"which assumption, calculation, comparison, or risk note supports the recommendation"
		};
	}

	return null;
}

function academicSupportSectionGuidance(
	courseFamily: string,
	title: string,
	section: SupportSectionKind,
	variant: number,
	frame: AcademicSupportFrame
) {
	if (section === "debugging") {
		const opener = [
			`**${title}** diagnoses likely confusion with evidence from the work sample.`,
			`**${title}** narrows the mismatch before revising the answer, draft, or recommendation.`,
			`**${title}** is a controlled review with evidence before and after the revision.`
		][variant];

		return [
			opener,
			`The **${title}** review checks ${frame.focus}.`,
			`The ${courseFamily} evidence names the confusing result, the smallest example that shows it, the likely cause, the revision, and the evidence that confirms the result changed.`
		].join("\n\n");
	}

	if (section === "planning") {
		const opener = [
			`**${title}** starts with a short map of the idea, evidence, and final product.`,
			`**${title}** is divided into checkpoints that can be reviewed before the full response is complete.`,
			`**${title}** begins with the key evidence and the first complete example.`
		][variant];

		return [
			opener,
			`The **${title}** plan names ${frame.planningNouns}.`,
			`The work sequence for **${title}** produces ${frame.productCheckpoint} before adding depth.`,
			`A complete plan separates required evidence from optional extension. It identifies the first useful example, the evidence source, the expected product, and the point where the work can pause with a readable record.`,
			`Each checkpoint answers three questions: what claim or result is being made, what evidence supports it, and what revision or comparison would make it stronger.`
		].join("\n\n");
	}

	if (section === "verification") {
		const opener = [
			`**${title}** ends with a concrete evidence review.`,
			`**${title}** compares the expected result with the evidence in the finished work.`,
			`**${title}** is reviewed through evidence, not only whether the final answer looks plausible.`
		][variant];
		const evidenceReview = [
			`The verification note for **${title}** names the expected result, observed result, evidence source, and interpretation. The evidence type fits the work: ${frame.evidenceTypes}.`,
			`A useful **${title}** check separates expectation, observation, and interpretation. The conclusion points to ${frame.evidenceTypes} that supports it.`,
			`The **${title}** evidence record makes the review reproducible: expected result, actual result, source of evidence, and ${frame.reliabilityTarget}.`
		][variant];
		const mismatchReview = [
			`When the **${title}** result differs from the expectation, classify the mismatch first: ${frame.mismatchTypes}. The classification determines the next revision.`,
			`If the **${title}** evidence does not match the target, identify the mismatch before revising the work: ${frame.mismatchTypes}.`,
			`A mismatch in **${title}** produces a diagnosis before another revision: what failed, why it likely failed, and which smaller evidence check can confirm the next change.`
		][variant];

		return [
			opener,
			`Expected and observed results in **${title}** are compared for ${frame.focus}.`,
			`The **${title}** record includes the main result, one meaningful contrast case, one revision decision, and one limitation that would guide a later revision.`,
			evidenceReview,
			mismatchReview
		].join("\n\n");
	}

	const opener = [
		`**${title}** extends the ${courseFamily} work by changing one meaningful condition rather than adding unrelated material.`,
		`**${title}** adds one new condition, audience, evidence source, or constraint that still fits the goal.`,
		`**${title}** gains depth by making one requirement more realistic and then checking the result.`
	][variant];

	return [
		opener,
		`The **${title}** extension stays centered on ${frame.focus}.`,
		`The new ${courseFamily} requirement in **${title}** remains checkable: the expected result is defined, one standard check and one contrast case are reviewed, and the change from the base version is recorded. The extension focus is ${frame.extensionFocus}.`
	].join("\n\n");
}

function scratchSupportSectionGuidance(
	title: string,
	section: SupportSectionKind,
	variant: number
) {
	const sceneFocus = [
		"start state, main event, sprite response, score or timer change, and reset behavior",
		"player action, block sequence, visible feedback, and replay path",
		"sprites, events, variables, broadcasts or clones, and the stage result"
	][variant];

	if (section === "planning") {
		return [
			`**${title}** begins with the playable loop before optional polish.`,
			`The plan names the ${sceneFocus}.`,
			"Build the smallest version that can start, respond, show feedback, and restart. Extra costumes, sounds, levels, or difficulty changes belong after that loop can be replayed without stale state.",
			"Useful planning evidence includes a short sprite-role list, one event chain, the variables that change, and a first test path from green flag to visible result.",
			"The checkpoint is concrete: one sprite action is traced from trigger block to state change to stage feedback. If a project uses score, timer, lives, levels, messages, or clones, the plan records where that state is reset and how the next run proves the reset worked."
		].join("\n\n");
	}

	if (section === "verification") {
		return [
			`**${title}** is checked by replaying the project from a clean green-flag start.`,
			`The review compares expected and observed behavior for the ${sceneFocus}.`,
			"Run one normal play path, one repeated-input or missed-input case, and one restart. The evidence identifies the block sequence or variable most responsible for the result, plus one remaining limitation or next polish idea.",
			"A useful verification pass does not rely on the project looking mostly right. It names the expected stage state, the observed stage state, the input or event that produced it, and the Scratch block or variable that explains the match or mismatch.",
			"If the project uses a variable, clone, broadcast, costume, or pen state, include at least one check proving that value resets before the next run."
		].join("\n\n");
	}

	if (section === "debugging") {
		return [
			`**${title}** debugging starts by reproducing one visible failure.`,
			`The failure is traced through the ${sceneFocus}.`,
			"Change the smallest relevant script, then replay the same case and one neighboring case. Keep the bug note concrete: symptom, likely cause, changed block, and result after the fix.",
			"Scratch bugs are often state or event-order problems: a variable was not reset, a forever loop is still running, a broadcast arrives too early, or a clone remains from the previous run. The repair is complete only when the same failure no longer appears from a fresh green-flag start."
		].join("\n\n");
	}

	return [
		`**${title}** changes one part of the playable Scratch loop while keeping the base project recognizable.`,
		`The extension focuses on the ${sceneFocus}.`,
		"Choose one added constraint such as a new control, a harder timer, an extra sprite interaction, a different scoring rule, or a clearer feedback cue. The added behavior is complete only when the normal path, one boundary case, and a restart still work.",
		"The extension evidence names what changed from the base version and what stayed the same. A strong extension keeps the original game understandable, then adds one visible rule that can be tested without guessing from the code alone."
	].join("\n\n");
}

export function buildSupportSectionGuidance({
	courseFamily,
	moduleTitle,
	section
}: SupportSectionGuidanceOptions) {
	const title = normalizedTitle(moduleTitle);
	const focus = familyFocus(courseFamily);
	const variant = variantIndex(courseFamily, moduleTitle, section, 3);

	if (courseFamily.toLowerCase().includes("scratch")) {
		return scratchSupportSectionGuidance(title, section, variant);
	}

	const academicFrame = academicSupportFrame(courseFamily);
	if (academicFrame) {
		return academicSupportSectionGuidance(
			courseFamily,
			title,
			section,
			variant,
			academicFrame
		);
	}

	if (section === "debugging") {
		const opener = [
			`**${title}** diagnoses realistic failure modes instead of only rerunning the standard scenario.`,
			`**${title}** narrows the failure before changing the solution.`,
			`**${title}** is a controlled troubleshooting pass with evidence before and after the fix.`
		][variant];

		return [
			opener,
			`The **${title}** work is checked for ${focus}.`,
			`The ${courseFamily} evidence names the symptom in **${title}**, the smallest reproduction, the suspected cause, the fix, and the result that confirms the behavior changed.`
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
			`The build order for **${title}** produces a small working version early, then adds complexity only after the current checkpoint can be explained.`,
			`A complete plan separates required behavior from optional polish. It identifies the first runnable slice, the data or state representation, the smallest useful test case, and the point where the work can pause without losing a working baseline.`,
			`Each checkpoint answers three questions: what changed, how the change can be observed, and what evidence would show that the next layer is safe to add.`
		].join("\n\n");
	}

	if (section === "verification") {
		const opener = [
			`**${title}** ends with a concrete verification pass.`,
			`**${title}** compares the expected result with what actually happened.`,
			`**${title}** is reviewed through evidence, not just whether the final answer looks plausible.`
		][variant];
		const evidenceReview = [
			`The verification note for **${title}** names the expected result, observed result, evidence source, and interpretation. The evidence type fits the work: trace, screenshot, console output, unit test, sample run, diagram, table, or short comparison.`,
			`A useful **${title}** check separates expectation, observation, and interpretation. The **${title}** conclusion points to the trace, screenshot, output, test, sample run, diagram, table, or written comparison that supports it.`,
			`The **${title}** evidence record makes the review reproducible: expected behavior, actual behavior, source of evidence, and the reason the evidence supports or weakens the conclusion.`
		][variant];
		const mismatchReview = [
			`When the **${title}** result differs from the expectation, classify the mismatch first: implementation bug, unclear requirement, invalid assumption, weak test case, or acceptable limitation. The classification determines the next check.`,
			`If the **${title}** evidence does not match the target, identify the mismatch before revising the work: code or logic error, unclear requirement, wrong assumption, weak test, or real limitation.`,
			`A mismatch in **${title}** produces a diagnosis before another edit: what failed, why it likely failed, and which smaller check can confirm the next change.`
		][variant];

		return [
			opener,
			`Expected and observed behavior in **${title}** are compared for ${focus}.`,
			`The **${title}** record includes the main result, one meaningful edge case, one design or debugging decision, and one limitation that would guide a later revision.`,
			evidenceReview,
			mismatchReview
		].join("\n\n");
	}

	const opener = [
		`**${title}** extends the ${courseFamily} work by changing one meaningful constraint rather than adding unrelated features.`,
		`**${title}** adds one new constraint, data layout, or behavior that still fits the goal.`,
		`**${title}** gains depth by making one requirement more realistic and then checking the result.`
	][variant];

	return [
		opener,
		`The **${title}** extension stays centered on ${focus}.`,
		`The new ${courseFamily} requirement in **${title}** remains testable: expected behavior is defined, one standard check and one boundary check are run, and the change from the base version is recorded.`
	].join("\n\n");
}
