import type { RawCourse } from "./types";

export const lowLevelSecurityPart2Course: RawCourse = {
	name: "Low Level Security Part 2",
	modules: [
		{
			title: "LLS Part 2 Setup and Tooling",
			curriculum: [
				{
					title: "Why Part 2 Uses LLS13 through LLS18",
					content:
						"Keep the original course-outline numbering for Part 2. The source plan for this sequence defined the advanced local-lab IDs as LLS13 through LLS18, so the numbering jump is historical rather than a missing hidden module block in this catalog. There is no separate LLS7 through LLS12 sequence in the original Part 2 outline."
				},
				{
					title: "Day-One Tooling and Local-Lab Boundaries",
					content:
						"Assume a strictly local lab-only environment and make sanitizers, debugger setup, and disassembly tools part of the first session instead of an appendix. Students should verify `clang`, `lldb`, `cmake`, and `llvm-objdump` or `objdump` early so later mitigation and exploitability discussions are grounded in observable local builds rather than abstract descriptions."
				},
				{
					title: "Preferred IDEs and Platform Setup",
					content:
						"Recommend `CLion` or `VS Code` with `C/C++`, `CMake Tools`, `CodeLLDB`, and `Hex Editor` when VS Code is used. On macOS, students should install Xcode command-line tools and CMake; on Windows, WSL2 plus Ubuntu is the cleanest path so the labs stay close to the Linux-oriented debugging environment they will use most often."
				},
				{
					title: "Ethics Statement and Defensive Scope",
					content:
						"This course follows `Low Level Security Part 1` and uses tightly controlled toy programs to teach how a defensive engineer evaluates risk, not how to deploy offensive techniques. Require an explicit ethics statement at the start: local targets only, no public services, no real-world payloads, and every risky concept ends with a patch, mitigation summary, or regression case. If AI is used anywhere in the workflow, it must stay within that same defensive scope and every suggestion must be verified locally before it enters a report or patch discussion."
				},
				{
					title: "Core Outcomes for Part 2",
					content:
						"Set expectations clearly: students should distinguish a crash from an exploitable condition, explain how bug classes can lead to control-flow or data corruption, evaluate mitigations such as ASLR, NX, canaries, RELRO, and allocator behavior, and produce patch notes plus regression checks that close the bug class rather than only describing it."
				},
				{
					title: "LLS Part 2 Setup and Tooling: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rust-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rust-systems-lab-15/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Audit Notebook: Setup and Tooling",
					content:
						"Keep a written audit notebook for setup and tooling that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on sanitizer readiness, debugger verification, and ethics boundaries so students learn to communicate security relevance clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rust-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rust-systems-lab-15/solution"
				},
				{
					title: "LLS Part 2 Setup and Tooling supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS Part 2 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-01-lls-part-2-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-01-lls-part-2-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "LLS Part 2 Setup and Tooling supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to LLS Part 2 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-02-lls-part-2-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-02-lls-part-2-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 1: Exploitability Triage",
			curriculum: [
				{
					title: "Reachability, Controllability, Impact, and Attacker Assumptions",
					content:
						"Teach exploitability triage as a disciplined decision process. Students should ask whether untrusted input reaches the bug, whether the attacker can shape the failing bytes or state, what the likely impact is, and what assumptions about the environment are required before a maintainers’ note should call the issue security-relevant."
				},
				{
					title: "Crash Taxonomy for Defensive Analysis",
					content:
						"Separate harmless aborts, denial of service, memory disclosure, and memory corruption into distinct categories so students stop treating every crash as equivalent. This taxonomy matters because a null dereference, a stale debug leak, and an unchecked write may all look like “the program failed” at first glance, but they imply very different risks and priorities."
				},
				{
					title: "Write Short Exploitability Notes for Maintainers",
					content:
						"Students should learn to write concise notes that name reachability, attacker control, current mitigations, likely impact, and immediate next steps. The note should be short enough to be useful in a triage queue but concrete enough that another engineer can tell why the issue was classified as availability-only, disclosure-relevant, or corruption-relevant."
				},
				{
					title: "Project: LLS13 Crash Classification Lab",
					content:
						"Use the crash-classification lab to compare toy failures and convert them into maintainer-facing exploitability notes. The project should train students to justify their classification rather than rely on fear-driven language or vague claims about “possible exploitation.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS13-Crash-Classification-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS13-Crash-Classification-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Audit Notebook: Exploitability Triage",
					content:
						"Keep a written audit notebook for exploitability triage that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on reachability, attacker control, and why a crash does or does not rise to security relevance so students learn to communicate security relevance clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS13-Crash-Classification-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS13-Crash-Classification-Lab/solution"
				},
				{
					title: "Module 1: Exploitability Triage supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 1: Exploitability Triage. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-03-module-1-exploitability-triage-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-03-module-1-exploitability-triage-supplemental-2/solution"
				},
				{
					title: "Module 1: Exploitability Triage supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 1: Exploitability Triage. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-04-module-1-exploitability-triage-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-04-module-1-exploitability-triage-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 2: Stack Corruption in Toy Programs",
			curriculum: [
				{
					title: "Saved Return Addresses, Local Buffers, and Frame Structure",
					content:
						"Review how local buffers and nearby frame data relate conceptually so students can reason about why unchecked writes into stack-like storage are security-relevant. Keep the work inside intentionally vulnerable local toy binaries and models so the course stays focused on understanding and hardening rather than on weaponization."
				},
				{
					title: "Why Stack Corruption Can Become Control-Flow Risk",
					content:
						"Explain at a high level why corruption of adjacent frame data can matter even before any real-world control-flow hijack discussion begins. The defensive takeaway is that once attacker-shaped input can clobber bytes that influence later execution, the issue has moved well beyond a harmless crash."
				},
				{
					title: "Safer APIs, Stack Canaries, and Layered Defenses",
					content:
						"Compare safer bounded APIs and validation-first copy rules to mitigations such as stack canaries. Students should understand that canaries and hardening settings help detect or disrupt stack corruption, but they do not justify leaving unchecked copy logic in place."
				},
				{
					title: "Project: LLS14 Stack Frame Corruption Demo and Fix",
					content:
						"Use a local toy frame model to show how an oversized label or packet field can spill from a local buffer into adjacent control-shadow bytes, then patch the copy rule so oversized input is rejected before nearby frame data changes.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS14-Stack-Frame-Corruption-Demo-and-Fix/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS14-Stack-Frame-Corruption-Demo-and-Fix/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Audit Notebook: Stack Corruption in Toy Programs",
					content:
						"Keep a written audit notebook for stack corruption in toy programs that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on frame layout, overwrite reach, and which defensive change actually closes the risk so students learn to communicate security relevance clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS14-Stack-Frame-Corruption-Demo-and-Fix/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS14-Stack-Frame-Corruption-Demo-and-Fix/solution"
				},
				{
					title: "Module 2: Stack Corruption in Toy Programs supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 2: Stack Corruption in Toy Programs. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-05-module-2-stack-corruption-in-toy-programs-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-05-module-2-stack-corruption-in-toy-programs-supple/solution"
				},
				{
					title: "Module 2: Stack Corruption in Toy Programs supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 2: Stack Corruption in Toy Programs. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-06-module-2-stack-corruption-in-toy-programs-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-06-module-2-stack-corruption-in-toy-programs-supple/solution"
				}
			]
		},
		{
			title: "Module 3: Heap Lifetime and Heap Metadata Concepts",
			curriculum: [
				{
					title: "Use-After-Free, Double Free, and Stale Pointer Reuse",
					content:
						"Teach heap-lifetime issues as ownership and lifecycle failures, not as magic allocator trivia. Students should understand why stale references, repeated frees, and reused heap slots can turn ordinary bookkeeping mistakes into disclosure or corruption problems when old handles or pointers still reach new objects."
				},
				{
					title: "Ownership Mistakes That Escalate Risk",
					content:
						"Focus on the high-level transitions that matter: who owns an object, when it is released, whether references are invalidated, and whether later code can still observe or mutate the object through stale state. This is the core defensive lens for deciding when a heap bug is only a crash and when it becomes a security bug."
				},
				{
					title: "Allocator Behavior at a High Level",
					content:
						"Introduce allocator reuse and heap metadata concepts only at the level needed for defenders to reason about risk. Students should leave with a mental model that reused slots and freed objects can change who a stale reference points to, without drifting into real-world exploitation kits or public-target techniques."
				},
				{
					title: "Project: LLS15 Heap Lifetime Audit",
					content:
						"Use the heap-lifetime lab to review a toy session pool where a released slot can be reused while an old handle still exists. The patch should make lifetime rules explicit and block stale-handle access so students see how a narrow ownership fix closes an otherwise security-relevant confusion bug.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS15-Heap-Lifetime-Audit/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS15-Heap-Lifetime-Audit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Audit Notebook: Heap Lifetime and Heap Metadata Concepts",
					content:
						"Keep a written audit notebook for heap lifetime and heap metadata concepts that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on ownership boundaries, stale-handle reuse, and why allocator reuse changes the threat story so students learn to communicate security relevance clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS15-Heap-Lifetime-Audit/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS15-Heap-Lifetime-Audit/solution"
				},
				{
					title: "Module 3: Heap Lifetime and Heap Metadata Concepts supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 3: Heap Lifetime and Heap Metadata Concepts. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-module-3-heap-lifetime-and-heap-metadata-concept/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-module-3-heap-lifetime-and-heap-metadata-concept/solution"
				},
				{
					title: "Module 3: Heap Lifetime and Heap Metadata Concepts supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 3: Heap Lifetime and Heap Metadata Concepts. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-module-3-heap-lifetime-and-heap-metadata-concept/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-module-3-heap-lifetime-and-heap-metadata-concept/solution"
				}
			]
		},
		{
			title: "Module 4: Information Disclosure and Memory Observation",
			curriculum: [
				{
					title: "Uninitialized Reads, Oversized Reads, and Stale Data Disclosure",
					content:
						"Teach disclosure bugs as trust-boundary problems where bytes that should stay internal cross into logs, responses, or other observable outputs. Students should recognize that a leak can matter even when the program does not crash, because addresses, object contents, and stale internal notes can still change the risk profile of a later bug."
				},
				{
					title: "Why Leaked Addresses or Object Contents Matter",
					content:
						"Explain that leaked addresses, stale session data, or internal debug strings increase attacker knowledge and reduce uncertainty. The course should keep this defensive and local, focusing on why maintainers should prioritize disclosure and harden the boundary rather than on how to weaponize the information."
				},
				{
					title: "Harden Logs, Debug Output, and Serialization Boundaries",
					content:
						"Use toy serializers and debug paths to show how disclosure bugs often come from reused buffers, unbounded lengths, or diagnostic content crossing into public output. The fix pattern is usually straightforward: clear internal state, serialize only intended public bytes, and ensure logs or diagnostics are scoped to the right audience."
				},
				{
					title: "Module 4: Information Disclosure and Memory Observation: Verification and Reflection",
					content:
						"Close Module 4: Information Disclosure and Memory Observation by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "Module 4: Information Disclosure and Memory Observation: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rust-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rust-systems-lab-16/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Audit Notebook: Information Disclosure and Memory Observation",
					content:
						"Keep a written audit notebook for information disclosure and memory observation that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on what crossed the trust boundary, what leaked, and how to prove the leak is gone after the patch so students learn to communicate security relevance clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rust-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rust-systems-lab-16/solution"
				},
				{
					title: "Module 4: Information Disclosure and Memory Observation supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 4: Information Disclosure and Memory Observation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-09-module-4-information-disclosure-and-memory-obser/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-09-module-4-information-disclosure-and-memory-obser/solution"
				},
				{
					title: "Module 4: Information Disclosure and Memory Observation supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 4: Information Disclosure and Memory Observation. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-10-module-4-information-disclosure-and-memory-obser-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-10-module-4-information-disclosure-and-memory-obser-2/solution"
				}
			]
		},
		{
			title: "Module 5: Mitigation-Aware Analysis",
			curriculum: [
				{
					title: "NX, ASLR, PIE, RELRO, Stack Canaries, and Hardened Allocators",
					content:
						"Introduce common mitigations as factors that change exploitability analysis, not as excuses to ignore the underlying bug. Students should know what NX, ASLR, PIE, RELRO, stack canaries, and hardened allocators are trying to prevent or make harder, and how those mitigations change the confidence and wording of a triage note."
				},
				{
					title: "Mitigations Shrink the Attack Surface but Do Not Replace Fixes",
					content:
						"Stress that mitigation-aware analysis is still bug analysis. A corruption bug in a hardened build may be harder to exploit than the same bug in a softer build, but the code still needs a patch and a regression case because mitigations reduce likelihood, not obligation."
				},
				{
					title: "Verify Protections in a Binary Build",
					content:
						"Teach students to inspect actual build outputs so mitigation talk stays tied to evidence. At a beginner level, that means looking for compile-time and build-time signs of PIE, sanitizers, stack protectors, or related hardening settings and recording the comparison in a small build matrix rather than relying on assumptions."
				},
				{
					title: "Project: LLS16 Mitigation Comparison Build Matrix",
					content:
						"Use the build-matrix lab to compare at least two local builds of the same toy binary and record how the observed mitigation set changes the analysis story. The point is to practice verification and nuance, not to treat hardening flags as a substitute for safer code.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS16-Mitigation-Comparison-Build-Matrix/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS16-Mitigation-Comparison-Build-Matrix/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Audit Notebook: Mitigation-Aware Analysis",
					content:
						"Keep a written audit notebook for mitigation-aware analysis that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on which protections were actually observed and how they changed the maintainer-facing risk note so students learn to communicate security relevance clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS16-Mitigation-Comparison-Build-Matrix/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS16-Mitigation-Comparison-Build-Matrix/solution"
				},
				{
					title: "Module 5: Mitigation Aware Analysis supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 5: Mitigation-Aware Analysis. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-11-module-5-mitigation-aware-analysis-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-11-module-5-mitigation-aware-analysis-supplemental-/solution"
				},
				{
					title: "Module 5: Mitigation Aware Analysis supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 5: Mitigation-Aware Analysis. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-12-module-5-mitigation-aware-analysis-supplemental-/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-12-module-5-mitigation-aware-analysis-supplemental-/solution"
				}
			]
		},
		{
			title: "Module 6: Control-Flow Thinking for Defenders",
			curriculum: [
				{
					title: "High-Level Introduction to Return-Oriented Thinking",
					content:
						"Introduce return-oriented thinking only at a high defensive level: if corruption reaches control-relevant state, modern exploitation often chains existing code rather than injecting new code directly. The course should use this to motivate why control-flow integrity, stack protection, and safer programming models matter, not to teach offensive construction techniques."
				},
				{
					title: "Why Control-Flow Integrity Matters",
					content:
						"Use the control-flow discussion to help students explain why certain corruption bugs demand urgent fixes even when a classroom demo only shows a crash or a shadow overwrite. The defensive point is that once control-relevant bytes are exposed to attacker-shaped input, integrity assumptions about future execution are weakened."
				},
				{
					title: "Why Modern Mitigations and Safer Languages Are Valuable",
					content:
						"Connect the previous modules to language and platform choice. Students should understand why mitigations, safer libraries, and safer languages meaningfully reduce risk, while still recognizing that legacy native code and performance-sensitive systems often require disciplined hardening rather than complete rewrites."
				},
				{
					title: "Module 6: Control-Flow Thinking for Defenders: Verification and Reflection",
					content:
						"Close Module 6: Control-Flow Thinking for Defenders by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass."
				},
				{
					title: "Module 6: Control-Flow Thinking for Defenders: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rust-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rust-systems-lab-17/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Audit Notebook: Control-Flow Thinking for Defenders",
					content:
						"Keep a written audit notebook for control-flow thinking for defenders that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on why control-relevant state changes the severity discussion even when the lab stays fully local so students learn to communicate security relevance clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rust-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rust-systems-lab-17/solution"
				},
				{
					title: "Module 6: Control Flow Thinking for Defenders supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 6: Control-Flow Thinking for Defenders. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-13-module-6-control-flow-thinking-for-defenders-sup/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-13-module-6-control-flow-thinking-for-defenders-sup/solution"
				},
				{
					title: "Module 6: Control Flow Thinking for Defenders supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 6: Control-Flow Thinking for Defenders. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-14-module-6-control-flow-thinking-for-defenders-sup/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-14-module-6-control-flow-thinking-for-defenders-sup/solution"
				}
			]
		},
		{
			title: "Module 7: From Bug Report to Patch",
			curriculum: [
				{
					title: "Reproduce, Assess, Prioritize, Patch, and Add a Regression",
					content:
						"Teach the complete defensive workflow as a loop: reproduce the bug, assess exploitability, prioritize it, patch narrowly, and add a regression case. Students should see this as the operational counterpart to exploitability analysis, because a precise triage note without a precise patch path still leaves the team exposed."
				},
				{
					title: "Communicate Clearly About Security-Relevant Bugs",
					content:
						"Practice writing maintainable communication: summary, affected path, root cause, impact, mitigation context, fix summary, and regression proof. The target audience is another engineer or maintainer who needs enough information to act confidently without a wall of vague security language."
				},
				{
					title: "Use AI to Accelerate Triage, Not Replace Evidence",
					content:
						"Teach AI as a narrow assistant for defensive work: summarize sanitizer output, propose regression cases, help structure disclosure notes, compare two patch options, or convert a long debugging session into a clearer maintainer-facing report. Students should also learn the limits: AI can hallucinate exploitability claims, miss the real root cause, or suggest unsafe follow-ups, so every claim must still be checked against the local toy binary, debugger output, sanitizer evidence, and the written lab boundary."
				},
				{
					title: "Patch Notes Should Close the Bug Class",
					content:
						"Students should learn to describe not only what line changed, but what assumption was invalid and how the patch changes the invariant. This helps prevent shallow fixes that silence one reproduction case while leaving the bug class alive elsewhere in the codebase."
				},
				{
					title: "Project: LLS17 Disclosure and Triage Report",
					content:
						"Use the disclosure lab to patch a toy public serializer that leaks stale internal bytes, then write a short triage report that explains the root cause, the disclosure impact, and the regression case proving the boundary is now hardened.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS17-Disclosure-and-Triage-Report/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS17-Disclosure-and-Triage-Report/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Audit Notebook: From Bug Report to Patch",
					content:
						"Keep a written audit notebook for from bug report to patch that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on how the triage note, patch summary, and regression case reinforce each other so students learn to communicate security relevance clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS17-Disclosure-and-Triage-Report/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS17-Disclosure-and-Triage-Report/solution"
				},
				{
					title: "Module 7: From Bug Report to Patch supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 7: From Bug Report to Patch. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-15-module-7-from-bug-report-to-patch-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-15-module-7-from-bug-report-to-patch-supplemental-2/solution"
				},
				{
					title: "Module 7: From Bug Report to Patch supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 7: From Bug Report to Patch. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-16-module-7-from-bug-report-to-patch-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-16-module-7-from-bug-report-to-patch-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 8: Capstone Audit",
			curriculum: [
				{
					title: "Review a Larger Intentionally Flawed Toy Codebase",
					content:
						"The capstone should combine multiple bug classes in one local-only toy system so students must move beyond one-bug-one-technique thinking. They should identify the issues, explain the trust boundaries, and rank the findings based on impact and attacker assumptions rather than on how dramatic the output looks."
				},
				{
					title: "Rank Findings, Patch, and Verify",
					content:
						"Require students to rank the findings, patch them, and verify the fixes with explicit checks. The capstone is not complete when the output “looks better”; it is complete when the findings are prioritized, the patches are justified, and the regression evidence shows the bug classes are actually closed."
				},
				{
					title: "Deliver an Audit Packet and Mitigation Summary",
					content:
						"The final deliverable should be an audit packet and mitigation summary, not an exploit. That packet should include the ethics statement, findings ranked by impact, attacker assumptions, the mitigations observed, the patch list, and the regression results that justify closing the issue set."
				},
				{
					title: "Project: LLS18 Exploit-Informed Hardening Capstone",
					content:
						"Use the capstone starter to review a larger intentionally flawed toy system that mixes stack-like corruption, stale-handle reuse, and disclosure boundaries. The solution should demonstrate how exploit-informed analysis leads to narrow hardening patches and a clearer mitigation summary without ever leaving the local lab scope.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS18-Exploit-Informed-Hardening-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS18-Exploit-Informed-Hardening-Capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Audit Notebook: Capstone Audit",
					content:
						"Keep a written audit notebook for capstone audit that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on finding ranking, patch scope, mitigation notes, and regression proof so students learn to communicate security relevance clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS18-Exploit-Informed-Hardening-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS18-Exploit-Informed-Hardening-Capstone/solution"
				},
				{
					title: "Module 8: Capstone Audit supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 8: Capstone Audit. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-17-module-8-capstone-audit-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-17-module-8-capstone-audit-supplemental-2/solution"
				},
				{
					title: "Module 8: Capstone Audit supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Module 8: Capstone Audit. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-18-module-8-capstone-audit-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-18-module-8-capstone-audit-supplemental-3/solution"
				}
			]
		},
		{
			title: "Applied Studio 10: low level security lab 13",
			curriculum: [
				{
					title: "low level security lab 13: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 10: low level security lab 13, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 13: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 10: low level security lab 13, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 13: Core Project",
					content:
						"Build the central artifact for Applied Studio 10: low level security lab 13. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-low-level-security-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-low-level-security-lab-13/solution"
				},
				{
					title: "low level security lab 13: Review and Reflection",
					content:
						"Close Applied Studio 10: low level security lab 13 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 13: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 10: low level security lab 13 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-low-level-security-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-low-level-security-lab-13/solution"
				},
				{
					title: "Applied Studio 10: low level security lab 13 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 10: low level security lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-19-applied-studio-10-low-level-security-lab-13-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-19-applied-studio-10-low-level-security-lab-13-supp/solution"
				},
				{
					title: "Applied Studio 10: low level security lab 13 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 10: low level security lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-20-applied-studio-10-low-level-security-lab-13-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-20-applied-studio-10-low-level-security-lab-13-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 11: low level security lab 14",
			curriculum: [
				{
					title: "low level security lab 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 11: low level security lab 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 11: low level security lab 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 11: low level security lab 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-low-level-security-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-low-level-security-lab-14/solution"
				},
				{
					title: "low level security lab 14: Review and Reflection",
					content:
						"Close Applied Studio 11: low level security lab 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 11: low level security lab 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-low-level-security-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-low-level-security-lab-14/solution"
				},
				{
					title: "Applied Studio 11: low level security lab 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: low level security lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-21-applied-studio-11-low-level-security-lab-14-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-21-applied-studio-11-low-level-security-lab-14-supp/solution"
				},
				{
					title: "Applied Studio 11: low level security lab 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 11: low level security lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-22-applied-studio-11-low-level-security-lab-14-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-22-applied-studio-11-low-level-security-lab-14-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 12: low level security lab 15",
			curriculum: [
				{
					title: "low level security lab 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: low level security lab 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: low level security lab 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: low level security lab 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-low-level-security-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-low-level-security-lab-15/solution"
				},
				{
					title: "low level security lab 15: Review and Reflection",
					content:
						"Close Applied Studio 12: low level security lab 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: low level security lab 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-low-level-security-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-low-level-security-lab-15/solution"
				},
				{
					title: "Applied Studio 12: low level security lab 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: low level security lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-23-applied-studio-12-low-level-security-lab-15-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-23-applied-studio-12-low-level-security-lab-15-supp/solution"
				},
				{
					title: "Applied Studio 12: low level security lab 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 12: low level security lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-24-applied-studio-12-low-level-security-lab-15-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-24-applied-studio-12-low-level-security-lab-15-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 13: low level security lab 16",
			curriculum: [
				{
					title: "low level security lab 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: low level security lab 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: low level security lab 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: low level security lab 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-low-level-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-low-level-security-lab-16/solution"
				},
				{
					title: "low level security lab 16: Review and Reflection",
					content:
						"Close Applied Studio 13: low level security lab 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: low level security lab 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-low-level-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-low-level-security-lab-16/solution"
				},
				{
					title: "Applied Studio 13: low level security lab 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: low level security lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-25-applied-studio-13-low-level-security-lab-16-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-25-applied-studio-13-low-level-security-lab-16-supp/solution"
				},
				{
					title: "Applied Studio 13: low level security lab 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 13: low level security lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-26-applied-studio-13-low-level-security-lab-16-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-26-applied-studio-13-low-level-security-lab-16-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: low level security lab 17",
			curriculum: [
				{
					title: "low level security lab 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: low level security lab 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "low level security lab 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: low level security lab 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "low level security lab 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: low level security lab 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-low-level-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-low-level-security-lab-17/solution"
				},
				{
					title: "low level security lab 17: Review and Reflection",
					content:
						"Close Applied Studio 14: low level security lab 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "low level security lab 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: low level security lab 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-low-level-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-low-level-security-lab-17/solution"
				},
				{
					title: "Applied Studio 14: low level security lab 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: low level security lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-27-applied-studio-14-low-level-security-lab-17-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-27-applied-studio-14-low-level-security-lab-17-supp/solution"
				},
				{
					title: "Applied Studio 14: low level security lab 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: low level security lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-28-applied-studio-14-low-level-security-lab-17-supp/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-28-applied-studio-14-low-level-security-lab-17-supp/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: rust systems lab 12",
			curriculum: [
				{
					title: "rust systems lab 12: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: rust systems lab 12, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "rust systems lab 12: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: rust systems lab 12, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "rust systems lab 12: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: rust systems lab 12. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rust-systems-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rust-systems-lab-12/solution"
				},
				{
					title: "rust systems lab 12: Review and Reflection",
					content:
						"Close Applied Studio 15: rust systems lab 12 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "rust systems lab 12: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: rust systems lab 12 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rust-systems-lab-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rust-systems-lab-12/solution"
				},
				{
					title: "Applied Studio 15: rust systems lab 12 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: rust systems lab 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-29-applied-studio-15-rust-systems-lab-12-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-29-applied-studio-15-rust-systems-lab-12-supplement/solution"
				},
				{
					title: "Applied Studio 15: rust systems lab 12 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: rust systems lab 12. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-30-applied-studio-15-rust-systems-lab-12-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-30-applied-studio-15-rust-systems-lab-12-supplement/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: rust systems lab 13",
			curriculum: [
				{
					title: "rust systems lab 13: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: rust systems lab 13, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "rust systems lab 13: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: rust systems lab 13, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "rust systems lab 13: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: rust systems lab 13. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rust-systems-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rust-systems-lab-13/solution"
				},
				{
					title: "rust systems lab 13: Review and Reflection",
					content:
						"Close Applied Studio 16: rust systems lab 13 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "rust systems lab 13: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: rust systems lab 13 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rust-systems-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rust-systems-lab-13/solution"
				},
				{
					title: "Applied Studio 16: rust systems lab 13 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: rust systems lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-31-applied-studio-16-rust-systems-lab-13-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-31-applied-studio-16-rust-systems-lab-13-supplement/solution"
				},
				{
					title: "Applied Studio 16: rust systems lab 13 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: rust systems lab 13. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-32-applied-studio-16-rust-systems-lab-13-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-32-applied-studio-16-rust-systems-lab-13-supplement/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: rust systems lab 14",
			curriculum: [
				{
					title: "rust systems lab 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: rust systems lab 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "rust systems lab 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: rust systems lab 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "rust systems lab 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: rust systems lab 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rust-systems-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rust-systems-lab-14/solution"
				},
				{
					title: "rust systems lab 14: Review and Reflection",
					content:
						"Close Applied Studio 17: rust systems lab 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "rust systems lab 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: rust systems lab 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rust-systems-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rust-systems-lab-14/solution"
				},
				{
					title: "Applied Studio 17: rust systems lab 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: rust systems lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-33-applied-studio-17-rust-systems-lab-14-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-33-applied-studio-17-rust-systems-lab-14-supplement/solution"
				},
				{
					title: "Applied Studio 17: rust systems lab 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: rust systems lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-34-applied-studio-17-rust-systems-lab-14-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-34-applied-studio-17-rust-systems-lab-14-supplement/solution"
				}
			]
		}
	]
};
