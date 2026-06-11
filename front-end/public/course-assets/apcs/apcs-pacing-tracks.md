# AP Computer Science A Track Guide

Use this guide to choose how quickly to move through AP Computer Science A. The goal is to preserve the AP Java essentials while avoiding low-value repetition for learners who already know Python, C++, or another programming language well.

The course can be taken at different speeds. A faster track should still verify Java-specific details, AP-style tracing, object-oriented design, arrays, `ArrayList`, recursion, searching, sorting, and written explanation.

## How To Use This Guide

Use this as a placement readme before choosing the next APCS module. Start by identifying the learner's current evidence, not just their confidence: recent code, hand tracing, Java-specific mistakes, and how independently they can explain object state. Then choose the track that preserves AP requirements while avoiding unnecessary repetition.

The track can change during the course. A learner might use the Quick Track for APCS1-4, the Challenge Track for classes and collections, and the Exam Track near the AP test. The only rule is that compression should be earned with evidence: working code, correct traces, and clear explanations.

## Track Labels At A Glance

The names below map the informal pacing choices to concrete APCS routes:

| Informal Choice | Course Track    | Best Use Case                                                                                           |
| --------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| Slow / Easy     | Supported Track | The learner needs smaller steps, more worked examples, and confidence before independent projects.      |
| Medium          | Standard Track  | The learner is comfortable with programming but still benefits from the normal APCS concept sequence.   |
| Fast / Quick    | Quick Track     | The learner already knows Python, C++, or another language well and only needs Java/AP-specific gaps.   |
| Hard            | Challenge Track | The learner can finish normal APCS work quickly and needs deeper Java builds, tests, and edge cases.    |
| Exam-Focused    | Exam Track      | The AP test is close, or the main goal is score preparation, timed practice, and scoring-guideline use. |

Choosing a track does not permanently lock the course. A strong learner can move quickly through syntax review, slow down for object modeling, switch into challenge projects for collections, and later use the exam track for timed FRQ work.

## Fast Placement Decision

Use these rules when a class needs a quick route decision:

1. Choose **Supported Track** when Java syntax, hand tracing, or basic debugging is still unstable.
2. Choose **Standard Track** when the learner can complete regular projects but still benefits from a predictable sequence.
3. Choose **Quick Track** when Python/C++ knowledge transfers cleanly and Java-specific gaps are narrow.
4. Choose **Challenge Track** when the base project is correct quickly enough that repetition would waste time.
5. Choose **Exam Track** when AP-style timing, scoring language, and weak-topic repair matter more than another full build.

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

## Track Recipes

Use these recipes as the practical version of the guide. Each route names the modules to slow down for, the modules that can be compressed, and the project style that best matches the track.

| Route     | Best For                                                     | Compress                                                  | Slow Down For                                                        | Project Pattern                                                         | Checkpoint Before Advancing                                                                   |
| --------- | ------------------------------------------------------------ | --------------------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Supported | Newer programmers or learners who need confidence            | None by default; use the normal sequence                  | APCS1-4 syntax, APCS5-6 classes, APCS10-11 collections               | One small project plus one explanation checkpoint per module            | The learner can run, explain, and correct the project without copying the previous example    |
| Standard  | Learners with some programming background                    | Duplicate drills and extra near-identical projects        | Classes, inheritance, arrays, ArrayLists, recursion, and sorting     | One representative project per module plus a short FRQ or trace         | The learner can state the AP concept, one edge case, and one likely scoring detail            |
| Quick     | Strong Python/C++ learners who only need Java and AP details | Most APCS1-4 repetition after diagnostics                 | APCS5-8, APCS10-12, APCS13-16                                        | One strong Java build per major concept area                            | The learner passes the Java-specific diagnostic and can trace object/collection state by hand |
| Challenge | Learners who finish standard projects too quickly            | Basic repetition once the concept is demonstrated         | Design quality, invariants, testing, edge cases, and AP explanations | Upgrade base projects into multi-class builds with validation and tests | The learner can justify design choices and produce a trace or FRQ-style explanation           |
| Exam      | Learners near the AP test or preparing for timed scoring     | Large new builds unless they directly repair a weak topic | FRQs, multiple choice, scoring guidelines, timing, and corrections   | Timed official practice followed by targeted repair                     | The learner can revise missed work using scoring-language and identify the missed concept     |

## Module Decisions By Track

This table gives a direct route through the existing APCS modules. "Diagnostic" means use a short prompt, trace, or one compact project to prove the skill before deciding whether to backfill.

| Segment                          | Supported                                                    | Standard                                    | Quick                                                        | Challenge                                                              | Exam                                                |
| -------------------------------- | ------------------------------------------------------------ | ------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- | --------------------------------------------------- |
| General setup                    | Use the setup checklist slowly and verify compile-run steps  | Verify Java and repo workflow               | Confirm Java setup, then move on                             | Add terminal compile-run fluency and troubleshoot one deliberate error | Confirm setup only if it affects timed practice     |
| APCS1 Variables/Input            | Full module plus reference projects                          | One main project plus expression tracing    | Diagnostic only unless Java syntax fails                     | Add input validation and clearer output formatting                     | Use only expression and casting questions           |
| APCS2 Operators                  | Full module with boolean practice                            | One boolean/arithmetic project              | Diagnostic for integer division, casting, and booleans       | Add edge-case tests and write expected outputs before running          | Multiple choice on expressions and operators        |
| APCS3 Conditionals               | Full conditionals module                                     | One threshold or branching project          | Diagnostic for `.equals()`, `if`/`else`, and packages        | Add nested conditions, validation, and branch coverage                 | Trace conditionals and justify branch outcomes      |
| APCS4 Loops                      | Full loops module                                            | One loop translation or nested-loop project | Diagnostic for counted loops, while loops, and nested traces | Add menu loops or robust input loops                                   | Trace loops and count iterations                    |
| APCS5-6 Classes                  | Slow down and build confidence                               | Required core                               | Required core                                                | Upgrade to a multi-class CLI model                                     | Practice class-writing FRQ parts                    |
| APCS7-8 Inheritance/Polymorphism | Use diagrams and declared/actual type traces                 | Required core                               | Required core                                                | Build a small polymorphic simulation                                   | Trace dynamic dispatch and overriding               |
| APCS9 Specs                      | Translate requirements into test cases                       | One robust-input or spec project            | Short spec-reading checkpoint                                | Add acceptance criteria and manual tests                               | Use requirements language in FRQ explanations       |
| APCS10 Arrays                    | Full traversal and mutation practice                         | Required core                               | Required core                                                | Add helper methods and edge-case arrays                                | Trace array loops and 2D indexing                   |
| APCS11 ArrayLists                | Full insertion/removal practice                              | Required core                               | Required core                                                | Build object collections with safe mutation                            | Trace list mutation and index shifts                |
| APCS12 Wrappers                  | Slow enough to separate primitives, wrappers, and references | One deck/card model                         | Required if wrapper behavior is weak                         | Extend card/deck design with comparison helpers                        | Review wrapper and collection questions             |
| APCS13 Runtime/Search            | Trace first, then implement                                  | Required core                               | Required core                                                | Add runtime comparisons and written complexity notes                   | Multiple choice on runtime and search               |
| APCS14 Sorting                   | Trace selection and insertion sort before coding             | Required core                               | Required core                                                | Add instrumentation and compare passes                                 | Trace sorting states by pass                        |
| APCS15 Recursion                 | Use stack-frame diagrams before code                         | Required core                               | Required core                                                | Add grid or tree recursion variants                                    | FRQ-style recursion tracing                         |
| APCS16 Binary Search/Merge Sort  | Trace halving and merge steps before coding                  | Required core                               | Required core                                                | Add precondition checks and complexity notes                           | Timed algorithm traces                              |
| APCS17 Capstone/Test Prep        | One smaller capstone plus guided FRQs                        | Capstone plus exam practice                 | One capstone or official FRQ cycle                           | Capstone with written design notes and edge cases                      | Official FRQs, scoring guidelines, and timed review |

## Quick Route For A Strong Python/C++ Learner

This is the most useful route when a learner already knows Python well, has C++ experience, and can learn syntax quickly.

1. Use APCS1-4 as diagnostics rather than a full slow sequence.
2. Backfill only Java-specific misses: `.equals()` versus `==`, integer division, casting, `Scanner`, `Math.random()`, `String` methods, file/class naming, and compile-run workflow.
3. Move into APCS5/APCS6 as soon as syntax is stable because Java object modeling is the first major AP-specific skill.
4. Use APCS7/APCS8 to make inheritance and polymorphism precise, especially declared type versus actual object type.
5. Use APCS10-12 for collection mutation and AP-style tracing; do not skip arrays just because Python lists or C++ vectors are familiar.
6. Use APCS13-16 as the high-value advanced stretch: runtime, linear search, binary search, selection sort, insertion sort, merge sort, and recursion.
7. Use APCS17 for capstone work only after the algorithm and object-modeling pieces can be explained without the compiler.

Good next-project choices for this route:

| Next Need                       | Project                                     | Add This Challenge                                                               |
| ------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------------- |
| First serious Java object model | Vending Machine Class or Bank Account Class | Private fields, constructor validation, edge-case tests, and a written invariant |
| Stronger class design           | Custom Gradebook CLI                        | Multiple objects, average calculations, invalid input handling, and a menu loop  |
| Inheritance and polymorphism    | Book/PictureBook or Many Shapes             | Trace declared type versus actual method dispatch                                |
| Collection mutation             | Card Shuffler or Suits, Decks, and Hands    | Safe removal, deterministic test cases, and object references                    |
| Recursion                       | Blob Erase                                  | Stack-frame trace and base-case explanation                                      |
| Algorithms                      | Binary Search and Merge Sort                | Preconditions, pass-by-pass trace, and runtime comparison                        |

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
