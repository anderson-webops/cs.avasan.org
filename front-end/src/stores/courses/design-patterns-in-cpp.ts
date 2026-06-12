import type { RawCourse } from "./types";
import { buildProjectGuidance } from "./projectGuidance";

export const designPatternsInCppCourse: RawCourse = {
	name: "Design Patterns in C++",
	modules: [
		{
			title: "DPC0 Setup and Tooling",
			curriculum: [
				{
					title: "Modern C++ Toolchain Baseline",
					content:
						"Standardize on `CLion` or `VS Code` with a working compiler, debugger, and `CMake` before introducing any pattern work. This course assumes multi-file builds, repeatable compile commands, debugger access, and the modern C++ habits developed in `C++ Level 3` or equivalent experience."
				},
				{
					title: "Compiler, CMake, and Debugger Verification",
					content:
						"Verify `clang++ --version` or `g++ --version`, `cmake --version`, and `lldb --version` or `gdb --version` up front. Prove that they can configure, build, run, and inspect a multi-target project before the first architecture lab."
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
				},
				{
					title: "DPC0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC0 Setup and Tooling",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-05-dpc0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-05-dpc0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Setup and Tooling",
					content:
						"For setup and tooling, compare a textbook heap-heavy version, a modern C++ version, and one short reason the modern version changes shape. Explicitly call out where debugger access and warnings would catch a design mistake earlier than visual inspection alone.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-05-dpc0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-05-dpc0-setup-and-tooling/solution"
				},
				{
					title: "Setup and Tooling supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-01-dpc0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-01-dpc0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-02-dpc0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-02-dpc0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC1 Why Patterns Look Different in Modern C++",
			curriculum: [
				{
					title: "Ownership Changes the Conversation",
					content:
						"Start with object ownership, RAII, and stack-versus-heap decisions. Key idea: Lifetime is part of architecture in C++, so some textbook patterns must be rewritten to avoid careless heap graphs."
				},
				{
					title: "Value Semantics versus Reference Semantics",
					content:
						"A plain value type or small immutable object can remove the need for a pattern entirely. In C++, some creation and wrapper patterns only become justified once polymorphism, shared lifetime, or runtime variability is actually needed."
				},
				{
					title: "Composition over Inheritance with Lifetime in View",
					content:
						"Reinforce composition as the default, but make the reason concrete: fewer fragile inheritance trees, clearer ownership, and easier resource cleanup. The design choice should be explained in terms of safety and maintainability, not fashion."
				},
				{
					title: "Runtime versus Compile-Time Variation",
					content:
						"Introduce the idea that C++ can express flexibility through either runtime polymorphism or template-based compile-time structure. Begin spotting when a classic pattern remains useful and when a policy or value type is the cleaner fit."
				},
				{
					title: "DPC1 Why Patterns Look Different in Modern C++: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DPC1 Why Patterns Look Different in Modern C++",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-06-dpc1-why-patterns-look-different-in-modern-cpp/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-06-dpc1-why-patterns-look-different-in-modern-cpp/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Why Patterns Look Different in Modern C++",
					content:
						"For why patterns look different in modern c++, compare a textbook heap-heavy version, a modern C++ version, and one short reason the modern version changes shape. Name one case where a Java-style heap allocation would be replaced by a stack object, smart pointer, or value type.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-06-dpc1-why-patterns-look-different-in-modern-cpp/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-06-dpc1-why-patterns-look-different-in-modern-cpp/solution"
				},
				{
					title: "Why Patterns Look Different in Modern C++ supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DPC1 Why Patterns Look Different in Modern C++",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-03-dpc1-why-patterns-look-different-in-modern-cpp-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-03-dpc1-why-patterns-look-different-in-modern-cpp-supplemental-2/solution"
				},
				{
					title: "Why Patterns Look Different in Modern C++ supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DPC1 Why Patterns Look Different in Modern C++",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-04-dpc1-why-patterns-look-different-in-modern-cpp-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-04-dpc1-why-patterns-look-different-in-modern-cpp-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC2 Design Foundations",
			curriculum: [
				{
					title: "Abstract Base Classes, Interfaces, and Contracts",
					content:
						"Use abstract base classes intentionally for runtime polymorphism rather than as a default wrapper around every class. Key idea: When an interface is clarifying a seam and when it is merely copying Java habits."
				},
				{
					title: "Const-Correctness and Dependency Direction",
					content:
						"Make `const` part of the design language, not a syntax detail. Clear read-only boundaries help clarify collaboration, ownership, and mutation before the first major pattern refactor."
				},
				{
					title: "Header and Source Organization",
					content:
						"Split declarations, implementations, and stable boundaries cleanly. This course should treat file organization, include discipline, and smaller APIs as part of good architecture."
				},
				{
					title: "Practical Move Semantics",
					content:
						"Frame move semantics around obvious ownership transfer instead of abstract rules. Skill target: Explain when move-only types make a design safer and when copying a value remains perfectly appropriate."
				},
				{
					title: "DPC2 Design Foundations: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC2 Design Foundations",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-07-dpc2-design-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-07-dpc2-design-foundations/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Design Foundations",
					content:
						"For design foundations, compare a textbook heap-heavy version, a modern C++ version, and one short reason the modern version changes shape. Compare an abstract-base-class seam with a simple value object or template and explain which one better fits the boundary.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-07-dpc2-design-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-07-dpc2-design-foundations/solution"
				},
				{
					title: "Design Foundations supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC2 Design Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-05-dpc2-design-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-05-dpc2-design-foundations-supplemental-2/solution"
				},
				{
					title: "Design Foundations supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC2 Design Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-06-dpc2-design-foundations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-06-dpc2-design-foundations-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC3 Factory Method, Abstract Factory, and Builder",
			curriculum: [
				{
					title: "Ownership-Aware Creation",
					content:
						"Factory patterns should start with ownership and compatibility questions. Explicitly decide when a factory returns a value, `unique_ptr`, or another handle type rather than copying a Java constructor wrapper blindly."
				},
				{
					title: "Abstract Factory for Coordinated Families",
					content:
						"Use Abstract Factory when product families must vary together, such as themed UI pieces or environment-specific toolchains. The emphasis is on keeping families internally compatible, not on maximizing the number of classes."
				},
				{
					title: "Builder for Configuration-Heavy Setup",
					content:
						"Use Builder when setup becomes order-sensitive, verbose, or full of optional pieces. In modern C++, Compare Builder against value-type configuration structs and direct construction before escalating."
				},
				{
					title: "Creation Tradeoffs in Practice",
					content:
						"Justify whether the real pressure is family selection, staged assembly, or both. The right creation pattern should emerge from readability and ownership clarity, not from catalog completion."
				},
				{
					title: "DPC3 Factory Method, Abstract Factory, and Builder: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DPC3 Factory Method, Abstract Factory, and Builder",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC1-Factories-and-Builders-Workshop/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC1-Factories-and-Builders-Workshop/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Factories and Builders Workshop",
					content:
						"Build a theme-aware dashboard where an abstract factory coordinates widget families and a builder assembles the final layout. The lab is mainly about ownership-safe creation, not decorative object factories.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC1-Factories-and-Builders-Workshop/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC1-Factories-and-Builders-Workshop/solution"
				},
				{
					title: "Factory Method, Abstract Factory, and Builder supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DPC3 Factory Method, Abstract Factory, and Builder",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-07-dpc3-factory-method-abstract-factory-and-builder-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-07-dpc3-factory-method-abstract-factory-and-builder-supplemental-2/solution"
				},
				{
					title: "Factory Method, Abstract Factory, and Builder supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DPC3 Factory Method, Abstract Factory, and Builder",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-08-dpc3-factory-method-abstract-factory-and-builder-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-08-dpc3-factory-method-abstract-factory-and-builder-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC4 Strategy and Policy-Based Design",
			curriculum: [
				{
					title: "Runtime Strategy Objects",
					content:
						"Strategy should first appear in its classic runtime-polymorphism form so swappable behavior is easy to reason about. Use pricing, scoring, or routing rules where the runtime choice is a genuine product requirement."
				},
				{
					title: "Lambdas and Function Objects",
					content:
						"Show how lambdas and lightweight callables often cover the same design need with less ceremony. Feel the difference between a full strategy family and a short-lived behavior injection."
				},
				{
					title: "Policy-Based Design with Templates",
					content:
						"Introduce policy-based design when the variability is known at compile time and the code benefits from avoiding runtime dispatch. The lesson should emphasize the tradeoff rather than claiming templates are always better."
				},
				{
					title: "Choosing Runtime versus Compile-Time Flexibility",
					content:
						"Justify whether the design needs late binding, test seams, and plugin-style variability, or whether compile-time selection is cleaner. This is one of the core judgment moves in modern C++ architecture."
				},
				{
					title: "DPC4 Strategy and Policy-Based Design: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC4 Strategy and Policy-Based Design",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC2-Strategy-and-Policy-Simulator/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC2-Strategy-and-Policy-Simulator/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Strategy and Policy Simulator",
					content:
						"Compare runtime discount strategies with compile-time shipping policies in one small simulator. The point is to make the runtime-versus-template tradeoff visible instead of treating both as interchangeable abstractions.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC2-Strategy-and-Policy-Simulator/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC2-Strategy-and-Policy-Simulator/solution"
				},
				{
					title: "Strategy and Policy Based Design supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC4 Strategy and Policy-Based Design",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-09-dpc4-strategy-and-policy-based-design-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-09-dpc4-strategy-and-policy-based-design-supplemental-2/solution"
				},
				{
					title: "Strategy and Policy Based Design supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC4 Strategy and Policy-Based Design",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-10-dpc4-strategy-and-policy-based-design-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-10-dpc4-strategy-and-policy-based-design-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC5 Observer and Event Flow",
			curriculum: [
				{
					title: "Subscriptions and Event Fan-Out",
					content:
						"Observer is a controlled way to notify multiple listeners without hard-coding downstream reactions into the publisher. Use event fan-out, logs, dashboards, and alerts as realistic examples rather than abstract listener diagrams."
				},
				{
					title: "Lifetime-Safe Listener Storage",
					content:
						"Make listener lifetime the central C++ wrinkle. Explicitly compare raw pointers, references, shared ownership, and `weak_ptr` so they can avoid dangling callbacks and stale subscriptions."
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
				},
				{
					title: "DPC5 Observer and Event Flow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC5 Observer and Event Flow",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC3-Observer-Event-Hub/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC3-Observer-Event-Hub/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Observer Event Hub",
					content:
						"Build an event hub that stores listeners safely, publishes notifications, and keeps a summary view alive without dangling references. The goal is to make ownership part of the pattern discussion rather than an afterthought.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC3-Observer-Event-Hub/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC3-Observer-Event-Hub/solution"
				},
				{
					title: "Observer and Event Flow supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC5 Observer and Event Flow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-11-dpc5-observer-and-event-flow-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-11-dpc5-observer-and-event-flow-supplemental-2/solution"
				},
				{
					title: "Observer and Event Flow supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC5 Observer and Event Flow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-12-dpc5-observer-and-event-flow-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-12-dpc5-observer-and-event-flow-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC6 Decorator, Adapter, and Facade",
			curriculum: [
				{
					title: "Decorator with Ownership Clarity",
					content:
						"Decorator layers behavior without exploding subclasses. In C++, explicitly justify whether the wrapper owns the wrapped object, borrows it, or shares it."
				},
				{
					title: "Adapter for Legacy or Third-Party APIs",
					content:
						"Use Adapter when an old or external interface does not match the current domain boundary. The key lesson is to preserve the clean client-side contract rather than leak the odd legacy shape everywhere."
				},
				{
					title: "Facade for Subsystem Cleanup",
					content:
						"Use Facade when a subsystem currently exposes too much detail. Key idea: A facade simplifies a boundary; it should not become another oversized god object."
				},
				{
					title: "Boundary Choice before Pattern Choice",
					content:
						"Decide whether the real problem is layered behavior, mismatched APIs, or subsystem sprawl. The right pattern should follow from the boundary issue, not from terminology alone."
				},
				{
					title: "DPC6 Decorator, Adapter, and Facade: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC6 Decorator, Adapter, and Facade",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC4-Facade-Adapter-Import-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC4-Facade-Adapter-Import-Tool/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Facade Adapter Import Tool",
					content:
						"Wrap mismatched import formats behind adapters and expose them through a single import facade. The lab is about keeping legacy integration pressure out of the main domain model.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC4-Facade-Adapter-Import-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC4-Facade-Adapter-Import-Tool/solution"
				},
				{
					title: "Decorator, Adapter, and Facade supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC6 Decorator, Adapter, and Facade",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-13-dpc6-decorator-adapter-and-facade-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-13-dpc6-decorator-adapter-and-facade-supplemental-2/solution"
				},
				{
					title: "Decorator, Adapter, and Facade supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC6 Decorator, Adapter, and Facade",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-14-dpc6-decorator-adapter-and-facade-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-14-dpc6-decorator-adapter-and-facade-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC7 Command and State",
			curriculum: [
				{
					title: "Commands as Explicit User or System Actions",
					content:
						"Command packages actions, queues work, and makes undo or history possible. Good command objects should represent meaningful behavior transitions rather than merely wrapping one-line functions."
				},
				{
					title: "Undo and Action History",
					content:
						"Use action history to make the design consequences concrete. Reason about what state a command must capture before execution if it wants to undo safely later."
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
				},
				{
					title: "Command Parsing without a Giant Switch",
					content:
						"Use the CS236 scanner/parser pipeline as a design-pattern bridge: raw text can become tokens, tokens can become command objects, and state objects can decide whether each command is currently legal. Still recognize when a simple `switch` is enough and when the command surface has grown past it."
				},
				{
					title: "DPC7 Command and State: Core Project",
					content:
						"Extend the command editor with a tiny scanner that turns text commands into command objects.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC5-Command-and-State-Editor/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC5-Command-and-State-Editor/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Command and State Editor",
					content:
						"Build a tiny editor that changes behavior by mode and records work through commands instead of sprawling control flow. The important judgment move is deciding what belongs in the command, what belongs in the state, and what should stay simple.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC5-Command-and-State-Editor/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC5-Command-and-State-Editor/solution"
				},
				{
					title: "Command and State supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC7 Command and State",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-15-dpc7-command-and-state-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-15-dpc7-command-and-state-supplemental-2/solution"
				},
				{
					title: "Command and State supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC7 Command and State",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-16-dpc7-command-and-state-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-16-dpc7-command-and-state-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC8 Composite and Iterator",
			curriculum: [
				{
					title: "Trees of Heterogeneous Objects",
					content:
						"Composite works well for scene graphs, widget trees, or editor hierarchies where leaf and container nodes must share a common interface. The lesson should make structural recursion feel useful rather than ornamental."
				},
				{
					title: "Traversal without Leaking Storage Details",
					content:
						"Show how traversal helpers and iterator-style views can keep callers from depending on the exact child container structure. Learn that exposing raw containers too eagerly weakens the abstraction."
				},
				{
					title: "Uniform Operations and Boundary Limits",
					content:
						"Use rendering, flattening, or inspection operations to show the upside of a unified interface. Then discuss the limit: not every operation belongs uniformly on both leaves and groups."
				},
				{
					title: "Container Exposure Tradeoffs",
					content:
						"Justify whether to expose iterators, flattened snapshots, visitor-style helpers, or no traversal API at all. C++ gives several options, so the abstraction should be deliberate."
				},
				{
					title: "DPC8 Composite and Iterator: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC8 Composite and Iterator",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC6-Composite-Scene-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC6-Composite-Scene-Tree/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Composite Scene Tree",
					content:
						"Represent a heterogeneous scene tree and add a traversal helper that hides the raw child-storage details from callers. The lab keeps the pattern grounded in structural clarity rather than diagram memorization.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC6-Composite-Scene-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC6-Composite-Scene-Tree/solution"
				},
				{
					title: "Composite and Iterator supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC8 Composite and Iterator",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-17-dpc8-composite-and-iterator-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-17-dpc8-composite-and-iterator-supplemental-2/solution"
				},
				{
					title: "Composite and Iterator supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC8 Composite and Iterator",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-18-dpc8-composite-and-iterator-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-18-dpc8-composite-and-iterator-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC9 Singleton, Global State, and Dependency Injection",
			curriculum: [
				{
					title: "Why Singleton Is Attractive",
					content:
						"Present Singleton honestly as a tempting shortcut for configuration, logging, and shared services. Visible pattern: Why it feels convenient before the course critiques the tradeoffs."
				},
				{
					title: "The Real Risks",
					content:
						"Hidden dependencies, static initialization problems, weak test seams, and lifetime ambiguity are the real costs of global state. In C++, static lifetime also brings concrete order-of-initialization concerns that cannot be hand-waved away."
				},
				{
					title: "Scoped Services and Injected Dependencies",
					content:
						"Show how dependency injection and well-scoped service objects often solve the same coordination problem more safely. The design improvement is not just ideological; it makes construction order and ownership explicit."
				},
				{
					title: "When a Global Really Is Global",
					content:
						"Allow for rare cases where a process-wide singleton is justified, but explain why narrower ownership failed first. This unit should end with skepticism, not prohibition for its own sake."
				},
				{
					title: "DPC9 Singleton, Global State, and Dependency Injection: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DPC9 Singleton, Global State, and Dependency Injection",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-08-dpc9-singleton-global-state-and-dependency-injection/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-08-dpc9-singleton-global-state-and-dependency-injection/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Singleton, Global State, and Dependency Injection",
					content:
						"For singleton, global state, and dependency injection, compare a textbook heap-heavy version, a modern C++ version, and one short reason the modern version changes shape. Compare one static global service with one injected service and state which design makes lifetime and testing clearer.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-08-dpc9-singleton-global-state-and-dependency-injection/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-08-dpc9-singleton-global-state-and-dependency-injection/solution"
				},
				{
					title: "Singleton, Global State, and Dependency Injection supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DPC9 Singleton, Global State, and Dependency Injection",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-19-dpc9-singleton-global-state-and-dependency-injection-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-19-dpc9-singleton-global-state-and-dependency-injection-supplemental-2/solution"
				},
				{
					title: "Singleton, Global State, and Dependency Injection supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"DPC9 Singleton, Global State, and Dependency Injection",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-20-dpc9-singleton-global-state-and-dependency-injection-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-20-dpc9-singleton-global-state-and-dependency-injection-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC10 Patterns for Resource Management",
			curriculum: [
				{
					title: "RAII Wrappers as Architectural Tools",
					content:
						"RAII wrappers belong in the design-pattern conversation, not as a separate memory lecture. A good wrapper makes ownership obvious and impossible to misuse accidentally."
				},
				{
					title: "pImpl and Boundary Stability",
					content:
						"Use `pImpl` when a public type needs a stable boundary while implementation details stay private. Connect this to compile-time hygiene, binary boundaries, and reduced include sprawl."
				},
				{
					title: "Scope Guards and Cleanup Discipline",
					content:
						"Introduce scope guards for temporary setup and teardown cases where a dedicated wrapper would be too heavy. The point is to show how C++ often solves resource problems with small ownership tools instead of giant frameworks."
				},
				{
					title: "Caches, Handles, and Shared Ownership Decisions",
					content:
						"Discuss when a resource cache should share ownership and when a move-only handle is safer. Justify the ownership graph explicitly instead of guessing at what feels convenient."
				},
				{
					title: "DPC10 Patterns for Resource Management: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC10 Patterns for Resource Management",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC7-RAII-Resource-Manager/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC7-RAII-Resource-Manager/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: RAII Resource Manager",
					content:
						"Wrap fake engine resources in move-only handles, hide details behind `pImpl`, and compare direct ownership with a small cache. This lab translates resource-management pressure into concrete design choices.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC7-RAII-Resource-Manager/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC7-RAII-Resource-Manager/solution"
				},
				{
					title: "Patterns for Resource Management supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC10 Patterns for Resource Management",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-21-dpc10-patterns-for-resource-management-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-21-dpc10-patterns-for-resource-management-supplemental-2/solution"
				},
				{
					title: "Patterns for Resource Management supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC10 Patterns for Resource Management",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-22-dpc10-patterns-for-resource-management-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-22-dpc10-patterns-for-resource-management-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC11 Legacy Refactoring Lab",
			curriculum: [
				{
					title: "Diagnosing Inheritance and Raw-Pointer Debt",
					content:
						"Start from a design that still runs but hides ownership, creation, and variation inside raw pointers or switch-heavy control flow. Identify the dominant smells before proposing any pattern."
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
						"Explain not just why the new design is safer, but also why it is easier to build, reason about, and debug. C++ refactoring should improve both lifetime correctness and day-to-day clarity."
				},
				{
					title: "DPC11 Legacy Refactoring Lab: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC11 Legacy Refactoring Lab",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC8-Legacy-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC8-Legacy-Refactor-Capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Legacy Refactor Capstone",
					content:
						"Start from a switch-heavy, raw-pointer dispatch flow and rebuild it with explicit ownership, a small factory, and a dispatch facade. The important skill is targeted cleanup, not pattern collecting for its own sake.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC8-Legacy-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC8-Legacy-Refactor-Capstone/solution"
				},
				{
					title: "Legacy Refactoring Lab supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC11 Legacy Refactoring Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-23-dpc11-legacy-refactoring-lab-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-23-dpc11-legacy-refactoring-lab-supplemental-2/solution"
				},
				{
					title: "Legacy Refactoring Lab supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC11 Legacy Refactoring Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-24-dpc11-legacy-refactoring-lab-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-24-dpc11-legacy-refactoring-lab-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC12 Capstone Studio",
			curriculum: [
				{
					title: "Choosing the Right Medium-Sized Problem",
					content:
						"Use a medium-sized engine, editor tool, simulation framework, or importer pipeline as the capstone target. The project should be large enough for real boundary pressure, but still small enough that every added abstraction can be justified."
				},
				{
					title: "Pattern Justification as a Required Deliverable",
					content:
						"Name each pattern or C++ ownership tool in the capstone and explain which flexibility, lifetime, or testability pressure it solves. A pattern with no stated pressure should be treated as suspect."
				},
				{
					title: "Runtime and Compile-Time Tradeoff Review",
					content:
						"Review where they chose runtime polymorphism, where they chose compile-time structure, and where they stayed with plain values or small helpers. This keeps the course anchored in judgment rather than catalogue recall."
				},
				{
					title: "Debugging and Sanitizer Readiness",
					content:
						"Capstone work should still be verified through warnings, debugger runs, and targeted sanitizer checks where available. Finish the course with the expectation that a design is not complete until it survives inspection."
				},
				{
					title: "DPC12 Capstone Studio: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC12 Capstone Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-09-dpc12-capstone-studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-09-dpc12-capstone-studio/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Capstone Studio",
					content:
						"For capstone studio, compare a textbook heap-heavy version, a modern C++ version, and one short reason the modern version changes shape. Summarize one textbook pattern choice, one modern C++ adaptation, and one place where the cleanest answer was to stay simpler than the textbook.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-09-dpc12-capstone-studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-09-dpc12-capstone-studio/solution"
				},
				{
					title: "Capstone Studio supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC12 Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-25-dpc12-capstone-studio-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-25-dpc12-capstone-studio-supplemental-2/solution"
				},
				{
					title: "Capstone Studio supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle: "DPC12 Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-26-dpc12-capstone-studio-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-26-dpc12-capstone-studio-supplemental-3/solution"
				}
			]
		},
		{
			title: "pattern implementation lab 14: Implementation Lab",
			curriculum: [
				{
					title: "pattern implementation lab 14: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "pattern implementation lab 14: Guided Example",
					content:
						"A representative pattern implementation lab 14 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "pattern implementation lab 14: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-01-pattern-implementation-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-01-pattern-implementation-lab-14/solution"
				},
				{
					title: "pattern implementation lab 14: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "pattern implementation lab 14: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-01-pattern-implementation-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-01-pattern-implementation-lab-14/solution"
				},
				{
					title: "pattern implementation lab 14 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"pattern implementation lab 14: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-27-applied-studio-14-pattern-implementation-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-27-applied-studio-14-pattern-implementation-lab-14-supplemental-2/solution"
				},
				{
					title: "pattern implementation lab 14 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"pattern implementation lab 14: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-28-applied-studio-14-pattern-implementation-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-28-applied-studio-14-pattern-implementation-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "pattern implementation lab 15: Implementation Lab",
			curriculum: [
				{
					title: "pattern implementation lab 15: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "pattern implementation lab 15: Guided Example",
					content:
						"A representative pattern implementation lab 15 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "pattern implementation lab 15: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-02-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-02-pattern-implementation-lab-15/solution"
				},
				{
					title: "pattern implementation lab 15: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "pattern implementation lab 15: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-02-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-02-pattern-implementation-lab-15/solution"
				},
				{
					title: "pattern implementation lab 15 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"pattern implementation lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-29-applied-studio-15-pattern-implementation-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-29-applied-studio-15-pattern-implementation-lab-15-supplemental-2/solution"
				},
				{
					title: "pattern implementation lab 15 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"pattern implementation lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-30-applied-studio-15-pattern-implementation-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-30-applied-studio-15-pattern-implementation-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "pattern implementation lab 16: Implementation Lab",
			curriculum: [
				{
					title: "pattern implementation lab 16: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "pattern implementation lab 16: Guided Example",
					content:
						"A representative pattern implementation lab 16 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "pattern implementation lab 16: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-03-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-03-pattern-implementation-lab-16/solution"
				},
				{
					title: "pattern implementation lab 16: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "pattern implementation lab 16: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-03-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-03-pattern-implementation-lab-16/solution"
				},
				{
					title: "pattern implementation lab 16 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"pattern implementation lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-31-applied-studio-16-pattern-implementation-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-31-applied-studio-16-pattern-implementation-lab-16-supplemental-2/solution"
				},
				{
					title: "pattern implementation lab 16 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"pattern implementation lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-32-applied-studio-16-pattern-implementation-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-32-applied-studio-16-pattern-implementation-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "pattern implementation lab 17: Implementation Lab",
			curriculum: [
				{
					title: "pattern implementation lab 17: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "pattern implementation lab 17: Guided Example",
					content:
						"A representative pattern implementation lab 17 example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "pattern implementation lab 17: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-04-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-04-pattern-implementation-lab-17/solution"
				},
				{
					title: "pattern implementation lab 17: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "pattern implementation lab 17: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-04-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-04-pattern-implementation-lab-17/solution"
				},
				{
					title: "pattern implementation lab 17 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"pattern implementation lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-33-applied-studio-17-pattern-implementation-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-33-applied-studio-17-pattern-implementation-lab-17-supplemental-2/solution"
				},
				{
					title: "pattern implementation lab 17 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "C++",
						moduleTitle:
							"pattern implementation lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-34-applied-studio-17-pattern-implementation-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/main/DPC-34-applied-studio-17-pattern-implementation-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};
