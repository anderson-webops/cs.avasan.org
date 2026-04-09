import type { RawCourse, RawCourseModuleItem } from "./types";

function supportItems(
	diagnostic: string,
	misconceptions: string,
	extension?: RawCourseModuleItem
) {
	const items: RawCourseModuleItem[] = [
		{
			title: "Diagnostic Checkpoint",
			content: diagnostic
		},
		{
			title: "Misconception Watchlist",
			content: misconceptions
		}
	];

	if (extension) {
		items.push(extension);
	}

	return items;
}

export const designPatternsInJavaCourse: RawCourse = {
	name: "Design Patterns in Java",
	modules: [
		{
			title: "DPJ1 What Patterns Are and What They Are Not",
			curriculum: [
				{
					title: "Introductions, Tooling, and Multi-File Workflow",
					content: [
						"Set up a Java workspace in IntelliJ IDEA or VS Code with a current JDK, a build tool such as Gradle or Maven, and a debugger that works across packages and multiple files.",
						"Students should treat package structure, tests, and build scripts as part of the design lesson rather than as incidental setup."
					].join(" ")
				},
				{
					title: "Concept Lesson: Pattern, Anti-Pattern, and Overengineering",
					content: [
						"Use Refactoring.Guru's framing that patterns are reusable design ideas, not copy-paste recipes or status symbols.",
						"Contrast genuine recurring design problems with over-designed code that introduces interfaces, factories, or inheritance before any flexibility is actually needed."
					].join(" ")
				},
				{
					title: "Code Smell Survey Before Pattern Selection",
					content: [
						"Introduce the smell categories that drive this course: bloaters, object-orientation abusers, change preventers, dispensables, and couplers.",
						"Use beginner-friendly examples such as long methods, switch statements, duplicate code, data clumps, feature envy, and shotgun surgery to show why architecture pain appears."
					].join(" ")
				},
				{
					title: "Worked Example Set: Why Inheritance Ages Badly",
					content: [
						"Compare a rigid subclass tree with a composition-based design that can vary behavior without multiplying classes.",
						"Use game rules, notifications, or pricing rules to show why 'just add another subclass' becomes costly once behavior starts crossing axes."
					].join(" ")
				},
				{
					title: "Design Exercise: Smell or Reasonable Simplicity?",
					content: [
						"Give several short Java designs and ask students to classify them as healthy simplicity, code smell, or pattern-shaped overkill.",
						"The point is to train judgment before introducing the named patterns themselves."
					].join(" ")
				},
				{
					title: "Reflection Question: When Does a Pattern Actually Help?",
					content: [
						"Require students to explain the problem that must exist before a pattern becomes justified.",
						"They should name at least one case where a pattern would be premature and one where a smell clearly points toward structural change."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can define a design pattern as a reusable solution shape instead of a library feature or template.",
					"Use a short prompt that asks whether every duplicated `if` statement deserves a Strategy refactor."
				].join(" "),
				[
					"Students often think learning patterns means memorizing names rather than diagnosing forces and tradeoffs.",
					"They also commonly assume more abstraction automatically means better design."
				].join(" "),
				{
					title: "Extension Project: Pattern Spotting Journal",
					content: [
						"Inspect a small Java codebase and note where creation, structure, or behavior problems are recurring.",
						"Write down which pattern families might help and which parts should remain simple."
					].join(" ")
				}
			)
		},
		{
			title: "DPJ2 Java Design Foundations",
			curriculum: [
				{
					title: "Concept Lesson: Interfaces, Abstract Classes, and Contracts",
					content: [
						"Teach interfaces as behavioral contracts and abstract classes as partial implementation tools, not interchangeable ceremony.",
						"Use package boundaries, visibility modifiers, and `final` to show how Java makes dependency direction and collaboration visible."
					].join(" ")
				},
				{
					title: "Concept Lesson: Composition, Cohesion, and Dependency Direction",
					content: [
						"Develop composition over inheritance, high cohesion, and low coupling as the base layer underneath almost every later pattern.",
						"Make students explain which class owns which responsibility before any refactor starts."
					].join(" ")
				},
				{
					title: "Worked Example Set: Packages, Seams, and Immutable Value Objects",
					content: [
						"Use small Java examples to show how package structure, immutable value types, and constructor injection make systems easier to reason about.",
						"Connect this directly to later Builder, Factory, and DI work."
					].join(" ")
				},
				{
					title: "Refactoring Exercise: Untangle a Responsibility Blob",
					content: [
						"Start from a class that creates objects, makes decisions, performs work, and talks directly to every dependency.",
						"Split responsibilities into cleaner collaborators before introducing named patterns, so the design foundations are explicit."
					].join(" ")
				},
				{
					title: "Design Review: Favoring Explicit Package Structure",
					content: [
						"Teach students to ask whether the package layout reveals the architecture or merely mirrors folders.",
						"Good Java design should make stable boundaries obvious in the codebase."
					].join(" ")
				},
				{
					title: "Reflection Question: What Makes a Good Seam in Java?",
					content: [
						"Ask students to identify where they would insert an interface, fake, or wrapper if they needed to change behavior safely later.",
						"The answer should reference testability, not abstraction for its own sake."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can justify an interface with a collaboration boundary rather than habit.",
					"Ask them to explain when an immutable data object is cleaner than a highly configurable mutable one."
				].join(" "),
				[
					"Students often mistake 'interface per class' for clean design.",
					"They may also keep responsibilities tangled because the program still compiles and runs."
				].join(" "),
				{
					title: "Extension Project: Package Sketch for a Medium App",
					content: [
						"Take a text RPG, order system, or drawing tool and sketch packages for domain logic, adapters, UI, and infrastructure.",
						"Explain which packages should know about which others."
					].join(" ")
				}
			)
		},
		{
			title: "DPJ3 Creational Patterns I",
			curriculum: [
				{
					title: "Factory Method",
					content: [
						"Use Factory Method to centralize creation when subclasses or configuration decide which concrete product should exist.",
						"Keep the lesson grounded in duplicated constructor logic and hard-coded creation branching."
					].join(" ")
				},
				{
					title: "Abstract Factory",
					content: [
						"Show how Abstract Factory handles product families that must vary together, such as themed UI components, environment-specific services, or game content packs.",
						"Emphasize consistency of families rather than sheer number of factory classes."
					].join(" ")
				},
				{
					title: "Builder",
					content: [
						"Teach Builder as a response to large object setup, optional configuration, and unreadable telescoping constructors.",
						"Compare a fluent builder with static factories and plain constructors so students can feel the tradeoff."
					].join(" ")
				},
				{
					title: "Worked Example Set: Duplicated Creation Logic in a Java App",
					content: [
						"Refactor a cluttered object-creation flow first into Factory Method, then into Abstract Factory or Builder only if the constraints truly justify it.",
						"Use product variability, readability, and test seams as the deciding criteria."
					].join(" ")
				},
				{
					title: "Pattern Selection Drill: Factory or Builder?",
					content: [
						"Give examples where students must decide whether the real problem is product family selection, complex configuration, or both.",
						"This prevents Builder and Factory from collapsing into one vague 'object creation' lesson."
					].join(" ")
				},
				{
					title: "Reflection Question: How Much Creation Logic Is Too Much?",
					content: [
						"Ask students to explain the point at which direct constructor calls become a maintenance problem.",
						"They should mention duplicated rules, hidden dependencies, or families that must stay compatible."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can explain why Abstract Factory is about coordinated families rather than just more factories.",
					"Use a short prompt asking when a named constructor is enough and a Builder is unnecessary."
				].join(" "),
				[
					"Students often wrap every constructor in a factory even when no creation variability exists.",
					"They also commonly misuse Builder when a value object with a small constructor would be clearer."
				].join(" "),
				{
					title: "Extension Project: Themed UI or Game Content Family",
					content: [
						"Design a small product family system with interchangeable themes or factions.",
						"Use Factory Method or Abstract Factory deliberately and document why Builder was or was not needed."
					].join(" ")
				}
			)
		},
		{
			title: "DPJ4 Creational Patterns II and Boundary Patterns",
			curriculum: [
				{
					title: "Prototype",
					content: [
						"Teach Prototype when cloning configured objects is simpler than reconstructing them from scratch.",
						"Focus on controlled copying, variation from a seed object, and the risks of shallow versus deep copy."
					].join(" ")
				},
				{
					title: "Singleton and Why to Be Skeptical",
					content: [
						"Present Singleton because it is part of the classic catalog, but teach it through the lens of hidden global state, test pain, and lifetime ambiguity.",
						"Students should leave preferring scoped services and injection unless a truly application-wide single instance is warranted."
					].join(" ")
				},
				{
					title: "Adapter",
					content: [
						"Use Adapter to reconcile mismatched interfaces when integrating older code, third-party libraries, or inconsistent data providers.",
						"Stress that Adapter preserves the client-side contract rather than polluting the domain with foreign shapes."
					].join(" ")
				},
				{
					title: "Facade",
					content: [
						"Use Facade to simplify access to a subsystem that currently exposes too much internal structure.",
						"Show the difference between a boundary-oriented facade and a bloated god object."
					].join(" ")
				},
				{
					title: "Worked Example Set: Clone, Wrap, or Simplify?",
					content: [
						"Give a legacy-integration example where students must choose between Prototype, Adapter, and Facade based on what the current pain actually is.",
						"Use this lesson to reinforce that pattern selection starts from forces, not names."
					].join(" ")
				},
				{
					title: "Reflection Question: Why Is Singleton So Tempting?",
					content: [
						"Ask students to explain why Singleton often feels convenient at first and why that convenience creates hidden cost later.",
						"They should compare it with constructor injection or explicit application wiring."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can distinguish wrapping an incompatible API from simplifying a noisy subsystem.",
					"Use a quick prompt asking whether a logger should automatically become a Singleton."
				].join(" "),
				[
					"Students often confuse Facade with Adapter because both sit at boundaries.",
					"They may also treat Prototype as mere copying rather than a design response to creation friction."
				].join(" "),
				{
					title: "Extension Project: Legacy Integration Layer",
					content: [
						"Design a small Java wrapper around an awkward library or old interface.",
						"Use Adapter and optionally Facade, then explain why no Singleton was introduced."
					].join(" ")
				}
			)
		},
		{
			title: "DPJ5 Structural Patterns in Depth",
			curriculum: [
				{
					title: "Bridge",
					content: [
						"Use Bridge when abstraction and implementation should vary independently, such as shapes versus renderers or notifications versus delivery channels.",
						"Contrast this with subclass explosions that multiply every combination."
					].join(" ")
				},
				{
					title: "Composite",
					content: [
						"Teach Composite through recursive structures such as menus, scene graphs, or document trees.",
						"Students should understand when treating leaf and group nodes uniformly improves client code."
					].join(" ")
				},
				{
					title: "Decorator",
					content: [
						"Use Decorator to layer behavior without creating endless subclasses for every feature combination.",
						"Logging, formatting, scoring, and effect modifiers make good motivating examples."
					].join(" ")
				},
				{
					title: "Proxy and Flyweight",
					content: [
						"Teach Proxy as controlled indirection for lazy loading, access control, or observation, and Flyweight as shared intrinsic state for memory-sensitive repeated objects.",
						"Make students articulate why these two patterns solve different problems even though both can involve wrappers and delegation."
					].join(" ")
				},
				{
					title: "Worked Example Set: Tree, Wrapper, or Indirection?",
					content: [
						"Compare a drawing app, resource viewer, and icon-heavy UI to decide whether the real pressure is hierarchy, layered behavior, access indirection, or object count.",
						"This helps students avoid using Decorator where Composite or Proxy would be cleaner."
					].join(" ")
				},
				{
					title: "Reflection Question: Which Structural Pattern Changes the Client View?",
					content: [
						"Ask students to explain how each structural pattern changes what the client needs to know.",
						"A strong answer should distinguish hidden subsystem complexity, preserved interface shape, recursive composition, and deferred access."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can justify Flyweight with repeated intrinsic state rather than simple reuse.",
					"Use a quick prompt asking whether a layered coffee-order system wants Decorator or Builder."
				].join(" "),
				[
					"Students often describe Decorator and Proxy as the same because both wrap objects.",
					"They may also use Composite where a plain collection plus helper methods would be simpler."
				].join(" "),
				{
					title: "Extension Project: Mini Drawing Toolkit",
					content: [
						"Design shapes and groups with Composite, add rendering variations with Bridge or Decorator, and discuss whether Proxy or Flyweight would help if the object count grew large.",
						"Document which structural patterns genuinely earned their place."
					].join(" ")
				}
			)
		},
		{
			title: "DPJ6 Behavioral Patterns I",
			curriculum: [
				{
					title: "Strategy",
					content: [
						"Use Strategy to replace branching behavior with swappable algorithms for pricing, movement, targeting, scoring, or validation rules.",
						"Show how this connects directly to code smells like switch statements and primitive obsession."
					].join(" ")
				},
				{
					title: "State",
					content: [
						"Teach State as an object-oriented response to behavior that changes based on internal mode or phase.",
						"Use examples like workflow stages, player states, or document lifecycle transitions to contrast State with Strategy."
					].join(" ")
				},
				{
					title: "Template Method",
					content: [
						"Use Template Method when an algorithm skeleton is fixed but selected steps vary across subclasses.",
						"Show both the power and the inheritance coupling so students know when composition might be cleaner."
					].join(" ")
				},
				{
					title: "Iterator",
					content: [
						"Use Iterator to traverse structures without exposing collection internals or forcing clients to know the storage shape.",
						"Compare custom iteration across trees or filtered views with the simpler cases already covered by Java collections."
					].join(" ")
				},
				{
					title: "Worked Example Set: Replace Conditionals with Behavior Objects",
					content: [
						"Start with long conditional logic, then compare refactors using Strategy, State, or Template Method.",
						"Require students to explain why one of the three is the best fit instead of using them interchangeably."
					].join(" ")
				},
				{
					title: "Reflection Question: Where Does the Decision Live Now?",
					content: [
						"Ask students to explain how Strategy, State, and Template Method relocate variation compared with a giant conditional block.",
						"They should identify whether the variability is chosen from outside, driven by object state, or fixed in an algorithm skeleton."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can choose State versus Strategy based on who selects the behavior and when it changes.",
					"Ask them whether Template Method helps when inheritance is already the source of the current design pain."
				].join(" "),
				[
					"Students often use Strategy and State as synonyms because both involve delegation.",
					"They also commonly force Template Method into places where higher-order composition would be cleaner."
				].join(" "),
				{
					title: "Extension Project: Turn-Based Combat Rules",
					content: [
						"Model attacks or movement as Strategy, status or stance changes as State, and turn resolution as a Template Method only if a stable algorithm skeleton truly exists.",
						"Include an Iterator if combat logs or action queues need structured traversal."
					].join(" ")
				}
			)
		},
		{
			title: "DPJ7 Behavioral Patterns II",
			curriculum: [
				{
					title: "Observer",
					content: [
						"Teach Observer through notifications, UI listeners, and event-driven collaboration where publishers should not know their consumers in detail.",
						"Make coupling direction and unsubscribe behavior explicit."
					].join(" ")
				},
				{
					title: "Command",
					content: [
						"Use Command to package requests as objects that can be queued, logged, replayed, or undone.",
						"Connect this pattern to menu systems, editor actions, macro recording, and job execution."
					].join(" ")
				},
				{
					title: "Chain of Responsibility",
					content: [
						"Teach Chain of Responsibility as staged handling where each object can process, pass along, or stop a request.",
						"Use middleware, validation pipelines, or event filters as intuitive Java examples."
					].join(" ")
				},
				{
					title: "Mediator, Memento, and Visitor",
					content: [
						"Use Mediator to reduce many-to-many chatter, Memento to capture restorable state without exposing internals recklessly, and Visitor to add operations over stable object structures.",
						"These should be taught as higher-friction patterns that solve real coordination or traversal pressure rather than default solutions."
					].join(" ")
				},
				{
					title: "Worked Example Set: Event Flow, Undo, and Cross-Object Coordination",
					content: [
						"Compare a notification system, command history, and object-collaboration tangle to decide whether Observer, Command, Chain, Mediator, or Memento best addresses the pressure point.",
						"Use Visitor sparingly and only where adding new operations across a fixed node hierarchy is the real challenge."
					].join(" ")
				},
				{
					title: "Reflection Question: Which Pattern Owns the Conversation?",
					content: [
						"Ask students to identify where message flow is centered in Observer, Chain of Responsibility, and Mediator.",
						"They should explain how each changes coupling and control flow."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can distinguish event subscription from ordered request handling and from centralized coordination.",
					"Use a short prompt asking when Memento is better than exposing every field for manual rollback."
				].join(" "),
				[
					"Students often force Observer into one-shot command flows or misuse Mediator as a god object.",
					"They may also reach for Visitor without a stable object hierarchy or without multiple operations to justify it."
				].join(" "),
				{
					title: "Extension Project: Editor Action System",
					content: [
						"Design a small editor with Observer-driven UI updates, Command-based actions, Memento-backed undo snapshots, and optional Chain or Mediator coordination.",
						"Explain why Visitor is or is not useful in the final design."
					].join(" ")
				}
			)
		},
		{
			title: "DPJ8 Modern Extensions and Architecture-Level Patterns",
			curriculum: [
				{
					title: "Dependency Injection",
					content: [
						"Teach constructor injection and dependency inversion as practical architecture tools, not container worship.",
						"Students should learn how injected collaborators create seams for testing and refactoring even without a DI framework."
					].join(" ")
				},
				{
					title: "Plugin Architecture and Event Bus Thinking",
					content: [
						"Use plugin loading and event bus or pub-sub concepts as architecture-level extensions of classic pattern thinking.",
						"Connect these ideas back to Observer, Factory, and Adapter rather than presenting them as disconnected framework magic."
					].join(" ")
				},
				{
					title: "MVC or MVVM at a Conceptual Level",
					content: [
						"Introduce MVC or MVVM as responsibility-separation patterns that appear above the class level.",
						"The goal is conceptual clarity, not framework-specific detail."
					].join(" ")
				},
				{
					title: "Repository and Service Layering",
					content: [
						"Teach repository and service boundaries where appropriate so domain logic, persistence, and integration concerns do not collapse into the same classes.",
						"Use this to reinforce package structure and dependency direction from the earlier modules."
					].join(" ")
				},
				{
					title: "Worked Example Set: From Pattern Catalog to Application Architecture",
					content: [
						"Compare a small desktop-style app, a notification service, and a plugin-based tool to see how multiple patterns combine into a coherent architecture.",
						"Students should stop treating patterns as isolated boxes and start seeing them as collaboration choices."
					].join(" ")
				},
				{
					title: "Reflection Question: When Does a Pattern Become Architecture?",
					content: [
						"Ask students to explain the difference between class-level pattern use and architecture-level responsibility separation.",
						"They should identify when the main design question shifts from one class to the shape of the whole system."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can describe DI without mentioning a container at all.",
					"Use a short prompt asking what a repository boundary protects the rest of the system from."
				].join(" "),
				[
					"Students often turn service layers into dumping grounds for unrelated logic.",
					"They may also think pub-sub is simply Observer with different names instead of a broader decoupling style."
				].join(" "),
				{
					title: "Extension Project: Mini Plugin-Ready App",
					content: [
						"Sketch a package layout for an app that supports plugins, events, repositories, and injected services.",
						"Name which classic patterns reappear inside the larger architecture."
					].join(" ")
				}
			)
		},
		{
			title: "DPJ9 Pattern Selection and Refactoring Judgment",
			curriculum: [
				{
					title: "Smell-to-Pattern Mapping",
					content: [
						"Map common smells to likely pattern responses: switch statements toward Strategy or State, tangled construction toward Factory or Builder, subsystem chaos toward Facade, and cross-package mismatch toward Adapter.",
						"Stress that the mapping is a hypothesis, not a mechanical rule."
					].join(" ")
				},
				{
					title: "When Not to Use the Pattern",
					content: [
						"Every pattern in the course should now get an explicit restraint pass.",
						"Teach students to delete abstractions, collapse hierarchies, or keep direct code when the collaboration pressure is low."
					].join(" ")
				},
				{
					title: "Design Review Exercise: Name the Tradeoff, Not Just the Pattern",
					content: [
						"Have students review a medium example and argue for or against introducing a pattern.",
						"Credit should go to the quality of the tradeoff analysis, not to how many pattern names are mentioned."
					].join(" ")
				},
				{
					title: "Refactoring Preview: Pattern Selection Requires Safe Change",
					content: [
						"Bridge into the follow-up refactoring course by showing that pattern choice is inseparable from small, safe code transformation steps.",
						"Students should see why Extract Method, Move Method, Replace Conditional with Polymorphism, and similar refactorings are the path into better design."
					].join(" ")
				},
				{
					title: "Mini Lab: Improve a Brittle Object Model with Restraint",
					content: [
						"Start from a messy Java design, identify only the highest-value improvements, and refactor toward a smaller justified set of patterns.",
						"Require a note about what was intentionally left alone."
					].join(" ")
				},
				{
					title: "Reflection Question: What Improvement Was Actually Measured?",
					content: [
						"Ask students to explain how they know a refactor improved extensibility, readability, or testability rather than merely increasing abstraction.",
						"A strong answer should mention a before-and-after collaboration or change scenario."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can argue against a pattern when the underlying smell is weak.",
					"Ask them to identify the smallest useful next refactor rather than the biggest theoretical rewrite."
				].join(" "),
				[
					"Students often assume every smell must be solved immediately with a named pattern.",
					"They may also confuse 'future flexibility' with speculative generality."
				].join(" "),
				{
					title: "Extension Project: Pattern or Simplicity Debate",
					content: [
						"Choose a small feature and prepare two designs: one plain and one pattern-heavy.",
						"Defend which one is better today and under what future pressure the answer would change."
					].join(" ")
				}
			)
		},
		{
			title: "DPJ10 Capstone Refactor",
			curriculum: [
				{
					title: "Capstone Launch: Start from a Cluttered Java Application",
					content: [
						"Begin with a medium-sized Java program that has real design pain, such as duplicated creation logic, long conditionals, hidden dependencies, or weak package boundaries.",
						"The capstone should feel like a rescue mission, not a greenfield architecture fantasy."
					].join(" ")
				},
				{
					title: "Problem Framing: Identify Three to Five Real Design Pressures",
					content: [
						"Have students document the specific smells and collaboration failures they intend to fix.",
						"Good capstones name the real change scenarios that currently hurt."
					].join(" ")
				},
				{
					title: "Refactor Plan: Choose a Small Justified Pattern Set",
					content: [
						"Select only the patterns that address the identified pressures, such as Strategy for branching behavior, Factory for unstable creation, Observer for notification flow, or Facade for subsystem chaos.",
						"Students should explain why other patterns were not chosen."
					].join(" ")
				},
				{
					title: "Implementation Pass: Preserve Behavior While Improving Structure",
					content: [
						"Apply the refactor in disciplined steps, keeping the application runnable and reviewable throughout the process.",
						"Encourage the use of tests, debug checkpoints, or demo scripts to ensure behavior remains intact."
					].join(" ")
				},
				{
					title: "Architecture Review: Package Layout, Seams, and Testability",
					content: [
						"Evaluate the final design in terms of package structure, dependency direction, and ease of change.",
						"Make students defend whether the resulting design is actually easier to extend or test."
					].join(" ")
				},
				{
					title: "Capstone Reflection: What Changed and What Stayed Simple?",
					content: [
						"Close the course by documenting the original pain, the chosen patterns, the tradeoffs introduced, and the places where simplicity won over more abstraction.",
						"This reflection should prepare students for the follow-up refactoring course."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can justify each introduced pattern with a concrete before-and-after change story.",
					"Use a short checkpoint asking what parts of the final design remained intentionally plain."
				].join(" "),
				[
					"Students often add extra abstractions during capstones because the architecture finally feels exciting.",
					"They may also skip documenting why some ugly-but-stable code was left alone."
				].join(" "),
				{
					title: "Capstone Option: Text RPG, Drawing App, or Notification Service",
					content: [
						"Refactor one medium application with a small justified set of patterns and a clear package story.",
						"Include a final note describing the design pressures that remain for a future iteration."
					].join(" ")
				}
			)
		}
	]
};
