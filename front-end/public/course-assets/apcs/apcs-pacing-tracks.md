# AP Computer Science A Track Guide

Use this readme to choose a route through AP Computer Science A without losing the Java and AP exam skills that actually matter. The course can move slowly, normally, quickly, or as a challenge track; the track should be chosen from evidence, not from confidence alone.

The track can change during the course. A learner might use the Quick Track for APCS1-4, slow down for classes and polymorphism, use the Challenge Track for collections, and switch to the Exam Track near the AP test.

## How To Use This Guide

1. Check recent evidence: code, traces, debugging habits, and explanations of object state.
2. Choose the lightest track that still protects the AP Java core.
3. Compress repeated beginner material only after the diagnostic evidence is clean.
4. Upgrade projects instead of assigning near-duplicate practice when the base skill is already stable.
5. Re-check the track after every major concept group: syntax, classes, inheritance, collections, algorithms, and exam practice.

## Track Labels At A Glance

| Informal Choice | Course Track    | Best Use Case                                                                                           |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| Slow / Easy     | Supported Track | The learner needs smaller steps, more worked examples, and confidence before independent projects.      |
| Medium          | Standard Track  | The learner is comfortable with programming but still benefits from the normal APCS concept sequence.   |
| Fast / Quick    | Quick Track     | The learner already knows Python, C++, or another language well and only needs Java/AP-specific gaps.   |
| Hard            | Challenge Track | The learner can finish normal APCS work quickly and needs deeper Java builds, tests, and edge cases.    |
| Exam-Focused    | Exam Track      | The AP test is close, or the main goal is timed practice, scoring-guideline use, and weak-topic repair. |

## Fast Placement Decision

Use this quick chooser when a class needs an immediate route decision.

1. Choose **Supported Track** when Java syntax, hand tracing, or debugging is still unstable.
2. Choose **Standard Track** when regular projects are useful but duplicate drills should be reduced.
3. Choose **Quick Track** when Python/C++ knowledge transfers cleanly and Java-specific gaps are narrow.
4. Choose **Challenge Track** when the base project is correct quickly enough that repetition would waste time.
5. Choose **Exam Track** when AP-style timing, scoring language, and weak-topic repair matter more than another full build.

## Course Track Cards

These cards are designed for quick placement. Choose the closest fit, then adjust after the next visible artifact: a runnable program, a hand trace, a written explanation, or an AP-style response.

### Supported / Slow Track

**Use when:** Java syntax, debugging flow, or hand tracing still needs repeated guided practice.

**Default sequence:** APCS1 -> APCS2 -> APCS3 -> APCS4 -> Check-In #1 -> APCS5 -> APCS6, then continue in order.

**Class rhythm:** One concept target, one small project or project slice, one trace or explanation checkpoint.

**Project load:** Complete the core project and assign supplemental practice only for the specific skill that is still weak.

**Advancement rule:** Move on when the learner can explain the code, correct one mistake, and complete a small transfer task without copying the previous example.

### Standard / Medium Track

**Use when:** The learner is comfortable programming but still benefits from the AP CSA order and Java-specific reinforcement.

**Default sequence:** Complete the modules in order, but reduce repeated drill projects when one representative project and one AP-style check already demonstrate mastery.

**Class rhythm:** One representative build, one AP trace or written explanation, and one short correction pass.

**Project load:** One core project per module, plus selected supplemental work for weak areas.

**Advancement rule:** Move on when the learner can name the concept, identify one edge case, and connect the project to the AP skill being tested.

### Quick / Fast Track

**Use when:** The learner already knows Python, C++, or another language well and transfers syntax quickly.

**Default sequence:** Diagnose APCS1-4 quickly, backfill only Java-specific gaps, then spend most time on APCS5-8, APCS10-12, and APCS13-16.

**Class rhythm:** Short diagnostic first, direct jump to the highest-value AP Java concept, then one upgraded project or trace.

**Project load:** Skip near-duplicate beginner projects after the diagnostic is clean; keep arrays, `ArrayList`, recursion, sorting, searching, and FRQ practice.

**Advancement rule:** Move on when the learner can trace object state and collection mutation by hand, not merely when the program runs.

### Challenge / Hard Track

**Use when:** The normal APCS project is correct too quickly and repetition would reduce engagement.

**Default sequence:** Keep the same AP concept sequence, but upgrade each artifact into a more realistic Java build.

**Class rhythm:** Start with the AP concept, add a design constraint, test an edge case, then write a trace or justification.

**Project load:** Fewer duplicate projects; deeper projects with validation, multiple classes, command loops, deterministic tests, or written invariants.

**Advancement rule:** Move on when the learner can defend design choices, handle edge cases, and still satisfy the AP subset and tracing expectations.

### Exam / Score Track

**Use when:** The AP exam is close or the main goal is repairing weak areas under test conditions.

**Default sequence:** Rotate through official FRQs, timed multiple choice, scoring guideline review, and weak-topic repair.

**Class rhythm:** Timed practice, correction notes, targeted mini-lesson, and a second attempt or parallel problem.

**Project load:** Large builds only when they directly repair a weak AP topic; otherwise prioritize official-style questions.

**Advancement rule:** Move on when the missed concept can be named, corrected, and explained in partial-credit-friendly language.

## Placement Checkpoints

Before choosing a track, check these five signals.

1. **Syntax transfer:** Java file names, class names, `main`, semicolons, braces, primitive types, and `String` handling are stable.
2. **Java-specific behavior:** `.equals()` versus `==`, integer division, casting, `Scanner`, `Math.random()`, reference aliases, and wrapper types are understood.
3. **Object modeling:** A small class can be designed with private fields, constructors, useful methods, controlled mutation, and a written invariant.
4. **AP tracing:** Loops, arrays, `ArrayList` mutation, recursion, and polymorphic method calls can be traced by hand without relying on the compiler.
5. **Written reasoning:** The solution can be explained in terms of correctness, edge cases, and AP partial-credit language.

## Quick Chooser

| Track           | Pace   | Best Fit                                                               | Main Strategy                                                                                         | What Not To Skip                                                                                                                  |
| --------------- | ------ | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Supported Track | Slow   | Newer programmers or unstable Java/debugging habits                    | Use check-ins, references, small projects, and one explanation checkpoint before advancing.           | Concept checks, short traces, and targeted practice on weak skills.                                                               |
| Standard Track  | Medium | Solid programming background with a need for a predictable sequence    | Complete one strong project per module and replace duplicate drills with AP-style checks.             | Classes, inheritance, arrays, `ArrayList`, recursion, sorting, searching, and exam practice.                                      |
| Quick Track     | Fast   | Strong Python/C++ background, high independence, quick syntax transfer | Treat APCS1-4 as diagnostics, then focus on Java OOP, collections, algorithms, and FRQs.              | `.equals()` vs `==`, integer division, casting, `Scanner`, AP tracing, constructors, inheritance, recursion, arrays, `ArrayList`. |
| Challenge Track | Hard   | Regular APCS projects are correct too quickly                          | Keep the AP concept but upgrade the artifact with validation, tests, larger designs, and edge cases.  | AP constraints, hand tracing, written explanations, and official FRQ practice.                                                    |
| Exam Track      | Focus  | AP test preparation or score repair                                    | Prioritize official FRQs, multiple-choice tracing, scoring-guideline review, and weak-topic practice. | Timed practice, correction notes, and partial-credit-friendly explanations.                                                       |

## Track Recipes

| Route     | Compress                                                   | Slow Down For                                                         | Project Pattern                                                          | Checkpoint Before Advancing                                                                    |
| --------- | ---------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Supported | Nothing by default. Use the normal sequence.               | APCS1-4 syntax, APCS5-6 classes, APCS10-11 collections.               | One small project plus one explanation checkpoint per module.            | The learner can run, explain, and correct the project without copying the previous example.    |
| Standard  | Duplicate drills and extra near-identical projects.        | Classes, inheritance, arrays, `ArrayList`, recursion, and sorting.    | One representative project per module plus a short FRQ or trace.         | The learner can state the AP concept, one edge case, and one likely scoring detail.            |
| Quick     | Most APCS1-4 repetition after diagnostics.                 | APCS5-8, APCS10-12, APCS13-16.                                        | One strong Java build per major concept area.                            | The learner passes the Java-specific diagnostic and can trace object/collection state by hand. |
| Challenge | Basic repetition once the concept is demonstrated.         | Design quality, invariants, testing, edge cases, and AP explanations. | Upgrade base projects into multi-class builds with validation and tests. | The learner can justify design choices and produce a trace or FRQ-style explanation.           |
| Exam      | Large new builds unless they directly repair a weak topic. | FRQs, multiple choice, scoring guidelines, timing, and corrections.   | Timed official practice followed by targeted repair.                     | Missed work can be revised using scoring language and the missed concept can be named.         |

## Module Decisions By Track

"Diagnostic" means a short prompt, trace, or compact project proves the skill before deciding whether to backfill.

| Segment                          | Supported                                                    | Standard                                     | Quick                                                         | Challenge                                                               | Exam                                                 |
| -------------------------------- | ------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| General setup                    | Use the setup checklist slowly and verify compile-run steps. | Verify Java and repo workflow.               | Confirm Java setup, then move on.                             | Add terminal compile-run fluency and troubleshoot one deliberate error. | Confirm setup only if it affects timed practice.     |
| APCS1 Variables/Input            | Full module plus reference projects.                         | One main project plus expression tracing.    | Diagnostic only unless Java syntax fails.                     | Add input validation and clearer output formatting.                     | Use only expression and casting questions.           |
| APCS2 Operators                  | Full module with boolean practice.                           | One boolean/arithmetic project.              | Diagnostic for integer division, casting, and booleans.       | Add edge-case tests and write expected outputs before running.          | Multiple choice on expressions and operators.        |
| APCS3 Conditionals               | Full conditionals module.                                    | One threshold or branching project.          | Diagnostic for `.equals()`, `if`/`else`, and packages.        | Add nested conditions, validation, and branch coverage.                 | Trace conditionals and justify branch outcomes.      |
| APCS4 Loops                      | Full loops module.                                           | One loop translation or nested-loop project. | Diagnostic for counted loops, while loops, and nested traces. | Add menu loops or robust input loops.                                   | Trace loops and count iterations.                    |
| APCS5-6 Classes                  | Slow down and build confidence.                              | Required core.                               | Required core.                                                | Upgrade to a multi-class CLI model.                                     | Practice class-writing FRQ parts.                    |
| APCS7-8 Inheritance/Polymorphism | Use diagrams and declared/actual type traces.                | Required core.                               | Required core.                                                | Build a small polymorphic simulation.                                   | Trace dynamic dispatch and overriding.               |
| APCS9 Specs                      | Translate requirements into test cases.                      | One robust-input or spec project.            | Short spec-reading checkpoint.                                | Add acceptance criteria and manual tests.                               | Use requirements language in FRQ explanations.       |
| APCS10 Arrays                    | Full traversal and mutation practice.                        | Required core.                               | Required core.                                                | Add helper methods and edge-case arrays.                                | Trace array loops and 2D indexing.                   |
| APCS11 ArrayLists                | Full insertion/removal practice.                             | Required core.                               | Required core.                                                | Build object collections with safe mutation.                            | Trace list mutation and index shifts.                |
| APCS12 Wrappers                  | Separate primitives, wrappers, and references carefully.     | One deck/card model.                         | Required if wrapper behavior is weak.                         | Extend card/deck design with comparison helpers.                        | Review wrapper and collection questions.             |
| APCS13 Runtime/Search            | Trace first, then implement.                                 | Required core.                               | Required core.                                                | Add runtime comparisons and written complexity notes.                   | Multiple choice on runtime and search.               |
| APCS14 Sorting                   | Trace selection and insertion sort before coding.            | Required core.                               | Required core.                                                | Add instrumentation and compare passes.                                 | Trace sorting states by pass.                        |
| APCS15 Recursion                 | Use stack-frame diagrams before code.                        | Required core.                               | Required core.                                                | Add grid or tree recursion variants.                                    | FRQ-style recursion tracing.                         |
| APCS16 Binary Search/Merge Sort  | Trace halving and merge steps before coding.                 | Required core.                               | Required core.                                                | Add precondition checks and complexity notes.                           | Timed algorithm traces.                              |
| APCS17 Capstone/Test Prep        | One smaller capstone plus guided FRQs.                       | Capstone plus exam practice.                 | One capstone or official FRQ cycle.                           | Capstone with written design notes and edge cases.                      | Official FRQs, scoring guidelines, and timed review. |

## Quick Route For A Strong Python/C++ Learner

This route fits a learner who already knows Python well, has C++ experience, and learns syntax quickly.

1. Use APCS1-4 as diagnostics rather than a slow beginner sequence.
2. Backfill only Java-specific misses: `.equals()` versus `==`, integer division, casting, `Scanner`, `Math.random()`, `String` methods, file/class naming, and compile-run workflow.
3. Move into **APCS5/APCS6** as soon as syntax is stable because Java object modeling is the first major AP-specific skill.
4. Use APCS7/APCS8 to make inheritance and polymorphism precise, especially declared type versus actual object type.
5. Use APCS10-12 for collection mutation and AP-style tracing; do not skip arrays just because Python lists or C++ vectors are familiar.
6. Use APCS13-16 as the high-value advanced stretch: runtime, linear search, binary search, selection sort, insertion sort, merge sort, and recursion.
7. Use APCS17 for capstone work only after the algorithm and object-modeling pieces can be explained without the compiler.

## Today-Ready Recommendation

For an advanced learner who recently covered Java setup, booleans, `Boolean`, `System.out` versus `System.err`, C++ arrays/vectors, signed and unsigned integer behavior, dynamic arrays, and build troubleshooting, the next APCS lesson should not repeat APCS1-4 slowly.

Recommended next session:

1. Spend 10-15 minutes on integer division, casting, `.equals()` versus `==`, boolean chains, `Scanner`, and one loop trace.
2. If the diagnostic is clean, move directly into **APCS5/APCS6** class design with `Bank Account`, `Vending Machine`, or a custom `Gradebook CLI`.
3. Include private fields, constructors, validation rules, instance methods, a small menu loop, and at least three manual test cases.
4. Add one AP-style written explanation: object state before and after two method calls, one invariant, and one edge case.
5. Use the following session for inheritance/polymorphism if the object model is stable, or arrays/`ArrayList` if references and mutation need more practice.

Suggested hard version:

1. Build a `Gradebook` with `Student`, `Assignment`, and `Gradebook` classes.
2. Store collections in arrays first, then refactor to `ArrayList`.
3. Add methods for adding grades, dropping the lowest grade, calculating averages, and printing a ranked report.
4. Write a short trace showing how one method mutates object state.
5. Label which parts are AP CSA core and which parts are extra Java engineering practice.

## Track Details

### Supported Track

Use when the course needs slower pacing or more confidence.

1. Keep check-ins because they reveal gaps before long projects.
2. Use reference projects before longer assignments.
3. Keep each class focused on one concept target and one visible artifact.
4. Prefer short corrections over several new topics at once.
5. Add supplemental projects only when they target a specific gap.

### Standard Track

Use when the normal course sequence is appropriate but duplicate work should be reduced.

1. Complete one representative project per module.
2. Replace duplicate projects with one FRQ-style trace or multiple-choice set.
3. Keep check-ins as quick skill audits rather than long formal assessments.
4. Use Barron's questions after the matching topic.
5. End each module with a short explanation of the concept, one edge case, and one likely AP scoring detail.

### Quick Track

Use when the learner has strong prior programming background.

Diagnostic for APCS1-4:

1. Predict Java expression output involving integer division, casts, and operator precedence.
2. Write a small `Scanner` program that reads a `String`, an `int`, and a `double`.
3. Explain when to use `==` and when to use `.equals()`.
4. Write one counted loop, one conditional loop, and one nested-loop trace.
5. Explain one compile-time error and one runtime behavior.

### Challenge Track

Use when the APCS idea is correct but the normal project is too easy.

Upgrade the artifact while keeping the AP concept:

1. Add input validation and clear error handling.
2. Add a second or third model class instead of writing everything in `Main`.
3. Add a menu loop or command parser.
4. Add deterministic manual tests or a lightweight test harness.
5. Add file input/output only after the AP concept is stable.
6. Include one written trace of an edge case.
7. End with one AP-style explanation or FRQ-style response.

### Exam Track

Use near the AP exam or whenever score preparation is the main goal.

1. One timed multiple-choice or focused tracing set.
2. One official FRQ or FRQ part.
3. One correction pass using scoring guidelines.
4. One weak-topic repair mini lesson.
5. One written explanation without compiler feedback.

## Advanced Java Extensions

AP CSA has a deliberately limited Java subset. Advanced learners can still benefit from extension work after the AP core is stable.

1. **Generics, interfaces, records:** Useful for modern Java design after classes, inheritance, and `ArrayList` are reliable.
2. **Unit tests:** A lightweight unit-test or manual test harness can replace repetitive worksheets for advanced learners.
3. **File input/output:** Useful for larger projects, but not necessary for the AP exam.
4. **Build tools:** Gradle, Maven, or deeper VS Code configuration can help with larger Java projects, but should not block AP-topic progress.
5. **Collections beyond `ArrayList`:** `HashMap`, `HashSet`, `Queue`, and `Stack` are useful later, but AP practice should stay centered on arrays and `ArrayList`.

## Non-Negotiable AP Java Skills

Every track should check these skills.

1. **Java expressions:** integer division, casting, operator precedence, boolean logic, `Math.random()`, and assignment side effects.
2. **Strings:** indexing, substrings, immutability, concatenation, `.equals()` versus `==`, and common tracing questions.
3. **Classes and objects:** fields, constructors, `this`, access modifiers, methods, static members, object references, and aliases.
4. **Inheritance and polymorphism:** `extends`, `super`, overriding, declared type versus actual object type, and dynamic method dispatch.
5. **Arrays and `ArrayList`:** traversal, mutation, insertion, removal, wrapper types, two-dimensional arrays, and off-by-one control.
6. **Algorithms:** linear search, binary search, selection sort, insertion sort, merge sort, recursion, and runtime language.
7. **AP written reasoning:** trace code without running it, explain object state, use scoring-guideline language, and write partial-credit-friendly responses.

## Project Upgrade Menu

| Need                     | Base Project                                 | Upgrade                                                                     |
| ------------------------ | -------------------------------------------- | --------------------------------------------------------------------------- |
| Java object state        | `Vending Machine Class` or `Bank Account`    | Private fields, constructor validation, edge-case tests, written invariant. |
| Stronger class design    | Custom `Gradebook CLI`                       | Multiple objects, averages, invalid input handling, and a menu loop.        |
| Inheritance and dispatch | `Book/PictureBook` or `Many Shapes`          | Trace declared type versus actual method dispatch.                          |
| Collection mutation      | `Card Shuffler` or `Suits, Decks, and Hands` | Safe removal, deterministic tests, and object-reference tracing.            |
| Recursion                | `Blob Erase`                                 | Stack-frame trace and base-case explanation.                                |
| Algorithms               | `Binary Search` and `Merge Sort`             | Preconditions, pass-by-pass trace, and runtime comparison.                  |
| Capstone                 | `Elevens`, `Spaceships`, or `Decode`         | Written design notes, edge cases, and one FRQ-style explanation.            |
