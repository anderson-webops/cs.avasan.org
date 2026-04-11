import type { RawCourse, RawCourseModuleItem } from "./types";

const RUST_SYSTEMS_SECURITY_REPO =
	"https://github.com/instruction-material/Rust-Systems-Security/tree/main";

function starterRepoLink(projectId: string) {
	return `${RUST_SYSTEMS_SECURITY_REPO}/${projectId}/starter`;
}

function solutionRepoLink(projectId: string) {
	return `${RUST_SYSTEMS_SECURITY_REPO}/${projectId}/solution`;
}

function pairedProject(
	title: string,
	content: string,
	projectId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: starterRepoLink(projectId),
		solutionLink: solutionRepoLink(projectId)
	};
}

function auditNote(unitTitle: string, focus: string): RawCourseModuleItem {
	return {
		title: `Rust Audit Log: ${unitTitle}`,
		content: `Keep a short comparative audit log for ${unitTitle.toLowerCase()} that records one C/C++ bug pattern, one Rust compiler or type-system intervention, and one note about ${focus}.`
	};
}

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
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: First Cargo Audit CLI",
					"Set up a small Cargo-based CLI and use it to compare a clean Rust workspace with a fragile manual C/C++ build loop.",
					"RSS1-Ownership-and-Moves"
				),
				auditNote(
					"Tooling, Cargo, and Why Rust Exists",
					"why Rust's workflow tries to catch correctness problems before execution"
				)
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
						"Explain how values are cleaned up when they leave scope and why that makes resource lifetime more explicit than in manual-memory designs."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Ownership and Move Tracer",
					"Build a small CLI that moves strings, vectors, and structs through helper functions so students can see when ownership transfers and when values must be cloned.",
					"RSS1-Ownership-and-Moves"
				)
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
						"Introduce lifetime thinking through scope relationships first and explicit annotations second. The goal is practical reasoning about which reference can safely outlive which value."
				},
				{
					title: "Why Borrow Checking Matters for Security",
					content:
						"Make the security angle explicit: a compiler that rejects dangling references or conflicting mutable access is removing a meaningful class of memory safety hazards before runtime."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Borrowing and Aliasing Lab",
					"Refactor a small parser or buffer-manipulation exercise until it satisfies Rust's borrowing model without cloning away the real ownership story.",
					"RSS2-Borrowing-and-Aliasing"
				)
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
						"Teach `Result` as a typed alternative to error-code conventions. Pattern matching and `?` should feel like a disciplined error-propagation style, not just new syntax."
				},
				{
					title: "Error Handling and Security Posture",
					content:
						"Connect Rust's typed failure paths to safer parsing and validation. A system is easier to secure when failure states are explicit and hard to ignore."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Option and Result Audit Tool",
					"Build a small input-validation or config-parsing tool that uses `Option`, `Result`, and `?` instead of ad hoc null checks or integer status flags.",
					"RSS3-Option-and-Result"
				)
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
						"Use small parser examples so bounds safety feels like a real systems concern rather than a toy rule."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Slice and Bounds Workbench",
					"Implement a byte-buffer or log-slice utility that compares safe slicing patterns with the kinds of off-by-one and unchecked indexing bugs students already know from low-level work.",
					"RSS4-Slices-Strings-and-Bounds"
				)
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
						"Compare tagged enums and pattern matching to ad hoc integer codes, booleans, or loosely coordinated fields. Rust shines when a type can make impossible states unrepresentable."
				},
				{
					title: "Pattern Matching as Validation",
					content:
						"Teach `match` not just as syntax, but as a way to force complete reasoning across every state the program can inhabit."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: State Machine Refactor",
					"Refactor a fragile status-code workflow into structs and enums so the compiler helps enforce legal transitions.",
					"RSS5-Structs-Enums-and-State-Machines"
				)
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
						"Use iterators and collection transforms to explain why Rust makes it harder to mutate collections in unsafe ways while traversing them."
				},
				{
					title: "Secure API Boundaries",
					content:
						"Good trait and iterator design can reduce misuse by forcing callers into safer shapes. This matters for security-sensitive code because APIs are part of the attack surface."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Trait-Based Validation Pipeline",
					"Build a multi-step validation pipeline with traits and iterator-based transforms so the student can compare clean contracts with ad hoc callback spaghetti.",
					"RSS6-Traits-and-API-Contracts"
				)
			]
		},
		{
			title: "RSS7 Files, Parsers, and Secure CLI Design",
			curriculum: [
				{
					title: "File I/O and Parser Discipline",
					content:
						"Teach parsing as a systems task where small unchecked assumptions cause real bugs. Use Rust's file APIs and typed error model to build safer parse-and-validate workflows."
				},
				{
					title: "Input Validation and Trust Boundaries",
					content:
						"Make untrusted input a first-class theme. Students should identify where the CLI receives external data and what validation or normalization happens before it is trusted."
				},
				{
					title: "Security Logging and Failure Visibility",
					content:
						"Show how structured errors and explicit validation failures make later debugging and auditing easier."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Secure CLI Audit Tool",
					"Build a small CLI that parses a log or config file, validates each record, and reports trustworthy failures instead of crashing or silently accepting malformed input.",
					"RSS11-Secure-CLI-Audit-Tool"
				)
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
						"Be honest about the boundary: Rust removes many memory-safety race problems, but it does not eliminate higher-level logic races or bad protocol design."
				},
				{
					title: "Choosing Channels or Shared Structures",
					content:
						"Compare message-passing and shared-state approaches so students can reason about design tradeoffs instead of applying concurrency tools blindly."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Threads and Channels Monitor",
					"Build a small concurrent monitor that compares message passing with shared mutable state and highlights how Rust narrows unsafe race patterns.",
					"RSS9-Concurrency-with-Threads-and-Channels"
				)
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
						"Use FFI examples to show where Rust still depends on external correctness and where unsafety can re-enter the system through other languages or libraries."
				},
				{
					title: "Auditing Unsafe Blocks",
					content:
						"Require comments and reasoning around every unsafe block so students treat each one as an audit target."
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Unsafe and FFI Boundary Review",
					"Wrap a tiny unsafe or FFI-facing boundary with documented invariants so the student practices narrowing and auditing trust assumptions.",
					"RSS10-Unsafe-and-FFI-Boundaries"
				)
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
				}
			],
			supplementalProjects: [
				pairedProject(
					"Project: Harden a Legacy Tool",
					"Complete a larger audit-and-port capstone where the student documents the old bug classes, the Rust redesign, the remaining risks, and the final testing evidence.",
					"RSS12-Capstone-Harden-a-Legacy-Tool"
				),
				auditNote(
					"Capstone: Harden a Legacy Tool",
					"which bug classes Rust removed, and which still required design or validation discipline"
				)
			]
		}
	]
};
