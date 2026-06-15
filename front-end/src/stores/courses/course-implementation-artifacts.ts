import type {
	CourseDevelopmentMetadata,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "./types";
import { researchBackedExpansionProfiles } from "./research-expansions";

const INSTRUCTION_MATERIAL_URL = "https://github.com/instruction-material";

function stableVariantIndex(seed: string, count: number) {
	let hash = 2166136261;

	for (const character of seed) {
		hash ^= character.charCodeAt(0);
		hash = Math.imul(hash, 16777619) >>> 0;
	}

	return hash % count;
}

export const courseImplementationSourceRepos: Record<string, string> = {
	"ai-level-1": "AI-Level-1",
	"ap-computer-science-a": "APCS",
	assembly: "Assembly",
	"c-level-1": "CPP-Level-1",
	"c-systems-engineering": "C-Systems-Engineering",
	"cpp-level-2": "CPP-Level-2",
	"cpp-level-3": "CPP-Level-3",
	"data-science-in-python": "Data-Science",
	"data-structures-and-algorithms-in-cpp":
		"Data-Structures-and-Algorithms-in-CPP",
	"design-patterns-in-cpp": "Design-Patterns-in-CPP",
	"java-level-1": "Java-Level-1",
	"java-level-2": "Java-Level-2",
	"java-level-3": "Java-Level-3",
	"linux-systems": "Linux-Systems",
	"low-level-security": "Low-Level-Security",
	"low-level-security-part-2": "Low-Level-Security",
	"machine-learning": "AI-Level-2",
	"network-security": "Network-Security",
	"network-systems": "Network-Systems",
	pygames: "PyGames",
	"python-level-1": "Python-Level-1",
	"python-level-2": "Python-Level-2",
	"python-level-3": "Python-Level-3",
	"python-to-java-and-cpp-bridge": "Python-to-Java-and-CPP-Bridge",
	"pythonic-design-patterns": "Pythonic-Design-Patterns",
	"rust-systems-security": "Low-Level-Security",
	"intro-to-swift-app-development": "Swift",
	"unity-game-development": "Unity-Game-Development",
	"usaco-bronze": "USACO-Bronze",
	"usaco-gold": "USACO-Gold",
	"usaco-silver": "USACO-Silver",
	"web-development-foundations": "Web-Development-Foundations"
};

export const courseContentOnlySourcePolicies: Record<string, string> = {
	"algebra-1a":
		"Content-only math course. Use course modules plus generated practice, modeling, and error-analysis tasks; worksheets or Desmos links should be added as media assets when created.",
	"algebra-1b":
		"Content-only math course. Use course modules plus generated practice, modeling, and error-analysis tasks; worksheets or Desmos links should be added as media assets when created.",
	"algebra-2a":
		"Content-only math course. Use course modules plus generated practice, modeling, and error-analysis tasks; worksheets or Desmos links should be added as media assets when created.",
	"algebra-2b":
		"Content-only math course. Use course modules plus generated practice, modeling, and error-analysis tasks; worksheets or Desmos links should be added as media assets when created.",
	"design-patterns-in-java":
		"Catalog-owned course. Keep source snippets embedded until a dedicated Java design-patterns repo is created.",
	"design-patterns-in-java-part-2":
		"Catalog-owned course. Keep refactoring scenarios embedded until a before/after Java design-patterns repo is created.",
	"elementary-science":
		"Content and media course. Source parity means every activity has a listed simulation, image/data source, notebook routine, or explicit no-physical-material alternative.",
	"intro-to-chemistry":
		"Content and media course. Source parity means every lab-style activity has a remote simulation/data alternative and no required household chemistry materials.",
	"intro-to-physics":
		"Content and media course. Source parity means every lab-style activity has a simulation, graph dataset, or paper-model alternative.",
	"java-with-graphics":
		"Composed Java track. Source parity is inherited from Java Level 1, Java Level 2, Java Level 3, and the graphics branch notes in the catalog.",
	"java-without-graphics":
		"Composed Java track. Source parity is inherited from Java Level 1, Java Level 2, and Java Level 3.",
	"javascript-level-1-javascript-superstar":
		"Legacy/catalog-owned JavaScript course. Keep project specs in the catalog until a JavaScript source repo is created.",
	"javascript-level-2-javascript-master":
		"Legacy/catalog-owned JavaScript course. Keep project specs in the catalog until a JavaScript source repo is created.",
	"middle-school-integrated-science":
		"Content and media course. Source parity means every activity has a listed simulation, image/data source, notebook routine, or explicit no-physical-material alternative.",
	"physics-level-2":
		"Content and media course. Source parity means every lab-style activity has a simulation, graph dataset, or paper-model alternative.",
	"scratch-level-1":
		"Catalog-owned Scratch course. Scratch studios/projects are external creative artifacts rather than local source folders.",
	"scratch-level-2":
		"Catalog-owned Scratch course. Scratch studios/projects are external creative artifacts rather than local source folders."
};

export const courseToolchainAssumptions: Record<string, string[]> = {
	"ai-level-1": [
		"Python 3.12+ for local scripts and notebooks.",
		"Browser-accessible demos for search/state-space visualizations.",
		"NIST AI RMF language for risk, limitation, and human-oversight reflections."
	],
	assembly: [
		"Document the target architecture and assembler before each lab.",
		"Use debugger or emulator traces instead of relying on undefined host behavior.",
		"Keep compiler-output reading tied to the same ABI/calling convention throughout a module."
	],
	"c-level-1": [
		"C++20-compatible compiler for introductory work unless a project explicitly needs newer features.",
		"Warnings enabled for local builds.",
		"Use a consistent local build/run command before adding IDE-specific instructions."
	],
	"c-systems-engineering": [
		"C17/C23-aware compiler notes where relevant.",
		"AddressSanitizer/UndefinedBehaviorSanitizer or equivalent diagnostics for memory labs.",
		"Cross-platform alternatives for process/file/network labs when macOS/Linux behavior differs."
	],
	"cpp-level-2": [
		"C++20-compatible compiler.",
		"AddressSanitizer or Valgrind-style checks for dynamic memory where available.",
		"Memory diagrams required before pointer-heavy implementation."
	],
	"cpp-level-3": [
		"C++20-compatible compiler with STL containers, iterators, algorithms, smart pointers, and templates.",
		"Unit-test or command-test harness for parser, CLI, and state-machine projects.",
		"No AI/ML tooling in this sequence."
	],
	"data-science-in-python": [
		"Python 3.12+ with pandas, NumPy, matplotlib/Altair, and notebook support.",
		"Stable local CSV fixtures before external datasets.",
		"Recorded package versions for any notebook intended to be reused."
	],
	"data-structures-and-algorithms-in-cpp": [
		"C++20-compatible compiler.",
		"Small deterministic test harnesses for every data structure.",
		"Runtime measurement scripts used only after asymptotic reasoning is written."
	],
	"intro-to-swift-app-development": [
		"Current Xcode and SwiftUI toolchain on macOS.",
		"Simulator-first workflow; paid Apple Developer account is not assumed.",
		"Version notes for any API that changes between Xcode/Swift releases."
	],
	"linux-systems": [
		"Ubuntu/Debian-style VM or container baseline unless a module names another distro.",
		"systemd notes marked as distro-dependent.",
		"Commands must include a recovery or undo path when they change system state."
	],
	"low-level-security": [
		"Local toy binaries, sanitizers, debuggers, and intentionally vulnerable fixtures only.",
		"No third-party targets or unsandboxed exploit chains.",
		"Every lab ends with mitigation or patch evidence."
	],
	"low-level-security-part-2": [
		"Local toy binaries, sanitizers, debuggers, and intentionally vulnerable fixtures only.",
		"Mitigation-aware analysis before advanced exploitation vocabulary.",
		"Every lab ends with mitigation or patch evidence."
	],
	"machine-learning": [
		"Python 3.12+ with scikit-learn as the baseline ML library.",
		"TensorFlow/Keras or deep learning only as optional later extension material.",
		"Model evaluation, train/test split, baseline comparison, and model card required for reusable projects."
	],
	"network-security": [
		"Local toy services, packet captures, and owned lab hosts only.",
		"OWASP/WSTG-style evidence format for web/API security work.",
		"No scanning or probing outside explicitly authorized lab targets."
	],
	"network-systems": [
		"Local VM/container or home-lab-safe diagnostics only.",
		"IPv4, IPv6, DNS, routing, firewall, and packet-capture commands must include rollback notes.",
		"Packet captures should use provided or owned traffic."
	],
	"rust-systems-security": [
		"Current stable Rust toolchain and Cargo.",
		"Unsafe Rust only inside explicitly scoped labs.",
		"Clippy/tests encouraged before comparing Rust and C/C++ safety properties."
	],
	"unity-game-development": [
		"Unity 6.3 LTS through Unity Hub.",
		"C# scripting with project README noting editor version.",
		"Local play-mode/build checks before capstone publication."
	],
	"web-development-foundations": [
		"Node 22+ or the version pinned by the project scaffold.",
		"Browser checks at mobile and desktop widths.",
		"Deployment assumptions recorded before introducing hosting-specific behavior."
	]
};

const dataCatalogs: Record<string, string[]> = {
	"ai-level-1": [
		"Grid and graph fixtures for DFS, BFS, A*, and state-space tracing.",
		"Small game-tree boards for minimax and finite-state behavior testing.",
		"Responsible-AI reflection cards using stakeholder, harm, mitigation, and uncertainty prompts."
	],
	"data-science-in-python": [
		"NOAA daily weather observations for cleaning, trend, and visualization practice.",
		"UCI or Kaggle-style tabular datasets with stable mirrors and explicit licensing notes.",
		"Provided messy CSV fixtures with missing values, duplicate rows, type mismatches, and categorical cleanup."
	],
	"machine-learning": [
		"scikit-learn built-in datasets for first-pass classification and regression.",
		"Small public tabular datasets with target, features, leakage notes, and baseline model expectations.",
		"Model-card template requiring intended use, limitations, evaluation metric, and risk notes."
	]
};

const scienceResourceLinks: Record<
	string,
	{ mediaLink: string; datasetLink: string }
> = {
	"elementary-science": {
		mediaLink:
			"https://phet.colorado.edu/en/simulations/filter?subjects=elementary-school",
		datasetLink:
			"https://www.noaa.gov/education/resource-collections/weather-atmosphere"
	},
	"middle-school-integrated-science": {
		mediaLink:
			"https://phet.colorado.edu/en/simulations/filter?subjects=middle-school",
		datasetLink: "https://www.biointeractive.org/classroom-resources"
	},
	"intro-to-chemistry": {
		mediaLink:
			"https://phet.colorado.edu/en/simulations/filter?subjects=chemistry",
		datasetLink: "https://pubchem.ncbi.nlm.nih.gov/"
	},
	"intro-to-physics": {
		mediaLink:
			"https://phet.colorado.edu/en/simulations/filter?subjects=physics",
		datasetLink: "https://www.nasa.gov/stem-content/"
	},
	"physics-level-2": {
		mediaLink:
			"https://phet.colorado.edu/en/simulations/filter?subjects=physics",
		datasetLink: "https://www.nist.gov/pml/weights-and-measures/si-units"
	}
};

const scienceResourceBanks: Record<string, string[]> = {
	"elementary-science": [
		"NGSS elementary performance expectations and appendices for grade-band scope.",
		"PhET elementary-friendly simulations for forces, matter, sound, light, and simple systems.",
		"NASA, NOAA, and USGS images or maps for weather, Earth materials, space, and environmental observations.",
		"provided image cards and data tables for sorting, graphing, and CER-lite responses."
	],
	"middle-school-integrated-science": [
		"NGSS middle-school physical, life, Earth/space, and engineering standards.",
		"PhET simulations for matter, forces, energy, waves, electricity, and climate-related models.",
		"NASA, NOAA, USGS, and HHMI BioInteractive public media/data for Earth systems, ecosystems, heredity, and human impact.",
		"CER rubric, model-critique rubric, graph-reading checks, and phenomenon explanation prompts."
	],
	"intro-to-chemistry": [
		"ACS chemistry teaching guidelines and safety language.",
		"PhET Build an Atom, Molecule Shapes, Reactants Products and Leftovers, pH Scale, and Concentration-style simulations.",
		"Periodic table and reaction datasets supplied by provided materials rather than gathered from household chemicals.",
		"Particle diagrams, balancing cards, stoichiometry tables, and CER templates."
	],
	"intro-to-physics": [
		"NGSS physical science expectations and PhET motion, force, energy, wave, and circuit simulations.",
		"Provided motion/circuit datasets for graphing slope, area, proportionality, and uncertainty.",
		"Free-body diagram templates, graph interpretation checks, and simulation CER prompts."
	],
	"physics-level-2": [
		"Algebra-based physics references for vectors, quantitative modeling, and multi-step reasoning.",
		"PhET and provided datasets for projectile motion, energy, momentum, circuits, waves, and fields.",
		"Graphing, uncertainty, free-body diagram, and engineering-design rubrics."
	]
};

const authoredLearnerCourseIds = new Set(["intro-to-chemistry"]);

const apCsaUnitMap = [
	"Unit 1 Using Objects and Methods: primitive values, objects, String, Math, method calls, wrapper parsing, input/output, and API reading.",
	"Unit 2 Selection and Iteration: boolean logic, conditionals, loops, nested loops, tracing, debugging, and method/control-structure FRQ practice.",
	"Unit 3 Class Creation: instance variables, constructors, encapsulation, method contracts, class design, object state, and full-class FRQ practice.",
	"Unit 4 Data Collections: arrays, ArrayList, 2D arrays, datasets/text files, data ethics, recursion, searching, sorting, and data-analysis FRQ practice.",
	"FRQ Family 1 Methods and Control Structures: loop/conditional logic, helper calls, return values, and edge cases.",
	"FRQ Family 2 Class Design: complete class writing with private state, constructors, methods, and behavior contracts.",
	"FRQ Family 3 Data Analysis with ArrayList: object-list traversal, filtering, aggregation, mutation, and summary statistics.",
	"FRQ Family 4 2D Array: row/column traversal, boundary checks, nested loops, and grid reasoning.",
	"Digital exam routine: typed responses without compiler feedback, indentation discipline, row-scored review, and error-log remediation."
];

const cppConceptMatrix = [
	"Original Level 1 baseline: variables, I/O, loops, functions, classes, vectors, references, 2D vectors, and state-machine project work.",
	"Level 2 bridge: pointers, addresses, raw arrays, pointer arithmetic, 2D arrays, dynamic memory, custom dynamic arrays, matrix classes, and ownership reflection.",
	"Level 3 CS235/CS236-inspired expansion: command architecture, file persistence, scanners/parsers, recursion, STL containers, relation-style views, RAII, templates, interfaces, and state-machine architecture.",
	"DS&A follow-up boundary: linked structures, trees, heaps, hashing, graph algorithms, dynamic programming, and complexity-first implementation.",
	"Explicit exclusion: AI and ML concepts stay in AI/Data Science/Machine Learning courses rather than the C++ pathway."
];

function systemsSecurityPolicy() {
	return [
		"Labs use owned local fixtures, intentionally vulnerable toy apps, provided packet captures, or approved lab VMs.",
		"Lab records include scope, authorization, target, allowed tools, and stop conditions.",
		"Findings are written as evidence plus impact, followed by defensive remediation, detection, or hardening.",
		"Work never scans, probes, exploits, or collects data from third-party systems.",
		"Low-level exercises use sanitizers, fuzzers, and toy parsers to teach memory risk without weaponized targets."
	];
}

const familyAssessmentCadence: Record<string, string[]> = {
	algebra: [
		"Diagnostic launch for prerequisite arithmetic, graph reading, and notation.",
		"Low-stakes check-in after every three to five lessons.",
		"Weekly retrieval spiral plus mixed practice from older skills.",
		"One required anchor modeling project and one optional extension per course."
	],
	ap: [
		"Daily or near-daily MCQ/code-trace warmup.",
		"Weekly partial FRQ typed without compiler support.",
		"Biweekly full FRQ rotating through the four current FRQ families.",
		"Monthly mixed digital practice set with row-scored review."
	],
	programming: [
		"Short code-tracing, debugging, or design check every module.",
		"At least one source-backed project milestone per major concept cluster.",
		"Project review includes normal case, edge case, and written explanation.",
		"Capstone or transfer task requires tests, run instructions, and reflection."
	],
	science: [
		"Notebook check every lesson: question, observation, model or graph, claim, evidence, reasoning.",
		"One CER or model-revision task per phenomenon sequence.",
		"Data, simulation, or curated-media evidence instead of required physical labs.",
		"Performance task at the end of each grade-band or unit cluster."
	],
	"data-ai-ml": [
		"Notebook or artifact check every module.",
		"Dataset/source card before analysis or modeling.",
		"Evaluation report for every AI/ML/data artifact.",
		"Final deliverable must include limitations and responsible-use reflection."
	],
	systems: [
		"Scope and rollback check before every lab.",
		"Troubleshooting or trace review every module.",
		"Evidence-plus-remediation report for security or low-level findings.",
		"Final project includes reproducibility notes, logs, and defensive outcome."
	],
	game: [
		"Weekly playable milestone or scene smoke test.",
		"Playtest log with bug, reproduction step, fix, and retest.",
		"Build/profile/test checkpoint before final capstone.",
		"Final demo includes architecture, state flow, and asset attribution."
	]
};

const courseFamilyKind: Record<string, keyof typeof familyAssessmentCadence> = {
	"algebra-1a": "algebra",
	"algebra-1b": "algebra",
	"algebra-2a": "algebra",
	"algebra-2b": "algebra",
	"ap-computer-science-a": "ap",
	"ai-level-1": "data-ai-ml",
	"data-science-in-python": "data-ai-ml",
	"machine-learning": "data-ai-ml",
	"elementary-science": "science",
	"middle-school-integrated-science": "science",
	"intro-to-chemistry": "science",
	"intro-to-physics": "science",
	"physics-level-2": "science",
	"linux-systems": "systems",
	"network-systems": "systems",
	"network-security": "systems",
	"c-systems-engineering": "systems",
	assembly: "systems",
	"low-level-security": "systems",
	"low-level-security-part-2": "systems",
	"rust-systems-security": "systems",
	"unity-game-development": "game"
};

const standardsOverrides: Record<string, string[]> = {
	"ap-computer-science-a": [
		"College Board AP Computer Science A CED, Fall 2025 / May 2026 framework.",
		"College Board Java Quick Reference and AP CSA digital exam family descriptions."
	],
	"algebra-1a": [
		"Common Core High School Algebra: Seeing Structure, Creating Equations, Reasoning with Equations and Inequalities, and Modeling."
	],
	"algebra-1b": [
		"Common Core High School Functions, Algebra, Statistics, and Modeling standards."
	],
	"algebra-2a": [
		"Common Core High School Functions, Number and Quantity, Algebra, and Modeling standards."
	],
	"algebra-2b": [
		"Common Core High School Algebra, Functions, Statistics and Probability, Trigonometric Functions, and Modeling standards."
	],
	"elementary-science": [
		"NGSS K-2 and 3-5 grade-band progressions.",
		"NGSS Science and Engineering Practices: observations, models, data, explanation, and engineering design."
	],
	"middle-school-integrated-science": [
		"NGSS 6-8 integrated physical, life, Earth/space, and engineering performance expectations.",
		"NGSS practices for modeling, data analysis, argument from evidence, and design."
	],
	"intro-to-chemistry": [
		"NGSS physical science performance expectations for matter, reactions, energy, and models.",
		"ACS chemistry teaching and safety guidance for school settings."
	],
	"intro-to-physics": [
		"NGSS physical science performance expectations for motion, forces, energy, waves, and circuits."
	],
	"physics-level-2": [
		"Algebra-based physics modeling, graphing, uncertainty, and NGSS physical science practices."
	],
	"unity-game-development": [
		"Unity Manual, Unity Learn, Unity Test Framework, Build Profiles, Input System, and Git LFS documentation."
	]
};

const boundaryOverrides: Record<string, string[]> = {
	"data-science-in-python": [
		"Owns messy data, cleaning, exploratory analysis, visualization, reproducibility, and stakeholder communication.",
		"Does not use final projects as ML accuracy competitions."
	],
	"ai-level-1": [
		"Owns explicit reasoning: states, search, heuristics, CSPs, rules, planning, and game agents.",
		"Does not teach train/validation/test ML pipelines except as a contrast."
	],
	"machine-learning": [
		"Owns learning from examples: baselines, splits, leakage control, model selection, metrics, error analysis, and model cards.",
		"Assumes Data Science cleaning and communication habits rather than reteaching them as the course center."
	],
	"c-level-1": [
		"Builds idiomatic C++ fluency before ownership-heavy design.",
		"Uses raw arrays only as contrast material, not as the default storage model."
	],
	"cpp-level-2": [
		"Owns pointers, dynamic memory, RAII, smart pointers, STL containers, iterators, algorithms, and lifetime discipline.",
		"Prepares students for DS&A and Level 3 without adding AI/ML."
	],
	"cpp-level-3": [
		"Owns templates, operator overloading, abstract interfaces, state machines, command architecture, parsers, and robust file formats.",
		"Excludes AI/ML so those topics remain in Data Science, AI Foundations, and Machine Learning."
	],
	"java-level-1": [
		"Builds Java foundations for students who need the full language ramp.",
		"Accelerated placements can skip repetitive syntax drills after placement evidence."
	],
	"java-level-2": [
		"Owns interfaces, abstract classes, records, collections, exceptions, files, and tests beyond AP-style basics."
	],
	"java-level-3": [
		"Owns modern Java application design, streams, NIO, JUnit, service/plugin architecture, and larger projects."
	],
	"java-without-graphics": [
		"Routes advanced Java students into services, data processing, concurrency, testing, and architecture.",
		"Default pathway for a strong post-C++ student."
	],
	"java-with-graphics": [
		"Routes motivated students into JavaFX/event-driven projects after shared Java core.",
		"Graphics is an application branch, not a substitute for modern Java core."
	],
	"unity-game-development": [
		"Uses full Unity project workflow rather than script-only snapshots.",
		"Targets small, shippable, portfolio-friendly 2D vertical slices."
	]
};

const capstoneOverrides: Record<string, string[]> = {
	"python-level-3": [
		"File-backed algorithmic program with tests, runtime evidence, and a short design report.",
		"Recommended defaults: local document search, external sort pipeline, puzzle solver suite, route planner, or simplified compressor."
	],
	"java-level-3": [
		"Modern Java application with records/classes, collections or streams, file/API boundary, JUnit tests, and architecture review."
	],
	"java-without-graphics": [
		"REST-like service, plugin-based processing pipeline, filesystem indexer, or concurrent crawler/downloader with tests."
	],
	"java-with-graphics": [
		"JavaFX dashboard, simulation viewer, turn-based board game, or graph/pathfinding visualizer with model-view separation."
	],
	"unity-game-development": [
		"Small Unity 2D vertical slice with title/play/fail-or-win/restart flow, tests or smoke checks, build profile, and asset attribution."
	]
};

const nextWorkByKind: Record<keyof typeof familyAssessmentCadence, string[]> = {
	algebra: [
		"Attach per-item standards tags when the course schema supports item-level metadata.",
		"Create worksheet or Desmos asset packs for anchor projects.",
		"Add answer keys for error-analysis and mixed-practice checkpoints."
	],
	ap: [
		"Create current-family FRQ banks with row-scored rubrics.",
		"Add Bluebook-style typed practice routines and no-compiler prompts.",
		"Map every project to one current AP CSA unit, practice, and FRQ/MCQ pattern."
	],
	programming: [
		"Update source repos with starter and reference states.",
		"Add automated or documented verification for each reusable project.",
		"Keep naming and supplemental project structure consistent across repos."
	],
	science: [
		"Write phenomenon bundles with simulation/media/data sources per unit.",
		"Create K-2, 3-5, and 6-8 notebook templates.",
		"Add CER/model-rubric examples for reviewers."
	],
	"data-ai-ml": [
		"Build dataset cards, model cards, and evaluation templates.",
		"Add anti-overlap checks while authoring new projects.",
		"Create reproducible notebook starter packs."
	],
	systems: [
		"Create VM/container setup guides and reset instructions.",
		"Add safe toy targets, packet captures, fuzz fixtures, and sanitizer examples.",
		"Review public wording for defensive scope before release."
	],
	game: [
		"Maintain full Unity starter and review project baselines with tags.",
		"Keep Git LFS, package locks, test framework, build profiles, and attribution files current.",
		"Promote script-snapshot links to full-project links as each module reaches project-repo readiness."
	]
};

function repoUrl(courseId: string) {
	const repo = courseImplementationSourceRepos[courseId];
	return repo ? `${INSTRUCTION_MATERIAL_URL}/${repo}` : undefined;
}

function repoFolderUrl(courseId: string, folder: string) {
	const repo = courseImplementationSourceRepos[courseId];
	return repo
		? `${INSTRUCTION_MATERIAL_URL}/${repo}/tree/main/${folder}`
		: undefined;
}

function bullets(items: string[]) {
	return items.map(item => `- ${item}`).join("\n");
}

function hasModule(course: RawCourse, title: string) {
	return course.modules.some(module => module.title === title);
}

function appendModule(course: RawCourse, module: RawCourseModule) {
	if (!hasModule(course, module.title)) course.modules.push(module);
}

function projectItem(title: string, content: string): RawCourseModuleItem {
	return { title, content };
}

function kindForCourse(courseId: string): keyof typeof familyAssessmentCadence {
	if (courseFamilyKind[courseId]) return courseFamilyKind[courseId];
	if (
		/java|python|scratch|pygames|cpp|c-level|usaco|web|swift|design-patterns/.test(
			courseId
		)
	) {
		return "programming";
	}
	return "programming";
}

function metadataStandards(courseId: string) {
	const profile = profileFor(courseId);
	return [
		...(standardsOverrides[courseId] ?? []),
		...(profile?.sources.map(
			source => `${source} research-backed source map.`
		) ?? [])
	].filter((value, index, values) => values.indexOf(value) === index);
}

function sourcePolicyFor(courseId: string) {
	const url = repoUrl(courseId);
	if (url) {
		return `Source-backed course. Canonical source repository: ${url}. Starter/reference links should remain synchronized with catalog projects.`;
	}

	return (
		courseContentOnlySourcePolicies[courseId] ??
		"Catalog-authored course. Add a source repository, media register, worksheet register, or explicit external-platform policy before large reusable artifacts are introduced."
	);
}

function safetyPolicyFor(
	kind: keyof typeof familyAssessmentCadence,
	courseLabel: string,
	familyLabel: string
) {
	if (kind === "systems") return systemsSecurityPolicy();
	if (kind === "science") {
		return [
			`${courseLabel} is Zoom-safe by default: no required beakers, heat, chemicals, electricity kits, outdoor access, food, or parent-managed supplies.`,
			`${familyLabel} work uses shared simulations, curated media, public datasets, sketches, graphs, and paper notebooks.`,
			`Any optional ${courseLabel} household observation must have a fully equivalent provided-data or simulation alternative.`
		];
	}
	if (kind === "data-ai-ml") {
		return [
			`${courseLabel} uses public, synthetic, or provided datasets only.`,
			`Record ${familyLabel} source, license or usage assumption, sensitive fields, limitations, and intended use before analysis or modeling.`,
			`Require human review and limitation notes for ${courseLabel} AI/ML/data outputs.`
		];
	}
	if (kind === "game") {
		return [
			`${courseLabel} uses only self-created or clearly licensed assets.`,
			`Keep ${familyLabel} projects small enough to build and recover during live sessions.`,
			`Record ${courseLabel} third-party asset provenance before capstone publication.`
		];
	}

	return [
		`${courseLabel} uses local projects, owned accounts, and approved source repositories.`,
		`${courseLabel} does not require credentials, paid services, or destructive machine changes unless explicitly documented.`,
		`Include a rollback, reset, or troubleshooting note for setup-heavy ${familyLabel} work.`
	];
}

function capstoneFor(
	courseId: string,
	kind: keyof typeof familyAssessmentCadence,
	courseLabel: string,
	familyLabel: string
) {
	if (capstoneOverrides[courseId]) return capstoneOverrides[courseId];
	if (kind === "algebra") {
		return [
			`${courseLabel} ends with one anchor modeling project that uses at least two representations.`,
			`${courseLabel} includes one optional extension project for deeper transfer or enrichment.`
		];
	}
	if (kind === "ap") {
		return [
			`${courseLabel} includes a timed digital AP practice set plus a row-scored FRQ family review.`,
			`${courseLabel} uses an error log showing remediation by current AP CSA unit and question family.`
		];
	}
	if (kind === "science") {
		return [
			`${courseLabel} ends with a phenomenon-based notebook portfolio with model revision, graph/data evidence, and CER response.`,
			`${courseLabel} includes a Zoom-safe engineering or explanation task with no required physical lab materials.`
		];
	}
	if (kind === "data-ai-ml") {
		return [
			`${courseLabel} ends with a reproducible notebook or solver/model artifact with source card, evaluation evidence, limitation note, and presentation.`,
			`${courseLabel} final reflection distinguishes data quality, algorithm behavior, and responsible-use risk.`
		];
	}
	if (kind === "systems") {
		return [
			`${courseLabel} ends with a scoped local lab or tool with setup notes, logs/traces, validation evidence, and defensive remediation or hardening result.`,
			`${courseLabel} includes an oral or written defense of scope, recovery path, and risk boundary.`
		];
	}
	if (kind === "game") {
		return capstoneOverrides["unity-game-development"];
	}

	return [
		`${courseLabel} ends with a portfolio-grade ${familyLabel} project with clear spec, source link, verification path, edge-case evidence, and reflection.`,
		`${courseLabel} includes an extension or refactor demonstrating transfer beyond the worked example.`
	];
}

function defaultToolchainFor(courseLabel: string, familyLabel: string) {
	return [
		`${courseLabel} uses the linked source repo, browser-based material, or provided artifacts as the setup baseline.`,
		`Record any version-sensitive ${familyLabel} setup before starting reusable projects.`
	];
}

function assessmentCadenceFor(
	kind: keyof typeof familyAssessmentCadence,
	courseLabel: string,
	familyLabel: string
) {
	if (familyAssessmentCadence[kind].length === 0) return [];

	if (kind === "algebra") {
		return [
			`${courseLabel} starts with a diagnostic launch for prerequisite arithmetic, graph reading, and notation.`,
			`${courseLabel} uses a low-stakes check-in after every three to five lessons.`,
			`${familyLabel} pacing includes a weekly retrieval spiral plus mixed practice from older skills.`,
			`${courseLabel} includes one required anchor modeling project and one optional extension.`
		];
	}
	if (kind === "ap") {
		return [
			`${courseLabel} uses daily or near-daily MCQ/code-trace warmups.`,
			`${courseLabel} includes weekly partial FRQs typed without compiler support.`,
			`${courseLabel} rotates biweekly full FRQs through the four current FRQ families.`,
			`${courseLabel} includes monthly mixed digital practice with row-scored review.`
		];
	}
	if (kind === "science") {
		return [
			`${courseLabel} uses a notebook check every lesson: question, observation, model or graph, claim, evidence, reasoning.`,
			`${courseLabel} includes one CER or model-revision task per phenomenon sequence.`,
			`${familyLabel} evidence comes from data, simulations, or curated media instead of required physical labs.`,
			`${courseLabel} ends each unit cluster with a performance task.`
		];
	}
	if (kind === "data-ai-ml") {
		return [
			`${courseLabel} uses a notebook or artifact check every module.`,
			`${courseLabel} requires a dataset/source card before analysis or modeling.`,
			`${courseLabel} includes an evaluation report for every data, AI, or ML artifact.`,
			`${courseLabel} final deliverable includes limitations and responsible-use reflection.`
		];
	}
	if (kind === "systems") {
		return [
			`${courseLabel} checks scope and rollback before every lab.`,
			`${courseLabel} includes troubleshooting or trace review every module.`,
			`${familyLabel} findings use evidence-plus-remediation reports.`,
			`${courseLabel} final project includes reproducibility notes, logs, and defensive outcome.`
		];
	}
	if (kind === "game") {
		return [
			`${courseLabel} uses a weekly playable milestone or scene smoke test.`,
			`${courseLabel} keeps a playtest log with bug, reproduction step, fix, and retest.`,
			`${courseLabel} checks build, profile, and test status before final capstone.`,
			`${courseLabel} final demo includes architecture, state flow, and asset attribution.`
		];
	}

	return [
		`${courseLabel} includes a short code-tracing, debugging, or design check every module.`,
		`${courseLabel} has at least one source-backed project milestone per major concept cluster.`,
		`${courseLabel} project review includes a normal case, edge case, and written explanation.`,
		`${courseLabel} capstone or transfer task requires tests, run instructions, and reflection.`
	];
}

function recommendedNextWorkFor(
	kind: keyof typeof familyAssessmentCadence,
	courseLabel: string,
	familyLabel: string
) {
	return nextWorkByKind[kind].map(item => {
		if (item.startsWith("Update source repos")) {
			return `Update ${courseLabel} source repos with starter and reference states.`;
		}
		if (item.startsWith("Add automated")) {
			return `Add automated or documented verification for each reusable ${courseLabel} project.`;
		}
		if (item.startsWith("Keep naming")) {
			return `Keep ${courseLabel} naming and supplemental project structure consistent across repos.`;
		}
		if (item.startsWith("Create worksheet")) {
			return `Create ${courseLabel} worksheet or Desmos asset packs for anchor projects.`;
		}
		if (item.startsWith("Attach per-item")) {
			return `Attach ${courseLabel} per-item standards tags when the schema supports item-level metadata.`;
		}
		if (item.startsWith("Add answer keys")) {
			return `Add ${courseLabel} answer keys for error-analysis and mixed-practice checkpoints.`;
		}
		if (item.startsWith("Create current-family")) {
			return `Create ${courseLabel} FRQ banks with row-scored rubrics.`;
		}
		if (item.startsWith("Add Bluebook")) {
			return `Add ${courseLabel} Bluebook-style typed practice routines and no-compiler prompts.`;
		}
		if (item.startsWith("Map every project")) {
			return `Map every ${courseLabel} project to one current AP CSA unit, practice, and FRQ/MCQ pattern.`;
		}

		return `${courseLabel} ${familyLabel.toLowerCase()} next work: ${item.replace(/^./, character => character.toLowerCase())}`;
	});
}

function setCourseDevelopmentMetadata(courseId: string, course: RawCourse) {
	const profile = profileFor(courseId);
	const kind = kindForCourse(courseId);
	const courseLabel = course.name.trim() || courseId;
	const familyLabel = profile?.family ?? courseLabel;
	const courseBoundaries = boundaryOverrides[courseId] ?? [
		`${courseLabel} keeps prerequisites, core lessons, projects, remediation, enrichment, and assessments labeled separately.`,
		`${courseLabel} does not add adjacent-topic enrichment until the required ${familyLabel} project and assessment evidence exists.`
	];
	const capstoneExpectations = capstoneFor(
		courseId,
		kind,
		courseLabel,
		familyLabel
	);
	if (courseBoundaries.length < 2) {
		courseBoundaries.push(
			`Separate required ${courseLabel} outcomes from optional enrichment before starting the next project.`
		);
	}
	if (capstoneExpectations.length < 2) {
		capstoneExpectations.push(
			`${courseLabel} final work must include evidence of correctness, explanation, and a next-step reflection.`
		);
	}
	const metadata: CourseDevelopmentMetadata = {
		priority: profile?.priority ?? "soon",
		standards: metadataStandards(courseId),
		sourcePolicy: sourcePolicyFor(courseId),
		assessmentCadence: assessmentCadenceFor(kind, courseLabel, familyLabel),
		toolchain:
			courseToolchainAssumptions[courseId] ??
			defaultToolchainFor(courseLabel, familyLabel),
		safetyPolicy: safetyPolicyFor(kind, courseLabel, familyLabel),
		courseBoundaries,
		capstoneExpectations,
		recommendedNextWork: recommendedNextWorkFor(
			kind,
			courseLabel,
			familyLabel
		)
	};

	if (metadata.standards.length === 0) {
		metadata.standards = [
			"Course-family research profile and authored progression map."
		];
	}

	course.developmentMetadata = metadata;
}

const implementationOnlyProfiles = {
	"python-to-java-and-cpp-bridge": {
		family: "Python to Java and C++ Bridge",
		priority: "soon",
		sources: [
			"Python Tutorial",
			"Oracle Java Documentation",
			"ISO C++ Core Guidelines"
		],
		gaps: [
			"Transition from dynamic Python habits to explicit static types.",
			"Compilation, runtime errors, and IDE/build workflow differences.",
			"Object/reference vocabulary across Python, Java, and C++."
		],
		topics: [
			"Type systems and compile-time feedback.",
			"Method signatures, headers, and entry points.",
			"References, object identity, value copying, and ownership vocabulary.",
			"Debugging the same small program in Python, Java, and C++."
		],
		projectTypes: [
			"Port a Python console program into Java and C++.",
			"Create a type-error diagnosis notebook.",
			"Compare object/reference behavior across languages.",
			"Build a small command-line program with equivalent tests in all three languages."
		],
		assessments: [
			"Trace equivalent code in Python, Java, and C++.",
			"Classify errors as syntax, compile-time type, linker/build, or runtime.",
			"Explain why a copied value or reference behaves differently across languages.",
			"Submit a small cross-language project with matching expected output."
		]
	}
};

function profileFor(courseId: string) {
	return (
		researchBackedExpansionProfiles[courseId] ??
		implementationOnlyProfiles[
			courseId as keyof typeof implementationOnlyProfiles
		]
	);
}

function addAlgebraSupplementalProjects(courseId: string, course: RawCourse) {
	if (!courseId.startsWith("algebra-")) return;

	const courseLabel = course.name || courseId.replace(/-/g, " ");

	for (const module of course.modules) {
		while (module.supplementalProjects.length < 2) {
			const next = module.supplementalProjects.length + 1;
			const title =
				next === 1
					? `${module.title}: Standards Practice Set`
					: `${module.title}: Modeling or Error-Analysis Project`;
			const standardsPracticeVariants = [
				`**Project goal:** Convert ${module.title} into a short ${courseLabel} practice set. Include one worked example, three independent problems, one graph/table/verbal representation when appropriate, and one explain-your-reasoning prompt.\n\n**Completion checks:**\n- Each solution shows the algebraic move, representation, or rule used.\n- At least one ${courseLabel} problem asks for a reason, not just an answer.\n- The review note records one misconception or missing prerequisite to revisit before the next module.`,
				`**Project goal:** Build a focused ${courseLabel} practice checkpoint for ${module.title}. Include a worked example, three independent attempts, and one representation change such as equation to graph, graph to table, or verbal model to equation.\n\n**Completion checks:**\n- The worked example names each transformation and why it is valid.\n- The independent problems include one routine case and one case with a sign, unit, graph, or context trap.\n- The reflection names one error pattern and the check that would catch it next time.`,
				`**Project goal:** Turn ${module.title} into a compact standards-aligned practice set with a model problem, fluency problems, and one reasoning prompt.\n\n**Completion checks:**\n- The work makes setup, calculation, and interpretation visible instead of jumping to an answer.\n- One problem requires explaining the method choice in words or with a diagram/table/graph.\n- The final review identifies one skill that is secure and one skill that needs another example.`,
				`**Project goal:** Create a skill-check for ${courseLabel} ${module.title} that mixes procedural practice with explanation. Include one solved model, three new problems, and one representation or justification task.\n\n**Completion checks:**\n- Solutions include enough intermediate work to locate an arithmetic, algebra, or representation mistake.\n- At least one prompt asks for a reasonableness check, substitution check, estimate, graph check, or unit/context check.\n- The closing note names the misconception most likely to affect the next module.`
			];
			const modelingProjectVariants = [
				`**Project goal:** Apply ${module.title} in a modeling, graphing, or error-analysis context for ${courseLabel}. The work interprets a situation, chooses a representation, solves, and explains whether the answer makes sense.\n\n**Completion checks:**\n- The project contains a concrete scenario or flawed worked solution.\n- The work explains the choice of equation, graph, table, or verbal model.\n- The final answer includes a units/context check or corrected error statement.`,
				`**Project goal:** Use ${module.title} to analyze a realistic situation or repair a flawed solution. Choose the representation, solve carefully, and explain the meaning of the result.\n\n**Completion checks:**\n- The scenario states what each quantity represents and what the answer should describe.\n- The selected equation, graph, table, or diagram is justified before calculation begins.\n- The conclusion checks context, units, domain, or the corrected mistake rather than only reporting a number.`,
				`**Project goal:** Connect ${module.title} to a modeling or error-analysis task where the setup matters as much as the computation.\n\n**Completion checks:**\n- The response distinguishes given information, chosen representation, operations, and interpretation.\n- A flawed step, unreasonable answer, or alternate representation is discussed explicitly.\n- The final statement explains why the answer is valid for the situation or why the original work failed.`,
				`**Project goal:** Develop an application task for ${courseLabel} ${module.title} using a context, graph, table, equation, or incorrect sample solution.\n\n**Completion checks:**\n- The project includes a real constraint such as units, domain, scale, rate, intercept, or precision.\n- The representation choice is defended and compared with at least one other possible approach.\n- The closing explanation names the mathematical reason the answer or correction is trustworthy.`
			];
			const content =
				next === 1
					? standardsPracticeVariants[
							stableVariantIndex(
								`${courseId}|${module.title}|standards`,
								standardsPracticeVariants.length
							)
						]
					: modelingProjectVariants[
							stableVariantIndex(
								`${courseId}|${module.title}|modeling`,
								modelingProjectVariants.length
							)
						];

			module.supplementalProjects.push(projectItem(title, content));
		}
	}
}

function addScienceResourceModule(courseId: string, course: RawCourse) {
	const resources = scienceResourceBanks[courseId];
	if (!resources) return;
	const links = scienceResourceLinks[courseId];

	appendModule(course, {
		title: "Science Resource Shortlist and Remote Lab Bank",
		curriculum: [
			{
				title: "Curated Remote Resource Bank",
				content: [
					"**Remote investigation:** Use shared-screen simulations, public images, provided datasets, diagrams, and paper notes. Do not require household materials, lab kits, heat, chemicals, electricity components, or outdoor data collection.",
					`**Resource shortlist:**\n${bullets(resources)}`,
					"**Completion check:** Every investigation should name the phenomenon, the source of evidence, the vocabulary target, and the CER prompt."
				].join("\n\n"),
				mediaLink: links?.mediaLink,
				datasetLink: links?.datasetLink
			},
			{
				title: "Module-by-Module Resource Mapping Routine",
				content:
					"**Learning sequence:** Each science module should connect one simulation or media source, one provided data table or graph, one model or diagram, and one CER prompt to the module question and vocabulary.\n\n**Completion checks:**\n- The evidence can be accessed through Zoom or a browser.\n- The task works without physical supplies.\n- The final product is a diagram, graph, data table, CER response, or short presentation."
			},
			{
				title: "Remote Safety and Accessibility Check",
				content:
					"**Learning sequence:** Required science projects should be completable with notes, paper, a browser, and shared-screen material. Optional household observations need a fully equivalent data or simulation alternative.\n\n**Completion check:** No required project depends on beakers, kits, food, chemicals, heat, electricity, outdoor access, or parent-managed materials."
			},
			{
				title: "Science Notebook Evidence Routine",
				content:
					"**Learning sequence:** Use a consistent notebook structure: date, phenomenon, vocabulary, observations, model or graph, claim, evidence, reasoning, and changed-condition prediction. Observations should describe what is visible in the shared source; inferences should explain what the observation suggests and why.\n\n**Completion check:** The work separates observation from inference, supports claims with visible evidence, and includes one prediction about how the system would change if one variable or condition changed."
			}
		],
		supplementalProjects: [
			{
				title: "Resource Project: Simulation-to-CER Writeup",
				content:
					"**Project goal:** Use one approved simulation or provided dataset to write a CER response. Include a screenshot or sketch of the model, two observations, one claim, evidence from the source, and reasoning that uses the target vocabulary.\n\n**Completion checks:**\n- The evidence comes from the shared source.\n- The reasoning explains why the evidence supports the claim.\n- The work includes a prediction for what would change if one variable changed.",
				mediaLink: links?.mediaLink
			},
			{
				title: "Resource Project: Model Critique",
				content:
					"**Project goal:** Choose one model, diagram, graph, or simulation and explain what it shows well and what it leaves out.\n\n**Completion checks:**\n- The work identifies at least two strengths and one limitation.\n- The critique uses science vocabulary accurately.\n- The critique suggests one improvement or follow-up question.",
				datasetLink: links?.datasetLink
			}
		]
	});
}

function addAlgebraTaxonomyModule(courseId: string, course: RawCourse) {
	if (!courseId.startsWith("algebra-")) return;

	const courseLabel = course.name || courseId.replace(/-/g, " ");

	appendModule(course, {
		title: `${courseLabel}: Project Taxonomy and Assessment Implementation`,
		curriculum: [
			{
				title: `${courseLabel} Structure Decision`,
				content: `**Learning sequence:** Use ${courseLabel} supplemental projects for explicit practice sets, application/modeling projects, error-analysis tasks, and enrichment. Keep core curriculum items for concept instruction, worked examples, and guided practice. Existing imported module projects can remain in curriculum for continuity, but every module should also expose at least two explicit ${courseLabel} project/practice options in the project area.\n\n**Completion check:** ${courseLabel} makes it possible to distinguish required concept instruction from optional, remedial, and enrichment project work without reading the entire module.`
			},
			{
				title: `${courseLabel} Assessment Cadence`,
				content: `**Readiness check:** ${courseLabel} uses a short formative check after each major topic, a cumulative mixed-practice check every few modules, and an error-analysis task before moving into a new representation type. The cadence keeps fluency, interpretation, and written reasoning connected instead of treating them as separate courses.\n\n**Evidence of proficiency:** A complete ${courseLabel} response solves, explains, checks reasonableness, and identifies a common algebraic error.`
			},
			{
				title: `${courseLabel} Representation Balance`,
				content: `**Learning sequence:** Each ${courseLabel} project includes at least two representations when reasonable: equation, graph, table, verbal rule, diagram, or contextual model. The representation change is part of the concept, not a formatting step, because it shows whether the same relationship is understood from multiple angles.\n\n**Completion check:** The work demonstrates the ability to translate between ${courseLabel} representations and explain what each one reveals.`
			},
			{
				title: `${courseLabel} Worked Example Density`,
				content: `**Learning sequence:** For each new ${courseLabel} skill, include one clean worked example, one flawed example to repair, and one transfer problem with changed numbers or context. The clean example models notation, the flawed example exposes a likely misconception, and the transfer example checks whether the method survives a changed surface form.\n\n**Completion check:** The work demonstrates the ability to explain the difference between ${courseLabel} procedure and reason.`
			}
		],
		supplementalProjects: [
			{
				title: `${courseLabel} Practice Set Conversion`,
				content: `**Project goal:** Convert one ${courseLabel} module concept into a practice set with a worked example, three independent problems, one representation task, and one explanation prompt. The set should make the skill teachable without turning into a list of disconnected exercises.\n\n**Practice-set structure:**\n1. Start with a worked example that shows the setup, the algebraic move, and a reasonableness check.\n2. Add one direct problem that follows the same structure so the core procedure is visible.\n3. Add one changed-number or changed-context problem that checks whether the method transfers.\n4. Add one graph, table, diagram, or verbal interpretation task so the relationship is not only symbolic.\n5. End with an explanation prompt asking why the method works or what common mistake it avoids.\n\n**Completion checks:**\n- Problems are sequenced from direct to transfer.\n- One problem requires graph, table, diagram, or context interpretation.\n- The answer key includes reasoning, not just final answers.`
			},
			{
				title: `${courseLabel} Modeling or Error-Analysis Task`,
				content: `**Project goal:** Build either a contextual model or an error-analysis task for one ${courseLabel} topic. A modeling task starts with quantities, units, constraints, and a relationship to represent. An error-analysis task starts with a plausible flawed solution and asks what assumption or algebraic move caused the error.\n\n**Completion checks:**\n- The ${courseLabel} task asks why, not only what.\n- The work checks units or context.\n- A likely ${courseLabel} misconception is named in the review notes.`
			}
		]
	});
}

function addElementaryScienceDecision(courseId: string, course: RawCourse) {
	if (courseId !== "elementary-science") return;

	appendModule(course, {
		title: "Elementary Science Grade-Band Differentiation Decision",
		curriculum: [
			{
				title: "Decision: Keep One Course with K-2 and 3-5 Paths",
				content:
					"**Learning sequence:** Elementary Science stays as one course, with each activity labeled by a K-2 path and a 3-5 path during activity design. K-2 emphasizes observation, drawing, sorting, oral explanation, and sentence frames. Grades 3-5 add data tables, simple graphs, variables, model critique, and fuller CER writing.\n\n**Completion check:** Every elementary science module should name the simpler path, the advanced path, and the shared phenomenon."
			},
			{
				title: "K-2 Path",
				content:
					"**Learning sequence:** Use short phenomena, images, drawings, sorting, matching, and oral explanation. Keep writing light and use sentence frames: I observe, I think, my evidence is, and I wonder.\n\n**Completion check:** The work demonstrates the ability to make observations, ask a question, and explain one idea with a drawing or sentence."
			},
			{
				title: "Grades 3-5 Path",
				content:
					"**Learning sequence:** Add simple measurements, data tables, graph reading, model critique, and claim-evidence-reasoning paragraphs. Require the work to compare examples and explain what would change if one condition changed. This path should feel like a bridge toward middle-school science: evidence is still accessible, but explanations include variables, patterns, and limits of the model or dataset.\n\n**Completion check:** The work demonstrates the ability to use evidence from a shared source and connect it to a science vocabulary term."
			},
			{
				title: "Shared Zoom Constraint",
				content:
					"**Remote investigation:** Both paths remain Zoom-first and paper/browser based. Optional household observations may be allowed only when a fully equivalent image, simulation, or data table is provided.\n\n**Completion check:** The core objective can be completed through the shared online material even when no household observation is available."
			}
		],
		supplementalProjects: [
			{
				title: "Differentiation Project: Two-Level Prompt",
				content:
					"**Project goal:** Rewrite one elementary science activity with a K-2 prompt and a 3-5 prompt using the same phenomenon. The two prompts should share the same observation target while changing the expected reasoning depth, vocabulary support, and evidence format.\n\n**Completion checks:**\n- The K-2 version can be answered with drawing, sorting, or oral explanation.\n- The 3-5 version adds data, graphing, model critique, or CER.\n- Both versions use the same core vocabulary."
			},
			{
				title: "Differentiation Project: Sentence Frame Bank",
				content:
					"**Project goal:** Create sentence frames for observation, inference, claim, evidence, reasoning, and changed-condition prediction. The bank should support both oral and written responses, so younger learners can explain a visible pattern while older learners can connect evidence to a claim.\n\n**Completion checks:**\n- Frames are age-appropriate.\n- Each frame can be used with a shared image or simulation.\n- At least one frame supports short written responses when writing is difficult."
			}
		]
	});
}

function addUnityRebuildModules(courseId: string, course: RawCourse) {
	if (courseId !== "unity-game-development") return;

	const unityTarget =
		"Unity target: Unity 6.3 LTS, based on Unity's current release/support page showing support through December 2027.";
	const modules: RawCourseModule[] = [
		{
			title: "UGD0 Unity 6.3 LTS Setup, Assets, and Project Hygiene",
			curriculum: [
				{
					title: "Unity Version and Hub Setup",
					content: `${unityTarget} Install through Unity Hub, create one 2D project and one 3D project sandbox, and record the editor version in the project README so source snapshots stay reproducible.`
				},
				{
					title: "Project Folder Hygiene",
					content:
						"Explain Assets, Scenes, Scripts, Prefabs, Materials, and Packages. Create a clean folder structure before writing scripts so assets do not become untraceable later."
				},
				{
					title: "Asset Licensing and Attribution",
					content:
						"Use only self-created assets, Unity samples, or permissively licensed assets. Record attribution in a project notes file before the asset enters a capstone."
				},
				{
					title: "First Scene Smoke Test",
					content:
						"Create a scene with one player object, one visible obstacle, one camera view, and one script that writes a debug log on play."
				}
			],
			supplementalProjects: [
				{
					title: "UGD0 Project 1: Unity Smoke-Test Scene",
					content:
						"Create and run a smoke-test scene proving the editor, play mode, script compilation, and folder structure work."
				},
				{
					title: "UGD0 Project 2: Asset Attribution Sheet",
					content:
						"Create an attribution sheet for any external art, audio, font, or package that may be used later."
				}
			]
		},
		{
			title: "UGD1 GameObjects, Components, and C# Scripts",
			curriculum: [
				{
					title: "GameObjects and Components",
					content:
						"Unity objects are component containers. Explain which behavior belongs to the transform, collider, renderer, rigidbody, and custom script."
				},
				{
					title: "Script Lifecycle",
					content:
						"Awake, Start, Update, FixedUpdate, and collision callbacks each fit a specific kind of beginner Unity work."
				},
				{
					title: "Inspector Variables",
					content:
						"Use serialized fields to tune values without hardcoding every number. Change speed or health in the inspector and explain why that is useful."
				},
				{
					title: "Debugging Component State",
					content:
						"Use Debug.Log and inspector checks to verify references, null values, and changing state."
				}
			],
			supplementalProjects: [
				{
					title: "UGD1 Project 1: Component Gallery",
					content:
						"Build a small scene where several objects demonstrate different components and one custom script each."
				},
				{
					title: "UGD1 Project 2: Inspector-Tuned Movement",
					content:
						"Create a player object whose speed, jump force, or rotation can be tuned from the inspector."
				}
			]
		},
		{
			title: "UGD2 Input, Movement, Camera, and Player Feel",
			curriculum: [
				{
					title: "Input to Intent",
					content:
						"Convert keyboard or controller input into intent before changing position or velocity. Describe what the input means before applying movement."
				},
				{
					title: "Movement Models",
					content:
						"Compare transform-based motion, rigidbody velocity, and force-style motion with small examples and clear tradeoffs."
				},
				{
					title: "Camera Follow",
					content:
						"Add a simple camera-follow script and explain how the camera affects usability and game feel."
				},
				{
					title: "Player Feel Tuning",
					content:
						"Use acceleration, friction, gravity scale, coyote-time discussion, or turn speed as tuning examples without overcomplicating the first build."
				}
			],
			supplementalProjects: [
				{
					title: "UGD2 Project 1: Movement Test Room",
					content:
						"Build a small test room comparing two movement styles and record which one feels better for a chosen game type."
				},
				{
					title: "UGD2 Project 2: Camera and Control Polish",
					content:
						"Add camera follow and one movement-feel improvement, then write a short playtest note."
				}
			]
		},
		{
			title: "UGD3 Physics, Collision, Triggers, and Collection",
			curriculum: [
				{
					title: "Collision vs Trigger",
					content:
						"Separate physical collision from trigger detection. The work should know when an object should block movement and when it should only report contact."
				},
				{
					title: "Collectibles and Score",
					content:
						"Connect collision or trigger events to score changes, object removal, and feedback."
				},
				{
					title: "Hazards and Boundaries",
					content:
						"Add hazards, out-of-bounds detection, and reset behavior while keeping player and game-manager responsibilities separate."
				},
				{
					title: "Collision Debugging",
					content:
						"Check collider size, rigidbody settings, layers, tags, and callback names when collision behavior fails."
				}
			],
			supplementalProjects: [
				{
					title: "UGD3 Project 1: Coin Collection Loop",
					content:
						"Build a collection loop with score, visible feedback, and a win condition."
				},
				{
					title: "UGD3 Project 2: Hazard and Reset Room",
					content:
						"Add hazards and boundaries to a small level, then test success and failure states."
				}
			]
		},
		{
			title: "UGD4 UI, Game State, Menus, and Restart Flow",
			curriculum: [
				{
					title: "Game State Model",
					content:
						"Define pre-game, playing, won, lost, paused, and restarting states before adding UI."
				},
				{
					title: "UI Text and Buttons",
					content:
						"Display score, health, instructions, and status messages. Add buttons only after the state model is clear."
				},
				{
					title: "Pause and Restart",
					content:
						"Implement pause, restart, and return-to-menu behavior with predictable state transitions."
				},
				{
					title: "UI Playtest Checklist",
					content:
						"Check whether the player always knows the goal, current state, feedback, and next available action."
				}
			],
			supplementalProjects: [
				{
					title: "UGD4 Project 1: Start Menu and HUD",
					content:
						"Create a start screen, HUD, score display, and win/loss message for an existing game scene."
				},
				{
					title: "UGD4 Project 2: Pause and Restart Flow",
					content:
						"Add pause and restart behavior and verify every state transition from a fresh play session."
				}
			]
		},
		{
			title: "UGD5 Prefabs, Spawning, Levels, Audio, and Animation",
			curriculum: [
				{
					title: "Prefabs and Reusable Objects",
					content:
						"Turn repeated objects into prefabs and explain which values should be instance-specific."
				},
				{
					title: "Spawning and Level Data",
					content:
						"Spawn enemies, coins, obstacles, or hazards from simple rules or hand-authored level layouts."
				},
				{
					title: "Audio and Animation Feedback",
					content:
						"Add sound and animation only where they communicate state: hit, collect, jump, win, lose, or menu click."
				},
				{
					title: "Build Settings and Export Check",
					content:
						"Review scenes in build settings and run a local build or structured play-mode checklist."
				}
			],
			supplementalProjects: [
				{
					title: "UGD5 Project 1: Prefab Spawner",
					content:
						"Create a prefab and spawner that can produce several objects while preserving game balance."
				},
				{
					title: "UGD5 Project 2: Feedback Polish Pass",
					content:
						"Add audio or animation feedback to three meaningful events and explain what each communicates."
				}
			]
		},
		{
			title: "UGD6 Capstone Production, Playtesting, and Revision",
			curriculum: [
				{
					title: "Small Game Design Document",
					content:
						"Write a one-page design document: goal, controls, core loop, mechanics, art/audio scope, scenes, risks, and done criteria."
				},
				{
					title: "Vertical Slice",
					content:
						"Build one complete playable slice before adding more levels or content."
				},
				{
					title: "Playtest and Bug Triage",
					content:
						"Run a structured playtest and classify feedback as bug, usability issue, balance issue, or feature request."
				},
				{
					title: "Revision and Final Presentation",
					content:
						"Revise based on evidence and present the final game by explaining architecture, controls, state flow, and one hard bug."
				}
			],
			supplementalProjects: [
				{
					title: "UGD6 Project 1: Vertical Slice",
					content:
						"Build the smallest complete version of the capstone with start, play, success/failure, and restart."
				},
				{
					title: "UGD6 Project 2: Playtest Revision",
					content:
						"Collect feedback, choose two changes, implement them, and explain why they improved the game."
				}
			]
		}
	];

	for (const module of modules) appendModule(course, module);
}

function addCppMatrixModule(courseId: string, course: RawCourse) {
	if (!["c-level-1", "cpp-level-2", "cpp-level-3"].includes(courseId)) {
		return;
	}

	appendModule(course, {
		title: "C++ Levels 1-3 Concept Matrix and Placement",
		curriculum: [
			{
				title: "Baseline and Progression Matrix",
				content: [
					"**Learning sequence:** Use this matrix when placing students after the original C++ Level 1 material or after Python/Java prerequisites.",
					`**Matrix:**\n${bullets(cppConceptMatrix)}`,
					"**Completion check:** the next lesson direction is identifiable: syntax fluency, memory reasoning, standard-library design, parser/state-machine architecture, or DS&A."
				].join("\n\n")
			},
			{
				title: "CS235/CS236 Concept Extraction",
				content:
					"**Learning sequence:** Extract CS235-style object, container, and data-structure discipline into Level 3/DS&A, and CS236-style scanner/parser, relation, and state-machine ideas into Level 3 command architecture. Keep the projects smaller than college assignments but preserve the core reasoning: representation choices, invariants, invalid-input handling, and the difference between a convenient demo and a maintainable design.\n\n**Completion check:** The extracted idea has a smaller first build and a clear path to a deeper follow-up."
			},
			{
				title: "No AI/ML Boundary",
				content:
					"**Learning sequence:** Do not use C++ Level 3 as an AI/ML course. C++ work can include parsers, command simulations, state machines, search-style architecture, and data-structure choices, but model training and ML evaluation belong in AI/Data Science/Machine Learning. This boundary keeps C++ focused on language fluency, architecture, ownership, and testable program design.\n\n**Completion check:** C++ Level 3 projects are evaluated on program structure and correctness evidence, not prediction accuracy."
			},
			{
				title: "Placement Check",
				content:
					"**Readiness check:** The placement check asks for a pointer/reference explanation, an appropriate vector or map use, a recursive trace, and a command parser rejection path. The weakest answer determines the next module because a gap in memory, containers, recursion, or parsing will become more expensive inside a larger C++ project.\n\n**Evidence of proficiency:** The explanation includes the failure case, not only the successful path."
			}
		],
		supplementalProjects: [
			{
				title: "Matrix Project: Placement Evidence",
				content:
					"**Project goal:** Create a C++ placement evidence sheet. Include one example each for syntax/control flow, memory, containers, recursion, and architecture. Each example should include the prompt, a short answer or code sketch, and a note explaining what the evidence proves about readiness.\n\n**Completion checks:**\n- The sheet names strengths and gaps.\n- The recommended next module follows from evidence.\n- AI/ML topics are not used as C++ placement criteria."
			},
			{
				title: "Matrix Project: CS235/CS236-Inspired Mini Build",
				content:
					"**Project goal:** Choose either a relation-style container view or a scanner/parser mini build and implement the smallest useful version. The build should preserve the college-level idea in miniature: a defined representation, a narrow command or query surface, and a clear response to invalid input.\n\n**Completion checks:**\n- The project has a clear input format.\n- Invalid input is rejected safely.\n- The work explains which college-level idea was simplified."
			}
		]
	});
}

function addApCsaAlignmentModule(courseId: string, course: RawCourse) {
	if (courseId !== "ap-computer-science-a") return;

	appendModule(course, {
		title: "AP CSA Exam Alignment and FRQ Practice Map",
		curriculum: [
			{
				title: "College Board Unit Alignment",
				content: [
					"**AP connection:** Use the current College Board AP CSA framework as the exam-facing map for pacing and review.",
					`**Unit map:**\n${bullets(apCsaUnitMap)}`,
					"**Completion check:** Every AP review assignment should name the unit, Java construct, tracing skill, and likely FRQ or MCQ pattern."
				].join("\n\n")
			},
			{
				title: "FRQ Cadence",
				content:
					"**Learning sequence:** Add one short FRQ-style task after class design, arrays/ArrayLists, 2D arrays, inheritance/polymorphism, and recursion. Use official-style rubrics: correctness, object state, loop bounds, method contract, and edge cases. The task should be short enough to review carefully, but close enough to exam style that tracing and rubric language become familiar.\n\n**Completion check:** The work demonstrates the ability to explain where points would be earned or lost."
			},
			{
				title: "MCQ Distractor Analysis",
				content:
					"**Readiness check:** After each MCQ practice set, classify missed questions by distractor type: off-by-one, reference vs value, integer division, boolean logic, object state, array bounds, or method dispatch. The purpose is to find repeatable misconception patterns rather than simply record a score.\n\n**Completion check:** The error log records each miss and repeats a targeted remediation problem."
			},
			{
				title: "Answer-Check Remediation Rule",
				content:
					"**Learning sequence:** Any AP CSA project without an answer-check path should be paired with local review material or marked as discussion-only. Answer checks can be tests, expected output, trace tables, rubric bullets, or explanation prompts, but the project should not leave correctness completely implicit.\n\n**Completion check:** Each project states whether the work is checked by tests, discussion, or expected-output comparison."
			}
		],
		supplementalProjects: [
			{
				title: "AP Alignment Project: FRQ Rubric Rewrite",
				content:
					"**Project goal:** Rewrite one existing AP CSA project as an FRQ-style prompt with scoring bullets. The rewrite should preserve the original programming goal while making the expected method signatures, object state, loop behavior, and scoring evidence explicit.\n\n**Completion checks:**\n- The prompt states method/class constraints.\n- The rubric identifies core correctness and common point losses.\n- The answer can be traced with at least one edge case."
			},
			{
				title: "AP Alignment Project: Error Log Review",
				content:
					"**Project goal:** Build an error log across one module of MCQ or FRQ practice. The log should separate the mistake type from the correct concept, because AP improvement depends on recognizing patterns such as loop bounds, object state, reference behavior, and rubric wording.\n\n**Completion checks:**\n- Missed items are grouped by AP concept.\n- One remediation task is assigned per recurring issue.\n- The next check-in revisits the weakest skill."
			}
		]
	});
}

function addDataCatalogModule(courseId: string, course: RawCourse) {
	const catalog = dataCatalogs[courseId];
	if (!catalog) return;

	appendModule(course, {
		title: "Dataset, Model, and Evaluation Catalog",
		curriculum: [
			{
				title: "Approved Dataset and Fixture Sources",
				content: [
					"**Learning sequence:** Use stable, inspectable datasets before introducing heavier tooling. Every dataset should have a source, license/usage note, target question, and known caveat.",
					`**Catalog:**\n${bullets(catalog)}`,
					"**Completion check:** The work demonstrates the ability to name the target, features or evidence, limitation, and evaluation method before coding."
				].join("\n\n")
			},
			{
				title: "Reproducibility Contract",
				content:
					"**Learning sequence:** Each notebook or script runs from top to bottom with fixed seeds or documented randomness, visible imports, environment notes, and clear data-loading paths. Reproducibility is part of the result: if the artifact cannot be rerun, the evidence is difficult to trust or review.\n\n**Completion check:** A fresh run reproduces the main table, graph, model metric, or AI behavior."
			},
			{
				title: "Evaluation and Limitation Notes",
				content:
					"**Readiness check:** Evaluation uses a baseline, metric, validation split or test scenario, and limitation note when the course uses models or AI behavior. The limitation is not an apology at the end; it is part of the interpretation and helps separate measured evidence from overconfident claims.\n\n**Evidence of proficiency:** The work demonstrates the ability to explain why the metric fits the problem and where the result should not be trusted."
			},
			{
				title: "Responsible Use Check",
				content:
					"**Learning sequence:** Use introductory NIST AI RMF language: intended use, risk, harm, uncertainty, mitigation, and human oversight. This check keeps technical output connected to audience and context, especially when a chart, prediction, or generated behavior could be misread as more certain than it is.\n\n**Completion check:** The work includes one limitation or risk statement for each major AI/ML/data project."
			}
		],
		supplementalProjects: [
			{
				title: "Catalog Project: Dataset Readiness Card",
				content:
					"**Project goal:** Create a readiness card for one dataset or fixture before using it in an analysis, model, or AI behavior test. The card should make the source understandable without opening the notebook first.\n\n**Required fields:** source URL or origin, license or usage note, target question, relevant columns or features, expected row/item count when available, missing-value or quality caveats, and one reason the source is appropriate for the course level.\n\n**Completion checks:**\n- Source and license/usage notes are recorded.\n- Target question and columns/features are named.\n- Known limitations or risks are documented.\n- One sanity check is listed before analysis begins."
			},
			{
				title: "Catalog Project: Evaluation Report",
				content:
					"**Project goal:** Write a short evaluation report for one AI, data, or ML artifact. The report should explain what the artifact was expected to do, what evidence was collected, and what would make the result stronger or less trustworthy.\n\n**Required fields:** task or question, baseline or comparison, metric or evidence source, result, interpretation, limitation, and one follow-up test.\n\n**Completion checks:**\n- The report includes baseline or comparison.\n- The metric or evidence is justified.\n- The limitation statement is specific.\n- The conclusion avoids claiming more than the evidence supports."
			}
		]
	});
}

function addSecurityPolicyModule(courseId: string, course: RawCourse) {
	if (
		![
			"low-level-security",
			"low-level-security-part-2",
			"network-security",
			"network-systems",
			"c-systems-engineering",
			"linux-systems",
			"rust-systems-security"
		].includes(courseId)
	) {
		return;
	}
	const courseLabel = course.name.trim() || courseId;
	const policy = systemsSecurityPolicy();

	appendModule(course, {
		title: `${courseLabel}: Systems and Security Lab Safety Policy`,
		curriculum: [
			{
				title: `${courseLabel} Allowed Lab Scope`,
				content: [
					`**Concept path:** Start every ${courseLabel} lab by naming scope, target, tools, and stop conditions.`,
					`**Policy:**\n${bullets(policy)}`,
					"**Completion check:** The work demonstrates the ability to explain why the lab is authorized and what defensive outcome it produces."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Disallowed Work`,
				content: `**Safety boundary:** ${courseLabel} does not include scanning third-party systems, testing credentials against real services, collecting real user data, bypassing access controls, running destructive host commands, or publishing exploit steps detached from remediation. The boundary is part of the technical content: defensive work is only meaningful when the target, permission model, and recovery path are clear.\n\n**Completion check:** Any unclear target is treated as out of scope until explicitly approved, replaced with a local fixture, or rewritten as a paper analysis of an already documented vulnerability.`
			},
			{
				title: `${courseLabel} Evidence and Remediation Format`,
				content: `**Concept path:** ${courseLabel} findings use this format: scope, observation, reproduction in local lab, impact, fix, test proving the fix, and prevention note. The observation describes what happened; the impact explains why it matters; the fix is narrow enough to retest.\n\n**Completion check:** A lab is incomplete without a mitigation or hardening step, the command or evidence proving the fix, and a note explaining whether the same issue could reappear elsewhere.`
			},
			{
				title: `${courseLabel} Tooling Setup and Recovery`,
				content: `**Concept path:** ${courseLabel} prefers VMs, containers, local toy services, sample captures, compiler sanitizers, and reversible configuration. Recovery is not a footnote; it is the difference between a controlled lab and accidental host damage. Record the starting state, the reset command or snapshot, and which files or services can be safely changed before the lab begins.\n\n**Completion check:** The work demonstrates the ability to restore the lab to a known state and explain which evidence came from the controlled environment.`
			}
		],
		supplementalProjects: [
			{
				title: `${courseLabel} Safety Project: Threat Model and Scope Sheet`,
				content: `**Project goal:** Write a scope sheet for one ${courseLabel} lab before running commands. The sheet makes the allowed target, evidence, and stopping conditions explicit so the activity stays local, reversible, and defensive.\n\n**Required fields:** lab target, authorization boundary, allowed tools, disallowed actions, data that may be observed, stop conditions, reset path, and intended defensive outcome.\n\n**Completion checks:**\n- Target and authorization are explicit.\n- Allowed and disallowed actions are listed.\n- Defensive outcome is named.\n- The reset path is specific enough to repeat after a failed run.`
			},
			{
				title: `${courseLabel} Safety Project: Patch and Evidence Report`,
				content: `**Project goal:** Fix one local toy vulnerability or unsafe systems bug in ${courseLabel} and write an evidence report. The report shows the before state, the smallest useful fix, and the verification that proves the unsafe behavior no longer occurs.\n\n**Required fields:** vulnerable behavior, reproduction command or trace, impact, patch summary, retest evidence, and prevention note.\n\n**Completion checks:**\n- The before state is reproduced locally.\n- The patch is tested.\n- The report explains impact and prevention.\n- The retest uses the same scenario that exposed the original bug.`
			}
		]
	});
}

function addToolchainAssumptionsModule(courseId: string, course: RawCourse) {
	const assumptions = courseToolchainAssumptions[courseId];
	if (!assumptions) return;
	const courseLabel = course.name.trim() || courseId;
	const profile = profileFor(courseId);
	const familyLabel = profile?.family ?? courseLabel;

	appendModule(course, {
		title: `${courseLabel}: Toolchain and Version Assumptions`,
		curriculum: [
			{
				title: `${courseLabel} Setup Assumptions`,
				content: [
					`**Learning sequence:** Treat ${courseLabel} setup and version expectations as part of the course material. Before a project begins, confirm the expected runtime, editor, compiler, simulator, or lab environment and record any version-specific deviation in the reproducibility notes.`,
					`**Assumptions:**\n${bullets(assumptions)}`,
					"**Completion check:** Each project opens with a clear expected toolchain, first verification command or smoke test, and any version-specific behavior that matters."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Upgrade Rule`,
				content: [
					`**Learning sequence:** When the ${courseLabel} toolchain changes, update starter files, screenshots, setup wording, and smoke tests together. The setup should not silently rely on a local machine that already has old dependencies installed.`,
					`**Completion checks:**\n- The current ${familyLabel} version is named.\n- The first-run verification step is still valid.\n- Any known version-specific exception is documented.`
				].join("\n\n")
			},
			{
				title: `${courseLabel} Platform Fallbacks`,
				content: [
					`**Learning sequence:** If ${courseLabel} can run on multiple operating systems, name the primary path and at least one fallback. If it cannot, say so directly and explain the prerequisite. A fallback should preserve the learning objective even when the exact editor, compiler, simulator, operating system, or package version differs.`,
					"**Completion check:** The setup notes identify whether the work requires macOS, Windows, Linux, a VM/container, browser-only tools, or an online simulation."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Reproducibility Notes`,
				content: [
					`**Learning sequence:** Reusable ${courseLabel} projects should include enough setup notes that a fresh checkout or fresh browser session can reproduce the assignment. Record package versions, compiler flags, data paths, Unity/Xcode/editor versions, or lab VM assumptions when they affect the work. The notes should identify what is required, what is optional, and what can be substituted without changing the target skill.`,
					"**Completion check:** Re-running the project does not depend on hidden local state."
				].join("\n\n")
			}
		],
		supplementalProjects: [
			{
				title: `${courseLabel} First-Run Smoke Test`,
				content: [
					`**Project goal:** Create or run the smallest verification step that proves the ${courseLabel} toolchain is ready. A useful smoke test avoids full-project complexity and checks only the first thing that must work: compile and run, open the simulator, load the dataset, start the local server, or execute a minimal script.`,
					`**Completion checks:**\n- The exact command, editor action, or simulation URL is recorded.\n- The expected success output is documented.\n- One common ${familyLabel} failure and recovery step is listed.\n- The smoke test is small enough to rerun after updates without masking setup problems inside unrelated project code.`
				].join("\n\n")
			},
			{
				title: `${courseLabel} Version Drift Review`,
				content: [
					`**Project goal:** Compare the current ${courseLabel} assumption against the installed or recommended version and document whether the course needs an update. Version drift matters when screenshots no longer match, commands change, package APIs move, browser behavior changes, or a compiler/runtime emits different warnings than the lesson expects.`,
					`**Completion checks:**\n- Current installed/recommended ${familyLabel} version is named.\n- Any breaking UI/API/build difference is recorded.\n- The version-drift note shows whether to proceed, update, or use a fallback.\n- The review distinguishes harmless cosmetic differences from changes that affect instructions, tests, or expected output.`
				].join("\n\n")
			}
		]
	});
}

function addAlgebraStandardsArchitectureModule(
	courseId: string,
	course: RawCourse
) {
	const maps: Record<string, string[]> = {
		"algebra-1a": [
			"Expressions and patterns with structure, equivalence, and verbal-to-symbol translation.",
			"Linear relationships, slope, intercepts, tables, graphs, and contextual interpretation.",
			"Solving linear equations and inequalities with reasonableness checks.",
			"Systems of linear equations and inequalities using graphing, substitution, elimination, and constraints.",
			"Introductory function thinking across tables, graphs, equations, and verbal rules."
		],
		"algebra-1b": [
			"Function notation and multiple representations.",
			"Absolute value and piecewise/nonlinear introductions.",
			"Exponent rules and exponential functions.",
			"Quadratic functions, equations, factoring, graphing, and model comparison.",
			"Introductory data modeling and comparison of linear, quadratic, and exponential behavior."
		],
		"algebra-2a": [
			"Sequences and stronger function review.",
			"Parent-function transformations and representation transfer.",
			"Combining, composing, and inverting functions.",
			"Exponential and logarithmic functions with interpretation.",
			"Deeper quadratic methods, complex numbers, and method comparison."
		],
		"algebra-2b": [
			"Polynomial functions and end behavior.",
			"Rational expressions and rational functions.",
			"Trigonometric foundations and periodic modeling.",
			"Probability, statistics, and model interpretation.",
			"Cumulative comparative modeling across function families."
		]
	};
	const scope = maps[courseId];
	if (!scope) return;

	appendModule(course, {
		title: "Standards-Mapped Algebra Architecture",
		curriculum: [
			{
				title: "Course Scope Map",
				content: [
					"**Learning sequence:** This standards-facing course spine builds from concept explanation to worked example, guided practice, mixed practice, project application, and assessment rather than appearing as a flat worksheet list.",
					`**Scope:**\n${bullets(scope)}`,
					"**Completion check:** The course makes it possible to point to the topic family, representation type, and modeling role for each major module."
				].join("\n\n")
			},
			{
				title: "Course Item Labels",
				content:
					"**Learning sequence:** Use clear labels such as Lesson, Practice, Check-in, Project, Remediation, Enrichment, or Assessment. The label should make the purpose of each item obvious: introducing a concept, practicing a skill, checking mastery, repairing a gap, or extending the idea.\n\n**Completion check:** A reader can tell which items teach, which items practice, which items assess, and which items extend."
			},
			{
				title: "Required Anchor and Extension Projects",
				content:
					"**Project goal:** Each algebra course includes one required anchor modeling project and one optional extension project. Anchor projects use context, representation choice, solution, and reasonableness check; extensions change the constraint or add a second method.\n\n**Completion checks:**\n- At least two representations are used.\n- The work includes a reasoning paragraph.\n- The project has a remediation path for prerequisite gaps."
			},
			{
				title: "Practice Set Types",
				content:
					"**Readiness check:** Rotate six practice formats: worked example, near-transfer fluency, error analysis, interleaved mixed set, retrieval spiral, and compact application set. The formats should not be random worksheet styles; each one checks a different kind of algebra understanding, from procedure to transfer to misconception repair.\n\n**Evidence of proficiency:** The work demonstrates the ability to solve, explain, identify a common error, and transfer the same idea to a changed context."
			}
		],
		supplementalProjects: [
			{
				title: "Anchor Project: Modeling Task Blueprint",
				content:
					"**Project goal:** Draft the required anchor modeling project for this course. Name the context, variables, representation choices, solution method, and reasonableness check. The blueprint should make the task usable as a course anchor rather than a single exercise by showing how the same model can be introduced, practiced, assessed, and extended.\n\n**Completion checks:**\n- The project uses at least two representations.\n- The answer is interpreted in context.\n- The rubric checks both procedure and explanation."
			},
			{
				title: "Extension Project: Changed Constraint",
				content:
					"**Project goal:** Extend the anchor project by changing one constraint, adding a second method, or comparing two models. The extension should test whether the method is understood structurally: a changed condition may preserve the same relationship, require a new representation, or expose where the original model was too narrow.\n\n**Completion checks:**\n- The changed condition is explicit.\n- The work explains why the original method still works or must change.\n- The result is compared against the original case."
			}
		]
	});
}

function addScienceGradeBandScopeModule(courseId: string, course: RawCourse) {
	if (courseId === "elementary-science") {
		appendModule(course, {
			title: "K-2 and 3-5 Zoom-Safe Science Scope Map",
			curriculum: [
				{
					title: "K-2 Primary Science Path",
					content:
						"**Remote investigation:** K-2 activities emphasize concrete observation, picture sorting, labeled drawings, short oral explanation, simple patterns, and sentence frames. Core topics include pushes and pulls, light and sound, sky patterns, material properties, habitats, local weather, plant/animal needs, and simple engineering design.\n\n**Completion check:** The work demonstrates the ability to observe, sort, sketch, and explain one pattern using simple evidence."
				},
				{
					title: "Grades 3-5 Upper Elementary Path",
					content:
						"**Remote investigation:** Grades 3-5 activities add fair-test reasoning, variables, data tables, bar or line graphs, model revision, cause/effect language, and fuller CER writing. Core topics include weather/climate patterns, natural hazards, forces/magnets, life cycles, fossils/adaptation, energy, waves, Earth features, particle models, ecosystems, water distribution, and sky patterns.\n\n**Completion check:** The work uses data or a shared simulation to revise a model and write a short CER response."
				},
				{
					title: "Engineering Every Year",
					content:
						"**Learning sequence:** Engineering is not a bonus unit. Every grade band should include criteria, constraints, solution comparison, revision after evidence, and a short design reflection.\n\n**Completion check:** The work demonstrates the ability to explain what problem the design solves, what tradeoff was chosen, and what evidence would improve the solution."
				},
				{
					title: "Physical-Material Boundary",
					content:
						"**Remote investigation:** No activity requires beakers, chemicals, heat, food, kits, outdoor collection, or parent-supervised construction. Optional observations must have an equivalent image, simulation, or data table.\n\n**Completion check:** The core objective can be completed with only paper, notes, and browser/shared-screen access."
				}
			],
			supplementalProjects: [
				{
					title: "K-2 Project: Picture Evidence Notebook",
					content:
						"**Project goal:** Use a provided image, video clip, or simulation screenshot to create a notebook page with observation, drawing, vocabulary, and one claim. The notebook page should separate what is directly visible from what is inferred, even when the explanation is short and age-appropriate.\n\n**Completion checks:**\n- The claim is based on visible evidence.\n- The drawing is labeled.\n- One follow-up response explains what detail in the picture or simulation supports the claim."
				},
				{
					title: "Grades 3-5 Project: Fair-Test Data Story",
					content:
						"**Project goal:** Use a provided dataset or simulation output to compare two cases and write a CER paragraph. The story should name what changed, what was measured, and why the comparison is fair enough to support a conclusion.\n\n**Completion checks:**\n- The data is organized in a table or graph.\n- The claim uses science vocabulary.\n- The reasoning explains why the evidence supports the claim."
				}
			]
		});
	}

	if (courseId !== "middle-school-integrated-science") return;

	appendModule(course, {
		title: "Middle School Integrated Science 6-8 Scope Map",
		curriculum: [
			{
				title: "Grade 6 Theme: Systems Students Can See and Model",
				content:
					"**Remote investigation:** Grade 6 centers visible systems: cells and body systems, structure/function, Earth-sun-moon patterns, weather, water cycle, regional climate, hazard monitoring, and introductory engineering design.\n\n**Completion check:** The work builds a model from a shared source and explains how one part of the system affects another."
			},
			{
				title: "Grade 7 Theme: Matter Moving Through Living and Earth Systems",
				content:
					"**Remote investigation:** Grade 7 centers atoms and molecules, substance properties, chemical reactions, conservation of atoms, ecosystems, photosynthesis/respiration conceptually, cycling of matter and energy, Earth materials, resources, and human impacts.\n\n**Completion check:** The work traces matter or energy through a model and supports the explanation with data or simulation evidence."
			},
			{
				title: "Grade 8 Theme: Forces, Waves, Heredity, and Evolutionary Change",
				content:
					"**Remote investigation:** Grade 8 centers one-dimensional forces and motion, collisions, fields qualitatively, energy and wave models, information transfer, inheritance and variation, mutations conceptually, natural selection, fossils, biodiversity, and human-impact solutions. The through-line is evidence comparison: different models or datasets may support different parts of the explanation.\n\n**Completion check:** The work compares multiple lines of evidence and writes a CER or model critique."
			},
			{
				title: "6-8 Coverage Guardrail",
				content:
					"**Learning sequence:** Across the full sequence, verify coverage of PS1 matter, PS2 forces, PS3 energy, PS4 waves, LS1 organisms, LS2 ecosystems, LS3 heredity, LS4 evolution, ESS1 space, ESS2 Earth systems, ESS3 human impact, and ETS1 engineering.\n\n**Completion check:** No strand is skipped because it is difficult to do as a home lab."
			}
		],
		supplementalProjects: [
			{
				title: "Integrated Science Project: Public Dataset CER",
				content:
					"**Project goal:** Use a public dataset or provided table to explain a science phenomenon with claim, evidence, reasoning, and limitation. The explanation should not merely restate a graph; it should connect a visible pattern to a scientific mechanism and identify what additional evidence would make the claim stronger.\n\n**Completion checks:**\n- The evidence is visible in the data.\n- The reasoning names a system interaction.\n- The limitation states what the data cannot prove."
			},
			{
				title: "Integrated Science Project: Model Revision",
				content:
					"**Project goal:** Draw an initial model, inspect a simulation or media source, then revise the model and explain what changed. The revision should make thinking visible: labels, arrows, scale, missing variables, or relationships may change when new evidence is added.\n\n**Completion checks:**\n- The revised model is visibly different.\n- The explanation names the new evidence.\n- The work identifies one model limitation."
			}
		]
	});
}

function addDataAiMlBoundaryModule(courseId: string, course: RawCourse) {
	const boundaryText: Record<string, string[]> = {
		"data-science-in-python": [
			"Core question: What does the data say, and how can we defend that claim for a human audience?",
			"Main artifact: reproducible notebook/report, cleaned dataset, visual argument, and limitation notes.",
			"Keep out: search/planning/game trees, train/validation/test-heavy model pipelines, and neural-network tuning."
		],
		"ai-level-1": [
			"Core question: How should an agent represent a problem and search or reason toward a solution?",
			"Main artifact: solver, rule system, search agent, game agent, or explanation trace.",
			"Keep out: pandas-heavy cleaning labs, model-selection pipelines, and raw accuracy competitions."
		],
		"machine-learning": [
			"Core question: What can be learned from examples, and how do we know the model generalizes?",
			"Main artifact: leakage-safe pipeline, baseline comparison, evaluation report, and model card.",
			"Keep out: symbolic search/planning/game-tree projects except as historical or contrast examples."
		]
	};
	const lines = boundaryText[courseId];
	if (!lines) return;

	appendModule(course, {
		title: "Data Science, AI Foundations, and Machine Learning Boundary Map",
		curriculum: [
			{
				title: "Artifact Boundary",
				content: [
					"**Learning sequence:** Use the artifact boundary to prevent Data Science, AI Foundations, and Machine Learning from becoming diluted copies of one another.",
					`**Boundary:**\n${bullets(lines)}`,
					"**Completion check:** The course makes it possible to explain why the project belongs in this course and not one of the adjacent data/AI/ML courses."
				].join("\n\n")
			},
			{
				title: "Required Responsible-Use Checkpoint",
				content:
					"**Readiness check:** A short responsible-use checkpoint appears before any final artifact: audience, data/source, assumptions, limitations, likely failure modes, and what a human review step verifies. This makes responsible use part of the project design instead of a reflection added after the result is already accepted.\n\n**Evidence of proficiency:** The work demonstrates the ability to name one realistic way the artifact could mislead someone."
			},
			{
				title: "Reproducible Artifact Requirement",
				content:
					"**Learning sequence:** Every final data/AI/ML artifact includes setup notes, source or fixture details, the exact question or goal, evaluation evidence, and a short explanation of limitations. The artifact should be understandable from its own notes, because hidden local setup and undocumented assumptions make results hard to reproduce.\n\n**Completion check:** Another reviewer can rerun or inspect the artifact without private context."
			},
			{
				title: "Anti-Overlap Review",
				content:
					"**Learning sequence:** Before adding a new project, classify it by grading emphasis: cleaning and communication means Data Science; state representation and algorithmic reasoning means AI Foundations; generalization and model evaluation means Machine Learning. This prevents one project idea from being copied across three courses with only the title changed.\n\n**Completion check:** The rubric matches the course identity."
			}
		],
		supplementalProjects: [
			{
				title: "Boundary Project: Artifact Classification",
				content:
					"**Project goal:** Classify three possible projects as Data Science, AI Foundations, or Machine Learning and justify each decision. The explanation should name the artifact, the main skill being assessed, and why the same prompt would need a different rubric in an adjacent course.\n\n**Completion checks:**\n- The classification names the main artifact.\n- The rubric emphasis matches the course.\n- One rejected course placement is explained."
			},
			{
				title: "Boundary Project: Responsible-Use Card",
				content:
					"**Project goal:** Create a responsible-use card for a dataset, solver, agent, or model before treating its output as reliable. The card should connect the artifact to a realistic user, a realistic failure mode, and a concrete mitigation.\n\n**Required fields:** source or system name, intended use, user or stakeholder, assumption, limitation, possible harm or misleading output, human review step, and mitigation.\n\n**Completion checks:**\n- Source and intended use are stated.\n- A limitation or risk is specific.\n- Human review or mitigation is named.\n- The card distinguishes uncertainty from a definite failure."
			}
		]
	});
}

function addAdvancedPythonStudioModule(courseId: string, course: RawCourse) {
	if (courseId !== "python-level-3") return;

	appendModule(course, {
		title: "Advanced Python Algorithm and Engineering Studio",
		curriculum: [
			{
				title: "Studio Sequence",
				content:
					"**Learning sequence:** Treat Python Level 3 as a 14-16 week bridge into algorithms, data structures, Java/C++ transfer, and software quality. Sequence the course through recursion and correctness, backtracking/generators/memoization, searching and indexing, sorting and ordering, runtime and memory analysis, file-backed programs, capstone proposal, implementation, optimization, and final defense.\n\n**Completion check:** The work demonstrates the ability to explain correctness, data representation, asymptotic cost, and testing evidence for every major project."
			},
			{
				title: "Required Advanced Python Topics",
				content:
					"**Learning sequence:** Add iterators, generators, itertools, decorators for instrumentation or memoization, context managers, type hints, dataclasses, modules/packages, pytest, timeit, cProfile, tracemalloc, heapq, bisect, deque, and pathlib/csv/json as tools that unlock algorithmic projects. Each topic should answer a practical engineering question such as how to stream data, measure cost, organize files, or make correctness easier to test.\n\n**Completion check:** Each advanced language feature is tied to a project need, not taught as isolated syntax."
			},
			{
				title: "Project Ladder",
				content:
					"**Project goal:** Use a ladder from recursive fractal or puzzle tracing, to search strategy lab, mini text index, stable leaderboard, benchmark harness, CSV/log analyzer, and capstone. The ladder should increase independence and engineering weight gradually: first correctness, then data representation, then performance, then documentation and maintainability.\n\n**Completion checks:**\n- Each project has tests.\n- Each project includes a normal and edge case.\n- Later projects include runtime or memory evidence."
			},
			{
				title: "Capstone Defense",
				content:
					"**Readiness check:** Capstones require file-backed data, algorithm choice, performance evidence, documentation, and tests. Strong defaults include local document search, external sort pipeline, puzzle solver suite, route planner, and simplified compressor/archive inspector. A proposal is ready when the first version is narrow enough to finish but deep enough to justify design choices.\n\n**Evidence of proficiency:** The work demonstrates the ability to defend the data structure choice, runtime tradeoff, and at least one limitation."
			}
		],
		supplementalProjects: [
			{
				title: "Studio Project: Local Document Search Engine",
				content:
					"**Project goal:** Read a folder of text/markdown/json files, build an inverted index, support keyword or prefix searches, rank results, and benchmark at least two query strategies. The project should make parsing, indexing, query behavior, and scoring visible enough to debug without guessing which file or token caused a result.\n\n**Completion checks:**\n- Parsing handles empty and malformed files.\n- Tests cover found, missing, repeated, and case-variant terms.\n- The report explains data structures and runtime."
			},
			{
				title: "Studio Project: External Sort or Log Pipeline",
				content:
					"**Project goal:** Process CSV/log data using streaming, chunking, heap/merge ideas, summary generation, and memory-aware benchmarking. The project should make the tradeoff visible: loading everything is simpler, but streaming or chunking is necessary when data size becomes part of the problem.\n\n**Required behavior:** read deterministic fixtures, handle malformed or empty rows, produce a sorted or aggregated output, record timing or memory evidence, and explain why the chosen approach fits the input size.\n\n**Completion checks:**\n- The pipeline scales beyond toy input.\n- Memory assumptions are measured or justified.\n- The final report includes test fixtures and limitations."
			}
		]
	});
}

function addJavaBridgeModernModule(courseId: string, course: RawCourse) {
	const tracks = {
		"java-level-1": {
			title: "Java Level 1: Accelerated Syntax and Class Bridge",
			curriculum: [
				{
					title: "Placement Gate",
					content:
						"**Readiness check:** Java Level 1 can move quickly through variables, conditionals, loops, and console I/O when the same ideas are already fluent in Python or C++. The non-negotiable evidence is Java-specific: method signatures, class layout, package/import habits, primitive versus reference types, and compile/run troubleshooting.\n\n**Completion check:** A complete response explains what Java requires explicitly that Python hides and what Java hides compared with C++ memory management."
				},
				{
					title: "Java Object Basics",
					content:
						"**Learning sequence:** Use small classes, constructors, fields, methods, records where appropriate, and ArrayList practice to make Java's object model concrete. The goal is not more syntax repetition; it is being able to decide where data lives and which method owns a behavior.\n\n**Completion check:** The work chooses between local variable, field, parameter, return value, class, and record intentionally."
				},
				{
					title: "AP CSA Alignment",
					content:
						"**Learning sequence:** Preserve the AP CSA essentials: integer division, boolean logic, method calls, class design, arrays, ArrayLists, inheritance, recursion, and sorting/searching. Acceleration should shorten familiar fundamentals, not skip AP-specific conventions or tracing style. The bridge should explicitly compare Java syntax with known Python/C++ ideas while keeping AP-style state tracing and method-contract language visible.\n\n**Completion check:** A solution can be traced in AP style and still run cleanly in a local Java toolchain."
				}
			],
			supplementalProjects: [
				{
					title: "Java Level 1 Project: Console Object Model",
					content:
						"**Project goal:** Convert a small Python-style console program into Java classes with fields, constructors, methods, and a testable main flow. The conversion should show why Java asks for explicit types, class structure, and method boundaries rather than simply translating syntax line by line.\n\n**Completion checks:**\n- Input, stored state, and output responsibilities are separated.\n- At least one invalid or awkward input path is handled.\n- The explanation identifies one Java-specific design choice that did not exist in the Python version."
				},
				{
					title: "Java Level 1 Project: Record-backed Data Summary",
					content:
						"**Project goal:** Use a record or simple immutable class to represent rows of data, then summarize a small in-memory list using loops or ArrayList methods. The data model should make field names, construction, equality, and output easier to reason about than parallel arrays or loosely related variables.\n\n**Completion checks:**\n- Empty, one-item, and normal lists are checked.\n- The data representation is immutable where practical.\n- The final note explains why the data model is cleaner than parallel arrays."
				}
			]
		},
		"java-level-2": {
			title: "Java Level 2: Object Design and Collections Bridge",
			curriculum: [
				{
					title: "Design Gate",
					content:
						"**Readiness check:** Java Level 2 assumes loops and basic classes are already comfortable. The next jump is object collaboration: interfaces, abstract classes, inheritance tradeoffs, wrapper classes, generics, ArrayLists, and predictable method contracts.\n\n**Completion check:** A complete design explains why a type is a class, record, interface, abstract class, or collection instead of using inheritance by habit."
				},
				{
					title: "Collections and Contracts",
					content:
						"**Learning sequence:** Practice list and map-shaped problems with clear mutability rules, equality expectations, and edge cases. Strong work includes method-level tests or compact console traces rather than only manual inspection. The key design question is not which collection is available, but what behavior the public method promises when data is missing, duplicated, invalid, or updated.\n\n**Completion check:** The implementation identifies who owns mutation, how invalid inputs are handled, and what behavior is guaranteed by each public method."
				},
				{
					title: "AP and Beyond",
					content:
						"**Learning sequence:** Keep AP CSA class/inheritance expectations visible, then add more realistic collection-backed design. Use records for transparent data carriers and interfaces for replaceable behavior when the project has a real extension point. The design choice distinguishes exam-essential inheritance from production-style composition instead of copying a pattern name.\n\n**Completion check:** The same project can be extended without rewriting the core loop."
				}
			],
			supplementalProjects: [
				{
					title: "Java Level 2 Project: Interface-driven Simulator",
					content:
						"**Project goal:** Build a small simulator with an interface for one replaceable behavior and at least two implementations. The simulator can be simple, but the interface should represent a real variation point such as movement, scoring, filtering, pricing, or decision logic.\n\n**Completion checks:**\n- The interface describes behavior, not storage details.\n- A new implementation can be added with minimal changes to the runner.\n- Tests or traces compare two implementations on the same scenario."
				},
				{
					title: "Java Level 2 Project: Record-backed CSV Loader",
					content:
						"**Project goal:** Parse a small CSV-style text file into records or immutable objects, validate rows, and produce a summary. The record or immutable type should become the boundary between messy input text and reliable program logic, so later code works with named fields instead of raw string indexes.\n\n**Completion checks:**\n- Missing, malformed, and normal rows have defined behavior.\n- File and parsing errors are reported clearly.\n- The summary code does not depend on raw string positions after parsing."
				}
			]
		},
		"java-level-3": {
			title: "Java Level 3: Platform Fluency Bridge",
			curriculum: [
				{
					title: "Platform Gate",
					content:
						"**Readiness check:** Java Level 3 should feel like real application work: packages, NIO Path/Files, streams or well-structured loops, exceptions, tests, generics, simple concurrency boundaries, and maintainable command-line behavior. The gate is satisfied when code organization, error handling, and test fixtures are visible enough that the project could grow without becoming one large main method.\n\n**Completion check:** A project demonstrates how Java organizes a medium-size program, not just how individual syntax features work."
				},
				{
					title: "Files, Streams, and Tests",
					content:
						"**Learning sequence:** Use local files and deterministic fixtures to practice data loading, transformation, aggregation, and reporting. Streams are useful when they clarify the data pipeline; loops remain appropriate when they make state or error handling clearer.\n\n**Completion check:** The implementation covers empty input, malformed input, normal input, and one larger input without changing the public API."
				},
				{
					title: "Extension Architecture",
					content:
						"**Learning sequence:** ServiceLoader, explicit factories, or plugin-style registries are useful only when the project has multiple behaviors worth swapping. Architecture is justified by the change story, not by pattern vocabulary. A useful extension point has a stable interface, at least two implementations, and a small driver that does not need to know each implementation's internals.\n\n**Completion check:** Adding a new processor, command, or report type does not require rewriting the application driver."
				}
			],
			supplementalProjects: [
				{
					title: "Java Level 3 Project: File Indexer or Log Analyzer",
					content:
						"**Project goal:** Build a Java application using records/classes, NIO file traversal, aggregation, and JUnit tests. The project should separate file discovery, parsing, data representation, analysis, and reporting so each piece can be tested or replaced independently.\n\n**Completion checks:**\n- File errors are handled clearly.\n- Tests cover empty, small, malformed, and larger inputs.\n- The final note explains the data model, API boundary, and one performance tradeoff."
				},
				{
					title: "Java Level 3 Project: Service Pipeline",
					content:
						"**Project goal:** Build a plugin-style processor using interfaces, packages, ServiceLoader or explicit factories, and tests. The pipeline should have a clear input object, processing contract, output object, and registration mechanism so new processors can be added deliberately.\n\n**Completion checks:**\n- Interface and implementation roles are separate.\n- Adding a new processor does not require rewriting the core loop.\n- The work explains why this is not just inheritance for its own sake."
				}
			]
		},
		"java-without-graphics": {
			title: "Java Without Graphics: Application Services Track",
			curriculum: [
				{
					title: "Service-First Scope",
					content:
						"**Learning sequence:** This track keeps the UI minimal and puts effort into model-layer design, command-line workflows, file I/O, validation, tests, and maintainable package boundaries. It is a better fit when the goal is backend, tools, data processing, or AP-plus Java depth.\n\n**Completion check:** The visible behavior can be tested without clicking through a graphical interface."
				},
				{
					title: "Persistence and Validation",
					content:
						"**Learning sequence:** Use records/classes for data, services for behavior, repositories or loaders for persistence, and tests for expected behavior. Keep validation close to input boundaries so the rest of the program can rely on cleaner data.\n\n**Completion check:** The same model can be exercised by tests, a CLI, or a later UI without duplicating business logic."
				}
			],
			supplementalProjects: [
				{
					title: "No-Graphics Java Project: CLI Inventory Service",
					content:
						"**Project goal:** Build a command-line inventory or library manager with records/classes, validation, file persistence, and tests. The CLI should be a thin shell over a testable model/service layer, not the place where all state and business rules are hidden.\n\n**Completion checks:**\n- Add, update, search, save, and load paths are covered.\n- Invalid commands and malformed saved data have defined outcomes.\n- The model layer can be tested without terminal input."
				},
				{
					title: "No-Graphics Java Project: Batch Report Tool",
					content:
						"**Project goal:** Read one or more local files, validate records, compute summaries, and write a compact report. The report should include both successful results and warnings so data-quality problems are visible instead of silently skipped.\n\n**Completion checks:**\n- Empty and malformed files are handled.\n- The report includes counts, warnings, and at least one derived metric.\n- Tests use deterministic fixtures instead of depending on manual input."
				}
			]
		},
		"java-with-graphics": {
			title: "Java With Graphics: JavaFX Application Track",
			curriculum: [
				{
					title: "UI Scope",
					content:
						"**Learning sequence:** This track keeps shared Java fundamentals intact, then adds JavaFX scenes, controls, layout, events, observable state, background work boundaries, and persistence. Graphics are used to practice architecture and feedback loops, not to avoid core Java design.\n\n**Completion check:** UI code delegates meaningful behavior to model or service classes that can be tested separately."
				},
				{
					title: "Event-driven State",
					content:
						"**Learning sequence:** Treat each user action as a state transition. Define the starting state, user event, model change, rendered result, and error/empty state before adding visual polish. This keeps JavaFX work from becoming disconnected button wiring and makes it possible to test model behavior outside the view.\n\n**Completion check:** A normal click path, an empty/invalid path, and one persistence or refresh path are verified."
				}
			],
			supplementalProjects: [
				{
					title: "Graphics Java Project: JavaFX Tracker",
					content:
						"**Project goal:** Build a JavaFX task, habit, or inventory tracker backed by a model layer and local persistence. The interface should show state clearly, while validation, saving, filtering, and updates remain in code that can be reasoned about separately from layout.\n\n**Completion checks:**\n- Add, edit, delete, filter, and empty-state behavior are visible.\n- Model logic is separated from controller/view code.\n- Saved data reloads correctly after restart."
				},
				{
					title: "Graphics Java Project: Event-driven Simulation",
					content:
						"**Project goal:** Build a small JavaFX simulation where controls change model state and the view updates predictably. The simulation should make the model's rules observable through the UI while still keeping the rules in ordinary Java classes.\n\n**Completion checks:**\n- The simulation has pause/reset or equivalent state controls.\n- Invalid or extreme values are handled visibly.\n- The final note explains the event-to-state-to-render path."
				}
			]
		}
	} as const;

	const track = tracks[courseId as keyof typeof tracks];
	if (!track) return;

	appendModule(course, {
		title: track.title,
		curriculum: [...track.curriculum],
		supplementalProjects: [...track.supplementalProjects]
	});
}

function addCppThreeCourseSpineModule(courseId: string, course: RawCourse) {
	if (!["c-level-1", "cpp-level-2", "cpp-level-3"].includes(courseId)) {
		return;
	}

	const levelFocus: Record<string, string[]> = {
		"c-level-1": [
			"C++ reset and functions: compilation model, headers/source files, const/reference basics, function design.",
			"Strings, vectors, structs, safe iteration, and raw arrays only as contrast.",
			"Classes, representation invariants, composition, enums, and file I/O.",
			"Recursion fundamentals and small multi-file projects."
		],
		"cpp-level-2": [
			"Object lifetime, destructors, copy/move intuition, Rule of Zero, and why copy-control exists.",
			"Pointers, raw arrays, pointer decay, dynamic memory, shallow/deep copy, and manual dynamic arrays.",
			"RAII, unique_ptr/shared_ptr/weak_ptr, ownership graphs, and exception-safe cleanup.",
			"STL containers, iterators, algorithms, lambdas, span, and recursive data structures."
		],
		"cpp-level-3": [
			"Function and class templates, light concepts/constraints, and reusable utilities.",
			"Operator overloading for conventional value-like types.",
			"Pure abstract interfaces, virtual destructors, dynamic dispatch, composition vs inheritance, and slicing avoidance.",
			"State machines, command objects, undo/redo, parsers, ASTs, malformed input, and serialization round trips."
		]
	};

	appendModule(course, {
		title: "Modern Three-Course C++ Spine",
		curriculum: [
			{
				title: "Level-Specific Focus",
				content: [
					"**Learning sequence:** Use this spine to keep the three C++ courses from collapsing into one oversized repo. Each level should have a distinct language and design responsibility.",
					`**Focus:**\n${bullets(levelFocus[courseId])}`,
					"**Completion check:** The work demonstrates the ability to explain which C++ level owns the next concept and why it is not being moved into DS&A, C Systems, or AI/ML."
				].join("\n\n")
			},
			{
				title: "Testing and Build Bar",
				content:
					"**Learning sequence:** Multi-file assignments should use CMake or a documented Makefile, out-of-source or clean build guidance, warning-clean builds, and a test target or explicit run script. Manual-memory work should include sanitizer or Valgrind-style evidence when available. Build tooling is part of the course because it teaches how source files, headers, warnings, and tests become one reproducible program.\n\n**Completion check:** A fresh checkout has a repeatable build/run/test path."
			},
			{
				title: "Manual Memory Safety Rule",
				content:
					"**Learning sequence:** Raw arrays and explicit new/delete are controlled contrast points, then the course returns to RAII, vector/array/span, and smart-pointer ownership. Do not normalize hidden ownership in raw pointers. Manual memory work should make allocation, ownership transfer, copy behavior, and cleanup visible before safer abstractions are reintroduced.\n\n**Completion check:** The work demonstrates the ability to draw ownership and cleanup responsibility before implementing pointer-heavy code."
			},
			{
				title: "Branch-Course Readiness",
				content:
					"**Readiness check:** DS&A should follow Level 2 readiness; C Systems, Assembly, Design Patterns, and Low-Level Security should assume Level 3-style architecture and ownership discipline unless course placement explicitly accelerates the path. Branch placement should be based on evidence from code, diagrams, and explanation rather than course completion labels alone.\n\n**Evidence of proficiency:** The work demonstrates the ability to use containers, reason about lifetime, trace recursion, and explain an interface or parser boundary."
			}
		],
		supplementalProjects: [
			{
				title: "C++ Spine Project: Build-Test Harness",
				content:
					"**Project goal:** Add a repeatable build and test harness to one C++ project. The harness should reduce ambiguity: one command builds, one command runs a normal case, and one command runs tests or edge-case checks. For manual-memory or parser work, include sanitizer output or a deliberately failing input when the local toolchain supports it.\n\n**Completion checks:**\n- The README names build/run/test commands.\n- At least one edge case is tested.\n- The work demonstrates the ability to explain what the compiler or sanitizer is checking.\n- A fresh checkout can reproduce the same result without relying on hidden IDE state."
			},
			{
				title: "C++ Spine Project: Ownership and Interface Review",
				content:
					"**Project goal:** Review one project for ownership, copying, interfaces, and source organization. The review should identify where data is created, who owns it, who may mutate it, what happens on copy or move, and which public methods must preserve representation invariants.\n\n**Completion checks:**\n- Owning and non-owning references are identified.\n- At least one interface or class invariant is documented.\n- The review names one concrete refactor.\n- The refactor improves lifetime clarity, testability, or module boundaries rather than only changing style."
			}
		]
	});
}

function addSystemsSpecificSafetyModule(courseId: string, course: RawCourse) {
	const rows: Record<
		string,
		{ environment: string[]; prohibited: string[]; project: string }
	> = {
		"linux-systems": {
			environment: [
				"Ubuntu/Debian VM or rootless container baseline.",
				"systemd/journald, permissions, mounts, processes, logs, nftables, AppArmor/SELinux exposure where appropriate.",
				"Snapshots or documented undo path before privilege, firewall, or service changes."
			],
			prohibited: [
				"Privilege escalation on shared or third-party systems.",
				"Sniffing real non-lab traffic.",
				"Disabling host protections outside a VM or without rollback."
			],
			project:
				"Build and harden a small Linux service host with journald logs, firewall rules, backup/restore notes, and a five-minute demo."
		},
		"network-systems": {
			environment: [
				"Namespace, VM, host-only, or user-NAT lab networks only.",
				"Wireshark/tcpdump, ip/ss, DNS, TCP/IP, IPv6, routing, and failure injection.",
				"Provided or owned packet captures."
			],
			prohibited: [
				"Scanning public IP ranges.",
				"Packet injection or capture on non-lab networks.",
				"Bridged labs touching school, employer, or ISP infrastructure."
			],
			project:
				"Build a small routed lab topology with IPv4/IPv6 addressing, DNS, packet traces, and two injected troubleshooting failures."
		},
		"network-security": {
			environment: [
				"Owned lab hosts, sample PCAPs, toy services, Zeek/Suricata-style analysis, TLS/certificate exercises on controlled domains or local CAs.",
				"Threat model and monitoring objectives before tooling.",
				"Alert triage reports with defensive recommendations."
			],
			prohibited: [
				"Phishing, credential collection, unauthorized scanning, or real-system testing.",
				"Testing systems without written authorization.",
				"Public exploit steps detached from remediation."
			],
			project:
				"Create a passive monitoring and remediation plan for a toy network, including TLS validation, detections, triage, and hardening steps."
		},
		"c-systems-engineering": {
			environment: [
				"Local C build with warnings, make/CMake, debugger, sanitizers, and POSIX-style references where available.",
				"File/process/thread/socket labs stay local or namespace-only.",
				"Malformed input fixtures included before parser work."
			],
			prohibited: [
				"setuid deliverables, kernel modules, raw-socket host networking, or unsafe host modifications.",
				"Suppressing test or sanitizer failures to pass CI.",
				"Using production data or services."
			],
			project:
				"Ship a robust local C utility or daemon with tests, sanitizer evidence, error-handling notes, and reproducible build instructions."
		},
		assembly: {
			environment: [
				"Single target architecture and calling convention per module.",
				"GDB/LLDB, objdump/readelf or equivalent, and C harnesses for callable routines.",
				"Compiler-output reading used as a bridge from C/C++ to machine behavior."
			],
			prohibited: [
				"Shellcode, droppers, packers, exploit payloads, or malware-like loaders.",
				"Host-privileged binaries.",
				"Obfuscation/evasion artifacts."
			],
			project:
				"Implement and test small assembly routines callable from C, with ABI checklist, trace evidence, and benchmark notes."
		},
		"low-level-security": {
			environment: [
				"Toy binaries, toy parsers, sanitizers, debugger, libFuzzer/AFL-style fixtures, and snapshots.",
				"Crash triage leads to patch and regression test.",
				"Mitigation discussion stays tied to defensive hardening."
			],
			prohibited: [
				"Third-party targets, exploit chaining, persistence, credential theft, or public PoC release.",
				"Binary-only third-party reverse engineering unless explicitly licensed and provided.",
				"Any work outside the toy/lab scope."
			],
			project:
				"Analyze a deliberately buggy parser, reproduce a crash locally, patch root cause, add regression/fuzz evidence, and write a disclosure-style note."
		},
		"low-level-security-part-2": {
			environment: [
				"Longer fuzzing campaigns on larger toy codebases.",
				"Crash deduplication, exploitability-vs-crash analysis, patch series, and regression CI.",
				"Maintainer-style advisory writing."
			],
			prohibited: [
				"All Low-Level Security prohibitions.",
				"Weaponized exploit chains or public PoC release.",
				"Testing real software or services without explicit separate authorization."
			],
			project:
				"Run a fuzzing/hardening cycle, cluster crashes, patch highest-priority issue, and publish a maintainer-style remediation package."
		},
		"rust-systems-security": {
			environment: [
				"Stable Rust with Cargo, Clippy, tests, cargo audit, Miri where appropriate, cargo fuzz for parser surfaces, and FFI only in scoped labs.",
				"Unsafe blocks require written invariants.",
				"Redesign unsafe C surfaces into safer Rust components."
			],
			prohibited: [
				"Offensive tool development, stealth or persistence features, dangerous FFI wrappers to subvert host protections.",
				"Dependency tampering outside toy repositories.",
				"Networked security tooling that leaves local lab scope."
			],
			project:
				"Rewrite a toy C parser or library surface in Rust behind the same interface, document unsafe boundaries, and add audit/lint/fuzz evidence."
		}
	};
	const config = rows[courseId];
	if (!config) return;
	const courseLabel = course.name.trim() || courseId;

	appendModule(course, {
		title: `${courseLabel}: Defensive Lab Contract`,
		curriculum: [
			{
				title: `${courseLabel} Environment and Tooling Baseline`,
				content: [
					`**Concept path:** Use this ${courseLabel} baseline before starting systems or security work. Setup is part of the lesson because drift or unsafe host assumptions can invalidate the lab.`,
					`**Environment:**\n${bullets(config.environment)}`,
					"**Completion check:** The work demonstrates the ability to name the lab boundary, setup path, and recovery method."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Prohibited Activity`,
				content: [
					`**Safety boundary:** These activities are outside ${courseLabel} scope even if they are technically possible.`,
					`**Do not do:**\n${bullets(config.prohibited)}`,
					"**Completion check:** Any ambiguous target or action is paused until scope is narrowed."
				].join("\n\n")
			},
			{
				title: `${courseLabel} Signature Project`,
				content: `**Project goal:** ${config.project} The signature project should combine setup, observation, interpretation, and remediation rather than ending at a tool output. The final artifact should make the environment, evidence, limitation, and defensive value clear enough to inspect later.\n\n**Completion checks:**\n- Scope and authorization are explicit.\n- Setup and reset instructions are documented.\n- Evidence leads to a defensive fix, monitoring improvement, or hardening recommendation.`
			},
			{
				title: `${courseLabel} Evidence Rubric`,
				content: `**Readiness check:** Evaluate ${courseLabel} systems/security work on correctness, scope discipline, reproducibility, evidence quality, remediation, and communication. Raw cleverness does not compensate for unsafe scope or missing mitigation.\n\n**Evidence of proficiency:** The work demonstrates the ability to show what happened, why it mattered, how it was fixed or constrained, and how the result was verified.`
			}
		],
		supplementalProjects: [
			{
				title: `${courseLabel} Defensive Lab: Scope and Reset Drill`,
				content: `**Project goal:** Before a lab for ${courseLabel} begins, write the scope, allowed tools, stop conditions, expected evidence, and reset path. The drill should be specific enough that the lab can be repeated safely and stopped cleanly if the result is unexpected.\n\n**Required fields:** lab boundary, allowed target, allowed tools, evidence to collect, stop condition, reset command or recovery step, and one disallowed action.\n\n**Completion checks:**\n- Scope is local and owned.\n- Reset path is specific.\n- Disallowed actions are named.\n- The expected evidence is tied to the toolchain.`
			},
			{
				title: `${courseLabel} Defensive Lab: Evidence-to-Remediation Report`,
				content: `**Project goal:** Convert one ${courseLabel} lab observation into a short remediation report. The report separates what was observed from why it matters, then describes a fix or hardening step that can be tested.\n\n**Required fields:** observation, reproduction evidence, impact, remediation, verification step, prevention or monitoring note, and one remaining limitation.\n\n**Completion checks:**\n- Observation and impact are separated.\n- Fix or hardening step is testable.\n- The report includes prevention or monitoring guidance.\n- Verification evidence is specific enough to reproduce the finding.`
			}
		]
	});
}

function addUnityFullProjectWorkflowModules(
	courseId: string,
	course: RawCourse
) {
	if (courseId !== "unity-game-development") return;

	appendModule(course, {
		title: "UGD7 Testing, Profiling, Builds, CI, and Asset Pipeline",
		curriculum: [
			{
				title: "Unity Test Framework",
				content:
					"**Learning sequence:** Add Edit Mode tests for logic and Play Mode smoke tests for scene boot. Tests should prove score rules, state transitions, and scene loading before the capstone is considered complete.\n\n**Completion check:** The course makes it possible to run the smallest test set and identify whether failure is code, scene wiring, package setup, or build configuration."
			},
			{
				title: "Build Profiles and Deployment",
				content:
					"**Learning sequence:** Use Build Profiles for desktop and optional Web builds. Build configuration is a repeatable artifact, not a final-session surprise. A build profile records scenes, target platform, settings, and output expectations so the same project can be tested outside the editor.\n\n**Completion check:** The work demonstrates the ability to create a local build, record the Unity editor version, and explain the target platform."
			},
			{
				title: "Git LFS and Asset Attribution",
				content:
					"**Learning sequence:** Track source binaries and large media with Git LFS, commit package manifests/locks, and maintain `THIRD_PARTY_ASSETS.md` with source, license, date imported, modification note, and first branch/tag. Asset provenance is part of the build system because missing media or unclear licenses can make an otherwise working project impossible to share.\n\n**Completion check:** A clean clone has scripts, package locks, and asset provenance."
			},
			{
				title: "Profiling and Bug Bash",
				content:
					"**Learning sequence:** Profile only concrete issues: scene boot, excessive spawning, expensive update loops, or memory-heavy assets. Keep a bug bash log with reproduction, fix, and retest. The bug bash should distinguish measured performance problems from subjective polish requests so fixes are based on evidence.\n\n**Completion check:** The work demonstrates the ability to describe one measured issue and one verified fix."
			}
		],
		supplementalProjects: [
			{
				title: "UGD7 Project 1: Test and Build Gate",
				content:
					"**Project goal:** Add one Edit Mode test, one Play Mode smoke test, and one local build profile to an existing Unity project. The gate should prove that logic, scene boot, and build configuration are all inspectable before more content is added.\n\n**Completion checks:**\n- Tests run from a documented path.\n- Build profile is named.\n- A failure mode and recovery step are recorded."
			},
			{
				title: "UGD7 Project 2: Asset Pipeline Review",
				content:
					"**Project goal:** Audit project assets for provenance, Git LFS needs, package lock status, and attribution completeness before a Unity project is treated as ready to share or rebuild from a clean clone.\n\n**Required fields:** asset name, source or author, license, date imported, modification note, whether the asset belongs in Git LFS, package or dependency version, and any file intentionally excluded from the repo.\n\n**Completion checks:**\n- Attribution file is present.\n- Large source binaries are tracked or intentionally excluded.\n- Package versions are reproducible.\n- A clean-clone note explains how another machine can restore the same project state."
			}
		]
	});

	appendModule(course, {
		title: "UGD8 Full-Project Starter and Review Repository Plan",
		curriculum: [
			{
				title: "Repository Shape",
				content:
					"**Learning sequence:** Unity modules should move toward full starter and review project repositories or tags instead of script-only snapshots. Preserve the stable course ID `unity-game-development`; the current full-project baseline is linked from this module and is the standard shape for later full-project checkpoints.\n\n**Completion check:** The linked starter state can be cloned, opened, played, tested, and built."
			},
			{
				title: "Starter and Review Tag Model",
				content:
					"**Learning sequence:** Use module tags such as `m01-start`, `m01-checkpoint`, and `m01-review` in starter and review repos. Separate starter, checkpoint, and completed states so the project history stays easy to inspect. Tags should represent meaningful course states, not arbitrary backups, because they become the reference points for review, recovery, and future course updates.\n\n**Completion check:** The course makes it possible to compare starter and completed states without guessing which folder is current."
			},
			{
				title: "Capstone Options",
				content:
					"**Project goal:** Capstone options should stay small and finishable: Relic Runner platformer, Robot Repair top-down adventure, or Arena Alchemist survival loop. Each must include start, play, failure or win, restart, build, attribution, and demo.\n\n**Completion checks:**\n- Scope is small enough for a vertical slice.\n- The project has a test or smoke-check path.\n- The final demo explains architecture and one hard bug."
			},
			{
				title: "Session Workflow",
				content:
					"**Learning sequence:** Use a weekly loop: prework, guided live build, independent implementation on screen, tagged checkpoint or pull request, rubric review, and reflection note. The loop keeps Unity work from turning into an untracked editor session by preserving evidence of what changed and what should happen next.\n\n**Completion check:** Every session produces a visible checkpoint and next action."
			}
		],
		supplementalProjects: [
			{
				title: "UGD8 Project 1: Starter Repo Specification",
				content:
					"**Project goal:** Inspect and extend the full starter project baseline for one Unity module: scenes, scripts, prefabs, tests, packages, project settings, docs, LFS rules, and attribution file. The specification should define what belongs in the starter state, what belongs only in the review state, and how the project proves it can be opened from a clean clone.\n\n**Completion checks:**\n- The starter state is cloneable and playable.\n- Completed review work is not included in the starter state.\n- Validation steps are documented.",
				projectLink: repoFolderUrl(
					courseId,
					"UGD-full-project-starter"
				),
				solutionLink: repoFolderUrl(
					courseId,
					"UGD-full-project-solution"
				)
			},
			{
				title: "UGD8 Project 2: Capstone Milestone Plan",
				content:
					"**Project goal:** Use the linked full-project baseline to write a capstone milestone plan from prototype to vertical slice, alpha, beta, final build, and demo. The plan should identify what is playable at each milestone, what can be cut safely, and which validation steps prevent late surprises.\n\n**Completion checks:**\n- Every milestone has a playable outcome.\n- Scope cuts are identified.\n- Testing/build/attribution tasks are scheduled before the final week.",
				projectLink: repoFolderUrl(
					courseId,
					"UGD-full-project-starter"
				),
				solutionLink: repoFolderUrl(
					courseId,
					"UGD-full-project-solution"
				)
			}
		]
	});
}

function backfillReferenceSolutionLinks(courseId: string, course: RawCourse) {
	if (!courseImplementationSourceRepos[courseId]) return;

	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			if (
				item.projectLink?.includes(
					"github.com/instruction-material/"
				) &&
				!item.solutionLink
			) {
				item.solutionLink = item.projectLink;
			}
		}
	}
}

function supplementalProjectFor(
	module: RawCourseModule,
	next: number
): RawCourseModuleItem {
	if (next === 1) {
		return {
			title: `${module.title}: Focused Practice`,
			content: `**Project goal:** Add a focused practice checkpoint for ${module.title}. Complete one direct example, one slightly changed example, and one written explanation of the main idea. Use the result as a quick readiness signal before moving into the larger module project.\n\n**Completion checks:**\n- The prerequisite concept is stated clearly.\n- The normal case is completed independently.\n- The explanation identifies one likely misconception or edge case.`
		};
	}

	const variant = stableVariantIndex(`${module.title}|${next}`, 5);
	const content = [
		`**Project goal:** Extend ${module.title} into a new context that changes the input, representation, or design constraint from the lesson example. State the changed requirement first, then build or solve a small version before completing the full variation.\n\n**Work sequence:**\n1. Identify the original idea being transferred.\n2. Name the one constraint, input shape, representation, or success condition that changed.\n3. Complete a normal case, then test an awkward or boundary case that the original example did not cover.\n4. Write a short reflection explaining what stayed the same, what had to change, and how the result proves the concept still works.\n\n**Completion checks:**\n- The changed constraint is explicit.\n- The work includes both a normal case and an awkward case.\n- The final reflection names the transferred concept and the adaptation that made it work.`,
		`**Project goal:** Apply ${module.title} to a nearby but different problem. Keep the same core idea, then change one important condition so the work proves transfer rather than repetition.\n\n**Work sequence:**\n1. State the original concept in one sentence.\n2. Define the changed input, representation, rule, data shape, or success condition.\n3. Build the smallest version that can be checked by hand, then expand to the full challenge.\n4. Record which part of the original strategy still worked and which part had to be revised.\n\n**Completion checks:**\n- The transfer target is different from the lesson example.\n- A normal case and a boundary or awkward case are both checked.\n- The reflection explains the adaptation, not just the final answer.`,
		`**Project goal:** Turn ${module.title} into an applied challenge with a new constraint. The result should show that the module idea survives changed data, changed rules, or a different artifact shape.\n\n**Work sequence:**\n1. Choose the concept from the module that should carry over.\n2. Write the new constraint and predict what it changes.\n3. Complete one traceable case before the full version.\n4. Compare the finished result with the original example and name the design or reasoning change.\n\n**Completion checks:**\n- The new constraint is stated before implementation or solving begins.\n- The work includes evidence from a traceable case and a nontrivial case.\n- The final note names what transferred cleanly and what required a redesign.`,
		`**Project goal:** Create a variation of ${module.title} that changes the context while preserving the main skill. The challenge should be small enough to finish, but different enough that copying the original pattern without thought would fail.\n\n**Work sequence:**\n1. Identify the reusable strategy, formula, model, API, or algorithmic idea.\n2. Change one requirement such as input source, output format, edge case, representation, or interaction rule.\n3. Test the variation with an ordinary case and a case chosen to expose the changed requirement.\n4. Explain why the final result still demonstrates the module concept.\n\n**Completion checks:**\n- The changed requirement affects the implementation or reasoning.\n- The verification includes a case the original example did not cover.\n- The explanation connects the variation back to the module skill.`,
		`**Project goal:** Use ${module.title} in a transfer task that asks for a fresh decision. The work should preserve the core concept while changing enough context to require planning, testing, and explanation.\n\n**Work sequence:**\n1. Write the module idea that should remain true.\n2. Choose a changed assumption, input shape, object relationship, resource limit, or communication format.\n3. Build or solve a minimal case, then test one awkward case before polishing.\n4. Summarize the evidence that the concept works under the changed condition.\n\n**Completion checks:**\n- The task has a visible or inspectable result.\n- The test or explanation covers both ordinary behavior and the changed condition.\n- The final note names the transferred concept and the evidence that supports it.`
	][variant];

	return {
		title: `${module.title}: Applied Challenge`,
		content
	};
}

function ensureSupplementalProjectFloor(course: RawCourse) {
	for (const module of course.modules) {
		while (module.supplementalProjects.length < 2) {
			module.supplementalProjects.push(
				supplementalProjectFor(
					module,
					module.supplementalProjects.length + 1
				)
			);
		}
	}
}

export function applyCourseImplementationArtifacts(
	courseId: string,
	course: RawCourse
) {
	const isAuthoredLearnerCourse = authoredLearnerCourseIds.has(courseId);

	setCourseDevelopmentMetadata(courseId, course);
	addAlgebraSupplementalProjects(courseId, course);
	if (!isAuthoredLearnerCourse) {
		addScienceResourceModule(courseId, course);
	}
	addAlgebraTaxonomyModule(courseId, course);
	addAlgebraStandardsArchitectureModule(courseId, course);
	addElementaryScienceDecision(courseId, course);
	addScienceGradeBandScopeModule(courseId, course);
	addUnityRebuildModules(courseId, course);
	addUnityFullProjectWorkflowModules(courseId, course);
	addCppMatrixModule(courseId, course);
	addCppThreeCourseSpineModule(courseId, course);
	addApCsaAlignmentModule(courseId, course);
	addDataCatalogModule(courseId, course);
	addDataAiMlBoundaryModule(courseId, course);
	addAdvancedPythonStudioModule(courseId, course);
	addJavaBridgeModernModule(courseId, course);
	addSecurityPolicyModule(courseId, course);
	addSystemsSpecificSafetyModule(courseId, course);
	addToolchainAssumptionsModule(courseId, course);
	backfillReferenceSolutionLinks(courseId, course);
	ensureSupplementalProjectFloor(course);
}
