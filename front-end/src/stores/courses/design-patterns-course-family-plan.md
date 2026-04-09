# Design Patterns Course Family Plan

## Setup and Tooling

Preferred IDEs by language:

- `Java`: `IntelliJ IDEA` or `VS Code`
- `C++`: `CLion` or `VS Code`
- `Python`: `PyCharm` or `VS Code`

Official links:

- [IntelliJ IDEA installation guide](https://www.jetbrains.com/help/idea/installation-guide.html)
- [CLion installation guide](https://www.jetbrains.com/help/clion/installation-guide.html)
- [PyCharm installation guide](https://www.jetbrains.com/help/pycharm/installation-guide.html)
- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [VS Code Java guide](https://code.visualstudio.com/docs/java/java-tutorial)
- [VS Code Python guide](https://code.visualstudio.com/docs/languages/python)
- [VS Code C++ on macOS](https://code.visualstudio.com/docs/cpp/config-clang-mac)
- [VS Code C++ with WSL](https://code.visualstudio.com/docs/cpp/config-wsl)

macOS walkthrough:

1. Choose the language track first, because the setup should match the course.
2. Install the matching JetBrains IDE or VS Code.
3. Install the required language runtime or compiler before the first lesson.
4. If the student chooses VS Code, add only the language-specific extensions they need so the environment stays understandable.
5. Create a dedicated top-level `design-patterns` workspace folder with subfolders for `java`, `cpp`, and `python` if multiple tracks are being compared.

Windows walkthrough:

1. Choose the language track before installing tools.
2. Install the matching JetBrains IDE or VS Code.
3. For C++, prefer WSL2 plus Ubuntu so debugging, build tools, and CMake behave more consistently.
4. For Java and Python, install the language runtime and confirm the IDE sees it before starting.
5. Keep the projects in clearly named folders so students can compare the same pattern across languages later.

Course-specific notes:

- This course family should begin with tooling that makes class structure, file organization, and debugging visible.
- CMake is relevant only for the C++ track.
- The first module in every track should teach how to run, debug, and navigate a multi-file project.

## Positioning

Design patterns should become a small course family rather than a single
language-locked class. The main value is not memorizing the Gang of Four names;
it is learning how to recognize recurring design problems, compare tradeoffs,
and build code that can evolve without turning brittle.

This family should connect naturally to:

- `Python` and `PyGames`, where students begin to feel architectural pain
- `Java`, where interfaces and object modeling make classic patterns especially visible
- `C++`, where ownership, lifetime, and compile-time structure add a systems angle

## Current Implementation Status

The Java-first track is already implemented in the live catalog as two courses:

1. `Design Patterns in Java`
2. `Design Patterns in Java Part 2: Refactoring`

That means this family plan should now be treated as a coordination document for
the remaining language tracks rather than as a proposal to build the Java track
from scratch. The Java sequence currently owns:

- the broad Refactoring.Guru design-pattern catalog in a Java-first form
- the smell families and refactoring-technique groups from Refactoring.Guru
- the main capstone arc that moves from smell diagnosis to justified pattern use

## Recommendation on Language Strategy

Best overall recommendation:

- Keep `Java` as the primary completed design-patterns track
- Use `C++` as the next companion course focused on patterns plus ownership and systems tradeoffs
- Use `Python` as a shorter adaptation track focused on "Pythonic equivalents" rather than strict textbook reproduction

Why:

- Java is the cleanest teaching language for classic object-oriented design patterns.
- C++ is highly valuable, but the course must also explain value semantics, RAII, templates, and ownership, which increases cognitive load.
- Python is familiar to more students, but many Java-style patterns are either simplified or expressed differently because Python is more dynamic and has stronger built-in abstractions.

## Audience and Prerequisites

- Completed an introductory course in at least one of `Java`, `C++`, or `Python`
- Comfortable with functions, classes, files, and debugging
- Ready to reason about architecture rather than only syntax

## Core Outcomes

- Recognize the difference between a code smell and a real design problem
- Explain what a pattern solves, what tradeoff it introduces, and when not to use it
- Distinguish creation, structure, behavior, and architecture-level patterns
- Refactor medium-sized programs into cleaner object collaboration
- Compare how the same pattern looks different across Java, C++, and Python

## Shared Course Spine

### Unit 1: What Patterns Are and What They Are Not

- patterns as reusable design ideas, not copy-paste recipes
- anti-patterns
- overengineering risks
- why "just use inheritance" often ages badly

### Unit 2: Design Foundations Before Patterns

- composition over inheritance
- interfaces and contracts
- coupling and cohesion
- single-responsibility thinking
- dependency direction

### Unit 3: Creational Patterns

- Factory Method
- Abstract Factory
- Builder
- Singleton, including why to be skeptical of it
- Prototype where relevant

### Unit 4: Structural Patterns

- Adapter
- Facade
- Decorator
- Composite
- Proxy

### Unit 5: Behavioral Patterns

- Strategy
- Observer
- Command
- State
- Template Method
- Iterator

### Unit 6: Architectural and Modern Extensions

- dependency injection
- plugin architecture
- event bus/pub-sub
- MVC/MVVM at a conceptual level
- repository/service layering where appropriate

### Unit 7: Refactoring and Pattern Selection

- identifying code smells
- extracting seams
- replacing conditionals with polymorphism where justified
- measuring whether the design actually improved
- in the current catalog, this unit is already expanded into the dedicated Java Part 2 refactoring course

### Unit 8: Capstone

- take a medium-sized codebase
- identify weak design boundaries
- refactor with a small, justified set of patterns
- document tradeoffs

## Recommended Course Products

- a language-neutral slide/deck strand explaining each pattern visually
- language-specific project packs in Java, C++, and Python
- comparison charts that show how the same pattern differs across languages
- refactoring labs that start from intentionally messy code

## Suggested Course Order

Current implemented order:

1. `Design Patterns in Java`
2. `Design Patterns in Java Part 2: Refactoring`

Recommended next build order for the remaining family:

1. `Design Patterns in C++`
2. `Pythonic Design Patterns`

If the long-term goal is a bundled sequence:

1. short language-neutral intro module
2. completed Java patterns course
3. completed Java refactoring follow-up
4. C++ follow-up
5. Python adaptation/elective

## Example Shared Capstones

- GUI or menu-driven task manager
- text-based RPG engine
- drawing or shape composition toolkit
- simulation framework with swappable rules
- plugin-based content pipeline

## Expansion Ideas

- Add a dedicated unit on testing pattern-heavy code.
- Add a section comparing textbook patterns to modern framework conventions.
- Add interviews and code-review style exercises where students diagnose whether a pattern helps or hurts.
- Add a "patterns in game development" elective connected to `PyGames`.
- Add a "patterns in backend services" elective connected to the web and network-security plans.
