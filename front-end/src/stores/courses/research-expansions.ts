import type { RawCourse, RawCourseModule } from "./types";

type ExpansionPriority = "urgent" | "soon" | "later";

interface ResearchExpansionProfile {
	family: string;
	priority: ExpansionPriority;
	sources: string[];
	gaps: string[];
	topics: string[];
	moduleAdditions: string[];
	projectTypes: string[];
	assessments: string[];
	materials: string[];
	safety?: string;
}

function stableVariantIndex(seed: string, count: number) {
	let hash = 2166136261;

	for (const character of seed) {
		hash ^= character.charCodeAt(0);
		hash = Math.imul(hash, 16777619) >>> 0;
	}

	return hash % count;
}

const sourceLinks: Record<string, string> = {
	"ACS Chemistry Guidelines":
		"https://www.acs.org/education/policies/middle-and-high-school-chemistry.html",
	"Apple App Dev Training":
		"https://developer.apple.com/tutorials/app-dev-training",
	"College Board AP CSA":
		"https://apcentral.collegeboard.org/courses/ap-computer-science-a",
	"Common Core Algebra": "https://www.thecorestandards.org/Math/Content/HSA/",
	"CSTA K-12 Standards": "https://csteachers.org/k12standards/",
	"ISO C++ Core Guidelines": "https://github.com/isocpp/CppCoreGuidelines",
	"MDN JavaScript Guide":
		"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
	"NGSS Appendices":
		"https://www.nextgenscience.org/resources/ngss-appendices",
	"NIST AI RMF": "https://www.nist.gov/itl/ai-risk-management-framework",
	"OWASP Web Security Testing Guide":
		"https://owasp.org/www-project-web-security-testing-guide/",
	PhET: "https://phet.colorado.edu/",
	"Pygame Documentation": "https://www.pygame.org/docs/",
	"Python Tutorial": "https://docs.python.org/3/tutorial/index.html",
	"RFC 8446 TLS 1.3": "https://www.rfc-editor.org/rfc/rfc8446",
	"RFC 9110 HTTP Semantics": "https://www.rfc-editor.org/rfc/rfc9110",
	"Rust Book": "https://doc.rust-lang.org/book/",
	"scikit-learn Model Evaluation":
		"https://scikit-learn.org/stable/modules/model_evaluation.html",
	"systemd Documentation": "https://systemd.io/",
	"Unity Learn": "https://learn.unity.com/",
	"Unity Manual": "https://docs.unity3d.com/Manual/",
	"USACO Guide": "https://usaco.guide/",
	"USACO Official": "https://usaco.org/",
	"pandas Documentation": "https://pandas.pydata.org/docs/"
};

function isScienceFamily(family: string) {
	return (
		family.includes("chemistry") ||
		family.includes("physics") ||
		(/\bscience\b/.test(family) && !family.includes("computer science"))
	);
}

function bullets(items: string[]) {
	return items.map(item => `- ${item}`).join("\n");
}

function sourceBullets(names: string[]) {
	return bullets(
		names.map(
			name => `${name}: ${sourceLinks[name] ?? "source to confirm"}`
		)
	);
}

function courseUseNote(courseLabel: string, emphasis: string) {
	return `**How to use this:** This ${courseLabel} section is a planning and review reference. Read the explanation first, use the list to choose the next concrete lesson or project focus, and finish by checking whether the listed evidence is visible in the course artifact. ${emphasis}`;
}

function standardsEvidenceNote(courseLabel: string) {
	return `**Evidence to keep:** A strong ${courseLabel} entry names the source standard or documentation page, explains why that source matters for the current module, and connects it to a visible task such as a worked example, project requirement, assessment item, or reflection prompt.`;
}

function sequencingEvidenceNote(courseLabel: string) {
	return `**Sequence evidence:** The ${courseLabel} order is defensible when prerequisites are explicit, vocabulary appears before it is required in a project, and every larger build has a smaller earlier checkpoint that exercises the same skill.`;
}

function projectEvidenceNote(courseLabel: string) {
	return `**Project evidence:** A ${courseLabel} project is ready when the expected artifact, success criteria, normal case, edge case, explanation target, and extension path can be read without guessing what the work is meant to prove.`;
}

function projectDescription(project: string) {
	return project
		.trim()
		.replace(/[.!?]+$/g, "")
		.replace(/\btodo\b/gi, "to-do");
}

function titleCaseProjectWord(word: string, index: number) {
	const lower = word.toLowerCase();
	const smallWords = new Set([
		"a",
		"an",
		"and",
		"as",
		"by",
		"for",
		"in",
		"of",
		"or",
		"the",
		"to",
		"with"
	]);

	if (index > 0 && smallWords.has(lower)) return lower;
	if (word !== lower && word !== word.toUpperCase()) return word;
	if (/^[A-Z0-9-]+$/.test(word)) return word;

	return lower
		.replace(/^[a-z]/, character => character.toUpperCase())
		.replace(
			/-([a-z])/g,
			(_match, character: string) => `-${character.toUpperCase()}`
		);
}

function projectTitle(project: string) {
	return projectDescription(project)
		.replace(/:.*$/, "")
		.split(/\s+/)
		.map(titleCaseProjectWord)
		.join(" ")
		.replace(/\bTo-do\b/g, "To-Do");
}

function projectOptionGoal(
	profile: ResearchExpansionProfile,
	courseLabel: string
) {
	const family = profile.family.toLowerCase();

	if (family.includes("scratch")) {
		return `**Project goal:** Build this as a playable ${courseLabel} project with clear sprite roles, event flow, state changes, and end conditions.`;
	}
	if (family.includes("python")) {
		return `**Project goal:** Implement this as a ${courseLabel} program with named inputs, reusable functions or classes where helpful, and reproducible console or file output.`;
	}
	if (family.includes("pygame")) {
		return "**Project goal:** Prototype this as a game loop with actors, controls, collision or state rules, scoring or progress feedback, and a reset path.";
	}
	if (family.includes("data") || family.includes("machine learning")) {
		return `**Project goal:** Complete this as a ${courseLabel} analysis artifact with a defined question, source data, cleaning or feature choices, evidence, and limitations.`;
	}
	if (family.includes("ai")) {
		return `**Project goal:** Build this as an ${courseLabel} reasoning artifact with an explicit state representation, decision rule or search strategy, traceable output, and limitation note.`;
	}
	if (family.includes("algebra")) {
		return `**Project goal:** Use this project to model, solve, graph, or justify a ${courseLabel} relationship with visible steps and a reasonableness check.`;
	}
	if (family.includes("c++")) {
		return `**Project goal:** Build this as a ${courseLabel} program with a documented compile command, data representation, ownership or container decision, and test cases.`;
	}
	if (family.includes("javascript") || family.includes("web")) {
		return `**Project goal:** Build this as a ${courseLabel} browser feature with visible UI state, event handling, validation, and responsive layout evidence.`;
	}
	if (family.includes("java")) {
		return `**Project goal:** Implement this as a ${courseLabel} Java artifact with clear class responsibilities, method contracts, state changes, and compile/run evidence.`;
	}
	if (family.includes("usaco")) {
		return `**Project goal:** Solve this as a ${courseLabel} contest problem with exact input/output behavior, constraints, invariants, and complexity reasoning.`;
	}
	if (isScienceFamily(family)) {
		return `**Project goal:** Investigate this as a ${courseLabel} model, data, or explanation task that connects a claim to evidence and reasoning.`;
	}
	if (
		family.includes("security") ||
		family.includes("systems") ||
		family.includes("linux") ||
		family.includes("network")
	) {
		return `**Project goal:** Complete this as a ${courseLabel} local lab with explicit scope, allowed target, command evidence, interpretation, and rollback or remediation.`;
	}
	if (family.includes("swift")) {
		return `**Project goal:** Build this as a ${courseLabel} app feature with a defined screen, state owner, user flow, simulator evidence, and accessibility check.`;
	}
	if (family.includes("unity")) {
		return `**Project goal:** Build this as a ${courseLabel} Unity scene or mechanic with player action, state feedback, playtest evidence, and reset behavior.`;
	}
	return `**Project goal:** Complete this as a ${courseLabel} artifact with named inputs, expected behavior, evidence of correctness, and one limitation or edge case.`;
}

function projectOptionRequiredOutcome(
	profile: ResearchExpansionProfile,
	courseLabel: string,
	project: string
) {
	const family = profile.family.toLowerCase();
	const choose = (options: string[]) =>
		options[
			stableVariantIndex(
				`${profile.family}|${project}|outcome`,
				options.length
			)
		];

	if (family.includes("scratch")) {
		return `**Required outcome:**\n- For this option, name the sprites, events, variables, broadcasts, or clones that control the project.\n- Show one normal play path and one reset, win/loss, scoring, or boundary condition.\n- Explain the main Scratch state or event-flow decision in the ${courseLabel} context.`;
	}
	if (family.includes("data") || family.includes("machine learning")) {
		return "**Required outcome:**\n- For this option, state the question, dataset, key columns or features, and cleaning or modeling choice.\n- Include a baseline, sanity check, metric, visualization, or small trace.\n- Explain what the evidence supports and one limitation of the result.";
	}
	if (family.includes("ai")) {
		return "**Required outcome:**\n- For this option, define the state representation, action space, rule, search, or scoring method.\n- Trace one ordinary case and one case where the strategy behaves poorly or ambiguously.\n- Explain why the strategy is reasonable and where it is limited.";
	}
	if (family.includes("algebra")) {
		return "**Required outcome:**\n- For this option, show the rule, equation, graph, table, or transformation being used.\n- Include one ordinary case and one sign, unit, intercept, domain, or boundary check.\n- Explain how the result is known to be reasonable.";
	}
	if (isScienceFamily(family)) {
		return "**Required outcome:**\n- For this option, state the phenomenon or question, model or data source, claim, and relevant vocabulary.\n- Separate the observation, pattern, and explanation.\n- Connect evidence to the claim and name one model limitation or uncertainty.";
	}
	if (
		family.includes("security") ||
		family.includes("systems") ||
		family.includes("linux") ||
		family.includes("network")
	) {
		return `**Required outcome:**\n- For this option, state the local scope, target, starting state, allowed tools, and stop condition.\n- Record command, configuration, trace, or log evidence before and after the change.\n- Explain the impact and the ${courseLabel} rollback, mitigation, or verification step.`;
	}
	if (family.includes("usaco")) {
		return "**Required outcome:**\n- For this option, translate the prompt into input format, output format, constraints, and invariant.\n- Pass the sample and at least one tiny, boundary, duplicate, tie, or adversarial custom case.\n- State the time and memory complexity in relation to the constraints.";
	}
	if (family.includes("javascript") || family.includes("web")) {
		return "**Required outcome:**\n- For this option, identify the UI state, event handler, data flow, validation path, and visible output.\n- Test with a fresh load, normal action, empty or error case, and responsive layout when relevant.\n- Explain the main DOM, API, state, or accessibility decision.";
	}
	if (family.includes("java")) {
		return `**Required outcome:**\n- For this option, identify the classes, fields, method contracts, and object-state changes.\n- Compile and run one normal case and one boundary or awkward case.\n- Explain the main type, inheritance, interface, collection, or record decision in the ${courseLabel} context.`;
	}
	if (family.includes("c++")) {
		return `**Required outcome:**\n- For this option, name the data representation, ownership or lifetime assumption, compile command, and expected output.\n- Build with ${courseLabel} warnings when possible and test normal, boundary, and malformed or awkward input.\n- Explain the container, pointer/reference, memory, or algorithm decision.`;
	}

	return choose([
		`**Required outcome:**\n- For this option, define the inputs, output or artifact, success condition, and evidence source.\n- Include one normal case, a boundary case, and one awkward or failure case.\n- Explain the main design, model, proof, or reasoning decision in the ${courseLabel} context.`,
		`**Required outcome:**\n- For this option, state the starting context, target result, evidence source, and one assumption that could fail.\n- Check a representative case and one edge or transfer case.\n- Explain the reasoning choice that makes the ${courseLabel} result valid.`,
		`**Required outcome:**\n- For this option, name the artifact, inputs, constraints, output, and verification evidence.\n- Test the ordinary path plus one boundary, exception, or changed-condition path.\n- Explain the main tradeoff or model decision in the ${courseLabel} context.`,
		`**Required outcome:**\n- For this option, identify what is being built or solved, what counts as success, and how the result will be checked.\n- Include one small traceable case and one nontrivial case.\n- Explain which ${courseLabel} concept controls the final behavior.`
	]);
}

function projectOptionExtension(
	profile: ResearchExpansionProfile,
	project: string
) {
	const family = profile.family.toLowerCase();
	const choose = (options: string[]) =>
		options[
			stableVariantIndex(`${profile.family}|${project}`, options.length)
		];

	if (family.includes("security") || family.includes("systems")) {
		return choose([
			`**Extension:** Add one rollback, monitoring, hardening, or reproducibility check and explain how it changes the evidence.`,
			`**Extension:** Add one failure-mode or recovery check and document the command, log, or trace that proves the result.`,
			`**Extension:** Add a scope, reset, or defensive-control variation that keeps the lab local and reproducible.`
		]);
	}
	if (isScienceFamily(family)) {
		return choose([
			`**Extension:** Change one variable, data source, scale, or model assumption and predict how the claim should change.`,
			`**Extension:** Add a second evidence source or model limitation and explain whether it strengthens the claim.`,
			`**Extension:** Compare the same phenomenon at another scale, system, or condition and revise the explanation.`
		]);
	}
	if (
		family.includes("data") ||
		family.includes("ai") ||
		family.includes("machine learning")
	) {
		return choose([
			`**Extension:** Add a baseline, counterexample, alternate metric, or limitation check and compare the interpretation.`,
			`**Extension:** Add one data-quality, leakage, sampling, or evaluation check before trusting the result.`,
			`**Extension:** Compare the result with a simpler method and name what the added complexity changes.`
		]);
	}
	if (
		family.includes("scratch") ||
		family.includes("pygame") ||
		family.includes("unity")
	) {
		return choose([
			`**Extension:** Add one rule, control, level, reset, or feedback variation while preserving the main play goal.`,
			`**Extension:** Add one replay, scoring, difficulty, or collision variation and test the changed game state.`,
			`**Extension:** Add one player-feedback improvement and explain which event or state change triggers it.`
		]);
	}
	if (family.includes("usaco")) {
		return choose([
			`**Extension:** Add one harder custom case, then explain which invariant or complexity bound it stress-tests.`,
			`**Extension:** Add one tie, boundary, duplicate, or ordering case and trace why the algorithm still works.`,
			`**Extension:** Compare two possible approaches and explain which constraint decides between them.`
		]);
	}
	if (
		family.includes("javascript") ||
		family.includes("web") ||
		family.includes("swift")
	) {
		return choose([
			`**Extension:** Add one empty, error, accessibility, layout, or state-transition case and verify the visible behavior.`,
			`**Extension:** Add one reload, navigation, invalid-input, or responsive-state check and record the observed behavior.`,
			`**Extension:** Add one user-flow variation that changes state or persistence without hiding the result.`
		]);
	}
	if (
		family.includes("java") ||
		family.includes("c++") ||
		family.includes("python")
	) {
		return choose([
			`**Extension:** Add one edge case, helper, refactor, or alternate representation and explain which requirement it tests.`,
			`**Extension:** Add one changed input, object state, data structure, or ownership case and compare the result.`,
			`**Extension:** Add one small refactor plus a test or trace proving that behavior stayed equivalent.`
		]);
	}

	return choose([
		`**Extension:** Change one constraint, input, representation, or success condition and explain what stayed equivalent.`,
		`**Extension:** Add one transfer case with a changed assumption and document what still works.`,
		`**Extension:** Add a second example that tests the same idea under a different boundary condition.`
	]);
}

function courseExpansionLabel(
	course: RawCourse,
	profile: ResearchExpansionProfile
) {
	return course.name.trim() || profile.family;
}

function buildStandardsModule(
	profile: ResearchExpansionProfile,
	courseLabel: string
): RawCourseModule {
	return {
		title: `${courseLabel}: Standards and Course Map`,
		curriculum: [
			{
				title: `${courseLabel} Source Map`,
				content: [
					`**Course focus:** This ${courseLabel} section identifies the standards, documentation, and tooling references that keep the course aligned with current expectations. Priority is **${profile.priority}**, so these items shape pacing and practice before lower-priority enrichment.`,
					`**Authoritative sources to use:**\n${sourceBullets(profile.sources)}`,
					standardsEvidenceNote(courseLabel),
					"**Completion check:** The course is traceable to these standards, docs, or tooling references rather than only to inherited project names."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Core Skills`,
				content: [
					`**Course focus:** ${courseLabel} skills benefit from focused review, clear examples, and explicit prerequisite connections before larger projects.`,
					`**Core skills:**\n${bullets(profile.gaps)}`,
					courseUseNote(
						courseLabel,
						"One core-skill item can become a short lesson, a diagnostic checkpoint, or a remediation path depending on the course pacing."
					),
					"**Completion check:** A lesson or project is ready when it includes a concrete explanation, worked example, practice task, and completion check for one of these skills."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Next Topics`,
				content: [
					`**Course focus:** These ${courseLabel} topics mark the next areas where the course can become more complete. Each topic should appear in prerequisite order and connect to a concrete project or checkpoint.`,
					`**Expansion topics:**\n${bullets(profile.topics)}`,
					courseUseNote(
						courseLabel,
						"Topic additions are strongest when they include vocabulary, one representative example, one misconception check, and one transfer task."
					),
					"**Common pitfalls:** Each topic should connect to a real project. If the connection is unclear, add a smaller bridge lesson before the major project."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Boundaries`,
				content: [
					`**Course focus:** The priority and expansion topics clarify what belongs in ${courseLabel} and what should move to a prerequisite, follow-up, or separate course. This keeps the course coherent instead of absorbing every adjacent topic.`,
					"**Boundary rule:** Keep a topic inside the course when it directly supports the projects, assessments, and expected readiness level. Move a topic elsewhere when it requires a different prerequisite chain, a different safety model, or a level of depth that would crowd out the core purpose.",
					"**Completion check:** The boundary, one near-term addition, and one intentionally deferred topic are explicit."
				].join("\n\n")
			}
		],
		supplementalProjects: [
			{
				title: `${courseLabel} Standards Checkpoint`,
				content: [
					`**Readiness check:** Build a one-page map for ${courseLabel} that lists prerequisites, target standards or docs, and the first observable readiness skill.`,
					"**Map guidance:** The map should distinguish prerequisite knowledge, required content, optional enrichment, and reference-only material. It should also record which project or assessment proves that a learner can use the mapped skill independently.",
					`**Completion checks:**\n- The map names at least three prerequisites.\n- Each planned module cites a standard, official document, or deliberate toolchain target.\n- The evidence for ${profile.family} readiness is explicit.`
				].join("\n\n")
			},
			{
				title: `${courseLabel} Sequence Triage`,
				content: [
					`**Readiness check:** Review the current ${courseLabel} sequence and mark every gap as prerequisite, core lesson, project practice, assessment, enrichment, or optional reference.`,
					"**Triage guidance:** Sequence decisions should be based on dependency, not convenience. If a project expects a skill that has not appeared in a worked example or smaller practice task, add a bridge item before that project.",
					`**Completion checks:**\n- No gap remains as a vague reminder without an owner.\n- Required ${profile.family} gaps appear before the project that depends on them.\n- Optional enrichment is labeled separately from required pacing.`
				].join("\n\n")
			}
		]
	};
}

function buildSequencingModule(
	profile: ResearchExpansionProfile,
	courseLabel: string
): RawCourseModule {
	return {
		title: `${courseLabel}: Course Roadmap`,
		curriculum: [
			{
				title: `${courseLabel} Module Options`,
				content: [
					`**Course focus:** These ${profile.family} additions can become full ${courseLabel} modules after the source material, examples, and assessments are clear. The order follows prerequisite dependency, not just topic popularity.`,
					`**Suggested additions:**\n${bullets(profile.moduleAdditions)}`,
					sequencingEvidenceNote(courseLabel),
					"**Completion check:** Every module states the concept, why it matters, one worked example, one practice task, one assessment checkpoint, and one extension."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Resources`,
				content: [
					`**Resource guide:** These materials support ${courseLabel} modules by making source code, datasets, simulations, version choices, and reference materials explicit.`,
					`**Materials and tools:**\n${bullets(profile.materials)}`,
					"**Resource use:** Each resource should have a role: explanation, starter artifact, data source, simulation, rubric, answer check, or extension. Links that are only background references should be labeled that way so they do not look like required assignments.",
					profile.safety
						? `**Safety or delivery boundary:** ${profile.safety}`
						: `**Safety or delivery boundary:** ${courseLabel} uses age-appropriate examples, cited source material, and project scopes small enough for an online lesson.`
				].join("\n\n")
			},
			{
				title: `${courseLabel} Readiness Checklist`,
				content: [
					`**Course focus:** This checklist keeps ${courseLabel} modules concrete, sequenced, and assessable.`,
					"**Review method:** Read one module at a time and ask whether the concept, project, and assessment all measure the same skill. If the assessment checks a different skill than the project practices, revise the project or add a clearer checkpoint before the module is marked ready.",
					"**Completion checks:**\n- Each module has a named prerequisite and observable outcome.\n- Each project has required behavior, test cases, and an extension.\n- The assessment matches the subject: code trace, rubric, CER response, math justification, security report, or model evaluation.\n- Any toolchain, dataset, simulation, or source-code dependency is linked and version-aware."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Reference Refresh`,
				content: [
					`**Resource guide:** ${courseLabel} references should stay current when the course depends on an external tool, source repository, dataset, simulation, exam standard, or official documentation page.`,
					"**Refresh guidance:** Stable conceptual references can be reviewed less often, but tool versions, source-code repositories, exam links, data licenses, and simulation URLs need an explicit refresh cadence. If a link changes, update the course text and the project resource card together.",
					"**Completion check:** The note states what must be refreshed each term, which links or versions are stable, and which materials are reference-only rather than assignments."
				].join("\n\n")
			}
		],
		supplementalProjects: [
			{
				title: `${courseLabel} Dependency Graph`,
				content: [
					`**Project goal:** Draw or write a dependency graph for ${profile.family}. Show which ${courseLabel} modules unlock later projects and which topics work as optional enrichment.`,
					'**Graph guidance:** Each node should be a concrete skill or module, not a broad course label. Each edge should explain the dependency in plain language, such as "requires arrays before 2D grids" or "requires variables before simulation state."',
					`**Completion checks:**\n- At least five modules or topic clusters are included.\n- Every edge explains the prerequisite relationship.\n- One risky ${profile.family} ordering decision is identified and revised.`
				].join("\n\n")
			},
			{
				title: `${courseLabel} Materials Readiness`,
				content: [
					`**Project goal:** Create a materials checklist for ${courseLabel}: source code, starter/reference files, datasets, simulations, diagrams, rubrics, and tool versions.`,
					"**Checklist guidance:** A missing resource is not automatically a blocker, but it must be classified. Mark each item as required, replaceable, provided, learner-created, optional enrichment, or reference-only so the course does not depend on hidden materials.",
					`**Completion checks:**\n- Every required project has a starter state or equivalent handout.\n- Every ${profile.family} assessment has a rubric or answer-check method.\n- Any external tool or source is documented with a stable URL.`
				].join("\n\n")
			}
		]
	};
}

function buildProjectModule(
	profile: ResearchExpansionProfile,
	courseLabel: string
): RawCourseModule {
	const projects = profile.projectTypes.slice(
		0,
		Math.max(2, profile.projectTypes.length)
	);

	return {
		title: `${courseLabel}: Project and Assessment Practice`,
		curriculum: [
			{
				title: `${courseLabel} Project Ladder`,
				content: [
					`**Course focus:** These ${profile.family} project types create a ${courseLabel} progression from guided practice to independent capstone work. Every ${courseLabel} project names the artifact, required behavior, evidence of correctness, and one extension path.`,
					`**Project ladder:**\n${bullets(profile.projectTypes)}`,
					projectEvidenceNote(courseLabel),
					`**Completion check:** A ${courseLabel} project is complete when the main design, model, proof, or reasoning choice is explained, not only when it runs or produces an answer.`
				].join("\n\n")
			},
			{
				title: `${courseLabel} Checkpoints`,
				content: [
					`**Readiness check:** These checks identify whether ${courseLabel} concepts are ready for the next module.`,
					`**Assessment ideas:**\n${bullets(profile.assessments)}`,
					`**Checkpoint use:** Treat each ${courseLabel} assessment as evidence for one named skill. The best ${courseLabel} checkpoint is small enough to complete quickly but specific enough to reveal whether the concept transfers to a changed example.`,
					`**Evidence of proficiency:** ${courseLabel} work demonstrates the ability to transfer the same idea to a new example, explain why the result is valid, and identify one limitation or edge case.`
				].join("\n\n")
			},
			{
				title: `${courseLabel} Rubric`,
				content: [
					`**Project reflection:** Every major ${courseLabel} project includes a short reflection naming the goal, approach, evidence, bug or misconception, and one next improvement.`,
					"**Rubric use:** Score the artifact and the explanation separately. A project can produce the right output while still needing a stronger explanation, clearer evidence, better edge-case coverage, or a more maintainable structure.",
					"**Completion checks:**\n- The deliverable is visible, runnable, or inspectable.\n- A normal case and an edge case are tested or justified.\n- The explanation does not depend on reading every line or step from notes."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Capstone Gate`,
				content: [
					`**Readiness check:** Before a ${courseLabel} capstone begins, the prerequisite modules, project ladder, and assessment model should already be practiced on smaller artifacts.`,
					"**Gate guidance:** The capstone is ready when it combines known skills in a larger context rather than introducing several untested ideas at once. The first version should be narrow, demonstrable, and easy to verify before optional polish is added.",
					"**Evidence of proficiency:** Capstone work demonstrates the ability to state the goal, choose an approach, predict two risks, define tests or evidence, and explain what would count as a complete first version."
				].join("\n\n")
			}
		],
		supplementalProjects: projects.map(project => ({
			title: `Project Option: ${projectTitle(project)}`,
			content: [
				projectOptionGoal(profile, courseLabel),
				projectOptionRequiredOutcome(profile, courseLabel, project),
				`**Completion checks:**\n${bullets(profile.assessments.slice(0, 3))}`,
				projectOptionExtension(profile, project)
			].join("\n\n")
		}))
	};
}

function buildExpansionModules(
	profile: ResearchExpansionProfile,
	courseLabel: string
) {
	return [
		buildStandardsModule(profile, courseLabel),
		buildSequencingModule(profile, courseLabel),
		buildProjectModule(profile, courseLabel)
	];
}

const scratchProfile: ResearchExpansionProfile = {
	family: "Scratch",
	priority: "urgent",
	sources: ["CSTA K-12 Standards"],
	gaps: [
		"Map beginner Scratch projects to events, loops, variables, decomposition, testing, and remixing.",
		"Add a stronger debugging and iteration thread across both Scratch levels.",
		"Clarify which tasks are visual-first for younger readers.",
		"Add a blocks-to-pseudocode bridge so Scratch project explanations use language that transfers to Python or JavaScript."
	],
	topics: [
		"Broadcasts, clones, lists, custom blocks, game state, sprite coordination, and remix etiquette.",
		"Computational-thinking vocabulary: sequence, event, loop, condition, variable, abstraction, and debugging.",
		"Blocks-to-pseudocode explanations, event chains, state diagrams, presentation habits, and accessibility for younger creators."
	],
	moduleAdditions: [
		"Game state and scene transitions.",
		"Clones and object-like thinking.",
		"Lists for scores, inventories, and question banks.",
		"Debugging studio for broken Scratch scripts.",
		"Capstone polish: instructions, win/loss state, difficulty, and presentation."
	],
	projectTypes: [
		"Maze with timer and collectibles.",
		"Dialogue adventure using broadcasts.",
		"Clone-based avoidance or collection game.",
		"Quiz game backed by lists.",
		"Remix-and-explain project."
	],
	assessments: [
		"Explain one event chain from click or keypress to visual result.",
		"Fix three intentionally broken scripts.",
		"Apply the Scratch project rubric."
	],
	materials: [
		"Scratch educator references and sample projects.",
		"Broken-script debugging cards.",
		"Simple presentation rubric for young students.",
		"Blocks-to-pseudocode glossary and project reflection prompts."
	]
};

const pythonProfile: ResearchExpansionProfile = {
	family: "Python",
	priority: "urgent",
	sources: ["Python Tutorial", "CSTA K-12 Standards"],
	gaps: [
		"Strengthen Python Level 1 and 2 project prompts with concrete inputs, outputs, tests, and extensions.",
		"Build Python Level 3 into a serious algorithms, data, and object-design ladder.",
		"Audit starter and review parity for all Python source folders."
	],
	topics: [
		"Testing small functions, debugging with trace output, files, exceptions, modules, command-line programs, APIs, and virtual environments.",
		"Dictionaries, sets, nested data, recursion, sorting, searching, and runtime reasoning.",
		"Clear separation between beginner projects, supplemental projects, remediation, and capstones."
	],
	moduleAdditions: [
		"Python debugging and testing lab.",
		"File formats: TXT, CSV, and JSON.",
		"Command-line utilities.",
		"Nested data and data modeling.",
		"Algorithmic thinking with runtime checkpoints.",
		"Object-oriented Python capstone."
	],
	projectTypes: [
		"Contact book or gradebook stored in JSON.",
		"Text analyzer with word frequencies and stop words.",
		"CLI flashcard trainer.",
		"Recursive puzzle solver.",
		"Object-oriented game model without graphics."
	],
	assessments: [
		"Write function-level tests for normal and edge cases.",
		"Trace code before running it.",
		"Debug type conversion, mutation, off-by-one, and missing-return mistakes.",
		"Review capstones for requirements, test cases, organization, and explanation."
	],
	materials: [
		"Starter repos and review materials for each project.",
		"pytest or lightweight assertion examples.",
		"CSV and JSON fixtures with normal and malformed records."
	]
};

const pyGameProfile: ResearchExpansionProfile = {
	family: "PyGame",
	priority: "soon",
	sources: ["Pygame Documentation", "Python Tutorial", "CSTA K-12 Standards"],
	gaps: [
		"Define the supported Pygame and Python setup flow.",
		"Turn the course into a game-loop architecture sequence rather than isolated games.",
		"Add asset licensing, debugging, and playtesting expectations."
	],
	topics: [
		"Main loop, event queues, frame rate, sprites, rectangles, collision, animation, audio, menus, level data, and save state.",
		"Separation between model logic and rendering.",
		"Debugging visual programs with reproducible playtest steps."
	],
	moduleAdditions: [
		"Game loop and event handling.",
		"Sprite architecture and collision systems.",
		"Level loading from text or JSON.",
		"Menus, pause, score, and end states.",
		"Polish with audio, animation, feedback, and playtesting."
	],
	projectTypes: [
		"Pong or Breakout clone with difficulty levels.",
		"Tile-based maze loaded from a text file.",
		"Top-down collection game with enemies.",
		"Platformer prototype with collision constraints.",
		"Arcade capstone with menu, scoring, restart, and one extension mechanic."
	],
	assessments: [
		"Explain update, draw, and event phases.",
		"Run collision edge-case checks.",
		"Maintain a playtest log with bug, reproduction step, fix, and retest.",
		"Use a rubric for controls, feedback, state, code structure, and polish."
	],
	materials: [
		"Version-pinned Pygame setup notes.",
		"Permissively licensed sprite and sound assets.",
		"Template game loop and playtest checklist."
	]
};

const dataScienceProfile: ResearchExpansionProfile = {
	family: "Data Science",
	priority: "soon",
	sources: ["pandas Documentation", "NIST AI RMF"],
	gaps: [
		"Add a stable dataset catalog with age-appropriate public data.",
		"Assess interpretation separately from coding.",
		"Expand reproducibility, data ethics, and visualization literacy."
	],
	topics: [
		"Cleaning, missing values, joins, grouping, reshaping, outliers, correlation vs causation, sampling bias, notebooks, and environments.",
		"Visualization selection and misleading chart detection.",
		"Introductory statistics for interpretation."
	],
	moduleAdditions: [
		"Data lifecycle and question design.",
		"Cleaning and validation with pandas.",
		"Exploratory analysis and visualization.",
		"Statistics for interpretation.",
		"Reproducible notebooks and project reports.",
		"Ethics, bias, privacy, and provenance."
	],
	projectTypes: [
		"Public dataset exploratory report.",
		"Messy CSV cleaning challenge.",
		"Visualization redesign project.",
		"Weather, sports, transit, or education trend analysis.",
		"Self-directed final data story with conclusions and limitations."
	],
	assessments: [
		"Create a data dictionary.",
		"Write a cleaning log that explains every change.",
		"Critique a visualization.",
		"State claim, evidence, and caveat from a dataset.",
		"Rerun a notebook from top to bottom."
	],
	materials: [
		"Dataset catalog with licenses and source URLs.",
		"Notebook template with setup, cleaning, analysis, and conclusion sections.",
		"Visualization rubric."
	]
};

const aiProfile: ResearchExpansionProfile = {
	family: "AI",
	priority: "soon",
	sources: ["CSTA K-12 Standards", "NIST AI RMF"],
	gaps: [
		"Keep AI distinct from ML by emphasizing state, search, rules, planning, and responsible decision systems.",
		"Add non-ML AI projects before model training appears.",
		"Define safe boundaries for generative AI discussion and data use."
	],
	topics: [
		"Search algorithms, heuristics, game trees, minimax, state machines, constraint satisfaction, planning, and rule systems.",
		"Evaluation of AI behavior and failure cases.",
		"Responsible AI concepts: stakeholder, harm, mitigation, uncertainty, and human oversight."
	],
	moduleAdditions: [
		"State representation and search.",
		"Heuristics and pathfinding.",
		"Game-playing agents.",
		"Rules, state machines, and planning.",
		"Responsible AI and human oversight.",
		"AI behavior testing."
	],
	projectTypes: [
		"Maze solver with BFS, DFS, or A*.",
		"Tic-tac-toe or Connect Four agent with minimax.",
		"Rule-based recommendation toy system.",
		"Finite-state NPC behavior model.",
		"Constraint puzzle solver."
	],
	assessments: [
		"Draw a state graph and identify valid moves.",
		"Compare uninformed and heuristic search results.",
		"Explain one AI failure case.",
		"Identify stakeholder, harm, mitigation, and uncertainty."
	],
	materials: [
		"Graph and grid fixtures.",
		"Search visualization examples.",
		"Responsible AI reflection template."
	]
};

function algebraProfile(
	family: string,
	focus: string[]
): ResearchExpansionProfile {
	return {
		family,
		priority: "urgent",
		sources: ["Common Core Algebra"],
		gaps: [
			"Align the sequence to standards-backed algebra and functions progressions.",
			"Separate lesson, practice, project, review, quiz, and cumulative assessment roles.",
			"Add graphing, modeling, and error-analysis projects rather than only procedural practice."
		],
		topics: [
			"Structure, equivalence, multiple representations, modeling, graph interpretation, and written reasoning.",
			...focus
		],
		moduleAdditions: [
			"Algebraic habits: structure, equivalence, and checking.",
			"Functions across tables, graphs, equations, and verbal rules.",
			"Modeling with real or provided data.",
			"Error-analysis workshops.",
			"Cumulative readiness and mixed-practice checks."
		],
		projectTypes: [
			"Model a real or provided dataset.",
			"Create a graph-and-equation story.",
			"Repair a worked solution with hidden errors.",
			"Build a standards-aligned mixed review set.",
			"Write a short justification for each transformation step."
		],
		assessments: [
			"Standards-aligned short quizzes.",
			"Explain-your-reasoning checkpoints.",
			"Graph interpretation checks.",
			"Error correction tasks.",
			"Cumulative mixed-practice checks every few modules."
		],
		materials: [
			"Common Core standard map.",
			"Desmos or GeoGebra graphing tasks.",
			"Worked-example and error-analysis templates."
		]
	};
}

const cppProfile: ResearchExpansionProfile = {
	family: "C++ Levels 1-3",
	priority: "urgent",
	sources: ["ISO C++ Core Guidelines"],
	gaps: [
		"Build a coherent three-course progression from introductory syntax through modern C++ design.",
		"Confirm which pointer, raw-array, and dynamic-memory concepts belong to Level 1 baseline.",
		"Keep AI and ML out of the C++ path so those topics remain unique to AI/ML courses."
	],
	topics: [
		"RAII, references, const correctness, value vs reference semantics, STL containers, iterators, algorithms, and smart pointers.",
		"Templates, inheritance, virtual functions, abstract base classes, state machines, parsers, serialization, and testing.",
		"CMake or Make, compiler warnings, sanitizers, debugger, formatting, and valgrind where appropriate."
	],
	moduleAdditions: [
		"Modern C++ object ownership and RAII.",
		"STL containers and algorithms as design tools.",
		"Interfaces with abstract base classes and virtual dispatch.",
		"Templates and generic functions/classes.",
		"State machines and command architecture.",
		"File formats, small parsers, and persistence.",
		"Capstone architecture and testing."
	],
	projectTypes: [
		"Command-line task tracker with file persistence.",
		"Inventory or gradebook using STL containers and serialization.",
		"State-machine text adventure or vending machine.",
		"Parser for a small config format.",
		"Plugin-style shape, game, or entity system using abstract base classes."
	],
	assessments: [
		"Draw a memory or ownership diagram.",
		"Require compiler-warning and sanitizer-clean builds.",
		"Review const/reference/ownership choices.",
		"Write unit tests for edge cases.",
		"Defend why a class, interface, or template is appropriate."
	],
	materials: [
		"Compiler setup notes and sanitizer commands.",
		"Starter repos and review materials for every new project.",
		"Design-review rubric for ownership, tests, and architecture."
	]
};

const dsaProfile: ResearchExpansionProfile = {
	family: "C/C++ DS&A",
	priority: "soon",
	sources: ["ISO C++ Core Guidelines", "USACO Guide"],
	gaps: [
		"Distinguish DS&A from C++ Level 3 by focusing on correctness, complexity, and implementation tradeoffs.",
		"Add test harnesses and benchmark-style reflections.",
		"Define prerequisites for pointers, recursion, classes, and STL."
	],
	topics: [
		"Linked lists, stacks, queues, hash tables, trees, heaps, graphs, recursion, sorting, searching, DP, and amortized analysis.",
		"Iterator invalidation and container-choice tradeoffs."
	],
	moduleAdditions: [
		"Complexity and empirical measurement.",
		"Linear structures from scratch.",
		"Trees and priority queues.",
		"Hashing and collision strategies.",
		"Graph representations and traversal.",
		"Dynamic programming patterns.",
		"Capstone comparing data-structure choices."
	],
	projectTypes: [
		"Autocomplete or spell-check trie.",
		"Maze or pathfinding graph.",
		"Task scheduler with heap.",
		"Hash-table implementation with collision tests.",
		"Expression evaluator with stack.",
		"Benchmark report comparing containers."
	],
	assessments: [
		"Justify Big-O complexity.",
		"Trace operations by hand.",
		"Pass hidden edge-case tests.",
		"Write a complexity and memory reflection."
	],
	materials: [
		"Algorithm trace worksheets.",
		"Unit test harnesses.",
		"Benchmark fixture templates."
	]
};

const cSystemsProfile: ResearchExpansionProfile = {
	family: "C Systems",
	priority: "soon",
	sources: ["systemd Documentation"],
	gaps: [
		"Define whether the course is C programming, Unix systems, or a bridge to low-level security.",
		"Add safe tooling: warnings, sanitizers, debugger, make, man pages, and reproducible local exercises.",
		"Make secure C practices explicit."
	],
	topics: [
		"Pointers, arrays, structs, allocation, file descriptors, processes, command-line arguments, parsing, binary data, errno, signals, pipes, and sockets.",
		"Memory-safety failure modes and defensive programming."
	],
	moduleAdditions: [
		"C build and debugging workflow.",
		"Memory and strings.",
		"Files and binary formats.",
		"Processes, pipes, and signals.",
		"Small network tools.",
		"Defensive C and sanitizers."
	],
	projectTypes: [
		"Mini grep or word-count utility.",
		"CSV parser with validation.",
		"Binary file inspector.",
		"Shell pipeline exerciser.",
		"Tiny local client/server toy program.",
		"Memory-safe dynamic array with tests."
	],
	assessments: [
		"Require sanitizer-clean runs.",
		"Trace memory manually.",
		"Use an error-handling checklist.",
		"Review buffer bounds and ownership."
	],
	materials: [
		"Makefile template.",
		"Sanitizer and debugger command guide.",
		"Toy input files with malformed cases."
	],
	safety: "Use local fixtures and toy programs only. Do not require changes to the student's real shell, network, or system services."
};

const assemblyProfile: ResearchExpansionProfile = {
	family: "Assembly",
	priority: "soon",
	sources: ["ISO C++ Core Guidelines"],
	gaps: [
		"Choose one target architecture and toolchain instead of mixing assembly dialects.",
		"Decide whether students mainly write assembly, read compiler output, or learn architecture through assembly.",
		"Add trace-heavy assessment so students understand registers, stack, and memory."
	],
	topics: [
		"Registers, addressing, stack frames, calling conventions, flags, branching, loops, functions, arrays, ABI, debugging, and compiler output.",
		"Binary, hex, signed, and unsigned interpretation."
	],
	moduleAdditions: [
		"Number representation and memory.",
		"Registers and arithmetic.",
		"Branching and loops.",
		"Functions and stack frames.",
		"Arrays and pointers from assembly view.",
		"Reading compiler output from C/C++."
	],
	projectTypes: [
		"Arithmetic and conversion routines.",
		"String length or array sum routine.",
		"Assembly-backed function called from C.",
		"Compare C code and compiler-generated assembly.",
		"Tiny VM or interpreter for a made-up instruction set."
	],
	assessments: [
		"Trace register values line by line.",
		"Draw a stack-frame diagram.",
		"Explain one compiled C function in assembly.",
		"Debug a wrong branch or calling-convention bug."
	],
	materials: [
		"Architecture and ABI choice document.",
		"Compiler Explorer examples.",
		"Debugger trace worksheet."
	],
	safety: "Keep native assembly exercises local and small. Prefer reading compiler output or toy interpreters when architecture setup is fragile."
};

const javaProfile: ResearchExpansionProfile = {
	family: "Java",
	priority: "soon",
	sources: ["College Board AP CSA", "CSTA K-12 Standards"],
	gaps: [
		"Keep Java with Graphics and Java without Graphics coherent while sharing a strong core.",
		"Make advanced Java sufficient for students after C++ Level 3.",
		"Do not treat AP CSA as the only advanced Java path."
	],
	topics: [
		"Abstract classes, interfaces, records, enums, generics, collections, exceptions, file I/O, packages, JUnit, streams, lambdas, and model-view separation.",
		"Graphics event loops and alternate non-graphics deliverables."
	],
	moduleAdditions: [
		"Modern Java data modeling with records and classes.",
		"Interfaces and abstract classes in real designs.",
		"Collections and generics.",
		"Testing with JUnit.",
		"Streams and functional-style operations.",
		"File-backed applications.",
		"Graphics branch event loop and model/view separation."
	],
	projectTypes: [
		"CLI library or inventory manager.",
		"Record-backed CSV or JSON data loader.",
		"Interface-driven simulator.",
		"Abstract class hierarchy with tests.",
		"Graphics app or non-graphics model-layer alternative.",
		"Multi-class capstone with persistence and tests."
	],
	assessments: [
		"Translate UML or design notes into code.",
		"Refactor duplicate subclasses into interface or abstract-class design.",
		"Pass JUnit hidden edge cases.",
		"Explain when to use class, record, interface, abstract class, and enum."
	],
	materials: [
		"JUnit starter project.",
		"Graphics and non-graphics alternate project specs.",
		"Design rubric for records, classes, interfaces, and inheritance."
	]
};

const apCsaProfile: ResearchExpansionProfile = {
	family: "AP Computer Science A",
	priority: "soon",
	sources: ["College Board AP CSA"],
	gaps: [
		"Map every module to current College Board units, skills, Java subset, and FRQ styles.",
		"Improve project-to-standard links and missing solution/source parity.",
		"Add explicit FRQ practice and official-style rubric scoring."
	],
	topics: [
		"AP-style tracing, written explanations, array and ArrayList traversal, 2D arrays, class design, inheritance, polymorphism, recursion, sorting, and searching.",
		"Exam-specific misconceptions and distractor analysis."
	],
	moduleAdditions: [
		"AP skill map and diagnostic pretest.",
		"FRQ writing workshop.",
		"Multiple-choice strategy and distractor analysis.",
		"Unit review modules keyed to AP CSA units.",
		"Timed practice exam cadence."
	],
	projectTypes: [
		"AP-style class design mini-FRQs.",
		"Array and ArrayList traversal drills with written explanations.",
		"2D array grid problems.",
		"Inheritance and polymorphism trace projects.",
		"Recursion tracing and implementation projects.",
		"Released-FRQ-inspired practice with modified contexts."
	],
	assessments: [
		"Timed MCQ checkpoints.",
		"FRQ scoring with official-style rubrics.",
		"Error log by AP topic.",
		"Oral tracing for loops, recursion, and polymorphism."
	],
	materials: [
		"Current AP CSA Course and Exam Description.",
		"Released FRQs and scoring guidelines.",
		"AP topic error log template."
	]
};

const usacoProfile: ResearchExpansionProfile = {
	family: "USACO",
	priority: "soon",
	sources: ["USACO Official", "USACO Guide", "ISO C++ Core Guidelines"],
	gaps: [
		"Build calibrated Bronze, Silver, and Gold ladders from official problems.",
		"Add solution explanations and complexity targets, not just problem links.",
		"Include contest workflow, debugging, and post-contest review."
	],
	topics: [
		"Bronze simulation, complete search, sorting, maps, sets, prefix sums, and greedy.",
		"Silver graphs, flood fill, binary search on answer, two pointers, DFS/BFS, and DP intro.",
		"Gold advanced DP, shortest paths, MST/DSU, Fenwick/segment trees, and graph optimization."
	],
	moduleAdditions: [
		"Contest environment and debugging.",
		"Complexity and proof habits.",
		"Bronze ladder by pattern.",
		"Silver graph and search ladder.",
		"Gold data-structure and DP ladder.",
		"Post-contest analysis and rewrite module."
	],
	projectTypes: [
		"Pattern notebook with solved examples.",
		"Problem-set playlist by concept.",
		"Template implementation drill.",
		"Rewrite brute force into optimized solution.",
		"Mock contest plus postmortem."
	],
	assessments: [
		"Run timed problem attempts.",
		"Justify complexity before coding.",
		"Debug wrong-answer cases.",
		"Pass sample and hidden-style tests."
	],
	materials: [
		"Official problem links and USACO Guide topic order.",
		"C++ template repository.",
		"Postmortem worksheet."
	]
};

const designPatternsProfile: ResearchExpansionProfile = {
	family: "Design Patterns",
	priority: "later",
	sources: ["ISO C++ Core Guidelines", "Python Tutorial"],
	gaps: [
		"Present patterns as refactoring tools, not memorized diagrams.",
		"Split Java, C++, and Python idioms instead of copying the same pattern language everywhere.",
		"Add anti-patterns and when-not-to-use-this-pattern discussions."
	],
	topics: [
		"SOLID, composition over inheritance, dependency injection, factory, strategy, observer, adapter, decorator, command, state, null object, repository, and test seams.",
		"C++ alternatives through RAII, templates, value semantics, and policy classes.",
		"Python alternatives through protocols, dataclasses, decorators, context managers, and first-class functions."
	],
	moduleAdditions: [
		"Code smells and refactoring basics.",
		"Pattern selection decision tree.",
		"Patterns by problem: creation, behavior, structure, decoupling, and state.",
		"Language-specific idiom modules.",
		"Capstone refactor of a messy app."
	],
	projectTypes: [
		"Refactor if/else behavior into Strategy.",
		"Add Observer events to a small model.",
		"Convert duplicate constructors to Factory.",
		"Implement Command-based undo.",
		"Refactor a mini-app with tests before and after."
	],
	assessments: [
		"Identify smell, choose pattern, and justify tradeoff.",
		"Review before/after design.",
		"Preserve behavior with regression tests.",
		"Explain why a simpler design may be better."
	],
	materials: [
		"Before/after code samples.",
		"Pattern decision cards.",
		"Regression test harnesses."
	]
};

const chemistryProfile: ResearchExpansionProfile = {
	family: "Chemistry",
	priority: "urgent",
	sources: ["NGSS Appendices", "ACS Chemistry Guidelines", "PhET"],
	gaps: [
		"Align to NGSS and ACS guidance while keeping all required work remote-safe.",
		"Replace physical-lab assumptions with simulations, provided data, diagrams, videos, and paper modeling.",
		"Build misconception checkpoints around particles, conservation, bonding, reactions, and stoichiometry."
	],
	topics: [
		"Matter and particle model, atomic structure, periodic trends, bonding, reactions, equations, mole concept, stoichiometry, acids/bases, thermochemistry, solutions, and equilibrium intro.",
		"Quantitative chemistry with scaffolded algebra support."
	],
	moduleAdditions: [
		"Particle model and conservation of matter.",
		"Periodic table as predictive model.",
		"Bonding and molecular structure.",
		"Reaction types and balancing.",
		"Mole concept and stoichiometry.",
		"Solutions and concentration.",
		"Virtual lab and data analysis module."
	],
	projectTypes: [
		"PhET-based particle-model investigation.",
		"Periodic trend data visualization.",
		"Balance-and-explain reaction card set.",
		"Stoichiometry recipe analogy with limiting reactant.",
		"Acid/base simulation report.",
		"CER explanation using provided reaction data."
	],
	assessments: [
		"Interpret particle diagrams.",
		"Balance equations.",
		"Use units and dimensional analysis.",
		"Write claim, evidence, and reasoning.",
		"Catch misconceptions such as atoms disappearing or bonds storing energy."
	],
	materials: [
		"PhET chemistry simulations.",
		"Particle diagrams and reaction datasets.",
		"Remote-safe CER templates."
	],
	safety: "No required beakers, kits, heat, household chemicals, or physical reactions. Any demonstration must have an equivalent simulation or provided-data version."
};

const elementaryScienceProfile: ResearchExpansionProfile = {
	family: "Elementary Science",
	priority: "urgent",
	sources: ["NGSS Appendices", "PhET"],
	gaps: [
		"Decide whether to split K-2 and 3-5 or clearly label differentiated paths.",
		"Align to NGSS grade-band expectations and science/engineering practices.",
		"Build Zoom-first routines using notebooks, drawings, observations, media, and simulations."
	],
	topics: [
		"Asking questions, observations, patterns, cause/effect, systems, structure/function, weather, organisms, forces, light/sound, Earth materials, and engineering design.",
		"Early graphing and notebook habits."
	],
	moduleAdditions: [
		"Science notebook and observation habits.",
		"Patterns in nature and data.",
		"Forces and motion with diagrams.",
		"Light, sound, and signals.",
		"Weather and seasons.",
		"Living things and habitats.",
		"Engineering design with paper prototypes."
	],
	projectTypes: [
		"Draw-and-label observation notebook.",
		"Sort or classify image cards.",
		"Weather graph from provided data.",
		"Paper bridge or tower design with optional physical build.",
		"Animal habitat model with drawing and explanation."
	],
	assessments: [
		"Use vocabulary drawing checks.",
		"Explain observation vs inference.",
		"Write CER-lite sentence frames.",
		"Read simple data patterns.",
		"Reflect on plan, test, and improve."
	],
	materials: [
		"NGSS elementary performance map.",
		"Image, video, and data bank.",
		"Zoom science notebook template."
	],
	safety: "Require only notes, paper, shared screen materials, and optional simple sketches. No physical supplies beyond paper should be required."
};

const middleScienceProfile: ResearchExpansionProfile = {
	family: "Middle School Science",
	priority: "urgent",
	sources: ["NGSS Appendices", "PhET"],
	gaps: [
		"Build an integrated NGSS middle-school sequence across physical, life, Earth/space, and engineering strands.",
		"Add data interpretation, graphing, modeling, and CER writing to every unit.",
		"Keep labs remote-first and simulation/data/media based."
	],
	topics: [
		"Matter, forces, energy, waves, cells, body systems, ecosystems, heredity, evolution, Earth systems, weather/climate, astronomy, human impact, and engineering design.",
		"Crosscutting concepts: systems, scale, cause/effect, energy/matter, structure/function, and stability/change."
	],
	moduleAdditions: [
		"Scientific modeling and CER.",
		"Matter and interactions.",
		"Forces, motion, and energy.",
		"Waves and information.",
		"Cells to ecosystems.",
		"Earth systems and climate data.",
		"Space systems.",
		"Engineering design challenge."
	],
	projectTypes: [
		"Simulation lab with graph and CER response.",
		"Ecosystem food-web model.",
		"Climate or weather data analysis.",
		"Moon phases or seasons model.",
		"Engineering tradeoff design using provided constraints."
	],
	assessments: [
		"Read graphs.",
		"Critique a model by naming what it shows and hides.",
		"Use a CER rubric.",
		"Check vocabulary in context.",
		"Explain a unit phenomenon."
	],
	materials: [
		"NGSS middle-school strand map.",
		"Simulation and public-data catalog.",
		"CER and model-critique rubrics."
	],
	safety: "No beakers, kits, or required household experiments. Use simulations, data, diagrams, and provided media."
};

const physicsProfile: ResearchExpansionProfile = {
	family: "Physics",
	priority: "urgent",
	sources: ["NGSS Appendices", "PhET"],
	gaps: [
		"Align Intro Physics and Physics Level 2 into a conceptual-to-quantitative progression.",
		"Use simulations and provided datasets instead of required physical measurements.",
		"Add graph interpretation, units, vectors, and algebra scaffolding."
	],
	topics: [
		"Kinematics, forces, energy, momentum, circular motion, waves, electricity, circuits, magnetism intro, optics, and modern physics intro.",
		"Physics Level 2 vectors, quantitative modeling, uncertainty, and multi-step reasoning."
	],
	moduleAdditions: [
		"Measurement, units, graphing, and models.",
		"Motion and forces.",
		"Energy and momentum.",
		"Waves and sound.",
		"Electricity and circuits.",
		"Fields and forces.",
		"Quantitative physics studio with simulation data."
	],
	projectTypes: [
		"Motion graph analysis from provided data.",
		"Free-body diagram portfolio.",
		"Energy skate park simulation report.",
		"Circuit simulation challenge.",
		"Wave interference simulation.",
		"Safety-feature design using energy and momentum."
	],
	assessments: [
		"Quiz units and proportional reasoning.",
		"Check free-body diagrams.",
		"Interpret graph slope and area.",
		"Write CER explanations from simulation evidence.",
		"Solve multi-step problems with written reasoning."
	],
	materials: [
		"PhET physics simulations.",
		"Provided motion and circuit datasets.",
		"Graphing and free-body diagram templates."
	],
	safety: "Use simulations and provided data. Do not require home measurements, electrical components, or physical lab equipment."
};

const swiftProfile: ResearchExpansionProfile = {
	family: "Swift",
	priority: "soon",
	sources: ["Apple App Dev Training"],
	gaps: [
		"Pin current Xcode, Swift, and SwiftUI assumptions.",
		"Decide whether the course requires Apple Developer account features or remains simulator/local only.",
		"Expand app architecture beyond isolated screens."
	],
	topics: [
		"Swift fundamentals, optionals, structs/classes, protocols, SwiftUI state, navigation, lists, forms, persistence, async networking, accessibility, lifecycle, previews, and testing."
	],
	moduleAdditions: [
		"Swift language foundations.",
		"SwiftUI layout and state.",
		"Navigation and data flow.",
		"Persistence and local data.",
		"Networking and async tasks.",
		"Accessibility and polish.",
		"Capstone app architecture."
	],
	projectTypes: [
		"Habit tracker.",
		"Flashcard app.",
		"Weather or API reader with mock fallback.",
		"Notes app with persistence.",
		"Multi-screen personal dashboard."
	],
	assessments: [
		"Explain State, Binding, and model data flow.",
		"Run UI behavior checks.",
		"Complete accessibility checklist.",
		"Demo in simulator with code review."
	],
	materials: [
		"Xcode and simulator setup guide.",
		"SwiftUI project template.",
		"Mock data and accessibility checklist."
	]
};

const unityProfile: ResearchExpansionProfile = {
	family: "Unity",
	priority: "urgent",
	sources: ["Unity Learn", "Unity Manual"],
	gaps: [
		"Rebuild around a current Unity workflow and clear beginner game-development progression.",
		"Add enough modules and projects for a complete course rather than a short sampler.",
		"Specify asset pipeline, licensing, editor setup, and C# scripting expectations."
	],
	topics: [
		"Scenes, GameObjects, components, prefabs, input, physics, collision, UI, audio, animation, cameras, tilemaps, level design, build settings, debugging, and playtesting.",
		"C# basics as used in Unity."
	],
	moduleAdditions: [
		"Unity editor and scene basics.",
		"C# scripts and components.",
		"Input, movement, and camera.",
		"Physics and collision.",
		"UI, score, health, and game state.",
		"Prefabs, spawning, and level design.",
		"Audio, animation, and polish.",
		"Capstone production cycle."
	],
	projectTypes: [
		"Roll-a-ball style collection game.",
		"2D platformer prototype.",
		"Top-down survival or arena prototype.",
		"Puzzle room with triggers.",
		"Menu-driven arcade game.",
		"Capstone with design doc, playtest, and revision."
	],
	assessments: [
		"Explain scene hierarchy.",
		"Check component and prefab usage.",
		"Maintain a playtest bug log.",
		"Use a build rubric for controls, goals, feedback, state, polish, and code organization."
	],
	materials: [
		"Unity version and template decision.",
		"Starter scenes and licensed assets.",
		"Playtest and build rubric."
	]
};

const linuxProfile: ResearchExpansionProfile = {
	family: "Linux",
	priority: "soon",
	sources: ["systemd Documentation"],
	gaps: [
		"Define target environment: VM, container, WSL, remote VPS, or local terminal compatibility.",
		"Add system-administration outcomes, not just command lists.",
		"Include safety around permissions, destructive commands, and network-exposed services."
	],
	topics: [
		"Filesystem hierarchy, permissions, shell scripting, processes, packages, logs, systemd services, users/groups, SSH, cron/timers, networking tools, storage, backups, and web service deployment."
	],
	moduleAdditions: [
		"Terminal and filesystem fundamentals.",
		"Permissions, users, and processes.",
		"Shell scripting and automation.",
		"Package management and services.",
		"Logs, monitoring, and troubleshooting.",
		"SSH and remote administration.",
		"Backups and recovery."
	],
	projectTypes: [
		"Personal shell toolkit.",
		"Log parser or report script.",
		"systemd service for a toy app.",
		"Secure SSH setup in a lab VM.",
		"Backup-and-restore simulation."
	],
	assessments: [
		"Explain command effect before running it.",
		"Troubleshoot a broken service.",
		"Complete permissions quiz.",
		"Review scripts for safety and idempotence."
	],
	materials: [
		"Lab VM or container setup guide.",
		"Safe command checklist.",
		"Broken-service troubleshooting fixtures."
	],
	safety: "Do not run destructive commands against the student's host machine. Use lab directories, VMs, containers, or read-only examples."
};

const networkingProfile: ResearchExpansionProfile = {
	family: "Networking",
	priority: "soon",
	sources: ["RFC 9110 HTTP Semantics", "RFC 8446 TLS 1.3"],
	gaps: [
		"Build a practical network systems path covering concepts, diagnostics, and safe labs.",
		"Include IPv6, DNS, HTTP/TLS, routing basics, and packet inspection.",
		"Avoid requiring students to alter their home network."
	],
	topics: [
		"OSI/TCP-IP models, IP addressing, subnetting, DNS, DHCP, routing, NAT, TCP/UDP, HTTP, TLS, packet capture, firewalls, latency, bandwidth, and troubleshooting."
	],
	moduleAdditions: [
		"Packets, addresses, and ports.",
		"DNS and name resolution.",
		"HTTP and client/server basics.",
		"TLS and secure transport.",
		"Routing, NAT, and firewalls.",
		"Packet capture and troubleshooting."
	],
	projectTypes: [
		"DNS lookup explorer.",
		"HTTP request inspector.",
		"Local client/server toy protocol.",
		"Packet capture lab using safe local traffic.",
		"Network troubleshooting case study."
	],
	assessments: [
		"Read a packet capture and identify layers.",
		"Explain DNS resolution path.",
		"Complete subnetting or addressing checks.",
		"Answer HTTP status and header questions.",
		"Build a troubleshooting flowchart."
	],
	materials: [
		"Local-only capture fixtures.",
		"HTTP and DNS command examples.",
		"Troubleshooting case studies."
	],
	safety: "Use local traffic, owned domains, or provided captures. Do not require router changes, port scans of third-party hosts, or home-network reconfiguration."
};

const securityProfile: ResearchExpansionProfile = {
	family: "Security",
	priority: "soon",
	sources: ["OWASP Web Security Testing Guide", "NIST AI RMF"],
	gaps: [
		"Define strict ethical and legal boundaries across network, low-level, and systems security.",
		"Emphasize defense, detection, secure design, and remediation.",
		"Use toy applications and local labs only."
	],
	topics: [
		"Threat modeling, authentication, authorization, sessions, input validation, logging, incident response basics, vulnerability classes, secure coding, secrets management, dependency risk, and responsible disclosure.",
		"Low-level sanitizers, memory-safety concepts, mitigation awareness, and patch-first exercises."
	],
	moduleAdditions: [
		"Security mindset and lab rules.",
		"Threat modeling and risk.",
		"Web/API security basics.",
		"Defensive logging and monitoring.",
		"Secure coding and validation.",
		"Memory safety and safe parsing.",
		"Vulnerability remediation capstone."
	],
	projectTypes: [
		"Threat model for a toy app.",
		"Harden a vulnerable login flow.",
		"Fix injection or XSS-style bugs in a local toy app.",
		"Add secure logging and rate limiting.",
		"Patch memory-safety bugs found by sanitizer or fuzzer in toy code."
	],
	assessments: [
		"Write a threat model.",
		"Produce before/after vulnerability report.",
		"Review patches with test cases.",
		"Explain authorization, scope, impact, and disclosure."
	],
	materials: [
		"Local toy apps and intentionally vulnerable fixtures.",
		"Threat-model worksheet.",
		"Remediation report template."
	],
	safety: "All exercises must run against owned local fixtures or intentionally vulnerable examples. Finish with remediation, detection, or hardening."
};

const rustProfile: ResearchExpansionProfile = {
	family: "Rust",
	priority: "soon",
	sources: ["Rust Book"],
	gaps: [
		"Position Rust as a systems/security complement to C/C++, not just another syntax course.",
		"Expand ownership and borrowing with practical projects and explicit mental models.",
		"Keep unsafe Rust optional and carefully bounded."
	],
	topics: [
		"Ownership, borrowing, lifetimes intro, enums, pattern matching, traits, generics, error handling, iterators, modules/crates, testing, async intro, FFI boundaries, and safe parsing."
	],
	moduleAdditions: [
		"Ownership and borrowing through diagrams.",
		"Enums, pattern matching, and error handling.",
		"Traits and generic design.",
		"Cargo, crates, modules, and tests.",
		"Safe parsers and CLI tools.",
		"Concurrency or async intro.",
		"Unsafe boundaries as reading-only or tightly controlled advanced material."
	],
	projectTypes: [
		"CLI text utility.",
		"Config parser with robust errors.",
		"Log analyzer.",
		"Concurrent downloader simulation with mocks.",
		"Safe binary parser for a toy format."
	],
	assessments: [
		"Explain borrow-checker errors.",
		"Refactor clone-heavy code into borrowed code.",
		"Write parser tests.",
		"Explain when Result, Option, enum, trait, and struct are appropriate."
	],
	materials: [
		"Cargo project template.",
		"Borrowing diagram worksheets.",
		"Parser fixtures and expected error cases."
	],
	safety: "Unsafe and FFI content should be optional, reading-heavy, and constrained to toy examples with explicit trusted boundaries."
};

const javaScriptProfile: ResearchExpansionProfile = {
	family: "JavaScript",
	priority: "later",
	sources: ["MDN JavaScript Guide"],
	gaps: [
		"Align JavaScript Levels 1-2 with modern browser JavaScript and the Web Development Foundations path.",
		"Avoid duplicating backend/database content unless clearly scoped.",
		"Add browser debugging and asynchronous programming earlier."
	],
	topics: [
		"DOM, events, modules, fetch, promises, async/await, arrays, objects, localStorage, canvas, accessibility basics, browser devtools, and security basics.",
		"Modern syntax: let/const, arrows, template literals, destructuring, and classes where useful."
	],
	moduleAdditions: [
		"Browser execution model and devtools.",
		"DOM and event-driven pages.",
		"Data from APIs and async code.",
		"Canvas and game loop.",
		"Local storage and state.",
		"Small app architecture."
	],
	projectTypes: [
		"Interactive quiz app.",
		"API-backed dashboard with mock fallback.",
		"Canvas arcade mini-game.",
		"To-do app with localStorage.",
		"Accessibility fix-it project."
	],
	assessments: [
		"Explain event flow.",
		"Debug DOM selector and event bugs.",
		"Trace async code.",
		"Check functionality, accessibility, responsiveness, and console errors."
	],
	materials: [
		"Browser devtools checklist.",
		"Mock API fixtures.",
		"Accessibility and responsive-design rubric."
	]
};

const webProfile: ResearchExpansionProfile = {
	family: "Web Development",
	priority: "soon",
	sources: ["MDN JavaScript Guide", "OWASP Web Security Testing Guide"],
	gaps: [
		"Build a full-stack path connecting HTML/CSS/JS, backend APIs, databases, auth basics, deployment, and security.",
		"Define relationship to JavaScript courses.",
		"Add accessibility, performance, and security from the beginning."
	],
	topics: [
		"Semantic HTML, CSS layout, responsive design, forms, fetch/API integration, routes, databases, auth/session concepts, validation, deployment, environment variables, observability, accessibility, performance, and secure coding."
	],
	moduleAdditions: [
		"Semantic HTML and accessible UI.",
		"CSS layout and responsive design.",
		"Client-side JS and API calls.",
		"Backend routes and validation.",
		"Databases and persistence.",
		"Auth/session basics.",
		"Deployment and operational checks.",
		"Web security fundamentals."
	],
	projectTypes: [
		"Personal site with accessibility checklist.",
		"Form-backed contact or survey app.",
		"CRUD app with database.",
		"Authenticated course dashboard.",
		"Deployed full-stack capstone with README and test plan."
	],
	assessments: [
		"Run accessibility and performance checks.",
		"Write API contract tests.",
		"Complete forms, auth, and secrets security checklist.",
		"Verify deployment from a fresh browser session.",
		"Review separation of concerns."
	],
	materials: [
		"Project templates for static, API, and full-stack apps.",
		"Accessibility and security rubrics.",
		"Deployment verification checklist."
	]
};

const machineLearningProfile: ResearchExpansionProfile = {
	family: "Machine Learning",
	priority: "soon",
	sources: [
		"scikit-learn Model Evaluation",
		"NIST AI RMF",
		"pandas Documentation"
	],
	gaps: [
		"Separate ML from AI and Data Science while requiring data literacy before model training.",
		"Make responsible ML, evaluation, leakage, validation, and limitations core topics.",
		"Choose a current toolchain and stable datasets."
	],
	topics: [
		"Train/test split, cross-validation, classification, regression, metrics, overfitting, underfitting, feature engineering, pipelines, baselines, confusion matrices, ROC/PR tradeoffs, unsupervised learning, model cards, and bias/fairness basics.",
		"Deep learning should remain optional or later unless the course explicitly targets it."
	],
	moduleAdditions: [
		"ML workflow and problem framing.",
		"Data prep and leakage prevention.",
		"Classification and regression.",
		"Model evaluation and metrics.",
		"Baselines and validation.",
		"Unsupervised learning.",
		"Responsible ML and model communication.",
		"Capstone model report."
	],
	projectTypes: [
		"Classification with confusion-matrix analysis.",
		"Regression with residual/error analysis.",
		"Clustering exploration with limitations.",
		"Compare baseline vs trained model.",
		"Model card for a self-built classifier.",
		"Reproducible notebook capstone."
	],
	assessments: [
		"Identify target, features, leakage risk, and evaluation metric.",
		"Interpret metrics.",
		"Run reproducibility checks.",
		"Write limitation and ethics reflections.",
		"Use NIST AI RMF language for risk."
	],
	materials: [
		"Stable dataset catalog.",
		"Notebook and pipeline template.",
		"Model card and evaluation rubric."
	]
};

export const researchBackedExpansionProfiles: Record<
	string,
	ResearchExpansionProfile
> = {
	"ai-level-1": aiProfile,
	"algebra-1a": algebraProfile("Algebra 1A", [
		"Linear equations, slope, inequalities, systems, and linear modeling."
	]),
	"algebra-1b": algebraProfile("Algebra 1B", [
		"Polynomials, quadratics, functions, variation, and data modeling."
	]),
	"algebra-2a": algebraProfile("Algebra 2A", [
		"Complex numbers, quadratics, polynomial division, rational functions, radical functions, and piecewise functions."
	]),
	"algebra-2b": algebraProfile("Algebra 2B", [
		"Logarithms, sequences, matrices, probability, statistics, and trigonometric foundations."
	]),
	"ap-computer-science-a": apCsaProfile,
	assembly: assemblyProfile,
	"c-level-1": cppProfile,
	"c-systems-engineering": cSystemsProfile,
	"cpp-level-2": cppProfile,
	"cpp-level-3": cppProfile,
	"data-science-in-python": dataScienceProfile,
	"data-structures-and-algorithms-in-cpp": dsaProfile,
	"design-patterns-in-cpp": designPatternsProfile,
	"design-patterns-in-java": designPatternsProfile,
	"design-patterns-in-java-part-2": designPatternsProfile,
	"elementary-science": elementaryScienceProfile,
	"intro-to-chemistry": chemistryProfile,
	"intro-to-physics": physicsProfile,
	"intro-to-swift-app-development": swiftProfile,
	"java-level-1": javaProfile,
	"java-level-2": javaProfile,
	"java-level-3": javaProfile,
	"java-with-graphics": javaProfile,
	"java-without-graphics": javaProfile,
	"javascript-level-1-javascript-superstar": javaScriptProfile,
	"javascript-level-2-javascript-master": javaScriptProfile,
	"linux-systems": linuxProfile,
	"low-level-security": securityProfile,
	"low-level-security-part-2": securityProfile,
	"machine-learning": machineLearningProfile,
	"middle-school-integrated-science": middleScienceProfile,
	"network-security": securityProfile,
	"network-systems": networkingProfile,
	"physics-level-2": physicsProfile,
	pygames: pyGameProfile,
	"python-level-1": pythonProfile,
	"python-level-2": pythonProfile,
	"python-level-3": pythonProfile,
	"pythonic-design-patterns": designPatternsProfile,
	"rust-systems-security": rustProfile,
	"scratch-level-1": scratchProfile,
	"scratch-level-2": scratchProfile,
	"unity-game-development": unityProfile,
	"usaco-bronze": usacoProfile,
	"usaco-gold": usacoProfile,
	"usaco-silver": usacoProfile,
	"web-development-foundations": webProfile
};

const authoredLearnerExpansionCourseIds = new Set(["intro-to-chemistry"]);

export const researchBackedExpansionCourseIds = Object.keys(
	researchBackedExpansionProfiles
).filter(courseId => !authoredLearnerExpansionCourseIds.has(courseId));

export function applyResearchBackedExpansions(
	courseId: string,
	course: RawCourse
) {
	if (authoredLearnerExpansionCourseIds.has(courseId)) return;

	const profile = researchBackedExpansionProfiles[courseId];

	if (!profile) return;

	const label = courseExpansionLabel(course, profile);
	const alreadyExpanded = course.modules.some(
		module =>
			module.title === `${label}: Standards and Course Map` ||
			module.title.startsWith(
				`${profile.family}: Standards and Scope Expansion`
			)
	);

	if (alreadyExpanded) return;

	course.modules.push(...buildExpansionModules(profile, label));
}
