import type { RawCourse } from "./types";
import { buildProjectGuidance } from "./projectGuidance";

export const rustSystemsSecurityCourse: RawCourse = {
	name: "Rust Systems Security",
	modules: [
		{
			title: "RSS0 Tooling, Cargo, and Why Rust Exists",
			curriculum: [
				{
					title: "Rustup, Cargo, rustfmt, and Clippy",
					content:
						"Standardize the workflow around `rustup`, `cargo`, `rustfmt`, and `clippy`. Feel that the Rust toolchain is part of the security story because it makes structured feedback, repeatable builds, and static analysis normal."
				},
				{
					title: "The Comparative Framing",
					content:
						"Frame the course around specific low-level bug classes from C and C++: dangling pointers, double frees, unchecked indexing, null-like misuse, error-code drift, and race conditions. Every Rust concept should answer what changes about those risks."
				},
				{
					title: "Compiler Guidance as an Engineering Tool",
					content:
						"Visible pattern: The compiler as a collaborator that narrows unsafe states early. The goal is not blind obedience to borrow-checker rules; it is understanding the engineering reason those rules exist."
				},
				{
					title: "Tooling, Cargo, and Why Rust Exists: Verification and Reflection",
					content:
						"Finish RSS0 Tooling, Cargo, and Why Rust Exists with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS0 Tooling, Cargo, and Why Rust Exists: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS0 Tooling, Cargo, and Why Rust Exists",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: First Cargo Audit CLI",
					content:
						"Set up a small Cargo-based CLI and use it to compare a clean Rust workspace with a fragile manual C/C++ build loop.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/solution"
				},
				{
					title: "Tooling, Cargo, and Why Rust Exists Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS0 Tooling, Cargo, and Why Rust Exists",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/solution"
				},
				{
					title: "Tooling, Cargo, and Why Rust Exists Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS0 Tooling, Cargo, and Why Rust Exists",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rss0-tooling-cargo-and-why-rust-exists-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rss0-tooling-cargo-and-why-rust-exists-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS1 Ownership, Moves, and Memory Responsibility",
			curriculum: [
				{
					title: "Single Ownership as a Memory Rule",
					content:
						"This section covers ownership as one clear owner for a resource at a time. Compare it directly to the kinds of ambiguous cleanup responsibility that lead to double free or use-after-free bugs in C and C++."
				},
				{
					title: "Moves, Copies, and Clone",
					content:
						"Distinguish cheap copy semantics for simple values from ownership-moving semantics for heap-backed data. This distinction is central to understanding why Rust prevents some accidental aliasing patterns."
				},
				{
					title: "Drop Timing and Scope",
					content:
						"Explain how values are cleaned up when they leave scope and why that makes resource lifetime more explicit than in manual-memory designs."
				},
				{
					title: "Ownership, Moves, and Memory Responsibility: Verification and Reflection",
					content:
						"Finish RSS1 Ownership, Moves, and Memory Responsibility with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS1 Ownership, Moves, and Memory Responsibility: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS1 Ownership, Moves, and Memory Responsibility",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Ownership and Move Tracer",
					content:
						"Build a small CLI that moves strings, vectors, and structs through helper functions so students can see when ownership transfers and when values must be cloned.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/solution"
				},
				{
					title: "Ownership, Moves, and Memory Responsibility Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS1 Ownership, Moves, and Memory Responsibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/solution"
				},
				{
					title: "Ownership, Moves, and Memory Responsibility Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS1 Ownership, Moves, and Memory Responsibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rss1-ownership-moves-and-memory-responsibility-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rss1-ownership-moves-and-memory-responsibility-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS2 Borrowing, Aliasing, and Lifetimes",
			curriculum: [
				{
					title: "Shared vs. Mutable Borrowing",
					content:
						"This section covers Rust's borrowing rules as a way to limit ambiguous mutation and observation. Connect this to the kinds of aliasing bugs that become hard to reason about in larger C/C++ systems."
				},
				{
					title: "Lifetime Reasoning without Mysticism",
					content:
						"Introduce lifetime thinking through scope relationships first and explicit annotations second. The goal is practical reasoning about which reference can safely outlive which value."
				},
				{
					title: "Why Borrow Checking Matters for Security",
					content:
						"Make the security angle explicit: a compiler that rejects dangling references or conflicting mutable access is removing a meaningful class of memory safety hazards before runtime."
				},
				{
					title: "Borrowing, Aliasing, and Lifetimes: Verification and Reflection",
					content:
						"Finish RSS2 Borrowing, Aliasing, and Lifetimes with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS2 Borrowing, Aliasing, and Lifetimes: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS2 Borrowing, Aliasing, and Lifetimes",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Borrowing and Aliasing Lab",
					content:
						"Refactor a small parser or buffer-manipulation exercise until it satisfies Rust's borrowing model without cloning away the real ownership story.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/solution"
				},
				{
					title: "Borrowing, Aliasing, and Lifetimes Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS2 Borrowing, Aliasing, and Lifetimes",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/solution"
				},
				{
					title: "Borrowing, Aliasing, and Lifetimes Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS2 Borrowing, Aliasing, and Lifetimes",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rss2-borrowing-aliasing-and-lifetimes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rss2-borrowing-aliasing-and-lifetimes-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS3 Option, Result, and Typed Error Paths",
			curriculum: [
				{
					title: "Option instead of Null-like Conventions",
					content:
						"Use `Option` to replace sentinel returns and nullable conventions. Feel why absence modeled in the type system is safer than absence hidden in documentation or magic values."
				},
				{
					title: "Result, Match, and the Question-Mark Operator",
					content:
						"This section covers `Result` as a typed alternative to error-code conventions. Pattern matching and `?` should feel like a disciplined error-propagation style, not just new syntax."
				},
				{
					title: "Error Handling and Security Posture",
					content:
						"Connect Rust's typed failure paths to safer parsing and validation. A system is easier to secure when failure states are explicit and hard to ignore."
				},
				{
					title: "Option, Result, and Typed Error Paths: Verification and Reflection",
					content:
						"Finish RSS3 Option, Result, and Typed Error Paths with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS3 Option, Result, and Typed Error Paths: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS3 Option, Result, and Typed Error Paths",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Option and Result Audit Tool",
					content:
						"Build a small input-validation or config-parsing tool that uses `Option`, `Result`, and `?` instead of ad hoc null checks or integer status flags.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/solution"
				},
				{
					title: "Option, Result, and Typed Error Paths Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS3 Option, Result, and Typed Error Paths",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/solution"
				},
				{
					title: "Option, Result, and Typed Error Paths Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS3 Option, Result, and Typed Error Paths",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-08-rss3-option-result-and-typed-error-paths-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-08-rss3-option-result-and-typed-error-paths-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS4 Strings, Slices, Collections, and Bounds Safety",
			curriculum: [
				{
					title: "String, str, Vec, and Slice Differences",
					content:
						"This section covers owned strings, borrowed string slices, vectors, arrays, and slices as distinct tools rather than one generic container idea. Key idea: Which operations are cheap views and which allocate or move ownership."
				},
				{
					title: "Indexing, Iteration, and Safer Access Patterns",
					content:
						"Compare unchecked indexing habits from C/C++ with safer iteration and checked access in Rust. This is one of the clearest places where the language meaningfully narrows common memory-safety mistakes."
				},
				{
					title: "Parser-Facing Safety",
					content:
						"Use small parser examples so bounds safety feels like a real systems concern rather than a toy rule."
				},
				{
					title: "Strings, Slices, Collections, and Bounds Safety: Verification and Reflection",
					content:
						"Finish RSS4 Strings, Slices, Collections, and Bounds Safety with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS4 Strings, Slices, Collections, and Bounds Safety: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS4 Strings, Slices, Collections, and Bounds Safety",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Slice and Bounds Workbench",
					content:
						"Implement a byte-buffer or log-slice utility that compares safe slicing patterns with the kinds of off-by-one and unchecked indexing bugs students already know from low-level work.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/solution"
				},
				{
					title: "Strings, Slices, Collections, and Bounds Safety Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS4 Strings, Slices, Collections, and Bounds Safety",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/solution"
				},
				{
					title: "Strings, Slices, Collections, and Bounds Safety Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS4 Strings, Slices, Collections, and Bounds Safety",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-10-rss4-strings-slices-collections-and-bounds-safety-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-10-rss4-strings-slices-collections-and-bounds-safety-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS5 Structs, Enums, and Safer State Models",
			curriculum: [
				{
					title: "Structs for Explicit Data Modeling",
					content:
						"Use structs to make ownership, state, and transitions visible. Good modeling reduces security bugs because it narrows the number of half-valid states code can represent."
				},
				{
					title: "Enums and Impossible States",
					content:
						"Compare tagged enums and pattern matching to ad hoc integer codes, booleans, or loosely coordinated fields. Rust shines when a type can make impossible states unrepresentable."
				},
				{
					title: "Pattern Matching as Validation",
					content:
						"This section covers `match` not just as syntax, but as a way to force complete reasoning across every state the program can inhabit."
				},
				{
					title: "Structs, Enums, and Safer State Models: Verification and Reflection",
					content:
						"Finish RSS5 Structs, Enums, and Safer State Models with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS5 Structs, Enums, and Safer State Models: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS5 Structs, Enums, and Safer State Models",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: State Machine Refactor",
					content:
						"Refactor a fragile status-code workflow into structs and enums so the compiler helps enforce legal transitions.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/solution"
				},
				{
					title: "Structs, Enums, and Safer State Models Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS5 Structs, Enums, and Safer State Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/solution"
				},
				{
					title: "Structs, Enums, and Safer State Models Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS5 Structs, Enums, and Safer State Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-12-rss5-structs-enums-and-safer-state-models-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-12-rss5-structs-enums-and-safer-state-models-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS6 Traits, Iterators, and API Contracts",
			curriculum: [
				{
					title: "Traits as Behavior Contracts",
					content:
						"This section covers traits as explicit contracts for reusable behavior. Compare them with interfaces, abstract classes, or virtual methods without losing the Rust-specific emphasis on disciplined composition."
				},
				{
					title: "Iterator Safety vs. Invalidation Risk",
					content:
						"Use iterators and collection transforms to explain why Rust makes it harder to mutate collections in unsafe ways while traversing them."
				},
				{
					title: "Secure API Boundaries",
					content:
						"Good trait and iterator design can reduce misuse by forcing callers into safer shapes. This matters for security-sensitive code because APIs are part of the attack surface."
				},
				{
					title: "Traits, Iterators, and API Contracts: Verification and Reflection",
					content:
						"Finish RSS6 Traits, Iterators, and API Contracts with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS6 Traits, Iterators, and API Contracts: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS6 Traits, Iterators, and API Contracts",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Trait-Based Validation Pipeline",
					content:
						"Build a multi-step validation pipeline with traits and iterator-based transforms so the work can compare clean contracts with ad hoc callback spaghetti.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/solution"
				},
				{
					title: "Traits, Iterators, and API Contracts Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS6 Traits, Iterators, and API Contracts",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/solution"
				},
				{
					title: "Traits, Iterators, and API Contracts Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS6 Traits, Iterators, and API Contracts",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-14-rss6-traits-iterators-and-api-contracts-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-14-rss6-traits-iterators-and-api-contracts-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS7 Files, Parsers, and Secure CLI Design",
			curriculum: [
				{
					title: "File I/O and Parser Discipline",
					content:
						"This section covers parsing as a systems task where small unchecked assumptions cause real bugs. Use Rust's file APIs and typed error model to build safer parse-and-validate workflows."
				},
				{
					title: "Input Validation and Trust Boundaries",
					content:
						"Make untrusted input a first-class theme. Identify where the CLI receives external data and what validation or normalization happens before it is trusted."
				},
				{
					title: "Security Logging and Failure Visibility",
					content:
						"Show how structured errors and explicit validation failures make later debugging and auditing easier."
				},
				{
					title: "Files, Parsers, and Secure CLI Design: Verification and Reflection",
					content:
						"Finish RSS7 Files, Parsers, and Secure CLI Design with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS7 Files, Parsers, and Secure CLI Design: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS7 Files, Parsers, and Secure CLI Design",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Secure CLI Audit Tool",
					content:
						"Build a small CLI that parses a log or config file, validates each record, and reports trustworthy failures instead of crashing or silently accepting malformed input.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/solution"
				},
				{
					title: "Files, Parsers, and Secure CLI Design Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS7 Files, Parsers, and Secure CLI Design",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/solution"
				},
				{
					title: "Files, Parsers, and Secure CLI Design Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS7 Files, Parsers, and Secure CLI Design",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-16-rss7-files-parsers-and-secure-cli-design-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-16-rss7-files-parsers-and-secure-cli-design-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS8 Concurrency and Race Reduction",
			curriculum: [
				{
					title: "Threads, Channels, and Shared State",
					content:
						"Introduce Rust concurrency with the same comparative posture as earlier units. Visible pattern: Where Rust's ownership and trait rules make it harder to create unsafe shared-state patterns."
				},
				{
					title: "Data Races vs. Logic Races",
					content:
						"Be honest about the boundary: Rust removes many memory-safety race problems, but it does not eliminate higher-level logic races or bad protocol design."
				},
				{
					title: "Choosing Channels or Shared Structures",
					content:
						"Compare message-passing and shared-state approaches so students can reason about design tradeoffs instead of applying concurrency tools blindly."
				},
				{
					title: "Concurrency and Race Reduction: Verification and Reflection",
					content:
						"Finish RSS8 Concurrency and Race Reduction with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS8 Concurrency and Race Reduction: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS8 Concurrency and Race Reduction",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Threads and Channels Monitor",
					content:
						"Build a small concurrent monitor that compares message passing with shared mutable state and highlights how Rust narrows unsafe race patterns.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/solution"
				},
				{
					title: "Concurrency and Race Reduction Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS8 Concurrency and Race Reduction",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/solution"
				},
				{
					title: "Concurrency and Race Reduction Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS8 Concurrency and Race Reduction",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-18-rss8-concurrency-and-race-reduction-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-18-rss8-concurrency-and-race-reduction-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS9 Unsafe, FFI, and Trusted Boundaries",
			curriculum: [
				{
					title: "What Unsafe Actually Means",
					content:
						"This section covers `unsafe` as a narrow escape hatch, not a forbidden magic zone. Learn which guarantees the compiler stops checking and why that creates a smaller trusted computing boundary that must be justified carefully."
				},
				{
					title: "FFI as a Real-World Boundary",
					content:
						"Use FFI examples to show where Rust still depends on external correctness and where unsafety can re-enter the system through other languages or libraries."
				},
				{
					title: "Auditing Unsafe Blocks",
					content:
						"Include comments and reasoning around every unsafe block so each one is treated as an audit target."
				},
				{
					title: "Unsafe, FFI, and Trusted Boundaries: Verification and Reflection",
					content:
						"Finish RSS9 Unsafe, FFI, and Trusted Boundaries with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS9 Unsafe, FFI, and Trusted Boundaries: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS9 Unsafe, FFI, and Trusted Boundaries",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Unsafe and FFI Boundary Review",
					content:
						"Wrap a tiny unsafe or FFI-facing boundary with documented invariants so the student practices narrowing and auditing trust assumptions.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/solution"
				},
				{
					title: "Unsafe, FFI, and Trusted Boundaries Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS9 Unsafe, FFI, and Trusted Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/solution"
				},
				{
					title: "Unsafe, FFI, and Trusted Boundaries Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS9 Unsafe, FFI, and Trusted Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-20-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-20-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS10 Capstone: Harden a Legacy Tool",
			curriculum: [
				{
					title: "Port or Harden with a Clear Threat Model",
					content:
						"Choose a small legacy C or C++-style tool and define what can go wrong: parsing bugs, unchecked buffers, confusing state, weak error handling, or brittle ownership. The capstone should compare the old design with the Rust rewrite or hardening pass explicitly."
				},
				{
					title: "Document What Rust Improved and What It Did Not",
					content:
						"The final reflection should be technically honest. Rust meaningfully reduces memory-safety and API-misuse risk in many cases, but logic flaws, insecure protocol assumptions, and weak threat models can still survive the port."
				},
				{
					title: "Prepare for Systems, Security, or Compiler Follow-On Work",
					content:
						"Close by positioning the course as a launch point for deeper systems, networking, low-level security, or language tooling work where the student now has a sharper mental model of safe systems design."
				},
				{
					title: "Capstone: Harden a Legacy Tool: Verification and Reflection",
					content:
						"Finish RSS10 Capstone: Harden a Legacy Tool with a concise review of the required output, one alternate approach, and one specific improvement for a later revision."
				},
				{
					title: "RSS10 Capstone: Harden a Legacy Tool: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS10 Capstone: Harden a Legacy Tool",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Harden a Legacy Tool",
					content:
						"Complete a larger audit-and-port capstone where the student documents the old bug classes, the Rust redesign, the remaining risks, and the final testing evidence.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/solution"
				},
				{
					title: "Capstone: Harden a Legacy Tool Supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS10 Capstone: Harden a Legacy Tool",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/solution"
				},
				{
					title: "Capstone: Harden a Legacy Tool Supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS10 Capstone: Harden a Legacy Tool",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-22-rss10-capstone-harden-a-legacy-tool-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-22-rss10-capstone-harden-a-legacy-tool-supplemental-3/solution"
				}
			]
		}
	]
};
