import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

export const assemblyCourse: RawCourse = {
	name: "Assembly",
	modules: [
		{
			title: "ASM0 Setup and Tooling",
			curriculum: [
				{
					title: "Preferred IDEs and Core Toolchain",
					content:
						"Standardize on `CLion` or `VS Code`, then make the real requirement the toolchain beneath the editor. Verify `clang --version`, `lldb --version`, and `cmake --version` before the course depends on disassembly, debugging, or mixed C and assembly builds."
				},
				{
					title: "macOS and Windows Walkthroughs",
					content:
						"On macOS, install Apple command-line tools with `xcode-select --install`, then verify the compiler and debugger from a terminal. On Windows, prefer WSL2 with Ubuntu so the shell, assembler workflow, and debugger behavior stay close to the Unix-style examples used throughout the course."
				},
				{
					title: "Architecture Choice and Syntax Policy",
					content:
						"Use `x86-64 assembly` first because the debugger support, desktop relevance, and reverse-engineering value are stronger for a first course than jumping immediately into other architectures. Pick one syntax for active writing, and this course standardizes on Intel syntax while still showing how to recognize AT&T syntax in compiler output and external references."
				},
				{
					title: "Audience, Prerequisites, and Core Outcomes",
					content:
						"Position the course after `C Systems Engineering` or equivalent low-level C work. Already be comfortable with pointers, structs, stack versus heap, compilation, and debugger basics before the course asks them to read registers, trace stack frames, and explain calling conventions at the instruction level."
				},
				{
					title: "ASM0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM0 Setup and Tooling",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-04-asm0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-04-asm0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Setup and Tooling",
					content:
						"Keep a short worksheet for setup and tooling that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on toolchain identity, architecture choice, and why x86-64 is the starting point for the course so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-04-asm0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-04-asm0-setup-and-tooling/solution"
				},
				{
					title: "Setup and Tooling supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-asm0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-asm0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-asm0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-asm0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 1: Machine Model and Toolchain",
			curriculum: [
				{
					title: "Assembler, Linker, Object Files, and Executables",
					content:
						"This section covers the assembly pipeline as a concrete artifact flow: source becomes object code, objects become a linked executable, and each stage exposes different evidence. Key idea: Where symbols, relocation, and disassembly fit long before they write large amounts of assembly."
				},
				{
					title: "Intel versus AT&T Syntax",
					content:
						"Explain operand ordering, immediate prefixes, register naming, and memory syntax differences between Intel and AT&T notation. The course writes Intel syntax, but the expected outcome is recognizing the same instruction in both forms so compiler output does not become unreadable."
				},
				{
					title: "Disassembly Workflow and Read-Before-Write Discipline",
					content:
						"Start from reading before writing. Disassemble tiny programs, identify function boundaries, spot prologues and epilogues, and only then begin writing their own routines so assembly feels observable rather than mystical."
				},
				{
					title: "C-to-Assembly Compare: Hello Function",
					content:
						"Start with a short C helper and its generated assembly before rewriting anything. Compile it with and without optimization, then identify the arguments, return value, and where the function begins and ends in the disassembly."
				},
				{
					title: "Unit 1: Machine Model and Toolchain: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 1: Machine Model and Toolchain",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-1-machine-model-and-toolchain/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-1-machine-model-and-toolchain/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Machine Model and Toolchain",
					content:
						"Keep a short worksheet for machine model and toolchain that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on source-to-object boundaries, symbol names, and how the disassembler reveals structure so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-1-machine-model-and-toolchain/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-1-machine-model-and-toolchain/solution"
				},
				{
					title: "Unit 1: Machine Model and Toolchain supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 1: Machine Model and Toolchain",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-unit-1-machine-model-and-toolchain-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-unit-1-machine-model-and-toolchain-supplemental-2/solution"
				},
				{
					title: "Unit 1: Machine Model and Toolchain supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 1: Machine Model and Toolchain",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-04-unit-1-machine-model-and-toolchain-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-04-unit-1-machine-model-and-toolchain-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 2: Registers and Data Movement",
			curriculum: [
				{
					title: "General-Purpose Registers and Partial Register Views",
					content:
						"This section covers `rax`, `rbx`, `rcx`, `rdx`, the pointer and index registers, and the relationship between 64-bit, 32-bit, 16-bit, and 8-bit register views. Key idea: Partial-register writes can zero or preserve upper bits depending on the instruction and destination width."
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
				{
					title: "Project: Integer Calculator in Assembly",
					content:
						"Use the calculator lab to make register flow visible with arithmetic on function arguments and operator-driven dispatch. The project should be small enough to trace by hand while still forcing students to move values through argument registers and return registers intentionally.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM1-Integer-Calculator/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM1-Integer-Calculator/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Registers and Data Movement",
					content:
						"Keep a short worksheet for registers and data movement that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on which register holds each live value and how width changes alter the interpretation so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM1-Integer-Calculator/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM1-Integer-Calculator/solution"
				},
				{
					title: "Unit 2: Registers and Data Movement supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 2: Registers and Data Movement",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-2-registers-and-data-movement-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-2-registers-and-data-movement-supplemental-2/solution"
				},
				{
					title: "Unit 2: Registers and Data Movement supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 2: Registers and Data Movement",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-2-registers-and-data-movement-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-2-registers-and-data-movement-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 3: Arithmetic and Logic",
			curriculum: [
				{
					title: "add, sub, imul, and idiv",
					content:
						"This section covers the arithmetic instructions as state changes over explicit registers rather than as magical one-line operators. Key idea: Which instructions write only one destination register, which ones use implicit registers, and why signed division requires deliberate setup."
				},
				{
					title: "and, or, xor, test, and Condition Checks",
					content:
						"Use the logic instructions to connect bit operations to control flow. `test` and `xor` should feel especially practical because they show up constantly in zero checks, mask checks, and quick register clearing patterns."
				},
				{
					title: "Flags, Condition Codes, and Arithmetic Visibility",
					content:
						"This section covers the zero flag, sign flag, carry flag, and overflow flag as observable state that later drives conditional branches. Skill target: Explain not only what a calculation produced, but what flags that calculation set and why."
				},
				{
					title: "C-to-Assembly Compare: Arithmetic Helper",
					content:
						"Compare one arithmetic C function with the instruction sequence the compiler produced. Inspect the generated assembly, then explain why the compiler chose that sequence instead of a more literal source-level translation."
				},
				{
					title: "Unit 3: Arithmetic and Logic: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 3: Arithmetic and Logic",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-3-arithmetic-and-logic/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-3-arithmetic-and-logic/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Arithmetic and Logic",
					content:
						"Keep a short worksheet for arithmetic and logic that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on flag changes, implicit register use, and the difference between value changes and status changes so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-3-arithmetic-and-logic/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-3-arithmetic-and-logic/solution"
				},
				{
					title: "Unit 3: Arithmetic and Logic supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 3: Arithmetic and Logic",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-07-unit-3-arithmetic-and-logic-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-07-unit-3-arithmetic-and-logic-supplemental-2/solution"
				},
				{
					title: "Unit 3: Arithmetic and Logic supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 3: Arithmetic and Logic",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-08-unit-3-arithmetic-and-logic-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-08-unit-3-arithmetic-and-logic-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 4: Branching and Loops",
			curriculum: [
				{
					title: "cmp, jmp, and Conditional Jumps",
					content:
						"This section covers branching by making the compare-and-branch relationship explicit. Key idea: `cmp` prepares flags and `jcc` reads them, which is a clearer model than treating each conditional jump as a stand-alone feature."
				},
				{
					title: "Loop Construction and State Tracing",
					content:
						"Build loops from labels, compares, and jumps instead of hiding iteration in higher-level syntax. The course should repeatedly Predict the loop counter, current address, and exit condition before they run the next instruction."
				},
				{
					title: "Search and Accumulation Patterns",
					content:
						"Use array summation, scanning, and threshold checks as the recurring examples because they produce visible state changes without introducing too much scaffolding. These patterns also transfer directly into later performance and compiler-output discussions."
				},
				{
					title: "Project: Array Sum and Search Routines",
					content:
						"Use the array lab to connect loops, comparisons, pointer stepping, and return values. Skill target: Explain exactly how each pass through the loop changes the accumulator or search result and what causes the branch to continue or exit.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM2-Array-Sum-and-Search/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM2-Array-Sum-and-Search/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Branching and Loops",
					content:
						"Keep a short worksheet for branching and loops that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on loop counters, branch conditions, and which instruction actually decides whether the next iteration runs so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM2-Array-Sum-and-Search/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM2-Array-Sum-and-Search/solution"
				},
				{
					title: "Unit 4: Branching and Loops supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 4: Branching and Loops",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-4-branching-and-loops-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-4-branching-and-loops-supplemental-2/solution"
				},
				{
					title: "Unit 4: Branching and Loops supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 4: Branching and Loops",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-4-branching-and-loops-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-4-branching-and-loops-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 5: The Stack and Function Calls",
			curriculum: [
				{
					title: "call, ret, and Return Addresses",
					content:
						"This section covers `call` and `ret` as stack operations as well as control-flow operations. Key idea: The return address becomes data on the stack, which is why call depth, frame layout, and corruption bugs become visible in assembly."
				},
				{
					title: "Stack Frames and Local Storage",
					content:
						"Introduce stack frames as a bookkeeping convention rather than a law of nature. Show the prologue and epilogue patterns, when local stack space is reserved, and why optimized code may partially remove the frame students expected to see."
				},
				{
					title: "Saved Registers and Stack Alignment",
					content:
						"Explain why some registers must be preserved across calls and why stack alignment matters before calling into another function. This is the point where calls become ABI obligations, not just jumps with a convenient return."
				},
				{
					title: "C-to-Assembly Compare: Stack Frame Walkthrough",
					content:
						"Use a tiny C function with one local variable and one nested call to make the stack frame concrete. Map each assembly frame adjustment back to the source-level intent before changing the code."
				},
				{
					title: "Unit 5: The Stack and Function Calls: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 5: The Stack and Function Calls",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-07-unit-5-the-stack-and-function-calls/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-07-unit-5-the-stack-and-function-calls/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: The Stack and Function Calls",
					content:
						"Keep a short worksheet for the stack and function calls that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on return addresses, saved registers, and why the stack pointer moves when a function prepares for another call so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-07-unit-5-the-stack-and-function-calls/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-07-unit-5-the-stack-and-function-calls/solution"
				},
				{
					title: "Unit 5: The Stack and Function Calls supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 5: The Stack and Function Calls",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-unit-5-the-stack-and-function-calls-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-unit-5-the-stack-and-function-calls-supplemental-2/solution"
				},
				{
					title: "Unit 5: The Stack and Function Calls supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 5: The Stack and Function Calls",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-12-unit-5-the-stack-and-function-calls-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-12-unit-5-the-stack-and-function-calls-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 6: Calling Conventions and ABI",
			curriculum: [
				{
					title: "Parameter Passing and Return Values",
					content:
						"This section covers the System V AMD64 calling convention directly: which registers carry the first arguments, where integer return values come back, and when values spill to the stack. Skill target: Predict the first few arguments before stepping a call."
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
				{
					title: "Project: Call a C Helper from Assembly",
					content:
						"Use the mixed-language lab to sum values in assembly, then call back into a C helper that clamps or formats the result. The project should force students to keep argument registers, preserved registers, and stack alignment straight across the language boundary.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM4-Call-C-Helper-from-Assembly/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM4-Call-C-Helper-from-Assembly/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Calling Conventions and ABI",
					content:
						"Keep a short worksheet for calling conventions and abi that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on argument registers, preserved registers, and what must be restored before returning so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM4-Call-C-Helper-from-Assembly/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM4-Call-C-Helper-from-Assembly/solution"
				},
				{
					title: "Unit 6: Calling Conventions and ABI supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 6: Calling Conventions and ABI",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-13-unit-6-calling-conventions-and-abi-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-13-unit-6-calling-conventions-and-abi-supplemental-2/solution"
				},
				{
					title: "Unit 6: Calling Conventions and ABI supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 6: Calling Conventions and ABI",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-14-unit-6-calling-conventions-and-abi-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-14-unit-6-calling-conventions-and-abi-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 7: Memory Addressing and Data Structures",
			curriculum: [
				{
					title: "Base Plus Index Plus Scale Addressing",
					content:
						"This section covers complex addressing as a readable formula instead of a scary syntax form. Skill target: Decode base register, scaled index, and displacement into a clear statement like 'array base plus element index times element size plus field offset.'"
				},
				{
					title: "Arrays, Strings, and Sequential Memory Walks",
					content:
						"Use arrays and strings to reinforce that iteration in assembly is really address arithmetic and stop conditions. The key habit is explaining which address gets read next and why the loop exits when it does."
				},
				{
					title: "Struct Field Offsets and Data Layout Thinking",
					content:
						"Bring back struct offsets from C so assembly code that addresses a field becomes layout reasoning made explicit. This helps transfer earlier layout work into reverse engineering and compiler-output reading later in the course."
				},
				{
					title: "Project: String Length and Copy Routines",
					content:
						"Use the string lab to make pointer walking, null termination, and capacity-aware copying visible instruction by instruction. Skill target: Justify every load, store, and branch in terms of address movement and buffer boundaries.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM3-String-Length-and-Copy/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM3-String-Length-and-Copy/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Memory Addressing and Data Structures",
					content:
						"Keep a short worksheet for memory addressing and data structures that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on address formulas, stop conditions, and where each byte load or store lands in memory so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM3-String-Length-and-Copy/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM3-String-Length-and-Copy/solution"
				},
				{
					title: "Unit 7: Memory Addressing and Data Structures supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 7: Memory Addressing and Data Structures",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-15-unit-7-memory-addressing-and-data-structures-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-15-unit-7-memory-addressing-and-data-structures-supplemental-2/solution"
				},
				{
					title: "Unit 7: Memory Addressing and Data Structures supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 7: Memory Addressing and Data Structures",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-16-unit-7-memory-addressing-and-data-structures-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-16-unit-7-memory-addressing-and-data-structures-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: System Calls and Runtime Interaction",
			curriculum: [
				{
					title: "Minimal Linux Syscall Examples",
					content:
						"This section covers direct syscalls as the lowest visible interface between user-space code and the kernel, even if the active classroom build sometimes uses a libc-backed harness for portability. Key idea: The idea of putting a syscall number and arguments in the right registers and then interpreting the return value as success or failure."
				},
				{
					title: "libc versus Direct Syscalls",
					content:
						"Compare libc calls and direct syscalls so runtime interaction is visible at different layers. The key lesson is not choosing one forever, but understanding what extra behavior a runtime library adds beyond the raw kernel boundary."
				},
				{
					title: "argc, argv, and Process Startup State",
					content:
						"Use command-line arguments as a beginner-friendly runtime surface that still reveals process state, string parsing, and error handling. This gives students a concrete input path without requiring a large UI or framework."
				},
				{
					title: "Project: Tiny Command-Line Parser",
					content:
						"Use the parser lab to read `argv`, compare command names, parse decimal input, and dispatch a tiny operation. This keeps runtime interaction concrete while still reinforcing loops, comparisons, and mixed C plus assembly workflow.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM5-Tiny-Command-Line-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM5-Tiny-Command-Line-Parser/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: System Calls and Runtime Interaction",
					content:
						"Keep a short worksheet for system calls and runtime interaction that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on argument pointers, parse-state changes, and where invalid input should stop the flow so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM5-Tiny-Command-Line-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM5-Tiny-Command-Line-Parser/solution"
				},
				{
					title: "Unit 8: System Calls and Runtime Interaction supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 8: System Calls and Runtime Interaction",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-17-unit-8-system-calls-and-runtime-interaction-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-17-unit-8-system-calls-and-runtime-interaction-supplemental-2/solution"
				},
				{
					title: "Unit 8: System Calls and Runtime Interaction supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 8: System Calls and Runtime Interaction",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-18-unit-8-system-calls-and-runtime-interaction-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-18-unit-8-system-calls-and-runtime-interaction-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 9: Reading Compiler Output",
			curriculum: [
				{
					title: "Compile C to Assembly on Purpose",
					content:
						"Make compiler output a first-class learning tool. Repeatedly compile small C helpers to assembly so manual code shape can be compared to the compiler's choices instead of imagining the compiler as an opaque black box."
				},
				{
					title: "Map Source Lines to Instructions",
					content:
						"Align a source-level branch, loop, or local variable with its instruction-level representation. This becomes the bridge between high-level reasoning and low-level debugging when stepping instruction by instruction."
				},
				{
					title: "Optimization Changes the Shape, Not the Goal",
					content:
						"Unoptimized code favors readability and stack-heavy layouts, while optimized code may remove frames, reuse registers aggressively, or replace obvious source structure with tighter control flow. The point is to understand what changed and what semantic goal stayed the same."
				},
				{
					title: "C-to-Assembly Compare: Loop at O0 and O2",
					content:
						"Compile the same small loop with two optimization levels and compare the resulting assembly. Identify which parts got shorter, which values moved into registers, and which source-level intent remained unchanged."
				},
				{
					title: "Unit 9: Reading Compiler Output: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 9: Reading Compiler Output",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-08-unit-9-reading-compiler-output/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-08-unit-9-reading-compiler-output/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Reading Compiler Output",
					content:
						"Keep a short worksheet for reading compiler output that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on source-to-instruction mapping, optimization differences, and what evidence proves two versions still implement the same logic so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-08-unit-9-reading-compiler-output/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-08-unit-9-reading-compiler-output/solution"
				},
				{
					title: "Unit 9: Reading Compiler Output supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 9: Reading Compiler Output",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-19-unit-9-reading-compiler-output-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-19-unit-9-reading-compiler-output-supplemental-2/solution"
				},
				{
					title: "Unit 9: Reading Compiler Output supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 9: Reading Compiler Output",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-20-unit-9-reading-compiler-output-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-20-unit-9-reading-compiler-output-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 10: Debugging at Instruction Level",
			curriculum: [
				{
					title: "Step Instructions, Not Just Source Lines",
					content:
						"This section covers stepping by instruction so the smallest meaningful debugging unit becomes a machine instruction rather than a line of source. Watch how one compare, one move, or one conditional jump changes the machine state before the next instruction runs."
				},
				{
					title: "Watching Registers and Memory Together",
					content:
						"Use the debugger to watch the register file and selected memory ranges at the same time. The important habit is correlating the pointer values with the bytes they reference instead of treating registers and memory as separate worlds."
				},
				{
					title: "Breakpoints on Functions and Addresses",
					content:
						"This section covers symbolic breakpoints and raw address breakpoints for both source-friendly code and stripped-down instruction sequences. This is especially useful once optimization or reverse-engineering exercises make source-line stepping less reliable."
				},
				{
					title: "Instruction-Level Debug Pass on an Existing Lab",
					content:
						"Re-open an earlier lab and debug it from the assembly side only, without immediately jumping back to the C harness. Prove they can explain the bug or behavior from the instruction stream and machine state directly."
				},
				{
					title: "Unit 10: Debugging at Instruction Level: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 10: Debugging at Instruction Level",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-10-debugging-at-instruction-level/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-10-debugging-at-instruction-level/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Debugging at Instruction Level",
					content:
						"Keep a short worksheet for debugging at instruction level that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on where execution stopped, which machine state changed next, and what the next branch decision depends on so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-10-debugging-at-instruction-level/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-10-debugging-at-instruction-level/solution"
				},
				{
					title: "Unit 10: Debugging at Instruction Level supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 10: Debugging at Instruction Level",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-21-unit-10-debugging-at-instruction-level-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-21-unit-10-debugging-at-instruction-level-supplemental-2/solution"
				},
				{
					title: "Unit 10: Debugging at Instruction Level supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 10: Debugging at Instruction Level",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-22-unit-10-debugging-at-instruction-level-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-22-unit-10-debugging-at-instruction-level-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 11: Performance and Code Shape",
			curriculum: [
				{
					title: "Branch Cost and Predictability",
					content:
						"Introduce branches as potential performance costs without turning the course into premature micro-optimization. Key idea: At a high level why predictable straight-line code often behaves differently from branch-heavy code, even when the instruction count looks similar on paper."
				},
				{
					title: "Memory Locality and Access Patterns",
					content:
						"Use array walks and pointer-chasing examples to connect performance back to layout and locality. The key lesson is that where data lives in memory can matter as much as the arithmetic instructions operating on it."
				},
				{
					title: "Instruction Count versus Real Performance",
					content:
						"Distrust simplistic 'fewer instructions always wins' thinking. Some instructions are more expensive than others, memory access matters, and compiler optimizations often reshape the cost model in ways that should be observed rather than assumed."
				},
				{
					title: "C-to-Assembly Compare: Loop Shape versus Loop Cost",
					content:
						"Compare two small assembly listings from alternate versions of an array routine. Decide whether visible instruction count alone tells the whole performance story, then name the missing evidence such as memory access, branching, or cache behavior."
				},
				{
					title: "Unit 11: Performance and Code Shape: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 11: Performance and Code Shape",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-11-performance-and-code-shape/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-11-performance-and-code-shape/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Performance and Code Shape",
					content:
						"Keep a short worksheet for performance and code shape that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on branch frequency, memory-access patterns, and which cost assumptions came from evidence versus guesswork so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-11-performance-and-code-shape/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-11-performance-and-code-shape/solution"
				},
				{
					title: "Unit 11: Performance and Code Shape supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 11: Performance and Code Shape",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-23-unit-11-performance-and-code-shape-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-23-unit-11-performance-and-code-shape-supplemental-2/solution"
				},
				{
					title: "Unit 11: Performance and Code Shape supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 11: Performance and Code Shape",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-24-unit-11-performance-and-code-shape-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-24-unit-11-performance-and-code-shape-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 12: Security and Reliability Visibility",
			curriculum: [
				{
					title: "Stack Canaries, PIE, and Binary Hardening Signals",
					content:
						"This section covers stack canaries, PIE, and related hardening features as visible patterns around the code students already understand. The point is not exhaustive exploit mitigation coverage; it is helping students recognize how security features show up around functions, calls, and process layout."
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
				{
					title: "Project: Reverse-Engineer a Toy Program Back into Pseudocode",
					content:
						"Use the reverse-engineering lab to inspect a hand-written assembly routine, reconstruct its logic in C or pseudocode, and compare the outputs. The main lesson is that students can recover real structure from instruction flow instead of treating a disassembly listing as unreadable noise.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM6-Reverse-Engineering-Toy-Program/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM6-Reverse-Engineering-Toy-Program/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Security and Reliability Visibility",
					content:
						"Keep a short worksheet for security and reliability visibility that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on where the hardening or bug evidence appears around the function and what that reveals about runtime behavior so the worksheet narrates instruction flow rather than only skimming mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM6-Reverse-Engineering-Toy-Program/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM6-Reverse-Engineering-Toy-Program/solution"
				},
				{
					title: "Unit 12: Security and Reliability Visibility supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 12: Security and Reliability Visibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-25-unit-12-security-and-reliability-visibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-25-unit-12-security-and-reliability-visibility-supplemental-2/solution"
				},
				{
					title: "Unit 12: Security and Reliability Visibility supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 12: Security and Reliability Visibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-26-unit-12-security-and-reliability-visibility-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-26-unit-12-security-and-reliability-visibility-supplemental-3/solution"
				}
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
						"Treat SIMD as a later specialization rather than a prerequisite. First be fluent in scalar register tracing and calling conventions, then move into packed-data operations once the underlying mental model is stable."
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
				},
				{
					title: "ASM13 Expansion Ideas and Next Steps: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM13 Expansion Ideas and Next Steps",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-asm13-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-asm13-expansion-ideas-and-next-steps/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Expansion Ideas and Next Steps",
					content:
						"Keep a short worksheet for expansion ideas and next steps that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on which next specialization fits the current strengths and why; the worksheet should narrate instruction flow rather than only skim mnemonics.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-asm13-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-asm13-expansion-ideas-and-next-steps/solution"
				},
				{
					title: "Expansion Ideas and Next Steps supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM13 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-27-asm13-expansion-ideas-and-next-steps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-27-asm13-expansion-ideas-and-next-steps-supplemental-2/solution"
				},
				{
					title: "Expansion Ideas and Next Steps supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM13 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-28-asm13-expansion-ideas-and-next-steps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-28-asm13-expansion-ideas-and-next-steps-supplemental-3/solution"
				}
			]
		},
		{
			title: "Assembly Lab 15: Implementation Lab",
			curriculum: [
				{
					title: "Assembly Lab 15: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Assembly Lab 15: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Assembly Lab 15: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-assembly-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-assembly-lab-15/solution"
				},
				{
					title: "Assembly Lab 15: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Assembly Lab 15: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-assembly-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-assembly-lab-15/solution"
				},
				{
					title: "Assembly Lab 15 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-29-applied-studio-15-assembly-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-29-applied-studio-15-assembly-lab-15-supplemental-2/solution"
				},
				{
					title: "Assembly Lab 15 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-30-applied-studio-15-assembly-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-30-applied-studio-15-assembly-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Assembly Lab 16: Implementation Lab",
			curriculum: [
				{
					title: "Assembly Lab 16: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Assembly Lab 16: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Assembly Lab 16: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-assembly-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-assembly-lab-16/solution"
				},
				{
					title: "Assembly Lab 16: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Assembly Lab 16: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-assembly-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-assembly-lab-16/solution"
				},
				{
					title: "Assembly Lab 16 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-31-applied-studio-16-assembly-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-31-applied-studio-16-assembly-lab-16-supplemental-2/solution"
				},
				{
					title: "Assembly Lab 16 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-32-applied-studio-16-assembly-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-32-applied-studio-16-assembly-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Assembly Lab 17: Implementation Lab",
			curriculum: [
				{
					title: "Assembly Lab 17: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Implementation Lab",
						section: "concepts"
					})
				},
				{
					title: "Assembly Lab 17: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Implementation Lab",
						section: "example"
					})
				},
				{
					title: "Assembly Lab 17: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Implementation Lab",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-assembly-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-assembly-lab-17/solution"
				},
				{
					title: "Assembly Lab 17: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Implementation Lab",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Assembly Lab 17: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Implementation Lab",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-assembly-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-assembly-lab-17/solution"
				},
				{
					title: "Assembly Lab 17 supplemental 2: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-33-applied-studio-17-assembly-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-33-applied-studio-17-assembly-lab-17-supplemental-2/solution"
				},
				{
					title: "Assembly Lab 17 supplemental 3: Implementation Lab",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Implementation Lab",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-34-applied-studio-17-assembly-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-34-applied-studio-17-assembly-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};
