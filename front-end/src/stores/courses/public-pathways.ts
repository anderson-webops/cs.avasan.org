export type CoursePathwayPriority = "urgent" | "soon" | "later";

export interface CoursePublicPathway {
	id: string;
	title: string;
	adminPriority: CoursePathwayPriority;
	courseIds: string[];
	audience: string;
	prerequisiteSummary: string;
	outcomes: string[];
	sequencingNotes: string[];
	projectExpectations: string[];
	assessmentStyle: string[];
	sourceAndTooling: string[];
	safetyAndAccess: string[];
	adminExpansionBacklog: string[];
}

export const coursePublicPathways: CoursePublicPathway[] = [
	{
		id: "scratch-early-cs",
		title: "Scratch and Early Computer Science",
		adminPriority: "urgent",
		courseIds: ["scratch-level-1", "scratch-level-2"],
		audience:
			"Young learners who need visual programming, creative projects, and explicit computational-thinking language before moving into text programming.",
		prerequisiteSummary:
			"No prior coding is required; readiness means following a short sequence of steps, explaining what changed on screen, and revising a project after feedback.",
		outcomes: [
			"Build event-driven Scratch projects with loops, conditionals, variables, broadcasts, clones, and lists.",
			"Translate blocks-to-pseudocode so sequence, state, and debugging language transfers to Python or JavaScript.",
			"Present a polished project with instructions, controls, replay state, and a short explanation of one bug they fixed."
		],
		sequencingNotes: [
			"Scratch Level 1 should focus on events, motion, loops, conditionals, variables, and visual debugging.",
			"Scratch Level 2 should add broadcasts, clones, lists, multi-scene state, remix etiquette, and more formal project review.",
			"The pathway should not treat Scratch as decoration; every project should name the computational idea being practiced."
		],
		projectExpectations: [
			"Maze or collector game with timer, score, and clear win/loss states.",
			"Broadcast-driven story or dialogue adventure with multiple scenes.",
			"Clone-based avoidance or collection game backed by a rubric for controls, feedback, organization, and explanation."
		],
		assessmentStyle: [
			"Explain one event chain from input to visible result.",
			"Use broken-script debugging checkpoints that require prediction, repair, and retest.",
			"Include a brief project presentation that names the goal, the main blocks used, and one improvement after playtesting."
		],
		sourceAndTooling: [
			"Use Scratch educator references and stable project examples.",
			"Maintain broken-script cards and remix/reference projects for debugging practice.",
			"Keep a simple blocks-to-pseudocode glossary visible across both levels."
		],
		safetyAndAccess: [
			"Keep projects browser-accessible and age-appropriate.",
			"Use only age-appropriate shared assets or provided media.",
			"Make any account-sharing or public remixing optional and supervised."
		],
		adminExpansionBacklog: [
			"Write a formal Scratch pathway map from events to pseudocode to first Python/JavaScript concepts.",
			"Add rubric-backed capstones for Level 1 and Level 2.",
			"Add more debugging-first exercises instead of only build-from-scratch prompts."
		]
	},
	{
		id: "python-programming",
		title: "Python Programming Foundations and Advanced Python",
		adminPriority: "urgent",
		courseIds: [
			"python-level-1",
			"python-level-2",
			"python-level-3",
			"python-to-java-and-cpp-bridge"
		],
		audience:
			"Students moving from first text programs into file-backed tools, algorithms, object design, and language transfer into Java or C++.",
		prerequisiteSummary:
			"Students entering Level 1 need no Python experience. Students entering Level 3 should already be comfortable with functions, loops, lists, dictionaries, and debugging console programs.",
		outcomes: [
			"Write clear console programs with input handling, conditionals, loops, functions, and data structures.",
			"Use files, CSV or JSON records, exceptions, modules, command-line arguments, and lightweight tests in medium-size programs.",
			"Explain how Python choices map to Java and C++ choices when moving into stronger typing, classes, and memory-aware programming."
		],
		sequencingNotes: [
			"Level 1 should emphasize fluency and confidence with small programs.",
			"Level 2 should turn fluency into structured projects with nested data, validation, and test cases.",
			"Level 3 should be treated as algorithms, files, APIs, command-line tools, and object design, not just more syntax."
		],
		projectExpectations: [
			"JSON-backed contact book, gradebook, or flashcard trainer with normal and malformed input tests.",
			"Text analyzer with word frequencies, stop words, and a short interpretation of results.",
			"Algorithm or puzzle solver that includes tracing, edge cases, and complexity discussion."
		],
		assessmentStyle: [
			"Use function-level tests or assertions for normal, boundary, and awkward cases.",
			"Trace before running to identify type, mutation, off-by-one, and missing-return bugs.",
			"Review capstones for requirements, organization, input/output behavior, and explanation quality."
		],
		sourceAndTooling: [
			"Standardize starter and review parity across the Python source repos.",
			"Use Python 3, optional pytest examples, and small CSV/JSON fixtures.",
			"Keep bridge projects explicit about what changes when the same idea is written in Java or C++."
		],
		safetyAndAccess: [
			"Use local files and provided datasets unless an API key is explicitly configured for class.",
			"Keep web/API examples read-only and replaceable with fixture files.",
			"Do not require paid services or personal credentials for core projects."
		],
		adminExpansionBacklog: [
			"Finish the Python Level 3 source parity audit for legacy standalone files and folders.",
			"Add a named testing/debugging spine across Levels 1 through 3.",
			"Add stronger project rubrics for advanced Python capstones."
		]
	},
	{
		id: "game-development",
		title: "Game Development with PyGame and Unity",
		adminPriority: "urgent",
		courseIds: ["pygames", "unity-game-development"],
		audience:
			"Students who learn well through interactive projects and are ready to reason about game loops, state, input, feedback, and playtesting.",
		prerequisiteSummary:
			"PyGame Know Python functions, loops, and lists. Unity Be ready for C# scripts, scenes, prefabs, components, and editor workflow.",
		outcomes: [
			"Build games around a clear update loop, input model, collision or interaction rules, UI state, and restart/end conditions.",
			"Separate model/state decisions from rendering or scene setup so bugs can be diagnosed without guessing.",
			"Use playtest notes, bug reproduction steps, asset attribution, and version-control habits in every substantial game."
		],
		sequencingNotes: [
			"PyGame should start with main loop, events, rectangles, sprites, collision, audio, menus, and level data.",
			"Unity should cover setup, scenes, components, prefabs, Input System, physics, UI state, Build Profiles, and testing.",
			"Do not let engine-specific clicking replace design reasoning; every project needs a state diagram or gameplay loop description."
		],
		projectExpectations: [
			"PyGame arcade project with menu, score, collision, restart, and a playtest log.",
			"Unity full-project starter and review state with scene setup, scripts, tests, asset attribution, and Git LFS rules.",
			"Capstone prototype that includes controls, win/loss loop, feedback, one polish pass, and a written bug-fix record."
		],
		assessmentStyle: [
			"Explain update, draw, input, collision, and state-transition phases.",
			"Run collision and restart edge-case tests rather than only testing one normal case.",
			"Use a rubric for controls, feedback, state, code organization, asset hygiene, and polish."
		],
		sourceAndTooling: [
			"Use PyGame documentation for Python game-loop material.",
			"Use Unity Learn, Unity Manual, Build Profiles, Input System, Test Framework, package locks, and Git LFS for Unity projects.",
			"Keep THIRD_PARTY_ASSETS notes and engine version files with each Unity starter and review state.",
			"Treat current Unity starter and review source folders as the baseline; mature modules should use checkpoint tags or equivalent history so game-growth history can be inspected over time.",
			"Unity source packages should document editor version, package baseline, Build Profiles, Input System setup, Edit Mode or Play Mode smoke tests, and asset-license provenance."
		],
		safetyAndAccess: [
			"Use licensed or provided assets only.",
			"Make heavy Unity editor work optional when the available computer cannot run the full toolchain.",
			"Keep multiplayer, analytics, ads, and monetization out of the core course."
		],
		adminExpansionBacklog: [
			"Add CI/build-profile verification for Unity source packages.",
			"Add more small PyGame labs that isolate collision, level loading, and state transitions.",
			"Promote playtesting notes from optional reflection to required project evidence.",
			"Create Unity module checkpoints or tags for setup, input, movement, collisions, UI state, build profile, test pass, and final polish."
		]
	},
	{
		id: "data-ai-ml",
		title: "Data Science, AI, and Machine Learning",
		adminPriority: "soon",
		courseIds: ["data-science-in-python", "ai-level-1", "machine-learning"],
		audience:
			"Students ready to reason from data, search spaces, model behavior, evaluation, and responsible interpretation without treating output as magic.",
		prerequisiteSummary:
			"Key idea: Python basics, lists/dictionaries, functions, and enough algebra or graph reading to interpret tables and metrics.",
		outcomes: [
			"Load, clean, visualize, and explain named datasets such as Iris, Palmer Penguins, Titanic-style survival data, weather records, or local CSV fixtures.",
			"Build AI search or rule-based systems with explicit state spaces, heuristics, limitations, and test cases.",
			"Train and evaluate simple ML models with train/test splits, baseline comparison, confusion matrices or error metrics, and a short model card."
		],
		sequencingNotes: [
			"Data Science should come before ML when pandas, plots, missing data, and interpretation need more practice.",
			"AI Level 1 should stay focused on search, games, rules, and responsible AI concepts rather than statistical ML.",
			"Machine Learning should add scikit-learn evaluation, overfitting, fairness limits, and model documentation without duplicating the AI-only course."
		],
		projectExpectations: [
			"Notebook that cleans a named dataset, creates visualizations, and states two evidence-backed conclusions.",
			"Search or game AI lab with state representation, heuristic explanation, and failure-case analysis.",
			"Model comparison project with baseline, train/test split, metric choice, confusion matrix or error table, and model card.",
			"Dataset documentation project that writes a mini-datasheet: source, columns, known limitations, missing values, license or attribution note, and appropriate/non-appropriate uses."
		],
		assessmentStyle: [
			"Explain what each row, feature, label, and metric means.",
			"Use interpretation questions that separate correlation, prediction, and causation.",
			"Include limitations, dataset assumptions, and responsible-use notes in final projects.",
			"Include an experiment log for ML projects: baseline, model choice, split method, metric, failed attempt, and one next improvement."
		],
		sourceAndTooling: [
			"Use pandas, matplotlib or seaborn, scikit-learn, and small pinned CSV fixtures.",
			"Keep dataset source notes, license notes, schema notes, and expected output artifacts with each project.",
			"Use NIST AI RMF and scikit-learn model-evaluation documentation as reference anchors.",
			"Data Science source pool: NYC 311, NOAA Climate Data Online, CDC BRFSS, Our World in Data, Iris, Palmer Penguins, and small provided CSV fixtures.",
			"AI Foundations source pool: OpenStreetMap or OSMnx extracts, MiniZinc-style constraint examples, Lichess puzzles, OpenSpiel examples, and authored toy state spaces.",
			"Machine Learning source pool: scikit-learn sample datasets, OpenML, FashionMNIST or CIFAR-10 where appropriate, Hugging Face Datasets, and local train/test fixtures."
		],
		safetyAndAccess: [
			"Do not upload personal data.",
			"Prefer local notebooks and provided datasets over live API dependencies.",
			"Frame AI output as advisory and limited, especially around sensitive predictions or classifications."
		],
		adminExpansionBacklog: [
			"Publish a named dataset catalog with schema, license, and artifact expectations.",
			"Add model-card and evaluation-rubric templates.",
			"Separate AI search/game topics from ML model-training topics in public descriptions.",
			"Attach mini-datasheet, model-card, and experiment-log templates to every new data or ML project."
		]
	},
	{
		id: "algebra",
		title: "Algebra 1 and Algebra 2",
		adminPriority: "urgent",
		courseIds: ["algebra-1a", "algebra-1b", "algebra-2a", "algebra-2b"],
		audience:
			"Students needing structured support in school algebra, graph interpretation, modeling, written justification, and cumulative practice.",
		prerequisiteSummary:
			"Algebra 1A starts from pre-algebra readiness. Later algebra courses assume comfort with equations, graph reading, variables, and multi-step reasoning.",
		outcomes: [
			"Solve, graph, and explain linear, quadratic, exponential, polynomial, rational, and function-based problems at the correct course level.",
			"Connect symbolic, graphical, tabular, and verbal representations instead of treating procedures as isolated tricks.",
			"Write enough justification to classify an error as arithmetic, notation, concept, or strategy."
		],
		sequencingNotes: [
			"Use Common Core algebra domains as the standards map and keep representation changes visible.",
			"Add cumulative mixed practice so older skills do not vanish after a unit ends.",
			"Separate direct practice, modeling projects, error analysis, and enrichment rather than making every supplemental look the same."
		],
		projectExpectations: [
			"Modeling task with scenario, equation, graph or table, solution, and reasonableness check.",
			"Error-analysis task where students diagnose a flawed solution and write the corrected reasoning.",
			"Cumulative mixed practice set with a short reflection on which representation helped most."
		],
		assessmentStyle: [
			"Use short quizzes, explanation prompts, graph/table interpretation, and error diagnosis.",
			"State what each variable represents and why each transformation is allowed.",
			"Track misconceptions across sessions rather than only marking answers wrong."
		],
		sourceAndTooling: [
			"Anchor standards to Common Core high-school algebra and functions domains where appropriate.",
			"Use graphing calculators or Desmos-style visuals when they clarify representation changes.",
			"Track unresolved worksheet or image replacements explicitly until original source visuals are replaced with owned or source-safe materials."
		],
		safetyAndAccess: [
			"Keep external calculators or graphing tools optional when a school requires a specific platform.",
			"Do not rely on copyrighted textbook pages as course text.",
			"Use accessible diagrams and alternative text for graph-heavy material."
		],
		adminExpansionBacklog: [
			"Build a formal algebra project taxonomy for practice, modeling, error analysis, and enrichment.",
			"Audit remaining unresolved image references and replace them with owned or source-safe visuals.",
			"Add stronger cumulative assessments across Algebra 1B, 2A, and 2B."
		]
	},
	{
		id: "cpp-and-algorithms",
		title: "C++ Levels 1-3 and C++ Data Structures",
		adminPriority: "urgent",
		courseIds: [
			"c-level-1",
			"cpp-level-2",
			"cpp-level-3",
			"data-structures-and-algorithms-in-cpp"
		],
		audience:
			"Fast-moving programming students who are ready for typed program design, memory ownership, command-line tools, and algorithmic data structures.",
		prerequisiteSummary:
			"Level 1 assumes general programming readiness. Level 2 and 3 assume variables, I/O, loops, functions, classes, vectors, references, pointers, raw arrays, and dynamic memory have been introduced.",
		outcomes: [
			"Write C++ programs with clear types, functions, classes, vectors, references, pointers, arrays, dynamic memory, RAII, and standard-library containers.",
			"Use state machines, parsers, file persistence, templates, virtual interfaces, and medium-size command architecture without adding AI/ML content.",
			"Implement and analyze linked structures, trees, heaps, hashing, graphs, dynamic programming, and shortest-path style projects."
		],
		sequencingNotes: [
			"Level 1 should remain the core syntax, functions, classes, vectors, references, and baseline state-machine course.",
			"Level 2 should bridge from raw memory to safer ownership and reusable custom data structures.",
			"Level 3 should cover command architecture, file I/O, parsers, STL containers, RAII, templates, virtual interfaces, and state machines before DS&A."
		],
		projectExpectations: [
			"CLI state-machine project with commands, validation, persistence, and transcript tests.",
			"Custom dynamic array or matrix class with copy behavior, ownership explanation, and edge-case tests.",
			"Graph navigation or route-finding lab inspired by CS235/CS236 concepts with weighted data and path reconstruction."
		],
		assessmentStyle: [
			"Trace memory ownership, object lifetime, and copy/move expectations before and after code runs.",
			"Use compile/run tests for empty, one-element, duplicate, invalid-input, and large-enough cases.",
			"Include runtime and data-structure tradeoff explanations for DS&A projects."
		],
		sourceAndTooling: [
			"Use ISO C++ Core Guidelines, local Makefile or CMake workflows, and source folders under Instruction-Material.",
			"Keep starter and review naming consistent across CPP Level 1-3 and DS&A repos.",
			"Use CS235/CS236-inspired concepts only after rewriting them into original course projects."
		],
		safetyAndAccess: [
			"Keep memory labs local and educational, not exploit-oriented.",
			"Avoid requiring platform-specific IDE features unless a Makefile or command-line alternative exists.",
			"Keep AI/ML topics out of the C++ sequence so the AI/ML pathway remains distinct."
		],
		adminExpansionBacklog: [
			"Finish C++ naming normalization checks across all project and supplemental folders.",
			"Add one more project per thin module where the recently created courses still have fewer than two real builds.",
			"Add more explicit virtual interface, template, and RAII practice in Level 3."
		]
	},
	{
		id: "systems-infrastructure",
		title: "Systems, Assembly, Linux, Networking, and Rust",
		adminPriority: "soon",
		courseIds: [
			"c-systems-engineering",
			"assembly",
			"linux-systems",
			"network-systems",
			"rust-systems-security"
		],
		audience:
			"Students ready to understand how programs interact with operating systems, memory, processes, services, networks, and safer systems languages.",
		prerequisiteSummary:
			"Be comfortable with command-line work, typed programming basics, files, and debugging small programs before taking these courses.",
		outcomes: [
			"Explain machine representation, memory layout, stack/heap behavior, build tooling, processes, files, permissions, services, logs, and diagnostics.",
			"Use Linux and network tools to gather evidence and explain system state without guessing.",
			"Compare C/C++ systems risks with Rust ownership, borrowing, traits, error handling, and safe concurrency patterns."
		],
		sequencingNotes: [
			"C systems and Assembly should anchor memory representation before deeper security or Rust topics.",
			"Linux Systems should teach operational habits: commands, services, logs, configs, deployment, and rollback notes.",
			"Network Systems should precede Network Security when routing, DNS, HTTP/TLS, NAT, firewall, and packet-capture context are not yet comfortable."
		],
		projectExpectations: [
			"Systems CLI utility with explicit file, memory, process, or signal behavior and a verification transcript.",
			"Linux service deployment notebook with commands, key outputs, rollback notes, and log evidence.",
			"Network diagnostic lab with topology diagram, packet capture or traceroute evidence, and explanation of which hop or layer matters."
		],
		assessmentStyle: [
			"Include command transcripts, annotated outputs, and short evidence-to-claim explanations.",
			"Use checklists for setup, verification, rollback, and failure-mode diagnosis.",
			"Distinguish observation from inference in system and network troubleshooting."
		],
		sourceAndTooling: [
			"Use local VMs, containers, or owned servers where needed.",
			"Anchor network concepts to RFC 9110 for HTTP and RFC 8446 for TLS where appropriate.",
			"Use systemd documentation, Rust Book, and command-line reproducibility notes."
		],
		safetyAndAccess: [
			"Do not require router changes, scans of third-party hosts, or home-network reconfiguration.",
			"Use local traffic, owned domains, or provided captures.",
			"Keep privileged commands constrained and require rollback notes for configuration changes.",
			"Use a simple safety matrix for each lab: allowed target, prohibited target, required evidence, rollback or cleanup step, and what should be skipped if the student lacks admin access."
		],
		adminExpansionBacklog: [
			"Add a systems prerequisite matrix that shows when C, Assembly, Linux, Networking, Security, and Rust should be taken.",
			"Add more evidence-based lab rubrics for logs, packets, service state, and rollback.",
			"Document VM/container setup options for students without full admin access.",
			"Add course-specific safety matrices for Linux, networking, C systems, assembly, and Rust labs."
		]
	},
	{
		id: "java-pathway",
		title: "Java Core, Graphics Tracks, and Advanced OOP",
		adminPriority: "soon",
		courseIds: [
			"java-level-1",
			"java-level-2",
			"java-level-3",
			"java-without-graphics",
			"java-with-graphics"
		],
		audience:
			"Students moving from introductory Java into stronger object-oriented design, inheritance, interfaces, abstract classes, records, graphics, and non-graphics application work.",
		prerequisiteSummary:
			"Key idea: Variables, control flow, methods, arrays or ArrayLists, and basic class construction before the advanced tracks.",
		outcomes: [
			"Write Java classes with encapsulation, constructors, methods, inheritance, polymorphism, abstract classes, interfaces, and records where appropriate.",
			"Choose between graphics and non-graphics tracks depending on whether the next project should emphasize visual interaction or deeper backend/model design.",
			"Use tests, tracing, and design explanations to show object state and method contracts."
		],
		sequencingNotes: [
			"Java Level 1-3 should remain the general pathway for syntax, classes, inheritance, data structures, and project fluency.",
			"Java without Graphics should be the post-C++ bridge for CLI tools, models, records, collections, interfaces, and robust tests.",
			"Java with Graphics should be the visual track, but graphics should not replace object-model rigor."
		],
		projectExpectations: [
			"Record-backed inventory, scheduler, or catalog CLI with validation and tests.",
			"Interface or abstract-class project with multiple implementations and polymorphic behavior.",
			"Graphics project with separated model state, UI rendering, and user input."
		],
		assessmentStyle: [
			"Trace object state before and after method calls.",
			"Ask when to use a class, record, interface, abstract class, extension, or composition.",
			"Include unit tests or small driver programs for normal, empty, duplicate, invalid, and boundary cases."
		],
		sourceAndTooling: [
			"Use JDK tooling, simple command-line builds or IDE projects, and explicit starter plus review source folders.",
			"Keep Java records covered as immutable data carriers, not as a replacement for every class.",
			"Maintain separate source links for graphics and non-graphics tracks."
		],
		safetyAndAccess: [
			"Avoid requiring graphics libraries that are unavailable on the working machine unless a fallback exists.",
			"Keep projects local and avoid external service credentials for core work.",
			"Do not mix AP exam constraints into non-AP Java unless explicitly useful."
		],
		adminExpansionBacklog: [
			"Finish a distinct advanced Java course suitable after C++ Level 3.",
			"Add more records, interface, abstract-class, and collection-heavy source examples.",
			"Keep Java graphics and non-graphics pathways visibly separate in public course descriptions."
		]
	},
	{
		id: "ap-csa",
		title: "AP Computer Science A",
		adminPriority: "soon",
		courseIds: ["ap-computer-science-a"],
		audience:
			"Students preparing for AP Computer Science A or seeking a Java course with exam-aligned tracing, class design, arrays, ArrayLists, inheritance, recursion, and sorting/searching.",
		prerequisiteSummary:
			"Be ready for Java syntax and object-oriented reasoning. Prior programming helps, but the course must still explicitly teach AP-scoped Java.",
		outcomes: [
			"Master AP CSA units from primitive types through objects, boolean logic, iteration, writing classes, arrays, ArrayLists, 2D arrays, inheritance, and recursion.",
			"Practice MCQ reasoning, FRQ method writing, scoring, and error logs using College Board-aligned expectations.",
			"Prepare for the current digital AP testing environment, including Bluebook-style pacing and the four major FRQ families."
		],
		sequencingNotes: [
			"Keep the AP scope distinct from the broader Java courses.",
			"Map every module to College Board unit expectations and exam task types.",
			"Use Barron's or other exam-prep material only as a supplement, not as uncited course text."
		],
		projectExpectations: [
			"AP-style class design and method-writing projects with scoring notes.",
			"Array, ArrayList, 2D array, inheritance, and recursion drills with edge cases.",
			"Timed practice sets with review of wrong-answer patterns and fixes."
		],
		assessmentStyle: [
			"Use MCQ distractor analysis and FRQ rubrics.",
			"Keep a recurring error log grouped by syntax, tracing, object state, loops, arrays, and recursion.",
			"Include digital-exam timing practice and short written explanations of why an answer is valid.",
			"Practice the current 42 MCQ / 4 FRQ exam shape and score FRQs by rows so partial-credit habits are visible instead of only final answers."
		],
		sourceAndTooling: [
			"Use College Board AP CSA course and exam documentation as the authority.",
			"Link AP project starter folders and review folders in the instruction-material source repo when available.",
			"Keep downloaded AP media in the static classes media repo, not in Downloads.",
			"Guardrails to refresh each cycle: official Java subset, Bluebook-style typed and uncompiled practice, four FRQ families, AP Lab Quartet references, data ethics, text-file/dataset practice, wrapper parsing, recursion, ArrayList analysis, and 2D arrays."
		],
		safetyAndAccess: [
			"Do not expose completed-state links where only starter materials should be visible.",
			"Avoid copying proprietary textbook material into course text.",
			"Use practice problems in a way that respects source and licensing boundaries."
		],
		adminExpansionBacklog: [
			"Add an explicit AP exam alignment map to the public pathway and internal audits.",
			"Audit every Replit-era AP link against current GitHub source folders.",
			"Keep digital-exam and FRQ-family notes refreshed before each May exam cycle.",
			"Flag older FRQs as useful practice but adapt instructions and scoring language when they do not match the current digital exam shape."
		]
	},
	{
		id: "usaco",
		title: "USACO and Competitive Programming",
		adminPriority: "soon",
		courseIds: ["usaco-bronze", "usaco-silver", "usaco-gold"],
		audience:
			"Students who already have programming fluency and need disciplined contest problem solving, implementation speed, edge-case testing, and postmortems.",
		prerequisiteSummary:
			"Bronze Be comfortable with loops, arrays or vectors, strings, maps/sets, and file-style input. Silver and Gold require stronger algorithms and proof habits.",
		outcomes: [
			"Solve official-style P1, P2, and P3 problems with correct parsing, sample verification, edge cases, and complexity reasoning.",
			"Progress from Bronze simulation and sorting/searching into Silver data structures and Gold graph/dynamic-programming patterns.",
			"Write postmortems that identify the blocker: reading, modeling, algorithm choice, implementation bug, or testing gap."
		],
		sequencingNotes: [
			"Use official USACO problems and USACO Guide topics as the sequencing authority.",
			"Bronze should emphasize careful implementation before advanced algorithms.",
			"Silver and Gold should add topic ladders only after easier problems can be solved cleanly under time.",
			"Avoid random chronological contest browsing; choose official problems by division, topic, and slot difficulty so each assignment has a specific purpose."
		],
		projectExpectations: [
			"Problem set with one P1, one P2, and one P3 style task at the current division.",
			"Edge-case generator or manual test suite for a problem family.",
			"Contest postmortem with timeline, bug categories, final accepted approach, and next drill."
		],
		assessmentStyle: [
			"Check exact sample input/output, smallest case, largest reasonable case, ties, duplicates, and impossible cases.",
			"Include time complexity, memory complexity, and proof of why the algorithm matches constraints.",
			"Use timed practice only after the student has a repeatable untimed solution process.",
			"Every assigned official problem should include brute-force idea, target complexity, invariant or proof note, common wrong turns, and postmortem."
		],
		sourceAndTooling: [
			"Use USACO Official and USACO Guide as authoritative references.",
			"Keep local templates for input parsing, stress testing, and postmortem notes.",
			"Prefer original explanatory text around official problems rather than copying problem statements into the course."
		],
		safetyAndAccess: [
			"Do not publish official contest material in a way that violates platform terms.",
			"Keep coaching focused on understanding, not answer dumping.",
			"Make language choice explicit before a problem set so syntax friction does not obscure the algorithm."
		],
		adminExpansionBacklog: [
			"Create a visible Bronze-to-Silver-to-Gold prerequisite map.",
			"Add official-problem sequencing tables by topic and difficulty.",
			"Add a postmortem rubric and recurring edge-case checklist."
		]
	},
	{
		id: "design-patterns",
		title: "Design Patterns and Refactoring",
		adminPriority: "later",
		courseIds: [
			"design-patterns-in-java",
			"design-patterns-in-java-part-2",
			"design-patterns-in-cpp",
			"pythonic-design-patterns"
		],
		audience:
			"Intermediate students who can already build classes and now need vocabulary for responsibility, coupling, refactoring, polymorphism, and language-specific pattern tradeoffs.",
		prerequisiteSummary:
			"Key idea: Classes, methods, collections, and basic testing in the language used by the specific pattern course.",
		outcomes: [
			"Recognize when a pattern clarifies responsibilities and when it only adds unnecessary architecture.",
			"Refactor working code while preserving behavior with tests or driver programs.",
			"Compare how Java, C++, and Python express patterns differently because of language features and idioms."
		],
		sequencingNotes: [
			"Start with code smells and refactoring before naming too many patterns.",
			"Patterns begin with small before/after examples before moving into larger projects.",
			"Keep Pythonic patterns idiomatic instead of forcing Java-style architecture into Python."
		],
		projectExpectations: [
			"Refactor a duplicated conditional design into a polymorphic strategy or command structure.",
			"Implement observer, factory, adapter, or state in a small app with tests.",
			"Write a pattern critique explaining why one pattern was chosen and one was rejected."
		],
		assessmentStyle: [
			"Identify the responsibility that moved during refactoring.",
			"Include behavior-preserving tests before and after a refactor.",
			"Use design tradeoff prompts, not just vocabulary quizzes."
		],
		sourceAndTooling: [
			"Use language-specific source folders with starter and review pairs.",
			"Prefer small runnable examples over framework-heavy demos.",
			"Keep cross-language comparisons explicit when a course borrows an idea from another language."
		],
		safetyAndAccess: [
			"Do not over-abstract beginner code before the concrete problem is visible.",
			"Keep refactor targets small enough to review during tutoring.",
			"Preserve existing behavior unless the project explicitly asks for a feature change."
		],
		adminExpansionBacklog: [
			"Add more pattern misuse and anti-pattern examples.",
			"Add before/after tests to every major refactoring lab.",
			"Create a cross-language comparison appendix for Java, C++, and Python patterns."
		]
	},
	{
		id: "science",
		title: "Elementary, Middle School, Chemistry, and Physics",
		adminPriority: "urgent",
		courseIds: [
			"elementary-science",
			"middle-school-integrated-science",
			"intro-to-chemistry",
			"intro-to-physics",
			"physics-level-2"
		],
		audience:
			"Zoom-based science students who need strong explanations, diagrams, data, simulations, and claim-evidence-reasoning without physical lab requirements.",
		prerequisiteSummary:
			"Elementary Science should split K-2 and grades 3-5 expectations. Middle school science assumes basic reading, graphing, and explanation readiness. Chemistry and Physics assume stronger math and model reading.",
		outcomes: [
			"Use observations, provided images, graphs, data tables, simulations, and models to explain phenomena.",
			"Write claim-evidence-reasoning responses that distinguish observation from inference.",
			"Connect grade-band science vocabulary to models in life science, earth/space science, physical science, chemistry, and physics."
		],
		sequencingNotes: [
			"Elementary Science should stay one course but include a K-2 path and a grades 3-5 path for each investigation.",
			"Middle School Integrated Science should align with NGSS-style practices across earth, life, physical, and engineering ideas.",
			"Chemistry should use ACS and NGSS guidance; physics should strengthen problem solving, graphing, units, and model limits."
		],
		projectExpectations: [
			"Remote-safe investigation using a provided image, simulation, data table, or graph.",
			"Labeled model or diagram paired with a CER explanation.",
			"Prediction task where one variable changes and the expected effect is explained.",
			"Each unit should use one shared phenomenon, one simulation or visualization, one public dataset/media source, one notebook or graphic organizer, and one CER routine."
		],
		assessmentStyle: [
			"Use CER writing, vocabulary checks, graph interpretation, diagram labeling, and model critique.",
			"Separate what they saw from what they inferred.",
			"Use short formative checks rather than physical lab completion as proof of understanding."
		],
		sourceAndTooling: [
			"Use NGSS appendices, ACS chemistry guidance, PhET simulations, and vetted NASA/NOAA/USGS/HHMI resources as appropriate.",
			"Keep every activity Zoom-first with notes, paper, shared screen, and provided source material.",
			"Maintain a resource shortlist by module: standard, visual/simulation, data source, model, and CER prompt.",
			"Elementary and middle-school source pool: PhET, NASA, NOAA, USGS, HHMI BioInteractive, CK-12-style open readings, National Geographic Education, and original diagrams or data tables.",
			"Chemistry/physics source pool: ACS safety and curriculum guidance, PhET simulations, NIST or periodic-table references, NOAA/NASA data where relevant, and original graphing or free-body-diagram datasets."
		],
		safetyAndAccess: [
			"No required beakers, kits, chemicals, household experiments, or physical supplies beyond notes and paper.",
			"Any optional physical demo needs an equivalent diagram, simulation, or data table.",
			"Use age-appropriate content and avoid unsafe home-lab instructions."
		],
		adminExpansionBacklog: [
			"Write a high-school science pathway after elementary and middle-school courses are stabilized.",
			"Replace thin science lesson text with phenomenon, model, data, and CER sections.",
			"Add source/resource registers for every science module.",
			"Add explicit coverage checks for waves, Earth and human activity, heredity/evolution, graphing, model revision, and engineering design."
		]
	},
	{
		id: "swift-mobile",
		title: "Swift and Mobile App Development",
		adminPriority: "soon",
		courseIds: ["intro-to-swift-app-development"],
		audience:
			"Students interested in iOS-style app development, SwiftUI views, app structure, navigation, state, assets, persistence, and release-minded polish.",
		prerequisiteSummary:
			"Have general programming readiness and be able to work with files and a local IDE. Prior Swift is not required for the intro course.",
		outcomes: [
			"Build SwiftUI apps with views, state, navigation, lists, forms, assets, and simple data flow.",
			"Understand app structure: entry point, scenes, view hierarchy, model/data responsibilities, and previews.",
			"Prepare a capstone with accessibility review, testing notes, and a plausible TestFlight or App Store preparation path."
		],
		sequencingNotes: [
			"Start with app structure and Xcode navigation before deeper Swift syntax.",
			"Optionals, structs/classes, protocols, persistence, async networking, and accessibility appear only as the app needs them.",
			"Keep product thinking tied to navigation and data decisions."
		],
		projectExpectations: [
			"Welcome/profile app with navigation and editable state.",
			"List/detail app with structured data and persistence or mock networking.",
			"Capstone app with intentional navigation, accessibility pass, and release-readiness notes."
		],
		assessmentStyle: [
			"Label app entry point, scene, view hierarchy, navigation model, and data model responsibilities.",
			"Use UI behavior checks plus code explanations.",
			"Include one accessibility or usability improvement in major projects."
		],
		sourceAndTooling: [
			"Use Apple's App Dev Training and current SwiftUI documentation as the authority.",
			"Use Xcode, SwiftUI previews, local assets, and starter plus review projects where available.",
			"Keep simulator/device requirements explicit."
		],
		safetyAndAccess: [
			"Do not require an Apple Developer Program account for core projects.",
			"Keep networking examples mockable when credentials or live APIs are unavailable.",
			"Make device-specific features optional unless the student has the required hardware."
		],
		adminExpansionBacklog: [
			"Add more testing and accessibility checkpoints.",
			"Clarify which projects require macOS/Xcode versus conceptual review.",
			"Add a follow-up Swift course after the intro sequence if demand grows."
		]
	},
	{
		id: "web-javascript",
		title: "JavaScript and Web Development",
		adminPriority: "urgent",
		courseIds: [
			"javascript-level-1-javascript-superstar",
			"javascript-level-2-javascript-master",
			"web-development-foundations"
		],
		audience:
			"Students moving from browser JavaScript projects into full web-development habits: files, Git, npm, dev servers, accessibility, APIs, deployment, and operations.",
		prerequisiteSummary:
			"JavaScript Level 1 can start near the beginning. Web Development Foundations assumes readiness with small JavaScript programs, HTML/CSS, and the DOM.",
		outcomes: [
			"Build browser projects with HTML, CSS, JavaScript, DOM events, forms, fetch/async APIs, local state, and responsive layout.",
			"Use file-based projects, Git/GitHub, npm scripts, local dev servers, browser devtools, and deployment workflows.",
			"Explain HTTP basics, accessibility checks, security basics, OWASP-informed safe input handling, and production-readiness tradeoffs."
		],
		sequencingNotes: [
			"JavaScript Level 1 should keep fundamentals visible but use more local-file structure as students are ready.",
			"JavaScript Level 2 should strengthen DOM, async/fetch, data handling, debugging, and multi-file projects.",
			"Web Development Foundations should bridge into full-stack and deployment without becoming a framework-only course."
		],
		projectExpectations: [
			"Responsive portfolio or resource page with accessibility checks and a deployment note.",
			"API-backed browser app with loading, empty, success, and error states.",
			"Full-stack-lite project with client, server or mock API, persistence plan, and deployment checklist.",
			"Debugging lab that uses devtools console, network tab, DOM inspector, keyboard-only navigation, and a small security/input-validation checklist."
		],
		assessmentStyle: [
			"Verify projects in the browser at desktop and narrow widths.",
			"Check keyboard navigation, labels, contrast, loading/error states, and network tab behavior.",
			"Explain the request/response flow and where data lives.",
			"Include one accessibility fix, one async/loading/error-state fix, and one safe-input or output-escaping explanation in substantial web projects."
		],
		sourceAndTooling: [
			"Use MDN JavaScript, RFC 9110 HTTP Semantics, OWASP Web Security Testing Guide, browser devtools, Git, npm, and deployment docs as anchors.",
			"Keep starter and review source folders in the Web Development Foundations and JavaScript repos.",
			"Use linting/formatting and simple local dev server scripts before frameworks.",
			"Core topic checklist: semantic HTML, forms and labels, responsive CSS, DOM events, modules, promises, async/await, fetch, JSON, HTTP status codes, local storage, deployment, performance basics, and OWASP-informed validation."
		],
		safetyAndAccess: [
			"Do not require real payment, authentication, or production secrets for student projects.",
			"Use safe mock APIs or provided endpoints for early work.",
			"Treat security topics as defensive design and safe validation, not offensive web testing."
		],
		adminExpansionBacklog: [
			"Add an explicit JavaScript-to-Web pathway diagram.",
			"Add concrete async/fetch, accessibility, HTTP, and deployment projects.",
			"Prepare a follow-up Full-Stack Web Apps course if Web Development Foundations becomes too broad."
		]
	},
	{
		id: "security",
		title: "Network, Low-Level, and Systems Security",
		adminPriority: "urgent",
		courseIds: [
			"network-security",
			"low-level-security",
			"low-level-security-part-2"
		],
		audience:
			"Students who need careful, ethical, local-only security education grounded in threat modeling, evidence collection, impact, and defensive remediation.",
		prerequisiteSummary:
			"Key idea: Command-line basics and enough networking, systems, or C/C++ context to understand the specific security course they are taking.",
		outcomes: [
			"Write threat models, identify assets and trust boundaries, collect evidence, describe impact, and propose defensive mitigations.",
			"Use local fixtures, intentionally vulnerable examples, owned targets, or provided packet captures to study security behavior safely.",
			"Connect network, memory, binary, and systems concepts to defensive hardening, detection, and reporting."
		],
		sequencingNotes: [
			"Network Systems should precede Network Security if students lack routing, DNS, HTTP/TLS, NAT, firewall, or packet-capture basics.",
			"Low-Level Security should follow C/C++ memory and systems basics.",
			"Part 2 should add deeper evidence, exploitation theory, mitigations, and reporting only inside the approved lab boundary."
		],
		projectExpectations: [
			"Threat-model worksheet with assets, actors, boundaries, abuse cases, evidence to collect, and mitigations.",
			"Local vulnerable-app or packet-capture lab with exact evidence, impact, and remediation.",
			"Hardening project that changes a configuration and verifies the defensive result with rollback notes."
		],
		assessmentStyle: [
			"Grade evidence quality, impact explanation, remediation, and ethical boundary compliance.",
			"Distinguish vulnerability, exploitability, impact, and fix.",
			"Include a short report rather than only screenshots or command output."
		],
		sourceAndTooling: [
			"Use OWASP, RFCs, local VMs/containers, provided captures, and intentionally vulnerable toy fixtures.",
			"Keep a prohibited-activities checklist and approved-target policy attached to the course.",
			"Use defensive verification scripts where possible."
		],
		safetyAndAccess: [
			"Prohibited: scanning third-party systems, attacking real services, bypassing access controls, credential harvesting, or using another person's data.",
			"Allowed: local fixtures, owned test systems, toy examples, provided captures, and defensive hardening.",
			"Every lab must end with evidence, impact, and mitigation.",
			"Every security project should state its Bloom-level goal, allowed target, prohibited activity, required artifact, and shutdown or cleanup condition before any tool is used."
		],
		adminExpansionBacklog: [
			"Publish a security prerequisite and course-boundary matrix.",
			"Add local-only lab manifests and explicit prohibited-activity text to every security course.",
			"Add more report-writing and remediation rubrics.",
			"Attach a visible safety matrix to each security course family to distinguish defensive analysis from prohibited activity."
		]
	}
];

export const coursePublicPathwayByCourseId = new Map<
	string,
	CoursePublicPathway
>();

for (const pathway of coursePublicPathways) {
	for (const courseId of pathway.courseIds) {
		coursePublicPathwayByCourseId.set(courseId, pathway);
	}
}

export function getCoursePublicPathway(courseId: string) {
	return coursePublicPathwayByCourseId.get(courseId) ?? null;
}
