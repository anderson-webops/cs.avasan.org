import type { RawCourse, RawCourseModuleItem } from "./types";

const LOW_LEVEL_SECURITY_REPO =
	"https://github.com/instruction-material/Low-Level-Security/tree/main";

function starterRepoLink(labId: string) {
	return `${LOW_LEVEL_SECURITY_REPO}/${labId}/starter`;
}

function solutionRepoLink(labId: string) {
	return `${LOW_LEVEL_SECURITY_REPO}/${labId}/solution`;
}

function projectItem(
	title: string,
	content: string,
	labId: string
): RawCourseModuleItem {
	return {
		title,
		content,
		projectLink: starterRepoLink(labId),
		solutionLink: solutionRepoLink(labId)
	};
}

function auditNotebook(title: string, focus: string): RawCourseModuleItem {
	return {
		title: `Audit Notebook: ${title}`,
		content: `Keep a written audit notebook for ${title.toLowerCase()} that records the lab boundary, the reproducer, the attacker assumptions, the mitigations present, and the patch or verification result. Focus especially on ${focus} so students learn to communicate security relevance clearly instead of stopping at “it crashed.”`
	};
}

export const lowLevelSecurityPart2Course: RawCourse = {
	name: "Low Level Security Part 2",
	modules: [
		{
			title: "LLS Part 2 Setup and Tooling",
			curriculum: [
				{
					title: "Why Part 2 Uses LLS13 through LLS18",
					content: `Keep the original course-outline numbering for Part 2. The source plan for this sequence defined the advanced local-lab IDs as LLS13 through LLS18, so the numbering jump is historical rather than a missing hidden module block in this catalog. There is no separate LLS7 through LLS12 sequence in the original Part 2 outline.`
				},
				{
					title: "Day-One Tooling and Local-Lab Boundaries",
					content:
						`Assume a strictly local lab-only environment and make sanitizers, debugger setup, and disassembly tools part of the first session instead of an appendix. Students should verify ` +
						"`clang`, `lldb`, `cmake`, and `llvm-objdump` or `objdump`" +
						` early so later mitigation and exploitability discussions are grounded in observable local builds rather than abstract descriptions.`
				},
				{
					title: "Preferred IDEs and Platform Setup",
					content:
						`Recommend ` +
						"`CLion`" +
						` or ` +
						"`VS Code`" +
						` with ` +
						"`C/C++`, `CMake Tools`, `CodeLLDB`, and `Hex Editor`" +
						` when VS Code is used. On macOS, students should install Xcode command-line tools and CMake; on Windows, WSL2 plus Ubuntu is the cleanest path so the labs stay close to the Linux-oriented debugging environment they will use most often.`
				},
				{
					title: "Ethics Statement and Defensive Scope",
					content:
						`This course follows ` +
						"`Low Level Security Part 1`" +
						` and uses tightly controlled toy programs to teach how a defensive engineer evaluates risk, not how to deploy offensive techniques. Require an explicit ethics statement at the start: local targets only, no public services, no real-world payloads, and every risky concept ends with a patch, mitigation summary, or regression case. If AI is used anywhere in the workflow, it must stay within that same defensive scope and every suggestion must be verified locally before it enters a report or patch discussion.`
				},
				{
					title: "Core Outcomes for Part 2",
					content: `Set expectations clearly: students should distinguish a crash from an exploitable condition, explain how bug classes can lead to control-flow or data corruption, evaluate mitigations such as ASLR, NX, canaries, RELRO, and allocator behavior, and produce patch notes plus regression checks that close the bug class rather than only describing it.`
				}
			],
			supplementalProjects: [
				auditNotebook(
					"Setup and Tooling",
					"sanitizer readiness, debugger verification, and ethics boundaries"
				)
			]
		},
		{
			title: "Module 1: Exploitability Triage",
			curriculum: [
				{
					title: "Reachability, Controllability, Impact, and Attacker Assumptions",
					content: `Teach exploitability triage as a disciplined decision process. Students should ask whether untrusted input reaches the bug, whether the attacker can shape the failing bytes or state, what the likely impact is, and what assumptions about the environment are required before a maintainers’ note should call the issue security-relevant.`
				},
				{
					title: "Crash Taxonomy for Defensive Analysis",
					content: `Separate harmless aborts, denial of service, memory disclosure, and memory corruption into distinct categories so students stop treating every crash as equivalent. This taxonomy matters because a null dereference, a stale debug leak, and an unchecked write may all look like “the program failed” at first glance, but they imply very different risks and priorities.`
				},
				{
					title: "Write Short Exploitability Notes for Maintainers",
					content: `Students should learn to write concise notes that name reachability, attacker control, current mitigations, likely impact, and immediate next steps. The note should be short enough to be useful in a triage queue but concrete enough that another engineer can tell why the issue was classified as availability-only, disclosure-relevant, or corruption-relevant.`
				},
				projectItem(
					"Project: LLS13 Crash Classification Lab",
					`Use the crash-classification lab to compare toy failures and convert them into maintainer-facing exploitability notes. The project should train students to justify their classification rather than rely on fear-driven language or vague claims about “possible exploitation.”`,
					"LLS13-Crash-Classification-Lab"
				)
			],
			supplementalProjects: [
				auditNotebook(
					"Exploitability Triage",
					"reachability, attacker control, and why a crash does or does not rise to security relevance"
				)
			]
		},
		{
			title: "Module 2: Stack Corruption in Toy Programs",
			curriculum: [
				{
					title: "Saved Return Addresses, Local Buffers, and Frame Structure",
					content: `Review how local buffers and nearby frame data relate conceptually so students can reason about why unchecked writes into stack-like storage are security-relevant. Keep the work inside intentionally vulnerable local toy binaries and models so the course stays focused on understanding and hardening rather than on weaponization.`
				},
				{
					title: "Why Stack Corruption Can Become Control-Flow Risk",
					content: `Explain at a high level why corruption of adjacent frame data can matter even before any real-world control-flow hijack discussion begins. The defensive takeaway is that once attacker-shaped input can clobber bytes that influence later execution, the issue has moved well beyond a harmless crash.`
				},
				{
					title: "Safer APIs, Stack Canaries, and Layered Defenses",
					content: `Compare safer bounded APIs and validation-first copy rules to mitigations such as stack canaries. Students should understand that canaries and hardening settings help detect or disrupt stack corruption, but they do not justify leaving unchecked copy logic in place.`
				},
				projectItem(
					"Project: LLS14 Stack Frame Corruption Demo and Fix",
					`Use a local toy frame model to show how an oversized label or packet field can spill from a local buffer into adjacent control-shadow bytes, then patch the copy rule so oversized input is rejected before nearby frame data changes.`,
					"LLS14-Stack-Frame-Corruption-Demo-and-Fix"
				)
			],
			supplementalProjects: [
				auditNotebook(
					"Stack Corruption in Toy Programs",
					"frame layout, overwrite reach, and which defensive change actually closes the risk"
				)
			]
		},
		{
			title: "Module 3: Heap Lifetime and Heap Metadata Concepts",
			curriculum: [
				{
					title: "Use-After-Free, Double Free, and Stale Pointer Reuse",
					content: `Teach heap-lifetime issues as ownership and lifecycle failures, not as magic allocator trivia. Students should understand why stale references, repeated frees, and reused heap slots can turn ordinary bookkeeping mistakes into disclosure or corruption problems when old handles or pointers still reach new objects.`
				},
				{
					title: "Ownership Mistakes That Escalate Risk",
					content: `Focus on the high-level transitions that matter: who owns an object, when it is released, whether references are invalidated, and whether later code can still observe or mutate the object through stale state. This is the core defensive lens for deciding when a heap bug is only a crash and when it becomes a security bug.`
				},
				{
					title: "Allocator Behavior at a High Level",
					content: `Introduce allocator reuse and heap metadata concepts only at the level needed for defenders to reason about risk. Students should leave with a mental model that reused slots and freed objects can change who a stale reference points to, without drifting into real-world exploitation kits or public-target techniques.`
				},
				projectItem(
					"Project: LLS15 Heap Lifetime Audit",
					`Use the heap-lifetime lab to review a toy session pool where a released slot can be reused while an old handle still exists. The patch should make lifetime rules explicit and block stale-handle access so students see how a narrow ownership fix closes an otherwise security-relevant confusion bug.`,
					"LLS15-Heap-Lifetime-Audit"
				)
			],
			supplementalProjects: [
				auditNotebook(
					"Heap Lifetime and Heap Metadata Concepts",
					"ownership boundaries, stale-handle reuse, and why allocator reuse changes the threat story"
				)
			]
		},
		{
			title: "Module 4: Information Disclosure and Memory Observation",
			curriculum: [
				{
					title: "Uninitialized Reads, Oversized Reads, and Stale Data Disclosure",
					content: `Teach disclosure bugs as trust-boundary problems where bytes that should stay internal cross into logs, responses, or other observable outputs. Students should recognize that a leak can matter even when the program does not crash, because addresses, object contents, and stale internal notes can still change the risk profile of a later bug.`
				},
				{
					title: "Why Leaked Addresses or Object Contents Matter",
					content: `Explain that leaked addresses, stale session data, or internal debug strings increase attacker knowledge and reduce uncertainty. The course should keep this defensive and local, focusing on why maintainers should prioritize disclosure and harden the boundary rather than on how to weaponize the information.`
				},
				{
					title: "Harden Logs, Debug Output, and Serialization Boundaries",
					content: `Use toy serializers and debug paths to show how disclosure bugs often come from reused buffers, unbounded lengths, or diagnostic content crossing into public output. The fix pattern is usually straightforward: clear internal state, serialize only intended public bytes, and ensure logs or diagnostics are scoped to the right audience.`
				}
			],
			supplementalProjects: [
				auditNotebook(
					"Information Disclosure and Memory Observation",
					"what crossed the trust boundary, what leaked, and how to prove the leak is gone after the patch"
				)
			]
		},
		{
			title: "Module 5: Mitigation-Aware Analysis",
			curriculum: [
				{
					title: "NX, ASLR, PIE, RELRO, Stack Canaries, and Hardened Allocators",
					content: `Introduce common mitigations as factors that change exploitability analysis, not as excuses to ignore the underlying bug. Students should know what NX, ASLR, PIE, RELRO, stack canaries, and hardened allocators are trying to prevent or make harder, and how those mitigations change the confidence and wording of a triage note.`
				},
				{
					title: "Mitigations Shrink the Attack Surface but Do Not Replace Fixes",
					content: `Stress that mitigation-aware analysis is still bug analysis. A corruption bug in a hardened build may be harder to exploit than the same bug in a softer build, but the code still needs a patch and a regression case because mitigations reduce likelihood, not obligation.`
				},
				{
					title: "Verify Protections in a Binary Build",
					content: `Teach students to inspect actual build outputs so mitigation talk stays tied to evidence. At a beginner level, that means looking for compile-time and build-time signs of PIE, sanitizers, stack protectors, or related hardening settings and recording the comparison in a small build matrix rather than relying on assumptions.`
				},
				projectItem(
					"Project: LLS16 Mitigation Comparison Build Matrix",
					`Use the build-matrix lab to compare at least two local builds of the same toy binary and record how the observed mitigation set changes the analysis story. The point is to practice verification and nuance, not to treat hardening flags as a substitute for safer code.`,
					"LLS16-Mitigation-Comparison-Build-Matrix"
				)
			],
			supplementalProjects: [
				auditNotebook(
					"Mitigation-Aware Analysis",
					"which protections were actually observed and how they changed the maintainer-facing risk note"
				)
			]
		},
		{
			title: "Module 6: Control-Flow Thinking for Defenders",
			curriculum: [
				{
					title: "High-Level Introduction to Return-Oriented Thinking",
					content: `Introduce return-oriented thinking only at a high defensive level: if corruption reaches control-relevant state, modern exploitation often chains existing code rather than injecting new code directly. The course should use this to motivate why control-flow integrity, stack protection, and safer programming models matter, not to teach offensive construction techniques.`
				},
				{
					title: "Why Control-Flow Integrity Matters",
					content: `Use the control-flow discussion to help students explain why certain corruption bugs demand urgent fixes even when a classroom demo only shows a crash or a shadow overwrite. The defensive point is that once control-relevant bytes are exposed to attacker-shaped input, integrity assumptions about future execution are weakened.`
				},
				{
					title: "Why Modern Mitigations and Safer Languages Are Valuable",
					content: `Connect the previous modules to language and platform choice. Students should understand why mitigations, safer libraries, and safer languages meaningfully reduce risk, while still recognizing that legacy native code and performance-sensitive systems often require disciplined hardening rather than complete rewrites.`
				}
			],
			supplementalProjects: [
				auditNotebook(
					"Control-Flow Thinking for Defenders",
					"why control-relevant state changes the severity discussion even when the lab stays fully local"
				)
			]
		},
		{
			title: "Module 7: From Bug Report to Patch",
			curriculum: [
				{
					title: "Reproduce, Assess, Prioritize, Patch, and Add a Regression",
					content: `Teach the complete defensive workflow as a loop: reproduce the bug, assess exploitability, prioritize it, patch narrowly, and add a regression case. Students should see this as the operational counterpart to exploitability analysis, because a precise triage note without a precise patch path still leaves the team exposed.`
				},
				{
					title: "Communicate Clearly About Security-Relevant Bugs",
					content: `Practice writing maintainable communication: summary, affected path, root cause, impact, mitigation context, fix summary, and regression proof. The target audience is another engineer or maintainer who needs enough information to act confidently without a wall of vague security language.`
				},
				{
					title: "Use AI to Accelerate Triage, Not Replace Evidence",
					content: `Teach AI as a narrow assistant for defensive work: summarize sanitizer output, propose regression cases, help structure disclosure notes, compare two patch options, or convert a long debugging session into a clearer maintainer-facing report. Students should also learn the limits: AI can hallucinate exploitability claims, miss the real root cause, or suggest unsafe follow-ups, so every claim must still be checked against the local toy binary, debugger output, sanitizer evidence, and the written lab boundary.`
				},
				{
					title: "Patch Notes Should Close the Bug Class",
					content: `Students should learn to describe not only what line changed, but what assumption was invalid and how the patch changes the invariant. This helps prevent shallow fixes that silence one reproduction case while leaving the bug class alive elsewhere in the codebase.`
				},
				projectItem(
					"Project: LLS17 Disclosure and Triage Report",
					`Use the disclosure lab to patch a toy public serializer that leaks stale internal bytes, then write a short triage report that explains the root cause, the disclosure impact, and the regression case proving the boundary is now hardened.`,
					"LLS17-Disclosure-and-Triage-Report"
				)
			],
			supplementalProjects: [
				auditNotebook(
					"From Bug Report to Patch",
					"how the triage note, patch summary, and regression case reinforce each other"
				)
			]
		},
		{
			title: "Module 8: Capstone Audit",
			curriculum: [
				{
					title: "Review a Larger Intentionally Flawed Toy Codebase",
					content: `The capstone should combine multiple bug classes in one local-only toy system so students must move beyond one-bug-one-technique thinking. They should identify the issues, explain the trust boundaries, and rank the findings based on impact and attacker assumptions rather than on how dramatic the output looks.`
				},
				{
					title: "Rank Findings, Patch, and Verify",
					content: `Require students to rank the findings, patch them, and verify the fixes with explicit checks. The capstone is not complete when the output “looks better”; it is complete when the findings are prioritized, the patches are justified, and the regression evidence shows the bug classes are actually closed.`
				},
				{
					title: "Deliver an Audit Packet and Mitigation Summary",
					content: `The final deliverable should be an audit packet and mitigation summary, not an exploit. That packet should include the ethics statement, findings ranked by impact, attacker assumptions, the mitigations observed, the patch list, and the regression results that justify closing the issue set.`
				},
				projectItem(
					"Project: LLS18 Exploit-Informed Hardening Capstone",
					`Use the capstone starter to review a larger intentionally flawed toy system that mixes stack-like corruption, stale-handle reuse, and disclosure boundaries. The solution should demonstrate how exploit-informed analysis leads to narrow hardening patches and a clearer mitigation summary without ever leaving the local lab scope.`,
					"LLS18-Exploit-Informed-Hardening-Capstone"
				)
			],
			supplementalProjects: [
				auditNotebook(
					"Capstone Audit",
					"finding ranking, patch scope, mitigation notes, and regression proof"
				)
			]
		}
	]
};
