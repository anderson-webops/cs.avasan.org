import type { RawCourse } from "./types";

export const designPatternsInJavaCourse: RawCourse = {
	name: "Design Patterns in Java",
	modules: [
		{
			title: "DPJ1 What Patterns Are and What They Are Not",
			curriculum: [
				{
					title: "Introductions, Tooling, and Multi-File Workflow",
					content:
						"Set up a Java workspace in IntelliJ IDEA or VS Code with a current JDK, a build tool such as Gradle or Maven, and a debugger that works across packages and multiple files. Students should treat package structure, tests, and build scripts as part of the design lesson rather than as incidental setup."
				},
				{
					title: "Concept Lesson: Pattern, Anti-Pattern, and Overengineering",
					content:
						"Use Refactoring.Guru's framing that patterns are reusable design ideas, not copy-paste recipes or status symbols. Contrast genuine recurring design problems with over-designed code that introduces interfaces, factories, or inheritance before any flexibility is actually needed."
				},
				{
					title: "Code Smell Survey Before Pattern Selection",
					content:
						"Introduce the smell categories that drive this course: bloaters, object-orientation abusers, change preventers, dispensables, and couplers. Use beginner-friendly examples such as long methods, switch statements, duplicate code, data clumps, feature envy, and shotgun surgery to show why architecture pain appears."
				},
				{
					title: "Worked Example Set: Why Inheritance Ages Badly",
					content:
						"Compare a rigid subclass tree with a composition-based design that can vary behavior without multiplying classes. Use game rules, notifications, or pricing rules to show why 'just add another subclass' becomes costly once behavior starts crossing axes."
				},
				{
					title: "Design Exercise: Smell or Reasonable Simplicity?",
					content:
						"Give several short Java designs and ask students to classify them as healthy simplicity, code smell, or pattern-shaped overkill. The point is to train judgment before introducing the named patterns themselves."
				},
				{
					title: "Reflection Question: When Does a Pattern Actually Help?",
					content:
						"Require students to explain the problem that must exist before a pattern becomes justified. They should name at least one case where a pattern would be premature and one where a smell clearly points toward structural change."
				},
				{
					title: "DPJ1 What Patterns Are and What They Are Not: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Check whether students can define a design pattern as a reusable solution shape instead of a library feature or template. Use a short prompt that asks whether every duplicated `if` statement deserves a Strategy refactor.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/solution"
				},
				{
					title: "What Patterns Are and What They Are Not supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ1 What Patterns Are and What They Are Not. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-dpj1-what-patterns-are-and-what-they-are-not-sup/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-dpj1-what-patterns-are-and-what-they-are-not-sup/solution"
				},
				{
					title: "What Patterns Are and What They Are Not supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ1 What Patterns Are and What They Are Not. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-dpj1-what-patterns-are-and-what-they-are-not-sup/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-dpj1-what-patterns-are-and-what-they-are-not-sup/solution"
				}
			]
		},
		{
			title: "DPJ2 Java Design Foundations",
			curriculum: [
				{
					title: "Concept Lesson: Interfaces, Abstract Classes, and Contracts",
					content:
						"Teach interfaces as behavioral contracts and abstract classes as partial implementation tools, not interchangeable ceremony. Use package boundaries, visibility modifiers, and `final` to show how Java makes dependency direction and collaboration visible."
				},
				{
					title: "Concept Lesson: Composition, Cohesion, and Dependency Direction",
					content:
						"Develop composition over inheritance, high cohesion, and low coupling as the base layer underneath almost every later pattern. Make students explain which class owns which responsibility before any refactor starts."
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
						"Teach students to ask whether the package layout reveals the architecture or merely mirrors folders. Good Java design should make stable boundaries obvious in the codebase. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Reflection Question: What Makes a Good Seam in Java?",
					content:
						"Ask students to identify where they would insert an interface, fake, or wrapper if they needed to change behavior safely later. The answer should reference testability, not abstraction for its own sake."
				},
				{
					title: "DPJ2 Java Design Foundations: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Check whether students can justify an interface with a collaboration boundary rather than habit. Ask them to explain when an immutable data object is cleaner than a highly configurable mutable one.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/solution"
				},
				{
					title: "Java Design Foundations supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ2 Java Design Foundations. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-dpj2-java-design-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-dpj2-java-design-foundations-supplemental-2/solution"
				},
				{
					title: "Java Design Foundations supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ2 Java Design Foundations. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"Show how Abstract Factory handles product families that must vary together, such as themed UI components, environment-specific services, or game content packs. Emphasize consistency of families rather than sheer number of factory classes."
				},
				{
					title: "Builder",
					content:
						"Teach Builder as a response to large object setup, optional configuration, and unreadable telescoping constructors. Compare a fluent builder with static factories and plain constructors so students can feel the tradeoff."
				},
				{
					title: "Worked Example Set: Duplicated Creation Logic in a Java App",
					content:
						"Refactor a cluttered object-creation flow first into Factory Method, then into Abstract Factory or Builder only if the constraints truly justify it. Use product variability, readability, and test seams as the deciding criteria."
				},
				{
					title: "Pattern Selection Drill: Factory or Builder?",
					content:
						"Give examples where students must decide whether the real problem is product family selection, complex configuration, or both. This prevents Builder and Factory from collapsing into one vague 'object creation' lesson."
				},
				{
					title: "Reflection Question: How Much Creation Logic Is Too Much?",
					content:
						"Ask students to explain the point at which direct constructor calls become a maintenance problem. They should mention duplicated rules, hidden dependencies, or families that must stay compatible."
				},
				{
					title: "DPJ3 Creational Patterns I: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Check whether students can explain why Abstract Factory is about coordinated families rather than just more factories. Use a short prompt asking when a named constructor is enough and a Builder is unnecessary.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/solution"
				},
				{
					title: "Creational Patterns I supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ3 Creational Patterns I. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj3-creational-patterns-i-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj3-creational-patterns-i-supplemental-2/solution"
				},
				{
					title: "Creational Patterns I supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ3 Creational Patterns I. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"Teach Prototype when cloning configured objects is simpler than reconstructing them from scratch. Focus on controlled copying, variation from a seed object, and the risks of shallow versus deep copy."
				},
				{
					title: "Singleton and Why to Be Skeptical",
					content:
						"Present Singleton because it is part of the classic catalog, but teach it through the lens of hidden global state, test pain, and lifetime ambiguity. Students should leave preferring scoped services and injection unless a truly application-wide single instance is warranted."
				},
				{
					title: "Adapter",
					content:
						"Use Adapter to reconcile mismatched interfaces when integrating older code, third-party libraries, or inconsistent data providers. Stress that Adapter preserves the client-side contract rather than polluting the domain with foreign shapes."
				},
				{
					title: "Facade",
					content:
						"Use Facade to simplify access to a subsystem that currently exposes too much internal structure. Show the difference between a boundary-oriented facade and a bloated god object. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Worked Example Set: Clone, Wrap, or Simplify?",
					content:
						"Give a legacy-integration example where students must choose between Prototype, Adapter, and Facade based on what the current pain actually is. Use this lesson to reinforce that pattern selection starts from forces, not names."
				},
				{
					title: "Reflection Question: Why Is Singleton So Tempting?",
					content:
						"Ask students to explain why Singleton often feels convenient at first and why that convenience creates hidden cost later. They should compare it with constructor injection or explicit application wiring."
				},
				{
					title: "DPJ4 Creational Patterns II and Boundary Patterns: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-pattern/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-pattern/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can distinguish wrapping an incompatible API from simplifying a noisy subsystem. Use a quick prompt asking whether a logger should automatically become a Singleton.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-pattern/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-pattern/solution"
				},
				{
					title: "Creational Patterns II and Boundary Patterns supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ4 Creational Patterns II and Boundary Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-pattern-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-pattern-2/solution"
				},
				{
					title: "Creational Patterns II and Boundary Patterns supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ4 Creational Patterns II and Boundary Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj4-creational-patterns-ii-and-boundary-pattern/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj4-creational-patterns-ii-and-boundary-pattern/solution"
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
						"Teach Composite through recursive structures such as menus, scene graphs, or document trees. Students should understand when treating leaf and group nodes uniformly improves client code."
				},
				{
					title: "Decorator",
					content:
						"Use Decorator to layer behavior without creating endless subclasses for every feature combination. Logging, formatting, scoring, and effect modifiers make good motivating examples. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Proxy and Flyweight",
					content:
						"Teach Proxy as controlled indirection for lazy loading, access control, or observation, and Flyweight as shared intrinsic state for memory-sensitive repeated objects. Make students articulate why these two patterns solve different problems even though both can involve wrappers and delegation."
				},
				{
					title: "Worked Example Set: Tree, Wrapper, or Indirection?",
					content:
						"Compare a drawing app, resource viewer, and icon-heavy UI to decide whether the real pressure is hierarchy, layered behavior, access indirection, or object count. This helps students avoid using Decorator where Composite or Proxy would be cleaner."
				},
				{
					title: "Reflection Question: Which Structural Pattern Changes the Client View?",
					content:
						"Ask students to explain how each structural pattern changes what the client needs to know. A strong answer should distinguish hidden subsystem complexity, preserved interface shape, recursive composition, and deferred access."
				},
				{
					title: "DPJ5 Structural Patterns in Depth: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Check whether students can justify Flyweight with repeated intrinsic state rather than simple reuse. Use a quick prompt asking whether a layered coffee-order system wants Decorator or Builder.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/solution"
				},
				{
					title: "Structural Patterns in Depth supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ5 Structural Patterns in Depth. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj5-structural-patterns-in-depth-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj5-structural-patterns-in-depth-supplemental-2/solution"
				},
				{
					title: "Structural Patterns in Depth supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ5 Structural Patterns in Depth. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"Use Strategy to replace branching behavior with swappable algorithms for pricing, movement, targeting, scoring, or validation rules. Show how this connects directly to code smells like switch statements and primitive obsession."
				},
				{
					title: "State",
					content:
						"Teach State as an object-oriented response to behavior that changes based on internal mode or phase. Use examples like workflow stages, player states, or document lifecycle transitions to contrast State with Strategy."
				},
				{
					title: "Template Method",
					content:
						"Use Template Method when an algorithm skeleton is fixed but selected steps vary across subclasses. Show both the power and the inheritance coupling so students know when composition might be cleaner."
				},
				{
					title: "Iterator",
					content:
						"Use Iterator to traverse structures without exposing collection internals or forcing clients to know the storage shape. Compare custom iteration across trees or filtered views with the simpler cases already covered by Java collections."
				},
				{
					title: "Worked Example Set: Replace Conditionals with Behavior Objects",
					content:
						"Start with long conditional logic, then compare refactors using Strategy, State, or Template Method. Require students to explain why one of the three is the best fit instead of using them interchangeably."
				},
				{
					title: "Reflection Question: Where Does the Decision Live Now?",
					content:
						"Ask students to explain how Strategy, State, and Template Method relocate variation compared with a giant conditional block. They should identify whether the variability is chosen from outside, driven by object state, or fixed in an algorithm skeleton."
				},
				{
					title: "DPJ6 Behavioral Patterns I: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Check whether students can choose State versus Strategy based on who selects the behavior and when it changes. Ask them whether Template Method helps when inheritance is already the source of the current design pain.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/solution"
				},
				{
					title: "Behavioral Patterns I supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ6 Behavioral Patterns I. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj6-behavioral-patterns-i-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj6-behavioral-patterns-i-supplemental-2/solution"
				},
				{
					title: "Behavioral Patterns I supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ6 Behavioral Patterns I. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"Teach Observer through notifications, UI listeners, and event-driven collaboration where publishers should not know their consumers in detail. Make coupling direction and unsubscribe behavior explicit."
				},
				{
					title: "Command",
					content:
						"Use Command to package requests as objects that can be queued, logged, replayed, or undone. Connect this pattern to menu systems, editor actions, macro recording, and job execution. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Chain of Responsibility",
					content:
						"Teach Chain of Responsibility as staged handling where each object can process, pass along, or stop a request. Use middleware, validation pipelines, or event filters as intuitive Java examples."
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
						"Ask students to identify where message flow is centered in Observer, Chain of Responsibility, and Mediator. They should explain how each changes coupling and control flow. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "DPJ7 Behavioral Patterns II: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Check whether students can distinguish event subscription from ordered request handling and from centralized coordination. Use a short prompt asking when Memento is better than exposing every field for manual rollback.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/solution"
				},
				{
					title: "Behavioral Patterns II supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ7 Behavioral Patterns II. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj7-behavioral-patterns-ii-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj7-behavioral-patterns-ii-supplemental-2/solution"
				},
				{
					title: "Behavioral Patterns II supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ7 Behavioral Patterns II. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"Teach constructor injection and dependency inversion as practical architecture tools, not container worship. Students should learn how injected collaborators create seams for testing and refactoring even without a DI framework."
				},
				{
					title: "Plugin Architecture and Event Bus Thinking",
					content:
						"Use plugin loading and event bus or pub-sub concepts as architecture-level extensions of classic pattern thinking. Connect these ideas back to Observer, Factory, and Adapter rather than presenting them as disconnected framework magic."
				},
				{
					title: "MVC or MVVM at a Conceptual Level",
					content:
						"Introduce MVC or MVVM as responsibility-separation patterns that appear above the class level. The goal is conceptual clarity, not framework-specific detail. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Repository and Service Layering",
					content:
						"Teach repository and service boundaries where appropriate so domain logic, persistence, and integration concerns do not collapse into the same classes. Use this to reinforce package structure and dependency direction from the earlier modules."
				},
				{
					title: "Worked Example Set: From Pattern Catalog to Application Architecture",
					content:
						"Compare a small desktop-style app, a notification service, and a plugin-based tool to see how multiple patterns combine into a coherent architecture. Students should stop treating patterns as isolated boxes and start seeing them as collaboration choices."
				},
				{
					title: "Reflection Question: When Does a Pattern Become Architecture?",
					content:
						"Ask students to explain the difference between class-level pattern use and architecture-level responsibility separation. They should identify when the main design question shifts from one class to the shape of the whole system."
				},
				{
					title: "DPJ8 Modern Extensions and Architecture-Level Patterns: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-pa/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-pa/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can describe DI without mentioning a container at all. Use a short prompt asking what a repository boundary protects the rest of the system from. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-pa/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-pa/solution"
				},
				{
					title: "Modern Extensions and Architecture Level Patterns supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ8 Modern Extensions and Architecture-Level Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-15-dpj8-modern-extensions-and-architecture-level-pa/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-15-dpj8-modern-extensions-and-architecture-level-pa/solution"
				},
				{
					title: "Modern Extensions and Architecture Level Patterns supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ8 Modern Extensions and Architecture-Level Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-16-dpj8-modern-extensions-and-architecture-level-pa/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-16-dpj8-modern-extensions-and-architecture-level-pa/solution"
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
						"Every pattern in the course should now get an explicit restraint pass. Teach students to delete abstractions, collapse hierarchies, or keep direct code when the collaboration pressure is low."
				},
				{
					title: "Design Review Exercise: Name the Tradeoff, Not Just the Pattern",
					content:
						"Have students review a medium example and argue for or against introducing a pattern. Credit should go to the quality of the tradeoff analysis, not to how many pattern names are mentioned."
				},
				{
					title: "Refactoring Preview: Pattern Selection Requires Safe Change",
					content:
						"Bridge into the follow-up refactoring course by showing that pattern choice is inseparable from small, safe code transformation steps. Students should see why Extract Method, Move Method, Replace Conditional with Polymorphism, and similar refactorings are the path into better design."
				},
				{
					title: "Mini Lab: Improve a Brittle Object Model with Restraint",
					content:
						"Start from a messy Java design, identify only the highest-value improvements, and refactor toward a smaller justified set of patterns. Require a note about what was intentionally left alone."
				},
				{
					title: "Reflection Question: What Improvement Was Actually Measured?",
					content:
						"Ask students to explain how they know a refactor improved extensibility, readability, or testability rather than merely increasing abstraction. A strong answer should mention a before-and-after collaboration or change scenario."
				},
				{
					title: "DPJ9 Pattern Selection and Refactoring Judgment: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Check whether students can argue against a pattern when the underlying smell is weak. Ask them to identify the smallest useful next refactor rather than the biggest theoretical rewrite.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/solution"
				},
				{
					title: "Pattern Selection and Refactoring Judgment supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ9 Pattern Selection and Refactoring Judgment. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-17-dpj9-pattern-selection-and-refactoring-judgment-/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-17-dpj9-pattern-selection-and-refactoring-judgment-/solution"
				},
				{
					title: "Pattern Selection and Refactoring Judgment supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ9 Pattern Selection and Refactoring Judgment. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-18-dpj9-pattern-selection-and-refactoring-judgment-/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-18-dpj9-pattern-selection-and-refactoring-judgment-/solution"
				}
			]
		},
		{
			title: "DPJ10 Capstone Refactor",
			curriculum: [
				{
					title: "Capstone Launch: Start from a Cluttered Java Application",
					content:
						"Begin with a medium-sized Java program that has real design pain, such as duplicated creation logic, long conditionals, hidden dependencies, or weak package boundaries. The capstone should feel like a rescue mission, not a greenfield architecture fantasy."
				},
				{
					title: "Problem Framing: Identify Three to Five Real Design Pressures",
					content:
						"Have students document the specific smells and collaboration failures they intend to fix. Good capstones name the real change scenarios that currently hurt. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Refactor Plan: Choose a Small Justified Pattern Set",
					content:
						"Select only the patterns that address the identified pressures, such as Strategy for branching behavior, Factory for unstable creation, Observer for notification flow, or Facade for subsystem chaos. Students should explain why other patterns were not chosen."
				},
				{
					title: "Implementation Pass: Preserve Behavior While Improving Structure",
					content:
						"Apply the refactor in disciplined steps, keeping the application runnable and reviewable throughout the process. Encourage the use of tests, debug checkpoints, or demo scripts to ensure behavior remains intact."
				},
				{
					title: "Architecture Review: Package Layout, Seams, and Testability",
					content:
						"Evaluate the final design in terms of package structure, dependency direction, and ease of change. Make students defend whether the resulting design is actually easier to extend or test."
				},
				{
					title: "Capstone Reflection: What Changed and What Stayed Simple?",
					content:
						"Close the course by documenting the original pain, the chosen patterns, the tradeoffs introduced, and the places where simplicity won over more abstraction. This reflection should prepare students for the follow-up refactoring course."
				},
				{
					title: "DPJ10 Capstone Refactor: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
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
						"Check whether students can justify each introduced pattern with a concrete before-and-after change story. Use a short checkpoint asking what parts of the final design remained intentionally plain.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/solution"
				},
				{
					title: "Capstone Refactor supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ10 Capstone Refactor. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-19-dpj10-capstone-refactor-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-19-dpj10-capstone-refactor-supplemental-2/solution"
				},
				{
					title: "Capstone Refactor supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPJ10 Capstone Refactor. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-20-dpj10-capstone-refactor-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-20-dpj10-capstone-refactor-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 11: AJ Check In 3",
			curriculum: [
				{
					title: "AJ Check In 3: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 11: AJ Check In 3, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ Check In 3: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 11: AJ Check In 3, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ Check In 3: Core Project",
					content:
						"Build the central artifact for Applied Studio 11: AJ Check In 3. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3-Starter"
				},
				{
					title: "AJ Check In 3: Review and Reflection",
					content:
						"Close Applied Studio 11: AJ Check In 3 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "AJ Check In 3: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 11: AJ Check In 3 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-In-3-Starter"
				},
				{
					title: "Applied Studio 11: AJ Check In 3 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: AJ Check In 3. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-21-applied-studio-11-aj-check-in-3-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-21-applied-studio-11-aj-check-in-3-supplemental-2/solution"
				},
				{
					title: "Applied Studio 11: AJ Check In 3 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: AJ Check In 3. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-22-applied-studio-11-aj-check-in-3-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-22-applied-studio-11-aj-check-in-3-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 12: AJ Check in 4",
			curriculum: [
				{
					title: "AJ Check in 4: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: AJ Check in 4, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ Check in 4: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: AJ Check in 4, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "AJ Check in 4: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: AJ Check in 4. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-in-4-Starter"
				},
				{
					title: "AJ Check in 4: Review and Reflection",
					content:
						"Close Applied Studio 12: AJ Check in 4 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "AJ Check in 4: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: AJ Check in 4 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ-Check-in-4-Starter"
				},
				{
					title: "Applied Studio 12: AJ Check in 4 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: AJ Check in 4. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-23-applied-studio-12-aj-check-in-4-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-23-applied-studio-12-aj-check-in-4-supplemental-2/solution"
				},
				{
					title: "Applied Studio 12: AJ Check in 4 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: AJ Check in 4. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-24-applied-studio-12-aj-check-in-4-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-24-applied-studio-12-aj-check-in-4-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 13: Flower Class",
			curriculum: [
				{
					title: "Flower Class: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: Flower Class, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Flower Class: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: Flower Class, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Flower Class: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: Flower Class. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Flower-Class"
				},
				{
					title: "Flower Class: Review and Reflection",
					content:
						"Close Applied Studio 13: Flower Class by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Flower Class: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: Flower Class with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Flower-Class"
				},
				{
					title: "Applied Studio 13: Flower Class supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: Flower Class. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-25-applied-studio-13-flower-class-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-25-applied-studio-13-flower-class-supplemental-2/solution"
				},
				{
					title: "Applied Studio 13: Flower Class supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: Flower Class. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-26-applied-studio-13-flower-class-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-26-applied-studio-13-flower-class-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: Sum of the First N",
			curriculum: [
				{
					title: "Sum of the First N: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: Sum of the First N, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "Sum of the First N: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: Sum of the First N, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Sum of the First N: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: Sum of the First N. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Sum-of-the-First-N"
				},
				{
					title: "Sum of the First N: Review and Reflection",
					content:
						"Close Applied Studio 14: Sum of the First N by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Sum of the First N: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: Sum of the First N with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Sum-of-the-First-N"
				},
				{
					title: "Applied Studio 14: Sum of the First N supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: Sum of the First N. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-27-applied-studio-14-sum-of-the-first-n-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-27-applied-studio-14-sum-of-the-first-n-supplemental-2/solution"
				},
				{
					title: "Applied Studio 14: Sum of the First N supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: Sum of the First N. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-28-applied-studio-14-sum-of-the-first-n-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-28-applied-studio-14-sum-of-the-first-n-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: pattern implementation lab 15",
			curriculum: [
				{
					title: "pattern implementation lab 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: pattern implementation lab 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "pattern implementation lab 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: pattern implementation lab 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "pattern implementation lab 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: pattern implementation lab 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/solution"
				},
				{
					title: "pattern implementation lab 15: Review and Reflection",
					content:
						"Close Applied Studio 15: pattern implementation lab 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "pattern implementation lab 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: pattern implementation lab 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/solution"
				},
				{
					title: "Applied Studio 15: pattern implementation lab 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: pattern implementation lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-29-applied-studio-15-pattern-implementation-lab-15-/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-29-applied-studio-15-pattern-implementation-lab-15-/solution"
				},
				{
					title: "Applied Studio 15: pattern implementation lab 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: pattern implementation lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-30-applied-studio-15-pattern-implementation-lab-15-/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-30-applied-studio-15-pattern-implementation-lab-15-/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: pattern implementation lab 16",
			curriculum: [
				{
					title: "pattern implementation lab 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: pattern implementation lab 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "pattern implementation lab 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: pattern implementation lab 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "pattern implementation lab 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: pattern implementation lab 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/solution"
				},
				{
					title: "pattern implementation lab 16: Review and Reflection",
					content:
						"Close Applied Studio 16: pattern implementation lab 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "pattern implementation lab 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: pattern implementation lab 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/solution"
				},
				{
					title: "Applied Studio 16: pattern implementation lab 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: pattern implementation lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-31-applied-studio-16-pattern-implementation-lab-16-/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-31-applied-studio-16-pattern-implementation-lab-16-/solution"
				},
				{
					title: "Applied Studio 16: pattern implementation lab 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: pattern implementation lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-32-applied-studio-16-pattern-implementation-lab-16-/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-32-applied-studio-16-pattern-implementation-lab-16-/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: pattern implementation lab 17",
			curriculum: [
				{
					title: "pattern implementation lab 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: pattern implementation lab 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "pattern implementation lab 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: pattern implementation lab 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "pattern implementation lab 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: pattern implementation lab 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/solution"
				},
				{
					title: "pattern implementation lab 17: Review and Reflection",
					content:
						"Close Applied Studio 17: pattern implementation lab 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "pattern implementation lab 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: pattern implementation lab 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/solution"
				},
				{
					title: "Applied Studio 17: pattern implementation lab 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: pattern implementation lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-33-applied-studio-17-pattern-implementation-lab-17-/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-33-applied-studio-17-pattern-implementation-lab-17-/solution"
				},
				{
					title: "Applied Studio 17: pattern implementation lab 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: pattern implementation lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-34-applied-studio-17-pattern-implementation-lab-17-/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-34-applied-studio-17-pattern-implementation-lab-17-/solution"
				}
			]
		}
	]
};
