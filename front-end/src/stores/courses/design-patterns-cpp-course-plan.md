# Design Patterns in C++ Course Plan

## Setup and Tooling

Preferred IDEs: `CLion` or `VS Code`.

Official links:

- [CLion installation guide](https://www.jetbrains.com/help/clion/installation-guide.html)
- [CLion quick CMake tutorial](https://www.jetbrains.com/help/clion/quick-cmake-tutorial.html)
- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code C++ on macOS](https://code.visualstudio.com/docs/cpp/config-clang-mac)
- [VS Code C++ with WSL](https://code.visualstudio.com/docs/cpp/config-wsl)

macOS walkthrough:

1. Install Apple command-line tools with `xcode-select --install`.
2. Install CLion or VS Code.
3. Install CMake if it is not already available.
4. If using VS Code, add `C/C++`, `CMake Tools`, and `CodeLLDB`.
5. Verify `clang++ --version`, `cmake --version`, and `lldb --version` before starting the course.

Windows walkthrough:

1. Install CLion or VS Code.
2. Prefer WSL2 plus Ubuntu for the cleanest compiler and debugger workflow.
3. Install CMake and a C++ toolchain inside WSL if using that path.
4. If using VS Code, add `C/C++`, `CMake Tools`, and `CodeLLDB`.
5. Verify that build, run, and debug all work in a multi-file CMake project before beginning.

Course-specific notes:

- CMake should be standardized early, since the course should emphasize medium-sized code organization rather than single-file samples.
- Modern C++ ownership tools such as `unique_ptr`, references, and RAII should be taught alongside patterns so students do not reproduce Java-era designs blindly.

## Positioning

This should be the advanced follow-up to the Java design-patterns course or a
parallel track for students already deeper into systems programming. The course
should teach patterns in a modern C++ way, not as direct ports of old Java
examples. Ownership, value semantics, templates, and RAII materially change how
some patterns should be written.

## Audience and Prerequisites

- Completed `C++ Level 1` and ideally the planned `C Systems Engineering` or similar low-level work
- Comfortable with classes, headers, references, pointers, and debugging
- Ready to think about API design and memory ownership at the same time

## Core Outcomes

- Implement classic patterns in idiomatic modern C++
- Understand when value types remove the need for a pattern
- Design with ownership, lifetime, and API boundaries in mind
- Refactor legacy-style inheritance-heavy code into clearer modern C++ structure
- Compare runtime and compile-time design tradeoffs

## Recommended Structure

### Unit 1: Why Design Patterns Look Different in Modern C++

- object ownership
- RAII
- stack vs heap decisions
- value semantics vs reference semantics
- why some textbook patterns become lighter in C++

### Unit 2: Design Foundations

- interfaces through abstract base classes
- composition
- const-correctness
- move semantics at a practical level
- header/source organization

### Unit 3: Factory Method, Abstract Factory, and Builder

- ownership-aware creation
- returning smart pointers vs values
- polymorphic construction
- configuration-heavy object setup

### Unit 4: Strategy and Policy-Based Design

- runtime strategy objects
- lambdas and function objects
- when templates replace part of the pattern

### Unit 5: Observer and Event Flow

- subscriptions
- lifetime-safe listeners
- avoiding dangling callbacks
- push vs pull models

### Unit 6: Decorator, Adapter, and Facade

- wrapping subsystems
- adapting old APIs
- layered behavior with ownership clarity

### Unit 7: Command and State

- command queues
- action history
- undo support
- explicit state objects vs enum-driven branching

### Unit 8: Composite and Iterator

- trees of heterogeneous objects
- traversal patterns
- container exposure tradeoffs

### Unit 9: Singleton, Global State, and Dependency Injection

- why Singletons are often attractive but risky
- alternatives using injected dependencies and well-scoped services
- static initialization pitfalls

### Unit 10: Patterns for Resource Management

- handle/body concepts
- pImpl
- RAII wrappers
- scope guards
- why some "patterns" in C++ are partly resource-management patterns

### Unit 11: Legacy Refactoring Lab

- identify an inheritance-heavy or raw-pointer-heavy design
- reduce implicit ownership
- separate responsibilities
- improve compile-time and runtime clarity

### Unit 12: Capstone

- build or refactor a medium-sized engine, editor tool, or simulation framework
- justify each pattern in terms of flexibility, lifetime, or testability

## Example Project Outlines

- Scene graph or UI widget tree using `Composite` and `Iterator`
- Game entity behavior system using `Strategy`, `State`, and factories
- File-format tool using `Facade`, `Adapter`, and `Builder`
- Command-driven editor or simulator with `Command` and undo
- Resource manager and rendering abstraction using RAII-oriented wrappers

## Delivery Notes

- Every module should compare:
  - textbook version
  - modern C++ version
  - why the modern version changed

- The course should explicitly warn students not to import Java-style heap-heavy object graphs into C++ without reason.
- Sanitizers and debuggers should be part of the workflow so design mistakes surface concretely.

## Expansion Ideas

- Add a unit on patterns in game engines and rendering pipelines.
- Add a templates-and-generic-programming appendix showing where compile-time patterns outperform runtime ones.
- Add a unit on plugin/module boundaries and ABI concerns.
- Add a follow-up capstone focused on refactoring older pre-C++11 style code into modern C++.
