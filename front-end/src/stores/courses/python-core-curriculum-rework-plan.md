# Python Core Curriculum Rework Plan

## Setup and Tooling

Preferred IDEs: `PyCharm` or `VS Code`. PyCharm is ideal for students who want
strong Python-specific guidance; VS Code is the lighter and more transferable
option.

Official links:

- [VS Code download](https://code.visualstudio.com/Download)
- [VS Code on macOS](https://code.visualstudio.com/docs/setup/mac)
- [VS Code on Windows](https://code.visualstudio.com/docs/setup/windows)
- [PyCharm installation guide](https://www.jetbrains.com/help/pycharm/installation-guide.html)
- [VS Code Python guide](https://code.visualstudio.com/docs/languages/python)
- [Python downloads](https://www.python.org/downloads/?m=landing)

macOS walkthrough:

1. Install Python 3.
2. Install either PyCharm or VS Code.
3. If using VS Code, add `Python`, `Pylance`, and `Jupyter` for later modules.
4. Create a dedicated course folder for `python-1`, `python-2`, and `python-3` projects so files stay organized across the curriculum.
5. Verify the interpreter, terminal, and run button all point to the same Python installation before starting.

Windows walkthrough:

1. Install Python 3 and enable the PATH option during setup.
2. Install either PyCharm or VS Code.
3. If using VS Code, add `Python`, `Pylance`, and `Jupyter`.
4. Confirm that `python --version` works in a terminal and that the editor is using that interpreter.
5. Teach students how to find their project folders in File Explorer early so file organization does not become a blocker.

Course-specific notes:

- No CMake setup is needed.
- The course should include a dedicated early lesson on interpreters, terminals, file paths, and reading tracebacks, since setup confusion disproportionately affects beginners.

## Positioning

The core Python sequence is the highest-priority curriculum line. It has to be
accessible for new students, deep enough for returning students, and better
sequenced around object-oriented programming.

## Main Priorities

- Make the entry ramp smoother for beginners
- Add more explicit debugging and problem-solving routines
- Make classes and object-oriented thinking an explicit required part of the
  sequence, not an optional aside
- Rework where OOP appears
- Strengthen the bridge from Python 2 into Python 3 and onward

## Suggested Sequence Changes

### Python Level 1

- keep it beginner-accessible
- add more visual debugging
- add more input/output and small text-game projects
- make variable, loop, and function patterns more repetitive and structured

### Python Level 2

- keep collections, functions, problem solving, and projects
- include a required classes unit before the course ends
- teach how to design and instantiate classes, store object state, and write
  methods that collaborate with lists and dictionaries
- place OOP before heavy algorithm work so Python 3 can assume design fluency,
  not just syntax fluency

### Python Level 3

- assume stronger fluency with classes, methods, object state, and composition
- focus more on algorithms, data structures, complexity, and larger programs

## Recommended OOP Plan

Required direction:

- Add a late-`Python 2` unit or dedicated `Python 2.5` bridge focused on:
  - class definitions and naming conventions
  - instances and object identity
  - attributes versus local variables
  - instance methods and `self`
  - constructors with `__init__`
  - object state updates across multiple method calls
  - composition
  - simple inheritance where it clarifies reuse rather than adding ceremony

Why:

- It makes later algorithm and project work less abrupt
- It reduces the jump into AI/ML or software-design-heavy electives
- It keeps Python 3 from carrying too many first-time abstractions

Minimum expectation before a student completes Python 2:

- They should be able to read and write a small class from scratch
- They should understand the difference between a function and a method
- They should be able to create multiple objects and reason about each object's
  state independently
- They should be able to use classes inside a medium-sized project instead of
  only writing top-level procedural code

Python 3 should then build on classes rather than introducing them for the
first time. That means larger projects in Python 3 should deliberately use:

- interacting classes
- composition
- cleaner interfaces between modules
- selected uses of inheritance only when it is actually the right fit

## Accessibility Improvements

- Add "starter", "guided", and "stretch" versions of major projects
- Add more small check-in exercises before each large build
- Add debugging lessons that explicitly teach tracing and decomposition
- Add more videos and gifs where current modules feel text-heavy

## Example Project Additions

- Python 1: password checker, mini quiz, story generator, menu-driven apps
- Python 2: object-based pet simulator, inventory tracker, class roster manager,
  turn-based battle simulator
- Python 3: pathfinding toy, scheduler, parser, data structure visualizer,
  multi-class simulation or management system

## Expansion Ideas

- Add a formal bridge from Scratch to Python
- Add a typed-Python appendix with `dataclasses` and type hints
- Add testing basics with `pytest`
- Add Git and project-organization lessons for later Python students
