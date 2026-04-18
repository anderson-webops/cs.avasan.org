import type { RawCourse } from "./types";

const APCS_REPO_BASE = "https://github.com/instruction-material/APCS/tree/main";
const STATIC_MEDIA_BASE = "https://static.classes.jacobdanderson.net";
const BARRONS_TEXTBOOK =
	"https://www.amazon.com/Computer-Science-Premium-2024-Comprehensive-dp-1506287913/dp/1506287913/ref=dp_ob_title_bk";
const AP_2022_FRQ =
	"https://apcentral.collegeboard.org/media/pdf/ap22-frq-computer-science-a.pdf";
const AP_2022_FRQ_SCORING =
	"https://apcentral.collegeboard.org/media/pdf/ap22-sg-computer-science-a.pdf";
const AP_FRQ_ARCHIVE =
	"https://apstudents.collegeboard.org/courses/ap-computer-science-a/free-response-questions-by-year";

const repo = (path: string) => `${APCS_REPO_BASE}/${path}`;
const media = (file: string) => `${STATIC_MEDIA_BASE}/${file}`;

export const apComputerScienceACourse: RawCourse = {
	name: "AP Computer Science A",
	modules: [
		{
			title: "General: Course Introduction and Setup",
			curriculum: [
				{
					title: "Course Positioning",
					content:
						"AP Computer Science A is a Java course built around problem solving, object-oriented design, arrays, ArrayLists, inheritance, recursion, and exam-style tracing. The course should be treated as both a real programming class and a specific AP exam prep track."
				},
				{
					title: "Java Toolchain and Workflow",
					content:
						"Standardize on a Java 17-capable setup with fast compile-run cycles in `IntelliJ IDEA`, `VS Code`, or an equivalent editor. Students need a low-friction environment for short iterations, print debugging, and tracing."
				},
				{
					title: "Required Textbook",
					content:
						"The source material expects the Barron's AP Computer Science A book for chapter-based multiple choice and free-response practice. Keep the textbook aligned with the course sequence instead of treating it as a separate study track.",
					projectLink: BARRONS_TEXTBOOK
				},
				{
					title: "Reference Pack",
					content:
						"Start the course with the repo-backed reference projects for variables, strings, and casting so students build a clean notes-and-sandbox workflow from day one.",
					projectLink: repo("APCS1-Variables-Reference")
				}
			],
			supplementalProjects: [
				{
					title: "Strings and Printing Reference",
					content:
						"Use this reference build to reinforce output formatting, concatenation, escape characters, and readable console output.",
					projectLink: repo("APCS1-Strings-and-Printing-Reference")
				},
				{
					title: "Casting Reference",
					content:
						"Use this reference build when students need a tighter review of integer division, explicit casts, and loss-of-precision reasoning.",
					projectLink: repo("APCS1-Casting-Reference")
				},
				{
					title: "2020 Practice Exam",
					content:
						"Keep the repo practice exam available as a later-course benchmark, but introduce it here so the AP end state is visible early.",
					projectLink: repo("APCS-A-2020-Practice-Exam")
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Use the first check-in as guided review rather than a formal test. Focus on what the student can explain and debug independently across variables, conditionals, loops, and basic exceptions."
				},
				{
					title: "Learning Target Coverage",
					content:
						"The prompt bank concentrates on variables and printing, conditionals, counted and condition-driven loops, and early exception reasoning. This is the first structured checkpoint before the class sequence becomes more object-oriented."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"Run the verified check-in prompt bank from the APCS repo rather than the original Replit source. This is the direct GitHub-backed replacement for the check-in project link.",
					projectLink: repo("APCS-Check-in-1")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: FizzBuzz",
					content:
						"Use the additional practice project after the check-in when the student needs one more pass through divisibility checks, ordering conditionals, and loop tracing.",
					projectLink: repo(
						"APCS-Check-in-1-Additional-Practice-Project"
					),
					mediaLink: media("ps4_fizzbuzz.gif")
				},
				{
					title: "Variables Reference",
					content:
						"Return to the variables reference when the student still hesitates on types, assignment, or `Math.random()` range construction.",
					projectLink: repo("APCS1-Variables-Reference")
				},
				{
					title: "Loops Reference",
					content:
						"Use the loop reference pack for fast remediation on counted iteration before moving into APCS4.",
					projectLink: repo("APCS4-Loops-Reference")
				}
			]
		},
		{
			title: "APCS1 Variables and Input/Output",
			curriculum: [
				{
					title: "Variables, Primitive Types, and Strings",
					content:
						"Teach `int`, `double`, `boolean`, and `String` as the basic vocabulary of Java programs. Students should be able to declare, initialize, print, and update values without syntax friction."
				},
				{
					title: "Scanners, Formatting, and Casting",
					content:
						"Use `Scanner`-based input and explicit casting to make students reason about what the program stores and why an expression evaluates the way it does."
				},
				{
					title: "Core Project: Mad Libs",
					content:
						"Mad Libs is the right first build for APCS1 because it combines variables, strings, scanner input, and formatted output without introducing structural overhead.",
					projectLink: repo("APCS1-Mad-Libs-Template"),
					solutionLink: repo("APCS1-Mad-Libs"),
					mediaLink: media("apcs1-project-1-mad-libs.mp4")
				},
				{
					title: "Barron's Chapter 2 Habit",
					content:
						"Start multiple-choice tracing early. The APCS1 chapter work is mainly about casting, output, and expression evaluation, so students should be able to justify answers line by line."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Rounding It Off",
					content:
						"Use this project to drill casting-based rounding without relying on `Math` helpers.",
					projectLink: repo("APCS1-Rounding-It-Off"),
					mediaLink: media("apcs1-project-2-rounding-it-off.mp4")
				},
				{
					title: "Project: Hospital Survey",
					content:
						"Use this project when students need one more structured pass through typed input, variable naming, and console formatting.",
					projectLink: repo("APCS1-Hospital-Survey"),
					mediaLink: media("apcs1-project-3-hospital-survey.mp4")
				},
				{
					title: "Strings and Printing Reference",
					content:
						"Keep the strings and printing reference nearby for remediation on escape characters, concatenation, and output layout.",
					projectLink: repo("APCS1-Strings-and-Printing-Reference")
				}
			]
		},
		{
			title: "APCS2 Operators",
			curriculum: [
				{
					title: "Arithmetic and Update Operators",
					content:
						"Teach arithmetic expressions, operator precedence, `%`, and update patterns like `+=`, `++`, and `--` as the basic mechanics for manipulating numeric state."
				},
				{
					title: "Relational and Logical Operators",
					content:
						"Students should be able to evaluate compound boolean expressions exactly, including short-circuit behavior and correct `String` equality with `.equals()`."
				},
				{
					title: "Core Project: Verifying Expressions",
					content:
						"Use the verified starter-and-solution pair for expression tracing and boolean reasoning instead of the original Replit-only workflow.",
					projectLink: repo("APCS2-Verifying-Expressions-Starter"),
					solutionLink: repo("APCS2-Verifying-Expressions")
				},
				{
					title: "Chapter 2 Multiple Choice Focus",
					content:
						"Barron's Chapter 2 work belongs here because this is where students learn to justify integer division, casting, precedence, and boolean logic without running code."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Quotient and Remainder",
					content:
						"Use this build to reinforce integer division and remainder reasoning without hiding behind the modulus operator.",
					projectLink: repo("APCS2-Quotient-and-Remainder"),
					mediaLink: media(
						"apcs2-project-1-quotient-and-remainder.mp4"
					)
				},
				{
					title: "Project: Too Chicken to Cross the Road",
					content:
						"Use the boolean-only version first so students learn to encode logic cleanly before adding conditionals in APCS3.",
					projectLink: repo("APCS2-Too-Chicken-To-Cross-The-Road"),
					mediaLink: media(
						"apcs2-project-3-too-chicken-to-cross-the-road.mp4"
					)
				},
				{
					title: "Project: Two in One",
					content:
						"Use this one-line boolean exercise to force concise reasoning about relationships between values.",
					projectLink: repo("APCS2-Two-In-One"),
					mediaLink: media("apcs2-project-4-two-in-one.mp4")
				}
			]
		},
		{
			title: "APCS3 Conditionals and Packages",
			curriculum: [
				{
					title: "Conditionals, Scope, and Nesting",
					content:
						"Teach `if`, `else if`, and `else` as precise control-flow tools. Students should be able to explain which branch runs and why, especially in nested cases."
				},
				{
					title: "Packages, Math, and Randomness",
					content:
						"Introduce package imports, `Math` methods, and `Math.random()` so students can use library code while still tracing their own control flow carefully."
				},
				{
					title: "Core Project: Elevator Warning",
					content:
						"Use Elevator Warning as the cleanest repo-backed APCS3 project for threshold checks, conditionals, and readable output.",
					projectLink: repo("APCS3-Elevator-Warning"),
					mediaLink: media("apcs3-project-3-elevator-warning.mp4")
				},
				{
					title: "Reference Pack",
					content:
						"Keep the conditionals, math-package, and random-number references available as short focused reviews instead of burying those examples inside larger projects.",
					projectLink: repo("APCS3-Conditionals-Reference")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Too Chicken Take Two",
					content:
						"Redo the APCS2 boolean problem with explicit conditionals and nested branches.",
					projectLink: repo("APCS3-Too-Chicken-Take-Two"),
					mediaLink: media("apcs3-project-1-too-chicken-take-two.mp4")
				},
				{
					title: "Reference: Math Package",
					content:
						"Use this repo reference when students need to revisit `abs`, `pow`, `sqrt`, and round-off behavior.",
					projectLink: repo("APCS3-Math-Package-Reference")
				},
				{
					title: "Reference: Random Numbers",
					content:
						"Use this reference to tighten integer-range generation and avoid off-by-one mistakes with `Math.random()`.",
					projectLink: repo("APCS3-Random-Numbers-Reference")
				},
				{
					title: "Project: Math Demo",
					content:
						"The source course used a Replit math demo; the repo-backed counterpart is the `APCS3-Math-Fun` project and should be used instead.",
					projectLink: repo("APCS3-Math-Fun"),
					mediaLink: media("apcs3-project-2-math-demo.mp4")
				}
			]
		},
		{
			title: "APCS4 Loops and Exceptions",
			curriculum: [
				{
					title: "For Loops, While Loops, and Infinite Loop Risk",
					content:
						"Teach counted loops and condition-driven loops as separate tools with separate failure modes. Students should know when a loop terminates and what state changes make that possible."
				},
				{
					title: "Nested Loops and Early Exception Reasoning",
					content:
						"Use nested loops for patterns and tables, then connect loop correctness to common runtime errors like bounds issues and arithmetic mistakes."
				},
				{
					title: "Core Project: Translating Loops",
					content:
						"Use the verified starter-and-solution pair for translating between `for` and `while` forms while preserving exact behavior.",
					projectLink: repo("APCS4-Translating-Loops-Starter"),
					solutionLink: repo("APCS4-Translating-Loops"),
					mediaLink: media("apcs4-project-2-translating-loops.mp4")
				},
				{
					title: "Loop Reference Pack",
					content:
						"Keep the loop references available for targeted review on tracing, nested iteration, and pattern generation.",
					projectLink: repo("APCS4-Loops-Reference")
				}
			],
			supplementalProjects: [
				{
					title: "Project: For Loop Practice",
					content:
						"Use this project to reinforce counted iteration, accumulators, and output-driven tracing.",
					projectLink: repo("APCS4-For-Loop-Practice"),
					mediaLink: media("apcs4-project-1-for-loops-practice.mp4")
				},
				{
					title: "Project: While Loop and Nested Loop Practice",
					content:
						"Use this mixed practice set to drill while-loop termination and nested iteration on structured output problems.",
					projectLink: repo(
						"APCS4-While-Loop-and-Nested-Loop-Practice"
					),
					mediaLink: media(
						"apcs4-project-3-while-loop-and-nested-loop-practice.mp4"
					)
				},
				{
					title: "Reference: While Loops and Nested Loops",
					content:
						"Use the reference pack when students need one more clean example of nested iteration before arrays arrive.",
					projectLink: repo(
						"APCS4-While-Loops-and-Nested-Loops-Reference"
					)
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Use Check-In #2 to review class construction, methods, inheritance vocabulary, access control, and `this` before the course moves into the heavier object-oriented sequence."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The check-in concentrates on class definitions, constructors, accessor and mutator methods, static members, inheritance, overriding, and `super`."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"Use the GitHub-backed prompt bank for the full Check-In #2 review instead of the original Replit link.",
					projectLink: repo("APCS-Check-in-2")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Animal Kingdom",
					content:
						"Use the taxonomy inheritance project after the check-in when the student needs one more structured inheritance build.",
					projectLink: repo(
						"APCS-Check-in-2-Additional-Practice-Project"
					)
				},
				{
					title: "Class Example",
					content:
						"Use this short class example when constructor syntax or instance variables still feel shaky.",
					projectLink: repo("APCS5-Class-Example")
				},
				{
					title: "This Reference",
					content:
						"Use the `this` reference pack when students can write a constructor but still cannot explain why `this.field` matters.",
					projectLink: repo("APCS6-This-Reference")
				}
			]
		},
		{
			title: "APCS5 Classes Part I",
			curriculum: [
				{
					title: "Classes, Fields, and Constructors",
					content:
						"Start the object sequence by focusing on how a class groups state and behavior. Students should be able to name what belongs as an instance variable and what belongs in a method."
				},
				{
					title: "Accessors, Mutators, and Method Practice",
					content:
						"Use short object builds to make getters, setters, parameters, return values, and `this` references concrete."
				},
				{
					title: "Core Project: Student Class",
					content:
						"Use the student-class build as the main APCS5 implementation checkpoint because it is a clean class-with-state project from the source sequence.",
					projectLink: repo("APCS5-Student-Class"),
					mediaLink: media("apcs5-project-2-student-class.mp4")
				},
				{
					title: "Free Response Prep",
					content:
						"Start free-response style writing here so students can explain how a small class should behave before inheritance and polymorphism raise the difficulty.",
					projectLink: repo("APCS5-Free-Response-Practice")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Method Practice",
					content:
						"Use the APCS5 method-practice project for short parameter and return-value reps.",
					projectLink: repo("APCS5-Practice-with-Methods"),
					mediaLink: media("apcs5-project-1-method-practice.mp4")
				},
				{
					title: "Project: Store Class",
					content:
						"Use Store Class when the student needs another object model with a small but meaningful state transition.",
					projectLink: repo("APCS5-Store-Class"),
					mediaLink: media("apcs5-project-3-store-class.mp4")
				},
				{
					title: "Supplemental: Spreadsheet Width",
					content:
						"Use this supplemental build when a student needs more practice turning a precise method spec into code.",
					projectLink: repo("APCS5-Spreadsheet-Width"),
					mediaLink: media(
						"apcs5-supplemental-project-1-spreadsheet-width.mp4"
					)
				}
			]
		},
		{
			title: "APCS6 Classes Part II",
			curriculum: [
				{
					title: "State Mutation and Reference Semantics",
					content:
						"Continue class work by making students reason about object references, side effects, and how methods mutate encapsulated state."
				},
				{
					title: "Getters, Setters, `this`, and Primitive vs. Reference",
					content:
						"Use the APCS6 reference packs to distinguish field access, parameter shadowing, and the difference between primitive copies and object references."
				},
				{
					title: "Core Project: Vending Machine Class",
					content:
						"Use the vending-machine project as the main APCS6 build because it exercises constructors, fields, controlled mutation, and method design in one compact model.",
					projectLink: repo("APCS6-Vending-Machine-Class"),
					mediaLink: media(
						"apcs6-project-1-vending-machine-class.mp4"
					)
				},
				{
					title: "Free Response and Multiple Choice Support",
					content:
						"Keep the APCS6 free-response and multiple-choice references available here because this is where students start making subtle object-state mistakes.",
					projectLink: repo("APCS6-Free-Response-Practice")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Bank Account Class",
					content:
						"Use the bank-account build for clean state transitions, deposits, withdrawals, and invariant thinking.",
					projectLink: repo("APCS6-Bank-Account-Class"),
					mediaLink: media("apcs6-project-2-bank-account-class.mp4")
				},
				{
					title: "Project: Farm Class",
					content:
						"Use the starter-and-solution pair when the student needs one more class-based build with simpler domain language.",
					projectLink: repo("APCS6-Farm-Class-Starter"),
					solutionLink: repo("APCS6-Farm-Class"),
					mediaLink: media("apcs6-project-1-farm-class.mp4")
				},
				{
					title: "Reference: Getters and Setters",
					content:
						"Use this reference for direct remediation on controlled access patterns and field updates.",
					projectLink: repo("APCS6-Getters-and-Setters-Reference")
				}
			]
		},
		{
			title: "APCS7 Inheritance",
			curriculum: [
				{
					title: "Superclass and Subclass Design",
					content:
						"Teach inheritance as a way to capture shared state and behavior without copy-pasting class logic. Students should be able to justify why a subclass relationship is appropriate."
				},
				{
					title: "Constructors, `super`, and Overriding",
					content:
						"Make constructor chaining and method overriding explicit. Students should know what gets inherited, what gets customized, and when `super(...)` is required."
				},
				{
					title: "Core Project: Book and PictureBook Class",
					content:
						"Use Book and PictureBook Class as the main APCS7 build because it maps directly to the source module and keeps the inheritance tree readable.",
					projectLink: repo("APCS7-Books-and-Picture-Books"),
					mediaLink: media(
						"apcs7-project-4-book-and-picturebook-class.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Pet Class",
					content:
						"Use the pet-class build for the first inheritance pass before expanding the class family further.",
					projectLink: repo("APCS7-Pets"),
					mediaLink: media("apcs7-project-1-pet-class.mp4")
				},
				{
					title: "Project: More Pets",
					content:
						"Use the extended pets build for a second inheritance pass with more subclasses and behavior to compare.",
					projectLink: repo("APCS7-Pets"),
					mediaLink: media("apcs7-project-2-more-pets.mp4")
				},
				{
					title: "Project: Pet Special Methods",
					content:
						"Use the later pet build to focus on overridden object methods and more specialized subclass behavior.",
					projectLink: repo("APCS7-Dogs"),
					mediaLink: media("apcs7-project-3-pet-special-methods.mp4")
				},
				{
					title: "Multiple Choice Reference",
					content:
						"Use the APCS7 multiple-choice reference to reinforce inheritance vocabulary and trace reasoning.",
					projectLink: repo("APCS7-Multiple-Choice-Reference")
				}
			]
		},
		{
			title: "APCS8 Polymorphism",
			curriculum: [
				{
					title: "Superclass References and Dynamic Dispatch",
					content:
						"Teach polymorphism as the combination of shared method contracts and runtime method selection based on the actual object type."
				},
				{
					title: "Type Reasoning and Invalid Calls",
					content:
						"Students should be able to explain which method runs, which calls fail at compile time, and why a reference type constrains what members are visible."
				},
				{
					title: "Core Project: Many Shapes",
					content:
						"Use the verified starter-and-solution pair for the Many Shapes project because it mirrors the source module's polymorphism focus directly.",
					projectLink: repo("APCS8-Many-Shapes-Starter"),
					solutionLink: repo("APCS8-Many-Shapes"),
					mediaLink: media("apcs8-project-1-many-shapes.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Polymorphism Reference",
					content:
						"Use the reference pack for short, explicit examples of superclass references and overridden methods.",
					projectLink: repo("APCS8-Polymorphism-Reference")
				},
				{
					title: "Multiple Choice Reference",
					content:
						"Use the APCS8 multiple-choice reference when students can code a polymorphic model but still struggle to trace one.",
					projectLink: repo("APCS8-Multiple-Choice-Reference")
				}
			]
		},
		{
			title: "Check-In #3",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Use Check-In #3 as cumulative review for polymorphism, software design and lifecycle reasoning, arrays, and ArrayLists before the later AP-heavy units."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The prompt bank emphasizes type reasoning, UML and specification thinking, arrays and matrices, ArrayLists, and one final polymorphism pass."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"Use the GitHub-backed prompt bank for the main Check-In #3 review sequence.",
					projectLink: repo("APCS-Check-in-3")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Letter Shifter",
					content:
						"Use the letter-shifter project to reinforce inheritance, overriding, and character-level string manipulation after the check-in.",
					projectLink: repo(
						"APCS-Check-in-3-Additional-Practice-Project"
					)
				},
				{
					title: "ArrayList Reference",
					content:
						"Use the ArrayList reference pack when the check-in shows mutation or traversal gaps.",
					projectLink: repo("APCS11-Array-List-Reference")
				},
				{
					title: "Multiple Choice Reference",
					content:
						"Use the APCS11 multiple-choice reference here because the check-in's later prompts rely on strong collection tracing.",
					projectLink: repo("APCS11-Multiple-Choice-Reference")
				}
			]
		},
		{
			title: "APCS9 Software Development Lifecycle",
			curriculum: [
				{
					title: "Specifications, Design, and Testability",
					content:
						"Use APCS9 to teach students how to read a spec, identify missing requirements, and design code that can be tested cleanly instead of guessed into existence.",
					mediaLink: media("apcs9-software-development-lifecycle.png")
				},
				{
					title: "Robust Input and Failure Handling",
					content:
						"Strengthen input handling and validation so students stop treating malformed input as a separate concern from core program correctness."
				},
				{
					title: "Core Project: Robust Input Practice",
					content:
						"Use the verified starter-and-solution pair for robust input practice as the main APCS9 implementation checkpoint.",
					projectLink: repo("APCS9-Robust-Input-Practice-Starter"),
					solutionLink: repo("APCS9-Robust-Input-Practice"),
					mediaLink: media(
						"apcs9-project-1-robust-input-practice.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Deck Spec / Specification",
					content:
						"The source module's deck-spec work maps to the repo's specification folder. Use it to practice reading and refining incomplete requirements.",
					projectLink: repo("APCS9-Specification")
				},
				{
					title: "Robust Input Solution Build",
					content:
						"Use the completed robust-input build when the student needs to compare their input-validation structure against a reference implementation.",
					projectLink: repo("APCS9-Robust-Input-Practice")
				}
			]
		},
		{
			title: "APCS10 Arrays",
			curriculum: [
				{
					title: "Arrays, Indexing, and Fixed Size",
					content:
						"Teach one-dimensional arrays as fixed-size ordered collections with constant-time indexed access and strict bounds."
				},
				{
					title: "Pass-by-Reference Effects and 2D Arrays",
					content:
						"Use arrays to show how object references behave in methods, then extend that reasoning into two-dimensional arrays and matrix-style traversal."
				},
				{
					title: "Core Project: Practice With Arrays",
					content:
						"Use the practice-with-arrays project as the main APCS10 implementation checkpoint for traversal, accumulation, and simple array-return methods.",
					projectLink: repo("APCS10-Practice-With-Arrays"),
					mediaLink: media(
						"apcs10-project-1-practice-with-arrays.mp4"
					)
				},
				{
					title: "Array Reference Pack",
					content:
						"Keep the array reference build available for quick remediation on indexing, `.length`, and default values.",
					projectLink: repo("APCS10-Array-Reference")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Random Mad Libs",
					content:
						"Use Random Mad Lib to connect arrays, random indexing, and lightweight string generation.",
					projectLink: repo("APCS10-Random-Mad-Lib"),
					mediaLink: media("apcs10-project-2-random-mad-libs.mp4")
				},
				{
					title: "Project: Practice With Two-Dimensional Arrays",
					content:
						"Use this project for grid traversal, row-and-column reasoning, and nested loops.",
					projectLink: repo(
						"APCS10-Practice-With-Two-Dimensional-Arrays"
					),
					mediaLink: media(
						"apcs10-project-3-practice-with-two-dimensional-array.mp4"
					)
				},
				{
					title: "Project: Matrix Arithmetic",
					content:
						"Use matrix arithmetic when the student is ready for a more structured 2D-array build.",
					projectLink: repo("APCS10-Matrix-Arithmetic"),
					mediaLink: media("apcs10-project-4-matrix-arithmetic.mp4")
				},
				{
					title: "Free Response Practice",
					content:
						"The source module points students at the 2022 AP CS A FRQ set and scoring guidelines for Problem 4. Keep both resources directly linked here.",
					projectLink: AP_2022_FRQ,
					solutionLink: AP_2022_FRQ_SCORING
				}
			]
		},
		{
			title: "APCS11 ArrayLists",
			curriculum: [
				{
					title: "ArrayLists, Wrapper Constraints, and Core Methods",
					content:
						"Teach `ArrayList` as a resizable ordered collection with method-based access, dynamic size, and object-only storage."
				},
				{
					title: "Mutation, Traversal, and Removal Rules",
					content:
						"Students should know when enhanced `for` loops are appropriate, when index-based loops are safer, and why removal during enhanced iteration breaks."
				},
				{
					title: "Core Project: Practice With ArrayLists",
					content:
						"Use the ArrayList practice project as the main APCS11 implementation checkpoint for counting, filtering, mutation, and removal logic.",
					projectLink: repo("APCS11-Practice-With-Array-Lists"),
					mediaLink: media(
						"apcs11-project-1-practice-with-arraylists.mp4"
					)
				},
				{
					title: "ArrayList Reference Pack",
					content:
						"Keep the ArrayList reference build close for method review and quick syntax reinforcement.",
					projectLink: repo("APCS11-Array-List-Reference")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Fortune Teller",
					content:
						"Use FortuneTeller to combine ArrayLists, random selection, and controlled mutation of collection state.",
					projectLink: repo("APCS11-Fortune-Teller-Class"),
					mediaLink: media("apcs11-project-2-fortune-teller.mp4")
				},
				{
					title: "Project: Card Shuffler",
					content:
						"Use the starter-and-solution pair for Card Shuffler to connect objects, ArrayLists, and algorithmic updates in a higher-signal build.",
					projectLink: repo("APCS11-Card-Shuffler-Starter"),
					solutionLink: repo("APCS11-Card-Shuffler"),
					mediaLink: media("apcs11-project-3-card-shuffler.mp4")
				},
				{
					title: "Free Response Practice",
					content:
						"Use the APCS11 FRQ practice build to bridge list manipulation and AP free-response expectations.",
					projectLink: repo("APCS11-Free-Response-Practice")
				},
				{
					title: "Card and Deck Classes",
					content:
						"Use the card-and-deck classes as a bridge build when the student needs more object-list modeling before APCS12 and APCS17.",
					projectLink: repo("APCS11-Card-and-Deck-Classes")
				}
			]
		},
		{
			title: "Check-In #4",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Use Check-In #4 as a cumulative review of wrapper classes, runtime analysis, recursion, sorting, and searching before the final AP prep stretch."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The prompt bank emphasizes computational steps, recursive reasoning, sorting traces, search preconditions, and wrapper-class behavior."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"Use the GitHub-backed prompt bank for the full Check-In #4 review sequence.",
					projectLink: repo("APCS-Check-in-4")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Inversion Counting",
					content:
						"Use inversion counting after the check-in when the student needs one more applied problem tying together sorting and runtime ideas.",
					projectLink: repo(
						"APCS-Check-in-4-Additional-Practice-Project"
					)
				},
				{
					title: "Project: Minimum and Maximum",
					content:
						"Use this project as a targeted follow-up when wrapper constants and search initialization still feel abstract.",
					projectLink: repo("APCS12-Minimum-and-Maximum")
				},
				{
					title: "Runtime Analysis Starter",
					content:
						"Use the runtime starter if the check-in shows weak step-counting or loop-cost reasoning.",
					projectLink: repo("APCS13-Runtime-Analysis-Starter"),
					solutionLink: repo("APCS13-Runtime-Analysis")
				}
			]
		},
		{
			title: "APCS12 Wrapper Classes",
			curriculum: [
				{
					title: "Wrapper Types, Autoboxing, and Unboxing",
					content:
						"Teach wrapper classes as the object form of primitive values, with attention to why collections use them and how autoboxing and unboxing hide conversions."
				},
				{
					title: "Static Constants and Search Initialization",
					content:
						"Use `Integer.MIN_VALUE` and `Integer.MAX_VALUE` to teach sane initialization choices for min/max search problems."
				},
				{
					title: "Core Project: Suits, Decks, and Hands",
					content:
						"Use the verified starter-and-solution pair for Suits, Decks, and Hands as the main APCS12 build.",
					projectLink: repo("APCS12-Suit-Deck-and-Hand-Starter"),
					solutionLink: repo("APCS12-Suit-Deck-and-Hand"),
					mediaLink: media(
						"apcs12-project-1-suits-decks-and-hands.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Minimum and Maximum Search",
					content:
						"Use this build to reinforce wrapper constants and collection scanning with boxed integers.",
					projectLink: repo("APCS12-Minimum-and-Maximum"),
					mediaLink: media("apcs12-project-2-minimum-search.mp4")
				},
				{
					title: "Project: Deck Class",
					content:
						"Use Deck Class when the student needs another wrapper-style object around a collection before APCS17.",
					projectLink: repo("APCS12-Deck-Class")
				}
			]
		},
		{
			title: "APCS13 Algorithmic Runtime and Linear Search",
			curriculum: [
				{
					title: "Runtime by Step Counting",
					content:
						"Teach runtime in terms of operations rather than wall-clock time so students can compare algorithms independent of machine speed."
				},
				{
					title: "Best, Average, and Worst Case",
					content:
						"Students should know how to describe runtime across favorable, typical, and unfavorable cases, especially for loops and search tasks."
				},
				{
					title: "Core Project: Runtime Analysis",
					content:
						"Use the verified starter-and-solution pair for runtime analysis as the main APCS13 reasoning checkpoint.",
					projectLink: repo("APCS13-Runtime-Analysis-Starter"),
					solutionLink: repo("APCS13-Runtime-Analysis")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Linear Search Implementation",
					content:
						"Use the linear-search build to compare unsorted search, sorted early exits, and traceable search behavior.",
					projectLink: repo("APCS13-Linear-Search-Implementation"),
					mediaLink: media("apcs13-project-2-linear-search.mp4")
				}
			]
		},
		{
			title: "APCS14 Selection and Insertion Sort",
			curriculum: [
				{
					title: "Selection Sort",
					content:
						"Teach selection sort as the repeated process of finding the next extreme element and moving it into the sorted section."
				},
				{
					title: "Insertion Sort",
					content:
						"Teach insertion sort as repeated local insertion into an already sorted prefix, with special attention to best-case and worst-case inputs."
				},
				{
					title: "Core Project: Selection Sort",
					content:
						"Use the selection-sort build as the main APCS14 checkpoint because it gives students a clean invariant to describe while they code.",
					projectLink: repo("APCS14-Selection-Sort"),
					mediaLink: media("apcs14-project-1-selection-sort.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Insertion Sort",
					content:
						"Use the insertion-sort build to contrast local shifting with global minimum selection.",
					projectLink: repo("APCS14-Insertion-Sort"),
					mediaLink: media("apcs14-project-2-insertion-sort.mp4")
				}
			]
		},
		{
			title: "APCS15 Recursion",
			curriculum: [
				{
					title: "Base Cases, Recursive Steps, and Stack Frames",
					content:
						"Teach recursion by making students name the base case, describe the smaller subproblem, and trace the call stack on paper.",
					mediaLink: media("apcs15-recursion-1.png")
				},
				{
					title: "Stack Overflow and Tail Recursion",
					content:
						"Use the stack-overflow discussion to show why a missing or weak base case is not a minor bug but a structural failure.",
					mediaLink: media("apcs15-recursion-2.png")
				},
				{
					title: "Core Project: Tracing Recursion",
					content:
						"Use the verified starter-and-solution pair for tracing recursion as the main APCS15 reasoning checkpoint.",
					projectLink: repo("APCS15-Tracing-Recursion-Starter"),
					solutionLink: repo("APCS15-Tracing-Recursion")
				},
				{
					title: "Recursion Reference Pack",
					content:
						"Keep the recursion reference available for short examples before assigning the longer practice set.",
					projectLink: repo("APCS15-Recursion-Reference")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Recursion Practice",
					content:
						"Use the full recursion-practice build for factorials, powers, Fibonacci, cascades, and other classic recursive patterns.",
					projectLink: repo("APCS15-Recursion-Practice"),
					mediaLink: media("apcs15-project-2-recursion-practice.mp4")
				},
				{
					title: "Project: Blob Erase",
					content:
						"Use Blob Erase to extend recursion into two-dimensional traversal and backtracking logic.",
					projectLink: repo("APCS15-Blob-Erase"),
					mediaLink: media("apcs15-project-3-blob-erase.mp4")
				},
				{
					title: "Reference: Stack Overflow",
					content:
						"Use this reference when students can write a recursive call but still cannot explain why the recursion stops.",
					projectLink: repo("APCS15-Stack-Overflow-Reference")
				}
			]
		},
		{
			title: "APCS16 Binary Search and Merge Sort",
			curriculum: [
				{
					title: "Binary Search Preconditions",
					content:
						"Teach binary search as a fast search that only works because the data is sorted. Students should be able to explain how each comparison halves the remaining search space."
				},
				{
					title: "Merge Sort and Divide-and-Conquer",
					content:
						"Teach merge sort as recursive splitting followed by deterministic merging of sorted halves. The merge step should be traced explicitly, not hand-waved."
				},
				{
					title: "Core Project: Binary Search",
					content:
						"Use the binary-search build for both iterative and recursive search structure.",
					projectLink: repo("APCS16-Binary-Search"),
					mediaLink: media("apcs16-project-1-binary-search.mp4")
				},
				{
					title: "Merge Step Visual",
					content:
						"Use the merge visual together with the repo merge-sort project so students can separate the recursive split from the actual merge operation.",
					projectLink: repo("APCS16-Merge-Sort"),
					mediaLink: media("am_10_merge.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Merge Sort",
					content:
						"Use the merge-sort build for the full divide-and-conquer implementation after students understand the merge step itself.",
					projectLink: repo("APCS16-Merge-Sort"),
					mediaLink: media("apcs16-project-2-merge-sort.mp4")
				}
			]
		},
		{
			title: "APCS17 Master Projects and Test Prep",
			curriculum: [
				{
					title: "Practice Exam and FRQ Rhythm",
					content:
						"Reserve full practice exams for timed work and use past FRQs throughout the final stretch so students normalize tracing, partial credit thinking, and time management."
				},
				{
					title: "Next Course Positioning",
					content:
						"Use the end of the course to direct students toward the right next step: more advanced Java, C++, Python Level 2, or USACO depending on readiness and goals."
				},
				{
					title: "Core Project: Spaceships",
					content:
						"Use Spaceships as the first full capstone because it pulls together classes, collections, add/remove methods, and `toString()` design in one larger build.",
					projectLink: repo("APCS17-Spaceships"),
					mediaLink: media("apcs17-master-project-1-spaceships.mp4")
				},
				{
					title: "Past FRQ Archive",
					content:
						"Keep the official College Board FRQ archive available throughout APCS17 so students can cycle through multiple years of real prompts.",
					projectLink: AP_FRQ_ARCHIVE
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Elevens",
					content:
						"Use Elevens as the card-game capstone for students who want more stateful gameplay logic and collection updates.",
					projectLink: repo("APCS17-Elevens"),
					mediaLink: media("apcs17-master-project-2-elevens.mp4")
				},
				{
					title: "Master Project: Decode",
					content:
						"Use Decode as the lighter-weight string and object capstone built around encode/decode behavior and paired tower logic.",
					projectLink: repo("APCS17-Decode"),
					mediaLink: media("apcs17-master-project-3-decode.mp4")
				},
				{
					title: "2022 FRQ and Scoring Guidelines",
					content:
						"Use the 2022 AP CS A FRQ set and official scoring guidelines for timed practice and post-run scoring conversations.",
					projectLink: AP_2022_FRQ,
					solutionLink: AP_2022_FRQ_SCORING
				},
				{
					title: "2020 Repo Practice Exam",
					content:
						"Keep the repo-backed practice exam available as an additional full-run benchmark.",
					projectLink: repo("APCS-A-2020-Practice-Exam")
				}
			]
		}
	]
};
