import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

export const designPatternsInJavaCourse: RawCourse = {
	name: "Design Patterns in Java",
	modules: [
		{
			title: "DPJ1 What Patterns Are and What They Are Not",
			curriculum: [
				{
					title: "Introductions, Tooling, and Multi-File Workflow",
					content:
						"Set up a Java workspace in IntelliJ IDEA or VS Code with a current JDK, a build tool such as Gradle or Maven, and a debugger that works across packages and multiple files. Treat package structure, tests, and build scripts as part of the design lesson rather than as incidental setup."
				},
				{
					title: "Pattern, Anti-Pattern, and Overengineering",
					content:
						"Use Refactoring.Guru's framing that patterns are reusable design ideas, not copy-paste recipes or status symbols. Contrast genuine recurring design problems with over-designed code that introduces interfaces, factories, or inheritance before any flexibility is actually needed."
				},
				{
					title: "Code Smell Survey Before Pattern Selection",
					content:
						"The smell categories that drive this course are bloaters, object-orientation abusers, change preventers, dispensables, and couplers. Beginner-friendly examples such as long methods, switch statements, duplicate code, data clumps, feature envy, and shotgun surgery show why architecture pain appears."
				},
				{
					title: "Worked Example Set: Why Inheritance Ages Badly",
					content:
						"Compare a rigid subclass tree with a composition-based design that can vary behavior without multiplying classes. Use game rules, notifications, or pricing rules to show why 'just add another subclass' becomes costly once behavior starts crossing axes."
				},
				{
					title: "Design Exercise: Smell or Reasonable Simplicity?",
					content:
						"Give several short Java designs and classify them as healthy simplicity, code smell, or pattern-shaped overkill. The point is to train judgment before introducing the named patterns themselves."
				},
				{
					title: "Reflection Question: When Does a Pattern Actually Help?",
					content:
						"Explain the problem that must exist before a pattern becomes justified. Include at least one case where a pattern would be premature and one where a smell clearly points toward structural change."
				},
				{
					title: "DPJ1 What Patterns Are and What They Are Not: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ1 What Patterns Are and What They Are Not",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: define a design pattern as a reusable solution shape instead of a library feature or template. Prompt: decide whether every duplicated `if` statement deserves a Strategy refactor, and justify the answer.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/solution"
				},
				{
					title: "What Patterns Are and What They Are Not Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ1 What Patterns Are and What They Are Not",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-dpj1-what-patterns-are-and-what-they-are-not-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-dpj1-what-patterns-are-and-what-they-are-not-supplemental-2/solution"
				},
				{
					title: "What Patterns Are and What They Are Not Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ1 What Patterns Are and What They Are Not",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-dpj1-what-patterns-are-and-what-they-are-not-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-dpj1-what-patterns-are-and-what-they-are-not-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ2 Java Design Foundations",
			curriculum: [
				{
					title: "Interfaces, Abstract Classes, and Contracts",
					content:
						"Interfaces are behavioral contracts, while abstract classes are partial implementation tools; they are not interchangeable ceremony. Use package boundaries, visibility modifiers, and `final` to show how Java makes dependency direction and collaboration visible."
				},
				{
					title: "Composition, Cohesion, and Dependency Direction",
					content:
						"Develop composition over inheritance, high cohesion, and low coupling as the base layer underneath almost every later pattern. Before any refactor starts, explain which class owns which responsibility."
				},
				{
					title: "Worked Example Set: Packages, Seams, and Immutable Value Objects",
					content:
						"Use small Java examples to show how package structure, immutable value types, and constructor injection make systems easier to reason about. Connect this directly to later Builder, Factory, and DI work."
				},
				{
					title: "Refactoring Exercise: Untangle a Responsibility Blob",
					content:
						"Start from a class that creates objects, makes decisions, performs work, and talks directly to every dependency. Split responsibilities into cleaner collaborators before introducing named patterns, so the design foundations are explicit."
				},
				{
					title: "Design Review: Favoring Explicit Package Structure",
					content:
						"The package layout should reveal the architecture rather than merely mirror folders. Good Java design makes stable boundaries obvious in the codebase."
				},
				{
					title: "Reflection Question: What Makes a Good Seam in Java?",
					content:
						"Identify where they would insert an interface, fake, or wrapper if they needed to change behavior safely later. The answer should reference testability, not abstraction for its own sake."
				},
				{
					title: "DPJ2 Java Design Foundations: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ2 Java Design Foundations",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: justify an interface with a collaboration boundary rather than habit. Prompt: explain when an immutable data object is cleaner than a highly configurable mutable one.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/solution"
				},
				{
					title: "Java Design Foundations Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ2 Java Design Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-dpj2-java-design-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-dpj2-java-design-foundations-supplemental-2/solution"
				},
				{
					title: "Java Design Foundations Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ2 Java Design Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj2-java-design-foundations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj2-java-design-foundations-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ3 Creational Patterns I",
			curriculum: [
				{
					title: "Factory Method",
					content:
						"Use Factory Method to centralize creation when subclasses or configuration decide which concrete product should exist. Keep the lesson grounded in duplicated constructor logic and hard-coded creation branching."
				},
				{
					title: "Abstract Factory",
					content:
						"Abstract Factory handles product families that must vary together, such as themed UI components, environment-specific services, or game content packs. The important design pressure is consistency across each family rather than sheer number of factory classes."
				},
				{
					title: "Builder",
					content:
						"Use a builder when large object setup, optional configuration, and unreadable telescoping constructors make direct construction hard to follow. Compare a fluent builder with static factories and plain constructors so the tradeoff is concrete."
				},
				{
					title: "Worked Example Set: Duplicated Creation Logic in a Java App",
					content:
						"Refactor a cluttered object-creation flow first into Factory Method, then into Abstract Factory or Builder only if the constraints truly justify it. Use product variability, readability, and test seams as the deciding criteria."
				},
				{
					title: "Pattern Selection Drill: Factory or Builder?",
					content:
						"Use examples that require deciding whether the real problem is product family selection, complex configuration, or both. This prevents Builder and Factory from collapsing into one vague 'object creation' lesson."
				},
				{
					title: "Reflection Question: How Much Creation Logic Is Too Much?",
					content:
						"Explain the point at which direct constructor calls become a maintenance problem. A strong response mentions duplicated rules, hidden dependencies, or families that must stay compatible."
				},
				{
					title: "DPJ3 Creational Patterns I: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ3 Creational Patterns I",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain why Abstract Factory is about coordinated families rather than just more factories. Prompt: identify when a named constructor is enough and a Builder is unnecessary.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/solution"
				},
				{
					title: "Creational Patterns I Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ3 Creational Patterns I",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj3-creational-patterns-i-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj3-creational-patterns-i-supplemental-2/solution"
				},
				{
					title: "Creational Patterns I Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ3 Creational Patterns I",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ4 Creational Patterns II and Boundary Patterns",
			curriculum: [
				{
					title: "Prototype",
					content:
						"Prototype fits when cloning configured objects is simpler than reconstructing them from scratch. Focus on controlled copying, variation from a seed object, and the risks of shallow versus deep copy."
				},
				{
					title: "Singleton and Why to Be Skeptical",
					content:
						"Present Singleton because it is part of the classic catalog, but teach it through the lens of hidden global state, test pain, and lifetime ambiguity. Leave preferring scoped services and injection unless a truly application-wide single instance is warranted."
				},
				{
					title: "Adapter",
					content:
						"Use Adapter to reconcile mismatched interfaces when integrating older code, third-party libraries, or inconsistent data providers. Stress that Adapter preserves the client-side contract rather than polluting the domain with foreign shapes."
				},
				{
					title: "Facade",
					content:
						"Facade simplifies access to a subsystem that currently exposes too much internal structure. The key distinction is a boundary-oriented facade versus a bloated god object."
				},
				{
					title: "Worked Example Set: Clone, Wrap, or Simplify?",
					content:
						"Give a legacy-integration example where Prototype, Adapter, and Facade must be chosen based on what the current pain actually is. Use this lesson to reinforce that pattern selection starts from forces, not names."
				},
				{
					title: "Reflection Question: Why Is Singleton So Tempting?",
					content:
						"Explain why Singleton often feels convenient at first and why that convenience creates hidden cost later. A strong response compares it with constructor injection or explicit application wiring."
				},
				{
					title: "DPJ4 Creational Patterns II and Boundary Patterns: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ4 Creational Patterns II and Boundary Patterns",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish wrapping an incompatible API from simplifying a noisy subsystem. Prompt: decide whether a logger should automatically become a Singleton.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns/solution"
				},
				{
					title: "Creational Patterns II and Boundary Patterns Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ4 Creational Patterns II and Boundary Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-2/solution"
				},
				{
					title: "Creational Patterns II and Boundary Patterns Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ4 Creational Patterns II and Boundary Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ5 Structural Patterns in Depth",
			curriculum: [
				{
					title: "Bridge",
					content:
						"Use Bridge when abstraction and implementation should vary independently, such as shapes versus renderers or notifications versus delivery channels. Contrast this with subclass explosions that multiply every combination."
				},
				{
					title: "Composite",
					content:
						"Composite is clearest through recursive structures such as menus, scene graphs, or document trees. Key idea: when treating leaf and group nodes uniformly improves client code."
				},
				{
					title: "Decorator",
					content:
						"Use Decorator to layer behavior without creating endless subclasses for every feature combination. Logging, formatting, scoring, and effect modifiers make good motivating examples."
				},
				{
					title: "Proxy and Flyweight",
					content:
						"Proxy is controlled indirection for lazy loading, access control, or observation, while Flyweight is shared intrinsic state for memory-sensitive repeated objects. The important distinction is why these two patterns solve different problems even though both can involve wrappers and delegation."
				},
				{
					title: "Worked Example Set: Tree, Wrapper, or Indirection?",
					content:
						"Compare a drawing app, resource viewer, and icon-heavy UI to decide whether the real pressure is hierarchy, layered behavior, access indirection, or object count. This helps avoid using Decorator where Composite or Proxy would be cleaner."
				},
				{
					title: "Reflection Question: Which Structural Pattern Changes the Client View?",
					content:
						"Explain how each structural pattern changes what the client needs to know. A strong answer should distinguish hidden subsystem complexity, preserved interface shape, recursive composition, and deferred access."
				},
				{
					title: "DPJ5 Structural Patterns in Depth: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ5 Structural Patterns in Depth",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: justify Flyweight with repeated intrinsic state rather than simple reuse. Prompt: decide whether a layered coffee-order system wants Decorator or Builder.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/solution"
				},
				{
					title: "Structural Patterns in Depth Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ5 Structural Patterns in Depth",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj5-structural-patterns-in-depth-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj5-structural-patterns-in-depth-supplemental-2/solution"
				},
				{
					title: "Structural Patterns in Depth Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ5 Structural Patterns in Depth",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj5-structural-patterns-in-depth-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj5-structural-patterns-in-depth-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ6 Behavioral Patterns I",
			curriculum: [
				{
					title: "Strategy",
					content:
						"Use Strategy to replace branching behavior with swappable algorithms for pricing, movement, targeting, scoring, or validation rules. This connects directly to code smells like switch statements and primitive obsession."
				},
				{
					title: "State",
					content:
						"State is an object-oriented response to behavior that changes based on internal mode or phase. Use examples like workflow stages, player states, or document lifecycle transitions to contrast State with Strategy."
				},
				{
					title: "Template Method",
					content:
						"Use Template Method when an algorithm skeleton is fixed but selected steps vary across subclasses. Show both the power and the inheritance coupling so composition tradeoffs stay visible."
				},
				{
					title: "Iterator",
					content:
						"Use Iterator to traverse structures without exposing collection internals or forcing clients to know the storage shape. Compare custom iteration across trees or filtered views with the simpler cases already covered by Java collections."
				},
				{
					title: "Worked Example Set: Replace Conditionals with Behavior Objects",
					content:
						"Start with long conditional logic, then compare refactors using Strategy, State, or Template Method. Explain why one of the three is the best fit instead of using them interchangeably."
				},
				{
					title: "Reflection Question: Where Does the Decision Live Now?",
					content:
						"Explain how Strategy, State, and Template Method relocate variation compared with a giant conditional block. A strong response identifies whether the variability is chosen from outside, driven by object state, or fixed in an algorithm skeleton."
				},
				{
					title: "DPJ6 Behavioral Patterns I: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ6 Behavioral Patterns I",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: choose State versus Strategy based on who selects the behavior and when it changes. Prompt: decide whether Template Method helps when inheritance is already the source of the current design pain.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/solution"
				},
				{
					title: "Behavioral Patterns I Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ6 Behavioral Patterns I",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj6-behavioral-patterns-i-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj6-behavioral-patterns-i-supplemental-2/solution"
				},
				{
					title: "Behavioral Patterns I Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ6 Behavioral Patterns I",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj6-behavioral-patterns-i-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj6-behavioral-patterns-i-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ7 Behavioral Patterns II",
			curriculum: [
				{
					title: "Observer",
					content:
						"Observer is easiest to understand through notifications, UI listeners, and event-driven collaboration where publishers should not know their consumers in detail. Make coupling direction and unsubscribe behavior explicit."
				},
				{
					title: "Command",
					content:
						"Use Command to package requests as objects that can be queued, logged, replayed, or undone. Connect this pattern to menu systems, editor actions, macro recording, and job execution."
				},
				{
					title: "Chain of Responsibility",
					content:
						"Chain of Responsibility is staged handling where each object can process, pass along, or stop a request. Use middleware, validation pipelines, or event filters as intuitive Java examples."
				},
				{
					title: "Mediator, Memento, and Visitor",
					content:
						"Use Mediator to reduce many-to-many chatter, Memento to capture restorable state without exposing internals recklessly, and Visitor to add operations over stable object structures. These should be taught as higher-friction patterns that solve real coordination or traversal pressure rather than default solutions."
				},
				{
					title: "Worked Example Set: Event Flow, Undo, and Cross-Object Coordination",
					content:
						"Compare a notification system, command history, and object-collaboration tangle to decide whether Observer, Command, Chain, Mediator, or Memento best addresses the pressure point. Use Visitor sparingly and only where adding new operations across a fixed node hierarchy is the real challenge."
				},
				{
					title: "Reflection Question: Which Pattern Owns the Conversation?",
					content:
						"Identify where message flow is centered in Observer, Chain of Responsibility, and Mediator. A strong response explains how each changes coupling and control flow."
				},
				{
					title: "DPJ7 Behavioral Patterns II: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ7 Behavioral Patterns II",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish event subscription from ordered request handling and centralized coordination. Prompt: identify when Memento is better than exposing every field for manual rollback.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/solution"
				},
				{
					title: "Behavioral Patterns II Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ7 Behavioral Patterns II",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj7-behavioral-patterns-ii-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj7-behavioral-patterns-ii-supplemental-2/solution"
				},
				{
					title: "Behavioral Patterns II Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ7 Behavioral Patterns II",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-14-dpj7-behavioral-patterns-ii-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-14-dpj7-behavioral-patterns-ii-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ8 Modern Extensions and Architecture-Level Patterns",
			curriculum: [
				{
					title: "Dependency Injection",
					content:
						"Constructor injection and dependency inversion are practical architecture tools, not container worship. Injected collaborators create seams for testing and refactoring even without a DI framework."
				},
				{
					title: "Plugin Architecture and Event Bus Thinking",
					content:
						"Use plugin loading and event bus or pub-sub concepts as architecture-level extensions of classic pattern thinking. Connect these ideas back to Observer, Factory, and Adapter rather than presenting them as disconnected framework magic."
				},
				{
					title: "MVC or MVVM at a Conceptual Level",
					content:
						"MVC and MVVM are responsibility-separation patterns that appear above the class level. The goal is conceptual clarity, not framework-specific detail."
				},
				{
					title: "Repository and Service Layering",
					content:
						"Repository and service boundaries keep domain logic, persistence, and integration concerns from collapsing into the same classes. Use this to reinforce package structure and dependency direction from the earlier modules."
				},
				{
					title: "Worked Example Set: From Pattern Catalog to Application Architecture",
					content:
						"Compare a small desktop-style app, a notification service, and a plugin-based tool to see how multiple patterns combine into a coherent architecture. Stop treating patterns as isolated boxes and start seeing them as collaboration choices."
				},
				{
					title: "Reflection Question: When Does a Pattern Become Architecture?",
					content:
						"Explain the difference between class-level pattern use and architecture-level responsibility separation. A strong response identifies when the main design question shifts from one class to the shape of the whole system."
				},
				{
					title: "DPJ8 Modern Extensions and Architecture-Level Patterns: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ8 Modern Extensions and Architecture-Level Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-patterns/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: describe DI without mentioning a container at all. Prompt: explain what a repository boundary protects the rest of the system from.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-patterns/solution"
				},
				{
					title: "Modern Extensions and Architecture Level Patterns Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ8 Modern Extensions and Architecture-Level Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-15-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-15-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-2/solution"
				},
				{
					title: "Modern Extensions and Architecture Level Patterns Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ8 Modern Extensions and Architecture-Level Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-16-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-16-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ9 Pattern Selection and Refactoring Judgment",
			curriculum: [
				{
					title: "Smell-to-Pattern Mapping",
					content:
						"Map common smells to likely pattern responses: switch statements toward Strategy or State, tangled construction toward Factory or Builder, subsystem chaos toward Facade, and cross-package mismatch toward Adapter. Stress that the mapping is a hypothesis, not a mechanical rule."
				},
				{
					title: "When Not to Use the Pattern",
					content:
						"Every pattern now gets an explicit restraint pass. Delete abstractions, collapse hierarchies, or keep direct code when the collaboration pressure is low."
				},
				{
					title: "Design Review Exercise: Name the Tradeoff, Not Just the Pattern",
					content:
						"Review a medium example and argue for or against introducing a pattern. Credit should go to the quality of the tradeoff analysis, not to how many pattern names are mentioned."
				},
				{
					title: "Refactoring Preview: Pattern Selection Requires Safe Change",
					content:
						"Bridge into the follow-up refactoring course by showing that pattern choice is inseparable from small, safe code transformation steps. Visible pattern: Why Extract Method, Move Method, Replace Conditional with Polymorphism, and similar refactorings are the path into better design."
				},
				{
					title: "Mini Lab: Improve a Brittle Object Model with Restraint",
					content:
						"Start from a messy Java design, identify only the highest-value improvements, and refactor toward a smaller justified set of patterns. Include a note about what was intentionally left alone."
				},
				{
					title: "Reflection Question: What Improvement Was Actually Measured?",
					content:
						"Explain how they know a refactor improved extensibility, readability, or testability rather than merely increasing abstraction. A strong answer should mention a before-and-after collaboration or change scenario."
				},
				{
					title: "DPJ9 Pattern Selection and Refactoring Judgment: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ9 Pattern Selection and Refactoring Judgment",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: argue against a pattern when the underlying smell is weak. Prompt: identify the smallest useful next refactor rather than the biggest theoretical rewrite.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/solution"
				},
				{
					title: "Pattern Selection and Refactoring Judgment Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ9 Pattern Selection and Refactoring Judgment",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-17-dpj9-pattern-selection-and-refactoring-judgment-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-17-dpj9-pattern-selection-and-refactoring-judgment-supplemental-2/solution"
				},
				{
					title: "Pattern Selection and Refactoring Judgment Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ9 Pattern Selection and Refactoring Judgment",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-18-dpj9-pattern-selection-and-refactoring-judgment-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-18-dpj9-pattern-selection-and-refactoring-judgment-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ10 Capstone Refactor",
			curriculum: [
				{
					title: "Capstone Launch: Start from a Cluttered Java Application",
					content:
						"Begin with a medium-sized Java program that has real design pain, such as duplicated creation logic, long conditionals, hidden dependencies, or weak package boundaries. The capstone feels like a rescue mission, not a greenfield architecture fantasy."
				},
				{
					title: "Problem Framing: Identify Three to Five Real Design Pressures",
					content:
						"Document the specific smells and collaboration failures they intend to fix. Good capstones name the real change scenarios that currently hurt."
				},
				{
					title: "Refactor Plan: Choose a Small Justified Pattern Set",
					content:
						"Select only the patterns that address the identified pressures, such as Strategy for branching behavior, Factory for unstable creation, Observer for notification flow, or Facade for subsystem chaos. Explain why other patterns were not chosen."
				},
				{
					title: "Implementation Pass: Preserve Behavior While Improving Structure",
					content:
						"Apply the refactor in disciplined steps, keeping the application runnable and reviewable throughout the process. Use tests, debug checkpoints, or demo scripts to ensure behavior remains intact."
				},
				{
					title: "Architecture Review: Package Layout, Seams, and Testability",
					content:
						"Evaluate the final design in terms of package structure, dependency direction, and ease of change. The resulting design should be defensible as actually easier to extend or test."
				},
				{
					title: "Capstone Reflection: What Changed and What Stayed Simple?",
					content:
						"Close the course by documenting the original pain, the chosen patterns, the tradeoffs introduced, and the places where simplicity won over more abstraction. This reflection prepares the path into the follow-up refactoring course."
				},
				{
					title: "DPJ10 Capstone Refactor: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ10 Capstone Refactor",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: justify each introduced pattern with a concrete before-and-after change story. Prompt: name which parts of the final design remained intentionally plain.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/solution"
				},
				{
					title: "Capstone Refactor Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ10 Capstone Refactor",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-19-dpj10-capstone-refactor-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-19-dpj10-capstone-refactor-supplemental-2/solution"
				},
				{
					title: "Capstone Refactor Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ10 Capstone Refactor",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-20-dpj10-capstone-refactor-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-20-dpj10-capstone-refactor-supplemental-3/solution"
				}
			]
		},
		{
			title: "Pattern Implementation Lab 15: Implementation Lab",
			curriculum: [
				{
					title: "Pattern Implementation Lab 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 15: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Pattern Implementation Lab 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 15: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Pattern Implementation Lab 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 15: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/solution"
				},
				{
					title: "Pattern Implementation Lab 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 15: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Implementation Lab 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 15: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/solution"
				},
				{
					title: "Pattern Implementation Lab 15 Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"Pattern Implementation Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-29-applied-studio-15-pattern-implementation-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-29-applied-studio-15-pattern-implementation-lab-15-supplemental-2/solution"
				},
				{
					title: "Pattern Implementation Lab 15 Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"Pattern Implementation Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-30-applied-studio-15-pattern-implementation-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-30-applied-studio-15-pattern-implementation-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Pattern Implementation Lab 16: Implementation Lab",
			curriculum: [
				{
					title: "Pattern Implementation Lab 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 16: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Pattern Implementation Lab 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 16: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Pattern Implementation Lab 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 16: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/solution"
				},
				{
					title: "Pattern Implementation Lab 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 16: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Implementation Lab 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 16: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/solution"
				},
				{
					title: "Pattern Implementation Lab 16 Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"Pattern Implementation Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-31-applied-studio-16-pattern-implementation-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-31-applied-studio-16-pattern-implementation-lab-16-supplemental-2/solution"
				},
				{
					title: "Pattern Implementation Lab 16 Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"Pattern Implementation Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-32-applied-studio-16-pattern-implementation-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-32-applied-studio-16-pattern-implementation-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Pattern Implementation Lab 17: Implementation Lab",
			curriculum: [
				{
					title: "Pattern Implementation Lab 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 17: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Pattern Implementation Lab 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 17: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Pattern Implementation Lab 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 17: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/solution"
				},
				{
					title: "Pattern Implementation Lab 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 17: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Implementation Lab 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle:
							"Pattern Implementation Lab 17: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/solution"
				},
				{
					title: "Pattern Implementation Lab 17 Supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"Pattern Implementation Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-33-applied-studio-17-pattern-implementation-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-33-applied-studio-17-pattern-implementation-lab-17-supplemental-2/solution"
				},
				{
					title: "Pattern Implementation Lab 17 Supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"Pattern Implementation Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-34-applied-studio-17-pattern-implementation-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-34-applied-studio-17-pattern-implementation-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};
