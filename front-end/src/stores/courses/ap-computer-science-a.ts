import type { RawCourse, RawCourseModuleItem } from "./types";

const APCS_REPO = "https://github.com/instruction-material/APCS/tree/main";

function repoLink(projectId: string) {
	return `${APCS_REPO}/${projectId}`;
}

function projectItem(
	title: string,
	content: string,
	projectId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: repoLink(projectId)
	};
}

function pairedProjectItem(
	title: string,
	content: string,
	starterId: string,
	solutionId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: repoLink(starterId),
		solutionLink: repoLink(solutionId)
	};
}

function examLog(unitTitle: string, focus: string): RawCourseModuleItem {
	return {
		title: `APCS Log: ${unitTitle}`,
		content: `Keep a brief AP-style study log for ${unitTitle.toLowerCase()} that records one code trace, one free-response-style explanation, and one note about ${focus}. The goal is to practice reasoning in the same form the exam expects.`
	};
}

export const apComputerScienceACourse: RawCourse = {
	name: "AP Computer Science A",
	modules: [
		{
			title: "APCS0 Setup, Positioning, and Exam Workflow",
			curriculum: [
				{
					title: "Java Toolchain and IDE Baseline",
					content:
						"Standardize on a Java 17-capable toolchain with either `IntelliJ IDEA`, `VS Code`, or another editor that supports fast compile-run cycles. The environment should make tracing, printing, and short project iteration easy because AP CS A rewards disciplined reasoning more than framework setup."
				},
				{
					title: "Course Positioning",
					content:
						"Frame AP CS A as a Java-centered course about problem solving, object-oriented design, arrays, ArrayLists, inheritance, recursion, and exam-style reasoning. Students should understand that the class balances genuine software development habits with a specific test format."
				},
				{
					title: "Free Response and Multiple Choice Habits",
					content:
						"Introduce the rhythm of code reading, tracing, short explanations, and partial-code writing from the beginning. Students who practice only by running programs often struggle when the exam asks them to reason without executing anything."
				},
				{
					title: "Reference-Sheet Thinking",
					content:
						"Get students used to working with references, method contracts, and library expectations. The AP course is easier when students know how to read provided information precisely rather than memorizing every detail in isolation."
				}
			],
			supplementalProjects: [
				examLog(
					"Setup, Positioning, and Exam Workflow",
					"which parts of the AP format still feel different from a normal programming class"
				)
			]
		},
		{
			title: "Unit 1: Variables, Strings, and Expressions",
			curriculum: [
				{
					title: "Primitive Types and Assignment",
					content:
						"Teach variables, primitive types, casting, and assignment as the basic grammar of the language. Students should become fluent enough here that later logic and class design work are not slowed down by syntax uncertainty."
				},
				{
					title: "String Building and Input/Output",
					content:
						"Use printing, concatenation, and simple text formatting to make programs readable. The goal is not flashy output; it is the ability to inspect program state and communicate clearly with the user."
				},
				{
					title: "Arithmetic, Rounding, and Expression Evaluation",
					content:
						"Have students reason carefully about operator precedence, integer division, remainder, and rounding. This is foundational AP content and also the source of many avoidable mistakes later in the course."
				},
				{
					title: "Tracing Simple Programs",
					content:
						"Start exam-style tracing early so students treat each assignment as a state change they can predict. The habit of stepping through a short program line by line pays off all year."
				}
			],
			supplementalProjects: [
				pairedProjectItem(
					"Project: Mad Libs",
					"Use a small but lively string-manipulation starter to practice variables, concatenation, and formatted output. This is a low-friction way to build confidence before the course gets more structural.",
					"APCS1-Mad-Libs-Template",
					"APCS1-Mad-Libs"
				),
				projectItem(
					"Project: Hospital Survey",
					"Use a simple data-entry style problem to reinforce variables, strings, and output formatting in a context that feels more like information processing than a puzzle.",
					"APCS1-Hospital-Survey"
				),
				projectItem(
					"Project: Rounding It Off",
					"Practice numeric reasoning and rounding rules with a focused exercise that can be traced by hand before being run.",
					"APCS1-Rounding-It-Off"
				),
				examLog(
					"Variables, Strings, and Expressions",
					"how expression evaluation changes the value of each variable over time"
				)
			]
		},
		{
			title: "Unit 2: Conditionals, Methods, and Randomness",
			curriculum: [
				{
					title: "Boolean Logic and Relational Operators",
					content:
						"Teach conditionals as precise decision-making rather than informal branching. Students should be able to read a compound boolean expression and say exactly when it evaluates to true."
				},
				{
					title: "Method Design and Parameter Flow",
					content:
						"Introduce methods as reusable units of logic with clear inputs, outputs, and side effects. This is where students begin to write code that is structured for reading instead of only for immediate execution."
				},
				{
					title: "Randomness and Controlled Testing",
					content:
						"Use random-number generation carefully and teach students how to test programs that include non-deterministic behavior. Randomness should deepen understanding of control flow, not hide bugs."
				},
				{
					title: "Reading and Explaining Decisions",
					content:
						"Require students to explain why a branch is taken, not merely observe that it was. This supports both AP-style written responses and stronger debugging discipline."
				}
			],
			supplementalProjects: [
				pairedProjectItem(
					"Project: Verifying Expressions",
					"Start from a starter that focuses on evaluating and testing boolean or arithmetic expressions, then compare it with the completed version to tighten reasoning about exact outcomes.",
					"APCS2-Verifying-Expressions-Starter",
					"APCS2-Verifying-Expressions"
				),
				projectItem(
					"Project: FizzBuzz",
					"Use a classic branching exercise to reinforce condition ordering, divisibility checks, and readable method-level reasoning.",
					"APCS2-Project-4-Fizzbuzz"
				),
				projectItem(
					"Project: Practice with Methods",
					"Use a small method-design project to make parameter flow and return values explicit before classes and objects become more central.",
					"APCS3-Project-1-Practice-with-Methods"
				),
				projectItem(
					"Project: Elevator Warning",
					"Use a tight conditional problem to emphasize threshold checks, readability, and careful edge-case thinking.",
					"APCS3-Elevator-Warning"
				)
			]
		},
		{
			title: "Unit 3: Loops, Tracing, and Algorithmic Thinking",
			curriculum: [
				{
					title: "For Loops, While Loops, and When to Use Each",
					content:
						"Teach counted loops and condition-driven loops as distinct tools with distinct failure modes. Students should know which loop structure fits the problem before they begin typing."
				},
				{
					title: "Nested Loops and Pattern Generation",
					content:
						"Use nested loops to model grids, repeated structure, and simple text or numeric patterns. This prepares students for two-dimensional arrays and matrix-style work later in the course."
				},
				{
					title: "Loop Tracing and Off-by-One Discipline",
					content:
						"Make off-by-one reasoning explicit through written traces and boundary checks. Students should leave this unit able to predict exactly how many times a loop body runs and why."
				},
				{
					title: "Algorithm Structure over Syntax Memorization",
					content:
						"Use loop problems to discuss invariant thinking and stepwise refinement. The point is to build algorithmic control, not just to memorize loop templates."
				}
			],
			supplementalProjects: [
				pairedProjectItem(
					"Project: Translating Loops",
					"Move between loop forms deliberately so students see that the structure can change while the algorithmic meaning stays the same.",
					"APCS4-Translating-Loops-Starter",
					"APCS4-Translating-Loops"
				),
				projectItem(
					"Project: For Loop Practice",
					"Build speed and confidence with counted iteration before more layered array and matrix tasks appear.",
					"APCS4-For-Loop-Practice"
				),
				projectItem(
					"Project: While Loop and Nested Loop Practice",
					"Use a mixed loop practice set to solidify termination reasoning, accumulation, and repeated structure.",
					"APCS4-While-Loop-and-Nested-Loop-Practice"
				),
				examLog(
					"Loops, Tracing, and Algorithmic Thinking",
					"which loop boundary or update step is easiest to get wrong under exam pressure"
				)
			]
		},
		{
			title: "Unit 4: Classes, Objects, and Encapsulation",
			curriculum: [
				{
					title: "Designing a Class around State and Behavior",
					content:
						"Teach classes as blueprints for related data and operations. Students should think about what a class owns, what can change, and which methods belong with that state."
				},
				{
					title: "Constructors, Accessors, Mutators, and This",
					content:
						"Walk through constructors, getters, setters, and `this` references as the language of controlled object state. These details matter both for the AP exam and for readable object-oriented code."
				},
				{
					title: "Reference Semantics",
					content:
						"Teach object references explicitly so students understand aliasing, parameter passing, and side effects. This reduces confusion later when lists of objects and inheritance enter the picture."
				},
				{
					title: "Writing and Testing Small Object Models",
					content:
						"Use short, focused object projects so students can see the value of class design without getting lost in giant programs. The best object lessons here are ones they can mentally simulate."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Dog Class",
					"Use a friendly object model to practice fields, constructors, and methods without heavy domain complexity.",
					"APCS-Dog-Class"
				),
				projectItem(
					"Project: Bank Account Class",
					"Model deposits, withdrawals, and balance changes so students can reason about state transitions and method responsibilities clearly.",
					"APCS6-Bank-Account-Class"
				),
				pairedProjectItem(
					"Project: Farm Class",
					"Start from a starter that leaves room for design choices, then compare it with a full implementation to sharpen class-structure judgment.",
					"APCS6-Farm-Class-Starter",
					"APCS6-Farm-Class"
				),
				projectItem(
					"Project: Student Class",
					"Use a school-flavored class example to practice object fields, derived values, and simple method-based reporting.",
					"APCS5-Student-Class"
				)
			]
		},
		{
			title: "Unit 5: Arrays, ArrayLists, and Two-Dimensional Data",
			curriculum: [
				{
					title: "Indexed Collections and Traversal Patterns",
					content:
						"Teach arrays and ArrayLists as ordered collections with different tradeoffs but similar traversal thinking. Students should be fluent in indexing, bounds, updates, and scan patterns."
				},
				{
					title: "Accumulation, Search, and Transformation",
					content:
						"Use collection problems to practice computing totals, finding best values, filtering, and updating data in place. This is core AP material and a major step toward more realistic programs."
				},
				{
					title: "Two-Dimensional Arrays as Structured Grids",
					content:
						"Use matrices and grids to reinforce nested loops, row/column reasoning, and local versus global structure. Students should stop seeing 2D arrays as exotic and start seeing them as a natural extension of earlier loop work."
				},
				{
					title: "Collections of Objects",
					content:
						"Combine object-oriented design with list structures so students can manage richer program state. This is where many AP free-response tasks begin to feel more realistic."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Practice with Arrays",
					"Reinforce indexing, traversal, and accumulation with a focused one-dimensional array practice set.",
					"APCS10-Practice-With-Arrays"
				),
				projectItem(
					"Project: Practice with Two-Dimensional Arrays",
					"Use grid-structured data to make nested iteration and row/column reasoning concrete.",
					"APCS10-Practice-With-Two-Dimensional-Arrays"
				),
				projectItem(
					"Project: Practice with ArrayLists",
					"Work with variable-length collections and the method vocabulary that the AP exam expects students to know well.",
					"APCS11-Practice-With-ArrayLists"
				),
				pairedProjectItem(
					"Project: Card Shuffler",
					"Use cards and decks to combine collection management, object models, and algorithmic updates in one exam-relevant project.",
					"APCS11-Card-Shuffler-Starter",
					"APCS11-Card-Shuffler"
				)
			]
		},
		{
			title: "Unit 6: Inheritance and Polymorphism",
			curriculum: [
				{
					title: "Superclass, Subclass, and Shared Behavior",
					content:
						"Teach inheritance as a way to express common structure without duplicating code. Students should understand when a subclass relationship is appropriate and when composition would be clearer."
				},
				{
					title: "Overriding and Method Dispatch",
					content:
						"Use overriding to show how one method name can behave differently depending on the actual object type. This is both an AP topic and a good test of whether students truly understand references."
				},
				{
					title: "Polymorphism as Flexible Design",
					content:
						"Show how a list of superclass references can hold varied subclass instances while still supporting shared operations. Students should see polymorphism as an organizational advantage, not just as vocabulary."
				},
				{
					title: "Design Tradeoffs and Readability",
					content:
						"Keep asking whether the inheritance hierarchy clarifies the model or makes it harder to reason about. The unit should produce better judgment, not just more keywords."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Books and PictureBooks",
					"Use a familiar inheritance example to practice shared fields, added subclass behavior, and readable constructors.",
					"APCS7-Books-and-PictureBooks"
				),
				projectItem(
					"Project: Pets",
					"Use a pet hierarchy to compare inherited versus specialized behavior and to practice object references across a class family.",
					"APCS7-Pets"
				),
				pairedProjectItem(
					"Project: Many Shapes",
					"Work from a starter that highlights polymorphic method calls, then compare it with a completed model to sharpen design choices.",
					"APCS8-Many-Shapes-Starter",
					"APCS8-Many-Shapes"
				),
				examLog(
					"Inheritance and Polymorphism",
					"which method call depends on the reference type and which depends on the actual object type"
				)
			]
		},
		{
			title: "Unit 7: Searching, Sorting, Runtime, and Recursion",
			curriculum: [
				{
					title: "Linear Search, Binary Search, and Preconditions",
					content:
						"Teach search as both a practical coding skill and an exercise in recognizing assumptions. Students should know why binary search needs sorted data and why that precondition matters."
				},
				{
					title: "Selection, Insertion, and Merge Sort",
					content:
						"Compare common sorting algorithms in terms of how they work, what they preserve, and how much effort they require. The AP focus is conceptual clarity and traceability, not only asymptotic vocabulary."
				},
				{
					title: "Runtime Analysis at a Useful Level",
					content:
						"Use runtime analysis to compare algorithm families without turning the course into a pure theory class. Students should be able to make reasonable efficiency arguments about loops, searches, and nested work."
				},
				{
					title: "Recursion as Self-Similar Reasoning",
					content:
						"Teach recursion through clear base cases, smaller subproblems, and traceable calls. Students should learn to reason about recursive structure and not simply memorize one or two examples."
				}
			],
			supplementalProjects: [
				projectItem(
					"Project: Linear Search Implementation",
					"Write and trace a direct search algorithm before comparing it to more specialized options.",
					"APCS13-Linear-Search-Implementation"
				),
				projectItem(
					"Project: Selection Sort",
					"Use a straightforward sorting method to practice invariants and step-by-step trace reasoning.",
					"APCS14-Selection-Sort"
				),
				projectItem(
					"Project: Insertion Sort",
					"Contrast insertion sort with selection sort so students can talk about mechanism, not just name recognition.",
					"APCS14-Insertion-Sort"
				),
				projectItem(
					"Project: Binary Search and Merge Sort",
					"Use two classic divide-and-conquer ideas to tie together preconditions, efficiency, and recursive structure.",
					"APCS16-Binary-Search"
				),
				pairedProjectItem(
					"Project: Tracing Recursion",
					"Start from a recursion starter, then compare with a completed traceable version so students can see how base cases and call structure fit together.",
					"APCS15-Tracing-Recursion-Starter",
					"APCS15-Tracing-Recursion"
				)
			]
		},
		{
			title: "Unit 8: AP Exam Practice and Strategy",
			curriculum: [
				{
					title: "Free Response Structure",
					content:
						"Break down the recurring AP free-response patterns: class design, array work, ArrayLists, and 2D arrays. Students should know how to turn a prompt into a sequence of manageable requirements."
				},
				{
					title: "Multiple Choice Reading Discipline",
					content:
						"Teach students to read every line of a question stem, every code fragment, and every answer choice with care. The AP exam rewards precision and punishes rushed assumptions."
				},
				{
					title: "Tracing without Running",
					content:
						"Make timed traces a normal practice activity so students stop depending on execution as their only debugging tool. This is one of the biggest mindset shifts for test readiness."
				},
				{
					title: "Time Management and Partial Credit Thinking",
					content:
						"Help students learn when to move on, how to show useful partial work, and how to recover from a difficult question without losing the entire section."
				}
			],
			supplementalProjects: [
				projectItem(
					"Practice: 2020 AP CSA Exam",
					"Use a full practice exam to simulate pacing, question mix, and the mental transition between sections.",
					"APCS-A-2020-Practice-Exam"
				),
				projectItem(
					"Practice: Free Response Review",
					"Drill representative free-response tasks so students can see recurring patterns before the real exam.",
					"APCS10-Free-Response-Practice"
				),
				projectItem(
					"Practice: Multiple Choice Reference",
					"Use a focused multiple-choice reference to review method contracts, collection behavior, and common trace patterns.",
					"APCS10-Multiple-Choice-Reference"
				),
				examLog(
					"AP Exam Practice and Strategy",
					"which question types still consume too much time and why"
				)
			]
		},
		{
			title: "Unit 9: Capstone and Post-AP Extensions",
			curriculum: [
				{
					title: "Closing Project with AP-Level Expectations",
					content:
						"Use a closing project that pulls together classes, collections, control flow, and clean reasoning. The project should feel like an AP-level culmination rather than a disconnected novelty assignment."
				},
				{
					title: "Extending Beyond the Exam",
					content:
						"Show students how AP CS A connects to later work in `USACO Bronze`, `Design Patterns in Java`, and higher-level systems or algorithms courses. The point is to make the exam a milestone, not an endpoint."
				},
				{
					title: "Clean Code, Explanations, and Reflection",
					content:
						"Require a short reflection about design choices, test cases, and what still feels hard. Students should leave with a better sense of their own technical habits, not just a score target."
				},
				{
					title: "Portfolio-Ready Java Work",
					content:
						"Identify at least one project that can be cleaned up and kept as a portfolio artifact. This helps students connect classroom preparation to longer-term development growth."
				}
			],
			supplementalProjects: [
				projectItem(
					"Capstone: Closing Project Starter",
					"Use the closing project starter as the main integration exercise for the end of the course. Students should take it from scaffold to polished solution with deliberate testing and explanation.",
					"APCS_Check-in-3-Closing-Project-Starter"
				),
				projectItem(
					"Extension: Elevens",
					"Use a classic AP-adjacent card-game extension to practice object models, collection updates, and more structured gameplay logic.",
					"APCS17-Elevens"
				),
				projectItem(
					"Extension: Spaceships",
					"Use a larger game-flavored extension for students who want something more open-ended after the exam core is secure.",
					"APCS17-Spaceships"
				),
				projectItem(
					"Extension: Additional Practice Project",
					"Use one last structured practice project to reinforce readiness for the next Java or algorithms course.",
					"APCS_Check-in-4-Additional-Practice-Project"
				)
			]
		}
	]
};
