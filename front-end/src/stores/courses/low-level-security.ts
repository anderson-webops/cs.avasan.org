import type { RawCourse } from "./types";

type SecurityLabMode = "core" | "extension";

function stableVariantIndex(seed: string, count: number) {
	let hash = 2166136261;

	for (const character of seed) {
		hash ^= character.charCodeAt(0);
		hash = Math.imul(hash, 16777619) >>> 0;
	}

	return hash % count;
}

function securityLabFocus(topic: string) {
	const source = topic.toLowerCase();

	if (source.includes("memory layout")) {
		return "memory-region observation, address comparison, compiler-warning hygiene, and a short explanation of what changes between runs";
	}
	if (source.includes("bounds") || source.includes("copy")) {
		return "capacity checks, terminator handling, exact-fit inputs, oversized inputs, and explicit status reporting";
	}
	if (source.includes("parser") || source.includes("binary input")) {
		return "trust-boundary parsing, length validation, malformed-input rejection, and named negative tests";
	}
	if (source.includes("integer") || source.includes("ring")) {
		return "range validation, overflow-aware arithmetic, state invariants, and failed-operation behavior";
	}
	if (source.includes("sanitizer") || source.includes("fuzz")) {
		return "reproduction commands, sanitizer output, seed corpus management, crash triage, and regression preservation";
	}
	if (source.includes("patching") || source.includes("responsible")) {
		return "root-cause notes, narrow patch reasoning, regression checks, and responsible local-only research boundaries";
	}
	if (source.includes("offensive")) {
		return "defensive interpretation of the lab behavior, strict local scope, mitigation notes, and a hardening-oriented conclusion";
	}

	return `${securityLabLabel(topic)} local-only security evidence, clear assumptions, tool output, a patch or hardening decision, and a regression check`;
}

function securityLabProjectContent(topic: string, mode: SecurityLabMode) {
	const label = securityLabLabel(topic);
	const artifact =
		mode === "core" ? "core security lab" : "security extension lab";
	const variant = stableVariantIndex(`${label}|${mode}`, 4);
	const requiredWork = [
		[
			"1. State the local lab boundary and the exact toy target or starter being inspected.",
			"2. Build and run the lab with the expected defensive tooling, such as warnings, sanitizers, debugger output, or structured trace logs where relevant.",
			"3. Test the lab with one normal case, one malformed or boundary case, and one regression case that proves the final behavior is intentional.",
			"4. Write a short audit note naming the violated assumption, the fix or hardening choice, and the evidence that supports the conclusion."
		],
		[
			"1. Name the owned fixture, protected behavior, toolchain, and stop condition before running commands.",
			"2. Capture baseline output first, then change only one input, build flag, parser rule, or memory operation at a time.",
			"3. Compare a normal run, a malformed run, and a regression run after the fix or hardening change.",
			"4. Write an audit note that separates observation, root cause, patch decision, and verification evidence."
		],
		[
			"1. Define the local target, allowed files, expected safe behavior, and evidence source for this lab.",
			"2. Reproduce the relevant behavior with current compiler, sanitizer, debugger, or log evidence.",
			"3. Apply the smallest useful fix or hardening step, then rerun the original case plus a boundary case.",
			"4. Record the invariant that should remain true and the command or trace that proves it."
		],
		[
			"1. Write the scope line first: local fixture, allowed tooling, data that may be observed, and rollback path.",
			"2. Run the lab from a clean state and keep enough output to explain both the starting behavior and changed behavior.",
			"3. Test ordinary input, stress or malformed input, and the final defensive behavior after the change.",
			"4. Finish with a maintainer-facing note naming impact, mitigation, residual limitation, and retest evidence."
		]
	][variant];
	const completionChecks = [
		[
			"- The work stays inside the provided local lab and does not target public systems.",
			"- Security claims are backed by local build, runtime, sanitizer, debugger, or test evidence.",
			"- The final note explains the bug class or invariant well enough for a maintainer to reproduce and verify the result."
		],
		[
			"- The target, tooling, stop condition, and rollback path are explicit.",
			"- The before-and-after evidence comes from the controlled fixture, not from assumptions.",
			"- The final note connects the root cause to a narrow defensive fix or hardening choice."
		],
		[
			"- The normal case, malformed or boundary case, and regression case can be rerun.",
			"- The evidence identifies the exact warning, sanitizer finding, trace, log, or output being interpreted.",
			"- The final note states what changed and what risk remains outside the lab."
		],
		[
			"- The lab remains local, reversible, and scoped to the provided toy artifact.",
			"- The fix or hardening step is verified with the same scenario that exposed the issue.",
			"- The conclusion distinguishes observed behavior from impact and remediation."
		]
	][variant];

	return [
		`**Project goal:** Complete a ${artifact} for **${label}** that produces defensive evidence, not just a passing program.`,
		`**Focus:** ${securityLabFocus(topic)}.`,
		"**Required work:**",
		...requiredWork,
		"**Completion checks:**",
		...completionChecks
	].join("\n\n");
}

function securityLabLabel(topic: string) {
	return topic.replace(/: Implementation Lab$/, "");
}

function securityLabConceptContent(topic: string) {
	const label = securityLabLabel(topic);

	return [
		`Use **${label}** to connect the lab artifact to ${securityLabFocus(topic)}.`,
		"Start by naming the asset being protected, the trust boundary, the unsafe assumption, and the invariant that should stay true.",
		"Keep the discussion defensive and local: the goal is to understand the bug class, harden the program, and explain the evidence that proves the final behavior."
	].join("\n\n");
}

function securityLabExampleContent(topic: string) {
	const label = securityLabLabel(topic);

	return [
		`Trace one small local example for **${label}** before changing the implementation.`,
		"Record the exact input, command, expected behavior, observed behavior, and relevant warning, sanitizer, debugger, or log output.",
		"Then identify which assumption the example checks so the later project has a concrete normal case, boundary case, and regression case to compare against."
	].join("\n\n");
}

function securityLabReviewContent(topic: string) {
	const label = securityLabLabel(topic);

	return [
		`Close **${label}** with a maintainer-facing audit note rather than a vague reflection.`,
		"Summarize the root cause, the security or reliability boundary involved, the patch or hardening choice, and the normal, malformed, and regression evidence that supports the conclusion.",
		"Name one remaining limitation without expanding beyond the provided local lab."
	].join("\n\n");
}

export const lowLevelSecurityCourse: RawCourse = {
	name: "Low Level Security",
	modules: [
		{
			title: "LLS1 Memory Layout and Security Tooling",
			curriculum: [
				{
					title: "Security Mindset at the Systems Layer",
					content:
						"Low-level security is the practice of understanding how programs use memory, process input, and fail under stress. The course focuses on defensive engineering: reading memory-related bugs, reproducing them in small local demos, explaining why they happen, and then patching them with safer code and regression tests. Three habits matter throughout: model trust boundaries, assume inputs may be malformed, and prove fixes with tooling instead of intuition alone."
				},
				{
					title: "How a Process Uses Memory",
					content:
						"The usual memory regions are code/text, read-only data, global/static storage, heap allocations, and the stack. Local variables often live on the stack, dynamic allocations live on the heap, and object lifetime is a core security skill. Diagrams can compare fast local access with long-lived heap allocations, then connect that layout to common classes of bugs such as out-of-bounds access, use-after-free, and uninitialized reads."
				},
				{
					title: "Observing Stack, Heap, and Global Addresses",
					content:
						"Open a toy program and print the addresses of a stack variable, a heap allocation, a global variable, and a static variable. Compare which addresses tend to be near each other and which are not. This lesson is about orientation, not exploitation: build comfort reading addresses, pointer values, and byte distances so later bug reports feel concrete instead of abstract."
				},
				{
					title: "Compiler Warnings, Sanitizers, and Debuggers",
					content:
						"Set up a defensive toolchain with `-Wall -Wextra -Wpedantic -g` plus AddressSanitizer and UndefinedBehaviorSanitizer when available. Each tool has a clear coverage area and a clear limit. The workflow is: compile, reproduce the problem, read the report, isolate the failing line, add a guard, and rerun the same case."
				},
				{
					title: "LLS1 Project 1: Memory Map Inspector",
					content:
						"Build a small console program that prints and compares the addresses of stack, heap, global, and static data, then records observations about layout and lifetime. Extend it by adding an array, a string, and a dynamically allocated buffer. The lab note compares which values move between runs and which stay conceptually tied to storage duration. The starter now includes a guided observation table, and the review path adds byte-distance reporting plus example interpretations.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS1-Memory-Map-Inspector/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS1-Memory-Map-Inspector/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental: Build Script Hardening Checklist",
					content:
						"Create a one-page checklist of compiler options and runtime tools you want turned on in every low-level learning project. Include warnings, debug symbols, sanitizers, and a reminder to keep optimizations modest while debugging.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS1-Memory-Map-Inspector/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS1-Memory-Map-Inspector/solution"
				},
				{
					title: "Memory Layout and Security Tooling Supplemental 2",
					content: securityLabProjectContent(
						"LLS1 Memory Layout and Security Tooling",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-lls1-memory-layout-and-security-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-lls1-memory-layout-and-security-tooling-supplemental-2/solution"
				},
				{
					title: "Memory Layout and Security Tooling Supplemental 3",
					content: securityLabProjectContent(
						"LLS1 Memory Layout and Security Tooling",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-lls1-memory-layout-and-security-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-lls1-memory-layout-and-security-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "LLS2 Bounds, Arrays, and Safer Copy Patterns",
			curriculum: [
				{
					title: "Fixed-Size Storage and Why Bounds Matter",
					content:
						"Review arrays, character buffers, and small structs that store a limited amount of data. Every fixed-size object creates an implicit contract: only read initialized bytes, only write within capacity, and always preserve a valid terminator if the data is string-like. Connect off-by-one mistakes and unchecked copies to the much broader idea of memory corruption without describing weaponization."
				},
				{
					title: "Off-by-One Errors and Truncation Rules",
					content:
						"Use examples to show the difference between capacity and length. A buffer with room for 16 characters cannot always hold 16 visible characters if a null terminator is required. Practice converting that idea into concrete code review questions: Did we reserve space for the terminator? What happens with empty input? What happens when the input length equals the buffer size exactly?"
				},
				{
					title: "Safer APIs for Copying and Formatting",
					content:
						"Prefer interfaces that accept both a destination and its capacity. Return explicit status values like ok, truncated, or invalid-input instead of silently guessing. Small wrappers around `std::array<char, N>` and `std::string_view` make intent obvious and reduce raw pointer arithmetic in beginner code."
				},
				{
					title: "Ownership and Object Lifetime",
					content:
						"Reinforce the difference between copying bytes, borrowing a view, and owning memory outright. Explain why dangling pointers and stale references are security problems even when the code appears to compile cleanly. Tie this back to review habits: always ask who owns the data, how long it lives, and whether an API copies or aliases it."
				},
				{
					title: "LLS2 Project 2: Bounds-Checked Copy Lab",
					content:
						"Implement a label-copy routine for a fixed-size destination buffer. The starter code distinguishes between successful copies and truncation, always leaves the destination in a valid state, and prints test cases for short, exact-fit, empty, too-long, and invalid inputs. The final explanation compares explicit status codes with silent truncation and uses the byte dump to confirm terminator placement.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-Bounds-Checked-Copy/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-Bounds-Checked-Copy/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental: Safe Line Reader Outline",
					content:
						"Design a small helper that reads a line from standard input, trims trailing newline characters, rejects oversized input, and returns a structured status. This is a design-first exercise focused on defensive API shape.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-Bounds-Checked-Copy/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-Bounds-Checked-Copy/solution"
				},
				{
					title: "Bounds, Arrays, and Safer Copy Patterns Supplemental 2",
					content: securityLabProjectContent(
						"LLS2 Bounds, Arrays, and Safer Copy Patterns",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-lls2-bounds-arrays-and-safer-copy-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-lls2-bounds-arrays-and-safer-copy-patterns-supplemental-2/solution"
				},
				{
					title: "Bounds, Arrays, and Safer Copy Patterns Supplemental 3",
					content: securityLabProjectContent(
						"LLS2 Bounds, Arrays, and Safer Copy Patterns",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-lls2-bounds-arrays-and-safer-copy-patterns-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-lls2-bounds-arrays-and-safer-copy-patterns-supplemental-3/solution"
				}
			]
		},
		{
			title: "LLS3 Defensive Parsers and Binary Input",
			curriculum: [
				{
					title: "Trust Boundaries and Structured Input",
					content:
						"Treat every file, network message, clipboard payload, and command-line argument as untrusted until proven otherwise. The basic parser pattern is: verify minimum length, read the header, validate lengths and tags, inspect payload bytes, and only then dispatch to deeper logic. Parser security is mostly disciplined bookkeeping and explicit checks."
				},
				{
					title: "Length Fields, Magic Values, and Versioning",
					content:
						"Show why binary formats often begin with a length, a command byte, or a magic identifier. Practice reviewing a toy protocol with questions like: Is the advertised length consistent with the actual buffer? Are unknown commands rejected cleanly? Are future versions isolated from older parsing logic?"
				},
				{
					title: "Printable Data, Encodings, and Validation",
					content:
						"Not every parser should accept arbitrary bytes. For simple educational protocols, printable ASCII or a narrow allowed character set makes malformed data and rejection paths easier to reason about. This makes it easier to write meaningful negative tests and to observe how validation gates reduce risk."
				},
				{
					title: "Negative Tests for Malformed Inputs",
					content:
						"This section covers bug-finding by creating test inputs that should be rejected: too short, too long, wrong declared length, unknown opcode, invalid characters, or missing body bytes. Name each test after the assumption it challenges so the debugging story stays clear."
				},
				{
					title: "LLS3 Project 3: Length-Prefixed Parser",
					content:
						"Write a parser for a tiny packet format where the first byte stores payload length and the second byte stores a command identifier. The secure solution rejects length mismatches, oversized payloads, unknown commands, and non-printable payload bytes. The final table lists which malformed cases were caught and adds at least one additional rejection case.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS3-Length-Prefixed-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS3-Length-Prefixed-Parser/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental: File Format Review Worksheet",
					content:
						"Pick a small made-up binary format and write a review worksheet: fields, invariants, maximum sizes, and what should happen if each field is malformed.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS3-Length-Prefixed-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS3-Length-Prefixed-Parser/solution"
				},
				{
					title: "Defensive Parsers and Binary Input Supplemental 2",
					content: securityLabProjectContent(
						"LLS3 Defensive Parsers and Binary Input",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-lls3-defensive-parsers-and-binary-input-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-lls3-defensive-parsers-and-binary-input-supplemental-2/solution"
				},
				{
					title: "Defensive Parsers and Binary Input Supplemental 3",
					content: securityLabProjectContent(
						"LLS3 Defensive Parsers and Binary Input",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-lls3-defensive-parsers-and-binary-input-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-lls3-defensive-parsers-and-binary-input-supplemental-3/solution"
				}
			]
		},
		{
			title: "LLS4 Integer Safety, State, and Defensive Data Structures",
			curriculum: [
				{
					title: "Integer Overflow, Underflow, and Type Mismatch",
					content:
						"Explain why sizes, indexes, and counters deserve the same attention as raw memory access. Review signed vs. unsigned values, wraparound, narrowing conversions, and the danger of using a computed size before checking it. Build the habit of validating ranges before arithmetic rather than after."
				},
				{
					title: "State Machines Keep Parsers Honest",
					content:
						"Model low-level programs as a series of valid states instead of one large function full of special cases. Whether the code is parsing bytes or managing a queue, explicit state transitions make it easier to reject impossible conditions and easier to test error handling."
				},
				{
					title: "Designing a Ring Buffer Safely",
					content:
						"A fixed-capacity byte ring buffer makes capacity checks, wraparound, and invariants concrete. The key security lesson is that a data structure should guard its own correctness: reject writes that exceed free capacity, reject reads that request more bytes than are available, and leave the buffer unchanged on failure."
				},
				{
					title: "Assertions, Invariants, and Audit Notes",
					content:
						"Add assertions for internal assumptions and structured return codes for input-driven failures. Document the invariants that must always hold, such as `count <= capacity` and head/tail indices staying inside bounds. This turns debugging into a process of checking contracts instead of guessing."
				},
				{
					title: "LLS4 Project 4: Ring Buffer Guards",
					content:
						"Implement a tiny byte ring buffer with guarded push and pop operations. The secure solution preserves invariants during wraparound and rejects impossible requests without corrupting state. Tests cover partial fills, exact fills, over-capacity writes, wraparound reads, and the requirement that failed requests leave the logical contents untouched.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS4-Ring-Buffer-Guards/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS4-Ring-Buffer-Guards/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental: Invariant Checklist",
					content:
						"Write a review checklist for low-level containers that includes size tracking, overflow checks, wraparound behavior, and what the object guarantees after failure.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS4-Ring-Buffer-Guards/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS4-Ring-Buffer-Guards/solution"
				},
				{
					title: "Integer Safety, State, and Defensive Data Structures Supplemental 2",
					content: securityLabProjectContent(
						"LLS4 Integer Safety, State, and Defensive Data Structures",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-lls4-integer-safety-state-and-defensive-data-structures-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-lls4-integer-safety-state-and-defensive-data-structures-supplemental-2/solution"
				},
				{
					title: "Integer Safety, State, and Defensive Data Structures Supplemental 3",
					content: securityLabProjectContent(
						"LLS4 Integer Safety, State, and Defensive Data Structures",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-lls4-integer-safety-state-and-defensive-data-structures-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-lls4-integer-safety-state-and-defensive-data-structures-supplemental-3/solution"
				}
			]
		},
		{
			title: "LLS5 Bug Hunting with Sanitizers and Fuzzing",
			curriculum: [
				{
					title: "A Practical Bug Hunting Workflow",
					content:
						"Use a repeatable defensive workflow: reproduce the failure, freeze the input that triggers it, compile with sanitizers, read the first trustworthy report, isolate the root cause, patch narrowly, and add a regression test. Stress that a good security engineer spends as much time making bugs reproducible as they do fixing them."
				},
				{
					title: "Reading Sanitizer Reports",
					content:
						'Practice reading AddressSanitizer and UndefinedBehaviorSanitizer output. Identify the failing access, the object involved, and the call stack frame that owns the broken assumption. Convert each report into a sentence such as: "The parser trusted the declared length before verifying the buffer actually held that many bytes."'
				},
				{
					title: "Fuzzing as Structured Curiosity",
					content:
						"Fuzzing is automated exploration of weird inputs, not magic. Start with a valid seed, then mutate bytes, lengths, and command fields while watching for crashes, assertion failures, or unexpected states. Keep the target local, toy-sized, and instrumented with sanitizer builds."
				},
				{
					title: "Corpus Management and Regression Cases",
					content:
						"Store interesting failing inputs in a small regression corpus. After each fix, rerun the full corpus so the same bug class cannot quietly return. This habit scales from classroom labs to real engineering teams."
				},
				{
					title: "LLS5 Project 5: Mini Fuzzer Harness",
					content:
						"Build a tiny mutation harness around the packet parser from earlier lessons. Start from a valid packet, flip random bytes, perturb the length field, and count how often the parser rejects malformed data cleanly. The goal is not to attack anything; it is to automate edge-case discovery for a local toy parser, group rejection reasons, and preserve interesting cases for regression testing.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS5-Mini-Fuzzer/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS5-Mini-Fuzzer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental: Crash Triage Notebook",
					content:
						"Create a notebook template for future bug hunts with sections for reproduction command, first failing input, sanitizer output, root cause, fix summary, and regression test name.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS5-Mini-Fuzzer/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS5-Mini-Fuzzer/solution"
				},
				{
					title: "Bug Hunting with Sanitizers and Fuzzing Supplemental 2",
					content: securityLabProjectContent(
						"LLS5 Bug Hunting with Sanitizers and Fuzzing",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-lls5-bug-hunting-with-sanitizers-and-fuzzing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-lls5-bug-hunting-with-sanitizers-and-fuzzing-supplemental-2/solution"
				},
				{
					title: "Bug Hunting with Sanitizers and Fuzzing Supplemental 3",
					content: securityLabProjectContent(
						"LLS5 Bug Hunting with Sanitizers and Fuzzing",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-lls5-bug-hunting-with-sanitizers-and-fuzzing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-lls5-bug-hunting-with-sanitizers-and-fuzzing-supplemental-3/solution"
				}
			]
		},
		{
			title: "LLS6 Patching, Review, and Responsible Research",
			curriculum: [
				{
					title: "Patch Engineering and Narrow Fixes",
					content:
						"A secure patch should do three things: stop the broken behavior, preserve legitimate behavior, and add a test that proves the bug stays fixed. Giant rewrites are risky when a smaller targeted repair is sufficient. Compare quick guards against deeper refactors and document why the chosen fix is enough."
				},
				{
					title: "Code Review Heuristics for Low-Level Safety",
					content:
						"This section covers a short review checklist: unchecked lengths, copies into fixed buffers, stale references after ownership changes, arithmetic on untrusted sizes, silent truncation, and missing failure paths. Review comments should name the violated invariant rather than only pointing at syntax."
				},
				{
					title: "Documenting a Vulnerability Clearly",
					content:
						"Practice writing a concise vulnerability note with five parts: summary, affected input path, root cause, impact in the toy program, and patch/verification notes. This is useful for internal communication even when the issue never leaves a classroom setting."
				},
				{
					title: "Ethics and Responsible Security Learning",
					content:
						"Keep the course grounded in defensive learning. Only test code they own or toy programs specifically built for the course, avoid deploying vulnerable examples anywhere public, and use what they learn to harden software, communicate clearly, and reduce risk."
				},
				{
					title: "LLS6 Capstone: Audit and Harden a Tiny System",
					content:
						"Use the capstone starter to audit a tiny packet-driven system that combines bounded label storage with command dispatch. Perform a full pass: threat model, invariants, malformed input list, tool-assisted testing plan, patch list, and regression suite. The capstone deliverable is a short audit packet, not an exploit, and every change should be justified against a specific broken assumption.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS6-Capstone-Audit/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS6-Capstone-Audit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Supplemental: Responsible Disclosure Roleplay",
					content:
						"Run a responsible-disclosure roleplay: one side writes a bug report, and the maintainer side responds with reproduction questions, risk assessment, and patch verification steps.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS6-Capstone-Audit/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS6-Capstone-Audit/solution"
				},
				{
					title: "Patching, Review, and Responsible Research Supplemental 2",
					content: securityLabProjectContent(
						"LLS6 Patching, Review, and Responsible Research",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-lls6-patching-review-and-responsible-research-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-lls6-patching-review-and-responsible-research-supplemental-2/solution"
				},
				{
					title: "Patching, Review, and Responsible Research Supplemental 3",
					content: securityLabProjectContent(
						"LLS6 Patching, Review, and Responsible Research",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-12-lls6-patching-review-and-responsible-research-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-12-lls6-patching-review-and-responsible-research-supplemental-3/solution"
				}
			]
		},
		{
			title: "Offensive Security Lab 16: Implementation Lab",
			curriculum: [
				{
					title: "Offensive Security Lab 16: Core Concepts",
					content: securityLabConceptContent(
						"Offensive Security Lab 16: Implementation Lab"
					)
				},
				{
					title: "Offensive Security Lab 16: Guided Example",
					content: securityLabExampleContent(
						"Offensive Security Lab 16: Implementation Lab"
					)
				},
				{
					title: "Offensive Security Lab 16: Core Project",
					content: securityLabProjectContent(
						"Offensive Security Lab 16: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-offensive-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-offensive-security-lab-16/solution"
				},
				{
					title: "Offensive Security Lab 16: Review and Reflection",
					content: securityLabReviewContent(
						"Offensive Security Lab 16: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Offensive Security Lab 16: Extension Challenge",
					content: securityLabProjectContent(
						"Offensive Security Lab 16: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-offensive-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-offensive-security-lab-16/solution"
				},
				{
					title: "Offensive Security Lab 16 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Offensive Security Lab 16: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-13-applied-studio-7-offensive-security-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-13-applied-studio-7-offensive-security-lab-16-supplemental-2/solution"
				},
				{
					title: "Offensive Security Lab 16 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Offensive Security Lab 16: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-14-applied-studio-7-offensive-security-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-14-applied-studio-7-offensive-security-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Offensive Security Lab 17: Implementation Lab",
			curriculum: [
				{
					title: "Offensive Security Lab 17: Core Concepts",
					content: securityLabConceptContent(
						"Offensive Security Lab 17: Implementation Lab"
					)
				},
				{
					title: "Offensive Security Lab 17: Guided Example",
					content: securityLabExampleContent(
						"Offensive Security Lab 17: Implementation Lab"
					)
				},
				{
					title: "Offensive Security Lab 17: Core Project",
					content: securityLabProjectContent(
						"Offensive Security Lab 17: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-offensive-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-offensive-security-lab-17/solution"
				},
				{
					title: "Offensive Security Lab 17: Review and Reflection",
					content: securityLabReviewContent(
						"Offensive Security Lab 17: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Offensive Security Lab 17: Extension Challenge",
					content: securityLabProjectContent(
						"Offensive Security Lab 17: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-offensive-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-offensive-security-lab-17/solution"
				},
				{
					title: "Offensive Security Lab 17 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Offensive Security Lab 17: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-15-applied-studio-8-offensive-security-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-15-applied-studio-8-offensive-security-lab-17-supplemental-2/solution"
				},
				{
					title: "Offensive Security Lab 17 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Offensive Security Lab 17: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-16-applied-studio-8-offensive-security-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-16-applied-studio-8-offensive-security-lab-17-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 7: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 7: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 7: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 7: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 7: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 7: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 7: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-low-level-security-lab-7/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-low-level-security-lab-7/solution"
				},
				{
					title: "Low-Level Security Lab 7: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 7: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 7: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 7: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-low-level-security-lab-7/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-low-level-security-lab-7/solution"
				},
				{
					title: "Low-Level Security Lab 7 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 7: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-23-applied-studio-12-low-level-security-lab-7-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-23-applied-studio-12-low-level-security-lab-7-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 7 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 7: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-24-applied-studio-12-low-level-security-lab-7-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-24-applied-studio-12-low-level-security-lab-7-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 8: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 8: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 8: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 8: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 8: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 8: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 8: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-low-level-security-lab-8/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-low-level-security-lab-8/solution"
				},
				{
					title: "Low-Level Security Lab 8: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 8: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 8: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 8: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-low-level-security-lab-8/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-low-level-security-lab-8/solution"
				},
				{
					title: "Low-Level Security Lab 8 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 8: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-25-applied-studio-13-low-level-security-lab-8-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-25-applied-studio-13-low-level-security-lab-8-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 8 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 8: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-26-applied-studio-13-low-level-security-lab-8-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-26-applied-studio-13-low-level-security-lab-8-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 9: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 9: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 9: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 9: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 9: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 9: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 9: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-low-level-security-lab-9/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-low-level-security-lab-9/solution"
				},
				{
					title: "Low-Level Security Lab 9: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 9: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 9: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 9: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-low-level-security-lab-9/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-low-level-security-lab-9/solution"
				},
				{
					title: "Low-Level Security Lab 9 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 9: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-27-applied-studio-14-low-level-security-lab-9-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-27-applied-studio-14-low-level-security-lab-9-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 9 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 9: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-28-applied-studio-14-low-level-security-lab-9-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-28-applied-studio-14-low-level-security-lab-9-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 10: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 10: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 10: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 10: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 10: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 10: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 10: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-low-level-security-lab-10/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-low-level-security-lab-10/solution"
				},
				{
					title: "Low-Level Security Lab 10: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 10: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 10: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 10: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-low-level-security-lab-10/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-low-level-security-lab-10/solution"
				},
				{
					title: "Low-Level Security Lab 10 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 10: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-29-applied-studio-15-low-level-security-lab-10-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-29-applied-studio-15-low-level-security-lab-10-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 10 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 10: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-30-applied-studio-15-low-level-security-lab-10-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-30-applied-studio-15-low-level-security-lab-10-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 11: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 11: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 11: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 11: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 11: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 11: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 11: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-low-level-security-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-low-level-security-lab-11/solution"
				},
				{
					title: "Low-Level Security Lab 11: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 11: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 11: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 11: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-low-level-security-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-low-level-security-lab-11/solution"
				},
				{
					title: "Low-Level Security Lab 11 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 11: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-31-applied-studio-16-low-level-security-lab-11-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-31-applied-studio-16-low-level-security-lab-11-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 11 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 11: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-32-applied-studio-16-low-level-security-lab-11-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-32-applied-studio-16-low-level-security-lab-11-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 12: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 12: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 12: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 12: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 12: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 12: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 12: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-low-level-security-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-low-level-security-lab-12/solution"
				},
				{
					title: "Low-Level Security Lab 12: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 12: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 12: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 12: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-low-level-security-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-low-level-security-lab-12/solution"
				},
				{
					title: "Low-Level Security Lab 12 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 12: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-33-applied-studio-17-low-level-security-lab-12-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-33-applied-studio-17-low-level-security-lab-12-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 12 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 12: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-34-applied-studio-17-low-level-security-lab-12-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-34-applied-studio-17-low-level-security-lab-12-supplemental-3/solution"
				}
			]
		}
	]
};
