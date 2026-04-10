import type { RawCourse, RawCourseModuleItem } from "./types";

const DESIGN_PATTERNS_CPP_REPO =
	"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main";

function starterRepoLink(projectId: string) {
	return `${DESIGN_PATTERNS_CPP_REPO}/${projectId}/starter`;
}

function solutionRepoLink(projectId: string) {
	return `${DESIGN_PATTERNS_CPP_REPO}/${projectId}/solution`;
}

function projectItem(
	title: string,
	content: string,
	projectId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: starterRepoLink(projectId),
		solutionLink: solutionRepoLink(projectId)
	};
}

function comparisonDrill(
	unitTitle: string,
	prompt: string
): RawCourseModuleItem {
	return {
		title: `Modern C++ Comparison: ${unitTitle}`,
		content: `For ${unitTitle.toLowerCase()}, compare a textbook heap-heavy version, a modern C++ version, and one short reason the modern version changes shape. ${prompt}`
	};
}

function refactorChecklist(title: string, focus: string): RawCourseModuleItem {
	return {
		title: `Refactor Checklist: ${title}`,
		content: `Before rewriting anything in ${title.toLowerCase()}, note the ownership model, the most fragile lifetime edge, the boundary that should become clearer, and one specific cleanup move about ${focus}.`
	};
}

export const designPatternsInCppCourse: RawCourse = {
	name: "Design Patterns in C++",
	modules: [
		{
			title: "DPC0 Setup and Tooling",
			curriculum: [
				{
					title: "Modern C++ Toolchain Baseline",
					content:
						"Standardize on `CLion` or `VS Code` with a working compiler, debugger, and `CMake` before introducing any pattern work. This course assumes multi-file builds, repeatable compile commands, and debugger access from the first unit."
				},
				{
					title: "Compiler, CMake, and Debugger Verification",
					content:
						"Verify `clang++ --version` or `g++ --version`, `cmake --version`, and `lldb --version` or `gdb --version` up front. Students should prove that they can configure, build, run, and inspect a multi-target project before the first architecture lab."
				},
				{
					title: "Sanitizers and Warnings as Design Feedback",
					content:
						"Treat warnings, debug stepping, and sanitizers as architecture tools rather than as last-minute cleanup. Lifetime mistakes, ownership confusion, and invalid references should be surfaced concretely while the design is still small."
				},
				{
					title: "Why CMake Matters Here",
					content:
						"Use `CMake` to normalize repeatable builds across starter and solution projects. The goal is to make medium-sized C++ structure feel normal so patterns are learned in realistic code rather than isolated snippets."
				}
			],
			supplementalProjects: [
				comparisonDrill(
					"Setup and Tooling",
					"Explicitly call out where debugger access and warnings would catch a design mistake earlier than visual inspection alone."
				),
				refactorChecklist(
					"Setup and Tooling",
					"how build repeatability keeps future refactors safe"
				)
			]
		},
		{
			title: "DPC1 Why Patterns Look Different in Modern C++",
			curriculum: [
				{
					title: "Ownership Changes the Conversation",
					content:
						"Start with object ownership, RAII, and stack-versus-heap decisions. Students should understand that lifetime is part of architecture in C++, so some textbook patterns must be rewritten to avoid careless heap graphs."
				},
				{
					title: "Value Semantics versus Reference Semantics",
					content:
						"Teach when a plain value type or small immutable object removes the need for a pattern entirely. C++ students should learn that some creation and wrapper patterns only become justified once polymorphism, shared lifetime, or runtime variability is actually needed."
				},
				{
					title: "Composition over Inheritance with Lifetime in View",
					content:
						"Reinforce composition as the default, but make the reason concrete: fewer fragile inheritance trees, clearer ownership, and easier resource cleanup. The design choice should be explained in terms of safety and maintainability, not fashion."
				},
				{
					title: "Runtime versus Compile-Time Variation",
					content:
						"Introduce the idea that C++ can express flexibility through either runtime polymorphism or template-based compile-time structure. Students should begin spotting when a classic pattern remains useful and when a policy or value type is the cleaner fit."
				}
			],
			supplementalProjects: [
				comparisonDrill(
					"Why Patterns Look Different in Modern C++",
					"Name one case where a Java-style heap allocation would be replaced by a stack object, smart pointer, or value type."
				),
				refactorChecklist(
					"Why Patterns Look Different in Modern C++",
					"which pattern pressures disappear once value semantics are available"
				)
			]
		},
		{
			title: "DPC2 Design Foundations",
			curriculum: [
				{
					title: "Abstract Base Classes, Interfaces, and Contracts",
					content:
						"Use abstract base classes intentionally for runtime polymorphism rather than as a default wrapper around every class. Students should understand when an interface is clarifying a seam and when it is merely copying Java habits."
				},
				{
					title: "Const-Correctness and Dependency Direction",
					content:
						"Make `const` part of the design language, not a syntax detail. Clear read-only boundaries help students reason about collaboration, ownership, and mutation before the first major pattern refactor."
				},
				{
					title: "Header and Source Organization",
					content:
						"Teach students to split declarations, implementations, and stable boundaries cleanly. This course should treat file organization, include discipline, and smaller APIs as part of good architecture."
				},
				{
					title: "Practical Move Semantics",
					content:
						"Frame move semantics around obvious ownership transfer instead of abstract rules. Students should be able to explain when move-only types make a design safer and when copying a value remains perfectly appropriate."
				}
			],
			supplementalProjects: [
				comparisonDrill(
					"Design Foundations",
					"Compare an abstract-base-class seam with a simple value object or template and explain which one better fits the boundary."
				),
				refactorChecklist(
					"Design Foundations",
					"how const-correctness and include discipline reduce later architectural noise"
				)
			]
		},
		{
			title: "DPC3 Factory Method, Abstract Factory, and Builder",
			curriculum: [
				{
					title: "Ownership-Aware Creation",
					content:
						"Teach factory patterns through ownership and compatibility questions first. Students should explicitly decide when a factory returns a value, `unique_ptr`, or another handle type rather than copying a Java constructor wrapper blindly."
				},
				{
					title: "Abstract Factory for Coordinated Families",
					content:
						"Use Abstract Factory when product families must vary together, such as themed UI pieces or environment-specific toolchains. The emphasis is on keeping families internally compatible, not on maximizing the number of classes."
				},
				{
					title: "Builder for Configuration-Heavy Setup",
					content:
						"Use Builder when setup becomes order-sensitive, verbose, or full of optional pieces. In modern C++, students should compare Builder against value-type configuration structs and direct construction before escalating."
				},
				{
					title: "Creation Tradeoffs in Practice",
					content:
						"Require students to justify whether the real pressure is family selection, staged assembly, or both. The right creation pattern should emerge from readability and ownership clarity, not from catalog completion."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Factories and Builders Workshop",
					"Build a theme-aware dashboard where an abstract factory coordinates widget families and a builder assembles the final layout. The lab is mainly about ownership-safe creation, not decorative object factories.",
					"DPC1-Factories-and-Builders-Workshop"
				),
				comparisonDrill(
					"Factory Method, Abstract Factory, and Builder",
					"Explain when a plain value object or named constructor would be enough and when a full builder earns its keep."
				)
			]
		},
		{
			title: "DPC4 Strategy and Policy-Based Design",
			curriculum: [
				{
					title: "Runtime Strategy Objects",
					content:
						"Teach Strategy first in its classic runtime-polymorphism form so students can reason about swappable behavior. Use pricing, scoring, or routing rules where the runtime choice is a genuine product requirement."
				},
				{
					title: "Lambdas and Function Objects",
					content:
						"Show how lambdas and lightweight callables often cover the same design need with less ceremony. Students should feel the difference between a full strategy family and a short-lived behavior injection."
				},
				{
					title: "Policy-Based Design with Templates",
					content:
						"Introduce policy-based design when the variability is known at compile time and the code benefits from avoiding runtime dispatch. The lesson should emphasize the tradeoff rather than claiming templates are always better."
				},
				{
					title: "Choosing Runtime versus Compile-Time Flexibility",
					content:
						"Require students to justify whether the design needs late binding, test seams, and plugin-style variability, or whether compile-time selection is cleaner. This is one of the core judgment moves in modern C++ architecture."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Strategy and Policy Simulator",
					"Compare runtime discount strategies with compile-time shipping policies in one small simulator. The point is to make the runtime-versus-template tradeoff visible instead of treating both as interchangeable abstractions.",
					"DPC2-Strategy-and-Policy-Simulator"
				),
				comparisonDrill(
					"Strategy and Policy-Based Design",
					"State which variation belongs at runtime and which should be a template policy, then name one maintenance consequence of that decision."
				)
			]
		},
		{
			title: "DPC5 Observer and Event Flow",
			curriculum: [
				{
					title: "Subscriptions and Event Fan-Out",
					content:
						"Teach Observer as a controlled way to notify multiple listeners without hard-coding downstream reactions into the publisher. Use event fan-out, logs, dashboards, and alerts as realistic examples rather than abstract listener diagrams."
				},
				{
					title: "Lifetime-Safe Listener Storage",
					content:
						"Make listener lifetime the central C++ wrinkle. Students should explicitly compare raw pointers, references, shared ownership, and `weak_ptr` so they can avoid dangling callbacks and stale subscriptions."
				},
				{
					title: "Push versus Pull Models",
					content:
						"Show how an event payload can either push full data immediately or require listeners to pull details later. The better choice depends on coupling, cost, and how long the source object remains valid."
				},
				{
					title: "Failure Handling and Event Hygiene",
					content:
						"Discuss duplicate subscriptions, expired listeners, ordering, and escalation behavior. Observer should be taught as a real operational system with edge cases, not as free decoupling."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Observer Event Hub",
					"Build an event hub that stores listeners safely, publishes notifications, and keeps a summary view alive without dangling references. The goal is to make ownership part of the pattern discussion rather than an afterthought.",
					"DPC3-Observer-Event-Hub"
				),
				comparisonDrill(
					"Observer and Event Flow",
					"Explain why a weak subscription model is safer than a raw callback list once listeners can disappear independently."
				)
			]
		},
		{
			title: "DPC6 Decorator, Adapter, and Facade",
			curriculum: [
				{
					title: "Decorator with Ownership Clarity",
					content:
						"Teach Decorator as a way to layer behavior without exploding subclasses. In C++, students should explicitly justify whether the wrapper owns the wrapped object, borrows it, or shares it."
				},
				{
					title: "Adapter for Legacy or Third-Party APIs",
					content:
						"Use Adapter when an old or external interface does not match the current domain boundary. The key lesson is to preserve the clean client-side contract rather than leak the odd legacy shape everywhere."
				},
				{
					title: "Facade for Subsystem Cleanup",
					content:
						"Use Facade when a subsystem currently exposes too much detail. Students should understand that a facade simplifies a boundary; it should not become another oversized god object."
				},
				{
					title: "Boundary Choice before Pattern Choice",
					content:
						"Require students to decide whether the real problem is layered behavior, mismatched APIs, or subsystem sprawl. The right pattern should follow from the boundary issue, not from terminology alone."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Facade Adapter Import Tool",
					"Wrap mismatched import formats behind adapters and expose them through a single import facade. The lab is about keeping legacy integration pressure out of the main domain model.",
					"DPC4-Facade-Adapter-Import-Tool"
				),
				comparisonDrill(
					"Decorator, Adapter, and Facade",
					"Name which layer owns the wrapped object and why that ownership choice matters for cleanup and testability."
				)
			]
		},
		{
			title: "DPC7 Command and State",
			curriculum: [
				{
					title: "Commands as Explicit User or System Actions",
					content:
						"Teach Command as a way to package actions, queue work, and make undo or history possible. Good command objects should represent meaningful behavior transitions rather than merely wrapping one-line functions."
				},
				{
					title: "Undo and Action History",
					content:
						"Use action history to make the design consequences concrete. Students should reason about what state a command must capture before execution if it wants to undo safely later."
				},
				{
					title: "State Objects versus Enum-Driven Branching",
					content:
						"Compare explicit State objects with large conditionals driven by enums or flags. The lesson should focus on when the branching pressure is big enough that separate state behavior is clearer and safer."
				},
				{
					title: "Queues, Modes, and Control Flow",
					content:
						"Combine Command and State in an editor-style or simulator-style example where mode affects what commands are legal. This keeps the patterns tied to real workflow constraints."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Command and State Editor",
					"Build a tiny editor that changes behavior by mode and records work through commands instead of sprawling control flow. The important judgment move is deciding what belongs in the command, what belongs in the state, and what should stay simple.",
					"DPC5-Command-and-State-Editor"
				),
				comparisonDrill(
					"Command and State",
					"Explain which branch logic should become a state object and which action should remain a small command without extra framework overhead."
				)
			]
		},
		{
			title: "DPC8 Composite and Iterator",
			curriculum: [
				{
					title: "Trees of Heterogeneous Objects",
					content:
						"Teach Composite through scene graphs, widget trees, or editor hierarchies where leaf and container nodes must share a common interface. The lesson should make structural recursion feel useful rather than ornamental."
				},
				{
					title: "Traversal without Leaking Storage Details",
					content:
						"Show how traversal helpers and iterator-style views can keep callers from depending on the exact child container structure. Students should learn that exposing raw containers too eagerly weakens the abstraction."
				},
				{
					title: "Uniform Operations and Boundary Limits",
					content:
						"Use rendering, flattening, or inspection operations to show the upside of a unified interface. Then discuss the limit: not every operation belongs uniformly on both leaves and groups."
				},
				{
					title: "Container Exposure Tradeoffs",
					content:
						"Require students to justify whether they expose iterators, flattened snapshots, visitor-style helpers, or no traversal API at all. C++ gives several options, so the abstraction should be deliberate."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Composite Scene Tree",
					"Represent a heterogeneous scene tree and add a traversal helper that hides the raw child-storage details from callers. The lab keeps the pattern grounded in structural clarity rather than diagram memorization.",
					"DPC6-Composite-Scene-Tree"
				),
				comparisonDrill(
					"Composite and Iterator",
					"Explain why a flattened traversal helper can be cleaner than giving every caller direct access to the child vector."
				)
			]
		},
		{
			title: "DPC9 Singleton, Global State, and Dependency Injection",
			curriculum: [
				{
					title: "Why Singleton Is Attractive",
					content:
						"Present Singleton honestly as a tempting shortcut for configuration, logging, and shared services. Students should see why it feels convenient before the course critiques the tradeoffs."
				},
				{
					title: "The Real Risks",
					content:
						"Teach hidden dependencies, static initialization problems, weak test seams, and lifetime ambiguity as the real costs of global state. In C++, static lifetime also brings concrete order-of-initialization concerns that cannot be hand-waved away."
				},
				{
					title: "Scoped Services and Injected Dependencies",
					content:
						"Show how dependency injection and well-scoped service objects often solve the same coordination problem more safely. The design improvement is not just ideological; it makes construction order and ownership explicit."
				},
				{
					title: "When a Global Really Is Global",
					content:
						"Allow for rare cases where a process-wide singleton is justified, but require students to explain why narrower ownership failed first. This unit should end with skepticism, not prohibition for its own sake."
				}
			],
			supplementalProjects: [
				comparisonDrill(
					"Singleton, Global State, and Dependency Injection",
					"Compare one static global service with one injected service and state which design makes lifetime and testing clearer."
				),
				refactorChecklist(
					"Singleton, Global State, and Dependency Injection",
					"which dependency should be passed explicitly instead of hidden behind a static accessor"
				)
			]
		},
		{
			title: "DPC10 Patterns for Resource Management",
			curriculum: [
				{
					title: "RAII Wrappers as Architectural Tools",
					content:
						"Teach RAII wrappers as part of the design-pattern conversation, not as a separate memory lecture. A good wrapper makes ownership obvious and impossible to misuse accidentally."
				},
				{
					title: "pImpl and Boundary Stability",
					content:
						"Use `pImpl` when a public type needs a stable boundary while implementation details stay private. Students should connect this to compile-time hygiene, binary boundaries, and reduced include sprawl."
				},
				{
					title: "Scope Guards and Cleanup Discipline",
					content:
						"Introduce scope guards for temporary setup and teardown cases where a dedicated wrapper would be too heavy. The point is to show how C++ often solves resource problems with small ownership tools instead of giant frameworks."
				},
				{
					title: "Caches, Handles, and Shared Ownership Decisions",
					content:
						"Discuss when a resource cache should share ownership and when a move-only handle is safer. Students should justify the ownership graph explicitly instead of guessing at what feels convenient."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: RAII Resource Manager",
					"Wrap fake engine resources in move-only handles, hide details behind `pImpl`, and compare direct ownership with a small cache. This lab translates resource-management pressure into concrete design choices.",
					"DPC7-RAII-Resource-Manager"
				),
				comparisonDrill(
					"Patterns for Resource Management",
					"Name which part of the design should be move-only, which part can share ownership, and why a scope guard is enough for temporary cleanup."
				)
			]
		},
		{
			title: "DPC11 Legacy Refactoring Lab",
			curriculum: [
				{
					title: "Diagnosing Inheritance and Raw-Pointer Debt",
					content:
						"Start from a design that still runs but hides ownership, creation, and variation inside raw pointers or switch-heavy control flow. Students should identify the dominant smells before proposing any pattern."
				},
				{
					title: "Reducing Implicit Ownership",
					content:
						"Refactor the dangerous lifetime edges first by replacing implicit ownership with values, `unique_ptr`, or other explicit handles. This keeps later pattern work from standing on an unsafe memory model."
				},
				{
					title: "Separating Responsibilities",
					content:
						"Split construction, delivery behavior, priority rules, and subsystem coordination into their proper places. The right pattern choices should emerge from this responsibility cleanup rather than from a predetermined checklist."
				},
				{
					title: "Compile-Time and Runtime Clarity",
					content:
						"Ask students to explain not just why the new design is safer, but also why it is easier to build, reason about, and debug. C++ refactoring should improve both lifetime correctness and day-to-day clarity."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Legacy Refactor Capstone",
					"Start from a switch-heavy, raw-pointer dispatch flow and rebuild it with explicit ownership, a small factory, and a dispatch facade. The important skill is targeted cleanup, not pattern collecting for its own sake.",
					"DPC8-Legacy-Refactor-Capstone"
				),
				refactorChecklist(
					"Legacy Refactoring Lab",
					"which pattern actually solves the current smell instead of merely renaming the mess"
				)
			]
		},
		{
			title: "DPC12 Capstone Studio",
			curriculum: [
				{
					title: "Choosing the Right Medium-Sized Problem",
					content:
						"Use a medium-sized engine, editor tool, simulation framework, or importer pipeline as the capstone target. The project should be large enough for real boundary pressure, but still small enough that students can justify every abstraction they add."
				},
				{
					title: "Pattern Justification as a Required Deliverable",
					content:
						"Require students to name each pattern or C++ ownership tool in the capstone and explain which flexibility, lifetime, or testability pressure it solves. A pattern with no stated pressure should be treated as suspect."
				},
				{
					title: "Runtime and Compile-Time Tradeoff Review",
					content:
						"Ask students to review where they chose runtime polymorphism, where they chose compile-time structure, and where they stayed with plain values or small helpers. This keeps the course anchored in judgment rather than catalogue recall."
				},
				{
					title: "Debugging and Sanitizer Readiness",
					content:
						"Capstone work should still be verified through warnings, debugger runs, and targeted sanitizer checks where available. Students should finish the course with the expectation that a design is not complete until it survives inspection."
				}
			],
			supplementalProjects: [
				comparisonDrill(
					"Capstone Studio",
					"Summarize one textbook pattern choice, one modern C++ adaptation, and one place where the cleanest answer was to stay simpler than the textbook."
				),
				refactorChecklist(
					"Capstone Studio",
					"which ownership or boundary choice most improved the final project"
				)
			]
		}
	]
};
