# Low Level Security Part 2 Plan

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
3. Install CMake.
4. If using VS Code, install `C/C++`, `CMake Tools`, `CodeLLDB`, and `Hex Editor`.
5. Verify `clang`, `lldb`, `cmake`, and `llvm-objdump` or `objdump`.

Windows walkthrough:

1. Install CLion or VS Code.
2. Install WSL2 and Ubuntu for the cleanest low-level lab environment.
3. Install `C/C++`, `CMake Tools`, `CodeLLDB`, and `Hex Editor` if using VS Code.
4. Verify compiler, debugger, and disassembly tools from the Linux shell.

Course-specific notes:

- This course should assume a local lab-only environment.
- Sanitizers and debugger setup should be part of day-one onboarding, not an optional appendix.

## Positioning

This course should follow `Low Level Security` and focus on exploitability
analysis in tightly controlled toy programs. The goal is not offensive
deployment. The goal is to teach how a defensive engineer determines whether a
bug is security-relevant, how mitigations change risk, and how to patch with
confidence.

## Audience and Prerequisites

- Completed `Low Level Security Part 1`
- Comfortable with C/C++ pointers, arrays, structs, and memory layout
- Comfortable using sanitizers, a debugger, and a disassembler at a beginner
  level
- Strong understanding of ethics and lab-only boundaries

## Core Outcomes

- Distinguish a crash from an exploitable condition
- Explain why a specific bug class can lead to control-flow or data corruption
- Evaluate how ASLR, NX, canaries, RELRO, and allocator behavior change risk
- Reproduce toy-program failures in a local lab and pair them with mitigations
- Write patch notes and regression tests that close the bug class

## Recommended Structure

### Module 1: Exploitability Triage

- Reachability, controllability, impact, and attacker assumptions
- Crash taxonomy: harmless abort, denial of service, memory disclosure, memory
  corruption
- How to write a short exploitability note for maintainers

### Module 2: Stack Corruption in Toy Programs

- Saved return addresses, local buffers, and frame structure
- Stack corruption only inside intentionally vulnerable lab binaries
- Why stack canaries and safer APIs change the outcome

### Module 3: Heap Lifetime and Heap Metadata Concepts

- Use-after-free, double free, stale pointer reuse
- Ownership mistakes that turn bugs into security bugs
- High-level allocator behavior without diving into real-world exploitation kits

### Module 4: Information Disclosure and Memory Observation

- Uninitialized reads, oversized reads, and stale data disclosure
- Why leaked addresses or object contents increase risk
- How to harden logs, debug output, and serialization boundaries

### Module 5: Mitigation-Aware Analysis

- NX, ASLR, PIE, RELRO, stack canaries, hardened allocators
- How mitigations shrink the attack surface but do not replace fixing the bug
- How to verify protections in a binary build

### Module 6: Control-Flow Thinking for Defenders

- High-level introduction to return-oriented thinking
- Why control-flow integrity matters
- Why modern mitigations and safer languages are valuable

### Module 7: From Bug Report to Patch

- Reproduce
- Assess exploitability
- Prioritize
- Patch
- Add a regression case
- Communicate clearly

### Module 8: Capstone Audit

- Review a larger intentionally flawed toy codebase
- Identify several bug classes
- Rank them by impact
- Patch and verify them
- Deliver an audit packet and mitigation summary

## Example Project Outlines

- `LLS13 Crash Classification Lab`
- `LLS14 Stack Frame Corruption Demo and Fix`
- `LLS15 Heap Lifetime Audit`
- `LLS16 Mitigation Comparison Build Matrix`
- `LLS17 Disclosure and Triage Report`
- `LLS18 Exploit-Informed Hardening Capstone`

## Delivery Notes

- Every lab should be local and self-contained
- Every risky concept should end with a patch and mitigation section
- No public targets, no live services, no real-world payloads
- Require a written ethics statement at the start of the course

## Expansion Ideas

- Add a side track on secure code review for CTF-like toy binaries
- Add a small ARM64 comparison section
- Add a module on kernel/user boundary concepts
- Add one lab on sandboxing and process isolation
