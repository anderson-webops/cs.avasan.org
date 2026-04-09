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

export const designPatternsInJavaPart2Course: RawCourse = {
	name: "Design Patterns in Java Part 2: Refactoring",
	modules: [
		{
			title: "DPR1 Code Smells and Safe Refactoring Workflow",
			curriculum: [
				{
					title: "Concept Lesson: Refactoring as Behavior-Preserving Design Change",
					content: [
						"Use Refactoring.Guru's framing that refactoring changes internal structure without changing externally visible behavior.",
						"Teach students to work in small steps with a safety net rather than attempting one heroic rewrite."
					].join(" ")
				},
				{
					title: "Code Smells from Refactoring.Guru",
					content: [
						"Survey the smell families explicitly: bloaters such as Long Method, Large Class, Primitive Obsession, Long Parameter List, and Data Clumps; object-orientation abusers such as Alternative Classes with Different Interfaces, Refused Bequest, Switch Statements, and Temporary Field; change preventers such as Divergent Change, Parallel Inheritance Hierarchies, and Shotgun Surgery; dispensables such as Comments, Duplicate Code, Data Class, Dead Code, Lazy Class, and Speculative Generality; and couplers such as Feature Envy, Inappropriate Intimacy, Incomplete Library Class, Message Chains, and Middle Man.",
						"Use Java examples where students must identify the dominant smell instead of simply listing everything wrong."
					].join(" ")
				},
				{
					title: "Refactoring Workflow: Characterize, Slice, Verify",
					content: [
						"Teach a repeatable loop: identify the smell, describe the desired improvement, isolate the smallest safe step, run tests or manual checks, and only then continue.",
						"Students should treat naming, extraction, and movement as tactical moves toward better architecture."
					].join(" ")
				},
				{
					title: "Worked Example Set: Smell Diagnosis Before Change",
					content: [
						"Review several medium Java snippets and decide whether the dominant pressure is method size, misplaced behavior, bad conditionals, poor object boundaries, or unhealthy inheritance.",
						"This sets up the later modules by linking smells to the right category of refactorings."
					].join(" ")
				},
				{
					title: "Mini Lab: Write the Refactor Plan Before Touching Code",
					content: [
						"Have students write a small staged plan naming the smell, the next one or two refactorings, and the expected benefit before editing.",
						"This prevents flailing and makes code review discussion more precise."
					].join(" ")
				},
				{
					title: "Reflection Question: What Makes a Refactor Reckless?",
					content: [
						"Ask students to explain how a good refactor differs from a rewrite that merely hopes the new version will be better.",
						"They should mention verification and change granularity explicitly."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can classify a smell before proposing a pattern or refactoring.",
					"Use a short prompt asking which is riskier: changing five things at once or committing a sequence of tiny safe improvements."
				].join(" "),
				[
					"Students often think smell diagnosis is subjective enough that any fix is acceptable.",
					"They may also confuse refactoring with feature work or with whole-program rewrites."
				].join(" "),
				{
					title: "Extension Project: Smell Inventory on a Small Java App",
					content: [
						"Audit a small codebase and rank the top smells by how much they block change.",
						"Write the first three refactoring steps you would take and why."
					].join(" ")
				}
			)
		},
		{
			title: "DPR2 Composing Methods",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Composing Methods",
					content: [
						"Cover the full category directly: Extract Method, Inline Method, Extract Variable, Inline Temp, Replace Temp with Query, Split Temporary Variable, Remove Assignments to Parameters, Replace Method with Method Object, and Substitute Algorithm.",
						"Teach these as the core moves for taming Long Method and improving local readability."
					].join(" ")
				},
				{
					title: "Worked Example Set: Shrinking a Long Method",
					content: [
						"Start with a dense Java method, then refactor it in very small steps using extraction, better local names, split temporaries, and algorithm replacement where the logic is overgrown.",
						"Students should see that many later architectural improvements begin here."
					].join(" ")
				},
				{
					title: "Method Object Versus Plain Extraction",
					content: [
						"Explain when Replace Method with Method Object is justified: many local variables, multi-step computation, or logic that deserves its own collaborator.",
						"Compare it against simpler Extract Method work so students do not escalate prematurely."
					].join(" ")
				},
				{
					title: "Mini Lab: Refactor a Calculation Pipeline Safely",
					content: [
						"Take a pricing, scoring, or report-generation method and refactor it into cleaner smaller steps without changing observable output.",
						"Require students to document which composing-method moves were used."
					].join(" ")
				},
				{
					title: "Pattern Connection: Clear Methods Make Later Patterns Possible",
					content: [
						"Show how Strategy, Template Method, and Command become easier to introduce after method-level mess is removed.",
						"Students should understand that patterns often fail when built on top of unreadable methods."
					].join(" ")
				},
				{
					title: "Reflection Question: When Is Extraction Enough?",
					content: [
						"Ask students to explain when they should stop at smaller methods and when they should continue toward a new class or pattern.",
						"The answer should reference responsibility, not raw line count alone."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can pick the smallest composing-method refactor that improves clarity.",
					"Ask them to justify why they used Method Object instead of another Extract Method."
				].join(" "),
				[
					"Students often jump straight from Long Method to a full pattern refactor.",
					"They may also keep poor temporary-variable structure because the method is shorter after extraction."
				].join(" "),
				{
					title: "Extension Project: Report Generator Cleanup",
					content: [
						"Refactor a verbose report-building method using the full composing-method toolkit.",
						"Note which steps improved naming, duplication, or temporary-variable confusion."
					].join(" ")
				}
			)
		},
		{
			title: "DPR3 Moving Features Between Objects",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Moving Features Between Objects",
					content: [
						"Cover Move Method, Move Field, Extract Class, Inline Class, Hide Delegate, Remove Middle Man, Introduce Foreign Method, and Introduce Local Extension.",
						"Frame this category as the main response to Feature Envy, Large Class, and muddled collaboration boundaries."
					].join(" ")
				},
				{
					title: "Worked Example Set: Feature Envy and Large Class",
					content: [
						"Start with Java classes that know too much about neighboring objects or accumulate unrelated fields and behaviors.",
						"Refactor by moving methods or fields to the real owner, then extract or inline classes only when the split becomes defensible."
					].join(" ")
				},
				{
					title: "Delegation Boundaries: Hide or Remove the Middle Man",
					content: [
						"Teach Hide Delegate and Remove Middle Man together so students see both sides of delegation exposure.",
						"The question is not whether delegation is good, but whether the current layer is clarifying or merely forwarding everything."
					].join(" ")
				},
				{
					title: "Local Extension and Foreign Method for Library Friction",
					content: [
						"Use Introduce Foreign Method and Introduce Local Extension to handle awkward third-party or library types without polluting the rest of the codebase.",
						"This pairs naturally with Adapter and Facade from the first course."
					].join(" ")
				},
				{
					title: "Mini Lab: Re-home Behavior Without Breaking Clients",
					content: [
						"Take a collaboration tangle and move the logic to the objects that actually own the data and decision-making context.",
						"Track what client code becomes simpler after the move."
					].join(" ")
				},
				{
					title: "Reflection Question: Who Should Own This Behavior?",
					content: [
						"Ask students to explain how they detect that a method belongs somewhere else.",
						"A good answer should mention what data the method leans on and which object's invariants it really serves."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can distinguish Extract Class from Move Method or Move Field.",
					"Use a short prompt asking whether a forwarding layer is clarifying a boundary or hiding nothing useful."
				].join(" "),
				[
					"Students often extract a class without moving the right behavior with it.",
					"They may also retain a middle-man API because removing it feels risky even when it adds no value."
				].join(" "),
				{
					title: "Extension Project: Order System Responsibility Audit",
					content: [
						"Audit a Java order or notification system for Feature Envy and Large Class issues.",
						"Plan which methods or fields move, which helper becomes a new class, and which delegates should disappear."
					].join(" ")
				}
			)
		},
		{
			title: "DPR4 Organizing Data",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Organizing Data",
					content: [
						"Cover Self Encapsulate Field, Replace Data Value with Object, Change Value to Reference, Change Reference to Value, Replace Array with Object, Duplicate Observed Data, Change Unidirectional Association to Bidirectional, Change Bidirectional Association to Unidirectional, Replace Magic Number with Symbolic Constant, Encapsulate Field, Encapsulate Collection, Replace Type Code with Class, Replace Type Code with Subclasses, Replace Type Code with State/Strategy, and Replace Subclass with Fields.",
						"Teach the category as a way of making data expressive, explicit, and collaboration-friendly."
					].join(" ")
				},
				{
					title: "Worked Example Set: Primitive Obsession and Type Codes",
					content: [
						"Refactor Java examples that overuse strings, ints, and arrays to represent concepts that deserve real types.",
						"Use value objects, symbolic constants, and State or Strategy where behavior is attached to the type code."
					].join(" ")
				},
				{
					title: "Associations, Encapsulation, and Collection Safety",
					content: [
						"Teach field and collection encapsulation together with association direction changes so students see data design as API design.",
						"Good refactors should make illegal states harder to represent."
					].join(" ")
				},
				{
					title: "Data Modeling Lab: Upgrade a Weak Domain Model",
					content: [
						"Take a Java model made of primitives and loosely coordinated arrays or collections and evolve it into named objects with better boundaries.",
						"Have students justify every new type introduced."
					].join(" ")
				},
				{
					title: "Pattern Connection: State, Strategy, and Value Objects",
					content: [
						"Connect organizing-data refactors back to patterns from the first course, especially Replace Type Code with State or Strategy.",
						"This shows how pattern choice often emerges naturally from better data representation."
					].join(" ")
				},
				{
					title: "Reflection Question: When Is a Primitive No Longer Good Enough?",
					content: [
						"Ask students to explain what signs show that a string, int, or array has turned into a disguised domain concept.",
						"They should mention validation rules, behavior, or repeated interpretation logic."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can name when Replace Type Code with Class is enough and when State or Strategy is the better move.",
					"Ask them to justify whether a collection should be directly exposed or wrapped."
				].join(" "),
				[
					"Students often create new classes without moving behavior or constraints into them.",
					"They may also over-bidirectionalize associations even when a one-way reference would be cleaner."
				].join(" "),
				{
					title: "Extension Project: Type Code to Behavior Refactor",
					content: [
						"Start from a Java model full of status codes or category strings.",
						"Refactor it through better data organization and explain whether the end state calls for Class, Subclasses, or State or Strategy."
					].join(" ")
				}
			)
		},
		{
			title: "DPR5 Simplifying Conditional Expressions",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Simplifying Conditional Expressions",
					content: [
						"Cover Decompose Conditional, Consolidate Conditional Expression, Consolidate Duplicate Conditional Fragments, Remove Control Flag, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Null Object, and Introduce Assertion.",
						"Frame the category as a response to Switch Statements, complex branching, and unclear control flow."
					].join(" ")
				},
				{
					title: "Worked Example Set: From Nested Branching to Clear Flow",
					content: [
						"Start with deeply nested Java conditionals and clean them in stages using guard clauses, decomposed intent-revealing methods, and consolidation where repetition hides the main logic.",
						"Only then consider polymorphism or Null Object when the branching pressure is truly role- or state-driven."
					].join(" ")
				},
				{
					title: "Replace Conditional with Polymorphism Versus Simpler Cleanup",
					content: [
						"Teach students to reserve polymorphism for stable behavioral variation across types or states, not for every if-else chain.",
						"Compare this with Strategy and State from the first course."
					].join(" ")
				},
				{
					title: "Null Object and Assertion as Design Signals",
					content: [
						"Use Introduce Null Object to remove repeated absence handling when a stable do-nothing implementation clarifies the design.",
						"Use assertions to document assumptions that should fail loudly rather than become buried conditionals."
					].join(" ")
				},
				{
					title: "Mini Lab: Conditional Tangle Rescue",
					content: [
						"Take a Java policy engine or workflow method with nested flags and refactor it into clearer control flow, optionally ending in polymorphism where justified.",
						"Students should record which conditional refactors happened before any pattern was introduced."
					].join(" ")
				},
				{
					title: "Reflection Question: When Does a Conditional Signal a Missing Type?",
					content: [
						"Ask students to explain when a conditional is just logic and when it reveals a deeper modeling problem.",
						"They should point to recurring variation, duplicated branches, or type-code-driven behavior."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can improve a conditional without defaulting immediately to polymorphism.",
					"Use a short prompt asking whether a null check repeated in ten places is a candidate for Null Object."
				].join(" "),
				[
					"Students often jump to inheritance too early because Replace Conditional with Polymorphism sounds more advanced.",
					"They may also keep nested branches that should be guard clauses because the existing indentation feels familiar."
				].join(" "),
				{
					title: "Extension Project: Workflow Branch Cleanup",
					content: [
						"Refactor a workflow or eligibility checker in several small conditional-expression steps.",
						"Stop once the design is clear, even if no new pattern is needed."
					].join(" ")
				}
			)
		},
		{
			title: "DPR6 Simplifying Method Calls",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Simplifying Method Calls",
					content: [
						"Cover Rename Method, Add Parameter, Remove Parameter, Separate Query from Modifier, Parameterize Method, Introduce Parameter Object, Preserve Whole Object, Remove Setting Method, Replace Parameter with Explicit Methods, Replace Parameter with Method Call, Hide Method, Replace Constructor with Factory Method, Replace Error Code with Exception, and Replace Exception with Test.",
						"Teach this category as API cleanup for call sites, responsibilities, and object lifecycle."
					].join(" ")
				},
				{
					title: "Worked Example Set: Cleaning a Public API",
					content: [
						"Refactor an awkward Java API by improving names, reducing parameter clutter, separating queries from state changes, and moving from raw constructor or error-code usage toward clearer intent.",
						"Use client readability as the main measurement."
					].join(" ")
				},
				{
					title: "Factory Method Reappears Through Refactoring",
					content: [
						"Use Replace Constructor with Factory Method to show how refactoring techniques can lead directly into a design pattern.",
						"This is a good bridge between the first course and the second."
					].join(" ")
				},
				{
					title: "Exceptions, Preconditions, and API Shape",
					content: [
						"Compare Replace Error Code with Exception and Replace Exception with Test so students understand when failure should be exceptional and when a pre-check is the cleaner API.",
						"Connect this to Java method contracts and caller expectations."
					].join(" ")
				},
				{
					title: "Mini Lab: Reduce Call-Site Noise in a Service Layer",
					content: [
						"Take a Java service class with confusing calls and refactor it until the main use cases read clearly from the caller's perspective.",
						"Students should highlight which method-call simplifications improved the design most."
					].join(" ")
				},
				{
					title: "Reflection Question: What Makes a Call Site Honest?",
					content: [
						"Ask students to explain when an API reveals intent and when it leaks too much internal detail.",
						"They should mention naming, parameter shape, and side-effect clarity."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can choose between Introduce Parameter Object and Preserve Whole Object.",
					"Use a quick prompt asking when a constructor should become a factory method."
				].join(" "),
				[
					"Students often keep poor method names because changing them feels cosmetic.",
					"They may also replace every error code with exceptions even when a simple existence test would be cleaner."
				].join(" "),
				{
					title: "Extension Project: Public API Cleanup Pass",
					content: [
						"Choose one small public Java API and simplify how clients call it.",
						"Document which method-call refactors made the code read more truthfully."
					].join(" ")
				}
			)
		},
		{
			title: "DPR7 Dealing with Generalization",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Dealing with Generalization",
					content: [
						"Cover Pull Up Field, Pull Up Method, Pull Up Constructor Body, Push Down Field, Push Down Method, Extract Subclass, Extract Superclass, Extract Interface, Collapse Hierarchy, Form Template Method, Replace Inheritance with Delegation, and Replace Delegation with Inheritance.",
						"Teach the category as the disciplined way to reshape inheritance and abstraction once the real variation is understood."
					].join(" ")
				},
				{
					title: "Worked Example Set: Fixing a Bad Hierarchy",
					content: [
						"Start from an inheritance tree with duplicated members, misplaced behavior, or a base class that no longer reflects reality.",
						"Refactor by pulling up, pushing down, collapsing, or extracting hierarchy elements only as warranted by the domain."
					].join(" ")
				},
				{
					title: "Template Method as a Refactoring Move",
					content: [
						"Use Form Template Method to show how repeated algorithm structure in sibling classes can become a controlled inheritance abstraction.",
						"Compare that with replacing inheritance by delegation when subclassing has become the actual problem."
					].join(" ")
				},
				{
					title: "Delegation Versus Inheritance Revisited",
					content: [
						"Teach Replace Inheritance with Delegation and Replace Delegation with Inheritance together so students can compare the forces honestly.",
						"Java design should not worship either one uncritically."
					].join(" ")
				},
				{
					title: "Mini Lab: Repair a Parallel Hierarchy",
					content: [
						"Take a Java design where hierarchy changes cascade across multiple class trees and simplify the abstraction story.",
						"Require students to explain whether the final design is flatter, deeper, or simply cleaner."
					].join(" ")
				},
				{
					title: "Reflection Question: Which Abstraction Actually Earned Its Place?",
					content: [
						"Ask students to identify an abstraction they removed or collapsed and explain why it no longer served the model.",
						"They should distinguish meaningful generalization from speculative generality."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can say when Extract Interface helps even if Extract Superclass would also compile.",
					"Use a short prompt asking why Collapse Hierarchy can be an improvement rather than a loss of sophistication."
				].join(" "),
				[
					"Students often protect bad hierarchies because they feel 'object-oriented.'",
					"They may also over-extract abstractions before duplicated behavior has stabilized enough to justify them."
				].join(" "),
				{
					title: "Extension Project: Hierarchy Surgery Review",
					content: [
						"Audit an inheritance-heavy Java model and plan which refactorings repair it best.",
						"Defend any move toward delegation, interfaces, or hierarchy collapse with concrete change pressure."
					].join(" ")
				}
			)
		},
		{
			title: "DPR8 Refactoring Toward Patterns",
			curriculum: [
				{
					title: "From Technique Catalog to Pattern Choice",
					content: [
						"Teach how refactoring techniques pave the road into patterns instead of jumping there directly.",
						"Examples should include Replace Constructor with Factory Method toward Factory Method, Replace Type Code with State or Strategy toward State or Strategy, Replace Conditional with Polymorphism toward Strategy or State, and Form Template Method toward Template Method."
					].join(" ")
				},
				{
					title: "Pattern Entry Paths from Refactoring.Guru",
					content: [
						"Show common journeys: Extract Method plus Move Method plus Extract Class toward clearer collaborators; Hide Delegate and Facade toward subsystem simplification; Introduce Local Extension plus Adapter toward boundary cleanup; and command-history refactors toward Command and Memento.",
						"The pattern should appear as the result of a sequence, not as the first move."
					].join(" ")
				},
				{
					title: "Worked Example Set: One Smell, Several Possible Destinations",
					content: [
						"Take one Java design problem and show more than one plausible refactoring path, such as guard clauses only, Strategy, or State.",
						"This teaches students that good design is contextual and falsifiable."
					].join(" ")
				},
				{
					title: "Mini Lab: Refactor Until the Pattern Is Obvious",
					content: [
						"Require students to stop after each small change and ask whether the named pattern is now justified or still premature.",
						"This builds restraint and sequence awareness."
					].join(" ")
				},
				{
					title: "Tradeoff Review: Pattern Arrival Versus Pattern Forcing",
					content: [
						"Teach the difference between discovering a stable abstraction through refactoring and forcing a catalog pattern because it seems advanced.",
						"Use before-and-after change scenarios as the arbiter."
					].join(" ")
				},
				{
					title: "Reflection Question: Which Step Made the Biggest Difference?",
					content: [
						"Ask students whether the biggest improvement came from the named pattern or from one of the smaller refactoring steps leading up to it.",
						"A strong answer often recognizes that the pattern only worked because the groundwork was done first."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can narrate a multi-step path from smell to pattern without skipping the intermediate refactors.",
					"Use a short prompt asking whether every switch statement should end in polymorphism."
				].join(" "),
				[
					"Students often treat patterns as sudden swaps rather than the outcome of several smaller improvements.",
					"They may also believe the most named pattern-heavy design is automatically the best endpoint."
				].join(" "),
				{
					title: "Extension Project: Pattern Arrival Map",
					content: [
						"Pick a Java smell and diagram the smallest safe chain of refactorings that could lead to a suitable pattern.",
						"Include at least one alternate path that ends in simpler code instead."
					].join(" ")
				}
			)
		},
		{
			title: "DPR9 Testability, DI, and Refactoring with Confidence",
			curriculum: [
				{
					title: "Tests as Refactoring Safety Nets",
					content: [
						"Teach students to use tests, approval checks, or explicit manual verification scripts as safety nets during refactoring.",
						"The point is confidence in behavior preservation, not maximal test theory."
					].join(" ")
				},
				{
					title: "Dependency Injection for Refactoring Seams",
					content: [
						"Use constructor injection, interface seams, and simple fakes so students can isolate dependencies while reshaping a design.",
						"DI here is a refactoring enabler first and a framework topic second."
					].join(" ")
				},
				{
					title: "Worked Example Set: Make a Hard-to-Test Class Refactorable",
					content: [
						"Start with a class bound to time, I O, random generation, or global state and introduce seams that allow safe small changes.",
						"Connect this directly back to Singleton skepticism and public API cleanup."
					].join(" ")
				},
				{
					title: "Mini Lab: Characterization Test then Structural Change",
					content: [
						"Write or simulate a small set of characterization checks on brittle Java code, then perform a planned refactor while preserving the observable behavior.",
						"Students should see the emotional difference between refactoring blind and refactoring with a safety net."
					].join(" ")
				},
				{
					title: "Design Review: Refactoring Pace and Reviewability",
					content: [
						"Teach how to package refactors into readable commits or change sets rather than one giant diff.",
						"This makes the work maintainable for teams and for the student's future self."
					].join(" ")
				},
				{
					title: "Reflection Question: What Let You Move Faster Safely?",
					content: [
						"Ask students to name the exact seam, test, or dependency change that reduced refactoring risk the most.",
						"They should connect confidence to design structure, not luck."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can explain why DI improves refactorability even without a framework container.",
					"Use a short prompt asking what kind of test is sufficient before a small structural change."
				].join(" "),
				[
					"Students often wait for perfect test coverage before making any improvement at all.",
					"They may also keep hidden globals and static calls that make later refactors harder than necessary."
				].join(" "),
				{
					title: "Extension Project: Refactorability Hardening Pass",
					content: [
						"Take one tightly coupled Java component and improve its seams before attempting deeper architectural change.",
						"Explain how the added seam changes what future refactors become possible."
					].join(" ")
				}
			)
		},
		{
			title: "DPR10 Capstone Refactoring Studio",
			curriculum: [
				{
					title: "Capstone Launch: Choose a Messy but Salvageable Java App",
					content: [
						"Pick a medium Java codebase with real smells, awkward APIs, poor boundaries, or inheritance trouble.",
						"The best capstone begins from code that is ugly enough to matter but stable enough to rescue."
					].join(" ")
				},
				{
					title: "Diagnosis Pass: Smells, Risks, and Refactor Sequence",
					content: [
						"List the main smell categories present, the behavior that must stay unchanged, and the ordered refactoring steps planned.",
						"Students should name both the technique categories and any patterns they expect to emerge."
					].join(" ")
				},
				{
					title: "Execution Pass: Small Safe Transformations",
					content: [
						"Perform the refactor as a sequence of readable changes rather than a single giant rewrite.",
						"Require validation after each meaningful stage."
					].join(" ")
				},
				{
					title: "Pattern Arrival Review",
					content: [
						"Identify which patterns genuinely emerged in the final design and which remained unnecessary.",
						"This is where the two-course sequence should finally converge into one coherent design mindset."
					].join(" ")
				},
				{
					title: "Final Architecture Review",
					content: [
						"Evaluate the codebase in terms of smell reduction, package clarity, collaboration boundaries, and changeability.",
						"Students should explain the next improvement they would make only if the project continued."
					].join(" ")
				},
				{
					title: "Capstone Reflection: From Catalog Knowledge to Judgment",
					content: [
						"Close the course by documenting which Refactoring.Guru techniques mattered most in practice and which pattern introductions truly paid off.",
						"The final goal is design judgment, not catalog recitation."
					].join(" ")
				}
			],
			supplementalProjects: supportItems(
				[
					"Check whether students can explain their refactor sequence in terms of risk reduction as well as final architecture.",
					"Use a short prompt asking which proposed change they intentionally postponed and why."
				].join(" "),
				[
					"Students often grade success by how many abstractions were introduced instead of how much smell pressure was actually removed.",
					"They may also forget to document the improvements that came from small refactors rather than from headline patterns."
				].join(" "),
				{
					title: "Capstone Option: Rescue a Policy Engine, RPG Core, or Notification App",
					content: [
						"Take one medium Java application from brittle to defensible using the full smell and refactoring toolkit.",
						"Include a final walkthrough of the smell inventory, the refactor sequence, and the patterns that genuinely survived into the final design."
					].join(" ")
				}
			)
		}
	]
};
