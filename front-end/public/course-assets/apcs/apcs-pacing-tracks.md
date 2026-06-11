# AP Computer Science A Track Guide

Use this guide to choose how quickly to move through AP Computer Science A. The goal is to preserve the AP Java essentials while avoiding low-value repetition for learners who already know Python, C++, or another programming language well.

The course can be taken at different speeds. A faster track should still verify Java-specific details, AP-style tracing, object-oriented design, arrays, `ArrayList`, recursion, searching, sorting, and written explanation.

## How To Use This Guide

Use this as a placement readme before choosing the next APCS module. Start by identifying the learner's current evidence, not just their confidence: recent code, hand tracing, Java-specific mistakes, and how independently they can explain object state. Then choose the track that preserves AP requirements while avoiding unnecessary repetition.

The track can change during the course. A learner might use the Quick Track for APCS1-4, the Challenge Track for classes and collections, and the Exam Track near the AP test. The only rule is that compression should be earned with evidence: working code, correct traces, and clear explanations.

## Placement Checkpoints

Before assigning a track, check these five signals:

1. **Syntax transfer:** The learner can translate known Python/C++ ideas into Java without confusing Java file names, class names, `main`, semicolons, braces, primitive types, or `String` handling.
2. **Java-specific behavior:** The learner can explain `.equals()` versus `==`, integer division, casting, `Scanner` input, `Math.random()`, reference aliases, and wrapper types.
3. **Object modeling:** The learner can design a small class with private fields, constructors, useful methods, controlled mutation, and a written invariant.
4. **AP tracing:** The learner can trace code by hand without relying on the compiler, especially loops, arrays, `ArrayList` mutation, recursion, and polymorphic method calls.
5. **Written reasoning:** The learner can explain why a solution works, where it can fail, and how an AP scorer would award partial credit.

## Quick Chooser

| Track           | Pace    | Best Fit                                                                      | What To Do                                                                                              | What Not To Skip                                                                                                                 |
| --------------- | ------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Quick Track     | Fast    | Strong Python/C++ background, high independence, quick syntax transfer        | Treat APCS1-4 as diagnostics, then focus on Java OOP, collections, algorithms, and FRQs                 | `.equals()` vs `==`, integer division, casting, `Scanner`, AP tracing, constructors, inheritance, recursion, arrays, `ArrayList` |
| Standard Track  | Medium  | Solid learner who benefits from a predictable course sequence                 | Complete one strong project per module and replace duplicate drills with AP-style checks                | The main Java object model, arrays/ArrayLists, algorithm modules, and exam practice                                              |
| Supported Track | Slow    | Learner needs more repetition, confidence, syntax stability, or smaller steps | Use check-ins, references, one small project, and one explanation checkpoint before moving on           | Concept checks, short traces, and targeted practice on weak skills                                                               |
| Challenge Track | Hard    | Learner completes regular APCS work too quickly                               | Keep the AP concept but upgrade projects into larger Java builds with tests, validation, and edge cases | AP constraints, hand tracing, written explanations, and official FRQ practice                                                    |
| Exam Track      | Focused | Learner is close to the AP exam or needs score preparation                    | Prioritize official FRQs, multiple-choice tracing, scoring-guideline review, and weak-topic repair      | Timed practice, correction notes, and partial-credit-friendly explanations                                                       |

## Non-Negotiable AP Java Skills

Every track should check these skills:

1. **Java expressions:** integer division, casting, operator precedence, boolean logic, `Math.random()`, and assignment side effects.
2. **Strings:** indexing, substrings, immutability, concatenation, `.equals()` versus `==`, and common tracing questions.
3. **Classes and objects:** fields, constructors, `this`, access modifiers, methods, static members, object references, and aliases.
4. **Inheritance and polymorphism:** `extends`, `super`, overriding, declared type versus actual object type, and dynamic method dispatch.
5. **Arrays and `ArrayList`:** traversal, mutation, insertion, removal, wrapper types, two-dimensional arrays, and off-by-one control.
6. **Algorithms:** linear search, binary search, selection sort, insertion sort, merge sort, recursion, and runtime language.
7. **AP written reasoning:** trace code without running it, explain object state, use scoring-guideline language, and write partial-credit-friendly responses.

## Module Route Map

| Course Segment                                       | Quick Track                                   | Standard Track                                                   | Supported Track                                        | Challenge Track                                                  |
| ---------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------- |
| General setup                                        | Confirm Java tooling and repo workflow        | Complete setup and reference review                              | Complete setup slowly with a compile-run checklist     | Add command-line compile/run fluency and editor troubleshooting  |
| APCS1-4: syntax, I/O, operators, conditionals, loops | Diagnostic only; backfill failed Java details | One core project per module                                      | Check-in prompts plus targeted practice                | Add validation, input loops, and edge-case tests                 |
| APCS5-6: classes and methods                         | Required; move carefully                      | Complete core class projects                                     | Use smaller method/class drills before larger projects | Upgrade to a multi-class CLI model                               |
| APCS7-8: inheritance and polymorphism                | Required; one strong model each               | Complete inheritance and polymorphism projects                   | Add diagrams and trace declared/actual type examples   | Build a small simulation with overridden behavior                |
| APCS9: specs and lifecycle                           | Short requirements-reading checkpoint         | Complete one spec or robust-input project                        | Practice translating requirements into cases           | Add tests and explicit acceptance criteria                       |
| APCS10-12: arrays, `ArrayList`, wrappers             | Required; focus on mutation/tracing           | One arrays project, one `ArrayList` project, one card/deck model | Use reference packs and small traces first             | Build a deck/game engine with mutation edge cases                |
| APCS13-16: runtime, search, sort, recursion          | Required; high value for advanced learners    | Complete core algorithm projects                                 | Trace before implementing each algorithm               | Add benchmarking, invariants, and written complexity comparisons |
| APCS17: capstone and test prep                       | One capstone plus official FRQs               | Alternate project work with exam practice                        | Use smaller FRQ parts and correction passes            | Build a capstone with AP-style writeups and edge-case traces     |

## Quick Track

Use this route when the learner already understands variables, loops, conditionals, functions/methods, lists/arrays, and basic debugging from Python or C++.

### APCS1-4 Diagnostic

Before skipping beginner repetition, run a short diagnostic:

1. Predict Java expression output involving integer division, casts, and operator precedence.
2. Write a small `Scanner` program that reads a `String`, an `int`, and a `double`.
3. Explain when to use `==` and when to use `.equals()`.
4. Write one counted loop, one conditional loop, and one nested-loop trace.
5. Explain one compile-time error and one runtime behavior.

Backfill only failed items. Good fast-backfill projects are `Quotient and Remainder`, `Verifying Expressions`, `Elevator Warning`, `Translating Loops`, and `Too Chicken`.

### Required Quick-Track Core

Do not skip these:

1. **APCS5-6:** classes, constructors, fields, access control, methods, static versus instance data, and object state.
2. **APCS7-8:** inheritance, `super`, overriding, polymorphism, and declared type versus actual object type.
3. **APCS10-12:** arrays, two-dimensional arrays, `ArrayList`, wrappers, and mutation.
4. **APCS13-16:** runtime, searching, sorting, recursion, binary search, and merge sort.
5. **APCS17:** at least one capstone or official FRQ cycle.

### Quick-Track Project Choices

| Need                     | Best Project Choice                             | Why                                                                 |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------------------- |
| Java object state        | `Vending Machine Class` or `Bank Account Class` | Clear constructors, fields, controlled mutation, and edge cases     |
| Inheritance and dispatch | `Book and PictureBook Class` or `Many Shapes`   | Forces `extends`, overriding, `super`, and polymorphic calls        |
| Collections              | `Card Shuffler` or `Suits, Decks, and Hands`    | Good AP practice for `ArrayList`, wrappers, and object collections  |
| Recursion                | `Blob Erase`                                    | Strong recursive grid traversal with base cases and backtracking    |
| Algorithms               | `Binary Search` and `Merge Sort`                | High AP value and useful for advanced-programming transfer          |
| Capstone                 | `Elevens`                                       | Best match for AP object/list modeling and official-style reasoning |

## Standard Track

Use this route when the course pace is mostly right but repetition should be controlled.

1. Complete one representative project per module.
2. Replace duplicate projects with one FRQ-style trace or multiple-choice set.
3. Keep check-ins as quick skill audits rather than long formal assessments.
4. Use Barron's questions after the matching topic, not as disconnected exam prep.
5. End each module with a short explanation: what the code does, what edge case matters, and what AP concept it practices.

Recommended rhythm:

1. New concept or Java rule.
2. One worked example.
3. One project or focused exercise.
4. One trace or explanation checkpoint.
5. One homework item that either finishes the project or repairs the weakest concept.

## Supported Track

Use this route when the learner needs slower pacing or more confidence.

1. Keep the module check-ins because they reveal gaps without requiring a long project first.
2. Use reference projects before longer assignments.
3. Keep each class focused on one concept target and one visible artifact.
4. Prefer short corrections over adding several new topics at once.
5. Add supplemental projects only when they target a specific gap.

Good support pairings:

| Course Area | Support Tool                                                         |
| ----------- | -------------------------------------------------------------------- |
| APCS1-4     | Check-In #1 plus one syntax backfill project                         |
| APCS5-8     | Check-In #2 and Check-In #3 with diagrams and object traces          |
| APCS10-12   | Array and `ArrayList` reference packs before full card/deck projects |
| APCS13-16   | Hand traces before full implementations                              |
| APCS17      | Short FRQ parts before full timed FRQs                               |

## Challenge Track

Use this route when the APCS idea is correct but the normal project is too easy.

Upgrade the artifact while keeping the AP concept:

1. Add input validation and clear error handling.
2. Add a second or third model class instead of writing everything in `Main`.
3. Add a menu loop or command parser.
4. Add deterministic manual tests or a lightweight test harness.
5. Add file input/output only after the AP concept is stable.
6. Require one written trace of an edge case.
7. End with one AP-style explanation or FRQ-style response.

Challenge upgrade examples:

| AP Concept                   | Upgrade                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Classes and constructors     | Gradebook service with students, assignments, weighted averages, and validation        |
| Inheritance and polymorphism | Shape, pet, or game-entity simulator with overridden behavior                          |
| Arrays and `ArrayList`       | Card/deck engine with shuffling, dealing, searching, and safe removal                  |
| Recursion                    | Flood-fill, maze search, or word-search solver                                         |
| Searching and sorting        | Benchmark linear search, binary search, selection sort, insertion sort, and merge sort |
| Capstone                     | Event-driven simulation using objects, collections, and deterministic reporting        |

## Exam Track

Use this route near the AP exam or when AP score preparation is the main goal.

Weekly rhythm:

1. One timed multiple-choice or focused tracing set.
2. One official FRQ or FRQ part.
3. One correction pass using scoring guidelines.
4. One weak-topic repair mini lesson.
5. One written explanation without compiler feedback.

High-priority FRQ skills:

1. Write class methods that preserve object invariants.
2. Traverse and mutate arrays and `ArrayList`s.
3. Handle two-dimensional array indexing without off-by-one errors.
4. Trace inheritance and polymorphism from declared and actual types.
5. Explain recursive base cases and progress toward the base case.
6. State preconditions for binary search and merge steps.

## Skip, Backfill, or Upgrade

Use these rules when deciding whether a module should be compressed.

| If This Is True                                              | Action                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| The learner can solve it in another language but not in Java | Backfill Java syntax only                                                       |
| The learner can write the code but cannot trace it by hand   | Do AP tracing before moving on                                                  |
| The learner can trace it but cannot explain object state     | Add an explanation checkpoint                                                   |
| The learner finishes the base project quickly and correctly  | Upgrade the project instead of assigning a near-duplicate                       |
| The learner misses Java-specific behavior                    | Stop and repair; do not treat general programming fluency as enough             |
| The AP exam is soon                                          | Replace large builds with FRQs, scoring-guideline review, and weak-topic repair |

## Today-Ready Recommendation for a Strong Python/C++ Learner

If Java setup, booleans, `System.out`, `System.err`, and basic operators have already been covered, use the next lesson to jump into Java object modeling.

Best next path:

1. Start with APCS5/APCS6 object modeling rather than more syntax repetition.
2. Choose `Vending Machine Class`, `Bank Account Class`, or a custom `Gradebook CLI`.
3. Require constructors, private fields, accessors/mutators only where useful, validation, and clear object-state changes.
4. Add at least three manual tests or edge cases.
5. End with a short trace explaining how one method call changes object state.

If the project is too easy, immediately add one of these upgrades:

1. Store multiple objects in an array or `ArrayList`.
2. Add a menu loop with robust input handling.
3. Split responsibilities into two classes.
4. Add a written invariant for each mutable class.
5. Add one AP-style FRQ prompt about the object model.

## Suggested Course Continuation After APCS

After the AP essentials are stable, the strongest continuation is advanced Java rather than repeating beginner material:

1. Packages, testing boundaries, and command parser test harnesses.
2. Generics, interfaces, records, comparators, and collection API design.
3. Streams, files, and data pipelines.
4. Concurrency, services, and capstone architecture.
