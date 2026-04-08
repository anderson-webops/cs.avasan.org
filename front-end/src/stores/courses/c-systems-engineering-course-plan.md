# C Systems Engineering Course Plan

## Setup and Tooling

Preferred IDEs: `CLion` or `VS Code`.

Official links:

- [CLion install guide](https://www.jetbrains.com/help/clion/installation-guide.html)
- [CLion quick CMake tutorial](https://www.jetbrains.com/help/clion/quick-cmake-tutorial.html)
- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code C++ on macOS](https://code.visualstudio.com/docs/cpp/config-clang-mac)
- [VS Code C++ with WSL](https://code.visualstudio.com/docs/cpp/config-wsl)

macOS walkthrough:

1. Install Apple command-line tools with `xcode-select --install`.
2. Install CLion or VS Code.
3. Install CMake if the course projects use it.
4. If using VS Code, install `C/C++`, `CMake Tools`, and `CodeLLDB`.
5. Verify `clang --version`, `cmake --version`, and `lldb --version`.

Windows walkthrough:

1. Install CLion or VS Code.
2. Install WSL2 and Ubuntu, or another C compiler/debugger toolchain.
3. If using VS Code, install `C/C++`, `CMake Tools`, and `CodeLLDB`.
4. Verify `gcc`/`clang`, `gdb`/`lldb`, and `cmake`.

Course-specific notes:

- This course should standardize on a simple CMake project layout once students move beyond single-file programs.
- Prefer Clang or GCC plus sanitizers for debugging memory and integer issues.

## Positioning

This course should extend the current C++ path by teaching systems concepts in
C, where memory, representation, and low-level operations are more visible. It
should focus on engineering fundamentals rather than only language syntax.

## Audience and Prerequisites

- Completed `C++ Level 1` or equivalent
- Comfortable with variables, loops, functions, arrays, and pointers
- Ready for manual memory management and stricter debugging

## Core Outcomes

- Read and write binary, hexadecimal, and bit-level representations
- Use bitwise operators with confidence, including XOR
- Understand signedness, two's complement, endianness, and alignment
- Build small systems-style tools in C
- Connect abstract engineering concepts to memory and data movement

## Recommended Structure

### Unit 1: Why C for Systems Work

- translation units
- compilation and linking
- runtime model compared to higher-level languages

### Unit 2: Binary, Hex, and Number Representation

- bits, nibbles, bytes, words
- decimal to binary and hex conversions
- signed vs unsigned integers
- two's complement

### Unit 3: Bitwise Operations

- AND, OR, XOR, NOT
- left and right shifts
- masking, flag extraction, bit packing

### Unit 4: Memory and Layout

- addresses and pointer arithmetic
- stack vs heap vs static storage
- alignment and padding
- array and struct layout

### Unit 5: Strings and Byte Buffers

- C strings vs raw byte arrays
- length vs capacity
- null termination
- safe copy patterns

### Unit 6: Files, Streams, and Parsing

- `FILE*`, buffered I/O, binary vs text files
- reading structured data
- checksums and validation

### Unit 7: Dynamic Memory and Lifetime

- `malloc`, `calloc`, `realloc`, `free`
- ownership
- leaks and invalid frees
- allocator debugging

### Unit 8: Function Pointers and Dispatch

- callbacks
- tables of handlers
- state machines
- event-driven patterns

### Unit 9: Data Structures in C

- dynamic arrays
- linked lists
- ring buffers
- hash tables at a beginner-friendly level

### Unit 10: Engineering Math in Code

- fixed-point thinking
- overflow-aware arithmetic
- unit conversion reliability
- numeric error and approximation

### Unit 11: Systems Tooling

- compiler flags
- `gdb` or `lldb`
- sanitizers
- `objdump` or `llvm-objdump`
- `nm`

### Unit 12: Capstone Engineering Utility

- build a robust CLI tool that reads structured input, transforms it, and
  writes validated output

## Example Project Outlines

- Hex and binary inspector
- Bitflag configuration parser
- XOR-based toy encoder/decoder with strong explanation of what XOR does
- Packet serializer/deserializer
- Memory visualizer for arrays and structs
- Fixed-size log file reader

## Delivery Notes

- Pair every abstract representation topic with a printed byte view
- Use diagrams for memory and bit patterns
- Require short writeups explaining why the code works, not just code output

## Expansion Ideas

- Add embedded systems and microcontroller concepts
- Add finite-state machines for protocol parsing
- Add concurrency with POSIX threads
- Add a small custom allocator lab
