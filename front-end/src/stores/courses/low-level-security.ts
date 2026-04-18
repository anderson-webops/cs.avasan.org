import type { RawCourse } from "./types";

export const lowLevelSecurityCourse: RawCourse = {
	name: "Low Level Security",
	modules: [
		{
			title: "LLS1 Memory Layout and Security Tooling",
			curriculum: [
				{
					title: "Security Mindset at the Systems Layer",
					content:
						"Define low-level security as the practice of understanding how programs use memory, process input, and fail under stress. Focus the course on defensive engineering: reading memory-related bugs, reproducing them in small local demos, explaining why they happen, and then patching them with safer code and regression tests. Emphasize three habits: model trust boundaries, assume inputs may be malformed, and prove fixes with tooling instead of intuition alone."
				},
				{
					title: "How a Process Uses Memory",
					content:
						"Introduce the usual memory regions: code/text, read-only data, global/static storage, heap allocations, and the stack. Explain why local variables often live on the stack, why dynamic allocations live on the heap, and why understanding object lifetime is a core security skill. Use diagrams to compare fast local access with long-lived heap allocations, then connect that layout to common classes of bugs such as out-of-bounds access, use-after-free, and uninitialized reads."
				},
				{
					title: "Observing Stack, Heap, and Global Addresses",
					content:
						"Open a toy program and print the addresses of a stack variable, a heap allocation, a global variable, and a static variable. Discuss which addresses tend to be near each other and which are not. This lesson is about orientation, not exploitation: learners should get comfortable reading addresses, pointer values, and byte distances so later bug reports feel concrete instead of abstract."
				},
				{
					title: "Compiler Warnings, Sanitizers, and Debuggers",
					content:
						"Set up a defensive toolchain with `-Wall -Wextra -Wpedantic -g` plus AddressSanitizer and UndefinedBehaviorSanitizer when available. Explain what each tool catches well and what it does not catch. Demonstrate a simple workflow: compile, reproduce the problem, read the report, isolate the failing line, add a guard, and rerun the same case."
				},
				{
					title: "LLS1 Project 1: Memory Map Inspector",
					content:
						"Build a small console program that prints and compares the addresses of stack, heap, global, and static data, then records observations about layout and lifetime. Extend it by adding an array, a string, and a dynamically allocated buffer. Ask learners to write a short lab note about which values move between runs and which stay conceptually tied to storage duration. The starter now includes a guided observation table, and the reference solution adds byte-distance reporting plus example interpretations.",
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
					title: "Memory Layout and Security Tooling supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS1 Memory Layout and Security Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-lls1-memory-layout-and-security-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-lls1-memory-layout-and-security-tooling-supplemental-2/solution"
				},
				{
					title: "Memory Layout and Security Tooling supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS1 Memory Layout and Security Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"Review arrays, character buffers, and small structs that store a limited amount of data. Show how every fixed-size object creates an implicit contract: only read initialized bytes, only write within capacity, and always preserve a valid terminator if the data is string-like. Connect off-by-one mistakes and unchecked copies to the much broader idea of memory corruption without teaching weaponization."
				},
				{
					title: "Off-by-One Errors and Truncation Rules",
					content:
						"Use examples to show the difference between capacity and length. A buffer with room for 16 characters cannot always hold 16 visible characters if a null terminator is required. Practice converting that idea into concrete code review questions: Did we reserve space for the terminator? What happens with empty input? What happens when the input length equals the buffer size exactly?"
				},
				{
					title: "Safer APIs for Copying and Formatting",
					content:
						"Prefer interfaces that accept both a destination and its capacity. Return explicit status values like ok, truncated, or invalid-input instead of silently guessing. Introduce small wrappers around `std::array<char, N>` and `std::string_view` to make intent obvious and reduce raw pointer arithmetic in beginner code."
				},
				{
					title: "Ownership and Object Lifetime",
					content:
						"Reinforce the difference between copying bytes, borrowing a view, and owning memory outright. Explain why dangling pointers and stale references are security problems even when the code appears to compile cleanly. Tie this back to review habits: always ask who owns the data, how long it lives, and whether an API copies or aliases it."
				},
				{
					title: "LLS2 Project 2: Bounds-Checked Copy Lab",
					content:
						"Implement a label-copy routine for a fixed-size destination buffer. The starter code should distinguish between successful copies and truncation, always leave the destination in a valid state, and print test cases for short, exact-fit, empty, too-long, and invalid inputs. Learners should explain why explicit status codes are more secure than silent truncation and use the byte dump to confirm terminator placement.",
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
					title: "Bounds, Arrays, and Safer Copy Patterns supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS2 Bounds, Arrays, and Safer Copy Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-lls2-bounds-arrays-and-safer-copy-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-lls2-bounds-arrays-and-safer-copy-patterns-supplemental-2/solution"
				},
				{
					title: "Bounds, Arrays, and Safer Copy Patterns supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS2 Bounds, Arrays, and Safer Copy Patterns. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"Treat every file, network message, clipboard payload, and command-line argument as untrusted until proven otherwise. Introduce the basic parser pattern: verify minimum length, read the header, validate lengths and tags, inspect payload bytes, and only then dispatch to deeper logic. Explain that parser security is mostly disciplined bookkeeping and explicit checks."
				},
				{
					title: "Length Fields, Magic Values, and Versioning",
					content:
						"Show why binary formats often begin with a length, a command byte, or a magic identifier. Practice reviewing a toy protocol with questions like: Is the advertised length consistent with the actual buffer? Are unknown commands rejected cleanly? Are future versions isolated from older parsing logic?"
				},
				{
					title: "Printable Data, Encodings, and Validation",
					content:
						"Not every parser should accept arbitrary bytes. For simple educational protocols, require printable ASCII or a narrow allowed character set so learners can reason about malformed data and rejection paths. This makes it easier to write meaningful negative tests and to observe how validation gates reduce risk."
				},
				{
					title: "Negative Tests for Malformed Inputs",
					content:
						"Teach bug-finding by creating test inputs that should be rejected: too short, too long, wrong declared length, unknown opcode, invalid characters, or missing body bytes. Encourage naming each test after the assumption it challenges so the debugging story stays clear."
				},
				{
					title: "LLS3 Project 3: Length-Prefixed Parser",
					content:
						"Write a parser for a tiny packet format where the first byte stores payload length and the second byte stores a command identifier. The secure solution should reject length mismatches, oversized payloads, unknown commands, and non-printable payload bytes. Learners should then write a short table listing which malformed cases were caught and add at least one more rejection case of their own.",
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
						"Pick a small made-up binary format and write a review worksheet: fields, invariants, maximum sizes, and what should happen if each field is malformed. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS3-Length-Prefixed-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS3-Length-Prefixed-Parser/solution"
				},
				{
					title: "Defensive Parsers and Binary Input supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS3 Defensive Parsers and Binary Input. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-lls3-defensive-parsers-and-binary-input-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-lls3-defensive-parsers-and-binary-input-supplemental-2/solution"
				},
				{
					title: "Defensive Parsers and Binary Input supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS3 Defensive Parsers and Binary Input. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"Explain why sizes, indexes, and counters deserve the same attention as raw memory access. Review signed vs. unsigned values, wraparound, narrowing conversions, and the danger of using a computed size before checking it. Encourage a habit of validating ranges before arithmetic rather than after."
				},
				{
					title: "State Machines Keep Parsers Honest",
					content:
						"Model low-level programs as a series of valid states instead of one large function full of special cases. Whether the code is parsing bytes or managing a queue, explicit state transitions make it easier to reject impossible conditions and easier to test error handling."
				},
				{
					title: "Designing a Ring Buffer Safely",
					content:
						"Use a fixed-capacity byte ring buffer to teach capacity checks, wraparound, and invariants. The key security lesson is that a data structure should guard its own correctness: reject writes that exceed free capacity, reject reads that request more bytes than are available, and leave the buffer unchanged on failure."
				},
				{
					title: "Assertions, Invariants, and Audit Notes",
					content:
						"Add assertions for internal assumptions and structured return codes for input-driven failures. Document the invariants that must always hold, such as `count <= capacity` and head/tail indices staying inside bounds. This turns debugging into a process of checking contracts instead of guessing."
				},
				{
					title: "LLS4 Project 4: Ring Buffer Guards",
					content:
						"Implement a tiny byte ring buffer with guarded push and pop operations. The secure solution should preserve invariants during wraparound and reject impossible requests without corrupting state. Learners should test partial fills, exact fills, over-capacity writes, wraparound reads, and confirm that failed requests leave the logical contents untouched.",
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
						"Write a review checklist for low-level containers that includes size tracking, overflow checks, wraparound behavior, and what the object guarantees after failure. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS4-Ring-Buffer-Guards/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS4-Ring-Buffer-Guards/solution"
				},
				{
					title: "Integer Safety, State, and Defensive Data Structures supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS4 Integer Safety, State, and Defensive Data Structures. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-lls4-integer-safety-state-and-defensive-data-structures-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-lls4-integer-safety-state-and-defensive-data-structures-supplemental-2/solution"
				},
				{
					title: "Integer Safety, State, and Defensive Data Structures supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS4 Integer Safety, State, and Defensive Data Structures. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"Introduce fuzzing as automated exploration of weird inputs, not as magic. Start with a valid seed, then mutate bytes, lengths, and command fields while watching for crashes, assertion failures, or unexpected states. Keep the target local, toy-sized, and instrumented with sanitizer builds."
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
						"Create a notebook template for future bug hunts with sections for reproduction command, first failing input, sanitizer output, root cause, fix summary, and regression test name. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS5-Mini-Fuzzer/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS5-Mini-Fuzzer/solution"
				},
				{
					title: "Bug Hunting with Sanitizers and Fuzzing supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS5 Bug Hunting with Sanitizers and Fuzzing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-lls5-bug-hunting-with-sanitizers-and-fuzzing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-lls5-bug-hunting-with-sanitizers-and-fuzzing-supplemental-2/solution"
				},
				{
					title: "Bug Hunting with Sanitizers and Fuzzing supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS5 Bug Hunting with Sanitizers and Fuzzing. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
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
						"A secure patch should do three things: stop the broken behavior, preserve legitimate behavior, and add a test that proves the bug stays fixed. Warn against giant rewrites when a smaller targeted repair is sufficient. Discuss the tradeoff between quick guards and deeper refactors."
				},
				{
					title: "Code Review Heuristics for Low-Level Safety",
					content:
						"Teach a short review checklist: unchecked lengths, copies into fixed buffers, stale references after ownership changes, arithmetic on untrusted sizes, silent truncation, and missing failure paths. Encourage reviewers to leave comments that name the violated invariant rather than only pointing at syntax."
				},
				{
					title: "Documenting a Vulnerability Clearly",
					content:
						"Practice writing a concise vulnerability note with five parts: summary, affected input path, root cause, impact in the toy program, and patch/verification notes. This is useful for internal communication even when the issue never leaves a classroom setting."
				},
				{
					title: "Ethics and Responsible Security Learning",
					content:
						"Keep the course grounded in defensive learning. Students should only test code they own or toy programs specifically built for the course, avoid deploying vulnerable examples anywhere public, and use what they learn to harden software, communicate clearly, and reduce risk."
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
						"Run a classroom exercise where one student writes a bug report and another acts as the maintainer responding with reproduction questions, risk assessment, and patch verification steps. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS6-Capstone-Audit/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS6-Capstone-Audit/solution"
				},
				{
					title: "Patching, Review, and Responsible Research supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS6 Patching, Review, and Responsible Research. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-lls6-patching-review-and-responsible-research-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-lls6-patching-review-and-responsible-research-supplemental-2/solution"
				},
				{
					title: "Patching, Review, and Responsible Research supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS6 Patching, Review, and Responsible Research. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-12-lls6-patching-review-and-responsible-research-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-12-lls6-patching-review-and-responsible-research-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 7: offensive security lab 16",
			curriculum: [
				{
					title: "offensive security lab 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 7: offensive security lab 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "offensive security lab 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 7: offensive security lab 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "offensive security lab 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 7: offensive security lab 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-offensive-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-offensive-security-lab-16/solution"
				},
				{
					title: "offensive security lab 16: Review and Reflection",
					content:
						"Close Applied Studio 7: offensive security lab 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "offensive security lab 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 7: offensive security lab 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-offensive-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-offensive-security-lab-16/solution"
				},
				{
					title: "Applied Studio 7: offensive security lab 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 7: offensive security lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-13-applied-studio-7-offensive-security-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-13-applied-studio-7-offensive-security-lab-16-supplemental-2/solution"
				},
				{
					title: "Applied Studio 7: offensive security lab 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 7: offensive security lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-14-applied-studio-7-offensive-security-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-14-applied-studio-7-offensive-security-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 8: offensive security lab 17",
			curriculum: [
				{
					title: "offensive security lab 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 8: offensive security lab 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "offensive security lab 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 8: offensive security lab 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "offensive security lab 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 8: offensive security lab 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-offensive-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-offensive-security-lab-17/solution"
				},
				{
					title: "offensive security lab 17: Review and Reflection",
					content:
						"Close Applied Studio 8: offensive security lab 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "offensive security lab 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 8: offensive security lab 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-offensive-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-offensive-security-lab-17/solution"
				},
				{
					title: "Applied Studio 8: offensive security lab 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 8: offensive security lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-15-applied-studio-8-offensive-security-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-15-applied-studio-8-offensive-security-lab-17-supplemental-2/solution"
				},
				{
					title: "Applied Studio 8: offensive security lab 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 8: offensive security lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-16-applied-studio-8-offensive-security-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-16-applied-studio-8-offensive-security-lab-17-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 9: lls part 2 setup and tooling",
			curriculum: [
				{
					title: "lls part 2 setup and tooling: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 9: lls part 2 setup and tooling, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "lls part 2 setup and tooling: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 9: lls part 2 setup and tooling, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "lls part 2 setup and tooling: Core Project",
					content:
						"Build the central artifact for Applied Studio 9: lls part 2 setup and tooling. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-09-lls-part-2-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-09-lls-part-2-setup-and-tooling/solution"
				},
				{
					title: "lls part 2 setup and tooling: Review and Reflection",
					content:
						"Close Applied Studio 9: lls part 2 setup and tooling by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "lls part 2 setup and tooling: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 9: lls part 2 setup and tooling with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-09-lls-part-2-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-09-lls-part-2-setup-and-tooling/solution"
				},
				{
					title: "Applied Studio 9: lls part 2 setup and tooling supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 9: lls part 2 setup and tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-17-applied-studio-9-lls-part-2-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-17-applied-studio-9-lls-part-2-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Applied Studio 9: lls part 2 setup and tooling supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 9: lls part 2 setup and tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-18-applied-studio-9-lls-part-2-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-18-applied-studio-9-lls-part-2-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 10: module 4 information disclosure and memory obser",
			curriculum: [
				{
					title: "module 4 information disclosure and memory obser: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 10: module 4 information disclosure and memory obser, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "module 4 information disclosure and memory obser: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 10: module 4 information disclosure and memory obser, naming the key inputs, the expected outputs, and the checkpoints worth verifying early."
				},
				{
					title: "module 4 information disclosure and memory obser: Core Project",
					content:
						"Build the central artifact for Applied Studio 10: module 4 information disclosure and memory obser. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-10-module-4-information-disclosure-and-memory-observation/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-10-module-4-information-disclosure-and-memory-observation/solution"
				},
				{
					title: "module 4 information disclosure and memory obser: Review and Reflection",
					content:
						"Close Applied Studio 10: module 4 information disclosure and memory obser by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "module 4 information disclosure and memory obser: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 10: module 4 information disclosure and memory obser with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-10-module-4-information-disclosure-and-memory-observation/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-10-module-4-information-disclosure-and-memory-observation/solution"
				},
				{
					title: "Applied Studio 10: module 4 information disclosure and memory obser supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 10: module 4 information disclosure and memory obser. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-19-applied-studio-10-module-4-information-disclosure-and-memory-observation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-19-applied-studio-10-module-4-information-disclosure-and-memory-observation-supplemental-2/solution"
				},
				{
					title: "Applied Studio 10: module 4 information disclosure and memory obser supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 10: module 4 information disclosure and memory obser. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-20-applied-studio-10-module-4-information-disclosure-and-memory-observation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-20-applied-studio-10-module-4-information-disclosure-and-memory-observation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 11: module 6 control flow thinking for defenders",
			curriculum: [
				{
					title: "module 6 control flow thinking for defenders: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 11: module 6 control flow thinking for defenders, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "module 6 control flow thinking for defenders: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 11: module 6 control flow thinking for defenders, naming the key inputs, the expected outputs, and the checkpoints worth verifying early."
				},
				{
					title: "module 6 control flow thinking for defenders: Core Project",
					content:
						"Build the central artifact for Applied Studio 11: module 6 control flow thinking for defenders. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-11-module-6-control-flow-thinking-for-defenders/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-11-module-6-control-flow-thinking-for-defenders/solution"
				},
				{
					title: "module 6 control flow thinking for defenders: Review and Reflection",
					content:
						"Close Applied Studio 11: module 6 control flow thinking for defenders by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer."
				}
			],
			supplementalProjects: [
				{
					title: "module 6 control flow thinking for defenders: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 11: module 6 control flow thinking for defenders with one extra requirement, stricter input handling, or a more realistic variation of the same task.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-11-module-6-control-flow-thinking-for-defenders/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-11-module-6-control-flow-thinking-for-defenders/solution"
				},
				{
					title: "Applied Studio 11: module 6 control flow thinking for defenders supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: module 6 control flow thinking for defenders. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-21-applied-studio-11-module-6-control-flow-thinking-for-defenders-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-21-applied-studio-11-module-6-control-flow-thinking-for-defenders-supplemental-2/solution"
				},
				{
					title: "Applied Studio 11: module 6 control flow thinking for defenders supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: module 6 control flow thinking for defenders. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-22-applied-studio-11-module-6-control-flow-thinking-for-defenders-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-22-applied-studio-11-module-6-control-flow-thinking-for-defenders-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 12: low level security lab 7",
			curriculum: [
				{
					title: "low level security lab 7: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: low level security lab 7, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 7: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: low level security lab 7, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 7: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: low level security lab 7. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-low-level-security-lab-7/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-low-level-security-lab-7/solution"
				},
				{
					title: "low level security lab 7: Review and Reflection",
					content:
						"Close Applied Studio 12: low level security lab 7 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 7: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: low level security lab 7 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-low-level-security-lab-7/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-01-low-level-security-lab-7/solution"
				},
				{
					title: "Applied Studio 12: low level security lab 7 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: low level security lab 7. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-23-applied-studio-12-low-level-security-lab-7-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-23-applied-studio-12-low-level-security-lab-7-supplemental-2/solution"
				},
				{
					title: "Applied Studio 12: low level security lab 7 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: low level security lab 7. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-24-applied-studio-12-low-level-security-lab-7-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-24-applied-studio-12-low-level-security-lab-7-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 13: low level security lab 8",
			curriculum: [
				{
					title: "low level security lab 8: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: low level security lab 8, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 8: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: low level security lab 8, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 8: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: low level security lab 8. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-low-level-security-lab-8/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-low-level-security-lab-8/solution"
				},
				{
					title: "low level security lab 8: Review and Reflection",
					content:
						"Close Applied Studio 13: low level security lab 8 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 8: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: low level security lab 8 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-low-level-security-lab-8/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-02-low-level-security-lab-8/solution"
				},
				{
					title: "Applied Studio 13: low level security lab 8 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: low level security lab 8. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-25-applied-studio-13-low-level-security-lab-8-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-25-applied-studio-13-low-level-security-lab-8-supplemental-2/solution"
				},
				{
					title: "Applied Studio 13: low level security lab 8 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: low level security lab 8. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-26-applied-studio-13-low-level-security-lab-8-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-26-applied-studio-13-low-level-security-lab-8-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: low level security lab 9",
			curriculum: [
				{
					title: "low level security lab 9: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: low level security lab 9, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 9: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: low level security lab 9, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 9: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: low level security lab 9. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-low-level-security-lab-9/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-low-level-security-lab-9/solution"
				},
				{
					title: "low level security lab 9: Review and Reflection",
					content:
						"Close Applied Studio 14: low level security lab 9 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 9: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: low level security lab 9 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-low-level-security-lab-9/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-03-low-level-security-lab-9/solution"
				},
				{
					title: "Applied Studio 14: low level security lab 9 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: low level security lab 9. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-27-applied-studio-14-low-level-security-lab-9-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-27-applied-studio-14-low-level-security-lab-9-supplemental-2/solution"
				},
				{
					title: "Applied Studio 14: low level security lab 9 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: low level security lab 9. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-28-applied-studio-14-low-level-security-lab-9-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-28-applied-studio-14-low-level-security-lab-9-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: low level security lab 10",
			curriculum: [
				{
					title: "low level security lab 10: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: low level security lab 10, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 10: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: low level security lab 10, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 10: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: low level security lab 10. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-low-level-security-lab-10/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-low-level-security-lab-10/solution"
				},
				{
					title: "low level security lab 10: Review and Reflection",
					content:
						"Close Applied Studio 15: low level security lab 10 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 10: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: low level security lab 10 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-low-level-security-lab-10/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-04-low-level-security-lab-10/solution"
				},
				{
					title: "Applied Studio 15: low level security lab 10 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: low level security lab 10. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-29-applied-studio-15-low-level-security-lab-10-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-29-applied-studio-15-low-level-security-lab-10-supplemental-2/solution"
				},
				{
					title: "Applied Studio 15: low level security lab 10 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: low level security lab 10. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-30-applied-studio-15-low-level-security-lab-10-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-30-applied-studio-15-low-level-security-lab-10-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: low level security lab 11",
			curriculum: [
				{
					title: "low level security lab 11: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: low level security lab 11, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 11: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: low level security lab 11, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 11: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: low level security lab 11. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-low-level-security-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-low-level-security-lab-11/solution"
				},
				{
					title: "low level security lab 11: Review and Reflection",
					content:
						"Close Applied Studio 16: low level security lab 11 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 11: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: low level security lab 11 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-low-level-security-lab-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-05-low-level-security-lab-11/solution"
				},
				{
					title: "Applied Studio 16: low level security lab 11 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: low level security lab 11. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-31-applied-studio-16-low-level-security-lab-11-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-31-applied-studio-16-low-level-security-lab-11-supplemental-2/solution"
				},
				{
					title: "Applied Studio 16: low level security lab 11 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: low level security lab 11. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-32-applied-studio-16-low-level-security-lab-11-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-32-applied-studio-16-low-level-security-lab-11-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: low level security lab 12",
			curriculum: [
				{
					title: "low level security lab 12: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: low level security lab 12, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 12: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: low level security lab 12, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 12: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: low level security lab 12. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-low-level-security-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-low-level-security-lab-12/solution"
				},
				{
					title: "low level security lab 12: Review and Reflection",
					content:
						"Close Applied Studio 17: low level security lab 12 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 12: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: low level security lab 12 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-low-level-security-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-06-low-level-security-lab-12/solution"
				},
				{
					title: "Applied Studio 17: low level security lab 12 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: low level security lab 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-33-applied-studio-17-low-level-security-lab-12-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-33-applied-studio-17-low-level-security-lab-12-supplemental-2/solution"
				},
				{
					title: "Applied Studio 17: low level security lab 12 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: low level security lab 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-34-applied-studio-17-low-level-security-lab-12-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-34-applied-studio-17-low-level-security-lab-12-supplemental-3/solution"
				}
			]
		}
	]
};
