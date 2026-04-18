import type { RawCourse } from "./types";

export const designPatternsInJavaPart2Course: RawCourse = {
	name: "Design Patterns in Java Part 2: Refactoring",
	modules: [
		{
			title: "DPR1 Code Smells and Safe Refactoring Workflow",
			curriculum: [
				{
					title: "Concept Lesson: Refactoring as Behavior-Preserving Design Change",
					content:
						"Use Refactoring.Guru's framing that refactoring changes internal structure without changing externally visible behavior. Teach students to work in small steps with a safety net rather than attempting one heroic rewrite."
				},
				{
					title: "Code Smells from Refactoring.Guru",
					content:
						"Survey the smell families explicitly: bloaters such as Long Method, Large Class, Primitive Obsession, Long Parameter List, and Data Clumps; object-orientation abusers such as Alternative Classes with Different Interfaces, Refused Bequest, Switch Statements, and Temporary Field; change preventers such as Divergent Change, Parallel Inheritance Hierarchies, and Shotgun Surgery; dispensables such as Comments, Duplicate Code, Data Class, Dead Code, Lazy Class, and Speculative Generality; and couplers such as Feature Envy, Inappropriate Intimacy, Incomplete Library Class, Message Chains, and Middle Man. Use Java examples where students must identify the dominant smell instead of simply listing everything wrong."
				},
				{
					title: "Refactoring Workflow: Characterize, Slice, Verify",
					content:
						"Teach a repeatable loop: identify the smell, describe the desired improvement, isolate the smallest safe step, run tests or manual checks, and only then continue. Students should treat naming, extraction, and movement as tactical moves toward better architecture."
				},
				{
					title: "Worked Example Set: Smell Diagnosis Before Change",
					content:
						"Review several medium Java snippets and decide whether the dominant pressure is method size, misplaced behavior, bad conditionals, poor object boundaries, or unhealthy inheritance. This sets up the later modules by linking smells to the right category of refactorings."
				},
				{
					title: "Mini Lab: Write the Refactor Plan Before Touching Code",
					content:
						"Have students write a small staged plan naming the smell, the next one or two refactorings, and the expected benefit before editing. This prevents flailing and makes code review discussion more precise."
				},
				{
					title: "Reflection Question: What Makes a Refactor Reckless?",
					content:
						"Ask students to explain how a good refactor differs from a rewrite that merely hopes the new version will be better. They should mention verification and change granularity explicitly. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "DPR1 Code Smells and Safe Refactoring Workflow: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr1-code-smells-and-safe-refactoring-workflow/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr1-code-smells-and-safe-refactoring-workflow/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can classify a smell before proposing a pattern or refactoring. Use a short prompt asking which is riskier: changing five things at once or committing a sequence of tiny safe improvements.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr1-code-smells-and-safe-refactoring-workflow/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr1-code-smells-and-safe-refactoring-workflow/solution"
				},
				{
					title: "Code Smells and Safe Refactoring Workflow supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR1 Code Smells and Safe Refactoring Workflow. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-dpr1-code-smells-and-safe-refactoring-workflow-s/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-dpr1-code-smells-and-safe-refactoring-workflow-s/solution"
				},
				{
					title: "Code Smells and Safe Refactoring Workflow supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR1 Code Smells and Safe Refactoring Workflow. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-dpr1-code-smells-and-safe-refactoring-workflow-s/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-dpr1-code-smells-and-safe-refactoring-workflow-s/solution"
				}
			]
		},
		{
			title: "DPR2 Composing Methods",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Composing Methods",
					content:
						"Cover the full category directly: Extract Method, Inline Method, Extract Variable, Inline Temp, Replace Temp with Query, Split Temporary Variable, Remove Assignments to Parameters, Replace Method with Method Object, and Substitute Algorithm. Teach these as the core moves for taming Long Method and improving local readability."
				},
				{
					title: "Worked Example Set: Shrinking a Long Method",
					content:
						"Start with a dense Java method, then refactor it in very small steps using extraction, better local names, split temporaries, and algorithm replacement where the logic is overgrown. Students should see that many later architectural improvements begin here."
				},
				{
					title: "Method Object Versus Plain Extraction",
					content:
						"Explain when Replace Method with Method Object is justified: many local variables, multi-step computation, or logic that deserves its own collaborator. Compare it against simpler Extract Method work so students do not escalate prematurely."
				},
				{
					title: "Mini Lab: Refactor a Calculation Pipeline Safely",
					content:
						"Take a pricing, scoring, or report-generation method and refactor it into cleaner smaller steps without changing observable output. Require students to document which composing-method moves were used."
				},
				{
					title: "Pattern Connection: Clear Methods Make Later Patterns Possible",
					content:
						"Show how Strategy, Template Method, and Command become easier to introduce after method-level mess is removed. Students should understand that patterns often fail when built on top of unreadable methods."
				},
				{
					title: "Reflection Question: When Is Extraction Enough?",
					content:
						"Ask students to explain when they should stop at smaller methods and when they should continue toward a new class or pattern. The answer should reference responsibility, not raw line count alone."
				},
				{
					title: "DPR2 Composing Methods: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr2-composing-methods/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr2-composing-methods/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can pick the smallest composing-method refactor that improves clarity. Ask them to justify why they used Method Object instead of another Extract Method. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr2-composing-methods/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr2-composing-methods/solution"
				},
				{
					title: "Composing Methods supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR2 Composing Methods. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-dpr2-composing-methods-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-dpr2-composing-methods-supplemental-2/solution"
				},
				{
					title: "Composing Methods supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR2 Composing Methods. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-dpr2-composing-methods-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-dpr2-composing-methods-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR3 Moving Features Between Objects",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Moving Features Between Objects",
					content:
						"Cover Move Method, Move Field, Extract Class, Inline Class, Hide Delegate, Remove Middle Man, Introduce Foreign Method, and Introduce Local Extension. Frame this category as the main response to Feature Envy, Large Class, and muddled collaboration boundaries."
				},
				{
					title: "Worked Example Set: Feature Envy and Large Class",
					content:
						"Start with Java classes that know too much about neighboring objects or accumulate unrelated fields and behaviors. Refactor by moving methods or fields to the real owner, then extract or inline classes only when the split becomes defensible."
				},
				{
					title: "Delegation Boundaries: Hide or Remove the Middle Man",
					content:
						"Teach Hide Delegate and Remove Middle Man together so students see both sides of delegation exposure. The question is not whether delegation is good, but whether the current layer is clarifying or merely forwarding everything."
				},
				{
					title: "Local Extension and Foreign Method for Library Friction",
					content:
						"Use Introduce Foreign Method and Introduce Local Extension to handle awkward third-party or library types without polluting the rest of the codebase. This pairs naturally with Adapter and Facade from the first course."
				},
				{
					title: "Mini Lab: Re-home Behavior Without Breaking Clients",
					content:
						"Take a collaboration tangle and move the logic to the objects that actually own the data and decision-making context. Track what client code becomes simpler after the move. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Reflection Question: Who Should Own This Behavior?",
					content:
						"Ask students to explain how they detect that a method belongs somewhere else. A good answer should mention what data the method leans on and which object's invariants it really serves. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "DPR3 Moving Features Between Objects: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr3-moving-features-between-objects/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr3-moving-features-between-objects/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can distinguish Extract Class from Move Method or Move Field. Use a short prompt asking whether a forwarding layer is clarifying a boundary or hiding nothing useful.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr3-moving-features-between-objects/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr3-moving-features-between-objects/solution"
				},
				{
					title: "Moving Features Between Objects supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR3 Moving Features Between Objects. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-dpr3-moving-features-between-objects-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-dpr3-moving-features-between-objects-supplemental-2/solution"
				},
				{
					title: "Moving Features Between Objects supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR3 Moving Features Between Objects. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-dpr3-moving-features-between-objects-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-dpr3-moving-features-between-objects-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR4 Organizing Data",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Organizing Data",
					content:
						"Cover Self Encapsulate Field, Replace Data Value with Object, Change Value to Reference, Change Reference to Value, Replace Array with Object, Duplicate Observed Data, Change Unidirectional Association to Bidirectional, Change Bidirectional Association to Unidirectional, Replace Magic Number with Symbolic Constant, Encapsulate Field, Encapsulate Collection, Replace Type Code with Class, Replace Type Code with Subclasses, Replace Type Code with State/Strategy, and Replace Subclass with Fields. Teach the category as a way of making data expressive, explicit, and collaboration-friendly."
				},
				{
					title: "Worked Example Set: Primitive Obsession and Type Codes",
					content:
						"Refactor Java examples that overuse strings, ints, and arrays to represent concepts that deserve real types. Use value objects, symbolic constants, and State or Strategy where behavior is attached to the type code."
				},
				{
					title: "Associations, Encapsulation, and Collection Safety",
					content:
						"Teach field and collection encapsulation together with association direction changes so students see data design as API design. Good refactors should make illegal states harder to represent."
				},
				{
					title: "Data Modeling Lab: Upgrade a Weak Domain Model",
					content:
						"Take a Java model made of primitives and loosely coordinated arrays or collections and evolve it into named objects with better boundaries. Have students justify every new type introduced."
				},
				{
					title: "Pattern Connection: State, Strategy, and Value Objects",
					content:
						"Connect organizing-data refactors back to patterns from the first course, especially Replace Type Code with State or Strategy. This shows how pattern choice often emerges naturally from better data representation."
				},
				{
					title: "Reflection Question: When Is a Primitive No Longer Good Enough?",
					content:
						"Ask students to explain what signs show that a string, int, or array has turned into a disguised domain concept. They should mention validation rules, behavior, or repeated interpretation logic."
				},
				{
					title: "DPR4 Organizing Data: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr4-organizing-data/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr4-organizing-data/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can name when Replace Type Code with Class is enough and when State or Strategy is the better move. Ask them to justify whether a collection should be directly exposed or wrapped.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr4-organizing-data/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr4-organizing-data/solution"
				},
				{
					title: "Organizing Data supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR4 Organizing Data. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-dpr4-organizing-data-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-dpr4-organizing-data-supplemental-2/solution"
				},
				{
					title: "Organizing Data supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR4 Organizing Data. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr4-organizing-data-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr4-organizing-data-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR5 Simplifying Conditional Expressions",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Simplifying Conditional Expressions",
					content:
						"Cover Decompose Conditional, Consolidate Conditional Expression, Consolidate Duplicate Conditional Fragments, Remove Control Flag, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Null Object, and Introduce Assertion. Frame the category as a response to Switch Statements, complex branching, and unclear control flow."
				},
				{
					title: "Worked Example Set: From Nested Branching to Clear Flow",
					content:
						"Start with deeply nested Java conditionals and clean them in stages using guard clauses, decomposed intent-revealing methods, and consolidation where repetition hides the main logic. Only then consider polymorphism or Null Object when the branching pressure is truly role- or state-driven."
				},
				{
					title: "Replace Conditional with Polymorphism Versus Simpler Cleanup",
					content:
						"Teach students to reserve polymorphism for stable behavioral variation across types or states, not for every if-else chain. Compare this with Strategy and State from the first course. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Null Object and Assertion as Design Signals",
					content:
						"Use Introduce Null Object to remove repeated absence handling when a stable do-nothing implementation clarifies the design. Use assertions to document assumptions that should fail loudly rather than become buried conditionals."
				},
				{
					title: "Mini Lab: Conditional Tangle Rescue",
					content:
						"Take a Java policy engine or workflow method with nested flags and refactor it into clearer control flow, optionally ending in polymorphism where justified. Students should record which conditional refactors happened before any pattern was introduced."
				},
				{
					title: "Reflection Question: When Does a Conditional Signal a Missing Type?",
					content:
						"Ask students to explain when a conditional is just logic and when it reveals a deeper modeling problem. They should point to recurring variation, duplicated branches, or type-code-driven behavior."
				},
				{
					title: "DPR5 Simplifying Conditional Expressions: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr5-simplifying-conditional-expressions/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr5-simplifying-conditional-expressions/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can improve a conditional without defaulting immediately to polymorphism. Use a short prompt asking whether a null check repeated in ten places is a candidate for Null Object.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr5-simplifying-conditional-expressions/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr5-simplifying-conditional-expressions/solution"
				},
				{
					title: "Simplifying Conditional Expressions supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR5 Simplifying Conditional Expressions. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr5-simplifying-conditional-expressions-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr5-simplifying-conditional-expressions-supplem/solution"
				},
				{
					title: "Simplifying Conditional Expressions supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR5 Simplifying Conditional Expressions. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr5-simplifying-conditional-expressions-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr5-simplifying-conditional-expressions-supplem/solution"
				}
			]
		},
		{
			title: "DPR6 Simplifying Method Calls",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Simplifying Method Calls",
					content:
						"Cover Rename Method, Add Parameter, Remove Parameter, Separate Query from Modifier, Parameterize Method, Introduce Parameter Object, Preserve Whole Object, Remove Setting Method, Replace Parameter with Explicit Methods, Replace Parameter with Method Call, Hide Method, Replace Constructor with Factory Method, Replace Error Code with Exception, and Replace Exception with Test. Teach this category as API cleanup for call sites, responsibilities, and object lifecycle."
				},
				{
					title: "Worked Example Set: Cleaning a Public API",
					content:
						"Refactor an awkward Java API by improving names, reducing parameter clutter, separating queries from state changes, and moving from raw constructor or error-code usage toward clearer intent. Use client readability as the main measurement."
				},
				{
					title: "Factory Method Reappears Through Refactoring",
					content:
						"Use Replace Constructor with Factory Method to show how refactoring techniques can lead directly into a design pattern. This is a good bridge between the first course and the second. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Exceptions, Preconditions, and API Shape",
					content:
						"Compare Replace Error Code with Exception and Replace Exception with Test so students understand when failure should be exceptional and when a pre-check is the cleaner API. Connect this to Java method contracts and caller expectations."
				},
				{
					title: "Mini Lab: Reduce Call-Site Noise in a Service Layer",
					content:
						"Take a Java service class with confusing calls and refactor it until the main use cases read clearly from the caller's perspective. Students should highlight which method-call simplifications improved the design most."
				},
				{
					title: "Reflection Question: What Makes a Call Site Honest?",
					content:
						"Ask students to explain when an API reveals intent and when it leaks too much internal detail. They should mention naming, parameter shape, and side-effect clarity. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "DPR6 Simplifying Method Calls: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr6-simplifying-method-calls/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr6-simplifying-method-calls/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can choose between Introduce Parameter Object and Preserve Whole Object. Use a quick prompt asking when a constructor should become a factory method. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr6-simplifying-method-calls/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr6-simplifying-method-calls/solution"
				},
				{
					title: "Simplifying Method Calls supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR6 Simplifying Method Calls. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr6-simplifying-method-calls-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr6-simplifying-method-calls-supplemental-2/solution"
				},
				{
					title: "Simplifying Method Calls supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR6 Simplifying Method Calls. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr6-simplifying-method-calls-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr6-simplifying-method-calls-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR7 Dealing with Generalization",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Dealing with Generalization",
					content:
						"Cover Pull Up Field, Pull Up Method, Pull Up Constructor Body, Push Down Field, Push Down Method, Extract Subclass, Extract Superclass, Extract Interface, Collapse Hierarchy, Form Template Method, Replace Inheritance with Delegation, and Replace Delegation with Inheritance. Teach the category as the disciplined way to reshape inheritance and abstraction once the real variation is understood."
				},
				{
					title: "Worked Example Set: Fixing a Bad Hierarchy",
					content:
						"Start from an inheritance tree with duplicated members, misplaced behavior, or a base class that no longer reflects reality. Refactor by pulling up, pushing down, collapsing, or extracting hierarchy elements only as warranted by the domain."
				},
				{
					title: "Template Method as a Refactoring Move",
					content:
						"Use Form Template Method to show how repeated algorithm structure in sibling classes can become a controlled inheritance abstraction. Compare that with replacing inheritance by delegation when subclassing has become the actual problem."
				},
				{
					title: "Delegation Versus Inheritance Revisited",
					content:
						"Teach Replace Inheritance with Delegation and Replace Delegation with Inheritance together so students can compare the forces honestly. Java design should not worship either one uncritically."
				},
				{
					title: "Mini Lab: Repair a Parallel Hierarchy",
					content:
						"Take a Java design where hierarchy changes cascade across multiple class trees and simplify the abstraction story. Require students to explain whether the final design is flatter, deeper, or simply cleaner."
				},
				{
					title: "Reflection Question: Which Abstraction Actually Earned Its Place?",
					content:
						"Ask students to identify an abstraction they removed or collapsed and explain why it no longer served the model. They should distinguish meaningful generalization from speculative generality."
				},
				{
					title: "DPR7 Dealing with Generalization: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can say when Extract Interface helps even if Extract Superclass would also compile. Use a short prompt asking why Collapse Hierarchy can be an improvement rather than a loss of sophistication.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization/solution"
				},
				{
					title: "Dealing with Generalization supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR7 Dealing with Generalization. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr7-dealing-with-generalization-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr7-dealing-with-generalization-supplemental-2/solution"
				},
				{
					title: "Dealing with Generalization supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR7 Dealing with Generalization. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR8 Refactoring Toward Patterns",
			curriculum: [
				{
					title: "From Technique Catalog to Pattern Choice",
					content:
						"Teach how refactoring techniques pave the road into patterns instead of jumping there directly. Examples should include Replace Constructor with Factory Method toward Factory Method, Replace Type Code with State or Strategy toward State or Strategy, Replace Conditional with Polymorphism toward Strategy or State, and Form Template Method toward Template Method."
				},
				{
					title: "Pattern Entry Paths from Refactoring.Guru",
					content:
						"Show common journeys: Extract Method plus Move Method plus Extract Class toward clearer collaborators; Hide Delegate and Facade toward subsystem simplification; Introduce Local Extension plus Adapter toward boundary cleanup; and command-history refactors toward Command and Memento. The pattern should appear as the result of a sequence, not as the first move."
				},
				{
					title: "Worked Example Set: One Smell, Several Possible Destinations",
					content:
						"Take one Java design problem and show more than one plausible refactoring path, such as guard clauses only, Strategy, or State. This teaches students that good design is contextual and falsifiable."
				},
				{
					title: "Mini Lab: Refactor Until the Pattern Is Obvious",
					content:
						"Require students to stop after each small change and ask whether the named pattern is now justified or still premature. This builds restraint and sequence awareness. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Tradeoff Review: Pattern Arrival Versus Pattern Forcing",
					content:
						"Teach the difference between discovering a stable abstraction through refactoring and forcing a catalog pattern because it seems advanced. Use before-and-after change scenarios as the arbiter."
				},
				{
					title: "Reflection Question: Which Step Made the Biggest Difference?",
					content:
						"Ask students whether the biggest improvement came from the named pattern or from one of the smaller refactoring steps leading up to it. A strong answer often recognizes that the pattern only worked because the groundwork was done first."
				},
				{
					title: "DPR8 Refactoring Toward Patterns: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can narrate a multi-step path from smell to pattern without skipping the intermediate refactors. Use a short prompt asking whether every switch statement should end in polymorphism.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns/solution"
				},
				{
					title: "Refactoring Toward Patterns supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR8 Refactoring Toward Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns-supplemental-2/solution"
				},
				{
					title: "Refactoring Toward Patterns supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR8 Refactoring Toward Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr8-refactoring-toward-patterns-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr8-refactoring-toward-patterns-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR9 Testability, DI, and Refactoring with Confidence",
			curriculum: [
				{
					title: "Tests as Refactoring Safety Nets",
					content:
						"Teach students to use tests, approval checks, or explicit manual verification scripts as safety nets during refactoring. The point is confidence in behavior preservation, not maximal test theory."
				},
				{
					title: "Dependency Injection for Refactoring Seams",
					content:
						"Use constructor injection, interface seams, and simple fakes so students can isolate dependencies while reshaping a design. DI here is a refactoring enabler first and a framework topic second."
				},
				{
					title: "Worked Example Set: Make a Hard-to-Test Class Refactorable",
					content:
						"Start with a class bound to time, I O, random generation, or global state and introduce seams that allow safe small changes. Connect this directly back to Singleton skepticism and public API cleanup."
				},
				{
					title: "Mini Lab: Characterization Test then Structural Change",
					content:
						"Write or simulate a small set of characterization checks on brittle Java code, then perform a planned refactor while preserving the observable behavior. Students should see the emotional difference between refactoring blind and refactoring with a safety net."
				},
				{
					title: "Design Review: Refactoring Pace and Reviewability",
					content:
						"Teach how to package refactors into readable commits or change sets rather than one giant diff. This makes the work maintainable for teams and for the student's future self. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Reflection Question: What Let You Move Faster Safely?",
					content:
						"Ask students to name the exact seam, test, or dependency change that reduced refactoring risk the most. They should connect confidence to design structure, not luck. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "DPR9 Testability, DI, and Refactoring with Confidence: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr9-testability-di-and-refactoring-with-confide/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr9-testability-di-and-refactoring-with-confide/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can explain why DI improves refactorability even without a framework container. Use a short prompt asking what kind of test is sufficient before a small structural change.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr9-testability-di-and-refactoring-with-confide/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr9-testability-di-and-refactoring-with-confide/solution"
				},
				{
					title: "Testability, DI, and Refactoring with Confidence supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR9 Testability, DI, and Refactoring with Confidence. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr9-testability-di-and-refactoring-with-confide/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr9-testability-di-and-refactoring-with-confide/solution"
				},
				{
					title: "Testability, DI, and Refactoring with Confidence supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR9 Testability, DI, and Refactoring with Confidence. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-18-dpr9-testability-di-and-refactoring-with-confide/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-18-dpr9-testability-di-and-refactoring-with-confide/solution"
				}
			]
		},
		{
			title: "DPR10 Capstone Refactoring Studio",
			curriculum: [
				{
					title: "Capstone Launch: Choose a Messy but Salvageable Java App",
					content:
						"Pick a medium Java codebase with real smells, awkward APIs, poor boundaries, or inheritance trouble. The best capstone begins from code that is ugly enough to matter but stable enough to rescue."
				},
				{
					title: "Diagnosis Pass: Smells, Risks, and Refactor Sequence",
					content:
						"List the main smell categories present, the behavior that must stay unchanged, and the ordered refactoring steps planned. Students should name both the technique categories and any patterns they expect to emerge."
				},
				{
					title: "Execution Pass: Small Safe Transformations",
					content:
						"Perform the refactor as a sequence of readable changes rather than a single giant rewrite. Require validation after each meaningful stage. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Pattern Arrival Review",
					content:
						"Identify which patterns genuinely emerged in the final design and which remained unnecessary. This is where the two-course sequence should finally converge into one coherent design mindset."
				},
				{
					title: "Final Architecture Review",
					content:
						"Evaluate the codebase in terms of smell reduction, package clarity, collaboration boundaries, and changeability. Students should explain the next improvement they would make only if the project continued."
				},
				{
					title: "Capstone Reflection: From Catalog Knowledge to Judgment",
					content:
						"Close the course by documenting which Refactoring.Guru techniques mattered most in practice and which pattern introductions truly paid off. The final goal is design judgment, not catalog recitation."
				},
				{
					title: "DPR10 Capstone Refactoring Studio: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr10-capstone-refactoring-studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr10-capstone-refactoring-studio/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can explain their refactor sequence in terms of risk reduction as well as final architecture. Use a short prompt asking which proposed change they intentionally postponed and why.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr10-capstone-refactoring-studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr10-capstone-refactoring-studio/solution"
				},
				{
					title: "Capstone Refactoring Studio supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR10 Capstone Refactoring Studio. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-19-dpr10-capstone-refactoring-studio-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-19-dpr10-capstone-refactoring-studio-supplemental-2/solution"
				},
				{
					title: "Capstone Refactoring Studio supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to DPR10 Capstone Refactoring Studio. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-20-dpr10-capstone-refactoring-studio-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-20-dpr10-capstone-refactoring-studio-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 11: refactoring clinic 11",
			curriculum: [
				{
					title: "refactoring clinic 11: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 11: refactoring clinic 11, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "refactoring clinic 11: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 11: refactoring clinic 11, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "refactoring clinic 11: Core Project",
					content:
						"Build the central artifact for Applied Studio 11: refactoring clinic 11. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-refactoring-clinic-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-refactoring-clinic-11/solution"
				},
				{
					title: "refactoring clinic 11: Review and Reflection",
					content:
						"Close Applied Studio 11: refactoring clinic 11 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "refactoring clinic 11: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 11: refactoring clinic 11 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-refactoring-clinic-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-refactoring-clinic-11/solution"
				},
				{
					title: "Applied Studio 11: refactoring clinic 11 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: refactoring clinic 11. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-21-applied-studio-11-refactoring-clinic-11-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-21-applied-studio-11-refactoring-clinic-11-suppleme/solution"
				},
				{
					title: "Applied Studio 11: refactoring clinic 11 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: refactoring clinic 11. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-22-applied-studio-11-refactoring-clinic-11-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-22-applied-studio-11-refactoring-clinic-11-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 12: refactoring clinic 12",
			curriculum: [
				{
					title: "refactoring clinic 12: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: refactoring clinic 12, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "refactoring clinic 12: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: refactoring clinic 12, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "refactoring clinic 12: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: refactoring clinic 12. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-refactoring-clinic-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-refactoring-clinic-12/solution"
				},
				{
					title: "refactoring clinic 12: Review and Reflection",
					content:
						"Close Applied Studio 12: refactoring clinic 12 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "refactoring clinic 12: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: refactoring clinic 12 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-refactoring-clinic-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-refactoring-clinic-12/solution"
				},
				{
					title: "Applied Studio 12: refactoring clinic 12 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: refactoring clinic 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-23-applied-studio-12-refactoring-clinic-12-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-23-applied-studio-12-refactoring-clinic-12-suppleme/solution"
				},
				{
					title: "Applied Studio 12: refactoring clinic 12 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: refactoring clinic 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-24-applied-studio-12-refactoring-clinic-12-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-24-applied-studio-12-refactoring-clinic-12-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 13: refactoring clinic 13",
			curriculum: [
				{
					title: "refactoring clinic 13: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: refactoring clinic 13, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "refactoring clinic 13: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: refactoring clinic 13, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "refactoring clinic 13: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: refactoring clinic 13. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-refactoring-clinic-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-refactoring-clinic-13/solution"
				},
				{
					title: "refactoring clinic 13: Review and Reflection",
					content:
						"Close Applied Studio 13: refactoring clinic 13 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "refactoring clinic 13: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: refactoring clinic 13 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-refactoring-clinic-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-refactoring-clinic-13/solution"
				},
				{
					title: "Applied Studio 13: refactoring clinic 13 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: refactoring clinic 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-25-applied-studio-13-refactoring-clinic-13-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-25-applied-studio-13-refactoring-clinic-13-suppleme/solution"
				},
				{
					title: "Applied Studio 13: refactoring clinic 13 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: refactoring clinic 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-26-applied-studio-13-refactoring-clinic-13-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-26-applied-studio-13-refactoring-clinic-13-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: refactoring clinic 14",
			curriculum: [
				{
					title: "refactoring clinic 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: refactoring clinic 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "refactoring clinic 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: refactoring clinic 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "refactoring clinic 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: refactoring clinic 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-refactoring-clinic-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-refactoring-clinic-14/solution"
				},
				{
					title: "refactoring clinic 14: Review and Reflection",
					content:
						"Close Applied Studio 14: refactoring clinic 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "refactoring clinic 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: refactoring clinic 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-refactoring-clinic-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-refactoring-clinic-14/solution"
				},
				{
					title: "Applied Studio 14: refactoring clinic 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: refactoring clinic 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-27-applied-studio-14-refactoring-clinic-14-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-27-applied-studio-14-refactoring-clinic-14-suppleme/solution"
				},
				{
					title: "Applied Studio 14: refactoring clinic 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: refactoring clinic 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-28-applied-studio-14-refactoring-clinic-14-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-28-applied-studio-14-refactoring-clinic-14-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: refactoring clinic 15",
			curriculum: [
				{
					title: "refactoring clinic 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: refactoring clinic 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "refactoring clinic 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: refactoring clinic 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "refactoring clinic 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: refactoring clinic 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-refactoring-clinic-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-refactoring-clinic-15/solution"
				},
				{
					title: "refactoring clinic 15: Review and Reflection",
					content:
						"Close Applied Studio 15: refactoring clinic 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "refactoring clinic 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: refactoring clinic 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-refactoring-clinic-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-refactoring-clinic-15/solution"
				},
				{
					title: "Applied Studio 15: refactoring clinic 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: refactoring clinic 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-29-applied-studio-15-refactoring-clinic-15-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-29-applied-studio-15-refactoring-clinic-15-suppleme/solution"
				},
				{
					title: "Applied Studio 15: refactoring clinic 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: refactoring clinic 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-30-applied-studio-15-refactoring-clinic-15-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-30-applied-studio-15-refactoring-clinic-15-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: refactoring clinic 16",
			curriculum: [
				{
					title: "refactoring clinic 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: refactoring clinic 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "refactoring clinic 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: refactoring clinic 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "refactoring clinic 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: refactoring clinic 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-refactoring-clinic-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-refactoring-clinic-16/solution"
				},
				{
					title: "refactoring clinic 16: Review and Reflection",
					content:
						"Close Applied Studio 16: refactoring clinic 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "refactoring clinic 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: refactoring clinic 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-refactoring-clinic-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-refactoring-clinic-16/solution"
				},
				{
					title: "Applied Studio 16: refactoring clinic 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: refactoring clinic 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-31-applied-studio-16-refactoring-clinic-16-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-31-applied-studio-16-refactoring-clinic-16-suppleme/solution"
				},
				{
					title: "Applied Studio 16: refactoring clinic 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: refactoring clinic 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-32-applied-studio-16-refactoring-clinic-16-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-32-applied-studio-16-refactoring-clinic-16-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: refactoring clinic 17",
			curriculum: [
				{
					title: "refactoring clinic 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: refactoring clinic 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "refactoring clinic 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: refactoring clinic 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "refactoring clinic 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: refactoring clinic 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-refactoring-clinic-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-refactoring-clinic-17/solution"
				},
				{
					title: "refactoring clinic 17: Review and Reflection",
					content:
						"Close Applied Studio 17: refactoring clinic 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "refactoring clinic 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: refactoring clinic 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-refactoring-clinic-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-refactoring-clinic-17/solution"
				},
				{
					title: "Applied Studio 17: refactoring clinic 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: refactoring clinic 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-33-applied-studio-17-refactoring-clinic-17-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-33-applied-studio-17-refactoring-clinic-17-suppleme/solution"
				},
				{
					title: "Applied Studio 17: refactoring clinic 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: refactoring clinic 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-34-applied-studio-17-refactoring-clinic-17-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-34-applied-studio-17-refactoring-clinic-17-suppleme/solution"
				}
			]
		}
	]
};
