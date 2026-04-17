import type { RawCourse } from "./types";

export const rustSystemsSecurityCourse: RawCourse = {
	name: "Rust Systems Security",
	modules: [
		{
			title: "RSS0 Tooling, Cargo, and Why Rust Exists",
			curriculum: [
				{
					title: "Rustup, Cargo, rustfmt, and Clippy",
					content:
						"Standardize the workflow around `rustup`, `cargo`, `rustfmt`, and `clippy`. Students should feel that the Rust toolchain is part of the security story because it makes structured feedback, repeatable builds, and static analysis normal."
				},
				{
					title: "The Comparative Framing",
					content:
						"Frame the course around specific low-level bug classes from C and C++: dangling pointers, double frees, unchecked indexing, null-like misuse, error-code drift, and race conditions. Every Rust concept should answer what changes about those risks."
				},
				{
					title: "Compiler Guidance as an Engineering Tool",
					content:
						"Students should see the compiler as a collaborator that narrows unsafe states early. The goal is not blind obedience to borrow-checker rules; it is understanding the engineering reason those rules exist."
				},
				{
					title: "Tooling, Cargo, and Why Rust Exists: Verification and Reflection",
					content:
						"Close RSS0 Tooling, Cargo, and Why Rust Exists by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "RSS0 Tooling, Cargo, and Why Rust Exists: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS1-Ownership-and-Moves/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS1-Ownership-and-Moves/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: First Cargo Audit CLI",
					content:
						"Set up a small Cargo-based CLI and use it to compare a clean Rust workspace with a fragile manual C/C++ build loop. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS1-Ownership-and-Moves/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS1-Ownership-and-Moves/solution"
				},
				{
					title: "Tooling, Cargo, and Why Rust Exists supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS0 Tooling, Cargo, and Why Rust Exists. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemen/solution"
				},
				{
					title: "Tooling, Cargo, and Why Rust Exists supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS0 Tooling, Cargo, and Why Rust Exists. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rss0-tooling-cargo-and-why-rust-exists-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rss0-tooling-cargo-and-why-rust-exists-supplemen/solution"
				}
			]
		},
		{
			title: "RSS1 Ownership, Moves, and Memory Responsibility",
			curriculum: [
				{
					title: "Single Ownership as a Memory Rule",
					content:
						"Teach ownership as one clear owner for a resource at a time. Compare it directly to the kinds of ambiguous cleanup responsibility that lead to double free or use-after-free bugs in C and C++."
				},
				{
					title: "Moves, Copies, and Clone",
					content:
						"Make students distinguish cheap copy semantics for simple values from ownership-moving semantics for heap-backed data. This distinction is central to understanding why Rust prevents some accidental aliasing patterns."
				},
				{
					title: "Drop Timing and Scope",
					content:
						"Explain how values are cleaned up when they leave scope and why that makes resource lifetime more explicit than in manual-memory designs. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Ownership, Moves, and Memory Responsibility: Verification and Reflection",
					content:
						"Close RSS1 Ownership, Moves, and Memory Responsibility by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "RSS1 Ownership, Moves, and Memory Responsibility: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS1-Ownership-and-Moves/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS1-Ownership-and-Moves/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Ownership and Move Tracer",
					content:
						"Build a small CLI that moves strings, vectors, and structs through helper functions so students can see when ownership transfers and when values must be cloned. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS1-Ownership-and-Moves/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS1-Ownership-and-Moves/solution"
				},
				{
					title: "Ownership, Moves, and Memory Responsibility supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS1 Ownership, Moves, and Memory Responsibility. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-s/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-s/solution"
				},
				{
					title: "Ownership, Moves, and Memory Responsibility supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS1 Ownership, Moves, and Memory Responsibility. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rss1-ownership-moves-and-memory-responsibility-s/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rss1-ownership-moves-and-memory-responsibility-s/solution"
				}
			]
		},
		{
			title: "RSS2 Borrowing, Aliasing, and Lifetimes",
			curriculum: [
				{
					title: "Shared vs. Mutable Borrowing",
					content:
						"Teach Rust's borrowing rules as a way to limit ambiguous mutation and observation. Students should connect this to the kinds of aliasing bugs that become hard to reason about in larger C/C++ systems."
				},
				{
					title: "Lifetime Reasoning without Mysticism",
					content:
						"Introduce lifetime thinking through scope relationships first and explicit annotations second. The goal is practical reasoning about which reference can safely outlive which value. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Why Borrow Checking Matters for Security",
					content:
						"Make the security angle explicit: a compiler that rejects dangling references or conflicting mutable access is removing a meaningful class of memory safety hazards before runtime. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Borrowing, Aliasing, and Lifetimes: Verification and Reflection",
					content:
						"Close RSS2 Borrowing, Aliasing, and Lifetimes by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "RSS2 Borrowing, Aliasing, and Lifetimes: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS2-Borrowing-and-Aliasing/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS2-Borrowing-and-Aliasing/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Borrowing and Aliasing Lab",
					content:
						"Refactor a small parser or buffer-manipulation exercise until it satisfies Rust's borrowing model without cloning away the real ownership story. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS2-Borrowing-and-Aliasing/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS2-Borrowing-and-Aliasing/solution"
				},
				{
					title: "Borrowing, Aliasing, and Lifetimes supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS2 Borrowing, Aliasing, and Lifetimes. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplement/solution"
				},
				{
					title: "Borrowing, Aliasing, and Lifetimes supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS2 Borrowing, Aliasing, and Lifetimes. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rss2-borrowing-aliasing-and-lifetimes-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rss2-borrowing-aliasing-and-lifetimes-supplement/solution"
				}
			]
		},
		{
			title: "RSS3 Option, Result, and Typed Error Paths",
			curriculum: [
				{
					title: "Option instead of Null-like Conventions",
					content:
						"Use `Option` to replace sentinel returns and nullable conventions. Students should feel why absence modeled in the type system is safer than absence hidden in documentation or magic values."
				},
				{
					title: "Result, Match, and the Question-Mark Operator",
					content:
						"Teach `Result` as a typed alternative to error-code conventions. Pattern matching and `?` should feel like a disciplined error-propagation style, not just new syntax. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Error Handling and Security Posture",
					content:
						"Connect Rust's typed failure paths to safer parsing and validation. A system is easier to secure when failure states are explicit and hard to ignore. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Option, Result, and Typed Error Paths: Verification and Reflection",
					content:
						"Close RSS3 Option, Result, and Typed Error Paths by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "RSS3 Option, Result, and Typed Error Paths: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS3-Option-and-Result/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS3-Option-and-Result/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Option and Result Audit Tool",
					content:
						"Build a small input-validation or config-parsing tool that uses `Option`, `Result`, and `?` instead of ad hoc null checks or integer status flags. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS3-Option-and-Result/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS3-Option-and-Result/solution"
				},
				{
					title: "Option, Result, and Typed Error Paths supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS3 Option, Result, and Typed Error Paths. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplem/solution"
				},
				{
					title: "Option, Result, and Typed Error Paths supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS3 Option, Result, and Typed Error Paths. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-08-rss3-option-result-and-typed-error-paths-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-08-rss3-option-result-and-typed-error-paths-supplem/solution"
				}
			]
		},
		{
			title: "RSS4 Strings, Slices, Collections, and Bounds Safety",
			curriculum: [
				{
					title: "String, str, Vec, and Slice Differences",
					content:
						"Teach owned strings, borrowed string slices, vectors, arrays, and slices as distinct tools rather than one generic container idea. Students should know which operations are cheap views and which allocate or move ownership."
				},
				{
					title: "Indexing, Iteration, and Safer Access Patterns",
					content:
						"Compare unchecked indexing habits from C/C++ with safer iteration and checked access in Rust. This is one of the clearest places where the language meaningfully narrows common memory-safety mistakes."
				},
				{
					title: "Parser-Facing Safety",
					content:
						"Use small parser examples so bounds safety feels like a real systems concern rather than a toy rule. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Strings, Slices, Collections, and Bounds Safety: Verification and Reflection",
					content:
						"Close RSS4 Strings, Slices, Collections, and Bounds Safety by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "RSS4 Strings, Slices, Collections, and Bounds Safety: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS4-Slices-Strings-and-Bounds/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS4-Slices-Strings-and-Bounds/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Slice and Bounds Workbench",
					content:
						"Implement a byte-buffer or log-slice utility that compares safe slicing patterns with the kinds of off-by-one and unchecked indexing bugs students already know from low-level work. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS4-Slices-Strings-and-Bounds/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS4-Slices-Strings-and-Bounds/solution"
				},
				{
					title: "Strings, Slices, Collections, and Bounds Safety supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS4 Strings, Slices, Collections, and Bounds Safety. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safet/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safet/solution"
				},
				{
					title: "Strings, Slices, Collections, and Bounds Safety supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS4 Strings, Slices, Collections, and Bounds Safety. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-10-rss4-strings-slices-collections-and-bounds-safet/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-10-rss4-strings-slices-collections-and-bounds-safet/solution"
				}
			]
		},
		{
			title: "RSS5 Structs, Enums, and Safer State Models",
			curriculum: [
				{
					title: "Structs for Explicit Data Modeling",
					content:
						"Use structs to make ownership, state, and transitions visible. Students should see that good modeling reduces security bugs because it narrows the number of half-valid states code can represent."
				},
				{
					title: "Enums and Impossible States",
					content:
						"Compare tagged enums and pattern matching to ad hoc integer codes, booleans, or loosely coordinated fields. Rust shines when a type can make impossible states unrepresentable. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Pattern Matching as Validation",
					content:
						"Teach `match` not just as syntax, but as a way to force complete reasoning across every state the program can inhabit. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Structs, Enums, and Safer State Models: Verification and Reflection",
					content:
						"Close RSS5 Structs, Enums, and Safer State Models by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "RSS5 Structs, Enums, and Safer State Models: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS5-Structs-Enums-and-State-Machines/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS5-Structs-Enums-and-State-Machines/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: State Machine Refactor",
					content:
						"Refactor a fragile status-code workflow into structs and enums so the compiler helps enforce legal transitions. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS5-Structs-Enums-and-State-Machines/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS5-Structs-Enums-and-State-Machines/solution"
				},
				{
					title: "Structs, Enums, and Safer State Models supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS5 Structs, Enums, and Safer State Models. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supple/solution"
				},
				{
					title: "Structs, Enums, and Safer State Models supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS5 Structs, Enums, and Safer State Models. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-12-rss5-structs-enums-and-safer-state-models-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-12-rss5-structs-enums-and-safer-state-models-supple/solution"
				}
			]
		},
		{
			title: "RSS6 Traits, Iterators, and API Contracts",
			curriculum: [
				{
					title: "Traits as Behavior Contracts",
					content:
						"Teach traits as explicit contracts for reusable behavior. Students should compare them with interfaces, abstract classes, or virtual methods without losing the Rust-specific emphasis on disciplined composition."
				},
				{
					title: "Iterator Safety vs. Invalidation Risk",
					content:
						"Use iterators and collection transforms to explain why Rust makes it harder to mutate collections in unsafe ways while traversing them. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Secure API Boundaries",
					content:
						"Good trait and iterator design can reduce misuse by forcing callers into safer shapes. This matters for security-sensitive code because APIs are part of the attack surface. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Traits, Iterators, and API Contracts: Verification and Reflection",
					content:
						"Close RSS6 Traits, Iterators, and API Contracts by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "RSS6 Traits, Iterators, and API Contracts: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS6-Traits-and-API-Contracts/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS6-Traits-and-API-Contracts/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Trait-Based Validation Pipeline",
					content:
						"Build a multi-step validation pipeline with traits and iterator-based transforms so the student can compare clean contracts with ad hoc callback spaghetti. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS6-Traits-and-API-Contracts/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS6-Traits-and-API-Contracts/solution"
				},
				{
					title: "Traits, Iterators, and API Contracts supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS6 Traits, Iterators, and API Contracts. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-suppleme/solution"
				},
				{
					title: "Traits, Iterators, and API Contracts supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS6 Traits, Iterators, and API Contracts. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-14-rss6-traits-iterators-and-api-contracts-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-14-rss6-traits-iterators-and-api-contracts-suppleme/solution"
				}
			]
		},
		{
			title: "RSS7 Files, Parsers, and Secure CLI Design",
			curriculum: [
				{
					title: "File I/O and Parser Discipline",
					content:
						"Teach parsing as a systems task where small unchecked assumptions cause real bugs. Use Rust's file APIs and typed error model to build safer parse-and-validate workflows. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Input Validation and Trust Boundaries",
					content:
						"Make untrusted input a first-class theme. Students should identify where the CLI receives external data and what validation or normalization happens before it is trusted. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Security Logging and Failure Visibility",
					content:
						"Show how structured errors and explicit validation failures make later debugging and auditing easier. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Files, Parsers, and Secure CLI Design: Verification and Reflection",
					content:
						"Close RSS7 Files, Parsers, and Secure CLI Design by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "RSS7 Files, Parsers, and Secure CLI Design: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS11-Secure-CLI-Audit-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS11-Secure-CLI-Audit-Tool/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Secure CLI Audit Tool",
					content:
						"Build a small CLI that parses a log or config file, validates each record, and reports trustworthy failures instead of crashing or silently accepting malformed input. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS11-Secure-CLI-Audit-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS11-Secure-CLI-Audit-Tool/solution"
				},
				{
					title: "Files, Parsers, and Secure CLI Design supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS7 Files, Parsers, and Secure CLI Design. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplem/solution"
				},
				{
					title: "Files, Parsers, and Secure CLI Design supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS7 Files, Parsers, and Secure CLI Design. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-16-rss7-files-parsers-and-secure-cli-design-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-16-rss7-files-parsers-and-secure-cli-design-supplem/solution"
				}
			]
		},
		{
			title: "RSS8 Concurrency and Race Reduction",
			curriculum: [
				{
					title: "Threads, Channels, and Shared State",
					content:
						"Introduce Rust concurrency with the same comparative posture as earlier units. Students should see where Rust's ownership and trait rules make it harder to create unsafe shared-state patterns."
				},
				{
					title: "Data Races vs. Logic Races",
					content:
						"Be honest about the boundary: Rust removes many memory-safety race problems, but it does not eliminate higher-level logic races or bad protocol design. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Choosing Channels or Shared Structures",
					content:
						"Compare message-passing and shared-state approaches so students can reason about design tradeoffs instead of applying concurrency tools blindly. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Concurrency and Race Reduction: Verification and Reflection",
					content:
						"Close RSS8 Concurrency and Race Reduction by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "RSS8 Concurrency and Race Reduction: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS9-Concurrency-with-Threads-and-Channels/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS9-Concurrency-with-Threads-and-Channels/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Threads and Channels Monitor",
					content:
						"Build a small concurrent monitor that compares message passing with shared mutable state and highlights how Rust narrows unsafe race patterns. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS9-Concurrency-with-Threads-and-Channels/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS9-Concurrency-with-Threads-and-Channels/solution"
				},
				{
					title: "Concurrency and Race Reduction supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS8 Concurrency and Race Reduction. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental/solution"
				},
				{
					title: "Concurrency and Race Reduction supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS8 Concurrency and Race Reduction. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-18-rss8-concurrency-and-race-reduction-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-18-rss8-concurrency-and-race-reduction-supplemental/solution"
				}
			]
		},
		{
			title: "RSS9 Unsafe, FFI, and Trusted Boundaries",
			curriculum: [
				{
					title: "What Unsafe Actually Means",
					content:
						"Teach `unsafe` as a narrow escape hatch, not a forbidden magic zone. Students should learn which guarantees the compiler stops checking and why that creates a smaller trusted computing boundary that must be justified carefully."
				},
				{
					title: "FFI as a Real-World Boundary",
					content:
						"Use FFI examples to show where Rust still depends on external correctness and where unsafety can re-enter the system through other languages or libraries. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Auditing Unsafe Blocks",
					content:
						"Require comments and reasoning around every unsafe block so students treat each one as an audit target. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Unsafe, FFI, and Trusted Boundaries: Verification and Reflection",
					content:
						"Close RSS9 Unsafe, FFI, and Trusted Boundaries by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "RSS9 Unsafe, FFI, and Trusted Boundaries: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS10-Unsafe-and-FFI-Boundaries/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS10-Unsafe-and-FFI-Boundaries/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Unsafe and FFI Boundary Review",
					content:
						"Wrap a tiny unsafe or FFI-facing boundary with documented invariants so the student practices narrowing and auditing trust assumptions. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS10-Unsafe-and-FFI-Boundaries/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS10-Unsafe-and-FFI-Boundaries/solution"
				},
				{
					title: "Unsafe, FFI, and Trusted Boundaries supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS9 Unsafe, FFI, and Trusted Boundaries. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemen/solution"
				},
				{
					title: "Unsafe, FFI, and Trusted Boundaries supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS9 Unsafe, FFI, and Trusted Boundaries. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-20-rss9-unsafe-ffi-and-trusted-boundaries-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-20-rss9-unsafe-ffi-and-trusted-boundaries-supplemen/solution"
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
						"Close RSS10 Capstone: Harden a Legacy Tool by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				},
				{
					title: "RSS10 Capstone: Harden a Legacy Tool: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS12-Capstone-Harden-a-Legacy-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS12-Capstone-Harden-a-Legacy-Tool/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Harden a Legacy Tool",
					content:
						"Complete a larger audit-and-port capstone where the student documents the old bug classes, the Rust redesign, the remaining risks, and the final testing evidence. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft.",
					projectLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS12-Capstone-Harden-a-Legacy-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Rust-Systems-Security/tree/main/RSS12-Capstone-Harden-a-Legacy-Tool/solution"
				},
				{
					title: "Capstone: Harden a Legacy Tool supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS10 Capstone: Harden a Legacy Tool. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental/solution"
				},
				{
					title: "Capstone: Harden a Legacy Tool supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to RSS10 Capstone: Harden a Legacy Tool. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-22-rss10-capstone-harden-a-legacy-tool-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-22-rss10-capstone-harden-a-legacy-tool-supplemental/solution"
				}
			]
		},
		{
			title: "Applied Studio 12: offensive security lab 10",
			curriculum: [
				{
					title: "offensive security lab 10: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: offensive security lab 10, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "offensive security lab 10: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: offensive security lab 10, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "offensive security lab 10: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: offensive security lab 10. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-01-offensive-security-lab-10/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-01-offensive-security-lab-10/solution"
				},
				{
					title: "offensive security lab 10: Review and Reflection",
					content:
						"Close Applied Studio 12: offensive security lab 10 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "offensive security lab 10: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: offensive security lab 10 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-01-offensive-security-lab-10/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-01-offensive-security-lab-10/solution"
				},
				{
					title: "Applied Studio 12: offensive security lab 10 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: offensive security lab 10. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-23-applied-studio-12-offensive-security-lab-10-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-23-applied-studio-12-offensive-security-lab-10-supp/solution"
				},
				{
					title: "Applied Studio 12: offensive security lab 10 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: offensive security lab 10. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-24-applied-studio-12-offensive-security-lab-10-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-24-applied-studio-12-offensive-security-lab-10-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 13: offensive security lab 11",
			curriculum: [
				{
					title: "offensive security lab 11: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: offensive security lab 11, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "offensive security lab 11: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: offensive security lab 11, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "offensive security lab 11: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: offensive security lab 11. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-02-offensive-security-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-02-offensive-security-lab-11/solution"
				},
				{
					title: "offensive security lab 11: Review and Reflection",
					content:
						"Close Applied Studio 13: offensive security lab 11 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "offensive security lab 11: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: offensive security lab 11 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-02-offensive-security-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-02-offensive-security-lab-11/solution"
				},
				{
					title: "Applied Studio 13: offensive security lab 11 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: offensive security lab 11. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-25-applied-studio-13-offensive-security-lab-11-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-25-applied-studio-13-offensive-security-lab-11-supp/solution"
				},
				{
					title: "Applied Studio 13: offensive security lab 11 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: offensive security lab 11. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-26-applied-studio-13-offensive-security-lab-11-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-26-applied-studio-13-offensive-security-lab-11-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: offensive security lab 12",
			curriculum: [
				{
					title: "offensive security lab 12: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: offensive security lab 12, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "offensive security lab 12: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: offensive security lab 12, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "offensive security lab 12: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: offensive security lab 12. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-03-offensive-security-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-03-offensive-security-lab-12/solution"
				},
				{
					title: "offensive security lab 12: Review and Reflection",
					content:
						"Close Applied Studio 14: offensive security lab 12 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "offensive security lab 12: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: offensive security lab 12 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-03-offensive-security-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-03-offensive-security-lab-12/solution"
				},
				{
					title: "Applied Studio 14: offensive security lab 12 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: offensive security lab 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-27-applied-studio-14-offensive-security-lab-12-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-27-applied-studio-14-offensive-security-lab-12-supp/solution"
				},
				{
					title: "Applied Studio 14: offensive security lab 12 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: offensive security lab 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-28-applied-studio-14-offensive-security-lab-12-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-28-applied-studio-14-offensive-security-lab-12-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: offensive security lab 13",
			curriculum: [
				{
					title: "offensive security lab 13: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: offensive security lab 13, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "offensive security lab 13: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: offensive security lab 13, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "offensive security lab 13: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: offensive security lab 13. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-04-offensive-security-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-04-offensive-security-lab-13/solution"
				},
				{
					title: "offensive security lab 13: Review and Reflection",
					content:
						"Close Applied Studio 15: offensive security lab 13 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "offensive security lab 13: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: offensive security lab 13 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-04-offensive-security-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-04-offensive-security-lab-13/solution"
				},
				{
					title: "Applied Studio 15: offensive security lab 13 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: offensive security lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-29-applied-studio-15-offensive-security-lab-13-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-29-applied-studio-15-offensive-security-lab-13-supp/solution"
				},
				{
					title: "Applied Studio 15: offensive security lab 13 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: offensive security lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-30-applied-studio-15-offensive-security-lab-13-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-30-applied-studio-15-offensive-security-lab-13-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: offensive security lab 14",
			curriculum: [
				{
					title: "offensive security lab 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: offensive security lab 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "offensive security lab 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: offensive security lab 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "offensive security lab 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: offensive security lab 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-05-offensive-security-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-05-offensive-security-lab-14/solution"
				},
				{
					title: "offensive security lab 14: Review and Reflection",
					content:
						"Close Applied Studio 16: offensive security lab 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "offensive security lab 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: offensive security lab 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-05-offensive-security-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-05-offensive-security-lab-14/solution"
				},
				{
					title: "Applied Studio 16: offensive security lab 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: offensive security lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-31-applied-studio-16-offensive-security-lab-14-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-31-applied-studio-16-offensive-security-lab-14-supp/solution"
				},
				{
					title: "Applied Studio 16: offensive security lab 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: offensive security lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-32-applied-studio-16-offensive-security-lab-14-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-32-applied-studio-16-offensive-security-lab-14-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: offensive security lab 15",
			curriculum: [
				{
					title: "offensive security lab 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: offensive security lab 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "offensive security lab 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: offensive security lab 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "offensive security lab 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: offensive security lab 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-06-offensive-security-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-06-offensive-security-lab-15/solution"
				},
				{
					title: "offensive security lab 15: Review and Reflection",
					content:
						"Close Applied Studio 17: offensive security lab 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "offensive security lab 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: offensive security lab 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-06-offensive-security-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-06-offensive-security-lab-15/solution"
				},
				{
					title: "Applied Studio 17: offensive security lab 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: offensive security lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-33-applied-studio-17-offensive-security-lab-15-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-33-applied-studio-17-offensive-security-lab-15-supp/solution"
				},
				{
					title: "Applied Studio 17: offensive security lab 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: offensive security lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-34-applied-studio-17-offensive-security-lab-15-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-34-applied-studio-17-offensive-security-lab-15-supp/solution"
				}
			]
		}
	]
};
