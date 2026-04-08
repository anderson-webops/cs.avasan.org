# Pythonic Design Patterns Course Plan

## Setup and Tooling

Preferred IDEs: `PyCharm` or `VS Code`.

Official links:

- [PyCharm installation guide](https://www.jetbrains.com/help/pycharm/installation-guide.html)
- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [VS Code Python guide](https://code.visualstudio.com/docs/languages/python)
- [Python downloads](https://www.python.org/downloads/?m=landing)

macOS walkthrough:

1. Install Python 3.
2. Install PyCharm or VS Code.
3. If using VS Code, add `Python`, `Pylance`, and `Jupyter`.
4. Create a `design-patterns-python` workspace with one folder per module or project.
5. Verify that a multi-file Python project runs and debugs cleanly before starting.

Windows walkthrough:

1. Install Python 3 and enable the PATH option.
2. Install PyCharm or VS Code.
3. If using VS Code, add `Python`, `Pylance`, and `Jupyter`.
4. Confirm `python --version` works in a terminal and that the IDE is using that interpreter.
5. Verify that students can navigate modules, packages, and virtual environments before beginning the architecture material.

Course-specific notes:

- No CMake setup is needed.
- This course should emphasize when Python needs a classic pattern, when it only needs a function or protocol, and when built-in language features already solve the problem.

## Positioning

This should not simply be a Python port of the Java course. Python is the most
accessible language for many students, but it often expresses the same design
intent with fewer layers, more functions, richer built-ins, and a more dynamic
object model. That makes the course valuable, but different.

Best role for this course:

- either a shorter elective after core Python
- or a companion course that translates classic pattern ideas into Pythonic design

## Audience and Prerequisites

- Completed `Python Level 2` and ideally `Python Level 3`
- Comfortable with functions, classes, modules, decorators, and exceptions
- Ready for larger projects and refactoring

## Core Outcomes

- Recognize the underlying design problem before reaching for a named pattern
- Translate classic patterns into idiomatic Python when appropriate
- Use functions, callables, protocols, decorators, and data classes well
- Avoid over-engineered Java-style abstractions in Python
- Improve maintainability in medium-sized Python codebases

## Recommended Structure

### Unit 1: Why Python Changes the Design-Patterns Conversation

- dynamic typing
- duck typing
- first-class functions
- decorators
- modules as organizational tools
- batteries-included abstractions

### Unit 2: Design Foundations in Python

- composition
- protocols and informal interfaces
- data classes
- dependency direction
- modules and packages

### Unit 3: Strategy Without Ceremony

- functions as strategies
- callable objects
- class-based strategy only when state or structure requires it

### Unit 4: Factory and Builder in Python

- factory functions
- class methods as constructors
- configuration objects
- when a full builder is warranted vs overkill

### Unit 5: Observer, Events, and Callbacks

- subscription lists
- signals/callbacks
- async event handling at a conceptual level

### Unit 6: Decorator, Proxy, and Facade

- function decorators
- object wrappers
- subsystem simplification
- logging, caching, and access-control examples

### Unit 7: State and Command

- explicit state objects
- closures and command objects
- undo/redo with lightweight object design

### Unit 8: Adapter and Integration Boundaries

- wrapping third-party APIs
- normalizing inconsistent data sources
- compatibility layers

### Unit 9: Template Method vs Higher-Order Functions

- inheritance-based skeletons
- hook methods
- replacing some Template Method use cases with callables or composition

### Unit 10: Singleton, Global State, and Module Patterns

- module-level singletons
- config objects
- dependency injection alternatives
- avoiding hidden globals

### Unit 11: Refactoring Python Code Smells

- overly large classes
- script-to-application transitions
- tangled conditionals
- mixed data and behavior responsibilities

### Unit 12: Capstone

- refactor a medium-sized Python project
- justify which patterns were used and which were intentionally avoided
- document what made the final version more Pythonic

## Example Project Outlines

- Plugin-based text processing pipeline
- Turn-based game engine using `State`, `Strategy`, and `Command`
- Notification system using callbacks and `Observer`
- API integration layer using `Adapter`, `Facade`, and factory functions
- Workflow tool using decorators, commands, and configuration objects

## Delivery Notes

- Every pattern lesson should include:
  - the classic textbook form
  - the Pythonic version
  - when the Pythonic version is enough
  - when the full object-oriented pattern still helps

- This course should explicitly teach restraint. Python students should come out better at architecture, not better at unnecessary boilerplate.

## Expansion Ideas

- Add a unit on patterns in Django, FastAPI, or Flask-style backend code.
- Add an appendix on `typing.Protocol`, abstract base classes, and interfaces in modern Python.
- Add a game-development appendix tied to `PyGames`.
- Add a testing appendix showing how good seams and patterns make `pytest` simpler.
