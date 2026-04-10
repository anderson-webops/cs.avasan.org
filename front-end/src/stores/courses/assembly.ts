import type { RawCourse, RawCourseModuleItem } from "./types";

const ASSEMBLY_REPO =
	"https://github.com/instruction-material/Assembly/tree/main";

function starterRepoLink(projectId: string) {
	return `${ASSEMBLY_REPO}/${projectId}/starter`;
}

function solutionRepoLink(projectId: string) {
	return `${ASSEMBLY_REPO}/${projectId}/solution`;
}

function projectItem(
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

function traceWorksheet(unitTitle: string, focus: string): RawCourseModuleItem {
	return {
		title: `Register-Trace Worksheet: ${unitTitle}`,
		content: `Keep a short worksheet for ${unitTitle.toLowerCase()} that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on ${focus} so students learn to narrate instruction flow rather than only skim mnemonics.`
	};
}

function toolDrill(commandName: string, prompt: string): RawCourseModuleItem {
	return {
		title: `Tool Drill: ${commandName}`,
		content: `Start the lesson by running ${commandName} and asking students to predict what useful evidence it should provide. ${prompt}`
	};
}

function cAssemblyCompare(title: string, prompt: string): RawCourseModuleItem {
	return {
		title: `C-to-Assembly Compare: ${title}`,
		content: `Put a short C function and its generated assembly side by side before rewriting anything. ${prompt}`
	};
}

export const assemblyCourse: RawCourse = {
	name: "Assembly",
	modules: [
		{
			title: "ASM0 Setup and Tooling",
			curriculum: [
				{
					title: "Preferred IDEs and Core Toolchain",
					content:
						"Standardize on `CLion` or `VS Code`, then make the real requirement the toolchain beneath the editor. Students should verify `clang --version`, `lldb --version`, and `cmake --version` before the course depends on disassembly, debugging, or mixed C and assembly builds."
				},
				{
					title: "macOS and Windows Walkthroughs",
					content:
						"On macOS, install Apple command-line tools with `xcode-select --install`, then verify the compiler and debugger from a terminal. On Windows, prefer WSL2 with Ubuntu so the shell, assembler workflow, and debugger behavior stay close to the Unix-style examples used throughout the course."
				},
				{
					title: "Architecture Choice and Syntax Policy",
					content:
						"Use `x86-64 assembly` first because the debugger support, desktop relevance, and reverse-engineering value are stronger for a first course than jumping immediately into other architectures. Pick one syntax for active writing, and this course standardizes on Intel syntax while still teaching students how to recognize AT&T syntax in compiler output and external references."
				},
				{
					title: "Audience, Prerequisites, and Core Outcomes",
					content:
						"Position the course after `C Systems Engineering` or equivalent low-level C work. Students should already be comfortable with pointers, structs, stack versus heap, compilation, and debugger basics before the course asks them to read registers, trace stack frames, and explain calling conventions at the instruction level."
				}
			],
			supplementalProjects: [
				traceWorksheet(
					"Setup and Tooling",
					"toolchain identity, architecture choice, and why x86-64 is the starting point for the course"
				),
				toolDrill(
					"clang --version",
					"Ask students which line identifies the target architecture and why that matters before they assemble or disassemble anything."
				)
			]
		},
		{
			title: "Unit 1: Machine Model and Toolchain",
			curriculum: [
				{
					title: "Assembler, Linker, Object Files, and Executables",
					content:
						"Teach the assembly pipeline as a concrete artifact flow: source becomes object code, objects become a linked executable, and each stage exposes different evidence. Students should know where symbols, relocation, and disassembly fit long before they write large amounts of assembly."
				},
				{
					title: "Intel versus AT&T Syntax",
					content:
						"Explain operand ordering, immediate prefixes, register naming, and memory syntax differences between Intel and AT&T notation. The course writes Intel syntax, but students should be able to identify the same instruction in both forms so compiler output does not become unreadable."
				},
				{
					title: "Disassembly Workflow and Read-Before-Write Discipline",
					content:
						"Start from reading before writing. Students should disassemble tiny programs, identify function boundaries, spot prologues and epilogues, and only then begin writing their own routines so assembly feels observable rather than mystical."
				},
				cAssemblyCompare(
					"Hello Function",
					"Take a simple C helper, compile it with and without optimization, and ask students to identify the arguments, return value, and where the function begins and ends in the disassembly."
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"Machine Model and Toolchain",
					"source-to-object boundaries, symbol names, and how the disassembler reveals structure"
				),
				toolDrill(
					"objdump -d",
					"Use a tiny binary so students can see that assembly is not separate from the built program; it is the built program made visible."
				)
			]
		},
		{
			title: "Unit 2: Registers and Data Movement",
			curriculum: [
				{
					title: "General-Purpose Registers and Partial Register Views",
					content:
						"Teach `rax`, `rbx`, `rcx`, `rdx`, the pointer and index registers, and the relationship between 64-bit, 32-bit, 16-bit, and 8-bit register views. Students should understand that partial-register writes can zero or preserve upper bits depending on the instruction and destination width."
				},
				{
					title: "mov, Zero Extension, and Sign Extension",
					content:
						"Show `mov` as data transfer rather than hidden computation, then pair it with zero-extension and sign-extension instructions so students can explain how a smaller value becomes a wider value safely. This matters immediately when mixing bytes, ints, pointers, and return values."
				},
				{
					title: "Immediate, Register, and Memory Operands",
					content:
						"Walk through the three core operand categories deliberately: immediate constants, register-to-register moves, and memory loads or stores. The lesson should keep returning to the question 'where is the value coming from and where is it going?'"
				},
				projectItem(
					"Project: Integer Calculator in Assembly",
					"Use the calculator lab to make register flow visible with arithmetic on function arguments and operator-driven dispatch. The project should be small enough to trace by hand while still forcing students to move values through argument registers and return registers intentionally.",
					"ASM1-Integer-Calculator"
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"Registers and Data Movement",
					"which register holds each live value and how width changes alter the interpretation"
				),
				toolDrill(
					"lldb",
					"Pause inside a tiny function and ask students to name which argument lives in which register before single-stepping."
				)
			]
		},
		{
			title: "Unit 3: Arithmetic and Logic",
			curriculum: [
				{
					title: "add, sub, imul, and idiv",
					content:
						"Teach the arithmetic instructions as state changes over explicit registers rather than as magical one-line operators. Students should understand which instructions write only one destination register, which ones use implicit registers, and why signed division requires deliberate setup."
				},
				{
					title: "and, or, xor, test, and Condition Checks",
					content:
						"Use the logic instructions to connect bit operations to control flow. `test` and `xor` should feel especially practical because they show up constantly in zero checks, mask checks, and quick register clearing patterns."
				},
				{
					title: "Flags, Condition Codes, and Arithmetic Visibility",
					content:
						"Teach the zero flag, sign flag, carry flag, and overflow flag as observable state that later drives conditional branches. Students should be able to explain not only what a calculation produced, but what flags that calculation set and why."
				},
				cAssemblyCompare(
					"Arithmetic Helper",
					"Take one arithmetic C function, inspect the generated assembly, and ask students why the compiler chose that instruction sequence instead of a more literal source-level translation."
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"Arithmetic and Logic",
					"flag changes, implicit register use, and the difference between value changes and status changes"
				),
				toolDrill(
					"register read",
					"Use the debugger register view after each arithmetic instruction and require students to say which value changed because of the instruction and which change was only in the flags."
				)
			]
		},
		{
			title: "Unit 4: Branching and Loops",
			curriculum: [
				{
					title: "cmp, jmp, and Conditional Jumps",
					content:
						"Teach branching by making the compare-and-branch relationship explicit. Students should understand that `cmp` prepares flags and `jcc` reads them, which is a clearer model than treating each conditional jump as a stand-alone feature."
				},
				{
					title: "Loop Construction and State Tracing",
					content:
						"Build loops from labels, compares, and jumps instead of hiding iteration in higher-level syntax. The course should repeatedly ask students to predict the loop counter, current address, and exit condition before they run the next instruction."
				},
				{
					title: "Search and Accumulation Patterns",
					content:
						"Use array summation, scanning, and threshold checks as the recurring examples because they produce visible state changes without introducing too much scaffolding. These patterns also transfer directly into later performance and compiler-output discussions."
				},
				projectItem(
					"Project: Array Sum and Search Routines",
					"Use the array lab to connect loops, comparisons, pointer stepping, and return values. Students should be able to explain exactly how each pass through the loop changes the accumulator or search result and what causes the branch to continue or exit.",
					"ASM2-Array-Sum-and-Search"
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"Branching and Loops",
					"loop counters, branch conditions, and which instruction actually decides whether the next iteration runs"
				),
				toolDrill(
					"breakpoint set --name",
					"Set a breakpoint at the loop label and make students predict how many times execution will return there before the loop finishes."
				)
			]
		},
		{
			title: "Unit 5: The Stack and Function Calls",
			curriculum: [
				{
					title: "call, ret, and Return Addresses",
					content:
						"Teach `call` and `ret` as stack operations as well as control-flow operations. Students should understand that the return address becomes data on the stack, which is why call depth, frame layout, and corruption bugs become visible in assembly."
				},
				{
					title: "Stack Frames and Local Storage",
					content:
						"Introduce stack frames as a bookkeeping convention rather than a law of nature. Show the prologue and epilogue patterns, when local stack space is reserved, and why optimized code may partially remove the frame students expected to see."
				},
				{
					title: "Saved Registers and Stack Alignment",
					content:
						"Explain why some registers must be preserved across calls and why stack alignment matters before calling into another function. This is the point where students should learn to treat calls as ABI obligations, not just as jumps with a convenient return."
				},
				cAssemblyCompare(
					"Stack Frame Walkthrough",
					"Use a tiny C function with one local variable and one nested call, then map the assembly frame adjustments back to the source-level intent."
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"The Stack and Function Calls",
					"return addresses, saved registers, and why the stack pointer moves when a function prepares for another call"
				),
				toolDrill(
					"memory read",
					"Pause inside a function and inspect the stack around the current stack pointer so students connect the frame diagram to actual bytes."
				)
			]
		},
		{
			title: "Unit 6: Calling Conventions and ABI",
			curriculum: [
				{
					title: "Parameter Passing and Return Values",
					content:
						"Teach the System V AMD64 calling convention directly: which registers carry the first arguments, where integer return values come back, and when values spill to the stack. Students should be able to predict the first few arguments before stepping a call."
				},
				{
					title: "Caller-Saved versus Callee-Saved Registers",
					content:
						"Frame register-saving rules as part of a contract between functions. The point is not rote memorization alone; it is understanding why a function that forgets to preserve the wrong register can silently corrupt its caller."
				},
				{
					title: "Interacting with C Cleanly",
					content:
						"Use mixed C and assembly examples to show how prototypes, symbol names, argument widths, and return values must line up across languages. This keeps ABI work grounded in practical interoperability rather than only in diagrams."
				},
				projectItem(
					"Project: Call a C Helper from Assembly",
					"Use the mixed-language lab to sum values in assembly, then call back into a C helper that clamps or formats the result. The project should force students to keep argument registers, preserved registers, and stack alignment straight across the language boundary.",
					"ASM4-Call-C-Helper-from-Assembly"
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"Calling Conventions and ABI",
					"argument registers, preserved registers, and what must be restored before returning"
				),
				toolDrill(
					"nm",
					"Inspect one mixed-language build so students can connect the C function names and assembly labels to the same symbol table."
				)
			]
		},
		{
			title: "Unit 7: Memory Addressing and Data Structures",
			curriculum: [
				{
					title: "Base Plus Index Plus Scale Addressing",
					content:
						"Teach complex addressing as a readable formula instead of a scary syntax form. Students should learn to decode base register, scaled index, and displacement into a clear statement like 'array base plus element index times element size plus field offset.'"
				},
				{
					title: "Arrays, Strings, and Sequential Memory Walks",
					content:
						"Use arrays and strings to reinforce that iteration in assembly is really address arithmetic and stop conditions. The key habit is explaining which address gets read next and why the loop exits when it does."
				},
				{
					title: "Struct Field Offsets and Data Layout Thinking",
					content:
						"Bring back struct offsets from C so students see that assembly code addressing a field is just layout reasoning made explicit. This helps them transfer earlier layout work into reverse engineering and compiler-output reading later in the course."
				},
				projectItem(
					"Project: String Length and Copy Routines",
					"Use the string lab to make pointer walking, null termination, and capacity-aware copying visible instruction by instruction. Students should be able to justify every load, store, and branch in terms of address movement and buffer boundaries.",
					"ASM3-String-Length-and-Copy"
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"Memory Addressing and Data Structures",
					"address formulas, stop conditions, and where each byte load or store lands in memory"
				),
				cAssemblyCompare(
					"Array Indexing",
					"Take a short C array loop and rewrite the indexing explanation as a base-plus-index-plus-scale address formula before looking at the disassembly."
				)
			]
		},
		{
			title: "Unit 8: System Calls and Runtime Interaction",
			curriculum: [
				{
					title: "Minimal Linux Syscall Examples",
					content:
						"Teach direct syscalls as the lowest visible interface between user-space code and the kernel, even if the active classroom build sometimes uses a libc-backed harness for portability. Students should understand the idea of putting a syscall number and arguments in the right registers and then interpreting the return value as success or failure."
				},
				{
					title: "libc versus Direct Syscalls",
					content:
						"Compare libc calls and direct syscalls so students see that runtime interaction can happen at different layers. The key lesson is not choosing one forever, but understanding what extra behavior a runtime library adds beyond the raw kernel boundary."
				},
				{
					title: "argc, argv, and Process Startup State",
					content:
						"Use command-line arguments as a beginner-friendly runtime surface that still reveals process state, string parsing, and error handling. This gives students a concrete input path without requiring a large UI or framework."
				},
				projectItem(
					"Project: Tiny Command-Line Parser",
					"Use the parser lab to read `argv`, compare command names, parse decimal input, and dispatch a tiny operation. This keeps runtime interaction concrete while still reinforcing loops, comparisons, and mixed C plus assembly workflow.",
					"ASM5-Tiny-Command-Line-Parser"
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"System Calls and Runtime Interaction",
					"argument pointers, parse-state changes, and where invalid input should stop the flow"
				),
				toolDrill(
					"register read",
					"Break at the start of the parser and inspect the argument-related registers so students can connect the ABI and the live process state."
				)
			]
		},
		{
			title: "Unit 9: Reading Compiler Output",
			curriculum: [
				{
					title: "Compile C to Assembly on Purpose",
					content:
						"Make compiler output a first-class teaching tool. Students should repeatedly compile small C helpers to assembly so they can compare their manual code shape to the compiler's choices instead of imagining the compiler as an opaque black box."
				},
				{
					title: "Map Source Lines to Instructions",
					content:
						"Teach students to align a source-level branch, loop, or local variable with its instruction-level representation. This becomes the bridge between high-level reasoning and low-level debugging when they later step instruction by instruction."
				},
				{
					title: "Optimization Changes the Shape, Not the Goal",
					content:
						"Show how unoptimized code favors readability and stack-heavy layouts while optimized code may remove frames, reuse registers aggressively, or replace obvious source structure with tighter control flow. The point is to understand what changed and what semantic goal stayed the same."
				},
				cAssemblyCompare(
					"Loop at O0 and O2",
					"Compile the same small loop twice and have students explain which parts got shorter, which parts moved into registers, and which source-level intent remained unchanged."
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"Reading Compiler Output",
					"source-to-instruction mapping, optimization differences, and what evidence proves two versions still implement the same logic"
				),
				toolDrill(
					"clang -S",
					"Generate assembly for one short C file in front of the student so the build step itself becomes part of the lesson rather than a hidden preprocessing trick."
				)
			]
		},
		{
			title: "Unit 10: Debugging at Instruction Level",
			curriculum: [
				{
					title: "Step Instructions, Not Just Source Lines",
					content:
						"Teach stepping by instruction so students stop thinking of a line of source as the smallest meaningful debugging unit. They should learn to watch how one compare, one move, or one conditional jump changes the machine state before the next instruction runs."
				},
				{
					title: "Watching Registers and Memory Together",
					content:
						"Use the debugger to watch the register file and selected memory ranges at the same time. The important habit is correlating the pointer values with the bytes they reference instead of treating registers and memory as separate worlds."
				},
				{
					title: "Breakpoints on Functions and Addresses",
					content:
						"Teach symbolic breakpoints and raw address breakpoints so students can debug both source-friendly code and stripped-down instruction sequences. This is especially useful once optimization or reverse-engineering exercises make source-line stepping less reliable."
				},
				{
					title: "Instruction-Level Debug Pass on an Existing Lab",
					content:
						"Re-open an earlier lab and debug it from the assembly side only, without immediately jumping back to the C harness. Students should prove they can explain the bug or behavior from the instruction stream and machine state directly."
				}
			],
			supplementalProjects: [
				traceWorksheet(
					"Debugging at Instruction Level",
					"where execution stopped, which machine state changed next, and what the next branch decision depends on"
				),
				toolDrill(
					"breakpoint set --address",
					"Pick one instruction inside a loop body so students see that breakpoints do not have to line up with source-level function entries."
				)
			]
		},
		{
			title: "Unit 11: Performance and Code Shape",
			curriculum: [
				{
					title: "Branch Cost and Predictability",
					content:
						"Introduce branches as potential performance costs without turning the course into premature micro-optimization. Students should understand at a high level why predictable straight-line code often behaves differently from branch-heavy code, even when the instruction count looks similar on paper."
				},
				{
					title: "Memory Locality and Access Patterns",
					content:
						"Use array walks and pointer-chasing examples to connect performance back to layout and locality. The key lesson is that where data lives in memory can matter as much as the arithmetic instructions operating on it."
				},
				{
					title: "Instruction Count versus Real Performance",
					content:
						"Teach students to distrust simplistic 'fewer instructions always wins' thinking. Some instructions are more expensive than others, memory access matters, and compiler optimizations often reshape the cost model in ways students need to observe rather than assume."
				},
				cAssemblyCompare(
					"Loop Shape versus Loop Cost",
					"Compare two small versions of an array routine and ask students whether the visible instruction count alone tells the whole performance story."
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"Performance and Code Shape",
					"branch frequency, memory-access patterns, and which cost assumptions came from evidence versus guesswork"
				),
				toolDrill(
					"time",
					"Run two tiny versions of the same loop repeatedly and ask students what changed in the code shape before they comment on timing."
				)
			]
		},
		{
			title: "Unit 12: Security and Reliability Visibility",
			curriculum: [
				{
					title: "Stack Canaries, PIE, and Binary Hardening Signals",
					content:
						"Teach stack canaries, PIE, and related hardening features as visible patterns around the code students already understand. The point is not exhaustive exploit mitigation coverage; it is helping students recognize how security features show up around functions, calls, and process layout."
				},
				{
					title: "How Assembly Explains Low-Level Bugs",
					content:
						"Use buffer mistakes, stale pointers, and bad control-flow assumptions as examples of bugs that become much easier to explain once students can see the actual loads, stores, and branch decisions. Assembly should feel like a clarity tool for reliability work, not only like a language to write by hand."
				},
				{
					title: "Reverse Engineering as a Reliability and Security Skill",
					content:
						"Position reverse engineering as a way to recover intent from compiled artifacts, inspect unfamiliar binaries, and validate assumptions about generated code. This makes the course useful not only for authorship, but for inspection and debugging work later in security or systems courses."
				},
				projectItem(
					"Project: Reverse-Engineer a Toy Program Back into Pseudocode",
					"Use the reverse-engineering lab to inspect a hand-written assembly routine, reconstruct its logic in C or pseudocode, and compare the outputs. The main lesson is that students can recover real structure from instruction flow instead of treating a disassembly listing as unreadable noise.",
					"ASM6-Reverse-Engineering-Toy-Program"
				)
			],
			supplementalProjects: [
				traceWorksheet(
					"Security and Reliability Visibility",
					"where the hardening or bug evidence appears around the function and what that reveals about runtime behavior"
				),
				toolDrill(
					"objdump -d",
					"Disassemble the reverse-engineering lab and ask students to mark the branch points, the absolute-value path, and the final decision path before they write pseudocode."
				)
			]
		},
		{
			title: "ASM13 Expansion Ideas and Next Steps",
			curriculum: [
				{
					title: "ARM64 Comparison Module",
					content:
						"Offer an ARM64 comparison module once students are stable in x86-64. The useful lesson is not memorizing a second ISA immediately, but seeing which concepts transfer cleanly across register sets, calling conventions, and instruction encodings."
				},
				{
					title: "SIMD and Wider Data Paths",
					content:
						"Treat SIMD as a later specialization rather than a prerequisite. Students should first be fluent in scalar register tracing and calling conventions, then move into packed-data operations once the underlying mental model is stable."
				},
				{
					title: "Reverse-Engineering Elective",
					content:
						"Extend the course into a reverse-engineering elective with more disassembly-only exercises, function identification, and pseudocode recovery. This is a natural direction for students headed toward low-level security, tooling, or binary analysis."
				},
				{
					title: "Linker, Relocation, and Symbol Deep Dives",
					content:
						"Use a final expansion path for students who want to go deeper into object files, relocation, static versus dynamic linking, and symbol resolution. Those topics make more sense after the core course has already made functions, calls, and build artifacts concrete."
				}
			],
			supplementalProjects: [
				traceWorksheet(
					"Expansion Ideas and Next Steps",
					"which next specialization builds most naturally on the student’s current strengths and why"
				),
				toolDrill(
					"nm",
					"Use one completed lab to show that the next round of depth can move from reading instructions into understanding how the linker and symbol table organize the binary."
				)
			]
		}
	]
};
