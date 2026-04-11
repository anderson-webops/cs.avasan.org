import type { RawCourse } from "./types";

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
				},
				{
					title: "APCS0 Setup, Positioning, and Exam Workflow: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Variables-Reference"
				}
			],
			supplementalProjects: [
				{
					title: "APCS Log: Setup, Positioning, and Exam Workflow",
					content:
						"Keep a brief AP-style study log for setup, positioning, and exam workflow that records one code trace, one free-response-style explanation, and one note about which parts of the AP format still feel different from a normal programming class. The goal is to practice reasoning in the same form the exam expects.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Variables-Reference"
				},
				{
					title: "APCS0 Setup, Positioning, and Exam Workflow: Fluency Drill",
					content:
						"Repeat the core ideas from APCS0 Setup, Positioning, and Exam Workflow on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
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
						"Start exam-style tracing early so students treat each assignment as a state change they can predict. The habit of stepping through a short program line by line pays off all year. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 1: Variables, Strings, and Expressions: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs-Template",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Mad Libs",
					content:
						"Use a small but lively string-manipulation starter to practice variables, concatenation, and formatted output. This is a low-friction way to build confidence before the course gets more structural.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs-Template",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs"
				},
				{
					title: "Project: Hospital Survey",
					content:
						"Use a simple data-entry style problem to reinforce variables, strings, and output formatting in a context that feels more like information processing than a puzzle. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Hospital-Survey"
				},
				{
					title: "Project: Rounding It Off",
					content:
						"Practice numeric reasoning and rounding rules with a focused exercise that can be traced by hand before being run. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Rounding-It-Off"
				},
				{
					title: "APCS Log: Variables, Strings, and Expressions",
					content:
						"Keep a brief AP-style study log for variables, strings, and expressions that records one code trace, one free-response-style explanation, and one note about how expression evaluation changes the value of each variable over time. The goal is to practice reasoning in the same form the exam expects."
				}
			]
		},
		{
			title: "Unit 2: Conditionals, Methods, and Randomness",
			curriculum: [
				{
					title: "Boolean Logic and Relational Operators",
					content:
						"Teach conditionals as precise decision-making rather than informal branching. Students should be able to read a compound boolean expression and say exactly when it evaluates to true. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
						"Require students to explain why a branch is taken, not merely observe that it was. This supports both AP-style written responses and stronger debugging discipline. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 2: Conditionals, Methods, and Randomness: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS2-Verifying-Expressions-Starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS2-Verifying-Expressions"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Verifying Expressions",
					content:
						"Start from a starter that focuses on evaluating and testing boolean or arithmetic expressions, then compare it with the completed version to tighten reasoning about exact outcomes. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS2-Verifying-Expressions-Starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS2-Verifying-Expressions"
				},
				{
					title: "Project: FizzBuzz",
					content:
						"Use a classic branching exercise to reinforce condition ordering, divisibility checks, and readable method-level reasoning. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS2-Project-4-Fizzbuzz"
				},
				{
					title: "Project: Practice with Methods",
					content:
						"Use a small method-design project to make parameter flow and return values explicit before classes and objects become more central. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS3-Project-1-Practice-with-Methods"
				},
				{
					title: "Project: Elevator Warning",
					content:
						"Use a tight conditional problem to emphasize threshold checks, readability, and careful edge-case thinking. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS3-Elevator-Warning"
				}
			]
		},
		{
			title: "Unit 3: Loops, Tracing, and Algorithmic Thinking",
			curriculum: [
				{
					title: "For Loops, While Loops, and When to Use Each",
					content:
						"Teach counted loops and condition-driven loops as distinct tools with distinct failure modes. Students should know which loop structure fits the problem before they begin typing. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Nested Loops and Pattern Generation",
					content:
						"Use nested loops to model grids, repeated structure, and simple text or numeric patterns. This prepares students for two-dimensional arrays and matrix-style work later in the course. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Loop Tracing and Off-by-One Discipline",
					content:
						"Make off-by-one reasoning explicit through written traces and boundary checks. Students should leave this unit able to predict exactly how many times a loop body runs and why. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Algorithm Structure over Syntax Memorization",
					content:
						"Use loop problems to discuss invariant thinking and stepwise refinement. The point is to build algorithmic control, not just to memorize loop templates. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 3: Loops, Tracing, and Algorithmic Thinking: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS4-Translating-Loops-Starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS4-Translating-Loops"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Translating Loops",
					content:
						"Move between loop forms deliberately so students see that the structure can change while the algorithmic meaning stays the same. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS4-Translating-Loops-Starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS4-Translating-Loops"
				},
				{
					title: "Project: For Loop Practice",
					content:
						"Build speed and confidence with counted iteration before more layered array and matrix tasks appear. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS4-For-Loop-Practice"
				},
				{
					title: "Project: While Loop and Nested Loop Practice",
					content:
						"Use a mixed loop practice set to solidify termination reasoning, accumulation, and repeated structure. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS4-While-Loop-and-Nested-Loop-Practice"
				},
				{
					title: "APCS Log: Loops, Tracing, and Algorithmic Thinking",
					content:
						"Keep a brief AP-style study log for loops, tracing, and algorithmic thinking that records one code trace, one free-response-style explanation, and one note about which loop boundary or update step is easiest to get wrong under exam pressure. The goal is to practice reasoning in the same form the exam expects."
				}
			]
		},
		{
			title: "Unit 4: Classes, Objects, and Encapsulation",
			curriculum: [
				{
					title: "Designing a Class around State and Behavior",
					content:
						"Teach classes as blueprints for related data and operations. Students should think about what a class owns, what can change, and which methods belong with that state. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
				},
				{
					title: "Unit 4: Classes, Objects, and Encapsulation: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Dog-Class"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Dog Class",
					content:
						"Use a friendly object model to practice fields, constructors, and methods without heavy domain complexity. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Dog-Class"
				},
				{
					title: "Project: Bank Account Class",
					content:
						"Model deposits, withdrawals, and balance changes so students can reason about state transitions and method responsibilities clearly. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS6-Bank-Account-Class"
				},
				{
					title: "Project: Farm Class",
					content:
						"Start from a starter that leaves room for design choices, then compare it with a full implementation to sharpen class-structure judgment. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS6-Farm-Class-Starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS6-Farm-Class"
				},
				{
					title: "Project: Student Class",
					content:
						"Use a school-flavored class example to practice object fields, derived values, and simple method-based reporting. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS5-Student-Class"
				}
			]
		},
		{
			title: "Unit 5: Arrays, ArrayLists, and Two-Dimensional Data",
			curriculum: [
				{
					title: "Indexed Collections and Traversal Patterns",
					content:
						"Teach arrays and ArrayLists as ordered collections with different tradeoffs but similar traversal thinking. Students should be fluent in indexing, bounds, updates, and scan patterns. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
						"Combine object-oriented design with list structures so students can manage richer program state. This is where many AP free-response tasks begin to feel more realistic. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 5: Arrays, ArrayLists, and Two-Dimensional Data: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS10-Practice-With-Arrays"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Practice with Arrays",
					content:
						"Reinforce indexing, traversal, and accumulation with a focused one-dimensional array practice set. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS10-Practice-With-Arrays"
				},
				{
					title: "Project: Practice with Two-Dimensional Arrays",
					content:
						"Use grid-structured data to make nested iteration and row/column reasoning concrete. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS10-Practice-With-Two-Dimensional-Arrays"
				},
				{
					title: "Project: Practice with ArrayLists",
					content:
						"Work with variable-length collections and the method vocabulary that the AP exam expects students to know well. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS11-Practice-With-ArrayLists"
				},
				{
					title: "Project: Card Shuffler",
					content:
						"Use cards and decks to combine collection management, object models, and algorithmic updates in one exam-relevant project. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS11-Card-Shuffler-Starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS11-Card-Shuffler"
				}
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
						"Keep asking whether the inheritance hierarchy clarifies the model or makes it harder to reason about. The unit should produce better judgment, not just more keywords. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 6: Inheritance and Polymorphism: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS7-Books-and-PictureBooks"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Books and PictureBooks",
					content:
						"Use a familiar inheritance example to practice shared fields, added subclass behavior, and readable constructors. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS7-Books-and-PictureBooks"
				},
				{
					title: "Project: Pets",
					content:
						"Use a pet hierarchy to compare inherited versus specialized behavior and to practice object references across a class family. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS7-Pets"
				},
				{
					title: "Project: Many Shapes",
					content:
						"Work from a starter that highlights polymorphic method calls, then compare it with a completed model to sharpen design choices. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS8-Many-Shapes-Starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS8-Many-Shapes"
				},
				{
					title: "APCS Log: Inheritance and Polymorphism",
					content:
						"Keep a brief AP-style study log for inheritance and polymorphism that records one code trace, one free-response-style explanation, and one note about which method call depends on the reference type and which depends on the actual object type. The goal is to practice reasoning in the same form the exam expects."
				}
			]
		},
		{
			title: "Unit 7: Searching, Sorting, Runtime, and Recursion",
			curriculum: [
				{
					title: "Linear Search, Binary Search, and Preconditions",
					content:
						"Teach search as both a practical coding skill and an exercise in recognizing assumptions. Students should know why binary search needs sorted data and why that precondition matters. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
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
				},
				{
					title: "Unit 7: Searching, Sorting, Runtime, and Recursion: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS13-Linear-Search-Implementation"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Linear Search Implementation",
					content:
						"Write and trace a direct search algorithm before comparing it to more specialized options. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS13-Linear-Search-Implementation"
				},
				{
					title: "Project: Selection Sort",
					content:
						"Use a straightforward sorting method to practice invariants and step-by-step trace reasoning. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS14-Selection-Sort"
				},
				{
					title: "Project: Insertion Sort",
					content:
						"Contrast insertion sort with selection sort so students can talk about mechanism, not just name recognition. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS14-Insertion-Sort"
				},
				{
					title: "Project: Binary Search and Merge Sort",
					content:
						"Use two classic divide-and-conquer ideas to tie together preconditions, efficiency, and recursive structure. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS16-Binary-Search"
				},
				{
					title: "Project: Tracing Recursion",
					content:
						"Start from a recursion starter, then compare with a completed traceable version so students can see how base cases and call structure fit together. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS15-Tracing-Recursion-Starter",
					solutionLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS15-Tracing-Recursion"
				}
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
						"Teach students to read every line of a question stem, every code fragment, and every answer choice with care. The AP exam rewards precision and punishes rushed assumptions. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Tracing without Running",
					content:
						"Make timed traces a normal practice activity so students stop depending on execution as their only debugging tool. This is one of the biggest mindset shifts for test readiness. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Time Management and Partial Credit Thinking",
					content:
						"Help students learn when to move on, how to show useful partial work, and how to recover from a difficult question without losing the entire section. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 8: AP Exam Practice and Strategy: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-A-2020-Practice-Exam"
				}
			],
			supplementalProjects: [
				{
					title: "Practice: 2020 AP CSA Exam",
					content:
						"Use a full practice exam to simulate pacing, question mix, and the mental transition between sections. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-A-2020-Practice-Exam"
				},
				{
					title: "Practice: Free Response Review",
					content:
						"Drill representative free-response tasks so students can see recurring patterns before the real exam. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS10-Free-Response-Practice"
				},
				{
					title: "Practice: Multiple Choice Reference",
					content:
						"Use a focused multiple-choice reference to review method contracts, collection behavior, and common trace patterns. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS10-Multiple-Choice-Reference"
				},
				{
					title: "APCS Log: AP Exam Practice and Strategy",
					content:
						"Keep a brief AP-style study log for ap exam practice and strategy that records one code trace, one free-response-style explanation, and one note about which question types still consume too much time and why. The goal is to practice reasoning in the same form the exam expects."
				}
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
						"Identify at least one project that can be cleaned up and kept as a portfolio artifact. This helps students connect classroom preparation to longer-term development growth. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unit 9: Capstone and Post-AP Extensions: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-3-Closing-Project-Starter"
				}
			],
			supplementalProjects: [
				{
					title: "Capstone: Closing Project Starter",
					content:
						"Use the closing project starter as the main integration exercise for the end of the course. Students should take it from scaffold to polished solution with deliberate testing and explanation.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-3-Closing-Project-Starter"
				},
				{
					title: "Extension: Elevens",
					content:
						"Use a classic AP-adjacent card-game extension to practice object models, collection updates, and more structured gameplay logic. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS17-Elevens"
				},
				{
					title: "Extension: Spaceships",
					content:
						"Use a larger game-flavored extension for students who want something more open-ended after the exam core is secure. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS17-Spaceships"
				},
				{
					title: "Extension: Additional Practice Project",
					content:
						"Use one last structured practice project to reinforce readiness for the next Java or algorithms course. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-4-Additional-Practice-Project"
				}
			]
		},
		{
			title: "Unit 10: Repo Reference, Check-In, and Practice Bank",
			curriculum: [
				{
					title: "APCS Repo Taxonomy",
					content:
						"Treat the `APCS` repo as four intentionally different banks: required course projects, optional reinforcement labs, AP-style references and practice, and check-ins or alternate projects. This keeps the course readable while making the broader repo inventory discoverable."
				},
				{
					title: "Reference Folders Stay Optional",
					content:
						"Keep the numerous `Reference`, `Multiple-Choice`, and `Free-Response` folders as targeted support material instead of forcing them into the main weekly spine. Students should use them when a topic needs reinforcement or exam-style review."
				},
				{
					title: "Check-Ins and Alternate Projects",
					content:
						"Expose the check-ins and alternate practice projects as structured review work, not as hidden repo noise. This is especially useful for students who want more AP-style pacing without leaving the Java/AP track."
				},
				{
					title: "Unit 10: Repo Reference, Check In, and Practice Bank: Verification and Reflection",
					content:
						"Close Unit 10: Repo Reference, Check-In, and Practice Bank by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "Unit 10: Repo Reference, Check-In, and Practice Bank: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Casting-Reference"
				}
			],
			supplementalProjects: [
				{
					title: "Reference Bank: Variables, Strings, and Casting",
					content:
						"Use the early-unit references when students need direct support on primitives, strings, arithmetic operators, or casting before moving back into project work. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Casting-Reference"
				},
				{
					title: "Optional Project: Playlist",
					content:
						"Use a class-and-array style project to reinforce object design, collections, and readable method structure. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS10-Playlist"
				},
				{
					title: "Optional Project: Card and Deck Classes",
					content:
						"Strengthen class interactions and collection modeling with a fuller card/deck object set before or after AP-adjacent card games. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS11-Card-and-Deck-Classes"
				},
				{
					title: "Practice: APCS Check-In 1",
					content:
						"Use the first repo check-in as a concise cumulative review block for the earlier AP CSA topics. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Check-in-1"
				},
				{
					title: "Practice: Check-In 2 Additional Project",
					content:
						"Use an extra mid-course practice project when a student needs one more pass over methods, classes, or structured control flow. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS-Check-in-2-Additional-Practice-Project"
				},
				{
					title: "Practice: Runtime Analysis",
					content:
						"Use the runtime-analysis folder as a bridge from AP problem solving into more explicit algorithmic cost reasoning. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS13-Runtime-Analysis"
				},
				{
					title: "Practice: Blob Erase",
					content:
						"Use a flood-fill style recursion exercise as a stronger recursive problem once the basic tracing work is secure. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS15-Blob-Erase"
				},
				{
					title: "Practice: Merge Sort",
					content:
						"Use merge sort as an optional extension for students who want one more serious sorting algorithm beyond the main AP core. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS16-MergeSort"
				},
				{
					title: "Extension: Decode",
					content:
						"Use a later-stage string and logic project as an optional capstone-style AP extension. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS17-Decode"
				}
			]
		},
		{
			title: "Applied Studio 12: APCS Check in 1 Additional Practice Project",
			curriculum: [
				{
					title: "APCS Check in 1 Additional Practice Project: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: APCS Check in 1 Additional Practice Project, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "APCS Check in 1 Additional Practice Project: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: APCS Check in 1 Additional Practice Project, naming the key inputs, the expected outputs, and the checkpoints worth verifying early."
				},
				{
					title: "APCS Check in 1 Additional Practice Project: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: APCS Check in 1 Additional Practice Project. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-1-Additional-Practice-Project"
				},
				{
					title: "APCS Check in 1 Additional Practice Project: Review and Reflection",
					content:
						"Close Applied Studio 12: APCS Check in 1 Additional Practice Project by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "APCS Check in 1 Additional Practice Project: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: APCS Check in 1 Additional Practice Project with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-1-Additional-Practice-Project"
				},
				{
					title: "APCS Check in 1 Additional Practice Project: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 12: APCS Check in 1 Additional Practice Project. Keep the scope tight, but require one meaningful design or reasoning decision. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			]
		},
		{
			title: "Applied Studio 13: APCS Check in 2",
			curriculum: [
				{
					title: "APCS Check in 2: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: APCS Check in 2, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "APCS Check in 2: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: APCS Check in 2, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "APCS Check in 2: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: APCS Check in 2. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-2"
				},
				{
					title: "APCS Check in 2: Review and Reflection",
					content:
						"Close Applied Studio 13: APCS Check in 2 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "APCS Check in 2: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: APCS Check in 2 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-2"
				},
				{
					title: "APCS Check in 2: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 13: APCS Check in 2. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 14: APCS Check in 3",
			curriculum: [
				{
					title: "APCS Check in 3: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: APCS Check in 3, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "APCS Check in 3: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: APCS Check in 3, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "APCS Check in 3: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: APCS Check in 3. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-3"
				},
				{
					title: "APCS Check in 3: Review and Reflection",
					content:
						"Close Applied Studio 14: APCS Check in 3 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "APCS Check in 3: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: APCS Check in 3 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-3"
				},
				{
					title: "APCS Check in 3: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 14: APCS Check in 3. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 15: APCS Check in 3 Additional Practice Project",
			curriculum: [
				{
					title: "APCS Check in 3 Additional Practice Project: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: APCS Check in 3 Additional Practice Project, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "APCS Check in 3 Additional Practice Project: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: APCS Check in 3 Additional Practice Project, naming the key inputs, the expected outputs, and the checkpoints worth verifying early."
				},
				{
					title: "APCS Check in 3 Additional Practice Project: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: APCS Check in 3 Additional Practice Project. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-3-Additional-Practice-Project"
				},
				{
					title: "APCS Check in 3 Additional Practice Project: Review and Reflection",
					content:
						"Close Applied Studio 15: APCS Check in 3 Additional Practice Project by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "APCS Check in 3 Additional Practice Project: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: APCS Check in 3 Additional Practice Project with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-3-Additional-Practice-Project"
				},
				{
					title: "APCS Check in 3 Additional Practice Project: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 15: APCS Check in 3 Additional Practice Project. Keep the scope tight, but require one meaningful design or reasoning decision. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			]
		},
		{
			title: "Applied Studio 16: APCS Check in 4",
			curriculum: [
				{
					title: "APCS Check in 4: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: APCS Check in 4, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "APCS Check in 4: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: APCS Check in 4, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "APCS Check in 4: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: APCS Check in 4. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-4"
				},
				{
					title: "APCS Check in 4: Review and Reflection",
					content:
						"Close Applied Studio 16: APCS Check in 4 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "APCS Check in 4: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: APCS Check in 4 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS_Check-in-4"
				},
				{
					title: "APCS Check in 4: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 16: APCS Check in 4. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 17: Strings and Printing Reference",
			curriculum: [
				{
					title: "Strings and Printing Reference: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: Strings and Printing Reference, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "Strings and Printing Reference: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: Strings and Printing Reference, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Strings and Printing Reference: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: Strings and Printing Reference. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Strings-and-Printing-Reference"
				},
				{
					title: "Strings and Printing Reference: Review and Reflection",
					content:
						"Close Applied Studio 17: Strings and Printing Reference by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "Strings and Printing Reference: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: Strings and Printing Reference with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/APCS/tree/main/APCS1-Strings-and-Printing-Reference"
				},
				{
					title: "Strings and Printing Reference: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 17: Strings and Printing Reference. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		}
	]
};
