import type { RawCourse } from "./types";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

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

	if (source.includes("setup") || source.includes("tooling")) {
		return "toolchain verification, sanitizer readiness, debugger setup, ethics boundaries, and repeatable local build commands";
	}
	if (source.includes("exploitability") || source.includes("triage")) {
		return "reachability, attacker-controlled input, observed mitigations, impact classification, and maintainer-facing risk notes";
	}
	if (source.includes("stack")) {
		return "frame-layout reasoning, overwrite reach, safer copy rules, stack canary context, and a patch that rejects oversized input";
	}
	if (source.includes("heap") || source.includes("lifetime")) {
		return "ownership transitions, stale handles, slot reuse, invalidation rules, and regression checks for use-after-release behavior";
	}
	if (
		source.includes("disclosure") ||
		source.includes("memory observation")
	) {
		return "trust-boundary output, stale or unintended bytes, logging and serialization controls, and proof that the leak is closed";
	}
	if (source.includes("mitigation")) {
		return "binary hardening evidence, build-matrix comparison, mitigation-aware wording, and the distinction between reduced likelihood and fixed code";
	}
	if (source.includes("control-flow")) {
		return "control-relevant state, integrity assumptions, defensive mitigation reasoning, and safe high-level analysis without offensive construction";
	}
	if (source.includes("bug report") || source.includes("patch")) {
		return "reproduction notes, root-cause analysis, patch scope, regression proof, and concise maintainer communication";
	}
	if (source.includes("capstone")) {
		return "finding ranking, attacker assumptions, patch justification, mitigation summaries, and regression evidence across multiple bug classes";
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
			"1. Define the advanced fixture, exploitability question, mitigation state, and evidence source before touching the code.",
			"2. Reproduce the issue or risk classification with current sanitizer, debugger, hardening, or trace evidence.",
			"3. Patch or constrain the behavior, then rerun the original case, a boundary case, and a regression case.",
			"4. Write a maintainer-facing note that distinguishes reachability, impact, mitigation, and remaining uncertainty."
		],
		[
			"1. Name the local target, controlled input, hardening or mitigation assumption, and rollback path.",
			"2. Record baseline evidence before changing the fixture, build flags, parser logic, lifetime rule, or report format.",
			"3. Verify normal behavior, failure-shaped behavior, and the final defensive result after the change.",
			"4. Summarize the bug class, defensive value, and evidence that would let another maintainer reproduce the conclusion."
		],
		[
			"1. Write the scope line first: authorized fixture, allowed tools, observed data, stop condition, and reset command.",
			"2. Collect the smallest useful trace, crash, warning, log, or binary-hardening evidence for the question being studied.",
			"3. Apply a narrow fix, configuration, or documentation change and retest the evidence path that exposed the issue.",
			"4. Close with an audit note naming root cause, proof of fix, prevention idea, and one limitation."
		]
	][variant];
	const completionChecks = [
		[
			"- The work stays inside the provided local lab and does not target public systems.",
			"- Security claims are backed by local build, runtime, sanitizer, debugger, or test evidence.",
			"- The final note explains the bug class or invariant well enough for a maintainer to reproduce and verify the result."
		],
		[
			"- The fixture, toolchain, stop condition, and reset path are documented.",
			"- The evidence separates observed behavior from exploitability, impact, and mitigation claims.",
			"- Record what the patch or hardening step proves and what it does not prove."
		],
		[
			"- Baseline, failure-shaped, and post-change evidence can be rerun in the local lab.",
			"- The conclusion is supported by sanitizer, debugger, trace, log, build, or binary-hardening evidence.",
			"- The final note states the remaining limitation without expanding beyond the approved target."
		],
		[
			"- The lab remains local, reversible, and defensive in purpose.",
			"- The same evidence path that exposed the problem is used to verify the fix or mitigation.",
			"- The final note is written for a maintainer: root cause, impact, remediation, verification, and prevention."
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
						"Assume a strictly local lab-only environment and make sanitizers, debugger setup, and disassembly tools part of the opening setup instead of an appendix. Verify `clang`, `lldb`, `cmake`, and `llvm-objdump` or `objdump` early so later mitigation and exploitability discussions are grounded in observable local builds rather than abstract descriptions."
				},
				{
					title: "Preferred IDEs and Platform Setup",
					content:
						"Recommend `CLion` or `VS Code` with `C/C++`, `CMake Tools`, `CodeLLDB`, and `Hex Editor` when VS Code is used. On macOS, Install Xcode command-line tools and CMake; on Windows, WSL2 plus Ubuntu is the cleanest path so the labs stay close to the Linux-oriented debugging environment they will use most often."
				},
				{
					title: "Ethics Statement and Defensive Scope",
					content:
						"This course follows `Low Level Security Part 1` and uses tightly controlled toy programs to show how a defensive engineer evaluates risk, not how to deploy offensive techniques. The opening ethics statement should make the boundary explicit: local targets only, no public services, no real-world payloads, and every risky concept ends with a patch, mitigation summary, or regression case. If AI is used anywhere in the workflow, it must stay within that same defensive scope and every suggestion must be verified locally before it enters a report or patch discussion."
				},
				{
					title: "Core Outcomes for Part 2",
					content:
						"The goal is precise vulnerability reasoning: distinguish a crash from an exploitable condition, explain how bug classes can lead to control-flow or data corruption, evaluate mitigations such as ASLR, NX, canaries, RELRO, and allocator behavior, and produce patch notes plus regression checks that close the bug class rather than only describing it."
				},
				{
					title: "LLS Part 2 Setup and Tooling: Core Project",
					content: securityLabProjectContent(
						"LLS Part 2 Setup and Tooling",
						"core"
					),
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
						"Keep a written audit notebook for setup and tooling that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on sanitizer readiness, debugger verification, and ethics boundaries so security relevance is communicated clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rust-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rust-systems-lab-15/solution"
				},
				{
					title: "LLS Part 2 Setup and Tooling Supplemental 2",
					content: securityLabProjectContent(
						"LLS Part 2 Setup and Tooling",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-01-lls-part-2-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-01-lls-part-2-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "LLS Part 2 Setup and Tooling Supplemental 3",
					content: securityLabProjectContent(
						"LLS Part 2 Setup and Tooling",
						"extension"
					),
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
						"This section covers exploitability triage as a disciplined decision process. The triage decision checks whether untrusted input reaches the bug, whether the attacker can shape the failing bytes or state, what the likely impact is, and what assumptions about the environment are required before a maintainers' note should call the issue security-relevant."
				},
				{
					title: "Crash Taxonomy for Defensive Analysis",
					content:
						"Separate harmless aborts, denial of service, memory disclosure, and memory corruption into distinct categories instead of treating every crash as equivalent. This taxonomy matters because a null dereference, a stale debug leak, and an unchecked write may all look like “the program failed” at first glance, but they imply very different risks and priorities."
				},
				{
					title: "Write Short Exploitability Notes for Maintainers",
					content:
						"Skill target: Write concise notes that name reachability, attacker control, current mitigations, likely impact, and immediate next steps. The note should be short enough to be useful in a triage queue but concrete enough that another engineer can tell why the issue was classified as availability-only, disclosure-relevant, or corruption-relevant."
				},
				{
					title: "Project: LLS13 Crash Classification Lab",
					content:
						"Use the crash-classification lab to compare toy failures and convert them into maintainer-facing exploitability notes. The project should require justified classification rather than fear-driven language or vague claims about “possible exploitation.”",
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
						"Keep a written audit notebook for exploitability triage that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on reachability, attacker control, and why a crash does or does not rise to security relevance so security relevance is communicated clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS13-Crash-Classification-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS13-Crash-Classification-Lab/solution"
				},
				{
					title: "Module 1: Exploitability Triage Supplemental 2",
					content: securityLabProjectContent(
						"Module 1: Exploitability Triage",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-03-module-1-exploitability-triage-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-03-module-1-exploitability-triage-supplemental-2/solution"
				},
				{
					title: "Module 1: Exploitability Triage Supplemental 3",
					content: securityLabProjectContent(
						"Module 1: Exploitability Triage",
						"extension"
					),
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
						"Review how local buffers and nearby frame data relate conceptually and why unchecked writes into stack-like storage are security-relevant. Keep the work inside intentionally vulnerable local toy binaries and models so the focus stays on understanding and hardening rather than on weaponization."
				},
				{
					title: "Why Stack Corruption Can Become Control-Flow Risk",
					content:
						"Explain at a high level why corruption of adjacent frame data can matter even before any real-world control-flow hijack discussion begins. The defensive takeaway is that once attacker-shaped input can clobber bytes that influence later execution, the issue has moved well beyond a harmless crash."
				},
				{
					title: "Safer APIs, Stack Canaries, and Layered Defenses",
					content:
						"Compare safer bounded APIs and validation-first copy rules to mitigations such as stack canaries. Key idea: Canaries and hardening settings help detect or disrupt stack corruption, but they do not justify leaving unchecked copy logic in place."
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
						"Keep a written audit notebook for stack corruption in toy programs that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on frame layout, overwrite reach, and which defensive change actually closes the risk so security relevance is communicated clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS14-Stack-Frame-Corruption-Demo-and-Fix/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS14-Stack-Frame-Corruption-Demo-and-Fix/solution"
				},
				{
					title: "Module 2: Stack Corruption in Toy Programs Supplemental 2",
					content: securityLabProjectContent(
						"Module 2: Stack Corruption in Toy Programs",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-05-module-2-stack-corruption-in-toy-programs-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-05-module-2-stack-corruption-in-toy-programs-supplemental-2/solution"
				},
				{
					title: "Module 2: Stack Corruption in Toy Programs Supplemental 3",
					content: securityLabProjectContent(
						"Module 2: Stack Corruption in Toy Programs",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-06-module-2-stack-corruption-in-toy-programs-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-06-module-2-stack-corruption-in-toy-programs-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 3: Heap Lifetime and Heap Metadata Concepts",
			curriculum: [
				{
					title: "Use-After-Free, Double Free, and Stale Pointer Reuse",
					content:
						"This section covers heap-lifetime issues as ownership and lifecycle failures, not as magic allocator trivia. Key idea: Why stale references, repeated frees, and reused heap slots can turn ordinary bookkeeping mistakes into disclosure or corruption problems when old handles or pointers still reach new objects."
				},
				{
					title: "Ownership Mistakes That Escalate Risk",
					content:
						"Focus on the high-level transitions that matter: who owns an object, when it is released, whether references are invalidated, and whether later code can still observe or mutate the object through stale state. This is the core defensive lens for deciding when a heap bug is only a crash and when it becomes a security bug."
				},
				{
					title: "Allocator Behavior at a High Level",
					content:
						"Allocator reuse and heap metadata concepts matter at the level needed for defenders to reason about risk. The mental model is that reused slots and freed objects can change who a stale reference points to, without drifting into real-world exploitation kits or public-target techniques."
				},
				{
					title: "Project: LLS15 Heap Lifetime Audit",
					content:
						"Use the heap-lifetime lab to review a toy session pool where a released slot can be reused while an old handle still exists. The patch should make lifetime rules explicit and block stale-handle access so the ownership fix clearly closes an otherwise security-relevant confusion bug.",
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
						"Keep a written audit notebook for heap lifetime and heap metadata concepts that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on ownership boundaries, stale-handle reuse, and why allocator reuse changes the threat story so the security relevance is communicated clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS15-Heap-Lifetime-Audit/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS15-Heap-Lifetime-Audit/solution"
				},
				{
					title: "Module 3: Heap Lifetime and Heap Metadata Concepts Supplemental 2",
					content: securityLabProjectContent(
						"Module 3: Heap Lifetime and Heap Metadata Concepts",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-module-3-heap-lifetime-and-heap-metadata-concepts-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-07-module-3-heap-lifetime-and-heap-metadata-concepts-supplemental-2/solution"
				},
				{
					title: "Module 3: Heap Lifetime and Heap Metadata Concepts Supplemental 3",
					content: securityLabProjectContent(
						"Module 3: Heap Lifetime and Heap Metadata Concepts",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-module-3-heap-lifetime-and-heap-metadata-concepts-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-08-module-3-heap-lifetime-and-heap-metadata-concepts-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 4: Information Disclosure and Memory Observation",
			curriculum: [
				{
					title: "Uninitialized Reads, Oversized Reads, and Stale Data Disclosure",
					content:
						"This section covers disclosure bugs as trust-boundary problems where bytes that should stay internal cross into logs, responses, or other observable outputs. Recognize that a leak can matter even when the program does not crash, because addresses, object contents, and stale internal notes can still change the risk profile of a later bug."
				},
				{
					title: "Why Leaked Addresses or Object Contents Matter",
					content:
						"Leaked addresses, stale session data, or internal debug strings increase attacker knowledge and reduce uncertainty. The course keeps this defensive and local, focusing on why maintainers should prioritize disclosure and harden the boundary rather than on how to weaponize the information."
				},
				{
					title: "Harden Logs, Debug Output, and Serialization Boundaries",
					content:
						"Use toy serializers and debug paths to show how disclosure bugs often come from reused buffers, unbounded lengths, or diagnostic content crossing into public output. The fix pattern is usually straightforward: clear internal state, serialize only intended public bytes, and ensure logs or diagnostics are scoped to the right audience."
				},
				{
					title: "Module 4: Information Disclosure and Memory Observation: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "security",
						moduleTitle:
							"Module 4: Information Disclosure and Memory Observation",
						section: "verification"
					})
				},
				{
					title: "Module 4: Information Disclosure and Memory Observation: Core Project",
					content: securityLabProjectContent(
						"Module 4: Information Disclosure and Memory Observation",
						"core"
					),
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
						"Keep a written audit notebook for information disclosure and memory observation that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on what crossed the trust boundary, what leaked, and how to prove the leak is gone after the patch so security relevance is communicated clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rust-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rust-systems-lab-16/solution"
				},
				{
					title: "Module 4: Information Disclosure and Memory Observation Supplemental 2",
					content: securityLabProjectContent(
						"Module 4: Information Disclosure and Memory Observation",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-09-module-4-information-disclosure-and-memory-observation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-09-module-4-information-disclosure-and-memory-observation-supplemental-2/solution"
				},
				{
					title: "Module 4: Information Disclosure and Memory Observation Supplemental 3",
					content: securityLabProjectContent(
						"Module 4: Information Disclosure and Memory Observation",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-10-module-4-information-disclosure-and-memory-observation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-10-module-4-information-disclosure-and-memory-observation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 5: Mitigation-Aware Analysis",
			curriculum: [
				{
					title: "NX, ASLR, PIE, RELRO, Stack Canaries, and Hardened Allocators",
					content:
						"Common mitigations are factors that change exploitability analysis, not excuses to ignore the underlying bug. Key idea: What NX, ASLR, PIE, RELRO, stack canaries, and hardened allocators are trying to prevent or make harder, and how those mitigations change the confidence and wording of a triage note."
				},
				{
					title: "Mitigations Shrink the Attack Surface but Do Not Replace Fixes",
					content:
						"Stress that mitigation-aware analysis is still bug analysis. A corruption bug in a hardened build may be harder to exploit than the same bug in a softer build, but the code still needs a patch and a regression case because mitigations reduce likelihood, not obligation."
				},
				{
					title: "Verify Protections in a Binary Build",
					content:
						"Inspect actual build outputs so mitigation talk stays tied to evidence. At a beginner level, that means looking for compile-time and build-time signs of PIE, sanitizers, stack protectors, or related hardening settings and recording the comparison in a small build matrix rather than relying on assumptions."
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
						"Keep a written audit notebook for mitigation-aware analysis that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on which protections were actually observed and how they changed the maintainer-facing risk note so security relevance is communicated clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS16-Mitigation-Comparison-Build-Matrix/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS16-Mitigation-Comparison-Build-Matrix/solution"
				},
				{
					title: "Module 5: Mitigation Aware Analysis Supplemental 2",
					content: securityLabProjectContent(
						"Module 5: Mitigation-Aware Analysis",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-11-module-5-mitigation-aware-analysis-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-11-module-5-mitigation-aware-analysis-supplemental-2/solution"
				},
				{
					title: "Module 5: Mitigation Aware Analysis Supplemental 3",
					content: securityLabProjectContent(
						"Module 5: Mitigation-Aware Analysis",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-12-module-5-mitigation-aware-analysis-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-12-module-5-mitigation-aware-analysis-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 6: Control-Flow Thinking for Defenders",
			curriculum: [
				{
					title: "High-Level Introduction to Return-Oriented Thinking",
					content:
						"Return-oriented thinking belongs only at a high defensive level: if corruption reaches control-relevant state, modern exploitation often chains existing code rather than injecting new code directly. The concept motivates why control-flow integrity, stack protection, and safer programming models matter; it does not require offensive construction techniques."
				},
				{
					title: "Why Control-Flow Integrity Matters",
					content:
						"Control-flow integrity explains why certain corruption bugs demand urgent fixes even when a classroom demo only shows a crash or a shadow overwrite. The defensive point is that once control-relevant bytes are exposed to attacker-shaped input, integrity assumptions about future execution are weakened."
				},
				{
					title: "Why Modern Mitigations and Safer Languages Are Valuable",
					content:
						"Connect the previous modules to language and platform choice. Key idea: Why mitigations, safer libraries, and safer languages meaningfully reduce risk, while still recognizing that legacy native code and performance-sensitive systems often require disciplined hardening rather than complete rewrites."
				},
				{
					title: "Module 6: Control-Flow Thinking for Defenders: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "security",
						moduleTitle:
							"Module 6: Control-Flow Thinking for Defenders",
						section: "verification"
					})
				},
				{
					title: "Module 6: Control-Flow Thinking for Defenders: Core Project",
					content: securityLabProjectContent(
						"Module 6: Control-Flow Thinking for Defenders",
						"core"
					),
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
						"Keep a written audit notebook for control-flow thinking for defenders that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on why control-relevant state changes the severity discussion even when the lab stays fully local so security relevance is communicated clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rust-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rust-systems-lab-17/solution"
				},
				{
					title: "Module 6: Control Flow Thinking for Defenders Supplemental 2",
					content: securityLabProjectContent(
						"Module 6: Control-Flow Thinking for Defenders",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-13-module-6-control-flow-thinking-for-defenders-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-13-module-6-control-flow-thinking-for-defenders-supplemental-2/solution"
				},
				{
					title: "Module 6: Control Flow Thinking for Defenders Supplemental 3",
					content: securityLabProjectContent(
						"Module 6: Control-Flow Thinking for Defenders",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-14-module-6-control-flow-thinking-for-defenders-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-14-module-6-control-flow-thinking-for-defenders-supplemental-3/solution"
				}
			]
		},
		{
			title: "Module 7: From Bug Report to Patch",
			curriculum: [
				{
					title: "Reproduce, Assess, Prioritize, Patch, and Add a Regression",
					content:
						"The complete defensive workflow is a loop: reproduce the bug, assess exploitability, prioritize it, patch narrowly, and add a regression case. This is the operational counterpart to exploitability analysis, because a precise triage note without a precise patch path still leaves the team exposed."
				},
				{
					title: "Communicate Clearly About Security-Relevant Bugs",
					content:
						"Practice writing maintainable communication: summary, affected path, root cause, impact, mitigation context, fix summary, and regression proof. The target audience is another engineer or maintainer who needs enough information to act confidently without a wall of vague security language."
				},
				{
					title: "Use AI to Accelerate Triage, Not Replace Evidence",
					content:
						"This section covers AI as a narrow assistant for defensive work: summarize sanitizer output, propose regression cases, help structure disclosure notes, compare two patch options, or convert a long debugging session into a clearer maintainer-facing report. Also learn the limits: AI can hallucinate exploitability claims, miss the real root cause, or suggest unsafe follow-ups, so every claim must still be checked against the local toy binary, debugger output, sanitizer evidence, and the written lab boundary."
				},
				{
					title: "Patch Notes Should Close the Bug Class",
					content:
						"Skill target: Describe not only what line changed, but what assumption was invalid and how the patch changes the invariant. This helps prevent shallow fixes that silence one reproduction case while leaving the bug class alive elsewhere in the codebase."
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
						"Keep a written audit notebook for from bug report to patch that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on how the triage note, patch summary, and regression case reinforce each other so security relevance is communicated clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS17-Disclosure-and-Triage-Report/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS17-Disclosure-and-Triage-Report/solution"
				},
				{
					title: "Module 7: From Bug Report to Patch Supplemental 2",
					content: securityLabProjectContent(
						"Module 7: From Bug Report to Patch",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-15-module-7-from-bug-report-to-patch-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-15-module-7-from-bug-report-to-patch-supplemental-2/solution"
				},
				{
					title: "Module 7: From Bug Report to Patch Supplemental 3",
					content: securityLabProjectContent(
						"Module 7: From Bug Report to Patch",
						"extension"
					),
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
						"The capstone combines multiple bug classes in one local-only toy system so the work moves beyond one-bug-one-technique thinking. A strong response identifies the issues, explains the trust boundaries, and ranks the findings based on impact and attacker assumptions rather than on how dramatic the output looks."
				},
				{
					title: "Rank Findings, Patch, and Verify",
					content:
						"The capstone requires ranked findings, justified patches, and explicit verification checks. It is not complete when the output “looks better”; it is complete when the findings are prioritized, the patches are justified, and the regression evidence shows the bug classes are actually closed."
				},
				{
					title: "Deliver an Audit Packet and Mitigation Summary",
					content:
						"The final deliverable should be an audit packet and mitigation summary, not an exploit. That packet should include the ethics statement, findings ranked by impact, attacker assumptions, the mitigations observed, the patch list, and the regression results that justify closing the issue set."
				},
				{
					title: "Project: LLS18 Exploit-Informed Hardening Capstone",
					content:
						"Use the capstone starter to review a larger intentionally flawed toy system that mixes stack-like corruption, stale-handle reuse, and disclosure boundaries. The completed review path should demonstrate how exploit-informed analysis leads to narrow hardening patches and a clearer mitigation summary without ever leaving the local lab scope.",
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
						"Keep a written audit notebook for capstone audit that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on finding ranking, patch scope, mitigation notes, and regression proof so security relevance is communicated clearly instead of stopping at “it crashed.”",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS18-Exploit-Informed-Hardening-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS18-Exploit-Informed-Hardening-Capstone/solution"
				},
				{
					title: "Module 8: Capstone Audit Supplemental 2",
					content: securityLabProjectContent(
						"Module 8: Capstone Audit",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-17-module-8-capstone-audit-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-17-module-8-capstone-audit-supplemental-2/solution"
				},
				{
					title: "Module 8: Capstone Audit Supplemental 3",
					content: securityLabProjectContent(
						"Module 8: Capstone Audit",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-18-module-8-capstone-audit-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-18-module-8-capstone-audit-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 13: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 13: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 13: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 13: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 13: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 13: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 13: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-low-level-security-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-low-level-security-lab-13/solution"
				},
				{
					title: "Low-Level Security Lab 13: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 13: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 13: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 13: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-low-level-security-lab-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-07-low-level-security-lab-13/solution"
				},
				{
					title: "Low-Level Security Lab 13 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 13: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-19-applied-studio-10-low-level-security-lab-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-19-applied-studio-10-low-level-security-lab-13-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 13 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 13: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-20-applied-studio-10-low-level-security-lab-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-20-applied-studio-10-low-level-security-lab-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 14: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 14: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 14: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 14: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 14: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 14: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 14: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-low-level-security-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-low-level-security-lab-14/solution"
				},
				{
					title: "Low-Level Security Lab 14: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 14: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 14: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 14: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-low-level-security-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-08-low-level-security-lab-14/solution"
				},
				{
					title: "Low-Level Security Lab 14 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 14: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-21-applied-studio-11-low-level-security-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-21-applied-studio-11-low-level-security-lab-14-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 14 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 14: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-22-applied-studio-11-low-level-security-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-22-applied-studio-11-low-level-security-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 15: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 15: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 15: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 15: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 15: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 15: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 15: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-low-level-security-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-low-level-security-lab-15/solution"
				},
				{
					title: "Low-Level Security Lab 15: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 15: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 15: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 15: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-low-level-security-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-09-low-level-security-lab-15/solution"
				},
				{
					title: "Low-Level Security Lab 15 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 15: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-23-applied-studio-12-low-level-security-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-23-applied-studio-12-low-level-security-lab-15-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 15 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 15: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-24-applied-studio-12-low-level-security-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-24-applied-studio-12-low-level-security-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 16: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 16: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 16: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 16: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 16: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 16: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 16: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-low-level-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-low-level-security-lab-16/solution"
				},
				{
					title: "Low-Level Security Lab 16: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 16: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 16: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 16: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-low-level-security-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-10-low-level-security-lab-16/solution"
				},
				{
					title: "Low-Level Security Lab 16 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 16: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-25-applied-studio-13-low-level-security-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-25-applied-studio-13-low-level-security-lab-16-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 16 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 16: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-26-applied-studio-13-low-level-security-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-26-applied-studio-13-low-level-security-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Low-Level Security Lab 17: Implementation Lab",
			curriculum: [
				{
					title: "Low-Level Security Lab 17: Core Concepts",
					content: securityLabConceptContent(
						"Low-Level Security Lab 17: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 17: Guided Example",
					content: securityLabExampleContent(
						"Low-Level Security Lab 17: Implementation Lab"
					)
				},
				{
					title: "Low-Level Security Lab 17: Core Project",
					content: securityLabProjectContent(
						"Low-Level Security Lab 17: Implementation Lab",
						"core"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-low-level-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-low-level-security-lab-17/solution"
				},
				{
					title: "Low-Level Security Lab 17: Review and Reflection",
					content: securityLabReviewContent(
						"Low-Level Security Lab 17: Implementation Lab"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Low-Level Security Lab 17: Extension Challenge",
					content: securityLabProjectContent(
						"Low-Level Security Lab 17: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-low-level-security-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS-11-low-level-security-lab-17/solution"
				},
				{
					title: "Low-Level Security Lab 17 Supplemental 2: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 17: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-27-applied-studio-14-low-level-security-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-27-applied-studio-14-low-level-security-lab-17-supplemental-2/solution"
				},
				{
					title: "Low-Level Security Lab 17 Supplemental 3: Implementation Lab",
					content: securityLabProjectContent(
						"Low-Level Security Lab 17: Implementation Lab",
						"extension"
					),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-28-applied-studio-14-low-level-security-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/LLS2-28-applied-studio-14-low-level-security-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};
