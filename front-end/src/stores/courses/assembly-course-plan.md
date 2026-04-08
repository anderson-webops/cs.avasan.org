# Assembly Course Plan

## Setup and Tooling

Preferred IDEs: `CLion` or `VS Code`.

Official links:

- [CLion install guide](https://www.jetbrains.com/help/clion/installation-guide.html)
- [CLion quick CMake tutorial](https://www.jetbrains.com/help/clion/quick-cmake-tutorial.html)
- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [VS Code C++ on macOS](https://code.visualstudio.com/docs/cpp/config-clang-mac)
- [VS Code C++ with WSL](https://code.visualstudio.com/docs/cpp/config-wsl)

macOS walkthrough:

1. Install Apple command-line tools with `xcode-select --install`.
2. Install CLion or VS Code.
3. Install CMake if the project uses it. `brew install cmake` is the easiest path.
4. If using VS Code, install `C/C++`, `CMake Tools`, and `CodeLLDB`.
5. If the course uses NASM syntax, install `nasm` as well.
6. Verify `clang --version`, `lldb --version`, and `cmake --version`.

Windows walkthrough:

1. Install CLion or VS Code.
2. Install WSL2 plus Ubuntu for the cleanest Unix-like assembly workflow, or install a local compiler/debugger toolchain.
3. If using VS Code, install `C/C++`, `CMake Tools`, and `CodeLLDB`.
4. If the course uses NASM syntax, install `nasm` in WSL or on Windows.
5. Verify assembler, debugger, and CMake commands from a terminal.

Course-specific notes:

- Use `lldb`, `objdump`/`llvm-objdump`, and `nm` early.
- For Windows learners, WSL2 is the most productive path because the shell and toolchain match most assembly tutorials more closely.

## Recommended Architecture

Use `x86-64 assembly` first.

It is the most productive choice for desktop/server relevance, reverse
engineering value, debugger support, and transfer into systems/security topics.
An optional final module can compare key ideas with ARM64.

## Audience and Prerequisites

- Completed the C systems engineering course or equivalent
- Comfortable with pointers, stack vs heap, structs, and compilation
- Comfortable reading compiler output and using a debugger

## Core Outcomes

- Read and write small x86-64 assembly programs
- Understand registers, flags, addressing modes, and the call stack
- Trace function calls and calling conventions
- Connect C code to generated assembly
- Debug memory and control flow at the instruction level

## Recommended Structure

### Unit 1: Machine Model and Toolchain

- assembler, linker, object files
- Intel vs AT&T syntax choice
- disassembly workflow

### Unit 2: Registers and Data Movement

- general-purpose registers
- `mov`, zero extension, sign extension
- immediate, register, and memory operands

### Unit 3: Arithmetic and Logic

- `add`, `sub`, `imul`, `idiv`
- `and`, `or`, `xor`, `test`
- flags and condition codes

### Unit 4: Branching and Loops

- `cmp`, `jmp`, conditional jumps
- loop construction
- state tracing

### Unit 5: The Stack and Function Calls

- `call`, `ret`
- stack frames
- local storage
- saved registers

### Unit 6: Calling Conventions and ABI

- parameter passing
- return values
- callee-saved vs caller-saved registers
- interacting with C

### Unit 7: Memory Addressing and Data Structures

- base + index + scale
- arrays
- strings
- struct field offsets

### Unit 8: System Calls and Runtime Interaction

- minimal Linux syscall examples
- I/O from assembly
- error returns

### Unit 9: Reading Compiler Output

- compile C to assembly
- map source lines to instructions
- optimization effects

### Unit 10: Debugging at Instruction Level

- stepping instructions
- watching registers and memory
- setting breakpoints on functions and addresses

### Unit 11: Performance and Code Shape

- branch cost
- memory locality
- instruction count vs real performance

### Unit 12: Security and Reliability Visibility

- how stack canaries, PIE, and RELRO appear around assembly and binaries
- how assembly helps explain low-level bugs

## Example Project Outlines

- Integer calculator in assembly
- Array sum and search routines
- String length and copy routines
- Call a C helper from assembly
- Write a tiny command-line parser
- Reverse-engineer a compiled toy program back into pseudocode

## Delivery Notes

- Start from reading before writing
- Keep projects tiny and composable
- Use side-by-side C and assembly views frequently
- Include register-trace worksheets

## Expansion Ideas

- Add ARM64 comparison modules
- Add SIMD introduction
- Add a reverse-engineering elective
- Add linker and relocation deep dives
