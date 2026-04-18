import type { RawCourse } from "./types";

export const pythonicDesignPatternsCourse: RawCourse = {
	name: "Pythonic Design Patterns",
	modules: [
		{
			title: "PDP0 Setup and Tooling",
			curriculum: [
				{
					title: "Editor, Interpreter, and Project Baseline",
					content:
						"Standardize on `Python 3` in either `PyCharm` or `VS Code`, verify the interpreter path, and make multi-file project navigation part of the first lesson. The course should feel like architecture work from day one rather than a sequence of isolated scripts."
				},
				{
					title: "Packages, Virtual Environments, and Lightweight Testing",
					content:
						"Require a virtual environment, a simple `tests/` folder, and at least one repeatable run command before the first real pattern lab begins. Students should learn that safe refactoring depends on a stable workflow, not just on good intentions."
				},
				{
					title: "Positioning against Python 2, Python 3, and the Java Track",
					content:
						"Frame this course as a follow-up for students who already know Python fundamentals and want to improve structure, reuse, and maintainability. The Python track should borrow the judgment from the Java design-patterns sequence without copying the Java object model."
				},
				{
					title: "Pattern Names as Compression, Not Decoration",
					content:
						"Use Refactoring.Guru's core framing that patterns are reusable solution shapes, but keep asking whether Python already offers a lighter feature such as a function, decorator, context object, or module boundary. The course should begin by normalizing restraint."
				},
				{
					title: "PDP0 Setup and Tooling: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Journal: Setup and Tooling",
					content:
						"Keep a compact journal for setup and tooling that records the design pressure, the simplest Python feature that might solve it, the named pattern if one is still justified, and one short note about which workflow choices will make later refactors observable and safe. The habit should be diagnosis first, pattern name second.",
					projectLink:
						"https://github.com/instruction-material/PyGames/tree/main"
				},
				{
					title: "Pythonic Design Patterns",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main"
				},
				{
					title: "Pythonic Design Patterns",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main"
				}
			]
		},
		{
			title: "PDP1 Why Python Changes the Design-Patterns Conversation",
			curriculum: [
				{
					title: "Dynamic Typing, Duck Typing, and Protocol Thinking",
					content:
						"Teach students to focus on behavior and shape rather than concrete inheritance trees. Pythonic architecture often starts from the question 'what capabilities do I need?' instead of 'which subclass should exist?'"
				},
				{
					title: "Functions, Closures, and Decorators as First-Class Design Tools",
					content:
						"Make functions and decorators part of the design-pattern conversation immediately. Many Strategy-, Command-, and Proxy-like needs can be met cleanly with callables before a student reaches for extra classes."
				},
				{
					title: "Modules and Packages as Architectural Boundaries",
					content:
						"Show that Python module boundaries often do work that other languages push into extra classes. Students should learn to see packages, imports, and file ownership as part of the design vocabulary."
				},
				{
					title: "When the Textbook Form Still Helps",
					content:
						"Do not overcorrect into 'never use patterns in Python'. The course should make clear that explicit patterns still help when state, extension pressure, third-party integration, or team readability justify them."
				},
				{
					title: "PDP1 Why Python Changes the Design-Patterns Conversation: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Journal: Why Python Changes the Design-Patterns Conversation",
					content:
						"Keep a compact journal for why python changes the design-patterns conversation that records the design pressure, the simplest Python feature that might solve it, the named pattern if one is still justified, and one short note about which Python features replace ceremony and which ones simply hide it. The habit should be diagnosis first, pattern name second.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-1/tree/main"
				},
				{
					title: "Why Python Changes the Design Patterns Conversation supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP1 Why Python Changes the Design-Patterns Conversation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-01-pdp1-why-python-changes-the-design-patterns-conv/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-01-pdp1-why-python-changes-the-design-patterns-conv/solution"
				},
				{
					title: "Why Python Changes the Design Patterns Conversation supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP1 Why Python Changes the Design-Patterns Conversation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-02-pdp1-why-python-changes-the-design-patterns-conv/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-02-pdp1-why-python-changes-the-design-patterns-conv/solution"
				}
			]
		},
		{
			title: "PDP2 Design Foundations in Python",
			curriculum: [
				{
					title: "Composition over Inheritance in a Python Setting",
					content:
						"Use small Python examples to show why composition, delegation, and explicit collaborators scale better than eager subclass trees. The lesson should make students suspicious of inheritance used only as a habit."
				},
				{
					title: "Protocols, ABCs, and Informal Interfaces",
					content:
						"Teach `typing.Protocol`, abstract base classes, and duck typing as three different tools with different tradeoffs. Students should learn that Python can express contracts lightly without pretending every project needs heavy interface scaffolding."
				},
				{
					title: "Data Classes, Configuration Objects, and Dependency Direction",
					content:
						"Use `dataclasses` and small configuration objects to make dependencies explicit and data movement readable. This sets up later Builder, Adapter, and refactoring work. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Seams for Testing and Refactoring",
					content:
						"Show where to place seams for file I/O, network access, time, randomness, and external services. Good Python design should make later tests and later cleanup easier without adding fake complexity."
				},
				{
					title: "PDP2 Design Foundations in Python: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Journal: Design Foundations in Python",
					content:
						"Keep a compact journal for design foundations in python that records the design pressure, the simplest Python feature that might solve it, the named pattern if one is still justified, and one short note about which boundary would be easiest to fake, replace, or move later. The habit should be diagnosis first, pattern name second.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-2/tree/main"
				},
				{
					title: "Design Foundations in Python supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP2 Design Foundations in Python. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-03-pdp2-design-foundations-in-python-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-03-pdp2-design-foundations-in-python-supplemental-2/solution"
				},
				{
					title: "Design Foundations in Python supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP2 Design Foundations in Python. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-04-pdp2-design-foundations-in-python-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-04-pdp2-design-foundations-in-python-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP3 Strategy Without Ceremony",
			curriculum: [
				{
					title: "Functions as Strategies",
					content:
						"Start Strategy with plain callables and dictionaries of behavior rather than with class hierarchies. Students should first feel how simple it is to swap behavior in Python before adding object structure."
				},
				{
					title: "Callable Objects When State Matters",
					content:
						"Introduce callable objects only when a strategy needs configuration, history, or bundled helper methods. This keeps the class-based form tied to a real reason instead of turning it into the default."
				},
				{
					title: "Replacing Long Conditionals with Selected Behavior",
					content:
						"Use long pricing, scoring, or rule-selection chains to show when Strategy improves clarity. Students should connect the pattern to conditional pressure rather than to abstract pattern memorization."
				},
				{
					title: "When a Dictionary Lookup Beats a Full Pattern",
					content:
						"Explicitly compare Strategy with a simple mapping of names to functions. The Pythonic lesson is that structure should grow only when the problem justifies it. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "PDP3 Strategy Without Ceremony: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP1-Strategy-Rulebook/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP1-Strategy-Rulebook/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Strategy Rulebook",
					content:
						"Build a small rule-selection engine where pricing or scoring behavior can be swapped between plain functions, configured callables, and named selections. The goal is to see Strategy in a Pythonic form before the course grows more structural.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP1-Strategy-Rulebook/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP1-Strategy-Rulebook/solution"
				},
				{
					title: "Strategy Without Ceremony supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP3 Strategy Without Ceremony. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-05-pdp3-strategy-without-ceremony-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-05-pdp3-strategy-without-ceremony-supplemental-2/solution"
				},
				{
					title: "Strategy Without Ceremony supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP3 Strategy Without Ceremony. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-06-pdp3-strategy-without-ceremony-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-06-pdp3-strategy-without-ceremony-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP4 Factory and Builder in Python",
			curriculum: [
				{
					title: "Factory Functions and Named Constructors",
					content:
						"Teach factory functions and `@classmethod` constructors as the default Python tools for creation pressure. Students should see how these options already solve many textbook Factory Method problems cleanly."
				},
				{
					title: "Builder for Configuration-Heavy Objects",
					content:
						"Introduce Builder only when object setup becomes noisy, order-sensitive, or full of optional configuration. The key question should be readability and correctness, not pattern completionism."
				},
				{
					title: "Families, Variants, and Environment Selection",
					content:
						"Use exporters, notifiers, parsers, or service clients to show when a factory is selecting between coordinated variants. Keep the lesson practical by tying it to configuration and deployment choices."
				},
				{
					title: "What to Avoid in Python Creation Code",
					content:
						"Warn against creation frameworks that merely hide constructors behind more constructors. Python creation code should usually become shorter and clearer, not more ceremonial. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "PDP4 Factory and Builder in Python: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP2-Factory-and-Builder-Config-Kit/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP2-Factory-and-Builder-Config-Kit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Factory and Builder Config Kit",
					content:
						"Construct reports or exporters from configuration while choosing concrete output strategies through factories and using a lightweight builder only where the setup truly gets noisy. This lab is about learning where the boundary between useful structure and needless ceremony sits.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP2-Factory-and-Builder-Config-Kit/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP2-Factory-and-Builder-Config-Kit/solution"
				},
				{
					title: "Factory and Builder in Python supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP4 Factory and Builder in Python. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-07-pdp4-factory-and-builder-in-python-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-07-pdp4-factory-and-builder-in-python-supplemental-/solution"
				},
				{
					title: "Factory and Builder in Python supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP4 Factory and Builder in Python. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-08-pdp4-factory-and-builder-in-python-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-08-pdp4-factory-and-builder-in-python-supplemental-/solution"
				}
			]
		},
		{
			title: "PDP5 Observer, Events, and Callbacks",
			curriculum: [
				{
					title: "Subscription Lists and Event Fan-Out",
					content:
						"Teach Observer as a controlled way to notify multiple listeners without hard-coding every downstream action into the source object. In Python, this often begins with lists of callables before it becomes a larger event abstraction."
				},
				{
					title: "Designing Event Payloads and Listener Contracts",
					content:
						"Show how event payload shape affects coupling. A good event system should tell subscribers enough to act without leaking the entire source object or making every listener depend on internal details."
				},
				{
					title: "Unsubscribe, Ordering, and Failure Handling",
					content:
						"Make the operational concerns explicit: duplicate subscriptions, stale listeners, listener exceptions, and event ordering all affect whether an event system stays understandable. Students should not mistake Observer for free decoupling."
				},
				{
					title: "Sync versus Async Event Flow",
					content:
						"Keep async treatment conceptual but concrete enough that students can reason about when immediate callbacks are sufficient and when background event handling changes the failure model. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "PDP5 Observer, Events, and Callbacks: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP3-Observer-Notification-Hub/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP3-Observer-Notification-Hub/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Observer Notification Hub",
					content:
						"Build an event bus that fans account or order events out to several listeners such as logs, summaries, and user-facing notifications. The lab should make event boundaries and unsubscribe behavior observable rather than magical.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP3-Observer-Notification-Hub/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP3-Observer-Notification-Hub/solution"
				},
				{
					title: "Observer, Events, and Callbacks supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP5 Observer, Events, and Callbacks. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-09-pdp5-observer-events-and-callbacks-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-09-pdp5-observer-events-and-callbacks-supplemental-/solution"
				},
				{
					title: "Observer, Events, and Callbacks supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP5 Observer, Events, and Callbacks. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-10-pdp5-observer-events-and-callbacks-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-10-pdp5-observer-events-and-callbacks-supplemental-/solution"
				}
			]
		},
		{
			title: "PDP6 Decorator, Proxy, and Facade",
			curriculum: [
				{
					title: "Function Decorators and Object Wrappers",
					content:
						"Compare function decorators with object-level wrappers so students can see where each style shines. Logging, caching, metrics, and access checks often start as decorators before they need a fuller proxy or wrapper object."
				},
				{
					title: "Proxy for Control, Facade for Simplicity",
					content:
						"Make the distinction explicit: a proxy controls or guards access to something real, while a facade simplifies a messy subsystem. Students should stop grouping every wrapper under one vague category."
				},
				{
					title: "Layering Behavior without Hiding Intent",
					content:
						"Show how wrappers can become unreadable if they stack carelessly. A Pythonic design should still let another developer explain the actual call path without hunting through invisible magic."
				},
				{
					title: "Cross-Cutting Concerns without Framework Bloat",
					content:
						"Use caching, auth checks, tracing, and high-level service orchestration as examples of cross-cutting concerns. The course should teach students to apply these narrowly rather than building their own mini-framework by accident."
				},
				{
					title: "PDP6 Decorator, Proxy, and Facade: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP4-Decorator-Proxy-Facade-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP4-Decorator-Proxy-Facade-Toolkit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Decorator, Proxy, and Facade Toolkit",
					content:
						"Wrap a small profile or content service with metrics, lightweight authorization, caching, and one simplifying facade. The goal is to see the difference between adding behavior, guarding access, and simplifying a subsystem boundary.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP4-Decorator-Proxy-Facade-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP4-Decorator-Proxy-Facade-Toolkit/solution"
				},
				{
					title: "Decorator, Proxy, and Facade supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP6 Decorator, Proxy, and Facade. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-11-pdp6-decorator-proxy-and-facade-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-11-pdp6-decorator-proxy-and-facade-supplemental-2/solution"
				},
				{
					title: "Decorator, Proxy, and Facade supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP6 Decorator, Proxy, and Facade. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-12-pdp6-decorator-proxy-and-facade-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-12-pdp6-decorator-proxy-and-facade-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP7 State and Command",
			curriculum: [
				{
					title: "Explicit State Objects versus Enum-Driven Branching",
					content:
						"Teach State as a response to behavior that changes by mode, not as a universal replacement for every flag. Students should compare a growing branch tree with explicit state objects and choose based on the actual complexity."
				},
				{
					title: "Commands as Callables, Objects, and History Entries",
					content:
						"Use closures, small command objects, and history records to show several Pythonic forms of Command. The common theme is packaging an action so it can be queued, logged, retried, or undone."
				},
				{
					title: "Undo, Replay, and Action Queues",
					content:
						"Show how Command becomes more valuable when actions need history or delayed execution. This keeps the pattern tied to a real operational benefit rather than a naming exercise. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Combining State and Command Carefully",
					content:
						"Turn-based flows, editors, and workflow systems often use both patterns together. Students should learn to separate mode logic from action packaging so the design stays explainable. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "PDP7 State and Command: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP5-State-Command-Quest-Loop/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP5-State-Command-Quest-Loop/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: State and Command Quest Loop",
					content:
						"Build a small quest or workflow loop where explicit states govern allowed actions and command objects or callables power history, replay, or undo. The lab should feel like applied control-flow cleanup, not just game-themed syntax practice.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP5-State-Command-Quest-Loop/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP5-State-Command-Quest-Loop/solution"
				},
				{
					title: "State and Command supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP7 State and Command. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-13-pdp7-state-and-command-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-13-pdp7-state-and-command-supplemental-2/solution"
				},
				{
					title: "State and Command supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP7 State and Command. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-14-pdp7-state-and-command-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-14-pdp7-state-and-command-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP8 Adapter and Integration Boundaries",
			curriculum: [
				{
					title: "Adapters for Third-Party Data and APIs",
					content:
						"Teach Adapter as a boundary-normalization tool whenever outside systems return awkward names, shapes, or expectations. Students should learn to isolate external weirdness near the edge rather than spreading it through the codebase."
				},
				{
					title: "Compatibility Layers and Anti-Corruption Boundaries",
					content:
						"Use the adapter lesson to introduce the broader idea of keeping internal models clean even when vendors or legacy inputs are messy. This is one of the most practically useful patterns in Python service and tooling work."
				},
				{
					title: "Testing Adapters with Small, Explicit Fixtures",
					content:
						"Adapter code should be validated with tiny fixtures that make field mapping and default handling obvious. Students should treat boundary tests as evidence that the internal model is staying protected."
				},
				{
					title: "When a Translation Function Is Enough",
					content:
						"Not every adapter needs a class. A well-named translation function or lightweight wrapper may be the clearest move when the source pressure is small. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "PDP8 Adapter and Integration Boundaries: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Adapter and Import Pipeline",
					content:
						"Normalize several awkward external record formats into one internal model, then run them through a clean import pipeline. The point is to make the integration boundary explicit and keep vendor-specific noise out of the rest of the app.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/solution"
				},
				{
					title: "Adapter and Integration Boundaries supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP8 Adapter and Integration Boundaries. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-15-pdp8-adapter-and-integration-boundaries-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-15-pdp8-adapter-and-integration-boundaries-suppleme/solution"
				},
				{
					title: "Adapter and Integration Boundaries supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP8 Adapter and Integration Boundaries. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-16-pdp8-adapter-and-integration-boundaries-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-16-pdp8-adapter-and-integration-boundaries-suppleme/solution"
				}
			]
		},
		{
			title: "PDP9 Template Method versus Higher-Order Functions",
			curriculum: [
				{
					title: "Inheritance-Based Skeletons and Hook Methods",
					content:
						"Teach the textbook Template Method shape so students can recognize it, but keep the use case concrete: a stable algorithm skeleton with a few genuine hooks. This should feel like a niche tool, not a default architecture style."
				},
				{
					title: "Replacing Template Method with Callables or Composition",
					content:
						"Show how higher-order functions, small collaborators, or composed pipeline steps often express the same intent more cleanly in Python. Students should feel the tradeoff instead of being told a slogan."
				},
				{
					title: "Choosing by Extension Pressure",
					content:
						"Compare several variations of a workflow and ask whether the extension points are truly stable enough to justify an inheritance skeleton. If the answer is no, the design should stay lighter."
				},
				{
					title: "Readability and Onboarding Cost",
					content:
						"Explain that Template Method can obscure behavior for newer readers when hooks are scattered across subclasses. Pythonic design should make the final control flow easier to follow, not harder."
				},
				{
					title: "PDP9 Template Method versus Higher-Order Functions: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Compare Template Skeletons with Callable Pipelines",
					content:
						"Use the same import or workflow problem in both an inheritance-based and higher-order-function form, then explain which version is easier to evolve and why. The exercise should make the Pythonic bias toward simpler extension mechanisms feel earned.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/solution"
				},
				{
					title: "Method versus Higher Order Functions supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP9 Template Method versus Higher-Order Functions. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-17-pdp9-template-method-versus-higher-order-functio/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-17-pdp9-template-method-versus-higher-order-functio/solution"
				},
				{
					title: "Method versus Higher Order Functions supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP9 Template Method versus Higher-Order Functions. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-18-pdp9-template-method-versus-higher-order-functio/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-18-pdp9-template-method-versus-higher-order-functio/solution"
				}
			]
		},
		{
			title: "PDP10 Singleton, Global State, and Module Patterns",
			curriculum: [
				{
					title: "Module-Level Singletons and Why They Feel Convenient",
					content:
						"Teach module state, cached objects, and one-per-process resources as the Python forms students will actually encounter. The lesson should start from real convenience before it moves into the costs."
				},
				{
					title: "Hidden Globals, Implicit Coupling, and Test Pain",
					content:
						"Show how global state quietly spreads dependencies across functions and modules. Students should connect hidden global reads and writes to flaky tests, surprising behavior, and difficult refactors."
				},
				{
					title: "Context Objects, App Factories, and Explicit Wiring",
					content:
						"Offer practical alternatives such as configuration objects, explicit dependency injection, app factories, or small service containers. The replacement should feel simpler to reason about, not theoretically purer."
				},
				{
					title: "When Shared Process State Is Still Legitimate",
					content:
						"Do not pretend every shared object is wrong. Some caches, registries, or process-wide resources are fine if their lifecycle and ownership are explicit and narrow. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "PDP10 Singleton, Global State, and Module Patterns: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main"
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Journal: Singleton, Global State, and Module Patterns",
					content:
						"Keep a compact journal for singleton, global state, and module patterns that records the design pressure, the simplest Python feature that might solve it, the named pattern if one is still justified, and one short note about which shared objects are explicit resources and which ones are just hidden dependencies. The habit should be diagnosis first, pattern name second.",
					projectLink:
						"https://github.com/instruction-material/Python-Level-3/tree/main"
				},
				{
					title: "Singleton, Global State, and Module Patterns supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP10 Singleton, Global State, and Module Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-19-pdp10-singleton-global-state-and-module-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-19-pdp10-singleton-global-state-and-module-patterns/solution"
				},
				{
					title: "Singleton, Global State, and Module Patterns supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP10 Singleton, Global State, and Module Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-20-pdp10-singleton-global-state-and-module-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-20-pdp10-singleton-global-state-and-module-patterns/solution"
				}
			]
		},
		{
			title: "PDP11 Refactoring Python Code Smells",
			curriculum: [
				{
					title: "From Large Script to Coherent Modules",
					content:
						"Teach script-to-application refactors as a series of small moves: extract functions, name concepts, isolate I/O, group state, and split files by responsibility. The point is to make evolution realistic instead of magical."
				},
				{
					title: "Tangled Conditionals and Mixed Responsibilities",
					content:
						"Use duplicate branches, mixed formatting/business logic, and kitchen-sink classes to show when Strategy, Adapter, or simple extraction might help. Students should map smells to the smallest effective cleanup step."
				},
				{
					title: "Data, Behavior, and Overgrown Objects",
					content:
						"Ask whether a class is carrying real behavior, merely holding data, or doing too many unrelated jobs. Python students should learn to move behavior closer to the data without treating every record as an object-heavy design exercise."
				},
				{
					title: "Tests and Characterization before Structural Change",
					content:
						"Introduce lightweight characterization tests or scripted assertions before bigger changes land. Even in Python, safe refactoring depends on evidence that the external behavior still holds."
				},
				{
					title: "PDP11 Refactoring Python Code Smells: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Pythonic Refactor Capstone Starter",
					content:
						"Begin with a deliberately messy text-processing or workflow app, identify the dominant smells, and plan a staged cleanup that uses only the patterns the code actually earns. This is the handoff into the final capstone sequence.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/solution"
				},
				{
					title: "Refactoring Python Code Smells supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP11 Refactoring Python Code Smells. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-21-pdp11-refactoring-python-code-smells-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-21-pdp11-refactoring-python-code-smells-supplemental-2/solution"
				},
				{
					title: "Refactoring Python Code Smells supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP11 Refactoring Python Code Smells. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-22-pdp11-refactoring-python-code-smells-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-22-pdp11-refactoring-python-code-smells-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP12 Capstone Pythonic Refactor Studio",
			curriculum: [
				{
					title: "Choose a Messy but Salvageable App",
					content:
						"Use a medium-sized Python project with real duplication, mixed responsibilities, and awkward boundaries, but keep it small enough that students can still explain the whole system. The capstone should feel like rescue work, not like greenfield architecture fiction."
				},
				{
					title: "Refactor in Small, Defensible Steps",
					content:
						"Require a sequence of narrow changes with explanation after each one: what pressure was reduced, what stayed stable, and why the next move became clearer. This keeps the capstone centered on judgment rather than on code churn."
				},
				{
					title: "Document Patterns Used and Patterns Avoided",
					content:
						"Students should explicitly record which patterns arrived naturally, which possible patterns were rejected, and why the Pythonic solution stayed lighter in some areas. The avoidance decisions matter as much as the chosen ones."
				},
				{
					title: "Final Review: More Pythonic, More Maintainable, Still Explainable",
					content:
						"The final standard is not 'contains many patterns'. The final standard is that the code is easier to read, safer to change, and easier to explain to another developer than the starting version."
				},
				{
					title: "PDP12 Capstone Pythonic Refactor Studio: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Pythonic Refactor Capstone",
					content:
						"Take the capstone starter through diagnosis, extraction, boundary cleanup, and final polish, then compare the finished structure against the original in a short architecture review. The best solutions should feel lighter and clearer, not more ornate.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/solution"
				},
				{
					title: "Capstone Pythonic Refactor Studio supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP12 Capstone Pythonic Refactor Studio. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-23-pdp12-capstone-pythonic-refactor-studio-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-23-pdp12-capstone-pythonic-refactor-studio-suppleme/solution"
				},
				{
					title: "Capstone Pythonic Refactor Studio supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to PDP12 Capstone Pythonic Refactor Studio. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-24-pdp12-capstone-pythonic-refactor-studio-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-24-pdp12-capstone-pythonic-refactor-studio-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: AI Level 1",
			curriculum: [
				{
					title: "AI Level 1: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: AI Level 1, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AI Level 1: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: AI Level 1, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AI Level 1: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: AI Level 1. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main"
				},
				{
					title: "AI Level 1: Review and Reflection",
					content:
						"Close Applied Studio 14: AI Level 1 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "AI Level 1: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: AI Level 1 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-1/tree/main"
				},
				{
					title: "Applied Studio 14: AI Level 1 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: AI Level 1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-25-applied-studio-14-ai-level-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-25-applied-studio-14-ai-level-1-supplemental-2/solution"
				},
				{
					title: "Applied Studio 14: AI Level 1 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: AI Level 1. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-26-applied-studio-14-ai-level-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-26-applied-studio-14-ai-level-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: AI Level 2",
			curriculum: [
				{
					title: "AI Level 2: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: AI Level 2, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AI Level 2: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: AI Level 2, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AI Level 2: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: AI Level 2. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main"
				},
				{
					title: "AI Level 2: Review and Reflection",
					content:
						"Close Applied Studio 15: AI Level 2 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "AI Level 2: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: AI Level 2 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/AI-Level-2/tree/main"
				},
				{
					title: "Applied Studio 15: AI Level 2 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: AI Level 2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-27-applied-studio-15-ai-level-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-27-applied-studio-15-ai-level-2-supplemental-2/solution"
				},
				{
					title: "Applied Studio 15: AI Level 2 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: AI Level 2. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-28-applied-studio-15-ai-level-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-28-applied-studio-15-ai-level-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: Customized",
			curriculum: [
				{
					title: "Customized: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: Customized, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Customized: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: Customized, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Customized: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: Customized. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-Customized-Archive"
				},
				{
					title: "Customized: Review and Reflection",
					content:
						"Close Applied Studio 16: Customized by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Customized: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: Customized with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-Customized-Archive"
				},
				{
					title: "Applied Studio 16: Customized supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: Customized. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-29-applied-studio-16-customized-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-29-applied-studio-16-customized-supplemental-2/solution"
				},
				{
					title: "Applied Studio 16: Customized supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: Customized. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-30-applied-studio-16-customized-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-30-applied-studio-16-customized-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: Data Science in Python",
			curriculum: [
				{
					title: "Data Science in Python: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: Data Science in Python, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "Data Science in Python: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: Data Science in Python, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Data Science in Python: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: Data Science in Python. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main"
				},
				{
					title: "Data Science in Python: Review and Reflection",
					content:
						"Close Applied Studio 17: Data Science in Python by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Data Science in Python: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: Data Science in Python with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Data-Science/tree/main"
				},
				{
					title: "Applied Studio 17: Data Science in Python supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: Data Science in Python. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-31-applied-studio-17-data-science-in-python-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-31-applied-studio-17-data-science-in-python-supplem/solution"
				},
				{
					title: "Applied Studio 17: Data Science in Python supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: Data Science in Python. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-32-applied-studio-17-data-science-in-python-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-32-applied-studio-17-data-science-in-python-supplem/solution"
				}
			]
		}
	]
};
