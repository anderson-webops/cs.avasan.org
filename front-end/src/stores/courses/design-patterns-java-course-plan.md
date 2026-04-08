# Design Patterns in Java Course Plan

## Setup and Tooling

Preferred IDEs: `IntelliJ IDEA` or `VS Code`.

Official links:

- [IntelliJ IDEA installation guide](https://www.jetbrains.com/help/idea/installation-guide.html)
- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [VS Code Java guide](https://code.visualstudio.com/docs/java/java-tutorial)

macOS walkthrough:

1. Install a current JDK before opening the IDE.
2. Install IntelliJ IDEA or VS Code.
3. If using VS Code, install the Java extension pack and confirm the JDK is detected.
4. Create a `design-patterns-java` workspace with one folder per module or project.
5. Verify that a simple multi-class Java project runs and that breakpoints work before starting.

Windows walkthrough:

1. Install a current JDK and confirm `java -version` and `javac -version`.
2. Install IntelliJ IDEA or VS Code.
3. If using VS Code, install the Java extension pack.
4. Create a `design-patterns-java` workspace and keep build files in version control from the start.
5. Verify that the IDE, terminal, and debugger all point to the same JDK before beginning.

Course-specific notes:

- Java is the best primary teaching language for this topic because interfaces, abstract classes, packages, and class structure make the patterns easy to see.
- CMake is not needed.
- The course should use a build tool such as Gradle or Maven early enough that multi-file projects feel normal.

## Positioning

This should be the main design-patterns course. Java is explicit enough to make
object collaboration visible, but not so low-level that memory-management
details distract from architecture. If only one full design-patterns course is
built, this should be it.

## Audience and Prerequisites

- Completed `Java Level 1` and ideally `Java Level 2`
- Comfortable with classes, objects, inheritance, interfaces, and collections
- Ready for medium-sized, multi-file projects

## Core Outcomes

- Use interfaces and composition to separate responsibilities cleanly
- Implement major classic design patterns in idiomatic Java
- Refactor brittle object hierarchies into more maintainable collaboration
- Explain when a pattern is appropriate, unnecessary, or harmful
- Build larger Java programs with clearer package and dependency structure

## Recommended Structure

### Unit 1: Design Problems Before Design Patterns

- code smells
- long conditionals
- rigid inheritance
- duplicated creation logic
- too much knowledge in one class

### Unit 2: Java Features That Support Good Design

- interfaces
- abstract classes
- packages
- visibility modifiers
- `final`
- immutability at a practical level

### Unit 3: Strategy and Composition

- replacing branching behavior with swappable objects
- game rules, pricing rules, or movement rules as examples

### Unit 4: Observer and Event-Driven Design

- listener models
- notification flow
- avoiding tight coupling between publisher and consumer

### Unit 5: Factory Method and Abstract Factory

- centralizing creation logic
- product families
- keeping constructors simple

### Unit 6: Builder

- large object creation
- configuration objects
- readable setup for complex state

### Unit 7: Decorator and Facade

- adding behavior without subclass explosions
- simplifying subsystem access

### Unit 8: Adapter and Proxy

- integrating mismatched interfaces
- lazy loading, access control, logging, and indirection

### Unit 9: Command and Undoable Actions

- request objects
- command history
- macro actions
- undo/redo at a beginner-friendly level

### Unit 10: State and Template Method

- state-specific behavior
- moving from conditionals to object states
- fixed algorithm skeletons with selective override points

### Unit 11: Dependency Injection and Testability

- constructor injection
- interfaces for seams
- fakes and mock-friendly architecture
- why DI containers are optional rather than the lesson focus

### Unit 12: Capstone Refactor

- begin with a cluttered Java application
- identify 3 to 5 real design problems
- refactor using a justified subset of patterns
- document why each change improved extensibility or testability

## Example Project Outlines

- Text-based RPG with `Strategy`, `State`, and `Factory`
- Drawing app with `Command`, `Composite`, and `Decorator`
- School notification system with `Observer` and `Facade`
- Order-processing pipeline with `Builder`, `Strategy`, and `Adapter`
- Plugin-ready mini app with `Factory`, `Facade`, and dependency injection

## Delivery Notes

- Every pattern should include:
  - a motivating bad design
  - the refactor target
  - a small implementation
  - a discussion of tradeoffs
  - a "when not to use this" note

- Package structure should be taught intentionally, not left implicit.
- UML-lite diagrams would help here more than in most other courses.

## Expansion Ideas

- Add a Spring-adjacent appendix that shows where these patterns reappear in real Java frameworks.
- Add a testing strand focused on JUnit and refactoring with confidence.
- Add a second capstone based on backend service architecture rather than desktop-style objects.
- Add a comparison appendix that shows how the same Java patterns translate into C++ and Python.
