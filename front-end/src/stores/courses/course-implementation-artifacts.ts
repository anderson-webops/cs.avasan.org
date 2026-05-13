import type { RawCourse, RawCourseModule, RawCourseModuleItem } from "./types";
import { researchBackedExpansionProfiles } from "./research-expansions";

const INSTRUCTION_MATERIAL_URL = "https://github.com/instruction-material";

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

const scienceResourceBanks: Record<string, string[]> = {
	"elementary-science": [
		"NGSS elementary performance expectations and appendices for grade-band scope.",
		"PhET elementary-friendly simulations for forces, matter, sound, light, and simple systems.",
		"NASA, NOAA, and USGS images or maps for weather, Earth materials, space, and environmental observations.",
		"Teacher-provided image cards and data tables for sorting, graphing, and CER-lite responses."
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
		"Periodic table and reaction datasets supplied by the tutor rather than gathered from household chemicals.",
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

const apCsaUnitMap = [
	"Unit 1 Primitive Types: APCS1, APCS2, and early variable/operator check-ins.",
	"Unit 2 Using Objects: strings, Scanner input, Math, wrapper objects, and object references.",
	"Unit 3 Boolean Expressions and if Statements: APCS3 and Check-In #1 conditionals.",
	"Unit 4 Iteration: APCS4, loop tracing, nested loops, and FizzBuzz-style remediation.",
	"Unit 5 Writing Classes: APCS5, APCS6, encapsulation, constructors, accessors, and modifiers.",
	"Unit 6 Array: APCS10 traversal, mutation, algorithms, and tracing.",
	"Unit 7 ArrayList: APCS11 list traversal, insert/remove reasoning, and wrapper-class interactions.",
	"Unit 8 2D Array: APCS10 2D array projects and row/column boundary checks.",
	"Unit 9 Inheritance: APCS7, APCS8, polymorphism, abstract reasoning, and method dispatch.",
	"Unit 10 Recursion: APCS15, recursive tracing, stack frames, and termination."
];

const cppConceptMatrix = [
	"Original Level 1 baseline: variables, I/O, loops, functions, classes, vectors, references, 2D vectors, and state-machine project work.",
	"Level 2 bridge: pointers, addresses, raw arrays, pointer arithmetic, 2D arrays, dynamic memory, custom dynamic arrays, matrix classes, and ownership reflection.",
	"Level 3 CS235/CS236-inspired expansion: command architecture, file persistence, scanners/parsers, recursion, STL containers, relation-style views, RAII, templates, interfaces, and state-machine architecture.",
	"DS&A follow-up boundary: linked structures, trees, heaps, hashing, graph algorithms, dynamic programming, and complexity-first implementation.",
	"Explicit exclusion: AI and ML concepts stay in AI/Data Science/Machine Learning courses rather than the C++ pathway."
];

const securityPolicy = [
	"All security labs must use owned local fixtures, intentionally vulnerable toy apps, provided packet captures, or instructor-approved lab VMs.",
	"Every lab starts with scope, authorization, target, allowed tools, and stop conditions.",
	"Every finding is written as evidence plus impact, followed by defensive remediation, detection, or hardening.",
	"Students do not scan, probe, exploit, or collect data from third-party systems.",
	"Low-level exercises use sanitizers, fuzzers, and toy parsers to teach memory risk without weaponized targets."
];

function repoUrl(courseId: string) {
	const repo = courseImplementationSourceRepos[courseId];
	return repo ? `${INSTRUCTION_MATERIAL_URL}/${repo}` : undefined;
}

function repoTreeUrl(courseId: string) {
	const repo = courseImplementationSourceRepos[courseId];
	return repo ? `${INSTRUCTION_MATERIAL_URL}/${repo}/tree/main` : undefined;
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

function profileFor(courseId: string) {
	return researchBackedExpansionProfiles[courseId];
}

function addAlgebraSupplementalProjects(courseId: string, course: RawCourse) {
	if (!courseId.startsWith("algebra-")) return;

	for (const module of course.modules) {
		while (module.supplementalProjects.length < 2) {
			const next = module.supplementalProjects.length + 1;
			const title =
				next === 1
					? `${module.title}: Standards Practice Set`
					: `${module.title}: Modeling or Error-Analysis Project`;
			const content =
				next === 1
					? `**Project goal:** Convert ${module.title} into a short standards-aligned practice set. Include one worked example, three independent problems, one graph/table/verbal representation where appropriate, and one explain-your-reasoning prompt.\n\n**Completion checks:**\n- The student shows every algebraic step.\n- At least one problem asks for a reason, not just an answer.\n- The tutor records one misconception to review before the next module.`
					: `**Project goal:** Apply ${module.title} in a modeling, graphing, or error-analysis context. The student should interpret a situation, choose a representation, solve, and explain whether the answer makes sense.\n\n**Completion checks:**\n- The project contains a concrete scenario or flawed worked solution.\n- The student explains the choice of equation, graph, or table.\n- The final answer includes a units/context check or corrected error statement.`;

			module.supplementalProjects.push(projectItem(title, content));
		}
	}
}

function addFullLessonAuthoringPack(courseId: string, course: RawCourse) {
	const profile = profileFor(courseId);
	if (!profile) return;

	appendModule(course, {
		title: `${profile.family}: Full Lesson Authoring Pack`,
		curriculum: [
			{
				title: "Lesson 1: Concept Setup and First Worked Example",
				content: [
					`**Teaching flow:** Start the first full lesson by naming the exact ${profile.family} concept and connecting it to a concrete artifact. Use one item from the topic backlog as the focus, define the vocabulary, then work through a small example slowly enough that the student can predict the next step before seeing it.`,
					`**Concept pool:**\n${bullets(profile.topics.slice(0, 4))}`,
					"**Exit check:** The student can restate the concept, identify the input or evidence being used, and explain the first worked example without copying the wording."
				].join("\n\n")
			},
			{
				title: "Lesson 2: Guided Practice, Misconceptions, and Vocabulary",
				content: [
					`**Teaching flow:** Turn the worked example into guided practice. Ask the student to complete the next step, name why that step is valid, and compare it to a common mistake. Keep the misconception check discipline-specific instead of generic.`,
					`**Misconception targets:**\n${bullets(profile.gaps.slice(0, 3))}`,
					"**Exit check:** The student fixes one flawed example and explains the correction."
				].join("\n\n")
			},
			{
				title: "Lesson 3: Independent Transfer and Edge Cases",
				content: [
					`**Teaching flow:** Give the student a new but nearby task that uses the same idea with a changed constraint. This is the point where a tutor should stop demonstrating and require the student to plan, attempt, test, and revise.`,
					`**Transfer options:**\n${bullets(profile.projectTypes.slice(0, 4))}`,
					"**Exit check:** The student handles one normal case and one boundary, edge, or changed-condition case."
				].join("\n\n")
			},
			{
				title: "Lesson 4: Project Review, Reflection, and Next Step",
				content: [
					`**Teaching flow:** End the lesson sequence with a review of the artifact, not a vague recap. Ask what worked, what failed, what evidence proves the result, and what next module should build on this work.`,
					`**Assessment options:**\n${bullets(profile.assessments.slice(0, 4))}`,
					"**Exit check:** The student submits or presents a short reflection naming the goal, evidence, bug or misconception, and next improvement."
				].join("\n\n")
			}
		],
		supplementalProjects: [
			{
				title: "Full Lesson Project: Tutor-Ready Worked Example",
				content:
					"**Project goal:** Write one tutor-ready worked example for this course family. Include the prompt, expected student prediction, solution steps, common wrong turn, and a short check for understanding.\n\n**Completion checks:**\n- The example is small enough to teach live.\n- The explanation includes why each step is valid.\n- The worked example leads naturally into one project or transfer task."
			},
			{
				title: "Full Lesson Project: Student Transfer Task",
				content:
					"**Project goal:** Create a nearby transfer task that changes one constraint from the worked example. The task should require the same core concept but prevent rote copying.\n\n**Completion checks:**\n- The changed constraint is explicit.\n- The task has normal and edge-case expectations.\n- The student must explain the answer, artifact, or model."
			}
		]
	});
}

function addSourceParityModule(courseId: string, course: RawCourse) {
	const url = repoUrl(courseId);
	if (!url) return;

	appendModule(course, {
		title: "Source and Asset Parity Implementation",
		curriculum: [
			{
				title: "Canonical Source Repository",
				content: [
					`**Teaching flow:** Use the instruction-material repository as the canonical source for starter files, solutions, and project assets. Every new project should be added here first, then linked from the course catalog after the starter and solution states are clear.`,
					`**Canonical repo:** ${url}`,
					"**Exit check:** A project is link-ready only when the starter, solution, README or instructions, and expected tests/assets are all identifiable."
				].join("\n\n"),
				projectLink: repoTreeUrl(courseId)
			},
			{
				title: "Parity Rules for Future Projects",
				content:
					"**Teaching flow:** Treat source parity as a release gate. Starter folders should contain only what a student should receive; solution folders should represent one complete reference path; supplemental variants should be named consistently with the course/module prefix.\n\n**Completion checks:**\n- Every catalog project has a source folder or explicit no-code exception.\n- Every solution link points to a dedicated solution or complete reference folder.\n- Legacy, duplicate, or archive-only folders are not linked as active work without a note."
			},
			{
				title: "Local Audit Requirement",
				content:
					"**Teaching flow:** Run the local source parity artifact generator after adding or renaming project folders. The generated `no-include` report should be reviewed before committing catalog links.\n\n**Exit check:** The report lists linked folders, unlinked top-level folders, project-link counts, solution-link counts, and any missing local root."
			},
			{
				title: "Maintenance Contract",
				content:
					"**Teaching flow:** Keep course text, source repos, and public GitHub links synchronized. If a project moves, update the source repo first, then course links, then the parity artifact.\n\n**Exit check:** A future tutor can open the course, click the project, identify the starter state, and compare against the solution without guessing which folder is current."
			}
		],
		supplementalProjects: [
			{
				title: "Parity Project: Starter/Solution Link Review",
				content:
					"**Project goal:** Pick three active projects and verify that each has a starter or base folder, a solution or reference folder when appropriate, and course text that names the expected deliverable.\n\n**Completion checks:**\n- Broken links are recorded.\n- Archive-only folders are not treated as active starters.\n- Any missing solution is marked as intentionally absent or added to the remediation list.",
				projectLink: repoTreeUrl(courseId)
			},
			{
				title: "Parity Project: Legacy Folder Triage",
				content:
					"**Project goal:** Review unlinked top-level folders from the parity report and classify them as active project, supplemental project, reference-only, duplicate, archive, or delete candidate.\n\n**Completion checks:**\n- Every unlinked folder has a classification.\n- Active folders receive a planned module/project placement.\n- Duplicates and archive shadows are not linked back into the active catalog accidentally.",
				projectLink: repoTreeUrl(courseId)
			}
		]
	});
}

function addScienceResourceModule(courseId: string, course: RawCourse) {
	const resources = scienceResourceBanks[courseId];
	if (!resources) return;

	appendModule(course, {
		title: "Science Resource Shortlist and Remote Lab Bank",
		curriculum: [
			{
				title: "Curated Remote Resource Bank",
				content: [
					"**Remote investigation:** Use shared-screen simulations, public images, provided datasets, diagrams, and paper notes. Do not require household materials, lab kits, heat, chemicals, electricity components, or outdoor data collection.",
					`**Resource shortlist:**\n${bullets(resources)}`,
					"**Exit check:** Every investigation should name the phenomenon, the source of evidence, the vocabulary target, and the CER prompt."
				].join("\n\n")
			},
			{
				title: "Module-by-Module Resource Mapping Routine",
				content:
					"**Teaching flow:** For each science module, choose one simulation/media source, one provided data table or graph, one model or diagram, and one CER prompt before class. The resource can be reused, but the question and vocabulary should match the module.\n\n**Completion checks:**\n- The student can access the evidence through Zoom.\n- The task works without physical supplies.\n- The final product is a diagram, graph, data table, CER response, or short presentation."
			},
			{
				title: "Remote Safety and Accessibility Check",
				content:
					"**Teaching flow:** Before assigning a science project, verify that it can be completed with notes, paper, a browser, and shared-screen material. If an optional household observation is suggested, provide a fully equivalent data/simulation alternative.\n\n**Exit check:** No required project depends on beakers, kits, food, chemicals, heat, electricity, outdoor access, or parent-managed materials."
			},
			{
				title: "Science Notebook Evidence Routine",
				content:
					"**Teaching flow:** Use a consistent notebook structure: date, phenomenon, vocabulary, observations, model or graph, claim, evidence, reasoning, and changed-condition prediction.\n\n**Exit check:** The student separates observation from inference and supports claims with visible evidence."
			}
		],
		supplementalProjects: [
			{
				title: "Resource Project: Simulation-to-CER Writeup",
				content:
					"**Project goal:** Use one approved simulation or provided dataset to write a CER response. Include a screenshot or sketch of the model, two observations, one claim, evidence from the source, and reasoning that uses the target vocabulary.\n\n**Completion checks:**\n- The evidence comes from the shared source.\n- The reasoning explains why the evidence supports the claim.\n- The student predicts what would change if one variable changed."
			},
			{
				title: "Resource Project: Model Critique",
				content:
					"**Project goal:** Choose one model, diagram, graph, or simulation and explain what it shows well and what it leaves out.\n\n**Completion checks:**\n- The student identifies at least two strengths and one limitation.\n- The critique uses science vocabulary accurately.\n- The student suggests one improvement or follow-up question."
			}
		]
	});
}

function addAlgebraTaxonomyModule(courseId: string, course: RawCourse) {
	if (!courseId.startsWith("algebra-")) return;

	appendModule(course, {
		title: "Algebra Project Taxonomy and Assessment Implementation",
		curriculum: [
			{
				title: "Portal Structure Decision",
				content:
					"**Teaching flow:** Use `supplementalProjects` for explicit practice sets, application/modeling projects, error-analysis tasks, and enrichment. Keep core curriculum items for concept instruction, worked examples, and guided practice. Existing imported module projects can remain in curriculum for continuity, but every module should also expose at least two explicit project/practice options in the project area.\n\n**Exit check:** A tutor can distinguish required concept instruction from optional/remedial/enrichment project work without reading the entire module."
			},
			{
				title: "Assessment Cadence",
				content:
					"**Diagnostic guidance:** Use a short formative check after each major topic, a cumulative mixed-practice check every few modules, and an error-analysis task before moving into a new representation type.\n\n**Evidence of proficiency:** The student solves, explains, checks reasonableness, and can identify a common algebraic error."
			},
			{
				title: "Representation Balance",
				content:
					"**Teaching flow:** Each algebra project should include at least two representations when reasonable: equation, graph, table, verbal rule, diagram, or contextual model.\n\n**Exit check:** The student can translate between representations and explain what each one reveals."
			},
			{
				title: "Worked Example Density",
				content:
					"**Teaching flow:** For each new algebra skill, provide one clean worked example, one flawed example to repair, and one transfer problem with changed numbers or context.\n\n**Exit check:** The student can explain the difference between procedure and reason."
			}
		],
		supplementalProjects: [
			{
				title: "Taxonomy Project: Practice Set Conversion",
				content:
					"**Project goal:** Convert one module's concept into a practice set with a worked example, three independent problems, one representation task, and one explanation prompt.\n\n**Completion checks:**\n- Problems are sequenced from direct to transfer.\n- One problem requires a graph/table/context interpretation.\n- The answer key includes reasoning, not just final answers."
			},
			{
				title: "Taxonomy Project: Modeling or Error-Analysis Task",
				content:
					"**Project goal:** Build either a contextual model or an error-analysis task for one algebra topic.\n\n**Completion checks:**\n- The task asks why, not only what.\n- The student checks units or context.\n- A likely misconception is named in the tutor notes."
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
					"**Teaching flow:** Keep Elementary Science as one course for scheduling simplicity, but label each activity with a K-2 path and a 3-5 path during future lesson writing. K-2 emphasizes observation, drawing, sorting, oral explanation, and sentence frames. Grades 3-5 add data tables, simple graphs, variables, model critique, and fuller CER writing.\n\n**Exit check:** Every future elementary science module should name the simpler path, the advanced path, and the shared phenomenon."
			},
			{
				title: "K-2 Path",
				content:
					"**Teaching flow:** Use short phenomena, images, drawings, sorting, matching, and oral explanation. Keep writing light and use sentence frames: I observe, I think, my evidence is, and I wonder.\n\n**Exit check:** The student can make observations, ask a question, and explain one idea with a drawing or sentence."
			},
			{
				title: "Grades 3-5 Path",
				content:
					"**Teaching flow:** Add simple measurements, data tables, graph reading, model critique, and claim-evidence-reasoning paragraphs. Ask students to compare examples and explain what would change if one condition changed.\n\n**Exit check:** The student can use evidence from a shared source and connect it to a science vocabulary term."
			},
			{
				title: "Shared Zoom Constraint",
				content:
					"**Remote investigation:** Both paths remain Zoom-first and paper/browser based. Optional household observations may be allowed only when a fully equivalent image, simulation, or data table is provided.\n\n**Exit check:** A student without supplies can complete the same learning goal."
			}
		],
		supplementalProjects: [
			{
				title: "Differentiation Project: Two-Level Prompt",
				content:
					"**Project goal:** Rewrite one elementary science activity with a K-2 prompt and a 3-5 prompt using the same phenomenon.\n\n**Completion checks:**\n- The K-2 version can be answered with drawing, sorting, or oral explanation.\n- The 3-5 version adds data, graphing, model critique, or CER.\n- Both versions use the same core vocabulary."
			},
			{
				title: "Differentiation Project: Sentence Frame Bank",
				content:
					"**Project goal:** Create sentence frames for observation, inference, claim, evidence, reasoning, and changed-condition prediction.\n\n**Completion checks:**\n- Frames are age-appropriate.\n- Each frame can be used with a shared image or simulation.\n- At least one frame supports a student who struggles with writing."
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
						"Explain Assets, Scenes, Scripts, Prefabs, Materials, and Packages. Students should create a clean folder structure before writing scripts so assets do not become untraceable later."
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
						"Teach Unity objects as component containers. Students should explain which behavior belongs to the transform, collider, renderer, rigidbody, and custom script."
				},
				{
					title: "Script Lifecycle",
					content:
						"Introduce Awake, Start, Update, FixedUpdate, and collision callbacks at a beginner level. Tie each callback to a specific kind of work."
				},
				{
					title: "Inspector Variables",
					content:
						"Use serialized fields to tune values without hardcoding every number. Students should change speed or health in the inspector and explain why that is useful."
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
						"Convert keyboard or controller input into intent before changing position or velocity. Students should describe what the input means before applying movement."
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
						"Separate physical collision from trigger detection. Students should know when an object should block movement and when it should only report contact."
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
					"**Teaching flow:** Use this matrix when placing students after the original C++ Level 1 material or after Python/Java prerequisites.",
					`**Matrix:**\n${bullets(cppConceptMatrix)}`,
					"**Exit check:** The tutor can identify whether the next lesson should be syntax fluency, memory reasoning, standard-library design, parser/state-machine architecture, or DS&A."
				].join("\n\n")
			},
			{
				title: "CS235/CS236 Concept Extraction",
				content:
					"**Teaching flow:** Extract CS235-style object, container, and data-structure discipline into Level 3/DS&A, and CS236-style scanner/parser, relation, and state-machine ideas into Level 3 command architecture. Keep the projects smaller than college assignments but preserve the core reasoning."
			},
			{
				title: "No AI/ML Boundary",
				content:
					"**Teaching flow:** Do not use C++ Level 3 as an AI/ML course. Students may build parsers, command simulations, and state machines, but model training and ML evaluation belong in AI/Data Science/Machine Learning."
			},
			{
				title: "Placement Check",
				content:
					"**Diagnostic guidance:** Ask the student to explain a pointer/reference example, use a vector or map appropriately, trace a recursive call, and describe how a command parser rejects bad input. Use the weakest answer to choose the next module."
			}
		],
		supplementalProjects: [
			{
				title: "Matrix Project: Student Placement Evidence",
				content:
					"**Project goal:** Create a placement evidence sheet for a C++ student. Include one example each for syntax/control flow, memory, containers, recursion, and architecture.\n\n**Completion checks:**\n- The sheet names strengths and gaps.\n- The recommended next module follows from evidence.\n- AI/ML topics are not used as C++ placement criteria."
			},
			{
				title: "Matrix Project: CS235/CS236-Inspired Mini Build",
				content:
					"**Project goal:** Choose either a relation-style container view or a scanner/parser mini build and implement the smallest useful version.\n\n**Completion checks:**\n- The project has a clear input format.\n- Invalid input is rejected safely.\n- The student explains which college-level idea was simplified."
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
					"**Exit check:** Every AP review assignment should name the unit, Java construct, tracing skill, and likely FRQ or MCQ pattern."
				].join("\n\n")
			},
			{
				title: "FRQ Cadence",
				content:
					"**Teaching flow:** Add one short FRQ-style task after class design, arrays/ArrayLists, 2D arrays, inheritance/polymorphism, and recursion. Use official-style rubrics: correctness, object state, loop bounds, method contract, and edge cases.\n\n**Exit check:** The student can explain where points would be earned or lost."
			},
			{
				title: "MCQ Distractor Analysis",
				content:
					"**Diagnostic guidance:** After each MCQ practice set, classify missed questions by distractor type: off-by-one, reference vs value, integer division, boolean logic, object state, array bounds, or method dispatch.\n\n**Exit check:** The student keeps an error log and repeats a targeted remediation problem."
			},
			{
				title: "Solution-Link Remediation Rule",
				content:
					"**Teaching flow:** Any AP CSA project without a solution link should be either paired with a local source solution, marked as discussion-only, or added to the source-parity remediation list.\n\n**Exit check:** The tutor knows whether a project is expected to be independently checked, discussed orally, or compared against a reference solution."
			}
		],
		supplementalProjects: [
			{
				title: "AP Alignment Project: FRQ Rubric Rewrite",
				content:
					"**Project goal:** Rewrite one existing AP CSA project as an FRQ-style prompt with scoring bullets.\n\n**Completion checks:**\n- The prompt states method/class constraints.\n- The rubric identifies core correctness and common point losses.\n- The answer can be traced with at least one edge case."
			},
			{
				title: "AP Alignment Project: Error Log Review",
				content:
					"**Project goal:** Build a student error log across one module of MCQ or FRQ practice.\n\n**Completion checks:**\n- Missed items are grouped by AP concept.\n- One remediation task is assigned per recurring issue.\n- The next check-in revisits the weakest skill."
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
					"**Teaching flow:** Use stable, inspectable datasets before introducing heavier tooling. Every dataset should have a source, license/usage note, target question, and known caveat.",
					`**Catalog:**\n${bullets(catalog)}`,
					"**Exit check:** The student can name the target, features or evidence, limitation, and evaluation method before coding."
				].join("\n\n")
			},
			{
				title: "Reproducibility Contract",
				content:
					"**Teaching flow:** Each notebook or script should run from top to bottom with fixed seeds or documented randomness, visible imports, environment notes, and clear data-loading paths.\n\n**Exit check:** A fresh run reproduces the main table, graph, model metric, or AI behavior."
			},
			{
				title: "Evaluation and Limitation Notes",
				content:
					"**Diagnostic guidance:** Require a baseline, metric, validation split or test scenario, and limitation note when the course uses models or AI behavior.\n\n**Evidence of proficiency:** The student can explain why the metric fits the problem and where the result should not be trusted."
			},
			{
				title: "Responsible Use Check",
				content:
					"**Teaching flow:** Use NIST AI RMF language at a student-appropriate level: intended use, risk, harm, uncertainty, mitigation, and human oversight.\n\n**Exit check:** The student writes one limitation or risk statement for each major AI/ML/data project."
			}
		],
		supplementalProjects: [
			{
				title: "Catalog Project: Dataset Readiness Card",
				content:
					"**Project goal:** Create a readiness card for one dataset or fixture.\n\n**Completion checks:**\n- Source and license/usage notes are recorded.\n- Target question and columns/features are named.\n- Known limitations or risks are documented."
			},
			{
				title: "Catalog Project: Evaluation Report",
				content:
					"**Project goal:** Write a short evaluation report for one AI, data, or ML artifact.\n\n**Completion checks:**\n- The report includes baseline or comparison.\n- The metric or evidence is justified.\n- The limitation statement is specific."
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

	appendModule(course, {
		title: "Systems and Security Lab Safety Policy",
		curriculum: [
			{
				title: "Allowed Lab Scope",
				content: [
					"**Teaching flow:** Start every systems or security lab by naming scope, target, tools, and stop conditions.",
					`**Policy:**\n${bullets(securityPolicy)}`,
					"**Exit check:** The student can explain why the lab is authorized and what defensive outcome it produces."
				].join("\n\n")
			},
			{
				title: "Disallowed Work",
				content:
					"**Safety boundary:** Do not scan third-party systems, test credentials against real services, collect real user data, bypass access controls, run destructive host commands, or publish exploit steps detached from remediation.\n\n**Exit check:** Any unclear target is treated as out of scope until explicitly approved."
			},
			{
				title: "Evidence and Remediation Format",
				content:
					"**Teaching flow:** Findings should use this format: scope, observation, reproduction in local lab, impact, fix, test proving the fix, and prevention note.\n\n**Exit check:** A lab is incomplete without a mitigation or hardening step."
			},
			{
				title: "Tooling Setup and Recovery",
				content:
					"**Teaching flow:** Prefer VMs, containers, local toy services, sample captures, compiler sanitizers, and reversible configuration. Record how to reset the lab before starting.\n\n**Exit check:** The student can restore the lab to a known state."
			}
		],
		supplementalProjects: [
			{
				title: "Safety Project: Threat Model and Scope Sheet",
				content:
					"**Project goal:** Write a scope sheet for one lab.\n\n**Completion checks:**\n- Target and authorization are explicit.\n- Allowed and disallowed actions are listed.\n- Defensive outcome is named."
			},
			{
				title: "Safety Project: Patch and Evidence Report",
				content:
					"**Project goal:** Fix one local toy vulnerability or unsafe systems bug and write the evidence report.\n\n**Completion checks:**\n- The before state is reproduced locally.\n- The patch is tested.\n- The report explains impact and prevention."
			}
		]
	});
}

export function applyCourseImplementationArtifacts(
	courseId: string,
	course: RawCourse
) {
	addAlgebraSupplementalProjects(courseId, course);
	addFullLessonAuthoringPack(courseId, course);
	addSourceParityModule(courseId, course);
	addScienceResourceModule(courseId, course);
	addAlgebraTaxonomyModule(courseId, course);
	addElementaryScienceDecision(courseId, course);
	addUnityRebuildModules(courseId, course);
	addCppMatrixModule(courseId, course);
	addApCsaAlignmentModule(courseId, course);
	addDataCatalogModule(courseId, course);
	addSecurityPolicyModule(courseId, course);
}
